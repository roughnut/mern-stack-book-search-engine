// import graphql-tag library to parse GraphQL queries
const gql = require("graphql-tag");

// define GraphQL schema using gql template literal parser
const typeDefs = gql`
# define User, Book and Auth types
  type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: Int
    savedBooks: [Book]
  }

  type Book {
    bookId: ID!
    authors: [String]
    description: String
    title: String!
    image: String
    link: String
  }

  type Auth {
    token: ID!
    user: User
  }
# define BookInput type to save book data from Google Books API
  input BookInput {
    authors: [String]
    description: String!
    title: String!
    bookId: String!
    image: String
    link: String
  }
# define Query type to get authenticated user data
  type Query {
    me: User
  }
# define mutations to create a user, login, save and remove saved books
  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookData: BookInput!): User
    removeBook(bookId: ID!): User
  }
`;

module.exports = typeDefs;