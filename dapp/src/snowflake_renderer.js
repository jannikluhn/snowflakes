import chroma from 'chroma-js'

const vertexShaderSource = `#version 300 es

in vec2 a_pos;
in vec4 a_col;

uniform vec2 u_viewport;
uniform float u_mirror;
uniform float u_angle;

out vec4 vert_col;

void main() {
  mat2 refl = mat2(
    1.0, 0.0,
    0.0, u_mirror
  );
  mat2 rot = mat2(
    cos(u_angle), -sin(u_angle),
    sin(u_angle), cos(u_angle)
  );
  vec2 p = rot * refl * (a_pos / u_viewport * 2.0 - 1.0);

  gl_Position = vec4(p, 0.0, 1.0);
  vert_col = a_col;
}
`

const fragmentShaderSource = `#version 300 es

precision highp float;

in vec4 vert_col;
out vec4 frag_col;

void main() {
	frag_col = vec4(vert_col);
}`

const colorScale = chroma.scale(["#FFFFFF", "#b3dfff"]).mode('lab')

class SnowflakeRenderer {
  constructor(canvas) {
    this.canvas = canvas
    this.gl = null

    this.program = null
    this.viewportLocation = null
    this.angleLocation = null
    this.mirrorLocation = null
    this.positionLocation = null
    this.colorLocation = null

    this.vao = null
    this.vbo = null
    this.numVertices = 0
  }

  init() {
    this.gl = this.canvas.getContext("webgl2")

    this.program = buildProgram(this.gl)
    this.viewportLocation = this.gl.getUniformLocation(this.program, 'u_viewport')
    this.angleLocation = this.gl.getUniformLocation(this.program, 'u_angle')
    this.mirrorLocation = this.gl.getUniformLocation(this.program, 'u_mirror')
    this.positionLocation = this.gl.getAttribLocation(this.program, 'a_pos')
    this.colorLocation = this.gl.getAttribLocation(this.program, 'a_col')

    this.vao = this.gl.createVertexArray()
    this.vbo = this.gl.createBuffer()

    this.gl.bindVertexArray(this.vao)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo)
    this.gl.enableVertexAttribArray(this.positionLocation)
    this.gl.vertexAttribPointer(this.positionLocation, 2, this.gl.FLOAT, false, 6 * 4, 0)
    this.gl.enableVertexAttribArray(this.colorLocation)
    this.gl.vertexAttribPointer(this.colorLocation, 4, this.gl.FLOAT, false, 6 * 4, 2 * 4)
  }

  fillBuffer(cells, maxCellValue, size) {
    const width = this.canvas.getBoundingClientRect().width
    let bufferData = getBufferDataFromCells(cells, maxCellValue, size, width)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, bufferData, this.gl.STATIC_DRAW);
    this.numVertices = bufferData.length / 6
  }

  draw() {
    const width = this.canvas.getBoundingClientRect().width;
    this.gl.viewport(0, 0, width, width)
    this.gl.clearColor(0, 0, 0, 0)
    this.gl.clear(this.gl.COLOR_BUFFER_BIT)

    this.gl.useProgram(this.program)

    this.gl.bindVertexArray(this.vao)
    this.gl.uniform2f(this.viewportLocation, width, width)

    for (let i = 0; i < 6; i++) {
      this.gl.uniform1f(this.angleLocation, i * Math.PI / 3)
      this.gl.uniform1f(this.mirrorLocation, 1)
      this.gl.drawArrays(this.gl.TRIANGLES, 0, this.numVertices)
      this.gl.uniform1f(this.mirrorLocation, -1)
      this.gl.drawArrays(this.gl.TRIANGLES, 0, this.numVertices)
    }

  }
}

function compileShader(gl, source, type) {
  let shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.log(`Error compiling shader:`);
    console.log(gl.getShaderInfoLog(shader));
  }
  return shader;
}

function buildProgram(gl) {
  let program = gl.createProgram()
  let vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER)
  let fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER)
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.log("Error linking program:");
    console.log(gl.getProgramInfoLog(program));
  }
  return program
}

function getBufferDataFromCells(cells, maxCellValue, size, width) {
  let radius = width / (size * 2 + 1) / 2
  let bufferData = new Float32Array(cells.length * 4 * 3 * 6)

  let origin = [width / 2, width / 2]
  let vertex = 0
  for (let i = 0; i < cells.length; i++) {
    let centerHex = [cells[i][0], cells[i][1]]
    let centerCart = hexToCart(centerHex, radius, origin)
    let corners = hexCorners(centerCart, radius)
    let vertices = hexCornersToVertices(corners)

    let value = cells[i][2]
    let color = getCellColor(value, maxCellValue)

    for (let j = 0; j < vertices.length; j++) {
      bufferData[vertex * 6 + 0] = vertices[j][0]
      bufferData[vertex * 6 + 1] = vertices[j][1]
      bufferData[vertex * 6 + 2] = color[0]
      bufferData[vertex * 6 + 3] = color[1]
      bufferData[vertex * 6 + 4] = color[2]
      bufferData[vertex * 6 + 5] = color[3]
      vertex++
    }
  }

  return bufferData
}

function getCellColor(v, maxV) {
  if (v >= 1) {
    let c = colorScale((v - 1) / (maxV - 1)).gl()
    c.push(1)
    return c
  } else {
    return [0, 0, 0, 0]
  }
}

function hexToCart(coords, r, origin) {
    let x1 = 1
    let y1 = 0
    let x2 = Math.cos(Math.PI / 3)
    let y2 = -Math.sin(Math.PI / 3)
    let x = (x1 * coords[0] + x2 * coords[1]) * 2 * r
    let y = (y1 * coords[0] + y2 * coords[1]) * 2 * r
    return [x + origin[0], y + origin[1]]
}

function hexCorners(center, r) {
    let t = r / Math.cos(Math.PI / 6)
    return [
        [center[0] + r, center[1] + t / 2],
        [center[0] + 0, center[1] + t],
        [center[0] - r, center[1] + t / 2],
        [center[0] - r, center[1] - t / 2],
        [center[0], center[1] - t],
        [center[0] + r, center[1] - t / 2],
    ]
}

function hexCornersToVertices(corners) {
  return [
    corners[0],
    corners[1],
    corners[5],
    corners[1],
    corners[2],
    corners[5],
    corners[2],
    corners[4],
    corners[5],
    corners[2],
    corners[3],
    corners[4],
  ]
}

export {
  SnowflakeRenderer,
}