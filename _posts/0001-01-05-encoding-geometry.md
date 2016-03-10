---
title: Encoding geometry
id: encoding-geom
---

To encode geographic information into a vector tile a tool must convert geographic coordinates, such as latitude and longitude, into vector tile grid coordinates. Vector tiles hold no concept of geographic information. They encode points, lines, and polygons as `x`,`y` pairs relative to the top left of the grid in a right-down manner.

Vector tiles do not store spatial information as we know it. Each vector tile is a grid

<div id="js-example-encoding" class="js-example clearfix">
  <div class="js-example-header">
    <h3>Encoding example</h3>
    <p>This is a step-by-step example showing how a single vector tile encodes geometry in the grid. It follows the commands of the "pen" to encode two rings.</p>
  </div>

  <div class="js-example-body">
    <div id="visuals">
      <canvas id="grid"></canvas>
      <h4>Commands</h4>
      <pre><code id="vt-command-steps"></code></pre>
    </div>
    <button id="vt-next" class="button fill-green rcon next">Next step</button>
    <div id="vt-info">
      <h4 id="vt-title">Step 0</h4>
      <p id="vt-command">An empty vector tile</p>
      <p id="vt-description">The vector tile to the left is a 10x10 grid with 2 cell buffer. Let's encode some geometry to the grid. Let's start with the <span class="poly blue">blue polygon</span>.</p>
    </div>
  </div>
</div>