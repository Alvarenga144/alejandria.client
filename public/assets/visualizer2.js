import * as THREE from './three/build/three.module.js';;
//import {GUI} from 'dat.gui';
import {EffectComposer} from './three/examples/jsm/postprocessing/EffectComposer.js';
import {RenderPass} from './three/examples/jsm/postprocessing/RenderPass.js';
import {UnrealBloomPass} from './three/examples/jsm/postprocessing/UnrealBloomPass.js';
import {OutputPass} from './three/examples/jsm/postprocessing/OutputPass.js';
import vertexShader from './visualizerVertex.js'
import fragmentShader from './visualizerFragment.js'

const mainPanel = document.getElementById('main');
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(mainPanel.clientWidth, document.body.clientHeight);
//renderer.setSize(window.innerWidth, window.innerHeight);
const visualizerPanel = document.getElementById('visualizer');
visualizerPanel.appendChild(renderer.domElement);
//document.body.appendChild(renderer.domElement);
//renderer.setClearColor(0x222222);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
	75,
	//window.innerWidth / window.innerHeight,
	0.5,
	0.1,
	1000
);

const params = {
	red: 1.0,
	green: 0.30,
	blue: 1.0,
	threshold: 0.5,
	strength: 0.40,
	radius: 0.8
}

renderer.outputColorSpace = THREE.SRGBColorSpace;

const renderScene = new RenderPass(scene, camera);

const bloomPass = new UnrealBloomPass(new THREE.Vector2(mainPanel.clientWidth, document.body.clientHeight));
//const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight));
bloomPass.threshold = params.threshold;
bloomPass.strength = params.strength;
bloomPass.radius = params.radius;

const bloomComposer = new EffectComposer(renderer);
bloomComposer.addPass(renderScene);
bloomComposer.addPass(bloomPass);

const outputPass = new OutputPass();
bloomComposer.addPass(outputPass);

camera.position.set(0, -2, 14);
camera.lookAt(0, 0, 0);

const uniforms = {
	u_resolution: {type: 'v2', value: new THREE.Vector2(mainPanel.clientWidth, window.innerHeight)},
	//u_resolution: {type: 'v2', value: new THREE.Vector2(window.innerWidth, window.innerHeight)},
	u_time: {type: 'f', value: 0.0},
	u_frequency: {type: 'f', value: 0.0},
	u_red: {type: 'f', value: 1.0},
	u_green: {type: 'f', value: 1.0},
	u_blue: {type: 'f', value: 1.0}
}

const mat = new THREE.ShaderMaterial({
	uniforms,
	vertexShader: vertexShader,
	fragmentShader: fragmentShader
});

const geo = new THREE.IcosahedronGeometry(4, 20);
const mesh = new THREE.Mesh(geo, mat);
scene.add(mesh);
mesh.material.wireframe = true;

const listener = new THREE.AudioListener();
camera.add(listener);

const sound = new THREE.Audio(listener);

const greetings = [
	'/assets/greeting.mp3',
	'/assets/music.mp3'
];

let greetingIndex = 0;
let playGreeting = true;

const audioLoader = new THREE.AudioLoader();

function loadGreeting(){
	audioLoader.load(greetings[greetingIndex], function(buffer) {
		sound.setBuffer(buffer);
	});
}

visualizerPanel.addEventListener('click', function() {
	if(sound.isPlaying){
		sound.stop();
		if(playGreeting){
			greetingIndex++;
			if(greetingIndex >= greetings.length){
				greetingIndex = 0;
			}
			loadGreeting();
		}
	} else {
		sound.play();
	}
});

loadGreeting();
sound.onEnded = () => {
	if(playGreeting){			
		greetingIndex++;
		if(greetingIndex >= greetings.length){
			greetingIndex = 0;
		}
		loadGreeting();
	}
    sound.isPlaying = false
}

const analyser = new THREE.AudioAnalyser(sound, 32);

window.resetSound = () => {
	sound.stop();
	playGreeting = true;
	greetingIndex = 0;
	loadGreeting();
}

window.stopSound = () => {
	sound.stop();
}

window.setBufferAndPlay = (audioURL) => {
	audioLoader.load(audioURL, function(buffer) {
		playGreeting = false;
		sound.setBuffer(buffer);
		sound.play();
	});
}
/*
const gui = new GUI();

const colorsFolder = gui.addFolder('Colors');
colorsFolder.add(params, 'red', 0, 1).onChange(function(value) {
	uniforms.u_red.value = Number(value);
});
colorsFolder.add(params, 'green', 0, 1).onChange(function(value) {
	uniforms.u_green.value = Number(value);
});
colorsFolder.add(params, 'blue', 0, 1).onChange(function(value) {
	uniforms.u_blue.value = Number(value);
});

const bloomFolder = gui.addFolder('Bloom');
bloomFolder.add(params, 'threshold', 0, 1).onChange(function(value) {
	bloomPass.threshold = Number(value);
});
bloomFolder.add(params, 'strength', 0, 3).onChange(function(value) {
	bloomPass.strength = Number(value);
});
bloomFolder.add(params, 'radius', 0, 1).onChange(function(value) {
	bloomPass.radius = Number(value);
});
*/

let mouseX = 0;
let mouseY = 0;
document.addEventListener('mousemove', function(e) {
	let windowHalfX = mainPanel.clientWidth / 2;
	//let windowHalfX = window.innerWidth / 2;
	let windowHalfY = document.body.clientHeight / 2;
	//let windowHalfY = window.innerHeight / 2;
	mouseX = (e.clientX - windowHalfX) / 100;
	mouseY = (e.clientY - windowHalfY) / 100;
	// console.log(mouseX, mouseX)
});

const clock = new THREE.Clock();
function animate() {
	camera.position.x += (mouseX - camera.position.x) * .05;
	camera.position.y += (-mouseY - camera.position.y) * 0.5;
	camera.lookAt(scene.position);
	uniforms.u_time.value = clock.getElapsedTime();
	uniforms.u_frequency.value = analyser.getAverageFrequency();
    bloomComposer.render();
	requestAnimationFrame(animate);
}
animate();

/*
window.addEventListener('resize', function() {
    camera.aspect = mainPanel.clientWidth / this.document.body.clientHeight;
    //camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(mainPanel.clientWidth, this.document.body.clientHeight);
    //renderer.setSize(window.innerWidth, window.innerHeight);
	bloomComposer.setSize(mainPanel.clientWidth, this.document.body.clientHeight);
	//bloomComposer.setSize(window.innerWidth, window.innerHeight);
});
*/