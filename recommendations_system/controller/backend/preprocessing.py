import pandas as pd
import psycopg2
import json
from .config import config_db

params = config_db()
connection = psycopg2.connect(**params)
cursor = connection.cursor()

def generate_correlation(database, title, popularity_flag=True):
    ratings_data = pd.read_sql_query("SELECT * FROM ratings", database)
    movie_names = pd.read_sql_query("SELECT * FROM movies", database)
    movie_data = pd.merge(ratings_data, movie_names, on='movieid')

    ratings_mean_count = pd.DataFrame(movie_data.groupby('title')['rating'].mean())
    ratings_mean_count['rating_counts'] = pd.DataFrame(movie_data.groupby('title')['rating'].count())

    user_movie_rating = movie_data.pivot_table(index='userid', columns='title', values='rating')

    ratings_for_title = user_movie_rating[title]

    movies_like_title = user_movie_rating.corrwith(ratings_for_title)
    correlation = pd.DataFrame(movies_like_title, columns=['Correlation'])
    correlation.dropna(inplace=True)
    correlation = correlation.join(ratings_mean_count['rating_counts'])
    if popularity_flag == True:
        movies_json = correlation[correlation['rating_counts']>=50].sort_values('Correlation', ascending=False).to_json()
    else:
        movies_json = correlation[correlation['rating_counts']<50].sort_values('Correlation', ascending=False).to_json()
    recommended_movies = json.loads(movies_json)
    recommended_movies = recommended_movies['Correlation'].keys()
    return recommended_movies

if __name__ == "__main__":
    print(generate_correlation(connection, "Harry Potter and the Prisoner of Azkaban (2004)"))