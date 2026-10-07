import { useContext } from "react";

// context
import { mainStore } from "../../context/MainContext";
import { useNavigate } from "react-router";

const Navbar = () => {
  const { logout } = useContext(mainStore);

  const navigateTo = useNavigate();

  return (
    <header className="m-4 mb-0">
      <div className="max-w-470 mx-auto rounded-2xl rounded-b-none flex items-center justify-between border border-surface-border bg-surface-panel">
        {/* logo */}
        <div className="w-2/12 p-4 border-r border-surface-border">
          <h1 className="text-center text-2xl font-extrabold tracking-widest text-brand-primary">
            Study Tracker
          </h1>
        </div>

        {/* logout */}
        <button
          onClick={() => {
            navigateTo("/");
            logout();
          }}
          className="m-4 px-4 py-2 rounded-xl text-white font-bold bg-red-500 cursor-pointer"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
