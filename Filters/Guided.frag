#version 330 core
// Single-channel Guided filter

in vec2 texCoord;

out vec4 FragColor;

uniform sampler2D P; // Input Signal
uniform sampler2D I; // Guide signal , same dimensions as input

uniform float radius; // Window size : 2, 4, 8 etc.
uniform float eps; // Regularisation parameter : [0.1^2, 0.2^2, 0.4^2] * 255^2


float mean_I(float radius, float N) {
	
	float sum = 0.;
	for(float i = -radius; i <= radius; ++i) {
		for(float j = -radius; j <= radius; ++j) {
			sum += (texture(I, texCoord + vec2(i,j)/ vec2(textureSize(I, 0)))).r;
		}
	}

	return sum / N;
}

float mean_P(float radius, float N) {
	
	float sum = 0.;
	for(float i = -radius; i <= radius; ++i) {
		for(float j = -radius; j <= radius; ++j) {
			sum += (texture(P, texCoord + vec2(i,j)/ vec2(textureSize(P, 0)))).r;
		}
	}

	return sum / N;
}

float mean_IP(float radius, float N) {
	
	float sum = 0.;
	for(float i = -radius; i <= radius; ++i) {
		for(float j = -radius; j <= radius; ++j) {
			float I_color = (texture(I, texCoord + vec2(i,j) / vec2(textureSize(I, 0)))).r;
			float P_color = (texture(P, texCoord + vec2(i,j) / vec2(textureSize(P, 0)))).r;
			sum += (I_color * P_color);
		}
	}

	return sum / N;
}

float mean_II(float radius, float N) {
	
	float sum = 0.;
	for(float i = -radius; i <= radius; ++i) {
		for(float j = -radius; j <= radius; ++j) {
			float I_color = (texture(I, texCoord + vec2(i,j) / vec2(textureSize(I, 0)))).r;
			sum += pow(I_color, 2);
		}
	}

	return sum / N;
}


vec4 guided_filter() {
	
	float N = pow((2 * radius + 1), 2);
	
	float mean_i = mean_I(radius, N);
	float mean_p = mean_P(radius, N);
	float mean_ip = mean_IP(radius, N);
	
	float cov_ip = mean_ip - mean_i * mean_p; // Covariance
	float mean_ii = mean_II(radius, N);

	float var_i = mean_ii - mean_i * mean_i;

	float a = cov_ip / (var_i + eps);
	float b = mean_p - a * mean_i;

	return vec4(a*texture(I, texCoord).r + b);


}

void main() {
	

	FragColor = guided_filter();
}