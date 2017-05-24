#ifdef GL_ES
	precision highp float;
#endif

varying vec2 vUv;

uniform sampler2D texture;
uniform sampler2D texture2;
uniform float time;
uniform vec2 resolution;
uniform bool animate;

void main( ){
	vec2 dummy = vUv;
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	vec2 block = floor(gl_FragCoord.xy / vec2(16));
	vec2 uv_noise = block / vec2(64);
	uv_noise += floor(vec2(time) * vec2(1234.0, 3543.0)) / vec2(64);

	float block_thresh = pow(fract(time * 1236.0453), 2.0) * 0.2;
	float line_thresh = pow(fract(time * 2236.0453), 3.0) * 0.7;
	
	vec2 uv_r = uv, uv_g = uv, uv_b = uv;

	if ( texture2D(texture, uv_noise).r < block_thresh || texture2D(texture, vec2(uv_noise.y, 0.0)).g < line_thresh) {
		vec2 dist = (fract(uv_noise) - 0.5) * 0.3;
		uv_r += dist * 0.1;
		uv_g += dist * 0.2;
		uv_b += dist * 0.125;
	}

	vec3 col;
	col.r = texture2D(texture2, uv_r).r;
	col.g = texture2D(texture2, uv_g).g;
	col.b = texture2D(texture2, uv_b).b;

	// loose luma for some blocks
	if (texture2D(texture, uv_noise).g < block_thresh) col.rgb = col.ggg;

	// discolor block lines
	if (texture2D(texture, vec2(uv_noise.y, 0.0)).b * 3.5 < line_thresh) col.rgb = vec3(0.0, dot(col.rgb, vec3(1.0)), 0.0);

	// interleave lines in some blocks
	if (texture2D(texture, uv_noise).g * 1.5 < block_thresh ||
		texture2D(texture, vec2(uv_noise.y, 0.0)).g * 2.5 < line_thresh) {
		float line = fract(gl_FragCoord.y / 3.0);
		vec3 mask = vec3(3.0, 0.0, 0.0);
		if (line > 0.333) mask = vec3(0.0, 3.0, 0.0);
		if (line > 0.666) mask = vec3(0.0, 0.0, 3.0);
		
		col.xyz *= mask;
	}
	if( !animate ) gl_FragColor = vec4(vec3(col.r),1.0);
	else gl_FragColor = vec4(col,1.0);
}