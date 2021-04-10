import psycopg2
from config import config_db

params = config_db()
connection = psycopg2.connect(**params)
cursor = connection.cursor()

def drop_tables():
    # command = "DROP TABLE IF EXISTS ratings;"
    # cursor.execute(command)
    # command = "DROP TABLE IF EXISTS movies;"
    # cursor.execute(command)
    # command = "DROP TABLE IF EXISTS users;"
    # cursor.execute(command)
    # command = "DROP TABLE IF EXISTS user_genres;"
    # cursor.execute(command)
    command = "DROP TABLE IF EXISTS user_saved_movies;"
    cursor.execute(command)
    # command = "DROP SEQUENCE IF EXISTS userid_sequence;"
    # cursor.execute(command)

    connection.commit()

def load_tables():
    # command = """CREATE TABLE IF NOT EXISTS ratings(
    #             userid integer NOT NULL,
    #             movieid integer NOT NULL,
    #             rating float NOT NULL,
    #             timestamp integer
    #             );"""
    # cursor.execute(command)

    # command = """COPY ratings 
    #             FROM '/mnt/c/users/Phillip/Desktop/personal projects/recommendations_system/recommendations_system/controller/backend/ml-latest-small/ratings.csv'
    #             WITH NULL AS ' ' CSV HEADER;"""
    # cursor.execute(command)

    # connection.commit()

    # command = """CREATE TABLE IF NOT EXISTS movies(
    #             movieid integer PRIMARY KEY,
    #             title text NOT NULL,
    #             genres text NOT NULL
    #             );"""
    # cursor.execute(command)

    # command = """COPY movies 
    #             FROM '/mnt/c/users/Phillip/Desktop/personal projects/recommendations_system//recommendations_system/controller/backend/ml-latest-small/movies.csv'
    #             WITH NULL AS ' ' CSV HEADER;"""
    # cursor.execute(command)

    # connection.commit()

    # command = """CREATE TABLE IF NOT EXISTS users(
    #              userid integer PRIMARY KEY,
    #              first text NOT NULL,
    #              last text NOT NULL,
    #              email text NOT NULL,
    #              password VARCHAR(128) NOT NULL
    #              ); """
    # cursor.execute(command)
    # # Users in the ratings table already have a userid.  This will create a sequence from the max
    # command = "CREATE SEQUENCE userid_sequence start 611 increment 1;"
    # cursor.execute(command)

    # connection.commit()

    # command = """CREATE TABLE IF NOT EXISTS user_genres(
    #              userid integer NOT NULL,
    #              genre text NOT NULL
    #              );""" 
    # cursor.execute(command)

    # connection.commit()

    # command = """CREATE TABLE IF NOT EXISTS sessions (
    #              session_number SERIAL PRIMARY KEY,
    #              userid integer NOT NULL,
    #              session_key VARCHAR(128) NOT NULL
    #              );"""
    # cursor.execute(command)

    # connection.commit()

    command = """CREATE TABLE IF NOT EXISTS user_saved_movies (
                 userid integer NOT NULL,
                 title text NOT NULL,
                 saved_movie json
                 );"""
    cursor.execute(command)

    connection.commit()

if __name__ == "__main__":
    drop_tables()
    load_tables()