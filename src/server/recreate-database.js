import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import createTables from './db-create-tables.js';
import clearSampleData from './db-clear-sample-data.js';
import loadSampleData from './db-load-sample-data.js';
import initSqlJs from 'sql.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function recreateDatabase() {
  try {
    console.log('🔄 Recreating SQLite database...');
    
    // Initialize SQL.js
    const SQL = await initSqlJs();
    
    const dbPath = path.join(__dirname, 'carwash.sqlite');
    
    // Remove existing database file if it exists
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
      console.log('✅ Removed existing database file');
    }
    
    // Create a new database
    const db = new SQL.Database();
    console.log('✅ Created new SQLite database');

    // Create all tables
    createTables(db);
    console.log('✅ Created all database tables');
    
    // Clear any existing sample data (just in case)
    clearSampleData(db);
    console.log('✅ Cleared sample data');
    
    // Load sample data for testing (currently empty)
    loadSampleData(db);
    console.log('✅ Database ready with empty tables');
    
    // Save the database to file
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
    console.log('✅ Saved database to file');
    
    console.log('🎉 Database recreation completed successfully!');
    
    // Close the database
    db.close();
    
  } catch (error) {
    console.error('❌ Error recreating database:', error);
    throw error;
  }
}

// Run the recreation immediately
console.log('🚀 Starting database recreation...');
recreateDatabase().catch(console.error);