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

/*
 *  ExpressJS responses.
 */

// Send error with link to instructions if no input provided.
app.get('/', (req, res) => {
    res.json({ error: 'No API input provided.', message: 'Please read the docs at https://ryanfleck.github.io/Shopify-Challenge-S19/' });
});

app.get('/query', (req, res) => {
    if (req.query.name) {
        queryFilmByName(res, req.query.name, req.query.instock, req.query.all);
    } else {
        res.json({ error: 'No parameters provided.', message: 'Please read the docs at https://ryanfleck.github.io/Shopify-Challenge-S19/' });
    }
});

app.get('/[film|films]/:name', (req, res) => {
    queryFilmByName(res, req.params.name, req.query.instock, req.query.all);
});

app.get('/[film|films]', (req, res) => {
    queryFilmByName(res, null, req.query.instock, req.query.all);
});

function queryFilmByName(res, name, instock, all) {
    let queryFlags = '';
    console.log(`Querying film ${name} ${instock}`);

    if (instock != null) {
        console.log('Instock flag.');
        if (instock.toLowerCase() !== 'false') {
            queryFlags = 'and inventory_count > 0';
        } else {
            queryFlags = 'and inventory_count = 0';
        }
    }

    if (name) {
        const queryname = name.trim().toLowerCase();
        console.log(`-- Querying ${queryname}`);
        pgQuery(`select * from products where (LOWER(title) ~ $1) ${queryFlags};`, [queryname], (rows) => {
            if (all === null) {
                const firstResult = rows[0];
                res.json(firstResult || {});
            } else {
                res.json(rows);
            }
        });
    } else {
        pgQuery('select * from products;', [], (rows) => {
            res.json(rows);
        });
    }
}

// Handle all other requests with an error.
app.get('*', (req, res) => {
    res.json({ error: 'Malformed input.', message: 'Please read the docs at https://ryanfleck.github.io/Shopify-Challenge-S19/' });
});

app.use(helmet());
app.listen(3000, () => console.log(`-- Listening on port ${port}`));
