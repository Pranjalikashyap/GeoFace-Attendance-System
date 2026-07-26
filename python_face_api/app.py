from flask import Flask, request, jsonify
import face_recognition
import numpy as np
import json

app = Flask(__name__)

# ---------- GET FACE ENCODING ----------
def get_face_encoding(file):

    img = face_recognition.load_image_file(file)

    # faster face detection
    face_locations = face_recognition.face_locations(img, model="hog")

    if len(face_locations) == 0:
        return None

    encodings = face_recognition.face_encodings(img, face_locations)

    if len(encodings) == 0:
        return None

    return encodings[0]


# ================= REGISTER FACE =================
@app.route("/register-face", methods=["POST"])
def register_face():

    if "image" not in request.files:
        return jsonify({"success": False, "message": "Image required"}), 400

    image = request.files["image"]

    encoding = get_face_encoding(image)

    if encoding is None:
        return jsonify({
            "success": False,
            "message": "No face detected"
        })

    return jsonify({
        "success": True,
        "encoding": encoding.tolist()
    })


# ================= MATCH FACE =================
@app.route("/match-face", methods=["POST"])
def match_face():

    if "image" not in request.files or "knownEncoding" not in request.form:
        return jsonify({
            "success": False,
            "message": "image & knownEncoding required"
        }), 400

    try:

        image = request.files["image"]

        known_encoding = np.array(
            json.loads(request.form["knownEncoding"])
        )

        encoding = get_face_encoding(image)

        if encoding is None:
            return jsonify({
                "success": False,
                "matched": False,
                "message": "No face detected"
            })

        # distance calculation
        distance = face_recognition.face_distance(
            [known_encoding],
            encoding
        )[0]

        print("Face Distance:", distance)

        # match threshold (changed from 0.5 to 0.6)
        matched = distance < 0.6

        return jsonify({
            "success": True,
            "matched": bool(matched),
            "distance": float(distance)
        })

    except Exception as e:

        print("Face match error:", str(e))

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# ================= RUN SERVER =================
if __name__ == "__main__":

    print("🚀 Face Recognition Server Running on port 5001")

    app.run(
        host="0.0.0.0",
        port=5001,
        debug=False
    )