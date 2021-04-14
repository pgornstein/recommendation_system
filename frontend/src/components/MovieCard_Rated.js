import React, { useState, useEffect } from 'react';
import Rating from '@material-ui/lab/Rating';
import Box from '@material-ui/core/Box';

import "./styles.css"

export default function MovieCard({title, imageURL, rating}) {
  
  return (
    <div>
      <h2>{title}</h2>
      <img 
        src={imageURL}
        alt={title}
        className="photo"
      />
      <Box key={title} component="fieldset" mb={3} borderColor="transparent">
        <Rating name="customized-10" precision={0.5} max={10} value={rating} readOnly/>
      </Box>
    </div>
  );
}