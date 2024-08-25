// const jwt = require('jsonwebtoken');

// exports.isLogged = async (req, res, next) => {
//     // Retrieve the token from the cookies
//     console.log('isLogged called');
//     try {
//         const token = req.cookies.auth_token;
//         if (!token) {
//             req.isLogged = false;
//         } else {
//             const decoded = jwt.verify(token, 'your_jwt_secret'); // Use your actual secret
//             console.log('decoded:', decoded);
//             req.user = decoded; // Attach user info to request
//             req.isLogged = true;
//         }
//         next(); // Proceed to the next middleware or route handler
//     } catch (error) {
//         // If the token is invalid, redirect to the login page
//         if (error.name === 'TokenExpiredError') {
//             // Token has expired
//             console.log('Token has expired');
//             const redirectUrl = req.query.redirectUrl;
//             res.clearCookie('auth_token'); // Clear the authentication token cookie
//             return res.render('pages/login', { redirectUrl });
//         }

//         res.render('pages/404', { error });
//     }
// };


exports.isLogged = (req, res, next) => {
    console.log('isLogged called');
    try {
        // Check if the session contains user data
        if (req.session && req.session.userId) {
            console.log('req.session: ',req.session);
            
            req.isLogged = true; // Set a flag indicating the user is logged in
            req.user = { id: req.session.userId, ...req.session.properties }; // Attach user data to the request
        } else {
            req.isLogged = false; // User is not logged in
            req.user = null;
        }
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error(error);
        req.isLogged = false;
        req.user = null;
        res.render('pages/404', { error });
    }
};



