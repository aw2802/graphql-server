import Sequelize from 'sequelize';

import db from './db-model';
import UserModel from './user-model';

const SubmissionModel = db.define('submission', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  image_url: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  score: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  author_id: {
    type: Sequelize.INTEGER,
    references: {
      model: UserModel,
      key: 'id'
    }
  },
});

// SubmissionModel.hasOne(UserModel, {
//   foreignKey: 'author_id'
// });

export default SubmissionModel;
