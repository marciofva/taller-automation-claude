### Test Coverage: Login UI (SauceDemo)

### Notes
- Target site: https://www.saucedemo.com/
- Accepted usernames (to cover): `standard_user`, `locked_out_user`, `problem_user`, `performance_glitch_user` (password for valid users: `secret_sauce`).

### TC-001 Successful login (happy path)
**Category**: Happy path
**Priority**: P0
**Preconditions**: Browser opened at login page; network stable
**User**: `standard_user`
**Steps**:
1. Enter username `standard_user` and password `secret_sauce`.
2. Click `Login`.
**Expected Results**: User is redirected to inventory page; products list visible; no error message.
**Suggested Layer**: E2E

### TC-002 Locked out user cannot login (negative)
**Category**: Negative/Error
**Priority**: P0
**Preconditions**: Browser at login page
**User**: `locked_out_user`
**Steps**:
1. Enter username `locked_out_user` and password `secret_sauce`.
2. Click `Login`.
**Expected Results**: Login is rejected and a clear locked-out error message is shown; no redirect to inventory.
**Suggested Layer**: E2E

### TC-003 Problem user UI anomalies (edge case)
**Category**: Edge Case
**Priority**: P1
**Preconditions**: Browser at login page
**User**: `problem_user`
**Steps**:
1. Login as `problem_user` / `secret_sauce`.
2. Observe inventory page for missing/broken images, misaligned elements, or JS errors in console.
**Expected Results**: Document UI anomalies; verify application still functional or note broken flows.
**Suggested Layer**: E2E, Component

### TC-004 Performance glitch user (performance)
**Category**: Edge Case
**Priority**: P1
**Preconditions**: Browser at login page; tooling to measure timings
**User**: `performance_glitch_user`
**Steps**:
1. Login as `performance_glitch_user` / `secret_sauce`.
2. Measure login response time and inventory load time.
**Expected Results**: Identify slow responses; quantify timeouts or UX-impacting delays.
**Suggested Layer**: E2E, Performance

### TC-005 Missing username (validation)
**Category**: Negative/Error
**Priority**: P0
**Preconditions**: Login page open
**User**: All
**Steps**:
1. Leave username blank, enter any password, click `Login`.
**Expected Results**: Inline validation or error message appears; no network call with empty username (or handled server-side consistently).
**Suggested Layer**: E2E, API

### TC-006 Missing password (validation)
**Category**: Negative/Error
**Priority**: P0
**Preconditions**: Login page open
**User**: All
**Steps**:
1. Enter valid username, leave password blank, click `Login`.
**Expected Results**: Validation or error message prevents login.
**Suggested Layer**: E2E, API

### TC-007 Invalid credentials (security/negative)
**Category**: Security
**Priority**: P0
**Preconditions**: Login page open
**User**: All
**Steps**:
1. Enter `standard_user` with wrong password `wrongpass`.
2. Click `Login`.
**Expected Results**: Generic authentication failed message; do not leak whether username exists; status code for API is appropriate (401/403).
**Suggested Layer**: API, E2E

### TC-008 SQL injection attempt in username (security)
**Category**: Security
**Priority**: P1
**Preconditions**: Login page open, API monitoring available
**User**: Attacker
**Steps**:
1. Enter payload like `admin' OR '1'='1` in username and `secret_sauce` as password.
2. Click `Login`.
**Expected Results**: Input treated as data; no bypass of auth; no DB errors returned to UI; server returns auth failure.
**Suggested Layer**: API, Security

### TC-009 XSS attempt in username/password (security)
**Category**: Security
**Priority**: P1
**Preconditions**: Login page open, console/DOM inspection
**User**: Attacker
**Steps**:
1. Enter `<script>alert(1)</script>` in username and a password, click `Login`.
**Expected Results**: Input sanitized/encoded; script not executed; no DOM injection.
**Suggested Layer**: E2E, Security

### TC-010 Very long input (edge case)
**Category**: Edge Case
**Priority**: P2
**Preconditions**: Login page open
**User**: All
**Steps**:
1. Enter 5000-character username and 5000-character password.
2. Submit login.
**Expected Results**: App gracefully handles long input (client or server validation), no crashes, no stack traces leaked.
**Suggested Layer**: E2E, API

