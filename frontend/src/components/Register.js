import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

//implement useEffect that redirects if user is already logged in

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const useStateWithSessionStorage = (key) => {
  const [data, setData] = useState(sessionStorage.getItem(key) || "");
  return [data, setData]
}

export default function Register() {

  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const [requestSuccess, setRequestSuccess] = useState(true);
  const [alreadyExists, setAlreadyExists] = useState(false);

  const [token, setToken] = useStateWithSessionStorage('token')
  const history = useHistory()

  useEffect(() => {
    async function redirect() {
      console.log(token)
      if (token !== "") {
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

  const registerUser = async () => {
    if (password !== confirmPassword) {
      setPasswordError(true)
    } else {
      setPasswordError(false)
      const data = {
        first: first,
        last: last,
        email: email,
        password: password
      }
      const configs = {
        method: "POST",
        mode: "cors",
        body: JSON.stringify(data),
        headers: {"Content-Type": "application/json"}
      }
      const response_package = await fetch("http://localhost:8000/api/add_user/", configs)
      const response = await response_package.json()
      setRequestSuccess(response.connected);
      if (requestSuccess) {
        if (!response.added) setAlreadyExists(true);
        else {
          setAlreadyExists(false);
          history.push("/login")
        }
      }
    }
  }

  const classes = useStyles()

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                onChange={e => setFirst(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
                onChange={e => setLast(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={e => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                onChange={e => setPassword(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Confirm Password"
                type="password"
                id="confirm-password"
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={e => {
              e.preventDefault();
              registerUser();
            }}
          >
            Sign Up
          </Button>
          {passwordError && <p>Passwords do not match, please try again</p>}
          {!requestSuccess && <p>Connection problem, please try again</p>}
          {alreadyExists && <p>Email taken, please use another email</p>}
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="#" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}