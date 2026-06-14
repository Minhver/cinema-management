const express = require('express');
const router = express.Router();
const showtimeController = require('../controllers/showtimeController');

router.get('/', showtimeController.getAllShowtimes);
router.post('/', showtimeController.addShowtime);
router.delete('/:id', showtimeController.deleteShowtime);

module.exports = router;
