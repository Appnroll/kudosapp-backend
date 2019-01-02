const models = require('../models/index')
const Kudos = models['Kudo']

const getAll = () => {
    return Kudos.findAll({
        order: [
            ['createdAt', 'DESC']
        ]
    })
}

const add = ({ to, ...rest }) => {
    return Kudos.create({
        givenTo: to,
        ...rest
    })
}

const calculateRatings = async () => {
    return Kudos.findAll({
        attributes: [
            'givenTo',
            [models.Sequelize.literal('COUNT(*)'), 'totalPoints']
        ],
        group: 'givenTo',
    })
}

module.exports = {
    getAll,
    add,
    calculateRatings,
}