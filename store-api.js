/* Import Frameworks */
const express = require('express');

const { graphql, buildSchema } = require('graphql');
const helmet = require('helmet');
require('dotenv').load();

/* Import System Components */
const {pgQuery} = require('./store-database');

const port = process.env.PORT || 3000;
const app = express();

/* Remove after learning about GraphQL */
const graphqlHTTP = require('express-graphql');


const schema = buildSchema(`
  type Query {
    title: String
    price: String
    inventory_count: String
  }
`);

const root = {
    "title": 'Hello world!',
    price: 'What? Oh.'
};

graphql(schema, '{ title }', root).then((response) => {
    console.log(response);
});

/* Remove after learning about GraphQL */
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));

app.use(helmet());
app.listen(3000, () => console.log(`-- Listening on port ${port}`) );