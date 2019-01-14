const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false,
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

/*
 *  pgQuery
 *     sends a query to the database configured in the .env
 *     pgQuery wraps an asynchronous function to send the query.
 *
 *  query - PSQL formatted query string with '$1, $2, $3' for arg insertions.
 *  args - array of arguments.
 *  rfunc - return function.
 *
 *  example: list all items in a table:
 *     pgQuery('select * from products', [], console.log);
 */

async function pgQuery(query, args, rfunc) {
    const querySnippet = query.slice(0, 20);
    console.log(`>< pgquery().async requested for query '${querySnippet}...'`);
    let client;

    // Connect to POOL.
    try {
        client = await pool.connect();
    } catch (e) {
        console.error(`<> pgQuery().async: POOL connection error:\n\n ${e}\n\nUnrecoverable error.`);
        process.exit(1);
    }

    // Run the Query.
    try {
        const res = await client.query(query, args);
        if (rfunc) { rfunc(res.rows); }
    } catch (e) {
        console.error(`<> pgQuery().async: Query error:\n\n ${e}\n\nUnrecoverable error.`);
        process.exit(1);
    } finally {
        client.release();
        console.log(`<> pgquery().async completed for query '${querySnippet}...'`);
    }
}

module.exports = { pgQuery };
