/**
 * BioTrajectory WebRTC Consultation Service Adapter
 * 
 * Provides signaling stubs, media stream management, and mock video feed
 * for telemedicine consultations between patients and physicians.
 */

export class WebRTCService {
  constructor() {
    this.localStream = null;
    this.remoteStream = null;
    this.peerConnection = null;
    this.isCallActive = false;
  }

  async startUserMedia() {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Attempt actual media if allowed, else fallback cleanly
        this.localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        return { success: true, stream: this.localStream };
      }
    } catch (err) {
      console.warn('Real webcam access unavailable or blocked, activating clinical mock feed:', err);
    }
    return { success: false, isMock: true };
  }

  stopUserMedia() {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
      this.localStream = null;
    }
    this.isCallActive = false;
  }
}

export const webrtcService = new WebRTCService();
