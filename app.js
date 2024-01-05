//imports
require("dotenv").config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
//const bcrypt = require("bcrypt");
//const saltRounds = 10;
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption")
const session = require("express-session");
//const passport = require("passport");
//const passportLocalMongoose= require("passport-local-mongoose");

const app = express();

app.get('/liveness_check', (req, res) => res.status(200).send('OK'));
app.get('/readiness_check', (req, res) => res.status(200).send('OK'));

// to view things in .env file
//console.log(process.env.SECRET);
op = 0;
on = 0;
ap = 0;
an = 0;
bp = 0;
bn = 0;
abp = 0;
abn = 0;
var email1= "";

// always type this when using bodyParser
app.use(express.urlencoded({
  extended: true
}));

//static files
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));
app.use("/js", express.static(__dirname + "public/js"));
app.use("/img", express.static(__dirname + "public/img"));

// set views
app.set("views", "./views");
app.set("view engine", "ejs");

// app.use(session({
//   secret: "bisola oladipo secret.",
//   resave: false,
//   saveUninitialized: false
// }));
//
// app.use(passport.initialize());
// app.use(passport.session());

// connect to database
// mongoose.connect("mongodb+srv://bloodbankms1:bloodms1@bbms.77ztf1f.mongodb.net/?retryWrites=true&w=majority")
// mongoose.connect(process.env.MONGODB_URI)
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });


// Users schema
const userSchema = new mongoose.Schema({
  hospital: String,
  location: String,
  username: String,
  password: String
});

const secret = "final$$year%%!!P";
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

//userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

// Users schema
const adminSchema = new mongoose.Schema({
  hospital: String,
  location: String,
  username: String,
  password: String
});

const secret1 = "adminsignup3£";
adminSchema.plugin(encrypt, { secret: secret1, encryptedFields: ["password"] });

//userSchema.plugin(passportLocalMongoose);

const Admin = new mongoose.model("Admin", adminSchema);

// passport.use(User.createStrategy());
//
// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// contact schema
const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: Number,
  message: String
});

const Contact = new mongoose.model("Contact", contactSchema);

// donate schema
const donateSchema = new mongoose.Schema({
  age: String,
  sex: String,
  blood_group: String,
  genotype: String,
  email: String,
  phone: Number
});

const Donation = new mongoose.model("Donation", donateSchema);

// request schema
const requestSchema = new mongoose.Schema({
  hospital: String,
  blood_group: String,
  quantity: String,
  branch: String,
  email: String
});

const Request = new mongoose.model("Request", requestSchema);

app.get("", function(req, res) {
  res.render("index");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/logout", function(req, res) {
  res.render("index");
});

app.get("/signup", function(req, res) {
  res.render("signup");
});

app.get("/admin-signup", function(req, res) {
  res.render("admin-signup");
});

app.get("/admin-login", function(req, res) {
  res.render("admin-login");
});

app.get("/contact", function(req, res) {
  res.render("contact");
});

app.get("/request2", function(req, res) {
  res.render("request");
});

app.get("/request-admin", function(req, res) {
    Request.find({"hospital": {$ne: null}, "blood_group": {$ne: null}, "quantity": {$ne: null}, "email": {$ne: null}})
    .then(function(foundUsers) {
      res.render("request-admin", {hos: foundUsers});
    })
    .catch(function(err) {
      console.log(err);
    });
});

app.get("/request", function(req, res) {
  // if (req.isAuthenticated()){
  //   console.log("true")
  //   res.render("request");
  // } else {
  //   res.redirect("/login");
  // }
  res.redirect("/login");
});

app.get("/blood-bank", function(req, res) {
    res.render("blood-bank", {op:op, on:on, ap:ap, an:an, bp:bp, bn:bn, abp:abp, abn:abn});
});

app.get("/donate", function(req, res) {
  res.render("donate");
});

// user post
 app.post("/signup", function(req, res) {
     const newUser = new User({
       username: req.body.email,
       password: req.body.password,
       hospital: req.body.hospital,
       location: req.body.location
     });
     newUser.save()
     .then(function(){
       res.render("login");
    })
     .catch(function(err){
       console.log(err);
     });
   });

   // admin post
    app.post("/admin-signup", function(req, res) {
        const newUser = new Admin({
          username: req.body.email,
          password: req.body.password,
          hospital: req.body.hospital,
          location: req.body.location
        });
        newUser.save()
        .then(function(){
          res.render("admin-login");
       })
        .catch(function(err){
          console.log(err);
        });
      });

