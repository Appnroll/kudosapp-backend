'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn(
            'Kudos',
            'points',
            Sequelize.INTEGER
        )
    },

    down: (queryInterface) => {
        return queryInterface.addColumn(
            'Kudos',
            'points'
        )
    }
}
