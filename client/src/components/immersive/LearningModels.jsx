import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function PathTube({ points, radius, color, roughness = 0.55, transparent = false, opacity = 1 }) {
  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(points.map(point => new THREE.Vector3(...point)))
    return new THREE.TubeGeometry(curve, Math.max(20, points.length * 8), radius, 10, false)
  }, [points, radius])

  return <mesh geometry={geometry}><meshStandardMaterial color={color} roughness={roughness} transparent={transparent} opacity={opacity} /></mesh>
}

function LinkCylinder({ start, end, radius, color, metalness = 0, roughness = 0.45 }) {
  const a = new THREE.Vector3(...start)
  const b = new THREE.Vector3(...end)
  const delta = b.clone().sub(a)
  return (
    <mesh position={a.clone().add(b).multiplyScalar(0.5)} quaternion={new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), delta.clone().normalize())}>
      <cylinderGeometry args={[radius, radius, delta.length(), 20]} />
      <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
    </mesh>
  )
}

function Lung({ patientLeft = false }) {
  const profile = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(0.015, 0.8)
    shape.bezierCurveTo(-0.18, 0.78, -0.32, 0.58, -0.34, 0.36)
    shape.bezierCurveTo(-0.38, 0.11, -0.24, -0.08, -0.08, -0.09)
    shape.bezierCurveTo(0.055, -0.1, 0.12, 0.04, 0.105, 0.19)
    if (patientLeft) {
      shape.bezierCurveTo(0.075, 0.29, 0.16, 0.34, 0.12, 0.45)
    }
    shape.bezierCurveTo(0.075, 0.57, 0.13, 0.73, 0.015, 0.8)
    return shape
  }, [patientLeft])

  const fissureLines = patientLeft
    ? [[[-0.02, 0.68, 0.245], [-0.1, 0.43, 0.25], [-0.2, 0.18, 0.245], [-0.27, 0.02, 0.23]]]
    : [
      [[-0.3, 0.39, 0.245], [-0.19, 0.37, 0.25], [-0.07, 0.35, 0.25], [0.065, 0.34, 0.245]],
      [[0.02, 0.69, 0.245], [-0.03, 0.52, 0.25], [-0.16, 0.32, 0.25], [-0.23, 0.12, 0.245]],
    ]

  return (
    <group position={[patientLeft ? 0.34 : -0.34, 0.08, 0.13]} scale={patientLeft ? [-1, 1, 1] : [1, 1, 1]}>
      <mesh>
        <extrudeGeometry args={[profile, { depth: 0.2, bevelEnabled: true, bevelSegments: 5, steps: 1, bevelSize: 0.045, bevelThickness: 0.04, curveSegments: 28 }]} />
        <meshPhysicalMaterial color={patientLeft ? '#9f4f56' : '#b65359'} roughness={0.52} metalness={0.01} clearcoat={0.13} clearcoatRoughness={0.5} />
      </mesh>
      {fissureLines.map((points, index) => <PathTube key={index} points={points} radius={0.009} color="#713940" roughness={0.78} transparent opacity={0.66} />)}
      <mesh position={[-0.13, 0.18, 0.255]} scale={[0.11, 0.23, 0.025]}>
        <sphereGeometry args={[1, 20, 20]} />
        <meshStandardMaterial color="#d98583" roughness={0.75} transparent opacity={0.25} />
      </mesh>
    </group>
  )
}

