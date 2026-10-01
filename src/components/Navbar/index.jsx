import { useContext } from "react";

// context
import { mainStore } from "../../context/MainContext";
import { useNavigate } from "react-router";

const Navbar = () => {
  const { logout } = useContext(mainStore);

  const navigateTo = useNavigate();

  return (
    <header className="mt-4">
      <div className="container mx-auto p-4 rounded-2xl flex items-center justify-between border border-surface-border shadow-2xl bg-surface-panel">
        {/* logo */}
        <div>
          <h1 className="text-2xl font-bold tracking-widest text-Typography-primary">
            Study Tracker
          </h1>
        </div>

        {/* logout */}
        <button
          onClick={() => {
            navigateTo("/");
            logout();
          }}
          className="px-4 py-2 rounded-xl text-Typography-primary font-bold bg-phase-focus cursor-pointer"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
