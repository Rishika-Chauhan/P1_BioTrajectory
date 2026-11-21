
import React from "react";
import {
  Bell,
  Lock,
  ShieldCheck,
  RefreshCw,
  Stethoscope,
  AlertTriangle,
  Video,
  FileText,
  CalendarClock,
} from "lucide-react";

const settings = [
  {
    label: "Clinical alerts",
    description: "Notifications for clinical events and important updates.",
    icon: Bell,
  },
  {
    label: "Patient consent prompts",
    description: "Require patient authorization before accessing clinical records.",
    icon: Lock,
  },
  {
    label: "Telemedicine availability",
    description: "Control whether patients can request video consultations.",
    icon: Video,
  },
  {
    label: "Auto-generated care notes",
    description: "Generate clinical notes from consultation information.",
    icon: FileText,
  },
  {
    label: "Follow-up reminders",
    description: "Reminders for scheduled patient follow-ups.",
    icon: CalendarClock,
  },
  {
    label: "Secure note locking",
    description: "Protect clinical notes through access-control policies.",
    icon: ShieldCheck,
  },
];

export default function DoctorSettingsPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] px-2.5 py-1 rounded-full bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300">
            Practice Settings
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
          Clinical Workspace Preferences
        </h1>

        <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm">
          Review the security and workflow capabilities of your clinical workspace.
        </p>
      </div>

      {/* Integration status */}
      <div className="rounded-2xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/20 p-5 flex gap-3">
        <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />

        <div>
          <h2 className="font-bold text-amber-900 dark:text-amber-300">
            Persistent preferences are not connected
          </h2>

          <p className="text-sm text-amber-800 dark:text-amber-400 mt-1">
            These settings are currently informational. Changes cannot be saved
            or enforced because a persistent settings service and corresponding
            backend controls have not been implemented.
          </p>
        </div>
      </div>

      {/* Settings list */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-300 flex items-center justify-center">
            <Stethoscope className="w-5 h-5" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Secure practice controls
            </h2>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Planned clinical workflow capabilities
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {settings.map(({ label, description, icon: Icon }) => (
            <div
              key={label}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-4 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-900/80 flex items-center justify-center text-slate-500 dark:text-slate-300 shrink-0">
                  <Icon className="w-5 h-5" />
                </div>

                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">
                    {label}
                  </p>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {description}
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                Not connected
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Security information */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-5">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400" />

          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Security review
            </h3>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              No verified audit timestamp is currently available.
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
          <ShieldCheck size={16} className="shrink-0 mt-0.5" />

          <p>
            Clinical access permissions must be enforced by Firestore Security
            Rules and trusted backend authorization. A frontend preference
            switch alone cannot grant or restrict access to patient records.
          </p>
        </div>
      </div>
    </div>
  );
}
