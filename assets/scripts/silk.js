var Ball = function (uid, x,y,z,vx,vy,vz, block, grid) {
this.uid = uid;

this.x = x;
this.y = y;
this.z = z;

this.block = block;
this.grid = grid;

this.vx = vx;
this.vy = vy;
this.vz = vz;

this.i = 0;
this.j = 0;
};

Ball.prototype = {
interpolateXBlock: function () {
return Math.floor(this.x/this.block.width);
},
interpolateYBlock: function () {
return Math.floor(this.y/this.block.height);
},
displace: function () {
this.x += this.vx;
this.y += this.vy;
// this.z += this.vz;
},
displaceWithOverflow: function () {
var nx = this.x + this.vx;
if (nx < 0 || this.block.container_width < nx) {
  this.vx *= -1;
}

var ny = this.y + this.vy;
if (ny < 0 || this.block.container_height < ny) {
  this.vy *= -1;
}


this.displace();
},
deleteBlock: function (i, j) {
delete this.grid[i][j].objects[this.uid];
},
updateBlock: function (i, j) {
this.i = i;
this.j = j;
this.grid[i][j].objects[this.uid] = this;
},
processBlock: function () {
var old_i = this.i;
var old_j = this.j;

var i = this.interpolateXBlock();
var j = this.interpolateYBlock();
var updated = false;

if (i !== this.i) {
  updated = true;
}

if (j !== this.j) {
  updated = true;
}

if (updated) {
  this.deleteBlock(old_i, old_j);
  this.updateBlock(i, j);
}
},
step: function () {
if (grid[this.i][this.j].edge) {
  this.displaceWithOverflow();
} else {
  this.displace();
}

this.processBlock();
}
};

// Prepare the particle bitman
var particle = document.createElement('canvas');
particle.width = 6;
particle.height = 6;

var pctx = particle.getContext('2d');
pctx.arc(3, 3, 3, 0, 2*Math.PI, false);
pctx.fillStyle = 'rgba(255,255,255,0.4)';
pctx.fill();

var grid = [];
var block = {
columns: 40,
rows: 40,
width: null,
height: null
};

// Bootstrap the zgrid values
block.container_width = $(window).width();
block.container_height = $(window).height()*0.75;
block.width = $(window).width() / block.columns;
block.height = ($(window).height()*0.75) / block.rows;

// Set the dimensions of the canvas
$('#canvas').attr('height', block.container_height)
.attr('width', block.container_width);

// Bootstrap the Grid
for (var i = 0; i < block.columns; i++) {
grid[i]= [];
for (var j = 0; j < block.rows; j++) {
grid[i][j] = {
  objects: {},
  edge: false
};

if (i === 0 || j === 0 || j === (block.rows - 1) || i === (block.columns - 1)) {
  grid[i][j].edge = true;
}
}
}

var cctx = $('#canvas')[0].getContext('2d');

var num_particles = 80;
var particles = [];

for (var n = 0; n < num_particles; n++) {
var ball = new Ball(
n,
Math.abs(Math.random())*block.container_width, //x
Math.abs(Math.random())*block.container_height, //y
Math.abs(Math.random())*block.container_height, //z
-1+Math.random()*2, //vx
-1+Math.random()*2, //vy
-1+Math.random()*2, //vz
block,
grid
);

ball.updateBlock(
ball.interpolateXBlock(),
ball.interpolateYBlock()
);

particles.push(ball);
}

var radius = 100;
var sqrad = radius*radius;
var horizontal = Math.ceil(radius/block.width);
var vertical = Math.ceil(radius/block.height);

var cx = true;

var render = function () {

cctx.clearRect(0, 0, block.container_width, block.container_height);
for (var n = 0; n < particles.length; n++) {
var ball = particles[n];
ball.step();

var lefter = ball.i - horizontal;
lefter = lefter < 0 ? 0 : lefter;

var righter = ball.i + 1;
righter = righter > block.columns ? block.columns : righter;

var topper = ball.j - vertical;
topper = topper < 0 ? 0 : topper;

var bottomer = ball.j + vertical + 1;
bottomer = bottomer > block.rows ? block.rows : bottomer;

for (var i = lefter; i < righter; i++) {
  for (var j = topper; j < bottomer; j++) {
    for (var uid in grid[i][j].objects) {
      var dest = grid[i][j].objects[uid];
      var distance = Math.pow(ball.x - dest.x,2) + Math.pow(ball.y - dest.y,2);
      if (distance < sqrad) {

      } else {
        continue;
      }

      cctx.beginPath();

      cctx.strokeStyle = 'rgba(255, 255, 255, ' + (1-(distance/sqrad))*0.5 + ')';

      cctx.moveTo(ball.x + 3, ball.y + 3);
      cctx.lineTo(dest.x + 3, dest.y + 3);

      cctx.closePath();
      cctx.stroke();
    }
  }
}

cctx.drawImage(particle, ball.x, ball.y);
}

requestAnimationFrame(render);
};

function test () {
for (var i = 0; i < block.rows; i++) {
var line = '';
for (var j = 0; j < block.columns; j++) {
  line += grid[j][i].edge ? '1' : ' ';
}
}
}

render();
