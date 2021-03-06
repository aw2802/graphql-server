import Sequelize from 'sequelize';
import db from './db-model';

import SubmissionModel from './submission-model';

const UserModel = db.define('user', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
});

export default UserModel;
