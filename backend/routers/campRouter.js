const router = require("express").Router();
// Create a new router object from Express to handle routes

const auth = require("../middleware/auth");
// Import the auth middleware to protect routes

const { Camp } = require("../models/models");
// Import the Camp model

// Route to create a new camp
router.post("/", auth, async (req, res) => {
    try {
        req.body.bankId = req.user;
        // Add the authenticated user's ID as bankId in the request body

        req.body.donors = [];
        // Initialize the donors field as an empty array

        const newCamp = new Camp(req.body);
        // Create a new Camp object with the request body

        await newCamp.save();
        // Save the new camp to the database

        res.status(200).send();
        // Send a 200 status code (OK) as the response
    } catch (err) {
        console.error(err);
        // Log any errors to console

        res.status(500).send();
        // Send a 500 status code (server error)
    }
});

// Route to get camps, optionally filtered by state and district
router.get("/:state?/:district?", auth, async (req, res) => {
    try {
        let query = {};
        // Initialize an empty query object

        if (req.params.state) {
            query.state = req.params.state;
            // Add state to the query if provided in the URL

            query.district = req.params.district;
            // Add district to the query if provided in the URL
        } else {
            query.bankId = req.user;
            // Otherwise, query for camps associated with the authenticated user's bankId
        }

        const data = await Camp.find(query)
            .populate('bankId', '-_id -__v -password -requests -donations -stock')
            // Populate the bankId field, excluding certain fields

            .populate({
                path: "donors._id",
                select: '-__v -password'
                // Populate the donors' _id field, excluding certain fields
            });

        res.json(data);
        // Send the data as a JSON response
    } catch (err) {
        console.error(err);
        // Log any errors to console

        res.status(500).send();
        // Send a 500 status code (server error)
    }
});

// Route to get all camps filtered by state, district, and date
router.get("/allCamps/:state/:district/:date", async (req, res) => {
    try {
        if (req.params.date) {
            const data = await Camp.find({
                state: req.params.state,
                district: req.params.district,
                date: new Date(req.params.date)
                // Query camps by state, district, and date
            }, { donors: 0, _id: 0 })
            // Exclude donors and _id fields from the result

            .populate("bankId", "-_id -password -donations -requests -stock +name");
            // Populate the bankId field, excluding certain fields but including the name field

            res.json(data);
            // Send the data as a JSON response
        } else {
            res.json({});
            // If no date is provided, send an empty object as the response
        }
    } catch (err) {
        console.error(err);
        // Log any errors to console

        res.status(500).send();
        // Send a 500 status code (server error)
    }
});

// Route to update camp details
router.put("/:id/:userId?", auth, async (req, res) => {
    try {
        if (req.params.userId) {
            await Camp.update(
                {
                    _id: req.params.id,
                    donors: { $elemMatch: { _id: req.params.userId, status: 0 } }
                    // Find camp by ID and donor by userId with status 0
                },
                { $set: { "donors.$.units": req.body.units, "donors.$.status": 1 } }
                // Update donor's units and set status to 1
            );
        } else {
            if (await Camp.find({
                _id: req.params.id,
                donors: { $elemMatch: { _id: req.user } }
            }) != []) {
                await Camp.updateOne(
                    { _id: req.params.id },
                    { $push: { donors: { _id: req.user } } }
                    // Add the authenticated user to the donors array if not already present
                );
            }
        }
        res.status(200).send();
        // Send a 200 status code (OK) as the response
    } catch (err) {
        console.error(err);
        // Log any errors to console

        res.status(500).send();
        // Send a 500 status code (server error)
    }
});

module.exports = router;
// Export the router to use it in other parts of the application
