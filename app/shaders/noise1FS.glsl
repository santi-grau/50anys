#ifdef GL_ES
	precision highp float;
#endif

varying vec2 vUv;

uniform sampler2D texture;
uniform vec2 time;
uniform vec2 resolution;

void main( ){

	vec2 uv = gl_FragCoord.xy / resolution.xy;

	vec4 tex = texture2D(texture, vec2( 0.1, vUv.y ) + time );
	float a = 0.0;
	if(tex.r > 0.5) a = 1.0;
	gl_FragColor = vec4(vec3(0.0),a);
}