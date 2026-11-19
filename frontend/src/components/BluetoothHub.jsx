import React, { useState } from 'react';
import {
  Bluetooth,
  Activity,
  Heart,
  Watch,
  Scale,
  Battery,
  Wifi,
  RefreshCw,
  Radio,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTheme } from '../context/ThemeContext';

export default function BluetoothHub({ onSyncDeviceData, onSelectMetricForChart }) {
  const { isDark } = useTheme();

  const [devices, setDevices] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [scanMessage, setScanMessage] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await new Promise(r => setTimeout(r, 450));
      if (onSyncDeviceData) await onSyncDeviceData();
    } finally {
      setIsSyncing(false);
    }
  };

  const handleScanBluetooth = async () => {
    setIsScanning(true);
    setScanMessage('Scanning for nearby Bluetooth Low Energy (BLE) health peripherals...');

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
          id: device.id,
          name: device.name || 'Paired BLE health device',
          shortName: device.name || 'BLE peripheral',
          type: 'Wearable',
          category: 'Paired BLE device',
          icon: 'Watch',
          battery: null,
          signalStrength: null,
          status: 'paired',
          lastSync: null,
          activeMetric: null,
          metricLabel: 'Awaiting measurement',
          currentValue: null,
          unit: '—',
          trend: 'pending',
          color: '#846752',
          description: 'Device pairing succeeded, but no verified health measurement has been decoded from the peripheral yet.'
        };

        setDevices((prev) => [newDevice, ...prev.filter((item) => item.id !== newDevice.id)]);
        setSelectedDevice(newDevice);
        setScanMessage(`Paired ${newDevice.name}. No live reading is available until a verified BLE stream is decoded.`);
        setIsScanning(false);
        try {
          confetti({ particleCount: 30, spread: 45, origin: { y: 0.6 }, colors: ['#3D291A', '#A9D6F5', '#E5DACB', '#846752'] });
        } catch (e) {}
        return;
      } catch (err) {
        setScanMessage('No BLE device was paired. This view intentionally does not create simulated medical readings.');
      }
    } else {
      setScanMessage('Web Bluetooth is not available in this browser, so no real BLE telemetry can be loaded.');
    }

    setIsScanning(false);
  };

  const handleToggleConnection = (id) => {
    setDevices((prev) =>
      prev.map((device) => {
        if (device.id !== id) return device;

        const nextStatus = device.status === 'connected' ? 'paired' : 'connected';
        return {
          ...device,
          status: nextStatus,
          lastSync: nextStatus === 'connected' ? 'Awaiting decoded reading' : 'Disconnected',
          currentValue: nextStatus === 'connected' ? null : device.currentValue
        };
      })
    );
  };

  const filteredDevices = devices.filter((device) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'cgm') return device.type === 'CGM';
    if (activeTab === 'cardio') return device.type === 'BPM' || device.type === 'Wearable';
    if (activeTab === 'body') return device.type === 'Scale';
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
      <div className={`p-6 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs ${isDark ? 'bg-[#18100A] border-[#E5DACB]/20' : 'bg-[#FAF6EE] border-[#E5DACB]'}`}>
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <div className="w-6 h-6 rounded-md bg-[#A9D6F5]/10 text-[#A9D6F5] flex items-center justify-center">
              <Bluetooth className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <h3 className={`font-sans text-lg font-bold ${isDark ? 'text-[#FAF6EE]' : 'text-[#3D291A]'}`}>
              Bluetooth sensor hub
            </h3>
            <span className="text-[11px] font-sans font-semibold px-2.5 py-0.5 rounded-full bg-[#A9D6F5]/10 text-[#A9D6F5] border border-[#A9D6F5]/20">
              {devices.filter((device) => device.status === 'connected').length} Active sensors
            </span>
          </div>
          <p className={`text-xs font-sans ${isDark ? 'text-[#846752]' : 'text-[#846752]'}`}>
            Device pairing is separate from medical measurement. Real-station values appear only after a trusted BLE stream is decoded and stored in Firestore.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleScanBluetooth}
            disabled={isScanning}
            className={`px-3.5 py-2 rounded-lg text-xs font-sans font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-all shadow-xs ${isScanning ? 'bg-[#A9D6F5]/50 text-white cursor-wait' : 'bg-[#A9D6F5]-[#7CBFEA]-[#1F150E]'}`}
          >
            <Radio className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Scanning BLE...' : 'Scan / pair BLE device'}</span>
          </button>

          {onSyncDeviceData && (
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className={`px-3.5 py-2 rounded-lg text-xs font-sans font-semibold uppercase tracking-wider border flex items-center space-x-1.5 transition-all cursor-pointer active:scale-95 disabled:opacity-60 ${isDark ? 'bg-[#2A0B10] border-[#E5DACB]/30 hover:bg-[#18100A] text-[#FAF6EE]' : 'bg-white border-[#E5DACB] hover:bg-[#FAF6EE] text-[#3D291A] shadow-xs'}`}
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#A9D6F5] ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync all to timeline'}</span>
            </button>
          )}
        </div>
      </div>

      {scanMessage && (
        <div className={`p-3.5 rounded-xl border text-xs flex items-center space-x-2.5 animate-fadeIn ${isDark ? 'bg-[#2A0B10] border-[#E5DACB]/40 text-[#FAF6EE]' : 'bg-[#FAF6EE] border-[#E5DACB] text-[#3D291A]'}`}>
          <Radio className="w-4 h-4 shrink-0 animate-pulse text-[#A9D6F5]" />
          <span className="font-mono-code">{scanMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center space-x-2 text-xs font-mono-code pb-1 overflow-x-auto">
            {[
              { id: 'all', label: 'All peripherals' },
              { id: 'cgm', label: 'Continuous glucose (CGM)' },
              { id: 'cardio', label: 'Cardio & blood pressure' },
              { id: 'body', label: 'Smart scale / hydration' }
            ].map((filterOption) => (
              <button
                key={filterOption.id}
                onClick={() => setActiveTab(filterOption.id)}
                className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === filterOption.id ? 'bg-[#A9D6F5]-[#1F150E] font-bold shadow-xs' : isDark ? 'bg-[#18100A] text-[#846752] border border-[#E5DACB]/20 hover:text-white' : 'bg-white text-[#553C2A] hover:text-[#3D291A] border border-[#E5DACB]'}`}
              >
                {filterOption.label}
              </button>
            ))}
          </div>

          {filteredDevices.length === 0 ? (
            <div className={`rounded-2xl border p-6 text-sm ${isDark ? 'bg-[#18100A] border-[#E5DACB]/20 text-[#FAF6EE]' : 'bg-white border-[#E5DACB] text-[#3D291A]'}`}>
              <p className="font-bold text-base mb-2">No paired Bluetooth peripherals</p>
              <p className="text-xs leading-relaxed text-[#846752]">
                Pair a compatible device in a supported browser to discover it. Until a verified stream is decoded and stored, this panel stays empty by design.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredDevices.map((device) => {
                const Icon = getIcon(device.type);
                const isSelected = selectedDevice?.id === device.id;
                const isConn = device.status === 'connected';

                return (
                  <div
                    key={device.id}
                    onClick={() => setSelectedDevice(device)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-between ${isSelected ? isDark ? 'bg-[#2A0B10] border-[#A9D6F5] shadow-md ring-1 ring-[#A9D6F5]/40' : 'bg-[#FAF6EE] border-[#A9D6F5] shadow-md ring-1 ring-[#A9D6F5]/40' : isDark ? 'bg-[#18100A] border-[#E5DACB]/20 hover:border-[#E5DACB]/40' : 'bg-white border-[#E5DACB] hover:border-[#A9D6F5]/50 shadow-xs'}`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3 text-xs font-mono-code">
                        <div className="flex items-center space-x-1.5">
                          <span className={`w-2 h-2 rounded-full ${isConn ? 'bg-[#A9D6F5] animate-pulse' : 'bg-[#846752]'}`}></span>
                          <span className={isConn ? 'text-[#A9D6F5] font-bold' : 'text-[#846752]'}>
                            {isConn ? 'Live telemetry' : 'Offline'}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 text-[#846752]">
                          <span className="flex items-center space-x-1">
                            <Battery className="w-3.5 h-3.5" />
                            <span>{device.battery ?? '—'}</span>
                          </span>
                          <span className="flex items-center space-x-0.5">
                            <Wifi className="w-3.5 h-3.5 text-[#846752]" />
                            <span>{device.signalStrength ?? '—'}</span>
                          </span>
                        </div>
                      </div>

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
                          <h4 className={`text-sm font-bold font-cinzel leading-tight ${isDark ? 'text-[#FAF6EE]' : 'text-[#3D291A]'}`}>
                            {device.name}
                          </h4>
                          <span className="text-[10px] font-mono-code text-[#846752] block mt-0.5">
                            {device.category}
                          </span>
                        </div>
                      </div>

                      <div className={`p-3 rounded-xl border mb-3 flex items-center justify-between font-mono-code ${isDark ? 'bg-[#18100A] border-[#E5DACB]/20' : 'bg-[#FAF6EE] border-[#E5DACB]'}`}>
                        <div>
                          <span className="text-[10px] uppercase text-[#846752] block">
                            {device.metricLabel}
                          </span>
                          <div className="flex items-baseline space-x-1.5 mt-0.5">
                            <strong className="text-lg font-bold" style={{ color: device.color }}>
                              {device.currentValue ?? '—'}
                            </strong>
                            <span className="text-xs text-[#846752]">{device.unit}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[9px] uppercase px-2 py-0.5 rounded border border-[#A9D6F5]/30 text-[#A9D6F5] bg-[#A9D6F5]/10">
                            {device.trend}
                          </span>
                          <span className="block text-[9px] text-[#846752] mt-1">
                            {device.lastSync ?? 'No sync yet'}
                          </span>
                        </div>
                      </div>

                      <p className={`text-[11px] leading-relaxed ${isDark ? 'text-[#FAF6EE]' : 'text-[#553C2A]'}`}>
                        {device.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-inherit flex items-center justify-between text-xs font-mono-code">
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          handleToggleConnection(device.id);
                        }}
                        className={`text-[11px] px-2.5 py-1 rounded transition-colors ${isConn ? 'bg-[#A9D6F5]/10 text-[#A9D6F5] hover:bg-[#A9D6F5]/20' : 'bg-[#E5DACB]/20 text-[#3D291A] dark:text-[#FAF6EE] hover:bg-[#E5DACB]/40'}`}
                      >
                        {isConn ? 'Disconnect' : 'Connect'}
                      </button>

                      {onSelectMetricForChart && (
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            if (device.activeMetric) onSelectMetricForChart(device.activeMetric);
                          }}
                          className="text-[11px] flex items-center space-x-1 text-[#A9D6F5] hover:underline font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={!device.activeMetric}
                        >
                          <span>{device.activeMetric ? 'Plot on line chart' : 'Awaiting metric'}</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className={`lg:col-span-4 rounded-2xl border p-6 shadow-xl ${isDark ? 'bg-[#18100A] border-[#E5DACB]/30' : 'bg-[#FAF6EE] border-[#E5DACB]'}`}>
          <div className="flex items-center justify-between pb-3 border-b border-inherit mb-4">
            <span className="text-xs font-mono-code font-bold uppercase text-[#A9D6F5]">
              BLE service status
            </span>
            <span className="w-2 h-2 rounded-full bg-[#A9D6F5] animate-pulse"></span>
          </div>

          {selectedDevice ? (
            <div className="space-y-4 text-xs font-mono-code">
              <div>
                <span className="text-[10px] text-[#846752] block uppercase">Peripheral name</span>
                <strong className={`text-sm ${isDark ? 'text-[#FAF6EE]' : 'text-[#3D291A]'}`}>
                  {selectedDevice.name}
                </strong>
              </div>

              <div className={`p-3 rounded-xl border space-y-1.5 ${isDark ? 'bg-[#2A0B10] border-[#E5DACB]/20' : 'bg-white border-[#E5DACB]'}`}>
                <div className="flex justify-between">
                  <span className="text-[#846752]">Connection status:</span>
                  <span className="font-bold text-[#A9D6F5]">{selectedDevice.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#846752]">Measurement:</span>
                  <span className="text-[#3D291A] dark:text-[#FAF6EE] text-[10px] truncate max-w-[150px]">
                    {selectedDevice.currentValue === null ? 'Awaiting verified reading' : 'Decoded value available'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#846752]">Last sync:</span>
                  <span className="text-[#3D291A] dark:text-[#FAF6EE]">{selectedDevice.lastSync || 'No verified sync yet'}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-[#846752] block uppercase mb-1">Clinical caveat</span>
                <p className={`p-3 rounded-xl border leading-relaxed ${isDark ? 'bg-[#2A0B10] border-[#E5DACB]/30 text-[#FAF6EE]' : 'bg-white border-[#E5DACB] text-[#3D291A]'}`}>
                  Device pairing alone does not create a patient measurement. Real readings are only displayed after a trusted source decodes and stores them in Firestore.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onSelectMetricForChart && selectedDevice.activeMetric && onSelectMetricForChart(selectedDevice.activeMetric)}
                  disabled={!selectedDevice.activeMetric}
                  className="w-full py-2.5 rounded-xl bg-[#A9D6F5]-[#7CBFEA]-[#1F150E] font-mono-code font-bold uppercase tracking-wider text-xs shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Activity className="w-4 h-4" />
                  <span>{selectedDevice.activeMetric ? `Overlay ${selectedDevice.metricLabel} on trajectory` : 'No verified metric yet'}</span>
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-[#846752]">Select any paired Bluetooth peripheral to inspect its connection status. No fabricated health data is displayed.</p>
          )}
        </div>
      </div>
    </div>
  );
}
