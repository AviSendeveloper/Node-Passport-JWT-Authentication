const { getToken } = require('../util/jwt');

const isAuth = (req, res, next) => {
    try {
        const beararHeader = req.headers['authorization'];
        if (!beararHeader) throw new Error('Token required');

        const token = beararHeader.split(' ')[1];

        const decode = getToken(token);
        
        if (decode) {
            req.user = decode;
            next();
        }
    } catch (error) {
        return res.status(403).json({
            status: false,
            message: error.message
        });
    }
}

module.exports = isAuth;