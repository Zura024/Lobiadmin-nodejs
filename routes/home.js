const express = require('express');

const router = express.Router();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: process.env.SENDGRID_USER,
    pass: process.env.SENDGRID_PASSWORD
  }
});

router.get('/', (req, res) => {
  console.log('c');
  res.render('dashboard', {
    title: 'Dashboard',
    scripts: [{ script: 'js/dashboard.js' }]
  });
});

router.get('/dashboard', (req, res) => {
  console.log('c');
  res.render('dashboard', {
    title: 'Dashboard',
    scripts: [{ script: 'js/dashboard.js' }]
  });
});

router.get('/calendar', (req, res) => {
  console.log('c');
  res.render('dashboard', {
    title: 'Dashboard',
    scripts: [{ script: 'js/dashboard.js' }]
  });
});

router.get('/contact', (req, res) => {
  const unknownUser = !(req.user);

  res.render('contact', {
    title: 'Contact',
    unknownUser,
  });
});
router.post('/contact', (req, res) => {
  let fromName;
  let fromEmail;
  if (!req.user) {
    req.assert('name', 'Name cannot be blank').notEmpty();
    req.assert('email', 'Email is not valid').isEmail();
  }
  req.assert('message', 'Message cannot be blank').notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/contact');
  }

  if (!req.user) {
    fromName = req.body.name;
    fromEmail = req.body.email;
  } else {
    fromName = req.user.profile.name || '';
    fromEmail = req.user.email;
  }

  const mailOptions = {
    to: 'your@email.com',
    from: `${fromName} <${fromEmail}>`,
    subject: 'Contact Form | Hackathon Starter',
    text: req.body.message
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      req.flash('errors', { msg: err.message });
      return res.redirect('/contact');
    }
    req.flash('success', { msg: 'Email has been sent successfully!' });
    res.redirect('/contact');
  });
});

module.exports = router;
