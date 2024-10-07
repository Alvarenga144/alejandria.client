const fragmentShader = `
uniform vec2 u_resolution;

uniform float u_red;
uniform float u_blue;
uniform float u_green;

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;
    gl_FragColor = vec4(vec3(st.y, st.x, 2), 1);
}
`;

export default fragmentShader;