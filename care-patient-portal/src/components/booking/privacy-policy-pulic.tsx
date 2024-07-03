import React from 'react';
import { useTranslation } from 'react-i18next';

const AccessiblePDF: React.FC = () => {
  const pdfUrl = './CARELYO_PRIVACY_POLICY.pdf';
	const { t } = useTranslation(['default']);
  return (
    <div>
      <h2>{t('tr.download-accessible-pdf')}</h2>
      <a href={pdfUrl} download>
      </a>
    </div>
  );
};

export default AccessiblePDF;
