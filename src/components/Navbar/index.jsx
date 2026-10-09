import { useContext, useState } from "react";

// context
import { mainStore } from "../../context/MainContext";
import { NavLink, useLocation, useNavigate } from "react-router";

// icons
import { IoIosArrowBack } from "react-icons/io";
import { TbDoorExit } from "react-icons/tb";
import {
  IoBookOutline,
  IoHomeOutline,
  IoPersonCircleOutline,
  IoSettingsOutline,
} from "react-icons/io5";

const Navbar = () => {
  const { logout } = useContext(mainStore);

  const navigateTo = useNavigate();
  const currentPath = useLocation();

  const [mobileToolBar, setMobileToolBar] = useState(false);

  return (
    <header className={`m-4 mb-0`}>
      <div
        className={`${mobileToolBar ? "h-80" : "h-15"} md:h-fit duration-300 max-w-470 mx-auto flex flex-col rounded-2xl rounded-b-none border border-surface-border bg-surface-panel overflow-hidden`}
      >
        <div className="flex justify-between items-center">
          {/* logo */}
          <div className="md:w-3/12 lg:w-2/12 p-4 md:border-r border-surface-border">
            <h1
              onClick={() => {
                navigateTo("/home");
              }}
              className="text-sm md:text-base lg:text-2xl text-center font-extrabold tracking-widest text-brand-primary cursor-pointer"
            >
              Study Tracker
            </h1>
          </div>

          {/* tablet & laptop view */}
          <div className="grow hidden md:flex p-4 justify-between items-center">
            <button
              onClick={() => {
                navigateTo(-1);
              }}
              className="hidden md:flex items-center gap-2 font-bold capitalize cursor-pointer"
            >
              <IoIosArrowBack />
              {currentPath.pathname.slice(1)}
            </button>

            <div className="flex items-center gap-4">
              <IoPersonCircleOutline
                onClick={() => {
                  navigateTo("/setting");
                }}
                className="text-4xl lg:text-5xl cursor-pointer"
              />
              {/* logout */}
              <button
                onClick={() => {
                  navigateTo("/");
                  logout();
                }}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold text-sm md:text-base lg:text-xl px-4 py-2 flex items-center gap-2 rounded-full transition-colors cursor-pointer shadow-sm"
              >
                <TbDoorExit className="text-xl" />
                <p>Logout</p>
              </button>
            </div>
          </div>

          {/* mobile view */}
          <div className="md:hidden p-4">
            <IoPersonCircleOutline
              onClick={() => {
                setMobileToolBar(!mobileToolBar);
              }}
              className="text-2xl"
            />
          </div>
        </div>

        {/* mobile toolbar */}
        <div className="md:hidden grow p-4">
          <div>
            <p className="text-Typography-muted">MAIN</p>
            <div className="p-4 flex flex-col gap-2">
              <NavLink
                onClick={() => {
                  setMobileToolBar(!mobileToolBar);
                }}
                to={"/home"}
                className={`px-4 py-2 flex gap-2 items-center text-Typography-primary rounded-2xl`}
              >
                <IoHomeOutline />
                <p>Home</p>
              </NavLink>
              <NavLink
                onClick={() => {
                  setMobileToolBar(!mobileToolBar);
                }}
                to={"/myCourses"}
                className={`px-4 py-2 flex gap-2 items-center text-Typography-primary rounded-2xl`}
              >
                <IoBookOutline />
                <p>My Courses</p>
              </NavLink>
            </div>
          </div>
          <div>
            <p className="text-Typography-muted">OTHER</p>
            <div className="p-4 flex flex-col gap-2">
              <NavLink
                onClick={() => {
                  setMobileToolBar(!mobileToolBar);
                }}
                to={"/setting"}
                className={`px-4 py-2 flex gap-2 items-center text-Typography-primary rounded-2xl`}
              >
                <IoSettingsOutline />
                <p>Settings</p>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
