#ifdef GL_ES
	precision highp float;
#endif

varying vec2 vUv;

uniform vec2 repeat;
uniform vec2 offset;

void main() {
	vUv = uv * repeat + offset;
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}