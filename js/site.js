var cellSize = 15,
    tilesize = 12,
    padding = 1,
    buffer = 2,
    buffx = padding + (buffer * cellSize),
    stepCount = 0,
    btn,
    title = document.getElementById('vt-title'),
    desc = document.getElementById('vt-description'),
    command = document.getElementById('vt-command'),
    commandSteps = document.getElementById('vt-command-steps'),
    ctx,
    grid;

window.onload = function() {
  grid = document.getElementById('grid');
  makeGrid(grid, tilesize, buffer);
  btn = document.getElementById('vt-next');
  btn.onclick = function() {
    next(stepCount);
  };

  // attr encoding example
  var feats = document.getElementsByClassName('feature');
  for (var f = 0; f < feats.length; f++) {
    feats[f].addEventListener('mouseenter', function() {
      // get id
      var id = this.getAttribute('data-feat');
      var feat = document.getElementById('feat'+id);
      feat.className += ' highlight';
    });

    feats[f].addEventListener('mouseleave', function() {
      var pbffeats = document.getElementsByClassName('feat');
      removeHighlights(pbffeats);
    });
  }

  var attrs = document.getElementsByClassName('attr');
  for (var a = 0; a < attrs.length; a++) {
    attrs[a].addEventListener('mouseover', function() {

      // get attr id
      var id = this.getAttribute('data-attr');
      // get key value
      var key = this.getAttribute('data-key');
      // get value value
      var value = this.getAttribute('data-value');

      // find all tags that match prop
      var tagset = document.getElementById('attr'+id);
      tagset.className += ' highlight';

      // find pbf key representation
      var pbfkey = document.getElementById('key-'+key);
      pbfkey.className += ' highlight';

      // find pbf value representation
      var pbfvalue = document.getElementById('value-'+value);
      pbfvalue.className += ' highlight';
    });

    attrs[a].addEventListener('mouseout', function() {
      var tagsets = document.getElementsByClassName('tagset');
      removeHighlights(tagsets);
      var pbfkeys = document.getElementsByClassName('key');
      removeHighlights(pbfkeys);
      var pbfvalues = document.getElementsByClassName('value');
      removeHighlights(pbfvalues);
    });
  }

  // simplification & invalid polygon examples
  setInterval(function() {
    rotateInvalids();
  }, 2000);
};

var invalidStep = 2;
function rotateInvalids() {
  console.log(invalidStep);
  try {
    // show this one
    var invalid = document.getElementById('simp'+invalidStep);
    invalid.setAttribute('class', ' show');
    console.log(invalid);

    // hide previous
    var p = (invalidStep == 1) ? 4 : invalidStep - 1;
    var prev = document.getElementById('simp'+p);
    prev.setAttribute('class', '');

    // increment
    invalidStep++;
  } catch (err) {
    invalidStep = 1;
  }
}

function removeHighlights(array) {
  for (var i = 0; i < array.length; i++) {
    array[i].className = array[i].className.replace(' highlight', '');
  }
}

// elem is a DOM selected element
// size is number of cells width and height
// buffer in number of cells
function makeGrid(canvas, size, buffer) {
  // each cell is 10x10 pixels
  ctx = canvas.getContext("2d");
  ctx.canvas.width = cellSize * (size + buffer) + padding;
  ctx.canvas.height = cellSize * (size + buffer) + padding;
  drawGrid(ctx, size, buffer);
}

function drawGrid(c, size, buff) {
  for (x = padding; x <= c.canvas.width + padding; x+=cellSize) {
    for (y = padding; y <= c.canvas.height + padding; y+=cellSize) {
      if (x < (padding + buff * cellSize) ||
          y < (padding + buff * cellSize) ||
          x-cellSize > ((cellSize * size + (padding * 2)) - (buff * cellSize)) ||
          y-cellSize > ((cellSize * size + (padding * 2)) - (buff * cellSize))) {
        c.fillStyle='#e5e5e5';
        c.fillRect(x-0.5, y-0.5, cellSize, cellSize);
      }

      c.strokeStyle='#666666';
      c.strokeRect(x-0.5, y-0.5, cellSize, cellSize);
    }
  }
}

