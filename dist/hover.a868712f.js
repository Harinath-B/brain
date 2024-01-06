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
})({"hover.js":[function(require,module,exports) {
(function () {
  var MorphBg = function MorphBg(element) {
    this.element = element;
    this.wrapper = this.element.closest(".js-morph-bg-wrapper");
    this.elementId = this.element.getAttribute("id");
    this.targets = document.querySelectorAll('[data-morph-bg="' + this.elementId + '"]');
    this.bgTargets = [];
    this.action = this.element.getAttribute("data-morph-bg-event");
    this.targetIndex = false;
    this.deafultIndex = false;
    if (!this.action) this.action = "click";
    initMorphBg(this);
  };
  function initMorphBg(element) {
    getBgTargets(element);
    // see if we need to set the element visible
    setInitialState(element);
    // add listeners
    if (element.action == "click") {
      initClickEvent(element);
    } else {
      initHoverEvent(element);
    }
    // on window resize/fonts loaded - reset background element size
    window.addEventListener("update-morphbg", function () {
      morphBgResize(element);
    });
    window.addEventListener("hide-morphbg", function () {
      morphBgHide(element);
    });
  }
  function getBgTargets(element) {
    for (var i = 0; i < element.targets.length; i++) {
      var bgTarget = element.targets[i].querySelector("[data-morph-bg-target]") || element.targets[i];
      element.bgTargets.push(bgTarget);
    }
  }
  function setInitialState(element) {
    for (var i = 0; i < element.targets.length; i++) {
      if (element.targets[i].hasAttribute("data-morph-bg-active")) {
        setPosition(element, i);
        element.deafultIndex = i;
        break;
      }
    }
  }
  function initClickEvent(element) {
    for (var i = 0; i < element.targets.length; i++) {
      (function (i) {
        element.targets[i].addEventListener("click", function (event) {
          setPosition(element, i);
        });
      })(i);
    }
  }
  function initHoverEvent(element) {
    for (var i = 0; i < element.targets.length; i++) {
      (function (i) {
        element.targets[i].addEventListener("mouseenter", function (event) {
          setPosition(element, i);
        });
        element.targets[i].addEventListener("mouseleave", function (event) {
          resetBgPosition(element, event);
        });
      })(i);
    }

    // if there's [data-morph-bg-preserve] element - detect mouseleave
    var preserveWrapper = element.targets[0].closest("[data-morph-bg-preserve]");
    if (preserveWrapper) {
      preserveWrapper.addEventListener("mouseleave", function (event) {
        resetBgPosition(element, event);
      });
    }
  }
  function setPosition(element, index) {
    // get size + position target
    var targetInfo = element.bgTargets[index].getBoundingClientRect(),
      targetRadius = getComputedStyle(element.bgTargets[index]).borderRadius;

    // get the wrapper parent info
    var wrapperInfo = element.wrapper.getBoundingClientRect();

    // modify element position and size
    element.element.style.transform = "translateX(" + (targetInfo.left - wrapperInfo.left) + "px) translateY(" + (targetInfo.top - wrapperInfo.top) + "px) translateZ(-0.1px)";
    element.element.style.height = targetInfo.height + "px";
    element.element.style.width = targetInfo.width + "px";

    // modify element radius
    element.element.style.borderRadius = targetRadius;

    // show item
    element.element.classList.add("morph-bg--visible");
    setTimeout(function () {
      if (!element.element.classList.contains("morph-bg--has-transition")) element.element.classList.add("morph-bg--has-transition");
    }, 10);

    // update target index
    element.targetIndex = index;
  }
  function resetBgPosition(element, event) {
    if (event.relatedTarget.closest('[data-morph-bg="' + element.elementId + '"]') || event.relatedTarget.closest("[data-morph-bg-preserve]")) {
      return; // mouse is inside another target
    }
    // check if tehre was a default index
    if (element.deafultIndex !== false) {
      element.targetIndex = element.deafultIndex;
      setPosition(element, element.targetIndex);
      return;
    }
    // if none of the above -> hide bg
    element.element.classList.remove("morph-bg--visible", "morph-bg--has-transition");
    // reset target index
    element.targetIndex = false;
  }
  function morphBgResize(element) {
    if (element.targetIndex === false) return;
    setPosition(element, element.targetIndex);
    element.element.style.display = "";
  }
  function morphBgHide(element) {
    element.element.style.display = "none";
  }
  window.MorphBg = MorphBg;

  //initialize the MorphBg objects
  var morphBg = document.getElementsByClassName("js-morph-bg");
  if (morphBg.length > 0) {
    for (var i = 0; i < morphBg.length; i++) {
      (function (i) {
        new MorphBg(morphBg[i]);
      })(i);
    }
  }

  // on window resize - reset morph bg size
  var resizingId = false,
    customEventMorph = new CustomEvent("update-morphbg"),
    customEventHide = new CustomEvent("hide-morphbg");
  window.addEventListener("resize", function () {
    if (!resizingId) doneResizing(customEventHide);
    clearTimeout(resizingId);
    resizingId = setTimeout(function () {
      doneResizing(customEventMorph);
      resizingId = false;
    }, 100);
  });

  // wait for font to be loaded
  if (document.fonts) {
    document.fonts.onloadingdone = function (fontFaceSetEvent) {
      doneResizing(customEventMorph);
    };
    document.fonts.ready.then(function () {
      setTimeout(function () {
        doneResizing(customEventMorph);
      }, 300);
    });
  }
  function doneResizing(customEvent) {
    window.dispatchEvent(customEvent);
  }
})();

/* ------------------------ Watermark (Please Ignore) ----------------------- */
var createSVG = function createSVG(width, height, className, childType, childAttributes) {
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  var child = document.createElementNS("http://www.w3.org/2000/svg", childType);
  for (var attr in childAttributes) {
    child.setAttribute(attr, childAttributes[attr]);
  }
  svg.appendChild(child);
  return {
    svg: svg,
    child: child
  };
};
document.querySelectorAll(".generate-button").forEach(function (button) {
  var width = button.offsetWidth;
  var height = button.offsetHeight;
  var style = getComputedStyle(button);
  var strokeGroup = document.createElement("div");
  strokeGroup.classList.add("stroke");
  var _createSVG = createSVG(width, height, "stroke-line", "rect", {
      x: "0",
      y: "0",
      width: "100%",
      height: "100%",
      rx: parseInt(style.borderRadius, 10),
      ry: parseInt(style.borderRadius, 10),
      pathLength: "30"
    }),
    stroke = _createSVG.svg;
  strokeGroup.appendChild(stroke);
  button.appendChild(strokeGroup);
  var stars = gsap.to(button, {
    repeat: -1,
    repeatDelay: 0.5,
    paused: true,
    keyframes: [{
      "--generate-button-star-2-scale": ".5",
      "--generate-button-star-2-opacity": ".25",
      "--generate-button-star-3-scale": "1.25",
      "--generate-button-star-3-opacity": "1",
      duration: 0.3
    }, {
      "--generate-button-star-1-scale": "1.5",
      "--generate-button-star-1-opacity": ".5",
      "--generate-button-star-2-scale": ".5",
      "--generate-button-star-3-scale": "1",
      "--generate-button-star-3-opacity": ".5",
      duration: 0.3
    }, {
      "--generate-button-star-1-scale": "1",
      "--generate-button-star-1-opacity": ".25",
      "--generate-button-star-2-scale": "1.15",
      "--generate-button-star-2-opacity": "1",
      duration: 0.3
    }, {
      "--generate-button-star-2-scale": "1",
      duration: 0.35
    }]
  });
  button.addEventListener("pointerenter", function () {
    gsap.to(button, {
      "--generate-button-dots-opacity": "1",
      duration: 0.5,
      onStart: function onStart() {
        setTimeout(function () {
          return stars.restart().play();
        }, 500);
      }
    });
  });
  button.addEventListener("pointerleave", function () {
    gsap.to(button, {
      "--generate-button-dots-opacity": "0",
      "--generate-button-star-1-opacity": ".25",
      "--generate-button-star-1-scale": "1",
      "--generate-button-star-2-opacity": "1",
      "--generate-button-star-2-scale": "1",
      "--generate-button-star-3-opacity": ".5",
      "--generate-button-star-3-scale": "1",
      duration: 0.15,
      onComplete: function onComplete() {
        stars.pause();
      }
    });
  });
});
},{}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "44829" + '/');
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
      });

      // Enable HMR for CSS by default.
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
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
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
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","hover.js"], null)
//# sourceMappingURL=/hover.a868712f.js.map