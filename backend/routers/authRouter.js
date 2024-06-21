// const router = require("express").Router();
// const { User, BloodBank } = require("../models/models");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

// // register

// router.post("/:handle", async (req, res) => {
//     try {
//         // validation
//         const handle = req.params.handle;
//         const existingUser = handle == "bank" ?
//             await BloodBank.findOne({ phone: req.body.phone }) :
//             await User.findOne({ phone: req.body.phone });
//         if (existingUser)
//             return res.status(400).json({
//                 errorMessage: "An account with this email already exists.",
//             });

//         // hash the password

//         const salt = await bcrypt.genSalt();
//         const passwordHash = await bcrypt.hash(req.body.password, salt);
//         req.body.password = passwordHash;
//         // save a new user account to the db

//         const newUser = handle == "bank" ? new BloodBank(req.body) : new User(req.body);
//         const savedUser = await newUser.save();

//         // sign the token
//         const token = jwt.sign({ user: savedUser._id, type: handle }, process.env.JWT_SECRET);

//         // send the token in a HTTP-only cookie

//         res.cookie("token", token, {
//             httpOnly: true,
//             secure: true,
//             sameSite: "none",
//         }).send();
//     } catch (err) {
//         console.error(err);
//         res.status(500).send();
//     }
// });

// // log in

// router.post("/login/:handle", async (req, res) => {
//     try {
//         const { phone, password } = req.body;
//         const handle = req.params.handle;
//         const existingUser = await (handle == "bank" ? BloodBank.findOne({ phone: phone }) : User.findOne({ phone: phone }));
//         if (!existingUser)
//             return res.status(401).json({ errorMessage: "Wrong username or password." });
//         const passwordCorrect = await bcrypt.compare(
//             password,
//             existingUser.password
//         );
//         if (!passwordCorrect)
//             return res.status(401).json({ errorMessage: "Wrong username or password." });

//         // sign the token

//         const token = jwt.sign(
//             {
//                 user: existingUser._id,
//                 type: handle
//             },
//             process.env.JWT_SECRET
//         );

//         // send the token in a HTTP-only cookie

//         res
//             .cookie("token", token, {
//                 httpOnly: true,
//                 secure: true,
//                 sameSite: "none",
//             })
//             .send();
//     } catch (err) {
//         console.error(err);
//         res.status(500).send();
//     }
// });

// router.get("/logout", (req, res) => {
//     res
//         .cookie("token", "", {
//             httpOnly: true,
//             secure: true,
//             sameSite: "none",
//         })
//         .send();
//     console.log("Logged Out")
// });

// router.get("/loggedIn", async (req, res) => {
//     try {
//         const token = req.cookies.token;
//         if (!token) return res.json({ auth: false });
//         const verified = jwt.verify(token, process.env.JWT_SECRET);
//         const user = await (verified.type == "bank" ? BloodBank : User).findOne({ _id: verified.user }, { password: 0, donations: 0, requests: 0, stock: 0, __v: 0 });
//         console.log("logged in")
//         res.send({ auth: true, user: user });
//     } catch (err) {
//         console.log(err);
//         res.json({ auth: false });
//     }
// });

// module.exports = router;

const router = require("express").Router();
// Create a new router object from Express to handle routes

const { User, FoodBank } = require("../models/models");
// Import the User and FoodBank models

const bcrypt = require("bcrypt");
// Import bcrypt for hashing passwords

const jwt = require("jsonwebtoken");
// Import jsonwebtoken for creating and verifying JWT tokens

require('dotenv').config();
// Load environment variables from a .env file

