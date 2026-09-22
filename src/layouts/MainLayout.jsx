const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans selection:bg-blue-500 selection:text-white">
      <header className="border-b border-gray-800 bg-gray-950 p-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-wide text-blue-400">
            Study Tracker
          </h1>
        </div>
      </header>
    </div>
  );
};

export default MainLayout;
