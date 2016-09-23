/**
 * Created by Bird on 2016/3/27.
 */
var express = require('express'),
    app = express(),
    path = require('path');

//serve static index.html as default
//app.use(express.static(__dirname + '/', {index: 'index_sass.html'}));
app.use(express.static(__dirname + '/'));

//bind and listen for connections on the given host and port
app.listen(9008, function () {
    console.log('Server listening on', 9008);
});
