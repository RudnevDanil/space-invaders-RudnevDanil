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
})({"src/sprite.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Sprite = function Sprite(img, x, y, w, h) {
  _classCallCheck(this, Sprite);

  this.img = img;
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
};

exports.default = Sprite;
},{}],"src/cannon.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Cannon = /*#__PURE__*/function () {
  function Cannon(x, y, sprite) {
    _classCallCheck(this, Cannon);

    this.x = x;
    this.y = y;
    this._sprite = sprite;
  }

  _createClass(Cannon, [{
    key: "draw",
    value: function draw(ctx, time) {
      ctx.drawImage(this._sprite.img, this._sprite.x, this._sprite.y, this._sprite.w, this._sprite.h, this.x, this.y, this._sprite.w, this._sprite.h);
    }
  }]);

  return Cannon;
}();

exports.default = Cannon;
},{}],"src/bunker.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Bunker = /*#__PURE__*/function () {
  function Bunker(x, y, sprite) {
    _classCallCheck(this, Bunker);

    this.x = x;
    this.y = y;
    this._sprite = sprite;
    this.w = sprite.w;
    this.h = sprite.h;
    this.mask = new Array(this.h);

    for (var i = 0; i < this.h; i++) {
      this.mask[i] = new Array(this.w);

      for (var j = 0; j < this.w; j++) {
        this.mask[i][j] = true;
      }
    }

    this.init = false;
  }

  _createClass(Bunker, [{
    key: "draw",
    value: function draw(ctx, time) {
      ctx.drawImage(this._sprite.img, this._sprite.x, this._sprite.y, this._sprite.w, this._sprite.h, this.x, this.y, this._sprite.w, this._sprite.h);
      var imgSize = this.w * this.h;

      if (!this.init) {
        var _myImage = ctx.getImageData(this.x, this.y, this.w, this.h);

        for (var i = 0; i < imgSize; i++) {
          _myImage.data[i * 4 + 0] = 0;
          indF = Math.floor(i / this.w);
          indS = i - this.w * indF;

          if (_myImage.data[i * 4 + 1] === 250) {
            this.mask[indF][indS] = true;
          } else {
            this.mask[indF][indS] = false;
          }
        }

        this.init = true;
        ctx.putImageData(_myImage, this.x, this.y);
      }

      var myImage = ctx.getImageData(this.x, this.y, this.w, this.h);
      var indF = 0;
      var indS = 0;

      for (var _i = 0; _i < imgSize; _i++) {
        indF = Math.floor(_i / this.w);
        indS = _i - this.w * indF;
        myImage.data[_i * 4 + 3] = this.mask[indF][indS] ? 255 : 0;
      }

      ctx.putImageData(myImage, this.x, this.y);
    }
  }, {
    key: "hasPoint",
    value: function hasPoint(x, y) {
      if (x >= this.x && x < this.x + this.w && y >= this.y && y < this.y + this.h && this.mask[y - this.y][x - this.x]) {
        this.destroyPoint(x, y);
        return true;
      }

      return false;
    }
  }, {
    key: "destroyPoint",
    value: function destroyPoint(x, y) {
      var firtsCoord = y - this.y;
      var secondCoord = x - this.x;
      this.mask[firtsCoord][secondCoord] = false;
      var isTop = firtsCoord > 0;
      var isBot = firtsCoord < this.h - 1;
      var isLeft = secondCoord > 0;
      var isRight = secondCoord < this.w - 1;

      if (isRight) {
        this.mask[firtsCoord][secondCoord + 1] = false;
      }

      if (isLeft) {
        this.mask[firtsCoord][secondCoord - 1] = false;
      }

      if (isTop) {
        {
          this.mask[firtsCoord - 1][secondCoord + 1] = false;
        }
        {
          this.mask[firtsCoord - 1][secondCoord] = false;
        }
        {
          this.mask[firtsCoord - 1][secondCoord - 1] = false;
        }
      }

      if (isBot) {
        {
          this.mask[firtsCoord + 1][secondCoord + 1] = false;
        }
        {
          this.mask[firtsCoord + 1][secondCoord] = false;
        }
        {
          this.mask[firtsCoord + 1][secondCoord - 1] = false;
        }
      }
    }
  }]);

  return Bunker;
}();

