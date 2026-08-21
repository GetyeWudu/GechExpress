"use client";

import { useState } from "react";

export function SalesChart() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const data = [
    { month: "Jan", sales: 45 },
    { month: "Feb", sales: 52 },
    { month: "Mar", sales: 38 },
    { month: "Apr", sales: 65 },
    { month: "May", sales: 48 },
    { month: "Jun", sales: 80 },
    { month: "Jul", sales: 74 },
    { month: "Aug", sales: 90 },
    { month: "Sep", sales: 85 },
    { month: "Oct", sales: 110 },
    { month: "Nov", sales: 95 },
    { month: "Dec", sales: 130 },
  ];

  const maxSales = Math.max(...data.map(d => d.sales));
  
  // SVG Dimensions
  const viewBoxWidth = 1000;
  const viewBoxHeight = 240;
  
  // Create smooth bezier curve path
  const createPath = (data: {sales: number}[]) => {
    if (data.length === 0) return "";
    
    let path = "";
    const stepX = viewBoxWidth / (data.length - 1);
    
    data.forEach((point, i) => {
      const x = i * stepX;
      const y = viewBoxHeight - (point.sales / maxSales) * viewBoxHeight;
      
      if (i === 0) {
        path += `M ${x},${y}`;
      } else {
        const prevX = (i - 1) * stepX;
        const prevY = viewBoxHeight - (data[i - 1].sales / maxSales) * viewBoxHeight;
        
        // Control points for smooth curve
        const cp1x = prevX + (stepX / 2);
        const cp1y = prevY;
        const cp2x = x - (stepX / 2);
        const cp2y = y;
        
        path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${x},${y}`;
      }
    });
    return path;
  };

  const linePath = createPath(data);
  const areaPath = `${linePath} L ${viewBoxWidth},${viewBoxHeight} L 0,${viewBoxHeight} Z`;

  return (
    <div className="relative w-full pt-6 overflow-hidden sm:overflow-visible">
      {/* Y-Axis Labels & Grid Lines */}
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 z-0">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center w-full gap-2 sm:gap-4">
            <span className="text-[9px] sm:text-[10px] font-medium text-slate-400 w-6 sm:w-8 text-right shrink-0">
              ${Math.round(maxSales - (i * (maxSales / 4)))}k
            </span>
            <div className="flex-1 border-t border-slate-200/50 dark:border-white/5 border-dashed" />
          </div>
        ))}
      </div>

      {/* Chart Area */}
      <div className="relative w-[calc(100%-2rem)] sm:w-[calc(100%-3rem)] h-[240px] ml-8 sm:ml-12 z-10">
        <svg 
          viewBox={`0 -10 ${viewBoxWidth} ${viewBoxHeight + 20}`} 
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Area Fill */}
          <path
            d={areaPath}
            fill="url(#colorSales)"
            className="transition-all duration-700 ease-in-out"
          />
          
          {/* Main Line */}
          <path
            d={linePath}
            fill="none"
            stroke="#6366f1"
            strokeWidth="3"
            filter="url(#glow)"
            className="transition-all duration-700 ease-in-out"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive Data Points */}
          {data.map((item, i) => {
            const x = i * (viewBoxWidth / (data.length - 1));
            const y = viewBoxHeight - (item.sales / maxSales) * viewBoxHeight;
            const isHovered = hoveredIndex === i;

            return (
              <g 
                key={item.month}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer"
              >
                {/* Invisible larger hit area for easier hovering */}
                <circle cx={x} cy={y} r="30" fill="transparent" />
                
                {/* Visible dot */}
                <circle 
                  cx={x} 
                  cy={y} 
                  r={isHovered ? "6" : "4"} 
                  fill={isHovered ? "#6366f1" : "white"} 
                  stroke="#6366f1"
                  strokeWidth="2"
                  className="transition-all duration-200"
                  filter={isHovered ? "url(#glow)" : ""}
                />
                
                {/* Vertical hover line */}
                {isHovered && (
                  <line 
                    x1={x} y1={y + 8} 
                    x2={x} y2={viewBoxHeight} 
                    stroke="#6366f1" 
                    strokeWidth="1" 
                    strokeDasharray="4 4"
                    opacity="0.5"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Custom HTML Tooltip */}
        {hoveredIndex !== null && (
          <div 
            className="absolute z-20 pointer-events-none transition-all duration-200"
            style={{ 
              left: `${hoveredIndex * (100 / (data.length - 1))}%`, 
              top: `${100 - (data[hoveredIndex].sales / maxSales) * 100}%`,
              transform: 'translate(-50%, -100%)'
            }}
          >
            <div className="bg-slate-900 text-white text-xs py-1.5 px-3 rounded-lg shadow-xl dark:bg-white dark:text-slate-900 whitespace-nowrap mb-3 font-semibold flex flex-col items-center">
              <span>{data[hoveredIndex].month} 2026</span>
              <span className="text-indigo-400 dark:text-indigo-600">${data[hoveredIndex].sales}k</span>
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900 dark:border-t-white" />
            </div>
          </div>
        )}
      </div>

      {/* X-Axis Labels */}
      <div className="relative w-[calc(100%-2rem)] sm:w-[calc(100%-3rem)] ml-8 sm:ml-12 mt-4 overflow-x-auto hide-scrollbar">
        <div className="flex justify-between items-center min-w-[300px] w-full">
          {data.map((item, i) => (
            <div key={item.month} className="flex flex-col items-center flex-1">
              <span 
                className={`text-[8px] sm:text-[10px] font-semibold uppercase tracking-wider transition-colors duration-200 ${
                  hoveredIndex === i ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {item.month}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
