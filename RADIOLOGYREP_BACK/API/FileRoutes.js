module.exports = (app) => {
    const file = require('../Controller/FileManagement.js');


    const path = require('path');
    const config = require('../config');
    const crypto = require('crypto');
    const mongoose = require('mongoose');
    const multer = require('multer');
    const GridFsStorage = require('multer-gridfs-storage');
    const Grid = require('gridfs-stream');
    let gfs;

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
                  bucketName: 'uploads'
               
                };
                resolve(fileInfo);
              });
            });
          }
        });
        const upload = multer({ storage }).any();
        

/**
 * @api {post} /file
 * @apiName CreateFile
 * @apiGroup File
 *
 *
 * @apiSuccess {Object} File information of the created object.
 */
    app.post('/file',(req, res) => {

    upload(req,res,function(err) {
        if(err) {
            console.log(err);
            return res.end("Error uploading file.");
        } else {
           fileinfo = {}
           req.files.forEach( function(f) {
            fileinfo.originalname = f.originalname
            fileinfo.name = f.filename
            res.send(fileinfo);
           });
           
        }
    });
});

/**
 * @api {get} /file/all Request collection File information
 * @apiName GetFiles
 * @apiGroup File
 *
 * @apiSuccess {[Object]} List of Objects with File information.
 *
 *
 */
    app.get('/file/all', file.findAll);

 /**
 * @api {get} /file/:FileId Request File information
 * @apiName GetFile
 * @apiGroup File
 *
 * @apiParam {Number} id Files unique ID.
 *
 * @apiSuccess {Object} Object with File information.
 *
 *
 * @apiError FileNotFound The id of the File was not found.
 */
    app.get('/file/:filename', file.findOne);

 /**
 * @api {delete} /file/:FileId  Delete File through the File Id
 * @apiName DeleteFile
 * @apiGroup File
 *
 * @apiParam {Number} id Files unique ID.
 *
 * @apiSuccess {message} Succesfully deleted.
 *
 *
  * @apiError FileNotFound The id of the File was not found.
 *
 */
    app.delete('/file/:filename', file.delete);
}