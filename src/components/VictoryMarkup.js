import React, { useContext, useState } from "react";
import { Confirm, Button } from "semantic-ui-react";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { PlayerContext } from "../context/playerAuth";
import { Link } from "react-router-dom";

function VictoryCheck() {
  const {
    player: { playerId },
    player: { matchId },
    leave,
  } = useContext(PlayerContext);
  const [confirmOpen, setConfirmOpen] = useState(true);
  const [finishBingo, setFinishBingo] = useState(false);

  const [bingo] = useMutation(CONFIRM_BINGO_MUTATION, {
    update() {
      setFinishBingo(true);
    },
    variables: {
      matchId,
      playerId,
    },
    onError(err) {
      console.log(err);
    },
  });

  return (
    <>
      {!finishBingo ? (
        <Confirm
          open={confirmOpen}
          content="Du har fem i rad! Tryck Bingo för att få Bingo."
          cancelButton="Avbryt"
          confirmButton="Bingo"
          onCancel={() => setConfirmOpen(false)}
          onConfirm={bingo}
        />
      ) : (
        <Button
          color="orange"
          fluid
          as={Link}
          to={`/highscore/${matchId}`}
          onClick={leave}
        >
          <h4>Avsluta och visa highscore</h4>
        </Button>
      )}
    </>
  );
}

const CONFIRM_BINGO_MUTATION = gql`
  mutation bingoConfirm($matchId: String!, $playerId: String!) {
    bingoConfirm(matchId: $matchId, playerId: $playerId) {
      finishedAt
      id
      players {
        id
        finishedAt
      }
    }
  }
`;

export default VictoryCheck;
