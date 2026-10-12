import { useContext, useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import UserCard from "./components/UserCard";
import { mainStore } from "../../context/MainContext";

// icons
import { IoSettingsOutline, IoShieldCheckmarkOutline } from "react-icons/io5";
import { BiBookBookmark, BiTask, BiTimeFive } from "react-icons/bi";
import { TbDoorExit } from "react-icons/tb";
import { useNavigate } from "react-router";

const SettingPage = () => {
  const { courses, assignments, logout } = useContext(mainStore);
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    userName: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) throw error;

        if (user) {
          setUserData({
            userName: user.user_metadata?.display_name || "Student",
            email: user.email || "",
          });
        }
      } catch (err) {
        console.error("Failed to load user settings:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const totalCourses = courses?.length || 0;
  const totalAssignments = assignments?.length || 0;
  const completedAssignments =
    assignments?.filter((a) => a.isDone)?.length || 0;

  const totalStudyMinutes = (courses || []).reduce(
    (acc, curr) => acc + (Number(curr?.total_time) || 0),
    0,
  );
  const hours = Math.floor(totalStudyMinutes / 60);
  const mins = totalStudyMinutes % 60;

  const handleLogout = async () => {
    if (logout) await logout();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-2xl border border-surface-border bg-surface-panel p-6 text-sm text-Typography-secondary shadow-xs">
        <div className="flex animate-pulse items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-brand-primary" />
          <span>Loading user profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-6">
      {/* User Identity Card */}
      <UserCard userName={userData.userName} email={userData.email} />

      {/* Account Performance Overview */}
      <div className="rounded-2xl border border-surface-border bg-surface-panel p-5 sm:p-6 shadow-xs">
        <h3 className="text-base font-bold text-Typography-primary font-['Outfit'] mb-4">
          Academic Activity Snapshot
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-3.5 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand-primary">
              <BiBookBookmark className="text-xl" />
            </div>
            <div>
              <p className="text-xs text-Typography-muted font-medium">Courses Enrolled</p>
              <p className="text-lg font-extrabold text-Typography-primary">{totalCourses}</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <BiTask className="text-xl" />
            </div>
            <div>
              <p className="text-xs text-Typography-muted font-medium">Completed Tasks</p>
              <p className="text-lg font-extrabold text-Typography-primary">
                {completedAssignments} / {totalAssignments}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 rounded-xl border border-slate-100 bg-slate-50/70 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <BiTimeFive className="text-xl" />
            </div>
            <div>
              <p className="text-xs text-Typography-muted font-medium">Total Study Logged</p>
              <p className="text-lg font-extrabold text-Typography-primary">
                {hours}h {mins}m
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* System Settings & Session */}
      <div className="rounded-2xl border border-surface-border bg-surface-panel p-5 sm:p-6 shadow-xs">
        <h3 className="text-base font-bold text-Typography-primary font-['Outfit'] mb-4 flex items-center gap-2">
          <IoSettingsOutline className="text-brand-primary" />
          <span>App Preferences & Security</span>
        </h3>

        <div className="divide-y divide-slate-100 text-sm">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-semibold text-Typography-primary">Pomodoro Defaults</p>
              <p className="text-xs text-Typography-muted">25m Focus • 5m Short Break • 15m Long Break</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-Typography-secondary">
              Standard
            </span>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-semibold text-Typography-primary">Database Sync</p>
              <p className="text-xs text-Typography-muted">Continuous encrypted cloud sync with Supabase</p>
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
              <IoShieldCheckmarkOutline className="text-base" /> Online
            </span>
          </div>

          <div className="flex items-center justify-between py-3 pt-4">
            <div>
              <p className="font-semibold text-Typography-primary">Sign Out</p>
              <p className="text-xs text-Typography-muted">End your current session on this device</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
            >
              <TbDoorExit className="text-base" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
