module.exports = app => {
    function existsOrError(value, msg) {
        if (!value) throw msg
        if (Array.isArray(value) && value.length === 0) throw msg
        if (typeof value === 'string' && !value.trim()) throw msg
        if (value === 'undefined' || value === undefined) throw msg
    }

    function notExistsOrError(value, msg) {
        try {
            existsOrError(value, msg)
        } catch (msg) {
            return
        }
        throw msg
    }

    function equalsOrError(valueA, valueB, msg) {
        if (valueA !== valueB) throw msg
    }

    /*

    const verificaNumeroDocumento = (req, res) => {
        try {
            const result = await app.db('usuario')
                .where({ emp_id: req.params.emp_id })
                .orderBy('usu_nome')

            res.json({ data: result })
        } catch (error) {

        }
    }
    */

    return { existsOrError, notExistsOrError, equalsOrError }
}