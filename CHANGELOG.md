# Vector Tile Spec Changelog

### 2.1

The 2.1 update of the specification is a correction to the wording in a few locations of the 2.0 specification. The wording of the specification is slightly changed in 2.1, but reflects important concepts that were improperly described by the 2.0 specification. 

#### Summary of Changes:

 - Changed the meaning of `extent` to reflect how all known implementations of the specification use extent.
 - Changed the wording to make it such that `LineTo(0,0)` is an invalid command by changing wording from SHOULD to MUST.
 - Added `CONTRIBUTING.md` file

#### Issues:

 List of issues addressed by this version:

 - [#54](https://github.com/mapbox/vector-tile-spec/issues/54) 
 - [#51](https://github.com/mapbox/vector-tile-spec/issues/51) 

#### Date of Release:

January 19th, 2016

### 2.0

The focus of version `2.0` of the Mapbox Vector Tile specification is the clarification of the intent of the intial version of the specification and the definition of interior and exterior rings within polygons. The fields within the protobuffer are more clearly defined in this version of the specification and the steps for decoders and encoders are more explicity declared. 

The version numbering of the specification is now more clearly defined as well as part of the `2.0` changes, migrating from a `major.minor.patch` versioning to a `major.minor` versioning. 

Sections to the specification have been introduced to improve readablility. There are now more examples of the geometry encoding process to ease understanding of the concepts within the specification.

The file [CONTRIBUTING.md] has been added to the repository to better define a repeatable process for changing the specification.

#### Summary of Changes:

 - Clarification of how polygon exterior and interior rings should be oriented and ordered: If present, any polygon interior rings (holes) must be oriented with the opposite winding order than their parent exterior rings and all interior rings must directly follow the exterior ring they belong too. Exterior rings must be oriented CW and interior rings must be oriented CCW (when viewed in screen coordinates).
 - Noted that first point does not have to be the same as last point prior to calling `ClosePath`.
 - Polygon geometries now must not have self intersections or self tangency. (Example: spikes in rings)
 - Addded definition of linear ring.
 - Clarified that `UNKNOWN` geometry types may be ignored and that it is experimental.
 - Required the use of the `version` field in layers.
 - Required that layers of a tile not have the same `name` field as any other layer.
 - Explained differences between geometry types.
 - Added explanation of how to handle multipoint, multilines, and multipolygons geometries.
 - Migrated the encoding logic from `proto` file to the README, adding many clarifications.
 - Explained the different commands used in encoding.
 - Added the concept of the `cursor` when encoding and decoding a vector tile.
 - Explained the coordinate system of a vector tile.
 - Made it clear that specification could be used in projections other than Mercator.
 - Defined more clearly feature attributes and how they are handled.
 - `LineTo` command should not resolve to same position - ex: `LineTo(0,0)`.
 - Changed the way that versioning of the specification is handled. 
 - Updated Authors
 - Added `CONTRIBUTING.md` file

#### Issues:

 List of issues addressed by this version:

 - [#43](https://github.com/mapbox/vector-tile-spec/issues/43) 
 - [#41](https://github.com/mapbox/vector-tile-spec/issues/41) 
 - [#30](https://github.com/mapbox/vector-tile-spec/issues/30) 
 - [#29](https://github.com/mapbox/vector-tile-spec/issues/29) 
 - [#27](https://github.com/mapbox/vector-tile-spec/issues/27) 
 - [#25](https://github.com/mapbox/vector-tile-spec/issues/25) 
 - [#24](https://github.com/mapbox/vector-tile-spec/issues/24) 
 - [#18](https://github.com/mapbox/vector-tile-spec/issues/18) 
 - [#16](https://github.com/mapbox/vector-tile-spec/issues/16) 
 - [#15](https://github.com/mapbox/vector-tile-spec/issues/15) 
 - [#7](https://github.com/mapbox/vector-tile-spec/issues/7) 
 - [#5](https://github.com/mapbox/vector-tile-spec/issues/5) 

#### Date of Release:

December 4th, 2015

### 1.0.1

 - Used TitleCase and UPPERCASE in `vector_tile.proto` to match Protobuf style guide (#3)
 - Changed namespace from `mapnik.vector` to `vector_tile` (#2)

### 1.0.0

 - First release
