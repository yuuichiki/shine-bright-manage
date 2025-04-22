
const path = require('path');
const fs = require('fs');
const initSqlJs = require('sql.js');

const createTables = require('./db-create-tables');
const clearSampleData = require('./db-clear-sample-data');
const loadSampleData = require('./db-load-sample-data');

let db;
let SQL;

// Initialize the database
async function initializeDatabase() {
  try {
    // Initialize SQL.js
    SQL = await initSqlJs();
    
    const dbPath = path.join(__dirname, 'carwash.sqlite');
    let dbExists = fs.existsSync(dbPath);
    
    // If database file exists, load it
    if (dbExists) {
      const fileBuffer = fs.readFileSync(dbPath);
      db = new SQL.Database(fileBuffer);
      console.log("Loaded existing SQLite database from file");
    } else {
      // Create a new database
      db = new SQL.Database();
      console.log("Created new SQLite database");

      // Create tables
      createTables(db);
      
      // Clear any existing sample data
      clearSampleData(db);
      
      // Load sample data for testing
      loadSampleData(db);
      
      // Save the initial database to file
      const data = db.export();
      const buffer = Buffer.from(data);
      fs.writeFileSync(dbPath, buffer);
      console.log("Saved initial database to file");
    }

    // Set up auto-save on changes
    const originalRun = db.run;
    db.run = function(sql, params) {
      const result = originalRun.call(db, sql, params);
      // Save database after each change
      const data = db.export();
      const buffer = Buffer.from(data);
      fs.writeFileSync(dbPath, buffer);
      return result;
    };

    return db;
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}

// Helper functions for database operations

function all(query, params = []) {
  try {
    const result = db.exec(query, params);
    if (!result || result.length === 0) return [];

    const columns = result[0].columns;
    const rows = result[0].values.map(row => {
      const obj = {};
      columns.forEach((col, i) => {
        obj[col] = row[i];
      });
      return obj;
    });

    return rows;
  } catch (err) {
    console.error('Error executing query:', err);
    return [];
  }
}

function get(query, params = []) {
  try {
    const result = db.exec(query, params);
    if (!result || result.length === 0 || result[0].values.length === 0) return null;

    const columns = result[0].columns;
    const row = result[0].values[0];

    const obj = {};
    columns.forEach((col, i) => {
      obj[col] = row[i];
    });

    return obj;
  } catch (err) {
    console.error('Error executing query:', err);
    return null;
  }
}

function run(query, params = []) {
  try {
    db.run(query, params);
    const lastId = db.exec('SELECT last_insert_rowid()');
    return {
      lastInsertRowid: lastId && lastId.length > 0 ? lastId[0].values[0][0] : null,
      changes: 1 // sql.js doesn't provide changes info, so we'll just assume 1
    };
  } catch (err) {
    console.error('Error executing query:', err);
    throw err;
  }
}

// Initialize database when this module is loaded
let dbPromise = initializeDatabase();

// Export a promise that resolves with the database interface
module.exports = {
  getDb: async () => {
    await dbPromise;
    return {
      all,
      get,
      run,
      exec: (query) => db.run(query)
    };
  }
};
