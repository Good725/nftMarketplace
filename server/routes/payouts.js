const express = require("express");
const router = express.Router();
const paypal = require("@paypal/payouts-sdk");
const config = require("../config/config");
const { auth } = require("../middlewares/auth");

// Creating an environment
let clientId =
  config.env === "development"
    ? config.paypal.dev.clientId
    : config.paypal.prod.clientId;
let clientSecret =
  config.env === "development"
    ? config.paypal.dev.clientSecret
    : config.paypal.prod.clientSecret;
let environment =
  config.env === "development"
    ? new paypal.core.SandboxEnvironment(clientId, clientSecret)
    : new paypal.core.LiveEnvironment(clientId, clientSecret);
let client = new paypal.core.PayPalHttpClient(environment);

router.post("/create", auth, async (req, res) => {
  try {
    // Construct a request object and set desired parameters
    // Here, PayoutsPostRequest() creates a POST request to /v1/payments/payouts
    let request = new paypal.payouts.PayoutsPostRequest();
    request.requestBody(req.body);

    // Call API with your client and get a response for your call
    let createPayouts = async function () {
      try {
        let response = await client.execute(request);
        console.log(`Response: ${JSON.stringify(response)}`);
        // If call returns body in response, you can get the deserialized version from the result attribute of the response.
        console.log(
          `Payouts Create Response: ${JSON.stringify(response.result)}`
        );
        res.status(200).json({ success: true });
      } catch (e) {
        if (e.statusCode) {
          //Handle server side/API failure response
          console.log("Status code: ", e.statusCode);
          // Parse failure response to get the reason for failure
          const error = JSON.parse(e.message);
          console.log("Failure response: ", error);
          console.log("Headers: ", e.headers);
        } else {
          //Hanlde client side failure
          console.log(e);
        }
        res.status(500).json({ success: false });
      }
    };
    createPayouts();    
  } catch (e) {
    console.log("PayoutsPostRequest: ", e.message);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
