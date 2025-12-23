import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";

// --- Colors from Premium Theme ---
const COLORS = {
  primary: "#2563eb", // blue-600
  secondary: "#4f46e5", // indigo-600
  success: "#16a34a", // green-600
  warning: "#ca8a04", // yellow-600
  danger: "#dc2626", // red-600
  slate: "#64748b", // slate-500
  grid: "#e2e8f0", // slate-200
  text: "#475569", // slate-600
};

const PIE_COLORS = ["#3b82f6", "#8b5cf6", "#f43f5e", "#10b981"]; // Blue, Violet, Rose, Emerald

// --- Mock Data ---

export const REVENUE_TREND_DATA = [
  { time: "6AM", value: 1200 },
  { time: "8AM", value: 3500 },
  { time: "10AM", value: 6800 },
  { time: "12PM", value: 9500 },
  { time: "2PM", value: 11200 },
  { time: "4PM", value: 12450 },
  { time: "6PM", value: 11800 }, // Projected drop or steady
];

export const REVENUE_SOURCE_DATA = [
  { name: "App", value: 68 },
  { name: "Direct", value: 25 },
  { name: "Web", value: 7 },
];

export const AREA_DEMAND_DATA = [
  { name: "Al Sadd", bookings: 12 },
  { name: "West Bay", bookings: 8 },
  { name: "Al Rayyan", bookings: 7 },
  { name: "The Pearl", bookings: 6 },
  { name: "Lusail", bookings: 5 },
];

// --- Components ---

export function RevenueAreaChart() {
  return (
    <div className="h-[200px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={REVENUE_TREND_DATA} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3} />
              <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLORS.grid} />
          <XAxis 
            dataKey="time" 
            tick={{ fill: COLORS.text, fontSize: 12 }} 
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            tick={{ fill: COLORS.text, fontSize: 12 }} 
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `Q${value / 1000}k`}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(value: number) => [`QAR ${value.toLocaleString()}`, "Revenue"]}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={COLORS.primary}
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorRevenue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RevenueSourcePieChart() {
  return (
    <div className="h-[180px] w-full flex items-center justify-center relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={REVENUE_SOURCE_DATA}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
          >
            {REVENUE_SOURCE_DATA.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} strokeWidth={0} />
            ))}
          </Pie>
          <Tooltip 
             contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
        </PieChart>
      </ResponsiveContainer>
      {/* Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-gray-400 text-xs font-medium">Top Source</span>
        <span className="text-xl font-bold text-gray-800">App</span>
      </div>
    </div>
  );
}

export function AreaDemandBarChart() {
  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={AREA_DEMAND_DATA}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={COLORS.grid} />
          <XAxis type="number" hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            axisLine={false} 
            tickLine={false}
            tick={{ fill: COLORS.text, fontSize: 12, fontWeight: 500 }}
            width={70}
          />
          <Tooltip
            cursor={{ fill: 'rgba(0,0,0,0.05)' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Bar dataKey="bookings" fill={COLORS.secondary} radius={[0, 4, 4, 0]} barSize={20}>
            {AREA_DEMAND_DATA.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index === 0 ? COLORS.danger : index === 1 ? COLORS.warning : COLORS.primary} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function UtilizationRadialChart({ value = 76 }: { value?: number }) {
  const data = [{ name: 'Utilization', value: value, fill: value > 80 ? COLORS.danger : value > 60 ? COLORS.success : COLORS.primary }];
  
  return (
      <div className="h-[140px] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart 
            cx="50%" 
            cy="50%" 
            innerRadius="70%" 
            outerRadius="100%" 
            barSize={10} 
            data={data} 
            startAngle={180} 
            endAngle={0}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar
              background
              cornerRadius={10}
              dataKey="value"
            />
          </RadialBarChart>
        </ResponsiveContainer>
        <div className="absolute inset-x-0 bottom-4 flex flex-col items-center justify-center pointer-events-none">
           <span className="text-3xl font-bold text-gray-800">{value}%</span>
           <span className="text-xs text-gray-500">Efficiency</span>
        </div>
      </div>
  );
}
