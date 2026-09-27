import Cookies from "js-cookie";

/**
 * How the session token cookie is written. The clients read the token from
 * this cookie to send it as a bearer token, so it cannot be HttpOnly — which
 * makes these attributes the little protection it has: it is only sent over
 * HTTPS when the page itself is served over HTTPS, and it is not attached to
 * requests other sites start.
 */
export const authCookieAttributes = (expires?: Date): Cookies.CookieAttributes => ({
    ...(expires && !isNaN(expires.getTime()) ? {expires} : {}),
    path: "/",
    sameSite: "lax",
    secure: typeof window !== "undefined" && window.location.protocol === "https:",
});
