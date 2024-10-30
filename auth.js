const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {     
    try {
        const authHeader = req.headers.authorization;  
        if (!authHeader) {
            return res.status(401).send("Yetkilendirme headers  eksik");
        }
        
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).send("Token bulunamadi");
        }

        const decodedToken = jwt.verify(token, 'SECRET_KEY');   
        next();                                               
    } catch (error) {
        return res.status(401).send("Geçersiz imza");
    }
};
