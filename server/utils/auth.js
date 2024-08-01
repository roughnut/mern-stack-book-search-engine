// import JWT package
const jwt = require("jsonwebtoken");

const secret = "mysecretsshhhhh";
const expiration = "2h";

module.exports = {
  // get token from req object, verify token, add user data to req object
  authMiddleware: function ({ req }) {
    let token = req.body.token || req.query.token || req.headers.authorization;
    
    // Authorization: Bearer <token>
    if (req.headers.authorization) {
      // split Bearer & the token, pop "Bearer" and trim token
      token = token.split(" ").pop().trim();
    }

    if (!token) {
      // return the req object unchanged so unauthenticated request can be handled as necessary
      return req;
    }

    try {
      // verify the token, destructure the payload and add data to the req.user object
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log("Invalid token");
    }

    return req;
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
