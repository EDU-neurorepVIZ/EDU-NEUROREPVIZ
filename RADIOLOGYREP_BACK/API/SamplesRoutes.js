module.exports = (app) => {
    const sample = require('../Controller/SamplesController.js');

/**
 * @api {post} /sample
 * @apiName CreateSample
 * @apiGroup Sample
 *
 *
 * @apiSuccess {Object} Sample information of the created object.
 */
    app.post('/sample', sample.create);

 /**
 * @api {get} /sample/all Request collection Sample information
 * @apiName GetSamples
 * @apiGroup Sample
 *
 * @apiSuccess {[Object]} List of Objects with Sample information.
 *
 *
 */
    app.get('/sample/all', sample.findAll);

 /**
 * @api {get} /sample/:SampleId Request Sample information
 * @apiName GetSample
 * @apiGroup Sample
 *
 * @apiParam {Number} id Samples unique ID.
 *
 * @apiSuccess {Object} Object with Sample information.
 *
 *
 * @apiError SampleNotFound The id of the Sample was not found.
 *
 */
    app.get('/sample/:SampleId', sample.findOne);

 /**
 * @api {put} /sample/:SampleId  Update Sample information through the Sample Id
 * @apiName UpdateSample
 * @apiGroup Sample
 *
 * @apiParam {Number} id Samples unique ID.
 *
 * @apiSuccess {Object} Updated Object with Sample information.
 *
 *
  * @apiError SampleNotFound The id of the Sample was not found.
 *
 */
    app.put('/sample/:SampleId', sample.update);

/**
 * @api {delete} /sample/:SampleId  Delete Sample through the Sample Id
 * @apiName DeleteSample
 * @apiGroup Sample
 *
 * @apiParam {Number} id Samples unique ID.
 *
 * @apiSuccess {message} Succesfully deleted.
 *
 *
  * @apiError SampleNotFound The id of the Sample was not found.
 *
 */
    app.delete('/sample/:SampleId', sample.delete);
}