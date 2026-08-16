export function SalesChart() {
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

  return (
    <div className="h-[300px] w-full flex items-end justify-between gap-2 pt-6">
      {data.map((item) => (
        <div key={item.month} className="flex flex-col items-center flex-1 group">
          <div className="w-full relative flex items-end justify-center h-[240px]">
            {/* Tooltip */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-slate-900 text-white text-xs py-1 px-2 rounded dark:bg-white dark:text-slate-900 whitespace-nowrap z-10 pointer-events-none">
              ${item.sales}k
            </div>
            {/* Bar */}
            <div 
              className="w-full max-w-[40px] bg-amber-500/80 hover:bg-amber-500 dark:bg-amber-500/60 dark:hover:bg-amber-400 rounded-t-sm transition-all duration-300"
              style={{ height: `${(item.sales / maxSales) * 100}%` }}
            ></div>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-3 font-medium">
            {item.month}
          </span>
        </div>
      ))}
    </div>
  );
}
