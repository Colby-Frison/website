import React, { useEffect, useId, useRef, useState } from 'react';
import './ResumeViewer.css';

const RESUME_HREF = '/resume.pdf';
const RESUME_FILENAME = 'Colby_Frison_Resume.pdf';

/**
 * Compact resume entry point: opens a preview modal or downloads the PDF.
 */
const ResumeViewer = ({ className = '' }) => {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const closeRef = useRef(null);
  const previouslyFocused = useRef(null);

  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return undefined;

    previouslyFocused.current = document.activeElement;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event) => {
      if (event.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKeyDown);
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
      if (previouslyFocused.current instanceof HTMLElement) {
        previouslyFocused.current.focus();
      }
    };
  }, [open]);

  return (
    <div className={`resume-viewer ${className}`.trim()}>
      <button
        type="button"
        className="resume-viewer-trigger"
        onClick={() => setOpen(true)}
      >
        Resume
        <span className="resume-viewer-trigger-mark" aria-hidden="true">
          ↗
        </span>
      </button>
      <span className="resume-viewer-sep" aria-hidden="true">
        ·
      </span>
      <a
        className="resume-viewer-download"
        href={RESUME_HREF}
        download={RESUME_FILENAME}
      >
        Download
      </a>

      {open && (
        <div
          className="resume-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <div className="resume-modal-panel">
            <header className="resume-modal-header">
              <h2 id={titleId} className="resume-modal-title">
                Resume
              </h2>
              <div className="resume-modal-actions">
                <a
                  className="resume-modal-download"
                  href={RESUME_HREF}
                  download={RESUME_FILENAME}
                >
                  Download PDF
                </a>
                <button
                  ref={closeRef}
                  type="button"
                  className="resume-modal-close"
                  onClick={close}
                  aria-label="Close resume preview"
                >
                  Close
                </button>
              </div>
            </header>
            <div className="resume-modal-frame-wrap">
              <iframe
                className="resume-modal-frame"
                src={`${RESUME_HREF}#view=FitH`}
                title="Colby Frison resume"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeViewer;
