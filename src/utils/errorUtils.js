function sendServerError(res, msg, err) {
    if (process.env.NODE_ENV !== 'test') {
        console.error(msg, err);
    }

    if (process.env.NODE_ENV === 'production') {
        return res.status(500).json({ msg });
    }

    return res.status(500).json({ msg, erro: err.message });
}

module.exports = {
    sendServerError
};