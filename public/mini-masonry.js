var MiniMasonry = (function () {
  "use strict";
  function t(t) {
    return (
      (this._sizes = []),
      (this._columns = []),
      (this._container = null),
      (this._count = null),
      (this._width = 0),
      (this._removeListener = null),
      (this._currentGutterX = null),
      (this._currentGutterY = null),
      (this._resizeTimeout = null),
      (this.conf = {
        baseWidth: 255,
        gutterX: null,
        gutterY: null,
        gutter: 10,
        container: null,
        minify: !0,
        ultimateGutter: 5,
        surroundingGutter: !0,
        direction: "ltr",
        wedge: !1,
      }),
      this.init(t),
      this
    );
  }
  return (
    (t.prototype.init = function (t) {
      for (var i in this.conf) null != t[i] && (this.conf[i] = t[i]);
      if (
        ((null != this.conf.gutterX && null != this.conf.gutterY) ||
          (this.conf.gutterX = this.conf.gutterY = this.conf.gutter),
        (this._currentGutterX = this.conf.gutterX),
        (this._currentGutterY = this.conf.gutterY),
        (this._container =
          "object" == typeof this.conf.container && this.conf.container.nodeName
            ? this.conf.container
            : document.querySelector(this.conf.container)),
        !this._container)
      )
        throw new Error("Container not found or missing");
      var e = this.resizeThrottler.bind(this);
      window.addEventListener("resize", e),
        (this._removeListener = function () {
          window.removeEventListener("resize", e),
            null != this._resizeTimeout &&
              (window.clearTimeout(this._resizeTimeout),
              (this._resizeTimeout = null));
        }),
        this.layout();
    }),
    (t.prototype.reset = function () {
      (this._sizes = []),
        (this._columns = []),
        (this._count = null),
        (this._width = this._container.clientWidth);
      var t = this.conf.baseWidth;
      this._width < t &&
        ((this._width = t), (this._container.style.minWidth = t + "px")),
        1 == this.getCount()
          ? ((this._currentGutterX = this.conf.ultimateGutter),
            (this._count = 1))
          : this._width < this.conf.baseWidth + 2 * this._currentGutterX
          ? (this._currentGutterX = 0)
          : (this._currentGutterX = this.conf.gutterX);
    }),
    (t.prototype.getCount = function () {
      return this.conf.surroundingGutter
        ? Math.floor(
            (this._width - this._currentGutterX) /
              (this.conf.baseWidth + this._currentGutterX)
          )
        : Math.floor(
            (this._width + this._currentGutterX) /
              (this.conf.baseWidth + this._currentGutterX)
          );
    }),
    (t.prototype.computeWidth = function () {
      var t = this.conf.surroundingGutter
        ? (this._width - this._currentGutterX) / this._count -
          this._currentGutterX
        : (this._width + this._currentGutterX) / this._count -
          this._currentGutterX;
      return (t = Number.parseFloat(t.toFixed(2)));
    }),
    (t.prototype.layout = function () {
      if (this._container) {
        this.reset(), null == this._count && (this._count = this.getCount());
        for (var t = this.computeWidth(), i = 0; i < this._count; i++)
          this._columns[i] = 0;
        for (var e, n, r = this._container.children, s = 0; s < r.length; s++)
          (r[s].style.width = t + "px"), (this._sizes[s] = r[s].clientHeight);
        (e =
          "ltr" == this.conf.direction
            ? this.conf.surroundingGutter
              ? this._currentGutterX
              : 0
            : this._width -
              (this.conf.surroundingGutter ? this._currentGutterX : 0)),
          this._count > this._sizes.length &&
            ((n =
              this._sizes.length * (t + this._currentGutterX) -
              this._currentGutterX),
            !1 === this.conf.wedge
              ? (e =
                  "ltr" == this.conf.direction
                    ? (this._width - n) / 2
                    : this._width - (this._width - n) / 2)
              : "ltr" == this.conf.direction ||
                (e = this._width - this._currentGutterX));
        for (var o = 0; o < r.length; o++) {
          var h = this.conf.minify ? this.getShortest() : this.getNextColumn(o),
            u = 0;
          (!this.conf.surroundingGutter && h == this._columns.length) ||
            (u = this._currentGutterX);
          var c =
              "ltr" == this.conf.direction
                ? e + (t + u) * h
                : e - (t + u) * h - t,
            u = this._columns[h];
          (r[o].style.transform =
            "translate3d(" + Math.round(c) + "px," + Math.round(u) + "px,0)"),
            (this._columns[h] +=
              this._sizes[o] +
              (1 < this._count ? this.conf.gutterY : this.conf.ultimateGutter));
        }
        this._container.style.height =
          this._columns[this.getLongest()] - this._currentGutterY + "px";
      } else console.error("Container not found");
    }),
    (t.prototype.getNextColumn = function (t) {
      return t % this._columns.length;
    }),
    (t.prototype.getShortest = function () {
      for (var t = 0, i = 0; i < this._count; i++)
        this._columns[i] < this._columns[t] && (t = i);
      return t;
    }),
    (t.prototype.getLongest = function () {
      for (var t = 0, i = 0; i < this._count; i++)
        this._columns[i] > this._columns[t] && (t = i);
      return t;
    }),
    (t.prototype.resizeThrottler = function () {
      this._resizeTimeout ||
        (this._resizeTimeout = setTimeout(
          function () {
            (this._resizeTimeout = null),
              this._container.clientWidth != this._width && this.layout();
          }.bind(this),
          33
        ));
    }),
    (t.prototype.destroy = function () {
      "function" == typeof this._removeListener && this._removeListener();
      for (var t = this._container.children, i = 0; i < t.length; i++)
        t[i].style.removeProperty("width"),
          t[i].style.removeProperty("transform");
      this._container.style.removeProperty("height"),
        this._container.style.removeProperty("min-width");
    }),
    t
  );
})();
