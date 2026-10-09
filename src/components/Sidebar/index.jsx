import { NavLink } from "react-router";

// icons
import {
  IoBookOutline,
  IoHomeOutline,
  IoSettingsOutline,
} from "react-icons/io5";

const Sidebar = () => {
  return (
    <div className="hidden md:flex shrink-0 w-3/12 lg:w-2/12 p-4 lg:flex flex-col rounded-2xl rounded-t-none rounded-r-none border border-surface-border bg-surface-panel">
      <div>
        <p className="text-Typography-muted font-semibold">MAIN</p>
        <div className="p-4 flex flex-col gap-4">
          <NavLink
            to={"/home"}
            className={`px-4 py-2 flex justify-center lg:justify-start items-center gap-2 text-base lg:text-xl text-Typography-primary rounded-2xl duration-300 hover:ease-in-out hover:scale-95`}
          >
            <IoHomeOutline className="hidden lg:block" />
            <p>Home</p>
          </NavLink>
          <NavLink
            to={"/myCourses"}
            className={`px-4 py-2 flex justify-center lg:justify-start items-center gap-2 text-base lg:text-xl text-Typography-primary rounded-2xl duration-300 hover:ease-in-out hover:scale-95`}
          >
            <IoBookOutline className="hidden lg:block" />
            <p>My Courses</p>
          </NavLink>
        </div>
      </div>
      <div>
        <p className="text-Typography-muted font-semibold">OTHER</p>
        <div className="p-4 flex flex-col gap-4">
          <NavLink
            to={"/setting"}
            className={`px-4 py-2 flex justify-center lg:justify-start items-center gap-2 text-base lg:text-xl text-Typography-primary rounded-2xl duration-300 hover:ease-in-out hover:scale-95`}
          >
            <IoSettingsOutline className="hidden lg:block" />
            <p>Settings</p>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
