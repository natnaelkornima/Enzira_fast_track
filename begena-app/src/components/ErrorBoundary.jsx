import { Component } from 'react';

export class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-[#0d0907] text-white flex flex-col items-center justify-center p-6 text-center select-none font-sans">
                    <div className="max-w-md w-full bg-white/[0.03] border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
                        <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[#981c00]/20 border border-[#981c00]/40 flex items-center justify-center text-[#c22b0a] text-2xl font-bold">
                            !
                        </div>
                        <h2 className="text-xl font-bold mb-2 text-white">Something went wrong</h2>
                        <p className="text-sm text-white/60 mb-6">
                            The application encountered an unexpected issue while loading.
                        </p>
                        {this.state.error?.message && (
                            <div className="mb-6 p-3 bg-black/40 rounded-lg text-left text-xs text-red-400 font-mono overflow-auto max-h-28 border border-red-500/20">
                                {this.state.error.message}
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="w-full py-3 px-6 rounded-xl bg-[#981c00] hover:bg-[#c22b0a] text-white font-bold text-sm transition-all duration-200 cursor-pointer shadow-lg shadow-[#981c00]/30"
                        >
                            Reload Application
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