function AnatomyModel({ type }) {
  const isAR = type === 'ar-body'
  const skinOpacity = isAR ? 0.055 : 0.1
  const torso = useMemo(() => {
    const shape = new THREE.Shape()
    shape.moveTo(-0.32, 1.02)
    shape.bezierCurveTo(-0.63, 1.02, -0.75, 0.87, -0.7, 0.68)
    shape.lineTo(-0.57, 0.17)
    shape.bezierCurveTo(-0.53, -0.06, -0.61, -0.31, -0.59, -0.57)
    shape.bezierCurveTo(-0.56, -0.82, -0.34, -0.98, 0, -0.98)
    shape.bezierCurveTo(0.34, -0.98, 0.56, -0.82, 0.59, -0.57)
    shape.bezierCurveTo(0.61, -0.31, 0.53, -0.06, 0.57, 0.17)
    shape.lineTo(0.7, 0.68)
    shape.bezierCurveTo(0.75, 0.87, 0.63, 1.02, 0.32, 1.02)
    shape.bezierCurveTo(0.18, 0.91, -0.18, 0.91, -0.32, 1.02)
    return shape
  }, [])

  const ribPairs = Array.from({ length: 6 }, (_, index) => {
    const y = 0.69 - index * 0.12
    const width = 0.4 + Math.sin((index / 5) * Math.PI) * 0.13
    return [-1, 1].map(side => [
      [0.025 * side, y, 0.39],
      [0.16 * side, y - 0.015, 0.43],
      [width * side, y - 0.08, 0.32],
      [(width + 0.04) * side, y - 0.16, 0.18],
    ])
  }).flat()

  return (
    <group position={[0, -0.05, 0]} scale={0.91}>
      {/* A lightly ghosted body silhouette keeps the organs in anatomical context. */}
      <mesh position={[0, 0, -0.26]}>
        <extrudeGeometry args={[torso, { depth: 0.24, bevelEnabled: true, bevelSegments: 4, bevelSize: 0.045, bevelThickness: 0.045, curveSegments: 24 }]} />
        <meshPhysicalMaterial color="#d3a88e" roughness={0.72} transparent opacity={skinOpacity} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 1.31, -0.04]} scale={[0.26, 0.32, 0.23]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#c99580" roughness={0.68} transparent opacity={isAR ? 0.15 : 0.3} />
      </mesh>
      <mesh position={[-0.015, 1.33, 0.075]} scale={[0.16, 0.18, 0.13]}><sphereGeometry args={[1, 32, 28]} /><meshPhysicalMaterial color="#b76d83" roughness={0.62} /></mesh>
      <mesh position={[-0.095, 1.34, 0.13]} scale={[0.083, 0.14, 0.1]}><sphereGeometry args={[1, 24, 20]} /><meshStandardMaterial color="#cc8595" roughness={0.68} /></mesh>
      <mesh position={[0.065, 1.34, 0.13]} scale={[0.083, 0.14, 0.1]}><sphereGeometry args={[1, 24, 20]} /><meshStandardMaterial color="#cc8595" roughness={0.68} /></mesh>
      <PathTube points={[[-0.13, 1.38, 0.19], [-0.09, 1.41, 0.2], [-0.04, 1.38, 0.2], [0, 1.42, 0.19], [0.05, 1.38, 0.2], [0.11, 1.4, 0.18]]} radius={0.009} color="#79495e" roughness={0.75} />
      <mesh position={[0, 1.01, -0.04]}><cylinderGeometry args={[0.12, 0.15, 0.27, 24]} /><meshStandardMaterial color="#c99580" roughness={0.72} transparent opacity={skinOpacity * 2} /></mesh>

      {/* Shoulder girdle, upper arms and pelvis provide a clear whole-body frame. */}
      {[-1, 1].map(side => <group key={`limb-${side}`}>
        <mesh position={[side * 0.78, 0.45, -0.03]} rotation={[0, 0, -side * 0.16]}><capsuleGeometry args={[0.105, 0.61, 6, 12]} /><meshStandardMaterial color="#c99580" roughness={0.75} transparent opacity={isAR ? 0.12 : 0.27} /></mesh>
        <mesh position={[side * 0.11, -1.25, -0.03]} rotation={[0, 0, -side * 0.025]}><capsuleGeometry args={[0.13, 0.78, 6, 12]} /><meshStandardMaterial color="#c99580" roughness={0.75} transparent opacity={isAR ? 0.12 : 0.25} /></mesh>
        <mesh position={[side * 0.17, -0.72, -0.1]} scale={[0.33, 0.2, 0.18]}><sphereGeometry args={[1, 24, 24]} /><meshStandardMaterial color="#d3a88e" roughness={0.76} transparent opacity={skinOpacity * 2} /></mesh>
      </group>)}

      {/* The trachea branches into the right and left main bronchi. */}
      <mesh position={[0, 0.81, 0.43]}><cylinderGeometry args={[0.075, 0.085, 0.47, 24]} /><meshStandardMaterial color="#c8bda9" roughness={0.48} /></mesh>
      {Array.from({ length: 7 }, (_, index) => <mesh key={`ring-${index}`} position={[0, 0.61 + index * 0.065, 0.435]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.083, 0.014, 8, 24]} /><meshStandardMaterial color="#ece2ce" roughness={0.42} />
      </mesh>)}
      <PathTube points={[[0, 0.59, 0.45], [-0.08, 0.49, 0.47], [-0.22, 0.43, 0.47], [-0.3, 0.35, 0.46]]} radius={0.055} color="#d0c2ac" />
      <PathTube points={[[0, 0.59, 0.45], [0.08, 0.49, 0.47], [0.22, 0.43, 0.47], [0.3, 0.35, 0.46]]} radius={0.055} color="#d0c2ac" />
      {[
        [[-0.21, 0.44, 0.47], [-0.29, 0.57, 0.46], [-0.39, 0.62, 0.45]],
        [[-0.25, 0.4, 0.47], [-0.33, 0.25, 0.45], [-0.4, 0.18, 0.44]],
        [[0.21, 0.44, 0.47], [0.29, 0.57, 0.46], [0.39, 0.62, 0.45]],
        [[0.25, 0.4, 0.47], [0.33, 0.25, 0.45], [0.4, 0.18, 0.44]],
      ].map((points, index) => <PathTube key={`bronchiole-${index}`} points={points} radius={0.027} color="#d7c6b0" roughness={0.48} />)}

      <Lung />
      <Lung patientLeft />

      {/* A subtle rib cage sits outside the lungs, as it does in the body. */}
      {ribPairs.map((points, index) => <PathTube key={`rib-${index}`} points={points} radius={0.018} color="#e3d7c4" roughness={0.6} transparent opacity={0.72} />)}
      <PathTube points={[[0, 0.74, 0.42], [0, 0.5, 0.45], [0, 0.2, 0.44], [0, -0.06, 0.39]]} radius={0.035} color="#e9deca" roughness={0.58} />
      <PathTube points={[[-0.35, 0.86, 0.22], [-0.16, 0.9, 0.34], [0, 0.86, 0.4], [0.16, 0.9, 0.34], [0.35, 0.86, 0.22]]} radius={0.026} color="#e3d7c4" roughness={0.62} />

      {/* Heart and great vessels, placed centrally between the lungs. */}
      <mesh position={[0.025, 0.12, 0.49]} rotation={[0, 0, -0.16]} scale={[0.25, 0.3, 0.19]}>
        <sphereGeometry args={[1, 36, 32]} /><meshPhysicalMaterial color="#8f2336" roughness={0.43} clearcoat={0.3} />
      </mesh>
      <mesh position={[-0.055, 0.25, 0.5]} scale={[0.16, 0.16, 0.15]}><sphereGeometry args={[1, 24, 24]} /><meshPhysicalMaterial color="#a92d3d" roughness={0.45} clearcoat={0.28} /></mesh>
      <PathTube points={[[0.04, 0.27, 0.49], [0.08, 0.43, 0.47], [0.04, 0.55, 0.44], [-0.02, 0.62, 0.43]]} radius={0.045} color="#a52d36" roughness={0.4} />
      <PathTube points={[[0.11, 0.27, 0.47], [0.17, 0.42, 0.43], [0.2, 0.53, 0.41]]} radius={0.032} color="#405f86" roughness={0.4} />

      {/* Liver and stomach sit below the diaphragm to orient the chest organs. */}
      <mesh position={[-0.26, -0.48, 0.18]} scale={[0.31, 0.17, 0.16]} rotation={[0, 0, -0.12]}><sphereGeometry args={[1, 28, 24]} /><meshStandardMaterial color="#713a32" roughness={0.68} /></mesh>
      <mesh position={[0.22, -0.47, 0.2]} scale={[0.18, 0.24, 0.14]} rotation={[0, 0, 0.2]}><sphereGeometry args={[1, 28, 24]} /><meshStandardMaterial color="#9b554c" roughness={0.65} /></mesh>
      <PathTube points={[[-0.27, -0.7, 0.2], [-0.2, -0.63, 0.25], [-0.1, -0.71, 0.25], [0, -0.64, 0.25], [0.11, -0.71, 0.25], [0.2, -0.64, 0.22], [0.28, -0.71, 0.19]]} radius={0.043} color="#b77b68" roughness={0.72} />
      <PathTube points={[[-0.34, -0.59, 0.18], [-0.39, -0.68, 0.18], [-0.38, -0.79, 0.16], [-0.29, -0.84, 0.17], [-0.2, -0.82, 0.18]]} radius={0.052} color="#9b594e" roughness={0.76} />
    </group>
  )
}

