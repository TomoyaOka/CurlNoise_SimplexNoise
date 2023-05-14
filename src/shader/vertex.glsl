#pragma glslify: curlNoise = require(glsl-curl-noise2)

float PI = 3.14159265;

void main() {
  vec3 pos = position;
  pos.x = curlNoise(pos.xy * 0.1) * 0.5;
  

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}