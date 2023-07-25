(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('react')) :
  typeof define === 'function' && define.amd ? define('@mangkodir-ui/button_test', ['react'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global["@mangkodir-ui/button_test"] = factory(global.React));
})(this, (function (React) { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }

  function _interopDefaultLegacy(e) {
    return e && _typeof(e) === 'object' && 'default' in e ? e : {
      'default': e
    };
  }
  var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

  /*
  Based on Glamor's sheet
  https://github.com/threepointone/glamor/blob/667b480d31b3721a905021b26e1290ce92ca2879/src/sheet.js
  */
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }
  var isProd = typeof process !== "undefined" && process.env && process.env.NODE_ENV === "production";
  var isString = function isString(o) {
    return Object.prototype.toString.call(o) === "[object String]";
  };
  var StyleSheet = /*#__PURE__*/function () {
    function StyleSheet(param) {
      var ref = param === void 0 ? {} : param,
        _name = ref.name,
        name = _name === void 0 ? "stylesheet" : _name,
        _optimizeForSpeed = ref.optimizeForSpeed,
        optimizeForSpeed = _optimizeForSpeed === void 0 ? isProd : _optimizeForSpeed;
      invariant$1(isString(name), "`name` must be a string");
      this._name = name;
      this._deletedRulePlaceholder = "#" + name + "-deleted-rule____{}";
      invariant$1(typeof optimizeForSpeed === "boolean", "`optimizeForSpeed` must be a boolean");
      this._optimizeForSpeed = optimizeForSpeed;
      this._serverSheet = undefined;
      this._tags = [];
      this._injected = false;
      this._rulesCount = 0;
      var node = typeof window !== "undefined" && document.querySelector('meta[property="csp-nonce"]');
      this._nonce = node ? node.getAttribute("content") : null;
    }
    var _proto = StyleSheet.prototype;
    _proto.setOptimizeForSpeed = function setOptimizeForSpeed(bool) {
      invariant$1(typeof bool === "boolean", "`setOptimizeForSpeed` accepts a boolean");
      invariant$1(this._rulesCount === 0, "optimizeForSpeed cannot be when rules have already been inserted");
      this.flush();
      this._optimizeForSpeed = bool;
      this.inject();
    };
    _proto.isOptimizeForSpeed = function isOptimizeForSpeed() {
      return this._optimizeForSpeed;
    };
    _proto.inject = function inject() {
      var _this = this;
      invariant$1(!this._injected, "sheet already injected");
      this._injected = true;
      if (typeof window !== "undefined" && this._optimizeForSpeed) {
        this._tags[0] = this.makeStyleTag(this._name);
        this._optimizeForSpeed = "insertRule" in this.getSheet();
        if (!this._optimizeForSpeed) {
          if (!isProd) {
            console.warn("StyleSheet: optimizeForSpeed mode not supported falling back to standard mode.");
          }
          this.flush();
          this._injected = true;
        }
        return;
      }
      this._serverSheet = {
        cssRules: [],
        insertRule: function insertRule(rule, index) {
          if (typeof index === "number") {
            _this._serverSheet.cssRules[index] = {
              cssText: rule
            };
          } else {
            _this._serverSheet.cssRules.push({
              cssText: rule
            });
          }
          return index;
        },
        deleteRule: function deleteRule(index) {
          _this._serverSheet.cssRules[index] = null;
        }
      };
    };
    _proto.getSheetForTag = function getSheetForTag(tag) {
      if (tag.sheet) {
        return tag.sheet;
      }
      // this weirdness brought to you by firefox
      for (var i = 0; i < document.styleSheets.length; i++) {
        if (document.styleSheets[i].ownerNode === tag) {
          return document.styleSheets[i];
        }
      }
    };
    _proto.getSheet = function getSheet() {
      return this.getSheetForTag(this._tags[this._tags.length - 1]);
    };
    _proto.insertRule = function insertRule(rule, index) {
      invariant$1(isString(rule), "`insertRule` accepts only strings");
      if (typeof window === "undefined") {
        if (typeof index !== "number") {
          index = this._serverSheet.cssRules.length;
        }
        this._serverSheet.insertRule(rule, index);
        return this._rulesCount++;
      }
      if (this._optimizeForSpeed) {
        var sheet = this.getSheet();
        if (typeof index !== "number") {
          index = sheet.cssRules.length;
        }
        // this weirdness for perf, and chrome's weird bug
        // https://stackoverflow.com/questions/20007992/chrome-suddenly-stopped-accepting-insertrule
        try {
          sheet.insertRule(rule, index);
        } catch (error) {
          if (!isProd) {
            console.warn("StyleSheet: illegal rule: \n\n" + rule + "\n\nSee https://stackoverflow.com/q/20007992 for more info");
          }
          return -1;
        }
      } else {
        var insertionPoint = this._tags[index];
        this._tags.push(this.makeStyleTag(this._name, rule, insertionPoint));
      }
      return this._rulesCount++;
    };
    _proto.replaceRule = function replaceRule(index, rule) {
      if (this._optimizeForSpeed || typeof window === "undefined") {
        var sheet = typeof window !== "undefined" ? this.getSheet() : this._serverSheet;
        if (!rule.trim()) {
          rule = this._deletedRulePlaceholder;
        }
        if (!sheet.cssRules[index]) {
          // @TBD Should we throw an error?
          return index;
        }
        sheet.deleteRule(index);
        try {
          sheet.insertRule(rule, index);
        } catch (error) {
          if (!isProd) {
            console.warn("StyleSheet: illegal rule: \n\n" + rule + "\n\nSee https://stackoverflow.com/q/20007992 for more info");
          }
          // In order to preserve the indices we insert a deleteRulePlaceholder
          sheet.insertRule(this._deletedRulePlaceholder, index);
        }
      } else {
        var tag = this._tags[index];
        invariant$1(tag, "old rule at index `" + index + "` not found");
        tag.textContent = rule;
      }
      return index;
    };
    _proto.deleteRule = function deleteRule(index) {
      if (typeof window === "undefined") {
        this._serverSheet.deleteRule(index);
        return;
      }
      if (this._optimizeForSpeed) {
        this.replaceRule(index, "");
      } else {
        var tag = this._tags[index];
        invariant$1(tag, "rule at index `" + index + "` not found");
        tag.parentNode.removeChild(tag);
        this._tags[index] = null;
      }
    };
    _proto.flush = function flush() {
      this._injected = false;
      this._rulesCount = 0;
      if (typeof window !== "undefined") {
        this._tags.forEach(function (tag) {
          return tag && tag.parentNode.removeChild(tag);
        });
        this._tags = [];
      } else {
        // simpler on server
        this._serverSheet.cssRules = [];
      }
    };
    _proto.cssRules = function cssRules() {
      var _this = this;
      if (typeof window === "undefined") {
        return this._serverSheet.cssRules;
      }
      return this._tags.reduce(function (rules, tag) {
        if (tag) {
          rules = rules.concat(Array.prototype.map.call(_this.getSheetForTag(tag).cssRules, function (rule) {
            return rule.cssText === _this._deletedRulePlaceholder ? null : rule;
          }));
        } else {
          rules.push(null);
        }
        return rules;
      }, []);
    };
    _proto.makeStyleTag = function makeStyleTag(name, cssString, relativeToTag) {
      if (cssString) {
        invariant$1(isString(cssString), "makeStyleTag accepts only strings as second parameter");
      }
      var tag = document.createElement("style");
      if (this._nonce) tag.setAttribute("nonce", this._nonce);
      tag.type = "text/css";
      tag.setAttribute("data-" + name, "");
      if (cssString) {
        tag.appendChild(document.createTextNode(cssString));
      }
      var head = document.head || document.getElementsByTagName("head")[0];
      if (relativeToTag) {
        head.insertBefore(tag, relativeToTag);
      } else {
        head.appendChild(tag);
      }
      return tag;
    };
    _createClass(StyleSheet, [{
      key: "length",
      get: function get() {
        return this._rulesCount;
      }
    }]);
    return StyleSheet;
  }();
  function invariant$1(condition, message) {
    if (!condition) {
      throw new Error("StyleSheet: " + message + ".");
    }
  }
  function hash(str) {
    var _$hash = 5381,
      i = str.length;
    while (i) {
      _$hash = _$hash * 33 ^ str.charCodeAt(--i);
    }
    /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
    * integers. Since we want the results to be always positive, convert the
    * signed int to an unsigned by doing an unsigned bitshift. */
    return _$hash >>> 0;
  }
  var stringHash = hash;
  var sanitize = function sanitize(rule) {
    return rule.replace(/\/style/gi, "\\/style");
  };
  var cache = {};
  /**
   * computeId
   *
   * Compute and memoize a jsx id from a basedId and optionally props.
   */
  function computeId(baseId, props) {
    if (!props) {
      return "jsx-" + baseId;
    }
    var propsToString = String(props);
    var key = baseId + propsToString;
    if (!cache[key]) {
      cache[key] = "jsx-" + stringHash(baseId + "-" + propsToString);
    }
    return cache[key];
  }
  /**
   * computeSelector
   *
   * Compute and memoize dynamic selectors.
   */
  function computeSelector(id, css) {
    var selectoPlaceholderRegexp = /__jsx-style-dynamic-selector/g;
    // Sanitize SSR-ed CSS.
    // Client side code doesn't need to be sanitized since we use
    // document.createTextNode (dev) and the CSSOM api sheet.insertRule (prod).
    if (typeof window === "undefined") {
      css = sanitize(css);
    }
    var idcss = id + css;
    if (!cache[idcss]) {
      cache[idcss] = css.replace(selectoPlaceholderRegexp, id);
    }
    return cache[idcss];
  }
  function mapRulesToStyle(cssRules, options) {
    if (options === void 0) options = {};
    return cssRules.map(function (args) {
      var id = args[0];
      var css = args[1];
      return /*#__PURE__*/React__default["default"].createElement("style", {
        id: "__" + id,
        // Avoid warnings upon render with a key
        key: "__" + id,
        nonce: options.nonce ? options.nonce : undefined,
        dangerouslySetInnerHTML: {
          __html: css
        }
      });
    });
  }
  var StyleSheetRegistry = /*#__PURE__*/function () {
    function StyleSheetRegistry(param) {
      var ref = param === void 0 ? {} : param,
        _styleSheet = ref.styleSheet,
        styleSheet = _styleSheet === void 0 ? null : _styleSheet,
        _optimizeForSpeed = ref.optimizeForSpeed,
        optimizeForSpeed = _optimizeForSpeed === void 0 ? false : _optimizeForSpeed;
      this._sheet = styleSheet || new StyleSheet({
        name: "styled-jsx",
        optimizeForSpeed: optimizeForSpeed
      });
      this._sheet.inject();
      if (styleSheet && typeof optimizeForSpeed === "boolean") {
        this._sheet.setOptimizeForSpeed(optimizeForSpeed);
        this._optimizeForSpeed = this._sheet.isOptimizeForSpeed();
      }
      this._fromServer = undefined;
      this._indices = {};
      this._instancesCounts = {};
    }
    var _proto = StyleSheetRegistry.prototype;
    _proto.add = function add(props) {
      var _this = this;
      if (undefined === this._optimizeForSpeed) {
        this._optimizeForSpeed = Array.isArray(props.children);
        this._sheet.setOptimizeForSpeed(this._optimizeForSpeed);
        this._optimizeForSpeed = this._sheet.isOptimizeForSpeed();
      }
      if (typeof window !== "undefined" && !this._fromServer) {
        this._fromServer = this.selectFromServer();
        this._instancesCounts = Object.keys(this._fromServer).reduce(function (acc, tagName) {
          acc[tagName] = 0;
          return acc;
        }, {});
      }
      var ref = this.getIdAndRules(props),
        styleId = ref.styleId,
        rules = ref.rules;
      // Deduping: just increase the instances count.
      if (styleId in this._instancesCounts) {
        this._instancesCounts[styleId] += 1;
        return;
      }
      var indices = rules.map(function (rule) {
        return _this._sheet.insertRule(rule);
      }) // Filter out invalid rules
      .filter(function (index) {
        return index !== -1;
      });
      this._indices[styleId] = indices;
      this._instancesCounts[styleId] = 1;
    };
    _proto.remove = function remove(props) {
      var _this = this;
      var styleId = this.getIdAndRules(props).styleId;
      invariant(styleId in this._instancesCounts, "styleId: `" + styleId + "` not found");
      this._instancesCounts[styleId] -= 1;
      if (this._instancesCounts[styleId] < 1) {
        var tagFromServer = this._fromServer && this._fromServer[styleId];
        if (tagFromServer) {
          tagFromServer.parentNode.removeChild(tagFromServer);
          delete this._fromServer[styleId];
        } else {
          this._indices[styleId].forEach(function (index) {
            return _this._sheet.deleteRule(index);
          });
          delete this._indices[styleId];
        }
        delete this._instancesCounts[styleId];
      }
    };
    _proto.update = function update(props, nextProps) {
      this.add(nextProps);
      this.remove(props);
    };
    _proto.flush = function flush() {
      this._sheet.flush();
      this._sheet.inject();
      this._fromServer = undefined;
      this._indices = {};
      this._instancesCounts = {};
    };
    _proto.cssRules = function cssRules() {
      var _this = this;
      var fromServer = this._fromServer ? Object.keys(this._fromServer).map(function (styleId) {
        return [styleId, _this._fromServer[styleId]];
      }) : [];
      var cssRules = this._sheet.cssRules();
      return fromServer.concat(Object.keys(this._indices).map(function (styleId) {
        return [styleId, _this._indices[styleId].map(function (index) {
          return cssRules[index].cssText;
        }).join(_this._optimizeForSpeed ? "" : "\n")];
      }) // filter out empty rules
      .filter(function (rule) {
        return Boolean(rule[1]);
      }));
    };
    _proto.styles = function styles(options) {
      return mapRulesToStyle(this.cssRules(), options);
    };
    _proto.getIdAndRules = function getIdAndRules(props) {
      var css = props.children,
        dynamic = props.dynamic,
        id = props.id;
      if (dynamic) {
        var styleId = computeId(id, dynamic);
        return {
          styleId: styleId,
          rules: Array.isArray(css) ? css.map(function (rule) {
            return computeSelector(styleId, rule);
          }) : [computeSelector(styleId, css)]
        };
      }
      return {
        styleId: computeId(id),
        rules: Array.isArray(css) ? css : [css]
      };
    };
    /**
    * selectFromServer
    *
    * Collects style tags from the document with id __jsx-XXX
    */
    _proto.selectFromServer = function selectFromServer() {
      var elements = Array.prototype.slice.call(document.querySelectorAll('[id^="__jsx-"]'));
      return elements.reduce(function (acc, element) {
        var id = element.id.slice(2);
        acc[id] = element;
        return acc;
      }, {});
    };
    return StyleSheetRegistry;
  }();
  function invariant(condition, message) {
    if (!condition) {
      throw new Error("StyleSheetRegistry: " + message + ".");
    }
  }
  var StyleSheetContext = /*#__PURE__*/React.createContext(null);
  StyleSheetContext.displayName = "StyleSheetContext";
  function createStyleRegistry() {
    return new StyleSheetRegistry();
  }
  function StyleRegistry(param) {
    var configuredRegistry = param.registry,
      children = param.children;
    var rootRegistry = React.useContext(StyleSheetContext);
    var ref = React.useState(function () {
        return rootRegistry || configuredRegistry || createStyleRegistry();
      }),
      registry = ref[0];
    return /*#__PURE__*/React__default["default"].createElement(StyleSheetContext.Provider, {
      value: registry
    }, children);
  }
  function useStyleRegistry() {
    return React.useContext(StyleSheetContext);
  }

  // Opt-into the new `useInsertionEffect` API in React 18, fallback to `useLayoutEffect`.
  // https://github.com/reactwg/react-18/discussions/110
  var useInsertionEffect = React__default["default"].useInsertionEffect || React__default["default"].useLayoutEffect;
  var defaultRegistry = typeof window !== "undefined" ? createStyleRegistry() : undefined;
  function JSXStyle(props) {
    var registry = defaultRegistry ? defaultRegistry : useStyleRegistry();
    // If `registry` does not exist, we do nothing here.
    if (!registry) {
      return null;
    }
    if (typeof window === "undefined") {
      registry.add(props);
      return null;
    }
    useInsertionEffect(function () {
      registry.add(props);
      return function () {
        registry.remove(props);
      };
      // props.children can be string[], will be striped since id is identical
    }, [props.id, String(props.dynamic)]);
    return null;
  }
  JSXStyle.dynamic = function (info) {
    return info.map(function (tagInfo) {
      var baseId = tagInfo[0];
      var props = tagInfo[1];
      return computeId(baseId, props);
    }).join(" ");
  };
  var StyleRegistry_1 = StyleRegistry;
  var createStyleRegistry_1 = createStyleRegistry;
  var style$1 = JSXStyle;
  var useStyleRegistry_1 = useStyleRegistry;
  var index = {
    StyleRegistry: StyleRegistry_1,
    createStyleRegistry: createStyleRegistry_1,
    style: style$1,
    useStyleRegistry: useStyleRegistry_1
  };

  var style = index.style;

  var btnStyle = {
    "btn-blue": "\n    background: linear-gradient(\n        102deg,\n        rgb(0, 196, 255) 0%,\n        rgb(0, 153, 255) 100%\n      );\n      color: #fff;\n      box-shadow: rgba(9, 172, 255, 0.518) 0.3981px 0.3981px 0.56299px -0.9375px,\n        rgba(9, 172, 255, 0.49) 1.20725px 1.20725px 1.70731px -1.875px,\n        rgba(9, 172, 255, 0.42) 3.19133px 3.19133px 4.51322px -2.8125px,\n        rgba(9, 172, 255, 0.176) 10px 10px 14.1421px -3.75px;\n    "
  };
  function ButtonTest(_ref) {
    var children = _ref.children,
      type = _ref.type,
      href = _ref.href,
      style$1 = _ref.style;
    var className = type ? "btn-".concat(type) : "btn";
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
      href: href,
      style: style$1,
      className: style.dynamic([["1120723535", [className ? ".".concat(className, " {\n            ").concat(btnStyle[className], "\n          }") : ""]]]) + " " + (className || "")
    }, children), /*#__PURE__*/React.createElement(style, {
      id: "1120723535",
      dynamic: [className ? ".".concat(className, " {\n            ").concat(btnStyle[className], "\n          }") : ""]
    }, ".__jsx-style-dynamic-selector{".concat(className ? ".".concat(className, " {\n            ").concat(btnStyle[className], "\n          }") : "", ";}button.__jsx-style-dynamic-selector{height:100%;opacity:1;padding:14px 16px;border:0;border-radius:12px;cursor:pointer;}\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJ1dHRvbl90ZXN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQXVCUyxBQUd5QixBQVFqQixZQVBlLFVBQ1EsT0FNdEIsV0FMYSxTQUNVLG1CQUNKLGVBQ2pCIiwiZmlsZSI6ImJ1dHRvbl90ZXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuXG5jb25zdCBidG5TdHlsZSA9IHtcbiAgXCJidG4tYmx1ZVwiOiBgXG4gICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KFxuICAgICAgICAxMDJkZWcsXG4gICAgICAgIHJnYigwLCAxOTYsIDI1NSkgMCUsXG4gICAgICAgIHJnYigwLCAxNTMsIDI1NSkgMTAwJVxuICAgICAgKTtcbiAgICAgIGNvbG9yOiAjZmZmO1xuICAgICAgYm94LXNoYWRvdzogcmdiYSg5LCAxNzIsIDI1NSwgMC41MTgpIDAuMzk4MXB4IDAuMzk4MXB4IDAuNTYyOTlweCAtMC45Mzc1cHgsXG4gICAgICAgIHJnYmEoOSwgMTcyLCAyNTUsIDAuNDkpIDEuMjA3MjVweCAxLjIwNzI1cHggMS43MDczMXB4IC0xLjg3NXB4LFxuICAgICAgICByZ2JhKDksIDE3MiwgMjU1LCAwLjQyKSAzLjE5MTMzcHggMy4xOTEzM3B4IDQuNTEzMjJweCAtMi44MTI1cHgsXG4gICAgICAgIHJnYmEoOSwgMTcyLCAyNTUsIDAuMTc2KSAxMHB4IDEwcHggMTQuMTQyMXB4IC0zLjc1cHg7XG4gICAgYCxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEJ1dHRvblRlc3QoeyBjaGlsZHJlbiwgdHlwZSwgaHJlZiwgc3R5bGUgfSkge1xuICBjb25zdCBjbGFzc05hbWUgPSB0eXBlID8gYGJ0bi0ke3R5cGV9YCA6IFwiYnRuXCI7XG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIDxidXR0b24gY2xhc3NOYW1lPXtjbGFzc05hbWV9IHsuLi57aHJlZiwgc3R5bGV9fT57Y2hpbGRyZW59PC9idXR0b24+XG4gICAgICA8c3R5bGUganN4PlxuICAgICAgICB7YFxuICAgICAgICAgIGJ1dHRvbiB7XG4gICAgICAgICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgICAgICAgICBvcGFjaXR5OiAxO1xuICAgICAgICAgICAgcGFkZGluZzogMTRweCAxNnB4O1xuICAgICAgICAgICAgYm9yZGVyOiAwO1xuICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMTJweDtcbiAgICAgICAgICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICAgICAgICB9XG4gICAgICAgICAgJHtjbGFzc05hbWUgP2AuJHtjbGFzc05hbWV9IHtcbiAgICAgICAgICAgICR7YnRuU3R5bGVbY2xhc3NOYW1lXX1cbiAgICAgICAgICB9YDogXCJcIn1cbiAgICAgICAgYH1cbiAgICAgIDwvc3R5bGU+XG4gICAgPC8+XG4gICk7XG59XG4iXX0= */\n/*@ sourceURL=button_test.js */")));
  }

  return ButtonTest;

}));
//# sourceMappingURL=button_test.umd.js.map
