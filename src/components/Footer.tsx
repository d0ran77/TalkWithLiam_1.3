import React from 'react';
import { MapPin } from 'lucide-react';

interface FooterProps {
  onOpenPrivacy: () => void;
  onOpenHelpline: () => void;
  onOpenLocation?: () => void;
  onOpenOverview?: () => void;
  isDark?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPrivacy,
  onOpenHelpline,
  onOpenLocation,
  isDark = false,
}) => {
  return (
    <footer
      id="app-main-footer"
      className={`w-full flex flex-col sm:flex-row items-center justify-center sm:justify-between text-center sm:text-left gap-x-4 gap-y-2 py-2 md:py-2.5 px-2 md:px-3 z-30 select-none text-[10.5px] md:text-[11.5px] transition-colors duration-700 ${
        isDark ? 'text-stone-300' : 'text-[#18181B]'
      }`}
    >
      {/* Left (centered on mobile): Location & Find Me Parking Guide Trigger */}
      <div
        className={`flex items-center justify-center gap-2 font-normal transition-colors duration-700 ${
          isDark ? 'text-stone-400' : 'text-stone-600'
        }`}
      >
        <span>Willerby &amp; Online UK-Wide</span>
        <span className={isDark ? 'text-stone-700' : 'text-stone-300'}>•</span>
        {onOpenLocation ? (
          <button
            id="footer-find-me-parking-btn"
            onClick={onOpenLocation}
            className={`inline-flex items-center gap-1 opacity-80 hover:opacity-100 transition-all cursor-pointer hover:underline ${
              isDark ? 'hover:text-white' : 'hover:text-[#18181B]'
            }`}
            aria-label="Open Location, Parking and Commute Guide"
          >
            <MapPin className="w-3 h-3 text-stone-500" />
            <span>Find Me &amp; Parking</span>
          </button>
        ) : (
          <a
            id="footer-find-me-maps-link"
            href="https://www.google.com/maps/place/Talk+With+Liam/@53.7570981,-0.451291,17z/data=!3m1!4b1!4m6!3m5!1s0x4878c1bd4df063e7:0x6dd2a9885229174d!8m2!3d53.7570982!4d-0.4464255!16s%2Fg%2F11z1zsmj7z?entry=ttu&g_ep=EgoyMDI2MDgxOS4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1 opacity-80 hover:opacity-100 transition-all cursor-pointer hover:underline ${
              isDark ? 'hover:text-white' : 'hover:text-[#18181B]'
            }`}
            aria-label="Open Talk With Liam on Google Maps"
          >
            <MapPin className="w-3 h-3 text-stone-500" />
            <span>Find Me &amp; Parking</span>
          </a>
        )}
      </div>

      {/* Right (centered on mobile): Privacy Policy & Crisis Support */}
      <div
        className={`flex items-center justify-center gap-2.5 transition-colors duration-700 ${
          isDark ? 'text-stone-400' : 'text-[#71717A]'
        }`}
      >
        <button
          id="footer-privacy-policy-btn"
          onClick={onOpenPrivacy}
          className={`uppercase tracking-[0.08em] opacity-80 hover:opacity-100 transition-all cursor-pointer ${
            isDark ? 'hover:text-white' : 'hover:text-[#18181B]'
          }`}
          aria-label="View Privacy & Data Protection Policy"
        >
          Privacy Policy
        </button>

        <span className={isDark ? 'text-stone-700' : 'text-stone-300'}>•</span>

        <button
          id="footer-crisis-helpline-btn"
          onClick={onOpenHelpline}
          className={`uppercase tracking-[0.08em] opacity-80 hover:opacity-100 transition-all cursor-pointer ${
            isDark ? 'hover:text-white' : 'hover:text-[#18181B]'
          }`}
          aria-label="Confidential 24/7 Crisis Resources"
        >
          Confidential Support
        </button>
      </div>
    </footer>
  );
};


