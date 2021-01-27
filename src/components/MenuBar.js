import React, { useContext, useState } from "react";
import { Menu, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";

import { AuthContext } from "../context/auth";
import { PlayerContext } from "../context/playerAuth";
import logo from "../images/title-left.png";

function MenuBar() {
  const { user, logout } = useContext(AuthContext);
  const { player, leave } = useContext(PlayerContext);

  const pathname = window.location.pathname;

  const path = pathname === "/" ? "home" : pathname.substr(1);
  const [activeItem, setActiveItem] = useState(path);

  const handleItemClick = (e, { value }) => setActiveItem(value);
  let MenuBar;
  if (player) {
    MenuBar = (
      <Menu secondary size="massive" color="orange">
        <Menu.Menu position="right">
          <Menu.Item icon="x" onClick={leave} active />
        </Menu.Menu>
      </Menu>
    );
  } else if (user) {
    MenuBar = (
      <Menu pointing secondary size="large" color="orange">
        <Menu.Item name={user.username} active as={Link} to="/" />

        <Menu.Menu position="right">
          <Menu.Item name="logout" onClick={logout} />
        </Menu.Menu>
      </Menu>
    );
  } else {
    MenuBar = (
      <Menu pointing secondary size="large" color="orange">
        {!(activeItem === "home") && (
          <Menu.Item
            name="home"
            value="home"
            active={activeItem === "home"}
            onClick={handleItemClick}
            as={Link}
            to="/"
          >
            <Image src={logo} style={{ height: "14px" }} />
            BINGOFY
          </Menu.Item>
        )}

        <Menu.Menu position="right">
          {!(activeItem === "register") && (
            <Menu.Item
              name="reg"
              value="register"
              active={activeItem === "register"}
              onClick={handleItemClick}
              as={Link}
              to="/register"
            />
          )}
          {!(activeItem === "login") && (
            <Menu.Item
              name="login"
              value="login"
              active={activeItem === "login"}
              onClick={handleItemClick}
              as={Link}
              to="/login"
            />
          )}
        </Menu.Menu>
      </Menu>
    );
  }
  return MenuBar;
}

export default MenuBar;
