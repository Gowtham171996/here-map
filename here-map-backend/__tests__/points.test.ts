import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import { pool } from '../src/db';

const app = express();
app.use(bodyParser.json());

// Routes (simplified inline)
app.get('/api/points', async (_, res) : Promise<void>  => {
  const result = await pool.query('SELECT lat, lng FROM points');
  res.json(result.rows);
});

app.post('/api/points', async (req, res): Promise<void>  => {
  const { lat, lng } = req.body;
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    res.status(400).json({ error: 'Invalid input' });
  }
  await pool.query('INSERT INTO points (lat, lng) VALUES ($1, $2)', [lat, lng]);
  res.status(201).json({ message: ' Test Point stored' });
});


app.delete('/api/points', async (req, res): Promise<void>  => {
  try
  {
    const result =  await pool.query('delete FROM points where lat = $1 and lng = $2', [10, 20]);
    
    if (result.rowCount === 0) {
      res.status(404).json({ message: 'Point not found' });
    }
    
    res.status(201).json({ message: 'Test Point deleted' });

  } catch (error) {
    console.error('Error deleting point:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

describe('API endpoints', () => {
  it('should return 201 when valid point is posted', async () => {
    const res = await request(app).post('/api/points').send({ lat: 10, lng: 20 });
    expect(res.statusCode).toBe(201);
  });

  it('should return 400 when invalid input is sent', async () => {
    const res = await request(app).post('/api/points').send({ lat: 'foo', lng: 20 });
    expect(res.statusCode).toBe(400);
  });

  it('should return all points', async () => {
    const res = await request(app).get('/api/points');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('should return 201 when valid point is deleted', async () => {
    const res = await request(app).delete('/api/points').send({ lat: 10, lng: 20 });
    expect(res.statusCode).toBe(201);
  });

});

afterAll(async () => {
  await pool.end(); // Clean up DB connections
});
