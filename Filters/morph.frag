#version 330 core

in vec2 texCoord;

out vec4 FragColor;

uniform sampler2D texmap;
uniform int radius; // kernel radius
uniform int operator; // 0 : Dilation, 1 : Erosion
uniform int B; // 0 : Disc, 1 : Hexagon

bool brush(vec2 d) {

	d = abs(d);
	return B == 0? dot(d,d) <= radius*radius
		:  B == 1? max(d.x, d.x*.5+d.y*.87) < radius
		: true;
}

void main() {
	
	vec2 dim = 1./vec2(textureSize(texmap, 0));
	vec4 m = vec4(1e9), M = -m;
	
	for(float i = -radius; i <= radius; ++i) {
		for(float j = -radius; j <= radius; ++j) {
			if(brush(vec2(i, j))) {
				vec4 t = texture(texmap, (texCoord + vec2(i, j)) * dim);
				m =	min(m, t);
				M = max(M, t);
			}
		}
	}

	FragColor = operator == 0? M
			:   operator == 1? m
			:   texture(texmap, texCoord * dim); 
	 
}