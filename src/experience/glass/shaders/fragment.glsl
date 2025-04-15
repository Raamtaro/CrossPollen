#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 uResolution;
uniform sampler2D uTargetTexture;
uniform float uIorR;
uniform float uIorG;
uniform float uIorB;
uniform float uIorY;
uniform float uIorC;
uniform float uIorP;
uniform float uOffset;

uniform float uRefractPower;
uniform float uChromaticAberration;
uniform float uSaturation;

uniform float uShininess;
uniform float uDiffuseness;
uniform vec3 uLight;
uniform float uFresnelPower;

varying vec3 worldNormal;
varying vec3 eyeVector;
varying vec2 vUv;

const int LOOP = 10;

vec3 sat(vec3 rgb, float intensity) {
    vec3 L = vec3(0.2125, 0.7154, 0.0721);
    vec3 grayscale = vec3(dot(rgb, L));
    return mix(grayscale, rgb, intensity);
}

float fresnel(vec3 eyeVector, vec3 worldNormal, float power) {
    float fresnelFactor = abs(dot(eyeVector, worldNormal));
    float inversefresnelFactor = 1.0 - fresnelFactor;
    
    return pow(inversefresnelFactor, power);
}

float specular(vec3 light, float shininess, float diffuseness) {
    vec3 normal = worldNormal;
    vec3 lightVector = normalize(-light);
    vec3 halfVector = normalize(eyeVector + lightVector);

    float NdotL = dot(normal, lightVector);
    float NdotH =  dot(normal, halfVector);
    float kDiffuse = max(0.0, NdotL);
    float NdotH2 = NdotH * NdotH;

    float kSpecular = pow(NdotH2, shininess);
    return  kSpecular + kDiffuse * diffuseness;
}

void main () {

    // float iorRatio = 1.0 / 1.31;

    // float iorRatioR = 1.0 / uIorR;
    // float iorRatioG = 1.0 / uIorG;
    // float iorRatioB = 1.0 / uIorB;

    vec3 color = vec3(0.0);
    vec2 uv = gl_FragCoord.xy/uResolution.xy;
    vec3 normal = worldNormal;

    

    for (int i = 0; i < LOOP; i++) {
        float slide = float(i) / float(LOOP) * 0.1;

        vec3 refractVecR = refract(eyeVector, normal,(1.0/(uIorR -1.05 * uOffset)));
        vec3 refractVecY = refract(eyeVector, normal, (1.0/(uIorY+1.05 * uOffset)));
        vec3 refractVecG = refract(eyeVector, normal, (1.0/(uIorG - 1.02 * uOffset)));
        vec3 refractVecC = refract(eyeVector, normal, (1.0/(uIorC+ 1.02 * uOffset)));
        vec3 refractVecB = refract(eyeVector, normal, (1.0/(uIorB + 1.025 * uOffset)));
        vec3 refractVecP = refract(eyeVector, normal, (1.0/(uIorP-1.025 * uOffset)));

        float r = texture2D(uTargetTexture, uv + refractVecR.xy * (uRefractPower + slide * 1.0) * uChromaticAberration).x * 0.5;

        float y = (texture2D(uTargetTexture, uv + refractVecY.xy * (uRefractPower + slide * 1.0) * uChromaticAberration).x * 2.0 +
                    texture2D(uTargetTexture, uv + refractVecY.xy * (uRefractPower + slide * 1.0) * uChromaticAberration).y * 2.0 -
                    texture2D(uTargetTexture, uv + refractVecY.xy * (uRefractPower + slide * 1.0) * uChromaticAberration).z) / 6.0;

        float g = texture2D(uTargetTexture, uv + refractVecG.xy * (uRefractPower + slide * 2.0) * uChromaticAberration).y * 0.5;

        float c = (texture2D(uTargetTexture, uv + refractVecC.xy * (uRefractPower + slide * 2.5) * uChromaticAberration).y * 2.0 +
                    texture2D(uTargetTexture, uv + refractVecC.xy * (uRefractPower + slide * 2.5) * uChromaticAberration).z * 2.0 -
                    texture2D(uTargetTexture, uv + refractVecC.xy * (uRefractPower + slide * 2.5) * uChromaticAberration).x) / 6.0;
            
        float b = texture2D(uTargetTexture, uv + refractVecB.xy * (uRefractPower + slide * 3.0) * uChromaticAberration).z * 0.5;

        float p = (texture2D(uTargetTexture, uv + refractVecP.xy * (uRefractPower + slide * 1.0) * uChromaticAberration).z * 2.0 +
                    texture2D(uTargetTexture, uv + refractVecP.xy * (uRefractPower + slide * 1.0) * uChromaticAberration).x * 2.0 -
                    texture2D(uTargetTexture, uv + refractVecP.xy * (uRefractPower + slide * 1.0) * uChromaticAberration).y) / 6.0;

        float R = r + (2.0*p + 2.0*y - c)/3.0;
        float G = g + (2.0*y + 2.0*c - p)/3.0;
        float B = b + (2.0*c + 2.0*p - y)/3.0;

        color.r += R;
        color.g += G;
        color.b += B;

        color = sat(color, uSaturation);


    }

    color /= float(LOOP);

    // Specular
    float specularLight = specular(uLight, uShininess, uDiffuseness);
    color += specularLight;

    // Fresnel
    float f = fresnel(eyeVector, normal, uFresnelPower);
    color.rgb += f * vec3(1.0);

    gl_FragColor = vec4(color, 1.0);
    // gl_FragColor = vec4(uv, 1.0, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}