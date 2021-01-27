import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import { Button, Confirm } from "semantic-ui-react";

import { FETCH_BINGOS_QUERY } from "../util/graphql";

function DeleteButton({ bingoId, callback }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [deleteBingo] = useMutation(DELETE_BINGO_MUTATION, {
    refetchQueries: [{ query: FETCH_BINGOS_QUERY }],

    update(proxy) {
      setConfirmOpen(false);

      if (callback) callback();
    },
    variables: {
      bingoId,
    },
  });
  return (
    <>
      <Button
        as="div"
        color="orange"
        onClick={() => setConfirmOpen(true)}
        circular
        icon="trash"
      />
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deleteBingo}
      />
    </>
  );
}

const DELETE_BINGO_MUTATION = gql`
  mutation deleteBingo($bingoId: ID!) {
    deleteBingo(bingoId: $bingoId)
  }
`;

export default DeleteButton;
