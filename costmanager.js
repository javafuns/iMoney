const express = require('express');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.post('/add', function (req, res, next) {
    console.log("add");
});

app.get('/get', function(req, res) {
    console.log("get");
});

if (module === require.main) {
  const server = app.listen(8080, () => {
    console.log("App listening on *:8080");
  });
}
module.exports = app;
