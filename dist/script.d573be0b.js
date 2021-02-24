// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"js/script.js":[function(require,module,exports) {
// Синтез речи///////////////////////////////////////////////////////////////////////////////////////////////////
var _window = window,
    speechSynthesis = _window.speechSynthesis; //const speechSynthesis = window.speechSynthesis

var LANG = "ru-RU";
var voiceName = "Google русский"; // let aiAnswer = "Привет. Я упрощённая форма искуственного интелекта версии один точка 0. Мое существование нацелено на обучение и стать незаменимым помощником и приятным собеседником. Меня наделили минимальным набором базовых навыков и реплик.";

var userPhrase = "";
var voices = []; //Генерация голосов

var generateVoices = function generateVoices() {
  voices = speechSynthesis.getVoices();
  var voicesList = voices.map(function (voice, index) {
    return voice.name === voiceName && "<option value=".concat(index, ">").concat(voice.name, " (").concat(voice.lang, ")</option>");
  }).join("");
  voicesSelector.innerHTML = voicesList;
  console.log("Voices have been generated");
}; //generateVoices()
//Воспроизведение


function startSpeak(aiAnswer) {
  if (aiAnswer !== "") {
    console.log("speechSynthesis.speaking");
    playBtn.disabled = true;
    document.querySelector('.loader-container').style.visibility = "hidden"; //let aiAnswer = greeting[(Math.floor(Math.random() * greeting.length))];

    var ssUtterance = new SpeechSynthesisUtterance(aiAnswer);

    ssUtterance.onend = function (event) {
      console.warn("SpeechSynthesis end");
      playBtn.disabled = false;
    };

    ssUtterance.onerror = function (event) {
      console.warn("SpeechSynthesis error");
      playBtn.disabled = true;
    };

    ssUtterance.voice = voices[voicesSelector.value];
    ssUtterance.pitch = pitch.value;
    ssUtterance.rate = rate.value;
    speechSynthesis.speak(ssUtterance);
  } else {
    console.log("aiAnswer is empty");
  }
} //События


playBtn.onclick = function () {
  // console.log(text.value);
  // aiAnswer=text.value
  startSpeak(text.value);
};

voicesSelector.onchange = function () {
  return startSpeak(text.value);
};

rate.onchange = function () {
  return document.querySelector(".rate-value").textContent = rate.value;
};

pitch.onchange = function () {
  return document.querySelector(".pitch-value").textContent = pitch.value;
};

speechSynthesis.onvoiceschanged = generateVoices; ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// распознаватель//////////////////////////////////////////////////////////////////////////////////////////

var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
var SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
var SpeechRecognitionEvent = window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;
var recognition = new SpeechRecognition();
recognition.lang = LANG;
recognition.interimResults = false;
recognition.maxAlternatives = 1; // const commands = {
//   привет: "Привет",
//   какдела: "пока не родила",
//   желтый: "yellow",
//   зеленый: "green",
//   голубой: "blue",
//   синий: "darkblue",
//   фиолетовый: "violet",
// };
// const commandsList = Object.keys(commands);
// console.log(commandsList);
// const commands = {}
// obj['key1'] = new Array();
// obj['key2'] = new Array();
//recognition.continuous = true; // полезная фича не удалять
//////Функции//////

function startRecord() {
  recognition.start();
  console.log("Ready to receive a command.");
  micBtn.disabled = true;
  document.querySelector('.loader-container').style.visibility = "visible";
}

function stopRecord() {
  recognition.stop();
  console.log("Cancel receive a command.");
  micBtn.disabled = false;
} // function knowledgeDBsearch(speechResult) {
//   if (speechResult in commands) {
//     return (aiAnswer = commands[speechResult].value);
//   }
//   return null;
// }
////События////////


micBtn.onclick = startRecord; // microStopBtn.onclick = stopRecord;

recognition.onaudiostart = function () {
  return console.log("onaudiostart");
};

recognition.onspeechend = stopRecord;

recognition.onnomatch = function (event) {
  alert("I didn't recognise that phrase.");
  micBtn.disabled = false;
  document.querySelector('.loader-container').style.visibility = "hidden";
};

recognition.onerror = function (event) {
  console.log("Error occurred in recognition: ".concat(event.error));
  startSpeak('Я ничего не услышала');
  micBtn.disabled = false;
  document.querySelector('.loader-container').style.visibility = "hidden";
};

recognition.onresult = function (event) {
  var last = event.results.length - 1;
  userPhrase = event.results[last][0].transcript; // результат распознавания без проверки в базе знаний

  startSpeak(knowledgeDBsearch(userPhrase)); // openSocket(userPhrase);
  //console.log("Confidence: " + event.results[0][0].confidence);
}; // Программные фичи//////////////////////


function knowledgeDBsearch(speechResult) {
  switch (speechResult.toLowerCase()) {
    case 'как дела':
      return 'пока не родила... хаха';

    case 'как тебя зовут':
      return 'меня.... у меня нет имени';

    case 'привет':
      return 'Привет';

    default:
      return 'я не знаю что это значит';
  }
} //начало работы с программой////
//setTimeout(()=>startSpeak(),300) 
////////////////////////////////
// let dailyTipsDB = ['Знаете ли вы, что с 12-летнего возраста Жанна д’Арк слышала голоса и могла наблюдать странные и необычные видения...','Знаете ли вы, что на изобретение лампы накаливания с угольной нитью у Томаса Эдисона ушло более пяти лет...']
// let dayTips = setInterval(DailyTips,10000)
// activDayTips.onchange = ()=>{
//   if(activDayTips.checked){
//     dayTips
//     console.log('on');
//   }else{
//     clearInterval(dayTips)
//     console.log('off');
//   }
// }
// function DailyTips(){
//   aiAnswer = dailyTipsDB[Math.floor(Math.random() * Math.floor(dailyTipsDB.length))]
//   startSpeak()
// }
////////Web Socket open & close//////////////////////
// function openSocket(somedata) {
//   let socket = new WebSocket("ws://localhost:8080");
//   socket.onopen = function (e) {
//     console.log("[open] Соединение установлено");
//     console.log("Отправляем данные на сервер");
//     socket.send(somedata);
//   };
//   socket.onmessage = function (event) {
//     document.querySelector('.loader-container').style.visibility="hidden";
//     if(event.data===''||event.data===null||event.data===undefined){
//       alert('[warn]Пустой ответ от сервера')
//     }else{
//       text.value = event.data;
//       aiAnswer = event.data;
//       startSpeak();
//       console.log(`[message] Данные получены с сервера: ${event.data}`);
//     }
//   };
//   socket.onclose = function (event) {
//     if (event.wasClean) {
//       console.log(
//         `[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`
//       );
//     } else {
//       // например, сервер убил процесс или сеть недоступна
//       // обычно в этом случае event.code 1006
//       console.log("[close] Соединение прервано");
//       startSpeak("Сервер не отвечает...")
//     }
//   };
//   socket.onerror = function (error) {
//     console.log(`[error] ${error.message}`);
//     startSpeak('Что-то пошло не так...')
//   };
// }
},{}],"C:/Users/User/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "56035" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["C:/Users/User/AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/script.js"], null)
//# sourceMappingURL=/script.d573be0b.js.map