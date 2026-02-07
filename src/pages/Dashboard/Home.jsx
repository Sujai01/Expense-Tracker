import { useEffect, useState } from "react";
import api from "../../utils/api";
import { 
    ResponsiveContainer, AreaChart, Area, 
    XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from "recharts";
import { Wallet, ArrowUpCircle, ArrowDownCircle, Activity } from "lucide-react";

const Home = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get("/stats/dashboard");
                setStats(res.data);
            } catch (err) {
                console.error("Dashboard error", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="p-10 text-center animate-pulse">Loading Dashboard...</div>;

    const { summary, chartData } = stats;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
                    <Activity className="text-blue-600" /> Financial Overview
                </h1>

                {/* KPI CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-2xl text-white shadow-xl shadow-blue-100">
                        <div className="flex justify-between items-center opacity-80 mb-2">
                            <span className="text-sm font-medium">Net Balance</span>
                            <Wallet size={20} />
                        </div>
                        <h2 className="text-3xl font-bold">${summary.balance.toLocaleString()}</h2>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-center text-gray-500 mb-2">
                            <span className="text-sm font-medium">Total Income</span>
                            <ArrowUpCircle className="text-green-500" size={20} />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800">${summary.totalIncome.toLocaleString()}</h2>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-center text-gray-500 mb-2">
                            <span className="text-sm font-medium">Total Expenses</span>
                            <ArrowDownCircle className="text-red-500" size={20} />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800">${summary.totalExpense.toLocaleString()}</h2>
                    </div>
                </div>

                {/* CHART SECTION */}
                {/* <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">Cash Flow Trend</h3>
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis 
                                    dataKey="date" 
                                    tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                                    stroke="#9ca3af"
                                    fontSize={12}
                                />
                                <YAxis stroke="#9ca3af" fontSize={12} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend verticalAlign="top" height={36}/>
                                <Area 
                                    type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={3}
                                    fillOpacity={1} fill="url(#colorIncome)" 
                                />
                                <Area 
                                    type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={3}
                                    fillOpacity={1} fill="url(#colorExpense)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div> */}
            </div>
        </div>
    );
};

export default Home;