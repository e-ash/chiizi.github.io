var canvas = document.querySelector("#frame");
var ctx = canvas.getContext("2d");

var keysDown = {};
addEventListener("keydown", e => keysDown[e.keyCode] = true);
addEventListener("keyup", e => delete keysDown[e.keyCode]);

var player = {
  x: 0,
  y: 0,
  w: 32,
  h: 32,
  color: "#000",
  speedx: 0,
  speedy: 0,
  accel: 128 / 60,
  accely: 32,
  gravity: 12,
  inAir: function() {return this.y > 0},
  jump: function() {
    this.speedy = this.accely;
  },
  jumpQueued: false
};

var update = function(o) {
  if (o.inAir()) {
    if (32 in keysDown) {
      o.jumpQueued = true;
    }
  } else {
    if (o.jumpQueued || 32 in keysDown) {
      o.jump();
      o.jumpQueued = false;
    }
    if (37 in keysDown) {
      o.speedx -= o.accel;
    } else if (39 in keysDown) {
      o.speedx += o.accel;
    } else {
      o.speedx /= 1.2;
    }
  }
  o.y += o.speedy - o.gravity;
  o.speedy /= 1.2;
  o.x += o.speedx;
  o.y = Math.max(0, o.y);
};

var render = function(o) {
  ctx.fillStyle = o.color;
  ctx.fillRect(o.x, canvas.height - o.y - o.h, o.w, o.h);
};

var main = function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  update(player);
  render(player);
  
  requestAnimationFrame(main);
};

main();