const EmptyConversation = () => {
    return (
        <div className="flex h-full min-h-full flex-col items-center justify-center bg-slate-900/60 px-6 text-center text-slate-200">
            <div className="mb-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 p-6">
                <svg
                    className="h-12 w-12 text-cyan-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                </svg>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.16em] text-cyan-200">
                No chat selected
            </div>
            <h2 className="mt-4 text-3xl font-semibold">
                Start a conversation
            </h2>
            <p className="mt-2 max-w-xl text-slate-300">
                Search for users in the sidebar or select an existing
                conversation to start chatting.
            </p>
            <div className="mt-6 flex items-center gap-4 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                    <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                    <span>Search by name or username</span>
                </div>
                <span className="text-slate-600">•</span>
                <div className="flex items-center gap-2">
                    <span>Real-time messaging</span>
                </div>
            </div>
        </div>
    );
};

export default EmptyConversation;
