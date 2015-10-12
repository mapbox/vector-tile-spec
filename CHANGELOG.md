## Vector Tile Spec Changelog

### 1.0.2-draft

 - Clarification of how polygon exterior and interior rings should be oriented and ordered: If present, any polygon interior rings (holes) must be oriented with the opposite winding order than their parent exterior rings and all interior rings must directly follow the exterior ring they belong too. Exterior rings must be oriented CCW and interior rings must be oriented CW (when viewed from the "top").
 - Added optional `raster` field on feature intended to store encoded image data representing exact and unbuffered tile extents for a layer.

### 1.0.1

 - Used TitleCase and UPPERCASE in `vector_tile.proto` to match Protobuf style guide (#3)
 - Changed namespace from `mapnik.vector` to `vector_tile` (#2)

### 1.0.0

 - First release