'use strict'

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn(
            'Kudos',
            'description',
            Sequelize.STRING
        )
    },

    down: (queryInterface) => {
        return queryInterface.removeColumn(
            'Kudos',
            'description'
        )
    }
}
