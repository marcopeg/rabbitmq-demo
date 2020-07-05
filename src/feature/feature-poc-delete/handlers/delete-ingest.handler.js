const deleteIngestHandler = doc => {
  console.log(doc);
  return doc.drop();
};

module.exports = deleteIngestHandler;
