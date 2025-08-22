interface HeaderProps{
    connected: boolean,
    disconnect: () => void
}
const Header = ({connected, disconnect}: HeaderProps) => {
    const username = localStorage.getItem("username");
    
    return (
        <div className="flex items-center justify-between p-5 bg-blue-400 ">
            <div
                className={
                    connected
                        ? "bg-green-500 p-2 rounded-3xl text-white"
                        : "bg-red-500 p-2 rounded-3xl text-white"
                }
            >
                {username}
            </div>
            <button
                className="bg-red-500 py-2 px-3 rounded-3xl text-white transition hover:bg-red-600 cursor-pointer"
                onClick={disconnect}
            >
                Logout
            </button>
        </div>
    );
};

export default Header;
