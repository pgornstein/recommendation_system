import React, { useState, useEffect } from 'react';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';

import "./styles.css"

export default function MovieCard({token, title, unformattedTitle, imageURL}) {

  const [rating, setRating] = useState(null);
  const [show, setShow] = useState(true);

  const addRating = async () => {
    console.log("Enter addRating");
    if (rating !== null) {
      let ratingSent = false;

      while (!ratingSent) {
        const data = {
          token: token,
          movieTitle: unformattedTitle,
          rating: rating,
          timestamp: Math.round((new Date()).getTime() / 1000)
        };
        const configs = {
          method: "POST",
          mode: "cors",
          body: JSON.stringify(data),
          headers: {"Content-Type": "application/json"}
        };
        //console.log("dispatch fetch")
        const response_package = await fetch("http://localhost:8000/api/unsave_movie/", configs);
        const response = await response_package.json();
        //console.log("\n\n\nResponse\n\n\n", response)
        if (response.connected && response.rated) {
          ratingSent = true;
          setShow(false);
        }
      }
    }
  }
  
  return (
    <div>
      { show && <div>
        <h2>{title}</h2>
        <img 
          src={imageURL}
          alt={title}
          className="photo"
        />
        <Box key={title} component="fieldset" mb={3} borderColor="transparent">
          <Rating name="customized-10" precision={0.5} max={10} 
          value={rating || 2}
          onChange={(event, newValue) => {setRating(newValue)}
          }/>
        </Box>
        <button onClick={e => {
          addRating();
        }}>Add Rating</button>
      </div>
    }
    </div>
  );
}