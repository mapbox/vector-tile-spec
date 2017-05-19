---
title: Encoding attributes
id: encoding-attr
---

Attributes are encoded in a series of `tag`s that exist within a feature in the vector that have integer values that reference `keys` and `values` designating the original key:value pairs from the geometry. For large geometry, this removes redundancy for attributes that have the same keys and similar values.

<div id="js-example-encoding" class="js-example clearfix">
  <div class="js-example-header">
    <h3>Encoding attributes</h3>
    <p>Take a look at the original geojson <code>FeatureCollection</code> on the left and see how it's individual parts are encoded into the proper <code>tags</code> of the vector tile protobuf. Hover over the features and the properties of the GeoJSON.</p>
  </div>

  <div class="js-example-body col12">
    <div class="col6 pad1"><strong>Original geojson</strong><br><br><pre><code>{
  "type": "FeatureCollection",
    "features": [
    <span class='feature' data-feat='1'>{
  "geometry": { ... },
  "type": "Feature",
  "properties": {
    <span class='attr gj' data-attr='1' data-key='hello' data-value='world'>"hello": "world",</span>
    <span class='attr gj' data-attr='2' data-key='h' data-value='world'>"h": "world",</span>
    <span class='attr gj' data-attr='3' data-key='count' data-value='1.23'>"count": 1.23</span>
  }
},</span>
    <span class='feature' data-feat='2'>{
  "geometry": { ... },
  "type": "Feature",
  "properties": {
    <span class='attr gj' data-attr='4' data-key='hello' data-value='again'>"hello": "again",</span>
    <span class='attr gj' data-attr='5' data-key='count' data-value='2'>"count": 2</span>
  }
}</span>
  ]
}
</code></pre></div>
    <div class="col6 pad1"><strong>Final vector tile<br><br></strong><pre><code>layers {
  version: 2
  name: "points"
  <span class='feat' id='feat1'>features: {
    id: 1
    <span class='tagset' id='attr1'><span class='tag-key'>tags: 0</span>
<span class='tag-value'>tags: 0</span></span>
    <span class='tagset' id='attr2'><span class='tag-key'>tags: 1</span>
<span class='tag-value'>tags: 0</span></span>
    <span class='tagset' id='attr3'><span class='tag-key'>tags: 2</span>
<span class='tag-value'>tags: 1</span></span>
    type: Point
    geometry: ...
  }</span>
  <span class='feat' id='feat2'>features {
    id: 1
    <span class='tagset' id='attr4'><span class='tag-key'>tags: 0</span>
<span class='tag-value'>tags: 2</span></span>
    <span class='tagset' id='attr5'><span class='tag-key'>tags: 2</span>
<span class='tag-value'>tags: 3</span></span>
    type: Point
    geometry: ...
  }</span>
  <span class='key' id='key-hello'>keys: "hello"</span>
  <span class='key' id='key-h'>keys: "h"</span>
  <span class='key' id='key-count'>keys: "count"</span>
  <span class='value' id='value-world'>values: {
    string_value: "world"
  }</span>
  <span class='value' id='value-1.23'>values: {
    double_value: 1.23
  }</span>
  <span class='value' id='value-again'>values: {
    string_value: "again"
  }</span>
  <span class='value' id='value-2'>values: {
    int_value: 2
  }</span>
  extent: 4096
}
      
</code></pre></div>
  </div>
</div>