/**
 * One path segment of an API URL, built from a value that came from data (an
 * id, a topic, a job name). Encoding it keeps `/`, `?` and `#` inside the
 * segment, so a value such as `../../users/delete/1` cannot turn a request into
 * one against a different endpoint, sent with the user's token.
 */
export const pathSegment = (value: unknown): string => {
    const text = String(value);
    // A segment that is only dots is read as "this" or "parent" directory
    // however it is encoded (`%2E%2E` included), and is never a real id.
    if (/^(\.|%2e)+$/i.test(text) && text.replace(/%2e/gi, ".").length <= 2) {
        throw new Error("Invalid path segment: " + JSON.stringify(text));
    }
    return encodeURIComponent(text);
};
