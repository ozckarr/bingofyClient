import React, { useCallback, useContext, useState } from "react";
import gql from "graphql-tag";
import { useQuery, useMutation } from "@apollo/client";
import { useDropzone } from "react-dropzone";
import {
  Button,
  Card,
  Form,
  Popup,
  Container,
  Loader,
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import { Image } from "cloudinary-react";

import { AuthContext } from "../context/auth";
import { Redirect } from "react-router-dom";

const {
  REACT_APP_CLOUDINARY_CLOUD_NAME,
  REACT_APP_CLOUDINARY_UPLOAD_PRESET,
} = process.env;

function BingoView(props) {
  const bingoId = props.match.params.bingoId;
  const [title, setTitle] = useState("");
  const [summery, setSummery] = useState("");
  const [cloudinaryId, setCloudinaryId] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedBox, setSelectedBox] = useState({
    cloudinaryId: "",
    id: "",
    summery: "",
    title: "",
  });

  const [errors, setErrors] = useState({});

  const { user } = useContext(AuthContext);

  const onDrop = useCallback((acceptedFiles) => {
    setUploadedFiles(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accepts: "images/*",
    multiple: false,
  });

  const { loading, data } = useQuery(FETCH_BINGO_QUERY, {
    variables: {
      bingoId,
    },
  });

  const handleBoxClick = (bingoBox) => {
    setSelectedBox({
      id: bingoBox.id,
      title: bingoBox.title,
      summery: bingoBox.summery,
      cloudinaryId: bingoBox.cloudinaryId,
    });
  };

  const [deleteBingoBox, { error }] = useMutation(DELETE_BINGOBOX_MUTATION, {
    refetchQueries: [
      {
        query: FETCH_BINGO_QUERY,
        variables: { bingoId },
      },
    ],
    update() {
      setSelectedBox({
        cloudinaryId: "",
        id: "",
        summery: "",
        title: "",
      });
    },
    onError(err) {
      console.log(err);
    },
  });

  const handleSubmit = () => {
    if (uploadedFiles.length === 0) {
      submitBox();
    } else {
      const url = `https://api.cloudinary.com/v1_1/${REACT_APP_CLOUDINARY_CLOUD_NAME}/upload`;
      uploadedFiles.forEach(async (acceptedFile) => {
        const formData = new FormData();
        formData.append("file", acceptedFile);
        formData.append("upload_preset", REACT_APP_CLOUDINARY_UPLOAD_PRESET);
        const response = await fetch(url, {
          method: "post",
          body: formData,
        });
        const { public_id } = await response.json();
        setCloudinaryId(public_id);
        submitBox();
      });
    }
  };

  const [submitBox] = useMutation(SUBMIT_BINGOBOX_MUTATION, {
    update() {
      setTitle("");
      setSummery("");
      setCloudinaryId("");
      setUploadedFiles([]);
    },
    variables: {
      bingoId,
      title,
      summery,
      cloudinaryId,
    },
    onError(err) {
      console.log(err);

      setErrors("något blev fel");
    },
  });

  let bingoMarkup;
  if (!user) {
    bingoMarkup = <Redirect to="/" />;
  } else {
    if (loading) {
      bingoMarkup = <Loader />;
    } else {
      const { title: bingoTitle, username, bingoBoxes } = data.getBingo;

      if (username === user.username) {
        bingoMarkup = (
          <>
            <Container>
              <Card fluid style={{ marginBottom: "1em" }}>
                <Card.Content>
                  <Card.Header>
                    <h3>{bingoTitle}</h3>
                  </Card.Header>
                  <Card.Meta>
                    <p>
                      Lägg till 25 brickor. Titeln är det som kommer att synas
                      på bingobrickan. Summeringen kan ge en länge beskrivning.
                    </p>
                  </Card.Meta>
                </Card.Content>
                <Card fluid>
                  <Card.Content>
                    <Form>
                      <Form.Input
                        type="text"
                        placeholder="Titel"
                        name={title}
                        error={errors.title ? true : false}
                        onChange={(event) => setTitle(event.target.value)}
                        value={title}
                      />
                      <Form.TextArea
                        type="text"
                        placeholder="Summering"
                        name="summery"
                        onChange={(event) => setSummery(event.target.value)}
                        value={summery}
                      />

                      {uploadedFiles.length === 0 ? (
                        <div
                          {...getRootProps()}
                          className={`dropzone ${
                            isDragActive && "dropzoneActive"
                          }`}
                        >
                          <input {...getInputProps()} value={cloudinaryId} />
                          Bild här (Valfritt)
                        </div>
                      ) : (
                        <div className="dropzoneFull">Fullt...</div>
                      )}

                      {!(bingoBoxes.length > 24) ? (
                        <>
                          <p>{25 - bingoBoxes.length} Boxar kvar</p>

                          <Button
                            type="submit"
                            icon="add"
                            color="orange"
                            disabled={title.trim() === ""}
                            onClick={handleSubmit}
                            circular
                          />
                        </>
                      ) : (
                        <Button
                          color="orange"
                          style={{ marginTop: "1em" }}
                          fluid
                          as={Link}
                          to={`/bingos/`}
                        >
                          <h4>Klar</h4>
                        </Button>
                      )}
                    </Form>
                    {error && (
                      <div
                        className="ui error message"
                        style={{ marginBottom: 20 }}
                      >
                        <ul className="list">
                          <li>{error.graphQLErrors[0].message}</li>
                        </ul>
                      </div>
                    )}
                  </Card.Content>
                </Card>
              </Card>
            </Container>
            <div
              className="creatorBingoContainer"
              style={{ maxWidth: "600px", margin: "auto" }}
            >
              {bingoBoxes.map((bingoBox) => (
                <React.Fragment key={bingoBox.id}>
                  {bingoBox.cloudinaryId === "" ? (
                    <div
                      className={
                        selectedBox.id === bingoBox.id
                          ? "selected creatorBingoBox"
                          : "creatorBingoBox"
                      }
                      onClick={() => handleBoxClick(bingoBox)}
                    >
                      <p>{bingoBox.title}</p>
                    </div>
                  ) : (
                    <Image
                      cloudName={`${REACT_APP_CLOUDINARY_CLOUD_NAME}`}
                      publicId={bingoBox.cloudinaryId}
                      responsive
                      width="auto"
                      crop="scale"
                      className={
                        selectedBox.id === bingoBox.id
                          ? "selected creatorBingoBox"
                          : "creatorBingoBox"
                      }
                      onClick={() => handleBoxClick(bingoBox)}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
            {!(selectedBox.title === "") && (
              <div style={{ margin: "1em auto", maxWidth: "600px" }}>
                <Card fluid>
                  <Card.Content>
                    <Card.Header>{selectedBox.title}</Card.Header>
                    <p>{selectedBox.summery}</p>
                  </Card.Content>
                  <Card.Content>
                    <Button
                      as="div"
                      color="orange"
                      onClick={() =>
                        deleteBingoBox({
                          variables: { bingoId, bingoBoxId: selectedBox.id },
                        })
                      }
                      circular
                      icon="trash"
                    />
                    {!(selectedBox.cloudinaryId === "") && (
                      <Popup
                        trigger={
                          <Button
                            as="div"
                            color="orange"
                            circular
                            icon="zoom"
                            floated="right"
                          />
                        }
                        content={
                          <Image
                            cloudName={`${REACT_APP_CLOUDINARY_CLOUD_NAME}`}
                            publicId={selectedBox.cloudinaryId}
                            responsive
                            height="250px"
                            width="250px"
                          />
                        }
                        position="top right"
                      />
                    )}
                  </Card.Content>
                </Card>
              </div>
            )}
            <div style={{ height: "1em" }}></div>
          </>
        );
      }
    }
  }

  return bingoMarkup;
}

const SUBMIT_BINGOBOX_MUTATION = gql`
  mutation createBingoBox(
    $bingoId: String!
    $title: String!
    $summery: String
    $cloudinaryId: String
  ) {
    createBingoBox(
      bingoId: $bingoId
      title: $title
      summery: $summery
      cloudinaryId: $cloudinaryId
    ) {
      id
      bingoBoxes {
        id
        title
        summery
        cloudinaryId
      }
    }
  }
`;

const FETCH_BINGO_QUERY = gql`
  query($bingoId: ID!) {
    getBingo(bingoId: $bingoId) {
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

const DELETE_BINGOBOX_MUTATION = gql`
  mutation deleteBingoBox($bingoId: String!, $bingoBoxId: String!) {
    deleteBingoBox(bingoId: $bingoId, bingoBoxId: $bingoBoxId)
  }
`;

export default BingoView;
