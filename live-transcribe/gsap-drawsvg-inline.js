let gsap, _toArray, _doc, _win, _isEdge, _coreInitted, _warned, _getStyleSaver, _reverting,
  _windowExists = () => "undefined" != typeof window,
  _getGSAP = () => gsap || _windowExists() && (gsap = window.gsap) && gsap.registerPlugin && gsap,
  _numExp = /[-+=\.]*\d+[\.e\-\+]*\d*[e\-\+]*\d*/gi,
  _types = {
    rect: ["width", "height"],
    circle: ["r", "r"],
    ellipse: ["rx", "ry"],
    line: ["x2",
      "y2"
    ]
  },
  _round = e => Math.round(1e4 * e) / 1e4,
  _parseNum = e => parseFloat(e) || 0,
  _parseSingleVal = (e, t) => { let r = _parseNum(e); return ~e.indexOf("%") ? r / 100 * t : r },
  _getAttributeAsNumber = (e, t) => _parseNum(e.getAttribute(t)),
  _sqrt = Math.sqrt,
  _getDistance = (e, t, r, s, i, n) => _sqrt(((_parseNum(r) - _parseNum(e)) * i) ** 2 + ((_parseNum(
    s) - _parseNum(t)) * n) ** 2),
  _warn = e => console.warn(e),
  _hasNonScalingStroke = e => "non-scaling-stroke" === e.getAttribute("vector-effect"),
  _bonusValidated = 1,
  _parse = (e, t, r) => {
    let s = e.indexOf(" "),
      i, n;
    return s < 0 ? (i = void 0 !== r ? r + "" : e, n = e) : (i = e.substr(0, s), n = e
      .substr(s + 1)), (i = _parseSingleVal(i, t)) > (n = _parseSingleVal(n, t)) ? [n, i] : [i,
      n
    ]
  },
  _getLength = e => {
    if (!(e = _toArray(e)[0])) return 0;
    let t = e.tagName.toLowerCase(),
      r = e.style,
      s = 1,
      i = 1,
      n, a, o, g, l, d, $;
    _hasNonScalingStroke(e) && (s = _sqrt((i = e.getScreenCTM()).a * i.a + i.b * i.b), i = _sqrt(i
      .d * i.d + i.c * i.c));
    try { a = e.getBBox() } catch (h) {
      _warn(
        "Some browsers won't measure invisible elements (like display:none or masks inside defs)."
      )
    }
    let { x: u, y: p, width: f, height: y } = a || { x: 0, y: 0, width: 0, height: 0 };
    if (
      a && (f || y) || !_types[t] || (f = _getAttributeAsNumber(e, _types[t][0]), y =
        _getAttributeAsNumber(e, _types[t][1]), "rect" !== t && "line" !== t && (f *= 2, y *= 2),
        "line" === t && (u = _getAttributeAsNumber(e, "x1"), p = _getAttributeAsNumber(e, "y1"), f =
          Math.abs(f - u), y = Math.abs(y - p))), "path" === t) g = r.strokeDasharray, r
      .strokeDasharray = "none", n = e.getTotalLength() || 0, _round(s) !== _round(i) && !_warned &&
      (_warned = 1) && _warn(
        "Warning: <path> length cannot be measured when vector-effect is non-scaling-stroke and the element isn't proportionally scaled."
      ), n *= (s + i) / 2, r.strokeDasharray = g;
    else if ("rect" === t) n = 2 * f * s + 2 * y * i;
    else if ("line" === t) n = _getDistance(u, p, u + f, p + y, s, i);
    else if ("polyline" === t || "polygon" === t)
      for (o = e.getAttribute("points").match(_numExp) || [], "polygon" === t && o.push(o[0], o[1]),
        n = 0, l = 2; l < o.length; l += 2) n += _getDistance(o[l - 2], o[l - 1], o[l], o[l + 1], s,
        i) || 0;
    else("circle" === t || "ellipse" === t) && (n = Math.PI * (3 * ((d = f / 2 * s) + ($ = y / 2 *
      i)) - _sqrt((3 * d + $) * (d + 3 * $))));
    return n || 0
  },
  _getPosition = (e, t) => {
    if (!(e = _toArray(e)[0])) return [0, 0];
    t || (t = _getLength(e) + 1);
    let r = _win.getComputedStyle(e),
      s = r.strokeDasharray || "",
      i = _parseNum(r.strokeDashoffset),
      n = s.indexOf(",");
    return n < 0 && (n = s.indexOf(" ")), (s = n < 0 ? t : _parseNum(s.substr(
      0, n))) > t && (s = t), [-i || 0, s - i || 0]
  },
  _initCore = () => {
    _windowExists() && (_doc = document, _win = window, _coreInitted = gsap =
      _getGSAP(), _toArray = gsap.utils.toArray, _getStyleSaver = gsap.core.getStyleSaver,
      _reverting = gsap.core.reverting || function () {}, _isEdge = -1 !== ((_win.navigator || {})
        .userAgent || "").indexOf("Edge"))
  };
