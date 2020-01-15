const express = require('express');
const path = require('path');
const morgan = require('morgan');
const engine = require('ejs-mate');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/User');
const routes = require('./routes/index');

// Dotenv
require('dotenv').config({
    path: path.join(__dirname, '../.env')
});

// initialization
const app = express();

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose
    .connect('mongodb://localhost:27017/rbac-test')
    .then(() => {
        console.log('Database connected successfully!');
    });


// Settings
app.set('port', process.env.PORT || 3000);

//Middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(async(req, res, next) => {
    if (req.headers["x-access-token"]) {
        try {
            const accessToken = req.headers["x-access-token"];
            const { userId, exp } = await jwt.verify(accessToken, process.env.JWT_SECRET);
            // If token has expired
            if (exp < Date.now().valueOf() / 1000) {
                return res.status(401).json({
                    error: "JWT token has expired, please login to obtain a new one"
                });
            }
            res.locals.loggedInUser = await User.findById(userId);
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});


// Routes
app.use('/', routes);

// Starting the server

app.listen(app.get('port'), () => {
    console.log(`Server running on port ${ app.get('port') }`);
});