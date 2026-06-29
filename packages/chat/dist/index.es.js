import Wg, { useRef as $o, useCallback as ls, useEffect as Md, useState as kd } from "react";
import { SideBar as aL, SideBarHeader as iL, SideBarBody as lL, SideBarFooter as oL, SideBarHeaderItem as uL, ButtonIcon as KT, SideBarBodyItem as ZT, SideBarBodyGroup as sL, SideBarBodyLabel as cL, Avatar as iw, EmojiContainer as fL, RichText as dL, VerticalSplitPage as pL, SplitDirectionVerticalPage as hL, SplitPageMajor as vL, SplitPageMinor as mL, SideBarState as yL } from "@blue-orange-ai/foundations-core";
import { SideBarState as jF } from "@blue-orange-ai/foundations-core";
var VE = /* @__PURE__ */ ((i) => (i.DM = "DM", i.GROUP = "GROUP", i.CHANNEL = "CHANNEL", i))(VE || {}), er = /* @__PURE__ */ ((i) => (i.ONLINE = "ONLINE", i.AWAY = "AWAY", i.DND = "DND", i.OFFLINE = "OFFLINE", i))(er || {}), BE = { exports: {} }, Jh = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var yT;
function gL() {
  if (yT) return Jh;
  yT = 1;
  var i = Wg, u = Symbol.for("react.element"), c = Symbol.for("react.fragment"), p = Object.prototype.hasOwnProperty, y = i.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, w = { key: !0, ref: !0, __self: !0, __source: !0 };
  function S(D, _, A) {
    var U, W = {}, X = null, Q = null;
    A !== void 0 && (X = "" + A), _.key !== void 0 && (X = "" + _.key), _.ref !== void 0 && (Q = _.ref);
    for (U in _) p.call(_, U) && !w.hasOwnProperty(U) && (W[U] = _[U]);
    if (D && D.defaultProps) for (U in _ = D.defaultProps, _) W[U] === void 0 && (W[U] = _[U]);
    return { $$typeof: u, type: D, key: X, ref: Q, props: W, _owner: y.current };
  }
  return Jh.Fragment = c, Jh.jsx = S, Jh.jsxs = S, Jh;
}
var ev = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var gT;
function SL() {
  return gT || (gT = 1, process.env.NODE_ENV !== "production" && function() {
    var i = Wg, u = Symbol.for("react.element"), c = Symbol.for("react.portal"), p = Symbol.for("react.fragment"), y = Symbol.for("react.strict_mode"), w = Symbol.for("react.profiler"), S = Symbol.for("react.provider"), D = Symbol.for("react.context"), _ = Symbol.for("react.forward_ref"), A = Symbol.for("react.suspense"), U = Symbol.for("react.suspense_list"), W = Symbol.for("react.memo"), X = Symbol.for("react.lazy"), Q = Symbol.for("react.offscreen"), oe = Symbol.iterator, we = "@@iterator";
    function ce(R) {
      if (R === null || typeof R != "object")
        return null;
      var te = oe && R[oe] || R[we];
      return typeof te == "function" ? te : null;
    }
    var Me = i.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function ve(R) {
      {
        for (var te = arguments.length, de = new Array(te > 1 ? te - 1 : 0), Pe = 1; Pe < te; Pe++)
          de[Pe - 1] = arguments[Pe];
        Se("error", R, de);
      }
    }
    function Se(R, te, de) {
      {
        var Pe = Me.ReactDebugCurrentFrame, Tt = Pe.getStackAddendum();
        Tt !== "" && (te += "%s", de = de.concat([Tt]));
        var Ot = de.map(function(Ze) {
          return String(Ze);
        });
        Ot.unshift("Warning: " + te), Function.prototype.apply.call(console[R], console, Ot);
      }
    }
    var O = !1, be = !1, le = !1, ye = !1, ht = !1, yt;
    yt = Symbol.for("react.module.reference");
    function Je(R) {
      return !!(typeof R == "string" || typeof R == "function" || R === p || R === w || ht || R === y || R === A || R === U || ye || R === Q || O || be || le || typeof R == "object" && R !== null && (R.$$typeof === X || R.$$typeof === W || R.$$typeof === S || R.$$typeof === D || R.$$typeof === _ || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      R.$$typeof === yt || R.getModuleId !== void 0));
    }
    function Ke(R, te, de) {
      var Pe = R.displayName;
      if (Pe)
        return Pe;
      var Tt = te.displayName || te.name || "";
      return Tt !== "" ? de + "(" + Tt + ")" : de;
    }
    function ft(R) {
      return R.displayName || "Context";
    }
    function Ee(R) {
      if (R == null)
        return null;
      if (typeof R.tag == "number" && ve("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof R == "function")
        return R.displayName || R.name || null;
      if (typeof R == "string")
        return R;
      switch (R) {
        case p:
          return "Fragment";
        case c:
          return "Portal";
        case w:
          return "Profiler";
        case y:
          return "StrictMode";
        case A:
          return "Suspense";
        case U:
          return "SuspenseList";
      }
      if (typeof R == "object")
        switch (R.$$typeof) {
          case D:
            var te = R;
            return ft(te) + ".Consumer";
          case S:
            var de = R;
            return ft(de._context) + ".Provider";
          case _:
            return Ke(R, R.render, "ForwardRef");
          case W:
            var Pe = R.displayName || null;
            return Pe !== null ? Pe : Ee(R.type) || "Memo";
          case X: {
            var Tt = R, Ot = Tt._payload, Ze = Tt._init;
            try {
              return Ee(Ze(Ot));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var Ge = Object.assign, xt = 0, it, _t, J, De, se, ot, ut;
    function Kt() {
    }
    Kt.__reactDisabledLog = !0;
    function Zt() {
      {
        if (xt === 0) {
          it = console.log, _t = console.info, J = console.warn, De = console.error, se = console.group, ot = console.groupCollapsed, ut = console.groupEnd;
          var R = {
            configurable: !0,
            enumerable: !0,
            value: Kt,
            writable: !0
          };
          Object.defineProperties(console, {
            info: R,
            log: R,
            warn: R,
            error: R,
            group: R,
            groupCollapsed: R,
            groupEnd: R
          });
        }
        xt++;
      }
    }
    function fn() {
      {
        if (xt--, xt === 0) {
          var R = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: Ge({}, R, {
              value: it
            }),
            info: Ge({}, R, {
              value: _t
            }),
            warn: Ge({}, R, {
              value: J
            }),
            error: Ge({}, R, {
              value: De
            }),
            group: Ge({}, R, {
              value: se
            }),
            groupCollapsed: Ge({}, R, {
              value: ot
            }),
            groupEnd: Ge({}, R, {
              value: ut
            })
          });
        }
        xt < 0 && ve("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var zt = Me.ReactCurrentDispatcher, On;
    function $t(R, te, de) {
      {
        if (On === void 0)
          try {
            throw Error();
          } catch (Tt) {
            var Pe = Tt.stack.trim().match(/\n( *(at )?)/);
            On = Pe && Pe[1] || "";
          }
        return `
` + On + R;
      }
    }
    var mn = !1, xn;
    {
      var yn = typeof WeakMap == "function" ? WeakMap : Map;
      xn = new yn();
    }
    function Vn(R, te) {
      if (!R || mn)
        return "";
      {
        var de = xn.get(R);
        if (de !== void 0)
          return de;
      }
      var Pe;
      mn = !0;
      var Tt = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var Ot;
      Ot = zt.current, zt.current = null, Zt();
      try {
        if (te) {
          var Ze = function() {
            throw Error();
          };
          if (Object.defineProperty(Ze.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(Ze, []);
            } catch (_r) {
              Pe = _r;
            }
            Reflect.construct(R, [], Ze);
          } else {
            try {
              Ze.call();
            } catch (_r) {
              Pe = _r;
            }
            R.call(Ze.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (_r) {
            Pe = _r;
          }
          R();
        }
      } catch (_r) {
        if (_r && Pe && typeof _r.stack == "string") {
          for (var gt = _r.stack.split(`
`), rr = Pe.stack.split(`
`), ln = gt.length - 1, gn = rr.length - 1; ln >= 1 && gn >= 0 && gt[ln] !== rr[gn]; )
            gn--;
          for (; ln >= 1 && gn >= 0; ln--, gn--)
            if (gt[ln] !== rr[gn]) {
              if (ln !== 1 || gn !== 1)
                do
                  if (ln--, gn--, gn < 0 || gt[ln] !== rr[gn]) {
                    var Wr = `
` + gt[ln].replace(" at new ", " at ");
                    return R.displayName && Wr.includes("<anonymous>") && (Wr = Wr.replace("<anonymous>", R.displayName)), typeof R == "function" && xn.set(R, Wr), Wr;
                  }
                while (ln >= 1 && gn >= 0);
              break;
            }
        }
      } finally {
        mn = !1, zt.current = Ot, fn(), Error.prepareStackTrace = Tt;
      }
      var yl = R ? R.displayName || R.name : "", Ft = yl ? $t(yl) : "";
      return typeof R == "function" && xn.set(R, Ft), Ft;
    }
    function Ie(R, te, de) {
      return Vn(R, !1);
    }
    function vt(R) {
      var te = R.prototype;
      return !!(te && te.isReactComponent);
    }
    function Gt(R, te, de) {
      if (R == null)
        return "";
      if (typeof R == "function")
        return Vn(R, vt(R));
      if (typeof R == "string")
        return $t(R);
      switch (R) {
        case A:
          return $t("Suspense");
        case U:
          return $t("SuspenseList");
      }
      if (typeof R == "object")
        switch (R.$$typeof) {
          case _:
            return Ie(R.render);
          case W:
            return Gt(R.type, te, de);
          case X: {
            var Pe = R, Tt = Pe._payload, Ot = Pe._init;
            try {
              return Gt(Ot(Tt), te, de);
            } catch {
            }
          }
        }
      return "";
    }
    var Jt = Object.prototype.hasOwnProperty, dn = {}, Bn = Me.ReactDebugCurrentFrame;
    function zn(R) {
      if (R) {
        var te = R._owner, de = Gt(R.type, R._source, te ? te.type : null);
        Bn.setExtraStackFrame(de);
      } else
        Bn.setExtraStackFrame(null);
    }
    function In(R, te, de, Pe, Tt) {
      {
        var Ot = Function.call.bind(Jt);
        for (var Ze in R)
          if (Ot(R, Ze)) {
            var gt = void 0;
            try {
              if (typeof R[Ze] != "function") {
                var rr = Error((Pe || "React class") + ": " + de + " type `" + Ze + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof R[Ze] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw rr.name = "Invariant Violation", rr;
              }
              gt = R[Ze](te, Ze, Pe, de, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (ln) {
              gt = ln;
            }
            gt && !(gt instanceof Error) && (zn(Tt), ve("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", Pe || "React class", de, Ze, typeof gt), zn(null)), gt instanceof Error && !(gt.message in dn) && (dn[gt.message] = !0, zn(Tt), ve("Failed %s type: %s", de, gt.message), zn(null));
          }
      }
    }
    var Wn = Array.isArray;
    function fr(R) {
      return Wn(R);
    }
    function Mn(R) {
      {
        var te = typeof Symbol == "function" && Symbol.toStringTag, de = te && R[Symbol.toStringTag] || R.constructor.name || "Object";
        return de;
      }
    }
    function xr(R) {
      try {
        return tr(R), !1;
      } catch {
        return !0;
      }
    }
    function tr(R) {
      return "" + R;
    }
    function Tr(R) {
      if (xr(R))
        return ve("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", Mn(R)), tr(R);
    }
    var an = Me.ReactCurrentOwner, nr = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, mi, sa, fe;
    fe = {};
    function Ye(R) {
      if (Jt.call(R, "ref")) {
        var te = Object.getOwnPropertyDescriptor(R, "ref").get;
        if (te && te.isReactWarning)
          return !1;
      }
      return R.ref !== void 0;
    }
    function mt(R) {
      if (Jt.call(R, "key")) {
        var te = Object.getOwnPropertyDescriptor(R, "key").get;
        if (te && te.isReactWarning)
          return !1;
      }
      return R.key !== void 0;
    }
    function P(R, te) {
      if (typeof R.ref == "string" && an.current && te && an.current.stateNode !== te) {
        var de = Ee(an.current.type);
        fe[de] || (ve('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', Ee(an.current.type), R.ref), fe[de] = !0);
      }
    }
    function ue(R, te) {
      {
        var de = function() {
          mi || (mi = !0, ve("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", te));
        };
        de.isReactWarning = !0, Object.defineProperty(R, "key", {
          get: de,
          configurable: !0
        });
      }
    }
    function ke(R, te) {
      {
        var de = function() {
          sa || (sa = !0, ve("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", te));
        };
        de.isReactWarning = !0, Object.defineProperty(R, "ref", {
          get: de,
          configurable: !0
        });
      }
    }
    var qe = function(R, te, de, Pe, Tt, Ot, Ze) {
      var gt = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: u,
        // Built-in properties that belong on the element
        type: R,
        key: te,
        ref: de,
        props: Ze,
        // Record the component responsible for creating this element.
        _owner: Ot
      };
      return gt._store = {}, Object.defineProperty(gt._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(gt, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: Pe
      }), Object.defineProperty(gt, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: Tt
      }), Object.freeze && (Object.freeze(gt.props), Object.freeze(gt)), gt;
    };
    function tt(R, te, de, Pe, Tt) {
      {
        var Ot, Ze = {}, gt = null, rr = null;
        de !== void 0 && (Tr(de), gt = "" + de), mt(te) && (Tr(te.key), gt = "" + te.key), Ye(te) && (rr = te.ref, P(te, Tt));
        for (Ot in te)
          Jt.call(te, Ot) && !nr.hasOwnProperty(Ot) && (Ze[Ot] = te[Ot]);
        if (R && R.defaultProps) {
          var ln = R.defaultProps;
          for (Ot in ln)
            Ze[Ot] === void 0 && (Ze[Ot] = ln[Ot]);
        }
        if (gt || rr) {
          var gn = typeof R == "function" ? R.displayName || R.name || "Unknown" : R;
          gt && ue(Ze, gn), rr && ke(Ze, gn);
        }
        return qe(R, gt, rr, Tt, Pe, an.current, Ze);
      }
    }
    var pt = Me.ReactCurrentOwner, tn = Me.ReactDebugCurrentFrame;
    function kt(R) {
      if (R) {
        var te = R._owner, de = Gt(R.type, R._source, te ? te.type : null);
        tn.setExtraStackFrame(de);
      } else
        tn.setExtraStackFrame(null);
    }
    var Bt;
    Bt = !1;
    function Ir(R) {
      return typeof R == "object" && R !== null && R.$$typeof === u;
    }
    function Za() {
      {
        if (pt.current) {
          var R = Ee(pt.current.type);
          if (R)
            return `

Check the render method of \`` + R + "`.";
        }
        return "";
      }
    }
    function Ja(R) {
      return "";
    }
    var xa = {};
    function Jo(R) {
      {
        var te = Za();
        if (!te) {
          var de = typeof R == "string" ? R : R.displayName || R.name;
          de && (te = `

Check the top-level render call using <` + de + ">.");
        }
        return te;
      }
    }
    function ei(R, te) {
      {
        if (!R._store || R._store.validated || R.key != null)
          return;
        R._store.validated = !0;
        var de = Jo(te);
        if (xa[de])
          return;
        xa[de] = !0;
        var Pe = "";
        R && R._owner && R._owner !== pt.current && (Pe = " It was passed a child from " + Ee(R._owner.type) + "."), kt(R), ve('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', de, Pe), kt(null);
      }
    }
    function ti(R, te) {
      {
        if (typeof R != "object")
          return;
        if (fr(R))
          for (var de = 0; de < R.length; de++) {
            var Pe = R[de];
            Ir(Pe) && ei(Pe, te);
          }
        else if (Ir(R))
          R._store && (R._store.validated = !0);
        else if (R) {
          var Tt = ce(R);
          if (typeof Tt == "function" && Tt !== R.entries)
            for (var Ot = Tt.call(R), Ze; !(Ze = Ot.next()).done; )
              Ir(Ze.value) && ei(Ze.value, te);
        }
      }
    }
    function Jl(R) {
      {
        var te = R.type;
        if (te == null || typeof te == "string")
          return;
        var de;
        if (typeof te == "function")
          de = te.propTypes;
        else if (typeof te == "object" && (te.$$typeof === _ || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        te.$$typeof === W))
          de = te.propTypes;
        else
          return;
        if (de) {
          var Pe = Ee(te);
          In(de, R.props, "prop", Pe, R);
        } else if (te.PropTypes !== void 0 && !Bt) {
          Bt = !0;
          var Tt = Ee(te);
          ve("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", Tt || "Unknown");
        }
        typeof te.getDefaultProps == "function" && !te.getDefaultProps.isReactClassApproved && ve("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function eu(R) {
      {
        for (var te = Object.keys(R.props), de = 0; de < te.length; de++) {
          var Pe = te[de];
          if (Pe !== "children" && Pe !== "key") {
            kt(R), ve("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", Pe), kt(null);
            break;
          }
        }
        R.ref !== null && (kt(R), ve("Invalid attribute `ref` supplied to `React.Fragment`."), kt(null));
      }
    }
    var yi = {};
    function Hi(R, te, de, Pe, Tt, Ot) {
      {
        var Ze = Je(R);
        if (!Ze) {
          var gt = "";
          (R === void 0 || typeof R == "object" && R !== null && Object.keys(R).length === 0) && (gt += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var rr = Ja();
          rr ? gt += rr : gt += Za();
          var ln;
          R === null ? ln = "null" : fr(R) ? ln = "array" : R !== void 0 && R.$$typeof === u ? (ln = "<" + (Ee(R.type) || "Unknown") + " />", gt = " Did you accidentally export a JSX literal instead of a component?") : ln = typeof R, ve("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", ln, gt);
        }
        var gn = tt(R, te, de, Tt, Ot);
        if (gn == null)
          return gn;
        if (Ze) {
          var Wr = te.children;
          if (Wr !== void 0)
            if (Pe)
              if (fr(Wr)) {
                for (var yl = 0; yl < Wr.length; yl++)
                  ti(Wr[yl], R);
                Object.freeze && Object.freeze(Wr);
              } else
                ve("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              ti(Wr, R);
        }
        if (Jt.call(te, "key")) {
          var Ft = Ee(R), _r = Object.keys(te).filter(function(gi) {
            return gi !== "key";
          }), fa = _r.length > 0 ? "{key: someKey, " + _r.join(": ..., ") + ": ...}" : "{key: someKey}";
          if (!yi[Ft + fa]) {
            var St = _r.length > 0 ? "{" + _r.join(": ..., ") + ": ...}" : "{}";
            ve(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, fa, Ft, St, Ft), yi[Ft + fa] = !0;
          }
        }
        return R === p ? eu(gn) : Jl(gn), gn;
      }
    }
    function ca(R, te, de) {
      return Hi(R, te, de, !0);
    }
    function ni(R, te, de) {
      return Hi(R, te, de, !1);
    }
    var ml = ni, eo = ca;
    ev.Fragment = p, ev.jsx = ml, ev.jsxs = eo;
  }()), ev;
}
process.env.NODE_ENV === "production" ? BE.exports = gL() : BE.exports = SL();
var z = BE.exports;
const EL = ({
  header: i,
  footer: u,
  navItems: c,
  children: p,
  state: y,
  onStateChange: w
}) => /* @__PURE__ */ z.jsx("div", { className: "blue-orange-chat-sidebar-wrapper", children: /* @__PURE__ */ z.jsxs(
  aL,
  {
    state: y,
    changeState: w,
    resizable: !0,
    filter: !0,
    children: [
      /* @__PURE__ */ z.jsx(iL, { children: i }),
      /* @__PURE__ */ z.jsxs(lL, { children: [
        c,
        p
      ] }),
      /* @__PURE__ */ z.jsx(oL, { children: u })
    ]
  }
) }), wL = ({
  workspaceName: i,
  workspaceMedia: u,
  sidebarState: c,
  onStateChange: p,
  onNewChat: y,
  onWorkspaceClick: w
}) => /* @__PURE__ */ z.jsx(
  uL,
  {
    label: i,
    labelStyle: { fontWeight: 700, fontSize: "16px" },
    state: c,
    media: u,
    headerItemClicked: w,
    changeState: p,
    action: y ? /* @__PURE__ */ z.jsx(
      KT,
      {
        icon: "ri-edit-box-line",
        onClick: y
      }
    ) : void 0
  }
), CL = (i) => {
  if (i.type === VE.CHANNEL)
    return /* @__PURE__ */ z.jsx("i", { className: "ri-hashtag blue-orange-chat-sidebar-item-channel-icon" });
  if (i.type === VE.DM) {
    const c = i.members.find((p) => p.user.id !== i.id) || i.members[0];
    if (c) {
      const p = bL(c.status);
      return /* @__PURE__ */ z.jsx("span", { className: `blue-orange-chat-sidebar-item-status-dot ${p}` });
    }
  }
  return /* @__PURE__ */ z.jsx("i", { className: "ri-group-line" });
}, bL = (i) => {
  switch (i) {
    case er.ONLINE:
      return "blue-orange-chat-sidebar-item-status-online";
    case er.AWAY:
      return "blue-orange-chat-sidebar-item-status-away";
    case er.DND:
      return "blue-orange-chat-sidebar-item-status-dnd";
    case er.OFFLINE:
    default:
      return "blue-orange-chat-sidebar-item-status-offline";
  }
}, xL = ({
  conversation: i,
  active: u = !1,
  onClick: c,
  onContextMenu: p
}) => {
  const y = () => {
    c && c(i);
  }, w = i.unreadCount > 0, S = w ? /* @__PURE__ */ z.jsx("span", { className: "blue-orange-chat-sidebar-item-unread-badge", children: i.unreadCount }) : void 0, D = w ? { fontWeight: 700 } : {};
  return /* @__PURE__ */ z.jsx(
    ZT,
    {
      label: i.name,
      active: u,
      focused: !1,
      icon: CL(i),
      badge: S,
      defaultStyle: D,
      activeStyle: D,
      onClick: y
    }
  );
}, TL = ({
  label: i,
  conversations: u,
  collapsed: c = !1,
  onToggle: p,
  onCreateNew: y,
  icon: w,
  activeConversationId: S,
  onConversationClick: D,
  onConversationContextMenu: _
}) => {
  const A = (U) => {
    p && p();
  };
  return /* @__PURE__ */ z.jsxs(
    sL,
    {
      opened: !c,
      onOpenedChange: A,
      children: [
        /* @__PURE__ */ z.jsx(
          cL,
          {
            label: i,
            icon: w ? /* @__PURE__ */ z.jsx("i", { className: w }) : void 0,
            hoverEffects: !!y,
            hoverItems: y ? /* @__PURE__ */ z.jsx(
              KT,
              {
                icon: "ri-add-line",
                onClick: y
              }
            ) : void 0
          }
        ),
        u.map((U) => /* @__PURE__ */ z.jsx(
          xL,
          {
            conversation: U,
            active: S === U.id,
            onClick: D,
            onContextMenu: _
          },
          U.id
        ))
      ]
    }
  );
}, _L = {
  [er.ONLINE]: "blue-orange-chat-sidebar-footer-status-online",
  [er.AWAY]: "blue-orange-chat-sidebar-footer-status-away",
  [er.DND]: "blue-orange-chat-sidebar-footer-status-dnd",
  [er.OFFLINE]: "blue-orange-chat-sidebar-footer-status-offline"
};
er.ONLINE + "", er.AWAY + "", er.DND + "", er.OFFLINE + "";
const RL = ({
  user: i,
  onStatusChange: u,
  onSettingsClick: c,
  onProfileClick: p
}) => /* @__PURE__ */ z.jsxs("div", { className: "blue-orange-chat-sidebar-footer-container", children: [
  /* @__PURE__ */ z.jsxs(
    "div",
    {
      className: "blue-orange-chat-sidebar-footer-avatar-wrapper",
      onClick: p,
      children: [
        /* @__PURE__ */ z.jsx(iw, { user: i.user, height: 28, width: 28 }),
        /* @__PURE__ */ z.jsx(
          "span",
          {
            className: `blue-orange-chat-sidebar-footer-status-dot ${_L[i.status]}`
          }
        )
      ]
    }
  ),
  /* @__PURE__ */ z.jsx("div", { className: "blue-orange-chat-sidebar-footer-info", children: /* @__PURE__ */ z.jsx("span", { className: "blue-orange-chat-sidebar-footer-name", children: i.user.name }) }),
  /* @__PURE__ */ z.jsx(
    "button",
    {
      className: "blue-orange-chat-sidebar-footer-settings-btn",
      onClick: c,
      type: "button",
      children: /* @__PURE__ */ z.jsx("i", { className: "ri-settings-3-line" })
    }
  )
] }), DL = ({
  messages: i,
  onLoadMore: u,
  loading: c,
  hasMore: p,
  children: y
}) => {
  const w = $o(null), S = $o(null), D = $o(i.length), _ = ls(() => {
    const U = w.current;
    return U ? U.scrollHeight - U.scrollTop - U.clientHeight <= 100 : !0;
  }, []), A = ls(() => {
    const U = w.current;
    U && (U.scrollTop = U.scrollHeight);
  }, []);
  return Md(() => {
    const U = i.length, W = D.current;
    U > W && _() && requestAnimationFrame(() => {
      A();
    }), D.current = U;
  }, [i, _, A]), Md(() => {
    requestAnimationFrame(() => {
      A();
    });
  }, [A]), Md(() => {
    const U = S.current, W = w.current;
    if (!U || !W) return;
    const X = new IntersectionObserver(
      (Q) => {
        Q[0].isIntersecting && p && !c && u();
      },
      {
        root: W,
        rootMargin: "100px 0px 0px 0px",
        threshold: 0
      }
    );
    return X.observe(U), () => {
      X.disconnect();
    };
  }, [p, c, u]), /* @__PURE__ */ z.jsxs("div", { ref: w, className: "blue-orange-chat-window", children: [
    /* @__PURE__ */ z.jsxs("div", { className: "blue-orange-chat-window-messages", children: [
      /* @__PURE__ */ z.jsx("div", { ref: S, className: "blue-orange-chat-window-sentinel" }),
      c && /* @__PURE__ */ z.jsx("div", { className: "blue-orange-chat-window-loading", children: /* @__PURE__ */ z.jsx("div", { className: "blue-orange-chat-window-spinner" }) }),
      i.map((U) => /* @__PURE__ */ z.jsx("div", { className: "blue-orange-chat-window-message", children: /* @__PURE__ */ z.jsx("div", { className: "blue-orange-chat-window-message-content", children: U.content }) }, U.id))
    ] }),
    y
  ] });
};
//! moment.js
//! version : 2.30.1
//! authors : Tim Wood, Iskren Chernev, Moment.js contributors
//! license : MIT
//! momentjs.com
var JT;
function me() {
  return JT.apply(null, arguments);
}
function kL(i) {
  JT = i;
}
function pl(i) {
  return i instanceof Array || Object.prototype.toString.call(i) === "[object Array]";
}
function xc(i) {
  return i != null && Object.prototype.toString.call(i) === "[object Object]";
}
function Pt(i, u) {
  return Object.prototype.hasOwnProperty.call(i, u);
}
function lw(i) {
  if (Object.getOwnPropertyNames)
    return Object.getOwnPropertyNames(i).length === 0;
  var u;
  for (u in i)
    if (Pt(i, u))
      return !1;
  return !0;
}
function qa(i) {
  return i === void 0;
}
function qo(i) {
  return typeof i == "number" || Object.prototype.toString.call(i) === "[object Number]";
}
function mv(i) {
  return i instanceof Date || Object.prototype.toString.call(i) === "[object Date]";
}
function e_(i, u) {
  var c = [], p, y = i.length;
  for (p = 0; p < y; ++p)
    c.push(u(i[p], p));
  return c;
}
function os(i, u) {
  for (var c in u)
    Pt(u, c) && (i[c] = u[c]);
  return Pt(u, "toString") && (i.toString = u.toString), Pt(u, "valueOf") && (i.valueOf = u.valueOf), i;
}
function Kl(i, u, c, p) {
  return b_(i, u, c, p, !0).utc();
}
function OL() {
  return {
    empty: !1,
    unusedTokens: [],
    unusedInput: [],
    overflow: -2,
    charsLeftOver: 0,
    nullInput: !1,
    invalidEra: null,
    invalidMonth: null,
    invalidFormat: !1,
    userInvalidated: !1,
    iso: !1,
    parsedDateParts: [],
    era: null,
    meridiem: null,
    rfc2822: !1,
    weekdayMismatch: !1
  };
}
function wt(i) {
  return i._pf == null && (i._pf = OL()), i._pf;
}
var IE;
Array.prototype.some ? IE = Array.prototype.some : IE = function(i) {
  var u = Object(this), c = u.length >>> 0, p;
  for (p = 0; p < c; p++)
    if (p in u && i.call(this, u[p], p, u))
      return !0;
  return !1;
};
function ow(i) {
  var u = null, c = !1, p = i._d && !isNaN(i._d.getTime());
  if (p && (u = wt(i), c = IE.call(u.parsedDateParts, function(y) {
    return y != null;
  }), p = u.overflow < 0 && !u.empty && !u.invalidEra && !u.invalidMonth && !u.invalidWeekday && !u.weekdayMismatch && !u.nullInput && !u.invalidFormat && !u.userInvalidated && (!u.meridiem || u.meridiem && c), i._strict && (p = p && u.charsLeftOver === 0 && u.unusedTokens.length === 0 && u.bigHour === void 0)), Object.isFrozen == null || !Object.isFrozen(i))
    i._isValid = p;
  else
    return p;
  return i._isValid;
}
function $g(i) {
  var u = Kl(NaN);
  return i != null ? os(wt(u), i) : wt(u).userInvalidated = !0, u;
}
var ST = me.momentProperties = [], NE = !1;
function uw(i, u) {
  var c, p, y, w = ST.length;
  if (qa(u._isAMomentObject) || (i._isAMomentObject = u._isAMomentObject), qa(u._i) || (i._i = u._i), qa(u._f) || (i._f = u._f), qa(u._l) || (i._l = u._l), qa(u._strict) || (i._strict = u._strict), qa(u._tzm) || (i._tzm = u._tzm), qa(u._isUTC) || (i._isUTC = u._isUTC), qa(u._offset) || (i._offset = u._offset), qa(u._pf) || (i._pf = wt(u)), qa(u._locale) || (i._locale = u._locale), w > 0)
    for (c = 0; c < w; c++)
      p = ST[c], y = u[p], qa(y) || (i[p] = y);
  return i;
}
function yv(i) {
  uw(this, i), this._d = new Date(i._d != null ? i._d.getTime() : NaN), this.isValid() || (this._d = /* @__PURE__ */ new Date(NaN)), NE === !1 && (NE = !0, me.updateOffset(this), NE = !1);
}
function hl(i) {
  return i instanceof yv || i != null && i._isAMomentObject != null;
}
function t_(i) {
  me.suppressDeprecationWarnings === !1 && typeof console < "u" && console.warn && console.warn("Deprecation warning: " + i);
}
function ji(i, u) {
  var c = !0;
  return os(function() {
    if (me.deprecationHandler != null && me.deprecationHandler(null, i), c) {
      var p = [], y, w, S, D = arguments.length;
      for (w = 0; w < D; w++) {
        if (y = "", typeof arguments[w] == "object") {
          y += `
[` + w + "] ";
          for (S in arguments[0])
            Pt(arguments[0], S) && (y += S + ": " + arguments[0][S] + ", ");
          y = y.slice(0, -2);
        } else
          y = arguments[w];
        p.push(y);
      }
      t_(
        i + `
Arguments: ` + Array.prototype.slice.call(p).join("") + `
` + new Error().stack
      ), c = !1;
    }
    return u.apply(this, arguments);
  }, u);
}
var ET = {};
function n_(i, u) {
  me.deprecationHandler != null && me.deprecationHandler(i, u), ET[i] || (t_(u), ET[i] = !0);
}
me.suppressDeprecationWarnings = !1;
me.deprecationHandler = null;
function Zl(i) {
  return typeof Function < "u" && i instanceof Function || Object.prototype.toString.call(i) === "[object Function]";
}
function ML(i) {
  var u, c;
  for (c in i)
    Pt(i, c) && (u = i[c], Zl(u) ? this[c] = u : this["_" + c] = u);
  this._config = i, this._dayOfMonthOrdinalParseLenient = new RegExp(
    (this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) + "|" + /\d{1,2}/.source
  );
}
function WE(i, u) {
  var c = os({}, i), p;
  for (p in u)
    Pt(u, p) && (xc(i[p]) && xc(u[p]) ? (c[p] = {}, os(c[p], i[p]), os(c[p], u[p])) : u[p] != null ? c[p] = u[p] : delete c[p]);
  for (p in i)
    Pt(i, p) && !Pt(u, p) && xc(i[p]) && (c[p] = os({}, c[p]));
  return c;
}
function sw(i) {
  i != null && this.set(i);
}
var $E;
Object.keys ? $E = Object.keys : $E = function(i) {
  var u, c = [];
  for (u in i)
    Pt(i, u) && c.push(u);
  return c;
};
var NL = {
  sameDay: "[Today at] LT",
  nextDay: "[Tomorrow at] LT",
  nextWeek: "dddd [at] LT",
  lastDay: "[Yesterday at] LT",
  lastWeek: "[Last] dddd [at] LT",
  sameElse: "L"
};
function LL(i, u, c) {
  var p = this._calendar[i] || this._calendar.sameElse;
  return Zl(p) ? p.call(u, c) : p;
}
function ql(i, u, c) {
  var p = "" + Math.abs(i), y = u - p.length, w = i >= 0;
  return (w ? c ? "+" : "" : "-") + Math.pow(10, Math.max(0, y)).toString().substr(1) + p;
}
var cw = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|N{1,5}|YYYYYY|YYYYY|YYYY|YY|y{2,4}|yo?|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g, _g = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g, LE = {}, Nd = {};
function $e(i, u, c, p) {
  var y = p;
  typeof p == "string" && (y = function() {
    return this[p]();
  }), i && (Nd[i] = y), u && (Nd[u[0]] = function() {
    return ql(y.apply(this, arguments), u[1], u[2]);
  }), c && (Nd[c] = function() {
    return this.localeData().ordinal(
      y.apply(this, arguments),
      i
    );
  });
}
function AL(i) {
  return i.match(/\[[\s\S]/) ? i.replace(/^\[|\]$/g, "") : i.replace(/\\/g, "");
}
function UL(i) {
  var u = i.match(cw), c, p;
  for (c = 0, p = u.length; c < p; c++)
    Nd[u[c]] ? u[c] = Nd[u[c]] : u[c] = AL(u[c]);
  return function(y) {
    var w = "", S;
    for (S = 0; S < p; S++)
      w += Zl(u[S]) ? u[S].call(y, i) : u[S];
    return w;
  };
}
function Lg(i, u) {
  return i.isValid() ? (u = r_(u, i.localeData()), LE[u] = LE[u] || UL(u), LE[u](i)) : i.localeData().invalidDate();
}
function r_(i, u) {
  var c = 5;
  function p(y) {
    return u.longDateFormat(y) || y;
  }
  for (_g.lastIndex = 0; c >= 0 && _g.test(i); )
    i = i.replace(
      _g,
      p
    ), _g.lastIndex = 0, c -= 1;
  return i;
}
var zL = {
  LTS: "h:mm:ss A",
  LT: "h:mm A",
  L: "MM/DD/YYYY",
  LL: "MMMM D, YYYY",
  LLL: "MMMM D, YYYY h:mm A",
  LLLL: "dddd, MMMM D, YYYY h:mm A"
};
function jL(i) {
  var u = this._longDateFormat[i], c = this._longDateFormat[i.toUpperCase()];
  return u || !c ? u : (this._longDateFormat[i] = c.match(cw).map(function(p) {
    return p === "MMMM" || p === "MM" || p === "DD" || p === "dddd" ? p.slice(1) : p;
  }).join(""), this._longDateFormat[i]);
}
var FL = "Invalid date";
function HL() {
  return this._invalidDate;
}
var YL = "%d", PL = /\d{1,2}/;
function VL(i) {
  return this._ordinal.replace("%d", i);
}
var BL = {
  future: "in %s",
  past: "%s ago",
  s: "a few seconds",
  ss: "%d seconds",
  m: "a minute",
  mm: "%d minutes",
  h: "an hour",
  hh: "%d hours",
  d: "a day",
  dd: "%d days",
  w: "a week",
  ww: "%d weeks",
  M: "a month",
  MM: "%d months",
  y: "a year",
  yy: "%d years"
};
function IL(i, u, c, p) {
  var y = this._relativeTime[c];
  return Zl(y) ? y(i, u, c, p) : y.replace(/%d/i, i);
}
function WL(i, u) {
  var c = this._relativeTime[i > 0 ? "future" : "past"];
  return Zl(c) ? c(u) : c.replace(/%s/i, u);
}
var wT = {
  D: "date",
  dates: "date",
  date: "date",
  d: "day",
  days: "day",
  day: "day",
  e: "weekday",
  weekdays: "weekday",
  weekday: "weekday",
  E: "isoWeekday",
  isoweekdays: "isoWeekday",
  isoweekday: "isoWeekday",
  DDD: "dayOfYear",
  dayofyears: "dayOfYear",
  dayofyear: "dayOfYear",
  h: "hour",
  hours: "hour",
  hour: "hour",
  ms: "millisecond",
  milliseconds: "millisecond",
  millisecond: "millisecond",
  m: "minute",
  minutes: "minute",
  minute: "minute",
  M: "month",
  months: "month",
  month: "month",
  Q: "quarter",
  quarters: "quarter",
  quarter: "quarter",
  s: "second",
  seconds: "second",
  second: "second",
  gg: "weekYear",
  weekyears: "weekYear",
  weekyear: "weekYear",
  GG: "isoWeekYear",
  isoweekyears: "isoWeekYear",
  isoweekyear: "isoWeekYear",
  w: "week",
  weeks: "week",
  week: "week",
  W: "isoWeek",
  isoweeks: "isoWeek",
  isoweek: "isoWeek",
  y: "year",
  years: "year",
  year: "year"
};
function Fi(i) {
  return typeof i == "string" ? wT[i] || wT[i.toLowerCase()] : void 0;
}
function fw(i) {
  var u = {}, c, p;
  for (p in i)
    Pt(i, p) && (c = Fi(p), c && (u[c] = i[p]));
  return u;
}
var $L = {
  date: 9,
  day: 11,
  weekday: 11,
  isoWeekday: 11,
  dayOfYear: 4,
  hour: 13,
  millisecond: 16,
  minute: 14,
  month: 8,
  quarter: 7,
  second: 15,
  weekYear: 1,
  isoWeekYear: 1,
  week: 5,
  isoWeek: 5,
  year: 1
};
function GL(i) {
  var u = [], c;
  for (c in i)
    Pt(i, c) && u.push({ unit: c, priority: $L[c] });
  return u.sort(function(p, y) {
    return p.priority - y.priority;
  }), u;
}
var a_ = /\d/, vi = /\d\d/, i_ = /\d{3}/, dw = /\d{4}/, Gg = /[+-]?\d{6}/, bn = /\d\d?/, l_ = /\d\d\d\d?/, o_ = /\d\d\d\d\d\d?/, Qg = /\d{1,3}/, pw = /\d{1,4}/, qg = /[+-]?\d{1,6}/, Hd = /\d+/, Xg = /[+-]?\d+/, QL = /Z|[+-]\d\d:?\d\d/gi, Kg = /Z|[+-]\d\d(?::?\d\d)?/gi, qL = /[+-]?\d+(\.\d{1,3})?/, gv = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i, Yd = /^[1-9]\d?/, hw = /^([1-9]\d|\d)/, jg;
jg = {};
function Oe(i, u, c) {
  jg[i] = Zl(u) ? u : function(p, y) {
    return p && c ? c : u;
  };
}
function XL(i, u) {
  return Pt(jg, i) ? jg[i](u._strict, u._locale) : new RegExp(KL(i));
}
function KL(i) {
  return Go(
    i.replace("\\", "").replace(
      /\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g,
      function(u, c, p, y, w) {
        return c || p || y || w;
      }
    )
  );
}
function Go(i) {
  return i.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}
function Li(i) {
  return i < 0 ? Math.ceil(i) || 0 : Math.floor(i);
}
function Mt(i) {
  var u = +i, c = 0;
  return u !== 0 && isFinite(u) && (c = Li(u)), c;
}
var GE = {};
function rn(i, u) {
  var c, p = u, y;
  for (typeof i == "string" && (i = [i]), qo(u) && (p = function(w, S) {
    S[u] = Mt(w);
  }), y = i.length, c = 0; c < y; c++)
    GE[i[c]] = p;
}
function Sv(i, u) {
  rn(i, function(c, p, y, w) {
    y._w = y._w || {}, u(c, y._w, y, w);
  });
}
function ZL(i, u, c) {
  u != null && Pt(GE, i) && GE[i](u, c._a, c, i);
}
function Zg(i) {
  return i % 4 === 0 && i % 100 !== 0 || i % 400 === 0;
}
var ua = 0, Io = 1, Gl = 2, br = 3, dl = 4, Wo = 5, bc = 6, JL = 7, eA = 8;
$e("Y", 0, 0, function() {
  var i = this.year();
  return i <= 9999 ? ql(i, 4) : "+" + i;
});
$e(0, ["YY", 2], 0, function() {
  return this.year() % 100;
});
$e(0, ["YYYY", 4], 0, "year");
$e(0, ["YYYYY", 5], 0, "year");
$e(0, ["YYYYYY", 6, !0], 0, "year");
Oe("Y", Xg);
Oe("YY", bn, vi);
Oe("YYYY", pw, dw);
Oe("YYYYY", qg, Gg);
Oe("YYYYYY", qg, Gg);
rn(["YYYYY", "YYYYYY"], ua);
rn("YYYY", function(i, u) {
  u[ua] = i.length === 2 ? me.parseTwoDigitYear(i) : Mt(i);
});
rn("YY", function(i, u) {
  u[ua] = me.parseTwoDigitYear(i);
});
rn("Y", function(i, u) {
  u[ua] = parseInt(i, 10);
});
function av(i) {
  return Zg(i) ? 366 : 365;
}
me.parseTwoDigitYear = function(i) {
  return Mt(i) + (Mt(i) > 68 ? 1900 : 2e3);
};
var u_ = Pd("FullYear", !0);
function tA() {
  return Zg(this.year());
}
function Pd(i, u) {
  return function(c) {
    return c != null ? (s_(this, i, c), me.updateOffset(this, u), this) : uv(this, i);
  };
}
function uv(i, u) {
  if (!i.isValid())
    return NaN;
  var c = i._d, p = i._isUTC;
  switch (u) {
    case "Milliseconds":
      return p ? c.getUTCMilliseconds() : c.getMilliseconds();
    case "Seconds":
      return p ? c.getUTCSeconds() : c.getSeconds();
    case "Minutes":
      return p ? c.getUTCMinutes() : c.getMinutes();
    case "Hours":
      return p ? c.getUTCHours() : c.getHours();
    case "Date":
      return p ? c.getUTCDate() : c.getDate();
    case "Day":
      return p ? c.getUTCDay() : c.getDay();
    case "Month":
      return p ? c.getUTCMonth() : c.getMonth();
    case "FullYear":
      return p ? c.getUTCFullYear() : c.getFullYear();
    default:
      return NaN;
  }
}
function s_(i, u, c) {
  var p, y, w, S, D;
  if (!(!i.isValid() || isNaN(c))) {
    switch (p = i._d, y = i._isUTC, u) {
      case "Milliseconds":
        return void (y ? p.setUTCMilliseconds(c) : p.setMilliseconds(c));
      case "Seconds":
        return void (y ? p.setUTCSeconds(c) : p.setSeconds(c));
      case "Minutes":
        return void (y ? p.setUTCMinutes(c) : p.setMinutes(c));
      case "Hours":
        return void (y ? p.setUTCHours(c) : p.setHours(c));
      case "Date":
        return void (y ? p.setUTCDate(c) : p.setDate(c));
      case "FullYear":
        break;
      default:
        return;
    }
    w = c, S = i.month(), D = i.date(), D = D === 29 && S === 1 && !Zg(w) ? 28 : D, y ? p.setUTCFullYear(w, S, D) : p.setFullYear(w, S, D);
  }
}
function nA(i) {
  return i = Fi(i), Zl(this[i]) ? this[i]() : this;
}
function rA(i, u) {
  if (typeof i == "object") {
    i = fw(i);
    var c = GL(i), p, y = c.length;
    for (p = 0; p < y; p++)
      this[c[p].unit](i[c[p].unit]);
  } else if (i = Fi(i), Zl(this[i]))
    return this[i](u);
  return this;
}
function aA(i, u) {
  return (i % u + u) % u;
}
var Jn;
Array.prototype.indexOf ? Jn = Array.prototype.indexOf : Jn = function(i) {
  var u;
  for (u = 0; u < this.length; ++u)
    if (this[u] === i)
      return u;
  return -1;
};
function vw(i, u) {
  if (isNaN(i) || isNaN(u))
    return NaN;
  var c = aA(u, 12);
  return i += (u - c) / 12, c === 1 ? Zg(i) ? 29 : 28 : 31 - c % 7 % 2;
}
$e("M", ["MM", 2], "Mo", function() {
  return this.month() + 1;
});
$e("MMM", 0, 0, function(i) {
  return this.localeData().monthsShort(this, i);
});
$e("MMMM", 0, 0, function(i) {
  return this.localeData().months(this, i);
});
Oe("M", bn, Yd);
Oe("MM", bn, vi);
Oe("MMM", function(i, u) {
  return u.monthsShortRegex(i);
});
Oe("MMMM", function(i, u) {
  return u.monthsRegex(i);
});
rn(["M", "MM"], function(i, u) {
  u[Io] = Mt(i) - 1;
});
rn(["MMM", "MMMM"], function(i, u, c, p) {
  var y = c._locale.monthsParse(i, p, c._strict);
  y != null ? u[Io] = y : wt(c).invalidMonth = i;
});
var iA = "January_February_March_April_May_June_July_August_September_October_November_December".split(
  "_"
), c_ = "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"), f_ = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/, lA = gv, oA = gv;
function uA(i, u) {
  return i ? pl(this._months) ? this._months[i.month()] : this._months[(this._months.isFormat || f_).test(u) ? "format" : "standalone"][i.month()] : pl(this._months) ? this._months : this._months.standalone;
}
function sA(i, u) {
  return i ? pl(this._monthsShort) ? this._monthsShort[i.month()] : this._monthsShort[f_.test(u) ? "format" : "standalone"][i.month()] : pl(this._monthsShort) ? this._monthsShort : this._monthsShort.standalone;
}
function cA(i, u, c) {
  var p, y, w, S = i.toLocaleLowerCase();
  if (!this._monthsParse)
    for (this._monthsParse = [], this._longMonthsParse = [], this._shortMonthsParse = [], p = 0; p < 12; ++p)
      w = Kl([2e3, p]), this._shortMonthsParse[p] = this.monthsShort(
        w,
        ""
      ).toLocaleLowerCase(), this._longMonthsParse[p] = this.months(w, "").toLocaleLowerCase();
  return c ? u === "MMM" ? (y = Jn.call(this._shortMonthsParse, S), y !== -1 ? y : null) : (y = Jn.call(this._longMonthsParse, S), y !== -1 ? y : null) : u === "MMM" ? (y = Jn.call(this._shortMonthsParse, S), y !== -1 ? y : (y = Jn.call(this._longMonthsParse, S), y !== -1 ? y : null)) : (y = Jn.call(this._longMonthsParse, S), y !== -1 ? y : (y = Jn.call(this._shortMonthsParse, S), y !== -1 ? y : null));
}
function fA(i, u, c) {
  var p, y, w;
  if (this._monthsParseExact)
    return cA.call(this, i, u, c);
  for (this._monthsParse || (this._monthsParse = [], this._longMonthsParse = [], this._shortMonthsParse = []), p = 0; p < 12; p++) {
    if (y = Kl([2e3, p]), c && !this._longMonthsParse[p] && (this._longMonthsParse[p] = new RegExp(
      "^" + this.months(y, "").replace(".", "") + "$",
      "i"
    ), this._shortMonthsParse[p] = new RegExp(
      "^" + this.monthsShort(y, "").replace(".", "") + "$",
      "i"
    )), !c && !this._monthsParse[p] && (w = "^" + this.months(y, "") + "|^" + this.monthsShort(y, ""), this._monthsParse[p] = new RegExp(w.replace(".", ""), "i")), c && u === "MMMM" && this._longMonthsParse[p].test(i))
      return p;
    if (c && u === "MMM" && this._shortMonthsParse[p].test(i))
      return p;
    if (!c && this._monthsParse[p].test(i))
      return p;
  }
}
function d_(i, u) {
  if (!i.isValid())
    return i;
  if (typeof u == "string") {
    if (/^\d+$/.test(u))
      u = Mt(u);
    else if (u = i.localeData().monthsParse(u), !qo(u))
      return i;
  }
  var c = u, p = i.date();
  return p = p < 29 ? p : Math.min(p, vw(i.year(), c)), i._isUTC ? i._d.setUTCMonth(c, p) : i._d.setMonth(c, p), i;
}
function p_(i) {
  return i != null ? (d_(this, i), me.updateOffset(this, !0), this) : uv(this, "Month");
}
function dA() {
  return vw(this.year(), this.month());
}
function pA(i) {
  return this._monthsParseExact ? (Pt(this, "_monthsRegex") || h_.call(this), i ? this._monthsShortStrictRegex : this._monthsShortRegex) : (Pt(this, "_monthsShortRegex") || (this._monthsShortRegex = lA), this._monthsShortStrictRegex && i ? this._monthsShortStrictRegex : this._monthsShortRegex);
}
function hA(i) {
  return this._monthsParseExact ? (Pt(this, "_monthsRegex") || h_.call(this), i ? this._monthsStrictRegex : this._monthsRegex) : (Pt(this, "_monthsRegex") || (this._monthsRegex = oA), this._monthsStrictRegex && i ? this._monthsStrictRegex : this._monthsRegex);
}
function h_() {
  function i(_, A) {
    return A.length - _.length;
  }
  var u = [], c = [], p = [], y, w, S, D;
  for (y = 0; y < 12; y++)
    w = Kl([2e3, y]), S = Go(this.monthsShort(w, "")), D = Go(this.months(w, "")), u.push(S), c.push(D), p.push(D), p.push(S);
  u.sort(i), c.sort(i), p.sort(i), this._monthsRegex = new RegExp("^(" + p.join("|") + ")", "i"), this._monthsShortRegex = this._monthsRegex, this._monthsStrictRegex = new RegExp(
    "^(" + c.join("|") + ")",
    "i"
  ), this._monthsShortStrictRegex = new RegExp(
    "^(" + u.join("|") + ")",
    "i"
  );
}
function vA(i, u, c, p, y, w, S) {
  var D;
  return i < 100 && i >= 0 ? (D = new Date(i + 400, u, c, p, y, w, S), isFinite(D.getFullYear()) && D.setFullYear(i)) : D = new Date(i, u, c, p, y, w, S), D;
}
function sv(i) {
  var u, c;
  return i < 100 && i >= 0 ? (c = Array.prototype.slice.call(arguments), c[0] = i + 400, u = new Date(Date.UTC.apply(null, c)), isFinite(u.getUTCFullYear()) && u.setUTCFullYear(i)) : u = new Date(Date.UTC.apply(null, arguments)), u;
}
function Fg(i, u, c) {
  var p = 7 + u - c, y = (7 + sv(i, 0, p).getUTCDay() - u) % 7;
  return -y + p - 1;
}
function v_(i, u, c, p, y) {
  var w = (7 + c - p) % 7, S = Fg(i, p, y), D = 1 + 7 * (u - 1) + w + S, _, A;
  return D <= 0 ? (_ = i - 1, A = av(_) + D) : D > av(i) ? (_ = i + 1, A = D - av(i)) : (_ = i, A = D), {
    year: _,
    dayOfYear: A
  };
}
function cv(i, u, c) {
  var p = Fg(i.year(), u, c), y = Math.floor((i.dayOfYear() - p - 1) / 7) + 1, w, S;
  return y < 1 ? (S = i.year() - 1, w = y + Qo(S, u, c)) : y > Qo(i.year(), u, c) ? (w = y - Qo(i.year(), u, c), S = i.year() + 1) : (S = i.year(), w = y), {
    week: w,
    year: S
  };
}
function Qo(i, u, c) {
  var p = Fg(i, u, c), y = Fg(i + 1, u, c);
  return (av(i) - p + y) / 7;
}
$e("w", ["ww", 2], "wo", "week");
$e("W", ["WW", 2], "Wo", "isoWeek");
Oe("w", bn, Yd);
Oe("ww", bn, vi);
Oe("W", bn, Yd);
Oe("WW", bn, vi);
Sv(
  ["w", "ww", "W", "WW"],
  function(i, u, c, p) {
    u[p.substr(0, 1)] = Mt(i);
  }
);
function mA(i) {
  return cv(i, this._week.dow, this._week.doy).week;
}
var yA = {
  dow: 0,
  // Sunday is the first day of the week.
  doy: 6
  // The week that contains Jan 6th is the first week of the year.
};
function gA() {
  return this._week.dow;
}
function SA() {
  return this._week.doy;
}
function EA(i) {
  var u = this.localeData().week(this);
  return i == null ? u : this.add((i - u) * 7, "d");
}
function wA(i) {
  var u = cv(this, 1, 4).week;
  return i == null ? u : this.add((i - u) * 7, "d");
}
$e("d", 0, "do", "day");
$e("dd", 0, 0, function(i) {
  return this.localeData().weekdaysMin(this, i);
});
$e("ddd", 0, 0, function(i) {
  return this.localeData().weekdaysShort(this, i);
});
$e("dddd", 0, 0, function(i) {
  return this.localeData().weekdays(this, i);
});
$e("e", 0, 0, "weekday");
$e("E", 0, 0, "isoWeekday");
Oe("d", bn);
Oe("e", bn);
Oe("E", bn);
Oe("dd", function(i, u) {
  return u.weekdaysMinRegex(i);
});
Oe("ddd", function(i, u) {
  return u.weekdaysShortRegex(i);
});
Oe("dddd", function(i, u) {
  return u.weekdaysRegex(i);
});
Sv(["dd", "ddd", "dddd"], function(i, u, c, p) {
  var y = c._locale.weekdaysParse(i, p, c._strict);
  y != null ? u.d = y : wt(c).invalidWeekday = i;
});
Sv(["d", "e", "E"], function(i, u, c, p) {
  u[p] = Mt(i);
});
function CA(i, u) {
  return typeof i != "string" ? i : isNaN(i) ? (i = u.weekdaysParse(i), typeof i == "number" ? i : null) : parseInt(i, 10);
}
function bA(i, u) {
  return typeof i == "string" ? u.weekdaysParse(i) % 7 || 7 : isNaN(i) ? null : i;
}
function mw(i, u) {
  return i.slice(u, 7).concat(i.slice(0, u));
}
var xA = "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"), m_ = "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"), TA = "Su_Mo_Tu_We_Th_Fr_Sa".split("_"), _A = gv, RA = gv, DA = gv;
function kA(i, u) {
  var c = pl(this._weekdays) ? this._weekdays : this._weekdays[i && i !== !0 && this._weekdays.isFormat.test(u) ? "format" : "standalone"];
  return i === !0 ? mw(c, this._week.dow) : i ? c[i.day()] : c;
}
function OA(i) {
  return i === !0 ? mw(this._weekdaysShort, this._week.dow) : i ? this._weekdaysShort[i.day()] : this._weekdaysShort;
}
function MA(i) {
  return i === !0 ? mw(this._weekdaysMin, this._week.dow) : i ? this._weekdaysMin[i.day()] : this._weekdaysMin;
}
function NA(i, u, c) {
  var p, y, w, S = i.toLocaleLowerCase();
  if (!this._weekdaysParse)
    for (this._weekdaysParse = [], this._shortWeekdaysParse = [], this._minWeekdaysParse = [], p = 0; p < 7; ++p)
      w = Kl([2e3, 1]).day(p), this._minWeekdaysParse[p] = this.weekdaysMin(
        w,
        ""
      ).toLocaleLowerCase(), this._shortWeekdaysParse[p] = this.weekdaysShort(
        w,
        ""
      ).toLocaleLowerCase(), this._weekdaysParse[p] = this.weekdays(w, "").toLocaleLowerCase();
  return c ? u === "dddd" ? (y = Jn.call(this._weekdaysParse, S), y !== -1 ? y : null) : u === "ddd" ? (y = Jn.call(this._shortWeekdaysParse, S), y !== -1 ? y : null) : (y = Jn.call(this._minWeekdaysParse, S), y !== -1 ? y : null) : u === "dddd" ? (y = Jn.call(this._weekdaysParse, S), y !== -1 || (y = Jn.call(this._shortWeekdaysParse, S), y !== -1) ? y : (y = Jn.call(this._minWeekdaysParse, S), y !== -1 ? y : null)) : u === "ddd" ? (y = Jn.call(this._shortWeekdaysParse, S), y !== -1 || (y = Jn.call(this._weekdaysParse, S), y !== -1) ? y : (y = Jn.call(this._minWeekdaysParse, S), y !== -1 ? y : null)) : (y = Jn.call(this._minWeekdaysParse, S), y !== -1 || (y = Jn.call(this._weekdaysParse, S), y !== -1) ? y : (y = Jn.call(this._shortWeekdaysParse, S), y !== -1 ? y : null));
}
function LA(i, u, c) {
  var p, y, w;
  if (this._weekdaysParseExact)
    return NA.call(this, i, u, c);
  for (this._weekdaysParse || (this._weekdaysParse = [], this._minWeekdaysParse = [], this._shortWeekdaysParse = [], this._fullWeekdaysParse = []), p = 0; p < 7; p++) {
    if (y = Kl([2e3, 1]).day(p), c && !this._fullWeekdaysParse[p] && (this._fullWeekdaysParse[p] = new RegExp(
      "^" + this.weekdays(y, "").replace(".", "\\.?") + "$",
      "i"
    ), this._shortWeekdaysParse[p] = new RegExp(
      "^" + this.weekdaysShort(y, "").replace(".", "\\.?") + "$",
      "i"
    ), this._minWeekdaysParse[p] = new RegExp(
      "^" + this.weekdaysMin(y, "").replace(".", "\\.?") + "$",
      "i"
    )), this._weekdaysParse[p] || (w = "^" + this.weekdays(y, "") + "|^" + this.weekdaysShort(y, "") + "|^" + this.weekdaysMin(y, ""), this._weekdaysParse[p] = new RegExp(w.replace(".", ""), "i")), c && u === "dddd" && this._fullWeekdaysParse[p].test(i))
      return p;
    if (c && u === "ddd" && this._shortWeekdaysParse[p].test(i))
      return p;
    if (c && u === "dd" && this._minWeekdaysParse[p].test(i))
      return p;
    if (!c && this._weekdaysParse[p].test(i))
      return p;
  }
}
function AA(i) {
  if (!this.isValid())
    return i != null ? this : NaN;
  var u = uv(this, "Day");
  return i != null ? (i = CA(i, this.localeData()), this.add(i - u, "d")) : u;
}
function UA(i) {
  if (!this.isValid())
    return i != null ? this : NaN;
  var u = (this.day() + 7 - this.localeData()._week.dow) % 7;
  return i == null ? u : this.add(i - u, "d");
}
function zA(i) {
  if (!this.isValid())
    return i != null ? this : NaN;
  if (i != null) {
    var u = bA(i, this.localeData());
    return this.day(this.day() % 7 ? u : u - 7);
  } else
    return this.day() || 7;
}
function jA(i) {
  return this._weekdaysParseExact ? (Pt(this, "_weekdaysRegex") || yw.call(this), i ? this._weekdaysStrictRegex : this._weekdaysRegex) : (Pt(this, "_weekdaysRegex") || (this._weekdaysRegex = _A), this._weekdaysStrictRegex && i ? this._weekdaysStrictRegex : this._weekdaysRegex);
}
function FA(i) {
  return this._weekdaysParseExact ? (Pt(this, "_weekdaysRegex") || yw.call(this), i ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex) : (Pt(this, "_weekdaysShortRegex") || (this._weekdaysShortRegex = RA), this._weekdaysShortStrictRegex && i ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex);
}
function HA(i) {
  return this._weekdaysParseExact ? (Pt(this, "_weekdaysRegex") || yw.call(this), i ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex) : (Pt(this, "_weekdaysMinRegex") || (this._weekdaysMinRegex = DA), this._weekdaysMinStrictRegex && i ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex);
}
function yw() {
  function i(U, W) {
    return W.length - U.length;
  }
  var u = [], c = [], p = [], y = [], w, S, D, _, A;
  for (w = 0; w < 7; w++)
    S = Kl([2e3, 1]).day(w), D = Go(this.weekdaysMin(S, "")), _ = Go(this.weekdaysShort(S, "")), A = Go(this.weekdays(S, "")), u.push(D), c.push(_), p.push(A), y.push(D), y.push(_), y.push(A);
  u.sort(i), c.sort(i), p.sort(i), y.sort(i), this._weekdaysRegex = new RegExp("^(" + y.join("|") + ")", "i"), this._weekdaysShortRegex = this._weekdaysRegex, this._weekdaysMinRegex = this._weekdaysRegex, this._weekdaysStrictRegex = new RegExp(
    "^(" + p.join("|") + ")",
    "i"
  ), this._weekdaysShortStrictRegex = new RegExp(
    "^(" + c.join("|") + ")",
    "i"
  ), this._weekdaysMinStrictRegex = new RegExp(
    "^(" + u.join("|") + ")",
    "i"
  );
}
function gw() {
  return this.hours() % 12 || 12;
}
function YA() {
  return this.hours() || 24;
}
$e("H", ["HH", 2], 0, "hour");
$e("h", ["hh", 2], 0, gw);
$e("k", ["kk", 2], 0, YA);
$e("hmm", 0, 0, function() {
  return "" + gw.apply(this) + ql(this.minutes(), 2);
});
$e("hmmss", 0, 0, function() {
  return "" + gw.apply(this) + ql(this.minutes(), 2) + ql(this.seconds(), 2);
});
$e("Hmm", 0, 0, function() {
  return "" + this.hours() + ql(this.minutes(), 2);
});
$e("Hmmss", 0, 0, function() {
  return "" + this.hours() + ql(this.minutes(), 2) + ql(this.seconds(), 2);
});
function y_(i, u) {
  $e(i, 0, 0, function() {
    return this.localeData().meridiem(
      this.hours(),
      this.minutes(),
      u
    );
  });
}
y_("a", !0);
y_("A", !1);
function g_(i, u) {
  return u._meridiemParse;
}
Oe("a", g_);
Oe("A", g_);
Oe("H", bn, hw);
Oe("h", bn, Yd);
Oe("k", bn, Yd);
Oe("HH", bn, vi);
Oe("hh", bn, vi);
Oe("kk", bn, vi);
Oe("hmm", l_);
Oe("hmmss", o_);
Oe("Hmm", l_);
Oe("Hmmss", o_);
rn(["H", "HH"], br);
rn(["k", "kk"], function(i, u, c) {
  var p = Mt(i);
  u[br] = p === 24 ? 0 : p;
});
rn(["a", "A"], function(i, u, c) {
  c._isPm = c._locale.isPM(i), c._meridiem = i;
});
rn(["h", "hh"], function(i, u, c) {
  u[br] = Mt(i), wt(c).bigHour = !0;
});
rn("hmm", function(i, u, c) {
  var p = i.length - 2;
  u[br] = Mt(i.substr(0, p)), u[dl] = Mt(i.substr(p)), wt(c).bigHour = !0;
});
rn("hmmss", function(i, u, c) {
  var p = i.length - 4, y = i.length - 2;
  u[br] = Mt(i.substr(0, p)), u[dl] = Mt(i.substr(p, 2)), u[Wo] = Mt(i.substr(y)), wt(c).bigHour = !0;
});
rn("Hmm", function(i, u, c) {
  var p = i.length - 2;
  u[br] = Mt(i.substr(0, p)), u[dl] = Mt(i.substr(p));
});
rn("Hmmss", function(i, u, c) {
  var p = i.length - 4, y = i.length - 2;
  u[br] = Mt(i.substr(0, p)), u[dl] = Mt(i.substr(p, 2)), u[Wo] = Mt(i.substr(y));
});
function PA(i) {
  return (i + "").toLowerCase().charAt(0) === "p";
}
var VA = /[ap]\.?m?\.?/i, BA = Pd("Hours", !0);
function IA(i, u, c) {
  return i > 11 ? c ? "pm" : "PM" : c ? "am" : "AM";
}
var S_ = {
  calendar: NL,
  longDateFormat: zL,
  invalidDate: FL,
  ordinal: YL,
  dayOfMonthOrdinalParse: PL,
  relativeTime: BL,
  months: iA,
  monthsShort: c_,
  week: yA,
  weekdays: xA,
  weekdaysMin: TA,
  weekdaysShort: m_,
  meridiemParse: VA
}, kn = {}, tv = {}, fv;
function WA(i, u) {
  var c, p = Math.min(i.length, u.length);
  for (c = 0; c < p; c += 1)
    if (i[c] !== u[c])
      return c;
  return p;
}
function CT(i) {
  return i && i.toLowerCase().replace("_", "-");
}
function $A(i) {
  for (var u = 0, c, p, y, w; u < i.length; ) {
    for (w = CT(i[u]).split("-"), c = w.length, p = CT(i[u + 1]), p = p ? p.split("-") : null; c > 0; ) {
      if (y = Jg(w.slice(0, c).join("-")), y)
        return y;
      if (p && p.length >= c && WA(w, p) >= c - 1)
        break;
      c--;
    }
    u++;
  }
  return fv;
}
function GA(i) {
  return !!(i && i.match("^[^/\\\\]*$"));
}
function Jg(i) {
  var u = null, c;
  if (kn[i] === void 0 && typeof module < "u" && module && module.exports && GA(i))
    try {
      u = fv._abbr, c = require, c("./locale/" + i), ss(u);
    } catch {
      kn[i] = null;
    }
  return kn[i];
}
function ss(i, u) {
  var c;
  return i && (qa(u) ? c = Ko(i) : c = Sw(i, u), c ? fv = c : typeof console < "u" && console.warn && console.warn(
    "Locale " + i + " not found. Did you forget to load it?"
  )), fv._abbr;
}
function Sw(i, u) {
  if (u !== null) {
    var c, p = S_;
    if (u.abbr = i, kn[i] != null)
      n_(
        "defineLocaleOverride",
        "use moment.updateLocale(localeName, config) to change an existing locale. moment.defineLocale(localeName, config) should only be used for creating a new locale See http://momentjs.com/guides/#/warnings/define-locale/ for more info."
      ), p = kn[i]._config;
    else if (u.parentLocale != null)
      if (kn[u.parentLocale] != null)
        p = kn[u.parentLocale]._config;
      else if (c = Jg(u.parentLocale), c != null)
        p = c._config;
      else
        return tv[u.parentLocale] || (tv[u.parentLocale] = []), tv[u.parentLocale].push({
          name: i,
          config: u
        }), null;
    return kn[i] = new sw(WE(p, u)), tv[i] && tv[i].forEach(function(y) {
      Sw(y.name, y.config);
    }), ss(i), kn[i];
  } else
    return delete kn[i], null;
}
function QA(i, u) {
  if (u != null) {
    var c, p, y = S_;
    kn[i] != null && kn[i].parentLocale != null ? kn[i].set(WE(kn[i]._config, u)) : (p = Jg(i), p != null && (y = p._config), u = WE(y, u), p == null && (u.abbr = i), c = new sw(u), c.parentLocale = kn[i], kn[i] = c), ss(i);
  } else
    kn[i] != null && (kn[i].parentLocale != null ? (kn[i] = kn[i].parentLocale, i === ss() && ss(i)) : kn[i] != null && delete kn[i]);
  return kn[i];
}
function Ko(i) {
  var u;
  if (i && i._locale && i._locale._abbr && (i = i._locale._abbr), !i)
    return fv;
  if (!pl(i)) {
    if (u = Jg(i), u)
      return u;
    i = [i];
  }
  return $A(i);
}
function qA() {
  return $E(kn);
}
function Ew(i) {
  var u, c = i._a;
  return c && wt(i).overflow === -2 && (u = c[Io] < 0 || c[Io] > 11 ? Io : c[Gl] < 1 || c[Gl] > vw(c[ua], c[Io]) ? Gl : c[br] < 0 || c[br] > 24 || c[br] === 24 && (c[dl] !== 0 || c[Wo] !== 0 || c[bc] !== 0) ? br : c[dl] < 0 || c[dl] > 59 ? dl : c[Wo] < 0 || c[Wo] > 59 ? Wo : c[bc] < 0 || c[bc] > 999 ? bc : -1, wt(i)._overflowDayOfYear && (u < ua || u > Gl) && (u = Gl), wt(i)._overflowWeeks && u === -1 && (u = JL), wt(i)._overflowWeekday && u === -1 && (u = eA), wt(i).overflow = u), i;
}
var XA = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/, KA = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d|))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/, ZA = /Z|[+-]\d\d(?::?\d\d)?/, Rg = [
  ["YYYYYY-MM-DD", /[+-]\d{6}-\d\d-\d\d/],
  ["YYYY-MM-DD", /\d{4}-\d\d-\d\d/],
  ["GGGG-[W]WW-E", /\d{4}-W\d\d-\d/],
  ["GGGG-[W]WW", /\d{4}-W\d\d/, !1],
  ["YYYY-DDD", /\d{4}-\d{3}/],
  ["YYYY-MM", /\d{4}-\d\d/, !1],
  ["YYYYYYMMDD", /[+-]\d{10}/],
  ["YYYYMMDD", /\d{8}/],
  ["GGGG[W]WWE", /\d{4}W\d{3}/],
  ["GGGG[W]WW", /\d{4}W\d{2}/, !1],
  ["YYYYDDD", /\d{7}/],
  ["YYYYMM", /\d{6}/, !1],
  ["YYYY", /\d{4}/, !1]
], AE = [
  ["HH:mm:ss.SSSS", /\d\d:\d\d:\d\d\.\d+/],
  ["HH:mm:ss,SSSS", /\d\d:\d\d:\d\d,\d+/],
  ["HH:mm:ss", /\d\d:\d\d:\d\d/],
  ["HH:mm", /\d\d:\d\d/],
  ["HHmmss.SSSS", /\d\d\d\d\d\d\.\d+/],
  ["HHmmss,SSSS", /\d\d\d\d\d\d,\d+/],
  ["HHmmss", /\d\d\d\d\d\d/],
  ["HHmm", /\d\d\d\d/],
  ["HH", /\d\d/]
], JA = /^\/?Date\((-?\d+)/i, eU = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/, tU = {
  UT: 0,
  GMT: 0,
  EDT: -4 * 60,
  EST: -5 * 60,
  CDT: -5 * 60,
  CST: -6 * 60,
  MDT: -6 * 60,
  MST: -7 * 60,
  PDT: -7 * 60,
  PST: -8 * 60
};
function E_(i) {
  var u, c, p = i._i, y = XA.exec(p) || KA.exec(p), w, S, D, _, A = Rg.length, U = AE.length;
  if (y) {
    for (wt(i).iso = !0, u = 0, c = A; u < c; u++)
      if (Rg[u][1].exec(y[1])) {
        S = Rg[u][0], w = Rg[u][2] !== !1;
        break;
      }
    if (S == null) {
      i._isValid = !1;
      return;
    }
    if (y[3]) {
      for (u = 0, c = U; u < c; u++)
        if (AE[u][1].exec(y[3])) {
          D = (y[2] || " ") + AE[u][0];
          break;
        }
      if (D == null) {
        i._isValid = !1;
        return;
      }
    }
    if (!w && D != null) {
      i._isValid = !1;
      return;
    }
    if (y[4])
      if (ZA.exec(y[4]))
        _ = "Z";
      else {
        i._isValid = !1;
        return;
      }
    i._f = S + (D || "") + (_ || ""), Cw(i);
  } else
    i._isValid = !1;
}
function nU(i, u, c, p, y, w) {
  var S = [
    rU(i),
    c_.indexOf(u),
    parseInt(c, 10),
    parseInt(p, 10),
    parseInt(y, 10)
  ];
  return w && S.push(parseInt(w, 10)), S;
}
function rU(i) {
  var u = parseInt(i, 10);
  return u <= 49 ? 2e3 + u : u <= 999 ? 1900 + u : u;
}
function aU(i) {
  return i.replace(/\([^()]*\)|[\n\t]/g, " ").replace(/(\s\s+)/g, " ").replace(/^\s\s*/, "").replace(/\s\s*$/, "");
}
function iU(i, u, c) {
  if (i) {
    var p = m_.indexOf(i), y = new Date(
      u[0],
      u[1],
      u[2]
    ).getDay();
    if (p !== y)
      return wt(c).weekdayMismatch = !0, c._isValid = !1, !1;
  }
  return !0;
}
function lU(i, u, c) {
  if (i)
    return tU[i];
  if (u)
    return 0;
  var p = parseInt(c, 10), y = p % 100, w = (p - y) / 100;
  return w * 60 + y;
}
function w_(i) {
  var u = eU.exec(aU(i._i)), c;
  if (u) {
    if (c = nU(
      u[4],
      u[3],
      u[2],
      u[5],
      u[6],
      u[7]
    ), !iU(u[1], c, i))
      return;
    i._a = c, i._tzm = lU(u[8], u[9], u[10]), i._d = sv.apply(null, i._a), i._d.setUTCMinutes(i._d.getUTCMinutes() - i._tzm), wt(i).rfc2822 = !0;
  } else
    i._isValid = !1;
}
function oU(i) {
  var u = JA.exec(i._i);
  if (u !== null) {
    i._d = /* @__PURE__ */ new Date(+u[1]);
    return;
  }
  if (E_(i), i._isValid === !1)
    delete i._isValid;
  else
    return;
  if (w_(i), i._isValid === !1)
    delete i._isValid;
  else
    return;
  i._strict ? i._isValid = !1 : me.createFromInputFallback(i);
}
me.createFromInputFallback = ji(
  "value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are discouraged. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.",
  function(i) {
    i._d = /* @__PURE__ */ new Date(i._i + (i._useUTC ? " UTC" : ""));
  }
);
function Rd(i, u, c) {
  return i ?? u ?? c;
}
function uU(i) {
  var u = new Date(me.now());
  return i._useUTC ? [
    u.getUTCFullYear(),
    u.getUTCMonth(),
    u.getUTCDate()
  ] : [u.getFullYear(), u.getMonth(), u.getDate()];
}
function ww(i) {
  var u, c, p = [], y, w, S;
  if (!i._d) {
    for (y = uU(i), i._w && i._a[Gl] == null && i._a[Io] == null && sU(i), i._dayOfYear != null && (S = Rd(i._a[ua], y[ua]), (i._dayOfYear > av(S) || i._dayOfYear === 0) && (wt(i)._overflowDayOfYear = !0), c = sv(S, 0, i._dayOfYear), i._a[Io] = c.getUTCMonth(), i._a[Gl] = c.getUTCDate()), u = 0; u < 3 && i._a[u] == null; ++u)
      i._a[u] = p[u] = y[u];
    for (; u < 7; u++)
      i._a[u] = p[u] = i._a[u] == null ? u === 2 ? 1 : 0 : i._a[u];
    i._a[br] === 24 && i._a[dl] === 0 && i._a[Wo] === 0 && i._a[bc] === 0 && (i._nextDay = !0, i._a[br] = 0), i._d = (i._useUTC ? sv : vA).apply(
      null,
      p
    ), w = i._useUTC ? i._d.getUTCDay() : i._d.getDay(), i._tzm != null && i._d.setUTCMinutes(i._d.getUTCMinutes() - i._tzm), i._nextDay && (i._a[br] = 24), i._w && typeof i._w.d < "u" && i._w.d !== w && (wt(i).weekdayMismatch = !0);
  }
}
function sU(i) {
  var u, c, p, y, w, S, D, _, A;
  u = i._w, u.GG != null || u.W != null || u.E != null ? (w = 1, S = 4, c = Rd(
    u.GG,
    i._a[ua],
    cv(Cn(), 1, 4).year
  ), p = Rd(u.W, 1), y = Rd(u.E, 1), (y < 1 || y > 7) && (_ = !0)) : (w = i._locale._week.dow, S = i._locale._week.doy, A = cv(Cn(), w, S), c = Rd(u.gg, i._a[ua], A.year), p = Rd(u.w, A.week), u.d != null ? (y = u.d, (y < 0 || y > 6) && (_ = !0)) : u.e != null ? (y = u.e + w, (u.e < 0 || u.e > 6) && (_ = !0)) : y = w), p < 1 || p > Qo(c, w, S) ? wt(i)._overflowWeeks = !0 : _ != null ? wt(i)._overflowWeekday = !0 : (D = v_(c, p, y, w, S), i._a[ua] = D.year, i._dayOfYear = D.dayOfYear);
}
me.ISO_8601 = function() {
};
me.RFC_2822 = function() {
};
function Cw(i) {
  if (i._f === me.ISO_8601) {
    E_(i);
    return;
  }
  if (i._f === me.RFC_2822) {
    w_(i);
    return;
  }
  i._a = [], wt(i).empty = !0;
  var u = "" + i._i, c, p, y, w, S, D = u.length, _ = 0, A, U;
  for (y = r_(i._f, i._locale).match(cw) || [], U = y.length, c = 0; c < U; c++)
    w = y[c], p = (u.match(XL(w, i)) || [])[0], p && (S = u.substr(0, u.indexOf(p)), S.length > 0 && wt(i).unusedInput.push(S), u = u.slice(
      u.indexOf(p) + p.length
    ), _ += p.length), Nd[w] ? (p ? wt(i).empty = !1 : wt(i).unusedTokens.push(w), ZL(w, p, i)) : i._strict && !p && wt(i).unusedTokens.push(w);
  wt(i).charsLeftOver = D - _, u.length > 0 && wt(i).unusedInput.push(u), i._a[br] <= 12 && wt(i).bigHour === !0 && i._a[br] > 0 && (wt(i).bigHour = void 0), wt(i).parsedDateParts = i._a.slice(0), wt(i).meridiem = i._meridiem, i._a[br] = cU(
    i._locale,
    i._a[br],
    i._meridiem
  ), A = wt(i).era, A !== null && (i._a[ua] = i._locale.erasConvertYear(A, i._a[ua])), ww(i), Ew(i);
}
function cU(i, u, c) {
  var p;
  return c == null ? u : i.meridiemHour != null ? i.meridiemHour(u, c) : (i.isPM != null && (p = i.isPM(c), p && u < 12 && (u += 12), !p && u === 12 && (u = 0)), u);
}
function fU(i) {
  var u, c, p, y, w, S, D = !1, _ = i._f.length;
  if (_ === 0) {
    wt(i).invalidFormat = !0, i._d = /* @__PURE__ */ new Date(NaN);
    return;
  }
  for (y = 0; y < _; y++)
    w = 0, S = !1, u = uw({}, i), i._useUTC != null && (u._useUTC = i._useUTC), u._f = i._f[y], Cw(u), ow(u) && (S = !0), w += wt(u).charsLeftOver, w += wt(u).unusedTokens.length * 10, wt(u).score = w, D ? w < p && (p = w, c = u) : (p == null || w < p || S) && (p = w, c = u, S && (D = !0));
  os(i, c || u);
}
function dU(i) {
  if (!i._d) {
    var u = fw(i._i), c = u.day === void 0 ? u.date : u.day;
    i._a = e_(
      [u.year, u.month, c, u.hour, u.minute, u.second, u.millisecond],
      function(p) {
        return p && parseInt(p, 10);
      }
    ), ww(i);
  }
}
function pU(i) {
  var u = new yv(Ew(C_(i)));
  return u._nextDay && (u.add(1, "d"), u._nextDay = void 0), u;
}
function C_(i) {
  var u = i._i, c = i._f;
  return i._locale = i._locale || Ko(i._l), u === null || c === void 0 && u === "" ? $g({ nullInput: !0 }) : (typeof u == "string" && (i._i = u = i._locale.preparse(u)), hl(u) ? new yv(Ew(u)) : (mv(u) ? i._d = u : pl(c) ? fU(i) : c ? Cw(i) : hU(i), ow(i) || (i._d = null), i));
}
function hU(i) {
  var u = i._i;
  qa(u) ? i._d = new Date(me.now()) : mv(u) ? i._d = new Date(u.valueOf()) : typeof u == "string" ? oU(i) : pl(u) ? (i._a = e_(u.slice(0), function(c) {
    return parseInt(c, 10);
  }), ww(i)) : xc(u) ? dU(i) : qo(u) ? i._d = new Date(u) : me.createFromInputFallback(i);
}
function b_(i, u, c, p, y) {
  var w = {};
  return (u === !0 || u === !1) && (p = u, u = void 0), (c === !0 || c === !1) && (p = c, c = void 0), (xc(i) && lw(i) || pl(i) && i.length === 0) && (i = void 0), w._isAMomentObject = !0, w._useUTC = w._isUTC = y, w._l = c, w._i = i, w._f = u, w._strict = p, pU(w);
}
function Cn(i, u, c, p) {
  return b_(i, u, c, p, !1);
}
var vU = ji(
  "moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/",
  function() {
    var i = Cn.apply(null, arguments);
    return this.isValid() && i.isValid() ? i < this ? this : i : $g();
  }
), mU = ji(
  "moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/",
  function() {
    var i = Cn.apply(null, arguments);
    return this.isValid() && i.isValid() ? i > this ? this : i : $g();
  }
);
function x_(i, u) {
  var c, p;
  if (u.length === 1 && pl(u[0]) && (u = u[0]), !u.length)
    return Cn();
  for (c = u[0], p = 1; p < u.length; ++p)
    (!u[p].isValid() || u[p][i](c)) && (c = u[p]);
  return c;
}
function yU() {
  var i = [].slice.call(arguments, 0);
  return x_("isBefore", i);
}
function gU() {
  var i = [].slice.call(arguments, 0);
  return x_("isAfter", i);
}
var SU = function() {
  return Date.now ? Date.now() : +/* @__PURE__ */ new Date();
}, nv = [
  "year",
  "quarter",
  "month",
  "week",
  "day",
  "hour",
  "minute",
  "second",
  "millisecond"
];
function EU(i) {
  var u, c = !1, p, y = nv.length;
  for (u in i)
    if (Pt(i, u) && !(Jn.call(nv, u) !== -1 && (i[u] == null || !isNaN(i[u]))))
      return !1;
  for (p = 0; p < y; ++p)
    if (i[nv[p]]) {
      if (c)
        return !1;
      parseFloat(i[nv[p]]) !== Mt(i[nv[p]]) && (c = !0);
    }
  return !0;
}
function wU() {
  return this._isValid;
}
function CU() {
  return vl(NaN);
}
function e0(i) {
  var u = fw(i), c = u.year || 0, p = u.quarter || 0, y = u.month || 0, w = u.week || u.isoWeek || 0, S = u.day || 0, D = u.hour || 0, _ = u.minute || 0, A = u.second || 0, U = u.millisecond || 0;
  this._isValid = EU(u), this._milliseconds = +U + A * 1e3 + // 1000
  _ * 6e4 + // 1000 * 60
  D * 1e3 * 60 * 60, this._days = +S + w * 7, this._months = +y + p * 3 + c * 12, this._data = {}, this._locale = Ko(), this._bubble();
}
function Ag(i) {
  return i instanceof e0;
}
function QE(i) {
  return i < 0 ? Math.round(-1 * i) * -1 : Math.round(i);
}
function bU(i, u, c) {
  var p = Math.min(i.length, u.length), y = Math.abs(i.length - u.length), w = 0, S;
  for (S = 0; S < p; S++)
    Mt(i[S]) !== Mt(u[S]) && w++;
  return w + y;
}
function T_(i, u) {
  $e(i, 0, 0, function() {
    var c = this.utcOffset(), p = "+";
    return c < 0 && (c = -c, p = "-"), p + ql(~~(c / 60), 2) + u + ql(~~c % 60, 2);
  });
}
T_("Z", ":");
T_("ZZ", "");
Oe("Z", Kg);
Oe("ZZ", Kg);
rn(["Z", "ZZ"], function(i, u, c) {
  c._useUTC = !0, c._tzm = bw(Kg, i);
});
var xU = /([\+\-]|\d\d)/gi;
function bw(i, u) {
  var c = (u || "").match(i), p, y, w;
  return c === null ? null : (p = c[c.length - 1] || [], y = (p + "").match(xU) || ["-", 0, 0], w = +(y[1] * 60) + Mt(y[2]), w === 0 ? 0 : y[0] === "+" ? w : -w);
}
function xw(i, u) {
  var c, p;
  return u._isUTC ? (c = u.clone(), p = (hl(i) || mv(i) ? i.valueOf() : Cn(i).valueOf()) - c.valueOf(), c._d.setTime(c._d.valueOf() + p), me.updateOffset(c, !1), c) : Cn(i).local();
}
function qE(i) {
  return -Math.round(i._d.getTimezoneOffset());
}
me.updateOffset = function() {
};
function TU(i, u, c) {
  var p = this._offset || 0, y;
  if (!this.isValid())
    return i != null ? this : NaN;
  if (i != null) {
    if (typeof i == "string") {
      if (i = bw(Kg, i), i === null)
        return this;
    } else Math.abs(i) < 16 && !c && (i = i * 60);
    return !this._isUTC && u && (y = qE(this)), this._offset = i, this._isUTC = !0, y != null && this.add(y, "m"), p !== i && (!u || this._changeInProgress ? D_(
      this,
      vl(i - p, "m"),
      1,
      !1
    ) : this._changeInProgress || (this._changeInProgress = !0, me.updateOffset(this, !0), this._changeInProgress = null)), this;
  } else
    return this._isUTC ? p : qE(this);
}
function _U(i, u) {
  return i != null ? (typeof i != "string" && (i = -i), this.utcOffset(i, u), this) : -this.utcOffset();
}
function RU(i) {
  return this.utcOffset(0, i);
}
function DU(i) {
  return this._isUTC && (this.utcOffset(0, i), this._isUTC = !1, i && this.subtract(qE(this), "m")), this;
}
function kU() {
  if (this._tzm != null)
    this.utcOffset(this._tzm, !1, !0);
  else if (typeof this._i == "string") {
    var i = bw(QL, this._i);
    i != null ? this.utcOffset(i) : this.utcOffset(0, !0);
  }
  return this;
}
function OU(i) {
  return this.isValid() ? (i = i ? Cn(i).utcOffset() : 0, (this.utcOffset() - i) % 60 === 0) : !1;
}
function MU() {
  return this.utcOffset() > this.clone().month(0).utcOffset() || this.utcOffset() > this.clone().month(5).utcOffset();
}
function NU() {
  if (!qa(this._isDSTShifted))
    return this._isDSTShifted;
  var i = {}, u;
  return uw(i, this), i = C_(i), i._a ? (u = i._isUTC ? Kl(i._a) : Cn(i._a), this._isDSTShifted = this.isValid() && bU(i._a, u.toArray()) > 0) : this._isDSTShifted = !1, this._isDSTShifted;
}
function LU() {
  return this.isValid() ? !this._isUTC : !1;
}
function AU() {
  return this.isValid() ? this._isUTC : !1;
}
function __() {
  return this.isValid() ? this._isUTC && this._offset === 0 : !1;
}
var UU = /^(-|\+)?(?:(\d*)[. ])?(\d+):(\d+)(?::(\d+)(\.\d*)?)?$/, zU = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;
function vl(i, u) {
  var c = i, p = null, y, w, S;
  return Ag(i) ? c = {
    ms: i._milliseconds,
    d: i._days,
    M: i._months
  } : qo(i) || !isNaN(+i) ? (c = {}, u ? c[u] = +i : c.milliseconds = +i) : (p = UU.exec(i)) ? (y = p[1] === "-" ? -1 : 1, c = {
    y: 0,
    d: Mt(p[Gl]) * y,
    h: Mt(p[br]) * y,
    m: Mt(p[dl]) * y,
    s: Mt(p[Wo]) * y,
    ms: Mt(QE(p[bc] * 1e3)) * y
    // the millisecond decimal point is included in the match
  }) : (p = zU.exec(i)) ? (y = p[1] === "-" ? -1 : 1, c = {
    y: wc(p[2], y),
    M: wc(p[3], y),
    w: wc(p[4], y),
    d: wc(p[5], y),
    h: wc(p[6], y),
    m: wc(p[7], y),
    s: wc(p[8], y)
  }) : c == null ? c = {} : typeof c == "object" && ("from" in c || "to" in c) && (S = jU(
    Cn(c.from),
    Cn(c.to)
  ), c = {}, c.ms = S.milliseconds, c.M = S.months), w = new e0(c), Ag(i) && Pt(i, "_locale") && (w._locale = i._locale), Ag(i) && Pt(i, "_isValid") && (w._isValid = i._isValid), w;
}
vl.fn = e0.prototype;
vl.invalid = CU;
function wc(i, u) {
  var c = i && parseFloat(i.replace(",", "."));
  return (isNaN(c) ? 0 : c) * u;
}
function bT(i, u) {
  var c = {};
  return c.months = u.month() - i.month() + (u.year() - i.year()) * 12, i.clone().add(c.months, "M").isAfter(u) && --c.months, c.milliseconds = +u - +i.clone().add(c.months, "M"), c;
}
function jU(i, u) {
  var c;
  return i.isValid() && u.isValid() ? (u = xw(u, i), i.isBefore(u) ? c = bT(i, u) : (c = bT(u, i), c.milliseconds = -c.milliseconds, c.months = -c.months), c) : { milliseconds: 0, months: 0 };
}
function R_(i, u) {
  return function(c, p) {
    var y, w;
    return p !== null && !isNaN(+p) && (n_(
      u,
      "moment()." + u + "(period, number) is deprecated. Please use moment()." + u + "(number, period). See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info."
    ), w = c, c = p, p = w), y = vl(c, p), D_(this, y, i), this;
  };
}
function D_(i, u, c, p) {
  var y = u._milliseconds, w = QE(u._days), S = QE(u._months);
  i.isValid() && (p = p ?? !0, S && d_(i, uv(i, "Month") + S * c), w && s_(i, "Date", uv(i, "Date") + w * c), y && i._d.setTime(i._d.valueOf() + y * c), p && me.updateOffset(i, w || S));
}
var FU = R_(1, "add"), HU = R_(-1, "subtract");
function k_(i) {
  return typeof i == "string" || i instanceof String;
}
function YU(i) {
  return hl(i) || mv(i) || k_(i) || qo(i) || VU(i) || PU(i) || i === null || i === void 0;
}
function PU(i) {
  var u = xc(i) && !lw(i), c = !1, p = [
    "years",
    "year",
    "y",
    "months",
    "month",
    "M",
    "days",
    "day",
    "d",
    "dates",
    "date",
    "D",
    "hours",
    "hour",
    "h",
    "minutes",
    "minute",
    "m",
    "seconds",
    "second",
    "s",
    "milliseconds",
    "millisecond",
    "ms"
  ], y, w, S = p.length;
  for (y = 0; y < S; y += 1)
    w = p[y], c = c || Pt(i, w);
  return u && c;
}
function VU(i) {
  var u = pl(i), c = !1;
  return u && (c = i.filter(function(p) {
    return !qo(p) && k_(i);
  }).length === 0), u && c;
}
function BU(i) {
  var u = xc(i) && !lw(i), c = !1, p = [
    "sameDay",
    "nextDay",
    "lastDay",
    "nextWeek",
    "lastWeek",
    "sameElse"
  ], y, w;
  for (y = 0; y < p.length; y += 1)
    w = p[y], c = c || Pt(i, w);
  return u && c;
}
function IU(i, u) {
  var c = i.diff(u, "days", !0);
  return c < -6 ? "sameElse" : c < -1 ? "lastWeek" : c < 0 ? "lastDay" : c < 1 ? "sameDay" : c < 2 ? "nextDay" : c < 7 ? "nextWeek" : "sameElse";
}
function WU(i, u) {
  arguments.length === 1 && (arguments[0] ? YU(arguments[0]) ? (i = arguments[0], u = void 0) : BU(arguments[0]) && (u = arguments[0], i = void 0) : (i = void 0, u = void 0));
  var c = i || Cn(), p = xw(c, this).startOf("day"), y = me.calendarFormat(this, p) || "sameElse", w = u && (Zl(u[y]) ? u[y].call(this, c) : u[y]);
  return this.format(
    w || this.localeData().calendar(y, this, Cn(c))
  );
}
function $U() {
  return new yv(this);
}
function GU(i, u) {
  var c = hl(i) ? i : Cn(i);
  return this.isValid() && c.isValid() ? (u = Fi(u) || "millisecond", u === "millisecond" ? this.valueOf() > c.valueOf() : c.valueOf() < this.clone().startOf(u).valueOf()) : !1;
}
function QU(i, u) {
  var c = hl(i) ? i : Cn(i);
  return this.isValid() && c.isValid() ? (u = Fi(u) || "millisecond", u === "millisecond" ? this.valueOf() < c.valueOf() : this.clone().endOf(u).valueOf() < c.valueOf()) : !1;
}
function qU(i, u, c, p) {
  var y = hl(i) ? i : Cn(i), w = hl(u) ? u : Cn(u);
  return this.isValid() && y.isValid() && w.isValid() ? (p = p || "()", (p[0] === "(" ? this.isAfter(y, c) : !this.isBefore(y, c)) && (p[1] === ")" ? this.isBefore(w, c) : !this.isAfter(w, c))) : !1;
}
function XU(i, u) {
  var c = hl(i) ? i : Cn(i), p;
  return this.isValid() && c.isValid() ? (u = Fi(u) || "millisecond", u === "millisecond" ? this.valueOf() === c.valueOf() : (p = c.valueOf(), this.clone().startOf(u).valueOf() <= p && p <= this.clone().endOf(u).valueOf())) : !1;
}
function KU(i, u) {
  return this.isSame(i, u) || this.isAfter(i, u);
}
function ZU(i, u) {
  return this.isSame(i, u) || this.isBefore(i, u);
}
function JU(i, u, c) {
  var p, y, w;
  if (!this.isValid())
    return NaN;
  if (p = xw(i, this), !p.isValid())
    return NaN;
  switch (y = (p.utcOffset() - this.utcOffset()) * 6e4, u = Fi(u), u) {
    case "year":
      w = Ug(this, p) / 12;
      break;
    case "month":
      w = Ug(this, p);
      break;
    case "quarter":
      w = Ug(this, p) / 3;
      break;
    case "second":
      w = (this - p) / 1e3;
      break;
    case "minute":
      w = (this - p) / 6e4;
      break;
    case "hour":
      w = (this - p) / 36e5;
      break;
    case "day":
      w = (this - p - y) / 864e5;
      break;
    case "week":
      w = (this - p - y) / 6048e5;
      break;
    default:
      w = this - p;
  }
  return c ? w : Li(w);
}
function Ug(i, u) {
  if (i.date() < u.date())
    return -Ug(u, i);
  var c = (u.year() - i.year()) * 12 + (u.month() - i.month()), p = i.clone().add(c, "months"), y, w;
  return u - p < 0 ? (y = i.clone().add(c - 1, "months"), w = (u - p) / (p - y)) : (y = i.clone().add(c + 1, "months"), w = (u - p) / (y - p)), -(c + w) || 0;
}
me.defaultFormat = "YYYY-MM-DDTHH:mm:ssZ";
me.defaultFormatUtc = "YYYY-MM-DDTHH:mm:ss[Z]";
function ez() {
  return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
}
function tz(i) {
  if (!this.isValid())
    return null;
  var u = i !== !0, c = u ? this.clone().utc() : this;
  return c.year() < 0 || c.year() > 9999 ? Lg(
    c,
    u ? "YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]" : "YYYYYY-MM-DD[T]HH:mm:ss.SSSZ"
  ) : Zl(Date.prototype.toISOString) ? u ? this.toDate().toISOString() : new Date(this.valueOf() + this.utcOffset() * 60 * 1e3).toISOString().replace("Z", Lg(c, "Z")) : Lg(
    c,
    u ? "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]" : "YYYY-MM-DD[T]HH:mm:ss.SSSZ"
  );
}
function nz() {
  if (!this.isValid())
    return "moment.invalid(/* " + this._i + " */)";
  var i = "moment", u = "", c, p, y, w;
  return this.isLocal() || (i = this.utcOffset() === 0 ? "moment.utc" : "moment.parseZone", u = "Z"), c = "[" + i + '("]', p = 0 <= this.year() && this.year() <= 9999 ? "YYYY" : "YYYYYY", y = "-MM-DD[T]HH:mm:ss.SSS", w = u + '[")]', this.format(c + p + y + w);
}
function rz(i) {
  i || (i = this.isUtc() ? me.defaultFormatUtc : me.defaultFormat);
  var u = Lg(this, i);
  return this.localeData().postformat(u);
}
function az(i, u) {
  return this.isValid() && (hl(i) && i.isValid() || Cn(i).isValid()) ? vl({ to: this, from: i }).locale(this.locale()).humanize(!u) : this.localeData().invalidDate();
}
function iz(i) {
  return this.from(Cn(), i);
}
function lz(i, u) {
  return this.isValid() && (hl(i) && i.isValid() || Cn(i).isValid()) ? vl({ from: this, to: i }).locale(this.locale()).humanize(!u) : this.localeData().invalidDate();
}
function oz(i) {
  return this.to(Cn(), i);
}
function O_(i) {
  var u;
  return i === void 0 ? this._locale._abbr : (u = Ko(i), u != null && (this._locale = u), this);
}
var M_ = ji(
  "moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.",
  function(i) {
    return i === void 0 ? this.localeData() : this.locale(i);
  }
);
function N_() {
  return this._locale;
}
var Hg = 1e3, Ld = 60 * Hg, Yg = 60 * Ld, L_ = (365 * 400 + 97) * 24 * Yg;
function Ad(i, u) {
  return (i % u + u) % u;
}
function A_(i, u, c) {
  return i < 100 && i >= 0 ? new Date(i + 400, u, c) - L_ : new Date(i, u, c).valueOf();
}
function U_(i, u, c) {
  return i < 100 && i >= 0 ? Date.UTC(i + 400, u, c) - L_ : Date.UTC(i, u, c);
}
function uz(i) {
  var u, c;
  if (i = Fi(i), i === void 0 || i === "millisecond" || !this.isValid())
    return this;
  switch (c = this._isUTC ? U_ : A_, i) {
    case "year":
      u = c(this.year(), 0, 1);
      break;
    case "quarter":
      u = c(
        this.year(),
        this.month() - this.month() % 3,
        1
      );
      break;
    case "month":
      u = c(this.year(), this.month(), 1);
      break;
    case "week":
      u = c(
        this.year(),
        this.month(),
        this.date() - this.weekday()
      );
      break;
    case "isoWeek":
      u = c(
        this.year(),
        this.month(),
        this.date() - (this.isoWeekday() - 1)
      );
      break;
    case "day":
    case "date":
      u = c(this.year(), this.month(), this.date());
      break;
    case "hour":
      u = this._d.valueOf(), u -= Ad(
        u + (this._isUTC ? 0 : this.utcOffset() * Ld),
        Yg
      );
      break;
    case "minute":
      u = this._d.valueOf(), u -= Ad(u, Ld);
      break;
    case "second":
      u = this._d.valueOf(), u -= Ad(u, Hg);
      break;
  }
  return this._d.setTime(u), me.updateOffset(this, !0), this;
}
function sz(i) {
  var u, c;
  if (i = Fi(i), i === void 0 || i === "millisecond" || !this.isValid())
    return this;
  switch (c = this._isUTC ? U_ : A_, i) {
    case "year":
      u = c(this.year() + 1, 0, 1) - 1;
      break;
    case "quarter":
      u = c(
        this.year(),
        this.month() - this.month() % 3 + 3,
        1
      ) - 1;
      break;
    case "month":
      u = c(this.year(), this.month() + 1, 1) - 1;
      break;
    case "week":
      u = c(
        this.year(),
        this.month(),
        this.date() - this.weekday() + 7
      ) - 1;
      break;
    case "isoWeek":
      u = c(
        this.year(),
        this.month(),
        this.date() - (this.isoWeekday() - 1) + 7
      ) - 1;
      break;
    case "day":
    case "date":
      u = c(this.year(), this.month(), this.date() + 1) - 1;
      break;
    case "hour":
      u = this._d.valueOf(), u += Yg - Ad(
        u + (this._isUTC ? 0 : this.utcOffset() * Ld),
        Yg
      ) - 1;
      break;
    case "minute":
      u = this._d.valueOf(), u += Ld - Ad(u, Ld) - 1;
      break;
    case "second":
      u = this._d.valueOf(), u += Hg - Ad(u, Hg) - 1;
      break;
  }
  return this._d.setTime(u), me.updateOffset(this, !0), this;
}
function cz() {
  return this._d.valueOf() - (this._offset || 0) * 6e4;
}
function fz() {
  return Math.floor(this.valueOf() / 1e3);
}
function dz() {
  return new Date(this.valueOf());
}
function pz() {
  var i = this;
  return [
    i.year(),
    i.month(),
    i.date(),
    i.hour(),
    i.minute(),
    i.second(),
    i.millisecond()
  ];
}
function hz() {
  var i = this;
  return {
    years: i.year(),
    months: i.month(),
    date: i.date(),
    hours: i.hours(),
    minutes: i.minutes(),
    seconds: i.seconds(),
    milliseconds: i.milliseconds()
  };
}
function vz() {
  return this.isValid() ? this.toISOString() : null;
}
function mz() {
  return ow(this);
}
function yz() {
  return os({}, wt(this));
}
function gz() {
  return wt(this).overflow;
}
function Sz() {
  return {
    input: this._i,
    format: this._f,
    locale: this._locale,
    isUTC: this._isUTC,
    strict: this._strict
  };
}
$e("N", 0, 0, "eraAbbr");
$e("NN", 0, 0, "eraAbbr");
$e("NNN", 0, 0, "eraAbbr");
$e("NNNN", 0, 0, "eraName");
$e("NNNNN", 0, 0, "eraNarrow");
$e("y", ["y", 1], "yo", "eraYear");
$e("y", ["yy", 2], 0, "eraYear");
$e("y", ["yyy", 3], 0, "eraYear");
$e("y", ["yyyy", 4], 0, "eraYear");
Oe("N", Tw);
Oe("NN", Tw);
Oe("NNN", Tw);
Oe("NNNN", Oz);
Oe("NNNNN", Mz);
rn(
  ["N", "NN", "NNN", "NNNN", "NNNNN"],
  function(i, u, c, p) {
    var y = c._locale.erasParse(i, p, c._strict);
    y ? wt(c).era = y : wt(c).invalidEra = i;
  }
);
Oe("y", Hd);
Oe("yy", Hd);
Oe("yyy", Hd);
Oe("yyyy", Hd);
Oe("yo", Nz);
rn(["y", "yy", "yyy", "yyyy"], ua);
rn(["yo"], function(i, u, c, p) {
  var y;
  c._locale._eraYearOrdinalRegex && (y = i.match(c._locale._eraYearOrdinalRegex)), c._locale.eraYearOrdinalParse ? u[ua] = c._locale.eraYearOrdinalParse(i, y) : u[ua] = parseInt(i, 10);
});
function Ez(i, u) {
  var c, p, y, w = this._eras || Ko("en")._eras;
  for (c = 0, p = w.length; c < p; ++c) {
    switch (typeof w[c].since) {
      case "string":
        y = me(w[c].since).startOf("day"), w[c].since = y.valueOf();
        break;
    }
    switch (typeof w[c].until) {
      case "undefined":
        w[c].until = 1 / 0;
        break;
      case "string":
        y = me(w[c].until).startOf("day").valueOf(), w[c].until = y.valueOf();
        break;
    }
  }
  return w;
}
function wz(i, u, c) {
  var p, y, w = this.eras(), S, D, _;
  for (i = i.toUpperCase(), p = 0, y = w.length; p < y; ++p)
    if (S = w[p].name.toUpperCase(), D = w[p].abbr.toUpperCase(), _ = w[p].narrow.toUpperCase(), c)
      switch (u) {
        case "N":
        case "NN":
        case "NNN":
          if (D === i)
            return w[p];
          break;
        case "NNNN":
          if (S === i)
            return w[p];
          break;
        case "NNNNN":
          if (_ === i)
            return w[p];
          break;
      }
    else if ([S, D, _].indexOf(i) >= 0)
      return w[p];
}
function Cz(i, u) {
  var c = i.since <= i.until ? 1 : -1;
  return u === void 0 ? me(i.since).year() : me(i.since).year() + (u - i.offset) * c;
}
function bz() {
  var i, u, c, p = this.localeData().eras();
  for (i = 0, u = p.length; i < u; ++i)
    if (c = this.clone().startOf("day").valueOf(), p[i].since <= c && c <= p[i].until || p[i].until <= c && c <= p[i].since)
      return p[i].name;
  return "";
}
function xz() {
  var i, u, c, p = this.localeData().eras();
  for (i = 0, u = p.length; i < u; ++i)
    if (c = this.clone().startOf("day").valueOf(), p[i].since <= c && c <= p[i].until || p[i].until <= c && c <= p[i].since)
      return p[i].narrow;
  return "";
}
function Tz() {
  var i, u, c, p = this.localeData().eras();
  for (i = 0, u = p.length; i < u; ++i)
    if (c = this.clone().startOf("day").valueOf(), p[i].since <= c && c <= p[i].until || p[i].until <= c && c <= p[i].since)
      return p[i].abbr;
  return "";
}
function _z() {
  var i, u, c, p, y = this.localeData().eras();
  for (i = 0, u = y.length; i < u; ++i)
    if (c = y[i].since <= y[i].until ? 1 : -1, p = this.clone().startOf("day").valueOf(), y[i].since <= p && p <= y[i].until || y[i].until <= p && p <= y[i].since)
      return (this.year() - me(y[i].since).year()) * c + y[i].offset;
  return this.year();
}
function Rz(i) {
  return Pt(this, "_erasNameRegex") || _w.call(this), i ? this._erasNameRegex : this._erasRegex;
}
function Dz(i) {
  return Pt(this, "_erasAbbrRegex") || _w.call(this), i ? this._erasAbbrRegex : this._erasRegex;
}
function kz(i) {
  return Pt(this, "_erasNarrowRegex") || _w.call(this), i ? this._erasNarrowRegex : this._erasRegex;
}
function Tw(i, u) {
  return u.erasAbbrRegex(i);
}
function Oz(i, u) {
  return u.erasNameRegex(i);
}
function Mz(i, u) {
  return u.erasNarrowRegex(i);
}
function Nz(i, u) {
  return u._eraYearOrdinalRegex || Hd;
}
function _w() {
  var i = [], u = [], c = [], p = [], y, w, S, D, _, A = this.eras();
  for (y = 0, w = A.length; y < w; ++y)
    S = Go(A[y].name), D = Go(A[y].abbr), _ = Go(A[y].narrow), u.push(S), i.push(D), c.push(_), p.push(S), p.push(D), p.push(_);
  this._erasRegex = new RegExp("^(" + p.join("|") + ")", "i"), this._erasNameRegex = new RegExp("^(" + u.join("|") + ")", "i"), this._erasAbbrRegex = new RegExp("^(" + i.join("|") + ")", "i"), this._erasNarrowRegex = new RegExp(
    "^(" + c.join("|") + ")",
    "i"
  );
}
$e(0, ["gg", 2], 0, function() {
  return this.weekYear() % 100;
});
$e(0, ["GG", 2], 0, function() {
  return this.isoWeekYear() % 100;
});
function t0(i, u) {
  $e(0, [i, i.length], 0, u);
}
t0("gggg", "weekYear");
t0("ggggg", "weekYear");
t0("GGGG", "isoWeekYear");
t0("GGGGG", "isoWeekYear");
Oe("G", Xg);
Oe("g", Xg);
Oe("GG", bn, vi);
Oe("gg", bn, vi);
Oe("GGGG", pw, dw);
Oe("gggg", pw, dw);
Oe("GGGGG", qg, Gg);
Oe("ggggg", qg, Gg);
Sv(
  ["gggg", "ggggg", "GGGG", "GGGGG"],
  function(i, u, c, p) {
    u[p.substr(0, 2)] = Mt(i);
  }
);
Sv(["gg", "GG"], function(i, u, c, p) {
  u[p] = me.parseTwoDigitYear(i);
});
function Lz(i) {
  return z_.call(
    this,
    i,
    this.week(),
    this.weekday() + this.localeData()._week.dow,
    this.localeData()._week.dow,
    this.localeData()._week.doy
  );
}
function Az(i) {
  return z_.call(
    this,
    i,
    this.isoWeek(),
    this.isoWeekday(),
    1,
    4
  );
}
function Uz() {
  return Qo(this.year(), 1, 4);
}
function zz() {
  return Qo(this.isoWeekYear(), 1, 4);
}
function jz() {
  var i = this.localeData()._week;
  return Qo(this.year(), i.dow, i.doy);
}
function Fz() {
  var i = this.localeData()._week;
  return Qo(this.weekYear(), i.dow, i.doy);
}
function z_(i, u, c, p, y) {
  var w;
  return i == null ? cv(this, p, y).year : (w = Qo(i, p, y), u > w && (u = w), Hz.call(this, i, u, c, p, y));
}
function Hz(i, u, c, p, y) {
  var w = v_(i, u, c, p, y), S = sv(w.year, 0, w.dayOfYear);
  return this.year(S.getUTCFullYear()), this.month(S.getUTCMonth()), this.date(S.getUTCDate()), this;
}
$e("Q", 0, "Qo", "quarter");
Oe("Q", a_);
rn("Q", function(i, u) {
  u[Io] = (Mt(i) - 1) * 3;
});
function Yz(i) {
  return i == null ? Math.ceil((this.month() + 1) / 3) : this.month((i - 1) * 3 + this.month() % 3);
}
$e("D", ["DD", 2], "Do", "date");
Oe("D", bn, Yd);
Oe("DD", bn, vi);
Oe("Do", function(i, u) {
  return i ? u._dayOfMonthOrdinalParse || u._ordinalParse : u._dayOfMonthOrdinalParseLenient;
});
rn(["D", "DD"], Gl);
rn("Do", function(i, u) {
  u[Gl] = Mt(i.match(bn)[0]);
});
var j_ = Pd("Date", !0);
$e("DDD", ["DDDD", 3], "DDDo", "dayOfYear");
Oe("DDD", Qg);
Oe("DDDD", i_);
rn(["DDD", "DDDD"], function(i, u, c) {
  c._dayOfYear = Mt(i);
});
function Pz(i) {
  var u = Math.round(
    (this.clone().startOf("day") - this.clone().startOf("year")) / 864e5
  ) + 1;
  return i == null ? u : this.add(i - u, "d");
}
$e("m", ["mm", 2], 0, "minute");
Oe("m", bn, hw);
Oe("mm", bn, vi);
rn(["m", "mm"], dl);
var Vz = Pd("Minutes", !1);
$e("s", ["ss", 2], 0, "second");
Oe("s", bn, hw);
Oe("ss", bn, vi);
rn(["s", "ss"], Wo);
var Bz = Pd("Seconds", !1);
$e("S", 0, 0, function() {
  return ~~(this.millisecond() / 100);
});
$e(0, ["SS", 2], 0, function() {
  return ~~(this.millisecond() / 10);
});
$e(0, ["SSS", 3], 0, "millisecond");
$e(0, ["SSSS", 4], 0, function() {
  return this.millisecond() * 10;
});
$e(0, ["SSSSS", 5], 0, function() {
  return this.millisecond() * 100;
});
$e(0, ["SSSSSS", 6], 0, function() {
  return this.millisecond() * 1e3;
});
$e(0, ["SSSSSSS", 7], 0, function() {
  return this.millisecond() * 1e4;
});
$e(0, ["SSSSSSSS", 8], 0, function() {
  return this.millisecond() * 1e5;
});
$e(0, ["SSSSSSSSS", 9], 0, function() {
  return this.millisecond() * 1e6;
});
Oe("S", Qg, a_);
Oe("SS", Qg, vi);
Oe("SSS", Qg, i_);
var us, F_;
for (us = "SSSS"; us.length <= 9; us += "S")
  Oe(us, Hd);
function Iz(i, u) {
  u[bc] = Mt(("0." + i) * 1e3);
}
for (us = "S"; us.length <= 9; us += "S")
  rn(us, Iz);
F_ = Pd("Milliseconds", !1);
$e("z", 0, 0, "zoneAbbr");
$e("zz", 0, 0, "zoneName");
function Wz() {
  return this._isUTC ? "UTC" : "";
}
function $z() {
  return this._isUTC ? "Coordinated Universal Time" : "";
}
var ae = yv.prototype;
ae.add = FU;
ae.calendar = WU;
ae.clone = $U;
ae.diff = JU;
ae.endOf = sz;
ae.format = rz;
ae.from = az;
ae.fromNow = iz;
ae.to = lz;
ae.toNow = oz;
ae.get = nA;
ae.invalidAt = gz;
ae.isAfter = GU;
ae.isBefore = QU;
ae.isBetween = qU;
ae.isSame = XU;
ae.isSameOrAfter = KU;
ae.isSameOrBefore = ZU;
ae.isValid = mz;
ae.lang = M_;
ae.locale = O_;
ae.localeData = N_;
ae.max = mU;
ae.min = vU;
ae.parsingFlags = yz;
ae.set = rA;
ae.startOf = uz;
ae.subtract = HU;
ae.toArray = pz;
ae.toObject = hz;
ae.toDate = dz;
ae.toISOString = tz;
ae.inspect = nz;
typeof Symbol < "u" && Symbol.for != null && (ae[Symbol.for("nodejs.util.inspect.custom")] = function() {
  return "Moment<" + this.format() + ">";
});
ae.toJSON = vz;
ae.toString = ez;
ae.unix = fz;
ae.valueOf = cz;
ae.creationData = Sz;
ae.eraName = bz;
ae.eraNarrow = xz;
ae.eraAbbr = Tz;
ae.eraYear = _z;
ae.year = u_;
ae.isLeapYear = tA;
ae.weekYear = Lz;
ae.isoWeekYear = Az;
ae.quarter = ae.quarters = Yz;
ae.month = p_;
ae.daysInMonth = dA;
ae.week = ae.weeks = EA;
ae.isoWeek = ae.isoWeeks = wA;
ae.weeksInYear = jz;
ae.weeksInWeekYear = Fz;
ae.isoWeeksInYear = Uz;
ae.isoWeeksInISOWeekYear = zz;
ae.date = j_;
ae.day = ae.days = AA;
ae.weekday = UA;
ae.isoWeekday = zA;
ae.dayOfYear = Pz;
ae.hour = ae.hours = BA;
ae.minute = ae.minutes = Vz;
ae.second = ae.seconds = Bz;
ae.millisecond = ae.milliseconds = F_;
ae.utcOffset = TU;
ae.utc = RU;
ae.local = DU;
ae.parseZone = kU;
ae.hasAlignedHourOffset = OU;
ae.isDST = MU;
ae.isLocal = LU;
ae.isUtcOffset = AU;
ae.isUtc = __;
ae.isUTC = __;
ae.zoneAbbr = Wz;
ae.zoneName = $z;
ae.dates = ji(
  "dates accessor is deprecated. Use date instead.",
  j_
);
ae.months = ji(
  "months accessor is deprecated. Use month instead",
  p_
);
ae.years = ji(
  "years accessor is deprecated. Use year instead",
  u_
);
ae.zone = ji(
  "moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/",
  _U
);
ae.isDSTShifted = ji(
  "isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information",
  NU
);
function Gz(i) {
  return Cn(i * 1e3);
}
function Qz() {
  return Cn.apply(null, arguments).parseZone();
}
function H_(i) {
  return i;
}
var Vt = sw.prototype;
Vt.calendar = LL;
Vt.longDateFormat = jL;
Vt.invalidDate = HL;
Vt.ordinal = VL;
Vt.preparse = H_;
Vt.postformat = H_;
Vt.relativeTime = IL;
Vt.pastFuture = WL;
Vt.set = ML;
Vt.eras = Ez;
Vt.erasParse = wz;
Vt.erasConvertYear = Cz;
Vt.erasAbbrRegex = Dz;
Vt.erasNameRegex = Rz;
Vt.erasNarrowRegex = kz;
Vt.months = uA;
Vt.monthsShort = sA;
Vt.monthsParse = fA;
Vt.monthsRegex = hA;
Vt.monthsShortRegex = pA;
Vt.week = mA;
Vt.firstDayOfYear = SA;
Vt.firstDayOfWeek = gA;
Vt.weekdays = kA;
Vt.weekdaysMin = MA;
Vt.weekdaysShort = OA;
Vt.weekdaysParse = LA;
Vt.weekdaysRegex = jA;
Vt.weekdaysShortRegex = FA;
Vt.weekdaysMinRegex = HA;
Vt.isPM = PA;
Vt.meridiem = IA;
function Pg(i, u, c, p) {
  var y = Ko(), w = Kl().set(p, u);
  return y[c](w, i);
}
function Y_(i, u, c) {
  if (qo(i) && (u = i, i = void 0), i = i || "", u != null)
    return Pg(i, u, c, "month");
  var p, y = [];
  for (p = 0; p < 12; p++)
    y[p] = Pg(i, p, c, "month");
  return y;
}
function Rw(i, u, c, p) {
  typeof i == "boolean" ? (qo(u) && (c = u, u = void 0), u = u || "") : (u = i, c = u, i = !1, qo(u) && (c = u, u = void 0), u = u || "");
  var y = Ko(), w = i ? y._week.dow : 0, S, D = [];
  if (c != null)
    return Pg(u, (c + w) % 7, p, "day");
  for (S = 0; S < 7; S++)
    D[S] = Pg(u, (S + w) % 7, p, "day");
  return D;
}
function qz(i, u) {
  return Y_(i, u, "months");
}
function Xz(i, u) {
  return Y_(i, u, "monthsShort");
}
function Kz(i, u, c) {
  return Rw(i, u, c, "weekdays");
}
function Zz(i, u, c) {
  return Rw(i, u, c, "weekdaysShort");
}
function Jz(i, u, c) {
  return Rw(i, u, c, "weekdaysMin");
}
ss("en", {
  eras: [
    {
      since: "0001-01-01",
      until: 1 / 0,
      offset: 1,
      name: "Anno Domini",
      narrow: "AD",
      abbr: "AD"
    },
    {
      since: "0000-12-31",
      until: -1 / 0,
      offset: 1,
      name: "Before Christ",
      narrow: "BC",
      abbr: "BC"
    }
  ],
  dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
  ordinal: function(i) {
    var u = i % 10, c = Mt(i % 100 / 10) === 1 ? "th" : u === 1 ? "st" : u === 2 ? "nd" : u === 3 ? "rd" : "th";
    return i + c;
  }
});
me.lang = ji(
  "moment.lang is deprecated. Use moment.locale instead.",
  ss
);
me.langData = ji(
  "moment.langData is deprecated. Use moment.localeData instead.",
  Ko
);
var Po = Math.abs;
function e2() {
  var i = this._data;
  return this._milliseconds = Po(this._milliseconds), this._days = Po(this._days), this._months = Po(this._months), i.milliseconds = Po(i.milliseconds), i.seconds = Po(i.seconds), i.minutes = Po(i.minutes), i.hours = Po(i.hours), i.months = Po(i.months), i.years = Po(i.years), this;
}
function P_(i, u, c, p) {
  var y = vl(u, c);
  return i._milliseconds += p * y._milliseconds, i._days += p * y._days, i._months += p * y._months, i._bubble();
}
function t2(i, u) {
  return P_(this, i, u, 1);
}
function n2(i, u) {
  return P_(this, i, u, -1);
}
function xT(i) {
  return i < 0 ? Math.floor(i) : Math.ceil(i);
}
function r2() {
  var i = this._milliseconds, u = this._days, c = this._months, p = this._data, y, w, S, D, _;
  return i >= 0 && u >= 0 && c >= 0 || i <= 0 && u <= 0 && c <= 0 || (i += xT(XE(c) + u) * 864e5, u = 0, c = 0), p.milliseconds = i % 1e3, y = Li(i / 1e3), p.seconds = y % 60, w = Li(y / 60), p.minutes = w % 60, S = Li(w / 60), p.hours = S % 24, u += Li(S / 24), _ = Li(V_(u)), c += _, u -= xT(XE(_)), D = Li(c / 12), c %= 12, p.days = u, p.months = c, p.years = D, this;
}
function V_(i) {
  return i * 4800 / 146097;
}
function XE(i) {
  return i * 146097 / 4800;
}
function a2(i) {
  if (!this.isValid())
    return NaN;
  var u, c, p = this._milliseconds;
  if (i = Fi(i), i === "month" || i === "quarter" || i === "year")
    switch (u = this._days + p / 864e5, c = this._months + V_(u), i) {
      case "month":
        return c;
      case "quarter":
        return c / 3;
      case "year":
        return c / 12;
    }
  else
    switch (u = this._days + Math.round(XE(this._months)), i) {
      case "week":
        return u / 7 + p / 6048e5;
      case "day":
        return u + p / 864e5;
      case "hour":
        return u * 24 + p / 36e5;
      case "minute":
        return u * 1440 + p / 6e4;
      case "second":
        return u * 86400 + p / 1e3;
      case "millisecond":
        return Math.floor(u * 864e5) + p;
      default:
        throw new Error("Unknown unit " + i);
    }
}
function Zo(i) {
  return function() {
    return this.as(i);
  };
}
var B_ = Zo("ms"), i2 = Zo("s"), l2 = Zo("m"), o2 = Zo("h"), u2 = Zo("d"), s2 = Zo("w"), c2 = Zo("M"), f2 = Zo("Q"), d2 = Zo("y"), p2 = B_;
function h2() {
  return vl(this);
}
function v2(i) {
  return i = Fi(i), this.isValid() ? this[i + "s"]() : NaN;
}
function Rc(i) {
  return function() {
    return this.isValid() ? this._data[i] : NaN;
  };
}
var m2 = Rc("milliseconds"), y2 = Rc("seconds"), g2 = Rc("minutes"), S2 = Rc("hours"), E2 = Rc("days"), w2 = Rc("months"), C2 = Rc("years");
function b2() {
  return Li(this.days() / 7);
}
var Vo = Math.round, Od = {
  ss: 44,
  // a few seconds to seconds
  s: 45,
  // seconds to minute
  m: 45,
  // minutes to hour
  h: 22,
  // hours to day
  d: 26,
  // days to month/week
  w: null,
  // weeks to month
  M: 11
  // months to year
};
function x2(i, u, c, p, y) {
  return y.relativeTime(u || 1, !!c, i, p);
}
function T2(i, u, c, p) {
  var y = vl(i).abs(), w = Vo(y.as("s")), S = Vo(y.as("m")), D = Vo(y.as("h")), _ = Vo(y.as("d")), A = Vo(y.as("M")), U = Vo(y.as("w")), W = Vo(y.as("y")), X = w <= c.ss && ["s", w] || w < c.s && ["ss", w] || S <= 1 && ["m"] || S < c.m && ["mm", S] || D <= 1 && ["h"] || D < c.h && ["hh", D] || _ <= 1 && ["d"] || _ < c.d && ["dd", _];
  return c.w != null && (X = X || U <= 1 && ["w"] || U < c.w && ["ww", U]), X = X || A <= 1 && ["M"] || A < c.M && ["MM", A] || W <= 1 && ["y"] || ["yy", W], X[2] = u, X[3] = +i > 0, X[4] = p, x2.apply(null, X);
}
function _2(i) {
  return i === void 0 ? Vo : typeof i == "function" ? (Vo = i, !0) : !1;
}
function R2(i, u) {
  return Od[i] === void 0 ? !1 : u === void 0 ? Od[i] : (Od[i] = u, i === "s" && (Od.ss = u - 1), !0);
}
function D2(i, u) {
  if (!this.isValid())
    return this.localeData().invalidDate();
  var c = !1, p = Od, y, w;
  return typeof i == "object" && (u = i, i = !1), typeof i == "boolean" && (c = i), typeof u == "object" && (p = Object.assign({}, Od, u), u.s != null && u.ss == null && (p.ss = u.s - 1)), y = this.localeData(), w = T2(this, !c, p, y), c && (w = y.pastFuture(+this, w)), y.postformat(w);
}
var UE = Math.abs;
function Td(i) {
  return (i > 0) - (i < 0) || +i;
}
function n0() {
  if (!this.isValid())
    return this.localeData().invalidDate();
  var i = UE(this._milliseconds) / 1e3, u = UE(this._days), c = UE(this._months), p, y, w, S, D = this.asSeconds(), _, A, U, W;
  return D ? (p = Li(i / 60), y = Li(p / 60), i %= 60, p %= 60, w = Li(c / 12), c %= 12, S = i ? i.toFixed(3).replace(/\.?0+$/, "") : "", _ = D < 0 ? "-" : "", A = Td(this._months) !== Td(D) ? "-" : "", U = Td(this._days) !== Td(D) ? "-" : "", W = Td(this._milliseconds) !== Td(D) ? "-" : "", _ + "P" + (w ? A + w + "Y" : "") + (c ? A + c + "M" : "") + (u ? U + u + "D" : "") + (y || p || i ? "T" : "") + (y ? W + y + "H" : "") + (p ? W + p + "M" : "") + (i ? W + S + "S" : "")) : "P0D";
}
var Ut = e0.prototype;
Ut.isValid = wU;
Ut.abs = e2;
Ut.add = t2;
Ut.subtract = n2;
Ut.as = a2;
Ut.asMilliseconds = B_;
Ut.asSeconds = i2;
Ut.asMinutes = l2;
Ut.asHours = o2;
Ut.asDays = u2;
Ut.asWeeks = s2;
Ut.asMonths = c2;
Ut.asQuarters = f2;
Ut.asYears = d2;
Ut.valueOf = p2;
Ut._bubble = r2;
Ut.clone = h2;
Ut.get = v2;
Ut.milliseconds = m2;
Ut.seconds = y2;
Ut.minutes = g2;
Ut.hours = S2;
Ut.days = E2;
Ut.weeks = b2;
Ut.months = w2;
Ut.years = C2;
Ut.humanize = D2;
Ut.toISOString = n0;
Ut.toString = n0;
Ut.toJSON = n0;
Ut.locale = O_;
Ut.localeData = N_;
Ut.toIsoString = ji(
  "toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)",
  n0
);
Ut.lang = M_;
$e("X", 0, 0, "unix");
$e("x", 0, 0, "valueOf");
Oe("x", Xg);
Oe("X", qL);
rn("X", function(i, u, c) {
  c._d = new Date(parseFloat(i) * 1e3);
});
rn("x", function(i, u, c) {
  c._d = new Date(Mt(i));
});
//! moment.js
me.version = "2.30.1";
kL(Cn);
me.fn = ae;
me.min = yU;
me.max = gU;
me.now = SU;
me.utc = Kl;
me.unix = Gz;
me.months = qz;
me.isDate = mv;
me.locale = ss;
me.invalid = $g;
me.duration = vl;
me.isMoment = hl;
me.weekdays = Kz;
me.parseZone = Qz;
me.localeData = Ko;
me.isDuration = Ag;
me.monthsShort = Xz;
me.weekdaysMin = Jz;
me.defineLocale = Sw;
me.updateLocale = QA;
me.locales = qA;
me.weekdaysShort = Zz;
me.normalizeUnits = Fi;
me.relativeTimeRounding = _2;
me.relativeTimeThreshold = R2;
me.calendarFormat = IU;
me.prototype = ae;
me.HTML5_FMT = {
  DATETIME_LOCAL: "YYYY-MM-DDTHH:mm",
  // <input type="datetime-local" />
  DATETIME_LOCAL_SECONDS: "YYYY-MM-DDTHH:mm:ss",
  // <input type="datetime-local" step="1" />
  DATETIME_LOCAL_MS: "YYYY-MM-DDTHH:mm:ss.SSS",
  // <input type="datetime-local" step="0.001" />
  DATE: "YYYY-MM-DD",
  // <input type="date" />
  TIME: "HH:mm",
  // <input type="time" />
  TIME_SECONDS: "HH:mm:ss",
  // <input type="time" step="1" />
  TIME_MS: "HH:mm:ss.SSS",
  // <input type="time" step="0.001" />
  WEEK: "GGGG-[W]WW",
  // <input type="week" />
  MONTH: "YYYY-MM"
  // <input type="month" />
};
function k2(i) {
  const u = me(i), c = me();
  return u.isSame(c, "day") ? "Today" : u.isSame(c.clone().subtract(1, "day"), "day") ? "Yesterday" : u.isAfter(c.clone().subtract(7, "days"), "day") ? u.format("dddd") : u.isSame(c, "year") ? u.format("MMMM D") : u.format("MMMM D, YYYY");
}
function Vg(i, u) {
  return u === null ? !0 : !me(i).isSame(me(u), "day");
}
const I_ = ({ date: i }) => /* @__PURE__ */ z.jsxs("div", { className: "blue-orange-chat-date-separator", children: [
  /* @__PURE__ */ z.jsx("hr", { className: "blue-orange-chat-date-separator-line" }),
  /* @__PURE__ */ z.jsx("span", { className: "blue-orange-chat-date-separator-label", children: k2(i) }),
  /* @__PURE__ */ z.jsx("hr", { className: "blue-orange-chat-date-separator-line" })
] }), O2 = (i) => {
  const u = me(i);
  return u.isSame(me(), "day") ? u.format("h:mm A") : u.format("MMM D, h:mm A");
}, M2 = (i) => me(i).format("h:mm"), N2 = (i, u) => {
  const c = i.replace(/<[^>]*>/g, "");
  return c.length <= u ? c : c.substring(0, u) + "...";
}, KE = ({
  message: i,
  isConsecutive: u = !1,
  onReply: c,
  onReact: p,
  onAvatarClick: y,
  children: w
}) => {
  const S = () => {
    c && c(i);
  }, D = () => {
    p && p(i);
  }, _ = () => {
    y && y(i.sender);
  }, A = () => i.replyTo ? /* @__PURE__ */ z.jsxs(
    "div",
    {
      className: "blue-orange-chat-message-reply-ref",
      "data-message-id": i.replyTo.id,
      children: [
        /* @__PURE__ */ z.jsx("span", { className: "blue-orange-chat-message-reply-ref-sender", children: i.replyTo.sender.user.name }),
        /* @__PURE__ */ z.jsx("span", { className: "blue-orange-chat-message-reply-ref-content", children: N2(i.replyTo.content, 50) })
      ]
    }
  ) : null, U = () => /* @__PURE__ */ z.jsxs("div", { className: "blue-orange-chat-message-toolbar", children: [
    /* @__PURE__ */ z.jsx(
      "button",
      {
        className: "blue-orange-chat-message-toolbar-btn",
        onClick: S,
        title: "Reply",
        children: /* @__PURE__ */ z.jsx("i", { className: "ri-reply-line" })
      }
    ),
    /* @__PURE__ */ z.jsx(
      "button",
      {
        className: "blue-orange-chat-message-toolbar-btn",
        onClick: D,
        title: "React",
        children: /* @__PURE__ */ z.jsx("i", { className: "ri-emoji-sticker-line" })
      }
    ),
    /* @__PURE__ */ z.jsx(
      "button",
      {
        className: "blue-orange-chat-message-toolbar-btn",
        title: "More options",
        children: /* @__PURE__ */ z.jsx("i", { className: "ri-more-line" })
      }
    )
  ] });
  return u ? /* @__PURE__ */ z.jsxs("div", { className: "blue-orange-chat-message blue-orange-chat-message-consecutive", "data-message-id": i.id, children: [
    U(),
    /* @__PURE__ */ z.jsx("span", { className: "blue-orange-chat-message-consecutive-timestamp", children: M2(i.timestamp) }),
    /* @__PURE__ */ z.jsxs("div", { className: "blue-orange-chat-message-body", children: [
      A(),
      /* @__PURE__ */ z.jsx(
        "div",
        {
          className: "blue-orange-chat-message-content",
          dangerouslySetInnerHTML: { __html: i.content }
        }
      ),
      w
    ] })
  ] }) : /* @__PURE__ */ z.jsxs("div", { className: "blue-orange-chat-message", "data-message-id": i.id, children: [
    U(),
    /* @__PURE__ */ z.jsx("div", { className: "blue-orange-chat-message-avatar", onClick: _, children: /* @__PURE__ */ z.jsx(iw, { user: i.sender.user, height: 36, width: 36 }) }),
    /* @__PURE__ */ z.jsxs("div", { className: "blue-orange-chat-message-body", children: [
      /* @__PURE__ */ z.jsxs("div", { className: "blue-orange-chat-message-header", children: [
        /* @__PURE__ */ z.jsx("span", { className: "blue-orange-chat-message-sender", children: i.sender.user.name }),
        /* @__PURE__ */ z.jsx("span", { className: "blue-orange-chat-message-timestamp", children: O2(i.timestamp) })
      ] }),
      A(),
      /* @__PURE__ */ z.jsx(
        "div",
        {
          className: "blue-orange-chat-message-content",
          dangerouslySetInnerHTML: { __html: i.content }
        }
      ),
      w
    ] })
  ] });
};
var Xa = "top", Ui = "bottom", zi = "right", Ka = "left", Dw = "auto", Ev = [Xa, Ui, zi, Ka], Ud = "start", dv = "end", L2 = "clippingParents", W_ = "viewport", rv = "popper", A2 = "reference", TT = /* @__PURE__ */ Ev.reduce(function(i, u) {
  return i.concat([u + "-" + Ud, u + "-" + dv]);
}, []), $_ = /* @__PURE__ */ [].concat(Ev, [Dw]).reduce(function(i, u) {
  return i.concat([u, u + "-" + Ud, u + "-" + dv]);
}, []), U2 = "beforeRead", z2 = "read", j2 = "afterRead", F2 = "beforeMain", H2 = "main", Y2 = "afterMain", P2 = "beforeWrite", V2 = "write", B2 = "afterWrite", I2 = [U2, z2, j2, F2, H2, Y2, P2, V2, B2];
function Xl(i) {
  return i ? (i.nodeName || "").toLowerCase() : null;
}
function hi(i) {
  if (i == null)
    return window;
  if (i.toString() !== "[object Window]") {
    var u = i.ownerDocument;
    return u && u.defaultView || window;
  }
  return i;
}
function _c(i) {
  var u = hi(i).Element;
  return i instanceof u || i instanceof Element;
}
function Ai(i) {
  var u = hi(i).HTMLElement;
  return i instanceof u || i instanceof HTMLElement;
}
function kw(i) {
  if (typeof ShadowRoot > "u")
    return !1;
  var u = hi(i).ShadowRoot;
  return i instanceof u || i instanceof ShadowRoot;
}
function W2(i) {
  var u = i.state;
  Object.keys(u.elements).forEach(function(c) {
    var p = u.styles[c] || {}, y = u.attributes[c] || {}, w = u.elements[c];
    !Ai(w) || !Xl(w) || (Object.assign(w.style, p), Object.keys(y).forEach(function(S) {
      var D = y[S];
      D === !1 ? w.removeAttribute(S) : w.setAttribute(S, D === !0 ? "" : D);
    }));
  });
}
function $2(i) {
  var u = i.state, c = {
    popper: {
      position: u.options.strategy,
      left: "0",
      top: "0",
      margin: "0"
    },
    arrow: {
      position: "absolute"
    },
    reference: {}
  };
  return Object.assign(u.elements.popper.style, c.popper), u.styles = c, u.elements.arrow && Object.assign(u.elements.arrow.style, c.arrow), function() {
    Object.keys(u.elements).forEach(function(p) {
      var y = u.elements[p], w = u.attributes[p] || {}, S = Object.keys(u.styles.hasOwnProperty(p) ? u.styles[p] : c[p]), D = S.reduce(function(_, A) {
        return _[A] = "", _;
      }, {});
      !Ai(y) || !Xl(y) || (Object.assign(y.style, D), Object.keys(w).forEach(function(_) {
        y.removeAttribute(_);
      }));
    });
  };
}
const G_ = {
  name: "applyStyles",
  enabled: !0,
  phase: "write",
  fn: W2,
  effect: $2,
  requires: ["computeStyles"]
};
function Ql(i) {
  return i.split("-")[0];
}
var Tc = Math.max, Bg = Math.min, zd = Math.round;
function ZE() {
  var i = navigator.userAgentData;
  return i != null && i.brands && Array.isArray(i.brands) ? i.brands.map(function(u) {
    return u.brand + "/" + u.version;
  }).join(" ") : navigator.userAgent;
}
function Q_() {
  return !/^((?!chrome|android).)*safari/i.test(ZE());
}
function jd(i, u, c) {
  u === void 0 && (u = !1), c === void 0 && (c = !1);
  var p = i.getBoundingClientRect(), y = 1, w = 1;
  u && Ai(i) && (y = i.offsetWidth > 0 && zd(p.width) / i.offsetWidth || 1, w = i.offsetHeight > 0 && zd(p.height) / i.offsetHeight || 1);
  var S = _c(i) ? hi(i) : window, D = S.visualViewport, _ = !Q_() && c, A = (p.left + (_ && D ? D.offsetLeft : 0)) / y, U = (p.top + (_ && D ? D.offsetTop : 0)) / w, W = p.width / y, X = p.height / w;
  return {
    width: W,
    height: X,
    top: U,
    right: A + W,
    bottom: U + X,
    left: A,
    x: A,
    y: U
  };
}
function Ow(i) {
  var u = jd(i), c = i.offsetWidth, p = i.offsetHeight;
  return Math.abs(u.width - c) <= 1 && (c = u.width), Math.abs(u.height - p) <= 1 && (p = u.height), {
    x: i.offsetLeft,
    y: i.offsetTop,
    width: c,
    height: p
  };
}
function q_(i, u) {
  var c = u.getRootNode && u.getRootNode();
  if (i.contains(u))
    return !0;
  if (c && kw(c)) {
    var p = u;
    do {
      if (p && i.isSameNode(p))
        return !0;
      p = p.parentNode || p.host;
    } while (p);
  }
  return !1;
}
function Xo(i) {
  return hi(i).getComputedStyle(i);
}
function G2(i) {
  return ["table", "td", "th"].indexOf(Xl(i)) >= 0;
}
function cs(i) {
  return ((_c(i) ? i.ownerDocument : (
    // $FlowFixMe[prop-missing]
    i.document
  )) || window.document).documentElement;
}
function r0(i) {
  return Xl(i) === "html" ? i : (
    // this is a quicker (but less type safe) way to save quite some bytes from the bundle
    // $FlowFixMe[incompatible-return]
    // $FlowFixMe[prop-missing]
    i.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    i.parentNode || // DOM Element detected
    (kw(i) ? i.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    cs(i)
  );
}
function _T(i) {
  return !Ai(i) || // https://github.com/popperjs/popper-core/issues/837
  Xo(i).position === "fixed" ? null : i.offsetParent;
}
function Q2(i) {
  var u = /firefox/i.test(ZE()), c = /Trident/i.test(ZE());
  if (c && Ai(i)) {
    var p = Xo(i);
    if (p.position === "fixed")
      return null;
  }
  var y = r0(i);
  for (kw(y) && (y = y.host); Ai(y) && ["html", "body"].indexOf(Xl(y)) < 0; ) {
    var w = Xo(y);
    if (w.transform !== "none" || w.perspective !== "none" || w.contain === "paint" || ["transform", "perspective"].indexOf(w.willChange) !== -1 || u && w.willChange === "filter" || u && w.filter && w.filter !== "none")
      return y;
    y = y.parentNode;
  }
  return null;
}
function wv(i) {
  for (var u = hi(i), c = _T(i); c && G2(c) && Xo(c).position === "static"; )
    c = _T(c);
  return c && (Xl(c) === "html" || Xl(c) === "body" && Xo(c).position === "static") ? u : c || Q2(i) || u;
}
function Mw(i) {
  return ["top", "bottom"].indexOf(i) >= 0 ? "x" : "y";
}
function iv(i, u, c) {
  return Tc(i, Bg(u, c));
}
function q2(i, u, c) {
  var p = iv(i, u, c);
  return p > c ? c : p;
}
function X_() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}
function K_(i) {
  return Object.assign({}, X_(), i);
}
function Z_(i, u) {
  return u.reduce(function(c, p) {
    return c[p] = i, c;
  }, {});
}
var X2 = function(u, c) {
  return u = typeof u == "function" ? u(Object.assign({}, c.rects, {
    placement: c.placement
  })) : u, K_(typeof u != "number" ? u : Z_(u, Ev));
};
function K2(i) {
  var u, c = i.state, p = i.name, y = i.options, w = c.elements.arrow, S = c.modifiersData.popperOffsets, D = Ql(c.placement), _ = Mw(D), A = [Ka, zi].indexOf(D) >= 0, U = A ? "height" : "width";
  if (!(!w || !S)) {
    var W = X2(y.padding, c), X = Ow(w), Q = _ === "y" ? Xa : Ka, oe = _ === "y" ? Ui : zi, we = c.rects.reference[U] + c.rects.reference[_] - S[_] - c.rects.popper[U], ce = S[_] - c.rects.reference[_], Me = wv(w), ve = Me ? _ === "y" ? Me.clientHeight || 0 : Me.clientWidth || 0 : 0, Se = we / 2 - ce / 2, O = W[Q], be = ve - X[U] - W[oe], le = ve / 2 - X[U] / 2 + Se, ye = iv(O, le, be), ht = _;
    c.modifiersData[p] = (u = {}, u[ht] = ye, u.centerOffset = ye - le, u);
  }
}
function Z2(i) {
  var u = i.state, c = i.options, p = c.element, y = p === void 0 ? "[data-popper-arrow]" : p;
  y != null && (typeof y == "string" && (y = u.elements.popper.querySelector(y), !y) || q_(u.elements.popper, y) && (u.elements.arrow = y));
}
const J2 = {
  name: "arrow",
  enabled: !0,
  phase: "main",
  fn: K2,
  effect: Z2,
  requires: ["popperOffsets"],
  requiresIfExists: ["preventOverflow"]
};
function Fd(i) {
  return i.split("-")[1];
}
var ej = {
  top: "auto",
  right: "auto",
  bottom: "auto",
  left: "auto"
};
function tj(i, u) {
  var c = i.x, p = i.y, y = u.devicePixelRatio || 1;
  return {
    x: zd(c * y) / y || 0,
    y: zd(p * y) / y || 0
  };
}
function RT(i) {
  var u, c = i.popper, p = i.popperRect, y = i.placement, w = i.variation, S = i.offsets, D = i.position, _ = i.gpuAcceleration, A = i.adaptive, U = i.roundOffsets, W = i.isFixed, X = S.x, Q = X === void 0 ? 0 : X, oe = S.y, we = oe === void 0 ? 0 : oe, ce = typeof U == "function" ? U({
    x: Q,
    y: we
  }) : {
    x: Q,
    y: we
  };
  Q = ce.x, we = ce.y;
  var Me = S.hasOwnProperty("x"), ve = S.hasOwnProperty("y"), Se = Ka, O = Xa, be = window;
  if (A) {
    var le = wv(c), ye = "clientHeight", ht = "clientWidth";
    if (le === hi(c) && (le = cs(c), Xo(le).position !== "static" && D === "absolute" && (ye = "scrollHeight", ht = "scrollWidth")), le = le, y === Xa || (y === Ka || y === zi) && w === dv) {
      O = Ui;
      var yt = W && le === be && be.visualViewport ? be.visualViewport.height : (
        // $FlowFixMe[prop-missing]
        le[ye]
      );
      we -= yt - p.height, we *= _ ? 1 : -1;
    }
    if (y === Ka || (y === Xa || y === Ui) && w === dv) {
      Se = zi;
      var Je = W && le === be && be.visualViewport ? be.visualViewport.width : (
        // $FlowFixMe[prop-missing]
        le[ht]
      );
      Q -= Je - p.width, Q *= _ ? 1 : -1;
    }
  }
  var Ke = Object.assign({
    position: D
  }, A && ej), ft = U === !0 ? tj({
    x: Q,
    y: we
  }, hi(c)) : {
    x: Q,
    y: we
  };
  if (Q = ft.x, we = ft.y, _) {
    var Ee;
    return Object.assign({}, Ke, (Ee = {}, Ee[O] = ve ? "0" : "", Ee[Se] = Me ? "0" : "", Ee.transform = (be.devicePixelRatio || 1) <= 1 ? "translate(" + Q + "px, " + we + "px)" : "translate3d(" + Q + "px, " + we + "px, 0)", Ee));
  }
  return Object.assign({}, Ke, (u = {}, u[O] = ve ? we + "px" : "", u[Se] = Me ? Q + "px" : "", u.transform = "", u));
}
function nj(i) {
  var u = i.state, c = i.options, p = c.gpuAcceleration, y = p === void 0 ? !0 : p, w = c.adaptive, S = w === void 0 ? !0 : w, D = c.roundOffsets, _ = D === void 0 ? !0 : D, A = {
    placement: Ql(u.placement),
    variation: Fd(u.placement),
    popper: u.elements.popper,
    popperRect: u.rects.popper,
    gpuAcceleration: y,
    isFixed: u.options.strategy === "fixed"
  };
  u.modifiersData.popperOffsets != null && (u.styles.popper = Object.assign({}, u.styles.popper, RT(Object.assign({}, A, {
    offsets: u.modifiersData.popperOffsets,
    position: u.options.strategy,
    adaptive: S,
    roundOffsets: _
  })))), u.modifiersData.arrow != null && (u.styles.arrow = Object.assign({}, u.styles.arrow, RT(Object.assign({}, A, {
    offsets: u.modifiersData.arrow,
    position: "absolute",
    adaptive: !1,
    roundOffsets: _
  })))), u.attributes.popper = Object.assign({}, u.attributes.popper, {
    "data-popper-placement": u.placement
  });
}
const rj = {
  name: "computeStyles",
  enabled: !0,
  phase: "beforeWrite",
  fn: nj,
  data: {}
};
var Dg = {
  passive: !0
};
function aj(i) {
  var u = i.state, c = i.instance, p = i.options, y = p.scroll, w = y === void 0 ? !0 : y, S = p.resize, D = S === void 0 ? !0 : S, _ = hi(u.elements.popper), A = [].concat(u.scrollParents.reference, u.scrollParents.popper);
  return w && A.forEach(function(U) {
    U.addEventListener("scroll", c.update, Dg);
  }), D && _.addEventListener("resize", c.update, Dg), function() {
    w && A.forEach(function(U) {
      U.removeEventListener("scroll", c.update, Dg);
    }), D && _.removeEventListener("resize", c.update, Dg);
  };
}
const ij = {
  name: "eventListeners",
  enabled: !0,
  phase: "write",
  fn: function() {
  },
  effect: aj,
  data: {}
};
var lj = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function zg(i) {
  return i.replace(/left|right|bottom|top/g, function(u) {
    return lj[u];
  });
}
var oj = {
  start: "end",
  end: "start"
};
function DT(i) {
  return i.replace(/start|end/g, function(u) {
    return oj[u];
  });
}
function Nw(i) {
  var u = hi(i), c = u.pageXOffset, p = u.pageYOffset;
  return {
    scrollLeft: c,
    scrollTop: p
  };
}
function Lw(i) {
  return jd(cs(i)).left + Nw(i).scrollLeft;
}
function uj(i, u) {
  var c = hi(i), p = cs(i), y = c.visualViewport, w = p.clientWidth, S = p.clientHeight, D = 0, _ = 0;
  if (y) {
    w = y.width, S = y.height;
    var A = Q_();
    (A || !A && u === "fixed") && (D = y.offsetLeft, _ = y.offsetTop);
  }
  return {
    width: w,
    height: S,
    x: D + Lw(i),
    y: _
  };
}
function sj(i) {
  var u, c = cs(i), p = Nw(i), y = (u = i.ownerDocument) == null ? void 0 : u.body, w = Tc(c.scrollWidth, c.clientWidth, y ? y.scrollWidth : 0, y ? y.clientWidth : 0), S = Tc(c.scrollHeight, c.clientHeight, y ? y.scrollHeight : 0, y ? y.clientHeight : 0), D = -p.scrollLeft + Lw(i), _ = -p.scrollTop;
  return Xo(y || c).direction === "rtl" && (D += Tc(c.clientWidth, y ? y.clientWidth : 0) - w), {
    width: w,
    height: S,
    x: D,
    y: _
  };
}
function Aw(i) {
  var u = Xo(i), c = u.overflow, p = u.overflowX, y = u.overflowY;
  return /auto|scroll|overlay|hidden/.test(c + y + p);
}
function J_(i) {
  return ["html", "body", "#document"].indexOf(Xl(i)) >= 0 ? i.ownerDocument.body : Ai(i) && Aw(i) ? i : J_(r0(i));
}
function lv(i, u) {
  var c;
  u === void 0 && (u = []);
  var p = J_(i), y = p === ((c = i.ownerDocument) == null ? void 0 : c.body), w = hi(p), S = y ? [w].concat(w.visualViewport || [], Aw(p) ? p : []) : p, D = u.concat(S);
  return y ? D : (
    // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
    D.concat(lv(r0(S)))
  );
}
function JE(i) {
  return Object.assign({}, i, {
    left: i.x,
    top: i.y,
    right: i.x + i.width,
    bottom: i.y + i.height
  });
}
function cj(i, u) {
  var c = jd(i, !1, u === "fixed");
  return c.top = c.top + i.clientTop, c.left = c.left + i.clientLeft, c.bottom = c.top + i.clientHeight, c.right = c.left + i.clientWidth, c.width = i.clientWidth, c.height = i.clientHeight, c.x = c.left, c.y = c.top, c;
}
function kT(i, u, c) {
  return u === W_ ? JE(uj(i, c)) : _c(u) ? cj(u, c) : JE(sj(cs(i)));
}
function fj(i) {
  var u = lv(r0(i)), c = ["absolute", "fixed"].indexOf(Xo(i).position) >= 0, p = c && Ai(i) ? wv(i) : i;
  return _c(p) ? u.filter(function(y) {
    return _c(y) && q_(y, p) && Xl(y) !== "body";
  }) : [];
}
function dj(i, u, c, p) {
  var y = u === "clippingParents" ? fj(i) : [].concat(u), w = [].concat(y, [c]), S = w[0], D = w.reduce(function(_, A) {
    var U = kT(i, A, p);
    return _.top = Tc(U.top, _.top), _.right = Bg(U.right, _.right), _.bottom = Bg(U.bottom, _.bottom), _.left = Tc(U.left, _.left), _;
  }, kT(i, S, p));
  return D.width = D.right - D.left, D.height = D.bottom - D.top, D.x = D.left, D.y = D.top, D;
}
function eR(i) {
  var u = i.reference, c = i.element, p = i.placement, y = p ? Ql(p) : null, w = p ? Fd(p) : null, S = u.x + u.width / 2 - c.width / 2, D = u.y + u.height / 2 - c.height / 2, _;
  switch (y) {
    case Xa:
      _ = {
        x: S,
        y: u.y - c.height
      };
      break;
    case Ui:
      _ = {
        x: S,
        y: u.y + u.height
      };
      break;
    case zi:
      _ = {
        x: u.x + u.width,
        y: D
      };
      break;
    case Ka:
      _ = {
        x: u.x - c.width,
        y: D
      };
      break;
    default:
      _ = {
        x: u.x,
        y: u.y
      };
  }
  var A = y ? Mw(y) : null;
  if (A != null) {
    var U = A === "y" ? "height" : "width";
    switch (w) {
      case Ud:
        _[A] = _[A] - (u[U] / 2 - c[U] / 2);
        break;
      case dv:
        _[A] = _[A] + (u[U] / 2 - c[U] / 2);
        break;
    }
  }
  return _;
}
function pv(i, u) {
  u === void 0 && (u = {});
  var c = u, p = c.placement, y = p === void 0 ? i.placement : p, w = c.strategy, S = w === void 0 ? i.strategy : w, D = c.boundary, _ = D === void 0 ? L2 : D, A = c.rootBoundary, U = A === void 0 ? W_ : A, W = c.elementContext, X = W === void 0 ? rv : W, Q = c.altBoundary, oe = Q === void 0 ? !1 : Q, we = c.padding, ce = we === void 0 ? 0 : we, Me = K_(typeof ce != "number" ? ce : Z_(ce, Ev)), ve = X === rv ? A2 : rv, Se = i.rects.popper, O = i.elements[oe ? ve : X], be = dj(_c(O) ? O : O.contextElement || cs(i.elements.popper), _, U, S), le = jd(i.elements.reference), ye = eR({
    reference: le,
    element: Se,
    strategy: "absolute",
    placement: y
  }), ht = JE(Object.assign({}, Se, ye)), yt = X === rv ? ht : le, Je = {
    top: be.top - yt.top + Me.top,
    bottom: yt.bottom - be.bottom + Me.bottom,
    left: be.left - yt.left + Me.left,
    right: yt.right - be.right + Me.right
  }, Ke = i.modifiersData.offset;
  if (X === rv && Ke) {
    var ft = Ke[y];
    Object.keys(Je).forEach(function(Ee) {
      var Ge = [zi, Ui].indexOf(Ee) >= 0 ? 1 : -1, xt = [Xa, Ui].indexOf(Ee) >= 0 ? "y" : "x";
      Je[Ee] += ft[xt] * Ge;
    });
  }
  return Je;
}
function pj(i, u) {
  u === void 0 && (u = {});
  var c = u, p = c.placement, y = c.boundary, w = c.rootBoundary, S = c.padding, D = c.flipVariations, _ = c.allowedAutoPlacements, A = _ === void 0 ? $_ : _, U = Fd(p), W = U ? D ? TT : TT.filter(function(oe) {
    return Fd(oe) === U;
  }) : Ev, X = W.filter(function(oe) {
    return A.indexOf(oe) >= 0;
  });
  X.length === 0 && (X = W);
  var Q = X.reduce(function(oe, we) {
    return oe[we] = pv(i, {
      placement: we,
      boundary: y,
      rootBoundary: w,
      padding: S
    })[Ql(we)], oe;
  }, {});
  return Object.keys(Q).sort(function(oe, we) {
    return Q[oe] - Q[we];
  });
}
function hj(i) {
  if (Ql(i) === Dw)
    return [];
  var u = zg(i);
  return [DT(i), u, DT(u)];
}
function vj(i) {
  var u = i.state, c = i.options, p = i.name;
  if (!u.modifiersData[p]._skip) {
    for (var y = c.mainAxis, w = y === void 0 ? !0 : y, S = c.altAxis, D = S === void 0 ? !0 : S, _ = c.fallbackPlacements, A = c.padding, U = c.boundary, W = c.rootBoundary, X = c.altBoundary, Q = c.flipVariations, oe = Q === void 0 ? !0 : Q, we = c.allowedAutoPlacements, ce = u.options.placement, Me = Ql(ce), ve = Me === ce, Se = _ || (ve || !oe ? [zg(ce)] : hj(ce)), O = [ce].concat(Se).reduce(function(Zt, fn) {
      return Zt.concat(Ql(fn) === Dw ? pj(u, {
        placement: fn,
        boundary: U,
        rootBoundary: W,
        padding: A,
        flipVariations: oe,
        allowedAutoPlacements: we
      }) : fn);
    }, []), be = u.rects.reference, le = u.rects.popper, ye = /* @__PURE__ */ new Map(), ht = !0, yt = O[0], Je = 0; Je < O.length; Je++) {
      var Ke = O[Je], ft = Ql(Ke), Ee = Fd(Ke) === Ud, Ge = [Xa, Ui].indexOf(ft) >= 0, xt = Ge ? "width" : "height", it = pv(u, {
        placement: Ke,
        boundary: U,
        rootBoundary: W,
        altBoundary: X,
        padding: A
      }), _t = Ge ? Ee ? zi : Ka : Ee ? Ui : Xa;
      be[xt] > le[xt] && (_t = zg(_t));
      var J = zg(_t), De = [];
      if (w && De.push(it[ft] <= 0), D && De.push(it[_t] <= 0, it[J] <= 0), De.every(function(Zt) {
        return Zt;
      })) {
        yt = Ke, ht = !1;
        break;
      }
      ye.set(Ke, De);
    }
    if (ht)
      for (var se = oe ? 3 : 1, ot = function(fn) {
        var zt = O.find(function(On) {
          var $t = ye.get(On);
          if ($t)
            return $t.slice(0, fn).every(function(mn) {
              return mn;
            });
        });
        if (zt)
          return yt = zt, "break";
      }, ut = se; ut > 0; ut--) {
        var Kt = ot(ut);
        if (Kt === "break") break;
      }
    u.placement !== yt && (u.modifiersData[p]._skip = !0, u.placement = yt, u.reset = !0);
  }
}
const mj = {
  name: "flip",
  enabled: !0,
  phase: "main",
  fn: vj,
  requiresIfExists: ["offset"],
  data: {
    _skip: !1
  }
};
function OT(i, u, c) {
  return c === void 0 && (c = {
    x: 0,
    y: 0
  }), {
    top: i.top - u.height - c.y,
    right: i.right - u.width + c.x,
    bottom: i.bottom - u.height + c.y,
    left: i.left - u.width - c.x
  };
}
function MT(i) {
  return [Xa, zi, Ui, Ka].some(function(u) {
    return i[u] >= 0;
  });
}
function yj(i) {
  var u = i.state, c = i.name, p = u.rects.reference, y = u.rects.popper, w = u.modifiersData.preventOverflow, S = pv(u, {
    elementContext: "reference"
  }), D = pv(u, {
    altBoundary: !0
  }), _ = OT(S, p), A = OT(D, y, w), U = MT(_), W = MT(A);
  u.modifiersData[c] = {
    referenceClippingOffsets: _,
    popperEscapeOffsets: A,
    isReferenceHidden: U,
    hasPopperEscaped: W
  }, u.attributes.popper = Object.assign({}, u.attributes.popper, {
    "data-popper-reference-hidden": U,
    "data-popper-escaped": W
  });
}
const gj = {
  name: "hide",
  enabled: !0,
  phase: "main",
  requiresIfExists: ["preventOverflow"],
  fn: yj
};
function Sj(i, u, c) {
  var p = Ql(i), y = [Ka, Xa].indexOf(p) >= 0 ? -1 : 1, w = typeof c == "function" ? c(Object.assign({}, u, {
    placement: i
  })) : c, S = w[0], D = w[1];
  return S = S || 0, D = (D || 0) * y, [Ka, zi].indexOf(p) >= 0 ? {
    x: D,
    y: S
  } : {
    x: S,
    y: D
  };
}
function Ej(i) {
  var u = i.state, c = i.options, p = i.name, y = c.offset, w = y === void 0 ? [0, 0] : y, S = $_.reduce(function(U, W) {
    return U[W] = Sj(W, u.rects, w), U;
  }, {}), D = S[u.placement], _ = D.x, A = D.y;
  u.modifiersData.popperOffsets != null && (u.modifiersData.popperOffsets.x += _, u.modifiersData.popperOffsets.y += A), u.modifiersData[p] = S;
}
const wj = {
  name: "offset",
  enabled: !0,
  phase: "main",
  requires: ["popperOffsets"],
  fn: Ej
};
function Cj(i) {
  var u = i.state, c = i.name;
  u.modifiersData[c] = eR({
    reference: u.rects.reference,
    element: u.rects.popper,
    strategy: "absolute",
    placement: u.placement
  });
}
const bj = {
  name: "popperOffsets",
  enabled: !0,
  phase: "read",
  fn: Cj,
  data: {}
};
function xj(i) {
  return i === "x" ? "y" : "x";
}
function Tj(i) {
  var u = i.state, c = i.options, p = i.name, y = c.mainAxis, w = y === void 0 ? !0 : y, S = c.altAxis, D = S === void 0 ? !1 : S, _ = c.boundary, A = c.rootBoundary, U = c.altBoundary, W = c.padding, X = c.tether, Q = X === void 0 ? !0 : X, oe = c.tetherOffset, we = oe === void 0 ? 0 : oe, ce = pv(u, {
    boundary: _,
    rootBoundary: A,
    padding: W,
    altBoundary: U
  }), Me = Ql(u.placement), ve = Fd(u.placement), Se = !ve, O = Mw(Me), be = xj(O), le = u.modifiersData.popperOffsets, ye = u.rects.reference, ht = u.rects.popper, yt = typeof we == "function" ? we(Object.assign({}, u.rects, {
    placement: u.placement
  })) : we, Je = typeof yt == "number" ? {
    mainAxis: yt,
    altAxis: yt
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, yt), Ke = u.modifiersData.offset ? u.modifiersData.offset[u.placement] : null, ft = {
    x: 0,
    y: 0
  };
  if (le) {
    if (w) {
      var Ee, Ge = O === "y" ? Xa : Ka, xt = O === "y" ? Ui : zi, it = O === "y" ? "height" : "width", _t = le[O], J = _t + ce[Ge], De = _t - ce[xt], se = Q ? -ht[it] / 2 : 0, ot = ve === Ud ? ye[it] : ht[it], ut = ve === Ud ? -ht[it] : -ye[it], Kt = u.elements.arrow, Zt = Q && Kt ? Ow(Kt) : {
        width: 0,
        height: 0
      }, fn = u.modifiersData["arrow#persistent"] ? u.modifiersData["arrow#persistent"].padding : X_(), zt = fn[Ge], On = fn[xt], $t = iv(0, ye[it], Zt[it]), mn = Se ? ye[it] / 2 - se - $t - zt - Je.mainAxis : ot - $t - zt - Je.mainAxis, xn = Se ? -ye[it] / 2 + se + $t + On + Je.mainAxis : ut + $t + On + Je.mainAxis, yn = u.elements.arrow && wv(u.elements.arrow), Vn = yn ? O === "y" ? yn.clientTop || 0 : yn.clientLeft || 0 : 0, Ie = (Ee = Ke == null ? void 0 : Ke[O]) != null ? Ee : 0, vt = _t + mn - Ie - Vn, Gt = _t + xn - Ie, Jt = iv(Q ? Bg(J, vt) : J, _t, Q ? Tc(De, Gt) : De);
      le[O] = Jt, ft[O] = Jt - _t;
    }
    if (D) {
      var dn, Bn = O === "x" ? Xa : Ka, zn = O === "x" ? Ui : zi, In = le[be], Wn = be === "y" ? "height" : "width", fr = In + ce[Bn], Mn = In - ce[zn], xr = [Xa, Ka].indexOf(Me) !== -1, tr = (dn = Ke == null ? void 0 : Ke[be]) != null ? dn : 0, Tr = xr ? fr : In - ye[Wn] - ht[Wn] - tr + Je.altAxis, an = xr ? In + ye[Wn] + ht[Wn] - tr - Je.altAxis : Mn, nr = Q && xr ? q2(Tr, In, an) : iv(Q ? Tr : fr, In, Q ? an : Mn);
      le[be] = nr, ft[be] = nr - In;
    }
    u.modifiersData[p] = ft;
  }
}
const _j = {
  name: "preventOverflow",
  enabled: !0,
  phase: "main",
  fn: Tj,
  requiresIfExists: ["offset"]
};
function Rj(i) {
  return {
    scrollLeft: i.scrollLeft,
    scrollTop: i.scrollTop
  };
}
function Dj(i) {
  return i === hi(i) || !Ai(i) ? Nw(i) : Rj(i);
}
function kj(i) {
  var u = i.getBoundingClientRect(), c = zd(u.width) / i.offsetWidth || 1, p = zd(u.height) / i.offsetHeight || 1;
  return c !== 1 || p !== 1;
}
function Oj(i, u, c) {
  c === void 0 && (c = !1);
  var p = Ai(u), y = Ai(u) && kj(u), w = cs(u), S = jd(i, y, c), D = {
    scrollLeft: 0,
    scrollTop: 0
  }, _ = {
    x: 0,
    y: 0
  };
  return (p || !p && !c) && ((Xl(u) !== "body" || // https://github.com/popperjs/popper-core/issues/1078
  Aw(w)) && (D = Dj(u)), Ai(u) ? (_ = jd(u, !0), _.x += u.clientLeft, _.y += u.clientTop) : w && (_.x = Lw(w))), {
    x: S.left + D.scrollLeft - _.x,
    y: S.top + D.scrollTop - _.y,
    width: S.width,
    height: S.height
  };
}
function Mj(i) {
  var u = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Set(), p = [];
  i.forEach(function(w) {
    u.set(w.name, w);
  });
  function y(w) {
    c.add(w.name);
    var S = [].concat(w.requires || [], w.requiresIfExists || []);
    S.forEach(function(D) {
      if (!c.has(D)) {
        var _ = u.get(D);
        _ && y(_);
      }
    }), p.push(w);
  }
  return i.forEach(function(w) {
    c.has(w.name) || y(w);
  }), p;
}
function Nj(i) {
  var u = Mj(i);
  return I2.reduce(function(c, p) {
    return c.concat(u.filter(function(y) {
      return y.phase === p;
    }));
  }, []);
}
function Lj(i) {
  var u;
  return function() {
    return u || (u = new Promise(function(c) {
      Promise.resolve().then(function() {
        u = void 0, c(i());
      });
    })), u;
  };
}
function Aj(i) {
  var u = i.reduce(function(c, p) {
    var y = c[p.name];
    return c[p.name] = y ? Object.assign({}, y, p, {
      options: Object.assign({}, y.options, p.options),
      data: Object.assign({}, y.data, p.data)
    }) : p, c;
  }, {});
  return Object.keys(u).map(function(c) {
    return u[c];
  });
}
var NT = {
  placement: "bottom",
  modifiers: [],
  strategy: "absolute"
};
function LT() {
  for (var i = arguments.length, u = new Array(i), c = 0; c < i; c++)
    u[c] = arguments[c];
  return !u.some(function(p) {
    return !(p && typeof p.getBoundingClientRect == "function");
  });
}
function Uj(i) {
  i === void 0 && (i = {});
  var u = i, c = u.defaultModifiers, p = c === void 0 ? [] : c, y = u.defaultOptions, w = y === void 0 ? NT : y;
  return function(D, _, A) {
    A === void 0 && (A = w);
    var U = {
      placement: "bottom",
      orderedModifiers: [],
      options: Object.assign({}, NT, w),
      modifiersData: {},
      elements: {
        reference: D,
        popper: _
      },
      attributes: {},
      styles: {}
    }, W = [], X = !1, Q = {
      state: U,
      setOptions: function(Me) {
        var ve = typeof Me == "function" ? Me(U.options) : Me;
        we(), U.options = Object.assign({}, w, U.options, ve), U.scrollParents = {
          reference: _c(D) ? lv(D) : D.contextElement ? lv(D.contextElement) : [],
          popper: lv(_)
        };
        var Se = Nj(Aj([].concat(p, U.options.modifiers)));
        return U.orderedModifiers = Se.filter(function(O) {
          return O.enabled;
        }), oe(), Q.update();
      },
      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate: function() {
        if (!X) {
          var Me = U.elements, ve = Me.reference, Se = Me.popper;
          if (LT(ve, Se)) {
            U.rects = {
              reference: Oj(ve, wv(Se), U.options.strategy === "fixed"),
              popper: Ow(Se)
            }, U.reset = !1, U.placement = U.options.placement, U.orderedModifiers.forEach(function(Je) {
              return U.modifiersData[Je.name] = Object.assign({}, Je.data);
            });
            for (var O = 0; O < U.orderedModifiers.length; O++) {
              if (U.reset === !0) {
                U.reset = !1, O = -1;
                continue;
              }
              var be = U.orderedModifiers[O], le = be.fn, ye = be.options, ht = ye === void 0 ? {} : ye, yt = be.name;
              typeof le == "function" && (U = le({
                state: U,
                options: ht,
                name: yt,
                instance: Q
              }) || U);
            }
          }
        }
      },
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: Lj(function() {
        return new Promise(function(ce) {
          Q.forceUpdate(), ce(U);
        });
      }),
      destroy: function() {
        we(), X = !0;
      }
    };
    if (!LT(D, _))
      return Q;
    Q.setOptions(A).then(function(ce) {
      !X && A.onFirstUpdate && A.onFirstUpdate(ce);
    });
    function oe() {
      U.orderedModifiers.forEach(function(ce) {
        var Me = ce.name, ve = ce.options, Se = ve === void 0 ? {} : ve, O = ce.effect;
        if (typeof O == "function") {
          var be = O({
            state: U,
            name: Me,
            instance: Q,
            options: Se
          }), le = function() {
          };
          W.push(be || le);
        }
      });
    }
    function we() {
      W.forEach(function(ce) {
        return ce();
      }), W = [];
    }
    return Q;
  };
}
var zj = [ij, bj, rj, G_, wj, mj, _j, J2, gj], jj = /* @__PURE__ */ Uj({
  defaultModifiers: zj
}), Fj = "tippy-box", tR = "tippy-content", Hj = "tippy-backdrop", nR = "tippy-arrow", rR = "tippy-svg-arrow", Cc = {
  passive: !0,
  capture: !0
}, aR = function() {
  return document.body;
};
function Yj(i, u) {
  return {}.hasOwnProperty.call(i, u);
}
function zE(i, u, c) {
  if (Array.isArray(i)) {
    var p = i[u];
    return p ?? (Array.isArray(c) ? c[u] : c);
  }
  return i;
}
function Uw(i, u) {
  var c = {}.toString.call(i);
  return c.indexOf("[object") === 0 && c.indexOf(u + "]") > -1;
}
function iR(i, u) {
  return typeof i == "function" ? i.apply(void 0, u) : i;
}
function AT(i, u) {
  if (u === 0)
    return i;
  var c;
  return function(p) {
    clearTimeout(c), c = setTimeout(function() {
      i(p);
    }, u);
  };
}
function Pj(i, u) {
  var c = Object.assign({}, i);
  return u.forEach(function(p) {
    delete c[p];
  }), c;
}
function Vj(i) {
  return i.split(/\s+/).filter(Boolean);
}
function Dd(i) {
  return [].concat(i);
}
function UT(i, u) {
  i.indexOf(u) === -1 && i.push(u);
}
function Bj(i) {
  return i.filter(function(u, c) {
    return i.indexOf(u) === c;
  });
}
function Ij(i) {
  return i.split("-")[0];
}
function Ig(i) {
  return [].slice.call(i);
}
function zT(i) {
  return Object.keys(i).reduce(function(u, c) {
    return i[c] !== void 0 && (u[c] = i[c]), u;
  }, {});
}
function ov() {
  return document.createElement("div");
}
function hv(i) {
  return ["Element", "Fragment"].some(function(u) {
    return Uw(i, u);
  });
}
function Wj(i) {
  return Uw(i, "NodeList");
}
function $j(i) {
  return Uw(i, "MouseEvent");
}
function Gj(i) {
  return !!(i && i._tippy && i._tippy.reference === i);
}
function Qj(i) {
  return hv(i) ? [i] : Wj(i) ? Ig(i) : Array.isArray(i) ? i : Ig(document.querySelectorAll(i));
}
function jE(i, u) {
  i.forEach(function(c) {
    c && (c.style.transitionDuration = u + "ms");
  });
}
function jT(i, u) {
  i.forEach(function(c) {
    c && c.setAttribute("data-state", u);
  });
}
function qj(i) {
  var u, c = Dd(i), p = c[0];
  return p != null && (u = p.ownerDocument) != null && u.body ? p.ownerDocument : document;
}
function Xj(i, u) {
  var c = u.clientX, p = u.clientY;
  return i.every(function(y) {
    var w = y.popperRect, S = y.popperState, D = y.props, _ = D.interactiveBorder, A = Ij(S.placement), U = S.modifiersData.offset;
    if (!U)
      return !0;
    var W = A === "bottom" ? U.top.y : 0, X = A === "top" ? U.bottom.y : 0, Q = A === "right" ? U.left.x : 0, oe = A === "left" ? U.right.x : 0, we = w.top - p + W > _, ce = p - w.bottom - X > _, Me = w.left - c + Q > _, ve = c - w.right - oe > _;
    return we || ce || Me || ve;
  });
}
function FE(i, u, c) {
  var p = u + "EventListener";
  ["transitionend", "webkitTransitionEnd"].forEach(function(y) {
    i[p](y, c);
  });
}
function FT(i, u) {
  for (var c = u; c; ) {
    var p;
    if (i.contains(c))
      return !0;
    c = c.getRootNode == null || (p = c.getRootNode()) == null ? void 0 : p.host;
  }
  return !1;
}
var $l = {
  isTouch: !1
}, HT = 0;
function Kj() {
  $l.isTouch || ($l.isTouch = !0, window.performance && document.addEventListener("mousemove", lR));
}
function lR() {
  var i = performance.now();
  i - HT < 20 && ($l.isTouch = !1, document.removeEventListener("mousemove", lR)), HT = i;
}
function Zj() {
  var i = document.activeElement;
  if (Gj(i)) {
    var u = i._tippy;
    i.blur && !u.state.isVisible && i.blur();
  }
}
function Jj() {
  document.addEventListener("touchstart", Kj, Cc), window.addEventListener("blur", Zj);
}
var eF = typeof window < "u" && typeof document < "u", tF = eF ? (
  // @ts-ignore
  !!window.msCrypto
) : !1;
function _d(i) {
  var u = i === "destroy" ? "n already-" : " ";
  return [i + "() was called on a" + u + "destroyed instance. This is a no-op but", "indicates a potential memory leak."].join(" ");
}
function YT(i) {
  var u = /[ \t]{2,}/g, c = /^[ \t]*/gm;
  return i.replace(u, " ").replace(c, "").trim();
}
function nF(i) {
  return YT(`
  %ctippy.js

  %c` + YT(i) + `

  %c👷‍ This is a development-only message. It will be removed in production.
  `);
}
function oR(i) {
  return [
    nF(i),
    // title
    "color: #00C584; font-size: 1.3em; font-weight: bold;",
    // message
    "line-height: 1.5",
    // footer
    "color: #a6a095;"
  ];
}
var vv;
process.env.NODE_ENV !== "production" && rF();
function rF() {
  vv = /* @__PURE__ */ new Set();
}
function Bo(i, u) {
  if (i && !vv.has(u)) {
    var c;
    vv.add(u), (c = console).warn.apply(c, oR(u));
  }
}
function ew(i, u) {
  if (i && !vv.has(u)) {
    var c;
    vv.add(u), (c = console).error.apply(c, oR(u));
  }
}
function aF(i) {
  var u = !i, c = Object.prototype.toString.call(i) === "[object Object]" && !i.addEventListener;
  ew(u, ["tippy() was passed", "`" + String(i) + "`", "as its targets (first) argument. Valid types are: String, Element,", "Element[], or NodeList."].join(" ")), ew(c, ["tippy() was passed a plain object which is not supported as an argument", "for virtual positioning. Use props.getReferenceClientRect instead."].join(" "));
}
var uR = {
  animateFill: !1,
  followCursor: !1,
  inlinePositioning: !1,
  sticky: !1
}, iF = {
  allowHTML: !1,
  animation: "fade",
  arrow: !0,
  content: "",
  inertia: !1,
  maxWidth: 350,
  role: "tooltip",
  theme: "",
  zIndex: 9999
}, pi = Object.assign({
  appendTo: aR,
  aria: {
    content: "auto",
    expanded: "auto"
  },
  delay: 0,
  duration: [300, 250],
  getReferenceClientRect: null,
  hideOnClick: !0,
  ignoreAttributes: !1,
  interactive: !1,
  interactiveBorder: 2,
  interactiveDebounce: 0,
  moveTransition: "",
  offset: [0, 10],
  onAfterUpdate: function() {
  },
  onBeforeUpdate: function() {
  },
  onCreate: function() {
  },
  onDestroy: function() {
  },
  onHidden: function() {
  },
  onHide: function() {
  },
  onMount: function() {
  },
  onShow: function() {
  },
  onShown: function() {
  },
  onTrigger: function() {
  },
  onUntrigger: function() {
  },
  onClickOutside: function() {
  },
  placement: "top",
  plugins: [],
  popperOptions: {},
  render: null,
  showOnCreate: !1,
  touch: !0,
  trigger: "mouseenter focus",
  triggerTarget: null
}, uR, iF), lF = Object.keys(pi), oF = function(u) {
  process.env.NODE_ENV !== "production" && cR(u, []);
  var c = Object.keys(u);
  c.forEach(function(p) {
    pi[p] = u[p];
  });
};
function sR(i) {
  var u = i.plugins || [], c = u.reduce(function(p, y) {
    var w = y.name, S = y.defaultValue;
    if (w) {
      var D;
      p[w] = i[w] !== void 0 ? i[w] : (D = pi[w]) != null ? D : S;
    }
    return p;
  }, {});
  return Object.assign({}, i, c);
}
function uF(i, u) {
  var c = u ? Object.keys(sR(Object.assign({}, pi, {
    plugins: u
  }))) : lF, p = c.reduce(function(y, w) {
    var S = (i.getAttribute("data-tippy-" + w) || "").trim();
    if (!S)
      return y;
    if (w === "content")
      y[w] = S;
    else
      try {
        y[w] = JSON.parse(S);
      } catch {
        y[w] = S;
      }
    return y;
  }, {});
  return p;
}
function PT(i, u) {
  var c = Object.assign({}, u, {
    content: iR(u.content, [i])
  }, u.ignoreAttributes ? {} : uF(i, u.plugins));
  return c.aria = Object.assign({}, pi.aria, c.aria), c.aria = {
    expanded: c.aria.expanded === "auto" ? u.interactive : c.aria.expanded,
    content: c.aria.content === "auto" ? u.interactive ? null : "describedby" : c.aria.content
  }, c;
}
function cR(i, u) {
  i === void 0 && (i = {}), u === void 0 && (u = []);
  var c = Object.keys(i);
  c.forEach(function(p) {
    var y = Pj(pi, Object.keys(uR)), w = !Yj(y, p);
    w && (w = u.filter(function(S) {
      return S.name === p;
    }).length === 0), Bo(w, ["`" + p + "`", "is not a valid prop. You may have spelled it incorrectly, or if it's", "a plugin, forgot to pass it in an array as props.plugins.", `

`, `All props: https://atomiks.github.io/tippyjs/v6/all-props/
`, "Plugins: https://atomiks.github.io/tippyjs/v6/plugins/"].join(" "));
  });
}
var sF = function() {
  return "innerHTML";
};
function tw(i, u) {
  i[sF()] = u;
}
function VT(i) {
  var u = ov();
  return i === !0 ? u.className = nR : (u.className = rR, hv(i) ? u.appendChild(i) : tw(u, i)), u;
}
function BT(i, u) {
  hv(u.content) ? (tw(i, ""), i.appendChild(u.content)) : typeof u.content != "function" && (u.allowHTML ? tw(i, u.content) : i.textContent = u.content);
}
function nw(i) {
  var u = i.firstElementChild, c = Ig(u.children);
  return {
    box: u,
    content: c.find(function(p) {
      return p.classList.contains(tR);
    }),
    arrow: c.find(function(p) {
      return p.classList.contains(nR) || p.classList.contains(rR);
    }),
    backdrop: c.find(function(p) {
      return p.classList.contains(Hj);
    })
  };
}
function fR(i) {
  var u = ov(), c = ov();
  c.className = Fj, c.setAttribute("data-state", "hidden"), c.setAttribute("tabindex", "-1");
  var p = ov();
  p.className = tR, p.setAttribute("data-state", "hidden"), BT(p, i.props), u.appendChild(c), c.appendChild(p), y(i.props, i.props);
  function y(w, S) {
    var D = nw(u), _ = D.box, A = D.content, U = D.arrow;
    S.theme ? _.setAttribute("data-theme", S.theme) : _.removeAttribute("data-theme"), typeof S.animation == "string" ? _.setAttribute("data-animation", S.animation) : _.removeAttribute("data-animation"), S.inertia ? _.setAttribute("data-inertia", "") : _.removeAttribute("data-inertia"), _.style.maxWidth = typeof S.maxWidth == "number" ? S.maxWidth + "px" : S.maxWidth, S.role ? _.setAttribute("role", S.role) : _.removeAttribute("role"), (w.content !== S.content || w.allowHTML !== S.allowHTML) && BT(A, i.props), S.arrow ? U ? w.arrow !== S.arrow && (_.removeChild(U), _.appendChild(VT(S.arrow))) : _.appendChild(VT(S.arrow)) : U && _.removeChild(U);
  }
  return {
    popper: u,
    onUpdate: y
  };
}
fR.$$tippy = !0;
var cF = 1, kg = [], HE = [];
function fF(i, u) {
  var c = PT(i, Object.assign({}, pi, sR(zT(u)))), p, y, w, S = !1, D = !1, _ = !1, A = !1, U, W, X, Q = [], oe = AT(vt, c.interactiveDebounce), we, ce = cF++, Me = null, ve = Bj(c.plugins), Se = {
    // Is the instance currently enabled?
    isEnabled: !0,
    // Is the tippy currently showing and not transitioning out?
    isVisible: !1,
    // Has the instance been destroyed?
    isDestroyed: !1,
    // Is the tippy currently mounted to the DOM?
    isMounted: !1,
    // Has the tippy finished transitioning in?
    isShown: !1
  }, O = {
    // properties
    id: ce,
    reference: i,
    popper: ov(),
    popperInstance: Me,
    props: c,
    state: Se,
    plugins: ve,
    // methods
    clearDelayTimeouts: Tr,
    setProps: an,
    setContent: nr,
    show: mi,
    hide: sa,
    hideWithInteractivity: fe,
    enable: xr,
    disable: tr,
    unmount: Ye,
    destroy: mt
  };
  if (!c.render)
    return process.env.NODE_ENV !== "production" && ew(!0, "render() function has not been supplied."), O;
  var be = c.render(O), le = be.popper, ye = be.onUpdate;
  le.setAttribute("data-tippy-root", ""), le.id = "tippy-" + O.id, O.popper = le, i._tippy = O, le._tippy = O;
  var ht = ve.map(function(P) {
    return P.fn(O);
  }), yt = i.hasAttribute("aria-expanded");
  return yn(), se(), _t(), J("onCreate", [O]), c.showOnCreate && fr(), le.addEventListener("mouseenter", function() {
    O.props.interactive && O.state.isVisible && O.clearDelayTimeouts();
  }), le.addEventListener("mouseleave", function() {
    O.props.interactive && O.props.trigger.indexOf("mouseenter") >= 0 && Ge().addEventListener("mousemove", oe);
  }), O;
  function Je() {
    var P = O.props.touch;
    return Array.isArray(P) ? P : [P, 0];
  }
  function Ke() {
    return Je()[0] === "hold";
  }
  function ft() {
    var P;
    return !!((P = O.props.render) != null && P.$$tippy);
  }
  function Ee() {
    return we || i;
  }
  function Ge() {
    var P = Ee().parentNode;
    return P ? qj(P) : document;
  }
  function xt() {
    return nw(le);
  }
  function it(P) {
    return O.state.isMounted && !O.state.isVisible || $l.isTouch || U && U.type === "focus" ? 0 : zE(O.props.delay, P ? 0 : 1, pi.delay);
  }
  function _t(P) {
    P === void 0 && (P = !1), le.style.pointerEvents = O.props.interactive && !P ? "" : "none", le.style.zIndex = "" + O.props.zIndex;
  }
  function J(P, ue, ke) {
    if (ke === void 0 && (ke = !0), ht.forEach(function(tt) {
      tt[P] && tt[P].apply(tt, ue);
    }), ke) {
      var qe;
      (qe = O.props)[P].apply(qe, ue);
    }
  }
  function De() {
    var P = O.props.aria;
    if (P.content) {
      var ue = "aria-" + P.content, ke = le.id, qe = Dd(O.props.triggerTarget || i);
      qe.forEach(function(tt) {
        var pt = tt.getAttribute(ue);
        if (O.state.isVisible)
          tt.setAttribute(ue, pt ? pt + " " + ke : ke);
        else {
          var tn = pt && pt.replace(ke, "").trim();
          tn ? tt.setAttribute(ue, tn) : tt.removeAttribute(ue);
        }
      });
    }
  }
  function se() {
    if (!(yt || !O.props.aria.expanded)) {
      var P = Dd(O.props.triggerTarget || i);
      P.forEach(function(ue) {
        O.props.interactive ? ue.setAttribute("aria-expanded", O.state.isVisible && ue === Ee() ? "true" : "false") : ue.removeAttribute("aria-expanded");
      });
    }
  }
  function ot() {
    Ge().removeEventListener("mousemove", oe), kg = kg.filter(function(P) {
      return P !== oe;
    });
  }
  function ut(P) {
    if (!($l.isTouch && (_ || P.type === "mousedown"))) {
      var ue = P.composedPath && P.composedPath()[0] || P.target;
      if (!(O.props.interactive && FT(le, ue))) {
        if (Dd(O.props.triggerTarget || i).some(function(ke) {
          return FT(ke, ue);
        })) {
          if ($l.isTouch || O.state.isVisible && O.props.trigger.indexOf("click") >= 0)
            return;
        } else
          J("onClickOutside", [O, P]);
        O.props.hideOnClick === !0 && (O.clearDelayTimeouts(), O.hide(), D = !0, setTimeout(function() {
          D = !1;
        }), O.state.isMounted || zt());
      }
    }
  }
  function Kt() {
    _ = !0;
  }
  function Zt() {
    _ = !1;
  }
  function fn() {
    var P = Ge();
    P.addEventListener("mousedown", ut, !0), P.addEventListener("touchend", ut, Cc), P.addEventListener("touchstart", Zt, Cc), P.addEventListener("touchmove", Kt, Cc);
  }
  function zt() {
    var P = Ge();
    P.removeEventListener("mousedown", ut, !0), P.removeEventListener("touchend", ut, Cc), P.removeEventListener("touchstart", Zt, Cc), P.removeEventListener("touchmove", Kt, Cc);
  }
  function On(P, ue) {
    mn(P, function() {
      !O.state.isVisible && le.parentNode && le.parentNode.contains(le) && ue();
    });
  }
  function $t(P, ue) {
    mn(P, ue);
  }
  function mn(P, ue) {
    var ke = xt().box;
    function qe(tt) {
      tt.target === ke && (FE(ke, "remove", qe), ue());
    }
    if (P === 0)
      return ue();
    FE(ke, "remove", W), FE(ke, "add", qe), W = qe;
  }
  function xn(P, ue, ke) {
    ke === void 0 && (ke = !1);
    var qe = Dd(O.props.triggerTarget || i);
    qe.forEach(function(tt) {
      tt.addEventListener(P, ue, ke), Q.push({
        node: tt,
        eventType: P,
        handler: ue,
        options: ke
      });
    });
  }
  function yn() {
    Ke() && (xn("touchstart", Ie, {
      passive: !0
    }), xn("touchend", Gt, {
      passive: !0
    })), Vj(O.props.trigger).forEach(function(P) {
      if (P !== "manual")
        switch (xn(P, Ie), P) {
          case "mouseenter":
            xn("mouseleave", Gt);
            break;
          case "focus":
            xn(tF ? "focusout" : "blur", Jt);
            break;
          case "focusin":
            xn("focusout", Jt);
            break;
        }
    });
  }
  function Vn() {
    Q.forEach(function(P) {
      var ue = P.node, ke = P.eventType, qe = P.handler, tt = P.options;
      ue.removeEventListener(ke, qe, tt);
    }), Q = [];
  }
  function Ie(P) {
    var ue, ke = !1;
    if (!(!O.state.isEnabled || dn(P) || D)) {
      var qe = ((ue = U) == null ? void 0 : ue.type) === "focus";
      U = P, we = P.currentTarget, se(), !O.state.isVisible && $j(P) && kg.forEach(function(tt) {
        return tt(P);
      }), P.type === "click" && (O.props.trigger.indexOf("mouseenter") < 0 || S) && O.props.hideOnClick !== !1 && O.state.isVisible ? ke = !0 : fr(P), P.type === "click" && (S = !ke), ke && !qe && Mn(P);
    }
  }
  function vt(P) {
    var ue = P.target, ke = Ee().contains(ue) || le.contains(ue);
    if (!(P.type === "mousemove" && ke)) {
      var qe = Wn().concat(le).map(function(tt) {
        var pt, tn = tt._tippy, kt = (pt = tn.popperInstance) == null ? void 0 : pt.state;
        return kt ? {
          popperRect: tt.getBoundingClientRect(),
          popperState: kt,
          props: c
        } : null;
      }).filter(Boolean);
      Xj(qe, P) && (ot(), Mn(P));
    }
  }
  function Gt(P) {
    var ue = dn(P) || O.props.trigger.indexOf("click") >= 0 && S;
    if (!ue) {
      if (O.props.interactive) {
        O.hideWithInteractivity(P);
        return;
      }
      Mn(P);
    }
  }
  function Jt(P) {
    O.props.trigger.indexOf("focusin") < 0 && P.target !== Ee() || O.props.interactive && P.relatedTarget && le.contains(P.relatedTarget) || Mn(P);
  }
  function dn(P) {
    return $l.isTouch ? Ke() !== P.type.indexOf("touch") >= 0 : !1;
  }
  function Bn() {
    zn();
    var P = O.props, ue = P.popperOptions, ke = P.placement, qe = P.offset, tt = P.getReferenceClientRect, pt = P.moveTransition, tn = ft() ? nw(le).arrow : null, kt = tt ? {
      getBoundingClientRect: tt,
      contextElement: tt.contextElement || Ee()
    } : i, Bt = {
      name: "$$tippy",
      enabled: !0,
      phase: "beforeWrite",
      requires: ["computeStyles"],
      fn: function(Ja) {
        var xa = Ja.state;
        if (ft()) {
          var Jo = xt(), ei = Jo.box;
          ["placement", "reference-hidden", "escaped"].forEach(function(ti) {
            ti === "placement" ? ei.setAttribute("data-placement", xa.placement) : xa.attributes.popper["data-popper-" + ti] ? ei.setAttribute("data-" + ti, "") : ei.removeAttribute("data-" + ti);
          }), xa.attributes.popper = {};
        }
      }
    }, Ir = [{
      name: "offset",
      options: {
        offset: qe
      }
    }, {
      name: "preventOverflow",
      options: {
        padding: {
          top: 2,
          bottom: 2,
          left: 5,
          right: 5
        }
      }
    }, {
      name: "flip",
      options: {
        padding: 5
      }
    }, {
      name: "computeStyles",
      options: {
        adaptive: !pt
      }
    }, Bt];
    ft() && tn && Ir.push({
      name: "arrow",
      options: {
        element: tn,
        padding: 3
      }
    }), Ir.push.apply(Ir, (ue == null ? void 0 : ue.modifiers) || []), O.popperInstance = jj(kt, le, Object.assign({}, ue, {
      placement: ke,
      onFirstUpdate: X,
      modifiers: Ir
    }));
  }
  function zn() {
    O.popperInstance && (O.popperInstance.destroy(), O.popperInstance = null);
  }
  function In() {
    var P = O.props.appendTo, ue, ke = Ee();
    O.props.interactive && P === aR || P === "parent" ? ue = ke.parentNode : ue = iR(P, [ke]), ue.contains(le) || ue.appendChild(le), O.state.isMounted = !0, Bn(), process.env.NODE_ENV !== "production" && Bo(O.props.interactive && P === pi.appendTo && ke.nextElementSibling !== le, ["Interactive tippy element may not be accessible via keyboard", "navigation because it is not directly after the reference element", "in the DOM source order.", `

`, "Using a wrapper <div> or <span> tag around the reference element", "solves this by creating a new parentNode context.", `

`, "Specifying `appendTo: document.body` silences this warning, but it", "assumes you are using a focus management solution to handle", "keyboard navigation.", `

`, "See: https://atomiks.github.io/tippyjs/v6/accessibility/#interactivity"].join(" "));
  }
  function Wn() {
    return Ig(le.querySelectorAll("[data-tippy-root]"));
  }
  function fr(P) {
    O.clearDelayTimeouts(), P && J("onTrigger", [O, P]), fn();
    var ue = it(!0), ke = Je(), qe = ke[0], tt = ke[1];
    $l.isTouch && qe === "hold" && tt && (ue = tt), ue ? p = setTimeout(function() {
      O.show();
    }, ue) : O.show();
  }
  function Mn(P) {
    if (O.clearDelayTimeouts(), J("onUntrigger", [O, P]), !O.state.isVisible) {
      zt();
      return;
    }
    if (!(O.props.trigger.indexOf("mouseenter") >= 0 && O.props.trigger.indexOf("click") >= 0 && ["mouseleave", "mousemove"].indexOf(P.type) >= 0 && S)) {
      var ue = it(!1);
      ue ? y = setTimeout(function() {
        O.state.isVisible && O.hide();
      }, ue) : w = requestAnimationFrame(function() {
        O.hide();
      });
    }
  }
  function xr() {
    O.state.isEnabled = !0;
  }
  function tr() {
    O.hide(), O.state.isEnabled = !1;
  }
  function Tr() {
    clearTimeout(p), clearTimeout(y), cancelAnimationFrame(w);
  }
  function an(P) {
    if (process.env.NODE_ENV !== "production" && Bo(O.state.isDestroyed, _d("setProps")), !O.state.isDestroyed) {
      J("onBeforeUpdate", [O, P]), Vn();
      var ue = O.props, ke = PT(i, Object.assign({}, ue, zT(P), {
        ignoreAttributes: !0
      }));
      O.props = ke, yn(), ue.interactiveDebounce !== ke.interactiveDebounce && (ot(), oe = AT(vt, ke.interactiveDebounce)), ue.triggerTarget && !ke.triggerTarget ? Dd(ue.triggerTarget).forEach(function(qe) {
        qe.removeAttribute("aria-expanded");
      }) : ke.triggerTarget && i.removeAttribute("aria-expanded"), se(), _t(), ye && ye(ue, ke), O.popperInstance && (Bn(), Wn().forEach(function(qe) {
        requestAnimationFrame(qe._tippy.popperInstance.forceUpdate);
      })), J("onAfterUpdate", [O, P]);
    }
  }
  function nr(P) {
    O.setProps({
      content: P
    });
  }
  function mi() {
    process.env.NODE_ENV !== "production" && Bo(O.state.isDestroyed, _d("show"));
    var P = O.state.isVisible, ue = O.state.isDestroyed, ke = !O.state.isEnabled, qe = $l.isTouch && !O.props.touch, tt = zE(O.props.duration, 0, pi.duration);
    if (!(P || ue || ke || qe) && !Ee().hasAttribute("disabled") && (J("onShow", [O], !1), O.props.onShow(O) !== !1)) {
      if (O.state.isVisible = !0, ft() && (le.style.visibility = "visible"), _t(), fn(), O.state.isMounted || (le.style.transition = "none"), ft()) {
        var pt = xt(), tn = pt.box, kt = pt.content;
        jE([tn, kt], 0);
      }
      X = function() {
        var Ir;
        if (!(!O.state.isVisible || A)) {
          if (A = !0, le.offsetHeight, le.style.transition = O.props.moveTransition, ft() && O.props.animation) {
            var Za = xt(), Ja = Za.box, xa = Za.content;
            jE([Ja, xa], tt), jT([Ja, xa], "visible");
          }
          De(), se(), UT(HE, O), (Ir = O.popperInstance) == null || Ir.forceUpdate(), J("onMount", [O]), O.props.animation && ft() && $t(tt, function() {
            O.state.isShown = !0, J("onShown", [O]);
          });
        }
      }, In();
    }
  }
  function sa() {
    process.env.NODE_ENV !== "production" && Bo(O.state.isDestroyed, _d("hide"));
    var P = !O.state.isVisible, ue = O.state.isDestroyed, ke = !O.state.isEnabled, qe = zE(O.props.duration, 1, pi.duration);
    if (!(P || ue || ke) && (J("onHide", [O], !1), O.props.onHide(O) !== !1)) {
      if (O.state.isVisible = !1, O.state.isShown = !1, A = !1, S = !1, ft() && (le.style.visibility = "hidden"), ot(), zt(), _t(!0), ft()) {
        var tt = xt(), pt = tt.box, tn = tt.content;
        O.props.animation && (jE([pt, tn], qe), jT([pt, tn], "hidden"));
      }
      De(), se(), O.props.animation ? ft() && On(qe, O.unmount) : O.unmount();
    }
  }
  function fe(P) {
    process.env.NODE_ENV !== "production" && Bo(O.state.isDestroyed, _d("hideWithInteractivity")), Ge().addEventListener("mousemove", oe), UT(kg, oe), oe(P);
  }
  function Ye() {
    process.env.NODE_ENV !== "production" && Bo(O.state.isDestroyed, _d("unmount")), O.state.isVisible && O.hide(), O.state.isMounted && (zn(), Wn().forEach(function(P) {
      P._tippy.unmount();
    }), le.parentNode && le.parentNode.removeChild(le), HE = HE.filter(function(P) {
      return P !== O;
    }), O.state.isMounted = !1, J("onHidden", [O]));
  }
  function mt() {
    process.env.NODE_ENV !== "production" && Bo(O.state.isDestroyed, _d("destroy")), !O.state.isDestroyed && (O.clearDelayTimeouts(), O.unmount(), Vn(), delete i._tippy, O.state.isDestroyed = !0, J("onDestroy", [O]));
  }
}
function Cv(i, u) {
  u === void 0 && (u = {});
  var c = pi.plugins.concat(u.plugins || []);
  process.env.NODE_ENV !== "production" && (aF(i), cR(u, c)), Jj();
  var p = Object.assign({}, u, {
    plugins: c
  }), y = Qj(i);
  if (process.env.NODE_ENV !== "production") {
    var w = hv(p.content), S = y.length > 1;
    Bo(w && S, ["tippy() was passed an Element as the `content` prop, but more than", "one tippy instance was created by this invocation. This means the", "content element will only be appended to the last tippy instance.", `

`, "Instead, pass the .innerHTML of the element, or use a function that", "returns a cloned version of the element instead.", `

`, `1) content: element.innerHTML
`, "2) content: () => element.cloneNode(true)"].join(" "));
  }
  var D = y.reduce(function(_, A) {
    var U = A && fF(A, p);
    return U && _.push(U), _;
  }, []);
  return hv(i) ? D[0] : D;
}
Cv.defaultProps = pi;
Cv.setDefaultProps = oF;
Cv.currentInput = $l;
Object.assign({}, G_, {
  effect: function(u) {
    var c = u.state, p = {
      popper: {
        position: c.options.strategy,
        left: "0",
        top: "0",
        margin: "0"
      },
      arrow: {
        position: "absolute"
      },
      reference: {}
    };
    Object.assign(c.elements.popper.style, p.popper), c.styles = p, c.elements.arrow && Object.assign(c.elements.arrow.style, p.arrow);
  }
});
Cv.setDefaultProps({
  render: fR
});
var rw = { exports: {} }, Ga = {}, Og = { exports: {} }, YE = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var IT;
function dF() {
  return IT || (IT = 1, function(i) {
    function u(J, De) {
      var se = J.length;
      J.push(De);
      e: for (; 0 < se; ) {
        var ot = se - 1 >>> 1, ut = J[ot];
        if (0 < y(ut, De)) J[ot] = De, J[se] = ut, se = ot;
        else break e;
      }
    }
    function c(J) {
      return J.length === 0 ? null : J[0];
    }
    function p(J) {
      if (J.length === 0) return null;
      var De = J[0], se = J.pop();
      if (se !== De) {
        J[0] = se;
        e: for (var ot = 0, ut = J.length, Kt = ut >>> 1; ot < Kt; ) {
          var Zt = 2 * (ot + 1) - 1, fn = J[Zt], zt = Zt + 1, On = J[zt];
          if (0 > y(fn, se)) zt < ut && 0 > y(On, fn) ? (J[ot] = On, J[zt] = se, ot = zt) : (J[ot] = fn, J[Zt] = se, ot = Zt);
          else if (zt < ut && 0 > y(On, se)) J[ot] = On, J[zt] = se, ot = zt;
          else break e;
        }
      }
      return De;
    }
    function y(J, De) {
      var se = J.sortIndex - De.sortIndex;
      return se !== 0 ? se : J.id - De.id;
    }
    if (typeof performance == "object" && typeof performance.now == "function") {
      var w = performance;
      i.unstable_now = function() {
        return w.now();
      };
    } else {
      var S = Date, D = S.now();
      i.unstable_now = function() {
        return S.now() - D;
      };
    }
    var _ = [], A = [], U = 1, W = null, X = 3, Q = !1, oe = !1, we = !1, ce = typeof setTimeout == "function" ? setTimeout : null, Me = typeof clearTimeout == "function" ? clearTimeout : null, ve = typeof setImmediate < "u" ? setImmediate : null;
    typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function Se(J) {
      for (var De = c(A); De !== null; ) {
        if (De.callback === null) p(A);
        else if (De.startTime <= J) p(A), De.sortIndex = De.expirationTime, u(_, De);
        else break;
        De = c(A);
      }
    }
    function O(J) {
      if (we = !1, Se(J), !oe) if (c(_) !== null) oe = !0, it(be);
      else {
        var De = c(A);
        De !== null && _t(O, De.startTime - J);
      }
    }
    function be(J, De) {
      oe = !1, we && (we = !1, Me(ht), ht = -1), Q = !0;
      var se = X;
      try {
        for (Se(De), W = c(_); W !== null && (!(W.expirationTime > De) || J && !Ke()); ) {
          var ot = W.callback;
          if (typeof ot == "function") {
            W.callback = null, X = W.priorityLevel;
            var ut = ot(W.expirationTime <= De);
            De = i.unstable_now(), typeof ut == "function" ? W.callback = ut : W === c(_) && p(_), Se(De);
          } else p(_);
          W = c(_);
        }
        if (W !== null) var Kt = !0;
        else {
          var Zt = c(A);
          Zt !== null && _t(O, Zt.startTime - De), Kt = !1;
        }
        return Kt;
      } finally {
        W = null, X = se, Q = !1;
      }
    }
    var le = !1, ye = null, ht = -1, yt = 5, Je = -1;
    function Ke() {
      return !(i.unstable_now() - Je < yt);
    }
    function ft() {
      if (ye !== null) {
        var J = i.unstable_now();
        Je = J;
        var De = !0;
        try {
          De = ye(!0, J);
        } finally {
          De ? Ee() : (le = !1, ye = null);
        }
      } else le = !1;
    }
    var Ee;
    if (typeof ve == "function") Ee = function() {
      ve(ft);
    };
    else if (typeof MessageChannel < "u") {
      var Ge = new MessageChannel(), xt = Ge.port2;
      Ge.port1.onmessage = ft, Ee = function() {
        xt.postMessage(null);
      };
    } else Ee = function() {
      ce(ft, 0);
    };
    function it(J) {
      ye = J, le || (le = !0, Ee());
    }
    function _t(J, De) {
      ht = ce(function() {
        J(i.unstable_now());
      }, De);
    }
    i.unstable_IdlePriority = 5, i.unstable_ImmediatePriority = 1, i.unstable_LowPriority = 4, i.unstable_NormalPriority = 3, i.unstable_Profiling = null, i.unstable_UserBlockingPriority = 2, i.unstable_cancelCallback = function(J) {
      J.callback = null;
    }, i.unstable_continueExecution = function() {
      oe || Q || (oe = !0, it(be));
    }, i.unstable_forceFrameRate = function(J) {
      0 > J || 125 < J ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : yt = 0 < J ? Math.floor(1e3 / J) : 5;
    }, i.unstable_getCurrentPriorityLevel = function() {
      return X;
    }, i.unstable_getFirstCallbackNode = function() {
      return c(_);
    }, i.unstable_next = function(J) {
      switch (X) {
        case 1:
        case 2:
        case 3:
          var De = 3;
          break;
        default:
          De = X;
      }
      var se = X;
      X = De;
      try {
        return J();
      } finally {
        X = se;
      }
    }, i.unstable_pauseExecution = function() {
    }, i.unstable_requestPaint = function() {
    }, i.unstable_runWithPriority = function(J, De) {
      switch (J) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          J = 3;
      }
      var se = X;
      X = J;
      try {
        return De();
      } finally {
        X = se;
      }
    }, i.unstable_scheduleCallback = function(J, De, se) {
      var ot = i.unstable_now();
      switch (typeof se == "object" && se !== null ? (se = se.delay, se = typeof se == "number" && 0 < se ? ot + se : ot) : se = ot, J) {
        case 1:
          var ut = -1;
          break;
        case 2:
          ut = 250;
          break;
        case 5:
          ut = 1073741823;
          break;
        case 4:
          ut = 1e4;
          break;
        default:
          ut = 5e3;
      }
      return ut = se + ut, J = { id: U++, callback: De, priorityLevel: J, startTime: se, expirationTime: ut, sortIndex: -1 }, se > ot ? (J.sortIndex = se, u(A, J), c(_) === null && J === c(A) && (we ? (Me(ht), ht = -1) : we = !0, _t(O, se - ot))) : (J.sortIndex = ut, u(_, J), oe || Q || (oe = !0, it(be))), J;
    }, i.unstable_shouldYield = Ke, i.unstable_wrapCallback = function(J) {
      var De = X;
      return function() {
        var se = X;
        X = De;
        try {
          return J.apply(this, arguments);
        } finally {
          X = se;
        }
      };
    };
  }(YE)), YE;
}
var PE = {};
/**
 * @license React
 * scheduler.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var WT;
function pF() {
  return WT || (WT = 1, function(i) {
    process.env.NODE_ENV !== "production" && function() {
      typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
      var u = !1, c = !1, p = 5;
      function y(fe, Ye) {
        var mt = fe.length;
        fe.push(Ye), D(fe, Ye, mt);
      }
      function w(fe) {
        return fe.length === 0 ? null : fe[0];
      }
      function S(fe) {
        if (fe.length === 0)
          return null;
        var Ye = fe[0], mt = fe.pop();
        return mt !== Ye && (fe[0] = mt, _(fe, mt, 0)), Ye;
      }
      function D(fe, Ye, mt) {
        for (var P = mt; P > 0; ) {
          var ue = P - 1 >>> 1, ke = fe[ue];
          if (A(ke, Ye) > 0)
            fe[ue] = Ye, fe[P] = ke, P = ue;
          else
            return;
        }
      }
      function _(fe, Ye, mt) {
        for (var P = mt, ue = fe.length, ke = ue >>> 1; P < ke; ) {
          var qe = (P + 1) * 2 - 1, tt = fe[qe], pt = qe + 1, tn = fe[pt];
          if (A(tt, Ye) < 0)
            pt < ue && A(tn, tt) < 0 ? (fe[P] = tn, fe[pt] = Ye, P = pt) : (fe[P] = tt, fe[qe] = Ye, P = qe);
          else if (pt < ue && A(tn, Ye) < 0)
            fe[P] = tn, fe[pt] = Ye, P = pt;
          else
            return;
        }
      }
      function A(fe, Ye) {
        var mt = fe.sortIndex - Ye.sortIndex;
        return mt !== 0 ? mt : fe.id - Ye.id;
      }
      var U = 1, W = 2, X = 3, Q = 4, oe = 5;
      function we(fe, Ye) {
      }
      var ce = typeof performance == "object" && typeof performance.now == "function";
      if (ce) {
        var Me = performance;
        i.unstable_now = function() {
          return Me.now();
        };
      } else {
        var ve = Date, Se = ve.now();
        i.unstable_now = function() {
          return ve.now() - Se;
        };
      }
      var O = 1073741823, be = -1, le = 250, ye = 5e3, ht = 1e4, yt = O, Je = [], Ke = [], ft = 1, Ee = null, Ge = X, xt = !1, it = !1, _t = !1, J = typeof setTimeout == "function" ? setTimeout : null, De = typeof clearTimeout == "function" ? clearTimeout : null, se = typeof setImmediate < "u" ? setImmediate : null;
      typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
      function ot(fe) {
        for (var Ye = w(Ke); Ye !== null; ) {
          if (Ye.callback === null)
            S(Ke);
          else if (Ye.startTime <= fe)
            S(Ke), Ye.sortIndex = Ye.expirationTime, y(Je, Ye);
          else
            return;
          Ye = w(Ke);
        }
      }
      function ut(fe) {
        if (_t = !1, ot(fe), !it)
          if (w(Je) !== null)
            it = !0, Tr(Kt);
          else {
            var Ye = w(Ke);
            Ye !== null && an(ut, Ye.startTime - fe);
          }
      }
      function Kt(fe, Ye) {
        it = !1, _t && (_t = !1, nr()), xt = !0;
        var mt = Ge;
        try {
          var P;
          if (!c) return Zt(fe, Ye);
        } finally {
          Ee = null, Ge = mt, xt = !1;
        }
      }
      function Zt(fe, Ye) {
        var mt = Ye;
        for (ot(mt), Ee = w(Je); Ee !== null && !u && !(Ee.expirationTime > mt && (!fe || zn())); ) {
          var P = Ee.callback;
          if (typeof P == "function") {
            Ee.callback = null, Ge = Ee.priorityLevel;
            var ue = Ee.expirationTime <= mt, ke = P(ue);
            mt = i.unstable_now(), typeof ke == "function" ? Ee.callback = ke : Ee === w(Je) && S(Je), ot(mt);
          } else
            S(Je);
          Ee = w(Je);
        }
        if (Ee !== null)
          return !0;
        var qe = w(Ke);
        return qe !== null && an(ut, qe.startTime - mt), !1;
      }
      function fn(fe, Ye) {
        switch (fe) {
          case U:
          case W:
          case X:
          case Q:
          case oe:
            break;
          default:
            fe = X;
        }
        var mt = Ge;
        Ge = fe;
        try {
          return Ye();
        } finally {
          Ge = mt;
        }
      }
      function zt(fe) {
        var Ye;
        switch (Ge) {
          case U:
          case W:
          case X:
            Ye = X;
            break;
          default:
            Ye = Ge;
            break;
        }
        var mt = Ge;
        Ge = Ye;
        try {
          return fe();
        } finally {
          Ge = mt;
        }
      }
      function On(fe) {
        var Ye = Ge;
        return function() {
          var mt = Ge;
          Ge = Ye;
          try {
            return fe.apply(this, arguments);
          } finally {
            Ge = mt;
          }
        };
      }
      function $t(fe, Ye, mt) {
        var P = i.unstable_now(), ue;
        if (typeof mt == "object" && mt !== null) {
          var ke = mt.delay;
          typeof ke == "number" && ke > 0 ? ue = P + ke : ue = P;
        } else
          ue = P;
        var qe;
        switch (fe) {
          case U:
            qe = be;
            break;
          case W:
            qe = le;
            break;
          case oe:
            qe = yt;
            break;
          case Q:
            qe = ht;
            break;
          case X:
          default:
            qe = ye;
            break;
        }
        var tt = ue + qe, pt = {
          id: ft++,
          callback: Ye,
          priorityLevel: fe,
          startTime: ue,
          expirationTime: tt,
          sortIndex: -1
        };
        return ue > P ? (pt.sortIndex = ue, y(Ke, pt), w(Je) === null && pt === w(Ke) && (_t ? nr() : _t = !0, an(ut, ue - P))) : (pt.sortIndex = tt, y(Je, pt), !it && !xt && (it = !0, Tr(Kt))), pt;
      }
      function mn() {
      }
      function xn() {
        !it && !xt && (it = !0, Tr(Kt));
      }
      function yn() {
        return w(Je);
      }
      function Vn(fe) {
        fe.callback = null;
      }
      function Ie() {
        return Ge;
      }
      var vt = !1, Gt = null, Jt = -1, dn = p, Bn = -1;
      function zn() {
        var fe = i.unstable_now() - Bn;
        return !(fe < dn);
      }
      function In() {
      }
      function Wn(fe) {
        if (fe < 0 || fe > 125) {
          console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported");
          return;
        }
        fe > 0 ? dn = Math.floor(1e3 / fe) : dn = p;
      }
      var fr = function() {
        if (Gt !== null) {
          var fe = i.unstable_now();
          Bn = fe;
          var Ye = !0, mt = !0;
          try {
            mt = Gt(Ye, fe);
          } finally {
            mt ? Mn() : (vt = !1, Gt = null);
          }
        } else
          vt = !1;
      }, Mn;
      if (typeof se == "function")
        Mn = function() {
          se(fr);
        };
      else if (typeof MessageChannel < "u") {
        var xr = new MessageChannel(), tr = xr.port2;
        xr.port1.onmessage = fr, Mn = function() {
          tr.postMessage(null);
        };
      } else
        Mn = function() {
          J(fr, 0);
        };
      function Tr(fe) {
        Gt = fe, vt || (vt = !0, Mn());
      }
      function an(fe, Ye) {
        Jt = J(function() {
          fe(i.unstable_now());
        }, Ye);
      }
      function nr() {
        De(Jt), Jt = -1;
      }
      var mi = In, sa = null;
      i.unstable_IdlePriority = oe, i.unstable_ImmediatePriority = U, i.unstable_LowPriority = Q, i.unstable_NormalPriority = X, i.unstable_Profiling = sa, i.unstable_UserBlockingPriority = W, i.unstable_cancelCallback = Vn, i.unstable_continueExecution = xn, i.unstable_forceFrameRate = Wn, i.unstable_getCurrentPriorityLevel = Ie, i.unstable_getFirstCallbackNode = yn, i.unstable_next = zt, i.unstable_pauseExecution = mn, i.unstable_requestPaint = mi, i.unstable_runWithPriority = fn, i.unstable_scheduleCallback = $t, i.unstable_shouldYield = zn, i.unstable_wrapCallback = On, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
    }();
  }(PE)), PE;
}
var $T;
function dR() {
  return $T || ($T = 1, process.env.NODE_ENV === "production" ? Og.exports = dF() : Og.exports = pF()), Og.exports;
}
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var GT;
function hF() {
  if (GT) return Ga;
  GT = 1;
  var i = Wg, u = dR();
  function c(n) {
    for (var r = "https://reactjs.org/docs/error-decoder.html?invariant=" + n, o = 1; o < arguments.length; o++) r += "&args[]=" + encodeURIComponent(arguments[o]);
    return "Minified React error #" + n + "; visit " + r + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var p = /* @__PURE__ */ new Set(), y = {};
  function w(n, r) {
    S(n, r), S(n + "Capture", r);
  }
  function S(n, r) {
    for (y[n] = r, n = 0; n < r.length; n++) p.add(r[n]);
  }
  var D = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), _ = Object.prototype.hasOwnProperty, A = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, U = {}, W = {};
  function X(n) {
    return _.call(W, n) ? !0 : _.call(U, n) ? !1 : A.test(n) ? W[n] = !0 : (U[n] = !0, !1);
  }
  function Q(n, r, o, f) {
    if (o !== null && o.type === 0) return !1;
    switch (typeof r) {
      case "function":
      case "symbol":
        return !0;
      case "boolean":
        return f ? !1 : o !== null ? !o.acceptsBooleans : (n = n.toLowerCase().slice(0, 5), n !== "data-" && n !== "aria-");
      default:
        return !1;
    }
  }
  function oe(n, r, o, f) {
    if (r === null || typeof r > "u" || Q(n, r, o, f)) return !0;
    if (f) return !1;
    if (o !== null) switch (o.type) {
      case 3:
        return !r;
      case 4:
        return r === !1;
      case 5:
        return isNaN(r);
      case 6:
        return isNaN(r) || 1 > r;
    }
    return !1;
  }
  function we(n, r, o, f, h, m, C) {
    this.acceptsBooleans = r === 2 || r === 3 || r === 4, this.attributeName = f, this.attributeNamespace = h, this.mustUseProperty = o, this.propertyName = n, this.type = r, this.sanitizeURL = m, this.removeEmptyString = C;
  }
  var ce = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(n) {
    ce[n] = new we(n, 0, !1, n, null, !1, !1);
  }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(n) {
    var r = n[0];
    ce[r] = new we(r, 1, !1, n[1], null, !1, !1);
  }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(n) {
    ce[n] = new we(n, 2, !1, n.toLowerCase(), null, !1, !1);
  }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(n) {
    ce[n] = new we(n, 2, !1, n, null, !1, !1);
  }), "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(n) {
    ce[n] = new we(n, 3, !1, n.toLowerCase(), null, !1, !1);
  }), ["checked", "multiple", "muted", "selected"].forEach(function(n) {
    ce[n] = new we(n, 3, !0, n, null, !1, !1);
  }), ["capture", "download"].forEach(function(n) {
    ce[n] = new we(n, 4, !1, n, null, !1, !1);
  }), ["cols", "rows", "size", "span"].forEach(function(n) {
    ce[n] = new we(n, 6, !1, n, null, !1, !1);
  }), ["rowSpan", "start"].forEach(function(n) {
    ce[n] = new we(n, 5, !1, n.toLowerCase(), null, !1, !1);
  });
  var Me = /[\-:]([a-z])/g;
  function ve(n) {
    return n[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(n) {
    var r = n.replace(
      Me,
      ve
    );
    ce[r] = new we(r, 1, !1, n, null, !1, !1);
  }), "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(n) {
    var r = n.replace(Me, ve);
    ce[r] = new we(r, 1, !1, n, "http://www.w3.org/1999/xlink", !1, !1);
  }), ["xml:base", "xml:lang", "xml:space"].forEach(function(n) {
    var r = n.replace(Me, ve);
    ce[r] = new we(r, 1, !1, n, "http://www.w3.org/XML/1998/namespace", !1, !1);
  }), ["tabIndex", "crossOrigin"].forEach(function(n) {
    ce[n] = new we(n, 1, !1, n.toLowerCase(), null, !1, !1);
  }), ce.xlinkHref = new we("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1), ["src", "href", "action", "formAction"].forEach(function(n) {
    ce[n] = new we(n, 1, !1, n.toLowerCase(), null, !0, !0);
  });
  function Se(n, r, o, f) {
    var h = ce.hasOwnProperty(r) ? ce[r] : null;
    (h !== null ? h.type !== 0 : f || !(2 < r.length) || r[0] !== "o" && r[0] !== "O" || r[1] !== "n" && r[1] !== "N") && (oe(r, o, h, f) && (o = null), f || h === null ? X(r) && (o === null ? n.removeAttribute(r) : n.setAttribute(r, "" + o)) : h.mustUseProperty ? n[h.propertyName] = o === null ? h.type === 3 ? !1 : "" : o : (r = h.attributeName, f = h.attributeNamespace, o === null ? n.removeAttribute(r) : (h = h.type, o = h === 3 || h === 4 && o === !0 ? "" : "" + o, f ? n.setAttributeNS(f, r, o) : n.setAttribute(r, o))));
  }
  var O = i.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, be = Symbol.for("react.element"), le = Symbol.for("react.portal"), ye = Symbol.for("react.fragment"), ht = Symbol.for("react.strict_mode"), yt = Symbol.for("react.profiler"), Je = Symbol.for("react.provider"), Ke = Symbol.for("react.context"), ft = Symbol.for("react.forward_ref"), Ee = Symbol.for("react.suspense"), Ge = Symbol.for("react.suspense_list"), xt = Symbol.for("react.memo"), it = Symbol.for("react.lazy"), _t = Symbol.for("react.offscreen"), J = Symbol.iterator;
  function De(n) {
    return n === null || typeof n != "object" ? null : (n = J && n[J] || n["@@iterator"], typeof n == "function" ? n : null);
  }
  var se = Object.assign, ot;
  function ut(n) {
    if (ot === void 0) try {
      throw Error();
    } catch (o) {
      var r = o.stack.trim().match(/\n( *(at )?)/);
      ot = r && r[1] || "";
    }
    return `
` + ot + n;
  }
  var Kt = !1;
  function Zt(n, r) {
    if (!n || Kt) return "";
    Kt = !0;
    var o = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      if (r) if (r = function() {
        throw Error();
      }, Object.defineProperty(r.prototype, "props", { set: function() {
        throw Error();
      } }), typeof Reflect == "object" && Reflect.construct) {
        try {
          Reflect.construct(r, []);
        } catch (B) {
          var f = B;
        }
        Reflect.construct(n, [], r);
      } else {
        try {
          r.call();
        } catch (B) {
          f = B;
        }
        n.call(r.prototype);
      }
      else {
        try {
          throw Error();
        } catch (B) {
          f = B;
        }
        n();
      }
    } catch (B) {
      if (B && f && typeof B.stack == "string") {
        for (var h = B.stack.split(`
`), m = f.stack.split(`
`), C = h.length - 1, T = m.length - 1; 1 <= C && 0 <= T && h[C] !== m[T]; ) T--;
        for (; 1 <= C && 0 <= T; C--, T--) if (h[C] !== m[T]) {
          if (C !== 1 || T !== 1)
            do
              if (C--, T--, 0 > T || h[C] !== m[T]) {
                var k = `
` + h[C].replace(" at new ", " at ");
                return n.displayName && k.includes("<anonymous>") && (k = k.replace("<anonymous>", n.displayName)), k;
              }
            while (1 <= C && 0 <= T);
          break;
        }
      }
    } finally {
      Kt = !1, Error.prepareStackTrace = o;
    }
    return (n = n ? n.displayName || n.name : "") ? ut(n) : "";
  }
  function fn(n) {
    switch (n.tag) {
      case 5:
        return ut(n.type);
      case 16:
        return ut("Lazy");
      case 13:
        return ut("Suspense");
      case 19:
        return ut("SuspenseList");
      case 0:
      case 2:
      case 15:
        return n = Zt(n.type, !1), n;
      case 11:
        return n = Zt(n.type.render, !1), n;
      case 1:
        return n = Zt(n.type, !0), n;
      default:
        return "";
    }
  }
  function zt(n) {
    if (n == null) return null;
    if (typeof n == "function") return n.displayName || n.name || null;
    if (typeof n == "string") return n;
    switch (n) {
      case ye:
        return "Fragment";
      case le:
        return "Portal";
      case yt:
        return "Profiler";
      case ht:
        return "StrictMode";
      case Ee:
        return "Suspense";
      case Ge:
        return "SuspenseList";
    }
    if (typeof n == "object") switch (n.$$typeof) {
      case Ke:
        return (n.displayName || "Context") + ".Consumer";
      case Je:
        return (n._context.displayName || "Context") + ".Provider";
      case ft:
        var r = n.render;
        return n = n.displayName, n || (n = r.displayName || r.name || "", n = n !== "" ? "ForwardRef(" + n + ")" : "ForwardRef"), n;
      case xt:
        return r = n.displayName || null, r !== null ? r : zt(n.type) || "Memo";
      case it:
        r = n._payload, n = n._init;
        try {
          return zt(n(r));
        } catch {
        }
    }
    return null;
  }
  function On(n) {
    var r = n.type;
    switch (n.tag) {
      case 24:
        return "Cache";
      case 9:
        return (r.displayName || "Context") + ".Consumer";
      case 10:
        return (r._context.displayName || "Context") + ".Provider";
      case 18:
        return "DehydratedFragment";
      case 11:
        return n = r.render, n = n.displayName || n.name || "", r.displayName || (n !== "" ? "ForwardRef(" + n + ")" : "ForwardRef");
      case 7:
        return "Fragment";
      case 5:
        return r;
      case 4:
        return "Portal";
      case 3:
        return "Root";
      case 6:
        return "Text";
      case 16:
        return zt(r);
      case 8:
        return r === ht ? "StrictMode" : "Mode";
      case 22:
        return "Offscreen";
      case 12:
        return "Profiler";
      case 21:
        return "Scope";
      case 13:
        return "Suspense";
      case 19:
        return "SuspenseList";
      case 25:
        return "TracingMarker";
      case 1:
      case 0:
      case 17:
      case 2:
      case 14:
      case 15:
        if (typeof r == "function") return r.displayName || r.name || null;
        if (typeof r == "string") return r;
    }
    return null;
  }
  function $t(n) {
    switch (typeof n) {
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return n;
      case "object":
        return n;
      default:
        return "";
    }
  }
  function mn(n) {
    var r = n.type;
    return (n = n.nodeName) && n.toLowerCase() === "input" && (r === "checkbox" || r === "radio");
  }
  function xn(n) {
    var r = mn(n) ? "checked" : "value", o = Object.getOwnPropertyDescriptor(n.constructor.prototype, r), f = "" + n[r];
    if (!n.hasOwnProperty(r) && typeof o < "u" && typeof o.get == "function" && typeof o.set == "function") {
      var h = o.get, m = o.set;
      return Object.defineProperty(n, r, { configurable: !0, get: function() {
        return h.call(this);
      }, set: function(C) {
        f = "" + C, m.call(this, C);
      } }), Object.defineProperty(n, r, { enumerable: o.enumerable }), { getValue: function() {
        return f;
      }, setValue: function(C) {
        f = "" + C;
      }, stopTracking: function() {
        n._valueTracker = null, delete n[r];
      } };
    }
  }
  function yn(n) {
    n._valueTracker || (n._valueTracker = xn(n));
  }
  function Vn(n) {
    if (!n) return !1;
    var r = n._valueTracker;
    if (!r) return !0;
    var o = r.getValue(), f = "";
    return n && (f = mn(n) ? n.checked ? "true" : "false" : n.value), n = f, n !== o ? (r.setValue(n), !0) : !1;
  }
  function Ie(n) {
    if (n = n || (typeof document < "u" ? document : void 0), typeof n > "u") return null;
    try {
      return n.activeElement || n.body;
    } catch {
      return n.body;
    }
  }
  function vt(n, r) {
    var o = r.checked;
    return se({}, r, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: o ?? n._wrapperState.initialChecked });
  }
  function Gt(n, r) {
    var o = r.defaultValue == null ? "" : r.defaultValue, f = r.checked != null ? r.checked : r.defaultChecked;
    o = $t(r.value != null ? r.value : o), n._wrapperState = { initialChecked: f, initialValue: o, controlled: r.type === "checkbox" || r.type === "radio" ? r.checked != null : r.value != null };
  }
  function Jt(n, r) {
    r = r.checked, r != null && Se(n, "checked", r, !1);
  }
  function dn(n, r) {
    Jt(n, r);
    var o = $t(r.value), f = r.type;
    if (o != null) f === "number" ? (o === 0 && n.value === "" || n.value != o) && (n.value = "" + o) : n.value !== "" + o && (n.value = "" + o);
    else if (f === "submit" || f === "reset") {
      n.removeAttribute("value");
      return;
    }
    r.hasOwnProperty("value") ? zn(n, r.type, o) : r.hasOwnProperty("defaultValue") && zn(n, r.type, $t(r.defaultValue)), r.checked == null && r.defaultChecked != null && (n.defaultChecked = !!r.defaultChecked);
  }
  function Bn(n, r, o) {
    if (r.hasOwnProperty("value") || r.hasOwnProperty("defaultValue")) {
      var f = r.type;
      if (!(f !== "submit" && f !== "reset" || r.value !== void 0 && r.value !== null)) return;
      r = "" + n._wrapperState.initialValue, o || r === n.value || (n.value = r), n.defaultValue = r;
    }
    o = n.name, o !== "" && (n.name = ""), n.defaultChecked = !!n._wrapperState.initialChecked, o !== "" && (n.name = o);
  }
  function zn(n, r, o) {
    (r !== "number" || Ie(n.ownerDocument) !== n) && (o == null ? n.defaultValue = "" + n._wrapperState.initialValue : n.defaultValue !== "" + o && (n.defaultValue = "" + o));
  }
  var In = Array.isArray;
  function Wn(n, r, o, f) {
    if (n = n.options, r) {
      r = {};
      for (var h = 0; h < o.length; h++) r["$" + o[h]] = !0;
      for (o = 0; o < n.length; o++) h = r.hasOwnProperty("$" + n[o].value), n[o].selected !== h && (n[o].selected = h), h && f && (n[o].defaultSelected = !0);
    } else {
      for (o = "" + $t(o), r = null, h = 0; h < n.length; h++) {
        if (n[h].value === o) {
          n[h].selected = !0, f && (n[h].defaultSelected = !0);
          return;
        }
        r !== null || n[h].disabled || (r = n[h]);
      }
      r !== null && (r.selected = !0);
    }
  }
  function fr(n, r) {
    if (r.dangerouslySetInnerHTML != null) throw Error(c(91));
    return se({}, r, { value: void 0, defaultValue: void 0, children: "" + n._wrapperState.initialValue });
  }
  function Mn(n, r) {
    var o = r.value;
    if (o == null) {
      if (o = r.children, r = r.defaultValue, o != null) {
        if (r != null) throw Error(c(92));
        if (In(o)) {
          if (1 < o.length) throw Error(c(93));
          o = o[0];
        }
        r = o;
      }
      r == null && (r = ""), o = r;
    }
    n._wrapperState = { initialValue: $t(o) };
  }
  function xr(n, r) {
    var o = $t(r.value), f = $t(r.defaultValue);
    o != null && (o = "" + o, o !== n.value && (n.value = o), r.defaultValue == null && n.defaultValue !== o && (n.defaultValue = o)), f != null && (n.defaultValue = "" + f);
  }
  function tr(n) {
    var r = n.textContent;
    r === n._wrapperState.initialValue && r !== "" && r !== null && (n.value = r);
  }
  function Tr(n) {
    switch (n) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function an(n, r) {
    return n == null || n === "http://www.w3.org/1999/xhtml" ? Tr(r) : n === "http://www.w3.org/2000/svg" && r === "foreignObject" ? "http://www.w3.org/1999/xhtml" : n;
  }
  var nr, mi = function(n) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(r, o, f, h) {
      MSApp.execUnsafeLocalFunction(function() {
        return n(r, o, f, h);
      });
    } : n;
  }(function(n, r) {
    if (n.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in n) n.innerHTML = r;
    else {
      for (nr = nr || document.createElement("div"), nr.innerHTML = "<svg>" + r.valueOf().toString() + "</svg>", r = nr.firstChild; n.firstChild; ) n.removeChild(n.firstChild);
      for (; r.firstChild; ) n.appendChild(r.firstChild);
    }
  });
  function sa(n, r) {
    if (r) {
      var o = n.firstChild;
      if (o && o === n.lastChild && o.nodeType === 3) {
        o.nodeValue = r;
        return;
      }
    }
    n.textContent = r;
  }
  var fe = {
    animationIterationCount: !0,
    aspectRatio: !0,
    borderImageOutset: !0,
    borderImageSlice: !0,
    borderImageWidth: !0,
    boxFlex: !0,
    boxFlexGroup: !0,
    boxOrdinalGroup: !0,
    columnCount: !0,
    columns: !0,
    flex: !0,
    flexGrow: !0,
    flexPositive: !0,
    flexShrink: !0,
    flexNegative: !0,
    flexOrder: !0,
    gridArea: !0,
    gridRow: !0,
    gridRowEnd: !0,
    gridRowSpan: !0,
    gridRowStart: !0,
    gridColumn: !0,
    gridColumnEnd: !0,
    gridColumnSpan: !0,
    gridColumnStart: !0,
    fontWeight: !0,
    lineClamp: !0,
    lineHeight: !0,
    opacity: !0,
    order: !0,
    orphans: !0,
    tabSize: !0,
    widows: !0,
    zIndex: !0,
    zoom: !0,
    fillOpacity: !0,
    floodOpacity: !0,
    stopOpacity: !0,
    strokeDasharray: !0,
    strokeDashoffset: !0,
    strokeMiterlimit: !0,
    strokeOpacity: !0,
    strokeWidth: !0
  }, Ye = ["Webkit", "ms", "Moz", "O"];
  Object.keys(fe).forEach(function(n) {
    Ye.forEach(function(r) {
      r = r + n.charAt(0).toUpperCase() + n.substring(1), fe[r] = fe[n];
    });
  });
  function mt(n, r, o) {
    return r == null || typeof r == "boolean" || r === "" ? "" : o || typeof r != "number" || r === 0 || fe.hasOwnProperty(n) && fe[n] ? ("" + r).trim() : r + "px";
  }
  function P(n, r) {
    n = n.style;
    for (var o in r) if (r.hasOwnProperty(o)) {
      var f = o.indexOf("--") === 0, h = mt(o, r[o], f);
      o === "float" && (o = "cssFloat"), f ? n.setProperty(o, h) : n[o] = h;
    }
  }
  var ue = se({ menuitem: !0 }, { area: !0, base: !0, br: !0, col: !0, embed: !0, hr: !0, img: !0, input: !0, keygen: !0, link: !0, meta: !0, param: !0, source: !0, track: !0, wbr: !0 });
  function ke(n, r) {
    if (r) {
      if (ue[n] && (r.children != null || r.dangerouslySetInnerHTML != null)) throw Error(c(137, n));
      if (r.dangerouslySetInnerHTML != null) {
        if (r.children != null) throw Error(c(60));
        if (typeof r.dangerouslySetInnerHTML != "object" || !("__html" in r.dangerouslySetInnerHTML)) throw Error(c(61));
      }
      if (r.style != null && typeof r.style != "object") throw Error(c(62));
    }
  }
  function qe(n, r) {
    if (n.indexOf("-") === -1) return typeof r.is == "string";
    switch (n) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return !1;
      default:
        return !0;
    }
  }
  var tt = null;
  function pt(n) {
    return n = n.target || n.srcElement || window, n.correspondingUseElement && (n = n.correspondingUseElement), n.nodeType === 3 ? n.parentNode : n;
  }
  var tn = null, kt = null, Bt = null;
  function Ir(n) {
    if (n = Ns(n)) {
      if (typeof tn != "function") throw Error(c(280));
      var r = n.stateNode;
      r && (r = Be(r), tn(n.stateNode, n.type, r));
    }
  }
  function Za(n) {
    kt ? Bt ? Bt.push(n) : Bt = [n] : kt = n;
  }
  function Ja() {
    if (kt) {
      var n = kt, r = Bt;
      if (Bt = kt = null, Ir(n), r) for (n = 0; n < r.length; n++) Ir(r[n]);
    }
  }
  function xa(n, r) {
    return n(r);
  }
  function Jo() {
  }
  var ei = !1;
  function ti(n, r, o) {
    if (ei) return n(r, o);
    ei = !0;
    try {
      return xa(n, r, o);
    } finally {
      ei = !1, (kt !== null || Bt !== null) && (Jo(), Ja());
    }
  }
  function Jl(n, r) {
    var o = n.stateNode;
    if (o === null) return null;
    var f = Be(o);
    if (f === null) return null;
    o = f[r];
    e: switch (r) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (f = !f.disabled) || (n = n.type, f = !(n === "button" || n === "input" || n === "select" || n === "textarea")), n = !f;
        break e;
      default:
        n = !1;
    }
    if (n) return null;
    if (o && typeof o != "function") throw Error(c(231, r, typeof o));
    return o;
  }
  var eu = !1;
  if (D) try {
    var yi = {};
    Object.defineProperty(yi, "passive", { get: function() {
      eu = !0;
    } }), window.addEventListener("test", yi, yi), window.removeEventListener("test", yi, yi);
  } catch {
    eu = !1;
  }
  function Hi(n, r, o, f, h, m, C, T, k) {
    var B = Array.prototype.slice.call(arguments, 3);
    try {
      r.apply(o, B);
    } catch (ee) {
      this.onError(ee);
    }
  }
  var ca = !1, ni = null, ml = !1, eo = null, R = { onError: function(n) {
    ca = !0, ni = n;
  } };
  function te(n, r, o, f, h, m, C, T, k) {
    ca = !1, ni = null, Hi.apply(R, arguments);
  }
  function de(n, r, o, f, h, m, C, T, k) {
    if (te.apply(this, arguments), ca) {
      if (ca) {
        var B = ni;
        ca = !1, ni = null;
      } else throw Error(c(198));
      ml || (ml = !0, eo = B);
    }
  }
  function Pe(n) {
    var r = n, o = n;
    if (n.alternate) for (; r.return; ) r = r.return;
    else {
      n = r;
      do
        r = n, r.flags & 4098 && (o = r.return), n = r.return;
      while (n);
    }
    return r.tag === 3 ? o : null;
  }
  function Tt(n) {
    if (n.tag === 13) {
      var r = n.memoizedState;
      if (r === null && (n = n.alternate, n !== null && (r = n.memoizedState)), r !== null) return r.dehydrated;
    }
    return null;
  }
  function Ot(n) {
    if (Pe(n) !== n) throw Error(c(188));
  }
  function Ze(n) {
    var r = n.alternate;
    if (!r) {
      if (r = Pe(n), r === null) throw Error(c(188));
      return r !== n ? null : n;
    }
    for (var o = n, f = r; ; ) {
      var h = o.return;
      if (h === null) break;
      var m = h.alternate;
      if (m === null) {
        if (f = h.return, f !== null) {
          o = f;
          continue;
        }
        break;
      }
      if (h.child === m.child) {
        for (m = h.child; m; ) {
          if (m === o) return Ot(h), n;
          if (m === f) return Ot(h), r;
          m = m.sibling;
        }
        throw Error(c(188));
      }
      if (o.return !== f.return) o = h, f = m;
      else {
        for (var C = !1, T = h.child; T; ) {
          if (T === o) {
            C = !0, o = h, f = m;
            break;
          }
          if (T === f) {
            C = !0, f = h, o = m;
            break;
          }
          T = T.sibling;
        }
        if (!C) {
          for (T = m.child; T; ) {
            if (T === o) {
              C = !0, o = m, f = h;
              break;
            }
            if (T === f) {
              C = !0, f = m, o = h;
              break;
            }
            T = T.sibling;
          }
          if (!C) throw Error(c(189));
        }
      }
      if (o.alternate !== f) throw Error(c(190));
    }
    if (o.tag !== 3) throw Error(c(188));
    return o.stateNode.current === o ? n : r;
  }
  function gt(n) {
    return n = Ze(n), n !== null ? rr(n) : null;
  }
  function rr(n) {
    if (n.tag === 5 || n.tag === 6) return n;
    for (n = n.child; n !== null; ) {
      var r = rr(n);
      if (r !== null) return r;
      n = n.sibling;
    }
    return null;
  }
  var ln = u.unstable_scheduleCallback, gn = u.unstable_cancelCallback, Wr = u.unstable_shouldYield, yl = u.unstable_requestPaint, Ft = u.unstable_now, _r = u.unstable_getCurrentPriorityLevel, fa = u.unstable_ImmediatePriority, St = u.unstable_UserBlockingPriority, gi = u.unstable_NormalPriority, bv = u.unstable_LowPriority, Vd = u.unstable_IdlePriority, fs = null, ri = null;
  function xv(n) {
    if (ri && typeof ri.onCommitFiberRoot == "function") try {
      ri.onCommitFiberRoot(fs, n, void 0, (n.current.flags & 128) === 128);
    } catch {
    }
  }
  var Ta = Math.clz32 ? Math.clz32 : a0, Tv = Math.log, _v = Math.LN2;
  function a0(n) {
    return n >>>= 0, n === 0 ? 32 : 31 - (Tv(n) / _v | 0) | 0;
  }
  var Dc = 64, tu = 4194304;
  function to(n) {
    switch (n & -n) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return n & 4194240;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return n & 130023424;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 1073741824;
      default:
        return n;
    }
  }
  function ai(n, r) {
    var o = n.pendingLanes;
    if (o === 0) return 0;
    var f = 0, h = n.suspendedLanes, m = n.pingedLanes, C = o & 268435455;
    if (C !== 0) {
      var T = C & ~h;
      T !== 0 ? f = to(T) : (m &= C, m !== 0 && (f = to(m)));
    } else C = o & ~h, C !== 0 ? f = to(C) : m !== 0 && (f = to(m));
    if (f === 0) return 0;
    if (r !== 0 && r !== f && !(r & h) && (h = f & -f, m = r & -r, h >= m || h === 16 && (m & 4194240) !== 0)) return r;
    if (f & 4 && (f |= o & 16), r = n.entangledLanes, r !== 0) for (n = n.entanglements, r &= f; 0 < r; ) o = 31 - Ta(r), h = 1 << o, f |= n[o], r &= ~h;
    return f;
  }
  function Bd(n, r) {
    switch (n) {
      case 1:
      case 2:
      case 4:
        return r + 250;
      case 8:
      case 16:
      case 32:
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return r + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return -1;
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function kc(n, r) {
    for (var o = n.suspendedLanes, f = n.pingedLanes, h = n.expirationTimes, m = n.pendingLanes; 0 < m; ) {
      var C = 31 - Ta(m), T = 1 << C, k = h[C];
      k === -1 ? (!(T & o) || T & f) && (h[C] = Bd(T, r)) : k <= r && (n.expiredLanes |= T), m &= ~T;
    }
  }
  function Id(n) {
    return n = n.pendingLanes & -1073741825, n !== 0 ? n : n & 1073741824 ? 1073741824 : 0;
  }
  function Oc() {
    var n = Dc;
    return Dc <<= 1, !(Dc & 4194240) && (Dc = 64), n;
  }
  function Wd(n) {
    for (var r = [], o = 0; 31 > o; o++) r.push(n);
    return r;
  }
  function no(n, r, o) {
    n.pendingLanes |= r, r !== 536870912 && (n.suspendedLanes = 0, n.pingedLanes = 0), n = n.eventTimes, r = 31 - Ta(r), n[r] = o;
  }
  function i0(n, r) {
    var o = n.pendingLanes & ~r;
    n.pendingLanes = r, n.suspendedLanes = 0, n.pingedLanes = 0, n.expiredLanes &= r, n.mutableReadLanes &= r, n.entangledLanes &= r, r = n.entanglements;
    var f = n.eventTimes;
    for (n = n.expirationTimes; 0 < o; ) {
      var h = 31 - Ta(o), m = 1 << h;
      r[h] = 0, f[h] = -1, n[h] = -1, o &= ~m;
    }
  }
  function ds(n, r) {
    var o = n.entangledLanes |= r;
    for (n = n.entanglements; o; ) {
      var f = 31 - Ta(o), h = 1 << f;
      h & r | n[f] & r && (n[f] |= r), o &= ~h;
    }
  }
  var It = 0;
  function $d(n) {
    return n &= -n, 1 < n ? 4 < n ? n & 268435455 ? 16 : 536870912 : 4 : 1;
  }
  var Rv, Mc, Wt, Dv, Gd, st = !1, ps = [], jn = null, _a = null, Ra = null, hs = /* @__PURE__ */ new Map(), $n = /* @__PURE__ */ new Map(), Qt = [], l0 = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function ii(n, r) {
    switch (n) {
      case "focusin":
      case "focusout":
        jn = null;
        break;
      case "dragenter":
      case "dragleave":
        _a = null;
        break;
      case "mouseover":
      case "mouseout":
        Ra = null;
        break;
      case "pointerover":
      case "pointerout":
        hs.delete(r.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        $n.delete(r.pointerId);
    }
  }
  function Rr(n, r, o, f, h, m) {
    return n === null || n.nativeEvent !== m ? (n = { blockedOn: r, domEventName: o, eventSystemFlags: f, nativeEvent: m, targetContainers: [h] }, r !== null && (r = Ns(r), r !== null && Mc(r)), n) : (n.eventSystemFlags |= f, r = n.targetContainers, h !== null && r.indexOf(h) === -1 && r.push(h), n);
  }
  function gl(n, r, o, f, h) {
    switch (r) {
      case "focusin":
        return jn = Rr(jn, n, r, o, f, h), !0;
      case "dragenter":
        return _a = Rr(_a, n, r, o, f, h), !0;
      case "mouseover":
        return Ra = Rr(Ra, n, r, o, f, h), !0;
      case "pointerover":
        var m = h.pointerId;
        return hs.set(m, Rr(hs.get(m) || null, n, r, o, f, h)), !0;
      case "gotpointercapture":
        return m = h.pointerId, $n.set(m, Rr($n.get(m) || null, n, r, o, f, h)), !0;
    }
    return !1;
  }
  function kv(n) {
    var r = ka(n.target);
    if (r !== null) {
      var o = Pe(r);
      if (o !== null) {
        if (r = o.tag, r === 13) {
          if (r = Tt(o), r !== null) {
            n.blockedOn = r, Gd(n.priority, function() {
              Wt(o);
            });
            return;
          }
        } else if (r === 3 && o.stateNode.current.memoizedState.isDehydrated) {
          n.blockedOn = o.tag === 3 ? o.stateNode.containerInfo : null;
          return;
        }
      }
    }
    n.blockedOn = null;
  }
  function nu(n) {
    if (n.blockedOn !== null) return !1;
    for (var r = n.targetContainers; 0 < r.length; ) {
      var o = Ac(n.domEventName, n.eventSystemFlags, r[0], n.nativeEvent);
      if (o === null) {
        o = n.nativeEvent;
        var f = new o.constructor(o.type, o);
        tt = f, o.target.dispatchEvent(f), tt = null;
      } else return r = Ns(o), r !== null && Mc(r), n.blockedOn = o, !1;
      r.shift();
    }
    return !0;
  }
  function Qd(n, r, o) {
    nu(n) && o.delete(r);
  }
  function Ov() {
    st = !1, jn !== null && nu(jn) && (jn = null), _a !== null && nu(_a) && (_a = null), Ra !== null && nu(Ra) && (Ra = null), hs.forEach(Qd), $n.forEach(Qd);
  }
  function vs(n, r) {
    n.blockedOn === r && (n.blockedOn = null, st || (st = !0, u.unstable_scheduleCallback(u.unstable_NormalPriority, Ov)));
  }
  function ms(n) {
    function r(h) {
      return vs(h, n);
    }
    if (0 < ps.length) {
      vs(ps[0], n);
      for (var o = 1; o < ps.length; o++) {
        var f = ps[o];
        f.blockedOn === n && (f.blockedOn = null);
      }
    }
    for (jn !== null && vs(jn, n), _a !== null && vs(_a, n), Ra !== null && vs(Ra, n), hs.forEach(r), $n.forEach(r), o = 0; o < Qt.length; o++) f = Qt[o], f.blockedOn === n && (f.blockedOn = null);
    for (; 0 < Qt.length && (o = Qt[0], o.blockedOn === null); ) kv(o), o.blockedOn === null && Qt.shift();
  }
  var ru = O.ReactCurrentBatchConfig, ro = !0;
  function Mv(n, r, o, f) {
    var h = It, m = ru.transition;
    ru.transition = null;
    try {
      It = 1, Lc(n, r, o, f);
    } finally {
      It = h, ru.transition = m;
    }
  }
  function Nc(n, r, o, f) {
    var h = It, m = ru.transition;
    ru.transition = null;
    try {
      It = 4, Lc(n, r, o, f);
    } finally {
      It = h, ru.transition = m;
    }
  }
  function Lc(n, r, o, f) {
    if (ro) {
      var h = Ac(n, r, o, f);
      if (h === null) $c(n, r, f, ys, o), ii(n, f);
      else if (gl(h, n, r, o, f)) f.stopPropagation();
      else if (ii(n, f), r & 4 && -1 < l0.indexOf(n)) {
        for (; h !== null; ) {
          var m = Ns(h);
          if (m !== null && Rv(m), m = Ac(n, r, o, f), m === null && $c(n, r, f, ys, o), m === h) break;
          h = m;
        }
        h !== null && f.stopPropagation();
      } else $c(n, r, f, null, o);
    }
  }
  var ys = null;
  function Ac(n, r, o, f) {
    if (ys = null, n = pt(f), n = ka(n), n !== null) if (r = Pe(n), r === null) n = null;
    else if (o = r.tag, o === 13) {
      if (n = Tt(r), n !== null) return n;
      n = null;
    } else if (o === 3) {
      if (r.stateNode.current.memoizedState.isDehydrated) return r.tag === 3 ? r.stateNode.containerInfo : null;
      n = null;
    } else r !== n && (n = null);
    return ys = n, null;
  }
  function qd(n) {
    switch (n) {
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 1;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "toggle":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 4;
      case "message":
        switch (_r()) {
          case fa:
            return 1;
          case St:
            return 4;
          case gi:
          case bv:
            return 16;
          case Vd:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var Yi = null, gs = null, Ss = null;
  function Xd() {
    if (Ss) return Ss;
    var n, r = gs, o = r.length, f, h = "value" in Yi ? Yi.value : Yi.textContent, m = h.length;
    for (n = 0; n < o && r[n] === h[n]; n++) ;
    var C = o - n;
    for (f = 1; f <= C && r[o - f] === h[m - f]; f++) ;
    return Ss = h.slice(n, 1 < f ? 1 - f : void 0);
  }
  function au(n) {
    var r = n.keyCode;
    return "charCode" in n ? (n = n.charCode, n === 0 && r === 13 && (n = 13)) : n = r, n === 10 && (n = 13), 32 <= n || n === 13 ? n : 0;
  }
  function Es() {
    return !0;
  }
  function Nv() {
    return !1;
  }
  function da(n) {
    function r(o, f, h, m, C) {
      this._reactName = o, this._targetInst = h, this.type = f, this.nativeEvent = m, this.target = C, this.currentTarget = null;
      for (var T in n) n.hasOwnProperty(T) && (o = n[T], this[T] = o ? o(m) : m[T]);
      return this.isDefaultPrevented = (m.defaultPrevented != null ? m.defaultPrevented : m.returnValue === !1) ? Es : Nv, this.isPropagationStopped = Nv, this;
    }
    return se(r.prototype, { preventDefault: function() {
      this.defaultPrevented = !0;
      var o = this.nativeEvent;
      o && (o.preventDefault ? o.preventDefault() : typeof o.returnValue != "unknown" && (o.returnValue = !1), this.isDefaultPrevented = Es);
    }, stopPropagation: function() {
      var o = this.nativeEvent;
      o && (o.stopPropagation ? o.stopPropagation() : typeof o.cancelBubble != "unknown" && (o.cancelBubble = !0), this.isPropagationStopped = Es);
    }, persist: function() {
    }, isPersistent: Es }), r;
  }
  var Sl = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(n) {
    return n.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, Uc = da(Sl), iu = se({}, Sl, { view: 0, detail: 0 }), Lv = da(iu), zc, Kd, ws, ar = se({}, iu, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: tp, button: 0, buttons: 0, relatedTarget: function(n) {
    return n.relatedTarget === void 0 ? n.fromElement === n.srcElement ? n.toElement : n.fromElement : n.relatedTarget;
  }, movementX: function(n) {
    return "movementX" in n ? n.movementX : (n !== ws && (ws && n.type === "mousemove" ? (zc = n.screenX - ws.screenX, Kd = n.screenY - ws.screenY) : Kd = zc = 0, ws = n), zc);
  }, movementY: function(n) {
    return "movementY" in n ? n.movementY : Kd;
  } }), jc = da(ar), Av = se({}, ar, { dataTransfer: 0 }), Uv = da(Av), o0 = se({}, iu, { relatedTarget: 0 }), El = da(o0), Zd = se({}, Sl, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), zv = da(Zd), u0 = se({}, Sl, { clipboardData: function(n) {
    return "clipboardData" in n ? n.clipboardData : window.clipboardData;
  } }), s0 = da(u0), c0 = se({}, Sl, { data: 0 }), Jd = da(c0), ep = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, jv = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, Fv = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function Hv(n) {
    var r = this.nativeEvent;
    return r.getModifierState ? r.getModifierState(n) : (n = Fv[n]) ? !!r[n] : !1;
  }
  function tp() {
    return Hv;
  }
  var Pi = se({}, iu, { key: function(n) {
    if (n.key) {
      var r = ep[n.key] || n.key;
      if (r !== "Unidentified") return r;
    }
    return n.type === "keypress" ? (n = au(n), n === 13 ? "Enter" : String.fromCharCode(n)) : n.type === "keydown" || n.type === "keyup" ? jv[n.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: tp, charCode: function(n) {
    return n.type === "keypress" ? au(n) : 0;
  }, keyCode: function(n) {
    return n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
  }, which: function(n) {
    return n.type === "keypress" ? au(n) : n.type === "keydown" || n.type === "keyup" ? n.keyCode : 0;
  } }), f0 = da(Pi), np = se({}, ar, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Fc = da(np), rp = se({}, iu, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: tp }), d0 = da(rp), Hc = se({}, Sl, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Yv = da(Hc), $r = se({}, ar, {
    deltaX: function(n) {
      return "deltaX" in n ? n.deltaX : "wheelDeltaX" in n ? -n.wheelDeltaX : 0;
    },
    deltaY: function(n) {
      return "deltaY" in n ? n.deltaY : "wheelDeltaY" in n ? -n.wheelDeltaY : "wheelDelta" in n ? -n.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Vi = da($r), Fn = [9, 13, 27, 32], li = D && "CompositionEvent" in window, ao = null;
  D && "documentMode" in document && (ao = document.documentMode);
  var Yc = D && "TextEvent" in window && !ao, Pv = D && (!li || ao && 8 < ao && 11 >= ao), lu = " ", Vv = !1;
  function Bv(n, r) {
    switch (n) {
      case "keyup":
        return Fn.indexOf(r.keyCode) !== -1;
      case "keydown":
        return r.keyCode !== 229;
      case "keypress":
      case "mousedown":
      case "focusout":
        return !0;
      default:
        return !1;
    }
  }
  function Pc(n) {
    return n = n.detail, typeof n == "object" && "data" in n ? n.data : null;
  }
  var ou = !1;
  function p0(n, r) {
    switch (n) {
      case "compositionend":
        return Pc(r);
      case "keypress":
        return r.which !== 32 ? null : (Vv = !0, lu);
      case "textInput":
        return n = r.data, n === lu && Vv ? null : n;
      default:
        return null;
    }
  }
  function h0(n, r) {
    if (ou) return n === "compositionend" || !li && Bv(n, r) ? (n = Xd(), Ss = gs = Yi = null, ou = !1, n) : null;
    switch (n) {
      case "paste":
        return null;
      case "keypress":
        if (!(r.ctrlKey || r.altKey || r.metaKey) || r.ctrlKey && r.altKey) {
          if (r.char && 1 < r.char.length) return r.char;
          if (r.which) return String.fromCharCode(r.which);
        }
        return null;
      case "compositionend":
        return Pv && r.locale !== "ko" ? null : r.data;
      default:
        return null;
    }
  }
  var Iv = { color: !0, date: !0, datetime: !0, "datetime-local": !0, email: !0, month: !0, number: !0, password: !0, range: !0, search: !0, tel: !0, text: !0, time: !0, url: !0, week: !0 };
  function Wv(n) {
    var r = n && n.nodeName && n.nodeName.toLowerCase();
    return r === "input" ? !!Iv[n.type] : r === "textarea";
  }
  function $v(n, r, o, f) {
    Za(f), r = ks(r, "onChange"), 0 < r.length && (o = new Uc("onChange", "change", null, o, f), n.push({ event: o, listeners: r }));
  }
  var Cs = null, uu = null;
  function su(n) {
    Wc(n, 0);
  }
  function cu(n) {
    var r = du(n);
    if (Vn(r)) return n;
  }
  function Gv(n, r) {
    if (n === "change") return r;
  }
  var ap = !1;
  if (D) {
    var ip;
    if (D) {
      var lp = "oninput" in document;
      if (!lp) {
        var Qv = document.createElement("div");
        Qv.setAttribute("oninput", "return;"), lp = typeof Qv.oninput == "function";
      }
      ip = lp;
    } else ip = !1;
    ap = ip && (!document.documentMode || 9 < document.documentMode);
  }
  function qv() {
    Cs && (Cs.detachEvent("onpropertychange", Xv), uu = Cs = null);
  }
  function Xv(n) {
    if (n.propertyName === "value" && cu(uu)) {
      var r = [];
      $v(r, uu, n, pt(n)), ti(su, r);
    }
  }
  function v0(n, r, o) {
    n === "focusin" ? (qv(), Cs = r, uu = o, Cs.attachEvent("onpropertychange", Xv)) : n === "focusout" && qv();
  }
  function m0(n) {
    if (n === "selectionchange" || n === "keyup" || n === "keydown") return cu(uu);
  }
  function y0(n, r) {
    if (n === "click") return cu(r);
  }
  function Kv(n, r) {
    if (n === "input" || n === "change") return cu(r);
  }
  function g0(n, r) {
    return n === r && (n !== 0 || 1 / n === 1 / r) || n !== n && r !== r;
  }
  var Da = typeof Object.is == "function" ? Object.is : g0;
  function bs(n, r) {
    if (Da(n, r)) return !0;
    if (typeof n != "object" || n === null || typeof r != "object" || r === null) return !1;
    var o = Object.keys(n), f = Object.keys(r);
    if (o.length !== f.length) return !1;
    for (f = 0; f < o.length; f++) {
      var h = o[f];
      if (!_.call(r, h) || !Da(n[h], r[h])) return !1;
    }
    return !0;
  }
  function Zv(n) {
    for (; n && n.firstChild; ) n = n.firstChild;
    return n;
  }
  function Jv(n, r) {
    var o = Zv(n);
    n = 0;
    for (var f; o; ) {
      if (o.nodeType === 3) {
        if (f = n + o.textContent.length, n <= r && f >= r) return { node: o, offset: r - n };
        n = f;
      }
      e: {
        for (; o; ) {
          if (o.nextSibling) {
            o = o.nextSibling;
            break e;
          }
          o = o.parentNode;
        }
        o = void 0;
      }
      o = Zv(o);
    }
  }
  function em(n, r) {
    return n && r ? n === r ? !0 : n && n.nodeType === 3 ? !1 : r && r.nodeType === 3 ? em(n, r.parentNode) : "contains" in n ? n.contains(r) : n.compareDocumentPosition ? !!(n.compareDocumentPosition(r) & 16) : !1 : !1;
  }
  function Vc() {
    for (var n = window, r = Ie(); r instanceof n.HTMLIFrameElement; ) {
      try {
        var o = typeof r.contentWindow.location.href == "string";
      } catch {
        o = !1;
      }
      if (o) n = r.contentWindow;
      else break;
      r = Ie(n.document);
    }
    return r;
  }
  function Bi(n) {
    var r = n && n.nodeName && n.nodeName.toLowerCase();
    return r && (r === "input" && (n.type === "text" || n.type === "search" || n.type === "tel" || n.type === "url" || n.type === "password") || r === "textarea" || n.contentEditable === "true");
  }
  function Bc(n) {
    var r = Vc(), o = n.focusedElem, f = n.selectionRange;
    if (r !== o && o && o.ownerDocument && em(o.ownerDocument.documentElement, o)) {
      if (f !== null && Bi(o)) {
        if (r = f.start, n = f.end, n === void 0 && (n = r), "selectionStart" in o) o.selectionStart = r, o.selectionEnd = Math.min(n, o.value.length);
        else if (n = (r = o.ownerDocument || document) && r.defaultView || window, n.getSelection) {
          n = n.getSelection();
          var h = o.textContent.length, m = Math.min(f.start, h);
          f = f.end === void 0 ? m : Math.min(f.end, h), !n.extend && m > f && (h = f, f = m, m = h), h = Jv(o, m);
          var C = Jv(
            o,
            f
          );
          h && C && (n.rangeCount !== 1 || n.anchorNode !== h.node || n.anchorOffset !== h.offset || n.focusNode !== C.node || n.focusOffset !== C.offset) && (r = r.createRange(), r.setStart(h.node, h.offset), n.removeAllRanges(), m > f ? (n.addRange(r), n.extend(C.node, C.offset)) : (r.setEnd(C.node, C.offset), n.addRange(r)));
        }
      }
      for (r = [], n = o; n = n.parentNode; ) n.nodeType === 1 && r.push({ element: n, left: n.scrollLeft, top: n.scrollTop });
      for (typeof o.focus == "function" && o.focus(), o = 0; o < r.length; o++) n = r[o], n.element.scrollLeft = n.left, n.element.scrollTop = n.top;
    }
  }
  var tm = D && "documentMode" in document && 11 >= document.documentMode, oi = null, op = null, xs = null, up = !1;
  function nm(n, r, o) {
    var f = o.window === o ? o.document : o.nodeType === 9 ? o : o.ownerDocument;
    up || oi == null || oi !== Ie(f) || (f = oi, "selectionStart" in f && Bi(f) ? f = { start: f.selectionStart, end: f.selectionEnd } : (f = (f.ownerDocument && f.ownerDocument.defaultView || window).getSelection(), f = { anchorNode: f.anchorNode, anchorOffset: f.anchorOffset, focusNode: f.focusNode, focusOffset: f.focusOffset }), xs && bs(xs, f) || (xs = f, f = ks(op, "onSelect"), 0 < f.length && (r = new Uc("onSelect", "select", null, r, o), n.push({ event: r, listeners: f }), r.target = oi)));
  }
  function Ic(n, r) {
    var o = {};
    return o[n.toLowerCase()] = r.toLowerCase(), o["Webkit" + n] = "webkit" + r, o["Moz" + n] = "moz" + r, o;
  }
  var io = { animationend: Ic("Animation", "AnimationEnd"), animationiteration: Ic("Animation", "AnimationIteration"), animationstart: Ic("Animation", "AnimationStart"), transitionend: Ic("Transition", "TransitionEnd") }, sp = {}, cp = {};
  D && (cp = document.createElement("div").style, "AnimationEvent" in window || (delete io.animationend.animation, delete io.animationiteration.animation, delete io.animationstart.animation), "TransitionEvent" in window || delete io.transitionend.transition);
  function ir(n) {
    if (sp[n]) return sp[n];
    if (!io[n]) return n;
    var r = io[n], o;
    for (o in r) if (r.hasOwnProperty(o) && o in cp) return sp[n] = r[o];
    return n;
  }
  var fp = ir("animationend"), rm = ir("animationiteration"), am = ir("animationstart"), im = ir("transitionend"), lm = /* @__PURE__ */ new Map(), om = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function Ii(n, r) {
    lm.set(n, r), w(r, [n]);
  }
  for (var Ts = 0; Ts < om.length; Ts++) {
    var lo = om[Ts], S0 = lo.toLowerCase(), _s = lo[0].toUpperCase() + lo.slice(1);
    Ii(S0, "on" + _s);
  }
  Ii(fp, "onAnimationEnd"), Ii(rm, "onAnimationIteration"), Ii(am, "onAnimationStart"), Ii("dblclick", "onDoubleClick"), Ii("focusin", "onFocus"), Ii("focusout", "onBlur"), Ii(im, "onTransitionEnd"), S("onMouseEnter", ["mouseout", "mouseover"]), S("onMouseLeave", ["mouseout", "mouseover"]), S("onPointerEnter", ["pointerout", "pointerover"]), S("onPointerLeave", ["pointerout", "pointerover"]), w("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" ")), w("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" ")), w("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), w("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" ")), w("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" ")), w("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var Rs = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), E0 = new Set("cancel close invalid load scroll toggle".split(" ").concat(Rs));
  function um(n, r, o) {
    var f = n.type || "unknown-event";
    n.currentTarget = o, de(f, r, void 0, n), n.currentTarget = null;
  }
  function Wc(n, r) {
    r = (r & 4) !== 0;
    for (var o = 0; o < n.length; o++) {
      var f = n[o], h = f.event;
      f = f.listeners;
      e: {
        var m = void 0;
        if (r) for (var C = f.length - 1; 0 <= C; C--) {
          var T = f[C], k = T.instance, B = T.currentTarget;
          if (T = T.listener, k !== m && h.isPropagationStopped()) break e;
          um(h, T, B), m = k;
        }
        else for (C = 0; C < f.length; C++) {
          if (T = f[C], k = T.instance, B = T.currentTarget, T = T.listener, k !== m && h.isPropagationStopped()) break e;
          um(h, T, B), m = k;
        }
      }
    }
    if (ml) throw n = eo, ml = !1, eo = null, n;
  }
  function en(n, r) {
    var o = r[gp];
    o === void 0 && (o = r[gp] = /* @__PURE__ */ new Set());
    var f = n + "__bubble";
    o.has(f) || (sm(r, n, 2, !1), o.add(f));
  }
  function wl(n, r, o) {
    var f = 0;
    r && (f |= 4), sm(o, n, f, r);
  }
  var Wi = "_reactListening" + Math.random().toString(36).slice(2);
  function fu(n) {
    if (!n[Wi]) {
      n[Wi] = !0, p.forEach(function(o) {
        o !== "selectionchange" && (E0.has(o) || wl(o, !1, n), wl(o, !0, n));
      });
      var r = n.nodeType === 9 ? n : n.ownerDocument;
      r === null || r[Wi] || (r[Wi] = !0, wl("selectionchange", !1, r));
    }
  }
  function sm(n, r, o, f) {
    switch (qd(r)) {
      case 1:
        var h = Mv;
        break;
      case 4:
        h = Nc;
        break;
      default:
        h = Lc;
    }
    o = h.bind(null, r, o, n), h = void 0, !eu || r !== "touchstart" && r !== "touchmove" && r !== "wheel" || (h = !0), f ? h !== void 0 ? n.addEventListener(r, o, { capture: !0, passive: h }) : n.addEventListener(r, o, !0) : h !== void 0 ? n.addEventListener(r, o, { passive: h }) : n.addEventListener(r, o, !1);
  }
  function $c(n, r, o, f, h) {
    var m = f;
    if (!(r & 1) && !(r & 2) && f !== null) e: for (; ; ) {
      if (f === null) return;
      var C = f.tag;
      if (C === 3 || C === 4) {
        var T = f.stateNode.containerInfo;
        if (T === h || T.nodeType === 8 && T.parentNode === h) break;
        if (C === 4) for (C = f.return; C !== null; ) {
          var k = C.tag;
          if ((k === 3 || k === 4) && (k = C.stateNode.containerInfo, k === h || k.nodeType === 8 && k.parentNode === h)) return;
          C = C.return;
        }
        for (; T !== null; ) {
          if (C = ka(T), C === null) return;
          if (k = C.tag, k === 5 || k === 6) {
            f = m = C;
            continue e;
          }
          T = T.parentNode;
        }
      }
      f = f.return;
    }
    ti(function() {
      var B = m, ee = pt(o), ne = [];
      e: {
        var Z = lm.get(n);
        if (Z !== void 0) {
          var xe = Uc, Ne = n;
          switch (n) {
            case "keypress":
              if (au(o) === 0) break e;
            case "keydown":
            case "keyup":
              xe = f0;
              break;
            case "focusin":
              Ne = "focus", xe = El;
              break;
            case "focusout":
              Ne = "blur", xe = El;
              break;
            case "beforeblur":
            case "afterblur":
              xe = El;
              break;
            case "click":
              if (o.button === 2) break e;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              xe = jc;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              xe = Uv;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              xe = d0;
              break;
            case fp:
            case rm:
            case am:
              xe = zv;
              break;
            case im:
              xe = Yv;
              break;
            case "scroll":
              xe = Lv;
              break;
            case "wheel":
              xe = Vi;
              break;
            case "copy":
            case "cut":
            case "paste":
              xe = s0;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              xe = Fc;
          }
          var Ue = (r & 4) !== 0, An = !Ue && n === "scroll", j = Ue ? Z !== null ? Z + "Capture" : null : Z;
          Ue = [];
          for (var N = B, Y; N !== null; ) {
            Y = N;
            var ie = Y.stateNode;
            if (Y.tag === 5 && ie !== null && (Y = ie, j !== null && (ie = Jl(N, j), ie != null && Ue.push(Ds(N, ie, Y)))), An) break;
            N = N.return;
          }
          0 < Ue.length && (Z = new xe(Z, Ne, null, o, ee), ne.push({ event: Z, listeners: Ue }));
        }
      }
      if (!(r & 7)) {
        e: {
          if (Z = n === "mouseover" || n === "pointerover", xe = n === "mouseout" || n === "pointerout", Z && o !== tt && (Ne = o.relatedTarget || o.fromElement) && (ka(Ne) || Ne[$i])) break e;
          if ((xe || Z) && (Z = ee.window === ee ? ee : (Z = ee.ownerDocument) ? Z.defaultView || Z.parentWindow : window, xe ? (Ne = o.relatedTarget || o.toElement, xe = B, Ne = Ne ? ka(Ne) : null, Ne !== null && (An = Pe(Ne), Ne !== An || Ne.tag !== 5 && Ne.tag !== 6) && (Ne = null)) : (xe = null, Ne = B), xe !== Ne)) {
            if (Ue = jc, ie = "onMouseLeave", j = "onMouseEnter", N = "mouse", (n === "pointerout" || n === "pointerover") && (Ue = Fc, ie = "onPointerLeave", j = "onPointerEnter", N = "pointer"), An = xe == null ? Z : du(xe), Y = Ne == null ? Z : du(Ne), Z = new Ue(ie, N + "leave", xe, o, ee), Z.target = An, Z.relatedTarget = Y, ie = null, ka(ee) === B && (Ue = new Ue(j, N + "enter", Ne, o, ee), Ue.target = Y, Ue.relatedTarget = An, ie = Ue), An = ie, xe && Ne) t: {
              for (Ue = xe, j = Ne, N = 0, Y = Ue; Y; Y = oo(Y)) N++;
              for (Y = 0, ie = j; ie; ie = oo(ie)) Y++;
              for (; 0 < N - Y; ) Ue = oo(Ue), N--;
              for (; 0 < Y - N; ) j = oo(j), Y--;
              for (; N--; ) {
                if (Ue === j || j !== null && Ue === j.alternate) break t;
                Ue = oo(Ue), j = oo(j);
              }
              Ue = null;
            }
            else Ue = null;
            xe !== null && dp(ne, Z, xe, Ue, !1), Ne !== null && An !== null && dp(ne, An, Ne, Ue, !0);
          }
        }
        e: {
          if (Z = B ? du(B) : window, xe = Z.nodeName && Z.nodeName.toLowerCase(), xe === "select" || xe === "input" && Z.type === "file") var je = Gv;
          else if (Wv(Z)) if (ap) je = Kv;
          else {
            je = m0;
            var Qe = v0;
          }
          else (xe = Z.nodeName) && xe.toLowerCase() === "input" && (Z.type === "checkbox" || Z.type === "radio") && (je = y0);
          if (je && (je = je(n, B))) {
            $v(ne, je, o, ee);
            break e;
          }
          Qe && Qe(n, Z, B), n === "focusout" && (Qe = Z._wrapperState) && Qe.controlled && Z.type === "number" && zn(Z, "number", Z.value);
        }
        switch (Qe = B ? du(B) : window, n) {
          case "focusin":
            (Wv(Qe) || Qe.contentEditable === "true") && (oi = Qe, op = B, xs = null);
            break;
          case "focusout":
            xs = op = oi = null;
            break;
          case "mousedown":
            up = !0;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            up = !1, nm(ne, o, ee);
            break;
          case "selectionchange":
            if (tm) break;
          case "keydown":
          case "keyup":
            nm(ne, o, ee);
        }
        var Le;
        if (li) e: {
          switch (n) {
            case "compositionstart":
              var Xe = "onCompositionStart";
              break e;
            case "compositionend":
              Xe = "onCompositionEnd";
              break e;
            case "compositionupdate":
              Xe = "onCompositionUpdate";
              break e;
          }
          Xe = void 0;
        }
        else ou ? Bv(n, o) && (Xe = "onCompositionEnd") : n === "keydown" && o.keyCode === 229 && (Xe = "onCompositionStart");
        Xe && (Pv && o.locale !== "ko" && (ou || Xe !== "onCompositionStart" ? Xe === "onCompositionEnd" && ou && (Le = Xd()) : (Yi = ee, gs = "value" in Yi ? Yi.value : Yi.textContent, ou = !0)), Qe = ks(B, Xe), 0 < Qe.length && (Xe = new Jd(Xe, n, null, o, ee), ne.push({ event: Xe, listeners: Qe }), Le ? Xe.data = Le : (Le = Pc(o), Le !== null && (Xe.data = Le)))), (Le = Yc ? p0(n, o) : h0(n, o)) && (B = ks(B, "onBeforeInput"), 0 < B.length && (ee = new Jd("onBeforeInput", "beforeinput", null, o, ee), ne.push({ event: ee, listeners: B }), ee.data = Le));
      }
      Wc(ne, r);
    });
  }
  function Ds(n, r, o) {
    return { instance: n, listener: r, currentTarget: o };
  }
  function ks(n, r) {
    for (var o = r + "Capture", f = []; n !== null; ) {
      var h = n, m = h.stateNode;
      h.tag === 5 && m !== null && (h = m, m = Jl(n, o), m != null && f.unshift(Ds(n, m, h)), m = Jl(n, r), m != null && f.push(Ds(n, m, h))), n = n.return;
    }
    return f;
  }
  function oo(n) {
    if (n === null) return null;
    do
      n = n.return;
    while (n && n.tag !== 5);
    return n || null;
  }
  function dp(n, r, o, f, h) {
    for (var m = r._reactName, C = []; o !== null && o !== f; ) {
      var T = o, k = T.alternate, B = T.stateNode;
      if (k !== null && k === f) break;
      T.tag === 5 && B !== null && (T = B, h ? (k = Jl(o, m), k != null && C.unshift(Ds(o, k, T))) : h || (k = Jl(o, m), k != null && C.push(Ds(o, k, T)))), o = o.return;
    }
    C.length !== 0 && n.push({ event: r, listeners: C });
  }
  var pp = /\r\n?/g, w0 = /\u0000|\uFFFD/g;
  function hp(n) {
    return (typeof n == "string" ? n : "" + n).replace(pp, `
`).replace(w0, "");
  }
  function Gc(n, r, o) {
    if (r = hp(r), hp(n) !== r && o) throw Error(c(425));
  }
  function Qc() {
  }
  var vp = null, uo = null;
  function Os(n, r) {
    return n === "textarea" || n === "noscript" || typeof r.children == "string" || typeof r.children == "number" || typeof r.dangerouslySetInnerHTML == "object" && r.dangerouslySetInnerHTML !== null && r.dangerouslySetInnerHTML.__html != null;
  }
  var so = typeof setTimeout == "function" ? setTimeout : void 0, cm = typeof clearTimeout == "function" ? clearTimeout : void 0, mp = typeof Promise == "function" ? Promise : void 0, yp = typeof queueMicrotask == "function" ? queueMicrotask : typeof mp < "u" ? function(n) {
    return mp.resolve(null).then(n).catch(C0);
  } : so;
  function C0(n) {
    setTimeout(function() {
      throw n;
    });
  }
  function Cl(n, r) {
    var o = r, f = 0;
    do {
      var h = o.nextSibling;
      if (n.removeChild(o), h && h.nodeType === 8) if (o = h.data, o === "/$") {
        if (f === 0) {
          n.removeChild(h), ms(r);
          return;
        }
        f--;
      } else o !== "$" && o !== "$?" && o !== "$!" || f++;
      o = h;
    } while (o);
    ms(r);
  }
  function ui(n) {
    for (; n != null; n = n.nextSibling) {
      var r = n.nodeType;
      if (r === 1 || r === 3) break;
      if (r === 8) {
        if (r = n.data, r === "$" || r === "$!" || r === "$?") break;
        if (r === "/$") return null;
      }
    }
    return n;
  }
  function Ms(n) {
    n = n.previousSibling;
    for (var r = 0; n; ) {
      if (n.nodeType === 8) {
        var o = n.data;
        if (o === "$" || o === "$!" || o === "$?") {
          if (r === 0) return n;
          r--;
        } else o === "/$" && r++;
      }
      n = n.previousSibling;
    }
    return null;
  }
  var bl = Math.random().toString(36).slice(2), Si = "__reactFiber$" + bl, co = "__reactProps$" + bl, $i = "__reactContainer$" + bl, gp = "__reactEvents$" + bl, b0 = "__reactListeners$" + bl, Sp = "__reactHandles$" + bl;
  function ka(n) {
    var r = n[Si];
    if (r) return r;
    for (var o = n.parentNode; o; ) {
      if (r = o[$i] || o[Si]) {
        if (o = r.alternate, r.child !== null || o !== null && o.child !== null) for (n = Ms(n); n !== null; ) {
          if (o = n[Si]) return o;
          n = Ms(n);
        }
        return r;
      }
      n = o, o = n.parentNode;
    }
    return null;
  }
  function Ns(n) {
    return n = n[Si] || n[$i], !n || n.tag !== 5 && n.tag !== 6 && n.tag !== 13 && n.tag !== 3 ? null : n;
  }
  function du(n) {
    if (n.tag === 5 || n.tag === 6) return n.stateNode;
    throw Error(c(33));
  }
  function Be(n) {
    return n[co] || null;
  }
  var xl = [], on = -1;
  function dt(n) {
    return { current: n };
  }
  function jt(n) {
    0 > on || (n.current = xl[on], xl[on] = null, on--);
  }
  function Ht(n, r) {
    on++, xl[on] = n.current, n.current = r;
  }
  var Ei = {}, nt = dt(Ei), Tn = dt(!1), Gr = Ei;
  function Oa(n, r) {
    var o = n.type.contextTypes;
    if (!o) return Ei;
    var f = n.stateNode;
    if (f && f.__reactInternalMemoizedUnmaskedChildContext === r) return f.__reactInternalMemoizedMaskedChildContext;
    var h = {}, m;
    for (m in o) h[m] = r[m];
    return f && (n = n.stateNode, n.__reactInternalMemoizedUnmaskedChildContext = r, n.__reactInternalMemoizedMaskedChildContext = h), h;
  }
  function pn(n) {
    return n = n.childContextTypes, n != null;
  }
  function Ma() {
    jt(Tn), jt(nt);
  }
  function Tl(n, r, o) {
    if (nt.current !== Ei) throw Error(c(168));
    Ht(nt, r), Ht(Tn, o);
  }
  function Ls(n, r, o) {
    var f = n.stateNode;
    if (r = r.childContextTypes, typeof f.getChildContext != "function") return o;
    f = f.getChildContext();
    for (var h in f) if (!(h in r)) throw Error(c(108, On(n) || "Unknown", h));
    return se({}, o, f);
  }
  function qc(n) {
    return n = (n = n.stateNode) && n.__reactInternalMemoizedMergedChildContext || Ei, Gr = nt.current, Ht(nt, n), Ht(Tn, Tn.current), !0;
  }
  function fm(n, r, o) {
    var f = n.stateNode;
    if (!f) throw Error(c(169));
    o ? (n = Ls(n, r, Gr), f.__reactInternalMemoizedMergedChildContext = n, jt(Tn), jt(nt), Ht(nt, n)) : jt(Tn), Ht(Tn, o);
  }
  var pa = null, lr = !1, As = !1;
  function Ep(n) {
    pa === null ? pa = [n] : pa.push(n);
  }
  function wp(n) {
    lr = !0, Ep(n);
  }
  function Qr() {
    if (!As && pa !== null) {
      As = !0;
      var n = 0, r = It;
      try {
        var o = pa;
        for (It = 1; n < o.length; n++) {
          var f = o[n];
          do
            f = f(!0);
          while (f !== null);
        }
        pa = null, lr = !1;
      } catch (h) {
        throw pa !== null && (pa = pa.slice(n + 1)), ln(fa, Qr), h;
      } finally {
        It = r, As = !1;
      }
    }
    return null;
  }
  var _l = [], qr = 0, fo = null, pu = 0, Xr = [], Dr = 0, Na = null, dr = 1, Gi = "";
  function ha(n, r) {
    _l[qr++] = pu, _l[qr++] = fo, fo = n, pu = r;
  }
  function Cp(n, r, o) {
    Xr[Dr++] = dr, Xr[Dr++] = Gi, Xr[Dr++] = Na, Na = n;
    var f = dr;
    n = Gi;
    var h = 32 - Ta(f) - 1;
    f &= ~(1 << h), o += 1;
    var m = 32 - Ta(r) + h;
    if (30 < m) {
      var C = h - h % 5;
      m = (f & (1 << C) - 1).toString(32), f >>= C, h -= C, dr = 1 << 32 - Ta(r) + h | o << h | f, Gi = m + n;
    } else dr = 1 << m | o << h | f, Gi = n;
  }
  function Xc(n) {
    n.return !== null && (ha(n, 1), Cp(n, 1, 0));
  }
  function bp(n) {
    for (; n === fo; ) fo = _l[--qr], _l[qr] = null, pu = _l[--qr], _l[qr] = null;
    for (; n === Na; ) Na = Xr[--Dr], Xr[Dr] = null, Gi = Xr[--Dr], Xr[Dr] = null, dr = Xr[--Dr], Xr[Dr] = null;
  }
  var va = null, Kr = null, un = !1, La = null;
  function xp(n, r) {
    var o = Pa(5, null, null, 0);
    o.elementType = "DELETED", o.stateNode = r, o.return = n, r = n.deletions, r === null ? (n.deletions = [o], n.flags |= 16) : r.push(o);
  }
  function dm(n, r) {
    switch (n.tag) {
      case 5:
        var o = n.type;
        return r = r.nodeType !== 1 || o.toLowerCase() !== r.nodeName.toLowerCase() ? null : r, r !== null ? (n.stateNode = r, va = n, Kr = ui(r.firstChild), !0) : !1;
      case 6:
        return r = n.pendingProps === "" || r.nodeType !== 3 ? null : r, r !== null ? (n.stateNode = r, va = n, Kr = null, !0) : !1;
      case 13:
        return r = r.nodeType !== 8 ? null : r, r !== null ? (o = Na !== null ? { id: dr, overflow: Gi } : null, n.memoizedState = { dehydrated: r, treeContext: o, retryLane: 1073741824 }, o = Pa(18, null, null, 0), o.stateNode = r, o.return = n, n.child = o, va = n, Kr = null, !0) : !1;
      default:
        return !1;
    }
  }
  function Kc(n) {
    return (n.mode & 1) !== 0 && (n.flags & 128) === 0;
  }
  function Zc(n) {
    if (un) {
      var r = Kr;
      if (r) {
        var o = r;
        if (!dm(n, r)) {
          if (Kc(n)) throw Error(c(418));
          r = ui(o.nextSibling);
          var f = va;
          r && dm(n, r) ? xp(f, o) : (n.flags = n.flags & -4097 | 2, un = !1, va = n);
        }
      } else {
        if (Kc(n)) throw Error(c(418));
        n.flags = n.flags & -4097 | 2, un = !1, va = n;
      }
    }
  }
  function pm(n) {
    for (n = n.return; n !== null && n.tag !== 5 && n.tag !== 3 && n.tag !== 13; ) n = n.return;
    va = n;
  }
  function Jc(n) {
    if (n !== va) return !1;
    if (!un) return pm(n), un = !0, !1;
    var r;
    if ((r = n.tag !== 3) && !(r = n.tag !== 5) && (r = n.type, r = r !== "head" && r !== "body" && !Os(n.type, n.memoizedProps)), r && (r = Kr)) {
      if (Kc(n)) throw hm(), Error(c(418));
      for (; r; ) xp(n, r), r = ui(r.nextSibling);
    }
    if (pm(n), n.tag === 13) {
      if (n = n.memoizedState, n = n !== null ? n.dehydrated : null, !n) throw Error(c(317));
      e: {
        for (n = n.nextSibling, r = 0; n; ) {
          if (n.nodeType === 8) {
            var o = n.data;
            if (o === "/$") {
              if (r === 0) {
                Kr = ui(n.nextSibling);
                break e;
              }
              r--;
            } else o !== "$" && o !== "$!" && o !== "$?" || r++;
          }
          n = n.nextSibling;
        }
        Kr = null;
      }
    } else Kr = va ? ui(n.stateNode.nextSibling) : null;
    return !0;
  }
  function hm() {
    for (var n = Kr; n; ) n = ui(n.nextSibling);
  }
  function Sn() {
    Kr = va = null, un = !1;
  }
  function Tp(n) {
    La === null ? La = [n] : La.push(n);
  }
  var ef = O.ReactCurrentBatchConfig;
  function po(n, r, o) {
    if (n = o.ref, n !== null && typeof n != "function" && typeof n != "object") {
      if (o._owner) {
        if (o = o._owner, o) {
          if (o.tag !== 1) throw Error(c(309));
          var f = o.stateNode;
        }
        if (!f) throw Error(c(147, n));
        var h = f, m = "" + n;
        return r !== null && r.ref !== null && typeof r.ref == "function" && r.ref._stringRef === m ? r.ref : (r = function(C) {
          var T = h.refs;
          C === null ? delete T[m] : T[m] = C;
        }, r._stringRef = m, r);
      }
      if (typeof n != "string") throw Error(c(284));
      if (!o._owner) throw Error(c(290, n));
    }
    return n;
  }
  function wi(n, r) {
    throw n = Object.prototype.toString.call(r), Error(c(31, n === "[object Object]" ? "object with keys {" + Object.keys(r).join(", ") + "}" : n));
  }
  function vm(n) {
    var r = n._init;
    return r(n._payload);
  }
  function tf(n) {
    function r(j, N) {
      if (n) {
        var Y = j.deletions;
        Y === null ? (j.deletions = [N], j.flags |= 16) : Y.push(N);
      }
    }
    function o(j, N) {
      if (!n) return null;
      for (; N !== null; ) r(j, N), N = N.sibling;
      return null;
    }
    function f(j, N) {
      for (j = /* @__PURE__ */ new Map(); N !== null; ) N.key !== null ? j.set(N.key, N) : j.set(N.index, N), N = N.sibling;
      return j;
    }
    function h(j, N) {
      return j = Al(j, N), j.index = 0, j.sibling = null, j;
    }
    function m(j, N, Y) {
      return j.index = Y, n ? (Y = j.alternate, Y !== null ? (Y = Y.index, Y < N ? (j.flags |= 2, N) : Y) : (j.flags |= 2, N)) : (j.flags |= 1048576, N);
    }
    function C(j) {
      return n && j.alternate === null && (j.flags |= 2), j;
    }
    function T(j, N, Y, ie) {
      return N === null || N.tag !== 6 ? (N = Bf(Y, j.mode, ie), N.return = j, N) : (N = h(N, Y), N.return = j, N);
    }
    function k(j, N, Y, ie) {
      var je = Y.type;
      return je === ye ? ee(j, N, Y.props.children, ie, Y.key) : N !== null && (N.elementType === je || typeof je == "object" && je !== null && je.$$typeof === it && vm(je) === N.type) ? (ie = h(N, Y.props), ie.ref = po(j, N, Y), ie.return = j, ie) : (ie = Pf(Y.type, Y.key, Y.props, null, j.mode, ie), ie.ref = po(j, N, Y), ie.return = j, ie);
    }
    function B(j, N, Y, ie) {
      return N === null || N.tag !== 4 || N.stateNode.containerInfo !== Y.containerInfo || N.stateNode.implementation !== Y.implementation ? (N = Zs(Y, j.mode, ie), N.return = j, N) : (N = h(N, Y.children || []), N.return = j, N);
    }
    function ee(j, N, Y, ie, je) {
      return N === null || N.tag !== 7 ? (N = Do(Y, j.mode, ie, je), N.return = j, N) : (N = h(N, Y), N.return = j, N);
    }
    function ne(j, N, Y) {
      if (typeof N == "string" && N !== "" || typeof N == "number") return N = Bf("" + N, j.mode, Y), N.return = j, N;
      if (typeof N == "object" && N !== null) {
        switch (N.$$typeof) {
          case be:
            return Y = Pf(N.type, N.key, N.props, null, j.mode, Y), Y.ref = po(j, null, N), Y.return = j, Y;
          case le:
            return N = Zs(N, j.mode, Y), N.return = j, N;
          case it:
            var ie = N._init;
            return ne(j, ie(N._payload), Y);
        }
        if (In(N) || De(N)) return N = Do(N, j.mode, Y, null), N.return = j, N;
        wi(j, N);
      }
      return null;
    }
    function Z(j, N, Y, ie) {
      var je = N !== null ? N.key : null;
      if (typeof Y == "string" && Y !== "" || typeof Y == "number") return je !== null ? null : T(j, N, "" + Y, ie);
      if (typeof Y == "object" && Y !== null) {
        switch (Y.$$typeof) {
          case be:
            return Y.key === je ? k(j, N, Y, ie) : null;
          case le:
            return Y.key === je ? B(j, N, Y, ie) : null;
          case it:
            return je = Y._init, Z(
              j,
              N,
              je(Y._payload),
              ie
            );
        }
        if (In(Y) || De(Y)) return je !== null ? null : ee(j, N, Y, ie, null);
        wi(j, Y);
      }
      return null;
    }
    function xe(j, N, Y, ie, je) {
      if (typeof ie == "string" && ie !== "" || typeof ie == "number") return j = j.get(Y) || null, T(N, j, "" + ie, je);
      if (typeof ie == "object" && ie !== null) {
        switch (ie.$$typeof) {
          case be:
            return j = j.get(ie.key === null ? Y : ie.key) || null, k(N, j, ie, je);
          case le:
            return j = j.get(ie.key === null ? Y : ie.key) || null, B(N, j, ie, je);
          case it:
            var Qe = ie._init;
            return xe(j, N, Y, Qe(ie._payload), je);
        }
        if (In(ie) || De(ie)) return j = j.get(Y) || null, ee(N, j, ie, je, null);
        wi(N, ie);
      }
      return null;
    }
    function Ne(j, N, Y, ie) {
      for (var je = null, Qe = null, Le = N, Xe = N = 0, Kn = null; Le !== null && Xe < Y.length; Xe++) {
        Le.index > Xe ? (Kn = Le, Le = null) : Kn = Le.sibling;
        var Nt = Z(j, Le, Y[Xe], ie);
        if (Nt === null) {
          Le === null && (Le = Kn);
          break;
        }
        n && Le && Nt.alternate === null && r(j, Le), N = m(Nt, N, Xe), Qe === null ? je = Nt : Qe.sibling = Nt, Qe = Nt, Le = Kn;
      }
      if (Xe === Y.length) return o(j, Le), un && ha(j, Xe), je;
      if (Le === null) {
        for (; Xe < Y.length; Xe++) Le = ne(j, Y[Xe], ie), Le !== null && (N = m(Le, N, Xe), Qe === null ? je = Le : Qe.sibling = Le, Qe = Le);
        return un && ha(j, Xe), je;
      }
      for (Le = f(j, Le); Xe < Y.length; Xe++) Kn = xe(Le, j, Xe, Y[Xe], ie), Kn !== null && (n && Kn.alternate !== null && Le.delete(Kn.key === null ? Xe : Kn.key), N = m(Kn, N, Xe), Qe === null ? je = Kn : Qe.sibling = Kn, Qe = Kn);
      return n && Le.forEach(function(el) {
        return r(j, el);
      }), un && ha(j, Xe), je;
    }
    function Ue(j, N, Y, ie) {
      var je = De(Y);
      if (typeof je != "function") throw Error(c(150));
      if (Y = je.call(Y), Y == null) throw Error(c(151));
      for (var Qe = je = null, Le = N, Xe = N = 0, Kn = null, Nt = Y.next(); Le !== null && !Nt.done; Xe++, Nt = Y.next()) {
        Le.index > Xe ? (Kn = Le, Le = null) : Kn = Le.sibling;
        var el = Z(j, Le, Nt.value, ie);
        if (el === null) {
          Le === null && (Le = Kn);
          break;
        }
        n && Le && el.alternate === null && r(j, Le), N = m(el, N, Xe), Qe === null ? je = el : Qe.sibling = el, Qe = el, Le = Kn;
      }
      if (Nt.done) return o(
        j,
        Le
      ), un && ha(j, Xe), je;
      if (Le === null) {
        for (; !Nt.done; Xe++, Nt = Y.next()) Nt = ne(j, Nt.value, ie), Nt !== null && (N = m(Nt, N, Xe), Qe === null ? je = Nt : Qe.sibling = Nt, Qe = Nt);
        return un && ha(j, Xe), je;
      }
      for (Le = f(j, Le); !Nt.done; Xe++, Nt = Y.next()) Nt = xe(Le, j, Xe, Nt.value, ie), Nt !== null && (n && Nt.alternate !== null && Le.delete(Nt.key === null ? Xe : Nt.key), N = m(Nt, N, Xe), Qe === null ? je = Nt : Qe.sibling = Nt, Qe = Nt);
      return n && Le.forEach(function(P0) {
        return r(j, P0);
      }), un && ha(j, Xe), je;
    }
    function An(j, N, Y, ie) {
      if (typeof Y == "object" && Y !== null && Y.type === ye && Y.key === null && (Y = Y.props.children), typeof Y == "object" && Y !== null) {
        switch (Y.$$typeof) {
          case be:
            e: {
              for (var je = Y.key, Qe = N; Qe !== null; ) {
                if (Qe.key === je) {
                  if (je = Y.type, je === ye) {
                    if (Qe.tag === 7) {
                      o(j, Qe.sibling), N = h(Qe, Y.props.children), N.return = j, j = N;
                      break e;
                    }
                  } else if (Qe.elementType === je || typeof je == "object" && je !== null && je.$$typeof === it && vm(je) === Qe.type) {
                    o(j, Qe.sibling), N = h(Qe, Y.props), N.ref = po(j, Qe, Y), N.return = j, j = N;
                    break e;
                  }
                  o(j, Qe);
                  break;
                } else r(j, Qe);
                Qe = Qe.sibling;
              }
              Y.type === ye ? (N = Do(Y.props.children, j.mode, ie, Y.key), N.return = j, j = N) : (ie = Pf(Y.type, Y.key, Y.props, null, j.mode, ie), ie.ref = po(j, N, Y), ie.return = j, j = ie);
            }
            return C(j);
          case le:
            e: {
              for (Qe = Y.key; N !== null; ) {
                if (N.key === Qe) if (N.tag === 4 && N.stateNode.containerInfo === Y.containerInfo && N.stateNode.implementation === Y.implementation) {
                  o(j, N.sibling), N = h(N, Y.children || []), N.return = j, j = N;
                  break e;
                } else {
                  o(j, N);
                  break;
                }
                else r(j, N);
                N = N.sibling;
              }
              N = Zs(Y, j.mode, ie), N.return = j, j = N;
            }
            return C(j);
          case it:
            return Qe = Y._init, An(j, N, Qe(Y._payload), ie);
        }
        if (In(Y)) return Ne(j, N, Y, ie);
        if (De(Y)) return Ue(j, N, Y, ie);
        wi(j, Y);
      }
      return typeof Y == "string" && Y !== "" || typeof Y == "number" ? (Y = "" + Y, N !== null && N.tag === 6 ? (o(j, N.sibling), N = h(N, Y), N.return = j, j = N) : (o(j, N), N = Bf(Y, j.mode, ie), N.return = j, j = N), C(j)) : o(j, N);
    }
    return An;
  }
  var hu = tf(!0), mm = tf(!1), Qi = dt(null), Gn = null, pe = null, Aa = null;
  function ma() {
    Aa = pe = Gn = null;
  }
  function _p(n) {
    var r = Qi.current;
    jt(Qi), n._currentValue = r;
  }
  function Rp(n, r, o) {
    for (; n !== null; ) {
      var f = n.alternate;
      if ((n.childLanes & r) !== r ? (n.childLanes |= r, f !== null && (f.childLanes |= r)) : f !== null && (f.childLanes & r) !== r && (f.childLanes |= r), n === o) break;
      n = n.return;
    }
  }
  function vu(n, r) {
    Gn = n, Aa = pe = null, n = n.dependencies, n !== null && n.firstContext !== null && (n.lanes & r && (ea = !0), n.firstContext = null);
  }
  function Ua(n) {
    var r = n._currentValue;
    if (Aa !== n) if (n = { context: n, memoizedValue: r, next: null }, pe === null) {
      if (Gn === null) throw Error(c(308));
      pe = n, Gn.dependencies = { lanes: 0, firstContext: n };
    } else pe = pe.next = n;
    return r;
  }
  var ho = null;
  function Hn(n) {
    ho === null ? ho = [n] : ho.push(n);
  }
  function ym(n, r, o, f) {
    var h = r.interleaved;
    return h === null ? (o.next = o, Hn(r)) : (o.next = h.next, h.next = o), r.interleaved = o, qi(n, f);
  }
  function qi(n, r) {
    n.lanes |= r;
    var o = n.alternate;
    for (o !== null && (o.lanes |= r), o = n, n = n.return; n !== null; ) n.childLanes |= r, o = n.alternate, o !== null && (o.childLanes |= r), o = n, n = n.return;
    return o.tag === 3 ? o.stateNode : null;
  }
  var Rl = !1;
  function nf(n) {
    n.updateQueue = { baseState: n.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function mu(n, r) {
    n = n.updateQueue, r.updateQueue === n && (r.updateQueue = { baseState: n.baseState, firstBaseUpdate: n.firstBaseUpdate, lastBaseUpdate: n.lastBaseUpdate, shared: n.shared, effects: n.effects });
  }
  function Zr(n, r) {
    return { eventTime: n, lane: r, tag: 0, payload: null, callback: null, next: null };
  }
  function Dl(n, r, o) {
    var f = n.updateQueue;
    if (f === null) return null;
    if (f = f.shared, Ct & 2) {
      var h = f.pending;
      return h === null ? r.next = r : (r.next = h.next, h.next = r), f.pending = r, qi(n, o);
    }
    return h = f.interleaved, h === null ? (r.next = r, Hn(f)) : (r.next = h.next, h.next = r), f.interleaved = r, qi(n, o);
  }
  function rf(n, r, o) {
    if (r = r.updateQueue, r !== null && (r = r.shared, (o & 4194240) !== 0)) {
      var f = r.lanes;
      f &= n.pendingLanes, o |= f, r.lanes = o, ds(n, o);
    }
  }
  function gm(n, r) {
    var o = n.updateQueue, f = n.alternate;
    if (f !== null && (f = f.updateQueue, o === f)) {
      var h = null, m = null;
      if (o = o.firstBaseUpdate, o !== null) {
        do {
          var C = { eventTime: o.eventTime, lane: o.lane, tag: o.tag, payload: o.payload, callback: o.callback, next: null };
          m === null ? h = m = C : m = m.next = C, o = o.next;
        } while (o !== null);
        m === null ? h = m = r : m = m.next = r;
      } else h = m = r;
      o = { baseState: f.baseState, firstBaseUpdate: h, lastBaseUpdate: m, shared: f.shared, effects: f.effects }, n.updateQueue = o;
      return;
    }
    n = o.lastBaseUpdate, n === null ? o.firstBaseUpdate = r : n.next = r, o.lastBaseUpdate = r;
  }
  function af(n, r, o, f) {
    var h = n.updateQueue;
    Rl = !1;
    var m = h.firstBaseUpdate, C = h.lastBaseUpdate, T = h.shared.pending;
    if (T !== null) {
      h.shared.pending = null;
      var k = T, B = k.next;
      k.next = null, C === null ? m = B : C.next = B, C = k;
      var ee = n.alternate;
      ee !== null && (ee = ee.updateQueue, T = ee.lastBaseUpdate, T !== C && (T === null ? ee.firstBaseUpdate = B : T.next = B, ee.lastBaseUpdate = k));
    }
    if (m !== null) {
      var ne = h.baseState;
      C = 0, ee = B = k = null, T = m;
      do {
        var Z = T.lane, xe = T.eventTime;
        if ((f & Z) === Z) {
          ee !== null && (ee = ee.next = {
            eventTime: xe,
            lane: 0,
            tag: T.tag,
            payload: T.payload,
            callback: T.callback,
            next: null
          });
          e: {
            var Ne = n, Ue = T;
            switch (Z = r, xe = o, Ue.tag) {
              case 1:
                if (Ne = Ue.payload, typeof Ne == "function") {
                  ne = Ne.call(xe, ne, Z);
                  break e;
                }
                ne = Ne;
                break e;
              case 3:
                Ne.flags = Ne.flags & -65537 | 128;
              case 0:
                if (Ne = Ue.payload, Z = typeof Ne == "function" ? Ne.call(xe, ne, Z) : Ne, Z == null) break e;
                ne = se({}, ne, Z);
                break e;
              case 2:
                Rl = !0;
            }
          }
          T.callback !== null && T.lane !== 0 && (n.flags |= 64, Z = h.effects, Z === null ? h.effects = [T] : Z.push(T));
        } else xe = { eventTime: xe, lane: Z, tag: T.tag, payload: T.payload, callback: T.callback, next: null }, ee === null ? (B = ee = xe, k = ne) : ee = ee.next = xe, C |= Z;
        if (T = T.next, T === null) {
          if (T = h.shared.pending, T === null) break;
          Z = T, T = Z.next, Z.next = null, h.lastBaseUpdate = Z, h.shared.pending = null;
        }
      } while (!0);
      if (ee === null && (k = ne), h.baseState = k, h.firstBaseUpdate = B, h.lastBaseUpdate = ee, r = h.shared.interleaved, r !== null) {
        h = r;
        do
          C |= h.lane, h = h.next;
        while (h !== r);
      } else m === null && (h.shared.lanes = 0);
      xo |= C, n.lanes = C, n.memoizedState = ne;
    }
  }
  function Sm(n, r, o) {
    if (n = r.effects, r.effects = null, n !== null) for (r = 0; r < n.length; r++) {
      var f = n[r], h = f.callback;
      if (h !== null) {
        if (f.callback = null, f = o, typeof h != "function") throw Error(c(191, h));
        h.call(f);
      }
    }
  }
  var Us = {}, si = dt(Us), yu = dt(Us), zs = dt(Us);
  function vo(n) {
    if (n === Us) throw Error(c(174));
    return n;
  }
  function Dp(n, r) {
    switch (Ht(zs, r), Ht(yu, n), Ht(si, Us), n = r.nodeType, n) {
      case 9:
      case 11:
        r = (r = r.documentElement) ? r.namespaceURI : an(null, "");
        break;
      default:
        n = n === 8 ? r.parentNode : r, r = n.namespaceURI || null, n = n.tagName, r = an(r, n);
    }
    jt(si), Ht(si, r);
  }
  function gu() {
    jt(si), jt(yu), jt(zs);
  }
  function Em(n) {
    vo(zs.current);
    var r = vo(si.current), o = an(r, n.type);
    r !== o && (Ht(yu, n), Ht(si, o));
  }
  function kp(n) {
    yu.current === n && (jt(si), jt(yu));
  }
  var hn = dt(0);
  function lf(n) {
    for (var r = n; r !== null; ) {
      if (r.tag === 13) {
        var o = r.memoizedState;
        if (o !== null && (o = o.dehydrated, o === null || o.data === "$?" || o.data === "$!")) return r;
      } else if (r.tag === 19 && r.memoizedProps.revealOrder !== void 0) {
        if (r.flags & 128) return r;
      } else if (r.child !== null) {
        r.child.return = r, r = r.child;
        continue;
      }
      if (r === n) break;
      for (; r.sibling === null; ) {
        if (r.return === null || r.return === n) return null;
        r = r.return;
      }
      r.sibling.return = r.return, r = r.sibling;
    }
    return null;
  }
  var of = [];
  function Op() {
    for (var n = 0; n < of.length; n++) of[n]._workInProgressVersionPrimary = null;
    of.length = 0;
  }
  var uf = O.ReactCurrentDispatcher, js = O.ReactCurrentBatchConfig, ze = 0, Fe = null, rt = null, Et = null, ya = !1, Su = !1, Fs = 0, x0 = 0;
  function kr() {
    throw Error(c(321));
  }
  function Hs(n, r) {
    if (r === null) return !1;
    for (var o = 0; o < r.length && o < n.length; o++) if (!Da(n[o], r[o])) return !1;
    return !0;
  }
  function K(n, r, o, f, h, m) {
    if (ze = m, Fe = r, r.memoizedState = null, r.updateQueue = null, r.lanes = 0, uf.current = n === null || n.memoizedState === null ? T0 : nn, n = o(f, h), Su) {
      m = 0;
      do {
        if (Su = !1, Fs = 0, 25 <= m) throw Error(c(301));
        m += 1, Et = rt = null, r.updateQueue = null, uf.current = bf, n = o(f, h);
      } while (Su);
    }
    if (uf.current = Or, r = rt !== null && rt.next !== null, ze = 0, Et = rt = Fe = null, ya = !1, r) throw Error(c(300));
    return n;
  }
  function Yn() {
    var n = Fs !== 0;
    return Fs = 0, n;
  }
  function Ve() {
    var n = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    return Et === null ? Fe.memoizedState = Et = n : Et = Et.next = n, Et;
  }
  function pr() {
    if (rt === null) {
      var n = Fe.alternate;
      n = n !== null ? n.memoizedState : null;
    } else n = rt.next;
    var r = Et === null ? Fe.memoizedState : Et.next;
    if (r !== null) Et = r, rt = n;
    else {
      if (n === null) throw Error(c(310));
      rt = n, n = { memoizedState: rt.memoizedState, baseState: rt.baseState, baseQueue: rt.baseQueue, queue: rt.queue, next: null }, Et === null ? Fe.memoizedState = Et = n : Et = Et.next = n;
    }
    return Et;
  }
  function ga(n, r) {
    return typeof r == "function" ? r(n) : r;
  }
  function Xi(n) {
    var r = pr(), o = r.queue;
    if (o === null) throw Error(c(311));
    o.lastRenderedReducer = n;
    var f = rt, h = f.baseQueue, m = o.pending;
    if (m !== null) {
      if (h !== null) {
        var C = h.next;
        h.next = m.next, m.next = C;
      }
      f.baseQueue = h = m, o.pending = null;
    }
    if (h !== null) {
      m = h.next, f = f.baseState;
      var T = C = null, k = null, B = m;
      do {
        var ee = B.lane;
        if ((ze & ee) === ee) k !== null && (k = k.next = { lane: 0, action: B.action, hasEagerState: B.hasEagerState, eagerState: B.eagerState, next: null }), f = B.hasEagerState ? B.eagerState : n(f, B.action);
        else {
          var ne = {
            lane: ee,
            action: B.action,
            hasEagerState: B.hasEagerState,
            eagerState: B.eagerState,
            next: null
          };
          k === null ? (T = k = ne, C = f) : k = k.next = ne, Fe.lanes |= ee, xo |= ee;
        }
        B = B.next;
      } while (B !== null && B !== m);
      k === null ? C = f : k.next = T, Da(f, r.memoizedState) || (ea = !0), r.memoizedState = f, r.baseState = C, r.baseQueue = k, o.lastRenderedState = f;
    }
    if (n = o.interleaved, n !== null) {
      h = n;
      do
        m = h.lane, Fe.lanes |= m, xo |= m, h = h.next;
      while (h !== n);
    } else h === null && (o.lanes = 0);
    return [r.memoizedState, o.dispatch];
  }
  function za(n) {
    var r = pr(), o = r.queue;
    if (o === null) throw Error(c(311));
    o.lastRenderedReducer = n;
    var f = o.dispatch, h = o.pending, m = r.memoizedState;
    if (h !== null) {
      o.pending = null;
      var C = h = h.next;
      do
        m = n(m, C.action), C = C.next;
      while (C !== h);
      Da(m, r.memoizedState) || (ea = !0), r.memoizedState = m, r.baseQueue === null && (r.baseState = m), o.lastRenderedState = m;
    }
    return [m, f];
  }
  function Eu() {
  }
  function mo(n, r) {
    var o = Fe, f = pr(), h = r(), m = !Da(f.memoizedState, h);
    if (m && (f.memoizedState = h, ea = !0), f = f.queue, Ys(cf.bind(null, o, f, n), [n]), f.getSnapshot !== r || m || Et !== null && Et.memoizedState.tag & 1) {
      if (o.flags |= 2048, yo(9, sf.bind(null, o, f, h, r), void 0, null), Rn === null) throw Error(c(349));
      ze & 30 || wu(o, r, h);
    }
    return h;
  }
  function wu(n, r, o) {
    n.flags |= 16384, n = { getSnapshot: r, value: o }, r = Fe.updateQueue, r === null ? (r = { lastEffect: null, stores: null }, Fe.updateQueue = r, r.stores = [n]) : (o = r.stores, o === null ? r.stores = [n] : o.push(n));
  }
  function sf(n, r, o, f) {
    r.value = o, r.getSnapshot = f, ff(r) && df(n);
  }
  function cf(n, r, o) {
    return o(function() {
      ff(r) && df(n);
    });
  }
  function ff(n) {
    var r = n.getSnapshot;
    n = n.value;
    try {
      var o = r();
      return !Da(n, o);
    } catch {
      return !0;
    }
  }
  function df(n) {
    var r = qi(n, 1);
    r !== null && En(r, n, 1, -1);
  }
  function pf(n) {
    var r = Ve();
    return typeof n == "function" && (n = n()), r.memoizedState = r.baseState = n, n = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: ga, lastRenderedState: n }, r.queue = n, n = n.dispatch = Ps.bind(null, Fe, n), [r.memoizedState, n];
  }
  function yo(n, r, o, f) {
    return n = { tag: n, create: r, destroy: o, deps: f, next: null }, r = Fe.updateQueue, r === null ? (r = { lastEffect: null, stores: null }, Fe.updateQueue = r, r.lastEffect = n.next = n) : (o = r.lastEffect, o === null ? r.lastEffect = n.next = n : (f = o.next, o.next = n, n.next = f, r.lastEffect = n)), n;
  }
  function hf() {
    return pr().memoizedState;
  }
  function Cu(n, r, o, f) {
    var h = Ve();
    Fe.flags |= n, h.memoizedState = yo(1 | r, o, void 0, f === void 0 ? null : f);
  }
  function bu(n, r, o, f) {
    var h = pr();
    f = f === void 0 ? null : f;
    var m = void 0;
    if (rt !== null) {
      var C = rt.memoizedState;
      if (m = C.destroy, f !== null && Hs(f, C.deps)) {
        h.memoizedState = yo(r, o, m, f);
        return;
      }
    }
    Fe.flags |= n, h.memoizedState = yo(1 | r, o, m, f);
  }
  function vf(n, r) {
    return Cu(8390656, 8, n, r);
  }
  function Ys(n, r) {
    return bu(2048, 8, n, r);
  }
  function mf(n, r) {
    return bu(4, 2, n, r);
  }
  function yf(n, r) {
    return bu(4, 4, n, r);
  }
  function gf(n, r) {
    if (typeof r == "function") return n = n(), r(n), function() {
      r(null);
    };
    if (r != null) return n = n(), r.current = n, function() {
      r.current = null;
    };
  }
  function Sf(n, r, o) {
    return o = o != null ? o.concat([n]) : null, bu(4, 4, gf.bind(null, r, n), o);
  }
  function xu() {
  }
  function go(n, r) {
    var o = pr();
    r = r === void 0 ? null : r;
    var f = o.memoizedState;
    return f !== null && r !== null && Hs(r, f[1]) ? f[0] : (o.memoizedState = [n, r], n);
  }
  function Ef(n, r) {
    var o = pr();
    r = r === void 0 ? null : r;
    var f = o.memoizedState;
    return f !== null && r !== null && Hs(r, f[1]) ? f[0] : (n = n(), o.memoizedState = [n, r], n);
  }
  function wf(n, r, o) {
    return ze & 21 ? (Da(o, r) || (o = Oc(), Fe.lanes |= o, xo |= o, n.baseState = !0), r) : (n.baseState && (n.baseState = !1, ea = !0), n.memoizedState = o);
  }
  function Mp(n, r) {
    var o = It;
    It = o !== 0 && 4 > o ? o : 4, n(!0);
    var f = js.transition;
    js.transition = {};
    try {
      n(!1), r();
    } finally {
      It = o, js.transition = f;
    }
  }
  function Cf() {
    return pr().memoizedState;
  }
  function wm(n, r, o) {
    var f = Ji(n);
    if (o = { lane: f, action: o, hasEagerState: !1, eagerState: null, next: null }, Np(n)) Tu(r, o);
    else if (o = ym(n, r, o, f), o !== null) {
      var h = sr();
      En(o, n, f, h), kl(o, r, f);
    }
  }
  function Ps(n, r, o) {
    var f = Ji(n), h = { lane: f, action: o, hasEagerState: !1, eagerState: null, next: null };
    if (Np(n)) Tu(r, h);
    else {
      var m = n.alternate;
      if (n.lanes === 0 && (m === null || m.lanes === 0) && (m = r.lastRenderedReducer, m !== null)) try {
        var C = r.lastRenderedState, T = m(C, o);
        if (h.hasEagerState = !0, h.eagerState = T, Da(T, C)) {
          var k = r.interleaved;
          k === null ? (h.next = h, Hn(r)) : (h.next = k.next, k.next = h), r.interleaved = h;
          return;
        }
      } catch {
      } finally {
      }
      o = ym(n, r, h, f), o !== null && (h = sr(), En(o, n, f, h), kl(o, r, f));
    }
  }
  function Np(n) {
    var r = n.alternate;
    return n === Fe || r !== null && r === Fe;
  }
  function Tu(n, r) {
    Su = ya = !0;
    var o = n.pending;
    o === null ? r.next = r : (r.next = o.next, o.next = r), n.pending = r;
  }
  function kl(n, r, o) {
    if (o & 4194240) {
      var f = r.lanes;
      f &= n.pendingLanes, o |= f, r.lanes = o, ds(n, o);
    }
  }
  var Or = { readContext: Ua, useCallback: kr, useContext: kr, useEffect: kr, useImperativeHandle: kr, useInsertionEffect: kr, useLayoutEffect: kr, useMemo: kr, useReducer: kr, useRef: kr, useState: kr, useDebugValue: kr, useDeferredValue: kr, useTransition: kr, useMutableSource: kr, useSyncExternalStore: kr, useId: kr, unstable_isNewReconciler: !1 }, T0 = { readContext: Ua, useCallback: function(n, r) {
    return Ve().memoizedState = [n, r === void 0 ? null : r], n;
  }, useContext: Ua, useEffect: vf, useImperativeHandle: function(n, r, o) {
    return o = o != null ? o.concat([n]) : null, Cu(
      4194308,
      4,
      gf.bind(null, r, n),
      o
    );
  }, useLayoutEffect: function(n, r) {
    return Cu(4194308, 4, n, r);
  }, useInsertionEffect: function(n, r) {
    return Cu(4, 2, n, r);
  }, useMemo: function(n, r) {
    var o = Ve();
    return r = r === void 0 ? null : r, n = n(), o.memoizedState = [n, r], n;
  }, useReducer: function(n, r, o) {
    var f = Ve();
    return r = o !== void 0 ? o(r) : r, f.memoizedState = f.baseState = r, n = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: n, lastRenderedState: r }, f.queue = n, n = n.dispatch = wm.bind(null, Fe, n), [f.memoizedState, n];
  }, useRef: function(n) {
    var r = Ve();
    return n = { current: n }, r.memoizedState = n;
  }, useState: pf, useDebugValue: xu, useDeferredValue: function(n) {
    return Ve().memoizedState = n;
  }, useTransition: function() {
    var n = pf(!1), r = n[0];
    return n = Mp.bind(null, n[1]), Ve().memoizedState = n, [r, n];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(n, r, o) {
    var f = Fe, h = Ve();
    if (un) {
      if (o === void 0) throw Error(c(407));
      o = o();
    } else {
      if (o = r(), Rn === null) throw Error(c(349));
      ze & 30 || wu(f, r, o);
    }
    h.memoizedState = o;
    var m = { value: o, getSnapshot: r };
    return h.queue = m, vf(cf.bind(
      null,
      f,
      m,
      n
    ), [n]), f.flags |= 2048, yo(9, sf.bind(null, f, m, o, r), void 0, null), o;
  }, useId: function() {
    var n = Ve(), r = Rn.identifierPrefix;
    if (un) {
      var o = Gi, f = dr;
      o = (f & ~(1 << 32 - Ta(f) - 1)).toString(32) + o, r = ":" + r + "R" + o, o = Fs++, 0 < o && (r += "H" + o.toString(32)), r += ":";
    } else o = x0++, r = ":" + r + "r" + o.toString(32) + ":";
    return n.memoizedState = r;
  }, unstable_isNewReconciler: !1 }, nn = {
    readContext: Ua,
    useCallback: go,
    useContext: Ua,
    useEffect: Ys,
    useImperativeHandle: Sf,
    useInsertionEffect: mf,
    useLayoutEffect: yf,
    useMemo: Ef,
    useReducer: Xi,
    useRef: hf,
    useState: function() {
      return Xi(ga);
    },
    useDebugValue: xu,
    useDeferredValue: function(n) {
      var r = pr();
      return wf(r, rt.memoizedState, n);
    },
    useTransition: function() {
      var n = Xi(ga)[0], r = pr().memoizedState;
      return [n, r];
    },
    useMutableSource: Eu,
    useSyncExternalStore: mo,
    useId: Cf,
    unstable_isNewReconciler: !1
  }, bf = { readContext: Ua, useCallback: go, useContext: Ua, useEffect: Ys, useImperativeHandle: Sf, useInsertionEffect: mf, useLayoutEffect: yf, useMemo: Ef, useReducer: za, useRef: hf, useState: function() {
    return za(ga);
  }, useDebugValue: xu, useDeferredValue: function(n) {
    var r = pr();
    return rt === null ? r.memoizedState = n : wf(r, rt.memoizedState, n);
  }, useTransition: function() {
    var n = za(ga)[0], r = pr().memoizedState;
    return [n, r];
  }, useMutableSource: Eu, useSyncExternalStore: mo, useId: Cf, unstable_isNewReconciler: !1 };
  function Jr(n, r) {
    if (n && n.defaultProps) {
      r = se({}, r), n = n.defaultProps;
      for (var o in n) r[o] === void 0 && (r[o] = n[o]);
      return r;
    }
    return r;
  }
  function So(n, r, o, f) {
    r = n.memoizedState, o = o(f, r), o = o == null ? r : se({}, r, o), n.memoizedState = o, n.lanes === 0 && (n.updateQueue.baseState = o);
  }
  var Eo = { isMounted: function(n) {
    return (n = n._reactInternals) ? Pe(n) === n : !1;
  }, enqueueSetState: function(n, r, o) {
    n = n._reactInternals;
    var f = sr(), h = Ji(n), m = Zr(f, h);
    m.payload = r, o != null && (m.callback = o), r = Dl(n, m, h), r !== null && (En(r, n, h, f), rf(r, n, h));
  }, enqueueReplaceState: function(n, r, o) {
    n = n._reactInternals;
    var f = sr(), h = Ji(n), m = Zr(f, h);
    m.tag = 1, m.payload = r, o != null && (m.callback = o), r = Dl(n, m, h), r !== null && (En(r, n, h, f), rf(r, n, h));
  }, enqueueForceUpdate: function(n, r) {
    n = n._reactInternals;
    var o = sr(), f = Ji(n), h = Zr(o, f);
    h.tag = 2, r != null && (h.callback = r), r = Dl(n, h, f), r !== null && (En(r, n, f, o), rf(r, n, f));
  } };
  function Cm(n, r, o, f, h, m, C) {
    return n = n.stateNode, typeof n.shouldComponentUpdate == "function" ? n.shouldComponentUpdate(f, m, C) : r.prototype && r.prototype.isPureReactComponent ? !bs(o, f) || !bs(h, m) : !0;
  }
  function bm(n, r, o) {
    var f = !1, h = Ei, m = r.contextType;
    return typeof m == "object" && m !== null ? m = Ua(m) : (h = pn(r) ? Gr : nt.current, f = r.contextTypes, m = (f = f != null) ? Oa(n, h) : Ei), r = new r(o, m), n.memoizedState = r.state !== null && r.state !== void 0 ? r.state : null, r.updater = Eo, n.stateNode = r, r._reactInternals = n, f && (n = n.stateNode, n.__reactInternalMemoizedUnmaskedChildContext = h, n.__reactInternalMemoizedMaskedChildContext = m), r;
  }
  function xm(n, r, o, f) {
    n = r.state, typeof r.componentWillReceiveProps == "function" && r.componentWillReceiveProps(o, f), typeof r.UNSAFE_componentWillReceiveProps == "function" && r.UNSAFE_componentWillReceiveProps(o, f), r.state !== n && Eo.enqueueReplaceState(r, r.state, null);
  }
  function Lp(n, r, o, f) {
    var h = n.stateNode;
    h.props = o, h.state = n.memoizedState, h.refs = {}, nf(n);
    var m = r.contextType;
    typeof m == "object" && m !== null ? h.context = Ua(m) : (m = pn(r) ? Gr : nt.current, h.context = Oa(n, m)), h.state = n.memoizedState, m = r.getDerivedStateFromProps, typeof m == "function" && (So(n, r, m, o), h.state = n.memoizedState), typeof r.getDerivedStateFromProps == "function" || typeof h.getSnapshotBeforeUpdate == "function" || typeof h.UNSAFE_componentWillMount != "function" && typeof h.componentWillMount != "function" || (r = h.state, typeof h.componentWillMount == "function" && h.componentWillMount(), typeof h.UNSAFE_componentWillMount == "function" && h.UNSAFE_componentWillMount(), r !== h.state && Eo.enqueueReplaceState(h, h.state, null), af(n, o, h, f), h.state = n.memoizedState), typeof h.componentDidMount == "function" && (n.flags |= 4194308);
  }
  function Ol(n, r) {
    try {
      var o = "", f = r;
      do
        o += fn(f), f = f.return;
      while (f);
      var h = o;
    } catch (m) {
      h = `
Error generating stack: ` + m.message + `
` + m.stack;
    }
    return { value: n, source: r, stack: h, digest: null };
  }
  function Ap(n, r, o) {
    return { value: n, source: null, stack: o ?? null, digest: r ?? null };
  }
  function Vs(n, r) {
    try {
      console.error(r.value);
    } catch (o) {
      setTimeout(function() {
        throw o;
      });
    }
  }
  var Tm = typeof WeakMap == "function" ? WeakMap : Map;
  function _m(n, r, o) {
    o = Zr(-1, o), o.tag = 3, o.payload = { element: null };
    var f = r.value;
    return o.callback = function() {
      Uf || (Uf = !0, Bp = f), Vs(n, r);
    }, o;
  }
  function Rm(n, r, o) {
    o = Zr(-1, o), o.tag = 3;
    var f = n.type.getDerivedStateFromError;
    if (typeof f == "function") {
      var h = r.value;
      o.payload = function() {
        return f(h);
      }, o.callback = function() {
        Vs(n, r);
      };
    }
    var m = n.stateNode;
    return m !== null && typeof m.componentDidCatch == "function" && (o.callback = function() {
      Vs(n, r), typeof f != "function" && (Ha === null ? Ha = /* @__PURE__ */ new Set([this]) : Ha.add(this));
      var C = r.stack;
      this.componentDidCatch(r.value, { componentStack: C !== null ? C : "" });
    }), o;
  }
  function Bs(n, r, o) {
    var f = n.pingCache;
    if (f === null) {
      f = n.pingCache = new Tm();
      var h = /* @__PURE__ */ new Set();
      f.set(r, h);
    } else h = f.get(r), h === void 0 && (h = /* @__PURE__ */ new Set(), f.set(r, h));
    h.has(o) || (h.add(o), n = U0.bind(null, n, r, o), r.then(n, n));
  }
  function Dm(n) {
    do {
      var r;
      if ((r = n.tag === 13) && (r = n.memoizedState, r = r !== null ? r.dehydrated !== null : !0), r) return n;
      n = n.return;
    } while (n !== null);
    return null;
  }
  function Up(n, r, o, f, h) {
    return n.mode & 1 ? (n.flags |= 65536, n.lanes = h, n) : (n === r ? n.flags |= 65536 : (n.flags |= 128, o.flags |= 131072, o.flags &= -52805, o.tag === 1 && (o.alternate === null ? o.tag = 17 : (r = Zr(-1, 1), r.tag = 2, Dl(o, r, 1))), o.lanes |= 1), n);
  }
  var km = O.ReactCurrentOwner, ea = !1;
  function Nn(n, r, o, f) {
    r.child = n === null ? mm(r, null, o, f) : hu(r, n.child, o, f);
  }
  function _u(n, r, o, f, h) {
    o = o.render;
    var m = r.ref;
    return vu(r, h), f = K(n, r, o, f, m, h), o = Yn(), n !== null && !ea ? (r.updateQueue = n.updateQueue, r.flags &= -2053, n.lanes &= ~h, Ln(n, r, h)) : (un && o && Xc(r), r.flags |= 1, Nn(n, r, f, h), r.child);
  }
  function Ml(n, r, o, f, h) {
    if (n === null) {
      var m = o.type;
      return typeof m == "function" && !Qp(m) && m.defaultProps === void 0 && o.compare === null && o.defaultProps === void 0 ? (r.tag = 15, r.type = m, xf(n, r, m, f, h)) : (n = Pf(o.type, null, f, r, r.mode, h), n.ref = r.ref, n.return = r, r.child = n);
    }
    if (m = n.child, !(n.lanes & h)) {
      var C = m.memoizedProps;
      if (o = o.compare, o = o !== null ? o : bs, o(C, f) && n.ref === r.ref) return Ln(n, r, h);
    }
    return r.flags |= 1, n = Al(m, f), n.ref = r.ref, n.return = r, r.child = n;
  }
  function xf(n, r, o, f, h) {
    if (n !== null) {
      var m = n.memoizedProps;
      if (bs(m, f) && n.ref === r.ref) if (ea = !1, r.pendingProps = f = m, (n.lanes & h) !== 0) n.flags & 131072 && (ea = !0);
      else return r.lanes = n.lanes, Ln(n, r, h);
    }
    return ct(n, r, o, f, h);
  }
  function ta(n, r, o) {
    var f = r.pendingProps, h = f.children, m = n !== null ? n.memoizedState : null;
    if (f.mode === "hidden") if (!(r.mode & 1)) r.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, Ht(zu, na), na |= o;
    else {
      if (!(o & 1073741824)) return n = m !== null ? m.baseLanes | o : o, r.lanes = r.childLanes = 1073741824, r.memoizedState = { baseLanes: n, cachePool: null, transitions: null }, r.updateQueue = null, Ht(zu, na), na |= n, null;
      r.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, f = m !== null ? m.baseLanes : o, Ht(zu, na), na |= f;
    }
    else m !== null ? (f = m.baseLanes | o, r.memoizedState = null) : f = o, Ht(zu, na), na |= f;
    return Nn(n, r, h, o), r.child;
  }
  function wo(n, r) {
    var o = r.ref;
    (n === null && o !== null || n !== null && n.ref !== o) && (r.flags |= 512, r.flags |= 2097152);
  }
  function ct(n, r, o, f, h) {
    var m = pn(o) ? Gr : nt.current;
    return m = Oa(r, m), vu(r, h), o = K(n, r, o, f, m, h), f = Yn(), n !== null && !ea ? (r.updateQueue = n.updateQueue, r.flags &= -2053, n.lanes &= ~h, Ln(n, r, h)) : (un && f && Xc(r), r.flags |= 1, Nn(n, r, o, h), r.child);
  }
  function Is(n, r, o, f, h) {
    if (pn(o)) {
      var m = !0;
      qc(r);
    } else m = !1;
    if (vu(r, h), r.stateNode === null) $s(n, r), bm(r, o, f), Lp(r, o, f, h), f = !0;
    else if (n === null) {
      var C = r.stateNode, T = r.memoizedProps;
      C.props = T;
      var k = C.context, B = o.contextType;
      typeof B == "object" && B !== null ? B = Ua(B) : (B = pn(o) ? Gr : nt.current, B = Oa(r, B));
      var ee = o.getDerivedStateFromProps, ne = typeof ee == "function" || typeof C.getSnapshotBeforeUpdate == "function";
      ne || typeof C.UNSAFE_componentWillReceiveProps != "function" && typeof C.componentWillReceiveProps != "function" || (T !== f || k !== B) && xm(r, C, f, B), Rl = !1;
      var Z = r.memoizedState;
      C.state = Z, af(r, f, C, h), k = r.memoizedState, T !== f || Z !== k || Tn.current || Rl ? (typeof ee == "function" && (So(r, o, ee, f), k = r.memoizedState), (T = Rl || Cm(r, o, T, f, Z, k, B)) ? (ne || typeof C.UNSAFE_componentWillMount != "function" && typeof C.componentWillMount != "function" || (typeof C.componentWillMount == "function" && C.componentWillMount(), typeof C.UNSAFE_componentWillMount == "function" && C.UNSAFE_componentWillMount()), typeof C.componentDidMount == "function" && (r.flags |= 4194308)) : (typeof C.componentDidMount == "function" && (r.flags |= 4194308), r.memoizedProps = f, r.memoizedState = k), C.props = f, C.state = k, C.context = B, f = T) : (typeof C.componentDidMount == "function" && (r.flags |= 4194308), f = !1);
    } else {
      C = r.stateNode, mu(n, r), T = r.memoizedProps, B = r.type === r.elementType ? T : Jr(r.type, T), C.props = B, ne = r.pendingProps, Z = C.context, k = o.contextType, typeof k == "object" && k !== null ? k = Ua(k) : (k = pn(o) ? Gr : nt.current, k = Oa(r, k));
      var xe = o.getDerivedStateFromProps;
      (ee = typeof xe == "function" || typeof C.getSnapshotBeforeUpdate == "function") || typeof C.UNSAFE_componentWillReceiveProps != "function" && typeof C.componentWillReceiveProps != "function" || (T !== ne || Z !== k) && xm(r, C, f, k), Rl = !1, Z = r.memoizedState, C.state = Z, af(r, f, C, h);
      var Ne = r.memoizedState;
      T !== ne || Z !== Ne || Tn.current || Rl ? (typeof xe == "function" && (So(r, o, xe, f), Ne = r.memoizedState), (B = Rl || Cm(r, o, B, f, Z, Ne, k) || !1) ? (ee || typeof C.UNSAFE_componentWillUpdate != "function" && typeof C.componentWillUpdate != "function" || (typeof C.componentWillUpdate == "function" && C.componentWillUpdate(f, Ne, k), typeof C.UNSAFE_componentWillUpdate == "function" && C.UNSAFE_componentWillUpdate(f, Ne, k)), typeof C.componentDidUpdate == "function" && (r.flags |= 4), typeof C.getSnapshotBeforeUpdate == "function" && (r.flags |= 1024)) : (typeof C.componentDidUpdate != "function" || T === n.memoizedProps && Z === n.memoizedState || (r.flags |= 4), typeof C.getSnapshotBeforeUpdate != "function" || T === n.memoizedProps && Z === n.memoizedState || (r.flags |= 1024), r.memoizedProps = f, r.memoizedState = Ne), C.props = f, C.state = Ne, C.context = k, f = B) : (typeof C.componentDidUpdate != "function" || T === n.memoizedProps && Z === n.memoizedState || (r.flags |= 4), typeof C.getSnapshotBeforeUpdate != "function" || T === n.memoizedProps && Z === n.memoizedState || (r.flags |= 1024), f = !1);
    }
    return Tf(n, r, o, f, m, h);
  }
  function Tf(n, r, o, f, h, m) {
    wo(n, r);
    var C = (r.flags & 128) !== 0;
    if (!f && !C) return h && fm(r, o, !1), Ln(n, r, m);
    f = r.stateNode, km.current = r;
    var T = C && typeof o.getDerivedStateFromError != "function" ? null : f.render();
    return r.flags |= 1, n !== null && C ? (r.child = hu(r, n.child, null, m), r.child = hu(r, null, T, m)) : Nn(n, r, T, m), r.memoizedState = f.state, h && fm(r, o, !0), r.child;
  }
  function _0(n) {
    var r = n.stateNode;
    r.pendingContext ? Tl(n, r.pendingContext, r.pendingContext !== r.context) : r.context && Tl(n, r.context, !1), Dp(n, r.containerInfo);
  }
  function Om(n, r, o, f, h) {
    return Sn(), Tp(h), r.flags |= 256, Nn(n, r, o, f), r.child;
  }
  var Ws = { dehydrated: null, treeContext: null, retryLane: 0 };
  function Co(n) {
    return { baseLanes: n, cachePool: null, transitions: null };
  }
  function Mm(n, r, o) {
    var f = r.pendingProps, h = hn.current, m = !1, C = (r.flags & 128) !== 0, T;
    if ((T = C) || (T = n !== null && n.memoizedState === null ? !1 : (h & 2) !== 0), T ? (m = !0, r.flags &= -129) : (n === null || n.memoizedState !== null) && (h |= 1), Ht(hn, h & 1), n === null)
      return Zc(r), n = r.memoizedState, n !== null && (n = n.dehydrated, n !== null) ? (r.mode & 1 ? n.data === "$!" ? r.lanes = 8 : r.lanes = 1073741824 : r.lanes = 1, null) : (C = f.children, n = f.fallback, m ? (f = r.mode, m = r.child, C = { mode: "hidden", children: C }, !(f & 1) && m !== null ? (m.childLanes = 0, m.pendingProps = C) : m = Vf(C, f, 0, null), n = Do(n, f, o, null), m.return = r, n.return = r, m.sibling = n, r.child = m, r.child.memoizedState = Co(o), r.memoizedState = Ws, n) : _f(r, C));
    if (h = n.memoizedState, h !== null && (T = h.dehydrated, T !== null)) return zp(n, r, C, f, T, h, o);
    if (m) {
      m = f.fallback, C = r.mode, h = n.child, T = h.sibling;
      var k = { mode: "hidden", children: f.children };
      return !(C & 1) && r.child !== h ? (f = r.child, f.childLanes = 0, f.pendingProps = k, r.deletions = null) : (f = Al(h, k), f.subtreeFlags = h.subtreeFlags & 14680064), T !== null ? m = Al(T, m) : (m = Do(m, C, o, null), m.flags |= 2), m.return = r, f.return = r, f.sibling = m, r.child = f, f = m, m = r.child, C = n.child.memoizedState, C = C === null ? Co(o) : { baseLanes: C.baseLanes | o, cachePool: null, transitions: C.transitions }, m.memoizedState = C, m.childLanes = n.childLanes & ~o, r.memoizedState = Ws, f;
    }
    return m = n.child, n = m.sibling, f = Al(m, { mode: "visible", children: f.children }), !(r.mode & 1) && (f.lanes = o), f.return = r, f.sibling = null, n !== null && (o = r.deletions, o === null ? (r.deletions = [n], r.flags |= 16) : o.push(n)), r.child = f, r.memoizedState = null, f;
  }
  function _f(n, r) {
    return r = Vf({ mode: "visible", children: r }, n.mode, 0, null), r.return = n, n.child = r;
  }
  function Rf(n, r, o, f) {
    return f !== null && Tp(f), hu(r, n.child, null, o), n = _f(r, r.pendingProps.children), n.flags |= 2, r.memoizedState = null, n;
  }
  function zp(n, r, o, f, h, m, C) {
    if (o)
      return r.flags & 256 ? (r.flags &= -257, f = Ap(Error(c(422))), Rf(n, r, C, f)) : r.memoizedState !== null ? (r.child = n.child, r.flags |= 128, null) : (m = f.fallback, h = r.mode, f = Vf({ mode: "visible", children: f.children }, h, 0, null), m = Do(m, h, C, null), m.flags |= 2, f.return = r, m.return = r, f.sibling = m, r.child = f, r.mode & 1 && hu(r, n.child, null, C), r.child.memoizedState = Co(C), r.memoizedState = Ws, m);
    if (!(r.mode & 1)) return Rf(n, r, C, null);
    if (h.data === "$!") {
      if (f = h.nextSibling && h.nextSibling.dataset, f) var T = f.dgst;
      return f = T, m = Error(c(419)), f = Ap(m, f, void 0), Rf(n, r, C, f);
    }
    if (T = (C & n.childLanes) !== 0, ea || T) {
      if (f = Rn, f !== null) {
        switch (C & -C) {
          case 4:
            h = 2;
            break;
          case 16:
            h = 8;
            break;
          case 64:
          case 128:
          case 256:
          case 512:
          case 1024:
          case 2048:
          case 4096:
          case 8192:
          case 16384:
          case 32768:
          case 65536:
          case 131072:
          case 262144:
          case 524288:
          case 1048576:
          case 2097152:
          case 4194304:
          case 8388608:
          case 16777216:
          case 33554432:
          case 67108864:
            h = 32;
            break;
          case 536870912:
            h = 268435456;
            break;
          default:
            h = 0;
        }
        h = h & (f.suspendedLanes | C) ? 0 : h, h !== 0 && h !== m.retryLane && (m.retryLane = h, qi(n, h), En(f, n, h, -1));
      }
      return Ks(), f = Ap(Error(c(421))), Rf(n, r, C, f);
    }
    return h.data === "$?" ? (r.flags |= 128, r.child = n.child, r = Gp.bind(null, n), h._reactRetry = r, null) : (n = m.treeContext, Kr = ui(h.nextSibling), va = r, un = !0, La = null, n !== null && (Xr[Dr++] = dr, Xr[Dr++] = Gi, Xr[Dr++] = Na, dr = n.id, Gi = n.overflow, Na = r), r = _f(r, f.children), r.flags |= 4096, r);
  }
  function Nm(n, r, o) {
    n.lanes |= r;
    var f = n.alternate;
    f !== null && (f.lanes |= r), Rp(n.return, r, o);
  }
  function Df(n, r, o, f, h) {
    var m = n.memoizedState;
    m === null ? n.memoizedState = { isBackwards: r, rendering: null, renderingStartTime: 0, last: f, tail: o, tailMode: h } : (m.isBackwards = r, m.rendering = null, m.renderingStartTime = 0, m.last = f, m.tail = o, m.tailMode = h);
  }
  function jp(n, r, o) {
    var f = r.pendingProps, h = f.revealOrder, m = f.tail;
    if (Nn(n, r, f.children, o), f = hn.current, f & 2) f = f & 1 | 2, r.flags |= 128;
    else {
      if (n !== null && n.flags & 128) e: for (n = r.child; n !== null; ) {
        if (n.tag === 13) n.memoizedState !== null && Nm(n, o, r);
        else if (n.tag === 19) Nm(n, o, r);
        else if (n.child !== null) {
          n.child.return = n, n = n.child;
          continue;
        }
        if (n === r) break e;
        for (; n.sibling === null; ) {
          if (n.return === null || n.return === r) break e;
          n = n.return;
        }
        n.sibling.return = n.return, n = n.sibling;
      }
      f &= 1;
    }
    if (Ht(hn, f), !(r.mode & 1)) r.memoizedState = null;
    else switch (h) {
      case "forwards":
        for (o = r.child, h = null; o !== null; ) n = o.alternate, n !== null && lf(n) === null && (h = o), o = o.sibling;
        o = h, o === null ? (h = r.child, r.child = null) : (h = o.sibling, o.sibling = null), Df(r, !1, h, o, m);
        break;
      case "backwards":
        for (o = null, h = r.child, r.child = null; h !== null; ) {
          if (n = h.alternate, n !== null && lf(n) === null) {
            r.child = h;
            break;
          }
          n = h.sibling, h.sibling = o, o = h, h = n;
        }
        Df(r, !0, o, null, m);
        break;
      case "together":
        Df(r, !1, null, null, void 0);
        break;
      default:
        r.memoizedState = null;
    }
    return r.child;
  }
  function $s(n, r) {
    !(r.mode & 1) && n !== null && (n.alternate = null, r.alternate = null, r.flags |= 2);
  }
  function Ln(n, r, o) {
    if (n !== null && (r.dependencies = n.dependencies), xo |= r.lanes, !(o & r.childLanes)) return null;
    if (n !== null && r.child !== n.child) throw Error(c(153));
    if (r.child !== null) {
      for (n = r.child, o = Al(n, n.pendingProps), r.child = o, o.return = r; n.sibling !== null; ) n = n.sibling, o = o.sibling = Al(n, n.pendingProps), o.return = r;
      o.sibling = null;
    }
    return r.child;
  }
  function Ki(n, r, o) {
    switch (r.tag) {
      case 3:
        _0(r), Sn();
        break;
      case 5:
        Em(r);
        break;
      case 1:
        pn(r.type) && qc(r);
        break;
      case 4:
        Dp(r, r.stateNode.containerInfo);
        break;
      case 10:
        var f = r.type._context, h = r.memoizedProps.value;
        Ht(Qi, f._currentValue), f._currentValue = h;
        break;
      case 13:
        if (f = r.memoizedState, f !== null)
          return f.dehydrated !== null ? (Ht(hn, hn.current & 1), r.flags |= 128, null) : o & r.child.childLanes ? Mm(n, r, o) : (Ht(hn, hn.current & 1), n = Ln(n, r, o), n !== null ? n.sibling : null);
        Ht(hn, hn.current & 1);
        break;
      case 19:
        if (f = (o & r.childLanes) !== 0, n.flags & 128) {
          if (f) return jp(n, r, o);
          r.flags |= 128;
        }
        if (h = r.memoizedState, h !== null && (h.rendering = null, h.tail = null, h.lastEffect = null), Ht(hn, hn.current), f) break;
        return null;
      case 22:
      case 23:
        return r.lanes = 0, ta(n, r, o);
    }
    return Ln(n, r, o);
  }
  var Ci, Ru, Du, ja;
  Ci = function(n, r) {
    for (var o = r.child; o !== null; ) {
      if (o.tag === 5 || o.tag === 6) n.appendChild(o.stateNode);
      else if (o.tag !== 4 && o.child !== null) {
        o.child.return = o, o = o.child;
        continue;
      }
      if (o === r) break;
      for (; o.sibling === null; ) {
        if (o.return === null || o.return === r) return;
        o = o.return;
      }
      o.sibling.return = o.return, o = o.sibling;
    }
  }, Ru = function() {
  }, Du = function(n, r, o, f) {
    var h = n.memoizedProps;
    if (h !== f) {
      n = r.stateNode, vo(si.current);
      var m = null;
      switch (o) {
        case "input":
          h = vt(n, h), f = vt(n, f), m = [];
          break;
        case "select":
          h = se({}, h, { value: void 0 }), f = se({}, f, { value: void 0 }), m = [];
          break;
        case "textarea":
          h = fr(n, h), f = fr(n, f), m = [];
          break;
        default:
          typeof h.onClick != "function" && typeof f.onClick == "function" && (n.onclick = Qc);
      }
      ke(o, f);
      var C;
      o = null;
      for (B in h) if (!f.hasOwnProperty(B) && h.hasOwnProperty(B) && h[B] != null) if (B === "style") {
        var T = h[B];
        for (C in T) T.hasOwnProperty(C) && (o || (o = {}), o[C] = "");
      } else B !== "dangerouslySetInnerHTML" && B !== "children" && B !== "suppressContentEditableWarning" && B !== "suppressHydrationWarning" && B !== "autoFocus" && (y.hasOwnProperty(B) ? m || (m = []) : (m = m || []).push(B, null));
      for (B in f) {
        var k = f[B];
        if (T = h != null ? h[B] : void 0, f.hasOwnProperty(B) && k !== T && (k != null || T != null)) if (B === "style") if (T) {
          for (C in T) !T.hasOwnProperty(C) || k && k.hasOwnProperty(C) || (o || (o = {}), o[C] = "");
          for (C in k) k.hasOwnProperty(C) && T[C] !== k[C] && (o || (o = {}), o[C] = k[C]);
        } else o || (m || (m = []), m.push(
          B,
          o
        )), o = k;
        else B === "dangerouslySetInnerHTML" ? (k = k ? k.__html : void 0, T = T ? T.__html : void 0, k != null && T !== k && (m = m || []).push(B, k)) : B === "children" ? typeof k != "string" && typeof k != "number" || (m = m || []).push(B, "" + k) : B !== "suppressContentEditableWarning" && B !== "suppressHydrationWarning" && (y.hasOwnProperty(B) ? (k != null && B === "onScroll" && en("scroll", n), m || T === k || (m = [])) : (m = m || []).push(B, k));
      }
      o && (m = m || []).push("style", o);
      var B = m;
      (r.updateQueue = B) && (r.flags |= 4);
    }
  }, ja = function(n, r, o, f) {
    o !== f && (r.flags |= 4);
  };
  function _n(n, r) {
    if (!un) switch (n.tailMode) {
      case "hidden":
        r = n.tail;
        for (var o = null; r !== null; ) r.alternate !== null && (o = r), r = r.sibling;
        o === null ? n.tail = null : o.sibling = null;
        break;
      case "collapsed":
        o = n.tail;
        for (var f = null; o !== null; ) o.alternate !== null && (f = o), o = o.sibling;
        f === null ? r || n.tail === null ? n.tail = null : n.tail.sibling = null : f.sibling = null;
    }
  }
  function Mr(n) {
    var r = n.alternate !== null && n.alternate.child === n.child, o = 0, f = 0;
    if (r) for (var h = n.child; h !== null; ) o |= h.lanes | h.childLanes, f |= h.subtreeFlags & 14680064, f |= h.flags & 14680064, h.return = n, h = h.sibling;
    else for (h = n.child; h !== null; ) o |= h.lanes | h.childLanes, f |= h.subtreeFlags, f |= h.flags, h.return = n, h = h.sibling;
    return n.subtreeFlags |= f, n.childLanes = o, r;
  }
  function R0(n, r, o) {
    var f = r.pendingProps;
    switch (bp(r), r.tag) {
      case 2:
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return Mr(r), null;
      case 1:
        return pn(r.type) && Ma(), Mr(r), null;
      case 3:
        return f = r.stateNode, gu(), jt(Tn), jt(nt), Op(), f.pendingContext && (f.context = f.pendingContext, f.pendingContext = null), (n === null || n.child === null) && (Jc(r) ? r.flags |= 4 : n === null || n.memoizedState.isDehydrated && !(r.flags & 256) || (r.flags |= 1024, La !== null && (Ip(La), La = null))), Ru(n, r), Mr(r), null;
      case 5:
        kp(r);
        var h = vo(zs.current);
        if (o = r.type, n !== null && r.stateNode != null) Du(n, r, o, f, h), n.ref !== r.ref && (r.flags |= 512, r.flags |= 2097152);
        else {
          if (!f) {
            if (r.stateNode === null) throw Error(c(166));
            return Mr(r), null;
          }
          if (n = vo(si.current), Jc(r)) {
            f = r.stateNode, o = r.type;
            var m = r.memoizedProps;
            switch (f[Si] = r, f[co] = m, n = (r.mode & 1) !== 0, o) {
              case "dialog":
                en("cancel", f), en("close", f);
                break;
              case "iframe":
              case "object":
              case "embed":
                en("load", f);
                break;
              case "video":
              case "audio":
                for (h = 0; h < Rs.length; h++) en(Rs[h], f);
                break;
              case "source":
                en("error", f);
                break;
              case "img":
              case "image":
              case "link":
                en(
                  "error",
                  f
                ), en("load", f);
                break;
              case "details":
                en("toggle", f);
                break;
              case "input":
                Gt(f, m), en("invalid", f);
                break;
              case "select":
                f._wrapperState = { wasMultiple: !!m.multiple }, en("invalid", f);
                break;
              case "textarea":
                Mn(f, m), en("invalid", f);
            }
            ke(o, m), h = null;
            for (var C in m) if (m.hasOwnProperty(C)) {
              var T = m[C];
              C === "children" ? typeof T == "string" ? f.textContent !== T && (m.suppressHydrationWarning !== !0 && Gc(f.textContent, T, n), h = ["children", T]) : typeof T == "number" && f.textContent !== "" + T && (m.suppressHydrationWarning !== !0 && Gc(
                f.textContent,
                T,
                n
              ), h = ["children", "" + T]) : y.hasOwnProperty(C) && T != null && C === "onScroll" && en("scroll", f);
            }
            switch (o) {
              case "input":
                yn(f), Bn(f, m, !0);
                break;
              case "textarea":
                yn(f), tr(f);
                break;
              case "select":
              case "option":
                break;
              default:
                typeof m.onClick == "function" && (f.onclick = Qc);
            }
            f = h, r.updateQueue = f, f !== null && (r.flags |= 4);
          } else {
            C = h.nodeType === 9 ? h : h.ownerDocument, n === "http://www.w3.org/1999/xhtml" && (n = Tr(o)), n === "http://www.w3.org/1999/xhtml" ? o === "script" ? (n = C.createElement("div"), n.innerHTML = "<script><\/script>", n = n.removeChild(n.firstChild)) : typeof f.is == "string" ? n = C.createElement(o, { is: f.is }) : (n = C.createElement(o), o === "select" && (C = n, f.multiple ? C.multiple = !0 : f.size && (C.size = f.size))) : n = C.createElementNS(n, o), n[Si] = r, n[co] = f, Ci(n, r, !1, !1), r.stateNode = n;
            e: {
              switch (C = qe(o, f), o) {
                case "dialog":
                  en("cancel", n), en("close", n), h = f;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  en("load", n), h = f;
                  break;
                case "video":
                case "audio":
                  for (h = 0; h < Rs.length; h++) en(Rs[h], n);
                  h = f;
                  break;
                case "source":
                  en("error", n), h = f;
                  break;
                case "img":
                case "image":
                case "link":
                  en(
                    "error",
                    n
                  ), en("load", n), h = f;
                  break;
                case "details":
                  en("toggle", n), h = f;
                  break;
                case "input":
                  Gt(n, f), h = vt(n, f), en("invalid", n);
                  break;
                case "option":
                  h = f;
                  break;
                case "select":
                  n._wrapperState = { wasMultiple: !!f.multiple }, h = se({}, f, { value: void 0 }), en("invalid", n);
                  break;
                case "textarea":
                  Mn(n, f), h = fr(n, f), en("invalid", n);
                  break;
                default:
                  h = f;
              }
              ke(o, h), T = h;
              for (m in T) if (T.hasOwnProperty(m)) {
                var k = T[m];
                m === "style" ? P(n, k) : m === "dangerouslySetInnerHTML" ? (k = k ? k.__html : void 0, k != null && mi(n, k)) : m === "children" ? typeof k == "string" ? (o !== "textarea" || k !== "") && sa(n, k) : typeof k == "number" && sa(n, "" + k) : m !== "suppressContentEditableWarning" && m !== "suppressHydrationWarning" && m !== "autoFocus" && (y.hasOwnProperty(m) ? k != null && m === "onScroll" && en("scroll", n) : k != null && Se(n, m, k, C));
              }
              switch (o) {
                case "input":
                  yn(n), Bn(n, f, !1);
                  break;
                case "textarea":
                  yn(n), tr(n);
                  break;
                case "option":
                  f.value != null && n.setAttribute("value", "" + $t(f.value));
                  break;
                case "select":
                  n.multiple = !!f.multiple, m = f.value, m != null ? Wn(n, !!f.multiple, m, !1) : f.defaultValue != null && Wn(
                    n,
                    !!f.multiple,
                    f.defaultValue,
                    !0
                  );
                  break;
                default:
                  typeof h.onClick == "function" && (n.onclick = Qc);
              }
              switch (o) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  f = !!f.autoFocus;
                  break e;
                case "img":
                  f = !0;
                  break e;
                default:
                  f = !1;
              }
            }
            f && (r.flags |= 4);
          }
          r.ref !== null && (r.flags |= 512, r.flags |= 2097152);
        }
        return Mr(r), null;
      case 6:
        if (n && r.stateNode != null) ja(n, r, n.memoizedProps, f);
        else {
          if (typeof f != "string" && r.stateNode === null) throw Error(c(166));
          if (o = vo(zs.current), vo(si.current), Jc(r)) {
            if (f = r.stateNode, o = r.memoizedProps, f[Si] = r, (m = f.nodeValue !== o) && (n = va, n !== null)) switch (n.tag) {
              case 3:
                Gc(f.nodeValue, o, (n.mode & 1) !== 0);
                break;
              case 5:
                n.memoizedProps.suppressHydrationWarning !== !0 && Gc(f.nodeValue, o, (n.mode & 1) !== 0);
            }
            m && (r.flags |= 4);
          } else f = (o.nodeType === 9 ? o : o.ownerDocument).createTextNode(f), f[Si] = r, r.stateNode = f;
        }
        return Mr(r), null;
      case 13:
        if (jt(hn), f = r.memoizedState, n === null || n.memoizedState !== null && n.memoizedState.dehydrated !== null) {
          if (un && Kr !== null && r.mode & 1 && !(r.flags & 128)) hm(), Sn(), r.flags |= 98560, m = !1;
          else if (m = Jc(r), f !== null && f.dehydrated !== null) {
            if (n === null) {
              if (!m) throw Error(c(318));
              if (m = r.memoizedState, m = m !== null ? m.dehydrated : null, !m) throw Error(c(317));
              m[Si] = r;
            } else Sn(), !(r.flags & 128) && (r.memoizedState = null), r.flags |= 4;
            Mr(r), m = !1;
          } else La !== null && (Ip(La), La = null), m = !0;
          if (!m) return r.flags & 65536 ? r : null;
        }
        return r.flags & 128 ? (r.lanes = o, r) : (f = f !== null, f !== (n !== null && n.memoizedState !== null) && f && (r.child.flags |= 8192, r.mode & 1 && (n === null || hn.current & 1 ? qn === 0 && (qn = 3) : Ks())), r.updateQueue !== null && (r.flags |= 4), Mr(r), null);
      case 4:
        return gu(), Ru(n, r), n === null && fu(r.stateNode.containerInfo), Mr(r), null;
      case 10:
        return _p(r.type._context), Mr(r), null;
      case 17:
        return pn(r.type) && Ma(), Mr(r), null;
      case 19:
        if (jt(hn), m = r.memoizedState, m === null) return Mr(r), null;
        if (f = (r.flags & 128) !== 0, C = m.rendering, C === null) if (f) _n(m, !1);
        else {
          if (qn !== 0 || n !== null && n.flags & 128) for (n = r.child; n !== null; ) {
            if (C = lf(n), C !== null) {
              for (r.flags |= 128, _n(m, !1), f = C.updateQueue, f !== null && (r.updateQueue = f, r.flags |= 4), r.subtreeFlags = 0, f = o, o = r.child; o !== null; ) m = o, n = f, m.flags &= 14680066, C = m.alternate, C === null ? (m.childLanes = 0, m.lanes = n, m.child = null, m.subtreeFlags = 0, m.memoizedProps = null, m.memoizedState = null, m.updateQueue = null, m.dependencies = null, m.stateNode = null) : (m.childLanes = C.childLanes, m.lanes = C.lanes, m.child = C.child, m.subtreeFlags = 0, m.deletions = null, m.memoizedProps = C.memoizedProps, m.memoizedState = C.memoizedState, m.updateQueue = C.updateQueue, m.type = C.type, n = C.dependencies, m.dependencies = n === null ? null : { lanes: n.lanes, firstContext: n.firstContext }), o = o.sibling;
              return Ht(hn, hn.current & 1 | 2), r.child;
            }
            n = n.sibling;
          }
          m.tail !== null && Ft() > Fu && (r.flags |= 128, f = !0, _n(m, !1), r.lanes = 4194304);
        }
        else {
          if (!f) if (n = lf(C), n !== null) {
            if (r.flags |= 128, f = !0, o = n.updateQueue, o !== null && (r.updateQueue = o, r.flags |= 4), _n(m, !0), m.tail === null && m.tailMode === "hidden" && !C.alternate && !un) return Mr(r), null;
          } else 2 * Ft() - m.renderingStartTime > Fu && o !== 1073741824 && (r.flags |= 128, f = !0, _n(m, !1), r.lanes = 4194304);
          m.isBackwards ? (C.sibling = r.child, r.child = C) : (o = m.last, o !== null ? o.sibling = C : r.child = C, m.last = C);
        }
        return m.tail !== null ? (r = m.tail, m.rendering = r, m.tail = r.sibling, m.renderingStartTime = Ft(), r.sibling = null, o = hn.current, Ht(hn, f ? o & 1 | 2 : o & 1), r) : (Mr(r), null);
      case 22:
      case 23:
        return Hf(), f = r.memoizedState !== null, n !== null && n.memoizedState !== null !== f && (r.flags |= 8192), f && r.mode & 1 ? na & 1073741824 && (Mr(r), r.subtreeFlags & 6 && (r.flags |= 8192)) : Mr(r), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(c(156, r.tag));
  }
  function D0(n, r) {
    switch (bp(r), r.tag) {
      case 1:
        return pn(r.type) && Ma(), n = r.flags, n & 65536 ? (r.flags = n & -65537 | 128, r) : null;
      case 3:
        return gu(), jt(Tn), jt(nt), Op(), n = r.flags, n & 65536 && !(n & 128) ? (r.flags = n & -65537 | 128, r) : null;
      case 5:
        return kp(r), null;
      case 13:
        if (jt(hn), n = r.memoizedState, n !== null && n.dehydrated !== null) {
          if (r.alternate === null) throw Error(c(340));
          Sn();
        }
        return n = r.flags, n & 65536 ? (r.flags = n & -65537 | 128, r) : null;
      case 19:
        return jt(hn), null;
      case 4:
        return gu(), null;
      case 10:
        return _p(r.type._context), null;
      case 22:
      case 23:
        return Hf(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var ku = !1, hr = !1, kf = typeof WeakSet == "function" ? WeakSet : Set, Re = null;
  function Ou(n, r) {
    var o = n.ref;
    if (o !== null) if (typeof o == "function") try {
      o(null);
    } catch (f) {
      Dn(n, r, f);
    }
    else o.current = null;
  }
  function Fp(n, r, o) {
    try {
      o();
    } catch (f) {
      Dn(n, r, f);
    }
  }
  var Of = !1;
  function k0(n, r) {
    if (vp = ro, n = Vc(), Bi(n)) {
      if ("selectionStart" in n) var o = { start: n.selectionStart, end: n.selectionEnd };
      else e: {
        o = (o = n.ownerDocument) && o.defaultView || window;
        var f = o.getSelection && o.getSelection();
        if (f && f.rangeCount !== 0) {
          o = f.anchorNode;
          var h = f.anchorOffset, m = f.focusNode;
          f = f.focusOffset;
          try {
            o.nodeType, m.nodeType;
          } catch {
            o = null;
            break e;
          }
          var C = 0, T = -1, k = -1, B = 0, ee = 0, ne = n, Z = null;
          t: for (; ; ) {
            for (var xe; ne !== o || h !== 0 && ne.nodeType !== 3 || (T = C + h), ne !== m || f !== 0 && ne.nodeType !== 3 || (k = C + f), ne.nodeType === 3 && (C += ne.nodeValue.length), (xe = ne.firstChild) !== null; )
              Z = ne, ne = xe;
            for (; ; ) {
              if (ne === n) break t;
              if (Z === o && ++B === h && (T = C), Z === m && ++ee === f && (k = C), (xe = ne.nextSibling) !== null) break;
              ne = Z, Z = ne.parentNode;
            }
            ne = xe;
          }
          o = T === -1 || k === -1 ? null : { start: T, end: k };
        } else o = null;
      }
      o = o || { start: 0, end: 0 };
    } else o = null;
    for (uo = { focusedElem: n, selectionRange: o }, ro = !1, Re = r; Re !== null; ) if (r = Re, n = r.child, (r.subtreeFlags & 1028) !== 0 && n !== null) n.return = r, Re = n;
    else for (; Re !== null; ) {
      r = Re;
      try {
        var Ne = r.alternate;
        if (r.flags & 1024) switch (r.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (Ne !== null) {
              var Ue = Ne.memoizedProps, An = Ne.memoizedState, j = r.stateNode, N = j.getSnapshotBeforeUpdate(r.elementType === r.type ? Ue : Jr(r.type, Ue), An);
              j.__reactInternalSnapshotBeforeUpdate = N;
            }
            break;
          case 3:
            var Y = r.stateNode.containerInfo;
            Y.nodeType === 1 ? Y.textContent = "" : Y.nodeType === 9 && Y.documentElement && Y.removeChild(Y.documentElement);
            break;
          case 5:
          case 6:
          case 4:
          case 17:
            break;
          default:
            throw Error(c(163));
        }
      } catch (ie) {
        Dn(r, r.return, ie);
      }
      if (n = r.sibling, n !== null) {
        n.return = r.return, Re = n;
        break;
      }
      Re = r.return;
    }
    return Ne = Of, Of = !1, Ne;
  }
  function Mu(n, r, o) {
    var f = r.updateQueue;
    if (f = f !== null ? f.lastEffect : null, f !== null) {
      var h = f = f.next;
      do {
        if ((h.tag & n) === n) {
          var m = h.destroy;
          h.destroy = void 0, m !== void 0 && Fp(r, o, m);
        }
        h = h.next;
      } while (h !== f);
    }
  }
  function Mf(n, r) {
    if (r = r.updateQueue, r = r !== null ? r.lastEffect : null, r !== null) {
      var o = r = r.next;
      do {
        if ((o.tag & n) === n) {
          var f = o.create;
          o.destroy = f();
        }
        o = o.next;
      } while (o !== r);
    }
  }
  function Nf(n) {
    var r = n.ref;
    if (r !== null) {
      var o = n.stateNode;
      switch (n.tag) {
        case 5:
          n = o;
          break;
        default:
          n = o;
      }
      typeof r == "function" ? r(n) : r.current = n;
    }
  }
  function Lm(n) {
    var r = n.alternate;
    r !== null && (n.alternate = null, Lm(r)), n.child = null, n.deletions = null, n.sibling = null, n.tag === 5 && (r = n.stateNode, r !== null && (delete r[Si], delete r[co], delete r[gp], delete r[b0], delete r[Sp])), n.stateNode = null, n.return = null, n.dependencies = null, n.memoizedProps = null, n.memoizedState = null, n.pendingProps = null, n.stateNode = null, n.updateQueue = null;
  }
  function Hp(n) {
    return n.tag === 5 || n.tag === 3 || n.tag === 4;
  }
  function Am(n) {
    e: for (; ; ) {
      for (; n.sibling === null; ) {
        if (n.return === null || Hp(n.return)) return null;
        n = n.return;
      }
      for (n.sibling.return = n.return, n = n.sibling; n.tag !== 5 && n.tag !== 6 && n.tag !== 18; ) {
        if (n.flags & 2 || n.child === null || n.tag === 4) continue e;
        n.child.return = n, n = n.child;
      }
      if (!(n.flags & 2)) return n.stateNode;
    }
  }
  function Gs(n, r, o) {
    var f = n.tag;
    if (f === 5 || f === 6) n = n.stateNode, r ? o.nodeType === 8 ? o.parentNode.insertBefore(n, r) : o.insertBefore(n, r) : (o.nodeType === 8 ? (r = o.parentNode, r.insertBefore(n, o)) : (r = o, r.appendChild(n)), o = o._reactRootContainer, o != null || r.onclick !== null || (r.onclick = Qc));
    else if (f !== 4 && (n = n.child, n !== null)) for (Gs(n, r, o), n = n.sibling; n !== null; ) Gs(n, r, o), n = n.sibling;
  }
  function Nu(n, r, o) {
    var f = n.tag;
    if (f === 5 || f === 6) n = n.stateNode, r ? o.insertBefore(n, r) : o.appendChild(n);
    else if (f !== 4 && (n = n.child, n !== null)) for (Nu(n, r, o), n = n.sibling; n !== null; ) Nu(n, r, o), n = n.sibling;
  }
  var vn = null, or = !1;
  function Lr(n, r, o) {
    for (o = o.child; o !== null; ) Lu(n, r, o), o = o.sibling;
  }
  function Lu(n, r, o) {
    if (ri && typeof ri.onCommitFiberUnmount == "function") try {
      ri.onCommitFiberUnmount(fs, o);
    } catch {
    }
    switch (o.tag) {
      case 5:
        hr || Ou(o, r);
      case 6:
        var f = vn, h = or;
        vn = null, Lr(n, r, o), vn = f, or = h, vn !== null && (or ? (n = vn, o = o.stateNode, n.nodeType === 8 ? n.parentNode.removeChild(o) : n.removeChild(o)) : vn.removeChild(o.stateNode));
        break;
      case 18:
        vn !== null && (or ? (n = vn, o = o.stateNode, n.nodeType === 8 ? Cl(n.parentNode, o) : n.nodeType === 1 && Cl(n, o), ms(n)) : Cl(vn, o.stateNode));
        break;
      case 4:
        f = vn, h = or, vn = o.stateNode.containerInfo, or = !0, Lr(n, r, o), vn = f, or = h;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!hr && (f = o.updateQueue, f !== null && (f = f.lastEffect, f !== null))) {
          h = f = f.next;
          do {
            var m = h, C = m.destroy;
            m = m.tag, C !== void 0 && (m & 2 || m & 4) && Fp(o, r, C), h = h.next;
          } while (h !== f);
        }
        Lr(n, r, o);
        break;
      case 1:
        if (!hr && (Ou(o, r), f = o.stateNode, typeof f.componentWillUnmount == "function")) try {
          f.props = o.memoizedProps, f.state = o.memoizedState, f.componentWillUnmount();
        } catch (T) {
          Dn(o, r, T);
        }
        Lr(n, r, o);
        break;
      case 21:
        Lr(n, r, o);
        break;
      case 22:
        o.mode & 1 ? (hr = (f = hr) || o.memoizedState !== null, Lr(n, r, o), hr = f) : Lr(n, r, o);
        break;
      default:
        Lr(n, r, o);
    }
  }
  function Au(n) {
    var r = n.updateQueue;
    if (r !== null) {
      n.updateQueue = null;
      var o = n.stateNode;
      o === null && (o = n.stateNode = new kf()), r.forEach(function(f) {
        var h = z0.bind(null, n, f);
        o.has(f) || (o.add(f), f.then(h, h));
      });
    }
  }
  function ur(n, r) {
    var o = r.deletions;
    if (o !== null) for (var f = 0; f < o.length; f++) {
      var h = o[f];
      try {
        var m = n, C = r, T = C;
        e: for (; T !== null; ) {
          switch (T.tag) {
            case 5:
              vn = T.stateNode, or = !1;
              break e;
            case 3:
              vn = T.stateNode.containerInfo, or = !0;
              break e;
            case 4:
              vn = T.stateNode.containerInfo, or = !0;
              break e;
          }
          T = T.return;
        }
        if (vn === null) throw Error(c(160));
        Lu(m, C, h), vn = null, or = !1;
        var k = h.alternate;
        k !== null && (k.return = null), h.return = null;
      } catch (B) {
        Dn(h, r, B);
      }
    }
    if (r.subtreeFlags & 12854) for (r = r.child; r !== null; ) Um(r, n), r = r.sibling;
  }
  function Um(n, r) {
    var o = n.alternate, f = n.flags;
    switch (n.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        if (ur(r, n), bi(n), f & 4) {
          try {
            Mu(3, n, n.return), Mf(3, n);
          } catch (Ue) {
            Dn(n, n.return, Ue);
          }
          try {
            Mu(5, n, n.return);
          } catch (Ue) {
            Dn(n, n.return, Ue);
          }
        }
        break;
      case 1:
        ur(r, n), bi(n), f & 512 && o !== null && Ou(o, o.return);
        break;
      case 5:
        if (ur(r, n), bi(n), f & 512 && o !== null && Ou(o, o.return), n.flags & 32) {
          var h = n.stateNode;
          try {
            sa(h, "");
          } catch (Ue) {
            Dn(n, n.return, Ue);
          }
        }
        if (f & 4 && (h = n.stateNode, h != null)) {
          var m = n.memoizedProps, C = o !== null ? o.memoizedProps : m, T = n.type, k = n.updateQueue;
          if (n.updateQueue = null, k !== null) try {
            T === "input" && m.type === "radio" && m.name != null && Jt(h, m), qe(T, C);
            var B = qe(T, m);
            for (C = 0; C < k.length; C += 2) {
              var ee = k[C], ne = k[C + 1];
              ee === "style" ? P(h, ne) : ee === "dangerouslySetInnerHTML" ? mi(h, ne) : ee === "children" ? sa(h, ne) : Se(h, ee, ne, B);
            }
            switch (T) {
              case "input":
                dn(h, m);
                break;
              case "textarea":
                xr(h, m);
                break;
              case "select":
                var Z = h._wrapperState.wasMultiple;
                h._wrapperState.wasMultiple = !!m.multiple;
                var xe = m.value;
                xe != null ? Wn(h, !!m.multiple, xe, !1) : Z !== !!m.multiple && (m.defaultValue != null ? Wn(
                  h,
                  !!m.multiple,
                  m.defaultValue,
                  !0
                ) : Wn(h, !!m.multiple, m.multiple ? [] : "", !1));
            }
            h[co] = m;
          } catch (Ue) {
            Dn(n, n.return, Ue);
          }
        }
        break;
      case 6:
        if (ur(r, n), bi(n), f & 4) {
          if (n.stateNode === null) throw Error(c(162));
          h = n.stateNode, m = n.memoizedProps;
          try {
            h.nodeValue = m;
          } catch (Ue) {
            Dn(n, n.return, Ue);
          }
        }
        break;
      case 3:
        if (ur(r, n), bi(n), f & 4 && o !== null && o.memoizedState.isDehydrated) try {
          ms(r.containerInfo);
        } catch (Ue) {
          Dn(n, n.return, Ue);
        }
        break;
      case 4:
        ur(r, n), bi(n);
        break;
      case 13:
        ur(r, n), bi(n), h = n.child, h.flags & 8192 && (m = h.memoizedState !== null, h.stateNode.isHidden = m, !m || h.alternate !== null && h.alternate.memoizedState !== null || (Af = Ft())), f & 4 && Au(n);
        break;
      case 22:
        if (ee = o !== null && o.memoizedState !== null, n.mode & 1 ? (hr = (B = hr) || ee, ur(r, n), hr = B) : ur(r, n), bi(n), f & 8192) {
          if (B = n.memoizedState !== null, (n.stateNode.isHidden = B) && !ee && n.mode & 1) for (Re = n, ee = n.child; ee !== null; ) {
            for (ne = Re = ee; Re !== null; ) {
              switch (Z = Re, xe = Z.child, Z.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Mu(4, Z, Z.return);
                  break;
                case 1:
                  Ou(Z, Z.return);
                  var Ne = Z.stateNode;
                  if (typeof Ne.componentWillUnmount == "function") {
                    f = Z, o = Z.return;
                    try {
                      r = f, Ne.props = r.memoizedProps, Ne.state = r.memoizedState, Ne.componentWillUnmount();
                    } catch (Ue) {
                      Dn(f, o, Ue);
                    }
                  }
                  break;
                case 5:
                  Ou(Z, Z.return);
                  break;
                case 22:
                  if (Z.memoizedState !== null) {
                    zm(ne);
                    continue;
                  }
              }
              xe !== null ? (xe.return = Z, Re = xe) : zm(ne);
            }
            ee = ee.sibling;
          }
          e: for (ee = null, ne = n; ; ) {
            if (ne.tag === 5) {
              if (ee === null) {
                ee = ne;
                try {
                  h = ne.stateNode, B ? (m = h.style, typeof m.setProperty == "function" ? m.setProperty("display", "none", "important") : m.display = "none") : (T = ne.stateNode, k = ne.memoizedProps.style, C = k != null && k.hasOwnProperty("display") ? k.display : null, T.style.display = mt("display", C));
                } catch (Ue) {
                  Dn(n, n.return, Ue);
                }
              }
            } else if (ne.tag === 6) {
              if (ee === null) try {
                ne.stateNode.nodeValue = B ? "" : ne.memoizedProps;
              } catch (Ue) {
                Dn(n, n.return, Ue);
              }
            } else if ((ne.tag !== 22 && ne.tag !== 23 || ne.memoizedState === null || ne === n) && ne.child !== null) {
              ne.child.return = ne, ne = ne.child;
              continue;
            }
            if (ne === n) break e;
            for (; ne.sibling === null; ) {
              if (ne.return === null || ne.return === n) break e;
              ee === ne && (ee = null), ne = ne.return;
            }
            ee === ne && (ee = null), ne.sibling.return = ne.return, ne = ne.sibling;
          }
        }
        break;
      case 19:
        ur(r, n), bi(n), f & 4 && Au(n);
        break;
      case 21:
        break;
      default:
        ur(
          r,
          n
        ), bi(n);
    }
  }
  function bi(n) {
    var r = n.flags;
    if (r & 2) {
      try {
        e: {
          for (var o = n.return; o !== null; ) {
            if (Hp(o)) {
              var f = o;
              break e;
            }
            o = o.return;
          }
          throw Error(c(160));
        }
        switch (f.tag) {
          case 5:
            var h = f.stateNode;
            f.flags & 32 && (sa(h, ""), f.flags &= -33);
            var m = Am(n);
            Nu(n, m, h);
            break;
          case 3:
          case 4:
            var C = f.stateNode.containerInfo, T = Am(n);
            Gs(n, T, C);
            break;
          default:
            throw Error(c(161));
        }
      } catch (k) {
        Dn(n, n.return, k);
      }
      n.flags &= -3;
    }
    r & 4096 && (n.flags &= -4097);
  }
  function O0(n, r, o) {
    Re = n, Yp(n);
  }
  function Yp(n, r, o) {
    for (var f = (n.mode & 1) !== 0; Re !== null; ) {
      var h = Re, m = h.child;
      if (h.tag === 22 && f) {
        var C = h.memoizedState !== null || ku;
        if (!C) {
          var T = h.alternate, k = T !== null && T.memoizedState !== null || hr;
          T = ku;
          var B = hr;
          if (ku = C, (hr = k) && !B) for (Re = h; Re !== null; ) C = Re, k = C.child, C.tag === 22 && C.memoizedState !== null ? Pp(h) : k !== null ? (k.return = C, Re = k) : Pp(h);
          for (; m !== null; ) Re = m, Yp(m), m = m.sibling;
          Re = h, ku = T, hr = B;
        }
        Uu(n);
      } else h.subtreeFlags & 8772 && m !== null ? (m.return = h, Re = m) : Uu(n);
    }
  }
  function Uu(n) {
    for (; Re !== null; ) {
      var r = Re;
      if (r.flags & 8772) {
        var o = r.alternate;
        try {
          if (r.flags & 8772) switch (r.tag) {
            case 0:
            case 11:
            case 15:
              hr || Mf(5, r);
              break;
            case 1:
              var f = r.stateNode;
              if (r.flags & 4 && !hr) if (o === null) f.componentDidMount();
              else {
                var h = r.elementType === r.type ? o.memoizedProps : Jr(r.type, o.memoizedProps);
                f.componentDidUpdate(h, o.memoizedState, f.__reactInternalSnapshotBeforeUpdate);
              }
              var m = r.updateQueue;
              m !== null && Sm(r, m, f);
              break;
            case 3:
              var C = r.updateQueue;
              if (C !== null) {
                if (o = null, r.child !== null) switch (r.child.tag) {
                  case 5:
                    o = r.child.stateNode;
                    break;
                  case 1:
                    o = r.child.stateNode;
                }
                Sm(r, C, o);
              }
              break;
            case 5:
              var T = r.stateNode;
              if (o === null && r.flags & 4) {
                o = T;
                var k = r.memoizedProps;
                switch (r.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    k.autoFocus && o.focus();
                    break;
                  case "img":
                    k.src && (o.src = k.src);
                }
              }
              break;
            case 6:
              break;
            case 4:
              break;
            case 12:
              break;
            case 13:
              if (r.memoizedState === null) {
                var B = r.alternate;
                if (B !== null) {
                  var ee = B.memoizedState;
                  if (ee !== null) {
                    var ne = ee.dehydrated;
                    ne !== null && ms(ne);
                  }
                }
              }
              break;
            case 19:
            case 17:
            case 21:
            case 22:
            case 23:
            case 25:
              break;
            default:
              throw Error(c(163));
          }
          hr || r.flags & 512 && Nf(r);
        } catch (Z) {
          Dn(r, r.return, Z);
        }
      }
      if (r === n) {
        Re = null;
        break;
      }
      if (o = r.sibling, o !== null) {
        o.return = r.return, Re = o;
        break;
      }
      Re = r.return;
    }
  }
  function zm(n) {
    for (; Re !== null; ) {
      var r = Re;
      if (r === n) {
        Re = null;
        break;
      }
      var o = r.sibling;
      if (o !== null) {
        o.return = r.return, Re = o;
        break;
      }
      Re = r.return;
    }
  }
  function Pp(n) {
    for (; Re !== null; ) {
      var r = Re;
      try {
        switch (r.tag) {
          case 0:
          case 11:
          case 15:
            var o = r.return;
            try {
              Mf(4, r);
            } catch (k) {
              Dn(r, o, k);
            }
            break;
          case 1:
            var f = r.stateNode;
            if (typeof f.componentDidMount == "function") {
              var h = r.return;
              try {
                f.componentDidMount();
              } catch (k) {
                Dn(r, h, k);
              }
            }
            var m = r.return;
            try {
              Nf(r);
            } catch (k) {
              Dn(r, m, k);
            }
            break;
          case 5:
            var C = r.return;
            try {
              Nf(r);
            } catch (k) {
              Dn(r, C, k);
            }
        }
      } catch (k) {
        Dn(r, r.return, k);
      }
      if (r === n) {
        Re = null;
        break;
      }
      var T = r.sibling;
      if (T !== null) {
        T.return = r.return, Re = T;
        break;
      }
      Re = r.return;
    }
  }
  var M0 = Math.ceil, bo = O.ReactCurrentDispatcher, Lf = O.ReactCurrentOwner, Fa = O.ReactCurrentBatchConfig, Ct = 0, Rn = null, sn = null, Qn = 0, na = 0, zu = dt(0), qn = 0, Qs = null, xo = 0, ju = 0, Vp = 0, Nl = null, Nr = null, Af = 0, Fu = 1 / 0, Zi = null, Uf = !1, Bp = null, Ha = null, Hu = !1, Ya = null, zf = 0, qs = 0, jf = null, Xs = -1, To = 0;
  function sr() {
    return Ct & 6 ? Ft() : Xs !== -1 ? Xs : Xs = Ft();
  }
  function Ji(n) {
    return n.mode & 1 ? Ct & 2 && Qn !== 0 ? Qn & -Qn : ef.transition !== null ? (To === 0 && (To = Oc()), To) : (n = It, n !== 0 || (n = window.event, n = n === void 0 ? 16 : qd(n.type)), n) : 1;
  }
  function En(n, r, o, f) {
    if (50 < qs) throw qs = 0, jf = null, Error(c(185));
    no(n, o, f), (!(Ct & 2) || n !== Rn) && (n === Rn && (!(Ct & 2) && (ju |= o), qn === 4 && xi(n, Qn)), Xn(n, f), o === 1 && Ct === 0 && !(r.mode & 1) && (Fu = Ft() + 500, lr && Qr()));
  }
  function Xn(n, r) {
    var o = n.callbackNode;
    kc(n, r);
    var f = ai(n, n === Rn ? Qn : 0);
    if (f === 0) o !== null && gn(o), n.callbackNode = null, n.callbackPriority = 0;
    else if (r = f & -f, n.callbackPriority !== r) {
      if (o != null && gn(o), r === 1) n.tag === 0 ? wp(Yu.bind(null, n)) : Ep(Yu.bind(null, n)), yp(function() {
        !(Ct & 6) && Qr();
      }), o = null;
      else {
        switch ($d(f)) {
          case 1:
            o = fa;
            break;
          case 4:
            o = St;
            break;
          case 16:
            o = gi;
            break;
          case 536870912:
            o = Vd;
            break;
          default:
            o = gi;
        }
        o = Im(o, Ff.bind(null, n));
      }
      n.callbackPriority = r, n.callbackNode = o;
    }
  }
  function Ff(n, r) {
    if (Xs = -1, To = 0, Ct & 6) throw Error(c(327));
    var o = n.callbackNode;
    if (Pu() && n.callbackNode !== o) return null;
    var f = ai(n, n === Rn ? Qn : 0);
    if (f === 0) return null;
    if (f & 30 || f & n.expiredLanes || r) r = Yf(n, f);
    else {
      r = f;
      var h = Ct;
      Ct |= 2;
      var m = Fm();
      (Rn !== n || Qn !== r) && (Zi = null, Fu = Ft() + 500, Ro(n, r));
      do
        try {
          L0();
          break;
        } catch (T) {
          jm(n, T);
        }
      while (!0);
      ma(), bo.current = m, Ct = h, sn !== null ? r = 0 : (Rn = null, Qn = 0, r = qn);
    }
    if (r !== 0) {
      if (r === 2 && (h = Id(n), h !== 0 && (f = h, r = _o(n, h))), r === 1) throw o = Qs, Ro(n, 0), xi(n, f), Xn(n, Ft()), o;
      if (r === 6) xi(n, f);
      else {
        if (h = n.current.alternate, !(f & 30) && !Wp(h) && (r = Yf(n, f), r === 2 && (m = Id(n), m !== 0 && (f = m, r = _o(n, m))), r === 1)) throw o = Qs, Ro(n, 0), xi(n, f), Xn(n, Ft()), o;
        switch (n.finishedWork = h, n.finishedLanes = f, r) {
          case 0:
          case 1:
            throw Error(c(345));
          case 2:
            Ll(n, Nr, Zi);
            break;
          case 3:
            if (xi(n, f), (f & 130023424) === f && (r = Af + 500 - Ft(), 10 < r)) {
              if (ai(n, 0) !== 0) break;
              if (h = n.suspendedLanes, (h & f) !== f) {
                sr(), n.pingedLanes |= n.suspendedLanes & h;
                break;
              }
              n.timeoutHandle = so(Ll.bind(null, n, Nr, Zi), r);
              break;
            }
            Ll(n, Nr, Zi);
            break;
          case 4:
            if (xi(n, f), (f & 4194240) === f) break;
            for (r = n.eventTimes, h = -1; 0 < f; ) {
              var C = 31 - Ta(f);
              m = 1 << C, C = r[C], C > h && (h = C), f &= ~m;
            }
            if (f = h, f = Ft() - f, f = (120 > f ? 120 : 480 > f ? 480 : 1080 > f ? 1080 : 1920 > f ? 1920 : 3e3 > f ? 3e3 : 4320 > f ? 4320 : 1960 * M0(f / 1960)) - f, 10 < f) {
              n.timeoutHandle = so(Ll.bind(null, n, Nr, Zi), f);
              break;
            }
            Ll(n, Nr, Zi);
            break;
          case 5:
            Ll(n, Nr, Zi);
            break;
          default:
            throw Error(c(329));
        }
      }
    }
    return Xn(n, Ft()), n.callbackNode === o ? Ff.bind(null, n) : null;
  }
  function _o(n, r) {
    var o = Nl;
    return n.current.memoizedState.isDehydrated && (Ro(n, r).flags |= 256), n = Yf(n, r), n !== 2 && (r = Nr, Nr = o, r !== null && Ip(r)), n;
  }
  function Ip(n) {
    Nr === null ? Nr = n : Nr.push.apply(Nr, n);
  }
  function Wp(n) {
    for (var r = n; ; ) {
      if (r.flags & 16384) {
        var o = r.updateQueue;
        if (o !== null && (o = o.stores, o !== null)) for (var f = 0; f < o.length; f++) {
          var h = o[f], m = h.getSnapshot;
          h = h.value;
          try {
            if (!Da(m(), h)) return !1;
          } catch {
            return !1;
          }
        }
      }
      if (o = r.child, r.subtreeFlags & 16384 && o !== null) o.return = r, r = o;
      else {
        if (r === n) break;
        for (; r.sibling === null; ) {
          if (r.return === null || r.return === n) return !0;
          r = r.return;
        }
        r.sibling.return = r.return, r = r.sibling;
      }
    }
    return !0;
  }
  function xi(n, r) {
    for (r &= ~Vp, r &= ~ju, n.suspendedLanes |= r, n.pingedLanes &= ~r, n = n.expirationTimes; 0 < r; ) {
      var o = 31 - Ta(r), f = 1 << o;
      n[o] = -1, r &= ~f;
    }
  }
  function Yu(n) {
    if (Ct & 6) throw Error(c(327));
    Pu();
    var r = ai(n, 0);
    if (!(r & 1)) return Xn(n, Ft()), null;
    var o = Yf(n, r);
    if (n.tag !== 0 && o === 2) {
      var f = Id(n);
      f !== 0 && (r = f, o = _o(n, f));
    }
    if (o === 1) throw o = Qs, Ro(n, 0), xi(n, r), Xn(n, Ft()), o;
    if (o === 6) throw Error(c(345));
    return n.finishedWork = n.current.alternate, n.finishedLanes = r, Ll(n, Nr, Zi), Xn(n, Ft()), null;
  }
  function $p(n, r) {
    var o = Ct;
    Ct |= 1;
    try {
      return n(r);
    } finally {
      Ct = o, Ct === 0 && (Fu = Ft() + 500, lr && Qr());
    }
  }
  function Ti(n) {
    Ya !== null && Ya.tag === 0 && !(Ct & 6) && Pu();
    var r = Ct;
    Ct |= 1;
    var o = Fa.transition, f = It;
    try {
      if (Fa.transition = null, It = 1, n) return n();
    } finally {
      It = f, Fa.transition = o, Ct = r, !(Ct & 6) && Qr();
    }
  }
  function Hf() {
    na = zu.current, jt(zu);
  }
  function Ro(n, r) {
    n.finishedWork = null, n.finishedLanes = 0;
    var o = n.timeoutHandle;
    if (o !== -1 && (n.timeoutHandle = -1, cm(o)), sn !== null) for (o = sn.return; o !== null; ) {
      var f = o;
      switch (bp(f), f.tag) {
        case 1:
          f = f.type.childContextTypes, f != null && Ma();
          break;
        case 3:
          gu(), jt(Tn), jt(nt), Op();
          break;
        case 5:
          kp(f);
          break;
        case 4:
          gu();
          break;
        case 13:
          jt(hn);
          break;
        case 19:
          jt(hn);
          break;
        case 10:
          _p(f.type._context);
          break;
        case 22:
        case 23:
          Hf();
      }
      o = o.return;
    }
    if (Rn = n, sn = n = Al(n.current, null), Qn = na = r, qn = 0, Qs = null, Vp = ju = xo = 0, Nr = Nl = null, ho !== null) {
      for (r = 0; r < ho.length; r++) if (o = ho[r], f = o.interleaved, f !== null) {
        o.interleaved = null;
        var h = f.next, m = o.pending;
        if (m !== null) {
          var C = m.next;
          m.next = h, f.next = C;
        }
        o.pending = f;
      }
      ho = null;
    }
    return n;
  }
  function jm(n, r) {
    do {
      var o = sn;
      try {
        if (ma(), uf.current = Or, ya) {
          for (var f = Fe.memoizedState; f !== null; ) {
            var h = f.queue;
            h !== null && (h.pending = null), f = f.next;
          }
          ya = !1;
        }
        if (ze = 0, Et = rt = Fe = null, Su = !1, Fs = 0, Lf.current = null, o === null || o.return === null) {
          qn = 1, Qs = r, sn = null;
          break;
        }
        e: {
          var m = n, C = o.return, T = o, k = r;
          if (r = Qn, T.flags |= 32768, k !== null && typeof k == "object" && typeof k.then == "function") {
            var B = k, ee = T, ne = ee.tag;
            if (!(ee.mode & 1) && (ne === 0 || ne === 11 || ne === 15)) {
              var Z = ee.alternate;
              Z ? (ee.updateQueue = Z.updateQueue, ee.memoizedState = Z.memoizedState, ee.lanes = Z.lanes) : (ee.updateQueue = null, ee.memoizedState = null);
            }
            var xe = Dm(C);
            if (xe !== null) {
              xe.flags &= -257, Up(xe, C, T, m, r), xe.mode & 1 && Bs(m, B, r), r = xe, k = B;
              var Ne = r.updateQueue;
              if (Ne === null) {
                var Ue = /* @__PURE__ */ new Set();
                Ue.add(k), r.updateQueue = Ue;
              } else Ne.add(k);
              break e;
            } else {
              if (!(r & 1)) {
                Bs(m, B, r), Ks();
                break e;
              }
              k = Error(c(426));
            }
          } else if (un && T.mode & 1) {
            var An = Dm(C);
            if (An !== null) {
              !(An.flags & 65536) && (An.flags |= 256), Up(An, C, T, m, r), Tp(Ol(k, T));
              break e;
            }
          }
          m = k = Ol(k, T), qn !== 4 && (qn = 2), Nl === null ? Nl = [m] : Nl.push(m), m = C;
          do {
            switch (m.tag) {
              case 3:
                m.flags |= 65536, r &= -r, m.lanes |= r;
                var j = _m(m, k, r);
                gm(m, j);
                break e;
              case 1:
                T = k;
                var N = m.type, Y = m.stateNode;
                if (!(m.flags & 128) && (typeof N.getDerivedStateFromError == "function" || Y !== null && typeof Y.componentDidCatch == "function" && (Ha === null || !Ha.has(Y)))) {
                  m.flags |= 65536, r &= -r, m.lanes |= r;
                  var ie = Rm(m, T, r);
                  gm(m, ie);
                  break e;
                }
            }
            m = m.return;
          } while (m !== null);
        }
        Ym(o);
      } catch (je) {
        r = je, sn === o && o !== null && (sn = o = o.return);
        continue;
      }
      break;
    } while (!0);
  }
  function Fm() {
    var n = bo.current;
    return bo.current = Or, n === null ? Or : n;
  }
  function Ks() {
    (qn === 0 || qn === 3 || qn === 2) && (qn = 4), Rn === null || !(xo & 268435455) && !(ju & 268435455) || xi(Rn, Qn);
  }
  function Yf(n, r) {
    var o = Ct;
    Ct |= 2;
    var f = Fm();
    (Rn !== n || Qn !== r) && (Zi = null, Ro(n, r));
    do
      try {
        N0();
        break;
      } catch (h) {
        jm(n, h);
      }
    while (!0);
    if (ma(), Ct = o, bo.current = f, sn !== null) throw Error(c(261));
    return Rn = null, Qn = 0, qn;
  }
  function N0() {
    for (; sn !== null; ) Hm(sn);
  }
  function L0() {
    for (; sn !== null && !Wr(); ) Hm(sn);
  }
  function Hm(n) {
    var r = Bm(n.alternate, n, na);
    n.memoizedProps = n.pendingProps, r === null ? Ym(n) : sn = r, Lf.current = null;
  }
  function Ym(n) {
    var r = n;
    do {
      var o = r.alternate;
      if (n = r.return, r.flags & 32768) {
        if (o = D0(o, r), o !== null) {
          o.flags &= 32767, sn = o;
          return;
        }
        if (n !== null) n.flags |= 32768, n.subtreeFlags = 0, n.deletions = null;
        else {
          qn = 6, sn = null;
          return;
        }
      } else if (o = R0(o, r, na), o !== null) {
        sn = o;
        return;
      }
      if (r = r.sibling, r !== null) {
        sn = r;
        return;
      }
      sn = r = n;
    } while (r !== null);
    qn === 0 && (qn = 5);
  }
  function Ll(n, r, o) {
    var f = It, h = Fa.transition;
    try {
      Fa.transition = null, It = 1, A0(n, r, o, f);
    } finally {
      Fa.transition = h, It = f;
    }
    return null;
  }
  function A0(n, r, o, f) {
    do
      Pu();
    while (Ya !== null);
    if (Ct & 6) throw Error(c(327));
    o = n.finishedWork;
    var h = n.finishedLanes;
    if (o === null) return null;
    if (n.finishedWork = null, n.finishedLanes = 0, o === n.current) throw Error(c(177));
    n.callbackNode = null, n.callbackPriority = 0;
    var m = o.lanes | o.childLanes;
    if (i0(n, m), n === Rn && (sn = Rn = null, Qn = 0), !(o.subtreeFlags & 2064) && !(o.flags & 2064) || Hu || (Hu = !0, Im(gi, function() {
      return Pu(), null;
    })), m = (o.flags & 15990) !== 0, o.subtreeFlags & 15990 || m) {
      m = Fa.transition, Fa.transition = null;
      var C = It;
      It = 1;
      var T = Ct;
      Ct |= 4, Lf.current = null, k0(n, o), Um(o, n), Bc(uo), ro = !!vp, uo = vp = null, n.current = o, O0(o), yl(), Ct = T, It = C, Fa.transition = m;
    } else n.current = o;
    if (Hu && (Hu = !1, Ya = n, zf = h), m = n.pendingLanes, m === 0 && (Ha = null), xv(o.stateNode), Xn(n, Ft()), r !== null) for (f = n.onRecoverableError, o = 0; o < r.length; o++) h = r[o], f(h.value, { componentStack: h.stack, digest: h.digest });
    if (Uf) throw Uf = !1, n = Bp, Bp = null, n;
    return zf & 1 && n.tag !== 0 && Pu(), m = n.pendingLanes, m & 1 ? n === jf ? qs++ : (qs = 0, jf = n) : qs = 0, Qr(), null;
  }
  function Pu() {
    if (Ya !== null) {
      var n = $d(zf), r = Fa.transition, o = It;
      try {
        if (Fa.transition = null, It = 16 > n ? 16 : n, Ya === null) var f = !1;
        else {
          if (n = Ya, Ya = null, zf = 0, Ct & 6) throw Error(c(331));
          var h = Ct;
          for (Ct |= 4, Re = n.current; Re !== null; ) {
            var m = Re, C = m.child;
            if (Re.flags & 16) {
              var T = m.deletions;
              if (T !== null) {
                for (var k = 0; k < T.length; k++) {
                  var B = T[k];
                  for (Re = B; Re !== null; ) {
                    var ee = Re;
                    switch (ee.tag) {
                      case 0:
                      case 11:
                      case 15:
                        Mu(8, ee, m);
                    }
                    var ne = ee.child;
                    if (ne !== null) ne.return = ee, Re = ne;
                    else for (; Re !== null; ) {
                      ee = Re;
                      var Z = ee.sibling, xe = ee.return;
                      if (Lm(ee), ee === B) {
                        Re = null;
                        break;
                      }
                      if (Z !== null) {
                        Z.return = xe, Re = Z;
                        break;
                      }
                      Re = xe;
                    }
                  }
                }
                var Ne = m.alternate;
                if (Ne !== null) {
                  var Ue = Ne.child;
                  if (Ue !== null) {
                    Ne.child = null;
                    do {
                      var An = Ue.sibling;
                      Ue.sibling = null, Ue = An;
                    } while (Ue !== null);
                  }
                }
                Re = m;
              }
            }
            if (m.subtreeFlags & 2064 && C !== null) C.return = m, Re = C;
            else e: for (; Re !== null; ) {
              if (m = Re, m.flags & 2048) switch (m.tag) {
                case 0:
                case 11:
                case 15:
                  Mu(9, m, m.return);
              }
              var j = m.sibling;
              if (j !== null) {
                j.return = m.return, Re = j;
                break e;
              }
              Re = m.return;
            }
          }
          var N = n.current;
          for (Re = N; Re !== null; ) {
            C = Re;
            var Y = C.child;
            if (C.subtreeFlags & 2064 && Y !== null) Y.return = C, Re = Y;
            else e: for (C = N; Re !== null; ) {
              if (T = Re, T.flags & 2048) try {
                switch (T.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Mf(9, T);
                }
              } catch (je) {
                Dn(T, T.return, je);
              }
              if (T === C) {
                Re = null;
                break e;
              }
              var ie = T.sibling;
              if (ie !== null) {
                ie.return = T.return, Re = ie;
                break e;
              }
              Re = T.return;
            }
          }
          if (Ct = h, Qr(), ri && typeof ri.onPostCommitFiberRoot == "function") try {
            ri.onPostCommitFiberRoot(fs, n);
          } catch {
          }
          f = !0;
        }
        return f;
      } finally {
        It = o, Fa.transition = r;
      }
    }
    return !1;
  }
  function Pm(n, r, o) {
    r = Ol(o, r), r = _m(n, r, 1), n = Dl(n, r, 1), r = sr(), n !== null && (no(n, 1, r), Xn(n, r));
  }
  function Dn(n, r, o) {
    if (n.tag === 3) Pm(n, n, o);
    else for (; r !== null; ) {
      if (r.tag === 3) {
        Pm(r, n, o);
        break;
      } else if (r.tag === 1) {
        var f = r.stateNode;
        if (typeof r.type.getDerivedStateFromError == "function" || typeof f.componentDidCatch == "function" && (Ha === null || !Ha.has(f))) {
          n = Ol(o, n), n = Rm(r, n, 1), r = Dl(r, n, 1), n = sr(), r !== null && (no(r, 1, n), Xn(r, n));
          break;
        }
      }
      r = r.return;
    }
  }
  function U0(n, r, o) {
    var f = n.pingCache;
    f !== null && f.delete(r), r = sr(), n.pingedLanes |= n.suspendedLanes & o, Rn === n && (Qn & o) === o && (qn === 4 || qn === 3 && (Qn & 130023424) === Qn && 500 > Ft() - Af ? Ro(n, 0) : Vp |= o), Xn(n, r);
  }
  function Vm(n, r) {
    r === 0 && (n.mode & 1 ? (r = tu, tu <<= 1, !(tu & 130023424) && (tu = 4194304)) : r = 1);
    var o = sr();
    n = qi(n, r), n !== null && (no(n, r, o), Xn(n, o));
  }
  function Gp(n) {
    var r = n.memoizedState, o = 0;
    r !== null && (o = r.retryLane), Vm(n, o);
  }
  function z0(n, r) {
    var o = 0;
    switch (n.tag) {
      case 13:
        var f = n.stateNode, h = n.memoizedState;
        h !== null && (o = h.retryLane);
        break;
      case 19:
        f = n.stateNode;
        break;
      default:
        throw Error(c(314));
    }
    f !== null && f.delete(r), Vm(n, o);
  }
  var Bm;
  Bm = function(n, r, o) {
    if (n !== null) if (n.memoizedProps !== r.pendingProps || Tn.current) ea = !0;
    else {
      if (!(n.lanes & o) && !(r.flags & 128)) return ea = !1, Ki(n, r, o);
      ea = !!(n.flags & 131072);
    }
    else ea = !1, un && r.flags & 1048576 && Cp(r, pu, r.index);
    switch (r.lanes = 0, r.tag) {
      case 2:
        var f = r.type;
        $s(n, r), n = r.pendingProps;
        var h = Oa(r, nt.current);
        vu(r, o), h = K(null, r, f, n, h, o);
        var m = Yn();
        return r.flags |= 1, typeof h == "object" && h !== null && typeof h.render == "function" && h.$$typeof === void 0 ? (r.tag = 1, r.memoizedState = null, r.updateQueue = null, pn(f) ? (m = !0, qc(r)) : m = !1, r.memoizedState = h.state !== null && h.state !== void 0 ? h.state : null, nf(r), h.updater = Eo, r.stateNode = h, h._reactInternals = r, Lp(r, f, n, o), r = Tf(null, r, f, !0, m, o)) : (r.tag = 0, un && m && Xc(r), Nn(null, r, h, o), r = r.child), r;
      case 16:
        f = r.elementType;
        e: {
          switch ($s(n, r), n = r.pendingProps, h = f._init, f = h(f._payload), r.type = f, h = r.tag = j0(f), n = Jr(f, n), h) {
            case 0:
              r = ct(null, r, f, n, o);
              break e;
            case 1:
              r = Is(null, r, f, n, o);
              break e;
            case 11:
              r = _u(null, r, f, n, o);
              break e;
            case 14:
              r = Ml(null, r, f, Jr(f.type, n), o);
              break e;
          }
          throw Error(c(
            306,
            f,
            ""
          ));
        }
        return r;
      case 0:
        return f = r.type, h = r.pendingProps, h = r.elementType === f ? h : Jr(f, h), ct(n, r, f, h, o);
      case 1:
        return f = r.type, h = r.pendingProps, h = r.elementType === f ? h : Jr(f, h), Is(n, r, f, h, o);
      case 3:
        e: {
          if (_0(r), n === null) throw Error(c(387));
          f = r.pendingProps, m = r.memoizedState, h = m.element, mu(n, r), af(r, f, null, o);
          var C = r.memoizedState;
          if (f = C.element, m.isDehydrated) if (m = { element: f, isDehydrated: !1, cache: C.cache, pendingSuspenseBoundaries: C.pendingSuspenseBoundaries, transitions: C.transitions }, r.updateQueue.baseState = m, r.memoizedState = m, r.flags & 256) {
            h = Ol(Error(c(423)), r), r = Om(n, r, f, o, h);
            break e;
          } else if (f !== h) {
            h = Ol(Error(c(424)), r), r = Om(n, r, f, o, h);
            break e;
          } else for (Kr = ui(r.stateNode.containerInfo.firstChild), va = r, un = !0, La = null, o = mm(r, null, f, o), r.child = o; o; ) o.flags = o.flags & -3 | 4096, o = o.sibling;
          else {
            if (Sn(), f === h) {
              r = Ln(n, r, o);
              break e;
            }
            Nn(n, r, f, o);
          }
          r = r.child;
        }
        return r;
      case 5:
        return Em(r), n === null && Zc(r), f = r.type, h = r.pendingProps, m = n !== null ? n.memoizedProps : null, C = h.children, Os(f, h) ? C = null : m !== null && Os(f, m) && (r.flags |= 32), wo(n, r), Nn(n, r, C, o), r.child;
      case 6:
        return n === null && Zc(r), null;
      case 13:
        return Mm(n, r, o);
      case 4:
        return Dp(r, r.stateNode.containerInfo), f = r.pendingProps, n === null ? r.child = hu(r, null, f, o) : Nn(n, r, f, o), r.child;
      case 11:
        return f = r.type, h = r.pendingProps, h = r.elementType === f ? h : Jr(f, h), _u(n, r, f, h, o);
      case 7:
        return Nn(n, r, r.pendingProps, o), r.child;
      case 8:
        return Nn(n, r, r.pendingProps.children, o), r.child;
      case 12:
        return Nn(n, r, r.pendingProps.children, o), r.child;
      case 10:
        e: {
          if (f = r.type._context, h = r.pendingProps, m = r.memoizedProps, C = h.value, Ht(Qi, f._currentValue), f._currentValue = C, m !== null) if (Da(m.value, C)) {
            if (m.children === h.children && !Tn.current) {
              r = Ln(n, r, o);
              break e;
            }
          } else for (m = r.child, m !== null && (m.return = r); m !== null; ) {
            var T = m.dependencies;
            if (T !== null) {
              C = m.child;
              for (var k = T.firstContext; k !== null; ) {
                if (k.context === f) {
                  if (m.tag === 1) {
                    k = Zr(-1, o & -o), k.tag = 2;
                    var B = m.updateQueue;
                    if (B !== null) {
                      B = B.shared;
                      var ee = B.pending;
                      ee === null ? k.next = k : (k.next = ee.next, ee.next = k), B.pending = k;
                    }
                  }
                  m.lanes |= o, k = m.alternate, k !== null && (k.lanes |= o), Rp(
                    m.return,
                    o,
                    r
                  ), T.lanes |= o;
                  break;
                }
                k = k.next;
              }
            } else if (m.tag === 10) C = m.type === r.type ? null : m.child;
            else if (m.tag === 18) {
              if (C = m.return, C === null) throw Error(c(341));
              C.lanes |= o, T = C.alternate, T !== null && (T.lanes |= o), Rp(C, o, r), C = m.sibling;
            } else C = m.child;
            if (C !== null) C.return = m;
            else for (C = m; C !== null; ) {
              if (C === r) {
                C = null;
                break;
              }
              if (m = C.sibling, m !== null) {
                m.return = C.return, C = m;
                break;
              }
              C = C.return;
            }
            m = C;
          }
          Nn(n, r, h.children, o), r = r.child;
        }
        return r;
      case 9:
        return h = r.type, f = r.pendingProps.children, vu(r, o), h = Ua(h), f = f(h), r.flags |= 1, Nn(n, r, f, o), r.child;
      case 14:
        return f = r.type, h = Jr(f, r.pendingProps), h = Jr(f.type, h), Ml(n, r, f, h, o);
      case 15:
        return xf(n, r, r.type, r.pendingProps, o);
      case 17:
        return f = r.type, h = r.pendingProps, h = r.elementType === f ? h : Jr(f, h), $s(n, r), r.tag = 1, pn(f) ? (n = !0, qc(r)) : n = !1, vu(r, o), bm(r, f, h), Lp(r, f, h, o), Tf(null, r, f, !0, n, o);
      case 19:
        return jp(n, r, o);
      case 22:
        return ta(n, r, o);
    }
    throw Error(c(156, r.tag));
  };
  function Im(n, r) {
    return ln(n, r);
  }
  function Wm(n, r, o, f) {
    this.tag = n, this.key = o, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = r, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = f, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
  }
  function Pa(n, r, o, f) {
    return new Wm(n, r, o, f);
  }
  function Qp(n) {
    return n = n.prototype, !(!n || !n.isReactComponent);
  }
  function j0(n) {
    if (typeof n == "function") return Qp(n) ? 1 : 0;
    if (n != null) {
      if (n = n.$$typeof, n === ft) return 11;
      if (n === xt) return 14;
    }
    return 2;
  }
  function Al(n, r) {
    var o = n.alternate;
    return o === null ? (o = Pa(n.tag, r, n.key, n.mode), o.elementType = n.elementType, o.type = n.type, o.stateNode = n.stateNode, o.alternate = n, n.alternate = o) : (o.pendingProps = r, o.type = n.type, o.flags = 0, o.subtreeFlags = 0, o.deletions = null), o.flags = n.flags & 14680064, o.childLanes = n.childLanes, o.lanes = n.lanes, o.child = n.child, o.memoizedProps = n.memoizedProps, o.memoizedState = n.memoizedState, o.updateQueue = n.updateQueue, r = n.dependencies, o.dependencies = r === null ? null : { lanes: r.lanes, firstContext: r.firstContext }, o.sibling = n.sibling, o.index = n.index, o.ref = n.ref, o;
  }
  function Pf(n, r, o, f, h, m) {
    var C = 2;
    if (f = n, typeof n == "function") Qp(n) && (C = 1);
    else if (typeof n == "string") C = 5;
    else e: switch (n) {
      case ye:
        return Do(o.children, h, m, r);
      case ht:
        C = 8, h |= 8;
        break;
      case yt:
        return n = Pa(12, o, r, h | 2), n.elementType = yt, n.lanes = m, n;
      case Ee:
        return n = Pa(13, o, r, h), n.elementType = Ee, n.lanes = m, n;
      case Ge:
        return n = Pa(19, o, r, h), n.elementType = Ge, n.lanes = m, n;
      case _t:
        return Vf(o, h, m, r);
      default:
        if (typeof n == "object" && n !== null) switch (n.$$typeof) {
          case Je:
            C = 10;
            break e;
          case Ke:
            C = 9;
            break e;
          case ft:
            C = 11;
            break e;
          case xt:
            C = 14;
            break e;
          case it:
            C = 16, f = null;
            break e;
        }
        throw Error(c(130, n == null ? n : typeof n, ""));
    }
    return r = Pa(C, o, r, h), r.elementType = n, r.type = f, r.lanes = m, r;
  }
  function Do(n, r, o, f) {
    return n = Pa(7, n, f, r), n.lanes = o, n;
  }
  function Vf(n, r, o, f) {
    return n = Pa(22, n, f, r), n.elementType = _t, n.lanes = o, n.stateNode = { isHidden: !1 }, n;
  }
  function Bf(n, r, o) {
    return n = Pa(6, n, null, r), n.lanes = o, n;
  }
  function Zs(n, r, o) {
    return r = Pa(4, n.children !== null ? n.children : [], n.key, r), r.lanes = o, r.stateNode = { containerInfo: n.containerInfo, pendingChildren: null, implementation: n.implementation }, r;
  }
  function Js(n, r, o, f, h) {
    this.tag = r, this.containerInfo = n, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = Wd(0), this.expirationTimes = Wd(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Wd(0), this.identifierPrefix = f, this.onRecoverableError = h, this.mutableSourceEagerHydrationData = null;
  }
  function qp(n, r, o, f, h, m, C, T, k) {
    return n = new Js(n, r, o, T, k), r === 1 ? (r = 1, m === !0 && (r |= 8)) : r = 0, m = Pa(3, null, null, r), n.current = m, m.stateNode = n, m.memoizedState = { element: f, isDehydrated: o, cache: null, transitions: null, pendingSuspenseBoundaries: null }, nf(m), n;
  }
  function $m(n, r, o) {
    var f = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
    return { $$typeof: le, key: f == null ? null : "" + f, children: n, containerInfo: r, implementation: o };
  }
  function Xp(n) {
    if (!n) return Ei;
    n = n._reactInternals;
    e: {
      if (Pe(n) !== n || n.tag !== 1) throw Error(c(170));
      var r = n;
      do {
        switch (r.tag) {
          case 3:
            r = r.stateNode.context;
            break e;
          case 1:
            if (pn(r.type)) {
              r = r.stateNode.__reactInternalMemoizedMergedChildContext;
              break e;
            }
        }
        r = r.return;
      } while (r !== null);
      throw Error(c(171));
    }
    if (n.tag === 1) {
      var o = n.type;
      if (pn(o)) return Ls(n, o, r);
    }
    return r;
  }
  function Kp(n, r, o, f, h, m, C, T, k) {
    return n = qp(o, f, !0, n, h, m, C, T, k), n.context = Xp(null), o = n.current, f = sr(), h = Ji(o), m = Zr(f, h), m.callback = r ?? null, Dl(o, m, h), n.current.lanes = h, no(n, h, f), Xn(n, f), n;
  }
  function If(n, r, o, f) {
    var h = r.current, m = sr(), C = Ji(h);
    return o = Xp(o), r.context === null ? r.context = o : r.pendingContext = o, r = Zr(m, C), r.payload = { element: n }, f = f === void 0 ? null : f, f !== null && (r.callback = f), n = Dl(h, r, C), n !== null && (En(n, h, C, m), rf(n, h, C)), C;
  }
  function ec(n) {
    if (n = n.current, !n.child) return null;
    switch (n.child.tag) {
      case 5:
        return n.child.stateNode;
      default:
        return n.child.stateNode;
    }
  }
  function Gm(n, r) {
    if (n = n.memoizedState, n !== null && n.dehydrated !== null) {
      var o = n.retryLane;
      n.retryLane = o !== 0 && o < r ? o : r;
    }
  }
  function Zp(n, r) {
    Gm(n, r), (n = n.alternate) && Gm(n, r);
  }
  function F0() {
    return null;
  }
  var Jp = typeof reportError == "function" ? reportError : function(n) {
    console.error(n);
  };
  function Wf(n) {
    this._internalRoot = n;
  }
  tc.prototype.render = Wf.prototype.render = function(n) {
    var r = this._internalRoot;
    if (r === null) throw Error(c(409));
    If(n, r, null, null);
  }, tc.prototype.unmount = Wf.prototype.unmount = function() {
    var n = this._internalRoot;
    if (n !== null) {
      this._internalRoot = null;
      var r = n.containerInfo;
      Ti(function() {
        If(null, n, null, null);
      }), r[$i] = null;
    }
  };
  function tc(n) {
    this._internalRoot = n;
  }
  tc.prototype.unstable_scheduleHydration = function(n) {
    if (n) {
      var r = Dv();
      n = { blockedOn: null, target: n, priority: r };
      for (var o = 0; o < Qt.length && r !== 0 && r < Qt[o].priority; o++) ;
      Qt.splice(o, 0, n), o === 0 && kv(n);
    }
  };
  function Ul(n) {
    return !(!n || n.nodeType !== 1 && n.nodeType !== 9 && n.nodeType !== 11);
  }
  function $f(n) {
    return !(!n || n.nodeType !== 1 && n.nodeType !== 9 && n.nodeType !== 11 && (n.nodeType !== 8 || n.nodeValue !== " react-mount-point-unstable "));
  }
  function Qm() {
  }
  function H0(n, r, o, f, h) {
    if (h) {
      if (typeof f == "function") {
        var m = f;
        f = function() {
          var B = ec(C);
          m.call(B);
        };
      }
      var C = Kp(r, f, n, 0, null, !1, !1, "", Qm);
      return n._reactRootContainer = C, n[$i] = C.current, fu(n.nodeType === 8 ? n.parentNode : n), Ti(), C;
    }
    for (; h = n.lastChild; ) n.removeChild(h);
    if (typeof f == "function") {
      var T = f;
      f = function() {
        var B = ec(k);
        T.call(B);
      };
    }
    var k = qp(n, 0, !1, null, null, !1, !1, "", Qm);
    return n._reactRootContainer = k, n[$i] = k.current, fu(n.nodeType === 8 ? n.parentNode : n), Ti(function() {
      If(r, k, o, f);
    }), k;
  }
  function Gf(n, r, o, f, h) {
    var m = o._reactRootContainer;
    if (m) {
      var C = m;
      if (typeof h == "function") {
        var T = h;
        h = function() {
          var k = ec(C);
          T.call(k);
        };
      }
      If(r, C, n, h);
    } else C = H0(o, r, n, h, f);
    return ec(C);
  }
  Rv = function(n) {
    switch (n.tag) {
      case 3:
        var r = n.stateNode;
        if (r.current.memoizedState.isDehydrated) {
          var o = to(r.pendingLanes);
          o !== 0 && (ds(r, o | 1), Xn(r, Ft()), !(Ct & 6) && (Fu = Ft() + 500, Qr()));
        }
        break;
      case 13:
        Ti(function() {
          var f = qi(n, 1);
          if (f !== null) {
            var h = sr();
            En(f, n, 1, h);
          }
        }), Zp(n, 1);
    }
  }, Mc = function(n) {
    if (n.tag === 13) {
      var r = qi(n, 134217728);
      if (r !== null) {
        var o = sr();
        En(r, n, 134217728, o);
      }
      Zp(n, 134217728);
    }
  }, Wt = function(n) {
    if (n.tag === 13) {
      var r = Ji(n), o = qi(n, r);
      if (o !== null) {
        var f = sr();
        En(o, n, r, f);
      }
      Zp(n, r);
    }
  }, Dv = function() {
    return It;
  }, Gd = function(n, r) {
    var o = It;
    try {
      return It = n, r();
    } finally {
      It = o;
    }
  }, tn = function(n, r, o) {
    switch (r) {
      case "input":
        if (dn(n, o), r = o.name, o.type === "radio" && r != null) {
          for (o = n; o.parentNode; ) o = o.parentNode;
          for (o = o.querySelectorAll("input[name=" + JSON.stringify("" + r) + '][type="radio"]'), r = 0; r < o.length; r++) {
            var f = o[r];
            if (f !== n && f.form === n.form) {
              var h = Be(f);
              if (!h) throw Error(c(90));
              Vn(f), dn(f, h);
            }
          }
        }
        break;
      case "textarea":
        xr(n, o);
        break;
      case "select":
        r = o.value, r != null && Wn(n, !!o.multiple, r, !1);
    }
  }, xa = $p, Jo = Ti;
  var Y0 = { usingClientEntryPoint: !1, Events: [Ns, du, Be, Za, Ja, $p] }, nc = { findFiberByHostInstance: ka, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" }, qm = { bundleType: nc.bundleType, version: nc.version, rendererPackageName: nc.rendererPackageName, rendererConfig: nc.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: O.ReactCurrentDispatcher, findHostInstanceByFiber: function(n) {
    return n = gt(n), n === null ? null : n.stateNode;
  }, findFiberByHostInstance: nc.findFiberByHostInstance || F0, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    var Qf = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!Qf.isDisabled && Qf.supportsFiber) try {
      fs = Qf.inject(qm), ri = Qf;
    } catch {
    }
  }
  return Ga.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = Y0, Ga.createPortal = function(n, r) {
    var o = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!Ul(r)) throw Error(c(200));
    return $m(n, r, null, o);
  }, Ga.createRoot = function(n, r) {
    if (!Ul(n)) throw Error(c(299));
    var o = !1, f = "", h = Jp;
    return r != null && (r.unstable_strictMode === !0 && (o = !0), r.identifierPrefix !== void 0 && (f = r.identifierPrefix), r.onRecoverableError !== void 0 && (h = r.onRecoverableError)), r = qp(n, 1, !1, null, null, o, !1, f, h), n[$i] = r.current, fu(n.nodeType === 8 ? n.parentNode : n), new Wf(r);
  }, Ga.findDOMNode = function(n) {
    if (n == null) return null;
    if (n.nodeType === 1) return n;
    var r = n._reactInternals;
    if (r === void 0)
      throw typeof n.render == "function" ? Error(c(188)) : (n = Object.keys(n).join(","), Error(c(268, n)));
    return n = gt(r), n = n === null ? null : n.stateNode, n;
  }, Ga.flushSync = function(n) {
    return Ti(n);
  }, Ga.hydrate = function(n, r, o) {
    if (!$f(r)) throw Error(c(200));
    return Gf(null, n, r, !0, o);
  }, Ga.hydrateRoot = function(n, r, o) {
    if (!Ul(n)) throw Error(c(405));
    var f = o != null && o.hydratedSources || null, h = !1, m = "", C = Jp;
    if (o != null && (o.unstable_strictMode === !0 && (h = !0), o.identifierPrefix !== void 0 && (m = o.identifierPrefix), o.onRecoverableError !== void 0 && (C = o.onRecoverableError)), r = Kp(r, null, n, 1, o ?? null, h, !1, m, C), n[$i] = r.current, fu(n), f) for (n = 0; n < f.length; n++) o = f[n], h = o._getVersion, h = h(o._source), r.mutableSourceEagerHydrationData == null ? r.mutableSourceEagerHydrationData = [o, h] : r.mutableSourceEagerHydrationData.push(
      o,
      h
    );
    return new tc(r);
  }, Ga.render = function(n, r, o) {
    if (!$f(r)) throw Error(c(200));
    return Gf(null, n, r, !1, o);
  }, Ga.unmountComponentAtNode = function(n) {
    if (!$f(n)) throw Error(c(40));
    return n._reactRootContainer ? (Ti(function() {
      Gf(null, null, n, !1, function() {
        n._reactRootContainer = null, n[$i] = null;
      });
    }), !0) : !1;
  }, Ga.unstable_batchedUpdates = $p, Ga.unstable_renderSubtreeIntoContainer = function(n, r, o, f) {
    if (!$f(o)) throw Error(c(200));
    if (n == null || n._reactInternals === void 0) throw Error(c(38));
    return Gf(n, r, o, !1, f);
  }, Ga.version = "18.3.1-next-f1338f8080-20240426", Ga;
}
var Qa = {};
/**
 * @license React
 * react-dom.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var QT;
function vF() {
  return QT || (QT = 1, process.env.NODE_ENV !== "production" && function() {
    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
    var i = Wg, u = dR(), c = i.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, p = !1;
    function y(e) {
      p = e;
    }
    function w(e) {
      if (!p) {
        for (var t = arguments.length, a = new Array(t > 1 ? t - 1 : 0), l = 1; l < t; l++)
          a[l - 1] = arguments[l];
        D("warn", e, a);
      }
    }
    function S(e) {
      if (!p) {
        for (var t = arguments.length, a = new Array(t > 1 ? t - 1 : 0), l = 1; l < t; l++)
          a[l - 1] = arguments[l];
        D("error", e, a);
      }
    }
    function D(e, t, a) {
      {
        var l = c.ReactDebugCurrentFrame, s = l.getStackAddendum();
        s !== "" && (t += "%s", a = a.concat([s]));
        var d = a.map(function(v) {
          return String(v);
        });
        d.unshift("Warning: " + t), Function.prototype.apply.call(console[e], console, d);
      }
    }
    var _ = 0, A = 1, U = 2, W = 3, X = 4, Q = 5, oe = 6, we = 7, ce = 8, Me = 9, ve = 10, Se = 11, O = 12, be = 13, le = 14, ye = 15, ht = 16, yt = 17, Je = 18, Ke = 19, ft = 21, Ee = 22, Ge = 23, xt = 24, it = 25, _t = !0, J = !1, De = !1, se = !1, ot = !1, ut = !0, Kt = !1, Zt = !0, fn = !0, zt = !0, On = !0, $t = /* @__PURE__ */ new Set(), mn = {}, xn = {};
    function yn(e, t) {
      Vn(e, t), Vn(e + "Capture", t);
    }
    function Vn(e, t) {
      mn[e] && S("EventRegistry: More than one plugin attempted to publish the same registration name, `%s`.", e), mn[e] = t;
      {
        var a = e.toLowerCase();
        xn[a] = e, e === "onDoubleClick" && (xn.ondblclick = e);
      }
      for (var l = 0; l < t.length; l++)
        $t.add(t[l]);
    }
    var Ie = typeof window < "u" && typeof window.document < "u" && typeof window.document.createElement < "u", vt = Object.prototype.hasOwnProperty;
    function Gt(e) {
      {
        var t = typeof Symbol == "function" && Symbol.toStringTag, a = t && e[Symbol.toStringTag] || e.constructor.name || "Object";
        return a;
      }
    }
    function Jt(e) {
      try {
        return dn(e), !1;
      } catch {
        return !0;
      }
    }
    function dn(e) {
      return "" + e;
    }
    function Bn(e, t) {
      if (Jt(e))
        return S("The provided `%s` attribute is an unsupported type %s. This value must be coerced to a string before before using it here.", t, Gt(e)), dn(e);
    }
    function zn(e) {
      if (Jt(e))
        return S("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", Gt(e)), dn(e);
    }
    function In(e, t) {
      if (Jt(e))
        return S("The provided `%s` prop is an unsupported type %s. This value must be coerced to a string before before using it here.", t, Gt(e)), dn(e);
    }
    function Wn(e, t) {
      if (Jt(e))
        return S("The provided `%s` CSS property is an unsupported type %s. This value must be coerced to a string before before using it here.", t, Gt(e)), dn(e);
    }
    function fr(e) {
      if (Jt(e))
        return S("The provided HTML markup uses a value of unsupported type %s. This value must be coerced to a string before before using it here.", Gt(e)), dn(e);
    }
    function Mn(e) {
      if (Jt(e))
        return S("Form field values (value, checked, defaultValue, or defaultChecked props) must be strings, not %s. This value must be coerced to a string before before using it here.", Gt(e)), dn(e);
    }
    var xr = 0, tr = 1, Tr = 2, an = 3, nr = 4, mi = 5, sa = 6, fe = ":A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD", Ye = fe + "\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040", mt = new RegExp("^[" + fe + "][" + Ye + "]*$"), P = {}, ue = {};
    function ke(e) {
      return vt.call(ue, e) ? !0 : vt.call(P, e) ? !1 : mt.test(e) ? (ue[e] = !0, !0) : (P[e] = !0, S("Invalid attribute name: `%s`", e), !1);
    }
    function qe(e, t, a) {
      return t !== null ? t.type === xr : a ? !1 : e.length > 2 && (e[0] === "o" || e[0] === "O") && (e[1] === "n" || e[1] === "N");
    }
    function tt(e, t, a, l) {
      if (a !== null && a.type === xr)
        return !1;
      switch (typeof t) {
        case "function":
        case "symbol":
          return !0;
        case "boolean": {
          if (l)
            return !1;
          if (a !== null)
            return !a.acceptsBooleans;
          var s = e.toLowerCase().slice(0, 5);
          return s !== "data-" && s !== "aria-";
        }
        default:
          return !1;
      }
    }
    function pt(e, t, a, l) {
      if (t === null || typeof t > "u" || tt(e, t, a, l))
        return !0;
      if (l)
        return !1;
      if (a !== null)
        switch (a.type) {
          case an:
            return !t;
          case nr:
            return t === !1;
          case mi:
            return isNaN(t);
          case sa:
            return isNaN(t) || t < 1;
        }
      return !1;
    }
    function tn(e) {
      return Bt.hasOwnProperty(e) ? Bt[e] : null;
    }
    function kt(e, t, a, l, s, d, v) {
      this.acceptsBooleans = t === Tr || t === an || t === nr, this.attributeName = l, this.attributeNamespace = s, this.mustUseProperty = a, this.propertyName = e, this.type = t, this.sanitizeURL = d, this.removeEmptyString = v;
    }
    var Bt = {}, Ir = [
      "children",
      "dangerouslySetInnerHTML",
      // TODO: This prevents the assignment of defaultValue to regular
      // elements (not just inputs). Now that ReactDOMInput assigns to the
      // defaultValue property -- do we need this?
      "defaultValue",
      "defaultChecked",
      "innerHTML",
      "suppressContentEditableWarning",
      "suppressHydrationWarning",
      "style"
    ];
    Ir.forEach(function(e) {
      Bt[e] = new kt(
        e,
        xr,
        !1,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(e) {
      var t = e[0], a = e[1];
      Bt[t] = new kt(
        t,
        tr,
        !1,
        // mustUseProperty
        a,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(e) {
      Bt[e] = new kt(
        e,
        Tr,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(e) {
      Bt[e] = new kt(
        e,
        Tr,
        !1,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "allowFullScreen",
      "async",
      // Note: there is a special case that prevents it from being written to the DOM
      // on the client side because the browsers are inconsistent. Instead we call focus().
      "autoFocus",
      "autoPlay",
      "controls",
      "default",
      "defer",
      "disabled",
      "disablePictureInPicture",
      "disableRemotePlayback",
      "formNoValidate",
      "hidden",
      "loop",
      "noModule",
      "noValidate",
      "open",
      "playsInline",
      "readOnly",
      "required",
      "reversed",
      "scoped",
      "seamless",
      // Microdata
      "itemScope"
    ].forEach(function(e) {
      Bt[e] = new kt(
        e,
        an,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "checked",
      // Note: `option.selected` is not updated if `select.multiple` is
      // disabled with `removeAttribute`. We have special logic for handling this.
      "multiple",
      "muted",
      "selected"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      Bt[e] = new kt(
        e,
        an,
        !0,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "capture",
      "download"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      Bt[e] = new kt(
        e,
        nr,
        !1,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "cols",
      "rows",
      "size",
      "span"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      Bt[e] = new kt(
        e,
        sa,
        !1,
        // mustUseProperty
        e,
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), ["rowSpan", "start"].forEach(function(e) {
      Bt[e] = new kt(
        e,
        mi,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    });
    var Za = /[\-\:]([a-z])/g, Ja = function(e) {
      return e[1].toUpperCase();
    };
    [
      "accent-height",
      "alignment-baseline",
      "arabic-form",
      "baseline-shift",
      "cap-height",
      "clip-path",
      "clip-rule",
      "color-interpolation",
      "color-interpolation-filters",
      "color-profile",
      "color-rendering",
      "dominant-baseline",
      "enable-background",
      "fill-opacity",
      "fill-rule",
      "flood-color",
      "flood-opacity",
      "font-family",
      "font-size",
      "font-size-adjust",
      "font-stretch",
      "font-style",
      "font-variant",
      "font-weight",
      "glyph-name",
      "glyph-orientation-horizontal",
      "glyph-orientation-vertical",
      "horiz-adv-x",
      "horiz-origin-x",
      "image-rendering",
      "letter-spacing",
      "lighting-color",
      "marker-end",
      "marker-mid",
      "marker-start",
      "overline-position",
      "overline-thickness",
      "paint-order",
      "panose-1",
      "pointer-events",
      "rendering-intent",
      "shape-rendering",
      "stop-color",
      "stop-opacity",
      "strikethrough-position",
      "strikethrough-thickness",
      "stroke-dasharray",
      "stroke-dashoffset",
      "stroke-linecap",
      "stroke-linejoin",
      "stroke-miterlimit",
      "stroke-opacity",
      "stroke-width",
      "text-anchor",
      "text-decoration",
      "text-rendering",
      "underline-position",
      "underline-thickness",
      "unicode-bidi",
      "unicode-range",
      "units-per-em",
      "v-alphabetic",
      "v-hanging",
      "v-ideographic",
      "v-mathematical",
      "vector-effect",
      "vert-adv-y",
      "vert-origin-x",
      "vert-origin-y",
      "word-spacing",
      "writing-mode",
      "xmlns:xlink",
      "x-height"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      var t = e.replace(Za, Ja);
      Bt[t] = new kt(
        t,
        tr,
        !1,
        // mustUseProperty
        e,
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "xlink:actuate",
      "xlink:arcrole",
      "xlink:role",
      "xlink:show",
      "xlink:title",
      "xlink:type"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      var t = e.replace(Za, Ja);
      Bt[t] = new kt(
        t,
        tr,
        !1,
        // mustUseProperty
        e,
        "http://www.w3.org/1999/xlink",
        !1,
        // sanitizeURL
        !1
      );
    }), [
      "xml:base",
      "xml:lang",
      "xml:space"
      // NOTE: if you add a camelCased prop to this list,
      // you'll need to set attributeName to name.toLowerCase()
      // instead in the assignment below.
    ].forEach(function(e) {
      var t = e.replace(Za, Ja);
      Bt[t] = new kt(
        t,
        tr,
        !1,
        // mustUseProperty
        e,
        "http://www.w3.org/XML/1998/namespace",
        !1,
        // sanitizeURL
        !1
      );
    }), ["tabIndex", "crossOrigin"].forEach(function(e) {
      Bt[e] = new kt(
        e,
        tr,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !1,
        // sanitizeURL
        !1
      );
    });
    var xa = "xlinkHref";
    Bt[xa] = new kt(
      "xlinkHref",
      tr,
      !1,
      // mustUseProperty
      "xlink:href",
      "http://www.w3.org/1999/xlink",
      !0,
      // sanitizeURL
      !1
    ), ["src", "href", "action", "formAction"].forEach(function(e) {
      Bt[e] = new kt(
        e,
        tr,
        !1,
        // mustUseProperty
        e.toLowerCase(),
        // attributeName
        null,
        // attributeNamespace
        !0,
        // sanitizeURL
        !0
      );
    });
    var Jo = /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*\:/i, ei = !1;
    function ti(e) {
      !ei && Jo.test(e) && (ei = !0, S("A future version of React will block javascript: URLs as a security precaution. Use event handlers instead if you can. If you need to generate unsafe HTML try using dangerouslySetInnerHTML instead. React was passed %s.", JSON.stringify(e)));
    }
    function Jl(e, t, a, l) {
      if (l.mustUseProperty) {
        var s = l.propertyName;
        return e[s];
      } else {
        Bn(a, t), l.sanitizeURL && ti("" + a);
        var d = l.attributeName, v = null;
        if (l.type === nr) {
          if (e.hasAttribute(d)) {
            var g = e.getAttribute(d);
            return g === "" ? !0 : pt(t, a, l, !1) ? g : g === "" + a ? a : g;
          }
        } else if (e.hasAttribute(d)) {
          if (pt(t, a, l, !1))
            return e.getAttribute(d);
          if (l.type === an)
            return a;
          v = e.getAttribute(d);
        }
        return pt(t, a, l, !1) ? v === null ? a : v : v === "" + a ? a : v;
      }
    }
    function eu(e, t, a, l) {
      {
        if (!ke(t))
          return;
        if (!e.hasAttribute(t))
          return a === void 0 ? void 0 : null;
        var s = e.getAttribute(t);
        return Bn(a, t), s === "" + a ? a : s;
      }
    }
    function yi(e, t, a, l) {
      var s = tn(t);
      if (!qe(t, s, l)) {
        if (pt(t, a, s, l) && (a = null), l || s === null) {
          if (ke(t)) {
            var d = t;
            a === null ? e.removeAttribute(d) : (Bn(a, t), e.setAttribute(d, "" + a));
          }
          return;
        }
        var v = s.mustUseProperty;
        if (v) {
          var g = s.propertyName;
          if (a === null) {
            var E = s.type;
            e[g] = E === an ? !1 : "";
          } else
            e[g] = a;
          return;
        }
        var b = s.attributeName, x = s.attributeNamespace;
        if (a === null)
          e.removeAttribute(b);
        else {
          var L = s.type, M;
          L === an || L === nr && a === !0 ? M = "" : (Bn(a, b), M = "" + a, s.sanitizeURL && ti(M.toString())), x ? e.setAttributeNS(x, b, M) : e.setAttribute(b, M);
        }
      }
    }
    var Hi = Symbol.for("react.element"), ca = Symbol.for("react.portal"), ni = Symbol.for("react.fragment"), ml = Symbol.for("react.strict_mode"), eo = Symbol.for("react.profiler"), R = Symbol.for("react.provider"), te = Symbol.for("react.context"), de = Symbol.for("react.forward_ref"), Pe = Symbol.for("react.suspense"), Tt = Symbol.for("react.suspense_list"), Ot = Symbol.for("react.memo"), Ze = Symbol.for("react.lazy"), gt = Symbol.for("react.scope"), rr = Symbol.for("react.debug_trace_mode"), ln = Symbol.for("react.offscreen"), gn = Symbol.for("react.legacy_hidden"), Wr = Symbol.for("react.cache"), yl = Symbol.for("react.tracing_marker"), Ft = Symbol.iterator, _r = "@@iterator";
    function fa(e) {
      if (e === null || typeof e != "object")
        return null;
      var t = Ft && e[Ft] || e[_r];
      return typeof t == "function" ? t : null;
    }
    var St = Object.assign, gi = 0, bv, Vd, fs, ri, xv, Ta, Tv;
    function _v() {
    }
    _v.__reactDisabledLog = !0;
    function a0() {
      {
        if (gi === 0) {
          bv = console.log, Vd = console.info, fs = console.warn, ri = console.error, xv = console.group, Ta = console.groupCollapsed, Tv = console.groupEnd;
          var e = {
            configurable: !0,
            enumerable: !0,
            value: _v,
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
        gi++;
      }
    }
    function Dc() {
      {
        if (gi--, gi === 0) {
          var e = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: St({}, e, {
              value: bv
            }),
            info: St({}, e, {
              value: Vd
            }),
            warn: St({}, e, {
              value: fs
            }),
            error: St({}, e, {
              value: ri
            }),
            group: St({}, e, {
              value: xv
            }),
            groupCollapsed: St({}, e, {
              value: Ta
            }),
            groupEnd: St({}, e, {
              value: Tv
            })
          });
        }
        gi < 0 && S("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var tu = c.ReactCurrentDispatcher, to;
    function ai(e, t, a) {
      {
        if (to === void 0)
          try {
            throw Error();
          } catch (s) {
            var l = s.stack.trim().match(/\n( *(at )?)/);
            to = l && l[1] || "";
          }
        return `
` + to + e;
      }
    }
    var Bd = !1, kc;
    {
      var Id = typeof WeakMap == "function" ? WeakMap : Map;
      kc = new Id();
    }
    function Oc(e, t) {
      if (!e || Bd)
        return "";
      {
        var a = kc.get(e);
        if (a !== void 0)
          return a;
      }
      var l;
      Bd = !0;
      var s = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var d;
      d = tu.current, tu.current = null, a0();
      try {
        if (t) {
          var v = function() {
            throw Error();
          };
          if (Object.defineProperty(v.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(v, []);
            } catch (I) {
              l = I;
            }
            Reflect.construct(e, [], v);
          } else {
            try {
              v.call();
            } catch (I) {
              l = I;
            }
            e.call(v.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (I) {
            l = I;
          }
          e();
        }
      } catch (I) {
        if (I && l && typeof I.stack == "string") {
          for (var g = I.stack.split(`
`), E = l.stack.split(`
`), b = g.length - 1, x = E.length - 1; b >= 1 && x >= 0 && g[b] !== E[x]; )
            x--;
          for (; b >= 1 && x >= 0; b--, x--)
            if (g[b] !== E[x]) {
              if (b !== 1 || x !== 1)
                do
                  if (b--, x--, x < 0 || g[b] !== E[x]) {
                    var L = `
` + g[b].replace(" at new ", " at ");
                    return e.displayName && L.includes("<anonymous>") && (L = L.replace("<anonymous>", e.displayName)), typeof e == "function" && kc.set(e, L), L;
                  }
                while (b >= 1 && x >= 0);
              break;
            }
        }
      } finally {
        Bd = !1, tu.current = d, Dc(), Error.prepareStackTrace = s;
      }
      var M = e ? e.displayName || e.name : "", V = M ? ai(M) : "";
      return typeof e == "function" && kc.set(e, V), V;
    }
    function Wd(e, t, a) {
      return Oc(e, !0);
    }
    function no(e, t, a) {
      return Oc(e, !1);
    }
    function i0(e) {
      var t = e.prototype;
      return !!(t && t.isReactComponent);
    }
    function ds(e, t, a) {
      if (e == null)
        return "";
      if (typeof e == "function")
        return Oc(e, i0(e));
      if (typeof e == "string")
        return ai(e);
      switch (e) {
        case Pe:
          return ai("Suspense");
        case Tt:
          return ai("SuspenseList");
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case de:
            return no(e.render);
          case Ot:
            return ds(e.type, t, a);
          case Ze: {
            var l = e, s = l._payload, d = l._init;
            try {
              return ds(d(s), t, a);
            } catch {
            }
          }
        }
      return "";
    }
    function It(e) {
      switch (e._debugOwner && e._debugOwner.type, e._debugSource, e.tag) {
        case Q:
          return ai(e.type);
        case ht:
          return ai("Lazy");
        case be:
          return ai("Suspense");
        case Ke:
          return ai("SuspenseList");
        case _:
        case U:
        case ye:
          return no(e.type);
        case Se:
          return no(e.type.render);
        case A:
          return Wd(e.type);
        default:
          return "";
      }
    }
    function $d(e) {
      try {
        var t = "", a = e;
        do
          t += It(a), a = a.return;
        while (a);
        return t;
      } catch (l) {
        return `
Error generating stack: ` + l.message + `
` + l.stack;
      }
    }
    function Rv(e, t, a) {
      var l = e.displayName;
      if (l)
        return l;
      var s = t.displayName || t.name || "";
      return s !== "" ? a + "(" + s + ")" : a;
    }
    function Mc(e) {
      return e.displayName || "Context";
    }
    function Wt(e) {
      if (e == null)
        return null;
      if (typeof e.tag == "number" && S("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof e == "function")
        return e.displayName || e.name || null;
      if (typeof e == "string")
        return e;
      switch (e) {
        case ni:
          return "Fragment";
        case ca:
          return "Portal";
        case eo:
          return "Profiler";
        case ml:
          return "StrictMode";
        case Pe:
          return "Suspense";
        case Tt:
          return "SuspenseList";
      }
      if (typeof e == "object")
        switch (e.$$typeof) {
          case te:
            var t = e;
            return Mc(t) + ".Consumer";
          case R:
            var a = e;
            return Mc(a._context) + ".Provider";
          case de:
            return Rv(e, e.render, "ForwardRef");
          case Ot:
            var l = e.displayName || null;
            return l !== null ? l : Wt(e.type) || "Memo";
          case Ze: {
            var s = e, d = s._payload, v = s._init;
            try {
              return Wt(v(d));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    function Dv(e, t, a) {
      var l = t.displayName || t.name || "";
      return e.displayName || (l !== "" ? a + "(" + l + ")" : a);
    }
    function Gd(e) {
      return e.displayName || "Context";
    }
    function st(e) {
      var t = e.tag, a = e.type;
      switch (t) {
        case xt:
          return "Cache";
        case Me:
          var l = a;
          return Gd(l) + ".Consumer";
        case ve:
          var s = a;
          return Gd(s._context) + ".Provider";
        case Je:
          return "DehydratedFragment";
        case Se:
          return Dv(a, a.render, "ForwardRef");
        case we:
          return "Fragment";
        case Q:
          return a;
        case X:
          return "Portal";
        case W:
          return "Root";
        case oe:
          return "Text";
        case ht:
          return Wt(a);
        case ce:
          return a === ml ? "StrictMode" : "Mode";
        case Ee:
          return "Offscreen";
        case O:
          return "Profiler";
        case ft:
          return "Scope";
        case be:
          return "Suspense";
        case Ke:
          return "SuspenseList";
        case it:
          return "TracingMarker";
        case A:
        case _:
        case yt:
        case U:
        case le:
        case ye:
          if (typeof a == "function")
            return a.displayName || a.name || null;
          if (typeof a == "string")
            return a;
          break;
      }
      return null;
    }
    var ps = c.ReactDebugCurrentFrame, jn = null, _a = !1;
    function Ra() {
      {
        if (jn === null)
          return null;
        var e = jn._debugOwner;
        if (e !== null && typeof e < "u")
          return st(e);
      }
      return null;
    }
    function hs() {
      return jn === null ? "" : $d(jn);
    }
    function $n() {
      ps.getCurrentStack = null, jn = null, _a = !1;
    }
    function Qt(e) {
      ps.getCurrentStack = e === null ? null : hs, jn = e, _a = !1;
    }
    function l0() {
      return jn;
    }
    function ii(e) {
      _a = e;
    }
    function Rr(e) {
      return "" + e;
    }
    function gl(e) {
      switch (typeof e) {
        case "boolean":
        case "number":
        case "string":
        case "undefined":
          return e;
        case "object":
          return Mn(e), e;
        default:
          return "";
      }
    }
    var kv = {
      button: !0,
      checkbox: !0,
      image: !0,
      hidden: !0,
      radio: !0,
      reset: !0,
      submit: !0
    };
    function nu(e, t) {
      kv[t.type] || t.onChange || t.onInput || t.readOnly || t.disabled || t.value == null || S("You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`."), t.onChange || t.readOnly || t.disabled || t.checked == null || S("You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.");
    }
    function Qd(e) {
      var t = e.type, a = e.nodeName;
      return a && a.toLowerCase() === "input" && (t === "checkbox" || t === "radio");
    }
    function Ov(e) {
      return e._valueTracker;
    }
    function vs(e) {
      e._valueTracker = null;
    }
    function ms(e) {
      var t = "";
      return e && (Qd(e) ? t = e.checked ? "true" : "false" : t = e.value), t;
    }
    function ru(e) {
      var t = Qd(e) ? "checked" : "value", a = Object.getOwnPropertyDescriptor(e.constructor.prototype, t);
      Mn(e[t]);
      var l = "" + e[t];
      if (!(e.hasOwnProperty(t) || typeof a > "u" || typeof a.get != "function" || typeof a.set != "function")) {
        var s = a.get, d = a.set;
        Object.defineProperty(e, t, {
          configurable: !0,
          get: function() {
            return s.call(this);
          },
          set: function(g) {
            Mn(g), l = "" + g, d.call(this, g);
          }
        }), Object.defineProperty(e, t, {
          enumerable: a.enumerable
        });
        var v = {
          getValue: function() {
            return l;
          },
          setValue: function(g) {
            Mn(g), l = "" + g;
          },
          stopTracking: function() {
            vs(e), delete e[t];
          }
        };
        return v;
      }
    }
    function ro(e) {
      Ov(e) || (e._valueTracker = ru(e));
    }
    function Mv(e) {
      if (!e)
        return !1;
      var t = Ov(e);
      if (!t)
        return !0;
      var a = t.getValue(), l = ms(e);
      return l !== a ? (t.setValue(l), !0) : !1;
    }
    function Nc(e) {
      if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u")
        return null;
      try {
        return e.activeElement || e.body;
      } catch {
        return e.body;
      }
    }
    var Lc = !1, ys = !1, Ac = !1, qd = !1;
    function Yi(e) {
      var t = e.type === "checkbox" || e.type === "radio";
      return t ? e.checked != null : e.value != null;
    }
    function gs(e, t) {
      var a = e, l = t.checked, s = St({}, t, {
        defaultChecked: void 0,
        defaultValue: void 0,
        value: void 0,
        checked: l ?? a._wrapperState.initialChecked
      });
      return s;
    }
    function Ss(e, t) {
      nu("input", t), t.checked !== void 0 && t.defaultChecked !== void 0 && !ys && (S("%s contains an input of type %s with both checked and defaultChecked props. Input elements must be either controlled or uncontrolled (specify either the checked prop, or the defaultChecked prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", Ra() || "A component", t.type), ys = !0), t.value !== void 0 && t.defaultValue !== void 0 && !Lc && (S("%s contains an input of type %s with both value and defaultValue props. Input elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled input element and remove one of these props. More info: https://reactjs.org/link/controlled-components", Ra() || "A component", t.type), Lc = !0);
      var a = e, l = t.defaultValue == null ? "" : t.defaultValue;
      a._wrapperState = {
        initialChecked: t.checked != null ? t.checked : t.defaultChecked,
        initialValue: gl(t.value != null ? t.value : l),
        controlled: Yi(t)
      };
    }
    function Xd(e, t) {
      var a = e, l = t.checked;
      l != null && yi(a, "checked", l, !1);
    }
    function au(e, t) {
      var a = e;
      {
        var l = Yi(t);
        !a._wrapperState.controlled && l && !qd && (S("A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components"), qd = !0), a._wrapperState.controlled && !l && !Ac && (S("A component is changing a controlled input to be uncontrolled. This is likely caused by the value changing from a defined to undefined, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components"), Ac = !0);
      }
      Xd(e, t);
      var s = gl(t.value), d = t.type;
      if (s != null)
        d === "number" ? (s === 0 && a.value === "" || // We explicitly want to coerce to number here if possible.
        // eslint-disable-next-line
        a.value != s) && (a.value = Rr(s)) : a.value !== Rr(s) && (a.value = Rr(s));
      else if (d === "submit" || d === "reset") {
        a.removeAttribute("value");
        return;
      }
      t.hasOwnProperty("value") ? Sl(a, t.type, s) : t.hasOwnProperty("defaultValue") && Sl(a, t.type, gl(t.defaultValue)), t.checked == null && t.defaultChecked != null && (a.defaultChecked = !!t.defaultChecked);
    }
    function Es(e, t, a) {
      var l = e;
      if (t.hasOwnProperty("value") || t.hasOwnProperty("defaultValue")) {
        var s = t.type, d = s === "submit" || s === "reset";
        if (d && (t.value === void 0 || t.value === null))
          return;
        var v = Rr(l._wrapperState.initialValue);
        a || v !== l.value && (l.value = v), l.defaultValue = v;
      }
      var g = l.name;
      g !== "" && (l.name = ""), l.defaultChecked = !l.defaultChecked, l.defaultChecked = !!l._wrapperState.initialChecked, g !== "" && (l.name = g);
    }
    function Nv(e, t) {
      var a = e;
      au(a, t), da(a, t);
    }
    function da(e, t) {
      var a = t.name;
      if (t.type === "radio" && a != null) {
        for (var l = e; l.parentNode; )
          l = l.parentNode;
        Bn(a, "name");
        for (var s = l.querySelectorAll("input[name=" + JSON.stringify("" + a) + '][type="radio"]'), d = 0; d < s.length; d++) {
          var v = s[d];
          if (!(v === e || v.form !== e.form)) {
            var g = dy(v);
            if (!g)
              throw new Error("ReactDOMInput: Mixing React and non-React radio inputs with the same `name` is not supported.");
            Mv(v), au(v, g);
          }
        }
      }
    }
    function Sl(e, t, a) {
      // Focused number inputs synchronize on blur. See ChangeEventPlugin.js
      (t !== "number" || Nc(e.ownerDocument) !== e) && (a == null ? e.defaultValue = Rr(e._wrapperState.initialValue) : e.defaultValue !== Rr(a) && (e.defaultValue = Rr(a)));
    }
    var Uc = !1, iu = !1, Lv = !1;
    function zc(e, t) {
      t.value == null && (typeof t.children == "object" && t.children !== null ? i.Children.forEach(t.children, function(a) {
        a != null && (typeof a == "string" || typeof a == "number" || iu || (iu = !0, S("Cannot infer the option value of complex children. Pass a `value` prop or use a plain string as children to <option>.")));
      }) : t.dangerouslySetInnerHTML != null && (Lv || (Lv = !0, S("Pass a `value` prop if you set dangerouslyInnerHTML so React knows which value should be selected.")))), t.selected != null && !Uc && (S("Use the `defaultValue` or `value` props on <select> instead of setting `selected` on <option>."), Uc = !0);
    }
    function Kd(e, t) {
      t.value != null && e.setAttribute("value", Rr(gl(t.value)));
    }
    var ws = Array.isArray;
    function ar(e) {
      return ws(e);
    }
    var jc;
    jc = !1;
    function Av() {
      var e = Ra();
      return e ? `

Check the render method of \`` + e + "`." : "";
    }
    var Uv = ["value", "defaultValue"];
    function o0(e) {
      {
        nu("select", e);
        for (var t = 0; t < Uv.length; t++) {
          var a = Uv[t];
          if (e[a] != null) {
            var l = ar(e[a]);
            e.multiple && !l ? S("The `%s` prop supplied to <select> must be an array if `multiple` is true.%s", a, Av()) : !e.multiple && l && S("The `%s` prop supplied to <select> must be a scalar value if `multiple` is false.%s", a, Av());
          }
        }
      }
    }
    function El(e, t, a, l) {
      var s = e.options;
      if (t) {
        for (var d = a, v = {}, g = 0; g < d.length; g++)
          v["$" + d[g]] = !0;
        for (var E = 0; E < s.length; E++) {
          var b = v.hasOwnProperty("$" + s[E].value);
          s[E].selected !== b && (s[E].selected = b), b && l && (s[E].defaultSelected = !0);
        }
      } else {
        for (var x = Rr(gl(a)), L = null, M = 0; M < s.length; M++) {
          if (s[M].value === x) {
            s[M].selected = !0, l && (s[M].defaultSelected = !0);
            return;
          }
          L === null && !s[M].disabled && (L = s[M]);
        }
        L !== null && (L.selected = !0);
      }
    }
    function Zd(e, t) {
      return St({}, t, {
        value: void 0
      });
    }
    function zv(e, t) {
      var a = e;
      o0(t), a._wrapperState = {
        wasMultiple: !!t.multiple
      }, t.value !== void 0 && t.defaultValue !== void 0 && !jc && (S("Select elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled select element and remove one of these props. More info: https://reactjs.org/link/controlled-components"), jc = !0);
    }
    function u0(e, t) {
      var a = e;
      a.multiple = !!t.multiple;
      var l = t.value;
      l != null ? El(a, !!t.multiple, l, !1) : t.defaultValue != null && El(a, !!t.multiple, t.defaultValue, !0);
    }
    function s0(e, t) {
      var a = e, l = a._wrapperState.wasMultiple;
      a._wrapperState.wasMultiple = !!t.multiple;
      var s = t.value;
      s != null ? El(a, !!t.multiple, s, !1) : l !== !!t.multiple && (t.defaultValue != null ? El(a, !!t.multiple, t.defaultValue, !0) : El(a, !!t.multiple, t.multiple ? [] : "", !1));
    }
    function c0(e, t) {
      var a = e, l = t.value;
      l != null && El(a, !!t.multiple, l, !1);
    }
    var Jd = !1;
    function ep(e, t) {
      var a = e;
      if (t.dangerouslySetInnerHTML != null)
        throw new Error("`dangerouslySetInnerHTML` does not make sense on <textarea>.");
      var l = St({}, t, {
        value: void 0,
        defaultValue: void 0,
        children: Rr(a._wrapperState.initialValue)
      });
      return l;
    }
    function jv(e, t) {
      var a = e;
      nu("textarea", t), t.value !== void 0 && t.defaultValue !== void 0 && !Jd && (S("%s contains a textarea with both value and defaultValue props. Textarea elements must be either controlled or uncontrolled (specify either the value prop, or the defaultValue prop, but not both). Decide between using a controlled or uncontrolled textarea and remove one of these props. More info: https://reactjs.org/link/controlled-components", Ra() || "A component"), Jd = !0);
      var l = t.value;
      if (l == null) {
        var s = t.children, d = t.defaultValue;
        if (s != null) {
          S("Use the `defaultValue` or `value` props instead of setting children on <textarea>.");
          {
            if (d != null)
              throw new Error("If you supply `defaultValue` on a <textarea>, do not pass children.");
            if (ar(s)) {
              if (s.length > 1)
                throw new Error("<textarea> can only have at most one child.");
              s = s[0];
            }
            d = s;
          }
        }
        d == null && (d = ""), l = d;
      }
      a._wrapperState = {
        initialValue: gl(l)
      };
    }
    function Fv(e, t) {
      var a = e, l = gl(t.value), s = gl(t.defaultValue);
      if (l != null) {
        var d = Rr(l);
        d !== a.value && (a.value = d), t.defaultValue == null && a.defaultValue !== d && (a.defaultValue = d);
      }
      s != null && (a.defaultValue = Rr(s));
    }
    function Hv(e, t) {
      var a = e, l = a.textContent;
      l === a._wrapperState.initialValue && l !== "" && l !== null && (a.value = l);
    }
    function tp(e, t) {
      Fv(e, t);
    }
    var Pi = "http://www.w3.org/1999/xhtml", f0 = "http://www.w3.org/1998/Math/MathML", np = "http://www.w3.org/2000/svg";
    function Fc(e) {
      switch (e) {
        case "svg":
          return np;
        case "math":
          return f0;
        default:
          return Pi;
      }
    }
    function rp(e, t) {
      return e == null || e === Pi ? Fc(t) : e === np && t === "foreignObject" ? Pi : e;
    }
    var d0 = function(e) {
      return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function(t, a, l, s) {
        MSApp.execUnsafeLocalFunction(function() {
          return e(t, a, l, s);
        });
      } : e;
    }, Hc, Yv = d0(function(e, t) {
      if (e.namespaceURI === np && !("innerHTML" in e)) {
        Hc = Hc || document.createElement("div"), Hc.innerHTML = "<svg>" + t.valueOf().toString() + "</svg>";
        for (var a = Hc.firstChild; e.firstChild; )
          e.removeChild(e.firstChild);
        for (; a.firstChild; )
          e.appendChild(a.firstChild);
        return;
      }
      e.innerHTML = t;
    }), $r = 1, Vi = 3, Fn = 8, li = 9, ao = 11, Yc = function(e, t) {
      if (t) {
        var a = e.firstChild;
        if (a && a === e.lastChild && a.nodeType === Vi) {
          a.nodeValue = t;
          return;
        }
      }
      e.textContent = t;
    }, Pv = {
      animation: ["animationDelay", "animationDirection", "animationDuration", "animationFillMode", "animationIterationCount", "animationName", "animationPlayState", "animationTimingFunction"],
      background: ["backgroundAttachment", "backgroundClip", "backgroundColor", "backgroundImage", "backgroundOrigin", "backgroundPositionX", "backgroundPositionY", "backgroundRepeat", "backgroundSize"],
      backgroundPosition: ["backgroundPositionX", "backgroundPositionY"],
      border: ["borderBottomColor", "borderBottomStyle", "borderBottomWidth", "borderImageOutset", "borderImageRepeat", "borderImageSlice", "borderImageSource", "borderImageWidth", "borderLeftColor", "borderLeftStyle", "borderLeftWidth", "borderRightColor", "borderRightStyle", "borderRightWidth", "borderTopColor", "borderTopStyle", "borderTopWidth"],
      borderBlockEnd: ["borderBlockEndColor", "borderBlockEndStyle", "borderBlockEndWidth"],
      borderBlockStart: ["borderBlockStartColor", "borderBlockStartStyle", "borderBlockStartWidth"],
      borderBottom: ["borderBottomColor", "borderBottomStyle", "borderBottomWidth"],
      borderColor: ["borderBottomColor", "borderLeftColor", "borderRightColor", "borderTopColor"],
      borderImage: ["borderImageOutset", "borderImageRepeat", "borderImageSlice", "borderImageSource", "borderImageWidth"],
      borderInlineEnd: ["borderInlineEndColor", "borderInlineEndStyle", "borderInlineEndWidth"],
      borderInlineStart: ["borderInlineStartColor", "borderInlineStartStyle", "borderInlineStartWidth"],
      borderLeft: ["borderLeftColor", "borderLeftStyle", "borderLeftWidth"],
      borderRadius: ["borderBottomLeftRadius", "borderBottomRightRadius", "borderTopLeftRadius", "borderTopRightRadius"],
      borderRight: ["borderRightColor", "borderRightStyle", "borderRightWidth"],
      borderStyle: ["borderBottomStyle", "borderLeftStyle", "borderRightStyle", "borderTopStyle"],
      borderTop: ["borderTopColor", "borderTopStyle", "borderTopWidth"],
      borderWidth: ["borderBottomWidth", "borderLeftWidth", "borderRightWidth", "borderTopWidth"],
      columnRule: ["columnRuleColor", "columnRuleStyle", "columnRuleWidth"],
      columns: ["columnCount", "columnWidth"],
      flex: ["flexBasis", "flexGrow", "flexShrink"],
      flexFlow: ["flexDirection", "flexWrap"],
      font: ["fontFamily", "fontFeatureSettings", "fontKerning", "fontLanguageOverride", "fontSize", "fontSizeAdjust", "fontStretch", "fontStyle", "fontVariant", "fontVariantAlternates", "fontVariantCaps", "fontVariantEastAsian", "fontVariantLigatures", "fontVariantNumeric", "fontVariantPosition", "fontWeight", "lineHeight"],
      fontVariant: ["fontVariantAlternates", "fontVariantCaps", "fontVariantEastAsian", "fontVariantLigatures", "fontVariantNumeric", "fontVariantPosition"],
      gap: ["columnGap", "rowGap"],
      grid: ["gridAutoColumns", "gridAutoFlow", "gridAutoRows", "gridTemplateAreas", "gridTemplateColumns", "gridTemplateRows"],
      gridArea: ["gridColumnEnd", "gridColumnStart", "gridRowEnd", "gridRowStart"],
      gridColumn: ["gridColumnEnd", "gridColumnStart"],
      gridColumnGap: ["columnGap"],
      gridGap: ["columnGap", "rowGap"],
      gridRow: ["gridRowEnd", "gridRowStart"],
      gridRowGap: ["rowGap"],
      gridTemplate: ["gridTemplateAreas", "gridTemplateColumns", "gridTemplateRows"],
      listStyle: ["listStyleImage", "listStylePosition", "listStyleType"],
      margin: ["marginBottom", "marginLeft", "marginRight", "marginTop"],
      marker: ["markerEnd", "markerMid", "markerStart"],
      mask: ["maskClip", "maskComposite", "maskImage", "maskMode", "maskOrigin", "maskPositionX", "maskPositionY", "maskRepeat", "maskSize"],
      maskPosition: ["maskPositionX", "maskPositionY"],
      outline: ["outlineColor", "outlineStyle", "outlineWidth"],
      overflow: ["overflowX", "overflowY"],
      padding: ["paddingBottom", "paddingLeft", "paddingRight", "paddingTop"],
      placeContent: ["alignContent", "justifyContent"],
      placeItems: ["alignItems", "justifyItems"],
      placeSelf: ["alignSelf", "justifySelf"],
      textDecoration: ["textDecorationColor", "textDecorationLine", "textDecorationStyle"],
      textEmphasis: ["textEmphasisColor", "textEmphasisStyle"],
      transition: ["transitionDelay", "transitionDuration", "transitionProperty", "transitionTimingFunction"],
      wordWrap: ["overflowWrap"]
    }, lu = {
      animationIterationCount: !0,
      aspectRatio: !0,
      borderImageOutset: !0,
      borderImageSlice: !0,
      borderImageWidth: !0,
      boxFlex: !0,
      boxFlexGroup: !0,
      boxOrdinalGroup: !0,
      columnCount: !0,
      columns: !0,
      flex: !0,
      flexGrow: !0,
      flexPositive: !0,
      flexShrink: !0,
      flexNegative: !0,
      flexOrder: !0,
      gridArea: !0,
      gridRow: !0,
      gridRowEnd: !0,
      gridRowSpan: !0,
      gridRowStart: !0,
      gridColumn: !0,
      gridColumnEnd: !0,
      gridColumnSpan: !0,
      gridColumnStart: !0,
      fontWeight: !0,
      lineClamp: !0,
      lineHeight: !0,
      opacity: !0,
      order: !0,
      orphans: !0,
      tabSize: !0,
      widows: !0,
      zIndex: !0,
      zoom: !0,
      // SVG-related properties
      fillOpacity: !0,
      floodOpacity: !0,
      stopOpacity: !0,
      strokeDasharray: !0,
      strokeDashoffset: !0,
      strokeMiterlimit: !0,
      strokeOpacity: !0,
      strokeWidth: !0
    };
    function Vv(e, t) {
      return e + t.charAt(0).toUpperCase() + t.substring(1);
    }
    var Bv = ["Webkit", "ms", "Moz", "O"];
    Object.keys(lu).forEach(function(e) {
      Bv.forEach(function(t) {
        lu[Vv(t, e)] = lu[e];
      });
    });
    function Pc(e, t, a) {
      var l = t == null || typeof t == "boolean" || t === "";
      return l ? "" : !a && typeof t == "number" && t !== 0 && !(lu.hasOwnProperty(e) && lu[e]) ? t + "px" : (Wn(t, e), ("" + t).trim());
    }
    var ou = /([A-Z])/g, p0 = /^ms-/;
    function h0(e) {
      return e.replace(ou, "-$1").toLowerCase().replace(p0, "-ms-");
    }
    var Iv = function() {
    };
    {
      var Wv = /^(?:webkit|moz|o)[A-Z]/, $v = /^-ms-/, Cs = /-(.)/g, uu = /;\s*$/, su = {}, cu = {}, Gv = !1, ap = !1, ip = function(e) {
        return e.replace(Cs, function(t, a) {
          return a.toUpperCase();
        });
      }, lp = function(e) {
        su.hasOwnProperty(e) && su[e] || (su[e] = !0, S(
          "Unsupported style property %s. Did you mean %s?",
          e,
          // As Andi Smith suggests
          // (http://www.andismith.com/blog/2012/02/modernizr-prefixed/), an `-ms` prefix
          // is converted to lowercase `ms`.
          ip(e.replace($v, "ms-"))
        ));
      }, Qv = function(e) {
        su.hasOwnProperty(e) && su[e] || (su[e] = !0, S("Unsupported vendor-prefixed style property %s. Did you mean %s?", e, e.charAt(0).toUpperCase() + e.slice(1)));
      }, qv = function(e, t) {
        cu.hasOwnProperty(t) && cu[t] || (cu[t] = !0, S(`Style property values shouldn't contain a semicolon. Try "%s: %s" instead.`, e, t.replace(uu, "")));
      }, Xv = function(e, t) {
        Gv || (Gv = !0, S("`NaN` is an invalid value for the `%s` css style property.", e));
      }, v0 = function(e, t) {
        ap || (ap = !0, S("`Infinity` is an invalid value for the `%s` css style property.", e));
      };
      Iv = function(e, t) {
        e.indexOf("-") > -1 ? lp(e) : Wv.test(e) ? Qv(e) : uu.test(t) && qv(e, t), typeof t == "number" && (isNaN(t) ? Xv(e, t) : isFinite(t) || v0(e, t));
      };
    }
    var m0 = Iv;
    function y0(e) {
      {
        var t = "", a = "";
        for (var l in e)
          if (e.hasOwnProperty(l)) {
            var s = e[l];
            if (s != null) {
              var d = l.indexOf("--") === 0;
              t += a + (d ? l : h0(l)) + ":", t += Pc(l, s, d), a = ";";
            }
          }
        return t || null;
      }
    }
    function Kv(e, t) {
      var a = e.style;
      for (var l in t)
        if (t.hasOwnProperty(l)) {
          var s = l.indexOf("--") === 0;
          s || m0(l, t[l]);
          var d = Pc(l, t[l], s);
          l === "float" && (l = "cssFloat"), s ? a.setProperty(l, d) : a[l] = d;
        }
    }
    function g0(e) {
      return e == null || typeof e == "boolean" || e === "";
    }
    function Da(e) {
      var t = {};
      for (var a in e)
        for (var l = Pv[a] || [a], s = 0; s < l.length; s++)
          t[l[s]] = a;
      return t;
    }
    function bs(e, t) {
      {
        if (!t)
          return;
        var a = Da(e), l = Da(t), s = {};
        for (var d in a) {
          var v = a[d], g = l[d];
          if (g && v !== g) {
            var E = v + "," + g;
            if (s[E])
              continue;
            s[E] = !0, S("%s a style property during rerender (%s) when a conflicting property is set (%s) can lead to styling bugs. To avoid this, don't mix shorthand and non-shorthand properties for the same value; instead, replace the shorthand with separate values.", g0(e[v]) ? "Removing" : "Updating", v, g);
          }
        }
      }
    }
    var Zv = {
      area: !0,
      base: !0,
      br: !0,
      col: !0,
      embed: !0,
      hr: !0,
      img: !0,
      input: !0,
      keygen: !0,
      link: !0,
      meta: !0,
      param: !0,
      source: !0,
      track: !0,
      wbr: !0
      // NOTE: menuitem's close tag should be omitted, but that causes problems.
    }, Jv = St({
      menuitem: !0
    }, Zv), em = "__html";
    function Vc(e, t) {
      if (t) {
        if (Jv[e] && (t.children != null || t.dangerouslySetInnerHTML != null))
          throw new Error(e + " is a void element tag and must neither have `children` nor use `dangerouslySetInnerHTML`.");
        if (t.dangerouslySetInnerHTML != null) {
          if (t.children != null)
            throw new Error("Can only set one of `children` or `props.dangerouslySetInnerHTML`.");
          if (typeof t.dangerouslySetInnerHTML != "object" || !(em in t.dangerouslySetInnerHTML))
            throw new Error("`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. Please visit https://reactjs.org/link/dangerously-set-inner-html for more information.");
        }
        if (!t.suppressContentEditableWarning && t.contentEditable && t.children != null && S("A component is `contentEditable` and contains `children` managed by React. It is now your responsibility to guarantee that none of those nodes are unexpectedly modified or duplicated. This is probably not intentional."), t.style != null && typeof t.style != "object")
          throw new Error("The `style` prop expects a mapping from style properties to values, not a string. For example, style={{marginRight: spacing + 'em'}} when using JSX.");
      }
    }
    function Bi(e, t) {
      if (e.indexOf("-") === -1)
        return typeof t.is == "string";
      switch (e) {
        case "annotation-xml":
        case "color-profile":
        case "font-face":
        case "font-face-src":
        case "font-face-uri":
        case "font-face-format":
        case "font-face-name":
        case "missing-glyph":
          return !1;
        default:
          return !0;
      }
    }
    var Bc = {
      // HTML
      accept: "accept",
      acceptcharset: "acceptCharset",
      "accept-charset": "acceptCharset",
      accesskey: "accessKey",
      action: "action",
      allowfullscreen: "allowFullScreen",
      alt: "alt",
      as: "as",
      async: "async",
      autocapitalize: "autoCapitalize",
      autocomplete: "autoComplete",
      autocorrect: "autoCorrect",
      autofocus: "autoFocus",
      autoplay: "autoPlay",
      autosave: "autoSave",
      capture: "capture",
      cellpadding: "cellPadding",
      cellspacing: "cellSpacing",
      challenge: "challenge",
      charset: "charSet",
      checked: "checked",
      children: "children",
      cite: "cite",
      class: "className",
      classid: "classID",
      classname: "className",
      cols: "cols",
      colspan: "colSpan",
      content: "content",
      contenteditable: "contentEditable",
      contextmenu: "contextMenu",
      controls: "controls",
      controlslist: "controlsList",
      coords: "coords",
      crossorigin: "crossOrigin",
      dangerouslysetinnerhtml: "dangerouslySetInnerHTML",
      data: "data",
      datetime: "dateTime",
      default: "default",
      defaultchecked: "defaultChecked",
      defaultvalue: "defaultValue",
      defer: "defer",
      dir: "dir",
      disabled: "disabled",
      disablepictureinpicture: "disablePictureInPicture",
      disableremoteplayback: "disableRemotePlayback",
      download: "download",
      draggable: "draggable",
      enctype: "encType",
      enterkeyhint: "enterKeyHint",
      for: "htmlFor",
      form: "form",
      formmethod: "formMethod",
      formaction: "formAction",
      formenctype: "formEncType",
      formnovalidate: "formNoValidate",
      formtarget: "formTarget",
      frameborder: "frameBorder",
      headers: "headers",
      height: "height",
      hidden: "hidden",
      high: "high",
      href: "href",
      hreflang: "hrefLang",
      htmlfor: "htmlFor",
      httpequiv: "httpEquiv",
      "http-equiv": "httpEquiv",
      icon: "icon",
      id: "id",
      imagesizes: "imageSizes",
      imagesrcset: "imageSrcSet",
      innerhtml: "innerHTML",
      inputmode: "inputMode",
      integrity: "integrity",
      is: "is",
      itemid: "itemID",
      itemprop: "itemProp",
      itemref: "itemRef",
      itemscope: "itemScope",
      itemtype: "itemType",
      keyparams: "keyParams",
      keytype: "keyType",
      kind: "kind",
      label: "label",
      lang: "lang",
      list: "list",
      loop: "loop",
      low: "low",
      manifest: "manifest",
      marginwidth: "marginWidth",
      marginheight: "marginHeight",
      max: "max",
      maxlength: "maxLength",
      media: "media",
      mediagroup: "mediaGroup",
      method: "method",
      min: "min",
      minlength: "minLength",
      multiple: "multiple",
      muted: "muted",
      name: "name",
      nomodule: "noModule",
      nonce: "nonce",
      novalidate: "noValidate",
      open: "open",
      optimum: "optimum",
      pattern: "pattern",
      placeholder: "placeholder",
      playsinline: "playsInline",
      poster: "poster",
      preload: "preload",
      profile: "profile",
      radiogroup: "radioGroup",
      readonly: "readOnly",
      referrerpolicy: "referrerPolicy",
      rel: "rel",
      required: "required",
      reversed: "reversed",
      role: "role",
      rows: "rows",
      rowspan: "rowSpan",
      sandbox: "sandbox",
      scope: "scope",
      scoped: "scoped",
      scrolling: "scrolling",
      seamless: "seamless",
      selected: "selected",
      shape: "shape",
      size: "size",
      sizes: "sizes",
      span: "span",
      spellcheck: "spellCheck",
      src: "src",
      srcdoc: "srcDoc",
      srclang: "srcLang",
      srcset: "srcSet",
      start: "start",
      step: "step",
      style: "style",
      summary: "summary",
      tabindex: "tabIndex",
      target: "target",
      title: "title",
      type: "type",
      usemap: "useMap",
      value: "value",
      width: "width",
      wmode: "wmode",
      wrap: "wrap",
      // SVG
      about: "about",
      accentheight: "accentHeight",
      "accent-height": "accentHeight",
      accumulate: "accumulate",
      additive: "additive",
      alignmentbaseline: "alignmentBaseline",
      "alignment-baseline": "alignmentBaseline",
      allowreorder: "allowReorder",
      alphabetic: "alphabetic",
      amplitude: "amplitude",
      arabicform: "arabicForm",
      "arabic-form": "arabicForm",
      ascent: "ascent",
      attributename: "attributeName",
      attributetype: "attributeType",
      autoreverse: "autoReverse",
      azimuth: "azimuth",
      basefrequency: "baseFrequency",
      baselineshift: "baselineShift",
      "baseline-shift": "baselineShift",
      baseprofile: "baseProfile",
      bbox: "bbox",
      begin: "begin",
      bias: "bias",
      by: "by",
      calcmode: "calcMode",
      capheight: "capHeight",
      "cap-height": "capHeight",
      clip: "clip",
      clippath: "clipPath",
      "clip-path": "clipPath",
      clippathunits: "clipPathUnits",
      cliprule: "clipRule",
      "clip-rule": "clipRule",
      color: "color",
      colorinterpolation: "colorInterpolation",
      "color-interpolation": "colorInterpolation",
      colorinterpolationfilters: "colorInterpolationFilters",
      "color-interpolation-filters": "colorInterpolationFilters",
      colorprofile: "colorProfile",
      "color-profile": "colorProfile",
      colorrendering: "colorRendering",
      "color-rendering": "colorRendering",
      contentscripttype: "contentScriptType",
      contentstyletype: "contentStyleType",
      cursor: "cursor",
      cx: "cx",
      cy: "cy",
      d: "d",
      datatype: "datatype",
      decelerate: "decelerate",
      descent: "descent",
      diffuseconstant: "diffuseConstant",
      direction: "direction",
      display: "display",
      divisor: "divisor",
      dominantbaseline: "dominantBaseline",
      "dominant-baseline": "dominantBaseline",
      dur: "dur",
      dx: "dx",
      dy: "dy",
      edgemode: "edgeMode",
      elevation: "elevation",
      enablebackground: "enableBackground",
      "enable-background": "enableBackground",
      end: "end",
      exponent: "exponent",
      externalresourcesrequired: "externalResourcesRequired",
      fill: "fill",
      fillopacity: "fillOpacity",
      "fill-opacity": "fillOpacity",
      fillrule: "fillRule",
      "fill-rule": "fillRule",
      filter: "filter",
      filterres: "filterRes",
      filterunits: "filterUnits",
      floodopacity: "floodOpacity",
      "flood-opacity": "floodOpacity",
      floodcolor: "floodColor",
      "flood-color": "floodColor",
      focusable: "focusable",
      fontfamily: "fontFamily",
      "font-family": "fontFamily",
      fontsize: "fontSize",
      "font-size": "fontSize",
      fontsizeadjust: "fontSizeAdjust",
      "font-size-adjust": "fontSizeAdjust",
      fontstretch: "fontStretch",
      "font-stretch": "fontStretch",
      fontstyle: "fontStyle",
      "font-style": "fontStyle",
      fontvariant: "fontVariant",
      "font-variant": "fontVariant",
      fontweight: "fontWeight",
      "font-weight": "fontWeight",
      format: "format",
      from: "from",
      fx: "fx",
      fy: "fy",
      g1: "g1",
      g2: "g2",
      glyphname: "glyphName",
      "glyph-name": "glyphName",
      glyphorientationhorizontal: "glyphOrientationHorizontal",
      "glyph-orientation-horizontal": "glyphOrientationHorizontal",
      glyphorientationvertical: "glyphOrientationVertical",
      "glyph-orientation-vertical": "glyphOrientationVertical",
      glyphref: "glyphRef",
      gradienttransform: "gradientTransform",
      gradientunits: "gradientUnits",
      hanging: "hanging",
      horizadvx: "horizAdvX",
      "horiz-adv-x": "horizAdvX",
      horizoriginx: "horizOriginX",
      "horiz-origin-x": "horizOriginX",
      ideographic: "ideographic",
      imagerendering: "imageRendering",
      "image-rendering": "imageRendering",
      in2: "in2",
      in: "in",
      inlist: "inlist",
      intercept: "intercept",
      k1: "k1",
      k2: "k2",
      k3: "k3",
      k4: "k4",
      k: "k",
      kernelmatrix: "kernelMatrix",
      kernelunitlength: "kernelUnitLength",
      kerning: "kerning",
      keypoints: "keyPoints",
      keysplines: "keySplines",
      keytimes: "keyTimes",
      lengthadjust: "lengthAdjust",
      letterspacing: "letterSpacing",
      "letter-spacing": "letterSpacing",
      lightingcolor: "lightingColor",
      "lighting-color": "lightingColor",
      limitingconeangle: "limitingConeAngle",
      local: "local",
      markerend: "markerEnd",
      "marker-end": "markerEnd",
      markerheight: "markerHeight",
      markermid: "markerMid",
      "marker-mid": "markerMid",
      markerstart: "markerStart",
      "marker-start": "markerStart",
      markerunits: "markerUnits",
      markerwidth: "markerWidth",
      mask: "mask",
      maskcontentunits: "maskContentUnits",
      maskunits: "maskUnits",
      mathematical: "mathematical",
      mode: "mode",
      numoctaves: "numOctaves",
      offset: "offset",
      opacity: "opacity",
      operator: "operator",
      order: "order",
      orient: "orient",
      orientation: "orientation",
      origin: "origin",
      overflow: "overflow",
      overlineposition: "overlinePosition",
      "overline-position": "overlinePosition",
      overlinethickness: "overlineThickness",
      "overline-thickness": "overlineThickness",
      paintorder: "paintOrder",
      "paint-order": "paintOrder",
      panose1: "panose1",
      "panose-1": "panose1",
      pathlength: "pathLength",
      patterncontentunits: "patternContentUnits",
      patterntransform: "patternTransform",
      patternunits: "patternUnits",
      pointerevents: "pointerEvents",
      "pointer-events": "pointerEvents",
      points: "points",
      pointsatx: "pointsAtX",
      pointsaty: "pointsAtY",
      pointsatz: "pointsAtZ",
      prefix: "prefix",
      preservealpha: "preserveAlpha",
      preserveaspectratio: "preserveAspectRatio",
      primitiveunits: "primitiveUnits",
      property: "property",
      r: "r",
      radius: "radius",
      refx: "refX",
      refy: "refY",
      renderingintent: "renderingIntent",
      "rendering-intent": "renderingIntent",
      repeatcount: "repeatCount",
      repeatdur: "repeatDur",
      requiredextensions: "requiredExtensions",
      requiredfeatures: "requiredFeatures",
      resource: "resource",
      restart: "restart",
      result: "result",
      results: "results",
      rotate: "rotate",
      rx: "rx",
      ry: "ry",
      scale: "scale",
      security: "security",
      seed: "seed",
      shaperendering: "shapeRendering",
      "shape-rendering": "shapeRendering",
      slope: "slope",
      spacing: "spacing",
      specularconstant: "specularConstant",
      specularexponent: "specularExponent",
      speed: "speed",
      spreadmethod: "spreadMethod",
      startoffset: "startOffset",
      stddeviation: "stdDeviation",
      stemh: "stemh",
      stemv: "stemv",
      stitchtiles: "stitchTiles",
      stopcolor: "stopColor",
      "stop-color": "stopColor",
      stopopacity: "stopOpacity",
      "stop-opacity": "stopOpacity",
      strikethroughposition: "strikethroughPosition",
      "strikethrough-position": "strikethroughPosition",
      strikethroughthickness: "strikethroughThickness",
      "strikethrough-thickness": "strikethroughThickness",
      string: "string",
      stroke: "stroke",
      strokedasharray: "strokeDasharray",
      "stroke-dasharray": "strokeDasharray",
      strokedashoffset: "strokeDashoffset",
      "stroke-dashoffset": "strokeDashoffset",
      strokelinecap: "strokeLinecap",
      "stroke-linecap": "strokeLinecap",
      strokelinejoin: "strokeLinejoin",
      "stroke-linejoin": "strokeLinejoin",
      strokemiterlimit: "strokeMiterlimit",
      "stroke-miterlimit": "strokeMiterlimit",
      strokewidth: "strokeWidth",
      "stroke-width": "strokeWidth",
      strokeopacity: "strokeOpacity",
      "stroke-opacity": "strokeOpacity",
      suppresscontenteditablewarning: "suppressContentEditableWarning",
      suppresshydrationwarning: "suppressHydrationWarning",
      surfacescale: "surfaceScale",
      systemlanguage: "systemLanguage",
      tablevalues: "tableValues",
      targetx: "targetX",
      targety: "targetY",
      textanchor: "textAnchor",
      "text-anchor": "textAnchor",
      textdecoration: "textDecoration",
      "text-decoration": "textDecoration",
      textlength: "textLength",
      textrendering: "textRendering",
      "text-rendering": "textRendering",
      to: "to",
      transform: "transform",
      typeof: "typeof",
      u1: "u1",
      u2: "u2",
      underlineposition: "underlinePosition",
      "underline-position": "underlinePosition",
      underlinethickness: "underlineThickness",
      "underline-thickness": "underlineThickness",
      unicode: "unicode",
      unicodebidi: "unicodeBidi",
      "unicode-bidi": "unicodeBidi",
      unicoderange: "unicodeRange",
      "unicode-range": "unicodeRange",
      unitsperem: "unitsPerEm",
      "units-per-em": "unitsPerEm",
      unselectable: "unselectable",
      valphabetic: "vAlphabetic",
      "v-alphabetic": "vAlphabetic",
      values: "values",
      vectoreffect: "vectorEffect",
      "vector-effect": "vectorEffect",
      version: "version",
      vertadvy: "vertAdvY",
      "vert-adv-y": "vertAdvY",
      vertoriginx: "vertOriginX",
      "vert-origin-x": "vertOriginX",
      vertoriginy: "vertOriginY",
      "vert-origin-y": "vertOriginY",
      vhanging: "vHanging",
      "v-hanging": "vHanging",
      videographic: "vIdeographic",
      "v-ideographic": "vIdeographic",
      viewbox: "viewBox",
      viewtarget: "viewTarget",
      visibility: "visibility",
      vmathematical: "vMathematical",
      "v-mathematical": "vMathematical",
      vocab: "vocab",
      widths: "widths",
      wordspacing: "wordSpacing",
      "word-spacing": "wordSpacing",
      writingmode: "writingMode",
      "writing-mode": "writingMode",
      x1: "x1",
      x2: "x2",
      x: "x",
      xchannelselector: "xChannelSelector",
      xheight: "xHeight",
      "x-height": "xHeight",
      xlinkactuate: "xlinkActuate",
      "xlink:actuate": "xlinkActuate",
      xlinkarcrole: "xlinkArcrole",
      "xlink:arcrole": "xlinkArcrole",
      xlinkhref: "xlinkHref",
      "xlink:href": "xlinkHref",
      xlinkrole: "xlinkRole",
      "xlink:role": "xlinkRole",
      xlinkshow: "xlinkShow",
      "xlink:show": "xlinkShow",
      xlinktitle: "xlinkTitle",
      "xlink:title": "xlinkTitle",
      xlinktype: "xlinkType",
      "xlink:type": "xlinkType",
      xmlbase: "xmlBase",
      "xml:base": "xmlBase",
      xmllang: "xmlLang",
      "xml:lang": "xmlLang",
      xmlns: "xmlns",
      "xml:space": "xmlSpace",
      xmlnsxlink: "xmlnsXlink",
      "xmlns:xlink": "xmlnsXlink",
      xmlspace: "xmlSpace",
      y1: "y1",
      y2: "y2",
      y: "y",
      ychannelselector: "yChannelSelector",
      z: "z",
      zoomandpan: "zoomAndPan"
    }, tm = {
      "aria-current": 0,
      // state
      "aria-description": 0,
      "aria-details": 0,
      "aria-disabled": 0,
      // state
      "aria-hidden": 0,
      // state
      "aria-invalid": 0,
      // state
      "aria-keyshortcuts": 0,
      "aria-label": 0,
      "aria-roledescription": 0,
      // Widget Attributes
      "aria-autocomplete": 0,
      "aria-checked": 0,
      "aria-expanded": 0,
      "aria-haspopup": 0,
      "aria-level": 0,
      "aria-modal": 0,
      "aria-multiline": 0,
      "aria-multiselectable": 0,
      "aria-orientation": 0,
      "aria-placeholder": 0,
      "aria-pressed": 0,
      "aria-readonly": 0,
      "aria-required": 0,
      "aria-selected": 0,
      "aria-sort": 0,
      "aria-valuemax": 0,
      "aria-valuemin": 0,
      "aria-valuenow": 0,
      "aria-valuetext": 0,
      // Live Region Attributes
      "aria-atomic": 0,
      "aria-busy": 0,
      "aria-live": 0,
      "aria-relevant": 0,
      // Drag-and-Drop Attributes
      "aria-dropeffect": 0,
      "aria-grabbed": 0,
      // Relationship Attributes
      "aria-activedescendant": 0,
      "aria-colcount": 0,
      "aria-colindex": 0,
      "aria-colspan": 0,
      "aria-controls": 0,
      "aria-describedby": 0,
      "aria-errormessage": 0,
      "aria-flowto": 0,
      "aria-labelledby": 0,
      "aria-owns": 0,
      "aria-posinset": 0,
      "aria-rowcount": 0,
      "aria-rowindex": 0,
      "aria-rowspan": 0,
      "aria-setsize": 0
    }, oi = {}, op = new RegExp("^(aria)-[" + Ye + "]*$"), xs = new RegExp("^(aria)[A-Z][" + Ye + "]*$");
    function up(e, t) {
      {
        if (vt.call(oi, t) && oi[t])
          return !0;
        if (xs.test(t)) {
          var a = "aria-" + t.slice(4).toLowerCase(), l = tm.hasOwnProperty(a) ? a : null;
          if (l == null)
            return S("Invalid ARIA attribute `%s`. ARIA attributes follow the pattern aria-* and must be lowercase.", t), oi[t] = !0, !0;
          if (t !== l)
            return S("Invalid ARIA attribute `%s`. Did you mean `%s`?", t, l), oi[t] = !0, !0;
        }
        if (op.test(t)) {
          var s = t.toLowerCase(), d = tm.hasOwnProperty(s) ? s : null;
          if (d == null)
            return oi[t] = !0, !1;
          if (t !== d)
            return S("Unknown ARIA attribute `%s`. Did you mean `%s`?", t, d), oi[t] = !0, !0;
        }
      }
      return !0;
    }
    function nm(e, t) {
      {
        var a = [];
        for (var l in t) {
          var s = up(e, l);
          s || a.push(l);
        }
        var d = a.map(function(v) {
          return "`" + v + "`";
        }).join(", ");
        a.length === 1 ? S("Invalid aria prop %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", d, e) : a.length > 1 && S("Invalid aria props %s on <%s> tag. For details, see https://reactjs.org/link/invalid-aria-props", d, e);
      }
    }
    function Ic(e, t) {
      Bi(e, t) || nm(e, t);
    }
    var io = !1;
    function sp(e, t) {
      {
        if (e !== "input" && e !== "textarea" && e !== "select")
          return;
        t != null && t.value === null && !io && (io = !0, e === "select" && t.multiple ? S("`value` prop on `%s` should not be null. Consider using an empty array when `multiple` is set to `true` to clear the component or `undefined` for uncontrolled components.", e) : S("`value` prop on `%s` should not be null. Consider using an empty string to clear the component or `undefined` for uncontrolled components.", e));
      }
    }
    var cp = function() {
    };
    {
      var ir = {}, fp = /^on./, rm = /^on[^A-Z]/, am = new RegExp("^(aria)-[" + Ye + "]*$"), im = new RegExp("^(aria)[A-Z][" + Ye + "]*$");
      cp = function(e, t, a, l) {
        if (vt.call(ir, t) && ir[t])
          return !0;
        var s = t.toLowerCase();
        if (s === "onfocusin" || s === "onfocusout")
          return S("React uses onFocus and onBlur instead of onFocusIn and onFocusOut. All React events are normalized to bubble, so onFocusIn and onFocusOut are not needed/supported by React."), ir[t] = !0, !0;
        if (l != null) {
          var d = l.registrationNameDependencies, v = l.possibleRegistrationNames;
          if (d.hasOwnProperty(t))
            return !0;
          var g = v.hasOwnProperty(s) ? v[s] : null;
          if (g != null)
            return S("Invalid event handler property `%s`. Did you mean `%s`?", t, g), ir[t] = !0, !0;
          if (fp.test(t))
            return S("Unknown event handler property `%s`. It will be ignored.", t), ir[t] = !0, !0;
        } else if (fp.test(t))
          return rm.test(t) && S("Invalid event handler property `%s`. React events use the camelCase naming convention, for example `onClick`.", t), ir[t] = !0, !0;
        if (am.test(t) || im.test(t))
          return !0;
        if (s === "innerhtml")
          return S("Directly setting property `innerHTML` is not permitted. For more information, lookup documentation on `dangerouslySetInnerHTML`."), ir[t] = !0, !0;
        if (s === "aria")
          return S("The `aria` attribute is reserved for future use in React. Pass individual `aria-` attributes instead."), ir[t] = !0, !0;
        if (s === "is" && a !== null && a !== void 0 && typeof a != "string")
          return S("Received a `%s` for a string attribute `is`. If this is expected, cast the value to a string.", typeof a), ir[t] = !0, !0;
        if (typeof a == "number" && isNaN(a))
          return S("Received NaN for the `%s` attribute. If this is expected, cast the value to a string.", t), ir[t] = !0, !0;
        var E = tn(t), b = E !== null && E.type === xr;
        if (Bc.hasOwnProperty(s)) {
          var x = Bc[s];
          if (x !== t)
            return S("Invalid DOM property `%s`. Did you mean `%s`?", t, x), ir[t] = !0, !0;
        } else if (!b && t !== s)
          return S("React does not recognize the `%s` prop on a DOM element. If you intentionally want it to appear in the DOM as a custom attribute, spell it as lowercase `%s` instead. If you accidentally passed it from a parent component, remove it from the DOM element.", t, s), ir[t] = !0, !0;
        return typeof a == "boolean" && tt(t, a, E, !1) ? (a ? S('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.', a, t, t, a, t) : S('Received `%s` for a non-boolean attribute `%s`.\n\nIf you want to write it to the DOM, pass a string instead: %s="%s" or %s={value.toString()}.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.', a, t, t, a, t, t, t), ir[t] = !0, !0) : b ? !0 : tt(t, a, E, !1) ? (ir[t] = !0, !1) : ((a === "false" || a === "true") && E !== null && E.type === an && (S("Received the string `%s` for the boolean attribute `%s`. %s Did you mean %s={%s}?", a, t, a === "false" ? "The browser will interpret it as a truthy value." : 'Although this works, it will not work as expected if you pass the string "false".', t, a), ir[t] = !0), !0);
      };
    }
    var lm = function(e, t, a) {
      {
        var l = [];
        for (var s in t) {
          var d = cp(e, s, t[s], a);
          d || l.push(s);
        }
        var v = l.map(function(g) {
          return "`" + g + "`";
        }).join(", ");
        l.length === 1 ? S("Invalid value for prop %s on <%s> tag. Either remove it from the element, or pass a string or number value to keep it in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", v, e) : l.length > 1 && S("Invalid values for props %s on <%s> tag. Either remove them from the element, or pass a string or number value to keep them in the DOM. For details, see https://reactjs.org/link/attribute-behavior ", v, e);
      }
    };
    function om(e, t, a) {
      Bi(e, t) || lm(e, t, a);
    }
    var Ii = 1, Ts = 2, lo = 4, S0 = Ii | Ts | lo, _s = null;
    function Rs(e) {
      _s !== null && S("Expected currently replaying event to be null. This error is likely caused by a bug in React. Please file an issue."), _s = e;
    }
    function E0() {
      _s === null && S("Expected currently replaying event to not be null. This error is likely caused by a bug in React. Please file an issue."), _s = null;
    }
    function um(e) {
      return e === _s;
    }
    function Wc(e) {
      var t = e.target || e.srcElement || window;
      return t.correspondingUseElement && (t = t.correspondingUseElement), t.nodeType === Vi ? t.parentNode : t;
    }
    var en = null, wl = null, Wi = null;
    function fu(e) {
      var t = Iu(e);
      if (t) {
        if (typeof en != "function")
          throw new Error("setRestoreImplementation() needs to be called to handle a target for controlled events. This error is likely caused by a bug in React. Please file an issue.");
        var a = t.stateNode;
        if (a) {
          var l = dy(a);
          en(t.stateNode, t.type, l);
        }
      }
    }
    function sm(e) {
      en = e;
    }
    function $c(e) {
      wl ? Wi ? Wi.push(e) : Wi = [e] : wl = e;
    }
    function Ds() {
      return wl !== null || Wi !== null;
    }
    function ks() {
      if (wl) {
        var e = wl, t = Wi;
        if (wl = null, Wi = null, fu(e), t)
          for (var a = 0; a < t.length; a++)
            fu(t[a]);
      }
    }
    var oo = function(e, t) {
      return e(t);
    }, dp = function() {
    }, pp = !1;
    function w0() {
      var e = Ds();
      e && (dp(), ks());
    }
    function hp(e, t, a) {
      if (pp)
        return e(t, a);
      pp = !0;
      try {
        return oo(e, t, a);
      } finally {
        pp = !1, w0();
      }
    }
    function Gc(e, t, a) {
      oo = e, dp = a;
    }
    function Qc(e) {
      return e === "button" || e === "input" || e === "select" || e === "textarea";
    }
    function vp(e, t, a) {
      switch (e) {
        case "onClick":
        case "onClickCapture":
        case "onDoubleClick":
        case "onDoubleClickCapture":
        case "onMouseDown":
        case "onMouseDownCapture":
        case "onMouseMove":
        case "onMouseMoveCapture":
        case "onMouseUp":
        case "onMouseUpCapture":
        case "onMouseEnter":
          return !!(a.disabled && Qc(t));
        default:
          return !1;
      }
    }
    function uo(e, t) {
      var a = e.stateNode;
      if (a === null)
        return null;
      var l = dy(a);
      if (l === null)
        return null;
      var s = l[t];
      if (vp(t, e.type, l))
        return null;
      if (s && typeof s != "function")
        throw new Error("Expected `" + t + "` listener to be a function, instead got a value of `" + typeof s + "` type.");
      return s;
    }
    var Os = !1;
    if (Ie)
      try {
        var so = {};
        Object.defineProperty(so, "passive", {
          get: function() {
            Os = !0;
          }
        }), window.addEventListener("test", so, so), window.removeEventListener("test", so, so);
      } catch {
        Os = !1;
      }
    function cm(e, t, a, l, s, d, v, g, E) {
      var b = Array.prototype.slice.call(arguments, 3);
      try {
        t.apply(a, b);
      } catch (x) {
        this.onError(x);
      }
    }
    var mp = cm;
    if (typeof window < "u" && typeof window.dispatchEvent == "function" && typeof document < "u" && typeof document.createEvent == "function") {
      var yp = document.createElement("react");
      mp = function(t, a, l, s, d, v, g, E, b) {
        if (typeof document > "u" || document === null)
          throw new Error("The `document` global was defined when React was initialized, but is not defined anymore. This can happen in a test environment if a component schedules an update from an asynchronous callback, but the test has already finished running. To solve this, you can either unmount the component at the end of your test (and ensure that any asynchronous operations get canceled in `componentWillUnmount`), or you can change the test itself to be asynchronous.");
        var x = document.createEvent("Event"), L = !1, M = !0, V = window.event, I = Object.getOwnPropertyDescriptor(window, "event");
        function $() {
          yp.removeEventListener(G, We, !1), typeof window.event < "u" && window.hasOwnProperty("event") && (window.event = V);
        }
        var ge = Array.prototype.slice.call(arguments, 3);
        function We() {
          L = !0, $(), a.apply(l, ge), M = !1;
        }
        var He, Dt = !1, bt = !1;
        function F(H) {
          if (He = H.error, Dt = !0, He === null && H.colno === 0 && H.lineno === 0 && (bt = !0), H.defaultPrevented && He != null && typeof He == "object")
            try {
              He._suppressLogging = !0;
            } catch {
            }
        }
        var G = "react-" + (t || "invokeguardedcallback");
        if (window.addEventListener("error", F), yp.addEventListener(G, We, !1), x.initEvent(G, !1, !1), yp.dispatchEvent(x), I && Object.defineProperty(window, "event", I), L && M && (Dt ? bt && (He = new Error("A cross-origin error was thrown. React doesn't have access to the actual error object in development. See https://reactjs.org/link/crossorigin-error for more information.")) : He = new Error(`An error was thrown inside one of your components, but React doesn't know what it was. This is likely due to browser flakiness. React does its best to preserve the "Pause on exceptions" behavior of the DevTools, which requires some DEV-mode only tricks. It's possible that these don't work in your browser. Try triggering the error in production mode, or switching to a modern browser. If you suspect that this is actually an issue with React, please file an issue.`), this.onError(He)), window.removeEventListener("error", F), !L)
          return $(), cm.apply(this, arguments);
      };
    }
    var C0 = mp, Cl = !1, ui = null, Ms = !1, bl = null, Si = {
      onError: function(e) {
        Cl = !0, ui = e;
      }
    };
    function co(e, t, a, l, s, d, v, g, E) {
      Cl = !1, ui = null, C0.apply(Si, arguments);
    }
    function $i(e, t, a, l, s, d, v, g, E) {
      if (co.apply(this, arguments), Cl) {
        var b = Sp();
        Ms || (Ms = !0, bl = b);
      }
    }
    function gp() {
      if (Ms) {
        var e = bl;
        throw Ms = !1, bl = null, e;
      }
    }
    function b0() {
      return Cl;
    }
    function Sp() {
      if (Cl) {
        var e = ui;
        return Cl = !1, ui = null, e;
      } else
        throw new Error("clearCaughtError was called but no error was captured. This error is likely caused by a bug in React. Please file an issue.");
    }
    function ka(e) {
      return e._reactInternals;
    }
    function Ns(e) {
      return e._reactInternals !== void 0;
    }
    function du(e, t) {
      e._reactInternals = t;
    }
    var Be = (
      /*                      */
      0
    ), xl = (
      /*                */
      1
    ), on = (
      /*                    */
      2
    ), dt = (
      /*                       */
      4
    ), jt = (
      /*                */
      16
    ), Ht = (
      /*                 */
      32
    ), Ei = (
      /*                     */
      64
    ), nt = (
      /*                   */
      128
    ), Tn = (
      /*            */
      256
    ), Gr = (
      /*                          */
      512
    ), Oa = (
      /*                     */
      1024
    ), pn = (
      /*                      */
      2048
    ), Ma = (
      /*                    */
      4096
    ), Tl = (
      /*                   */
      8192
    ), Ls = (
      /*             */
      16384
    ), qc = pn | dt | Ei | Gr | Oa | Ls, fm = (
      /*               */
      32767
    ), pa = (
      /*                   */
      32768
    ), lr = (
      /*                */
      65536
    ), As = (
      /* */
      131072
    ), Ep = (
      /*                       */
      1048576
    ), wp = (
      /*                    */
      2097152
    ), Qr = (
      /*                 */
      4194304
    ), _l = (
      /*                */
      8388608
    ), qr = (
      /*               */
      16777216
    ), fo = (
      /*              */
      33554432
    ), pu = (
      // TODO: Remove Update flag from before mutation phase by re-landing Visibility
      // flag logic (see #20043)
      dt | Oa | 0
    ), Xr = on | dt | jt | Ht | Gr | Ma | Tl, Dr = dt | Ei | Gr | Tl, Na = pn | jt, dr = Qr | _l | wp, Gi = c.ReactCurrentOwner;
    function ha(e) {
      var t = e, a = e;
      if (e.alternate)
        for (; t.return; )
          t = t.return;
      else {
        var l = t;
        do
          t = l, (t.flags & (on | Ma)) !== Be && (a = t.return), l = t.return;
        while (l);
      }
      return t.tag === W ? a : null;
    }
    function Cp(e) {
      if (e.tag === be) {
        var t = e.memoizedState;
        if (t === null) {
          var a = e.alternate;
          a !== null && (t = a.memoizedState);
        }
        if (t !== null)
          return t.dehydrated;
      }
      return null;
    }
    function Xc(e) {
      return e.tag === W ? e.stateNode.containerInfo : null;
    }
    function bp(e) {
      return ha(e) === e;
    }
    function va(e) {
      {
        var t = Gi.current;
        if (t !== null && t.tag === A) {
          var a = t, l = a.stateNode;
          l._warnedAboutRefsInRender || S("%s is accessing isMounted inside its render() function. render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", st(a) || "A component"), l._warnedAboutRefsInRender = !0;
        }
      }
      var s = ka(e);
      return s ? ha(s) === s : !1;
    }
    function Kr(e) {
      if (ha(e) !== e)
        throw new Error("Unable to find node on an unmounted component.");
    }
    function un(e) {
      var t = e.alternate;
      if (!t) {
        var a = ha(e);
        if (a === null)
          throw new Error("Unable to find node on an unmounted component.");
        return a !== e ? null : e;
      }
      for (var l = e, s = t; ; ) {
        var d = l.return;
        if (d === null)
          break;
        var v = d.alternate;
        if (v === null) {
          var g = d.return;
          if (g !== null) {
            l = s = g;
            continue;
          }
          break;
        }
        if (d.child === v.child) {
          for (var E = d.child; E; ) {
            if (E === l)
              return Kr(d), e;
            if (E === s)
              return Kr(d), t;
            E = E.sibling;
          }
          throw new Error("Unable to find node on an unmounted component.");
        }
        if (l.return !== s.return)
          l = d, s = v;
        else {
          for (var b = !1, x = d.child; x; ) {
            if (x === l) {
              b = !0, l = d, s = v;
              break;
            }
            if (x === s) {
              b = !0, s = d, l = v;
              break;
            }
            x = x.sibling;
          }
          if (!b) {
            for (x = v.child; x; ) {
              if (x === l) {
                b = !0, l = v, s = d;
                break;
              }
              if (x === s) {
                b = !0, s = v, l = d;
                break;
              }
              x = x.sibling;
            }
            if (!b)
              throw new Error("Child was not found in either parent set. This indicates a bug in React related to the return pointer. Please file an issue.");
          }
        }
        if (l.alternate !== s)
          throw new Error("Return fibers should always be each others' alternates. This error is likely caused by a bug in React. Please file an issue.");
      }
      if (l.tag !== W)
        throw new Error("Unable to find node on an unmounted component.");
      return l.stateNode.current === l ? e : t;
    }
    function La(e) {
      var t = un(e);
      return t !== null ? xp(t) : null;
    }
    function xp(e) {
      if (e.tag === Q || e.tag === oe)
        return e;
      for (var t = e.child; t !== null; ) {
        var a = xp(t);
        if (a !== null)
          return a;
        t = t.sibling;
      }
      return null;
    }
    function dm(e) {
      var t = un(e);
      return t !== null ? Kc(t) : null;
    }
    function Kc(e) {
      if (e.tag === Q || e.tag === oe)
        return e;
      for (var t = e.child; t !== null; ) {
        if (t.tag !== X) {
          var a = Kc(t);
          if (a !== null)
            return a;
        }
        t = t.sibling;
      }
      return null;
    }
    var Zc = u.unstable_scheduleCallback, pm = u.unstable_cancelCallback, Jc = u.unstable_shouldYield, hm = u.unstable_requestPaint, Sn = u.unstable_now, Tp = u.unstable_getCurrentPriorityLevel, ef = u.unstable_ImmediatePriority, po = u.unstable_UserBlockingPriority, wi = u.unstable_NormalPriority, vm = u.unstable_LowPriority, tf = u.unstable_IdlePriority, hu = u.unstable_yieldValue, mm = u.unstable_setDisableYieldValue, Qi = null, Gn = null, pe = null, Aa = !1, ma = typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u";
    function _p(e) {
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u")
        return !1;
      var t = __REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (t.isDisabled)
        return !0;
      if (!t.supportsFiber)
        return S("The installed version of React DevTools is too old and will not work with the current version of React. Please update React DevTools. https://reactjs.org/link/react-devtools"), !0;
      try {
        fn && (e = St({}, e, {
          getLaneLabelMap: qi,
          injectProfilingHooks: ym
        })), Qi = t.inject(e), Gn = t;
      } catch (a) {
        S("React instrumentation encountered an error: %s.", a);
      }
      return !!t.checkDCE;
    }
    function Rp(e, t) {
      if (Gn && typeof Gn.onScheduleFiberRoot == "function")
        try {
          Gn.onScheduleFiberRoot(Qi, e, t);
        } catch (a) {
          Aa || (Aa = !0, S("React instrumentation encountered an error: %s", a));
        }
    }
    function vu(e, t) {
      if (Gn && typeof Gn.onCommitFiberRoot == "function")
        try {
          var a = (e.current.flags & nt) === nt;
          if (zt) {
            var l;
            switch (t) {
              case Ln:
                l = ef;
                break;
              case Ki:
                l = po;
                break;
              case Ci:
                l = wi;
                break;
              case Ru:
                l = tf;
                break;
              default:
                l = wi;
                break;
            }
            Gn.onCommitFiberRoot(Qi, e, l, a);
          }
        } catch (s) {
          Aa || (Aa = !0, S("React instrumentation encountered an error: %s", s));
        }
    }
    function Ua(e) {
      if (Gn && typeof Gn.onPostCommitFiberRoot == "function")
        try {
          Gn.onPostCommitFiberRoot(Qi, e);
        } catch (t) {
          Aa || (Aa = !0, S("React instrumentation encountered an error: %s", t));
        }
    }
    function ho(e) {
      if (Gn && typeof Gn.onCommitFiberUnmount == "function")
        try {
          Gn.onCommitFiberUnmount(Qi, e);
        } catch (t) {
          Aa || (Aa = !0, S("React instrumentation encountered an error: %s", t));
        }
    }
    function Hn(e) {
      if (typeof hu == "function" && (mm(e), y(e)), Gn && typeof Gn.setStrictMode == "function")
        try {
          Gn.setStrictMode(Qi, e);
        } catch (t) {
          Aa || (Aa = !0, S("React instrumentation encountered an error: %s", t));
        }
    }
    function ym(e) {
      pe = e;
    }
    function qi() {
      {
        for (var e = /* @__PURE__ */ new Map(), t = 1, a = 0; a < Hs; a++) {
          var l = T0(t);
          e.set(t, l), t *= 2;
        }
        return e;
      }
    }
    function Rl(e) {
      pe !== null && typeof pe.markCommitStarted == "function" && pe.markCommitStarted(e);
    }
    function nf() {
      pe !== null && typeof pe.markCommitStopped == "function" && pe.markCommitStopped();
    }
    function mu(e) {
      pe !== null && typeof pe.markComponentRenderStarted == "function" && pe.markComponentRenderStarted(e);
    }
    function Zr() {
      pe !== null && typeof pe.markComponentRenderStopped == "function" && pe.markComponentRenderStopped();
    }
    function Dl(e) {
      pe !== null && typeof pe.markComponentPassiveEffectMountStarted == "function" && pe.markComponentPassiveEffectMountStarted(e);
    }
    function rf() {
      pe !== null && typeof pe.markComponentPassiveEffectMountStopped == "function" && pe.markComponentPassiveEffectMountStopped();
    }
    function gm(e) {
      pe !== null && typeof pe.markComponentPassiveEffectUnmountStarted == "function" && pe.markComponentPassiveEffectUnmountStarted(e);
    }
    function af() {
      pe !== null && typeof pe.markComponentPassiveEffectUnmountStopped == "function" && pe.markComponentPassiveEffectUnmountStopped();
    }
    function Sm(e) {
      pe !== null && typeof pe.markComponentLayoutEffectMountStarted == "function" && pe.markComponentLayoutEffectMountStarted(e);
    }
    function Us() {
      pe !== null && typeof pe.markComponentLayoutEffectMountStopped == "function" && pe.markComponentLayoutEffectMountStopped();
    }
    function si(e) {
      pe !== null && typeof pe.markComponentLayoutEffectUnmountStarted == "function" && pe.markComponentLayoutEffectUnmountStarted(e);
    }
    function yu() {
      pe !== null && typeof pe.markComponentLayoutEffectUnmountStopped == "function" && pe.markComponentLayoutEffectUnmountStopped();
    }
    function zs(e, t, a) {
      pe !== null && typeof pe.markComponentErrored == "function" && pe.markComponentErrored(e, t, a);
    }
    function vo(e, t, a) {
      pe !== null && typeof pe.markComponentSuspended == "function" && pe.markComponentSuspended(e, t, a);
    }
    function Dp(e) {
      pe !== null && typeof pe.markLayoutEffectsStarted == "function" && pe.markLayoutEffectsStarted(e);
    }
    function gu() {
      pe !== null && typeof pe.markLayoutEffectsStopped == "function" && pe.markLayoutEffectsStopped();
    }
    function Em(e) {
      pe !== null && typeof pe.markPassiveEffectsStarted == "function" && pe.markPassiveEffectsStarted(e);
    }
    function kp() {
      pe !== null && typeof pe.markPassiveEffectsStopped == "function" && pe.markPassiveEffectsStopped();
    }
    function hn(e) {
      pe !== null && typeof pe.markRenderStarted == "function" && pe.markRenderStarted(e);
    }
    function lf() {
      pe !== null && typeof pe.markRenderYielded == "function" && pe.markRenderYielded();
    }
    function of() {
      pe !== null && typeof pe.markRenderStopped == "function" && pe.markRenderStopped();
    }
    function Op(e) {
      pe !== null && typeof pe.markRenderScheduled == "function" && pe.markRenderScheduled(e);
    }
    function uf(e, t) {
      pe !== null && typeof pe.markForceUpdateScheduled == "function" && pe.markForceUpdateScheduled(e, t);
    }
    function js(e, t) {
      pe !== null && typeof pe.markStateUpdateScheduled == "function" && pe.markStateUpdateScheduled(e, t);
    }
    var ze = (
      /*                         */
      0
    ), Fe = (
      /*                 */
      1
    ), rt = (
      /*                    */
      2
    ), Et = (
      /*               */
      8
    ), ya = (
      /*              */
      16
    ), Su = Math.clz32 ? Math.clz32 : kr, Fs = Math.log, x0 = Math.LN2;
    function kr(e) {
      var t = e >>> 0;
      return t === 0 ? 32 : 31 - (Fs(t) / x0 | 0) | 0;
    }
    var Hs = 31, K = (
      /*                        */
      0
    ), Yn = (
      /*                          */
      0
    ), Ve = (
      /*                        */
      1
    ), pr = (
      /*    */
      2
    ), ga = (
      /*             */
      4
    ), Xi = (
      /*            */
      8
    ), za = (
      /*                     */
      16
    ), Eu = (
      /*                */
      32
    ), mo = (
      /*                       */
      4194240
    ), wu = (
      /*                        */
      64
    ), sf = (
      /*                        */
      128
    ), cf = (
      /*                        */
      256
    ), ff = (
      /*                        */
      512
    ), df = (
      /*                        */
      1024
    ), pf = (
      /*                        */
      2048
    ), yo = (
      /*                        */
      4096
    ), hf = (
      /*                        */
      8192
    ), Cu = (
      /*                        */
      16384
    ), bu = (
      /*                       */
      32768
    ), vf = (
      /*                       */
      65536
    ), Ys = (
      /*                       */
      131072
    ), mf = (
      /*                       */
      262144
    ), yf = (
      /*                       */
      524288
    ), gf = (
      /*                       */
      1048576
    ), Sf = (
      /*                       */
      2097152
    ), xu = (
      /*                            */
      130023424
    ), go = (
      /*                             */
      4194304
    ), Ef = (
      /*                             */
      8388608
    ), wf = (
      /*                             */
      16777216
    ), Mp = (
      /*                             */
      33554432
    ), Cf = (
      /*                             */
      67108864
    ), wm = go, Ps = (
      /*          */
      134217728
    ), Np = (
      /*                          */
      268435455
    ), Tu = (
      /*               */
      268435456
    ), kl = (
      /*                        */
      536870912
    ), Or = (
      /*                   */
      1073741824
    );
    function T0(e) {
      {
        if (e & Ve)
          return "Sync";
        if (e & pr)
          return "InputContinuousHydration";
        if (e & ga)
          return "InputContinuous";
        if (e & Xi)
          return "DefaultHydration";
        if (e & za)
          return "Default";
        if (e & Eu)
          return "TransitionHydration";
        if (e & mo)
          return "Transition";
        if (e & xu)
          return "Retry";
        if (e & Ps)
          return "SelectiveHydration";
        if (e & Tu)
          return "IdleHydration";
        if (e & kl)
          return "Idle";
        if (e & Or)
          return "Offscreen";
      }
    }
    var nn = -1, bf = wu, Jr = go;
    function So(e) {
      switch (Nn(e)) {
        case Ve:
          return Ve;
        case pr:
          return pr;
        case ga:
          return ga;
        case Xi:
          return Xi;
        case za:
          return za;
        case Eu:
          return Eu;
        case wu:
        case sf:
        case cf:
        case ff:
        case df:
        case pf:
        case yo:
        case hf:
        case Cu:
        case bu:
        case vf:
        case Ys:
        case mf:
        case yf:
        case gf:
        case Sf:
          return e & mo;
        case go:
        case Ef:
        case wf:
        case Mp:
        case Cf:
          return e & xu;
        case Ps:
          return Ps;
        case Tu:
          return Tu;
        case kl:
          return kl;
        case Or:
          return Or;
        default:
          return S("Should have found matching lanes. This is a bug in React."), e;
      }
    }
    function Eo(e, t) {
      var a = e.pendingLanes;
      if (a === K)
        return K;
      var l = K, s = e.suspendedLanes, d = e.pingedLanes, v = a & Np;
      if (v !== K) {
        var g = v & ~s;
        if (g !== K)
          l = So(g);
        else {
          var E = v & d;
          E !== K && (l = So(E));
        }
      } else {
        var b = a & ~s;
        b !== K ? l = So(b) : d !== K && (l = So(d));
      }
      if (l === K)
        return K;
      if (t !== K && t !== l && // If we already suspended with a delay, then interrupting is fine. Don't
      // bother waiting until the root is complete.
      (t & s) === K) {
        var x = Nn(l), L = Nn(t);
        if (
          // Tests whether the next lane is equal or lower priority than the wip
          // one. This works because the bits decrease in priority as you go left.
          x >= L || // Default priority updates should not interrupt transition updates. The
          // only difference between default updates and transition updates is that
          // default updates do not support refresh transitions.
          x === za && (L & mo) !== K
        )
          return t;
      }
      (l & ga) !== K && (l |= a & za);
      var M = e.entangledLanes;
      if (M !== K)
        for (var V = e.entanglements, I = l & M; I > 0; ) {
          var $ = Ml(I), ge = 1 << $;
          l |= V[$], I &= ~ge;
        }
      return l;
    }
    function Cm(e, t) {
      for (var a = e.eventTimes, l = nn; t > 0; ) {
        var s = Ml(t), d = 1 << s, v = a[s];
        v > l && (l = v), t &= ~d;
      }
      return l;
    }
    function bm(e, t) {
      switch (e) {
        case Ve:
        case pr:
        case ga:
          return t + 250;
        case Xi:
        case za:
        case Eu:
        case wu:
        case sf:
        case cf:
        case ff:
        case df:
        case pf:
        case yo:
        case hf:
        case Cu:
        case bu:
        case vf:
        case Ys:
        case mf:
        case yf:
        case gf:
        case Sf:
          return t + 5e3;
        case go:
        case Ef:
        case wf:
        case Mp:
        case Cf:
          return nn;
        case Ps:
        case Tu:
        case kl:
        case Or:
          return nn;
        default:
          return S("Should have found matching lanes. This is a bug in React."), nn;
      }
    }
    function xm(e, t) {
      for (var a = e.pendingLanes, l = e.suspendedLanes, s = e.pingedLanes, d = e.expirationTimes, v = a; v > 0; ) {
        var g = Ml(v), E = 1 << g, b = d[g];
        b === nn ? ((E & l) === K || (E & s) !== K) && (d[g] = bm(E, t)) : b <= t && (e.expiredLanes |= E), v &= ~E;
      }
    }
    function Lp(e) {
      return So(e.pendingLanes);
    }
    function Ol(e) {
      var t = e.pendingLanes & ~Or;
      return t !== K ? t : t & Or ? Or : K;
    }
    function Ap(e) {
      return (e & Ve) !== K;
    }
    function Vs(e) {
      return (e & Np) !== K;
    }
    function Tm(e) {
      return (e & xu) === e;
    }
    function _m(e) {
      var t = Ve | ga | za;
      return (e & t) === K;
    }
    function Rm(e) {
      return (e & mo) === e;
    }
    function Bs(e, t) {
      var a = pr | ga | Xi | za;
      return (t & a) !== K;
    }
    function Dm(e, t) {
      return (t & e.expiredLanes) !== K;
    }
    function Up(e) {
      return (e & mo) !== K;
    }
    function km() {
      var e = bf;
      return bf <<= 1, (bf & mo) === K && (bf = wu), e;
    }
    function ea() {
      var e = Jr;
      return Jr <<= 1, (Jr & xu) === K && (Jr = go), e;
    }
    function Nn(e) {
      return e & -e;
    }
    function _u(e) {
      return Nn(e);
    }
    function Ml(e) {
      return 31 - Su(e);
    }
    function xf(e) {
      return Ml(e);
    }
    function ta(e, t) {
      return (e & t) !== K;
    }
    function wo(e, t) {
      return (e & t) === t;
    }
    function ct(e, t) {
      return e | t;
    }
    function Is(e, t) {
      return e & ~t;
    }
    function Tf(e, t) {
      return e & t;
    }
    function _0(e) {
      return e;
    }
    function Om(e, t) {
      return e !== Yn && e < t ? e : t;
    }
    function Ws(e) {
      for (var t = [], a = 0; a < Hs; a++)
        t.push(e);
      return t;
    }
    function Co(e, t, a) {
      e.pendingLanes |= t, t !== kl && (e.suspendedLanes = K, e.pingedLanes = K);
      var l = e.eventTimes, s = xf(t);
      l[s] = a;
    }
    function Mm(e, t) {
      e.suspendedLanes |= t, e.pingedLanes &= ~t;
      for (var a = e.expirationTimes, l = t; l > 0; ) {
        var s = Ml(l), d = 1 << s;
        a[s] = nn, l &= ~d;
      }
    }
    function _f(e, t, a) {
      e.pingedLanes |= e.suspendedLanes & t;
    }
    function Rf(e, t) {
      var a = e.pendingLanes & ~t;
      e.pendingLanes = t, e.suspendedLanes = K, e.pingedLanes = K, e.expiredLanes &= t, e.mutableReadLanes &= t, e.entangledLanes &= t;
      for (var l = e.entanglements, s = e.eventTimes, d = e.expirationTimes, v = a; v > 0; ) {
        var g = Ml(v), E = 1 << g;
        l[g] = K, s[g] = nn, d[g] = nn, v &= ~E;
      }
    }
    function zp(e, t) {
      for (var a = e.entangledLanes |= t, l = e.entanglements, s = a; s; ) {
        var d = Ml(s), v = 1 << d;
        // Is this one of the newly entangled lanes?
        v & t | // Is this lane transitively entangled with the newly entangled lanes?
        l[d] & t && (l[d] |= t), s &= ~v;
      }
    }
    function Nm(e, t) {
      var a = Nn(t), l;
      switch (a) {
        case ga:
          l = pr;
          break;
        case za:
          l = Xi;
          break;
        case wu:
        case sf:
        case cf:
        case ff:
        case df:
        case pf:
        case yo:
        case hf:
        case Cu:
        case bu:
        case vf:
        case Ys:
        case mf:
        case yf:
        case gf:
        case Sf:
        case go:
        case Ef:
        case wf:
        case Mp:
        case Cf:
          l = Eu;
          break;
        case kl:
          l = Tu;
          break;
        default:
          l = Yn;
          break;
      }
      return (l & (e.suspendedLanes | t)) !== Yn ? Yn : l;
    }
    function Df(e, t, a) {
      if (ma)
        for (var l = e.pendingUpdatersLaneMap; a > 0; ) {
          var s = xf(a), d = 1 << s, v = l[s];
          v.add(t), a &= ~d;
        }
    }
    function jp(e, t) {
      if (ma)
        for (var a = e.pendingUpdatersLaneMap, l = e.memoizedUpdaters; t > 0; ) {
          var s = xf(t), d = 1 << s, v = a[s];
          v.size > 0 && (v.forEach(function(g) {
            var E = g.alternate;
            (E === null || !l.has(E)) && l.add(g);
          }), v.clear()), t &= ~d;
        }
    }
    function $s(e, t) {
      return null;
    }
    var Ln = Ve, Ki = ga, Ci = za, Ru = kl, Du = Yn;
    function ja() {
      return Du;
    }
    function _n(e) {
      Du = e;
    }
    function Mr(e, t) {
      var a = Du;
      try {
        return Du = e, t();
      } finally {
        Du = a;
      }
    }
    function R0(e, t) {
      return e !== 0 && e < t ? e : t;
    }
    function D0(e, t) {
      return e > t ? e : t;
    }
    function ku(e, t) {
      return e !== 0 && e < t;
    }
    function hr(e) {
      var t = Nn(e);
      return ku(Ln, t) ? ku(Ki, t) ? Vs(t) ? Ci : Ru : Ki : Ln;
    }
    function kf(e) {
      var t = e.current.memoizedState;
      return t.isDehydrated;
    }
    var Re;
    function Ou(e) {
      Re = e;
    }
    function Fp(e) {
      Re(e);
    }
    var Of;
    function k0(e) {
      Of = e;
    }
    var Mu;
    function Mf(e) {
      Mu = e;
    }
    var Nf;
    function Lm(e) {
      Nf = e;
    }
    var Hp;
    function Am(e) {
      Hp = e;
    }
    var Gs = !1, Nu = [], vn = null, or = null, Lr = null, Lu = /* @__PURE__ */ new Map(), Au = /* @__PURE__ */ new Map(), ur = [], Um = [
      "mousedown",
      "mouseup",
      "touchcancel",
      "touchend",
      "touchstart",
      "auxclick",
      "dblclick",
      "pointercancel",
      "pointerdown",
      "pointerup",
      "dragend",
      "dragstart",
      "drop",
      "compositionend",
      "compositionstart",
      "keydown",
      "keypress",
      "keyup",
      "input",
      "textInput",
      // Intentionally camelCase
      "copy",
      "cut",
      "paste",
      "click",
      "change",
      "contextmenu",
      "reset",
      "submit"
    ];
    function bi(e) {
      return Um.indexOf(e) > -1;
    }
    function O0(e, t, a, l, s) {
      return {
        blockedOn: e,
        domEventName: t,
        eventSystemFlags: a,
        nativeEvent: s,
        targetContainers: [l]
      };
    }
    function Yp(e, t) {
      switch (e) {
        case "focusin":
        case "focusout":
          vn = null;
          break;
        case "dragenter":
        case "dragleave":
          or = null;
          break;
        case "mouseover":
        case "mouseout":
          Lr = null;
          break;
        case "pointerover":
        case "pointerout": {
          var a = t.pointerId;
          Lu.delete(a);
          break;
        }
        case "gotpointercapture":
        case "lostpointercapture": {
          var l = t.pointerId;
          Au.delete(l);
          break;
        }
      }
    }
    function Uu(e, t, a, l, s, d) {
      if (e === null || e.nativeEvent !== d) {
        var v = O0(t, a, l, s, d);
        if (t !== null) {
          var g = Iu(t);
          g !== null && Of(g);
        }
        return v;
      }
      e.eventSystemFlags |= l;
      var E = e.targetContainers;
      return s !== null && E.indexOf(s) === -1 && E.push(s), e;
    }
    function zm(e, t, a, l, s) {
      switch (t) {
        case "focusin": {
          var d = s;
          return vn = Uu(vn, e, t, a, l, d), !0;
        }
        case "dragenter": {
          var v = s;
          return or = Uu(or, e, t, a, l, v), !0;
        }
        case "mouseover": {
          var g = s;
          return Lr = Uu(Lr, e, t, a, l, g), !0;
        }
        case "pointerover": {
          var E = s, b = E.pointerId;
          return Lu.set(b, Uu(Lu.get(b) || null, e, t, a, l, E)), !0;
        }
        case "gotpointercapture": {
          var x = s, L = x.pointerId;
          return Au.set(L, Uu(Au.get(L) || null, e, t, a, l, x)), !0;
        }
      }
      return !1;
    }
    function Pp(e) {
      var t = ic(e.target);
      if (t !== null) {
        var a = ha(t);
        if (a !== null) {
          var l = a.tag;
          if (l === be) {
            var s = Cp(a);
            if (s !== null) {
              e.blockedOn = s, Hp(e.priority, function() {
                Mu(a);
              });
              return;
            }
          } else if (l === W) {
            var d = a.stateNode;
            if (kf(d)) {
              e.blockedOn = Xc(a);
              return;
            }
          }
        }
      }
      e.blockedOn = null;
    }
    function M0(e) {
      for (var t = Nf(), a = {
        blockedOn: null,
        target: e,
        priority: t
      }, l = 0; l < ur.length && ku(t, ur[l].priority); l++)
        ;
      ur.splice(l, 0, a), l === 0 && Pp(a);
    }
    function bo(e) {
      if (e.blockedOn !== null)
        return !1;
      for (var t = e.targetContainers; t.length > 0; ) {
        var a = t[0], l = Nr(e.domEventName, e.eventSystemFlags, a, e.nativeEvent);
        if (l === null) {
          var s = e.nativeEvent, d = new s.constructor(s.type, s);
          Rs(d), s.target.dispatchEvent(d), E0();
        } else {
          var v = Iu(l);
          return v !== null && Of(v), e.blockedOn = l, !1;
        }
        t.shift();
      }
      return !0;
    }
    function Lf(e, t, a) {
      bo(e) && a.delete(t);
    }
    function Fa() {
      Gs = !1, vn !== null && bo(vn) && (vn = null), or !== null && bo(or) && (or = null), Lr !== null && bo(Lr) && (Lr = null), Lu.forEach(Lf), Au.forEach(Lf);
    }
    function Ct(e, t) {
      e.blockedOn === t && (e.blockedOn = null, Gs || (Gs = !0, u.unstable_scheduleCallback(u.unstable_NormalPriority, Fa)));
    }
    function Rn(e) {
      if (Nu.length > 0) {
        Ct(Nu[0], e);
        for (var t = 1; t < Nu.length; t++) {
          var a = Nu[t];
          a.blockedOn === e && (a.blockedOn = null);
        }
      }
      vn !== null && Ct(vn, e), or !== null && Ct(or, e), Lr !== null && Ct(Lr, e);
      var l = function(g) {
        return Ct(g, e);
      };
      Lu.forEach(l), Au.forEach(l);
      for (var s = 0; s < ur.length; s++) {
        var d = ur[s];
        d.blockedOn === e && (d.blockedOn = null);
      }
      for (; ur.length > 0; ) {
        var v = ur[0];
        if (v.blockedOn !== null)
          break;
        Pp(v), v.blockedOn === null && ur.shift();
      }
    }
    var sn = c.ReactCurrentBatchConfig, Qn = !0;
    function na(e) {
      Qn = !!e;
    }
    function zu() {
      return Qn;
    }
    function qn(e, t, a) {
      var l = Af(t), s;
      switch (l) {
        case Ln:
          s = Qs;
          break;
        case Ki:
          s = xo;
          break;
        case Ci:
        default:
          s = ju;
          break;
      }
      return s.bind(null, t, a, e);
    }
    function Qs(e, t, a, l) {
      var s = ja(), d = sn.transition;
      sn.transition = null;
      try {
        _n(Ln), ju(e, t, a, l);
      } finally {
        _n(s), sn.transition = d;
      }
    }
    function xo(e, t, a, l) {
      var s = ja(), d = sn.transition;
      sn.transition = null;
      try {
        _n(Ki), ju(e, t, a, l);
      } finally {
        _n(s), sn.transition = d;
      }
    }
    function ju(e, t, a, l) {
      Qn && Vp(e, t, a, l);
    }
    function Vp(e, t, a, l) {
      var s = Nr(e, t, a, l);
      if (s === null) {
        Q0(e, t, l, Nl, a), Yp(e, l);
        return;
      }
      if (zm(s, e, t, a, l)) {
        l.stopPropagation();
        return;
      }
      if (Yp(e, l), t & lo && bi(e)) {
        for (; s !== null; ) {
          var d = Iu(s);
          d !== null && Fp(d);
          var v = Nr(e, t, a, l);
          if (v === null && Q0(e, t, l, Nl, a), v === s)
            break;
          s = v;
        }
        s !== null && l.stopPropagation();
        return;
      }
      Q0(e, t, l, null, a);
    }
    var Nl = null;
    function Nr(e, t, a, l) {
      Nl = null;
      var s = Wc(l), d = ic(s);
      if (d !== null) {
        var v = ha(d);
        if (v === null)
          d = null;
        else {
          var g = v.tag;
          if (g === be) {
            var E = Cp(v);
            if (E !== null)
              return E;
            d = null;
          } else if (g === W) {
            var b = v.stateNode;
            if (kf(b))
              return Xc(v);
            d = null;
          } else v !== d && (d = null);
        }
      }
      return Nl = d, null;
    }
    function Af(e) {
      switch (e) {
        case "cancel":
        case "click":
        case "close":
        case "contextmenu":
        case "copy":
        case "cut":
        case "auxclick":
        case "dblclick":
        case "dragend":
        case "dragstart":
        case "drop":
        case "focusin":
        case "focusout":
        case "input":
        case "invalid":
        case "keydown":
        case "keypress":
        case "keyup":
        case "mousedown":
        case "mouseup":
        case "paste":
        case "pause":
        case "play":
        case "pointercancel":
        case "pointerdown":
        case "pointerup":
        case "ratechange":
        case "reset":
        case "resize":
        case "seeked":
        case "submit":
        case "touchcancel":
        case "touchend":
        case "touchstart":
        case "volumechange":
        case "change":
        case "selectionchange":
        case "textInput":
        case "compositionstart":
        case "compositionend":
        case "compositionupdate":
        case "beforeblur":
        case "afterblur":
        case "beforeinput":
        case "blur":
        case "fullscreenchange":
        case "focus":
        case "hashchange":
        case "popstate":
        case "select":
        case "selectstart":
          return Ln;
        case "drag":
        case "dragenter":
        case "dragexit":
        case "dragleave":
        case "dragover":
        case "mousemove":
        case "mouseout":
        case "mouseover":
        case "pointermove":
        case "pointerout":
        case "pointerover":
        case "scroll":
        case "toggle":
        case "touchmove":
        case "wheel":
        case "mouseenter":
        case "mouseleave":
        case "pointerenter":
        case "pointerleave":
          return Ki;
        case "message": {
          var t = Tp();
          switch (t) {
            case ef:
              return Ln;
            case po:
              return Ki;
            case wi:
            case vm:
              return Ci;
            case tf:
              return Ru;
            default:
              return Ci;
          }
        }
        default:
          return Ci;
      }
    }
    function Fu(e, t, a) {
      return e.addEventListener(t, a, !1), a;
    }
    function Zi(e, t, a) {
      return e.addEventListener(t, a, !0), a;
    }
    function Uf(e, t, a, l) {
      return e.addEventListener(t, a, {
        capture: !0,
        passive: l
      }), a;
    }
    function Bp(e, t, a, l) {
      return e.addEventListener(t, a, {
        passive: l
      }), a;
    }
    var Ha = null, Hu = null, Ya = null;
    function zf(e) {
      return Ha = e, Hu = Xs(), !0;
    }
    function qs() {
      Ha = null, Hu = null, Ya = null;
    }
    function jf() {
      if (Ya)
        return Ya;
      var e, t = Hu, a = t.length, l, s = Xs(), d = s.length;
      for (e = 0; e < a && t[e] === s[e]; e++)
        ;
      var v = a - e;
      for (l = 1; l <= v && t[a - l] === s[d - l]; l++)
        ;
      var g = l > 1 ? 1 - l : void 0;
      return Ya = s.slice(e, g), Ya;
    }
    function Xs() {
      return "value" in Ha ? Ha.value : Ha.textContent;
    }
    function To(e) {
      var t, a = e.keyCode;
      return "charCode" in e ? (t = e.charCode, t === 0 && a === 13 && (t = 13)) : t = a, t === 10 && (t = 13), t >= 32 || t === 13 ? t : 0;
    }
    function sr() {
      return !0;
    }
    function Ji() {
      return !1;
    }
    function En(e) {
      function t(a, l, s, d, v) {
        this._reactName = a, this._targetInst = s, this.type = l, this.nativeEvent = d, this.target = v, this.currentTarget = null;
        for (var g in e)
          if (e.hasOwnProperty(g)) {
            var E = e[g];
            E ? this[g] = E(d) : this[g] = d[g];
          }
        var b = d.defaultPrevented != null ? d.defaultPrevented : d.returnValue === !1;
        return b ? this.isDefaultPrevented = sr : this.isDefaultPrevented = Ji, this.isPropagationStopped = Ji, this;
      }
      return St(t.prototype, {
        preventDefault: function() {
          this.defaultPrevented = !0;
          var a = this.nativeEvent;
          a && (a.preventDefault ? a.preventDefault() : typeof a.returnValue != "unknown" && (a.returnValue = !1), this.isDefaultPrevented = sr);
        },
        stopPropagation: function() {
          var a = this.nativeEvent;
          a && (a.stopPropagation ? a.stopPropagation() : typeof a.cancelBubble != "unknown" && (a.cancelBubble = !0), this.isPropagationStopped = sr);
        },
        /**
         * We release all dispatched `SyntheticEvent`s after each event loop, adding
         * them back into the pool. This allows a way to hold onto a reference that
         * won't be added back into the pool.
         */
        persist: function() {
        },
        /**
         * Checks if this event should be released back into the pool.
         *
         * @return {boolean} True if this should not be released, false otherwise.
         */
        isPersistent: sr
      }), t;
    }
    var Xn = {
      eventPhase: 0,
      bubbles: 0,
      cancelable: 0,
      timeStamp: function(e) {
        return e.timeStamp || Date.now();
      },
      defaultPrevented: 0,
      isTrusted: 0
    }, Ff = En(Xn), _o = St({}, Xn, {
      view: 0,
      detail: 0
    }), Ip = En(_o), Wp, xi, Yu;
    function $p(e) {
      e !== Yu && (Yu && e.type === "mousemove" ? (Wp = e.screenX - Yu.screenX, xi = e.screenY - Yu.screenY) : (Wp = 0, xi = 0), Yu = e);
    }
    var Ti = St({}, _o, {
      screenX: 0,
      screenY: 0,
      clientX: 0,
      clientY: 0,
      pageX: 0,
      pageY: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      getModifierState: Gp,
      button: 0,
      buttons: 0,
      relatedTarget: function(e) {
        return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
      },
      movementX: function(e) {
        return "movementX" in e ? e.movementX : ($p(e), Wp);
      },
      movementY: function(e) {
        return "movementY" in e ? e.movementY : xi;
      }
    }), Hf = En(Ti), Ro = St({}, Ti, {
      dataTransfer: 0
    }), jm = En(Ro), Fm = St({}, _o, {
      relatedTarget: 0
    }), Ks = En(Fm), Yf = St({}, Xn, {
      animationName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), N0 = En(Yf), L0 = St({}, Xn, {
      clipboardData: function(e) {
        return "clipboardData" in e ? e.clipboardData : window.clipboardData;
      }
    }), Hm = En(L0), Ym = St({}, Xn, {
      data: 0
    }), Ll = En(Ym), A0 = Ll, Pu = {
      Esc: "Escape",
      Spacebar: " ",
      Left: "ArrowLeft",
      Up: "ArrowUp",
      Right: "ArrowRight",
      Down: "ArrowDown",
      Del: "Delete",
      Win: "OS",
      Menu: "ContextMenu",
      Apps: "ContextMenu",
      Scroll: "ScrollLock",
      MozPrintableKey: "Unidentified"
    }, Pm = {
      8: "Backspace",
      9: "Tab",
      12: "Clear",
      13: "Enter",
      16: "Shift",
      17: "Control",
      18: "Alt",
      19: "Pause",
      20: "CapsLock",
      27: "Escape",
      32: " ",
      33: "PageUp",
      34: "PageDown",
      35: "End",
      36: "Home",
      37: "ArrowLeft",
      38: "ArrowUp",
      39: "ArrowRight",
      40: "ArrowDown",
      45: "Insert",
      46: "Delete",
      112: "F1",
      113: "F2",
      114: "F3",
      115: "F4",
      116: "F5",
      117: "F6",
      118: "F7",
      119: "F8",
      120: "F9",
      121: "F10",
      122: "F11",
      123: "F12",
      144: "NumLock",
      145: "ScrollLock",
      224: "Meta"
    };
    function Dn(e) {
      if (e.key) {
        var t = Pu[e.key] || e.key;
        if (t !== "Unidentified")
          return t;
      }
      if (e.type === "keypress") {
        var a = To(e);
        return a === 13 ? "Enter" : String.fromCharCode(a);
      }
      return e.type === "keydown" || e.type === "keyup" ? Pm[e.keyCode] || "Unidentified" : "";
    }
    var U0 = {
      Alt: "altKey",
      Control: "ctrlKey",
      Meta: "metaKey",
      Shift: "shiftKey"
    };
    function Vm(e) {
      var t = this, a = t.nativeEvent;
      if (a.getModifierState)
        return a.getModifierState(e);
      var l = U0[e];
      return l ? !!a[l] : !1;
    }
    function Gp(e) {
      return Vm;
    }
    var z0 = St({}, _o, {
      key: Dn,
      code: 0,
      location: 0,
      ctrlKey: 0,
      shiftKey: 0,
      altKey: 0,
      metaKey: 0,
      repeat: 0,
      locale: 0,
      getModifierState: Gp,
      // Legacy Interface
      charCode: function(e) {
        return e.type === "keypress" ? To(e) : 0;
      },
      keyCode: function(e) {
        return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      },
      which: function(e) {
        return e.type === "keypress" ? To(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
      }
    }), Bm = En(z0), Im = St({}, Ti, {
      pointerId: 0,
      width: 0,
      height: 0,
      pressure: 0,
      tangentialPressure: 0,
      tiltX: 0,
      tiltY: 0,
      twist: 0,
      pointerType: 0,
      isPrimary: 0
    }), Wm = En(Im), Pa = St({}, _o, {
      touches: 0,
      targetTouches: 0,
      changedTouches: 0,
      altKey: 0,
      metaKey: 0,
      ctrlKey: 0,
      shiftKey: 0,
      getModifierState: Gp
    }), Qp = En(Pa), j0 = St({}, Xn, {
      propertyName: 0,
      elapsedTime: 0,
      pseudoElement: 0
    }), Al = En(j0), Pf = St({}, Ti, {
      deltaX: function(e) {
        return "deltaX" in e ? e.deltaX : (
          // Fallback to `wheelDeltaX` for Webkit and normalize (right is positive).
          "wheelDeltaX" in e ? -e.wheelDeltaX : 0
        );
      },
      deltaY: function(e) {
        return "deltaY" in e ? e.deltaY : (
          // Fallback to `wheelDeltaY` for Webkit and normalize (down is positive).
          "wheelDeltaY" in e ? -e.wheelDeltaY : (
            // Fallback to `wheelDelta` for IE<9 and normalize (down is positive).
            "wheelDelta" in e ? -e.wheelDelta : 0
          )
        );
      },
      deltaZ: 0,
      // Browsers without "deltaMode" is reporting in raw wheel delta where one
      // notch on the scroll is always +/- 120, roughly equivalent to pixels.
      // A good approximation of DOM_DELTA_LINE (1) is 5% of viewport size or
      // ~40 pixels, for DOM_DELTA_SCREEN (2) it is 87.5% of viewport size.
      deltaMode: 0
    }), Do = En(Pf), Vf = [9, 13, 27, 32], Bf = 229, Zs = Ie && "CompositionEvent" in window, Js = null;
    Ie && "documentMode" in document && (Js = document.documentMode);
    var qp = Ie && "TextEvent" in window && !Js, $m = Ie && (!Zs || Js && Js > 8 && Js <= 11), Xp = 32, Kp = String.fromCharCode(Xp);
    function If() {
      yn("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]), yn("onCompositionEnd", ["compositionend", "focusout", "keydown", "keypress", "keyup", "mousedown"]), yn("onCompositionStart", ["compositionstart", "focusout", "keydown", "keypress", "keyup", "mousedown"]), yn("onCompositionUpdate", ["compositionupdate", "focusout", "keydown", "keypress", "keyup", "mousedown"]);
    }
    var ec = !1;
    function Gm(e) {
      return (e.ctrlKey || e.altKey || e.metaKey) && // ctrlKey && altKey is equivalent to AltGr, and is not a command.
      !(e.ctrlKey && e.altKey);
    }
    function Zp(e) {
      switch (e) {
        case "compositionstart":
          return "onCompositionStart";
        case "compositionend":
          return "onCompositionEnd";
        case "compositionupdate":
          return "onCompositionUpdate";
      }
    }
    function F0(e, t) {
      return e === "keydown" && t.keyCode === Bf;
    }
    function Jp(e, t) {
      switch (e) {
        case "keyup":
          return Vf.indexOf(t.keyCode) !== -1;
        case "keydown":
          return t.keyCode !== Bf;
        case "keypress":
        case "mousedown":
        case "focusout":
          return !0;
        default:
          return !1;
      }
    }
    function Wf(e) {
      var t = e.detail;
      return typeof t == "object" && "data" in t ? t.data : null;
    }
    function tc(e) {
      return e.locale === "ko";
    }
    var Ul = !1;
    function $f(e, t, a, l, s) {
      var d, v;
      if (Zs ? d = Zp(t) : Ul ? Jp(t, l) && (d = "onCompositionEnd") : F0(t, l) && (d = "onCompositionStart"), !d)
        return null;
      $m && !tc(l) && (!Ul && d === "onCompositionStart" ? Ul = zf(s) : d === "onCompositionEnd" && Ul && (v = jf()));
      var g = Jm(a, d);
      if (g.length > 0) {
        var E = new Ll(d, t, null, l, s);
        if (e.push({
          event: E,
          listeners: g
        }), v)
          E.data = v;
        else {
          var b = Wf(l);
          b !== null && (E.data = b);
        }
      }
    }
    function Qm(e, t) {
      switch (e) {
        case "compositionend":
          return Wf(t);
        case "keypress":
          var a = t.which;
          return a !== Xp ? null : (ec = !0, Kp);
        case "textInput":
          var l = t.data;
          return l === Kp && ec ? null : l;
        default:
          return null;
      }
    }
    function H0(e, t) {
      if (Ul) {
        if (e === "compositionend" || !Zs && Jp(e, t)) {
          var a = jf();
          return qs(), Ul = !1, a;
        }
        return null;
      }
      switch (e) {
        case "paste":
          return null;
        case "keypress":
          if (!Gm(t)) {
            if (t.char && t.char.length > 1)
              return t.char;
            if (t.which)
              return String.fromCharCode(t.which);
          }
          return null;
        case "compositionend":
          return $m && !tc(t) ? null : t.data;
        default:
          return null;
      }
    }
    function Gf(e, t, a, l, s) {
      var d;
      if (qp ? d = Qm(t, l) : d = H0(t, l), !d)
        return null;
      var v = Jm(a, "onBeforeInput");
      if (v.length > 0) {
        var g = new A0("onBeforeInput", "beforeinput", null, l, s);
        e.push({
          event: g,
          listeners: v
        }), g.data = d;
      }
    }
    function Y0(e, t, a, l, s, d, v) {
      $f(e, t, a, l, s), Gf(e, t, a, l, s);
    }
    var nc = {
      color: !0,
      date: !0,
      datetime: !0,
      "datetime-local": !0,
      email: !0,
      month: !0,
      number: !0,
      password: !0,
      range: !0,
      search: !0,
      tel: !0,
      text: !0,
      time: !0,
      url: !0,
      week: !0
    };
    function qm(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t === "input" ? !!nc[e.type] : t === "textarea";
    }
    /**
     * Checks if an event is supported in the current execution environment.
     *
     * NOTE: This will not work correctly for non-generic events such as `change`,
     * `reset`, `load`, `error`, and `select`.
     *
     * Borrows from Modernizr.
     *
     * @param {string} eventNameSuffix Event name, e.g. "click".
     * @return {boolean} True if the event is supported.
     * @internal
     * @license Modernizr 3.0.0pre (Custom Build) | MIT
     */
    function Qf(e) {
      if (!Ie)
        return !1;
      var t = "on" + e, a = t in document;
      if (!a) {
        var l = document.createElement("div");
        l.setAttribute(t, "return;"), a = typeof l[t] == "function";
      }
      return a;
    }
    function n() {
      yn("onChange", ["change", "click", "focusin", "focusout", "input", "keydown", "keyup", "selectionchange"]);
    }
    function r(e, t, a, l) {
      $c(l);
      var s = Jm(t, "onChange");
      if (s.length > 0) {
        var d = new Ff("onChange", "change", null, a, l);
        e.push({
          event: d,
          listeners: s
        });
      }
    }
    var o = null, f = null;
    function h(e) {
      var t = e.nodeName && e.nodeName.toLowerCase();
      return t === "select" || t === "input" && e.type === "file";
    }
    function m(e) {
      var t = [];
      r(t, f, e, Wc(e)), hp(C, t);
    }
    function C(e) {
      Qw(e, 0);
    }
    function T(e) {
      var t = ed(e);
      if (Mv(t))
        return e;
    }
    function k(e, t) {
      if (e === "change")
        return t;
    }
    var B = !1;
    Ie && (B = Qf("input") && (!document.documentMode || document.documentMode > 9));
    function ee(e, t) {
      o = e, f = t, o.attachEvent("onpropertychange", Z);
    }
    function ne() {
      o && (o.detachEvent("onpropertychange", Z), o = null, f = null);
    }
    function Z(e) {
      e.propertyName === "value" && T(f) && m(e);
    }
    function xe(e, t, a) {
      e === "focusin" ? (ne(), ee(t, a)) : e === "focusout" && ne();
    }
    function Ne(e, t) {
      if (e === "selectionchange" || e === "keyup" || e === "keydown")
        return T(f);
    }
    function Ue(e) {
      var t = e.nodeName;
      return t && t.toLowerCase() === "input" && (e.type === "checkbox" || e.type === "radio");
    }
    function An(e, t) {
      if (e === "click")
        return T(t);
    }
    function j(e, t) {
      if (e === "input" || e === "change")
        return T(t);
    }
    function N(e) {
      var t = e._wrapperState;
      !t || !t.controlled || e.type !== "number" || Sl(e, "number", e.value);
    }
    function Y(e, t, a, l, s, d, v) {
      var g = a ? ed(a) : window, E, b;
      if (h(g) ? E = k : qm(g) ? B ? E = j : (E = Ne, b = xe) : Ue(g) && (E = An), E) {
        var x = E(t, a);
        if (x) {
          r(e, x, l, s);
          return;
        }
      }
      b && b(t, g, a), t === "focusout" && N(g);
    }
    function ie() {
      Vn("onMouseEnter", ["mouseout", "mouseover"]), Vn("onMouseLeave", ["mouseout", "mouseover"]), Vn("onPointerEnter", ["pointerout", "pointerover"]), Vn("onPointerLeave", ["pointerout", "pointerover"]);
    }
    function je(e, t, a, l, s, d, v) {
      var g = t === "mouseover" || t === "pointerover", E = t === "mouseout" || t === "pointerout";
      if (g && !um(l)) {
        var b = l.relatedTarget || l.fromElement;
        if (b && (ic(b) || ph(b)))
          return;
      }
      if (!(!E && !g)) {
        var x;
        if (s.window === s)
          x = s;
        else {
          var L = s.ownerDocument;
          L ? x = L.defaultView || L.parentWindow : x = window;
        }
        var M, V;
        if (E) {
          var I = l.relatedTarget || l.toElement;
          if (M = a, V = I ? ic(I) : null, V !== null) {
            var $ = ha(V);
            (V !== $ || V.tag !== Q && V.tag !== oe) && (V = null);
          }
        } else
          M = null, V = a;
        if (M !== V) {
          var ge = Hf, We = "onMouseLeave", He = "onMouseEnter", Dt = "mouse";
          (t === "pointerout" || t === "pointerover") && (ge = Wm, We = "onPointerLeave", He = "onPointerEnter", Dt = "pointer");
          var bt = M == null ? x : ed(M), F = V == null ? x : ed(V), G = new ge(We, Dt + "leave", M, l, s);
          G.target = bt, G.relatedTarget = F;
          var H = null, re = ic(s);
          if (re === a) {
            var _e = new ge(He, Dt + "enter", V, l, s);
            _e.target = F, _e.relatedTarget = bt, H = _e;
          }
          zR(e, G, H, M, V);
        }
      }
    }
    function Qe(e, t) {
      return e === t && (e !== 0 || 1 / e === 1 / t) || e !== e && t !== t;
    }
    var Le = typeof Object.is == "function" ? Object.is : Qe;
    function Xe(e, t) {
      if (Le(e, t))
        return !0;
      if (typeof e != "object" || e === null || typeof t != "object" || t === null)
        return !1;
      var a = Object.keys(e), l = Object.keys(t);
      if (a.length !== l.length)
        return !1;
      for (var s = 0; s < a.length; s++) {
        var d = a[s];
        if (!vt.call(t, d) || !Le(e[d], t[d]))
          return !1;
      }
      return !0;
    }
    function Kn(e) {
      for (; e && e.firstChild; )
        e = e.firstChild;
      return e;
    }
    function Nt(e) {
      for (; e; ) {
        if (e.nextSibling)
          return e.nextSibling;
        e = e.parentNode;
      }
    }
    function el(e, t) {
      for (var a = Kn(e), l = 0, s = 0; a; ) {
        if (a.nodeType === Vi) {
          if (s = l + a.textContent.length, l <= t && s >= t)
            return {
              node: a,
              offset: t - l
            };
          l = s;
        }
        a = Kn(Nt(a));
      }
    }
    function P0(e) {
      var t = e.ownerDocument, a = t && t.defaultView || window, l = a.getSelection && a.getSelection();
      if (!l || l.rangeCount === 0)
        return null;
      var s = l.anchorNode, d = l.anchorOffset, v = l.focusNode, g = l.focusOffset;
      try {
        s.nodeType, v.nodeType;
      } catch {
        return null;
      }
      return mR(e, s, d, v, g);
    }
    function mR(e, t, a, l, s) {
      var d = 0, v = -1, g = -1, E = 0, b = 0, x = e, L = null;
      e: for (; ; ) {
        for (var M = null; x === t && (a === 0 || x.nodeType === Vi) && (v = d + a), x === l && (s === 0 || x.nodeType === Vi) && (g = d + s), x.nodeType === Vi && (d += x.nodeValue.length), (M = x.firstChild) !== null; )
          L = x, x = M;
        for (; ; ) {
          if (x === e)
            break e;
          if (L === t && ++E === a && (v = d), L === l && ++b === s && (g = d), (M = x.nextSibling) !== null)
            break;
          x = L, L = x.parentNode;
        }
        x = M;
      }
      return v === -1 || g === -1 ? null : {
        start: v,
        end: g
      };
    }
    function yR(e, t) {
      var a = e.ownerDocument || document, l = a && a.defaultView || window;
      if (l.getSelection) {
        var s = l.getSelection(), d = e.textContent.length, v = Math.min(t.start, d), g = t.end === void 0 ? v : Math.min(t.end, d);
        if (!s.extend && v > g) {
          var E = g;
          g = v, v = E;
        }
        var b = el(e, v), x = el(e, g);
        if (b && x) {
          if (s.rangeCount === 1 && s.anchorNode === b.node && s.anchorOffset === b.offset && s.focusNode === x.node && s.focusOffset === x.offset)
            return;
          var L = a.createRange();
          L.setStart(b.node, b.offset), s.removeAllRanges(), v > g ? (s.addRange(L), s.extend(x.node, x.offset)) : (L.setEnd(x.node, x.offset), s.addRange(L));
        }
      }
    }
    function zw(e) {
      return e && e.nodeType === Vi;
    }
    function jw(e, t) {
      return !e || !t ? !1 : e === t ? !0 : zw(e) ? !1 : zw(t) ? jw(e, t.parentNode) : "contains" in e ? e.contains(t) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(t) & 16) : !1;
    }
    function gR(e) {
      return e && e.ownerDocument && jw(e.ownerDocument.documentElement, e);
    }
    function SR(e) {
      try {
        return typeof e.contentWindow.location.href == "string";
      } catch {
        return !1;
      }
    }
    function Fw() {
      for (var e = window, t = Nc(); t instanceof e.HTMLIFrameElement; ) {
        if (SR(t))
          e = t.contentWindow;
        else
          return t;
        t = Nc(e.document);
      }
      return t;
    }
    function V0(e) {
      var t = e && e.nodeName && e.nodeName.toLowerCase();
      return t && (t === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || t === "textarea" || e.contentEditable === "true");
    }
    function ER() {
      var e = Fw();
      return {
        focusedElem: e,
        selectionRange: V0(e) ? CR(e) : null
      };
    }
    function wR(e) {
      var t = Fw(), a = e.focusedElem, l = e.selectionRange;
      if (t !== a && gR(a)) {
        l !== null && V0(a) && bR(a, l);
        for (var s = [], d = a; d = d.parentNode; )
          d.nodeType === $r && s.push({
            element: d,
            left: d.scrollLeft,
            top: d.scrollTop
          });
        typeof a.focus == "function" && a.focus();
        for (var v = 0; v < s.length; v++) {
          var g = s[v];
          g.element.scrollLeft = g.left, g.element.scrollTop = g.top;
        }
      }
    }
    function CR(e) {
      var t;
      return "selectionStart" in e ? t = {
        start: e.selectionStart,
        end: e.selectionEnd
      } : t = P0(e), t || {
        start: 0,
        end: 0
      };
    }
    function bR(e, t) {
      var a = t.start, l = t.end;
      l === void 0 && (l = a), "selectionStart" in e ? (e.selectionStart = a, e.selectionEnd = Math.min(l, e.value.length)) : yR(e, t);
    }
    var xR = Ie && "documentMode" in document && document.documentMode <= 11;
    function TR() {
      yn("onSelect", ["focusout", "contextmenu", "dragend", "focusin", "keydown", "keyup", "mousedown", "mouseup", "selectionchange"]);
    }
    var qf = null, B0 = null, eh = null, I0 = !1;
    function _R(e) {
      if ("selectionStart" in e && V0(e))
        return {
          start: e.selectionStart,
          end: e.selectionEnd
        };
      var t = e.ownerDocument && e.ownerDocument.defaultView || window, a = t.getSelection();
      return {
        anchorNode: a.anchorNode,
        anchorOffset: a.anchorOffset,
        focusNode: a.focusNode,
        focusOffset: a.focusOffset
      };
    }
    function RR(e) {
      return e.window === e ? e.document : e.nodeType === li ? e : e.ownerDocument;
    }
    function Hw(e, t, a) {
      var l = RR(a);
      if (!(I0 || qf == null || qf !== Nc(l))) {
        var s = _R(qf);
        if (!eh || !Xe(eh, s)) {
          eh = s;
          var d = Jm(B0, "onSelect");
          if (d.length > 0) {
            var v = new Ff("onSelect", "select", null, t, a);
            e.push({
              event: v,
              listeners: d
            }), v.target = qf;
          }
        }
      }
    }
    function DR(e, t, a, l, s, d, v) {
      var g = a ? ed(a) : window;
      switch (t) {
        case "focusin":
          (qm(g) || g.contentEditable === "true") && (qf = g, B0 = a, eh = null);
          break;
        case "focusout":
          qf = null, B0 = null, eh = null;
          break;
        case "mousedown":
          I0 = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          I0 = !1, Hw(e, l, s);
          break;
        case "selectionchange":
          if (xR)
            break;
        case "keydown":
        case "keyup":
          Hw(e, l, s);
      }
    }
    function Xm(e, t) {
      var a = {};
      return a[e.toLowerCase()] = t.toLowerCase(), a["Webkit" + e] = "webkit" + t, a["Moz" + e] = "moz" + t, a;
    }
    var Xf = {
      animationend: Xm("Animation", "AnimationEnd"),
      animationiteration: Xm("Animation", "AnimationIteration"),
      animationstart: Xm("Animation", "AnimationStart"),
      transitionend: Xm("Transition", "TransitionEnd")
    }, W0 = {}, Yw = {};
    Ie && (Yw = document.createElement("div").style, "AnimationEvent" in window || (delete Xf.animationend.animation, delete Xf.animationiteration.animation, delete Xf.animationstart.animation), "TransitionEvent" in window || delete Xf.transitionend.transition);
    function Km(e) {
      if (W0[e])
        return W0[e];
      if (!Xf[e])
        return e;
      var t = Xf[e];
      for (var a in t)
        if (t.hasOwnProperty(a) && a in Yw)
          return W0[e] = t[a];
      return e;
    }
    var Pw = Km("animationend"), Vw = Km("animationiteration"), Bw = Km("animationstart"), Iw = Km("transitionend"), Ww = /* @__PURE__ */ new Map(), $w = ["abort", "auxClick", "cancel", "canPlay", "canPlayThrough", "click", "close", "contextMenu", "copy", "cut", "drag", "dragEnd", "dragEnter", "dragExit", "dragLeave", "dragOver", "dragStart", "drop", "durationChange", "emptied", "encrypted", "ended", "error", "gotPointerCapture", "input", "invalid", "keyDown", "keyPress", "keyUp", "load", "loadedData", "loadedMetadata", "loadStart", "lostPointerCapture", "mouseDown", "mouseMove", "mouseOut", "mouseOver", "mouseUp", "paste", "pause", "play", "playing", "pointerCancel", "pointerDown", "pointerMove", "pointerOut", "pointerOver", "pointerUp", "progress", "rateChange", "reset", "resize", "seeked", "seeking", "stalled", "submit", "suspend", "timeUpdate", "touchCancel", "touchEnd", "touchStart", "volumeChange", "scroll", "toggle", "touchMove", "waiting", "wheel"];
    function Vu(e, t) {
      Ww.set(e, t), yn(t, [e]);
    }
    function kR() {
      for (var e = 0; e < $w.length; e++) {
        var t = $w[e], a = t.toLowerCase(), l = t[0].toUpperCase() + t.slice(1);
        Vu(a, "on" + l);
      }
      Vu(Pw, "onAnimationEnd"), Vu(Vw, "onAnimationIteration"), Vu(Bw, "onAnimationStart"), Vu("dblclick", "onDoubleClick"), Vu("focusin", "onFocus"), Vu("focusout", "onBlur"), Vu(Iw, "onTransitionEnd");
    }
    function OR(e, t, a, l, s, d, v) {
      var g = Ww.get(t);
      if (g !== void 0) {
        var E = Ff, b = t;
        switch (t) {
          case "keypress":
            if (To(l) === 0)
              return;
          case "keydown":
          case "keyup":
            E = Bm;
            break;
          case "focusin":
            b = "focus", E = Ks;
            break;
          case "focusout":
            b = "blur", E = Ks;
            break;
          case "beforeblur":
          case "afterblur":
            E = Ks;
            break;
          case "click":
            if (l.button === 2)
              return;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            E = Hf;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            E = jm;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            E = Qp;
            break;
          case Pw:
          case Vw:
          case Bw:
            E = N0;
            break;
          case Iw:
            E = Al;
            break;
          case "scroll":
            E = Ip;
            break;
          case "wheel":
            E = Do;
            break;
          case "copy":
          case "cut":
          case "paste":
            E = Hm;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            E = Wm;
            break;
        }
        var x = (d & lo) !== 0;
        {
          var L = !x && // TODO: ideally, we'd eventually add all events from
          // nonDelegatedEvents list in DOMPluginEventSystem.
          // Then we can remove this special list.
          // This is a breaking change that can wait until React 18.
          t === "scroll", M = AR(a, g, l.type, x, L);
          if (M.length > 0) {
            var V = new E(g, b, null, l, s);
            e.push({
              event: V,
              listeners: M
            });
          }
        }
      }
    }
    kR(), ie(), n(), TR(), If();
    function MR(e, t, a, l, s, d, v) {
      OR(e, t, a, l, s, d);
      var g = (d & S0) === 0;
      g && (je(e, t, a, l, s), Y(e, t, a, l, s), DR(e, t, a, l, s), Y0(e, t, a, l, s));
    }
    var th = ["abort", "canplay", "canplaythrough", "durationchange", "emptied", "encrypted", "ended", "error", "loadeddata", "loadedmetadata", "loadstart", "pause", "play", "playing", "progress", "ratechange", "resize", "seeked", "seeking", "stalled", "suspend", "timeupdate", "volumechange", "waiting"], $0 = new Set(["cancel", "close", "invalid", "load", "scroll", "toggle"].concat(th));
    function Gw(e, t, a) {
      var l = e.type || "unknown-event";
      e.currentTarget = a, $i(l, t, void 0, e), e.currentTarget = null;
    }
    function NR(e, t, a) {
      var l;
      if (a)
        for (var s = t.length - 1; s >= 0; s--) {
          var d = t[s], v = d.instance, g = d.currentTarget, E = d.listener;
          if (v !== l && e.isPropagationStopped())
            return;
          Gw(e, E, g), l = v;
        }
      else
        for (var b = 0; b < t.length; b++) {
          var x = t[b], L = x.instance, M = x.currentTarget, V = x.listener;
          if (L !== l && e.isPropagationStopped())
            return;
          Gw(e, V, M), l = L;
        }
    }
    function Qw(e, t) {
      for (var a = (t & lo) !== 0, l = 0; l < e.length; l++) {
        var s = e[l], d = s.event, v = s.listeners;
        NR(d, v, a);
      }
      gp();
    }
    function LR(e, t, a, l, s) {
      var d = Wc(a), v = [];
      MR(v, e, l, a, d, t), Qw(v, t);
    }
    function wn(e, t) {
      $0.has(e) || S('Did not expect a listenToNonDelegatedEvent() call for "%s". This is a bug in React. Please file an issue.', e);
      var a = !1, l = sk(t), s = jR(e);
      l.has(s) || (qw(t, e, Ts, a), l.add(s));
    }
    function G0(e, t, a) {
      $0.has(e) && !t && S('Did not expect a listenToNativeEvent() call for "%s" in the bubble phase. This is a bug in React. Please file an issue.', e);
      var l = 0;
      t && (l |= lo), qw(a, e, l, t);
    }
    var Zm = "_reactListening" + Math.random().toString(36).slice(2);
    function nh(e) {
      if (!e[Zm]) {
        e[Zm] = !0, $t.forEach(function(a) {
          a !== "selectionchange" && ($0.has(a) || G0(a, !1, e), G0(a, !0, e));
        });
        var t = e.nodeType === li ? e : e.ownerDocument;
        t !== null && (t[Zm] || (t[Zm] = !0, G0("selectionchange", !1, t)));
      }
    }
    function qw(e, t, a, l, s) {
      var d = qn(e, t, a), v = void 0;
      Os && (t === "touchstart" || t === "touchmove" || t === "wheel") && (v = !0), e = e, l ? v !== void 0 ? Uf(e, t, d, v) : Zi(e, t, d) : v !== void 0 ? Bp(e, t, d, v) : Fu(e, t, d);
    }
    function Xw(e, t) {
      return e === t || e.nodeType === Fn && e.parentNode === t;
    }
    function Q0(e, t, a, l, s) {
      var d = l;
      if (!(t & Ii) && !(t & Ts)) {
        var v = s;
        if (l !== null) {
          var g = l;
          e: for (; ; ) {
            if (g === null)
              return;
            var E = g.tag;
            if (E === W || E === X) {
              var b = g.stateNode.containerInfo;
              if (Xw(b, v))
                break;
              if (E === X)
                for (var x = g.return; x !== null; ) {
                  var L = x.tag;
                  if (L === W || L === X) {
                    var M = x.stateNode.containerInfo;
                    if (Xw(M, v))
                      return;
                  }
                  x = x.return;
                }
              for (; b !== null; ) {
                var V = ic(b);
                if (V === null)
                  return;
                var I = V.tag;
                if (I === Q || I === oe) {
                  g = d = V;
                  continue e;
                }
                b = b.parentNode;
              }
            }
            g = g.return;
          }
        }
      }
      hp(function() {
        return LR(e, t, a, d);
      });
    }
    function rh(e, t, a) {
      return {
        instance: e,
        listener: t,
        currentTarget: a
      };
    }
    function AR(e, t, a, l, s, d) {
      for (var v = t !== null ? t + "Capture" : null, g = l ? v : t, E = [], b = e, x = null; b !== null; ) {
        var L = b, M = L.stateNode, V = L.tag;
        if (V === Q && M !== null && (x = M, g !== null)) {
          var I = uo(b, g);
          I != null && E.push(rh(b, I, x));
        }
        if (s)
          break;
        b = b.return;
      }
      return E;
    }
    function Jm(e, t) {
      for (var a = t + "Capture", l = [], s = e; s !== null; ) {
        var d = s, v = d.stateNode, g = d.tag;
        if (g === Q && v !== null) {
          var E = v, b = uo(s, a);
          b != null && l.unshift(rh(s, b, E));
          var x = uo(s, t);
          x != null && l.push(rh(s, x, E));
        }
        s = s.return;
      }
      return l;
    }
    function Kf(e) {
      if (e === null)
        return null;
      do
        e = e.return;
      while (e && e.tag !== Q);
      return e || null;
    }
    function UR(e, t) {
      for (var a = e, l = t, s = 0, d = a; d; d = Kf(d))
        s++;
      for (var v = 0, g = l; g; g = Kf(g))
        v++;
      for (; s - v > 0; )
        a = Kf(a), s--;
      for (; v - s > 0; )
        l = Kf(l), v--;
      for (var E = s; E--; ) {
        if (a === l || l !== null && a === l.alternate)
          return a;
        a = Kf(a), l = Kf(l);
      }
      return null;
    }
    function Kw(e, t, a, l, s) {
      for (var d = t._reactName, v = [], g = a; g !== null && g !== l; ) {
        var E = g, b = E.alternate, x = E.stateNode, L = E.tag;
        if (b !== null && b === l)
          break;
        if (L === Q && x !== null) {
          var M = x;
          if (s) {
            var V = uo(g, d);
            V != null && v.unshift(rh(g, V, M));
          } else if (!s) {
            var I = uo(g, d);
            I != null && v.push(rh(g, I, M));
          }
        }
        g = g.return;
      }
      v.length !== 0 && e.push({
        event: t,
        listeners: v
      });
    }
    function zR(e, t, a, l, s) {
      var d = l && s ? UR(l, s) : null;
      l !== null && Kw(e, t, l, d, !1), s !== null && a !== null && Kw(e, a, s, d, !0);
    }
    function jR(e, t) {
      return e + "__bubble";
    }
    var Va = !1, ah = "dangerouslySetInnerHTML", ey = "suppressContentEditableWarning", Bu = "suppressHydrationWarning", Zw = "autoFocus", rc = "children", ac = "style", ty = "__html", q0, ny, ih, Jw, ry, eC, tC;
    q0 = {
      // There are working polyfills for <dialog>. Let people use it.
      dialog: !0,
      // Electron ships a custom <webview> tag to display external web content in
      // an isolated frame and process.
      // This tag is not present in non Electron environments such as JSDom which
      // is often used for testing purposes.
      // @see https://electronjs.org/docs/api/webview-tag
      webview: !0
    }, ny = function(e, t) {
      Ic(e, t), sp(e, t), om(e, t, {
        registrationNameDependencies: mn,
        possibleRegistrationNames: xn
      });
    }, eC = Ie && !document.documentMode, ih = function(e, t, a) {
      if (!Va) {
        var l = ay(a), s = ay(t);
        s !== l && (Va = !0, S("Prop `%s` did not match. Server: %s Client: %s", e, JSON.stringify(s), JSON.stringify(l)));
      }
    }, Jw = function(e) {
      if (!Va) {
        Va = !0;
        var t = [];
        e.forEach(function(a) {
          t.push(a);
        }), S("Extra attributes from the server: %s", t);
      }
    }, ry = function(e, t) {
      t === !1 ? S("Expected `%s` listener to be a function, instead got `false`.\n\nIf you used to conditionally omit it with %s={condition && value}, pass %s={condition ? value : undefined} instead.", e, e, e) : S("Expected `%s` listener to be a function, instead got a value of `%s` type.", e, typeof t);
    }, tC = function(e, t) {
      var a = e.namespaceURI === Pi ? e.ownerDocument.createElement(e.tagName) : e.ownerDocument.createElementNS(e.namespaceURI, e.tagName);
      return a.innerHTML = t, a.innerHTML;
    };
    var FR = /\r\n?/g, HR = /\u0000|\uFFFD/g;
    function ay(e) {
      fr(e);
      var t = typeof e == "string" ? e : "" + e;
      return t.replace(FR, `
`).replace(HR, "");
    }
    function iy(e, t, a, l) {
      var s = ay(t), d = ay(e);
      if (d !== s && (l && (Va || (Va = !0, S('Text content did not match. Server: "%s" Client: "%s"', d, s))), a && _t))
        throw new Error("Text content does not match server-rendered HTML.");
    }
    function nC(e) {
      return e.nodeType === li ? e : e.ownerDocument;
    }
    function YR() {
    }
    function ly(e) {
      e.onclick = YR;
    }
    function PR(e, t, a, l, s) {
      for (var d in l)
        if (l.hasOwnProperty(d)) {
          var v = l[d];
          if (d === ac)
            v && Object.freeze(v), Kv(t, v);
          else if (d === ah) {
            var g = v ? v[ty] : void 0;
            g != null && Yv(t, g);
          } else if (d === rc)
            if (typeof v == "string") {
              var E = e !== "textarea" || v !== "";
              E && Yc(t, v);
            } else typeof v == "number" && Yc(t, "" + v);
          else d === ey || d === Bu || d === Zw || (mn.hasOwnProperty(d) ? v != null && (typeof v != "function" && ry(d, v), d === "onScroll" && wn("scroll", t)) : v != null && yi(t, d, v, s));
        }
    }
    function VR(e, t, a, l) {
      for (var s = 0; s < t.length; s += 2) {
        var d = t[s], v = t[s + 1];
        d === ac ? Kv(e, v) : d === ah ? Yv(e, v) : d === rc ? Yc(e, v) : yi(e, d, v, l);
      }
    }
    function BR(e, t, a, l) {
      var s, d = nC(a), v, g = l;
      if (g === Pi && (g = Fc(e)), g === Pi) {
        if (s = Bi(e, t), !s && e !== e.toLowerCase() && S("<%s /> is using incorrect casing. Use PascalCase for React components, or lowercase for HTML elements.", e), e === "script") {
          var E = d.createElement("div");
          E.innerHTML = "<script><\/script>";
          var b = E.firstChild;
          v = E.removeChild(b);
        } else if (typeof t.is == "string")
          v = d.createElement(e, {
            is: t.is
          });
        else if (v = d.createElement(e), e === "select") {
          var x = v;
          t.multiple ? x.multiple = !0 : t.size && (x.size = t.size);
        }
      } else
        v = d.createElementNS(g, e);
      return g === Pi && !s && Object.prototype.toString.call(v) === "[object HTMLUnknownElement]" && !vt.call(q0, e) && (q0[e] = !0, S("The tag <%s> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.", e)), v;
    }
    function IR(e, t) {
      return nC(t).createTextNode(e);
    }
    function WR(e, t, a, l) {
      var s = Bi(t, a);
      ny(t, a);
      var d;
      switch (t) {
        case "dialog":
          wn("cancel", e), wn("close", e), d = a;
          break;
        case "iframe":
        case "object":
        case "embed":
          wn("load", e), d = a;
          break;
        case "video":
        case "audio":
          for (var v = 0; v < th.length; v++)
            wn(th[v], e);
          d = a;
          break;
        case "source":
          wn("error", e), d = a;
          break;
        case "img":
        case "image":
        case "link":
          wn("error", e), wn("load", e), d = a;
          break;
        case "details":
          wn("toggle", e), d = a;
          break;
        case "input":
          Ss(e, a), d = gs(e, a), wn("invalid", e);
          break;
        case "option":
          zc(e, a), d = a;
          break;
        case "select":
          zv(e, a), d = Zd(e, a), wn("invalid", e);
          break;
        case "textarea":
          jv(e, a), d = ep(e, a), wn("invalid", e);
          break;
        default:
          d = a;
      }
      switch (Vc(t, d), PR(t, e, l, d, s), t) {
        case "input":
          ro(e), Es(e, a, !1);
          break;
        case "textarea":
          ro(e), Hv(e);
          break;
        case "option":
          Kd(e, a);
          break;
        case "select":
          u0(e, a);
          break;
        default:
          typeof d.onClick == "function" && ly(e);
          break;
      }
    }
    function $R(e, t, a, l, s) {
      ny(t, l);
      var d = null, v, g;
      switch (t) {
        case "input":
          v = gs(e, a), g = gs(e, l), d = [];
          break;
        case "select":
          v = Zd(e, a), g = Zd(e, l), d = [];
          break;
        case "textarea":
          v = ep(e, a), g = ep(e, l), d = [];
          break;
        default:
          v = a, g = l, typeof v.onClick != "function" && typeof g.onClick == "function" && ly(e);
          break;
      }
      Vc(t, g);
      var E, b, x = null;
      for (E in v)
        if (!(g.hasOwnProperty(E) || !v.hasOwnProperty(E) || v[E] == null))
          if (E === ac) {
            var L = v[E];
            for (b in L)
              L.hasOwnProperty(b) && (x || (x = {}), x[b] = "");
          } else E === ah || E === rc || E === ey || E === Bu || E === Zw || (mn.hasOwnProperty(E) ? d || (d = []) : (d = d || []).push(E, null));
      for (E in g) {
        var M = g[E], V = v != null ? v[E] : void 0;
        if (!(!g.hasOwnProperty(E) || M === V || M == null && V == null))
          if (E === ac)
            if (M && Object.freeze(M), V) {
              for (b in V)
                V.hasOwnProperty(b) && (!M || !M.hasOwnProperty(b)) && (x || (x = {}), x[b] = "");
              for (b in M)
                M.hasOwnProperty(b) && V[b] !== M[b] && (x || (x = {}), x[b] = M[b]);
            } else
              x || (d || (d = []), d.push(E, x)), x = M;
          else if (E === ah) {
            var I = M ? M[ty] : void 0, $ = V ? V[ty] : void 0;
            I != null && $ !== I && (d = d || []).push(E, I);
          } else E === rc ? (typeof M == "string" || typeof M == "number") && (d = d || []).push(E, "" + M) : E === ey || E === Bu || (mn.hasOwnProperty(E) ? (M != null && (typeof M != "function" && ry(E, M), E === "onScroll" && wn("scroll", e)), !d && V !== M && (d = [])) : (d = d || []).push(E, M));
      }
      return x && (bs(x, g[ac]), (d = d || []).push(ac, x)), d;
    }
    function GR(e, t, a, l, s) {
      a === "input" && s.type === "radio" && s.name != null && Xd(e, s);
      var d = Bi(a, l), v = Bi(a, s);
      switch (VR(e, t, d, v), a) {
        case "input":
          au(e, s);
          break;
        case "textarea":
          Fv(e, s);
          break;
        case "select":
          s0(e, s);
          break;
      }
    }
    function QR(e) {
      {
        var t = e.toLowerCase();
        return Bc.hasOwnProperty(t) && Bc[t] || null;
      }
    }
    function qR(e, t, a, l, s, d, v) {
      var g, E;
      switch (g = Bi(t, a), ny(t, a), t) {
        case "dialog":
          wn("cancel", e), wn("close", e);
          break;
        case "iframe":
        case "object":
        case "embed":
          wn("load", e);
          break;
        case "video":
        case "audio":
          for (var b = 0; b < th.length; b++)
            wn(th[b], e);
          break;
        case "source":
          wn("error", e);
          break;
        case "img":
        case "image":
        case "link":
          wn("error", e), wn("load", e);
          break;
        case "details":
          wn("toggle", e);
          break;
        case "input":
          Ss(e, a), wn("invalid", e);
          break;
        case "option":
          zc(e, a);
          break;
        case "select":
          zv(e, a), wn("invalid", e);
          break;
        case "textarea":
          jv(e, a), wn("invalid", e);
          break;
      }
      Vc(t, a);
      {
        E = /* @__PURE__ */ new Set();
        for (var x = e.attributes, L = 0; L < x.length; L++) {
          var M = x[L].name.toLowerCase();
          switch (M) {
            case "value":
              break;
            case "checked":
              break;
            case "selected":
              break;
            default:
              E.add(x[L].name);
          }
        }
      }
      var V = null;
      for (var I in a)
        if (a.hasOwnProperty(I)) {
          var $ = a[I];
          if (I === rc)
            typeof $ == "string" ? e.textContent !== $ && (a[Bu] !== !0 && iy(e.textContent, $, d, v), V = [rc, $]) : typeof $ == "number" && e.textContent !== "" + $ && (a[Bu] !== !0 && iy(e.textContent, $, d, v), V = [rc, "" + $]);
          else if (mn.hasOwnProperty(I))
            $ != null && (typeof $ != "function" && ry(I, $), I === "onScroll" && wn("scroll", e));
          else if (v && // Convince Flow we've calculated it (it's DEV-only in this method.)
          typeof g == "boolean") {
            var ge = void 0, We = g && Kt ? null : tn(I);
            if (a[Bu] !== !0) {
              if (!(I === ey || I === Bu || // Controlled attributes are not validated
              // TODO: Only ignore them on controlled tags.
              I === "value" || I === "checked" || I === "selected")) {
                if (I === ah) {
                  var He = e.innerHTML, Dt = $ ? $[ty] : void 0;
                  if (Dt != null) {
                    var bt = tC(e, Dt);
                    bt !== He && ih(I, He, bt);
                  }
                } else if (I === ac) {
                  if (E.delete(I), eC) {
                    var F = y0($);
                    ge = e.getAttribute("style"), F !== ge && ih(I, ge, F);
                  }
                } else if (g && !Kt)
                  E.delete(I.toLowerCase()), ge = eu(e, I, $), $ !== ge && ih(I, ge, $);
                else if (!qe(I, We, g) && !pt(I, $, We, g)) {
                  var G = !1;
                  if (We !== null)
                    E.delete(We.attributeName), ge = Jl(e, I, $, We);
                  else {
                    var H = l;
                    if (H === Pi && (H = Fc(t)), H === Pi)
                      E.delete(I.toLowerCase());
                    else {
                      var re = QR(I);
                      re !== null && re !== I && (G = !0, E.delete(re)), E.delete(I);
                    }
                    ge = eu(e, I, $);
                  }
                  var _e = Kt;
                  !_e && $ !== ge && !G && ih(I, ge, $);
                }
              }
            }
          }
        }
      switch (v && // $FlowFixMe - Should be inferred as not undefined.
      E.size > 0 && a[Bu] !== !0 && Jw(E), t) {
        case "input":
          ro(e), Es(e, a, !0);
          break;
        case "textarea":
          ro(e), Hv(e);
          break;
        case "select":
        case "option":
          break;
        default:
          typeof a.onClick == "function" && ly(e);
          break;
      }
      return V;
    }
    function XR(e, t, a) {
      var l = e.nodeValue !== t;
      return l;
    }
    function X0(e, t) {
      {
        if (Va)
          return;
        Va = !0, S("Did not expect server HTML to contain a <%s> in <%s>.", t.nodeName.toLowerCase(), e.nodeName.toLowerCase());
      }
    }
    function K0(e, t) {
      {
        if (Va)
          return;
        Va = !0, S('Did not expect server HTML to contain the text node "%s" in <%s>.', t.nodeValue, e.nodeName.toLowerCase());
      }
    }
    function Z0(e, t, a) {
      {
        if (Va)
          return;
        Va = !0, S("Expected server HTML to contain a matching <%s> in <%s>.", t, e.nodeName.toLowerCase());
      }
    }
    function J0(e, t) {
      {
        if (t === "" || Va)
          return;
        Va = !0, S('Expected server HTML to contain a matching text node for "%s" in <%s>.', t, e.nodeName.toLowerCase());
      }
    }
    function KR(e, t, a) {
      switch (t) {
        case "input":
          Nv(e, a);
          return;
        case "textarea":
          tp(e, a);
          return;
        case "select":
          c0(e, a);
          return;
      }
    }
    var lh = function() {
    }, oh = function() {
    };
    {
      var ZR = ["address", "applet", "area", "article", "aside", "base", "basefont", "bgsound", "blockquote", "body", "br", "button", "caption", "center", "col", "colgroup", "dd", "details", "dir", "div", "dl", "dt", "embed", "fieldset", "figcaption", "figure", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "iframe", "img", "input", "isindex", "li", "link", "listing", "main", "marquee", "menu", "menuitem", "meta", "nav", "noembed", "noframes", "noscript", "object", "ol", "p", "param", "plaintext", "pre", "script", "section", "select", "source", "style", "summary", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "title", "tr", "track", "ul", "wbr", "xmp"], rC = [
        "applet",
        "caption",
        "html",
        "table",
        "td",
        "th",
        "marquee",
        "object",
        "template",
        // https://html.spec.whatwg.org/multipage/syntax.html#html-integration-point
        // TODO: Distinguish by namespace here -- for <title>, including it here
        // errs on the side of fewer warnings
        "foreignObject",
        "desc",
        "title"
      ], JR = rC.concat(["button"]), eD = ["dd", "dt", "li", "option", "optgroup", "p", "rp", "rt"], aC = {
        current: null,
        formTag: null,
        aTagInScope: null,
        buttonTagInScope: null,
        nobrTagInScope: null,
        pTagInButtonScope: null,
        listItemTagAutoclosing: null,
        dlItemTagAutoclosing: null
      };
      oh = function(e, t) {
        var a = St({}, e || aC), l = {
          tag: t
        };
        return rC.indexOf(t) !== -1 && (a.aTagInScope = null, a.buttonTagInScope = null, a.nobrTagInScope = null), JR.indexOf(t) !== -1 && (a.pTagInButtonScope = null), ZR.indexOf(t) !== -1 && t !== "address" && t !== "div" && t !== "p" && (a.listItemTagAutoclosing = null, a.dlItemTagAutoclosing = null), a.current = l, t === "form" && (a.formTag = l), t === "a" && (a.aTagInScope = l), t === "button" && (a.buttonTagInScope = l), t === "nobr" && (a.nobrTagInScope = l), t === "p" && (a.pTagInButtonScope = l), t === "li" && (a.listItemTagAutoclosing = l), (t === "dd" || t === "dt") && (a.dlItemTagAutoclosing = l), a;
      };
      var tD = function(e, t) {
        switch (t) {
          case "select":
            return e === "option" || e === "optgroup" || e === "#text";
          case "optgroup":
            return e === "option" || e === "#text";
          case "option":
            return e === "#text";
          case "tr":
            return e === "th" || e === "td" || e === "style" || e === "script" || e === "template";
          case "tbody":
          case "thead":
          case "tfoot":
            return e === "tr" || e === "style" || e === "script" || e === "template";
          case "colgroup":
            return e === "col" || e === "template";
          case "table":
            return e === "caption" || e === "colgroup" || e === "tbody" || e === "tfoot" || e === "thead" || e === "style" || e === "script" || e === "template";
          case "head":
            return e === "base" || e === "basefont" || e === "bgsound" || e === "link" || e === "meta" || e === "title" || e === "noscript" || e === "noframes" || e === "style" || e === "script" || e === "template";
          case "html":
            return e === "head" || e === "body" || e === "frameset";
          case "frameset":
            return e === "frame";
          case "#document":
            return e === "html";
        }
        switch (e) {
          case "h1":
          case "h2":
          case "h3":
          case "h4":
          case "h5":
          case "h6":
            return t !== "h1" && t !== "h2" && t !== "h3" && t !== "h4" && t !== "h5" && t !== "h6";
          case "rp":
          case "rt":
            return eD.indexOf(t) === -1;
          case "body":
          case "caption":
          case "col":
          case "colgroup":
          case "frameset":
          case "frame":
          case "head":
          case "html":
          case "tbody":
          case "td":
          case "tfoot":
          case "th":
          case "thead":
          case "tr":
            return t == null;
        }
        return !0;
      }, nD = function(e, t) {
        switch (e) {
          case "address":
          case "article":
          case "aside":
          case "blockquote":
          case "center":
          case "details":
          case "dialog":
          case "dir":
          case "div":
          case "dl":
          case "fieldset":
          case "figcaption":
          case "figure":
          case "footer":
          case "header":
          case "hgroup":
          case "main":
          case "menu":
          case "nav":
          case "ol":
          case "p":
          case "section":
          case "summary":
          case "ul":
          case "pre":
          case "listing":
          case "table":
          case "hr":
          case "xmp":
          case "h1":
          case "h2":
          case "h3":
          case "h4":
          case "h5":
          case "h6":
            return t.pTagInButtonScope;
          case "form":
            return t.formTag || t.pTagInButtonScope;
          case "li":
            return t.listItemTagAutoclosing;
          case "dd":
          case "dt":
            return t.dlItemTagAutoclosing;
          case "button":
            return t.buttonTagInScope;
          case "a":
            return t.aTagInScope;
          case "nobr":
            return t.nobrTagInScope;
        }
        return null;
      }, iC = {};
      lh = function(e, t, a) {
        a = a || aC;
        var l = a.current, s = l && l.tag;
        t != null && (e != null && S("validateDOMNesting: when childText is passed, childTag should be null"), e = "#text");
        var d = tD(e, s) ? null : l, v = d ? null : nD(e, a), g = d || v;
        if (g) {
          var E = g.tag, b = !!d + "|" + e + "|" + E;
          if (!iC[b]) {
            iC[b] = !0;
            var x = e, L = "";
            if (e === "#text" ? /\S/.test(t) ? x = "Text nodes" : (x = "Whitespace text nodes", L = " Make sure you don't have any extra whitespace between tags on each line of your source code.") : x = "<" + e + ">", d) {
              var M = "";
              E === "table" && e === "tr" && (M += " Add a <tbody>, <thead> or <tfoot> to your code to match the DOM tree generated by the browser."), S("validateDOMNesting(...): %s cannot appear as a child of <%s>.%s%s", x, E, L, M);
            } else
              S("validateDOMNesting(...): %s cannot appear as a descendant of <%s>.", x, E);
          }
        }
      };
    }
    var oy = "suppressHydrationWarning", uy = "$", sy = "/$", uh = "$?", sh = "$!", rD = "style", eS = null, tS = null;
    function aD(e) {
      var t, a, l = e.nodeType;
      switch (l) {
        case li:
        case ao: {
          t = l === li ? "#document" : "#fragment";
          var s = e.documentElement;
          a = s ? s.namespaceURI : rp(null, "");
          break;
        }
        default: {
          var d = l === Fn ? e.parentNode : e, v = d.namespaceURI || null;
          t = d.tagName, a = rp(v, t);
          break;
        }
      }
      {
        var g = t.toLowerCase(), E = oh(null, g);
        return {
          namespace: a,
          ancestorInfo: E
        };
      }
    }
    function iD(e, t, a) {
      {
        var l = e, s = rp(l.namespace, t), d = oh(l.ancestorInfo, t);
        return {
          namespace: s,
          ancestorInfo: d
        };
      }
    }
    function kF(e) {
      return e;
    }
    function lD(e) {
      eS = zu(), tS = ER();
      var t = null;
      return na(!1), t;
    }
    function oD(e) {
      wR(tS), na(eS), eS = null, tS = null;
    }
    function uD(e, t, a, l, s) {
      var d;
      {
        var v = l;
        if (lh(e, null, v.ancestorInfo), typeof t.children == "string" || typeof t.children == "number") {
          var g = "" + t.children, E = oh(v.ancestorInfo, e);
          lh(null, g, E);
        }
        d = v.namespace;
      }
      var b = BR(e, t, a, d);
      return dh(s, b), sS(b, t), b;
    }
    function sD(e, t) {
      e.appendChild(t);
    }
    function cD(e, t, a, l, s) {
      switch (WR(e, t, a, l), t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          return !!a.autoFocus;
        case "img":
          return !0;
        default:
          return !1;
      }
    }
    function fD(e, t, a, l, s, d) {
      {
        var v = d;
        if (typeof l.children != typeof a.children && (typeof l.children == "string" || typeof l.children == "number")) {
          var g = "" + l.children, E = oh(v.ancestorInfo, t);
          lh(null, g, E);
        }
      }
      return $R(e, t, a, l);
    }
    function nS(e, t) {
      return e === "textarea" || e === "noscript" || typeof t.children == "string" || typeof t.children == "number" || typeof t.dangerouslySetInnerHTML == "object" && t.dangerouslySetInnerHTML !== null && t.dangerouslySetInnerHTML.__html != null;
    }
    function dD(e, t, a, l) {
      {
        var s = a;
        lh(null, e, s.ancestorInfo);
      }
      var d = IR(e, t);
      return dh(l, d), d;
    }
    function pD() {
      var e = window.event;
      return e === void 0 ? Ci : Af(e.type);
    }
    var rS = typeof setTimeout == "function" ? setTimeout : void 0, hD = typeof clearTimeout == "function" ? clearTimeout : void 0, aS = -1, lC = typeof Promise == "function" ? Promise : void 0, vD = typeof queueMicrotask == "function" ? queueMicrotask : typeof lC < "u" ? function(e) {
      return lC.resolve(null).then(e).catch(mD);
    } : rS;
    function mD(e) {
      setTimeout(function() {
        throw e;
      });
    }
    function yD(e, t, a, l) {
      switch (t) {
        case "button":
        case "input":
        case "select":
        case "textarea":
          a.autoFocus && e.focus();
          return;
        case "img": {
          a.src && (e.src = a.src);
          return;
        }
      }
    }
    function gD(e, t, a, l, s, d) {
      GR(e, t, a, l, s), sS(e, s);
    }
    function oC(e) {
      Yc(e, "");
    }
    function SD(e, t, a) {
      e.nodeValue = a;
    }
    function ED(e, t) {
      e.appendChild(t);
    }
    function wD(e, t) {
      var a;
      e.nodeType === Fn ? (a = e.parentNode, a.insertBefore(t, e)) : (a = e, a.appendChild(t));
      var l = e._reactRootContainer;
      l == null && a.onclick === null && ly(a);
    }
    function CD(e, t, a) {
      e.insertBefore(t, a);
    }
    function bD(e, t, a) {
      e.nodeType === Fn ? e.parentNode.insertBefore(t, a) : e.insertBefore(t, a);
    }
    function xD(e, t) {
      e.removeChild(t);
    }
    function TD(e, t) {
      e.nodeType === Fn ? e.parentNode.removeChild(t) : e.removeChild(t);
    }
    function iS(e, t) {
      var a = t, l = 0;
      do {
        var s = a.nextSibling;
        if (e.removeChild(a), s && s.nodeType === Fn) {
          var d = s.data;
          if (d === sy)
            if (l === 0) {
              e.removeChild(s), Rn(t);
              return;
            } else
              l--;
          else (d === uy || d === uh || d === sh) && l++;
        }
        a = s;
      } while (a);
      Rn(t);
    }
    function _D(e, t) {
      e.nodeType === Fn ? iS(e.parentNode, t) : e.nodeType === $r && iS(e, t), Rn(e);
    }
    function RD(e) {
      e = e;
      var t = e.style;
      typeof t.setProperty == "function" ? t.setProperty("display", "none", "important") : t.display = "none";
    }
    function DD(e) {
      e.nodeValue = "";
    }
    function kD(e, t) {
      e = e;
      var a = t[rD], l = a != null && a.hasOwnProperty("display") ? a.display : null;
      e.style.display = Pc("display", l);
    }
    function OD(e, t) {
      e.nodeValue = t;
    }
    function MD(e) {
      e.nodeType === $r ? e.textContent = "" : e.nodeType === li && e.documentElement && e.removeChild(e.documentElement);
    }
    function ND(e, t, a) {
      return e.nodeType !== $r || t.toLowerCase() !== e.nodeName.toLowerCase() ? null : e;
    }
    function LD(e, t) {
      return t === "" || e.nodeType !== Vi ? null : e;
    }
    function AD(e) {
      return e.nodeType !== Fn ? null : e;
    }
    function uC(e) {
      return e.data === uh;
    }
    function lS(e) {
      return e.data === sh;
    }
    function UD(e) {
      var t = e.nextSibling && e.nextSibling.dataset, a, l, s;
      return t && (a = t.dgst, l = t.msg, s = t.stck), {
        message: l,
        digest: a,
        stack: s
      };
    }
    function zD(e, t) {
      e._reactRetry = t;
    }
    function cy(e) {
      for (; e != null; e = e.nextSibling) {
        var t = e.nodeType;
        if (t === $r || t === Vi)
          break;
        if (t === Fn) {
          var a = e.data;
          if (a === uy || a === sh || a === uh)
            break;
          if (a === sy)
            return null;
        }
      }
      return e;
    }
    function ch(e) {
      return cy(e.nextSibling);
    }
    function jD(e) {
      return cy(e.firstChild);
    }
    function FD(e) {
      return cy(e.firstChild);
    }
    function HD(e) {
      return cy(e.nextSibling);
    }
    function YD(e, t, a, l, s, d, v) {
      dh(d, e), sS(e, a);
      var g;
      {
        var E = s;
        g = E.namespace;
      }
      var b = (d.mode & Fe) !== ze;
      return qR(e, t, a, g, l, b, v);
    }
    function PD(e, t, a, l) {
      return dh(a, e), a.mode & Fe, XR(e, t);
    }
    function VD(e, t) {
      dh(t, e);
    }
    function BD(e) {
      for (var t = e.nextSibling, a = 0; t; ) {
        if (t.nodeType === Fn) {
          var l = t.data;
          if (l === sy) {
            if (a === 0)
              return ch(t);
            a--;
          } else (l === uy || l === sh || l === uh) && a++;
        }
        t = t.nextSibling;
      }
      return null;
    }
    function sC(e) {
      for (var t = e.previousSibling, a = 0; t; ) {
        if (t.nodeType === Fn) {
          var l = t.data;
          if (l === uy || l === sh || l === uh) {
            if (a === 0)
              return t;
            a--;
          } else l === sy && a++;
        }
        t = t.previousSibling;
      }
      return null;
    }
    function ID(e) {
      Rn(e);
    }
    function WD(e) {
      Rn(e);
    }
    function $D(e) {
      return e !== "head" && e !== "body";
    }
    function GD(e, t, a, l) {
      var s = !0;
      iy(t.nodeValue, a, l, s);
    }
    function QD(e, t, a, l, s, d) {
      if (t[oy] !== !0) {
        var v = !0;
        iy(l.nodeValue, s, d, v);
      }
    }
    function qD(e, t) {
      t.nodeType === $r ? X0(e, t) : t.nodeType === Fn || K0(e, t);
    }
    function XD(e, t) {
      {
        var a = e.parentNode;
        a !== null && (t.nodeType === $r ? X0(a, t) : t.nodeType === Fn || K0(a, t));
      }
    }
    function KD(e, t, a, l, s) {
      (s || t[oy] !== !0) && (l.nodeType === $r ? X0(a, l) : l.nodeType === Fn || K0(a, l));
    }
    function ZD(e, t, a) {
      Z0(e, t);
    }
    function JD(e, t) {
      J0(e, t);
    }
    function ek(e, t, a) {
      {
        var l = e.parentNode;
        l !== null && Z0(l, t);
      }
    }
    function tk(e, t) {
      {
        var a = e.parentNode;
        a !== null && J0(a, t);
      }
    }
    function nk(e, t, a, l, s, d) {
      (d || t[oy] !== !0) && Z0(a, l);
    }
    function rk(e, t, a, l, s) {
      (s || t[oy] !== !0) && J0(a, l);
    }
    function ak(e) {
      S("An error occurred during hydration. The server HTML was replaced with client content in <%s>.", e.nodeName.toLowerCase());
    }
    function ik(e) {
      nh(e);
    }
    var Zf = Math.random().toString(36).slice(2), Jf = "__reactFiber$" + Zf, oS = "__reactProps$" + Zf, fh = "__reactContainer$" + Zf, uS = "__reactEvents$" + Zf, lk = "__reactListeners$" + Zf, ok = "__reactHandles$" + Zf;
    function uk(e) {
      delete e[Jf], delete e[oS], delete e[uS], delete e[lk], delete e[ok];
    }
    function dh(e, t) {
      t[Jf] = e;
    }
    function fy(e, t) {
      t[fh] = e;
    }
    function cC(e) {
      e[fh] = null;
    }
    function ph(e) {
      return !!e[fh];
    }
    function ic(e) {
      var t = e[Jf];
      if (t)
        return t;
      for (var a = e.parentNode; a; ) {
        if (t = a[fh] || a[Jf], t) {
          var l = t.alternate;
          if (t.child !== null || l !== null && l.child !== null)
            for (var s = sC(e); s !== null; ) {
              var d = s[Jf];
              if (d)
                return d;
              s = sC(s);
            }
          return t;
        }
        e = a, a = e.parentNode;
      }
      return null;
    }
    function Iu(e) {
      var t = e[Jf] || e[fh];
      return t && (t.tag === Q || t.tag === oe || t.tag === be || t.tag === W) ? t : null;
    }
    function ed(e) {
      if (e.tag === Q || e.tag === oe)
        return e.stateNode;
      throw new Error("getNodeFromInstance: Invalid argument.");
    }
    function dy(e) {
      return e[oS] || null;
    }
    function sS(e, t) {
      e[oS] = t;
    }
    function sk(e) {
      var t = e[uS];
      return t === void 0 && (t = e[uS] = /* @__PURE__ */ new Set()), t;
    }
    var fC = {}, dC = c.ReactDebugCurrentFrame;
    function py(e) {
      if (e) {
        var t = e._owner, a = ds(e.type, e._source, t ? t.type : null);
        dC.setExtraStackFrame(a);
      } else
        dC.setExtraStackFrame(null);
    }
    function tl(e, t, a, l, s) {
      {
        var d = Function.call.bind(vt);
        for (var v in e)
          if (d(e, v)) {
            var g = void 0;
            try {
              if (typeof e[v] != "function") {
                var E = Error((l || "React class") + ": " + a + " type `" + v + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof e[v] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw E.name = "Invariant Violation", E;
              }
              g = e[v](t, v, l, a, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (b) {
              g = b;
            }
            g && !(g instanceof Error) && (py(s), S("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", l || "React class", a, v, typeof g), py(null)), g instanceof Error && !(g.message in fC) && (fC[g.message] = !0, py(s), S("Failed %s type: %s", a, g.message), py(null));
          }
      }
    }
    var cS = [], hy;
    hy = [];
    var ko = -1;
    function Wu(e) {
      return {
        current: e
      };
    }
    function ra(e, t) {
      if (ko < 0) {
        S("Unexpected pop.");
        return;
      }
      t !== hy[ko] && S("Unexpected Fiber popped."), e.current = cS[ko], cS[ko] = null, hy[ko] = null, ko--;
    }
    function aa(e, t, a) {
      ko++, cS[ko] = e.current, hy[ko] = a, e.current = t;
    }
    var fS;
    fS = {};
    var ci = {};
    Object.freeze(ci);
    var Oo = Wu(ci), zl = Wu(!1), dS = ci;
    function td(e, t, a) {
      return a && jl(t) ? dS : Oo.current;
    }
    function pC(e, t, a) {
      {
        var l = e.stateNode;
        l.__reactInternalMemoizedUnmaskedChildContext = t, l.__reactInternalMemoizedMaskedChildContext = a;
      }
    }
    function nd(e, t) {
      {
        var a = e.type, l = a.contextTypes;
        if (!l)
          return ci;
        var s = e.stateNode;
        if (s && s.__reactInternalMemoizedUnmaskedChildContext === t)
          return s.__reactInternalMemoizedMaskedChildContext;
        var d = {};
        for (var v in l)
          d[v] = t[v];
        {
          var g = st(e) || "Unknown";
          tl(l, d, "context", g);
        }
        return s && pC(e, t, d), d;
      }
    }
    function vy() {
      return zl.current;
    }
    function jl(e) {
      {
        var t = e.childContextTypes;
        return t != null;
      }
    }
    function my(e) {
      ra(zl, e), ra(Oo, e);
    }
    function pS(e) {
      ra(zl, e), ra(Oo, e);
    }
    function hC(e, t, a) {
      {
        if (Oo.current !== ci)
          throw new Error("Unexpected context found on stack. This error is likely caused by a bug in React. Please file an issue.");
        aa(Oo, t, e), aa(zl, a, e);
      }
    }
    function vC(e, t, a) {
      {
        var l = e.stateNode, s = t.childContextTypes;
        if (typeof l.getChildContext != "function") {
          {
            var d = st(e) || "Unknown";
            fS[d] || (fS[d] = !0, S("%s.childContextTypes is specified but there is no getChildContext() method on the instance. You can either define getChildContext() on %s or remove childContextTypes from it.", d, d));
          }
          return a;
        }
        var v = l.getChildContext();
        for (var g in v)
          if (!(g in s))
            throw new Error((st(e) || "Unknown") + '.getChildContext(): key "' + g + '" is not defined in childContextTypes.');
        {
          var E = st(e) || "Unknown";
          tl(s, v, "child context", E);
        }
        return St({}, a, v);
      }
    }
    function yy(e) {
      {
        var t = e.stateNode, a = t && t.__reactInternalMemoizedMergedChildContext || ci;
        return dS = Oo.current, aa(Oo, a, e), aa(zl, zl.current, e), !0;
      }
    }
    function mC(e, t, a) {
      {
        var l = e.stateNode;
        if (!l)
          throw new Error("Expected to have an instance by this point. This error is likely caused by a bug in React. Please file an issue.");
        if (a) {
          var s = vC(e, t, dS);
          l.__reactInternalMemoizedMergedChildContext = s, ra(zl, e), ra(Oo, e), aa(Oo, s, e), aa(zl, a, e);
        } else
          ra(zl, e), aa(zl, a, e);
      }
    }
    function ck(e) {
      {
        if (!bp(e) || e.tag !== A)
          throw new Error("Expected subtree parent to be a mounted class component. This error is likely caused by a bug in React. Please file an issue.");
        var t = e;
        do {
          switch (t.tag) {
            case W:
              return t.stateNode.context;
            case A: {
              var a = t.type;
              if (jl(a))
                return t.stateNode.__reactInternalMemoizedMergedChildContext;
              break;
            }
          }
          t = t.return;
        } while (t !== null);
        throw new Error("Found unexpected detached subtree parent. This error is likely caused by a bug in React. Please file an issue.");
      }
    }
    var $u = 0, gy = 1, Mo = null, hS = !1, vS = !1;
    function yC(e) {
      Mo === null ? Mo = [e] : Mo.push(e);
    }
    function fk(e) {
      hS = !0, yC(e);
    }
    function gC() {
      hS && Gu();
    }
    function Gu() {
      if (!vS && Mo !== null) {
        vS = !0;
        var e = 0, t = ja();
        try {
          var a = !0, l = Mo;
          for (_n(Ln); e < l.length; e++) {
            var s = l[e];
            do
              s = s(a);
            while (s !== null);
          }
          Mo = null, hS = !1;
        } catch (d) {
          throw Mo !== null && (Mo = Mo.slice(e + 1)), Zc(ef, Gu), d;
        } finally {
          _n(t), vS = !1;
        }
      }
      return null;
    }
    var rd = [], ad = 0, Sy = null, Ey = 0, _i = [], Ri = 0, lc = null, No = 1, Lo = "";
    function dk(e) {
      return uc(), (e.flags & Ep) !== Be;
    }
    function pk(e) {
      return uc(), Ey;
    }
    function hk() {
      var e = Lo, t = No, a = t & ~vk(t);
      return a.toString(32) + e;
    }
    function oc(e, t) {
      uc(), rd[ad++] = Ey, rd[ad++] = Sy, Sy = e, Ey = t;
    }
    function SC(e, t, a) {
      uc(), _i[Ri++] = No, _i[Ri++] = Lo, _i[Ri++] = lc, lc = e;
      var l = No, s = Lo, d = wy(l) - 1, v = l & ~(1 << d), g = a + 1, E = wy(t) + d;
      if (E > 30) {
        var b = d - d % 5, x = (1 << b) - 1, L = (v & x).toString(32), M = v >> b, V = d - b, I = wy(t) + V, $ = g << V, ge = $ | M, We = L + s;
        No = 1 << I | ge, Lo = We;
      } else {
        var He = g << d, Dt = He | v, bt = s;
        No = 1 << E | Dt, Lo = bt;
      }
    }
    function mS(e) {
      uc();
      var t = e.return;
      if (t !== null) {
        var a = 1, l = 0;
        oc(e, a), SC(e, a, l);
      }
    }
    function wy(e) {
      return 32 - Su(e);
    }
    function vk(e) {
      return 1 << wy(e) - 1;
    }
    function yS(e) {
      for (; e === Sy; )
        Sy = rd[--ad], rd[ad] = null, Ey = rd[--ad], rd[ad] = null;
      for (; e === lc; )
        lc = _i[--Ri], _i[Ri] = null, Lo = _i[--Ri], _i[Ri] = null, No = _i[--Ri], _i[Ri] = null;
    }
    function mk() {
      return uc(), lc !== null ? {
        id: No,
        overflow: Lo
      } : null;
    }
    function yk(e, t) {
      uc(), _i[Ri++] = No, _i[Ri++] = Lo, _i[Ri++] = lc, No = t.id, Lo = t.overflow, lc = e;
    }
    function uc() {
      Ur() || S("Expected to be hydrating. This is a bug in React. Please file an issue.");
    }
    var Ar = null, Di = null, nl = !1, sc = !1, Qu = null;
    function gk() {
      nl && S("We should not be hydrating here. This is a bug in React. Please file a bug.");
    }
    function EC() {
      sc = !0;
    }
    function Sk() {
      return sc;
    }
    function Ek(e) {
      var t = e.stateNode.containerInfo;
      return Di = FD(t), Ar = e, nl = !0, Qu = null, sc = !1, !0;
    }
    function wk(e, t, a) {
      return Di = HD(t), Ar = e, nl = !0, Qu = null, sc = !1, a !== null && yk(e, a), !0;
    }
    function wC(e, t) {
      switch (e.tag) {
        case W: {
          qD(e.stateNode.containerInfo, t);
          break;
        }
        case Q: {
          var a = (e.mode & Fe) !== ze;
          KD(
            e.type,
            e.memoizedProps,
            e.stateNode,
            t,
            // TODO: Delete this argument when we remove the legacy root API.
            a
          );
          break;
        }
        case be: {
          var l = e.memoizedState;
          l.dehydrated !== null && XD(l.dehydrated, t);
          break;
        }
      }
    }
    function CC(e, t) {
      wC(e, t);
      var a = TN();
      a.stateNode = t, a.return = e;
      var l = e.deletions;
      l === null ? (e.deletions = [a], e.flags |= jt) : l.push(a);
    }
    function gS(e, t) {
      {
        if (sc)
          return;
        switch (e.tag) {
          case W: {
            var a = e.stateNode.containerInfo;
            switch (t.tag) {
              case Q:
                var l = t.type;
                t.pendingProps, ZD(a, l);
                break;
              case oe:
                var s = t.pendingProps;
                JD(a, s);
                break;
            }
            break;
          }
          case Q: {
            var d = e.type, v = e.memoizedProps, g = e.stateNode;
            switch (t.tag) {
              case Q: {
                var E = t.type, b = t.pendingProps, x = (e.mode & Fe) !== ze;
                nk(
                  d,
                  v,
                  g,
                  E,
                  b,
                  // TODO: Delete this argument when we remove the legacy root API.
                  x
                );
                break;
              }
              case oe: {
                var L = t.pendingProps, M = (e.mode & Fe) !== ze;
                rk(
                  d,
                  v,
                  g,
                  L,
                  // TODO: Delete this argument when we remove the legacy root API.
                  M
                );
                break;
              }
            }
            break;
          }
          case be: {
            var V = e.memoizedState, I = V.dehydrated;
            if (I !== null) switch (t.tag) {
              case Q:
                var $ = t.type;
                t.pendingProps, ek(I, $);
                break;
              case oe:
                var ge = t.pendingProps;
                tk(I, ge);
                break;
            }
            break;
          }
          default:
            return;
        }
      }
    }
    function bC(e, t) {
      t.flags = t.flags & ~Ma | on, gS(e, t);
    }
    function xC(e, t) {
      switch (e.tag) {
        case Q: {
          var a = e.type;
          e.pendingProps;
          var l = ND(t, a);
          return l !== null ? (e.stateNode = l, Ar = e, Di = jD(l), !0) : !1;
        }
        case oe: {
          var s = e.pendingProps, d = LD(t, s);
          return d !== null ? (e.stateNode = d, Ar = e, Di = null, !0) : !1;
        }
        case be: {
          var v = AD(t);
          if (v !== null) {
            var g = {
              dehydrated: v,
              treeContext: mk(),
              retryLane: Or
            };
            e.memoizedState = g;
            var E = _N(v);
            return E.return = e, e.child = E, Ar = e, Di = null, !0;
          }
          return !1;
        }
        default:
          return !1;
      }
    }
    function SS(e) {
      return (e.mode & Fe) !== ze && (e.flags & nt) === Be;
    }
    function ES(e) {
      throw new Error("Hydration failed because the initial UI does not match what was rendered on the server.");
    }
    function wS(e) {
      if (nl) {
        var t = Di;
        if (!t) {
          SS(e) && (gS(Ar, e), ES()), bC(Ar, e), nl = !1, Ar = e;
          return;
        }
        var a = t;
        if (!xC(e, t)) {
          SS(e) && (gS(Ar, e), ES()), t = ch(a);
          var l = Ar;
          if (!t || !xC(e, t)) {
            bC(Ar, e), nl = !1, Ar = e;
            return;
          }
          CC(l, a);
        }
      }
    }
    function Ck(e, t, a) {
      var l = e.stateNode, s = !sc, d = YD(l, e.type, e.memoizedProps, t, a, e, s);
      return e.updateQueue = d, d !== null;
    }
    function bk(e) {
      var t = e.stateNode, a = e.memoizedProps, l = PD(t, a, e);
      if (l) {
        var s = Ar;
        if (s !== null)
          switch (s.tag) {
            case W: {
              var d = s.stateNode.containerInfo, v = (s.mode & Fe) !== ze;
              GD(
                d,
                t,
                a,
                // TODO: Delete this argument when we remove the legacy root API.
                v
              );
              break;
            }
            case Q: {
              var g = s.type, E = s.memoizedProps, b = s.stateNode, x = (s.mode & Fe) !== ze;
              QD(
                g,
                E,
                b,
                t,
                a,
                // TODO: Delete this argument when we remove the legacy root API.
                x
              );
              break;
            }
          }
      }
      return l;
    }
    function xk(e) {
      var t = e.memoizedState, a = t !== null ? t.dehydrated : null;
      if (!a)
        throw new Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
      VD(a, e);
    }
    function Tk(e) {
      var t = e.memoizedState, a = t !== null ? t.dehydrated : null;
      if (!a)
        throw new Error("Expected to have a hydrated suspense instance. This error is likely caused by a bug in React. Please file an issue.");
      return BD(a);
    }
    function TC(e) {
      for (var t = e.return; t !== null && t.tag !== Q && t.tag !== W && t.tag !== be; )
        t = t.return;
      Ar = t;
    }
    function Cy(e) {
      if (e !== Ar)
        return !1;
      if (!nl)
        return TC(e), nl = !0, !1;
      if (e.tag !== W && (e.tag !== Q || $D(e.type) && !nS(e.type, e.memoizedProps))) {
        var t = Di;
        if (t)
          if (SS(e))
            _C(e), ES();
          else
            for (; t; )
              CC(e, t), t = ch(t);
      }
      return TC(e), e.tag === be ? Di = Tk(e) : Di = Ar ? ch(e.stateNode) : null, !0;
    }
    function _k() {
      return nl && Di !== null;
    }
    function _C(e) {
      for (var t = Di; t; )
        wC(e, t), t = ch(t);
    }
    function id() {
      Ar = null, Di = null, nl = !1, sc = !1;
    }
    function RC() {
      Qu !== null && (Ex(Qu), Qu = null);
    }
    function Ur() {
      return nl;
    }
    function CS(e) {
      Qu === null ? Qu = [e] : Qu.push(e);
    }
    var Rk = c.ReactCurrentBatchConfig, Dk = null;
    function kk() {
      return Rk.transition;
    }
    var rl = {
      recordUnsafeLifecycleWarnings: function(e, t) {
      },
      flushPendingUnsafeLifecycleWarnings: function() {
      },
      recordLegacyContextWarning: function(e, t) {
      },
      flushLegacyContextWarning: function() {
      },
      discardPendingWarnings: function() {
      }
    };
    {
      var Ok = function(e) {
        for (var t = null, a = e; a !== null; )
          a.mode & Et && (t = a), a = a.return;
        return t;
      }, cc = function(e) {
        var t = [];
        return e.forEach(function(a) {
          t.push(a);
        }), t.sort().join(", ");
      }, hh = [], vh = [], mh = [], yh = [], gh = [], Sh = [], fc = /* @__PURE__ */ new Set();
      rl.recordUnsafeLifecycleWarnings = function(e, t) {
        fc.has(e.type) || (typeof t.componentWillMount == "function" && // Don't warn about react-lifecycles-compat polyfilled components.
        t.componentWillMount.__suppressDeprecationWarning !== !0 && hh.push(e), e.mode & Et && typeof t.UNSAFE_componentWillMount == "function" && vh.push(e), typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps.__suppressDeprecationWarning !== !0 && mh.push(e), e.mode & Et && typeof t.UNSAFE_componentWillReceiveProps == "function" && yh.push(e), typeof t.componentWillUpdate == "function" && t.componentWillUpdate.__suppressDeprecationWarning !== !0 && gh.push(e), e.mode & Et && typeof t.UNSAFE_componentWillUpdate == "function" && Sh.push(e));
      }, rl.flushPendingUnsafeLifecycleWarnings = function() {
        var e = /* @__PURE__ */ new Set();
        hh.length > 0 && (hh.forEach(function(M) {
          e.add(st(M) || "Component"), fc.add(M.type);
        }), hh = []);
        var t = /* @__PURE__ */ new Set();
        vh.length > 0 && (vh.forEach(function(M) {
          t.add(st(M) || "Component"), fc.add(M.type);
        }), vh = []);
        var a = /* @__PURE__ */ new Set();
        mh.length > 0 && (mh.forEach(function(M) {
          a.add(st(M) || "Component"), fc.add(M.type);
        }), mh = []);
        var l = /* @__PURE__ */ new Set();
        yh.length > 0 && (yh.forEach(function(M) {
          l.add(st(M) || "Component"), fc.add(M.type);
        }), yh = []);
        var s = /* @__PURE__ */ new Set();
        gh.length > 0 && (gh.forEach(function(M) {
          s.add(st(M) || "Component"), fc.add(M.type);
        }), gh = []);
        var d = /* @__PURE__ */ new Set();
        if (Sh.length > 0 && (Sh.forEach(function(M) {
          d.add(st(M) || "Component"), fc.add(M.type);
        }), Sh = []), t.size > 0) {
          var v = cc(t);
          S(`Using UNSAFE_componentWillMount in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.

Please update the following components: %s`, v);
        }
        if (l.size > 0) {
          var g = cc(l);
          S(`Using UNSAFE_componentWillReceiveProps in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://reactjs.org/link/derived-state

Please update the following components: %s`, g);
        }
        if (d.size > 0) {
          var E = cc(d);
          S(`Using UNSAFE_componentWillUpdate in strict mode is not recommended and may indicate bugs in your code. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.

Please update the following components: %s`, E);
        }
        if (e.size > 0) {
          var b = cc(e);
          w(`componentWillMount has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move code with side effects to componentDidMount, and set initial state in the constructor.
* Rename componentWillMount to UNSAFE_componentWillMount to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, b);
        }
        if (a.size > 0) {
          var x = cc(a);
          w(`componentWillReceiveProps has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* If you're updating state whenever props change, refactor your code to use memoization techniques or move it to static getDerivedStateFromProps. Learn more at: https://reactjs.org/link/derived-state
* Rename componentWillReceiveProps to UNSAFE_componentWillReceiveProps to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, x);
        }
        if (s.size > 0) {
          var L = cc(s);
          w(`componentWillUpdate has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.

* Move data fetching code or side effects to componentDidUpdate.
* Rename componentWillUpdate to UNSAFE_componentWillUpdate to suppress this warning in non-strict mode. In React 18.x, only the UNSAFE_ name will work. To rename all deprecated lifecycles to their new names, you can run \`npx react-codemod rename-unsafe-lifecycles\` in your project source folder.

Please update the following components: %s`, L);
        }
      };
      var by = /* @__PURE__ */ new Map(), DC = /* @__PURE__ */ new Set();
      rl.recordLegacyContextWarning = function(e, t) {
        var a = Ok(e);
        if (a === null) {
          S("Expected to find a StrictMode component in a strict mode tree. This error is likely caused by a bug in React. Please file an issue.");
          return;
        }
        if (!DC.has(e.type)) {
          var l = by.get(a);
          (e.type.contextTypes != null || e.type.childContextTypes != null || t !== null && typeof t.getChildContext == "function") && (l === void 0 && (l = [], by.set(a, l)), l.push(e));
        }
      }, rl.flushLegacyContextWarning = function() {
        by.forEach(function(e, t) {
          if (e.length !== 0) {
            var a = e[0], l = /* @__PURE__ */ new Set();
            e.forEach(function(d) {
              l.add(st(d) || "Component"), DC.add(d.type);
            });
            var s = cc(l);
            try {
              Qt(a), S(`Legacy context API has been detected within a strict-mode tree.

The old API will be supported in all 16.x releases, but applications using it should migrate to the new version.

Please update the following components: %s

Learn more about this warning here: https://reactjs.org/link/legacy-context`, s);
            } finally {
              $n();
            }
          }
        });
      }, rl.discardPendingWarnings = function() {
        hh = [], vh = [], mh = [], yh = [], gh = [], Sh = [], by = /* @__PURE__ */ new Map();
      };
    }
    var bS, xS, TS, _S, RS, kC = function(e, t) {
    };
    bS = !1, xS = !1, TS = {}, _S = {}, RS = {}, kC = function(e, t) {
      if (!(e === null || typeof e != "object") && !(!e._store || e._store.validated || e.key != null)) {
        if (typeof e._store != "object")
          throw new Error("React Component in warnForMissingKey should have a _store. This error is likely caused by a bug in React. Please file an issue.");
        e._store.validated = !0;
        var a = st(t) || "Component";
        _S[a] || (_S[a] = !0, S('Each child in a list should have a unique "key" prop. See https://reactjs.org/link/warning-keys for more information.'));
      }
    };
    function Mk(e) {
      return e.prototype && e.prototype.isReactComponent;
    }
    function Eh(e, t, a) {
      var l = a.ref;
      if (l !== null && typeof l != "function" && typeof l != "object") {
        if ((e.mode & Et || Zt) && // We warn in ReactElement.js if owner and self are equal for string refs
        // because these cannot be automatically converted to an arrow function
        // using a codemod. Therefore, we don't have to warn about string refs again.
        !(a._owner && a._self && a._owner.stateNode !== a._self) && // Will already throw with "Function components cannot have string refs"
        !(a._owner && a._owner.tag !== A) && // Will already warn with "Function components cannot be given refs"
        !(typeof a.type == "function" && !Mk(a.type)) && // Will already throw with "Element ref was specified as a string (someStringRef) but no owner was set"
        a._owner) {
          var s = st(e) || "Component";
          TS[s] || (S('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. We recommend using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', s, l), TS[s] = !0);
        }
        if (a._owner) {
          var d = a._owner, v;
          if (d) {
            var g = d;
            if (g.tag !== A)
              throw new Error("Function components cannot have string refs. We recommend using useRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref");
            v = g.stateNode;
          }
          if (!v)
            throw new Error("Missing owner for string ref " + l + ". This error is likely caused by a bug in React. Please file an issue.");
          var E = v;
          In(l, "ref");
          var b = "" + l;
          if (t !== null && t.ref !== null && typeof t.ref == "function" && t.ref._stringRef === b)
            return t.ref;
          var x = function(L) {
            var M = E.refs;
            L === null ? delete M[b] : M[b] = L;
          };
          return x._stringRef = b, x;
        } else {
          if (typeof l != "string")
            throw new Error("Expected ref to be a function, a string, an object returned by React.createRef(), or null.");
          if (!a._owner)
            throw new Error("Element ref was specified as a string (" + l + `) but no owner was set. This could happen for one of the following reasons:
1. You may be adding a ref to a function component
2. You may be adding a ref to a component that was not created inside a component's render method
3. You have multiple copies of React loaded
See https://reactjs.org/link/refs-must-have-owner for more information.`);
        }
      }
      return l;
    }
    function xy(e, t) {
      var a = Object.prototype.toString.call(t);
      throw new Error("Objects are not valid as a React child (found: " + (a === "[object Object]" ? "object with keys {" + Object.keys(t).join(", ") + "}" : a) + "). If you meant to render a collection of children, use an array instead.");
    }
    function Ty(e) {
      {
        var t = st(e) || "Component";
        if (RS[t])
          return;
        RS[t] = !0, S("Functions are not valid as a React child. This may happen if you return a Component instead of <Component /> from render. Or maybe you meant to call this function rather than return it.");
      }
    }
    function OC(e) {
      var t = e._payload, a = e._init;
      return a(t);
    }
    function MC(e) {
      function t(F, G) {
        if (e) {
          var H = F.deletions;
          H === null ? (F.deletions = [G], F.flags |= jt) : H.push(G);
        }
      }
      function a(F, G) {
        if (!e)
          return null;
        for (var H = G; H !== null; )
          t(F, H), H = H.sibling;
        return null;
      }
      function l(F, G) {
        for (var H = /* @__PURE__ */ new Map(), re = G; re !== null; )
          re.key !== null ? H.set(re.key, re) : H.set(re.index, re), re = re.sibling;
        return H;
      }
      function s(F, G) {
        var H = Ec(F, G);
        return H.index = 0, H.sibling = null, H;
      }
      function d(F, G, H) {
        if (F.index = H, !e)
          return F.flags |= Ep, G;
        var re = F.alternate;
        if (re !== null) {
          var _e = re.index;
          return _e < G ? (F.flags |= on, G) : _e;
        } else
          return F.flags |= on, G;
      }
      function v(F) {
        return e && F.alternate === null && (F.flags |= on), F;
      }
      function g(F, G, H, re) {
        if (G === null || G.tag !== oe) {
          var _e = CE(H, F.mode, re);
          return _e.return = F, _e;
        } else {
          var Ce = s(G, H);
          return Ce.return = F, Ce;
        }
      }
      function E(F, G, H, re) {
        var _e = H.type;
        if (_e === ni)
          return x(F, G, H.props.children, re, H.key);
        if (G !== null && (G.elementType === _e || // Keep this check inline so it only runs on the false path:
        zx(G, H) || // Lazy types should reconcile their resolved type.
        // We need to do this after the Hot Reloading check above,
        // because hot reloading has different semantics than prod because
        // it doesn't resuspend. So we can't let the call below suspend.
        typeof _e == "object" && _e !== null && _e.$$typeof === Ze && OC(_e) === G.type)) {
          var Ce = s(G, H.props);
          return Ce.ref = Eh(F, G, H), Ce.return = F, Ce._debugSource = H._source, Ce._debugOwner = H._owner, Ce;
        }
        var et = wE(H, F.mode, re);
        return et.ref = Eh(F, G, H), et.return = F, et;
      }
      function b(F, G, H, re) {
        if (G === null || G.tag !== X || G.stateNode.containerInfo !== H.containerInfo || G.stateNode.implementation !== H.implementation) {
          var _e = bE(H, F.mode, re);
          return _e.return = F, _e;
        } else {
          var Ce = s(G, H.children || []);
          return Ce.return = F, Ce;
        }
      }
      function x(F, G, H, re, _e) {
        if (G === null || G.tag !== we) {
          var Ce = is(H, F.mode, re, _e);
          return Ce.return = F, Ce;
        } else {
          var et = s(G, H);
          return et.return = F, et;
        }
      }
      function L(F, G, H) {
        if (typeof G == "string" && G !== "" || typeof G == "number") {
          var re = CE("" + G, F.mode, H);
          return re.return = F, re;
        }
        if (typeof G == "object" && G !== null) {
          switch (G.$$typeof) {
            case Hi: {
              var _e = wE(G, F.mode, H);
              return _e.ref = Eh(F, null, G), _e.return = F, _e;
            }
            case ca: {
              var Ce = bE(G, F.mode, H);
              return Ce.return = F, Ce;
            }
            case Ze: {
              var et = G._payload, lt = G._init;
              return L(F, lt(et), H);
            }
          }
          if (ar(G) || fa(G)) {
            var Xt = is(G, F.mode, H, null);
            return Xt.return = F, Xt;
          }
          xy(F, G);
        }
        return typeof G == "function" && Ty(F), null;
      }
      function M(F, G, H, re) {
        var _e = G !== null ? G.key : null;
        if (typeof H == "string" && H !== "" || typeof H == "number")
          return _e !== null ? null : g(F, G, "" + H, re);
        if (typeof H == "object" && H !== null) {
          switch (H.$$typeof) {
            case Hi:
              return H.key === _e ? E(F, G, H, re) : null;
            case ca:
              return H.key === _e ? b(F, G, H, re) : null;
            case Ze: {
              var Ce = H._payload, et = H._init;
              return M(F, G, et(Ce), re);
            }
          }
          if (ar(H) || fa(H))
            return _e !== null ? null : x(F, G, H, re, null);
          xy(F, H);
        }
        return typeof H == "function" && Ty(F), null;
      }
      function V(F, G, H, re, _e) {
        if (typeof re == "string" && re !== "" || typeof re == "number") {
          var Ce = F.get(H) || null;
          return g(G, Ce, "" + re, _e);
        }
        if (typeof re == "object" && re !== null) {
          switch (re.$$typeof) {
            case Hi: {
              var et = F.get(re.key === null ? H : re.key) || null;
              return E(G, et, re, _e);
            }
            case ca: {
              var lt = F.get(re.key === null ? H : re.key) || null;
              return b(G, lt, re, _e);
            }
            case Ze:
              var Xt = re._payload, Lt = re._init;
              return V(F, G, H, Lt(Xt), _e);
          }
          if (ar(re) || fa(re)) {
            var Zn = F.get(H) || null;
            return x(G, Zn, re, _e, null);
          }
          xy(G, re);
        }
        return typeof re == "function" && Ty(G), null;
      }
      function I(F, G, H) {
        {
          if (typeof F != "object" || F === null)
            return G;
          switch (F.$$typeof) {
            case Hi:
            case ca:
              kC(F, H);
              var re = F.key;
              if (typeof re != "string")
                break;
              if (G === null) {
                G = /* @__PURE__ */ new Set(), G.add(re);
                break;
              }
              if (!G.has(re)) {
                G.add(re);
                break;
              }
              S("Encountered two children with the same key, `%s`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.", re);
              break;
            case Ze:
              var _e = F._payload, Ce = F._init;
              I(Ce(_e), G, H);
              break;
          }
        }
        return G;
      }
      function $(F, G, H, re) {
        for (var _e = null, Ce = 0; Ce < H.length; Ce++) {
          var et = H[Ce];
          _e = I(et, _e, F);
        }
        for (var lt = null, Xt = null, Lt = G, Zn = 0, At = 0, Pn = null; Lt !== null && At < H.length; At++) {
          Lt.index > At ? (Pn = Lt, Lt = null) : Pn = Lt.sibling;
          var la = M(F, Lt, H[At], re);
          if (la === null) {
            Lt === null && (Lt = Pn);
            break;
          }
          e && Lt && la.alternate === null && t(F, Lt), Zn = d(la, Zn, At), Xt === null ? lt = la : Xt.sibling = la, Xt = la, Lt = Pn;
        }
        if (At === H.length) {
          if (a(F, Lt), Ur()) {
            var Vr = At;
            oc(F, Vr);
          }
          return lt;
        }
        if (Lt === null) {
          for (; At < H.length; At++) {
            var di = L(F, H[At], re);
            di !== null && (Zn = d(di, Zn, At), Xt === null ? lt = di : Xt.sibling = di, Xt = di);
          }
          if (Ur()) {
            var Ca = At;
            oc(F, Ca);
          }
          return lt;
        }
        for (var ba = l(F, Lt); At < H.length; At++) {
          var oa = V(ba, F, At, H[At], re);
          oa !== null && (e && oa.alternate !== null && ba.delete(oa.key === null ? At : oa.key), Zn = d(oa, Zn, At), Xt === null ? lt = oa : Xt.sibling = oa, Xt = oa);
        }
        if (e && ba.forEach(function(xd) {
          return t(F, xd);
        }), Ur()) {
          var Yo = At;
          oc(F, Yo);
        }
        return lt;
      }
      function ge(F, G, H, re) {
        var _e = fa(H);
        if (typeof _e != "function")
          throw new Error("An object is not an iterable. This error is likely caused by a bug in React. Please file an issue.");
        {
          typeof Symbol == "function" && // $FlowFixMe Flow doesn't know about toStringTag
          H[Symbol.toStringTag] === "Generator" && (xS || S("Using Generators as children is unsupported and will likely yield unexpected results because enumerating a generator mutates it. You may convert it to an array with `Array.from()` or the `[...spread]` operator before rendering. Keep in mind you might need to polyfill these features for older browsers."), xS = !0), H.entries === _e && (bS || S("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), bS = !0);
          var Ce = _e.call(H);
          if (Ce)
            for (var et = null, lt = Ce.next(); !lt.done; lt = Ce.next()) {
              var Xt = lt.value;
              et = I(Xt, et, F);
            }
        }
        var Lt = _e.call(H);
        if (Lt == null)
          throw new Error("An iterable object provided no iterator.");
        for (var Zn = null, At = null, Pn = G, la = 0, Vr = 0, di = null, Ca = Lt.next(); Pn !== null && !Ca.done; Vr++, Ca = Lt.next()) {
          Pn.index > Vr ? (di = Pn, Pn = null) : di = Pn.sibling;
          var ba = M(F, Pn, Ca.value, re);
          if (ba === null) {
            Pn === null && (Pn = di);
            break;
          }
          e && Pn && ba.alternate === null && t(F, Pn), la = d(ba, la, Vr), At === null ? Zn = ba : At.sibling = ba, At = ba, Pn = di;
        }
        if (Ca.done) {
          if (a(F, Pn), Ur()) {
            var oa = Vr;
            oc(F, oa);
          }
          return Zn;
        }
        if (Pn === null) {
          for (; !Ca.done; Vr++, Ca = Lt.next()) {
            var Yo = L(F, Ca.value, re);
            Yo !== null && (la = d(Yo, la, Vr), At === null ? Zn = Yo : At.sibling = Yo, At = Yo);
          }
          if (Ur()) {
            var xd = Vr;
            oc(F, xd);
          }
          return Zn;
        }
        for (var Zh = l(F, Pn); !Ca.done; Vr++, Ca = Lt.next()) {
          var Wl = V(Zh, F, Vr, Ca.value, re);
          Wl !== null && (e && Wl.alternate !== null && Zh.delete(Wl.key === null ? Vr : Wl.key), la = d(Wl, la, Vr), At === null ? Zn = Wl : At.sibling = Wl, At = Wl);
        }
        if (e && Zh.forEach(function(rL) {
          return t(F, rL);
        }), Ur()) {
          var nL = Vr;
          oc(F, nL);
        }
        return Zn;
      }
      function We(F, G, H, re) {
        if (G !== null && G.tag === oe) {
          a(F, G.sibling);
          var _e = s(G, H);
          return _e.return = F, _e;
        }
        a(F, G);
        var Ce = CE(H, F.mode, re);
        return Ce.return = F, Ce;
      }
      function He(F, G, H, re) {
        for (var _e = H.key, Ce = G; Ce !== null; ) {
          if (Ce.key === _e) {
            var et = H.type;
            if (et === ni) {
              if (Ce.tag === we) {
                a(F, Ce.sibling);
                var lt = s(Ce, H.props.children);
                return lt.return = F, lt._debugSource = H._source, lt._debugOwner = H._owner, lt;
              }
            } else if (Ce.elementType === et || // Keep this check inline so it only runs on the false path:
            zx(Ce, H) || // Lazy types should reconcile their resolved type.
            // We need to do this after the Hot Reloading check above,
            // because hot reloading has different semantics than prod because
            // it doesn't resuspend. So we can't let the call below suspend.
            typeof et == "object" && et !== null && et.$$typeof === Ze && OC(et) === Ce.type) {
              a(F, Ce.sibling);
              var Xt = s(Ce, H.props);
              return Xt.ref = Eh(F, Ce, H), Xt.return = F, Xt._debugSource = H._source, Xt._debugOwner = H._owner, Xt;
            }
            a(F, Ce);
            break;
          } else
            t(F, Ce);
          Ce = Ce.sibling;
        }
        if (H.type === ni) {
          var Lt = is(H.props.children, F.mode, re, H.key);
          return Lt.return = F, Lt;
        } else {
          var Zn = wE(H, F.mode, re);
          return Zn.ref = Eh(F, G, H), Zn.return = F, Zn;
        }
      }
      function Dt(F, G, H, re) {
        for (var _e = H.key, Ce = G; Ce !== null; ) {
          if (Ce.key === _e)
            if (Ce.tag === X && Ce.stateNode.containerInfo === H.containerInfo && Ce.stateNode.implementation === H.implementation) {
              a(F, Ce.sibling);
              var et = s(Ce, H.children || []);
              return et.return = F, et;
            } else {
              a(F, Ce);
              break;
            }
          else
            t(F, Ce);
          Ce = Ce.sibling;
        }
        var lt = bE(H, F.mode, re);
        return lt.return = F, lt;
      }
      function bt(F, G, H, re) {
        var _e = typeof H == "object" && H !== null && H.type === ni && H.key === null;
        if (_e && (H = H.props.children), typeof H == "object" && H !== null) {
          switch (H.$$typeof) {
            case Hi:
              return v(He(F, G, H, re));
            case ca:
              return v(Dt(F, G, H, re));
            case Ze:
              var Ce = H._payload, et = H._init;
              return bt(F, G, et(Ce), re);
          }
          if (ar(H))
            return $(F, G, H, re);
          if (fa(H))
            return ge(F, G, H, re);
          xy(F, H);
        }
        return typeof H == "string" && H !== "" || typeof H == "number" ? v(We(F, G, "" + H, re)) : (typeof H == "function" && Ty(F), a(F, G));
      }
      return bt;
    }
    var ld = MC(!0), NC = MC(!1);
    function Nk(e, t) {
      if (e !== null && t.child !== e.child)
        throw new Error("Resuming work not yet implemented.");
      if (t.child !== null) {
        var a = t.child, l = Ec(a, a.pendingProps);
        for (t.child = l, l.return = t; a.sibling !== null; )
          a = a.sibling, l = l.sibling = Ec(a, a.pendingProps), l.return = t;
        l.sibling = null;
      }
    }
    function Lk(e, t) {
      for (var a = e.child; a !== null; )
        EN(a, t), a = a.sibling;
    }
    var DS = Wu(null), kS;
    kS = {};
    var _y = null, od = null, OS = null, Ry = !1;
    function Dy() {
      _y = null, od = null, OS = null, Ry = !1;
    }
    function LC() {
      Ry = !0;
    }
    function AC() {
      Ry = !1;
    }
    function UC(e, t, a) {
      aa(DS, t._currentValue, e), t._currentValue = a, t._currentRenderer !== void 0 && t._currentRenderer !== null && t._currentRenderer !== kS && S("Detected multiple renderers concurrently rendering the same context provider. This is currently unsupported."), t._currentRenderer = kS;
    }
    function MS(e, t) {
      var a = DS.current;
      ra(DS, t), e._currentValue = a;
    }
    function NS(e, t, a) {
      for (var l = e; l !== null; ) {
        var s = l.alternate;
        if (wo(l.childLanes, t) ? s !== null && !wo(s.childLanes, t) && (s.childLanes = ct(s.childLanes, t)) : (l.childLanes = ct(l.childLanes, t), s !== null && (s.childLanes = ct(s.childLanes, t))), l === a)
          break;
        l = l.return;
      }
      l !== a && S("Expected to find the propagation root when scheduling context work. This error is likely caused by a bug in React. Please file an issue.");
    }
    function Ak(e, t, a) {
      Uk(e, t, a);
    }
    function Uk(e, t, a) {
      var l = e.child;
      for (l !== null && (l.return = e); l !== null; ) {
        var s = void 0, d = l.dependencies;
        if (d !== null) {
          s = l.child;
          for (var v = d.firstContext; v !== null; ) {
            if (v.context === t) {
              if (l.tag === A) {
                var g = _u(a), E = Ao(nn, g);
                E.tag = Oy;
                var b = l.updateQueue;
                if (b !== null) {
                  var x = b.shared, L = x.pending;
                  L === null ? E.next = E : (E.next = L.next, L.next = E), x.pending = E;
                }
              }
              l.lanes = ct(l.lanes, a);
              var M = l.alternate;
              M !== null && (M.lanes = ct(M.lanes, a)), NS(l.return, a, e), d.lanes = ct(d.lanes, a);
              break;
            }
            v = v.next;
          }
        } else if (l.tag === ve)
          s = l.type === e.type ? null : l.child;
        else if (l.tag === Je) {
          var V = l.return;
          if (V === null)
            throw new Error("We just came from a parent so we must have had a parent. This is a bug in React.");
          V.lanes = ct(V.lanes, a);
          var I = V.alternate;
          I !== null && (I.lanes = ct(I.lanes, a)), NS(V, a, e), s = l.sibling;
        } else
          s = l.child;
        if (s !== null)
          s.return = l;
        else
          for (s = l; s !== null; ) {
            if (s === e) {
              s = null;
              break;
            }
            var $ = s.sibling;
            if ($ !== null) {
              $.return = s.return, s = $;
              break;
            }
            s = s.return;
          }
        l = s;
      }
    }
    function ud(e, t) {
      _y = e, od = null, OS = null;
      var a = e.dependencies;
      if (a !== null) {
        var l = a.firstContext;
        l !== null && (ta(a.lanes, t) && Uh(), a.firstContext = null);
      }
    }
    function cr(e) {
      Ry && S("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
      var t = e._currentValue;
      if (OS !== e) {
        var a = {
          context: e,
          memoizedValue: t,
          next: null
        };
        if (od === null) {
          if (_y === null)
            throw new Error("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
          od = a, _y.dependencies = {
            lanes: K,
            firstContext: a
          };
        } else
          od = od.next = a;
      }
      return t;
    }
    var dc = null;
    function LS(e) {
      dc === null ? dc = [e] : dc.push(e);
    }
    function zk() {
      if (dc !== null) {
        for (var e = 0; e < dc.length; e++) {
          var t = dc[e], a = t.interleaved;
          if (a !== null) {
            t.interleaved = null;
            var l = a.next, s = t.pending;
            if (s !== null) {
              var d = s.next;
              s.next = l, a.next = d;
            }
            t.pending = a;
          }
        }
        dc = null;
      }
    }
    function zC(e, t, a, l) {
      var s = t.interleaved;
      return s === null ? (a.next = a, LS(t)) : (a.next = s.next, s.next = a), t.interleaved = a, ky(e, l);
    }
    function jk(e, t, a, l) {
      var s = t.interleaved;
      s === null ? (a.next = a, LS(t)) : (a.next = s.next, s.next = a), t.interleaved = a;
    }
    function Fk(e, t, a, l) {
      var s = t.interleaved;
      return s === null ? (a.next = a, LS(t)) : (a.next = s.next, s.next = a), t.interleaved = a, ky(e, l);
    }
    function Ba(e, t) {
      return ky(e, t);
    }
    var Hk = ky;
    function ky(e, t) {
      e.lanes = ct(e.lanes, t);
      var a = e.alternate;
      a !== null && (a.lanes = ct(a.lanes, t)), a === null && (e.flags & (on | Ma)) !== Be && Nx(e);
      for (var l = e, s = e.return; s !== null; )
        s.childLanes = ct(s.childLanes, t), a = s.alternate, a !== null ? a.childLanes = ct(a.childLanes, t) : (s.flags & (on | Ma)) !== Be && Nx(e), l = s, s = s.return;
      if (l.tag === W) {
        var d = l.stateNode;
        return d;
      } else
        return null;
    }
    var jC = 0, FC = 1, Oy = 2, AS = 3, My = !1, US, Ny;
    US = !1, Ny = null;
    function zS(e) {
      var t = {
        baseState: e.memoizedState,
        firstBaseUpdate: null,
        lastBaseUpdate: null,
        shared: {
          pending: null,
          interleaved: null,
          lanes: K
        },
        effects: null
      };
      e.updateQueue = t;
    }
    function HC(e, t) {
      var a = t.updateQueue, l = e.updateQueue;
      if (a === l) {
        var s = {
          baseState: l.baseState,
          firstBaseUpdate: l.firstBaseUpdate,
          lastBaseUpdate: l.lastBaseUpdate,
          shared: l.shared,
          effects: l.effects
        };
        t.updateQueue = s;
      }
    }
    function Ao(e, t) {
      var a = {
        eventTime: e,
        lane: t,
        tag: jC,
        payload: null,
        callback: null,
        next: null
      };
      return a;
    }
    function qu(e, t, a) {
      var l = e.updateQueue;
      if (l === null)
        return null;
      var s = l.shared;
      if (Ny === s && !US && (S("An update (setState, replaceState, or forceUpdate) was scheduled from inside an update function. Update functions should be pure, with zero side-effects. Consider using componentDidUpdate or a callback."), US = !0), jM()) {
        var d = s.pending;
        return d === null ? t.next = t : (t.next = d.next, d.next = t), s.pending = t, Hk(e, a);
      } else
        return Fk(e, s, t, a);
    }
    function Ly(e, t, a) {
      var l = t.updateQueue;
      if (l !== null) {
        var s = l.shared;
        if (Up(a)) {
          var d = s.lanes;
          d = Tf(d, e.pendingLanes);
          var v = ct(d, a);
          s.lanes = v, zp(e, v);
        }
      }
    }
    function jS(e, t) {
      var a = e.updateQueue, l = e.alternate;
      if (l !== null) {
        var s = l.updateQueue;
        if (a === s) {
          var d = null, v = null, g = a.firstBaseUpdate;
          if (g !== null) {
            var E = g;
            do {
              var b = {
                eventTime: E.eventTime,
                lane: E.lane,
                tag: E.tag,
                payload: E.payload,
                callback: E.callback,
                next: null
              };
              v === null ? d = v = b : (v.next = b, v = b), E = E.next;
            } while (E !== null);
            v === null ? d = v = t : (v.next = t, v = t);
          } else
            d = v = t;
          a = {
            baseState: s.baseState,
            firstBaseUpdate: d,
            lastBaseUpdate: v,
            shared: s.shared,
            effects: s.effects
          }, e.updateQueue = a;
          return;
        }
      }
      var x = a.lastBaseUpdate;
      x === null ? a.firstBaseUpdate = t : x.next = t, a.lastBaseUpdate = t;
    }
    function Yk(e, t, a, l, s, d) {
      switch (a.tag) {
        case FC: {
          var v = a.payload;
          if (typeof v == "function") {
            LC();
            var g = v.call(d, l, s);
            {
              if (e.mode & Et) {
                Hn(!0);
                try {
                  v.call(d, l, s);
                } finally {
                  Hn(!1);
                }
              }
              AC();
            }
            return g;
          }
          return v;
        }
        case AS:
          e.flags = e.flags & ~lr | nt;
        case jC: {
          var E = a.payload, b;
          if (typeof E == "function") {
            LC(), b = E.call(d, l, s);
            {
              if (e.mode & Et) {
                Hn(!0);
                try {
                  E.call(d, l, s);
                } finally {
                  Hn(!1);
                }
              }
              AC();
            }
          } else
            b = E;
          return b == null ? l : St({}, l, b);
        }
        case Oy:
          return My = !0, l;
      }
      return l;
    }
    function Ay(e, t, a, l) {
      var s = e.updateQueue;
      My = !1, Ny = s.shared;
      var d = s.firstBaseUpdate, v = s.lastBaseUpdate, g = s.shared.pending;
      if (g !== null) {
        s.shared.pending = null;
        var E = g, b = E.next;
        E.next = null, v === null ? d = b : v.next = b, v = E;
        var x = e.alternate;
        if (x !== null) {
          var L = x.updateQueue, M = L.lastBaseUpdate;
          M !== v && (M === null ? L.firstBaseUpdate = b : M.next = b, L.lastBaseUpdate = E);
        }
      }
      if (d !== null) {
        var V = s.baseState, I = K, $ = null, ge = null, We = null, He = d;
        do {
          var Dt = He.lane, bt = He.eventTime;
          if (wo(l, Dt)) {
            if (We !== null) {
              var G = {
                eventTime: bt,
                // This update is going to be committed so we never want uncommit
                // it. Using NoLane works because 0 is a subset of all bitmasks, so
                // this will never be skipped by the check above.
                lane: Yn,
                tag: He.tag,
                payload: He.payload,
                callback: He.callback,
                next: null
              };
              We = We.next = G;
            }
            V = Yk(e, s, He, V, t, a);
            var H = He.callback;
            if (H !== null && // If the update was already committed, we should not queue its
            // callback again.
            He.lane !== Yn) {
              e.flags |= Ei;
              var re = s.effects;
              re === null ? s.effects = [He] : re.push(He);
            }
          } else {
            var F = {
              eventTime: bt,
              lane: Dt,
              tag: He.tag,
              payload: He.payload,
              callback: He.callback,
              next: null
            };
            We === null ? (ge = We = F, $ = V) : We = We.next = F, I = ct(I, Dt);
          }
          if (He = He.next, He === null) {
            if (g = s.shared.pending, g === null)
              break;
            var _e = g, Ce = _e.next;
            _e.next = null, He = Ce, s.lastBaseUpdate = _e, s.shared.pending = null;
          }
        } while (!0);
        We === null && ($ = V), s.baseState = $, s.firstBaseUpdate = ge, s.lastBaseUpdate = We;
        var et = s.shared.interleaved;
        if (et !== null) {
          var lt = et;
          do
            I = ct(I, lt.lane), lt = lt.next;
          while (lt !== et);
        } else d === null && (s.shared.lanes = K);
        Gh(I), e.lanes = I, e.memoizedState = V;
      }
      Ny = null;
    }
    function Pk(e, t) {
      if (typeof e != "function")
        throw new Error("Invalid argument passed as callback. Expected a function. Instead " + ("received: " + e));
      e.call(t);
    }
    function YC() {
      My = !1;
    }
    function Uy() {
      return My;
    }
    function PC(e, t, a) {
      var l = t.effects;
      if (t.effects = null, l !== null)
        for (var s = 0; s < l.length; s++) {
          var d = l[s], v = d.callback;
          v !== null && (d.callback = null, Pk(v, a));
        }
    }
    var wh = {}, Xu = Wu(wh), Ch = Wu(wh), zy = Wu(wh);
    function jy(e) {
      if (e === wh)
        throw new Error("Expected host context to exist. This error is likely caused by a bug in React. Please file an issue.");
      return e;
    }
    function VC() {
      var e = jy(zy.current);
      return e;
    }
    function FS(e, t) {
      aa(zy, t, e), aa(Ch, e, e), aa(Xu, wh, e);
      var a = aD(t);
      ra(Xu, e), aa(Xu, a, e);
    }
    function sd(e) {
      ra(Xu, e), ra(Ch, e), ra(zy, e);
    }
    function HS() {
      var e = jy(Xu.current);
      return e;
    }
    function BC(e) {
      jy(zy.current);
      var t = jy(Xu.current), a = iD(t, e.type);
      t !== a && (aa(Ch, e, e), aa(Xu, a, e));
    }
    function YS(e) {
      Ch.current === e && (ra(Xu, e), ra(Ch, e));
    }
    var Vk = 0, IC = 1, WC = 1, bh = 2, al = Wu(Vk);
    function PS(e, t) {
      return (e & t) !== 0;
    }
    function cd(e) {
      return e & IC;
    }
    function VS(e, t) {
      return e & IC | t;
    }
    function Bk(e, t) {
      return e | t;
    }
    function Ku(e, t) {
      aa(al, t, e);
    }
    function fd(e) {
      ra(al, e);
    }
    function Ik(e, t) {
      var a = e.memoizedState;
      return a !== null ? a.dehydrated !== null : (e.memoizedProps, !0);
    }
    function Fy(e) {
      for (var t = e; t !== null; ) {
        if (t.tag === be) {
          var a = t.memoizedState;
          if (a !== null) {
            var l = a.dehydrated;
            if (l === null || uC(l) || lS(l))
              return t;
          }
        } else if (t.tag === Ke && // revealOrder undefined can't be trusted because it don't
        // keep track of whether it suspended or not.
        t.memoizedProps.revealOrder !== void 0) {
          var s = (t.flags & nt) !== Be;
          if (s)
            return t;
        } else if (t.child !== null) {
          t.child.return = t, t = t.child;
          continue;
        }
        if (t === e)
          return null;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e)
            return null;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
      return null;
    }
    var Ia = (
      /*   */
      0
    ), vr = (
      /* */
      1
    ), Fl = (
      /*  */
      2
    ), mr = (
      /*    */
      4
    ), zr = (
      /*   */
      8
    ), BS = [];
    function IS() {
      for (var e = 0; e < BS.length; e++) {
        var t = BS[e];
        t._workInProgressVersionPrimary = null;
      }
      BS.length = 0;
    }
    function Wk(e, t) {
      var a = t._getVersion, l = a(t._source);
      e.mutableSourceEagerHydrationData == null ? e.mutableSourceEagerHydrationData = [t, l] : e.mutableSourceEagerHydrationData.push(t, l);
    }
    var Te = c.ReactCurrentDispatcher, xh = c.ReactCurrentBatchConfig, WS, dd;
    WS = /* @__PURE__ */ new Set();
    var pc = K, qt = null, yr = null, gr = null, Hy = !1, Th = !1, _h = 0, $k = 0, Gk = 25, q = null, ki = null, Zu = -1, $S = !1;
    function Yt() {
      {
        var e = q;
        ki === null ? ki = [e] : ki.push(e);
      }
    }
    function he() {
      {
        var e = q;
        ki !== null && (Zu++, ki[Zu] !== e && Qk(e));
      }
    }
    function pd(e) {
      e != null && !ar(e) && S("%s received a final argument that is not an array (instead, received `%s`). When specified, the final argument must be an array.", q, typeof e);
    }
    function Qk(e) {
      {
        var t = st(qt);
        if (!WS.has(t) && (WS.add(t), ki !== null)) {
          for (var a = "", l = 30, s = 0; s <= Zu; s++) {
            for (var d = ki[s], v = s === Zu ? e : d, g = s + 1 + ". " + d; g.length < l; )
              g += " ";
            g += v + `
`, a += g;
          }
          S(`React has detected a change in the order of Hooks called by %s. This will lead to bugs and errors if not fixed. For more information, read the Rules of Hooks: https://reactjs.org/link/rules-of-hooks

   Previous render            Next render
   ------------------------------------------------------
%s   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
`, t, a);
        }
      }
    }
    function ia() {
      throw new Error(`Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.`);
    }
    function GS(e, t) {
      if ($S)
        return !1;
      if (t === null)
        return S("%s received a final argument during this render, but not during the previous render. Even though the final argument is optional, its type cannot change between renders.", q), !1;
      e.length !== t.length && S(`The final argument passed to %s changed size between renders. The order and size of this array must remain constant.

Previous: %s
Incoming: %s`, q, "[" + t.join(", ") + "]", "[" + e.join(", ") + "]");
      for (var a = 0; a < t.length && a < e.length; a++)
        if (!Le(e[a], t[a]))
          return !1;
      return !0;
    }
    function hd(e, t, a, l, s, d) {
      pc = d, qt = t, ki = e !== null ? e._debugHookTypes : null, Zu = -1, $S = e !== null && e.type !== t.type, t.memoizedState = null, t.updateQueue = null, t.lanes = K, e !== null && e.memoizedState !== null ? Te.current = pb : ki !== null ? Te.current = db : Te.current = fb;
      var v = a(l, s);
      if (Th) {
        var g = 0;
        do {
          if (Th = !1, _h = 0, g >= Gk)
            throw new Error("Too many re-renders. React limits the number of renders to prevent an infinite loop.");
          g += 1, $S = !1, yr = null, gr = null, t.updateQueue = null, Zu = -1, Te.current = hb, v = a(l, s);
        } while (Th);
      }
      Te.current = Zy, t._debugHookTypes = ki;
      var E = yr !== null && yr.next !== null;
      if (pc = K, qt = null, yr = null, gr = null, q = null, ki = null, Zu = -1, e !== null && (e.flags & dr) !== (t.flags & dr) && // Disable this warning in legacy mode, because legacy Suspense is weird
      // and creates false positives. To make this work in legacy mode, we'd
      // need to mark fibers that commit in an incomplete state, somehow. For
      // now I'll disable the warning that most of the bugs that would trigger
      // it are either exclusive to concurrent mode or exist in both.
      (e.mode & Fe) !== ze && S("Internal React error: Expected static flag was missing. Please notify the React team."), Hy = !1, E)
        throw new Error("Rendered fewer hooks than expected. This may be caused by an accidental early return statement.");
      return v;
    }
    function vd() {
      var e = _h !== 0;
      return _h = 0, e;
    }
    function $C(e, t, a) {
      t.updateQueue = e.updateQueue, (t.mode & ya) !== ze ? t.flags &= ~(fo | qr | pn | dt) : t.flags &= ~(pn | dt), e.lanes = Is(e.lanes, a);
    }
    function GC() {
      if (Te.current = Zy, Hy) {
        for (var e = qt.memoizedState; e !== null; ) {
          var t = e.queue;
          t !== null && (t.pending = null), e = e.next;
        }
        Hy = !1;
      }
      pc = K, qt = null, yr = null, gr = null, ki = null, Zu = -1, q = null, lb = !1, Th = !1, _h = 0;
    }
    function Hl() {
      var e = {
        memoizedState: null,
        baseState: null,
        baseQueue: null,
        queue: null,
        next: null
      };
      return gr === null ? qt.memoizedState = gr = e : gr = gr.next = e, gr;
    }
    function Oi() {
      var e;
      if (yr === null) {
        var t = qt.alternate;
        t !== null ? e = t.memoizedState : e = null;
      } else
        e = yr.next;
      var a;
      if (gr === null ? a = qt.memoizedState : a = gr.next, a !== null)
        gr = a, a = gr.next, yr = e;
      else {
        if (e === null)
          throw new Error("Rendered more hooks than during the previous render.");
        yr = e;
        var l = {
          memoizedState: yr.memoizedState,
          baseState: yr.baseState,
          baseQueue: yr.baseQueue,
          queue: yr.queue,
          next: null
        };
        gr === null ? qt.memoizedState = gr = l : gr = gr.next = l;
      }
      return gr;
    }
    function QC() {
      return {
        lastEffect: null,
        stores: null
      };
    }
    function QS(e, t) {
      return typeof t == "function" ? t(e) : t;
    }
    function qS(e, t, a) {
      var l = Hl(), s;
      a !== void 0 ? s = a(t) : s = t, l.memoizedState = l.baseState = s;
      var d = {
        pending: null,
        interleaved: null,
        lanes: K,
        dispatch: null,
        lastRenderedReducer: e,
        lastRenderedState: s
      };
      l.queue = d;
      var v = d.dispatch = Zk.bind(null, qt, d);
      return [l.memoizedState, v];
    }
    function XS(e, t, a) {
      var l = Oi(), s = l.queue;
      if (s === null)
        throw new Error("Should have a queue. This is likely a bug in React. Please file an issue.");
      s.lastRenderedReducer = e;
      var d = yr, v = d.baseQueue, g = s.pending;
      if (g !== null) {
        if (v !== null) {
          var E = v.next, b = g.next;
          v.next = b, g.next = E;
        }
        d.baseQueue !== v && S("Internal error: Expected work-in-progress queue to be a clone. This is a bug in React."), d.baseQueue = v = g, s.pending = null;
      }
      if (v !== null) {
        var x = v.next, L = d.baseState, M = null, V = null, I = null, $ = x;
        do {
          var ge = $.lane;
          if (wo(pc, ge)) {
            if (I !== null) {
              var He = {
                // This update is going to be committed so we never want uncommit
                // it. Using NoLane works because 0 is a subset of all bitmasks, so
                // this will never be skipped by the check above.
                lane: Yn,
                action: $.action,
                hasEagerState: $.hasEagerState,
                eagerState: $.eagerState,
                next: null
              };
              I = I.next = He;
            }
            if ($.hasEagerState)
              L = $.eagerState;
            else {
              var Dt = $.action;
              L = e(L, Dt);
            }
          } else {
            var We = {
              lane: ge,
              action: $.action,
              hasEagerState: $.hasEagerState,
              eagerState: $.eagerState,
              next: null
            };
            I === null ? (V = I = We, M = L) : I = I.next = We, qt.lanes = ct(qt.lanes, ge), Gh(ge);
          }
          $ = $.next;
        } while ($ !== null && $ !== x);
        I === null ? M = L : I.next = V, Le(L, l.memoizedState) || Uh(), l.memoizedState = L, l.baseState = M, l.baseQueue = I, s.lastRenderedState = L;
      }
      var bt = s.interleaved;
      if (bt !== null) {
        var F = bt;
        do {
          var G = F.lane;
          qt.lanes = ct(qt.lanes, G), Gh(G), F = F.next;
        } while (F !== bt);
      } else v === null && (s.lanes = K);
      var H = s.dispatch;
      return [l.memoizedState, H];
    }
    function KS(e, t, a) {
      var l = Oi(), s = l.queue;
      if (s === null)
        throw new Error("Should have a queue. This is likely a bug in React. Please file an issue.");
      s.lastRenderedReducer = e;
      var d = s.dispatch, v = s.pending, g = l.memoizedState;
      if (v !== null) {
        s.pending = null;
        var E = v.next, b = E;
        do {
          var x = b.action;
          g = e(g, x), b = b.next;
        } while (b !== E);
        Le(g, l.memoizedState) || Uh(), l.memoizedState = g, l.baseQueue === null && (l.baseState = g), s.lastRenderedState = g;
      }
      return [g, d];
    }
    function OF(e, t, a) {
    }
    function MF(e, t, a) {
    }
    function ZS(e, t, a) {
      var l = qt, s = Hl(), d, v = Ur();
      if (v) {
        if (a === void 0)
          throw new Error("Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering.");
        d = a(), dd || d !== a() && (S("The result of getServerSnapshot should be cached to avoid an infinite loop"), dd = !0);
      } else {
        if (d = t(), !dd) {
          var g = t();
          Le(d, g) || (S("The result of getSnapshot should be cached to avoid an infinite loop"), dd = !0);
        }
        var E = yg();
        if (E === null)
          throw new Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
        Bs(E, pc) || qC(l, t, d);
      }
      s.memoizedState = d;
      var b = {
        value: d,
        getSnapshot: t
      };
      return s.queue = b, Iy(KC.bind(null, l, b, e), [e]), l.flags |= pn, Rh(vr | zr, XC.bind(null, l, b, d, t), void 0, null), d;
    }
    function Yy(e, t, a) {
      var l = qt, s = Oi(), d = t();
      if (!dd) {
        var v = t();
        Le(d, v) || (S("The result of getSnapshot should be cached to avoid an infinite loop"), dd = !0);
      }
      var g = s.memoizedState, E = !Le(g, d);
      E && (s.memoizedState = d, Uh());
      var b = s.queue;
      if (kh(KC.bind(null, l, b, e), [e]), b.getSnapshot !== t || E || // Check if the susbcribe function changed. We can save some memory by
      // checking whether we scheduled a subscription effect above.
      gr !== null && gr.memoizedState.tag & vr) {
        l.flags |= pn, Rh(vr | zr, XC.bind(null, l, b, d, t), void 0, null);
        var x = yg();
        if (x === null)
          throw new Error("Expected a work-in-progress root. This is a bug in React. Please file an issue.");
        Bs(x, pc) || qC(l, t, d);
      }
      return d;
    }
    function qC(e, t, a) {
      e.flags |= Ls;
      var l = {
        getSnapshot: t,
        value: a
      }, s = qt.updateQueue;
      if (s === null)
        s = QC(), qt.updateQueue = s, s.stores = [l];
      else {
        var d = s.stores;
        d === null ? s.stores = [l] : d.push(l);
      }
    }
    function XC(e, t, a, l) {
      t.value = a, t.getSnapshot = l, ZC(t) && JC(e);
    }
    function KC(e, t, a) {
      var l = function() {
        ZC(t) && JC(e);
      };
      return a(l);
    }
    function ZC(e) {
      var t = e.getSnapshot, a = e.value;
      try {
        var l = t();
        return !Le(a, l);
      } catch {
        return !0;
      }
    }
    function JC(e) {
      var t = Ba(e, Ve);
      t !== null && Cr(t, e, Ve, nn);
    }
    function Py(e) {
      var t = Hl();
      typeof e == "function" && (e = e()), t.memoizedState = t.baseState = e;
      var a = {
        pending: null,
        interleaved: null,
        lanes: K,
        dispatch: null,
        lastRenderedReducer: QS,
        lastRenderedState: e
      };
      t.queue = a;
      var l = a.dispatch = Jk.bind(null, qt, a);
      return [t.memoizedState, l];
    }
    function JS(e) {
      return XS(QS);
    }
    function e1(e) {
      return KS(QS);
    }
    function Rh(e, t, a, l) {
      var s = {
        tag: e,
        create: t,
        destroy: a,
        deps: l,
        // Circular
        next: null
      }, d = qt.updateQueue;
      if (d === null)
        d = QC(), qt.updateQueue = d, d.lastEffect = s.next = s;
      else {
        var v = d.lastEffect;
        if (v === null)
          d.lastEffect = s.next = s;
        else {
          var g = v.next;
          v.next = s, s.next = g, d.lastEffect = s;
        }
      }
      return s;
    }
    function t1(e) {
      var t = Hl();
      {
        var a = {
          current: e
        };
        return t.memoizedState = a, a;
      }
    }
    function Vy(e) {
      var t = Oi();
      return t.memoizedState;
    }
    function Dh(e, t, a, l) {
      var s = Hl(), d = l === void 0 ? null : l;
      qt.flags |= e, s.memoizedState = Rh(vr | t, a, void 0, d);
    }
    function By(e, t, a, l) {
      var s = Oi(), d = l === void 0 ? null : l, v = void 0;
      if (yr !== null) {
        var g = yr.memoizedState;
        if (v = g.destroy, d !== null) {
          var E = g.deps;
          if (GS(d, E)) {
            s.memoizedState = Rh(t, a, v, d);
            return;
          }
        }
      }
      qt.flags |= e, s.memoizedState = Rh(vr | t, a, v, d);
    }
    function Iy(e, t) {
      return (qt.mode & ya) !== ze ? Dh(fo | pn | _l, zr, e, t) : Dh(pn | _l, zr, e, t);
    }
    function kh(e, t) {
      return By(pn, zr, e, t);
    }
    function n1(e, t) {
      return Dh(dt, Fl, e, t);
    }
    function Wy(e, t) {
      return By(dt, Fl, e, t);
    }
    function r1(e, t) {
      var a = dt;
      return a |= Qr, (qt.mode & ya) !== ze && (a |= qr), Dh(a, mr, e, t);
    }
    function $y(e, t) {
      return By(dt, mr, e, t);
    }
    function eb(e, t) {
      if (typeof t == "function") {
        var a = t, l = e();
        return a(l), function() {
          a(null);
        };
      } else if (t != null) {
        var s = t;
        s.hasOwnProperty("current") || S("Expected useImperativeHandle() first argument to either be a ref callback or React.createRef() object. Instead received: %s.", "an object with keys {" + Object.keys(s).join(", ") + "}");
        var d = e();
        return s.current = d, function() {
          s.current = null;
        };
      }
    }
    function a1(e, t, a) {
      typeof t != "function" && S("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", t !== null ? typeof t : "null");
      var l = a != null ? a.concat([e]) : null, s = dt;
      return s |= Qr, (qt.mode & ya) !== ze && (s |= qr), Dh(s, mr, eb.bind(null, t, e), l);
    }
    function Gy(e, t, a) {
      typeof t != "function" && S("Expected useImperativeHandle() second argument to be a function that creates a handle. Instead received: %s.", t !== null ? typeof t : "null");
      var l = a != null ? a.concat([e]) : null;
      return By(dt, mr, eb.bind(null, t, e), l);
    }
    function qk(e, t) {
    }
    var Qy = qk;
    function i1(e, t) {
      var a = Hl(), l = t === void 0 ? null : t;
      return a.memoizedState = [e, l], e;
    }
    function qy(e, t) {
      var a = Oi(), l = t === void 0 ? null : t, s = a.memoizedState;
      if (s !== null && l !== null) {
        var d = s[1];
        if (GS(l, d))
          return s[0];
      }
      return a.memoizedState = [e, l], e;
    }
    function l1(e, t) {
      var a = Hl(), l = t === void 0 ? null : t, s = e();
      return a.memoizedState = [s, l], s;
    }
    function Xy(e, t) {
      var a = Oi(), l = t === void 0 ? null : t, s = a.memoizedState;
      if (s !== null && l !== null) {
        var d = s[1];
        if (GS(l, d))
          return s[0];
      }
      var v = e();
      return a.memoizedState = [v, l], v;
    }
    function o1(e) {
      var t = Hl();
      return t.memoizedState = e, e;
    }
    function tb(e) {
      var t = Oi(), a = yr, l = a.memoizedState;
      return rb(t, l, e);
    }
    function nb(e) {
      var t = Oi();
      if (yr === null)
        return t.memoizedState = e, e;
      var a = yr.memoizedState;
      return rb(t, a, e);
    }
    function rb(e, t, a) {
      var l = !_m(pc);
      if (l) {
        if (!Le(a, t)) {
          var s = km();
          qt.lanes = ct(qt.lanes, s), Gh(s), e.baseState = !0;
        }
        return t;
      } else
        return e.baseState && (e.baseState = !1, Uh()), e.memoizedState = a, a;
    }
    function Xk(e, t, a) {
      var l = ja();
      _n(R0(l, Ki)), e(!0);
      var s = xh.transition;
      xh.transition = {};
      var d = xh.transition;
      xh.transition._updatedFibers = /* @__PURE__ */ new Set();
      try {
        e(!1), t();
      } finally {
        if (_n(l), xh.transition = s, s === null && d._updatedFibers) {
          var v = d._updatedFibers.size;
          v > 10 && w("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."), d._updatedFibers.clear();
        }
      }
    }
    function u1() {
      var e = Py(!1), t = e[0], a = e[1], l = Xk.bind(null, a), s = Hl();
      return s.memoizedState = l, [t, l];
    }
    function ab() {
      var e = JS(), t = e[0], a = Oi(), l = a.memoizedState;
      return [t, l];
    }
    function ib() {
      var e = e1(), t = e[0], a = Oi(), l = a.memoizedState;
      return [t, l];
    }
    var lb = !1;
    function Kk() {
      return lb;
    }
    function s1() {
      var e = Hl(), t = yg(), a = t.identifierPrefix, l;
      if (Ur()) {
        var s = hk();
        l = ":" + a + "R" + s;
        var d = _h++;
        d > 0 && (l += "H" + d.toString(32)), l += ":";
      } else {
        var v = $k++;
        l = ":" + a + "r" + v.toString(32) + ":";
      }
      return e.memoizedState = l, l;
    }
    function Ky() {
      var e = Oi(), t = e.memoizedState;
      return t;
    }
    function Zk(e, t, a) {
      typeof arguments[3] == "function" && S("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect().");
      var l = rs(e), s = {
        lane: l,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null
      };
      if (ob(e))
        ub(t, s);
      else {
        var d = zC(e, t, s, l);
        if (d !== null) {
          var v = wa();
          Cr(d, e, l, v), sb(d, t, l);
        }
      }
      cb(e, l);
    }
    function Jk(e, t, a) {
      typeof arguments[3] == "function" && S("State updates from the useState() and useReducer() Hooks don't support the second callback argument. To execute a side effect after rendering, declare it in the component body with useEffect().");
      var l = rs(e), s = {
        lane: l,
        action: a,
        hasEagerState: !1,
        eagerState: null,
        next: null
      };
      if (ob(e))
        ub(t, s);
      else {
        var d = e.alternate;
        if (e.lanes === K && (d === null || d.lanes === K)) {
          var v = t.lastRenderedReducer;
          if (v !== null) {
            var g;
            g = Te.current, Te.current = il;
            try {
              var E = t.lastRenderedState, b = v(E, a);
              if (s.hasEagerState = !0, s.eagerState = b, Le(b, E)) {
                jk(e, t, s, l);
                return;
              }
            } catch {
            } finally {
              Te.current = g;
            }
          }
        }
        var x = zC(e, t, s, l);
        if (x !== null) {
          var L = wa();
          Cr(x, e, l, L), sb(x, t, l);
        }
      }
      cb(e, l);
    }
    function ob(e) {
      var t = e.alternate;
      return e === qt || t !== null && t === qt;
    }
    function ub(e, t) {
      Th = Hy = !0;
      var a = e.pending;
      a === null ? t.next = t : (t.next = a.next, a.next = t), e.pending = t;
    }
    function sb(e, t, a) {
      if (Up(a)) {
        var l = t.lanes;
        l = Tf(l, e.pendingLanes);
        var s = ct(l, a);
        t.lanes = s, zp(e, s);
      }
    }
    function cb(e, t, a) {
      js(e, t);
    }
    var Zy = {
      readContext: cr,
      useCallback: ia,
      useContext: ia,
      useEffect: ia,
      useImperativeHandle: ia,
      useInsertionEffect: ia,
      useLayoutEffect: ia,
      useMemo: ia,
      useReducer: ia,
      useRef: ia,
      useState: ia,
      useDebugValue: ia,
      useDeferredValue: ia,
      useTransition: ia,
      useMutableSource: ia,
      useSyncExternalStore: ia,
      useId: ia,
      unstable_isNewReconciler: J
    }, fb = null, db = null, pb = null, hb = null, Yl = null, il = null, Jy = null;
    {
      var c1 = function() {
        S("Context can only be read while React is rendering. In classes, you can read it in the render method or getDerivedStateFromProps. In function components, you can read it directly in the function body, but not inside Hooks like useReducer() or useMemo().");
      }, at = function() {
        S("Do not call Hooks inside useEffect(...), useMemo(...), or other built-in Hooks. You can only call Hooks at the top level of your React function. For more information, see https://reactjs.org/link/rules-of-hooks");
      };
      fb = {
        readContext: function(e) {
          return cr(e);
        },
        useCallback: function(e, t) {
          return q = "useCallback", Yt(), pd(t), i1(e, t);
        },
        useContext: function(e) {
          return q = "useContext", Yt(), cr(e);
        },
        useEffect: function(e, t) {
          return q = "useEffect", Yt(), pd(t), Iy(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return q = "useImperativeHandle", Yt(), pd(a), a1(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return q = "useInsertionEffect", Yt(), pd(t), n1(e, t);
        },
        useLayoutEffect: function(e, t) {
          return q = "useLayoutEffect", Yt(), pd(t), r1(e, t);
        },
        useMemo: function(e, t) {
          q = "useMemo", Yt(), pd(t);
          var a = Te.current;
          Te.current = Yl;
          try {
            return l1(e, t);
          } finally {
            Te.current = a;
          }
        },
        useReducer: function(e, t, a) {
          q = "useReducer", Yt();
          var l = Te.current;
          Te.current = Yl;
          try {
            return qS(e, t, a);
          } finally {
            Te.current = l;
          }
        },
        useRef: function(e) {
          return q = "useRef", Yt(), t1(e);
        },
        useState: function(e) {
          q = "useState", Yt();
          var t = Te.current;
          Te.current = Yl;
          try {
            return Py(e);
          } finally {
            Te.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return q = "useDebugValue", Yt(), void 0;
        },
        useDeferredValue: function(e) {
          return q = "useDeferredValue", Yt(), o1(e);
        },
        useTransition: function() {
          return q = "useTransition", Yt(), u1();
        },
        useMutableSource: function(e, t, a) {
          return q = "useMutableSource", Yt(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return q = "useSyncExternalStore", Yt(), ZS(e, t, a);
        },
        useId: function() {
          return q = "useId", Yt(), s1();
        },
        unstable_isNewReconciler: J
      }, db = {
        readContext: function(e) {
          return cr(e);
        },
        useCallback: function(e, t) {
          return q = "useCallback", he(), i1(e, t);
        },
        useContext: function(e) {
          return q = "useContext", he(), cr(e);
        },
        useEffect: function(e, t) {
          return q = "useEffect", he(), Iy(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return q = "useImperativeHandle", he(), a1(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return q = "useInsertionEffect", he(), n1(e, t);
        },
        useLayoutEffect: function(e, t) {
          return q = "useLayoutEffect", he(), r1(e, t);
        },
        useMemo: function(e, t) {
          q = "useMemo", he();
          var a = Te.current;
          Te.current = Yl;
          try {
            return l1(e, t);
          } finally {
            Te.current = a;
          }
        },
        useReducer: function(e, t, a) {
          q = "useReducer", he();
          var l = Te.current;
          Te.current = Yl;
          try {
            return qS(e, t, a);
          } finally {
            Te.current = l;
          }
        },
        useRef: function(e) {
          return q = "useRef", he(), t1(e);
        },
        useState: function(e) {
          q = "useState", he();
          var t = Te.current;
          Te.current = Yl;
          try {
            return Py(e);
          } finally {
            Te.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return q = "useDebugValue", he(), void 0;
        },
        useDeferredValue: function(e) {
          return q = "useDeferredValue", he(), o1(e);
        },
        useTransition: function() {
          return q = "useTransition", he(), u1();
        },
        useMutableSource: function(e, t, a) {
          return q = "useMutableSource", he(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return q = "useSyncExternalStore", he(), ZS(e, t, a);
        },
        useId: function() {
          return q = "useId", he(), s1();
        },
        unstable_isNewReconciler: J
      }, pb = {
        readContext: function(e) {
          return cr(e);
        },
        useCallback: function(e, t) {
          return q = "useCallback", he(), qy(e, t);
        },
        useContext: function(e) {
          return q = "useContext", he(), cr(e);
        },
        useEffect: function(e, t) {
          return q = "useEffect", he(), kh(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return q = "useImperativeHandle", he(), Gy(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return q = "useInsertionEffect", he(), Wy(e, t);
        },
        useLayoutEffect: function(e, t) {
          return q = "useLayoutEffect", he(), $y(e, t);
        },
        useMemo: function(e, t) {
          q = "useMemo", he();
          var a = Te.current;
          Te.current = il;
          try {
            return Xy(e, t);
          } finally {
            Te.current = a;
          }
        },
        useReducer: function(e, t, a) {
          q = "useReducer", he();
          var l = Te.current;
          Te.current = il;
          try {
            return XS(e, t, a);
          } finally {
            Te.current = l;
          }
        },
        useRef: function(e) {
          return q = "useRef", he(), Vy();
        },
        useState: function(e) {
          q = "useState", he();
          var t = Te.current;
          Te.current = il;
          try {
            return JS(e);
          } finally {
            Te.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return q = "useDebugValue", he(), Qy();
        },
        useDeferredValue: function(e) {
          return q = "useDeferredValue", he(), tb(e);
        },
        useTransition: function() {
          return q = "useTransition", he(), ab();
        },
        useMutableSource: function(e, t, a) {
          return q = "useMutableSource", he(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return q = "useSyncExternalStore", he(), Yy(e, t);
        },
        useId: function() {
          return q = "useId", he(), Ky();
        },
        unstable_isNewReconciler: J
      }, hb = {
        readContext: function(e) {
          return cr(e);
        },
        useCallback: function(e, t) {
          return q = "useCallback", he(), qy(e, t);
        },
        useContext: function(e) {
          return q = "useContext", he(), cr(e);
        },
        useEffect: function(e, t) {
          return q = "useEffect", he(), kh(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return q = "useImperativeHandle", he(), Gy(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return q = "useInsertionEffect", he(), Wy(e, t);
        },
        useLayoutEffect: function(e, t) {
          return q = "useLayoutEffect", he(), $y(e, t);
        },
        useMemo: function(e, t) {
          q = "useMemo", he();
          var a = Te.current;
          Te.current = Jy;
          try {
            return Xy(e, t);
          } finally {
            Te.current = a;
          }
        },
        useReducer: function(e, t, a) {
          q = "useReducer", he();
          var l = Te.current;
          Te.current = Jy;
          try {
            return KS(e, t, a);
          } finally {
            Te.current = l;
          }
        },
        useRef: function(e) {
          return q = "useRef", he(), Vy();
        },
        useState: function(e) {
          q = "useState", he();
          var t = Te.current;
          Te.current = Jy;
          try {
            return e1(e);
          } finally {
            Te.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return q = "useDebugValue", he(), Qy();
        },
        useDeferredValue: function(e) {
          return q = "useDeferredValue", he(), nb(e);
        },
        useTransition: function() {
          return q = "useTransition", he(), ib();
        },
        useMutableSource: function(e, t, a) {
          return q = "useMutableSource", he(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return q = "useSyncExternalStore", he(), Yy(e, t);
        },
        useId: function() {
          return q = "useId", he(), Ky();
        },
        unstable_isNewReconciler: J
      }, Yl = {
        readContext: function(e) {
          return c1(), cr(e);
        },
        useCallback: function(e, t) {
          return q = "useCallback", at(), Yt(), i1(e, t);
        },
        useContext: function(e) {
          return q = "useContext", at(), Yt(), cr(e);
        },
        useEffect: function(e, t) {
          return q = "useEffect", at(), Yt(), Iy(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return q = "useImperativeHandle", at(), Yt(), a1(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return q = "useInsertionEffect", at(), Yt(), n1(e, t);
        },
        useLayoutEffect: function(e, t) {
          return q = "useLayoutEffect", at(), Yt(), r1(e, t);
        },
        useMemo: function(e, t) {
          q = "useMemo", at(), Yt();
          var a = Te.current;
          Te.current = Yl;
          try {
            return l1(e, t);
          } finally {
            Te.current = a;
          }
        },
        useReducer: function(e, t, a) {
          q = "useReducer", at(), Yt();
          var l = Te.current;
          Te.current = Yl;
          try {
            return qS(e, t, a);
          } finally {
            Te.current = l;
          }
        },
        useRef: function(e) {
          return q = "useRef", at(), Yt(), t1(e);
        },
        useState: function(e) {
          q = "useState", at(), Yt();
          var t = Te.current;
          Te.current = Yl;
          try {
            return Py(e);
          } finally {
            Te.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return q = "useDebugValue", at(), Yt(), void 0;
        },
        useDeferredValue: function(e) {
          return q = "useDeferredValue", at(), Yt(), o1(e);
        },
        useTransition: function() {
          return q = "useTransition", at(), Yt(), u1();
        },
        useMutableSource: function(e, t, a) {
          return q = "useMutableSource", at(), Yt(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return q = "useSyncExternalStore", at(), Yt(), ZS(e, t, a);
        },
        useId: function() {
          return q = "useId", at(), Yt(), s1();
        },
        unstable_isNewReconciler: J
      }, il = {
        readContext: function(e) {
          return c1(), cr(e);
        },
        useCallback: function(e, t) {
          return q = "useCallback", at(), he(), qy(e, t);
        },
        useContext: function(e) {
          return q = "useContext", at(), he(), cr(e);
        },
        useEffect: function(e, t) {
          return q = "useEffect", at(), he(), kh(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return q = "useImperativeHandle", at(), he(), Gy(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return q = "useInsertionEffect", at(), he(), Wy(e, t);
        },
        useLayoutEffect: function(e, t) {
          return q = "useLayoutEffect", at(), he(), $y(e, t);
        },
        useMemo: function(e, t) {
          q = "useMemo", at(), he();
          var a = Te.current;
          Te.current = il;
          try {
            return Xy(e, t);
          } finally {
            Te.current = a;
          }
        },
        useReducer: function(e, t, a) {
          q = "useReducer", at(), he();
          var l = Te.current;
          Te.current = il;
          try {
            return XS(e, t, a);
          } finally {
            Te.current = l;
          }
        },
        useRef: function(e) {
          return q = "useRef", at(), he(), Vy();
        },
        useState: function(e) {
          q = "useState", at(), he();
          var t = Te.current;
          Te.current = il;
          try {
            return JS(e);
          } finally {
            Te.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return q = "useDebugValue", at(), he(), Qy();
        },
        useDeferredValue: function(e) {
          return q = "useDeferredValue", at(), he(), tb(e);
        },
        useTransition: function() {
          return q = "useTransition", at(), he(), ab();
        },
        useMutableSource: function(e, t, a) {
          return q = "useMutableSource", at(), he(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return q = "useSyncExternalStore", at(), he(), Yy(e, t);
        },
        useId: function() {
          return q = "useId", at(), he(), Ky();
        },
        unstable_isNewReconciler: J
      }, Jy = {
        readContext: function(e) {
          return c1(), cr(e);
        },
        useCallback: function(e, t) {
          return q = "useCallback", at(), he(), qy(e, t);
        },
        useContext: function(e) {
          return q = "useContext", at(), he(), cr(e);
        },
        useEffect: function(e, t) {
          return q = "useEffect", at(), he(), kh(e, t);
        },
        useImperativeHandle: function(e, t, a) {
          return q = "useImperativeHandle", at(), he(), Gy(e, t, a);
        },
        useInsertionEffect: function(e, t) {
          return q = "useInsertionEffect", at(), he(), Wy(e, t);
        },
        useLayoutEffect: function(e, t) {
          return q = "useLayoutEffect", at(), he(), $y(e, t);
        },
        useMemo: function(e, t) {
          q = "useMemo", at(), he();
          var a = Te.current;
          Te.current = il;
          try {
            return Xy(e, t);
          } finally {
            Te.current = a;
          }
        },
        useReducer: function(e, t, a) {
          q = "useReducer", at(), he();
          var l = Te.current;
          Te.current = il;
          try {
            return KS(e, t, a);
          } finally {
            Te.current = l;
          }
        },
        useRef: function(e) {
          return q = "useRef", at(), he(), Vy();
        },
        useState: function(e) {
          q = "useState", at(), he();
          var t = Te.current;
          Te.current = il;
          try {
            return e1(e);
          } finally {
            Te.current = t;
          }
        },
        useDebugValue: function(e, t) {
          return q = "useDebugValue", at(), he(), Qy();
        },
        useDeferredValue: function(e) {
          return q = "useDeferredValue", at(), he(), nb(e);
        },
        useTransition: function() {
          return q = "useTransition", at(), he(), ib();
        },
        useMutableSource: function(e, t, a) {
          return q = "useMutableSource", at(), he(), void 0;
        },
        useSyncExternalStore: function(e, t, a) {
          return q = "useSyncExternalStore", at(), he(), Yy(e, t);
        },
        useId: function() {
          return q = "useId", at(), he(), Ky();
        },
        unstable_isNewReconciler: J
      };
    }
    var Ju = u.unstable_now, vb = 0, eg = -1, Oh = -1, tg = -1, f1 = !1, ng = !1;
    function mb() {
      return f1;
    }
    function eO() {
      ng = !0;
    }
    function tO() {
      f1 = !1, ng = !1;
    }
    function nO() {
      f1 = ng, ng = !1;
    }
    function yb() {
      return vb;
    }
    function gb() {
      vb = Ju();
    }
    function d1(e) {
      Oh = Ju(), e.actualStartTime < 0 && (e.actualStartTime = Ju());
    }
    function Sb(e) {
      Oh = -1;
    }
    function rg(e, t) {
      if (Oh >= 0) {
        var a = Ju() - Oh;
        e.actualDuration += a, t && (e.selfBaseDuration = a), Oh = -1;
      }
    }
    function Pl(e) {
      if (eg >= 0) {
        var t = Ju() - eg;
        eg = -1;
        for (var a = e.return; a !== null; ) {
          switch (a.tag) {
            case W:
              var l = a.stateNode;
              l.effectDuration += t;
              return;
            case O:
              var s = a.stateNode;
              s.effectDuration += t;
              return;
          }
          a = a.return;
        }
      }
    }
    function p1(e) {
      if (tg >= 0) {
        var t = Ju() - tg;
        tg = -1;
        for (var a = e.return; a !== null; ) {
          switch (a.tag) {
            case W:
              var l = a.stateNode;
              l !== null && (l.passiveEffectDuration += t);
              return;
            case O:
              var s = a.stateNode;
              s !== null && (s.passiveEffectDuration += t);
              return;
          }
          a = a.return;
        }
      }
    }
    function Vl() {
      eg = Ju();
    }
    function h1() {
      tg = Ju();
    }
    function v1(e) {
      for (var t = e.child; t; )
        e.actualDuration += t.actualDuration, t = t.sibling;
    }
    function ll(e, t) {
      if (e && e.defaultProps) {
        var a = St({}, t), l = e.defaultProps;
        for (var s in l)
          a[s] === void 0 && (a[s] = l[s]);
        return a;
      }
      return t;
    }
    var m1 = {}, y1, g1, S1, E1, w1, Eb, ag, C1, b1, x1, Mh;
    {
      y1 = /* @__PURE__ */ new Set(), g1 = /* @__PURE__ */ new Set(), S1 = /* @__PURE__ */ new Set(), E1 = /* @__PURE__ */ new Set(), C1 = /* @__PURE__ */ new Set(), w1 = /* @__PURE__ */ new Set(), b1 = /* @__PURE__ */ new Set(), x1 = /* @__PURE__ */ new Set(), Mh = /* @__PURE__ */ new Set();
      var wb = /* @__PURE__ */ new Set();
      ag = function(e, t) {
        if (!(e === null || typeof e == "function")) {
          var a = t + "_" + e;
          wb.has(a) || (wb.add(a), S("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", t, e));
        }
      }, Eb = function(e, t) {
        if (t === void 0) {
          var a = Wt(e) || "Component";
          w1.has(a) || (w1.add(a), S("%s.getDerivedStateFromProps(): A valid state object (or null) must be returned. You have returned undefined.", a));
        }
      }, Object.defineProperty(m1, "_processChildContext", {
        enumerable: !1,
        value: function() {
          throw new Error("_processChildContext is not available in React 16+. This likely means you have multiple copies of React and are attempting to nest a React 15 tree inside a React 16 tree using unstable_renderSubtreeIntoContainer, which isn't supported. Try to make sure you have only one copy of React (and ideally, switch to ReactDOM.createPortal).");
        }
      }), Object.freeze(m1);
    }
    function T1(e, t, a, l) {
      var s = e.memoizedState, d = a(l, s);
      {
        if (e.mode & Et) {
          Hn(!0);
          try {
            d = a(l, s);
          } finally {
            Hn(!1);
          }
        }
        Eb(t, d);
      }
      var v = d == null ? s : St({}, s, d);
      if (e.memoizedState = v, e.lanes === K) {
        var g = e.updateQueue;
        g.baseState = v;
      }
    }
    var _1 = {
      isMounted: va,
      enqueueSetState: function(e, t, a) {
        var l = ka(e), s = wa(), d = rs(l), v = Ao(s, d);
        v.payload = t, a != null && (ag(a, "setState"), v.callback = a);
        var g = qu(l, v, d);
        g !== null && (Cr(g, l, d, s), Ly(g, l, d)), js(l, d);
      },
      enqueueReplaceState: function(e, t, a) {
        var l = ka(e), s = wa(), d = rs(l), v = Ao(s, d);
        v.tag = FC, v.payload = t, a != null && (ag(a, "replaceState"), v.callback = a);
        var g = qu(l, v, d);
        g !== null && (Cr(g, l, d, s), Ly(g, l, d)), js(l, d);
      },
      enqueueForceUpdate: function(e, t) {
        var a = ka(e), l = wa(), s = rs(a), d = Ao(l, s);
        d.tag = Oy, t != null && (ag(t, "forceUpdate"), d.callback = t);
        var v = qu(a, d, s);
        v !== null && (Cr(v, a, s, l), Ly(v, a, s)), uf(a, s);
      }
    };
    function Cb(e, t, a, l, s, d, v) {
      var g = e.stateNode;
      if (typeof g.shouldComponentUpdate == "function") {
        var E = g.shouldComponentUpdate(l, d, v);
        {
          if (e.mode & Et) {
            Hn(!0);
            try {
              E = g.shouldComponentUpdate(l, d, v);
            } finally {
              Hn(!1);
            }
          }
          E === void 0 && S("%s.shouldComponentUpdate(): Returned undefined instead of a boolean value. Make sure to return true or false.", Wt(t) || "Component");
        }
        return E;
      }
      return t.prototype && t.prototype.isPureReactComponent ? !Xe(a, l) || !Xe(s, d) : !0;
    }
    function rO(e, t, a) {
      var l = e.stateNode;
      {
        var s = Wt(t) || "Component", d = l.render;
        d || (t.prototype && typeof t.prototype.render == "function" ? S("%s(...): No `render` method found on the returned component instance: did you accidentally return an object from the constructor?", s) : S("%s(...): No `render` method found on the returned component instance: you may have forgotten to define `render`.", s)), l.getInitialState && !l.getInitialState.isReactClassApproved && !l.state && S("getInitialState was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Did you mean to define a state property instead?", s), l.getDefaultProps && !l.getDefaultProps.isReactClassApproved && S("getDefaultProps was defined on %s, a plain JavaScript class. This is only supported for classes created using React.createClass. Use a static property to define defaultProps instead.", s), l.propTypes && S("propTypes was defined as an instance property on %s. Use a static property to define propTypes instead.", s), l.contextType && S("contextType was defined as an instance property on %s. Use a static property to define contextType instead.", s), t.childContextTypes && !Mh.has(t) && // Strict Mode has its own warning for legacy context, so we can skip
        // this one.
        (e.mode & Et) === ze && (Mh.add(t), S(`%s uses the legacy childContextTypes API which is no longer supported and will be removed in the next major release. Use React.createContext() instead

.Learn more about this warning here: https://reactjs.org/link/legacy-context`, s)), t.contextTypes && !Mh.has(t) && // Strict Mode has its own warning for legacy context, so we can skip
        // this one.
        (e.mode & Et) === ze && (Mh.add(t), S(`%s uses the legacy contextTypes API which is no longer supported and will be removed in the next major release. Use React.createContext() with static contextType instead.

Learn more about this warning here: https://reactjs.org/link/legacy-context`, s)), l.contextTypes && S("contextTypes was defined as an instance property on %s. Use a static property to define contextTypes instead.", s), t.contextType && t.contextTypes && !b1.has(t) && (b1.add(t), S("%s declares both contextTypes and contextType static properties. The legacy contextTypes property will be ignored.", s)), typeof l.componentShouldUpdate == "function" && S("%s has a method called componentShouldUpdate(). Did you mean shouldComponentUpdate()? The name is phrased as a question because the function is expected to return a value.", s), t.prototype && t.prototype.isPureReactComponent && typeof l.shouldComponentUpdate < "u" && S("%s has a method called shouldComponentUpdate(). shouldComponentUpdate should not be used when extending React.PureComponent. Please extend React.Component if shouldComponentUpdate is used.", Wt(t) || "A pure component"), typeof l.componentDidUnmount == "function" && S("%s has a method called componentDidUnmount(). But there is no such lifecycle method. Did you mean componentWillUnmount()?", s), typeof l.componentDidReceiveProps == "function" && S("%s has a method called componentDidReceiveProps(). But there is no such lifecycle method. If you meant to update the state in response to changing props, use componentWillReceiveProps(). If you meant to fetch data or run side-effects or mutations after React has updated the UI, use componentDidUpdate().", s), typeof l.componentWillRecieveProps == "function" && S("%s has a method called componentWillRecieveProps(). Did you mean componentWillReceiveProps()?", s), typeof l.UNSAFE_componentWillRecieveProps == "function" && S("%s has a method called UNSAFE_componentWillRecieveProps(). Did you mean UNSAFE_componentWillReceiveProps()?", s);
        var v = l.props !== a;
        l.props !== void 0 && v && S("%s(...): When calling super() in `%s`, make sure to pass up the same props that your component's constructor was passed.", s, s), l.defaultProps && S("Setting defaultProps as an instance property on %s is not supported and will be ignored. Instead, define defaultProps as a static property on %s.", s, s), typeof l.getSnapshotBeforeUpdate == "function" && typeof l.componentDidUpdate != "function" && !S1.has(t) && (S1.add(t), S("%s: getSnapshotBeforeUpdate() should be used with componentDidUpdate(). This component defines getSnapshotBeforeUpdate() only.", Wt(t))), typeof l.getDerivedStateFromProps == "function" && S("%s: getDerivedStateFromProps() is defined as an instance method and will be ignored. Instead, declare it as a static method.", s), typeof l.getDerivedStateFromError == "function" && S("%s: getDerivedStateFromError() is defined as an instance method and will be ignored. Instead, declare it as a static method.", s), typeof t.getSnapshotBeforeUpdate == "function" && S("%s: getSnapshotBeforeUpdate() is defined as a static method and will be ignored. Instead, declare it as an instance method.", s);
        var g = l.state;
        g && (typeof g != "object" || ar(g)) && S("%s.state: must be set to an object or null", s), typeof l.getChildContext == "function" && typeof t.childContextTypes != "object" && S("%s.getChildContext(): childContextTypes must be defined in order to use getChildContext().", s);
      }
    }
    function bb(e, t) {
      t.updater = _1, e.stateNode = t, du(t, e), t._reactInternalInstance = m1;
    }
    function xb(e, t, a) {
      var l = !1, s = ci, d = ci, v = t.contextType;
      if ("contextType" in t) {
        var g = (
          // Allow null for conditional declaration
          v === null || v !== void 0 && v.$$typeof === te && v._context === void 0
        );
        if (!g && !x1.has(t)) {
          x1.add(t);
          var E = "";
          v === void 0 ? E = " However, it is set to undefined. This can be caused by a typo or by mixing up named and default imports. This can also happen due to a circular dependency, so try moving the createContext() call to a separate file." : typeof v != "object" ? E = " However, it is set to a " + typeof v + "." : v.$$typeof === R ? E = " Did you accidentally pass the Context.Provider instead?" : v._context !== void 0 ? E = " Did you accidentally pass the Context.Consumer instead?" : E = " However, it is set to an object with keys {" + Object.keys(v).join(", ") + "}.", S("%s defines an invalid contextType. contextType should point to the Context object returned by React.createContext().%s", Wt(t) || "Component", E);
        }
      }
      if (typeof v == "object" && v !== null)
        d = cr(v);
      else {
        s = td(e, t, !0);
        var b = t.contextTypes;
        l = b != null, d = l ? nd(e, s) : ci;
      }
      var x = new t(a, d);
      if (e.mode & Et) {
        Hn(!0);
        try {
          x = new t(a, d);
        } finally {
          Hn(!1);
        }
      }
      var L = e.memoizedState = x.state !== null && x.state !== void 0 ? x.state : null;
      bb(e, x);
      {
        if (typeof t.getDerivedStateFromProps == "function" && L === null) {
          var M = Wt(t) || "Component";
          g1.has(M) || (g1.add(M), S("`%s` uses `getDerivedStateFromProps` but its initial state is %s. This is not recommended. Instead, define the initial state by assigning an object to `this.state` in the constructor of `%s`. This ensures that `getDerivedStateFromProps` arguments have a consistent shape.", M, x.state === null ? "null" : "undefined", M));
        }
        if (typeof t.getDerivedStateFromProps == "function" || typeof x.getSnapshotBeforeUpdate == "function") {
          var V = null, I = null, $ = null;
          if (typeof x.componentWillMount == "function" && x.componentWillMount.__suppressDeprecationWarning !== !0 ? V = "componentWillMount" : typeof x.UNSAFE_componentWillMount == "function" && (V = "UNSAFE_componentWillMount"), typeof x.componentWillReceiveProps == "function" && x.componentWillReceiveProps.__suppressDeprecationWarning !== !0 ? I = "componentWillReceiveProps" : typeof x.UNSAFE_componentWillReceiveProps == "function" && (I = "UNSAFE_componentWillReceiveProps"), typeof x.componentWillUpdate == "function" && x.componentWillUpdate.__suppressDeprecationWarning !== !0 ? $ = "componentWillUpdate" : typeof x.UNSAFE_componentWillUpdate == "function" && ($ = "UNSAFE_componentWillUpdate"), V !== null || I !== null || $ !== null) {
            var ge = Wt(t) || "Component", We = typeof t.getDerivedStateFromProps == "function" ? "getDerivedStateFromProps()" : "getSnapshotBeforeUpdate()";
            E1.has(ge) || (E1.add(ge), S(`Unsafe legacy lifecycles will not be called for components using new component APIs.

%s uses %s but also contains the following legacy lifecycles:%s%s%s

The above lifecycles should be removed. Learn more about this warning here:
https://reactjs.org/link/unsafe-component-lifecycles`, ge, We, V !== null ? `
  ` + V : "", I !== null ? `
  ` + I : "", $ !== null ? `
  ` + $ : ""));
          }
        }
      }
      return l && pC(e, s, d), x;
    }
    function aO(e, t) {
      var a = t.state;
      typeof t.componentWillMount == "function" && t.componentWillMount(), typeof t.UNSAFE_componentWillMount == "function" && t.UNSAFE_componentWillMount(), a !== t.state && (S("%s.componentWillMount(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", st(e) || "Component"), _1.enqueueReplaceState(t, t.state, null));
    }
    function Tb(e, t, a, l) {
      var s = t.state;
      if (typeof t.componentWillReceiveProps == "function" && t.componentWillReceiveProps(a, l), typeof t.UNSAFE_componentWillReceiveProps == "function" && t.UNSAFE_componentWillReceiveProps(a, l), t.state !== s) {
        {
          var d = st(e) || "Component";
          y1.has(d) || (y1.add(d), S("%s.componentWillReceiveProps(): Assigning directly to this.state is deprecated (except inside a component's constructor). Use setState instead.", d));
        }
        _1.enqueueReplaceState(t, t.state, null);
      }
    }
    function R1(e, t, a, l) {
      rO(e, t, a);
      var s = e.stateNode;
      s.props = a, s.state = e.memoizedState, s.refs = {}, zS(e);
      var d = t.contextType;
      if (typeof d == "object" && d !== null)
        s.context = cr(d);
      else {
        var v = td(e, t, !0);
        s.context = nd(e, v);
      }
      {
        if (s.state === a) {
          var g = Wt(t) || "Component";
          C1.has(g) || (C1.add(g), S("%s: It is not recommended to assign props directly to state because updates to props won't be reflected in state. In most cases, it is better to use props directly.", g));
        }
        e.mode & Et && rl.recordLegacyContextWarning(e, s), rl.recordUnsafeLifecycleWarnings(e, s);
      }
      s.state = e.memoizedState;
      var E = t.getDerivedStateFromProps;
      if (typeof E == "function" && (T1(e, t, E, a), s.state = e.memoizedState), typeof t.getDerivedStateFromProps != "function" && typeof s.getSnapshotBeforeUpdate != "function" && (typeof s.UNSAFE_componentWillMount == "function" || typeof s.componentWillMount == "function") && (aO(e, s), Ay(e, a, s, l), s.state = e.memoizedState), typeof s.componentDidMount == "function") {
        var b = dt;
        b |= Qr, (e.mode & ya) !== ze && (b |= qr), e.flags |= b;
      }
    }
    function iO(e, t, a, l) {
      var s = e.stateNode, d = e.memoizedProps;
      s.props = d;
      var v = s.context, g = t.contextType, E = ci;
      if (typeof g == "object" && g !== null)
        E = cr(g);
      else {
        var b = td(e, t, !0);
        E = nd(e, b);
      }
      var x = t.getDerivedStateFromProps, L = typeof x == "function" || typeof s.getSnapshotBeforeUpdate == "function";
      !L && (typeof s.UNSAFE_componentWillReceiveProps == "function" || typeof s.componentWillReceiveProps == "function") && (d !== a || v !== E) && Tb(e, s, a, E), YC();
      var M = e.memoizedState, V = s.state = M;
      if (Ay(e, a, s, l), V = e.memoizedState, d === a && M === V && !vy() && !Uy()) {
        if (typeof s.componentDidMount == "function") {
          var I = dt;
          I |= Qr, (e.mode & ya) !== ze && (I |= qr), e.flags |= I;
        }
        return !1;
      }
      typeof x == "function" && (T1(e, t, x, a), V = e.memoizedState);
      var $ = Uy() || Cb(e, t, d, a, M, V, E);
      if ($) {
        if (!L && (typeof s.UNSAFE_componentWillMount == "function" || typeof s.componentWillMount == "function") && (typeof s.componentWillMount == "function" && s.componentWillMount(), typeof s.UNSAFE_componentWillMount == "function" && s.UNSAFE_componentWillMount()), typeof s.componentDidMount == "function") {
          var ge = dt;
          ge |= Qr, (e.mode & ya) !== ze && (ge |= qr), e.flags |= ge;
        }
      } else {
        if (typeof s.componentDidMount == "function") {
          var We = dt;
          We |= Qr, (e.mode & ya) !== ze && (We |= qr), e.flags |= We;
        }
        e.memoizedProps = a, e.memoizedState = V;
      }
      return s.props = a, s.state = V, s.context = E, $;
    }
    function lO(e, t, a, l, s) {
      var d = t.stateNode;
      HC(e, t);
      var v = t.memoizedProps, g = t.type === t.elementType ? v : ll(t.type, v);
      d.props = g;
      var E = t.pendingProps, b = d.context, x = a.contextType, L = ci;
      if (typeof x == "object" && x !== null)
        L = cr(x);
      else {
        var M = td(t, a, !0);
        L = nd(t, M);
      }
      var V = a.getDerivedStateFromProps, I = typeof V == "function" || typeof d.getSnapshotBeforeUpdate == "function";
      !I && (typeof d.UNSAFE_componentWillReceiveProps == "function" || typeof d.componentWillReceiveProps == "function") && (v !== E || b !== L) && Tb(t, d, l, L), YC();
      var $ = t.memoizedState, ge = d.state = $;
      if (Ay(t, l, d, s), ge = t.memoizedState, v === E && $ === ge && !vy() && !Uy() && !De)
        return typeof d.componentDidUpdate == "function" && (v !== e.memoizedProps || $ !== e.memoizedState) && (t.flags |= dt), typeof d.getSnapshotBeforeUpdate == "function" && (v !== e.memoizedProps || $ !== e.memoizedState) && (t.flags |= Oa), !1;
      typeof V == "function" && (T1(t, a, V, l), ge = t.memoizedState);
      var We = Uy() || Cb(t, a, g, l, $, ge, L) || // TODO: In some cases, we'll end up checking if context has changed twice,
      // both before and after `shouldComponentUpdate` has been called. Not ideal,
      // but I'm loath to refactor this function. This only happens for memoized
      // components so it's not that common.
      De;
      return We ? (!I && (typeof d.UNSAFE_componentWillUpdate == "function" || typeof d.componentWillUpdate == "function") && (typeof d.componentWillUpdate == "function" && d.componentWillUpdate(l, ge, L), typeof d.UNSAFE_componentWillUpdate == "function" && d.UNSAFE_componentWillUpdate(l, ge, L)), typeof d.componentDidUpdate == "function" && (t.flags |= dt), typeof d.getSnapshotBeforeUpdate == "function" && (t.flags |= Oa)) : (typeof d.componentDidUpdate == "function" && (v !== e.memoizedProps || $ !== e.memoizedState) && (t.flags |= dt), typeof d.getSnapshotBeforeUpdate == "function" && (v !== e.memoizedProps || $ !== e.memoizedState) && (t.flags |= Oa), t.memoizedProps = l, t.memoizedState = ge), d.props = l, d.state = ge, d.context = L, We;
    }
    function hc(e, t) {
      return {
        value: e,
        source: t,
        stack: $d(t),
        digest: null
      };
    }
    function D1(e, t, a) {
      return {
        value: e,
        source: null,
        stack: a ?? null,
        digest: t ?? null
      };
    }
    function oO(e, t) {
      return !0;
    }
    function k1(e, t) {
      try {
        var a = oO(e, t);
        if (a === !1)
          return;
        var l = t.value, s = t.source, d = t.stack, v = d !== null ? d : "";
        if (l != null && l._suppressLogging) {
          if (e.tag === A)
            return;
          console.error(l);
        }
        var g = s ? st(s) : null, E = g ? "The above error occurred in the <" + g + "> component:" : "The above error occurred in one of your React components:", b;
        if (e.tag === W)
          b = `Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.`;
        else {
          var x = st(e) || "Anonymous";
          b = "React will try to recreate this component tree from scratch " + ("using the error boundary you provided, " + x + ".");
        }
        var L = E + `
` + v + `

` + ("" + b);
        console.error(L);
      } catch (M) {
        setTimeout(function() {
          throw M;
        });
      }
    }
    var uO = typeof WeakMap == "function" ? WeakMap : Map;
    function _b(e, t, a) {
      var l = Ao(nn, a);
      l.tag = AS, l.payload = {
        element: null
      };
      var s = t.value;
      return l.callback = function() {
        eN(s), k1(e, t);
      }, l;
    }
    function O1(e, t, a) {
      var l = Ao(nn, a);
      l.tag = AS;
      var s = e.type.getDerivedStateFromError;
      if (typeof s == "function") {
        var d = t.value;
        l.payload = function() {
          return s(d);
        }, l.callback = function() {
          jx(e), k1(e, t);
        };
      }
      var v = e.stateNode;
      return v !== null && typeof v.componentDidCatch == "function" && (l.callback = function() {
        jx(e), k1(e, t), typeof s != "function" && ZM(this);
        var E = t.value, b = t.stack;
        this.componentDidCatch(E, {
          componentStack: b !== null ? b : ""
        }), typeof s != "function" && (ta(e.lanes, Ve) || S("%s: Error boundaries should implement getDerivedStateFromError(). In that method, return a state update to display an error message or fallback UI.", st(e) || "Unknown"));
      }), l;
    }
    function Rb(e, t, a) {
      var l = e.pingCache, s;
      if (l === null ? (l = e.pingCache = new uO(), s = /* @__PURE__ */ new Set(), l.set(t, s)) : (s = l.get(t), s === void 0 && (s = /* @__PURE__ */ new Set(), l.set(t, s))), !s.has(a)) {
        s.add(a);
        var d = tN.bind(null, e, t, a);
        ma && Qh(e, a), t.then(d, d);
      }
    }
    function sO(e, t, a, l) {
      var s = e.updateQueue;
      if (s === null) {
        var d = /* @__PURE__ */ new Set();
        d.add(a), e.updateQueue = d;
      } else
        s.add(a);
    }
    function cO(e, t) {
      var a = e.tag;
      if ((e.mode & Fe) === ze && (a === _ || a === Se || a === ye)) {
        var l = e.alternate;
        l ? (e.updateQueue = l.updateQueue, e.memoizedState = l.memoizedState, e.lanes = l.lanes) : (e.updateQueue = null, e.memoizedState = null);
      }
    }
    function Db(e) {
      var t = e;
      do {
        if (t.tag === be && Ik(t))
          return t;
        t = t.return;
      } while (t !== null);
      return null;
    }
    function kb(e, t, a, l, s) {
      if ((e.mode & Fe) === ze) {
        if (e === t)
          e.flags |= lr;
        else {
          if (e.flags |= nt, a.flags |= As, a.flags &= ~(qc | pa), a.tag === A) {
            var d = a.alternate;
            if (d === null)
              a.tag = yt;
            else {
              var v = Ao(nn, Ve);
              v.tag = Oy, qu(a, v, Ve);
            }
          }
          a.lanes = ct(a.lanes, Ve);
        }
        return e;
      }
      return e.flags |= lr, e.lanes = s, e;
    }
    function fO(e, t, a, l, s) {
      if (a.flags |= pa, ma && Qh(e, s), l !== null && typeof l == "object" && typeof l.then == "function") {
        var d = l;
        cO(a), Ur() && a.mode & Fe && EC();
        var v = Db(t);
        if (v !== null) {
          v.flags &= ~Tn, kb(v, t, a, e, s), v.mode & Fe && Rb(e, d, s), sO(v, e, d);
          return;
        } else {
          if (!Ap(s)) {
            Rb(e, d, s), sE();
            return;
          }
          var g = new Error("A component suspended while responding to synchronous input. This will cause the UI to be replaced with a loading indicator. To fix, updates that suspend should be wrapped with startTransition.");
          l = g;
        }
      } else if (Ur() && a.mode & Fe) {
        EC();
        var E = Db(t);
        if (E !== null) {
          (E.flags & lr) === Be && (E.flags |= Tn), kb(E, t, a, e, s), CS(hc(l, a));
          return;
        }
      }
      l = hc(l, a), IM(l);
      var b = t;
      do {
        switch (b.tag) {
          case W: {
            var x = l;
            b.flags |= lr;
            var L = _u(s);
            b.lanes = ct(b.lanes, L);
            var M = _b(b, x, L);
            jS(b, M);
            return;
          }
          case A:
            var V = l, I = b.type, $ = b.stateNode;
            if ((b.flags & nt) === Be && (typeof I.getDerivedStateFromError == "function" || $ !== null && typeof $.componentDidCatch == "function" && !Dx($))) {
              b.flags |= lr;
              var ge = _u(s);
              b.lanes = ct(b.lanes, ge);
              var We = O1(b, V, ge);
              jS(b, We);
              return;
            }
            break;
        }
        b = b.return;
      } while (b !== null);
    }
    function dO() {
      return null;
    }
    var Nh = c.ReactCurrentOwner, ol = !1, M1, Lh, N1, L1, A1, vc, U1, ig, Ah;
    M1 = {}, Lh = {}, N1 = {}, L1 = {}, A1 = {}, vc = !1, U1 = {}, ig = {}, Ah = {};
    function Sa(e, t, a, l) {
      e === null ? t.child = NC(t, null, a, l) : t.child = ld(t, e.child, a, l);
    }
    function pO(e, t, a, l) {
      t.child = ld(t, e.child, null, l), t.child = ld(t, null, a, l);
    }
    function Ob(e, t, a, l, s) {
      if (t.type !== t.elementType) {
        var d = a.propTypes;
        d && tl(
          d,
          l,
          // Resolved props
          "prop",
          Wt(a)
        );
      }
      var v = a.render, g = t.ref, E, b;
      ud(t, s), mu(t);
      {
        if (Nh.current = t, ii(!0), E = hd(e, t, v, l, g, s), b = vd(), t.mode & Et) {
          Hn(!0);
          try {
            E = hd(e, t, v, l, g, s), b = vd();
          } finally {
            Hn(!1);
          }
        }
        ii(!1);
      }
      return Zr(), e !== null && !ol ? ($C(e, t, s), Uo(e, t, s)) : (Ur() && b && mS(t), t.flags |= xl, Sa(e, t, E, s), t.child);
    }
    function Mb(e, t, a, l, s) {
      if (e === null) {
        var d = a.type;
        if (gN(d) && a.compare === null && // SimpleMemoComponent codepath doesn't resolve outer props either.
        a.defaultProps === void 0) {
          var v = d;
          return v = bd(d), t.tag = ye, t.type = v, F1(t, d), Nb(e, t, v, l, s);
        }
        {
          var g = d.propTypes;
          if (g && tl(
            g,
            l,
            // Resolved props
            "prop",
            Wt(d)
          ), a.defaultProps !== void 0) {
            var E = Wt(d) || "Unknown";
            Ah[E] || (S("%s: Support for defaultProps will be removed from memo components in a future major release. Use JavaScript default parameters instead.", E), Ah[E] = !0);
          }
        }
        var b = EE(a.type, null, l, t, t.mode, s);
        return b.ref = t.ref, b.return = t, t.child = b, b;
      }
      {
        var x = a.type, L = x.propTypes;
        L && tl(
          L,
          l,
          // Resolved props
          "prop",
          Wt(x)
        );
      }
      var M = e.child, V = I1(e, s);
      if (!V) {
        var I = M.memoizedProps, $ = a.compare;
        if ($ = $ !== null ? $ : Xe, $(I, l) && e.ref === t.ref)
          return Uo(e, t, s);
      }
      t.flags |= xl;
      var ge = Ec(M, l);
      return ge.ref = t.ref, ge.return = t, t.child = ge, ge;
    }
    function Nb(e, t, a, l, s) {
      if (t.type !== t.elementType) {
        var d = t.elementType;
        if (d.$$typeof === Ze) {
          var v = d, g = v._payload, E = v._init;
          try {
            d = E(g);
          } catch {
            d = null;
          }
          var b = d && d.propTypes;
          b && tl(
            b,
            l,
            // Resolved (SimpleMemoComponent has no defaultProps)
            "prop",
            Wt(d)
          );
        }
      }
      if (e !== null) {
        var x = e.memoizedProps;
        if (Xe(x, l) && e.ref === t.ref && // Prevent bailout if the implementation changed due to hot reload.
        t.type === e.type)
          if (ol = !1, t.pendingProps = l = x, I1(e, s))
            (e.flags & As) !== Be && (ol = !0);
          else return t.lanes = e.lanes, Uo(e, t, s);
      }
      return z1(e, t, a, l, s);
    }
    function Lb(e, t, a) {
      var l = t.pendingProps, s = l.children, d = e !== null ? e.memoizedState : null;
      if (l.mode === "hidden" || se)
        if ((t.mode & Fe) === ze) {
          var v = {
            baseLanes: K,
            cachePool: null,
            transitions: null
          };
          t.memoizedState = v, gg(t, a);
        } else if (ta(a, Or)) {
          var L = {
            baseLanes: K,
            cachePool: null,
            transitions: null
          };
          t.memoizedState = L;
          var M = d !== null ? d.baseLanes : a;
          gg(t, M);
        } else {
          var g = null, E;
          if (d !== null) {
            var b = d.baseLanes;
            E = ct(b, a);
          } else
            E = a;
          t.lanes = t.childLanes = Or;
          var x = {
            baseLanes: E,
            cachePool: g,
            transitions: null
          };
          return t.memoizedState = x, t.updateQueue = null, gg(t, E), null;
        }
      else {
        var V;
        d !== null ? (V = ct(d.baseLanes, a), t.memoizedState = null) : V = a, gg(t, V);
      }
      return Sa(e, t, s, a), t.child;
    }
    function hO(e, t, a) {
      var l = t.pendingProps;
      return Sa(e, t, l, a), t.child;
    }
    function vO(e, t, a) {
      var l = t.pendingProps.children;
      return Sa(e, t, l, a), t.child;
    }
    function mO(e, t, a) {
      {
        t.flags |= dt;
        {
          var l = t.stateNode;
          l.effectDuration = 0, l.passiveEffectDuration = 0;
        }
      }
      var s = t.pendingProps, d = s.children;
      return Sa(e, t, d, a), t.child;
    }
    function Ab(e, t) {
      var a = t.ref;
      (e === null && a !== null || e !== null && e.ref !== a) && (t.flags |= Gr, t.flags |= wp);
    }
    function z1(e, t, a, l, s) {
      if (t.type !== t.elementType) {
        var d = a.propTypes;
        d && tl(
          d,
          l,
          // Resolved props
          "prop",
          Wt(a)
        );
      }
      var v;
      {
        var g = td(t, a, !0);
        v = nd(t, g);
      }
      var E, b;
      ud(t, s), mu(t);
      {
        if (Nh.current = t, ii(!0), E = hd(e, t, a, l, v, s), b = vd(), t.mode & Et) {
          Hn(!0);
          try {
            E = hd(e, t, a, l, v, s), b = vd();
          } finally {
            Hn(!1);
          }
        }
        ii(!1);
      }
      return Zr(), e !== null && !ol ? ($C(e, t, s), Uo(e, t, s)) : (Ur() && b && mS(t), t.flags |= xl, Sa(e, t, E, s), t.child);
    }
    function Ub(e, t, a, l, s) {
      {
        switch (LN(t)) {
          case !1: {
            var d = t.stateNode, v = t.type, g = new v(t.memoizedProps, d.context), E = g.state;
            d.updater.enqueueSetState(d, E, null);
            break;
          }
          case !0: {
            t.flags |= nt, t.flags |= lr;
            var b = new Error("Simulated error coming from DevTools"), x = _u(s);
            t.lanes = ct(t.lanes, x);
            var L = O1(t, hc(b, t), x);
            jS(t, L);
            break;
          }
        }
        if (t.type !== t.elementType) {
          var M = a.propTypes;
          M && tl(
            M,
            l,
            // Resolved props
            "prop",
            Wt(a)
          );
        }
      }
      var V;
      jl(a) ? (V = !0, yy(t)) : V = !1, ud(t, s);
      var I = t.stateNode, $;
      I === null ? (og(e, t), xb(t, a, l), R1(t, a, l, s), $ = !0) : e === null ? $ = iO(t, a, l, s) : $ = lO(e, t, a, l, s);
      var ge = j1(e, t, a, $, V, s);
      {
        var We = t.stateNode;
        $ && We.props !== l && (vc || S("It looks like %s is reassigning its own `this.props` while rendering. This is not supported and can lead to confusing bugs.", st(t) || "a component"), vc = !0);
      }
      return ge;
    }
    function j1(e, t, a, l, s, d) {
      Ab(e, t);
      var v = (t.flags & nt) !== Be;
      if (!l && !v)
        return s && mC(t, a, !1), Uo(e, t, d);
      var g = t.stateNode;
      Nh.current = t;
      var E;
      if (v && typeof a.getDerivedStateFromError != "function")
        E = null, Sb();
      else {
        mu(t);
        {
          if (ii(!0), E = g.render(), t.mode & Et) {
            Hn(!0);
            try {
              g.render();
            } finally {
              Hn(!1);
            }
          }
          ii(!1);
        }
        Zr();
      }
      return t.flags |= xl, e !== null && v ? pO(e, t, E, d) : Sa(e, t, E, d), t.memoizedState = g.state, s && mC(t, a, !0), t.child;
    }
    function zb(e) {
      var t = e.stateNode;
      t.pendingContext ? hC(e, t.pendingContext, t.pendingContext !== t.context) : t.context && hC(e, t.context, !1), FS(e, t.containerInfo);
    }
    function yO(e, t, a) {
      if (zb(t), e === null)
        throw new Error("Should have a current fiber. This is a bug in React.");
      var l = t.pendingProps, s = t.memoizedState, d = s.element;
      HC(e, t), Ay(t, l, null, a);
      var v = t.memoizedState;
      t.stateNode;
      var g = v.element;
      if (s.isDehydrated) {
        var E = {
          element: g,
          isDehydrated: !1,
          cache: v.cache,
          pendingSuspenseBoundaries: v.pendingSuspenseBoundaries,
          transitions: v.transitions
        }, b = t.updateQueue;
        if (b.baseState = E, t.memoizedState = E, t.flags & Tn) {
          var x = hc(new Error("There was an error while hydrating. Because the error happened outside of a Suspense boundary, the entire root will switch to client rendering."), t);
          return jb(e, t, g, a, x);
        } else if (g !== d) {
          var L = hc(new Error("This root received an early update, before anything was able hydrate. Switched the entire root to client rendering."), t);
          return jb(e, t, g, a, L);
        } else {
          Ek(t);
          var M = NC(t, null, g, a);
          t.child = M;
          for (var V = M; V; )
            V.flags = V.flags & ~on | Ma, V = V.sibling;
        }
      } else {
        if (id(), g === d)
          return Uo(e, t, a);
        Sa(e, t, g, a);
      }
      return t.child;
    }
    function jb(e, t, a, l, s) {
      return id(), CS(s), t.flags |= Tn, Sa(e, t, a, l), t.child;
    }
    function gO(e, t, a) {
      BC(t), e === null && wS(t);
      var l = t.type, s = t.pendingProps, d = e !== null ? e.memoizedProps : null, v = s.children, g = nS(l, s);
      return g ? v = null : d !== null && nS(l, d) && (t.flags |= Ht), Ab(e, t), Sa(e, t, v, a), t.child;
    }
    function SO(e, t) {
      return e === null && wS(t), null;
    }
    function EO(e, t, a, l) {
      og(e, t);
      var s = t.pendingProps, d = a, v = d._payload, g = d._init, E = g(v);
      t.type = E;
      var b = t.tag = SN(E), x = ll(E, s), L;
      switch (b) {
        case _:
          return F1(t, E), t.type = E = bd(E), L = z1(null, t, E, x, l), L;
        case A:
          return t.type = E = hE(E), L = Ub(null, t, E, x, l), L;
        case Se:
          return t.type = E = vE(E), L = Ob(null, t, E, x, l), L;
        case le: {
          if (t.type !== t.elementType) {
            var M = E.propTypes;
            M && tl(
              M,
              x,
              // Resolved for outer only
              "prop",
              Wt(E)
            );
          }
          return L = Mb(
            null,
            t,
            E,
            ll(E.type, x),
            // The inner type can have defaults too
            l
          ), L;
        }
      }
      var V = "";
      throw E !== null && typeof E == "object" && E.$$typeof === Ze && (V = " Did you wrap a component in React.lazy() more than once?"), new Error("Element type is invalid. Received a promise that resolves to: " + E + ". " + ("Lazy element type must resolve to a class or function." + V));
    }
    function wO(e, t, a, l, s) {
      og(e, t), t.tag = A;
      var d;
      return jl(a) ? (d = !0, yy(t)) : d = !1, ud(t, s), xb(t, a, l), R1(t, a, l, s), j1(null, t, a, !0, d, s);
    }
    function CO(e, t, a, l) {
      og(e, t);
      var s = t.pendingProps, d;
      {
        var v = td(t, a, !1);
        d = nd(t, v);
      }
      ud(t, l);
      var g, E;
      mu(t);
      {
        if (a.prototype && typeof a.prototype.render == "function") {
          var b = Wt(a) || "Unknown";
          M1[b] || (S("The <%s /> component appears to have a render method, but doesn't extend React.Component. This is likely to cause errors. Change %s to extend React.Component instead.", b, b), M1[b] = !0);
        }
        t.mode & Et && rl.recordLegacyContextWarning(t, null), ii(!0), Nh.current = t, g = hd(null, t, a, s, d, l), E = vd(), ii(!1);
      }
      if (Zr(), t.flags |= xl, typeof g == "object" && g !== null && typeof g.render == "function" && g.$$typeof === void 0) {
        var x = Wt(a) || "Unknown";
        Lh[x] || (S("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", x, x, x), Lh[x] = !0);
      }
      if (
        // Run these checks in production only if the flag is off.
        // Eventually we'll delete this branch altogether.
        typeof g == "object" && g !== null && typeof g.render == "function" && g.$$typeof === void 0
      ) {
        {
          var L = Wt(a) || "Unknown";
          Lh[L] || (S("The <%s /> component appears to be a function component that returns a class instance. Change %s to a class that extends React.Component instead. If you can't use a class try assigning the prototype on the function as a workaround. `%s.prototype = React.Component.prototype`. Don't use an arrow function since it cannot be called with `new` by React.", L, L, L), Lh[L] = !0);
        }
        t.tag = A, t.memoizedState = null, t.updateQueue = null;
        var M = !1;
        return jl(a) ? (M = !0, yy(t)) : M = !1, t.memoizedState = g.state !== null && g.state !== void 0 ? g.state : null, zS(t), bb(t, g), R1(t, a, s, l), j1(null, t, a, !0, M, l);
      } else {
        if (t.tag = _, t.mode & Et) {
          Hn(!0);
          try {
            g = hd(null, t, a, s, d, l), E = vd();
          } finally {
            Hn(!1);
          }
        }
        return Ur() && E && mS(t), Sa(null, t, g, l), F1(t, a), t.child;
      }
    }
    function F1(e, t) {
      {
        if (t && t.childContextTypes && S("%s(...): childContextTypes cannot be defined on a function component.", t.displayName || t.name || "Component"), e.ref !== null) {
          var a = "", l = Ra();
          l && (a += `

Check the render method of \`` + l + "`.");
          var s = l || "", d = e._debugSource;
          d && (s = d.fileName + ":" + d.lineNumber), A1[s] || (A1[s] = !0, S("Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?%s", a));
        }
        if (t.defaultProps !== void 0) {
          var v = Wt(t) || "Unknown";
          Ah[v] || (S("%s: Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.", v), Ah[v] = !0);
        }
        if (typeof t.getDerivedStateFromProps == "function") {
          var g = Wt(t) || "Unknown";
          L1[g] || (S("%s: Function components do not support getDerivedStateFromProps.", g), L1[g] = !0);
        }
        if (typeof t.contextType == "object" && t.contextType !== null) {
          var E = Wt(t) || "Unknown";
          N1[E] || (S("%s: Function components do not support contextType.", E), N1[E] = !0);
        }
      }
    }
    var H1 = {
      dehydrated: null,
      treeContext: null,
      retryLane: Yn
    };
    function Y1(e) {
      return {
        baseLanes: e,
        cachePool: dO(),
        transitions: null
      };
    }
    function bO(e, t) {
      var a = null;
      return {
        baseLanes: ct(e.baseLanes, t),
        cachePool: a,
        transitions: e.transitions
      };
    }
    function xO(e, t, a, l) {
      if (t !== null) {
        var s = t.memoizedState;
        if (s === null)
          return !1;
      }
      return PS(e, bh);
    }
    function TO(e, t) {
      return Is(e.childLanes, t);
    }
    function Fb(e, t, a) {
      var l = t.pendingProps;
      AN(t) && (t.flags |= nt);
      var s = al.current, d = !1, v = (t.flags & nt) !== Be;
      if (v || xO(s, e) ? (d = !0, t.flags &= ~nt) : (e === null || e.memoizedState !== null) && (s = Bk(s, WC)), s = cd(s), Ku(t, s), e === null) {
        wS(t);
        var g = t.memoizedState;
        if (g !== null) {
          var E = g.dehydrated;
          if (E !== null)
            return OO(t, E);
        }
        var b = l.children, x = l.fallback;
        if (d) {
          var L = _O(t, b, x, a), M = t.child;
          return M.memoizedState = Y1(a), t.memoizedState = H1, L;
        } else
          return P1(t, b);
      } else {
        var V = e.memoizedState;
        if (V !== null) {
          var I = V.dehydrated;
          if (I !== null)
            return MO(e, t, v, l, I, V, a);
        }
        if (d) {
          var $ = l.fallback, ge = l.children, We = DO(e, t, ge, $, a), He = t.child, Dt = e.child.memoizedState;
          return He.memoizedState = Dt === null ? Y1(a) : bO(Dt, a), He.childLanes = TO(e, a), t.memoizedState = H1, We;
        } else {
          var bt = l.children, F = RO(e, t, bt, a);
          return t.memoizedState = null, F;
        }
      }
    }
    function P1(e, t, a) {
      var l = e.mode, s = {
        mode: "visible",
        children: t
      }, d = V1(s, l);
      return d.return = e, e.child = d, d;
    }
    function _O(e, t, a, l) {
      var s = e.mode, d = e.child, v = {
        mode: "hidden",
        children: t
      }, g, E;
      return (s & Fe) === ze && d !== null ? (g = d, g.childLanes = K, g.pendingProps = v, e.mode & rt && (g.actualDuration = 0, g.actualStartTime = -1, g.selfBaseDuration = 0, g.treeBaseDuration = 0), E = is(a, s, l, null)) : (g = V1(v, s), E = is(a, s, l, null)), g.return = e, E.return = e, g.sibling = E, e.child = g, E;
    }
    function V1(e, t, a) {
      return Hx(e, t, K, null);
    }
    function Hb(e, t) {
      return Ec(e, t);
    }
    function RO(e, t, a, l) {
      var s = e.child, d = s.sibling, v = Hb(s, {
        mode: "visible",
        children: a
      });
      if ((t.mode & Fe) === ze && (v.lanes = l), v.return = t, v.sibling = null, d !== null) {
        var g = t.deletions;
        g === null ? (t.deletions = [d], t.flags |= jt) : g.push(d);
      }
      return t.child = v, v;
    }
    function DO(e, t, a, l, s) {
      var d = t.mode, v = e.child, g = v.sibling, E = {
        mode: "hidden",
        children: a
      }, b;
      if (
        // In legacy mode, we commit the primary tree as if it successfully
        // completed, even though it's in an inconsistent state.
        (d & Fe) === ze && // Make sure we're on the second pass, i.e. the primary child fragment was
        // already cloned. In legacy mode, the only case where this isn't true is
        // when DevTools forces us to display a fallback; we skip the first render
        // pass entirely and go straight to rendering the fallback. (In Concurrent
        // Mode, SuspenseList can also trigger this scenario, but this is a legacy-
        // only codepath.)
        t.child !== v
      ) {
        var x = t.child;
        b = x, b.childLanes = K, b.pendingProps = E, t.mode & rt && (b.actualDuration = 0, b.actualStartTime = -1, b.selfBaseDuration = v.selfBaseDuration, b.treeBaseDuration = v.treeBaseDuration), t.deletions = null;
      } else
        b = Hb(v, E), b.subtreeFlags = v.subtreeFlags & dr;
      var L;
      return g !== null ? L = Ec(g, l) : (L = is(l, d, s, null), L.flags |= on), L.return = t, b.return = t, b.sibling = L, t.child = b, L;
    }
    function lg(e, t, a, l) {
      l !== null && CS(l), ld(t, e.child, null, a);
      var s = t.pendingProps, d = s.children, v = P1(t, d);
      return v.flags |= on, t.memoizedState = null, v;
    }
    function kO(e, t, a, l, s) {
      var d = t.mode, v = {
        mode: "visible",
        children: a
      }, g = V1(v, d), E = is(l, d, s, null);
      return E.flags |= on, g.return = t, E.return = t, g.sibling = E, t.child = g, (t.mode & Fe) !== ze && ld(t, e.child, null, s), E;
    }
    function OO(e, t, a) {
      return (e.mode & Fe) === ze ? (S("Cannot hydrate Suspense in legacy mode. Switch from ReactDOM.hydrate(element, container) to ReactDOMClient.hydrateRoot(container, <App />).render(element) or remove the Suspense components from the server rendered components."), e.lanes = Ve) : lS(t) ? e.lanes = Xi : e.lanes = Or, null;
    }
    function MO(e, t, a, l, s, d, v) {
      if (a)
        if (t.flags & Tn) {
          t.flags &= ~Tn;
          var F = D1(new Error("There was an error while hydrating this Suspense boundary. Switched to client rendering."));
          return lg(e, t, v, F);
        } else {
          if (t.memoizedState !== null)
            return t.child = e.child, t.flags |= nt, null;
          var G = l.children, H = l.fallback, re = kO(e, t, G, H, v), _e = t.child;
          return _e.memoizedState = Y1(v), t.memoizedState = H1, re;
        }
      else {
        if (gk(), (t.mode & Fe) === ze)
          return lg(
            e,
            t,
            v,
            // TODO: When we delete legacy mode, we should make this error argument
            // required — every concurrent mode path that causes hydration to
            // de-opt to client rendering should have an error message.
            null
          );
        if (lS(s)) {
          var g, E, b;
          {
            var x = UD(s);
            g = x.digest, E = x.message, b = x.stack;
          }
          var L;
          E ? L = new Error(E) : L = new Error("The server could not finish this Suspense boundary, likely due to an error during server rendering. Switched to client rendering.");
          var M = D1(L, g, b);
          return lg(e, t, v, M);
        }
        var V = ta(v, e.childLanes);
        if (ol || V) {
          var I = yg();
          if (I !== null) {
            var $ = Nm(I, v);
            if ($ !== Yn && $ !== d.retryLane) {
              d.retryLane = $;
              var ge = nn;
              Ba(e, $), Cr(I, e, $, ge);
            }
          }
          sE();
          var We = D1(new Error("This Suspense boundary received an update before it finished hydrating. This caused the boundary to switch to client rendering. The usual way to fix this is to wrap the original update in startTransition."));
          return lg(e, t, v, We);
        } else if (uC(s)) {
          t.flags |= nt, t.child = e.child;
          var He = nN.bind(null, e);
          return zD(s, He), null;
        } else {
          wk(t, s, d.treeContext);
          var Dt = l.children, bt = P1(t, Dt);
          return bt.flags |= Ma, bt;
        }
      }
    }
    function Yb(e, t, a) {
      e.lanes = ct(e.lanes, t);
      var l = e.alternate;
      l !== null && (l.lanes = ct(l.lanes, t)), NS(e.return, t, a);
    }
    function NO(e, t, a) {
      for (var l = t; l !== null; ) {
        if (l.tag === be) {
          var s = l.memoizedState;
          s !== null && Yb(l, a, e);
        } else if (l.tag === Ke)
          Yb(l, a, e);
        else if (l.child !== null) {
          l.child.return = l, l = l.child;
          continue;
        }
        if (l === e)
          return;
        for (; l.sibling === null; ) {
          if (l.return === null || l.return === e)
            return;
          l = l.return;
        }
        l.sibling.return = l.return, l = l.sibling;
      }
    }
    function LO(e) {
      for (var t = e, a = null; t !== null; ) {
        var l = t.alternate;
        l !== null && Fy(l) === null && (a = t), t = t.sibling;
      }
      return a;
    }
    function AO(e) {
      if (e !== void 0 && e !== "forwards" && e !== "backwards" && e !== "together" && !U1[e])
        if (U1[e] = !0, typeof e == "string")
          switch (e.toLowerCase()) {
            case "together":
            case "forwards":
            case "backwards": {
              S('"%s" is not a valid value for revealOrder on <SuspenseList />. Use lowercase "%s" instead.', e, e.toLowerCase());
              break;
            }
            case "forward":
            case "backward": {
              S('"%s" is not a valid value for revealOrder on <SuspenseList />. React uses the -s suffix in the spelling. Use "%ss" instead.', e, e.toLowerCase());
              break;
            }
            default:
              S('"%s" is not a supported revealOrder on <SuspenseList />. Did you mean "together", "forwards" or "backwards"?', e);
              break;
          }
        else
          S('%s is not a supported value for revealOrder on <SuspenseList />. Did you mean "together", "forwards" or "backwards"?', e);
    }
    function UO(e, t) {
      e !== void 0 && !ig[e] && (e !== "collapsed" && e !== "hidden" ? (ig[e] = !0, S('"%s" is not a supported value for tail on <SuspenseList />. Did you mean "collapsed" or "hidden"?', e)) : t !== "forwards" && t !== "backwards" && (ig[e] = !0, S('<SuspenseList tail="%s" /> is only valid if revealOrder is "forwards" or "backwards". Did you mean to specify revealOrder="forwards"?', e)));
    }
    function Pb(e, t) {
      {
        var a = ar(e), l = !a && typeof fa(e) == "function";
        if (a || l) {
          var s = a ? "array" : "iterable";
          return S("A nested %s was passed to row #%s in <SuspenseList />. Wrap it in an additional SuspenseList to configure its revealOrder: <SuspenseList revealOrder=...> ... <SuspenseList revealOrder=...>{%s}</SuspenseList> ... </SuspenseList>", s, t, s), !1;
        }
      }
      return !0;
    }
    function zO(e, t) {
      if ((t === "forwards" || t === "backwards") && e !== void 0 && e !== null && e !== !1)
        if (ar(e)) {
          for (var a = 0; a < e.length; a++)
            if (!Pb(e[a], a))
              return;
        } else {
          var l = fa(e);
          if (typeof l == "function") {
            var s = l.call(e);
            if (s)
              for (var d = s.next(), v = 0; !d.done; d = s.next()) {
                if (!Pb(d.value, v))
                  return;
                v++;
              }
          } else
            S('A single row was passed to a <SuspenseList revealOrder="%s" />. This is not useful since it needs multiple rows. Did you mean to pass multiple children or an array?', t);
        }
    }
    function B1(e, t, a, l, s) {
      var d = e.memoizedState;
      d === null ? e.memoizedState = {
        isBackwards: t,
        rendering: null,
        renderingStartTime: 0,
        last: l,
        tail: a,
        tailMode: s
      } : (d.isBackwards = t, d.rendering = null, d.renderingStartTime = 0, d.last = l, d.tail = a, d.tailMode = s);
    }
    function Vb(e, t, a) {
      var l = t.pendingProps, s = l.revealOrder, d = l.tail, v = l.children;
      AO(s), UO(d, s), zO(v, s), Sa(e, t, v, a);
      var g = al.current, E = PS(g, bh);
      if (E)
        g = VS(g, bh), t.flags |= nt;
      else {
        var b = e !== null && (e.flags & nt) !== Be;
        b && NO(t, t.child, a), g = cd(g);
      }
      if (Ku(t, g), (t.mode & Fe) === ze)
        t.memoizedState = null;
      else
        switch (s) {
          case "forwards": {
            var x = LO(t.child), L;
            x === null ? (L = t.child, t.child = null) : (L = x.sibling, x.sibling = null), B1(
              t,
              !1,
              // isBackwards
              L,
              x,
              d
            );
            break;
          }
          case "backwards": {
            var M = null, V = t.child;
            for (t.child = null; V !== null; ) {
              var I = V.alternate;
              if (I !== null && Fy(I) === null) {
                t.child = V;
                break;
              }
              var $ = V.sibling;
              V.sibling = M, M = V, V = $;
            }
            B1(
              t,
              !0,
              // isBackwards
              M,
              null,
              // last
              d
            );
            break;
          }
          case "together": {
            B1(
              t,
              !1,
              // isBackwards
              null,
              // tail
              null,
              // last
              void 0
            );
            break;
          }
          default:
            t.memoizedState = null;
        }
      return t.child;
    }
    function jO(e, t, a) {
      FS(t, t.stateNode.containerInfo);
      var l = t.pendingProps;
      return e === null ? t.child = ld(t, null, l, a) : Sa(e, t, l, a), t.child;
    }
    var Bb = !1;
    function FO(e, t, a) {
      var l = t.type, s = l._context, d = t.pendingProps, v = t.memoizedProps, g = d.value;
      {
        "value" in d || Bb || (Bb = !0, S("The `value` prop is required for the `<Context.Provider>`. Did you misspell it or forget to pass it?"));
        var E = t.type.propTypes;
        E && tl(E, d, "prop", "Context.Provider");
      }
      if (UC(t, s, g), v !== null) {
        var b = v.value;
        if (Le(b, g)) {
          if (v.children === d.children && !vy())
            return Uo(e, t, a);
        } else
          Ak(t, s, a);
      }
      var x = d.children;
      return Sa(e, t, x, a), t.child;
    }
    var Ib = !1;
    function HO(e, t, a) {
      var l = t.type;
      l._context === void 0 ? l !== l.Consumer && (Ib || (Ib = !0, S("Rendering <Context> directly is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?"))) : l = l._context;
      var s = t.pendingProps, d = s.children;
      typeof d != "function" && S("A context consumer was rendered with multiple children, or a child that isn't a function. A context consumer expects a single child that is a function. If you did pass a function, make sure there is no trailing or leading whitespace around it."), ud(t, a);
      var v = cr(l);
      mu(t);
      var g;
      return Nh.current = t, ii(!0), g = d(v), ii(!1), Zr(), t.flags |= xl, Sa(e, t, g, a), t.child;
    }
    function Uh() {
      ol = !0;
    }
    function og(e, t) {
      (t.mode & Fe) === ze && e !== null && (e.alternate = null, t.alternate = null, t.flags |= on);
    }
    function Uo(e, t, a) {
      return e !== null && (t.dependencies = e.dependencies), Sb(), Gh(t.lanes), ta(a, t.childLanes) ? (Nk(e, t), t.child) : null;
    }
    function YO(e, t, a) {
      {
        var l = t.return;
        if (l === null)
          throw new Error("Cannot swap the root fiber.");
        if (e.alternate = null, t.alternate = null, a.index = t.index, a.sibling = t.sibling, a.return = t.return, a.ref = t.ref, t === l.child)
          l.child = a;
        else {
          var s = l.child;
          if (s === null)
            throw new Error("Expected parent to have a child.");
          for (; s.sibling !== t; )
            if (s = s.sibling, s === null)
              throw new Error("Expected to find the previous sibling.");
          s.sibling = a;
        }
        var d = l.deletions;
        return d === null ? (l.deletions = [e], l.flags |= jt) : d.push(e), a.flags |= on, a;
      }
    }
    function I1(e, t) {
      var a = e.lanes;
      return !!ta(a, t);
    }
    function PO(e, t, a) {
      switch (t.tag) {
        case W:
          zb(t), t.stateNode, id();
          break;
        case Q:
          BC(t);
          break;
        case A: {
          var l = t.type;
          jl(l) && yy(t);
          break;
        }
        case X:
          FS(t, t.stateNode.containerInfo);
          break;
        case ve: {
          var s = t.memoizedProps.value, d = t.type._context;
          UC(t, d, s);
          break;
        }
        case O:
          {
            var v = ta(a, t.childLanes);
            v && (t.flags |= dt);
            {
              var g = t.stateNode;
              g.effectDuration = 0, g.passiveEffectDuration = 0;
            }
          }
          break;
        case be: {
          var E = t.memoizedState;
          if (E !== null) {
            if (E.dehydrated !== null)
              return Ku(t, cd(al.current)), t.flags |= nt, null;
            var b = t.child, x = b.childLanes;
            if (ta(a, x))
              return Fb(e, t, a);
            Ku(t, cd(al.current));
            var L = Uo(e, t, a);
            return L !== null ? L.sibling : null;
          } else
            Ku(t, cd(al.current));
          break;
        }
        case Ke: {
          var M = (e.flags & nt) !== Be, V = ta(a, t.childLanes);
          if (M) {
            if (V)
              return Vb(e, t, a);
            t.flags |= nt;
          }
          var I = t.memoizedState;
          if (I !== null && (I.rendering = null, I.tail = null, I.lastEffect = null), Ku(t, al.current), V)
            break;
          return null;
        }
        case Ee:
        case Ge:
          return t.lanes = K, Lb(e, t, a);
      }
      return Uo(e, t, a);
    }
    function Wb(e, t, a) {
      if (t._debugNeedsRemount && e !== null)
        return YO(e, t, EE(t.type, t.key, t.pendingProps, t._debugOwner || null, t.mode, t.lanes));
      if (e !== null) {
        var l = e.memoizedProps, s = t.pendingProps;
        if (l !== s || vy() || // Force a re-render if the implementation changed due to hot reload:
        t.type !== e.type)
          ol = !0;
        else {
          var d = I1(e, a);
          if (!d && // If this is the second pass of an error or suspense boundary, there
          // may not be work scheduled on `current`, so we check for this flag.
          (t.flags & nt) === Be)
            return ol = !1, PO(e, t, a);
          (e.flags & As) !== Be ? ol = !0 : ol = !1;
        }
      } else if (ol = !1, Ur() && dk(t)) {
        var v = t.index, g = pk();
        SC(t, g, v);
      }
      switch (t.lanes = K, t.tag) {
        case U:
          return CO(e, t, t.type, a);
        case ht: {
          var E = t.elementType;
          return EO(e, t, E, a);
        }
        case _: {
          var b = t.type, x = t.pendingProps, L = t.elementType === b ? x : ll(b, x);
          return z1(e, t, b, L, a);
        }
        case A: {
          var M = t.type, V = t.pendingProps, I = t.elementType === M ? V : ll(M, V);
          return Ub(e, t, M, I, a);
        }
        case W:
          return yO(e, t, a);
        case Q:
          return gO(e, t, a);
        case oe:
          return SO(e, t);
        case be:
          return Fb(e, t, a);
        case X:
          return jO(e, t, a);
        case Se: {
          var $ = t.type, ge = t.pendingProps, We = t.elementType === $ ? ge : ll($, ge);
          return Ob(e, t, $, We, a);
        }
        case we:
          return hO(e, t, a);
        case ce:
          return vO(e, t, a);
        case O:
          return mO(e, t, a);
        case ve:
          return FO(e, t, a);
        case Me:
          return HO(e, t, a);
        case le: {
          var He = t.type, Dt = t.pendingProps, bt = ll(He, Dt);
          if (t.type !== t.elementType) {
            var F = He.propTypes;
            F && tl(
              F,
              bt,
              // Resolved for outer only
              "prop",
              Wt(He)
            );
          }
          return bt = ll(He.type, bt), Mb(e, t, He, bt, a);
        }
        case ye:
          return Nb(e, t, t.type, t.pendingProps, a);
        case yt: {
          var G = t.type, H = t.pendingProps, re = t.elementType === G ? H : ll(G, H);
          return wO(e, t, G, re, a);
        }
        case Ke:
          return Vb(e, t, a);
        case ft:
          break;
        case Ee:
          return Lb(e, t, a);
      }
      throw new Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
    }
    function md(e) {
      e.flags |= dt;
    }
    function $b(e) {
      e.flags |= Gr, e.flags |= wp;
    }
    var Gb, W1, Qb, qb;
    Gb = function(e, t, a, l) {
      for (var s = t.child; s !== null; ) {
        if (s.tag === Q || s.tag === oe)
          sD(e, s.stateNode);
        else if (s.tag !== X) {
          if (s.child !== null) {
            s.child.return = s, s = s.child;
            continue;
          }
        }
        if (s === t)
          return;
        for (; s.sibling === null; ) {
          if (s.return === null || s.return === t)
            return;
          s = s.return;
        }
        s.sibling.return = s.return, s = s.sibling;
      }
    }, W1 = function(e, t) {
    }, Qb = function(e, t, a, l, s) {
      var d = e.memoizedProps;
      if (d !== l) {
        var v = t.stateNode, g = HS(), E = fD(v, a, d, l, s, g);
        t.updateQueue = E, E && md(t);
      }
    }, qb = function(e, t, a, l) {
      a !== l && md(t);
    };
    function zh(e, t) {
      if (!Ur())
        switch (e.tailMode) {
          case "hidden": {
            for (var a = e.tail, l = null; a !== null; )
              a.alternate !== null && (l = a), a = a.sibling;
            l === null ? e.tail = null : l.sibling = null;
            break;
          }
          case "collapsed": {
            for (var s = e.tail, d = null; s !== null; )
              s.alternate !== null && (d = s), s = s.sibling;
            d === null ? !t && e.tail !== null ? e.tail.sibling = null : e.tail = null : d.sibling = null;
            break;
          }
        }
    }
    function jr(e) {
      var t = e.alternate !== null && e.alternate.child === e.child, a = K, l = Be;
      if (t) {
        if ((e.mode & rt) !== ze) {
          for (var E = e.selfBaseDuration, b = e.child; b !== null; )
            a = ct(a, ct(b.lanes, b.childLanes)), l |= b.subtreeFlags & dr, l |= b.flags & dr, E += b.treeBaseDuration, b = b.sibling;
          e.treeBaseDuration = E;
        } else
          for (var x = e.child; x !== null; )
            a = ct(a, ct(x.lanes, x.childLanes)), l |= x.subtreeFlags & dr, l |= x.flags & dr, x.return = e, x = x.sibling;
        e.subtreeFlags |= l;
      } else {
        if ((e.mode & rt) !== ze) {
          for (var s = e.actualDuration, d = e.selfBaseDuration, v = e.child; v !== null; )
            a = ct(a, ct(v.lanes, v.childLanes)), l |= v.subtreeFlags, l |= v.flags, s += v.actualDuration, d += v.treeBaseDuration, v = v.sibling;
          e.actualDuration = s, e.treeBaseDuration = d;
        } else
          for (var g = e.child; g !== null; )
            a = ct(a, ct(g.lanes, g.childLanes)), l |= g.subtreeFlags, l |= g.flags, g.return = e, g = g.sibling;
        e.subtreeFlags |= l;
      }
      return e.childLanes = a, t;
    }
    function VO(e, t, a) {
      if (_k() && (t.mode & Fe) !== ze && (t.flags & nt) === Be)
        return _C(t), id(), t.flags |= Tn | pa | lr, !1;
      var l = Cy(t);
      if (a !== null && a.dehydrated !== null)
        if (e === null) {
          if (!l)
            throw new Error("A dehydrated suspense component was completed without a hydrated node. This is probably a bug in React.");
          if (xk(t), jr(t), (t.mode & rt) !== ze) {
            var s = a !== null;
            if (s) {
              var d = t.child;
              d !== null && (t.treeBaseDuration -= d.treeBaseDuration);
            }
          }
          return !1;
        } else {
          if (id(), (t.flags & nt) === Be && (t.memoizedState = null), t.flags |= dt, jr(t), (t.mode & rt) !== ze) {
            var v = a !== null;
            if (v) {
              var g = t.child;
              g !== null && (t.treeBaseDuration -= g.treeBaseDuration);
            }
          }
          return !1;
        }
      else
        return RC(), !0;
    }
    function Xb(e, t, a) {
      var l = t.pendingProps;
      switch (yS(t), t.tag) {
        case U:
        case ht:
        case ye:
        case _:
        case Se:
        case we:
        case ce:
        case O:
        case Me:
        case le:
          return jr(t), null;
        case A: {
          var s = t.type;
          return jl(s) && my(t), jr(t), null;
        }
        case W: {
          var d = t.stateNode;
          if (sd(t), pS(t), IS(), d.pendingContext && (d.context = d.pendingContext, d.pendingContext = null), e === null || e.child === null) {
            var v = Cy(t);
            if (v)
              md(t);
            else if (e !== null) {
              var g = e.memoizedState;
              // Check if this is a client root
              (!g.isDehydrated || // Check if we reverted to client rendering (e.g. due to an error)
              (t.flags & Tn) !== Be) && (t.flags |= Oa, RC());
            }
          }
          return W1(e, t), jr(t), null;
        }
        case Q: {
          YS(t);
          var E = VC(), b = t.type;
          if (e !== null && t.stateNode != null)
            Qb(e, t, b, l, E), e.ref !== t.ref && $b(t);
          else {
            if (!l) {
              if (t.stateNode === null)
                throw new Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
              return jr(t), null;
            }
            var x = HS(), L = Cy(t);
            if (L)
              Ck(t, E, x) && md(t);
            else {
              var M = uD(b, l, E, x, t);
              Gb(M, t, !1, !1), t.stateNode = M, cD(M, b, l, E) && md(t);
            }
            t.ref !== null && $b(t);
          }
          return jr(t), null;
        }
        case oe: {
          var V = l;
          if (e && t.stateNode != null) {
            var I = e.memoizedProps;
            qb(e, t, I, V);
          } else {
            if (typeof V != "string" && t.stateNode === null)
              throw new Error("We must have new props for new mounts. This error is likely caused by a bug in React. Please file an issue.");
            var $ = VC(), ge = HS(), We = Cy(t);
            We ? bk(t) && md(t) : t.stateNode = dD(V, $, ge, t);
          }
          return jr(t), null;
        }
        case be: {
          fd(t);
          var He = t.memoizedState;
          if (e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
            var Dt = VO(e, t, He);
            if (!Dt)
              return t.flags & lr ? t : null;
          }
          if ((t.flags & nt) !== Be)
            return t.lanes = a, (t.mode & rt) !== ze && v1(t), t;
          var bt = He !== null, F = e !== null && e.memoizedState !== null;
          if (bt !== F && bt) {
            var G = t.child;
            if (G.flags |= Tl, (t.mode & Fe) !== ze) {
              var H = e === null && (t.memoizedProps.unstable_avoidThisFallback !== !0 || !ot);
              H || PS(al.current, WC) ? BM() : sE();
            }
          }
          var re = t.updateQueue;
          if (re !== null && (t.flags |= dt), jr(t), (t.mode & rt) !== ze && bt) {
            var _e = t.child;
            _e !== null && (t.treeBaseDuration -= _e.treeBaseDuration);
          }
          return null;
        }
        case X:
          return sd(t), W1(e, t), e === null && ik(t.stateNode.containerInfo), jr(t), null;
        case ve:
          var Ce = t.type._context;
          return MS(Ce, t), jr(t), null;
        case yt: {
          var et = t.type;
          return jl(et) && my(t), jr(t), null;
        }
        case Ke: {
          fd(t);
          var lt = t.memoizedState;
          if (lt === null)
            return jr(t), null;
          var Xt = (t.flags & nt) !== Be, Lt = lt.rendering;
          if (Lt === null)
            if (Xt)
              zh(lt, !1);
            else {
              var Zn = WM() && (e === null || (e.flags & nt) === Be);
              if (!Zn)
                for (var At = t.child; At !== null; ) {
                  var Pn = Fy(At);
                  if (Pn !== null) {
                    Xt = !0, t.flags |= nt, zh(lt, !1);
                    var la = Pn.updateQueue;
                    return la !== null && (t.updateQueue = la, t.flags |= dt), t.subtreeFlags = Be, Lk(t, a), Ku(t, VS(al.current, bh)), t.child;
                  }
                  At = At.sibling;
                }
              lt.tail !== null && Sn() > yx() && (t.flags |= nt, Xt = !0, zh(lt, !1), t.lanes = wm);
            }
          else {
            if (!Xt) {
              var Vr = Fy(Lt);
              if (Vr !== null) {
                t.flags |= nt, Xt = !0;
                var di = Vr.updateQueue;
                if (di !== null && (t.updateQueue = di, t.flags |= dt), zh(lt, !0), lt.tail === null && lt.tailMode === "hidden" && !Lt.alternate && !Ur())
                  return jr(t), null;
              } else // The time it took to render last row is greater than the remaining
              // time we have to render. So rendering one more row would likely
              // exceed it.
              Sn() * 2 - lt.renderingStartTime > yx() && a !== Or && (t.flags |= nt, Xt = !0, zh(lt, !1), t.lanes = wm);
            }
            if (lt.isBackwards)
              Lt.sibling = t.child, t.child = Lt;
            else {
              var Ca = lt.last;
              Ca !== null ? Ca.sibling = Lt : t.child = Lt, lt.last = Lt;
            }
          }
          if (lt.tail !== null) {
            var ba = lt.tail;
            lt.rendering = ba, lt.tail = ba.sibling, lt.renderingStartTime = Sn(), ba.sibling = null;
            var oa = al.current;
            return Xt ? oa = VS(oa, bh) : oa = cd(oa), Ku(t, oa), ba;
          }
          return jr(t), null;
        }
        case ft:
          break;
        case Ee:
        case Ge: {
          uE(t);
          var Yo = t.memoizedState, xd = Yo !== null;
          if (e !== null) {
            var Zh = e.memoizedState, Wl = Zh !== null;
            Wl !== xd && // LegacyHidden doesn't do any hiding — it only pre-renders.
            !se && (t.flags |= Tl);
          }
          return !xd || (t.mode & Fe) === ze ? jr(t) : ta(Il, Or) && (jr(t), t.subtreeFlags & (on | dt) && (t.flags |= Tl)), null;
        }
        case xt:
          return null;
        case it:
          return null;
      }
      throw new Error("Unknown unit of work tag (" + t.tag + "). This error is likely caused by a bug in React. Please file an issue.");
    }
    function BO(e, t, a) {
      switch (yS(t), t.tag) {
        case A: {
          var l = t.type;
          jl(l) && my(t);
          var s = t.flags;
          return s & lr ? (t.flags = s & ~lr | nt, (t.mode & rt) !== ze && v1(t), t) : null;
        }
        case W: {
          t.stateNode, sd(t), pS(t), IS();
          var d = t.flags;
          return (d & lr) !== Be && (d & nt) === Be ? (t.flags = d & ~lr | nt, t) : null;
        }
        case Q:
          return YS(t), null;
        case be: {
          fd(t);
          var v = t.memoizedState;
          if (v !== null && v.dehydrated !== null) {
            if (t.alternate === null)
              throw new Error("Threw in newly mounted dehydrated component. This is likely a bug in React. Please file an issue.");
            id();
          }
          var g = t.flags;
          return g & lr ? (t.flags = g & ~lr | nt, (t.mode & rt) !== ze && v1(t), t) : null;
        }
        case Ke:
          return fd(t), null;
        case X:
          return sd(t), null;
        case ve:
          var E = t.type._context;
          return MS(E, t), null;
        case Ee:
        case Ge:
          return uE(t), null;
        case xt:
          return null;
        default:
          return null;
      }
    }
    function Kb(e, t, a) {
      switch (yS(t), t.tag) {
        case A: {
          var l = t.type.childContextTypes;
          l != null && my(t);
          break;
        }
        case W: {
          t.stateNode, sd(t), pS(t), IS();
          break;
        }
        case Q: {
          YS(t);
          break;
        }
        case X:
          sd(t);
          break;
        case be:
          fd(t);
          break;
        case Ke:
          fd(t);
          break;
        case ve:
          var s = t.type._context;
          MS(s, t);
          break;
        case Ee:
        case Ge:
          uE(t);
          break;
      }
    }
    var Zb = null;
    Zb = /* @__PURE__ */ new Set();
    var ug = !1, Fr = !1, IO = typeof WeakSet == "function" ? WeakSet : Set, Ae = null, yd = null, gd = null;
    function WO(e) {
      co(null, function() {
        throw e;
      }), Sp();
    }
    var $O = function(e, t) {
      if (t.props = e.memoizedProps, t.state = e.memoizedState, e.mode & rt)
        try {
          Vl(), t.componentWillUnmount();
        } finally {
          Pl(e);
        }
      else
        t.componentWillUnmount();
    };
    function Jb(e, t) {
      try {
        es(mr, e);
      } catch (a) {
        cn(e, t, a);
      }
    }
    function $1(e, t, a) {
      try {
        $O(e, a);
      } catch (l) {
        cn(e, t, l);
      }
    }
    function GO(e, t, a) {
      try {
        a.componentDidMount();
      } catch (l) {
        cn(e, t, l);
      }
    }
    function ex(e, t) {
      try {
        nx(e);
      } catch (a) {
        cn(e, t, a);
      }
    }
    function Sd(e, t) {
      var a = e.ref;
      if (a !== null)
        if (typeof a == "function") {
          var l;
          try {
            if (zt && On && e.mode & rt)
              try {
                Vl(), l = a(null);
              } finally {
                Pl(e);
              }
            else
              l = a(null);
          } catch (s) {
            cn(e, t, s);
          }
          typeof l == "function" && S("Unexpected return value from a callback ref in %s. A callback ref should not return a function.", st(e));
        } else
          a.current = null;
    }
    function sg(e, t, a) {
      try {
        a();
      } catch (l) {
        cn(e, t, l);
      }
    }
    var tx = !1;
    function QO(e, t) {
      lD(e.containerInfo), Ae = t, qO();
      var a = tx;
      return tx = !1, a;
    }
    function qO() {
      for (; Ae !== null; ) {
        var e = Ae, t = e.child;
        (e.subtreeFlags & pu) !== Be && t !== null ? (t.return = e, Ae = t) : XO();
      }
    }
    function XO() {
      for (; Ae !== null; ) {
        var e = Ae;
        Qt(e);
        try {
          KO(e);
        } catch (a) {
          cn(e, e.return, a);
        }
        $n();
        var t = e.sibling;
        if (t !== null) {
          t.return = e.return, Ae = t;
          return;
        }
        Ae = e.return;
      }
    }
    function KO(e) {
      var t = e.alternate, a = e.flags;
      if ((a & Oa) !== Be) {
        switch (Qt(e), e.tag) {
          case _:
          case Se:
          case ye:
            break;
          case A: {
            if (t !== null) {
              var l = t.memoizedProps, s = t.memoizedState, d = e.stateNode;
              e.type === e.elementType && !vc && (d.props !== e.memoizedProps && S("Expected %s props to match memoized props before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", st(e) || "instance"), d.state !== e.memoizedState && S("Expected %s state to match memoized state before getSnapshotBeforeUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", st(e) || "instance"));
              var v = d.getSnapshotBeforeUpdate(e.elementType === e.type ? l : ll(e.type, l), s);
              {
                var g = Zb;
                v === void 0 && !g.has(e.type) && (g.add(e.type), S("%s.getSnapshotBeforeUpdate(): A snapshot value (or null) must be returned. You have returned undefined.", st(e)));
              }
              d.__reactInternalSnapshotBeforeUpdate = v;
            }
            break;
          }
          case W: {
            {
              var E = e.stateNode;
              MD(E.containerInfo);
            }
            break;
          }
          case Q:
          case oe:
          case X:
          case yt:
            break;
          default:
            throw new Error("This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
        }
        $n();
      }
    }
    function ul(e, t, a) {
      var l = t.updateQueue, s = l !== null ? l.lastEffect : null;
      if (s !== null) {
        var d = s.next, v = d;
        do {
          if ((v.tag & e) === e) {
            var g = v.destroy;
            v.destroy = void 0, g !== void 0 && ((e & zr) !== Ia ? gm(t) : (e & mr) !== Ia && si(t), (e & Fl) !== Ia && qh(!0), sg(t, a, g), (e & Fl) !== Ia && qh(!1), (e & zr) !== Ia ? af() : (e & mr) !== Ia && yu());
          }
          v = v.next;
        } while (v !== d);
      }
    }
    function es(e, t) {
      var a = t.updateQueue, l = a !== null ? a.lastEffect : null;
      if (l !== null) {
        var s = l.next, d = s;
        do {
          if ((d.tag & e) === e) {
            (e & zr) !== Ia ? Dl(t) : (e & mr) !== Ia && Sm(t);
            var v = d.create;
            (e & Fl) !== Ia && qh(!0), d.destroy = v(), (e & Fl) !== Ia && qh(!1), (e & zr) !== Ia ? rf() : (e & mr) !== Ia && Us();
            {
              var g = d.destroy;
              if (g !== void 0 && typeof g != "function") {
                var E = void 0;
                (d.tag & mr) !== Be ? E = "useLayoutEffect" : (d.tag & Fl) !== Be ? E = "useInsertionEffect" : E = "useEffect";
                var b = void 0;
                g === null ? b = " You returned null. If your effect does not require clean up, return undefined (or nothing)." : typeof g.then == "function" ? b = `

It looks like you wrote ` + E + `(async () => ...) or returned a Promise. Instead, write the async function inside your effect and call it immediately:

` + E + `(() => {
  async function fetchData() {
    // You can await here
    const response = await MyAPI.getData(someId);
    // ...
  }
  fetchData();
}, [someId]); // Or [] if effect doesn't need props or state

Learn more about data fetching with Hooks: https://reactjs.org/link/hooks-data-fetching` : b = " You returned: " + g, S("%s must not return anything besides a function, which is used for clean-up.%s", E, b);
              }
            }
          }
          d = d.next;
        } while (d !== s);
      }
    }
    function ZO(e, t) {
      if ((t.flags & dt) !== Be)
        switch (t.tag) {
          case O: {
            var a = t.stateNode.passiveEffectDuration, l = t.memoizedProps, s = l.id, d = l.onPostCommit, v = yb(), g = t.alternate === null ? "mount" : "update";
            mb() && (g = "nested-update"), typeof d == "function" && d(s, g, a, v);
            var E = t.return;
            e: for (; E !== null; ) {
              switch (E.tag) {
                case W:
                  var b = E.stateNode;
                  b.passiveEffectDuration += a;
                  break e;
                case O:
                  var x = E.stateNode;
                  x.passiveEffectDuration += a;
                  break e;
              }
              E = E.return;
            }
            break;
          }
        }
    }
    function JO(e, t, a, l) {
      if ((a.flags & Dr) !== Be)
        switch (a.tag) {
          case _:
          case Se:
          case ye: {
            if (!Fr)
              if (a.mode & rt)
                try {
                  Vl(), es(mr | vr, a);
                } finally {
                  Pl(a);
                }
              else
                es(mr | vr, a);
            break;
          }
          case A: {
            var s = a.stateNode;
            if (a.flags & dt && !Fr)
              if (t === null)
                if (a.type === a.elementType && !vc && (s.props !== a.memoizedProps && S("Expected %s props to match memoized props before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", st(a) || "instance"), s.state !== a.memoizedState && S("Expected %s state to match memoized state before componentDidMount. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", st(a) || "instance")), a.mode & rt)
                  try {
                    Vl(), s.componentDidMount();
                  } finally {
                    Pl(a);
                  }
                else
                  s.componentDidMount();
              else {
                var d = a.elementType === a.type ? t.memoizedProps : ll(a.type, t.memoizedProps), v = t.memoizedState;
                if (a.type === a.elementType && !vc && (s.props !== a.memoizedProps && S("Expected %s props to match memoized props before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", st(a) || "instance"), s.state !== a.memoizedState && S("Expected %s state to match memoized state before componentDidUpdate. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", st(a) || "instance")), a.mode & rt)
                  try {
                    Vl(), s.componentDidUpdate(d, v, s.__reactInternalSnapshotBeforeUpdate);
                  } finally {
                    Pl(a);
                  }
                else
                  s.componentDidUpdate(d, v, s.__reactInternalSnapshotBeforeUpdate);
              }
            var g = a.updateQueue;
            g !== null && (a.type === a.elementType && !vc && (s.props !== a.memoizedProps && S("Expected %s props to match memoized props before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.props`. Please file an issue.", st(a) || "instance"), s.state !== a.memoizedState && S("Expected %s state to match memoized state before processing the update queue. This might either be because of a bug in React, or because a component reassigns its own `this.state`. Please file an issue.", st(a) || "instance")), PC(a, g, s));
            break;
          }
          case W: {
            var E = a.updateQueue;
            if (E !== null) {
              var b = null;
              if (a.child !== null)
                switch (a.child.tag) {
                  case Q:
                    b = a.child.stateNode;
                    break;
                  case A:
                    b = a.child.stateNode;
                    break;
                }
              PC(a, E, b);
            }
            break;
          }
          case Q: {
            var x = a.stateNode;
            if (t === null && a.flags & dt) {
              var L = a.type, M = a.memoizedProps;
              yD(x, L, M);
            }
            break;
          }
          case oe:
            break;
          case X:
            break;
          case O: {
            {
              var V = a.memoizedProps, I = V.onCommit, $ = V.onRender, ge = a.stateNode.effectDuration, We = yb(), He = t === null ? "mount" : "update";
              mb() && (He = "nested-update"), typeof $ == "function" && $(a.memoizedProps.id, He, a.actualDuration, a.treeBaseDuration, a.actualStartTime, We);
              {
                typeof I == "function" && I(a.memoizedProps.id, He, ge, We), XM(a);
                var Dt = a.return;
                e: for (; Dt !== null; ) {
                  switch (Dt.tag) {
                    case W:
                      var bt = Dt.stateNode;
                      bt.effectDuration += ge;
                      break e;
                    case O:
                      var F = Dt.stateNode;
                      F.effectDuration += ge;
                      break e;
                  }
                  Dt = Dt.return;
                }
              }
            }
            break;
          }
          case be: {
            oM(e, a);
            break;
          }
          case Ke:
          case yt:
          case ft:
          case Ee:
          case Ge:
          case it:
            break;
          default:
            throw new Error("This unit of work tag should not have side-effects. This error is likely caused by a bug in React. Please file an issue.");
        }
      Fr || a.flags & Gr && nx(a);
    }
    function eM(e) {
      switch (e.tag) {
        case _:
        case Se:
        case ye: {
          if (e.mode & rt)
            try {
              Vl(), Jb(e, e.return);
            } finally {
              Pl(e);
            }
          else
            Jb(e, e.return);
          break;
        }
        case A: {
          var t = e.stateNode;
          typeof t.componentDidMount == "function" && GO(e, e.return, t), ex(e, e.return);
          break;
        }
        case Q: {
          ex(e, e.return);
          break;
        }
      }
    }
    function tM(e, t) {
      for (var a = null, l = e; ; ) {
        if (l.tag === Q) {
          if (a === null) {
            a = l;
            try {
              var s = l.stateNode;
              t ? RD(s) : kD(l.stateNode, l.memoizedProps);
            } catch (v) {
              cn(e, e.return, v);
            }
          }
        } else if (l.tag === oe) {
          if (a === null)
            try {
              var d = l.stateNode;
              t ? DD(d) : OD(d, l.memoizedProps);
            } catch (v) {
              cn(e, e.return, v);
            }
        } else if (!((l.tag === Ee || l.tag === Ge) && l.memoizedState !== null && l !== e)) {
          if (l.child !== null) {
            l.child.return = l, l = l.child;
            continue;
          }
        }
        if (l === e)
          return;
        for (; l.sibling === null; ) {
          if (l.return === null || l.return === e)
            return;
          a === l && (a = null), l = l.return;
        }
        a === l && (a = null), l.sibling.return = l.return, l = l.sibling;
      }
    }
    function nx(e) {
      var t = e.ref;
      if (t !== null) {
        var a = e.stateNode, l;
        switch (e.tag) {
          case Q:
            l = a;
            break;
          default:
            l = a;
        }
        if (typeof t == "function") {
          var s;
          if (e.mode & rt)
            try {
              Vl(), s = t(l);
            } finally {
              Pl(e);
            }
          else
            s = t(l);
          typeof s == "function" && S("Unexpected return value from a callback ref in %s. A callback ref should not return a function.", st(e));
        } else
          t.hasOwnProperty("current") || S("Unexpected ref object provided for %s. Use either a ref-setter function or React.createRef().", st(e)), t.current = l;
      }
    }
    function nM(e) {
      var t = e.alternate;
      t !== null && (t.return = null), e.return = null;
    }
    function rx(e) {
      var t = e.alternate;
      t !== null && (e.alternate = null, rx(t));
      {
        if (e.child = null, e.deletions = null, e.sibling = null, e.tag === Q) {
          var a = e.stateNode;
          a !== null && uk(a);
        }
        e.stateNode = null, e._debugOwner = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
      }
    }
    function rM(e) {
      for (var t = e.return; t !== null; ) {
        if (ax(t))
          return t;
        t = t.return;
      }
      throw new Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
    }
    function ax(e) {
      return e.tag === Q || e.tag === W || e.tag === X;
    }
    function ix(e) {
      var t = e;
      e: for (; ; ) {
        for (; t.sibling === null; ) {
          if (t.return === null || ax(t.return))
            return null;
          t = t.return;
        }
        for (t.sibling.return = t.return, t = t.sibling; t.tag !== Q && t.tag !== oe && t.tag !== Je; ) {
          if (t.flags & on || t.child === null || t.tag === X)
            continue e;
          t.child.return = t, t = t.child;
        }
        if (!(t.flags & on))
          return t.stateNode;
      }
    }
    function aM(e) {
      var t = rM(e);
      switch (t.tag) {
        case Q: {
          var a = t.stateNode;
          t.flags & Ht && (oC(a), t.flags &= ~Ht);
          var l = ix(e);
          Q1(e, l, a);
          break;
        }
        case W:
        case X: {
          var s = t.stateNode.containerInfo, d = ix(e);
          G1(e, d, s);
          break;
        }
        default:
          throw new Error("Invalid host parent fiber. This error is likely caused by a bug in React. Please file an issue.");
      }
    }
    function G1(e, t, a) {
      var l = e.tag, s = l === Q || l === oe;
      if (s) {
        var d = e.stateNode;
        t ? bD(a, d, t) : wD(a, d);
      } else if (l !== X) {
        var v = e.child;
        if (v !== null) {
          G1(v, t, a);
          for (var g = v.sibling; g !== null; )
            G1(g, t, a), g = g.sibling;
        }
      }
    }
    function Q1(e, t, a) {
      var l = e.tag, s = l === Q || l === oe;
      if (s) {
        var d = e.stateNode;
        t ? CD(a, d, t) : ED(a, d);
      } else if (l !== X) {
        var v = e.child;
        if (v !== null) {
          Q1(v, t, a);
          for (var g = v.sibling; g !== null; )
            Q1(g, t, a), g = g.sibling;
        }
      }
    }
    var Hr = null, sl = !1;
    function iM(e, t, a) {
      {
        var l = t;
        e: for (; l !== null; ) {
          switch (l.tag) {
            case Q: {
              Hr = l.stateNode, sl = !1;
              break e;
            }
            case W: {
              Hr = l.stateNode.containerInfo, sl = !0;
              break e;
            }
            case X: {
              Hr = l.stateNode.containerInfo, sl = !0;
              break e;
            }
          }
          l = l.return;
        }
        if (Hr === null)
          throw new Error("Expected to find a host parent. This error is likely caused by a bug in React. Please file an issue.");
        lx(e, t, a), Hr = null, sl = !1;
      }
      nM(a);
    }
    function ts(e, t, a) {
      for (var l = a.child; l !== null; )
        lx(e, t, l), l = l.sibling;
    }
    function lx(e, t, a) {
      switch (ho(a), a.tag) {
        case Q:
          Fr || Sd(a, t);
        case oe: {
          {
            var l = Hr, s = sl;
            Hr = null, ts(e, t, a), Hr = l, sl = s, Hr !== null && (sl ? TD(Hr, a.stateNode) : xD(Hr, a.stateNode));
          }
          return;
        }
        case Je: {
          Hr !== null && (sl ? _D(Hr, a.stateNode) : iS(Hr, a.stateNode));
          return;
        }
        case X: {
          {
            var d = Hr, v = sl;
            Hr = a.stateNode.containerInfo, sl = !0, ts(e, t, a), Hr = d, sl = v;
          }
          return;
        }
        case _:
        case Se:
        case le:
        case ye: {
          if (!Fr) {
            var g = a.updateQueue;
            if (g !== null) {
              var E = g.lastEffect;
              if (E !== null) {
                var b = E.next, x = b;
                do {
                  var L = x, M = L.destroy, V = L.tag;
                  M !== void 0 && ((V & Fl) !== Ia ? sg(a, t, M) : (V & mr) !== Ia && (si(a), a.mode & rt ? (Vl(), sg(a, t, M), Pl(a)) : sg(a, t, M), yu())), x = x.next;
                } while (x !== b);
              }
            }
          }
          ts(e, t, a);
          return;
        }
        case A: {
          if (!Fr) {
            Sd(a, t);
            var I = a.stateNode;
            typeof I.componentWillUnmount == "function" && $1(a, t, I);
          }
          ts(e, t, a);
          return;
        }
        case ft: {
          ts(e, t, a);
          return;
        }
        case Ee: {
          if (
            // TODO: Remove this dead flag
            a.mode & Fe
          ) {
            var $ = Fr;
            Fr = $ || a.memoizedState !== null, ts(e, t, a), Fr = $;
          } else
            ts(e, t, a);
          break;
        }
        default: {
          ts(e, t, a);
          return;
        }
      }
    }
    function lM(e) {
      e.memoizedState;
    }
    function oM(e, t) {
      var a = t.memoizedState;
      if (a === null) {
        var l = t.alternate;
        if (l !== null) {
          var s = l.memoizedState;
          if (s !== null) {
            var d = s.dehydrated;
            d !== null && WD(d);
          }
        }
      }
    }
    function ox(e) {
      var t = e.updateQueue;
      if (t !== null) {
        e.updateQueue = null;
        var a = e.stateNode;
        a === null && (a = e.stateNode = new IO()), t.forEach(function(l) {
          var s = rN.bind(null, e, l);
          if (!a.has(l)) {
            if (a.add(l), ma)
              if (yd !== null && gd !== null)
                Qh(gd, yd);
              else
                throw Error("Expected finished root and lanes to be set. This is a bug in React.");
            l.then(s, s);
          }
        });
      }
    }
    function uM(e, t, a) {
      yd = a, gd = e, Qt(t), ux(t, e), Qt(t), yd = null, gd = null;
    }
    function cl(e, t, a) {
      var l = t.deletions;
      if (l !== null)
        for (var s = 0; s < l.length; s++) {
          var d = l[s];
          try {
            iM(e, t, d);
          } catch (E) {
            cn(d, t, E);
          }
        }
      var v = l0();
      if (t.subtreeFlags & Xr)
        for (var g = t.child; g !== null; )
          Qt(g), ux(g, e), g = g.sibling;
      Qt(v);
    }
    function ux(e, t, a) {
      var l = e.alternate, s = e.flags;
      switch (e.tag) {
        case _:
        case Se:
        case le:
        case ye: {
          if (cl(t, e), Bl(e), s & dt) {
            try {
              ul(Fl | vr, e, e.return), es(Fl | vr, e);
            } catch (et) {
              cn(e, e.return, et);
            }
            if (e.mode & rt) {
              try {
                Vl(), ul(mr | vr, e, e.return);
              } catch (et) {
                cn(e, e.return, et);
              }
              Pl(e);
            } else
              try {
                ul(mr | vr, e, e.return);
              } catch (et) {
                cn(e, e.return, et);
              }
          }
          return;
        }
        case A: {
          cl(t, e), Bl(e), s & Gr && l !== null && Sd(l, l.return);
          return;
        }
        case Q: {
          cl(t, e), Bl(e), s & Gr && l !== null && Sd(l, l.return);
          {
            if (e.flags & Ht) {
              var d = e.stateNode;
              try {
                oC(d);
              } catch (et) {
                cn(e, e.return, et);
              }
            }
            if (s & dt) {
              var v = e.stateNode;
              if (v != null) {
                var g = e.memoizedProps, E = l !== null ? l.memoizedProps : g, b = e.type, x = e.updateQueue;
                if (e.updateQueue = null, x !== null)
                  try {
                    gD(v, x, b, E, g, e);
                  } catch (et) {
                    cn(e, e.return, et);
                  }
              }
            }
          }
          return;
        }
        case oe: {
          if (cl(t, e), Bl(e), s & dt) {
            if (e.stateNode === null)
              throw new Error("This should have a text node initialized. This error is likely caused by a bug in React. Please file an issue.");
            var L = e.stateNode, M = e.memoizedProps, V = l !== null ? l.memoizedProps : M;
            try {
              SD(L, V, M);
            } catch (et) {
              cn(e, e.return, et);
            }
          }
          return;
        }
        case W: {
          if (cl(t, e), Bl(e), s & dt && l !== null) {
            var I = l.memoizedState;
            if (I.isDehydrated)
              try {
                ID(t.containerInfo);
              } catch (et) {
                cn(e, e.return, et);
              }
          }
          return;
        }
        case X: {
          cl(t, e), Bl(e);
          return;
        }
        case be: {
          cl(t, e), Bl(e);
          var $ = e.child;
          if ($.flags & Tl) {
            var ge = $.stateNode, We = $.memoizedState, He = We !== null;
            if (ge.isHidden = He, He) {
              var Dt = $.alternate !== null && $.alternate.memoizedState !== null;
              Dt || VM();
            }
          }
          if (s & dt) {
            try {
              lM(e);
            } catch (et) {
              cn(e, e.return, et);
            }
            ox(e);
          }
          return;
        }
        case Ee: {
          var bt = l !== null && l.memoizedState !== null;
          if (
            // TODO: Remove this dead flag
            e.mode & Fe
          ) {
            var F = Fr;
            Fr = F || bt, cl(t, e), Fr = F;
          } else
            cl(t, e);
          if (Bl(e), s & Tl) {
            var G = e.stateNode, H = e.memoizedState, re = H !== null, _e = e;
            if (G.isHidden = re, re && !bt && (_e.mode & Fe) !== ze) {
              Ae = _e;
              for (var Ce = _e.child; Ce !== null; )
                Ae = Ce, cM(Ce), Ce = Ce.sibling;
            }
            tM(_e, re);
          }
          return;
        }
        case Ke: {
          cl(t, e), Bl(e), s & dt && ox(e);
          return;
        }
        case ft:
          return;
        default: {
          cl(t, e), Bl(e);
          return;
        }
      }
    }
    function Bl(e) {
      var t = e.flags;
      if (t & on) {
        try {
          aM(e);
        } catch (a) {
          cn(e, e.return, a);
        }
        e.flags &= ~on;
      }
      t & Ma && (e.flags &= ~Ma);
    }
    function sM(e, t, a) {
      yd = a, gd = t, Ae = e, sx(e, t, a), yd = null, gd = null;
    }
    function sx(e, t, a) {
      for (var l = (e.mode & Fe) !== ze; Ae !== null; ) {
        var s = Ae, d = s.child;
        if (s.tag === Ee && l) {
          var v = s.memoizedState !== null, g = v || ug;
          if (g) {
            q1(e, t, a);
            continue;
          } else {
            var E = s.alternate, b = E !== null && E.memoizedState !== null, x = b || Fr, L = ug, M = Fr;
            ug = g, Fr = x, Fr && !M && (Ae = s, fM(s));
            for (var V = d; V !== null; )
              Ae = V, sx(
                V,
                // New root; bubble back up to here and stop.
                t,
                a
              ), V = V.sibling;
            Ae = s, ug = L, Fr = M, q1(e, t, a);
            continue;
          }
        }
        (s.subtreeFlags & Dr) !== Be && d !== null ? (d.return = s, Ae = d) : q1(e, t, a);
      }
    }
    function q1(e, t, a) {
      for (; Ae !== null; ) {
        var l = Ae;
        if ((l.flags & Dr) !== Be) {
          var s = l.alternate;
          Qt(l);
          try {
            JO(t, s, l, a);
          } catch (v) {
            cn(l, l.return, v);
          }
          $n();
        }
        if (l === e) {
          Ae = null;
          return;
        }
        var d = l.sibling;
        if (d !== null) {
          d.return = l.return, Ae = d;
          return;
        }
        Ae = l.return;
      }
    }
    function cM(e) {
      for (; Ae !== null; ) {
        var t = Ae, a = t.child;
        switch (t.tag) {
          case _:
          case Se:
          case le:
          case ye: {
            if (t.mode & rt)
              try {
                Vl(), ul(mr, t, t.return);
              } finally {
                Pl(t);
              }
            else
              ul(mr, t, t.return);
            break;
          }
          case A: {
            Sd(t, t.return);
            var l = t.stateNode;
            typeof l.componentWillUnmount == "function" && $1(t, t.return, l);
            break;
          }
          case Q: {
            Sd(t, t.return);
            break;
          }
          case Ee: {
            var s = t.memoizedState !== null;
            if (s) {
              cx(e);
              continue;
            }
            break;
          }
        }
        a !== null ? (a.return = t, Ae = a) : cx(e);
      }
    }
    function cx(e) {
      for (; Ae !== null; ) {
        var t = Ae;
        if (t === e) {
          Ae = null;
          return;
        }
        var a = t.sibling;
        if (a !== null) {
          a.return = t.return, Ae = a;
          return;
        }
        Ae = t.return;
      }
    }
    function fM(e) {
      for (; Ae !== null; ) {
        var t = Ae, a = t.child;
        if (t.tag === Ee) {
          var l = t.memoizedState !== null;
          if (l) {
            fx(e);
            continue;
          }
        }
        a !== null ? (a.return = t, Ae = a) : fx(e);
      }
    }
    function fx(e) {
      for (; Ae !== null; ) {
        var t = Ae;
        Qt(t);
        try {
          eM(t);
        } catch (l) {
          cn(t, t.return, l);
        }
        if ($n(), t === e) {
          Ae = null;
          return;
        }
        var a = t.sibling;
        if (a !== null) {
          a.return = t.return, Ae = a;
          return;
        }
        Ae = t.return;
      }
    }
    function dM(e, t, a, l) {
      Ae = t, pM(t, e, a, l);
    }
    function pM(e, t, a, l) {
      for (; Ae !== null; ) {
        var s = Ae, d = s.child;
        (s.subtreeFlags & Na) !== Be && d !== null ? (d.return = s, Ae = d) : hM(e, t, a, l);
      }
    }
    function hM(e, t, a, l) {
      for (; Ae !== null; ) {
        var s = Ae;
        if ((s.flags & pn) !== Be) {
          Qt(s);
          try {
            vM(t, s, a, l);
          } catch (v) {
            cn(s, s.return, v);
          }
          $n();
        }
        if (s === e) {
          Ae = null;
          return;
        }
        var d = s.sibling;
        if (d !== null) {
          d.return = s.return, Ae = d;
          return;
        }
        Ae = s.return;
      }
    }
    function vM(e, t, a, l) {
      switch (t.tag) {
        case _:
        case Se:
        case ye: {
          if (t.mode & rt) {
            h1();
            try {
              es(zr | vr, t);
            } finally {
              p1(t);
            }
          } else
            es(zr | vr, t);
          break;
        }
      }
    }
    function mM(e) {
      Ae = e, yM();
    }
    function yM() {
      for (; Ae !== null; ) {
        var e = Ae, t = e.child;
        if ((Ae.flags & jt) !== Be) {
          var a = e.deletions;
          if (a !== null) {
            for (var l = 0; l < a.length; l++) {
              var s = a[l];
              Ae = s, EM(s, e);
            }
            {
              var d = e.alternate;
              if (d !== null) {
                var v = d.child;
                if (v !== null) {
                  d.child = null;
                  do {
                    var g = v.sibling;
                    v.sibling = null, v = g;
                  } while (v !== null);
                }
              }
            }
            Ae = e;
          }
        }
        (e.subtreeFlags & Na) !== Be && t !== null ? (t.return = e, Ae = t) : gM();
      }
    }
    function gM() {
      for (; Ae !== null; ) {
        var e = Ae;
        (e.flags & pn) !== Be && (Qt(e), SM(e), $n());
        var t = e.sibling;
        if (t !== null) {
          t.return = e.return, Ae = t;
          return;
        }
        Ae = e.return;
      }
    }
    function SM(e) {
      switch (e.tag) {
        case _:
        case Se:
        case ye: {
          e.mode & rt ? (h1(), ul(zr | vr, e, e.return), p1(e)) : ul(zr | vr, e, e.return);
          break;
        }
      }
    }
    function EM(e, t) {
      for (; Ae !== null; ) {
        var a = Ae;
        Qt(a), CM(a, t), $n();
        var l = a.child;
        l !== null ? (l.return = a, Ae = l) : wM(e);
      }
    }
    function wM(e) {
      for (; Ae !== null; ) {
        var t = Ae, a = t.sibling, l = t.return;
        if (rx(t), t === e) {
          Ae = null;
          return;
        }
        if (a !== null) {
          a.return = l, Ae = a;
          return;
        }
        Ae = l;
      }
    }
    function CM(e, t) {
      switch (e.tag) {
        case _:
        case Se:
        case ye: {
          e.mode & rt ? (h1(), ul(zr, e, t), p1(e)) : ul(zr, e, t);
          break;
        }
      }
    }
    function bM(e) {
      switch (e.tag) {
        case _:
        case Se:
        case ye: {
          try {
            es(mr | vr, e);
          } catch (a) {
            cn(e, e.return, a);
          }
          break;
        }
        case A: {
          var t = e.stateNode;
          try {
            t.componentDidMount();
          } catch (a) {
            cn(e, e.return, a);
          }
          break;
        }
      }
    }
    function xM(e) {
      switch (e.tag) {
        case _:
        case Se:
        case ye: {
          try {
            es(zr | vr, e);
          } catch (t) {
            cn(e, e.return, t);
          }
          break;
        }
      }
    }
    function TM(e) {
      switch (e.tag) {
        case _:
        case Se:
        case ye: {
          try {
            ul(mr | vr, e, e.return);
          } catch (a) {
            cn(e, e.return, a);
          }
          break;
        }
        case A: {
          var t = e.stateNode;
          typeof t.componentWillUnmount == "function" && $1(e, e.return, t);
          break;
        }
      }
    }
    function _M(e) {
      switch (e.tag) {
        case _:
        case Se:
        case ye:
          try {
            ul(zr | vr, e, e.return);
          } catch (t) {
            cn(e, e.return, t);
          }
      }
    }
    if (typeof Symbol == "function" && Symbol.for) {
      var jh = Symbol.for;
      jh("selector.component"), jh("selector.has_pseudo_class"), jh("selector.role"), jh("selector.test_id"), jh("selector.text");
    }
    var RM = [];
    function DM() {
      RM.forEach(function(e) {
        return e();
      });
    }
    var kM = c.ReactCurrentActQueue;
    function OM(e) {
      {
        var t = (
          // $FlowExpectedError – Flow doesn't know about IS_REACT_ACT_ENVIRONMENT global
          typeof IS_REACT_ACT_ENVIRONMENT < "u" ? IS_REACT_ACT_ENVIRONMENT : void 0
        ), a = typeof jest < "u";
        return a && t !== !1;
      }
    }
    function dx() {
      {
        var e = (
          // $FlowExpectedError – Flow doesn't know about IS_REACT_ACT_ENVIRONMENT global
          typeof IS_REACT_ACT_ENVIRONMENT < "u" ? IS_REACT_ACT_ENVIRONMENT : void 0
        );
        return !e && kM.current !== null && S("The current testing environment is not configured to support act(...)"), e;
      }
    }
    var MM = Math.ceil, X1 = c.ReactCurrentDispatcher, K1 = c.ReactCurrentOwner, Yr = c.ReactCurrentBatchConfig, fl = c.ReactCurrentActQueue, Sr = (
      /*             */
      0
    ), px = (
      /*               */
      1
    ), Pr = (
      /*                */
      2
    ), Mi = (
      /*                */
      4
    ), zo = 0, Fh = 1, mc = 2, cg = 3, Hh = 4, hx = 5, Z1 = 6, Rt = Sr, Ea = null, Un = null, Er = K, Il = K, J1 = Wu(K), wr = zo, Yh = null, fg = K, Ph = K, dg = K, Vh = null, Wa = null, eE = 0, vx = 500, mx = 1 / 0, NM = 500, jo = null;
    function Bh() {
      mx = Sn() + NM;
    }
    function yx() {
      return mx;
    }
    var pg = !1, tE = null, Ed = null, yc = !1, ns = null, Ih = K, nE = [], rE = null, LM = 50, Wh = 0, aE = null, iE = !1, hg = !1, AM = 50, wd = 0, vg = null, $h = nn, mg = K, gx = !1;
    function yg() {
      return Ea;
    }
    function wa() {
      return (Rt & (Pr | Mi)) !== Sr ? Sn() : ($h !== nn || ($h = Sn()), $h);
    }
    function rs(e) {
      var t = e.mode;
      if ((t & Fe) === ze)
        return Ve;
      if ((Rt & Pr) !== Sr && Er !== K)
        return _u(Er);
      var a = kk() !== Dk;
      if (a) {
        if (Yr.transition !== null) {
          var l = Yr.transition;
          l._updatedFibers || (l._updatedFibers = /* @__PURE__ */ new Set()), l._updatedFibers.add(e);
        }
        return mg === Yn && (mg = km()), mg;
      }
      var s = ja();
      if (s !== Yn)
        return s;
      var d = pD();
      return d;
    }
    function UM(e) {
      var t = e.mode;
      return (t & Fe) === ze ? Ve : ea();
    }
    function Cr(e, t, a, l) {
      iN(), gx && S("useInsertionEffect must not schedule updates."), iE && (hg = !0), Co(e, a, l), (Rt & Pr) !== K && e === Ea ? uN(t) : (ma && Df(e, t, a), sN(t), e === Ea && ((Rt & Pr) === Sr && (Ph = ct(Ph, a)), wr === Hh && as(e, Er)), $a(e, l), a === Ve && Rt === Sr && (t.mode & Fe) === ze && // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
      !fl.isBatchingLegacy && (Bh(), gC()));
    }
    function zM(e, t, a) {
      var l = e.current;
      l.lanes = t, Co(e, t, a), $a(e, a);
    }
    function jM(e) {
      return (
        // TODO: Remove outdated deferRenderPhaseUpdateToNextBatch experiment. We
        // decided not to enable it.
        (Rt & Pr) !== Sr
      );
    }
    function $a(e, t) {
      var a = e.callbackNode;
      xm(e, t);
      var l = Eo(e, e === Ea ? Er : K);
      if (l === K) {
        a !== null && Ax(a), e.callbackNode = null, e.callbackPriority = Yn;
        return;
      }
      var s = Nn(l), d = e.callbackPriority;
      if (d === s && // Special case related to `act`. If the currently scheduled task is a
      // Scheduler task, rather than an `act` task, cancel it and re-scheduled
      // on the `act` queue.
      !(fl.current !== null && a !== dE)) {
        a == null && d !== Ve && S("Expected scheduled callback to exist. This error is likely caused by a bug in React. Please file an issue.");
        return;
      }
      a != null && Ax(a);
      var v;
      if (s === Ve)
        e.tag === $u ? (fl.isBatchingLegacy !== null && (fl.didScheduleLegacyUpdate = !0), fk(wx.bind(null, e))) : yC(wx.bind(null, e)), fl.current !== null ? fl.current.push(Gu) : vD(function() {
          (Rt & (Pr | Mi)) === Sr && Gu();
        }), v = null;
      else {
        var g;
        switch (hr(l)) {
          case Ln:
            g = ef;
            break;
          case Ki:
            g = po;
            break;
          case Ci:
            g = wi;
            break;
          case Ru:
            g = tf;
            break;
          default:
            g = wi;
            break;
        }
        v = pE(g, Sx.bind(null, e));
      }
      e.callbackPriority = s, e.callbackNode = v;
    }
    function Sx(e, t) {
      if (tO(), $h = nn, mg = K, (Rt & (Pr | Mi)) !== Sr)
        throw new Error("Should not already be working.");
      var a = e.callbackNode, l = Ho();
      if (l && e.callbackNode !== a)
        return null;
      var s = Eo(e, e === Ea ? Er : K);
      if (s === K)
        return null;
      var d = !Bs(e, s) && !Dm(e, s) && !t, v = d ? GM(e, s) : Sg(e, s);
      if (v !== zo) {
        if (v === mc) {
          var g = Ol(e);
          g !== K && (s = g, v = lE(e, g));
        }
        if (v === Fh) {
          var E = Yh;
          throw gc(e, K), as(e, s), $a(e, Sn()), E;
        }
        if (v === Z1)
          as(e, s);
        else {
          var b = !Bs(e, s), x = e.current.alternate;
          if (b && !HM(x)) {
            if (v = Sg(e, s), v === mc) {
              var L = Ol(e);
              L !== K && (s = L, v = lE(e, L));
            }
            if (v === Fh) {
              var M = Yh;
              throw gc(e, K), as(e, s), $a(e, Sn()), M;
            }
          }
          e.finishedWork = x, e.finishedLanes = s, FM(e, v, s);
        }
      }
      return $a(e, Sn()), e.callbackNode === a ? Sx.bind(null, e) : null;
    }
    function lE(e, t) {
      var a = Vh;
      if (kf(e)) {
        var l = gc(e, t);
        l.flags |= Tn, ak(e.containerInfo);
      }
      var s = Sg(e, t);
      if (s !== mc) {
        var d = Wa;
        Wa = a, d !== null && Ex(d);
      }
      return s;
    }
    function Ex(e) {
      Wa === null ? Wa = e : Wa.push.apply(Wa, e);
    }
    function FM(e, t, a) {
      switch (t) {
        case zo:
        case Fh:
          throw new Error("Root did not complete. This is a bug in React.");
        case mc: {
          Sc(e, Wa, jo);
          break;
        }
        case cg: {
          if (as(e, a), Tm(a) && // do not delay if we're inside an act() scope
          !Ux()) {
            var l = eE + vx - Sn();
            if (l > 10) {
              var s = Eo(e, K);
              if (s !== K)
                break;
              var d = e.suspendedLanes;
              if (!wo(d, a)) {
                wa(), _f(e, d);
                break;
              }
              e.timeoutHandle = rS(Sc.bind(null, e, Wa, jo), l);
              break;
            }
          }
          Sc(e, Wa, jo);
          break;
        }
        case Hh: {
          if (as(e, a), Rm(a))
            break;
          if (!Ux()) {
            var v = Cm(e, a), g = v, E = Sn() - g, b = aN(E) - E;
            if (b > 10) {
              e.timeoutHandle = rS(Sc.bind(null, e, Wa, jo), b);
              break;
            }
          }
          Sc(e, Wa, jo);
          break;
        }
        case hx: {
          Sc(e, Wa, jo);
          break;
        }
        default:
          throw new Error("Unknown root exit status.");
      }
    }
    function HM(e) {
      for (var t = e; ; ) {
        if (t.flags & Ls) {
          var a = t.updateQueue;
          if (a !== null) {
            var l = a.stores;
            if (l !== null)
              for (var s = 0; s < l.length; s++) {
                var d = l[s], v = d.getSnapshot, g = d.value;
                try {
                  if (!Le(v(), g))
                    return !1;
                } catch {
                  return !1;
                }
              }
          }
        }
        var E = t.child;
        if (t.subtreeFlags & Ls && E !== null) {
          E.return = t, t = E;
          continue;
        }
        if (t === e)
          return !0;
        for (; t.sibling === null; ) {
          if (t.return === null || t.return === e)
            return !0;
          t = t.return;
        }
        t.sibling.return = t.return, t = t.sibling;
      }
      return !0;
    }
    function as(e, t) {
      t = Is(t, dg), t = Is(t, Ph), Mm(e, t);
    }
    function wx(e) {
      if (nO(), (Rt & (Pr | Mi)) !== Sr)
        throw new Error("Should not already be working.");
      Ho();
      var t = Eo(e, K);
      if (!ta(t, Ve))
        return $a(e, Sn()), null;
      var a = Sg(e, t);
      if (e.tag !== $u && a === mc) {
        var l = Ol(e);
        l !== K && (t = l, a = lE(e, l));
      }
      if (a === Fh) {
        var s = Yh;
        throw gc(e, K), as(e, t), $a(e, Sn()), s;
      }
      if (a === Z1)
        throw new Error("Root did not complete. This is a bug in React.");
      var d = e.current.alternate;
      return e.finishedWork = d, e.finishedLanes = t, Sc(e, Wa, jo), $a(e, Sn()), null;
    }
    function YM(e, t) {
      t !== K && (zp(e, ct(t, Ve)), $a(e, Sn()), (Rt & (Pr | Mi)) === Sr && (Bh(), Gu()));
    }
    function oE(e, t) {
      var a = Rt;
      Rt |= px;
      try {
        return e(t);
      } finally {
        Rt = a, Rt === Sr && // Treat `act` as if it's inside `batchedUpdates`, even in legacy mode.
        !fl.isBatchingLegacy && (Bh(), gC());
      }
    }
    function PM(e, t, a, l, s) {
      var d = ja(), v = Yr.transition;
      try {
        return Yr.transition = null, _n(Ln), e(t, a, l, s);
      } finally {
        _n(d), Yr.transition = v, Rt === Sr && Bh();
      }
    }
    function Fo(e) {
      ns !== null && ns.tag === $u && (Rt & (Pr | Mi)) === Sr && Ho();
      var t = Rt;
      Rt |= px;
      var a = Yr.transition, l = ja();
      try {
        return Yr.transition = null, _n(Ln), e ? e() : void 0;
      } finally {
        _n(l), Yr.transition = a, Rt = t, (Rt & (Pr | Mi)) === Sr && Gu();
      }
    }
    function Cx() {
      return (Rt & (Pr | Mi)) !== Sr;
    }
    function gg(e, t) {
      aa(J1, Il, e), Il = ct(Il, t);
    }
    function uE(e) {
      Il = J1.current, ra(J1, e);
    }
    function gc(e, t) {
      e.finishedWork = null, e.finishedLanes = K;
      var a = e.timeoutHandle;
      if (a !== aS && (e.timeoutHandle = aS, hD(a)), Un !== null)
        for (var l = Un.return; l !== null; ) {
          var s = l.alternate;
          Kb(s, l), l = l.return;
        }
      Ea = e;
      var d = Ec(e.current, null);
      return Un = d, Er = Il = t, wr = zo, Yh = null, fg = K, Ph = K, dg = K, Vh = null, Wa = null, zk(), rl.discardPendingWarnings(), d;
    }
    function bx(e, t) {
      do {
        var a = Un;
        try {
          if (Dy(), GC(), $n(), K1.current = null, a === null || a.return === null) {
            wr = Fh, Yh = t, Un = null;
            return;
          }
          if (zt && a.mode & rt && rg(a, !0), fn)
            if (Zr(), t !== null && typeof t == "object" && typeof t.then == "function") {
              var l = t;
              vo(a, l, Er);
            } else
              zs(a, t, Er);
          fO(e, a.return, a, t, Er), Rx(a);
        } catch (s) {
          t = s, Un === a && a !== null ? (a = a.return, Un = a) : a = Un;
          continue;
        }
        return;
      } while (!0);
    }
    function xx() {
      var e = X1.current;
      return X1.current = Zy, e === null ? Zy : e;
    }
    function Tx(e) {
      X1.current = e;
    }
    function VM() {
      eE = Sn();
    }
    function Gh(e) {
      fg = ct(e, fg);
    }
    function BM() {
      wr === zo && (wr = cg);
    }
    function sE() {
      (wr === zo || wr === cg || wr === mc) && (wr = Hh), Ea !== null && (Vs(fg) || Vs(Ph)) && as(Ea, Er);
    }
    function IM(e) {
      wr !== Hh && (wr = mc), Vh === null ? Vh = [e] : Vh.push(e);
    }
    function WM() {
      return wr === zo;
    }
    function Sg(e, t) {
      var a = Rt;
      Rt |= Pr;
      var l = xx();
      if (Ea !== e || Er !== t) {
        if (ma) {
          var s = e.memoizedUpdaters;
          s.size > 0 && (Qh(e, Er), s.clear()), jp(e, t);
        }
        jo = $s(), gc(e, t);
      }
      hn(t);
      do
        try {
          $M();
          break;
        } catch (d) {
          bx(e, d);
        }
      while (!0);
      if (Dy(), Rt = a, Tx(l), Un !== null)
        throw new Error("Cannot commit an incomplete root. This error is likely caused by a bug in React. Please file an issue.");
      return of(), Ea = null, Er = K, wr;
    }
    function $M() {
      for (; Un !== null; )
        _x(Un);
    }
    function GM(e, t) {
      var a = Rt;
      Rt |= Pr;
      var l = xx();
      if (Ea !== e || Er !== t) {
        if (ma) {
          var s = e.memoizedUpdaters;
          s.size > 0 && (Qh(e, Er), s.clear()), jp(e, t);
        }
        jo = $s(), Bh(), gc(e, t);
      }
      hn(t);
      do
        try {
          QM();
          break;
        } catch (d) {
          bx(e, d);
        }
      while (!0);
      return Dy(), Tx(l), Rt = a, Un !== null ? (lf(), zo) : (of(), Ea = null, Er = K, wr);
    }
    function QM() {
      for (; Un !== null && !Jc(); )
        _x(Un);
    }
    function _x(e) {
      var t = e.alternate;
      Qt(e);
      var a;
      (e.mode & rt) !== ze ? (d1(e), a = cE(t, e, Il), rg(e, !0)) : a = cE(t, e, Il), $n(), e.memoizedProps = e.pendingProps, a === null ? Rx(e) : Un = a, K1.current = null;
    }
    function Rx(e) {
      var t = e;
      do {
        var a = t.alternate, l = t.return;
        if ((t.flags & pa) === Be) {
          Qt(t);
          var s = void 0;
          if ((t.mode & rt) === ze ? s = Xb(a, t, Il) : (d1(t), s = Xb(a, t, Il), rg(t, !1)), $n(), s !== null) {
            Un = s;
            return;
          }
        } else {
          var d = BO(a, t);
          if (d !== null) {
            d.flags &= fm, Un = d;
            return;
          }
          if ((t.mode & rt) !== ze) {
            rg(t, !1);
            for (var v = t.actualDuration, g = t.child; g !== null; )
              v += g.actualDuration, g = g.sibling;
            t.actualDuration = v;
          }
          if (l !== null)
            l.flags |= pa, l.subtreeFlags = Be, l.deletions = null;
          else {
            wr = Z1, Un = null;
            return;
          }
        }
        var E = t.sibling;
        if (E !== null) {
          Un = E;
          return;
        }
        t = l, Un = t;
      } while (t !== null);
      wr === zo && (wr = hx);
    }
    function Sc(e, t, a) {
      var l = ja(), s = Yr.transition;
      try {
        Yr.transition = null, _n(Ln), qM(e, t, a, l);
      } finally {
        Yr.transition = s, _n(l);
      }
      return null;
    }
    function qM(e, t, a, l) {
      do
        Ho();
      while (ns !== null);
      if (lN(), (Rt & (Pr | Mi)) !== Sr)
        throw new Error("Should not already be working.");
      var s = e.finishedWork, d = e.finishedLanes;
      if (Rl(d), s === null)
        return nf(), null;
      if (d === K && S("root.finishedLanes should not be empty during a commit. This is a bug in React."), e.finishedWork = null, e.finishedLanes = K, s === e.current)
        throw new Error("Cannot commit the same tree as before. This error is likely caused by a bug in React. Please file an issue.");
      e.callbackNode = null, e.callbackPriority = Yn;
      var v = ct(s.lanes, s.childLanes);
      Rf(e, v), e === Ea && (Ea = null, Un = null, Er = K), ((s.subtreeFlags & Na) !== Be || (s.flags & Na) !== Be) && (yc || (yc = !0, rE = a, pE(wi, function() {
        return Ho(), null;
      })));
      var g = (s.subtreeFlags & (pu | Xr | Dr | Na)) !== Be, E = (s.flags & (pu | Xr | Dr | Na)) !== Be;
      if (g || E) {
        var b = Yr.transition;
        Yr.transition = null;
        var x = ja();
        _n(Ln);
        var L = Rt;
        Rt |= Mi, K1.current = null, QO(e, s), gb(), uM(e, s, d), oD(e.containerInfo), e.current = s, Dp(d), sM(s, e, d), gu(), hm(), Rt = L, _n(x), Yr.transition = b;
      } else
        e.current = s, gb();
      var M = yc;
      if (yc ? (yc = !1, ns = e, Ih = d) : (wd = 0, vg = null), v = e.pendingLanes, v === K && (Ed = null), M || Mx(e.current, !1), vu(s.stateNode, l), ma && e.memoizedUpdaters.clear(), DM(), $a(e, Sn()), t !== null)
        for (var V = e.onRecoverableError, I = 0; I < t.length; I++) {
          var $ = t[I], ge = $.stack, We = $.digest;
          V($.value, {
            componentStack: ge,
            digest: We
          });
        }
      if (pg) {
        pg = !1;
        var He = tE;
        throw tE = null, He;
      }
      return ta(Ih, Ve) && e.tag !== $u && Ho(), v = e.pendingLanes, ta(v, Ve) ? (eO(), e === aE ? Wh++ : (Wh = 0, aE = e)) : Wh = 0, Gu(), nf(), null;
    }
    function Ho() {
      if (ns !== null) {
        var e = hr(Ih), t = D0(Ci, e), a = Yr.transition, l = ja();
        try {
          return Yr.transition = null, _n(t), KM();
        } finally {
          _n(l), Yr.transition = a;
        }
      }
      return !1;
    }
    function XM(e) {
      nE.push(e), yc || (yc = !0, pE(wi, function() {
        return Ho(), null;
      }));
    }
    function KM() {
      if (ns === null)
        return !1;
      var e = rE;
      rE = null;
      var t = ns, a = Ih;
      if (ns = null, Ih = K, (Rt & (Pr | Mi)) !== Sr)
        throw new Error("Cannot flush passive effects while already rendering.");
      iE = !0, hg = !1, Em(a);
      var l = Rt;
      Rt |= Mi, mM(t.current), dM(t, t.current, a, e);
      {
        var s = nE;
        nE = [];
        for (var d = 0; d < s.length; d++) {
          var v = s[d];
          ZO(t, v);
        }
      }
      kp(), Mx(t.current, !0), Rt = l, Gu(), hg ? t === vg ? wd++ : (wd = 0, vg = t) : wd = 0, iE = !1, hg = !1, Ua(t);
      {
        var g = t.current.stateNode;
        g.effectDuration = 0, g.passiveEffectDuration = 0;
      }
      return !0;
    }
    function Dx(e) {
      return Ed !== null && Ed.has(e);
    }
    function ZM(e) {
      Ed === null ? Ed = /* @__PURE__ */ new Set([e]) : Ed.add(e);
    }
    function JM(e) {
      pg || (pg = !0, tE = e);
    }
    var eN = JM;
    function kx(e, t, a) {
      var l = hc(a, t), s = _b(e, l, Ve), d = qu(e, s, Ve), v = wa();
      d !== null && (Co(d, Ve, v), $a(d, v));
    }
    function cn(e, t, a) {
      if (WO(a), qh(!1), e.tag === W) {
        kx(e, e, a);
        return;
      }
      var l = null;
      for (l = t; l !== null; ) {
        if (l.tag === W) {
          kx(l, e, a);
          return;
        } else if (l.tag === A) {
          var s = l.type, d = l.stateNode;
          if (typeof s.getDerivedStateFromError == "function" || typeof d.componentDidCatch == "function" && !Dx(d)) {
            var v = hc(a, e), g = O1(l, v, Ve), E = qu(l, g, Ve), b = wa();
            E !== null && (Co(E, Ve, b), $a(E, b));
            return;
          }
        }
        l = l.return;
      }
      S(`Internal React error: Attempted to capture a commit phase error inside a detached tree. This indicates a bug in React. Likely causes include deleting the same fiber more than once, committing an already-finished tree, or an inconsistent return pointer.

Error message:

%s`, a);
    }
    function tN(e, t, a) {
      var l = e.pingCache;
      l !== null && l.delete(t);
      var s = wa();
      _f(e, a), cN(e), Ea === e && wo(Er, a) && (wr === Hh || wr === cg && Tm(Er) && Sn() - eE < vx ? gc(e, K) : dg = ct(dg, a)), $a(e, s);
    }
    function Ox(e, t) {
      t === Yn && (t = UM(e));
      var a = wa(), l = Ba(e, t);
      l !== null && (Co(l, t, a), $a(l, a));
    }
    function nN(e) {
      var t = e.memoizedState, a = Yn;
      t !== null && (a = t.retryLane), Ox(e, a);
    }
    function rN(e, t) {
      var a = Yn, l;
      switch (e.tag) {
        case be:
          l = e.stateNode;
          var s = e.memoizedState;
          s !== null && (a = s.retryLane);
          break;
        case Ke:
          l = e.stateNode;
          break;
        default:
          throw new Error("Pinged unknown suspense boundary type. This is probably a bug in React.");
      }
      l !== null && l.delete(t), Ox(e, a);
    }
    function aN(e) {
      return e < 120 ? 120 : e < 480 ? 480 : e < 1080 ? 1080 : e < 1920 ? 1920 : e < 3e3 ? 3e3 : e < 4320 ? 4320 : MM(e / 1960) * 1960;
    }
    function iN() {
      if (Wh > LM)
        throw Wh = 0, aE = null, new Error("Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.");
      wd > AM && (wd = 0, vg = null, S("Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render."));
    }
    function lN() {
      rl.flushLegacyContextWarning(), rl.flushPendingUnsafeLifecycleWarnings();
    }
    function Mx(e, t) {
      Qt(e), Eg(e, qr, TM), t && Eg(e, fo, _M), Eg(e, qr, bM), t && Eg(e, fo, xM), $n();
    }
    function Eg(e, t, a) {
      for (var l = e, s = null; l !== null; ) {
        var d = l.subtreeFlags & t;
        l !== s && l.child !== null && d !== Be ? l = l.child : ((l.flags & t) !== Be && a(l), l.sibling !== null ? l = l.sibling : l = s = l.return);
      }
    }
    var wg = null;
    function Nx(e) {
      {
        if ((Rt & Pr) !== Sr || !(e.mode & Fe))
          return;
        var t = e.tag;
        if (t !== U && t !== W && t !== A && t !== _ && t !== Se && t !== le && t !== ye)
          return;
        var a = st(e) || "ReactComponent";
        if (wg !== null) {
          if (wg.has(a))
            return;
          wg.add(a);
        } else
          wg = /* @__PURE__ */ new Set([a]);
        var l = jn;
        try {
          Qt(e), S("Can't perform a React state update on a component that hasn't mounted yet. This indicates that you have a side-effect in your render function that asynchronously later calls tries to update the component. Move this work to useEffect instead.");
        } finally {
          l ? Qt(e) : $n();
        }
      }
    }
    var cE;
    {
      var oN = null;
      cE = function(e, t, a) {
        var l = Yx(oN, t);
        try {
          return Wb(e, t, a);
        } catch (d) {
          if (Sk() || d !== null && typeof d == "object" && typeof d.then == "function")
            throw d;
          if (Dy(), GC(), Kb(e, t), Yx(t, l), t.mode & rt && d1(t), co(null, Wb, null, e, t, a), b0()) {
            var s = Sp();
            typeof s == "object" && s !== null && s._suppressLogging && typeof d == "object" && d !== null && !d._suppressLogging && (d._suppressLogging = !0);
          }
          throw d;
        }
      };
    }
    var Lx = !1, fE;
    fE = /* @__PURE__ */ new Set();
    function uN(e) {
      if (_a && !Kk())
        switch (e.tag) {
          case _:
          case Se:
          case ye: {
            var t = Un && st(Un) || "Unknown", a = t;
            if (!fE.has(a)) {
              fE.add(a);
              var l = st(e) || "Unknown";
              S("Cannot update a component (`%s`) while rendering a different component (`%s`). To locate the bad setState() call inside `%s`, follow the stack trace as described in https://reactjs.org/link/setstate-in-render", l, t, t);
            }
            break;
          }
          case A: {
            Lx || (S("Cannot update during an existing state transition (such as within `render`). Render methods should be a pure function of props and state."), Lx = !0);
            break;
          }
        }
    }
    function Qh(e, t) {
      if (ma) {
        var a = e.memoizedUpdaters;
        a.forEach(function(l) {
          Df(e, l, t);
        });
      }
    }
    var dE = {};
    function pE(e, t) {
      {
        var a = fl.current;
        return a !== null ? (a.push(t), dE) : Zc(e, t);
      }
    }
    function Ax(e) {
      if (e !== dE)
        return pm(e);
    }
    function Ux() {
      return fl.current !== null;
    }
    function sN(e) {
      {
        if (e.mode & Fe) {
          if (!dx())
            return;
        } else if (!OM() || Rt !== Sr || e.tag !== _ && e.tag !== Se && e.tag !== ye)
          return;
        if (fl.current === null) {
          var t = jn;
          try {
            Qt(e), S(`An update to %s inside a test was not wrapped in act(...).

When testing, code that causes React state updates should be wrapped into act(...):

act(() => {
  /* fire events that update state */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://reactjs.org/link/wrap-tests-with-act`, st(e));
          } finally {
            t ? Qt(e) : $n();
          }
        }
      }
    }
    function cN(e) {
      e.tag !== $u && dx() && fl.current === null && S(`A suspended resource finished loading inside a test, but the event was not wrapped in act(...).

When testing, code that resolves suspended data should be wrapped into act(...):

act(() => {
  /* finish loading suspended data */
});
/* assert on the output */

This ensures that you're testing the behavior the user would see in the browser. Learn more at https://reactjs.org/link/wrap-tests-with-act`);
    }
    function qh(e) {
      gx = e;
    }
    var Ni = null, Cd = null, fN = function(e) {
      Ni = e;
    };
    function bd(e) {
      {
        if (Ni === null)
          return e;
        var t = Ni(e);
        return t === void 0 ? e : t.current;
      }
    }
    function hE(e) {
      return bd(e);
    }
    function vE(e) {
      {
        if (Ni === null)
          return e;
        var t = Ni(e);
        if (t === void 0) {
          if (e != null && typeof e.render == "function") {
            var a = bd(e.render);
            if (e.render !== a) {
              var l = {
                $$typeof: de,
                render: a
              };
              return e.displayName !== void 0 && (l.displayName = e.displayName), l;
            }
          }
          return e;
        }
        return t.current;
      }
    }
    function zx(e, t) {
      {
        if (Ni === null)
          return !1;
        var a = e.elementType, l = t.type, s = !1, d = typeof l == "object" && l !== null ? l.$$typeof : null;
        switch (e.tag) {
          case A: {
            typeof l == "function" && (s = !0);
            break;
          }
          case _: {
            (typeof l == "function" || d === Ze) && (s = !0);
            break;
          }
          case Se: {
            (d === de || d === Ze) && (s = !0);
            break;
          }
          case le:
          case ye: {
            (d === Ot || d === Ze) && (s = !0);
            break;
          }
          default:
            return !1;
        }
        if (s) {
          var v = Ni(a);
          if (v !== void 0 && v === Ni(l))
            return !0;
        }
        return !1;
      }
    }
    function jx(e) {
      {
        if (Ni === null || typeof WeakSet != "function")
          return;
        Cd === null && (Cd = /* @__PURE__ */ new WeakSet()), Cd.add(e);
      }
    }
    var dN = function(e, t) {
      {
        if (Ni === null)
          return;
        var a = t.staleFamilies, l = t.updatedFamilies;
        Ho(), Fo(function() {
          mE(e.current, l, a);
        });
      }
    }, pN = function(e, t) {
      {
        if (e.context !== ci)
          return;
        Ho(), Fo(function() {
          Xh(t, e, null, null);
        });
      }
    };
    function mE(e, t, a) {
      {
        var l = e.alternate, s = e.child, d = e.sibling, v = e.tag, g = e.type, E = null;
        switch (v) {
          case _:
          case ye:
          case A:
            E = g;
            break;
          case Se:
            E = g.render;
            break;
        }
        if (Ni === null)
          throw new Error("Expected resolveFamily to be set during hot reload.");
        var b = !1, x = !1;
        if (E !== null) {
          var L = Ni(E);
          L !== void 0 && (a.has(L) ? x = !0 : t.has(L) && (v === A ? x = !0 : b = !0));
        }
        if (Cd !== null && (Cd.has(e) || l !== null && Cd.has(l)) && (x = !0), x && (e._debugNeedsRemount = !0), x || b) {
          var M = Ba(e, Ve);
          M !== null && Cr(M, e, Ve, nn);
        }
        s !== null && !x && mE(s, t, a), d !== null && mE(d, t, a);
      }
    }
    var hN = function(e, t) {
      {
        var a = /* @__PURE__ */ new Set(), l = new Set(t.map(function(s) {
          return s.current;
        }));
        return yE(e.current, l, a), a;
      }
    };
    function yE(e, t, a) {
      {
        var l = e.child, s = e.sibling, d = e.tag, v = e.type, g = null;
        switch (d) {
          case _:
          case ye:
          case A:
            g = v;
            break;
          case Se:
            g = v.render;
            break;
        }
        var E = !1;
        g !== null && t.has(g) && (E = !0), E ? vN(e, a) : l !== null && yE(l, t, a), s !== null && yE(s, t, a);
      }
    }
    function vN(e, t) {
      {
        var a = mN(e, t);
        if (a)
          return;
        for (var l = e; ; ) {
          switch (l.tag) {
            case Q:
              t.add(l.stateNode);
              return;
            case X:
              t.add(l.stateNode.containerInfo);
              return;
            case W:
              t.add(l.stateNode.containerInfo);
              return;
          }
          if (l.return === null)
            throw new Error("Expected to reach root first.");
          l = l.return;
        }
      }
    }
    function mN(e, t) {
      for (var a = e, l = !1; ; ) {
        if (a.tag === Q)
          l = !0, t.add(a.stateNode);
        else if (a.child !== null) {
          a.child.return = a, a = a.child;
          continue;
        }
        if (a === e)
          return l;
        for (; a.sibling === null; ) {
          if (a.return === null || a.return === e)
            return l;
          a = a.return;
        }
        a.sibling.return = a.return, a = a.sibling;
      }
      return !1;
    }
    var gE;
    {
      gE = !1;
      try {
        var Fx = Object.preventExtensions({});
      } catch {
        gE = !0;
      }
    }
    function yN(e, t, a, l) {
      this.tag = e, this.key = a, this.elementType = null, this.type = null, this.stateNode = null, this.return = null, this.child = null, this.sibling = null, this.index = 0, this.ref = null, this.pendingProps = t, this.memoizedProps = null, this.updateQueue = null, this.memoizedState = null, this.dependencies = null, this.mode = l, this.flags = Be, this.subtreeFlags = Be, this.deletions = null, this.lanes = K, this.childLanes = K, this.alternate = null, this.actualDuration = Number.NaN, this.actualStartTime = Number.NaN, this.selfBaseDuration = Number.NaN, this.treeBaseDuration = Number.NaN, this.actualDuration = 0, this.actualStartTime = -1, this.selfBaseDuration = 0, this.treeBaseDuration = 0, this._debugSource = null, this._debugOwner = null, this._debugNeedsRemount = !1, this._debugHookTypes = null, !gE && typeof Object.preventExtensions == "function" && Object.preventExtensions(this);
    }
    var fi = function(e, t, a, l) {
      return new yN(e, t, a, l);
    };
    function SE(e) {
      var t = e.prototype;
      return !!(t && t.isReactComponent);
    }
    function gN(e) {
      return typeof e == "function" && !SE(e) && e.defaultProps === void 0;
    }
    function SN(e) {
      if (typeof e == "function")
        return SE(e) ? A : _;
      if (e != null) {
        var t = e.$$typeof;
        if (t === de)
          return Se;
        if (t === Ot)
          return le;
      }
      return U;
    }
    function Ec(e, t) {
      var a = e.alternate;
      a === null ? (a = fi(e.tag, t, e.key, e.mode), a.elementType = e.elementType, a.type = e.type, a.stateNode = e.stateNode, a._debugSource = e._debugSource, a._debugOwner = e._debugOwner, a._debugHookTypes = e._debugHookTypes, a.alternate = e, e.alternate = a) : (a.pendingProps = t, a.type = e.type, a.flags = Be, a.subtreeFlags = Be, a.deletions = null, a.actualDuration = 0, a.actualStartTime = -1), a.flags = e.flags & dr, a.childLanes = e.childLanes, a.lanes = e.lanes, a.child = e.child, a.memoizedProps = e.memoizedProps, a.memoizedState = e.memoizedState, a.updateQueue = e.updateQueue;
      var l = e.dependencies;
      switch (a.dependencies = l === null ? null : {
        lanes: l.lanes,
        firstContext: l.firstContext
      }, a.sibling = e.sibling, a.index = e.index, a.ref = e.ref, a.selfBaseDuration = e.selfBaseDuration, a.treeBaseDuration = e.treeBaseDuration, a._debugNeedsRemount = e._debugNeedsRemount, a.tag) {
        case U:
        case _:
        case ye:
          a.type = bd(e.type);
          break;
        case A:
          a.type = hE(e.type);
          break;
        case Se:
          a.type = vE(e.type);
          break;
      }
      return a;
    }
    function EN(e, t) {
      e.flags &= dr | on;
      var a = e.alternate;
      if (a === null)
        e.childLanes = K, e.lanes = t, e.child = null, e.subtreeFlags = Be, e.memoizedProps = null, e.memoizedState = null, e.updateQueue = null, e.dependencies = null, e.stateNode = null, e.selfBaseDuration = 0, e.treeBaseDuration = 0;
      else {
        e.childLanes = a.childLanes, e.lanes = a.lanes, e.child = a.child, e.subtreeFlags = Be, e.deletions = null, e.memoizedProps = a.memoizedProps, e.memoizedState = a.memoizedState, e.updateQueue = a.updateQueue, e.type = a.type;
        var l = a.dependencies;
        e.dependencies = l === null ? null : {
          lanes: l.lanes,
          firstContext: l.firstContext
        }, e.selfBaseDuration = a.selfBaseDuration, e.treeBaseDuration = a.treeBaseDuration;
      }
      return e;
    }
    function wN(e, t, a) {
      var l;
      return e === gy ? (l = Fe, t === !0 && (l |= Et, l |= ya)) : l = ze, ma && (l |= rt), fi(W, null, null, l);
    }
    function EE(e, t, a, l, s, d) {
      var v = U, g = e;
      if (typeof e == "function")
        SE(e) ? (v = A, g = hE(g)) : g = bd(g);
      else if (typeof e == "string")
        v = Q;
      else
        e: switch (e) {
          case ni:
            return is(a.children, s, d, t);
          case ml:
            v = ce, s |= Et, (s & Fe) !== ze && (s |= ya);
            break;
          case eo:
            return CN(a, s, d, t);
          case Pe:
            return bN(a, s, d, t);
          case Tt:
            return xN(a, s, d, t);
          case ln:
            return Hx(a, s, d, t);
          case gn:
          case gt:
          case Wr:
          case yl:
          case rr:
          default: {
            if (typeof e == "object" && e !== null)
              switch (e.$$typeof) {
                case R:
                  v = ve;
                  break e;
                case te:
                  v = Me;
                  break e;
                case de:
                  v = Se, g = vE(g);
                  break e;
                case Ot:
                  v = le;
                  break e;
                case Ze:
                  v = ht, g = null;
                  break e;
              }
            var E = "";
            {
              (e === void 0 || typeof e == "object" && e !== null && Object.keys(e).length === 0) && (E += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
              var b = l ? st(l) : null;
              b && (E += `

Check the render method of \`` + b + "`.");
            }
            throw new Error("Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) " + ("but got: " + (e == null ? e : typeof e) + "." + E));
          }
        }
      var x = fi(v, a, t, s);
      return x.elementType = e, x.type = g, x.lanes = d, x._debugOwner = l, x;
    }
    function wE(e, t, a) {
      var l = null;
      l = e._owner;
      var s = e.type, d = e.key, v = e.props, g = EE(s, d, v, l, t, a);
      return g._debugSource = e._source, g._debugOwner = e._owner, g;
    }
    function is(e, t, a, l) {
      var s = fi(we, e, l, t);
      return s.lanes = a, s;
    }
    function CN(e, t, a, l) {
      typeof e.id != "string" && S('Profiler must specify an "id" of type `string` as a prop. Received the type `%s` instead.', typeof e.id);
      var s = fi(O, e, l, t | rt);
      return s.elementType = eo, s.lanes = a, s.stateNode = {
        effectDuration: 0,
        passiveEffectDuration: 0
      }, s;
    }
    function bN(e, t, a, l) {
      var s = fi(be, e, l, t);
      return s.elementType = Pe, s.lanes = a, s;
    }
    function xN(e, t, a, l) {
      var s = fi(Ke, e, l, t);
      return s.elementType = Tt, s.lanes = a, s;
    }
    function Hx(e, t, a, l) {
      var s = fi(Ee, e, l, t);
      s.elementType = ln, s.lanes = a;
      var d = {
        isHidden: !1
      };
      return s.stateNode = d, s;
    }
    function CE(e, t, a) {
      var l = fi(oe, e, null, t);
      return l.lanes = a, l;
    }
    function TN() {
      var e = fi(Q, null, null, ze);
      return e.elementType = "DELETED", e;
    }
    function _N(e) {
      var t = fi(Je, null, null, ze);
      return t.stateNode = e, t;
    }
    function bE(e, t, a) {
      var l = e.children !== null ? e.children : [], s = fi(X, l, e.key, t);
      return s.lanes = a, s.stateNode = {
        containerInfo: e.containerInfo,
        pendingChildren: null,
        // Used by persistent updates
        implementation: e.implementation
      }, s;
    }
    function Yx(e, t) {
      return e === null && (e = fi(U, null, null, ze)), e.tag = t.tag, e.key = t.key, e.elementType = t.elementType, e.type = t.type, e.stateNode = t.stateNode, e.return = t.return, e.child = t.child, e.sibling = t.sibling, e.index = t.index, e.ref = t.ref, e.pendingProps = t.pendingProps, e.memoizedProps = t.memoizedProps, e.updateQueue = t.updateQueue, e.memoizedState = t.memoizedState, e.dependencies = t.dependencies, e.mode = t.mode, e.flags = t.flags, e.subtreeFlags = t.subtreeFlags, e.deletions = t.deletions, e.lanes = t.lanes, e.childLanes = t.childLanes, e.alternate = t.alternate, e.actualDuration = t.actualDuration, e.actualStartTime = t.actualStartTime, e.selfBaseDuration = t.selfBaseDuration, e.treeBaseDuration = t.treeBaseDuration, e._debugSource = t._debugSource, e._debugOwner = t._debugOwner, e._debugNeedsRemount = t._debugNeedsRemount, e._debugHookTypes = t._debugHookTypes, e;
    }
    function RN(e, t, a, l, s) {
      this.tag = t, this.containerInfo = e, this.pendingChildren = null, this.current = null, this.pingCache = null, this.finishedWork = null, this.timeoutHandle = aS, this.context = null, this.pendingContext = null, this.callbackNode = null, this.callbackPriority = Yn, this.eventTimes = Ws(K), this.expirationTimes = Ws(nn), this.pendingLanes = K, this.suspendedLanes = K, this.pingedLanes = K, this.expiredLanes = K, this.mutableReadLanes = K, this.finishedLanes = K, this.entangledLanes = K, this.entanglements = Ws(K), this.identifierPrefix = l, this.onRecoverableError = s, this.mutableSourceEagerHydrationData = null, this.effectDuration = 0, this.passiveEffectDuration = 0;
      {
        this.memoizedUpdaters = /* @__PURE__ */ new Set();
        for (var d = this.pendingUpdatersLaneMap = [], v = 0; v < Hs; v++)
          d.push(/* @__PURE__ */ new Set());
      }
      switch (t) {
        case gy:
          this._debugRootType = a ? "hydrateRoot()" : "createRoot()";
          break;
        case $u:
          this._debugRootType = a ? "hydrate()" : "render()";
          break;
      }
    }
    function Px(e, t, a, l, s, d, v, g, E, b) {
      var x = new RN(e, t, a, g, E), L = wN(t, d);
      x.current = L, L.stateNode = x;
      {
        var M = {
          element: l,
          isDehydrated: a,
          cache: null,
          // not enabled yet
          transitions: null,
          pendingSuspenseBoundaries: null
        };
        L.memoizedState = M;
      }
      return zS(L), x;
    }
    var xE = "18.3.1";
    function DN(e, t, a) {
      var l = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : null;
      return zn(l), {
        // This tag allow us to uniquely identify this as a React Portal
        $$typeof: ca,
        key: l == null ? null : "" + l,
        children: e,
        containerInfo: t,
        implementation: a
      };
    }
    var TE, _E;
    TE = !1, _E = {};
    function Vx(e) {
      if (!e)
        return ci;
      var t = ka(e), a = ck(t);
      if (t.tag === A) {
        var l = t.type;
        if (jl(l))
          return vC(t, l, a);
      }
      return a;
    }
    function kN(e, t) {
      {
        var a = ka(e);
        if (a === void 0) {
          if (typeof e.render == "function")
            throw new Error("Unable to find node on an unmounted component.");
          var l = Object.keys(e).join(",");
          throw new Error("Argument appears to not be a ReactComponent. Keys: " + l);
        }
        var s = La(a);
        if (s === null)
          return null;
        if (s.mode & Et) {
          var d = st(a) || "Component";
          if (!_E[d]) {
            _E[d] = !0;
            var v = jn;
            try {
              Qt(s), a.mode & Et ? S("%s is deprecated in StrictMode. %s was passed an instance of %s which is inside StrictMode. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node", t, t, d) : S("%s is deprecated in StrictMode. %s was passed an instance of %s which renders StrictMode children. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node", t, t, d);
            } finally {
              v ? Qt(v) : $n();
            }
          }
        }
        return s.stateNode;
      }
    }
    function Bx(e, t, a, l, s, d, v, g) {
      var E = !1, b = null;
      return Px(e, t, E, b, a, l, s, d, v);
    }
    function Ix(e, t, a, l, s, d, v, g, E, b) {
      var x = !0, L = Px(a, l, x, e, s, d, v, g, E);
      L.context = Vx(null);
      var M = L.current, V = wa(), I = rs(M), $ = Ao(V, I);
      return $.callback = t ?? null, qu(M, $, I), zM(L, I, V), L;
    }
    function Xh(e, t, a, l) {
      Rp(t, e);
      var s = t.current, d = wa(), v = rs(s);
      Op(v);
      var g = Vx(a);
      t.context === null ? t.context = g : t.pendingContext = g, _a && jn !== null && !TE && (TE = !0, S(`Render methods should be a pure function of props and state; triggering nested component updates from render is not allowed. If necessary, trigger nested updates in componentDidUpdate.

Check the render method of %s.`, st(jn) || "Unknown"));
      var E = Ao(d, v);
      E.payload = {
        element: e
      }, l = l === void 0 ? null : l, l !== null && (typeof l != "function" && S("render(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", l), E.callback = l);
      var b = qu(s, E, v);
      return b !== null && (Cr(b, s, v, d), Ly(b, s, v)), v;
    }
    function Cg(e) {
      var t = e.current;
      if (!t.child)
        return null;
      switch (t.child.tag) {
        case Q:
          return t.child.stateNode;
        default:
          return t.child.stateNode;
      }
    }
    function ON(e) {
      switch (e.tag) {
        case W: {
          var t = e.stateNode;
          if (kf(t)) {
            var a = Lp(t);
            YM(t, a);
          }
          break;
        }
        case be: {
          Fo(function() {
            var s = Ba(e, Ve);
            if (s !== null) {
              var d = wa();
              Cr(s, e, Ve, d);
            }
          });
          var l = Ve;
          RE(e, l);
          break;
        }
      }
    }
    function Wx(e, t) {
      var a = e.memoizedState;
      a !== null && a.dehydrated !== null && (a.retryLane = Om(a.retryLane, t));
    }
    function RE(e, t) {
      Wx(e, t);
      var a = e.alternate;
      a && Wx(a, t);
    }
    function MN(e) {
      if (e.tag === be) {
        var t = Ps, a = Ba(e, t);
        if (a !== null) {
          var l = wa();
          Cr(a, e, t, l);
        }
        RE(e, t);
      }
    }
    function NN(e) {
      if (e.tag === be) {
        var t = rs(e), a = Ba(e, t);
        if (a !== null) {
          var l = wa();
          Cr(a, e, t, l);
        }
        RE(e, t);
      }
    }
    function $x(e) {
      var t = dm(e);
      return t === null ? null : t.stateNode;
    }
    var Gx = function(e) {
      return null;
    };
    function LN(e) {
      return Gx(e);
    }
    var Qx = function(e) {
      return !1;
    };
    function AN(e) {
      return Qx(e);
    }
    var qx = null, Xx = null, Kx = null, Zx = null, Jx = null, eT = null, tT = null, nT = null, rT = null;
    {
      var aT = function(e, t, a) {
        var l = t[a], s = ar(e) ? e.slice() : St({}, e);
        return a + 1 === t.length ? (ar(s) ? s.splice(l, 1) : delete s[l], s) : (s[l] = aT(e[l], t, a + 1), s);
      }, iT = function(e, t) {
        return aT(e, t, 0);
      }, lT = function(e, t, a, l) {
        var s = t[l], d = ar(e) ? e.slice() : St({}, e);
        if (l + 1 === t.length) {
          var v = a[l];
          d[v] = d[s], ar(d) ? d.splice(s, 1) : delete d[s];
        } else
          d[s] = lT(
            // $FlowFixMe number or string is fine here
            e[s],
            t,
            a,
            l + 1
          );
        return d;
      }, oT = function(e, t, a) {
        if (t.length !== a.length) {
          w("copyWithRename() expects paths of the same length");
          return;
        } else
          for (var l = 0; l < a.length - 1; l++)
            if (t[l] !== a[l]) {
              w("copyWithRename() expects paths to be the same except for the deepest key");
              return;
            }
        return lT(e, t, a, 0);
      }, uT = function(e, t, a, l) {
        if (a >= t.length)
          return l;
        var s = t[a], d = ar(e) ? e.slice() : St({}, e);
        return d[s] = uT(e[s], t, a + 1, l), d;
      }, sT = function(e, t, a) {
        return uT(e, t, 0, a);
      }, DE = function(e, t) {
        for (var a = e.memoizedState; a !== null && t > 0; )
          a = a.next, t--;
        return a;
      };
      qx = function(e, t, a, l) {
        var s = DE(e, t);
        if (s !== null) {
          var d = sT(s.memoizedState, a, l);
          s.memoizedState = d, s.baseState = d, e.memoizedProps = St({}, e.memoizedProps);
          var v = Ba(e, Ve);
          v !== null && Cr(v, e, Ve, nn);
        }
      }, Xx = function(e, t, a) {
        var l = DE(e, t);
        if (l !== null) {
          var s = iT(l.memoizedState, a);
          l.memoizedState = s, l.baseState = s, e.memoizedProps = St({}, e.memoizedProps);
          var d = Ba(e, Ve);
          d !== null && Cr(d, e, Ve, nn);
        }
      }, Kx = function(e, t, a, l) {
        var s = DE(e, t);
        if (s !== null) {
          var d = oT(s.memoizedState, a, l);
          s.memoizedState = d, s.baseState = d, e.memoizedProps = St({}, e.memoizedProps);
          var v = Ba(e, Ve);
          v !== null && Cr(v, e, Ve, nn);
        }
      }, Zx = function(e, t, a) {
        e.pendingProps = sT(e.memoizedProps, t, a), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var l = Ba(e, Ve);
        l !== null && Cr(l, e, Ve, nn);
      }, Jx = function(e, t) {
        e.pendingProps = iT(e.memoizedProps, t), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var a = Ba(e, Ve);
        a !== null && Cr(a, e, Ve, nn);
      }, eT = function(e, t, a) {
        e.pendingProps = oT(e.memoizedProps, t, a), e.alternate && (e.alternate.pendingProps = e.pendingProps);
        var l = Ba(e, Ve);
        l !== null && Cr(l, e, Ve, nn);
      }, tT = function(e) {
        var t = Ba(e, Ve);
        t !== null && Cr(t, e, Ve, nn);
      }, nT = function(e) {
        Gx = e;
      }, rT = function(e) {
        Qx = e;
      };
    }
    function UN(e) {
      var t = La(e);
      return t === null ? null : t.stateNode;
    }
    function zN(e) {
      return null;
    }
    function jN() {
      return jn;
    }
    function FN(e) {
      var t = e.findFiberByHostInstance, a = c.ReactCurrentDispatcher;
      return _p({
        bundleType: e.bundleType,
        version: e.version,
        rendererPackageName: e.rendererPackageName,
        rendererConfig: e.rendererConfig,
        overrideHookState: qx,
        overrideHookStateDeletePath: Xx,
        overrideHookStateRenamePath: Kx,
        overrideProps: Zx,
        overridePropsDeletePath: Jx,
        overridePropsRenamePath: eT,
        setErrorHandler: nT,
        setSuspenseHandler: rT,
        scheduleUpdate: tT,
        currentDispatcherRef: a,
        findHostInstanceByFiber: UN,
        findFiberByHostInstance: t || zN,
        // React Refresh
        findHostInstancesForRefresh: hN,
        scheduleRefresh: dN,
        scheduleRoot: pN,
        setRefreshHandler: fN,
        // Enables DevTools to append owner stacks to error messages in DEV mode.
        getCurrentFiber: jN,
        // Enables DevTools to detect reconciler version rather than renderer version
        // which may not match for third party renderers.
        reconcilerVersion: xE
      });
    }
    var cT = typeof reportError == "function" ? (
      // In modern browsers, reportError will dispatch an error event,
      // emulating an uncaught JavaScript error.
      reportError
    ) : function(e) {
      console.error(e);
    };
    function kE(e) {
      this._internalRoot = e;
    }
    bg.prototype.render = kE.prototype.render = function(e) {
      var t = this._internalRoot;
      if (t === null)
        throw new Error("Cannot update an unmounted root.");
      {
        typeof arguments[1] == "function" ? S("render(...): does not support the second callback argument. To execute a side effect after rendering, declare it in a component body with useEffect().") : xg(arguments[1]) ? S("You passed a container to the second argument of root.render(...). You don't need to pass it again since you already passed it to create the root.") : typeof arguments[1] < "u" && S("You passed a second argument to root.render(...) but it only accepts one argument.");
        var a = t.containerInfo;
        if (a.nodeType !== Fn) {
          var l = $x(t.current);
          l && l.parentNode !== a && S("render(...): It looks like the React-rendered content of the root container was removed without using React. This is not supported and will cause errors. Instead, call root.unmount() to empty a root's container.");
        }
      }
      Xh(e, t, null, null);
    }, bg.prototype.unmount = kE.prototype.unmount = function() {
      typeof arguments[0] == "function" && S("unmount(...): does not support a callback argument. To execute a side effect after rendering, declare it in a component body with useEffect().");
      var e = this._internalRoot;
      if (e !== null) {
        this._internalRoot = null;
        var t = e.containerInfo;
        Cx() && S("Attempted to synchronously unmount a root while React was already rendering. React cannot finish unmounting the root until the current render has completed, which may lead to a race condition."), Fo(function() {
          Xh(null, e, null, null);
        }), cC(t);
      }
    };
    function HN(e, t) {
      if (!xg(e))
        throw new Error("createRoot(...): Target container is not a DOM element.");
      fT(e);
      var a = !1, l = !1, s = "", d = cT;
      t != null && (t.hydrate ? w("hydrate through createRoot is deprecated. Use ReactDOMClient.hydrateRoot(container, <App />) instead.") : typeof t == "object" && t !== null && t.$$typeof === Hi && S(`You passed a JSX element to createRoot. You probably meant to call root.render instead. Example usage:

  let root = createRoot(domContainer);
  root.render(<App />);`), t.unstable_strictMode === !0 && (a = !0), t.identifierPrefix !== void 0 && (s = t.identifierPrefix), t.onRecoverableError !== void 0 && (d = t.onRecoverableError), t.transitionCallbacks !== void 0 && t.transitionCallbacks);
      var v = Bx(e, gy, null, a, l, s, d);
      fy(v.current, e);
      var g = e.nodeType === Fn ? e.parentNode : e;
      return nh(g), new kE(v);
    }
    function bg(e) {
      this._internalRoot = e;
    }
    function YN(e) {
      e && M0(e);
    }
    bg.prototype.unstable_scheduleHydration = YN;
    function PN(e, t, a) {
      if (!xg(e))
        throw new Error("hydrateRoot(...): Target container is not a DOM element.");
      fT(e), t === void 0 && S("Must provide initial children as second argument to hydrateRoot. Example usage: hydrateRoot(domContainer, <App />)");
      var l = a ?? null, s = a != null && a.hydratedSources || null, d = !1, v = !1, g = "", E = cT;
      a != null && (a.unstable_strictMode === !0 && (d = !0), a.identifierPrefix !== void 0 && (g = a.identifierPrefix), a.onRecoverableError !== void 0 && (E = a.onRecoverableError));
      var b = Ix(t, null, e, gy, l, d, v, g, E);
      if (fy(b.current, e), nh(e), s)
        for (var x = 0; x < s.length; x++) {
          var L = s[x];
          Wk(b, L);
        }
      return new bg(b);
    }
    function xg(e) {
      return !!(e && (e.nodeType === $r || e.nodeType === li || e.nodeType === ao || !ut));
    }
    function Kh(e) {
      return !!(e && (e.nodeType === $r || e.nodeType === li || e.nodeType === ao || e.nodeType === Fn && e.nodeValue === " react-mount-point-unstable "));
    }
    function fT(e) {
      e.nodeType === $r && e.tagName && e.tagName.toUpperCase() === "BODY" && S("createRoot(): Creating roots directly with document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try using a container element created for your app."), ph(e) && (e._reactRootContainer ? S("You are calling ReactDOMClient.createRoot() on a container that was previously passed to ReactDOM.render(). This is not supported.") : S("You are calling ReactDOMClient.createRoot() on a container that has already been passed to createRoot() before. Instead, call root.render() on the existing root instead if you want to update it."));
    }
    var VN = c.ReactCurrentOwner, dT;
    dT = function(e) {
      if (e._reactRootContainer && e.nodeType !== Fn) {
        var t = $x(e._reactRootContainer.current);
        t && t.parentNode !== e && S("render(...): It looks like the React-rendered content of this container was removed without using React. This is not supported and will cause errors. Instead, call ReactDOM.unmountComponentAtNode to empty a container.");
      }
      var a = !!e._reactRootContainer, l = OE(e), s = !!(l && Iu(l));
      s && !a && S("render(...): Replacing React-rendered children with a new root component. If you intended to update the children of this node, you should instead have the existing children update their state and render the new components instead of calling ReactDOM.render."), e.nodeType === $r && e.tagName && e.tagName.toUpperCase() === "BODY" && S("render(): Rendering components directly into document.body is discouraged, since its children are often manipulated by third-party scripts and browser extensions. This may lead to subtle reconciliation issues. Try rendering into a container element created for your app.");
    };
    function OE(e) {
      return e ? e.nodeType === li ? e.documentElement : e.firstChild : null;
    }
    function pT() {
    }
    function BN(e, t, a, l, s) {
      if (s) {
        if (typeof l == "function") {
          var d = l;
          l = function() {
            var M = Cg(v);
            d.call(M);
          };
        }
        var v = Ix(
          t,
          l,
          e,
          $u,
          null,
          // hydrationCallbacks
          !1,
          // isStrictMode
          !1,
          // concurrentUpdatesByDefaultOverride,
          "",
          // identifierPrefix
          pT
        );
        e._reactRootContainer = v, fy(v.current, e);
        var g = e.nodeType === Fn ? e.parentNode : e;
        return nh(g), Fo(), v;
      } else {
        for (var E; E = e.lastChild; )
          e.removeChild(E);
        if (typeof l == "function") {
          var b = l;
          l = function() {
            var M = Cg(x);
            b.call(M);
          };
        }
        var x = Bx(
          e,
          $u,
          null,
          // hydrationCallbacks
          !1,
          // isStrictMode
          !1,
          // concurrentUpdatesByDefaultOverride,
          "",
          // identifierPrefix
          pT
        );
        e._reactRootContainer = x, fy(x.current, e);
        var L = e.nodeType === Fn ? e.parentNode : e;
        return nh(L), Fo(function() {
          Xh(t, x, a, l);
        }), x;
      }
    }
    function IN(e, t) {
      e !== null && typeof e != "function" && S("%s(...): Expected the last optional `callback` argument to be a function. Instead received: %s.", t, e);
    }
    function Tg(e, t, a, l, s) {
      dT(a), IN(s === void 0 ? null : s, "render");
      var d = a._reactRootContainer, v;
      if (!d)
        v = BN(a, t, e, s, l);
      else {
        if (v = d, typeof s == "function") {
          var g = s;
          s = function() {
            var E = Cg(v);
            g.call(E);
          };
        }
        Xh(t, v, e, s);
      }
      return Cg(v);
    }
    var hT = !1;
    function WN(e) {
      {
        hT || (hT = !0, S("findDOMNode is deprecated and will be removed in the next major release. Instead, add a ref directly to the element you want to reference. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-find-node"));
        var t = VN.current;
        if (t !== null && t.stateNode !== null) {
          var a = t.stateNode._warnedAboutRefsInRender;
          a || S("%s is accessing findDOMNode inside its render(). render() should be a pure function of props and state. It should never access something that requires stale data from the previous render, such as refs. Move this logic to componentDidMount and componentDidUpdate instead.", Wt(t.type) || "A component"), t.stateNode._warnedAboutRefsInRender = !0;
        }
      }
      return e == null ? null : e.nodeType === $r ? e : kN(e, "findDOMNode");
    }
    function $N(e, t, a) {
      if (S("ReactDOM.hydrate is no longer supported in React 18. Use hydrateRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !Kh(t))
        throw new Error("Target container is not a DOM element.");
      {
        var l = ph(t) && t._reactRootContainer === void 0;
        l && S("You are calling ReactDOM.hydrate() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call hydrateRoot(container, element)?");
      }
      return Tg(null, e, t, !0, a);
    }
    function GN(e, t, a) {
      if (S("ReactDOM.render is no longer supported in React 18. Use createRoot instead. Until you switch to the new API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !Kh(t))
        throw new Error("Target container is not a DOM element.");
      {
        var l = ph(t) && t._reactRootContainer === void 0;
        l && S("You are calling ReactDOM.render() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call root.render(element)?");
      }
      return Tg(null, e, t, !1, a);
    }
    function QN(e, t, a, l) {
      if (S("ReactDOM.unstable_renderSubtreeIntoContainer() is no longer supported in React 18. Consider using a portal instead. Until you switch to the createRoot API, your app will behave as if it's running React 17. Learn more: https://reactjs.org/link/switch-to-createroot"), !Kh(a))
        throw new Error("Target container is not a DOM element.");
      if (e == null || !Ns(e))
        throw new Error("parentComponent must be a valid React Component");
      return Tg(e, t, a, !1, l);
    }
    var vT = !1;
    function qN(e) {
      if (vT || (vT = !0, S("unmountComponentAtNode is deprecated and will be removed in the next major release. Switch to the createRoot API. Learn more: https://reactjs.org/link/switch-to-createroot")), !Kh(e))
        throw new Error("unmountComponentAtNode(...): Target container is not a DOM element.");
      {
        var t = ph(e) && e._reactRootContainer === void 0;
        t && S("You are calling ReactDOM.unmountComponentAtNode() on a container that was previously passed to ReactDOMClient.createRoot(). This is not supported. Did you mean to call root.unmount()?");
      }
      if (e._reactRootContainer) {
        {
          var a = OE(e), l = a && !Iu(a);
          l && S("unmountComponentAtNode(): The node you're attempting to unmount was rendered by another copy of React.");
        }
        return Fo(function() {
          Tg(null, null, e, !1, function() {
            e._reactRootContainer = null, cC(e);
          });
        }), !0;
      } else {
        {
          var s = OE(e), d = !!(s && Iu(s)), v = e.nodeType === $r && Kh(e.parentNode) && !!e.parentNode._reactRootContainer;
          d && S("unmountComponentAtNode(): The node you're attempting to unmount was rendered by React and is not a top-level container. %s", v ? "You may have accidentally passed in a React root node instead of its container." : "Instead, have the parent component update its state and rerender in order to remove this component.");
        }
        return !1;
      }
    }
    Ou(ON), k0(MN), Mf(NN), Lm(ja), Am(Mr), (typeof Map != "function" || // $FlowIssue Flow incorrectly thinks Map has no prototype
    Map.prototype == null || typeof Map.prototype.forEach != "function" || typeof Set != "function" || // $FlowIssue Flow incorrectly thinks Set has no prototype
    Set.prototype == null || typeof Set.prototype.clear != "function" || typeof Set.prototype.forEach != "function") && S("React depends on Map and Set built-in types. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills"), sm(KR), Gc(oE, PM, Fo);
    function XN(e, t) {
      var a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : null;
      if (!xg(t))
        throw new Error("Target container is not a DOM element.");
      return DN(e, t, null, a);
    }
    function KN(e, t, a, l) {
      return QN(e, t, a, l);
    }
    var ME = {
      usingClientEntryPoint: !1,
      // Keep in sync with ReactTestUtils.js.
      // This is an array for better minification.
      Events: [Iu, ed, dy, $c, ks, oE]
    };
    function ZN(e, t) {
      return ME.usingClientEntryPoint || S('You are importing createRoot from "react-dom" which is not supported. You should instead import it from "react-dom/client".'), HN(e, t);
    }
    function JN(e, t, a) {
      return ME.usingClientEntryPoint || S('You are importing hydrateRoot from "react-dom" which is not supported. You should instead import it from "react-dom/client".'), PN(e, t, a);
    }
    function eL(e) {
      return Cx() && S("flushSync was called from inside a lifecycle method. React cannot flush when React is already rendering. Consider moving this call to a scheduler task or micro task."), Fo(e);
    }
    var tL = FN({
      findFiberByHostInstance: ic,
      bundleType: 1,
      version: xE,
      rendererPackageName: "react-dom"
    });
    if (!tL && Ie && window.top === window.self && (navigator.userAgent.indexOf("Chrome") > -1 && navigator.userAgent.indexOf("Edge") === -1 || navigator.userAgent.indexOf("Firefox") > -1)) {
      var mT = window.location.protocol;
      /^(https?|file):$/.test(mT) && console.info("%cDownload the React DevTools for a better development experience: https://reactjs.org/link/react-devtools" + (mT === "file:" ? `
You might need to use a local HTTP server (instead of file://): https://reactjs.org/link/react-devtools-faq` : ""), "font-weight:bold");
    }
    Qa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ME, Qa.createPortal = XN, Qa.createRoot = ZN, Qa.findDOMNode = WN, Qa.flushSync = eL, Qa.hydrate = $N, Qa.hydrateRoot = JN, Qa.render = GN, Qa.unmountComponentAtNode = qN, Qa.unstable_batchedUpdates = oE, Qa.unstable_renderSubtreeIntoContainer = KN, Qa.version = xE, typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop == "function" && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
  }()), Qa;
}
function pR() {
  if (!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE != "function")) {
    if (process.env.NODE_ENV !== "production")
      throw new Error("^_^");
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(pR);
    } catch (i) {
      console.error(i);
    }
  }
}
process.env.NODE_ENV === "production" ? (pR(), rw.exports = hF()) : rw.exports = vF();
var mF = rw.exports, aw, Mg = mF;
if (process.env.NODE_ENV === "production")
  aw = Mg.createRoot, Mg.hydrateRoot;
else {
  var qT = Mg.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  aw = function(i, u) {
    qT.usingClientEntryPoint = !0;
    try {
      return Mg.createRoot(i, u);
    } finally {
      qT.usingClientEntryPoint = !1;
    }
  };
}
const yF = ({
  reactions: i,
  currentUserId: u,
  onToggleReaction: c,
  onAddReaction: p
}) => {
  const y = $o(null), w = $o(null), S = $o(null);
  if (Md(() => {
    const _ = y.current;
    if (_) {
      const A = document.createElement("div"), U = Cv(_, {
        interactive: !0,
        trigger: "click",
        placement: "bottom-start",
        appendTo: () => document.body,
        theme: "light",
        animation: "fade",
        render: () => (S.current || (S.current = aw(A)), S.current.render(
          /* @__PURE__ */ z.jsx(
            fL,
            {
              onSelection: (W) => {
                var X;
                p && p(W.html), (X = w.current) == null || X.hide();
              }
            }
          )
        ), {
          popper: A,
          onUpdate: () => {
          },
          onDestroy: () => {
            S.current && (S.current.unmount(), S.current = null);
          }
        })
      });
      return w.current = U, () => {
        var W;
        (W = w.current) == null || W.destroy(), w.current = null;
      };
    }
  }, [p]), i.length === 0)
    return null;
  const D = (_) => {
    c && c(_);
  };
  return /* @__PURE__ */ z.jsxs("div", { className: "blue-orange-chat-reactions-container", children: [
    i.map((_) => {
      const U = _.userIds.includes(u) ? "blue-orange-chat-reactions-pill blue-orange-chat-reactions-pill-active" : "blue-orange-chat-reactions-pill";
      return /* @__PURE__ */ z.jsxs(
        "button",
        {
          className: U,
          onClick: () => D(_.emoji),
          children: [
            /* @__PURE__ */ z.jsx(
              "span",
              {
                className: "blue-orange-chat-reactions-emoji",
                dangerouslySetInnerHTML: { __html: _.emoji }
              }
            ),
            /* @__PURE__ */ z.jsx("span", { className: "blue-orange-chat-reactions-count", children: _.userIds.length })
          ]
        },
        _.emoji
      );
    }),
    /* @__PURE__ */ z.jsx(
      "button",
      {
        ref: y,
        className: "blue-orange-chat-reactions-add",
        children: /* @__PURE__ */ z.jsx("i", { className: "ri-add-line" })
      }
    )
  ] });
}, hR = ({ typingUsers: i }) => {
  if (!i || i.length === 0)
    return null;
  const u = () => {
    const c = i.length;
    if (c === 1)
      return `${i[0].user.name} is typing`;
    if (c === 2)
      return `${i[0].user.name} and ${i[1].user.name} are typing`;
    const p = c - 2;
    return `${i[0].user.name}, ${i[1].user.name}, and ${p} ${p === 1 ? "other is" : "others are"} typing`;
  };
  return /* @__PURE__ */ z.jsxs("div", { className: "blue-orange-chat-typing-container", children: [
    /* @__PURE__ */ z.jsx("span", { className: "blue-orange-chat-typing-text", children: u() }),
    /* @__PURE__ */ z.jsxs("span", { className: "blue-orange-chat-typing-dots", children: [
      /* @__PURE__ */ z.jsx("span", { className: "blue-orange-chat-typing-dot" }),
      /* @__PURE__ */ z.jsx("span", { className: "blue-orange-chat-typing-dot" }),
      /* @__PURE__ */ z.jsx("span", { className: "blue-orange-chat-typing-dot" })
    ] })
  ] });
}, gF = ({ snoozedUsers: i }) => {
  const [u, c] = kd(!1);
  if (i.length === 0)
    return null;
  const p = i.map((w) => w.user.name), y = () => {
    if (p.length === 1)
      return /* @__PURE__ */ z.jsxs("span", { className: "blue-orange-chat-snoozed-text", children: [
        p[0],
        " has notifications snoozed"
      ] });
    if (p.length === 2)
      return /* @__PURE__ */ z.jsxs("span", { className: "blue-orange-chat-snoozed-text", children: [
        p[0],
        " and ",
        p[1],
        " have notifications snoozed"
      ] });
    if (u) {
      const S = p.slice(0, -1).join(", ");
      return /* @__PURE__ */ z.jsxs("span", { className: "blue-orange-chat-snoozed-text", children: [
        S,
        ", and ",
        p[p.length - 1],
        " have notifications snoozed",
        " ",
        /* @__PURE__ */ z.jsx(
          "button",
          {
            className: "blue-orange-chat-snoozed-toggle",
            onClick: () => c(!1),
            children: "show less"
          }
        )
      ] });
    }
    const w = p.length - 2;
    return /* @__PURE__ */ z.jsxs("span", { className: "blue-orange-chat-snoozed-text", children: [
      p[0],
      ", ",
      p[1],
      ", and",
      " ",
      /* @__PURE__ */ z.jsxs(
        "button",
        {
          className: "blue-orange-chat-snoozed-toggle",
          onClick: () => c(!0),
          children: [
            w,
            " ",
            w === 1 ? "other" : "others"
          ]
        }
      ),
      " ",
      "have notifications snoozed"
    ] });
  };
  return /* @__PURE__ */ z.jsxs("div", { className: "blue-orange-chat-snoozed-bar", children: [
    /* @__PURE__ */ z.jsx("i", { className: "ri-notification-off-line blue-orange-chat-snoozed-icon" }),
    y()
  ] });
};
let Ng;
const SF = new Uint8Array(16);
function EF() {
  if (!Ng && (Ng = typeof crypto < "u" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto), !Ng))
    throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
  return Ng(SF);
}
const Br = [];
for (let i = 0; i < 256; ++i)
  Br.push((i + 256).toString(16).slice(1));
function wF(i, u = 0) {
  return Br[i[u + 0]] + Br[i[u + 1]] + Br[i[u + 2]] + Br[i[u + 3]] + "-" + Br[i[u + 4]] + Br[i[u + 5]] + "-" + Br[i[u + 6]] + Br[i[u + 7]] + "-" + Br[i[u + 8]] + Br[i[u + 9]] + "-" + Br[i[u + 10]] + Br[i[u + 11]] + Br[i[u + 12]] + Br[i[u + 13]] + Br[i[u + 14]] + Br[i[u + 15]];
}
const CF = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), XT = {
  randomUUID: CF
};
function bF(i, u, c) {
  if (XT.randomUUID && !u && !i)
    return XT.randomUUID();
  i = i || {};
  const p = i.random || (i.rng || EF)();
  return p[6] = p[6] & 15 | 64, p[8] = p[8] & 63 | 128, wF(p);
}
const vR = ({
  onSend: i,
  placeholder: u = "Type a message...",
  replyTo: c,
  onCancelReply: p,
  users: y
}) => {
  const [w, S] = kd(""), [D, _] = kd([]), [A, U] = kd([]), [W, X] = kd(""), Q = ls((Me, ve, Se, O) => {
    S(Me), _(ve), U(Se);
  }, []), oe = (Me) => {
    const ve = document.createElement("div");
    return ve.innerHTML = Me, (ve.textContent || ve.innerText || "").trim().length === 0;
  }, we = ls(() => {
    oe(w) && A.length === 0 || (i(w, D, A), S(""), _([]), U([]), X(bF()));
  }, [w, D, A, i]), ce = (Me, ve = 80) => {
    const Se = document.createElement("div");
    Se.innerHTML = Me;
    const O = Se.textContent || Se.innerText || "";
    return O.length <= ve ? O : O.substring(0, ve) + "...";
  };
  return /* @__PURE__ */ z.jsxs("div", { className: "blue-orange-chat-input-container", children: [
    c && /* @__PURE__ */ z.jsxs("div", { className: "blue-orange-chat-input-reply-banner", children: [
      /* @__PURE__ */ z.jsxs("div", { className: "blue-orange-chat-input-reply-content", children: [
        /* @__PURE__ */ z.jsxs("span", { className: "blue-orange-chat-input-reply-label", children: [
          "Replying to ",
          /* @__PURE__ */ z.jsx("strong", { children: c.sender.user.name })
        ] }),
        /* @__PURE__ */ z.jsx("span", { className: "blue-orange-chat-input-reply-snippet", children: ce(c.content) })
      ] }),
      /* @__PURE__ */ z.jsx(
        "button",
        {
          className: "blue-orange-chat-input-reply-close",
          onClick: p,
          "aria-label": "Cancel reply",
          children: /* @__PURE__ */ z.jsx("i", { className: "ri-close-line" })
        }
      )
    ] }),
    /* @__PURE__ */ z.jsxs("div", { className: "blue-orange-chat-input-editor-row", children: [
      /* @__PURE__ */ z.jsx("div", { className: "blue-orange-chat-input-editor", children: /* @__PURE__ */ z.jsx(
        dL,
        {
          placeholder: u,
          allowEmojis: !0,
          allowMentions: !0,
          displayFormatting: !1,
          clearState: W,
          onChange: Q
        }
      ) }),
      /* @__PURE__ */ z.jsx(
        "button",
        {
          className: `blue-orange-chat-input-send-btn ${!oe(w) || A.length > 0 ? "blue-orange-chat-input-send-btn-active" : ""}`,
          onClick: we,
          "aria-label": "Send message",
          children: /* @__PURE__ */ z.jsx("i", { className: "ri-send-plane-2-fill" })
        }
      )
    ] })
  ] });
}, xF = {
  [er.ONLINE]: "Online",
  [er.AWAY]: "Away",
  [er.DND]: "Do Not Disturb",
  [er.OFFLINE]: "Offline"
}, TF = {
  [er.ONLINE]: "blue-orange-chat-user-detail-status-dot--online",
  [er.AWAY]: "blue-orange-chat-user-detail-status-dot--away",
  [er.DND]: "blue-orange-chat-user-detail-status-dot--dnd",
  [er.OFFLINE]: "blue-orange-chat-user-detail-status-dot--offline"
}, _F = ({ chatUser: i, onClose: u, children: c }) => {
  const p = i.snoozeUntil && new Date(i.snoozeUntil) > /* @__PURE__ */ new Date(), y = (S) => new Date(S).toLocaleString(void 0, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }), w = (S) => S || null;
  return /* @__PURE__ */ z.jsxs("div", { className: "blue-orange-chat-user-detail", children: [
    /* @__PURE__ */ z.jsxs("div", { className: "blue-orange-chat-user-detail-header", children: [
      /* @__PURE__ */ z.jsx("span", { className: "blue-orange-chat-user-detail-header-title", children: "Profile" }),
      /* @__PURE__ */ z.jsx("div", { className: "blue-orange-chat-user-detail-close-btn", onClick: u, children: /* @__PURE__ */ z.jsx("i", { className: "ri-close-line" }) })
    ] }),
    /* @__PURE__ */ z.jsxs("div", { className: "blue-orange-chat-user-detail-body", children: [
      /* @__PURE__ */ z.jsx("div", { className: "blue-orange-chat-user-detail-avatar", children: /* @__PURE__ */ z.jsx(iw, { user: i.user, height: 120, width: 120 }) }),
      /* @__PURE__ */ z.jsx("h2", { className: "blue-orange-chat-user-detail-name", children: i.user.name }),
      /* @__PURE__ */ z.jsxs("div", { className: "blue-orange-chat-user-detail-status", children: [
        /* @__PURE__ */ z.jsx("span", { className: `blue-orange-chat-user-detail-status-dot ${TF[i.status]}` }),
        /* @__PURE__ */ z.jsx("span", { className: "blue-orange-chat-user-detail-status-text", children: xF[i.status] })
      ] }),
      /* @__PURE__ */ z.jsxs("div", { className: "blue-orange-chat-user-detail-info", children: [
        i.user.email && /* @__PURE__ */ z.jsxs("div", { className: "blue-orange-chat-user-detail-info-row", children: [
          /* @__PURE__ */ z.jsx("span", { className: "blue-orange-chat-user-detail-info-label", children: "Email" }),
          /* @__PURE__ */ z.jsx("span", { className: "blue-orange-chat-user-detail-info-value", children: i.user.email })
        ] }),
        i.user.username && /* @__PURE__ */ z.jsxs("div", { className: "blue-orange-chat-user-detail-info-row", children: [
          /* @__PURE__ */ z.jsx("span", { className: "blue-orange-chat-user-detail-info-label", children: "Username" }),
          /* @__PURE__ */ z.jsx("span", { className: "blue-orange-chat-user-detail-info-value", children: i.user.username })
        ] }),
        w(i.user.telephone) && /* @__PURE__ */ z.jsxs("div", { className: "blue-orange-chat-user-detail-info-row", children: [
          /* @__PURE__ */ z.jsx("span", { className: "blue-orange-chat-user-detail-info-label", children: "Phone" }),
          /* @__PURE__ */ z.jsx("span", { className: "blue-orange-chat-user-detail-info-value", children: w(i.user.telephone) })
        ] })
      ] }),
      p && i.snoozeUntil && /* @__PURE__ */ z.jsxs("div", { className: "blue-orange-chat-user-detail-snooze", children: [
        /* @__PURE__ */ z.jsx("i", { className: "ri-notification-off-line" }),
        /* @__PURE__ */ z.jsxs("span", { children: [
          "Notifications snoozed until ",
          y(i.snoozeUntil)
        ] })
      ] }),
      c && /* @__PURE__ */ z.jsx("div", { className: "blue-orange-chat-user-detail-custom", children: c })
    ] })
  ] });
}, RF = ({
  parentMessage: i,
  replies: u,
  onSendReply: c,
  onClose: p,
  onLoadMore: y,
  hasMore: w = !1,
  loading: S = !1,
  typingUsers: D = [],
  currentUserId: _,
  onReact: A,
  onAvatarClick: U
}) => {
  const W = $o(null), X = $o(null), Q = $o(u.length);
  Md(() => {
    var ce;
    u.length > Q.current && ((ce = W.current) == null || ce.scrollIntoView({ behavior: "smooth" })), Q.current = u.length;
  }, [u.length]), Md(() => {
    var ce;
    (ce = W.current) == null || ce.scrollIntoView({ behavior: "auto" });
  }, [i.id]);
  const oe = () => {
    if (!y || !w || S) return;
    const ce = X.current;
    ce && ce.scrollTop === 0 && y();
  }, we = () => {
    const ce = [];
    return u.forEach((Me, ve) => {
      const Se = ve > 0 ? u[ve - 1].timestamp : null;
      Vg(Me.timestamp, Se) && ce.push(
        /* @__PURE__ */ z.jsx(I_, { date: Me.timestamp }, `date-${Me.id}`)
      );
      const O = ve > 0 && u[ve - 1].sender.user.id === Me.sender.user.id && !Vg(Me.timestamp, u[ve - 1].timestamp);
      ce.push(
        /* @__PURE__ */ z.jsx(
          KE,
          {
            message: Me,
            isConsecutive: O,
            onReact: A,
            onAvatarClick: U
          },
          Me.id
        )
      );
    }), ce;
  };
  return /* @__PURE__ */ z.jsxs("div", { className: "blue-orange-chat-thread-container", children: [
    /* @__PURE__ */ z.jsxs("div", { className: "blue-orange-chat-thread-header", children: [
      /* @__PURE__ */ z.jsxs("div", { className: "blue-orange-chat-thread-header-left", children: [
        /* @__PURE__ */ z.jsx("h3", { className: "blue-orange-chat-thread-title", children: "Thread" }),
        u.length > 0 && /* @__PURE__ */ z.jsxs("span", { className: "blue-orange-chat-thread-reply-count", children: [
          u.length,
          " ",
          u.length === 1 ? "reply" : "replies"
        ] })
      ] }),
      /* @__PURE__ */ z.jsx(
        "button",
        {
          className: "blue-orange-chat-thread-close-btn",
          onClick: p,
          "aria-label": "Close thread",
          children: /* @__PURE__ */ z.jsx("i", { className: "ri-close-line" })
        }
      )
    ] }),
    /* @__PURE__ */ z.jsx("div", { className: "blue-orange-chat-thread-parent", children: /* @__PURE__ */ z.jsx(
      KE,
      {
        message: i,
        onReact: A,
        onAvatarClick: U
      }
    ) }),
    u.length > 0 && /* @__PURE__ */ z.jsxs("div", { className: "blue-orange-chat-thread-separator", children: [
      /* @__PURE__ */ z.jsx("hr", { className: "blue-orange-chat-thread-separator-line" }),
      /* @__PURE__ */ z.jsxs("span", { className: "blue-orange-chat-thread-separator-text", children: [
        u.length,
        " ",
        u.length === 1 ? "reply" : "replies"
      ] }),
      /* @__PURE__ */ z.jsx("hr", { className: "blue-orange-chat-thread-separator-line" })
    ] }),
    /* @__PURE__ */ z.jsxs(
      "div",
      {
        className: "blue-orange-chat-thread-replies-body",
        ref: X,
        onScroll: oe,
        children: [
          S && /* @__PURE__ */ z.jsx("div", { className: "blue-orange-chat-thread-loading", children: "Loading..." }),
          we(),
          D.length > 0 && /* @__PURE__ */ z.jsx(hR, { typingUsers: D }),
          /* @__PURE__ */ z.jsx("div", { ref: W })
        ]
      }
    ),
    /* @__PURE__ */ z.jsx("div", { className: "blue-orange-chat-thread-input", children: /* @__PURE__ */ z.jsx(
      vR,
      {
        onSend: c,
        placeholder: "Reply..."
      }
    ) })
  ] });
}, DF = 5 * 60 * 1e3, AF = ({
  groups: i,
  messages: u,
  currentUser: c,
  activeConversation: p,
  typingUsers: y = [],
  snoozedUsers: w = [],
  workspaceName: S = "Chat",
  workspaceMedia: D,
  navItems: _ = [],
  activeNavItemId: A,
  sidebarState: U = yL.OPEN,
  onSidebarStateChange: W,
  onConversationClick: X,
  onSendMessage: Q,
  onLoadMoreMessages: oe,
  hasMoreMessages: we = !1,
  loadingMessages: ce = !1,
  onNewChat: Me,
  onSearch: ve,
  onStatusChange: Se,
  onSettingsClick: O,
  onProfileClick: be,
  onWorkspaceClick: le,
  onReactToMessage: ye,
  onReplyToMessage: ht,
  onAvatarClick: yt,
  threadParentMessage: Je,
  threadReplies: Ke = [],
  onSendThreadReply: ft,
  onCloseThread: Ee,
  threadTypingUsers: Ge = [],
  detailUser: xt,
  onCloseUserDetail: it,
  onGroupToggle: _t,
  onGroupCreateNew: J,
  onConversationContextMenu: De
}) => {
  const [se, ot] = kd(null), ut = ls((Ie) => {
    ot(Ie), ht && ht(Ie);
  }, [ht]), Kt = ls(() => {
    ot(null);
  }, []), Zt = ls((Ie, vt, Gt) => {
    Q && Q(Ie, vt, Gt), ot(null);
  }, [Q]), fn = ls(() => {
    oe && oe();
  }, [oe]), zt = (Ie, vt) => !(!vt || vt.sender.user.id !== Ie.sender.user.id || new Date(Ie.timestamp).getTime() - new Date(vt.timestamp).getTime() > DF || Vg(Ie.timestamp, vt.timestamp)), On = () => {
    const Ie = [];
    return u.forEach((vt, Gt) => {
      const Jt = Gt > 0 ? u[Gt - 1] : null, dn = Jt ? Jt.timestamp : null;
      Vg(vt.timestamp, dn) && Ie.push(
        /* @__PURE__ */ z.jsx(I_, { date: vt.timestamp }, `date-${vt.id}`)
      );
      const Bn = zt(vt, Jt);
      Ie.push(
        /* @__PURE__ */ z.jsx(
          KE,
          {
            message: vt,
            isConsecutive: Bn,
            onReply: ut,
            onReact: ye ? () => ye(vt, "") : void 0,
            onAvatarClick: yt,
            children: vt.reactions && vt.reactions.length > 0 && /* @__PURE__ */ z.jsx(
              yF,
              {
                reactions: vt.reactions,
                currentUserId: c.user.id,
                onToggleReaction: (zn) => {
                  ye && ye(vt, zn);
                },
                onAddReaction: (zn) => {
                  ye && ye(vt, zn);
                }
              }
            )
          },
          vt.id
        )
      );
    }), Ie;
  }, $t = () => _.length === 0 ? null : /* @__PURE__ */ z.jsx(z.Fragment, { children: _.map((Ie) => /* @__PURE__ */ z.jsx(
    ZT,
    {
      label: Ie.label,
      sortable: !1,
      active: A === Ie.id,
      focused: !1,
      icon: /* @__PURE__ */ z.jsx("i", { className: Ie.icon }),
      badge: Ie.badge,
      onClick: Ie.onClick
    },
    Ie.id
  )) }), mn = () => /* @__PURE__ */ z.jsx(
    EL,
    {
      state: U,
      onStateChange: W,
      header: /* @__PURE__ */ z.jsx(
        wL,
        {
          workspaceName: S,
          workspaceMedia: D,
          sidebarState: U,
          onStateChange: W,
          onNewChat: Me,
          onWorkspaceClick: le
        }
      ),
      footer: /* @__PURE__ */ z.jsx(
        RL,
        {
          user: c,
          onStatusChange: Se,
          onSettingsClick: O,
          onProfileClick: be
        }
      ),
      navItems: $t(),
      children: i.map((Ie) => /* @__PURE__ */ z.jsx(
        TL,
        {
          label: Ie.label,
          conversations: Ie.conversations,
          collapsed: Ie.collapsed,
          icon: Ie.icon,
          activeConversationId: p == null ? void 0 : p.id,
          onConversationClick: X,
          onConversationContextMenu: De,
          onToggle: _t ? () => _t(Ie.label) : void 0,
          onCreateNew: J ? () => J(Ie.label) : void 0
        },
        Ie.label
      ))
    }
  ), xn = () => /* @__PURE__ */ z.jsx("div", { className: "blue-orange-chat-layout-center", children: p ? /* @__PURE__ */ z.jsxs(z.Fragment, { children: [
    /* @__PURE__ */ z.jsxs("div", { className: "blue-orange-chat-layout-conversation-header", children: [
      /* @__PURE__ */ z.jsx("span", { className: "blue-orange-chat-layout-conversation-name", children: p.name }),
      /* @__PURE__ */ z.jsxs("span", { className: "blue-orange-chat-layout-member-count", children: [
        p.members.length,
        " ",
        p.members.length === 1 ? "member" : "members"
      ] })
    ] }),
    /* @__PURE__ */ z.jsxs(
      DL,
      {
        messages: u,
        onLoadMore: fn,
        loading: ce,
        hasMore: we,
        children: [
          On(),
          y.length > 0 && /* @__PURE__ */ z.jsx(hR, { typingUsers: y }),
          w.length > 0 && /* @__PURE__ */ z.jsx(gF, { snoozedUsers: w })
        ]
      }
    ),
    /* @__PURE__ */ z.jsx(
      vR,
      {
        onSend: Zt,
        replyTo: se,
        onCancelReply: Kt
      }
    )
  ] }) : /* @__PURE__ */ z.jsx("div", { className: "blue-orange-chat-layout-empty-state", children: "Select a conversation to start chatting" }) }), yn = !!xt || !!Je, Vn = () => xt && it ? /* @__PURE__ */ z.jsx(
    _F,
    {
      chatUser: xt,
      onClose: it
    }
  ) : Je && ft && Ee ? /* @__PURE__ */ z.jsx(
    RF,
    {
      parentMessage: Je,
      replies: Ke,
      onSendReply: ft,
      onClose: Ee,
      typingUsers: Ge,
      currentUserId: c.user.id,
      onReact: ye ? (Ie) => ye(Ie, "") : void 0,
      onAvatarClick: yt
    }
  ) : null;
  return /* @__PURE__ */ z.jsxs("div", { className: "blue-orange-chat-layout-container", children: [
    mn(),
    yn ? /* @__PURE__ */ z.jsxs(pL, { splitDirection: hL.RIGHT, children: [
      /* @__PURE__ */ z.jsx(vL, { children: xn() }),
      /* @__PURE__ */ z.jsx(mL, { children: Vn() })
    ] }) : xn()
  ] });
};
export {
  VE as ChatConversationType,
  vR as ChatInput,
  AF as ChatLayout,
  KE as ChatMessage,
  EL as ChatSidebar,
  RL as ChatSidebarFooter,
  TL as ChatSidebarGroup,
  wL as ChatSidebarHeader,
  xL as ChatSidebarItem,
  jF as ChatSidebarState,
  er as ChatUserStatus,
  DL as ChatWindow,
  I_ as DateSeparator,
  yF as MessageReactions,
  gF as SnoozedBar,
  RF as ThreadPanel,
  hR as TypingIndicator,
  _F as UserDetailPanel,
  k2 as formatDateSeparator,
  Vg as shouldShowDateSeparator
};
