// @ts-ignore
import React from 'react';
import './ResponsiveDemoCard.css';

/**
 * Demo content whose CSS uses @media queries. Its layout and badge react to the
 * iframe viewport width, proving media queries evaluate against the frame — not
 * the browser window.
 */
export const ResponsiveDemoCard: React.FC = () => {
    return (
        <div className="rp-demo-card">
            <span className="rp-demo-card-badge"></span>
            <div className="rp-demo-grid">
                <div className="rp-demo-tile">One</div>
                <div className="rp-demo-tile">Two</div>
                <div className="rp-demo-tile">Three</div>
                <div className="rp-demo-tile">Four</div>
                <div className="rp-demo-tile">Five</div>
                <div className="rp-demo-tile">Six</div>
            </div>
        </div>
    );
};
