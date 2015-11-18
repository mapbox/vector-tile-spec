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

A vector tile can consist of one or more named layers and containing one or more features.

Features contain an id, attributes, and geometries: either point, linestring, or polygon.

Geometries are stored as a single array of integers that represent a command,x,y stream (where command is a rendering command like move_to or line_to). Commands are encoded only when they change. Geometries are clipped, reprojected into spherical mercator, converted to screen coordinates, and [delta](http://en.wikipedia.org/wiki/Delta_encoding) and [zigzag](https://developers.google.com/protocol-buffers/docs/encoding#types) encoded.

Feature attributes are encoded as key:value pairs which are dictionary encoded at the layer level for compact storage of any repeated keys or values. Values use [varint](https://developers.google.com/protocol-buffers/docs/encoding#varints) type encoding supporting both unicode strings, boolean values, and various integer and floating point types.

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

The complete and authoritative details on encoding are part of the code comments for the [vector tile protobuf schema document](vector_tile.proto).
