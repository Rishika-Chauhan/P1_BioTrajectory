
/**
 * BioTrajectory Bluetooth Low Energy (BLE) Medical Peripherals Service
 *
 * Current scope:
 * 1. Discover compatible Bluetooth devices through Web Bluetooth.
 * 2. Store paired device metadata locally.
 * 3. Never generate simulated or fabricated health readings.
 * 4. Return empty values when no real measurements are available.
 *
 * IMPORTANT:
 * Device discovery/pairing does not mean that GATT measurements
 * have been received or decoded. Actual GATT integration is not
 * implemented yet.
 */

const STORAGE_KEY_DEVICES = 'biotrajectory_ble_devices';
const STORAGE_KEY_LATEST_VITALS = 'biotrajectory_latest_vitals';
const STORAGE_KEY_URINE_MODE = 'biotrajectory_urine_device_mode';

const EMPTY_VITALS = {
  systolic: null,
  diastolic: null,
  pulse: null,
  spo2: null,
  steps: null,
  distance: null,
  exerciseMins: null,
  urineProtein: null,
  urineProteinMg: null,
  urineSG: null,
  urinePH: null,
  urineGlucose: null,
  urineNitrites: null,
  lastSyncDevice: null,
  lastSyncTimestamp: null
};

export const INITIAL_BLUETOOTH_DEVICES = [];

