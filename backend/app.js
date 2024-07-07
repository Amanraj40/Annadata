// Import required modules
const express = require('express'); // Import Express framework
const cors = require("cors"); // Import CORS middleware
const dotenv = require("dotenv"); // Import dotenv to load environment variables
const mongoose = require('mongoose'); // Import Mongoose for MongoDB interaction
const cookieParser = require("cookie-parser"); // Import cookie-parser to handle cookies

// Create an Express application
const app = express();
const port = 3177; // Define the port number the server will listen on

dotenv.config(); // Load environment variables from a .env file

// Use middleware to handle cookies, you have to install and use the cookie-parser library to handle cookies in your Express application.
//cookieParser() helps in accessing the JWT token from cookies in the /protected route, allowing you to implement authentication in a clean and straightforward manner.
app.use(cookieParser());

// Use middleware to parse JSON bodies in requests, you have to install and use the express library to handle cookies in your Express application.
//When a client sends data to your server as JSON (JavaScript Object Notation), express.json() middleware parses this data into a JavaScript object (req.body).
//If a client sends { "username": "john", "password": "password123" } as JSON in a POST request body, express.json() converts it into { username: "john", password: "password123" } accessible via req.body.
app.use(express.json());

// Use CORS middleware to allow cross-origin requests from specified origins
app.use(
	//You have a frontend web application running on http://localhost:3000 and a backend server running on http://localhost:5000. The frontend needs to make a request to the backend to fetch some data.
	//CORS allows cross-origin requests, enabling the fron tend and backend to communicate despite being on different origins.
    cors({
        origin: [
			//origin: ["http://localhost:3000"]: This specifies the origins that are allowed to access the resources of your server. Here, only requests from http://localhost:3000 are allowed. This is useful during development when your client-side application runs on localhost:3000 and your server runs on a different port.
            "http://localhost:3000",
        ],
        credentials: true, // When credentials is set to true, it allows cookies and HTTP authentication information to be included in cross-origin requests.
    })
);

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, (e) => {
    console.log(e ? e : "Connected successfully to database"); // Log connection status
});

// Define routes and associate them with their respective routers 
app.use("/auth", require("./routers/authRouter")); // Routes for authentication
app.use("/user", require("./routers/userRouter")); // Routes for user operations
app.use("/bank", require("./routers/bankRouter")); // It directs any request that starts with /bank (like /bank/transfer or /bank/balance) to be handled by the code in bankRouter.The bankRouter file contains all the routes and logic for bank-related tasks.o, if a user tries to check their balance by accessing /bank/balance, the app will use the bankRouter to handle that request.
app.use("/camps", require("./routers/campRouter")); // Routes for camp operations

// Start the server and listen on the specified port
app.listen(port, () =>
    console.log(`Server running at http://localhost:${port}`) // Log the server URL
);