### TC-011 Unicode and emoji in credentials (edge case)
**Category**: Edge Case
**Priority**: P2
**Preconditions**: Login page open
**User**: All
**Steps**:
1. Enter username with Unicode (e.g., `用户😊`) and password with Unicode.
2. Submit login.
**Expected Results**: Input handled safely; no encoding errors; appropriate auth failure or success if expected.
**Suggested Layer**: E2E, API

### TC-012 Concurrent login attempts (security/performance)
**Category**: Security
**Priority**: P2
**Preconditions**: Automation tool able to fire parallel requests
**User**: `standard_user`
**Steps**:
1. Fire 20 parallel login requests with correct credentials.
2. Observe server behavior, response consistency, and rate limiting.
**Expected Results**: Server handles concurrent auth without inconsistent state; no account corruption; throttling applied if required.
**Suggested Layer**: API, Performance

### TC-013 Session cookie tampering (security)
**Category**: Security
**Priority**: P1
**Preconditions**: Able to intercept and modify cookies
**User**: `standard_user`
**Steps**:
1. Login successfully, capture auth/session cookie.
2. Modify cookie value and reload inventory page.
**Expected Results**: Tampered cookie rejected; user redirected to login; no privilege escalation.
**Suggested Layer**: API, Security

### TC-014 Logout invalidates session (security)
**Category**: Security
**Priority**: P1
**Preconditions**: Logged in as `standard_user`
**User**: `standard_user`
**Steps**:
1. Login, then click `Logout`.
2. Attempt to navigate back to inventory without re-login.
**Expected Results**: Access denied; session cleared; browser back does not restore authenticated state.
**Suggested Layer**: E2E, API

### TC-015 Error message content leakage (security/negative)
**Category**: Security
**Priority**: P1
**Preconditions**: Login page open
**User**: All
**Steps**:
1. Trigger auth failure (invalid password) and inspect error message and any network responses.
**Expected Results**: Error messages do not reveal internal details (stack traces, DB errors) or which part of credentials was correct.
**Suggested Layer**: E2E, API

### TC-016 API endpoint fuzzing for auth (security)
**Category**: Security
**Priority**: P1
**Preconditions**: Access to API endpoints used by login UI (interceptor)
**User**: Attacker
**Steps**:
1. Enumerate and fuzz login-related API endpoints with various payloads (malformed JSON, missing fields, unexpected content-types).
**Expected Results**: API responds gracefully with proper status codes; no crashes or sensitive data leaks.
**Suggested Layer**: API, Security

### TC-017 Remember-me / persistent auth check (edge case)
**Category**: Edge Case
**Priority**: P2
**Preconditions**: If app has persistent login controls
**User**: `standard_user`
**Steps**:
1. Login and check any persistent session toggles; close and reopen browser.
2. Verify whether session persisted and if it follows expected security rules.
**Expected Results**: Persistence behavior documented and secure; cookies have appropriate flags.
**Suggested Layer**: E2E, Security

### TC-018 Accessibility: login form keyboard & screen reader (component)
**Category**: Component
**Priority**: P2
**Preconditions**: Accessibility tool / screen reader available
**User**: All
**Steps**:
1. Navigate the login form via keyboard only.
2. Use a screen reader to read labels and error messages.
**Expected Results**: Logical tab order, labels associated with inputs, errors announced.
**Suggested Layer**: Component, E2E

### TC-019 Brute-force protection (security)
**Category**: Security
**Priority**: P1
**Preconditions**: Test account available
**User**: Attacker
**Steps**:
1. Send repeated incorrect password attempts for same username.
2. Observe whether account lockout, CAPTCHA, rate-limiting or throttling is applied.
**Expected Results**: Protective controls present or acceptable risk documented.
**Suggested Layer**: API, Security

### TC-020 Transport security: login over HTTP vs HTTPS (security)
**Category**: Security
**Priority**: P0
**Preconditions**: Network tools to intercept traffic
**User**: All
**Steps**:
1. Observe whether login requests are sent over HTTPS; attempt to force HTTP if possible.
**Expected Results**: Credentials transmitted only over TLS; no sensitive data sent in clear-text.
**Suggested Layer**: E2E, Security

