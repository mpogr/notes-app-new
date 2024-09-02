import pkg from 'pg';

const { Pool } = pkg;
const pool = new Pool({
    connectionString: "postgres://" + 
        process.env.POSTGRES_USER + ":" +
        process.env.POSTGRES_PASSWORD + "@" +
        process.env.POSTGRES_HOST +":5432/" +
        process.env.POSTGRES_DB + "?sslmode=disable",
        ssl: { rejectUnauthorized: false }
});

export default pool;
