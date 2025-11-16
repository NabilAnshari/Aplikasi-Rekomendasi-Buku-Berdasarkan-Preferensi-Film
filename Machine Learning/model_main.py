# %%
import requests
import pandas as pd
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

nltk.download('stopwords')
nltk.download('wordnet')


class MovieBookRecommender:
    def __init__(self, tmdb_api_key, google_books_api_key):
        self.tmdb_api_key = tmdb_api_key
        self.google_books_api_key = google_books_api_key
        self.stop_words = set(stopwords.words('english'))
        self.lemmatizer = WordNetLemmatizer()

    def _clean_text(self, text):
        text = str(text).lower()
        text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
        text = re.sub(r'\s+', ' ', text).strip()
        tokens = text.split()
        tokens = [word for word in tokens if word not in self.stop_words]
        tokens = [self.lemmatizer.lemmatize(word) for word in tokens]
        return ' '.join(tokens)

    def getFilmDesc(self, query):
        try:
            url = f"https://api.themoviedb.org/3/search/movie?api_key={self.tmdb_api_key}&query={query}"
            response = requests.get(url).json()
            if not response.get('results'):
                return None

            movie = response['results'][0]
            title = movie['title']
            overview = movie.get('overview', '')
            genre_ids = movie.get('genre_ids', [])

            genre_url = f"https://api.themoviedb.org/3/genre/movie/list?api_key={self.tmdb_api_key}&language=en-US"
            genres_response = requests.get(genre_url).json()
            genres_dict = {g['id']: g['name'] for g in genres_response.get('genres', [])}
            genre_names = [genres_dict.get(gid, '') for gid in genre_ids]

            combined_text = f"{title} {' '.join(genre_names)} {overview}"
            return {'title': title, 'combined_text': combined_text}

        except Exception as e:
            print(f" Error mengambil data film: {e}")
            return None

    def getBookDesc(self, query, total_results=100):
        try:
            books = []
            max_per_request = 40

            for start_index in range(0, total_results, max_per_request):
                url = (
                    f"https://www.googleapis.com/books/v1/volumes?q={query}"
                    f"&startIndex={start_index}&maxResults={max_per_request}"
                    f"&key={self.google_books_api_key}"
                )
                response = requests.get(url).json()

                for item in response.get('items', []):
                    book_id = item.get('id', '')
                    info = item.get('volumeInfo', {})
                    title = info.get('title', '')
                    authors = ' '.join(info.get('authors', [])) if 'authors' in info else ''
                    desc = info.get('description', '')
                    categories = ' '.join(info.get('categories', [])) if 'categories' in info else ''
                    combined_text = f"{authors} {categories} {desc}"
                    books.append({'title': title, 'id': book_id, 'combined_text': combined_text})

            unique_books = {book['title']: book for book in books}
            return list(unique_books.values())[:total_results]

        except Exception as e:
            print(f" Error mengambil data buku: {e}")
            return []


    def calculateSimilarity(self, combined_df):
        combined_df['cleaned'] = combined_df['combined_text'].apply(self._clean_text)
        tfidf = TfidfVectorizer(max_features=1000)
        tfidf_matrix = tfidf.fit_transform(combined_df['cleaned'])
        cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
        return cosine_sim

    def generateRecommendation(self, film_title, top_n=8):
        movie_data = self.getFilmDesc(film_title)
        if not movie_data:
            return {"error": f"Film '{film_title}' tidak ditemukan."}

        books_data = self.getBookDesc(film_title, total_results=100)
        if not books_data:
            return {"error": f"Buku untuk film '{film_title}' tidak ditemukan."}

        movie_df = pd.DataFrame([movie_data])
        movie_df['type'] = 'movie'
        books_df = pd.DataFrame(books_data)
        books_df['type'] = 'book'
        combined_df = pd.concat([movie_df, books_df], ignore_index=True)

        cosine_sim = self.calculateSimilarity(combined_df)

        movie_idx = combined_df[combined_df['type'] == 'movie'].index[0]
        sim_scores = list(enumerate(cosine_sim[movie_idx]))
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

        book_recs = []
        for i, score in sim_scores:
            if combined_df.iloc[i]['type'] == 'book':
                book_recs.append({
                    "title": combined_df.iloc[i]['title'],
                    "id": combined_df.iloc[i]['id'],
                    "similarity_score": float(score)
                })
            if len(book_recs) >= top_n:
                break

        return {
            "film": movie_data['title'],
            "recommendations": book_recs
        }



if __name__ == "__main__":

    TMDB_API_KEY = "c98f2a7c2dc82159bf77cd6393d27cc7"
    GOOGLE_BOOKS_API_KEY = "AIzaSyC0her-oLMzwyZgJ7cUtbqhpYJgDR__Wq4"

    recommender = MovieBookRecommender(TMDB_API_KEY, GOOGLE_BOOKS_API_KEY)

    film = "The Lord of the Rings"
    results = recommender.generateRecommendation(film, top_n=8)

    if "error" in results:
        print(results["error"])
    else:
        print(f"\ Rekomendasi Buku untuk Film: {results['film']}\n")
        for idx, rec in enumerate(results['recommendations'], start=1):
            title = rec.get("title", "Tidak ada judul")
            book_id = rec.get("id", "Tidak ada ID")
            score = rec.get("similarity_score", 0)
            print(f"{idx}. {title} (ID: {book_id}) | Similarity: {score:.4f}")
