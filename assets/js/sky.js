function GlCanvas(glcanvas) {
  this.canvas = glcanvas;
  this.gl = this.canvas.getContext("webgl");
  this.programInfo = null;
  this.isReady = false;
  this.init();
}

GlCanvas.prototype.init = function() {
  if (this.gl === null) {
    alert( "Unable to initialize WebGL. Your browser or machine may not support it." );
    return;
  }

  var path = '/assets/glsl/etoiles.glsl.js';
  try{
    import(path).then((e)=> { 
      this.initWebGl(e);
      if(this.programInfo) {
        this.isReady = true
      } else {
        console.log("Probleme chargement shader");
      }
    });
  } catch(err) {
    console.log(err.message);
  }
}

GlCanvas.prototype.initWebGl = function(e) {
  var vertexShader = this.loadShader(this.gl.VERTEX_SHADER, e.vertex);
  var fragmentShader = this.loadShader(this.gl.FRAGMENT_SHADER, e.fragment);
  var shaderProgram = this.gl.createProgram();
  this.gl.attachShader(shaderProgram, vertexShader);
  this.gl.attachShader(shaderProgram, fragmentShader);
  this.gl.linkProgram(shaderProgram);

  if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
    alert(
      `Unable to initialize the shader program: ${this.gl.getProgramInfoLog(
        shaderProgram
      )}`
    );
  }

  this.programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: this.gl.getAttribLocation(shaderProgram, "a_position"),
    },
    uniformLocations: {
      resolutionLocation: this.gl.getUniformLocation(shaderProgram, "u_resolution"),
      timeLocation: this.gl.getUniformLocation(shaderProgram, "u_time"),
    },
  };

  var positionBuffer = this.gl.createBuffer();
  this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
  this.gl.useProgram(shaderProgram);
}

GlCanvas.prototype.loadShader = function (type, source) {
  var shader = this.gl.createShader(type);

  // Send the source to the shader object
  this.gl.shaderSource(shader, source);

  // Compile the shader program
  this.gl.compileShader(shader);

  // See if it compiled successfully

  if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
    alert(
      `An error occurred compiling the shaders: ${this.gl.getShaderInfoLog(shader)}`
    );
    this.gl.deleteShader(shader);
    return null;
  }
  return shader;
}

GlCanvas.prototype.draw = function(elapsed) {
  this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
  this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
  this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  this.gl.enableVertexAttribArray(this.programInfo.attribLocations.vertexPosition);
  var x1 = 0;
  var x2 = this.gl.canvas.width;
  var y1 = 0;
  var y2 = this.gl.canvas.height;
  this.gl.bufferData(this.gl.ARRAY_BUFFER,
      new Float32Array([
          x1, y1,
          x2, y1,
          x1, y2,
          x1, y2,
          x2, y1,
          x2, y2,
      ]),
      this.gl.STATIC_DRAW);

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 2;          // 2 components per iteration
  var type = this.gl.FLOAT;   // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0;        // start at the beginning of the buffer
  this.gl.vertexAttribPointer(this.programInfo.attribLocations.vertexPosition, size, type, normalize, stride, offset);

  // Tell WebGL to use our program when drawing
  this.gl.useProgram(this.programInfo.program);
  // set the resolution
  this.gl.uniform2f(this.programInfo.uniformLocations.resolutionLocation, this.gl.canvas.width, this.gl.canvas.height);
  this.gl.uniform1f(this.programInfo.uniformLocations.timeLocation, elapsed);    
  this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 6);
}

export default GlCanvas;