import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom'
import './App.css';
import NavBar from './components/NavBar'
import Router from './components/Router'

function App() {

  const [token, setToken] = useState(sessionStorage.getItem("token") || "");

  useEffect( () => {
    setToken(sessionStorage.getItem("token") || "");
  }, [token])

  return (
    <BrowserRouter>
      <NavBar token={token} setToken={setToken}/>
      <Router setToken={setToken}/>
    </BrowserRouter>
  );
}

export default App;
