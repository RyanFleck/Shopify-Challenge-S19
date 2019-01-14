/* Import Frameworks */
const express = require('express');
const { graphql, buildSchema } = require('graphql');
const helmet = require('helmet');
require('dotenv').load();

/* Remove after learning about GraphQL */
const graphqlHTTP = require('express-graphql');

/* Import System Components */
const { pgQuery } = require('./store-database');

const port = process.env.PORT || 3000;
const app = express();

const schema = buildSchema(`
  type Query {
    title: String
    price: String
    inventory_count: String
  }
`);

const root = {
    title: 'Hello world!',
    price: 'What? Oh.',
};

// pgQuery('select * from products', [], console.log);

/*
pgQuery('select * from products', [], (rows) => {
    for (let x in rows) {

        graphql(schema, '{ title price }', { ...rows[x] }).then((response) => {
            console.log(response);
        });
    }
});


pgQuery('select * from products', [], (rows) => {
        console.log(rows)
        graphql(schema, '{ title price }', { ...rows }).then((response) => {
            console.log(response);
        });
});
*/


/* Remove after learning about GraphQL */
app.use('/graphql', graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
}));

app.get('/query', (req, res) => {
    const instock = req.query.instock;
    if (instock != null) {
        console.log('Instock flag.');
    }

    const name = req.query.name;
    const price = req.query.price;

    res.send({ instock, name, price });
});

app.get('/film/:name', (req, res) => {
    const instock = req.query.instock;

    if (instock != null) {
        console.log('Instock flag.');
    }
    const name = req.params.name;

    console.log(req.params);
    if (name) {
        pgQuery('select * from products where (LOWER(title)=$1)', [name.toLowerCase()], (rows) => {
            res.send(rows);
        });
    } else {
        res.send({ error: 'Name is required.' });
    }


    // res.send({ 'instock': instock, 'name': name });
});

app.use(helmet());
app.listen(3000, () => console.log(`-- Listening on port ${port}`));
