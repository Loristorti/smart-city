const express = require('express');
const stationsRouter = require('./routes/stations');

const app = express();


app.use(express.json());


app.use(express.static("public"));


app.use('/api/stations', stationsRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur lancé : http://localhost:${PORT}`);
  
});
