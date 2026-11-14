import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bluetooth,
  Heart,
  Watch,
  Droplet,
  Activity,
  Radio,
  Battery,
  Wifi,
  RefreshCw,
  Plus,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Zap,
  Sliders,
  Footprints,
  Clock,
  ExternalLink,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BluetoothService } from '../../services/bluetoothService';
import AnimatedCounter from '../../components/common/AnimatedCounter';
import DisclaimerBanner from '../../components/common/DisclaimerBanner';

export default function ConnectedDevicesPage() {
  const [devices, setDevices] = useState(BluetoothService.getDevices());
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'bp', 'watch', 'urine', 'cgm'
  const [isScanningModalOpen, setIsScanningModalOpen] = useState(false);
  const [diagnosticsModalDevice, setDiagnosticsModalDevice] = useState(null);
  const [syncingDeviceId, setSyncingDeviceId] = useState(null);
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [simulatedNearby, setSimulatedNearby] = useState([]);
  const [isSearchingNearby, setIsSearchingNearby] = useState(false);

  // Listen to live device and vitals updates
  useEffect(() => {
    const handleDeviceUpdate = (e) => {
      if (e.detail) setDevices(e.detail);
    };

    window.addEventListener('biotrajectory_devices_updated', handleDeviceUpdate);
    return () => window.removeEventListener('biotrajectory_devices_updated', handleDeviceUpdate);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Trigger individual device reading retrieval
  const handleRetrieveReading = async (deviceId, deviceName) => {
    setSyncingDeviceId(deviceId);
    try {
      await BluetoothService.retrieveDeviceReadings(deviceId);
      setDevices(BluetoothService.getDevices());

      confetti({
        particleCount: 30,
        spread: 45,
        origin: { y: 0.7 }
      });

      showToast(`Fresh reading retrieved from ${deviceName}!`);
    } catch {
      showToast(`Failed to communicate with ${deviceName}. Please verify Bluetooth connection.`);
    } finally {
      setSyncingDeviceId(null);
    }
  };

  // Sync all connected devices at once
  const handleSyncAll = async () => {
    setIsSyncingAll(true);
    try {
      const result = await BluetoothService.syncAllConnectedDevices();
      setDevices(BluetoothService.getDevices());

      if (result.success) {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 }
        });
        showToast(`Successfully synced telemetry from ${result.syncedCount} connected devices!`);
      } else {
        showToast(result.message);
      }
    } catch {
      showToast('Error syncing devices. Please try again.');
    } finally {
      setIsSyncingAll(false);
    }
  };

  // Toggle connection status
  const handleToggleConnection = (deviceId) => {
    const updated = BluetoothService.toggleDeviceConnection(deviceId);
    setDevices(updated);
  };

  // Open scanning modal and start radar
  const handleOpenScanner = () => {
    setIsScanningModalOpen(true);
    setIsSearchingNearby(true);
    setSimulatedNearby([]);

    setTimeout(() => {
      setSimulatedNearby([
        {
          id: `discovered-omron-${Date.now()}`,
          name: 'Omron Platinum Wireless BP Cuff',
          brand: 'Omron Healthcare',
          type: 'bp',
          categoryLabel: 'Blood Pressure Monitor',
          iconName: 'Heart',
          rssi: -54,
          bleUuid: '0x1810 (BLE BPM)',
          ready: true
        },
        {
          id: `discovered-fitbit-${Date.now()}`,
          name: 'Fitbit Sense 2 Activity Watch',
          brand: 'Fitbit / Google',
          type: 'watch',
          categoryLabel: 'Smartwatch & Steps Sensor',
          iconName: 'Watch',
          rssi: -62,
          bleUuid: '0x180D (Heart Rate & Steps)',
          ready: true
        },
        {
          id: `discovered-optical-${Date.now()}`,
          name: 'BioTrajectory High-Fi Optical Urine Dipstick Reader',
          brand: 'BioTrajectory Labs',
          type: 'urine',
          categoryLabel: 'Optical Spectral Scanner',
          iconName: 'Droplet',
          rssi: -45,
          bleUuid: '0xFFE0 (Optical Colorimeter)',
          ready: true
        }
      ]);
      setIsSearchingNearby(false);
    }, 1200);
  };

  // Pair a discovered device
  const handlePairDiscoveredDevice = (dev) => {
    const newEntry = {
      id: dev.id,
      name: dev.name,
      shortName: dev.name.split(' ')[0] + ' ' + dev.name.split(' ')[1],
      brand: dev.brand,
      type: dev.type,
      categoryLabel: dev.categoryLabel,
      iconName: dev.iconName,
      battery: 100,
      signalRssi: dev.rssi,
      status: 'connected',
      bleUuid: dev.bleUuid,
      serviceName: dev.categoryLabel,
      characteristicUuid: 'GATT Telemetry Stream',
      lastSync: 'Just now',
      readings: dev.type === 'bp'
        ? { systolic: 119, diastolic: 77, pulse: 70, map: 91, statusTag: 'Normal BP', clinicalNote: 'Initial calibration synced.' }
        : dev.type === 'watch'
        ? { steps: 8120, distanceKm: 6.0, activeCaloriesKcal: 390, heartRateBpm: 66, statusTag: 'Active Pedometer', clinicalNote: 'Step counter actively streaming.' }
        : { proteinMgDl: 5.2, specificGravity: 1.018, ph: 6.5, glucose: 'Negative', leukocytes: 'Negative', statusTag: 'Optical Scan Normal', clinicalNote: 'Optical reflectance calibrated.' }
    };

    const currentDevices = BluetoothService.getDevices();
    const updated = [newEntry, ...currentDevices];
    BluetoothService.saveDevices(updated);
    setDevices(updated);
    setIsScanningModalOpen(false);

    confetti({
      particleCount: 45,
      spread: 50,
      origin: { y: 0.6 }
    });

    showToast(`Paired successfully with ${dev.name}!`);
  };

  // Native Web Bluetooth scanner trigger
  const handlePairNativeWebBluetooth = async () => {
    try {
      showToast('Opening browser Web Bluetooth device selector...');
      const device = await BluetoothService.scanNativeBluetooth();
      setDevices(BluetoothService.getDevices());
      setIsScanningModalOpen(false);
      showToast(`Paired with ${device.name}!`);
    } catch (err) {
      showToast(err.message || 'Web Bluetooth pairing was canceled or not supported.');
    }
  };

  // Filter devices
  const filteredDevices = devices.filter(d => {
    if (activeFilter === 'all') return true;
    return d.type === activeFilter;
  });

  const connectedCount = devices.filter(d => d.status === 'connected').length;

  // Icon resolver
  const renderDeviceIcon = (iconName) => {
    switch (iconName) {
      case 'Heart':
        return <Heart className="w-5 h-5 text-rose-500" />;
      case 'Watch':
        return <Watch className="w-5 h-5 text-emerald-500" />;
      case 'Droplet':
      case 'Droplets':
        return <Droplet className="w-5 h-5 text-cyan-500" />;
      case 'Radio':
        return <Radio className="w-5 h-5 text-purple-500" />;
      default:
        return <Activity className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 p-4 rounded-2xl glass-card border border-cyan-500/40 bg-slate-900/90 text-white text-sm font-semibold shadow-2xl flex items-center gap-3 backdrop-blur-xl"
          >
            <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Header & Primary Bluetooth Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <Bluetooth className="w-6 h-6 animate-pulse" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Connected Health Devices
            </h1>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/25">
              BLE 5.3 Ready
            </span>
          </div>
          <p className="text-[16px] text-slate-600 dark:text-slate-400">
            Sync readings automatically from your smart blood pressure monitor, smartwatch step trackers, and high-fi urine analyzers.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleSyncAll}
            disabled={isSyncingAll}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-[15px] font-bold glass-card text-slate-800 dark:text-slate-200 hover:border-cyan-500/50 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all cursor-pointer active:scale-95 shadow-xs"
          >
            <RefreshCw className={`w-4 h-4 text-cyan-500 ${isSyncingAll ? 'animate-spin' : ''}`} />
            <span>{isSyncingAll ? 'Syncing All Devices...' : 'Sync All Readings'}</span>
          </button>

          <button
            onClick={handleOpenScanner}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-[15px] font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 hover:from-cyan-300 hover:to-blue-400 transition-all shadow-md shadow-cyan-500/20 active:scale-95 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>Pair New Device</span>
          </button>
        </div>
      </div>

      {/* 2. Telemetry Overview Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Connected Count */}
        <div className="p-6 rounded-3xl glass-card space-y-2 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Paired Hardware</span>
            <Bluetooth className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
            <AnimatedCounter value={connectedCount} /> <span className="text-lg text-slate-400 font-normal">/ {devices.length}</span>
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Active BLE Connection Stream</span>
          </p>
        </div>

        {/* Latest BP Synced */}
        <div className="p-6 rounded-3xl glass-card space-y-2 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Blood Pressure Cuff</span>
            <Heart className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
            118 / 76 <span className="text-sm text-slate-400 font-sans">mmHg</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pulse: <strong className="text-slate-700 dark:text-slate-300">68 BPM</strong> • Normal Resting Range
          </p>
        </div>

        {/* Latest Watch Steps */}
        <div className="p-6 rounded-3xl glass-card space-y-2 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Smartwatch Steps</span>
            <Footprints className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
            8,420 <span className="text-sm text-slate-400 font-sans">steps</span>
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            6.2 km walked • 105% of goal reached
          </p>
        </div>

        {/* Latest High-Fi Urine Test */}
        <div className="p-6 rounded-3xl glass-card space-y-2 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>High-Fi Urine Analyzer</span>
            <Droplet className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
            5.4 <span className="text-sm text-slate-400 font-sans">mg/dL</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            SG: <strong className="text-slate-700 dark:text-slate-300">1.018</strong> • pH: <strong className="text-slate-700 dark:text-slate-300">6.5</strong> (Optimal)
          </p>
        </div>
      </div>

      {/* 3. Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'all', label: 'All Peripherals' },
          { id: 'bp', label: 'Blood Pressure Cuffs (BP)' },
          { id: 'watch', label: 'Watches & Activity (Steps)' },
          { id: 'urine', label: 'High-Fi Urine Analyzers' },
          { id: 'cgm', label: 'Continuous Glucose (CGM)' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-5 py-2.5 rounded-2xl text-[14px] font-semibold shrink-0 transition-all cursor-pointer ${
              activeFilter === tab.id
                ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20 active:scale-95'
                : 'glass-card text-slate-700 dark:text-slate-300 hover:border-cyan-500/40'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. Devices Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredDevices.map(device => {
          const isConnected = device.status === 'connected';
          const isSyncing = syncingDeviceId === device.id || isSyncingAll;

          return (
            <motion.div
              key={device.id}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 sm:p-7 rounded-3xl glass-card space-y-5 transition-all border ${
                isConnected
                  ? 'border-slate-200/80 dark:border-slate-800 hover:border-cyan-500/40'
                  : 'border-slate-200/50 dark:border-slate-800/50 opacity-75'
              }`}
            >
              {/* Device Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 shadow-xs">
                    {renderDeviceIcon(device.iconName)}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {device.name}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {device.brand} • <span className="font-mono">{device.serviceName}</span>
                    </p>
                  </div>
                </div>

                {/* Connection Status Pill */}
                <button
                  type="button"
                  onClick={() => handleToggleConnection(device.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isConnected
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700'
                  }`}
                  title={isConnected ? 'Click to disconnect' : 'Click to connect'}
                >
                  <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                  <span>{isConnected ? 'Connected' : 'Offline'}</span>
                </button>
              </div>

              {/* Hardware Stats (Battery & Signal) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50/80 dark:bg-[#070B14]/60 border border-slate-200/60 dark:border-slate-800/80 text-xs">
                <div className="flex items-center gap-2">
                  <Battery className={`w-4 h-4 ${device.battery > 30 ? 'text-emerald-500' : 'text-amber-500'}`} />
                  <span className="text-slate-500 dark:text-slate-400">Battery:</span>
                  <strong className="text-slate-900 dark:text-white">{device.battery}%</strong>
                </div>

                <div className="flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-cyan-500" />
                  <span className="text-slate-500 dark:text-slate-400">Signal:</span>
                  <strong className="text-slate-900 dark:text-white">{device.signalRssi} dBm</strong>
                </div>

                <div className="col-span-2 sm:col-span-1 flex items-center gap-1 text-slate-500 dark:text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="truncate">Sync: {device.lastSync}</span>
                </div>
              </div>

              {/* Retrieved Telemetry Showcase */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-transparent border border-cyan-500/20 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-cyan-500" />
                    <span>Latest Retrieved Reading</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/10 text-cyan-800 dark:text-cyan-300 border border-cyan-500/20">
                    {device.readings.statusTag}
                  </span>
                </div>

                {/* Specific Metrics Display Based on Device Type */}
                {device.type === 'bp' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-1">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Systolic / Diastolic</p>
                      <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
                        {device.readings.systolic} / {device.readings.diastolic} <span className="text-xs font-sans text-slate-400">mmHg</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Resting Pulse</p>
                      <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
                        {device.readings.pulse} <span className="text-xs font-sans text-slate-400">BPM</span>
                      </p>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Mean Pressure (MAP)</p>
                      <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
                        {device.readings.map} <span className="text-xs font-sans text-slate-400">mmHg</span>
                      </p>
                    </div>
                  </div>
                )}

                {device.type === 'watch' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-1">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Today's Steps</p>
                      <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
                        {device.readings.steps?.toLocaleString()} <span className="text-xs font-sans text-slate-400">steps</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Walking Distance</p>
                      <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
                        {device.readings.distanceKm} <span className="text-xs font-sans text-slate-400">km</span>
                      </p>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Live Heart Rate</p>
                      <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
                        {device.readings.heartRateBpm} <span className="text-xs font-sans text-slate-400">BPM</span>
                      </p>
                    </div>
                  </div>
                )}

                {device.type === 'urine' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-1">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Urine Protein</p>
                      <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
                        {device.readings.proteinMgDl} <span className="text-xs font-sans text-slate-400">mg/dL</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Specific Gravity</p>
                      <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
                        {device.readings.specificGravity}
                      </p>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Urine pH</p>
                      <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
                        {device.readings.ph}
                      </p>
                    </div>
                  </div>
                )}

                {device.type === 'cgm' && (
                  <div className="grid grid-cols-2 gap-4 pt-1">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Continuous Glucose</p>
                      <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
                        {device.readings.glucoseMgDl} <span className="text-xs font-sans text-slate-400">mg/dL</span>
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Time in Range</p>
                      <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
                        {device.readings.timeInRangePercent}%
                      </p>
                    </div>
                  </div>
                )}

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-cyan-500/15 pt-2">
                  {device.readings.clinicalNote}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDiagnosticsModalDevice(device)}
                  className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>BLE GATT Diagnostics</span>
                </button>

                <button
                  type="button"
                  disabled={!isConnected || isSyncing}
                  onClick={() => handleRetrieveReading(device.id, device.name)}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[14px] font-bold transition-all cursor-pointer shadow-xs active:scale-95 ${
                    !isConnected
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                      : isSyncing
                      ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300'
                      : 'bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300'
                  }`}
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-cyan-500' : ''}`} />
                  <span>{isSyncing ? 'Reading Telemetry...' : 'Retrieve Reading'}</span>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 5. Bluetooth Scanner & Pairing Modal */}
      <AnimatePresence>
        {isScanningModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-xl p-6 sm:p-8 rounded-3xl glass-card border border-cyan-500/30 space-y-6 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500">
                    <Bluetooth className="w-5 h-5 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-bold">Bluetooth BLE Device Pairing</h3>
                </div>
                <button
                  onClick={() => setIsScanningModalOpen(false)}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Radar Scanner Animation */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-cyan-500/20 text-center space-y-3 relative overflow-hidden">
                <div className="w-20 h-20 mx-auto rounded-full bg-cyan-500/10 border-2 border-cyan-500/40 flex items-center justify-center relative">
                  <Bluetooth className="w-8 h-8 text-cyan-500" />
                  <div className="absolute inset-0 rounded-full border border-cyan-400/60 animate-ping" />
                </div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {isSearchingNearby ? 'Scanning for nearby Bluetooth Low Energy peripherals...' : 'Nearby Medical Peripherals Ready to Connect'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Ensure your Blood Pressure cuff, Smartwatch, or Optical Urine Analyzer has Bluetooth turned on.
                </p>
              </div>

              {/* Discovered Peripherals List */}
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Discovered Devices ({simulatedNearby.length})
                </p>

                {simulatedNearby.map(dev => (
                  <div
                    key={dev.id}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 flex items-center justify-between gap-3 hover:border-cyan-500/40 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                        {renderDeviceIcon(dev.iconName)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{dev.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {dev.brand} • <span className="font-mono">{dev.rssi} dBm</span>
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handlePairDiscoveredDevice(dev)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-400 hover:bg-cyan-300 text-slate-950 transition-all shadow-xs cursor-pointer active:scale-95"
                    >
                      Pair Device
                    </button>
                  </div>
                ))}
              </div>

              {/* Native Web Bluetooth Fallback Trigger */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handlePairNativeWebBluetooth}
                  className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Pair Hardware via Web Bluetooth API Prompt</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsScanningModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold glass-card text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. Device GATT Diagnostics Modal */}
      <AnimatePresence>
        {diagnosticsModalDevice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-xl p-6 sm:p-8 rounded-3xl glass-card border border-cyan-500/30 space-y-6 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {diagnosticsModalDevice.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Bluetooth Low Energy GATT Diagnostics</p>
                  </div>
                </div>
                <button
                  onClick={() => setDiagnosticsModalDevice(null)}
                  className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-slate-500 dark:text-slate-400">Primary GATT Service UUID:</span>
                  <p className="font-bold text-cyan-600 dark:text-cyan-400 break-all">{diagnosticsModalDevice.bleUuid}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="text-slate-500 dark:text-slate-400">Characteristics & Transmission Vector:</span>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400 break-all">{diagnosticsModalDevice.characteristicUuid}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400">Signal RSSI Quality:</span>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{diagnosticsModalDevice.signalRssi} dBm (Excellent)</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400">Peripheral Battery:</span>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{diagnosticsModalDevice.battery}% (Li-ion)</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 flex items-start gap-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                <ShieldCheck className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
                <span>
                  All incoming Bluetooth telemetry packets are cryptographically verified through TLS and encrypted at rest on your local device.
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                <button
                  type="button"
                  onClick={() => setDiagnosticsModalDevice(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-400 text-slate-950 shadow-xs cursor-pointer active:scale-95"
                >
                  Close Diagnostics
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <DisclaimerBanner />
    </div>
  );
}
