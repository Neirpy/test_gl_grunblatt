import './style.css'
import {
    AmbientLight, BoxGeometry, GridHelper, MathUtils,
    Mesh,
    MeshBasicMaterial,
    MeshStandardMaterial,
    PerspectiveCamera, PointLight, PointLightHelper,
    Scene, SphereGeometry, TextureLoader,
    TorusGeometry,
    WebGLRenderer
} from "three";

import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";


//Setup

const scene=new Scene();

const camera = new PerspectiveCamera(
    75,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
);

const renderer = new WebGLRenderer({
    canvas:document.querySelector('#background'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth,window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene,camera);


// Torus

const geometry= new TorusGeometry(10,3,16,100);
const material= new MeshStandardMaterial({
    color: 0xEE82EE,
    wireframe:true,
});
const torus= new Mesh(geometry,material);

scene.add(torus);


// Lumière

const pointLight=new PointLight(0xffffff);
pointLight.position.set(5,5,5);

const ambientLight= new AmbientLight(0xffffff);
scene.add(pointLight,ambientLight)


//const lightHelper= new PointLightHelper(pointLight);
//const gridHelper= new GridHelper(200,50);
//scene.add(lightHelper, gridHelper);

//const controls=new OrbitControls(camera, renderer.domElement);

function addStar(){
    const geoStar= new SphereGeometry(0.25, 24 , 24);
    const matStar= new MeshStandardMaterial({
       color: 0xffffff,
    });
    const star= new Mesh(geoStar,matStar);
    const [x,y,z]=Array(3).fill().map(()=>MathUtils.randFloatSpread(100));
    star.position.set(x,y,z);
    scene.add(star);
}

Array(200).fill().forEach(addStar);


// Arrière plan

const spaceTexture = new TextureLoader().load('img/space.jpg');
scene.background=spaceTexture;


// Moi

const cypTexture= new TextureLoader().load('img/cyp.png');

const cyp = new Mesh(
    new BoxGeometry(3,3,3),
    new MeshBasicMaterial({
        map:cypTexture,
    }),
)

cyp.position.z=-5;
cyp.position.x=2;

scene.add(cyp);

// Terre

const terreTexture= new TextureLoader().load('img/8k_earth_daymap.jpg');
const normalTexture= new TextureLoader().load('img/normalmap.jpg');

const terre = new Mesh(
  new SphereGeometry(3, 40, 40),
  new MeshStandardMaterial({
      map:terreTexture,
      normalMap:normalTexture,
  })
);

terre.position.z=30;
terre.position.setX(-10);
scene.add(terre);

function moveCamera(){
    const t = document.body.getBoundingClientRect().top;

    cyp.rotation.y += 0.01;
    cyp.rotation.z += 0.01;

    camera.position.z = t * -0.05;
    camera.position.y = t * -0.0008;
    camera.position.x = t * -0.0008;

}

document.body.onscroll=moveCamera;
moveCamera();

function tick(){
    requestAnimationFrame(tick);
    torus.rotation.x +=0.01;
    torus.rotation.y +=0.005;
    torus.rotation.z +=0.01;

    terre.rotation.y +=0.01;

    renderer.render(scene,camera);
    //controls.update();
}
tick();
