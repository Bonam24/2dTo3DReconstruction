document.getElementById("pointForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const pointsInput = document.getElementById("pointsInput").value;
    let points;

    try {
        points = JSON.parse(pointsInput);
    } catch (error) {
        console.error("Invalid JSON format:", error);
        alert("Please enter valid JSON formatted 2D points.");
        return;
    }

    const res = await fetch("/generate-mesh", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `points=${JSON.stringify(points)}`
    });

    const responseJson = await res.json();

    // Ensure both points and triangles exist before using them
    if (!responseJson.points || !responseJson.triangles) {
        console.error("Invalid response from server:", responseJson);
        alert("Failed to generate mesh. Check console for errors.");
        return;
    }

    const { points: processedPoints, triangles } = responseJson;

    // Debugging log
    console.log("Points:", processedPoints);
    console.log("Triangles:", triangles);

    renderMesh(processedPoints, triangles);
});


function renderMesh(points, triangles) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("threeCanvas").innerHTML = "";
    document.getElementById("threeCanvas").appendChild(renderer.domElement);
    
    const geometry = new THREE.BufferGeometry();
    const vertices = [];

    triangles.forEach((t, i) => {
        if (i % 3 === 0) {
            vertices.push(
                points[t][0], points[t][1], Math.random() * 5, // z for depth
                points[triangles[i + 1]][0], points[triangles[i + 1]][1], Math.random() * 5,
                points[triangles[i + 2]][0], points[triangles[i + 2]][1], Math.random() * 5
            );
        }
    });

    geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    geometry.computeVertexNormals();

    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00, wireframe: true });
    const mesh = new THREE.Mesh(geometry, material);
    
    scene.add(mesh);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);
    
    camera.position.z = 10;
    function animate() {
        requestAnimationFrame(animate);
        mesh.rotation.y += 0.01;
        renderer.render(scene, camera);
    }
    animate();
}
