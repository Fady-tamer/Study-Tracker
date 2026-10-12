import UserIcon from "../../../components/UserIcon";
import { MdVerified, MdEmail } from "react-icons/md";
import { IoCalendarOutline } from "react-icons/io5";

const UserCard = ({ userName = "User", email = "" }) => {
  return (
    <div className="relative overflow-hidden flex flex-col gap-5 rounded-2xl border border-surface-border bg-gradient-to-br from-white via-white to-indigo-50/30 p-6 sm:p-8 shadow-xs">
      {/* Decorative ambient top glow */}
      <div className="pointer-events-none absolute -top-12 -right-12 h-36 w-36 rounded-full bg-brand-primary/10 blur-2xl" />

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <UserIcon
          userName={userName}
          width="w-20 sm:w-24"
          height="h-20 sm:h-24"
          textS="text-3xl sm:text-4xl"
        />

        <div className="flex min-w-0 flex-1 flex-col items-center sm:items-start text-center sm:text-left">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold capitalize text-Typography-primary font-['Outfit']">
              {userName}
            </h2>
            <MdVerified className="text-brand-primary text-lg" title="Verified Account" />
          </div>

          <div className="mt-1.5 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-Typography-secondary">
            <span className="flex items-center gap-1">
              <MdEmail className="text-slate-400 text-sm" />
              {email || "No email available"}
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1">
              <IoCalendarOutline className="text-slate-400 text-sm" />
              Member
            </span>
          </div>

          <div className="mt-3 flex gap-2">
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-500/20">
              Active Student
            </span>
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-bold text-brand-primary ring-1 ring-brand-primary/20">
              Cloud Sync Enabled
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
