// import graphQLError - note this is a built in class in more recent graphql versions so AuthenicationError is not needed from /utils/auth
const { GraphQLError } = require("graphql");
// import User model
const { User } = require("../models");
// import signToken function
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    // the only query needed is to get the logged-in user and their data
    me: async (parent, args, context) => {
        // the context object includes authenitcation data if available
        // check if there is an authenticated user
      if (context.user) {
        // if auth user, get from User collection
        const userData = await User.findOne({ _id: context.user._id }).select(
            // remove version and password fields
          "-__v -password"
        );
        // return user
        return userData;
      }
      // else throw auth error
      throw new GraphQLError("User not found", {
        extensions: { code: "UNAUTHENTICATED" },
      });
    },
  },

  Mutation: {
    // sign up user
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },
    // login existing user
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new GraphQLError("Could not log in", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new GraphQLError("Could not log in", {
          extensions: { code: "UNAUTHENTICATED" },
        });
      }
      // assign JWT token to user
      const token = signToken(user);
      return { token, user };
    },
    // allow user to persist a book to their user profile
    saveBook: async (parent, { bookData }, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: bookData } },
          { new: true }
        );
        return updatedUser;
      }
      throw new GraphQLError("You need to be logged in!", {
        extensions: { code: "UNAUTHENTICATED" },
      });
    },
    // allow user to remove a persisted book from their profile
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
        return updatedUser;
      }
      throw new GraphQLError("You need to be logged in!", {
        extensions: { code: "UNAUTHENTICATED" },
      });
    },
  },
};

module.exports = resolvers;