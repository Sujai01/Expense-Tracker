import { useEffect, useState } from "react";
import api from "../../utils/api";
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

    if (loading) return <div className="p-10 text-center text-zinc-500 animate-pulse">Loading Dashboard...</div>;

    const { summary } = stats;

    return (
        <div className="p-6 bg-[#060606] min-h-screen text-white">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-2">
                    <Activity className="text-[#875cf5]" /> Financial Overview
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    {/* KPI CARDS - Using hardcoded dark backgrounds */}
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
                
                {/* Chart section commented as requested */}
            </div>
        </div>
    );
};

export default Home;