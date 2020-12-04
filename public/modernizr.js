/*! modernizr 3.6.0 (Custom Build) | MIT *
 * https://modernizr.com/download/?-datachannel-devicemotion_deviceorientation-filereader-filesystem-fullscreen-geolocation-getusermedia-notification-peerconnection-touchevents-vibrate-webp-websockets-websocketsbinary-setclasses !*/
!(function(e, n, t) {
  function r(e, n) {
    return typeof e === n;
  }
  function i() {
    var e, n, t, i, o, a, s;
    for (var l in w)
      if (w.hasOwnProperty(l)) {
        if (
          ((e = []),
          (n = w[l]),
          n.name &&
            (e.push(n.name.toLowerCase()),
            n.options && n.options.aliases && n.options.aliases.length))
        )
          for (t = 0; t < n.options.aliases.length; t++)
            e.push(n.options.aliases[t].toLowerCase());
        for (i = r(n.fn, "function") ? n.fn() : n.fn, o = 0; o < e.length; o++)
          (a = e[o]),
            (s = a.split(".")),
            1 === s.length
              ? (Modernizr[s[0]] = i)
              : (!Modernizr[s[0]] ||
                  Modernizr[s[0]] instanceof Boolean ||
                  (Modernizr[s[0]] = new Boolean(Modernizr[s[0]])),
                (Modernizr[s[0]][s[1]] = i)),
            y.push((i ? "" : "no-") + s.join("-"));
      }
  }
  function o(e) {
    var n = x.className,
      t = Modernizr._config.classPrefix || "";
    if ((B && (n = n.baseVal), Modernizr._config.enableJSClass)) {
      var r = new RegExp("(^|\\s)" + t + "no-js(\\s|$)");
      n = n.replace(r, "$1" + t + "js$2");
    }
    Modernizr._config.enableClasses &&
      ((n += " " + t + e.join(" " + t)),
      B ? (x.className.baseVal = n) : (x.className = n));
  }
  function a(e) {
    return e
      .replace(/([a-z])-([a-z])/g, function(e, n, t) {
        return n + t.toUpperCase();
      })
      .replace(/^-/, "");
  }
  function s(e, n) {
    if ("object" == typeof e) for (var t in e) _(e, t) && s(t, e[t]);
    else {
      e = e.toLowerCase();
      var r = e.split("."),
        i = Modernizr[r[0]];
      if ((2 == r.length && (i = i[r[1]]), "undefined" != typeof i))
        return Modernizr;
      (n = "function" == typeof n ? n() : n),
        1 == r.length
          ? (Modernizr[r[0]] = n)
          : (!Modernizr[r[0]] ||
              Modernizr[r[0]] instanceof Boolean ||
              (Modernizr[r[0]] = new Boolean(Modernizr[r[0]])),
            (Modernizr[r[0]][r[1]] = n)),
        o([(n && 0 != n ? "" : "no-") + r.join("-")]),
        Modernizr._trigger(e, n);
    }
    return Modernizr;
  }
  function l() {
    return "function" != typeof n.createElement
      ? n.createElement(arguments[0])
      : B
      ? n.createElementNS.call(n, "http://www.w3.org/2000/svg", arguments[0])
      : n.createElement.apply(n, arguments);
  }
  function u() {
    var e = n.body;
    return e || ((e = l(B ? "svg" : "body")), (e.fake = !0)), e;
  }
  function f(e, t, r, i) {
    var o,
      a,
      s,
      f,
      c = "modernizr",
      A = l("div"),
      d = u();
    if (parseInt(r, 10))
      for (; r--; )
        (s = l("div")), (s.id = i ? i[r] : c + (r + 1)), A.appendChild(s);
    return (
      (o = l("style")),
      (o.type = "text/css"),
      (o.id = "s" + c),
      (d.fake ? d : A).appendChild(o),
      d.appendChild(A),
      o.styleSheet
        ? (o.styleSheet.cssText = e)
        : o.appendChild(n.createTextNode(e)),
      (A.id = c),
      d.fake &&
        ((d.style.background = ""),
        (d.style.overflow = "hidden"),
        (f = x.style.overflow),
        (x.style.overflow = "hidden"),
        x.appendChild(d)),
      (a = t(A, e)),
      d.fake
        ? (d.parentNode.removeChild(d), (x.style.overflow = f), x.offsetHeight)
        : A.parentNode.removeChild(A),
      !!a
    );
  }
  function c(e, n) {
    return !!~("" + e).indexOf(n);
  }
  function A(e, n) {
    return function() {
      return e.apply(n, arguments);
    };
  }
  function d(e, n, t) {
    var i;
    for (var o in e)
      if (e[o] in n)
        return t === !1
          ? e[o]
          : ((i = n[e[o]]), r(i, "function") ? A(i, t || n) : i);
    return !1;
  }
  function p(e) {
    return e
      .replace(/([A-Z])/g, function(e, n) {
        return "-" + n.toLowerCase();
      })
      .replace(/^ms-/, "-ms-");
  }
  function v(n, t, r) {
    var i;
    if ("getComputedStyle" in e) {
      i = getComputedStyle.call(e, n, t);
      var o = e.console;
      if (null !== i) r && (i = i.getPropertyValue(r));
      else if (o) {
        var a = o.error ? "error" : "log";
        o[a].call(
          o,
          "getComputedStyle returning null, its possible modernizr test results are inaccurate"
        );
      }
    } else i = !t && n.currentStyle && n.currentStyle[r];
    return i;
  }
  function m(n, r) {
    var i = n.length;
    if ("CSS" in e && "supports" in e.CSS) {
      for (; i--; ) if (e.CSS.supports(p(n[i]), r)) return !0;
      return !1;
    }
    if ("CSSSupportsRule" in e) {
      for (var o = []; i--; ) o.push("(" + p(n[i]) + ":" + r + ")");
      return (
        (o = o.join(" or ")),
        f(
          "@supports (" + o + ") { #modernizr { position: absolute; } }",
          function(e) {
            return "absolute" == v(e, null, "position");
          }
        )
      );
    }
    return t;
  }
  function g(e, n, i, o) {
    function s() {
      f && (delete P.style, delete P.modElem);
    }
    if (((o = r(o, "undefined") ? !1 : o), !r(i, "undefined"))) {
      var u = m(e, i);
      if (!r(u, "undefined")) return u;
    }
    for (
      var f, A, d, p, v, g = ["modernizr", "tspan", "samp"];
      !P.style && g.length;

    )
      (f = !0), (P.modElem = l(g.shift())), (P.style = P.modElem.style);
    for (d = e.length, A = 0; d > A; A++)
      if (
        ((p = e[A]),
        (v = P.style[p]),
        c(p, "-") && (p = a(p)),
        P.style[p] !== t)
      ) {
        if (o || r(i, "undefined")) return s(), "pfx" == n ? p : !0;
        try {
          P.style[p] = i;
        } catch (h) {}
        if (P.style[p] != v) return s(), "pfx" == n ? p : !0;
      }
    return s(), !1;
  }
  function h(e, n, t, i, o) {
    var a = e.charAt(0).toUpperCase() + e.slice(1),
      s = (e + " " + R.join(a + " ") + a).split(" ");
    return r(n, "string") || r(n, "undefined")
      ? g(s, n, i, o)
      : ((s = (e + " " + Q.join(a + " ") + a).split(" ")), d(s, n, t));
  }
  var y = [],
    w = [],
    b = {
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
        w.push({ name: e, fn: n, options: t });
      },
      addAsyncTest: function(e) {
        w.push({ name: null, fn: e });
      }
    },
    Modernizr = function() {};
  (Modernizr.prototype = b),
    (Modernizr = new Modernizr()),
    Modernizr.addTest("geolocation", "geolocation" in navigator),
    Modernizr.addTest("notification", function() {
      if (!e.Notification || !e.Notification.requestPermission) return !1;
      if ("granted" === e.Notification.permission) return !0;
      try {
        new e.Notification("");
      } catch (n) {
        if ("TypeError" === n.name) return !1;
      }
      return !0;
    });
  var C = !1;
  try {
    C = "WebSocket" in e && 2 === e.WebSocket.CLOSING;
  } catch (T) {}
  Modernizr.addTest("websockets", C),
    Modernizr.addTest("devicemotion", "DeviceMotionEvent" in e),
    Modernizr.addTest("deviceorientation", "DeviceOrientationEvent" in e),
    Modernizr.addTest("filereader", !!(e.File && e.FileList && e.FileReader)),
    Modernizr.addTest(
      "getUserMedia",
      "mediaDevices" in navigator && "getUserMedia" in navigator.mediaDevices
    ),
    Modernizr.addTest("websocketsbinary", function() {
      var n,
        t = "https:" == location.protocol ? "wss" : "ws";
      if ("WebSocket" in e) {
        if ((n = "binaryType" in WebSocket.prototype)) return n;
        try {
          return !!new WebSocket(t + "://.").binaryType;
        } catch (r) {}
      }
      return !1;
    });
  var S = b._config.usePrefixes
    ? " -webkit- -moz- -o- -ms- ".split(" ")
    : ["", ""];
  b._prefixes = S;
  var _,
    x = n.documentElement,
    B = "svg" === x.nodeName.toLowerCase();
  !(function() {
    var e = {}.hasOwnProperty;
    _ =
      r(e, "undefined") || r(e.call, "undefined")
        ? function(e, n) {
            return n in e && r(e.constructor.prototype[n], "undefined");
          }
        : function(n, t) {
            return e.call(n, t);
          };
  })(),
    (b._l = {}),
    (b.on = function(e, n) {
      this._l[e] || (this._l[e] = []),
        this._l[e].push(n),
        Modernizr.hasOwnProperty(e) &&
          setTimeout(function() {
            Modernizr._trigger(e, Modernizr[e]);
          }, 0);
    }),
    (b._trigger = function(e, n) {
      if (this._l[e]) {
        var t = this._l[e];
        setTimeout(function() {
          var e, r;
          for (e = 0; e < t.length; e++) (r = t[e])(n);
        }, 0),
          delete this._l[e];
      }
    }),
    Modernizr._q.push(function() {
      b.addTest = s;
    }),
    Modernizr.addAsyncTest(function() {
      function e(e, n, t) {
        function r(n) {
          var r = n && "load" === n.type ? 1 == i.width : !1,
            o = "webp" === e;
          s(e, o && r ? new Boolean(r) : r), t && t(n);
        }
        var i = new Image();
        (i.onerror = r), (i.onload = r), (i.src = n);
      }
      var n = [
          {
            uri:
              "data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=",
            name: "webp"
          },
          {
            uri:
              "data:image/webp;base64,UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAABBxAR/Q9ERP8DAABWUDggGAAAADABAJ0BKgEAAQADADQlpAADcAD++/1QAA==",
            name: "webp.alpha"
          },
          {
            uri:
              "data:image/webp;base64,UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA",
            name: "webp.animation"
          },
          {
            uri:
              "data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=",
            name: "webp.lossless"
          }
        ],
        t = n.shift();
      e(t.name, t.uri, function(t) {
        if (t && "load" === t.type)
          for (var r = 0; r < n.length; r++) e(n[r].name, n[r].uri);
      });
    });
  var k = "Moz O ms Webkit",
    Q = b._config.usePrefixes ? k.toLowerCase().split(" ") : [];
  b._domPrefixes = Q;
  var R = b._config.usePrefixes ? k.split(" ") : [];
  b._cssomPrefixes = R;
  var U = function(n) {
    var r,
      i = S.length,
      o = e.CSSRule;
    if ("undefined" == typeof o) return t;
    if (!n) return !1;
    if (
      ((n = n.replace(/^@/, "")),
      (r = n.replace(/-/g, "_").toUpperCase() + "_RULE"),
      r in o)
    )
      return "@" + n;
    for (var a = 0; i > a; a++) {
      var s = S[a],
        l = s.toUpperCase() + "_" + r;
      if (l in o) return "@-" + s.toLowerCase() + "-" + n;
    }
    return !1;
  };
  b.atRule = U;
  var E = (b.testStyles = f);
  Modernizr.addTest("touchevents", function() {
    var t;
    if ("ontouchstart" in e || (e.DocumentTouch && n instanceof DocumentTouch))
      t = !0;
    else {
      var r = [
        "@media (",
        S.join("touch-enabled),("),
        "heartz",
        ")",
        "{#modernizr{top:9px;position:absolute}}"
      ].join("");
      E(r, function(e) {
        t = 9 === e.offsetTop;
      });
    }
    return t;
  });
  var D = { elem: l("modernizr") };
  Modernizr._q.push(function() {
    delete D.elem;
  });
  var P = { style: D.elem.style };
  Modernizr._q.unshift(function() {
    delete P.style;
  }),
    (b.testAllProps = h);
  var N = (b.prefixed = function(e, n, t) {
    return 0 === e.indexOf("@")
      ? U(e)
      : (-1 != e.indexOf("-") && (e = a(e)), n ? h(e, n, t) : h(e, "pfx"));
  });
  Modernizr.addTest(
    "fullscreen",
    !(!N("exitFullscreen", n, !1) && !N("cancelFullScreen", n, !1))
  ),
    Modernizr.addTest("vibrate", !!N("vibrate", navigator)),
    Modernizr.addTest("filesystem", !!N("requestFileSystem", e)),
    Modernizr.addTest("peerconnection", !!N("RTCPeerConnection", e)),
    Modernizr.addTest("datachannel", function() {
      if (!Modernizr.peerconnection) return !1;
      for (var n = 0, t = Q.length; t > n; n++) {
        var r = e[Q[n] + "RTCPeerConnection"];
        if (r) {
          var i = new r(null);
          return "createDataChannel" in i;
        }
      }
      return !1;
    }),
    i(),
    o(y),
    delete b.addTest,
    delete b.addAsyncTest;
  for (var z = 0; z < Modernizr._q.length; z++) Modernizr._q[z]();
  e.Modernizr = Modernizr;
})(window, document);
