"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { AppShell } from "@/components/AppShell";
import { Sparkles, Camera, RotateCcw, Zap, X } from "lucide-react";

interface ShelfItemData {
  id: string;
  name: string;
  sku: string;
  category: "produce" | "bakery" | "dairy" | "meat";
  shelfTier: number;
  initialFreshness: number;
  currentFreshness: number;
  hoursRemaining: number;
  price: string;
  markdownPrice?: string;
  status: "pristine" | "moderate" | "critical";
  position: [number, number, number];
  color: number;
  geometryType:
    | "avocado"
    | "bread"
    | "milk"
    | "meat"
    | "tomato"
    | "yogurt"
    | "banana"
    | "greens"
    | "eggs";
}

type CameraMode = "isometric" | "produce" | "bakery" | "dairy";

const initialShelfItems: ShelfItemData[] = [
  // Tier 2 (Top - Bakery & Snacks)
  {
    id: "item-1",
    name: "Artisan Sourdough Loaf",
    sku: "BREAD-WH",
    category: "bakery",
    shelfTier: 2,
    initialFreshness: 82,
    currentFreshness: 74,
    hoursRemaining: 36,
    price: "4.50",
    markdownPrice: "3.20",
    status: "moderate",
    position: [-2.2, 1.8, 0],
    color: 0xc8963e,
    geometryType: "bread",
  },
  {
    id: "item-2",
    name: "Golden Brioche Buns",
    sku: "BUN-6PK",
    category: "bakery",
    shelfTier: 2,
    initialFreshness: 94,
    currentFreshness: 92,
    hoursRemaining: 72,
    price: "3.80",
    status: "pristine",
    position: [-0.8, 1.8, 0],
    color: 0xe0a94b,
    geometryType: "bread",
  },
  {
    id: "item-3",
    name: "Whole Wheat Country Loaf",
    sku: "BREAD-WW",
    category: "bakery",
    shelfTier: 2,
    initialFreshness: 45,
    currentFreshness: 38,
    hoursRemaining: 18,
    price: "4.20",
    markdownPrice: "2.50",
    status: "critical",
    position: [0.8, 1.8, 0],
    color: 0x9b6b2f,
    geometryType: "bread",
  },
  {
    id: "item-4",
    name: "Butter Croissants (4-Pack)",
    sku: "CROIS-4PK",
    category: "bakery",
    shelfTier: 2,
    initialFreshness: 88,
    currentFreshness: 85,
    hoursRemaining: 48,
    price: "5.50",
    status: "pristine",
    position: [2.2, 1.8, 0],
    color: 0xd9a74a,
    geometryType: "bread",
  },

  // Tier 1 (Middle - Produce)
  {
    id: "item-5",
    name: "Organic Hass Avocados",
    sku: "AVOC-2PK",
    category: "produce",
    shelfTier: 1,
    initialFreshness: 55,
    currentFreshness: 42,
    hoursRemaining: 24,
    price: "5.99",
    markdownPrice: "3.59",
    status: "critical",
    position: [-2.4, 0.4, 0],
    color: 0x2e4f20,
    geometryType: "avocado",
  },
  {
    id: "item-6",
    name: "Vine Ripe Roma Tomatoes",
    sku: "TOM-500G",
    category: "produce",
    shelfTier: 1,
    initialFreshness: 78,
    currentFreshness: 70,
    hoursRemaining: 54,
    price: "2.99",
    status: "moderate",
    position: [-0.8, 0.4, 0],
    color: 0xef4444,
    geometryType: "tomato",
  },
  {
    id: "item-7",
    name: "Fresh Baby Spinach 200g",
    sku: "SPIN-200G",
    category: "produce",
    shelfTier: 1,
    initialFreshness: 92,
    currentFreshness: 89,
    hoursRemaining: 84,
    price: "3.49",
    status: "pristine",
    position: [0.8, 0.4, 0],
    color: 0x10b981,
    geometryType: "greens",
  },
  {
    id: "item-8",
    name: "Fairtrade Bananas 1kg",
    sku: "BAN-1KG",
    category: "produce",
    shelfTier: 1,
    initialFreshness: 48,
    currentFreshness: 35,
    hoursRemaining: 16,
    price: "1.99",
    markdownPrice: "1.19",
    status: "critical",
    position: [2.4, 0.4, 0],
    color: 0xfacc15,
    geometryType: "banana",
  },

  // Tier 0 (Bottom - Dairy & Chilled Protein)
  {
    id: "item-9",
    name: "Organic Whole Milk 1L",
    sku: "MILK-1L",
    category: "dairy",
    shelfTier: 0,
    initialFreshness: 68,
    currentFreshness: 60,
    hoursRemaining: 40,
    price: "3.29",
    markdownPrice: "2.30",
    status: "moderate",
    position: [-2.2, -1.0, 0],
    color: 0x38bdf8,
    geometryType: "milk",
  },
  {
    id: "item-10",
    name: "Greek Yogurt 500g",
    sku: "YOG-500G",
    category: "dairy",
    shelfTier: 0,
    initialFreshness: 98,
    currentFreshness: 96,
    hoursRemaining: 140,
    price: "4.79",
    status: "pristine",
    position: [-0.8, -1.0, 0],
    color: 0x0284c7,
    geometryType: "yogurt",
  },
  {
    id: "item-11",
    name: "Atlantic Fresh Salmon Fillet",
    sku: "SALM-300G",
    category: "meat",
    shelfTier: 0,
    initialFreshness: 42,
    currentFreshness: 28,
    hoursRemaining: 12,
    price: "9.99",
    markdownPrice: "6.49",
    status: "critical",
    position: [0.8, -1.0, 0],
    color: 0xf43f5e,
    geometryType: "meat",
  },
  {
    id: "item-12",
    name: "Farm Fresh Pasture Eggs (12-Pack)",
    sku: "EGGS-12",
    category: "dairy",
    shelfTier: 0,
    initialFreshness: 95,
    currentFreshness: 93,
    hoursRemaining: 180,
    price: "5.29",
    status: "pristine",
    position: [2.2, -1.0, 0],
    color: 0xf59e0b,
    geometryType: "eggs",
  },
];

