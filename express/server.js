var express = require('express');
var cors = require('cors');
var pbkdf2 = require('pbkdf2');

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
  // var derivedPasswordKey = pbkdf2.pbkdf2Sync(req.body.password, 'salt', 1, 32, 'sha512');
  if (req.body.username === 'admin' && req.body.password === 'admin') {
    res.send({});
  } else {
    res.status(401).send({});
  }
  res.end();
});

app.listen(port);

console.log('LastPass Code Challenge listening on port ' + port);