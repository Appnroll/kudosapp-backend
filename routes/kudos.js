const express = require('express')
const router = express.Router()
const KudosService = require('../services/kudos')

router.get('/', async function (req, res, next) {
    const results = await KudosService.getAll()
    res.send(results.map(r => ({
        name: r.givenTo,
        description: r.description,
        points: r.points,
    })))
})

module.exports = router
