---
title: What the spec doesn't cover
id: not-included
---

This specification is very explicit in the way a vector tile should pack data. However, there are some related concepts that this specification does not cover.

### How to use vector tiles as a dataset

This specification IS NOT intended to explain how to use vector tiles as a dataset. This is something that has been considered for the future, but it will likely be a separate specification. This specification does not cover how to store, request, or share vector tiles. Consider this specification similar to how the PNG spec explains how to *pack data*.

### Clipping

The specification does not explain how geographic data should be clipped between vector tiles since clipping, like simplification, can be executed in many ways. Mapbox specifically clips features at a buffer around the tile (see the encoding example above). Any geometry within this buffer is assumed to carry over to another tile. This is up for consideration for a future release.

*Note: encoded geometry in vector tiles can actually extend beyond the bound of the tile. This means features are not required to be clipped.*

A common question, when it comes to clipping is "how do renderers know which lines to connect for clipped geometry?". This is the very reason Mapbox adds a buffer to vector tiles and clipped geometry. When it is time to render the canvas is set to the exact tile size, which sets the edges outside of the visual frame, thus the tiles all line up. Therefore, there is no need to know which nodes are part of others for rendering purposes. That being said, one *could* use the `id` field in the protobuf to store information necessary for reconstructing polygons.

### Simplification

The conversion from geographic coordinates (latitude and longitude) to vector tile coordinates (x, y) is an important step, but can be implemted in many different ways prior to vector tile encoding. It is not included in this specification, but there are some important GOTCHAs we'd like to point out.