exports.default = Bunker;
},{}],"src/bullet.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Bullet = /*#__PURE__*/function () {
  function Bullet(x, y, vx, vy, w, h, color) {
    _classCallCheck(this, Bullet);

    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.w = w;
    this.h = h;
    this.color = color;
  }

  _createClass(Bullet, [{
    key: "update",
    value: function update(time) {
      // this.x = Math.floor(this.x + this.vx);
      //this.y = Math.floor(this.y + this.vy);
      this.x += this.vx;
      this.y += this.vy;
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.w, this.h);
    }
  }]);

  return Bullet;
}();

exports.default = Bullet;
},{}],"src/alien.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Alien = /*#__PURE__*/function () {
  function Alien(x, y, _ref, alienType) {
    var _ref2 = _slicedToArray(_ref, 2),
        spriteA = _ref2[0],
        spriteB = _ref2[1];

    _classCallCheck(this, Alien);

    this.x = x;
    this.y = y;
    this.isAlive = true;
    this._spriteA = spriteA;
    this._spriteB = spriteB;
    this.blinkTime = 1000;
    this.isInjured = false;
    this.alienType = alienType;
  }

  _createClass(Alien, [{
    key: "draw",
    value: function draw(ctx, time) {
      if (this.isAlive) {
        var sp = Math.ceil(time / this.blinkTime) % 2 === 0 ? this._spriteA : this._spriteB;
        ctx.drawImage(sp.img, sp.x, sp.y, sp.w, sp.h, this.x, this.y, sp.w, sp.h);
      }
    }
  }]);

  return Alien;
}();

exports.default = Alien;
},{}],"src/input-handler.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var InputHandler = /*#__PURE__*/function () {
  function InputHandler() {
    var _this = this;

    _classCallCheck(this, InputHandler);

    this.down = {};
    this.pressed = {};
    document.addEventListener("keydown", function (e) {
      _this.down[e.keyCode] = true;
    });
    document.addEventListener("keyup", function (e) {
      delete _this.down[e.keyCode];
      delete _this.pressed[e.keyCode];
    });
  }
  /**
   * Returns whether a key is pressod down
   * @param  {number} code the keycode to check
   * @return {bool} the result from check
   */


  _createClass(InputHandler, [{
    key: "isDown",
    value: function isDown(code) {
      return this.down[code];
    }
    /**
     * Return wheter a key has been pressed
     * @param  {number} code the keycode to check
     * @return {bool} the result from check
     */

  }, {
    key: "isPressed",
    value: function isPressed(code) {
      // if key is registred as pressed return false else if
      // key down for first time return true else return false
      if (this.pressed[code]) {
        return false;
      } else if (this.down[code]) {
        return this.pressed[code] = true;
      }

      return false;
    }
  }]);

  return InputHandler;
}();

exports.default = InputHandler;
},{}],"assets/invaders.png":[function(require,module,exports) {
module.exports = "/invaders.c61678f5.png";
},{}],"src/game.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.preload = preload;
exports.init = init;
exports.update = update;
exports.draw = draw;

var _sprite = _interopRequireDefault(require("./sprite"));

var _cannon = _interopRequireDefault(require("./cannon"));

var _bunker = _interopRequireDefault(require("./bunker"));

var _bullet = _interopRequireDefault(require("./bullet"));

var _alien = _interopRequireDefault(require("./alien"));

var _inputHandler = _interopRequireDefault(require("./input-handler"));

