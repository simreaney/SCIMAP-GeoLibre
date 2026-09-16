const W = [
  [1, "Woodland"],
  [2, "Arable"],
  [3, "Improved Grassland"],
  [4, "Extensive Grassland"],
  [5, "Moorland"],
  [6, "Urban"],
  [7, "Other"]
], V = new Map(W), H = 7, J = /* @__PURE__ */ new Map([
  [1, 1],
  //  Broadleaved woodland -> Woodland
  [2, 1],
  //  Coniferous woodland -> Woodland
  [3, 2],
  //  Arable and horticulture -> Arable
  [4, 3],
  //  Improved grassland -> Improved Grassland
  [5, 4],
  //  Rough grassland -> Extensive Grassland
  [6, 4],
  //  Neutral grassland -> Extensive Grassland
  [7, 4],
  //  Calcareous grassland -> Extensive Grassland
  [8, 4],
  //  Acid grassland -> Extensive Grassland
  [9, 5],
  //  Fen, marsh, swamp -> Moorland
  [10, 5],
  // Heather -> Moorland
  [11, 5],
  // Heather grassland -> Moorland
  [12, 5],
  // Bog -> Moorland
  [13, 5],
  // Montane habitats -> Moorland
  [14, 7],
  // Inland rock -> Other
  [15, 7],
  // Saltwater -> Other
  [16, 7],
  // Freshwater -> Other
  [17, 7],
  // Supra-littoral rock -> Other
  [18, 7],
  // Supra-littoral sediment -> Other
  [19, 7],
  // Littoral rock -> Other
  [20, 7],
  // Littoral sediment -> Other
  [21, 7],
  // Saltmarsh -> Other
  [22, 6],
  // Urban -> Urban
  [23, 6]
  // Suburban -> Urban
]), q = /* @__PURE__ */ new Map([
  [1, 0.2],
  //  Woodland
  [2, 1],
  //  Arable
  [3, 0.3],
  //  Improved Grassland
  [4, 0.15],
  // Extensive Grassland
  [5, 0.3],
  //  Moorland
  [6, 0.5],
  //  Urban
  [7, 0.5]
  //  Other
]), D = [
  "magma",
  "viridis",
  "plasma",
  "inferno",
  "cividis",
  "spectral",
  "turbo"
], O = 8e5, X = "1.4.0", Y = `https://cdn.jsdelivr.net/npm/geolibre-wasm@${X}/`, Z = "geolibre_wasm_bg.wasm", K = "geolibre-cli.wasm";
function T(n) {
  try {
    const r = new URL(n, import.meta.url);
    if (r.protocol === "http:" || r.protocol === "https:")
      return r.href;
  } catch {
  }
  return `${Y}${n}`;
}
function Q() {
  return { bindgen: T(Z), cli: T(K) };
}
const j = `class Ot {
  __destroy_into_raw() {
    const t = this.__wbg_ptr;
    return this.__wbg_ptr = 0, Me.unregister(this), t;
  }
  free() {
    const t = this.__destroy_into_raw();
    _.__wbg_cogbuilder_free(t, 0);
  }
  /**
   * New builder for a \`width\` x \`height\` raster with \`bands\` bands.
   * @param {number} width
   * @param {number} height
   * @param {number} bands
   */
  constructor(t, e, n) {
    const i = _.cogbuilder_new(t, e, n);
    return this.__wbg_ptr = i, Me.register(this, this.__wbg_ptr, this), this;
  }
  /**
   * Force BigTIFF (64-bit offsets) for very large outputs.
   * @param {boolean} on
   */
  set_bigtiff(t) {
    _.cogbuilder_set_bigtiff(this.__wbg_ptr, t);
  }
  /**
   * Compression: \`none\`, \`lzw\`, \`deflate\`, \`packbits\`, \`webp\`, \`jpeg\`, \`jpegxl\`.
   * @param {string} name
   */
  set_compression(t) {
    try {
      const i = _.__wbindgen_add_to_stack_pointer(-16), s = Xe(t, _.__wbindgen_export2, _.__wbindgen_export3), o = T;
      _.cogbuilder_set_compression(i, this.__wbg_ptr, s, o);
      var e = g().getInt32(i + 0, !0), n = g().getInt32(i + 4, !0);
      if (n)
        throw M(e);
    } finally {
      _.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Set the EPSG code (1..=65535).
   * @param {number} epsg
   */
  set_epsg(t) {
    _.cogbuilder_set_epsg(this.__wbg_ptr, t);
  }
  /**
   * Set the full affine geo-transform:
   * \`[x_origin, pixel_width, row_rotation, y_origin, col_rotation, pixel_height]\`.
   * @param {Float64Array} gt
   */
  set_geo_transform(t) {
    try {
      const i = _.__wbindgen_add_to_stack_pointer(-16), s = gt(t, _.__wbindgen_export2), o = T;
      _.cogbuilder_set_geo_transform(i, this.__wbg_ptr, s, o);
      var e = g().getInt32(i + 0, !0), n = g().getInt32(i + 4, !0);
      if (n)
        throw M(e);
    } finally {
      _.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Set the no-data sentinel value.
   * @param {number} v
   */
  set_nodata(t) {
    _.cogbuilder_set_nodata(this.__wbg_ptr, t);
  }
  /**
   * Convenience: north-up geo-transform from upper-left origin and pixel size.
   * @param {number} x_min
   * @param {number} y_max
   * @param {number} pixel_size
   */
  set_origin(t, e, n) {
    _.cogbuilder_set_origin(this.__wbg_ptr, t, e, n);
  }
  /**
   * Explicit overview decimation factors (e.g. \`[2,4,8]\`); empty disables overviews.
   * @param {Uint32Array} levels
   */
  set_overview_levels(t) {
    const e = Fn(t, _.__wbindgen_export2), n = T;
    _.cogbuilder_set_overview_levels(this.__wbg_ptr, e, n);
  }
  /**
   * Internal tile size in pixels (default 512).
   * @param {number} px
   */
  set_tile_size(t) {
    _.cogbuilder_set_tile_size(this.__wbg_ptr, t);
  }
  /**
   * Encode \`f32\` pixel data to a COG. \`Uint8Array\`.
   * @param {Float32Array} data
   * @returns {Uint8Array}
   */
  write_f32(t) {
    try {
      const a = _.__wbindgen_add_to_stack_pointer(-16), c = Cn(t, _.__wbindgen_export2), l = T;
      _.cogbuilder_write_f32(a, this.__wbg_ptr, c, l);
      var e = g().getInt32(a + 0, !0), n = g().getInt32(a + 4, !0), i = g().getInt32(a + 8, !0), s = g().getInt32(a + 12, !0);
      if (s)
        throw M(i);
      var o = xt(e, n).slice();
      return _.__wbindgen_export(e, n * 1, 1), o;
    } finally {
      _.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Encode \`f64\` pixel data to a COG. \`Uint8Array\`.
   * @param {Float64Array} data
   * @returns {Uint8Array}
   */
  write_f64(t) {
    try {
      const a = _.__wbindgen_add_to_stack_pointer(-16), c = gt(t, _.__wbindgen_export2), l = T;
      _.cogbuilder_write_f64(a, this.__wbg_ptr, c, l);
      var e = g().getInt32(a + 0, !0), n = g().getInt32(a + 4, !0), i = g().getInt32(a + 8, !0), s = g().getInt32(a + 12, !0);
      if (s)
        throw M(i);
      var o = xt(e, n).slice();
      return _.__wbindgen_export(e, n * 1, 1), o;
    } finally {
      _.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Encode \`u8\` pixel data to a COG. \`Uint8Array\`.
   * @param {Uint8Array} data
   * @returns {Uint8Array}
   */
  write_u8(t) {
    try {
      const a = _.__wbindgen_add_to_stack_pointer(-16), c = Dt(t, _.__wbindgen_export2), l = T;
      _.cogbuilder_write_u8(a, this.__wbg_ptr, c, l);
      var e = g().getInt32(a + 0, !0), n = g().getInt32(a + 4, !0), i = g().getInt32(a + 8, !0), s = g().getInt32(a + 12, !0);
      if (s)
        throw M(i);
      var o = xt(e, n).slice();
      return _.__wbindgen_export(e, n * 1, 1), o;
    } finally {
      _.__wbindgen_add_to_stack_pointer(16);
    }
  }
}
Symbol.dispose && (Ot.prototype[Symbol.dispose] = Ot.prototype.free);
class ce {
  __destroy_into_raw() {
    const t = this.__wbg_ptr;
    return this.__wbg_ptr = 0, Ee.unregister(this), t;
  }
  free() {
    const t = this.__destroy_into_raw();
    _.__wbg_cogstream_free(t, 0);
  }
  /**
   * Reproject a bbox from \`bbox_epsg\` into this COG's dataset CRS.
   *
   * The COG projection string is preferred over its EPSG tag when available,
   * because some user-defined projected GeoTIFFs expose only their geographic
   * base EPSG code.
   * @param {number} bbox_epsg
   * @param {Float64Array} bbox
   * @returns {Float64Array}
   */
  bbox_to_dataset_crs(t, e) {
    try {
      const c = _.__wbindgen_add_to_stack_pointer(-16), l = gt(e, _.__wbindgen_export2), f = T;
      _.cogstream_bbox_to_dataset_crs(c, this.__wbg_ptr, t, l, f);
      var n = g().getInt32(c + 0, !0), i = g().getInt32(c + 4, !0), s = g().getInt32(c + 8, !0), o = g().getInt32(c + 12, !0);
      if (o)
        throw M(s);
      var a = F(n, i).slice();
      return _.__wbindgen_export(n, i * 8, 8), a;
    } finally {
      _.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Bounding box \`[min_x, min_y, max_x, max_y]\` in the dataset CRS, or empty.
   * @returns {Float64Array}
   */
  bounding_box() {
    try {
      const i = _.__wbindgen_add_to_stack_pointer(-16);
      _.cogstream_bounding_box(i, this.__wbg_ptr);
      var t = g().getInt32(i + 0, !0), e = g().getInt32(i + 4, !0), n = F(t, e).slice();
      return _.__wbindgen_export(t, e * 8, 8), n;
    } finally {
      _.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Bounds \`[min_lon, min_lat, max_lon, max_lat]\` in WGS84 degrees, or empty.
   * @returns {Float64Array}
   */
  bounds_lonlat() {
    try {
      const i = _.__wbindgen_add_to_stack_pointer(-16);
      _.cogstream_bounds_lonlat(i, this.__wbg_ptr);
      var t = g().getInt32(i + 0, !0), e = g().getInt32(i + 4, !0), n = F(t, e).slice();
      return _.__wbindgen_export(t, e * 8, 8), n;
    } finally {
      _.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Image center \`[x, y]\` in the dataset CRS, or empty.
   * @returns {Float64Array}
   */
  center() {
    try {
      const i = _.__wbindgen_add_to_stack_pointer(-16);
      _.cogstream_center(i, this.__wbg_ptr);
      var t = g().getInt32(i + 0, !0), e = g().getInt32(i + 4, !0), n = F(t, e).slice();
      return _.__wbindgen_export(t, e * 8, 8), n;
    } finally {
      _.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Image center \`[lon, lat]\` in WGS84 degrees, or empty if not convertible.
   * @returns {Float64Array}
   */
  center_lonlat() {
    try {
      const i = _.__wbindgen_add_to_stack_pointer(-16);
      _.cogstream_center_lonlat(i, this.__wbg_ptr);
      var t = g().getInt32(i + 0, !0), e = g().getInt32(i + 4, !0), n = F(t, e).slice();
      return _.__wbindgen_export(t, e * 8, 8), n;
    } finally {
      _.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Decode one tile's fetched (compressed) bytes into an \`f64\` \`Float64Array\`,
   * pixel-interleaved, length \`tile_width * tile_height * bands\`. Edge tiles
   * come back full-size; clip to the image/window on the JS side.
   * @param {number} level
   * @param {Uint8Array} tile_bytes
   * @returns {Float64Array}
   */
  decode_tile_f64(t, e) {
    try {
      const c = _.__wbindgen_add_to_stack_pointer(-16), l = Dt(e, _.__wbindgen_export2), f = T;
      _.cogstream_decode_tile_f64(c, this.__wbg_ptr, t, l, f);
      var n = g().getInt32(c + 0, !0), i = g().getInt32(c + 4, !0), s = g().getInt32(c + 8, !0), o = g().getInt32(c + 12, !0);
      if (o)
        throw M(s);
      var a = F(n, i).slice();
      return _.__wbindgen_export(n, i * 8, 8), a;
    } finally {
      _.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * EPSG code of the full-resolution level, if any.
   * @returns {number | undefined}
   */
  get epsg() {
    const t = _.cogstream_epsg(this.__wbg_ptr);
    return t === Number.MAX_SAFE_INTEGER ? void 0 : t;
  }
  /**
   * Level-0 geo-transform \`[x_origin, pixel_width, row_rot, y_origin, col_rot,
   * pixel_height]\`, or empty if not georeferenced.
   * @returns {Float64Array}
   */
  geo_transform() {
    try {
      const i = _.__wbindgen_add_to_stack_pointer(-16);
      _.cogstream_geo_transform(i, this.__wbg_ptr);
      var t = g().getInt32(i + 0, !0), e = g().getInt32(i + 4, !0), n = F(t, e).slice();
      return _.__wbindgen_export(t, e * 8, 8), n;
    } finally {
      _.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * True when the COG CRS is represented by a user-defined projection string.
   * @returns {boolean}
   */
  get has_projection_string() {
    return _.cogstream_has_projection_string(this.__wbg_ptr) !== 0;
  }
  /**
   * JSON array describing every level: \`[{level,width,height,tile_width,
   * tile_height,tiles_x,tiles_y,bands,bits_per_sample,sample_format,compression}]\`.
   * @returns {string}
   */
  levels_json() {
    let t, e;
    try {
      const s = _.__wbindgen_add_to_stack_pointer(-16);
      _.cogstream_levels_json(s, this.__wbg_ptr);
      var n = g().getInt32(s + 0, !0), i = g().getInt32(s + 4, !0);
      return t = n, e = i, V(n, i);
    } finally {
      _.__wbindgen_add_to_stack_pointer(16), _.__wbindgen_export(t, e, 1);
    }
  }
  /**
   * Parse a COG's tile layout from front-of-file header bytes.
   * @param {Uint8Array} header_bytes
   */
  constructor(t) {
    try {
      const s = _.__wbindgen_add_to_stack_pointer(-16), o = Dt(t, _.__wbindgen_export2), a = T;
      _.cogstream_new(s, o, a);
      var e = g().getInt32(s + 0, !0), n = g().getInt32(s + 4, !0), i = g().getInt32(s + 8, !0);
      if (i)
        throw M(n);
      return this.__wbg_ptr = e, Ee.register(this, this.__wbg_ptr, this), this;
    } finally {
      _.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * No-data sentinel, if declared.
   * @returns {number | undefined}
   */
  get nodata() {
    try {
      const n = _.__wbindgen_add_to_stack_pointer(-16);
      _.cogstream_nodata(n, this.__wbg_ptr);
      var t = g().getInt32(n + 0, !0), e = g().getFloat64(n + 8, !0);
      return t === 0 ? void 0 : e;
    } finally {
      _.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Number of resolution levels (1 + overview count).
   * @returns {number}
   */
  get num_levels() {
    return _.cogstream_num_levels(this.__wbg_ptr) >>> 0;
  }
  /**
   * Reproject x,y coordinate pairs from this COG's dataset CRS to an EPSG CRS.
   * @param {number} dst_epsg
   * @param {Float64Array} xy
   * @returns {Float64Array}
   */
  points_from_dataset_crs(t, e) {
    try {
      const c = _.__wbindgen_add_to_stack_pointer(-16), l = gt(e, _.__wbindgen_export2), f = T;
      _.cogstream_points_from_dataset_crs(c, this.__wbg_ptr, t, l, f);
      var n = g().getInt32(c + 0, !0), i = g().getInt32(c + 4, !0), s = g().getInt32(c + 8, !0), o = g().getInt32(c + 12, !0);
      if (o)
        throw M(s);
      var a = F(n, i).slice();
      return _.__wbindgen_export(n, i * 8, 8), a;
    } finally {
      _.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Reproject x,y coordinate pairs from an EPSG CRS into this COG's dataset CRS.
   * @param {number} src_epsg
   * @param {Float64Array} xy
   * @returns {Float64Array}
   */
  points_to_dataset_crs(t, e) {
    try {
      const c = _.__wbindgen_add_to_stack_pointer(-16), l = gt(e, _.__wbindgen_export2), f = T;
      _.cogstream_points_to_dataset_crs(c, this.__wbg_ptr, t, l, f);
      var n = g().getInt32(c + 0, !0), i = g().getInt32(c + 4, !0), s = g().getInt32(c + 8, !0), o = g().getInt32(c + 12, !0);
      if (o)
        throw M(s);
      var a = F(n, i).slice();
      return _.__wbindgen_export(n, i * 8, 8), a;
    } finally {
      _.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * \`[offset, length]\` byte range of the tile at \`(col, row)\` on \`level\`.
   * @param {number} level
   * @param {number} col
   * @param {number} row
   * @returns {Float64Array}
   */
  tile_range(t, e, n) {
    try {
      const l = _.__wbindgen_add_to_stack_pointer(-16);
      _.cogstream_tile_range(l, this.__wbg_ptr, t, e, n);
      var i = g().getInt32(l + 0, !0), s = g().getInt32(l + 4, !0), o = g().getInt32(l + 8, !0), a = g().getInt32(l + 12, !0);
      if (a)
        throw M(o);
      var c = F(i, s).slice();
      return _.__wbindgen_export(i, s * 8, 8), c;
    } finally {
      _.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Tiles covering a pixel window on \`level\`, as a JSON array of
   * \`{col,row,offset,length}\`. Fetch each byte range, then \`decode_tile_f64\`.
   * @param {number} level
   * @param {number} x
   * @param {number} y
   * @param {number} w
   * @param {number} h
   * @returns {string}
   */
  tiles_for_window(t, e, n, i, s) {
    let o, a;
    try {
      const u = _.__wbindgen_add_to_stack_pointer(-16);
      _.cogstream_tiles_for_window(u, this.__wbg_ptr, t, e, n, i, s);
      var c = g().getInt32(u + 0, !0), l = g().getInt32(u + 4, !0), f = g().getInt32(u + 8, !0), d = g().getInt32(u + 12, !0), h = c, w = l;
      if (d)
        throw h = 0, w = 0, M(f);
      return o = h, a = w, V(h, w);
    } finally {
      _.__wbindgen_add_to_stack_pointer(16), _.__wbindgen_export(o, a, 1);
    }
  }
}
Symbol.dispose && (ce.prototype[Symbol.dispose] = ce.prototype.free);
class Lt {
  __destroy_into_raw() {
    const t = this.__wbg_ptr;
    return this.__wbg_ptr = 0, Se.unregister(this), t;
  }
  free() {
    const t = this.__destroy_into_raw();
    _.__wbg_geotiffreader_free(t, 0);
  }
  /**
   * @returns {number}
   */
  get bands() {
    return _.geotiffreader_bands(this.__wbg_ptr) >>> 0;
  }
  /**
   * @returns {number}
   */
  get bits_per_sample() {
    return _.geotiffreader_bits_per_sample(this.__wbg_ptr);
  }
  /**
   * Bounding box as \`[min_x, min_y, max_x, max_y]\`, or empty if not georeferenced.
   * @returns {Float64Array}
   */
  bounding_box() {
    try {
      const i = _.__wbindgen_add_to_stack_pointer(-16);
      _.geotiffreader_bounding_box(i, this.__wbg_ptr);
      var t = g().getInt32(i + 0, !0), e = g().getInt32(i + 4, !0), n = F(t, e).slice();
      return _.__wbindgen_export(t, e * 8, 8), n;
    } finally {
      _.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Bounds \`[min_lon, min_lat, max_lon, max_lat]\` in WGS84 degrees, or empty
   * if not convertible.
   * @returns {Float64Array}
   */
  bounds_lonlat() {
    try {
      const i = _.__wbindgen_add_to_stack_pointer(-16);
      _.geotiffreader_bounds_lonlat(i, this.__wbg_ptr);
      var t = g().getInt32(i + 0, !0), e = g().getInt32(i + 4, !0), n = F(t, e).slice();
      return _.__wbindgen_export(t, e * 8, 8), n;
    } finally {
      _.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Image center \`[x, y]\` in the dataset CRS, or empty if not georeferenced.
   * @returns {Float64Array}
   */
  center() {
    try {
      const i = _.__wbindgen_add_to_stack_pointer(-16);
      _.geotiffreader_center(i, this.__wbg_ptr);
      var t = g().getInt32(i + 0, !0), e = g().getInt32(i + 4, !0), n = F(t, e).slice();
      return _.__wbindgen_export(t, e * 8, 8), n;
    } finally {
      _.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Image center \`[lon, lat]\` in WGS84 degrees, or empty if not georeferenced
   * or the CRS is not convertible.
   * @returns {Float64Array}
   */
  center_lonlat() {
    try {
      const i = _.__wbindgen_add_to_stack_pointer(-16);
      _.geotiffreader_center_lonlat(i, this.__wbg_ptr);
      var t = g().getInt32(i + 0, !0), e = g().getInt32(i + 4, !0), n = F(t, e).slice();
      return _.__wbindgen_export(t, e * 8, 8), n;
    } finally {
      _.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  get compression() {
    let t, e;
    try {
      const s = _.__wbindgen_add_to_stack_pointer(-16);
      _.geotiffreader_compression(s, this.__wbg_ptr);
      var n = g().getInt32(s + 0, !0), i = g().getInt32(s + 4, !0);
      return t = n, e = i, V(n, i);
    } finally {
      _.__wbindgen_add_to_stack_pointer(16), _.__wbindgen_export(t, e, 1);
    }
  }
  /**
   * EPSG code, or \`undefined\` if the file is not georeferenced by EPSG.
   * @returns {number | undefined}
   */
  get epsg() {
    const t = _.geotiffreader_epsg(this.__wbg_ptr);
    return t === Number.MAX_SAFE_INTEGER ? void 0 : t;
  }
  /**
   * Affine geo-transform as \`[x_origin, pixel_width, row_rotation,
   * y_origin, col_rotation, pixel_height]\`, or an empty array if absent.
   * @returns {Float64Array}
   */
  geo_transform() {
    try {
      const i = _.__wbindgen_add_to_stack_pointer(-16);
      _.geotiffreader_geo_transform(i, this.__wbg_ptr);
      var t = g().getInt32(i + 0, !0), e = g().getInt32(i + 4, !0), n = F(t, e).slice();
      return _.__wbindgen_export(t, e * 8, 8), n;
    } finally {
      _.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {number}
   */
  get height() {
    return _.geotiffreader_height(this.__wbg_ptr) >>> 0;
  }
  /**
   * Full metadata as a JSON string (same shape as [\`geotiff_info\`]).
   * @returns {string}
   */
  info_json() {
    let t, e;
    try {
      const s = _.__wbindgen_add_to_stack_pointer(-16);
      _.geotiffreader_info_json(s, this.__wbg_ptr);
      var n = g().getInt32(s + 0, !0), i = g().getInt32(s + 4, !0);
      return t = n, e = i, V(n, i);
    } finally {
      _.__wbindgen_add_to_stack_pointer(16), _.__wbindgen_export(t, e, 1);
    }
  }
  /**
   * @returns {boolean}
   */
  get is_bigtiff() {
    return _.geotiffreader_is_bigtiff(this.__wbg_ptr) !== 0;
  }
  /**
   * Parse a GeoTIFF / BigTIFF / COG from raw bytes.
   * @param {Uint8Array} data
   */
  constructor(t) {
    try {
      const s = _.__wbindgen_add_to_stack_pointer(-16), o = Dt(t, _.__wbindgen_export2), a = T;
      _.geotiffreader_new(s, o, a);
      var e = g().getInt32(s + 0, !0), n = g().getInt32(s + 4, !0), i = g().getInt32(s + 8, !0);
      if (i)
        throw M(n);
      return this.__wbg_ptr = e, Se.register(this, this.__wbg_ptr, this), this;
    } finally {
      _.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * No-data sentinel, or \`undefined\` if none is declared.
   * @returns {number | undefined}
   */
  get nodata() {
    try {
      const n = _.__wbindgen_add_to_stack_pointer(-16);
      _.geotiffreader_nodata(n, this.__wbg_ptr);
      var t = g().getInt32(n + 0, !0), e = g().getFloat64(n + 8, !0);
      return t === 0 ? void 0 : e;
    } finally {
      _.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Read every band as \`f64\`, interleaved per pixel (\`band0,band1,...\`).
   * @returns {Float64Array}
   */
  read_all_f64() {
    try {
      const o = _.__wbindgen_add_to_stack_pointer(-16);
      _.geotiffreader_read_all_f64(o, this.__wbg_ptr);
      var t = g().getInt32(o + 0, !0), e = g().getInt32(o + 4, !0), n = g().getInt32(o + 8, !0), i = g().getInt32(o + 12, !0);
      if (i)
        throw M(n);
      var s = F(t, e).slice();
      return _.__wbindgen_export(t, e * 8, 8), s;
    } finally {
      _.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Read a band's raw, undecoded-to-native bytes. \`Uint8Array\`.
   * @param {number} band
   * @returns {Uint8Array}
   */
  read_band_bytes(t) {
    try {
      const a = _.__wbindgen_add_to_stack_pointer(-16);
      _.geotiffreader_read_band_bytes(a, this.__wbg_ptr, t);
      var e = g().getInt32(a + 0, !0), n = g().getInt32(a + 4, !0), i = g().getInt32(a + 8, !0), s = g().getInt32(a + 12, !0);
      if (s)
        throw M(i);
      var o = xt(e, n).slice();
      return _.__wbindgen_export(e, n * 1, 1), o;
    } finally {
      _.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Native \`f32\` band. \`Float32Array\`.
   * @param {number} band
   * @returns {Float32Array}
   */
  read_band_f32(t) {
    try {
      const a = _.__wbindgen_add_to_stack_pointer(-16);
      _.geotiffreader_read_band_f32(a, this.__wbg_ptr, t);
      var e = g().getInt32(a + 0, !0), n = g().getInt32(a + 4, !0), i = g().getInt32(a + 8, !0), s = g().getInt32(a + 12, !0);
      if (s)
        throw M(i);
      var o = vn(e, n).slice();
      return _.__wbindgen_export(e, n * 4, 4), o;
    } finally {
      _.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Read a band as \`f64\`, converting from any on-disk type. \`Float64Array\`.
   * @param {number} band
   * @returns {Float64Array}
   */
  read_band_f64(t) {
    try {
      const a = _.__wbindgen_add_to_stack_pointer(-16);
      _.geotiffreader_read_band_f64(a, this.__wbg_ptr, t);
      var e = g().getInt32(a + 0, !0), n = g().getInt32(a + 4, !0), i = g().getInt32(a + 8, !0), s = g().getInt32(a + 12, !0);
      if (s)
        throw M(i);
      var o = F(e, n).slice();
      return _.__wbindgen_export(e, n * 8, 8), o;
    } finally {
      _.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Native \`i16\` band. \`Int16Array\`.
   * @param {number} band
   * @returns {Int16Array}
   */
  read_band_i16(t) {
    try {
      const a = _.__wbindgen_add_to_stack_pointer(-16);
      _.geotiffreader_read_band_i16(a, this.__wbg_ptr, t);
      var e = g().getInt32(a + 0, !0), n = g().getInt32(a + 4, !0), i = g().getInt32(a + 8, !0), s = g().getInt32(a + 12, !0);
      if (s)
        throw M(i);
      var o = kn(e, n).slice();
      return _.__wbindgen_export(e, n * 2, 2), o;
    } finally {
      _.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Native \`i32\` band. \`Int32Array\`.
   * @param {number} band
   * @returns {Int32Array}
   */
  read_band_i32(t) {
    try {
      const a = _.__wbindgen_add_to_stack_pointer(-16);
      _.geotiffreader_read_band_i32(a, this.__wbg_ptr, t);
      var e = g().getInt32(a + 0, !0), n = g().getInt32(a + 4, !0), i = g().getInt32(a + 8, !0), s = g().getInt32(a + 12, !0);
      if (s)
        throw M(i);
      var o = In(e, n).slice();
      return _.__wbindgen_export(e, n * 4, 4), o;
    } finally {
      _.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Native \`i8\` band. \`Int8Array\`.
   * @param {number} band
   * @returns {Int8Array}
   */
  read_band_i8(t) {
    try {
      const a = _.__wbindgen_add_to_stack_pointer(-16);
      _.geotiffreader_read_band_i8(a, this.__wbg_ptr, t);
      var e = g().getInt32(a + 0, !0), n = g().getInt32(a + 4, !0), i = g().getInt32(a + 8, !0), s = g().getInt32(a + 12, !0);
      if (s)
        throw M(i);
      var o = An(e, n).slice();
      return _.__wbindgen_export(e, n * 1, 1), o;
    } finally {
      _.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Native \`u16\` band. \`Uint16Array\`.
   * @param {number} band
   * @returns {Uint16Array}
   */
  read_band_u16(t) {
    try {
      const a = _.__wbindgen_add_to_stack_pointer(-16);
      _.geotiffreader_read_band_u16(a, this.__wbg_ptr, t);
      var e = g().getInt32(a + 0, !0), n = g().getInt32(a + 4, !0), i = g().getInt32(a + 8, !0), s = g().getInt32(a + 12, !0);
      if (s)
        throw M(i);
      var o = Mn(e, n).slice();
      return _.__wbindgen_export(e, n * 2, 2), o;
    } finally {
      _.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Native \`u32\` band. \`Uint32Array\`.
   * @param {number} band
   * @returns {Uint32Array}
   */
  read_band_u32(t) {
    try {
      const a = _.__wbindgen_add_to_stack_pointer(-16);
      _.geotiffreader_read_band_u32(a, this.__wbg_ptr, t);
      var e = g().getInt32(a + 0, !0), n = g().getInt32(a + 4, !0), i = g().getInt32(a + 8, !0), s = g().getInt32(a + 12, !0);
      if (s)
        throw M(i);
      var o = En(e, n).slice();
      return _.__wbindgen_export(e, n * 4, 4), o;
    } finally {
      _.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Native \`u8\` band. \`Uint8Array\`.
   * @param {number} band
   * @returns {Uint8Array}
   */
  read_band_u8(t) {
    try {
      const a = _.__wbindgen_add_to_stack_pointer(-16);
      _.geotiffreader_read_band_u8(a, this.__wbg_ptr, t);
      var e = g().getInt32(a + 0, !0), n = g().getInt32(a + 4, !0), i = g().getInt32(a + 8, !0), s = g().getInt32(a + 12, !0);
      if (s)
        throw M(i);
      var o = xt(e, n).slice();
      return _.__wbindgen_export(e, n * 1, 1), o;
    } finally {
      _.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {string}
   */
  get sample_format() {
    let t, e;
    try {
      const s = _.__wbindgen_add_to_stack_pointer(-16);
      _.geotiffreader_sample_format(s, this.__wbg_ptr);
      var n = g().getInt32(s + 0, !0), i = g().getInt32(s + 4, !0);
      return t = n, e = i, V(n, i);
    } finally {
      _.__wbindgen_add_to_stack_pointer(16), _.__wbindgen_export(t, e, 1);
    }
  }
  /**
   * Band-0 statistics as a JSON string (same shape as [\`geotiff_stats\`]).
   * @returns {string}
   */
  stats_json() {
    let t, e;
    try {
      const s = _.__wbindgen_add_to_stack_pointer(-16);
      _.geotiffreader_stats_json(s, this.__wbg_ptr);
      var n = g().getInt32(s + 0, !0), i = g().getInt32(s + 4, !0);
      return t = n, e = i, V(n, i);
    } finally {
      _.__wbindgen_add_to_stack_pointer(16), _.__wbindgen_export(t, e, 1);
    }
  }
  /**
   * GDAL value transform as \`[scale, offset]\` (physical = raw*scale+offset),
   * or empty if none. Apply to \`read_*\` outputs to get physical values.
   * @returns {Float64Array}
   */
  value_transform() {
    try {
      const i = _.__wbindgen_add_to_stack_pointer(-16);
      _.geotiffreader_value_transform(i, this.__wbg_ptr);
      var t = g().getInt32(i + 0, !0), e = g().getInt32(i + 4, !0), n = F(t, e).slice();
      return _.__wbindgen_export(t, e * 8, 8), n;
    } finally {
      _.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * @returns {number}
   */
  get width() {
    return _.geotiffreader_width(this.__wbg_ptr) >>> 0;
  }
}
Symbol.dispose && (Lt.prototype[Symbol.dispose] = Lt.prototype.free);
class le {
  __destroy_into_raw() {
    const t = this.__wbg_ptr;
    return this.__wbg_ptr = 0, Ne.unregister(this), t;
  }
  free() {
    const t = this.__destroy_into_raw();
    _.__wbg_pmtilesextractor_free(t, 0);
  }
  /**
   * True once every needed range has been fed; \`finish()\` is then valid.
   * @returns {boolean}
   */
  get done() {
    return _.pmtilesextractor_done(this.__wbg_ptr) !== 0;
  }
  /**
   * Hand back the bytes of one \`wanted_json()\` range, identified by its
   * offset. Ranges may be fed in any order.
   * @param {number} offset
   * @param {Uint8Array} bytes
   */
  feed(t, e) {
    try {
      const s = _.__wbindgen_add_to_stack_pointer(-16), o = Dt(e, _.__wbindgen_export2), a = T;
      _.pmtilesextractor_feed(s, this.__wbg_ptr, t, o, a);
      var n = g().getInt32(s + 0, !0), i = g().getInt32(s + 4, !0);
      if (i)
        throw M(n);
    } finally {
      _.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Assemble the extracted archive. Consumes the extractor's buffers; the
   * returned \`Uint8Array\` is a complete \`.pmtiles\` file.
   * @returns {Uint8Array}
   */
  finish() {
    try {
      const o = _.__wbindgen_add_to_stack_pointer(-16);
      _.pmtilesextractor_finish(o, this.__wbg_ptr);
      var t = g().getInt32(o + 0, !0), e = g().getInt32(o + 4, !0), n = g().getInt32(o + 8, !0), i = g().getInt32(o + 12, !0);
      if (i)
        throw M(n);
      var s = xt(t, e).slice();
      return _.__wbindgen_export(t, e * 1, 1), s;
    } finally {
      _.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Source archive header as JSON (\`{}\` until the first feed): zooms,
   * bounds, tile type/compression, tile counts. Lets a UI validate the
   * request and describe the source before committing to the download.
   * @returns {string}
   */
  header_json() {
    let t, e;
    try {
      const l = _.__wbindgen_add_to_stack_pointer(-16);
      _.pmtilesextractor_header_json(l, this.__wbg_ptr);
      var n = g().getInt32(l + 0, !0), i = g().getInt32(l + 4, !0), s = g().getInt32(l + 8, !0), o = g().getInt32(l + 12, !0), a = n, c = i;
      if (o)
        throw a = 0, c = 0, M(s);
      return t = a, e = c, V(a, c);
    } finally {
      _.__wbindgen_add_to_stack_pointer(16), _.__wbindgen_export(t, e, 1);
    }
  }
  /**
   * Plan an extraction of \`min_zoom..=max_zoom\` tiles intersecting the
   * WGS84 bbox. Zooms are clamped to what the source archive contains once
   * its header arrives; \`min_zoom\` 0 keeps the basemap usable zoomed out.
   * @param {number} min_lon
   * @param {number} min_lat
   * @param {number} max_lon
   * @param {number} max_lat
   * @param {number} min_zoom
   * @param {number} max_zoom
   */
  constructor(t, e, n, i, s, o) {
    try {
      const f = _.__wbindgen_add_to_stack_pointer(-16);
      _.pmtilesextractor_new(f, t, e, n, i, s, o);
      var a = g().getInt32(f + 0, !0), c = g().getInt32(f + 4, !0), l = g().getInt32(f + 8, !0);
      if (l)
        throw M(c);
      return this.__wbg_ptr = a, Ne.register(this, this.__wbg_ptr, this), this;
    } finally {
      _.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Progress as JSON: \`{"phase":"header|directories|data|done",
   * "tiles_selected":n,"blobs_total":n,"data_bytes_total":n,
   * "data_bytes_received":n,"estimated_output_bytes":n}\`.
   * @returns {string}
   */
  progress_json() {
    let t, e;
    try {
      const l = _.__wbindgen_add_to_stack_pointer(-16);
      _.pmtilesextractor_progress_json(l, this.__wbg_ptr);
      var n = g().getInt32(l + 0, !0), i = g().getInt32(l + 4, !0), s = g().getInt32(l + 8, !0), o = g().getInt32(l + 12, !0), a = n, c = i;
      if (o)
        throw a = 0, c = 0, M(s);
      return t = a, e = c, V(a, c);
    } finally {
      _.__wbindgen_add_to_stack_pointer(16), _.__wbindgen_export(t, e, 1);
    }
  }
  /**
   * Coalesce tile-data requests whose byte gap is at most this (default
   * 65,536). Larger values trade overfetch for fewer HTTP round-trips.
   * @param {number} max_gap
   */
  set_max_range_gap(t) {
    try {
      const i = _.__wbindgen_add_to_stack_pointer(-16);
      _.pmtilesextractor_set_max_range_gap(i, this.__wbg_ptr, t);
      var e = g().getInt32(i + 0, !0), n = g().getInt32(i + 4, !0);
      if (n)
        throw M(e);
    } finally {
      _.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Cap on addressed tiles (default 2,000,000). Raise for huge desktop
   * extracts; lower to fail fast in memory-constrained embeds.
   * @param {number} max_tiles
   */
  set_max_tiles(t) {
    try {
      const i = _.__wbindgen_add_to_stack_pointer(-16);
      _.pmtilesextractor_set_max_tiles(i, this.__wbg_ptr, t);
      var e = g().getInt32(i + 0, !0), n = g().getInt32(i + 4, !0);
      if (n)
        throw M(e);
    } finally {
      _.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
   * Outstanding byte ranges the host should fetch, as a JSON array of
   * \`{"offset":n,"length":n}\`. Empty array when nothing is outstanding.
   * @returns {string}
   */
  wanted_json() {
    let t, e;
    try {
      const l = _.__wbindgen_add_to_stack_pointer(-16);
      _.pmtilesextractor_wanted_json(l, this.__wbg_ptr);
      var n = g().getInt32(l + 0, !0), i = g().getInt32(l + 4, !0), s = g().getInt32(l + 8, !0), o = g().getInt32(l + 12, !0), a = n, c = i;
      if (o)
        throw a = 0, c = 0, M(s);
      return t = a, e = c, V(a, c);
    } finally {
      _.__wbindgen_add_to_stack_pointer(16), _.__wbindgen_export(t, e, 1);
    }
  }
}
Symbol.dispose && (le.prototype[Symbol.dispose] = le.prototype.free);
function yt(r, t, e) {
  try {
    const c = _.__wbindgen_add_to_stack_pointer(-16), l = gt(e, _.__wbindgen_export2), f = T;
    _.transform_bbox_epsg(c, r, t, l, f);
    var n = g().getInt32(c + 0, !0), i = g().getInt32(c + 4, !0), s = g().getInt32(c + 8, !0), o = g().getInt32(c + 12, !0);
    if (o)
      throw M(s);
    var a = F(n, i).slice();
    return _.__wbindgen_export(n, i * 8, 8), a;
  } finally {
    _.__wbindgen_add_to_stack_pointer(16);
  }
}
function he(r, t, e) {
  try {
    const c = _.__wbindgen_add_to_stack_pointer(-16), l = gt(e, _.__wbindgen_export2), f = T;
    _.transform_points_epsg(c, r, t, l, f);
    var n = g().getInt32(c + 0, !0), i = g().getInt32(c + 4, !0), s = g().getInt32(c + 8, !0), o = g().getInt32(c + 12, !0);
    if (o)
      throw M(s);
    var a = F(n, i).slice();
    return _.__wbindgen_export(n, i * 8, 8), a;
  } finally {
    _.__wbindgen_add_to_stack_pointer(16);
  }
}
function yn() {
  return {
    __proto__: null,
    "./geolibre_wasm_bg.js": {
      __proto__: null,
      __wbg___wbindgen_throw_ea4887a5f8f9a9db: function(t, e) {
        throw new Error(V(t, e));
      },
      __wbg_error_a6fa202b58aa1cd3: function(t, e) {
        let n, i;
        try {
          n = t, i = e, console.error(V(t, e));
        } finally {
          _.__wbindgen_export(n, i, 1);
        }
      },
      __wbg_new_227d7c05414eb861: function() {
        const t = new Error();
        return Te(t);
      },
      __wbg_stack_3b0d974bbf31e44f: function(t, e) {
        const n = He(e).stack, i = Xe(n, _.__wbindgen_export2, _.__wbindgen_export3), s = T;
        g().setInt32(t + 4, s, !0), g().setInt32(t + 0, i, !0);
      },
      __wbindgen_cast_0000000000000001: function(t, e) {
        const n = V(t, e);
        return Te(n);
      },
      __wbindgen_object_drop_ref: function(t) {
        M(t);
      }
    }
  };
}
const Me = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((r) => _.__wbg_cogbuilder_free(r, 1)), Ee = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((r) => _.__wbg_cogstream_free(r, 1)), Se = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((r) => _.__wbg_geotiffreader_free(r, 1)), Ne = typeof FinalizationRegistry > "u" ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((r) => _.__wbg_pmtilesextractor_free(r, 1));
typeof FinalizationRegistry > "u" || new FinalizationRegistry((r) => _.__wbg_vectorbinary_free(r, 1));
function Te(r) {
  Rt === nt.length && nt.push(nt.length + 1);
  const t = Rt;
  return Rt = nt[t], nt[t] = r, t;
}
function xn(r) {
  r < 1028 || (nt[r] = Rt, Rt = r);
}
function vn(r, t) {
  return r = r >>> 0, Ge().subarray(r / 4, r / 4 + t);
}
function F(r, t) {
  return r = r >>> 0, Ve().subarray(r / 8, r / 8 + t);
}
function kn(r, t) {
  return r = r >>> 0, Sn().subarray(r / 2, r / 2 + t);
}
function In(r, t) {
  return r = r >>> 0, Nn().subarray(r / 4, r / 4 + t);
}
function An(r, t) {
  return r = r >>> 0, Tn().subarray(r / 1, r / 1 + t);
}
function Mn(r, t) {
  return r = r >>> 0, Un().subarray(r / 2, r / 2 + t);
}
function En(r, t) {
  return r = r >>> 0, Ye().subarray(r / 4, r / 4 + t);
}
function xt(r, t) {
  return r = r >>> 0, vt().subarray(r / 1, r / 1 + t);
}
let _t = null;
function g() {
  return (_t === null || _t.buffer.detached === !0 || _t.buffer.detached === void 0 && _t.buffer !== _.memory.buffer) && (_t = new DataView(_.memory.buffer)), _t;
}
let Mt = null;
function Ge() {
  return (Mt === null || Mt.byteLength === 0) && (Mt = new Float32Array(_.memory.buffer)), Mt;
}
let Et = null;
function Ve() {
  return (Et === null || Et.byteLength === 0) && (Et = new Float64Array(_.memory.buffer)), Et;
}
let St = null;
function Sn() {
  return (St === null || St.byteLength === 0) && (St = new Int16Array(_.memory.buffer)), St;
}
let Nt = null;
function Nn() {
  return (Nt === null || Nt.byteLength === 0) && (Nt = new Int32Array(_.memory.buffer)), Nt;
}
let Tt = null;
function Tn() {
  return (Tt === null || Tt.byteLength === 0) && (Tt = new Int8Array(_.memory.buffer)), Tt;
}
function V(r, t) {
  return Bn(r >>> 0, t);
}
let Ut = null;
function Un() {
  return (Ut === null || Ut.byteLength === 0) && (Ut = new Uint16Array(_.memory.buffer)), Ut;
}
let Ft = null;
function Ye() {
  return (Ft === null || Ft.byteLength === 0) && (Ft = new Uint32Array(_.memory.buffer)), Ft;
}
let Ct = null;
function vt() {
  return (Ct === null || Ct.byteLength === 0) && (Ct = new Uint8Array(_.memory.buffer)), Ct;
}
function He(r) {
  return nt[r];
}
let nt = new Array(1024).fill(void 0);
nt.push(void 0, null, !0, !1);
let Rt = nt.length;
function Fn(r, t) {
  const e = t(r.length * 4, 4) >>> 0;
  return Ye().set(r, e / 4), T = r.length, e;
}
function Dt(r, t) {
  const e = t(r.length * 1, 1) >>> 0;
  return vt().set(r, e / 1), T = r.length, e;
}
function Cn(r, t) {
  const e = t(r.length * 4, 4) >>> 0;
  return Ge().set(r, e / 4), T = r.length, e;
}
function gt(r, t) {
  const e = t(r.length * 8, 8) >>> 0;
  return Ve().set(r, e / 8), T = r.length, e;
}
function Xe(r, t, e) {
  if (e === void 0) {
    const a = Bt.encode(r), c = t(a.length, 1) >>> 0;
    return vt().subarray(c, c + a.length).set(a), T = a.length, c;
  }
  let n = r.length, i = t(n, 1) >>> 0;
  const s = vt();
  let o = 0;
  for (; o < n; o++) {
    const a = r.charCodeAt(o);
    if (a > 127) break;
    s[i + o] = a;
  }
  if (o !== n) {
    o !== 0 && (r = r.slice(o)), i = e(i, n, n = o + r.length * 3, 1) >>> 0;
    const a = vt().subarray(i + o, i + n), c = Bt.encodeInto(r, a);
    o += c.written, i = e(i, n, o, 1) >>> 0;
  }
  return T = o, i;
}
function M(r) {
  const t = He(r);
  return xn(r), t;
}
let Gt = new TextDecoder("utf-8", { ignoreBOM: !0, fatal: !0 });
Gt.decode();
const Rn = 2146435072;
let te = 0;
function Bn(r, t) {
  return te += t, te >= Rn && (Gt = new TextDecoder("utf-8", { ignoreBOM: !0, fatal: !0 }), Gt.decode(), te = t), Gt.decode(vt().subarray(r, r + t));
}
const Bt = new TextEncoder();
"encodeInto" in Bt || (Bt.encodeInto = function(r, t) {
  const e = Bt.encode(r);
  return t.set(e), {
    read: r.length,
    written: e.length
  };
});
let T = 0, _;
function On(r, t) {
  return _ = r.exports, _t = null, Mt = null, Et = null, St = null, Nt = null, Tt = null, Ut = null, Ft = null, Ct = null, _.__wbindgen_start(), _;
}
async function Ln(r, t) {
  if (typeof Response == "function" && r instanceof Response) {
    if (typeof WebAssembly.instantiateStreaming == "function")
      try {
        return await WebAssembly.instantiateStreaming(r, t);
      } catch (i) {
        if (r.ok && e(r.type) && r.headers.get("Content-Type") !== "application/wasm")
          console.warn("\`WebAssembly.instantiateStreaming\` failed because your server does not serve Wasm with \`application/wasm\` MIME type. Falling back to \`WebAssembly.instantiate\` which is slower. Original error:\\n", i);
        else
          throw i;
      }
    const n = await r.arrayBuffer();
    return await WebAssembly.instantiate(n, t);
  } else {
    const n = await WebAssembly.instantiate(r, t);
    return n instanceof WebAssembly.Instance ? { instance: n, module: r } : n;
  }
  function e(n) {
    switch (n) {
      case "basic":
      case "cors":
      case "default":
        return !0;
    }
    return !1;
  }
}
async function qe(r) {
  if (_ !== void 0) return _;
  r !== void 0 && (Object.getPrototypeOf(r) === Object.prototype ? { module_or_path: r } = r : console.warn("using deprecated parameters for the initialization function; pass a single object instead")), r === void 0 && (r = "geolibre_wasm_bg.wasm");
  const t = yn();
  (typeof r == "string" || typeof Request == "function" && r instanceof Request || typeof URL == "function" && r instanceof URL) && (r = fetch(r));
  const { instance: e, module: n } = await Ln(await r, t);
  return On(e);
}
const ee = 0, ne = 1, E = 0, k = 8, Vt = 20, It = 28, Ue = 31, Dn = 37, ft = 44, Pn = 52, at = 54, Fe = 55, S = 58, _e = 63, Ce = 76, fe = 64;
class Pt {
  static read_bytes(t, e) {
    const n = new Pt();
    return n.buf = t.getUint32(e, !0), n.buf_len = t.getUint32(e + 4, !0), n;
  }
  static read_bytes_array(t, e, n) {
    const i = [];
    for (let s = 0; s < n; s++)
      i.push(Pt.read_bytes(t, e + 8 * s));
    return i;
  }
}
class Wt {
  static read_bytes(t, e) {
    const n = new Wt();
    return n.buf = t.getUint32(e, !0), n.buf_len = t.getUint32(e + 4, !0), n;
  }
  static read_bytes_array(t, e, n) {
    const i = [];
    for (let s = 0; s < n; s++)
      i.push(Wt.read_bytes(t, e + 8 * s));
    return i;
  }
}
const Wn = 0, zn = 1, Je = 2, Re = 2, G = 3, Ht = 4;
class re {
  head_length() {
    return 24;
  }
  name_length() {
    return this.dir_name.byteLength;
  }
  write_head_bytes(t, e) {
    t.setBigUint64(e, this.d_next, !0), t.setBigUint64(e + 8, this.d_ino, !0), t.setUint32(e + 16, this.dir_name.length, !0), t.setUint8(e + 20, this.d_type);
  }
  write_name_bytes(t, e, n) {
    t.set(this.dir_name.slice(0, Math.min(this.dir_name.byteLength, n)), e);
  }
  constructor(t, e, n, i) {
    const s = new TextEncoder().encode(n);
    this.d_next = t, this.d_ino = e, this.d_namlen = s.byteLength, this.d_type = i, this.dir_name = s;
  }
}
const jn = 1;
class pe {
  write_bytes(t, e) {
    t.setUint8(e, this.fs_filetype), t.setUint16(e + 2, this.fs_flags, !0), t.setBigUint64(e + 8, this.fs_rights_base, !0), t.setBigUint64(e + 16, this.fs_rights_inherited, !0);
  }
  constructor(t, e) {
    this.fs_rights_base = 0n, this.fs_rights_inherited = 0n, this.fs_filetype = t, this.fs_flags = e;
  }
}
const ie = 1, At = 2, Be = 4, Oe = 8;
class we {
  write_bytes(t, e) {
    t.setBigUint64(e, this.dev, !0), t.setBigUint64(e + 8, this.ino, !0), t.setUint8(e + 16, this.filetype), t.setBigUint64(e + 24, this.nlink, !0), t.setBigUint64(e + 32, this.size, !0), t.setBigUint64(e + 38, this.atim, !0), t.setBigUint64(e + 46, this.mtim, !0), t.setBigUint64(e + 52, this.ctim, !0);
  }
  constructor(t, e, n) {
    this.dev = 0n, this.nlink = 0n, this.atim = 0n, this.mtim = 0n, this.ctim = 0n, this.ino = t, this.filetype = e, this.size = n;
  }
}
const $n = 0, Gn = 1;
class me {
  static read_bytes(t, e) {
    return new me(t.getBigUint64(e, !0), t.getUint8(e + 8), t.getUint32(e + 16, !0), t.getBigUint64(e + 24, !0), t.getUint16(e + 36, !0));
  }
  constructor(t, e, n, i, s) {
    this.userdata = t, this.eventtype = e, this.clockid = n, this.timeout = i, this.flags = s;
  }
}
class Vn {
  write_bytes(t, e) {
    t.setBigUint64(e, this.userdata, !0), t.setUint16(e + 8, this.error, !0), t.setUint8(e + 10, this.eventtype);
  }
  constructor(t, e, n) {
    this.userdata = t, this.error = e, this.eventtype = n;
  }
}
const Yn = 0;
class Hn {
  write_bytes(t, e) {
    t.setUint32(e, this.pr_name.byteLength, !0);
  }
  constructor(t) {
    this.pr_name = new TextEncoder().encode(t);
  }
}
class be {
  static dir(t) {
    const e = new be();
    return e.tag = Yn, e.inner = new Hn(t), e;
  }
  write_bytes(t, e) {
    t.setUint32(e, this.tag, !0), this.inner.write_bytes(t, e + 4);
  }
}
let Xn = class {
  enable(t) {
    this.log = qn(t === void 0 ? !0 : t, this.prefix);
  }
  get enabled() {
    return this.isEnabled;
  }
  constructor(t) {
    this.isEnabled = t, this.prefix = "wasi:", this.enable(t);
  }
};
function qn(r, t) {
  return r ? console.log.bind(console, "%c%s", "color: #265BA0", t) : () => {
  };
}
const P = new Xn(!1);
class Le extends Error {
  constructor(t) {
    super("exit with exit code " + t), this.code = t;
  }
}
let Jn = class {
  start(t) {
    this.inst = t;
    try {
      return t.exports._start(), 0;
    } catch (e) {
      if (e instanceof Le)
        return e.code;
      throw e;
    }
  }
  initialize(t) {
    this.inst = t, t.exports._initialize && t.exports._initialize();
  }
  constructor(t, e, n, i = {}) {
    this.args = [], this.env = [], this.fds = [], P.enable(i.debug), this.args = t, this.env = e, this.fds = n;
    const s = this;
    this.wasiImport = { args_sizes_get(o, a) {
      const c = new DataView(s.inst.exports.memory.buffer);
      c.setUint32(o, s.args.length, !0);
      let l = 0;
      for (const f of s.args)
        l += f.length + 1;
      return c.setUint32(a, l, !0), P.log(c.getUint32(o, !0), c.getUint32(a, !0)), 0;
    }, args_get(o, a) {
      const c = new DataView(s.inst.exports.memory.buffer), l = new Uint8Array(s.inst.exports.memory.buffer), f = a;
      for (let d = 0; d < s.args.length; d++) {
        c.setUint32(o, a, !0), o += 4;
        const h = new TextEncoder().encode(s.args[d]);
        l.set(h, a), c.setUint8(a + h.length, 0), a += h.length + 1;
      }
      return P.enabled && P.log(new TextDecoder("utf-8").decode(l.slice(f, a))), 0;
    }, environ_sizes_get(o, a) {
      const c = new DataView(s.inst.exports.memory.buffer);
      c.setUint32(o, s.env.length, !0);
      let l = 0;
      for (const f of s.env)
        l += new TextEncoder().encode(f).length + 1;
      return c.setUint32(a, l, !0), P.log(c.getUint32(o, !0), c.getUint32(a, !0)), 0;
    }, environ_get(o, a) {
      const c = new DataView(s.inst.exports.memory.buffer), l = new Uint8Array(s.inst.exports.memory.buffer), f = a;
      for (let d = 0; d < s.env.length; d++) {
        c.setUint32(o, a, !0), o += 4;
        const h = new TextEncoder().encode(s.env[d]);
        l.set(h, a), c.setUint8(a + h.length, 0), a += h.length + 1;
      }
      return P.enabled && P.log(new TextDecoder("utf-8").decode(l.slice(f, a))), 0;
    }, clock_res_get(o, a) {
      let c;
      switch (o) {
        case ne: {
          c = 5000n;
          break;
        }
        case ee: {
          c = 1000000n;
          break;
        }
        default:
          return Pn;
      }
      return new DataView(s.inst.exports.memory.buffer).setBigUint64(a, c, !0), E;
    }, clock_time_get(o, a, c) {
      const l = new DataView(s.inst.exports.memory.buffer);
      if (o === ee)
        l.setBigUint64(c, BigInt((/* @__PURE__ */ new Date()).getTime()) * 1000000n, !0);
      else if (o == ne) {
        let f;
        try {
          f = BigInt(Math.round(performance.now() * 1e6));
        } catch {
          f = 0n;
        }
        l.setBigUint64(c, f, !0);
      } else
        l.setBigUint64(c, 0n, !0);
      return 0;
    }, fd_advise(o, a, c, l) {
      return s.fds[o] != null ? E : k;
    }, fd_allocate(o, a, c) {
      return s.fds[o] != null ? s.fds[o].fd_allocate(a, c) : k;
    }, fd_close(o) {
      if (s.fds[o] != null) {
        const a = s.fds[o].fd_close();
        return s.fds[o] = void 0, a;
      } else
        return k;
    }, fd_datasync(o) {
      return s.fds[o] != null ? s.fds[o].fd_sync() : k;
    }, fd_fdstat_get(o, a) {
      if (s.fds[o] != null) {
        const { ret: c, fdstat: l } = s.fds[o].fd_fdstat_get();
        return l?.write_bytes(new DataView(s.inst.exports.memory.buffer), a), c;
      } else
        return k;
    }, fd_fdstat_set_flags(o, a) {
      return s.fds[o] != null ? s.fds[o].fd_fdstat_set_flags(a) : k;
    }, fd_fdstat_set_rights(o, a, c) {
      return s.fds[o] != null ? s.fds[o].fd_fdstat_set_rights(a, c) : k;
    }, fd_filestat_get(o, a) {
      if (s.fds[o] != null) {
        const { ret: c, filestat: l } = s.fds[o].fd_filestat_get();
        return l?.write_bytes(new DataView(s.inst.exports.memory.buffer), a), c;
      } else
        return k;
    }, fd_filestat_set_size(o, a) {
      return s.fds[o] != null ? s.fds[o].fd_filestat_set_size(a) : k;
    }, fd_filestat_set_times(o, a, c, l) {
      return s.fds[o] != null ? s.fds[o].fd_filestat_set_times(a, c, l) : k;
    }, fd_pread(o, a, c, l, f) {
      const d = new DataView(s.inst.exports.memory.buffer), h = new Uint8Array(s.inst.exports.memory.buffer);
      if (s.fds[o] != null) {
        const w = Pt.read_bytes_array(d, a, c);
        let u = 0;
        for (const p of w) {
          const { ret: m, data: b } = s.fds[o].fd_pread(p.buf_len, l);
          if (m != E)
            return d.setUint32(f, u, !0), m;
          if (h.set(b, p.buf), u += b.length, l += BigInt(b.length), b.length != p.buf_len)
            break;
        }
        return d.setUint32(f, u, !0), E;
      } else
        return k;
    }, fd_prestat_get(o, a) {
      const c = new DataView(s.inst.exports.memory.buffer);
      if (s.fds[o] != null) {
        const { ret: l, prestat: f } = s.fds[o].fd_prestat_get();
        return f?.write_bytes(c, a), l;
      } else
        return k;
    }, fd_prestat_dir_name(o, a, c) {
      if (s.fds[o] != null) {
        const { ret: l, prestat: f } = s.fds[o].fd_prestat_get();
        if (f == null)
          return l;
        const d = f.inner.pr_name;
        return new Uint8Array(s.inst.exports.memory.buffer).set(d.slice(0, c), a), d.byteLength > c ? Dn : E;
      } else
        return k;
    }, fd_pwrite(o, a, c, l, f) {
      const d = new DataView(s.inst.exports.memory.buffer), h = new Uint8Array(s.inst.exports.memory.buffer);
      if (s.fds[o] != null) {
        const w = Wt.read_bytes_array(d, a, c);
        let u = 0;
        for (const p of w) {
          const m = h.slice(p.buf, p.buf + p.buf_len), { ret: b, nwritten: y } = s.fds[o].fd_pwrite(m, l);
          if (b != E)
            return d.setUint32(f, u, !0), b;
          if (u += y, l += BigInt(y), y != m.byteLength)
            break;
        }
        return d.setUint32(f, u, !0), E;
      } else
        return k;
    }, fd_read(o, a, c, l) {
      const f = new DataView(s.inst.exports.memory.buffer), d = new Uint8Array(s.inst.exports.memory.buffer);
      if (s.fds[o] != null) {
        const h = Pt.read_bytes_array(f, a, c);
        let w = 0;
        for (const u of h) {
          const { ret: p, data: m } = s.fds[o].fd_read(u.buf_len);
          if (p != E)
            return f.setUint32(l, w, !0), p;
          if (d.set(m, u.buf), w += m.length, m.length != u.buf_len)
            break;
        }
        return f.setUint32(l, w, !0), E;
      } else
        return k;
    }, fd_readdir(o, a, c, l, f) {
      const d = new DataView(s.inst.exports.memory.buffer), h = new Uint8Array(s.inst.exports.memory.buffer);
      if (s.fds[o] != null) {
        let w = 0;
        for (; ; ) {
          const { ret: u, dirent: p } = s.fds[o].fd_readdir_single(l);
          if (u != 0)
            return d.setUint32(f, w, !0), u;
          if (p == null)
            break;
          if (c - w < p.head_length()) {
            w = c;
            break;
          }
          const m = new ArrayBuffer(p.head_length());
          if (p.write_head_bytes(new DataView(m), 0), h.set(new Uint8Array(m).slice(0, Math.min(m.byteLength, c - w)), a), a += p.head_length(), w += p.head_length(), c - w < p.name_length()) {
            w = c;
            break;
          }
          p.write_name_bytes(h, a, c - w), a += p.name_length(), w += p.name_length(), l = p.d_next;
        }
        return d.setUint32(f, w, !0), 0;
      } else
        return k;
    }, fd_renumber(o, a) {
      if (s.fds[o] != null && s.fds[a] != null) {
        const c = s.fds[a].fd_close();
        return c != 0 ? c : (s.fds[a] = s.fds[o], s.fds[o] = void 0, 0);
      } else
        return k;
    }, fd_seek(o, a, c, l) {
      const f = new DataView(s.inst.exports.memory.buffer);
      if (s.fds[o] != null) {
        const { ret: d, offset: h } = s.fds[o].fd_seek(a, c);
        return f.setBigInt64(l, h, !0), d;
      } else
        return k;
    }, fd_sync(o) {
      return s.fds[o] != null ? s.fds[o].fd_sync() : k;
    }, fd_tell(o, a) {
      const c = new DataView(s.inst.exports.memory.buffer);
      if (s.fds[o] != null) {
        const { ret: l, offset: f } = s.fds[o].fd_tell();
        return c.setBigUint64(a, f, !0), l;
      } else
        return k;
    }, fd_write(o, a, c, l) {
      const f = new DataView(s.inst.exports.memory.buffer), d = new Uint8Array(s.inst.exports.memory.buffer);
      if (s.fds[o] != null) {
        const h = Wt.read_bytes_array(f, a, c);
        let w = 0;
        for (const u of h) {
          const p = d.slice(u.buf, u.buf + u.buf_len), { ret: m, nwritten: b } = s.fds[o].fd_write(p);
          if (m != E)
            return f.setUint32(l, w, !0), m;
          if (w += b, b != p.byteLength)
            break;
        }
        return f.setUint32(l, w, !0), E;
      } else
        return k;
    }, path_create_directory(o, a, c) {
      const l = new Uint8Array(s.inst.exports.memory.buffer);
      if (s.fds[o] != null) {
        const f = new TextDecoder("utf-8").decode(l.slice(a, a + c));
        return s.fds[o].path_create_directory(f);
      } else
        return k;
    }, path_filestat_get(o, a, c, l, f) {
      const d = new DataView(s.inst.exports.memory.buffer), h = new Uint8Array(s.inst.exports.memory.buffer);
      if (s.fds[o] != null) {
        const w = new TextDecoder("utf-8").decode(h.slice(c, c + l)), { ret: u, filestat: p } = s.fds[o].path_filestat_get(a, w);
        return p?.write_bytes(d, f), u;
      } else
        return k;
    }, path_filestat_set_times(o, a, c, l, f, d, h) {
      const w = new Uint8Array(s.inst.exports.memory.buffer);
      if (s.fds[o] != null) {
        const u = new TextDecoder("utf-8").decode(w.slice(c, c + l));
        return s.fds[o].path_filestat_set_times(a, u, f, d, h);
      } else
        return k;
    }, path_link(o, a, c, l, f, d, h) {
      const w = new Uint8Array(s.inst.exports.memory.buffer);
      if (s.fds[o] != null && s.fds[f] != null) {
        const u = new TextDecoder("utf-8").decode(w.slice(c, c + l)), p = new TextDecoder("utf-8").decode(w.slice(d, d + h)), { ret: m, inode_obj: b } = s.fds[o].path_lookup(u, a);
        return b == null ? m : s.fds[f].path_link(p, b, !1);
      } else
        return k;
    }, path_open(o, a, c, l, f, d, h, w, u) {
      const p = new DataView(s.inst.exports.memory.buffer), m = new Uint8Array(s.inst.exports.memory.buffer);
      if (s.fds[o] != null) {
        const b = new TextDecoder("utf-8").decode(m.slice(c, c + l));
        P.log(b);
        const { ret: y, fd_obj: x } = s.fds[o].path_open(a, b, f, d, h, w);
        if (y != 0)
          return y;
        s.fds.push(x);
        const v = s.fds.length - 1;
        return p.setUint32(u, v, !0), 0;
      } else
        return k;
    }, path_readlink(o, a, c, l, f, d) {
      const h = new DataView(s.inst.exports.memory.buffer), w = new Uint8Array(s.inst.exports.memory.buffer);
      if (s.fds[o] != null) {
        const u = new TextDecoder("utf-8").decode(w.slice(a, a + c));
        P.log(u);
        const { ret: p, data: m } = s.fds[o].path_readlink(u);
        if (m != null) {
          const b = new TextEncoder().encode(m);
          if (b.length > f)
            return h.setUint32(d, 0, !0), k;
          w.set(b, l), h.setUint32(d, b.length, !0);
        }
        return p;
      } else
        return k;
    }, path_remove_directory(o, a, c) {
      const l = new Uint8Array(s.inst.exports.memory.buffer);
      if (s.fds[o] != null) {
        const f = new TextDecoder("utf-8").decode(l.slice(a, a + c));
        return s.fds[o].path_remove_directory(f);
      } else
        return k;
    }, path_rename(o, a, c, l, f, d) {
      const h = new Uint8Array(s.inst.exports.memory.buffer);
      if (s.fds[o] != null && s.fds[l] != null) {
        const w = new TextDecoder("utf-8").decode(h.slice(a, a + c)), u = new TextDecoder("utf-8").decode(h.slice(f, f + d));
        let { ret: p, inode_obj: m } = s.fds[o].path_unlink(w);
        if (m == null)
          return p;
        if (p = s.fds[l].path_link(u, m, !0), p != E && s.fds[o].path_link(w, m, !0) != E)
          throw "path_link should always return success when relinking an inode back to the original place";
        return p;
      } else
        return k;
    }, path_symlink(o, a, c, l, f) {
      const d = new Uint8Array(s.inst.exports.memory.buffer);
      return s.fds[c] != null ? (new TextDecoder("utf-8").decode(d.slice(o, o + a)), new TextDecoder("utf-8").decode(d.slice(l, l + f)), S) : k;
    }, path_unlink_file(o, a, c) {
      const l = new Uint8Array(s.inst.exports.memory.buffer);
      if (s.fds[o] != null) {
        const f = new TextDecoder("utf-8").decode(l.slice(a, a + c));
        return s.fds[o].path_unlink_file(f);
      } else
        return k;
    }, poll_oneoff(o, a, c) {
      if (c === 0)
        return It;
      if (c > 1)
        return P.log("poll_oneoff: only a single subscription is supported"), S;
      const l = new DataView(s.inst.exports.memory.buffer), f = me.read_bytes(l, o), d = f.eventtype, h = f.clockid, w = f.timeout;
      if (d !== $n)
        return P.log("poll_oneoff: only clock subscriptions are supported"), S;
      let u;
      if (h === ne)
        u = () => BigInt(Math.round(performance.now() * 1e6));
      else if (h === ee)
        u = () => BigInt((/* @__PURE__ */ new Date()).getTime()) * 1000000n;
      else
        return It;
      const p = (f.flags & Gn) !== 0 ? w : u() + w;
      for (; p > u(); )
        ;
      return new Vn(f.userdata, E, d).write_bytes(l, a), E;
    }, proc_exit(o) {
      throw new Le(o);
    }, proc_raise(o) {
      throw "raised signal " + o;
    }, sched_yield() {
    }, random_get(o, a) {
      const c = new Uint8Array(s.inst.exports.memory.buffer).subarray(o, o + a);
      if ("crypto" in globalThis && (typeof SharedArrayBuffer > "u" || !(s.inst.exports.memory.buffer instanceof SharedArrayBuffer)))
        for (let l = 0; l < a; l += 65536)
          crypto.getRandomValues(c.subarray(l, l + 65536));
      else
        for (let l = 0; l < a; l++)
          c[l] = Math.random() * 256 | 0;
    }, sock_recv(o, a, c) {
      throw "sockets not supported";
    }, sock_send(o, a, c) {
      throw "sockets not supported";
    }, sock_shutdown(o, a) {
      throw "sockets not supported";
    }, sock_accept(o, a) {
      throw "sockets not supported";
    } };
  }
};
class ye {
  fd_allocate(t, e) {
    return S;
  }
  fd_close() {
    return 0;
  }
  fd_fdstat_get() {
    return { ret: S, fdstat: null };
  }
  fd_fdstat_set_flags(t) {
    return S;
  }
  fd_fdstat_set_rights(t, e) {
    return S;
  }
  fd_filestat_get() {
    return { ret: S, filestat: null };
  }
  fd_filestat_set_size(t) {
    return S;
  }
  fd_filestat_set_times(t, e, n) {
    return S;
  }
  fd_pread(t, e) {
    return { ret: S, data: new Uint8Array() };
  }
  fd_prestat_get() {
    return { ret: S, prestat: null };
  }
  fd_pwrite(t, e) {
    return { ret: S, nwritten: 0 };
  }
  fd_read(t) {
    return { ret: S, data: new Uint8Array() };
  }
  fd_readdir_single(t) {
    return { ret: S, dirent: null };
  }
  fd_seek(t, e) {
    return { ret: S, offset: 0n };
  }
  fd_sync() {
    return 0;
  }
  fd_tell() {
    return { ret: S, offset: 0n };
  }
  fd_write(t) {
    return { ret: S, nwritten: 0 };
  }
  path_create_directory(t) {
    return S;
  }
  path_filestat_get(t, e) {
    return { ret: S, filestat: null };
  }
  path_filestat_set_times(t, e, n, i, s) {
    return S;
  }
  path_link(t, e, n) {
    return S;
  }
  path_unlink(t) {
    return { ret: S, inode_obj: null };
  }
  path_lookup(t, e) {
    return { ret: S, inode_obj: null };
  }
  path_open(t, e, n, i, s, o) {
    return { ret: at, fd_obj: null };
  }
  path_readlink(t) {
    return { ret: S, data: null };
  }
  path_remove_directory(t) {
    return S;
  }
  path_rename(t, e, n) {
    return S;
  }
  path_unlink_file(t) {
    return S;
  }
}
class lt {
  static issue_ino() {
    return lt.next_ino++;
  }
  static root_ino() {
    return 0n;
  }
  constructor() {
    this.ino = lt.issue_ino();
  }
}
lt.next_ino = 1n;
class Ke extends ye {
  fd_allocate(t, e) {
    if (!(this.file.size > t + e)) {
      const n = new Uint8Array(Number(t + e));
      n.set(this.file.data, 0), this.file.data = n;
    }
    return E;
  }
  fd_fdstat_get() {
    return { ret: 0, fdstat: new pe(Ht, 0) };
  }
  fd_filestat_set_size(t) {
    if (this.file.size > t)
      this.file.data = new Uint8Array(this.file.data.buffer.slice(0, Number(t)));
    else {
      const e = new Uint8Array(Number(t));
      e.set(this.file.data, 0), this.file.data = e;
    }
    return E;
  }
  fd_read(t) {
    const e = this.file.data.slice(Number(this.file_pos), Number(this.file_pos + BigInt(t)));
    return this.file_pos += BigInt(e.length), { ret: 0, data: e };
  }
  fd_pread(t, e) {
    return { ret: 0, data: this.file.data.slice(Number(e), Number(e + BigInt(t))) };
  }
  fd_seek(t, e) {
    let n;
    switch (e) {
      case Wn:
        n = t;
        break;
      case zn:
        n = this.file_pos + t;
        break;
      case Je:
        n = BigInt(this.file.data.byteLength) + t;
        break;
      default:
        return { ret: It, offset: 0n };
    }
    return n < 0 ? { ret: It, offset: 0n } : (this.file_pos = n, { ret: 0, offset: this.file_pos });
  }
  fd_tell() {
    return { ret: 0, offset: this.file_pos };
  }
  fd_write(t) {
    if (this.file.readonly) return { ret: k, nwritten: 0 };
    if (this.file_pos + BigInt(t.byteLength) > this.file.size) {
      const e = this.file.data;
      this.file.data = new Uint8Array(Number(this.file_pos + BigInt(t.byteLength))), this.file.data.set(e);
    }
    return this.file.data.set(t, Number(this.file_pos)), this.file_pos += BigInt(t.byteLength), { ret: 0, nwritten: t.byteLength };
  }
  fd_pwrite(t, e) {
    if (this.file.readonly) return { ret: k, nwritten: 0 };
    if (e + BigInt(t.byteLength) > this.file.size) {
      const n = this.file.data;
      this.file.data = new Uint8Array(Number(e + BigInt(t.byteLength))), this.file.data.set(n);
    }
    return this.file.data.set(t, Number(e)), { ret: 0, nwritten: t.byteLength };
  }
  fd_filestat_get() {
    return { ret: 0, filestat: this.file.stat() };
  }
  constructor(t) {
    super(), this.file_pos = 0n, this.file = t;
  }
}
class Ze extends ye {
  fd_seek(t, e) {
    return { ret: k, offset: 0n };
  }
  fd_tell() {
    return { ret: k, offset: 0n };
  }
  fd_allocate(t, e) {
    return k;
  }
  fd_fdstat_get() {
    return { ret: 0, fdstat: new pe(G, 0) };
  }
  fd_readdir_single(t) {
    if (P.enabled && (P.log("readdir_single", t), P.log(t, this.dir.contents.keys())), t == 0n)
      return { ret: E, dirent: new re(1n, this.dir.ino, ".", G) };
    if (t == 1n)
      return { ret: E, dirent: new re(2n, this.dir.parent_ino(), "..", G) };
    if (t >= BigInt(this.dir.contents.size) + 2n)
      return { ret: 0, dirent: null };
    const [e, n] = Array.from(this.dir.contents.entries())[Number(t - 2n)];
    return { ret: 0, dirent: new re(t + 1n, n.ino, e, n.stat().filetype) };
  }
  path_filestat_get(t, e) {
    const { ret: n, path: i } = ot.from(e);
    if (i == null)
      return { ret: n, filestat: null };
    const { ret: s, entry: o } = this.dir.get_entry_for_path(i);
    return o == null ? { ret: s, filestat: null } : { ret: 0, filestat: o.stat() };
  }
  path_lookup(t, e) {
    const { ret: n, path: i } = ot.from(t);
    if (i == null)
      return { ret: n, inode_obj: null };
    const { ret: s, entry: o } = this.dir.get_entry_for_path(i);
    return o == null ? { ret: s, inode_obj: null } : { ret: E, inode_obj: o };
  }
  path_open(t, e, n, i, s, o) {
    const { ret: a, path: c } = ot.from(e);
    if (c == null)
      return { ret: a, fd_obj: null };
    let { ret: l, entry: f } = this.dir.get_entry_for_path(c);
    if (f == null) {
      if (l != ft)
        return { ret: l, fd_obj: null };
      if ((n & ie) == ie) {
        const { ret: d, entry: h } = this.dir.create_entry_for_path(e, (n & At) == At);
        if (h == null)
          return { ret: d, fd_obj: null };
        f = h;
      } else
        return { ret: ft, fd_obj: null };
    } else if ((n & Be) == Be)
      return { ret: Vt, fd_obj: null };
    return (n & At) == At && f.stat().filetype !== G ? { ret: at, fd_obj: null } : f.path_open(n, i, o);
  }
  path_create_directory(t) {
    return this.path_open(0, t, ie | At, 0n, 0n, 0).ret;
  }
  path_link(t, e, n) {
    const { ret: i, path: s } = ot.from(t);
    if (s == null)
      return i;
    if (s.is_dir)
      return ft;
    const { ret: o, parent_entry: a, filename: c, entry: l } = this.dir.get_parent_dir_and_entry_for_path(s, !0);
    if (a == null || c == null)
      return o;
    if (l != null) {
      const f = e.stat().filetype == G, d = l.stat().filetype == G;
      if (f && d)
        if (n && l instanceof ct) {
          if (l.contents.size != 0) return Fe;
        } else
          return Vt;
      else {
        if (f && !d)
          return at;
        if (!f && d)
          return Ue;
        if (!(e.stat().filetype == Ht && l.stat().filetype == Ht)) return Vt;
      }
    }
    return !n && e.stat().filetype == G ? _e : (a.contents.set(c, e), E);
  }
  path_unlink(t) {
    const { ret: e, path: n } = ot.from(t);
    if (n == null)
      return { ret: e, inode_obj: null };
    const { ret: i, parent_entry: s, filename: o, entry: a } = this.dir.get_parent_dir_and_entry_for_path(n, !0);
    return s == null || o == null ? { ret: i, inode_obj: null } : a == null ? { ret: ft, inode_obj: null } : (s.contents.delete(o), { ret: E, inode_obj: a });
  }
  path_unlink_file(t) {
    const { ret: e, path: n } = ot.from(t);
    if (n == null)
      return e;
    const { ret: i, parent_entry: s, filename: o, entry: a } = this.dir.get_parent_dir_and_entry_for_path(n, !1);
    return s == null || o == null || a == null ? i : a.stat().filetype === G ? Ue : (s.contents.delete(o), E);
  }
  path_remove_directory(t) {
    const { ret: e, path: n } = ot.from(t);
    if (n == null)
      return e;
    const { ret: i, parent_entry: s, filename: o, entry: a } = this.dir.get_parent_dir_and_entry_for_path(n, !1);
    return s == null || o == null || a == null ? i : !(a instanceof ct) || a.stat().filetype !== G ? at : a.contents.size !== 0 ? Fe : s.contents.delete(o) ? E : ft;
  }
  fd_filestat_get() {
    return { ret: 0, filestat: this.dir.stat() };
  }
  fd_filestat_set_size(t) {
    return k;
  }
  fd_read(t) {
    return { ret: k, data: new Uint8Array() };
  }
  fd_pread(t, e) {
    return { ret: k, data: new Uint8Array() };
  }
  fd_write(t) {
    return { ret: k, nwritten: 0 };
  }
  fd_pwrite(t, e) {
    return { ret: k, nwritten: 0 };
  }
  constructor(t) {
    super(), this.dir = t;
  }
}
class Kn extends Ze {
  fd_prestat_get() {
    return { ret: 0, prestat: be.dir(this.prestat_name) };
  }
  constructor(t, e) {
    super(new ct(e)), this.prestat_name = t;
  }
}
class ue extends lt {
  path_open(t, e, n) {
    if (this.readonly && (e & BigInt(fe)) == BigInt(fe))
      return { ret: _e, fd_obj: null };
    if ((t & Oe) == Oe) {
      if (this.readonly) return { ret: _e, fd_obj: null };
      this.data = new Uint8Array([]);
    }
    const i = new Ke(this);
    return n & jn && i.fd_seek(0n, Je), { ret: E, fd_obj: i };
  }
  get size() {
    return BigInt(this.data.byteLength);
  }
  stat() {
    return new we(this.ino, Ht, this.size);
  }
  constructor(t, e) {
    super(), this.data = new Uint8Array(t), this.readonly = !!e?.readonly;
  }
}
let ot = class Qe {
  static from(t) {
    const e = new Qe();
    if (e.is_dir = t.endsWith("/"), t.startsWith("/"))
      return { ret: Ce, path: null };
    if (t.includes("\\0"))
      return { ret: It, path: null };
    for (const n of t.split("/"))
      if (!(n === "" || n === ".")) {
        if (n === "..") {
          if (e.parts.pop() == null)
            return { ret: Ce, path: null };
          continue;
        }
        e.parts.push(n);
      }
    return { ret: E, path: e };
  }
  to_path_string() {
    let t = this.parts.join("/");
    return this.is_dir && (t += "/"), t;
  }
  constructor() {
    this.parts = [], this.is_dir = !1;
  }
};
class ct extends lt {
  parent_ino() {
    return this.parent == null ? lt.root_ino() : this.parent.ino;
  }
  path_open(t, e, n) {
    return { ret: E, fd_obj: new Ze(this) };
  }
  stat() {
    return new we(this.ino, G, 0n);
  }
  get_entry_for_path(t) {
    let e = this;
    for (const n of t.parts) {
      if (!(e instanceof ct))
        return { ret: at, entry: null };
      const i = e.contents.get(n);
      if (i !== void 0)
        e = i;
      else
        return P.log(n), { ret: ft, entry: null };
    }
    return t.is_dir && e.stat().filetype != G ? { ret: at, entry: null } : { ret: E, entry: e };
  }
  get_parent_dir_and_entry_for_path(t, e) {
    const n = t.parts.pop();
    if (n === void 0)
      return { ret: It, parent_entry: null, filename: null, entry: null };
    const { ret: i, entry: s } = this.get_entry_for_path(t);
    if (s == null)
      return { ret: i, parent_entry: null, filename: null, entry: null };
    if (!(s instanceof ct))
      return { ret: at, parent_entry: null, filename: null, entry: null };
    const o = s.contents.get(n);
    return o === void 0 ? e ? { ret: E, parent_entry: s, filename: n, entry: null } : { ret: ft, parent_entry: null, filename: null, entry: null } : t.is_dir && o.stat().filetype != G ? { ret: at, parent_entry: null, filename: null, entry: null } : { ret: E, parent_entry: s, filename: n, entry: o };
  }
  create_entry_for_path(t, e) {
    const { ret: n, path: i } = ot.from(t);
    if (i == null)
      return { ret: n, entry: null };
    let { ret: s, parent_entry: o, filename: a, entry: c } = this.get_parent_dir_and_entry_for_path(i, !0);
    if (o == null || a == null)
      return { ret: s, entry: null };
    if (c != null)
      return { ret: Vt, entry: null };
    P.log("create", i);
    let l;
    return e ? l = new ct(/* @__PURE__ */ new Map()) : l = new ue(new ArrayBuffer(0)), o.contents.set(a, l), c = l, { ret: E, entry: c };
  }
  constructor(t) {
    super(), this.parent = null, t instanceof Array ? this.contents = new Map(t) : this.contents = t;
    for (const e of this.contents.values())
      e instanceof ct && (e.parent = this);
  }
}
class Xt extends ye {
  fd_filestat_get() {
    return { ret: 0, filestat: new we(this.ino, Re, BigInt(0)) };
  }
  fd_fdstat_get() {
    const t = new pe(Re, 0);
    return t.fs_rights_base = BigInt(fe), { ret: 0, fdstat: t };
  }
  fd_write(t) {
    return this.write(t), { ret: 0, nwritten: t.byteLength };
  }
  static lineBuffered(t) {
    const e = new TextDecoder("utf-8", { fatal: !1 });
    let n = "";
    return new Xt((i) => {
      n += e.decode(i, { stream: !0 });
      const s = n.split(\`
\`);
      for (const [o, a] of s.entries())
        o < s.length - 1 ? t(a) : n = a;
    });
  }
  constructor(t) {
    super(), this.ino = lt.issue_ino(), this.write = t;
  }
}
let bt = null, se = null;
const Zn = "extract_cog_subset", Qn = "extract_wms_subset", tr = "extract_xyz_tile_subset", er = "pmtiles_extract";
async function tn(r) {
  return bt || (r || (r = "geolibre-cli.wasm"), r instanceof Uint8Array || r instanceof ArrayBuffer ? bt = await WebAssembly.compile(r) : r instanceof Response ? bt = await WebAssembly.compileStreaming(r) : bt = await WebAssembly.compileStreaming(fetch(r)), bt);
}
async function qt() {
  return se || (se = qe()), se;
}
async function xe(r) {
  if (typeof r == "string") {
    if (!/^https?:\\/\\//i.test(r))
      throw new Error(\`input string must be an http(s) URL, got: \${r}\`);
    const t = await fetch(r, { headers: { "User-Agent": "Mozilla/5.0 (geolibre-wasm)" } });
    return new Uint8Array(await t.arrayBuffer());
  }
  return new Uint8Array(r);
}
function nr(r, t, e) {
  const n = r[0] ?? "tool", i = e.map((o) => o.trimEnd()).filter(Boolean).slice(-12), s = i.length ? \`
\${i.join(\`
\`)}\` : "";
  return \`\${n} crashed: \${t.message}\${s}\`;
}
async function rr(r, t) {
  const e = await tn(), n = new Set(Object.keys(t)), i = await Promise.all(
    Object.entries(t).map(async ([u, p]) => [u, new ue(await xe(p))])
  ), s = new Map(i), o = new Kn("/work", s), a = [], c = [
    new Ke(new ue(new Uint8Array())),
    Xt.lineBuffered((u) => a.push(u)),
    Xt.lineBuffered((u) => a.push(u)),
    o
  ], l = new Jn(["geolibre", ...r], [], c, { debug: !1 }), f = await WebAssembly.instantiate(e, { wasi_snapshot_preview1: l.wasiImport });
  let d = 0;
  try {
    d = l.start(f);
  } catch (u) {
    if (u && u.constructor && u.constructor.name === "WASIProcExit") d = u.code;
    else throw new Error(nr(r, u, a), { cause: u });
  }
  const h = {}, w = (u, p) => {
    for (const [m, b] of u.contents) {
      const y = p ? \`\${p}/\${m}\` : m;
      b && b.contents ? w(b, y) : b && b.data && !(p === "" && n.has(m)) && (h[y] = b.data);
    }
  };
  return w(o.dir, ""), { exitCode: d, stdout: a, files: h };
}
async function ir(r, t = {}) {
  const { args: e = [], input: n = {} } = t;
  return r === Zn ? sr(e, n) : r === Qn ? or(e) : r === tr ? ar(e) : r === er ? cr(e, n) : rr([r, ...e], n);
}
function Jt(r) {
  const t = {};
  for (let e = 0; e < r.length; e++) {
    const n = r[e];
    if (!n.startsWith("--")) continue;
    const i = n.slice(2);
    if (i.includes("=")) {
      const [s, ...o] = i.split("=");
      t[s] = o.join("=");
    } else e + 1 < r.length && !r[e + 1].startsWith("--") ? t[i] = r[++e] : t[i] = !0;
  }
  return t;
}
function Kt(r) {
  const t = String(r || "").split(",").map((e) => Number(e.trim()));
  if (t.length !== 4 || t.some((e) => !Number.isFinite(e)) || t[0] >= t[2] || t[1] >= t[3])
    throw new Error("--bbox must be ordered as minX,minY,maxX,maxY");
  return t;
}
function ht(r, t) {
  if (r == null || r === !0 || String(r).trim() === "") return;
  const e = Number(r);
  if (!Number.isFinite(e)) throw new Error(\`--\${t} must be a number\`);
  return e;
}
function ut(r, t) {
  if (r == null || r === !0 || String(r).trim() === "") return;
  const e = Number(r);
  if (!Number.isInteger(e) || e <= 0) throw new Error(\`--\${t} must be a positive integer\`);
  return e;
}
function Zt(r, t) {
  if (r == null || r === !0 || String(r).trim() === "") return;
  const e = Number(r);
  if (!Number.isInteger(e) || e <= 0) throw new Error(\`--\${t} must be a positive EPSG code\`);
  return e;
}
function Qt(r) {
  return !r || r === !0 ? "subset.tif" : String(r).replace(/^\\/work\\/?/, "") || "subset.tif";
}
async function sr(r, t) {
  const e = Jt(r), n = e.url, i = e.input, s = Kt(e.bbox), o = Number(e.bbox_crs ?? e.bboxCrs ?? e.crs), a = ht(e.level, "level"), c = ht(e.resolution, "resolution"), l = Zt(e.output_crs ?? e.outputCrs, "output_crs"), f = ht(e.nodata, "nodata"), d = Qt(e.output), h = [];
  try {
    const w = await ur({ url: n, inputPath: i, inputFiles: t }), u = await Fr(w, { bbox: s, bboxCrs: o, level: a, resolution: c, outputCrs: l, nodata: f });
    return h.push(JSON.stringify({ output: \`/work/\${d}\`, bytes: u.byteLength })), { exitCode: 0, stdout: h, files: { [d]: u } };
  } catch (w) {
    return h.push(String(w?.message || w)), { exitCode: 1, stdout: h, files: {} };
  }
}
async function or(r) {
  const t = Jt(r), e = t.url, n = t.layers, i = t.styles, s = Kt(t.bbox), o = Number(t.bbox_crs ?? t.bboxCrs ?? t.crs), a = ht(t.resolution, "resolution"), c = ut(t.width, "width"), l = ut(t.height, "height"), f = Zt(t.output_crs ?? t.outputCrs, "output_crs"), d = ht(t.nodata, "nodata"), h = t.format == null || t.format === !0 ? void 0 : String(t.format), w = t.version == null || t.version === !0 ? void 0 : String(t.version), u = Qt(t.output), p = [];
  try {
    const m = await Tr(e, {
      layers: n,
      styles: i,
      bbox: s,
      bboxCrs: o,
      resolution: a,
      width: c,
      height: l,
      outputCrs: f,
      nodata: d,
      format: h,
      version: w
    });
    return p.push(JSON.stringify({ output: \`/work/\${u}\`, bytes: m.byteLength })), { exitCode: 0, stdout: p, files: { [u]: m } };
  } catch (m) {
    return p.push(String(m?.message || m)), { exitCode: 1, stdout: p, files: {} };
  }
}
async function ar(r) {
  const t = Jt(r), e = t.url, n = ut(t.zoom, "zoom"), i = Kt(t.bbox), s = Number(t.bbox_crs ?? t.bboxCrs ?? t.crs), o = ht(t.resolution, "resolution"), a = ut(t.width, "width"), c = ut(t.height, "height"), l = Zt(t.output_crs ?? t.outputCrs, "output_crs"), f = ut(t.tile_size ?? t.tileSize, "tile_size"), d = ht(t.nodata, "nodata"), h = t.subdomains == null || t.subdomains === !0 ? void 0 : String(t.subdomains), w = Qt(t.output), u = [];
  try {
    const p = await Ur(e, {
      zoom: n,
      bbox: i,
      bboxCrs: s,
      resolution: o,
      width: a,
      height: c,
      outputCrs: l,
      tileSize: f,
      subdomains: h,
      nodata: d
    });
    return u.push(JSON.stringify({ output: \`/work/\${w}\`, bytes: p.byteLength })), { exitCode: 0, stdout: u, files: { [w]: p } };
  } catch (p) {
    return u.push(String(p?.message || p)), { exitCode: 1, stdout: u, files: {} };
  }
}
async function cr(r, t) {
  const e = Jt(r), n = e.url, i = e.input, s = Kt(e.bbox), o = Zt(e.bbox_crs ?? e.bboxCrs ?? e.crs, "bbox_crs"), a = De(e.min_zoom ?? e.minZoom, 0), c = De(e.max_zoom ?? e.maxZoom, 30), l = ut(e.max_tiles ?? e.maxTiles, "max_tiles"), f = fr(e.output), d = [];
  try {
    await qt();
    const h = o && o !== 4326 ? Array.from(yt(o, 4326, Float64Array.from(s))) : s, w = en(
      await _r({ url: n, inputPath: i, inputFiles: t })
    ), u = await lr(w, {
      bbox: h,
      minZoom: a,
      maxZoom: c,
      maxTiles: l
    });
    return d.push(
      JSON.stringify({ output: \`/work/\${f}\`, bytes: u.byteLength })
    ), { exitCode: 0, stdout: d, files: { [f]: u } };
  } catch (h) {
    return d.push(String(h?.message || h)), { exitCode: 1, stdout: d, files: {} };
  }
}
async function lr(r, { bbox: t, minZoom: e, maxZoom: n, maxTiles: i }) {
  const s = new le(
    t[0],
    t[1],
    t[2],
    t[3],
    e,
    n
  );
  try {
    for (i != null && s.set_max_tiles(i); !s.done; ) {
      const o = JSON.parse(s.wanted_json());
      if (o.length === 0)
        throw new Error("PMTiles extractor stalled: not done but nothing wanted");
      const a = await Promise.all(
        o.map(({ offset: c, length: l }) => r.range(c, l))
      );
      o.forEach(({ offset: c }, l) => s.feed(c, a[l]));
    }
    return s.finish();
  } finally {
    s.free();
  }
}
async function _r({ url: r, inputPath: t, inputFiles: e }) {
  const n = r && r !== !0 && String(r).trim() !== "";
  if (!n && !t)
    throw new Error("provide either --url=<http pmtiles> or --input=/work/local.pmtiles");
  if (n && t)
    throw new Error("provide only one source: --url or --input");
  if (n) return String(r).trim();
  const i = String(t).replace(/^\\/work\\/?/, "");
  if (!e || !(i in e))
    throw new Error(\`input file not found in /work: \${t}\`);
  return xe(e[i]);
}
function De(r, t) {
  if (r == null || r === !0 || String(r).trim() === "") return t;
  const e = Number(r);
  if (!Number.isInteger(e) || e < 0 || e > 30)
    throw new Error("zoom levels must be whole numbers in 0..=30");
  return e;
}
function fr(r) {
  return !r || r === !0 ? "extract.pmtiles" : String(r).replace(/^\\/work\\/?/, "") || "extract.pmtiles";
}
async function ur({ url: r, inputPath: t, inputFiles: e }) {
  if ((r == null || r === !0 || String(r).trim() === "") && !t)
    throw new Error("provide either --url=<http COG> or --input=/work/local.tif");
  if (r && r !== !0 && t)
    throw new Error("provide only one source: --url or --input");
  if (r && r !== !0) return String(r).trim();
  const n = Qt(t);
  if (!e || !(n in e))
    throw new Error(\`input file not found in /work: \${t}\`);
  return xe(e[n]);
}
async function dr(r, t, e, n) {
  const i = t + e - 1, s = new Headers(n?.headers || {});
  s.set("Range", \`bytes=\${t}-\${i}\`);
  try {
    s.has("User-Agent") || s.set("User-Agent", "Mozilla/5.0 (geolibre-wasm)");
  } catch {
  }
  const o = await fetch(r, { ...n, headers: s });
  if (o.status !== 206)
    throw new Error(\`server must support HTTP range requests (expected 206, got \${o.status})\`);
  return new Uint8Array(await o.arrayBuffer());
}
function en(r, t) {
  if (typeof r == "string") {
    if (!/^https?:\\/\\//i.test(r)) throw new Error(\`url must be HTTP(S), got: \${r}\`);
    return {
      type: "http",
      async range(n, i) {
        return dr(r, n, i, t);
      }
    };
  }
  const e = new Uint8Array(r);
  return {
    type: "local",
    async range(n, i) {
      if (n < 0 || i < 0 || n >= e.byteLength)
        throw new Error(\`requested byte range \${n}-\${n + i - 1} exceeds local COG size\`);
      return e.slice(n, Math.min(e.byteLength, n + i));
    }
  };
}
async function gr(r, t) {
  const e = t.maxHeaderBytes ?? 8388608;
  let n = t.initialHeaderBytes ?? 256 * 1024, i = null;
  for (; n <= e; ) {
    const s = await r.range(0, n);
    try {
      return { stream: new ce(s), headerBytes: n, header: s };
    } catch (o) {
      i = o;
      const a = String(o?.message || o);
      if (!/(need more header bytes|failed to fill whole buffer)/i.test(a)) throw o;
      n *= 2;
    }
  }
  throw new Error(\`could not parse COG header within \${e} bytes: \${i}\`);
}
function hr(r) {
  return JSON.parse(r.levels_json());
}
function nn(r) {
  if (r[0] !== 73 || r[1] !== 73) throw new Error("only little-endian TIFF metadata is supported");
  const t = new DataView(r.buffer, r.byteOffset, r.byteLength), e = t.getUint16(2, !0), n = e === 43;
  if (!n && e !== 42) throw new Error("not a TIFF header");
  return {
    dv: t,
    big: n,
    inlineBytes: n ? 8 : 4,
    firstIfdOffset: Number(n ? t.getBigUint64(8, !0) : t.getUint32(4, !0)),
    readOffset(i) {
      return Number(n ? t.getBigUint64(i, !0) : t.getUint32(i, !0));
    },
    readCount(i) {
      return Number(n ? t.getBigUint64(i, !0) : t.getUint16(i, !0));
    },
    writeFirstIfd(i, s) {
      n ? new DataView(i.buffer).setBigUint64(8, BigInt(s), !0) : new DataView(i.buffer).setUint32(4, s, !0);
    }
  };
}
const pr = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 12: 8, 16: 8 };
function rn(r, t, e) {
  const n = new DataView(r.buffer, r.byteOffset, r.byteLength), i = Number(e ? n.getBigUint64(t, !0) : n.getUint16(t, !0)), s = e ? 8 : 2, o = e ? 20 : 12, a = e ? 8 : 4, c = [];
  for (let d = 0; d < i; d++) {
    const h = t + s + d * o, w = n.getUint16(h, !0), u = n.getUint16(h + 2, !0), p = Number(e ? n.getBigUint64(h + 4, !0) : n.getUint32(h + 4, !0)), m = p * (pr[u] || 1), b = h + (e ? 12 : 8), y = m <= a ? b : Number(e ? n.getBigUint64(b, !0) : n.getUint32(b, !0));
    c.push({ tag: w, type: u, count: p, bytesLen: m, valuePos: b, valueOffset: y });
  }
  const l = t + s + i * o, f = Number(e ? n.getBigUint64(l, !0) : n.getUint32(l, !0));
  return { count: i, entries: c, nextOffset: f };
}
function wr(r, t, e) {
  const n = t.entries.find((i) => i.tag === e);
  if (!(!n || n.type !== 3 || n.count < 1))
    return new DataView(r.buffer, r.byteOffset, r.byteLength).getUint16(n.valueOffset, !0);
}
function mr(r, t, e) {
  const n = t.entries.find((i) => i.tag === e);
  if (!(!n || n.valueOffset + n.bytesLen > r.byteLength))
    return { type: n.type, count: n.count, bytes: r.slice(n.valueOffset, n.valueOffset + n.bytesLen) };
}
function sn(r) {
  try {
    const t = nn(r), e = rn(r, t.firstIfdOffset, t.big);
    if (wr(r, e, 262) !== 3) return null;
    const n = mr(r, e, 320);
    return !n || n.type !== 3 || n.count < 3 || n.count % 3 !== 0 ? null : n;
  } catch {
    return null;
  }
}
function br(r, t, e, n, i, s, o, a) {
  const c = new DataView(r.buffer);
  c.setUint16(t, n, !0), c.setUint16(t + 2, i, !0), e ? (c.setBigUint64(t + 4, BigInt(s), !0), o.byteLength <= 8 ? r.set(o, t + 12) : c.setBigUint64(t + 12, BigInt(a), !0)) : (c.setUint32(t + 4, s, !0), o.byteLength <= 4 ? r.set(o, t + 8) : c.setUint32(t + 8, a, !0));
}
function yr(r, t) {
  if (!t) return r;
  const e = nn(r), n = rn(r, e.firstIfdOffset, e.big), i = n.entries.filter((v) => v.tag !== 320).sort((v, I) => v.tag - I.tag), s = i.find((v) => v.tag === 262);
  if (!s || s.type !== 3 || s.count !== 1) return r;
  const o = i.findIndex((v) => v.tag > 320), a = { tag: 320, type: t.type, count: t.count, bytes: t.bytes }, c = i.map((v) => ({ ...v, bytes: r.slice(v.valueOffset, v.valueOffset + v.bytesLen) }));
  c.splice(o === -1 ? c.length : o, 0, a);
  const l = e.big ? 8 : 2, f = e.big ? 20 : 12, d = e.big ? 8 : 4, h = r.byteLength, w = l + c.length * f + d, u = h + w;
  let p = 0;
  for (const v of c)
    v.bytes.byteLength <= e.inlineBytes || (p += v.bytes.byteLength + p % 2);
  const m = new Uint8Array(r.byteLength + w + p);
  m.set(r, 0), e.writeFirstIfd(m, h);
  const b = new DataView(m.buffer);
  e.big ? b.setBigUint64(h, BigInt(c.length), !0) : b.setUint16(h, c.length, !0);
  let y = u;
  for (let v = 0; v < c.length; v++) {
    const I = c[v], C = h + l + v * f;
    let W = I.bytes;
    I.tag === 262 && (W = new Uint8Array([3, 0]));
    let U = 0;
    W.byteLength > e.inlineBytes && ((y - u) % 2 && y++, U = y, m.set(W, U), y += W.byteLength), br(m, C, e.big, I.tag, I.type, I.count, W, U);
  }
  const x = h + l + c.length * f;
  return e.big ? b.setBigUint64(x, BigInt(n.nextOffset), !0) : b.setUint32(x, n.nextOffset, !0), m;
}
function xr(r, t, e, n, i) {
  if (i == null) return 0;
  if (!Number.isFinite(i) || i <= 0)
    throw new Error("resolution must be a positive number");
  const s = Math.abs(e[2] - e[0]), o = Math.abs(e[3] - e[1]), a = Math.abs(n[2] - n[0]), c = Math.abs(n[3] - n[1]), l = a > 0 ? s / a : 1, f = c > 0 ? o / c : 1, d = i * l, h = i * f;
  let w = 0, u = 1 / 0;
  for (let p = 0; p < r.length; p++) {
    const m = r[p], b = m.width / r[0].width, y = m.height / r[0].height, x = Math.abs(t[1] / b), v = Math.abs(t[5] / y), I = Math.abs(Math.log(x / d)) + Math.abs(Math.log(v / h));
    I < u && (w = p, u = I);
  }
  return w;
}
function ve(r, t, e) {
  return e == null || e === t ? r.slice() : Array.from(yt(t, e, r));
}
function vr(r, t, e, n, i, s) {
  const o = s ?? Number.NaN, a = new Float64Array(n.width * n.height * e.bands);
  a.fill(o);
  const c = 32;
  for (let l = 0; l < n.height; l += c) {
    const f = Math.min(n.height, l + c), d = new Array((f - l) * n.width * 2);
    let h = 0;
    for (let u = l; u < f; u++) {
      const p = n.y0 + (u + 0.5) * n.pixelHeight;
      for (let m = 0; m < n.width; m++)
        d[h++] = n.x0 + (m + 0.5) * n.pixelWidth, d[h++] = p;
    }
    const w = r.points_to_dataset_crs(i, d);
    h = 0;
    for (let u = l; u < f; u++)
      for (let p = 0; p < n.width; p++) {
        const m = w[h++], b = w[h++];
        if (!Number.isFinite(m) || !Number.isFinite(b)) continue;
        const y = Math.floor((m - e.x0) / e.pixelWidth), x = Math.floor((b - e.y0) / e.pixelHeight);
        if (y < 0 || x < 0 || y >= e.width || x >= e.height) continue;
        const v = (x * e.width + y) * e.bands, I = (u * n.width + p) * e.bands;
        for (let C = 0; C < e.bands; C++) a[I + C] = t[v + C];
      }
  }
  return a;
}
function kr(r) {
  const t = r.bands, e = r.width * r.height, n = new Float64Array(e * t);
  for (let i = 0; i < t; i++) {
    const s = r.read_band_f64(i);
    for (let o = 0; o < e; o++) n[o * t + i] = s[o];
  }
  return n;
}
function ke({ data: r, width: t, height: e, bands: n, sampleFormat: i, bitsPerSample: s, geoTransform: o, epsg: a, nodata: c, palette: l }) {
  const f = new Ot(t, e, n);
  if (f.set_geo_transform(o), f.set_compression("deflate"), a != null && f.set_epsg(a), c != null && f.set_nodata(c), i === "uint" && s === 8) {
    const d = new Uint8Array(r.length), h = c == null ? 0 : Math.max(0, Math.min(255, Math.round(c)));
    for (let u = 0; u < r.length; u++) {
      const p = r[u];
      d[u] = Number.isFinite(p) ? Math.max(0, Math.min(255, Math.round(p))) : h;
    }
    const w = f.write_u8(d);
    return n === 1 && l ? yr(w, l) : w;
  }
  if (i === "ieeefloat" && s === 32)
    return f.write_f32(Float32Array.from(r));
  if (i === "ieeefloat" && s === 64)
    return f.write_f64(r);
  throw new Error(\`preserving source sample type is not yet supported for \${i}/\${s}-bit rasters\`);
}
function Ir(r, t, e, n) {
  const [i, s, o, a, c, l] = r;
  if (Math.abs(o) > 1e-12 || Math.abs(c) > 1e-12)
    throw new Error("rotated/skewed COG geo-transforms are not supported");
  if (!(s > 0) || !(l < 0))
    throw new Error("only north-up COGs with positive pixel width and negative pixel height are supported");
  const f = e.width / t.width, d = e.height / t.height, h = s / f, w = l / d, u = Math.floor((n[0] - i) / h), p = Math.ceil((n[2] - i) / h), m = Math.floor((n[3] - a) / w), b = Math.ceil((n[1] - a) / w), y = Math.max(0, Math.min(e.width, u)), x = Math.max(0, Math.min(e.height, m)), v = Math.max(0, Math.min(e.width, p)), I = Math.max(0, Math.min(e.height, b));
  if (v <= y || I <= x) throw new Error("bbox does not intersect the COG extent");
  return { x: y, y: x, width: v - y, height: I - x, pixelWidth: h, pixelHeight: w };
}
function on(r, t, e, n) {
  const i = r[2] - r[0], s = r[3] - r[1];
  if (!(i > 0) || !(s > 0)) throw new Error("bbox dimensions must be positive");
  if (t != null) {
    if (!(t > 0)) throw new Error("resolution must be positive");
    return {
      width: Math.max(1, Math.ceil(i / t)),
      height: Math.max(1, Math.ceil(s / t))
    };
  }
  if (e != null && n != null) return { width: e, height: n };
  if (e != null) return { width: e, height: Math.max(1, Math.round(e * s / i)) };
  if (n != null) return { width: Math.max(1, Math.round(n * i / s)), height: n };
  const o = 1024;
  return i >= s ? { width: o, height: Math.max(1, Math.round(o * s / i)) } : { width: Math.max(1, Math.round(o * i / s)), height: o };
}
const oe = 20037508342789244e-9;
function Pe(r, t, e) {
  const n = 2 ** e, s = Math.max(-85.05112878, Math.min(85.05112878, t)) * Math.PI / 180;
  return {
    x: Math.floor((r + 180) / 360 * n),
    y: Math.floor((1 - Math.log(Math.tan(s) + 1 / Math.cos(s)) / Math.PI) / 2 * n)
  };
}
function We(r, t, e) {
  const n = 2 ** e, i = oe * 2 / n, s = -oe + r * i, o = oe - t * i;
  return [s, o - i, s + i, o];
}
function Ar(r, t, e, n, i) {
  const s = i ? i[Math.abs(t + e + n) % i.length] : "";
  return r.replaceAll("{x}", String(t)).replaceAll("{y}", String(e)).replaceAll("{z}", String(n)).replaceAll("{s}", s);
}
function Mr(r, t) {
  if (typeof OffscreenCanvas < "u") return new OffscreenCanvas(r, t);
  if (typeof document < "u" && document.createElement) {
    const e = document.createElement("canvas");
    return e.width = r, e.height = t, e;
  }
  throw new Error("extract_xyz_tile_subset requires browser image decoding support");
}
async function Er(r) {
  if (typeof createImageBitmap > "u" || typeof Blob > "u")
    throw new Error("extract_xyz_tile_subset requires createImageBitmap support to decode PNG/JPEG tiles");
  const t = await createImageBitmap(new Blob([r])), n = Mr(t.width, t.height).getContext("2d", { willReadFrequently: !0 });
  n.drawImage(t, 0, 0);
  const i = n.getImageData(0, 0, t.width, t.height);
  return t.close && t.close(), { width: i.width, height: i.height, data: i.data };
}
async function Sr(r, t) {
  const e = await fetch(r, t);
  if (!e.ok) throw new Error(\`tile request failed (\${e.status}): \${r}\`);
  return Er(new Uint8Array(await e.arrayBuffer()));
}
function Nr(r, t) {
  const e = new URL(r), n = t.version || "1.1.1", i = n.startsWith("1.3") ? "CRS" : "SRS", s = {
    SERVICE: "WMS",
    VERSION: n,
    REQUEST: "GetMap",
    LAYERS: t.layers,
    STYLES: t.styles ?? "",
    FORMAT: t.format,
    TRANSPARENT: "FALSE",
    WIDTH: String(t.width),
    HEIGHT: String(t.height),
    BBOX: t.bbox.join(","),
    [i]: \`EPSG:\${t.crs}\`
  };
  for (const [o, a] of Object.entries(s)) e.searchParams.set(o, a);
  return e.toString();
}
async function Tr(r, t) {
  t = t || {}, await qt();
  const { layers: e, styles: n, bbox: i, bboxCrs: s, resolution: o, width: a, height: c, nodata: l } = t, f = t.outputCrs ?? s, d = t.format || "image/geotiff", h = t.version || "1.1.1";
  if (!/^https?:\\/\\//i.test(r)) throw new Error(\`url must be HTTP(S), got: \${r}\`);
  if (!e || String(e).trim() === "") throw new Error("opts.layers is required");
  if (!/tiff|geotiff|geotif/i.test(d))
    throw new Error("extract_wms_subset requires a GeoTIFF WMS format such as image/geotiff or image/tiff");
  if (!Array.isArray(i) || i.length !== 4 || i.some((C) => !Number.isFinite(C)) || i[0] >= i[2] || i[1] >= i[3])
    throw new Error("opts.bbox must be finite and ordered [minX,minY,maxX,maxY]");
  if (!Number.isInteger(s) || s <= 0) throw new Error("opts.bboxCrs must be a positive EPSG code");
  if (!Number.isInteger(f) || f <= 0) throw new Error("opts.outputCrs must be a positive EPSG code");
  if (l != null && !Number.isFinite(l)) throw new Error("opts.nodata must be a finite number");
  const w = ve(i, s, f), u = on(w, o, a, c), p = Nr(r, {
    layers: String(e),
    styles: n == null ? "" : String(n),
    bbox: w,
    crs: f,
    width: u.width,
    height: u.height,
    format: d,
    version: h
  }), m = await fetch(p, t.fetchOptions), b = new Uint8Array(await m.arrayBuffer()), y = m.headers.get("content-type") || "";
  if (!m.ok) throw new Error(\`WMS GetMap failed (\${m.status}): \${new TextDecoder().decode(b.slice(0, 512))}\`);
  if (/xml|text/i.test(y))
    throw new Error(\`WMS returned an exception instead of GeoTIFF: \${new TextDecoder().decode(b.slice(0, 1024))}\`);
  const x = new Lt(b), v = kr(x), I = sn(b);
  return ke({
    data: v,
    width: x.width,
    height: x.height,
    bands: x.bands,
    sampleFormat: x.sample_format,
    bitsPerSample: x.bits_per_sample,
    geoTransform: [w[0], (w[2] - w[0]) / x.width, 0, w[3], 0, -(w[3] - w[1]) / x.height],
    epsg: f,
    nodata: l ?? x.nodata,
    palette: I
  });
}
async function Ur(r, t) {
  t = t || {}, await qt();
  const { zoom: e, bbox: n, bboxCrs: i, resolution: s, width: o, height: a, nodata: c, subdomains: l } = t, f = t.outputCrs ?? i, d = t.tileSize ?? 256;
  if (!/^https?:\\/\\//i.test(r)) throw new Error(\`url must be HTTP(S), got: \${r}\`);
  if (!Number.isInteger(e) || e < 0 || e > 30) throw new Error("opts.zoom must be an integer 0-30");
  if (!Number.isInteger(d) || d <= 0) throw new Error("opts.tileSize must be a positive integer");
  if (!Array.isArray(n) || n.length !== 4 || n.some((N) => !Number.isFinite(N)) || n[0] >= n[2] || n[1] >= n[3])
    throw new Error("opts.bbox must be finite and ordered [minX,minY,maxX,maxY]");
  if (!Number.isInteger(i) || i <= 0) throw new Error("opts.bboxCrs must be a positive EPSG code");
  if (!Number.isInteger(f) || f <= 0) throw new Error("opts.outputCrs must be a positive EPSG code");
  if (c != null && !Number.isFinite(c)) throw new Error("opts.nodata must be a finite number");
  const h = i === 4326 ? n : Array.from(yt(i, 4326, n)), w = 2 ** e, u = Pe(h[0], h[3], e), p = Pe(h[2], h[1], e), m = Math.max(0, Math.min(w - 1, u.x)), b = Math.max(0, Math.min(w - 1, p.x)), y = Math.max(0, Math.min(w - 1, u.y)), x = Math.max(0, Math.min(w - 1, p.y));
  if (b < m || x < y) throw new Error("bbox does not intersect the XYZ tile grid");
  const v = b - m + 1, I = x - y + 1;
  if (v * I > 512) throw new Error(\`bbox intersects too many tiles at zoom \${e}: \${v * I}\`);
  const C = v * d, W = I * d, U = c == null ? 0 : Math.max(0, Math.min(255, Math.round(c))), R = new Uint8Array(C * W * 4);
  for (let N = 0; N < R.length; N += 4)
    R[N] = U, R[N + 1] = U, R[N + 2] = U, R[N + 3] = 0;
  for (let N = y; N <= x; N++)
    for (let q = m; q <= b; q++) {
      const rt = Ar(r, q, N, e, l), O = await Sr(rt, t.fetchOptions), Q = Math.min(d, O.width), Y = Math.min(d, O.height), tt = (q - m) * d, $ = (N - y) * d;
      for (let mt = 0; mt < Y; mt++)
        for (let it = 0; it < Q; it++) {
          const st = (mt * O.width + it) * 4, j = (($ + mt) * C + tt + it) * 4;
          R[j] = O.data[st], R[j + 1] = O.data[st + 1], R[j + 2] = O.data[st + 2], R[j + 3] = O.data[st + 3];
        }
    }
  const J = We(m, x, e), A = We(b, y, e), K = [J[0], J[1], A[2], A[3]], pt = (K[2] - K[0]) / C, zt = -(K[3] - K[1]) / W, L = ve(n, i, f), z = f === 3857 ? Math.abs(pt) : Math.max((L[2] - L[0]) / Math.max(1, Math.round((yt(f, 3857, L)[2] - yt(f, 3857, L)[0]) / Math.abs(pt))), 1e-12), B = on(L, s ?? z, o, a), D = new Float64Array(B.width * B.height * 3), Z = (L[2] - L[0]) / B.width, wt = -(L[3] - L[1]) / B.height, jt = 32;
  for (let N = 0; N < B.height; N += jt) {
    const q = Math.min(B.height, N + jt), rt = new Array((q - N) * B.width * 2);
    let O = 0;
    for (let Y = N; Y < q; Y++) {
      const tt = L[3] + (Y + 0.5) * wt;
      for (let $ = 0; $ < B.width; $++)
        rt[O++] = L[0] + ($ + 0.5) * Z, rt[O++] = tt;
    }
    const Q = f === 3857 ? rt : Array.from(he(f, 3857, rt));
    O = 0;
    for (let Y = N; Y < q; Y++)
      for (let tt = 0; tt < B.width; tt++) {
        const $ = Q[O++], mt = Q[O++], it = Math.floor(($ - K[0]) / pt), st = Math.floor((mt - K[3]) / zt), j = (Y * B.width + tt) * 3;
        if (it < 0 || st < 0 || it >= C || st >= W) {
          D[j] = U, D[j + 1] = U, D[j + 2] = U;
          continue;
        }
        const $t = (st * C + it) * 4;
        R[$t + 3] === 0 ? (D[j] = U, D[j + 1] = U, D[j + 2] = U) : (D[j] = R[$t], D[j + 1] = R[$t + 1], D[j + 2] = R[$t + 2]);
      }
  }
  return ke({
    data: D,
    width: B.width,
    height: B.height,
    bands: 3,
    sampleFormat: "uint",
    bitsPerSample: 8,
    geoTransform: [L[0], Z, 0, L[3], 0, wt],
    epsg: f,
    nodata: c
  });
}
async function Fr(r, t) {
  t = t || {}, await qt();
  const { bbox: e, bboxCrs: n, resolution: i, nodata: s } = t || {};
  let { level: o, outputCrs: a } = t || {};
  if (!Array.isArray(e) || e.length !== 4)
    throw new Error("opts.bbox must be [minX,minY,maxX,maxY]");
  if (e.some((z) => !Number.isFinite(z)) || e[0] >= e[2] || e[1] >= e[3])
    throw new Error("opts.bbox must be finite and ordered min < max");
  if (!Number.isInteger(n) || n <= 0)
    throw new Error("opts.bboxCrs must be a positive EPSG code");
  if (o != null && (!Number.isInteger(o) || o < 0))
    throw new Error("opts.level must be a non-negative integer");
  if (a != null && (!Number.isInteger(a) || a <= 0))
    throw new Error("opts.outputCrs must be a positive EPSG code");
  if (s != null && !Number.isFinite(s))
    throw new Error("opts.nodata must be a finite number");
  const c = en(r, t.fetchOptions), { stream: l, header: f } = await gr(c, t || {}), d = hr(l), h = sn(f);
  a == null && l.has_projection_string && (a = n);
  const w = Array.from(l.bbox_to_dataset_crs(n, e)), u = ve(e, n, a), p = Array.from(l.geo_transform());
  if (p.length !== 6) throw new Error("COG has no affine geo-transform");
  o == null && (o = xr(d, p, w, u, i));
  const m = d[o];
  if (!m) throw new Error(\`level \${o} out of range\`);
  const b = Ir(p, d[0], m, w), y = JSON.parse(l.tiles_for_window(o, b.x, b.y, b.width, b.height)), x = new Float64Array(b.width * b.height * m.bands), v = m.tile_width * m.tile_height * m.bands;
  for (const z of y) {
    const B = await c.range(z.offset, z.length), D = l.decode_tile_f64(o, B);
    if (D.length !== v)
      throw new Error(\`decoded tile size mismatch for tile \${z.col},\${z.row}\`);
    const Z = z.col * m.tile_width, wt = z.row * m.tile_height, jt = Math.max(b.x, Z), N = Math.max(b.y, wt), q = Math.min(b.x + b.width, Z + m.tile_width, m.width), rt = Math.min(b.y + b.height, wt + m.tile_height, m.height);
    for (let O = N; O < rt; O++)
      for (let Q = jt; Q < q; Q++) {
        const Y = ((O - wt) * m.tile_width + (Q - Z)) * m.bands, tt = ((O - b.y) * b.width + (Q - b.x)) * m.bands;
        for (let $ = 0; $ < m.bands; $++)
          x[tt + $] = D[Y + $];
      }
  }
  const I = p[0] + b.x * b.pixelWidth, C = p[3] + b.y * b.pixelHeight;
  let W = x, U = b.width, R = b.height, J = I, A = C, K = b.pixelWidth, pt = b.pixelHeight, zt = l.has_projection_string ? void 0 : l.epsg;
  const L = s ?? l.nodata;
  if (a != null) {
    const z = i == null ? b.width : Math.max(1, Math.ceil((u[2] - u[0]) / i)), B = i == null ? b.height : Math.max(1, Math.ceil((u[3] - u[1]) / i)), D = (u[2] - u[0]) / z, Z = -(u[3] - u[1]) / B;
    W = vr(
      l,
      x,
      { x0: I, y0: C, pixelWidth: b.pixelWidth, pixelHeight: b.pixelHeight, width: b.width, height: b.height, bands: m.bands },
      { x0: u[0], y0: u[3], pixelWidth: D, pixelHeight: Z, width: z, height: B },
      a,
      L
    ), U = z, R = B, J = u[0], A = u[3], K = D, pt = Z, zt = a;
  }
  return ke({
    data: W,
    width: U,
    height: R,
    bands: m.bands,
    sampleFormat: m.sample_format,
    bitsPerSample: m.bits_per_sample,
    geoTransform: [J, K, 0, A, 0, pt],
    epsg: zt,
    nodata: L,
    palette: h
  });
}
const Cr = "1.4.0", an = \`https://cdn.jsdelivr.net/npm/geolibre-wasm@\${Cr}/\`, Rr = "geolibre_wasm_bg.wasm", Br = "geolibre-cli.wasm";
function ze(r) {
  try {
    const t = new URL(r, import.meta.url);
    if (t.protocol === "http:" || t.protocol === "https:")
      return t.href;
  } catch {
  }
  return \`\${an}\${r}\`;
}
function Or() {
  return { bindgen: ze(Rr), cli: ze(Br) };
}
let ae = null;
function cn(r = Or()) {
  return ae ??= (async () => {
    try {
      await qe({ module_or_path: r.bindgen }), await tn(r.cli);
    } catch (t) {
      ae = null;
      const e = Lr(r.bindgen);
      throw new Error(
        \`Could not load the GeoLibre WASM toolkit from \${e}. Install SCIMAP as an unpacked plugin directory for offline use, or allow access to \${an}. Cause: \` + (t instanceof Error ? t.message : String(t))
      );
    }
  })(), ae;
}
function Lr(r) {
  try {
    return new URL(r).origin;
  } catch {
    return r;
  }
}
const Dr = [
  [1, "Woodland"],
  [2, "Arable"],
  [3, "Improved Grassland"],
  [4, "Extensive Grassland"],
  [5, "Moorland"],
  [6, "Urban"],
  [7, "Other"]
];
new Map(Dr);
const ln = 7, Pr = /* @__PURE__ */ new Map([
  [1, 1],
  //  Broadleaved woodland -> Woodland
  [2, 1],
  //  Coniferous woodland -> Woodland
  [3, 2],
  //  Arable and horticulture -> Arable
  [4, 3],
  //  Improved grassland -> Improved Grassland
  [5, 4],
  //  Rough grassland -> Extensive Grassland
  [6, 4],
  //  Neutral grassland -> Extensive Grassland
  [7, 4],
  //  Calcareous grassland -> Extensive Grassland
  [8, 4],
  //  Acid grassland -> Extensive Grassland
  [9, 5],
  //  Fen, marsh, swamp -> Moorland
  [10, 5],
  // Heather -> Moorland
  [11, 5],
  // Heather grassland -> Moorland
  [12, 5],
  // Bog -> Moorland
  [13, 5],
  // Montane habitats -> Moorland
  [14, 7],
  // Inland rock -> Other
  [15, 7],
  // Saltwater -> Other
  [16, 7],
  // Freshwater -> Other
  [17, 7],
  // Supra-littoral rock -> Other
  [18, 7],
  // Supra-littoral sediment -> Other
  [19, 7],
  // Littoral rock -> Other
  [20, 7],
  // Littoral sediment -> Other
  [21, 7],
  // Saltmarsh -> Other
  [22, 6],
  // Urban -> Urban
  [23, 6]
  // Suburban -> Urban
]), Wr = /* @__PURE__ */ new Map([
  [1, 0.2],
  //  Woodland
  [2, 1],
  //  Arable
  [3, 0.3],
  //  Improved Grassland
  [4, 0.15],
  // Extensive Grassland
  [5, 0.3],
  //  Moorland
  [6, 0.5],
  //  Urban
  [7, 0.5]
  //  Other
]), zr = "magma", _n = "viridis", jr = "viridis", fn = 2;
function $r(r) {
  return Math.abs(r.geoTransform[1] * r.geoTransform[5]);
}
function un(r, t) {
  const e = [];
  for (let i = 0; i < r.length; i++) {
    const s = r[i];
    Number.isFinite(s) && e.push(s);
  }
  if (e.length === 0) return t.map(() => NaN);
  e.sort((i, s) => i - s);
  const n = e.length - 1;
  return t.map((i) => {
    const s = i / 100 * n, o = Math.floor(s), a = Math.ceil(s);
    return o === a ? e[o] : e[o] + (e[a] - e[o]) * (s - o);
  });
}
function Gr(r, t) {
  let e = 0, n = 0;
  for (let i = 0; i < r.length; i++) {
    if (t && !t[i]) continue;
    const s = r[i];
    Number.isFinite(s) && (e += s, n += 1);
  }
  return n === 0 ? NaN : e / n;
}
function dt(r, t) {
  for (let e = 0; e < r.length; e++)
    t[e] || (r[e] = NaN);
  return r;
}
function Vr(r, t) {
  if (t === void 0 || !Number.isFinite(t)) return r;
  for (let e = 0; e < r.length; e++)
    r[e] === t && (r[e] = NaN);
  return r;
}
function Yr(r, t) {
  const e = new Uint8Array(r.length), n = t !== void 0 && Number.isFinite(t);
  for (let i = 0; i < r.length; i++) {
    const s = r[i];
    e[i] = Number.isFinite(s) && !(n && s === t) ? 1 : 0;
  }
  return e;
}
function Hr(r, t) {
  let e = Gr(r, t);
  (e === 0 || !Number.isFinite(e)) && (e = 1);
  const n = new Float64Array(r.length);
  for (let i = 0; i < r.length; i++) n[i] = r[i] / e;
  return n;
}
function Xr(r) {
  const {
    erosionRisk: t,
    connectivity: e,
    accum: n,
    mask: i,
    cellArea: s,
    rainfallScaled: o,
    streamCellThreshold: a,
    rainfallWeightedArea: c,
    scimapRoutedAccum: l
  } = r, f = t.length, d = 1e-10, h = new Float64Array(f).fill(NaN);
  for (let u = 0; u < f; u++) {
    if (!(i[u] === 1)) continue;
    const m = n[u], b = Math.abs(m) * s, y = c ? c[u] : b * o[u], x = t[u] * e[u], v = l ? l[u] : x * b;
    h[u] = v / (y + d);
  }
  const w = new Float64Array(f);
  for (let u = 0; u < f; u++) {
    const p = i[u] === 1, m = p ? n[u] : NaN;
    w[u] = p && Math.abs(m) >= a ? h[u] : NaN;
  }
  return { riskConcentration: h, channelRiskConcentration: w };
}
function qr(r, t, e, n = !0) {
  const i = r.length, s = new Float64Array(i);
  if (!n) {
    for (let a = 0; a < i; a++) {
      const c = Math.abs(r[a]) * e;
      s[a] = Number.isFinite(c) ? c : NaN;
    }
    return s;
  }
  const o = Math.PI / 180;
  for (let a = 0; a < i; a++) {
    const c = Math.min(Math.max(t[a], 0), 89), l = Math.abs(r[a]) * e * Math.tan(c * o);
    s[a] = Number.isFinite(l) ? l : NaN;
  }
  return s;
}
function dn(r, t = 5, e = 95) {
  const n = r.length, i = new Float64Array(n), [s, o] = un(r, [t, e]);
  if (!Number.isFinite(s))
    return i.fill(NaN), i;
  const c = (o <= s ? s + 1 : o) - s;
  for (let l = 0; l < n; l++) {
    const f = r[l];
    if (!Number.isFinite(f)) {
      i[l] = NaN;
      continue;
    }
    i[l] = Math.min(Math.max((f - s) / c, 0), 1);
  }
  return i;
}
const Jr = [
  [1, 1, 0],
  //   E
  [2, 1, -1],
  //  NE
  [4, 0, -1],
  //  N
  [8, -1, -1],
  // NW
  [16, -1, 0],
  // W
  [32, -1, 1],
  // SW
  [64, 0, 1],
  //  S
  [128, 1, 1]
  // SE
];
function gn(r, t, e, n) {
  const i = e * n, s = new Int32Array(i).fill(-1), o = new Int8Array(129), a = new Int8Array(129), c = new Uint8Array(129);
  for (const [l, f, d] of Jr)
    o[l] = f, a[l] = d, c[l] = 1;
  for (let l = 0; l < i; l++) {
    const f = r[l];
    if (!Number.isInteger(f) || f < 0 || f > 128 || !c[f]) continue;
    const d = (l / e | 0) + a[f], h = l % e + o[f];
    if (d < 0 || d >= n || h < 0 || h >= e) continue;
    const w = d * e + h;
    t[w] && (s[l] = w);
  }
  return s;
}
function hn(r, t, e, n) {
  const i = e * n, s = new Int32Array(i).fill(-1), o = Math.SQRT2, a = [
    [-1, 0, 1],
    [-1, 1, o],
    [0, 1, 1],
    [1, 1, o],
    [1, 0, 1],
    [1, -1, o],
    [0, -1, 1],
    [-1, -1, o]
  ];
  for (let c = 0; c < i; c++) {
    if (!t[c]) continue;
    const l = c / e | 0, f = c % e, d = r[c];
    let h = 0, w = -1;
    for (const [u, p, m] of a) {
      const b = l + u, y = f + p;
      if (b < 0 || b >= n || y < 0 || y >= e) continue;
      const x = b * e + y;
      if (!t[x]) continue;
      const v = (d - r[x]) / m;
      v > h && (h = v, w = x);
    }
    s[c] = w;
  }
  return s;
}
function Kr(r, t, e, n, i) {
  const s = t.length;
  let o = new Float64Array(s).fill(NaN), a = new Int32Array(s).fill(-1), c = new Uint8Array(s);
  for (let d = 0; d < s; d++) {
    if (!e[d]) continue;
    let h = t[d];
    const w = r[d];
    if (w < 0)
      o[d] = h, c[d] = 1;
    else if (n[w]) {
      const u = t[w];
      Number.isFinite(u) && u < h && (h = u), o[d] = h, c[d] = 1;
    } else
      o[d] = h, a[d] = w, c[d] = 0;
  }
  const l = Math.max(1, Math.ceil(Math.log2(Math.max(s, 2))) + 2);
  for (let d = 0; d < l; d++) {
    let h = !1;
    for (let m = 0; m < s; m++)
      if (e[m] && !c[m]) {
        h = !0;
        break;
      }
    if (!h) break;
    const w = o.slice(), u = a.slice(), p = c.slice();
    for (let m = 0; m < s; m++) {
      if (c[m]) continue;
      const b = a[m];
      if (b < 0) {
        p[m] = 1;
        continue;
      }
      let y = o[m];
      const x = o[b];
      Number.isFinite(x) && x < y && (y = x), w[m] = y, u[m] = a[b], p[m] = c[b];
    }
    if (o = w, a = u, c = p, i) {
      const m = (d + 1) / l, b = Math.min(54, 51 + Math.round(m * 3));
      i(
        b,
        \`5.3 Tracing flow paths to channel network... round \${d + 1}/\${l}\`
      );
    }
  }
  i?.(54, "5.3 Tracing flow paths to channel network... 100%");
  const f = new Float64Array(s);
  for (let d = 0; d < s; d++) f[d] = e[d] ? o[d] : NaN;
  return f;
}
function Zr(r, t, e) {
  const n = t.length, i = new Float64Array(n).fill(NaN), s = Math.PI / 180;
  for (let o = 0; o < n; o++) {
    const a = t[o], c = r[o], l = e[o];
    if (!Number.isFinite(a) || !Number.isFinite(c) || !Number.isFinite(l)) continue;
    const f = Math.min(Math.max(a, 0), 89) * s, d = Math.abs(c) * Math.max(l, 1e-6) + 1, h = Math.tan(f + 1e-3) + 1e-3;
    d <= 0 || h <= 0 || (i[o] = Math.log(d) - Math.log(h));
  }
  return i;
}
function Qr(r, t, e) {
  const { width: n, height: i, mask: s, channelMask: o, dem: a, onProgress: c } = e, l = t.length;
  c?.(46, "5.1 Preparing connectivity mask...");
  const f = new Uint8Array(l);
  for (let p = 0; p < l; p++)
    f[p] = Number.isFinite(t[p]) && (!s || s[p] === 1) ? 1 : 0;
  const d = new Uint8Array(l);
  if (o)
    for (let p = 0; p < l; p++) d[p] = o[p] && f[p] ? 1 : 0;
  c?.(48, "5.2 Building downstream flow index...");
  const h = a ? hn(a, f, n, i) : gn(r, f, n, i);
  c?.(51, "5.3 Tracing flow paths to channel network... 0%");
  const w = Kr(h, t, f, d, c);
  c?.(55, "5.4 Normalising connectivity scores...");
  const u = [];
  for (let p = 0; p < l; p++) f[p] && u.push(w[p]);
  if (u.length > 0) {
    const [p, m] = un(u, [5, 95]);
    if (Number.isFinite(p)) {
      const y = (m <= p ? p + 1 : m) - p;
      for (let x = 0; x < l; x++)
        w[x] = f[x] ? Math.min(Math.max((w[x] - p) / y, 0), 1) : NaN;
    }
  }
  return c?.(57, "5.5 Connectivity computation complete."), w;
}
function ti(r, t, e) {
  const { width: n, height: i, mask: s, channelMask: o, dem: a, onProgress: c } = e, l = t.length;
  c?.(46, "5.1 Preparing PDSL inputs...");
  const f = new Uint8Array(l);
  for (let u = 0; u < l; u++)
    f[u] = Number.isFinite(t[u]) && (!s || s[u] === 1) ? 1 : 0;
  const d = dn(t, 5, 95);
  c?.(48, "5.2 Building downstream flow index...");
  const h = a ? hn(a, f, n, i) : gn(r, f, n, i);
  if (o)
    for (let u = 0; u < l; u++)
      o[u] && f[u] && (h[u] = -1);
  c?.(51, "5.3 Tracing downslope saturated length... 0%");
  const w = new Float64Array(l).fill(NaN);
  for (let u = 0; u < l; u++) {
    if (!f[u]) continue;
    const p = d[u];
    let m = u, b = u, y = 0, x = 0;
    for (; ; ) {
      const v = h[m];
      if (v < 0) break;
      const I = d[v];
      if (Number.isFinite(I) && I >= p && x++, m = v, y++, b = h[b], !(b < 0) && (b = h[b], b >= 0 && m === b || y >= l))
        break;
    }
    w[u] = y === 0 ? 1 : x / y;
  }
  return c?.(57, "5.5 PDSL computation complete."), w;
}
function pn(r, t, e, n, i, s = "flow_path_trace") {
  i.onProgress?.(46, "5.1 Preparing TWI inputs for connectivity...");
  const o = Zr(t, e, n);
  return i.onProgress?.(48, "5.2 TWI prepared; running connectivity solver..."), s === "pdsl" ? ti(r, o, i) : Qr(r, o, i);
}
const ei = {
  breachDepressions: {
    id: "breach_depressions_least_cost",
    params: ["dem", "output", "max_dist", "fill_deps"]
  },
  fillDepressions: {
    id: "fill_depressions",
    params: ["dem", "output", "fix_flats"]
  },
  slope: {
    id: "slope",
    // Note: \`input\`, not \`dem\` as the native WhiteboxTools binary uses.
    params: ["input", "output", "units"]
  },
  fd8FlowAccum: {
    id: "fd8_flow_accum",
    params: ["dem", "output", "out_type", "exponent"]
  },
  d8FlowAccum: {
    id: "d8_flow_accum",
    // Note: \`input\`, not \`dem\` as the native WhiteboxTools binary uses.
    params: ["input", "output", "out_type"]
  },
  d8Pointer: {
    id: "d8_pointer",
    params: ["dem", "output", "esri_pntr"]
  },
  extractStreams: {
    id: "extract_streams",
    // Note: \`flow_accumulation\`, not \`flow_accum\`.
    params: ["flow_accumulation", "output", "threshold"]
  },
  rasterStreamsToVector: {
    id: "raster_streams_to_vector",
    // Note: \`streams_raster\`, not \`streams\`.
    params: ["streams_raster", "d8_pntr", "output", "esri_pntr"]
  },
  dinfMassFlux: {
    id: "dinf_mass_flux",
    params: ["dem", "loading", "efficiency", "absorption", "output"]
  },
  resample: {
    id: "resample",
    params: ["inputs", "base", "method", "output"]
  }
};
class ni extends Error {
  constructor(t, e, n) {
    const i = n.slice(-8).join(\`
\`);
    super(\`\${t} failed (exit \${e})\${i ? \`:
\${i}\` : ""}\`), this.tool = t, this.exitCode = e, this.stdout = n, this.name = "ToolError";
  }
}
async function H(r, t, e = {}) {
  const { id: n } = ei[r], i = [];
  for (const [o, a] of Object.entries(t))
    a !== void 0 && i.push(\`--\${o}=\${a}\`);
  const s = await ir(n, { args: i, input: e });
  if (s.exitCode !== 0)
    throw new ni(n, s.exitCode, s.stdout);
  return s.files;
}
function X(r, t, e) {
  const n = r[t];
  if (!n) {
    const i = Object.keys(r).join(", ") || "nothing";
    throw new Error(\`\${e} did not write \${t} (produced: \${i})\`);
  }
  return n;
}
const Ie = cn;
async function et(r) {
  await Ie();
  const t = new Lt(r);
  try {
    const e = t.read_band_f64(0), n = t.value_transform();
    if (n.length === 2 && (n[0] !== 1 || n[1] !== 0)) {
      const [o, a] = n;
      for (let c = 0; c < e.length; c++) e[c] = e[c] * o + a;
    }
    const i = t.nodata;
    Vr(e, i);
    const s = t.geo_transform();
    return {
      width: t.width,
      height: t.height,
      geoTransform: s.length === 6 ? s : new Float64Array([0, 1, 0, 0, 0, -1]),
      epsg: t.epsg,
      nodata: i,
      data: e
    };
  } finally {
    t.free();
  }
}
async function Ae(r) {
  await Ie();
  const t = new Lt(r);
  try {
    const e = t.geo_transform();
    return {
      width: t.width,
      height: t.height,
      geoTransform: e.length === 6 ? e : new Float64Array([0, 1, 0, 0, 0, -1]),
      epsg: t.epsg
    };
  } finally {
    t.free();
  }
}
function ri(r, t) {
  if (r.width !== t.width || r.height !== t.height || r.epsg !== void 0 && t.epsg !== void 0 && r.epsg !== t.epsg) return !1;
  for (let e = 0; e < 6; e++)
    if (Math.abs(r.geoTransform[e] - t.geoTransform[e]) > 1e-6) return !1;
  return !0;
}
async function je(r, t, e, n) {
  const i = await Ae(r);
  if (ri(i, e)) return r;
  const s = await H(
    "resample",
    {
      inputs: "/work/align_src.tif",
      base: "/work/align_base.tif",
      method: n,
      output: "/work/aligned.tif"
    },
    { "align_src.tif": r, "align_base.tif": t }
  );
  return X(s, "aligned.tif", "resample");
}
function kt(r, { ref: t, nodata: e = -9999, compression: n = "deflate" }) {
  const i = new Float32Array(r.length);
  for (let o = 0; o < r.length; o++)
    i[o] = Number.isFinite(r[o]) ? r[o] : e;
  const s = new Ot(t.width, t.height, 1);
  try {
    return s.set_compression(n), s.set_geo_transform(t.geoTransform), s.set_nodata(e), t.epsg !== void 0 && s.set_epsg(t.epsg), s.set_overview_levels(new Uint32Array([2, 4, 8])), s.write_f32(i);
  } finally {
    s.free();
  }
}
function ii(r, t) {
  const e = new Uint8Array(r.length);
  for (let i = 0; i < r.length; i++)
    e[i] = Number.isFinite(r[i]) ? Math.max(0, Math.min(255, Math.round(r[i]))) : 0;
  const n = new Ot(t.width, t.height, 1);
  try {
    return n.set_compression("deflate"), n.set_geo_transform(t.geoTransform), n.set_nodata(0), t.epsg !== void 0 && n.set_epsg(t.epsg), n.write_u8(e);
  } finally {
    n.free();
  }
}
function si(r, t, e, n) {
  const i = t.geoTransform, s = Math.floor((e - i[0]) / i[1]), o = Math.floor((n - i[3]) / i[5]);
  return s < 0 || s >= t.width || o < 0 || o >= t.height ? NaN : r[o * t.width + s];
}
async function wn(r) {
  const {
    demBytes: t,
    streamThreshold: e,
    depressionMethod: n = "breach",
    onProgress: i
  } = r;
  i?.(1, "1. Removing DEM depressions...");
  const s = n === "fill" ? X(
    await H(
      "fillDepressions",
      { dem: "/work/dem.tif", output: "/work/dem_fill.tif", fix_flats: !0 },
      { "dem.tif": t }
    ),
    "dem_fill.tif",
    "fill_depressions"
  ) : X(
    await H(
      "breachDepressions",
      { dem: "/work/dem.tif", output: "/work/dem_fill.tif", fill_deps: !0 },
      { "dem.tif": t }
    ),
    "dem_fill.tif",
    "breach_depressions_least_cost"
  );
  i?.(10, "2. Calculating Slope, FD8 Flow Accumulation, and D8 Pointer...");
  const o = X(
    await H(
      "slope",
      { input: "/work/dem_fill.tif", output: "/work/slope.tif", units: "degrees" },
      { "dem_fill.tif": s }
    ),
    "slope.tif",
    "slope"
  ), a = X(
    await H(
      "fd8FlowAccum",
      {
        dem: "/work/dem_fill.tif",
        output: "/work/accum.tif",
        out_type: "cells",
        exponent: fn
      },
      { "dem_fill.tif": s }
    ),
    "accum.tif",
    "fd8_flow_accum"
  );
  i?.(16, "2. Deriving D8 pointer and stream network...");
  const c = X(
    await H(
      "d8Pointer",
      { dem: "/work/dem_fill.tif", output: "/work/d8.tif", esri_pntr: !1 },
      { "dem_fill.tif": s }
    ),
    "d8.tif",
    "d8_pointer"
  ), l = X(
    await H(
      "extractStreams",
      {
        flow_accumulation: "/work/accum.tif",
        output: "/work/stream.tif",
        threshold: e,
        zero_background: !0
      },
      { "accum.tif": a }
    ),
    "stream.tif",
    "extract_streams"
  ), f = X(
    await H(
      "d8FlowAccum",
      {
        input: "/work/dem_fill.tif",
        output: "/work/d8_accum.tif",
        out_type: "cells"
      },
      { "dem_fill.tif": s }
    ),
    "d8_accum.tif",
    "d8_flow_accum"
  ), d = X(
    await H(
      "extractStreams",
      {
        flow_accumulation: "/work/d8_accum.tif",
        output: "/work/stream_vector.tif",
        threshold: e,
        zero_background: !0
      },
      { "d8_accum.tif": f }
    ),
    "stream_vector.tif",
    "extract_streams"
  );
  i?.(22, "3. Loading arrays to process SCIMAP logic...");
  const h = await et(o), w = await et(a), u = await et(c), p = await et(l), m = await et(s), b = await et(t), y = {
    width: h.width,
    height: h.height,
    geoTransform: h.geoTransform,
    // Slope inherits the DEM's CRS, but fall back to the DEM's own EPSG if the
    // tool dropped it so outputs stay georeferenced.
    epsg: h.epsg ?? b.epsg
  }, x = Yr(b.data, b.nodata), v = new Uint8Array(x.length);
  for (let I = 0; I < v.length; I++)
    v[I] = p.data[I] > 0 && x[I] ? 1 : 0;
  return {
    ref: y,
    cellArea: $r(y),
    demFilled: m.data,
    slope: h.data,
    accum: w.data,
    d8: u.data,
    mask: x,
    channelMask: v,
    files: {
      demFilled: s,
      d8: c,
      streams: l,
      streamVector: d
    }
  };
}
function oi(r, t) {
  if (t.size === 0) return r;
  const e = r.slice();
  for (let n = 0; n < r.length; n++) {
    const i = t.get(r[n]);
    i !== void 0 && (e[n] = i);
  }
  return e;
}
function ai(r, t) {
  const e = new Float64Array(r.length).fill(NaN);
  for (let n = 0; n < r.length; n++) {
    const i = t.get(r[n]);
    i !== void 0 && (e[n] = i);
  }
  return e;
}
function ci(r, t) {
  const e = /* @__PURE__ */ new Set();
  for (let n = 0; n < r.length; n++) {
    const i = r[n];
    if (!Number.isFinite(i) || i <= 0) continue;
    const s = Math.trunc(i);
    t.has(s) || e.add(s);
  }
  return [...e].sort((n, i) => n - i);
}
function li(r, t) {
  const { weights: e, remap: n, alreadyScimap: i = !0, fallbackClass: s = ln } = t, o = i ? r : oi(r, n ?? /* @__PURE__ */ new Map()), a = ci(o, e), c = ai(o, e);
  let l = 0;
  const f = e.get(Math.trunc(s));
  if (f !== void 0)
    for (let d = 0; d < c.length; d++) {
      const h = o[d];
      Number.isNaN(c[d]) && Number.isFinite(h) && h > 0 && (c[d] = f, l += 1);
    }
  return { riskWeight: c, scimapClasses: o, unmapped: a, fallbackCells: l };
}
function _i(r, t, e) {
  const n = t.geoTransform, i = [], s = [];
  for (let o = 0; o < t.height; o++)
    for (let a = 0; a < t.width; a++) {
      const c = r[o * t.width + a];
      if (!Number.isFinite(c)) continue;
      const l = n[0] + (a + 0.5) * n[1] + (o + 0.5) * n[2], f = n[3] + (a + 0.5) * n[4] + (o + 0.5) * n[5];
      s.push(l, f), i.push({
        type: "Feature",
        geometry: { type: "Point", coordinates: [l, f] },
        properties: { [e]: c }
      });
    }
  if (t.epsg !== void 0 && t.epsg !== 4326 && s.length > 0) {
    const o = he(t.epsg, 4326, new Float64Array(s));
    for (let a = 0; a < i.length; a++)
      i[a].geometry.coordinates = [o[a * 2], o[a * 2 + 1]];
  }
  return {
    geojson: { type: "FeatureCollection", features: i },
    featureCount: i.length
  };
}
function de(r, t) {
  if (Array.isArray(r)) {
    if (typeof r[0] == "number") {
      t(r);
      return;
    }
    for (const e of r) de(e, t);
  }
}
async function fi(r) {
  const { hydrologyFiles: t, risk: e, ref: n, fieldName: i = "Risk" } = r;
  await Ie();
  const s = await H(
    "rasterStreamsToVector",
    {
      streams_raster: "/work/stream.tif",
      d8_pntr: "/work/d8.tif",
      output: "/work/streams.geojson",
      esri_pntr: !1
    },
    { "stream.tif": t.streamVector, "d8.tif": t.d8 }
  ), o = X(s, "streams.geojson", "raster_streams_to_vector"), c = JSON.parse(new TextDecoder().decode(o)).features ?? [];
  for (const l of c) {
    if (!l.geometry) continue;
    let f = 0, d = 0;
    de(l.geometry.coordinates, ([h, w]) => {
      const u = si(e, n, h, w);
      Number.isFinite(u) && (f += u, d += 1);
    }), l.properties ??= {}, l.properties[i] = d > 0 ? f / d : null;
  }
  if (n.epsg !== void 0 && n.epsg !== 4326) {
    const l = [], f = [];
    for (const d of c)
      d.geometry && de(d.geometry.coordinates, (h) => {
        l.push(h[0], h[1]), f.push(h);
      });
    if (l.length > 0) {
      const d = he(n.epsg, 4326, new Float64Array(l));
      for (let h = 0; h < f.length; h++)
        f[h][0] = d[h * 2], f[h][1] = d[h * 2 + 1];
    }
  }
  return {
    geojson: { type: "FeatureCollection", features: c },
    featureCount: c.length
  };
}
function Yt(r, t) {
  return r ?? t;
}
function mn(r) {
  if (r.epsg === void 0)
    throw new Error(
      "The DEM has no coordinate reference system embedded in its GeoTIFF metadata (a sidecar .prj or .tfw file is not enough). Re-save it with its CRS embedded — e.g. \`gdal_translate -a_srs EPSG:<code> -of COG in.tif out.tif\` — and try again."
    );
}
async function bn(r, t, e, n) {
  try {
    const i = t.length, s = new Float64Array(i).fill(1), o = new Float64Array(i), a = await H(
      "dinfMassFlux",
      {
        dem: "/work/dem_fill.tif",
        loading: "/work/loading.tif",
        efficiency: "/work/efficiency.tif",
        absorption: "/work/absorption.tif",
        output: "/work/routed_accum.tif"
      },
      {
        "dem_fill.tif": r.files.demFilled,
        "loading.tif": kt(t, { ref: r.ref }),
        "efficiency.tif": kt(s, { ref: r.ref }),
        "absorption.tif": kt(o, { ref: r.ref })
      }
    ), c = await et(
      X(a, "routed_accum.tif", "dinf_mass_flux")
    );
    return dt(c.data, r.mask);
  } catch (i) {
    return n.push(
      \`\${e} mass-flux routing failed (\${i instanceof Error ? i.message : String(i)}); using local scaling fallback.\`
    ), null;
  }
}
async function ui(r, t, e) {
  const n = t.length, i = new Float64Array(n);
  for (let s = 0; s < n; s++)
    i[s] = Number.isFinite(t[s]) ? t[s] * r.cellArea : 0;
  return bn(r, i, "Rainfall-weighted", e);
}
async function di(r, t, e) {
  const n = t.length, i = new Float64Array(n);
  for (let s = 0; s < n; s++)
    i[s] = Number.isFinite(t[s]) ? t[s] * r.cellArea : 0;
  return bn(r, i, "Erosion-connectivity risk", e);
}
async function gi(r, t = () => {
}) {
  const e = [], n = await Ae(r.dem);
  mn(n);
  const i = Math.abs(n.geoTransform[1] * n.geoTransform[5]), s = Math.max(1, r.streamThresholdM2 / i), o = await wn({
    demBytes: r.dem,
    streamThreshold: s,
    depressionMethod: r.depressionMethod,
    onProgress: t
  });
  t(26, "3. Aligning rainfall and land cover to the DEM grid...");
  const a = await je(
    r.rainfall,
    r.dem,
    n,
    "bilinear"
  ), c = await je(
    r.landcover,
    r.dem,
    n,
    "nn"
  ), l = await et(a), f = await et(c), d = Hr(l.data, o.mask), h = dt(f.data.slice(), o.mask);
  t(30, "4. Building the land cover risk weighting...");
  let w, u = null;
  if (r.landcoverIsPreweighted)
    e.push("Using the land cover raster directly as a risk weighting."), w = h;
  else {
    const A = li(h, {
      weights: r.weights.size > 0 ? r.weights : Wr,
      remap: r.remap.size > 0 ? r.remap : Pr,
      alreadyScimap: r.landcoverIsScimapClasses,
      fallbackClass: r.fallbackClass || ln
    });
    w = A.riskWeight, u = A.scimapClasses, A.unmapped.length > 0 && e.push(
      \`Unassigned land-cover IDs in the catchment (\${A.unmapped.length}): \` + A.unmapped.join(", ")
    ), A.fallbackCells > 0 && e.push(
      \`Applied fallback SCIMAP class \${r.fallbackClass} weight to \${A.fallbackCells} unmapped cells.\`
    );
  }
  t(
    34,
    \`4. Computing Erosion Risk (\${r.useStreamPower ? "stream power" : "upslope area only"})...\`
  );
  const p = dt(o.slope.slice(), o.mask), m = dt(o.accum.slice(), o.mask), b = qr(
    m,
    p,
    o.cellArea,
    r.useStreamPower
  );
  for (let A = 0; A < b.length; A++) b[A] *= w[A];
  const y = dt(dn(b, 5, 95), o.mask);
  t(45, "5. Computing Network Connectivity...");
  const x = pn(
    o.d8,
    o.accum,
    p,
    d,
    {
      width: o.ref.width,
      height: o.ref.height,
      mask: o.mask,
      channelMask: o.channelMask,
      dem: o.demFilled,
      onProgress: t
    },
    r.connectivityMethod ?? "flow_path_trace"
  );
  t(58, "6. Computing FD8-based rainfall-weighted and SCIMAP routed proxies...");
  const v = await ui(o, d, e), I = new Float64Array(y.length);
  for (let A = 0; A < I.length; A++)
    I[A] = y[A] * x[A];
  const C = v ? await di(o, I, e) : null, W = Xr({
    erosionRisk: y,
    connectivity: x,
    accum: o.accum,
    mask: o.mask,
    cellArea: o.cellArea,
    rainfallScaled: d,
    streamCellThreshold: s,
    rainfallWeightedArea: v,
    scimapRoutedAccum: C
  });
  t(70, "7. Encoding output rasters...");
  const U = r.ramp ?? null, R = [
    {
      key: "erosion",
      name: "SCIMAP Erosion Risk",
      cog: kt(y, { ref: o.ref }),
      ramp: Yt(U, zr),
      rescale: [0, 1]
    },
    {
      key: "connectivity",
      name: "SCIMAP Network Connectivity",
      cog: kt(x, { ref: o.ref }),
      ramp: Yt(U, _n),
      rescale: [0, 1]
    }
  ];
  r.emitLandcoverClasses && u && R.push({
    key: "landcover_classes",
    name: "SCIMAP Land Cover Classes",
    cog: ii(u, o.ref),
    ramp: Yt(U, jr),
    rescale: [0, 7]
  }), t(82, "8. Generating the Instream Risk Concentration network...");
  const J = [];
  try {
    const A = await fi({
      hydrologyFiles: o.files,
      risk: W.riskConcentration,
      ref: o.ref
    });
    J.push({
      key: "streams",
      name: "Instream Risk Concentration",
      geojson: A.geojson,
      riskField: "Risk"
    }), e.push(\`Instream risk concentration network: \${A.featureCount} features.\`);
  } catch (A) {
    e.push(
      \`Could not build the instream risk concentration network (\${A instanceof Error ? A.message : String(A)}).\`
    );
  }
  if (r.emitStreamRiskPoints) {
    t(92, "9. Exporting stream risk points...");
    const A = _i(W.channelRiskConcentration, o.ref, "scimap_risk");
    J.push({
      key: "stream_risk_points",
      name: "Stream Risk Points",
      geojson: A.geojson,
      riskField: "scimap_risk"
    }), e.push(\`Stream risk points: \${A.featureCount} features.\`);
  }
  return t(100, "SCIMAP Sediment complete."), { rasters: R, vectors: J, ref: o.ref, notes: e };
}
async function hi(r, t = () => {
}) {
  const e = [], n = await Ae(r.dem);
  mn(n);
  const i = Math.abs(n.geoTransform[1] * n.geoTransform[5]), s = Math.max(1, r.streamThresholdM2 / i), o = await wn({
    demBytes: r.dem,
    streamThreshold: s,
    depressionMethod: r.depressionMethod,
    onProgress: t
  });
  t(45, "3. Loading arrays and computing network index...");
  const a = dt(o.slope.slice(), o.mask), c = dt(o.accum.slice(), o.mask), l = new Float64Array(c.length).fill(1), f = r.connectivityMethod ?? "flow_path_trace", d = pn(o.d8, c, a, l, {
    width: o.ref.width,
    height: o.ref.height,
    mask: o.mask,
    channelMask: o.channelMask,
    dem: o.demFilled,
    onProgress: t
  }, f);
  t(85, "4. Encoding the connectivity raster..."), e.push(\`FD8 exponent \${fn}, \${o.channelMask.reduce((w, u) => w + u, 0)} channel cells.\`);
  const h = f === "pdsl" ? "SCIMAP PDSL (Percentage Downslope Saturated Length)" : "SCIMAP Network Index";
  return t(100, \`\${f === "pdsl" ? "PDSL" : "Network Index"} complete.\`), {
    rasters: [
      {
        key: f === "pdsl" ? "pdsl" : "network_index",
        name: h,
        cog: kt(d, { ref: o.ref }),
        ramp: Yt(r.ramp ?? null, _n),
        rescale: [0, 1]
      }
    ],
    vectors: [],
    ref: o.ref,
    notes: e
  };
}
const ge = (r, t = []) => {
  self.postMessage(r, t);
};
function pi(r) {
  const t = r.geoTransform, e = t[0], n = t[3], i = e + t[1] * r.width, s = n + t[5] * r.height, o = new Float64Array([
    Math.min(e, i),
    Math.min(s, n),
    Math.max(e, i),
    Math.max(s, n)
  ]);
  if (r.epsg === void 0) return null;
  if (r.epsg === 4326) return [o[0], o[1], o[2], o[3]];
  try {
    const a = yt(r.epsg, 4326, o);
    return a.length !== 4 || !a.every((c) => Number.isFinite(c)) ? null : [a[0], a[1], a[2], a[3]];
  } catch {
    return null;
  }
}
function $e(r, t) {
  const e = [], n = t.rasters.map((i) => {
    const s = i.cog.buffer.slice(
      i.cog.byteOffset,
      i.cog.byteOffset + i.cog.byteLength
    );
    return e.push(s), {
      key: i.key,
      name: i.name,
      cog: s,
      ramp: i.ramp,
      rescale: i.rescale
    };
  });
  ge(
    {
      type: "done",
      jobId: r,
      rasters: n,
      vectors: t.vectors,
      bounds: pi(t.ref),
      notes: t.notes
    },
    e
  );
}
self.onmessage = async (r) => {
  const t = r.data, { jobId: e } = t, n = (i, s) => {
    ge({ type: "progress", jobId: e, progress: i, message: s });
  };
  try {
    if (n(0, "Loading the GeoLibre WASM toolkit..."), await cn(t.wasmUrls), t.type === "sediment") {
      const s = await gi(
        {
          dem: new Uint8Array(t.dem),
          landcover: new Uint8Array(t.landcover),
          rainfall: new Uint8Array(t.rainfall),
          streamThresholdM2: t.streamThresholdM2,
          useStreamPower: t.useStreamPower,
          depressionMethod: t.depressionMethod,
          landcoverIsPreweighted: t.landcoverIsPreweighted,
          landcoverIsScimapClasses: t.landcoverIsScimapClasses,
          weights: new Map(t.weights),
          remap: new Map(t.remap),
          fallbackClass: t.fallbackClass,
          ramp: t.ramp,
          emitLandcoverClasses: t.emitLandcoverClasses,
          emitStreamRiskPoints: t.emitStreamRiskPoints,
          connectivityMethod: t.connectivityMethod
        },
        n
      );
      $e(e, s);
      return;
    }
    const i = await hi(
      {
        dem: new Uint8Array(t.dem),
        streamThresholdM2: t.streamThresholdM2,
        depressionMethod: t.depressionMethod,
        ramp: t.ramp,
        connectivityMethod: t.connectivityMethod
      },
      n
    );
    $e(e, i);
  } catch (i) {
    ge({
      type: "error",
      jobId: e,
      message: i instanceof Error ? i.message : String(i)
    });
  }
};
//# sourceMappingURL=scimap.worker-DmHBUEk2.js.map
`, R = typeof self < "u" && self.Blob && new Blob(["URL.revokeObjectURL(import.meta.url);", j], { type: "text/javascript;charset=utf-8" });
function nn(n) {
  let r;
  try {
    if (r = R && (self.URL || self.webkitURL).createObjectURL(R), !r) throw "";
    const e = new Worker(r, {
      type: "module",
      name: n?.name
    });
    return e.addEventListener("error", () => {
      (self.URL || self.webkitURL).revokeObjectURL(r);
    }), e;
  } catch {
    return new Worker(
      "data:text/javascript;charset=utf-8," + encodeURIComponent(j),
      {
        type: "module",
        name: n?.name
      }
    );
  }
}
let tn = 1;
const U = [];
function en() {
  for (const n of U) URL.revokeObjectURL(n);
  U.length = 0;
}
function $(n, r, e, t) {
  const i = new nn(), s = tn++;
  let a = !1;
  const c = new Promise((f, d) => {
    i.onmessage = async (_) => {
      const l = _.data;
      if (l.jobId === s) {
        if (l.type === "progress") {
          t.onProgress(l.progress, l.message);
          return;
        }
        if (l.type === "error") {
          a = !0, i.terminate(), d(new Error(l.message));
          return;
        }
        a = !0;
        try {
          for (const o of l.notes) t.onLog(o);
          for (const o of l.rasters) {
            const h = URL.createObjectURL(
              new Blob([o.cog], { type: "image/tiff" })
            );
            if (U.push(h), !n.addCogLayer) {
              t.onLog(
                `This GeoLibre build cannot add COG layers, so "${o.name}" was skipped.`
              );
              continue;
            }
            await n.addCogLayer(o.name, h, {
              colormap: o.ramp,
              rescaleMin: o.rescale[0],
              rescaleMax: o.rescale[1]
            }), t.onLog(`Added raster layer: ${o.name}`);
          }
          for (const o of l.vectors)
            n.addGeoJsonLayer(o.name, o.geojson), t.onLog(`Added vector layer: ${o.name}`);
          l.bounds && n.fitBounds?.(l.bounds), f();
        } catch (o) {
          d(o instanceof Error ? o : new Error(String(o)));
        } finally {
          i.terminate();
        }
      }
    }, i.onerror = (_) => {
      a = !0, i.terminate(), d(new Error(_.message || "The SCIMAP worker failed to start."));
    };
  });
  return i.postMessage({ ...r, jobId: s, wasmUrls: Q() }, e), {
    promise: c,
    cancel: () => {
      a || i.terminate();
    }
  };
}
async function M(n, r) {
  if (typeof n != "string") return n;
  let e;
  try {
    e = new URL(n);
  } catch {
    throw new Error(`${r}: "${n}" is not a valid URL.`);
  }
  if (e.protocol !== "https:" && e.protocol !== "http:")
    throw new Error(`${r}: only http(s) URLs are supported.`);
  const t = await fetch(e.href);
  if (!t.ok)
    throw new Error(`${r}: fetch failed with HTTP ${t.status}.`);
  return t.arrayBuffer();
}
function P(n, r, e) {
  const t = document.createElement("label");
  t.className = "scimap-field";
  const i = document.createElement("span");
  if (i.className = "scimap-field__label", i.textContent = n, t.append(i, r), e) {
    const s = document.createElement("small");
    s.className = "scimap-field__hint", s.textContent = e, t.append(s);
  }
  return t;
}
function S(n, r) {
  const e = document.createElement("div");
  e.className = "scimap-raster";
  const t = document.createElement("input");
  t.type = "file", t.accept = ".tif,.tiff,.geotiff,image/tiff";
  const i = document.createElement("input");
  i.type = "url", i.placeholder = "or https://… (COG or GeoTIFF)", i.className = "scimap-raster__url";
  const s = document.createElement("small");
  return s.className = "scimap-raster__status", t.addEventListener("change", () => {
    const a = t.files?.[0];
    s.textContent = a ? `${a.name} (${rn(a.size)})` : "", a && (i.value = "");
  }), e.append(t, i, s), {
    element: P(n, e, r),
    get: () => null,
    hasValue: () => !!(t.files?.[0] || i.value.trim()),
    async read() {
      const a = t.files?.[0];
      if (a) return a.arrayBuffer();
      const c = i.value.trim();
      if (c) return c;
      throw new Error(`${n} is required.`);
    }
  };
}
function rn(n) {
  return n < 1024 ? `${n} B` : n < 1024 ** 2 ? `${(n / 1024).toFixed(0)} KB` : `${(n / 1024 ** 2).toFixed(1)} MB`;
}
function N(n, r, e = {}) {
  const t = document.createElement("input");
  return t.type = "number", t.value = String(r), e.min !== void 0 && (t.min = String(e.min)), e.step !== void 0 && (t.step = String(e.step)), {
    element: P(n, t, e.hint),
    get: () => {
      const i = Number(t.value);
      return Number.isFinite(i) ? i : r;
    }
  };
}
function I(n, r, e) {
  const t = document.createElement("input");
  t.type = "checkbox", t.checked = r;
  const i = document.createElement("label");
  i.className = "scimap-check";
  const s = document.createElement("span");
  s.textContent = n, i.append(t, s);
  const a = document.createElement("div");
  if (a.append(i), e) {
    const c = document.createElement("small");
    c.className = "scimap-field__hint", c.textContent = e, a.append(c);
  }
  return { element: a, get: () => t.checked };
}
function x(n, r, e, t) {
  const i = document.createElement("select");
  for (const [s, a] of r) {
    const c = document.createElement("option");
    c.value = s, c.textContent = a, i.append(c);
  }
  return i.value = e, {
    element: P(n, i, t),
    get: () => i.value
  };
}
function B(n, r, e, t = {}) {
  const i = document.createElement("details");
  i.className = "scimap-table";
  const s = document.createElement("summary");
  s.textContent = n, i.append(s);
  const a = document.createElement("table"), c = document.createElement("thead");
  c.innerHTML = `<tr><th>${r[0]}</th><th>${r[1]}</th></tr>`;
  const f = document.createElement("tbody");
  a.append(c, f), i.append(a);
  const d = [], _ = (o, h) => {
    const b = document.createElement("tr"), w = document.createElement("td"), p = document.createElement("input");
    p.type = "number", p.value = String(o), w.append(p);
    const v = t.rowLabels?.get(Number(o));
    if (v) {
      const g = document.createElement("small");
      g.textContent = v, w.append(g);
    }
    const m = document.createElement("td"), u = document.createElement("input");
    u.type = "number", u.step = t.integerValues ? "1" : "any", u.value = String(h), m.append(u), b.append(w, m), f.append(b), d.push([p, u]);
  };
  for (const [o, h] of e) _(o, h);
  const l = document.createElement("button");
  return l.type = "button", l.className = "scimap-table__add", l.textContent = "Add row", l.addEventListener("click", () => _("", "")), i.append(l), {
    element: i,
    get: () => {
      const o = [];
      for (const [h, b] of d) {
        if (h.value === "" || b.value === "") continue;
        const w = Number(h.value), p = Number(b.value);
        !Number.isFinite(w) || !Number.isFinite(p) || o.push([Math.trunc(w), t.integerValues ? Math.trunc(p) : p]);
      }
      return o;
    }
  };
}
function y(n, r) {
  const e = document.createElement("fieldset");
  e.className = "scimap-section";
  const t = document.createElement("legend");
  return t.textContent = n, e.append(t, ...r), e;
}
function G() {
  const n = document.createElement("div");
  n.className = "scimap-progress";
  const r = document.createElement("progress");
  r.max = 100, r.value = 0;
  const e = document.createElement("div");
  e.className = "scimap-progress__log", n.append(r, e);
  const t = (i) => {
    const s = document.createElement("div");
    s.textContent = i, e.append(s), e.scrollTop = e.scrollHeight;
  };
  return {
    element: n,
    set(i, s) {
      r.value = Math.max(0, Math.min(100, i)), s && t(s);
    },
    log: t,
    reset() {
      r.value = 0, e.replaceChildren();
    }
  };
}
const C = "scimap-network-index";
function sn(n) {
  return {
    id: C,
    title: "SCIMAP Network Index",
    defaultWidth: 380,
    render(r) {
      r.classList.add("scimap-panel");
      const e = document.createElement("p");
      e.className = "scimap-intro", e.textContent = "Computes a SCIMAP hydrological connectivity index from a DEM using uniform rainfall, so the result reflects terrain alone.";
      const t = S("Digital Elevation Model (DEM)"), i = N(
        "Stream initiation threshold (m²)",
        O,
        { min: 0, step: 1e4 }
      ), s = x(
        "Connectivity algorithm",
        [
          ["flow_path_trace", "Network Index (flow-path trace, default)"],
          ["pdsl", "Percentage Downslope Saturated Length (PDSL)"]
        ],
        "flow_path_trace"
      ), a = x(
        "Depression removal",
        [
          ["breach", "Least-cost breach (default)"],
          ["fill", "Fill depressions"]
        ],
        "breach"
      ), c = x(
        "Colour ramp",
        [
          ["", "SCIMAP default (viridis)"],
          ...D.map((_) => [_, _])
        ],
        ""
      ), f = document.createElement("button");
      f.type = "button", f.className = "scimap-run", f.textContent = "Run Network Index";
      const d = G();
      return f.addEventListener("click", async () => {
        if (!t.hasValue()) {
          d.log("DEM is required.");
          return;
        }
        f.disabled = !0, d.reset(), d.set(0, "Reading the DEM...");
        try {
          const _ = await t.read().then((o) => M(o, "DEM")), { promise: l } = $(
            n,
            {
              type: "networkIndex",
              dem: _,
              streamThresholdM2: i.get(),
              depressionMethod: a.get(),
              ramp: c.get() || null,
              connectivityMethod: s.get()
            },
            [_],
            { onProgress: d.set, onLog: d.log }
          );
          await l, d.set(
            100,
            s.get() === "pdsl" ? "PDSL complete." : "Network Index complete."
          );
        } catch (_) {
          d.log(
            `Failed: ${_ instanceof Error ? _.message : String(_)}`
          );
        } finally {
          f.disabled = !1;
        }
      }), r.append(
        e,
        y("Input", [t.element]),
        y("Model", [i.element, s.element, a.element]),
        y("Output", [c.element]),
        f,
        d.element
      ), () => r.replaceChildren();
    }
  };
}
const F = "scimap-sediment";
function on(n) {
  return {
    id: F,
    title: "SCIMAP Sediment",
    defaultWidth: 380,
    render(r) {
      r.classList.add("scimap-panel");
      const e = document.createElement("p");
      e.className = "scimap-intro", e.textContent = "Maps fine sediment and diffuse pollution risk from a DEM, a land cover map and a rainfall map. Everything runs locally in your browser.";
      const t = S("Digital Elevation Model (DEM)"), i = S("Land Cover Map / Risk Weighting"), s = S("Rainfall Map"), a = I(
        "Land cover is already a risk weighting",
        !1,
        "Use the raster's values as-is, skipping the remap and weight tables."
      ), c = I(
        "Land cover already uses SCIMAP classes (1-7)",
        !1
      ), f = B(
        "Land cover class → SCIMAP class",
        ["Land cover ID", "SCIMAP class"],
        J,
        { integerValues: !0 }
      ), d = B(
        "SCIMAP class → risk weight",
        ["SCIMAP class", "Risk weight"],
        q,
        { rowLabels: V }
      ), _ = N(
        "SCIMAP class for unmapped land cover values",
        H,
        { min: 0, step: 1 }
      ), l = N(
        "Stream initiation threshold (m²)",
        O,
        { min: 0, step: 1e4 }
      ), o = I("Use stream power in erosion calculation", !0), h = x(
        "Connectivity algorithm",
        [
          ["flow_path_trace", "Network Index (flow-path trace, default)"],
          ["pdsl", "Percentage Downslope Saturated Length (PDSL)"]
        ],
        "flow_path_trace"
      ), b = x(
        "Depression removal",
        [
          ["breach", "Least-cost breach (default)"],
          ["fill", "Fill depressions"]
        ],
        "breach",
        "The WASM toolset has no plain breach; results differ slightly from the QGIS plugin."
      ), w = x(
        "Colour ramp",
        [
          ["", "SCIMAP defaults (per layer)"],
          ...D.map((g) => [g, g])
        ],
        ""
      ), p = I("Also output the SCIMAP land cover classes", !1), v = I(
        "Also output stream risk points",
        !1,
        "One point per stream cell, carrying the SCIMAP risk concentration."
      ), m = document.createElement("button");
      m.type = "button", m.className = "scimap-run", m.textContent = "Run SCIMAP Sediment";
      const u = G();
      return m.addEventListener("click", async () => {
        for (const [g, A] of [
          [t, "DEM"],
          [i, "Land cover map"],
          [s, "Rainfall map"]
        ])
          if (!g.hasValue()) {
            u.log(`${A} is required.`);
            return;
          }
        m.disabled = !0, u.reset(), u.set(0, "Reading input rasters...");
        try {
          const [g, A, L] = await Promise.all([
            t.read().then((k) => M(k, "DEM")),
            i.read().then((k) => M(k, "Land cover map")),
            s.read().then((k) => M(k, "Rainfall map"))
          ]), { promise: z } = $(
            n,
            {
              type: "sediment",
              dem: g,
              landcover: A,
              rainfall: L,
              streamThresholdM2: l.get(),
              useStreamPower: o.get(),
              depressionMethod: b.get(),
              landcoverIsPreweighted: a.get(),
              landcoverIsScimapClasses: c.get(),
              weights: d.get(),
              remap: f.get(),
              fallbackClass: _.get(),
              ramp: w.get() || null,
              emitLandcoverClasses: p.get(),
              emitStreamRiskPoints: v.get(),
              connectivityMethod: h.get()
            },
            [g, A, L],
            { onProgress: u.set, onLog: u.log }
          );
          await z, u.set(100, "SCIMAP Sediment complete.");
        } catch (g) {
          u.log(
            `Failed: ${g instanceof Error ? g.message : String(g)}`
          );
        } finally {
          m.disabled = !1;
        }
      }), r.append(
        e,
        y("Inputs", [t.element, i.element, s.element]),
        y("Land cover weighting", [
          a.element,
          c.element,
          f.element,
          d.element,
          _.element
        ]),
        y("Model", [
          l.element,
          o.element,
          h.element,
          b.element
        ]),
        y("Output", [w.element, p.element, v.element]),
        m,
        u.element
      ), () => r.replaceChildren();
    }
  };
}
const E = [], an = {
  id: "scimap",
  name: "SCIMAP",
  version: "0.1.0",
  activate(n) {
    if (!n.registerRightPanel || !n.registerToolbarMenu)
      return console.warn("[scimap] This GeoLibre build does not support plugin panels."), !1;
    for (const e of [on(n), sn(n)]) {
      const t = n.registerRightPanel(e);
      t && E.push(t);
    }
    const r = n.registerToolbarMenu({
      id: "scimap-menu",
      label: "SCIMAP",
      items: [
        {
          id: "scimap-open-sediment",
          label: "SCIMAP Sediment",
          onSelect: () => n.openRightPanel?.(F)
        },
        {
          id: "scimap-open-network-index",
          label: "Network Index",
          onSelect: () => n.openRightPanel?.(C)
        }
      ]
    });
    return r && E.push(r), !0;
  },
  deactivate(n) {
    n.closeRightPanel?.(F), n.closeRightPanel?.(C);
    for (const r of E.splice(0))
      try {
        r();
      } catch (e) {
        console.warn("[scimap] Failed to unregister a UI surface.", e);
      }
    en();
  }
};
export {
  an as default,
  an as plugin
};
//# sourceMappingURL=index.js.map
