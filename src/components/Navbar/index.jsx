import { useContext, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";

// context
import { mainStore } from "../../context/MainContext";

// icons
import { IoIosArrowBack } from "react-icons/io";
import { TbDoorExit, TbFlame } from "react-icons/tb";
import {
  IoBookOutline,
  IoCalendarOutline,
  IoHomeOutline,
  IoSettingsOutline,
  IoClose,
  IoMenu,
} from "react-icons/io5";
import { MdOutlineAssignment, MdSchool } from "react-icons/md";

// components
import UserIcon from "../UserIcon";

const Navbar = () => {
  const { logout, user: contextUser, courses } = useContext(mainStore);
  const navigateTo = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getUserDisplayName = () => {
    if (contextUser?.user_metadata?.display_name) {
      return contextUser.user_metadata.display_name;
    }
    try {
      const authKey = Object.keys(localStorage).find(
        (key) => key.startsWith("sb-") && key.endsWith("-auth-token"),
      );
      if (authKey) {
        const parsed = JSON.parse(localStorage.getItem(authKey));
        return parsed?.user?.user_metadata?.display_name || "Student";
      }
    } catch {
      return "Student";
    }
    return "Student";
  };

  const displayName = getUserDisplayName();

  const handleLogout = async () => {
    if (logout) await logout();
    navigateTo("/");
  };

  // Human-readable breadcrumb label
  const getBreadcrumbLabel = () => {
    const path = location.pathname;
    if (path === "/home") return "Overview";
    if (path === "/myCourses") return "My Courses";
    if (path.startsWith("/myCourses/")) {
      const courseParam = decodeURIComponent(path.replace("/myCourses/", ""));
      const matched = (courses || []).find(
        (c) =>
          c.id === courseParam ||
          c.topic_name?.toLowerCase() === courseParam.toLowerCase()
      );
      const courseTitle = matched?.topic_name || courseParam;
      return `Courses / ${courseTitle}`;
    }
    if (path === "/assignments") return "Assignments";
    if (path === "/calendar") return "Academic Calendar";
    if (path === "/setting") return "Settings & Profile";
    return "Study Tracker";
  };

  const navLinkClasses = ({ isActive }) =>
    `px-4 py-3 flex items-center gap-3 rounded-xl text-sm font-semibold transition-all ${
      isActive
        ? "bg-brand-primary text-white shadow-sm shadow-brand-primary/25"
        : "text-Typography-secondary hover:text-Typography-primary hover:bg-slate-100/80"
    }`;

  return (
    <header className="sticky top-0 z-40 w-full px-3 pt-3 sm:px-6 sm:pt-4 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-2xl border border-surface-border bg-surface-panel/90 shadow-sm backdrop-blur-md transition-all">
        <div className="flex h-16 sm:h-20 items-center justify-between px-4 sm:px-6">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div
              onClick={() => navigateTo("/home")}
              className="flex h-10 w-10 sm:h-11 sm:w-11 cursor-pointer items-center justify-center rounded-xl bg-gradient-to-tr from-brand-primary via-brand-light to-indigo-400 text-white shadow-md shadow-brand-primary/25 transition-transform hover:scale-105 active:scale-95"
            >
              <MdSchool className="text-2xl" />
            </div>

            <div
              onClick={() => navigateTo("/home")}
              className="cursor-pointer select-none"
            >
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-tight text-Typography-primary text-lg sm:text-xl font-['Outfit']">
                  Study<span className="text-brand-primary">Tracker</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 ring-1 ring-emerald-500/20">
                  <TbFlame className="text-xs" /> ACTIVE
                </span>
              </div>
              <p className="hidden md:block text-[11px] font-medium text-Typography-muted">
                Academic Management Suite
              </p>
            </div>
          </div>

          {/* Breadcrumb / Location Indicator (Desktop) */}
          <div className="hidden lg:flex items-center gap-2 rounded-xl bg-slate-50 px-3.5 py-1.5 border border-surface-border text-xs font-semibold text-Typography-secondary">
            <button
              type="button"
              onClick={() => navigateTo(-1)}
              className="flex items-center gap-1 text-Typography-muted hover:text-brand-primary transition-colors cursor-pointer"
            >
              <IoIosArrowBack className="text-sm" />
              <span>Back</span>
            </button>
            <span className="text-slate-300">/</span>
            <span className="text-Typography-primary font-bold">{getBreadcrumbLabel()}</span>
          </div>

          {/* Right Action Menu (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <div
              onClick={() => navigateTo("/setting")}
              className="flex items-center gap-3 cursor-pointer rounded-xl p-1.5 pr-3 hover:bg-slate-50 transition-colors"
            >
              <UserIcon
                userName={displayName}
                width="w-9 lg:w-10"
                hight="h-9 lg:h-10"
                textS="text-sm lg:text-base"
                CPointer={true}
              />
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-Typography-primary max-w-[120px] truncate capitalize">
                  {displayName}
                </span>
                <span className="text-[10px] font-medium text-Typography-muted">
                  Personal Dashboard
                </span>
              </div>
            </div>

            <div className="h-6 w-px bg-surface-border" />

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl border border-rose-200/80 bg-rose-50/50 px-3.5 py-2 text-xs font-semibold text-rose-600 transition-all hover:bg-rose-100/70 hover:border-rose-300 active:scale-95 cursor-pointer"
              title="Sign Out"
            >
              <TbDoorExit className="text-base" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={handleLogout}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600 active:scale-95"
              aria-label="Logout"
            >
              <TbDoorExit className="text-base" />
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-surface-border bg-slate-50 text-Typography-primary hover:bg-slate-100 active:scale-95 transition-colors cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <IoClose className="text-xl" /> : <IoMenu className="text-xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="border-t border-surface-border p-4 md:hidden flex flex-col gap-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-slate-50 border border-surface-border">
              <UserIcon
                userName={displayName}
                width="w-8"
                hight="h-8"
                textS="text-xs"
              />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-Typography-primary capitalize">
                  {displayName}
                </span>
                <span className="text-[10px] text-Typography-muted">
                  Logged In
                </span>
              </div>
            </div>

            <nav className="flex flex-col gap-1 mt-1">
              <NavLink
                to="/home"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClasses}
              >
                <IoHomeOutline className="text-lg" />
                <span>Dashboard Home</span>
              </NavLink>

              <NavLink
                to="/myCourses"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClasses}
              >
                <IoBookOutline className="text-lg" />
                <span>My Courses</span>
              </NavLink>

              <NavLink
                to="/assignments"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClasses}
              >
                <MdOutlineAssignment className="text-lg" />
                <span>Assignments & Tasks</span>
              </NavLink>

              <NavLink
                to="/calendar"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClasses}
              >
                <IoCalendarOutline className="text-lg" />
                <span>Academic Calendar</span>
              </NavLink>

              <NavLink
                to="/setting"
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClasses}
              >
                <IoSettingsOutline className="text-lg" />
                <span>Account Settings</span>
              </NavLink>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
