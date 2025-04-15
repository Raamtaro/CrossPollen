uniform vec2 uResolution;
uniform float uSize;
uniform sampler2D uParticlesTexture;
uniform float uTime;

attribute vec2 aParticlesUv;
attribute float aSize;

varying vec3 vColor;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

#define M_PI 3.1415926535897932384626433832795;
#include ./includes/curl.glsl

void main()
{

    vec4 particle = texture(uParticlesTexture, aParticlesUv);

    vec3 newPos = particle.xyz;
    float f = 2.15;
    float amplitude = 3.05;
    float maxDistance = 2.75;
    vec3 target = particle.xyz + curl(newPos.x * f, newPos.y * f, newPos.z * f) * amplitude;

    float d = length(newPos-target) / maxDistance;
    newPos = mix(particle.xyz, target, pow(d, 5.0));

    // Final position
    vec4 modelPosition = modelMatrix * vec4(newPos, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    //Model Normal
    vec3 modelNormal = (modelMatrix * vec4(normal, 0.0)).xyz;

    gl_Position = projectedPosition;

    // Point size
    float sizeIn = smoothstep(0.0, 0.1, particle.a);
    float sizeOut = smoothstep(0.7, 1.0, particle.a);
    float size = min(sizeIn, sizeOut);

    gl_PointSize = uSize * aSize * uResolution.y;
    gl_PointSize *= (1.0 / - viewPosition.z);

    // Varying

    vUv = uv;
    vColor = vec3(0.0);
}