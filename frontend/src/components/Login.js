import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://media.istockphoto.com/photos/movie-projector-on-dark-background-picture-id1007557230?k=6&m=1007557230&s=612x612&w=0&h=2c6NHjfH4sWCgTNoZCDLQx10_PdIfl-dI-nyZ9wF_jI=)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const useStateWithSessionStorage = (key) => {
  const [data, setData] = useState(sessionStorage.getItem(key) || "");
  return [data, setData]
}

export default function Login({setToken}) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [requestSuccess, setRequestSuccess] = useState(true);
  const [loginError, setLoginError] = useState(false);

  let token = sessionStorage.getItem("token") || "";
  const history = useHistory()

  useEffect(() => {
    async function redirect() {
      if (token !== "") {
        console.log(token)
        const data2 = {token: token};
        const configs2 = {
          method: "POST",
          mode: "cors",
          body: JSON.stringify(data2),
          headers: {"Content-Type": "application/json"}
        };
        const response_package2 = await fetch("http://localhost:8000/api/is_setup/", configs2)
        const response2 = await response_package2.json()
        console.log(response2)
        if (response2.connected && response2.isSetup) history.push("/main");
        else if (response2.connected) history.push("/setup");
      } 
    }
    redirect()
  }, [])

  const loginUser = async () => {
    const data = {
      email: email,
      password: password
    };
    const configs = { 
      method: "POST",
      mode: "cors",
      body: JSON.stringify(data),
      headers: {"Content-Type": "application/json"}
    };
    const response_package = await fetch("http://localhost:8000/api/login_user/", configs);
    const response = await response_package.json();
    setRequestSuccess(response.connected);
    if (requestSuccess) {
      if (!response.loggedIn) setLoginError(true);
      else {
        console.log(response.token)
        setLoginError(false);
        sessionStorage.setItem("token", response.token);
        setToken(response.token);
        history.push("/setup");
      }
    }
  }

  const classes = useStyles();

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Log In
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={e => setEmail(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={e => setPassword(e.target.value)}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={e => {
                e.preventDefault();
                loginUser();
              }}
            >
              Sign In
            </Button>
            {!requestSuccess && <p>Connection problem, please try again</p>}
            {loginError && <p>Email or password is incorrect, please try again</p>}
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}