const CAMERA_VIEWS: Record<
  CameraMode,
  { position: [number, number, number]; target: [number, number, number] }
> = {
  isometric: { position: [5.1, 2.8, 8.3], target: [0, 0.25, 0] },
  bakery: { position: [0.8, 3.35, 5.2], target: [0, 1.8, 0] },
  produce: { position: [-0.4, 1.25, 3.6], target: [0, 0.4, 0] },
  dairy: { position: [0.6, -0.55, 3.5], target: [0, -1.0, 0] },
};

const STATUS_COLORS = {
  pristine: 0x10b981,
  moderate: 0xf59e0b,
  critical: 0xf43f5e,
} as const;

function statusColor(status: ShelfItemData["status"]) {
  return STATUS_COLORS[status];
}

function roundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function createProductLabel(item: ShelfItemData, accent: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 340;
  canvas.height = 100;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(4, 14, 10, 0.84)";
    roundedRectPath(ctx, 2, 2, canvas.width - 4, canvas.height - 4, 16);
    ctx.fill();
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = accent;
    roundedRectPath(ctx, 12, 18, 5, 64, 3);
    ctx.fill();

    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#f8fafc";
    ctx.font = "700 24px ui-sans-serif, system-ui, sans-serif";
    const displayName =
      item.name.length > 23 ? `${item.name.slice(0, 22)}...` : item.name;
    ctx.fillText(displayName, 28, 35);

    ctx.fillStyle = "#93a8a0";
    ctx.font = "600 17px ui-monospace, SFMono-Regular, monospace";
    ctx.fillText(item.sku, 28, 68);

    ctx.textAlign = "right";
    ctx.fillStyle = accent;
    ctx.font = "800 25px ui-monospace, SFMono-Regular, monospace";
    ctx.fillText(`$${item.markdownPrice ?? item.price}`, canvas.width - 18, 52);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
    })
  );
  sprite.scale.set(0.95, 0.28, 1);
  return sprite;
}

function createTierSign(text: string, accent: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 120;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(4, 14, 10, 0.72)";
    roundedRectPath(ctx, 2, 2, canvas.width - 4, canvas.height - 4, 20);
    ctx.fill();
    ctx.strokeStyle = accent;
    ctx.globalAlpha = 0.6;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.globalAlpha = 1;

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = accent;
    ctx.font = "800 34px ui-monospace, SFMono-Regular, monospace";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
    })
  );
  sprite.scale.set(1.45, 0.27, 1);
  return sprite;
}

function addMesh(
  group: THREE.Group,
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
  position: [number, number, number] = [0, 0, 0]
) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

