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
    scene.background = new THREE.Color(0x2d0a5e);
    scene.fog = new THREE.FogExp2(0x2d0a5e, 0.0003);

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

    // Lights
    const ambient = new THREE.AmbientLight(0x4433aa, 8);
    scene.add(ambient);

    const directionalLight = new THREE.DirectionalLight(0x3322cc, 6);
    directionalLight.position.set(0, 0, 1);
    scene.add(directionalLight);

    const hemi = new THREE.HemisphereLight(0x3322cc, 0x110033, 5);
    scene.add(hemi);

    // Flash lights
    const flash1 = new THREE.PointLight(0xffffff, 0, 1000, 1.5);
    const flash2 = new THREE.PointLight(0xe2c044, 0, 1000, 1.5);
    scene.add(flash1);
    scene.add(flash2);

    // Screen flash mesh — covers entire view
    const flashGeo = new THREE.PlaneGeometry(2, 2);
    const flashMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      depthTest: false,
    });
    const flashScreen = new THREE.Mesh(flashGeo, flashMat);
    flashScreen.renderOrder = 999;
    const flashCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const flashScene = new THREE.Scene();
    flashScene.add(flashScreen);

    // Rain
    const rainCount = 30000;
    const rainGeo = new THREE.BufferGeometry();
    const rainPositions = new Float32Array(rainCount * 3);
    for (let i = 0; i < rainCount * 3; i += 3) {
      rainPositions[i]     = Math.random() * 800 - 400;
      rainPositions[i + 1] = Math.random() * 600 - 300;
      rainPositions[i + 2] = Math.random() * 800 - 400;
    }
    rainGeo.setAttribute("position", new THREE.BufferAttribute(rainPositions, 3));
    const rainMaterial = new THREE.PointsMaterial({
      color: 0xbaaeff,
      size: 0.15,
      transparent: true,
      opacity: 0.4,
    });
    const rain = new THREE.Points(rainGeo, rainMaterial);
    scene.add(rain);

    // Clouds — doubled count, spread across all angles
    const cloudParticles = [];
    const loader = new THREE.TextureLoader();
    loader.load("https://i.imgur.com/usgGGX5.png", (texture) => {
      const cloudGeo = new THREE.PlaneGeometry(500, 500);
      const cloudMaterial = new THREE.MeshLambertMaterial({
        map: texture,
        transparent: true,
      });

      for (let p = 0; p < 120; p++) {
        const cloud = new THREE.Mesh(cloudGeo, cloudMaterial.clone());

        // Spread across full 360 — front, back, sides
        const angle = (p / 120) * Math.PI * 2;
        const radius = Math.random() * 400 + 100;
        cloud.position.set(
          Math.cos(angle) * radius,
          500,
          Math.sin(angle) * radius - 200
        );
        cloud.rotation.x = 1.16;
        cloud.rotation.y = -0.12;
        cloud.rotation.z = Math.random() * Math.PI * 2;
        cloud.material.opacity = 0.85;
        cloudParticles.push(cloud);
        scene.add(cloud);
      }
    });

    // Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Animation
    let animId;
    const rainPos = rainGeo.attributes.position.array;
    let flashTimer = 60;
    let isFlashing = false;
    let flashFrames = 0;
    let screenFlashOpacity = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Rotate clouds
      cloudParticles.forEach(p => {
        p.rotation.z -= 0.002;
      });

      // Rain fall
      for (let i = 1; i < rainCount * 3; i += 3) {
        rainPos[i] -= 0.15;
        if (rainPos[i] < -200) rainPos[i] = 200;
      }
      rainGeo.attributes.position.needsUpdate = true;
      rain.rotation.y += 0.0005;
      rain.rotation.x += 0.0002;

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

      // Screen flash overlay
      flashMat.opacity = screenFlashOpacity;

      // Render main scene
      renderer.autoClear = true;
      renderer.render(scene, camera);

      // Render screen flash on top
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
        zIndex: 1,
        pointerEvents: "none",
        width: "100%",
        height: "100%",
      }}
    />
  );
}