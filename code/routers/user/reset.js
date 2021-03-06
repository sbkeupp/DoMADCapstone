const express = require('express');
const passport = require('passport');
const router = express.Router();


const User = require('../../models/user');

var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");

/*
  forgot password api

  let's users reset their password and redirect
  them to the login page
*/


router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          //req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        auth: {
          type: "login",
          user: "DoMADworldwide@gmail.com",
          pass: "Newaccount8",
        }
      });

      var mailOptions = {
        to: user.email,
        from: 'DoMADworldwide@gmail.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://domad.herokuapp.com' + '/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/login');
  });
});

router.get('/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      console.log("Password reset token is invalid or has expired in get method")
      return res.redirect('/:token');
    }
    console.log("returning token: " + req.params.token)
    res.redirect('token', {token: req.params.token});
  });
});

router.post('/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        console.log("found user: "+ user)

        if (!user) {
          console.log("Password reset token is invalid or has expired")
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {

          user.setPassword(req.body.password);

          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;

          user.save(function(err) {
            req.logIn(user, function(err) {
              done(err, user);
            });
          });

        } else {
            console.log("Passwords do not match")
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      console.log("sending email")
      var smtpTransport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        auth: {
          type: "login",
          user: "DoMADworldwide@gmail.com",
          pass: "Newaccount8",
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'DoMADworldwide@gmail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('Success! Your password has been changed.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    console.log("No error redirecting to page")
    res.redirect('/login');
  });
});


/*
  contact us api

  sends contact us message to Domad Gmail
*/

router.post('/contact', function(req, res) {


  var name = req.body.firstname + " " + req.body.lastname
  var email = req.body.email
  var message = req.body.message
  var content = `name: ${name} \n email: ${email} \n message: ${message} `

  console.log(content)
  if(req.body.email == "" || req.body.message == "") {
      console.log("Error: Email & body should not be Blank");
      return false;
  }

  var smtpTransport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    auth: {
      type: "login",
      user: "DoMADworldwide@gmail.com",
      pass: "Newaccount8",
    }
  });

  var mailOptions = {
    to: email,
    from: name,
    subject: 'New message from contact us sent by ' + name,
    text: content
  };

  smtpTransport.sendMail(mailOptions, function(err) {
    res.redirect('/contact');
    done(err, 'done');

  });

})


module.exports = router;
