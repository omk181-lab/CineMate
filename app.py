from flask import Flask, render_template, request, jsonify
import pandas as pd
import pickle

app = Flask(__name__)

# Load the trained model and datasets
with open('svd_model.pkl', 'rb') as f:
    svd = pickle.load(f)

movies_df = pd.read_csv("movies.csv")

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.get_json()
    user_id = int(data.get("userId"))
    movie_ratings = data.get("movieRatings", "")

    # Process user inputs
    if movie_ratings:
        for rating in movie_ratings.split(","):
            movie_id, user_rating = map(float, rating.split(":"))
            # Add new user ratings logic if needed

    # Generate recommendations
    all_movie_ids = movies_df['movieId'].unique()
    predictions = [
        (movie_id, svd.predict(user_id, movie_id).est)
        for movie_id in all_movie_ids
    ]
    top_movies = sorted(predictions, key=lambda x: x[1], reverse=True)[:10]
    recommended_titles = [
        movies_df[movies_df['movieId'] == movie_id]['title'].values[0]
        for movie_id, _ in top_movies
    ]

    return jsonify({"recommendations": recommended_titles})
