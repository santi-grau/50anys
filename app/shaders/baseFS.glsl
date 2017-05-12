#ifdef GL_ES
	precision highp float;
#endif

uniform sampler2D texture;
varying vec2 vUv;
uniform vec2 time;
varying vec2 resolution;

void main( ){
	vec4 tex = texture2D(texture, vUv + time );
	gl_FragColor = tex;
}