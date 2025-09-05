import React from 'react';
import { useTranslations } from '../hooks/useTranslations';

const RegulationPage: React.FC = () => {
  const { t } = useTranslations();

  return (
    <div className="container mx-auto px-4 py-8 animate-fadein min-h-[calc(100vh-200px)]">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-halal-green">{t('regulation.title')}</h1>
        <p className="text-lg text-gray-500 mt-2">{t('regulation.subtitle')}</p>
      </div>
      
      <div className="max-w-2xl mx-auto text-center p-8 bg-gray-100/50 rounded-2xl">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v11.494m-5.45-9.456l10.9 2.228m-10.9-2.228L5.45 4.545 2.25 5.454l3.2 1.964L12 6.253zM5.45 4.545L2.25 5.454 5.45 7.42 12 6.253 5.45 4.545zM18.55 19.455l3.2-1.964-3.2-1.964-6.55 1.33-3.2 1.964 3.2 1.964 6.55-1.33z" />
        </svg>
        <p className="mt-4 text-gray-600">{t('regulation.placeholder')}</p>
      </div>
    </div>
  );
};

export default RegulationPage;