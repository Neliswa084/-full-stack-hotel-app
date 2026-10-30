import {Pool ,types}  from 'pg'
import dotenv from 'dotenv'

dotenv.config()

types.setTypeParser(1082, (value) => value);

const pool = process.env.DATABASE_URL
    ? new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    })
    : new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
        port: parseInt(process.env.DB_PORT || '5433'),
    })

export const query = (text : string, params?:any[]) => pool.query(text,params)

export const testDbConnection  = async () => {
    try{
        const client= await pool.connect()
        console.log('Database connection successful')
        client.release()
    }catch (error){
        console.error(' Unable to connect to the database:' , error );
        process.exit(1)

    }
}



