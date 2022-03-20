let db;

const request = indexedDB.open('budget_tracker', 1);

request.onupgradeneeded = function(event) {
  const db = event.target.result;

  db.createObjectStore('new_budget', {autoIncrement: true});
};

request.onsuccess = function(event) {
  db = event.traget.result;

  if (navigator.onLine) {
    // TODO
  }
};

request.onerror = function(event) {
  // TODO
  console.log(event.target.errorCode);
};

function saveRecord(record) {
  //TODO


}