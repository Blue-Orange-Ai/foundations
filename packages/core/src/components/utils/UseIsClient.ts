import {useSyncExternalStore} from "react";

// Sanitizing markup, or parsing a legacy HTML document, needs a DOM. On the
// server there is none, so what is rendered there must be something the
// client can render identically while it hydrates — otherwise React keeps the
// server's markup (for innerHTML) or throws the render away. This reports
// false on the server and during hydration, then true: the client re-renders
// with the real content straight after. An app rendered only in the browser
// sees true from the first render, so nothing flashes.

const subscribe = () => () => {};

export const useIsClient = (): boolean =>
	useSyncExternalStore(subscribe, () => true, () => false);
