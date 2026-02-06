import React, { useEffect, useState, useCallback } from "react";
import api from "../../utils/api";
import { 
    ResponsiveContainer, AreaChart, Area, 
    XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from "recharts";
import { Wallet, ArrowUpCircle, ArrowDownCircle, Activity } from "lucide-react";

const Home = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showChart, setShowChart] = useState(false); // New state to delay chart rendering

    const fetchStats = useCallback(async (isMounted) => {
        try {
            const res = await api.get("/stats/dashboard");
            if (isMounted && res.data) {
                setData(res.data);
                // Delay showing the chart by 500ms to avoid "lanes" error
                setTimeout(() => {
                    if (isMounted) setShowChart(true);
                }, 500);
            }
        } catch (err) {
            console.error("Dashboard error", err);
        } finally {
            if (isMounted) setLoading(false);
        }
    }, []);

    useEffect(() => {
        let isMounted = true;
        fetchStats(isMounted);
        return () => { isMounted = false; };
    }, [fetchStats]);

    if (loading) return <div className="p-10 text-center text-white">Loading...</div>;

    const summary = data?.summary || { totalIncome: 0, totalExpense: 0, balance: 0 };
    const chartData = data?.chartData || [];

    return (
        <div className="p-4 md:p-6 bg-transparent">
            {/* KPI Cards remain the same as before... */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {/* Net Balance Card */}
                <div className="bg-[#875cf5] p-6 rounded-2xl text-white shadow-lg">
                    <p className="text-xs opacity-80 mb-1">Net Balance</p>
                    <h2 className="text-3xl font-bold">${summary.balance.toLocaleString()}</h2>
                </div>
                {/* Total Income Card */}
                <div className="bg-[#121212] p-6 rounded-2xl border border-gray-800">
                    <p className="text-xs text-gray-500 mb-1">Total Income</p>
                    <h2 className="text-2xl font-bold text-white">${summary.totalIncome.toLocaleString()}</h2>
                </div>
                {/* Total Expense Card */}
                <div className="bg-[#121212] p-6 rounded-2xl border border-gray-800">
                    <p className="text-xs text-gray-500 mb-1">Total Expenses</p>
                    <h2 className="text-2xl font-bold text-white">${summary.totalExpense.toLocaleString()}</h2>
                </div>
            </div>

            {/* CHART SECTION - THE STABILITY FIX */}
            <div className="bg-[#121212] p-4 md:p-8 rounded-3xl border border-gray-800">
                <h3 className="text-xl font-bold text-white mb-6">Cash Flow Trend</h3>
                
                {/* Wrap ResponsiveContainer in a div with a fixed height */}
                <div style={{ width: '100%', height: 350 }}>
                    {showChart && chartData.length > 0 ? (
                        <ResponsiveContainer>
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                                <XAxis 
                                    dataKey="date" 
                                    tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                                    stroke="#666"
                                    fontSize={12}
                                />
                                <YAxis stroke="#666" fontSize={12} />
                                <Tooltip contentStyle={{ backgroundColor: '#121212', border: '1px solid #333' }} />
                                <Legend />
                                <Area type="monotone" dataKey="income" stroke="#22c55e" fill="url(#colorIncome)" strokeWidth={3} />
                                <Area type="monotone" dataKey="expense" stroke="#ef4444" fill="url(#colorExpense)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex h-full items-center justify-center text-gray-600 border-2 border-dashed border-gray-800 rounded-xl italic">
                            {showChart ? "No transaction data yet." : "Finalizing chart layout..."}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;