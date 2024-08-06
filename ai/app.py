from flask import Flask, request, jsonify
import face_recognition
import numpy as np
import cv2
import urllib.request
from sklearn.metrics.pairwise import cosine_similarity
from concurrent.futures import ProcessPoolExecutor
import gc
import logging
import time

app = Flask(__name__)

# 로깅 설정
logging.basicConfig(level=logging.INFO)

process_executor = ProcessPoolExecutor(max_workers=4)

# def log_memory_usage():
#     process = psutil.Process()
#     memory_info = process.memory_info()
#     logging.info(f"Memory usage: {memory_info.rss / 1024 ** 2:.2f} MB")

def load_image_from_url(url):
    try:
        # logging.info(f"Loading image from URL: {url}")
        resp = urllib.request.urlopen(url)
        image = np.asarray(bytearray(resp.read()), dtype="uint8")
        image = cv2.imdecode(image, cv2.IMREAD_COLOR)
        if image is None:
            raise ValueError(f"Could not decode image from URL: {url}")
        return image
    except Exception as e:
        # logging.error(f"Error loading image from {url}: {e}")
        # logging.error(traceback.format_exc())
        return None

def process_image(item, known_face_labels, known_face_embeddings_list):
    try:
        # logging.info(f"Processing image: {item['imageId']} from URL: {item['path']}")
        image_url = item['path']
        image_id = item['imageId']
        image = load_image_from_url(image_url)
        if image is None:
            return [{
                'best_match_reference': None,
                'classify_image_id': image_id,
                'classify_image_path': image_url,
                'verified': False
            }]

        # logging.info(f"Finding face locations for image: {image_id}")
        face_locations = face_recognition.face_locations(image)
        # logging.info(f"Found {len(face_locations)} face(s) in image: {image_id}")
        face_encodings = face_recognition.face_encodings(image, face_locations)

        if len(face_encodings) == 0:
            # logging.info(f"No faces found in image: {image_id}")
            return [{
                'best_match_reference': None,
                'classify_image_id': image_id,
                'classify_image_path': image_url,
                'verified': False
            }]

        known_face_embeddings = np.array(known_face_embeddings_list)
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

        # 자원 해제
        del image, face_locations, face_encodings, known_face_embeddings, face_embedding, similarities
        gc.collect()

        return image_results
    except Exception as e:
        # logging.error(f"Error processing image {item['imageId']} from URL {item['path']}: {e}")
        # logging.error(traceback.format_exc())
        return [{
            'best_match_reference': None,
            'classify_image_id': item['imageId'],
            'classify_image_path': item['path'],
            'verified': False
        }]

def load_reference_images(reference):
    known_face_encodings = {}
    for item in reference:
        try:
            label = item['label']
            reference_image_url = item['referenceImage']
            image = load_image_from_url(reference_image_url)
            if image is None:
                continue
            face_encodings = face_recognition.face_encodings(image)
            if len(face_encodings) > 0:
                face_encoding = face_encodings[0]
                known_face_encodings[label] = face_encoding
        except Exception as e:
            # logging.error(f"Error processing reference image {item['referenceImage']}: {e}")
            # logging.error(traceback.format_exc())
            pass
    return known_face_encodings

def handle_task(item, known_face_labels, known_face_embeddings_list):
    return process_image(item, known_face_labels, known_face_embeddings_list)

@app.route('/classify', methods=['POST'])
def classify_images():
    try:
        start_time = time.time()
        data = request.get_json()
        reference = data['reference']
        classify = data['classify']

        logging.info("Loading reference images")
        known_face_encodings = load_reference_images(reference)
        known_face_labels = list(known_face_encodings.keys())
        known_face_embeddings = np.array(list(known_face_encodings.values()))
        known_face_embeddings_list = [embedding.tolist() for embedding in known_face_embeddings]

        tasks = [(item, known_face_labels, known_face_embeddings_list) for item in classify]

        futures = [process_executor.submit(handle_task, item, known_face_labels, known_face_embeddings_list) for item in classify]

        results = []
        for future in futures:
            try:
                result = future.result()
                if isinstance(result, list):
                    results.extend(result)
                else:
                    results.append(result)
            except Exception as e:
                # logging.error(f"Error processing task: {e}")
                # logging.error(traceback.format_exc())
                pass

        # logging.info(f"Processing complete. Results: {results}")

        end_time = time.time()
        # logging.info(f"Processing time: {end_time - start_time} seconds")
        # log_memory_usage()

        return jsonify(results)
    except Exception as e:
        # logging.error(f"Error in classify_images: {e}")
        # logging.error(traceback.format_exc())
        return jsonify({"error": "An error occurred while processing the images"}), 500

if __name__ == '__main__':
    from waitress import serve
    serve(app, host='0.0.0.0', port=5000, threads=4)
