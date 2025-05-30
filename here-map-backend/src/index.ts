import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { pool } from './db';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

app.get('/api/points', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query('SELECT lat, lng FROM points');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'DB error' });
  }
});

app.post('/api/points', async (req: Request, res: Response): Promise<void> => {
  const { lat, lng } = req.body;

  if (typeof lat !== 'number' || typeof lng !== 'number') {
    res.status(400).json({ error: 'Invalid input' });
    return;
  }

  try {
    await pool.query('INSERT INTO points (lat, lng) VALUES ($1, $2)', [lat, lng]);
    res.status(201).json({ message: 'Point stored' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
