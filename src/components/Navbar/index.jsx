const Navbar = () => {
  return (
    <header className="m-4">
      <div className="container mx-auto p-4 rounded-2xl flex items-center justify-between border border-surface-border shadow-2xl bg-surface-panel">
        {/* logo */}
        <div>
          <h1 className="text-2xl font-bold tracking-widest text-Typography-primary">
            Study Tracker
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
