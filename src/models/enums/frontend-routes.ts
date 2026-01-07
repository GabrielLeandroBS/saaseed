/**
 * Frontend routes enum - Contains relative paths (without locale prefix)
 *
 * Note: The proxy middleware automatically redirects routes without locale to `/${locale}/route`.
 * Just use the route directly in links - the proxy will handle adding the locale automatically.
 *
 * @example
 * // In a Link component
 * <Link href={`/${FrontendRoutesEnum.DASHBOARD}`}>Dashboard</Link>
 * // The proxy will automatically redirect to /pt/dashboard or /en/dashboard
 *
 * // For home route
 * <Link href="/">Home</Link>
 * // The proxy will automatically redirect to /pt or /en
 */
export enum FrontendRoutesEnum {
  HOME = "/",
  DASHBOARD = "dashboard",
  SIGN_IN = "sign-in",
  SIGN_UP = "sign-up",
  CHECK_EMAIL = "check-email",
}
