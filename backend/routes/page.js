const express = require("express");
const router = express.Router();
const pagesController = require("../controllers/pages.js");

// Legal
router.get("/privacy", pagesController.renderPrivacy);
router.get("/terms", pagesController.renderTerms);

// Support
router.get("/help", pagesController.renderHelp);
router.get("/aircover", pagesController.renderAircover);
router.get("/safety", pagesController.renderSafety);
router.get("/cancellation", pagesController.renderCancellation);

// Hosting
router.get("/host/resources", pagesController.renderResources);
router.get("/host/community", pagesController.renderCommunity);
router.get("/host/insurance", pagesController.renderInsurance);

// Directory
router.get("/sitemap", pagesController.renderSitemap);

module.exports = router;
