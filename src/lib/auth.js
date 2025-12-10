// Mock Auth for Stage 1

export function generateRandomString(length) {
  return "mock_random_string";
}

export function getSpotifyAuthUrl() {
  // Direct to dashboard for Stage 1 testing
  return "/dashboard";
}

export function saveTokens(accessToken, refreshToken, expiresIn) {
  // No-op
}

export function getAccessToken() {
  return "mock_token";
}

export function isAuthenticated() {
  // Always true for Stage 1 so user can see Dashboard
  return true;
}

export function logout() {
  // No-op
}