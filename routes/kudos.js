const express = require('express')
const router = express.Router()
const KudosService = require('../services/kudos')
const request = require('request');

router.get('/', async function (_, res) {
    const results = await KudosService.getAll()
    res.send(results.map(r => mapResponse(r)))
})

router.post('/slack', async (req, res) => {
    const timeWhenResponseUrlIsAvailable = new Date().getTime() + 3001

    res.status(200).send({
        "text": "✅ Thanks for submitting Kudos!"
    })

    const { token, user_name: from, text, response_url } = req.body
    const validToken = process.env.SLACK_TOKEN || 'uguIvg4jtfZ0wQ5r2MOTXBiC'

    if (validToken !== token) {
        return delayedSlackResponse(response_url, timeWhenResponseUrlIsAvailable, {
            "text": "Ooups, something went wrong!",
            "response_type": "ephemeral",
            "attachments": [
                {
                    "text":"Ask your Slack Admin for more details - Auth issue!"
                }
            ]
        })
    }

    const values = text.split(';')
    if (values.length !== 3) {
        return delayedSlackResponse(response_url, timeWhenResponseUrlIsAvailable, {
            "response_type": "ephemeral",
            "text": "Incorrect number of parameters!"
        })
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
        return delayedSlackResponse(response_url, timeWhenResponseUrlIsAvailable, {
            "response_type": "ephemeral",
            "text": "Points must be a number."
        })
    }

    await KudosService.add({
        to: username,
        points,
        description,
        from,
    })

    return delayedSlackResponse(response_url, timeWhenResponseUrlIsAvailable, {
        "response_type": "ephemeral",
        "text": "Kudos awarded successfully 👑"
    })

})

const delayedSlackResponse = (url, timeWhenResponseUrlIsAvailable, reason) => {
    console.log(`raise failure...`, reason, `to`, url, '... waiting ...')
    setTimeout(() => {
            console.log('triggering!')
            request.post({
                url,
                json: reason,
                headers: {'content-type' : 'application/json'}
            }, (err, _, body) => {
                console.log(`failure ${url} resulted in ${err}`, body)
            })
        },
        Math.max(timeWhenResponseUrlIsAvailable - new Date().getTime(), 0) )

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
