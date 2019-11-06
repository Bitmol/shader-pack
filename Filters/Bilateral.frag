// Bilateral Filter

#version 330 core

in vec2 texCoord;

out vec4 FragColor;

uniform sampler2D texmap;

#define F 0.619928135
uniform float sigmaS;
uniform float sigmaL;


float lum(in vec4 color) {

	return length(color.xyz);

}

void main() {

	const float eps = 1e-10;

	float sigS = max(sigmaS,eps);
	float halfsize = ceil(sigS/F);
	vec2 pixelSize = 1.0/vec2(textureSize(texmap,0));
	float facS = -1./(2.*sigS*sigS);
	float facL = -1./(2.*sigmaL*sigmaL);
	float sumW = 0.;
	vec4 sumC = vec4(0.);
	
	float l = lum(texture(texmap,texCoord));

	for(float i=-halfsize;i<=halfsize;++i) {
		for(float j=-halfsize;j<=halfsize;++j) {
			vec2 pos = vec2(i,j);
			vec4 col = texture(texmap, texCoord+pos*pixelSize);
			float distS = length(pos);
			float distL = lum(col)-l;
			float wS = exp(facS*float(distS*distS));	
			float wL = exp(facL*float(distL*distL));
			float w = wS*wL;
			sumW += w;
			sumC += col*w;
		}
	}

	FragColor = sumC/sumW;

}