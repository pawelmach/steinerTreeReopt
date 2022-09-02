(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

/**
 * Expose `Emitter`.
 */

exports.Emitter = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
}

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }

  // Remove event specific arrays for event types that no
  // one is subscribed for to avoid memory leak.
  if (callbacks.length === 0) {
    delete this._callbacks['$' + event];
  }

  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};

  var args = new Array(arguments.length - 1)
    , callbacks = this._callbacks['$' + event];

  for (var i = 1; i < arguments.length; i++) {
    args[i - 1] = arguments[i];
  }

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

// alias used for reserved events (protected method)
Emitter.prototype.emitReserved = Emitter.prototype.emit;

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{}],2:[function(require,module,exports){
/**
 * Extend function
 * ================
 *
 * Function used to push a bunch of values into an array at once.
 *
 * Its strategy is to mutate target array's length then setting the new indices
 * to be the values to add.
 *
 * A benchmark proved that it is faster than the following strategies:
 *   1) `array.push.apply(array, values)`.
 *   2) A loop of pushes.
 *   3) `array = array.concat(values)`, obviously.
 *
 * Intuitively, this is correct because when adding a lot of elements, the
 * chosen strategies does not need to handle the `arguments` object to
 * execute #.apply's variadicity and because the array know its final length
 * at the beginning, avoiding potential multiple reallocations of the underlying
 * contiguous array. Some engines may be able to optimize the loop of push
 * operations but empirically they don't seem to do so.
 */

/**
 * Extends the target array with the given values.
 *
 * @param  {array} array  - Target array.
 * @param  {array} values - Values to add.
 */
module.exports = function extend(array, values) {
  var l2 = values.length;

  if (l2 === 0)
    return;

  var l1 = array.length;

  array.length += l2;

  for (var i = 0; i < l2; i++)
    array[l1 + i] = values[i];
};

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasCORS = void 0;
// imported from https://github.com/component/has-cors
let value = false;
try {
    value = typeof XMLHttpRequest !== 'undefined' &&
        'withCredentials' in new XMLHttpRequest();
}
catch (err) {
    // if XMLHttp support is disabled in IE then it will throw
    // when trying to create
}
exports.hasCORS = value;

},{}],4:[function(require,module,exports){
"use strict";
// imported from https://github.com/galkn/querystring
/**
 * Compiles a querystring
 * Returns string representation of the object
 *
 * @param {Object}
 * @api private
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.decode = exports.encode = void 0;
function encode(obj) {
    let str = '';
    for (let i in obj) {
        if (obj.hasOwnProperty(i)) {
            if (str.length)
                str += '&';
            str += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]);
        }
    }
    return str;
}
exports.encode = encode;
/**
 * Parses a simple querystring into an object
 *
 * @param {String} qs
 * @api private
 */
function decode(qs) {
    let qry = {};
    let pairs = qs.split('&');
    for (let i = 0, l = pairs.length; i < l; i++) {
        let pair = pairs[i].split('=');
        qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
    }
    return qry;
}
exports.decode = decode;

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
// imported from https://github.com/galkn/parseuri
/**
 * Parses an URI
 *
 * @author Steven Levithan <stevenlevithan.com> (MIT license)
 * @api private
 */
const re = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;
const parts = [
    'source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'
];
function parse(str) {
    const src = str, b = str.indexOf('['), e = str.indexOf(']');
    if (b != -1 && e != -1) {
        str = str.substring(0, b) + str.substring(b, e).replace(/:/g, ';') + str.substring(e, str.length);
    }
    let m = re.exec(str || ''), uri = {}, i = 14;
    while (i--) {
        uri[parts[i]] = m[i] || '';
    }
    if (b != -1 && e != -1) {
        uri.source = src;
        uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ':');
        uri.authority = uri.authority.replace('[', '').replace(']', '').replace(/;/g, ':');
        uri.ipv6uri = true;
    }
    uri.pathNames = pathNames(uri, uri['path']);
    uri.queryKey = queryKey(uri, uri['query']);
    return uri;
}
exports.parse = parse;
function pathNames(obj, path) {
    const regx = /\/{2,9}/g, names = path.replace(regx, "/").split("/");
    if (path.substr(0, 1) == '/' || path.length === 0) {
        names.splice(0, 1);
    }
    if (path.substr(path.length - 1, 1) == '/') {
        names.splice(names.length - 1, 1);
    }
    return names;
}
function queryKey(uri, query) {
    const data = {};
    query.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function ($0, $1, $2) {
        if ($1) {
            data[$1] = $2;
        }
    });
    return data;
}

},{}],6:[function(require,module,exports){
// imported from https://github.com/unshiftio/yeast
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.yeast = exports.decode = exports.encode = void 0;
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'.split(''), length = 64, map = {};
let seed = 0, i = 0, prev;
/**
 * Return a string representing the specified number.
 *
 * @param {Number} num The number to convert.
 * @returns {String} The string representation of the number.
 * @api public
 */
function encode(num) {
    let encoded = '';
    do {
        encoded = alphabet[num % length] + encoded;
        num = Math.floor(num / length);
    } while (num > 0);
    return encoded;
}
exports.encode = encode;
/**
 * Return the integer value specified by the given string.
 *
 * @param {String} str The string to convert.
 * @returns {Number} The integer value represented by the string.
 * @api public
 */
function decode(str) {
    let decoded = 0;
    for (i = 0; i < str.length; i++) {
        decoded = decoded * length + map[str.charAt(i)];
    }
    return decoded;
}
exports.decode = decode;
/**
 * Yeast: A tiny growing id generator.
 *
 * @returns {String} A unique id.
 * @api public
 */
function yeast() {
    const now = encode(+new Date());
    if (now !== prev)
        return seed = 0, prev = now;
    return now + '.' + encode(seed++);
}
exports.yeast = yeast;
//
// Map each character to its index.
//
for (; i < length; i++)
    map[alphabet[i]] = i;

},{}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalThisShim = void 0;
exports.globalThisShim = (() => {
    if (typeof self !== "undefined") {
        return self;
    }
    else if (typeof window !== "undefined") {
        return window;
    }
    else {
        return Function("return this")();
    }
})();

},{}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = exports.installTimerFunctions = exports.transports = exports.Transport = exports.protocol = exports.Socket = void 0;
const socket_js_1 = require("./socket.js");
Object.defineProperty(exports, "Socket", { enumerable: true, get: function () { return socket_js_1.Socket; } });
exports.protocol = socket_js_1.Socket.protocol;
var transport_js_1 = require("./transport.js");
Object.defineProperty(exports, "Transport", { enumerable: true, get: function () { return transport_js_1.Transport; } });
var index_js_1 = require("./transports/index.js");
Object.defineProperty(exports, "transports", { enumerable: true, get: function () { return index_js_1.transports; } });
var util_js_1 = require("./util.js");
Object.defineProperty(exports, "installTimerFunctions", { enumerable: true, get: function () { return util_js_1.installTimerFunctions; } });
var parseuri_js_1 = require("./contrib/parseuri.js");
Object.defineProperty(exports, "parse", { enumerable: true, get: function () { return parseuri_js_1.parse; } });

},{"./contrib/parseuri.js":5,"./socket.js":9,"./transport.js":10,"./transports/index.js":11,"./util.js":16}],9:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Socket = void 0;
const index_js_1 = require("./transports/index.js");
const util_js_1 = require("./util.js");
const parseqs_js_1 = require("./contrib/parseqs.js");
const parseuri_js_1 = require("./contrib/parseuri.js");
const debug_1 = __importDefault(require("debug")); // debug()
const component_emitter_1 = require("@socket.io/component-emitter");
const engine_io_parser_1 = require("engine.io-parser");
const debug = (0, debug_1.default)("engine.io-client:socket"); // debug()
class Socket extends component_emitter_1.Emitter {
    /**
     * Socket constructor.
     *
     * @param {String|Object} uri or options
     * @param {Object} opts - options
     * @api public
     */
    constructor(uri, opts = {}) {
        super();
        if (uri && "object" === typeof uri) {
            opts = uri;
            uri = null;
        }
        if (uri) {
            uri = (0, parseuri_js_1.parse)(uri);
            opts.hostname = uri.host;
            opts.secure = uri.protocol === "https" || uri.protocol === "wss";
            opts.port = uri.port;
            if (uri.query)
                opts.query = uri.query;
        }
        else if (opts.host) {
            opts.hostname = (0, parseuri_js_1.parse)(opts.host).host;
        }
        (0, util_js_1.installTimerFunctions)(this, opts);
        this.secure =
            null != opts.secure
                ? opts.secure
                : typeof location !== "undefined" && "https:" === location.protocol;
        if (opts.hostname && !opts.port) {
            // if no port is specified manually, use the protocol default
            opts.port = this.secure ? "443" : "80";
        }
        this.hostname =
            opts.hostname ||
                (typeof location !== "undefined" ? location.hostname : "localhost");
        this.port =
            opts.port ||
                (typeof location !== "undefined" && location.port
                    ? location.port
                    : this.secure
                        ? "443"
                        : "80");
        this.transports = opts.transports || ["polling", "websocket"];
        this.readyState = "";
        this.writeBuffer = [];
        this.prevBufferLen = 0;
        this.opts = Object.assign({
            path: "/engine.io",
            agent: false,
            withCredentials: false,
            upgrade: true,
            timestampParam: "t",
            rememberUpgrade: false,
            rejectUnauthorized: true,
            perMessageDeflate: {
                threshold: 1024
            },
            transportOptions: {},
            closeOnBeforeunload: true
        }, opts);
        this.opts.path = this.opts.path.replace(/\/$/, "") + "/";
        if (typeof this.opts.query === "string") {
            this.opts.query = (0, parseqs_js_1.decode)(this.opts.query);
        }
        // set on handshake
        this.id = null;
        this.upgrades = null;
        this.pingInterval = null;
        this.pingTimeout = null;
        // set on heartbeat
        this.pingTimeoutTimer = null;
        if (typeof addEventListener === "function") {
            if (this.opts.closeOnBeforeunload) {
                // Firefox closes the connection when the "beforeunload" event is emitted but not Chrome. This event listener
                // ensures every browser behaves the same (no "disconnect" event at the Socket.IO level when the page is
                // closed/reloaded)
                addEventListener("beforeunload", () => {
                    if (this.transport) {
                        // silently close the transport
                        this.transport.removeAllListeners();
                        this.transport.close();
                    }
                }, false);
            }
            if (this.hostname !== "localhost") {
                this.offlineEventListener = () => {
                    this.onClose("transport close", {
                        description: "network connection lost"
                    });
                };
                addEventListener("offline", this.offlineEventListener, false);
            }
        }
        this.open();
    }
    /**
     * Creates transport of the given type.
     *
     * @param {String} transport name
     * @return {Transport}
     * @api private
     */
    createTransport(name) {
        debug('creating transport "%s"', name);
        const query = Object.assign({}, this.opts.query);
        // append engine.io protocol identifier
        query.EIO = engine_io_parser_1.protocol;
        // transport name
        query.transport = name;
        // session id if we already have one
        if (this.id)
            query.sid = this.id;
        const opts = Object.assign({}, this.opts.transportOptions[name], this.opts, {
            query,
            socket: this,
            hostname: this.hostname,
            secure: this.secure,
            port: this.port
        });
        debug("options: %j", opts);
        return new index_js_1.transports[name](opts);
    }
    /**
     * Initializes transport to use and starts probe.
     *
     * @api private
     */
    open() {
        let transport;
        if (this.opts.rememberUpgrade &&
            Socket.priorWebsocketSuccess &&
            this.transports.indexOf("websocket") !== -1) {
            transport = "websocket";
        }
        else if (0 === this.transports.length) {
            // Emit error on next tick so it can be listened to
            this.setTimeoutFn(() => {
                this.emitReserved("error", "No transports available");
            }, 0);
            return;
        }
        else {
            transport = this.transports[0];
        }
        this.readyState = "opening";
        // Retry with the next transport if the transport is disabled (jsonp: false)
        try {
            transport = this.createTransport(transport);
        }
        catch (e) {
            debug("error while creating transport: %s", e);
            this.transports.shift();
            this.open();
            return;
        }
        transport.open();
        this.setTransport(transport);
    }
    /**
     * Sets the current transport. Disables the existing one (if any).
     *
     * @api private
     */
    setTransport(transport) {
        debug("setting transport %s", transport.name);
        if (this.transport) {
            debug("clearing existing transport %s", this.transport.name);
            this.transport.removeAllListeners();
        }
        // set up transport
        this.transport = transport;
        // set up transport listeners
        transport
            .on("drain", this.onDrain.bind(this))
            .on("packet", this.onPacket.bind(this))
            .on("error", this.onError.bind(this))
            .on("close", reason => this.onClose("transport close", reason));
    }
    /**
     * Probes a transport.
     *
     * @param {String} transport name
     * @api private
     */
    probe(name) {
        debug('probing transport "%s"', name);
        let transport = this.createTransport(name);
        let failed = false;
        Socket.priorWebsocketSuccess = false;
        const onTransportOpen = () => {
            if (failed)
                return;
            debug('probe transport "%s" opened', name);
            transport.send([{ type: "ping", data: "probe" }]);
            transport.once("packet", msg => {
                if (failed)
                    return;
                if ("pong" === msg.type && "probe" === msg.data) {
                    debug('probe transport "%s" pong', name);
                    this.upgrading = true;
                    this.emitReserved("upgrading", transport);
                    if (!transport)
                        return;
                    Socket.priorWebsocketSuccess = "websocket" === transport.name;
                    debug('pausing current transport "%s"', this.transport.name);
                    this.transport.pause(() => {
                        if (failed)
                            return;
                        if ("closed" === this.readyState)
                            return;
                        debug("changing transport and sending upgrade packet");
                        cleanup();
                        this.setTransport(transport);
                        transport.send([{ type: "upgrade" }]);
                        this.emitReserved("upgrade", transport);
                        transport = null;
                        this.upgrading = false;
                        this.flush();
                    });
                }
                else {
                    debug('probe transport "%s" failed', name);
                    const err = new Error("probe error");
                    // @ts-ignore
                    err.transport = transport.name;
                    this.emitReserved("upgradeError", err);
                }
            });
        };
        function freezeTransport() {
            if (failed)
                return;
            // Any callback called by transport should be ignored since now
            failed = true;
            cleanup();
            transport.close();
            transport = null;
        }
        // Handle any error that happens while probing
        const onerror = err => {
            const error = new Error("probe error: " + err);
            // @ts-ignore
            error.transport = transport.name;
            freezeTransport();
            debug('probe transport "%s" failed because of error: %s', name, err);
            this.emitReserved("upgradeError", error);
        };
        function onTransportClose() {
            onerror("transport closed");
        }
        // When the socket is closed while we're probing
        function onclose() {
            onerror("socket closed");
        }
        // When the socket is upgraded while we're probing
        function onupgrade(to) {
            if (transport && to.name !== transport.name) {
                debug('"%s" works - aborting "%s"', to.name, transport.name);
                freezeTransport();
            }
        }
        // Remove all listeners on the transport and on self
        const cleanup = () => {
            transport.removeListener("open", onTransportOpen);
            transport.removeListener("error", onerror);
            transport.removeListener("close", onTransportClose);
            this.off("close", onclose);
            this.off("upgrading", onupgrade);
        };
        transport.once("open", onTransportOpen);
        transport.once("error", onerror);
        transport.once("close", onTransportClose);
        this.once("close", onclose);
        this.once("upgrading", onupgrade);
        transport.open();
    }
    /**
     * Called when connection is deemed open.
     *
     * @api private
     */
    onOpen() {
        debug("socket open");
        this.readyState = "open";
        Socket.priorWebsocketSuccess = "websocket" === this.transport.name;
        this.emitReserved("open");
        this.flush();
        // we check for `readyState` in case an `open`
        // listener already closed the socket
        if ("open" === this.readyState &&
            this.opts.upgrade &&
            this.transport.pause) {
            debug("starting upgrade probes");
            let i = 0;
            const l = this.upgrades.length;
            for (; i < l; i++) {
                this.probe(this.upgrades[i]);
            }
        }
    }
    /**
     * Handles a packet.
     *
     * @api private
     */
    onPacket(packet) {
        if ("opening" === this.readyState ||
            "open" === this.readyState ||
            "closing" === this.readyState) {
            debug('socket receive: type "%s", data "%s"', packet.type, packet.data);
            this.emitReserved("packet", packet);
            // Socket is live - any packet counts
            this.emitReserved("heartbeat");
            switch (packet.type) {
                case "open":
                    this.onHandshake(JSON.parse(packet.data));
                    break;
                case "ping":
                    this.resetPingTimeout();
                    this.sendPacket("pong");
                    this.emitReserved("ping");
                    this.emitReserved("pong");
                    break;
                case "error":
                    const err = new Error("server error");
                    // @ts-ignore
                    err.code = packet.data;
                    this.onError(err);
                    break;
                case "message":
                    this.emitReserved("data", packet.data);
                    this.emitReserved("message", packet.data);
                    break;
            }
        }
        else {
            debug('packet received with socket readyState "%s"', this.readyState);
        }
    }
    /**
     * Called upon handshake completion.
     *
     * @param {Object} data - handshake obj
     * @api private
     */
    onHandshake(data) {
        this.emitReserved("handshake", data);
        this.id = data.sid;
        this.transport.query.sid = data.sid;
        this.upgrades = this.filterUpgrades(data.upgrades);
        this.pingInterval = data.pingInterval;
        this.pingTimeout = data.pingTimeout;
        this.maxPayload = data.maxPayload;
        this.onOpen();
        // In case open handler closes socket
        if ("closed" === this.readyState)
            return;
        this.resetPingTimeout();
    }
    /**
     * Sets and resets ping timeout timer based on server pings.
     *
     * @api private
     */
    resetPingTimeout() {
        this.clearTimeoutFn(this.pingTimeoutTimer);
        this.pingTimeoutTimer = this.setTimeoutFn(() => {
            this.onClose("ping timeout");
        }, this.pingInterval + this.pingTimeout);
        if (this.opts.autoUnref) {
            this.pingTimeoutTimer.unref();
        }
    }
    /**
     * Called on `drain` event
     *
     * @api private
     */
    onDrain() {
        this.writeBuffer.splice(0, this.prevBufferLen);
        // setting prevBufferLen = 0 is very important
        // for example, when upgrading, upgrade packet is sent over,
        // and a nonzero prevBufferLen could cause problems on `drain`
        this.prevBufferLen = 0;
        if (0 === this.writeBuffer.length) {
            this.emitReserved("drain");
        }
        else {
            this.flush();
        }
    }
    /**
     * Flush write buffers.
     *
     * @api private
     */
    flush() {
        if ("closed" !== this.readyState &&
            this.transport.writable &&
            !this.upgrading &&
            this.writeBuffer.length) {
            const packets = this.getWritablePackets();
            debug("flushing %d packets in socket", packets.length);
            this.transport.send(packets);
            // keep track of current length of writeBuffer
            // splice writeBuffer and callbackBuffer on `drain`
            this.prevBufferLen = packets.length;
            this.emitReserved("flush");
        }
    }
    /**
     * Ensure the encoded size of the writeBuffer is below the maxPayload value sent by the server (only for HTTP
     * long-polling)
     *
     * @private
     */
    getWritablePackets() {
        const shouldCheckPayloadSize = this.maxPayload &&
            this.transport.name === "polling" &&
            this.writeBuffer.length > 1;
        if (!shouldCheckPayloadSize) {
            return this.writeBuffer;
        }
        let payloadSize = 1; // first packet type
        for (let i = 0; i < this.writeBuffer.length; i++) {
            const data = this.writeBuffer[i].data;
            if (data) {
                payloadSize += (0, util_js_1.byteLength)(data);
            }
            if (i > 0 && payloadSize > this.maxPayload) {
                debug("only send %d out of %d packets", i, this.writeBuffer.length);
                return this.writeBuffer.slice(0, i);
            }
            payloadSize += 2; // separator + packet type
        }
        debug("payload size is %d (max: %d)", payloadSize, this.maxPayload);
        return this.writeBuffer;
    }
    /**
     * Sends a message.
     *
     * @param {String} message.
     * @param {Function} callback function.
     * @param {Object} options.
     * @return {Socket} for chaining.
     * @api public
     */
    write(msg, options, fn) {
        this.sendPacket("message", msg, options, fn);
        return this;
    }
    send(msg, options, fn) {
        this.sendPacket("message", msg, options, fn);
        return this;
    }
    /**
     * Sends a packet.
     *
     * @param {String} packet type.
     * @param {String} data.
     * @param {Object} options.
     * @param {Function} callback function.
     * @api private
     */
    sendPacket(type, data, options, fn) {
        if ("function" === typeof data) {
            fn = data;
            data = undefined;
        }
        if ("function" === typeof options) {
            fn = options;
            options = null;
        }
        if ("closing" === this.readyState || "closed" === this.readyState) {
            return;
        }
        options = options || {};
        options.compress = false !== options.compress;
        const packet = {
            type: type,
            data: data,
            options: options
        };
        this.emitReserved("packetCreate", packet);
        this.writeBuffer.push(packet);
        if (fn)
            this.once("flush", fn);
        this.flush();
    }
    /**
     * Closes the connection.
     *
     * @api public
     */
    close() {
        const close = () => {
            this.onClose("forced close");
            debug("socket closing - telling transport to close");
            this.transport.close();
        };
        const cleanupAndClose = () => {
            this.off("upgrade", cleanupAndClose);
            this.off("upgradeError", cleanupAndClose);
            close();
        };
        const waitForUpgrade = () => {
            // wait for upgrade to finish since we can't send packets while pausing a transport
            this.once("upgrade", cleanupAndClose);
            this.once("upgradeError", cleanupAndClose);
        };
        if ("opening" === this.readyState || "open" === this.readyState) {
            this.readyState = "closing";
            if (this.writeBuffer.length) {
                this.once("drain", () => {
                    if (this.upgrading) {
                        waitForUpgrade();
                    }
                    else {
                        close();
                    }
                });
            }
            else if (this.upgrading) {
                waitForUpgrade();
            }
            else {
                close();
            }
        }
        return this;
    }
    /**
     * Called upon transport error
     *
     * @api private
     */
    onError(err) {
        debug("socket error %j", err);
        Socket.priorWebsocketSuccess = false;
        this.emitReserved("error", err);
        this.onClose("transport error", err);
    }
    /**
     * Called upon transport close.
     *
     * @api private
     */
    onClose(reason, description) {
        if ("opening" === this.readyState ||
            "open" === this.readyState ||
            "closing" === this.readyState) {
            debug('socket close with reason: "%s"', reason);
            // clear timers
            this.clearTimeoutFn(this.pingTimeoutTimer);
            // stop event from firing again for transport
            this.transport.removeAllListeners("close");
            // ensure transport won't stay open
            this.transport.close();
            // ignore further transport communication
            this.transport.removeAllListeners();
            if (typeof removeEventListener === "function") {
                removeEventListener("offline", this.offlineEventListener, false);
            }
            // set ready state
            this.readyState = "closed";
            // clear session id
            this.id = null;
            // emit close event
            this.emitReserved("close", reason, description);
            // clean buffers after, so users can still
            // grab the buffers on `close` event
            this.writeBuffer = [];
            this.prevBufferLen = 0;
        }
    }
    /**
     * Filters upgrades, returning only those matching client transports.
     *
     * @param {Array} server upgrades
     * @api private
     *
     */
    filterUpgrades(upgrades) {
        const filteredUpgrades = [];
        let i = 0;
        const j = upgrades.length;
        for (; i < j; i++) {
            if (~this.transports.indexOf(upgrades[i]))
                filteredUpgrades.push(upgrades[i]);
        }
        return filteredUpgrades;
    }
}
exports.Socket = Socket;
Socket.protocol = engine_io_parser_1.protocol;

},{"./contrib/parseqs.js":4,"./contrib/parseuri.js":5,"./transports/index.js":11,"./util.js":16,"@socket.io/component-emitter":1,"debug":17,"engine.io-parser":24}],10:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transport = void 0;
const engine_io_parser_1 = require("engine.io-parser");
const component_emitter_1 = require("@socket.io/component-emitter");
const util_js_1 = require("./util.js");
const debug_1 = __importDefault(require("debug")); // debug()
const debug = (0, debug_1.default)("engine.io-client:transport"); // debug()
class TransportError extends Error {
    constructor(reason, description, context) {
        super(reason);
        this.description = description;
        this.context = context;
        this.type = "TransportError";
    }
}
class Transport extends component_emitter_1.Emitter {
    /**
     * Transport abstract constructor.
     *
     * @param {Object} options.
     * @api private
     */
    constructor(opts) {
        super();
        this.writable = false;
        (0, util_js_1.installTimerFunctions)(this, opts);
        this.opts = opts;
        this.query = opts.query;
        this.readyState = "";
        this.socket = opts.socket;
    }
    /**
     * Emits an error.
     *
     * @param {String} reason
     * @param description
     * @param context - the error context
     * @return {Transport} for chaining
     * @api protected
     */
    onError(reason, description, context) {
        super.emitReserved("error", new TransportError(reason, description, context));
        return this;
    }
    /**
     * Opens the transport.
     *
     * @api public
     */
    open() {
        if ("closed" === this.readyState || "" === this.readyState) {
            this.readyState = "opening";
            this.doOpen();
        }
        return this;
    }
    /**
     * Closes the transport.
     *
     * @api public
     */
    close() {
        if ("opening" === this.readyState || "open" === this.readyState) {
            this.doClose();
            this.onClose();
        }
        return this;
    }
    /**
     * Sends multiple packets.
     *
     * @param {Array} packets
     * @api public
     */
    send(packets) {
        if ("open" === this.readyState) {
            this.write(packets);
        }
        else {
            // this might happen if the transport was silently closed in the beforeunload event handler
            debug("transport is not open, discarding packets");
        }
    }
    /**
     * Called upon open
     *
     * @api protected
     */
    onOpen() {
        this.readyState = "open";
        this.writable = true;
        super.emitReserved("open");
    }
    /**
     * Called with data.
     *
     * @param {String} data
     * @api protected
     */
    onData(data) {
        const packet = (0, engine_io_parser_1.decodePacket)(data, this.socket.binaryType);
        this.onPacket(packet);
    }
    /**
     * Called with a decoded packet.
     *
     * @api protected
     */
    onPacket(packet) {
        super.emitReserved("packet", packet);
    }
    /**
     * Called upon close.
     *
     * @api protected
     */
    onClose(details) {
        this.readyState = "closed";
        super.emitReserved("close", details);
    }
}
exports.Transport = Transport;

},{"./util.js":16,"@socket.io/component-emitter":1,"debug":17,"engine.io-parser":24}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transports = void 0;
const polling_js_1 = require("./polling.js");
const websocket_js_1 = require("./websocket.js");
exports.transports = {
    websocket: websocket_js_1.WS,
    polling: polling_js_1.Polling
};

},{"./polling.js":12,"./websocket.js":14}],12:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Request = exports.Polling = void 0;
const transport_js_1 = require("../transport.js");
const debug_1 = __importDefault(require("debug")); // debug()
const yeast_js_1 = require("../contrib/yeast.js");
const parseqs_js_1 = require("../contrib/parseqs.js");
const engine_io_parser_1 = require("engine.io-parser");
const xmlhttprequest_js_1 = require("./xmlhttprequest.js");
const component_emitter_1 = require("@socket.io/component-emitter");
const util_js_1 = require("../util.js");
const globalThis_js_1 = require("../globalThis.js");
const debug = (0, debug_1.default)("engine.io-client:polling"); // debug()
function empty() { }
const hasXHR2 = (function () {
    const xhr = new xmlhttprequest_js_1.XHR({
        xdomain: false
    });
    return null != xhr.responseType;
})();
class Polling extends transport_js_1.Transport {
    /**
     * XHR Polling constructor.
     *
     * @param {Object} opts
     * @api public
     */
    constructor(opts) {
        super(opts);
        this.polling = false;
        if (typeof location !== "undefined") {
            const isSSL = "https:" === location.protocol;
            let port = location.port;
            // some user agents have empty `location.port`
            if (!port) {
                port = isSSL ? "443" : "80";
            }
            this.xd =
                (typeof location !== "undefined" &&
                    opts.hostname !== location.hostname) ||
                    port !== opts.port;
            this.xs = opts.secure !== isSSL;
        }
        /**
         * XHR supports binary
         */
        const forceBase64 = opts && opts.forceBase64;
        this.supportsBinary = hasXHR2 && !forceBase64;
    }
    /**
     * Transport name.
     */
    get name() {
        return "polling";
    }
    /**
     * Opens the socket (triggers polling). We write a PING message to determine
     * when the transport is open.
     *
     * @api private
     */
    doOpen() {
        this.poll();
    }
    /**
     * Pauses polling.
     *
     * @param {Function} callback upon buffers are flushed and transport is paused
     * @api private
     */
    pause(onPause) {
        this.readyState = "pausing";
        const pause = () => {
            debug("paused");
            this.readyState = "paused";
            onPause();
        };
        if (this.polling || !this.writable) {
            let total = 0;
            if (this.polling) {
                debug("we are currently polling - waiting to pause");
                total++;
                this.once("pollComplete", function () {
                    debug("pre-pause polling complete");
                    --total || pause();
                });
            }
            if (!this.writable) {
                debug("we are currently writing - waiting to pause");
                total++;
                this.once("drain", function () {
                    debug("pre-pause writing complete");
                    --total || pause();
                });
            }
        }
        else {
            pause();
        }
    }
    /**
     * Starts polling cycle.
     *
     * @api public
     */
    poll() {
        debug("polling");
        this.polling = true;
        this.doPoll();
        this.emitReserved("poll");
    }
    /**
     * Overloads onData to detect payloads.
     *
     * @api private
     */
    onData(data) {
        debug("polling got data %s", data);
        const callback = packet => {
            // if its the first message we consider the transport open
            if ("opening" === this.readyState && packet.type === "open") {
                this.onOpen();
            }
            // if its a close packet, we close the ongoing requests
            if ("close" === packet.type) {
                this.onClose({ description: "transport closed by the server" });
                return false;
            }
            // otherwise bypass onData and handle the message
            this.onPacket(packet);
        };
        // decode payload
        (0, engine_io_parser_1.decodePayload)(data, this.socket.binaryType).forEach(callback);
        // if an event did not trigger closing
        if ("closed" !== this.readyState) {
            // if we got data we're not polling
            this.polling = false;
            this.emitReserved("pollComplete");
            if ("open" === this.readyState) {
                this.poll();
            }
            else {
                debug('ignoring poll - transport state "%s"', this.readyState);
            }
        }
    }
    /**
     * For polling, send a close packet.
     *
     * @api private
     */
    doClose() {
        const close = () => {
            debug("writing close packet");
            this.write([{ type: "close" }]);
        };
        if ("open" === this.readyState) {
            debug("transport open - closing");
            close();
        }
        else {
            // in case we're trying to close while
            // handshaking is in progress (GH-164)
            debug("transport not open - deferring close");
            this.once("open", close);
        }
    }
    /**
     * Writes a packets payload.
     *
     * @param {Array} data packets
     * @param {Function} drain callback
     * @api private
     */
    write(packets) {
        this.writable = false;
        (0, engine_io_parser_1.encodePayload)(packets, data => {
            this.doWrite(data, () => {
                this.writable = true;
                this.emitReserved("drain");
            });
        });
    }
    /**
     * Generates uri for connection.
     *
     * @api private
     */
    uri() {
        let query = this.query || {};
        const schema = this.opts.secure ? "https" : "http";
        let port = "";
        // cache busting is forced
        if (false !== this.opts.timestampRequests) {
            query[this.opts.timestampParam] = (0, yeast_js_1.yeast)();
        }
        if (!this.supportsBinary && !query.sid) {
            query.b64 = 1;
        }
        // avoid port if default for schema
        if (this.opts.port &&
            (("https" === schema && Number(this.opts.port) !== 443) ||
                ("http" === schema && Number(this.opts.port) !== 80))) {
            port = ":" + this.opts.port;
        }
        const encodedQuery = (0, parseqs_js_1.encode)(query);
        const ipv6 = this.opts.hostname.indexOf(":") !== -1;
        return (schema +
            "://" +
            (ipv6 ? "[" + this.opts.hostname + "]" : this.opts.hostname) +
            port +
            this.opts.path +
            (encodedQuery.length ? "?" + encodedQuery : ""));
    }
    /**
     * Creates a request.
     *
     * @param {String} method
     * @api private
     */
    request(opts = {}) {
        Object.assign(opts, { xd: this.xd, xs: this.xs }, this.opts);
        return new Request(this.uri(), opts);
    }
    /**
     * Sends data.
     *
     * @param {String} data to send.
     * @param {Function} called upon flush.
     * @api private
     */
    doWrite(data, fn) {
        const req = this.request({
            method: "POST",
            data: data
        });
        req.on("success", fn);
        req.on("error", (xhrStatus, context) => {
            this.onError("xhr post error", xhrStatus, context);
        });
    }
    /**
     * Starts a poll cycle.
     *
     * @api private
     */
    doPoll() {
        debug("xhr poll");
        const req = this.request();
        req.on("data", this.onData.bind(this));
        req.on("error", (xhrStatus, context) => {
            this.onError("xhr poll error", xhrStatus, context);
        });
        this.pollXhr = req;
    }
}
exports.Polling = Polling;
class Request extends component_emitter_1.Emitter {
    /**
     * Request constructor
     *
     * @param {Object} options
     * @api public
     */
    constructor(uri, opts) {
        super();
        (0, util_js_1.installTimerFunctions)(this, opts);
        this.opts = opts;
        this.method = opts.method || "GET";
        this.uri = uri;
        this.async = false !== opts.async;
        this.data = undefined !== opts.data ? opts.data : null;
        this.create();
    }
    /**
     * Creates the XHR object and sends the request.
     *
     * @api private
     */
    create() {
        const opts = (0, util_js_1.pick)(this.opts, "agent", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "autoUnref");
        opts.xdomain = !!this.opts.xd;
        opts.xscheme = !!this.opts.xs;
        const xhr = (this.xhr = new xmlhttprequest_js_1.XHR(opts));
        try {
            debug("xhr open %s: %s", this.method, this.uri);
            xhr.open(this.method, this.uri, this.async);
            try {
                if (this.opts.extraHeaders) {
                    xhr.setDisableHeaderCheck && xhr.setDisableHeaderCheck(true);
                    for (let i in this.opts.extraHeaders) {
                        if (this.opts.extraHeaders.hasOwnProperty(i)) {
                            xhr.setRequestHeader(i, this.opts.extraHeaders[i]);
                        }
                    }
                }
            }
            catch (e) { }
            if ("POST" === this.method) {
                try {
                    xhr.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
                }
                catch (e) { }
            }
            try {
                xhr.setRequestHeader("Accept", "*/*");
            }
            catch (e) { }
            // ie6 check
            if ("withCredentials" in xhr) {
                xhr.withCredentials = this.opts.withCredentials;
            }
            if (this.opts.requestTimeout) {
                xhr.timeout = this.opts.requestTimeout;
            }
            xhr.onreadystatechange = () => {
                if (4 !== xhr.readyState)
                    return;
                if (200 === xhr.status || 1223 === xhr.status) {
                    this.onLoad();
                }
                else {
                    // make sure the `error` event handler that's user-set
                    // does not throw in the same tick and gets caught here
                    this.setTimeoutFn(() => {
                        this.onError(typeof xhr.status === "number" ? xhr.status : 0);
                    }, 0);
                }
            };
            debug("xhr data %s", this.data);
            xhr.send(this.data);
        }
        catch (e) {
            // Need to defer since .create() is called directly from the constructor
            // and thus the 'error' event can only be only bound *after* this exception
            // occurs.  Therefore, also, we cannot throw here at all.
            this.setTimeoutFn(() => {
                this.onError(e);
            }, 0);
            return;
        }
        if (typeof document !== "undefined") {
            this.index = Request.requestsCount++;
            Request.requests[this.index] = this;
        }
    }
    /**
     * Called upon error.
     *
     * @api private
     */
    onError(err) {
        this.emitReserved("error", err, this.xhr);
        this.cleanup(true);
    }
    /**
     * Cleans up house.
     *
     * @api private
     */
    cleanup(fromError) {
        if ("undefined" === typeof this.xhr || null === this.xhr) {
            return;
        }
        this.xhr.onreadystatechange = empty;
        if (fromError) {
            try {
                this.xhr.abort();
            }
            catch (e) { }
        }
        if (typeof document !== "undefined") {
            delete Request.requests[this.index];
        }
        this.xhr = null;
    }
    /**
     * Called upon load.
     *
     * @api private
     */
    onLoad() {
        const data = this.xhr.responseText;
        if (data !== null) {
            this.emitReserved("data", data);
            this.emitReserved("success");
            this.cleanup();
        }
    }
    /**
     * Aborts the request.
     *
     * @api public
     */
    abort() {
        this.cleanup();
    }
}
exports.Request = Request;
Request.requestsCount = 0;
Request.requests = {};
/**
 * Aborts pending requests when unloading the window. This is needed to prevent
 * memory leaks (e.g. when using IE) and to ensure that no spurious error is
 * emitted.
 */
if (typeof document !== "undefined") {
    // @ts-ignore
    if (typeof attachEvent === "function") {
        // @ts-ignore
        attachEvent("onunload", unloadHandler);
    }
    else if (typeof addEventListener === "function") {
        const terminationEvent = "onpagehide" in globalThis_js_1.globalThisShim ? "pagehide" : "unload";
        addEventListener(terminationEvent, unloadHandler, false);
    }
}
function unloadHandler() {
    for (let i in Request.requests) {
        if (Request.requests.hasOwnProperty(i)) {
            Request.requests[i].abort();
        }
    }
}

},{"../contrib/parseqs.js":4,"../contrib/yeast.js":6,"../globalThis.js":7,"../transport.js":10,"../util.js":16,"./xmlhttprequest.js":15,"@socket.io/component-emitter":1,"debug":17,"engine.io-parser":24}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultBinaryType = exports.usingBrowserWebSocket = exports.WebSocket = exports.nextTick = void 0;
const globalThis_js_1 = require("../globalThis.js");
exports.nextTick = (() => {
    const isPromiseAvailable = typeof Promise === "function" && typeof Promise.resolve === "function";
    if (isPromiseAvailable) {
        return cb => Promise.resolve().then(cb);
    }
    else {
        return (cb, setTimeoutFn) => setTimeoutFn(cb, 0);
    }
})();
exports.WebSocket = globalThis_js_1.globalThisShim.WebSocket || globalThis_js_1.globalThisShim.MozWebSocket;
exports.usingBrowserWebSocket = true;
exports.defaultBinaryType = "arraybuffer";

},{"../globalThis.js":7}],14:[function(require,module,exports){
(function (Buffer){(function (){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WS = void 0;
const transport_js_1 = require("../transport.js");
const parseqs_js_1 = require("../contrib/parseqs.js");
const yeast_js_1 = require("../contrib/yeast.js");
const util_js_1 = require("../util.js");
const websocket_constructor_js_1 = require("./websocket-constructor.js");
const debug_1 = __importDefault(require("debug")); // debug()
const engine_io_parser_1 = require("engine.io-parser");
const debug = (0, debug_1.default)("engine.io-client:websocket"); // debug()
// detect ReactNative environment
const isReactNative = typeof navigator !== "undefined" &&
    typeof navigator.product === "string" &&
    navigator.product.toLowerCase() === "reactnative";
class WS extends transport_js_1.Transport {
    /**
     * WebSocket transport constructor.
     *
     * @api {Object} connection options
     * @api public
     */
    constructor(opts) {
        super(opts);
        this.supportsBinary = !opts.forceBase64;
    }
    /**
     * Transport name.
     *
     * @api public
     */
    get name() {
        return "websocket";
    }
    /**
     * Opens socket.
     *
     * @api private
     */
    doOpen() {
        if (!this.check()) {
            // let probe timeout
            return;
        }
        const uri = this.uri();
        const protocols = this.opts.protocols;
        // React Native only supports the 'headers' option, and will print a warning if anything else is passed
        const opts = isReactNative
            ? {}
            : (0, util_js_1.pick)(this.opts, "agent", "perMessageDeflate", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "localAddress", "protocolVersion", "origin", "maxPayload", "family", "checkServerIdentity");
        if (this.opts.extraHeaders) {
            opts.headers = this.opts.extraHeaders;
        }
        try {
            this.ws =
                websocket_constructor_js_1.usingBrowserWebSocket && !isReactNative
                    ? protocols
                        ? new websocket_constructor_js_1.WebSocket(uri, protocols)
                        : new websocket_constructor_js_1.WebSocket(uri)
                    : new websocket_constructor_js_1.WebSocket(uri, protocols, opts);
        }
        catch (err) {
            return this.emitReserved("error", err);
        }
        this.ws.binaryType = this.socket.binaryType || websocket_constructor_js_1.defaultBinaryType;
        this.addEventListeners();
    }
    /**
     * Adds event listeners to the socket
     *
     * @api private
     */
    addEventListeners() {
        this.ws.onopen = () => {
            if (this.opts.autoUnref) {
                this.ws._socket.unref();
            }
            this.onOpen();
        };
        this.ws.onclose = closeEvent => this.onClose({
            description: "websocket connection closed",
            context: closeEvent
        });
        this.ws.onmessage = ev => this.onData(ev.data);
        this.ws.onerror = e => this.onError("websocket error", e);
    }
    /**
     * Writes data to socket.
     *
     * @param {Array} array of packets.
     * @api private
     */
    write(packets) {
        this.writable = false;
        // encodePacket efficient as it uses WS framing
        // no need for encodePayload
        for (let i = 0; i < packets.length; i++) {
            const packet = packets[i];
            const lastPacket = i === packets.length - 1;
            (0, engine_io_parser_1.encodePacket)(packet, this.supportsBinary, data => {
                // always create a new object (GH-437)
                const opts = {};
                if (!websocket_constructor_js_1.usingBrowserWebSocket) {
                    if (packet.options) {
                        opts.compress = packet.options.compress;
                    }
                    if (this.opts.perMessageDeflate) {
                        const len = 
                        // @ts-ignore
                        "string" === typeof data ? Buffer.byteLength(data) : data.length;
                        if (len < this.opts.perMessageDeflate.threshold) {
                            opts.compress = false;
                        }
                    }
                }
                // Sometimes the websocket has already been closed but the browser didn't
                // have a chance of informing us about it yet, in that case send will
                // throw an error
                try {
                    if (websocket_constructor_js_1.usingBrowserWebSocket) {
                        // TypeError is thrown when passing the second argument on Safari
                        this.ws.send(data);
                    }
                    else {
                        this.ws.send(data, opts);
                    }
                }
                catch (e) {
                    debug("websocket closed before onclose event");
                }
                if (lastPacket) {
                    // fake drain
                    // defer to next tick to allow Socket to clear writeBuffer
                    (0, websocket_constructor_js_1.nextTick)(() => {
                        this.writable = true;
                        this.emitReserved("drain");
                    }, this.setTimeoutFn);
                }
            });
        }
    }
    /**
     * Closes socket.
     *
     * @api private
     */
    doClose() {
        if (typeof this.ws !== "undefined") {
            this.ws.close();
            this.ws = null;
        }
    }
    /**
     * Generates uri for connection.
     *
     * @api private
     */
    uri() {
        let query = this.query || {};
        const schema = this.opts.secure ? "wss" : "ws";
        let port = "";
        // avoid port if default for schema
        if (this.opts.port &&
            (("wss" === schema && Number(this.opts.port) !== 443) ||
                ("ws" === schema && Number(this.opts.port) !== 80))) {
            port = ":" + this.opts.port;
        }
        // append timestamp to URI
        if (this.opts.timestampRequests) {
            query[this.opts.timestampParam] = (0, yeast_js_1.yeast)();
        }
        // communicate binary support capabilities
        if (!this.supportsBinary) {
            query.b64 = 1;
        }
        const encodedQuery = (0, parseqs_js_1.encode)(query);
        const ipv6 = this.opts.hostname.indexOf(":") !== -1;
        return (schema +
            "://" +
            (ipv6 ? "[" + this.opts.hostname + "]" : this.opts.hostname) +
            port +
            this.opts.path +
            (encodedQuery.length ? "?" + encodedQuery : ""));
    }
    /**
     * Feature detection for WebSocket.
     *
     * @return {Boolean} whether this transport is available.
     * @api public
     */
    check() {
        return !!websocket_constructor_js_1.WebSocket;
    }
}
exports.WS = WS;

}).call(this)}).call(this,require("buffer").Buffer)
},{"../contrib/parseqs.js":4,"../contrib/yeast.js":6,"../transport.js":10,"../util.js":16,"./websocket-constructor.js":13,"buffer":89,"debug":17,"engine.io-parser":24}],15:[function(require,module,exports){
"use strict";
// browser shim for xmlhttprequest module
Object.defineProperty(exports, "__esModule", { value: true });
exports.XHR = void 0;
const has_cors_js_1 = require("../contrib/has-cors.js");
const globalThis_js_1 = require("../globalThis.js");
function XHR(opts) {
    const xdomain = opts.xdomain;
    // XMLHttpRequest can be disabled on IE
    try {
        if ("undefined" !== typeof XMLHttpRequest && (!xdomain || has_cors_js_1.hasCORS)) {
            return new XMLHttpRequest();
        }
    }
    catch (e) { }
    if (!xdomain) {
        try {
            return new globalThis_js_1.globalThisShim[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");
        }
        catch (e) { }
    }
}
exports.XHR = XHR;

},{"../contrib/has-cors.js":3,"../globalThis.js":7}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.byteLength = exports.installTimerFunctions = exports.pick = void 0;
const globalThis_js_1 = require("./globalThis.js");
function pick(obj, ...attr) {
    return attr.reduce((acc, k) => {
        if (obj.hasOwnProperty(k)) {
            acc[k] = obj[k];
        }
        return acc;
    }, {});
}
exports.pick = pick;
// Keep a reference to the real timeout functions so they can be used when overridden
const NATIVE_SET_TIMEOUT = setTimeout;
const NATIVE_CLEAR_TIMEOUT = clearTimeout;
function installTimerFunctions(obj, opts) {
    if (opts.useNativeTimers) {
        obj.setTimeoutFn = NATIVE_SET_TIMEOUT.bind(globalThis_js_1.globalThisShim);
        obj.clearTimeoutFn = NATIVE_CLEAR_TIMEOUT.bind(globalThis_js_1.globalThisShim);
    }
    else {
        obj.setTimeoutFn = setTimeout.bind(globalThis_js_1.globalThisShim);
        obj.clearTimeoutFn = clearTimeout.bind(globalThis_js_1.globalThisShim);
    }
}
exports.installTimerFunctions = installTimerFunctions;
// base64 encoded buffers are about 33% bigger (https://en.wikipedia.org/wiki/Base64)
const BASE64_OVERHEAD = 1.33;
// we could also have used `new Blob([obj]).size`, but it isn't supported in IE9
function byteLength(obj) {
    if (typeof obj === "string") {
        return utf8Length(obj);
    }
    // arraybuffer or blob
    return Math.ceil((obj.byteLength || obj.size) * BASE64_OVERHEAD);
}
exports.byteLength = byteLength;
function utf8Length(str) {
    let c = 0, length = 0;
    for (let i = 0, l = str.length; i < l; i++) {
        c = str.charCodeAt(i);
        if (c < 0x80) {
            length += 1;
        }
        else if (c < 0x800) {
            length += 2;
        }
        else if (c < 0xd800 || c >= 0xe000) {
            length += 3;
        }
        else {
            i++;
            length += 4;
        }
    }
    return length;
}

},{"./globalThis.js":7}],17:[function(require,module,exports){
(function (process){(function (){
/* eslint-env browser */

/**
 * This is the web browser implementation of `debug()`.
 */

exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();
exports.destroy = (() => {
	let warned = false;

	return () => {
		if (!warned) {
			warned = true;
			console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
		}
	};
})();

/**
 * Colors.
 */

exports.colors = [
	'#0000CC',
	'#0000FF',
	'#0033CC',
	'#0033FF',
	'#0066CC',
	'#0066FF',
	'#0099CC',
	'#0099FF',
	'#00CC00',
	'#00CC33',
	'#00CC66',
	'#00CC99',
	'#00CCCC',
	'#00CCFF',
	'#3300CC',
	'#3300FF',
	'#3333CC',
	'#3333FF',
	'#3366CC',
	'#3366FF',
	'#3399CC',
	'#3399FF',
	'#33CC00',
	'#33CC33',
	'#33CC66',
	'#33CC99',
	'#33CCCC',
	'#33CCFF',
	'#6600CC',
	'#6600FF',
	'#6633CC',
	'#6633FF',
	'#66CC00',
	'#66CC33',
	'#9900CC',
	'#9900FF',
	'#9933CC',
	'#9933FF',
	'#99CC00',
	'#99CC33',
	'#CC0000',
	'#CC0033',
	'#CC0066',
	'#CC0099',
	'#CC00CC',
	'#CC00FF',
	'#CC3300',
	'#CC3333',
	'#CC3366',
	'#CC3399',
	'#CC33CC',
	'#CC33FF',
	'#CC6600',
	'#CC6633',
	'#CC9900',
	'#CC9933',
	'#CCCC00',
	'#CCCC33',
	'#FF0000',
	'#FF0033',
	'#FF0066',
	'#FF0099',
	'#FF00CC',
	'#FF00FF',
	'#FF3300',
	'#FF3333',
	'#FF3366',
	'#FF3399',
	'#FF33CC',
	'#FF33FF',
	'#FF6600',
	'#FF6633',
	'#FF9900',
	'#FF9933',
	'#FFCC00',
	'#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

// eslint-disable-next-line complexity
function useColors() {
	// NB: In an Electron preload script, document will be defined but not fully
	// initialized. Since we know we're in Chrome, we'll just detect this case
	// explicitly
	if (typeof window !== 'undefined' && window.process && (window.process.type === 'renderer' || window.process.__nwjs)) {
		return true;
	}

	// Internet Explorer and Edge do not support colors.
	if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
		return false;
	}

	// Is webkit? http://stackoverflow.com/a/16459606/376773
	// document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
	return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
		// Is firebug? http://stackoverflow.com/a/398120/376773
		(typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
		// Is firefox >= v31?
		// https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
		// Double check webkit in userAgent just in case we are in a worker
		(typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
	args[0] = (this.useColors ? '%c' : '') +
		this.namespace +
		(this.useColors ? ' %c' : ' ') +
		args[0] +
		(this.useColors ? '%c ' : ' ') +
		'+' + module.exports.humanize(this.diff);

	if (!this.useColors) {
		return;
	}

	const c = 'color: ' + this.color;
	args.splice(1, 0, c, 'color: inherit');

	// The final "%c" is somewhat tricky, because there could be other
	// arguments passed either before or after the %c, so we need to
	// figure out the correct index to insert the CSS into
	let index = 0;
	let lastC = 0;
	args[0].replace(/%[a-zA-Z%]/g, match => {
		if (match === '%%') {
			return;
		}
		index++;
		if (match === '%c') {
			// We only are interested in the *last* %c
			// (the user may have provided their own)
			lastC = index;
		}
	});

	args.splice(lastC, 0, c);
}

/**
 * Invokes `console.debug()` when available.
 * No-op when `console.debug` is not a "function".
 * If `console.debug` is not available, falls back
 * to `console.log`.
 *
 * @api public
 */
exports.log = console.debug || console.log || (() => {});

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */
function save(namespaces) {
	try {
		if (namespaces) {
			exports.storage.setItem('debug', namespaces);
		} else {
			exports.storage.removeItem('debug');
		}
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */
function load() {
	let r;
	try {
		r = exports.storage.getItem('debug');
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}

	// If debug isn't set in LS, and we're in Electron, try to load $DEBUG
	if (!r && typeof process !== 'undefined' && 'env' in process) {
		r = process.env.DEBUG;
	}

	return r;
}

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
	try {
		// TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
		// The Browser also has localStorage in the global context.
		return localStorage;
	} catch (error) {
		// Swallow
		// XXX (@Qix-) should we be logging these?
	}
}

module.exports = require('./common')(exports);

const {formatters} = module.exports;

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

formatters.j = function (v) {
	try {
		return JSON.stringify(v);
	} catch (error) {
		return '[UnexpectedJSONParseError]: ' + error.message;
	}
};

}).call(this)}).call(this,require('_process'))
},{"./common":18,"_process":92}],18:[function(require,module,exports){

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */

function setup(env) {
	createDebug.debug = createDebug;
	createDebug.default = createDebug;
	createDebug.coerce = coerce;
	createDebug.disable = disable;
	createDebug.enable = enable;
	createDebug.enabled = enabled;
	createDebug.humanize = require('ms');
	createDebug.destroy = destroy;

	Object.keys(env).forEach(key => {
		createDebug[key] = env[key];
	});

	/**
	* The currently active debug mode names, and names to skip.
	*/

	createDebug.names = [];
	createDebug.skips = [];

	/**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/
	createDebug.formatters = {};

	/**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/
	function selectColor(namespace) {
		let hash = 0;

		for (let i = 0; i < namespace.length; i++) {
			hash = ((hash << 5) - hash) + namespace.charCodeAt(i);
			hash |= 0; // Convert to 32bit integer
		}

		return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
	}
	createDebug.selectColor = selectColor;

	/**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/
	function createDebug(namespace) {
		let prevTime;
		let enableOverride = null;
		let namespacesCache;
		let enabledCache;

		function debug(...args) {
			// Disabled?
			if (!debug.enabled) {
				return;
			}

			const self = debug;

			// Set `diff` timestamp
			const curr = Number(new Date());
			const ms = curr - (prevTime || curr);
			self.diff = ms;
			self.prev = prevTime;
			self.curr = curr;
			prevTime = curr;

			args[0] = createDebug.coerce(args[0]);

			if (typeof args[0] !== 'string') {
				// Anything else let's inspect with %O
				args.unshift('%O');
			}

			// Apply any `formatters` transformations
			let index = 0;
			args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
				// If we encounter an escaped % then don't increase the array index
				if (match === '%%') {
					return '%';
				}
				index++;
				const formatter = createDebug.formatters[format];
				if (typeof formatter === 'function') {
					const val = args[index];
					match = formatter.call(self, val);

					// Now we need to remove `args[index]` since it's inlined in the `format`
					args.splice(index, 1);
					index--;
				}
				return match;
			});

			// Apply env-specific formatting (colors, etc.)
			createDebug.formatArgs.call(self, args);

			const logFn = self.log || createDebug.log;
			logFn.apply(self, args);
		}

		debug.namespace = namespace;
		debug.useColors = createDebug.useColors();
		debug.color = createDebug.selectColor(namespace);
		debug.extend = extend;
		debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.

		Object.defineProperty(debug, 'enabled', {
			enumerable: true,
			configurable: false,
			get: () => {
				if (enableOverride !== null) {
					return enableOverride;
				}
				if (namespacesCache !== createDebug.namespaces) {
					namespacesCache = createDebug.namespaces;
					enabledCache = createDebug.enabled(namespace);
				}

				return enabledCache;
			},
			set: v => {
				enableOverride = v;
			}
		});

		// Env-specific initialization logic for debug instances
		if (typeof createDebug.init === 'function') {
			createDebug.init(debug);
		}

		return debug;
	}

	function extend(namespace, delimiter) {
		const newDebug = createDebug(this.namespace + (typeof delimiter === 'undefined' ? ':' : delimiter) + namespace);
		newDebug.log = this.log;
		return newDebug;
	}

	/**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/
	function enable(namespaces) {
		createDebug.save(namespaces);
		createDebug.namespaces = namespaces;

		createDebug.names = [];
		createDebug.skips = [];

		let i;
		const split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
		const len = split.length;

		for (i = 0; i < len; i++) {
			if (!split[i]) {
				// ignore empty strings
				continue;
			}

			namespaces = split[i].replace(/\*/g, '.*?');

			if (namespaces[0] === '-') {
				createDebug.skips.push(new RegExp('^' + namespaces.slice(1) + '$'));
			} else {
				createDebug.names.push(new RegExp('^' + namespaces + '$'));
			}
		}
	}

	/**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/
	function disable() {
		const namespaces = [
			...createDebug.names.map(toNamespace),
			...createDebug.skips.map(toNamespace).map(namespace => '-' + namespace)
		].join(',');
		createDebug.enable('');
		return namespaces;
	}

	/**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/
	function enabled(name) {
		if (name[name.length - 1] === '*') {
			return true;
		}

		let i;
		let len;

		for (i = 0, len = createDebug.skips.length; i < len; i++) {
			if (createDebug.skips[i].test(name)) {
				return false;
			}
		}

		for (i = 0, len = createDebug.names.length; i < len; i++) {
			if (createDebug.names[i].test(name)) {
				return true;
			}
		}

		return false;
	}

	/**
	* Convert regexp to namespace
	*
	* @param {RegExp} regxep
	* @return {String} namespace
	* @api private
	*/
	function toNamespace(regexp) {
		return regexp.toString()
			.substring(2, regexp.toString().length - 2)
			.replace(/\.\*\?$/, '*');
	}

	/**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/
	function coerce(val) {
		if (val instanceof Error) {
			return val.stack || val.message;
		}
		return val;
	}

	/**
	* XXX DO NOT USE. This is a temporary stub function.
	* XXX It WILL be removed in the next major release.
	*/
	function destroy() {
		console.warn('Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.');
	}

	createDebug.enable(createDebug.load());

	return createDebug;
}

module.exports = setup;

},{"ms":19}],19:[function(require,module,exports){
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  if (msAbs >= d) {
    return plural(ms, msAbs, d, 'day');
  }
  if (msAbs >= h) {
    return plural(ms, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(ms, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(ms, msAbs, s, 'second');
  }
  return ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  var isPlural = msAbs >= n * 1.5;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}

},{}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_PACKET = exports.PACKET_TYPES_REVERSE = exports.PACKET_TYPES = void 0;
const PACKET_TYPES = Object.create(null); // no Map = no polyfill
exports.PACKET_TYPES = PACKET_TYPES;
PACKET_TYPES["open"] = "0";
PACKET_TYPES["close"] = "1";
PACKET_TYPES["ping"] = "2";
PACKET_TYPES["pong"] = "3";
PACKET_TYPES["message"] = "4";
PACKET_TYPES["upgrade"] = "5";
PACKET_TYPES["noop"] = "6";
const PACKET_TYPES_REVERSE = Object.create(null);
exports.PACKET_TYPES_REVERSE = PACKET_TYPES_REVERSE;
Object.keys(PACKET_TYPES).forEach(key => {
    PACKET_TYPES_REVERSE[PACKET_TYPES[key]] = key;
});
const ERROR_PACKET = { type: "error", data: "parser error" };
exports.ERROR_PACKET = ERROR_PACKET;

},{}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decode = exports.encode = void 0;
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
// Use a lookup table to find the index.
const lookup = typeof Uint8Array === 'undefined' ? [] : new Uint8Array(256);
for (let i = 0; i < chars.length; i++) {
    lookup[chars.charCodeAt(i)] = i;
}
const encode = (arraybuffer) => {
    let bytes = new Uint8Array(arraybuffer), i, len = bytes.length, base64 = '';
    for (i = 0; i < len; i += 3) {
        base64 += chars[bytes[i] >> 2];
        base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
        base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
        base64 += chars[bytes[i + 2] & 63];
    }
    if (len % 3 === 2) {
        base64 = base64.substring(0, base64.length - 1) + '=';
    }
    else if (len % 3 === 1) {
        base64 = base64.substring(0, base64.length - 2) + '==';
    }
    return base64;
};
exports.encode = encode;
const decode = (base64) => {
    let bufferLength = base64.length * 0.75, len = base64.length, i, p = 0, encoded1, encoded2, encoded3, encoded4;
    if (base64[base64.length - 1] === '=') {
        bufferLength--;
        if (base64[base64.length - 2] === '=') {
            bufferLength--;
        }
    }
    const arraybuffer = new ArrayBuffer(bufferLength), bytes = new Uint8Array(arraybuffer);
    for (i = 0; i < len; i += 4) {
        encoded1 = lookup[base64.charCodeAt(i)];
        encoded2 = lookup[base64.charCodeAt(i + 1)];
        encoded3 = lookup[base64.charCodeAt(i + 2)];
        encoded4 = lookup[base64.charCodeAt(i + 3)];
        bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
        bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
        bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
    }
    return arraybuffer;
};
exports.decode = decode;

},{}],22:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commons_js_1 = require("./commons.js");
const base64_arraybuffer_js_1 = require("./contrib/base64-arraybuffer.js");
const withNativeArrayBuffer = typeof ArrayBuffer === "function";
const decodePacket = (encodedPacket, binaryType) => {
    if (typeof encodedPacket !== "string") {
        return {
            type: "message",
            data: mapBinary(encodedPacket, binaryType)
        };
    }
    const type = encodedPacket.charAt(0);
    if (type === "b") {
        return {
            type: "message",
            data: decodeBase64Packet(encodedPacket.substring(1), binaryType)
        };
    }
    const packetType = commons_js_1.PACKET_TYPES_REVERSE[type];
    if (!packetType) {
        return commons_js_1.ERROR_PACKET;
    }
    return encodedPacket.length > 1
        ? {
            type: commons_js_1.PACKET_TYPES_REVERSE[type],
            data: encodedPacket.substring(1)
        }
        : {
            type: commons_js_1.PACKET_TYPES_REVERSE[type]
        };
};
const decodeBase64Packet = (data, binaryType) => {
    if (withNativeArrayBuffer) {
        const decoded = (0, base64_arraybuffer_js_1.decode)(data);
        return mapBinary(decoded, binaryType);
    }
    else {
        return { base64: true, data }; // fallback for old browsers
    }
};
const mapBinary = (data, binaryType) => {
    switch (binaryType) {
        case "blob":
            return data instanceof ArrayBuffer ? new Blob([data]) : data;
        case "arraybuffer":
        default:
            return data; // assuming the data is already an ArrayBuffer
    }
};
exports.default = decodePacket;

},{"./commons.js":20,"./contrib/base64-arraybuffer.js":21}],23:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commons_js_1 = require("./commons.js");
const withNativeBlob = typeof Blob === "function" ||
    (typeof Blob !== "undefined" &&
        Object.prototype.toString.call(Blob) === "[object BlobConstructor]");
const withNativeArrayBuffer = typeof ArrayBuffer === "function";
// ArrayBuffer.isView method is not defined in IE10
const isView = obj => {
    return typeof ArrayBuffer.isView === "function"
        ? ArrayBuffer.isView(obj)
        : obj && obj.buffer instanceof ArrayBuffer;
};
const encodePacket = ({ type, data }, supportsBinary, callback) => {
    if (withNativeBlob && data instanceof Blob) {
        if (supportsBinary) {
            return callback(data);
        }
        else {
            return encodeBlobAsBase64(data, callback);
        }
    }
    else if (withNativeArrayBuffer &&
        (data instanceof ArrayBuffer || isView(data))) {
        if (supportsBinary) {
            return callback(data);
        }
        else {
            return encodeBlobAsBase64(new Blob([data]), callback);
        }
    }
    // plain string
    return callback(commons_js_1.PACKET_TYPES[type] + (data || ""));
};
const encodeBlobAsBase64 = (data, callback) => {
    const fileReader = new FileReader();
    fileReader.onload = function () {
        const content = fileReader.result.split(",")[1];
        callback("b" + content);
    };
    return fileReader.readAsDataURL(data);
};
exports.default = encodePacket;

},{"./commons.js":20}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodePayload = exports.decodePacket = exports.encodePayload = exports.encodePacket = exports.protocol = void 0;
const encodePacket_js_1 = require("./encodePacket.js");
exports.encodePacket = encodePacket_js_1.default;
const decodePacket_js_1 = require("./decodePacket.js");
exports.decodePacket = decodePacket_js_1.default;
const SEPARATOR = String.fromCharCode(30); // see https://en.wikipedia.org/wiki/Delimiter#ASCII_delimited_text
const encodePayload = (packets, callback) => {
    // some packets may be added to the array while encoding, so the initial length must be saved
    const length = packets.length;
    const encodedPackets = new Array(length);
    let count = 0;
    packets.forEach((packet, i) => {
        // force base64 encoding for binary packets
        (0, encodePacket_js_1.default)(packet, false, encodedPacket => {
            encodedPackets[i] = encodedPacket;
            if (++count === length) {
                callback(encodedPackets.join(SEPARATOR));
            }
        });
    });
};
exports.encodePayload = encodePayload;
const decodePayload = (encodedPayload, binaryType) => {
    const encodedPackets = encodedPayload.split(SEPARATOR);
    const packets = [];
    for (let i = 0; i < encodedPackets.length; i++) {
        const decodedPacket = (0, decodePacket_js_1.default)(encodedPackets[i], binaryType);
        packets.push(decodedPacket);
        if (decodedPacket.type === "error") {
            break;
        }
    }
    return packets;
};
exports.decodePayload = decodePayload;
exports.protocol = 4;

},{"./decodePacket.js":22,"./encodePacket.js":23}],25:[function(require,module,exports){
/**
 * Graphology ForceAtlas2 Layout Default Settings
 * ===============================================
 */
module.exports = {
  linLogMode: false,
  outboundAttractionDistribution: false,
  adjustSizes: false,
  edgeWeightInfluence: 1,
  scalingRatio: 1,
  strongGravityMode: false,
  gravity: 1,
  slowDown: 1,
  barnesHutOptimize: false,
  barnesHutTheta: 0.5
};

},{}],26:[function(require,module,exports){
/**
 * Graphology ForceAtlas2 Helpers
 * ===============================
 *
 * Miscellaneous helper functions.
 */

/**
 * Constants.
 */
var PPN = 10;
var PPE = 3;

/**
 * Very simple Object.assign-like function.
 *
 * @param  {object} target       - First object.
 * @param  {object} [...objects] - Objects to merge.
 * @return {object}
 */
exports.assign = function (target) {
  target = target || {};

  var objects = Array.prototype.slice.call(arguments).slice(1),
    i,
    k,
    l;

  for (i = 0, l = objects.length; i < l; i++) {
    if (!objects[i]) continue;

    for (k in objects[i]) target[k] = objects[i][k];
  }

  return target;
};

/**
 * Function used to validate the given settings.
 *
 * @param  {object}      settings - Settings to validate.
 * @return {object|null}
 */
exports.validateSettings = function (settings) {
  if ('linLogMode' in settings && typeof settings.linLogMode !== 'boolean')
    return {message: 'the `linLogMode` setting should be a boolean.'};

  if (
    'outboundAttractionDistribution' in settings &&
    typeof settings.outboundAttractionDistribution !== 'boolean'
  )
    return {
      message:
        'the `outboundAttractionDistribution` setting should be a boolean.'
    };

  if ('adjustSizes' in settings && typeof settings.adjustSizes !== 'boolean')
    return {message: 'the `adjustSizes` setting should be a boolean.'};

  if (
    'edgeWeightInfluence' in settings &&
    typeof settings.edgeWeightInfluence !== 'number'
  )
    return {
      message: 'the `edgeWeightInfluence` setting should be a number.'
    };

  if (
    'scalingRatio' in settings &&
    !(typeof settings.scalingRatio === 'number' && settings.scalingRatio >= 0)
  )
    return {message: 'the `scalingRatio` setting should be a number >= 0.'};

  if (
    'strongGravityMode' in settings &&
    typeof settings.strongGravityMode !== 'boolean'
  )
    return {message: 'the `strongGravityMode` setting should be a boolean.'};

  if (
    'gravity' in settings &&
    !(typeof settings.gravity === 'number' && settings.gravity >= 0)
  )
    return {message: 'the `gravity` setting should be a number >= 0.'};

  if (
    'slowDown' in settings &&
    !(typeof settings.slowDown === 'number' || settings.slowDown >= 0)
  )
    return {message: 'the `slowDown` setting should be a number >= 0.'};

  if (
    'barnesHutOptimize' in settings &&
    typeof settings.barnesHutOptimize !== 'boolean'
  )
    return {message: 'the `barnesHutOptimize` setting should be a boolean.'};

  if (
    'barnesHutTheta' in settings &&
    !(
      typeof settings.barnesHutTheta === 'number' &&
      settings.barnesHutTheta >= 0
    )
  )
    return {message: 'the `barnesHutTheta` setting should be a number >= 0.'};

  return null;
};

/**
 * Function generating a flat matrix for both nodes & edges of the given graph.
 *
 * @param  {Graph}    graph         - Target graph.
 * @param  {function} getEdgeWeight - Edge weight getter function.
 * @return {object}                 - Both matrices.
 */
exports.graphToByteArrays = function (graph, getEdgeWeight) {
  var order = graph.order;
  var size = graph.size;
  var index = {};
  var j;

  var NodeMatrix = new Float32Array(order * PPN);
  var EdgeMatrix = new Float32Array(size * PPE);

  // Iterate through nodes
  j = 0;
  graph.forEachNode(function (node, attr) {
    // Node index
    index[node] = j;

    // Populating byte array
    NodeMatrix[j] = attr.x;
    NodeMatrix[j + 1] = attr.y;
    NodeMatrix[j + 2] = 0;
    NodeMatrix[j + 3] = 0;
    NodeMatrix[j + 4] = 0;
    NodeMatrix[j + 5] = 0;
    NodeMatrix[j + 6] = 1 + graph.degree(node);
    NodeMatrix[j + 7] = 1;
    NodeMatrix[j + 8] = attr.size || 1;
    NodeMatrix[j + 9] = attr.fixed ? 1 : 0;
    j += PPN;
  });

  // Iterate through edges
  j = 0;
  graph.forEachEdge(function (edge, attr, source, target, sa, ta, u) {
    // Populating byte array
    EdgeMatrix[j] = index[source];
    EdgeMatrix[j + 1] = index[target];
    EdgeMatrix[j + 2] = getEdgeWeight(edge, attr, source, target, sa, ta, u);
    j += PPE;
  });

  return {
    nodes: NodeMatrix,
    edges: EdgeMatrix
  };
};

/**
 * Function applying the layout back to the graph.
 *
 * @param {Graph}         graph         - Target graph.
 * @param {Float32Array}  NodeMatrix    - Node matrix.
 * @param {function|null} outputReducer - A node reducer.
 */
exports.assignLayoutChanges = function (graph, NodeMatrix, outputReducer) {
  var i = 0;

  graph.updateEachNodeAttributes(function (node, attr) {
    attr.x = NodeMatrix[i];
    attr.y = NodeMatrix[i + 1];

    i += PPN;

    return outputReducer ? outputReducer(node, attr) : attr;
  });
};

/**
 * Function reading the positions (only) from the graph, to write them in the matrix.
 *
 * @param {Graph}        graph      - Target graph.
 * @param {Float32Array} NodeMatrix - Node matrix.
 */
exports.readGraphPositions = function (graph, NodeMatrix) {
  var i = 0;

  graph.forEachNode(function (node, attr) {
    NodeMatrix[i] = attr.x;
    NodeMatrix[i + 1] = attr.y;

    i += PPN;
  });
};

/**
 * Function collecting the layout positions.
 *
 * @param  {Graph}         graph         - Target graph.
 * @param  {Float32Array}  NodeMatrix    - Node matrix.
 * @param  {function|null} outputReducer - A nodes reducer.
 * @return {object}                      - Map to node positions.
 */
exports.collectLayoutChanges = function (graph, NodeMatrix, outputReducer) {
  var nodes = graph.nodes(),
    positions = {};

  for (var i = 0, j = 0, l = NodeMatrix.length; i < l; i += PPN) {
    if (outputReducer) {
      var newAttr = Object.assign({}, graph.getNodeAttributes(nodes[j]));
      newAttr.x = NodeMatrix[i];
      newAttr.y = NodeMatrix[i + 1];
      newAttr = outputReducer(nodes[j], newAttr);
      positions[nodes[j]] = {
        x: newAttr.x,
        y: newAttr.y
      };
    } else {
      positions[nodes[j]] = {
        x: NodeMatrix[i],
        y: NodeMatrix[i + 1]
      };
    }

    j++;
  }

  return positions;
};

/**
 * Function returning a web worker from the given function.
 *
 * @param  {function}  fn - Function for the worker.
 * @return {DOMString}
 */
exports.createWorker = function createWorker(fn) {
  var xURL = window.URL || window.webkitURL;
  var code = fn.toString();
  var objectUrl = xURL.createObjectURL(
    new Blob(['(' + code + ').call(this);'], {type: 'text/javascript'})
  );
  var worker = new Worker(objectUrl);
  xURL.revokeObjectURL(objectUrl);

  return worker;
};

},{}],27:[function(require,module,exports){
/**
 * Graphology ForceAtlas2 Layout
 * ==============================
 *
 * Library endpoint.
 */
var isGraph = require('graphology-utils/is-graph');
var createEdgeWeightGetter =
  require('graphology-utils/getters').createEdgeWeightGetter;
var iterate = require('./iterate.js');
var helpers = require('./helpers.js');

var DEFAULT_SETTINGS = require('./defaults.js');

/**
 * Asbtract function used to run a certain number of iterations.
 *
 * @param  {boolean}       assign          - Whether to assign positions.
 * @param  {Graph}         graph           - Target graph.
 * @param  {object|number} params          - If number, params.iterations, else:
 * @param  {function}        getWeight     - Edge weight getter function.
 * @param  {number}          iterations    - Number of iterations.
 * @param  {function|null}   outputReducer - A node reducer
 * @param  {object}          [settings]    - Settings.
 * @return {object|undefined}
 */
function abstractSynchronousLayout(assign, graph, params) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-layout-forceatlas2: the given graph is not a valid graphology instance.'
    );

  if (typeof params === 'number') params = {iterations: params};

  var iterations = params.iterations;

  if (typeof iterations !== 'number')
    throw new Error(
      'graphology-layout-forceatlas2: invalid number of iterations.'
    );

  if (iterations <= 0)
    throw new Error(
      'graphology-layout-forceatlas2: you should provide a positive number of iterations.'
    );

  var getEdgeWeight = createEdgeWeightGetter(params.getEdgeWeight).fromEntry;

  var outputReducer =
    typeof params.outputReducer === 'function' ? params.outputReducer : null;

  // Validating settings
  var settings = helpers.assign({}, DEFAULT_SETTINGS, params.settings);
  var validationError = helpers.validateSettings(settings);

  if (validationError)
    throw new Error(
      'graphology-layout-forceatlas2: ' + validationError.message
    );

  // Building matrices
  var matrices = helpers.graphToByteArrays(graph, getEdgeWeight);

  var i;

  // Iterating
  for (i = 0; i < iterations; i++)
    iterate(settings, matrices.nodes, matrices.edges);

  // Applying
  if (assign) {
    helpers.assignLayoutChanges(graph, matrices.nodes, outputReducer);
    return;
  }

  return helpers.collectLayoutChanges(graph, matrices.nodes);
}

/**
 * Function returning sane layout settings for the given graph.
 *
 * @param  {Graph|number} graph - Target graph or graph order.
 * @return {object}
 */
function inferSettings(graph) {
  var order = typeof graph === 'number' ? graph : graph.order;

  return {
    barnesHutOptimize: order > 2000,
    strongGravityMode: true,
    gravity: 0.05,
    scalingRatio: 10,
    slowDown: 1 + Math.log(order)
  };
}

/**
 * Exporting.
 */
var synchronousLayout = abstractSynchronousLayout.bind(null, false);
synchronousLayout.assign = abstractSynchronousLayout.bind(null, true);
synchronousLayout.inferSettings = inferSettings;

module.exports = synchronousLayout;

},{"./defaults.js":25,"./helpers.js":26,"./iterate.js":28,"graphology-utils/getters":35,"graphology-utils/is-graph":36}],28:[function(require,module,exports){
/* eslint no-constant-condition: 0 */
/**
 * Graphology ForceAtlas2 Iteration
 * =================================
 *
 * Function used to perform a single iteration of the algorithm.
 */

/**
 * Matrices properties accessors.
 */
var NODE_X = 0;
var NODE_Y = 1;
var NODE_DX = 2;
var NODE_DY = 3;
var NODE_OLD_DX = 4;
var NODE_OLD_DY = 5;
var NODE_MASS = 6;
var NODE_CONVERGENCE = 7;
var NODE_SIZE = 8;
var NODE_FIXED = 9;

var EDGE_SOURCE = 0;
var EDGE_TARGET = 1;
var EDGE_WEIGHT = 2;

var REGION_NODE = 0;
var REGION_CENTER_X = 1;
var REGION_CENTER_Y = 2;
var REGION_SIZE = 3;
var REGION_NEXT_SIBLING = 4;
var REGION_FIRST_CHILD = 5;
var REGION_MASS = 6;
var REGION_MASS_CENTER_X = 7;
var REGION_MASS_CENTER_Y = 8;

var SUBDIVISION_ATTEMPTS = 3;

/**
 * Constants.
 */
var PPN = 10;
var PPE = 3;
var PPR = 9;

var MAX_FORCE = 10;

/**
 * Function used to perform a single interation of the algorithm.
 *
 * @param  {object}       options    - Layout options.
 * @param  {Float32Array} NodeMatrix - Node data.
 * @param  {Float32Array} EdgeMatrix - Edge data.
 * @return {object}                  - Some metadata.
 */
module.exports = function iterate(options, NodeMatrix, EdgeMatrix) {
  // Initializing variables
  var l, r, n, n1, n2, rn, e, w, g, s;

  var order = NodeMatrix.length,
    size = EdgeMatrix.length;

  var adjustSizes = options.adjustSizes;

  var thetaSquared = options.barnesHutTheta * options.barnesHutTheta;

  var outboundAttCompensation, coefficient, xDist, yDist, ewc, distance, factor;

  var RegionMatrix = [];

  // 1) Initializing layout data
  //-----------------------------

  // Resetting positions & computing max values
  for (n = 0; n < order; n += PPN) {
    NodeMatrix[n + NODE_OLD_DX] = NodeMatrix[n + NODE_DX];
    NodeMatrix[n + NODE_OLD_DY] = NodeMatrix[n + NODE_DY];
    NodeMatrix[n + NODE_DX] = 0;
    NodeMatrix[n + NODE_DY] = 0;
  }

  // If outbound attraction distribution, compensate
  if (options.outboundAttractionDistribution) {
    outboundAttCompensation = 0;
    for (n = 0; n < order; n += PPN) {
      outboundAttCompensation += NodeMatrix[n + NODE_MASS];
    }

    outboundAttCompensation /= order / PPN;
  }

  // 1.bis) Barnes-Hut computation
  //------------------------------

  if (options.barnesHutOptimize) {
    // Setting up
    var minX = Infinity,
      maxX = -Infinity,
      minY = Infinity,
      maxY = -Infinity,
      q,
      q2,
      subdivisionAttempts;

    // Computing min and max values
    for (n = 0; n < order; n += PPN) {
      minX = Math.min(minX, NodeMatrix[n + NODE_X]);
      maxX = Math.max(maxX, NodeMatrix[n + NODE_X]);
      minY = Math.min(minY, NodeMatrix[n + NODE_Y]);
      maxY = Math.max(maxY, NodeMatrix[n + NODE_Y]);
    }

    // squarify bounds, it's a quadtree
    var dx = maxX - minX,
      dy = maxY - minY;
    if (dx > dy) {
      minY -= (dx - dy) / 2;
      maxY = minY + dx;
    } else {
      minX -= (dy - dx) / 2;
      maxX = minX + dy;
    }

    // Build the Barnes Hut root region
    RegionMatrix[0 + REGION_NODE] = -1;
    RegionMatrix[0 + REGION_CENTER_X] = (minX + maxX) / 2;
    RegionMatrix[0 + REGION_CENTER_Y] = (minY + maxY) / 2;
    RegionMatrix[0 + REGION_SIZE] = Math.max(maxX - minX, maxY - minY);
    RegionMatrix[0 + REGION_NEXT_SIBLING] = -1;
    RegionMatrix[0 + REGION_FIRST_CHILD] = -1;
    RegionMatrix[0 + REGION_MASS] = 0;
    RegionMatrix[0 + REGION_MASS_CENTER_X] = 0;
    RegionMatrix[0 + REGION_MASS_CENTER_Y] = 0;

    // Add each node in the tree
    l = 1;
    for (n = 0; n < order; n += PPN) {
      // Current region, starting with root
      r = 0;
      subdivisionAttempts = SUBDIVISION_ATTEMPTS;

      while (true) {
        // Are there sub-regions?

        // We look at first child index
        if (RegionMatrix[r + REGION_FIRST_CHILD] >= 0) {
          // There are sub-regions

          // We just iterate to find a "leaf" of the tree
          // that is an empty region or a region with a single node
          // (see next case)

          // Find the quadrant of n
          if (NodeMatrix[n + NODE_X] < RegionMatrix[r + REGION_CENTER_X]) {
            if (NodeMatrix[n + NODE_Y] < RegionMatrix[r + REGION_CENTER_Y]) {
              // Top Left quarter
              q = RegionMatrix[r + REGION_FIRST_CHILD];
            } else {
              // Bottom Left quarter
              q = RegionMatrix[r + REGION_FIRST_CHILD] + PPR;
            }
          } else {
            if (NodeMatrix[n + NODE_Y] < RegionMatrix[r + REGION_CENTER_Y]) {
              // Top Right quarter
              q = RegionMatrix[r + REGION_FIRST_CHILD] + PPR * 2;
            } else {
              // Bottom Right quarter
              q = RegionMatrix[r + REGION_FIRST_CHILD] + PPR * 3;
            }
          }

          // Update center of mass and mass (we only do it for non-leave regions)
          RegionMatrix[r + REGION_MASS_CENTER_X] =
            (RegionMatrix[r + REGION_MASS_CENTER_X] *
              RegionMatrix[r + REGION_MASS] +
              NodeMatrix[n + NODE_X] * NodeMatrix[n + NODE_MASS]) /
            (RegionMatrix[r + REGION_MASS] + NodeMatrix[n + NODE_MASS]);

          RegionMatrix[r + REGION_MASS_CENTER_Y] =
            (RegionMatrix[r + REGION_MASS_CENTER_Y] *
              RegionMatrix[r + REGION_MASS] +
              NodeMatrix[n + NODE_Y] * NodeMatrix[n + NODE_MASS]) /
            (RegionMatrix[r + REGION_MASS] + NodeMatrix[n + NODE_MASS]);

          RegionMatrix[r + REGION_MASS] += NodeMatrix[n + NODE_MASS];

          // Iterate on the right quadrant
          r = q;
          continue;
        } else {
          // There are no sub-regions: we are in a "leaf"

          // Is there a node in this leave?
          if (RegionMatrix[r + REGION_NODE] < 0) {
            // There is no node in region:
            // we record node n and go on
            RegionMatrix[r + REGION_NODE] = n;
            break;
          } else {
            // There is a node in this region

            // We will need to create sub-regions, stick the two
            // nodes (the old one r[0] and the new one n) in two
            // subregions. If they fall in the same quadrant,
            // we will iterate.

            // Create sub-regions
            RegionMatrix[r + REGION_FIRST_CHILD] = l * PPR;
            w = RegionMatrix[r + REGION_SIZE] / 2; // new size (half)

            // NOTE: we use screen coordinates
            // from Top Left to Bottom Right

            // Top Left sub-region
            g = RegionMatrix[r + REGION_FIRST_CHILD];

            RegionMatrix[g + REGION_NODE] = -1;
            RegionMatrix[g + REGION_CENTER_X] =
              RegionMatrix[r + REGION_CENTER_X] - w;
            RegionMatrix[g + REGION_CENTER_Y] =
              RegionMatrix[r + REGION_CENTER_Y] - w;
            RegionMatrix[g + REGION_SIZE] = w;
            RegionMatrix[g + REGION_NEXT_SIBLING] = g + PPR;
            RegionMatrix[g + REGION_FIRST_CHILD] = -1;
            RegionMatrix[g + REGION_MASS] = 0;
            RegionMatrix[g + REGION_MASS_CENTER_X] = 0;
            RegionMatrix[g + REGION_MASS_CENTER_Y] = 0;

            // Bottom Left sub-region
            g += PPR;
            RegionMatrix[g + REGION_NODE] = -1;
            RegionMatrix[g + REGION_CENTER_X] =
              RegionMatrix[r + REGION_CENTER_X] - w;
            RegionMatrix[g + REGION_CENTER_Y] =
              RegionMatrix[r + REGION_CENTER_Y] + w;
            RegionMatrix[g + REGION_SIZE] = w;
            RegionMatrix[g + REGION_NEXT_SIBLING] = g + PPR;
            RegionMatrix[g + REGION_FIRST_CHILD] = -1;
            RegionMatrix[g + REGION_MASS] = 0;
            RegionMatrix[g + REGION_MASS_CENTER_X] = 0;
            RegionMatrix[g + REGION_MASS_CENTER_Y] = 0;

            // Top Right sub-region
            g += PPR;
            RegionMatrix[g + REGION_NODE] = -1;
            RegionMatrix[g + REGION_CENTER_X] =
              RegionMatrix[r + REGION_CENTER_X] + w;
            RegionMatrix[g + REGION_CENTER_Y] =
              RegionMatrix[r + REGION_CENTER_Y] - w;
            RegionMatrix[g + REGION_SIZE] = w;
            RegionMatrix[g + REGION_NEXT_SIBLING] = g + PPR;
            RegionMatrix[g + REGION_FIRST_CHILD] = -1;
            RegionMatrix[g + REGION_MASS] = 0;
            RegionMatrix[g + REGION_MASS_CENTER_X] = 0;
            RegionMatrix[g + REGION_MASS_CENTER_Y] = 0;

            // Bottom Right sub-region
            g += PPR;
            RegionMatrix[g + REGION_NODE] = -1;
            RegionMatrix[g + REGION_CENTER_X] =
              RegionMatrix[r + REGION_CENTER_X] + w;
            RegionMatrix[g + REGION_CENTER_Y] =
              RegionMatrix[r + REGION_CENTER_Y] + w;
            RegionMatrix[g + REGION_SIZE] = w;
            RegionMatrix[g + REGION_NEXT_SIBLING] =
              RegionMatrix[r + REGION_NEXT_SIBLING];
            RegionMatrix[g + REGION_FIRST_CHILD] = -1;
            RegionMatrix[g + REGION_MASS] = 0;
            RegionMatrix[g + REGION_MASS_CENTER_X] = 0;
            RegionMatrix[g + REGION_MASS_CENTER_Y] = 0;

            l += 4;

            // Now the goal is to find two different sub-regions
            // for the two nodes: the one previously recorded (r[0])
            // and the one we want to add (n)

            // Find the quadrant of the old node
            if (
              NodeMatrix[RegionMatrix[r + REGION_NODE] + NODE_X] <
              RegionMatrix[r + REGION_CENTER_X]
            ) {
              if (
                NodeMatrix[RegionMatrix[r + REGION_NODE] + NODE_Y] <
                RegionMatrix[r + REGION_CENTER_Y]
              ) {
                // Top Left quarter
                q = RegionMatrix[r + REGION_FIRST_CHILD];
              } else {
                // Bottom Left quarter
                q = RegionMatrix[r + REGION_FIRST_CHILD] + PPR;
              }
            } else {
              if (
                NodeMatrix[RegionMatrix[r + REGION_NODE] + NODE_Y] <
                RegionMatrix[r + REGION_CENTER_Y]
              ) {
                // Top Right quarter
                q = RegionMatrix[r + REGION_FIRST_CHILD] + PPR * 2;
              } else {
                // Bottom Right quarter
                q = RegionMatrix[r + REGION_FIRST_CHILD] + PPR * 3;
              }
            }

            // We remove r[0] from the region r, add its mass to r and record it in q
            RegionMatrix[r + REGION_MASS] =
              NodeMatrix[RegionMatrix[r + REGION_NODE] + NODE_MASS];
            RegionMatrix[r + REGION_MASS_CENTER_X] =
              NodeMatrix[RegionMatrix[r + REGION_NODE] + NODE_X];
            RegionMatrix[r + REGION_MASS_CENTER_Y] =
              NodeMatrix[RegionMatrix[r + REGION_NODE] + NODE_Y];

            RegionMatrix[q + REGION_NODE] = RegionMatrix[r + REGION_NODE];
            RegionMatrix[r + REGION_NODE] = -1;

            // Find the quadrant of n
            if (NodeMatrix[n + NODE_X] < RegionMatrix[r + REGION_CENTER_X]) {
              if (NodeMatrix[n + NODE_Y] < RegionMatrix[r + REGION_CENTER_Y]) {
                // Top Left quarter
                q2 = RegionMatrix[r + REGION_FIRST_CHILD];
              } else {
                // Bottom Left quarter
                q2 = RegionMatrix[r + REGION_FIRST_CHILD] + PPR;
              }
            } else {
              if (NodeMatrix[n + NODE_Y] < RegionMatrix[r + REGION_CENTER_Y]) {
                // Top Right quarter
                q2 = RegionMatrix[r + REGION_FIRST_CHILD] + PPR * 2;
              } else {
                // Bottom Right quarter
                q2 = RegionMatrix[r + REGION_FIRST_CHILD] + PPR * 3;
              }
            }

            if (q === q2) {
              // If both nodes are in the same quadrant,
              // we have to try it again on this quadrant
              if (subdivisionAttempts--) {
                r = q;
                continue; // while
              } else {
                // we are out of precision here, and we cannot subdivide anymore
                // but we have to break the loop anyway
                subdivisionAttempts = SUBDIVISION_ATTEMPTS;
                break; // while
              }
            }

            // If both quadrants are different, we record n
            // in its quadrant
            RegionMatrix[q2 + REGION_NODE] = n;
            break;
          }
        }
      }
    }
  }

  // 2) Repulsion
  //--------------
  // NOTES: adjustSizes = antiCollision & scalingRatio = coefficient

  if (options.barnesHutOptimize) {
    coefficient = options.scalingRatio;

    // Applying repulsion through regions
    for (n = 0; n < order; n += PPN) {
      // Computing leaf quad nodes iteration

      r = 0; // Starting with root region
      while (true) {
        if (RegionMatrix[r + REGION_FIRST_CHILD] >= 0) {
          // The region has sub-regions

          // We run the Barnes Hut test to see if we are at the right distance
          distance =
            Math.pow(
              NodeMatrix[n + NODE_X] - RegionMatrix[r + REGION_MASS_CENTER_X],
              2
            ) +
            Math.pow(
              NodeMatrix[n + NODE_Y] - RegionMatrix[r + REGION_MASS_CENTER_Y],
              2
            );

          s = RegionMatrix[r + REGION_SIZE];

          if ((4 * s * s) / distance < thetaSquared) {
            // We treat the region as a single body, and we repulse

            xDist =
              NodeMatrix[n + NODE_X] - RegionMatrix[r + REGION_MASS_CENTER_X];
            yDist =
              NodeMatrix[n + NODE_Y] - RegionMatrix[r + REGION_MASS_CENTER_Y];

            if (adjustSizes === true) {
              //-- Linear Anti-collision Repulsion
              if (distance > 0) {
                factor =
                  (coefficient *
                    NodeMatrix[n + NODE_MASS] *
                    RegionMatrix[r + REGION_MASS]) /
                  distance;

                NodeMatrix[n + NODE_DX] += xDist * factor;
                NodeMatrix[n + NODE_DY] += yDist * factor;
              } else if (distance < 0) {
                factor =
                  (-coefficient *
                    NodeMatrix[n + NODE_MASS] *
                    RegionMatrix[r + REGION_MASS]) /
                  Math.sqrt(distance);

                NodeMatrix[n + NODE_DX] += xDist * factor;
                NodeMatrix[n + NODE_DY] += yDist * factor;
              }
            } else {
              //-- Linear Repulsion
              if (distance > 0) {
                factor =
                  (coefficient *
                    NodeMatrix[n + NODE_MASS] *
                    RegionMatrix[r + REGION_MASS]) /
                  distance;

                NodeMatrix[n + NODE_DX] += xDist * factor;
                NodeMatrix[n + NODE_DY] += yDist * factor;
              }
            }

            // When this is done, we iterate. We have to look at the next sibling.
            r = RegionMatrix[r + REGION_NEXT_SIBLING];
            if (r < 0) break; // No next sibling: we have finished the tree

            continue;
          } else {
            // The region is too close and we have to look at sub-regions
            r = RegionMatrix[r + REGION_FIRST_CHILD];
            continue;
          }
        } else {
          // The region has no sub-region
          // If there is a node r[0] and it is not n, then repulse
          rn = RegionMatrix[r + REGION_NODE];

          if (rn >= 0 && rn !== n) {
            xDist = NodeMatrix[n + NODE_X] - NodeMatrix[rn + NODE_X];
            yDist = NodeMatrix[n + NODE_Y] - NodeMatrix[rn + NODE_Y];

            distance = xDist * xDist + yDist * yDist;

            if (adjustSizes === true) {
              //-- Linear Anti-collision Repulsion
              if (distance > 0) {
                factor =
                  (coefficient *
                    NodeMatrix[n + NODE_MASS] *
                    NodeMatrix[rn + NODE_MASS]) /
                  distance;

                NodeMatrix[n + NODE_DX] += xDist * factor;
                NodeMatrix[n + NODE_DY] += yDist * factor;
              } else if (distance < 0) {
                factor =
                  (-coefficient *
                    NodeMatrix[n + NODE_MASS] *
                    NodeMatrix[rn + NODE_MASS]) /
                  Math.sqrt(distance);

                NodeMatrix[n + NODE_DX] += xDist * factor;
                NodeMatrix[n + NODE_DY] += yDist * factor;
              }
            } else {
              //-- Linear Repulsion
              if (distance > 0) {
                factor =
                  (coefficient *
                    NodeMatrix[n + NODE_MASS] *
                    NodeMatrix[rn + NODE_MASS]) /
                  distance;

                NodeMatrix[n + NODE_DX] += xDist * factor;
                NodeMatrix[n + NODE_DY] += yDist * factor;
              }
            }
          }

          // When this is done, we iterate. We have to look at the next sibling.
          r = RegionMatrix[r + REGION_NEXT_SIBLING];

          if (r < 0) break; // No next sibling: we have finished the tree

          continue;
        }
      }
    }
  } else {
    coefficient = options.scalingRatio;

    // Square iteration
    for (n1 = 0; n1 < order; n1 += PPN) {
      for (n2 = 0; n2 < n1; n2 += PPN) {
        // Common to both methods
        xDist = NodeMatrix[n1 + NODE_X] - NodeMatrix[n2 + NODE_X];
        yDist = NodeMatrix[n1 + NODE_Y] - NodeMatrix[n2 + NODE_Y];

        if (adjustSizes === true) {
          //-- Anticollision Linear Repulsion
          distance =
            Math.sqrt(xDist * xDist + yDist * yDist) -
            NodeMatrix[n1 + NODE_SIZE] -
            NodeMatrix[n2 + NODE_SIZE];

          if (distance > 0) {
            factor =
              (coefficient *
                NodeMatrix[n1 + NODE_MASS] *
                NodeMatrix[n2 + NODE_MASS]) /
              distance /
              distance;

            // Updating nodes' dx and dy
            NodeMatrix[n1 + NODE_DX] += xDist * factor;
            NodeMatrix[n1 + NODE_DY] += yDist * factor;

            NodeMatrix[n2 + NODE_DX] += xDist * factor;
            NodeMatrix[n2 + NODE_DY] += yDist * factor;
          } else if (distance < 0) {
            factor =
              100 *
              coefficient *
              NodeMatrix[n1 + NODE_MASS] *
              NodeMatrix[n2 + NODE_MASS];

            // Updating nodes' dx and dy
            NodeMatrix[n1 + NODE_DX] += xDist * factor;
            NodeMatrix[n1 + NODE_DY] += yDist * factor;

            NodeMatrix[n2 + NODE_DX] -= xDist * factor;
            NodeMatrix[n2 + NODE_DY] -= yDist * factor;
          }
        } else {
          //-- Linear Repulsion
          distance = Math.sqrt(xDist * xDist + yDist * yDist);

          if (distance > 0) {
            factor =
              (coefficient *
                NodeMatrix[n1 + NODE_MASS] *
                NodeMatrix[n2 + NODE_MASS]) /
              distance /
              distance;

            // Updating nodes' dx and dy
            NodeMatrix[n1 + NODE_DX] += xDist * factor;
            NodeMatrix[n1 + NODE_DY] += yDist * factor;

            NodeMatrix[n2 + NODE_DX] -= xDist * factor;
            NodeMatrix[n2 + NODE_DY] -= yDist * factor;
          }
        }
      }
    }
  }

  // 3) Gravity
  //------------
  g = options.gravity / options.scalingRatio;
  coefficient = options.scalingRatio;
  for (n = 0; n < order; n += PPN) {
    factor = 0;

    // Common to both methods
    xDist = NodeMatrix[n + NODE_X];
    yDist = NodeMatrix[n + NODE_Y];
    distance = Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));

    if (options.strongGravityMode) {
      //-- Strong gravity
      if (distance > 0) factor = coefficient * NodeMatrix[n + NODE_MASS] * g;
    } else {
      //-- Linear Anti-collision Repulsion n
      if (distance > 0)
        factor = (coefficient * NodeMatrix[n + NODE_MASS] * g) / distance;
    }

    // Updating node's dx and dy
    NodeMatrix[n + NODE_DX] -= xDist * factor;
    NodeMatrix[n + NODE_DY] -= yDist * factor;
  }

  // 4) Attraction
  //---------------
  coefficient =
    1 * (options.outboundAttractionDistribution ? outboundAttCompensation : 1);

  // TODO: simplify distance
  // TODO: coefficient is always used as -c --> optimize?
  for (e = 0; e < size; e += PPE) {
    n1 = EdgeMatrix[e + EDGE_SOURCE];
    n2 = EdgeMatrix[e + EDGE_TARGET];
    w = EdgeMatrix[e + EDGE_WEIGHT];

    // Edge weight influence
    ewc = Math.pow(w, options.edgeWeightInfluence);

    // Common measures
    xDist = NodeMatrix[n1 + NODE_X] - NodeMatrix[n2 + NODE_X];
    yDist = NodeMatrix[n1 + NODE_Y] - NodeMatrix[n2 + NODE_Y];

    // Applying attraction to nodes
    if (adjustSizes === true) {
      distance = Math.sqrt(
        Math.pow(xDist, 2) +
          Math.pow(yDist, 2) -
          NodeMatrix[n1 + NODE_SIZE] -
          NodeMatrix[n2 + NODE_SIZE]
      );

      if (options.linLogMode) {
        if (options.outboundAttractionDistribution) {
          //-- LinLog Degree Distributed Anti-collision Attraction
          if (distance > 0) {
            factor =
              (-coefficient * ewc * Math.log(1 + distance)) /
              distance /
              NodeMatrix[n1 + NODE_MASS];
          }
        } else {
          //-- LinLog Anti-collision Attraction
          if (distance > 0) {
            factor = (-coefficient * ewc * Math.log(1 + distance)) / distance;
          }
        }
      } else {
        if (options.outboundAttractionDistribution) {
          //-- Linear Degree Distributed Anti-collision Attraction
          if (distance > 0) {
            factor = (-coefficient * ewc) / NodeMatrix[n1 + NODE_MASS];
          }
        } else {
          //-- Linear Anti-collision Attraction
          if (distance > 0) {
            factor = -coefficient * ewc;
          }
        }
      }
    } else {
      distance = Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));

      if (options.linLogMode) {
        if (options.outboundAttractionDistribution) {
          //-- LinLog Degree Distributed Attraction
          if (distance > 0) {
            factor =
              (-coefficient * ewc * Math.log(1 + distance)) /
              distance /
              NodeMatrix[n1 + NODE_MASS];
          }
        } else {
          //-- LinLog Attraction
          if (distance > 0)
            factor = (-coefficient * ewc * Math.log(1 + distance)) / distance;
        }
      } else {
        if (options.outboundAttractionDistribution) {
          //-- Linear Attraction Mass Distributed
          // NOTE: Distance is set to 1 to override next condition
          distance = 1;
          factor = (-coefficient * ewc) / NodeMatrix[n1 + NODE_MASS];
        } else {
          //-- Linear Attraction
          // NOTE: Distance is set to 1 to override next condition
          distance = 1;
          factor = -coefficient * ewc;
        }
      }
    }

    // Updating nodes' dx and dy
    // TODO: if condition or factor = 1?
    if (distance > 0) {
      // Updating nodes' dx and dy
      NodeMatrix[n1 + NODE_DX] += xDist * factor;
      NodeMatrix[n1 + NODE_DY] += yDist * factor;

      NodeMatrix[n2 + NODE_DX] -= xDist * factor;
      NodeMatrix[n2 + NODE_DY] -= yDist * factor;
    }
  }

  // 5) Apply Forces
  //-----------------
  var force, swinging, traction, nodespeed, newX, newY;

  // MATH: sqrt and square distances
  if (adjustSizes === true) {
    for (n = 0; n < order; n += PPN) {
      if (NodeMatrix[n + NODE_FIXED] !== 1) {
        force = Math.sqrt(
          Math.pow(NodeMatrix[n + NODE_DX], 2) +
            Math.pow(NodeMatrix[n + NODE_DY], 2)
        );

        if (force > MAX_FORCE) {
          NodeMatrix[n + NODE_DX] =
            (NodeMatrix[n + NODE_DX] * MAX_FORCE) / force;
          NodeMatrix[n + NODE_DY] =
            (NodeMatrix[n + NODE_DY] * MAX_FORCE) / force;
        }

        swinging =
          NodeMatrix[n + NODE_MASS] *
          Math.sqrt(
            (NodeMatrix[n + NODE_OLD_DX] - NodeMatrix[n + NODE_DX]) *
              (NodeMatrix[n + NODE_OLD_DX] - NodeMatrix[n + NODE_DX]) +
              (NodeMatrix[n + NODE_OLD_DY] - NodeMatrix[n + NODE_DY]) *
                (NodeMatrix[n + NODE_OLD_DY] - NodeMatrix[n + NODE_DY])
          );

        traction =
          Math.sqrt(
            (NodeMatrix[n + NODE_OLD_DX] + NodeMatrix[n + NODE_DX]) *
              (NodeMatrix[n + NODE_OLD_DX] + NodeMatrix[n + NODE_DX]) +
              (NodeMatrix[n + NODE_OLD_DY] + NodeMatrix[n + NODE_DY]) *
                (NodeMatrix[n + NODE_OLD_DY] + NodeMatrix[n + NODE_DY])
          ) / 2;

        nodespeed = (0.1 * Math.log(1 + traction)) / (1 + Math.sqrt(swinging));

        // Updating node's positon
        newX =
          NodeMatrix[n + NODE_X] +
          NodeMatrix[n + NODE_DX] * (nodespeed / options.slowDown);
        NodeMatrix[n + NODE_X] = newX;

        newY =
          NodeMatrix[n + NODE_Y] +
          NodeMatrix[n + NODE_DY] * (nodespeed / options.slowDown);
        NodeMatrix[n + NODE_Y] = newY;
      }
    }
  } else {
    for (n = 0; n < order; n += PPN) {
      if (NodeMatrix[n + NODE_FIXED] !== 1) {
        swinging =
          NodeMatrix[n + NODE_MASS] *
          Math.sqrt(
            (NodeMatrix[n + NODE_OLD_DX] - NodeMatrix[n + NODE_DX]) *
              (NodeMatrix[n + NODE_OLD_DX] - NodeMatrix[n + NODE_DX]) +
              (NodeMatrix[n + NODE_OLD_DY] - NodeMatrix[n + NODE_DY]) *
                (NodeMatrix[n + NODE_OLD_DY] - NodeMatrix[n + NODE_DY])
          );

        traction =
          Math.sqrt(
            (NodeMatrix[n + NODE_OLD_DX] + NodeMatrix[n + NODE_DX]) *
              (NodeMatrix[n + NODE_OLD_DX] + NodeMatrix[n + NODE_DX]) +
              (NodeMatrix[n + NODE_OLD_DY] + NodeMatrix[n + NODE_DY]) *
                (NodeMatrix[n + NODE_OLD_DY] + NodeMatrix[n + NODE_DY])
          ) / 2;

        nodespeed =
          (NodeMatrix[n + NODE_CONVERGENCE] * Math.log(1 + traction)) /
          (1 + Math.sqrt(swinging));

        // Updating node convergence
        NodeMatrix[n + NODE_CONVERGENCE] = Math.min(
          1,
          Math.sqrt(
            (nodespeed *
              (Math.pow(NodeMatrix[n + NODE_DX], 2) +
                Math.pow(NodeMatrix[n + NODE_DY], 2))) /
              (1 + Math.sqrt(swinging))
          )
        );

        // Updating node's positon
        newX =
          NodeMatrix[n + NODE_X] +
          NodeMatrix[n + NODE_DX] * (nodespeed / options.slowDown);
        NodeMatrix[n + NODE_X] = newX;

        newY =
          NodeMatrix[n + NODE_Y] +
          NodeMatrix[n + NODE_DY] * (nodespeed / options.slowDown);
        NodeMatrix[n + NODE_Y] = newY;
      }
    }
  }

  // We return the information about the layout (no need to return the matrices)
  return {};
};

},{}],29:[function(require,module,exports){
/**
 * Graphology CirclePack Layout
 * =============================
 *
 * Circlepack layout from d3-hierarchy/gephi.
 */
var resolveDefaults = require('graphology-utils/defaults');
var isGraph = require('graphology-utils/is-graph');
var shuffle = require('pandemonium/shuffle-in-place');

/**
 * Default options.
 */
var DEFAULTS = {
  attributes: {
    x: 'x',
    y: 'y'
  },
  center: 0,
  hierarchyAttributes: [],
  rng: Math.random,
  scale: 1
};

/**
 * Helpers.
 */
function CircleWrap(id, x, y, r, circleWrap) {
  this.wrappedCircle = circleWrap || null; //hacky d3 reference thing

  this.children = {};
  this.countChildren = 0;
  this.id = id || null;
  this.next = null;
  this.previous = null;

  this.x = x || null;
  this.y = y || null;
  if (circleWrap) this.r = 1010101;
  // for debugging purposes - should not be used in this case
  else this.r = r || 999;
}

CircleWrap.prototype.hasChildren = function () {
  return this.countChildren > 0;
};

CircleWrap.prototype.addChild = function (id, child) {
  this.children[id] = child;
  ++this.countChildren;
};

CircleWrap.prototype.getChild = function (id) {
  if (!this.children.hasOwnProperty(id)) {
    var circleWrap = new CircleWrap();
    this.children[id] = circleWrap;
    ++this.countChildren;
  }
  return this.children[id];
};

CircleWrap.prototype.applyPositionToChildren = function () {
  if (this.hasChildren()) {
    var root = this; // using 'this' in Object.keys.forEach seems a bad idea
    for (var key in root.children) {
      var child = root.children[key];
      child.x += root.x;
      child.y += root.y;
      child.applyPositionToChildren();
    }
  }
};

function setNode(/*Graph*/ graph, /*CircleWrap*/ parentCircle, /*Map*/ posMap) {
  for (var key in parentCircle.children) {
    var circle = parentCircle.children[key];
    if (circle.hasChildren()) {
      setNode(graph, circle, posMap);
    } else {
      posMap[circle.id] = {x: circle.x, y: circle.y};
    }
  }
}

function enclosesNot(/*CircleWrap*/ a, /*CircleWrap*/ b) {
  var dr = a.r - b.r;
  var dx = b.x - a.x;
  var dy = b.y - a.y;
  return dr < 0 || dr * dr < dx * dx + dy * dy;
}

function enclosesWeak(/*CircleWrap*/ a, /*CircleWrap*/ b) {
  var dr = a.r - b.r + 1e-6;
  var dx = b.x - a.x;
  var dy = b.y - a.y;
  return dr > 0 && dr * dr > dx * dx + dy * dy;
}

function enclosesWeakAll(/*CircleWrap*/ a, /*Array<CircleWrap>*/ B) {
  for (var i = 0; i < B.length; ++i) {
    if (!enclosesWeak(a, B[i])) {
      return false;
    }
  }
  return true;
}

function encloseBasis1(/*CircleWrap*/ a) {
  return new CircleWrap(null, a.x, a.y, a.r);
}

function encloseBasis2(/*CircleWrap*/ a, /*CircleWrap*/ b) {
  var x1 = a.x,
    y1 = a.y,
    r1 = a.r,
    x2 = b.x,
    y2 = b.y,
    r2 = b.r,
    x21 = x2 - x1,
    y21 = y2 - y1,
    r21 = r2 - r1,
    l = Math.sqrt(x21 * x21 + y21 * y21);
  return new CircleWrap(
    null,
    (x1 + x2 + (x21 / l) * r21) / 2,
    (y1 + y2 + (y21 / l) * r21) / 2,
    (l + r1 + r2) / 2
  );
}

function encloseBasis3(/*CircleWrap*/ a, /*CircleWrap*/ b, /*CircleWrap*/ c) {
  var x1 = a.x,
    y1 = a.y,
    r1 = a.r,
    x2 = b.x,
    y2 = b.y,
    r2 = b.r,
    x3 = c.x,
    y3 = c.y,
    r3 = c.r,
    a2 = x1 - x2,
    a3 = x1 - x3,
    b2 = y1 - y2,
    b3 = y1 - y3,
    c2 = r2 - r1,
    c3 = r3 - r1,
    d1 = x1 * x1 + y1 * y1 - r1 * r1,
    d2 = d1 - x2 * x2 - y2 * y2 + r2 * r2,
    d3 = d1 - x3 * x3 - y3 * y3 + r3 * r3,
    ab = a3 * b2 - a2 * b3,
    xa = (b2 * d3 - b3 * d2) / (ab * 2) - x1,
    xb = (b3 * c2 - b2 * c3) / ab,
    ya = (a3 * d2 - a2 * d3) / (ab * 2) - y1,
    yb = (a2 * c3 - a3 * c2) / ab,
    A = xb * xb + yb * yb - 1,
    B = 2 * (r1 + xa * xb + ya * yb),
    C = xa * xa + ya * ya - r1 * r1,
    r = -(A ? (B + Math.sqrt(B * B - 4 * A * C)) / (2 * A) : C / B);
  return new CircleWrap(null, x1 + xa + xb * r, y1 + ya + yb * r, r);
}

function encloseBasis(/*Array<CircleWrap>*/ B) {
  switch (B.length) {
    case 1:
      return encloseBasis1(B[0]);
    case 2:
      return encloseBasis2(B[0], B[1]);
    case 3:
      return encloseBasis3(B[0], B[1], B[2]);
    default:
      throw new Error(
        'graphology-layout/circlepack: Invalid basis length ' + B.length
      );
  }
}

function extendBasis(/*Array<CircleWrap>*/ B, /*CircleWrap*/ p) {
  var i, j;

  if (enclosesWeakAll(p, B)) return [p];

  // If we get here then B must have at least one element.
  for (i = 0; i < B.length; ++i) {
    if (enclosesNot(p, B[i]) && enclosesWeakAll(encloseBasis2(B[i], p), B)) {
      return [B[i], p];
    }
  }

  // If we get here then B must have at least two elements.
  for (i = 0; i < B.length - 1; ++i) {
    for (j = i + 1; j < B.length; ++j) {
      if (
        enclosesNot(encloseBasis2(B[i], B[j]), p) &&
        enclosesNot(encloseBasis2(B[i], p), B[j]) &&
        enclosesNot(encloseBasis2(B[j], p), B[i]) &&
        enclosesWeakAll(encloseBasis3(B[i], B[j], p), B)
      ) {
        return [B[i], B[j], p];
      }
    }
  }

  // If we get here then something is very wrong.
  throw new Error('graphology-layout/circlepack: extendBasis failure !');
}

function score(/*CircleWrap*/ node) {
  var a = node.wrappedCircle;
  var b = node.next.wrappedCircle;
  var ab = a.r + b.r;
  var dx = (a.x * b.r + b.x * a.r) / ab;
  var dy = (a.y * b.r + b.y * a.r) / ab;
  return dx * dx + dy * dy;
}

function enclose(circles, shuffleFunc) {
  var i = 0;
  var circlesLoc = circles.slice();

  var n = circles.length;
  var B = [];
  var p;
  var e;
  shuffleFunc(circlesLoc);
  while (i < n) {
    p = circlesLoc[i];
    if (e && enclosesWeak(e, p)) {
      ++i;
    } else {
      B = extendBasis(B, p);
      e = encloseBasis(B);
      i = 0;
    }
  }
  return e;
}

function place(/*CircleWrap*/ b, /*CircleWrap*/ a, /*CircleWrap*/ c) {
  var dx = b.x - a.x,
    x,
    a2,
    dy = b.y - a.y,
    y,
    b2,
    d2 = dx * dx + dy * dy;
  if (d2) {
    a2 = a.r + c.r;
    a2 *= a2;
    b2 = b.r + c.r;
    b2 *= b2;
    if (a2 > b2) {
      x = (d2 + b2 - a2) / (2 * d2);
      y = Math.sqrt(Math.max(0, b2 / d2 - x * x));
      c.x = b.x - x * dx - y * dy;
      c.y = b.y - x * dy + y * dx;
    } else {
      x = (d2 + a2 - b2) / (2 * d2);
      y = Math.sqrt(Math.max(0, a2 / d2 - x * x));
      c.x = a.x + x * dx - y * dy;
      c.y = a.y + x * dy + y * dx;
    }
  } else {
    c.x = a.x + c.r;
    c.y = a.y;
  }
}

function intersects(/*CircleWrap*/ a, /*CircleWrap*/ b) {
  var dr = a.r + b.r - 1e-6,
    dx = b.x - a.x,
    dy = b.y - a.y;
  return dr > 0 && dr * dr > dx * dx + dy * dy;
}

function packEnclose(/*Array<CircleWrap>*/ circles, shuffleFunc) {
  var n = circles.length;
  if (n === 0) return 0;

  var a, b, c, aa, ca, i, j, k, sj, sk;

  // Place the first circle.
  a = circles[0];
  a.x = 0;
  a.y = 0;
  if (n <= 1) return a.r;

  // Place the second circle.
  b = circles[1];
  a.x = -b.r;
  b.x = a.r;
  b.y = 0;
  if (n <= 2) return a.r + b.r;

  // Place the third circle.
  c = circles[2];
  place(b, a, c);

  // Initialize the front-chain using the first three circles a, b and c.
  a = new CircleWrap(null, null, null, null, a);
  b = new CircleWrap(null, null, null, null, b);
  c = new CircleWrap(null, null, null, null, c);
  a.next = c.previous = b;
  b.next = a.previous = c;
  c.next = b.previous = a;

  // Attempt to place each remaining circle…
  pack: for (i = 3; i < n; ++i) {
    c = circles[i];
    place(a.wrappedCircle, b.wrappedCircle, c);
    c = new CircleWrap(null, null, null, null, c);

    // Find the closest intersecting circle on the front-chain, if any.
    // “Closeness” is determined by linear distance along the front-chain.
    // “Ahead” or “behind” is likewise determined by linear distance.
    j = b.next;
    k = a.previous;
    sj = b.wrappedCircle.r;
    sk = a.wrappedCircle.r;
    do {
      if (sj <= sk) {
        if (intersects(j.wrappedCircle, c.wrappedCircle)) {
          b = j;
          a.next = b;
          b.previous = a;
          --i;
          continue pack;
        }
        sj += j.wrappedCircle.r;
        j = j.next;
      } else {
        if (intersects(k.wrappedCircle, c.wrappedCircle)) {
          a = k;
          a.next = b;
          b.previous = a;
          --i;
          continue pack;
        }
        sk += k.wrappedCircle.r;
        k = k.previous;
      }
    } while (j !== k.next);

    // Success! Insert the new circle c between a and b.
    c.previous = a;
    c.next = b;
    a.next = b.previous = b = c;

    // Compute the new closest circle pair to the centroid.
    aa = score(a);
    while ((c = c.next) !== b) {
      if ((ca = score(c)) < aa) {
        a = c;
        aa = ca;
      }
    }
    b = a.next;
  }

  // Compute the enclosing circle of the front chain.
  a = [b.wrappedCircle];
  c = b;
  var safety = 10000;
  while ((c = c.next) !== b) {
    if (--safety === 0) {
      break;
    }
    a.push(c.wrappedCircle);
  }
  c = enclose(a, shuffleFunc);

  // Translate the circles to put the enclosing circle around the origin.
  for (i = 0; i < n; ++i) {
    a = circles[i];
    a.x -= c.x;
    a.y -= c.y;
  }
  return c.r;
}

function packHierarchy(/*CircleWrap*/ parentCircle, shuffleFunc) {
  var r = 0;
  if (parentCircle.hasChildren()) {
    //pack the children first because the radius is determined by how the children get packed (recursive)
    for (var key in parentCircle.children) {
      var circle = parentCircle.children[key];
      if (circle.hasChildren()) {
        circle.r = packHierarchy(circle, shuffleFunc);
      }
    }
    //now that each circle has a radius set by its children, pack the circles at this level
    r = packEnclose(Object.values(parentCircle.children), shuffleFunc);
  }
  return r;
}

function packHierarchyAndShift(/*CircleWrap*/ parentCircle, shuffleFunc) {
  packHierarchy(parentCircle, shuffleFunc);
  for (var key in parentCircle.children) {
    var circle = parentCircle.children[key];
    circle.applyPositionToChildren();
  }
}

/**
 * Abstract function running the layout.
 *
 * @param  {Graph}    graph                   - Target  graph.
 * @param  {object}   [options]               - Options:
 * @param  {object}     [attributes]          - Attributes names to map.
 * @param  {number}     [center]              - Center of the layout.
 * @param  {string[]}   [hierarchyAttributes] - List of attributes used for the layout in decreasing order.
 * @param  {function}   [rng]                 - Custom RNG function to be used.
 * @param  {number}     [scale]               - Scale of the layout.
 * @return {object}                           - The positions by node.
 */
function genericCirclePackLayout(assign, graph, options) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-layout/circlepack: the given graph is not a valid graphology instance.'
    );

  options = resolveDefaults(options, DEFAULTS);

  var posMap = {},
    positions = {},
    nodes = graph.nodes(),
    center = options.center,
    hierarchyAttributes = options.hierarchyAttributes,
    shuffleFunc = shuffle.createShuffleInPlace(options.rng),
    scale = options.scale;

  var container = new CircleWrap();

  graph.forEachNode(function (key, attributes) {
    var r = attributes.size ? attributes.size : 1;
    var newCircleWrap = new CircleWrap(key, null, null, r);
    var parentContainer = container;

    hierarchyAttributes.forEach(function (v) {
      var attr = attributes[v];
      parentContainer = parentContainer.getChild(attr);
    });

    parentContainer.addChild(key, newCircleWrap);
  });
  packHierarchyAndShift(container, shuffleFunc);
  setNode(graph, container, posMap);
  var l = nodes.length,
    x,
    y,
    i;
  for (i = 0; i < l; i++) {
    var node = nodes[i];

    x = center + scale * posMap[node].x;
    y = center + scale * posMap[node].y;

    positions[node] = {
      x: x,
      y: y
    };

    if (assign) {
      graph.setNodeAttribute(node, options.attributes.x, x);
      graph.setNodeAttribute(node, options.attributes.y, y);
    }
  }
  return positions;
}

var circlePackLayout = genericCirclePackLayout.bind(null, false);
circlePackLayout.assign = genericCirclePackLayout.bind(null, true);

module.exports = circlePackLayout;

},{"graphology-utils/defaults":34,"graphology-utils/is-graph":36,"pandemonium/shuffle-in-place":39}],30:[function(require,module,exports){
/**
 * Graphology Circular Layout
 * ===========================
 *
 * Layout arranging the nodes in a circle.
 */
var resolveDefaults = require('graphology-utils/defaults');
var isGraph = require('graphology-utils/is-graph');

/**
 * Default options.
 */
var DEFAULTS = {
  dimensions: ['x', 'y'],
  center: 0.5,
  scale: 1
};

/**
 * Abstract function running the layout.
 *
 * @param  {Graph}    graph          - Target  graph.
 * @param  {object}   [options]      - Options:
 * @param  {object}     [attributes] - Attributes names to map.
 * @param  {number}     [center]     - Center of the layout.
 * @param  {number}     [scale]      - Scale of the layout.
 * @return {object}                  - The positions by node.
 */
function genericCircularLayout(assign, graph, options) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-layout/random: the given graph is not a valid graphology instance.'
    );

  options = resolveDefaults(options, DEFAULTS);

  var dimensions = options.dimensions;

  if (!Array.isArray(dimensions) || dimensions.length !== 2)
    throw new Error('graphology-layout/random: given dimensions are invalid.');

  var center = options.center;
  var scale = options.scale;
  var tau = Math.PI * 2;

  var offset = (center - 0.5) * scale;
  var l = graph.order;

  var x = dimensions[0];
  var y = dimensions[1];

  function assignPosition(i, target) {
    target[x] = scale * Math.cos((i * tau) / l) + offset;
    target[y] = scale * Math.sin((i * tau) / l) + offset;

    return target;
  }

  var i = 0;

  if (!assign) {
    var positions = {};

    graph.forEachNode(function (node) {
      positions[node] = assignPosition(i++, {});
    });

    return positions;
  }

  graph.updateEachNodeAttributes(
    function (_, attr) {
      assignPosition(i++, attr);
      return attr;
    },
    {
      attributes: dimensions
    }
  );
}

var circularLayout = genericCircularLayout.bind(null, false);
circularLayout.assign = genericCircularLayout.bind(null, true);

module.exports = circularLayout;

},{"graphology-utils/defaults":34,"graphology-utils/is-graph":36}],31:[function(require,module,exports){
/**
 * Graphology Layout
 * ==================
 *
 * Library endpoint.
 */
exports.circlepack = require('./circlepack.js');
exports.circular = require('./circular.js');
exports.random = require('./random.js');
exports.rotation = require('./rotation.js');

},{"./circlepack.js":29,"./circular.js":30,"./random.js":32,"./rotation.js":33}],32:[function(require,module,exports){
/**
 * Graphology Random Layout
 * =========================
 *
 * Simple layout giving uniform random positions to the nodes.
 */
var resolveDefaults = require('graphology-utils/defaults');
var isGraph = require('graphology-utils/is-graph');

/**
 * Default options.
 */
var DEFAULTS = {
  dimensions: ['x', 'y'],
  center: 0.5,
  rng: Math.random,
  scale: 1
};

/**
 * Abstract function running the layout.
 *
 * @param  {Graph}    graph          - Target  graph.
 * @param  {object}   [options]      - Options:
 * @param  {array}      [dimensions] - List of dimensions of the layout.
 * @param  {number}     [center]     - Center of the layout.
 * @param  {function}   [rng]        - Custom RNG function to be used.
 * @param  {number}     [scale]      - Scale of the layout.
 * @return {object}                  - The positions by node.
 */
function genericRandomLayout(assign, graph, options) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-layout/random: the given graph is not a valid graphology instance.'
    );

  options = resolveDefaults(options, DEFAULTS);

  var dimensions = options.dimensions;

  if (!Array.isArray(dimensions) || dimensions.length < 1)
    throw new Error('graphology-layout/random: given dimensions are invalid.');

  var d = dimensions.length;
  var center = options.center;
  var rng = options.rng;
  var scale = options.scale;

  var offset = (center - 0.5) * scale;

  function assignPosition(target) {
    for (var i = 0; i < d; i++) {
      target[dimensions[i]] = rng() * scale + offset;
    }

    return target;
  }

  if (!assign) {
    var positions = {};

    graph.forEachNode(function (node) {
      positions[node] = assignPosition({});
    });

    return positions;
  }

  graph.updateEachNodeAttributes(
    function (_, attr) {
      assignPosition(attr);
      return attr;
    },
    {
      attributes: dimensions
    }
  );
}

var randomLayout = genericRandomLayout.bind(null, false);
randomLayout.assign = genericRandomLayout.bind(null, true);

module.exports = randomLayout;

},{"graphology-utils/defaults":34,"graphology-utils/is-graph":36}],33:[function(require,module,exports){
/**
 * Graphology Rotation Layout Helper
 * ==================================
 *
 * Function rotating the coordinates of the graph.
 */
var resolveDefaults = require('graphology-utils/defaults');
var isGraph = require('graphology-utils/is-graph');

/**
 * Constants.
 */
var RAD_CONVERSION = Math.PI / 180;

/**
 * Default options.
 */
var DEFAULTS = {
  dimensions: ['x', 'y'],
  centeredOnZero: false,
  degrees: false
};

/**
 * Abstract function for rotating a graph's coordinates.
 *
 * @param  {Graph}    graph          - Target  graph.
 * @param  {number}   angle          - Rotation angle.
 * @param  {object}   [options]      - Options.
 * @return {object}                  - The positions by node.
 */
function genericRotation(assign, graph, angle, options) {
  if (!isGraph(graph))
    throw new Error(
      'graphology-layout/rotation: the given graph is not a valid graphology instance.'
    );

  options = resolveDefaults(options, DEFAULTS);

  if (options.degrees) angle *= RAD_CONVERSION;

  var dimensions = options.dimensions;

  if (!Array.isArray(dimensions) || dimensions.length !== 2)
    throw new Error('graphology-layout/random: given dimensions are invalid.');

  // Handling null graph
  if (graph.order === 0) {
    if (assign) return;

    return {};
  }

  var xd = dimensions[0];
  var yd = dimensions[1];

  var xCenter = 0;
  var yCenter = 0;

  if (!options.centeredOnZero) {
    // Finding bounds of the graph
    var xMin = Infinity;
    var xMax = -Infinity;
    var yMin = Infinity;
    var yMax = -Infinity;

    graph.forEachNode(function (node, attr) {
      var x = attr[xd];
      var y = attr[yd];

      if (x < xMin) xMin = x;
      if (x > xMax) xMax = x;
      if (y < yMin) yMin = y;
      if (y > yMax) yMax = y;
    });

    xCenter = (xMin + xMax) / 2;
    yCenter = (yMin + yMax) / 2;
  }

  var cos = Math.cos(angle);
  var sin = Math.sin(angle);

  function assignPosition(target) {
    var x = target[xd];
    var y = target[yd];

    target[xd] = xCenter + (x - xCenter) * cos - (y - yCenter) * sin;
    target[yd] = yCenter + (x - xCenter) * sin + (y - yCenter) * cos;

    return target;
  }

  if (!assign) {
    var positions = {};

    graph.forEachNode(function (node, attr) {
      var o = {};
      o[xd] = attr[xd];
      o[yd] = attr[yd];
      positions[node] = assignPosition(o);
    });

    return positions;
  }

  graph.updateEachNodeAttributes(
    function (_, attr) {
      assignPosition(attr);
      return attr;
    },
    {
      attributes: dimensions
    }
  );
}

var rotation = genericRotation.bind(null, false);
rotation.assign = genericRotation.bind(null, true);

module.exports = rotation;

},{"graphology-utils/defaults":34,"graphology-utils/is-graph":36}],34:[function(require,module,exports){
/**
 * Graphology Defaults
 * ====================
 *
 * Helper function used throughout the standard lib to resolve defaults.
 */
function isLeaf(o) {
  return (
    !o ||
    typeof o !== 'object' ||
    typeof o === 'function' ||
    Array.isArray(o) ||
    o instanceof Set ||
    o instanceof Map ||
    o instanceof RegExp ||
    o instanceof Date
  );
}

function resolveDefaults(target, defaults) {
  target = target || {};

  var output = {};

  for (var k in defaults) {
    var existing = target[k];
    var def = defaults[k];

    // Recursion
    if (!isLeaf(def)) {
      output[k] = resolveDefaults(existing, def);

      continue;
    }

    // Leaf
    if (existing === undefined) {
      output[k] = def;
    } else {
      output[k] = existing;
    }
  }

  return output;
}

module.exports = resolveDefaults;

},{}],35:[function(require,module,exports){
/**
 * Graphology Weight Getter
 * =========================
 *
 * Function creating weight getters.
 */
function coerceWeight(value) {
  // Ensuring target value is a correct number
  if (typeof value !== 'number' || isNaN(value)) return 1;

  return value;
}

function createNodeValueGetter(nameOrFunction, defaultValue) {
  var getter = {};

  var coerceToDefault = function (v) {
    if (typeof v === 'undefined') return defaultValue;

    return v;
  };

  if (typeof defaultValue === 'function') coerceToDefault = defaultValue;

  var get = function (attributes) {
    return coerceToDefault(attributes[nameOrFunction]);
  };

  var returnDefault = function () {
    return coerceToDefault(undefined);
  };

  if (typeof nameOrFunction === 'string') {
    getter.fromAttributes = get;
    getter.fromGraph = function (graph, node) {
      return get(graph.getNodeAttributes(node));
    };
    getter.fromEntry = function (node, attributes) {
      return get(attributes);
    };
  } else if (typeof nameOrFunction === 'function') {
    getter.fromAttributes = function () {
      throw new Error(
        'graphology-utils/getters/createNodeValueGetter: irrelevant usage.'
      );
    };
    getter.fromGraph = function (graph, node) {
      return coerceToDefault(
        nameOrFunction(node, graph.getNodeAttributes(node))
      );
    };
    getter.fromEntry = function (node, attributes) {
      return coerceToDefault(nameOrFunction(node, attributes));
    };
  } else {
    getter.fromAttributes = returnDefault;
    getter.fromGraph = returnDefault;
    getter.fromEntry = returnDefault;
  }

  return getter;
}

function createEdgeValueGetter(nameOrFunction, defaultValue) {
  var getter = {};

  var coerceToDefault = function (v) {
    if (typeof v === 'undefined') return defaultValue;

    return v;
  };

  if (typeof defaultValue === 'function') coerceToDefault = defaultValue;

  var get = function (attributes) {
    return coerceToDefault(attributes[nameOrFunction]);
  };

  var returnDefault = function () {
    return coerceToDefault(undefined);
  };

  if (typeof nameOrFunction === 'string') {
    getter.fromAttributes = get;
    getter.fromGraph = function (graph, edge) {
      return get(graph.getEdgeAttributes(edge));
    };
    getter.fromEntry = function (edge, attributes) {
      return get(attributes);
    };
    getter.fromPartialEntry = getter.fromEntry;
    getter.fromMinimalEntry = getter.fromEntry;
  } else if (typeof nameOrFunction === 'function') {
    getter.fromAttributes = function () {
      throw new Error(
        'graphology-utils/getters/createEdgeValueGetter: irrelevant usage.'
      );
    };
    getter.fromGraph = function (graph, edge) {
      // TODO: we can do better, check #310
      var extremities = graph.extremities(edge);
      return coerceToDefault(
        nameOrFunction(
          edge,
          graph.getEdgeAttributes(edge),
          extremities[0],
          extremities[1],
          graph.getNodeAttributes(extremities[0]),
          graph.getNodeAttributes(extremities[1]),
          graph.isUndirected(edge)
        )
      );
    };
    getter.fromEntry = function (e, a, s, t, sa, ta, u) {
      return coerceToDefault(nameOrFunction(e, a, s, t, sa, ta, u));
    };
    getter.fromPartialEntry = function (e, a, s, t) {
      return coerceToDefault(nameOrFunction(e, a, s, t));
    };
    getter.fromMinimalEntry = function (e, a) {
      return coerceToDefault(nameOrFunction(e, a));
    };
  } else {
    getter.fromAttributes = returnDefault;
    getter.fromGraph = returnDefault;
    getter.fromEntry = returnDefault;
    getter.fromMinimalEntry = returnDefault;
  }

  return getter;
}

exports.createNodeValueGetter = createNodeValueGetter;
exports.createEdgeValueGetter = createEdgeValueGetter;
exports.createEdgeWeightGetter = function (name) {
  return createEdgeValueGetter(name, coerceWeight);
};

},{}],36:[function(require,module,exports){
/**
 * Graphology isGraph
 * ===================
 *
 * Very simple function aiming at ensuring the given variable is a
 * graphology instance.
 */

/**
 * Checking the value is a graphology instance.
 *
 * @param  {any}     value - Target value.
 * @return {boolean}
 */
module.exports = function isGraph(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    typeof value.addUndirectedEdgeWithKey === 'function' &&
    typeof value.dropNode === 'function' &&
    typeof value.multi === 'boolean'
  );
};

},{}],37:[function(require,module,exports){
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t="undefined"!=typeof globalThis?globalThis:t||self).graphology=e()}(this,(function(){"use strict";function t(e){return t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},t(e)}function e(t,e){t.prototype=Object.create(e.prototype),t.prototype.constructor=t,r(t,e)}function n(t){return n=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)},n(t)}function r(t,e){return r=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t},r(t,e)}function i(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}function o(t,e,n){return o=i()?Reflect.construct:function(t,e,n){var i=[null];i.push.apply(i,e);var o=new(Function.bind.apply(t,i));return n&&r(o,n.prototype),o},o.apply(null,arguments)}function a(t){var e="function"==typeof Map?new Map:void 0;return a=function(t){if(null===t||(i=t,-1===Function.toString.call(i).indexOf("[native code]")))return t;var i;if("function"!=typeof t)throw new TypeError("Super expression must either be null or a function");if(void 0!==e){if(e.has(t))return e.get(t);e.set(t,a)}function a(){return o(t,arguments,n(this).constructor)}return a.prototype=Object.create(t.prototype,{constructor:{value:a,enumerable:!1,writable:!0,configurable:!0}}),r(a,t)},a(t)}function u(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}var c=function(){for(var t=arguments[0],e=1,n=arguments.length;e<n;e++)if(arguments[e])for(var r in arguments[e])t[r]=arguments[e][r];return t};function s(t,e,n,r){var i=t._nodes.get(e),o=null;return i?o="mixed"===r?i.out&&i.out[n]||i.undirected&&i.undirected[n]:"directed"===r?i.out&&i.out[n]:i.undirected&&i.undirected[n]:o}function d(e){return null!==e&&"object"===t(e)&&"function"==typeof e.addUndirectedEdgeWithKey&&"function"==typeof e.dropNode}function h(e){return"object"===t(e)&&null!==e&&e.constructor===Object}function p(t){var e;for(e in t)return!1;return!0}function f(t,e,n){Object.defineProperty(t,e,{enumerable:!1,configurable:!1,writable:!0,value:n})}function l(t,e,n){var r={enumerable:!0,configurable:!0};"function"==typeof n?r.get=n:(r.value=n,r.writable=!1),Object.defineProperty(t,e,r)}function g(t){return!!h(t)&&!(t.attributes&&!Array.isArray(t.attributes))}"function"==typeof Object.assign&&(c=Object.assign);var y,w={exports:{}},v="object"==typeof Reflect?Reflect:null,b=v&&"function"==typeof v.apply?v.apply:function(t,e,n){return Function.prototype.apply.call(t,e,n)};y=v&&"function"==typeof v.ownKeys?v.ownKeys:Object.getOwnPropertySymbols?function(t){return Object.getOwnPropertyNames(t).concat(Object.getOwnPropertySymbols(t))}:function(t){return Object.getOwnPropertyNames(t)};var m=Number.isNaN||function(t){return t!=t};function k(){k.init.call(this)}w.exports=k,w.exports.once=function(t,e){return new Promise((function(n,r){function i(n){t.removeListener(e,o),r(n)}function o(){"function"==typeof t.removeListener&&t.removeListener("error",i),n([].slice.call(arguments))}N(t,e,o,{once:!0}),"error"!==e&&function(t,e,n){"function"==typeof t.on&&N(t,"error",e,n)}(t,i,{once:!0})}))},k.EventEmitter=k,k.prototype._events=void 0,k.prototype._eventsCount=0,k.prototype._maxListeners=void 0;var _=10;function G(t){if("function"!=typeof t)throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof t)}function x(t){return void 0===t._maxListeners?k.defaultMaxListeners:t._maxListeners}function E(t,e,n,r){var i,o,a,u;if(G(n),void 0===(o=t._events)?(o=t._events=Object.create(null),t._eventsCount=0):(void 0!==o.newListener&&(t.emit("newListener",e,n.listener?n.listener:n),o=t._events),a=o[e]),void 0===a)a=o[e]=n,++t._eventsCount;else if("function"==typeof a?a=o[e]=r?[n,a]:[a,n]:r?a.unshift(n):a.push(n),(i=x(t))>0&&a.length>i&&!a.warned){a.warned=!0;var c=new Error("Possible EventEmitter memory leak detected. "+a.length+" "+String(e)+" listeners added. Use emitter.setMaxListeners() to increase limit");c.name="MaxListenersExceededWarning",c.emitter=t,c.type=e,c.count=a.length,u=c,console&&console.warn&&console.warn(u)}return t}function A(){if(!this.fired)return this.target.removeListener(this.type,this.wrapFn),this.fired=!0,0===arguments.length?this.listener.call(this.target):this.listener.apply(this.target,arguments)}function S(t,e,n){var r={fired:!1,wrapFn:void 0,target:t,type:e,listener:n},i=A.bind(r);return i.listener=n,r.wrapFn=i,i}function D(t,e,n){var r=t._events;if(void 0===r)return[];var i=r[e];return void 0===i?[]:"function"==typeof i?n?[i.listener||i]:[i]:n?function(t){for(var e=new Array(t.length),n=0;n<e.length;++n)e[n]=t[n].listener||t[n];return e}(i):U(i,i.length)}function L(t){var e=this._events;if(void 0!==e){var n=e[t];if("function"==typeof n)return 1;if(void 0!==n)return n.length}return 0}function U(t,e){for(var n=new Array(e),r=0;r<e;++r)n[r]=t[r];return n}function N(t,e,n,r){if("function"==typeof t.on)r.once?t.once(e,n):t.on(e,n);else{if("function"!=typeof t.addEventListener)throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type '+typeof t);t.addEventListener(e,(function i(o){r.once&&t.removeEventListener(e,i),n(o)}))}}function j(t){if("function"!=typeof t)throw new Error("obliterator/iterator: expecting a function!");this.next=t}Object.defineProperty(k,"defaultMaxListeners",{enumerable:!0,get:function(){return _},set:function(t){if("number"!=typeof t||t<0||m(t))throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+t+".");_=t}}),k.init=function(){void 0!==this._events&&this._events!==Object.getPrototypeOf(this)._events||(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0},k.prototype.setMaxListeners=function(t){if("number"!=typeof t||t<0||m(t))throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+t+".");return this._maxListeners=t,this},k.prototype.getMaxListeners=function(){return x(this)},k.prototype.emit=function(t){for(var e=[],n=1;n<arguments.length;n++)e.push(arguments[n]);var r="error"===t,i=this._events;if(void 0!==i)r=r&&void 0===i.error;else if(!r)return!1;if(r){var o;if(e.length>0&&(o=e[0]),o instanceof Error)throw o;var a=new Error("Unhandled error."+(o?" ("+o.message+")":""));throw a.context=o,a}var u=i[t];if(void 0===u)return!1;if("function"==typeof u)b(u,this,e);else{var c=u.length,s=U(u,c);for(n=0;n<c;++n)b(s[n],this,e)}return!0},k.prototype.addListener=function(t,e){return E(this,t,e,!1)},k.prototype.on=k.prototype.addListener,k.prototype.prependListener=function(t,e){return E(this,t,e,!0)},k.prototype.once=function(t,e){return G(e),this.on(t,S(this,t,e)),this},k.prototype.prependOnceListener=function(t,e){return G(e),this.prependListener(t,S(this,t,e)),this},k.prototype.removeListener=function(t,e){var n,r,i,o,a;if(G(e),void 0===(r=this._events))return this;if(void 0===(n=r[t]))return this;if(n===e||n.listener===e)0==--this._eventsCount?this._events=Object.create(null):(delete r[t],r.removeListener&&this.emit("removeListener",t,n.listener||e));else if("function"!=typeof n){for(i=-1,o=n.length-1;o>=0;o--)if(n[o]===e||n[o].listener===e){a=n[o].listener,i=o;break}if(i<0)return this;0===i?n.shift():function(t,e){for(;e+1<t.length;e++)t[e]=t[e+1];t.pop()}(n,i),1===n.length&&(r[t]=n[0]),void 0!==r.removeListener&&this.emit("removeListener",t,a||e)}return this},k.prototype.off=k.prototype.removeListener,k.prototype.removeAllListeners=function(t){var e,n,r;if(void 0===(n=this._events))return this;if(void 0===n.removeListener)return 0===arguments.length?(this._events=Object.create(null),this._eventsCount=0):void 0!==n[t]&&(0==--this._eventsCount?this._events=Object.create(null):delete n[t]),this;if(0===arguments.length){var i,o=Object.keys(n);for(r=0;r<o.length;++r)"removeListener"!==(i=o[r])&&this.removeAllListeners(i);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if("function"==typeof(e=n[t]))this.removeListener(t,e);else if(void 0!==e)for(r=e.length-1;r>=0;r--)this.removeListener(t,e[r]);return this},k.prototype.listeners=function(t){return D(this,t,!0)},k.prototype.rawListeners=function(t){return D(this,t,!1)},k.listenerCount=function(t,e){return"function"==typeof t.listenerCount?t.listenerCount(e):L.call(t,e)},k.prototype.listenerCount=L,k.prototype.eventNames=function(){return this._eventsCount>0?y(this._events):[]},"undefined"!=typeof Symbol&&(j.prototype[Symbol.iterator]=function(){return this}),j.of=function(){var t=arguments,e=t.length,n=0;return new j((function(){return n>=e?{done:!0}:{done:!1,value:t[n++]}}))},j.empty=function(){return new j((function(){return{done:!0}}))},j.fromSequence=function(t){var e=0,n=t.length;return new j((function(){return e>=n?{done:!0}:{done:!1,value:t[e++]}}))},j.is=function(t){return t instanceof j||"object"==typeof t&&null!==t&&"function"==typeof t.next};var O=j,C={};C.ARRAY_BUFFER_SUPPORT="undefined"!=typeof ArrayBuffer,C.SYMBOL_SUPPORT="undefined"!=typeof Symbol;var z=O,M=C,W=M.ARRAY_BUFFER_SUPPORT,P=M.SYMBOL_SUPPORT;var R=function(t){var e=function(t){return"string"==typeof t||Array.isArray(t)||W&&ArrayBuffer.isView(t)?z.fromSequence(t):"object"!=typeof t||null===t?null:P&&"function"==typeof t[Symbol.iterator]?t[Symbol.iterator]():"function"==typeof t.next?t:null}(t);if(!e)throw new Error("obliterator: target is not iterable nor a valid iterator.");return e},K=R,T=function(t,e){for(var n,r=arguments.length>1?e:1/0,i=r!==1/0?new Array(r):[],o=0,a=K(t);;){if(o===r)return i;if((n=a.next()).done)return o!==e&&(i.length=o),i;i[o++]=n.value}},B=function(t){function n(e){var n;return(n=t.call(this)||this).name="GraphError",n.message=e,n}return e(n,t),n}(a(Error)),F=function(t){function n(e){var r;return(r=t.call(this,e)||this).name="InvalidArgumentsGraphError","function"==typeof Error.captureStackTrace&&Error.captureStackTrace(u(r),n.prototype.constructor),r}return e(n,t),n}(B),I=function(t){function n(e){var r;return(r=t.call(this,e)||this).name="NotFoundGraphError","function"==typeof Error.captureStackTrace&&Error.captureStackTrace(u(r),n.prototype.constructor),r}return e(n,t),n}(B),Y=function(t){function n(e){var r;return(r=t.call(this,e)||this).name="UsageGraphError","function"==typeof Error.captureStackTrace&&Error.captureStackTrace(u(r),n.prototype.constructor),r}return e(n,t),n}(B);function q(t,e){this.key=t,this.attributes=e,this.clear()}function J(t,e){this.key=t,this.attributes=e,this.clear()}function V(t,e){this.key=t,this.attributes=e,this.clear()}function H(t,e,n,r,i){this.key=e,this.attributes=i,this.undirected=t,this.source=n,this.target=r}q.prototype.clear=function(){this.inDegree=0,this.outDegree=0,this.undirectedDegree=0,this.in={},this.out={},this.undirected={}},J.prototype.clear=function(){this.inDegree=0,this.outDegree=0,this.in={},this.out={}},V.prototype.clear=function(){this.undirectedDegree=0,this.undirected={}},H.prototype.attach=function(){var t="out",e="in";this.undirected&&(t=e="undirected");var n=this.source.key,r=this.target.key;this.source[t][r]=this,this.undirected&&n===r||(this.target[e][n]=this)},H.prototype.attachMulti=function(){var t="out",e="in",n=this.source.key,r=this.target.key;this.undirected&&(t=e="undirected");var i=this.source[t],o=i[r];if(void 0===o)return i[r]=this,void(this.undirected&&n===r||(this.target[e][n]=this));o.previous=this,this.next=o,i[r]=this,this.target[e][n]=this},H.prototype.detach=function(){var t=this.source.key,e=this.target.key,n="out",r="in";this.undirected&&(n=r="undirected"),delete this.source[n][e],delete this.target[r][t]},H.prototype.detachMulti=function(){var t=this.source.key,e=this.target.key,n="out",r="in";this.undirected&&(n=r="undirected"),void 0===this.previous?void 0===this.next?(delete this.source[n][e],delete this.target[r][t]):(this.next.previous=void 0,this.source[n][e]=this.next,this.target[r][t]=this.next):(this.previous.next=this.next,void 0!==this.next&&(this.next.previous=this.previous))};function Q(t,e,n,r,i,o,a){var u,c,s,d;if(r=""+r,0===n){if(!(u=t._nodes.get(r)))throw new I("Graph.".concat(e,': could not find the "').concat(r,'" node in the graph.'));s=i,d=o}else if(3===n){if(i=""+i,!(c=t._edges.get(i)))throw new I("Graph.".concat(e,': could not find the "').concat(i,'" edge in the graph.'));var h=c.source.key,p=c.target.key;if(r===h)u=c.target;else{if(r!==p)throw new I("Graph.".concat(e,': the "').concat(r,'" node is not attached to the "').concat(i,'" edge (').concat(h,", ").concat(p,")."));u=c.source}s=o,d=a}else{if(!(c=t._edges.get(r)))throw new I("Graph.".concat(e,': could not find the "').concat(r,'" edge in the graph.'));u=1===n?c.source:c.target,s=i,d=o}return[u,s,d]}var X=[{name:function(t){return"get".concat(t,"Attribute")},attacher:function(t,e,n){t.prototype[e]=function(t,r,i){var o=Q(this,e,n,t,r,i),a=o[0],u=o[1];return a.attributes[u]}}},{name:function(t){return"get".concat(t,"Attributes")},attacher:function(t,e,n){t.prototype[e]=function(t,r){return Q(this,e,n,t,r)[0].attributes}}},{name:function(t){return"has".concat(t,"Attribute")},attacher:function(t,e,n){t.prototype[e]=function(t,r,i){var o=Q(this,e,n,t,r,i),a=o[0],u=o[1];return a.attributes.hasOwnProperty(u)}}},{name:function(t){return"set".concat(t,"Attribute")},attacher:function(t,e,n){t.prototype[e]=function(t,r,i,o){var a=Q(this,e,n,t,r,i,o),u=a[0],c=a[1],s=a[2];return u.attributes[c]=s,this.emit("nodeAttributesUpdated",{key:u.key,type:"set",attributes:u.attributes,name:c}),this}}},{name:function(t){return"update".concat(t,"Attribute")},attacher:function(t,e,n){t.prototype[e]=function(t,r,i,o){var a=Q(this,e,n,t,r,i,o),u=a[0],c=a[1],s=a[2];if("function"!=typeof s)throw new F("Graph.".concat(e,": updater should be a function."));var d=u.attributes,h=s(d[c]);return d[c]=h,this.emit("nodeAttributesUpdated",{key:u.key,type:"set",attributes:u.attributes,name:c}),this}}},{name:function(t){return"remove".concat(t,"Attribute")},attacher:function(t,e,n){t.prototype[e]=function(t,r,i){var o=Q(this,e,n,t,r,i),a=o[0],u=o[1];return delete a.attributes[u],this.emit("nodeAttributesUpdated",{key:a.key,type:"remove",attributes:a.attributes,name:u}),this}}},{name:function(t){return"replace".concat(t,"Attributes")},attacher:function(t,e,n){t.prototype[e]=function(t,r,i){var o=Q(this,e,n,t,r,i),a=o[0],u=o[1];if(!h(u))throw new F("Graph.".concat(e,": provided attributes are not a plain object."));return a.attributes=u,this.emit("nodeAttributesUpdated",{key:a.key,type:"replace",attributes:a.attributes}),this}}},{name:function(t){return"merge".concat(t,"Attributes")},attacher:function(t,e,n){t.prototype[e]=function(t,r,i){var o=Q(this,e,n,t,r,i),a=o[0],u=o[1];if(!h(u))throw new F("Graph.".concat(e,": provided attributes are not a plain object."));return c(a.attributes,u),this.emit("nodeAttributesUpdated",{key:a.key,type:"merge",attributes:a.attributes,data:u}),this}}},{name:function(t){return"update".concat(t,"Attributes")},attacher:function(t,e,n){t.prototype[e]=function(t,r,i){var o=Q(this,e,n,t,r,i),a=o[0],u=o[1];if("function"!=typeof u)throw new F("Graph.".concat(e,": provided updater is not a function."));return a.attributes=u(a.attributes),this.emit("nodeAttributesUpdated",{key:a.key,type:"update",attributes:a.attributes}),this}}}];var Z=[{name:function(t){return"get".concat(t,"Attribute")},attacher:function(t,e,n){t.prototype[e]=function(t,r){var i;if("mixed"!==this.type&&"mixed"!==n&&n!==this.type)throw new Y("Graph.".concat(e,": cannot find this type of edges in your ").concat(this.type," graph."));if(arguments.length>2){if(this.multi)throw new Y("Graph.".concat(e,": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));var o=""+t,a=""+r;if(r=arguments[2],!(i=s(this,o,a,n)))throw new I("Graph.".concat(e,': could not find an edge for the given path ("').concat(o,'" - "').concat(a,'").'))}else{if("mixed"!==n)throw new Y("Graph.".concat(e,": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));if(t=""+t,!(i=this._edges.get(t)))throw new I("Graph.".concat(e,': could not find the "').concat(t,'" edge in the graph.'))}return i.attributes[r]}}},{name:function(t){return"get".concat(t,"Attributes")},attacher:function(t,e,n){t.prototype[e]=function(t){var r;if("mixed"!==this.type&&"mixed"!==n&&n!==this.type)throw new Y("Graph.".concat(e,": cannot find this type of edges in your ").concat(this.type," graph."));if(arguments.length>1){if(this.multi)throw new Y("Graph.".concat(e,": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));var i=""+t,o=""+arguments[1];if(!(r=s(this,i,o,n)))throw new I("Graph.".concat(e,': could not find an edge for the given path ("').concat(i,'" - "').concat(o,'").'))}else{if("mixed"!==n)throw new Y("Graph.".concat(e,": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));if(t=""+t,!(r=this._edges.get(t)))throw new I("Graph.".concat(e,': could not find the "').concat(t,'" edge in the graph.'))}return r.attributes}}},{name:function(t){return"has".concat(t,"Attribute")},attacher:function(t,e,n){t.prototype[e]=function(t,r){var i;if("mixed"!==this.type&&"mixed"!==n&&n!==this.type)throw new Y("Graph.".concat(e,": cannot find this type of edges in your ").concat(this.type," graph."));if(arguments.length>2){if(this.multi)throw new Y("Graph.".concat(e,": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));var o=""+t,a=""+r;if(r=arguments[2],!(i=s(this,o,a,n)))throw new I("Graph.".concat(e,': could not find an edge for the given path ("').concat(o,'" - "').concat(a,'").'))}else{if("mixed"!==n)throw new Y("Graph.".concat(e,": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));if(t=""+t,!(i=this._edges.get(t)))throw new I("Graph.".concat(e,': could not find the "').concat(t,'" edge in the graph.'))}return i.attributes.hasOwnProperty(r)}}},{name:function(t){return"set".concat(t,"Attribute")},attacher:function(t,e,n){t.prototype[e]=function(t,r,i){var o;if("mixed"!==this.type&&"mixed"!==n&&n!==this.type)throw new Y("Graph.".concat(e,": cannot find this type of edges in your ").concat(this.type," graph."));if(arguments.length>3){if(this.multi)throw new Y("Graph.".concat(e,": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));var a=""+t,u=""+r;if(r=arguments[2],i=arguments[3],!(o=s(this,a,u,n)))throw new I("Graph.".concat(e,': could not find an edge for the given path ("').concat(a,'" - "').concat(u,'").'))}else{if("mixed"!==n)throw new Y("Graph.".concat(e,": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));if(t=""+t,!(o=this._edges.get(t)))throw new I("Graph.".concat(e,': could not find the "').concat(t,'" edge in the graph.'))}return o.attributes[r]=i,this.emit("edgeAttributesUpdated",{key:o.key,type:"set",attributes:o.attributes,name:r}),this}}},{name:function(t){return"update".concat(t,"Attribute")},attacher:function(t,e,n){t.prototype[e]=function(t,r,i){var o;if("mixed"!==this.type&&"mixed"!==n&&n!==this.type)throw new Y("Graph.".concat(e,": cannot find this type of edges in your ").concat(this.type," graph."));if(arguments.length>3){if(this.multi)throw new Y("Graph.".concat(e,": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));var a=""+t,u=""+r;if(r=arguments[2],i=arguments[3],!(o=s(this,a,u,n)))throw new I("Graph.".concat(e,': could not find an edge for the given path ("').concat(a,'" - "').concat(u,'").'))}else{if("mixed"!==n)throw new Y("Graph.".concat(e,": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));if(t=""+t,!(o=this._edges.get(t)))throw new I("Graph.".concat(e,': could not find the "').concat(t,'" edge in the graph.'))}if("function"!=typeof i)throw new F("Graph.".concat(e,": updater should be a function."));return o.attributes[r]=i(o.attributes[r]),this.emit("edgeAttributesUpdated",{key:o.key,type:"set",attributes:o.attributes,name:r}),this}}},{name:function(t){return"remove".concat(t,"Attribute")},attacher:function(t,e,n){t.prototype[e]=function(t,r){var i;if("mixed"!==this.type&&"mixed"!==n&&n!==this.type)throw new Y("Graph.".concat(e,": cannot find this type of edges in your ").concat(this.type," graph."));if(arguments.length>2){if(this.multi)throw new Y("Graph.".concat(e,": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));var o=""+t,a=""+r;if(r=arguments[2],!(i=s(this,o,a,n)))throw new I("Graph.".concat(e,': could not find an edge for the given path ("').concat(o,'" - "').concat(a,'").'))}else{if("mixed"!==n)throw new Y("Graph.".concat(e,": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));if(t=""+t,!(i=this._edges.get(t)))throw new I("Graph.".concat(e,': could not find the "').concat(t,'" edge in the graph.'))}return delete i.attributes[r],this.emit("edgeAttributesUpdated",{key:i.key,type:"remove",attributes:i.attributes,name:r}),this}}},{name:function(t){return"replace".concat(t,"Attributes")},attacher:function(t,e,n){t.prototype[e]=function(t,r){var i;if("mixed"!==this.type&&"mixed"!==n&&n!==this.type)throw new Y("Graph.".concat(e,": cannot find this type of edges in your ").concat(this.type," graph."));if(arguments.length>2){if(this.multi)throw new Y("Graph.".concat(e,": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));var o=""+t,a=""+r;if(r=arguments[2],!(i=s(this,o,a,n)))throw new I("Graph.".concat(e,': could not find an edge for the given path ("').concat(o,'" - "').concat(a,'").'))}else{if("mixed"!==n)throw new Y("Graph.".concat(e,": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));if(t=""+t,!(i=this._edges.get(t)))throw new I("Graph.".concat(e,': could not find the "').concat(t,'" edge in the graph.'))}if(!h(r))throw new F("Graph.".concat(e,": provided attributes are not a plain object."));return i.attributes=r,this.emit("edgeAttributesUpdated",{key:i.key,type:"replace",attributes:i.attributes}),this}}},{name:function(t){return"merge".concat(t,"Attributes")},attacher:function(t,e,n){t.prototype[e]=function(t,r){var i;if("mixed"!==this.type&&"mixed"!==n&&n!==this.type)throw new Y("Graph.".concat(e,": cannot find this type of edges in your ").concat(this.type," graph."));if(arguments.length>2){if(this.multi)throw new Y("Graph.".concat(e,": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));var o=""+t,a=""+r;if(r=arguments[2],!(i=s(this,o,a,n)))throw new I("Graph.".concat(e,': could not find an edge for the given path ("').concat(o,'" - "').concat(a,'").'))}else{if("mixed"!==n)throw new Y("Graph.".concat(e,": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));if(t=""+t,!(i=this._edges.get(t)))throw new I("Graph.".concat(e,': could not find the "').concat(t,'" edge in the graph.'))}if(!h(r))throw new F("Graph.".concat(e,": provided attributes are not a plain object."));return c(i.attributes,r),this.emit("edgeAttributesUpdated",{key:i.key,type:"merge",attributes:i.attributes,data:r}),this}}},{name:function(t){return"update".concat(t,"Attributes")},attacher:function(t,e,n){t.prototype[e]=function(t,r){var i;if("mixed"!==this.type&&"mixed"!==n&&n!==this.type)throw new Y("Graph.".concat(e,": cannot find this type of edges in your ").concat(this.type," graph."));if(arguments.length>2){if(this.multi)throw new Y("Graph.".concat(e,": cannot use a {source,target} combo when asking about an edge's attributes in a MultiGraph since we cannot infer the one you want information about."));var o=""+t,a=""+r;if(r=arguments[2],!(i=s(this,o,a,n)))throw new I("Graph.".concat(e,': could not find an edge for the given path ("').concat(o,'" - "').concat(a,'").'))}else{if("mixed"!==n)throw new Y("Graph.".concat(e,": calling this method with only a key (vs. a source and target) does not make sense since an edge with this key could have the other type."));if(t=""+t,!(i=this._edges.get(t)))throw new I("Graph.".concat(e,': could not find the "').concat(t,'" edge in the graph.'))}if("function"!=typeof r)throw new F("Graph.".concat(e,": provided updater is not a function."));return i.attributes=r(i.attributes),this.emit("edgeAttributesUpdated",{key:i.key,type:"update",attributes:i.attributes}),this}}}];var $=O,tt=R,et=function(){var t=arguments,e=null,n=-1;return new $((function(){for(var r=null;;){if(null===e){if(++n>=t.length)return{done:!0};e=tt(t[n])}if(!0!==(r=e.next()).done)break;e=null}return r}))},nt=[{name:"edges",type:"mixed"},{name:"inEdges",type:"directed",direction:"in"},{name:"outEdges",type:"directed",direction:"out"},{name:"inboundEdges",type:"mixed",direction:"in"},{name:"outboundEdges",type:"mixed",direction:"out"},{name:"directedEdges",type:"directed"},{name:"undirectedEdges",type:"undirected"}];function rt(t,e,n,r){var i=!1;for(var o in e)if(o!==r){var a=e[o];if(i=n(a.key,a.attributes,a.source.key,a.target.key,a.source.attributes,a.target.attributes,a.undirected),t&&i)return a.key}}function it(t,e,n,r){var i,o,a,u=!1;for(var c in e)if(c!==r){i=e[c];do{if(o=i.source,a=i.target,u=n(i.key,i.attributes,o.key,a.key,o.attributes,a.attributes,i.undirected),t&&u)return i.key;i=i.next}while(void 0!==i)}}function ot(t,e){var n,r=Object.keys(t),i=r.length,o=0;return new O((function(){do{if(n)n=n.next;else{if(o>=i)return{done:!0};var a=r[o++];if(a===e){n=void 0;continue}n=t[a]}}while(!n);return{done:!1,value:{edge:n.key,attributes:n.attributes,source:n.source.key,target:n.target.key,sourceAttributes:n.source.attributes,targetAttributes:n.target.attributes,undirected:n.undirected}}}))}function at(t,e,n,r){var i=e[n];if(i){var o=i.source,a=i.target;return r(i.key,i.attributes,o.key,a.key,o.attributes,a.attributes,i.undirected)&&t?i.key:void 0}}function ut(t,e,n,r){var i=e[n];if(i){var o=!1;do{if(o=r(i.key,i.attributes,i.source.key,i.target.key,i.source.attributes,i.target.attributes,i.undirected),t&&o)return i.key;i=i.next}while(void 0!==i)}}function ct(t,e){var n=t[e];return void 0!==n.next?new O((function(){if(!n)return{done:!0};var t={edge:n.key,attributes:n.attributes,source:n.source.key,target:n.target.key,sourceAttributes:n.source.attributes,targetAttributes:n.target.attributes,undirected:n.undirected};return n=n.next,{done:!1,value:t}})):O.of({edge:n.key,attributes:n.attributes,source:n.source.key,target:n.target.key,sourceAttributes:n.source.attributes,targetAttributes:n.target.attributes,undirected:n.undirected})}function st(t,e){if(0===t.size)return[];if("mixed"===e||e===t.type)return"function"==typeof Array.from?Array.from(t._edges.keys()):T(t._edges.keys(),t._edges.size);for(var n,r,i="undirected"===e?t.undirectedSize:t.directedSize,o=new Array(i),a="undirected"===e,u=t._edges.values(),c=0;!0!==(n=u.next()).done;)(r=n.value).undirected===a&&(o[c++]=r.key);return o}function dt(t,e,n,r){if(0!==e.size)for(var i,o,a="mixed"!==n&&n!==e.type,u="undirected"===n,c=!1,s=e._edges.values();!0!==(i=s.next()).done;)if(o=i.value,!a||o.undirected===u){var d=o,h=d.key,p=d.attributes,f=d.source,l=d.target;if(c=r(h,p,f.key,l.key,f.attributes,l.attributes,o.undirected),t&&c)return h}}function ht(t,e){if(0===t.size)return O.empty();var n="mixed"!==e&&e!==t.type,r="undirected"===e,i=t._edges.values();return new O((function(){for(var t,e;;){if((t=i.next()).done)return t;if(e=t.value,!n||e.undirected===r)break}return{value:{edge:e.key,attributes:e.attributes,source:e.source.key,target:e.target.key,sourceAttributes:e.source.attributes,targetAttributes:e.target.attributes,undirected:e.undirected},done:!1}}))}function pt(t,e,n,r,i,o){var a,u=e?it:rt;if("undirected"!==n){if("out"!==r&&(a=u(t,i.in,o),t&&a))return a;if("in"!==r&&(a=u(t,i.out,o,r?void 0:i.key),t&&a))return a}if("directed"!==n&&(a=u(t,i.undirected,o),t&&a))return a}function ft(t,e,n,r){var i=[];return pt(!1,t,e,n,r,(function(t){i.push(t)})),i}function lt(t,e,n){var r=O.empty();return"undirected"!==t&&("out"!==e&&void 0!==n.in&&(r=et(r,ot(n.in))),"in"!==e&&void 0!==n.out&&(r=et(r,ot(n.out,e?void 0:n.key)))),"directed"!==t&&void 0!==n.undirected&&(r=et(r,ot(n.undirected))),r}function gt(t,e,n,r,i,o,a){var u,c=n?ut:at;if("undirected"!==e){if(void 0!==i.in&&"out"!==r&&(u=c(t,i.in,o,a),t&&u))return u;if(void 0!==i.out&&"in"!==r&&(r||i.key!==o)&&(u=c(t,i.out,o,a),t&&u))return u}if("directed"!==e&&void 0!==i.undirected&&(u=c(t,i.undirected,o,a),t&&u))return u}function yt(t,e,n,r,i){var o=[];return gt(!1,t,e,n,r,i,(function(t){o.push(t)})),o}function wt(t,e,n,r){var i=O.empty();return"undirected"!==t&&(void 0!==n.in&&"out"!==e&&r in n.in&&(i=et(i,ct(n.in,r))),void 0!==n.out&&"in"!==e&&r in n.out&&(e||n.key!==r)&&(i=et(i,ct(n.out,r)))),"directed"!==t&&void 0!==n.undirected&&r in n.undirected&&(i=et(i,ct(n.undirected,r))),i}var vt=[{name:"neighbors",type:"mixed"},{name:"inNeighbors",type:"directed",direction:"in"},{name:"outNeighbors",type:"directed",direction:"out"},{name:"inboundNeighbors",type:"mixed",direction:"in"},{name:"outboundNeighbors",type:"mixed",direction:"out"},{name:"directedNeighbors",type:"directed"},{name:"undirectedNeighbors",type:"undirected"}];function bt(){this.A=null,this.B=null}function mt(t,e,n,r,i){for(var o in r){var a=r[o],u=a.source,c=a.target,s=u===n?c:u;if(!e||!e.has(s.key)){var d=i(s.key,s.attributes);if(t&&d)return s.key}}}function kt(t,e,n,r,i){if("mixed"!==e){if("undirected"===e)return mt(t,null,r,r.undirected,i);if("string"==typeof n)return mt(t,null,r,r[n],i)}var o,a=new bt;if("undirected"!==e){if("out"!==n){if(o=mt(t,null,r,r.in,i),t&&o)return o;a.wrap(r.in)}if("in"!==n){if(o=mt(t,a,r,r.out,i),t&&o)return o;a.wrap(r.out)}}if("directed"!==e&&(o=mt(t,a,r,r.undirected,i),t&&o))return o}function _t(t,e,n){var r=Object.keys(n),i=r.length,o=0;return new O((function(){var a=null;do{if(o>=i)return t&&t.wrap(n),{done:!0};var u=n[r[o++]],c=u.source,s=u.target;a=c===e?s:c,t&&t.has(a.key)&&(a=null)}while(null===a);return{done:!1,value:{neighbor:a.key,attributes:a.attributes}}}))}function Gt(t,e){var n=e.name,r=e.type,i=e.direction;t.prototype[n]=function(t){if("mixed"!==r&&"mixed"!==this.type&&r!==this.type)return[];t=""+t;var e=this._nodes.get(t);if(void 0===e)throw new I("Graph.".concat(n,': could not find the "').concat(t,'" node in the graph.'));return function(t,e,n){if("mixed"!==t){if("undirected"===t)return Object.keys(n.undirected);if("string"==typeof e)return Object.keys(n[e])}var r=[];return kt(!1,t,e,n,(function(t){r.push(t)})),r}("mixed"===r?this.type:r,i,e)}}function xt(t,e){var n=e.name,r=e.type,i=e.direction,o=n.slice(0,-1)+"Entries";t.prototype[o]=function(t){if("mixed"!==r&&"mixed"!==this.type&&r!==this.type)return O.empty();t=""+t;var e=this._nodes.get(t);if(void 0===e)throw new I("Graph.".concat(o,': could not find the "').concat(t,'" node in the graph.'));return function(t,e,n){if("mixed"!==t){if("undirected"===t)return _t(null,n,n.undirected);if("string"==typeof e)return _t(null,n,n[e])}var r=O.empty(),i=new bt;return"undirected"!==t&&("out"!==e&&(r=et(r,_t(i,n,n.in))),"in"!==e&&(r=et(r,_t(i,n,n.out)))),"directed"!==t&&(r=et(r,_t(i,n,n.undirected))),r}("mixed"===r?this.type:r,i,e)}}function Et(t,e,n,r,i){for(var o,a,u,c,s,d,h,p=r._nodes.values(),f=r.type;!0!==(o=p.next()).done;){var l=!1;if(a=o.value,"undirected"!==f)for(u in c=a.out){s=c[u];do{if(d=s.target,l=!0,h=i(a.key,d.key,a.attributes,d.attributes,s.key,s.attributes,s.undirected),t&&h)return s;s=s.next}while(s)}if("directed"!==f)for(u in c=a.undirected)if(!(e&&a.key>u)){s=c[u];do{if((d=s.target).key!==u&&(d=s.source),l=!0,h=i(a.key,d.key,a.attributes,d.attributes,s.key,s.attributes,s.undirected),t&&h)return s;s=s.next}while(s)}if(n&&!l&&(h=i(a.key,null,a.attributes,null,null,null,null),t&&h))return null}}function At(t){if(!h(t))throw new F('Graph.import: invalid serialized node. A serialized node should be a plain object with at least a "key" property.');if(!("key"in t))throw new F("Graph.import: serialized node is missing its key.");if("attributes"in t&&(!h(t.attributes)||null===t.attributes))throw new F("Graph.import: invalid attributes. Attributes should be a plain object, null or omitted.")}function St(t){if(!h(t))throw new F('Graph.import: invalid serialized edge. A serialized edge should be a plain object with at least a "source" & "target" property.');if(!("source"in t))throw new F("Graph.import: serialized edge is missing its source.");if(!("target"in t))throw new F("Graph.import: serialized edge is missing its target.");if("attributes"in t&&(!h(t.attributes)||null===t.attributes))throw new F("Graph.import: invalid attributes. Attributes should be a plain object, null or omitted.");if("undirected"in t&&"boolean"!=typeof t.undirected)throw new F("Graph.import: invalid undirectedness information. Undirected should be boolean or omitted.")}bt.prototype.wrap=function(t){null===this.A?this.A=t:null===this.B&&(this.B=t)},bt.prototype.has=function(t){return null!==this.A&&t in this.A||null!==this.B&&t in this.B};var Dt,Lt=(Dt=255&Math.floor(256*Math.random()),function(){return Dt++}),Ut=new Set(["directed","undirected","mixed"]),Nt=new Set(["domain","_events","_eventsCount","_maxListeners"]),jt={allowSelfLoops:!0,multi:!1,type:"mixed"};function Ot(t,e,n){var r=new t.NodeDataClass(e,n);return t._nodes.set(e,r),t.emit("nodeAdded",{key:e,attributes:n}),r}function Ct(t,e,n,r,i,o,a,u){if(!r&&"undirected"===t.type)throw new Y("Graph.".concat(e,": you cannot add a directed edge to an undirected graph. Use the #.addEdge or #.addUndirectedEdge instead."));if(r&&"directed"===t.type)throw new Y("Graph.".concat(e,": you cannot add an undirected edge to a directed graph. Use the #.addEdge or #.addDirectedEdge instead."));if(u&&!h(u))throw new F("Graph.".concat(e,': invalid attributes. Expecting an object but got "').concat(u,'"'));if(o=""+o,a=""+a,u=u||{},!t.allowSelfLoops&&o===a)throw new Y("Graph.".concat(e,': source & target are the same ("').concat(o,"\"), thus creating a loop explicitly forbidden by this graph 'allowSelfLoops' option set to false."));var c=t._nodes.get(o),s=t._nodes.get(a);if(!c)throw new I("Graph.".concat(e,': source node "').concat(o,'" not found.'));if(!s)throw new I("Graph.".concat(e,': target node "').concat(a,'" not found.'));var d={key:null,undirected:r,source:o,target:a,attributes:u};if(n)i=t._edgeKeyGenerator();else if(i=""+i,t._edges.has(i))throw new Y("Graph.".concat(e,': the "').concat(i,'" edge already exists in the graph.'));if(!t.multi&&(r?void 0!==c.undirected[a]:void 0!==c.out[a]))throw new Y("Graph.".concat(e,': an edge linking "').concat(o,'" to "').concat(a,"\" already exists. If you really want to add multiple edges linking those nodes, you should create a multi graph by using the 'multi' option."));var p=new H(r,i,c,s,u);t._edges.set(i,p);var f=o===a;return r?(c.undirectedDegree++,s.undirectedDegree++,f&&t._undirectedSelfLoopCount++):(c.outDegree++,s.inDegree++,f&&t._directedSelfLoopCount++),t.multi?p.attachMulti():p.attach(),r?t._undirectedSize++:t._directedSize++,d.key=i,t.emit("edgeAdded",d),i}function zt(t,e,n,r,i,o,a,u,s){if(!r&&"undirected"===t.type)throw new Y("Graph.".concat(e,": you cannot merge/update a directed edge to an undirected graph. Use the #.mergeEdge/#.updateEdge or #.addUndirectedEdge instead."));if(r&&"directed"===t.type)throw new Y("Graph.".concat(e,": you cannot merge/update an undirected edge to a directed graph. Use the #.mergeEdge/#.updateEdge or #.addDirectedEdge instead."));if(u)if(s){if("function"!=typeof u)throw new F("Graph.".concat(e,': invalid updater function. Expecting a function but got "').concat(u,'"'))}else if(!h(u))throw new F("Graph.".concat(e,': invalid attributes. Expecting an object but got "').concat(u,'"'));var d;if(o=""+o,a=""+a,s&&(d=u,u=void 0),!t.allowSelfLoops&&o===a)throw new Y("Graph.".concat(e,': source & target are the same ("').concat(o,"\"), thus creating a loop explicitly forbidden by this graph 'allowSelfLoops' option set to false."));var p,f,l=t._nodes.get(o),g=t._nodes.get(a);if(!n&&(p=t._edges.get(i))){if(!(p.source.key===o&&p.target.key===a||r&&p.source.key===a&&p.target.key===o))throw new Y("Graph.".concat(e,': inconsistency detected when attempting to merge the "').concat(i,'" edge with "').concat(o,'" source & "').concat(a,'" target vs. ("').concat(p.source.key,'", "').concat(p.target.key,'").'));f=p}if(f||t.multi||!l||(f=r?l.undirected[a]:l.out[a]),f){var y=[f.key,!1,!1,!1];if(s?!d:!u)return y;if(s){var w=f.attributes;f.attributes=d(w),t.emit("edgeAttributesUpdated",{type:"replace",key:f.key,attributes:f.attributes})}else c(f.attributes,u),t.emit("edgeAttributesUpdated",{type:"merge",key:f.key,attributes:f.attributes,data:u});return y}u=u||{},s&&d&&(u=d(u));var v={key:null,undirected:r,source:o,target:a,attributes:u};if(n)i=t._edgeKeyGenerator();else if(i=""+i,t._edges.has(i))throw new Y("Graph.".concat(e,': the "').concat(i,'" edge already exists in the graph.'));var b=!1,m=!1;l||(l=Ot(t,o,{}),b=!0,o===a&&(g=l,m=!0)),g||(g=Ot(t,a,{}),m=!0),p=new H(r,i,l,g,u),t._edges.set(i,p);var k=o===a;return r?(l.undirectedDegree++,g.undirectedDegree++,k&&t._undirectedSelfLoopCount++):(l.outDegree++,g.inDegree++,k&&t._directedSelfLoopCount++),t.multi?p.attachMulti():p.attach(),r?t._undirectedSize++:t._directedSize++,v.key=i,t.emit("edgeAdded",v),[i,!0,b,m]}function Mt(t,e){t._edges.delete(e.key);var n=e.source,r=e.target,i=e.attributes,o=e.undirected,a=n===r;o?(n.undirectedDegree--,r.undirectedDegree--,a&&t._undirectedSelfLoopCount--):(n.outDegree--,r.inDegree--,a&&t._directedSelfLoopCount--),t.multi?e.detachMulti():e.detach(),o?t._undirectedSize--:t._directedSize--,t.emit("edgeDropped",{key:e.key,attributes:i,source:n.key,target:r.key,undirected:o})}var Wt=function(n){function r(t){var e;if(e=n.call(this)||this,"boolean"!=typeof(t=c({},jt,t)).multi)throw new F("Graph.constructor: invalid 'multi' option. Expecting a boolean but got \"".concat(t.multi,'".'));if(!Ut.has(t.type))throw new F('Graph.constructor: invalid \'type\' option. Should be one of "mixed", "directed" or "undirected" but got "'.concat(t.type,'".'));if("boolean"!=typeof t.allowSelfLoops)throw new F("Graph.constructor: invalid 'allowSelfLoops' option. Expecting a boolean but got \"".concat(t.allowSelfLoops,'".'));var r="mixed"===t.type?q:"directed"===t.type?J:V;f(u(e),"NodeDataClass",r);var i="geid_"+Lt()+"_",o=0;return f(u(e),"_attributes",{}),f(u(e),"_nodes",new Map),f(u(e),"_edges",new Map),f(u(e),"_directedSize",0),f(u(e),"_undirectedSize",0),f(u(e),"_directedSelfLoopCount",0),f(u(e),"_undirectedSelfLoopCount",0),f(u(e),"_edgeKeyGenerator",(function(){var t;do{t=i+o++}while(e._edges.has(t));return t})),f(u(e),"_options",t),Nt.forEach((function(t){return f(u(e),t,e[t])})),l(u(e),"order",(function(){return e._nodes.size})),l(u(e),"size",(function(){return e._edges.size})),l(u(e),"directedSize",(function(){return e._directedSize})),l(u(e),"undirectedSize",(function(){return e._undirectedSize})),l(u(e),"selfLoopCount",(function(){return e._directedSelfLoopCount+e._undirectedSelfLoopCount})),l(u(e),"directedSelfLoopCount",(function(){return e._directedSelfLoopCount})),l(u(e),"undirectedSelfLoopCount",(function(){return e._undirectedSelfLoopCount})),l(u(e),"multi",e._options.multi),l(u(e),"type",e._options.type),l(u(e),"allowSelfLoops",e._options.allowSelfLoops),l(u(e),"implementation",(function(){return"graphology"})),e}e(r,n);var i=r.prototype;return i._resetInstanceCounters=function(){this._directedSize=0,this._undirectedSize=0,this._directedSelfLoopCount=0,this._undirectedSelfLoopCount=0},i.hasNode=function(t){return this._nodes.has(""+t)},i.hasDirectedEdge=function(t,e){if("undirected"===this.type)return!1;if(1===arguments.length){var n=""+t,r=this._edges.get(n);return!!r&&!r.undirected}if(2===arguments.length){t=""+t,e=""+e;var i=this._nodes.get(t);if(!i)return!1;var o=i.out[e];return!!o&&(!this.multi||!!o.size)}throw new F("Graph.hasDirectedEdge: invalid arity (".concat(arguments.length,", instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target."))},i.hasUndirectedEdge=function(t,e){if("directed"===this.type)return!1;if(1===arguments.length){var n=""+t,r=this._edges.get(n);return!!r&&r.undirected}if(2===arguments.length){t=""+t,e=""+e;var i=this._nodes.get(t);if(!i)return!1;var o=i.undirected[e];return!!o&&(!this.multi||!!o.size)}throw new F("Graph.hasDirectedEdge: invalid arity (".concat(arguments.length,", instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target."))},i.hasEdge=function(t,e){if(1===arguments.length){var n=""+t;return this._edges.has(n)}if(2===arguments.length){t=""+t,e=""+e;var r=this._nodes.get(t);if(!r)return!1;var i=void 0!==r.out&&r.out[e];return i||(i=void 0!==r.undirected&&r.undirected[e]),!!i&&(!this.multi||!!i.size)}throw new F("Graph.hasEdge: invalid arity (".concat(arguments.length,", instead of 1 or 2). You can either ask for an edge id or for the existence of an edge between a source & a target."))},i.directedEdge=function(t,e){if("undirected"!==this.type){if(t=""+t,e=""+e,this.multi)throw new Y("Graph.directedEdge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.directedEdges instead.");var n=this._nodes.get(t);if(!n)throw new I('Graph.directedEdge: could not find the "'.concat(t,'" source node in the graph.'));if(!this._nodes.has(e))throw new I('Graph.directedEdge: could not find the "'.concat(e,'" target node in the graph.'));var r=n.out&&n.out[e]||void 0;return r?r.key:void 0}},i.undirectedEdge=function(t,e){if("directed"!==this.type){if(t=""+t,e=""+e,this.multi)throw new Y("Graph.undirectedEdge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.undirectedEdges instead.");var n=this._nodes.get(t);if(!n)throw new I('Graph.undirectedEdge: could not find the "'.concat(t,'" source node in the graph.'));if(!this._nodes.has(e))throw new I('Graph.undirectedEdge: could not find the "'.concat(e,'" target node in the graph.'));var r=n.undirected&&n.undirected[e]||void 0;return r?r.key:void 0}},i.edge=function(t,e){if(this.multi)throw new Y("Graph.edge: this method is irrelevant with multigraphs since there might be multiple edges between source & target. See #.edges instead.");t=""+t,e=""+e;var n=this._nodes.get(t);if(!n)throw new I('Graph.edge: could not find the "'.concat(t,'" source node in the graph.'));if(!this._nodes.has(e))throw new I('Graph.edge: could not find the "'.concat(e,'" target node in the graph.'));var r=n.out&&n.out[e]||n.undirected&&n.undirected[e]||void 0;if(r)return r.key},i.areDirectedNeighbors=function(t,e){t=""+t,e=""+e;var n=this._nodes.get(t);if(!n)throw new I('Graph.areDirectedNeighbors: could not find the "'.concat(t,'" node in the graph.'));return"undirected"!==this.type&&(e in n.in||e in n.out)},i.areOutNeighbors=function(t,e){t=""+t,e=""+e;var n=this._nodes.get(t);if(!n)throw new I('Graph.areOutNeighbors: could not find the "'.concat(t,'" node in the graph.'));return"undirected"!==this.type&&e in n.out},i.areInNeighbors=function(t,e){t=""+t,e=""+e;var n=this._nodes.get(t);if(!n)throw new I('Graph.areInNeighbors: could not find the "'.concat(t,'" node in the graph.'));return"undirected"!==this.type&&e in n.in},i.areUndirectedNeighbors=function(t,e){t=""+t,e=""+e;var n=this._nodes.get(t);if(!n)throw new I('Graph.areUndirectedNeighbors: could not find the "'.concat(t,'" node in the graph.'));return"directed"!==this.type&&e in n.undirected},i.areNeighbors=function(t,e){t=""+t,e=""+e;var n=this._nodes.get(t);if(!n)throw new I('Graph.areNeighbors: could not find the "'.concat(t,'" node in the graph.'));return"undirected"!==this.type&&(e in n.in||e in n.out)||"directed"!==this.type&&e in n.undirected},i.areInboundNeighbors=function(t,e){t=""+t,e=""+e;var n=this._nodes.get(t);if(!n)throw new I('Graph.areInboundNeighbors: could not find the "'.concat(t,'" node in the graph.'));return"undirected"!==this.type&&e in n.in||"directed"!==this.type&&e in n.undirected},i.areOutboundNeighbors=function(t,e){t=""+t,e=""+e;var n=this._nodes.get(t);if(!n)throw new I('Graph.areOutboundNeighbors: could not find the "'.concat(t,'" node in the graph.'));return"undirected"!==this.type&&e in n.out||"directed"!==this.type&&e in n.undirected},i.inDegree=function(t){t=""+t;var e=this._nodes.get(t);if(!e)throw new I('Graph.inDegree: could not find the "'.concat(t,'" node in the graph.'));return"undirected"===this.type?0:e.inDegree},i.outDegree=function(t){t=""+t;var e=this._nodes.get(t);if(!e)throw new I('Graph.outDegree: could not find the "'.concat(t,'" node in the graph.'));return"undirected"===this.type?0:e.outDegree},i.directedDegree=function(t){t=""+t;var e=this._nodes.get(t);if(!e)throw new I('Graph.directedDegree: could not find the "'.concat(t,'" node in the graph.'));return"undirected"===this.type?0:e.inDegree+e.outDegree},i.undirectedDegree=function(t){t=""+t;var e=this._nodes.get(t);if(!e)throw new I('Graph.undirectedDegree: could not find the "'.concat(t,'" node in the graph.'));return"directed"===this.type?0:e.undirectedDegree},i.inboundDegree=function(t){t=""+t;var e=this._nodes.get(t);if(!e)throw new I('Graph.inboundDegree: could not find the "'.concat(t,'" node in the graph.'));var n=0;return"directed"!==this.type&&(n+=e.undirectedDegree),"undirected"!==this.type&&(n+=e.inDegree),n},i.outboundDegree=function(t){t=""+t;var e=this._nodes.get(t);if(!e)throw new I('Graph.outboundDegree: could not find the "'.concat(t,'" node in the graph.'));var n=0;return"directed"!==this.type&&(n+=e.undirectedDegree),"undirected"!==this.type&&(n+=e.outDegree),n},i.degree=function(t){t=""+t;var e=this._nodes.get(t);if(!e)throw new I('Graph.degree: could not find the "'.concat(t,'" node in the graph.'));var n=0;return"directed"!==this.type&&(n+=e.undirectedDegree),"undirected"!==this.type&&(n+=e.inDegree+e.outDegree),n},i.inDegreeWithoutSelfLoops=function(t){t=""+t;var e=this._nodes.get(t);if(!e)throw new I('Graph.inDegreeWithoutSelfLoops: could not find the "'.concat(t,'" node in the graph.'));if("undirected"===this.type)return 0;var n=e.in[t],r=n?this.multi?n.size:1:0;return e.inDegree-r},i.outDegreeWithoutSelfLoops=function(t){t=""+t;var e=this._nodes.get(t);if(!e)throw new I('Graph.outDegreeWithoutSelfLoops: could not find the "'.concat(t,'" node in the graph.'));if("undirected"===this.type)return 0;var n=e.out[t],r=n?this.multi?n.size:1:0;return e.outDegree-r},i.directedDegreeWithoutSelfLoops=function(t){t=""+t;var e=this._nodes.get(t);if(!e)throw new I('Graph.directedDegreeWithoutSelfLoops: could not find the "'.concat(t,'" node in the graph.'));if("undirected"===this.type)return 0;var n=e.out[t],r=n?this.multi?n.size:1:0;return e.inDegree+e.outDegree-2*r},i.undirectedDegreeWithoutSelfLoops=function(t){t=""+t;var e=this._nodes.get(t);if(!e)throw new I('Graph.undirectedDegreeWithoutSelfLoops: could not find the "'.concat(t,'" node in the graph.'));if("directed"===this.type)return 0;var n=e.undirected[t],r=n?this.multi?n.size:1:0;return e.undirectedDegree-2*r},i.inboundDegreeWithoutSelfLoops=function(t){t=""+t;var e,n=this._nodes.get(t);if(!n)throw new I('Graph.inboundDegreeWithoutSelfLoops: could not find the "'.concat(t,'" node in the graph.'));var r=0,i=0;return"directed"!==this.type&&(r+=n.undirectedDegree,i+=2*((e=n.undirected[t])?this.multi?e.size:1:0)),"undirected"!==this.type&&(r+=n.inDegree,i+=(e=n.out[t])?this.multi?e.size:1:0),r-i},i.outboundDegreeWithoutSelfLoops=function(t){t=""+t;var e,n=this._nodes.get(t);if(!n)throw new I('Graph.outboundDegreeWithoutSelfLoops: could not find the "'.concat(t,'" node in the graph.'));var r=0,i=0;return"directed"!==this.type&&(r+=n.undirectedDegree,i+=2*((e=n.undirected[t])?this.multi?e.size:1:0)),"undirected"!==this.type&&(r+=n.outDegree,i+=(e=n.in[t])?this.multi?e.size:1:0),r-i},i.degreeWithoutSelfLoops=function(t){t=""+t;var e,n=this._nodes.get(t);if(!n)throw new I('Graph.degreeWithoutSelfLoops: could not find the "'.concat(t,'" node in the graph.'));var r=0,i=0;return"directed"!==this.type&&(r+=n.undirectedDegree,i+=2*((e=n.undirected[t])?this.multi?e.size:1:0)),"undirected"!==this.type&&(r+=n.inDegree+n.outDegree,i+=2*((e=n.out[t])?this.multi?e.size:1:0)),r-i},i.source=function(t){t=""+t;var e=this._edges.get(t);if(!e)throw new I('Graph.source: could not find the "'.concat(t,'" edge in the graph.'));return e.source.key},i.target=function(t){t=""+t;var e=this._edges.get(t);if(!e)throw new I('Graph.target: could not find the "'.concat(t,'" edge in the graph.'));return e.target.key},i.extremities=function(t){t=""+t;var e=this._edges.get(t);if(!e)throw new I('Graph.extremities: could not find the "'.concat(t,'" edge in the graph.'));return[e.source.key,e.target.key]},i.opposite=function(t,e){t=""+t,e=""+e;var n=this._edges.get(e);if(!n)throw new I('Graph.opposite: could not find the "'.concat(e,'" edge in the graph.'));var r=n.source.key,i=n.target.key;if(t===r)return i;if(t===i)return r;throw new I('Graph.opposite: the "'.concat(t,'" node is not attached to the "').concat(e,'" edge (').concat(r,", ").concat(i,")."))},i.hasExtremity=function(t,e){t=""+t,e=""+e;var n=this._edges.get(t);if(!n)throw new I('Graph.hasExtremity: could not find the "'.concat(t,'" edge in the graph.'));return n.source.key===e||n.target.key===e},i.isUndirected=function(t){t=""+t;var e=this._edges.get(t);if(!e)throw new I('Graph.isUndirected: could not find the "'.concat(t,'" edge in the graph.'));return e.undirected},i.isDirected=function(t){t=""+t;var e=this._edges.get(t);if(!e)throw new I('Graph.isDirected: could not find the "'.concat(t,'" edge in the graph.'));return!e.undirected},i.isSelfLoop=function(t){t=""+t;var e=this._edges.get(t);if(!e)throw new I('Graph.isSelfLoop: could not find the "'.concat(t,'" edge in the graph.'));return e.source===e.target},i.addNode=function(t,e){var n=function(t,e,n){if(n&&!h(n))throw new F('Graph.addNode: invalid attributes. Expecting an object but got "'.concat(n,'"'));if(e=""+e,n=n||{},t._nodes.has(e))throw new Y('Graph.addNode: the "'.concat(e,'" node already exist in the graph.'));var r=new t.NodeDataClass(e,n);return t._nodes.set(e,r),t.emit("nodeAdded",{key:e,attributes:n}),r}(this,t,e);return n.key},i.mergeNode=function(t,e){if(e&&!h(e))throw new F('Graph.mergeNode: invalid attributes. Expecting an object but got "'.concat(e,'"'));t=""+t,e=e||{};var n=this._nodes.get(t);return n?(e&&(c(n.attributes,e),this.emit("nodeAttributesUpdated",{type:"merge",key:t,attributes:n.attributes,data:e})),[t,!1]):(n=new this.NodeDataClass(t,e),this._nodes.set(t,n),this.emit("nodeAdded",{key:t,attributes:e}),[t,!0])},i.updateNode=function(t,e){if(e&&"function"!=typeof e)throw new F('Graph.updateNode: invalid updater function. Expecting a function but got "'.concat(e,'"'));t=""+t;var n=this._nodes.get(t);if(n){if(e){var r=n.attributes;n.attributes=e(r),this.emit("nodeAttributesUpdated",{type:"replace",key:t,attributes:n.attributes})}return[t,!1]}var i=e?e({}):{};return n=new this.NodeDataClass(t,i),this._nodes.set(t,n),this.emit("nodeAdded",{key:t,attributes:i}),[t,!0]},i.dropNode=function(t){t=""+t;var e,n=this._nodes.get(t);if(!n)throw new I('Graph.dropNode: could not find the "'.concat(t,'" node in the graph.'));if("undirected"!==this.type){for(var r in n.out){e=n.out[r];do{Mt(this,e),e=e.next}while(e)}for(var i in n.in){e=n.in[i];do{Mt(this,e),e=e.next}while(e)}}if("directed"!==this.type)for(var o in n.undirected){e=n.undirected[o];do{Mt(this,e),e=e.next}while(e)}this._nodes.delete(t),this.emit("nodeDropped",{key:t,attributes:n.attributes})},i.dropEdge=function(t){var e;if(arguments.length>1){var n=""+arguments[0],r=""+arguments[1];if(!(e=s(this,n,r,this.type)))throw new I('Graph.dropEdge: could not find the "'.concat(n,'" -> "').concat(r,'" edge in the graph.'))}else if(t=""+t,!(e=this._edges.get(t)))throw new I('Graph.dropEdge: could not find the "'.concat(t,'" edge in the graph.'));return Mt(this,e),this},i.dropDirectedEdge=function(t,e){if(arguments.length<2)throw new Y("Graph.dropDirectedEdge: it does not make sense to try and drop a directed edge by key. What if the edge with this key is undirected? Use #.dropEdge for this purpose instead.");if(this.multi)throw new Y("Graph.dropDirectedEdge: cannot use a {source,target} combo when dropping an edge in a MultiGraph since we cannot infer the one you want to delete as there could be multiple ones.");var n=s(this,t=""+t,e=""+e,"directed");if(!n)throw new I('Graph.dropDirectedEdge: could not find a "'.concat(t,'" -> "').concat(e,'" edge in the graph.'));return Mt(this,n),this},i.dropUndirectedEdge=function(t,e){if(arguments.length<2)throw new Y("Graph.dropUndirectedEdge: it does not make sense to drop a directed edge by key. What if the edge with this key is undirected? Use #.dropEdge for this purpose instead.");if(this.multi)throw new Y("Graph.dropUndirectedEdge: cannot use a {source,target} combo when dropping an edge in a MultiGraph since we cannot infer the one you want to delete as there could be multiple ones.");var n=s(this,t,e,"undirected");if(!n)throw new I('Graph.dropUndirectedEdge: could not find a "'.concat(t,'" -> "').concat(e,'" edge in the graph.'));return Mt(this,n),this},i.clear=function(){this._edges.clear(),this._nodes.clear(),this._resetInstanceCounters(),this.emit("cleared")},i.clearEdges=function(){for(var t,e=this._nodes.values();!0!==(t=e.next()).done;)t.value.clear();this._edges.clear(),this._resetInstanceCounters(),this.emit("edgesCleared")},i.getAttribute=function(t){return this._attributes[t]},i.getAttributes=function(){return this._attributes},i.hasAttribute=function(t){return this._attributes.hasOwnProperty(t)},i.setAttribute=function(t,e){return this._attributes[t]=e,this.emit("attributesUpdated",{type:"set",attributes:this._attributes,name:t}),this},i.updateAttribute=function(t,e){if("function"!=typeof e)throw new F("Graph.updateAttribute: updater should be a function.");var n=this._attributes[t];return this._attributes[t]=e(n),this.emit("attributesUpdated",{type:"set",attributes:this._attributes,name:t}),this},i.removeAttribute=function(t){return delete this._attributes[t],this.emit("attributesUpdated",{type:"remove",attributes:this._attributes,name:t}),this},i.replaceAttributes=function(t){if(!h(t))throw new F("Graph.replaceAttributes: provided attributes are not a plain object.");return this._attributes=t,this.emit("attributesUpdated",{type:"replace",attributes:this._attributes}),this},i.mergeAttributes=function(t){if(!h(t))throw new F("Graph.mergeAttributes: provided attributes are not a plain object.");return c(this._attributes,t),this.emit("attributesUpdated",{type:"merge",attributes:this._attributes,data:t}),this},i.updateAttributes=function(t){if("function"!=typeof t)throw new F("Graph.updateAttributes: provided updater is not a function.");return this._attributes=t(this._attributes),this.emit("attributesUpdated",{type:"update",attributes:this._attributes}),this},i.updateEachNodeAttributes=function(t,e){if("function"!=typeof t)throw new F("Graph.updateEachNodeAttributes: expecting an updater function.");if(e&&!g(e))throw new F("Graph.updateEachNodeAttributes: invalid hints. Expecting an object having the following shape: {attributes?: [string]}");for(var n,r,i=this._nodes.values();!0!==(n=i.next()).done;)(r=n.value).attributes=t(r.key,r.attributes);this.emit("eachNodeAttributesUpdated",{hints:e||null})},i.updateEachEdgeAttributes=function(t,e){if("function"!=typeof t)throw new F("Graph.updateEachEdgeAttributes: expecting an updater function.");if(e&&!g(e))throw new F("Graph.updateEachEdgeAttributes: invalid hints. Expecting an object having the following shape: {attributes?: [string]}");for(var n,r,i,o,a=this._edges.values();!0!==(n=a.next()).done;)i=(r=n.value).source,o=r.target,r.attributes=t(r.key,r.attributes,i.key,o.key,i.attributes,o.attributes,r.undirected);this.emit("eachEdgeAttributesUpdated",{hints:e||null})},i.forEachAdjacencyEntry=function(t){if("function"!=typeof t)throw new F("Graph.forEachAdjacencyEntry: expecting a callback.");Et(!1,!1,!1,this,t)},i.forEachAdjacencyEntryWithOrphans=function(t){if("function"!=typeof t)throw new F("Graph.forEachAdjacencyEntryWithOrphans: expecting a callback.");Et(!1,!1,!0,this,t)},i.forEachAssymetricAdjacencyEntry=function(t){if("function"!=typeof t)throw new F("Graph.forEachAssymetricAdjacencyEntry: expecting a callback.");Et(!1,!0,!1,this,t)},i.forEachAssymetricAdjacencyEntryWithOrphans=function(t){if("function"!=typeof t)throw new F("Graph.forEachAssymetricAdjacencyEntryWithOrphans: expecting a callback.");Et(!1,!0,!0,this,t)},i.nodes=function(){return"function"==typeof Array.from?Array.from(this._nodes.keys()):T(this._nodes.keys(),this._nodes.size)},i.forEachNode=function(t){if("function"!=typeof t)throw new F("Graph.forEachNode: expecting a callback.");for(var e,n,r=this._nodes.values();!0!==(e=r.next()).done;)t((n=e.value).key,n.attributes)},i.findNode=function(t){if("function"!=typeof t)throw new F("Graph.findNode: expecting a callback.");for(var e,n,r=this._nodes.values();!0!==(e=r.next()).done;)if(t((n=e.value).key,n.attributes))return n.key},i.mapNodes=function(t){if("function"!=typeof t)throw new F("Graph.mapNode: expecting a callback.");for(var e,n,r=this._nodes.values(),i=new Array(this.order),o=0;!0!==(e=r.next()).done;)n=e.value,i[o++]=t(n.key,n.attributes);return i},i.someNode=function(t){if("function"!=typeof t)throw new F("Graph.someNode: expecting a callback.");for(var e,n,r=this._nodes.values();!0!==(e=r.next()).done;)if(t((n=e.value).key,n.attributes))return!0;return!1},i.everyNode=function(t){if("function"!=typeof t)throw new F("Graph.everyNode: expecting a callback.");for(var e,n,r=this._nodes.values();!0!==(e=r.next()).done;)if(!t((n=e.value).key,n.attributes))return!1;return!0},i.filterNodes=function(t){if("function"!=typeof t)throw new F("Graph.filterNodes: expecting a callback.");for(var e,n,r=this._nodes.values(),i=[];!0!==(e=r.next()).done;)t((n=e.value).key,n.attributes)&&i.push(n.key);return i},i.reduceNodes=function(t,e){if("function"!=typeof t)throw new F("Graph.reduceNodes: expecting a callback.");if(arguments.length<2)throw new F("Graph.reduceNodes: missing initial value. You must provide it because the callback takes more than one argument and we cannot infer the initial value from the first iteration, as you could with a simple array.");for(var n,r,i=e,o=this._nodes.values();!0!==(n=o.next()).done;)i=t(i,(r=n.value).key,r.attributes);return i},i.nodeEntries=function(){var t=this._nodes.values();return new O((function(){var e=t.next();if(e.done)return e;var n=e.value;return{value:{node:n.key,attributes:n.attributes},done:!1}}))},i.export=function(){var t=new Array(this._nodes.size),e=0;this._nodes.forEach((function(n,r){t[e++]=function(t,e){var n={key:t};return p(e.attributes)||(n.attributes=c({},e.attributes)),n}(r,n)}));var n=new Array(this._edges.size);return e=0,this._edges.forEach((function(t,r){n[e++]=function(t,e){var n={key:t,source:e.source.key,target:e.target.key};return p(e.attributes)||(n.attributes=c({},e.attributes)),e.undirected&&(n.undirected=!0),n}(r,t)})),{options:{type:this.type,multi:this.multi,allowSelfLoops:this.allowSelfLoops},attributes:this.getAttributes(),nodes:t,edges:n}},i.import=function(t){var e,n,r,i,o,a=this,u=arguments.length>1&&void 0!==arguments[1]&&arguments[1];if(d(t))return t.forEachNode((function(t,e){u?a.mergeNode(t,e):a.addNode(t,e)})),t.forEachEdge((function(t,e,n,r,i,o,c){u?c?a.mergeUndirectedEdgeWithKey(t,n,r,e):a.mergeDirectedEdgeWithKey(t,n,r,e):c?a.addUndirectedEdgeWithKey(t,n,r,e):a.addDirectedEdgeWithKey(t,n,r,e)})),this;if(!h(t))throw new F("Graph.import: invalid argument. Expecting a serialized graph or, alternatively, a Graph instance.");if(t.attributes){if(!h(t.attributes))throw new F("Graph.import: invalid attributes. Expecting a plain object.");u?this.mergeAttributes(t.attributes):this.replaceAttributes(t.attributes)}if(t.nodes){if(r=t.nodes,!Array.isArray(r))throw new F("Graph.import: invalid nodes. Expecting an array.");for(e=0,n=r.length;e<n;e++){At(i=r[e]);var c=i,s=c.key,p=c.attributes;u?this.mergeNode(s,p):this.addNode(s,p)}}if(t.edges){if(r=t.edges,!Array.isArray(r))throw new F("Graph.import: invalid edges. Expecting an array.");for(e=0,n=r.length;e<n;e++){St(o=r[e]);var f=o,l=f.source,g=f.target,y=f.attributes,w=f.undirected,v=void 0!==w&&w;"key"in o?(u?v?this.mergeUndirectedEdgeWithKey:this.mergeDirectedEdgeWithKey:v?this.addUndirectedEdgeWithKey:this.addDirectedEdgeWithKey).call(this,o.key,l,g,y):(u?v?this.mergeUndirectedEdge:this.mergeDirectedEdge:v?this.addUndirectedEdge:this.addDirectedEdge).call(this,l,g,y)}}return this},i.nullCopy=function(t){var e=new r(c({},this._options,t));return e.replaceAttributes(c({},this.getAttributes())),e},i.emptyCopy=function(t){var e=this.nullCopy(t);return this._nodes.forEach((function(t,n){var r=c({},t.attributes);t=new e.NodeDataClass(n,r),e._nodes.set(n,t)})),e},i.copy=function(t){if("string"==typeof(t=t||{}).type&&t.type!==this.type&&"mixed"!==t.type)throw new Y('Graph.copy: cannot create an incompatible copy from "'.concat(this.type,'" type to "').concat(t.type,'" because this would mean losing information about the current graph.'));if("boolean"==typeof t.multi&&t.multi!==this.multi&&!0!==t.multi)throw new Y("Graph.copy: cannot create an incompatible copy by downgrading a multi graph to a simple one because this would mean losing information about the current graph.");if("boolean"==typeof t.allowSelfLoops&&t.allowSelfLoops!==this.allowSelfLoops&&!0!==t.allowSelfLoops)throw new Y("Graph.copy: cannot create an incompatible copy from a graph allowing self loops to one that does not because this would mean losing information about the current graph.");for(var e,n,r=this.emptyCopy(t),i=this._edges.values();!0!==(e=i.next()).done;)Ct(r,"copy",!1,(n=e.value).undirected,n.key,n.source.key,n.target.key,c({},n.attributes));return r},i.toJSON=function(){return this.export()},i.toString=function(){return"[object Graph]"},i.inspect=function(){var e=this,n={};this._nodes.forEach((function(t,e){n[e]=t.attributes}));var r={},i={};this._edges.forEach((function(t,n){var o,a=t.undirected?"--":"->",u="",c=t.source.key,s=t.target.key;t.undirected&&c>s&&(o=c,c=s,s=o);var d="(".concat(c,")").concat(a,"(").concat(s,")");n.startsWith("geid_")?e.multi&&(void 0===i[d]?i[d]=0:i[d]++,u+="".concat(i[d],". ")):u+="[".concat(n,"]: "),r[u+=d]=t.attributes}));var o={};for(var a in this)this.hasOwnProperty(a)&&!Nt.has(a)&&"function"!=typeof this[a]&&"symbol"!==t(a)&&(o[a]=this[a]);return o.attributes=this._attributes,o.nodes=n,o.edges=r,f(o,"constructor",this.constructor),o},r}(w.exports.EventEmitter);"undefined"!=typeof Symbol&&(Wt.prototype[Symbol.for("nodejs.util.inspect.custom")]=Wt.prototype.inspect),[{name:function(t){return"".concat(t,"Edge")},generateKey:!0},{name:function(t){return"".concat(t,"DirectedEdge")},generateKey:!0,type:"directed"},{name:function(t){return"".concat(t,"UndirectedEdge")},generateKey:!0,type:"undirected"},{name:function(t){return"".concat(t,"EdgeWithKey")}},{name:function(t){return"".concat(t,"DirectedEdgeWithKey")},type:"directed"},{name:function(t){return"".concat(t,"UndirectedEdgeWithKey")},type:"undirected"}].forEach((function(t){["add","merge","update"].forEach((function(e){var n=t.name(e),r="add"===e?Ct:zt;t.generateKey?Wt.prototype[n]=function(i,o,a){return r(this,n,!0,"undirected"===(t.type||this.type),null,i,o,a,"update"===e)}:Wt.prototype[n]=function(i,o,a,u){return r(this,n,!1,"undirected"===(t.type||this.type),i,o,a,u,"update"===e)}}))})),function(t){X.forEach((function(e){var n=e.name,r=e.attacher;r(t,n("Node"),0),r(t,n("Source"),1),r(t,n("Target"),2),r(t,n("Opposite"),3)}))}(Wt),function(t){Z.forEach((function(e){var n=e.name,r=e.attacher;r(t,n("Edge"),"mixed"),r(t,n("DirectedEdge"),"directed"),r(t,n("UndirectedEdge"),"undirected")}))}(Wt),function(t){nt.forEach((function(e){!function(t,e){var n=e.name,r=e.type,i=e.direction;t.prototype[n]=function(t,e){if("mixed"!==r&&"mixed"!==this.type&&r!==this.type)return[];if(!arguments.length)return st(this,r);if(1===arguments.length){t=""+t;var o=this._nodes.get(t);if(void 0===o)throw new I("Graph.".concat(n,': could not find the "').concat(t,'" node in the graph.'));return ft(this.multi,"mixed"===r?this.type:r,i,o)}if(2===arguments.length){t=""+t,e=""+e;var a=this._nodes.get(t);if(!a)throw new I("Graph.".concat(n,':  could not find the "').concat(t,'" source node in the graph.'));if(!this._nodes.has(e))throw new I("Graph.".concat(n,':  could not find the "').concat(e,'" target node in the graph.'));return yt(r,this.multi,i,a,e)}throw new F("Graph.".concat(n,": too many arguments (expecting 0, 1 or 2 and got ").concat(arguments.length,")."))}}(t,e),function(t,e){var n=e.name,r=e.type,i=e.direction,o="forEach"+n[0].toUpperCase()+n.slice(1,-1);t.prototype[o]=function(t,e,n){if("mixed"===r||"mixed"===this.type||r===this.type){if(1===arguments.length)return dt(!1,this,r,n=t);if(2===arguments.length){t=""+t,n=e;var a=this._nodes.get(t);if(void 0===a)throw new I("Graph.".concat(o,': could not find the "').concat(t,'" node in the graph.'));return pt(!1,this.multi,"mixed"===r?this.type:r,i,a,n)}if(3===arguments.length){t=""+t,e=""+e;var u=this._nodes.get(t);if(!u)throw new I("Graph.".concat(o,':  could not find the "').concat(t,'" source node in the graph.'));if(!this._nodes.has(e))throw new I("Graph.".concat(o,':  could not find the "').concat(e,'" target node in the graph.'));return gt(!1,r,this.multi,i,u,e,n)}throw new F("Graph.".concat(o,": too many arguments (expecting 1, 2 or 3 and got ").concat(arguments.length,")."))}};var a="map"+n[0].toUpperCase()+n.slice(1);t.prototype[a]=function(){var t,e=Array.prototype.slice.call(arguments),n=e.pop();if(0===e.length){var i=0;"directed"!==r&&(i+=this.undirectedSize),"undirected"!==r&&(i+=this.directedSize),t=new Array(i);var a=0;e.push((function(e,r,i,o,u,c,s){t[a++]=n(e,r,i,o,u,c,s)}))}else t=[],e.push((function(e,r,i,o,a,u,c){t.push(n(e,r,i,o,a,u,c))}));return this[o].apply(this,e),t};var u="filter"+n[0].toUpperCase()+n.slice(1);t.prototype[u]=function(){var t=Array.prototype.slice.call(arguments),e=t.pop(),n=[];return t.push((function(t,r,i,o,a,u,c){e(t,r,i,o,a,u,c)&&n.push(t)})),this[o].apply(this,t),n};var c="reduce"+n[0].toUpperCase()+n.slice(1);t.prototype[c]=function(){var t,e,n=Array.prototype.slice.call(arguments);if(n.length<2||n.length>4)throw new F("Graph.".concat(c,": invalid number of arguments (expecting 2, 3 or 4 and got ").concat(n.length,")."));if("function"==typeof n[n.length-1]&&"function"!=typeof n[n.length-2])throw new F("Graph.".concat(c,": missing initial value. You must provide it because the callback takes more than one argument and we cannot infer the initial value from the first iteration, as you could with a simple array."));2===n.length?(t=n[0],e=n[1],n=[]):3===n.length?(t=n[1],e=n[2],n=[n[0]]):4===n.length&&(t=n[2],e=n[3],n=[n[0],n[1]]);var r=e;return n.push((function(e,n,i,o,a,u,c){r=t(r,e,n,i,o,a,u,c)})),this[o].apply(this,n),r}}(t,e),function(t,e){var n=e.name,r=e.type,i=e.direction,o="find"+n[0].toUpperCase()+n.slice(1,-1);t.prototype[o]=function(t,e,n){if("mixed"!==r&&"mixed"!==this.type&&r!==this.type)return!1;if(1===arguments.length)return dt(!0,this,r,n=t);if(2===arguments.length){t=""+t,n=e;var a=this._nodes.get(t);if(void 0===a)throw new I("Graph.".concat(o,': could not find the "').concat(t,'" node in the graph.'));return pt(!0,this.multi,"mixed"===r?this.type:r,i,a,n)}if(3===arguments.length){t=""+t,e=""+e;var u=this._nodes.get(t);if(!u)throw new I("Graph.".concat(o,':  could not find the "').concat(t,'" source node in the graph.'));if(!this._nodes.has(e))throw new I("Graph.".concat(o,':  could not find the "').concat(e,'" target node in the graph.'));return gt(!0,r,this.multi,i,u,e,n)}throw new F("Graph.".concat(o,": too many arguments (expecting 1, 2 or 3 and got ").concat(arguments.length,")."))};var a="some"+n[0].toUpperCase()+n.slice(1,-1);t.prototype[a]=function(){var t=Array.prototype.slice.call(arguments),e=t.pop();return t.push((function(t,n,r,i,o,a,u){return e(t,n,r,i,o,a,u)})),!!this[o].apply(this,t)};var u="every"+n[0].toUpperCase()+n.slice(1,-1);t.prototype[u]=function(){var t=Array.prototype.slice.call(arguments),e=t.pop();return t.push((function(t,n,r,i,o,a,u){return!e(t,n,r,i,o,a,u)})),!this[o].apply(this,t)}}(t,e),function(t,e){var n=e.name,r=e.type,i=e.direction,o=n.slice(0,-1)+"Entries";t.prototype[o]=function(t,e){if("mixed"!==r&&"mixed"!==this.type&&r!==this.type)return O.empty();if(!arguments.length)return ht(this,r);if(1===arguments.length){t=""+t;var n=this._nodes.get(t);if(!n)throw new I("Graph.".concat(o,': could not find the "').concat(t,'" node in the graph.'));return lt(r,i,n)}if(2===arguments.length){t=""+t,e=""+e;var a=this._nodes.get(t);if(!a)throw new I("Graph.".concat(o,':  could not find the "').concat(t,'" source node in the graph.'));if(!this._nodes.has(e))throw new I("Graph.".concat(o,':  could not find the "').concat(e,'" target node in the graph.'));return wt(r,i,a,e)}throw new F("Graph.".concat(o,": too many arguments (expecting 0, 1 or 2 and got ").concat(arguments.length,")."))}}(t,e)}))}(Wt),function(t){vt.forEach((function(e){Gt(t,e),function(t,e){var n=e.name,r=e.type,i=e.direction,o="forEach"+n[0].toUpperCase()+n.slice(1,-1);t.prototype[o]=function(t,e){if("mixed"===r||"mixed"===this.type||r===this.type){t=""+t;var n=this._nodes.get(t);if(void 0===n)throw new I("Graph.".concat(o,': could not find the "').concat(t,'" node in the graph.'));kt(!1,"mixed"===r?this.type:r,i,n,e)}};var a="map"+n[0].toUpperCase()+n.slice(1);t.prototype[a]=function(t,e){var n=[];return this[o](t,(function(t,r){n.push(e(t,r))})),n};var u="filter"+n[0].toUpperCase()+n.slice(1);t.prototype[u]=function(t,e){var n=[];return this[o](t,(function(t,r){e(t,r)&&n.push(t)})),n};var c="reduce"+n[0].toUpperCase()+n.slice(1);t.prototype[c]=function(t,e,n){if(arguments.length<3)throw new F("Graph.".concat(c,": missing initial value. You must provide it because the callback takes more than one argument and we cannot infer the initial value from the first iteration, as you could with a simple array."));var r=n;return this[o](t,(function(t,n){r=e(r,t,n)})),r}}(t,e),function(t,e){var n=e.name,r=e.type,i=e.direction,o=n[0].toUpperCase()+n.slice(1,-1),a="find"+o;t.prototype[a]=function(t,e){if("mixed"===r||"mixed"===this.type||r===this.type){t=""+t;var n=this._nodes.get(t);if(void 0===n)throw new I("Graph.".concat(a,': could not find the "').concat(t,'" node in the graph.'));return kt(!0,"mixed"===r?this.type:r,i,n,e)}};var u="some"+o;t.prototype[u]=function(t,e){return!!this[a](t,e)};var c="every"+o;t.prototype[c]=function(t,e){return!this[a](t,(function(t,n){return!e(t,n)}))}}(t,e),xt(t,e)}))}(Wt);var Pt=function(t){function n(e){var n=c({type:"directed"},e);if("multi"in n&&!1!==n.multi)throw new F("DirectedGraph.from: inconsistent indication that the graph should be multi in given options!");if("directed"!==n.type)throw new F('DirectedGraph.from: inconsistent "'+n.type+'" type in given options!');return t.call(this,n)||this}return e(n,t),n}(Wt),Rt=function(t){function n(e){var n=c({type:"undirected"},e);if("multi"in n&&!1!==n.multi)throw new F("UndirectedGraph.from: inconsistent indication that the graph should be multi in given options!");if("undirected"!==n.type)throw new F('UndirectedGraph.from: inconsistent "'+n.type+'" type in given options!');return t.call(this,n)||this}return e(n,t),n}(Wt),Kt=function(t){function n(e){var n=c({multi:!0},e);if("multi"in n&&!0!==n.multi)throw new F("MultiGraph.from: inconsistent indication that the graph should be simple in given options!");return t.call(this,n)||this}return e(n,t),n}(Wt),Tt=function(t){function n(e){var n=c({type:"directed",multi:!0},e);if("multi"in n&&!0!==n.multi)throw new F("MultiDirectedGraph.from: inconsistent indication that the graph should be simple in given options!");if("directed"!==n.type)throw new F('MultiDirectedGraph.from: inconsistent "'+n.type+'" type in given options!');return t.call(this,n)||this}return e(n,t),n}(Wt),Bt=function(t){function n(e){var n=c({type:"undirected",multi:!0},e);if("multi"in n&&!0!==n.multi)throw new F("MultiUndirectedGraph.from: inconsistent indication that the graph should be simple in given options!");if("undirected"!==n.type)throw new F('MultiUndirectedGraph.from: inconsistent "'+n.type+'" type in given options!');return t.call(this,n)||this}return e(n,t),n}(Wt);function Ft(t){t.from=function(e,n){var r=c({},e.options,n),i=new t(r);return i.import(e),i}}return Ft(Wt),Ft(Pt),Ft(Rt),Ft(Kt),Ft(Tt),Ft(Bt),Wt.Graph=Wt,Wt.DirectedGraph=Pt,Wt.UndirectedGraph=Rt,Wt.MultiGraph=Kt,Wt.MultiDirectedGraph=Tt,Wt.MultiUndirectedGraph=Bt,Wt.InvalidArgumentsGraphError=F,Wt.NotFoundGraphError=I,Wt.UsageGraphError=Y,Wt}));


},{}],38:[function(require,module,exports){
/**
 * Pandemonium Random
 * ===================
 *
 * Random function.
 */

/**
 * Creating a function returning a random integer such as a <= N <= b.
 *
 * @param  {function} rng - RNG function returning uniform random.
 * @return {function}     - The created function.
 */
function createRandom(rng) {

  /**
   * Random function.
   *
   * @param  {number} a - From.
   * @param  {number} b - To.
   * @return {number}
   */
  return function(a, b) {
    return a + Math.floor(rng() * (b - a + 1));
  };
}

/**
 * Default random using `Math.random`.
 */
var random = createRandom(Math.random);

/**
 * Exporting.
 */
random.createRandom = createRandom;
module.exports = random;

},{}],39:[function(require,module,exports){
/**
 * Pandemonium Shuffle In Place
 * =============================
 *
 * Shuffle function applying the Fisher-Yates algorithm to the provided array.
 */
var createRandom = require('./random.js').createRandom;

/**
 * Creating a function returning the given array shuffled.
 *
 * @param  {function} rng - The RNG to use.
 * @return {function}     - The created function.
 */
function createShuffleInPlace(rng) {
  var customRandom = createRandom(rng);

  /**
   * Function returning the shuffled array.
   *
   * @param  {array}  sequence - Target sequence.
   * @return {array}           - The shuffled sequence.
   */
  return function(sequence) {
    var length = sequence.length,
        lastIndex = length - 1;

    var index = -1;

    while (++index < length) {
      var r = customRandom(index, lastIndex),
          value = sequence[r];

      sequence[r] = sequence[index];
      sequence[index] = value;
    }
  };
}

/**
 * Default shuffle in place using `Math.random`.
 */
var shuffleInPlace = createShuffleInPlace(Math.random);

/**
 * Exporting.
 */
shuffleInPlace.createShuffleInPlace = createShuffleInPlace;
module.exports = shuffleInPlace;

},{"./random.js":38}],40:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Sigma.js Camera Class
 * ======================
 *
 * Class designed to store camera information & used to update it.
 * @module
 */
var animate_1 = require("../utils/animate");
var easings_1 = __importDefault(require("../utils/easings"));
var utils_1 = require("../utils");
var types_1 = require("../types");
/**
 * Defaults.
 */
var DEFAULT_ZOOMING_RATIO = 1.5;
/**
 * Camera class
 *
 * @constructor
 */
var Camera = /** @class */ (function (_super) {
    __extends(Camera, _super);
    function Camera() {
        var _this = _super.call(this) || this;
        _this.x = 0.5;
        _this.y = 0.5;
        _this.angle = 0;
        _this.ratio = 1;
        _this.minRatio = null;
        _this.maxRatio = null;
        _this.nextFrame = null;
        _this.previousState = null;
        _this.enabled = true;
        // State
        _this.previousState = _this.getState();
        return _this;
    }
    /**
     * Static method used to create a Camera object with a given state.
     *
     * @param state
     * @return {Camera}
     */
    Camera.from = function (state) {
        var camera = new Camera();
        return camera.setState(state);
    };
    /**
     * Method used to enable the camera.
     *
     * @return {Camera}
     */
    Camera.prototype.enable = function () {
        this.enabled = true;
        return this;
    };
    /**
     * Method used to disable the camera.
     *
     * @return {Camera}
     */
    Camera.prototype.disable = function () {
        this.enabled = false;
        return this;
    };
    /**
     * Method used to retrieve the camera's current state.
     *
     * @return {object}
     */
    Camera.prototype.getState = function () {
        return {
            x: this.x,
            y: this.y,
            angle: this.angle,
            ratio: this.ratio,
        };
    };
    /**
     * Method used to check whether the camera has the given state.
     *
     * @return {object}
     */
    Camera.prototype.hasState = function (state) {
        return this.x === state.x && this.y === state.y && this.ratio === state.ratio && this.angle === state.angle;
    };
    /**
     * Method used to retrieve the camera's previous state.
     *
     * @return {object}
     */
    Camera.prototype.getPreviousState = function () {
        var state = this.previousState;
        if (!state)
            return null;
        return {
            x: state.x,
            y: state.y,
            angle: state.angle,
            ratio: state.ratio,
        };
    };
    /**
     * Method used to check minRatio and maxRatio values.
     *
     * @param ratio
     * @return {number}
     */
    Camera.prototype.getBoundedRatio = function (ratio) {
        var r = ratio;
        if (typeof this.minRatio === "number")
            r = Math.max(r, this.minRatio);
        if (typeof this.maxRatio === "number")
            r = Math.min(r, this.maxRatio);
        return r;
    };
    /**
     * Method used to check various things to return a legit state candidate.
     *
     * @param state
     * @return {object}
     */
    Camera.prototype.validateState = function (state) {
        var validatedState = {};
        if (typeof state.x === "number")
            validatedState.x = state.x;
        if (typeof state.y === "number")
            validatedState.y = state.y;
        if (typeof state.angle === "number")
            validatedState.angle = state.angle;
        if (typeof state.ratio === "number")
            validatedState.ratio = this.getBoundedRatio(state.ratio);
        return validatedState;
    };
    /**
     * Method used to check whether the camera is currently being animated.
     *
     * @return {boolean}
     */
    Camera.prototype.isAnimated = function () {
        return !!this.nextFrame;
    };
    /**
     * Method used to set the camera's state.
     *
     * @param  {object} state - New state.
     * @return {Camera}
     */
    Camera.prototype.setState = function (state) {
        if (!this.enabled)
            return this;
        // TODO: update by function
        // Keeping track of last state
        this.previousState = this.getState();
        var validState = this.validateState(state);
        if (typeof validState.x === "number")
            this.x = validState.x;
        if (typeof validState.y === "number")
            this.y = validState.y;
        if (typeof validState.angle === "number")
            this.angle = validState.angle;
        if (typeof validState.ratio === "number")
            this.ratio = validState.ratio;
        // Emitting
        if (!this.hasState(this.previousState))
            this.emit("updated", this.getState());
        return this;
    };
    /**
     * Method used to animate the camera.
     *
     * @param  {object}                    state      - State to reach eventually.
     * @param  {object}                    opts       - Options:
     * @param  {number}                      duration - Duration of the animation.
     * @param  {string | number => number}   easing   - Easing function or name of an existing one
     * @param  {function}                  callback   - Callback
     */
    Camera.prototype.animate = function (state, opts, callback) {
        var _this = this;
        if (!this.enabled)
            return;
        var options = Object.assign({}, animate_1.ANIMATE_DEFAULTS, opts);
        var validState = this.validateState(state);
        var easing = typeof options.easing === "function" ? options.easing : easings_1.default[options.easing];
        // State
        var start = Date.now(), initialState = this.getState();
        // Function performing the animation
        var fn = function () {
            var t = (Date.now() - start) / options.duration;
            // The animation is over:
            if (t >= 1) {
                _this.nextFrame = null;
                _this.setState(validState);
                if (_this.animationCallback) {
                    _this.animationCallback.call(null);
                    _this.animationCallback = undefined;
                }
                return;
            }
            var coefficient = easing(t);
            var newState = {};
            if (typeof validState.x === "number")
                newState.x = initialState.x + (validState.x - initialState.x) * coefficient;
            if (typeof validState.y === "number")
                newState.y = initialState.y + (validState.y - initialState.y) * coefficient;
            if (typeof validState.angle === "number")
                newState.angle = initialState.angle + (validState.angle - initialState.angle) * coefficient;
            if (typeof validState.ratio === "number")
                newState.ratio = initialState.ratio + (validState.ratio - initialState.ratio) * coefficient;
            _this.setState(newState);
            _this.nextFrame = (0, utils_1.requestFrame)(fn);
        };
        if (this.nextFrame) {
            (0, utils_1.cancelFrame)(this.nextFrame);
            if (this.animationCallback)
                this.animationCallback.call(null);
            this.nextFrame = (0, utils_1.requestFrame)(fn);
        }
        else {
            fn();
        }
        this.animationCallback = callback;
    };
    /**
     * Method used to zoom the camera.
     *
     * @param  {number|object} factorOrOptions - Factor or options.
     * @return {function}
     */
    Camera.prototype.animatedZoom = function (factorOrOptions) {
        if (!factorOrOptions) {
            this.animate({ ratio: this.ratio / DEFAULT_ZOOMING_RATIO });
        }
        else {
            if (typeof factorOrOptions === "number")
                return this.animate({ ratio: this.ratio / factorOrOptions });
            else
                this.animate({
                    ratio: this.ratio / (factorOrOptions.factor || DEFAULT_ZOOMING_RATIO),
                }, factorOrOptions);
        }
    };
    /**
     * Method used to unzoom the camera.
     *
     * @param  {number|object} factorOrOptions - Factor or options.
     */
    Camera.prototype.animatedUnzoom = function (factorOrOptions) {
        if (!factorOrOptions) {
            this.animate({ ratio: this.ratio * DEFAULT_ZOOMING_RATIO });
        }
        else {
            if (typeof factorOrOptions === "number")
                return this.animate({ ratio: this.ratio * factorOrOptions });
            else
                this.animate({
                    ratio: this.ratio * (factorOrOptions.factor || DEFAULT_ZOOMING_RATIO),
                }, factorOrOptions);
        }
    };
    /**
     * Method used to reset the camera.
     *
     * @param  {object} options - Options.
     */
    Camera.prototype.animatedReset = function (options) {
        this.animate({
            x: 0.5,
            y: 0.5,
            ratio: 1,
            angle: 0,
        }, options);
    };
    /**
     * Returns a new Camera instance, with the same state as the current camera.
     *
     * @return {Camera}
     */
    Camera.prototype.copy = function () {
        return Camera.from(this.getState());
    };
    return Camera;
}(types_1.TypedEventEmitter));
exports.default = Camera;

},{"../types":68,"../utils":73,"../utils/animate":69,"../utils/easings":71}],41:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWheelDelta = exports.getTouchCoords = exports.getTouchesArray = exports.getWheelCoords = exports.getMouseCoords = exports.getPosition = void 0;
/**
 * Sigma.js Captor Class
 * ======================
 * @module
 */
var types_1 = require("../../types");
/**
 * Captor utils functions
 * ======================
 */
/**
 * Extract the local X and Y coordinates from a mouse event or touch object. If
 * a DOM element is given, it uses this element's offset to compute the position
 * (this allows using events that are not bound to the container itself and
 * still have a proper position).
 *
 * @param  {event}       e - A mouse event or touch object.
 * @param  {HTMLElement} dom - A DOM element to compute offset relatively to.
 * @return {number}      The local Y value of the mouse.
 */
function getPosition(e, dom) {
    var bbox = dom.getBoundingClientRect();
    return {
        x: e.clientX - bbox.left,
        y: e.clientY - bbox.top,
    };
}
exports.getPosition = getPosition;
/**
 * Convert mouse coords to sigma coords.
 *
 * @param  {event}       e   - A mouse event or touch object.
 * @param  {HTMLElement} dom - A DOM element to compute offset relatively to.
 * @return {object}
 */
function getMouseCoords(e, dom) {
    var res = __assign(__assign({}, getPosition(e, dom)), { sigmaDefaultPrevented: false, preventSigmaDefault: function () {
            res.sigmaDefaultPrevented = true;
        }, original: e });
    return res;
}
exports.getMouseCoords = getMouseCoords;
/**
 * Convert mouse wheel event coords to sigma coords.
 *
 * @param  {event}       e   - A wheel mouse event.
 * @param  {HTMLElement} dom - A DOM element to compute offset relatively to.
 * @return {object}
 */
function getWheelCoords(e, dom) {
    return __assign(__assign({}, getMouseCoords(e, dom)), { delta: getWheelDelta(e) });
}
exports.getWheelCoords = getWheelCoords;
var MAX_TOUCHES = 2;
function getTouchesArray(touches) {
    var arr = [];
    for (var i = 0, l = Math.min(touches.length, MAX_TOUCHES); i < l; i++)
        arr.push(touches[i]);
    return arr;
}
exports.getTouchesArray = getTouchesArray;
/**
 * Convert touch coords to sigma coords.
 *
 * @param  {event}       e   - A touch event.
 * @param  {HTMLElement} dom - A DOM element to compute offset relatively to.
 * @return {object}
 */
function getTouchCoords(e, dom) {
    return {
        touches: getTouchesArray(e.touches).map(function (touch) { return getPosition(touch, dom); }),
        original: e,
    };
}
exports.getTouchCoords = getTouchCoords;
/**
 * Extract the wheel delta from a mouse event or touch object.
 *
 * @param  {event}  e - A mouse event or touch object.
 * @return {number}     The wheel delta of the mouse.
 */
function getWheelDelta(e) {
    // TODO: check those ratios again to ensure a clean Chrome/Firefox compat
    if (typeof e.deltaY !== "undefined")
        return (e.deltaY * -3) / 360;
    if (typeof e.detail !== "undefined")
        return e.detail / -9;
    throw new Error("Captor: could not extract delta from event.");
}
exports.getWheelDelta = getWheelDelta;
/**
 * Abstract class representing a captor like the user's mouse or touch controls.
 */
var Captor = /** @class */ (function (_super) {
    __extends(Captor, _super);
    function Captor(container, renderer) {
        var _this = _super.call(this) || this;
        // Properties
        _this.container = container;
        _this.renderer = renderer;
        return _this;
    }
    return Captor;
}(types_1.TypedEventEmitter));
exports.default = Captor;

},{"../../types":68}],42:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var captor_1 = __importStar(require("./captor"));
/**
 * Constants.
 */
var DRAG_TIMEOUT = 100;
var DRAGGED_EVENTS_TOLERANCE = 3;
var MOUSE_INERTIA_DURATION = 200;
var MOUSE_INERTIA_RATIO = 3;
var MOUSE_ZOOM_DURATION = 250;
var ZOOMING_RATIO = 1.7;
var DOUBLE_CLICK_TIMEOUT = 300;
var DOUBLE_CLICK_ZOOMING_RATIO = 2.2;
var DOUBLE_CLICK_ZOOMING_DURATION = 200;
/**
 * Mouse captor class.
 *
 * @constructor
 */
var MouseCaptor = /** @class */ (function (_super) {
    __extends(MouseCaptor, _super);
    function MouseCaptor(container, renderer) {
        var _this = _super.call(this, container, renderer) || this;
        // State
        _this.enabled = true;
        _this.draggedEvents = 0;
        _this.downStartTime = null;
        _this.lastMouseX = null;
        _this.lastMouseY = null;
        _this.isMouseDown = false;
        _this.isMoving = false;
        _this.movingTimeout = null;
        _this.startCameraState = null;
        _this.clicks = 0;
        _this.doubleClickTimeout = null;
        _this.currentWheelDirection = 0;
        // Binding methods
        _this.handleClick = _this.handleClick.bind(_this);
        _this.handleRightClick = _this.handleRightClick.bind(_this);
        _this.handleDown = _this.handleDown.bind(_this);
        _this.handleUp = _this.handleUp.bind(_this);
        _this.handleMove = _this.handleMove.bind(_this);
        _this.handleWheel = _this.handleWheel.bind(_this);
        _this.handleOut = _this.handleOut.bind(_this);
        // Binding events
        container.addEventListener("click", _this.handleClick, false);
        container.addEventListener("contextmenu", _this.handleRightClick, false);
        container.addEventListener("mousedown", _this.handleDown, false);
        container.addEventListener("wheel", _this.handleWheel, false);
        container.addEventListener("mouseout", _this.handleOut, false);
        document.addEventListener("mousemove", _this.handleMove, false);
        document.addEventListener("mouseup", _this.handleUp, false);
        return _this;
    }
    MouseCaptor.prototype.kill = function () {
        var container = this.container;
        container.removeEventListener("click", this.handleClick);
        container.removeEventListener("contextmenu", this.handleRightClick);
        container.removeEventListener("mousedown", this.handleDown);
        container.removeEventListener("wheel", this.handleWheel);
        container.removeEventListener("mouseout", this.handleOut);
        document.removeEventListener("mousemove", this.handleMove);
        document.removeEventListener("mouseup", this.handleUp);
    };
    MouseCaptor.prototype.handleClick = function (e) {
        var _this = this;
        if (!this.enabled)
            return;
        this.clicks++;
        if (this.clicks === 2) {
            this.clicks = 0;
            if (typeof this.doubleClickTimeout === "number") {
                clearTimeout(this.doubleClickTimeout);
                this.doubleClickTimeout = null;
            }
            return this.handleDoubleClick(e);
        }
        setTimeout(function () {
            _this.clicks = 0;
            _this.doubleClickTimeout = null;
        }, DOUBLE_CLICK_TIMEOUT);
        // NOTE: this is here to prevent click events on drag
        if (this.draggedEvents < DRAGGED_EVENTS_TOLERANCE)
            this.emit("click", (0, captor_1.getMouseCoords)(e, this.container));
    };
    MouseCaptor.prototype.handleRightClick = function (e) {
        if (!this.enabled)
            return;
        this.emit("rightClick", (0, captor_1.getMouseCoords)(e, this.container));
    };
    MouseCaptor.prototype.handleDoubleClick = function (e) {
        if (!this.enabled)
            return;
        e.preventDefault();
        e.stopPropagation();
        var mouseCoords = (0, captor_1.getMouseCoords)(e, this.container);
        this.emit("doubleClick", mouseCoords);
        if (mouseCoords.sigmaDefaultPrevented)
            return;
        // default behavior
        var camera = this.renderer.getCamera();
        var newRatio = camera.getBoundedRatio(camera.getState().ratio / DOUBLE_CLICK_ZOOMING_RATIO);
        camera.animate(this.renderer.getViewportZoomedState((0, captor_1.getPosition)(e, this.container), newRatio), {
            easing: "quadraticInOut",
            duration: DOUBLE_CLICK_ZOOMING_DURATION,
        });
    };
    MouseCaptor.prototype.handleDown = function (e) {
        if (!this.enabled)
            return;
        this.startCameraState = this.renderer.getCamera().getState();
        var _a = (0, captor_1.getPosition)(e, this.container), x = _a.x, y = _a.y;
        this.lastMouseX = x;
        this.lastMouseY = y;
        this.draggedEvents = 0;
        this.downStartTime = Date.now();
        // TODO: dispatch events
        // Left button pressed
        this.isMouseDown = true;
        this.emit("mousedown", (0, captor_1.getMouseCoords)(e, this.container));
    };
    MouseCaptor.prototype.handleUp = function (e) {
        var _this = this;
        if (!this.enabled || !this.isMouseDown)
            return;
        var camera = this.renderer.getCamera();
        this.isMouseDown = false;
        if (typeof this.movingTimeout === "number") {
            clearTimeout(this.movingTimeout);
            this.movingTimeout = null;
        }
        var _a = (0, captor_1.getPosition)(e, this.container), x = _a.x, y = _a.y;
        var cameraState = camera.getState(), previousCameraState = camera.getPreviousState() || { x: 0, y: 0 };
        if (this.isMoving) {
            camera.animate({
                x: cameraState.x + MOUSE_INERTIA_RATIO * (cameraState.x - previousCameraState.x),
                y: cameraState.y + MOUSE_INERTIA_RATIO * (cameraState.y - previousCameraState.y),
            }, {
                duration: MOUSE_INERTIA_DURATION,
                easing: "quadraticOut",
            });
        }
        else if (this.lastMouseX !== x || this.lastMouseY !== y) {
            camera.setState({
                x: cameraState.x,
                y: cameraState.y,
            });
        }
        this.isMoving = false;
        setTimeout(function () {
            _this.draggedEvents = 0;
            _this.renderer.refresh();
        }, 0);
        this.emit("mouseup", (0, captor_1.getMouseCoords)(e, this.container));
    };
    MouseCaptor.prototype.handleMove = function (e) {
        var _this = this;
        if (!this.enabled)
            return;
        var mouseCoords = (0, captor_1.getMouseCoords)(e, this.container);
        // Always trigger a "mousemovebody" event, so that it is possible to develop
        // a drag-and-drop effect that works even when the mouse is out of the
        // container:
        this.emit("mousemovebody", mouseCoords);
        // Only trigger the "mousemove" event when the mouse is actually hovering
        // the container, to avoid weirdly hovering nodes and/or edges when the
        // mouse is not hover the container:
        if (e.target === this.container) {
            this.emit("mousemove", mouseCoords);
        }
        if (mouseCoords.sigmaDefaultPrevented)
            return;
        // Handle the case when "isMouseDown" all the time, to allow dragging the
        // stage while the mouse is not hover the container:
        if (this.isMouseDown) {
            this.isMoving = true;
            this.draggedEvents++;
            if (typeof this.movingTimeout === "number") {
                clearTimeout(this.movingTimeout);
            }
            this.movingTimeout = window.setTimeout(function () {
                _this.movingTimeout = null;
                _this.isMoving = false;
            }, DRAG_TIMEOUT);
            var camera = this.renderer.getCamera();
            var _a = (0, captor_1.getPosition)(e, this.container), eX = _a.x, eY = _a.y;
            var lastMouse = this.renderer.viewportToFramedGraph({
                x: this.lastMouseX,
                y: this.lastMouseY,
            });
            var mouse = this.renderer.viewportToFramedGraph({ x: eX, y: eY });
            var offsetX = lastMouse.x - mouse.x, offsetY = lastMouse.y - mouse.y;
            var cameraState = camera.getState();
            var x = cameraState.x + offsetX, y = cameraState.y + offsetY;
            camera.setState({ x: x, y: y });
            this.lastMouseX = eX;
            this.lastMouseY = eY;
            e.preventDefault();
            e.stopPropagation();
        }
    };
    MouseCaptor.prototype.handleWheel = function (e) {
        var _this = this;
        if (!this.enabled)
            return;
        e.preventDefault();
        e.stopPropagation();
        var delta = (0, captor_1.getWheelDelta)(e);
        if (!delta)
            return;
        var wheelCoords = (0, captor_1.getWheelCoords)(e, this.container);
        this.emit("wheel", wheelCoords);
        if (wheelCoords.sigmaDefaultPrevented)
            return;
        // Default behavior
        var ratioDiff = delta > 0 ? 1 / ZOOMING_RATIO : ZOOMING_RATIO;
        var camera = this.renderer.getCamera();
        var newRatio = camera.getBoundedRatio(camera.getState().ratio * ratioDiff);
        var wheelDirection = delta > 0 ? 1 : -1;
        var now = Date.now();
        // Cancel events that are too close too each other and in the same direction:
        if (this.currentWheelDirection === wheelDirection &&
            this.lastWheelTriggerTime &&
            now - this.lastWheelTriggerTime < MOUSE_ZOOM_DURATION / 5) {
            return;
        }
        camera.animate(this.renderer.getViewportZoomedState((0, captor_1.getPosition)(e, this.container), newRatio), {
            easing: "quadraticOut",
            duration: MOUSE_ZOOM_DURATION,
        }, function () {
            _this.currentWheelDirection = 0;
        });
        this.currentWheelDirection = wheelDirection;
        this.lastWheelTriggerTime = now;
    };
    MouseCaptor.prototype.handleOut = function () {
        // TODO: dispatch event
    };
    return MouseCaptor;
}(captor_1.default));
exports.default = MouseCaptor;

},{"./captor":41}],43:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var captor_1 = __importStar(require("./captor"));
var DRAG_TIMEOUT = 200;
var TOUCH_INERTIA_RATIO = 3;
var TOUCH_INERTIA_DURATION = 200;
/**
 * Touch captor class.
 *
 * @constructor
 */
var TouchCaptor = /** @class */ (function (_super) {
    __extends(TouchCaptor, _super);
    function TouchCaptor(container, renderer) {
        var _this = _super.call(this, container, renderer) || this;
        _this.enabled = true;
        _this.isMoving = false;
        _this.touchMode = 0; // number of touches down
        // Binding methods:
        _this.handleStart = _this.handleStart.bind(_this);
        _this.handleLeave = _this.handleLeave.bind(_this);
        _this.handleMove = _this.handleMove.bind(_this);
        // Binding events
        container.addEventListener("touchstart", _this.handleStart, false);
        container.addEventListener("touchend", _this.handleLeave, false);
        container.addEventListener("touchcancel", _this.handleLeave, false);
        container.addEventListener("touchmove", _this.handleMove, false);
        return _this;
    }
    TouchCaptor.prototype.kill = function () {
        var container = this.container;
        container.removeEventListener("touchstart", this.handleStart);
        container.removeEventListener("touchend", this.handleLeave);
        container.removeEventListener("touchcancel", this.handleLeave);
        container.removeEventListener("touchmove", this.handleMove);
    };
    TouchCaptor.prototype.getDimensions = function () {
        return {
            width: this.container.offsetWidth,
            height: this.container.offsetHeight,
        };
    };
    TouchCaptor.prototype.dispatchRelatedMouseEvent = function (type, e, position, emitter) {
        var mousePosition = position || (0, captor_1.getPosition)(e.touches[0], this.container);
        var mouseEvent = new MouseEvent(type, {
            clientX: mousePosition.x,
            clientY: mousePosition.y,
            altKey: e.altKey,
            ctrlKey: e.ctrlKey,
        });
        mouseEvent.isFakeSigmaMouseEvent = true;
        (emitter || this.container).dispatchEvent(mouseEvent);
    };
    TouchCaptor.prototype.handleStart = function (e) {
        var _this = this;
        if (!this.enabled)
            return;
        // Prevent default to avoid default browser behaviors...
        e.preventDefault();
        // ...but simulate mouse behavior anyway, to get the MouseCaptor working as well:
        if (e.touches.length === 1)
            this.dispatchRelatedMouseEvent("mousedown", e);
        var touches = (0, captor_1.getTouchesArray)(e.touches);
        this.isMoving = true;
        this.touchMode = touches.length;
        this.startCameraState = this.renderer.getCamera().getState();
        this.startTouchesPositions = touches.map(function (touch) { return (0, captor_1.getPosition)(touch, _this.container); });
        this.lastTouchesPositions = this.startTouchesPositions;
        // When there are two touches down, let's record distance and angle as well:
        if (this.touchMode === 2) {
            var _a = __read(this.startTouchesPositions, 2), _b = _a[0], x0 = _b.x, y0 = _b.y, _c = _a[1], x1 = _c.x, y1 = _c.y;
            this.startTouchesAngle = Math.atan2(y1 - y0, x1 - x0);
            this.startTouchesDistance = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
        }
        this.emit("touchdown", (0, captor_1.getTouchCoords)(e, this.container));
    };
    TouchCaptor.prototype.handleLeave = function (e) {
        if (!this.enabled)
            return;
        // Prevent default to avoid default browser behaviors...
        e.preventDefault();
        // ...but simulate mouse behavior anyway, to get the MouseCaptor working as well:
        if (e.touches.length === 0 && this.lastTouchesPositions && this.lastTouchesPositions.length) {
            this.dispatchRelatedMouseEvent("mouseup", e, this.lastTouchesPositions[0], document);
            this.dispatchRelatedMouseEvent("click", e, this.lastTouchesPositions[0]);
        }
        if (this.movingTimeout) {
            this.isMoving = false;
            clearTimeout(this.movingTimeout);
        }
        switch (this.touchMode) {
            case 2:
                if (e.touches.length === 1) {
                    this.handleStart(e);
                    e.preventDefault();
                    break;
                }
            /* falls through */
            case 1:
                // TODO
                // Dispatch event
                if (this.isMoving) {
                    var camera = this.renderer.getCamera();
                    var cameraState = camera.getState(), previousCameraState = camera.getPreviousState() || { x: 0, y: 0 };
                    camera.animate({
                        x: cameraState.x + TOUCH_INERTIA_RATIO * (cameraState.x - previousCameraState.x),
                        y: cameraState.y + TOUCH_INERTIA_RATIO * (cameraState.y - previousCameraState.y),
                    }, {
                        duration: TOUCH_INERTIA_DURATION,
                        easing: "quadraticOut",
                    });
                }
                this.isMoving = false;
                this.touchMode = 0;
                break;
        }
        this.emit("touchup", (0, captor_1.getTouchCoords)(e, this.container));
    };
    TouchCaptor.prototype.handleMove = function (e) {
        var _a;
        var _this = this;
        if (!this.enabled)
            return;
        // Prevent default to avoid default browser behaviors...
        e.preventDefault();
        // ...but simulate mouse behavior anyway, to get the MouseCaptor working as well:
        if (e.touches.length === 1)
            this.dispatchRelatedMouseEvent("mousemove", e);
        var camera = this.renderer.getCamera();
        var startCameraState = this.startCameraState;
        var touches = (0, captor_1.getTouchesArray)(e.touches);
        var touchesPositions = touches.map(function (touch) { return (0, captor_1.getPosition)(touch, _this.container); });
        this.lastTouchesPositions = touchesPositions;
        this.isMoving = true;
        if (this.movingTimeout)
            clearTimeout(this.movingTimeout);
        this.movingTimeout = window.setTimeout(function () {
            _this.isMoving = false;
        }, DRAG_TIMEOUT);
        switch (this.touchMode) {
            case 1: {
                var _b = this.renderer.viewportToFramedGraph((this.startTouchesPositions || [])[0]), xStart = _b.x, yStart = _b.y;
                var _c = this.renderer.viewportToFramedGraph(touchesPositions[0]), x = _c.x, y = _c.y;
                camera.setState({
                    x: startCameraState.x + xStart - x,
                    y: startCameraState.y + yStart - y,
                });
                break;
            }
            case 2: {
                /**
                 * Here is the thinking here:
                 *
                 * 1. We can find the new angle and ratio, by comparing the vector from "touch one" to "touch two" at the start
                 *    of the d'n'd and now
                 *
                 * 2. We can use `Camera#viewportToGraph` inside formula to retrieve the new camera position, using the graph
                 *    position of a touch at the beginning of the d'n'd (using `startCamera.viewportToGraph`) and the viewport
                 *    position of this same touch now
                 */
                var newCameraState = {};
                var _d = touchesPositions[0], x0 = _d.x, y0 = _d.y;
                var _e = touchesPositions[1], x1 = _e.x, y1 = _e.y;
                var angleDiff = Math.atan2(y1 - y0, x1 - x0) - this.startTouchesAngle;
                var ratioDiff = Math.hypot(y1 - y0, x1 - x0) / this.startTouchesDistance;
                // 1.
                var newRatio = camera.getBoundedRatio(startCameraState.ratio / ratioDiff);
                newCameraState.ratio = newRatio;
                newCameraState.angle = startCameraState.angle + angleDiff;
                // 2.
                var dimensions = this.getDimensions();
                var touchGraphPosition = this.renderer.viewportToFramedGraph((this.startTouchesPositions || [])[0], { cameraState: startCameraState });
                var smallestDimension = Math.min(dimensions.width, dimensions.height);
                var dx = smallestDimension / dimensions.width;
                var dy = smallestDimension / dimensions.height;
                var ratio = newRatio / smallestDimension;
                // Align with center of the graph:
                var x = x0 - smallestDimension / 2 / dx;
                var y = y0 - smallestDimension / 2 / dy;
                // Rotate:
                _a = __read([
                    x * Math.cos(-newCameraState.angle) - y * Math.sin(-newCameraState.angle),
                    y * Math.cos(-newCameraState.angle) + x * Math.sin(-newCameraState.angle),
                ], 2), x = _a[0], y = _a[1];
                newCameraState.x = touchGraphPosition.x - x * ratio;
                newCameraState.y = touchGraphPosition.y + y * ratio;
                camera.setState(newCameraState);
                break;
            }
        }
        this.emit("touchmove", (0, captor_1.getTouchCoords)(e, this.container));
    };
    return TouchCaptor;
}(captor_1.default));
exports.default = TouchCaptor;

},{"./captor":41}],44:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.edgeLabelsToDisplayFromNodes = exports.LabelGrid = void 0;
/**
 * Class representing a single candidate for the label grid selection.
 *
 * It also describes a deterministic way to compare two candidates to assess
 * which one is better.
 */
var LabelCandidate = /** @class */ (function () {
    function LabelCandidate(key, size) {
        this.key = key;
        this.size = size;
    }
    LabelCandidate.compare = function (first, second) {
        // First we compare by size
        if (first.size > second.size)
            return -1;
        if (first.size < second.size)
            return 1;
        // Then since no two nodes can have the same key, we use it to
        // deterministically tie-break by key
        if (first.key > second.key)
            return 1;
        // NOTE: this comparator cannot return 0
        return -1;
    };
    return LabelCandidate;
}());
/**
 * Class representing a 2D spatial grid divided into constant-size cells.
 */
var LabelGrid = /** @class */ (function () {
    function LabelGrid() {
        this.width = 0;
        this.height = 0;
        this.cellSize = 0;
        this.columns = 0;
        this.rows = 0;
        this.cells = {};
    }
    LabelGrid.prototype.resizeAndClear = function (dimensions, cellSize) {
        this.width = dimensions.width;
        this.height = dimensions.height;
        this.cellSize = cellSize;
        this.columns = Math.ceil(dimensions.width / cellSize);
        this.rows = Math.ceil(dimensions.height / cellSize);
        this.cells = {};
    };
    LabelGrid.prototype.getIndex = function (pos) {
        var xIndex = Math.floor(pos.x / this.cellSize);
        var yIndex = Math.floor(pos.y / this.cellSize);
        return yIndex * this.columns + xIndex;
    };
    LabelGrid.prototype.add = function (key, size, pos) {
        var candidate = new LabelCandidate(key, size);
        var index = this.getIndex(pos);
        var cell = this.cells[index];
        if (!cell) {
            cell = [];
            this.cells[index] = cell;
        }
        cell.push(candidate);
    };
    LabelGrid.prototype.organize = function () {
        for (var k in this.cells) {
            var cell = this.cells[k];
            cell.sort(LabelCandidate.compare);
        }
    };
    LabelGrid.prototype.getLabelsToDisplay = function (ratio, density) {
        // TODO: work on visible nodes to optimize? ^ -> threshold outside so that memoization works?
        // TODO: adjust threshold lower, but increase cells a bit?
        // TODO: hunt for geom issue in disguise
        // TODO: memoize while ratio does not move. method to force recompute
        var cellArea = this.cellSize * this.cellSize;
        var scaledCellArea = cellArea / ratio / ratio;
        var scaledDensity = (scaledCellArea * density) / cellArea;
        var labelsToDisplayPerCell = Math.ceil(scaledDensity);
        var labels = [];
        for (var k in this.cells) {
            var cell = this.cells[k];
            for (var i = 0; i < Math.min(labelsToDisplayPerCell, cell.length); i++) {
                labels.push(cell[i].key);
            }
        }
        return labels;
    };
    return LabelGrid;
}());
exports.LabelGrid = LabelGrid;
/**
 * Label heuristic selecting edge labels to display, based on displayed node
 * labels
 *
 * @param  {object} params                 - Parameters:
 * @param  {Set}      displayedNodeLabels  - Currently displayed node labels.
 * @param  {Set}      highlightedNodes     - Highlighted nodes.
 * @param  {Graph}    graph                - The rendered graph.
 * @param  {string}   hoveredNode          - Hovered node (optional)
 * @return {Array}                         - The selected labels.
 */
function edgeLabelsToDisplayFromNodes(params) {
    var graph = params.graph, hoveredNode = params.hoveredNode, highlightedNodes = params.highlightedNodes, displayedNodeLabels = params.displayedNodeLabels;
    var worthyEdges = [];
    // TODO: the code below can be optimized using #.forEach and batching the code per adj
    // We should display an edge's label if:
    //   - Any of its extremities is highlighted or hovered
    //   - Both of its extremities has its label shown
    graph.forEachEdge(function (edge, _, source, target) {
        if (source === hoveredNode ||
            target === hoveredNode ||
            highlightedNodes.has(source) ||
            highlightedNodes.has(target) ||
            (displayedNodeLabels.has(source) && displayedNodeLabels.has(target))) {
            worthyEdges.push(edge);
        }
    });
    return worthyEdges;
}
exports.edgeLabelsToDisplayFromNodes = edgeLabelsToDisplayFromNodes;

},{}],45:[function(require,module,exports){
"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rectangleCollidesWithQuad = exports.squareCollidesWithQuad = exports.getCircumscribedAlignedRectangle = exports.isRectangleAligned = void 0;
/**
 * Sigma.js Quad Tree Class
 * =========================
 *
 * Class implementing the quad tree data structure used to solve hovers and
 * determine which elements are currently in the scope of the camera so that
 * we don't waste time rendering things the user cannot see anyway.
 * @module
 */
/* eslint no-nested-ternary: 0 */
/* eslint no-constant-condition: 0 */
var extend_1 = __importDefault(require("@yomguithereal/helpers/extend"));
// TODO: should not ask the quadtree when the camera has the whole graph in
// sight.
// TODO: a square can be represented as topleft + width, saying for the quad blocks (reduce mem)
// TODO: jsdoc
// TODO: be sure we can handle cases overcoming boundaries (because of size) or use a maxed size
// TODO: filtering unwanted labels beforehand through the filter function
// NOTE: this is basically a MX-CIF Quadtree at this point
// NOTE: need to explore R-Trees for edges
// NOTE: need to explore 2d segment tree for edges
// NOTE: probably can do faster using spatial hashing
/**
 * Constants.
 *
 * Note that since we are representing a static 4-ary tree, the indices of the
 * quadrants are the following:
 *   - TOP_LEFT:     4i + b
 *   - TOP_RIGHT:    4i + 2b
 *   - BOTTOM_LEFT:  4i + 3b
 *   - BOTTOM_RIGHT: 4i + 4b
 */
var BLOCKS = 4, MAX_LEVEL = 5;
var OUTSIDE_BLOCK = "outside";
var X_OFFSET = 0, Y_OFFSET = 1, WIDTH_OFFSET = 2, HEIGHT_OFFSET = 3;
var TOP_LEFT = 1, TOP_RIGHT = 2, BOTTOM_LEFT = 3, BOTTOM_RIGHT = 4;
var hasWarnedTooMuchOutside = false;
/**
 * Geometry helpers.
 */
/**
 * Function returning whether the given rectangle is axis-aligned.
 *
 * @param  {Rectangle} rect
 * @return {boolean}
 */
function isRectangleAligned(rect) {
    return rect.x1 === rect.x2 || rect.y1 === rect.y2;
}
exports.isRectangleAligned = isRectangleAligned;
/**
 * Function returning the smallest rectangle that contains the given rectangle, and that is aligned with the axis.
 *
 * @param {Rectangle} rect
 * @return {Rectangle}
 */
function getCircumscribedAlignedRectangle(rect) {
    var width = Math.sqrt(Math.pow(rect.x2 - rect.x1, 2) + Math.pow(rect.y2 - rect.y1, 2));
    var heightVector = {
        x: ((rect.y1 - rect.y2) * rect.height) / width,
        y: ((rect.x2 - rect.x1) * rect.height) / width,
    };
    // Compute all corners:
    var tl = { x: rect.x1, y: rect.y1 };
    var tr = { x: rect.x2, y: rect.y2 };
    var bl = {
        x: rect.x1 + heightVector.x,
        y: rect.y1 + heightVector.y,
    };
    var br = {
        x: rect.x2 + heightVector.x,
        y: rect.y2 + heightVector.y,
    };
    var xL = Math.min(tl.x, tr.x, bl.x, br.x);
    var xR = Math.max(tl.x, tr.x, bl.x, br.x);
    var yT = Math.min(tl.y, tr.y, bl.y, br.y);
    var yB = Math.max(tl.y, tr.y, bl.y, br.y);
    return {
        x1: xL,
        y1: yT,
        x2: xR,
        y2: yT,
        height: yB - yT,
    };
}
exports.getCircumscribedAlignedRectangle = getCircumscribedAlignedRectangle;
/**
 *
 * @param x1
 * @param y1
 * @param w
 * @param qx
 * @param qy
 * @param qw
 * @param qh
 */
function squareCollidesWithQuad(x1, y1, w, qx, qy, qw, qh) {
    return x1 < qx + qw && x1 + w > qx && y1 < qy + qh && y1 + w > qy;
}
exports.squareCollidesWithQuad = squareCollidesWithQuad;
function rectangleCollidesWithQuad(x1, y1, w, h, qx, qy, qw, qh) {
    return x1 < qx + qw && x1 + w > qx && y1 < qy + qh && y1 + h > qy;
}
exports.rectangleCollidesWithQuad = rectangleCollidesWithQuad;
function pointIsInQuad(x, y, qx, qy, qw, qh) {
    var xmp = qx + qw / 2, ymp = qy + qh / 2, top = y < ymp, left = x < xmp;
    return top ? (left ? TOP_LEFT : TOP_RIGHT) : left ? BOTTOM_LEFT : BOTTOM_RIGHT;
}
/**
 * Helper functions that are not bound to the class so an external user
 * cannot mess with them.
 */
function buildQuadrants(maxLevel, data) {
    // [block, level]
    var stack = [0, 0];
    while (stack.length) {
        var level = stack.pop(), block = stack.pop();
        var topLeftBlock = 4 * block + BLOCKS, topRightBlock = 4 * block + 2 * BLOCKS, bottomLeftBlock = 4 * block + 3 * BLOCKS, bottomRightBlock = 4 * block + 4 * BLOCKS;
        var x = data[block + X_OFFSET], y = data[block + Y_OFFSET], width = data[block + WIDTH_OFFSET], height = data[block + HEIGHT_OFFSET], hw = width / 2, hh = height / 2;
        data[topLeftBlock + X_OFFSET] = x;
        data[topLeftBlock + Y_OFFSET] = y;
        data[topLeftBlock + WIDTH_OFFSET] = hw;
        data[topLeftBlock + HEIGHT_OFFSET] = hh;
        data[topRightBlock + X_OFFSET] = x + hw;
        data[topRightBlock + Y_OFFSET] = y;
        data[topRightBlock + WIDTH_OFFSET] = hw;
        data[topRightBlock + HEIGHT_OFFSET] = hh;
        data[bottomLeftBlock + X_OFFSET] = x;
        data[bottomLeftBlock + Y_OFFSET] = y + hh;
        data[bottomLeftBlock + WIDTH_OFFSET] = hw;
        data[bottomLeftBlock + HEIGHT_OFFSET] = hh;
        data[bottomRightBlock + X_OFFSET] = x + hw;
        data[bottomRightBlock + Y_OFFSET] = y + hh;
        data[bottomRightBlock + WIDTH_OFFSET] = hw;
        data[bottomRightBlock + HEIGHT_OFFSET] = hh;
        if (level < maxLevel - 1) {
            stack.push(bottomRightBlock, level + 1);
            stack.push(bottomLeftBlock, level + 1);
            stack.push(topRightBlock, level + 1);
            stack.push(topLeftBlock, level + 1);
        }
    }
}
function insertNode(maxLevel, data, containers, key, x, y, size) {
    var x1 = x - size, y1 = y - size, w = size * 2;
    var level = 0, block = 0;
    while (true) {
        // If we reached max level
        if (level >= maxLevel) {
            containers[block] = containers[block] || [];
            containers[block].push(key);
            return;
        }
        var topLeftBlock = 4 * block + BLOCKS, topRightBlock = 4 * block + 2 * BLOCKS, bottomLeftBlock = 4 * block + 3 * BLOCKS, bottomRightBlock = 4 * block + 4 * BLOCKS;
        var collidingWithTopLeft = squareCollidesWithQuad(x1, y1, w, data[topLeftBlock + X_OFFSET], data[topLeftBlock + Y_OFFSET], data[topLeftBlock + WIDTH_OFFSET], data[topLeftBlock + HEIGHT_OFFSET]);
        var collidingWithTopRight = squareCollidesWithQuad(x1, y1, w, data[topRightBlock + X_OFFSET], data[topRightBlock + Y_OFFSET], data[topRightBlock + WIDTH_OFFSET], data[topRightBlock + HEIGHT_OFFSET]);
        var collidingWithBottomLeft = squareCollidesWithQuad(x1, y1, w, data[bottomLeftBlock + X_OFFSET], data[bottomLeftBlock + Y_OFFSET], data[bottomLeftBlock + WIDTH_OFFSET], data[bottomLeftBlock + HEIGHT_OFFSET]);
        var collidingWithBottomRight = squareCollidesWithQuad(x1, y1, w, data[bottomRightBlock + X_OFFSET], data[bottomRightBlock + Y_OFFSET], data[bottomRightBlock + WIDTH_OFFSET], data[bottomRightBlock + HEIGHT_OFFSET]);
        var collisions = [
            collidingWithTopLeft,
            collidingWithTopRight,
            collidingWithBottomLeft,
            collidingWithBottomRight,
        ].reduce(function (acc, current) {
            if (current)
                return acc + 1;
            else
                return acc;
        }, 0);
        // If we have no collision at root level, inject node in the outside block
        if (collisions === 0 && level === 0) {
            containers[OUTSIDE_BLOCK].push(key);
            if (!hasWarnedTooMuchOutside && containers[OUTSIDE_BLOCK].length >= 5) {
                hasWarnedTooMuchOutside = true;
                console.warn("sigma/quadtree.insertNode: At least 5 nodes are outside the global quadtree zone. " +
                    "You might have a problem with the normalization function or the custom bounding box.");
            }
            return;
        }
        // If we don't have at least a collision but deeper, there is an issue
        if (collisions === 0)
            throw new Error("sigma/quadtree.insertNode: no collision (level: ".concat(level, ", key: ").concat(key, ", x: ").concat(x, ", y: ").concat(y, ", size: ").concat(size, ")."));
        // If we have 3 collisions, we have a geometry problem obviously
        if (collisions === 3)
            throw new Error("sigma/quadtree.insertNode: 3 impossible collisions (level: ".concat(level, ", key: ").concat(key, ", x: ").concat(x, ", y: ").concat(y, ", size: ").concat(size, ")."));
        // If we have more that one collision, we stop here and store the node
        // in the relevant containers
        if (collisions > 1) {
            containers[block] = containers[block] || [];
            containers[block].push(key);
            return;
        }
        else {
            level++;
        }
        // Else we recurse into the correct quads
        if (collidingWithTopLeft)
            block = topLeftBlock;
        if (collidingWithTopRight)
            block = topRightBlock;
        if (collidingWithBottomLeft)
            block = bottomLeftBlock;
        if (collidingWithBottomRight)
            block = bottomRightBlock;
    }
}
function getNodesInAxisAlignedRectangleArea(maxLevel, data, containers, x1, y1, w, h) {
    // [block, level]
    var stack = [0, 0];
    var collectedNodes = [];
    var container;
    while (stack.length) {
        var level = stack.pop(), block = stack.pop();
        // Collecting nodes
        container = containers[block];
        if (container)
            (0, extend_1.default)(collectedNodes, container);
        // If we reached max level
        if (level >= maxLevel)
            continue;
        var topLeftBlock = 4 * block + BLOCKS, topRightBlock = 4 * block + 2 * BLOCKS, bottomLeftBlock = 4 * block + 3 * BLOCKS, bottomRightBlock = 4 * block + 4 * BLOCKS;
        var collidingWithTopLeft = rectangleCollidesWithQuad(x1, y1, w, h, data[topLeftBlock + X_OFFSET], data[topLeftBlock + Y_OFFSET], data[topLeftBlock + WIDTH_OFFSET], data[topLeftBlock + HEIGHT_OFFSET]);
        var collidingWithTopRight = rectangleCollidesWithQuad(x1, y1, w, h, data[topRightBlock + X_OFFSET], data[topRightBlock + Y_OFFSET], data[topRightBlock + WIDTH_OFFSET], data[topRightBlock + HEIGHT_OFFSET]);
        var collidingWithBottomLeft = rectangleCollidesWithQuad(x1, y1, w, h, data[bottomLeftBlock + X_OFFSET], data[bottomLeftBlock + Y_OFFSET], data[bottomLeftBlock + WIDTH_OFFSET], data[bottomLeftBlock + HEIGHT_OFFSET]);
        var collidingWithBottomRight = rectangleCollidesWithQuad(x1, y1, w, h, data[bottomRightBlock + X_OFFSET], data[bottomRightBlock + Y_OFFSET], data[bottomRightBlock + WIDTH_OFFSET], data[bottomRightBlock + HEIGHT_OFFSET]);
        if (collidingWithTopLeft)
            stack.push(topLeftBlock, level + 1);
        if (collidingWithTopRight)
            stack.push(topRightBlock, level + 1);
        if (collidingWithBottomLeft)
            stack.push(bottomLeftBlock, level + 1);
        if (collidingWithBottomRight)
            stack.push(bottomRightBlock, level + 1);
    }
    return collectedNodes;
}
/**
 * QuadTree class.
 *
 * @constructor
 * @param {object} boundaries - The graph boundaries.
 */
var QuadTree = /** @class */ (function () {
    function QuadTree(params) {
        var _a;
        if (params === void 0) { params = {}; }
        this.containers = (_a = {}, _a[OUTSIDE_BLOCK] = [], _a);
        this.cache = null;
        this.lastRectangle = null;
        // Allocating the underlying byte array
        var L = Math.pow(4, MAX_LEVEL);
        this.data = new Float32Array(BLOCKS * ((4 * L - 1) / 3));
        if (params.boundaries)
            this.resize(params.boundaries);
        else
            this.resize({
                x: 0,
                y: 0,
                width: 1,
                height: 1,
            });
    }
    QuadTree.prototype.add = function (key, x, y, size) {
        insertNode(MAX_LEVEL, this.data, this.containers, key, x, y, size);
        return this;
    };
    QuadTree.prototype.resize = function (boundaries) {
        this.clear();
        // Building the quadrants
        this.data[X_OFFSET] = boundaries.x;
        this.data[Y_OFFSET] = boundaries.y;
        this.data[WIDTH_OFFSET] = boundaries.width;
        this.data[HEIGHT_OFFSET] = boundaries.height;
        buildQuadrants(MAX_LEVEL, this.data);
    };
    QuadTree.prototype.clear = function () {
        var _a;
        this.containers = (_a = {}, _a[OUTSIDE_BLOCK] = [], _a);
        return this;
    };
    QuadTree.prototype.point = function (x, y) {
        var nodes = this.containers[OUTSIDE_BLOCK];
        var block = 0, level = 0;
        do {
            if (this.containers[block])
                nodes.push.apply(nodes, __spreadArray([], __read(this.containers[block]), false));
            var quad = pointIsInQuad(x, y, this.data[block + X_OFFSET], this.data[block + Y_OFFSET], this.data[block + WIDTH_OFFSET], this.data[block + HEIGHT_OFFSET]);
            block = 4 * block + quad * BLOCKS;
            level++;
        } while (level <= MAX_LEVEL);
        return nodes;
    };
    QuadTree.prototype.rectangle = function (x1, y1, x2, y2, height) {
        var _a;
        var lr = this.lastRectangle;
        if (lr && x1 === lr.x1 && x2 === lr.x2 && y1 === lr.y1 && y2 === lr.y2 && height === lr.height) {
            return this.cache;
        }
        this.lastRectangle = {
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
            height: height,
        };
        // If the rectangle is shifted, we use the smallest aligned rectangle that contains the shifted one:
        if (!isRectangleAligned(this.lastRectangle))
            this.lastRectangle = getCircumscribedAlignedRectangle(this.lastRectangle);
        this.cache = getNodesInAxisAlignedRectangleArea(MAX_LEVEL, this.data, this.containers, x1, y1, Math.abs(x1 - x2) || Math.abs(y1 - y2), height);
        // Add all the nodes in the outside block, since they might be relevant, and since they should be very few:
        (_a = this.cache).push.apply(_a, __spreadArray([], __read(this.containers[OUTSIDE_BLOCK]), false));
        return this.cache;
    };
    return QuadTree;
}());
exports.default = QuadTree;

},{"@yomguithereal/helpers/extend":2}],46:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sigma = exports.MouseCaptor = exports.QuadTree = exports.Camera = void 0;
/**
 * Sigma.js Library Endpoint
 * =========================
 *
 * The library endpoint.
 * @module
 */
var sigma_1 = __importDefault(require("./sigma"));
exports.Sigma = sigma_1.default;
var camera_1 = __importDefault(require("./core/camera"));
exports.Camera = camera_1.default;
var quadtree_1 = __importDefault(require("./core/quadtree"));
exports.QuadTree = quadtree_1.default;
var mouse_1 = __importDefault(require("./core/captors/mouse"));
exports.MouseCaptor = mouse_1.default;
exports.default = sigma_1.default;

},{"./core/camera":40,"./core/captors/mouse":42,"./core/quadtree":45,"./sigma":67}],47:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function drawEdgeLabel(context, edgeData, sourceData, targetData, settings) {
    var size = settings.edgeLabelSize, font = settings.edgeLabelFont, weight = settings.edgeLabelWeight, color = settings.edgeLabelColor.attribute
        ? edgeData[settings.edgeLabelColor.attribute] || settings.edgeLabelColor.color || "#000"
        : settings.edgeLabelColor.color;
    var label = edgeData.label;
    if (!label)
        return;
    context.fillStyle = color;
    context.font = "".concat(weight, " ").concat(size, "px ").concat(font);
    // Computing positions without considering nodes sizes:
    var sSize = sourceData.size;
    var tSize = targetData.size;
    var sx = sourceData.x;
    var sy = sourceData.y;
    var tx = targetData.x;
    var ty = targetData.y;
    var cx = (sx + tx) / 2;
    var cy = (sy + ty) / 2;
    var dx = tx - sx;
    var dy = ty - sy;
    var d = Math.sqrt(dx * dx + dy * dy);
    if (d < sSize + tSize)
        return;
    // Adding nodes sizes:
    sx += (dx * sSize) / d;
    sy += (dy * sSize) / d;
    tx -= (dx * tSize) / d;
    ty -= (dy * tSize) / d;
    cx = (sx + tx) / 2;
    cy = (sy + ty) / 2;
    dx = tx - sx;
    dy = ty - sy;
    d = Math.sqrt(dx * dx + dy * dy);
    // Handling ellipsis
    var textLength = context.measureText(label).width;
    if (textLength > d) {
        var ellipsis = "…";
        label = label + ellipsis;
        textLength = context.measureText(label).width;
        while (textLength > d && label.length > 1) {
            label = label.slice(0, -2) + ellipsis;
            textLength = context.measureText(label).width;
        }
        if (label.length < 4)
            return;
    }
    var angle;
    if (dx > 0) {
        if (dy > 0)
            angle = Math.acos(dx / d);
        else
            angle = Math.asin(dy / d);
    }
    else {
        if (dy > 0)
            angle = Math.acos(dx / d) + Math.PI;
        else
            angle = Math.asin(dx / d) + Math.PI / 2;
    }
    context.save();
    context.translate(cx, cy);
    context.rotate(angle);
    context.fillText(label, -textLength / 2, edgeData.size / 2 + size);
    context.restore();
}
exports.default = drawEdgeLabel;

},{}],48:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var label_1 = __importDefault(require("./label"));
/**
 * Draw an hovered node.
 * - if there is no label => display a shadow on the node
 * - if the label box is bigger than node size => display a label box that contains the node with a shadow
 * - else node with shadow and the label box
 */
function drawHover(context, data, settings) {
    var size = settings.labelSize, font = settings.labelFont, weight = settings.labelWeight;
    context.font = "".concat(weight, " ").concat(size, "px ").concat(font);
    // Then we draw the label background
    context.fillStyle = "#FFF";
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.shadowBlur = 8;
    context.shadowColor = "#000";
    var PADDING = 2;
    if (typeof data.label === "string") {
        var textWidth = context.measureText(data.label).width, boxWidth = Math.round(textWidth + 5), boxHeight = Math.round(size + 2 * PADDING), radius = Math.max(data.size, size / 2) + PADDING;
        var angleRadian = Math.asin(boxHeight / 2 / radius);
        var xDeltaCoord = Math.sqrt(Math.abs(Math.pow(radius, 2) - Math.pow(boxHeight / 2, 2)));
        context.beginPath();
        context.moveTo(data.x + xDeltaCoord, data.y + boxHeight / 2);
        context.lineTo(data.x + radius + boxWidth, data.y + boxHeight / 2);
        context.lineTo(data.x + radius + boxWidth, data.y - boxHeight / 2);
        context.lineTo(data.x + xDeltaCoord, data.y - boxHeight / 2);
        context.arc(data.x, data.y, radius, angleRadian, -angleRadian);
        context.closePath();
        context.fill();
    }
    else {
        context.beginPath();
        context.arc(data.x, data.y, data.size + PADDING, 0, Math.PI * 2);
        context.closePath();
        context.fill();
    }
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
    context.shadowBlur = 0;
    // And finally we draw the label
    (0, label_1.default)(context, data, settings);
}
exports.default = drawHover;

},{"./label":49}],49:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function drawLabel(context, data, settings) {
    if (!data.label)
        return;
    var size = settings.labelSize, font = settings.labelFont, weight = settings.labelWeight, color = settings.labelColor.attribute
        ? data[settings.labelColor.attribute] || settings.labelColor.color || "#000"
        : settings.labelColor.color;
    context.fillStyle = color;
    context.font = "".concat(weight, " ").concat(size, "px ").concat(font);
    context.fillText(data.label, data.x + data.size + 3, data.y + size / 3);
}
exports.default = drawLabel;

},{}],50:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEdgeCompoundProgram = exports.AbstractEdgeProgram = void 0;
/**
 * Sigma.js WebGL Abstract Edge Program
 * =====================================
 *
 * @module
 */
var program_1 = require("./program");
/**
 * Edge Program class.
 *
 * @constructor
 */
var AbstractEdgeProgram = /** @class */ (function (_super) {
    __extends(AbstractEdgeProgram, _super);
    function AbstractEdgeProgram(gl, vertexShaderSource, fragmentShaderSource, points, attributes) {
        return _super.call(this, gl, vertexShaderSource, fragmentShaderSource, points, attributes) || this;
    }
    return AbstractEdgeProgram;
}(program_1.AbstractProgram));
exports.AbstractEdgeProgram = AbstractEdgeProgram;
function createEdgeCompoundProgram(programClasses) {
    return /** @class */ (function () {
        function EdgeCompoundProgram(gl, renderer) {
            this.programs = programClasses.map(function (ProgramClass) { return new ProgramClass(gl, renderer); });
        }
        EdgeCompoundProgram.prototype.bufferData = function () {
            this.programs.forEach(function (program) { return program.bufferData(); });
        };
        EdgeCompoundProgram.prototype.allocate = function (capacity) {
            this.programs.forEach(function (program) { return program.allocate(capacity); });
        };
        EdgeCompoundProgram.prototype.bind = function () {
            // nothing todo, it's already done in each program constructor
        };
        EdgeCompoundProgram.prototype.computeIndices = function () {
            this.programs.forEach(function (program) { return program.computeIndices(); });
        };
        EdgeCompoundProgram.prototype.render = function (params) {
            this.programs.forEach(function (program) {
                program.bind();
                program.bufferData();
                program.render(params);
            });
        };
        EdgeCompoundProgram.prototype.process = function (sourceData, targetData, data, hidden, offset) {
            this.programs.forEach(function (program) { return program.process(sourceData, targetData, data, hidden, offset); });
        };
        return EdgeCompoundProgram;
    }());
}
exports.createEdgeCompoundProgram = createEdgeCompoundProgram;

},{"./program":52}],51:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNodeCompoundProgram = exports.AbstractNodeProgram = void 0;
/**
 * Sigma.js WebGL Abstract Node Program
 * =====================================
 *
 * @module
 */
var program_1 = require("./program");
/**
 * Node Program class.
 *
 * @constructor
 */
var AbstractNodeProgram = /** @class */ (function (_super) {
    __extends(AbstractNodeProgram, _super);
    function AbstractNodeProgram(gl, vertexShaderSource, fragmentShaderSource, points, attributes) {
        var _this = _super.call(this, gl, vertexShaderSource, fragmentShaderSource, points, attributes) || this;
        // Locations
        _this.positionLocation = gl.getAttribLocation(_this.program, "a_position");
        _this.sizeLocation = gl.getAttribLocation(_this.program, "a_size");
        _this.colorLocation = gl.getAttribLocation(_this.program, "a_color");
        // Uniform Location
        var matrixLocation = gl.getUniformLocation(_this.program, "u_matrix");
        if (matrixLocation === null)
            throw new Error("AbstractNodeProgram: error while getting matrixLocation");
        _this.matrixLocation = matrixLocation;
        var ratioLocation = gl.getUniformLocation(_this.program, "u_ratio");
        if (ratioLocation === null)
            throw new Error("AbstractNodeProgram: error while getting ratioLocation");
        _this.ratioLocation = ratioLocation;
        var scaleLocation = gl.getUniformLocation(_this.program, "u_scale");
        if (scaleLocation === null)
            throw new Error("AbstractNodeProgram: error while getting scaleLocation");
        _this.scaleLocation = scaleLocation;
        return _this;
    }
    AbstractNodeProgram.prototype.bind = function () {
        var gl = this.gl;
        gl.enableVertexAttribArray(this.positionLocation);
        gl.enableVertexAttribArray(this.sizeLocation);
        gl.enableVertexAttribArray(this.colorLocation);
        gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, this.attributes * Float32Array.BYTES_PER_ELEMENT, 0);
        gl.vertexAttribPointer(this.sizeLocation, 1, gl.FLOAT, false, this.attributes * Float32Array.BYTES_PER_ELEMENT, 8);
        gl.vertexAttribPointer(this.colorLocation, 4, gl.UNSIGNED_BYTE, true, this.attributes * Float32Array.BYTES_PER_ELEMENT, 12);
    };
    return AbstractNodeProgram;
}(program_1.AbstractProgram));
exports.AbstractNodeProgram = AbstractNodeProgram;
/**
 * Helper function combining two or more programs into a single compound one.
 * Note that this is more a quick & easy way to combine program than a really
 * performant option. More performant programs can be written entirely.
 *
 * @param  {array}    programClasses - Program classes to combine.
 * @return {function}
 */
function createNodeCompoundProgram(programClasses) {
    return /** @class */ (function () {
        function NodeCompoundProgram(gl, renderer) {
            this.programs = programClasses.map(function (ProgramClass) { return new ProgramClass(gl, renderer); });
        }
        NodeCompoundProgram.prototype.bufferData = function () {
            this.programs.forEach(function (program) { return program.bufferData(); });
        };
        NodeCompoundProgram.prototype.allocate = function (capacity) {
            this.programs.forEach(function (program) { return program.allocate(capacity); });
        };
        NodeCompoundProgram.prototype.bind = function () {
            // nothing todo, it's already done in each program constructor
        };
        NodeCompoundProgram.prototype.render = function (params) {
            this.programs.forEach(function (program) {
                program.bind();
                program.bufferData();
                program.render(params);
            });
        };
        NodeCompoundProgram.prototype.process = function (data, hidden, offset) {
            this.programs.forEach(function (program) { return program.process(data, hidden, offset); });
        };
        return NodeCompoundProgram;
    }());
}
exports.createNodeCompoundProgram = createNodeCompoundProgram;

},{"./program":52}],52:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractProgram = void 0;
/**
 * Sigma.js WebGL Renderer Program
 * ================================
 *
 * Class representing a single WebGL program used by sigma's WebGL renderer.
 * @module
 */
var utils_1 = require("../../shaders/utils");
/**
 * Abstract Program class.
 *
 * @constructor
 */
var AbstractProgram = /** @class */ (function () {
    function AbstractProgram(gl, vertexShaderSource, fragmentShaderSource, points, attributes) {
        this.array = new Float32Array();
        this.points = points;
        this.attributes = attributes;
        this.gl = gl;
        this.vertexShaderSource = vertexShaderSource;
        this.fragmentShaderSource = fragmentShaderSource;
        var buffer = gl.createBuffer();
        if (buffer === null)
            throw new Error("AbstractProgram: error while creating the buffer");
        this.buffer = buffer;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        this.vertexShader = (0, utils_1.loadVertexShader)(gl, this.vertexShaderSource);
        this.fragmentShader = (0, utils_1.loadFragmentShader)(gl, this.fragmentShaderSource);
        this.program = (0, utils_1.loadProgram)(gl, [this.vertexShader, this.fragmentShader]);
    }
    AbstractProgram.prototype.bufferData = function () {
        var gl = this.gl;
        gl.bufferData(gl.ARRAY_BUFFER, this.array, gl.DYNAMIC_DRAW);
    };
    AbstractProgram.prototype.allocate = function (capacity) {
        this.array = new Float32Array(this.points * this.attributes * capacity);
    };
    AbstractProgram.prototype.hasNothingToRender = function () {
        return this.array.length === 0;
    };
    return AbstractProgram;
}());
exports.AbstractProgram = AbstractProgram;

},{"../../shaders/utils":65}],53:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Sigma.js WebGL Renderer Edge Arrow Program
 * ===========================================
 *
 * Compound program rendering edges as an arrow from the source to the target.
 * @module
 */
var edge_1 = require("./common/edge");
var edge_arrowHead_1 = __importDefault(require("./edge.arrowHead"));
var edge_clamped_1 = __importDefault(require("./edge.clamped"));
var EdgeArrowProgram = (0, edge_1.createEdgeCompoundProgram)([edge_clamped_1.default, edge_arrowHead_1.default]);
exports.default = EdgeArrowProgram;

},{"./common/edge":50,"./edge.arrowHead":54,"./edge.clamped":55}],54:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../../../utils");
var edge_arrowHead_vert_glsl_1 = __importDefault(require("../shaders/edge.arrowHead.vert.glsl.js"));
var edge_arrowHead_frag_glsl_1 = __importDefault(require("../shaders/edge.arrowHead.frag.glsl.js"));
var edge_1 = require("./common/edge");
var POINTS = 3, ATTRIBUTES = 9, STRIDE = POINTS * ATTRIBUTES;
var EdgeArrowHeadProgram = /** @class */ (function (_super) {
    __extends(EdgeArrowHeadProgram, _super);
    function EdgeArrowHeadProgram(gl) {
        var _this = _super.call(this, gl, edge_arrowHead_vert_glsl_1.default, edge_arrowHead_frag_glsl_1.default, POINTS, ATTRIBUTES) || this;
        // Locations
        _this.positionLocation = gl.getAttribLocation(_this.program, "a_position");
        _this.colorLocation = gl.getAttribLocation(_this.program, "a_color");
        _this.normalLocation = gl.getAttribLocation(_this.program, "a_normal");
        _this.radiusLocation = gl.getAttribLocation(_this.program, "a_radius");
        _this.barycentricLocation = gl.getAttribLocation(_this.program, "a_barycentric");
        // Uniform locations
        var matrixLocation = gl.getUniformLocation(_this.program, "u_matrix");
        if (matrixLocation === null)
            throw new Error("EdgeArrowHeadProgram: error while getting matrixLocation");
        _this.matrixLocation = matrixLocation;
        var sqrtZoomRatioLocation = gl.getUniformLocation(_this.program, "u_sqrtZoomRatio");
        if (sqrtZoomRatioLocation === null)
            throw new Error("EdgeArrowHeadProgram: error while getting sqrtZoomRatioLocation");
        _this.sqrtZoomRatioLocation = sqrtZoomRatioLocation;
        var correctionRatioLocation = gl.getUniformLocation(_this.program, "u_correctionRatio");
        if (correctionRatioLocation === null)
            throw new Error("EdgeArrowHeadProgram: error while getting correctionRatioLocation");
        _this.correctionRatioLocation = correctionRatioLocation;
        _this.bind();
        return _this;
    }
    EdgeArrowHeadProgram.prototype.bind = function () {
        var gl = this.gl;
        // Bindings
        gl.enableVertexAttribArray(this.positionLocation);
        gl.enableVertexAttribArray(this.normalLocation);
        gl.enableVertexAttribArray(this.radiusLocation);
        gl.enableVertexAttribArray(this.colorLocation);
        gl.enableVertexAttribArray(this.barycentricLocation);
        gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 0);
        gl.vertexAttribPointer(this.normalLocation, 2, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 8);
        gl.vertexAttribPointer(this.radiusLocation, 1, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 16);
        gl.vertexAttribPointer(this.colorLocation, 4, gl.UNSIGNED_BYTE, true, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 20);
        // TODO: maybe we can optimize here by packing this in a bit mask
        gl.vertexAttribPointer(this.barycentricLocation, 3, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 24);
    };
    EdgeArrowHeadProgram.prototype.computeIndices = function () {
        // nothing to do
    };
    EdgeArrowHeadProgram.prototype.process = function (sourceData, targetData, data, hidden, offset) {
        if (hidden) {
            for (var i_1 = offset * STRIDE, l = i_1 + STRIDE; i_1 < l; i_1++)
                this.array[i_1] = 0;
            return;
        }
        var thickness = data.size || 1, radius = targetData.size || 1, x1 = sourceData.x, y1 = sourceData.y, x2 = targetData.x, y2 = targetData.y, color = (0, utils_1.floatColor)(data.color);
        // Computing normals
        var dx = x2 - x1, dy = y2 - y1;
        var len = dx * dx + dy * dy, n1 = 0, n2 = 0;
        if (len) {
            len = 1 / Math.sqrt(len);
            n1 = -dy * len * thickness;
            n2 = dx * len * thickness;
        }
        var i = POINTS * ATTRIBUTES * offset;
        var array = this.array;
        // First point
        array[i++] = x2;
        array[i++] = y2;
        array[i++] = -n1;
        array[i++] = -n2;
        array[i++] = radius;
        array[i++] = color;
        array[i++] = 1;
        array[i++] = 0;
        array[i++] = 0;
        // Second point
        array[i++] = x2;
        array[i++] = y2;
        array[i++] = -n1;
        array[i++] = -n2;
        array[i++] = radius;
        array[i++] = color;
        array[i++] = 0;
        array[i++] = 1;
        array[i++] = 0;
        // Third point
        array[i++] = x2;
        array[i++] = y2;
        array[i++] = -n1;
        array[i++] = -n2;
        array[i++] = radius;
        array[i++] = color;
        array[i++] = 0;
        array[i++] = 0;
        array[i] = 1;
    };
    EdgeArrowHeadProgram.prototype.render = function (params) {
        if (this.hasNothingToRender())
            return;
        var gl = this.gl;
        var program = this.program;
        gl.useProgram(program);
        // Binding uniforms
        gl.uniformMatrix3fv(this.matrixLocation, false, params.matrix);
        gl.uniform1f(this.sqrtZoomRatioLocation, Math.sqrt(params.ratio));
        gl.uniform1f(this.correctionRatioLocation, params.correctionRatio);
        // Drawing:
        gl.drawArrays(gl.TRIANGLES, 0, this.array.length / ATTRIBUTES);
    };
    return EdgeArrowHeadProgram;
}(edge_1.AbstractEdgeProgram));
exports.default = EdgeArrowHeadProgram;

},{"../../../utils":73,"../shaders/edge.arrowHead.frag.glsl.js":58,"../shaders/edge.arrowHead.vert.glsl.js":59,"./common/edge":50}],55:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var edge_1 = require("./common/edge");
var utils_1 = require("../../../utils");
var edge_clamped_vert_glsl_1 = __importDefault(require("../shaders/edge.clamped.vert.glsl.js"));
var edge_frag_glsl_1 = __importDefault(require("../shaders/edge.frag.glsl.js"));
var POINTS = 4, ATTRIBUTES = 6, STRIDE = POINTS * ATTRIBUTES;
var EdgeClampedProgram = /** @class */ (function (_super) {
    __extends(EdgeClampedProgram, _super);
    function EdgeClampedProgram(gl) {
        var _this = _super.call(this, gl, edge_clamped_vert_glsl_1.default, edge_frag_glsl_1.default, POINTS, ATTRIBUTES) || this;
        // Initializing indices buffer
        var indicesBuffer = gl.createBuffer();
        if (indicesBuffer === null)
            throw new Error("EdgeClampedProgram: error while getting resolutionLocation");
        _this.indicesBuffer = indicesBuffer;
        // Locations:
        _this.positionLocation = gl.getAttribLocation(_this.program, "a_position");
        _this.colorLocation = gl.getAttribLocation(_this.program, "a_color");
        _this.normalLocation = gl.getAttribLocation(_this.program, "a_normal");
        _this.radiusLocation = gl.getAttribLocation(_this.program, "a_radius");
        // Uniform locations
        var matrixLocation = gl.getUniformLocation(_this.program, "u_matrix");
        if (matrixLocation === null)
            throw new Error("EdgeClampedProgram: error while getting matrixLocation");
        _this.matrixLocation = matrixLocation;
        var sqrtZoomRatioLocation = gl.getUniformLocation(_this.program, "u_sqrtZoomRatio");
        if (sqrtZoomRatioLocation === null)
            throw new Error("EdgeClampedProgram: error while getting cameraRatioLocation");
        _this.sqrtZoomRatioLocation = sqrtZoomRatioLocation;
        var correctionRatioLocation = gl.getUniformLocation(_this.program, "u_correctionRatio");
        if (correctionRatioLocation === null)
            throw new Error("EdgeClampedProgram: error while getting viewportRatioLocation");
        _this.correctionRatioLocation = correctionRatioLocation;
        // Enabling the OES_element_index_uint extension
        // NOTE: on older GPUs, this means that really large graphs won't
        // have all their edges rendered. But it seems that the
        // `OES_element_index_uint` is quite everywhere so we'll handle
        // the potential issue if it really arises.
        // NOTE: when using webgl2, the extension is enabled by default
        _this.canUse32BitsIndices = (0, utils_1.canUse32BitsIndices)(gl);
        _this.IndicesArray = _this.canUse32BitsIndices ? Uint32Array : Uint16Array;
        _this.indicesArray = new _this.IndicesArray();
        _this.indicesType = _this.canUse32BitsIndices ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT;
        _this.bind();
        return _this;
    }
    EdgeClampedProgram.prototype.bind = function () {
        var gl = this.gl;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
        // Bindings
        gl.enableVertexAttribArray(this.positionLocation);
        gl.enableVertexAttribArray(this.normalLocation);
        gl.enableVertexAttribArray(this.colorLocation);
        gl.enableVertexAttribArray(this.radiusLocation);
        gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 0);
        gl.vertexAttribPointer(this.normalLocation, 2, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 8);
        gl.vertexAttribPointer(this.colorLocation, 4, gl.UNSIGNED_BYTE, true, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 16);
        gl.vertexAttribPointer(this.radiusLocation, 1, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 20);
    };
    EdgeClampedProgram.prototype.process = function (sourceData, targetData, data, hidden, offset) {
        if (hidden) {
            for (var i_1 = offset * STRIDE, l = i_1 + STRIDE; i_1 < l; i_1++)
                this.array[i_1] = 0;
            return;
        }
        var thickness = data.size || 1, x1 = sourceData.x, y1 = sourceData.y, x2 = targetData.x, y2 = targetData.y, radius = targetData.size || 1, color = (0, utils_1.floatColor)(data.color);
        // Computing normals
        var dx = x2 - x1, dy = y2 - y1;
        var len = dx * dx + dy * dy, n1 = 0, n2 = 0;
        if (len) {
            len = 1 / Math.sqrt(len);
            n1 = -dy * len * thickness;
            n2 = dx * len * thickness;
        }
        var i = POINTS * ATTRIBUTES * offset;
        var array = this.array;
        // First point
        array[i++] = x1;
        array[i++] = y1;
        array[i++] = n1;
        array[i++] = n2;
        array[i++] = color;
        array[i++] = 0;
        // First point flipped
        array[i++] = x1;
        array[i++] = y1;
        array[i++] = -n1;
        array[i++] = -n2;
        array[i++] = color;
        array[i++] = 0;
        // Second point
        array[i++] = x2;
        array[i++] = y2;
        array[i++] = n1;
        array[i++] = n2;
        array[i++] = color;
        array[i++] = radius;
        // Second point flipped
        array[i++] = x2;
        array[i++] = y2;
        array[i++] = -n1;
        array[i++] = -n2;
        array[i++] = color;
        array[i] = -radius;
    };
    EdgeClampedProgram.prototype.computeIndices = function () {
        var l = this.array.length / ATTRIBUTES;
        var size = l + l / 2;
        var indices = new this.IndicesArray(size);
        for (var i = 0, c = 0; i < l; i += 4) {
            indices[c++] = i;
            indices[c++] = i + 1;
            indices[c++] = i + 2;
            indices[c++] = i + 2;
            indices[c++] = i + 1;
            indices[c++] = i + 3;
        }
        this.indicesArray = indices;
    };
    EdgeClampedProgram.prototype.bufferData = function () {
        _super.prototype.bufferData.call(this);
        // Indices data
        var gl = this.gl;
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indicesArray, gl.STATIC_DRAW);
    };
    EdgeClampedProgram.prototype.render = function (params) {
        if (this.hasNothingToRender())
            return;
        var gl = this.gl;
        var program = this.program;
        gl.useProgram(program);
        // Binding uniforms
        gl.uniformMatrix3fv(this.matrixLocation, false, params.matrix);
        gl.uniform1f(this.sqrtZoomRatioLocation, Math.sqrt(params.ratio));
        gl.uniform1f(this.correctionRatioLocation, params.correctionRatio);
        // Drawing:
        gl.drawElements(gl.TRIANGLES, this.indicesArray.length, this.indicesType, 0);
    };
    return EdgeClampedProgram;
}(edge_1.AbstractEdgeProgram));
exports.default = EdgeClampedProgram;

},{"../../../utils":73,"../shaders/edge.clamped.vert.glsl.js":60,"../shaders/edge.frag.glsl.js":61,"./common/edge":50}],56:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Sigma.js WebGL Renderer Edge Program
 * =====================================
 *
 * Program rendering edges as thick lines using four points translated
 * orthogonally from the source & target's centers by half thickness.
 *
 * Rendering two triangles by using only four points is made possible through
 * the use of indices.
 *
 * This method should be faster than the 6 points / 2 triangles approach and
 * should handle thickness better than with gl.LINES.
 *
 * This version of the shader balances geometry computation evenly between
 * the CPU & GPU (normals are computed on the CPU side).
 * @module
 */
var utils_1 = require("../../../utils");
var edge_vert_glsl_1 = __importDefault(require("../shaders/edge.vert.glsl.js"));
var edge_frag_glsl_1 = __importDefault(require("../shaders/edge.frag.glsl.js"));
var edge_1 = require("./common/edge");
var POINTS = 4, ATTRIBUTES = 5, STRIDE = POINTS * ATTRIBUTES;
var EdgeProgram = /** @class */ (function (_super) {
    __extends(EdgeProgram, _super);
    function EdgeProgram(gl) {
        var _this = _super.call(this, gl, edge_vert_glsl_1.default, edge_frag_glsl_1.default, POINTS, ATTRIBUTES) || this;
        // Initializing indices buffer
        var indicesBuffer = gl.createBuffer();
        if (indicesBuffer === null)
            throw new Error("EdgeProgram: error while creating indicesBuffer");
        _this.indicesBuffer = indicesBuffer;
        // Locations
        _this.positionLocation = gl.getAttribLocation(_this.program, "a_position");
        _this.colorLocation = gl.getAttribLocation(_this.program, "a_color");
        _this.normalLocation = gl.getAttribLocation(_this.program, "a_normal");
        var matrixLocation = gl.getUniformLocation(_this.program, "u_matrix");
        if (matrixLocation === null)
            throw new Error("EdgeProgram: error while getting matrixLocation");
        _this.matrixLocation = matrixLocation;
        var correctionRatioLocation = gl.getUniformLocation(_this.program, "u_correctionRatio");
        if (correctionRatioLocation === null)
            throw new Error("EdgeProgram: error while getting correctionRatioLocation");
        _this.correctionRatioLocation = correctionRatioLocation;
        var sqrtZoomRatioLocation = gl.getUniformLocation(_this.program, "u_sqrtZoomRatio");
        if (sqrtZoomRatioLocation === null)
            throw new Error("EdgeProgram: error while getting sqrtZoomRatioLocation");
        _this.sqrtZoomRatioLocation = sqrtZoomRatioLocation;
        // Enabling the OES_element_index_uint extension
        // NOTE: on older GPUs, this means that really large graphs won't
        // have all their edges rendered. But it seems that the
        // `OES_element_index_uint` is quite everywhere so we'll handle
        // the potential issue if it really arises.
        // NOTE: when using webgl2, the extension is enabled by default
        _this.canUse32BitsIndices = (0, utils_1.canUse32BitsIndices)(gl);
        _this.IndicesArray = _this.canUse32BitsIndices ? Uint32Array : Uint16Array;
        _this.indicesArray = new _this.IndicesArray();
        _this.indicesType = _this.canUse32BitsIndices ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT;
        _this.bind();
        return _this;
    }
    EdgeProgram.prototype.bind = function () {
        var gl = this.gl;
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
        // Bindings
        gl.enableVertexAttribArray(this.positionLocation);
        gl.enableVertexAttribArray(this.normalLocation);
        gl.enableVertexAttribArray(this.colorLocation);
        gl.vertexAttribPointer(this.positionLocation, 2, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 0);
        gl.vertexAttribPointer(this.normalLocation, 2, gl.FLOAT, false, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 8);
        gl.vertexAttribPointer(this.colorLocation, 4, gl.UNSIGNED_BYTE, true, ATTRIBUTES * Float32Array.BYTES_PER_ELEMENT, 16);
    };
    EdgeProgram.prototype.computeIndices = function () {
        var l = this.array.length / ATTRIBUTES;
        var size = l + l / 2;
        var indices = new this.IndicesArray(size);
        for (var i = 0, c = 0; i < l; i += 4) {
            indices[c++] = i;
            indices[c++] = i + 1;
            indices[c++] = i + 2;
            indices[c++] = i + 2;
            indices[c++] = i + 1;
            indices[c++] = i + 3;
        }
        this.indicesArray = indices;
    };
    EdgeProgram.prototype.bufferData = function () {
        _super.prototype.bufferData.call(this);
        // Indices data
        var gl = this.gl;
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indicesArray, gl.STATIC_DRAW);
    };
    EdgeProgram.prototype.process = function (sourceData, targetData, data, hidden, offset) {
        if (hidden) {
            for (var i_1 = offset * STRIDE, l = i_1 + STRIDE; i_1 < l; i_1++)
                this.array[i_1] = 0;
            return;
        }
        var thickness = data.size || 1, x1 = sourceData.x, y1 = sourceData.y, x2 = targetData.x, y2 = targetData.y, color = (0, utils_1.floatColor)(data.color);
        // Computing normals
        var dx = x2 - x1, dy = y2 - y1;
        var len = dx * dx + dy * dy, n1 = 0, n2 = 0;
        if (len) {
            len = 1 / Math.sqrt(len);
            n1 = -dy * len * thickness;
            n2 = dx * len * thickness;
        }
        var i = POINTS * ATTRIBUTES * offset;
        var array = this.array;
        // First point
        array[i++] = x1;
        array[i++] = y1;
        array[i++] = n1;
        array[i++] = n2;
        array[i++] = color;
        // First point flipped
        array[i++] = x1;
        array[i++] = y1;
        array[i++] = -n1;
        array[i++] = -n2;
        array[i++] = color;
        // Second point
        array[i++] = x2;
        array[i++] = y2;
        array[i++] = n1;
        array[i++] = n2;
        array[i++] = color;
        // Second point flipped
        array[i++] = x2;
        array[i++] = y2;
        array[i++] = -n1;
        array[i++] = -n2;
        array[i] = color;
    };
    EdgeProgram.prototype.render = function (params) {
        if (this.hasNothingToRender())
            return;
        var gl = this.gl;
        var program = this.program;
        gl.useProgram(program);
        gl.uniformMatrix3fv(this.matrixLocation, false, params.matrix);
        gl.uniform1f(this.sqrtZoomRatioLocation, Math.sqrt(params.ratio));
        gl.uniform1f(this.correctionRatioLocation, params.correctionRatio);
        // Drawing:
        gl.drawElements(gl.TRIANGLES, this.indicesArray.length, this.indicesType, 0);
    };
    return EdgeProgram;
}(edge_1.AbstractEdgeProgram));
exports.default = EdgeProgram;

},{"../../../utils":73,"../shaders/edge.frag.glsl.js":61,"../shaders/edge.vert.glsl.js":62,"./common/edge":50}],57:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../../../utils");
var node_fast_vert_glsl_1 = __importDefault(require("../shaders/node.fast.vert.glsl.js"));
var node_fast_frag_glsl_1 = __importDefault(require("../shaders/node.fast.frag.glsl.js"));
var node_1 = require("./common/node");
var POINTS = 1, ATTRIBUTES = 4;
var NodeFastProgram = /** @class */ (function (_super) {
    __extends(NodeFastProgram, _super);
    function NodeFastProgram(gl) {
        var _this = _super.call(this, gl, node_fast_vert_glsl_1.default, node_fast_frag_glsl_1.default, POINTS, ATTRIBUTES) || this;
        _this.bind();
        return _this;
    }
    NodeFastProgram.prototype.process = function (data, hidden, offset) {
        var array = this.array;
        var i = offset * POINTS * ATTRIBUTES;
        if (hidden) {
            array[i++] = 0;
            array[i++] = 0;
            array[i++] = 0;
            array[i++] = 0;
            return;
        }
        var color = (0, utils_1.floatColor)(data.color);
        array[i++] = data.x;
        array[i++] = data.y;
        array[i++] = data.size;
        array[i] = color;
    };
    NodeFastProgram.prototype.render = function (params) {
        if (this.hasNothingToRender())
            return;
        var gl = this.gl;
        var program = this.program;
        gl.useProgram(program);
        gl.uniform1f(this.ratioLocation, 1 / Math.sqrt(params.ratio));
        gl.uniform1f(this.scaleLocation, params.scalingRatio);
        gl.uniformMatrix3fv(this.matrixLocation, false, params.matrix);
        gl.drawArrays(gl.POINTS, 0, this.array.length / ATTRIBUTES);
    };
    return NodeFastProgram;
}(node_1.AbstractNodeProgram));
exports.default = NodeFastProgram;

},{"../../../utils":73,"../shaders/node.fast.frag.glsl.js":63,"../shaders/node.fast.vert.glsl.js":64,"./common/node":51}],58:[function(require,module,exports){
(()=>{"use strict";var e={d:(o,r)=>{for(var t in r)e.o(r,t)&&!e.o(o,t)&&Object.defineProperty(o,t,{enumerable:!0,get:r[t]})},o:(e,o)=>Object.prototype.hasOwnProperty.call(e,o),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},o={};e.r(o),e.d(o,{default:()=>r});const r="precision mediump float;\n\nvarying vec4 v_color;\n\nvoid main(void) {\n  gl_FragColor = v_color;\n}\n";module.exports=o})();
},{}],59:[function(require,module,exports){
(()=>{"use strict";var a={d:(e,t)=>{for(var o in t)a.o(t,o)&&!a.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:t[o]})},o:(a,e)=>Object.prototype.hasOwnProperty.call(a,e),r:a=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(a,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(a,"__esModule",{value:!0})}},e={};a.r(e),a.d(e,{default:()=>t});const t="attribute vec2 a_position;\nattribute vec2 a_normal;\nattribute float a_radius;\nattribute vec4 a_color;\nattribute vec3 a_barycentric;\n\nuniform mat3 u_matrix;\nuniform float u_sqrtZoomRatio;\nuniform float u_correctionRatio;\n\nvarying vec4 v_color;\n\nconst float minThickness = 1.7;\nconst float bias = 255.0 / 254.0;\nconst float arrowHeadWidthLengthRatio = 0.66;\nconst float arrowHeadLengthThicknessRatio = 2.5;\n\nvoid main() {\n  float normalLength = length(a_normal);\n  vec2 unitNormal = a_normal / normalLength;\n\n  // These first computations are taken from edge.vert.glsl and\n  // edge.clamped.vert.glsl. Please read it to get better comments on what's\n  // happening:\n  float pixelsThickness = max(normalLength, minThickness * u_sqrtZoomRatio);\n  float webGLThickness = pixelsThickness * u_correctionRatio;\n  float adaptedWebGLThickness = webGLThickness * u_sqrtZoomRatio;\n  float adaptedWebGLNodeRadius = a_radius * 2.0 * u_correctionRatio * u_sqrtZoomRatio;\n  float adaptedWebGLArrowHeadLength = adaptedWebGLThickness * 2.0 * arrowHeadLengthThicknessRatio;\n  float adaptedWebGLArrowHeadHalfWidth = adaptedWebGLArrowHeadLength * arrowHeadWidthLengthRatio / 2.0;\n\n  float da = a_barycentric.x;\n  float db = a_barycentric.y;\n  float dc = a_barycentric.z;\n\n  vec2 delta = vec2(\n      da * (adaptedWebGLNodeRadius * unitNormal.y)\n    + db * ((adaptedWebGLNodeRadius + adaptedWebGLArrowHeadLength) * unitNormal.y + adaptedWebGLArrowHeadHalfWidth * unitNormal.x)\n    + dc * ((adaptedWebGLNodeRadius + adaptedWebGLArrowHeadLength) * unitNormal.y - adaptedWebGLArrowHeadHalfWidth * unitNormal.x),\n\n      da * (-adaptedWebGLNodeRadius * unitNormal.x)\n    + db * (-(adaptedWebGLNodeRadius + adaptedWebGLArrowHeadLength) * unitNormal.x + adaptedWebGLArrowHeadHalfWidth * unitNormal.y)\n    + dc * (-(adaptedWebGLNodeRadius + adaptedWebGLArrowHeadLength) * unitNormal.x - adaptedWebGLArrowHeadHalfWidth * unitNormal.y)\n  );\n\n  vec2 position = (u_matrix * vec3(a_position + delta, 1)).xy;\n\n  gl_Position = vec4(position, 0, 1);\n\n  // Extract the color:\n  v_color = a_color;\n  v_color.a *= bias;\n}\n";module.exports=e})();
},{}],60:[function(require,module,exports){
(()=>{"use strict";var e={d:(o,n)=>{for(var t in n)e.o(n,t)&&!e.o(o,t)&&Object.defineProperty(o,t,{enumerable:!0,get:n[t]})},o:(e,o)=>Object.prototype.hasOwnProperty.call(e,o),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},o={};e.r(o),e.d(o,{default:()=>n});const n="attribute vec4 a_color;\nattribute vec2 a_normal;\nattribute vec2 a_position;\nattribute float a_radius;\n\nuniform mat3 u_matrix;\nuniform float u_sqrtZoomRatio;\nuniform float u_correctionRatio;\n\nvarying vec4 v_color;\nvarying vec2 v_normal;\nvarying float v_thickness;\n\nconst float minThickness = 1.7;\nconst float bias = 255.0 / 254.0;\nconst float arrowHeadLengthThicknessRatio = 2.5;\n\nvoid main() {\n  float normalLength = length(a_normal);\n  vec2 unitNormal = a_normal / normalLength;\n\n  // These first computations are taken from edge.vert.glsl. Please read it to\n  // get better comments on what's happening:\n  float pixelsThickness = max(normalLength, minThickness * u_sqrtZoomRatio);\n  float webGLThickness = pixelsThickness * u_correctionRatio;\n  float adaptedWebGLThickness = webGLThickness * u_sqrtZoomRatio;\n\n  // Here, we move the point to leave space for the arrow head:\n  float direction = sign(a_radius);\n  float adaptedWebGLNodeRadius = direction * a_radius * 2.0 * u_correctionRatio * u_sqrtZoomRatio;\n  float adaptedWebGLArrowHeadLength = adaptedWebGLThickness * 2.0 * arrowHeadLengthThicknessRatio;\n\n  vec2 compensationVector = vec2(-direction * unitNormal.y, direction * unitNormal.x) * (adaptedWebGLNodeRadius + adaptedWebGLArrowHeadLength);\n\n  // Here is the proper position of the vertex\n  gl_Position = vec4((u_matrix * vec3(a_position + unitNormal * adaptedWebGLThickness + compensationVector, 1)).xy, 0, 1);\n\n  v_thickness = webGLThickness / u_sqrtZoomRatio;\n\n  v_normal = unitNormal;\n  v_color = a_color;\n  v_color.a *= bias;\n}\n";module.exports=o})();
},{}],61:[function(require,module,exports){
(()=>{"use strict";var e={d:(n,t)=>{for(var o in t)e.o(t,o)&&!e.o(n,o)&&Object.defineProperty(n,o,{enumerable:!0,get:t[o]})},o:(e,n)=>Object.prototype.hasOwnProperty.call(e,n),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},n={};e.r(n),e.d(n,{default:()=>t});const t="precision mediump float;\n\nvarying vec4 v_color;\nvarying vec2 v_normal;\nvarying float v_thickness;\n\nconst float feather = 0.001;\nconst vec4 transparent = vec4(0.0, 0.0, 0.0, 0.0);\n\nvoid main(void) {\n  float dist = length(v_normal) * v_thickness;\n\n  float t = smoothstep(\n    v_thickness - feather,\n    v_thickness,\n    dist\n  );\n\n  gl_FragColor = mix(v_color, transparent, t);\n}\n";module.exports=n})();
},{}],62:[function(require,module,exports){
(()=>{"use strict";var e={d:(n,o)=>{for(var t in o)e.o(o,t)&&!e.o(n,t)&&Object.defineProperty(n,t,{enumerable:!0,get:o[t]})},o:(e,n)=>Object.prototype.hasOwnProperty.call(e,n),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},n={};e.r(n),e.d(n,{default:()=>o});const o='attribute vec4 a_color;\nattribute vec2 a_normal;\nattribute vec2 a_position;\n\nuniform mat3 u_matrix;\nuniform float u_sqrtZoomRatio;\nuniform float u_correctionRatio;\n\nvarying vec4 v_color;\nvarying vec2 v_normal;\nvarying float v_thickness;\n\nconst float minThickness = 1.7;\nconst float bias = 255.0 / 254.0;\n\nvoid main() {\n  float normalLength = length(a_normal);\n  vec2 unitNormal = a_normal / normalLength;\n\n  // We require edges to be at least `minThickness` pixels thick *on screen*\n  // (so we need to compensate the SQRT zoom ratio):\n  float pixelsThickness = max(normalLength, minThickness * u_sqrtZoomRatio);\n\n  // Then, we need to retrieve the normalized thickness of the edge in the WebGL\n  // referential (in a ([0, 1], [0, 1]) space), using our "magic" correction\n  // ratio:\n  float webGLThickness = pixelsThickness * u_correctionRatio;\n\n  // Finally, we adapt the edge thickness to the "SQRT rule" in sigma (so that\n  // items are not too big when zoomed in, and not too small when zoomed out).\n  // The exact computation should be `adapted = value * zoom / sqrt(zoom)`, but\n  // it\'s simpler like this:\n  float adaptedWebGLThickness = webGLThickness * u_sqrtZoomRatio;\n\n  // Here is the proper position of the vertex\n  gl_Position = vec4((u_matrix * vec3(a_position + unitNormal * adaptedWebGLThickness, 1)).xy, 0, 1);\n\n  // For the fragment shader though, we need a thickness that takes the "magic"\n  // correction ratio into account (as in webGLThickness), but so that the\n  // antialiasint effect does not depend on the zoom level. So here\'s yet\n  // another thickness version:\n  v_thickness = webGLThickness / u_sqrtZoomRatio;\n\n  v_normal = unitNormal;\n  v_color = a_color;\n  v_color.a *= bias;\n}\n';module.exports=n})();
},{}],63:[function(require,module,exports){
(()=>{"use strict";var e={d:(n,o)=>{for(var t in o)e.o(o,t)&&!e.o(n,t)&&Object.defineProperty(n,t,{enumerable:!0,get:o[t]})},o:(e,n)=>Object.prototype.hasOwnProperty.call(e,n),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},n={};e.r(n),e.d(n,{default:()=>o});const o="precision mediump float;\n\nvarying vec4 v_color;\nvarying float v_border;\n\nconst float radius = 0.5;\nconst vec4 transparent = vec4(0.0, 0.0, 0.0, 0.0);\n\nvoid main(void) {\n  vec2 m = gl_PointCoord - vec2(0.5, 0.5);\n  float dist = radius - length(m);\n\n  float t = 0.0;\n  if (dist > v_border)\n    t = 1.0;\n  else if (dist > 0.0)\n    t = dist / v_border;\n\n  gl_FragColor = mix(transparent, v_color, t);\n}\n";module.exports=n})();
},{}],64:[function(require,module,exports){
(()=>{"use strict";var o={d:(t,e)=>{for(var n in e)o.o(e,n)&&!o.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:e[n]})},o:(o,t)=>Object.prototype.hasOwnProperty.call(o,t),r:o=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(o,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(o,"__esModule",{value:!0})}},t={};o.r(t),o.d(t,{default:()=>e});const e="attribute vec2 a_position;\nattribute float a_size;\nattribute vec4 a_color;\n\nuniform float u_ratio;\nuniform float u_scale;\nuniform mat3 u_matrix;\n\nvarying vec4 v_color;\nvarying float v_border;\n\nconst float bias = 255.0 / 254.0;\n\nvoid main() {\n  gl_Position = vec4(\n    (u_matrix * vec3(a_position, 1)).xy,\n    0,\n    1\n  );\n\n  // Multiply the point size twice:\n  //  - x SCALING_RATIO to correct the canvas scaling\n  //  - x 2 to correct the formulae\n  gl_PointSize = a_size * u_ratio * u_scale * 2.0;\n\n  v_border = (1.0 / u_ratio) * (0.5 / a_size);\n\n  // Extract the color:\n  v_color = a_color;\n  v_color.a *= bias;\n}\n";module.exports=t})();
},{}],65:[function(require,module,exports){
"use strict";
/**
 * Sigma.js Shader Utils
 * ======================
 *
 * Code used to load sigma's shaders.
 * @module
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadProgram = exports.loadFragmentShader = exports.loadVertexShader = void 0;
/**
 * Function used to load a shader.
 */
function loadShader(type, gl, source) {
    var glType = type === "VERTEX" ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER;
    // Creating the shader
    var shader = gl.createShader(glType);
    if (shader === null) {
        throw new Error("loadShader: error while creating the shader");
    }
    // Loading source
    gl.shaderSource(shader, source);
    // Compiling the shader
    gl.compileShader(shader);
    // Retrieving compilation status
    var successfullyCompiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    // Throwing if something went awry
    if (!successfullyCompiled) {
        var infoLog = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error("loadShader: error while compiling the shader:\n".concat(infoLog, "\n").concat(source));
    }
    return shader;
}
function loadVertexShader(gl, source) {
    return loadShader("VERTEX", gl, source);
}
exports.loadVertexShader = loadVertexShader;
function loadFragmentShader(gl, source) {
    return loadShader("FRAGMENT", gl, source);
}
exports.loadFragmentShader = loadFragmentShader;
/**
 * Function used to load a program.
 */
function loadProgram(gl, shaders) {
    var program = gl.createProgram();
    if (program === null) {
        throw new Error("loadProgram: error while creating the program.");
    }
    var i, l;
    // Attaching the shaders
    for (i = 0, l = shaders.length; i < l; i++)
        gl.attachShader(program, shaders[i]);
    gl.linkProgram(program);
    // Checking status
    var successfullyLinked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!successfullyLinked) {
        gl.deleteProgram(program);
        throw new Error("loadProgram: error while linking the program.");
    }
    return program;
}
exports.loadProgram = loadProgram;

},{}],66:[function(require,module,exports){
"use strict";
/**
 * Sigma.js Settings
 * =================================
 *
 * The list of settings and some handy functions.
 * @module
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_SETTINGS = exports.validateSettings = void 0;
var label_1 = __importDefault(require("./rendering/canvas/label"));
var hover_1 = __importDefault(require("./rendering/canvas/hover"));
var edge_label_1 = __importDefault(require("./rendering/canvas/edge-label"));
var node_fast_1 = __importDefault(require("./rendering/webgl/programs/node.fast"));
var edge_1 = __importDefault(require("./rendering/webgl/programs/edge"));
var edge_arrow_1 = __importDefault(require("./rendering/webgl/programs/edge.arrow"));
function validateSettings(settings) {
    if (typeof settings.labelDensity !== "number" || settings.labelDensity < 0) {
        throw new Error("Settings: invalid `labelDensity`. Expecting a positive number.");
    }
    var minCameraRatio = settings.minCameraRatio, maxCameraRatio = settings.maxCameraRatio;
    if (typeof minCameraRatio === "number" && typeof maxCameraRatio === "number" && maxCameraRatio < minCameraRatio) {
        throw new Error("Settings: invalid camera ratio boundaries. Expecting `maxCameraRatio` to be greater than `minCameraRatio`.");
    }
}
exports.validateSettings = validateSettings;
exports.DEFAULT_SETTINGS = {
    // Performance
    hideEdgesOnMove: false,
    hideLabelsOnMove: false,
    renderLabels: true,
    renderEdgeLabels: false,
    enableEdgeClickEvents: false,
    enableEdgeWheelEvents: false,
    enableEdgeHoverEvents: false,
    // Component rendering
    defaultNodeColor: "#999",
    defaultNodeType: "circle",
    defaultEdgeColor: "#ccc",
    defaultEdgeType: "line",
    labelFont: "Arial",
    labelSize: 14,
    labelWeight: "normal",
    labelColor: { color: "#000" },
    edgeLabelFont: "Arial",
    edgeLabelSize: 14,
    edgeLabelWeight: "normal",
    edgeLabelColor: { attribute: "color" },
    stagePadding: 30,
    // Labels
    labelDensity: 1,
    labelGridCellSize: 100,
    labelRenderedSizeThreshold: 6,
    // Reducers
    nodeReducer: null,
    edgeReducer: null,
    // Features
    zIndex: false,
    minCameraRatio: null,
    maxCameraRatio: null,
    // Renderers
    labelRenderer: label_1.default,
    hoverRenderer: hover_1.default,
    edgeLabelRenderer: edge_label_1.default,
    // Lifecycle
    allowInvalidContainer: false,
    // Program classes
    nodeProgramClasses: {
        circle: node_fast_1.default,
    },
    edgeProgramClasses: {
        arrow: edge_arrow_1.default,
        line: edge_1.default,
    },
};

},{"./rendering/canvas/edge-label":47,"./rendering/canvas/hover":48,"./rendering/canvas/label":49,"./rendering/webgl/programs/edge":56,"./rendering/webgl/programs/edge.arrow":53,"./rendering/webgl/programs/node.fast":57}],67:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var camera_1 = __importDefault(require("./core/camera"));
var mouse_1 = __importDefault(require("./core/captors/mouse"));
var quadtree_1 = __importDefault(require("./core/quadtree"));
var types_1 = require("./types");
var utils_1 = require("./utils");
var labels_1 = require("./core/labels");
var settings_1 = require("./settings");
var touch_1 = __importDefault(require("./core/captors/touch"));
var matrices_1 = require("./utils/matrices");
var edge_collisions_1 = require("./utils/edge-collisions");
/**
 * Important functions.
 */
function applyNodeDefaults(settings, key, data) {
    if (!data.hasOwnProperty("x") || !data.hasOwnProperty("y"))
        throw new Error("Sigma: could not find a valid position (x, y) for node \"".concat(key, "\". All your nodes must have a number \"x\" and \"y\". Maybe your forgot to apply a layout or your \"nodeReducer\" is not returning the correct data?"));
    if (!data.color)
        data.color = settings.defaultNodeColor;
    if (!data.label && data.label !== "")
        data.label = null;
    if (data.label !== undefined && data.label !== null)
        data.label = "" + data.label;
    else
        data.label = null;
    if (!data.size)
        data.size = 2;
    if (!data.hasOwnProperty("hidden"))
        data.hidden = false;
    if (!data.hasOwnProperty("highlighted"))
        data.highlighted = false;
    if (!data.hasOwnProperty("forceLabel"))
        data.forceLabel = false;
    if (!data.type || data.type === "")
        data.type = settings.defaultNodeType;
    if (!data.zIndex)
        data.zIndex = 0;
    return data;
}
function applyEdgeDefaults(settings, key, data) {
    if (!data.color)
        data.color = settings.defaultEdgeColor;
    if (!data.label)
        data.label = "";
    if (!data.size)
        data.size = 0.5;
    if (!data.hasOwnProperty("hidden"))
        data.hidden = false;
    if (!data.hasOwnProperty("forceLabel"))
        data.forceLabel = false;
    if (!data.type || data.type === "")
        data.type = settings.defaultEdgeType;
    if (!data.zIndex)
        data.zIndex = 0;
    return data;
}
/**
 * Main class.
 *
 * @constructor
 * @param {Graph}       graph     - Graph to render.
 * @param {HTMLElement} container - DOM container in which to render.
 * @param {object}      settings  - Optional settings.
 */
var Sigma = /** @class */ (function (_super) {
    __extends(Sigma, _super);
    function Sigma(graph, container, settings) {
        if (settings === void 0) { settings = {}; }
        var _this = _super.call(this) || this;
        _this.elements = {};
        _this.canvasContexts = {};
        _this.webGLContexts = {};
        _this.activeListeners = {};
        _this.quadtree = new quadtree_1.default();
        _this.labelGrid = new labels_1.LabelGrid();
        _this.nodeDataCache = {};
        _this.edgeDataCache = {};
        _this.nodesWithForcedLabels = [];
        _this.edgesWithForcedLabels = [];
        _this.nodeExtent = { x: [0, 1], y: [0, 1] };
        _this.matrix = (0, matrices_1.identity)();
        _this.invMatrix = (0, matrices_1.identity)();
        _this.correctionRatio = 1;
        _this.customBBox = null;
        _this.normalizationFunction = (0, utils_1.createNormalizationFunction)({
            x: [0, 1],
            y: [0, 1],
        });
        // Cache:
        _this.cameraSizeRatio = 1;
        // Starting dimensions and pixel ratio
        _this.width = 0;
        _this.height = 0;
        _this.pixelRatio = (0, utils_1.getPixelRatio)();
        // State
        _this.displayedLabels = new Set();
        _this.highlightedNodes = new Set();
        _this.hoveredNode = null;
        _this.hoveredEdge = null;
        _this.renderFrame = null;
        _this.renderHighlightedNodesFrame = null;
        _this.needToProcess = false;
        _this.needToSoftProcess = false;
        _this.checkEdgesEventsFrame = null;
        // Programs
        _this.nodePrograms = {};
        _this.hoverNodePrograms = {};
        _this.edgePrograms = {};
        _this.settings = (0, utils_1.assign)({}, settings_1.DEFAULT_SETTINGS, settings);
        // Validating
        (0, settings_1.validateSettings)(_this.settings);
        (0, utils_1.validateGraph)(graph);
        if (!(container instanceof HTMLElement))
            throw new Error("Sigma: container should be an html element.");
        // Properties
        _this.graph = graph;
        _this.container = container;
        // Initializing contexts
        _this.createWebGLContext("edges", { preserveDrawingBuffer: true });
        _this.createCanvasContext("edgeLabels");
        _this.createWebGLContext("nodes");
        _this.createCanvasContext("labels");
        _this.createCanvasContext("hovers");
        _this.createWebGLContext("hoverNodes");
        _this.createCanvasContext("mouse");
        // Blending
        for (var key in _this.webGLContexts) {
            var gl = _this.webGLContexts[key];
            gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
            gl.enable(gl.BLEND);
        }
        // Loading programs
        for (var type in _this.settings.nodeProgramClasses) {
            var NodeProgramClass = _this.settings.nodeProgramClasses[type];
            _this.nodePrograms[type] = new NodeProgramClass(_this.webGLContexts.nodes, _this);
            _this.hoverNodePrograms[type] = new NodeProgramClass(_this.webGLContexts.hoverNodes, _this);
        }
        for (var type in _this.settings.edgeProgramClasses) {
            var EdgeProgramClass = _this.settings.edgeProgramClasses[type];
            _this.edgePrograms[type] = new EdgeProgramClass(_this.webGLContexts.edges, _this);
        }
        // Initial resize
        _this.resize();
        // Initializing the camera
        _this.camera = new camera_1.default();
        // Binding camera events
        _this.bindCameraHandlers();
        // Initializing captors
        _this.mouseCaptor = new mouse_1.default(_this.elements.mouse, _this);
        _this.touchCaptor = new touch_1.default(_this.elements.mouse, _this);
        // Binding event handlers
        _this.bindEventHandlers();
        // Binding graph handlers
        _this.bindGraphHandlers();
        // Trigger eventual settings-related things
        _this.handleSettingsUpdate();
        // Processing data for the first time & render
        _this.process();
        _this.render();
        return _this;
    }
    /**---------------------------------------------------------------------------
     * Internal methods.
     **---------------------------------------------------------------------------
     */
    /**
     * Internal function used to create a canvas element.
     * @param  {string} id - Context's id.
     * @return {Sigma}
     */
    Sigma.prototype.createCanvas = function (id) {
        var canvas = (0, utils_1.createElement)("canvas", {
            position: "absolute",
        }, {
            class: "sigma-".concat(id),
        });
        this.elements[id] = canvas;
        this.container.appendChild(canvas);
        return canvas;
    };
    /**
     * Internal function used to create a canvas context and add the relevant
     * DOM elements.
     *
     * @param  {string} id - Context's id.
     * @return {Sigma}
     */
    Sigma.prototype.createCanvasContext = function (id) {
        var canvas = this.createCanvas(id);
        var contextOptions = {
            preserveDrawingBuffer: false,
            antialias: false,
        };
        this.canvasContexts[id] = canvas.getContext("2d", contextOptions);
        return this;
    };
    /**
     * Internal function used to create a canvas context and add the relevant
     * DOM elements.
     *
     * @param  {string}  id      - Context's id.
     * @param  {object?} options - #getContext params to override (optional)
     * @return {Sigma}
     */
    Sigma.prototype.createWebGLContext = function (id, options) {
        var canvas = this.createCanvas(id);
        var contextOptions = __assign({ preserveDrawingBuffer: false, antialias: false }, (options || {}));
        var context;
        // First we try webgl2 for an easy performance boost
        context = canvas.getContext("webgl2", contextOptions);
        // Else we fall back to webgl
        if (!context)
            context = canvas.getContext("webgl", contextOptions);
        // Edge, I am looking right at you...
        if (!context)
            context = canvas.getContext("experimental-webgl", contextOptions);
        this.webGLContexts[id] = context;
        return this;
    };
    /**
     * Method binding camera handlers.
     *
     * @return {Sigma}
     */
    Sigma.prototype.bindCameraHandlers = function () {
        var _this = this;
        this.activeListeners.camera = function () {
            _this._scheduleRefresh();
        };
        this.camera.on("updated", this.activeListeners.camera);
        return this;
    };
    /**
     * Method that checks whether or not a node collides with a given position.
     */
    Sigma.prototype.mouseIsOnNode = function (_a, _b, size) {
        var x = _a.x, y = _a.y;
        var nodeX = _b.x, nodeY = _b.y;
        return (x > nodeX - size &&
            x < nodeX + size &&
            y > nodeY - size &&
            y < nodeY + size &&
            Math.sqrt(Math.pow(x - nodeX, 2) + Math.pow(y - nodeY, 2)) < size);
    };
    /**
     * Method that returns all nodes in quad at a given position.
     */
    Sigma.prototype.getQuadNodes = function (position) {
        var mouseGraphPosition = this.viewportToFramedGraph(position);
        return this.quadtree.point(mouseGraphPosition.x, 1 - mouseGraphPosition.y);
    };
    /**
     * Method that returns the closest node to a given position.
     */
    Sigma.prototype.getNodeAtPosition = function (position) {
        var x = position.x, y = position.y;
        var quadNodes = this.getQuadNodes(position);
        // We will hover the node whose center is closest to mouse
        var minDistance = Infinity, nodeAtPosition = null;
        for (var i = 0, l = quadNodes.length; i < l; i++) {
            var node = quadNodes[i];
            var data = this.nodeDataCache[node];
            var nodePosition = this.framedGraphToViewport(data);
            var size = this.scaleSize(data.size);
            if (!data.hidden && this.mouseIsOnNode(position, nodePosition, size)) {
                var distance = Math.sqrt(Math.pow(x - nodePosition.x, 2) + Math.pow(y - nodePosition.y, 2));
                // TODO: sort by min size also for cases where center is the same
                if (distance < minDistance) {
                    minDistance = distance;
                    nodeAtPosition = node;
                }
            }
        }
        return nodeAtPosition;
    };
    /**
     * Method binding event handlers.
     *
     * @return {Sigma}
     */
    Sigma.prototype.bindEventHandlers = function () {
        var _this = this;
        // Handling window resize
        this.activeListeners.handleResize = function () {
            _this.needToSoftProcess = true;
            _this._scheduleRefresh();
        };
        window.addEventListener("resize", this.activeListeners.handleResize);
        // Handling mouse move
        this.activeListeners.handleMove = function (e) {
            var baseEvent = {
                event: e,
                preventSigmaDefault: function () {
                    e.preventSigmaDefault();
                },
            };
            var nodeToHover = _this.getNodeAtPosition(e);
            if (nodeToHover && _this.hoveredNode !== nodeToHover && !_this.nodeDataCache[nodeToHover].hidden) {
                // Handling passing from one node to the other directly
                if (_this.hoveredNode)
                    _this.emit("leaveNode", __assign(__assign({}, baseEvent), { node: _this.hoveredNode }));
                _this.hoveredNode = nodeToHover;
                _this.emit("enterNode", __assign(__assign({}, baseEvent), { node: nodeToHover }));
                _this.scheduleHighlightedNodesRender();
                return;
            }
            // Checking if the hovered node is still hovered
            if (_this.hoveredNode) {
                var data = _this.nodeDataCache[_this.hoveredNode];
                var pos = _this.framedGraphToViewport(data);
                var size = _this.scaleSize(data.size);
                if (!_this.mouseIsOnNode(e, pos, size)) {
                    var node = _this.hoveredNode;
                    _this.hoveredNode = null;
                    _this.emit("leaveNode", __assign(__assign({}, baseEvent), { node: node }));
                    _this.scheduleHighlightedNodesRender();
                    return;
                }
            }
            if (_this.settings.enableEdgeHoverEvents === true) {
                _this.checkEdgeHoverEvents(baseEvent);
            }
            else if (_this.settings.enableEdgeHoverEvents === "debounce") {
                if (!_this.checkEdgesEventsFrame)
                    _this.checkEdgesEventsFrame = (0, utils_1.requestFrame)(function () {
                        _this.checkEdgeHoverEvents(baseEvent);
                        _this.checkEdgesEventsFrame = null;
                    });
            }
        };
        // Handling click
        var createMouseListener = function (eventType) {
            return function (e) {
                var baseEvent = {
                    event: e,
                    preventSigmaDefault: function () {
                        e.preventSigmaDefault();
                    },
                };
                var isFakeSigmaMouseEvent = e.original.isFakeSigmaMouseEvent;
                var nodeAtPosition = isFakeSigmaMouseEvent ? _this.getNodeAtPosition(e) : _this.hoveredNode;
                if (nodeAtPosition)
                    return _this.emit("".concat(eventType, "Node"), __assign(__assign({}, baseEvent), { node: nodeAtPosition }));
                if (eventType === "wheel" ? _this.settings.enableEdgeWheelEvents : _this.settings.enableEdgeClickEvents) {
                    var edge = _this.getEdgeAtPoint(e.x, e.y);
                    if (edge)
                        return _this.emit("".concat(eventType, "Edge"), __assign(__assign({}, baseEvent), { edge: edge }));
                }
                return _this.emit("".concat(eventType, "Stage"), baseEvent);
            };
        };
        this.activeListeners.handleClick = createMouseListener("click");
        this.activeListeners.handleRightClick = createMouseListener("rightClick");
        this.activeListeners.handleDoubleClick = createMouseListener("doubleClick");
        this.activeListeners.handleWheel = createMouseListener("wheel");
        this.activeListeners.handleDown = createMouseListener("down");
        this.mouseCaptor.on("mousemove", this.activeListeners.handleMove);
        this.mouseCaptor.on("click", this.activeListeners.handleClick);
        this.mouseCaptor.on("rightClick", this.activeListeners.handleRightClick);
        this.mouseCaptor.on("doubleClick", this.activeListeners.handleDoubleClick);
        this.mouseCaptor.on("wheel", this.activeListeners.handleWheel);
        this.mouseCaptor.on("mousedown", this.activeListeners.handleDown);
        // TODO
        // Deal with Touch captor events
        return this;
    };
    /**
     * Method binding graph handlers
     *
     * @return {Sigma}
     */
    Sigma.prototype.bindGraphHandlers = function () {
        var _this = this;
        var graph = this.graph;
        this.activeListeners.graphUpdate = function () {
            _this.needToProcess = true;
            _this._scheduleRefresh();
        };
        this.activeListeners.softGraphUpdate = function () {
            _this.needToSoftProcess = true;
            _this._scheduleRefresh();
        };
        this.activeListeners.dropNodeGraphUpdate = function (e) {
            delete _this.nodeDataCache[e.key];
            if (_this.hoveredNode === e.key)
                _this.hoveredNode = null;
            _this.activeListeners.graphUpdate();
        };
        this.activeListeners.dropEdgeGraphUpdate = function (e) {
            delete _this.edgeDataCache[e.key];
            if (_this.hoveredEdge === e.key)
                _this.hoveredEdge = null;
            _this.activeListeners.graphUpdate();
        };
        this.activeListeners.clearEdgesGraphUpdate = function () {
            _this.edgeDataCache = {};
            _this.hoveredEdge = null;
            _this.activeListeners.graphUpdate();
        };
        this.activeListeners.clearGraphUpdate = function () {
            _this.nodeDataCache = {};
            _this.hoveredNode = null;
            _this.activeListeners.clearEdgesGraphUpdate();
        };
        graph.on("nodeAdded", this.activeListeners.graphUpdate);
        graph.on("nodeDropped", this.activeListeners.dropNodeGraphUpdate);
        graph.on("nodeAttributesUpdated", this.activeListeners.softGraphUpdate);
        graph.on("eachNodeAttributesUpdated", this.activeListeners.graphUpdate);
        graph.on("edgeAdded", this.activeListeners.graphUpdate);
        graph.on("edgeDropped", this.activeListeners.dropEdgeGraphUpdate);
        graph.on("edgeAttributesUpdated", this.activeListeners.softGraphUpdate);
        graph.on("eachEdgeAttributesUpdated", this.activeListeners.graphUpdate);
        graph.on("edgesCleared", this.activeListeners.clearEdgesGraphUpdate);
        graph.on("cleared", this.activeListeners.clearGraphUpdate);
        return this;
    };
    /**
     * Method dealing with "leaveEdge" and "enterEdge" events.
     *
     * @return {Sigma}
     */
    Sigma.prototype.checkEdgeHoverEvents = function (payload) {
        var edgeToHover = this.hoveredNode ? null : this.getEdgeAtPoint(payload.event.x, payload.event.y);
        if (edgeToHover !== this.hoveredEdge) {
            if (this.hoveredEdge)
                this.emit("leaveEdge", __assign(__assign({}, payload), { edge: this.hoveredEdge }));
            if (edgeToHover)
                this.emit("enterEdge", __assign(__assign({}, payload), { edge: edgeToHover }));
            this.hoveredEdge = edgeToHover;
        }
        return this;
    };
    /**
     * Method looking for an edge colliding with a given point at (x, y). Returns
     * the key of the edge if any, or null else.
     */
    Sigma.prototype.getEdgeAtPoint = function (x, y) {
        var e_1, _a;
        var _this = this;
        var _b = this, edgeDataCache = _b.edgeDataCache, nodeDataCache = _b.nodeDataCache;
        // Check first that pixel is colored:
        // Note that mouse positions must be corrected by pixel ratio to correctly
        // index the drawing buffer.
        if (!(0, edge_collisions_1.isPixelColored)(this.webGLContexts.edges, x * this.pixelRatio, y * this.pixelRatio))
            return null;
        // Check for each edge if it collides with the point:
        var _c = this.viewportToGraph({ x: x, y: y }), graphX = _c.x, graphY = _c.y;
        // To translate edge thicknesses to the graph system, we observe by how much
        // the length of a non-null edge is transformed to between the graph system
        // and the viewport system:
        var transformationRatio = 0;
        this.graph.someEdge(function (key, _, sourceId, targetId, _a, _b) {
            var xs = _a.x, ys = _a.y;
            var xt = _b.x, yt = _b.y;
            if (edgeDataCache[key].hidden || nodeDataCache[sourceId].hidden || nodeDataCache[targetId].hidden)
                return false;
            if (xs !== xt || ys !== yt) {
                var graphLength = Math.sqrt(Math.pow(xt - xs, 2) + Math.pow(yt - ys, 2));
                var _c = _this.graphToViewport({ x: xs, y: ys }), vp_xs = _c.x, vp_ys = _c.y;
                var _d = _this.graphToViewport({ x: xt, y: yt }), vp_xt = _d.x, vp_yt = _d.y;
                var viewportLength = Math.sqrt(Math.pow(vp_xt - vp_xs, 2) + Math.pow(vp_yt - vp_ys, 2));
                transformationRatio = graphLength / viewportLength;
                return true;
            }
        });
        // If no non-null edge has been found, return null:
        if (!transformationRatio)
            return null;
        // Now we can look for matching edges:
        var edges = this.graph.filterEdges(function (key, edgeAttributes, sourceId, targetId, sourcePosition, targetPosition) {
            if (edgeDataCache[key].hidden || nodeDataCache[sourceId].hidden || nodeDataCache[targetId].hidden)
                return false;
            if ((0, edge_collisions_1.doEdgeCollideWithPoint)(graphX, graphY, sourcePosition.x, sourcePosition.y, targetPosition.x, targetPosition.y, 
            // Adapt the edge size to the zoom ratio:
            (edgeDataCache[key].size * transformationRatio) / _this.cameraSizeRatio)) {
                return true;
            }
        });
        if (edges.length === 0)
            return null; // no edges found
        // if none of the edges have a zIndex, selected the most recently created one to match the rendering order
        var selectedEdge = edges[edges.length - 1];
        // otherwise select edge with highest zIndex
        var highestZIndex = -Infinity;
        try {
            for (var edges_1 = __values(edges), edges_1_1 = edges_1.next(); !edges_1_1.done; edges_1_1 = edges_1.next()) {
                var edge = edges_1_1.value;
                var zIndex = this.graph.getEdgeAttribute(edge, "zIndex");
                if (zIndex >= highestZIndex) {
                    selectedEdge = edge;
                    highestZIndex = zIndex;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (edges_1_1 && !edges_1_1.done && (_a = edges_1.return)) _a.call(edges_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return selectedEdge;
    };
    /**
     * Method used to process the whole graph's data.
     *
     * @return {Sigma}
     */
    Sigma.prototype.process = function (keepArrays) {
        var _this = this;
        if (keepArrays === void 0) { keepArrays = false; }
        var graph = this.graph;
        var settings = this.settings;
        var dimensions = this.getDimensions();
        var nodeZExtent = [Infinity, -Infinity];
        var edgeZExtent = [Infinity, -Infinity];
        // Clearing the quad
        this.quadtree.clear();
        // Resetting the label grid
        // TODO: it's probably better to do this explicitly or on resizes for layout and anims
        this.labelGrid.resizeAndClear(dimensions, settings.labelGridCellSize);
        // Clear the highlightedNodes
        this.highlightedNodes = new Set();
        // Computing extents
        this.nodeExtent = (0, utils_1.graphExtent)(graph);
        // Resetting `forceLabel` indices
        this.nodesWithForcedLabels = [];
        this.edgesWithForcedLabels = [];
        // NOTE: it is important to compute this matrix after computing the node's extent
        // because #.getGraphDimensions relies on it
        var nullCamera = new camera_1.default();
        var nullCameraMatrix = (0, utils_1.matrixFromCamera)(nullCamera.getState(), this.getDimensions(), this.getGraphDimensions(), this.getSetting("stagePadding") || 0);
        // Rescaling function
        this.normalizationFunction = (0, utils_1.createNormalizationFunction)(this.customBBox || this.nodeExtent);
        var nodesPerPrograms = {};
        var nodes = graph.nodes();
        for (var i = 0, l = nodes.length; i < l; i++) {
            var node = nodes[i];
            // Node display data resolution:
            //   1. First we get the node's attributes
            //   2. We optionally reduce them using the function provided by the user
            //      Note that this function must return a total object and won't be merged
            //   3. We apply our defaults, while running some vital checks
            //   4. We apply the normalization function
            // We shallow copy node data to avoid dangerous behaviors from reducers
            var attr = Object.assign({}, graph.getNodeAttributes(node));
            if (settings.nodeReducer)
                attr = settings.nodeReducer(node, attr);
            var data = applyNodeDefaults(this.settings, node, attr);
            nodesPerPrograms[data.type] = (nodesPerPrograms[data.type] || 0) + 1;
            this.nodeDataCache[node] = data;
            this.normalizationFunction.applyTo(data);
            if (data.forceLabel)
                this.nodesWithForcedLabels.push(node);
            if (this.settings.zIndex) {
                if (data.zIndex < nodeZExtent[0])
                    nodeZExtent[0] = data.zIndex;
                if (data.zIndex > nodeZExtent[1])
                    nodeZExtent[1] = data.zIndex;
            }
        }
        for (var type in this.nodePrograms) {
            if (!this.nodePrograms.hasOwnProperty(type)) {
                throw new Error("Sigma: could not find a suitable program for node type \"".concat(type, "\"!"));
            }
            if (!keepArrays)
                this.nodePrograms[type].allocate(nodesPerPrograms[type] || 0);
            // We reset that count here, so that we can reuse it while calling the Program#process methods:
            nodesPerPrograms[type] = 0;
        }
        // Handling node z-index
        // TODO: z-index needs us to compute display data before hand
        if (this.settings.zIndex && nodeZExtent[0] !== nodeZExtent[1])
            nodes = (0, utils_1.zIndexOrdering)(nodeZExtent, function (node) { return _this.nodeDataCache[node].zIndex; }, nodes);
        for (var i = 0, l = nodes.length; i < l; i++) {
            var node = nodes[i];
            var data = this.nodeDataCache[node];
            this.quadtree.add(node, data.x, 1 - data.y, data.size / this.width);
            if (typeof data.label === "string" && !data.hidden)
                this.labelGrid.add(node, data.size, this.framedGraphToViewport(data, { matrix: nullCameraMatrix }));
            this.nodePrograms[data.type].process(data, data.hidden, nodesPerPrograms[data.type]++);
            // Save the node in the highlighted set if needed
            if (data.highlighted && !data.hidden)
                this.highlightedNodes.add(node);
        }
        this.labelGrid.organize();
        var edgesPerPrograms = {};
        var edges = graph.edges();
        for (var i = 0, l = edges.length; i < l; i++) {
            var edge = edges[i];
            // Edge display data resolution:
            //   1. First we get the edge's attributes
            //   2. We optionally reduce them using the function provided by the user
            //      Note that this function must return a total object and won't be merged
            //   3. We apply our defaults, while running some vital checks
            // We shallow copy edge data to avoid dangerous behaviors from reducers
            var attr = Object.assign({}, graph.getEdgeAttributes(edge));
            if (settings.edgeReducer)
                attr = settings.edgeReducer(edge, attr);
            var data = applyEdgeDefaults(this.settings, edge, attr);
            edgesPerPrograms[data.type] = (edgesPerPrograms[data.type] || 0) + 1;
            this.edgeDataCache[edge] = data;
            if (data.forceLabel && !data.hidden)
                this.edgesWithForcedLabels.push(edge);
            if (this.settings.zIndex) {
                if (data.zIndex < edgeZExtent[0])
                    edgeZExtent[0] = data.zIndex;
                if (data.zIndex > edgeZExtent[1])
                    edgeZExtent[1] = data.zIndex;
            }
        }
        for (var type in this.edgePrograms) {
            if (!this.edgePrograms.hasOwnProperty(type)) {
                throw new Error("Sigma: could not find a suitable program for edge type \"".concat(type, "\"!"));
            }
            if (!keepArrays)
                this.edgePrograms[type].allocate(edgesPerPrograms[type] || 0);
            // We reset that count here, so that we can reuse it while calling the Program#process methods:
            edgesPerPrograms[type] = 0;
        }
        // Handling edge z-index
        if (this.settings.zIndex && edgeZExtent[0] !== edgeZExtent[1])
            edges = (0, utils_1.zIndexOrdering)(edgeZExtent, function (edge) { return _this.edgeDataCache[edge].zIndex; }, edges);
        for (var i = 0, l = edges.length; i < l; i++) {
            var edge = edges[i];
            var data = this.edgeDataCache[edge];
            var extremities = graph.extremities(edge), sourceData = this.nodeDataCache[extremities[0]], targetData = this.nodeDataCache[extremities[1]];
            var hidden = data.hidden || sourceData.hidden || targetData.hidden;
            this.edgePrograms[data.type].process(sourceData, targetData, data, hidden, edgesPerPrograms[data.type]++);
        }
        for (var type in this.edgePrograms) {
            var program = this.edgePrograms[type];
            if (!keepArrays && typeof program.computeIndices === "function")
                program.computeIndices();
        }
        return this;
    };
    /**
     * Method that backports potential settings updates where it's needed.
     * @private
     */
    Sigma.prototype.handleSettingsUpdate = function () {
        this.camera.minRatio = this.settings.minCameraRatio;
        this.camera.maxRatio = this.settings.maxCameraRatio;
        this.camera.setState(this.camera.validateState(this.camera.getState()));
        return this;
    };
    /**
     * Method that decides whether to reprocess graph or not, and then render the
     * graph.
     *
     * @return {Sigma}
     */
    Sigma.prototype._refresh = function () {
        // Do we need to process data?
        if (this.needToProcess) {
            this.process();
        }
        else if (this.needToSoftProcess) {
            this.process(true);
        }
        // Resetting state
        this.needToProcess = false;
        this.needToSoftProcess = false;
        // Rendering
        this.render();
        return this;
    };
    /**
     * Method that schedules a `_refresh` call if none has been scheduled yet. It
     * will then be processed next available frame.
     *
     * @return {Sigma}
     */
    Sigma.prototype._scheduleRefresh = function () {
        var _this = this;
        if (!this.renderFrame) {
            this.renderFrame = (0, utils_1.requestFrame)(function () {
                _this._refresh();
                _this.renderFrame = null;
            });
        }
        return this;
    };
    /**
     * Method used to render labels.
     *
     * @return {Sigma}
     */
    Sigma.prototype.renderLabels = function () {
        if (!this.settings.renderLabels)
            return this;
        var cameraState = this.camera.getState();
        // Finding visible nodes to display their labels
        var visibleNodes;
        if (cameraState.ratio >= 1) {
            // Camera is unzoomed so no need to ask the quadtree for visible nodes
            visibleNodes = new Set(this.graph.nodes());
        }
        else {
            // Let's ask the quadtree
            var viewRectangle = this.viewRectangle();
            visibleNodes = new Set(this.quadtree.rectangle(viewRectangle.x1, 1 - viewRectangle.y1, viewRectangle.x2, 1 - viewRectangle.y2, viewRectangle.height));
        }
        // Selecting labels to draw
        // TODO: drop gridsettings likewise
        // TODO: optimize through visible nodes
        var labelsToDisplay = this.labelGrid
            .getLabelsToDisplay(cameraState.ratio, this.settings.labelDensity)
            .concat(this.nodesWithForcedLabels);
        this.displayedLabels = new Set();
        // Drawing labels
        var context = this.canvasContexts.labels;
        for (var i = 0, l = labelsToDisplay.length; i < l; i++) {
            var node = labelsToDisplay[i];
            var data = this.nodeDataCache[node];
            // If the node was already drawn (like if it is eligible AND has
            // `forceLabel`), we don't want to draw it again
            if (this.displayedLabels.has(node))
                continue;
            // If the node is hidden, we don't need to display its label obviously
            if (data.hidden)
                continue;
            var _a = this.framedGraphToViewport(data), x = _a.x, y = _a.y;
            // TODO: we can cache the labels we need to render until the camera's ratio changes
            // TODO: this should be computed in the canvas components?
            var size = this.scaleSize(data.size);
            if (!data.forceLabel && size < this.settings.labelRenderedSizeThreshold)
                continue;
            if (!visibleNodes.has(node))
                continue;
            // TODO:
            // Because displayed edge labels depend directly on actually rendered node
            // labels, we need to only add to this.displayedLabels nodes whose label
            // is rendered.
            // This makes this.displayedLabels depend on viewport, which might become
            // an issue once we start memoizing getLabelsToDisplay.
            this.displayedLabels.add(node);
            this.settings.labelRenderer(context, __assign(__assign({ key: node }, data), { size: size, x: x, y: y }), this.settings);
        }
        return this;
    };
    /**
     * Method used to render edge labels, based on which node labels were
     * rendered.
     *
     * @return {Sigma}
     */
    Sigma.prototype.renderEdgeLabels = function () {
        if (!this.settings.renderEdgeLabels)
            return this;
        var context = this.canvasContexts.edgeLabels;
        // Clearing
        context.clearRect(0, 0, this.width, this.height);
        var edgeLabelsToDisplay = (0, labels_1.edgeLabelsToDisplayFromNodes)({
            graph: this.graph,
            hoveredNode: this.hoveredNode,
            displayedNodeLabels: this.displayedLabels,
            highlightedNodes: this.highlightedNodes,
        }).concat(this.edgesWithForcedLabels);
        var displayedLabels = new Set();
        for (var i = 0, l = edgeLabelsToDisplay.length; i < l; i++) {
            var edge = edgeLabelsToDisplay[i], extremities = this.graph.extremities(edge), sourceData = this.nodeDataCache[extremities[0]], targetData = this.nodeDataCache[extremities[1]], edgeData = this.edgeDataCache[edge];
            // If the edge was already drawn (like if it is eligible AND has
            // `forceLabel`), we don't want to draw it again
            if (displayedLabels.has(edge))
                continue;
            // If the edge is hidden we don't need to display its label
            // NOTE: the test on sourceData & targetData is probably paranoid at this point?
            if (edgeData.hidden || sourceData.hidden || targetData.hidden) {
                continue;
            }
            this.settings.edgeLabelRenderer(context, __assign(__assign({ key: edge }, edgeData), { size: this.scaleSize(edgeData.size) }), __assign(__assign(__assign({ key: extremities[0] }, sourceData), this.framedGraphToViewport(sourceData)), { size: this.scaleSize(sourceData.size) }), __assign(__assign(__assign({ key: extremities[1] }, targetData), this.framedGraphToViewport(targetData)), { size: this.scaleSize(targetData.size) }), this.settings);
            displayedLabels.add(edge);
        }
        return this;
    };
    /**
     * Method used to render the highlighted nodes.
     *
     * @return {Sigma}
     */
    Sigma.prototype.renderHighlightedNodes = function () {
        var _this = this;
        var context = this.canvasContexts.hovers;
        // Clearing
        context.clearRect(0, 0, this.width, this.height);
        // Rendering
        var render = function (node) {
            var data = _this.nodeDataCache[node];
            var _a = _this.framedGraphToViewport(data), x = _a.x, y = _a.y;
            var size = _this.scaleSize(data.size);
            _this.settings.hoverRenderer(context, __assign(__assign({ key: node }, data), { size: size, x: x, y: y }), _this.settings);
        };
        var nodesToRender = [];
        if (this.hoveredNode && !this.nodeDataCache[this.hoveredNode].hidden) {
            nodesToRender.push(this.hoveredNode);
        }
        this.highlightedNodes.forEach(function (node) {
            // The hovered node has already been highlighted
            if (node !== _this.hoveredNode)
                nodesToRender.push(node);
        });
        // Draw labels:
        nodesToRender.forEach(function (node) { return render(node); });
        // Draw WebGL nodes on top of the labels:
        var nodesPerPrograms = {};
        // 1. Count nodes per type:
        nodesToRender.forEach(function (node) {
            var type = _this.nodeDataCache[node].type;
            nodesPerPrograms[type] = (nodesPerPrograms[type] || 0) + 1;
        });
        // 2. Allocate for each type for the proper number of nodes
        for (var type in this.hoverNodePrograms) {
            this.hoverNodePrograms[type].allocate(nodesPerPrograms[type] || 0);
            // Also reset count, to use when rendering:
            nodesPerPrograms[type] = 0;
        }
        // 3. Process all nodes to render:
        nodesToRender.forEach(function (node) {
            var data = _this.nodeDataCache[node];
            _this.hoverNodePrograms[data.type].process(data, data.hidden, nodesPerPrograms[data.type]++);
        });
        // 4. Clear hovered nodes layer:
        this.webGLContexts.hoverNodes.clear(this.webGLContexts.hoverNodes.COLOR_BUFFER_BIT);
        // 5. Render:
        for (var type in this.hoverNodePrograms) {
            var program = this.hoverNodePrograms[type];
            program.bind();
            program.bufferData();
            program.render({
                matrix: this.matrix,
                width: this.width,
                height: this.height,
                ratio: this.camera.ratio,
                correctionRatio: this.correctionRatio / this.camera.ratio,
                scalingRatio: this.pixelRatio,
            });
        }
    };
    /**
     * Method used to schedule a hover render.
     *
     */
    Sigma.prototype.scheduleHighlightedNodesRender = function () {
        var _this = this;
        if (this.renderHighlightedNodesFrame || this.renderFrame)
            return;
        this.renderHighlightedNodesFrame = (0, utils_1.requestFrame)(function () {
            // Resetting state
            _this.renderHighlightedNodesFrame = null;
            // Rendering
            _this.renderHighlightedNodes();
            _this.renderEdgeLabels();
        });
    };
    /**
     * Method used to render.
     *
     * @return {Sigma}
     */
    Sigma.prototype.render = function () {
        var _this = this;
        this.emit("beforeRender");
        var handleEscape = function () {
            _this.emit("afterRender");
            return _this;
        };
        // If a render was scheduled, we cancel it
        if (this.renderFrame) {
            (0, utils_1.cancelFrame)(this.renderFrame);
            this.renderFrame = null;
            this.needToProcess = false;
            this.needToSoftProcess = false;
        }
        // First we need to resize
        this.resize();
        // Clearing the canvases
        this.clear();
        // Recomputing useful camera-related values:
        this.updateCachedValues();
        // If we have no nodes we can stop right there
        if (!this.graph.order)
            return handleEscape();
        // TODO: improve this heuristic or move to the captor itself?
        // TODO: deal with the touch captor here as well
        var mouseCaptor = this.mouseCaptor;
        var moving = this.camera.isAnimated() ||
            mouseCaptor.isMoving ||
            mouseCaptor.draggedEvents ||
            mouseCaptor.currentWheelDirection;
        // Then we need to extract a matrix from the camera
        var cameraState = this.camera.getState();
        var viewportDimensions = this.getDimensions();
        var graphDimensions = this.getGraphDimensions();
        var padding = this.getSetting("stagePadding") || 0;
        this.matrix = (0, utils_1.matrixFromCamera)(cameraState, viewportDimensions, graphDimensions, padding);
        this.invMatrix = (0, utils_1.matrixFromCamera)(cameraState, viewportDimensions, graphDimensions, padding, true);
        this.correctionRatio = (0, utils_1.getMatrixImpact)(this.matrix, cameraState, viewportDimensions);
        // Drawing nodes
        for (var type in this.nodePrograms) {
            var program = this.nodePrograms[type];
            program.bind();
            program.bufferData();
            program.render({
                matrix: this.matrix,
                width: this.width,
                height: this.height,
                ratio: cameraState.ratio,
                correctionRatio: this.correctionRatio / cameraState.ratio,
                scalingRatio: this.pixelRatio,
            });
        }
        // Drawing edges
        if (!this.settings.hideEdgesOnMove || !moving) {
            for (var type in this.edgePrograms) {
                var program = this.edgePrograms[type];
                program.bind();
                program.bufferData();
                program.render({
                    matrix: this.matrix,
                    width: this.width,
                    height: this.height,
                    ratio: cameraState.ratio,
                    correctionRatio: this.correctionRatio / cameraState.ratio,
                    scalingRatio: this.pixelRatio,
                });
            }
        }
        // Do not display labels on move per setting
        if (this.settings.hideLabelsOnMove && moving)
            return handleEscape();
        this.renderLabels();
        this.renderEdgeLabels();
        this.renderHighlightedNodes();
        return handleEscape();
    };
    /**
     * Internal method used to update expensive and therefore cached values
     * each time the camera state is updated.
     */
    Sigma.prototype.updateCachedValues = function () {
        var ratio = this.camera.getState().ratio;
        this.cameraSizeRatio = Math.sqrt(ratio);
    };
    /**---------------------------------------------------------------------------
     * Public API.
     **---------------------------------------------------------------------------
     */
    /**
     * Method returning the renderer's camera.
     *
     * @return {Camera}
     */
    Sigma.prototype.getCamera = function () {
        return this.camera;
    };
    /**
     * Method returning the container DOM element.
     *
     * @return {HTMLElement}
     */
    Sigma.prototype.getContainer = function () {
        return this.container;
    };
    /**
     * Method returning the renderer's graph.
     *
     * @return {Graph}
     */
    Sigma.prototype.getGraph = function () {
        return this.graph;
    };
    /**
     * Method returning the mouse captor.
     *
     * @return {MouseCaptor}
     */
    Sigma.prototype.getMouseCaptor = function () {
        return this.mouseCaptor;
    };
    /**
     * Method returning the touch captor.
     *
     * @return {TouchCaptor}
     */
    Sigma.prototype.getTouchCaptor = function () {
        return this.touchCaptor;
    };
    /**
     * Method returning the current renderer's dimensions.
     *
     * @return {Dimensions}
     */
    Sigma.prototype.getDimensions = function () {
        return { width: this.width, height: this.height };
    };
    /**
     * Method returning the current graph's dimensions.
     *
     * @return {Dimensions}
     */
    Sigma.prototype.getGraphDimensions = function () {
        var extent = this.customBBox || this.nodeExtent;
        return {
            width: extent.x[1] - extent.x[0] || 1,
            height: extent.y[1] - extent.y[0] || 1,
        };
    };
    /**
     * Method used to get all the sigma node attributes.
     * It's usefull for example to get the position of a node
     * and to get values that are set by the nodeReducer
     *
     * @param  {string} key - The node's key.
     * @return {NodeDisplayData | undefined} A copy of the desired node's attribute or undefined if not found
     */
    Sigma.prototype.getNodeDisplayData = function (key) {
        var node = this.nodeDataCache[key];
        return node ? Object.assign({}, node) : undefined;
    };
    /**
     * Method used to get all the sigma edge attributes.
     * It's usefull for example to get values that are set by the edgeReducer.
     *
     * @param  {string} key - The edge's key.
     * @return {EdgeDisplayData | undefined} A copy of the desired edge's attribute or undefined if not found
     */
    Sigma.prototype.getEdgeDisplayData = function (key) {
        var edge = this.edgeDataCache[key];
        return edge ? Object.assign({}, edge) : undefined;
    };
    /**
     * Method returning a copy of the settings collection.
     *
     * @return {Settings} A copy of the settings collection.
     */
    Sigma.prototype.getSettings = function () {
        return __assign({}, this.settings);
    };
    /**
     * Method returning the current value for a given setting key.
     *
     * @param  {string} key - The setting key to get.
     * @return {any} The value attached to this setting key or undefined if not found
     */
    Sigma.prototype.getSetting = function (key) {
        return this.settings[key];
    };
    /**
     * Method setting the value of a given setting key. Note that this will schedule
     * a new render next frame.
     *
     * @param  {string} key - The setting key to set.
     * @param  {any}    value - The value to set.
     * @return {Sigma}
     */
    Sigma.prototype.setSetting = function (key, value) {
        this.settings[key] = value;
        (0, settings_1.validateSettings)(this.settings);
        this.handleSettingsUpdate();
        this.needToProcess = true; // TODO: some keys may work with only needToSoftProcess or even nothing
        this._scheduleRefresh();
        return this;
    };
    /**
     * Method updating the value of a given setting key using the provided function.
     * Note that this will schedule a new render next frame.
     *
     * @param  {string}   key     - The setting key to set.
     * @param  {function} updater - The update function.
     * @return {Sigma}
     */
    Sigma.prototype.updateSetting = function (key, updater) {
        this.settings[key] = updater(this.settings[key]);
        (0, settings_1.validateSettings)(this.settings);
        this.handleSettingsUpdate();
        this.needToProcess = true; // TODO: some keys may work with only needToSoftProcess or even nothing
        this._scheduleRefresh();
        return this;
    };
    /**
     * Method used to resize the renderer.
     *
     * @return {Sigma}
     */
    Sigma.prototype.resize = function () {
        var previousWidth = this.width, previousHeight = this.height;
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.pixelRatio = (0, utils_1.getPixelRatio)();
        if (this.width === 0) {
            if (this.settings.allowInvalidContainer)
                this.width = 1;
            else
                throw new Error("Sigma: Container has no width. You can set the allowInvalidContainer setting to true to stop seing this error.");
        }
        if (this.height === 0) {
            if (this.settings.allowInvalidContainer)
                this.height = 1;
            else
                throw new Error("Sigma: Container has no height. You can set the allowInvalidContainer setting to true to stop seing this error.");
        }
        // If nothing has changed, we can stop right here
        if (previousWidth === this.width && previousHeight === this.height)
            return this;
        this.emit("resize");
        // Sizing dom elements
        for (var id in this.elements) {
            var element = this.elements[id];
            element.style.width = this.width + "px";
            element.style.height = this.height + "px";
        }
        // Sizing canvas contexts
        for (var id in this.canvasContexts) {
            this.elements[id].setAttribute("width", this.width * this.pixelRatio + "px");
            this.elements[id].setAttribute("height", this.height * this.pixelRatio + "px");
            if (this.pixelRatio !== 1)
                this.canvasContexts[id].scale(this.pixelRatio, this.pixelRatio);
        }
        // Sizing WebGL contexts
        for (var id in this.webGLContexts) {
            this.elements[id].setAttribute("width", this.width * this.pixelRatio + "px");
            this.elements[id].setAttribute("height", this.height * this.pixelRatio + "px");
            this.webGLContexts[id].viewport(0, 0, this.width * this.pixelRatio, this.height * this.pixelRatio);
        }
        return this;
    };
    /**
     * Method used to clear all the canvases.
     *
     * @return {Sigma}
     */
    Sigma.prototype.clear = function () {
        this.webGLContexts.nodes.clear(this.webGLContexts.nodes.COLOR_BUFFER_BIT);
        this.webGLContexts.edges.clear(this.webGLContexts.edges.COLOR_BUFFER_BIT);
        this.webGLContexts.hoverNodes.clear(this.webGLContexts.hoverNodes.COLOR_BUFFER_BIT);
        this.canvasContexts.labels.clearRect(0, 0, this.width, this.height);
        this.canvasContexts.hovers.clearRect(0, 0, this.width, this.height);
        this.canvasContexts.edgeLabels.clearRect(0, 0, this.width, this.height);
        return this;
    };
    /**
     * Method used to refresh all computed data.
     *
     * @return {Sigma}
     */
    Sigma.prototype.refresh = function () {
        this.needToProcess = true;
        this._refresh();
        return this;
    };
    /**
     * Method used to refresh all computed data, at the next available frame.
     * If this method has already been called this frame, then it will only render once at the next available frame.
     *
     * @return {Sigma}
     */
    Sigma.prototype.scheduleRefresh = function () {
        this.needToProcess = true;
        this._scheduleRefresh();
        return this;
    };
    /**
     * Method used to (un)zoom, while preserving the position of a viewport point.
     * Used for instance to zoom "on the mouse cursor".
     *
     * @param viewportTarget
     * @param newRatio
     * @return {CameraState}
     */
    Sigma.prototype.getViewportZoomedState = function (viewportTarget, newRatio) {
        var _a = this.camera.getState(), ratio = _a.ratio, angle = _a.angle, x = _a.x, y = _a.y;
        // TODO: handle max zoom
        var ratioDiff = newRatio / ratio;
        var center = {
            x: this.width / 2,
            y: this.height / 2,
        };
        var graphMousePosition = this.viewportToFramedGraph(viewportTarget);
        var graphCenterPosition = this.viewportToFramedGraph(center);
        return {
            angle: angle,
            x: (graphMousePosition.x - graphCenterPosition.x) * (1 - ratioDiff) + x,
            y: (graphMousePosition.y - graphCenterPosition.y) * (1 - ratioDiff) + y,
            ratio: newRatio,
        };
    };
    /**
     * Method returning the abstract rectangle containing the graph according
     * to the camera's state.
     *
     * @return {object} - The view's rectangle.
     */
    Sigma.prototype.viewRectangle = function () {
        // TODO: reduce relative margin?
        var marginX = (0 * this.width) / 8, marginY = (0 * this.height) / 8;
        var p1 = this.viewportToFramedGraph({ x: 0 - marginX, y: 0 - marginY }), p2 = this.viewportToFramedGraph({ x: this.width + marginX, y: 0 - marginY }), h = this.viewportToFramedGraph({ x: 0, y: this.height + marginY });
        return {
            x1: p1.x,
            y1: p1.y,
            x2: p2.x,
            y2: p2.y,
            height: p2.y - h.y,
        };
    };
    /**
     * Method returning the coordinates of a point from the framed graph system to the viewport system. It allows
     * overriding anything that is used to get the translation matrix, or even the matrix itself.
     *
     * Be careful if overriding dimensions, padding or cameraState, as the computation of the matrix is not the lightest
     * of computations.
     */
    Sigma.prototype.framedGraphToViewport = function (coordinates, override) {
        if (override === void 0) { override = {}; }
        var recomputeMatrix = !!override.cameraState || !!override.viewportDimensions || !!override.graphDimensions;
        var matrix = override.matrix
            ? override.matrix
            : recomputeMatrix
                ? (0, utils_1.matrixFromCamera)(override.cameraState || this.camera.getState(), override.viewportDimensions || this.getDimensions(), override.graphDimensions || this.getGraphDimensions(), override.padding || this.getSetting("stagePadding") || 0)
                : this.matrix;
        var viewportPos = (0, matrices_1.multiplyVec2)(matrix, coordinates);
        return {
            x: ((1 + viewportPos.x) * this.width) / 2,
            y: ((1 - viewportPos.y) * this.height) / 2,
        };
    };
    /**
     * Method returning the coordinates of a point from the viewport system to the framed graph system. It allows
     * overriding anything that is used to get the translation matrix, or even the matrix itself.
     *
     * Be careful if overriding dimensions, padding or cameraState, as the computation of the matrix is not the lightest
     * of computations.
     */
    Sigma.prototype.viewportToFramedGraph = function (coordinates, override) {
        if (override === void 0) { override = {}; }
        var recomputeMatrix = !!override.cameraState || !!override.viewportDimensions || !override.graphDimensions;
        var invMatrix = override.matrix
            ? override.matrix
            : recomputeMatrix
                ? (0, utils_1.matrixFromCamera)(override.cameraState || this.camera.getState(), override.viewportDimensions || this.getDimensions(), override.graphDimensions || this.getGraphDimensions(), override.padding || this.getSetting("stagePadding") || 0, true)
                : this.invMatrix;
        var res = (0, matrices_1.multiplyVec2)(invMatrix, {
            x: (coordinates.x / this.width) * 2 - 1,
            y: 1 - (coordinates.y / this.height) * 2,
        });
        if (isNaN(res.x))
            res.x = 0;
        if (isNaN(res.y))
            res.y = 0;
        return res;
    };
    /**
     * Method used to translate a point's coordinates from the viewport system (pixel distance from the top-left of the
     * stage) to the graph system (the reference system of data as they are in the given graph instance).
     *
     * This method accepts an optional camera which can be useful if you need to translate coordinates
     * based on a different view than the one being currently being displayed on screen.
     *
     * @param {Coordinates}                  viewportPoint
     * @param {CoordinateConversionOverride} override
     */
    Sigma.prototype.viewportToGraph = function (viewportPoint, override) {
        if (override === void 0) { override = {}; }
        return this.normalizationFunction.inverse(this.viewportToFramedGraph(viewportPoint, override));
    };
    /**
     * Method used to translate a point's coordinates from the graph system (the reference system of data as they are in
     * the given graph instance) to the viewport system (pixel distance from the top-left of the stage).
     *
     * This method accepts an optional camera which can be useful if you need to translate coordinates
     * based on a different view than the one being currently being displayed on screen.
     *
     * @param {Coordinates}                  graphPoint
     * @param {CoordinateConversionOverride} override
     */
    Sigma.prototype.graphToViewport = function (graphPoint, override) {
        if (override === void 0) { override = {}; }
        return this.framedGraphToViewport(this.normalizationFunction(graphPoint), override);
    };
    /**
     * Method returning the graph's bounding box.
     *
     * @return {{ x: Extent, y: Extent }}
     */
    Sigma.prototype.getBBox = function () {
        return (0, utils_1.graphExtent)(this.graph);
    };
    /**
     * Method returning the graph's custom bounding box, if any.
     *
     * @return {{ x: Extent, y: Extent } | null}
     */
    Sigma.prototype.getCustomBBox = function () {
        return this.customBBox;
    };
    /**
     * Method used to override the graph's bounding box with a custom one. Give `null` as the argument to stop overriding.
     *
     * @return {Sigma}
     */
    Sigma.prototype.setCustomBBox = function (customBBox) {
        this.customBBox = customBBox;
        this._scheduleRefresh();
        return this;
    };
    /**
     * Method used to shut the container & release event listeners.
     *
     * @return {undefined}
     */
    Sigma.prototype.kill = function () {
        var graph = this.graph;
        // Emitting "kill" events so that plugins and such can cleanup
        this.emit("kill");
        // Releasing events
        this.removeAllListeners();
        // Releasing camera handlers
        this.camera.removeListener("updated", this.activeListeners.camera);
        // Releasing DOM events & captors
        window.removeEventListener("resize", this.activeListeners.handleResize);
        this.mouseCaptor.kill();
        this.touchCaptor.kill();
        // Releasing graph handlers
        graph.removeListener("nodeAdded", this.activeListeners.dropNodeGraphUpdate);
        graph.removeListener("nodeDropped", this.activeListeners.graphUpdate);
        graph.removeListener("nodeAttributesUpdated", this.activeListeners.softGraphUpdate);
        graph.removeListener("eachNodeAttributesUpdated", this.activeListeners.graphUpdate);
        graph.removeListener("edgeAdded", this.activeListeners.graphUpdate);
        graph.removeListener("edgeDropped", this.activeListeners.dropEdgeGraphUpdate);
        graph.removeListener("edgeAttributesUpdated", this.activeListeners.softGraphUpdate);
        graph.removeListener("eachEdgeAttributesUpdated", this.activeListeners.graphUpdate);
        graph.removeListener("edgesCleared", this.activeListeners.clearEdgesGraphUpdate);
        graph.removeListener("cleared", this.activeListeners.clearGraphUpdate);
        // Releasing cache & state
        this.quadtree = new quadtree_1.default();
        this.nodeDataCache = {};
        this.edgeDataCache = {};
        this.nodesWithForcedLabels = [];
        this.edgesWithForcedLabels = [];
        this.highlightedNodes.clear();
        // Clearing frames
        if (this.renderFrame) {
            (0, utils_1.cancelFrame)(this.renderFrame);
            this.renderFrame = null;
        }
        if (this.renderHighlightedNodesFrame) {
            (0, utils_1.cancelFrame)(this.renderHighlightedNodesFrame);
            this.renderHighlightedNodesFrame = null;
        }
        // Destroying canvases
        var container = this.container;
        while (container.firstChild)
            container.removeChild(container.firstChild);
    };
    /**
     * Method used to scale the given size according to the camera's ratio, i.e.
     * zooming state.
     *
     * @param  {number} size - The size to scale (node size, edge thickness etc.).
     * @return {number}      - The scaled size.
     */
    Sigma.prototype.scaleSize = function (size) {
        return size / this.cameraSizeRatio;
    };
    /**
     * Method that returns the collection of all used canvases.
     * At the moment, the instantiated canvases are the following, and in the
     * following order in the DOM:
     * - `edges`
     * - `nodes`
     * - `edgeLabels`
     * - `labels`
     * - `hovers`
     * - `hoverNodes`
     * - `mouse`
     *
     * @return {PlainObject<HTMLCanvasElement>} - The collection of canvases.
     */
    Sigma.prototype.getCanvases = function () {
        return __assign({}, this.elements);
    };
    return Sigma;
}(types_1.TypedEventEmitter));
exports.default = Sigma;

},{"./core/camera":40,"./core/captors/mouse":42,"./core/captors/touch":43,"./core/labels":44,"./core/quadtree":45,"./settings":66,"./types":68,"./utils":73,"./utils/edge-collisions":72,"./utils/matrices":74}],68:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypedEventEmitter = void 0;
/**
 * Sigma.js Types
 * ===============
 *
 * Various type declarations used throughout the library.
 * @module
 */
var events_1 = require("events");
var TypedEventEmitter = /** @class */ (function (_super) {
    __extends(TypedEventEmitter, _super);
    function TypedEventEmitter() {
        var _this = _super.call(this) || this;
        _this.rawEmitter = _this;
        return _this;
    }
    return TypedEventEmitter;
}(events_1.EventEmitter));
exports.TypedEventEmitter = TypedEventEmitter;

},{"events":90}],69:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.animateNodes = exports.ANIMATE_DEFAULTS = void 0;
var index_1 = require("./index");
var easings_1 = __importDefault(require("./easings"));
exports.ANIMATE_DEFAULTS = {
    easing: "quadraticInOut",
    duration: 150,
};
/**
 * Function used to animate the nodes.
 */
function animateNodes(graph, targets, opts, callback) {
    var options = Object.assign({}, exports.ANIMATE_DEFAULTS, opts);
    var easing = typeof options.easing === "function" ? options.easing : easings_1.default[options.easing];
    var start = Date.now();
    var startPositions = {};
    for (var node in targets) {
        var attrs = targets[node];
        startPositions[node] = {};
        for (var k in attrs)
            startPositions[node][k] = graph.getNodeAttribute(node, k);
    }
    var frame = null;
    var step = function () {
        frame = null;
        var p = (Date.now() - start) / options.duration;
        if (p >= 1) {
            // Animation is done
            for (var node in targets) {
                var attrs = targets[node];
                // We use given values to avoid precision issues and for convenience
                for (var k in attrs)
                    graph.setNodeAttribute(node, k, attrs[k]);
            }
            if (typeof callback === "function")
                callback();
            return;
        }
        p = easing(p);
        for (var node in targets) {
            var attrs = targets[node];
            var s = startPositions[node];
            for (var k in attrs)
                graph.setNodeAttribute(node, k, attrs[k] * p + s[k] * (1 - p));
        }
        frame = (0, index_1.requestFrame)(step);
    };
    step();
    return function () {
        if (frame)
            (0, index_1.cancelFrame)(frame);
    };
}
exports.animateNodes = animateNodes;

},{"./easings":71,"./index":73}],70:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTML_COLORS = void 0;
exports.HTML_COLORS = {
    black: "#000000",
    silver: "#C0C0C0",
    gray: "#808080",
    grey: "#808080",
    white: "#FFFFFF",
    maroon: "#800000",
    red: "#FF0000",
    purple: "#800080",
    fuchsia: "#FF00FF",
    green: "#008000",
    lime: "#00FF00",
    olive: "#808000",
    yellow: "#FFFF00",
    navy: "#000080",
    blue: "#0000FF",
    teal: "#008080",
    aqua: "#00FFFF",
    darkblue: "#00008B",
    mediumblue: "#0000CD",
    darkgreen: "#006400",
    darkcyan: "#008B8B",
    deepskyblue: "#00BFFF",
    darkturquoise: "#00CED1",
    mediumspringgreen: "#00FA9A",
    springgreen: "#00FF7F",
    cyan: "#00FFFF",
    midnightblue: "#191970",
    dodgerblue: "#1E90FF",
    lightseagreen: "#20B2AA",
    forestgreen: "#228B22",
    seagreen: "#2E8B57",
    darkslategray: "#2F4F4F",
    darkslategrey: "#2F4F4F",
    limegreen: "#32CD32",
    mediumseagreen: "#3CB371",
    turquoise: "#40E0D0",
    royalblue: "#4169E1",
    steelblue: "#4682B4",
    darkslateblue: "#483D8B",
    mediumturquoise: "#48D1CC",
    indigo: "#4B0082",
    darkolivegreen: "#556B2F",
    cadetblue: "#5F9EA0",
    cornflowerblue: "#6495ED",
    rebeccapurple: "#663399",
    mediumaquamarine: "#66CDAA",
    dimgray: "#696969",
    dimgrey: "#696969",
    slateblue: "#6A5ACD",
    olivedrab: "#6B8E23",
    slategray: "#708090",
    slategrey: "#708090",
    lightslategray: "#778899",
    lightslategrey: "#778899",
    mediumslateblue: "#7B68EE",
    lawngreen: "#7CFC00",
    chartreuse: "#7FFF00",
    aquamarine: "#7FFFD4",
    skyblue: "#87CEEB",
    lightskyblue: "#87CEFA",
    blueviolet: "#8A2BE2",
    darkred: "#8B0000",
    darkmagenta: "#8B008B",
    saddlebrown: "#8B4513",
    darkseagreen: "#8FBC8F",
    lightgreen: "#90EE90",
    mediumpurple: "#9370DB",
    darkviolet: "#9400D3",
    palegreen: "#98FB98",
    darkorchid: "#9932CC",
    yellowgreen: "#9ACD32",
    sienna: "#A0522D",
    brown: "#A52A2A",
    darkgray: "#A9A9A9",
    darkgrey: "#A9A9A9",
    lightblue: "#ADD8E6",
    greenyellow: "#ADFF2F",
    paleturquoise: "#AFEEEE",
    lightsteelblue: "#B0C4DE",
    powderblue: "#B0E0E6",
    firebrick: "#B22222",
    darkgoldenrod: "#B8860B",
    mediumorchid: "#BA55D3",
    rosybrown: "#BC8F8F",
    darkkhaki: "#BDB76B",
    mediumvioletred: "#C71585",
    indianred: "#CD5C5C",
    peru: "#CD853F",
    chocolate: "#D2691E",
    tan: "#D2B48C",
    lightgray: "#D3D3D3",
    lightgrey: "#D3D3D3",
    thistle: "#D8BFD8",
    orchid: "#DA70D6",
    goldenrod: "#DAA520",
    palevioletred: "#DB7093",
    crimson: "#DC143C",
    gainsboro: "#DCDCDC",
    plum: "#DDA0DD",
    burlywood: "#DEB887",
    lightcyan: "#E0FFFF",
    lavender: "#E6E6FA",
    darksalmon: "#E9967A",
    violet: "#EE82EE",
    palegoldenrod: "#EEE8AA",
    lightcoral: "#F08080",
    khaki: "#F0E68C",
    aliceblue: "#F0F8FF",
    honeydew: "#F0FFF0",
    azure: "#F0FFFF",
    sandybrown: "#F4A460",
    wheat: "#F5DEB3",
    beige: "#F5F5DC",
    whitesmoke: "#F5F5F5",
    mintcream: "#F5FFFA",
    ghostwhite: "#F8F8FF",
    salmon: "#FA8072",
    antiquewhite: "#FAEBD7",
    linen: "#FAF0E6",
    lightgoldenrodyellow: "#FAFAD2",
    oldlace: "#FDF5E6",
    magenta: "#FF00FF",
    deeppink: "#FF1493",
    orangered: "#FF4500",
    tomato: "#FF6347",
    hotpink: "#FF69B4",
    coral: "#FF7F50",
    darkorange: "#FF8C00",
    lightsalmon: "#FFA07A",
    orange: "#FFA500",
    lightpink: "#FFB6C1",
    pink: "#FFC0CB",
    gold: "#FFD700",
    peachpuff: "#FFDAB9",
    navajowhite: "#FFDEAD",
    moccasin: "#FFE4B5",
    bisque: "#FFE4C4",
    mistyrose: "#FFE4E1",
    blanchedalmond: "#FFEBCD",
    papayawhip: "#FFEFD5",
    lavenderblush: "#FFF0F5",
    seashell: "#FFF5EE",
    cornsilk: "#FFF8DC",
    lemonchiffon: "#FFFACD",
    floralwhite: "#FFFAF0",
    snow: "#FFFAFA",
    lightyellow: "#FFFFE0",
    ivory: "#FFFFF0",
};

},{}],71:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cubicInOut = exports.cubicOut = exports.cubicIn = exports.quadraticInOut = exports.quadraticOut = exports.quadraticIn = exports.linear = void 0;
/**
 * Sigma.js Easings
 * =================
 *
 * Handy collection of easing functions.
 * @module
 */
var linear = function (k) { return k; };
exports.linear = linear;
var quadraticIn = function (k) { return k * k; };
exports.quadraticIn = quadraticIn;
var quadraticOut = function (k) { return k * (2 - k); };
exports.quadraticOut = quadraticOut;
var quadraticInOut = function (k) {
    if ((k *= 2) < 1)
        return 0.5 * k * k;
    return -0.5 * (--k * (k - 2) - 1);
};
exports.quadraticInOut = quadraticInOut;
var cubicIn = function (k) { return k * k * k; };
exports.cubicIn = cubicIn;
var cubicOut = function (k) { return --k * k * k + 1; };
exports.cubicOut = cubicOut;
var cubicInOut = function (k) {
    if ((k *= 2) < 1)
        return 0.5 * k * k * k;
    return 0.5 * ((k -= 2) * k * k + 2);
};
exports.cubicInOut = cubicInOut;
var easings = {
    linear: exports.linear,
    quadraticIn: exports.quadraticIn,
    quadraticOut: exports.quadraticOut,
    quadraticInOut: exports.quadraticInOut,
    cubicIn: exports.cubicIn,
    cubicOut: exports.cubicOut,
    cubicInOut: exports.cubicInOut,
};
exports.default = easings;

},{}],72:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doEdgeCollideWithPoint = exports.isPixelColored = void 0;
/**
 * This helper returns true is the pixel at (x,y) in the given WebGL context is
 * colored, and false else.
 */
function isPixelColored(gl, x, y) {
    var pixels = new Uint8Array(4);
    gl.readPixels(x, gl.drawingBufferHeight - y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    return pixels[3] > 0;
}
exports.isPixelColored = isPixelColored;
/**
 * This helper checks whether or not a point (x, y) collides with an
 * edge, connecting a source (xS, yS) to a target (xT, yT) with a thickness in
 * pixels.
 */
function doEdgeCollideWithPoint(x, y, xS, yS, xT, yT, thickness) {
    // Check first if point is out of the rectangle which opposite corners are the
    // source and the target, rectangle we expand by `thickness` in every
    // directions:
    if (x < xS - thickness && x < xT - thickness)
        return false;
    if (y < yS - thickness && y < yT - thickness)
        return false;
    if (x > xS + thickness && x > xT + thickness)
        return false;
    if (y > yS + thickness && y > yT + thickness)
        return false;
    // Check actual collision now: Since we now the point is in this big rectangle
    // we "just" need to check that the distance between the point and the line
    // connecting the source and the target is less than `thickness`:
    // https://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line
    var distance = Math.abs((xT - xS) * (yS - y) - (xS - x) * (yT - yS)) / Math.sqrt(Math.pow(xT - xS, 2) + Math.pow(yT - yS, 2));
    return distance < thickness / 2;
}
exports.doEdgeCollideWithPoint = doEdgeCollideWithPoint;

},{}],73:[function(require,module,exports){
"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateGraph = exports.canUse32BitsIndices = exports.extractPixel = exports.getMatrixImpact = exports.matrixFromCamera = exports.getCorrectionRatio = exports.floatColor = exports.floatArrayColor = exports.parseColor = exports.zIndexOrdering = exports.createNormalizationFunction = exports.graphExtent = exports.getPixelRatio = exports.createElement = exports.cancelFrame = exports.requestFrame = exports.assignDeep = exports.assign = exports.isPlainObject = void 0;
var is_graph_1 = __importDefault(require("graphology-utils/is-graph"));
var matrices_1 = require("./matrices");
var data_1 = require("./data");
/**
 * Checks whether the given value is a plain object.
 *
 * @param  {mixed}   value - Target value.
 * @return {boolean}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
function isPlainObject(value) {
    return typeof value === "object" && value !== null && value.constructor === Object;
}
exports.isPlainObject = isPlainObject;
/**
 * Helper to use Object.assign with more than two objects.
 *
 * @param  {object} target       - First object.
 * @param  {object} [...objects] - Objects to merge.
 * @return {object}
 */
function assign(target) {
    var objects = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        objects[_i - 1] = arguments[_i];
    }
    target = target || {};
    for (var i = 0, l = objects.length; i < l; i++) {
        var o = objects[i];
        if (!o)
            continue;
        Object.assign(target, o);
    }
    return target;
}
exports.assign = assign;
/**
 * Very simple recursive Object.assign-like function.
 *
 * @param  {object} target       - First object.
 * @param  {object} [...objects] - Objects to merge.
 * @return {object}
 */
function assignDeep(target) {
    var objects = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        objects[_i - 1] = arguments[_i];
    }
    target = target || {};
    for (var i = 0, l = objects.length; i < l; i++) {
        var o = objects[i];
        if (!o)
            continue;
        for (var k in o) {
            if (isPlainObject(o[k])) {
                target[k] = assignDeep(target[k], o[k]);
            }
            else {
                target[k] = o[k];
            }
        }
    }
    return target;
}
exports.assignDeep = assignDeep;
/**
 * Just some dirty trick to make requestAnimationFrame and cancelAnimationFrame "work" in Node.js, for unit tests:
 */
exports.requestFrame = typeof requestAnimationFrame !== "undefined"
    ? function (callback) { return requestAnimationFrame(callback); }
    : function (callback) { return setTimeout(callback, 0); };
exports.cancelFrame = typeof cancelAnimationFrame !== "undefined"
    ? function (requestID) { return cancelAnimationFrame(requestID); }
    : function (requestID) { return clearTimeout(requestID); };
/**
 * Function used to create DOM elements easily.
 *
 * @param  {string} tag        - Tag name of the element to create.
 * @param  {object} style      - Styles map.
 * @param  {object} attributes - Attributes map.
 * @return {HTMLElement}
 */
function createElement(tag, style, attributes) {
    var element = document.createElement(tag);
    if (style) {
        for (var k in style) {
            element.style[k] = style[k];
        }
    }
    if (attributes) {
        for (var k in attributes) {
            element.setAttribute(k, attributes[k]);
        }
    }
    return element;
}
exports.createElement = createElement;
/**
 * Function returning the browser's pixel ratio.
 *
 * @return {number}
 */
function getPixelRatio() {
    if (typeof window.devicePixelRatio !== "undefined")
        return window.devicePixelRatio;
    return 1;
}
exports.getPixelRatio = getPixelRatio;
/**
 * Function returning the graph's node extent in x & y.
 *
 * @param  {Graph}
 * @return {object}
 */
function graphExtent(graph) {
    if (!graph.order)
        return { x: [0, 1], y: [0, 1] };
    var xMin = Infinity;
    var xMax = -Infinity;
    var yMin = Infinity;
    var yMax = -Infinity;
    graph.forEachNode(function (_, attr) {
        var x = attr.x, y = attr.y;
        if (x < xMin)
            xMin = x;
        if (x > xMax)
            xMax = x;
        if (y < yMin)
            yMin = y;
        if (y > yMax)
            yMax = y;
    });
    return { x: [xMin, xMax], y: [yMin, yMax] };
}
exports.graphExtent = graphExtent;
function createNormalizationFunction(extent) {
    var _a = __read(extent.x, 2), minX = _a[0], maxX = _a[1], _b = __read(extent.y, 2), minY = _b[0], maxY = _b[1];
    var ratio = Math.max(maxX - minX, maxY - minY), dX = (maxX + minX) / 2, dY = (maxY + minY) / 2;
    if (ratio === 0 || Math.abs(ratio) === Infinity || isNaN(ratio))
        ratio = 1;
    if (isNaN(dX))
        dX = 0;
    if (isNaN(dY))
        dY = 0;
    var fn = function (data) {
        return {
            x: 0.5 + (data.x - dX) / ratio,
            y: 0.5 + (data.y - dY) / ratio,
        };
    };
    // TODO: possibility to apply this in batch over array of indices
    fn.applyTo = function (data) {
        data.x = 0.5 + (data.x - dX) / ratio;
        data.y = 0.5 + (data.y - dY) / ratio;
    };
    fn.inverse = function (data) {
        return {
            x: dX + ratio * (data.x - 0.5),
            y: dY + ratio * (data.y - 0.5),
        };
    };
    fn.ratio = ratio;
    return fn;
}
exports.createNormalizationFunction = createNormalizationFunction;
/**
 * Function ordering the given elements in reverse z-order so they drawn
 * the correct way.
 *
 * @param  {number}   extent   - [min, max] z values.
 * @param  {function} getter   - Z attribute getter function.
 * @param  {array}    elements - The array to sort.
 * @return {array} - The sorted array.
 */
function zIndexOrdering(extent, getter, elements) {
    // If k is > n, we'll use a standard sort
    return elements.sort(function (a, b) {
        var zA = getter(a) || 0, zB = getter(b) || 0;
        if (zA < zB)
            return -1;
        if (zA > zB)
            return 1;
        return 0;
    });
    // TODO: counting sort optimization
}
exports.zIndexOrdering = zIndexOrdering;
/**
 * WebGL utils
 * ===========
 */
/**
 * Memoized function returning a float-encoded color from various string
 * formats describing colors.
 */
var INT8 = new Int8Array(4);
var INT32 = new Int32Array(INT8.buffer, 0, 1);
var FLOAT32 = new Float32Array(INT8.buffer, 0, 1);
var RGBA_TEST_REGEX = /^\s*rgba?\s*\(/;
var RGBA_EXTRACT_REGEX = /^\s*rgba?\s*\(\s*([0-9]*)\s*,\s*([0-9]*)\s*,\s*([0-9]*)(?:\s*,\s*(.*)?)?\)\s*$/;
function parseColor(val) {
    var r = 0; // byte
    var g = 0; // byte
    var b = 0; // byte
    var a = 1; // float
    // Handling hexadecimal notation
    if (val[0] === "#") {
        if (val.length === 4) {
            r = parseInt(val.charAt(1) + val.charAt(1), 16);
            g = parseInt(val.charAt(2) + val.charAt(2), 16);
            b = parseInt(val.charAt(3) + val.charAt(3), 16);
        }
        else {
            r = parseInt(val.charAt(1) + val.charAt(2), 16);
            g = parseInt(val.charAt(3) + val.charAt(4), 16);
            b = parseInt(val.charAt(5) + val.charAt(6), 16);
        }
        // TODO: parse hex with alpha?
    }
    // Handling rgb notation
    else if (RGBA_TEST_REGEX.test(val)) {
        var match = val.match(RGBA_EXTRACT_REGEX);
        if (match) {
            r = +match[1];
            g = +match[2];
            b = +match[3];
            if (match[4])
                a = +match[4];
        }
    }
    return { r: r, g: g, b: b, a: a };
}
exports.parseColor = parseColor;
var FLOAT_COLOR_CACHE = {};
for (var htmlColor in data_1.HTML_COLORS) {
    FLOAT_COLOR_CACHE[htmlColor] = floatColor(data_1.HTML_COLORS[htmlColor]);
    // Replicating cache for hex values for free
    FLOAT_COLOR_CACHE[data_1.HTML_COLORS[htmlColor]] = FLOAT_COLOR_CACHE[htmlColor];
}
function floatArrayColor(val) {
    val = data_1.HTML_COLORS[val] || val;
    // NOTE: this variant is not cached because it is mostly used for uniforms
    var _a = parseColor(val), r = _a.r, g = _a.g, b = _a.b, a = _a.a;
    return new Float32Array([r / 255, g / 255, b / 255, a]);
}
exports.floatArrayColor = floatArrayColor;
function floatColor(val) {
    // If the color is already computed, we yield it
    if (typeof FLOAT_COLOR_CACHE[val] !== "undefined")
        return FLOAT_COLOR_CACHE[val];
    var parsed = parseColor(val);
    var r = parsed.r, g = parsed.g, b = parsed.b;
    var a = parsed.a;
    a = (a * 255) | 0;
    INT32[0] = ((a << 24) | (b << 16) | (g << 8) | r) & 0xfeffffff;
    var color = FLOAT32[0];
    FLOAT_COLOR_CACHE[val] = color;
    return color;
}
exports.floatColor = floatColor;
/**
 * In sigma, the graph is normalized into a [0, 1], [0, 1] square, before being given to the various renderers. This
 * helps dealing with quadtree in particular.
 * But at some point, we need to rescale it so that it takes the best place in the screen, ie. we always want to see two
 * nodes "touching" opposite sides of the graph, with the camera being at its default state.
 *
 * This function determines this ratio.
 */
function getCorrectionRatio(viewportDimensions, graphDimensions) {
    var viewportRatio = viewportDimensions.height / viewportDimensions.width;
    var graphRatio = graphDimensions.height / graphDimensions.width;
    // If the stage and the graphs are in different directions (such as the graph being wider that tall while the stage
    // is taller than wide), we can stop here to have indeed nodes touching opposite sides:
    if ((viewportRatio < 1 && graphRatio > 1) || (viewportRatio > 1 && graphRatio < 1)) {
        return 1;
    }
    // Else, we need to fit the graph inside the stage:
    // 1. If the graph is "squarer" (ie. with a ratio closer to 1), we need to make the largest sides touch;
    // 2. If the stage is "squarer", we need to make the smallest sides touch.
    return Math.min(Math.max(graphRatio, 1 / graphRatio), Math.max(1 / viewportRatio, viewportRatio));
}
exports.getCorrectionRatio = getCorrectionRatio;
/**
 * Function returning a matrix from the current state of the camera.
 */
// TODO: it's possible to optimize this drastically!
function matrixFromCamera(state, viewportDimensions, graphDimensions, padding, inverse) {
    var angle = state.angle, ratio = state.ratio, x = state.x, y = state.y;
    var width = viewportDimensions.width, height = viewportDimensions.height;
    var matrix = (0, matrices_1.identity)();
    var smallestDimension = Math.min(width, height) - 2 * padding;
    var correctionRatio = getCorrectionRatio(viewportDimensions, graphDimensions);
    if (!inverse) {
        (0, matrices_1.multiply)(matrix, (0, matrices_1.scale)((0, matrices_1.identity)(), 2 * (smallestDimension / width) * correctionRatio, 2 * (smallestDimension / height) * correctionRatio));
        (0, matrices_1.multiply)(matrix, (0, matrices_1.rotate)((0, matrices_1.identity)(), -angle));
        (0, matrices_1.multiply)(matrix, (0, matrices_1.scale)((0, matrices_1.identity)(), 1 / ratio));
        (0, matrices_1.multiply)(matrix, (0, matrices_1.translate)((0, matrices_1.identity)(), -x, -y));
    }
    else {
        (0, matrices_1.multiply)(matrix, (0, matrices_1.translate)((0, matrices_1.identity)(), x, y));
        (0, matrices_1.multiply)(matrix, (0, matrices_1.scale)((0, matrices_1.identity)(), ratio));
        (0, matrices_1.multiply)(matrix, (0, matrices_1.rotate)((0, matrices_1.identity)(), angle));
        (0, matrices_1.multiply)(matrix, (0, matrices_1.scale)((0, matrices_1.identity)(), width / smallestDimension / 2 / correctionRatio, height / smallestDimension / 2 / correctionRatio));
    }
    return matrix;
}
exports.matrixFromCamera = matrixFromCamera;
/**
 * All these transformations we apply on the matrix to get it rescale the graph
 * as we want make it very hard to get pixel-perfect distances in WebGL. This
 * function returns a factor that properly cancels the matrix effect on lengths.
 *
 * [jacomyal]
 * To be fully honest, I can't really explain happens here... I notice that the
 * following ratio works (ie. it correctly compensates the matrix impact on all
 * camera states I could try):
 * > `R = size(V) / size(M * V) / W`
 * as long as `M * V` is in the direction of W (ie. parallel to (Ox)). It works
 * as well with H and a vector that transforms into something parallel to (Oy).
 *
 * Also, note that we use `angle` and not `-angle` (that would seem logical,
 * since we want to anticipate the rotation), because of the fact that in WebGL,
 * the image is vertically swapped.
 */
function getMatrixImpact(matrix, cameraState, viewportDimensions) {
    var _a = (0, matrices_1.multiplyVec2)(matrix, { x: Math.cos(cameraState.angle), y: Math.sin(cameraState.angle) }, 0), x = _a.x, y = _a.y;
    return 1 / Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) / viewportDimensions.width;
}
exports.getMatrixImpact = getMatrixImpact;
/**
 * Function extracting the color at the given pixel.
 */
function extractPixel(gl, x, y, array) {
    var data = array || new Uint8Array(4);
    gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, data);
    return data;
}
exports.extractPixel = extractPixel;
/**
 * Function used to know whether given webgl context can use 32 bits indices.
 */
function canUse32BitsIndices(gl) {
    var webgl2 = typeof WebGL2RenderingContext !== "undefined" && gl instanceof WebGL2RenderingContext;
    return webgl2 || !!gl.getExtension("OES_element_index_uint");
}
exports.canUse32BitsIndices = canUse32BitsIndices;
/**
 * Check if the graph variable is a valid graph, and if sigma can render it.
 */
function validateGraph(graph) {
    // check if it's a valid graphology instance
    if (!(0, is_graph_1.default)(graph))
        throw new Error("Sigma: invalid graph instance.");
    // check if nodes have x/y attributes
    graph.forEachNode(function (key, attributes) {
        if (!Number.isFinite(attributes.x) || !Number.isFinite(attributes.y)) {
            throw new Error("Sigma: Coordinates of node ".concat(key, " are invalid. A node must have a numeric 'x' and 'y' attribute."));
        }
    });
}
exports.validateGraph = validateGraph;

},{"./data":70,"./matrices":74,"graphology-utils/is-graph":36}],74:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiplyVec2 = exports.multiply = exports.translate = exports.rotate = exports.scale = exports.identity = void 0;
function identity() {
    return Float32Array.of(1, 0, 0, 0, 1, 0, 0, 0, 1);
}
exports.identity = identity;
// TODO: optimize
function scale(m, x, y) {
    m[0] = x;
    m[4] = typeof y === "number" ? y : x;
    return m;
}
exports.scale = scale;
function rotate(m, r) {
    var s = Math.sin(r), c = Math.cos(r);
    m[0] = c;
    m[1] = s;
    m[3] = -s;
    m[4] = c;
    return m;
}
exports.rotate = rotate;
function translate(m, x, y) {
    m[6] = x;
    m[7] = y;
    return m;
}
exports.translate = translate;
function multiply(a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2];
    var a10 = a[3], a11 = a[4], a12 = a[5];
    var a20 = a[6], a21 = a[7], a22 = a[8];
    var b00 = b[0], b01 = b[1], b02 = b[2];
    var b10 = b[3], b11 = b[4], b12 = b[5];
    var b20 = b[6], b21 = b[7], b22 = b[8];
    a[0] = b00 * a00 + b01 * a10 + b02 * a20;
    a[1] = b00 * a01 + b01 * a11 + b02 * a21;
    a[2] = b00 * a02 + b01 * a12 + b02 * a22;
    a[3] = b10 * a00 + b11 * a10 + b12 * a20;
    a[4] = b10 * a01 + b11 * a11 + b12 * a21;
    a[5] = b10 * a02 + b11 * a12 + b12 * a22;
    a[6] = b20 * a00 + b21 * a10 + b22 * a20;
    a[7] = b20 * a01 + b21 * a11 + b22 * a21;
    a[8] = b20 * a02 + b21 * a12 + b22 * a22;
    return a;
}
exports.multiply = multiply;
function multiplyVec2(a, b, z) {
    if (z === void 0) { z = 1; }
    var a00 = a[0];
    var a01 = a[1];
    var a10 = a[3];
    var a11 = a[4];
    var a20 = a[6];
    var a21 = a[7];
    var b0 = b.x;
    var b1 = b.y;
    return { x: b0 * a00 + b1 * a10 + a20 * z, y: b0 * a01 + b1 * a11 + a21 * z };
}
exports.multiplyVec2 = multiplyVec2;

},{}],75:[function(require,module,exports){
"use strict";
/**
 * Initialize backoff timer with `opts`.
 *
 * - `min` initial timeout in milliseconds [100]
 * - `max` max timeout [10000]
 * - `jitter` [0]
 * - `factor` [2]
 *
 * @param {Object} opts
 * @api public
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Backoff = void 0;
function Backoff(opts) {
    opts = opts || {};
    this.ms = opts.min || 100;
    this.max = opts.max || 10000;
    this.factor = opts.factor || 2;
    this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0;
    this.attempts = 0;
}
exports.Backoff = Backoff;
/**
 * Return the backoff duration.
 *
 * @return {Number}
 * @api public
 */
Backoff.prototype.duration = function () {
    var ms = this.ms * Math.pow(this.factor, this.attempts++);
    if (this.jitter) {
        var rand = Math.random();
        var deviation = Math.floor(rand * this.jitter * ms);
        ms = (Math.floor(rand * 10) & 1) == 0 ? ms - deviation : ms + deviation;
    }
    return Math.min(ms, this.max) | 0;
};
/**
 * Reset the number of attempts.
 *
 * @api public
 */
Backoff.prototype.reset = function () {
    this.attempts = 0;
};
/**
 * Set the minimum duration
 *
 * @api public
 */
Backoff.prototype.setMin = function (min) {
    this.ms = min;
};
/**
 * Set the maximum duration
 *
 * @api public
 */
Backoff.prototype.setMax = function (max) {
    this.max = max;
};
/**
 * Set the jitter
 *
 * @api public
 */
Backoff.prototype.setJitter = function (jitter) {
    this.jitter = jitter;
};

},{}],76:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports.connect = exports.io = exports.Socket = exports.Manager = exports.protocol = void 0;
const url_js_1 = require("./url.js");
const manager_js_1 = require("./manager.js");
Object.defineProperty(exports, "Manager", { enumerable: true, get: function () { return manager_js_1.Manager; } });
const socket_js_1 = require("./socket.js");
Object.defineProperty(exports, "Socket", { enumerable: true, get: function () { return socket_js_1.Socket; } });
const debug_1 = __importDefault(require("debug")); // debug()
const debug = debug_1.default("socket.io-client"); // debug()
/**
 * Managers cache.
 */
const cache = {};
function lookup(uri, opts) {
    if (typeof uri === "object") {
        opts = uri;
        uri = undefined;
    }
    opts = opts || {};
    const parsed = url_js_1.url(uri, opts.path || "/socket.io");
    const source = parsed.source;
    const id = parsed.id;
    const path = parsed.path;
    const sameNamespace = cache[id] && path in cache[id]["nsps"];
    const newConnection = opts.forceNew ||
        opts["force new connection"] ||
        false === opts.multiplex ||
        sameNamespace;
    let io;
    if (newConnection) {
        debug("ignoring socket cache for %s", source);
        io = new manager_js_1.Manager(source, opts);
    }
    else {
        if (!cache[id]) {
            debug("new io instance for %s", source);
            cache[id] = new manager_js_1.Manager(source, opts);
        }
        io = cache[id];
    }
    if (parsed.query && !opts.query) {
        opts.query = parsed.queryKey;
    }
    return io.socket(parsed.path, opts);
}
exports.io = lookup;
exports.connect = lookup;
exports.default = lookup;
// so that "lookup" can be used both as a function (e.g. `io(...)`) and as a
// namespace (e.g. `io.connect(...)`), for backward compatibility
Object.assign(lookup, {
    Manager: manager_js_1.Manager,
    Socket: socket_js_1.Socket,
    io: lookup,
    connect: lookup,
});
/**
 * Protocol version.
 *
 * @public
 */
var socket_io_parser_1 = require("socket.io-parser");
Object.defineProperty(exports, "protocol", { enumerable: true, get: function () { return socket_io_parser_1.protocol; } });

module.exports = lookup;

},{"./manager.js":77,"./socket.js":79,"./url.js":80,"debug":81,"socket.io-parser":85}],77:[function(require,module,exports){
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Manager = void 0;
const engine_io_client_1 = require("engine.io-client");
const socket_js_1 = require("./socket.js");
const parser = __importStar(require("socket.io-parser"));
const on_js_1 = require("./on.js");
const backo2_js_1 = require("./contrib/backo2.js");
const component_emitter_1 = require("@socket.io/component-emitter");
const debug_1 = __importDefault(require("debug")); // debug()
const debug = debug_1.default("socket.io-client:manager"); // debug()
class Manager extends component_emitter_1.Emitter {
    constructor(uri, opts) {
        var _a;
        super();
        this.nsps = {};
        this.subs = [];
        if (uri && "object" === typeof uri) {
            opts = uri;
            uri = undefined;
        }
        opts = opts || {};
        opts.path = opts.path || "/socket.io";
        this.opts = opts;
        engine_io_client_1.installTimerFunctions(this, opts);
        this.reconnection(opts.reconnection !== false);
        this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);
        this.reconnectionDelay(opts.reconnectionDelay || 1000);
        this.reconnectionDelayMax(opts.reconnectionDelayMax || 5000);
        this.randomizationFactor((_a = opts.randomizationFactor) !== null && _a !== void 0 ? _a : 0.5);
        this.backoff = new backo2_js_1.Backoff({
            min: this.reconnectionDelay(),
            max: this.reconnectionDelayMax(),
            jitter: this.randomizationFactor(),
        });
        this.timeout(null == opts.timeout ? 20000 : opts.timeout);
        this._readyState = "closed";
        this.uri = uri;
        const _parser = opts.parser || parser;
        this.encoder = new _parser.Encoder();
        this.decoder = new _parser.Decoder();
        this._autoConnect = opts.autoConnect !== false;
        if (this._autoConnect)
            this.open();
    }
    reconnection(v) {
        if (!arguments.length)
            return this._reconnection;
        this._reconnection = !!v;
        return this;
    }
    reconnectionAttempts(v) {
        if (v === undefined)
            return this._reconnectionAttempts;
        this._reconnectionAttempts = v;
        return this;
    }
    reconnectionDelay(v) {
        var _a;
        if (v === undefined)
            return this._reconnectionDelay;
        this._reconnectionDelay = v;
        (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setMin(v);
        return this;
    }
    randomizationFactor(v) {
        var _a;
        if (v === undefined)
            return this._randomizationFactor;
        this._randomizationFactor = v;
        (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setJitter(v);
        return this;
    }
    reconnectionDelayMax(v) {
        var _a;
        if (v === undefined)
            return this._reconnectionDelayMax;
        this._reconnectionDelayMax = v;
        (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setMax(v);
        return this;
    }
    timeout(v) {
        if (!arguments.length)
            return this._timeout;
        this._timeout = v;
        return this;
    }
    /**
     * Starts trying to reconnect if reconnection is enabled and we have not
     * started reconnecting yet
     *
     * @private
     */
    maybeReconnectOnOpen() {
        // Only try to reconnect if it's the first time we're connecting
        if (!this._reconnecting &&
            this._reconnection &&
            this.backoff.attempts === 0) {
            // keeps reconnection from firing twice for the same reconnection loop
            this.reconnect();
        }
    }
    /**
     * Sets the current transport `socket`.
     *
     * @param {Function} fn - optional, callback
     * @return self
     * @public
     */
    open(fn) {
        debug("readyState %s", this._readyState);
        if (~this._readyState.indexOf("open"))
            return this;
        debug("opening %s", this.uri);
        this.engine = new engine_io_client_1.Socket(this.uri, this.opts);
        const socket = this.engine;
        const self = this;
        this._readyState = "opening";
        this.skipReconnect = false;
        // emit `open`
        const openSubDestroy = on_js_1.on(socket, "open", function () {
            self.onopen();
            fn && fn();
        });
        // emit `error`
        const errorSub = on_js_1.on(socket, "error", (err) => {
            debug("error");
            self.cleanup();
            self._readyState = "closed";
            this.emitReserved("error", err);
            if (fn) {
                fn(err);
            }
            else {
                // Only do this if there is no fn to handle the error
                self.maybeReconnectOnOpen();
            }
        });
        if (false !== this._timeout) {
            const timeout = this._timeout;
            debug("connect attempt will timeout after %d", timeout);
            if (timeout === 0) {
                openSubDestroy(); // prevents a race condition with the 'open' event
            }
            // set timer
            const timer = this.setTimeoutFn(() => {
                debug("connect attempt timed out after %d", timeout);
                openSubDestroy();
                socket.close();
                // @ts-ignore
                socket.emit("error", new Error("timeout"));
            }, timeout);
            if (this.opts.autoUnref) {
                timer.unref();
            }
            this.subs.push(function subDestroy() {
                clearTimeout(timer);
            });
        }
        this.subs.push(openSubDestroy);
        this.subs.push(errorSub);
        return this;
    }
    /**
     * Alias for open()
     *
     * @return self
     * @public
     */
    connect(fn) {
        return this.open(fn);
    }
    /**
     * Called upon transport open.
     *
     * @private
     */
    onopen() {
        debug("open");
        // clear old subs
        this.cleanup();
        // mark as open
        this._readyState = "open";
        this.emitReserved("open");
        // add new subs
        const socket = this.engine;
        this.subs.push(on_js_1.on(socket, "ping", this.onping.bind(this)), on_js_1.on(socket, "data", this.ondata.bind(this)), on_js_1.on(socket, "error", this.onerror.bind(this)), on_js_1.on(socket, "close", this.onclose.bind(this)), on_js_1.on(this.decoder, "decoded", this.ondecoded.bind(this)));
    }
    /**
     * Called upon a ping.
     *
     * @private
     */
    onping() {
        this.emitReserved("ping");
    }
    /**
     * Called with data.
     *
     * @private
     */
    ondata(data) {
        this.decoder.add(data);
    }
    /**
     * Called when parser fully decodes a packet.
     *
     * @private
     */
    ondecoded(packet) {
        this.emitReserved("packet", packet);
    }
    /**
     * Called upon socket error.
     *
     * @private
     */
    onerror(err) {
        debug("error", err);
        this.emitReserved("error", err);
    }
    /**
     * Creates a new socket for the given `nsp`.
     *
     * @return {Socket}
     * @public
     */
    socket(nsp, opts) {
        let socket = this.nsps[nsp];
        if (!socket) {
            socket = new socket_js_1.Socket(this, nsp, opts);
            this.nsps[nsp] = socket;
        }
        return socket;
    }
    /**
     * Called upon a socket close.
     *
     * @param socket
     * @private
     */
    _destroy(socket) {
        const nsps = Object.keys(this.nsps);
        for (const nsp of nsps) {
            const socket = this.nsps[nsp];
            if (socket.active) {
                debug("socket %s is still active, skipping close", nsp);
                return;
            }
        }
        this._close();
    }
    /**
     * Writes a packet.
     *
     * @param packet
     * @private
     */
    _packet(packet) {
        debug("writing packet %j", packet);
        const encodedPackets = this.encoder.encode(packet);
        for (let i = 0; i < encodedPackets.length; i++) {
            this.engine.write(encodedPackets[i], packet.options);
        }
    }
    /**
     * Clean up transport subscriptions and packet buffer.
     *
     * @private
     */
    cleanup() {
        debug("cleanup");
        this.subs.forEach((subDestroy) => subDestroy());
        this.subs.length = 0;
        this.decoder.destroy();
    }
    /**
     * Close the current socket.
     *
     * @private
     */
    _close() {
        debug("disconnect");
        this.skipReconnect = true;
        this._reconnecting = false;
        this.onclose("forced close");
        if (this.engine)
            this.engine.close();
    }
    /**
     * Alias for close()
     *
     * @private
     */
    disconnect() {
        return this._close();
    }
    /**
     * Called upon engine close.
     *
     * @private
     */
    onclose(reason, description) {
        debug("closed due to %s", reason);
        this.cleanup();
        this.backoff.reset();
        this._readyState = "closed";
        this.emitReserved("close", reason, description);
        if (this._reconnection && !this.skipReconnect) {
            this.reconnect();
        }
    }
    /**
     * Attempt a reconnection.
     *
     * @private
     */
    reconnect() {
        if (this._reconnecting || this.skipReconnect)
            return this;
        const self = this;
        if (this.backoff.attempts >= this._reconnectionAttempts) {
            debug("reconnect failed");
            this.backoff.reset();
            this.emitReserved("reconnect_failed");
            this._reconnecting = false;
        }
        else {
            const delay = this.backoff.duration();
            debug("will wait %dms before reconnect attempt", delay);
            this._reconnecting = true;
            const timer = this.setTimeoutFn(() => {
                if (self.skipReconnect)
                    return;
                debug("attempting reconnect");
                this.emitReserved("reconnect_attempt", self.backoff.attempts);
                // check again for the case socket closed in above events
                if (self.skipReconnect)
                    return;
                self.open((err) => {
                    if (err) {
                        debug("reconnect attempt error");
                        self._reconnecting = false;
                        self.reconnect();
                        this.emitReserved("reconnect_error", err);
                    }
                    else {
                        debug("reconnect success");
                        self.onreconnect();
                    }
                });
            }, delay);
            if (this.opts.autoUnref) {
                timer.unref();
            }
            this.subs.push(function subDestroy() {
                clearTimeout(timer);
            });
        }
    }
    /**
     * Called upon successful reconnect.
     *
     * @private
     */
    onreconnect() {
        const attempt = this.backoff.attempts;
        this._reconnecting = false;
        this.backoff.reset();
        this.emitReserved("reconnect", attempt);
    }
}
exports.Manager = Manager;

},{"./contrib/backo2.js":75,"./on.js":78,"./socket.js":79,"@socket.io/component-emitter":1,"debug":81,"engine.io-client":8,"socket.io-parser":85}],78:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.on = void 0;
function on(obj, ev, fn) {
    obj.on(ev, fn);
    return function subDestroy() {
        obj.off(ev, fn);
    };
}
exports.on = on;

},{}],79:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Socket = void 0;
const socket_io_parser_1 = require("socket.io-parser");
const on_js_1 = require("./on.js");
const component_emitter_1 = require("@socket.io/component-emitter");
const debug_1 = __importDefault(require("debug")); // debug()
const debug = debug_1.default("socket.io-client:socket"); // debug()
/**
 * Internal events.
 * These events can't be emitted by the user.
 */
const RESERVED_EVENTS = Object.freeze({
    connect: 1,
    connect_error: 1,
    disconnect: 1,
    disconnecting: 1,
    // EventEmitter reserved events: https://nodejs.org/api/events.html#events_event_newlistener
    newListener: 1,
    removeListener: 1,
});
class Socket extends component_emitter_1.Emitter {
    /**
     * `Socket` constructor.
     *
     * @public
     */
    constructor(io, nsp, opts) {
        super();
        this.connected = false;
        this.receiveBuffer = [];
        this.sendBuffer = [];
        this.ids = 0;
        this.acks = {};
        this.flags = {};
        this.io = io;
        this.nsp = nsp;
        if (opts && opts.auth) {
            this.auth = opts.auth;
        }
        if (this.io._autoConnect)
            this.open();
    }
    /**
     * Whether the socket is currently disconnected
     */
    get disconnected() {
        return !this.connected;
    }
    /**
     * Subscribe to open, close and packet events
     *
     * @private
     */
    subEvents() {
        if (this.subs)
            return;
        const io = this.io;
        this.subs = [
            on_js_1.on(io, "open", this.onopen.bind(this)),
            on_js_1.on(io, "packet", this.onpacket.bind(this)),
            on_js_1.on(io, "error", this.onerror.bind(this)),
            on_js_1.on(io, "close", this.onclose.bind(this)),
        ];
    }
    /**
     * Whether the Socket will try to reconnect when its Manager connects or reconnects
     */
    get active() {
        return !!this.subs;
    }
    /**
     * "Opens" the socket.
     *
     * @public
     */
    connect() {
        if (this.connected)
            return this;
        this.subEvents();
        if (!this.io["_reconnecting"])
            this.io.open(); // ensure open
        if ("open" === this.io._readyState)
            this.onopen();
        return this;
    }
    /**
     * Alias for connect()
     */
    open() {
        return this.connect();
    }
    /**
     * Sends a `message` event.
     *
     * @return self
     * @public
     */
    send(...args) {
        args.unshift("message");
        this.emit.apply(this, args);
        return this;
    }
    /**
     * Override `emit`.
     * If the event is in `events`, it's emitted normally.
     *
     * @return self
     * @public
     */
    emit(ev, ...args) {
        if (RESERVED_EVENTS.hasOwnProperty(ev)) {
            throw new Error('"' + ev + '" is a reserved event name');
        }
        args.unshift(ev);
        const packet = {
            type: socket_io_parser_1.PacketType.EVENT,
            data: args,
        };
        packet.options = {};
        packet.options.compress = this.flags.compress !== false;
        // event ack callback
        if ("function" === typeof args[args.length - 1]) {
            const id = this.ids++;
            debug("emitting packet with ack id %d", id);
            const ack = args.pop();
            this._registerAckCallback(id, ack);
            packet.id = id;
        }
        const isTransportWritable = this.io.engine &&
            this.io.engine.transport &&
            this.io.engine.transport.writable;
        const discardPacket = this.flags.volatile && (!isTransportWritable || !this.connected);
        if (discardPacket) {
            debug("discard packet as the transport is not currently writable");
        }
        else if (this.connected) {
            this.notifyOutgoingListeners(packet);
            this.packet(packet);
        }
        else {
            this.sendBuffer.push(packet);
        }
        this.flags = {};
        return this;
    }
    /**
     * @private
     */
    _registerAckCallback(id, ack) {
        const timeout = this.flags.timeout;
        if (timeout === undefined) {
            this.acks[id] = ack;
            return;
        }
        // @ts-ignore
        const timer = this.io.setTimeoutFn(() => {
            delete this.acks[id];
            for (let i = 0; i < this.sendBuffer.length; i++) {
                if (this.sendBuffer[i].id === id) {
                    debug("removing packet with ack id %d from the buffer", id);
                    this.sendBuffer.splice(i, 1);
                }
            }
            debug("event with ack id %d has timed out after %d ms", id, timeout);
            ack.call(this, new Error("operation has timed out"));
        }, timeout);
        this.acks[id] = (...args) => {
            // @ts-ignore
            this.io.clearTimeoutFn(timer);
            ack.apply(this, [null, ...args]);
        };
    }
    /**
     * Sends a packet.
     *
     * @param packet
     * @private
     */
    packet(packet) {
        packet.nsp = this.nsp;
        this.io._packet(packet);
    }
    /**
     * Called upon engine `open`.
     *
     * @private
     */
    onopen() {
        debug("transport is open - connecting");
        if (typeof this.auth == "function") {
            this.auth((data) => {
                this.packet({ type: socket_io_parser_1.PacketType.CONNECT, data });
            });
        }
        else {
            this.packet({ type: socket_io_parser_1.PacketType.CONNECT, data: this.auth });
        }
    }
    /**
     * Called upon engine or manager `error`.
     *
     * @param err
     * @private
     */
    onerror(err) {
        if (!this.connected) {
            this.emitReserved("connect_error", err);
        }
    }
    /**
     * Called upon engine `close`.
     *
     * @param reason
     * @param description
     * @private
     */
    onclose(reason, description) {
        debug("close (%s)", reason);
        this.connected = false;
        delete this.id;
        this.emitReserved("disconnect", reason, description);
    }
    /**
     * Called with socket packet.
     *
     * @param packet
     * @private
     */
    onpacket(packet) {
        const sameNamespace = packet.nsp === this.nsp;
        if (!sameNamespace)
            return;
        switch (packet.type) {
            case socket_io_parser_1.PacketType.CONNECT:
                if (packet.data && packet.data.sid) {
                    const id = packet.data.sid;
                    this.onconnect(id);
                }
                else {
                    this.emitReserved("connect_error", new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));
                }
                break;
            case socket_io_parser_1.PacketType.EVENT:
            case socket_io_parser_1.PacketType.BINARY_EVENT:
                this.onevent(packet);
                break;
            case socket_io_parser_1.PacketType.ACK:
            case socket_io_parser_1.PacketType.BINARY_ACK:
                this.onack(packet);
                break;
            case socket_io_parser_1.PacketType.DISCONNECT:
                this.ondisconnect();
                break;
            case socket_io_parser_1.PacketType.CONNECT_ERROR:
                this.destroy();
                const err = new Error(packet.data.message);
                // @ts-ignore
                err.data = packet.data.data;
                this.emitReserved("connect_error", err);
                break;
        }
    }
    /**
     * Called upon a server event.
     *
     * @param packet
     * @private
     */
    onevent(packet) {
        const args = packet.data || [];
        debug("emitting event %j", args);
        if (null != packet.id) {
            debug("attaching ack callback to event");
            args.push(this.ack(packet.id));
        }
        if (this.connected) {
            this.emitEvent(args);
        }
        else {
            this.receiveBuffer.push(Object.freeze(args));
        }
    }
    emitEvent(args) {
        if (this._anyListeners && this._anyListeners.length) {
            const listeners = this._anyListeners.slice();
            for (const listener of listeners) {
                listener.apply(this, args);
            }
        }
        super.emit.apply(this, args);
    }
    /**
     * Produces an ack callback to emit with an event.
     *
     * @private
     */
    ack(id) {
        const self = this;
        let sent = false;
        return function (...args) {
            // prevent double callbacks
            if (sent)
                return;
            sent = true;
            debug("sending ack %j", args);
            self.packet({
                type: socket_io_parser_1.PacketType.ACK,
                id: id,
                data: args,
            });
        };
    }
    /**
     * Called upon a server acknowlegement.
     *
     * @param packet
     * @private
     */
    onack(packet) {
        const ack = this.acks[packet.id];
        if ("function" === typeof ack) {
            debug("calling ack %s with %j", packet.id, packet.data);
            ack.apply(this, packet.data);
            delete this.acks[packet.id];
        }
        else {
            debug("bad ack %s", packet.id);
        }
    }
    /**
     * Called upon server connect.
     *
     * @private
     */
    onconnect(id) {
        debug("socket connected with id %s", id);
        this.id = id;
        this.connected = true;
        this.emitBuffered();
        this.emitReserved("connect");
    }
    /**
     * Emit buffered events (received and emitted).
     *
     * @private
     */
    emitBuffered() {
        this.receiveBuffer.forEach((args) => this.emitEvent(args));
        this.receiveBuffer = [];
        this.sendBuffer.forEach((packet) => {
            this.notifyOutgoingListeners(packet);
            this.packet(packet);
        });
        this.sendBuffer = [];
    }
    /**
     * Called upon server disconnect.
     *
     * @private
     */
    ondisconnect() {
        debug("server disconnect (%s)", this.nsp);
        this.destroy();
        this.onclose("io server disconnect");
    }
    /**
     * Called upon forced client/server side disconnections,
     * this method ensures the manager stops tracking us and
     * that reconnections don't get triggered for this.
     *
     * @private
     */
    destroy() {
        if (this.subs) {
            // clean subscriptions to avoid reconnections
            this.subs.forEach((subDestroy) => subDestroy());
            this.subs = undefined;
        }
        this.io["_destroy"](this);
    }
    /**
     * Disconnects the socket manually.
     *
     * @return self
     * @public
     */
    disconnect() {
        if (this.connected) {
            debug("performing disconnect (%s)", this.nsp);
            this.packet({ type: socket_io_parser_1.PacketType.DISCONNECT });
        }
        // remove socket from pool
        this.destroy();
        if (this.connected) {
            // fire events
            this.onclose("io client disconnect");
        }
        return this;
    }
    /**
     * Alias for disconnect()
     *
     * @return self
     * @public
     */
    close() {
        return this.disconnect();
    }
    /**
     * Sets the compress flag.
     *
     * @param compress - if `true`, compresses the sending data
     * @return self
     * @public
     */
    compress(compress) {
        this.flags.compress = compress;
        return this;
    }
    /**
     * Sets a modifier for a subsequent event emission that the event message will be dropped when this socket is not
     * ready to send messages.
     *
     * @returns self
     * @public
     */
    get volatile() {
        this.flags.volatile = true;
        return this;
    }
    /**
     * Sets a modifier for a subsequent event emission that the callback will be called with an error when the
     * given number of milliseconds have elapsed without an acknowledgement from the server:
     *
     * ```
     * socket.timeout(5000).emit("my-event", (err) => {
     *   if (err) {
     *     // the server did not acknowledge the event in the given delay
     *   }
     * });
     * ```
     *
     * @returns self
     * @public
     */
    timeout(timeout) {
        this.flags.timeout = timeout;
        return this;
    }
    /**
     * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
     * callback.
     *
     * @param listener
     * @public
     */
    onAny(listener) {
        this._anyListeners = this._anyListeners || [];
        this._anyListeners.push(listener);
        return this;
    }
    /**
     * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
     * callback. The listener is added to the beginning of the listeners array.
     *
     * @param listener
     * @public
     */
    prependAny(listener) {
        this._anyListeners = this._anyListeners || [];
        this._anyListeners.unshift(listener);
        return this;
    }
    /**
     * Removes the listener that will be fired when any event is emitted.
     *
     * @param listener
     * @public
     */
    offAny(listener) {
        if (!this._anyListeners) {
            return this;
        }
        if (listener) {
            const listeners = this._anyListeners;
            for (let i = 0; i < listeners.length; i++) {
                if (listener === listeners[i]) {
                    listeners.splice(i, 1);
                    return this;
                }
            }
        }
        else {
            this._anyListeners = [];
        }
        return this;
    }
    /**
     * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
     * e.g. to remove listeners.
     *
     * @public
     */
    listenersAny() {
        return this._anyListeners || [];
    }
    /**
     * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
     * callback.
     *
     * @param listener
     *
     * <pre><code>
     *
     * socket.onAnyOutgoing((event, ...args) => {
     *   console.log(event);
     * });
     *
     * </pre></code>
     *
     * @public
     */
    onAnyOutgoing(listener) {
        this._anyOutgoingListeners = this._anyOutgoingListeners || [];
        this._anyOutgoingListeners.push(listener);
        return this;
    }
    /**
     * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
     * callback. The listener is added to the beginning of the listeners array.
     *
     * @param listener
     *
     * <pre><code>
     *
     * socket.prependAnyOutgoing((event, ...args) => {
     *   console.log(event);
     * });
     *
     * </pre></code>
     *
     * @public
     */
    prependAnyOutgoing(listener) {
        this._anyOutgoingListeners = this._anyOutgoingListeners || [];
        this._anyOutgoingListeners.unshift(listener);
        return this;
    }
    /**
     * Removes the listener that will be fired when any event is emitted.
     *
     * @param listener
     *
     * <pre><code>
     *
     * const handler = (event, ...args) => {
     *   console.log(event);
     * }
     *
     * socket.onAnyOutgoing(handler);
     *
     * // then later
     * socket.offAnyOutgoing(handler);
     *
     * </pre></code>
     *
     * @public
     */
    offAnyOutgoing(listener) {
        if (!this._anyOutgoingListeners) {
            return this;
        }
        if (listener) {
            const listeners = this._anyOutgoingListeners;
            for (let i = 0; i < listeners.length; i++) {
                if (listener === listeners[i]) {
                    listeners.splice(i, 1);
                    return this;
                }
            }
        }
        else {
            this._anyOutgoingListeners = [];
        }
        return this;
    }
    /**
     * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
     * e.g. to remove listeners.
     *
     * @public
     */
    listenersAnyOutgoing() {
        return this._anyOutgoingListeners || [];
    }
    /**
     * Notify the listeners for each packet sent
     *
     * @param packet
     *
     * @private
     */
    notifyOutgoingListeners(packet) {
        if (this._anyOutgoingListeners && this._anyOutgoingListeners.length) {
            const listeners = this._anyOutgoingListeners.slice();
            for (const listener of listeners) {
                listener.apply(this, packet.data);
            }
        }
    }
}
exports.Socket = Socket;

},{"./on.js":78,"@socket.io/component-emitter":1,"debug":81,"socket.io-parser":85}],80:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.url = void 0;
const engine_io_client_1 = require("engine.io-client");
const debug_1 = __importDefault(require("debug")); // debug()
const debug = debug_1.default("socket.io-client:url"); // debug()
/**
 * URL parser.
 *
 * @param uri - url
 * @param path - the request path of the connection
 * @param loc - An object meant to mimic window.location.
 *        Defaults to window.location.
 * @public
 */
function url(uri, path = "", loc) {
    let obj = uri;
    // default to window.location
    loc = loc || (typeof location !== "undefined" && location);
    if (null == uri)
        uri = loc.protocol + "//" + loc.host;
    // relative path support
    if (typeof uri === "string") {
        if ("/" === uri.charAt(0)) {
            if ("/" === uri.charAt(1)) {
                uri = loc.protocol + uri;
            }
            else {
                uri = loc.host + uri;
            }
        }
        if (!/^(https?|wss?):\/\//.test(uri)) {
            debug("protocol-less url %s", uri);
            if ("undefined" !== typeof loc) {
                uri = loc.protocol + "//" + uri;
            }
            else {
                uri = "https://" + uri;
            }
        }
        // parse
        debug("parse %s", uri);
        obj = engine_io_client_1.parse(uri);
    }
    // make sure we treat `localhost:80` and `localhost` equally
    if (!obj.port) {
        if (/^(http|ws)$/.test(obj.protocol)) {
            obj.port = "80";
        }
        else if (/^(http|ws)s$/.test(obj.protocol)) {
            obj.port = "443";
        }
    }
    obj.path = obj.path || "/";
    const ipv6 = obj.host.indexOf(":") !== -1;
    const host = ipv6 ? "[" + obj.host + "]" : obj.host;
    // define unique id
    obj.id = obj.protocol + "://" + host + ":" + obj.port + path;
    // define href
    obj.href =
        obj.protocol +
            "://" +
            host +
            (loc && loc.port === obj.port ? "" : ":" + obj.port);
    return obj;
}
exports.url = url;

},{"debug":81,"engine.io-client":8}],81:[function(require,module,exports){
arguments[4][17][0].apply(exports,arguments)
},{"./common":82,"_process":92,"dup":17}],82:[function(require,module,exports){
arguments[4][18][0].apply(exports,arguments)
},{"dup":18,"ms":83}],83:[function(require,module,exports){
arguments[4][19][0].apply(exports,arguments)
},{"dup":19}],84:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reconstructPacket = exports.deconstructPacket = void 0;
const is_binary_js_1 = require("./is-binary.js");
/**
 * Replaces every Buffer | ArrayBuffer | Blob | File in packet with a numbered placeholder.
 *
 * @param {Object} packet - socket.io event packet
 * @return {Object} with deconstructed packet and list of buffers
 * @public
 */
function deconstructPacket(packet) {
    const buffers = [];
    const packetData = packet.data;
    const pack = packet;
    pack.data = _deconstructPacket(packetData, buffers);
    pack.attachments = buffers.length; // number of binary 'attachments'
    return { packet: pack, buffers: buffers };
}
exports.deconstructPacket = deconstructPacket;
function _deconstructPacket(data, buffers) {
    if (!data)
        return data;
    if (is_binary_js_1.isBinary(data)) {
        const placeholder = { _placeholder: true, num: buffers.length };
        buffers.push(data);
        return placeholder;
    }
    else if (Array.isArray(data)) {
        const newData = new Array(data.length);
        for (let i = 0; i < data.length; i++) {
            newData[i] = _deconstructPacket(data[i], buffers);
        }
        return newData;
    }
    else if (typeof data === "object" && !(data instanceof Date)) {
        const newData = {};
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                newData[key] = _deconstructPacket(data[key], buffers);
            }
        }
        return newData;
    }
    return data;
}
/**
 * Reconstructs a binary packet from its placeholder packet and buffers
 *
 * @param {Object} packet - event packet with placeholders
 * @param {Array} buffers - binary buffers to put in placeholder positions
 * @return {Object} reconstructed packet
 * @public
 */
function reconstructPacket(packet, buffers) {
    packet.data = _reconstructPacket(packet.data, buffers);
    packet.attachments = undefined; // no longer useful
    return packet;
}
exports.reconstructPacket = reconstructPacket;
function _reconstructPacket(data, buffers) {
    if (!data)
        return data;
    if (data && data._placeholder) {
        return buffers[data.num]; // appropriate buffer (should be natural order anyway)
    }
    else if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
            data[i] = _reconstructPacket(data[i], buffers);
        }
    }
    else if (typeof data === "object") {
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                data[key] = _reconstructPacket(data[key], buffers);
            }
        }
    }
    return data;
}

},{"./is-binary.js":86}],85:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Decoder = exports.Encoder = exports.PacketType = exports.protocol = void 0;
const component_emitter_1 = require("@socket.io/component-emitter");
const binary_js_1 = require("./binary.js");
const is_binary_js_1 = require("./is-binary.js");
const debug_1 = require("debug"); // debug()
const debug = debug_1.default("socket.io-parser"); // debug()
/**
 * Protocol version.
 *
 * @public
 */
exports.protocol = 5;
var PacketType;
(function (PacketType) {
    PacketType[PacketType["CONNECT"] = 0] = "CONNECT";
    PacketType[PacketType["DISCONNECT"] = 1] = "DISCONNECT";
    PacketType[PacketType["EVENT"] = 2] = "EVENT";
    PacketType[PacketType["ACK"] = 3] = "ACK";
    PacketType[PacketType["CONNECT_ERROR"] = 4] = "CONNECT_ERROR";
    PacketType[PacketType["BINARY_EVENT"] = 5] = "BINARY_EVENT";
    PacketType[PacketType["BINARY_ACK"] = 6] = "BINARY_ACK";
})(PacketType = exports.PacketType || (exports.PacketType = {}));
/**
 * A socket.io Encoder instance
 */
class Encoder {
    /**
     * Encoder constructor
     *
     * @param {function} replacer - custom replacer to pass down to JSON.parse
     */
    constructor(replacer) {
        this.replacer = replacer;
    }
    /**
     * Encode a packet as a single string if non-binary, or as a
     * buffer sequence, depending on packet type.
     *
     * @param {Object} obj - packet object
     */
    encode(obj) {
        debug("encoding packet %j", obj);
        if (obj.type === PacketType.EVENT || obj.type === PacketType.ACK) {
            if (is_binary_js_1.hasBinary(obj)) {
                obj.type =
                    obj.type === PacketType.EVENT
                        ? PacketType.BINARY_EVENT
                        : PacketType.BINARY_ACK;
                return this.encodeAsBinary(obj);
            }
        }
        return [this.encodeAsString(obj)];
    }
    /**
     * Encode packet as string.
     */
    encodeAsString(obj) {
        // first is type
        let str = "" + obj.type;
        // attachments if we have them
        if (obj.type === PacketType.BINARY_EVENT ||
            obj.type === PacketType.BINARY_ACK) {
            str += obj.attachments + "-";
        }
        // if we have a namespace other than `/`
        // we append it followed by a comma `,`
        if (obj.nsp && "/" !== obj.nsp) {
            str += obj.nsp + ",";
        }
        // immediately followed by the id
        if (null != obj.id) {
            str += obj.id;
        }
        // json data
        if (null != obj.data) {
            str += JSON.stringify(obj.data, this.replacer);
        }
        debug("encoded %j as %s", obj, str);
        return str;
    }
    /**
     * Encode packet as 'buffer sequence' by removing blobs, and
     * deconstructing packet into object with placeholders and
     * a list of buffers.
     */
    encodeAsBinary(obj) {
        const deconstruction = binary_js_1.deconstructPacket(obj);
        const pack = this.encodeAsString(deconstruction.packet);
        const buffers = deconstruction.buffers;
        buffers.unshift(pack); // add packet info to beginning of data list
        return buffers; // write all the buffers
    }
}
exports.Encoder = Encoder;
/**
 * A socket.io Decoder instance
 *
 * @return {Object} decoder
 */
class Decoder extends component_emitter_1.Emitter {
    /**
     * Decoder constructor
     *
     * @param {function} reviver - custom reviver to pass down to JSON.stringify
     */
    constructor(reviver) {
        super();
        this.reviver = reviver;
    }
    /**
     * Decodes an encoded packet string into packet JSON.
     *
     * @param {String} obj - encoded packet
     */
    add(obj) {
        let packet;
        if (typeof obj === "string") {
            packet = this.decodeString(obj);
            if (packet.type === PacketType.BINARY_EVENT ||
                packet.type === PacketType.BINARY_ACK) {
                // binary packet's json
                this.reconstructor = new BinaryReconstructor(packet);
                // no attachments, labeled binary but no binary data to follow
                if (packet.attachments === 0) {
                    super.emitReserved("decoded", packet);
                }
            }
            else {
                // non-binary full packet
                super.emitReserved("decoded", packet);
            }
        }
        else if (is_binary_js_1.isBinary(obj) || obj.base64) {
            // raw binary data
            if (!this.reconstructor) {
                throw new Error("got binary data when not reconstructing a packet");
            }
            else {
                packet = this.reconstructor.takeBinaryData(obj);
                if (packet) {
                    // received final buffer
                    this.reconstructor = null;
                    super.emitReserved("decoded", packet);
                }
            }
        }
        else {
            throw new Error("Unknown type: " + obj);
        }
    }
    /**
     * Decode a packet String (JSON data)
     *
     * @param {String} str
     * @return {Object} packet
     */
    decodeString(str) {
        let i = 0;
        // look up type
        const p = {
            type: Number(str.charAt(0)),
        };
        if (PacketType[p.type] === undefined) {
            throw new Error("unknown packet type " + p.type);
        }
        // look up attachments if type binary
        if (p.type === PacketType.BINARY_EVENT ||
            p.type === PacketType.BINARY_ACK) {
            const start = i + 1;
            while (str.charAt(++i) !== "-" && i != str.length) { }
            const buf = str.substring(start, i);
            if (buf != Number(buf) || str.charAt(i) !== "-") {
                throw new Error("Illegal attachments");
            }
            p.attachments = Number(buf);
        }
        // look up namespace (if any)
        if ("/" === str.charAt(i + 1)) {
            const start = i + 1;
            while (++i) {
                const c = str.charAt(i);
                if ("," === c)
                    break;
                if (i === str.length)
                    break;
            }
            p.nsp = str.substring(start, i);
        }
        else {
            p.nsp = "/";
        }
        // look up id
        const next = str.charAt(i + 1);
        if ("" !== next && Number(next) == next) {
            const start = i + 1;
            while (++i) {
                const c = str.charAt(i);
                if (null == c || Number(c) != c) {
                    --i;
                    break;
                }
                if (i === str.length)
                    break;
            }
            p.id = Number(str.substring(start, i + 1));
        }
        // look up json data
        if (str.charAt(++i)) {
            const payload = this.tryParse(str.substr(i));
            if (Decoder.isPayloadValid(p.type, payload)) {
                p.data = payload;
            }
            else {
                throw new Error("invalid payload");
            }
        }
        debug("decoded %s as %j", str, p);
        return p;
    }
    tryParse(str) {
        try {
            return JSON.parse(str, this.reviver);
        }
        catch (e) {
            return false;
        }
    }
    static isPayloadValid(type, payload) {
        switch (type) {
            case PacketType.CONNECT:
                return typeof payload === "object";
            case PacketType.DISCONNECT:
                return payload === undefined;
            case PacketType.CONNECT_ERROR:
                return typeof payload === "string" || typeof payload === "object";
            case PacketType.EVENT:
            case PacketType.BINARY_EVENT:
                return Array.isArray(payload) && payload.length > 0;
            case PacketType.ACK:
            case PacketType.BINARY_ACK:
                return Array.isArray(payload);
        }
    }
    /**
     * Deallocates a parser's resources
     */
    destroy() {
        if (this.reconstructor) {
            this.reconstructor.finishedReconstruction();
        }
    }
}
exports.Decoder = Decoder;
/**
 * A manager of a binary event's 'buffer sequence'. Should
 * be constructed whenever a packet of type BINARY_EVENT is
 * decoded.
 *
 * @param {Object} packet
 * @return {BinaryReconstructor} initialized reconstructor
 */
class BinaryReconstructor {
    constructor(packet) {
        this.packet = packet;
        this.buffers = [];
        this.reconPack = packet;
    }
    /**
     * Method to be called when binary data received from connection
     * after a BINARY_EVENT packet.
     *
     * @param {Buffer | ArrayBuffer} binData - the raw binary data received
     * @return {null | Object} returns null if more binary data is expected or
     *   a reconstructed packet object if all buffers have been received.
     */
    takeBinaryData(binData) {
        this.buffers.push(binData);
        if (this.buffers.length === this.reconPack.attachments) {
            // done with buffer list
            const packet = binary_js_1.reconstructPacket(this.reconPack, this.buffers);
            this.finishedReconstruction();
            return packet;
        }
        return null;
    }
    /**
     * Cleans up binary packet reconstruction variables.
     */
    finishedReconstruction() {
        this.reconPack = null;
        this.buffers = [];
    }
}

},{"./binary.js":84,"./is-binary.js":86,"@socket.io/component-emitter":1,"debug":81}],86:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasBinary = exports.isBinary = void 0;
const withNativeArrayBuffer = typeof ArrayBuffer === "function";
const isView = (obj) => {
    return typeof ArrayBuffer.isView === "function"
        ? ArrayBuffer.isView(obj)
        : obj.buffer instanceof ArrayBuffer;
};
const toString = Object.prototype.toString;
const withNativeBlob = typeof Blob === "function" ||
    (typeof Blob !== "undefined" &&
        toString.call(Blob) === "[object BlobConstructor]");
const withNativeFile = typeof File === "function" ||
    (typeof File !== "undefined" &&
        toString.call(File) === "[object FileConstructor]");
/**
 * Returns true if obj is a Buffer, an ArrayBuffer, a Blob or a File.
 *
 * @private
 */
function isBinary(obj) {
    return ((withNativeArrayBuffer && (obj instanceof ArrayBuffer || isView(obj))) ||
        (withNativeBlob && obj instanceof Blob) ||
        (withNativeFile && obj instanceof File));
}
exports.isBinary = isBinary;
function hasBinary(obj, toJSON) {
    if (!obj || typeof obj !== "object") {
        return false;
    }
    if (Array.isArray(obj)) {
        for (let i = 0, l = obj.length; i < l; i++) {
            if (hasBinary(obj[i])) {
                return true;
            }
        }
        return false;
    }
    if (isBinary(obj)) {
        return true;
    }
    if (obj.toJSON &&
        typeof obj.toJSON === "function" &&
        arguments.length === 1) {
        return hasBinary(obj.toJSON(), true);
    }
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key) && hasBinary(obj[key])) {
            return true;
        }
    }
    return false;
}
exports.hasBinary = hasBinary;

},{}],87:[function(require,module,exports){
"use strict"; // const graph = parse(Graph, gexf);

exports.__esModule = true;

var sigma_1 = require("sigma");

var io = require("socket.io-client");

var graphology_layout_1 = require("graphology-layout");

var graphology_layout_forceatlas2_1 = require("graphology-layout-forceatlas2");

var Graph = require("graphology");

var container = document.getElementById("sigma-container");
var zoomInBtn = document.getElementById("zoom-in");
var zoomOutBtn = document.getElementById("zoom-out");
var zoomResetBtn = document.getElementById("zoom-reset");
var labelsThresholdRange = document.getElementById("labels-threshold");
var socket = io.io();
socket.on('connection', function (data) {
  console.log('hello there'); // let graph: AbstractGraph = data;

  var graph = new Graph.DirectedGraph();
  graph["import"](data);
  graphology_layout_1.random.assign(graph);
  var settings = graphology_layout_forceatlas2_1["default"].inferSettings(graph); // const fa2Layout = new FA2Layout(graph, { settings: settings })

  graphology_layout_forceatlas2_1["default"].assign(graph, {
    iterations: 50,
    settings: settings
  });
  console.log(graph);
  var renderer = new sigma_1.Sigma(graph, container, {
    minCameraRatio: 0.1,
    maxCameraRatio: 10
  });
  var camera = renderer.getCamera(); // Bind zoom manipulation buttons

  zoomInBtn.addEventListener("click", function () {
    camera.animatedZoom({
      duration: 600
    });
  });
  zoomOutBtn.addEventListener("click", function () {
    camera.animatedUnzoom({
      duration: 600
    });
  });
  zoomResetBtn.addEventListener("click", function () {
    camera.animatedReset({
      duration: 600
    });
  }); // Bind labels threshold to range input

  labelsThresholdRange.addEventListener("input", function () {
    renderer.setSetting("labelRenderedSizeThreshold", +labelsThresholdRange.value);
  }); // Set proper range initial value:

  labelsThresholdRange.value = renderer.getSetting("labelRenderedSizeThreshold") + "";
});

},{"graphology":37,"graphology-layout":31,"graphology-layout-forceatlas2":27,"sigma":46,"socket.io-client":76}],88:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}

},{}],89:[function(require,module,exports){
(function (Buffer){(function (){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = { __proto__: Uint8Array.prototype, foo: function () { return 42 } }
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  buf.__proto__ = Buffer.prototype
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species != null &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayLike(value)
  }

  if (value == null) {
    throw TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  var valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  var b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(
      value[Symbol.toPrimitive]('string'), encodingOrOffset, length
    )
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype
  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      buf = Buffer.from(buf)
    }
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  var len = string.length
  var mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  var strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
        : (firstByte > 0xBF) ? 2
          : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype
  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (var i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    var len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

}).call(this)}).call(this,require("buffer").Buffer)
},{"base64-js":88,"buffer":89,"ieee754":91}],90:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
}

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;
module.exports.once = once;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  checkListener(listener);

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      checkListener(listener);

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    };

    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
    }
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}

},{}],91:[function(require,module,exports){
/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],92:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[87]);
