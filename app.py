from flask import Flask, request, jsonify, render_template
import pickle
import os
import pandas as pd

# Initialize Flask app
app = Flask(__name__)

# Load the trained SVD model
MODEL_PATH = "svd_model.pkl"
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(f"Model file '{MODEL_PATH}' not found.")

with open(MODEL_PATH, "rb") as f:
    model = pickle.load(f)

# Load movies and ratings datasets
MOVIES_PATH = "movies.csv"
RATINGS_PATH = "ratings.csv"

movies = pd.read_csv(MOVIES_PATH)
ratings = pd.read_csv(RATINGS_PATH)

# Add average ratings to the movies DataFrame
avg_ratings = ratings.groupby("movieId")["rating"].mean().reset_index()
avg_ratings.rename(columns={"rating": "avg_rating"}, inplace=True)
movies = movies.merge(avg_ratings, on="movieId", how="left")
movies["avg_rating"].fillna(0, inplace=True)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/recommend", methods=["GET"])
def recommend():
    try:
        user_id = int(request.args.get("user_id"))

        # Predict ratings for all movies
        recommendations = []
        for movie_id in movies["movieId"]:
            pred = model.predict(user_id, movie_id)
            recommendations.append((movie_id, pred.est))

        # Sort recommendations by predicted rating
        recommendations = sorted(recommendations, key=lambda x: x[1], reverse=True)[:10]

        # Retrieve movie details for recommendations
        recommended_movies = movies[movies["movieId"].isin([r[0] for r in recommendations])]
        response = recommended_movies[["movieId", "title", "genres", "avg_rating"]].to_dict(orient="records")

        return jsonify(response)
    except Exception as e:
        return jsonify({"error": str(e)}), 400


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
