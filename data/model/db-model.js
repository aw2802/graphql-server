import Sequelize from 'sequelize';

//TODO: move into dotenv like situation
const db = new Sequelize(
  '',   //database
  '',       //username
  '',  //password
  {
    dialect: 'mysql',
    underscored: true,
    timestamps: true
  }
);

export default db;