var _invaders = _interopRequireDefault(require("../assets/invaders.png"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var canvasForReplay;
var gs = {
  // game state. Dont change! It isn't a settings!
  seconds: {
    aShoot: 0
  },
  level: 1,
  score: 0,
  lives: 3333,
  goToNextLevel: false
};
var settings = {
  lineW: 6,
  // width of background line
  headerSize: 50,
  // top offset in background
  footerSize: 50,
  // bottom offset in background
  game: {
    nextLevelWait: 2000 // ms waiting time between levels

  },
  alien: {
    alienTypes: [2, 1, 0, 2, 1, 0],
    // types numbers in each line
    inOneLine: 11,
    // pcs // amount of alien in one line. It means amount rows
    shootTime: 1,
    // sec // each shootTime lower of aliens are shoot
    size: 33,
    // px // size of one alien
    shootProbability: 0.1,
    // probability of alien shooting
    BulletMult: 300,
    // amount steps like a speed
    injDist: 33,
    // distance from center of alien ot point C on line in detecting injuring
    killDist: 15,
    // distance from center of alien ot point C on line in detecting killing. < injDist
    collisionMaxStepPx: 1,
    // step on line while detecting collision. <= killDist. This parameter should be == 1 if bunkers intersect by masks
    aliveAfterKilling: 1500,
    // ms alive time when killing
    shootInterval: 200,
    // ms between few shootings
    makeNotInjuredTime: 2000,
    // ms how much time alien will be injured. Injured could shoot only one bullet per time
    blockMovingVx: 1,
    // moving step in x axis
    blockMovingVy: 1,
    // moving step in y axis
    blockMovingTime: 100 // ms between moving

  },
  cannon: {
    step: 4,
    // px // each tep of <- or -> move cannon on step px
    baseBulletSpeed: 8,
    bulletSpeedProbabilityRange: 0.2,
    killDist: 11,
    // distance from center of alien to point C on line in detecting killing. < injDist
    collisionMaxStepPx: 1 // step on line while detecting collision. <= killDist. This parameter should be == 1 if bunkers intersect by masks

  },
  bunker: {
    amount: 4,
    distanceFromCannon: 50
  }
};
var safeArea = {
  // will be set after
  l: 0,
  t: 0,
  r: 0,
  b: 0
};
var assets;
var sprites = {
  aliens: [],
  cannon: null,
  bunker: null
};
var objs = {
  bullets: [],
  aliens: [],
  bunkers: [],
  cannon: null
};
var inputHandler = new _inputHandler.default();

function preload(onPreloadComplete) {
  assets = new Image();
  assets.addEventListener("load", function () {
    sprites.cannon = new _sprite.default(assets, 62, 0, 22, 16);
    sprites.bunker = new _sprite.default(assets, 84, 8, 36, 24);
    sprites.aliens = [[new _sprite.default(assets, 0, 0, 22, 16), new _sprite.default(assets, 0, 16, 22, 16)], [new _sprite.default(assets, 22, 0, 16, 16), new _sprite.default(assets, 22, 16, 16, 16)], [new _sprite.default(assets, 38, 0, 24, 16), new _sprite.default(assets, 38, 16, 24, 16)]];
    onPreloadComplete();
  });
  assets.src = _invaders.default;
}

function init(canvas) {
  canvasForReplay = canvas;
  setAliens(gs.level);
  objs.cannon = new _cannon.default(100, canvas.height - settings.footerSize - sprites.cannon.h - Math.floor(settings.lineW / 2), sprites.cannon);

  for (var i = 0; i < settings.bunker.amount; i++) {
    objs.bunkers.push(new _bunker.default(100, canvas.height - settings.footerSize - sprites.bunker.h - Math.floor(settings.lineW / 2) - settings.bunker.distanceFromCannon, sprites.bunker));
  }

  gs.timer = setTimeout(timer_tictoc, 1000);
  setTimerMoving();
}

function setTimerMoving() {
  if (isAnyAliveAliens()) {
    moveAliens();
  }

  setTimeout(setTimerMoving, settings.alien.blockMovingTime);
}

function timer_tictoc() {
  gs.seconds.aShoot += 1;

  if (gs.seconds.aShoot === settings.alien.shootTime && gs.lives > 0) {
    aliensStartShoot();
    gs.seconds.aShoot = 0;
  }

  gs.timer = setTimeout(timer_tictoc, 1000);
}

function update(time) {
  if (gs.lives > 0) {
    // Left
    var potentialX = objs.cannon.x - settings.cannon.step;

    if (inputHandler.isDown(37) && potentialX >= safeArea.l) {
      objs.cannon.x = potentialX;
    } // Right


    potentialX = objs.cannon.x + settings.cannon.step;

    if (inputHandler.isDown(39) && potentialX + Math.floor(objs.cannon._sprite.w / 2) <= safeArea.r - safeArea.l) {
      objs.cannon.x = potentialX;
    } // Space


    if (inputHandler.isPressed(32)) {
      var bulletX = objs.cannon.x + Math.floor(objs.cannon._sprite.h / 2);
      var bulletY = objs.cannon.y;
      var bulletVy = -1 * settings.cannon.baseBulletSpeed * (1 - settings.cannon.bulletSpeedProbabilityRange + Math.random() * settings.cannon.bulletSpeedProbabilityRange * 2);
      objs.bullets.push(new _bullet.default(bulletX, bulletY, 0, bulletVy, 4, 8, "green"));
    }

    objs.bullets.forEach(function (b) {
      return b.update(time);
    });
    checkBulletIntersection();
    checkAreBulletsInSafeArea();

    if (!isAnyAliveAliens()) {
      goToNextLevel();
    }
  } else if (inputHandler.isPressed(32)) {
    // replay
    objs.cannon = null;
    objs.bullets = [];
    objs.aliens = [];
    objs.bunkers = [];
    gs.lives = 3;
    gs.score = 0;
    gs.level = 1;
    gs.seconds.aShoot = 0;
    init(canvasForReplay);
  }
}

function isAnyAliveAliens() {
  for (var i = 0; i < objs.aliens.length; i++) {
    if (objs.aliens[i].isAlive) {
      return true;
    }
  }

  return false;
}

function moveAliens() {
  if (gs.lives > 0 && gs.goToNextLevel == false) {
    // Y axis
    settings.alien.blockMovingVy *= Math.random() < 0.1 ? -1 : 1;

    if (settings.alien.blockMovingVy > 0) {
      // check if bottom of block will not touch top of bunkers
      var touch = false; // first let's find bottom alive alien

      var founded = false;
      var bottom = -1;

      for (var i = settings.alien.alienTypes.length - 1; i >= 0 && !founded; i--) {
        for (var j = 0; j < settings.alien.inOneLine; j++) {
          if (objs.aliens[i * settings.alien.inOneLine + j].isAlive) {
            founded = true;
            bottom = objs.aliens[i * settings.alien.inOneLine + j].y + settings.alien.size;
          }
        }
      }

      if (!founded) {
        return;
      }

      touch = bottom + settings.alien.blockMovingVy + 0.5 >= objs.bunkers[0].y;
      settings.alien.blockMovingVy = (touch ? -1 : 1) * Math.abs(settings.alien.blockMovingVy);
    } else {
      // check if top of block will not touch top of safe area
      var _touch = false; // first let's find top alive alien

      var _founded = false;
      var top = -1;

      for (var _i = 0; _i < settings.alien.alienTypes.length && !_founded; _i++) {
        for (var _j = 0; _j < settings.alien.inOneLine; _j++) {
          if (objs.aliens[_i * settings.alien.inOneLine + _j].isAlive) {
            _founded = true;
            top = objs.aliens[_i * settings.alien.inOneLine + _j].y;
          }
        }
      }

      if (!_founded) {
        return;
      }

      _touch = top + settings.alien.blockMovingVy - 0.5 < safeArea.t;
      settings.alien.blockMovingVy = _touch ? Math.abs(settings.alien.blockMovingVy) : settings.alien.blockMovingVy;
    }

    objs.aliens.forEach(function (a) {
      return a.y += settings.alien.blockMovingVy;
    }); // X axis
    //settings.alien.blockMovingVx *= (Math.random() < 0.05)? -1: 1

    if (settings.alien.blockMovingVx > 0) {
      // check if bottom of block will not touch top of bunkers
      var _touch2 = false; // first let's find right alive alien

      var _founded2 = false;
      var right = -1;

      for (var _j2 = settings.alien.inOneLine - 1; _j2 >= 0; _j2--) {
        for (var _i2 = 0; _i2 < settings.alien.alienTypes.length && !_founded2; _i2++) {
          if (objs.aliens[_i2 * settings.alien.inOneLine + _j2].isAlive) {
            _founded2 = true;
            right = objs.aliens[_i2 * settings.alien.inOneLine + _j2].x + settings.alien.size;
          }
        }
      }

      if (!_founded2) {
        return;
      }

      _touch2 = right + settings.alien.blockMovingVx + 5 >= safeArea.r;
      settings.alien.blockMovingVx = _touch2 ? -1 * Math.abs(settings.alien.blockMovingVx) : settings.alien.blockMovingVx;
    } else {
      // check if top of block will not touch top of safe area
      var _touch3 = false; // first let's find left alive alien

      var _founded3 = false;
      var left = -1;

      for (var _j3 = 0; _j3 <= settings.alien.inOneLine; _j3++) {
        for (var _i3 = 0; _i3 < settings.alien.alienTypes.length && !_founded3; _i3++) {
          if (objs.aliens[_i3 * settings.alien.inOneLine + _j3].isAlive) {
            _founded3 = true;
            left = objs.aliens[_i3 * settings.alien.inOneLine + _j3].x;
          }
        }
      }

      if (!_founded3) {
        return;
      }

      _touch3 = left + settings.alien.blockMovingVx - 5 < safeArea.l;
      settings.alien.blockMovingVx = _touch3 ? Math.abs(settings.alien.blockMovingVx) : settings.alien.blockMovingVx;
    }

    objs.aliens.forEach(function (a) {
      return a.x += settings.alien.blockMovingVx;
    });
  }
}

function setAliens(lvl) {
  if (lvl === 1) {
    settings.alien.alienTypes = [2, 1, 0, 2, 1, 0]; // types numbers in each line

    settings.alien.inOneLine = 11; // pcs // amount of alien in one line. It means amount rows

    settings.alien.shootProbability = 0.1;
    settings.alien.blockMovingTime = 100;
  } else if (lvl === 2) {
    settings.alien.alienTypes = [2, 1, 2, 1]; // types numbers in each line

    settings.alien.inOneLine = 5; // pcs // amount of alien in one line. It means amount rows

    settings.alien.shootProbability = 0.5;
    settings.alien.blockMovingTime = 70;
  } else {
    settings.alien.alienTypes = [2, 1, 0]; // types numbers in each line

    settings.alien.inOneLine = 5; // pcs // amount of alien in one line. It means amount rows

    settings.alien.shootProbability = 0.75;
    settings.alien.blockMovingTime = 50;
  }

  objs.aliens = [];

  for (var i = 0, len = settings.alien.alienTypes.length; i < len; i++) {
    var alienType = settings.alien.alienTypes[i];

    for (var j = 0; j < settings.alien.inOneLine; j++) {
      var alienX = settings.alien.size * (j + 1);
      var alienY = settings.alien.size * (i + 1) + settings.headerSize;
      objs.aliens.push(new _alien.default(alienX, alienY, sprites.aliens[alienType], alienType));
    }
  }
}

function goToNextLevel() {
  if (gs.goToNextLevel === false) {
    stopGame();
    gs.goToNextLevel = true;
    setTimeout(startNextLevel, settings.game.nextLevelWait);
  }
}

function startNextLevel() {
  gs.goToNextLevel = false;
  objs.aliens = [];
  objs.bullets = [];
  gs.level += 1;
  setAliens(gs.level);
}

function checkAreBulletsInSafeArea() {
  for (var i = 0; i < objs.bullets.length; i++) {
    if (objs.bullets[i].x < safeArea.l || objs.bullets[i].x > safeArea.r || objs.bullets[i].y < safeArea.t || objs.bullets[i].y > safeArea.b + safeArea.t) {
      objs.bullets.splice(i, 1);
    }
  }
}

function checkBulletIntersection() {
  for (var i = 0; i < objs.bullets.length; i++) {
    if (objs.bullets[i].color === "white") {
      checkCannonOnLine(objs.bullets[i].x, objs.bullets[i].y, objs.bullets[i].x - objs.bullets[i].vx, objs.bullets[i].y - objs.bullets[i].vy, i);
    } else if (objs.bullets[i].color === "green") {
      checkAlienOnLine(objs.bullets[i].x, objs.bullets[i].y, objs.bullets[i].x - objs.bullets[i].vx, objs.bullets[i].y - objs.bullets[i].vy, i);
    }
  }
}

function checkAlienOnLine(ax, ay, bx, by, indBullet) {
  var vxFull = ax - bx;
  var vyFull = ay - by;
  var steps = Math.floor(Math.max(Math.abs(vxFull), Math.abs(vyFull)) / settings.alien.collisionMaxStepPx); // check for boxes between a and b

  var xStep = 0;
  var yStep = 0;
  var stepCounter = 1; // not 0 because we don't need to check point b

  var killed = false;
  var toPointA = false;
  var c = {
    x: bx,
    y: by
  };

  if (steps !== 0) {
    xStep = vxFull / steps;
    yStep = vyFull / steps;
    c.x += xStep;
    c.y += yStep;
  } else {
    stepCounter = steps + 1;
    toPointA = true;
    c.x = ax;
    c.y = ay;
  }

  while ((stepCounter <= steps || toPointA) && !killed) {
    for (var i = 0; i < objs.aliens.length; i++) {
      if (objs.aliens[i].isAlive) {
        var xDist = Math.abs(c.x - (objs.aliens[i].x + settings.alien.size / 2));

        if (xDist <= settings.alien.injDist / 2) {
          var yDist = Math.abs(c.y - (objs.aliens[i].y + settings.alien.size / 2));

          if (yDist <= settings.alien.injDist / 2) {
            injureAlien(i);

            if (xDist <= settings.alien.killDist / 2 && yDist <= settings.alien.killDist / 2) {
              killAlien(i);
              killed = true; // destroyBullet

              objs.bullets.splice(indBullet, 1);
            }
          }
        }
      }
    } // check is here bunker


    for (var _i4 = 0; _i4 < objs.bunkers.length && !killed; _i4++) {
      if (objs.bunkers[_i4].hasPoint(Math.floor(c.x), Math.floor(c.y))) {
        objs.bullets.splice(indBullet, 1);
        killed = true;
      }
    }

    if (toPointA) {
      toPointA = false;
    } else if (steps !== 0) {
      c.x += xStep;
      c.y += yStep;
      stepCounter += 1;

      if (stepCounter > steps) {
        toPointA = true;
        c.x = ax;
        c.y = ay;
      }
    }
  }
}

function injureAlien(index) {
  if (!objs.aliens[index].isInjured) {
    objs.aliens[index].blinkTime = 350;
    objs.aliens[index].isInjured = true;
  }

  setTimeout(makeNotInjured, settings.alien.makeNotInjuredTime, index);
}

function makeNotInjured(index) {
  objs.aliens[index].blinkTime = 1000;
  objs.aliens[index].isInjured = false;
}

function killAlien(index) {
  if (objs.aliens[index].blinkTime !== 100) {
    gs.score += gs.level;
    objs.aliens[index].blinkTime = 100;
    setTimeout(makeAlienIsNotAlive, settings.alien.aliveAfterKilling, index);
  }
}

function makeAlienIsNotAlive(index) {
  objs.aliens[index].isAlive = false;
}

function checkCannonOnLine(ax, ay, bx, by, indBullet) {
  var vxFull = ax - bx;
  var vyFull = ay - by;
  var steps = Math.floor(Math.max(Math.abs(vxFull), Math.abs(vyFull)) / settings.cannon.collisionMaxStepPx); // check for boxes between a and b

  var xStep = 0;
  var yStep = 0;
  var stepCounter = 1; // not 0 because we don't need to check point b

  var killed = false;
  var toPointA = false;
  var c = {
    x: bx,
    y: by
  };

  if (steps !== 0) {
    xStep = vxFull / steps;
    yStep = vyFull / steps;
    c.x += xStep;
    c.y += yStep;
  } else {
    stepCounter = steps + 1;
    toPointA = true;
    c.x = ax;
    c.y = ay;
  }

  while ((stepCounter <= steps || toPointA) && !killed) {
    var yDist = Math.abs(c.y - (objs.cannon.y + objs.cannon._sprite.h / 2));

    if (yDist <= settings.cannon.killDist / 2) {
      var xDist = Math.abs(c.x - (objs.cannon.x + objs.cannon._sprite.w / 2));

      if (xDist <= settings.cannon.killDist / 2) {
        killCannon();
        killed = true; // destroyBullet

        objs.bullets.splice(indBullet, 1);
      }
    } // check is here bunker


    for (var i = 0; i < objs.bunkers.length && !killed; i++) {
      if (objs.bunkers[i].hasPoint(Math.floor(c.x), Math.floor(c.y))) {
        objs.bullets.splice(indBullet, 1);
        killed = true;
      }
    }

    if (toPointA) {
      toPointA = false;
    } else if (steps !== 0) {
      c.x += xStep;
      c.y += yStep;
      stepCounter += 1;

      if (stepCounter > steps) {
        toPointA = true;
        c.x = ax;
        c.y = ay;
      }
    }
  }
}

function killCannon() {
  gs.lives -= 1;

  if (gs.lives <= 0) {
    stopGame();
  }
}

function stopGame() {
  objs.bullets.forEach(function (b) {
    b.vx = 0;
    b.vy = 0;
  });
  objs.aliens.forEach(function (a) {
    a.vx = 0;
    a.vy = 0;
  });
  objs.cannon.vx = 0;
  objs.cannon.vy = 0;
}

function showSafeAreaZone(ctx) // debug
{
  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.strokeStyle = "red";
  ctx.strokeRect(safeArea.l, safeArea.t, safeArea.r, safeArea.b);
  ctx.closePath();
}

function drawBackground(ctx, w, h) {
  // border
  ctx.beginPath();
  var halfLineW = Math.floor(settings.lineW / 2);
  ctx.lineWidth = settings.lineW;
  ctx.strokeStyle = "green";
  ctx.strokeRect(halfLineW, halfLineW, w - settings.lineW, h - settings.lineW);
  ctx.strokeRect(halfLineW, settings.headerSize, w, h - settings.footerSize - settings.headerSize);
  ctx.closePath();
  safeArea.l = settings.lineW;
  safeArea.t = Math.floor(settings.lineW / 2) + settings.headerSize;
  safeArea.r = w - 2 * settings.lineW;
  safeArea.b = h - settings.footerSize - settings.headerSize - settings.lineW; // locate bunkers

  for (var i = 1; i <= objs.bunkers.length; i++) {
    objs.bunkers[i - 1].x = i * Math.floor(safeArea.r / (settings.bunker.amount + 1));
  }

  showSafeAreaZone(ctx); // debug
  // text settings

  ctx.font = "30px Verdana";
  ctx.fillStyle = "green";
  ctx.textAlign = "center";
  ctx.lineWidth = 2;
  ctx.textBaseline = "middle"; // header

  ctx.fillText("LEVEL: " + gs.level, Math.floor(w * 0.2), Math.floor((settings.headerSize + settings.lineW) / 2)); //ctx.fillText("TextC", Math.floor(w * 0.5), Math.floor((settings.headerSize + settings.lineW) / 2));

  ctx.fillText("SCORE: " + gs.score, Math.floor(w * 0.8), Math.floor((settings.headerSize + settings.lineW) / 2)); // footer

  var lives = "";

  for (var _i5 = 0; _i5 < gs.lives; _i5++) {
    lives += "❤ ";
  }

  ctx.textAlign = "left";
  ctx.fillText("LIVES: " + lives, Math.floor(w * 0.1), Math.floor(h - (settings.headerSize + settings.lineW) / 2));
}

function drawGameOver(ctx, w, h) {
  var sqrWPart = Math.floor(w / 10);
  var sqrHPart = Math.floor(h / 10);
  ctx.clearRect(sqrWPart * 3, sqrHPart * 3, sqrWPart * 4, sqrHPart * 4);
  ctx.beginPath();
  ctx.lineWidth = settings.lineW;
  ctx.strokeStyle = "green";
  ctx.strokeRect(sqrWPart * 3, sqrHPart * 3, sqrWPart * 4, sqrHPart * 3);
  ctx.closePath();
  ctx.textBaseline = "top";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER", w / 2, sqrHPart * 3 + settings.lineW + 80);
  ctx.font = "15px Verdana";
  ctx.fillText("tap space to replay", w / 2, sqrHPart * 3 + settings.lineW + 80 * 2);
}

function drawNextLevel(ctx, w, h) {
  var sqrWPart = Math.floor(w / 10);
  var sqrHPart = Math.floor(h / 10);
  ctx.clearRect(sqrWPart * 3, sqrHPart * 3, sqrWPart * 4, sqrHPart * 4);
  ctx.beginPath();
  ctx.lineWidth = settings.lineW;
  ctx.strokeStyle = "green";
  ctx.strokeRect(sqrWPart * 3, sqrHPart * 3, sqrWPart * 4, sqrHPart * 3);
  ctx.closePath();
  ctx.font = "30px Verdana";
  ctx.textBaseline = "top";
  ctx.textAlign = "center";
  ctx.strokeStyle = "white";
  ctx.fillText("NEXT LEVEL", w / 2, sqrHPart * 3 + settings.lineW + 80);
  ctx.font = "15px Verdana";
  ctx.fillText("you are not bad", w / 2, sqrHPart * 3 + settings.lineW + 80 * 2);
}

function draw(canvas, time) {
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground(ctx, canvas.width, canvas.height);
  objs.aliens.forEach(function (a) {
    return a.draw(ctx, time);
  });
  objs.cannon.draw(ctx);
  objs.bullets.forEach(function (b) {
    return b.draw(ctx);
  });
  objs.bunkers.forEach(function (b) {
    return b.draw(ctx);
  });

  if (gs.lives <= 0) {
    drawGameOver(ctx, canvas.width, canvas.height);
  }

  if (gs.goToNextLevel) {
    drawNextLevel(ctx, canvas.width, canvas.height);
  }
}

function aliensStartShoot() {
  var maxI = settings.alien.alienTypes.length;
  var maxJ = settings.alien.inOneLine;

  for (var j = 0; j < maxJ; j++) {
    for (var i = maxI - 1; i >= 0; i--) {
      if (objs.aliens[maxJ * i + j].isAlive) {
        if (Math.random() < settings.alien.shootProbability) {
          var timeout = Math.floor(Math.random() * settings.alien.shootTime * 1000);
          setTimeout(alienMakeShoot, timeout, maxJ * i + j);

          if (!objs.aliens[maxJ * i + j].isInjured) {
            for (var k = 1; k <= objs.aliens[maxJ * i + j].alienType; k++) {
              setTimeout(alienMakeShoot, timeout + k * settings.alien.shootInterval, maxJ * i + j);
            }
          }
        }

        i = -1;
      }
    }
  }
}

function alienMakeShoot(ind) {
  if (objs.aliens[ind].y < objs.cannon.y) {
    var bulletX = objs.aliens[ind].x + settings.alien.size / 2;
    var bulletY = objs.aliens[ind].y + settings.alien.size / 2;
    var bulletVx = (objs.cannon.x + objs.cannon._sprite.w / 2 - bulletX) / settings.alien.BulletMult;
    var bulletVy = (objs.cannon.y + objs.cannon._sprite.h / 2 - bulletY) / settings.alien.BulletMult;
    objs.bullets.push(new _bullet.default(bulletX, bulletY, bulletVx, bulletVy, 4, 8, "white"));
  }
}
},{"./sprite":"src/sprite.js","./cannon":"src/cannon.js","./bunker":"src/bunker.js","./bullet":"src/bullet.js","./alien":"src/alien.js","./input-handler":"src/input-handler.js","../assets/invaders.png":"assets/invaders.png"}],"src/index.js":[function(require,module,exports) {
"use strict";

var _game = require("./game");

var canvas = document.getElementById("cnvs");
canvas.width = 600;
canvas.height = window.innerHeight;
var tickLength = 15; //ms

var lastTick;
var lastRender;
var stopCycle;

function run(tFrame) {
  stopCycle = window.requestAnimationFrame(run);
  var nextTick = lastTick + tickLength;
  var numTicks = 0;

  if (tFrame > nextTick) {
    var timeSinceTick = tFrame - lastTick;
    numTicks = Math.floor(timeSinceTick / tickLength);
  }

  for (var i = 0; i < numTicks; i++) {
    lastTick = lastTick + tickLength;
    (0, _game.update)(lastTick);
  }

  (0, _game.draw)(canvas, tFrame);
  lastRender = tFrame;
}

function stopGame() {
  window.cancelAnimationFrame(stopCycle);
}

function onPreloadComplete() {
  lastTick = performance.now();
  lastRender = lastTick;
  stopCycle = null;
  (0, _game.init)(canvas);
  run();
}

(0, _game.preload)(onPreloadComplete);
},{"./game":"src/game.js"}],"node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "3993" + '/');

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
},{}]},{},["node_modules/parcel/src/builtins/hmr-runtime.js","src/index.js"], null)
//# sourceMappingURL=/src.a2b27638.js.map