const Attachment = require('../Schemas/Attachment.js');
const Feedback = require('../Schemas/Feedback.js');
const config = require('../config');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const path = require('path');
let gfs;

const conn = mongoose.createConnection(config.url);

    
        conn.once('open', () => {
  // Init stream
          gfs = Grid(conn.db, mongoose.mongo);
          gfs.collection('uploads');
        });


// Retrieve all Samples from the database.
exports.findAll = (req, res) => {
          gfs.files.find().toArray((err, files) => {
            // Check if files
            if (!files || files.length === 0) {
              return res.status(404).json({
                err: 'No files exist'
              });
            }
        
            // Files exist
            return res.json(files);
          });
        };

// Find a single Sample with a SampleId
exports.findOne = (req, res) => {
                     res.set({
                   "Accept-Ranges": "bytes",
                   "Content-Disposition": `attachment; filename=${req.params.filename}`
                 });
                 gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
                   if (!file || file.length === 0) {
                     return res.status(404).json({
                       error: "That File Doesn't Exist"
                     });
                   }

                     res.set('Content-Type', file.contentType)
            
                     // Read output to browser
                     const readstream = gfs.createReadStream(file.filename);
                     readstream.pipe(res);
               
                 });
            }



// Delete a note with the specified noteId in the request
exports.delete = (req, res) => {
          gfs.remove({ _id: req.params.id, root: 'uploads' }, (err, gridStore) => {
            if (err) {
              return res.status(404).json({ err: err });
            }
        
            res.redirect('/');
          })
      };


// Create storage engine
        const storage = new GridFsStorage({
          url: config.url,
          file: (req, file) => {
            return new Promise((resolve, reject) => {
              crypto.randomBytes(16, (err, buf) => {
                if (err) {
                  return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                  filename: filename,
                  bucketName: 'uploads',

                };
                resolve(fileInfo);
              });
            });
          }
        });
        const upload = multer({ storage });
        
      