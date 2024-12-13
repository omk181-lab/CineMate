from flask import Flask, render_template, request, jsonify
import pandas as pd
import pickle

app = Flask(__name__)

# Load the dataset and model
movies_df = pd.read_csv("movies.csv")
with open("svd_model_13_dec_2024.pkl", "rb") as f:
    svd = pickle.load(f)

@app.route("/")
def home():
    popular_movies = movies_df.sample(20).to_dict(orient="records")
    return render_template("index.html", movies=popular_movies)

@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.get_json()
    ratings = data["ratings"]
    recommendations = []

    for rating in ratings:
        liked_movie = movies_df[movies_df["movieId"] == int(rating["movieId"])].iloc[0]
        if int(rating["rating"]) >= 3:  # Only consider ratings of 3 and 4
            recommended_ids = movies_df["movieId"].sample(5).tolist()
            recommended_movies = movies_df[movies_df["movieId"].isin(recommended_ids)]["title"].tolist()
            recommendations.append({"likedMovie": liked_movie["title"], "likedRating": rating["rating"], "recommendedMovies": recommended_movies})

    return jsonify({"recommendations": recommendations})

@app.route("/recommend-genres", methods=["POST"])
def recommend_genres():
    data = request.get_json()
    genres = data.get("genres", [])
    year_min = int(data.get("yearMin", 0))
    year_max = int(data.get("yearMax", 9999))
    rating_min = float(data.get("ratingMin", 0))
    rating_max = float(data.get("ratingMax", 5))

    # Ensure genres are properly split and checked
    filtered_movies = movies_df[
        (movies_df["genres"].apply(lambda x: any(genre in x.split('|') for genre in genres))) &
        (movies_df["release_year"] >= year_min) &
        (movies_df["release_year"] <= year_max) &
        (movies_df["rating"] >= rating_min) &
        (movies_df["rating"] <= rating_max)
    ]

    if not filtered_movies.empty:
        recommendations = filtered_movies.sort_values(by="rating", ascending=False).head(10)
        recommendations_list = recommendations.to_dict(orient="records")  # Return detailed information
    else:
        recommendations_list = []

    return jsonify({"recommendations": recommendations_list})
    
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
