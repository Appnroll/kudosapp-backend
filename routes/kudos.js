const express = require('express')
const router = express.Router()
const KudosService = require('../services/kudos')

/* GET users listing. */
router.get('/', async function (req, res, next) {
    const results = await KudosService.getAll()
    res.send(results)
})

module.exports = router
