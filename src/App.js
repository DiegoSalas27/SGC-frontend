import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import { useState, useEffect } from 'react';
import setJWT from "./utils/setJWT";
import jwt_decode from 'jwt-decode';
import './App.css';
import DashBoard from "./pages/Dashboard/DashBoard";
import Login from './pages/login/Login';

const jwt = localStorage.jwtToken

if (jwt) {
  setJWT(jwt)
  const decode_jwt = jwt_decode(jwt);
  const currentTime = Date.now()/1000;

  if(decode_jwt.exp < currentTime) {
    setJWT(false);
    localStorage.removeItem("jwtToken");
    window.location.replace("/");
  }
}

function App() {
  const [loggedIn, setLoggedIn] = useState(null);

  useEffect(() => {
    if (localStorage.jwtToken) {
      const decoded = jwt_decode(localStorage.jwtToken);
      setLoggedIn(decoded);
    } else {
      setLoggedIn(null);
    }
  }, [setLoggedIn]);

  function renderRoutes() {
    let routes = (
      <Switch>
        <Route exact path="/" component={() => <Login setLoggedIn={setLoggedIn}/>} />
        <Redirect to="/" />
      </Switch>
    )
    if (loggedIn) {
      routes = (
        <Switch>
          <Route path="/main" component={DashBoard} />
          <Redirect to="/main" />
        </Switch>
      );
    }

    return routes;
  }

  return (
    <Router>
        { renderRoutes() }
    </Router>
  );
}

export default App;
