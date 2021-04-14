import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid'
import MovieCard from './MovieCard_Rated'

const useStateWithSessionStorage = (key) => {
  const [data, setData] = useState(sessionStorage.getItem(key) || "");
  return [data, setData]
}

export default function SavedMovies() {

  const [token, setToken] = useState(sessionStorage.getItem("token") || "");

  const [movies, setMovies] = useState([]);
  
  useEffect(() => {
    async function getRatedMovies() {
      const data = {
        token: token,
      };
      const configs = {
        method: "POST",
        mode: "cors",
        body: JSON.stringify(data),
        headers: {"Content-Type": "application/json"}
      };
      const response_package = await fetch("http://localhost:8000/api/view_rated/", configs);
      const response = await response_package.json();
      if (response.connected) setMovies(response.data);
      else getRatedMovies();
    }
    getRatedMovies()
  }, [])

  return (
    <div>
      <Grid container spacing={3}>
      {movies.map(movie => { 
        return (
          <Grid item xs={4}>
            <MovieCard 
              token={token} 
              title={movie['title']}
              imageURL={movie['imageURL']}
              rating={movie['rating']}
            />
          </Grid>)
      })}
      </Grid>
    </div>
  )
}