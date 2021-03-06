function openIndexedDB (fileindex) {
  // This works on all devices/browsers, and uses IndexedDBShim as a final fallback
  var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

  var openDB = indexedDB.open("MyDatabase", 1);

  openDB.onupgradeneeded = function() {
    var db = {}
    db.result = openDB.result;
    db.store = db.result.createObjectStore("MyObjectStore", {keyPath: "id"});
    if (fileindex) db.index = db.store.createIndex("NameIndex", fileindex);
    saveIndexedDB(0, 1);
  };

  return openDB;
}

function getStoreIndexedDB (openDB) {
  var db = {};
  db.result = openDB.result;
  db.tx = db.result.transaction("MyObjectStore", "readwrite");
  db.store = db.tx.objectStore("MyObjectStore");
  db.index = db.store.index("NameIndex");

  return db;
}

function saveIndexedDB (filename, filedata, fileindex) {
  var openDB = openIndexedDB(fileindex);

  openDB.onsuccess = function() {
    var db = getStoreIndexedDB(openDB);

    db.store.put({id: filename, data: filedata});
  }

  return true;
}

function findIndexedDB (filesearch, callback) {
  return loadIndexedDB(null, callback, filesearch);
}

function loadIndexedDB (filename, callback, filesearch) {
  var openDB = openIndexedDB();

  openDB.onsuccess = function() {
    var db = getStoreIndexedDB(openDB);

    var getData;
    if (filename) {
      getData = db.store.get(filename);
    } else {
      getData = db.index.get(filesearch);
    }

    getData.onsuccess = function() {
      callback(getData.result.data);
    };

    db.tx.oncomplete = function() {
      db.result.close();
    };
  }

  return true;
}
