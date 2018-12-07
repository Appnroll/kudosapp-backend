const express = require('express')
const router = express.Router()
const KudosService = require('../services/kudos')

router.get('/', async function (_, res) {
    const results = await KudosService.getAll()
    res.send(results.map(r => mapResponse(r)))
})

router.post('/slack', async (req, res) => {
    const { token, user_name: from, text, response_url } = req.body
    console.log(token, from, text, response_url)
    const validToken = process.env.SLACK_TOKEN || 'uguIvg4jtfZ0wQ5r2MOTXBiC'

    if (validToken !== token) {
        raiseFailureToSlack(response_url, 'Incorrect token provided.')
        res.status(401).send({ error: 'Unauthorized.' })
        return
    }

    const values = text.split(';')
    if (values.length !== 3) {
        raiseFailureToSlack(response_url, 'Incorrect number of parameters.')
        res.status(400).send({ error: 'Wrong parameters' })
        return
    }

    const username = values[0]
    const description = values[1]
    const pointsText = values[2]
    let points
    try {
        points = parseInt(pointsText)
    } catch (e) {
    }

    if (points != pointsText) {
        raiseFailureToSlack(response_url, 'Points must be a number.')
        res.status(400).send({ error: 'Points must be a number' })
        return
    }
    console.log(`adding kudos!`, {
        to: username,
        points,
        description,
        from,
    })

    await KudosService.add({
        to: username,
        points,
        description,
        from,
    })
})

const raiseFailureToSlack = (url, reason) => {
    console.log(`raise failure...`, reason)
}

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
    const results = await KudosService.calculateRatings()
    res.send(results.map(r => ({
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
