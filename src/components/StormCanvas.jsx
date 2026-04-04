import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function StormCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 4.5;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0d0320);
    scene.fog = new THREE.FogExp2(0x0d0320, 0.0003);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.z = 300;
    camera.rotation.x = 1.16;
    camera.rotation.y = -0.12;
    camera.rotation.z = 0.27;

    // ── LIGHTS ──────────────────────────────────────────────────
    const ambient = new THREE.AmbientLight(0x4433aa, 8);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0x3322cc, 6);
    dirLight.position.set(0, 0, 1);
    scene.add(dirLight);

    const hemi = new THREE.HemisphereLight(0x3322cc, 0x110033, 5);
    scene.add(hemi);

    const flash1 = new THREE.PointLight(0xffffff, 0, 1000, 1.5);
    const flash2 = new THREE.PointLight(0xe2c044, 0, 1000, 1.5);
    scene.add(flash1);
    scene.add(flash2);

    // ── SCREEN FLASH ────────────────────────────────────────────
    const flashMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      depthTest: false,
    });
    const flashScreen = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), flashMat);
    const flashScene = new THREE.Scene();
    const flashCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    flashScene.add(flashScreen);

    // ── RAIN ────────────────────────────────────────────────────
    const rainCount = 8000;
    const rainPositions = new Float32Array(rainCount * 6);
    const rainVelocities = new Float32Array(rainCount);
    const rainLengths = new Float32Array(rainCount);

    for (let i = 0; i < rainCount; i++) {
      const x = Math.random() * 1200 - 600;
      const y = Math.random() * 800 - 400;
      const z = Math.random() * 800 - 400;
      const vel = Math.random() * 4 + 3;
      const len = vel * 2.5;

      rainVelocities[i] = vel;
      rainLengths[i] = len;

      rainPositions[i * 6]     = x;
      rainPositions[i * 6 + 1] = y;
      rainPositions[i * 6 + 2] = z;
      rainPositions[i * 6 + 3] = x - len * 0.12;
      rainPositions[i * 6 + 4] = y - len;
      rainPositions[i * 6 + 5] = z;
    }

    const rainGeo = new THREE.BufferGeometry();
    rainGeo.setAttribute("position", new THREE.BufferAttribute(rainPositions, 3));
    const rainMat = new THREE.LineBasicMaterial({
      color: 0xaaccff,
      transparent: true,
      opacity: 0.45,
    });
    const rainMesh = new THREE.LineSegments(rainGeo, rainMat);
    scene.add(rainMesh);

    // ── CLOUDS ──────────────────────────────────────────────────
    const cloudParticles = [];
    const loader = new THREE.TextureLoader();
    loader.load("/cloud.png", (texture) => {
      const cloudGeo = new THREE.PlaneGeometry(700, 700);
      const cloudMat = new THREE.MeshLambertMaterial({
        map: texture,
        transparent: true,
      });
      for (let p = 0; p < 200; p++) {
        const cloud = new THREE.Mesh(cloudGeo, cloudMat.clone());
        cloud.position.set(
          Math.random() * 1200 - 600,
          500,
          Math.random() * 1200 - 600
        );
        cloud.rotation.x = 1.16;
        cloud.rotation.y = -0.12;
        cloud.rotation.z = Math.random() * Math.PI * 2;
        cloud.material.opacity = 0.85;
        cloudParticles.push(cloud);
        scene.add(cloud);
      }
    });

    // ── RESIZE ──────────────────────────────────────────────────
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // ── ANIMATION ───────────────────────────────────────────────
    let animId;
    let flashTimer = 60;
    let isFlashing = false;
    let flashFrames = 0;
    let screenFlashOpacity = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Clouds
      cloudParticles.forEach(p => {
        p.rotation.z -= 0.002;
      });

      // Rain
      const pos = rainGeo.attributes.position.array;
      for (let i = 0; i < rainCount; i++) {
        const vel = rainVelocities[i];
        const len = rainLengths[i];

        pos[i * 6]     -= vel * 0.12;
        pos[i * 6 + 1] -= vel;
        pos[i * 6 + 3] -= vel * 0.12;
        pos[i * 6 + 4] -= vel;

        if (pos[i * 6 + 1] < -400) {
          const x = Math.random() * 1200 - 600;
          const y = 400 + Math.random() * 200;
          const z = Math.random() * 800 - 400;
          pos[i * 6]     = x;
          pos[i * 6 + 1] = y;
          pos[i * 6 + 2] = z;
          pos[i * 6 + 3] = x - len * 0.12;
          pos[i * 6 + 4] = y - len;
          pos[i * 6 + 5] = z;
        }
      }
      rainGeo.attributes.position.needsUpdate = true;

      // Lightning
      flashTimer--;
      if (flashTimer <= 0 && !isFlashing) {
        isFlashing = true;
        flashFrames = 0;
        const x = Math.random() * 600 - 300;
        const y = 200 + Math.random() * 200;
        flash1.position.set(x, y, 100);
        flash2.position.set(x + 50, y - 50, 80);
        flashTimer = Math.random() * 200 + 60;
      }

      if (isFlashing) {
        flashFrames++;
        if (flashFrames < 4) {
          flash1.intensity = 5000;
          flash2.intensity = 3000;
          screenFlashOpacity = 0.25;
        } else if (flashFrames < 8) {
          flash1.intensity = 0;
          flash2.intensity = 0;
          screenFlashOpacity = 0;
        } else if (flashFrames < 12) {
          flash1.intensity = 8000;
          flash2.intensity = 5000;
          screenFlashOpacity = 0.4;
        } else {
          flash1.intensity *= 0.8;
          flash2.intensity *= 0.8;
          screenFlashOpacity *= 0.8;
          if (flash1.intensity < 1) {
            flash1.intensity = 0;
            flash2.intensity = 0;
            screenFlashOpacity = 0;
            isFlashing = false;
          }
        }
      }

      flashMat.opacity = screenFlashOpacity;

      renderer.autoClear = true;
      renderer.render(scene, camera);

      if (screenFlashOpacity > 0.01) {
        renderer.autoClear = false;
        renderer.render(flashScene, flashCam);
      }
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        width: "100%",
        height: "100%",
      }}
    />
  );
}