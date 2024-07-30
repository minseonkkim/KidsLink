from flask import Flask, request, jsonify
import face_recognition
import numpy as np
import cv2
import urllib.request
from sklearn.metrics.pairwise import cosine_similarity
from multiprocessing import Pool, cpu_count

app = Flask(__name__)

def load_image_from_url(url):
    try:
        resp = urllib.request.urlopen(url)
        image = np.asarray(bytearray(resp.read()), dtype="uint8")
        image = cv2.imdecode(image, cv2.IMREAD_COLOR)
        if image is None:
            raise ValueError(f"Could not decode image from URL: {url}")
        return image
    except Exception as e:
        print(f"Error loading image from {url}: {e}")
        return None

def process_image(item, known_face_labels, known_face_embeddings):
    image_url = item['path']
    image_id = item['imageId']
    image = load_image_from_url(image_url)
    if image is None:
        print(f"Skipping image due to load failure: {image_url}")
        return [{
            'best_match_reference': None,
            'classify_image_id': image_id,
            'classify_image_path': image_url,
            'verified': False
        }]

    try:
        face_locations = face_recognition.face_locations(image)
        face_encodings = face_recognition.face_encodings(image, face_locations)

        if len(face_encodings) == 0:
            print(f"No faces found in classify image: {image_url}")
            return [{
                'best_match_reference': None,
                'classify_image_id': image_id,
                'classify_image_path': image_url,
                'verified': False
            }]

        image_results = []
        for face_encoding in face_encodings:
            face_embedding = np.array(face_encoding).reshape(1, -1)
            similarities = cosine_similarity(face_embedding, known_face_embeddings)
            best_match_index = np.argmax(similarities)

            if similarities[0][best_match_index] > 0.6:  # Threshold can be adjusted
                best_match_label = known_face_labels[best_match_index]
                image_results.append({
                    'best_match_reference': best_match_label,
                    'classify_image_id': image_id,
                    'classify_image_path': image_url,
                    'verified': True
                })
            else:
                image_results.append({
                    'best_match_reference': None,
                    'classify_image_id': image_id,
                    'classify_image_path': image_url,
                    'verified': False
                })
        return image_results
    except Exception as e:
        print(f"Error processing classify image {image_url}: {e}")
        return [{
            'best_match_reference': None,
            'classify_image_id': image_id,
            'classify_image_path': image_url,
            'verified': False
        }]

def load_reference_images(reference):
    known_face_encodings = {}
    for item in reference:
        label = item['label']
        reference_image_url = item['referenceImage']
        image = load_image_from_url(reference_image_url)
        if image is None:
            continue
        try:
            face_encodings = face_recognition.face_encodings(image)
            if len(face_encodings) > 0:
                face_encoding = face_encodings[0]
                known_face_encodings[label] = face_encoding
            else:
                print(f"No faces found in reference image: {reference_image_url}")
        except Exception as e:
            print(f"Error processing reference image {reference_image_url}: {e}")
    return known_face_encodings

@app.route('/classify', methods=['POST'])
def classify_images():
    data = request.get_json()
    reference = data['reference']
    classify = data['classify']

    known_face_encodings = load_reference_images(reference)
    known_face_labels = list(known_face_encodings.keys())
    known_face_embeddings = np.array(list(known_face_encodings.values()))

    with Pool(cpu_count()) as p:
        results = p.starmap(process_image, [(item, known_face_labels, known_face_embeddings) for item in classify])

    # Flatten the results list
    flattened_results = [item for sublist in results for item in sublist]
    return jsonify(flattened_results)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
