const router = require("express").Router(); 
// Create a new router object from Express to handle routes

const auth = require("../middleware/auth"); 
// Import the auth middleware to protect routes

const { User, Donations, Requests, FoodBank } = require("../models/models"); 
// Import models for User, Donations, Requests, and FoodBank

// Route to get the current user's information
//when we get url user/ only ie / after user give current user information

/*
 router.get("/"):Defines a route that listens for GET requests to the root path ("/").

auth:Middleware function that is executed before the route handler. This middleware typically handles authentication, ensuring that only authenticated users can access this route.

async (req, res) => { ... }:
Defines an asynchronous function that serves as the route handler.
req is the request object, which contains information about the HTTP request.
res is the response object, which is used to send a response back to the client.
The async keyword indicates that this function will handle asynchronous operations, usually involving await.
*/
router.get("/", auth, async (req, res) => { 
    // Define a route for handling HTTP GET requests to the root path ("/")
    // The `auth` middleware is used to ensure the request is authenticated
    // The handler function is asynchronous

    try { 
        // Start a try block to handle potential errors

        console.log("hum yha hain"); 
        // Log a message "hum yha hain" to the console

        const user = await User.find({ _id: req.user }); 
        // Find user(s) by their ID, which is stored in `req.user` by the `auth` middleware
        // `await` pauses the execution until the `User.find` promise is resolved

        console.log(user); 
        // Log the found user(s) information to the console

        res.json(user); 
        // Send the found user(s) information as a JSON response to the client
    } catch (err) { 
        // Catch any errors that occur in the try block

        console.error(err); 
        // Log the error to the console

        res.status(500).send(); 
        // Send a 500 status code (server error) to the client
    }
});


// Route to handle donations
//when we get url user/donate only ie /donate after user goes to handle donations part
router.post("/donate", auth, async (req, res) => { 
    try {
        req.body.userId = req.user; 
        // Add the user ID to the request body

        const date = new Date(); 
        // Create a new Date object

        req.body.date = date.toLocaleTimeString() + " " + date.toLocaleDateString(); 
        // Add formatted date and time to the request body

        const newDonation = new Donations(req.body); 
        // Create a new Donations object with the request body

        const saved = await newDonation.save(); 
        // Save the new donation to the database

        await FoodBank.update(
            { _id: req.body.bankId }, 
            // Find the FoodBank by ID from the request body

            { $push: { donations: { _id: saved._id } } } 
            // Add the new donation's ID to the FoodBank's donations array
        );

        res.send("done"); 
        // Send a "done" response
    } catch (err) {
        console.error(err); 
        // Log any errors to console

        res.status(500).send(); 
        // Send a 500 status code (server error)
    }
});

// Route to handle requests
////when we get url user/request only ie /request after user send requests
router.post("/request", auth, async (req, res) => { 
    try {
        req.body.userId = req.user; 
        // Add the user ID to the request body

        const date = new Date(); 
        // Create a new Date object

        req.body.date = date.toLocaleTimeString() + " " + date.toLocaleDateString(); 
        // Add formatted date and time to the request body

        const newRequest = new Requests(req.body); 
        // Create a new Requests object with the request body

        const saved = await newRequest.save(); 
        // Save the new request to the database

        await FoodBank.update(
            { _id: req.body.bankId }, 
            // Find the FoodBank by ID from the request body

            { $push: { requests: { _id: saved._id } } } 
            // Add the new request's ID to the FoodBank's requests array
        );

        res.send("done"); 
        // Send a "done" response
    } catch (err) {
        console.error(err); 
        // Log any errors to console

        res.status(500).send(); 
        // Send a 500 status code (server error)
    }
});

// Route to get all donations by the current user
////when we get url user/donations only ie /donations after user give user donations details
router.get("/donations", auth, async (req, res) => { 
    try {
        const data = await Donations.find({ userId: req.user })
            .populate('bankId', '-_id -__v -password -requests -donations -stock'); 
        // Find donations by user ID and populate bank details, excluding some fields

        res.json(data); 
        // Send the donations as a JSON response
    } catch (err) {
        console.error(err); 
        // Log any errors to console

        res.status(500).send(); 
        // Send a 500 status code (server error)
    }
});

// Route to get all requests by the current user
////when we get url user/requests only ie /requests after user request history
router.get("/requests", auth, async (req, res) => { 
    try {
        const data = await Requests.find({ userId: req.user })
            .populate('bankId', '-_id -__v -password -requests -donations -stock'); 
        // Find requests by user ID and populate bank details, excluding some fields

        res.json(data); 
        // Send the requests as a JSON response
    } catch (err) {
        console.error(err); 
        // Log any errors to console
    
        res.status(500).send(); 
        // Send a 500 status code (server error)
    }
});
// Route to update the current user's information
//when we get url user/ only ie / after user give current user informatio
router.put("/", auth, async (req, res) => { 
    // Define a route for handling HTTP PUT requests to the root path ("/")
    // The `auth` middleware is used to ensure the request is authenticated
    // The handler function is asynchronous

    try { 
        // Start a try block to handle potential errors

        console.log(req.user); 
        // Log the authenticated user's ID to the console

        User.updateOne({ _id: req.user }, req.body, (err, user) => { 
            // Use Mongoose's `updateOne` method to update the user's document in the database
            // Find the user by their ID (stored in `req.user` from the `auth` middleware)
            // Update the user's document with the data in `req.body`
            // The callback function handles the result of the update operation

            if (err) { 
                // Check if there was an error during the update

                res.send(404, "User not found"); 
                // If there was an error, send a 404 status code with the message "User not found"
            } else { 
                // If there was no error

                res.send(200, "User updated"); 
                // Send a 200 status code with the message "User updated"
            }
        });
    } catch (err) { 
        // Catch any errors that occur in the try block

        console.error(err); 
        // Log the error to the console

        res.status(500).send(); 
        // Send a 500 status code (server error)
    }
});


module.exports = router; 
// Export the router to use it in other parts of the application
