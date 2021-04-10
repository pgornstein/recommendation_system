import psycopg2
from .hash import hash_password
from random import choice
from .config import config_db
import string

params = config_db()
connection = psycopg2.connect(**params)
cursor = connection.cursor()

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