<div class="js-example clearfix">
  <div class="js-example-header">
    <h3>Simplification GOTCHAs</h3>
    <p>Even though simplification is not a part of the specification, these are some tricky situations to keep in mind as you implement a simplification algorithm.</p>
  </div>
  <div class="js-example-body">
    <div class="col12 clearfix">
      <div class="col6">
        <p>Simplification can cause <strong>invalid polygons</strong> according to the OGC standards by oversimplifying polygon rings to the point where their edges overlap. See below how simplifying one line changes the rendering of a polygon by pushing the interior ring outside of the exterior ring.</p>
      </div>
      <div class="col5 fr">
        <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300" class="simplification-example">
          <g id="simp1" class="show">
            <text x="0" y="10" font-size="12">1 / 4</text>
            <text x="0" y="24" font-size="12">Polygon with a "hole"</text>
            <path d="M267.53,102.13L220.72,45.34,172,29.73,42.27,65.48,25.69,189.32l84.46,34.2L182,273.12,254.42,240,275,177ZM171.81,219.89l-83.94-45.6L54.71,76.88,206,74.29l18.65,118.66Z" class="simp-geom simp-poly"/>
          </g>
          <g id="simp2">
            <text x="0" y="10" font-size="12">2 / 4</text>
            <text x="0" y="24" font-size="12">Exterior (blue) and interior (red) rings</text>
            <polygon points="42.27 65.48 172.05 29.73 220.72 45.34 267.53 102.13 275.02 177.01 254.42 240.05 182.03 273.12 110.15 223.51 25.69 189.32 42.27 65.48" class="simp-geom simp-ring simp-ring-outer hide"/>
            <polygon points="54.71 76.88 87.87 174.29 171.81 219.89 224.66 192.94 206.01 74.29 54.71 76.88" class="simp-geom simp-ring simp-ring-inner hide"/>
          </g>
          <g id="simp3">
            <text x="0" y="10" font-size="12">3 / 4</text>
            <text x="0" y="24" font-size="12">Simplified exterior ring</text>
            <line x1="26.92" y1="180.14" x2="41.46" y2="71.56" class="simp-geom simp-dashed"/>
            <polyline points="41.87 68.45 42.27 65.48 45.16 64.68" class="simp-geom simp-dashed"/>
            <line x1="51.07" y1="63.06" x2="166.2" y2="31.34" class="simp-geom simp-dashed"/>
            <polygon points="172.05 29.73 220.72 45.34 267.53 102.13 275.02 177.01 254.42 240.05 182.03 273.12 110.15 223.51 25.69 189.32 172.05 29.73" class="simp-geom simp-ring simp-ring-outer hide"/>
            <polygon points="54.71 76.88 87.87 174.29 171.81 219.89 224.66 192.94 206.01 74.29 54.71 76.88" class="simp-geom simp-ring simp-ring-inner hide"/>
          </g>
          <g id="simp4">
            <text x="0" y="10" font-size="12">4 / 4</text>
            <text x="0" y="24" font-size="12">Invalid geometry</text>
            <line x1="26.92" y1="180.14" x2="41.46" y2="71.56" class="simp-geom simp-dashed"/>
            <polyline points="41.87 68.45 42.27 65.48 45.16 64.68" class="simp-geom simp-dashed"/>
            <line x1="51.07" y1="63.06" x2="166.2" y2="31.34" class="simp-geom simp-dashed"/>
            <polygon points="267.53 102.13 220.72 45.34 172.05 29.73 129.99 75.59 206.01 74.29 224.66 192.94 171.81 219.89 87.87 174.29 74.77 135.81 25.69 189.32 110.15 223.51 182.03 273.12 254.42 240.05 275.02 177.01 267.53 102.13" class="simp-geom simp-poly hide"/>
            <polygon points="54.71 76.88 74.77 135.81 129.99 75.59 54.71 76.88" class="simp-geom simp-poly hide"/>
          </g>
        </svg>
      </div>
    </div>
    <div class="col12 clearfix">
      <div class="col6">
        <p>When spatial coordaintes are converted to tile coordaintes, they are rounded to integers. Simplifying (rounding) the coordinates can <strong>reverse the winding order</strong>. Consider a triangle polygon that is simplified to the vector tile grid. The rounded point can cross over the polygon and "flip" it, rendering its winding order reversed.</p>
      </div>
      <div class="col5 fr">
        <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300" class="flip-example">
          <g id="flip-grid" class="show">
            <path class="flip-grid" d="M242.41,0h1m-63,0h1m-63,0h1m-63,0h1M0,57.59v-1m0,63v-1m0,63v-1m0,63v-1M57.59,300h-1m63,0h-1m63,0h-1m63,0h-1M300,242.41v1m0-63v1m0-63v1m0-63v1"/>
            <path class="flip-grid" d="M243.45,0h-1V56.55H181.49V0h-1V56.55H119.54V0h-1V56.55H57.59V0h-1V56.55H0v1H56.55v60.92H0v1H56.55v60.92H0v1H56.55v60.92H0v1H56.55V300h1V243.45h60.92V300h1V243.45h60.92V300h1V243.45h60.92V300h1V243.45H300v-1H243.45V181.49H300v-1H243.45V119.54H300v-1H243.45V57.59H300v-1H243.45V0ZM118.51,242.41H57.59V181.49h60.92v60.92Zm0-62H57.59V119.54h60.92v60.92Zm0-62H57.59V57.59h60.92v60.92Zm62,123.91H119.54V181.49h60.92v60.92Zm0-62H119.54V119.54h60.92v60.92Zm0-62H119.54V57.59h60.92v60.92Zm62,123.91H181.49V181.49h60.92v60.92Zm0-62H181.49V119.54h60.92v60.92Zm0-62H181.49V57.59h60.92v60.92Z"/>
          </g>
          <g id="flip1" class="show">
            <text x="0" y="10" font-size="12">1 / 4</text>
            <text x="0" y="24" font-size="12">Polygon pre-simplification</text>
            <polygon points="36.06 204.47 219.82 83.96 153.8 155.53 36.06 204.47" class="flip-ring flip-outer"/>
          </g>
          <g id="flip2">
            <text x="0" y="10" font-size="12">2 / 4</text>
            <text x="0" y="24" font-size="12">Simplify a point to the grid</text>
            <polygon points="36.06 204.47 219.82 83.96 153.8 155.53 36.06 204.47" class="flip-ring flip-dashed"/>
            <polygon points="56.55 181.49 219.82 83.96 153.8 155.53 56.55 181.49" class="flip-ring flip-outer"/>
          </g>
          <g id="flip3">
            <text x="0" y="10" font-size="12">3 / 4</text>
            <text x="0" y="24" font-size="12">Simplify the second point to the grid</text>
            <polygon points="36.06 204.47 219.82 83.96 153.8 155.53 36.06 204.47" class="flip-ring flip-dashed"/>
            <polygon points="56.55 181.49 180.46 118.51 153.8 155.53 56.55 181.49" class="flip-ring flip-outer"/>
          </g>
          <g id="flip4">
            <text x="0" y="10" font-size="12">4 / 4</text>
            <text x="0" y="24" font-size="12">Simplifying the final point flips the triangle</text>
            <text x="0" y="38" font-size="12">and reverses the winding order</text>
            <polygon points="36.06 204.47 219.82 83.96 153.8 155.53 36.06 204.47" class="flip-ring flip-dashed"/>
            <polygon points="56.55 181.49 180.46 118.51 119.54 119.54 56.55 181.49" class="flip-ring flip-inner"/>
          </g>
        </svg>
      </div>
    </div>
  </div>
</div>



