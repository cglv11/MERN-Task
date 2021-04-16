const express = require('express');
const morgan = require('morgan');
const path = require('path');
const app = express();

const { mongoose } = require('./database');
 
//settings
app.set('port', process.env.PORT || 3000) //take port in the cloud service

//middlewares
app.use(morgan('dev')); 
app.use(express.json());

//routes
app.use('/api/tasks', require('./routes/task.routes'));

//static files
app.use(express.static(path.join(__dirname, 'public'))); 
//console.log('__dirname');

//starting server
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`)
});