function WaterMolecule() {
  const oxygen = [0, 0, 0]
  const angle = (104.5 / 2) * (Math.PI / 180)
  const bondLength = 0.82
  const hydrogenLeft = [-Math.sin(angle) * bondLength, -Math.cos(angle) * bondLength, 0]
  const hydrogenRight = [Math.sin(angle) * bondLength, -Math.cos(angle) * bondLength, 0]
  return <group rotation={[0.12, 0.3, -0.1]}>
    <LinkCylinder start={oxygen} end={hydrogenLeft} radius={0.075} color="#d6dbe3" metalness={0.12} />
    <LinkCylinder start={oxygen} end={hydrogenRight} radius={0.075} color="#d6dbe3" metalness={0.12} />
    <mesh position={oxygen}><sphereGeometry args={[0.36, 48, 40]} /><meshPhysicalMaterial color="#d94338" roughness={0.28} metalness={0.04} clearcoat={0.48} /></mesh>
    {[hydrogenLeft, hydrogenRight].map((position, index) => <mesh key={index} position={position}><sphereGeometry args={[0.2, 36, 32]} /><meshPhysicalMaterial color="#f3f5f7" roughness={0.2} metalness={0.04} clearcoat={0.56} /></mesh>)}
  </group>
}

function PendulumModel({ experimentLevel }) {
  const bob = useRef(null)
  useFrame(({ clock }) => {
    if (!bob.current) return
    const push = THREE.MathUtils.clamp(experimentLevel, 0, 100) / 100
    const releaseAngle = THREE.MathUtils.degToRad(2 + push * 24)
    bob.current.rotation.z = Math.cos(clock.elapsedTime * 2.63) * releaseAngle
  })

  return <group>
    <mesh position={[0, -1.48, 0]} scale={[1.24, 0.12, 0.62]}><cylinderGeometry args={[1, 1.08, 0.18, 48]} /><meshStandardMaterial color="#263746" metalness={0.72} roughness={0.25} /></mesh>
    <mesh position={[0, -1.36, 0]} scale={[1.06, 1, 0.52]}><boxGeometry args={[1, 0.08, 1]} /><meshStandardMaterial color="#775439" roughness={0.56} /></mesh>
    {[-0.92, 0.92].map(side => <group key={side}>
      <mesh position={[side, -0.1, 0]} rotation={[0, 0, -side * 0.025]}><cylinderGeometry args={[0.055, 0.075, 2.55, 24]} /><meshStandardMaterial color="#71808d" metalness={0.78} roughness={0.24} /></mesh>
      <mesh position={[side, 1.19, 0]}><cylinderGeometry args={[0.09, 0.09, 0.13, 24]} /><meshStandardMaterial color="#a9b5c0" metalness={0.84} roughness={0.22} /></mesh>
    </group>)}
    <mesh position={[0, 1.17, 0]}><boxGeometry args={[2.02, 0.14, 0.26]} /><meshStandardMaterial color="#647582" metalness={0.76} roughness={0.25} /></mesh>
    <mesh position={[0, 1.08, 0.015]}><cylinderGeometry args={[0.105, 0.105, 0.08, 32]} /><meshStandardMaterial color="#d2a34f" metalness={0.72} roughness={0.26} /></mesh>
    <group ref={bob} position={[0, 1.08, 0.015]}>
      <mesh position={[0, -0.72, 0]}><cylinderGeometry args={[0.012, 0.016, 1.42, 12]} /><meshStandardMaterial color="#c0c8cf" metalness={0.8} roughness={0.22} /></mesh>
      <mesh position={[0, -1.46, 0]} scale={[1, 1.06, 0.92]}><sphereGeometry args={[0.17, 48, 40]} /><meshPhysicalMaterial color="#c69438" metalness={0.82} roughness={0.19} clearcoat={0.55} /></mesh>
    </group>
    <mesh position={[0, -1.17, -0.11]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[1.36, 0.012, 8, 72, Math.PI * 0.56]} /><meshBasicMaterial color="#57a6cf" transparent opacity={0.65} /></mesh>
    <mesh position={[0, 1.02, 0.02]}><sphereGeometry args={[0.055, 24, 20]} /><meshStandardMaterial color="#e0b65d" metalness={0.72} roughness={0.24} /></mesh>
  </group>
}

