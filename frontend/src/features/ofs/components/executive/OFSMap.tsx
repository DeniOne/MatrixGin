

// Simplified representation of nodes for the SVG map
const NODES = [
    { id: '1', x: 400, y: 300, name: 'ГЕНЕРАЛЬНЫЙ ДИРЕКТОР', type: 'management', state: 'green' },
    { id: '2', x: 200, y: 150, name: 'ПРОИЗВОДСТВО', type: 'operational', state: 'green' },
    { id: '3', x: 600, y: 150, name: 'ПРОДАЖИ', type: 'operational', state: 'yellow' },
    { id: '4', x: 400, y: 500, name: 'HR И МЕТОДОЛОГИЯ', type: 'support', state: 'green' },
    { id: '5', x: 100, y: 350, name: 'IT-ПОДДЕРЖКА', type: 'support', state: 'red' },
];

const EDGES = [
    { from: '1', to: '2', type: 'org', load: 2 },
    { from: '1', to: '3', type: 'org', load: 3 },
    { from: '1', to: '4', type: 'org', load: 1 },
    { from: '4', to: '2', type: 'expert', load: 1 },
    { from: '5', to: '2', type: 'func', load: 5 },
];

interface OFSMapProps {
    onSelectNode?: (id: string, name: string) => void;
    selectedNodeId?: string;
}

export default function OFSMap({ onSelectNode, selectedNodeId }: OFSMapProps) {
    return (
        <div className="relative w-full h-full min-h-[500px] cursor-grab active:cursor-grabbing select-none">
            <svg
                viewBox="0 0 800 600"
                className="w-full h-full"
                preserveAspectRatio="xMidYMid meet"
            >
                {/* Edges */}
                {EDGES.map((edge, i) => {
                    const from = NODES.find(n => n.id === edge.from)!;
                    const to = NODES.find(n => n.id === edge.to)!;

                    const strokeColors = {
                        org: 'stroke-gray-700',
                        func: 'stroke-blue-500/40',
                        expert: 'stroke-purple-500/40',
                    };

                    return (
                        <line
                            key={i}
                            x1={from.x} y1={from.y}
                            x2={to.x} y2={to.y}
                            className={strokeColors[edge.type as keyof typeof strokeColors]}
                            strokeWidth={edge.load * 1.5}
                            strokeDasharray={edge.type === 'func' ? "4 2" : "0"}
                        />
                    );
                })}

                {/* Nodes */}
                {NODES.map((node) => {
                    const isSelected = selectedNodeId === node.id;
                    const statusColors = {
                        green: 'fill-emerald-500/20 stroke-emerald-500',
                        yellow: 'fill-amber-500/20 stroke-amber-500',
                        red: 'fill-rose-500/20 stroke-rose-500',
                    };

                    return (
                        <g
                            key={node.id}
                            className="group cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelectNode?.(node.id, node.name);
                            }}
                        >
                            {isSelected && (
                                <circle
                                    cx={node.x} cy={node.y} r="35"
                                    className="fill-blue-500/10 stroke-blue-500/30 animate-pulse"
                                    strokeWidth="1"
                                    strokeDasharray="4 2"
                                />
                            )}
                            <circle
                                cx={node.x} cy={node.y} r="25"
                                className={`${statusColors[node.state as keyof typeof statusColors]} ${isSelected ? 'stroke-[3px]' : 'stroke-2'}`}
                            />
                            <text
                                x={node.x} y={node.y + 45}
                                textAnchor="middle"
                                className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isSelected ? 'fill-white' : 'fill-gray-400 group-hover:fill-gray-200'}`}
                            >
                                {node.name}
                            </text>

                            {/* Inner Glyph */}
                            <circle
                                cx={node.x} cy={node.y} r="8"
                                className={`${isSelected ? 'fill-white/30' : 'fill-white/10'}`}
                            />
                        </g>
                    );
                })}
            </svg>

            {/* Map Legend */}
            <div className="absolute bottom-6 left-6 bg-gray-950/60 backdrop-blur-md border border-gray-800 p-4 rounded-xl space-y-3">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-px bg-gray-700" />
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Орг. связь</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-3 h-px bg-blue-500/60" />
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Функционал</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-3 h-px bg-purple-500/60" />
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Экспертиза</span>
                </div>
            </div>
        </div>
    );
}
