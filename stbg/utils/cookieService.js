/**
 * Cookie Service
 * Centralized cookie management for authentication
 */

/**
 * Set a cookie with name, value, and expiry
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 * @param {string} expiryDateTime - Expiry date time string (e.g., "2026-01-26 01:00:00+05:30")
 */
export const setCookie = (name, value, expiryDateTime) => {
  const expiryDate = new Date(expiryDateTime).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expiryDate}; path=/`;
};

/**
 * Set a cookie without expiry (session cookie)
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value
 */
export const setCookieWithoutExpiry = (name, value) => {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/`;
};

/**
 * Get a cookie value by name
 * @param {string} name - Cookie name
 * @returns {string|null} Cookie value or null if not found
 */
export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop().split(';').shift());
  }
  return null;
};

/**
 * Delete a cookie by name
 * @param {string} name - Cookie name
 */
export const deleteCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
};

/**
 * Check if user is fully logged in
 * @returns {boolean} True if both email and ActiveRole cookies exist
 */
export const isUserLoggedIn = () => {
  const email = getCookie('email');
  const activeRole = getCookie('ActiveRole');
  const accessToken = getCookie('access_token');
  return !!(email && activeRole && accessToken);
};

/**
 * Clear all authentication cookies
 */
export const clearAuthCookies = () => {
  const cookieNames = [
    'access_token',
    'email',
    'ActiveRole',
    'roles',
    'webApp_accessToken',
    'webApp_userEmail',
    'webApp_activeRole'
  ];
  
  cookieNames.forEach(name => deleteCookie(name));
};

/**
 * Set cookies for CUSTOMER, HOSPITAL, SUB_HOSPITAL authorities
 * @param {Object} response - Token API response
 * @param {string} email - User email
 * @param {string} authority - Authority type
 */
export const setSimpleAuthCookies = (response, email, authority) => {
  const { access_token, tokenExpiryDateTime } = response;
  
  setCookie('access_token', access_token, tokenExpiryDateTime);
  setCookie('email', email, tokenExpiryDateTime);
  setCookie('ActiveRole', authority, tokenExpiryDateTime);
};

/**
 * Set cookies for INSTITUTION authority
 * @param {Object} response - Token API response
 * @param {string} email - User email
 */
export const setInstitutionAuthCookies = (response, email) => {
  const { access_token, tokenExpiryDateTime } = response;
  
  // Plain cookies
  setCookie('access_token', access_token, tokenExpiryDateTime);
  setCookie('email', email, tokenExpiryDateTime);
  setCookie('ActiveRole', 'INSTITUTION', tokenExpiryDateTime);
  
  // Encrypted cookies (Base64)
  setCookie('webApp_accessToken', btoa(access_token), tokenExpiryDateTime);
  setCookie('webApp_activeRole', btoa('INSTITUTION'), tokenExpiryDateTime);
  setCookie('webApp_userEmail', btoa(email), tokenExpiryDateTime);
};

/**
 * Set Phase 1 cookies for EMPLOYEE (partial - after login)
 * @param {Object} response - Token API response
 * @param {string} email - User email
 */
export const setEmployeePhase1Cookies = (response, email) => {
  const { access_token, tokenExpiryDateTime } = response;
  
  // Plain cookies with expiry
  setCookie('access_token', access_token, tokenExpiryDateTime);
  setCookie('email', email, tokenExpiryDateTime);
  
  // Encrypted cookies with expiry
  setCookie('webApp_accessToken', btoa(access_token), tokenExpiryDateTime);
  setCookie('webApp_userEmail', btoa(email), tokenExpiryDateTime);
};

/**
 * Set Phase 2 cookies for EMPLOYEE (roles array)
 * @param {Array} roles - Array of role objects [{authority: "ROLE_NAME"}]
 * @param {string} tokenExpiryDateTime - Token expiry date time
 */
export const setEmployeePhase2Cookies = (roles, tokenExpiryDateTime) => {
  const roleNames = roles.map(r => r.authority).join(',');
  setCookie('roles', roleNames, tokenExpiryDateTime);
};

/**
 * Set Phase 3 cookies for EMPLOYEE (selected role)
 * @param {string} selectedRole - Selected role name
 * @param {string} tokenExpiryDateTime - Token expiry date time
 */
export const setEmployeePhase3Cookies = (selectedRole, tokenExpiryDateTime) => {
  setCookie('ActiveRole', selectedRole, tokenExpiryDateTime);
  setCookie('webApp_activeRole', btoa(selectedRole), tokenExpiryDateTime);
};

/**
 * Set all EMPLOYEE cookies at once (for single role scenario)
 * @param {Object} response - Token API response
 * @param {string} email - User email
 * @param {Array} roles - Array of role objects
 * @param {string} selectedRole - The single role to set
 */
export const setEmployeeAllCookies = (response, email, roles, selectedRole) => {
  const { access_token, tokenExpiryDateTime } = response;
  
  // Phase 1: Plain with expiry + Encrypted with expiry
  setCookie('access_token', access_token, tokenExpiryDateTime);
  setCookie('email', email, tokenExpiryDateTime);
  setCookie('webApp_accessToken', btoa(access_token), tokenExpiryDateTime);
  setCookie('webApp_userEmail', btoa(email), tokenExpiryDateTime);
  
  // Phase 2: Roles
  const roleNames = roles.map(r => r.authority).join(',');
  setCookie('roles', roleNames, tokenExpiryDateTime);
  
  // Phase 3: Selected role
  setCookie('ActiveRole', selectedRole, tokenExpiryDateTime);
  setCookie('webApp_activeRole', btoa(selectedRole), tokenExpiryDateTime);
};
