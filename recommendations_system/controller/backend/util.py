import psycopg2
import pandas as pd
from .preprocessing import generate_correlation
from .imdb import get_movie_info
from .hash import hash_password
from random import randint, choice
from .config import config_db
import json
import string

params = config_db()
connection = psycopg2.connect(**params)
cursor = connection.cursor()

def title_reformat(title):
    movie_name = title.split('(')[0]
    split_by_comma = movie_name.split(', ')
    result = split_by_comma[0] # if no commas
    if len(split_by_comma) > 1:
        prefixed_string = split_by_comma[-1]

        for i in range(len(split_by_comma) - 1):
            if i == 0:
                prefixed_string += split_by_comma[i]
            else:
                prefixed_string += ', ' + split_by_comma[i]

        result = prefixed_string
    
    result = result.strip()
    return result

def add_user(first, last, email, password):
    command = f"SELECT * FROM users WHERE email = '{email}';"
    cursor.execute(command)
    result = cursor.fetchone()
    if result is not None:
        return False #will indicate that user with that email already exists

    password_hash = hash_password(password)
    command = f"INSERT INTO users VALUES (nextval('userid_sequence'), '{first}', '{last}', '{email}', '{password_hash}');"
    cursor.execute(command)

    connection.commit()
    return True

def create_session(userid):
    letters = string.ascii_letters + '0123456789'
    session_key = ''.join(choice(letters) for i in range(128))
    command = f"INSERT INTO sessions (userid, session_key) VALUES ({userid}, '{session_key}');"
    cursor.execute(command)
    
    connection.commit()
    return session_key

def get_session_user(token):
    command = f"SELECT userid FROM sessions WHERE session_key = '{token}';"
    cursor.execute(command)
    result = cursor.fetchone()
    if result:
        return result[0]
    else:
        return None

def login_user(email, password):
    password_hash = hash_password(password)
    command = f"SELECT * FROM users WHERE email = '{email}' AND password = '{password_hash}';"
    cursor.execute(command)
    result = cursor.fetchone()
    if result is not None:
        token = create_session(result[0])
        return token
    else:
        return None

def is_setup(token):
    userid = get_session_user(token)
    command = f"SELECT * FROM user_genres WHERE userid = {userid}"
    cursor.execute(command)
    result = cursor.fetchone()
    if result:
        return True
    else:
        return False

def add_genres(token, genres):
    userid = get_session_user(token)
    for genre in genres:
        command = f"INSERT INTO user_genres VALUES (%s, %s);"
        cursor.execute(command, (userid, genre))
    connection.commit()

def update_genres(token, genres):
    userid = get_session_user(token)
    command = f"DELETE FROM user_genres WHERE userid = {userid}"
    cursor.execute(command)
    for genre in genres:
        command = f"INSERT INTO user_genres VALUES (%s, %s);"
        cursor.execute(command, (userid, genre))
    connection.commit()

def add_rating(token, movie_title, rating, timestamp):
    userid = get_session_user(token)
    command = f"SELECT movieid FROM movies WHERE title = '{movie_title}'"
    cursor.execute(command)
    movieid = cursor.fetchone()[0]
    command = f"INSERT INTO ratings VALUES ({userid}, {movieid}, {rating}, {timestamp});"
    cursor.execute(command)

    connection.commit()

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

def add_to_saved_movies(token, movie):
    userid = get_session_user(token)
    command = "INSERT INTO user_saved_movies VALUES (%s, %s);"
    cursor.execute(command, (userid, json.dumps(movie)))
    connection.commit()

def get_saved_movies(token):
    userid = get_session_user(token)
    command = f"SELECT saved_movies FROM user_saved_movies WHERE userid = {userid};"
    cursor.execute(command)
    result = cursor.fetchall()
    movies = []
    for item in result:
        movies.append(item[0])
    return result

if __name__ == "__main__":
    print(title_reformat("Good, the Bad and the Ugly, The (Buono, il brutto, il cattivo, Il) (1966)"))