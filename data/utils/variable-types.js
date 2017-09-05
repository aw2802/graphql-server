import {
 GraphQLSchema,
 GraphQLObjectType,
 GraphQLInt,
 GraphQLString
} from 'graphql';

/**
  * custom GraphQL types
  */
export const ImageType = new GraphQLObjectType({
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

export const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'A User object that contains information about a logged in person',
  fields: () => ({
    id: { type: GraphQLInt },
    username: { type: GraphQLString },
    password: { type: GraphQLString },
  })
});

export const ScoreType = new GraphQLObjectType({
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

export const SubmissionType = new GraphQLObjectType({
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
