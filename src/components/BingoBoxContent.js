import React from "react";
import { Button, Popup, Card } from "semantic-ui-react";
import { Image } from "cloudinary-react";

const { REACT_APP_CLOUDINARY_CLOUD_NAME } = process.env;

function BingoBoxContent({
  props: { id, title, summery, checked, cloudinaryId },
  checkBox,
}) {
  return (
    <Card.Content>
      {id === "" ? (
        <Card.Header>Klicka på en box för att komma igång.</Card.Header>
      ) : (
        <>
          {!(cloudinaryId === "") && (
            <Popup
              trigger={
                <Button
                  as="div"
                  color="orange"
                  circular
                  icon="zoom"
                  floated="right"
                  style={{ marginBottom: "0.5em" }}
                />
              }
              content={
                <Image
                  cloudName={`${REACT_APP_CLOUDINARY_CLOUD_NAME}`}
                  publicId={cloudinaryId}
                  responsive
                  height="250px"
                  width="250px"
                />
              }
              position="top left"
            />
          )}
          <Card.Header>{title}</Card.Header>
          <div className="summery">
            <p style={{ minHeight: "2em" }}>{summery}</p>
          </div>
          {checked ? (
            <Button
              circular
              color="orange"
              icon="window close outline"
              onClick={checkBox}
              floated="right"
            />
          ) : (
            <Button
              circular
              color="red"
              icon="expand"
              floated="right"
              onClick={checkBox}
            />
          )}
        </>
      )}
    </Card.Content>
  );
}

export default BingoBoxContent;
