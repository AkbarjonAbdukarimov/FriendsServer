const jwt = require("jsonwebtoken");
const currentUser = (
    req,
    res,
    next
) => {
    if (!req.session.token) {
        return next();
    }

    try {
        const payload = jwt.verify(req.session.token, process.env.JWT_SECRET);
        req.admin = payload;

    } catch (err) { next(err) }

    next();
};
const requireAdmin = (req, res, next) => {
    if (!req.admin) {
        res.status(401).send("Access Denied!")
        return;
    }
    next();
}
module.exports = { currentUser, requireAdmin }
