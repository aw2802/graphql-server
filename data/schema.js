import {
 GraphQLSchema,
 GraphQLObjectType,
 GraphQLInt,
 GraphQLString,
 GraphQLList,
} from 'graphql';

import { fetchImagesByURL } from './wikiHow-api';
import { fetchSubmissions } from './mysql-db';

import UserModel from './model/user-model';
import ScoreModel from './model/score-model';

/**
  * custom GraphQL types
  */
const ImageType = new GraphQLObjectType({
  name: 'Image',
  description: 'Image object that provides wikiHow article associated with it and location.',
  fields: () => ({
    imageURL: { type: GraphQLString },
    wikiURL: {
      type: GraphQLString,
      description: 'URL for the wikiHow article associated with the Image'
    },
    title: {
      type: GraphQLString,
      description: 'A human readable string for a wikiHow article'
    }
  })
});

const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'A User object that contains information about a logged in person',
  fields: () => ({
    id: { type: GraphQLInt },
    username: { type: GraphQLString },
    password: { type: GraphQLString },
    email: { type: GraphQLString }
  })
});

const ScoreType = new GraphQLObjectType({
  name: 'Score',
  description: 'A Score object that provides statstics regarding a User',
  fields: () => ({
    id: { type: GraphQLInt },
    totalCorrect: {
      type: GraphQLInt,
      description: 'The total number a User has correctly guessed.'
    },
    numGames: {
      type: GraphQLInt,
      description: 'The total number of games a User has played'
    },
    streak: {
      type: GraphQLInt,
      description: 'The number of times a User has successful answered in a row.'
    },
    user: { type: UserType }
  })
});

const SubmissionType = new GraphQLObjectType({
  name: 'Submission',
  description: 'A Submission object that holds information for \'wrong\' answers.',
  fields: () => ({
    id: { type: GraphQLInt },
    title: {
      type: GraphQLString,
      description: 'A human readable string for the incorrect wikiHow article.'
    },
    imageURL: { type: GraphQLString },
    score: {
      type: GraphQLInt,
      description: 'The community score for the submission.'
    },
    author: {
      type: UserType,
      description: 'The User who is responsible for the submission.'
    }
  })
});

/**
  * Schema entry point: QueryType
  */
const QueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'The root query for the schema',
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
    user: {
      type: UserType,
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (root, args) => {
        return UserModel.find({ where: args });
      }
    },
    score: {
      type: ScoreType,
      args: {
        user_id: { type: GraphQLInt }
      },
      resolve: (root, args) => {
        return ScoreModel.find({ where: args });
      }
    },
    userSubmissions: {
      type: SubmissionType,
      args: {
        author_id: { type: GraphQLInt },
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
    },
    submissions: {
      type: new GraphQLList(SubmissionType),
      args: {
        count: { type: GraphQLInt },
        offset: {
          type: GraphQLInt,
          defaultValue: 0
        }
      },
      resolve: (root, args) => fetchSubmissions(args),
    }
  }),
});

/**
  * schema declaration to call QueryType
  */
const schema = new GraphQLSchema({
 query: QueryType
});

export default schema;
