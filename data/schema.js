import {
 GraphQLSchema,
 GraphQLObjectType,
 GraphQLInt,
 GraphQLString,
 GraphQLList,
} from 'graphql';

import { fetchImagesByURL } from './wikiHow-api';

/**
  * custom GraphQL types
  */
const ImageType = new GraphQLObjectType({
  name: 'ImageType',
  description: 'Image object that provides wikiHow article associated with it and location.',
  fields: () => ({
    imageURL: {
      type: GraphQLString,
      description: "URL String for the image to display"
    },
    wikiURL: {
      type: GraphQLString,
      description: "URL for the wikiHow article associated with the Image"
    },
    title: {
      type: GraphQLString,
      description: "A String title for selection"
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
      resolve: (root, args) => fetchImagesByURL(`images`, 1),
    },
    images: {
      type: new GraphQLList(ImageType),
      args: {
        count: { type: GraphQLInt },
      },
      resolve: (root, args) => fetchImagesByURL(`images`, args.count),
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
