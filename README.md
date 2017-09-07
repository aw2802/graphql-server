# graphql-server
[GraphQL](http://graphql.org/) server using Apollo. Connects to the WikiWhat-App project.

### Technologies used
  * [GraphQL](http://graphql.org/)
  * [Sequelize](http://docs.sequelizejs.com/)
  * [mySQL 5.7](https://dev.mysql.com/doc/refman/5.7/en/)
  * [Axios](https://www.npmjs.com/package/axios)
  * [React Apollo](http://dev.apollodata.com/react/)

### Requirements
  * Node / npm
  * mySQL 5.7+
  * internet connection
      * wikiHow API requires connection

### Setup for GraphQL-Server

1. Log into mysql and run the mysql file located in mysql/database.js
`source <path to database.js>`

2. `npm install`

3. `npm start`

4. Navigate to [http://localhost:8888/graphql](http://localhost:8888/graphql) to use the GraphiQL interface for testing.

# GraphQL Advantages and Disadvantages

## Advantages
## Disadvantages


&nbsp; <!--extra spacing-->
&nbsp; <!--extra spacing-->

# Guide to GraphQL (Code Examples)

This is a brief guide to the basics of GraphQL in conjunction with Apollo. For more in depth actions and code, please refer to the documentation.


##Contents

1. [Writing GraphQL Queries](#writing-graphql-queries)
	* 	[Query Statements](#query-statements)
	* 	[Aliases](#aliases)
	* 	[Variables](#variables)
	*  [Nested Queries (Joins)](#nested-queries-(joins)) 
	*  [Mutation Statements](#mutation-statements)
2. [Defining Schema](#defining-schema)
3. 

&nbsp; <!--extra spacing-->


## 1. Writing GraphQL Queries

GraphQL follows a very specific structure that is pretty easy to pick up. The structure is the same for mutations and queries. The only difference is that the use of the `mutation` keyword signifies that the statement will be manipulating the data whereas the `query` keyword will be simply fetching the data.


### Query Statements

A typical GraphQL `query` statement looks like this:

```sql
query {
	user(id: 902) {
		id
		username
		last_login
	}
}
```

Typically in the query, a type is defined (`query` or `mutation`) to indicate operation to be performed. Then a field (`user` in the example) is defined to indicate which set of data is to be retrieved or manipulated. In the example above, a user object would be returned

The parenthesis contains any arguments that are supposed to be provided. In this case it's `id: <id_int>`.

Lastly, the statement must define what information we want to retrieve. In this case id, username, and last_login *only* get returned. 

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
```

On the client side, the returned response is held in `props` under the default `data` object. The user object can be retrieved by writing: `this.props.data.user`.

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

In the example above, the query now has a "Submission" alias that can be accessed by writing `this.props.submissions` instead of "this.props.data.submissions". Aliases do not need to match the field name.

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

It is possible to query multiple tables in a database in GraphQL. The schema for the table must be able to return an associated object (more on this [here]()). If a program required retrieving a user and the last three submissions associated with the user, the query would look like:

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
					"short_description": "An in depth look at the man who raised me in the Stark household."
				},
				{
					"title": "Night's Watch: An Honorable Vow"
					"short_description": "Why any men should take the black."
				},
			}
		}
	}
}
```

[⇧ Back to top](#contents)

&nbsp; <!--extra spacing-->

### Mutation Statements

Mutation statements in GraphQL are not that much different than a query statement. The difference is the `mutation` type and that variables are almost always passed in. An example of a mutation is outlined before.

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

