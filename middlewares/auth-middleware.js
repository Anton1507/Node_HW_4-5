const ApiError = require('../exceptions/api-errors')

const jwt = require('jsonwebtoken');
module.exports = function (roles = []) {
    if (typeof roles === 'string') {
        roles = [roles];
    }
    return (req, res, next) => {
        try {
            

             const autorizationCookies = req.cookies['refreshToken'];
            if (!autorizationCookies) {
                return next(ApiError.UnauthorizedError());

            }
            const refreshToken = jwt.verify(autorizationCookies, process.env.JWT_REFRESH_SECRET)
            if (!refreshToken) {
                return next(ApiError.UnauthorizedError());

            }
            
            const {role} = jwt.decode(autorizationCookies);
          
            
            if (roles.length && !roles.includes(role)) {

                return res.status(401).json({ message: 'Unauthorized' });
            }



            next();
        } catch {
            return next(ApiError.UnauthorizedError());

        }

    }
}



