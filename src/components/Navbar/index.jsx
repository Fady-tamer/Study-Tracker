import { useContext } from "react";

// context
import { mainStore } from "../../context/MainContext";
import { useLocation, useNavigate } from "react-router";

// icons
import { IoIosArrowBack } from "react-icons/io";

const Navbar = () => {
  const { logout } = useContext(mainStore);

  const navigateTo = useNavigate();
  const currentPath = useLocation();

  return (
    <header className="m-4 mb-0">
      <div className="max-w-470 mx-auto rounded-2xl rounded-b-none flex items-center justify-between border border-surface-border bg-surface-panel">
        {/* logo */}
        <div className="w-3/12 p-4 border-r border-surface-border">
          <h1
            onClick={() => {
              navigateTo("/home");
            }}
            className="text-center text-2xl font-extrabold tracking-widest text-brand-primary cursor-pointer"
          >
            Study Tracker
          </h1>
        </div>

        <div className="w-9/12 p-4 flex justify-between items-center">
          <button
            onClick={() => {
              navigateTo(-1);
            }}
            className="flex items-center gap-2 font-bold capitalize cursor-pointer"
          >
            <IoIosArrowBack />
            {currentPath.pathname.slice(1)}
          </button>

          {/* logout */}
          <button
            onClick={() => {
              navigateTo("/");
              logout();
            }}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-colors cursor-pointer shadow-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
