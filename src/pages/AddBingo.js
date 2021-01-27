import React from "react";
import { Button, Form } from "semantic-ui-react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";

import { useForm } from "../util/hooks";
import { useHistory } from "react-router-dom";

function AddBingo() {
  const { values, onChange, onSubmit } = useForm(createBingoCallback, {
    title: "",
    description: "",
  });

  let history = useHistory();

  const [createBingo, { error }] = useMutation(CREATE_BINGO_MUTATION, {
    variables: values,
    update(proxy, result) {
      values.title = "";
      values.description = "";
    },
    onCompleted({ createBingo: { id } }) {
      history.push(`/bingos/${id}`);
    },
    onError(err) {
      console.log(err);
    },
  });

  function createBingoCallback() {
    createBingo();
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>Nytt Bingo</h2>
        <Form.Field>
          <label>Bingo-titel</label>
          <Form.Input
            name="title"
            onChange={onChange}
            type="text"
            value={values.title}
            error={error ? true : false}
          />
          <label>Bingo beskrivning</label>
          <Form.Input
            name="description"
            onChange={onChange}
            type="textarea"
            value={values.description}
            error={error ? true : false}
          />
          <hr />
          <Button type="submit" color="orange">
            <h4>Skapa Bingo</h4>
          </Button>
        </Form.Field>
      </Form>
      {error && (
        <div className="ui error message" style={{ marginBottom: 20 }}>
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  );
}

const CREATE_BINGO_MUTATION = gql`
  mutation createBingo($title: String!, $description: String) {
    createBingo(title: $title, description: $description) {
      id
      title
      description
      createdAt
      username
      bingoBoxes {
        id
        title
        summery

        cloudinaryId
      }
    }
  }
`;

export default AddBingo;
