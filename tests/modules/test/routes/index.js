module.exports = function (app) {
    app.get('/', function (req, res) {
        var ok = { test: 'ok' };
        return res.json(ok, 200);
    });
    app.get('/exception', function (req, res) {
        var non = fs.readFileSync('non-existent-file', 'utf-8');
        return res.send(non);
    });
};