function createProductGroup(item: ShelfItemData) {
  const group = new THREE.Group();
  group.position.set(...item.position);
  group.userData.itemId = item.id;
  group.userData.baseY = item.position[1];

  const accent = `#${item.color.toString(16).padStart(6, "0")}`;
  const bodyMaterial = new THREE.MeshPhysicalMaterial({
    color: item.color,
    roughness: 0.38,
    metalness: 0.06,
    clearcoat: 0.7,
    clearcoatRoughness: 0.24,
    sheen: 0.35,
    sheenColor: new THREE.Color(item.color),
  });
  group.userData.coreMaterial = bodyMaterial;

  let labelHeight = 0.55;

  if (item.geometryType === "avocado") {
    const bodyGeo = new THREE.SphereGeometry(0.26, 40, 32);
    bodyGeo.scale(1, 1.32, 0.9);
    addMesh(group, bodyGeo, bodyMaterial);

    const stemMat = new THREE.MeshStandardMaterial({
      color: 0x5b3a1e,
      roughness: 0.95,
    });
    addMesh(group, new THREE.CylinderGeometry(0.025, 0.038, 0.11, 12), stemMat, [
      0,
      0.37,
      0,
    ]);

    const leafMat = new THREE.MeshStandardMaterial({
      color: 0x4f9a45,
      roughness: 0.68,
    });
    const leaf = addMesh(
      group,
      new THREE.SphereGeometry(0.1, 16, 12),
      leafMat,
      [0.09, 0.43, 0]
    );
    leaf.scale.set(1.7, 0.2, 0.72);
    leaf.rotation.z = -0.35;
    labelHeight = 0.62;
  } else if (item.geometryType === "bread") {
    addMesh(
      group,
      new RoundedBoxGeometry(0.62, 0.31, 0.4, 4, 0.075),
      bodyMaterial
    );

    const scoreMat = new THREE.MeshStandardMaterial({
      color: 0x8a5a25,
      roughness: 0.9,
    });
    for (let index = 0; index < 3; index += 1) {
      const score = addMesh(
        group,
        new THREE.BoxGeometry(0.34, 0.012, 0.028),
        scoreMat,
        [0, 0.158, -0.1 + index * 0.1]
      );
      score.rotation.z = 0.08;
    }

    const flourMat = new THREE.MeshStandardMaterial({
      color: 0xf3dfb8,
      roughness: 1,
    });
    const dust = addMesh(
      group,
      new THREE.SphereGeometry(0.09, 12, 8),
      flourMat,
      [-0.18, 0.158, 0]
    );
    dust.scale.set(1.5, 0.08, 0.8);
    labelHeight = 0.43;
  } else if (item.geometryType === "milk") {
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xf8fbff,
      transmission: 0.35,
      transparent: true,
      opacity: 0.92,
      roughness: 0.12,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      thickness: 0.25,
    });
    addMesh(
      group,
      new THREE.CylinderGeometry(0.18, 0.22, 0.68, 40, 1, false),
      glassMat
    );

    const milkMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.55,
    });
    addMesh(
      group,
      new THREE.CylinderGeometry(0.163, 0.198, 0.45, 32),
      milkMat,
      [0, -0.09, 0]
    );

    const labelMat = new THREE.MeshStandardMaterial({
      color: item.color,
      roughness: 0.32,
      metalness: 0.15,
    });
    addMesh(
      group,
      new THREE.CylinderGeometry(0.222, 0.222, 0.19, 40, 1, true),
      labelMat,
      [0, -0.07, 0]
    );

    addMesh(
      group,
      new THREE.CylinderGeometry(0.19, 0.19, 0.06, 32),
      new THREE.MeshStandardMaterial({ color: item.color, roughness: 0.28 }),
      [0, 0.37, 0]
    );
    labelHeight = 0.62;
  } else if (item.geometryType === "tomato") {
    const bodyGeo = new THREE.SphereGeometry(0.25, 40, 32);
    bodyGeo.scale(1, 0.9, 1);
    addMesh(group, bodyGeo, bodyMaterial);

    const calyxMat = new THREE.MeshStandardMaterial({
      color: 0x2f8f3e,
      roughness: 0.7,
      side: THREE.DoubleSide,
    });
    for (let index = 0; index < 5; index += 1) {
      const angle = (index / 5) * Math.PI * 2;
      const leaf = addMesh(
        group,
        new THREE.BoxGeometry(0.13, 0.012, 0.035),
        calyxMat,
        [Math.cos(angle) * 0.07, 0.22, Math.sin(angle) * 0.07]
      );
      leaf.rotation.y = -angle;
      leaf.rotation.z = 0.12;
    }
    addMesh(
      group,
      new THREE.CylinderGeometry(0.018, 0.026, 0.1, 10),
      calyxMat,
      [0, 0.28, 0]
    );
    labelHeight = 0.53;
  } else if (item.geometryType === "yogurt") {
    addMesh(
      group,
      new THREE.CylinderGeometry(0.25, 0.19, 0.4, 40),
      bodyMaterial
    );
    addMesh(
      group,
      new THREE.CylinderGeometry(0.265, 0.265, 0.035, 40),
      new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.4 }),
      [0, 0.21, 0]
    );
    const bandMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.38,
    });
    addMesh(
      group,
      new THREE.CylinderGeometry(0.242, 0.226, 0.13, 40, 1, true),
      bandMat,
      [0, -0.02, 0]
    );
    labelHeight = 0.47;
  } else if (item.geometryType === "banana") {
    const bananaMat = new THREE.MeshPhysicalMaterial({
      color: item.color,
      roughness: 0.48,
      clearcoat: 0.25,
      clearcoatRoughness: 0.4,
    });

    const bananaGeo = new THREE.TorusGeometry(0.2, 0.055, 14, 36, Math.PI * 0.92);
    const bananaOne = addMesh(group, bananaGeo, bananaMat, [0, 0.05, 0]);
    bananaOne.rotation.set(Math.PI / 2, 0.15, Math.PI * 0.05);

    const bananaTwo = addMesh(group, bananaGeo, bananaMat, [0.02, 0.1, 0.04]);
    bananaTwo.rotation.set(Math.PI / 2, -0.25, -Math.PI * 0.06);
    bananaTwo.scale.setScalar(0.9);

    const tipMat = new THREE.MeshStandardMaterial({
      color: 0x735022,
      roughness: 0.95,
    });
    addMesh(group, new THREE.SphereGeometry(0.045, 10, 8), tipMat, [
      -0.18,
      0.08,
      0.06,
    ]);
    addMesh(group, new THREE.SphereGeometry(0.038, 10, 8), tipMat, [
      0.2,
      0.1,
      -0.02,
    ]);
    labelHeight = 0.48;
  } else if (item.geometryType === "greens") {
    const leafMat = new THREE.MeshPhysicalMaterial({
      color: item.color,
      roughness: 0.45,
      clearcoat: 0.5,
      clearcoatRoughness: 0.35,
      side: THREE.DoubleSide,
    });
    for (let index = 0; index < 6; index += 1) {
      const angle = (index / 6) * Math.PI * 2;
      const leaf = addMesh(
        group,
        new THREE.SphereGeometry(0.14, 18, 14),
        leafMat,
        [Math.cos(angle) * 0.07, 0.1 + (index % 2) * 0.04, Math.sin(angle) * 0.07]
      );
      leaf.scale.set(1.45, 0.42, 0.8);
      leaf.rotation.set(0.15, -angle, 0.35);
    }
    addMesh(
      group,
      new THREE.CylinderGeometry(0.045, 0.065, 0.12, 12),
      new THREE.MeshStandardMaterial({ color: 0x7ba05b, roughness: 0.85 }),
      [0, 0.02, 0]
    );
    labelHeight = 0.5;
  } else if (item.geometryType === "eggs") {
    const cartonMat = new THREE.MeshStandardMaterial({
      color: item.color,
      roughness: 0.72,
      metalness: 0.02,
    });
    addMesh(
      group,
      new RoundedBoxGeometry(0.58, 0.14, 0.38, 4, 0.04),
      cartonMat,
      [0, -0.02, 0]
    );

    const eggMat = new THREE.MeshPhysicalMaterial({
      color: 0xf6e8d2,
      roughness: 0.42,
      clearcoat: 0.35,
      clearcoatRoughness: 0.3,
    });
    for (let row = 0; row < 2; row += 1) {
      for (let column = 0; column < 3; column += 1) {
        const egg = addMesh(
          group,
          new THREE.SphereGeometry(0.072, 20, 16),
          eggMat,
          [-0.16 + column * 0.16, 0.09, -0.08 + row * 0.16]
        );
        egg.scale.set(1, 1.18, 1);
      }
    }
    labelHeight = 0.42;
  } else {
    addMesh(
      group,
      new RoundedBoxGeometry(0.55, 0.17, 0.36, 4, 0.045),
      bodyMaterial,
      [0, 0.02, 0]
    );

    if (item.category === "meat") {
      const trayMat = new THREE.MeshStandardMaterial({
        color: 0xb9c5c9,
        roughness: 0.3,
        metalness: 0.88,
      });
      addMesh(
        group,
        new RoundedBoxGeometry(0.62, 0.035, 0.42, 3, 0.03),
        trayMat,
        [0, -0.08, 0]
      );

      const fatMat = new THREE.MeshStandardMaterial({
        color: 0xffe4e0,
        roughness: 0.6,
      });
      for (let index = 0; index < 4; index += 1) {
        const stripe = addMesh(
          group,
          new THREE.BoxGeometry(0.018, 0.006, 0.27),
          fatMat,
          [-0.16 + index * 0.105, 0.107, 0]
        );
        stripe.rotation.z = 0.35;
      }
    }
    labelHeight = 0.43;
  }

  const label = createProductLabel(item, accent);
  label.position.set(0, labelHeight + 0.26, 0.12);
  group.add(label);

  return group;
}

