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
        from,
    } = req.body

    if (!username || !points || !description || !from) {
        return res.status(400).send({ error: 'Incorrect request.' })
    }

    const newKudos = await KudosService.add({
        to: username,
        points,
        description,
        from,
    })
    res.send(mapResponse(newKudos))
})

router.get('/ranking', async (req, res) => {
    const results = await KudosService.calculateRatings();
    res.send(results.map( r => ({
        name: r.givenTo,
        totalPoints: parseInt(r.dataValues.totalPoints),    // field not available in model, thus would be undefined
    })))
})

const mapResponse = (instance) => ({
    name: instance.givenTo,
    description: instance.description,
    points: instance.points,
    from: instance.from,
})

module.exports = router
