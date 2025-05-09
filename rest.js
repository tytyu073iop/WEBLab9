const express = require('express');
const app = express.Router();
const bodyParser = require('body-parser');
const store = require('./store');

app.use(bodyParser.json());

app.get('/plant', (req, res) => {
    res.json(store.GetAll());
});

app.get('/plant/pagemode/:pagenum', (req, res) => {
    const toSort = req.query['sort'] == "true" ? true : false;
    res.status(200).json(store.PageGet(Number(req.params['pagenum']), 5, toSort, req.query['template']));
});

app.get('/plant/:name', (req, res) => {
    const key = req.params.name;
    let hash = {};
    try {
        hash[key] = store.GetValue(key);
        res.status(200).json(hash);
    } catch (error) {
        res.status(400).end();
    }
});

app.post('/plant', (req, res) => {
    try {
        store.AddValue(req.body['plant'], req.body['care']);
    } catch (error) {
        res.status(400).end();
    }
    res.status(201).end();
});

app.patch('/plant/:name', (req, res) => {
    try {
        store.EditValue(req.params.name, req.body['care']);
    } catch (error) {
        res.status(400).end();
    }
    res.status(201).end();
});

app.delete('/plant/:name', (req, res) => {
    store.DeleteValue(req.params.name);
    res.status(201).end();
});

module.exports = app;