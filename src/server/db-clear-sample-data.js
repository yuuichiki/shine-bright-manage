
/**
 * Helper to clear demo/sample data from main tables for new demo loads.
 */
function clearSampleData(db) {
  const tables = [
    "invoice_products", "invoice_services", "invoices",
    "inventory", "batches", "suppliers", "product_categories",
    "services", "customers", "customer_vehicles", "landed_costs",
    "oil_changes", "users"
  ];
  tables.forEach(tbl => {
    try {
      db.run(`DELETE FROM ${tbl}`);
    } catch (e) {}
  });
}

export default clearSampleData;
