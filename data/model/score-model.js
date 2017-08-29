import Sequelize from 'sequelize';
import db from './db-model';

import UserModel from './user-model';

const ScoreModel = db.define('score', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  total_correct: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  num_games: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  streak: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  user_id: {
    type: Sequelize.INTEGER,
    references: {
      model: UserModel,
      key: 'id'
    }
  },
});

// ScoreModel.hasOne(UserModel, {
//   foreignKey: 'id'
// });

export default ScoreModel;
