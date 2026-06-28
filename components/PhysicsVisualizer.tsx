import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Pause, RotateCcw, Sparkles, Sliders, Activity, 
  ChevronRight, Compass, HelpCircle, Check, Info 
} from 'lucide-react';
import { PhysicsSimulationResult, PhysicsBody } from '../types';

interface PhysicsVisualizerProps {
  physics: PhysicsSimulationResult;
}

export const PhysicsVisualizer: React.FC<PhysicsVisualizerProps> = ({ physics }) => {
  const [bodies, setBodies] = useState<PhysicsBody[]>([]);
  const [gravity, setGravity] = useState(physics.gravity);
  const [friction, setFriction] = useState(physics.friction);
  const [restitution, setRestitution] = useState(physics.restitution);
  const [isRunning, setIsRunning] = useState(true);
  const [showVector, setShowVector] = useState(true);
  const [hoveredBodyId, setHoveredBodyId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'simulation' | 'stats'>('simulation');

  // SVG viewport limits
  const width = 500;
  const height = 300;

  // Drag state
  const dragBodyRef = useRef<string | null>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Initialize bodies on component mount or prop update
  useEffect(() => {
    // Deep copy bodies to prevent mutating original props
    const copiedBodies = physics.bodies.map(b => ({
      ...b,
      // Default velocities if undefined
      vx: b.vx ?? 0,
      vy: b.vy ?? 0,
    }));
    setBodies(copiedBodies);
    setGravity(physics.gravity);
    setFriction(physics.friction);
    setRestitution(physics.restitution);
    setIsRunning(true);
  }, [physics]);

  // Physics animation loop
  useEffect(() => {
    if (!isRunning) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const updatePhysics = () => {
      setBodies(prevBodies => {
        // Create working copy
        const current = prevBodies.map(b => ({ ...b }));
        const dt = 0.16; // Fixed timestep factor for stability

        // 1. Apply gravity & friction
        for (let i = 0; i < current.length; i++) {
          const b = current[i];
          
          // Skip if body is being dragged
          if (dragBodyRef.current === b.id) continue;

          // Apply gravity
          b.vy += gravity * dt;

          // Apply friction/drag resistance
          b.vx *= (1 - friction);
          b.vy *= (1 - friction);

          // Update coordinates
          b.x += b.vx;
          b.y += b.vy;

          // 2. Bound checking & response
          if (b.type === 'circle') {
            const r = b.radius || 20;
            // Floor bounce
            if (b.y + r > height) {
              b.y = height - r;
              b.vy = -b.vy * restitution;
              b.vx *= 0.95; // Ground friction
            }
            // Ceiling bounce
            else if (b.y - r < 0) {
              b.y = r;
              b.vy = -b.vy * restitution;
            }

            // Right wall bounce
            if (b.x + r > width) {
              b.x = width - r;
              b.vx = -b.vx * restitution;
            }
            // Left wall bounce
            else if (b.x - r < 0) {
              b.x = r;
              b.vx = -b.vx * restitution;
            }
          } else {
            const w = b.width || 40;
            const h = b.height || 40;
            const hw = w / 2;
            const hh = h / 2;

            // Floor bounce
            if (b.y + hh > height) {
              b.y = height - hh;
              b.vy = -b.vy * restitution;
              b.vx *= 0.95;
            }
            // Ceiling bounce
            else if (b.y - hh < 0) {
              b.y = hh;
              b.vy = -b.vy * restitution;
            }

            // Right wall bounce
            if (b.x + hw > width) {
              b.x = width - hw;
              b.vx = -b.vx * restitution;
            }
            // Left wall bounce
            else if (b.x - hw < 0) {
              b.x = hw;
              b.vx = -b.vx * restitution;
            }
          }
        }

        // 3. Simple particle collisions (circle to circle & rect to circle)
        for (let i = 0; i < current.length; i++) {
          for (let j = i + 1; j < current.length; j++) {
            const b1 = current[i];
            const b2 = current[j];

            if (b1.type === 'circle' && b2.type === 'circle') {
              const r1 = b1.radius || 20;
              const r2 = b2.radius || 20;
              const dx = b2.x - b1.x;
              const dy = b2.y - b1.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              const minDist = r1 + r2;

              if (distance < minDist) {
                // Collision normal vector
                const nx = dx / (distance || 1);
                const ny = dy / (distance || 1);

                // 1. Resolve penetration (push apart)
                const overlap = minDist - distance;
                const totalMass = b1.mass + b2.mass;
                
                if (dragBodyRef.current !== b1.id) {
                  b1.x -= nx * overlap * (b2.mass / totalMass);
                  b1.y -= ny * overlap * (b2.mass / totalMass);
                }
                if (dragBodyRef.current !== b2.id) {
                  b2.x += nx * overlap * (b1.mass / totalMass);
                  b2.y += ny * overlap * (b1.mass / totalMass);
                }

                // 2. Relative velocity
                const rvx = b2.vx - b1.vx;
                const rvy = b2.vy - b1.vy;

                // Velocity along normal
                const velAlongNormal = rvx * nx + rvy * ny;

                // Only resolve if velocities are approaching
                if (velAlongNormal < 0) {
                  const combinedRestitution = Math.min(b1.restitution, b2.restitution);
                  const impulse = -(1 + combinedRestitution) * velAlongNormal / (1/b1.mass + 1/b2.mass);

                  if (dragBodyRef.current !== b1.id) {
                    b1.vx -= (impulse / b1.mass) * nx;
                    b1.vy -= (impulse / b1.mass) * ny;
                  }
                  if (dragBodyRef.current !== b2.id) {
                    b2.vx += (impulse / b2.mass) * nx;
                    b2.vy += (impulse / b2.mass) * ny;
                  }
                }
              }
            }
          }
        }

        return current;
      });

      animationFrameRef.current = requestAnimationFrame(updatePhysics);
    };

    animationFrameRef.current = requestAnimationFrame(updatePhysics);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning, gravity, friction, restitution]);

  // Handles mouse drag actions
  const handleMouseDown = (e: React.MouseEvent<SVGElement>, body: PhysicsBody) => {
    e.preventDefault();
    if (!svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = width / rect.width;
    const scaleY = height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    dragBodyRef.current = body.id;
    dragOffsetRef.current = {
      x: mouseX - body.x,
      y: mouseY - body.y
    };
  };

  const handleMouseMove = (e: React.MouseEvent<SVGElement>) => {
    if (!dragBodyRef.current || !svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = width / rect.width;
    const scaleY = height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    // Constrain to SVG boundaries
    const targetX = Math.max(10, Math.min(width - 10, mouseX - dragOffsetRef.current.x));
    const targetY = Math.max(10, Math.min(height - 10, mouseY - dragOffsetRef.current.y));

    setBodies(prev => prev.map(b => {
      if (b.id === dragBodyRef.current) {
        // Calculate instantaneous speed based on movement
        const instantVx = (targetX - b.x) * 0.4;
        const instantVy = (targetY - b.y) * 0.4;

        return {
          ...b,
          x: targetX,
          y: targetY,
          vx: instantVx,
          vy: instantVy
        };
      }
      return b;
    }));
  };

  const handleMouseUpOrLeave = () => {
    dragBodyRef.current = null;
  };

  const handleReset = () => {
    const copiedBodies = physics.bodies.map(b => ({
      ...b,
      vx: b.vx ?? 0,
      vy: b.vy ?? 0,
    }));
    setBodies(copiedBodies);
    setGravity(physics.gravity);
    setFriction(physics.friction);
    setRestitution(physics.restitution);
  };

  return (
    <div className="w-full flex flex-col bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl text-slate-100 font-sans">
      {/* Visualizer header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-emerald-400 animate-spin-slow" />
          <h3 className="text-sm font-semibold tracking-wide text-slate-200">
            لوحة محاكاة الفيزياء والحركة (BayanPhysics Panel)
          </h3>
        </div>

        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('simulation')}
            className={`px-3 py-1 rounded transition-all font-medium ${
              activeTab === 'simulation'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            المحاكاة البصرية
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-3 py-1 rounded transition-all font-medium ${
              activeTab === 'stats'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            تحليل المتجهات والبيانات ({bodies.length})
          </button>
        </div>
      </div>

      <div className="p-4 flex flex-col lg:flex-row gap-5">
        
        {/* Left Side: Simulation Screen */}
        {activeTab === 'simulation' ? (
          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-lg p-3 flex flex-col items-center justify-center relative min-h-[320px]">
            {/* Interactive SVG Box */}
            <div className="relative w-full max-w-[500px] border border-slate-700/60 rounded-md bg-[#090f1e] overflow-hidden aspect-[500/300] shadow-inner group">
              {/* Grid backdrop */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#132039_1px,transparent_1px),linear-gradient(to_bottom,#132039_1px,transparent_1px)] bg-[size:25px_25px] opacity-40 pointer-events-none" />
              
              {/* Guidelines helper overlay on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="absolute left-1/2 top-0 bottom-0 w-[0.5px] bg-emerald-500/10" />
                <div className="absolute top-1/2 left-0 right-0 h-[0.5px] bg-emerald-500/10" />
                <div className="absolute left-3 bottom-3 text-[10px] text-slate-500 font-mono flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-slate-400" />
                  اسحب الأجسام بمؤشر الفأرة لإطلاقها والتأثير عليها
                </div>
              </div>

              <svg
                ref={svgRef}
                viewBox={`0 0 ${width} ${height}`}
                className="w-full h-full select-none cursor-grab active:cursor-grabbing"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
              >
                {/* Render physical bodies */}
                <g>
                  {bodies.map((body) => {
                    const isHovered = hoveredBodyId === body.id;
                    const r = body.radius || 20;
                    const w = body.width || 40;
                    const h = body.height || 40;

                    return (
                      <g key={body.id}>
                        {body.type === 'circle' ? (
                          <circle
                            cx={body.x}
                            cy={body.y}
                            r={r}
                            fill={body.color}
                            className="transition-shadow duration-200 stroke-slate-200"
                            strokeWidth={isHovered ? 2.5 : 0.5}
                            onMouseEnter={() => setHoveredBodyId(body.id)}
                            onMouseLeave={() => setHoveredBodyId(null)}
                            onMouseDown={(e) => handleMouseDown(e, body)}
                          />
                        ) : (
                          <rect
                            x={body.x - w / 2}
                            y={body.y - h / 2}
                            width={w}
                            height={h}
                            rx={4}
                            fill={body.color}
                            className="transition-shadow duration-200 stroke-slate-200"
                            strokeWidth={isHovered ? 2.5 : 0.5}
                            onMouseEnter={() => setHoveredBodyId(body.id)}
                            onMouseLeave={() => setHoveredBodyId(null)}
                            onMouseDown={(e) => handleMouseDown(e, body)}
                          />
                        )}

                        {/* Speed vector drawing */}
                        {showVector && (body.vx !== 0 || body.vy !== 0) && (
                          <line
                            x1={body.x}
                            y1={body.y}
                            x2={body.x + body.vx * 3}
                            y2={body.y + body.vy * 3}
                            stroke="#e11d48"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            markerEnd="url(#arrow)"
                          />
                        )}
                        
                        {/* Shadow marker on hover */}
                        {isHovered && (
                          <g className="pointer-events-none">
                            <line x1={body.x} y1={0} x2={body.x} y2={height} stroke="rgba(16,185,129,0.15)" strokeDasharray="4 4" />
                            <line x1={0} y1={body.y} x2={width} y2={body.y} stroke="rgba(16,185,129,0.15)" strokeDasharray="4 4" />
                            <text x={body.x} y={body.y - (body.type === 'circle' ? r + 10 : h/2 + 10)} fill="#a7f3d0" fontSize="11" textAnchor="middle" className="font-mono bg-slate-950 px-1 font-bold">
                              {body.id} ({Math.round(body.x)}, {Math.round(body.y)})
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </g>

                {/* SVG Marker Definition for Vector Arrows */}
                <defs>
                  <marker
                    id="arrow"
                    viewBox="0 0 10 10"
                    refX="6"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 10 5 L 0 9 z" fill="#e11d48" />
                  </marker>
                </defs>
              </svg>
            </div>

            {/* Live stats footer */}
            <div className="w-full max-w-[500px] mt-2.5 flex justify-between items-center text-xs text-slate-400 border border-slate-800 p-2.5 rounded bg-slate-900/40">
              <span className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                المحاكي نشط: {isRunning ? 'تحديث فوري' : 'متوقف مؤقتا'}
              </span>
              <span>
                جاذبية البيئة: <strong className="text-emerald-400 font-mono">{gravity}m/s²</strong>
              </span>
            </div>
          </div>
        ) : (
          /* Live Stats & Vector Analysis Tab */
          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-lg p-4 min-h-[320px] flex flex-col justify-between">
            <div className="space-y-4 max-h-[250px] overflow-y-auto pr-1">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">الخصائص الميكانيكية اللحظية للأجسام</h4>
              {bodies.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-sm">
                  لا توجد كائنات فيزيائية مسجلة حالياً في المحاكي.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {bodies.map((body) => {
                    const speed = Math.sqrt(body.vx * body.vx + body.vy * body.vy).toFixed(1);
                    return (
                      <div key={body.id} className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex flex-col gap-1 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-emerald-400 font-mono">{body.id}</span>
                          <span className="bg-slate-800 px-2 py-0.5 rounded text-[10px] text-slate-300">
                            {body.type === 'circle' ? 'دائرة' : 'مستطيل'}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-slate-400 font-mono mt-1">
                          <div>الإحداثيات: <span className="text-slate-200">({Math.round(body.x)}, {Math.round(body.y)})</span></div>
                          <div>السرعة: <span className="text-rose-400 font-bold">{speed} px/f</span></div>
                          <div>سرعة الأفق Vx: <span className="text-slate-200">{body.vx.toFixed(1)}</span></div>
                          <div>سرعة العمود Vy: <span className="text-slate-200">{body.vy.toFixed(1)}</span></div>
                          <div>الكتلة التقريبية: <span className="text-slate-200">{Math.round(body.mass / 100)} كجم</span></div>
                          <div>معامل الارتداد: <span className="text-slate-200">{body.restitution}</span></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            <div className="border-t border-slate-800 pt-3 mt-2 flex items-center gap-2 text-xs text-slate-400 bg-slate-950/40 p-2.5 rounded">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>تقوم خوارزميات التصادم بتقدير الزخم الخطي المتبادل وحفظ طاقة الحركة بالتناظر.</span>
            </div>
          </div>
        )}

        {/* Right Side: Environment Physics Controllers */}
        <div className="w-full lg:w-[240px] flex flex-col justify-between bg-slate-900 border border-slate-800 rounded-lg p-4 gap-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">إعدادات البيئة (Sandbox)</span>
            </div>

            {/* Gravity slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs text-slate-400">
                <span>قوة الجاذبية (G)</span>
                <span className="text-emerald-400 font-mono">{gravity.toFixed(1)}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="25" 
                step="0.5"
                value={gravity}
                onChange={(e) => setGravity(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-950 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Elasticity/Restitution slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs text-slate-400">
                <span>مرونة الارتداد (Bounce)</span>
                <span className="text-emerald-400 font-mono">{restitution.toFixed(2)}</span>
              </div>
              <input 
                type="range" 
                min="0.1" 
                max="1" 
                step="0.05"
                value={restitution}
                onChange={(e) => setRestitution(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-950 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Friction/resistance slider */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs text-slate-400">
                <span>مقاومة الهواء (Friction)</span>
                <span className="text-emerald-400 font-mono">{(friction * 100).toFixed(0)}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="0.15" 
                step="0.01"
                value={friction}
                onChange={(e) => setFriction(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-950 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* Toggle show vector */}
            <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer select-none border border-slate-800 p-2 rounded bg-slate-950/40 hover:bg-slate-950 transition-all">
              <input 
                type="checkbox" 
                checked={showVector}
                onChange={(e) => setShowVector(e.target.checked)}
                className="rounded accent-emerald-500"
              />
              <span>إظهار متجهات الحركة (Red Vectors)</span>
            </label>
          </div>

          {/* Action controls */}
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex gap-2">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-bold transition-all shadow-md ${
                  isRunning 
                    ? 'bg-amber-600 hover:bg-amber-500 text-white' 
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-3.5 h-3.5" fill="currentColor" />
                    تجميد مؤقت
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" fill="currentColor" />
                    استئناف
                  </>
                )}
              </button>
              
              <button
                onClick={handleReset}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white p-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center border border-slate-700"
                title="إعادة تعيين للأصل"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
            
            <div className="text-[10px] text-slate-500 text-center leading-relaxed">
              محرك ميكانيكا كلاسيكية للبيان O(N²)
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
