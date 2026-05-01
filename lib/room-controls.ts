// lib/room-controls.ts
import * as THREE from 'three'

const MOVE_SPEED  = 3.0
const LOOK_SPEED  = 0.002
const ROOM_HALF_W = 4.6
const ROOM_HALF_D = 3.6
const EYE_HEIGHT  = 1.7

export interface RoomControls {
  readonly isLocked: boolean
  update(deltaSeconds: number): void
  dispose(): void
}

export function createRoomControls(
  lockTarget: HTMLElement,
  camera: THREE.PerspectiveCamera,
  onLockChange: (locked: boolean) => void
): RoomControls {
  const euler = new THREE.Euler(0, 0, 0, 'YXZ')
  const keys: Record<string, boolean> = {}
  let isLocked = false

  const onMouseMove = (e: MouseEvent) => {
    if (!isLocked) return
    euler.setFromQuaternion(camera.quaternion)
    euler.y -= e.movementX * LOOK_SPEED
    euler.x  = Math.max(
      -Math.PI / 2 + 0.05,
      Math.min(Math.PI / 2 - 0.05, euler.x - e.movementY * LOOK_SPEED)
    )
    camera.quaternion.setFromEuler(euler)
  }

  const onKeyDown = (e: KeyboardEvent) => { keys[e.code] = true }
  const onKeyUp   = (e: KeyboardEvent) => { keys[e.code] = false }

  const onPointerLockChange = () => {
    isLocked = document.pointerLockElement === lockTarget
    onLockChange(isLocked)
  }

  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('keydown', onKeyDown)
  document.addEventListener('keyup', onKeyUp)
  document.addEventListener('pointerlockchange', onPointerLockChange)

  function update(dt: number) {
    if (!isLocked) return

    const fwd = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion)
    fwd.y = 0; fwd.normalize()

    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion)
    right.y = 0; right.normalize()

    const v = new THREE.Vector3()
    if (keys['KeyW'] || keys['ArrowUp'])    v.add(fwd)
    if (keys['KeyS'] || keys['ArrowDown'])  v.sub(fwd)
    if (keys['KeyA'] || keys['ArrowLeft'])  v.sub(right)
    if (keys['KeyD'] || keys['ArrowRight']) v.add(right)

    if (v.lengthSq() > 0) {
      v.normalize().multiplyScalar(MOVE_SPEED * dt)
      camera.position.add(v)
      camera.position.x = Math.max(-ROOM_HALF_W, Math.min(ROOM_HALF_W, camera.position.x))
      camera.position.z = Math.max(-ROOM_HALF_D, Math.min(ROOM_HALF_D, camera.position.z))
      camera.position.y = EYE_HEIGHT
    }
  }

  function dispose() {
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('keydown', onKeyDown)
    document.removeEventListener('keyup', onKeyUp)
    document.removeEventListener('pointerlockchange', onPointerLockChange)
  }

  return {
    get isLocked() { return isLocked },
    update,
    dispose,
  }
}
