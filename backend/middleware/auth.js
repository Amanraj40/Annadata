//This imports the jsonwebtoken library, which is used for creating and verifying JWTs.
const jwt = require("jsonwebtoken");
{/*Middleware is like a series of helpers that process incoming requests step-by-step, 
  doing specific tasks like logging, authentication, or data parsing, and then either passing 
  the request to the next helper or sending a response directly. */}
//This defines a middleware function named auth which takes the request (req), response (res), and next middleware function (next) as arguments.
function auth(req, res, next) {
  try {
    //The token is extracted from the cookies of the request.this token was given to user at time of login
    const token = req.cookies.token;
    //f the token is not present, a 401 Unauthorized response is sent.
    if (!token) return res.status(401).json({ errorMessage: "Unauthorized" });

    //The token is verified using a secret stored in the environment variable JWT_SECRET. If the token is valid, the payload (decoded token) is assigned to req.user.
    //if token matches ie user is real, If the token is valid, the decoded user information is added to the request for further use in the application.ie user remains loggedin with their info over there provided by server
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified.user;

    //The next function is called to indicate that the current middleware has finished its task and the next middleware function in the stack should be executed.
    next();


    {/*example of next():-
      
          const express = require('express');
           const app = express();

           function auth(req, res, next) {
             // Authentication logic
              console.log('Auth middleware');
              next();
            }

          function logger(req, res, next) {
           // Logging logic
            console.log('Logger middleware');
           next();
           }

           app.use(auth);//Use auth middleware for all routes
            app.use(logger);//Use logger middleware for all routes

          app.get('/', (req, res) => {
           res.send('Hello, world!');
      });

         app.listen(3000, () => {
        console.log('Server is running on port 3000');
       });

       ## Flow of Execution

 *Incoming Request:
When a request comes to the server, it first hits the auth middleware.
auth performs its checks and calls next().

*Next Middleware:
The request then moves to the logger middleware.
logger performs its logging and calls next().

*Final Route Handler:
After all middleware functions are executed, the request reaches the route handler for the / route.
The route handler sends the response "Hello, world!" to the client.

*conclusion:
Without calling next(), the request would be stuck in the current middleware and never reach the final route handler or any subsequent middleware functions.
            
request received via app.use(---);
Logger Middleware: Logs the request details.
Auth Middleware: Checks if the user is authenticated.
Route Handler: Sends the final response.*/}

  } catch (err) {
    console.error(err);
    res.status(401).json({ errorMessage: "Unauthorized" });
  }
}

module.exports = auth;

{/*
  cookies contains jwt secret key,user details also all data in form of jwt(json type format not decrypt easily)
  How it Works
Client Logs In: When a user logs into your application, the server generates a JWT and sends it to the client.
Storing the JWT: The client stores this JWT in a cookie.
Sending Requests: For every subsequent request to the server, the client's browser automatically includes this cookie.
Authenticating Requests: The server reads the JWT from the cookie to verify the user's identity. 

example:
     Login:

           User sends login credentials (username and password) to the server.
           Server verifies credentials, creates a JWT, and sends it back in a response.
           Client stores the JWT in a cookie.

    Authenticated Request:

            Client makes a request to a protected route.
            Browser includes the JWT cookie in the request.
            Server middleware (like your auth function) reads the JWT from the cookie, verifies it, and determines the user’s identity.
            
            head to next middleware*/}
