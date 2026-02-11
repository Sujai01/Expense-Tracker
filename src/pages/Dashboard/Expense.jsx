import React, { useState, useEffect, useCallback } from "react";
import api from "../../utils/api";
import { toast } from "react-hot-toast";
import { Trash2, Download, PlusCircle, Receipt, ArrowDownCircle } from "lucide-react";

const Expense = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        category: "",
        amount: "",
        date: new Date().toISOString().split('T')[0],
        description: ""
    });

    const categories = ["Food", "Rent", "Transport", "Shopping", "Entertainment", "Health", "Utilities", "Other"];

    const fetchExpenses = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get("/expense/all");
            if (res.data?.success) {
                setExpenses(res.data.data);
            }
        } catch (err) {
            toast.error("Could not load expenses");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchExpenses(); }, [fetchExpenses]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.category) return toast.error("Please select a category");
        try {
            await api.post("/expense/add", formData);
            toast.success("Expense recorded");
            setFormData({ category: "", amount: "", date: new Date().toISOString().split('T')[0], description: "" });
            fetchExpenses();
        } catch (err) {
            toast.error("Error saving expense");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this entry?")) return;
        try {
            await api.delete(`/expense/${id}`);
            toast.success("Entry deleted");
            setExpenses(prev => prev.filter(item => item._id !== id));
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    const handleDownload = async () => {
        try {
            toast.loading("Preparing Excel report...", { id: "exp-download" });
            const response = await api.get("/expense/download", { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Expense_Report.xlsx'); 
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            toast.success("Expense report downloaded!", { id: "exp-download" });
        } catch (err) {
            toast.error("Failed to download report", { id: "exp-download" });
        }
    };

    const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="p-6 bg-[#060606] min-h-screen text-white">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                        <ArrowDownCircle className="text-red-500" /> Expense Tracker
                    </h1>
                    <p className="text-zinc-400">Total Spent: <span className="text-red-500 font-bold">${totalExpense.toLocaleString()}</span></p>
                </div>
                <button onClick={handleDownload} className="flex items-center gap-2 bg-[#121212] border border-zinc-800 px-5 py-2.5 rounded-xl hover:bg-zinc-800 transition shadow-sm text-white font-medium">
                    <Download size={18} /> Export Excel
                </button>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4">
                    <div className="bg-[#121212] p-6 rounded-2xl shadow-sm border border-zinc-800 sticky top-6">
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white"><PlusCircle className="text-red-500" /> Add Expense</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">Category</label>
                                <select className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white outline-none focus:ring-1 focus:ring-red-500" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                                    <option value="">Select Category</option>
                                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">Amount ($)</label>
                                <input type="number" placeholder="0.00" className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white outline-none focus:ring-1 focus:ring-red-500" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-zinc-400 mb-1">Date</label>
                                <input type="date" className="w-full p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white outline-none" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required />
                            </div>
                            <button className="w-full bg-red-600 text-white py-3.5 rounded-xl font-bold hover:bg-red-700 transition">Record Expense</button>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-8">
                    <div className="bg-[#121212] rounded-2xl border border-zinc-800 overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-zinc-800 font-semibold flex items-center gap-2 text-white"><Receipt size={20}/> Recent History</div>
                        <div className="divide-y divide-zinc-800">
                            {loading ? <div className="p-10 text-center text-zinc-500 animate-pulse">Loading...</div> : expenses.map((item) => (
                                <div key={item._id} className="p-5 flex items-center justify-between hover:bg-zinc-800/50 transition">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center font-bold">{item.category[0]}</div>
                                        <div>
                                            <p className="font-bold text-white">{item.category}</p>
                                            <p className="text-xs text-zinc-500">{new Date(item.date).toLocaleDateString()} • {item.description || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className="text-red-500 font-bold text-lg">-${item.amount.toLocaleString()}</span>
                                        <button onClick={() => handleDelete(item._id)} className="text-zinc-600 hover:text-red-500"><Trash2 size={18}/></button>
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

export default Expense;