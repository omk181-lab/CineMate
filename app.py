from flask import Flask, request, jsonify
import pickle
import os
port = int(os.environ.get('PORT', 5000))
app.run(host='0.0.0.0', port=port)
app = Flask(__name__)

# Load the trained model
MODEL_PATH = 'svd_model.pkl'
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model file '{MODEL_PATH}' not found. Ensure the model is trained and saved.")

with open(MODEL_PATH, 'rb') as f:
    model = pickle.load(f)

@app.route("/")
def home():
    return "<h1>Movie Recommendation System</h1><p>Welcome to the Movie Recommendation System API!</p>"

@app.route("/predict", methods=["GET"])
def predict():
    """
    API endpoint for predicting movie ratings.
    Expects 'user_id' and 'movie_id' as query parameters.
    """
    try:
        # Get user_id and movie_id from the query parameters
        user_id = int(request.args.get("user_id"))
        movie_id = int(request.args.get("movie_id"))

        # Predict the rating
        prediction = model.predict(user_id, movie_id)

        # Return the predicted rating
        return jsonify({
            "user_id": user_id,
            "movie_id": movie_id,
            "predicted_rating": round(prediction.est, 2)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    print("Starting Flask Application...")
    app.run(debug=True)
