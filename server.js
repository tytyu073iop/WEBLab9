const express = require('express');
const app = express();
const routes = require('./rest');
const qs = require("qs");
const port = 3000;

app.set('query parser', (str) => qs.parse(str));

console.log("this file executed");

app.use(express.static("."));
app.set('view engine', 'pug');
app.set('views', './view'); 

app.get('/', (req, res) => {
  res.render('index');
});

app.use(routes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});