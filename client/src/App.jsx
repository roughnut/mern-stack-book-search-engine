import "./App.css";
// Outlet renders components from RouterProvider in main.jsx
import { Outlet } from "react-router-dom";
// import apollo client methods
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from "@apollo/client";
// import setContext to modify request headers for authentication 
import { setContext } from "@apollo/client/link/context";

import Navbar from "./components/Navbar";

// create graphql link to use with apollo client
const httpLink = createHttpLink({
  uri: "/graphql",
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem("id_token");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});
// create apollo client instance
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    // make Apollo client available to the whole app (avoids prop drilling)
    <ApolloProvider client={client}>
      {/* render remaining components */}
      <Navbar />
      {/* import child component routes defined by RouterProvider in main.jsx*/}
      <Outlet />
    </ApolloProvider>
  );
}

export default App;