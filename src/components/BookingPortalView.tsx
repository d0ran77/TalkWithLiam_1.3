import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Video,
  MapPin,
  ShieldCheck,
  Info,
  Calendar,
  Mail,
} from 'lucide-react';
import { PRACTICAL_DETAILS } from '../data/content.ts';

interface BookingPortalViewProps {
  onGoToContact?: () => void;
  onGoToSlides?: () => void;
}

export const BookingPortalView: React.FC<BookingPortalViewProps> = ({
  onGoToContact,
}) => {
  const [selectedType, setSelectedType] = useState<'in-person' | 'online'>('in-person');

  const schedules = {
    'in-person': {
      title: 'Face to Face (Willerby Practice)',
      location: 'The Willerby Practice, 2nd Floor, Willerby, East Yorkshire',
      description: 'In-person psychotherapeutic sessions in a quiet, dedicated clinic setting with free client parking.',
      embedUrl:
        'https://calendar.google.com/calendar/appointments/schedules/AcZssZ3X_xoqMpLFn7BoT6ZAwAGKj8lsFMjidouO_ZOJxhphXSmxFnYP0L9aO_R8m6Aut4ufzPbjIUnu',
      directUrl: 'https://calendar.app.google/YN8KqPKyVR1DTccw9',
      duration: '50 mins',
      tag: 'Clinic Room',
    },
    online: {
      title: 'Online (Google Meet)',
      location: 'Encrypted Remote Video Consultation (UK-Wide)',
      description: 'Secure, encrypted online sessions with automatic calendar invitation and Google Meet link.',
      embedUrl:
        'https://calendar.google.com/calendar/appointments/schedules/AcZssZ0-Lz8_d_2WW70SVO6WgHZ_wKRAWQtFaYGh3GQPR-HIbhsAdzjsEcmTnDbxs5SelVTH1ABUcNNo',
      directUrl: 'https://calendar.app.google/UXw1B1sGMN6TZ6DZ6',
      duration: '50 mins',
      tag: 'Remote Video',
    },
  };

  const currentSchedule = schedules[selectedType];

  return (
    <div
      id="booking-portal-content"
      className="h-full flex flex-col justify-between select-text overflow-y-auto custom-scrollbar pr-0.5 sm:pr-3 pb-4 sm:pb-8 space-y-6 sm:space-y-8 text-left"
    >
      {/* Top Header Region (Identical to slide headers) */}
      <div className="pt-0.5 border-b border-stone-200/80 pb-3 sm:pb-5 shrink-0">
        <div className="flex flex-wrap items-center space-x-2 mb-1.5 sm:mb-2">
          <span className="font-mono text-[9.5px] sm:text-[10px] md:text-[11px] tracking-widest text-[#71717A] font-semibold">
            [ PRACTICE DIARY ]
          </span>
          <span className="w-1 h-1 rounded-full bg-stone-300"></span>
          <span className="text-[9.5px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.16em] font-semibold text-[#71717A]">
            APPOINTMENTS
          </span>
          <span className="w-1 h-1 rounded-full bg-stone-300"></span>
          <span className="inline-flex items-center gap-1 font-mono text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full font-medium bg-emerald-100/90 text-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            Live Google Calendar Sync
          </span>
        </div>

        <h1 className="text-[20px] sm:text-[26px] md:text-[32px] lg:text-[36px] leading-[1.1] font-medium tracking-[0.03em] sm:tracking-[0.04em] text-[#18181B] uppercase">
          APPOINTMENT SCHEDULE
        </h1>
      </div>

      {/* Main Editorial Flow */}
      <div className="space-y-5 sm:space-y-6 text-left">
        {/* Intro Subtitle / Lede */}
        <div className="space-y-2">
          <h2 className="text-[14.5px] sm:text-[18px] md:text-[20px] leading-[1.35] font-normal tracking-tight text-[#18181B] uppercase">
            SELECT YOUR PREFERRED SETTING TO <span className="italic font-serif normal-case">book your session directly</span>.
          </h2>
          <p className="text-stone-600 text-[13px] sm:text-[15px] leading-relaxed">
            Choose between in-person sessions at The Willerby Practice clinic or remote encrypted video consultations via Google Meet.
          </p>
        </div>

        {/* Step 1: Location & Medium Choice */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono tracking-wider text-stone-500 font-semibold">
              Step 1: Choose Setting / Format
            </span>
            <span className="text-xs font-mono text-stone-400">
              {selectedType === 'in-person' ? 'Willerby Clinic' : 'Google Meet Video'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            {/* Face to Face */}
            <button
              type="button"
              onClick={() => setSelectedType('in-person')}
              className={`p-4 sm:p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                selectedType === 'in-person'
                  ? 'bg-white border-stone-900 shadow-md ring-2 ring-stone-900/10'
                  : 'bg-white/80 border-stone-200/90 hover:border-stone-400 hover:bg-white shadow-2xs'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        selectedType === 'in-person'
                          ? 'bg-stone-900 text-white'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-sm sm:text-base text-stone-900">
                      Face to Face
                    </span>
                  </div>
                  <span className="font-mono text-xs font-medium px-2.5 py-1 rounded-full bg-stone-100 text-stone-700">
                    50 mins
                  </span>
                </div>
                <p className="text-xs sm:text-[13px] text-stone-600 leading-relaxed">
                  In-person psychotherapeutic sessions at The Willerby Practice in East Yorkshire.
                </p>
              </div>
              <div className="pt-2.5 mt-2.5 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 font-mono">
                <span>Willerby, HU10</span>
                <span className={selectedType === 'in-person' ? 'text-stone-900 font-semibold' : ''}>
                  {selectedType === 'in-person' ? '● Active Setting' : 'Select'}
                </span>
              </div>
            </button>

            {/* Online Video */}
            <button
              type="button"
              onClick={() => setSelectedType('online')}
              className={`p-4 sm:p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                selectedType === 'online'
                  ? 'bg-white border-stone-900 shadow-md ring-2 ring-stone-900/10'
                  : 'bg-white/80 border-stone-200/90 hover:border-stone-400 hover:bg-white shadow-2xs'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        selectedType === 'online'
                          ? 'bg-stone-900 text-white'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      <Video className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-sm sm:text-base text-stone-900">
                      Online (Google Meet)
                    </span>
                  </div>
                  <span className="font-mono text-xs font-medium px-2.5 py-1 rounded-full bg-stone-100 text-stone-700">
                    50 mins
                  </span>
                </div>
                <p className="text-xs sm:text-[13px] text-stone-600 leading-relaxed">
                  Encrypted remote video consultation with automatic calendar invitation and Google Meet link.
                </p>
              </div>
              <div className="pt-2.5 mt-2.5 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 font-mono">
                <span>UK-Wide Video</span>
                <span className={selectedType === 'online' ? 'text-stone-900 font-semibold' : ''}>
                  {selectedType === 'online' ? '● Active Setting' : 'Select'}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Step 2: Live Embedded Google Calendar Appointment Schedule taking full room */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono tracking-wider text-stone-500 font-semibold">
              Step 2: Choose Date &amp; Time from Live Diary
            </span>
          </div>

          <div className="rounded-2xl sm:rounded-3xl border border-stone-200/90 bg-white shadow-xs overflow-hidden">
            {/* Header Bar of Calendar Widget */}
            <div className="px-4 py-3 sm:px-5 sm:py-3.5 bg-stone-100/70 border-b border-stone-200/80 flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-stone-700" />
                <span className="text-xs sm:text-sm font-semibold text-stone-900 font-mono">
                  {currentSchedule.title}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] sm:text-xs text-stone-600 font-medium bg-white px-2.5 py-1 rounded-lg border border-stone-200/80 shadow-2xs">
                  Live Diary Sync
                </span>
              </div>
            </div>

            {/* Embedded Google Calendar Appointment Schedule Iframe */}
            <div className="relative w-full bg-white">
              <iframe
                key={selectedType}
                src={currentSchedule.embedUrl}
                title={`${currentSchedule.title} Appointment Schedule`}
                className="w-full h-[620px] sm:h-[700px] 2xl:h-[780px] border-0 bg-white"
                loading="lazy"
              />
            </div>

            {/* Reassurance Bar */}
            <div className="px-4 py-3 bg-stone-50/80 border-t border-stone-200/60 text-xs text-stone-500 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Instant sync with Google Calendar • Immediate email confirmation &amp; invite</span>
              </div>
              <span className="hidden sm:inline font-mono text-[11px] text-stone-400">
                {currentSchedule.duration} clinical hour
              </span>
            </div>
          </div>
        </div>

        {/* Practical Guidelines (Exploratory question note cleanly removed) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-stone-100/70 border border-stone-200/80 space-y-3">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-stone-700" />
            <h4 className="text-xs sm:text-sm font-semibold uppercase tracking-[0.12em] text-[#18181B]">
              Session Guidelines &amp; Policies
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-600">
            <div className="p-3 rounded-xl bg-white border border-stone-200/60 space-y-1">
              <strong className="text-stone-900 block font-medium">48-Hour Notice Policy</strong>
              <p className="leading-relaxed text-stone-500">
                Please provide at least 48 hours' notice for cancellations so open slots can be offered to other clients.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white border border-stone-200/60 space-y-1">
              <strong className="text-stone-900 block font-medium">Payment &amp; Invoicing</strong>
              <p className="leading-relaxed text-stone-500">
                Sessions are payable via direct Bank Transfer on or before the scheduled session day (£30 per 50-minute session).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Profile Footer Bar (Identical to all other slides) */}
      <div className="flex items-center justify-between pt-4 sm:pt-5 border-t border-stone-200/80 mt-auto shrink-0">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="flex flex-col">
            <span className="text-[12.5px] sm:text-[14px] font-medium text-[#18181B] leading-tight">Liam Doran</span>
            <span className="text-[9.5px] sm:text-[11px] text-[#71717A] uppercase tracking-wider mt-0.5">
              UKCP Trainee Psychotherapeutic Counsellor
            </span>
          </div>

          {onGoToContact && (
            <motion.button
              type="button"
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.92 }}
              onClick={onGoToContact}
              className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-stone-200/90 bg-stone-100/90 hover:bg-stone-200 hover:border-stone-400/80 text-[#18181B] shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.12)] transition-all cursor-pointer group flex items-center justify-center shrink-0 animate-float-gentle"
              title="Get in touch (Contact form)"
              aria-label="Get in touch (Contact form)"
            >
              <Mail className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-[#18181B] group-hover:text-stone-900 transition-transform duration-200 group-hover:scale-110" />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
};
