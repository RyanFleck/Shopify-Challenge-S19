/* Import Frameworks */
const express = require('express');
const helmet = require('helmet');
require('dotenv').load();

/* Import System Components */
const { pgQuery } = require('./store-database');

const port = process.env.PORT || 3000;
const app = express();

// Send error with link to instructions if no input provided.
app.get('/', (req, res) => {
    res.json({ error: 'No API input provided.', message: 'Please read the docs at https://ryanfleck.github.io/Shopify-Challenge-S19/' });
});

// Query a single film, or all matching titles.
app.get('/query', (req, res) => {
    console.log(req.query);
    if (req.query.name) {
        queryProductByName(res, req.query.name, req.query.instock, req.query.all);
    } else {
        res.json({ error: 'No parameters provided.', message: 'Please read the docs at https://ryanfleck.github.io/Shopify-Challenge-S19/' });
    }
});

function queryProductByName(res, name, instock, all) {
    const queryFlags = processInStockFlag(instock, 'and');
    const queryname = name.trim().toLowerCase();
    pgQuery(`select * from products where (LOWER(title) ~ $1) ${queryFlags};`, [queryname], (rows) => {
        if (typeof all !== 'string') {
            const firstResult = rows[0];
            res.json(firstResult || {});
        } else {
            res.json(rows);
        }
    });
}

// Get all films in inventory.
app.get('/all', (req, res) => {
    console.log(req.query);
    const queryFlags = processInStockFlag(req.query.instock, 'where');
    pgQuery(`select * from products ${queryFlags};`, [], (rows) => {
        res.json(rows);
    });
});

// Returns SQL query string amendment when flag is true/false.
function processInStockFlag(instock, prefix) {
    if (instock != null) {
        if (instock.toLowerCase() !== 'false') {
            return `${prefix} inventory_count > 0`;
        }
        return `${prefix} inventory_count = 0`;
    }
    return '';
}

// 'Purchase' a single film. ?process=true flag required to decrement.
app.get('/purchase', (req, res) => {
    console.log(req.query);
    const purchaseIfInStock = processPurchaseFlag(req.query.process);
    if (req.query.name) {
        const queryname = req.query.name.trim().toLowerCase();
        pgQuery('select * from products where (LOWER(title) = $1);', [queryname], (rows) => {
            if (!rows[0]) {
                res.json({ error: 'No such product.', message: 'Ensure the name is typed correctly to purchase.' });
                return;
            }
            const firstResult = rows[0];
            console.log(`Attempting to purchase ${firstResult.title}\nInventory count: ${firstResult.inventory_count}`);
            if (firstResult.inventory_count > 0) {
                if (purchaseIfInStock) {
                    pgQuery(`UPDATE products 
                        SET inventory_count = inventory_count - 1
                        WHERE title = $1;
                        `, [firstResult.title], (rows2) => {
                        console.log(rows2);
                        res.json({ message: `The film '${firstResult.title}' was purchased. Inventory now at ${firstResult.inventory_count - 1}.` });
                    });
                } else {
                    res.json({ message: `The film '${firstResult.title}' is available (${firstResult.inventory_count} in stock), but was not purchased. Use the flag &process=true to complete the transaction.` });
                }
            } else {
                res.json({ error: 'Out of stock.', message: `The film '${firstResult.title}' is out of stock! Please check back soon.` });
            }
        });
    } else {
        res.json({ error: 'No parameters provided.', message: 'Please read the docs at https://ryanfleck.github.io/Shopify-Challenge-S19/' });
    }
});

// Returns Boolean when flag is true/false.
function processPurchaseFlag(purchase) {
    if (purchase != null) {
        if (purchase.toLowerCase() === 'true') {
            return true;
        }
        return false;
    }
    return false;
}


// Handle all other requests with an error.
app.get('*', (req, res) => {
    res.json({ error: 'Malformed input.', message: 'Please read the docs at https://ryanfleck.github.io/Shopify-Challenge-S19/' });
});

// Don helmet and serve.
app.use(helmet());
app.listen(3000, () => console.log(`-- Listening on port ${port}`));
