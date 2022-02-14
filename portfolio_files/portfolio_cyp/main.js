import './style.css'
import {
    AmbientLight,
    AxesHelper,
    BoxGeometry,
    BufferGeometry, Clock,
    Color,
    DirectionalLight,
    Float32BufferAttribute,
    GridHelper, Group, Line, LineBasicMaterial,
    MathUtils,
    Mesh,
    MeshBasicMaterial,
    MeshPhongMaterial,
    MeshStandardMaterial,
    PerspectiveCamera,
    PointLight,
    PointLightHelper, Points, PointsMaterial,
    Scene,
    SphereGeometry,
    TextureLoader,
    TorusGeometry, VertexColors,
    WebGLRenderer,
    WebGLRenderTarget
} from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
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
    antialias:true,
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth,window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene,camera);



// Torus

const geometry= new TorusGeometry(10,1,8,100);
const material= new MeshStandardMaterial({
    color: 0xEE82EE,
    wireframe:true,
});
const torus= new Mesh(geometry,material);

const materialTor2= new MeshStandardMaterial({
    color: 0xFF0092,
    wireframe:true,
});
const torus2= new Mesh(geometry,materialTor2);

const materialTor3= new MeshStandardMaterial({
    color: 0xFFAA92,
    wireframe:true,
});
const torus3= new Mesh(geometry,materialTor3);
torus3.rotateX(1.5);

scene.add(torus, torus2, torus3);


// Lumière

const pointLight=new PointLight(0xffffff);
pointLight.position.set(5,5,5);

const ambientLight= new AmbientLight(0xffffff);
scene.add(pointLight,ambientLight);



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

// Saturne

const saturTexture= new TextureLoader().load('img/8k_saturn.jpg');

const saturne = new Mesh(
    new SphereGeometry(5, 40, 40),
    new MeshStandardMaterial({
        map:saturTexture,
    })
);

const ringSat=new TorusGeometry(8,2,2,50);
const matRing = new MeshStandardMaterial({
    map: saturTexture,
});
const anneauSat=new Mesh(ringSat, matRing);


saturne.position.z=50;
saturne.position.setX(-15);
anneauSat.position.z=50;
anneauSat.position.setX(-15);
anneauSat.rotation.x=2;
scene.add(saturne,anneauSat);


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

//particule

const textureLoader= new TextureLoader();
const circleTexture=textureLoader.load('img/circle.png');
const alphaMap=textureLoader.load('img/alphamap.png');

const scene2=new Scene();
const count=100;
const distance=3;
const size=0.1;

scene2.add(new AxesHelper());

const camera2 = new PerspectiveCamera(
    75,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
);
camera2.position.z=-4;
camera2.position.y=0.5;
camera2.position.x=0.5;
scene2.add(camera2);
scene.add(pointLight.clone(),ambientLight.clone());

const points= new Float32Array(count *3);
const colors= new Float32Array(count *3);
for (let i = 0; i <points.length; i++) {
    points[i]=MathUtils.randFloatSpread(distance*2);
    colors[i]=Math.random()*0.5 + 0.5;
}

const geoPart=new BufferGeometry();
geoPart.setAttribute('position',new Float32BufferAttribute(points,3));
geoPart.setAttribute('color',new Float32BufferAttribute(colors,3));
const pointMaterial= new PointsMaterial({
    size,
    vertexColors:VertexColors,
    alphaTest:0.5,
    alphaMap:alphaMap,
    transparent: true
});
const pointsObject= new Points(geoPart, pointMaterial);
const group= new Group(pointsObject);
group.add(pointsObject);

const lineMaterial= new LineBasicMaterial({
    color:0xd4d4d4,
    opacity:0.1,
    depthWrite:false,
})
const lineObject=new Line(geoPart,lineMaterial);
group.add(lineObject);

scene2.add(group);

const renderer2=new WebGLRenderer({
    canvas:document.querySelector("#particule"),
    antialias:true,
    alpha:true
});
renderer2.setClearColor(0x000000,0);
document.body.appendChild(renderer2.domElement);

const controls= new OrbitControls(camera2, renderer2.domElement);
const clock= new Clock();

let mouseX=0;
let mouseY=0
window.addEventListener('mousemove',function (e){
    mouseX=e.clientX;
    mouseY=e.clientY;
});


renderer2.render(scene2,camera2);


function tick(){


    requestAnimationFrame(tick);
    torus.rotation.x +=0.01;
    torus.rotation.y +=0.005;
    torus.rotation.z +=0.01;

    torus2.rotation.x +=0.005;
    torus2.rotation.y +=0.01;
    torus2.rotation.z +=0.01;

    torus3.rotation.x -=0.01;
    torus3.rotation.y -=0.01;
    torus3.rotation.z -=0.005;

    terre.rotation.y +=0.01;
    saturne.rotation.y +=0.01;
    anneauSat.rotation.z -=0.01;

    renderer.render(scene,camera);

    const time=clock.getElapsedTime();
    renderer2.render(scene2,camera2);
    controls.update();
    const ratiox=(mouseX/window.innerWidth -0.5) *2;
    const ratioy=(mouseY/window.innerHeight -0.5) *2;
    group.rotation.x=ratioy*Math.PI*0.1;
    group.rotation.y=ratiox*Math.PI*0.1;
    //controls.update();

}
tick();

window.addEventListener('resize',function (){
    camera.aspect=window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
});


// Scroll

const ratio=0.35;
const options={
    root:null,
    rootMargin:'0px',
    threshold: ratio
}

const handleInterLeft=function (entries, observer){
    entries.forEach(function (entry){
        if (entry.intersectionRatio > ratio){
            entry.target.classList.add('reveal_visibleleft');
            observer.unobserve(entry.target);
        }
    });
}
const handleInterRight=function (entries, observer){
    entries.forEach(function (entry){
        if (entry.intersectionRatio > ratio){
            entry.target.classList.add('reveal_visibleright');
            observer.unobserve(entry.target);
        }
    });
}

const observerLeft = new IntersectionObserver(handleInterLeft,options);
document.querySelectorAll(".reveal-left").forEach(function (r){
    observerLeft.observe(r);
});
const observerRight = new IntersectionObserver(handleInterRight,options);
document.querySelectorAll(".reveal-right").forEach(function (r){
    observerRight.observe(r);
});