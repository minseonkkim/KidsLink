# 임베딩 방식으로 개선이 안되는 것 같아서 멀티 프로세싱 활용(업로드, 비교) 동시에 작업
'''
{
    "status": "success",
    "data": [
        {
            "child": {
                "childId": 1,
                "name": "도하영",
                "kindergartenClassName": "햇살반",
                "kindergartenName": "햇살 유치원",
                "gender": "F",
                "birth": "2015-05-01",
                "profile": "https://kidslink-s3-c206.s3.ap-northeast-2.amazonaws.com/doha7.jpg",
                "childProfile": null
            },
            "count": 8,
            "images": [
                "http://localhost:8080/api/image/19f198a1-bc12-494f-8486-10644f49c400_doha1.jpg",
                "http://localhost:8080/api/image/f3bdc673-8b82-4a3d-b46e-fd94350a455a_doha2.jpg",
                "http://localhost:8080/api/image/0ba38a77-5da0-41fa-a8ca-42a9f6eee761_doha3.jpg",
                "http://localhost:8080/api/image/5ffeb3aa-3368-47ac-85e1-b100aae9ebd8_doha4.jpg",
                "http://localhost:8080/api/image/c0342cec-7b7c-401d-be1b-5ba663d39a2f_doha6.jpg",
                "http://localhost:8080/api/image/20f406ff-0ead-4640-b99f-25893b55685c_doha7.jpg",
                "http://localhost:8080/api/image/31a389a8-def8-4991-8cd1-6ff2584f3189_ero9.jpg",
                "http://localhost:8080/api/image/69185df8-403a-4e86-b30d-fd0945cc6884_ero11.jpg"
            ]
        },
        {
            "child": {
                "childId": 2,
                "name": "이로",
                "kindergartenClassName": "햇살반",
                "kindergartenName": "햇살 유치원",
                "gender": "F",
                "birth": "2016-08-15",
                "profile": "https://kidslink-s3-c206.s3.ap-northeast-2.amazonaws.com/ero2.jpg",
                "childProfile": null
            },
            "count": 6,
            "images": [
                "http://localhost:8080/api/image/5c843538-6103-41c5-94bf-b49eac3e85ff_ero2.jpg",
                "http://localhost:8080/api/image/f98e3964-0af3-43e1-9fcb-9b09d090bb69_ero3.jpg",
                "http://localhost:8080/api/image/5e43065a-ee84-463d-a3dd-cf149e3b2473_ero6.jpg",
                "http://localhost:8080/api/image/24b5ea31-41df-4cc8-ab7e-200213eed8c4_ero7.jpg",
                "http://localhost:8080/api/image/2c561205-12bf-4eba-ad01-c1d124b3394d_ero8.jpg",
                "http://localhost:8080/api/image/bc7686ee-525d-4d64-bde8-ae43eb24cbe4_ero10.jpg"
            ]
        },
        {
            "child": {
                "childId": 3,
                "name": "하오",
                "kindergartenClassName": "햇살반",
                "kindergartenName": "햇살 유치원",
                "gender": "M",
                "birth": "2014-11-20",
                "profile": "https://kidslink-s3-c206.s3.ap-northeast-2.amazonaws.com/hao8.jpg",
                "childProfile": null
            },
            "count": 7,
            "images": [
                "http://localhost:8080/api/image/e5dadfbe-291f-44da-9539-3fbe2100c8d2_hao1.jpg",
                "http://localhost:8080/api/image/ea52a645-8dd4-432b-b9a7-608ac7094698_hao2.jpg",
                "http://localhost:8080/api/image/2f4e1b4a-c5fa-4bcb-99c1-fa20349bfded_hao3.jpg",
                "http://localhost:8080/api/image/0fd639ba-51e9-4e45-8edb-4c2494b24430_hao5.jpg",
                "http://localhost:8080/api/image/1d47385d-193c-45da-baa4-1629398ba1d1_hao7.jpg",
                "http://localhost:8080/api/image/7831d59a-ba49-42b4-a5d2-d25fc6c7825d_hao8.jpg",
                "http://localhost:8080/api/image/cce8af87-1214-4731-90f4-c6bddce06d1f_hao9.jpg"
            ]
        },
        {
            "child": {
                "childId": 4,
                "name": "윌리엄",
                "kindergartenClassName": "햇살반",
                "kindergartenName": "햇살 유치원",
                "gender": "M",
                "birth": "2015-01-30",
                "profile": "https://kidslink-s3-c206.s3.ap-northeast-2.amazonaws.com/wiliam5.jpg",
                "childProfile": null
            },
            "count": 11,
            "images": [
                "http://localhost:8080/api/image/4a74f6ea-fc49-462a-bf6e-f79bdf3f1732_hao4.jpg",
                "http://localhost:8080/api/image/56da3a25-76e7-4b89-bf6d-7ea850196136_wiliam1.jpg",
                "http://localhost:8080/api/image/3cfd68d4-d563-41b3-b4f6-2a8c09631f88_wiliam2.jpg",
                "http://localhost:8080/api/image/ef8e2af6-715e-4a6f-b7a3-8c356172c729_wiliam3.jpg",
                "http://localhost:8080/api/image/55e516ea-3ce3-486a-8cc4-be49df6c92e6_wiliam4.jpg",
                "http://localhost:8080/api/image/c95add16-26c3-43b9-87a6-7dcddd054fd3_wiliam5.jpg",
                "http://localhost:8080/api/image/5e5a6597-fb3e-4984-b84c-1de862d00c25_wiliam6.jpg",
                "http://localhost:8080/api/image/877e8d1d-b226-4101-b66c-63d0072022d5_wiliam7.jpg",
                "http://localhost:8080/api/image/e60ea4ea-b8b4-4da3-9b3c-75faa0c88ccf_wiliam8.jpg",
                "http://localhost:8080/api/image/af791901-f1a0-4267-9a74-7926b33cc7b0_wiliam9.jpg",
                "http://localhost:8080/api/image/1d049173-da63-4298-b797-87b41e2ba2de_wiliam10.jpg"
            ]
        },
        {
            "child": null,
            "count": 5,
            "images": [
                "http://localhost:8080/api/image/25d46721-0238-4739-b679-82ee23455011_hao6.jpg",
                "http://localhost:8080/api/image/e2918668-8873-4d26-a5f0-01511b0cdfc4_doha5.jpg",
                "http://localhost:8080/api/image/cbeb17aa-a4ca-4e66-9aff-16c0c1fc7185_ero1.jpg",
                "http://localhost:8080/api/image/4eb8e190-c145-4a4d-ad0e-f4f68990c46f_ero4.jpg",
                "http://localhost:8080/api/image/ab35e570-e4b0-452b-b53f-2d1b96ebdbd9_ero5.jpg"
            ]
        }
    ],
    "message": "앨범을 성공적으로 분류하였습니다.",
    "error": null
}
'''
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
    image = load_image_from_url(image_url)
    if image is None:
        print(f"Skipping image due to load failure: {image_url}")
        return {
            'best_match_reference': None,
            'classify_image_path': image_url,
            'verified': False
        }
    try:
        face_locations = face_recognition.face_locations(image)
        face_encodings = face_recognition.face_encodings(image, face_locations)

        if len(face_encodings) == 0:
            print(f"No faces found in classify image: {image_url}")
            return {
                'best_match_reference': None,
                'classify_image_path': image_url,
                'verified': False
            }

        for face_encoding in face_encodings:
            face_embedding = np.array(face_encoding).reshape(1, -1)
            similarities = cosine_similarity(face_embedding, known_face_embeddings)
            best_match_index = np.argmax(similarities)

            if similarities[0][best_match_index] > 0.6:  # Threshold can be adjusted
                best_match_label = known_face_labels[best_match_index]
                return {
                    'best_match_reference': best_match_label,
                    'classify_image_path': image_url,
                    'verified': True
                }
            else:
                return {
                    'best_match_reference': None,
                    'classify_image_path': image_url,
                    'verified': False
                }
    except Exception as e:
        print(f"Error processing classify image {image_url}: {e}")
        return {
            'best_match_reference': None,
            'classify_image_path': image_url,
            'verified': False
        }


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
    print(f"reference image: {reference}")
    print(f"classify image: {classify}")
    known_face_encodings = load_reference_images(reference)
    known_face_labels = list(known_face_encodings.keys())
    known_face_embeddings = np.array(list(known_face_encodings.values()))

    with Pool(cpu_count()) as p:
        results = p.starmap(process_image, [(item, known_face_labels, known_face_embeddings) for item in classify])

    return jsonify(results)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
