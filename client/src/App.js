import React from 'react';
import './App.css';
import Register from './Register';
import Login from './Login';
import TasksMain from './TasksMain';

import { Route } from "react-router-dom";
import { Switch } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={Register}></Route>
        <Route exact path="/login" component={Login}></Route>
        <Route exact path="/tasks" component={TasksMain}></Route>
      </Switch>
    </div>
  );
}

export default App;
