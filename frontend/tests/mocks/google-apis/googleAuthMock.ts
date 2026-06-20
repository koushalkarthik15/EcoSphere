/**
 * Google Identity OAuth 2.0 Token Issuer Simulator
 * Generates valid-looking mock tokens for offline Jest unit/integration tests.
 */

export interface MockGoogleProfile {
  sub: string;
  email: string;
  name: string;
  picture: string;
  email_verified: boolean;
}

export class GoogleAuthMock {
  /**
   * Generates a mock Google Identity ID token signature
   */
  static generateIdToken(email: string, name: string): string {
    const header = btoa(JSON.stringify({ alg: "RS256", kid: "mock_kid_123" }));
    const payload = btoa(
      JSON.stringify({
        iss: "https://accounts.google.com",
        sub: `google_mock_${email.split("@")[0]}`,
        email: email,
        email_verified: true,
        name: name,
        picture: `https://api.dicebear.com/7.x/bottts/svg?seed=${name}`,
        aud: "mock_google_client_id_placeholder",
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000)
      })
    );
    const signature = "mock_signature_bytes";
    
    return `${header}.${payload}.${signature}`;
  }

  /**
   * Safe offline token decoder to parse simulated details
   */
  static parseMockToken(token: string): MockGoogleProfile | null {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) return null;
      
      const payloadDecoded = JSON.parse(atob(parts[1]));
      return {
        sub: payloadDecoded.sub,
        email: payloadDecoded.email,
        name: payloadDecoded.name,
        picture: payloadDecoded.picture,
        email_verified: payloadDecoded.email_verified
      };
    } catch {
      return null;
    }
  }
}
