window.onerror = function(e, u, l) {
  alert(`error: ${e}
URL: ${u}
line: ${l}`)
}

var keysDown = []
addEventListener("keydown", e =>
  keysDown[e.keyCode] = true)
addEventListener("keyup", e =>
  keysDown[e.keyCode] = false)

var canvas = document.querySelector("canvas")
canvas.width = canvas.offsetWidth
canvas.height = canvas.offsetHeight
var dx = canvas.width / 2
var dy = canvas.height / 2
// Objects style
var ctx = canvas.getContext("2d")
ctx.strokeStyle = "rgba(0, 0, 0, 1)"
ctx.fillStyle = "rgba(255, 255, 255, 1)"

var player = {
  x: 0,
  y: 0,
  z: 0,
  vx: 0,
  vy: 0,
  vz: 0,
  ax: 0,
  ay: 0,
  az: 0,
  r: 0,
  rs: 0.5,
  step(secs) {
    vx += ax * secs
    vy += ay * secs
    vz += az * secs
    
    x += vx * secs
    y += vy * secs
    z += vz * secs
  }
}

var Vertex = function(x, y, z) {
  this.x = parseFloat(x)
  this.y = parseFloat(y)
  this.z = parseFloat(z)
}
var Vertex2D = function(x, y) {
  this.x = parseFloat(x)
  this.y = parseFloat(y)
}
var Cube = function(center, side) {
  this.center = center
  // Generate the vertices
  var d = side / 2

  this.vertices = [
    new Vertex(center.x - d, center.y - d, center.z + d),
    new Vertex(center.x - d, center.y - d, center.z - d),
    new Vertex(center.x + d, center.y - d, center.z - d),
    new Vertex(center.x + d, center.y - d, center.z + d),
    new Vertex(center.x + d, center.y + d, center.z + d),
    new Vertex(center.x + d, center.y + d, center.z - d),
    new Vertex(center.x - d, center.y + d, center.z - d),
    new Vertex(center.x - d, center.y + d, center.z + d)
  ]

  // Generate the faces
  this.faces = [
    [this.vertices[0], this.vertices[1], this.vertices[2], this.vertices[3]],
    [this.vertices[3], this.vertices[2], this.vertices[5], this.vertices[4]],
    [this.vertices[4], this.vertices[5], this.vertices[6], this.vertices[7]],
    [this.vertices[7], this.vertices[6], this.vertices[1], this.vertices[0]],
    [this.vertices[7], this.vertices[0], this.vertices[3], this.vertices[4]],
    [this.vertices[1], this.vertices[6], this.vertices[5], this.vertices[2]]
  ]
}
var d = 200
function project(M) {
  // Distance between the camera and the plane
  var r = d / M.y

  return new Vertex2D(r * M.x, r * M.z)
}
function render(objects, ctx, dx, dy) {
  ctx.clearRect(0, 0, 2 * dx, 2 * dy)

  objects.forEach(object => {
    object.faces.forEach(face => {
      var P = project(face[0])
      ctx.beginPath()
      ctx.moveTo(P.x + dx, -P.y + dy)
      face.slice[1].forEach(() => {
        P = project(face[k])
        ctx.lineTo(P.x + dx, -P.y + dy)
      })
      ctx.closePath()
      ctx.stroke()
      ctx.fill()
    })
  })
}
(function() {
  // Fix the canvas width and height
  

  // First render
  render(objects, ctx, dx, dy)

  // Events
  var mousedown = false
  var mx = 0
  var my = 0

  canvas.addEventListener("mousedown", initMove)
  document.addEventListener("mousemove", move)
  document.addEventListener("mouseup", stopMove)

  // Rotate a vertice
  function rotate(M, center, theta, phi) {
        // Rotation matrix coefficients
      var ct = Math.cos(theta)
      var st = Math.sin(theta)
      var cp = Math.cos(phi)
      var sp = Math.sin(phi)

    // Rotation
    var x = M.x - center.x
    var y = M.y - center.y
    var z = M.z - center.z

    M.x = ct * x - st * cp * y + st * sp * z + center.x
    M.y = st * x + ct * cp * y - ct * sp * z + center.y
    M.z = sp * y + cp * z + center.z
  }

  // Initialize the movement
  function initMove(evt) {
    clearTimeout(autorotate_timeout)
    mousedown = true
    mx = evt.clientX
    my = evt.clientY
  }

  function move(evt) {
    if (mousedown) {
      var theta = (evt.clientX - mx) * Math.PI / 360
      var phi = (evt.clientY - my) * Math.PI / 180

      for (var i = 0 i < 8 ++i)
        rotate(cube.vertices[i], cube_center, theta, phi)

      mx = evt.clientX
      my = evt.clientY

      render(objects, ctx, dx, dy)
    }
  }

  function stopMove() {
    mousedown = false
    autorotate_timeout = setTimeout(() => objects.map(autorotate), 2000)
  }

  function autorotate() {
    for (var a = 0 a < objects.length a++)
      for (var i = 0 i < 8 ++i)
        rotate(objects[a].vertices[i], objects[a].center, -Math.PI / 720, Math.PI / 720)

    render(objects, ctx, dx, dy)

    autorotate_timeout = setTimeout(autorotate, 30)
  }
  autorotate_timeout = setTimeout(autorotate, 2000)
})

// Create the cube
var cube_center = new Vertex(0, 11 * dy / 10, 0)
var other_cube_center = new Vertex(200, 11 * dy / 10, 0)
var cube = new Cube(cube_center, dy)
var otherCube = new Cube(other_cube_center, dy)
var objects = [cube, otherCube]

function main() {
  update(objects)
  render(objects, ctx, dx, dy)
  requestAnimationFrame(main)
}

main()
