---
title: Winding Order
---

Winding order refers to the direction a ring is drawn in a vector tile, either clockwise or counter-clockwise. Many geometries are multipolygons with "holes", which are also represented as polygon rings. It is important to be able to extract winding order so one is able to extract source data from a vector tile.

In order for renderers to appropriately distinguish which polygons are holes and which are unique geometries, the specification clarifies any polygon interior rings must be oriented with the opposite winding order than their parent exterior rings and all interior rings must directly follow the exterior ring they belong to. Exterior rings must be oriented clockwise and interior rings must be oriented counter-clockwise (when viewed in screen coordinates).

<div id="js-example-encoding" class="js-example clearfix">
  <div class="js-example-header">
    <h3>The importance of winding order</h3>
    <p>The following example geometries show how encoding a ring's winding order can affect the rendered result. Each example assumes all rings are part of the same multipolygon.</p>
  </div>

  <div class="js-example-body">
    <div class="wo-block col12 clearfix">
      <div class="col5 pad1"></div>
      <div class="col3 pad1"></div>
      <div class="col3 pad1"></div>
    </div>
    <div class="wo-block col12 clearfix">
      <div class="col5 pad1"><strong>Description</strong></div>
      <div class="col3 pad1" style="text-align: center;"><strong>Winding order</strong></div>
      <div class="col3 pad1" style="text-align: center;"><strong>Rendered</strong></div>
    </div>
    <div class="wo-block col12 clearfix">
      <div class="col5 pad1">A single ring, in clockwise order is rendered as a single, solid polygon.
      <pre><code>Ring 1: Clockwise</code></pre>
      </div>
      <div class="col3 pad1">
        <svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 220 220">
          <path d="M48.15,72.53L45.3,70.61l7.19-3.5-0.56,8L49.1,73.17A71.09,71.09,0,1,0,73.62,48.83l-0.59-1A72.36,72.36,0,1,1,48.15,72.53Z" class="ring outer cw" />
        </svg>
      </div>
      <div class="col3 pad1">
        <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
          <circle cx="204.02" cy="200" r="126.77" class="ring outer render"/>
        </svg>
      </div>
    </div>
    <div class="wo-block col12 clearfix">
      <div class="col5 pad1">Two rings with the same winding order will render as two unique polygons overlapping.<pre><code>Ring 1: Clockwise
Ring 2: Clockwise</code></pre></div>
      <div class="col3 pad1">
        <svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 220 220">
          <path d="M48.15,72.53L45.3,70.61l7.19-3.5-0.56,8L49.1,73.17A71.09,71.09,0,1,0,73.62,48.83l-0.59-1A72.36,72.36,0,1,1,48.15,72.53Z" class="ring outer cw"/>
          <path d="M122.35,65L123,62.9l3.44,3.85-5.05,1.06,0.69-2.09a45.87,45.87,0,1,0,19.43,10.92l0.51-.54A46.69,46.69,0,1,1,122.35,65Z" class="ring outer cw"/>
        </svg>
      </div>
      <div class="col3 pad1">
        <svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 220 220">
          <circle cx="110" cy="110" r="45.78" class="ring outer render" />
          <circle cx="110" cy="110" r="71.63" class="ring outer render" />
        </svg>
      </div>
    </div>
    <div class="wo-block col12 clearfix">
      <div class="col5 pad1">Two rings, the first (exterior) ring is in clockwise order, while the second is counter-clockwise. This results in a "hole" in the final render.<pre><code>Ring 1: Clockwise
Ring 2: Counter-Clockwise</code></pre></div>
      <div class="col3 pad1">
        <svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 220 220">
          <path d="M48.15,72.53L45.3,70.61l7.19-3.5-0.56,8L49.1,73.17A71.09,71.09,0,1,0,73.62,48.83l-0.59-1A72.36,72.36,0,1,1,48.15,72.53Z" class="ring outer cw" />
          <path d="M63.65,106.85l-2.22,0,2.51,4.51,2.65-4.43-2.2,0a45.87,45.87,0,1,1,4,21.93l-0.67.3A46.69,46.69,0,1,0,63.65,106.85Z" class="ring inner ccw"/>
        </svg>
      </div>
      <div class="col3 pad1">
        <svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 220 220">
          <path d="M110,38.37A71.63,71.63,0,1,0,181.63,110,71.63,71.63,0,0,0,110,38.37Zm0,117.41A45.78,45.78,0,1,1,155.78,110,45.78,45.78,0,0,1,110,155.78Z" class="ring outer render" />
        </svg>
      </div>
    </div>
  </div>
</div>