function next(index) {
  ctx.clearRect(0, 0, grid.width, grid.height);
  makeGrid(grid, tilesize, buffer);
  
  var s = steps[index];
  try {
    title.innerHTML = s.name;
    desc.innerHTML = s.description;
    command.innerHTML = s.commandx;
    btn.innerHTML = s.buttonText;

    // draw all steps since
    for (var c = 0; c <= stepCount; c++) {
      steps[c].command();
    }
    // then draw the single pen
    s.pen();
    
    addStep(s.commandx, s.color);
    stepCount++;
  } catch (err) {
    title.innerHTML = 'Step 0';
    desc.innerHTML = 'The vector tile to the left is a 10x10 grid with 2 cell buffer. Let\'s encode some geometry to the grid starting with a <span class="poly blue">blue polygon</span>. The following commands will be relative to the <span class="poly black">pen</span> (black dot).';
    command.innerHTML = 'An empty vector tile';
    btn.innerHTML = 'Next step';
    commandSteps.innerHTML = '';
    stepCount=0;
  }
}

function addStep(cmd, color) {
  var elem = document.createElement('div');
  elem.className = 'command-step';
  elem.style.color = color;
  elem.innerHTML = cmd;
  commandSteps.appendChild(elem);
}

var cmd = {
  "mt": function(x, y) {
    ctx.moveTo(buffx + (cellSize*x), buffx + (cellSize*y));
  },
  "lt": function(x, y) {
    ctx.lineTo(buffx + (cellSize*x), buffx + (cellSize*y));
  },
  "pen": function(x, y) {
    ctx.fillStyle = '#333333';
    ctx.beginPath();
    ctx.arc(buffx + (cellSize*x), buffx + (cellSize*y), 3, 0, 2*Math.PI);
    ctx.fill();
  }
};

function ctxClear() {
  ctx.clearRect(0, 0, grid.width, grid.height);
}

