# vector-tile-spec

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT",
"SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in
this document are to be interpreted as described in [RFC 2119](https://www.ietf.org/rfc/rfc2119.txt).

## 1. Purpose

This specification attempts to create a standard for encoding of tiled geospatial data that can be shared across clients.

## 2. File format

The vector tile encoding scheme encodes vector data for a tile in a space efficient manner. It is designed to be used in browsers or serverside applications for fast rendering or lookups of feature data.

Vector Tiles use [Google Protocol buffers](https://developers.google.com/protocol-buffers/) as a container format. It is exclusively geared towards square pixel tiles in [Spherical Mercator projection](http://wiki.openstreetmap.org/wiki/Mercator).

## 3. Internal structure

A vector tile may consist of one or more named layers and containing one or more features.

Features MAY contain an `id` and `tags` (attributes) and MUST contain either a `geometry` (either point, linestring, or polygon) or a `raster` field. A feature SHALL NOT contain both a `raster` and a `geometry` field. If a feature has a `geometry` field it MUST also have a `type` field to describe the `geometry`. 

### 3.1. Geometry Encoding

Geometries are stored as an a single array of integers that represent a command,x,y stream (where command is a rendering command like `move_to` or `line_to`). Commands are encoded only when they change.

Geometries with multiple parts (multipoint, multiline, or multipolygon) MUST be encoded one after another in the same `geometry` field and therefore are "flattened". Geometries with only a single part MUST have only a single `move_to` present. For multipoints and multilines a repeated `move_to` SHALL indicate another part of a multipart geometry. For polygons a repeated `move_to` SHALL indicate either another exterior of a new polygon part or an interior ring of the previous polygon part. The winding order MUST be used to distinguish between the two types: polygon interior rings (holes) must be oriented with the opposite winding order than their parent exterior rings and all interior rings MUST directly follow the exterior ring to which they belong. 

The exterior ring MUST have a positive area as calculated by applying the [surveyor's formula](https://en.wikipedia.org/wiki/Shoelace_formula) to the vertices of the polygon in tile coordinates. In screen coordinates (with the Y axis positive down) this makes the exterior ring's winding order appear clockwise. In a frame where the Y axis is positive up, this would make the winding order appear counter clockwise.

Geometry collections are not supported.

Geometries SHOULD be clipped, reprojected into spherical mercator, converted to screen coordinates, and MUST be [delta](http://en.wikipedia.org/wiki/Delta_encoding) and [zigzag](https://developers.google.com/protocol-buffers/docs/encoding#types) encoded.

Geometries SHOULD be a geometric objects that has no anomalous geometric points, such as self intersection or self tangency.

### 3.2. Feature Attributes

Feature attributes are encoded as key:value pairs which are dictionary encoded at the layer level for compact storage of any repeated keys or values. Values use [variant](https://developers.google.com/protocol-buffers/docs/encoding#varints) type encoding supporting both unicode strings, boolean values, and various integer and floating point types.

### 3.3. Example

For example, a GeoJSON feature like:

```json
{
    "type": "FeatureCollection", 
    "features": [
        {
            "geometry": {
                "type": "Point", 
                "coordinates": [
                    -8247861.1000836585, 
                    4970241.327215323
                ]
            }, 
            "type": "Feature", 
            "properties": {
                "hello": "world"
            }
        }
    ]
}
```

Would be structured like:

```js
layers {
  name: "points"
  features {
    id: 1
    tags: 0
    tags: 0
    type: Point
    geometry: 9
    geometry: 2410
    geometry: 3080
  }
  keys: "hello"
  values {
    string_value: "world"
  }
  extent: 4096
  version: 2
}
```

The authoritative details on encoding are part of the code comments for the [vector tile protobuf schema document](vector_tile.proto).
