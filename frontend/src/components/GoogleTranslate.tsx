'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'zh-CN', name: 'Chinese', nativeName: '中文 (简体)', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
];

interface GoogleTranslateProps {
  variant?: 'micro' | 'navbar' | 'mobile';
}

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: any;
  }
}

export const GoogleTranslate: React.FC<GoogleTranslateProps> = ({ variant = 'navbar' }) => {
  const [selectedLang, setSelectedLang] = useState<Language>(LANGUAGES[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Read active language from cookie on mount
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]*)/);
      if (match && match[1]) {
        const parts = match[1].split('/');
        const langCode = parts[parts.length - 1];
        const found = LANGUAGES.find((l) => l.code === langCode);
        if (found) {
          setSelectedLang(found);
        }
      }
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Initialize Google Translate Script
  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.googleTranslateElementInit = () => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            autoDisplay: false,
            layout: window.google.translate.TranslateElement.InlineLayout?.SIMPLE,
          },
          'google_translate_element'
        );
        setIsLoaded(true);
      }
    };

    const existingScript = document.getElementById('google-translate-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    } else if (window.google?.translate) {
      setIsLoaded(true);
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    setSelectedLang(lang);
    setIsOpen(false);

    if (typeof document !== 'undefined') {
      const cookieVal = lang.code === 'en' ? '' : `/auto/${lang.code}`;
      const expires = lang.code === 'en' ? 'Thu, 01 Jan 1970 00:00:00 UTC' : 'Fri, 31 Dec 9999 23:59:59 GMT';

      // Set cookie across domains and paths
      const hostname = window.location.hostname;
      const domainParts = hostname.split('.');
      const rootDomain = domainParts.length > 1 ? `.${domainParts.slice(-2).join('.')}` : hostname;

      document.cookie = `googtrans=${cookieVal}; expires=${expires}; path=/;`;
      document.cookie = `googtrans=${cookieVal}; expires=${expires}; path=/; domain=${rootDomain};`;
      document.cookie = `googtrans=${cookieVal}; expires=${expires}; path=/; domain=${hostname};`;

      // Try triggering select directly in Google Translate gadget iframe/select
      const selectElem = document.querySelector<HTMLSelectElement>('.goog-te-combo');
      if (selectElem) {
        selectElem.value = lang.code;
        selectElem.dispatchEvent(new Event('change'));
      } else {
        // Fallback: fast reload to apply cookie translation across all DOM elements
        window.location.reload();
      }
    }
  };

  // 1. Microbar variant (compact dark theme)
  if (variant === 'micro') {
    return (
      <div className="relative inline-block text-left" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-1.5 px-2 py-0.5 rounded text-forest-300 hover:text-white hover:bg-forest-900 transition-colors text-[10px] sm:text-xs font-semibold"
          aria-label="Change Language"
        >
          <Globe className="w-3 h-3 text-forest-400" />
          <span>{selectedLang.flag}</span>
          <span className="hidden sm:inline">{selectedLang.nativeName}</span>
          <ChevronDown className="w-2.5 h-2.5 opacity-70" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-1 w-48 origin-top-right bg-slate-900 border border-slate-700 rounded-xl shadow-xl z-50 p-1.5 divide-y divide-slate-800 text-xs animate-in fade-in zoom-in-95 max-h-64 overflow-y-auto">
            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-forest-400">
              Select Language / ভাষা
            </div>
            <div className="py-1 space-y-0.5">
              {LANGUAGES.map((lang) => {
                const isSelected = selectedLang.code === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors ${
                      isSelected
                        ? 'bg-forest-800/80 text-white font-bold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center space-x-2">
                      <span className="text-sm">{lang.flag}</span>
                      <span>{lang.nativeName}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({lang.name})</span>
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-forest-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. Mobile drawer variant (full width clean selector)
  if (variant === 'mobile') {
    return (
      <div className="space-y-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-forest-600" />
            <span>Select Language / ভাষা নির্বাচন</span>
          </span>
          <span className="text-[10px] font-bold text-forest-700 bg-forest-100 px-2 py-0.5 rounded-full">
            {selectedLang.flag} {selectedLang.name}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pt-1">
          {LANGUAGES.map((lang) => {
            const isSelected = selectedLang.code === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang)}
                className={`p-2 rounded-xl text-left text-xs font-semibold flex items-center justify-between border transition-all ${
                  isSelected
                    ? 'bg-forest-50 border-forest-300 text-forest-900 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center space-x-1.5 truncate">
                  <span>{lang.flag}</span>
                  <span className="truncate">{lang.nativeName}</span>
                </span>
                {isSelected && <Check className="w-3 h-3 text-forest-600 flex-shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // 3. Navbar default variant (light theme pill button)
  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Hidden placeholder for Google Translate element */}
      <div id="google_translate_element" className="hidden" />

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-white/90 backdrop-blur-md shadow-xs hover:bg-slate-50 transition-all text-xs font-semibold text-slate-700 hover:border-forest-300"
        aria-label="Language Selector"
      >
        <Globe className="w-3.5 h-3.5 text-forest-600" />
        <span className="text-sm">{selectedLang.flag}</span>
        <span className="font-bold text-slate-800">{selectedLang.nativeName}</span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 p-2 divide-y divide-slate-100 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-2.5 py-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-forest-700 bg-forest-50 px-2 py-0.5 rounded">
                GTranslate Multi-Language
              </span>
              <p className="text-[11px] text-slate-500 mt-1">
                Translate entire platform instantly:
              </p>
            </div>

            <div className="py-1 space-y-0.5 max-h-64 overflow-y-auto">
              {LANGUAGES.map((lang) => {
                const isSelected = selectedLang.code === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-all ${
                      isSelected
                        ? 'bg-forest-50 text-forest-900 font-bold border border-forest-200'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center space-x-2">
                      <span className="text-base">{lang.flag}</span>
                      <div>
                        <span className="block font-bold">{lang.nativeName}</span>
                        <span className="block text-[10px] text-slate-400">{lang.name}</span>
                      </div>
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-forest-600 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

