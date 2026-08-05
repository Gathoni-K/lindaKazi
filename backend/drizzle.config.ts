import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();


if (!process.env.DIRECT_URL) {
    throw new Error('DIRECT_URL is missing in your .env file!');
}

export default defineConfig({

    schema: './src/db/schema/index.ts',


    out: './drizzle/migrations',

    dialect: 'postgresql',

    dbCredentials: {

        url: process.env.DIRECT_URL,
    },


    verbose: true,


    strict: true,
});