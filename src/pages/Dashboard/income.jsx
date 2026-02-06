import React, { useState, useEffect, useCallback } from "react";
import api from "../../utils/api";
import { toast } from "react-hot-toast";
import { 
    PlusCircle, 
    Trash2, 
    Download, 
    Wallet, 
    Calendar, 
    TrendingUp,
    CircleDollarSign
} from "lucide-react";

const Income = () => {
    const [incomes, setIncomes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        source: "",
        amount: "",
        date: new Date().toISOString().split('T')[0],
        category: "Salary",
        description: ""
    });

    const fetchIncomes = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get("/income/get");
            if (res.data?.success) {
                setIncomes(res.data.data);
            }
        } catch (err) {
            console.error("Fetch error:", err);
            toast.error("Failed to load income records");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchIncomes();
    }, [fetchIncomes]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/income/add", formData);
            if (res.data?.success) {
                toast.success("Income added successfully!");
                setFormData({
                    source: "",
                    amount: "",
                    date: new Date().toISOString().split('T')[0],
                    category: "Salary",
                    description: ""
                });
                fetchIncomes();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Error adding income");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this record?")) return;
        try {
            const res = await api.delete(`/income/${id}`);
            if (res.data?.success) {
                toast.success("Record deleted");
                setIncomes(prev => prev.filter(item => item._id !== id));
            }
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    // SECURE DOWNLOAD LOGIC
    const handleDownload = async () => {
        try {
            toast.loading("Preparing Excel report...", { id: "download" });
            const response = await api.get("/income/download", {
                responseType: 'blob', 
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Incomes_Report.xlsx'); 
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            
            toast.success("Income report downloaded!", { id: "download" });
        } catch (err) {
            console.error("Download error:", err);
            toast.error("Failed to download Excel report", { id: "download" });
        }
    };

    const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <TrendingUp className="text-green-600" /> Income Tracker
                    </h1>
                    <p className="text-gray-500">Total Revenue: <span className="text-green-600 font-bold">${totalIncome.toLocaleString()}</span></p>
                </div>
                <button 
                    onClick={handleDownload}
                    className="flex items-center gap-2 bg-white border border-gray-300 px-5 py-2.5 rounded-xl hover:bg-gray-50 transition shadow-sm text-gray-700 font-medium"
                >
                    <Download size={18} /> Export Excel
                </button>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-6">
                        <div className="flex items-center gap-2 mb-6">
                            <PlusCircle className="text-green-500" />
                            <h2 className="text-xl font-semibold text-gray-800">Add Income</h2>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Source</label>
                                <input type="text" placeholder="e.g. Salary" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500" value={formData.source} onChange={(e) => setFormData({...formData, source: e.target.value})} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Amount ($)</label>
                                <input type="number" placeholder="0.00" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Date</label>
                                <input type="date" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required />
                            </div>
                            <button className="w-full bg-green-600 text-white py-3.5 rounded-xl font-bold hover:bg-green-700 transition">Save Income</button>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-8">
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-gray-50 font-semibold">Transaction History</div>
                        <div className="divide-y divide-gray-100">
                            {loading ? <div className="p-10 text-center animate-pulse">Loading...</div> : incomes.map((item) => (
                                <div key={item._id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center font-bold">I</div>
                                        <div>
                                            <p className="font-bold text-gray-800">{item.source}</p>
                                            <p className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className="text-green-600 font-bold text-lg">+${item.amount.toLocaleString()}</span>
                                        <button onClick={() => handleDelete(item._id)} className="text-gray-300 hover:text-red-500"><Trash2 size={18}/></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Income;