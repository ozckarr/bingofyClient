import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "../context/auth";
import { PlayerContext } from "../context/playerAuth";

// All routes dubblechecks if you are a Player (currently playing), if so it will redirect you accordingly

function AuthRoute({ component: Component, ...rest }) {
  const { user } = useContext(AuthContext);
  const { player } = useContext(PlayerContext);

  return !player ? (
    <Route
      {...rest}
      render={(props) =>
        user ? <Redirect to="/" /> : <Component {...props} />
      }
    />
  ) : (
    <Redirect to={`/match/${player.matchId}`} />
  );
}

function AuthRouteLoggedIn({ component: Component, ...rest }) {
  const { user } = useContext(AuthContext);
  const { player } = useContext(PlayerContext);

  return !player ? (
    <Route
      {...rest}
      render={(props) =>
        user ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  ) : (
    <Redirect to={`/match/${player.matchId}`} />
  );
}

function AuthRouteOnlyPlayer({ component: Component, ...rest }) {
  const { player } = useContext(PlayerContext);

  return player ? (
    <Route {...rest} render={(props) => <Component {...props} />} />
  ) : (
    <Redirect to="/" />
  );
}

export { AuthRoute, AuthRouteLoggedIn, AuthRouteOnlyPlayer };
