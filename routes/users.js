const express = require('express')
const router = express.Router()
const user = require('../schema/users') // get our mongoose model
const controller = require('../controller/userController')
const is = require('is')
const api = require('express-api-docs')
api.generate('app.js', 'public/api.html')
router
  .route('/')

  .get(controller.GET_USERS)

  .post(controller.ADD_USER)

router
  .route('/:id')

  .get(controller.GET_USER)

  .put(controller.UPDATE_USER)

  .delete(controller.DELETE_USER)

module.exports = router
