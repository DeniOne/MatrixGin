import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import { Vector3, Color } from 'three';

// --- TYPES ---
interface GrowthNode {
    id: string;
    label: string;
    value: number; // 0..100
    color: string;
    position: [number, number, number];
}

interface StartGrowthWeb3DProps {
    quality: number; // 0..100
    speed: number;   // 0..100
    sales: number;   // 0..100
    team: number;    // 0..100
}

// --- CONSTANTS ---
const NODE_COLOR_BASE = '#4F46E5'; // Indigo-600
const NODE_COLOR_ACTIVE = '#10B981'; // Emerald-500
const CONNECTION_COLOR = '#9CA3AF'; // Gray-400

// --- SUB-COMPONENTS ---

/* Represents a single competency node */
function SkillNode({ node }: { node: GrowthNode }) {
    const meshRef = useRef<any>(null);

    // Gentle pulse animation
    useFrame((state) => {
        if (meshRef.current) {
            const t = state.clock.getElapsedTime();
            const scale = 1 + Math.sin(t * 2 + node.value) * 0.1;
            meshRef.current.scale.set(scale, scale, scale);
        }
    });

    return (
        <group position={node.position}>
            <mesh ref={meshRef}>
                <sphereGeometry args={[0.3, 32, 32]} />
                <meshStandardMaterial color={node.color} emissive={node.color} emissiveIntensity={0.5} />
            </mesh>
            <Html distanceFactor={10}>
                <div className="bg-gray-900/80 text-white text-xs px-2 py-1 rounded backdrop-blur-sm whitespace-nowrap border border-gray-700">
                    {node.label}: {node.value}%
                </div>
            </Html>
        </group>
    );
}

/* Connects nodes to center to form a web */
function WebConnections({ nodes }: { nodes: GrowthNode[] }) {
    const points = useMemo(() => {
        return nodes.flatMap(node => [
            new Vector3(0, 0, 0), // Center
            new Vector3(...node.position)
        ]);
    }, [nodes]);

    // Create a line segment for each connection
    return (
        <group>
            {nodes.map((node, i) => (
                <line key={i}>
                    <bufferGeometry>
                        <float32BufferAttribute
                            attach="attributes-position"
                            count={2}
                            array={new Float32Array([0, 0, 0, ...node.position])}
                            itemSize={3}
                        />
                    </bufferGeometry>
                    <lineBasicMaterial color={CONNECTION_COLOR} transparent opacity={0.3} />
                </line>
            ))}
        </group>
    );
}

function WebPolygons({ nodes }: { nodes: GrowthNode[] }) {
    // Basic visualization of the area covered
    // For simplicity in this iteration, we just show lines. 
    // A full polygon needs proper order of vertices.
    // We assume nodes are passed in circular order.

    const positions = useMemo(() => {
        const pos: number[] = [];
        // Connect each node to next
        for (let i = 0; i < nodes.length; i++) {
            const curr = nodes[i];
            const next = nodes[(i + 1) % nodes.length];
            pos.push(...curr.position);
            pos.push(...next.position);
        }
        return new Float32Array(pos);
    }, [nodes]);

    return (
        <lineSegments>
            <bufferGeometry>
                <float32BufferAttribute
                    attach="attributes-position"
                    count={nodes.length * 2}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <lineBasicMaterial color={NODE_COLOR_ACTIVE} transparent opacity={0.6} />
        </lineSegments>
    )

}


// --- MAIN COMPONENT ---

export const StartGrowthWeb3D: React.FC<StartGrowthWeb3DProps> = ({ quality, speed, sales, team }) => {

    // Map props to 3D Nodes
    // Normalize 0..100 to radius 0..3
    const getPos = (val: number, angleDeg: number): [number, number, number] => {
        const r = (val / 100) * 3;
        const rad = (angleDeg * Math.PI) / 180;
        return [r * Math.cos(rad), r * Math.sin(rad), 0];
    };

    const nodes: GrowthNode[] = useMemo(() => [
        { id: 'q', label: 'Quality', value: quality, color: '#f87171', position: getPos(quality, 90) }, // Top
        { id: 's', label: 'Speed', value: speed, color: '#fbbf24', position: getPos(speed, 0) },   // Right
        { id: 'sl', label: 'Sales', value: sales, color: '#34d399', position: getPos(sales, 270) }, // Bottom
        { id: 'tm', label: 'Team', value: team, color: '#60a5fa', position: getPos(team, 180) },    // Left
    ], [quality, speed, sales, team]);

    return (
        <div className="h-64 w-full bg-slate-900 rounded-xl overflow-hidden border border-slate-700 shadow-inner relative">
            {/* Instruction Overlay (Read-Only) */}
            <div className="absolute top-2 left-2 z-10 pointer-events-none">
                <span className="text-xs text-slate-400 bg-slate-800/50 px-2 py-1 rounded">
                    Use mouse to rotate • Read-Only
                </span>
            </div>

            <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} />

                {/* Central Core */}
                <mesh position={[0, 0, 0]}>
                    <sphereGeometry args={[0.2, 16, 16]} />
                    <meshStandardMaterial color="#ffffff" />
                </mesh>

                <WebConnections nodes={nodes} />
                <WebPolygons nodes={nodes} />

                {nodes.map(node => (
                    <SkillNode key={node.id} node={node} />
                ))}

                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>
        </div>
    );
};
