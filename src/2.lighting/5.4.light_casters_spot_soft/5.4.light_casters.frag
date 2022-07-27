#version 330 core
struct Material {
    sampler2D diffuse;
    sampler2D specular;
    float     shininess;
}; 
struct Light {
    vec3 position; 
    vec3 direction;
    float cutOff;
    float outerCutOff;

    vec3 ambient;
    vec3 diffuse;
    vec3 specular;

    float constant;
    float linear;
    float quadratic;
};

out vec4 FragColor;

in vec2 TexCoords;
in vec3 Normal;  
in vec3 FragPos;  
 
uniform vec3 viewPos;
uniform Material material;
uniform Light light;

void main()
{
    vec3 lightDir = normalize(light.position - FragPos);
    float theta = dot(lightDir, normalize(-light.direction));
    if(theta > light.outerCutOff) // ִ�й��ռ���
    {       
        // ambient
        vec3 ambient = light.ambient * texture(material.diffuse, TexCoords).rgb;

        // diffuse 
        vec3 norm = normalize(Normal);
        float diff = max(dot(norm, lightDir), 0.0);
        vec3 diffuse = light.diffuse * diff * texture(material.diffuse, TexCoords).rgb;

        // specular
        vec3 viewDir = normalize(viewPos - FragPos);
        vec3 reflectDir = reflect(-lightDir, norm);
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
        vec3 specular = light.specular * spec * texture(material.specular,TexCoords).rgb;  

        // attenuation
        float distance    = length(light.position - FragPos);
        float attenuation = 1.0 / (light.constant + light.linear * distance + light.quadratic * (distance * distance));

        float epsilon = light.cutOff - light.outerCutOff;
        float intensity = clamp((theta - light.outerCutOff) / epsilon, 0.0, 1.0);

        diffuse  *= attenuation * intensity;
        specular *= attenuation * intensity;

        vec3 result = ambient + diffuse + specular;
        FragColor = vec4(result, 1.0);
    }
    else{  // ����ʹ�û����⣬�ó����ھ۹�֮��ʱ��������ȫ�ڰ�
        // ambient
        vec3 ambient = light.ambient * texture(material.diffuse, TexCoords).rgb;
        FragColor = vec4(ambient,1.0);
    }
} 