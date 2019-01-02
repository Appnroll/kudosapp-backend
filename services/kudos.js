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
            [models.Sequelize.literal('SUM(points)'), 'totalPoints']
        ],
        group: 'givenTo',
    })
}

const kudosFromUsers = () => {
    return Kudos.findAll({
        attributes: [
            'from',
            [models.Sequelize.literal(`extract(year from "createdAt")`), 'years'],
            [models.Sequelize.literal(`to_char("createdAt", 'Mon')`), 'mon'],
            [models.Sequelize.literal('COUNT(*)'), 'quantity'],
        ],
        group: ['from', 'mon', 'years']
    })
}

const kudosGivenToUsers = () => {
    return Kudos.findAll({
        attributes: [
            'givenTo',
            [models.Sequelize.literal(`extract(year from "createdAt")`), 'years'],
            [models.Sequelize.literal(`to_char("createdAt", 'Mon')`), 'mon'],
            [models.Sequelize.literal('COUNT(*)'), 'quantity'],
        ],
        group: ['givenTo', 'mon', 'years']
    })
}

module.exports = {
    getAll,
    add,
    calculateRatings,
    kudosFromUsers,
    kudosGivenToUsers
}