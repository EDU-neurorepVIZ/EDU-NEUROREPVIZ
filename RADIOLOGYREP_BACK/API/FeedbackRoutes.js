module.exports = app => {
  const feedback = require("../Controller/FeedbackController.js");

/**
 * @api {post} /feedback Create an Feedback object
 * @apiName CreateFeedback
 * @apiGroup Feedback
 *
 *
 * @apiSuccess {Object} Feedback information of the created object.
 */
  app.post("/feedback", feedback.create);

/**
 * @api {get} /feedback/all Request collection Feedback information
 * @apiName GetFeedbacks
 * @apiGroup Feedback
 *
 * @apiSuccess {[Object]} List of Objects with Feedback information.
 *
 *
 */
  app.get("/feedback/all", feedback.findAll);

/**
 * @api {get} /feedback/:FeedbackId Request Feedback information
 * @apiName GetFeedback
 * @apiGroup Feedback
 *
 * @apiParam {Number} id Feedbacks unique ID.
 *
 * @apiSuccess {Object} Object with Feedback information.
 *
 *
 * @apiError FeedbackNotFound The id of the Feedback was not found.
 *
 */
  app.get("/feedback/:FeedbackId", feedback.findOne);

 /**
 * @api {get} /feedback/owner/:ownerId Request Feedbacks information through the owner Id
 * @apiName GetFeedbacksByOwner
 * @apiGroup Feedback
 *
 * @apiParam {Number} ownerId Feedbacks owner Id.
 *
 * @apiSuccess {[Object]} List of Object with Feedback information.
 *
 *
  * @apiError FeedbackNotFound The id of the Feedback was not found.
 *
 */
  app.get("/feedback/owner/:ownerId", feedback.findOneFeedback);

/**
 * @api {put} /feedback/:FeedbackId  Update Feedback information through the Feedback Id
 * @apiName UpdateFeedback
 * @apiGroup Feedback
 *
 * @apiParam {Number} id Feedbacks unique ID.
 *
 * @apiSuccess {Object} Updated Object with Feedback information.
 *
 *
  * @apiError FeedbackNotFound The id of the Feedback was not found.
 *
 */
  app.put("/feedback/:FeedbackId", feedback.update);

/**
 * @api {delete} /feedback/:FeedbackId  Delete Feedback through the Feedback Id
 * @apiName DeleteFeedback
 * @apiGroup Feedback
 *
 * @apiParam {Number} id Feedbacks unique ID.
 *
 * @apiSuccess {message} Succesfully deleted.
 *
 *
  * @apiError FeedbackNotFound The id of the Feedback was not found.
 *
 */
  app.delete("/feedback/:FeedbackId", feedback.delete);
};
