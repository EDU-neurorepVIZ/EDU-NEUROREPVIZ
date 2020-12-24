module.exports = (app) => {
    const submission = require('../Controller/SubmissionsController.js');

/**
 * @api {post} /submission
 * @apiName CreateSubmission
 * @apiGroup Submission
 *
 *
 * @apiSuccess {Object} Submission information of the created object.
 */
    app.post('/submission', submission.create);

/**
 * @api {get} /submission/all Request collection Submission information
 * @apiName GetSubmissions
 * @apiGroup Submission
 *
 * @apiSuccess {[Object]} List of Objects with Submission information.
 *
 *
 */
    app.get('/submission/all', submission.findAll);

/**
 * @api {get} /submission/:SubmissionId Request Submission information
 * @apiName GetSubmission
 * @apiGroup Submission
 *
 * @apiParam {Number} id Submissions unique ID.
 *
 * @apiSuccess {Object} Object with Submission information.
 *
 *
 * @apiError SubmissionNotFound The id of the Submission was not found.
 *
 */
    app.get('/submission/:SubmissionId', submission.findOne);
/**
 * @api {put} /submission/:SubmissionId  Update Submission information through the Submission Id
 * @apiName UpdateSubmission
 * @apiGroup Submission
 *
 * @apiParam {Number} id Submissions unique ID.
 *
 * @apiSuccess {Object} Updated Object with Submission information.
 *
 *
  * @apiError SubmissionNotFound The id of the Submission was not found.
 *
 */
    app.put('/submission/:SubmissionId', submission.update);

/**
 * @api {delete} /submission/:SubmissionId  Delete Submission through the Submission Id
 * @apiName DeleteSubmission
 * @apiGroup Submission
 *
 * @apiParam {Number} id Submissions unique ID.
 *
 * @apiSuccess {message} Succesfully deleted.
 *
 *
  * @apiError SubmissionNotFound The id of the Submission was not found.
 *
 */
    app.delete('/submission/:SubmissionId', submission.delete);
}