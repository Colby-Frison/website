import React from 'react';
import './PageAtmosphere.css';

/**
 * Soft paper wash + faint corner watermark slots for interior pages.
 * pointer-events: none — decorative only.
 *
 * Watermark <img> elements are kept in the DOM but currently hidden
 * (see DEV_LOG.md). Swap src when a dedicated atmosphere asset is ready.
 */
const PageAtmosphere = ({ showSecondary = true }) => {
  return (
    <div className="page-atmosphere" aria-hidden="true">
      <div className="page-atmosphere__wash" />
      <div className="page-atmosphere__grain" />
      {/* DEV: watermark placeholder — hidden until replacement asset; see DEV_LOG.md */}
      <img
        src="/bonsai.png"
        alt=""
        className="page-atmosphere__watermark page-atmosphere__watermark--br page-atmosphere__watermark--hidden"
        data-dev-placeholder="atmosphere-watermark"
      />
      {showSecondary && (
        <img
          src="/bonsai.png"
          alt=""
          className="page-atmosphere__watermark page-atmosphere__watermark--tl page-atmosphere__watermark--hidden"
          data-dev-placeholder="atmosphere-watermark"
        />
      )}
    </div>
  );
};

export default PageAtmosphere;
