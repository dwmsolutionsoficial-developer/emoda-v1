module.exports = middleware => {
    return (req, res, next) => {
        req.user.admin = 1
        if (req.user.admin === 1) {
            middleware(req, res, next)
        } else {
            res.status(401).send('Usuário não é administrador.')
        }
    }
}