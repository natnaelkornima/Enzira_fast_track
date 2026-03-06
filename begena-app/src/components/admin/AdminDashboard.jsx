import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, FileDown, LogOut, CheckCircle, Search, Calendar, Phone, Send, MessageCircle, X, Loader2, Trash2, ExternalLink, Bold, Italic, Code, ArrowLeft } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { supabase } from '../../lib/supabase';
import ConfirmActionModal from './ConfirmActionModal';
import enziraLogo from '../../assets/enzira-logo.png';

const AdminDashboard = () => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showBroadcast, setShowBroadcast] = useState(false);
    const [broadcastStep, setBroadcastStep] = useState('compose'); // 'compose' | 'select'
    const [broadcastMessage, setBroadcastMessage] = useState('');
    const [broadcastStatus, setBroadcastStatus] = useState('idle'); // idle | sending | sent
    const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, title: '', message: '', type: 'danger', onConfirm: null });
    const [selectedStudents, setSelectedStudents] = useState(new Set());
    const [tempSelectedStudents, setTempSelectedStudents] = useState(new Set());
    const navigate = useNavigate();

    const filteredRegistrations = registrations.filter(r =>
        r.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.phoneNumber.includes(searchQuery)
    );

    useEffect(() => {
        const fetchRegistrations = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                navigate('/admin');
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('registrations')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;

                const formattedData = data.map(r => ({
                    ...r,
                    _id: r.id,
                    fullName: r.full_name,
                    countryCode: r.country_code,
                    phoneNumber: r.phone_number,
                    registrationDate: r.created_at,
                    paymentReceiptPath: r.payment_receipt_path
                }));

                setRegistrations(formattedData);
            } catch (error) {
                console.error('Error fetching registrations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRegistrations();
    }, [navigate]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/admin');
    };

    const handleVerifyPayment = async (id) => {
        try {
            const { error } = await supabase
                .from('registrations')
                .update({ status: 'verified' })
                .eq('id', id);

            if (!error) {
                setRegistrations(prev => prev.map(r => r._id === id ? { ...r, status: 'verified' } : r));
            }
        } catch (error) {
            console.error('Error verifying registration:', error);
        }
    };

    const handleDeclinePayment = (id) => {
        setConfirmConfig({
            isOpen: true,
            title: 'Decline Payment?',
            message: 'Are you sure you want to decline this payment? This action cannot be undone.',
            onConfirm: async () => {
                setConfirmConfig(prev => ({ ...prev, isOpen: false }));
                try {
                    const { error } = await supabase
                        .from('registrations')
                        .update({ status: 'declined' })
                        .eq('id', id);

                    if (!error) {
                        setRegistrations(prev => prev.map(r => r._id === id ? { ...r, status: 'declined' } : r));
                    }
                } catch (error) {
                    console.error('Error declining registration:', error);
                }
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedStudents.size === filteredRegistrations.length && filteredRegistrations.length > 0) {
            setSelectedStudents(new Set());
        } else {
            setSelectedStudents(new Set(filteredRegistrations.map(r => r._id)));
        }
    };

    const handleSelectStudent = (id) => {
        const newSelected = new Set(selectedStudents);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedStudents(newSelected);
    };

    const insertFormatting = (syntax) => {
        const textarea = document.getElementById('broadcast-message');
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = broadcastMessage;

        const before = text.substring(0, start);
        const selected = text.substring(start, end);
        const after = text.substring(end);

        let newText = text;
        let offset = 0;

        if (syntax === 'bold') {
            newText = `${before}*${selected || 'bold text'}*${after}`;
            offset = selected ? 1 : 1;
        } else if (syntax === 'italic') {
            newText = `${before}_${selected || 'italic text'}_${after}`;
            offset = selected ? 1 : 1;
        } else if (syntax === 'mono') {
            newText = `${before}\`${selected || 'monospace text'}\`${after}`;
            offset = selected ? 1 : 1;
        }

        setBroadcastMessage(newText);

        setTimeout(() => {
            textarea.focus();
            const newPos = selected ? end + 2 : start + offset + (syntax === 'bold' ? 9 : syntax === 'italic' ? 11 : 14);
            textarea.setSelectionRange(newPos, newPos);
        }, 10);
    };

    const [recipientSearch, setRecipientSearch] = useState('');

    const handleBroadcast = () => {
        if (!broadcastMessage.trim()) return;
        setBroadcastStatus('sending');

        const targetIds = Array.from(tempSelectedStudents);

        if (targetIds.length === 0) {
            setBroadcastStatus('idle');
            return;
        }

        const telegramUsers = registrations
            .filter(r => targetIds.includes(r._id))
            .map(r => r.telegram)
            .filter(t => t && t.trim() !== '');

        const encodedMessage = encodeURIComponent(broadcastMessage);

        telegramUsers.forEach((username, index) => {
            const cleanUsername = username.replace('@', '');
            setTimeout(() => {
                window.open(`https://t.me/${cleanUsername}?text=${encodedMessage}`, '_blank');
            }, index * 800);
        });

        setTimeout(() => {
            setBroadcastStatus('sent');
            setTimeout(() => {
                setBroadcastStatus('idle');
                setShowBroadcast(false);
                setBroadcastStep('compose');
                setBroadcastMessage('');
                setTempSelectedStudents(new Set());
                setRecipientSearch('');
            }, 2000);
        }, telegramUsers.length * 800);
    };

    const handleSendDM = (telegram) => {
        if (!telegram) return;
        const cleanUsername = telegram.replace('@', '');
        window.open(`https://t.me/${cleanUsername}`, '_blank');
    };

    const handleDeleteUser = (id) => {
        setConfirmConfig({
            isOpen: true,
            title: 'Remove Student?',
            message: 'Are you sure you want to permanently remove this student? This action cannot be undone.',
            onConfirm: async () => {
                setConfirmConfig(prev => ({ ...prev, isOpen: false }));
                try {
                    const { error } = await supabase
                        .from('registrations')
                        .delete()
                        .eq('id', id);

                    if (!error) {
                        setRegistrations(prev => prev.filter(r => r._id !== id));
                    }
                } catch (error) {
                    console.error('Error deleting registration:', error);
                }
            }
        });
    };

    const getTintedLogoBase64 = async (imageUrl, tintColor) => {
        const res = await fetch(imageUrl);
        const blob = await res.blob();
        const img = new Image();
        const url = URL.createObjectURL(blob);

        return new Promise((resolve, reject) => {
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;

                // Draw image
                ctx.drawImage(img, 0, 0);

                // Overlay color
                ctx.globalCompositeOperation = 'source-in';
                ctx.fillStyle = tintColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                resolve(canvas.toDataURL('image/png'));
                URL.revokeObjectURL(url);
            };
            img.onerror = reject;
            img.src = url;
        });
    };

    const downloadPDF = async () => {
        const doc = new jsPDF();

        try {
            const logoBase64 = await getTintedLogoBase64(enziraLogo, '#981c00');
            // Proportional width/height to avoid elongation
            doc.addImage(logoBase64, 'PNG', 14, 10, 20, 20);

            doc.setFontSize(22);
            doc.setTextColor(152, 28, 0);
            doc.text('Enzira Training Registrations', 40, 22);

            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 40, 28);
            doc.text(`Total Registrations: ${filteredRegistrations.length}`, 40, 33);
        } catch (error) {
            console.error("Error embedding logo in PDF:", error);
            // Header Fallback
            doc.setFontSize(22);
            doc.setTextColor(152, 28, 0);
            doc.text('Enzira Training Registrations', 14, 20);

            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);
            doc.text(`Total Registrations: ${filteredRegistrations.length}`, 14, 34);
        }

        // Table
        const tableColumn = ["#", "Date", "Full Name", "Phone", "Telegram", "Status"];
        const tableRows = filteredRegistrations.map((r, index) => [
            index + 1,
            new Date(r.registrationDate).toLocaleDateString(),
            r.fullName,
            `${r.countryCode} ${r.phoneNumber}`,
            r.telegram,
            r.status.toUpperCase()
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 42,
            theme: 'grid',
            headStyles: { fillColor: [152, 28, 0] },
            alternateRowStyles: { fillColor: [245, 245, 245] },
            styles: { fontSize: 9 }
        });

        doc.save(`begena-registrations-${new Date().toISOString().split('T')[0]}.pdf`);
    };

    if (loading) {
        return <div className="min-h-screen bg-dark-950 flex items-center justify-center text-white font-body">Loading secure data...</div>;
    }

    return (
        <div className="min-h-screen bg-dark-950 font-body relative text-white selection:bg-brand-red/30">
            {/* Background */}
            <div className="fixed top-0 left-0 w-full h-[500px] bg-linear-to-b from-brand-red/10 to-transparent opacity-30 pointer-events-none" />

            {/* Navbar */}
            <nav className="glass sticky top-0 z-50 border-b border-white/5 py-4 px-6 md:px-12 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 shrink-0 overflow-hidden p-1">
                        <img src={enziraLogo} alt="Enzira Logo" className="w-full h-full object-contain drop-shadow-lg" />
                    </div>
                    <div>
                        <h1 className="font-heading font-black text-xl leading-none">Admin Panel</h1>
                        <span className="text-white/40 text-xs tracking-widest uppercase">Owner Dashboard</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => {
                            setTempSelectedStudents(new Set(filteredRegistrations.map(r => r._id)));
                            setShowBroadcast(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 transition-all text-sm font-bold text-blue-400"
                    >
                        <MessageCircle className="w-4 h-4" />
                        <span className="hidden sm:inline">Broadcast</span>
                    </button>
                    <button onClick={downloadPDF} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-sm font-bold">
                        <FileDown className="w-4 h-4 text-brand-red" />
                        <span className="hidden sm:inline">Export PDF</span>
                    </button>
                    <button onClick={handleLogout} className="w-10 h-10 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-500 border border-white/5 transition-all flex items-center justify-center">
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </nav>

            <ConfirmActionModal
                isOpen={confirmConfig.isOpen}
                onClose={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmConfig.onConfirm}
                title={confirmConfig.title}
                message={confirmConfig.message}
            />

            {/* Telegram Broadcast Modal */}
            <AnimatePresence>
                {showBroadcast && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-100 flex items-center justify-center p-4"
                        onClick={() => setShowBroadcast(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-lg rounded-2xl p-8 border border-white/10 bg-dark-950/95 backdrop-blur-xl shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                        <MessageCircle className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">Telegram Broadcast</h3>
                                        <p className="text-white/40 text-xs">Step {broadcastStep === 'compose' ? '1' : '2'} of 2</p>
                                    </div>
                                </div>
                                <button onClick={() => {
                                    setShowBroadcast(false);
                                    setBroadcastStep('compose');
                                }} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {broadcastStep === 'compose' && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    <div className="flex items-center gap-2 mb-2 bg-dark-900 border border-white/5 rounded-t-xl p-2 border-b-0">
                                        <button
                                            onClick={() => insertFormatting('bold')}
                                            className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                                            title="Bold"
                                        >
                                            <Bold className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => insertFormatting('italic')}
                                            className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                                            title="Italic"
                                        >
                                            <Italic className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => insertFormatting('mono')}
                                            className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                                            title="Monospace"
                                        >
                                            <Code className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <textarea
                                        id="broadcast-message"
                                        value={broadcastMessage}
                                        onChange={(e) => setBroadcastMessage(e.target.value)}
                                        placeholder="Write your message... Use *bold* or _italic_ for formatting."
                                        rows={8}
                                        className="w-full p-4 rounded-b-xl bg-dark-900 border border-white/5 text-white placeholder-white/20 focus:outline-hidden focus:border-blue-500 transition-all resize-none text-sm mb-6"
                                    />

                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => setBroadcastStep('select')}
                                            disabled={!broadcastMessage.trim()}
                                            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm transition-all disabled:opacity-30"
                                        >
                                            Next: Select Recipients
                                            <ExternalLink className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {broadcastStep === 'select' && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    <div className="mb-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <p className="text-white/30 text-[10px] uppercase tracking-widest font-bold mb-1">Select Recipients</p>
                                                <h4 className="text-white text-sm font-bold">{tempSelectedStudents.size} students chosen</h4>
                                            </div>
                                            <button
                                                onClick={() => setBroadcastStep('compose')}
                                                className="flex items-center gap-1.5 text-[10px] text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-widest font-bold"
                                            >
                                                <ArrowLeft className="w-3 h-3" />
                                                Edit Message
                                            </button>
                                        </div>

                                        {/* Search and Filter */}
                                        <div className="flex gap-2 mb-4">
                                            <div className="relative flex-1">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
                                                <input
                                                    type="text"
                                                    placeholder="Search students..."
                                                    value={recipientSearch}
                                                    onChange={(e) => setRecipientSearch(e.target.value)}
                                                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-dark-900/50 border border-white/5 text-xs text-white placeholder-white/20 focus:outline-hidden focus:border-blue-500/50 transition-all"
                                                />
                                            </div>
                                            <button
                                                onClick={() => {
                                                    const studentsWithTelegram = filteredRegistrations.filter(r => r.telegram);
                                                    if (tempSelectedStudents.size === studentsWithTelegram.length) {
                                                        setTempSelectedStudents(new Set());
                                                    } else {
                                                        setTempSelectedStudents(new Set(studentsWithTelegram.map(r => r._id)));
                                                    }
                                                }}
                                                className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] text-white/60 hover:text-white hover:bg-white/10 transition-all font-bold uppercase tracking-wider"
                                            >
                                                {tempSelectedStudents.size === filteredRegistrations.filter(r => r.telegram).length ? 'Unselect All' : 'Select All'}
                                            </button>
                                        </div>

                                        <div className="max-h-[320px] overflow-y-auto custom-scrollbar pr-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {filteredRegistrations
                                                .filter(r => r.telegram && (r.fullName || '').toLowerCase().includes((recipientSearch || '').toLowerCase()))
                                                .map((r, idx) => (
                                                    <motion.label
                                                        key={r._id}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: idx * 0.03 }}
                                                        className={`relative flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all border group ${tempSelectedStudents.has(r._id)
                                                            ? 'bg-blue-500/10 border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                                                            : 'bg-dark-900/30 border-white/5 hover:border-white/20 hover:bg-dark-900/50'
                                                            }`}
                                                    >
                                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-all ${tempSelectedStudents.has(r._id) ? 'bg-blue-500 text-white' : 'bg-white/5 text-white/40'
                                                            }`}>
                                                            {(r.fullName || '?').charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className={`text-xs font-bold truncate ${tempSelectedStudents.has(r._id) ? 'text-white' : 'text-white/60'}`}>{r.fullName || 'Unknown'}</p>
                                                            <p className="text-[10px] text-white/20 truncate">{r.telegram}</p>
                                                        </div>
                                                        <input
                                                            type="checkbox"
                                                            checked={tempSelectedStudents.has(r._id)}
                                                            onChange={() => {
                                                                const next = new Set(tempSelectedStudents);
                                                                if (next.has(r._id)) next.delete(r._id);
                                                                else next.add(r._id);
                                                                setTempSelectedStudents(next);
                                                            }}
                                                            className="hidden"
                                                        />
                                                        {tempSelectedStudents.has(r._id) && (
                                                            <motion.div
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-dark-950"
                                                            >
                                                                <CheckCircle className="w-3 h-3 text-white" />
                                                            </motion.div>
                                                        )}
                                                    </motion.label>
                                                ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-8 p-4 bg-white/2 rounded-2xl border border-white/5">
                                        <div>
                                            <p className="text-[10px] text-white/20 uppercase font-bold tracking-widest">Final Payload</p>
                                            <p className="text-white font-bold text-sm tracking-tight">{tempSelectedStudents.size} Recipients</p>
                                        </div>
                                        <button
                                            onClick={handleBroadcast}
                                            disabled={tempSelectedStudents.size === 0 || broadcastStatus === 'sending'}
                                            className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm transition-all shadow-xl shadow-blue-500/20 disabled:opacity-30 active:scale-95 group"
                                        >
                                            {broadcastStatus === 'sending' ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : broadcastStatus === 'sent' ? (
                                                <CheckCircle className="w-4 h-4" />
                                            ) : (
                                                <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                            )}
                                            {broadcastStatus === 'sending' ? 'Blasting...' : broadcastStatus === 'sent' ? 'Sent!' : 'Blast Telegram'}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 md:px-12 py-10 relative z-10">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-10">
                    <div className="glass rounded-lg p-6 border-white/5">
                        <h3 className="text-white/40 text-[11px] font-bold uppercase tracking-widest mb-1">Total Students</h3>
                        <p className="text-4xl font-black">{registrations.length}</p>
                    </div>
                    <div className="glass rounded-lg p-6 border-white/5">
                        <h3 className="text-white/40 text-[11px] font-bold uppercase tracking-widest mb-1">Verified</h3>
                        <p className="text-4xl font-black text-green-400">{registrations.filter(r => r.status === 'verified').length}</p>
                    </div>
                    <div className="glass rounded-lg p-6 border-white/5">
                        <h3 className="text-white/40 text-[11px] font-bold uppercase tracking-widest mb-1">Pending</h3>
                        <p className="text-4xl font-black text-yellow-400">{registrations.filter(r => r.status === 'pending').length}</p>
                    </div>
                    <div className="glass rounded-lg p-6 border-white/5">
                        <h3 className="text-white/40 text-[11px] font-bold uppercase tracking-widest mb-1">Declined</h3>
                        <p className="text-4xl font-black text-brand-red">{registrations.filter(r => r.status === 'declined').length}</p>
                    </div>
                </div>

                {/* Table Section */}
                <div className="glass rounded-lg border-white/5 overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h2 className="text-lg font-bold">Recent Registrations</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                            <input
                                type="text"
                                placeholder="Search students..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 rounded-lg bg-dark-900 border border-white/5 focus:outline-hidden focus:border-brand-red text-sm w-full sm:w-64"
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
                                                href={r.paymentReceiptPath}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-xs text-brand-red hover:underline"
                                            >
                                                View Image
                                            </a>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${r.status === 'verified' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                                r.status === 'declined' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                                    'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                                }`}>
                                                {r.status === 'verified' ? <CheckCircle className="w-3 h-3" /> :
                                                    r.status === 'declined' ? <X className="w-3 h-3" /> :
                                                        <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
                                                {r.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {r.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleVerifyPayment(r._id)}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 text-[11px] font-bold transition-colors"
                                                            title="Approve Payment"
                                                        >
                                                            <CheckCircle className="w-3.5 h-3.5" />
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeclinePayment(r._id)}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[11px] font-bold transition-colors"
                                                            title="Decline Payment"
                                                        >
                                                            <X className="w-3.5 h-3.5" />
                                                            Decline
                                                        </button>
                                                    </>
                                                )}
                                                {r.telegram && (
                                                    <button
                                                        onClick={() => handleSendDM(r.telegram)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-[11px] font-bold transition-colors"
                                                        title="Send Telegram DM"
                                                    >
                                                        <ExternalLink className="w-3.5 h-3.5" />
                                                        DM
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDeleteUser(r._id)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 text-[11px] font-bold transition-colors"
                                                    title="Remove Student"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                    Remove
                                                </button>
                                            </div>
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
        </div >
    );
};

export default AdminDashboard;
