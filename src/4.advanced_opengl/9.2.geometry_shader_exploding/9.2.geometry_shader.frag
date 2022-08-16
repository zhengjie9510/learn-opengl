#version 330 core
struct DirLight {
    vec3 direction;

    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
}; 
out vec4 FragColor;

in vec2 TexCoords;
in vec3 FragPos;
in vec3 Normal;

uniform vec3 viewPos;
uniform DirLight dirLight;
uniform sampler2D texture_diffuse1;

uniform float shininess;

vec3 CalcDirLight(DirLight light, vec3 normal, vec3 viewDir);

void main()
{   
    vec3 viewDir = normalize(viewPos - FragPos);
    FragColor = vec4(CalcDirLight(dirLight,Normal,viewDir),1.0);
}

vec3 CalcDirLight(DirLight light, vec3 normal, vec3 viewDir){
    vec3 lightDir = normalize(-light.direction);
    // 漫反射强度
    float diff = max(dot(normal,lightDir),0.0);
    // 镜面反射强度
//    vec3 reflectDir = reflect(-lightDir,normal);
//    float spec = pow(max(dot(viewDir,reflectDir),0.0),shininess);
    // 合并结果
    vec3 ambient  = light.ambient  * vec3(texture(texture_diffuse1, TexCoords));
    vec3 diffuse  = light.diffuse  * diff * vec3(texture(texture_diffuse1, TexCoords));
//    vec3 specular = light.specular * spec * vec3(texture(texture_specular1, TexCoords));
    return ambient + diffuse;
}