var steps = [
  {
    "name": "Step 1",
    "color": "#0074D9",
    "description": "The first action when encoding a polygon is to point the command to a starting point. This uses the <code>MoveTo(x,y)</code> command. The <span class='poly black'>pen</span> is at <code>2, 2</code> starting at the top left of the grid.",
    "commandx": "MoveTo(1,2)",
    "buttonText": "Next step",
    "command": function() {},
    "pen": function() {
      cmd.pen(1,2);
    }
  },
  {
    "name": "Step 2",
    "color": "#0074D9",
    "description": "In order to move from a starting position, we use a <code>LineTo(x,y)</code> command. The X and Y values are relative to the previous command, rather than the origin of the grid, to keep file size down.",
    "commandx": "LineTo(3,-1)",
    "buttonText": "Next step",
    "command": function() {
      ctx.strokeStyle = this.color;
      ctx.beginPath();
      cmd.mt(1,2);
      cmd.lt(4,1);
      ctx.stroke();
    },
    "pen": function() {
      cmd.pen(4,1);
    }
  },
  {
    "name": "Step 3",
    "color": "#0074D9",
    "description": "Drawing another path of the <span class='poly blue'>blue polygon</span>.",
    "commandx": "LineTo(3,4)",
    "buttonText": "Next step",
    "command": function() {
      ctx.strokeStyle = this.color;
      ctx.beginPath();
      cmd.mt(4,1);
      cmd.lt(7,5);
      ctx.stroke();
    },
    "pen": function() {
      cmd.pen(7,5);
    }
  },
  {
    "name": "Step 4",
    "color": "#0074D9",
    "description": "Drawing another path of the <span class='poly blue'>blue polygon</span>.",
    "commandx": "LineTo(-4,2)",
    "buttonText": "Next step",
    "command": function() {
      ctx.strokeStyle = this.color;
      ctx.beginPath();
      cmd.mt(7,5);
      cmd.lt(3,7);
      ctx.stroke();
    },
    "pen": function() {
      cmd.pen(3,7);
    }
  },
  {
    "name": "Step 5",
    "color": "#0074D9",
    "description": "Finally, we close a path. This uses the <code>ClosePath()</code> command that closes the path to most recently used <code>MoveTo(x,y)</code> command, which is our starting point.<br><br>This DOES NOT move the <span class='poly black'>pen</span>.",
    "commandx": "ClosePath()",
    "buttonText": "Next step",
    "command": function() {
      ctx.strokeStyle = this.color;
      ctx.beginPath();
      cmd.mt(3,7);
      cmd.lt(1,2);
      ctx.stroke();
    },
    "pen": function() {
      cmd.pen(3,7);
    }
  },
  {
    "name": "Step 6",
    "color": "#FF4136",
    "description": "Now on to the <span class='poly red'>red polygon</span>. This requires another <code>MoveTo</code> command relative to the last <code>LineTo</code> of the previous polygon.",
    "commandx": "MoveTo(1,-5)",
    "buttonText": "Next step",
    "command": function() {},
    "pen": function() {
      cmd.pen(4,2);
    }
  },
  {
    "name": "Step 7",
    "color": "#FF4136",
    "description": "Since the <span class='poly red'>red polygon</span> is technically a \"hole\" of the <span class='poly blue'>blue polygon</span> it is considered an <em>interior ring</em>. The Mapbox Vector Tile Specification requires this interior ring to be drawn counter-clockwise, opposite of the <span class='poly blue'>blue polygon</span>.",
    "commandx": "LineTo(-1,2)",
    "buttonText": "Next step",
    "command": function() {
      ctx.strokeStyle = this.color;
      ctx.beginPath();
      cmd.mt(4,2);
      cmd.lt(3,4);
      ctx.stroke();
    },
    "pen": function() {
      cmd.pen(3,4);
    }
  },
  {
    "name": "Step 7",
    "color": "#FF4136",
    "description": "Another addition to the <span class='poly red'>red polygon</span>.",
    "commandx": "LineTo(2,1)",
    "buttonText": "Next step",
    "command": function() {
      ctx.strokeStyle = this.color;
      ctx.beginPath();
      cmd.mt(3,4);
      cmd.lt(5,5);
      ctx.stroke();
    },
    "pen": function() {
      cmd.pen(5,5);
    }
  },
  {
    "name": "Step 7",
    "color": "#FF4136",
    "description": "Finally, we close the <span class='poly red'>red polygon</span> by drawing back to the most recent <code>MoveTo()</code> command.",
    "commandx": "ClosePath()",
    "buttonText": "Next step",
    "command": function() {
      ctx.strokeStyle = this.color;
      ctx.beginPath();
      cmd.mt(5,5);
      cmd.lt(4,2);
      ctx.stroke();
    },
    "pen": function() {
      cmd.pen(5,5);
    }
  },
  {
    "name": "Fin.",
    "color": "#FF4136",
    "description": "Encoding is complete! Now if we render the vector tile, you'll notice the <span class='poly blue'>blue polygon</span> has a hole (interior ring) represented by the <span class='poly red'>red polygon</span>'s opposite winding order.<br><br>Encoding a single vector tile into <code>.mvt</code> format happens quickly with tools like Mapnik or Node Mapnik. It's important to keep in mind that geometry coordinates are translated into non-geographic vector grid coordinates, which results in some simplification. In order to reduce the visual impact, vector tiles are rendered to a maximum zoom level. Once you hit that zoom level, another tile is loaded with more detail.",
    "commandx": "",
    "buttonText": "Start over",
    "command": function() {
      grid.style.opacity = 0;
      // clear canvas
      setTimeout(function() {
        ctxClear();

        // draw border
        ctx.fillRect(padding, padding, ctx.canvas.width, ctx.canvas.height);

        // draw blue square
        ctx.fillStyle = '#0074D9';
        ctx.beginPath();
        cmd.mt(1,2);
        cmd.lt(4,1);
        cmd.lt(7,5);
        cmd.lt(3,7);
        ctx.closePath();
        ctx.fill();

        // draw blue square
        ctx.fillStyle = '#e5e5e5';
        ctx.beginPath();
        cmd.mt(4,2);
        cmd.lt(3,4);
        cmd.lt(5,5);
        ctx.closePath();
        ctx.fill();

        // set opacity back on canvas
        grid.style.opacity = 1;
      }, 1200);
      // draw border OR transparent grid
      // draw blue square, fill blue
      // draw red square, fill white
    },
    "pen": function() {}
  },
];