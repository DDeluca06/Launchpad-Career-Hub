#!/usr/bin/env tsx
/**
 * Database Validation Script for Launchpad Career Hub
 * Run this script to validate database connectivity and schema
 * 
 * Usage: npm run validate-db
 * or: npx tsx scripts/validate-db.ts
 */

import { validateApplicantDatabase } from '../lib/db-validation';
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function main() {
  console.log('🔍 Validating database connection and schema...');
  
  try {
    const result = await validateApplicantDatabase();
    
    if (result.success) {
      console.log('✅ Database validation successful!');
      console.log(`- Connection: OK`);
      console.log(`- Schema: ${result.schema?.tablesExist ? 'OK' : 'Missing tables'}`);
      console.log(`- Relationships: ${result.schema?.relationshipsValid ? 'OK' : 'Invalid'}`);
      console.log('\nDetails:', JSON.stringify(result, null, 2));
      process.exit(0);
    } else {
      console.error('❌ Database validation failed!');
      console.error('Error:', result.message);
      
      if (result.connection && !result.connection.success) {
        console.error('\nConnection Error:', result.connection.error);
        console.error('\nPlease check:');
        console.error('1. Your DATABASE_URL in .env file');
        console.error('2. Database server is running');
        console.error('3. Network connectivity to database server');
      }
      
      if (result.schema && !result.schema.success) {
        console.error('\nSchema Error:', result.schema.error);
        console.error('\nPlease check:');
        console.error('1. All migrations have been applied (npx prisma migrate deploy)');
        console.error('2. Database permissions are correct');
        console.error('3. Prisma schema matches database schema (npx prisma db pull)');
      }
      
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Unexpected error during validation:');
    console.error(error);
    process.exit(1);
  }
}

// Run the validation
main(); 