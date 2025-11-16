from flask import Flask, jsonify, request
from model_main import MovieBookRecommender

app = Flask(__name__)

# API keys
TMDB_API_KEY = "c98f2a7c2dc82159bf77cd6393d27cc7"
GOOGLE_BOOKS_API_KEY = "AIzaSyC0her-oLMzwyZgJ7cUtbqhpYJgDR__Wq4"

recommender = MovieBookRecommender(TMDB_API_KEY, GOOGLE_BOOKS_API_KEY)

@app.route("/", methods=["GET"])
def health_check():
    return jsonify({
        "status": "ok",
        "message": "API is running"
    }), 200
    
@app.route("/recommend/<film>", methods=["GET"])
def recommend_books(film):
    results = recommender.generateRecommendation(film, top_n=8)
    
    return jsonify(results)

if __name__ == "__main__":
    app.run(debug=True, port=8000)