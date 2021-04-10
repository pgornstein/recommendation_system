import psycopg2
import pandas as pd
from .preprocessing import generate_correlation
from .imdb import get_movie_info
from random import randint
from .config import config_db
from .interact_db import get_session_user
from .misc import title_reformat

params = config_db()
connection = psycopg2.connect(**params)
cursor = connection.cursor()

def fetch_similar(token, unformatted_title):
    userid = get_session_user(token)
    similar_movies = generate_correlation(connection, unformatted_title)
    movies_queue = []
    for movie in similar_movies:
        if len(movies_queue) >= 10:
            break
        if movie == unformatted_title:
            continue
        command = """SELECT * 
                     FROM ratings r
                     INNER JOIN movies m
                     ON r.movieid = m.movieid
                     WHERE r.userid = %s
                     AND m.title = %s
                     ;"""
        values = (userid, movie)
        cursor.execute(command, values)
        result = cursor.fetchone()
        if result is None:
            movies_queue.append(movie)
    if len(movies_queue) < 10:
        similar_movies = generate_correlation(connection, unformatted_title, False) #unpopular movies
        for movie in similar_movies:
            if len(movies_queue) >= 10:
                break
            if movie == unformatted_title:
                continue
            command = """SELECT * 
                        FROM ratings r
                        INNER JOIN movies m
                        ON r.movieid = m.movieid
                        WHERE r.userid = %s
                        AND m.title = %s
                        ;"""
            values = (userid, movie)
            cursor.execute(command, values)
            result = cursor.fetchone()
            if result is None:
                movies_queue.append(movie)
    return movies_queue

def fetch_new(token, discard_queue):
    userid = get_session_user(token)
    command = f"SELECT genre FROM user_genres WHERE userid = {userid};"
    cursor.execute(command)
    results = cursor.fetchall()
    genres = []
    for result in results:
        genres.append(result[0])
    movies_queue = []
    while len(movies_queue) < 10:
        random_selection = genres[randint(0, len(genres) - 1)]
        genre_string = '%' + random_selection + '%'
        if not discard_queue:
            command = """SELECT m.title, COUNT(*)
                        FROM movies m
                        INNER JOIN ratings r 
                        ON m.movieid = r.movieid
                        WHERE m.genres like %s
                        AND r.userid != %s
                        GROUP BY m.title
                        ORDER BY 2 DESC;"""                
            values = (genre_string, userid)
        else:
            command = """SELECT m.title, COUNT(*)
                        FROM movies m
                        INNER JOIN ratings r 
                        ON m.movieid = r.movieid
                        WHERE m.genres like %s
                        AND r.userid != %s
                        AND m.title NOT IN %s
                        GROUP BY m.title
                        ORDER BY 2 DESC;"""
            discard_queue = tuple(discard_queue)                
            values = (genre_string, userid, discard_queue)
        cursor.execute(command, values)
        new_movies = cursor.fetchmany(10)
        for movie in new_movies:
            command = f"SELECT * FROM user_saved_movies where userid={userid} and title='{movie[0]}'"
            cursor.execute(command)
            result = cursor.fetchone()
            if result is None:
                movies_queue.append(movie[0])
    return movies_queue

def supply_movies_data(movies_queue):
    movies_data = []
    for movie in movies_queue:
        formatted_title = title_reformat(movie)
        data = get_movie_info(formatted_title)
        if data is not None:
            data["unformattedTitle"] = movie
            movies_data.append(data)
    return movies_data

def fetch_rated(token):
    userid = get_session_user(token)
    command = """SELECT m.title, r.rating
               FROM movies m
               INNER JOIN ratings r
               ON m.movieid = r.movieid
               WHERE r.userid = %s"""
    values = (userid,)
    cursor.execute(command, values)
    rated_movies = cursor.fetchall() 
    return rated_movies 

def supply_rated_data(rated_movies):
    rated_data = []
    for film in rated_movies:
        rated_movie = {}
        rated_movie['rating'] = film[1]
        formatted_title = title_reformat(film[0])
        data = get_movie_info(formatted_title)
        rated_movie['title'] = data['title']['title']
        rated_movie['imageURL'] = data['title']['image']['url']
        rated_data.append(rated_movie)
    return rated_data