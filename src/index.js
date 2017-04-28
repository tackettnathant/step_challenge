import React from 'react';
import ReactDOM from 'react-dom';
import Main from './components/main';
import Auth from './components/auth';
import Register from './components/register';
import StepChallenge from './stepchallenge';
import Signin from './components/signin';
import Dashboard from './components/dashboard';
import Leaderboard from './components/leaderboard';
import Admin from './components/admin';
import Locations from './components/locations';
import Users from './components/users';

import './index.css';

import { Router, Route, IndexRoute, hashHistory } from 'react-router';


ReactDOM.render(
  <Router history={hashHistory}>
    <Route path="/" component={Main} onEnter={StepChallenge.checkValidUser.bind(this)}></Route>
    <Route path="/auth" component={Auth}></Route>
    <Route path="/register" component={Register}></Route>
    <Route path="/admin" component={Admin} ></Route>
      <Route path="/users" component={Users} ></Route>
    <Route path="/locations" component={Locations} ></Route>
    <Route path="/signin" component={Signin}></Route>
    <Route path="/dashboard" component={Dashboard} onEnter={StepChallenge.checkValidUser.bind(this)}></Route>
    <Route path="/leaderboard" component={Leaderboard} onEnter={StepChallenge.checkValidUser.bind(this)}></Route>
  </Router>,
  document.getElementById('root')
);
