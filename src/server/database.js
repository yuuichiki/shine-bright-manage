
// Refactored database.js - main orchestrator for DB logic

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

    // Create a new database
    db = new SQL.Database();

    console.log("SQLite database initialized in memory");

    // Create tables
    createTables(db);

    // Clear sample data before loading new demo
    clearSampleData(db);

    // Load sample data for testing
    loadSampleData(db);

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
