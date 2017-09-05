import UserModel from '../model/user-model';
import SubmissionModel from '../model/submission-model';
import db from '../model/db-model';

import { UserType } from './variable-types';

export function fetchSubmissions(args) {
  const query = {};

  query.limit = args.count || 1;

  if (args.author_id !== undefined ) {
    query.where = { author_id: args.author_id };
  }

  if (
    args.offset !== undefined &&
    args.offset !== 0
  ) {
    query.offset = args.offset;
  }

  return SubmissionModel.find(query);
}

export function registerUser(args) {
  const username = args.username;
  const password = args.password;
  const currentDate = new Date();

  const newUser = {
    username,
    password,
    createdAt: currentDate,
    updatedAt: currentDate
  };

  return db.transaction(function (t) {
    return UserModel.findOne({ where: { username } }, {transaction: t})
      .then((user) => {
        if (user !== null ){
          throw new Error('Username is already in use. Please try a new one');
        }

        const newUser = {
          username,
          password,
          createdAt: currentDate,
          updatedAt: currentDate
        };

        return UserModel.create(newUser, { transcation: t });
      })
  })
    .then((user) => user )
    .catch((error) => error);
}
