module.exports = function (app) {
    app.get('/', function (req, res) {
        var ok = { test: 'ok' };
        return res.json(ok, 200);
    });
};

