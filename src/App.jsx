import React, { useState, useEffect } from 'react';
import { Wallet, PlusCircle, List, Loader2 } from 'lucide-react';
import api from './services/api';

function App() {
    const [transactions, setTransactions] = useState([]);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);

    const loadData = async () => {
        try {
            const response = await api.get('/transactions/');
            // Ordena por ID ou Data decrescente
            const sortedData = response.data.sort((a, b) => b.id - a.id);
            setTransactions(sortedData);
        } catch (err) {
            console.error("Error loading data", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!description || !amount || !date) return;

        setLoading(true);
        try {
            await api.post('/transactions/', {
                description,
                amount: parseFloat(amount),
                date: date
            });

            // LIMPA OS CAMPOS
            setDescription('');
            setAmount('');

            // RECARREGA A LISTA (Isso evita o F5!)
            await loadData();

        } catch (err) {
            alert("Erro ao salvar!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
            <div className="max-w-4xl mx-auto">
                <header className="flex items-center gap-2 mb-12">
                    <Wallet className="text-emerald-500 w-10 h-10" />
                    <h1 className="text-3xl font-bold tracking-tighter">Finance<span className="text-emerald-500">AI</span></h1>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Form Side */}
                    <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-2xl">
                        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            <PlusCircle className="w-5 h-5 text-emerald-500" /> New Expense
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="text" placeholder="What did you buy?"
                                value={description} onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            />
                            <input
                                type="number" placeholder="Value (0.00)"
                                value={amount} onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                            />
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-slate-400"
                            />
                            <button
                                disabled={loading}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all flex justify-center items-center gap-2"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : "Analyze & Save"}
                            </button>
                        </form>
                    </section>

                    {/* List Side */}
                    <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-2xl">
                        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                            <List className="w-5 h-5 text-emerald-500" /> History
                        </h2>
                        <div className="space-y-4 max-h-100 overflow-y-auto pr-2 custom-scrollbar">
                            {transactions.map((t) => (
                                <div key={t.id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex justify-between items-center">
                                    <div>
                                        <p className="font-medium">{t.description}</p>
                                        <div className="flex gap-2 items-center mt-2">
                                            <span className="text-[10px] uppercase bg-slate-800 text-emerald-400 px-2 py-1 rounded font-bold">
                                                {t.category}
                                            </span>
                                            <span className="text-[10px] text-slate-500 font-mono">
                                                {(() => {
                                                    if (!t.data) return "Sem data";

                                                    // Pega apenas os primeiros 10 caracteres (YYYY-MM-DD)
                                                    const datePart = t.data.split('T')[0].split(' ')[0];
                                                    const [year, month, day] = datePart.split('-');

                                                    return `${day}/${month}/${year}`;
                                                })()}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-xl font-mono font-bold text-emerald-500">${t.amount}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default App;