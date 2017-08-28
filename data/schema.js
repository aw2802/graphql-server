import {
 GraphQLSchema,
 GraphQLObjectType,
 GraphQLInt,
 GraphQLString,
 GraphQLList,
 GraphQLNonNull,
 GraphQLID,
 GraphQLBoolean,
 GraphQLFloat
} from 'graphql';
import axios from 'axios';

const ImageArrayType = new GraphQLObjectType({
 name: "ImageArray",
 description: "array of images",
 fields: () => ({
   "image1": {type: GraphQLString},
   "image2": {type: GraphQLString},
   "image3": {type: GraphQLString},
   "image4": {type: GraphQLString},
	})
});

const query = new GraphQLObjectType({
  name:"Query",
  description: "WikiHow API image data",
  fields: () =>({
    images: {
      type: ImageArrayType,
      description:"array of wiki images",
      args:{
        number:{
          type: new GraphQLNonNull(GraphQLInt),
          description: "The number of images wanted",
        },
      },

      resolve:(_, {number}) =>{
        let config = {'X-Mashape-Key': 'ZF4AQocD2Cmsh9IU2WEtKtDHIYrjp16SwqzjsnqF9PbncTEYs7',
             'Accept': 'application/json'
        };
        let url = `https://hargrimm-wikihow-v1.p.mashape.com/images?count=${number}`;
        return axios.get(url, {headers: config})
          .then(function(response) {
          return response.data;
        });

      }
    }

  })

});

// const query = new GraphQLObjectType({
//   name: "Query",
//   description: "First GraphQL Server Config — Yay!",
//   fields: () => ({
//     gitHubUser: {
//       type: UserInfoType,
//       description: "GitHub user API data with enhanced and additional data",
//       args: {
//         username: {
//           type: new GraphQLNonNull(GraphQLString),
//           description: "The GitHub user login you want information on",
//         },
//       },
//       resolve: (_,{username}) => {
//         const url = `https://api.github.com/users/${username}`;
//         return axios.get(url)
//                     .then(function(response) {
//                       return response.data;
//                     });
//       }
//     },
//   })
// });

const schema = new GraphQLSchema({
 query
});
export default schema;