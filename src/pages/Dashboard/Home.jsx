import React, { useEffect, useState, useMemo } from "react";
import api from "../../utils/api";
import { 
    ResponsiveContainer, AreaChart, Area, 
    XAxis, YAxis, CartesianGrid, Tooltip, 
    PieChart, Pie, Cell 
} from "recharts";
import { Wallet, ArrowUpCircle, ArrowDownCircle, Activity } from "lucide-react";

const Home = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true; // Prevents state updates on unmounted component

        const fetchStats = async () => {
            try {
                setLoading(true);
                const res = await api.get("/stats/dashboard");
                if (isMounted && res.data) {
                    setStats(res.data);
                }
            } catch (err) {
                console.error("Dashboard fetch error:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchStats();
        return () => { isMounted = false; };
    }, []);

    // Memoize chart data to prevent Recharts from re-calculating on every small render
    const donutData = useMemo(() => {
        if (!stats?.summary) return [];
        return [
            { name: 'Income', value: stats.summary.totalIncome, color: '#22c55e' },
            { name: 'Expense', value: stats.summary.totalExpense, color: '#ef4444' },
        ];
    }, [stats]);

    // 1. STABILITY GUARD: If loading, show a clean loader and STOP. 
    // This prevents Recharts from crashing the FiberNode.
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[80vh] text-zinc-500">
                <div className="flex flex-col items-center gap-4">
                    <Activity className="animate-spin text-[#875cf5]" size={40} />
                    <p className="animate-pulse font-medium">Loading your financial overview...</p>
                </div>
            </div>
        );
    }

    // 2. DATA GUARD: Safety values to prevent "undefined" errors
    const summary = stats?.summary || { totalIncome: 0, totalExpense: 0, balance: 0 };
    const chartData = stats?.chartData || [];

    return (
        <div className="p-6 bg-[#060606] min-h-screen text-white">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-2">
                    <Activity className="text-[#875cf5]" /> Financial Overview
                </h1>

                {/* KPI CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-gradient-to-br from-[#6d3ae9] to-[#875cf5] p-6 rounded-2xl text-white shadow-xl shadow-purple-500/10">
                        <div className="flex justify-between items-center opacity-80 mb-2">
                            <span className="text-sm font-medium">Net Balance</span>
                            <Wallet size={20} />
                        </div>
                        <h2 className="text-3xl font-bold">${summary.balance.toLocaleString()}</h2>
                    </div>

                    <div className="bg-[#121212] p-6 rounded-2xl border border-zinc-800 shadow-sm">
                        <div className="flex justify-between items-center text-zinc-400 mb-2">
                            <span className="text-sm font-medium">Total Income</span>
                            <ArrowUpCircle className="text-green-500" size={20} />
                        </div>
                        <h2 className="text-3xl font-bold text-white">${summary.totalIncome.toLocaleString()}</h2>
                    </div>

                    <div className="bg-[#121212] p-6 rounded-2xl border border-zinc-800 shadow-sm">
                        <div className="flex justify-between items-center text-zinc-400 mb-2">
                            <span className="text-sm font-medium">Total Expenses</span>
                            <ArrowDownCircle className="text-red-500" size={20} />
                        </div>
                        <h2 className="text-3xl font-bold text-white">${summary.totalExpense.toLocaleString()}</h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* TREND CHART */}
                    <div className="bg-[#121212] p-6 rounded-3xl border border-zinc-800 shadow-sm">
                        <h3 className="text-lg font-bold text-white mb-6">Cash Flow Trend</h3>
                        <div className="h-[300px] w-full">
                            {chartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                                        <XAxis 
                                            dataKey="date" 
                                            tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                                            stroke="#71717a"
                                            fontSize={12}
                                        />
                                        <YAxis stroke="#71717a" fontSize={12} />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#18181b', borderRadius: '12px', border: '1px solid #3f3f46', color: '#fff' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <Area 
                                            type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={3}
                                            fillOpacity={1} fill="url(#colorIncome)" 
                                        />
                                        <Area 
                                            type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3}
                                            fillOpacity={0} 
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-zinc-600 italic">
                                    No data available to plot trend
                                </div>
                            )}
                        </div>
                    </div>

                    {/* BREAKDOWN CHART */}
                    <div className="bg-[#121212] p-6 rounded-3xl border border-zinc-800 shadow-sm">
                        <h3 className="text-lg font-bold text-white mb-6">Income vs Expense</h3>
                        <div className="h-[300px] w-full">
                            {summary.totalIncome > 0 || summary.totalExpense > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={donutData}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={8}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {donutData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#18181b', borderRadius: '12px', border: '1px solid #3f3f46', color: '#fff' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex items-center justify-center text-zinc-600 italic">
                                    Add transactions to see breakdown
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;