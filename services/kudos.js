const models = require('../models/index')
const Kudos = models['Kudo']

const getAll = () => {
    return Kudo.findAll()
}

module.exports = {
    getAll,
}