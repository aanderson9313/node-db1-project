const express = require('./node_modules/express');

const db = require('../data/dbConfig');

const router = express.Router();


// GET
router.get('/', (req, res) => {
    db('accounts')
        .limit(20)
        .then( rows => {
            res.status(200).json(
                {accounts: rows}
                )
        })
        .catch( err => {
            res.status(500).json(
                { message: 'Error'}
            )
        });
});

router.get('/:id', (req, res) => {
    const { id } = req.params

    db('accounts')
        .where({id})
        .first()
        .then(account => {
            account
                ? res.status(200).json(
                    { accounts: account }
                )
                :
                res.status(404).json(
                    { message: 'There was an error while trying to retrieve the data!'}
                )
        })
        .catch( err => {
            res.status(500).json(
                { message: 'Account cannot be found! '}
            )
        });
});

// POST, PUT
router.post('/', (req, res) => {
    const body = req.body
    
    db('accounts')
        .insert(body, 'id')
        .then((ids) => {
            res.status(201).json( 
                { results: ids, account: body }
            )
        })
        .catch(err => {
            res.status(500).json(
                { "message": 'Error, failed to add account.'}
            )
        });
});

router.put('/:id', (req, res) => {
    const body = req.body
    const { id } = req.params

    db('accounts')
        .where({id: id})
        .update(body)
        .then( count => {
            count > 0
            ? res.status(200).json(
                { message: 'Updated Successfully', account: body}
            
            )
            : res.status(404).json(
                { message: 'Account ID not found.'}
            )
        })
        .catch( err => {
            res.status(500).json(
                { message: 'Unable to update account.'}
            )
        });
});


// DELETE

router.delete('/:id', (req, res) => {
    const {id} = req.params

    db('accounts')
        .where({id: id})
        .del()
        .then( count => {
            count > 0
            ? res.status(200).json(
                { message: 'Deleted Successfully', account: req.body }
            )
            : res.status(404).json(
                { message: 'Account ID not found.'}
            )
        });
});

module.exports = router;