const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 10;

const canvas = document.getElementById('canvas');
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//Light
const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(3, 4, 5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 20;
scene.add(directionalLight);

const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
fillLight.position.set(-3, -2, -4);
scene.add(fillLight);

const controls = new THREE.OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 5;
controls.maxDistance = 20;
controls.addEventListener('change', render);

function Drawer(group){scene.add(group)}

window.addEventListener('resize', onWindowResize);
function onWindowResize() {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    render();
}

function animate() {requestAnimationFrame(animate);controls.update();render();}
function render() {renderer.render(scene, camera);}
animate();




function createBonds(arr) {
    const bondGroup = new THREE.Group();
    arr.forEach(e=>createBond(bondGroup,...e))
    return bondGroup;
}

function createBond(group,x0,y0,z0,x1,y1,z1,r,c) {
    const vector = new THREE.Vector3(x1-x0,y1-y0,z1-z0);
    const length = vector.length();
    const geometry = new THREE.CylinderGeometry(
        r, r, length, 32, 1, false
    );
    const material = new THREE.MeshPhongMaterial({
        color: c,
        shininess: 30,
        specular: c
    });
    const bond = new THREE.Mesh(geometry, material);
    bond.position.set(
        (x0+x1)/2,
        (y0+y1)/2,
        (z0+z1)/2
    );
    bond.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        vector.normalize()
    );
    bond.castShadow = true;
    bond.receiveShadow = true;
    group.add(bond);
}

        
function createAtoms(arr) {
    const group = new THREE.Group();
    for (let i = 0; i < arr.length; i++) {
        const geometry = new THREE.SphereGeometry(arr[i][3], 32, 32);
        const material = new THREE.MeshPhongMaterial({
            color: arr[i][4],
            shininess: 60,
            specular: new THREE.Color('darkgrey')
        });
        const atom = new THREE.Mesh(geometry, material);
        atom.position.set(arr[i][0],arr[i][1],arr[i][2]);
        atom.castShadow = true;
        atom.receiveShadow = true;
        group.add(atom);
    }
    return group;
}