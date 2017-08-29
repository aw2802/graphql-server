# graphql-server

Issues:

Article I followed: https://edgecoders.com/graphql-learn-by-doing-part-2-of-3-4f02ae01d47d

When I try passing in data from the API to graphiQL, there is an error about the field name.
Looking at the wikiHow API, it looks like the attributes are just numbers which is what is giving
an error when I put it in numbers under fields.

## Requirements
  - Node / npm
  - mySQL 5.7+
  - internet connection
      - wikiHow API requires connection

## Setup

1. Log into mysql and run the mysql file located in mysql/database.js
`source <path to database.js>`

2. `npm install`

3. `npm start`

4. Navigate to [http://localhost:8888/graphql](http://localhost:8888/graphql) to use the GraphiQL interface for testing.
