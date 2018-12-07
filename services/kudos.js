const models = require('../models/index')
const Kudos = models['Kudo']

const getAll = () => {
    return Kudos.findAll()
}

const add = ({ to, ...rest }) => {
    return Kudos.create({
        givenTo: to,
        ...rest
    })
}

module.exports = {
    getAll,
    add,
}