#ifdef GL_ES
	precision highp float;
#endif

varying vec2 vUv;

uniform sampler2D texture;
uniform vec2 time;
uniform vec2 resolution;

void main( ){

	vec2 uv = gl_FragCoord.xy / resolution.xy;

	vec4 tex = texture2D(texture, vec2( 0.1, vUv.y * 0.1 ) + time );

	float a = 0.3;
	if( vUv.x > tex.r) a = 1.0;
	gl_FragColor = vec4(vec3(0.0),a);
}