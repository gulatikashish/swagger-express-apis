const express = require('express')
const router = express.Router()
const user = require('../schema/users')
const crypto = require('crypto')
const is = require('is')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const Boom = require('boom')
/* GET home page. */

const GET_USERS = async (req, res, next) => {
  try {
    let result = await user.find()
    res.status(200).json({ status: 1, data: result })
  } catch (err) {
    res.status(500).send({ status: 0, msg: err })
  }
}
const GET_USER = async (req, res, next) => {
  try {
    // console.log('_+', req.params, '==', req.query)
    let id = req.query.id || req.params.id
    let result = await user.findOne({ _id: id })
    res.status(200).json({ status: 1, data: result })
  } catch (err) {
    res.status(500).send({ status: 0, msg: err })
  }
}

const ADD_USER = async (req, res, next) => {
  let obj = req.body
  let err = []
  if (is.undefined(obj.name) || is.empty(obj.name)) {
    err.push('Name is required')
  }
  if (is.undefined(obj.email_id) || is.empty(obj.email_id)) {
    err.push('Email is required')
  }
  if (is.undefined(obj.password) || is.empty(obj.password)) {
    err.push('password is required')
  }

  if (!is.empty(err)) {
    res.status(400).send({ status: 0, msg: err })
    return
  }
  let hash = crypto
    .createHash('md5')
    .update(obj.password)
    .digest('hex')
  let usr = new user({
    name: obj.name,
    email_id: obj.email_id,
    password: hash,
    role: obj.role
  })
  try {
    let result = await usr.save()
    res.status(200).send({ status: 1, msg: 'inserted', data: result })
  } catch (error) {
    res.status(400).send({ status: 0, msg: error })
  }
}

const UPDATE_USER = async (req, res, next) => {
  let err = []
  let obj = req.body
  let id = req.query.id || req.params.id
  let check = { _id: id }
  let data = req.body
  if (obj.password) {
    let hash = crypto
      .createHash('md5')
      .update(obj.password)
      .digest('hex')
    data.password = hash
  }
  let result = await user.findOneAndUpdate(check, data, { new: true })
  try {
    if (result == null) {
      res.status(500).send({ status: 0, msg: 'no such id exist' })
    } else {
      res.status(200).send({ status: 1, msg: 'updated', data: result })
    }
  } catch (err) {
    res.status(500).send({ status: 0, msg: err })
  }
}

const DELETE_USER = async (req, res, next) => {
  try {
    let id = req.query.id || req.params.id
    let result = await user.find({ _id: id }).remove()
    res.status(200).send({ status: 1, msg: 'deleted' })
  } catch (err) {
    res.status(500).send({ status: 0, msg: err })
  }
}

module.exports = {
  GET_USERS: GET_USERS,
  ADD_USER: ADD_USER,
  UPDATE_USER: UPDATE_USER,
  DELETE_USER: DELETE_USER,
  GET_USER: GET_USER
  // SIGN_IN: SIGN_IN
}
