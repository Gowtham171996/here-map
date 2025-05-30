import { Client } from 'pg';

async function CreateDB() {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    password: 'postgres',
    port: 5432,
    database: 'postgres' // connect to default db first
  });

  await client.connect();

  // Check if DB already exists
  const dbCheck = await client.query(`SELECT 1 FROM pg_database WHERE datname='heremap'`);
  if (dbCheck.rowCount === 0) {
    await client.query(`CREATE DATABASE heremap`);
    console.log("Database 'heremap' created.");
  } else {
    console.log("Database already exists.");
  }

  await client.end();

  // Now connect to the new DB and create table
  const heremapClient = new Client({
    user: 'postgres',
    host: 'localhost',
    password: 'postgres',
    port: 5432,
    database: 'heremap'
  });

  await heremapClient.connect();

  await heremapClient.query(`
    CREATE TABLE IF NOT EXISTS points (
      id SERIAL PRIMARY KEY,
      lat DOUBLE PRECISION NOT NULL,
      lng DOUBLE PRECISION NOT NULL
    )
  `);

  console.log("Table 'points' ensured.");
  await heremapClient.end();
}

CreateDB().catch((err) => {
  console.error('Error initializing DB:', err);
});