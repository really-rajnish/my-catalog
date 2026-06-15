import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check endpoint (used by Render)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'Node.js Microservice' });
});

// A dummy endpoint to test the integration
app.get('/api/v1/node/hello', (req, res) => {
  res.status(200).json({
    message: 'Hello from your new Node.js microservice!',
    timestamp: new Date().toISOString()
  });
});

app.listen(port, () => {
  console.log(`Node.js microservice listening on port ${port}`);
});
