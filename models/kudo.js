'use strict';
module.exports = (sequelize, DataTypes) => {
  const Kudo = sequelize.define('Kudo', {
    givenTo: DataTypes.STRING,
    points: DataTypes.INTEGER,
    from: DataTypes.STRING
  }, {});
  Kudo.associate = function(models) {
    // associations can be defined here
  };
  return Kudo;
};