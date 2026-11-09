import React from 'react';
import { Key, Shield, Check, X, Lock } from 'lucide-react';

export default function AdminRolesPage() {
  const roles = [
    {
      name: 'Patient (Default User)',
      desc: 'Owner of biological telemetry and personal encryption keys.',
      permissions: {
        'View own vitals & documents': true,
        'Export personal PDF telemetry': true,
        'Generate emergency QR codes': true,
        'Initiate AI assistant queries': true,
        'Access admin platform analytics': false,
        'Manage disease catalog entries': false,
        'View other patients records': false
      }
    },
    {
      name: 'Verified Doctor / Clinician',
      desc: 'Consulting physician with patient-consented temporary access.',
      permissions: {
        'View own vitals & documents': true,
        'Export personal PDF telemetry': true,
        'Generate emergency QR codes': true,
        'Initiate AI assistant queries': true,
        'View patient vitals upon explicit consent': true,
        'Host telemedicine consultations': true,
        'View platform aggregate analytics': false
      }
    },
    {
      name: 'System Administrator',
      desc: 'Platform operator managing infrastructure, content, and security.',
      permissions: {
        'Manage disease catalog & content': true,
        'View anonymous population analytics': true,
        'Review website bugs & reports': true,
        'Suspend abusive accounts': true,
        'View private patient medical telemetry': false, // EXPLICIT STRICT SAFETY RULE
        'Access raw patient encryption keys': false,     // EXPLICIT STRICT SAFETY RULE
        'View private AI consultations': false           // EXPLICIT STRICT SAFETY RULE
      }
    }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Role-Based Access Control (RBAC)
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Cryptographically enforced permission matrices preventing unauthorized telemetry access
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {roles.map((role, idx) => (
          <div key={idx} className="p-6 rounded-3xl bg-[#101827] border border-slate-800 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">{role.name}</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{role.desc}</p>
              
              <div className="pt-2 border-t border-slate-800 space-y-2 text-xs">
                {Object.entries(role.permissions).map(([perm, allowed], pIdx) => (
                  <div key={pIdx} className="flex items-center justify-between text-xs py-1 border-b border-slate-850">
                    <span className={allowed ? 'text-slate-200' : 'text-slate-500 line-through'}>{perm}</span>
                    {allowed ? (
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-red-400 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
