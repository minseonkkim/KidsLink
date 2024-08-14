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
from concurrent.futures import ThreadPoolExecutor, as_completed

app = Flask(__name__)

# 로깅 설정
logging.basicConfig(level=logging.INFO)

process_executor = ProcessPoolExecutor(max_workers=2)

# def log_memory_usage():
#     process = psutil.Process()
#     memory_info = process.memory_info()
#     logging.info(f"Memory usage: {memory_info.rss / 1024 ** 2:.2f} MB")

def load_image_from_url(url):
    try:
        logging.info(f"[로드 시작] 이미지 URL 로드 시작: {url}")
        start_time = time.time()

        resp = urllib.request.urlopen(url)
        image = np.asarray(bytearray(resp.read()), dtype="uint8")
        image = cv2.imdecode(image, cv2.IMREAD_COLOR)

        end_time = time.time()
        logging.info(f"[로드 완료] 이미지 URL 로드 완료: {url} (소요 시간: {end_time - start_time:.2f} 초)")

        if image is None:
            raise ValueError(f"Could not decode image from URL: {url}")
        return image
    except Exception as e:
        logging.error(f"[로드 실패] 이미지 로드 오류: {url}, 오류: {e}")
        # logging.error(f"Error loading image from {url}: {e}")
        # logging.error(traceback.format_exc())
        return None

def process_image(item, known_face_labels, known_face_embeddings_list):
    try:
        logging.info(f"[이미지 처리 시작] 이미지 처리 시작: {item['imageId']} (URL: {item['path']})")
        start_time = time.time()

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


        # logging.info(f"[얼굴 위치 탐지] 이미지에서 얼굴 위치 탐지 중: {image_id}")
        # logging.info(f"Finding face locations for image: {image_id}")
        face_locations = face_recognition.face_locations(image)
        # logging.info(f"Found {len(face_locations)} face(s) in image: {image_id}")
        face_encodings = face_recognition.face_encodings(image, face_locations)

        if len(face_encodings) == 0:
            # logging.info(f"[얼굴 없음] 얼굴이 발견되지 않음: {image_id}")
            return [{
                'best_match_reference': None,
                'classify_image_id': image_id,
                'classify_image_path': image_url,
                'verified': False
            }]

        # logging.info(f"[유사도 계산 시작] 유사도 계산 시작: {image_id}")
        # known_face_embeddings_list를 numpy 배열로 변환
        known_face_embeddings = np.array(known_face_embeddings_list)
        face_embeddings = np.array(face_encodings)  # 분류 대상 이미지의 얼굴 임베딩 벡터

        # 임베딩 벡터들 간의 유사도 계산
        similarities = cosine_similarity(face_embeddings, known_face_embeddings)

        # 유사도가 가장 높은 기준 이미지 선택
        best_match_indices = np.argmax(similarities, axis=1)

        image_results = []
        for idx, best_match_index in enumerate(best_match_indices):
            if similarities[idx][best_match_index] > 0.6:  # Threshold can be adjusted
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
        end_time = time.time()
        logging.info(f"[이미지 처리 완료] 이미지 처리 완료: {image_id} (소요 시간: {end_time - start_time:.2f} 초)")

            # 자원 해제
        del image, face_locations, face_encodings, known_face_embeddings, face_embeddings, similarities
        gc.collect()

        return image_results
    except Exception as e:
        logging.error(f"[이미지 처리 오류] 이미지 처리 중 오류 발생: {item['imageId']} (URL: {item['path']}), 오류: {e}")
        return [{
            'best_match_reference': None,
            'classify_image_id': item['imageId'],
            'classify_image_path': item['path'],
            'verified': False
        }]

def encode_face(image, label):
    try:
        face_encodings = face_recognition.face_encodings(image)
        if len(face_encodings) > 0:
            return label, face_encodings[0]
    except Exception as e:
        logging.error(f"[얼굴 인코딩 오류] {label} 인코딩 중 오류 발생: {e}")
    return None, None

def load_reference_images(reference):
    logging.info(f"[참조 이미지 로드 시작] 참조 이미지 로드 시작")
    start_time = time.time()
    known_face_encodings = {}

    with ThreadPoolExecutor(max_workers=4) as executor:
        futures = {executor.submit(load_image_from_url, item['referenceImage']): item for item in reference}

        for future in as_completed(futures):
            item = futures[future]
            label = item['label']
            image = future.result()

            if image is not None:
                encoding_future = executor.submit(encode_face, image, label)
                label, encoding = encoding_future.result()

                if label is not None and encoding is not None:
                    known_face_encodings[label] = encoding

    end_time = time.time()
    logging.info(f"[참조 이미지 로드 완료] 참조 이미지 로드 완료 (총 소요 시간: {end_time - start_time:.2f} 초)")

    return known_face_encodings

def handle_task(item, known_face_labels, known_face_embeddings_list):
    return process_image(item, known_face_labels, known_face_embeddings_list)

@app.route('/classify', methods=['POST'])
def classify_images():
    try:
        logging.info("[분류 요청 시작] 이미지 분류 요청 시작")
        start_time = time.time()

        data = request.get_json()
        reference = data['reference']
        classify = data['classify']

        logging.info("Loading reference images")
        known_face_encodings = load_reference_images(reference)
        known_face_labels = list(known_face_encodings.keys())
        known_face_embeddings = np.array(list(known_face_encodings.values()))

        # 병렬 처리로 각 이미지에 대한 처리 진행
        futures = [process_executor.submit(handle_task, item, known_face_labels, known_face_embeddings) for item in
                   classify]

        results = []
        for future in futures:
            try:
                result = future.result()
                if isinstance(result, list):
                    results.extend(result)
                else:
                    results.append(result)
            except Exception as e:
                logging.error(f"[작업 처리 오류] 이미지 처리 작업 중 오류 발생: {e}")

        end_time = time.time()
        logging.info(f"[분류 요청 완료] 이미지 분류 완료 (총 소요 시간: {end_time - start_time:.2f} 초)")

        # log_memory_usage()

        return jsonify(results)
    except Exception as e:
        logging.error(f"[분류 요청 오류] 이미지 분류 요청 처리 중 오류 발생: {e}")
        # logging.error(f"Error in classify_images: {e}")
        # logging.error(traceback.format_exc())
        return jsonify({"error": "An error occurred while processing the images"}), 500

if __name__ == '__main__':
    from waitress import serve
    serve(app, host='0.0.0.0', port=5000, threads=4)
