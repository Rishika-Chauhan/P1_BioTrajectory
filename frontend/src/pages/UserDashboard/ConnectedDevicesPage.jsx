import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bluetooth, RefreshCw, Signal, AlertCircle, CheckCircle2 } from 'lucide-react';
import { BluetoothService } from '../../services/bluetoothService';
import DisclaimerBanner from '../../components/common/DisclaimerBanner';

export default function ConnectedDevicesPage() {
  const [devices, setDevices] = useState(BluetoothService.getDevices());
  const [toastMessage, setToastMessage] = useState(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const handleDeviceUpdate = (event) => {
      if (event.detail) setDevices(event.detail);
    };

    window.addEventListener('biotrajectory_devices_updated', handleDeviceUpdate);
    return () => window.removeEventListener('biotrajectory_devices_updated', handleDeviceUpdate);
  }, []);

  const showToast = (message) => {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenScanner = async () => {
    setScanning(true);

    try {
      const device = await BluetoothService.scanNativeBluetooth();
      setDevices(BluetoothService.getDevices());
      showToast(`Paired with ${device.name}. Device connected, but measurement synchronization is not supported for this device.`);
    } catch (error) {
      showToast(error.message || 'Bluetooth pairing is unavailable in this browser or was canceled.');
    } finally {
      setScanning(false);
    }
  };

  const handleSyncAll = async () => {
    try {
      const result = await BluetoothService.syncAllConnectedDevices();
      setDevices(BluetoothService.getDevices());
      showToast(result.message || 'No supported Bluetooth readings are available yet.');
    } catch (error) {
      showToast(error.message || 'Unable to sync Bluetooth devices at this time.');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <DisclaimerBanner />

      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white text-sm font-semibold shadow-2xl flex items-center gap-3"
          >
            <Signal className="w-5 h-5 text-cyan-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Connected devices
          </h1>
          <p className="text-[16px] text-slate-600 dark:text-slate-400 mt-1">
            Pairing a device only confirms connectivity. Measurements are synced only when the device protocol is verified and decoded.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleOpenScanner}
            disabled={scanning}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-cyan-500 text-slate-950 font-bold disabled:opacity-60"
          >
            <Bluetooth className="w-4 h-4" />
            {scanning ? 'Scanning…' : 'Scan for device'}
          </button>
          <button
            onClick={handleSyncAll}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0A1226] text-slate-700 dark:text-slate-200 font-semibold"
          >
            <RefreshCw className="w-4 h-4" />
            Sync now
          </button>
        </div>
      </div>

      {!devices.length ? (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101827] p-8 text-slate-600 dark:text-slate-300">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
            <div>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">No paired Bluetooth devices yet.</p>
              <p className="mt-2">Use the device scan button to attempt a real connection. A successful connection alone does not mean a health reading is available.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {devices.map((device) => (
            <div key={device.id} className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101827] p-5 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{device.name || 'Bluetooth device'}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{device.brand || 'Unknown device'} • {device.categoryLabel || 'Health device'}</p>
                </div>

                <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${device.status === 'connected' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                  {device.status === 'connected' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Signal className="w-3.5 h-3.5" />}
                  {device.status === 'connected' ? 'Connected' : 'Paired'}
                </span>
              </div>

              <div className="mt-4 rounded-2xl bg-slate-50 dark:bg-[#070B14] p-4 text-sm text-slate-600 dark:text-slate-300">
                Device connected, but measurement synchronization is not supported for this device.
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
