const jwt = require('jsonwebtoken');
exports.verifyTokenn = async (req, res, next) => {
    // Retrieve the token from the cookies
    console.log('verifyToken called');
    const token = req.cookies.auth_token;
    if (!token) {
        // If no token is found, redirect to the login page
        console.log('no token');
        return res.redirect('/login');
    }
    try {
        // Verify the token
        const decoded = jwt.verify(token, 'your_jwt_secret'); // Use your actual secret
        req.user = decoded; // Attach user info to request
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        // If the token is invalid, redirect to the login page
        res.render('pages/404', { error });

    }
};


exports.isLogged = async (req, res, next) => {
    // Retrieve the token from the cookies
    console.log('isLogged called');
    try {
        const token = req.cookies.auth_token;
        if (!token) {
            req.isLogged = false;
        } else {
            const decoded = jwt.verify(token, 'your_jwt_secret'); // Use your actual secret
            console.log('decoded:', decoded);
            req.user = decoded; // Attach user info to request
            req.isLogged = true;
        }
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        // If the token is invalid, redirect to the login page
        if (error.name === 'TokenExpiredError') {
            // Token has expired
            console.log('Token has expired');
            const redirectUrl = req.query.redirectUrl;
            res.clearCookie('auth_token'); // Clear the authentication token cookie
            return res.render('pages/login', { redirectUrl });
        }

        res.render('pages/404', { error });
    }
};