export const DrawSVGPlugin = {
  version: "3.12.5",
  name: "drawSVG",
  register(e) {
    gsap = e,
      _initCore()
  },
  init(e, t, r, s, i) {
    if (!e.getBBox) return !1;
    _coreInitted || _initCore();
    let n = _getLength(e),
      a, o, g;
    return this.styles = _getStyleSaver && _getStyleSaver(e,
        "strokeDashoffset,strokeDasharray,strokeMiterlimit"), this.tween = r, this._style = e
      .style, this._target = e, t + "" == "true" ? t = "0 100%" : t ? -1 === (t + "").indexOf(
        " ") && (t = "0 " + t) : t = "0 0", a = _getPosition(e, n), o = _parse(t, n, a[0]), this
      ._length = _round(n), this._dash = _round(a[1] - a[0]), this._offset = _round(-a[0]), this
      ._dashPT = this.add(this, "_dash", this._dash, _round(o[1] - o[0]), 0, 0, 0, 0, 0, 1), this
      ._offsetPT = this.add(this, "_offset", this._offset, _round(-o[0]), 0, 0, 0, 0, 0, 1),
      _isEdge && (g = _win.getComputedStyle(e)).strokeLinecap !== g.strokeLinejoin && (o =
        _parseNum(g.strokeMiterlimit), this.add(e.style, "strokeMiterlimit", o, o + .01)), this
      ._live = _hasNonScalingStroke(e) || ~(t + "").indexOf("live"), this._nowrap = ~(t + "")
      .indexOf("nowrap"), this._props.push("drawSVG"), _bonusValidated
  },
  render(e, t) {
    if (t
      .tween._time || !_reverting()) {
      let r = t._pt,
        s = t._style,
        i, n, a, o;
      if (r) {
        for (t._live && (i = _getLength(t._target)) !== t._length && (n = i /
            t._length, t._length = i, t._offsetPT && (t._offsetPT.s *= n, t._offsetPT.c *= n), t
            ._dashPT ? (t._dashPT.s *= n, t._dashPT.c *= n) : t._dash *= n); r;) r.r(e, r.d), r =
          r._next;
        a = t._dash || e && 1 !== e && 1e-4 || 0, i = t._length - a + .1, o = t._offset, a && o &&
          a + Math.abs(o % t._length) > t._length - .2 && (o += o < 0 ? .1 : -.1) && (i += .1), s
          .strokeDashoffset = a ? o : o + .001, s.strokeDasharray = i < .2 ? "none" : a ? a +
          "px," + (t._nowrap ? 999999 : i) + "px" : "0px, 999999px"
      }
    } else t.styles.revert()
  },
  getLength: _getLength,
  getPosition: _getPosition
};
_getGSAP() && gsap?.registerPlugin(DrawSVGPlugin);
export { DrawSVGPlugin as default };