import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  User,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
  Filter,
  Search,
  ChevronRight,
  MoreVertical,
  CalendarDays,
  List,
  Phone
} from 'lucide-react';
import { useDoctorAuth } from '../../context/DoctorAuthContext';
import { DoctorService } from '../../services/doctorService';

export default function DoctorAppointmentsPage() {
  const { doctor } = useDoctorAuth();
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'calendar'
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  useEffect(() => {
    const list = DoctorService.getDoctorAppointments(doctor?.uid || 'doc_mock_1') || [];
    setAppointments(list);
  }, [doctor]);

  const handleUpdateStatus = (id, newStatus) => {
    const updated = (appointments || []).map((apt) =>
      apt.id === id ? { ...apt, status: newStatus } : apt
    );
    setAppointments(updated);
  };

  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    if (!newDate || !newTime || !selectedAppointment) return;

    const updated = (appointments || []).map((apt) =>
      apt.id === selectedAppointment.id
        ? { ...apt, date: newDate, time: newTime, status: 'rescheduled' }
        : apt
    );
    setAppointments(updated);
    setShowRescheduleModal(false);
    setSelectedAppointment(null);
  };

  const filteredAppointments = (appointments || []).filter((apt) => {
    if (activeTab === 'today') return apt.date === 'Today';
    if (activeTab === 'video') return apt.type === 'video';
    if (activeTab === 'in-person') return apt.type === 'in-person';
    if (activeTab === 'completed') return apt.status === 'completed';
    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300">
              Practice Scheduling
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            Consultation Appointments
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Manage your daily clinic patient visits, follow-up slots, and remote telemedicine calls.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="p-1 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center gap-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <List className="w-3.5 h-3.5" /> List
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                viewMode === 'calendar'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" /> Calendar
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Appointments' },
          { id: 'today', label: "Today's Schedule" },
          { id: 'video', label: 'Video Consultations' },
          { id: 'in-person', label: 'In-Person Visits' },
          { id: 'completed', label: 'Past Completed' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* View Mode: List */}
      {viewMode === 'list' ? (
        <div className="space-y-4">
          {filteredAppointments.map((apt) => (
            <div
              key={apt.id}
              className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:border-blue-500/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
            >
              <div className="flex items-start md:items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold text-base flex items-center justify-center shrink-0">
                  {apt.patientName ? apt.patientName.charAt(0) : 'P'}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      {apt.patientName}
                    </h3>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        apt.type === 'video'
                          ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                          : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                      }`}
                    >
                      {apt.type === 'video' ? 'Video Telemedicine' : 'Clinic In-Person'}
                    </span>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase">
                      {apt.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    <strong>Chief Concern:</strong> {apt.reason || 'Routine follow-up'}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1 font-medium">
                      <CalendarIcon className="w-3.5 h-3.5 text-blue-500" />
                      {apt.date}
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-teal-500" />
                      {apt.time}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                {apt.type === 'video' ? (
                  <Link
                    to={`/doctor/video-consultation?patientId=${apt.patientId}&name=${encodeURIComponent(apt.patientName)}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs shadow-sm transition-colors"
                  >
                    <Video className="w-4 h-4" />
                    Enter Video Room
                  </Link>
                ) : (
                  <Link
                    to={`/doctor/reports/new?patientId=${apt.patientId}&name=${encodeURIComponent(apt.patientName)}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-sm transition-colors"
                  >
                    Start Visit
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setSelectedAppointment(apt);
                    setShowRescheduleModal(true);
                  }}
                  className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
                >
                  Reschedule
                </button>

                {apt.status !== 'completed' && (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(apt.id, 'completed')}
                    className="p-2 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 transition-colors"
                    title="Mark Completed"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}

                {apt.status !== 'cancelled' && (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(apt.id, 'cancelled')}
                    className="p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-500 transition-colors"
                    title="Cancel Appointment"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {filteredAppointments.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
              <CalendarIcon className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">No appointments found</p>
              <p className="text-xs text-slate-500 mt-1">Check another filter or book a new slot.</p>
            </div>
          )}
        </div>
      ) : (
        /* View Mode: Calendar Matrix (Clean visual schedule) */
        <div className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Weekly Practice Calendar</h3>
            <span className="text-xs text-slate-500">Showing slots for current week</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day, idx) => (
              <div key={day} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 min-h-[160px] flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">{day}</span>
                  {idx === 0 && (
                    <div className="p-2 rounded-lg bg-blue-100/60 dark:bg-blue-900/30 text-[11px] mb-2">
                      <span className="font-bold text-blue-900 dark:text-blue-200 block">Rahul S. (10:00 AM)</span>
                      <span className="text-blue-700 dark:text-blue-300">Video Consult</span>
                    </div>
                  )}
                  {idx === 1 && (
                    <div className="p-2 rounded-lg bg-emerald-100/60 dark:bg-emerald-900/30 text-[11px] mb-2">
                      <span className="font-bold text-emerald-900 dark:text-emerald-200 block">Ananya R. (11:30 AM)</span>
                      <span className="text-emerald-700 dark:text-emerald-300">In-Person Visit</span>
                    </div>
                  )}
                  {idx === 2 && (
                    <div className="p-2 rounded-lg bg-purple-100/60 dark:bg-purple-900/30 text-[11px]">
                      <span className="font-bold text-purple-900 dark:text-purple-200 block">Vikram M. (02:00 PM)</span>
                      <span className="text-purple-700 dark:text-purple-300">Video Consult</span>
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 text-center block pt-2 border-t border-slate-200/50 dark:border-slate-800">
                  {idx < 3 ? 'Booked' : 'Available Slots'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && selectedAppointment && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Reschedule Appointment
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Patient: <strong>{selectedAppointment.patientName}</strong> (Current: {selectedAppointment.date} at {selectedAppointment.time})
            </p>

            <form onSubmit={handleRescheduleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  New Date
                </label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  New Time Slot
                </label>
                <select
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                >
                  <option value="">Select Time Slot</option>
                  <option value="09:30 AM">09:30 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="04:30 PM">04:30 PM</option>
                  <option value="05:00 PM">05:00 PM</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowRescheduleModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-colors"
                >
                  Confirm Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
