'use client'
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

// ── Color Palettes ──────────────────────────────────────────────
const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#14b8a6']
const STATUS_COLORS = {
    'ORDER PLACED': '#6366f1',
    'PROCESSING':   '#f59e0b',
    'SHIPPED':      '#3b82f6',
    'DELIVERED':    '#10b981',
    'CANCELLED':    '#ef4444',
}

const CustomTooltipWrapper = ({ className = '', children }) => (
    <div className={`bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3 text-xs ${className}`}>
        {children}
    </div>
)

// ─── 1. Daily Activity Chart (Area) ─────────────────────────────
export function DailyActivityChart({ data }) {
    if (!data || data.length === 0) return <EmptyChart label="No activity data yet" />

    return (
        <div className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="gradOrders" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={{ stroke: '#e2e8f0' }}
                        tickFormatter={(v) => { const d = new Date(v); return `${d.getDate()}/${d.getMonth() + 1}` }}
                    />
                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip content={({ active, payload, label }) => {
                        if (!active || !payload) return null
                        return (
                            <CustomTooltipWrapper>
                                <p className="font-semibold text-slate-700 mb-1">{label}</p>
                                {payload.map((p, i) => (
                                    <p key={i} style={{ color: p.color }}>
                                        {p.name}: <span className="font-bold">{p.name === 'revenue' ? `₹${p.value}` : p.value}</span>
                                    </p>
                                ))}
                            </CustomTooltipWrapper>
                        )
                    }} />
                    <Area type="monotone" dataKey="orders" stroke="#6366f1" fill="url(#gradOrders)" strokeWidth={2} name="orders" />
                    <Area type="monotone" dataKey="revenue" stroke="#10b981" fill="url(#gradRevenue)" strokeWidth={2} name="revenue" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}

// ─── 2. Top Spenders Bar Chart ──────────────────────────────────
export function TopSpendersChart({ data, currencySymbol = '₹' }) {
    if (!data || data.length === 0) return <EmptyChart label="No spender data yet" />

    const chartData = data.map((d, i) => ({
        ...d,
        name: d.userId?.slice(0, 8) + '…',
        fill: COLORS[i % COLORS.length],
    }))

    return (
        <div className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barSize={32}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                    <Tooltip content={({ active, payload }) => {
                        if (!active || !payload?.[0]) return null
                        const d = payload[0].payload
                        return (
                            <CustomTooltipWrapper>
                                <p className="text-slate-500 mb-0.5">User: <span className="font-semibold text-slate-700">{d.userId}</span></p>
                                <p className="text-indigo-600 font-bold">{currencySymbol}{d.totalSpent.toLocaleString()}</p>
                                <p className="text-slate-400">{d.orderCount} orders</p>
                            </CustomTooltipWrapper>
                        )
                    }} />
                    <Bar dataKey="totalSpent" radius={[6, 6, 0, 0]}>
                        {chartData.map((entry, i) => (
                            <Cell key={i} fill={entry.fill} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

// ─── 3. Order Distribution Pie Chart ────────────────────────────
export function OrderDistributionChart({ data }) {
    if (!data || data.length === 0 || data.every(d => d.count === 0)) return <EmptyChart label="No distribution data" />

    return (
        <div className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="count"
                        nameKey="range"
                        strokeWidth={0}
                    >
                        {data.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={({ active, payload }) => {
                        if (!active || !payload?.[0]) return null
                        return (
                            <CustomTooltipWrapper>
                                <p className="text-slate-700 font-semibold">{payload[0].name} orders</p>
                                <p className="text-indigo-600 font-bold">{payload[0].value} users</p>
                            </CustomTooltipWrapper>
                        )
                    }} />
                    <Legend formatter={(value) => <span className="text-xs text-slate-500">{value} orders</span>} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}

// ─── 4. Spending Over Time (Single User — Area) ─────────────────
export function SpendingOverTimeChart({ data, currencySymbol = '₹' }) {
    if (!data || data.length === 0) return <EmptyChart label="No spending data yet" />

    return (
        <div className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="gradSpent" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                    <Tooltip content={({ active, payload, label }) => {
                        if (!active || !payload?.[0]) return null
                        return (
                            <CustomTooltipWrapper>
                                <p className="text-slate-500 mb-1">{label}</p>
                                <p className="text-violet-600 font-bold">{currencySymbol}{payload[0].value.toLocaleString()}</p>
                                <p className="text-slate-400">{payload[0].payload.orders} order{payload[0].payload.orders > 1 ? 's' : ''}</p>
                            </CustomTooltipWrapper>
                        )
                    }} />
                    <Area type="monotone" dataKey="spent" stroke="#8b5cf6" fill="url(#gradSpent)" strokeWidth={2.5} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}

// ─── 5. Order Status Donut ──────────────────────────────────────
export function OrderStatusChart({ data }) {
    if (!data || data.length === 0) return <EmptyChart label="No order data" />

    return (
        <div className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="count"
                        nameKey="status"
                        strokeWidth={0}
                    >
                        {data.map((entry, i) => (
                            <Cell key={i} fill={STATUS_COLORS[entry.status] || COLORS[i % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={({ active, payload }) => {
                        if (!active || !payload?.[0]) return null
                        return (
                            <CustomTooltipWrapper>
                                <p className="text-slate-700 font-semibold capitalize">{payload[0].name}</p>
                                <p className="text-indigo-600 font-bold">{payload[0].value} orders</p>
                            </CustomTooltipWrapper>
                        )
                    }} />
                    <Legend formatter={(value) => <span className="text-xs text-slate-500 capitalize">{value.toLowerCase()}</span>} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}

// ─── 6. Payment Method Bar Chart ────────────────────────────────
export function PaymentMethodChart({ data, currencySymbol = '₹' }) {
    if (!data || data.length === 0) return <EmptyChart label="No payment data" />

    return (
        <div className="w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} barSize={48}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="method" tick={{ fontSize: 12, fill: '#64748b' }} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                    <Tooltip content={({ active, payload }) => {
                        if (!active || !payload?.[0]) return null
                        const d = payload[0].payload
                        return (
                            <CustomTooltipWrapper>
                                <p className="text-slate-700 font-semibold">{d.method}</p>
                                <p className="text-indigo-600 font-bold">{d.count} orders</p>
                                <p className="text-emerald-600">{currencySymbol}{d.amount.toLocaleString()}</p>
                            </CustomTooltipWrapper>
                        )
                    }} />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                        <Cell fill="#8b5cf6" />
                        <Cell fill="#f59e0b" />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

// ─── Empty State ────────────────────────────────────────────────
function EmptyChart({ label }) {
    return (
        <div className="w-full h-[280px] flex items-center justify-center">
            <p className="text-sm text-slate-400">{label}</p>
        </div>
    )
}
