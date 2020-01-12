const Sequelize = require('sequelize')
const {DB_DEFATUL_TYPE} = require('../../const')

module.exports = (sequelize, type) => {
  return sequelize.define('task', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
      },
      sourceId: {
        type: type.STRING,
        allowNull: false
      },
      type: {
        type: type.STRING,
        defaultValue: DB_DEFATUL_TYPE,
        allowNull: false
      },      
      title: {
        type: type.STRING,
        allowNull: true
      },
      meta: {
        type: type.STRING,
        allowNull: true,
      },
      status: {
        type: type.STRING,
        allowNull: false,
      }
  })
}