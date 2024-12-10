from flask import Flask, request, jsonify
import pandas as pd
import pickle

app = Flask(__name__)

# Load the trained SVD model and movie data
with open('svd_model_10_dec.pkl', 'rb') as f:
    svd = pickle.load(f)

movies_df = pd.read_csv("movies.csv")

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.json
    user_id = int(data.get("userId"))
    movie_ratings = data.get("movieRatings", "")
    
    # Parse user ratings input
    if movie_ratings:
        for rating in movie_ratings.split(","):
            movie_id, user_rating = map(float, rating.split(":"))
            # Optionally, integrate new user ratings into the system (skipped here for simplicity)
    
    # Generate top-N recommendations
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
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True)
