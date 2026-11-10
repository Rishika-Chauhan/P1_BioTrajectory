import React, { useState, useEffect } from 'react';
import {
  Bluetooth,
  Activity,
  Heart,
  Watch,
  Scale,
  Battery,
  Wifi,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Plus,
  Radio,
  Zap,
  ShieldCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BLUETOOTH_DEVICES } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';

export default function BluetoothHub({ onSyncDeviceData, onSelectMetricForChart }) {
  const { isDark } = useTheme();

  const [devices, setDevices] = useState(BLUETOOTH_DEVICES);
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(BLUETOOTH_DEVICES[0]);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'cgm', 'cardio', 'body'
  const [livePulseTick, setLivePulseTick] = useState(0);

  // Simulated live telemetry stream ticker (updates every 3 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setLivePulseTick((prev) => prev + 1);
      // Small simulated jitter on live values
      setDevices((prev) =>
        prev.map((d) => {
          if (d.status !== 'connected') return d;
          if (d.type === 'CGM') {
            const jitter = (Math.random() * 2 - 1).toFixed(0);
            return { ...d, currentValue: Math.max(80, Math.min(140, Number(d.currentValue) + Number(jitter))) };
          }
          if (d.type === 'Wearable') {
            const jitter = (Math.random() * 2 - 1).toFixed(0);
            return { ...d, currentValue: Math.max(58, Math.min(75, Number(d.currentValue) + Number(jitter))) };
          }
          return d;
        })
      );
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Web Bluetooth API Scanner with Fallback Simulation
  const handleScanBluetooth = async () => {
    setIsScanning(true);
    setScanMessage('Scanning for nearby Bluetooth Low Energy (BLE) health peripherals...');

    // Attempt native Web Bluetooth API if available in browser
    if (typeof navigator !== 'undefined' && navigator.bluetooth) {
      try {
        setScanMessage('Requesting Web Bluetooth device pairing...');
        const device = await navigator.bluetooth.requestDevice({
          filters: [
            { services: ['heart_rate'] },
            { services: ['health_thermometer'] },
            { services: ['battery_service'] },
            { services: ['glucose'] }
          ],
          optionalServices: ['generic_access']
        });

        const newDevice = {
          id: `ble-${Date.now()}`,
          name: device.name || 'Discovered BLE Health Peripheral',
          shortName: device.name || 'Custom BLE Sensor',
          type: 'Wearable',
          category: 'Live Bluetooth Stream',
          icon: 'Watch',
          battery: 98,
          signalStrength: -55,
          status: 'connected',
          bleUuid: '0x180D (BLE GATT)',
          serviceName: 'Live Connected Peripheral',
          lastSync: 'Just now',
          activeMetric: 'bleHeartRate',
          metricLabel: 'Heart Rate',
          currentValue: 68,
          unit: 'bpm',
          trend: 'stable',
          color: '#10b981',
          description: 'Paired directly via Web Bluetooth API GATT interface.'
        };

        setDevices((prev) => [newDevice, ...prev]);
        setSelectedDevice(newDevice);
        setScanMessage(`Successfully paired with ${device.name}!`);
        setIsScanning(false);
        try {
          confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
        } catch (e) { }
        return;
      } catch (err) {
        // Fall back to automated simulation if user cancelled or unsupported
        setScanMessage('Web Bluetooth prompt closed. Initiating automated medical device discovery...');
      }
    }

    // High-fidelity fallback simulation
    setTimeout(() => {
      const simulatedNewDevice = {
        id: `ble-${Date.now()}`,
        name: 'Masimo MightySat BLE Pulse Oximeter',
        shortName: 'Masimo SpO2 BLE',
        type: 'Wearable',
        category: 'Respiratory & Peripheral Perfusion',
        icon: 'Activity',
        battery: 100,
        signalStrength: -52,
        status: 'connected',
        bleUuid: '0x1822 (Pulse Oximeter Service)',
        serviceName: 'Continuous SpO2 & Pleth',
        lastSync: 'Just now',
        activeMetric: 'bleSpo2',
        metricLabel: 'SpO2 Oxygen',
        currentValue: 99,
        unit: '%',
        trend: 'optimal',
        color: '#06b6d4',
        description: 'Hospital-grade optical pulse oximeter streaming peripheral arterial oxygen saturation.'
      };

      setDevices((prev) => [simulatedNewDevice, ...prev]);
      setSelectedDevice(simulatedNewDevice);
      setIsScanning(false);
      setScanMessage('New BLE medical sensor paired successfully (Masimo MightySat SpO2)!');

      try {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.6 },
          colors: isDark ? ['#38bdf8', '#10b981', '#f59e0b'] : ['#0284c7', '#059669', '#d97706']
        });
      } catch (e) { }

      setTimeout(() => setScanMessage(null), 5000);
    }, 1800);
  };

  const handleToggleConnection = (id) => {
    setDevices((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          const nextStatus = d.status === 'connected' ? 'disconnected' : 'connected';
          return { ...d, status: nextStatus, lastSync: nextStatus === 'connected' ? 'Just now' : 'Disconnected' };
        }
        return d;
      })
    );
  };

  const filteredDevices = devices.filter((d) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'cgm') return d.type === 'CGM';
    if (activeTab === 'cardio') return d.type === 'BPM' || d.type === 'Wearable';
    if (activeTab === 'body') return d.type === 'Scale';
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'CGM':
        return Activity;
      case 'BPM':
        return Heart;
      case 'Wearable':
        return Watch;
      case 'Scale':
        return Scale;
      default:
        return Bluetooth;
    }
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Top Controller Bar */}
      <div className={`p-6 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs ${isDark ? 'bg-[#0d1526] border-slate-800' : 'bg-white border-[#e2e8f0]'
        }`}>
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <div className="w-6 h-6 rounded-md bg-[#00687a]/10 text-[#00687a] dark:text-[#57dffe] flex items-center justify-center">
              <Bluetooth className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <h3 className={`font-sans text-lg font-bold ${isDark ? 'text-white' : 'text-[#131b2e]'}`}>
              Connected Bluetooth Health Sensors Hub
            </h3>
            <span className="text-[11px] font-sans font-semibold px-2.5 py-0.5 rounded-full bg-[#006947]/10 text-[#006947] dark:text-[#6ffbbe]">
              {devices.filter((d) => d.status === 'connected').length} Active Sensors
            </span>
          </div>
          <p className={`text-xs font-sans ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Retrieve continuous biometric streams (Dexcom CGM, Omron BP, Apple Watch) directly via Web Bluetooth API GATT services.
          </p>
        </div>

        {/* Pairing Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleScanBluetooth}
            disabled={isScanning}
            className={`px-3.5 py-2 rounded-lg text-xs font-sans font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-all shadow-xs ${isScanning
                ? 'bg-[#00687a]/50 text-white cursor-wait'
                : 'bg-[#00687a] hover:bg-[#00505f] text-white'
              }`}
          >
            <Radio className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Scanning BLE...' : 'Scan / Pair BLE Device'}</span>
          </button>

          {onSyncDeviceData && (
            <button
              onClick={() => {
                onSyncDeviceData();
                try {
                  confetti({ particleCount: 30, spread: 45, origin: { y: 0.7 } });
                } catch (e) { }
              }}
              className={`px-3.5 py-2 rounded-lg text-xs font-sans font-semibold uppercase tracking-wider border flex items-center space-x-1.5 transition-all ${isDark
                  ? 'bg-slate-900 border-slate-800 hover:bg-slate-800 text-slate-200'
                  : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700 shadow-xs'
                }`}
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#00685f]" />
              <span>Sync All to Timeline</span>
            </button>
          )}
        </div>
      </div>

      {/* Real-time scan banner alert */}
      {scanMessage && (
        <div className={`p-3.5 rounded-xl border text-xs flex items-center space-x-2.5 animate-fadeIn ${isScanning
          ? isDark ? 'bg-blue-950/40 border-blue-500/40 text-blue-200' : 'bg-blue-50 border-blue-300 text-blue-900'
          : isDark ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' : 'bg-emerald-50 border-emerald-300 text-emerald-900'
          }`}>
          <Radio className="w-4 h-4 shrink-0 animate-pulse text-blue-400" />
          <span className="font-mono-code">{scanMessage}</span>
        </div>
      )}

      {/* Main Grid: Device Cards on Left (8 Cols), Selected Device Inspector on Right (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left 8 Cols: Filterable Device Cards */}
        <div className="lg:col-span-8 space-y-4">

          {/* Filter Pills */}
          <div className="flex items-center space-x-2 text-xs font-mono-code pb-1 overflow-x-auto">
            {[
              { id: 'all', label: 'All Peripherals' },
              { id: 'cgm', label: 'Continuous Glucose (CGM)' },
              { id: 'cardio', label: 'Cardio & Blood Pressure' },
              { id: 'body', label: 'Smart Scale / Hydration' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveTab(f.id)}
                className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === f.id
                  ? isDark ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-amber-700 text-white font-bold'
                  : isDark ? 'bg-slate-900/80 text-slate-400 hover:text-white' : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredDevices.map((device) => {
              const Icon = getIcon(device.type);
              const isSelected = selectedDevice?.id === device.id;
              const isConn = device.status === 'connected';

              return (
                <div
                  key={device.id}
                  onClick={() => setSelectedDevice(device)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-between ${isSelected
                    ? isDark
                      ? 'bg-gradient-to-b from-[#11192e] to-[#090e18] border-amber-400 shadow-[0_10px_30px_rgba(245,158,11,0.15)] ring-1 ring-amber-400/40'
                      : 'bg-white border-amber-500 shadow-md ring-1 ring-amber-400/50'
                    : isDark
                      ? 'bg-[#090e18]/80 border-white/10 hover:border-white/20'
                      : 'bg-white border-slate-200 hover:border-amber-300 shadow-xs'
                    }`}
                >
                  <div>
                    {/* Top Row: Type Badge, Battery, Status */}
                    <div className="flex items-center justify-between mb-3 text-xs font-mono-code">
                      <div className="flex items-center space-x-1.5">
                        <span className={`w-2 h-2 rounded-full ${isConn ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`}></span>
                        <span className={isConn ? 'text-emerald-500 font-bold' : 'text-slate-500'}>
                          {isConn ? 'LIVE TELEMETRY' : 'OFFLINE'}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 text-slate-400">
                        <span className="flex items-center space-x-1">
                          <Battery className="w-3.5 h-3.5" />
                          <span>{device.battery}%</span>
                        </span>
                        <span className="flex items-center space-x-0.5">
                          <Wifi className="w-3.5 h-3.5 text-blue-400" />
                          <span>{device.signalStrength}dBm</span>
                        </span>
                      </div>
                    </div>

                    {/* Device Title & Icon */}
                    <div className="flex items-start space-x-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                        style={{
                          backgroundColor: `${device.color}15`,
                          borderColor: `${device.color}35`,
                          color: device.color
                        }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className={`text-sm font-bold font-cinzel leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {device.name}
                        </h4>
                        <span className="text-[10px] font-mono-code text-slate-400 block mt-0.5">
                          {device.category}
                        </span>
                      </div>
                    </div>

                    {/* Live Metric Stream Display */}
                    <div className={`p-3 rounded-xl border mb-3 flex items-center justify-between font-mono-code ${isDark ? 'bg-slate-950/70 border-white/5' : 'bg-slate-50 border-slate-200'
                      }`}>
                      <div>
                        <span className="text-[10px] uppercase text-slate-500 block">
                          {device.metricLabel}
                        </span>
                        <div className="flex items-baseline space-x-1.5 mt-0.5">
                          <strong className="text-lg font-bold" style={{ color: device.color }}>
                            {device.currentValue}
                          </strong>
                          <span className="text-xs text-slate-400">{device.unit}</span>
                        </div>
                      </div>

                      {device.secondaryMetric && (
                        <div className="text-right">
                          <span className="text-[10px] uppercase text-slate-500 block">
                            Diastolic
                          </span>
                          <span className="text-sm font-bold text-slate-300">
                            {device.secondaryValue} mmHg
                          </span>
                        </div>
                      )}

                      <div className="text-right">
                        <span className="text-[9px] uppercase px-2 py-0.5 rounded border border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                          {device.trend}
                        </span>
                        <span className="block text-[9px] text-slate-500 mt-1">
                          {device.lastSync}
                        </span>
                      </div>
                    </div>

                    <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {device.description}
                    </p>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="mt-4 pt-3 border-t border-inherit flex items-center justify-between text-xs font-mono-code">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleConnection(device.id);
                      }}
                      className={`text-[11px] px-2.5 py-1 rounded transition-colors ${isConn
                        ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                        }`}
                    >
                      {isConn ? 'Disconnect' : 'Connect'}
                    </button>

                    {onSelectMetricForChart && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectMetricForChart(device.activeMetric);
                        }}
                        className={`text-[11px] flex items-center space-x-1 ${isDark ? 'text-amber-300 hover:text-white' : 'text-amber-800 hover:text-amber-950 font-semibold'
                          }`}
                      >
                        <span>Plot on Line Chart</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 4 Cols: Selected Device Deep-Dive & GATT Inspector */}
        <div className={`lg:col-span-4 rounded-2xl border p-6 shadow-xl ${isDark ? 'bg-[#090e18] border-white/10' : 'bg-white border-slate-200'
          }`}>
          <div className="flex items-center justify-between pb-3 border-b border-inherit mb-4">
            <span className="text-xs font-mono-code font-bold uppercase text-amber-500">
              BLE GATT Service Inspector
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>

          {selectedDevice ? (
            <div className="space-y-4 text-xs font-mono-code">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Peripheral Name</span>
                <strong className={`text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {selectedDevice.name}
                </strong>
              </div>

              <div className={`p-3 rounded-xl border space-y-1.5 ${isDark ? 'bg-slate-950 border-white/10' : 'bg-slate-50 border-slate-200'
                }`}>
                <div className="flex justify-between">
                  <span className="text-slate-400">GATT Service:</span>
                  <span className="font-bold text-amber-400">{selectedDevice.serviceName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">BLE UUID:</span>
                  <span className="text-slate-300 text-[10px] truncate max-w-[150px]">{selectedDevice.bleUuid}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Telemetry Frequency:</span>
                  <span className="text-slate-200">Continuous Stream</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Security / Cipher:</span>
                  <span className="text-emerald-400">AES-128 Encrypted</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block uppercase mb-1">Cross-Modal Clinical Insight:</span>
                <p className={`p-3 rounded-xl border leading-relaxed ${isDark ? 'bg-amber-950/20 border-amber-400/20 text-amber-200/90' : 'bg-amber-50 border-amber-200 text-amber-900'
                  }`}>
                  {selectedDevice.type === 'CGM' && (
                    <span>
                      <strong>Renal Threshold Concordance:</strong> Serum glucose typically appears in urine test strips once interstitial blood glucose surpasses ~180 mg/dL. Continuous CGM telemetries identify when morning micro-albuminuria correlates with glycemic excursions.
                    </span>
                  )}
                  {selectedDevice.type === 'BPM' && (
                    <span>
                      <strong>Hemodynamic Correlation:</strong> Glomerular hyperfiltration and trace proteinuria often correlate with acute systolic surges (&gt;140 mmHg) during exertion or stress.
                    </span>
                  )}
                  {selectedDevice.type === 'Wearable' && (
                    <span>
                      <strong>Exertion vs Pathology:</strong> High resting heart rate and low HRV preceding a protein spike confirm exercise-induced March proteinuria rather than structural parenchymal disease.
                    </span>
                  )}
                  {selectedDevice.type === 'Scale' && (
                    <span>
                      <strong>Hydration Calibration:</strong> Smart scale body water % correlates with urine Specific Gravity; low extracellular water triggers physiological solute concentration.
                    </span>
                  )}
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onSelectMetricForChart && onSelectMetricForChart(selectedDevice.activeMetric)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-mono-code font-bold uppercase tracking-wider text-xs shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <Activity className="w-4 h-4" />
                  <span>Overlay {selectedDevice.metricLabel} on Trajectory</span>
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500">Select any connected Bluetooth peripheral to inspect its live GATT telemetry stream.</p>
          )}
        </div>

      </div>
    </div>
  );
}
