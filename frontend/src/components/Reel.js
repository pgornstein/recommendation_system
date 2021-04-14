import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';

const useStateWithSessionStorage = (key) => {
  const [data, setData] = useState(sessionStorage.getItem(key) || "");
  return [data, setData]
}

export default function Reel() {

  const [token, setToken] = useState(sessionStorage.getItem("token") || "");

  const [movieSet, setMovieSet] = useState([]);
  const [currentMovie, setCurrentMovie] = useState(null);

  const [title, setTitle] = useState("");
  const [imageURL, setImageURL] = useState("")
  const [runningTime, setRunningTime] = useState("");
  const [year, setYear] = useState(0);
  const [certificate, setCertificate] = useState("");
  const [rating, setRating] = useState("");
  const [genres, setGtenres] = useState([]);
  const [releaseDate, setReleaseDate] = useState("");
  const [plotOutline, setPlotOutline] = useState("");
  const [unformattedTitle, setUnformattedTitle] = useState("");

  const [userRating, setUserRating] = useState(null)
  const [ratingTotal, setRatingTotal] = useState(0)
  const [numberOfMovies, setNumberOfMovies] = useState(0)
  const [averageRating, setAverageRating] = useState(null)

  const [discardQueue, setDiscardQueue] = useState([])

  const addRating = async() => {
    // Sends rating to backend
    if (userRating) {
      let ratingSent = false;

      while (!ratingSent) {
        const data = {
          token: token,
          movieTitle: unformattedTitle,
          rating: userRating,
          timestamp: Math.round((new Date()).getTime() / 1000)
        };
        const configs = {
          method: "POST",
          mode: "cors",
          body: JSON.stringify(data),
          headers: {"Content-Type": "application/json"}
        };
        const response_package = await fetch("http://localhost:8000/api/add_rating/", configs);
        const response = await response_package.json();
        if (response.connected && response.rated) ratingSent = true;
      }
      nextMovie();
    }

    // Updates average rating
    
    setRatingTotal(ratingTotal + userRating)
    setNumberOfMovies(numberOfMovies + 1)
    setAverageRating(ratingTotal / numberOfMovies)
  }

  const saveMovie = async () => {
    const data = {
      token: token,
      movie: currentMovie
    };
    const configs = {
      method: "POST",
      mode: "cors",
      body: JSON.stringify(data),
      headers: {"Content-Type": "application/json"}
    };
    const response_package = await fetch("http://localhost:8000/api/save_movie/", configs);
    const response = await response_package.json();
    if (!response.connected) saveMovie();
    nextMovie();
  }

  const nextMovie = async () => {
    let queue = movieSet

    // Refreshes movieSet if user doesn't like the movies well enough
    if (numberOfMovies > 5 && averageRating < 3) {
      setDiscardQueue(discardQueue.concat(queue));
      const data = {
        token: token,
        movieTitle: null,
        discardQueue: discardQueue,
        getFlag: true,
        refreshFlag: true
      };
      const configs = {
        method: "POST",
        mode: "cors",
        body: JSON.stringify(data),
        headers: {"Content-Type": "application/json"}
      };
      const response_package = await fetch("http://localhost:8000/api/view_movies/", configs);
      const response = await response_package.json();
      setRatingTotal(0);
      setNumberOfMovies(0);
      setAverageRating(0);
      if (response.connected) {
        queue = response.data
        setDiscardQueue([]);
      }
    }
    
    console.log(movieSet)
    // Refreshes movieSet if movies have run out
    if (movieSet == null || movieSet.length == 0) {
      console.log("Starting")
      const data2 = {
        token: token,
        movieTitle: averageRating > 5 ? unformattedTitle : null,
        discardQueue: discardQueue,
        refreshFlag: averageRating > 5 ? false : true
      };
      const configs2 = {
        method: "POST",
        mode: "cors",
        body: JSON.stringify(data2),
        headers: {"Content-Type": "application/json"}
      };
      const response_package2 = await fetch("http://localhost:8000/api/view_movies/", configs2);
      const response2 = await response_package2.json();
      setRatingTotal(0);
      setNumberOfMovies(0);
      setAverageRating(0);
      if (response2.connected == true) {
        queue = response2.data
        setDiscardQueue([]);
      }
    }
    // Takes from movieSet
    const currentFilm = queue[0];
    setCurrentMovie(currentFilm);
    queue.shift();
    setMovieSet(queue);

    // Sets movie parameters
    setTitle(currentFilm['title']['title']);
    setImageURL(currentFilm['title']['image']['url']);
    setRunningTime(currentFilm['title']['runningTimeInMinutes']);
    setYear(currentFilm['title']['year']);
    setCertificate(currentFilm["certificates"]["US"][0]["certificate"]);
    setRating(currentFilm['ratings']['rating']);
    setGtenres(currentFilm['genres']);
    setReleaseDate(currentFilm['releaseDate'])
    setPlotOutline(currentFilm['plotOutline']['text'])
    setUnformattedTitle(currentFilm['unformattedTitle'])

    console.log()
  }

  return (
    <div>
      <h1>The Reel</h1>
      <img
       src={imageURL}
       alt={title}
       />
      <h2>{title} {year} {rating}</h2>
      <h3>{certificate} {runningTime}</h3>
      <h3>{genres} {releaseDate}</h3>
      <h3>{plotOutline}</h3>
       <button onClick={e => nextMovie()}>Next Movie</button>
       <Box component="fieldset" mb={3} borderColor="transparent">
        <Rating name="customized-10" defaultValue={2} precision={0.5} max={10} 
          value={userRating}
          onChange={(event, newValue) => {
          setUserRating(newValue);}}/>
      </Box>
      <button onClick={e => addRating()}>Add Rating</button>
      <button onClick={e => saveMovie()}>Save Movie</button>
    </div>
  )

}