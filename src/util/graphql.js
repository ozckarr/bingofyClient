import gql from "graphql-tag";

export const FETCH_BINGOS_QUERY = gql`
  {
    getBingos {
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
