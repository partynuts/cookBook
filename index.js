const app = require('./server.js');
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`cook book app listening on port ${port}`));
