import Dt, { forwardRef as $t, useRef as he, useMemo as Rt, useCallback as et, useLayoutEffect as wt, useEffect as zt, useImperativeHandle as Wt } from "react";
import { ButtonIcon as Me, Toggle as Xt } from "@blue-orange-ai/foundations-core";
var re = /* @__PURE__ */ ((r) => (r.SELECTION = "selection", r.PAN = "pan", r.NON_INTERACTIVE_PAN = "nonInteractivePan", r.ZOOM = "zoom", r.NONE = "none", r))(re || {}), $e = /* @__PURE__ */ ((r) => (r.RELATIVE = "relative", r.ABSOLUTE = "absolute", r))($e || {}), pt = /* @__PURE__ */ ((r) => (r.RHOMB = "rhomb", r.CIRCLE = "circle", r.RECT = "rect", r))(pt || {}), ve = /* @__PURE__ */ ((r) => (r.KEYFRAME = "keyframe", r.GROUP = "group", r.ROW = "row", r.TIMELINE = "timeline", r))(ve || {});
const _e = (r, a, s) => a > s ? r : Math.min(Math.max(r, a), s), ce = {
  zoom: 1,
  zoomMin: 0.01,
  // Wide enough to zoom from milliseconds out to a multi-year date span, so
  // ABSOLUTE mode works without a bespoke bound. Harmless for RELATIVE mode.
  zoomMax: 1e9,
  zoomSpeed: 0.15,
  min: 0,
  timeMode: $e.RELATIVE,
  headerHeight: 30,
  leftMargin: 18,
  labelsWidth: 0,
  rowsStyle: { height: 24, marginBottom: 2 },
  keyframesDraggable: !0,
  groupsDraggable: !0,
  timelineDraggable: !0,
  snapStep: 0,
  snapEnabled: !1,
  stepPx: 120,
  interactionMode: re.SELECTION,
  keyframesStyle: { shape: pt.RHOMB, size: 6 }
}, Vt = (r, a) => {
  var d, u;
  return r.height ?? ((d = r.style) == null ? void 0 : d.height) ?? ((u = a.rowsStyle) == null ? void 0 : u.height) ?? ce.rowsStyle.height;
}, tt = (r, a) => {
  var C;
  const s = ((C = a.rowsStyle) == null ? void 0 : C.marginBottom) ?? ce.rowsStyle.marginBottom, d = [], u = [];
  let g = 0;
  for (let b = 0; b < r.rows.length; b++) {
    const y = r.rows[b];
    if (y.hidden) {
      d.push(g), u.push(0);
      continue;
    }
    const H = Vt(y, a);
    d.push(g), u.push(H), g += H + s;
  }
  return { offsets: d, heights: u, total: g };
}, Q = (r, a, s, d) => s + (r - d) / a, Pe = (r, a, s, d) => (r - s) * a + d, It = (r) => {
  if (!isFinite(r) || r <= 0)
    return 1;
  const a = Math.floor(Math.log10(r)), s = Math.pow(10, a), d = r / s;
  let u;
  return d <= 1 ? u = 1 : d <= 2 ? u = 2 : d <= 5 ? u = 5 : u = 10, u * s;
}, Bt = (r, a) => It(a * r), Ht = (r, a, s) => {
  if (s <= 0 || !isFinite(s) || a < r)
    return [];
  const d = [], u = Math.floor(r / s) * s, g = 1e4;
  let C = 0;
  for (let b = u; b <= a && C < g; b += s, C++)
    d.push(Math.round(b / s) * s);
  return d;
}, Ct = (r, a, s) => !s || a <= 0 ? r : Math.round(r / a) * a, Ut = (r) => r >= 1 ? 0 : Math.min(6, Math.ceil(-Math.log10(r))), Nt = (r, a) => {
  const s = r / 1e3, d = a / 1e3;
  if (d < 1) {
    const u = Ut(d);
    return `${s.toFixed(u)}s`;
  }
  if (Math.abs(s) >= 60) {
    const u = s < 0 ? "-" : "", g = Math.abs(s), C = Math.floor(g / 60), b = g - C * 60, y = b < 10 ? `0${b.toFixed(0)}` : b.toFixed(0);
    return `${u}${C}:${y}`;
  }
  return `${s.toFixed(0)}s`;
}, Et = [
  1,
  2,
  5,
  10,
  20,
  50,
  100,
  200,
  500,
  // sub-second
  1e3,
  2e3,
  5e3,
  1e4,
  15e3,
  3e4,
  // seconds
  6e4,
  12e4,
  3e5,
  6e5,
  9e5,
  18e5,
  // minutes
  36e5,
  72e5,
  108e5,
  216e5,
  432e5,
  // hours
  864e5,
  1728e5,
  6048e5,
  // days / week
  2592e6,
  7776e6,
  // ~month / ~quarter (30 / 90 days)
  31536e6
  // ~year (365 days)
], Tt = 31536e6, Gt = (r) => {
  if (!isFinite(r) || r <= 0)
    return 1;
  for (let a = 0; a < Et.length; a++)
    if (Et[a] >= r)
      return Et[a];
  return It(r / Tt) * Tt;
}, Jt = (r, a) => Gt(a * r), St = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], Oe = (r) => r < 10 ? "0" + r : "" + r, Zt = (r) => r < 10 ? "00" + r : r < 100 ? "0" + r : "" + r, Ft = (r, a) => {
  const s = new Date(r);
  return a < 1e3 ? `${Oe(s.getHours())}:${Oe(s.getMinutes())}:${Oe(s.getSeconds())}.${Zt(
    s.getMilliseconds()
  )}` : a < 6e4 ? `${Oe(s.getHours())}:${Oe(s.getMinutes())}:${Oe(s.getSeconds())}` : a < 864e5 ? `${Oe(s.getHours())}:${Oe(s.getMinutes())}` : a < 2592e6 ? `${St[s.getMonth()]} ${s.getDate()}` : a < Tt ? `${St[s.getMonth()]} ${s.getFullYear()}` : `${s.getFullYear()}`;
}, Mt = (r, a) => {
  let s = 1 / 0, d = -1 / 0, u = !1;
  for (let g = 0; g < r.rows.length; g++) {
    const C = r.rows[g].keyframes;
    if (C)
      for (let b = 0; b < C.length; b++) {
        const y = C[b].val;
        a !== void 0 && y > a || (y < s && (s = y), y > d && (d = y), u = !0);
      }
  }
  return u ? { min: s, max: d } : null;
}, gt = (r) => r === $e.ABSOLUTE, _t = (r, a, s, d) => {
  var H;
  const u = r.group ? Kt(a, r.group) : void 0, g = r.style, C = u == null ? void 0 : u.style, b = (H = a.style) == null ? void 0 : H.keyframesStyle, y = s.keyframesStyle;
  return {
    shape: (g == null ? void 0 : g.shape) ?? (b == null ? void 0 : b.shape) ?? (y == null ? void 0 : y.shape) ?? ce.keyframesStyle.shape,
    size: (g == null ? void 0 : g.size) ?? (b == null ? void 0 : b.size) ?? (y == null ? void 0 : y.size) ?? ce.keyframesStyle.size,
    fillColor: (g == null ? void 0 : g.fillColor) ?? (C == null ? void 0 : C.fillColor) ?? (b == null ? void 0 : b.fillColor) ?? (y == null ? void 0 : y.fillColor) ?? d.keyframe,
    selectedFillColor: (g == null ? void 0 : g.selectedFillColor) ?? (b == null ? void 0 : b.selectedFillColor) ?? (y == null ? void 0 : y.selectedFillColor) ?? d.keyframeSelected,
    strokeColor: (g == null ? void 0 : g.strokeColor) ?? (b == null ? void 0 : b.strokeColor) ?? (y == null ? void 0 : y.strokeColor) ?? d.keyframeStroke
  };
}, qt = (r) => {
  let a = 0;
  for (let s = 0; s < r.rows.length; s++) {
    const d = r.rows[s].keyframes;
    if (d)
      for (let u = 0; u < d.length; u++)
        d[u].val > a && (a = d[u].val);
  }
  return a;
}, Ue = (r) => {
  const a = [];
  for (let s = 0; s < r.rows.length; s++) {
    const d = r.rows[s].keyframes;
    if (d)
      for (let u = 0; u < d.length; u++)
        a.push(d[u]);
  }
  return a;
}, xt = (r, a) => {
  const s = (r.keyframes ?? []).filter((g) => g.group === a);
  if (s.length === 0)
    return null;
  let d = s[0].val, u = s[0].val;
  for (let g = 1; g < s.length; g++)
    s[g].val < d && (d = s[g].val), s[g].val > u && (u = s[g].val);
  return { min: d, max: u, keyframes: s };
}, Kt = (r, a) => (r.groups ?? []).find((s) => s.id === a), Qt = (r, a, s) => {
  if (!r || typeof getComputedStyle > "u")
    return s;
  const d = getComputedStyle(r).getPropertyValue(a).trim();
  return d.length > 0 ? d : s;
}, er = (r, a, s) => {
  const d = a ? "dark" : "light", u = (C, b) => Qt(r, `--blue-orange-${d}-timeline-${C}`, b), g = s ?? {};
  return {
    background: g.background ?? u("background-color", a ? "#1c1c1e" : "#ffffff"),
    headerBackground: g.headerBackground ?? u("header-background-color", a ? "#242426" : "#fafafa"),
    border: g.border ?? u("border-color", a ? "#34343a" : "#e0e1e2"),
    tick: g.tick ?? u("tick-color", a ? "#4a4a50" : "#c4c4c8"),
    label: g.label ?? u("label-color", a ? "#a1a1aa" : "#71717a"),
    rowBackground: g.rowBackground ?? u("row-background-color", a ? "#1c1c1e" : "#ffffff"),
    rowAltBackground: g.rowAltBackground ?? u("row-alt-background-color", a ? "#232326" : "#f7f7f9"),
    rowHoverBackground: g.rowHoverBackground ?? u("row-hover-background-color", a ? "#26303f" : "#eef2fb"),
    keyframe: g.keyframe ?? u("keyframe-color", a ? "#60a5fa" : "#2563eb"),
    keyframeSelected: g.keyframeSelected ?? u("keyframe-selected-color", a ? "#fb7185" : "#e11d48"),
    keyframeStroke: g.keyframeStroke ?? u("keyframe-stroke-color", a ? "#1c1c1e" : "#ffffff"),
    group: g.group ?? u("group-color", a ? "#3b527d" : "#93b4f7"),
    cursor: g.cursor ?? u("cursor-color", a ? "#fb7185" : "#e11d48"),
    now: g.now ?? u("now-color", a ? "#34d399" : "#059669"),
    selection: g.selection ?? u("selection-color", a ? "rgba(96, 165, 250, 0.22)" : "rgba(37, 99, 235, 0.18)"),
    selectionBorder: g.selectionBorder ?? u("selection-border-color", a ? "#60a5fa" : "#2563eb")
  };
}, Pt = (r) => r === re.SELECTION || r === re.PAN, tr = (r) => r === re.PAN || r === re.NON_INTERACTIVE_PAN;
var kt = { exports: {} }, rt = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ot;
function rr() {
  if (Ot) return rt;
  Ot = 1;
  var r = Dt, a = Symbol.for("react.element"), s = Symbol.for("react.fragment"), d = Object.prototype.hasOwnProperty, u = r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, g = { key: !0, ref: !0, __self: !0, __source: !0 };
  function C(b, y, H) {
    var U, ne = {}, F = null, be = null;
    H !== void 0 && (F = "" + H), y.key !== void 0 && (F = "" + y.key), y.ref !== void 0 && (be = y.ref);
    for (U in y) d.call(y, U) && !g.hasOwnProperty(U) && (ne[U] = y[U]);
    if (b && b.defaultProps) for (U in y = b.defaultProps, y) ne[U] === void 0 && (ne[U] = y[U]);
    return { $$typeof: a, type: b, key: F, ref: be, props: ne, _owner: u.current };
  }
  return rt.Fragment = s, rt.jsx = C, rt.jsxs = C, rt;
}
var nt = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var jt;
function nr() {
  return jt || (jt = 1, process.env.NODE_ENV !== "production" && function() {
    var r = Dt, a = Symbol.for("react.element"), s = Symbol.for("react.portal"), d = Symbol.for("react.fragment"), u = Symbol.for("react.strict_mode"), g = Symbol.for("react.profiler"), C = Symbol.for("react.provider"), b = Symbol.for("react.context"), y = Symbol.for("react.forward_ref"), H = Symbol.for("react.suspense"), U = Symbol.for("react.suspense_list"), ne = Symbol.for("react.memo"), F = Symbol.for("react.lazy"), be = Symbol.for("react.offscreen"), G = Symbol.iterator, ze = "@@iterator";
    function ie(e) {
      if (e === null || typeof e != "object")
        return null;
      var c = G && e[G] || e[ze];
      return typeof c == "function" ? c : null;
    }
    var ge = r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function A(e) {
      {
        for (var c = arguments.length, f = new Array(c > 1 ? c - 1 : 0), h = 1; h < c; h++)
          f[h - 1] = arguments[h];
        m("error", e, f);
      }
    }
    function m(e, c, f) {
      {
        var h = ge.ReactDebugCurrentFrame, x = h.getStackAddendum();
        x !== "" && (c += "%s", f = f.concat([x]));
        var w = f.map(function(E) {
          return String(E);
        });
        w.unshift("Warning: " + c), Function.prototype.apply.call(console[e], console, w);
      }
    }
    var We = !1, X = !1, ot = !1, ht = !1, le = !1, Y;
    Y = Symbol.for("react.module.reference");
    function je(e) {
      return !!(typeof e == "string" || typeof e == "function" || e === d || e === g || le || e === u || e === H || e === U || ht || e === be || We || X || ot || typeof e == "object" && e !== null && (e.$$typeof === F || e.$$typeof === ne || e.$$typeof === C || e.$$typeof === b || e.$$typeof === y || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      e.$$typeof === Y || e.getModuleId !== void 0));
    }
    function q(e, c, f) {
      var h = e.displayName;
      if (h)
        return h;
      var x = c.displayName || c.name || "";
      return x !== "" ? f + "(" + x + ")" : f;
    }
    function Ee(e) {
      return e.displayName || "Context";
    }
    function ee(e) {
      if (e == null)
        return null;
      if (typeof e.tag == "number" && A("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof e == "function")
        return e.displayName || e.name || null;
      if (typeof e == "string")
        return e;
      switch (e) {
        case d:
          return "Fragment";
        case s:
          return "Portal";
        case g:
          return "Profiler";
        case u:
          return "StrictMode";
        case H:
          return "Suspense";
        case U:
          return "SuspenseList";
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case b:
            var c = e;
            return Ee(c) + ".Consumer";
          case C:
            var f = e;
            return Ee(f._context) + ".Provider";
          case y:
            return q(e, e.render, "ForwardRef");
          case ne:
            var h = e.displayName || null;
            return h !== null ? h : ee(e.type) || "Memo";
          case F: {
            var x = e, w = x._payload, E = x._init;
            try {
              return ee(E(w));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var xe = Object.assign, ue = 0, Xe, L, Le, st, fe, Ge, De;
    function Ie() {
    }
    Ie.__reactDisabledLog = !0;
    function vt() {
      {
        if (ue === 0) {
          Xe = console.log, L = console.info, Le = console.warn, st = console.error, fe = console.group, Ge = console.groupCollapsed, De = console.groupEnd;
          var e = {
            configurable: !0,
            enumerable: !0,
            value: Ie,
            writable: !0
          };
          Object.defineProperties(console, {
            info: e,
            log: e,
            warn: e,
            error: e,
            group: e,
            groupCollapsed: e,
            groupEnd: e
          });
        }
        ue++;
      }
    }
    function at() {
      {
        if (ue--, ue === 0) {
          var e = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: xe({}, e, {
              value: Xe
            }),
            info: xe({}, e, {
              value: L
            }),
            warn: xe({}, e, {
              value: Le
            }),
            error: xe({}, e, {
              value: st
            }),
            group: xe({}, e, {
              value: fe
            }),
            groupCollapsed: xe({}, e, {
              value: Ge
            }),
            groupEnd: xe({}, e, {
              value: De
            })
          });
        }
        ue < 0 && A("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var Je = ge.ReactCurrentDispatcher, Ze;
    function Ne(e, c, f) {
      {
        if (Ze === void 0)
          try {
            throw Error();
          } catch (x) {
            var h = x.stack.trim().match(/\n( *(at )?)/);
            Ze = h && h[1] || "";
          }
        return `
` + Ze + e;
      }
    }
    var Ve = !1, ye;
    {
      var bt = typeof WeakMap == "function" ? WeakMap : Map;
      ye = new bt();
    }
    function Re(e, c) {
      if (!e || Ve)
        return "";
      {
        var f = ye.get(e);
        if (f !== void 0)
          return f;
      }
      var h;
      Ve = !0;
      var x = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var w;
      w = Je.current, Je.current = null, vt();
      try {
        if (c) {
          var E = function() {
            throw Error();
          };
          if (Object.defineProperty(E.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(E, []);
            } catch (ae) {
              h = ae;
            }
            Reflect.construct(e, [], E);
          } else {
            try {
              E.call();
            } catch (ae) {
              h = ae;
            }
            e.call(E.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (ae) {
            h = ae;
          }
          e();
        }
      } catch (ae) {
        if (ae && h && typeof ae.stack == "string") {
          for (var R = ae.stack.split(`
`), B = h.stack.split(`
`), N = R.length - 1, z = B.length - 1; N >= 1 && z >= 0 && R[N] !== B[z]; )
            z--;
          for (; N >= 1 && z >= 0; N--, z--)
            if (R[N] !== B[z]) {
              if (N !== 1 || z !== 1)
                do
                  if (N--, z--, z < 0 || R[N] !== B[z]) {
                    var se = `
` + R[N].replace(" at new ", " at ");
                    return e.displayName && se.includes("<anonymous>") && (se = se.replace("<anonymous>", e.displayName)), typeof e == "function" && ye.set(e, se), se;
                  }
                while (N >= 1 && z >= 0);
              break;
            }
        }
      } finally {
        Ve = !1, Je.current = w, at(), Error.prepareStackTrace = x;
      }
      var He = e ? e.displayName || e.name : "", Ye = He ? Ne(He) : "";
      return typeof e == "function" && ye.set(e, Ye), Ye;
    }
    function qe(e, c, f) {
      return Re(e, !1);
    }
    function lt(e) {
      var c = e.prototype;
      return !!(c && c.isReactComponent);
    }
    function we(e, c, f) {
      if (e == null)
        return "";
      if (typeof e == "function")
        return Re(e, lt(e));
      if (typeof e == "string")
        return Ne(e);
      switch (e) {
        case H:
          return Ne("Suspense");
        case U:
          return Ne("SuspenseList");
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case y:
            return qe(e.render);
          case ne:
            return we(e.type, c, f);
          case F: {
            var h = e, x = h._payload, w = h._init;
            try {
              return we(w(x), c, f);
            } catch {
            }
          }
        }
      return "";
    }
    var Fe = Object.prototype.hasOwnProperty, ct = {}, Ke = ge.ReactDebugCurrentFrame;
    function pe(e) {
      if (e) {
        var c = e._owner, f = we(e.type, e._source, c ? c.type : null);
        Ke.setExtraStackFrame(f);
      } else
        Ke.setExtraStackFrame(null);
    }
    function it(e, c, f, h, x) {
      {
        var w = Function.call.bind(Fe);
        for (var E in e)
          if (w(e, E)) {
            var R = void 0;
            try {
              if (typeof e[E] != "function") {
                var B = Error((h || "React class") + ": " + f + " type `" + E + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof e[E] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw B.name = "Invariant Violation", B;
              }
              R = e[E](c, E, h, f, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (N) {
              R = N;
            }
            R && !(R instanceof Error) && (pe(x), A("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", h || "React class", f, E, typeof R), pe(null)), R instanceof Error && !(R.message in ct) && (ct[R.message] = !0, pe(x), A("Failed %s type: %s", f, R.message), pe(null));
          }
      }
    }
    var ut = Array.isArray;
    function Be(e) {
      return ut(e);
    }
    function ft(e) {
      {
        var c = typeof Symbol == "function" && Symbol.toStringTag, f = c && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return f;
      }
    }
    function dt(e) {
      try {
        return Qe(e), !1;
      } catch {
        return !0;
      }
    }
    function Qe(e) {
      return "" + e;
    }
    function mt(e) {
      if (dt(e))
        return A("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", ft(e)), Qe(e);
    }
    var Ce = ge.ReactCurrentOwner, t = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, n, o, i;
    i = {};
    function p(e) {
      if (Fe.call(e, "ref")) {
        var c = Object.getOwnPropertyDescriptor(e, "ref").get;
        if (c && c.isReactWarning)
          return !1;
      }
      return e.ref !== void 0;
    }
    function v(e) {
      if (Fe.call(e, "key")) {
        var c = Object.getOwnPropertyDescriptor(e, "key").get;
        if (c && c.isReactWarning)
          return !1;
      }
      return e.key !== void 0;
    }
    function O(e, c) {
      if (typeof e.ref == "string" && Ce.current && c && Ce.current.stateNode !== c) {
        var f = ee(Ce.current.type);
        i[f] || (A('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', ee(Ce.current.type), e.ref), i[f] = !0);
      }
    }
    function M(e, c) {
      {
        var f = function() {
          n || (n = !0, A("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", c));
        };
        f.isReactWarning = !0, Object.defineProperty(e, "key", {
          get: f,
          configurable: !0
        });
      }
    }
    function l(e, c) {
      {
        var f = function() {
          o || (o = !0, A("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", c));
        };
        f.isReactWarning = !0, Object.defineProperty(e, "ref", {
          get: f,
          configurable: !0
        });
      }
    }
    var S = function(e, c, f, h, x, w, E) {
      var R = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: a,
        // Built-in properties that belong on the element
        type: e,
        key: c,
        ref: f,
        props: E,
        // Record the component responsible for creating this element.
        _owner: w
      };
      return R._store = {}, Object.defineProperty(R._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(R, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: h
      }), Object.defineProperty(R, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: x
      }), Object.freeze && (Object.freeze(R.props), Object.freeze(R)), R;
    };
    function D(e, c, f, h, x) {
      {
        var w, E = {}, R = null, B = null;
        f !== void 0 && (mt(f), R = "" + f), v(c) && (mt(c.key), R = "" + c.key), p(c) && (B = c.ref, O(c, x));
        for (w in c)
          Fe.call(c, w) && !t.hasOwnProperty(w) && (E[w] = c[w]);
        if (e && e.defaultProps) {
          var N = e.defaultProps;
          for (w in N)
            E[w] === void 0 && (E[w] = N[w]);
        }
        if (R || B) {
          var z = typeof e == "function" ? e.displayName || e.name || "Unknown" : e;
          R && M(E, z), B && l(E, z);
        }
        return S(e, R, B, x, h, Ce.current, E);
      }
    }
    var j = ge.ReactCurrentOwner, I = ge.ReactDebugCurrentFrame;
    function k(e) {
      if (e) {
        var c = e._owner, f = we(e.type, e._source, c ? c.type : null);
        I.setExtraStackFrame(f);
      } else
        I.setExtraStackFrame(null);
    }
    var V;
    V = !1;
    function de(e) {
      return typeof e == "object" && e !== null && e.$$typeof === a;
    }
    function oe() {
      {
        if (j.current) {
          var e = ee(j.current.type);
          if (e)
            return `

Check the render method of \`` + e + "`.";
        }
        return "";
      }
    }
    function te(e) {
      return "";
    }
    var J = {};
    function Te(e) {
      {
        var c = oe();
        if (!c) {
          var f = typeof e == "string" ? e : e.displayName || e.name;
          f && (c = `

Check the top-level render call using <` + f + ">.");
        }
        return c;
      }
    }
    function Se(e, c) {
      {
        if (!e._store || e._store.validated || e.key != null)
          return;
        e._store.validated = !0;
        var f = Te(c);
        if (J[f])
          return;
        J[f] = !0;
        var h = "";
        e && e._owner && e._owner !== j.current && (h = " It was passed a child from " + ee(e._owner.type) + "."), k(e), A('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', f, h), k(null);
      }
    }
    function $(e, c) {
      {
        if (typeof e != "object")
          return;
        if (Be(e))
          for (var f = 0; f < e.length; f++) {
            var h = e[f];
            de(h) && Se(h, c);
          }
        else if (de(e))
          e._store && (e._store.validated = !0);
        else if (e) {
          var x = ie(e);
          if (typeof x == "function" && x !== e.entries)
            for (var w = x.call(e), E; !(E = w.next()).done; )
              de(E.value) && Se(E.value, c);
        }
      }
    }
    function me(e) {
      {
        var c = e.type;
        if (c == null || typeof c == "string")
          return;
        var f;
        if (typeof c == "function")
          f = c.propTypes;
        else if (typeof c == "object" && (c.$$typeof === y || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        c.$$typeof === ne))
          f = c.propTypes;
        else
          return;
        if (f) {
          var h = ee(c);
          it(f, e.props, "prop", h, e);
        } else if (c.PropTypes !== void 0 && !V) {
          V = !0;
          var x = ee(c);
          A("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", x || "Unknown");
        }
        typeof c.getDefaultProps == "function" && !c.getDefaultProps.isReactClassApproved && A("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function W(e) {
      {
        for (var c = Object.keys(e.props), f = 0; f < c.length; f++) {
          var h = c[f];
          if (h !== "children" && h !== "key") {
            k(e), A("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", h), k(null);
            break;
          }
        }
        e.ref !== null && (k(e), A("Invalid attribute `ref` supplied to `React.Fragment`."), k(null));
      }
    }
    var ke = {};
    function Ae(e, c, f, h, x, w) {
      {
        var E = je(e);
        if (!E) {
          var R = "";
          (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (R += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var B = te();
          B ? R += B : R += oe();
          var N;
          e === null ? N = "null" : Be(e) ? N = "array" : e !== void 0 && e.$$typeof === a ? (N = "<" + (ee(e.type) || "Unknown") + " />", R = " Did you accidentally export a JSX literal instead of a component?") : N = typeof e, A("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", N, R);
        }
        var z = D(e, c, f, x, w);
        if (z == null)
          return z;
        if (E) {
          var se = c.children;
          if (se !== void 0)
            if (h)
              if (Be(se)) {
                for (var He = 0; He < se.length; He++)
                  $(se[He], e);
                Object.freeze && Object.freeze(se);
              } else
                A("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              $(se, e);
        }
        if (Fe.call(c, "key")) {
          var Ye = ee(e), ae = Object.keys(c).filter(function(Yt) {
            return Yt !== "key";
          }), yt = ae.length > 0 ? "{key: someKey, " + ae.join(": ..., ") + ": ...}" : "{key: someKey}";
          if (!ke[Ye + yt]) {
            var At = ae.length > 0 ? "{" + ae.join(": ..., ") + ": ...}" : "{}";
            A(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, yt, Ye, At, Ye), ke[Ye + yt] = !0;
          }
        }
        return e === d ? W(z) : me(z), z;
      }
    }
    function _(e, c, f) {
      return Ae(e, c, f, !0);
    }
    function P(e, c, f) {
      return Ae(e, c, f, !1);
    }
    var K = P, Z = _;
    nt.Fragment = d, nt.jsx = K, nt.jsxs = Z;
  }()), nt;
}
process.env.NODE_ENV === "production" ? kt.exports = rr() : kt.exports = nr();
var T = kt.exports;
const Lt = (r) => ({
  rows: (r.rows ?? []).map((a) => ({
    ...a,
    keyframes: a.keyframes ? a.keyframes.map((s) => ({ ...s })) : void 0,
    groups: a.groups ? a.groups.map((s) => ({ ...s })) : void 0
  }))
}), or = $t((r, a) => {
  const {
    model: s,
    options: d,
    time: u,
    interactionMode: g,
    timeMode: C,
    dark: b = !1,
    showLabels: y,
    className: H,
    style: U
  } = r, ne = he(null), F = he(null), be = he(null), G = he(null), ze = he(null), ie = Rt(
    () => ({ ...ce, ...d }),
    [d]
  ), ge = g ?? ie.interactionMode ?? re.SELECTION, A = C ?? ie.timeMode ?? $e.RELATIVE, m = he({
    model: Lt(s),
    options: ie,
    mode: ge,
    timeMode: A,
    dark: b,
    zoom: ie.zoom ?? 1,
    time: u ?? 0,
    // Horizontal content offset (px). In RELATIVE mode this mirrors the
    // scroll container's scrollLeft; in ABSOLUTE mode it is a free-floating,
    // unbounded pan offset the component drives itself (the container does
    // not scroll horizontally), which is what makes the axis infinite.
    scrollLeft: 0,
    scrollTop: 0,
    drag: null,
    pan: null,
    rect: null,
    draggingTime: !1,
    rafId: 0,
    // Latest callbacks, refreshed every render.
    props: r
  });
  m.current.props = r, m.current.options = ie, m.current.mode = ge, m.current.timeMode = A, m.current.dark = b;
  const We = he(null);
  We.current !== s && (We.current = s, m.current.model = Lt(s));
  const X = he(void 0);
  u !== void 0 && u !== X.current && (X.current = u, m.current.time = u);
  const ot = Rt(() => y !== void 0 ? y : s.rows.some((t) => t.title !== void 0 && t.title !== ""), [y, s]), ht = ot ? ie.labelsWidth || 160 : 0, le = () => gt(m.current.timeMode), Y = () => m.current.options.min ?? 0, je = () => {
    const t = m.current.options.max;
    return t !== void 0 ? t : Math.max(qt(m.current.model), Y() + 1);
  }, q = () => m.current.options.leftMargin ?? ce.leftMargin, Ee = () => m.current.options.headerHeight ?? ce.headerHeight, ee = () => {
    var p;
    const t = ((p = F.current) == null ? void 0 : p.clientWidth) ?? 0;
    if (le())
      return t;
    const n = m.current.zoom, o = q(), i = Q(je(), n, o, Y()) + o;
    return Math.max(i, t);
  }, xe = () => {
    var i;
    const t = tt(m.current.model, m.current.options), n = Ee() + t.total + Ee(), o = ((i = F.current) == null ? void 0 : i.clientHeight) ?? 0;
    return Math.max(n, o);
  }, ue = et(() => {
    const t = be.current;
    t && (t.style.width = `${ee()}px`, t.style.height = `${xe()}px`);
  }, []), Xe = et(() => {
    var ke, Ae;
    const t = G.current, n = F.current;
    if (!t || !n)
      return;
    const o = m.current, i = n.clientWidth, p = n.clientHeight, v = typeof window < "u" && window.devicePixelRatio || 1;
    (t.width !== Math.round(i * v) || t.height !== Math.round(p * v)) && (t.width = Math.round(i * v), t.height = Math.round(p * v), t.style.width = `${i}px`, t.style.height = `${p}px`);
    const O = gt(o.timeMode), M = O ? 0 : o.scrollLeft;
    t.style.transform = `translate(${M}px, ${o.scrollTop}px)`;
    const l = t.getContext("2d");
    if (!l)
      return;
    l.setTransform(v, 0, 0, v, 0, 0), l.clearRect(0, 0, i, p);
    const S = er(ne.current, o.dark, o.options.colors), D = o.zoom, j = Y(), I = q(), k = Ee(), V = o.scrollLeft, de = o.scrollTop;
    l.fillStyle = S.background, l.fillRect(0, 0, i, p);
    const oe = tt(o.model, o.options);
    for (let _ = 0; _ < o.model.rows.length; _++) {
      const P = o.model.rows[_];
      if (P.hidden)
        continue;
      const K = k + oe.offsets[_] - de, Z = oe.heights[_];
      K + Z < k || K > p || (l.fillStyle = ((ke = P.style) == null ? void 0 : ke.backgroundColor) ?? (_ % 2 === 0 ? S.rowBackground : S.rowAltBackground), l.fillRect(0, K, i, Z), l.strokeStyle = S.border, l.lineWidth = 1, l.beginPath(), l.moveTo(0, Math.round(K + Z) + 0.5), l.lineTo(i, Math.round(K + Z) + 0.5), l.stroke());
    }
    const te = o.options.stepPx ?? ce.stepPx, J = O ? Jt(D, te) : Bt(D, te), Te = Pe(V, D, I, j), Se = Pe(V + i, D, I, j), $ = Ht(Te, Se, J);
    l.strokeStyle = S.tick, l.lineWidth = 1;
    for (let _ = 0; _ < $.length; _++) {
      const P = Math.round(Q($[_], D, I, j) - V) + 0.5;
      l.beginPath(), l.moveTo(P, k), l.lineTo(P, p), l.stroke();
    }
    for (let _ = 0; _ < o.model.rows.length; _++) {
      const P = o.model.rows[_];
      if (P.hidden)
        continue;
      const K = k + oe.offsets[_] - de, Z = oe.heights[_];
      if (K + Z < k || K > p)
        continue;
      const e = K + Z / 2, c = {}, f = P.keyframes ?? [];
      for (let h = 0; h < f.length; h++) {
        const x = f[h].group;
        if (!x || c[x])
          continue;
        c[x] = !0;
        const w = xt(P, x);
        if (!w || w.min === w.max)
          continue;
        const E = Q(w.min, D, I, j) - V, R = Q(w.max, D, I, j) - V, B = Math.min(Z - 8, 12), N = (P.groups ?? []).find((se) => se.id === x);
        l.fillStyle = ((Ae = N == null ? void 0 : N.style) == null ? void 0 : Ae.fillColor) ?? S.group;
        const z = Math.min(B / 2, 6);
        sr(l, E, e - B / 2, R - E, B, z), l.fill();
      }
      for (let h = 0; h < f.length; h++) {
        const x = f[h], w = Q(x.val, D, I, j) - V;
        if (w < -20 || w > i + 20)
          continue;
        const E = _t(x, P, o.options, S);
        l.fillStyle = x.selected ? E.selectedFillColor : E.fillColor, l.strokeStyle = E.strokeColor, l.lineWidth = x.selected ? 2 : 1, ar(l, w, e, E.size, E.shape), l.fill(), l.stroke();
      }
    }
    l.fillStyle = S.headerBackground, l.fillRect(0, 0, i, k), l.strokeStyle = S.border, l.lineWidth = 1, l.beginPath(), l.moveTo(0, k + 0.5), l.lineTo(i, k + 0.5), l.stroke();
    const me = O ? o.options.dateFormatter ?? Ft : o.options.unitFormatter ?? Nt;
    l.fillStyle = S.label, l.strokeStyle = S.tick, l.font = '10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', l.textBaseline = "alphabetic";
    for (let _ = 0; _ < $.length; _++) {
      const P = Math.round(Q($[_], D, I, j) - V) + 0.5;
      l.beginPath(), l.moveTo(P, k - 6), l.lineTo(P, k), l.stroke();
      const K = me($[_], J);
      l.textAlign = "left", l.fillText(K, P + 3, k - 9);
      for (let Z = 1; Z < 4; Z++) {
        const e = Math.round(Q($[_] + J * Z / 4, D, I, j) - V) + 0.5;
        l.beginPath(), l.moveTo(e, k - 3), l.lineTo(e, k), l.stroke();
      }
    }
    if (O) {
      const _ = o.options.now ?? Date.now(), P = Q(_, D, I, j) - V;
      P >= -1 && P <= i + 1 && (l.strokeStyle = S.now, l.fillStyle = S.now, l.lineWidth = 1, l.setLineDash([3, 3]), l.beginPath(), l.moveTo(Math.round(P) + 0.5, k), l.lineTo(Math.round(P) + 0.5, p), l.stroke(), l.setLineDash([]), l.beginPath(), l.arc(Math.round(P) + 0.5, k + 3, 3, 0, Math.PI * 2), l.fill());
    }
    const W = Q(o.time, D, I, j) - V;
    if (W >= -8 && W <= i + 8 && (l.strokeStyle = S.cursor, l.fillStyle = S.cursor, l.lineWidth = 1, l.beginPath(), l.moveTo(Math.round(W) + 0.5, k), l.lineTo(Math.round(W) + 0.5, p), l.stroke(), l.beginPath(), l.moveTo(W - 5, 2), l.lineTo(W + 5, 2), l.lineTo(W + 5, k - 8), l.lineTo(W, k - 2), l.lineTo(W - 5, k - 8), l.closePath(), l.fill()), o.rect) {
      const _ = Math.min(o.rect.startContentX, o.rect.curContentX) - V, P = Math.min(o.rect.startContentY, o.rect.curContentY) - de, K = Math.max(o.rect.startContentX, o.rect.curContentX) - V, Z = Math.max(o.rect.startContentY, o.rect.curContentY) - de;
      l.fillStyle = S.selection, l.strokeStyle = S.selectionBorder, l.lineWidth = 1, l.fillRect(_, P, K - _, Z - P), l.strokeRect(_ + 0.5, P + 0.5, K - _, Z - P);
    }
  }, []), L = et(() => {
    m.current.rafId || (m.current.rafId = requestAnimationFrame(() => {
      m.current.rafId = 0, Xe();
    }));
  }, [Xe]), Le = et(() => {
    const t = ze.current;
    t && (t.style.transform = `translateY(${-m.current.scrollTop}px)`);
  }, []), st = et(() => {
    ue(), Le(), L();
  }, [ue, Le, L]), fe = (t, n) => {
    const o = G.current.getBoundingClientRect();
    return {
      x: t - o.left + m.current.scrollLeft,
      y: n - o.top + m.current.scrollTop
    };
  }, Ge = (t, n) => {
    const o = m.current, i = G.current.getBoundingClientRect(), p = n - i.top, v = Ee(), O = o.zoom, M = Y(), l = q(), S = fe(t, n);
    if (p <= v)
      return { type: ve.TIMELINE };
    const D = tt(o.model, o.options), j = S.y - v;
    for (let I = 0; I < o.model.rows.length; I++) {
      const k = o.model.rows[I];
      if (k.hidden)
        continue;
      const V = D.offsets[I], de = D.heights[I];
      if (j < V || j > V + de)
        continue;
      const oe = S.x, te = k.keyframes ?? [];
      let J, Te = 1 / 0;
      for (let $ = 0; $ < te.length; $++) {
        const me = Q(te[$].val, O, l, M), W = Math.abs(me - oe), ke = _t(te[$], k, o.options, {
          keyframe: "",
          keyframeSelected: "",
          keyframeStroke: ""
        });
        W <= ke.size + 4 && W < Te && (J = te[$], Te = W);
      }
      if (J)
        return { type: ve.KEYFRAME, row: k, rowIndex: I, keyframe: J };
      const Se = {};
      for (let $ = 0; $ < te.length; $++) {
        const me = te[$].group;
        if (!me || Se[me])
          continue;
        Se[me] = !0;
        const W = xt(k, me);
        if (!W || W.min === W.max)
          continue;
        const ke = Q(W.min, O, l, M), Ae = Q(W.max, O, l, M);
        if (oe >= ke && oe <= Ae) {
          const _ = (k.groups ?? []).find((P) => P.id === me);
          return { type: ve.GROUP, row: k, rowIndex: I, group: _, groupId: me };
        }
      }
      return { type: ve.ROW, row: k, rowIndex: I };
    }
    return { type: ve.ROW };
  }, De = (t) => {
    const n = m.current.props.onSelected;
    n && n({ selected: Ue(m.current.model).filter((o) => o.selected), changed: t });
  }, Ie = (t, n) => {
    const o = [], i = Ue(m.current.model);
    for (let p = 0; p < i.length; p++) {
      const v = i[p], O = v.selectable !== !1;
      let M = v.selected;
      t && v === t ? (M = n ? !v.selected : !0, O || (M = v.selected)) : n || (M = !1), M !== v.selected && (v.selected = M, o.push(v));
    }
    o.length && De(o);
  }, vt = (t) => {
    m.current.options.timelineDraggable !== !1 && (m.current.draggingTime = !0, at(t));
  }, at = (t) => {
    const n = m.current, o = fe(t, 0);
    let i = Pe(o.x, n.zoom, q(), Y());
    i = Ct(i, n.options.snapStep ?? 0, !!n.options.snapEnabled), le() || (i = _e(i, Y(), je())), n.time = i, n.props.onTimeChanged && n.props.onTimeChanged({ val: i, source: "user" }), L();
  }, Je = (t, n) => {
    const o = m.current, i = t.keyframe;
    if (!i.selected && !n ? Ie(i, !1) : n && Ie(i, !0), !(o.options.keyframesDraggable !== !1 && i.draggable !== !1 && i.selectable !== !1)) {
      L();
      return;
    }
    const v = Ue(o.model).filter((M) => M.selected && M.draggable !== !1), O = (v.length ? v : [i]).map((M) => ({ keyframe: M, startVal: M.val }));
    o.drag = {
      target: ve.KEYFRAME,
      startVal: t.keyframe.val,
      moving: O,
      row: t.row,
      moved: !1,
      lastDelta: 0
    };
  }, Ze = (t) => {
    const n = m.current;
    if (n.options.groupsDraggable === !1)
      return;
    const o = xt(t.row, t.groupId);
    if (!o)
      return;
    const i = o.keyframes.map((v) => ({ keyframe: v, startVal: v.val })), p = [];
    Ue(n.model).forEach((v) => {
      const O = o.keyframes.indexOf(v) >= 0;
      O !== v.selected && (v.selected = O, p.push(v));
    }), p.length && De(p), n.drag = {
      target: ve.GROUP,
      startVal: o.min,
      moving: i,
      group: t.group,
      row: t.row,
      moved: !1,
      lastDelta: 0
    };
  }, Ne = (t) => {
    if (t.button !== 0)
      return;
    const n = m.current, o = n.mode, i = t.ctrlKey || t.metaKey || t.shiftKey;
    if (G.current.focus(), o === re.NONE)
      return;
    if (o === re.ZOOM) {
      bt(t);
      return;
    }
    if (o === re.NON_INTERACTIVE_PAN) {
      Ve(t);
      return;
    }
    const p = Ge(t.clientX, t.clientY);
    if (p.type === ve.TIMELINE) {
      vt(t.clientX), pe();
      return;
    }
    if (p.type === ve.KEYFRAME && Pt(o)) {
      Je(p, i), pe(), L();
      return;
    }
    if (p.type === ve.GROUP && Pt(o)) {
      Ze(p), pe(), L();
      return;
    }
    if (tr(o)) {
      Ve(t);
      return;
    }
    i || Ie(null, !1);
    const v = fe(t.clientX, t.clientY);
    n.rect = {
      startContentX: v.x,
      startContentY: v.y,
      curContentX: v.x,
      curContentY: v.y,
      additive: i
    }, pe(), L();
  }, Ve = (t) => {
    const n = F.current;
    m.current.pan = {
      startX: t.clientX,
      startY: t.clientY,
      // In ABSOLUTE mode the horizontal position lives on ctx (unbounded),
      // not on the container, so anchor the pan to that instead.
      startScrollLeft: le() ? m.current.scrollLeft : n.scrollLeft,
      startScrollTop: n.scrollTop
    }, pe();
  }, ye = he(null), bt = (t) => {
    const n = fe(t.clientX, t.clientY);
    ye.current = {
      startX: t.clientX,
      startZoom: m.current.zoom,
      anchorVal: Pe(n.x, m.current.zoom, q(), Y())
    }, pe();
  }, Re = (t, n, o) => {
    const i = m.current, p = _e(
      t,
      i.options.zoomMin ?? ce.zoomMin,
      i.options.zoomMax ?? ce.zoomMax
    );
    i.zoom = p, ue();
    const O = G.current.getBoundingClientRect(), M = o - O.left, l = Q(n, p, q(), Y()), S = F.current;
    le() ? (i.scrollLeft = l - M, L()) : (S.scrollLeft = _e(l - M, 0, Math.max(0, ee() - S.clientWidth)), L());
  }, qe = () => {
    const t = F.current, n = G.current;
    if (!t || !n)
      return;
    const o = m.current, i = o.options.now ?? Date.now(), p = Mt(o.model, i) ?? Mt(o.model);
    if (!p)
      return;
    const v = q(), O = Y(), M = p.max - p.min;
    if (M > 0) {
      const D = Math.max(1, t.clientWidth - 2 * v), j = _e(
        M * 1.2 / D,
        // ~10% breathing room each side
        o.options.zoomMin ?? ce.zoomMin,
        o.options.zoomMax ?? ce.zoomMax
      );
      o.zoom = j;
    }
    ue();
    const l = (p.min + p.max) / 2, S = Q(l, o.zoom, v, O) - t.clientWidth / 2;
    le() ? o.scrollLeft = S : t.scrollLeft = _e(S, 0, Math.max(0, ee() - t.clientWidth)), L();
  }, lt = (t) => {
    const n = m.current;
    if (n.draggingTime) {
      at(t.clientX);
      return;
    }
    if (ye.current) {
      const o = ye.current, i = t.clientX - o.startX, p = Math.pow(1.01, -i);
      Re(o.startZoom * p, o.anchorVal, o.startX);
      return;
    }
    if (n.pan) {
      const o = F.current;
      le() ? (n.scrollLeft = n.pan.startScrollLeft - (t.clientX - n.pan.startX), o.scrollTop = n.pan.startScrollTop - (t.clientY - n.pan.startY), L()) : (o.scrollLeft = n.pan.startScrollLeft - (t.clientX - n.pan.startX), o.scrollTop = n.pan.startScrollTop - (t.clientY - n.pan.startY));
      return;
    }
    if (n.rect) {
      const o = fe(t.clientX, t.clientY);
      n.rect.curContentX = o.x, n.rect.curContentY = o.y, ct(), L();
      return;
    }
    if (n.drag) {
      const o = fe(t.clientX, t.clientY), i = Pe(o.x, n.zoom, q(), Y());
      let p = i - n.drag.startVal;
      if (n.options.snapEnabled && (n.options.snapStep ?? 0) > 0 && (p = Ct(n.drag.startVal + p, n.options.snapStep, !0) - n.drag.startVal), p !== n.drag.lastDelta) {
        n.drag.moved = !0, n.drag.lastDelta = p;
        const v = le();
        for (let M = 0; M < n.drag.moving.length; M++) {
          const l = n.drag.moving[M];
          let S = l.startVal + p;
          const D = l.keyframe.min ?? (v ? -1 / 0 : Y()), j = l.keyframe.max ?? (v ? 1 / 0 : je());
          S = _e(S, D, j), l.keyframe.val = S;
        }
        const O = {
          keyframes: n.drag.moving.map((M) => M.keyframe),
          group: n.drag.group,
          target: n.drag.target,
          val: i,
          delta: p
        };
        Fe(), n.props.onDrag && n.props.onDrag(O), L();
      }
    }
  }, we = he(!1), Fe = () => {
    const t = m.current;
    t.drag && t.drag.moved && !we.current && t.props.onDragStarted && (we.current = !0, t.props.onDragStarted({
      keyframes: t.drag.moving.map((n) => n.keyframe),
      group: t.drag.group,
      target: t.drag.target,
      val: t.drag.startVal + t.drag.lastDelta,
      delta: t.drag.lastDelta
    }));
  }, ct = () => {
    const t = m.current;
    if (!t.rect)
      return;
    const n = t.zoom, o = Y(), i = q(), p = Ee(), v = Math.min(t.rect.startContentX, t.rect.curContentX), O = Math.max(t.rect.startContentX, t.rect.curContentX), M = Math.min(t.rect.startContentY, t.rect.curContentY), l = Math.max(t.rect.startContentY, t.rect.curContentY), S = tt(t.model, t.options), D = [];
    for (let j = 0; j < t.model.rows.length; j++) {
      const I = t.model.rows[j];
      if (I.hidden)
        continue;
      const k = p + S.offsets[j], de = k + S.heights[j] >= M && k <= l, oe = I.keyframes ?? [];
      for (let te = 0; te < oe.length; te++) {
        const J = oe[te], Te = Q(J.val, n, i, o), $ = de && Te >= v && Te <= O && J.selectable !== !1 ? !0 : t.rect.additive ? J.selected : !1;
        $ !== J.selected && (J.selected = $, D.push(J));
      }
    }
    D.length && De(D);
  }, Ke = () => {
    const t = m.current;
    if (it(), t.draggingTime && (t.draggingTime = !1), ye.current && (ye.current = null), t.pan && (t.pan = null), t.rect && (t.rect = null, L()), t.drag) {
      const n = t.drag;
      if (t.drag = null, n.moved) {
        const o = {
          keyframes: n.moving.map((i) => i.keyframe),
          group: n.group,
          target: n.target,
          val: n.startVal + n.lastDelta,
          delta: n.lastDelta
        };
        t.props.onDragFinished && t.props.onDragFinished(o), t.props.onKeyframeChanged && n.moving.forEach((i) => t.props.onKeyframeChanged(i.keyframe)), t.props.onModelChange && t.props.onModelChange(t.model);
      }
      we.current = !1, L();
    }
  }, pe = () => {
    window.addEventListener("mousemove", lt), window.addEventListener("mouseup", Ke);
  }, it = () => {
    window.removeEventListener("mousemove", lt), window.removeEventListener("mouseup", Ke);
  }, ut = (t) => {
    const n = m.current;
    if (n.mode === re.ZOOM || t.ctrlKey || t.metaKey) {
      t.preventDefault();
      const o = fe(t.clientX, t.clientY), i = Pe(o.x, n.zoom, q(), Y()), p = n.options.zoomSpeed ?? ce.zoomSpeed;
      let v = t.deltaY > 0 ? 1 : -1;
      t.ctrlKey && n.mode === re.ZOOM && (v = -v);
      const O = 1 + v * p;
      Re(n.zoom * O, i, t.clientX);
      return;
    }
    if (gt(n.timeMode)) {
      const o = t.shiftKey ? t.deltaY : t.deltaX, i = t.shiftKey || Math.abs(t.deltaX) > Math.abs(t.deltaY);
      o !== 0 && i && (t.preventDefault(), n.scrollLeft += o, L());
    }
  }, Be = (t) => {
    const n = m.current;
    if (!n.props.onContextMenu)
      return;
    const o = Ge(t.clientX, t.clientY), i = fe(t.clientX, t.clientY), p = Pe(i.x, n.zoom, q(), Y());
    n.props.onContextMenu({
      originalEvent: t,
      val: p,
      target: o.type,
      row: o.row,
      keyframe: o.keyframe
    });
  }, ft = () => {
    const t = F.current;
    t && (le() || (m.current.scrollLeft = t.scrollLeft), m.current.scrollTop = t.scrollTop, Le(), L(), m.current.props.onScroll && m.current.props.onScroll({
      scrollLeft: m.current.scrollLeft,
      scrollTop: t.scrollTop,
      zoom: m.current.zoom
    }));
  };
  wt(() => {
    ue(), Le(), Xe();
  });
  const dt = he(null);
  wt(() => {
    le() && dt.current !== A && qe(), dt.current = A;
  }, [A]), zt(() => {
    const t = G.current, n = F.current, o = m.current;
    if (!t || !n)
      return;
    t.addEventListener("mousedown", Ne), t.addEventListener("wheel", ut, { passive: !1 }), t.addEventListener("contextmenu", Be), n.addEventListener("scroll", ft, { passive: !0 });
    let i = null;
    return typeof ResizeObserver < "u" && (i = new ResizeObserver(() => {
      st();
    }), i.observe(n)), () => {
      t.removeEventListener("mousedown", Ne), t.removeEventListener("wheel", ut), t.removeEventListener("contextmenu", Be), n.removeEventListener("scroll", ft), it(), i && i.disconnect(), o.rafId && (cancelAnimationFrame(o.rafId), o.rafId = 0);
    };
  }, []), Wt(
    a,
    () => ({
      setTime: (t) => {
        m.current.time = le() ? t : _e(t, Y(), je()), m.current.props.onTimeChanged && m.current.props.onTimeChanged({ val: m.current.time, source: "setTime" }), L();
      },
      getTime: () => m.current.time,
      getModel: () => m.current.model,
      setZoom: (t) => {
        Re(t, Y(), G.current.getBoundingClientRect().left);
      },
      getZoom: () => m.current.zoom,
      zoomBy: (t) => {
        const n = F.current, i = G.current.getBoundingClientRect().left + n.clientWidth / 2, p = fe(i, 0), v = Pe(p.x, m.current.zoom, q(), Y());
        Re(m.current.zoom * t, v, i);
      },
      zoomToFit: () => {
        const t = F.current, n = je() - Y();
        if (n <= 0)
          return;
        const o = Math.max(1, t.clientWidth - 2 * q());
        Re(n / o, Y(), G.current.getBoundingClientRect().left), t.scrollLeft = 0;
      },
      focusEvents: () => qe(),
      setInteractionMode: (t) => {
        m.current.mode = t;
      },
      setTimeMode: (t) => {
        m.current.timeMode = t, ue(), gt(t) ? qe() : L();
      },
      selectAll: () => {
        const t = [];
        Ue(m.current.model).forEach((n) => {
          n.selectable !== !1 && !n.selected && (n.selected = !0, t.push(n));
        }), t.length && De(t), L();
      },
      deselectAll: () => {
        Ie(null, !1), L();
      },
      getSelected: () => Ue(m.current.model).filter((t) => t.selected),
      scrollToVal: (t) => {
        const n = F.current, i = Q(t, m.current.zoom, q(), Y()) - n.clientWidth / 2;
        le() ? (m.current.scrollLeft = i, L()) : n.scrollLeft = _e(
          i,
          0,
          Math.max(0, ee() - n.clientWidth)
        );
      },
      redraw: () => L()
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  );
  const Qe = Ee(), mt = `blue-orange-timeline${b ? " blue-orange-timeline-dark" : ""}${H ? " " + H : ""}`, Ce = tt(m.current.model, ie);
  return /* @__PURE__ */ T.jsxs("div", { ref: ne, className: mt, style: U, children: [
    ot && /* @__PURE__ */ T.jsxs("div", { className: "blue-orange-timeline-labels", style: { width: ht }, children: [
      /* @__PURE__ */ T.jsx(
        "div",
        {
          className: "blue-orange-timeline-labels-header",
          style: { height: Qe }
        }
      ),
      /* @__PURE__ */ T.jsx(
        "div",
        {
          className: "blue-orange-timeline-labels-viewport",
          style: { height: `calc(100% - ${Qe}px)` },
          children: /* @__PURE__ */ T.jsx("div", { ref: ze, className: "blue-orange-timeline-labels-list", children: s.rows.map(
            (t, n) => t.hidden ? null : /* @__PURE__ */ T.jsx(
              "div",
              {
                className: "blue-orange-timeline-label no-select",
                style: {
                  height: Ce.heights[n],
                  transform: `translateY(${Ce.offsets[n]}px)`,
                  position: "absolute",
                  left: 0,
                  right: 0
                },
                title: t.title,
                children: /* @__PURE__ */ T.jsx("span", { className: "blue-orange-timeline-label-title", children: t.title })
              },
              n
            )
          ) })
        }
      )
    ] }),
    /* @__PURE__ */ T.jsxs("div", { ref: F, className: "blue-orange-timeline-scroll", tabIndex: 0, children: [
      /* @__PURE__ */ T.jsx("div", { ref: be, className: "blue-orange-timeline-spacer" }),
      /* @__PURE__ */ T.jsx("canvas", { ref: G, className: "blue-orange-timeline-canvas", tabIndex: 0 })
    ] })
  ] });
});
or.displayName = "Timeline";
function sr(r, a, s, d, u, g) {
  const C = Math.max(0, Math.min(g, d / 2, u / 2));
  r.beginPath(), r.moveTo(a + C, s), r.arcTo(a + d, s, a + d, s + u, C), r.arcTo(a + d, s + u, a, s + u, C), r.arcTo(a, s + u, a, s, C), r.arcTo(a, s, a + d, s, C), r.closePath();
}
function ar(r, a, s, d, u) {
  r.beginPath(), u === pt.CIRCLE ? r.arc(a, s, d, 0, Math.PI * 2) : u === pt.RECT ? r.rect(a - d, s - d, d * 2, d * 2) : (r.moveTo(a, s - d), r.lineTo(a + d, s), r.lineTo(a, s + d), r.lineTo(a - d, s), r.closePath());
}
const lr = [
  { mode: re.SELECTION, icon: "ri-cursor-line", label: "Select" },
  { mode: re.PAN, icon: "ri-drag-move-2-line", label: "Pan" },
  { mode: re.ZOOM, icon: "ri-search-line", label: "Zoom" }
], cr = [
  { mode: $e.RELATIVE, icon: "ri-time-line", label: "Relative time" },
  { mode: $e.ABSOLUTE, icon: "ri-calendar-line", label: "Date / time" }
], fr = ({
  mode: r,
  onModeChange: a,
  timeMode: s,
  onTimeModeChange: d,
  onFocusEvents: u,
  onZoomIn: g,
  onZoomOut: C,
  onZoomFit: b,
  playing: y = !1,
  onPlayPause: H,
  onStop: U,
  snapEnabled: ne = !1,
  onSnapChange: F,
  time: be,
  timeFormatter: G,
  dark: ze = !1,
  className: ie,
  style: ge
}) => {
  const A = `blue-orange-timeline-toolbar${ze ? " blue-orange-timeline-toolbar-dark" : ""}${ie ? " " + ie : ""}`, m = s === $e.ABSOLUTE, We = (X) => G ? G(X) : m ? Ft(X, 1e3) : Nt(X, 1e3);
  return /* @__PURE__ */ T.jsxs("div", { className: A, style: ge, children: [
    H && /* @__PURE__ */ T.jsxs(T.Fragment, { children: [
      /* @__PURE__ */ T.jsxs("div", { className: "blue-orange-timeline-toolbar-group", children: [
        /* @__PURE__ */ T.jsx(
          Me,
          {
            icon: y ? "ri-pause-line" : "ri-play-line",
            label: y ? "Pause" : "Play",
            onClick: H
          }
        ),
        U && /* @__PURE__ */ T.jsx(Me, { icon: "ri-stop-line", label: "Stop", onClick: U })
      ] }),
      /* @__PURE__ */ T.jsx("div", { className: "blue-orange-timeline-toolbar-separator" })
    ] }),
    /* @__PURE__ */ T.jsx("div", { className: "blue-orange-timeline-toolbar-group", children: lr.map((X) => /* @__PURE__ */ T.jsx(
      Me,
      {
        icon: X.icon,
        label: X.label,
        className: r === X.mode ? "blue-orange-timeline-mode-active" : void 0,
        onClick: () => a(X.mode)
      },
      X.mode
    )) }),
    d && s !== void 0 && /* @__PURE__ */ T.jsxs(T.Fragment, { children: [
      /* @__PURE__ */ T.jsx("div", { className: "blue-orange-timeline-toolbar-separator" }),
      /* @__PURE__ */ T.jsx("div", { className: "blue-orange-timeline-toolbar-group", children: cr.map((X) => /* @__PURE__ */ T.jsx(
        Me,
        {
          icon: X.icon,
          label: X.label,
          className: s === X.mode ? "blue-orange-timeline-mode-active" : void 0,
          onClick: () => d(X.mode)
        },
        X.mode
      )) })
    ] }),
    u && m && /* @__PURE__ */ T.jsxs(T.Fragment, { children: [
      /* @__PURE__ */ T.jsx("div", { className: "blue-orange-timeline-toolbar-separator" }),
      /* @__PURE__ */ T.jsx("div", { className: "blue-orange-timeline-toolbar-group", children: /* @__PURE__ */ T.jsx(
        Me,
        {
          icon: "ri-focus-3-line",
          label: "Focus events",
          onClick: u
        }
      ) })
    ] }),
    (C || g || b) && /* @__PURE__ */ T.jsxs(T.Fragment, { children: [
      /* @__PURE__ */ T.jsx("div", { className: "blue-orange-timeline-toolbar-separator" }),
      /* @__PURE__ */ T.jsxs("div", { className: "blue-orange-timeline-toolbar-group", children: [
        C && /* @__PURE__ */ T.jsx(
          Me,
          {
            icon: "ri-zoom-out-line",
            label: "Zoom out",
            onClick: C
          }
        ),
        g && /* @__PURE__ */ T.jsx(
          Me,
          {
            icon: "ri-zoom-in-line",
            label: "Zoom in",
            onClick: g
          }
        ),
        b && /* @__PURE__ */ T.jsx(
          Me,
          {
            icon: "ri-fullscreen-line",
            label: "Zoom to fit",
            onClick: b
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ T.jsx("div", { className: "blue-orange-timeline-toolbar-spacer" }),
    F && /* @__PURE__ */ T.jsxs("div", { className: "blue-orange-timeline-toolbar-snap", children: [
      /* @__PURE__ */ T.jsx("span", { className: "blue-orange-timeline-toolbar-snap-label no-select", children: "Snap" }),
      /* @__PURE__ */ T.jsx(Xt, { checked: ne, onChange: F })
    ] }),
    be !== void 0 && /* @__PURE__ */ T.jsx("span", { className: "blue-orange-timeline-toolbar-time no-select", children: We(be) })
  ] });
};
export {
  ce as DEFAULT_TIMELINE_OPTIONS,
  or as Timeline,
  ve as TimelineElementType,
  re as TimelineInteractionMode,
  pt as TimelineKeyframeShape,
  $e as TimelineTimeMode,
  fr as TimelineToolbar,
  Ue as allKeyframes,
  _e as clamp,
  Qt as cssVar,
  Ft as defaultDateFormatter,
  Nt as defaultUnitFormatter,
  Mt as eventsBounds,
  Kt as findGroup,
  Ht as generateTicks,
  xt as groupBounds,
  Bt as majorStep,
  Jt as majorTimeStep,
  Pt as modeAllowsSelection,
  gt as modeIsAbsolute,
  tr as modePansOnEmptyDrag,
  qt as modelMaxVal,
  It as niceStep,
  Gt as niceTimeStep,
  Pe as pxToVal,
  _t as resolveKeyframeStyle,
  er as resolveTheme,
  Vt as rowHeight,
  tt as rowLayout,
  Ct as snapValue,
  Q as valToPx
};