// login post
 app.post("/login", function(req, res) {
   const username = req.body.email;
   const password = req.body.password;

   User.findOne({username: username})
   .then(function(foundUser){
      if (foundUser){
        if (foundUser.password === password){
          res.render("request");
        }
      }
      if (!foundUser) {
        return res.status(401).send('Unauthorized');
      }
     })
   .catch(function(err){
     console.log(err);
   });
 });

 // Admin login post
  app.post("/admin-login", function(req, res) {
    const username = req.body.email;
    const password = req.body.password;

    Admin.findOne({username: username})
    .then(function(foundUser){
       if (foundUser){
         if (foundUser.password === password){
           res.render("blood-bank");
         }
       }
       if (!foundUser) {
         return res.status(401).send('Unauthorized');
       }
      })
    .catch(function(err){
      console.log(err);
    });
  });

// contact post
app.post("/contact", function(req, res) {
  const name = req.body.name;
  const emailAddress = req.body.email;
  const tel = req.body.phone;
  const mess = req.body.message;

  const contact = new Contact({
    name: name,
    email: emailAddress,
    phone: tel,
    message: mess
  });

  contact.save();
  res.redirect("/contact");
});

// request post
app.post("/request", function(req, res) {
    const hospital = req.body.hospital;
    const blood_group = req.body.blood_group;
    const quantity = req.body.quantity;
    const branch = req.body.branch;
    email1 = req.body.email;

    const request = new Request({
      hospital: hospital,
      blood_group: blood_group,
      quantity: quantity,
      branch: branch,
      email: email1
    });

    request.save();
    res.redirect("/request2");
});

// donate post
app.post("/donate", function(req, res) {
  const age = req.body.age;
  const sex = req.body.sex;
  const blood_group = req.body.blood_group;
  const genotype = req.body.genotype;
  const email = req.body.email;
  const phone = req.body.phone;
  const qty = Number(req.body.quantity);

  const donation = new Donation({
    age: age,
    sex: sex,
    blood_group: blood_group,
    genotype: genotype,
    email: email,
    phone: phone
  });

  donation.save();
  if(blood_group === "O+"){
    op+=qty
  }else if (blood_group === "O-") {
    on+=qty
  }else if (blood_group === "A+") {
    ap+=qty
  }else if (blood_group === "A-") {
    an+=qty
  }else if (blood_group === "B+") {
    bp+=qty
  }else if (blood_group === "B-") {
    bn+=qty
  }else if (blood_group === "AB+") {
    abp+=qty
  }else if (blood_group === "AB-") {
    abn+=qty
  }
  res.redirect("/donate");
});

// approve POST
app.post("/approve", function(req, res) {
    // setting up automated email
  async function main() {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'bloodbankms1@gmail.com', // generated ethereal user
      pass: 'rqyorzdcnzbzmijr', // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({

    from: '"Blood Bank Management" <bloodbankms1@gmail.com>', // sender address
    to: email1,// list of receivers
    subject: "Blood Request", // Subject line
    text: "We have approved your blood request", // plain text body
    html: "<b>Your request for blood has been approved. Kindly contact us for more information on how to pick up. </b>", // html body
  });
  console.log("Message sent: %s", info.messageId);
// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

// Preview only available when sending through an Ethereal account
console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
main().catch(console.error);
res.redirect("/request-admin")
});

// reject POST
app.post("/reject", function(req, res) {
    // setting up automated email
  async function main() {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'bloodbankms1@gmail.com', // generated ethereal user
      pass: 'rqyorzdcnzbzmijr', // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({

    from: '"Blood Bank Management" <bloodbankms1@gmail.com>', // sender address
    to: email1,// list of receivers
    subject: "Blood Request", // Subject line
    text: "We have rejected your blood request", // plain text body
    html: "<b>Your request for blood has been rejected. This could be because we are out of the requested blood at the moment. Please try again later or contact us for more information. </b>", // html body
  });
  console.log("Message sent: %s", info.messageId);
// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

// Preview only available when sending through an Ethereal account
console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
main().catch(console.error);
res.redirect("/request-admin")
});

// Listen on port 3000
// app.listen(8080, function() {
//   console.log("Server 8080 started");
// });
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
