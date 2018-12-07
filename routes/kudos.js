const express = require('express')
const router = express.Router()
const KudosService = require('../services/kudos')

router.get('/', async function (_, res) {
    const results = await KudosService.getAll()
    res.send(results.map(r => mapResponse(r)))
})

router.post('/', async function (req, res) {
    const {
        username,
        points,
        description,
    } = req.body

    console.log(req.body)
    if (!username || !points || !description) {
        return res.status(400).send({ error: 'Incorrect request.' })
    }


    const newKudos = await KudosService.add({
        to: username,
        points,
        description,
    })
    res.send(mapResponse(newKudos))
})

const mapResponse = (instance) => ({
    name: instance.givenTo,
    description: instance.description,
    points: instance.points,
})

module.exports = router
