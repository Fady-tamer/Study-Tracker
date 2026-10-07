import { NavLink } from "react-router";

// icons
import {
  IoBookOutline,
  IoHomeOutline,
  IoHomeSharp,
  IoSettingsOutline,
} from "react-icons/io5";

const Sidebar = () => {
  return (
    <div className="w-2/12 p-4 rounded-2xl rounded-t-none rounded-r-none border border-surface-border bg-surface-panel">
      <div>
        <p className="text-Typography-muted font-semibold">MAIN</p>
        <div className="p-4 flex flex-col gap-4">
          <NavLink
            to={"/home"}
            className={`px-4 py-2 flex gap-2 items-center text-xl text-Typography-primary rounded-2xl`}
          >
            <IoHomeOutline />
            <p>Home</p>
          </NavLink>
          <NavLink
            to={"/courses"}
            className={`px-4 py-2 flex gap-2 items-center text-xl text-Typography-primary rounded-2xl`}
          >
            <IoBookOutline />
            <p>My Courses</p>
          </NavLink>
        </div>
      </div>
      <div>
        <p className="text-Typography-muted font-semibold">OTHER</p>
        <div className="p-4 flex flex-col gap-4">
          <NavLink
            to={"/setting"}
            className={`px-4 py-2 flex gap-2 items-center text-xl text-Typography-primary rounded-2xl`}
          >
            <IoSettingsOutline />
            <p>Settings</p>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