export const BluetoothService = {
  /**
   * Get registered Bluetooth devices.
   * No demo devices are returned.
   */
  getDevices: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DEVICES);

      if (!saved) return [];

      const devices = JSON.parse(saved);

      return Array.isArray(devices) ? devices : [];
    } catch (error) {
      console.error('Unable to load Bluetooth devices:', error);
      return [];
    }
  },

  /**
   * Save registered device metadata.
   */
  saveDevices: (devices = []) => {
    try {
      localStorage.setItem(
        STORAGE_KEY_DEVICES,
        JSON.stringify(devices)
      );

      window.dispatchEvent(
        new CustomEvent('biotrajectory_devices_updated', {
          detail: devices
        })
      );
    } catch (error) {
      console.error('Unable to save Bluetooth devices:', error);
    }
  },

  /**
   * Discover and pair a Bluetooth device.
   *
   * Pairing only discovers the device.
   * It does NOT generate or claim to receive health readings.
   */
  scanNativeBluetooth: async () => {
    if (
      typeof navigator === 'undefined' ||
      !navigator.bluetooth
    ) {
      throw new Error(
        'Web Bluetooth is not supported in this browser. Use Chrome, Edge, or Opera.'
      );
    }

    const device = await navigator.bluetooth.requestDevice({
      filters: [
        { services: ['heart_rate'] },
        { services: ['blood_pressure'] },
        { services: ['health_thermometer'] },
        { services: ['glucose'] },
        { services: ['weight_scale'] }
      ],
      optionalServices: [
        'generic_access',
        'battery_service',
        0xffe0
      ]
    });

    const newDevice = {
      id: device.id,
      name: device.name || 'Bluetooth Health Device',
      shortName: device.name || 'BLE Health Sensor',
      brand: 'Generic BLE Peripheral',
      type: 'unknown',
      categoryLabel: 'Paired Bluetooth Device',
      iconName: 'Bluetooth',
      status: 'paired',
      battery: null,
      signalRssi: null,
      lastSync: null,
      readings: null,
      gattConnected: false
    };

    const existing = BluetoothService.getDevices();

    const updated = [
      newDevice,
      ...existing.filter(item => item.id !== newDevice.id)
    ];

    BluetoothService.saveDevices(updated);

    return newDevice;
  },

  /**
   * Toggle device connection.
   *
   * This only changes the application's stored status.
   * It does not establish a real GATT connection.
   */
  toggleDeviceConnection: (deviceId) => {
    const devices = BluetoothService.getDevices();

    const updated = devices.map(device => {
      if (device.id !== deviceId) return device;

      return {
        ...device,
        status:
          device.status === 'connected'
            ? 'paired'
            : 'paired',
        lastSync: null,
        readings: null,
        gattConnected: false
      };
    });

    BluetoothService.saveDevices(updated);

    return updated;
  },

  /**
   * Real GATT measurement decoding is not implemented.
   * Never generate simulated readings.
   */
  retrieveDeviceReadings: async () => {
    throw new Error(
      'Health measurement reading is not implemented yet. No simulated readings are available.'
    );
  },

  /**
   * Do not claim a successful synchronization when
   * real GATT measurement reading is unavailable.
   */
  syncAllConnectedDevices: async () => {
    return {
      success: false,
      syncedCount: 0,
      message:
        'Real Bluetooth measurement synchronization is not implemented yet.'
    };
  },

  /**
   * Publish only readings explicitly supplied by a real
   * measurement integration.
   *
   * Missing readings remain null.
   */
  propagateVitalsFromDevices: (devices = []) => {
    const bpDevice = devices.find(
      device =>
        device.type === 'bp' &&
        device.status === 'connected' &&
        device.readings
    );

    const watchDevice = devices.find(
      device =>
        device.type === 'watch' &&
        device.status === 'connected' &&
        device.readings
    );

    const urineDevice = devices.find(
      device =>
        device.type === 'urine' &&
        device.status === 'connected' &&
        device.readings
    );

    const updatedVitals = {
      systolic: bpDevice?.readings?.systolic ?? null,
      diastolic: bpDevice?.readings?.diastolic ?? null,

      pulse:
        bpDevice?.readings?.pulse ??
        watchDevice?.readings?.heartRateBpm ??
        null,

      spo2: watchDevice?.readings?.spo2Percent ?? null,
      steps: watchDevice?.readings?.steps ?? null,
      distance: watchDevice?.readings?.distanceKm ?? null,
      exerciseMins: watchDevice?.readings?.exerciseMins ?? null,

      urineProtein:
        urineDevice?.readings?.proteinLabel ?? null,

      urineProteinMg:
        urineDevice?.readings?.proteinMgDl ?? null,

      urineSG:
        urineDevice?.readings?.specificGravity ?? null,

      urinePH:
        urineDevice?.readings?.ph ?? null,

      urineGlucose:
        urineDevice?.readings?.glucose ?? null,

      urineNitrites:
        urineDevice?.readings?.nitrites ?? null,

      lastSyncDevice:
        bpDevice?.name ??
        watchDevice?.name ??
        urineDevice?.name ??
        null,

      lastSyncTimestamp:
        bpDevice || watchDevice || urineDevice
          ? new Date().toISOString()
          : null
    };

    try {
      localStorage.setItem(
        STORAGE_KEY_LATEST_VITALS,
        JSON.stringify(updatedVitals)
      );

      window.dispatchEvent(
        new CustomEvent('biotrajectory_vitals_updated', {
          detail: updatedVitals
        })
      );
    } catch (error) {
      console.error('Unable to save health readings:', error);
    }

    return updatedVitals;
  },

  /**
   * Check whether urine device mode is enabled.
   */
  isUrineDeviceEnabled: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_URINE_MODE);

      return saved !== null ? JSON.parse(saved) : false;
    } catch (error) {
      console.error('Unable to load urine device mode:', error);
      return false;
    }
  },

  /**
   * Toggle urine device mode.
   */
  setUrineDeviceEnabled: (enabled) => {
    try {
      localStorage.setItem(
        STORAGE_KEY_URINE_MODE,
        JSON.stringify(Boolean(enabled))
      );

      window.dispatchEvent(
        new CustomEvent('biotrajectory_urine_mode_updated', {
          detail: Boolean(enabled)
        })
      );
    } catch (error) {
      console.error('Unable to update urine device mode:', error);
    }
  },

  /**
   * Get latest available readings.
   * Returns empty values instead of fabricated defaults.
   */
  getLatestVitals: () => {
    try {
      const saved = localStorage.getItem(
        STORAGE_KEY_LATEST_VITALS
      );

      if (!saved) return { ...EMPTY_VITALS };

      return {
        ...EMPTY_VITALS,
        ...JSON.parse(saved)
      };
    } catch (error) {
      console.error('Unable to load latest vitals:', error);
      return { ...EMPTY_VITALS };
    }
  }
};

export default BluetoothService;
