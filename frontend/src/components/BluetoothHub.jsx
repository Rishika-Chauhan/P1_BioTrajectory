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
  const [scanMessage, setScanMessage] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

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
          color: '#8D775F',
          description: 'Device pairing succeeded, but no verified health measurement has been decoded from the peripheral yet.'
        };

        setDevices((prev) => [newDevice, ...prev.filter((item) => item.id !== newDevice.id)]);
        setSelectedDevice(newDevice);
        setScanMessage(`Paired ${newDevice.name}. No live reading is available until a verified BLE stream is decoded.`);
        setIsScanning(false);
        try {
          confetti({ particleCount: 30, spread: 45, origin: { y: 0.6 }, colors: ['#3F0D12', '#A71D31', '#D5BF86', '#8D775F'] });
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
      <div className={`p-6 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs ${isDark ? 'bg-[#050814] border-[#D5BF86]/20' : 'bg-[#FAF9EB] border-[#D5BF86]'}`}>
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <div className="w-6 h-6 rounded-md bg-[#A71D31]/10 text-[#A71D31] flex items-center justify-center">
              <Bluetooth className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <h3 className={`font-sans text-lg font-bold ${isDark ? 'text-[#FAF9EB]' : 'text-[#3F0D12]'}`}>
              Bluetooth sensor hub
            </h3>
            <span className="text-[11px] font-sans font-semibold px-2.5 py-0.5 rounded-full bg-[#A71D31]/10 text-[#A71D31] border border-[#A71D31]/20">
              {devices.filter((device) => device.status === 'connected').length} Active sensors
            </span>
          </div>
          <p className={`text-xs font-sans ${isDark ? 'text-[#8D775F]' : 'text-[#8D775F]'}`}>
            Device pairing is separate from medical measurement. Real-station values appear only after a trusted BLE stream is decoded and stored in Firestore.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleScanBluetooth}
            disabled={isScanning}
            className={`px-3.5 py-2 rounded-lg text-xs font-sans font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-all shadow-xs ${isScanning ? 'bg-[#A71D31]/50 text-white cursor-wait' : 'bg-[#A71D31] hover:bg-[#851625] text-white'}`}
          >
            <Radio className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? 'Scanning BLE...' : 'Scan / pair BLE device'}</span>
          </button>

          {onSyncDeviceData && (
            <button
              onClick={() => onSyncDeviceData()}
              className={`px-3.5 py-2 rounded-lg text-xs font-sans font-semibold uppercase tracking-wider border flex items-center space-x-1.5 transition-all ${isDark ? 'bg-[#2A0B10] border-[#D5BF86]/30 hover:bg-[#050814] text-[#FAF9EB]' : 'bg-white border-[#D5BF86] hover:bg-[#FAF9EB] text-[#3F0D12] shadow-xs'}`}
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#A71D31]" />
              <span>Sync all to timeline</span>
            </button>
          )}
        </div>
      </div>

      {scanMessage && (
        <div className={`p-3.5 rounded-xl border text-xs flex items-center space-x-2.5 animate-fadeIn ${isDark ? 'bg-[#2A0B10] border-[#D5BF86]/40 text-[#FAF9EB]' : 'bg-[#FAF9EB] border-[#D5BF86] text-[#3F0D12]'}`}>
          <Radio className="w-4 h-4 shrink-0 animate-pulse text-[#A71D31]" />
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
                className={`px-3 py-1.5 rounded-lg transition-all ${activeTab === filterOption.id ? 'bg-[#A71D31] text-white font-bold shadow-xs' : isDark ? 'bg-[#050814] text-[#8D775F] border border-[#D5BF86]/20 hover:text-white' : 'bg-white text-[#473228] hover:text-[#3F0D12] border border-[#D5BF86]'}`}
              >
                {filterOption.label}
              </button>
            ))}
          </div>

          {filteredDevices.length === 0 ? (
            <div className={`rounded-2xl border p-6 text-sm ${isDark ? 'bg-[#050814] border-[#D5BF86]/20 text-[#FAF9EB]' : 'bg-white border-[#D5BF86] text-[#3F0D12]'}`}>
              <p className="font-bold text-base mb-2">No paired Bluetooth peripherals</p>
              <p className="text-xs leading-relaxed text-[#8D775F]">
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
                    className={`p-5 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-between ${isSelected ? isDark ? 'bg-[#2A0B10] border-[#A71D31] shadow-md ring-1 ring-[#A71D31]/40' : 'bg-[#FAF9EB] border-[#A71D31] shadow-md ring-1 ring-[#A71D31]/40' : isDark ? 'bg-[#050814] border-[#D5BF86]/20 hover:border-[#D5BF86]/40' : 'bg-white border-[#D5BF86] hover:border-[#A71D31]/50 shadow-xs'}`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3 text-xs font-mono-code">
                        <div className="flex items-center space-x-1.5">
                          <span className={`w-2 h-2 rounded-full ${isConn ? 'bg-[#A71D31] animate-pulse' : 'bg-[#8D775F]'}`}></span>
                          <span className={isConn ? 'text-[#A71D31] font-bold' : 'text-[#8D775F]'}>
                            {isConn ? 'Live telemetry' : 'Offline'}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 text-[#8D775F]">
                          <span className="flex items-center space-x-1">
                            <Battery className="w-3.5 h-3.5" />
                            <span>{device.battery ?? '—'}</span>
                          </span>
                          <span className="flex items-center space-x-0.5">
                            <Wifi className="w-3.5 h-3.5 text-[#8D775F]" />
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
                          <h4 className={`text-sm font-bold font-cinzel leading-tight ${isDark ? 'text-[#FAF9EB]' : 'text-[#3F0D12]'}`}>
                            {device.name}
                          </h4>
                          <span className="text-[10px] font-mono-code text-[#8D775F] block mt-0.5">
                            {device.category}
                          </span>
                        </div>
                      </div>

                      <div className={`p-3 rounded-xl border mb-3 flex items-center justify-between font-mono-code ${isDark ? 'bg-[#050814] border-[#D5BF86]/20' : 'bg-[#FAF9EB] border-[#D5BF86]'}`}>
                        <div>
                          <span className="text-[10px] uppercase text-[#8D775F] block">
                            {device.metricLabel}
                          </span>
                          <div className="flex items-baseline space-x-1.5 mt-0.5">
                            <strong className="text-lg font-bold" style={{ color: device.color }}>
                              {device.currentValue ?? '—'}
                            </strong>
                            <span className="text-xs text-[#8D775F]">{device.unit}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[9px] uppercase px-2 py-0.5 rounded border border-[#A71D31]/30 text-[#A71D31] bg-[#A71D31]/10">
                            {device.trend}
                          </span>
                          <span className="block text-[9px] text-[#8D775F] mt-1">
                            {device.lastSync ?? 'No sync yet'}
                          </span>
                        </div>
                      </div>

                      <p className={`text-[11px] leading-relaxed ${isDark ? 'text-[#FAF9EB]' : 'text-[#473228]'}`}>
                        {device.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-inherit flex items-center justify-between text-xs font-mono-code">
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          handleToggleConnection(device.id);
                        }}
                        className={`text-[11px] px-2.5 py-1 rounded transition-colors ${isConn ? 'bg-[#A71D31]/10 text-[#A71D31] hover:bg-[#A71D31]/20' : 'bg-[#D5BF86]/20 text-[#3F0D12] dark:text-[#FAF9EB] hover:bg-[#D5BF86]/40'}`}
                      >
                        {isConn ? 'Disconnect' : 'Connect'}
                      </button>

                      {onSelectMetricForChart && (
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            if (device.activeMetric) onSelectMetricForChart(device.activeMetric);
                          }}
                          className="text-[11px] flex items-center space-x-1 text-[#A71D31] hover:underline font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
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

        <div className={`lg:col-span-4 rounded-2xl border p-6 shadow-xl ${isDark ? 'bg-[#050814] border-[#D5BF86]/30' : 'bg-[#FAF9EB] border-[#D5BF86]'}`}>
          <div className="flex items-center justify-between pb-3 border-b border-inherit mb-4">
            <span className="text-xs font-mono-code font-bold uppercase text-[#A71D31]">
              BLE service status
            </span>
            <span className="w-2 h-2 rounded-full bg-[#A71D31] animate-pulse"></span>
          </div>

          {selectedDevice ? (
            <div className="space-y-4 text-xs font-mono-code">
              <div>
                <span className="text-[10px] text-[#8D775F] block uppercase">Peripheral name</span>
                <strong className={`text-sm ${isDark ? 'text-[#FAF9EB]' : 'text-[#3F0D12]'}`}>
                  {selectedDevice.name}
                </strong>
              </div>

              <div className={`p-3 rounded-xl border space-y-1.5 ${isDark ? 'bg-[#2A0B10] border-[#D5BF86]/20' : 'bg-white border-[#D5BF86]'}`}>
                <div className="flex justify-between">
                  <span className="text-[#8D775F]">Connection status:</span>
                  <span className="font-bold text-[#A71D31]">{selectedDevice.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8D775F]">Measurement:</span>
                  <span className="text-[#3F0D12] dark:text-[#FAF9EB] text-[10px] truncate max-w-[150px]">
                    {selectedDevice.currentValue === null ? 'Awaiting verified reading' : 'Decoded value available'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8D775F]">Last sync:</span>
                  <span className="text-[#3F0D12] dark:text-[#FAF9EB]">{selectedDevice.lastSync || 'No verified sync yet'}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] text-[#8D775F] block uppercase mb-1">Clinical caveat</span>
                <p className={`p-3 rounded-xl border leading-relaxed ${isDark ? 'bg-[#2A0B10] border-[#D5BF86]/30 text-[#FAF9EB]' : 'bg-white border-[#D5BF86] text-[#3F0D12]'}`}>
                  Device pairing alone does not create a patient measurement. Real readings are only displayed after a trusted source decodes and stores them in Firestore.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onSelectMetricForChart && selectedDevice.activeMetric && onSelectMetricForChart(selectedDevice.activeMetric)}
                  disabled={!selectedDevice.activeMetric}
                  className="w-full py-2.5 rounded-xl bg-[#A71D31] hover:bg-[#851625] text-white font-mono-code font-bold uppercase tracking-wider text-xs shadow-md transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Activity className="w-4 h-4" />
                  <span>{selectedDevice.activeMetric ? `Overlay ${selectedDevice.metricLabel} on trajectory` : 'No verified metric yet'}</span>
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-[#8D775F]">Select any paired Bluetooth peripheral to inspect its connection status. No fabricated health data is displayed.</p>
          )}
        </div>
      </div>
    </div>
  );
}
