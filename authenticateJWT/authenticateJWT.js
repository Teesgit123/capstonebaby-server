const jwt = require("jsonwebtoken");

exports.checkToken = (req, res, next) => {
    // get the token from the request's header
    const reqHeader = req.headers.authorization;
    console.log(reqHeader)
    // if token not sent in the request's header, send an error
    if(!reqHeader) {
        return res.status(401).json({ message: "No token was sent with your request. ----From authenticeJWT.js----"});
    }

    // extract token from "bearer" string;
    const token = reqHeader.split(" ")[1];
    console.log(token);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userId = decoded.id;
        next();
    }
    catch (error) {
        res.status(401).json({ message: "The token you sent was invalid, please log out and login to generate a new one ---From AuthenticeJWT.js"});
    }

};
