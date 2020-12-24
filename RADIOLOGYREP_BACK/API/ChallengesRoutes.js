module.exports = (app) => {
    const challenge = require('../Controller/ChallengesController.js');

/**
 * @api {post} /challenge
 * @apiName CreateChallenge
 * @apiGroup Challenge
 *
 *
 * @apiSuccess {Object} Challenge information of the created object.
 */
    app.post('/challenge', challenge.create);



/**
 * @api {get} /challenge/all Request collection Challenge information
 * @apiName GetChallenges
 * @apiGroup Challenge
 *
 * @apiSuccess {[Object]} List of Objects with Challenge information.
 *
 *
 */
    app.get('/challenge/all', challenge.findAll);

 

 /**
 * @api {get} /challenge/:ChallengeId Request Challenge information
 * @apiName GetChallenge
 * @apiGroup Challenge
 *
 * @apiParam {Number} id Challenges unique ID.
 *
 * @apiSuccess {Object} Object with Challenge information.
 *
 *
 * @apiError ChallengeNotFound The id of the Challenge was not found.
 *
 */
    app.get('/challenge/:ChallengeId', challenge.findOne);

    
/**
 * @api {put} /challenge/:ChallengeId  Update Challenge information through the Challenge Id
 * @apiName UpdateChallenge
 * @apiGroup Challenge
 *
 * @apiParam {Number} id Challenges unique ID.
 *
 * @apiSuccess {Object} Updated Object with Challenge information.
 *
 *
  * @apiError ChallengeNotFound The id of the Challenge was not found.
 *
 */
    app.put('/challenge/:ChallengeId', challenge.update);

/**
 * @api {delete} /challenge/:ChallengeId  Delete Challenge through the Challenge Id
 * @apiName DeleteChallenge
 * @apiGroup Challenge
 *
 * @apiParam {Number} id Challenges unique ID.
 *
 * @apiSuccess {message} Succesfully deleted.
 *
 *
  * @apiError ChallengeNotFound The id of the Challenge was not found.
 *
 */
    app.delete('/challenge/:ChallengeId', challenge.delete);
}