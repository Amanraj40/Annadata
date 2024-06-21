const router = require("express").Router();
// Create a new router object from Express to handle routes

const auth = require("../middleware/auth");
// Import the auth middleware to protect routes

const { User, FoodBank, Donations, Requests, Camp } = require("../models/models");
// Import the models

// Route to search for banks based on criteria in the request body
router.post("/:handle", auth, async (req, res) => {
    try {
        const filter = req.params.handle == "bank" ? {} : { password: 0, requests: 0, donations: 0, stock: 0, __v: 0 };
        // Define the filter to exclude certain fields if handle is not "bank"

        const banks = await FoodBank.find(req.body, filter);
        // Find FoodBanks based on the request body and apply the filter

        res.json(banks);
        // Send the found banks as a JSON response
    } catch (err) {
        console.error(err);
        // Log any errors to console

        res.status(500).send();
        // Send a 500 status code (server error)
    }
});

// Route to get all banks filtered by state and district
router.get("/allBanks/:state/:district", async (req, res) => {
    try {
        const banks = await FoodBank.find({ state: req.params.state, district: req.params.district }, { password: 0, _id: 0, donations: 0, requests: 0, stock: 0 });
        // Find banks by state and district, excluding certain fields

        res.json(banks);
        // Send the found banks as a JSON response
    } catch (err) {
        console.error(err);
        // Log any errors to console

        res.status(500).send();
        // Send a 500 status code (server error)
    }
});

// Route to update food stock in a bank
router.put("/updateStock", auth, async (req, res) => {
    try {
        const prevStock = await FoodBank.findOne({ _id: req.user }, { stock: 1 });
        // Find the current stock of the authenticated user's food bank

        await FoodBank.updateOne(
            { _id: req.user },
            { $set: { ["stock." + req.body.foodGroup]: prevStock.stock[req.body.foodGroup] + req.body.units } }
        );
        // Update the stock of the specified food group by adding the given units

        res.status(200).send();
        // Send a 200 status code (OK)
    } catch (err) {
        console.error(err);
        // Log any errors to console

        res.status(500).send();
        // Send a 500 status code (server error)
    }
});

// Route to delete food stock from a bank
router.put("/deleteStock", auth, async (req, res) => {
    try {
        const prevStock = await FoodBank.findOne({ _id: req.user }, { stock: 1 });
        // Find the current stock of the authenticated user's food bank

        if (prevStock.stock[req.body.foodGroup] < req.body.units) {
            res.status(404).send("Not enough food");
            // If the current stock is less than the units to be removed, send a 404 status with an error message
        } else {
            await FoodBank.updateOne(
                { _id: req.user },
                { $set: { ["stock." + req.body.foodGroup]: prevStock.stock[req.body.foodGroup] - req.body.units } }
            );
            // Update the stock of the specified food group by subtracting the given units

            res.status(200).send();
            // Send a 200 status code (OK)
        }
    } catch (err) {
        console.error(err);
        // Log any errors to console

        res.status(500).send();
        // Send a 500 status code (server error)
    }
});

// Route to get the stock of the authenticated user's food bank
router.get("/getStock", auth, async (req, res) => {
    try {
        const data = await FoodBank.findOne(
            { _id: req.user },
            { _id: 0, stock: 1 }
        );
        // Find the stock of the authenticated user's food bank, excluding the _id field

        res.status(200).send(data);
        // Send the stock data as a response
    } catch (err) {
        console.error(err);
        // Log any errors to console

        res.status(500).send();
        // Send a 500 status code (server error)
    }
});

// Route to update the status of a donation
router.put("/donations", auth, async (req, res) => {
    try {
        Donations.updateOne({ _id: req.body.id }, { status: req.body.status }, (err, user) => {
            if (err) {
                res.status(404).send("Donation not found");
                // If there's an error, send a 404 status with an error message
            } else {
                res.status(200).send("Status updated");
                // If successful, send a 200 status with a success message
            }
        });
    } catch (err) {
        console.error(err);
        // Log any errors to console

        res.status(500).send();
        // Send a 500 status code (server error)
    }
});

// Route to update the status of a request
router.put("/requests", auth, async (req, res) => {
    try {
        Requests.updateOne({ _id: req.body.id }, { status: req.body.status }, (err, user) => {
            if (err) {
                res.status(404).send("Request not found");
                // If there's an error, send a 404 status with an error message
            } else {
                res.status(200).send("Status updated");
                // If successful, send a 200 status with a success message
            }
        });
    } catch (err) {
        console.error(err);
        // Log any errors to console

        res.status(500).send();
        // Send a 500 status code (server error)
    }
});

// Route to get all donations for the authenticated user's food bank
router.get("/donations", auth, async (req, res) => {
    try {
        const data = await Donations.find({ bankId: req.user })
            .populate('userId', '-__v -password -requests -donations -stock');
        // Find donations by the authenticated user's bankId and populate the userId field, excluding certain fields

        res.json(data);
        // Send the data as a JSON response
    } catch (err) {
        console.error(err);
        // Log any errors to console

        res.status(500).send();
        // Send a 500 status code (server error)
    }
});

// Route to get all requests for the authenticated user's food bank
router.get("/requests", auth, async (req, res) => {
    try {
        const data = await Requests.find({ bankId: req.user })
            .populate('userId', '-__v -password -requests -donations -stock');
        // Find requests by the authenticated user's bankId and populate the userId field, excluding certain fields

        res.json(data);
        // Send the data as a JSON response
    } catch (err) {
        console.error(err);
        // Log any errors to console

        res.status(500).send();
        // Send a 500 status code (server error)
    }
});

// Route to update the authenticated user's food bank details
router.put("/", auth, async (req, res) => {
    try {
        console.log(req.user);
        // Log the authenticated user's ID to console

        FoodBank.updateOne({ _id: req.user }, req.body, (err, user) => {
            if (err) {
                res.status(404).send("FoodBank not found");
                // If there's an error, send a 404 status with an error message
            } else {
                res.status(200).send("FoodBank updated");
                // If successful, send a 200 status with a success message
            }
        });
    } catch (err) {
        console.error(err);
        // Log any errors to console

        res.status(500).send();
        // Send a 500 status code (server error)
    }
});

module.exports = router;
// Export the router to use it in other parts of the application

/*
POST ' /:handle:'-> Finds food banks based on request body criteria, filtered by handle.
GET '/allBanks/:state/:district:'-> Gets all food banks in specified state and district.
PUT '/updateStock:'-> Updates the stock of a specified food group.
PUT '/deleteStock:'-> Decreases the stock of a specified food group, ensuring enough stock is available.
GET '/getStock:'-> Retrieves the stock information for the authenticated user's food bank.
PUT '/donations:'-> Updates the status of a specified donation.
PUT '/requests:'-> Updates the status of a specified request.
GET '/donations:'-> Gets all donations for the authenticated user's food bank, with populated user details.
GET '/requests:' ->Gets all requests for the authenticated user's food bank, with populated user details.
PUT '/: Updates'-> the authenticated user's food bank details.
 */
