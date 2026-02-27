const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({
            status: false,
            message: 'Access denied. Admins only.',
        });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                status: false,
                message: 'You do not have permission to perform this action',
            });
        }
        next();
    };
};

module.exports = { isAdmin, authorize };
