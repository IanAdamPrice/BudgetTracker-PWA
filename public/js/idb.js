let db;

const request = indexedDB.open('budget_tracker', 1);

request.onupgradeneeded = function(event) {
  const db = event.target.result;

  db.createObjectStore('pending', {autoIncrement: true});
};

request.onsuccess = function(event) {
  db = event.target.result;

  if (navigator.onLine) {
    checkDB();
  }
};

request.onerror = function(event) {
  console.log(event.target.errorCode);
};

function saveRecord(record) {
  const transaction = db.transaction(['pending'], 'readwrite');

  const store = transaction.objectStore('pending');

  store.add(record);
}

function checkDB() {
  const transaction = db.transaction(['pending'], 'readwrite');

  const store = transaction.objectStore('pending');

  const getAll= store.getAll();

  getAll.onsuccess = function() {
    if (getAll.result.length > 0) {
      fetch('/api/transaction/bulk', {
        method: 'POST',
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(() => {

          const transaction = db.transaction(['pending'], 'readwrite');
          const store = transaction.objectStore('pending');
          store.clear();
        })
        .catch(err => {
          console.log(err);
        });
    }
  };
}

window.addEventListener("online", checkDB);

