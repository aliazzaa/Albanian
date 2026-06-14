import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart, Compass, Layers, ListCollapse, Play, RefreshCw, Sparkles, TrendingUp } from 'lucide-react';
import { ExecutionResult, GraphicalShape, GraphicalChart } from '../types';

interface GraphicalOutputProps {
  graphics: NonNullable<ExecutionResult['generatedGraphics']>;
}

export const GraphicalOutput: React.FC<GraphicalOutputProps> = ({ graphics }) => {
  const { shapes = [], chart, canvasActive } = graphics;
  const [activeSubTab, setActiveSubTab] = useState<'canvas' | 'chart'>(
    chart ? 'chart' : 'canvas'
  );
  const [hoveredShape, setHoveredShape] = useState<number | null>(null);
  const [hoveredDataPoint, setHoveredDataPoint] = useState<number | null>(null);

  // Default coordinate boundaries
  const viewBoxWidth = 500;
  const viewBoxHeight = 300;

  // Compute stats for charts
  const maxVal = chart && chart.data.length > 0 ? Math.max(...chart.data) : 100;
  const minVal = chart && chart.data.length > 0 ? Math.min(...chart.data) : 0;
  const chartHeight = 200;
  const chartWidth = 440;
  const paddingX = 40;
  const paddingY = 20;

  return (
    <div className="w-full flex flex-col bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl text-slate-100 font-sans">
      {/* Tab select bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
          <h3 className="text-sm font-semibold tracking-wide text-slate-200">
            العارض الرسومي التفاعلي (Interactive Media Viewer)
          </h3>
        </div>
        
        <div className="flex bg-slate-950/80 p-1 rounded-lg border border-slate-800 text-xs">
          {chart && (
            <button
              id="tab-btn-chart"
              onClick={() => setActiveSubTab('chart')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all font-medium ${
                activeSubTab === 'chart'
                  ? 'bg-[#10b981] text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart className="w-3.5 h-3.5" />
              الرسوم البيانية ({chart.type === 'bar' ? 'أعمدة' : 'خطي'})
            </button>
          )}
          {shapes.length > 0 && (
            <button
              id="tab-btn-canvas"
              onClick={() => setActiveSubTab('canvas')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all font-medium ${
                activeSubTab === 'canvas'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              لوحة الأشكال وCanvas ({shapes.length})
            </button>
          )}
        </div>
      </div>

      <div className="p-4 flex flex-col md:flex-row gap-5">
        
        {/* Main Render Frame */}
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-lg p-3 flex flex-col items-center justify-center relative min-h-[320px]">
          {activeSubTab === 'canvas' ? (
            <div className="w-full flex flex-col items-center">
              {/* Virtual SVG Screen Box */}
              <div className="relative w-full max-w-[500px] border border-slate-700/60 rounded-md bg-[#0d1527] overflow-hidden aspect-[500/300] shadow-inner group">
                {/* Horizontal & vertical layout grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:25px_25px] opacity-20 pointer-events-none" />
                
                {/* Center marker guide on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="absolute left-1/2 top-0 bottom-0 w-[0.5px] bg-indigo-500/20" />
                  <div className="absolute top-1/2 left-0 right-0 h-[0.5px] bg-indigo-500/20" />
                  <div className="absolute left-2 bottom-2 text-[10px] text-slate-500 font-mono">
                    لوحة رسم ٥٠٠ × ٣٠٠ إحداثية
                  </div>
                </div>

                <svg
                  viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
                  className="w-full h-full"
                >
                  <g>
                    {shapes.map((shape, idx) => {
                      const isHovered = hoveredShape === idx;
                      const transition = { type: 'spring', stiffness: 100, damping: 15 };
                      
                      if (shape.type === 'rect') {
                        return (
                          <motion.rect
                            key={`shape-${idx}`}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            whileHover={{ scale: 1.02 }}
                            transition={transition}
                            x={shape.x}
                            y={shape.y}
                            width={shape.width || 40}
                            height={shape.height || 40}
                            fill={shape.color || '#10b981'}
                            stroke={isHovered ? '#ffffff' : 'none'}
                            strokeWidth={isHovered ? 2 : 0}
                            className="cursor-pointer"
                            onMouseEnter={() => setHoveredShape(idx)}
                            onMouseLeave={() => setHoveredShape(null)}
                          />
                        );
                      } else if (shape.type === 'circle') {
                        const radius = shape.width ? shape.width / 2 : 20;
                        return (
                          <motion.circle
                            key={`shape-${idx}`}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            whileHover={{ scale: 1.05 }}
                            transition={transition}
                            cx={shape.x}
                            cy={shape.y}
                            r={radius}
                            fill={shape.color || '#3b82f6'}
                            stroke={isHovered ? '#ffffff' : 'none'}
                            strokeWidth={isHovered ? 2 : 0}
                            className="cursor-pointer"
                            onMouseEnter={() => setHoveredShape(idx)}
                            onMouseLeave={() => setHoveredShape(null)}
                          />
                        );
                      } else if (shape.type === 'line') {
                        return (
                          <motion.line
                            key={`shape-${idx}`}
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.8 }}
                            x1={shape.x}
                            y1={shape.y}
                            x2={shape.x2 ?? shape.x}
                            y2={shape.y2 ?? shape.y}
                            stroke={shape.color || '#ef4444'}
                            strokeWidth={isHovered ? 4 : 2.5}
                            strokeLinecap="round"
                            className="cursor-pointer"
                            onMouseEnter={() => setHoveredShape(idx)}
                            onMouseLeave={() => setHoveredShape(null)}
                          />
                        );
                      } else if (shape.type === 'text') {
                        return (
                          <motion.text
                            key={`shape-${idx}`}
                            initial={{ opacity: 0, y: shape.y + 10 }}
                            animate={{ opacity: 1, y: shape.y }}
                            transition={{ duration: 0.5 }}
                            x={shape.x}
                            y={shape.y}
                            fill={shape.color || '#ffffff'}
                            fontSize="13"
                            fontWeight="500"
                            fontFamily="sans-serif"
                            textAnchor="middle"
                            dominantBaseline="central"
                            onMouseEnter={() => setHoveredShape(idx)}
                            onMouseLeave={() => setHoveredShape(null)}
                            className="cursor-pointer select-none font-bold"
                          >
                            {shape.text}
                          </motion.text>
                        );
                      }
                      return null;
                    })}
                  </g>
                </svg>
              </div>

              {/* Coordinates Indicator */}
              <div className="w-full max-w-[500px] mt-2 flex justify-between items-center text-xs text-slate-400 border border-slate-800 p-2 rounded bg-slate-900/40">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  لوحة رسومات البيكسل النشطة
                </span>
                <span>
                  {hoveredShape !== null ? (
                    <span className="text-amber-400 font-mono">
                      الشكل #{hoveredShape + 1}: {shapes[hoveredShape].type === 'rect' ? 'مستطيل' : shapes[hoveredShape].type === 'circle' ? 'دائرة' : shapes[hoveredShape].type === 'line' ? 'خط مستقيم' : 'نص مخصص'} 
                      {' | '} ( س: {shapes[hoveredShape].x}، ص: {shapes[hoveredShape].y} )
                    </span>
                  ) : (
                    'مرر الماوس فوق أي شكل لرؤية الإحداثيات'
                  )}
                </span>
              </div>
            </div>
          ) : (
            chart && (
              <div className="w-full flex flex-col items-center">
                {/* Custom SVG Responsive Chart */}
                <h4 className="text-sm font-bold text-slate-300 mb-3 tracking-wide">
                  {chart.title || 'رسم بياني إحصائي'}
                </h4>
                
                <div className="w-full max-w-[500px] aspect-[500/280] relative bg-slate-950 border border-slate-800 p-4 rounded-xl shadow-inner overflow-hidden">
                  <svg viewBox="0 0 500 250" className="w-full h-full">
                    {/* Y-Axis guide lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((ratio, gridIdx) => {
                      const yPos = paddingY + (chartHeight - paddingY) * (1 - ratio);
                      const displayVal = Math.round(minVal + (maxVal - minVal) * ratio);
                      return (
                        <g key={`grid-line-${gridIdx}`} className="opacity-40">
                          <line
                            x1={paddingX}
                            y1={yPos}
                            x2={chartWidth}
                            y2={yPos}
                            stroke="#475569"
                            strokeWidth="0.5"
                            strokeDasharray="4 4"
                          />
                          <text
                            x={paddingX - 8}
                            y={yPos + 4}
                            fill="#94a3b8"
                            fontSize="9"
                            className="font-mono text-right"
                            textAnchor="end"
                          >
                            {displayVal}
                          </text>
                        </g>
                      );
                    })}

                    {/* Chart Bars/Points mapping */}
                    {chart.data.map((val, idx) => {
                      const totalElements = chart.data.length;
                      const barSpacing = (chartWidth - paddingX) / totalElements;
                      const xCenter = paddingX + idx * barSpacing + barSpacing / 2;
                      
                      // Calculate height relative to max element
                      const scaleRatio = maxVal > 0 ? val / maxVal : 0;
                      // Keep some margin from peak coordinates
                      const finalHeight = scaleRatio * (chartHeight - paddingY - 10);
                      const barY = chartHeight - finalHeight;

                      const isSelected = hoveredDataPoint === idx;

                      if (chart.type === 'bar') {
                        const barWidth = Math.max(16, barSpacing * 0.5);
                        return (
                          <g key={`bar-${idx}`}>
                            <motion.rect
                              initial={{ height: 0, y: chartHeight }}
                              animate={{ height: finalHeight, y: barY }}
                              transition={{ type: 'spring', damping: 15 }}
                              x={xCenter - barWidth / 2}
                              y={barY}
                              width={barWidth}
                              height={finalHeight}
                              fill={isSelected ? '#10b981' : 'url(#barGradient)'}
                              rx="4"
                              className="cursor-pointer"
                              onMouseEnter={() => setHoveredDataPoint(idx)}
                              onMouseLeave={() => setHoveredDataPoint(null)}
                            />
                            
                            {/* Value tooltip above bars */}
                            {isSelected && (
                              <motion.text
                                initial={{ opacity: 0, y: barY - 15 }}
                                animate={{ opacity: 1, y: barY - 5 }}
                                x={xCenter}
                                fill="#ffffff"
                                fontSize="10"
                                fontWeight="bold"
                                textAnchor="middle"
                              >
                                {val}
                              </motion.text>
                            )}

                            {/* X-Axis labels */}
                            <text
                              x={xCenter}
                              y={chartHeight + 15}
                              fill={isSelected ? '#38bdf8' : '#64748b'}
                              fontSize="9"
                              fontWeight={isSelected ? 'bold' : 'normal'}
                              textAnchor="middle"
                              className="cursor-pointer"
                            >
                              {chart.labels[idx] || `عنصر ${idx + 1}`}
                            </text>
                          </g>
                        );
                      } else {
                        // Drawing line charts
                        const nextVal = chart.data[idx + 1];
                        const hasNext = nextVal !== undefined;
                        const nextXCenter = paddingX + (idx + 1) * barSpacing + barSpacing / 2;
                        const nextScaleRatio = maxVal > 0 ? nextVal / maxVal : 0;
                        const nextFinalHeight = nextScaleRatio * (chartHeight - paddingY - 10);
                        const nextBarY = chartHeight - nextFinalHeight;

                        return (
                          <g key={`line-group-${idx}`}>
                            {hasNext && (
                              <motion.line
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 0.8, delay: idx * 0.1 }}
                                x1={xCenter}
                                y1={barY}
                                x2={nextXCenter}
                                y2={nextBarY}
                                stroke="#10b981"
                                strokeWidth="3"
                                strokeLinecap="round"
                              />
                            )}

                            {/* Pointer node */}
                            <circle
                              cx={xCenter}
                              cy={barY}
                              r={isSelected ? 6 : 4}
                              fill={isSelected ? '#38bdf8' : '#10b981'}
                              stroke="#0f172a"
                              strokeWidth="2"
                              className="cursor-pointer"
                              onMouseEnter={() => setHoveredDataPoint(idx)}
                              onMouseLeave={() => setHoveredDataPoint(null)}
                            />

                            {/* Value tooltip above active node */}
                            {isSelected && (
                              <motion.text
                                initial={{ opacity: 0, y: barY - 15 }}
                                animate={{ opacity: 1, y: barY - 8 }}
                                x={xCenter}
                                fill="#ffffff"
                                fontSize="10"
                                fontWeight="bold"
                                textAnchor="middle"
                              >
                                {val}
                              </motion.text>
                            )}

                            {/* X-Axis labels */}
                            <text
                              x={xCenter}
                              y={chartHeight + 15}
                              fill={isSelected ? '#38bdf8' : '#64748b'}
                              fontSize="9"
                              fontWeight={isSelected ? 'bold' : 'normal'}
                              textAnchor="middle"
                            >
                              {chart.labels[idx] || `عنصر ${idx + 1}`}
                            </text>
                          </g>
                        );
                      }
                    })}

                    {/* SVG Gradients */}
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#047857" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                {/* Sub title details info */}
                <div className="w-full max-w-[500px] mt-2 flex justify-between items-center text-xs text-slate-400 border border-slate-800 p-2 rounded bg-slate-900/40">
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <TrendingUp className="w-3.5 h-3.5" />
                    تمثيل المخطط البياني التفاعلي
                  </span>
                  <span>
                    {hoveredDataPoint !== null ? (
                      <span>
                        <strong className="text-slate-200">
                          {chart.labels[hoveredDataPoint]}:
                        </strong>{' '}
                        <span className="text-emerald-400 font-mono text-sm ml-1">
                          {chart.data[hoveredDataPoint]}
                        </span>
                      </span>
                    ) : (
                      'مرر الماوس فوق الأقسام لعرض القيم'
                    )}
                  </span>
                </div>
              </div>
            )
          )}
        </div>

        {/* Sidebar Data Inspector & Meta lists */}
        <div className="w-full md:w-[260px] flex flex-col gap-3 bg-slate-900 border border-slate-800 rounded-lg p-3">
          <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2 text-xs font-bold text-slate-300">
            <ListCollapse className="w-3.5 h-3.5 text-blue-400" />
            <span>مفتش العناصر والبيانات الرسومية</span>
          </div>

          <div className="flex-1 overflow-y-auto max-h-[250px] space-y-2 pr-1 custom-scrollbar">
            {activeSubTab === 'canvas' ? (
              shapes.map((item, id) => (
                <div
                  key={`inspector-item-${id}`}
                  onMouseEnter={() => setHoveredShape(id)}
                  onMouseLeave={() => setHoveredShape(null)}
                  className={`p-2 rounded border text-xs cursor-pointer transition-all ${
                    hoveredShape === id
                      ? 'bg-blue-950/40 border-blue-500 scale-[1.01]'
                      : 'bg-slate-950/40 border-slate-850 hover:bg-slate-900/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-center font-bold mb-1">
                    <span className="text-slate-300 flex items-center gap-1.5 font-sans">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color || '#3b82f6' }}></span>
                      {item.type === 'rect' ? 'مستطيل (Rectangle)' : item.type === 'circle' ? 'دائرة (Circle)' : item.type === 'line' ? 'خط (Line)' : 'نص مخصص (Text)'}
                    </span>
                    <span className="text-slate-500 text-[10px] font-mono">#{id+1}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono space-y-0.5 leading-relaxed">
                    <div>س-الإحداثي: {item.x} | ص-الإحداثي: {item.y}</div>
                    {item.width && <div>العرض/القطر: {item.width} بيكسل</div>}
                    {item.height && <div>الارتفاع: {item.height} بيكسل</div>}
                    {item.x2 !== undefined && <div>س٢: {item.x2} | ص٢: {item.y2}</div>}
                    {item.text && <div className="text-amber-400 font-bold max-w-[200px] truncate">المحتوى: {item.text}</div>}
                  </div>
                </div>
              ))
            ) : (
              chart && (
                <div className="space-y-2">
                  <div className="p-2 border border-emerald-900/50 bg-emerald-950/20 rounded text-xs leading-relaxed text-slate-300">
                    <strong className="text-emerald-400 block mb-1">بيانات المخطط الإحصائية:</strong>
                    أقصى قيمة: <span className="font-mono text-emerald-400">{maxVal}</span>
                    <br />
                    أدنى قيمة: <span className="font-mono text-slate-400">{minVal}</span>
                    <br />
                    عدد عناصر السلسلة: <span className="font-mono">{chart.data.length} عناصر</span>
                  </div>

                  {chart.data.map((val, id) => (
                    <div
                      key={`inspector-datapoint-${id}`}
                      onMouseEnter={() => setHoveredDataPoint(id)}
                      onMouseLeave={() => setHoveredDataPoint(null)}
                      className={`p-2 rounded border text-xs cursor-pointer transition-all flex justify-between items-center ${
                        hoveredDataPoint === id
                          ? 'bg-emerald-950/30 border-emerald-500 scale-[1.01]'
                          : 'bg-slate-950/40 border-slate-850 hover:bg-slate-900/80 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-slate-300 font-medium">
                        {chart.labels[id] || `عنصر ${id + 1}`}
                      </span>
                      <span className="text-emerald-400 font-mono font-bold">
                        {val}
                      </span>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
          
          <div className="text-[10px] text-slate-500 leading-relaxed pt-1 border-t border-slate-800">
            * يتم تحديث هذه العناصر تلقائياً تزامناً مع تنفيذ سطور كود لغة "البيان" المنطوقة.
          </div>
        </div>

      </div>
    </div>
  );
};
