var express = require('express');
var bodyParser = require('body-parser');
var cassandra = require('cassandra-driver');
var client = new cassandra.Client( { contactPoints : [ '127.0.0.1' ] } );
client.connect(function(err, result) {
 console.log('Connected.');
});
var app = express();
app.use(bodyParser.json());
app.set('json spaces', 2);

var getAllDept = 'SELECT * FROM DEMO.DEPT;';

app.get('/metadata', function(req, res) {
 res.send(client.hosts.slice(0).map(function (node) {
 return { address : node.address, rack : node.rack, datacenter :
 node.datacenter };
 }));
});

app.get('/dept', function(req, res) {
 client.execute(getAllDept, req, function(err, result)
 {
    if (err) {
        res.status(404).send({ msg : 'Song not found.' });
    } else {
        res.json(result); }
    });
});


var server = app.listen(3000, function() {
 console.log('Listening on port %d', server.address().port);
});