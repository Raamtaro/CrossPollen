varying vec3 worldNormal;
varying vec3 eyeVector;
varying vec2 vUv;

void main () {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    eyeVector = normalize(modelPosition.xyz - cameraPosition);

    vec3 transformedNormal = normalMatrix * normal;
    worldNormal = normalize(transformedNormal);
    vUv = uv;
}