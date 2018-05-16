const express = require('express');
const { router } = require('./routes/apiRoutes');
const bodyParser = require('body-parser');

const app = express();

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use('/', express.static('public'));
app.use('/api/v1', router);

app.listen(app.get('port'), () => { // eslint-disable-next-line
  console.log(`roboReport server listening at ${app.get('port')}`);
});

module.exports = app;
