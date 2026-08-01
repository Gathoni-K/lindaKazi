import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the root .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set. Please check your .env file.");
}

const client = postgres(connectionString);
const db = drizzle(client, { schema });

async function seed() {
  console.log('Seeding mock data for LindaKazi...');

  try {
    // Insert 5 mock workers (3 low-risk, 2 high-risk) into users table
    const insertedWorkers = await db.insert(schema.users).values([
      // Low risk workers
      {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        phoneNumber: '+254700000001',
        role: 'worker',
        kycStatus: 'verified',
        simSwapFlag: false,
        communityRating: '4.80',
        verifiedProBadge: true,
      },
      {
        name: 'Bob Smith',
        email: 'bob@example.com',
        phoneNumber: '+254700000002',
        role: 'worker',
        kycStatus: 'verified',
        simSwapFlag: false,
        communityRating: '4.50',
        verifiedProBadge: false,
      },
      {
        name: 'Charlie Brown',
        email: 'charlie@example.com',
        phoneNumber: '+254700000003',
        role: 'worker',
        kycStatus: 'verified',
        simSwapFlag: false,
        communityRating: '4.90',
        verifiedProBadge: true,
      },
      // High risk workers (explicitly unverified, sim swap flagged, low rating)
      {
        name: 'Dave Danger',
        email: 'dave.danger@example.com',
        phoneNumber: '+254700000004',
        role: 'worker',
        kycStatus: 'unverified',
        simSwapFlag: true,
        communityRating: '1.50',
        verifiedProBadge: false,
      },
      {
        name: 'Eve Suspicious',
        email: 'eve.sus@example.com',
        phoneNumber: '+254700000005',
        role: 'worker',
        kycStatus: 'unverified',
        simSwapFlag: true,
        communityRating: '1.20',
        verifiedProBadge: false,
      }
    ]).returning();
    
    console.log(`Inserted ${insertedWorkers.length} mock workers.`);

    // Insert 2 mock clients into users table
    const insertedClients = await db.insert(schema.users).values([
      {
        name: 'Safe Client One',
        email: 'client.one@example.com',
        phoneNumber: '+254711111111',
        role: 'client',
        kycStatus: 'verified',
      },
      {
        name: 'New Client Two',
        email: 'client.two@example.com',
        phoneNumber: '+254711111112',
        role: 'client',
        kycStatus: 'unverified',
      }
    ]).returning();
    
    console.log(`Inserted ${insertedClients.length} mock clients.`);
    console.log('Seeding completed successfully!');
    
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    process.exit(0);
  }
}

seed();
