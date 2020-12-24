module.exports = (app) => {
    const group = require('../Controller/GroupsController.js');

/**
 * @api {post} /group
 * @apiName CreateGroup
 * @apiGroup Group
 *
 *
 * @apiSuccess {Object} Group information of the created object.
 */
    app.post('/group', group.create);

 /**
 * @api {get} /group/all Request collection Group information
 * @apiName GetGroups
 * @apiGroup Group
 *
 * @apiSuccess {[Object]} List of Objects with Group information.
 *
 *
 */
    app.get('/group/all', group.findAll);

 /**
 * @api {get} /group/:GroupId Request Group information
 * @apiName GetGroup
 * @apiGroup Group
 *
 * @apiParam {Number} id Groups unique ID.
 *
 * @apiSuccess {Object} Object with Group information.
 *
 *
 * @apiError GroupNotFound The id of the Group was not found.
 *
 */
    app.get('/group/:GroupId', group.findOne);

 /**
 * @api {put} /group/:GroupId  Update Group information through the Group Id
 * @apiName UpdateGroup
 * @apiGroup Group
 *
 * @apiParam {Number} id Groups unique ID.
 *
 * @apiSuccess {Object} Updated Object with Group information.
 *
 *
  * @apiError GroupNotFound The id of the Group was not found.
 *
 */
    app.put('/group/update/:GroupId', group.update);

    // Update a Note with groupId
    app.put('/group/addProfessor/:GroupId', group.addProfessor);

    // Update a Note with groupId
    app.put('/group/addStudent/:GroupId', group.addStudent);

        // Update a Note with groupId
    app.put('/group/deleteProfessor/:GroupId', group.deleteProfessor);

    // Update a Note with groupId
    app.put('/group/deleteStudent/:GroupId', group.deleteStudent);

/**
 * @api {delete} /group/:GroupId  Delete Group through the Group Id
 * @apiName DeleteGroup
 * @apiGroup Group
 *
 * @apiParam {Number} id Groups unique ID.
 *
 * @apiSuccess {message} Succesfully deleted.
 *
 *
  * @apiError GroupNotFound The id of the Group was not found.
 *
 */
    app.delete('/group/:GroupId', group.delete);
}