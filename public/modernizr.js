/*! modernizr 3.6.0 (Custom Build) | MIT *
 * https://modernizr.com/download/?-datachannel-devicemotion_deviceorientation-geolocation-getusermedia-localstorage-peerconnection-touchevents-websockets-setclasses !*/
!(function(e, n, t) {
  function r(e, n) {
    return typeof e === n;
  }
  function o() {
    var e, n, t, o, i, a, s;
    for (var l in C)
      if (C.hasOwnProperty(l)) {
        if (
          ((e = []),
          (n = C[l]),
          n.name &&
            (e.push(n.name.toLowerCase()),
            n.options && n.options.aliases && n.options.aliases.length))
        )
          for (t = 0; t < n.options.aliases.length; t++)
            e.push(n.options.aliases[t].toLowerCase());
        for (o = r(n.fn, "function") ? n.fn() : n.fn, i = 0; i < e.length; i++)
          (a = e[i]),
            (s = a.split(".")),
            1 === s.length
              ? (Modernizr[s[0]] = o)
              : (!Modernizr[s[0]] ||
                  Modernizr[s[0]] instanceof Boolean ||
                  (Modernizr[s[0]] = new Boolean(Modernizr[s[0]])),
                (Modernizr[s[0]][s[1]] = o)),
            y.push((o ? "" : "no-") + s.join("-"));
      }
  }
  function i(e) {
    var n = x.className,
      t = Modernizr._config.classPrefix || "";
    if ((T && (n = n.baseVal), Modernizr._config.enableJSClass)) {
      var r = new RegExp("(^|\\s)" + t + "no-js(\\s|$)");
      n = n.replace(r, "$1" + t + "js$2");
    }
    Modernizr._config.enableClasses &&
      ((n += " " + t + e.join(" " + t)),
      T ? (x.className.baseVal = n) : (x.className = n));
  }
  function a(e) {
    return e
      .replace(/([a-z])-([a-z])/g, function(e, n, t) {
        return n + t.toUpperCase();
      })
      .replace(/^-/, "");
  }
  function s() {
    return "function" != typeof n.createElement
      ? n.createElement(arguments[0])
      : T
      ? n.createElementNS.call(n, "http://www.w3.org/2000/svg", arguments[0])
      : n.createElement.apply(n, arguments);
  }
  function l() {
    var e = n.body;
    return e || ((e = s(T ? "svg" : "body")), (e.fake = !0)), e;
  }
  function u(e, t, r, o) {
    var i,
      a,
      u,
      f,
      c = "modernizr",
      d = s("div"),
      p = l();
    if (parseInt(r, 10))
      for (; r--; )
        (u = s("div")), (u.id = o ? o[r] : c + (r + 1)), d.appendChild(u);
    return (
      (i = s("style")),
      (i.type = "text/css"),
      (i.id = "s" + c),
      (p.fake ? p : d).appendChild(i),
      p.appendChild(d),
      i.styleSheet
        ? (i.styleSheet.cssText = e)
        : i.appendChild(n.createTextNode(e)),
      (d.id = c),
      p.fake &&
        ((p.style.background = ""),
        (p.style.overflow = "hidden"),
        (f = x.style.overflow),
        (x.style.overflow = "hidden"),
        x.appendChild(p)),
      (a = t(d, e)),
      p.fake
        ? (p.parentNode.removeChild(p), (x.style.overflow = f), x.offsetHeight)
        : d.parentNode.removeChild(d),
      !!a
    );
  }
  function f(e, n) {
    return function() {
      return e.apply(n, arguments);
    };
  }
  function c(e, n, t) {
    var o;
    for (var i in e)
      if (e[i] in n)
        return t === !1
          ? e[i]
          : ((o = n[e[i]]), r(o, "function") ? f(o, t || n) : o);
    return !1;
  }
  function d(e, n) {
    return !!~("" + e).indexOf(n);
  }
  function p(n, t, r) {
    var o;
    if ("getComputedStyle" in e) {
      o = getComputedStyle.call(e, n, t);
      var i = e.console;
      if (null !== o) r && (o = o.getPropertyValue(r));
      else if (i) {
        var a = i.error ? "error" : "log";
        i[a].call(
          i,
          "getComputedStyle returning null, its possible modernizr test results are inaccurate"
        );
      }
    } else o = !t && n.currentStyle && n.currentStyle[r];
    return o;
  }
  function v(e) {
    return e
      .replace(/([A-Z])/g, function(e, n) {
        return "-" + n.toLowerCase();
      })
      .replace(/^ms-/, "-ms-");
  }
  function m(n, r) {
    var o = n.length;
    if ("CSS" in e && "supports" in e.CSS) {
      for (; o--; ) if (e.CSS.supports(v(n[o]), r)) return !0;
      return !1;
    }
    if ("CSSSupportsRule" in e) {
      for (var i = []; o--; ) i.push("(" + v(n[o]) + ":" + r + ")");
      return (
        (i = i.join(" or ")),
        u(
          "@supports (" + i + ") { #modernizr { position: absolute; } }",
          function(e) {
            return "absolute" == p(e, null, "position");
          }
        )
      );
    }
    return t;
  }
  function g(e, n, o, i) {
    function l() {
      f && (delete L.style, delete L.modElem);
    }
    if (((i = r(i, "undefined") ? !1 : i), !r(o, "undefined"))) {
      var u = m(e, o);
      if (!r(u, "undefined")) return u;
    }
    for (
      var f, c, p, v, g, h = ["modernizr", "tspan", "samp"];
      !L.style && h.length;

    )
      (f = !0), (L.modElem = s(h.shift())), (L.style = L.modElem.style);
    for (p = e.length, c = 0; p > c; c++)
      if (
        ((v = e[c]),
        (g = L.style[v]),
        d(v, "-") && (v = a(v)),
        L.style[v] !== t)
      ) {
        if (i || r(o, "undefined")) return l(), "pfx" == n ? v : !0;
        try {
          L.style[v] = o;
        } catch (y) {}
        if (L.style[v] != g) return l(), "pfx" == n ? v : !0;
      }
    return l(), !1;
  }
  function h(e, n, t, o, i) {
    var a = e.charAt(0).toUpperCase() + e.slice(1),
      s = (e + " " + k.join(a + " ") + a).split(" ");
    return r(n, "string") || r(n, "undefined")
      ? g(s, n, o, i)
      : ((s = (e + " " + E.join(a + " ") + a).split(" ")), c(s, n, t));
  }
  var y = [],
    C = [],
    S = {
      _version: "3.6.0",
      _config: {
        classPrefix: "",
        enableClasses: !0,
        enableJSClass: !0,
        usePrefixes: !0
      },
      _q: [],
      on: function(e, n) {
        var t = this;
        setTimeout(function() {
          n(t[e]);
        }, 0);
      },
      addTest: function(e, n, t) {
        C.push({ name: e, fn: n, options: t });
      },
      addAsyncTest: function(e) {
        C.push({ name: null, fn: e });
      }
    },
    Modernizr = function() {};
  (Modernizr.prototype = S),
    (Modernizr = new Modernizr()),
    Modernizr.addTest("geolocation", "geolocation" in navigator);
  var w = !1;
  try {
    w = "WebSocket" in e && 2 === e.WebSocket.CLOSING;
  } catch (_) {}
  Modernizr.addTest("websockets", w),
    Modernizr.addTest("devicemotion", "DeviceMotionEvent" in e),
    Modernizr.addTest("deviceorientation", "DeviceOrientationEvent" in e),
    Modernizr.addTest("localstorage", function() {
      var e = "modernizr";
      try {
        return localStorage.setItem(e, e), localStorage.removeItem(e), !0;
      } catch (n) {
        return !1;
      }
    }),
    Modernizr.addTest(
      "getUserMedia",
      "mediaDevices" in navigator && "getUserMedia" in navigator.mediaDevices
    );
  var x = n.documentElement,
    T = "svg" === x.nodeName.toLowerCase(),
    b = S._config.usePrefixes
      ? " -webkit- -moz- -o- -ms- ".split(" ")
      : ["", ""];
  S._prefixes = b;
  var z = "Moz O ms Webkit",
    E = S._config.usePrefixes ? z.toLowerCase().split(" ") : [];
  S._domPrefixes = E;
  var P = (S.testStyles = u);
  Modernizr.addTest("touchevents", function() {
    var t;
    if ("ontouchstart" in e || (e.DocumentTouch && n instanceof DocumentTouch))
      t = !0;
    else {
      var r = [
        "@media (",
        b.join("touch-enabled),("),
        "heartz",
        ")",
        "{#modernizr{top:9px;position:absolute}}"
      ].join("");
      P(r, function(e) {
        t = 9 === e.offsetTop;
      });
    }
    return t;
  });
  var k = S._config.usePrefixes ? z.split(" ") : [];
  S._cssomPrefixes = k;
  var N = function(n) {
    var r,
      o = b.length,
      i = e.CSSRule;
    if ("undefined" == typeof i) return t;
    if (!n) return !1;
    if (
      ((n = n.replace(/^@/, "")),
      (r = n.replace(/-/g, "_").toUpperCase() + "_RULE"),
      r in i)
    )
      return "@" + n;
    for (var a = 0; o > a; a++) {
      var s = b[a],
        l = s.toUpperCase() + "_" + r;
      if (l in i) return "@-" + s.toLowerCase() + "-" + n;
    }
    return !1;
  };
  S.atRule = N;
  var j = { elem: s("modernizr") };
  Modernizr._q.push(function() {
    delete j.elem;
  });
  var L = { style: j.elem.style };
  Modernizr._q.unshift(function() {
    delete L.style;
  }),
    (S.testAllProps = h);
  var O = (S.prefixed = function(e, n, t) {
    return 0 === e.indexOf("@")
      ? N(e)
      : (-1 != e.indexOf("-") && (e = a(e)), n ? h(e, n, t) : h(e, "pfx"));
  });
  Modernizr.addTest("peerconnection", !!O("RTCPeerConnection", e)),
    Modernizr.addTest("datachannel", function() {
      if (!Modernizr.peerconnection) return !1;
      for (var n = 0, t = E.length; t > n; n++) {
        var r = e[E[n] + "RTCPeerConnection"];
        if (r) {
          var o = new r(null);
          return "createDataChannel" in o;
        }
      }
      return !1;
    }),
    o(),
    i(y),
    delete S.addTest,
    delete S.addAsyncTest;
  for (var R = 0; R < Modernizr._q.length; R++) Modernizr._q[R]();
  e.Modernizr = Modernizr;
})(window, document);
