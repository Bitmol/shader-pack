#version 330 core

uniform sampler2D normalmaptex;
uniform sampler2D heightmaptex;

uniform vec3 lightPos;
uniform vec3 viewPos;
uniform vec3 lightColor;

uniform vec4 SurfaceColor;

in vec2 texCoord;
out vec4 FragColor;

void main() {

	float kd = 1;
    float a = 0.2;
    float b = 0.6;

	vec3 v_normal = normalize(texture(normalmaptex, texCoord).xyz);
	vec3 l_direction = normalize(lightPos);
	vec4 m_color = SurfaceColor;
	vec3 c_direction = normalize(viewPos);
	float m_shine = 32.;

    float NL = dot(normalize(v_normal), normalize(l_direction));
    
    float it = ((1 + NL) / 2);
    vec3 color = (1-it) * (vec3(0, 0., 0.6) + a*m_color.xyz) 
               +  it * (vec3(0.6, 0.6, 0) + b*m_color.xyz);
    
    //Highlights
    vec3 R = reflect( -normalize(l_direction), 
                      normalize(v_normal) );
    float ER = clamp( dot( normalize(c_direction), 
                           normalize(R)),
                     0, 1);
    
    vec4 spec = vec4(1) * pow(ER, m_shine);

	float intensity = 0.6 * NL + 0.4 * ER;

 	if (intensity > 0.9) {
 		intensity = 1.1;
 	}
 	else if (intensity > 0.5) {
 		intensity = 0.7;
 	}
 	else {
 		intensity = 0.5;
	}
    FragColor = vec4(intensity * color + spec.x, m_color.a);

}