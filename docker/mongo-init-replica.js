// Inicializa replica set de nó único para suportar transações locais.
rs.initiate({
  _id: 'rs0',
  members: [
    { _id: 0, host: '127.0.0.1:27017' }
  ]
});
