
  var Module = typeof BusytexPipeline !== 'undefined' ? BusytexPipeline : {};
  
  if (!Module.expectedDataFileDownloads) {
    Module.expectedDataFileDownloads = 0;
  }
  Module.expectedDataFileDownloads++;
  (function() {
   var loadPackage = function(metadata) {
  
      var PACKAGE_PATH;
      if (typeof window === 'object') {
        PACKAGE_PATH = window['encodeURIComponent'](window.location.pathname.toString().substring(0, window.location.pathname.toString().lastIndexOf('/')) + '/');
      } else if (typeof location !== 'undefined') {
        // worker
        PACKAGE_PATH = encodeURIComponent(location.pathname.toString().substring(0, location.pathname.toString().lastIndexOf('/')) + '/');
      } else {
        throw 'using preloaded data can only be done on a web page or in a web worker';
      }
      var PACKAGE_NAME = 'build/wasm/ubuntu-texlive-latex-recommended.data';
      var REMOTE_PACKAGE_BASE = 'ubuntu-texlive-latex-recommended.data';
      if (typeof Module['locateFilePackage'] === 'function' && !Module['locateFile']) {
        Module['locateFile'] = Module['locateFilePackage'];
        err('warning: you defined Module.locateFilePackage, that has been renamed to Module.locateFile (using your locateFilePackage for now)');
      }
      var REMOTE_PACKAGE_NAME = Module['locateFile'] ? Module['locateFile'](REMOTE_PACKAGE_BASE, '') : REMOTE_PACKAGE_BASE;
    
      var REMOTE_PACKAGE_SIZE = metadata['remote_package_size'];
      var PACKAGE_UUID = metadata['package_uuid'];
    
      function fetchRemotePackage(packageName, packageSize, callback, errback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', packageName, true);
        xhr.responseType = 'arraybuffer';
        xhr.onprogress = function(event) {
          var url = packageName;
          var size = packageSize;
          if (event.total) size = event.total;
          if (event.loaded) {
            if (!xhr.addedTotal) {
              xhr.addedTotal = true;
              if (!Module.dataFileDownloads) Module.dataFileDownloads = {};
              Module.dataFileDownloads[url] = {
                loaded: event.loaded,
                total: size
              };
            } else {
              Module.dataFileDownloads[url].loaded = event.loaded;
            }
            var total = 0;
            var loaded = 0;
            var num = 0;
            for (var download in Module.dataFileDownloads) {
            var data = Module.dataFileDownloads[download];
              total += data.total;
              loaded += data.loaded;
              num++;
            }
            total = Math.ceil(total * Module.expectedDataFileDownloads/num);
            if (Module['setStatus']) Module['setStatus']('Downloading data... (' + loaded + '/' + total + ')');
          } else if (!Module.dataFileDownloads) {
            if (Module['setStatus']) Module['setStatus']('Downloading data...');
          }
        };
        xhr.onerror = function(event) {
          throw new Error("NetworkError for: " + packageName);
        }
        xhr.onload = function(event) {
          if (xhr.status == 200 || xhr.status == 304 || xhr.status == 206 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
            var packageData = xhr.response;
            callback(packageData);
          } else {
            throw new Error(xhr.statusText + " : " + xhr.responseURL);
          }
        };
        xhr.send(null);
      };

      function handleError(error) {
        console.error('package error:', error);
      };
    
    function runWithFS() {
  
      function assert(check, msg) {
        if (!check) throw msg + new Error().stack;
      }
  Module['FS_createPath']('/', 'texmf', true, true);
Module['FS_createPath']('/texmf', 'texmf-dist', true, true);
Module['FS_createPath']('/texmf/texmf-dist', 'tex', true, true);
Module['FS_createPath']('/texmf/texmf-dist/tex', 'latex', true, true);
Module['FS_createPath']('/texmf/texmf-dist/tex/latex', 'l3packages', true, true);
Module['FS_createPath']('/texmf/texmf-dist/tex/latex/l3packages', 'xfrac', true, true);
Module['FS_createPath']('/texmf/texmf-dist/tex/latex', 'ms', true, true);
Module['FS_createPath']('/texmf/texmf-dist/tex/latex/l3packages', 'l3keys2e', true, true);
Module['FS_createPath']('/texmf/texmf-dist/tex/latex/l3packages', 'xfp', true, true);
Module['FS_createPath']('/texmf/texmf-dist/tex/latex/l3packages', 'xparse', true, true);
Module['FS_createPath']('/texmf/texmf-dist/tex', 'generic', true, true);
Module['FS_createPath']('/texmf/texmf-dist/tex/generic', 'infwarerr', true, true);
Module['FS_createPath']('/texmf/texmf-dist/tex/latex', 'grffile', true, true);
Module['FS_createPath']('/', 'var', true, true);
Module['FS_createPath']('/var', 'log', true, true);
Module['FS_createPath']('/texmf/texmf-dist/tex/generic', 'pdftexcmds', true, true);
Module['FS_createPath']('/texmf/texmf-dist/tex/latex/l3packages', 'xtemplate', true, true);

      /** @constructor */
      function DataRequest(start, end, audio) {
        this.start = start;
        this.end = end;
        this.audio = audio;
      }
      DataRequest.prototype = {
        requests: {},
        open: function(mode, name) {
          this.name = name;
          this.requests[name] = this;
          Module['addRunDependency']('fp ' + this.name);
        },
        send: function() {},
        onload: function() {
          var byteArray = this.byteArray.subarray(this.start, this.end);
          this.finish(byteArray);
        },
        finish: function(byteArray) {
          var that = this;
  
          Module['FS_createDataFile'](this.name, null, byteArray, true, true, true); // canOwn this data in the filesystem, it is a slide into the heap that will never change
          Module['removeRunDependency']('fp ' + that.name);
  
          this.requests[this.name] = null;
        }
      };
  
    
        var indexedDB;
        if (typeof window === 'object') {
          indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
        } else if (typeof location !== 'undefined') {
          // worker
          indexedDB = self.indexedDB;
        } else {
          throw 'using IndexedDB to cache data can only be done on a web page or in a web worker';
        }
        var IDB_RO = "readonly";
        var IDB_RW = "readwrite";
        var DB_NAME = "EM_PRELOAD_CACHE";
        var DB_VERSION = 1;
        var METADATA_STORE_NAME = 'METADATA';
        var PACKAGE_STORE_NAME = 'PACKAGES';
        function openDatabase(callback, errback) {
          try {
            var openRequest = indexedDB.open(DB_NAME, DB_VERSION);
          } catch (e) {
            return errback(e);
          }
          openRequest.onupgradeneeded = function(event) {
            var db = event.target.result;

            if(db.objectStoreNames.contains(PACKAGE_STORE_NAME)) {
              db.deleteObjectStore(PACKAGE_STORE_NAME);
            }
            var packages = db.createObjectStore(PACKAGE_STORE_NAME);

            if(db.objectStoreNames.contains(METADATA_STORE_NAME)) {
              db.deleteObjectStore(METADATA_STORE_NAME);
            }
            var metadata = db.createObjectStore(METADATA_STORE_NAME);
          };
          openRequest.onsuccess = function(event) {
            var db = event.target.result;
            callback(db);
          };
          openRequest.onerror = function(error) {
            errback(error);
          };
        };

        // This is needed as chromium has a limit on per-entry files in IndexedDB
        // https://cs.chromium.org/chromium/src/content/renderer/indexed_db/webidbdatabase_impl.cc?type=cs&sq=package:chromium&g=0&l=177
        // https://cs.chromium.org/chromium/src/out/Debug/gen/third_party/blink/public/mojom/indexeddb/indexeddb.mojom.h?type=cs&sq=package:chromium&g=0&l=60
        // We set the chunk size to 64MB to stay well-below the limit
        var CHUNK_SIZE = 64 * 1024 * 1024;

        function cacheRemotePackage(
          db,
          packageName,
          packageData,
          packageMeta,
          callback,
          errback
        ) {
          var transactionPackages = db.transaction([PACKAGE_STORE_NAME], IDB_RW);
          var packages = transactionPackages.objectStore(PACKAGE_STORE_NAME);
          var chunkSliceStart = 0;
          var nextChunkSliceStart = 0;
          var chunkCount = Math.ceil(packageData.byteLength / CHUNK_SIZE);
          var finishedChunks = 0;
          for (var chunkId = 0; chunkId < chunkCount; chunkId++) {
            nextChunkSliceStart += CHUNK_SIZE;
            var putPackageRequest = packages.put(
              packageData.slice(chunkSliceStart, nextChunkSliceStart),
              'package/' + packageName + '/' + chunkId
            );
            chunkSliceStart = nextChunkSliceStart;
            putPackageRequest.onsuccess = function(event) {
              finishedChunks++;
              if (finishedChunks == chunkCount) {
                var transaction_metadata = db.transaction(
                  [METADATA_STORE_NAME],
                  IDB_RW
                );
                var metadata = transaction_metadata.objectStore(METADATA_STORE_NAME);
                var putMetadataRequest = metadata.put(
                  {
                    'uuid': packageMeta.uuid,
                    'chunkCount': chunkCount
                  },
                  'metadata/' + packageName
                );
                putMetadataRequest.onsuccess = function(event) {
                  callback(packageData);
                };
                putMetadataRequest.onerror = function(error) {
                  errback(error);
                };
              }
            };
            putPackageRequest.onerror = function(error) {
              errback(error);
            };
          }
        }

        /* Check if there's a cached package, and if so whether it's the latest available */
        function checkCachedPackage(db, packageName, callback, errback) {
          var transaction = db.transaction([METADATA_STORE_NAME], IDB_RO);
          var metadata = transaction.objectStore(METADATA_STORE_NAME);
          var getRequest = metadata.get('metadata/' + packageName);
          getRequest.onsuccess = function(event) {
            var result = event.target.result;
            if (!result) {
              return callback(false, null);
            } else {
              return callback(PACKAGE_UUID === result['uuid'], result);
            }
          };
          getRequest.onerror = function(error) {
            errback(error);
          };
        }

        function fetchCachedPackage(db, packageName, metadata, callback, errback) {
          var transaction = db.transaction([PACKAGE_STORE_NAME], IDB_RO);
          var packages = transaction.objectStore(PACKAGE_STORE_NAME);

          var chunksDone = 0;
          var totalSize = 0;
          var chunkCount = metadata['chunkCount'];
          var chunks = new Array(chunkCount);

          for (var chunkId = 0; chunkId < chunkCount; chunkId++) {
            var getRequest = packages.get('package/' + packageName + '/' + chunkId);
            getRequest.onsuccess = function(event) {
              // If there's only 1 chunk, there's nothing to concatenate it with so we can just return it now
              if (chunkCount == 1) {
                callback(event.target.result);
              } else {
                chunksDone++;
                totalSize += event.target.result.byteLength;
                chunks.push(event.target.result);
                if (chunksDone == chunkCount) {
                  if (chunksDone == 1) {
                    callback(event.target.result);
                  } else {
                    var tempTyped = new Uint8Array(totalSize);
                    var byteOffset = 0;
                    for (var chunkId in chunks) {
                      var buffer = chunks[chunkId];
                      tempTyped.set(new Uint8Array(buffer), byteOffset);
                      byteOffset += buffer.byteLength;
                      buffer = undefined;
                    }
                    chunks = undefined;
                    callback(tempTyped.buffer);
                    tempTyped = undefined;
                  }
                }
              }
            };
            getRequest.onerror = function(error) {
              errback(error);
            };
          }
        }
      
      function processPackageData(arrayBuffer) {
        assert(arrayBuffer, 'Loading data file failed.');
        assert(arrayBuffer instanceof ArrayBuffer, 'bad input to processPackageData');
        var byteArray = new Uint8Array(arrayBuffer);
        var curr;
        
            var compressedData = {"data":null,"cachedOffset":127669,"cachedIndexes":[-1,-1],"cachedChunks":[null,null],"offsets":[0,1356,2130,3097,3871,4608,5521,6168,7663,8884,10279,11411,12622,13987,15176,16535,17716,19205,20011,21342,22265,23550,24866,25778,26622,27460,28372,29254,30263,31115,31904,32795,33664,34566,35498,36224,37047,37886,38726,39383,40196,41024,41593,42263,43140,44024,44984,45843,46580,47306,48328,49218,50082,50969,52056,52961,53898,54963,56129,56755,57592,58639,60006,60734,61736,62953,63985,64891,65987,67166,68166,69227,70090,71121,72065,73321,74052,74598,75059,75440,75819,76215,76549,76916,77301,77745,78116,78476,78865,79259,79684,80089,80501,80888,81269,81762,82134,82512,82878,83270,83627,83966,84312,84694,85052,85428,85790,86177,86540,86905,87259,87646,88053,88426,88892,89164,89460,89733,90010,90295,90596,90923,91264,91708,92020,92312,92614,92914,93249,94185,95334,96264,97111,98080,98953,99847,100900,101597,102440,103727,104808,105794,106893,107864,109105,109978,110703,111287,112215,113127,113952,114416,115348,116185,116912,117726,118596,119399,120322,121093,121649,122451,123285,124371,125331,126351,127192],"sizes":[1356,774,967,774,737,913,647,1495,1221,1395,1132,1211,1365,1189,1359,1181,1489,806,1331,923,1285,1316,912,844,838,912,882,1009,852,789,891,869,902,932,726,823,839,840,657,813,828,569,670,877,884,960,859,737,726,1022,890,864,887,1087,905,937,1065,1166,626,837,1047,1367,728,1002,1217,1032,906,1096,1179,1000,1061,863,1031,944,1256,731,546,461,381,379,396,334,367,385,444,371,360,389,394,425,405,412,387,381,493,372,378,366,392,357,339,346,382,358,376,362,387,363,365,354,387,407,373,466,272,296,273,277,285,301,327,341,444,312,292,302,300,335,936,1149,930,847,969,873,894,1053,697,843,1287,1081,986,1099,971,1241,873,725,584,928,912,825,464,932,837,727,814,870,803,923,771,556,802,834,1086,960,1020,841,477],"successes":[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]}
;
            compressedData['data'] = byteArray;
            assert(typeof LZ4 === 'object', 'LZ4 not present - was your app build with  -s LZ4=1  ?');
            LZ4.loadPackage({ 'metadata': metadata, 'compressedData': compressedData });
            Module['removeRunDependency']('datafile_build/wasm/ubuntu-texlive-latex-recommended.data');
      
      };
      Module['addRunDependency']('datafile_build/wasm/ubuntu-texlive-latex-recommended.data');
    
      if (!Module.preloadResults) Module.preloadResults = {};
    
        function preloadFallback(error) {
          console.error(error);
          console.error('falling back to default preload behavior');
          fetchRemotePackage(REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE, processPackageData, handleError);
        };

        openDatabase(
          function(db) {
            checkCachedPackage(db, PACKAGE_PATH + PACKAGE_NAME,
              function(useCached, metadata) {
                Module.preloadResults[PACKAGE_NAME] = {fromCache: useCached};
                if (useCached) {
                  fetchCachedPackage(db, PACKAGE_PATH + PACKAGE_NAME, metadata, processPackageData, preloadFallback);
                } else {
                  fetchRemotePackage(REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE,
                    function(packageData) {
                      cacheRemotePackage(db, PACKAGE_PATH + PACKAGE_NAME, packageData, {uuid:PACKAGE_UUID}, processPackageData,
                        function(error) {
                          console.error(error);
                          processPackageData(packageData);
                        });
                    }
                  , preloadFallback);
                }
              }
            , preloadFallback);
          }
        , preloadFallback);

        if (Module['setStatus']) Module['setStatus']('Downloading...');
      
    }
    if (Module['calledRun']) {
      runWithFS();
    } else {
      if (!Module['preRun']) Module['preRun'] = [];
      Module["preRun"].push(runWithFS); // FS is not initialized yet, wait for it
    }
  
   }
   loadPackage({"files": [{"filename": "/texmf/texmf-dist/tex/latex/l3packages/xfrac/xfrac.sty", "start": 0, "end": 14742, "audio": 0}, {"filename": "/texmf/texmf-dist/tex/latex/ms/multitoc.sty", "start": 14742, "end": 19264, "audio": 0}, {"filename": "/texmf/texmf-dist/tex/latex/ms/everysel.sty", "start": 19264, "end": 23887, "audio": 0}, {"filename": "/texmf/texmf-dist/tex/latex/ms/everyshi.sty", "start": 23887, "end": 27765, "audio": 0}, {"filename": "/texmf/texmf-dist/tex/latex/ms/prelim2e.sty", "start": 27765, "end": 32400, "audio": 0}, {"filename": "/texmf/texmf-dist/tex/latex/ms/count1to.sty", "start": 32400, "end": 37620, "audio": 0}, {"filename": "/texmf/texmf-dist/tex/latex/l3packages/l3keys2e/l3keys2e.sty", "start": 37620, "end": 42235, "audio": 0}, {"filename": "/texmf/texmf-dist/tex/latex/l3packages/xfp/xfp.sty", "start": 42235, "end": 43501, "audio": 0}, {"filename": "/texmf/texmf-dist/tex/latex/l3packages/xparse/xparse-generic.tex", "start": 43501, "end": 123642, "audio": 0}, {"filename": "/texmf/texmf-dist/tex/latex/l3packages/xparse/xparse.ltx", "start": 123642, "end": 124463, "audio": 0}, {"filename": "/texmf/texmf-dist/tex/latex/l3packages/xparse/xparse.sty", "start": 124463, "end": 130368, "audio": 0}, {"filename": "/texmf/texmf-dist/tex/generic/infwarerr/infwarerr.sty", "start": 130368, "end": 138724, "audio": 0}, {"filename": "/texmf/texmf-dist/tex/latex/grffile/grffile-2017-06-30.sty", "start": 138724, "end": 152513, "audio": 0}, {"filename": "/texmf/texmf-dist/tex/latex/grffile/grffile.sty", "start": 152513, "end": 154012, "audio": 0}, {"filename": "/var/log/ubuntu-texlive-latex-recommended.skipped.txt", "start": 154012, "end": 263284, "audio": 0}, {"filename": "/texmf/texmf-dist/tex/generic/pdftexcmds/pdftexcmds.sty", "start": 263284, "end": 283373, "audio": 0}, {"filename": "/texmf/texmf-dist/tex/generic/pdftexcmds/pdftexcmds.lua", "start": 283373, "end": 292820, "audio": 0}, {"filename": "/texmf/texmf-dist/tex/latex/l3packages/xtemplate/xtemplate.sty", "start": 292820, "end": 341323, "audio": 0}], "remote_package_size": 131765, "package_uuid": "ea4cf5f9-517f-4def-94cb-b848e06b4f45"});
  
  })();
  