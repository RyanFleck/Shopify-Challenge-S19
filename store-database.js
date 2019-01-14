const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

(async () => {
    const client = await pool.connect();
    try {
        await client.query(fs.readFileSync('./sql/init-db.sql').toString());
    } catch (err) {
        console.error(err);
    } finally {
        client.release();
        console.log(`-- Tables instantiated.`);
    }
})().catch(e => console.error(e.stack));

/*
 *  pgQuery
 *     sends a query to the database configured in the .env
 * 
 *  query - PSQL formatted query string with '$1, $2, $3' for arg insertions.
 *  args - array of arguments.
 *  rfunc - return function.
 */

async function pgQuery (query, args, rfunc) {

    if (!query) {
        console.error('-- pgquery() ERROR: No query provided.');
        return;
    }

    const querySnippet = query.slice(0, 20);

    console.log(`>< pgquery().async requested for query '${querySnippet}...'`);
    const client = await pool.connect();
    try {
        const res = await client.query(query, args);
        if (rfunc) { rfunc(res.rows); }
    } finally {
        client.release();
    }
    console.log(`<> pgquery().async completed for query '${querySnippet}...'`);
}