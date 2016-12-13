const express = require('express');
const app = express();

//app.use(express.static('public'));
app.use('/', express.static(path.join(__dirname, 'index.html')))

app.post('/add', function (req, res, next) {
    console.log("add");
});

app.get('/get', function(req, res) {
    console.log("get");
});

if (module === require.main) {
  const server = app.listen(8080, () => {
    const port = server.address().port;
    console.log("App listening on port ${port}");
  });
}
module.exports = app;
