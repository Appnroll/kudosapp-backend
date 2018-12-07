const models = require('../models/index')
const Kudos = models['Kudo']

const getAll = () => {
    return Kudos.findAll()
}

const add = ({}) => {

}

module.exports = {
    getAll,
}