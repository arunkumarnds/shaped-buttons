// // (No DOMContentLoaded wrapper—script is at the bottom of body)

// // 1. Scene setup
// const container = document.getElementById("scene-container");
// const scene = new THREE.Scene();
// scene.fog = new THREE.Fog(0x0e0e15, 6, 16);

// const camera = new THREE.PerspectiveCamera(
//   45,
//   container.clientWidth / container.clientHeight,
//   0.1,
//   100
// );
// camera.position.set(0, 0, 6);

// const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
// renderer.setSize(container.clientWidth, container.clientHeight);
// renderer.setPixelRatio(window.devicePixelRatio);
// container.appendChild(renderer.domElement);

// // 2. Lights
// const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
// scene.add(hemiLight);
// const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
// dirLight.position.set(5, 10, 7);
// scene.add(dirLight);

// // 3. Blob mesh
// const RADIUS = 2, DETAIL = 5;
// const baseGeometry = new THREE.IcosahedronGeometry(RADIUS, DETAIL);
// const blobMaterial = new THREE.MeshPhysicalMaterial({
//   color: 0x4cc9f0,
//   roughness: 0.15,
//   transmission: 0.92,
//   thickness: 0.6,
//   transparent: true,
//   opacity: 0.75,
//   side: THREE.DoubleSide,
// });
// const blobMesh = new THREE.Mesh(baseGeometry.clone(), blobMaterial);
// scene.add(blobMesh);

// // 4. Dots on surface
// const dotsGroup = new THREE.Group();
// scene.add(dotsGroup);
// const dotGeo = new THREE.SphereGeometry(0.05, 16, 16);
// const dotMat = new THREE.MeshStandardMaterial({
//   color: 0xffffff,
//   roughness: 0.25,
//   metalness: 0.15,
// });
// const posAttr = baseGeometry.attributes.position;
// const seen = new Set();
// for (let i = 0; i < posAttr.count; i++) {
//   const v = new THREE.Vector3().fromBufferAttribute(posAttr, i);
//   const key = `${v.x.toFixed(3)}|${v.y.toFixed(3)}|${v.z.toFixed(3)}`;
//   if (seen.has(key)) continue;
//   seen.add(key);

//   const sphere = new THREE.Mesh(dotGeo, dotMat.clone());
//   sphere.position.copy(v);
//   sphere.userData = {
//     origin: v.clone(),
//     exploded: v.clone().multiplyScalar(3),
//   };
//   dotsGroup.add(sphere);
// }

// // 5. Interaction & animation helpers
// const simplex = new SimplexNoise();
// let explode = false, time = 0;
// const hint = document.getElementById("hint");

// container.addEventListener("mouseenter", () => {
//   explode = true;
//   hint.style.opacity = 0;
// });
// container.addEventListener("mouseleave", () => {
//   explode = false;
//   hint.style.opacity = 1;
// });

// window.addEventListener("resize", () => {
//   camera.aspect = container.clientWidth / container.clientHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(container.clientWidth, container.clientHeight);
// });

// // 6. Render loop
// (function animate() {
//   requestAnimationFrame(animate);
//   time += 0.005;

//   // Rotate blob & dots
//   blobMesh.rotation.y += 0.003;
//   dotsGroup.rotation.y += 0.003;

//   // Deform blob vertices with noise
//   const verts = blobMesh.geometry.attributes.position;
//   for (let i = 0; i < verts.count; i++) {
//     const vx = verts.getX(i), vy = verts.getY(i), vz = verts.getZ(i);
//     const noise = simplex.noise4D(vx * 0.25, vy * 0.25, vz * 0.25, time) * 0.25;
//     const v = new THREE.Vector3(vx, vy, vz).normalize().multiplyScalar(RADIUS + noise);
//     verts.setXYZ(i, v.x, v.y, v.z);
//   }
//   verts.needsUpdate = true;
//   blobMesh.geometry.computeVertexNormals();

//   // Lerp dots between inner & exploded positions
//   dotsGroup.children.forEach(d => {
//     const target = explode ? d.userData.exploded : d.userData.origin;
//     d.position.lerp(target, 0.05);
//   });

//   renderer.render(scene, camera);
// })();
