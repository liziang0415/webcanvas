// lib/room-scene.ts
import * as THREE from 'three'

export interface ScreenMeshes {
  monitor: THREE.Mesh  // back wall — projects
  tv:      THREE.Mesh  // right wall — dev log
  poster:  THREE.Mesh  // left wall — about/skills/contact
}

export interface RoomScene {
  scene:        THREE.Scene
  camera:       THREE.PerspectiveCamera
  renderer:     THREE.WebGLRenderer
  screenMeshes: ScreenMeshes
  resize():     void
  render():     void
}

export function createRoomScene(canvas: HTMLCanvasElement): RoomScene {
  const ROOM_W = 10, ROOM_H = 3.5, ROOM_D = 8
  const HW = ROOM_W / 2, HD = ROOM_D / 2

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x05050a)
  scene.fog = new THREE.FogExp2(0x05050a, 0.05)

  const camera = new THREE.PerspectiveCamera(70, canvas.clientWidth / canvas.clientHeight, 0.01, 100)
  camera.position.set(0, 1.7, 2.5)

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.25

  const wallMat  = new THREE.MeshStandardMaterial({ color: 0x363650, roughness: 0.85 })
  const floorMat = new THREE.MeshStandardMaterial({ color: 0x3a3a55, roughness: 0.7 })
  const ceilMat  = new THREE.MeshStandardMaterial({ color: 0x1e1e30, roughness: 0.95 })
  const deskMat  = new THREE.MeshStandardMaterial({ color: 0x2a2a3a, roughness: 0.7 })

  // Floor
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_W, ROOM_D), floorMat)
  floor.rotation.x = -Math.PI / 2
  scene.add(floor)

  // Ceiling
  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_W, ROOM_D), ceilMat)
  ceiling.rotation.x = Math.PI / 2
  ceiling.position.y = ROOM_H
  scene.add(ceiling)

  // Four walls
  const wallDefs: Array<{ w: number; h: number; pos: [number,number,number]; ry: number }> = [
    { w: ROOM_W, h: ROOM_H, pos: [0,  ROOM_H/2, -HD], ry: 0           },  // back
    { w: ROOM_W, h: ROOM_H, pos: [0,  ROOM_H/2,  HD], ry: Math.PI     },  // front
    { w: ROOM_D, h: ROOM_H, pos: [-HW, ROOM_H/2, 0],  ry: Math.PI/2   },  // left
    { w: ROOM_D, h: ROOM_H, pos: [ HW, ROOM_H/2, 0],  ry: -Math.PI/2  },  // right
  ]
  wallDefs.forEach(({ w, h, pos, ry }) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), wallMat)
    m.position.set(...pos)
    m.rotation.y = ry
    scene.add(m)
  })

  // Desk under monitor
  const deskTop = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.06, 0.8), deskMat)
  deskTop.position.set(0, 0.8, -HD + 0.5)
  scene.add(deskTop)
  ;[-1.4, 1.4].forEach(x => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.8, 0.06), deskMat)
    leg.position.set(x, 0.4, -HD + 0.2)
    scene.add(leg)
  })

  // Screen meshes — textures applied externally by RoomExperience
  const mkScreen = () => new THREE.MeshBasicMaterial({ color: 0x050508 })

  const monitor = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 1.875), mkScreen())
  monitor.position.set(0, 1.85, -HD + 0.02)
  scene.add(monitor)

  const tv = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 1.575), mkScreen())
  tv.position.set(HW - 0.02, 2.1, -1.0)
  tv.rotation.y = -Math.PI / 2
  scene.add(tv)

  const poster = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 2.0), mkScreen())
  poster.position.set(-HW + 0.02, 1.8, 0)
  poster.rotation.y = Math.PI / 2
  scene.add(poster)

  // Lighting — values matched from html-in-canvas.dev demo for visibility
  scene.add(new THREE.AmbientLight(0xa0a0c0, 1.2))

  const overhead = new THREE.PointLight(0xffe4c4, 1.4, 22)
  overhead.position.set(0, ROOM_H - 0.3, 0)
  scene.add(overhead)

  const monitorGlow = new THREE.PointLight(0x4a9eff, 1.4, 7)
  monitorGlow.position.set(0, 1.85, -3.0)
  scene.add(monitorGlow)

  const tvGlow = new THREE.PointLight(0x6c41f0, 1.1, 7)
  tvGlow.position.set(4.0, 2.1, -1.0)
  scene.add(tvGlow)

  const posterGlow = new THREE.PointLight(0x00e5b9, 0.9, 6)
  posterGlow.position.set(-4.0, 1.8, 0)
  scene.add(posterGlow)

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight
    const pr = renderer.getPixelRatio()
    // Compare against the scaled buffer size Three.js would produce
    if (renderer.domElement.width  !== Math.round(w * pr) ||
        renderer.domElement.height !== Math.round(h * pr)) {
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
  }

  return {
    scene, camera, renderer,
    screenMeshes: { monitor, tv, poster },
    resize,
    render: () => renderer.render(scene, camera),
  }
}