const worldLand = [
  [[-168, 70], [-154, 72], [-142, 68], [-135, 60], [-129, 55], [-124, 49], [-123, 43], [-117, 32], [-108, 28], [-104, 23], [-97, 19], [-91, 18], [-86, 13], [-82, 9], [-77, 8], [-78, 19], [-74, 28], [-67, 43], [-59, 50], [-55, 57], [-65, 63], [-81, 68], [-100, 73], [-123, 74], [-145, 74]],
  [[-53, 59], [-41, 61], [-30, 70], [-35, 81], [-47, 84], [-59, 78], [-63, 69]],
  [[-81, 12], [-72, 10], [-64, 7], [-52, 3], [-47, -2], [-42, -8], [-38, -15], [-43, -23], [-49, -29], [-54, -37], [-61, -47], [-68, -55], [-73, -45], [-76, -31], [-79, -17], [-81, -4]],
  [[-11, 36], [-9, 44], [-3, 49], [4, 52], [10, 55], [19, 58], [29, 60], [39, 56], [47, 51], [57, 55], [69, 58], [82, 56], [91, 61], [105, 63], [121, 60], [136, 55], [151, 59], [164, 58], [176, 52], [170, 43], [158, 39], [147, 43], [137, 37], [129, 31], [121, 25], [112, 22], [107, 16], [99, 13], [91, 21], [83, 22], [77, 9], [71, 7], [67, 18], [58, 23], [49, 29], [42, 37], [32, 35], [26, 40], [17, 37], [11, 43], [2, 43], [-4, 39]],
  [[-17, 36], [-7, 37], [1, 32], [11, 31], [17, 25], [13, 15], [10, 5], [9, -6], [4, -16], [-1, -24], [-7, -34], [-12, -31], [-16, -19], [-18, -5], [-15, 8], [-17, 20]],
  [[35, 31], [46, 29], [51, 18], [49, 6], [44, -12], [39, -20], [34, -12], [30, 2], [31, 15]],
  [[112, -11], [129, -12], [143, -17], [153, -25], [151, -36], [140, -39], [129, -34], [116, -27]],
  [[-180, -66], [-145, -70], [-104, -72], [-60, -70], [-15, -73], [28, -72], [70, -75], [112, -73], [151, -70], [180, -67], [180, -90], [-180, -90]],
]

function makeEarthTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 2048
  canvas.height = 1024
  const ctx = canvas.getContext('2d')
  const ocean = ctx.createLinearGradient(0, 0, 0, canvas.height)
  ocean.addColorStop(0, '#193b67')
  ocean.addColorStop(0.48, '#17608a')
  ocean.addColorStop(1, '#14345e')
  ctx.fillStyle = ocean
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const xy = ([longitude, latitude]) => [((longitude + 180) / 360) * canvas.width, ((90 - latitude) / 180) * canvas.height]
  worldLand.forEach((polygon, index) => {
    ctx.beginPath()
    polygon.map(xy).forEach(([x, y], pointIndex) => pointIndex === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y))
    ctx.closePath()
    const land = ctx.createLinearGradient(0, 140 + index * 17, 0, 850)
    land.addColorStop(0, '#9baa70')
    land.addColorStop(0.45, '#688653')
    land.addColorStop(1, '#788756')
    ctx.fillStyle = land
    ctx.fill()
    ctx.strokeStyle = 'rgba(205, 214, 165, 0.48)'
    ctx.lineWidth = 2
    ctx.stroke()
  })

  // Relief cues follow the Andes, Rockies, Alps and Himalaya without implying exact elevation.
  const ranges = [
    [[-72, 8], [-73, -4], [-70, -18], [-72, -31], [-70, -45]],
    [[-125, 48], [-116, 43], [-112, 37], [-108, 33]],
    [[-2, 46], [7, 46], [14, 45], [22, 46]],
    [[70, 31], [82, 32], [91, 29], [100, 28]],
  ]
  ctx.strokeStyle = 'rgba(205, 190, 135, 0.58)'
  ctx.lineWidth = 5
  ranges.forEach(range => {
    ctx.beginPath()
    range.map(xy).forEach(([x, y], index) => index === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y))
    ctx.stroke()
  })

  // Add deterministic fine relief so broad land masses read as terrain at close range.
  let seed = 1978
  const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646 }
  for (let index = 0; index < 22000; index += 1) {
    const x = random() * canvas.width
    const y = random() * canvas.height
    const radius = 0.5 + random() * 2.3
    ctx.fillStyle = random() > 0.5 ? 'rgba(230, 218, 170, 0.08)' : 'rgba(20, 47, 40, 0.1)'
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, Math.PI * 2)
    ctx.fill()
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  return texture
}

function makeCloudTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 512
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  let seed = 812
  const random = () => { seed = (seed * 48271) % 2147483647; return (seed - 1) / 2147483646 }
  for (let index = 0; index < 135; index += 1) {
    const x = random() * canvas.width
    const y = 55 + random() * 410
    const width = 12 + random() * 70
    const height = 3 + random() * 15
    ctx.fillStyle = `rgba(244, 249, 255, ${0.06 + random() * 0.16})`
    ctx.beginPath()
    ctx.ellipse(x, y, width, height, random() * 0.5 - 0.25, 0, Math.PI * 2)
    ctx.fill()
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function EarthModel() {
  const surface = useMemo(makeEarthTexture, [])
  const clouds = useMemo(makeCloudTexture, [])
  return <group rotation={[0.18, -0.42, 0.32]}>
    <mesh><sphereGeometry args={[1.13, 96, 64]} /><meshStandardMaterial map={surface} roughness={0.87} metalness={0.015} /></mesh>
    <mesh scale={[1.006, 1.006, 1.006]}><sphereGeometry args={[1.13, 64, 48]} /><meshStandardMaterial map={clouds} transparent opacity={0.7} depthWrite={false} roughness={1} /></mesh>
    <mesh scale={[1.035, 1.035, 1.035]}><sphereGeometry args={[1.13, 64, 48]} /><meshBasicMaterial color="#5eb9ee" transparent opacity={0.12} side={THREE.BackSide} /></mesh>
  </group>
}

function Mitochondrion({ position, rotation = 0, scale = 1 }) {
  return <group position={position} rotation={[0, 0, rotation]} scale={scale}>
    <mesh scale={[0.34, 0.19, 0.16]}><sphereGeometry args={[1, 32, 24]} /><meshPhysicalMaterial color="#b7684f" roughness={0.55} clearcoat={0.14} /></mesh>
    <PathTube points={[[-0.24, 0.01, 0.13], [-0.14, 0.1, 0.14], [-0.06, -0.06, 0.14], [0.03, 0.08, 0.14], [0.13, -0.07, 0.14], [0.24, 0.01, 0.12]]} radius={0.018} color="#f2b17c" roughness={0.68} />
    <PathTube points={[[-0.22, -0.08, 0.12], [-0.1, 0.02, 0.15], [0, -0.1, 0.15], [0.12, 0.02, 0.14], [0.22, -0.04, 0.12]]} radius={0.014} color="#e9a16e" roughness={0.7} />
  </group>
}

function CellModel() {
  const membrane = useMemo(() => new THREE.SphereGeometry(1, 64, 48), [])
  const ribosomePositions = [
    [-0.88, 0.17, 0.28], [-0.7, -0.34, 0.45], [-0.43, 0.55, 0.3], [-0.04, 0.65, 0.3], [0.33, 0.57, 0.3],
    [0.77, 0.3, 0.2], [0.86, -0.12, 0.32], [0.61, -0.52, 0.29], [0.18, -0.65, 0.35], [-0.34, -0.57, 0.42],
    [-0.91, -0.12, -0.1], [-0.3, 0.47, -0.48], [0.46, 0.47, -0.46], [0.71, -0.38, -0.28],
  ]
  return <group scale={1.02}>
    <mesh geometry={membrane} scale={[1.3, 0.9, 0.9]}><meshPhysicalMaterial color="#bed6a2" transparent opacity={0.19} roughness={0.35} clearcoat={0.4} side={THREE.DoubleSide} depthWrite={false} /></mesh>
    <mesh geometry={membrane} scale={[1.25, 0.86, 0.86]}><meshStandardMaterial color="#aebd75" transparent opacity={0.07} roughness={0.9} side={THREE.BackSide} depthWrite={false} /></mesh>

    {/* Nucleus with a double envelope and nucleolus. */}
    <mesh position={[-0.2, 0.08, 0.12]} scale={[0.42, 0.39, 0.38]}><sphereGeometry args={[1, 40, 32]} /><meshPhysicalMaterial color="#72548e" roughness={0.5} clearcoat={0.16} /></mesh>
    <mesh position={[-0.2, 0.08, 0.15]} scale={[0.35, 0.32, 0.32]}><sphereGeometry args={[1, 36, 30]} /><meshStandardMaterial color="#9279aa" roughness={0.62} /></mesh>
    <mesh position={[-0.11, 0.04, 0.43]} scale={[0.13, 0.12, 0.11]}><sphereGeometry args={[1, 28, 24]} /><meshStandardMaterial color="#4e3a68" roughness={0.55} /></mesh>

    {/* Rough endoplasmic reticulum folds around the nucleus; dots are ribosomes. */}
    <PathTube points={[[-0.62, 0.31, 0.28], [-0.55, 0.48, 0.2], [-0.31, 0.54, 0.15], [-0.04, 0.46, 0.12], [0.02, 0.35, 0.12]]} radius={0.035} color="#7193a1" />
    <PathTube points={[[-0.64, 0.13, 0.35], [-0.54, 0.02, 0.31], [-0.35, -0.04, 0.28], [-0.05, 0.04, 0.27], [0.05, 0.18, 0.23]]} radius={0.035} color="#7193a1" />
    <PathTube points={[[-0.54, -0.15, 0.31], [-0.43, -0.28, 0.27], [-0.2, -0.3, 0.24], [0.04, -0.19, 0.22]]} radius={0.03} color="#7193a1" />
    {ribosomePositions.slice(0, 10).map((position, index) => <mesh key={`ribosome-${index}`} position={position}><sphereGeometry args={[0.035, 14, 12]} /><meshStandardMaterial color="#394954" roughness={0.7} /></mesh>)}

    <Mitochondrion position={[0.65, 0.22, 0.12]} rotation={0.48} scale={0.92} />
    <Mitochondrion position={[0.45, -0.51, 0.06]} rotation={-0.62} scale={0.83} />
    <Mitochondrion position={[-0.78, -0.38, -0.08]} rotation={0.9} scale={0.72} />

    {/* Golgi cisternae and small budding vesicles. */}
    {[-0.12, -0.02, 0.08, 0.18].map((y, index) => <PathTube key={`golgi-${index}`} points={[[0.48, y, 0.43], [0.57, y + 0.03, 0.46], [0.72, y + 0.02, 0.43], [0.8, y - 0.02, 0.37]]} radius={0.035} color={['#d2a05f', '#d9a868', '#dfb375', '#e4bd82'][index]} roughness={0.6} />)}
    {[[0.82, 0.24, 0.31], [0.87, -0.15, 0.3], [0.12, 0.42, 0.4], [-0.86, 0.26, 0.04]].map((position, index) => <mesh key={`vesicle-${index}`} position={position}><sphereGeometry args={[index === 0 ? 0.09 : 0.065, 20, 18]} /><meshPhysicalMaterial color={index % 2 ? '#8d9b68' : '#d7b56c'} roughness={0.3} clearcoat={0.36} /></mesh>)}
    {ribosomePositions.slice(10).map((position, index) => <mesh key={`free-ribosome-${index}`} position={position}><sphereGeometry args={[0.031, 14, 12]} /><meshStandardMaterial color="#394954" roughness={0.7} /></mesh>)}
  </group>
}

function EllipseRing({ rx, rz, y, color = '#b7a88b', thickness = 0.028 }) {
  const points = useMemo(() => Array.from({ length: 65 }, (_, index) => {
    const angle = (index / 64) * Math.PI * 2
    return [rx * Math.cos(angle), y, rz * Math.sin(angle)]
  }), [rx, rz, y])
  return <PathTube points={points} radius={thickness} color={color} roughness={0.76} />
}

function RomanColosseum() {
  const arch = useMemo(() => new THREE.TorusGeometry(0.112, 0.026, 8, 24, Math.PI), [])
  const rows = [
    { y: -0.54, rx: 1.05, rz: 0.72, height: 0.44, stone: '#cfbea0' },
    { y: -0.08, rx: 1.0, rz: 0.68, height: 0.4, stone: '#d7c8ad' },
    { y: 0.34, rx: 0.94, rz: 0.64, height: 0.36, stone: '#c6b595' },
  ]
  return <group position={[0, 0.02, 0]}>
    <mesh position={[0, -0.79, 0]} scale={[1, 1, 0.68]}><cylinderGeometry args={[1.18, 1.24, 0.16, 64]} /><meshStandardMaterial color="#a99a7e" roughness={0.88} /></mesh>
    <mesh position={[0, -0.69, 0]} scale={[1, 1, 0.68]}><cylinderGeometry args={[1.06, 1.1, 0.055, 64]} /><meshStandardMaterial color="#8d7253" roughness={0.94} /></mesh>
    <mesh position={[0, -0.59, 0]} scale={[1, 1, 0.68]}><cylinderGeometry args={[0.74, 0.8, 0.035, 64]} /><meshStandardMaterial color="#b49a70" roughness={0.95} /></mesh>

    {rows.map((row, rowIndex) => {
      const count = 28
      return <group key={rowIndex}>
        {Array.from({ length: count }, (_, index) => {
          const angle = (index / count) * Math.PI * 2
          const x = row.rx * Math.cos(angle)
          const z = row.rz * Math.sin(angle)
          const faceRotation = Math.PI / 2 - angle
          const archAngle = ((index + 0.5) / count) * Math.PI * 2
          const archX = row.rx * Math.cos(archAngle)
          const archZ = row.rz * Math.sin(archAngle)
          return <group key={index}>
            <mesh position={[x, row.y + row.height / 2, z]} rotation={[0, -angle, 0]}>
              <cylinderGeometry args={[0.043, 0.06, row.height, 14]} />
              <meshStandardMaterial color={row.stone} roughness={0.83} />
            </mesh>
            <mesh geometry={arch} position={[archX, row.y + row.height * 0.58, archZ]} rotation={[0, faceRotation, 0]}>
              <meshStandardMaterial color={row.stone} roughness={0.84} />
            </mesh>
            <mesh position={[x, row.y + 0.045, z]}><cylinderGeometry args={[0.074, 0.078, 0.07, 16]} /><meshStandardMaterial color="#b6a483" roughness={0.86} /></mesh>
          </group>
        })}
        <EllipseRing rx={row.rx + 0.045} rz={row.rz + 0.035} y={row.y + row.height} color={row.stone} thickness={0.045} />
        <EllipseRing rx={row.rx + 0.035} rz={row.rz + 0.03} y={row.y} color="#a28f6f" thickness={0.023} />
      </group>
    })}
    <mesh position={[0, 0.77, 0]} scale={[1, 1, 0.68]}><cylinderGeometry args={[0.89, 0.94, 0.12, 64]} /><meshStandardMaterial color="#c6b798" roughness={0.88} /></mesh>
    <mesh position={[0, 0.845, 0]} scale={[1, 1, 0.68]}><cylinderGeometry args={[0.82, 0.86, 0.035, 64]} /><meshStandardMaterial color="#85775f" roughness={0.95} /></mesh>
    <EllipseRing rx={0.74} rz={0.5} y={0.89} color="#c1b08e" thickness={0.025} />
    {Array.from({ length: 10 }, (_, index) => <mesh key={`beam-${index}`} position={[0, -0.33 + index * 0.105, 0]} scale={[1, 1, 0.68]}><cylinderGeometry args={[0.82 - index * 0.022, 0.82 - index * 0.022, 0.035, 48]} /><meshStandardMaterial color={index % 2 ? '#ad9b7a' : '#c5b594'} roughness={0.89} /></mesh>)}
  </group>
}

export default function LearningModel({ type, experimentLevel = 50 }) {
  if (type === 'solar') {
    // Keep the existing solar-system model as requested.
    return <group>
      <mesh><sphereGeometry args={[0.48, 40, 40]} /><meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.7} /></mesh>
      {[0.8, 1.2, 1.6, 2.05].map((radius, index) => <group key={radius}><mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[radius, 0.008, 8, 120]} /><meshBasicMaterial color="#94a3b8" /></mesh><mesh position={[radius, 0, 0]}><sphereGeometry args={[0.1 + index * 0.035, 24, 24]} /><meshStandardMaterial color={['#60a5fa', '#f97316', '#22c55e', '#a78bfa'][index]} roughness={0.35} /></mesh></group>)}
    </group>
  }
  if (type === 'body' || type === 'ar-body') return <AnatomyModel type={type} />
  if (type === 'chemistry') return <WaterMolecule />
  if (type === 'physics') return <PendulumModel experimentLevel={experimentLevel} />
  if (type === 'earth') return <EarthModel />
  if (type === 'history') return <RomanColosseum />
  if (type === 'cell') return <CellModel />
  return <group><mesh><sphereGeometry args={[0.7, 48, 40]} /><meshPhysicalMaterial color="#9b87b4" roughness={0.55} /></mesh></group>
}
