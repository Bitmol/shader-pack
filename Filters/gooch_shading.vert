#version 330 core
layout (location = 0) in vec3 aPos;   
layout (location = 1) in vec2 atexCoord;


out vec2 texCoord;


void main() {

	texCoord = atexCoord;

    gl_Position = vec4(aPos, 1.0);
	
}       