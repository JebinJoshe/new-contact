const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 8080;
app.use(bodyParser.json());

const pool = mysql.createPool({ 
    host: '127.0.0.1',
    user: 'root',
    password: '145678', 
    database: 'jebin', 
});


pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }
    console.log('Connected to MySQL database');
    connection.release();
});

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});

app.get('/',(req,res)=>{
    res.send("Hi from server")
})
//insertion
app.post('/api/contacts', (req, res) => {
    const { firstName, lastName, email, phone,id } = req.body;

    
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting MySQL connection:', err);
            res.status(500).json({ error: 'Internal server error1' });
            return;
        }

        
        connection.query('INSERT INTO contacts (firstName, lastName, email, phone,id) VALUES (?, ?, ?, ?, ?)',
            [firstName, lastName, email, phone,id],
            (error, results) => {
                
                connection.release();

                if (error) {
                    console.error('Error inserting contact details:', error);
                    res.status(500).json({ error: 'Internal server error' });
                    return;
                }

                res.status(201).json({ message: 'Contact details inserted successfully' });
                console.log("Contact details Inserted Successfully")
            });
    });
});
app.get('/api/users', (req, res) => {
    
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting MySQL connection:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        
        connection.query('SELECT * FROM contacts', (error, results) => {
            
            connection.release();

            if (error) {
                console.error('Error querying MySQL:', error);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }

            
            res.json(results);
        });
    });
});

//retrieval
app.get('/api/contacts/:id', (req, res) => {
    const id = req.params.id;

    
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting MySQL connection:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        
        connection.query('SELECT * FROM contacts WHERE id = ?',
            [id],
            (error, results) => {
                
                connection.release();

                if (error) {
                    console.error('Error fetching contact details:', error);
                    res.status(500).json({ error: 'Internal server error' });
                    return;
                }

                if (results.length === 0) {
                    res.status(404).json({ message: 'Contact not found' });
                } else {
                    res.json(results[0]);
                }
            });
    });
});
