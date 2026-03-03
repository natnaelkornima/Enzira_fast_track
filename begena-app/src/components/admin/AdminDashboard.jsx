import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, FileDown, LogOut, CheckCircle, Search, Calendar, Phone, Send } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const AdminDashboard = () => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRegistrations = async () => {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                navigate('/admin');
                return;
            }

            try {
                const res = await fetch('http://127.0.0.1:5000/api/admin/registrations', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (res.ok) {
                    const data = await res.json();
                    setRegistrations(data);
                } else if (res.status === 401) {
                    localStorage.removeItem('adminToken');
                    navigate('/admin');
                }
            } catch (error) {
                console.error('Error fetching registrations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRegistrations();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin');
    };

    const handleVerifyMode = async (id) => {
        const token = localStorage.getItem('adminToken');
        try {
            const res = await fetch(`http://127.0.0.1:5000/api/admin/registrations/${id}/verify`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setRegistrations(prev => prev.map(r => r._id === id ? { ...r, status: 'verified' } : r));
            }
        } catch (error) {
            console.error('Error verifying registration:', error);
        }
    };

    const downloadPDF = () => {
        const doc = new jsPDF();

        // Add Logo or Header
        doc.setFontSize(22);
        doc.setTextColor(152, 28, 0); // brand-red
        doc.text('Begena Training Registrations', 14, 20);

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);

        // Table configuration
        const tableColumn = ["#", "Date", "Full Name", "Phone", "Telegram", "Status"];
        const tableRows = [];

        filteredRegistrations.forEach((r, index) => {
            const regDate = new Date(r.registrationDate).toLocaleDateString();
            const rowData = [
                index + 1,
                regDate,
                r.fullName,
                `${r.countryCode} ${r.phoneNumber}`,
                r.telegram,
                r.status.toUpperCase()
            ];
            tableRows.push(rowData);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 40,
            theme: 'grid',
            headStyles: { fillColor: [152, 28, 0] },
            alternateRowStyles: { fillColor: [245, 245, 245] },
            styles: { fontSize: 9 }
        });

        doc.save(`begena-registrations-${new Date().toISOString().split('T')[0]}.pdf`);
    };

    const filteredRegistrations = registrations.filter(r =>
        r.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.phoneNumber.includes(searchQuery)
    );

    if (loading) {
        return <div className="min-h-screen bg-dark-950 flex items-center justify-center text-white font-body">Loading secure data...</div>;
    }

    return (
        <div className="min-h-screen bg-dark-950 font-body relative text-white selection:bg-brand-red/30">
            {/* Background */}
            <div className="fixed top-0 left-0 w-full h-[500px] bg-linear-to-b from-brand-red/10 to-transparent opacity-30 pointer-events-none" />

            {/* Navbar */}
            <nav className="glass sticky top-0 z-50 border-b border-white/5 py-4 px-6 md:px-12 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-red flex items-center justify-center">
                        <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="font-heading font-black text-xl leading-none">Admin Panel</h1>
                        <span className="text-white/40 text-xs tracking-widest uppercase">Owner Dashboard</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={downloadPDF} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-sm font-bold">
                        <FileDown className="w-4 h-4 text-brand-red" />
                        <span className="hidden sm:inline">Export PDF</span>
                    </button>
                    <button onClick={handleLogout} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-red-500/20 hover:text-red-500 border border-white/5 transition-all flex items-center justify-center">
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 md:px-12 py-10 relative z-10">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="glass rounded-3xl p-6 border-white/5">
                        <h3 className="text-white/40 text-sm font-bold uppercase tracking-widest mb-1">Total Students</h3>
                        <p className="text-4xl font-black">{registrations.length}</p>
                    </div>
                    <div className="glass rounded-3xl p-6 border-white/5">
                        <h3 className="text-white/40 text-sm font-bold uppercase tracking-widest mb-1">Verified</h3>
                        <p className="text-4xl font-black text-green-400">{registrations.filter(r => r.status === 'verified').length}</p>
                    </div>
                    <div className="glass rounded-3xl p-6 border-white/5">
                        <h3 className="text-white/40 text-sm font-bold uppercase tracking-widest mb-1">Pending</h3>
                        <p className="text-4xl font-black text-brand-red">{registrations.filter(r => r.status === 'pending').length}</p>
                    </div>
                </div>

                {/* Table Section */}
                <div className="glass rounded-3xl border-white/5 overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h2 className="text-lg font-bold">Recent Registrations</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                            <input
                                type="text"
                                placeholder="Search students..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 rounded-xl bg-dark-900 border border-white/5 focus:outline-hidden focus:border-brand-red text-sm w-full sm:w-64"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-white/5 text-white/40 uppercase tracking-widest text-[10px]">
                                <tr>
                                    <th className="px-6 py-4 font-bold">Student Name</th>
                                    <th className="px-6 py-4 font-bold">Contact Info</th>
                                    <th className="px-6 py-4 font-bold">Registration Date</th>
                                    <th className="px-6 py-4 font-bold">Receipt</th>
                                    <th className="px-6 py-4 font-bold">Status</th>
                                    <th className="px-6 py-4 font-bold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredRegistrations.map((r, i) => (
                                    <motion.tr
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        key={r._id}
                                        className="hover:bg-white/2 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-brand-red/20 text-brand-red flex items-center justify-center font-bold text-xs">
                                                    {r.fullName.charAt(0)}
                                                </div>
                                                <span className="font-bold">{r.fullName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-white/60">
                                                    <Phone className="w-3 h-3" />
                                                    <span>{r.countryCode} {r.phoneNumber}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-brand-red/80">
                                                    <Send className="w-3 h-3" />
                                                    <span>{r.telegram}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-white/40 text-xs">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(r.registrationDate).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <a
                                                href={`http://127.0.0.1:5000${r.paymentReceiptPath}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-xs text-brand-red hover:underline"
                                            >
                                                View Image
                                            </a>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${r.status === 'verified' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-brand-red/10 text-brand-red border border-brand-red/20'}`}>
                                                {r.status === 'verified' ? <CheckCircle className="w-3 h-3" /> : <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
                                                {r.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {r.status === 'pending' && (
                                                <button
                                                    onClick={() => handleVerifyMode(r._id)}
                                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 text-xs font-bold transition-colors"
                                                >
                                                    <CheckCircle className="w-3.5 h-3.5" />
                                                    Verify Payment
                                                </button>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))}
                                {filteredRegistrations.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-white/40">
                                            No registrations found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
