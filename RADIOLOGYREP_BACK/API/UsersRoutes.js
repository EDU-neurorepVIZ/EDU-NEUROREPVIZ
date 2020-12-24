module.exports = (app) => {
    const user = require('../Controller/UsersController.js');

/**
 * @api {post} /user
 * @apiName CreateUser
 * @apiGroup User
 *
 *
 * @apiSuccess {Object} User information of the created object.
 */
    app.post('/user', user.create);

/**
 * @api {get} /user/all Request collection User information
 * @apiName GetUsers
 * @apiGroup User
 *
 * @apiSuccess {[Object]} List of Objects with User information.
 *
 *
 */
    app.get('/user/all', user.findAll);

/**
 * @api {get} /user/:UserId Request User information
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess {Object} Object with User information.
 *
 *
 * @apiError UserNotFound The id of the User was not found.
 *
 */
    app.get('/user/:UserId', user.findOne);

    // Retrieve a single user with email
    app.get('/user/email/:UserEmail', user.findOneEmail);

/**
 * @api {put} /user/:UserId  Update User information through the User Id
 * @apiName UpdateUser
 * @apiGroup User
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess {Object} Updated Object with User information.
 *
 *
  * @apiError UserNotFound The id of the User was not found.
 *
 */
    app.put('/user/:UserId', user.update);
/**
 * @api {delete} /user/:UserId  Delete User through the User Id
 * @apiName DeleteUser
 * @apiGroup User
 *
 * @apiParam {Number} id Users unique ID.
 *
 * @apiSuccess {message} Succesfully deleted.
 *
 *
  * @apiError UserNotFound The id of the User was not found.
 *
 */
    app.delete('/user/:UserId', user.delete);
}