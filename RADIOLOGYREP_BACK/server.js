const express = require("express");
const bodyParser = require("body-parser");
const config = require("./config.js");

const app = express();

var cors = require("cors");
app.use(cors());

let port = config.serverport;

// parse requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// default route
app.get("/", (req, res) => {
  res.json({ message: "Backend running......" });
});

// Configuring the database

const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');

// Init gfs
let gfs;

app.use(methodOverride('_method'));

require('./API/UsersRoutes.js')(app);  //Add route file here
require('./API/GroupsRoutes.js')(app);  //Add route file here
require('./API/ChallengesRoutes.js')(app);  //Add route file here
require('./API/SubmissionsRoutes.js')(app);  //Add route file here
require('./API/SamplesRoutes.js')(app);  //Add route file here
require('./API/FileRoutes.js')(app);  //Add route file here
require('./API/AttachmentRoutes.js')(app);  //Add route file here
require('./API/FeedbackRoutes.js')(app); //Add route file here


mongoose.Promise = global.Promise;

const conn = mongoose.createConnection(config.url);

	
    	conn.once('open', () => {
  // Init stream
		  gfs = Grid(conn.db, mongoose.mongo);
		  gfs.collection('uploads');
		});

// Connecting to the database
//configure in config.js
mongoose
  .connect(config.url, {
    useNewUrlParser: true
}).then(() => {
    console.log("Successfully connected to the database"); 
    
	}).catch(err => {
    	console.log('Could not connect to the database. Exiting now...', err);
    	process.exit();
});



//Enable CORS for all HTTP methods
app.use(function(req, res, next) {
  res.append("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// listen on port 3000
app.listen(config.serverport, () => {

  console.log("Server is listening on port " + config.serverport);
});

