// Inicializa replica set de nó único para suportar transações locais.
rs.initiate({
  _id: 'rs0',
  members: [
    { _id: 0, host: 'mongo_db_pastelaria:27017' }
  ]
});
