const jwt = require("jsonwebtoken");

exports.checkToken = (req, res, next) => {
    // get the token from the request's header
    const token = req.headers["authorization"];

    // if token not sent in the request's header, send an error
    if(!token) {
        return res.status(403).send("You need to provide a token with your request");
    }

    // extract token from "bearer" string;
    const realToken = token.split(" ")[1];

    jwt.verify(realToken, process.env.JWT_SECRET_KEY, (error, decoded) => {
        if(error) {
            return res.status(401).send("You have made unauthorized request");
        }
        req.userId = decoded.id;
        next();
    });  
};