// Register route
router.post("/:handle", async (req, res) => {
    try {
        const handle = req.params.handle;
        // Get the handle (either "bank" or something else) from the URL parameters

        const existingUser = handle == "bank"
            ? await FoodBank.findOne({ phone: req.body.phone })
            : await User.findOne({ phone: req.body.phone });
        // Check if a user or bank already exists with the given phone number

        if (existingUser) {
            return res.status(400).json({ errorMessage: "An account with this email already exists." });
            // If user already exists, send a 400 status code with an error message
        }

        // Hash the password
        const salt = await bcrypt.genSalt();
        // Generate a salt for hashing the password

        const passwordHash = await bcrypt.hash(req.body.password, salt);
        // Hash the password with the generated salt

        req.body.password = passwordHash;
        // Replace the plain text password with the hashed password

        // Save a new user account to the db
        const newUser = handle == "bank" ? new FoodBank(req.body) : new User(req.body);
        // Create a new FoodBank or User instance based on the handle

        const savedUser = await newUser.save();
        // Save the new user to the database

        // Sign the token
        const token = jwt.sign(
            { user: savedUser._id, type: handle },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Optional: Token expiration
        );
        // Create a JWT token with the user's ID and type, using the secret key and setting an expiration time

        // Send the token in a HTTP-only cookie
        //This line of code sets a cookie named token with the JWT token value, ensuring it is only accessible via HTTP(S) requests, only sent over secure connections, and can be used in cross-origin requests. The response is then sent to the client, effectively completing the process of sending the JWT token as a cookie to the client's browser.
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        }).send();
        // Send the token in an HTTP-only, secure cookie with SameSite set to none
    } catch (err) {
        console.error(err);
        // Log any errors to console

        res.status(500).send();
        // Send a 500 status code (server error)
    }
});

// Login route
router.post("/login/:handle", async (req, res) => {
    try {
        const { phone, password } = req.body;
        // Destructure phone and password from the request body

        const handle = req.params.handle;
        // Get the handle from the URL parameters

        const existingUser = await (handle == "bank" ? FoodBank.findOne({ phone }) : User.findOne({ phone }));
        // Find a FoodBank or User based on the handle and phone number

        if (!existingUser) {
            return res.status(401).json({ errorMessage: "Wrong username or password." });
            // If no user is found, send a 401 status code with an error message
        }

        const passwordCorrect = await bcrypt.compare(password, existingUser.password);
        // Compare the given password with the stored hashed password

        if (!passwordCorrect) {
            return res.status(401).json({ errorMessage: "Wrong username or password." });
            // If the password is incorrect, send a 401 status code with an error message
        }

        // Sign the token
        const token = jwt.sign(
            { user: existingUser._id, type: handle },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Optional: Token expiration
        );
        // Create a JWT token with the user's ID and type, using the secret key and setting an expiration time

        // Send the token in a HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        }).send();
        // Send the token in an HTTP-only, secure cookie with SameSite set to none
    } catch (err) {
        console.error(err);
        // Log any errors to console

        res.status(500).send();
        // Send a 500 status code (server error)
    }
});

// Logout route
router.get("/logout", (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    }).send();
    // Clear the token cookie by setting it to an empty string

    console.log("Logged Out");
    // Log a message indicating the user has logged out
});

// Check logged in status
router.get("/loggedIn", async (req, res) => {
    try {
        const token = req.cookies.token;
        // Get the token from the request cookies

        if (!token) return res.json({ auth: false });
        // If no token is found, send a response indicating the user is not authenticated

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        // Verify the token using the secret key

        const user = await (verified.type == "bank" ? FoodBank : User).findOne(
            { _id: verified.user },
            { password: 0, donations: 0, requests: 0, stock: 0, __v: 0 }
        );
        // Find the user or bank by ID, excluding certain fields

        res.send({ auth: true, user });
        // Send a response indicating the user is authenticated along with user data
    } catch (err) {
        console.error(err);
        // Log any errors to console

        res.json({ auth: false });
        // Send a response indicating the user is not authenticated
    }
});

module.exports = router;
// Export the router to use it in other parts of the application


/*
POST '/: handle' -> (Register): Registers a new user or bank. Checks for existing accounts, hashes passwords, saves the user/bank, and sends a JWT token in a cookie.
POST '/login/:'-> handle (Login): Authenticates a user or bank by comparing the provided password with the stored hashed password, then sends a JWT token in a cookie.
GET '/logout:' -> Logs the user out by clearing the JWT token cookie.
GET '/loggedIn:'-> Checks if a user is logged in by verifying the JWT token, then returns the user's data if authenticated. */