# graphql-server
[GraphQL](http://graphql.org/) server using Apollo. Connects to the WikiWhat-App project.

### Technologies used
  * [GraphQL](http://graphql.org/)
  * [Sequelize](http://docs.sequelizejs.com/)
  * [mySQL 5.7](https://dev.mysql.com/doc/refman/5.7/en/)
  * [Axios](https://www.npmjs.com/package/axios)
  * [React Apollo](http://dev.apollodata.com/react/)

# Guide to GraphQL (Code Examples)

This is a brief(ish) guide to the basics of GraphQL in conjunction with Apollo. For more in-depth actions and code, please refer to the documentation.

### Contents

1. [Writing GraphQL Queries](#writing-graphql-queries)
	* 	[Query Statements](#query-statements)
	* 	[Aliases](#aliases)
	* 	[Variables](#variables)
	*  [Nested Queries (Joins)](#nested-queries-(joins)) 
	*  [Mutation Statements](#mutation-statements)
2. [GraphQL Server](#graphql-server) 
	* [Defining Schema](#defining-schema)
	* [Defining Types](#defining-types)
	* [Defining Resolvers](#defining-resolvers)
		* [Query Resolvers](#query-resolvers)
		* [Mutation Resolvers](#mutation-resolvers)
3. [Client Side Code](#client-side-code)
	* [ApolloClient Setup](#apolloclient-setup)
	* [Prefetching Data](#prefetching-data)
4. [GraphQL Pros and Cons](#graphql-pros-and-cons)
	* [Advantages](#advantages)
	* [Disadvantages](#disadvantages)
5. [References](#references)

&nbsp; <!--extra spacing-->


## 1. Writing GraphQL Statements

GraphQL follows a very specific structure that is pretty easy to pick up. The structure is the same for mutations and queries. The only difference is the use of the `mutation` keyword signifies the statement will be manipulating the data whereas the `query` keyword will be simply fetching the data.

GraphQL statements are used client side and are received by the GraphQL server. 

### Query Statements

A typical GraphQL `query` statement looks like this:

```sql
query {
  user(id: "902") {
    id
    username
    last_login
  }
}
```

Typically in the query, a statement is defined (`query` or `mutation`) to indicate operation to be performed. Then a field (`user` in the example) is defined to indicate which set of data is to be retrieved or manipulated. In the example above, a user object would be returned.

The parenthesis contains any arguments that are supposed to be provided. In this case it's `id: <id_int>`.

Lastly, the statement must define what information we want to retrieve. Id, username, and last_login would *only* get returned regardless if any other information is associated  with the field (`user`).

The GraphQL response would look like this:

```sql
{
  "data": {
    "user": {
      "id": "902",
      "username": "jsnow"
      "last_login": "2017-09-07T03:43:17+00:00"
    }
  }
}
```

On the client side, a Higher Order Component is created when using graphql(). This HOC creates a data object under the props as a default.  The user object can be retrieved by writing: `this.props.data.user`.

[⇧ Back to top](#contents)

&nbsp; <!--extra spacing-->

### Aliases            
Queries can be named to help differentiate from multiple queries (multiple queries are not required for aliases).

```sql
query Submissions {
  submissions(limit: "3", offset: "5") {
    id
    title
    description
    upvotes
    downvotes
  }
}
```

In the example above, the query now has a "Submission" alias that can be accessed by writing `this.props.submissions` instead of "this.props.data.submissions". Aliases do not need to match the field name (`submissions`).

[⇧ Back to top](#contents)

&nbsp; <!--extra spacing-->

### Variables

Variables can be used to type check and pass in values that may change. Variables can have a default value and be marked as required or optional. 

```sql
query Submissions($limit: Int = 1, $offset: Int) {
  submissions(limit: $limit, offset: $offset) {
    id
    title
    description
    upvotes
    downvotes
  }
}
```
In the example above, we set a default value of `limit` to be 1 if no value is passed in. The value can only be an int. Offset on the other hand doesn't have a value. All of these values are optional.

If a limit was always required to be passed in, the syntax would look like: `$limit: Int!`. The `!` indicates a required value that must be passed in.

 Variables can be passed into the GraphQL statement as `$limit` / `offset` and will only be accepted if the variables are Int. This is similar to PHP's PDO.

[⇧ Back to top](#contents)

&nbsp; <!--extra spacing-->

### Nested Queries (Joins)

It is possible to query multiple tables in a database in GraphQL. The schema for the table must be able to return an associated object. If a program required retrieving a user and the last three submissions associated with the user, the query would look like:

```sql
query userSubmissions {
  user(id: "902") {
    id
    first_name
    last_name
    submissions(limit: "3") {
      title
      short_description
    }
  }
}
```

In return, the response given back would look like:

```sql
{
  "data" {
    "user" {
      "id": "902"
      "firstname": "John"
      "lastname": "Snow"
      "submissions": [
        {
          "title": "Do I really no nothing?"
          "short_description": "An exploration on past decisions I've made and whether I really, truly know nothing."
        },
        {
          "title": "My father, Ned Stark"
          "short_description": "An in-depth look at the man who raised me in the Stark household."
        },
        {
          "title": "Night's Watch: An Honorable Vow"
          "short_description": "Why any men should take the black."
        },
      ]
    }
  }
}
```

[⇧ Back to top](#contents)

&nbsp; <!--extra spacing-->

### Mutation Statements

Mutation statements in GraphQL are not that much different than a query statement. The difference is the `mutation` keyword and that variables are almost always passed in. An example of a mutation is outlined before.

```sql
  mutation createUserSubmission($author_id: Int!, $title: String!, $short_desc: String!, $upvote: Int = 0, $downvote: Int = 0) {
    createSubmission(author_id: $author_id, title: $title, $short_description: $short_desc ) {
      id
      title
      short_description
      author {
        first_name
        last_name
      }
    }
  }
```

If you are confused about using `createUserSubmission` please refer to the [Aliases](#aliases) section.

If you are confused about the different variables (i.e. `short_desc: String!`) please refer to the [Variables](#variables) section.

[⇧ Back to top](#contents)

&nbsp; <!--extra spacing-->
&nbsp; <!--extra spacing-->

## 2. GraphQL Server

A Client will make calls to one single endpoint on the GraphQL server. The default endpoint is `<current_website_url>/graphql`, but this can be changed.

In order for GraphQL to figure out where data is store and what to return, a schema must be defined. The schema tells GraphQL what kind of information is stored, where to look (database, API, etc), and what to return.

The statements on the GraphQL server use two libraries: `graphql` and `graphql-tools`.

### Defining Schema

There are few ways to define a schema for GraphQL. The easiest way to implement a schema is to use `graphql-tools`. Currently the project does not implement graphql tools but will shortly.

The `schema.js` must at least have: 

```javscript
import { makeExecutableSchema } from 'graphql-tools';

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
```

The `typeDefs` are the defined objects for our GraphQL (aka `user` and `submissions` as seen in earlier examples). [Type defintions](#defining-types) and [resolvers](#definig-resolvers) must be passed into `makeExecutableSchema()` in order to retrieve and manipulate data.

[⇧ Back to top](#contents)

&nbsp; <!--extra spacing-->

### Defining Types

Below, two objects or `types` are defined under the typeDefs constants:

```javascript
const typeDefs = `
  type User {
    id: ID!
    username: String
    first_name: String
    last_name: String
  }
  type Submission {
  	id: ID!
  	author: User
  	title: String!
  	short_description: String!
  	upvotes: Int
  	downvotes: Int
  }
`;
```

The `ID!` field in both User and Submissions is a GraphQL scalar type that represents a unique identifier. 

A field may also refer to another type. For example, under `type Submission`, author is a `User`. This is the equivalent to a submissions table to containing a `user_id` that connects to the users table in a mySQL database.

The `makeExecutableSchema()` shown in [Defining Schema](#defining-schema) will translate the above type definitions into schema that is recognizable to GraphQL.

[⇧ Back to top](#contents)

&nbsp; <!--extra spacing-->

### Defining Resolvers

Resolvers in our GraphQL server are functions that are called through queries. Resolvers do most of the work as they point the server where to retrieve the data from (API or database) and what to do with the information. Resolvers can also return Promises as well.

With `graphql-tools`, resolvers are defined separately from the type definitions. Each resolver follows a basic format:

```javascript
Type {
 field(obj, args, context, info) {
    // ...actions...
    return result;
 }
}
```
* `Type` is the defined type (`User` or `Submission`)
* `field` refers to the associated field a GraphQL statement will call on (either in nested situations or in the Query statement) 
	* `user` in `Submission` or `submission` in `User`
* `obj` contains the result returned from the resolver on the parent field. This allows for nested queries. 
	* For example, if the Client side needs a query that will return all submissions that one user sumbitted, the beginning statement would look like: `submissions: (user) { ... }`* `args` is any arguments in the form of an object passed into the query / mutation statment
* `context` may contain information about the following:
	* authentication
	* dataloaders
	* additional information regarding resolving the query
* `info` is not used often, but has information about execution state

[⇧ Back to top](#contents)

&nbsp; <!--extra spacing-->

#### Query Resolvers

An example of implementing query resolvers would look like this:

```javascript
const resolvers = {
  Query: {
    submissions: () => submissions,
    author: (_, args) => find(authors, { id: args.id }),
  },
  User: {
    submissions: (user) => filter(submissions, { author_id: user.id }
  },
  Submission: {
    author: (submission) => find(authors, { id: submission.id }),
  }
};
```
(Regarding the `find(authors, { id: submission.id })` syntax, this largely depends on the ORM that you use. Example wise, this is ignored and up to you).

What is the `Query` type? The `Query` type is used to indicate what can be called upon in a query statement. The submissions field in the User type can be called on in a nested query.

For example:

```sql
query {
	author(id: "902") {
	  first_name
	  last_name
	}
}
```
```
query {
  User {
    submissions {
      title
    }	
  }
}
```

Keep in mind that if a **null** or **undefined** value gets returned in the above statement, it means that the object was never found. The schema associations must be fixed. Whereas if an empty object or array is returned, it simply means there is no data but the object was found.

[⇧ Back to top](#contents)

&nbsp; <!--extra spacing-->

#### Mutation Resolvers

As always, mutation resolvers are similar to query resolvers. Here's an example of a Mutation Resolver:

```javascript
const resolvers = {
  Query: { ... },
  Mutation: {
    createSubmission(_, args) => {
    	const submission = {
    		id: submissions.length,
    		author_id: args.author_id,
    		title: args.title,
    		short_description: args.short_desc,
		  	upvotes: (args.upvotes || 0),
		  	downvotes: (args.downvotes || 0)
    	};
    	
    	submissions.push(submission);
    	
    	return submission;
    }
  }
  User: { ... },
  Submission: {... }
};
```
However the createSubmission is approached, the syntax is still the same as outlined in the Query Resolver. A mutation statement for the above resolver would look like:

```sql
mutation CreateSubmission {
  createSubmission(author_id: "902", title: "Am I a true Stark or always a Snow?", short_description: "Exploration of my heritage") {
    id
    title
    short_descritpion
    author {
      first_name
      last_name
    }
  }
}

```

[⇧ Back to top](#contents)

&nbsp; <!--extra spacing-->
&nbsp; <!--extra spacing-->

## 3. Client Side Code

GraphQL statements are used client side and are received by the GraphQL server. The Client side uses two main libraries: `graphql` and `react-apollo`.

### ApolloClient Setup

In the `index.js` file (or equivalent) of the React Application, two important classes and one function needs to be imported from `react-apollo`:

1. ApolloClient
	* A central store that contains result data 
2. ApolloProvider
	* Makes the ApolloClient instance available to React Component
3. createNetworkInterface
	* Not needed if you use the defaults (see below)


All together our `index.js` looks like this:

```javascript
import {
  ApolloClient,
  ApolloProvider,
  createNetworkInterface
} from 'react-apollo';
import App from './components/App';

...

const networkInterface = createNetworkInterface({
  uri: 'http://localhost:8888/graphql'
});

const client = new ApolloClient({
  networkInterface: networkInterface
});

const Root = () =>{
	return(
		<ApolloProvider client={client}>
				<App />
		</ApolloProvider>
	)
}

ReactDOM.render(<Root />, document.getElementById('root'));

...

```

The `createNetworkInterface()` function has a variety of options that it can receive, but the main one is `uri`. The default `uri` of the server is `<current_url>/graphql`, but typically the GraphQL server is hosted in a different location. 

In this case, the React application would be running on 
`http://localhost:3000` whereas the GraphQL server sits at `http://localhost:8888/graphql`

The `ApolloClient` gets passed in so the client can be called from props (`this.props.client`) anywhere in the code.

As mentioned before, `ApolloProvider` is simply how the ApolloClient is made available to the component. The ApolloProvider does not need to be passed in globally, but usually recommended.

[⇧ Back to top](#contents)

&nbsp; <!--extra spacing-->

### Prefetching Data

Prefetching data is a recommended approach to interacting with the GraphQL server. The data is loaded into the cache before the component is rendered on the screen.

Prefetching data can be two ways: 

1. Through the Higher Component Order "withApollo"
2. s


#### withApollo

An example from the Apollo Development documents showcases the use of `withApollo()` perfectly with a stateless component.

```javascript
const FeedEntry = ({ entry, currentUser, onVote, client }) => {
  const repoLink = `/${entry.repository.full_name}`;
  const prefetchComments = (repoFullName) => () => {
  	client.query({
  	  query: COMMENT_QUERY,
  	  variables: { repoName: repoFullName },
    });
  };

  return (
    <div className="media">
      ...
      <div className="media-body">
        <RepoInfo
          description={entry.repository.description}
          stargazers_count={entry.repository.stargazers_count}
          open_issues_count={entry.repository.open_issues_count}
          created_at={entry.createdAt}
          user_url={entry.postedBy.html_url}
          username={entry.postedBy.login}>
            <Link to={repoLink}
            onMouseOver={prefetchComments(entry.repository.full_name)}>
              View comments ({entry.commentCount})
            </Link>
        </RepoInfo>
      </div>
    </div>
  );
};

const FeedEntryWithApollo = withApollo(FeedEntry);
```




[⇧ Back to top](#contents)

&nbsp; <!--extra spacing-->
&nbsp; <!--extra spacing-->

## 4. GraphQL Pros and Cons

### Advantages
* Nothing more, nothing less
	* GraphQL returns the smallest possible request while REST will generally give more information than requested. 
* GraphQL schema serves as a "contract" between client and server
	* The schema is defined into types and fields and can be thought of as a document of all the questions the client can ask the server.
* Backend doesn't need to account for frontend changes
	* With REST API's data from the server often needs to be modified when design changes on the frontend, hindering fast development and iterations. With GraphQL, because the backend does not need to be adjusted product iterations are faster on the frontend. 
* No more versions needed for API
	* GraphQL is a single evolving version so there is no need for clients to modify anything. 
* Performance monitoring
	* GraphQL clients are forced to specify the fields they want returned in a query. This makes it easy to track specific field usage to a client
* Ability to depreciate data
	* Fields can be easily depreciated and hidden from tools. And because GraphQL can track which clients are requesting which fields, API developers can reach out to only those clients who are using fields that will be depreciated. 

[⇧ Back to top](#contents)

&nbsp; <!--extra spacing-->

### Disadvantages
* No information hiding
	* Information hiding is prevents certain details of a software component from being accessible to its clients. This principle grows as the number of developers accessing the API, decreasing dependency among developers. With GraphQL, the developer needs to know the names of the fields to access and their relations.
* No versioning
	* Versioning can be a positive as it notifies developers of changes happening to the API and when to expect those changes. Without versioning, developers will never know if the application might fail due to some breaking change.
* Safe caching isn't a thing
	* The burden of caching is left to the developers who have to develop the logic of implementing caching on the application layer. When fields on a response become deprecated, it is again left to developers to figure out how long a client should hold its version of a response in its internal cache.
* Adds complexity
	* It's easier to get denial of service attacks with GraphQL with overly complex queries that consumes all resources of the server. With GraphQL it is very easy to query for deep nested relationships such as user -> friends -> friends -> etc. 
* File uploads are nonexistent
	* There is no existing capability to pass the file as an argument.
	* Must use REST endpoints (or other means) and separate this functionality from GraphQL 


[⇧ Back to top](#contents)

&nbsp; <!--extra spacing-->
&nbsp; <!--extra spacing-->

# References

A list of references used to create the project and for further reading. 

* [Apollo Documentation](http://dev.apollodata.com/)
* [GraphQL](http://graphql.org/learn/)


Some additional topics to cover on your own:

* [Subscriptions](http://dev.apollodata.com/tools/graphql-subscriptions/)
	* New, but now available
*  	ss


[⇧ Back to top](#contents)

&nbsp; <!--extra spacing-->
