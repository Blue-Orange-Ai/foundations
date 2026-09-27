import { sanitizeHtml } from '@blue-orange-ai/foundations-core';

/**
 * How a branding logo given as SVG markup is shown.
 *
 * Inline SVG is sanitized first, so nothing in it can run — which also removes
 * `<style>` (its rules would apply to the whole page) and `<use>`. A logo that
 * depends on either would lose its colours or shapes inline, so it is shown as
 * an image instead: an SVG loaded as an image runs no script, fetches nothing,
 * and keeps its styles to itself. Inline stays the default for the rest, since
 * it lets the logo follow the surrounding text colour (`currentColor`).
 */
export type LogoMarkup = { html: string } | { src: string };

const NEEDS_IMAGE = /<(style|use)[\s>/]/i;

export const logoMarkup = (svg: string): LogoMarkup =>
    NEEDS_IMAGE.test(svg)
        ? { src: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg) }
        : { html: sanitizeHtml(svg) };
