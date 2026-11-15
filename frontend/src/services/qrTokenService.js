/**
 * QR token service
 *
 * Secure QR sharing requires a validated backend or trusted Firebase-backed token
 * issuance flow. This frontend intentionally does not manufacture demo tokens.
 */

export class QrTokenService {
  static async validateToken(tokenString) {
    if (!tokenString || typeof tokenString !== 'string') {
      return {
        isValid: false,
        error: 'QR access is not available until a trusted token issuer is configured.'
      };
    }

    return {
      isValid: false,
      error: 'Secure QR-based patient sharing is not currently enabled for this account.'
    };
  }

  static async closeSession() {
    return {
      success: false,
      message: 'No active QR access session exists.'
    };
  }
}

export default QrTokenService;
