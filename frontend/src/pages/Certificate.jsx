import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { FiAward, FiBookOpen, FiDownload, FiLock } from 'react-icons/fi';
import EmptyState from '../components/ui/EmptyState.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';
import { getCertificate } from '../services/certificateService';

function Certificate() {
  const { courseId } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadCertificate() {
      try {
        setCertificate(await getCertificate(courseId));
      } catch (err) {
        setError('Unable to load certificate details.');
      } finally {
        setLoading(false);
      }
    }

    loadCertificate();
  }, [courseId]);

  function downloadPdf() {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const center = pageWidth / 2;

    doc.setFillColor(248, 250, 252);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    doc.setDrawColor(15, 118, 110);
    doc.setLineWidth(5);
    doc.rect(34, 34, pageWidth - 68, pageHeight - 68);
    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(1.5);
    doc.rect(52, 52, pageWidth - 104, pageHeight - 104);

    doc.setTextColor(15, 118, 110);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.text('SMARTED Learning Platform', center, 110, { align: 'center' });

    doc.setTextColor(17, 24, 39);
    doc.setFontSize(42);
    doc.text('Certificate of Completion', center, 180, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(16);
    doc.text('This certificate is proudly presented to', center, 245, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(34);
    doc.text(certificate.studentName, center, 305, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(16);
    doc.text('for successfully completing', center, 360, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.text(certificate.courseName, center, 410, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.text(`Completion Date: ${new Date(certificate.completionDate).toLocaleDateString()}`, center, 475, { align: 'center' });
    doc.text(`Topics Completed: ${certificate.completedTopics}/${certificate.totalTopics}`, center, 505, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(37, 99, 235);
    doc.text('Academic Project Certificate', center, 555, { align: 'center' });

    doc.save(`${certificate.courseName.replaceAll(' ', '-')}-certificate.pdf`);
  }

  if (loading) {
    return <LoadingSpinner label="Loading certificate..." />;
  }

  if (error) {
    return <EmptyState icon={<FiAward />} title="Certificate unavailable" message={error} />;
  }

  if (!certificate.eligible) {
    return (
      <div className="page-stack">
        <section className="hero-banner compact">
          <div>
            <span className="eyebrow">Certificate locked</span>
            <h1>{certificate.courseName}</h1>
            <p>{certificate.message}</p>
            <div className="progress-summary">
              <div>
                <strong>{certificate.progressPercentage}%</strong>
                <span>{certificate.completedTopics} of {certificate.totalTopics} topics completed</span>
              </div>
              <div className="progress-track">
                <span style={{ width: `${certificate.progressPercentage}%` }} />
              </div>
            </div>
            <div className="hero-actions">
              <Link className="primary-link" to={`/courses/${courseId}`}>
                <FiBookOpen aria-hidden="true" />
                Continue Course
              </Link>
            </div>
          </div>
        </section>
        <EmptyState icon={<FiLock />} title="Complete all topics first" message="Your certificate will unlock automatically when course progress reaches 100%." />
      </div>
    );
  }

  return (
    <div className="page-stack">
      <section className="hero-banner compact">
        <div>
          <span className="eyebrow">Certificate unlocked</span>
          <h1>Course Completion Certificate</h1>
          <p>{certificate.message}</p>
          <div className="hero-actions">
            <button className="primary-button" type="button" onClick={downloadPdf}>
              <FiDownload aria-hidden="true" />
              Download PDF
            </button>
            <Link className="secondary-link" to={`/courses/${courseId}`}>Back to Course</Link>
          </div>
        </div>
      </section>

      <section className="certificate-preview panel">
        <div className="certificate-border">
          <span className="eyebrow">SMARTED Learning Platform</span>
          <h2>Certificate of Completion</h2>
          <p>This certificate is proudly presented to</p>
          <strong>{certificate.studentName}</strong>
          <p>for successfully completing</p>
          <h3>{certificate.courseName}</h3>
          <div className="certificate-meta">
            <span>Completion Date: {new Date(certificate.completionDate).toLocaleDateString()}</span>
            <span>Topics Completed: {certificate.completedTopics}/{certificate.totalTopics}</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Certificate;
