import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import translations from '../i18n/translations';
import {
  CATEGORY_TRANSLATIONS,
  SUB_CATEGORY_TRANSLATIONS,
  DISEASE_TRANSLATIONS_HI
} from '../i18n/diseaseTranslations';

const LanguageContext = createContext(null);

const STORAGE_KEY = 'biotrajectory_language';

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'hi' || stored === 'en') {
        return stored;
      }
    } catch {
      // ignore
    }
    return 'en';
  });

  const setLanguage = useCallback((lang) => {
    const valid = lang === 'hi' ? 'hi' : 'en';
    setLanguageState(valid);
    try {
      localStorage.setItem(STORAGE_KEY, valid);
      document.documentElement.lang = valid;
    } catch {
      // ignore
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  }, [language, setLanguage]);

  useEffect(() => {
    try {
      document.documentElement.lang = language;
    } catch {
      // ignore
    }
  }, [language]);

  /**
   * Translate a dotted key path, e.g. t('nav.home') or t('explore.showingCount', { count: 35 })
   */
  const t = useCallback(
    (path, params = {}, fallback = '') => {
      if (!path) return '';

      const keys = path.split('.');
      let current = translations[language];

      for (const k of keys) {
        if (current && typeof current === 'object' && k in current) {
          current = current[k];
        } else {
          current = null;
          break;
        }
      }

      // Fallback to English if missing in current language
      if (current === null || current === undefined) {
        let fallbackVal = translations.en;
        for (const k of keys) {
          if (fallbackVal && typeof fallbackVal === 'object' && k in fallbackVal) {
            fallbackVal = fallbackVal[k];
          } else {
            fallbackVal = null;
            break;
          }
        }
        current = fallbackVal !== null && fallbackVal !== undefined ? fallbackVal : (fallback || path);
      }

      if (typeof current === 'string' && params && typeof params === 'object') {
        let formatted = current;
        for (const [paramKey, paramVal] of Object.entries(params)) {
          formatted = formatted.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
        }
        return formatted;
      }

      return typeof current === 'string' ? current : (fallback || path);
    },
    [language]
  );

  /**
   * Localizes a disease object for the active language.
   * Retains stable id, icons, URLs, and code keys while translating visible text.
   */
  const translateDisease = useCallback(
    (disease) => {
      if (!disease) return null;
      if (language !== 'hi') return disease;

      const hiData = DISEASE_TRANSLATIONS_HI[disease.id];
      if (!hiData) return disease;

      return {
        ...disease,
        name: hiData.name || disease.name,
        medicalName: hiData.medicalName || disease.medicalName,
        categoryGroup: hiData.categoryGroup || disease.categoryGroup,
        subCategory: hiData.subCategory || disease.subCategory,
        shortDescription: hiData.shortDescription || disease.shortDescription,
        whatIsIt: hiData.whatIsIt || disease.whatIsIt,
        whyDoesItHappen: hiData.whyDoesItHappen || disease.whyDoesItHappen,
        signsYouMayNotice: hiData.signsYouMayNotice || disease.signsYouMayNotice,
        howDoesItSpread: hiData.howDoesItSpread || disease.howDoesItSpread,
        whoIsAtRisk: hiData.whoIsAtRisk || disease.whoIsAtRisk,
        howToReduceRisk: hiData.howToReduceRisk || disease.howToReduceRisk,
        whenToSeeDoctor: hiData.whenToSeeDoctor || disease.whenToSeeDoctor,
        howCommonIsIt: hiData.howCommonIsIt || disease.howCommonIsIt,
        _isTranslatedHindi: true
      };
    },
    [language]
  );

  const translateCategory = useCallback(
    (category) => {
      if (language === 'hi' && CATEGORY_TRANSLATIONS[category]) {
        return CATEGORY_TRANSLATIONS[category];
      }
      return category;
    },
    [language]
  );

  const translateSubCategory = useCallback(
    (subCategory) => {
      if (language === 'hi' && SUB_CATEGORY_TRANSLATIONS[subCategory]) {
        return SUB_CATEGORY_TRANSLATIONS[subCategory];
      }
      return subCategory;
    },
    [language]
  );

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    isHindi: language === 'hi',
    isEnglish: language === 'en',
    t,
    translateDisease,
    translateCategory,
    translateSubCategory
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export default LanguageContext;
