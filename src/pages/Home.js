import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Container, Button, Card, Image } from "semantic-ui-react";
import logo from "../images/title-right.png";

import JoinMatch from "../components/JoinMatch";
import { AuthContext } from "../context/auth";

function Home(props) {
  const { user } = useContext(AuthContext);
  let gameCode;

  // Reavels the gameCode if there is any
  if (typeof props.location.state === "undefined") {
    gameCode = "";
  } else {
    gameCode = props.location.state.detail;
  }

  return (
    <div className="size-container">
      <Container>
        <Image src={logo} />

        {gameCode !== "" ? (
          <Card fluid>
            <Card.Content>
              <Card.Meta>Dela och Spela</Card.Meta>
              <Card.Meta style={{ marginBottom: "1em" }}>BingoKod:</Card.Meta>
              <Card.Header>
                <h1>{gameCode}</h1>
              </Card.Header>
            </Card.Content>
          </Card>
        ) : (
          <h3>Anslut till spel</h3>
        )}
        <JoinMatch />
        <hr />
        <Button
          style={{ marginBottom: "0.5em" }}
          color="orange"
          basic
          fluid
          as={Link}
          to={`/highscore/`}
        >
          <h4>Highscore</h4>
        </Button>
        {user && (
          <Button color="orange" basic fluid as={Link} to={`/bingos`}>
            <h4>Bingos</h4>
          </Button>
        )}
      </Container>
    </div>
  );
}

export default Home;
