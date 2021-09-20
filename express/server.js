var express = require('express');
var cors = require('cors');

var app = express();
var port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
}

app.post('/auth', cors(corsOptions), (req, res) => {
  console.log(`req.body`, req.body);
  if (req.body.username === 'admin' && req.body.password === 'admin') {
    res.send({});
  } else {
    res.status(401).send({});
  }
  res.end();
});

app.listen(port);

console.log('LastPass Code Challenge listening on port ' + port);