---
title: What the spec doesn't cover
id: null
---

This specification is very explicit in the way a vector tile should pack data. However, there are some related concepts that this specification does not cover.

### How to use vector tiles as a dataset

This specification IS NOT intended to explain how to use vector tiles as a dataset. This is something that has been considered for the future, but it will likely be a separate specification. This specification does not cover how to store, request, or share vector tiles. Consider this specification similar to how the PNG spec explains how to *pack data*.

### Simplification

The conversion from geographic coordinates (latitude and longitude) to vector tile coordinates (x, y) is an important step, but can be implemted in many different ways prior to vector tile encoding. It is not included in this specification, but there are some important GOTCHAs we'd like to point out.

<div class="col12">
  <div class="col5">
    <p><em>Invalid polygons</em><br>Simplification can cause invalid polygons according to the OGC standards by oversimplifying polygon rings to the point where their edges overlap. See below how simplifying one line changes the rendering of a polygon by pushing the interior ring outside of the exterior ring.</p>

    <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300" class="simplification-example">
      <g id="simp1" class="show">
        <path d="M267.53,102.13L220.72,45.34,172,29.73,42.27,65.48,25.69,189.32l84.46,34.2L182,273.12,254.42,240,275,177ZM171.81,219.89l-83.94-45.6L54.71,76.88,206,74.29l18.65,118.66Z" class="simp-geom simp-poly"/>
      </g>
      
      <g id="simp2">
        <polygon points="42.27 65.48 172.05 29.73 220.72 45.34 267.53 102.13 275.02 177.01 254.42 240.05 182.03 273.12 110.15 223.51 25.69 189.32 42.27 65.48" class="simp-geom simp-ring hide"/>
        <polygon points="54.71 76.88 87.87 174.29 171.81 219.89 224.66 192.94 206.01 74.29 54.71 76.88" class="simp-geom simp-ring hide"/>
      </g>

      <g id="simp3">
        <polygon points="172.05 29.73 220.72 45.34 267.53 102.13 275.02 177.01 254.42 240.05 182.03 273.12 110.15 223.51 25.69 189.32 172.05 29.73" class="simp-geom simp-ring hide"/>
        <polygon points="54.71 76.88 87.87 174.29 171.81 219.89 224.66 192.94 206.01 74.29 54.71 76.88" class="simp-geom simp-ring hide"/>
      </g>

      <g id="simp4">
        <polygon points="267.53 102.13 220.72 45.34 172.05 29.73 129.99 75.59 206.01 74.29 224.66 192.94 171.81 219.89 87.87 174.29 74.77 135.81 25.69 189.32 110.15 223.51 182.03 273.12 254.42 240.05 275.02 177.01 267.53 102.13" class="simp-geom simp-poly hide"/>
        <polygon points="54.71 76.88 74.77 135.81 129.99 75.59 54.71 76.88" class="simp-geom simp-poly hide"/>
        <!-- <polygon points="171.81 219.89 224.66 192.94 206.01 74.29 129.99 75.59 74.77 135.81 87.87 174.29 171.81 219.89" class="simp-geom simp-poly hide"/> -->
      </g>
    </svg>
  </div>
  <div class="col6 fr">
    <p><em>Flipped winding order</em><br>
    Simplifying a polygon can actually reverse the winding order. Consider a triangle polygon that is simplified to the vector tile grid. The simplified point can cross over the polygon and "flip" it, rendering its winding order reversed.</p>
  </div>
</div>