---
Generated covering login UI and API-related risks for the accepted Saucedemo users.
# Test Coverage - Login UI

## Overview
This document covers core login UI scenarios for the Sauce Demo authentication flow, including functional, edge case, and security-focused checks. It explicitly verifies all accepted Sauce Demo users displayed in the login page footer: `standard_user`, `locked_out_user`, `problem_user`, and `performance_glitch_user`.

### TC-001 standard_user login succeeds
**Category**: Happy path
**Priority**: P0
**Preconditions**: User is on the login page with valid credentials available.
**Steps**:
1. Open the login page.
2. Enter a valid username and password.
3. Click the login button.
4. Observe navigation or success state.
**Expected Results**:
- The user is authenticated and redirected to the expected post-login page.
- No error messages are shown.
- The login button is disabled or shows loading during submission.
**Suggested Layer**: E2E

### TC-002 Invalid credentials show clear error
**Category**: Negative/Error
**Priority**: P0
**Preconditions**: User is on the login page.
**Steps**:
1. Open the login page.
2. Enter an invalid username or password.
3. Click the login button.
4. Observe the response.
**Expected Results**:
- A clear, user-friendly error message appears.
- The login page remains on screen without redirect.
- No sensitive details or stack traces are displayed.
**Suggested Layer**: E2E

### TC-003 Empty fields are validated client-side
**Category**: Edge Case
**Priority**: P1
**Preconditions**: User is on the login page.
**Steps**:
1. Leave the username or password field empty.
2. Attempt to submit the form.
3. Observe validation feedback.
**Expected Results**:
- Required field validation prevents submission.
- The empty field(s) are highlighted with a relevant message.
- No request is sent to the server when client-side validation fails.
**Suggested Layer**: E2E

### TC-004 Login API response is secure and consistent
**Category**: Security
**Priority**: P0
**Preconditions**: API access or network inspection available.
**Steps**:
1. Submit valid login credentials to the login API endpoint.
2. Submit invalid credentials to the same endpoint.
3. Review the response bodies and headers.
**Expected Results**:
- Successful login returns an access token or session cookie without exposing secrets.
- Failed login returns a safe error code and message.
- Responses do not leak server/framework details, stack traces, or user enumeration data.
**Suggested Layer**: API

### TC-005 Rate limiting or brute-force protection is enforced
**Category**: Security
**Priority**: P0
**Preconditions**: User can repeat login attempts.
**Steps**:
1. Attempt login with invalid credentials repeatedly.
2. Observe the response after a high number of attempts.
3. Verify any delay, lockout, or captcha behavior.
**Expected Results**:
- The system throttles or blocks repeated invalid attempts.
- The user receives a generic message without confirming whether username exists.
- The UI remains responsive and does not reveal sensitive timing differences.
**Suggested Layer**: API

### TC-006 SQL injection and script injection in login inputs
**Category**: Security
**Priority**: P0
**Preconditions**: User is on the login page.
**Steps**:
1. Enter SQL-like payloads into the username and password fields (for example: `admin' OR '1'='1`).
2. Enter script-like payloads into the fields (for example: `<script>alert(1)</script>`).
3. Submit the login form.
**Expected Results**:
- The application rejects unsafe payloads without executing code.
- The response is safe, and no script is reflected/executed in the UI.
- No sensitive error or internal exception is exposed.
**Suggested Layer**: E2E / API

### TC-007 Login UI resists XSS via form error messages
**Category**: Security
**Priority**: P0
**Preconditions**: User is on the login page.
**Steps**:
1. Enter a username containing HTML or script-like characters.
2. Enter an invalid password.
3. Submit the form.
4. Inspect rendered error and page content.
**Expected Results**:
- The error message is sanitized and does not execute injected HTML.
- The page remains stable with safe rendering.
- No alert boxes, script execution, or DOM corruption occurs.
**Suggested Layer**: E2E

