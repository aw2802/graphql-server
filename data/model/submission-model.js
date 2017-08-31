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
    name: 'submissions_author_id_FK',
    references: {
      model: UserModel,
      key: 'id'
    }
  },
});

export default SubmissionModel;
