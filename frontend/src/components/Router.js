import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Login from './Login';
import Reel from './Reel';
import Register from './Register';
import Setup from './Setup';
import Settings from './Settings';
import SavedMovies from './SavedMovies';
import RatedMovies from './RatedMovies';

const Router = ({setToken}) => {
  return(
    <div>
      <Route path="/login" component={() => <Login setToken={setToken} />} />
      <Route path="/register" component={Register} />
      <Route path="/setup" component={Setup} />
      <Route path="/reel" component={Reel} />
      <Route path="/settings" component={Settings} />
      <Route path="/saved" component={SavedMovies} />
      <Route path="/rated" component={RatedMovies} />
      <Redirect exact from="/" to="/login" />
    </div>
  )
}

export default Router;