import { NavLink } from "react-router";

// icons
import {
  IoBookOutline,
  IoCalendarOutline,
  IoHomeOutline,
  IoSettingsOutline,
  IoSparklesOutline,
} from "react-icons/io5";
import { MdOutlineAssignmentLate } from "react-icons/md";

const Sidebar = () => {
  const navLinkClass = ({ isActive }) =>
    `px-3.5 py-2.5 flex items-center gap-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
      isActive
        ? "bg-brand-primary text-white shadow-sm shadow-brand-primary/25 translate-x-1"
        : "text-Typography-secondary hover:bg-slate-100/80 hover:text-Typography-primary"
    }`;

  return (
    <aside className="hidden w-60 shrink-0 flex-col justify-between rounded-2xl border border-surface-border bg-surface-panel p-4 select-none md:flex lg:w-64 shadow-sm">
      <div className="flex flex-col gap-6">
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-Typography-muted">
            Main Menu
          </p>
          <nav className="mt-2.5 flex flex-col gap-1.5">
            <NavLink to="/home" className={navLinkClass}>
              <IoHomeOutline className="text-lg shrink-0" />
              <span>Dashboard</span>
            </NavLink>

            <NavLink to="/myCourses" className={navLinkClass}>
              <IoBookOutline className="text-lg shrink-0" />
              <span>My Courses</span>
            </NavLink>

            <NavLink to="/assignments" className={navLinkClass}>
              <MdOutlineAssignmentLate className="text-lg shrink-0" />
              <span>Assignments</span>
            </NavLink>

            <NavLink to="/calendar" className={navLinkClass}>
              <IoCalendarOutline className="text-lg shrink-0" />
              <span>Calendar</span>
            </NavLink>
          </nav>
        </div>

        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-Typography-muted">
            Preferences
          </p>
          <nav className="mt-2.5 flex flex-col gap-1.5">
            <NavLink to="/setting" className={navLinkClass}>
              <IoSettingsOutline className="text-lg shrink-0" />
              <span>Settings</span>
            </NavLink>
          </nav>
        </div>
      </div>

      {/* Motivational Mini Card */}
      <div className="mt-8 rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 via-white to-indigo-50/40 p-3.5 text-center shadow-xs">
        <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-brand-primary text-white shadow-xs">
          <IoSparklesOutline className="text-base" />
        </div>
        <h4 className="text-xs font-bold text-Typography-primary">Study Streak</h4>
        <p className="mt-1 text-[11px] text-Typography-secondary leading-relaxed">
          Consistency is key! Log at least 25 minutes daily to boost retention.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
