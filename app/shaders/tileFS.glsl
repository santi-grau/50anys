#ifdef GL_ES
	precision highp float;
#endif

varying vec2 vUv;

uniform sampler2D texture;
uniform vec2 time;

void main( ){
	vec4 tex = texture2D(texture, vUv + time );
	gl_FragColor = tex;
}