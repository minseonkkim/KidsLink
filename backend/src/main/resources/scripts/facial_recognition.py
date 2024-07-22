from deepface import DeepFace
import sys
import json

def recognize_faces(image_paths):
    results = []
    for path in image_paths:
        result = DeepFace.find(img_path=path, db_path="path/to/database")
        if len(result) > 0:
            person_name = result['identity'].values[0].split('/')[-2]  # Assuming the folder name is the person's name
            results.append({"image": path, "person": person_name})
        else:
            results.append({"image": path, "person": "Unknown"})
    return results

if __name__ == "__main__":
    image_paths = sys.argv[1:]
    results = recognize_faces(image_paths)
    print(json.dumps(results))
