const deleteIngestHandler = doc => {
  console.log(doc.payload);
  return doc.drop();
};

module.exports = deleteIngestHandler;
