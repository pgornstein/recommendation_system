import requests
from .config import config_api

def get_imdb_id(title):

    key = config_api()
    url = "https://movie-database-imdb-alternative.p.rapidapi.com/" 

    headers = {
    'x-rapidapi-key': key,
    'x-rapidapi-host': "movie-database-imdb-alternative.p.rapidapi.com"
    }

    querystring = {"s": title, "page": "1", "r": "json"}

    response = requests.request("GET", url, headers=headers, params=querystring)
    data = response.json()
    if 'Search' not in data:
        return None
    id = data['Search'][0]['imdbID']
    return id

def get_movie_info(title):

    id = get_imdb_id(title)
    if id is None:
        return None
    key = config_api()
    url = "https://imdb8.p.rapidapi.com/title/get-overview-details" 

    headers = {
    'x-rapidapi-key': key,
    'x-rapidapi-host': "imdb8.p.rapidapi.com"
    }

    querystring = {"tconst": id, "currentCountry": "US"}

    response = requests.request("GET", url, headers=headers, params=querystring)
    data = response.json()
    print(data)
    return data

if __name__ == "__main__":
    print(get_movie_info("Romantics Anonymous"))
    print(type(get_movie_info("Romantics Anonymous")))