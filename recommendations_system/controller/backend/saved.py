import psycopg2
from .config import config_db
from .interact_db import get_session_user
import json

params = config_db()
connection = psycopg2.connect(**params)
cursor = connection.cursor()

def add_to_saved_movies(token, movie):
    userid = get_session_user(token)
    unformatted_title = movie['unformattedTitle']
    movie = json.dumps(movie)
    command = "INSERT INTO user_saved_movies VALUES (%s, %s, %s);"
    cursor.execute(command, (userid, unformatted_title, movie))
    connection.commit()

def get_saved_movies(token):
    userid = get_session_user(token)
    command = f"SELECT saved_movie FROM user_saved_movies WHERE userid = {userid};"
    cursor.execute(command)
    result = cursor.fetchall()
    movies = []
    for item in result:
        movies.append(item[0])
    return result

def unsave_movie(token, movie_title):
    userid = get_session_user(token)
    command = f"DELETE FROM user_saved_movies WHERE userid = {userid} and title = '{movie_title}'"
    cursor.execute(command)
    connection.commit()