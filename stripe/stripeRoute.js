// const express = require('express');
// const router = express.Router();
// const stripeController = require('../controllers/stripeController.js');

// const { chargeCustomer, createConnectedAccount, createAccountLink } = stripeController;

// router.post('/charge', chargeCustomer);
// router.post('/onboard', createConnectedAccount);
// router.post('/account_link', createAccountLink);

// module.exports = router;

// Replace if using a different env file or config
require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const { resolve } = require("path");
const session = require("express-session");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const router = express();

router.use(session({
  secret: "Set this to a random string that is kept secure",
  resave: false,
  saveUninitialized: true,
}))

// Use JSON parser for all non-webhook routes
router.use((req, res, next) => {
  if (req.originalUrl === "/webhook") {
    next();
  } else {
    bodyParser.json()(req, res, next);
  }
});

router.get("/", (req, res) => {
  const path = resolve(process.env.STATIC_DIR + "/index.html");
  res.sendFile(path);
});

router.post("/onboard-user", async (req, res) => {
  try {
    const account = await stripe.accounts.create({type: "express"});
    req.session.accountID = account.id;

    const origin = `${req.headers.origin}`;
    const accountLinkURL = await generateAccountLink(account.id, origin);
    res.send({url: accountLinkURL});
  } catch (err) {
    res.status(500).send({
      error: err.message
    });
  }
});

router.get("/onboard-user/refresh", async (req, res) => {
  if (!req.session.accountID) {
    res.redirect("/");
    return;
  }
  try {
    const {accountID} = req.session;
    const origin = `${req.secure ? "https://" : "https://"}${req.headers.host}`;
    
    const accountLinkURL = await generateAccountLink(accountID, origin)
    res.redirect(accountLinkURL);
  } catch (err) {
    res.status(500).send({
      error: err.message
    });
  }
});

function generateAccountLink(accountID, origin) {
  return stripe.accountLinks.create({
    type: "account_onboarding",
    account: accountID,
    refresh_url: `${origin}/onboard-user/refresh`,
    return_url: `${origin}/addRental`,
  }).then((link) => link.url);
}

// router.listen(port, () => console.log(`Node server listening on port ${port}!`));

module.exports = router;