interface SceneContext {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
  itemGroups: Map<string, THREE.Group>;
  glowMeshes: Map<string, THREE.Mesh>;
}

export default function Shelves3DPage() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<ShelfItemData[]>(initialShelfItems);
  const [selectedItem, setSelectedItem] = useState<ShelfItemData | null>(null);
  const [hoveredItem, setHoveredItem] = useState<ShelfItemData | null>(null);
  const [isTimeLapseRunning, setIsTimeLapseRunning] = useState<boolean>(false);
  const [simulatedHoursElapsed, setSimulatedHoursElapsed] = useState<number>(0);
  const [cameraMode, setCameraMode] = useState<CameraMode>("isometric");

  const sceneContextRef = useRef<SceneContext | null>(null);
  const cameraGoalRef = useRef<{
    position: THREE.Vector3;
    target: THREE.Vector3;
  } | null>(null);
  const itemsRef = useRef<ShelfItemData[]>(items);
  const timeLapseRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;
    const width = container.clientWidth || 900;
    const height = container.clientHeight || 620;

    // 1. Scene & atmospheric depth
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050d0a, 0.032);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    const initialView = CAMERA_VIEWS.isometric;
    camera.position.set(...initialView.position);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.touchAction = "none";
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 4. Image-based lighting for realistic glass, metal, and produce highlights
    const pmrem = new THREE.PMREMGenerator(renderer);
    const environmentTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = environmentTarget.texture;

    // 5. Orbit controls: true drag-to-rotate and scroll-to-zoom
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.075;
    controls.enablePan = false;
    controls.minDistance = 3.2;
    controls.maxDistance = 12;
    controls.minPolarAngle = Math.PI * 0.2;
    controls.maxPolarAngle = Math.PI * 0.66;
    controls.target.set(...initialView.target);
    controls.update();

    // 6. Vibrant multi-color studio lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.38));
    scene.add(new THREE.HemisphereLight(0xd9fff0, 0x06120d, 0.75));

    const dirLight = new THREE.DirectionalLight(0xfffbeb, 2.1);
    dirLight.position.set(5, 8, 6);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.set(2048, 2048);
    dirLight.shadow.camera.left = -8;
    dirLight.shadow.camera.right = 8;
    dirLight.shadow.camera.top = 7;
    dirLight.shadow.camera.bottom = -5;
    dirLight.shadow.bias = -0.0004;
    scene.add(dirLight);

    const cyanLight = new THREE.PointLight(0x06b6d4, 4.5, 14);
    cyanLight.position.set(-4.5, 2, 3.2);
    scene.add(cyanLight);

    const purpleLight = new THREE.PointLight(0xa855f7, 4.2, 14);
    purpleLight.position.set(4.5, 2, 3.2);
    scene.add(purpleLight);

    const emeraldLight = new THREE.PointLight(0x10b981, 3.2, 10);
    emeraldLight.position.set(0, 0.2, 2.4);
    scene.add(emeraldLight);

    // 7. Reflective floor + brushed-metal shelving unit
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x07120d,
      roughness: 0.3,
      metalness: 0.78,
    });
    const floor = new THREE.Mesh(new THREE.CircleGeometry(16, 72), floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2.32;
    floor.receiveShadow = true;
    scene.add(floor);

    const grid = new THREE.GridHelper(18, 36, 0x1b4a39, 0x0c2019);
    grid.position.y = -2.3;
    const gridMaterial = grid.material as THREE.Material;
    gridMaterial.transparent = true;
    gridMaterial.opacity = 0.32;
    scene.add(grid);

    const frameMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x1a2b24,
      roughness: 0.27,
      metalness: 0.86,
      clearcoat: 0.55,
      clearcoatRoughness: 0.18,
    });
    const shelfBackMaterial = new THREE.MeshStandardMaterial({
      color: 0x08130e,
      roughness: 0.76,
      metalness: 0.3,
    });
    const tierMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x193229,
      roughness: 0.22,
      metalness: 0.8,
      clearcoat: 0.45,
      clearcoatRoughness: 0.2,
    });

    const backMesh = new THREE.Mesh(
      new RoundedBoxGeometry(6.9, 4.75, 0.14, 4, 0.05),
      shelfBackMaterial
    );
    backMesh.position.set(0, 0.5, -0.62);
    backMesh.receiveShadow = true;
    scene.add(backMesh);

    const topCap = new THREE.Mesh(
      new RoundedBoxGeometry(7.05, 0.26, 1.45, 3, 0.05),
      frameMaterial
    );
    topCap.position.set(0, 2.82, 0);
    topCap.castShadow = true;
    topCap.receiveShadow = true;
    scene.add(topCap);

    const basePlinth = new THREE.Mesh(
      new RoundedBoxGeometry(7.05, 0.34, 1.45, 3, 0.05),
      frameMaterial
    );
    basePlinth.position.set(0, -1.48, 0);
    basePlinth.castShadow = true;
    basePlinth.receiveShadow = true;
    scene.add(basePlinth);

    const tierMeta = [
      { y: -1.2, color: 0x06b6d4, label: "CHILLED · DAIRY & MEAT" },
      { y: 0.2, color: 0x10b981, label: "FRESH · PRODUCE" },
      { y: 1.6, color: 0xf59e0b, label: "BAKERY · ARTISAN" },
    ];

    tierMeta.forEach((tier) => {
      const tierMesh = new THREE.Mesh(
        new RoundedBoxGeometry(6.6, 0.12, 1.3, 3, 0.035),
        tierMaterial
      );
      tierMesh.position.set(0, tier.y, 0);
      tierMesh.castShadow = true;
      tierMesh.receiveShadow = true;
      scene.add(tierMesh);

      const ledMaterial = new THREE.MeshStandardMaterial({
        color: tier.color,
        emissive: tier.color,
        emissiveIntensity: 2.4,
        roughness: 0.25,
      });
      const ledStrip = new THREE.Mesh(
        new THREE.BoxGeometry(6.4, 0.035, 0.055),
        ledMaterial
      );
      ledStrip.position.set(0, tier.y + 0.055, 0.62);
      scene.add(ledStrip);

      const priceRail = new THREE.Mesh(
        new THREE.BoxGeometry(6.42, 0.09, 0.075),
        new THREE.MeshStandardMaterial({
          color: 0x0f1f19,
          roughness: 0.4,
          metalness: 0.55,
        })
      );
      priceRail.position.set(0, tier.y + 0.12, 0.66);
      priceRail.castShadow = true;
      scene.add(priceRail);

      const tierGlow = new THREE.PointLight(tier.color, 2.2, 3.4);
      tierGlow.position.set(0, tier.y + 0.32, 0.72);
      scene.add(tierGlow);

      const sign = createTierSign(tier.label, `#${tier.color.toString(16)}`);
      sign.position.set(-2.55, tier.y + 0.52, -0.53);
      scene.add(sign);
    });

    const leftPillar = new THREE.Mesh(
      new RoundedBoxGeometry(0.2, 4.72, 1.3, 3, 0.04),
      frameMaterial
    );
    leftPillar.position.set(-3.37, 0.5, 0);
    leftPillar.castShadow = true;
    leftPillar.receiveShadow = true;
    scene.add(leftPillar);

    const rightPillar = new THREE.Mesh(
      new RoundedBoxGeometry(0.2, 4.72, 1.3, 3, 0.04),
      frameMaterial
    );
    rightPillar.position.set(3.37, 0.5, 0);
    rightPillar.castShadow = true;
    rightPillar.receiveShadow = true;
    scene.add(rightPillar);

    const pillarTrimMaterial = new THREE.MeshBasicMaterial({ color: 0x34d399 });
    const leftTrim = new THREE.Mesh(
      new THREE.BoxGeometry(0.025, 4.2, 0.055),
      pillarTrimMaterial
    );
    leftTrim.position.set(-3.26, 0.5, 0.66);
    scene.add(leftTrim);
    const rightTrim = new THREE.Mesh(
      new THREE.BoxGeometry(0.025, 4.2, 0.055),
      pillarTrimMaterial
    );
    rightTrim.position.set(3.26, 0.5, 0.66);
    scene.add(rightTrim);

    // 8. Generate detailed 3D products + freshness halo rings
    const itemGroups = new Map<string, THREE.Group>();
    const glowMeshes = new Map<string, THREE.Mesh>();
    const haloOffsets: Record<ShelfItemData["geometryType"], number> = {
      avocado: 0.16,
      bread: 0.16,
      milk: 0.36,
      meat: 0.14,
      tomato: 0.13,
      yogurt: 0.2,
      banana: 0.08,
      greens: 0.12,
      eggs: 0.12,
    };

    initialShelfItems.forEach((item) => {
      const group = createProductGroup(item);
      scene.add(group);
      itemGroups.set(item.id, group);

      const haloRadius =
        item.geometryType === "bread" || item.geometryType === "eggs" ? 0.35 : 0.3;
      const haloGeo = new THREE.RingGeometry(
        haloRadius - 0.035,
        haloRadius,
        48
      );
      const haloMat = new THREE.MeshBasicMaterial({
        color: statusColor(item.status),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.82,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      haloMesh.rotation.x = -Math.PI / 2;
      haloMesh.position.set(
        item.position[0],
        item.position[1] - haloOffsets[item.geometryType],
        item.position[2]
      );
      haloMesh.userData.itemId = item.id;
      scene.add(haloMesh);
      glowMeshes.set(item.id, haloMesh);
    });

    // 9. Raycast picking (works with nested product detail meshes)
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let hoveredId: string | null = null;
    let pointerDownAt: { x: number; y: number } | null = null;

    const pickItemId = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return null;

      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);

      const hits = raycaster.intersectObjects(
        Array.from(itemGroups.values()),
        true
      );
      for (const hit of hits) {
        let node: THREE.Object3D | null = hit.object;
        while (node) {
          const id = node.userData.itemId as string | undefined;
          if (id) return id;
          node = node.parent;
        }
      }
      return null;
    };

    const handlePointerMove = (event: PointerEvent) => {
      const id = pickItemId(event.clientX, event.clientY);
      if (id === hoveredId) return;

      hoveredId = id;
      setHoveredItem(
        id ? itemsRef.current.find((item) => item.id === id) ?? null : null
      );
      renderer.domElement.style.cursor = id ? "pointer" : "grab";
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (event.button === 0) {
        pointerDownAt = { x: event.clientX, y: event.clientY };
      }
    };

    const handlePointerUp = (event: PointerEvent) => {
      if (!pointerDownAt) return;
      const distance = Math.hypot(
        event.clientX - pointerDownAt.x,
        event.clientY - pointerDownAt.y
      );
      pointerDownAt = null;
      if (distance > 6) return;

      const id = pickItemId(event.clientX, event.clientY);
      if (!id) return;
      const matched = itemsRef.current.find((item) => item.id === id);
      if (matched) setSelectedItem(matched);
    };

    const handlePointerLeave = () => {
      hoveredId = null;
      setHoveredItem(null);
      renderer.domElement.style.cursor = "grab";
    };

    const handleControlStart = () => {
      cameraGoalRef.current = null;
    };

    renderer.domElement.style.cursor = "grab";
    renderer.domElement.addEventListener("pointermove", handlePointerMove);
    renderer.domElement.addEventListener("pointerdown", handlePointerDown);
    renderer.domElement.addEventListener("pointerup", handlePointerUp);
    renderer.domElement.addEventListener("pointerleave", handlePointerLeave);
    controls.addEventListener("start", handleControlStart);

    // 10. Animation loop
    const timer = new THREE.Timer();
    timer.connect(document);
    let frameId = 0;

    const animate = (timestamp?: number) => {
      timer.update(timestamp);
      const elapsedTime = timer.getElapsed();

      itemGroups.forEach((group) => {
        const baseY = group.userData.baseY as number;
        const wilt = (group.userData.wilt as number) ?? 0;
        group.rotation.y =
          Math.sin(elapsedTime * 0.7 + group.position.x) * 0.08;
        group.rotation.z += (wilt - group.rotation.z) * 0.045;
        group.position.y =
          baseY + Math.sin(elapsedTime * 1.2 + group.position.x) * 0.012;
      });

      glowMeshes.forEach((halo) => {
        const pulse = 1 + Math.sin(elapsedTime * 3.2 + halo.position.x) * 0.08;
        halo.scale.set(pulse, pulse, 1);
        halo.rotation.z = elapsedTime * 0.35;
      });

      cyanLight.position.x = -4.5 + Math.sin(elapsedTime * 0.7) * 0.8;
      purpleLight.position.x = 4.5 - Math.sin(elapsedTime * 0.7) * 0.8;

      const goal = cameraGoalRef.current;
      if (goal) {
        camera.position.lerp(goal.position, 0.085);
        controls.target.lerp(goal.target, 0.085);
        if (
          camera.position.distanceTo(goal.position) < 0.015 &&
          controls.target.distanceTo(goal.target) < 0.015
        ) {
          cameraGoalRef.current = null;
        }
      }

      controls.update();
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);

    sceneContextRef.current = {
      scene,
      camera,
      renderer,
      controls,
      itemGroups,
      glowMeshes,
    };

    // 11. Responsive resize without a window listener
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight || 620;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    handleResize();

    return () => {
      resizeObserver.disconnect();
      controls.removeEventListener("start", handleControlStart);
      renderer.domElement.removeEventListener("pointermove", handlePointerMove);
      renderer.domElement.removeEventListener("pointerdown", handlePointerDown);
      renderer.domElement.removeEventListener("pointerup", handlePointerUp);
      renderer.domElement.removeEventListener("pointerleave", handlePointerLeave);
      controls.dispose();
      timer.dispose();
      cancelAnimationFrame(frameId);
      sceneContextRef.current = null;
      cameraGoalRef.current = null;

      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const material = mesh.material;
        if (Array.isArray(material)) {
          material.forEach((entry) => {
            const map = (entry as THREE.MeshBasicMaterial).map;
            if (map) map.dispose();
            entry.dispose();
          });
        } else if (material) {
          const map = (material as THREE.MeshBasicMaterial).map;
          if (map) map.dispose();
          material.dispose();
        }
      });

      environmentTarget.dispose();
      pmrem.dispose();
      renderer.dispose();
      container.innerHTML = "";
    };
  }, []);

  useEffect(() => {
    const context = sceneContextRef.current;
    if (!context) return;

    items.forEach((item) => {
      const halo = context.glowMeshes.get(item.id);
      if (halo) {
        const haloMaterial = halo.material as THREE.MeshBasicMaterial;
        haloMaterial.color.lerp(new THREE.Color(statusColor(item.status)), 0.4);
        haloMaterial.opacity = item.status === "critical" ? 0.95 : 0.78;
      }

      const group = context.itemGroups.get(item.id);
      if (!group) return;

      group.userData.wilt =
        item.status === "critical" ? 0.14 : item.status === "moderate" ? 0.05 : 0;

      const coreMaterial = group.userData.coreMaterial as
        | THREE.MeshPhysicalMaterial
        | undefined;
      if (!coreMaterial) return;

      const targetColor = new THREE.Color(item.color);
      if (item.status === "moderate") {
        targetColor.lerp(new THREE.Color(0xb48a3a), 0.18);
      } else if (item.status === "critical") {
        targetColor.lerp(new THREE.Color(0x6f5a35), 0.4);
      }
      coreMaterial.color.lerp(targetColor, 0.25);
      const targetRoughness = item.status === "critical" ? 0.72 : 0.38;
      coreMaterial.roughness +=
        (targetRoughness - coreMaterial.roughness) * 0.25;
    });
  }, [items]);

  useEffect(() => {
    return () => {
      if (timeLapseRef.current) clearInterval(timeLapseRef.current);
    };
  }, []);

  const changeCameraView = (mode: CameraMode) => {
    setCameraMode(mode);
    const view = CAMERA_VIEWS[mode];
    cameraGoalRef.current = {
      position: new THREE.Vector3(...view.position),
      target: new THREE.Vector3(...view.target),
    };
  };

  const stopTimeLapse = () => {
    if (timeLapseRef.current) {
      clearInterval(timeLapseRef.current);
      timeLapseRef.current = null;
    }
    setIsTimeLapseRunning(false);
  };

  const handleToggleTimeLapse = () => {
    if (isTimeLapseRunning) {
      stopTimeLapse();
      return;
    }

    let hours = simulatedHoursElapsed;
    if (hours >= 24) {
      hours = 0;
      setSimulatedHoursElapsed(0);
      setItems(initialShelfItems);
    }

    setIsTimeLapseRunning(true);
    timeLapseRef.current = setInterval(() => {
      hours += 2;
      setSimulatedHoursElapsed(hours);

      setItems((prev) =>
        prev.map((item) => {
          const decayRate =
            item.category === "meat"
              ? 5
              : item.category === "produce"
              ? 4
              : item.category === "bakery"
              ? 3
              : 2;
          const decayed = Math.max(4, item.currentFreshness - decayRate);
          const hrsLeft = Math.max(1, item.hoursRemaining - 2);
          const newStatus =
            decayed > 75 ? "pristine" : decayed > 45 ? "moderate" : "critical";
          return {
            ...item,
            currentFreshness: decayed,
            hoursRemaining: hrsLeft,
            status: newStatus,
          };
        })
      );

      if (hours >= 24) {
        if (timeLapseRef.current) {
          clearInterval(timeLapseRef.current);
          timeLapseRef.current = null;
        }
        setIsTimeLapseRunning(false);
      }
    }, 700);
  };

  const handleResetSimulation = () => {
    stopTimeLapse();
    setSimulatedHoursElapsed(0);
    setItems(initialShelfItems);
  };

  const selectedItemId = selectedItem?.id;
  const hoveredItemId = hoveredItem?.id;
  const liveSelectedItem = selectedItemId
    ? items.find((item) => item.id === selectedItemId) ?? selectedItem
    : null;
  const liveHoveredItem = hoveredItemId
    ? items.find((item) => item.id === hoveredItemId) ?? hoveredItem
    : null;

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="card-3d-realistic p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="pill-3d-cyan px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase">
                WebGL 3D Engine
              </span>
              <span className="pill-3d-emerald px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase">
                Perishable Telemetry
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1.5 drop-shadow">
              Photorealistic 3D Grocery Shelves
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Drag to orbit the aisle, scroll to zoom, and click any product to
              inspect its biological telemetry.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleTimeLapse}
              className={`btn-3d-emerald px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg ${
                isTimeLapseRunning ? "ring-2 ring-amber-400" : ""
              }`}
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>
                {isTimeLapseRunning
                  ? `Decay Simulating (+${simulatedHoursElapsed}h)...`
                  : "Simulate 24h Decay"}
              </span>
            </button>

            <button
              onClick={handleResetSimulation}
              className="btn-3d-glass p-2.5 rounded-xl cursor-pointer"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3D Canvas Viewport */}
        <div className="card-3d-realistic p-4 flex flex-col gap-4 relative overflow-hidden">
          {/* Controls Overlay */}
          <div className="flex flex-wrap items-center justify-between gap-3 z-10 px-2 pt-1">
            <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
              <Camera className="w-4 h-4 text-cyan-400 mr-1" />
              <button
                type="button"
                onClick={() => changeCameraView("isometric")}
                className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                  cameraMode === "isometric"
                    ? "btn-3d-cyan"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Aisle 3D
              </button>
              <button
                type="button"
                onClick={() => changeCameraView("bakery")}
                className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                  cameraMode === "bakery"
                    ? "btn-3d-amber"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Bakery
              </button>
              <button
                type="button"
                onClick={() => changeCameraView("produce")}
                className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                  cameraMode === "produce"
                    ? "btn-3d-emerald"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Produce
              </button>
              <button
                type="button"
                onClick={() => changeCameraView("dairy")}
                className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                  cameraMode === "dairy"
                    ? "btn-3d-purple"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                Dairy & Meat
              </button>
            </div>

            {/* Freshness Legend */}
            <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                <span className="text-emerald-400">Pristine (&gt;75%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]" />
                <span className="text-amber-400">Moderate (45-75%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]" />
                <span className="text-rose-400">Critical (&lt;45%)</span>
              </div>
            </div>
          </div>

          {/* 3D WebGL Canvas */}
          <div
            ref={mountRef}
            className="w-full h-[540px] sm:h-[620px] rounded-2xl relative overflow-hidden cursor-grab select-none touch-none bg-gradient-to-b from-[#06090e] via-[#09111b] to-[#06090e]"
          />

          {/* Orbit Instruction Pill */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 pointer-events-none flex flex-wrap items-center justify-center gap-3 rounded-full bg-black/65 backdrop-blur-md border border-white/10 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              Drag to orbit
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Scroll to zoom
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Click to inspect
            </span>
          </div>

          {/* Hover Overlay Card */}
          {liveHoveredItem && (
            <div className="absolute bottom-8 left-8 z-20 card-3d-realistic p-3.5 flex items-center gap-3 pointer-events-none shadow-2xl animate-fadeIn">
              <div
                className="w-4 h-12 rounded-full"
                style={{
                  backgroundColor:
                    liveHoveredItem.status === "pristine"
                      ? "#10b981"
                      : liveHoveredItem.status === "moderate"
                      ? "#f59e0b"
                      : "#f43f5e",
                  boxShadow: `0 0 14px ${
                    liveHoveredItem.status === "pristine"
                      ? "#10b981"
                      : liveHoveredItem.status === "moderate"
                      ? "#f59e0b"
                      : "#f43f5e"
                  }`,
                }}
              />
              <div>
                <h4 className="text-sm font-bold text-white">
                  {liveHoveredItem.name}
                </h4>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-300 mt-0.5">
                  <span>Freshness: {liveHoveredItem.currentFreshness}%</span>
                  <span>·</span>
                  <span>{liveHoveredItem.hoursRemaining}h left</span>
                  <span>·</span>
                  <span className="text-emerald-400 font-bold">
                    ${liveHoveredItem.markdownPrice || liveHoveredItem.price}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3D Inspection Modal */}
      {liveSelectedItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="card-3d-realistic w-full max-w-lg shadow-2xl overflow-hidden animate-fadeIn border border-white/20">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-sm">
                  3D Hologram Inspection: {liveSelectedItem.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-black/40 border border-white/10">
                <div>
                  <span className="text-slate-400 uppercase font-mono text-[10px]">
                    SKU & Category
                  </span>
                  <p className="text-sm font-bold text-white">
                    {liveSelectedItem.sku} · {liveSelectedItem.category}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 uppercase font-mono text-[10px]">
                    Biological Status
                  </span>
                  <p
                    className={`text-sm font-bold uppercase ${
                      liveSelectedItem.status === "pristine"
                        ? "text-emerald-400"
                        : liveSelectedItem.status === "moderate"
                        ? "text-amber-400"
                        : "text-rose-400"
                    }`}
                  >
                    {liveSelectedItem.status}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 font-mono">
                <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                  <span className="text-[10px] text-slate-400 uppercase">Freshness</span>
                  <p className="text-lg font-bold text-emerald-400 mt-0.5">
                    {liveSelectedItem.currentFreshness}%
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                  <span className="text-[10px] text-slate-400 uppercase">Shelf Life</span>
                  <p className="text-lg font-bold text-amber-400 mt-0.5">
                    {liveSelectedItem.hoursRemaining}h
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                  <span className="text-[10px] text-slate-400 uppercase">Live Price</span>
                  <p className="text-lg font-bold text-cyan-400 mt-0.5">
                    ${liveSelectedItem.markdownPrice || liveSelectedItem.price}
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 text-slate-300 leading-relaxed">
                Autonomous PricePulse agent recommends:{" "}
                <span className="text-emerald-300 font-semibold">
                  {liveSelectedItem.markdownPrice
                    ? "Apply dynamic flash markdown of 35% to clear units before sunset"
                    : "Maintain baseline standard retail pricing"}
                </span>
                .
              </div>
            </div>

            <div className="p-4 bg-black/60 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                className="btn-3d-emerald px-5 py-2 rounded-xl text-xs font-bold cursor-pointer"
              >
                Close Inspection
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
