#ifdef GL_ES
	precision highp float;
#endif

varying vec2 vUv;

uniform sampler2D texture;
uniform vec2 time;
uniform vec4 col1;
uniform vec4 col2;

void main( ){
	vec4 tex = texture2D(texture, vUv + time );
	gl_FragColor = col1 * tex.a + col2 * ( 1.0 - tex.a );
}