### TC-008 Password field masking and copy protections
**Category**: Edge Case
**Priority**: P2
**Preconditions**: User is on the login page.
**Steps**:
1. Observe the password input field.
2. Ensure entered characters are masked.
3. Attempt to copy and paste from the password field if allowed.
**Expected Results**:
- Password characters are concealed by default.
- The field does not expose the password in plain text or as a tooltip.
- Copy behavior does not inadvertently expose the password to other applications.
**Suggested Layer**: E2E

### TC-009 Session token is handled securely in the browser
**Category**: Security
**Priority**: P0
**Preconditions**: User can log in successfully.
**Steps**:
1. Log in with valid credentials.
2. Inspect the authentication token or cookie storage.
3. Verify token attributes and storage method.
**Expected Results**:
- Authentication tokens or cookies are marked secure and HttpOnly when applicable.
- Tokens are not stored in insecure browser storage such as localStorage if cookies are used.
- The UI does not expose token content in page text or logs.
**Suggested Layer**: E2E / API

### TC-010 Sauce Demo locked_out_user is blocked correctly
**Category**: Negative/Error
**Priority**: P0
**Preconditions**: User is on the login page with the `locked_out_user` account.
**Steps**:
1. Open the login page.
2. Enter `locked_out_user` and the correct password.
3. Submit the login form.
4. Observe the displayed response.
**Expected Results**:
- The login fails with a clear locked-out or account-blocked message.
- The user remains on the login page.
- No successful session is created and no sensitive details are exposed.
**Suggested Layer**: E2E

### TC-011 Sauce Demo problem_user reveals UI or data inconsistencies safely
**Category**: Edge Case
**Priority**: P1
**Preconditions**: User is on the login page with the `problem_user` account.
**Steps**:
1. Open the login page.
2. Enter `problem_user` and the correct password.
3. Submit the login form.
4. Verify the post-login experience.
**Expected Results**:
- The user can log in if the account is valid.
- Any UI anomalies or data corruption are contained and do not compromise functionality.
- The application does not reveal sensitive error information.
**Suggested Layer**: E2E

### TC-012 Sauce Demo performance_glitch_user login remains stable
**Category**: Edge Case
**Priority**: P1
**Preconditions**: User is on the login page with the `performance_glitch_user` account.
**Steps**:
1. Open the login page.
2. Enter `performance_glitch_user` and the correct password.
3. Submit the login form.
4. Observe load timing and page transitions.
**Expected Results**:
- The login succeeds despite slow or delayed responses.
- Loading feedback is shown and the UI does not allow duplicate submissions.
- The user is either redirected successfully or given a safe timeout/error message.
**Suggested Layer**: E2E

### TC-013 Login page handles slow and failing network conditions
**Category**: Edge Case
**Priority**: P1
**Preconditions**: User is on the login page with network throttling or interruption available.
**Steps**:
1. Submit valid credentials under slow network conditions.
2. Observe loading indicators and timeout behavior.
3. Simulate network failure while the login request is pending.
**Expected Results**:
- The UI shows a loading state while waiting.
- The user receives a clear failure message if the request times out or fails.
- The login form returns to a usable state without duplicate submissions.
**Suggested Layer**: E2E

### TC-014 Invalid redirect or open redirect protection
**Category**: Security
**Priority**: P1
**Preconditions**: User can reach the login page with a redirect parameter.
**Steps**:
1. Open the login page with a redirect query parameter pointing to an external domain.
2. Log in with valid credentials.
3. Observe the post-login navigation.
**Expected Results**:
- The application ignores unsafe external redirects or validates allowed targets.
- The user is redirected only to safe application pages.
- No open redirect to external domains occurs.
**Suggested Layer**: API / E2E

### TC-015 Remember me or auto-login behavior is secure
**Category**: Edge Case
**Priority**: P2
**Preconditions**: The login page includes a remember-me or stay-signed-in option.
**Steps**:
1. Enable the option and log in.
2. Close and reopen the browser or reload the page.
3. Observe whether the session persists and how it is represented.
**Expected Results**:
- The session persists only if the feature is explicitly selected.
- The persisted state does not expose credentials.
- The user can sign out fully and revoke the persistent session.
**Suggested Layer**: E2E
