const express = require('express');
const  morgan = require('morgan');
const cors = require('cors'); 
const  taskRoutes = require('./routes/rut');
const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(cors()); 
app.use('/api', taskRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});