import { gql } from '@apollo/client';

// Define and export the "me" graphql query using a constant variable "GET_ME"
export const GET_ME = gql`
  query me {
    me {
      _id
      username
      email
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;