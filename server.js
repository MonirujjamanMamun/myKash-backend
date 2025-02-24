const { port } = require('./utils/allSecret');
const dbConnection = require('./config/db/dbConnection');
const app = require('./app');

// Connect to MongoDB
dbConnection();

app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
