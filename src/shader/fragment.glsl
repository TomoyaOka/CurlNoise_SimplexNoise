precision mediump float;
uniform float uColorR;
uniform float uColorG;
uniform float uColorB;

void main() {
    vec2 temp = gl_PointCoord - vec2(0.8);
          float f = dot(temp, temp);
          if (f > 0.8 ) {
              discard;
          }
      gl_FragColor = vec4(uColorR, uColorG, uColorB, 1.0);
    }