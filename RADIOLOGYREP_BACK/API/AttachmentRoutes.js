module.exports = app => {
  const attachment = require("../Controller/AttachmentsController.js");

/**
 * @api {post} /attachment Create an Attachment object
 * @apiName CreateAttachment
 * @apiGroup Attachment
 *
 *
 * @apiSuccess {Object} Attachment information of the created object.
 */
  app.post("/attachment", attachment.create);

/**
 * @api {get} /attachment/all Request collection Attachment information
 * @apiName GetAttachments
 * @apiGroup Attachment
 *
 * @apiSuccess {[Object]} List of Objects with Attachment information.
 *
 *
 */
  app.get("/attachment/all", attachment.findAll);

/**
 * @api {get} /attachment/:AttachmentId Request Attachment information
 * @apiName GetAttachment
 * @apiGroup Attachment
 *
 * @apiParam {Number} id Attachments unique ID.
 *
 * @apiSuccess {Object} Object with Attachment information.
 *
 *
 * @apiError AttachmentNotFound The id of the Attachment was not found.
 *
 */
  app.get("/attachment/:AttachmentId", attachment.findOne);

 /**
 * @api {get} /attachment/owner/:ownerId Request Attachments information through the owner Id
 * @apiName GetAttachmentsByOwner
 * @apiGroup Attachment
 *
 * @apiParam {Number} ownerId Attachments owner Id.
 *
 * @apiSuccess {[Object]} List of Object with Attachment information.
 *
 *
  * @apiError AttachmentNotFound The id of the Attachment was not found.
 *
 */
  app.get("/attachment/owner/:ownerId", attachment.findOneAttachment);

/**
 * @api {put} /attachment/:AttachmentId  Update Attachment information through the Attachment Id
 * @apiName UpdateAttachment
 * @apiGroup Attachment
 *
 * @apiParam {Number} id Attachments unique ID.
 *
 * @apiSuccess {Object} Updated Object with Attachment information.
 *
 *
  * @apiError AttachmentNotFound The id of the Attachment was not found.
 *
 */
  app.put("/attachment/:AttachmentId", attachment.update);

/**
 * @api {delete} /attachment/:AttachmentId  Delete Attachment through the Attachment Id
 * @apiName DeleteAttachment
 * @apiGroup Attachment
 *
 * @apiParam {Number} id Attachments unique ID.
 *
 * @apiSuccess {message} Succesfully deleted.
 *
 *
  * @apiError AttachmentNotFound The id of the Attachment was not found.
 *
 */
  app.delete("/attachment/:AttachmentId", attachment.delete);
};
