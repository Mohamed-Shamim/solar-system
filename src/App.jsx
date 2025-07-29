import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Pane } from "tweakpane";

const App = () => {
  const canvasRef = useRef();

  useEffect(() => {
    const pane = new Pane();
    const PARAMS = {
      speedMultiplier: 1,
      scaleMultiplier: 1,
    };

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let targetPlanet = null;

    pane.addBinding(PARAMS, "speedMultiplier", { min: 0, max: 5, step: 0.1 });
    pane.addBinding(PARAMS, "scaleMultiplier", { min: 0.1, max: 5, step: 0.1 });

    const scene = new THREE.Scene();
    const textureLoader = new THREE.TextureLoader();
    const cubeTextureLoader = new THREE.CubeTextureLoader();
    cubeTextureLoader.setPath("/src/textures/cube-map/");

    // Load textures
    const textures = {
      sun: textureLoader.load("/src/textures/2k_sun.jpg"),
      earth: textureLoader.load("/src/textures/2k_earth_daymap.jpg"),
      mars: textureLoader.load("/src/textures/2k_mars.jpg"),
      mercury: textureLoader.load("/src/textures/2k_mercury.jpg"),
      moon: textureLoader.load("/src/textures/2k_moon.jpg"),
      neptune: textureLoader.load("/src/textures/2k_neptune.jpg"),
      uranus: textureLoader.load("/src/textures/2k_uranus.jpg"),
      venus: textureLoader.load("/src/textures/2k_venus_surface.jpg"),
      saturn: textureLoader.load("/src/textures/8k_saturn.jpg"),
      jupiter: textureLoader.load("/src/textures/jupiter2_1k (1).jpg"),
      saturnRing: textureLoader.load("/src/textures/saturn_ring_texture.png"),
    };

    scene.background = cubeTextureLoader.load([
      "px.png",
      "nx.png",
      "py.png",
      "ny.png",
      "pz.png",
      "nz.png",
    ]);

    // Materials
    const materials = {
      mercury: new THREE.MeshStandardMaterial({ map: textures.mercury }),
      venus: new THREE.MeshStandardMaterial({ map: textures.venus }),
      earth: new THREE.MeshStandardMaterial({ map: textures.earth }),
      mars: new THREE.MeshStandardMaterial({ map: textures.mars }),
      jupiter: new THREE.MeshStandardMaterial({ map: textures.jupiter }),
      saturn: new THREE.MeshStandardMaterial({ map: textures.saturn }),
      moon: new THREE.MeshStandardMaterial({ map: textures.moon }),
      uranus: new THREE.MeshStandardMaterial({ map: textures.uranus }),
      neptune: new THREE.MeshStandardMaterial({ map: textures.neptune }),
    };

    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({
      map: textures.sun,
      metalness: 0,
      roughness: 1,
    });

    const sun = new THREE.Mesh(sphereGeometry, sunMaterial);
    sun.scale.setScalar(4);
    scene.add(sun);

    // Point light at sun
    const pointLight = new THREE.PointLight(0xffffff, 1000);
    pointLight.position.set(0, 0, 0);
    sun.add(pointLight);

    // Ambient light
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));

    // Planet definitions
    const planets = [
      {
        name: "Mercury",
        material: materials.mercury,
        radius: 0.2,
        distance: 6,
        speed: 0.02,
        moon: null,
      },
      {
        name: "Venus",
        material: materials.venus,
        radius: 0.5,
        distance: 9,
        speed: 0.015,
        moon: null,
      },
      {
        name: "Earth",
        material: materials.earth,
        radius: 0.6,
        distance: 12,
        speed: 0.012,
        moon: [
          {
            name: "Moon",
            material: materials.moon,
            radius: 0.19,
            distance: 1.5,
            speed: 0.08,
          },
        ],
      },
      {
        name: "Mars",
        material: materials.mars,
        radius: 0.46,
        distance: 15,
        speed: 0.01,
        moon: [
          {
            name: "Phobos",
            material: materials.moon,
            radius: 0.05,
            distance: 1.2,
            speed: 0.05,
          },
          {
            name: "Deimos",
            material: materials.moon,
            radius: 0.09,
            distance: 1.6,
            speed: 0.03,
          },
        ],
      },
      {
        name: "Jupiter",
        material: materials.jupiter,
        radius: 1.2,
        distance: 20,
        speed: 0.007,
        moon: [
          {
            name: "Moon",
            material: materials.moon,
            radius: 0.15,
            distance: 1.5,
            speed: 0.04,
          },

          {
            name: "Moon",
            material: materials.moon,
            radius: 0.15,
            distance: 1.2,
            speed: 0.02,
          },

          {
            name: "Io",
            material: materials.moon,
            radius: 0.1,
            distance: 1.8,
            speed: 0.05,
          },
          {
            name: "Europa",
            material: materials.moon,
            radius: 0.14,
            distance: 2.1,
            speed: 0.044,
          },
          {
            name: "Ganymede",
            material: materials.moon,
            radius: 0.23,
            distance: 2.5,
            speed: 0.03,
          },
          {
            name: "Callisto",
            material: materials.moon,
            radius: 0.19,
            distance: 3.0,
            speed: 0.025,
          },
        ],
      },
      {
        name: "Saturn",
        material: materials.saturn,
        radius: 1.0,
        distance: 26,
        speed: 0.006,
      },
      {
        name: "Uranus",
        material: materials.uranus,
        radius: 0.7,
        distance: 32,
        speed: 0.004,
        moon: [
          {
            name: "Titania",
            material: materials.moon,
            radius: 0.22,
            distance: 2.0,
            speed: 0.02,
          },
          {
            name: "Oberon",
            material: materials.moon,
            radius: 0.2,
            distance: 2.5,
            speed: 0.015,
          },
        ],
      },
      {
        name: "Neptune",
        material: materials.neptune,
        radius: 0.7,
        distance: 38,
        speed: 0.003,
        moon: [
          {
            name: "Triton",
            material: materials.moon,
            radius: 0.23,
            distance: 2.1,
            speed: 0.02,
          },
        ],
      },
    ];

    const createOrbit = (radius) => {
      const geo = new THREE.RingGeometry(radius - 0.02, radius + 0.02, 64);
      const mat = new THREE.MeshBasicMaterial({
        color: 0x888888,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
      });
      const orbit = new THREE.Mesh(geo, mat);
      orbit.rotation.x = Math.PI / 2;
      scene.add(orbit);
    };

    const createPlanet = (planet) => {
      const mesh = new THREE.Mesh(sphereGeometry, planet.material);
      mesh.scale.setScalar(planet.radius);
      mesh.position.x = planet.distance;
      if (planet.name === "Saturn") {
        const ringGeo = new THREE.RingGeometry(
          planet.radius + 0.5,
          planet.radius + 2,
          64
        );
        const ringMat = new THREE.MeshBasicMaterial({
          map: textures.saturnRing,
          side: THREE.DoubleSide,
          transparent: true,
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        mesh.add(ring);
      }
      return mesh;
    };

    const createMoon = (moon) => {
      const mesh = new THREE.Mesh(sphereGeometry, moon.material);
      mesh.scale.setScalar(moon.radius);
      mesh.position.x = moon.distance;
      return mesh;
    };

    const planetMeshes = planets.map((planet) => {
      createOrbit(planet.distance);
      const planetMesh = createPlanet(planet);
      scene.add(planetMesh);
      if (Array.isArray(planet.moon)) {
        planet.moon.forEach((moon) => {
          const moonMesh = createMoon(moon);
          planetMesh.add(moonMesh);
        });
      }
      return planetMesh;
    });

    canvasRef.current.addEventListener("click", (event) => {
      const bounds = canvasRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      mouse.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(planetMeshes, true); // true to include children (e.g. moons/rings)

      if (intersects.length > 0) {
        targetPlanet = intersects[0].object;

        // Traverse up if moon or ring was clicked
        while (targetPlanet.parent && !planetMeshes.includes(targetPlanet)) {
          targetPlanet = targetPlanet.parent;
        }
      }
    });

    // Camera
    const camera = new THREE.PerspectiveCamera(
      35,
      window.innerWidth / window.innerHeight,
      0.3,
      500
    );
    camera.position.set(0, 30, 100);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.maxDistance = 200;
    controls.minDistance = 10;

    const animate = () => {
      sun.rotation.y += 0.001 * PARAMS.speedMultiplier;

      planetMeshes.forEach((planetMesh, i) => {
        const data = planets[i];
        const speed = data.speed * PARAMS.speedMultiplier;
        planetMesh.rotation.y += speed;
        planetMesh.position.x = Math.sin(planetMesh.rotation.y) * data.distance;
        planetMesh.position.z = Math.cos(planetMesh.rotation.y) * data.distance;
        planetMesh.scale.setScalar(data.radius * PARAMS.scaleMultiplier);

        planetMesh.children.forEach((moon, idx) => {
          const moonData = data.moon?.[idx];
          if (moonData) {
            moon.rotation.y += moonData.speed * PARAMS.speedMultiplier;
            moon.position.x = Math.sin(moon.rotation.y) * moonData.distance;
            moon.position.z = Math.cos(moon.rotation.y) * moonData.distance;
          }
        });
      });

      if (targetPlanet) {
        const planetWorldPosition = new THREE.Vector3();
        targetPlanet.getWorldPosition(planetWorldPosition);

        // Interpolate camera position
        const direction = new THREE.Vector3()
          .subVectors(planetWorldPosition, camera.position)
          .normalize();
        const distance = camera.position.distanceTo(planetWorldPosition);
        if (distance > 5) {
          camera.position.add(direction.multiplyScalar(0.1 * distance)); // Smooth zoom
        } else {
          controls.target.copy(planetWorldPosition);
          targetPlanet = null; // Stop zooming
        }
      }

      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }, []);

  return <canvas ref={canvasRef} style={{ display: "block" }} />;
};

export default App;
