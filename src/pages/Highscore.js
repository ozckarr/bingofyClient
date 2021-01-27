import React, { useState } from "react";
import { Form, Button } from "semantic-ui-react";
import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { useHistory } from "react-router-dom";

function Highscore() {
  const [errors, setErrors] = useState(false);
  let history = useHistory();

  const [values, setValues] = useState({
    gameCode: "",
  });

  const onChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const [getHighscore, { loading }] = useMutation(GET_HIGHSCORE, {
    variables: values,
    update(proxy, result) {
      values.gameCode = "";
    },
    onCompleted({ getHighscore, getHighscore: { id } }) {
      history.push(`/highscore/${id}`);
    },
    onError(err) {
      console.log(err);
      setErrors(true);
    },
  });

  const onSubmit = (event) => {
    event.preventDefault();
    getHighscore();
  };
  return (
    <div className="size-container">
      <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ""}>
        <h1>Hitta Highscore</h1>
        <Form.Input
          label="Bingokod"
          placeholder="Koden till bingot..."
          name="gameCode"
          type="text"
          value={values.gameCode}
          onChange={onChange}
        ></Form.Input>
        <Button type="submit" color="orange" fluid>
          <h4>Se Highscore</h4>
        </Button>
      </Form>
      {errors && (
        <div className="ui error message">
          <ul className="list">
            <li>Fel kod</li>
          </ul>
        </div>
      )}
    </div>
  );
}

const GET_HIGHSCORE = gql`
  mutation getHighscore($gameCode: String!) {
    getHighscore(gameCode: $gameCode) {
      id
      gameCode
    }
  }
`;

export default Highscore;
