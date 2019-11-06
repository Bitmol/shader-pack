// Gaussian Blur

#version 330 core

out vec4 FragColor;  

in vec2 texCoord;

uniform sampler2D texmap;

uniform int size; 			 
uniform int direction;   


void main() {
  float factor = inversesqrt(-2.0*log(0.05));

  vec2 dir    = vec2(1-direction,direction)/textureSize(texmap,0);
  vec2 cdir   = dir;
  float sigma = float(size)*factor;
  float fac   = -1.0/(2.0*sigma*sigma);
  float sumW  = 1.0;

  vec4 v = texture(texmap,texCoord);
  for(int r=1;r<=size;r+=1) {
    vec4  left  = texture(texmap,texCoord-cdir);
    vec4  right = texture(texmap,texCoord+cdir);
    float w     = exp(fac*float(r*r));

    v    += w*(left+right);
    sumW += 2.0*w;
    cdir = cdir+dir;
  }

  FragColor = v/sumW;
}