const EmptyConversation = () => {
    return (
        <div className="flex h-full min-h-full flex-col items-center justify-center bg-slate-900/60 px-6 text-center text-slate-200">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.16em] text-cyan-200">
                No chat selected
            </div>
            <h2 className="mt-4 text-3xl font-semibold">
                Start a conversation
            </h2>
            <p className="mt-2 max-w-xl text-slate-300">
                Choose a teammate on the left to open a channel. Messages arrive
                instantly and stay synced across devices.
            </p>
        </div>
    );
};

export default EmptyConversation;
