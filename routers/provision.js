const router = require('express').Router(),
      e = require('../utils/error'),
      request = require('request-promise'),
      configs = require('../configs');

  /**
   * @route /provision/* invalid
   */
router.route('/').all((req, res, next) => next(new e.NotFound(`Element key not found`)));
router.route('/:elementKey/callback')
  /**
   * @route GET /provision/:elementKey/callback
   * @returns {any} 200 - Created instance
   * @returns {Error}  default - Unexpected error
   */
  .get((req, res, next) => {
    const elementKey = req.params.elementKey;
    const requestOptions = {
      uri: `${configs.baseUrl}/elements/api-v2/instances`,
      method: 'POST',
      headers: {
        Authorization: configs.authHeader,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: {
        element: {
          key: elementKey,
        },
        providerData: {
          ...req.query
        },
        configuration: {
          ...configs[elementKey],
          "oauth.callback.url": `${req.protocol}://${req.get('host')}/provision/${elementKey}/callback`,
          "oauth.api.key": configs[elementKey].apiKey,
          "oauth.api.secret": configs[elementKey].apiSecret,
        },
        name: `${configs.defaultInstanceName}, ${new Date().getTime()}`,
      },
      json: true,
      simple: true
    };

    request(requestOptions)
      .then(body => {
        res.json(body);
      })
      .catch(err => next(new e.InternalServerError(`Failed to create instance ${elementKey}`, err)))
  })
  /**
   * @route non-GET /provision/{elementKey}/callback invalid
   */
  .all((req, res, next) => next(new e.MethodNotAllowed(`${(req.method).toUpperCase()} not allowed on this endpoint`)));


router.route('/:elementKey')
  /**
   * @route GET /handle/:elementKey
   * @returns {any} 301 - Redirect to path
   * @returns {Error}  default - Unexpected error
   */
  .get((req, res, next) => {
    const elementKey = req.params.elementKey;
    const requestOptions = {
      uri: `${configs.baseUrl}/elements/api-v2/elements/${elementKey}/oauth/url`,
      method: 'GET',
      headers: {
        Authorization: configs.authHeader,
        Accept: 'application/json'
      },
      qs: {
        callbackUrl: `${req.protocol}://${req.get('host')}/provision/${elementKey}/callback`,
        ...configs[elementKey]
      },
      json: true,
      simple: true
    };

    request(requestOptions)
      .then(body => {
        res.redirect(body.oauthUrl);
      })
      .catch(err => next(new e.InternalServerError(`Failed to get OAuth URL for ${elementKey}`, err)))
  })
  /**
   * @route non-GET /provision/* invalid
   */
  .all((req, res, next) => next(new e.MethodNotAllowed(`${(req.method).toUpperCase()} not allowed on this endpoint`)));

  module.exports = router;