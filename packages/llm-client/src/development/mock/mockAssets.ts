// ---------------------------------------------------------------------------
// Inline assets for the mock server.
//
// Everything the fake agent "returns" as media is a data URI, so attachments and
// generated artefacts render without any storage service running locally.
// ---------------------------------------------------------------------------

const dataUri = (contentType: string, body: string): string =>
    `data:${contentType};charset=utf-8,${encodeURIComponent(body)}`;

const CHART_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
  <rect width="640" height="360" fill="#ffffff"/>
  <g stroke="#e6e9ee" stroke-width="1">
    <line x1="64" y1="40" x2="600" y2="40"/>
    <line x1="64" y1="100" x2="600" y2="100"/>
    <line x1="64" y1="160" x2="600" y2="160"/>
    <line x1="64" y1="220" x2="600" y2="220"/>
    <line x1="64" y1="280" x2="600" y2="280"/>
  </g>
  <polyline fill="none" stroke="#2f6df6" stroke-width="3"
    points="64,262 154,238 244,196 334,168 424,120 514,96 600,62"/>
  <polyline fill="none" stroke="#f6842f" stroke-width="3" stroke-dasharray="6 5"
    points="64,276 154,266 244,244 334,232 424,206 514,192 600,170"/>
  <g fill="#5b6472" font-family="Inter, system-ui, sans-serif" font-size="13">
    <text x="64" y="304">Q1</text>
    <text x="154" y="304">Q2</text>
    <text x="244" y="304">Q3</text>
    <text x="334" y="304">Q4</text>
    <text x="424" y="304">Q5</text>
    <text x="514" y="304">Q6</text>
    <text x="576" y="304">Q7</text>
    <text x="64" y="28" font-size="15" fill="#1c2430">Revenue vs. forecast (indexed)</text>
    <text x="64" y="336" fill="#2f6df6">— actual</text>
    <text x="140" y="336" fill="#f6842f">-- forecast</text>
  </g>
</svg>`;

const RESULTS_CSV = `region,quarter,revenue,growth
EMEA,Q6,1284000,0.11
AMER,Q6,2117500,0.08
APAC,Q6,864200,0.19
EMEA,Q7,1425000,0.11
AMER,Q7,2286900,0.08
APAC,Q7,1028400,0.19
`;

const SUMMARY_MD = `# Pipeline summary

- 3 regions reconciled
- 2 anomalies flagged for review
- Next run scheduled for Monday 06:00 UTC
`;

export const CHART_IMAGE_URL = dataUri('image/svg+xml', CHART_SVG);
export const RESULTS_CSV_URL = dataUri('text/csv', RESULTS_CSV);
export const SUMMARY_MD_URL = dataUri('text/markdown', SUMMARY_MD);

/** A 1x1-safe inline avatar/logo mark used as the welcome-screen branding. */
export const BRAND_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
  <rect x="1" y="1" width="26" height="26" rx="8" fill="#2f6df6"/>
  <circle cx="14" cy="14" r="6" fill="#f6842f"/>
</svg>`;
