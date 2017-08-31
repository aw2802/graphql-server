import express from 'express';
import GraphQLHTTP from 'express-graphql';
import schema from './data/schema';

const app = express();
const PORT = 8888;

var corsOptions = {
  origin: 'http://localhost:3000',
  credentials: false
};
app.use(cors(corsOptions));

app.use("/graphql", GraphQLHTTP({
    schema,
    graphiql: true,
  })
);

app.listen(PORT, () => {
 console.log("Node/Express server for Flux/GraphQL app. listening on port", PORT);
});
