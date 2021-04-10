from django.urls import path
from .views import AddUser, LoginUser, IsSetup, AddGenres, UpdateGenres, AddRating, UpdateGenres, ViewMovies, ViewRated, SaveMovie, GetSavedMovies, UnsaveMovie

app_name = 'controller'

urlpatterns = [
    path('add_user/', AddUser.as_view()),
    path('login_user/', LoginUser.as_view()),
    path('is_setup/', IsSetup.as_view()),
    path('add_genres/', AddGenres.as_view()),
    path('update_genres/', UpdateGenres.as_view()),
    path('add_rating/', AddRating.as_view()),
    path('view_movies/', ViewMovies.as_view()),
    path('view_rated/', ViewRated.as_view()),
    path('save_movie/', SaveMovie.as_view()),
    path('get_saved_movies/', GetSavedMovies.as_view()),
    path('unsave_movie/', UnsaveMovie.as_view()),
]