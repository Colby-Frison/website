import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import './ResumeViewer.css';

const RESUME_HREF = '/resume.pdf';
const RESUME_FILENAME = 'Colby_Frison_Resume.pdf';

/**
 * Compact resume entry point: opens a preview modal or downloads the PDF.
 * Modal is portaled to document.body so it isn't clipped by section transforms.
 */
const ResumeViewer = ({ className = '' }) => {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef(null);

  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open]);

  const modal =
    open &&
    createPortal(
      <div className="resume-modal-backdrop" onMouseDown={close}>
        <div
          className="resume-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="resume-modal-title"
          tabIndex={-1}
          ref={dialogRef}
          onMouseDown={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            className="resume-modal-close"
            onClick={close}
            aria-label="Close"
          >
            <CloseRoundedIcon fontSize="small" />
          </button>

          <div className="resume-modal-content">
            <div className="resume-modal-toolbar">
              <h2 id="resume-modal-title" className="resume-modal-title">
                Resume
              </h2>
              <a
                className="resume-modal-link"
                href={RESUME_HREF}
                download={RESUME_FILENAME}
              >
                Download PDF ↗
              </a>
            </div>
            <div className="resume-modal-frame-wrap">
              <iframe
                className="resume-modal-frame"
                src={`${RESUME_HREF}#view=FitH`}
                title="Colby Frison resume"
              />
            </div>
          </div>
        </div>
      </div>,
      document.body
    );

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
      {modal}
    </div>
  );
};

export default ResumeViewer;
