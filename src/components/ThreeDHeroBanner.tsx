"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import Link from "next/link";
import {
  Sparkles,
  Layers,
  Bot,
  Zap,
  TrendingUp,
  ShieldCheck,
  RotateCcw,
  Eye,
} from "lucide-react";

export function ThreeDHeroBanner() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeItemName, setActiveItemName] = useState<string>("Hass Avocado (Organic)");
  const [activeItemStats, setActiveItemStats] = useState({
    freshness: "94%",
    hours: "72h left",
    price: "$5.99",
    co2Saved: "1.3 kg",
  });

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 340;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x06090e, 0.05);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.8);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 4. Multi-color Colorful 3D Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x06b6d4, 3.5, 10);
    cyanLight.position.set(-3, 2, 3);
    scene.add(cyanLight);

    const purpleLight = new THREE.PointLight(0xa855f7, 3.8, 10);
    purpleLight.position.set(3, 2, 3);
    scene.add(purpleLight);

    const emeraldLight = new THREE.PointLight(0x10b981, 3.0, 8);
    emeraldLight.position.set(0, -2, 2.5);
    scene.add(emeraldLight);

    const goldenSun = new THREE.DirectionalLight(0xfef08a, 1.4);
    goldenSun.position.set(0, 5, 4);
    scene.add(goldenSun);

    // 5. 3D Floating Realistic Grocery Objects
    const objectsGroup = new THREE.Group();
    scene.add(objectsGroup);

    // Item 1: 3D Avocado
    const avoGeo = new THREE.SphereGeometry(0.55, 32, 32);
    avoGeo.scale(1, 1.35, 0.9);
    const avoMat = new THREE.MeshStandardMaterial({
      color: 0x2e4f20,
      roughness: 0.45,
      metalness: 0.1,
    });
    const avoMesh = new THREE.Mesh(avoGeo, avoMat);
    avoMesh.position.set(-2.2, 0.2, 0);
    avoMesh.castShadow = true;
    objectsGroup.add(avoMesh);

    // Item 2: 3D Glass Milk Jug
    const milkGeo = new THREE.CylinderGeometry(0.38, 0.42, 1.25, 32);
    const milkMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.5,
      opacity: 0.95,
      transparent: true,
      roughness: 0.15,
      metalness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });
    const milkMesh = new THREE.Mesh(milkGeo, milkMat);
    milkMesh.position.set(-0.8, -0.1, 0.5);
    // Milk cap
    const capGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.15, 24);
    const capMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.3 });
    const capMesh = new THREE.Mesh(capGeo, capMat);
    capMesh.position.set(0, 0.68, 0);
    milkMesh.add(capMesh);
    objectsGroup.add(milkMesh);

    // Item 3: 3D Golden Sourdough Bread
    const breadGeo = new THREE.BoxGeometry(1.2, 0.65, 0.7);
    const breadMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.6,
      metalness: 0.05,
    });
    const breadMesh = new THREE.Mesh(breadGeo, breadMat);
    breadMesh.position.set(0.8, 0.25, 0.2);
    objectsGroup.add(breadMesh);

    // Item 4: 3D Roma Tomato
    const tomGeo = new THREE.SphereGeometry(0.48, 32, 32);
    const tomMat = new THREE.MeshPhysicalMaterial({
      color: 0xef4444,
      roughness: 0.2,
      clearcoat: 0.9,
      clearcoatRoughness: 0.15,
    });
    const tomMesh = new THREE.Mesh(tomGeo, tomMat);
    tomMesh.position.set(2.2, -0.1, 0);
    objectsGroup.add(tomMesh);

    // Floating 3D Glowing Halos / Metric Rings around items
    const haloGeo = new THREE.TorusGeometry(0.65, 0.03, 16, 64);
    const halo1 = new THREE.Mesh(
      haloGeo,
      new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.85 })
    );
    halo1.position.copy(avoMesh.position);
    halo1.rotation.x = Math.PI / 2.2;
    scene.add(halo1);

    const halo2 = new THREE.Mesh(
      haloGeo,
      new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.85 })
    );
    halo2.position.copy(milkMesh.position);
    halo2.rotation.x = Math.PI / 2.4;
    scene.add(halo2);

    const halo3 = new THREE.Mesh(
      haloGeo,
      new THREE.MeshBasicMaterial({ color: 0xf59e0b, transparent: true, opacity: 0.85 })
    );
    halo3.position.copy(breadMesh.position);
    halo3.rotation.x = Math.PI / 2.1;
    scene.add(halo3);

    const halo4 = new THREE.Mesh(
      haloGeo,
      new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.85 })
    );
    halo4.position.copy(tomMesh.position);
    halo4.rotation.x = Math.PI / 2.2;
    scene.add(halo4);

    // Mouse Parallax & Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / height - 0.5) * 2;
    };

    container.addEventListener("mousemove", onPointerMove);

    // 6. Animation Loop
    let clock = new THREE.Clock();
    let frameId = 0;

    const animate = () => {
      const t = clock.getElapsedTime();

      // Smooth camera parallax
      targetX = mouseX * 0.7;
      targetY = -mouseY * 0.4;
      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (targetY - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      // Organic gentle floating rotations
      avoMesh.rotation.y = t * 0.45;
      avoMesh.position.y = 0.2 + Math.sin(t * 1.5) * 0.12;

      milkMesh.rotation.y = -t * 0.35;
      milkMesh.position.y = -0.1 + Math.sin(t * 1.8 + 1) * 0.1;

      breadMesh.rotation.y = t * 0.3;
      breadMesh.rotation.x = Math.sin(t * 0.8) * 0.15;
      breadMesh.position.y = 0.25 + Math.sin(t * 1.4 + 2) * 0.14;

      tomMesh.rotation.y = t * 0.5;
      tomMesh.position.y = -0.1 + Math.sin(t * 2.0 + 3) * 0.11;

      // Halo pulsing and rotation
      halo1.position.y = avoMesh.position.y - 0.35;
      halo1.rotation.z = t * 0.8;

      halo2.position.y = milkMesh.position.y - 0.45;
      halo2.rotation.z = -t * 0.7;

      halo3.position.y = breadMesh.position.y - 0.3;
      halo3.rotation.z = t * 0.6;

      halo4.position.y = tomMesh.position.y - 0.3;
      halo4.rotation.z = -t * 0.9;

      // Move point lights around
      cyanLight.position.x = Math.sin(t * 0.8) * 3;
      purpleLight.position.x = -Math.sin(t * 0.8) * 3;

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 340;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousemove", onPointerMove);
      cancelAnimationFrame(frameId);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="card-3d-realistic relative overflow-hidden p-6 md:p-8 flex flex-col justify-between min-h-[380px]">
      {/* 3D WebGL Canvas Layer */}
      <div
        ref={mountRef}
        className="absolute inset-0 pointer-events-auto cursor-crosshair z-0"
      />

      {/* Atmospheric Top Glow Overlays */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6 pointer-events-none">
        <div className="max-w-xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="pill-3d-cyan px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-md">
              <Sparkles className="w-3.5 h-3.5" />
              Real-Time 3D Holographic Engine
            </span>
            <span className="pill-3d-emerald px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase">
              Live Biological Shaders
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-md">
            ZeroWaste <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400">AI 3D</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed drop-shadow">
            Autonomous multi-agent perishable inventory operating system with
            photorealistic 3D grocery modeling, live decay telemetry, dynamic
            markdowns, and food-rescue logistics.
          </p>
        </div>

        {/* Live 3D Floating Telemetry Card */}
        <div className="card-3d-realistic p-4 pointer-events-auto shrink-0 w-72 backdrop-blur-xl border border-white/15 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                3D Telemetry
              </span>
            </div>
            <span className="text-[10px] font-mono pill-3d-purple px-2 py-0.5 rounded">
              Active Orbit
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3 font-mono text-xs">
            <div className="bg-black/30 p-2 rounded-xl border border-white/5">
              <span className="text-[10px] text-cyan-400 font-sans block">Freshness</span>
              <span className="text-base font-bold text-white">{activeItemStats.freshness}</span>
            </div>
            <div className="bg-black/30 p-2 rounded-xl border border-white/5">
              <span className="text-[10px] text-amber-400 font-sans block">Expiry Window</span>
              <span className="text-base font-bold text-white">{activeItemStats.hours}</span>
            </div>
            <div className="bg-black/30 p-2 rounded-xl border border-white/5">
              <span className="text-[10px] text-emerald-400 font-sans block">Target Price</span>
              <span className="text-base font-bold text-white">{activeItemStats.price}</span>
            </div>
            <div className="bg-black/30 p-2 rounded-xl border border-white/5">
              <span className="text-[10px] text-purple-400 font-sans block">CO2 Avoided</span>
              <span className="text-base font-bold text-white">{activeItemStats.co2Saved}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="relative z-10 flex flex-wrap items-center gap-3 pt-6 pointer-events-auto">
        <Link
          href="/shelves"
          className="btn-3d-emerald px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 cursor-pointer"
        >
          <Layers className="w-4 h-4" />
          <span>Explore 3D Shelves Simulation</span>
        </Link>

        <Link
          href="/agents"
          className="btn-3d-cyan px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 cursor-pointer"
        >
          <Bot className="w-4 h-4" />
          <span>Launch AI Agent Swarm</span>
        </Link>

        <Link
          href="/planner"
          className="btn-3d-purple px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Planner Review (90 Proposals)</span>
        </Link>

        <Link
          href="/scenarios"
          className="btn-3d-glass px-4 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 cursor-pointer"
        >
          <span>Run Scenarios</span>
        </Link>
      </div>
    </div>
  );
}
