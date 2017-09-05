import UserModel from '../model/user-model';
import SubmissionModel from '../model/submission-model';
import ScoreModel from '../model/score-model';
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

export function updateScoring(args) {
  return db.transaction(function (t) {
    return UserModel.findOne({ where: { id: args.user_id } }, {transaction: t})
      .then((user) => {
        if (user === null ){
          throw new Error('User not found');
        }

        const user_id = user.id;
        return ScoreModel.findOne({ where: { user_id } }, { transaction: t})
          .then(score => {

            if (score === null) {
              score = {
                user_id,
                streak: (args.streak == 0) ? 0 : 1,
                num_games: 1,
                total_correct: (args.total_correct == 0) ? 0 : 1
              };

              return ScoreModel.create(score, { transaction: t});
            }

            score.total_correct =
              (args.total_correct == 0) ? score.total_correct : (score.total_correct + 1);
            score.streak = (args.streak == 0) ? 0 : (score.streak + 1);
            score.num_games += 1;

            return ScoreModel.update({score, where: { user_id }}, { transaction: t});
          })
      })
  })
    .then((score) => score )
    .catch((error) => console.log(error));
}
