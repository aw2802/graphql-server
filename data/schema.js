import {
 GraphQLSchema,
 GraphQLObjectType,
 GraphQLInt,
 GraphQLString,
 GraphQLList
} from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';

import { fetchImagesByURL } from './utils/wikihow-api-utils';
import { fetchSubmissions, registerUser } from './utils/mysql-utils';
import {
  UserType,
  ImageType,
  ScoreType,
  SubmissionType
} from './utils/variable-types';

import UserModel from './model/user-model';
import ScoreModel from './model/score-model';

/**
  * Schema entry point: QueryType
  */
const QueryRoot = new GraphQLObjectType({
  name: 'Query',
  description: 'The root object to query for data',
  fields: () => ({
    image: {
      type: ImageType,
      resolve: (root, args) => fetchImagesByURL(1),
    },
    images: {
      type: new GraphQLList(ImageType),
      args: {
        count: { type: GraphQLInt },
      },
      resolve: (root, args) => fetchImagesByURL(args.count),
    },
    login: {
      type: UserType,
      args: {
        username: { type: GraphQLString },
        password: { type: GraphQLString }
      },
      resolve: (root, args) => {
        return UserModel.findOne({ where: args });
      }
    },
    user: {
      type: UserType,
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (root, args) => {
        return UserModel.find({ where: args });
      }
    },
    submissions: {
      type: SubmissionType,
      args: {
        count: {
          type: GraphQLInt,
          defaultValue: 1
        },
        offset: {
          type: GraphQLInt,
          defaultValue: 0
        }
      },
      resolve: (root, args) => fetchSubmissions(args),
    }
  }),
});

const MutationRoot = new GraphQLObjectType({
  name: 'Mutation',
  description: 'The root object to save data to the database',
  fields: () => ({
    register: {
      type: UserType,
      args: {
        username: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      resolve: (root, args) => registerUser(args)
    },
    updateScoring: {
      type: UserType,
      args: {
        id: { type: GraphQLInt },
        streak: {
          type: GraphQLInt,
          defaultValue: 0
        },
        num_games: {
          type: GraphQLInt,
          defaultValue: 0
        },
        total_correct: {
          type: GraphQLInt,
          defaultValue: 0
        }
      },
      resolve: (root, args) => registerUser(args)
    }
  }),
});

/**
  * schema declaration to call QueryType
  */
const schema = new GraphQLSchema({
 query: QueryRoot,
 mutation: MutationRoot
});

export default schema;
