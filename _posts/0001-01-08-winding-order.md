---
title: Winding Order
id: winding-order
---

Winding order refers to the direction a ring is drawn in a vector tile, either clockwise or counter-clockwise. Many geometries are multipolygons with "holes", which are also represented as polygon rings. It is important to be able to infer winding order to extract source data from a vector tile and understand if the geometry is part of a multipolygon or a unique polygon.

In order for renderers to appropriately distinguish which polygons are holes and which are unique geometries, the specification clarifies any polygon interior rings must be oriented with the opposite winding order than their parent exterior rings and all interior rings must directly follow the exterior ring they belong to. Exterior rings must be oriented clockwise and interior rings must be oriented counter-clockwise (when viewed in screen coordinates).

<div id="js-example-encoding" class="js-example clearfix">
  <div class="js-example-header">
    <h3>The importance of winding order</h3>
    <p>The following example geometries show how encoding a ring's winding order can affect the rendered result. Each example assumes all rings are part of the same multipolygon.</p>
  </div>

  <div class="js-example-body">
    <div class="wo-block col12 clearfix">
      <div class="col6 pad1"></div>
      <div class="col3 pad1"></div>
      <div class="col3 pad1"></div>
    </div>
    <div class="wo-block col12 clearfix">
      <div class="col6 pad1"><strong>Description</strong></div>
      <div class="col3 pad1" style="text-align: center;"><strong>Winding order</strong></div>
      <div class="col3 pad1" style="text-align: center;"><strong>Rendered</strong></div>
    </div>
    <div class="wo-block col12 clearfix">
      <div class="col6 pad1">A single ring, in clockwise order is rendered as a single, solid polygon.
      <pre><code>Ring 1: Clockwise</code></pre>
      </div>
      <div class="col3 pad1">
        <svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 220 220">
          <path d="M48.15,72.53L45.3,70.61l7.19-3.5-0.56,8L49.1,73.17A71.09,71.09,0,1,0,73.62,48.83l-0.59-1A72.36,72.36,0,1,1,48.15,72.53Z" class="ring outer cw" />
        </svg>
      </div>
      <div class="col3 pad1">
        <svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 400 400">
          <circle cx="204.02" cy="200" r="126.77" class="ring outer render"/>
        </svg>
      </div>
    </div>
    <div class="wo-block col12 clearfix">
      <div class="col6 pad1">Two rings with the same winding order will render as two unique polygons overlapping.<pre><code>Ring 1: Clockwise
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
      <div class="col6 pad1">Two rings, the first (exterior) ring is in clockwise order, while the second is counter-clockwise. This results in a "hole" in the final render.<pre><code>Ring 1: Clockwise
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
    <div class="wo-block col12 clearfix">
      <div class="col6 pad1">
        Partially overlapping rings in a multipolygon with different winding orders. The second, counter-clockwise ring will be filled outside of the polygon, but not within. This is a result of <strong>even-odd filling</strong> style.<pre><code>Ring 1: Clockwise
Ring 2: Counter-Clockwise</code></pre>
      </div>
      <div class="col3 pad1">
        <svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 220 220">
          <path d="M29.12,69.5l-2.85-1.92,7.19-3.5-0.56,8-2.83-1.91A71.09,71.09,0,1,0,54.58,45.8l-0.59-1A72.36,72.36,0,1,1,29.12,69.5Z" class="ring outer cw" />
          <path d="M112.06,104l-2.22,0,2.51,4.51L115,104l-2.2,0a45.87,45.87,0,1,1,4,21.93l-0.67.3A46.69,46.69,0,1,0,112.06,104Z" class="ring inner ccw" />
        </svg>
      </div>
      <div class="col3 pad1">
        <svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 220 220">
          <path d="M112.17,107A46.39,46.39,0,0,1,146.8,62.13a71.64,71.64,0,1,0,0,89.73A46.39,46.39,0,0,1,112.17,107Z" class="ring outer render" />
          <path d="M158.54,60.63a46.44,46.44,0,0,0-11.74,1.5,71.58,71.58,0,0,1,0,89.73A46.37,46.37,0,1,0,158.54,60.63Z" class="ring outer render" />
        </svg>
      </div>
    </div>
    <div class="wo-block col12 clearfix">
      <div class="col6 pad1">
        Three rings in a multipolygon that alternate winding order.<pre><code>Ring 1: Clockwise
Ring 2: Counter-Clockwise
Ring 3: Clockwise</code></pre>
      </div>
      <div class="col3 pad1">
        <svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 220 220">
          <path d="M41.08,68.25L37.91,66.1l8-3.91L45.3,71.09,42.14,69A79.21,79.21,0,1,0,69.46,41.83l-0.65-1.1A80.63,80.63,0,1,1,41.08,68.25Z" class="ring outer cw" />
          <path d="M43,106.48l-2.61,0,3,5.3,3.11-5.21-2.59,0a53.9,53.9,0,1,1,4.68,25.77l-0.79.36A54.86,54.86,0,1,0,43,106.48Z" class="ring inner ccw" />
          <path d="M98.93,80.81l0.61-1.49,2.3,3-3.71.51,0.6-1.48a33.24,33.24,0,1,0,13.5,8.87l0.39-.36A33.83,33.83,0,1,1,98.93,80.81Z" class="ring outer cw" />
        </svg>
      </div>
      <div class="col3 pad1">
        <svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 220 220">
          <path d="M110.19,30.67A79.33,79.33,0,1,0,189.53,110,79.33,79.33,0,0,0,110.19,30.67ZM97.43,164.81A54.81,54.81,0,1,1,152.24,110,54.81,54.81,0,0,1,97.43,164.81Z" class="ring outer render" />
          <circle cx="87.73" cy="112.71" r="33.81" class="ring outer render" />
        </svg>
      </div>
    </div>
  </div>
</div>


