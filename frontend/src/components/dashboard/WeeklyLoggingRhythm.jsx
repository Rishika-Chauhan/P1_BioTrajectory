import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const getDate = (value) => {
  if (!value) return null;
  if (typeof value.toDate === 'function') return value.toDate();
  if (typeof value.seconds === 'number') return new Date(value.seconds * 1000);
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const dateKey = (date) => [
  date.getFullYear(),
  String(date.getMonth() + 1).padStart(2, '0'),
  String(date.getDate()).padStart(2, '0')
].join('-');

const TYPE_KEYS = {
  blood_pressure: 'bloodPressure',
  heart_rate: 'heartRate',
  oxygen_saturation: 'oxygen',
  activity: 'activity',
  urine_test: 'urine',
  blood_test: 'blood',
  document: 'document'
};

export default function WeeklyLoggingRhythm({ readings = [] }) {
  const { t, isHindi } = useLanguage();
  const [selectedDate, setSelectedDate] = useState(() => dateKey(new Date()));

  const { days, readingsByDate, loggedDays } = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const windowDays = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(now);
      date.setDate(now.getDate() - (6 - index));
      return { date, key: dateKey(date) };
    });
    const allowedKeys = new Set(windowDays.map(({ key }) => key));
    const grouped = {};

    readings.forEach((reading) => {
      const measuredAt = getDate(reading?.measuredAt);
      if (!measuredAt) return;
      const key = dateKey(measuredAt);
      if (!allowedKeys.has(key)) return;
      grouped[key] = [...(grouped[key] || []), reading];
    });

    return {
      days: windowDays.map(({ date, key }) => ({
        date,
        key,
        count: grouped[key]?.length || 0,
        isToday: key === dateKey(now)
      })),
      readingsByDate: grouped,
      loggedDays: windowDays.filter(({ key }) => grouped[key]?.length).length
    };
  }, [readings]);

  const selectedDay = days.find((day) => day.key === selectedDate) || days[6];
  const selectedReadings = readingsByDate[selectedDay.key] || [];
  const selectedTypes = [...new Set(
    selectedReadings.map((reading) => TYPE_KEYS[reading.type]).filter(Boolean)
  )];
  const locale = isHindi ? 'hi-IN' : 'en-IN';
  const maxCount = Math.max(1, ...days.map((day) => day.count));

  return (
    <section className="p-6 sm:p-7 rounded-3xl glass-card space-y-5" aria-labelledby="weekly-rhythm-title">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
            <CalendarDays className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2 id="weekly-rhythm-title" className="text-lg font-bold text-slate-900 dark:text-white">
              {t('dashboard.weeklyRhythm.title')}
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {t('dashboard.weeklyRhythm.subtitle')}
            </p>
          </div>
        </div>
        <span className="w-fit px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 text-xs font-bold">
          {t('dashboard.weeklyRhythm.loggedDays', { count: loggedDays })}
        </span>
      </div>

      <div className="grid grid-cols-7 gap-2" role="group" aria-label={t('dashboard.weeklyRhythm.selectDay')}>
        {days.map((day) => {
          const weekday = new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(day.date);
          const dayNumber = new Intl.DateTimeFormat(locale, { day: 'numeric' }).format(day.date);
          const isSelected = day.key === selectedDay.key;
          const ariaDate = new Intl.DateTimeFormat(locale, { dateStyle: 'full' }).format(day.date);

          return (
            <button
              key={day.key}
              type="button"
              onClick={() => setSelectedDate(day.key)}
              aria-pressed={isSelected}
              aria-label={t('dashboard.weeklyRhythm.dayButton', {
                date: ariaDate,
                count: day.count
              })}
              className={`min-w-0 p-2 sm:p-3 rounded-2xl border transition-colors cursor-pointer ${isSelected
                ? 'bg-cyan-500/10 border-cyan-500/40 ring-1 ring-cyan-500/20'
                : 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:border-cyan-500/35'
              }`}
            >
              <span className="block text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
                {weekday}
              </span>
              <span className="block mt-1 text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                {dayNumber}
              </span>
              <span className="mt-2 h-7 flex items-end justify-center" aria-hidden="true">
                <span
                  className={`w-3 rounded-t-md transition-all ${day.count ? 'bg-cyan-500 dark:bg-cyan-400' : 'bg-slate-200 dark:bg-slate-700'}`}
                  style={{ height: day.count ? `${Math.max(8, (day.count / maxCount) * 26)}px` : '4px' }}
                />
              </span>
              {day.isToday && (
                <span className="block mt-1 text-[9px] sm:text-[10px] font-bold text-cyan-700 dark:text-cyan-300">
                  {t('dashboard.weeklyRhythm.today')}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div aria-live="polite">
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {selectedReadings.length
              ? t('dashboard.weeklyRhythm.entryCount', { count: selectedReadings.length })
              : t('dashboard.weeklyRhythm.noEntries')}
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {selectedTypes.length
              ? selectedTypes.map((type) => t(`dashboard.weeklyRhythm.types.${type}`)).join(' · ')
              : t('dashboard.weeklyRhythm.emptyDayHint')}
          </p>
        </div>
        <Link
          to="/dashboard/history"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-cyan-700 dark:text-cyan-300 hover:underline shrink-0"
        >
          {t('dashboard.weeklyRhythm.viewRecords')}
          <ChevronRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
