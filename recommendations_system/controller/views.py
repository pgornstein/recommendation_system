from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .backend.interact_db import add_user, login_user, is_setup, add_genres, update_genres, add_rating
from .backend.fetch import fetch_similar, fetch_new, fetch_rated, supply_movies_data, supply_rated_data
from .backend.saved import add_to_saved_movies, get_saved_movies, unsave_movie

# Create your views here.

class AddUser(APIView):

    def post(self, request):
        if request:
            first = request.data['first']
            last = request.data['last']
            email = request.data['email']
            password = request.data['password']

            added = add_user(first, last, email, password)
            response = {"connected": True, "added": added}
        else:
            response = {"connected": False}

        return Response(response)

class LoginUser(APIView):

    def post(self, request):
        if request:
            email = request.data['email']
            password = request.data['password']

            token = login_user(email, password)
            if token:
                response = {"connected": True, "loggedIn": True, "token": token}
            else:
                response = {"connected": True, "loggedIn": False}
        else:
            response = {"connected": False}
        
        return Response(response)

class IsSetup(APIView):

    def post(self, request):
        if request:
            token = request.data['token']

            setup_flag = is_setup(token)
            response = {"connected": True, "isSetup": setup_flag}
        else:
            response = {"connected": False}
        
        return Response(response)

class AddGenres(APIView):

    def post(self, request):
        if request:
            token = request.data['token']
            genres = request.data['genres']

            add_genres(token, genres)
            response = {"connected": True}
        else:
            response = {"connected": False}

        return Response(response)

class UpdateGenres(APIView):

    def post(self, request):
        if request:
            token = request.data['token']
            genres = request.data['genres']

            update_genres(token, genres)
            response = {"connected": True}
        else:
            response = {"connected": False}

        return Response(response)

class AddRating(APIView):
    
    def post(self, request):
        if request:
            token = request.data['token']
            movie_title = request.data['movieTitle']
            rating = request.data['rating']
            timestamp = request.data['timestamp']

            add_rating(token, movie_title, rating, timestamp)
            response = {"connected": True, "rated": True}
        else:
            response = {"connected": False}
        
        return Response(response)

class ViewMovies(APIView):

    def post(self, request):
        if request:
            token = request.data['token']
            movie_title = request.data['movieTitle']
            discard_queue = request.data['discardQueue']
            refresh_flag = request.data['refreshFlag']
            
            if refresh_flag:
                data = supply_movies_data(fetch_new(token, discard_queue))
            else:
                data = supply_movies_data(fetch_similar(token, movie_title))
            response = {"connected": True, "data": data}
        else:
            response = {"connected": False} 

        return Response(response)

class ViewRated(APIView):

    def post(self, request):
        if request:
            token = request.data['token']

            data = supply_rated_data(fetch_rated(token))
            response = {"connected": True, "data": data}
        else:
            response = {"connected": False}

        return Response(response)

class SaveMovie(APIView):

    def post(self, request):
        if request:
            token = request.data['token']
            movie = request.data['movie']

            add_to_saved_movies(token, movie)

            response = {"connected": True, "saved": True}
        else: response = {"connected": False}

        return Response(response)

class GetSavedMovies(APIView):

    def post(self, request):
        if request:
            token = request.data['token']

            movies = get_saved_movies(token)

            response = {"connected": True, "movies": movies}
        else: response = {"connected": False}

        print(response)

        return Response(response)

class UnsaveMovie(APIView):
    
    def post(self, request):
        if request:
            token = request.data['token']
            movie_title = request.data['movieTitle']
            rating = request.data['rating']
            timestamp = request.data['timestamp']

            add_rating(token, movie_title, rating, timestamp)
            unsave_movie(token, movie_title)
            response = {"connected": True, "rated": True}
        else:
            response = {"connected": False}
        
        return Response(response)
    