import os
from flask import Flask, render_template, request, jsonify
import pandas as pd
import pickle

app = Flask(__name__)

# Load the trained model and dataset
with open('svd_model.pkl', 'rb') as f:
    svd = pickle.load(f)

movies_df = pd.read_csv("movies.csv")

@app.route('/')
def home():
    # Get a list of popular movies (e.g., top-rated or most-rated)
    popular_movies = movies_df.sample(10)  # Random sample for now
    movies = popular_movies[['movieId', 'title']].to_dict(orient='records')
    return render_template('index.html', movies=movies)


@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.get_json()
    user_id = int(data.get("userId"))
    movie_ratings = data.get("movieRatings", "")

    # Process user inputs
    if movie_ratings:
        for rating in movie_ratings.split(","):
            movie_id, user_rating = map(float, rating.split(":"))
            # Add logic for saving user ratings if necessary

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

if __name__ == '__main__':
    # Use Render's PORT environment variable in production
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
