const jwt = require('jsonwebtoken');
const User = require('../models/User')



exports.checkRole = async (req, res, next) => {
    // Retrieve the token from the cookies
    console.log('checkRole called');
    try {
        req.properties={};
        req.properties.isAdmin = false;
        req.properties.isSeller = false;
        req.properties.userId = '';

        if (req.isLogged) {
            const user = await User.findById(req.user.id);
            req.properties.isLogged = true;
            req.properties.userId = user._id;
            if (user.role == 'seller') {
                req.properties.isSeller = true;
            } else if (user.role == 'admin') {
                req.properties.isAdmin = true;
            }
        } else {
            req.properties.isLogged = false;
        }
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        // If the token is invalid, redirect to the login page
        res.render('pages/404', { error });
    }
};



