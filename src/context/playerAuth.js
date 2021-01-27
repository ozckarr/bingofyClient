import React, { useReducer, createContext } from "react";
import jwtDecode from "jwt-decode";

const initialState = {
  player: null,
};

if (localStorage.getItem("jwtPlayerToken")) {
  const decodedToken = jwtDecode(localStorage.getItem("jwtPlayerToken"));

  if (decodedToken.exp * 1000 < Date.now()) {
    localStorage.removeItem("jwtPlayerToken");
  } else {
    initialState.player = decodedToken;
  }
}

const PlayerContext = createContext({
  player: null,
  join: (playerData) => {},
  leave: () => {},
});

function matchReducer(state, action) {
  switch (action.type) {
    case "JOIN":
      return {
        ...state,
        player: action.payload,
      };
    case "LEAVE":
      return {
        ...state,
        player: null,
      };
    default:
      return state;
  }
}

function PlayerProvider(props) {
  const [state, dispatch] = useReducer(matchReducer, initialState);

  function join(playerData) {
    localStorage.setItem("jwtPlayerToken", playerData.token);
    dispatch({
      type: "JOIN",
      payload: playerData,
    });
  }

  function leave() {
    localStorage.removeItem("jwtPlayerToken");
    dispatch({ type: "LEAVE" });
  }

  return (
    <PlayerContext.Provider
      value={{ player: state.player, join, leave }}
      {...props}
    />
  );
}

export { PlayerContext, PlayerProvider };
