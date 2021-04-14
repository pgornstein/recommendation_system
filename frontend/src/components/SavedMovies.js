import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid'
import MovieCard from './MovieCard'

const useStateWithSessionStorage = (key) => {
  const [data, setData] = useState(sessionStorage.getItem(key) || "");
  return [data, setData]
}

export default function SavedMovies() {

  const [token, setToken] = useState(sessionStorage.getItem("token") || "");

  const [movies, setMovies] = useState([]);
  
  useEffect(() => {
    async function getSavedMovies() {
      const data = {
        token: token,
      };
      const configs = {
        method: "POST",
        mode: "cors",
        body: JSON.stringify(data),
        headers: {"Content-Type": "application/json"}
      };
      const response_package = await fetch("http://localhost:8000/api/get_saved_movies/", configs);
      const response = await response_package.json();
      let moviesUnJSON = []
      if (response.connected) moviesUnJSON = response.movies
      else getSavedMovies();

      for (let i = 0; i < moviesUnJSON.length; i++) {
        // console.log(moviesUnJSON[i][0])
        moviesUnJSON[i] = moviesUnJSON[i][0]
      }
      setMovies(moviesUnJSON);
    }
    getSavedMovies()
  }, [])

  return (
    <div>
      <Grid container spacing={3}>
      {movies.map(movie => { 
        return (
          <Grid item xs={4}>
            <MovieCard 
              token={token} 
              title={movie['title']['title']}
              unformattedTitle={movie['unformattedTitle']}
              imageURL={movie['title']['image']['url']}
            />
          </Grid>)
      })}
      </Grid>
    </div>
  )
}