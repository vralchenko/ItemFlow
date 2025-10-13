const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.post('/suggest-name', aiController.suggestItemName);

module.exports = router;