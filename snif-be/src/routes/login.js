var express = require('express');
var router = express.Router();
var User = require('../models/user.model.js');

router.post('/', (req, res, next) => {
  if (req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, (error, user) => {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        res.status(401);
        return res.json({
          message: error.message,
          error: error
        });
      } else {
        req.session.userId = user._id;
        res.status(200);
        return res.json({ message: "Login successful" });
      }
    });
  } else {
    var err = new Error('All fields required.');
    res.status(400);
    return res.json({
      message: err.message,
      error: err
    });
  }
})

module.exports = router;
