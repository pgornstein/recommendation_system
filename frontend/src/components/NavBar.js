import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  }
}));

const NavBar = () => {

  const [token, setToken] = useState(sessionStorage.getItem("token") || "");

  useEffect( () => {
    setToken(sessionStorage.getItem("token") || "");
    console.log(token)
  }, [token])

  console.log("Token", token)

  return (
    <nav style={{textAlign: "center"}}>
      {!token && (<Button color="inherit" component={Link} to={'/login'}>Login</Button>)}
      {!token && (<Button color="inherit" component={Link} to={'/register'}>Register</Button>)}
      {token && (<Button color="inherit" component={Link} to={'/setup'}>Setup</Button>)}
      {token && (<Button color="inherit" component={Link} to={'/reel'}>Reel</Button>)}
      {token && (<Button color="inherit" component={Link} to={'/saved'}>Saved Movies</Button>)}
      {token && (<Button color="inherit" component={Link} to={'rated'}>Rated Movies</Button>)}
    </nav>
  )
}

export default NavBar;