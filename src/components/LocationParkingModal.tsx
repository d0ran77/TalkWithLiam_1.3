import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  MapPin,
  Car,
  Bus,
  Clock,
  Navigation,
  ExternalLink,
  Copy,
  Check,
  Building2,
  Info,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

interface LocationParkingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToContact?: () => void;
}

interface CommuteOption {
  id: string;
  name: string;
  driveTime: string;
  busTime: string;
  routeSummary: string;
  drivingDetails: string;
  parkingAdvice: string;
  busRoutes: string;
}

const COMMUTE_OPTIONS: CommuteOption[] = [
  {
    id: 'cottingham',
    name: 'Cottingham',
    driveTime: '7–8 mins',
    busTime: '15 mins',
    routeSummary: 'Direct south-west via Harland Way / A164 into Willerby Square.',
    drivingDetails:
      'Head south-west along Harland Way or take the A164 towards Willerby. At the Willerby roundabout, take the exit for Willerby Square / Main Street.',
    parkingAdvice:
      'Turn into Willerby Square where free customer and public parking is available next to Sainsbury’s Local, or park freely on Main Street.',
    busRoutes:
      'East Yorkshire Buses Route 154 / 66 connects Cottingham Green directly to Willerby Square (approx. 12–15 mins, drops off 2 minutes from the door).',
  },
  {
    id: 'beverley',
    name: 'Beverley',
    driveTime: '12–15 mins',
    busTime: '22 mins',
    routeSummary: 'Straight south down the A164 bypass directly to Willerby roundabout.',
    drivingDetails:
      'Take the A164 dual carriageway / bypass south from Beverley. Continue past Skidby straight down to the Willerby roundabout, then follow signs for Willerby centre / Main Street.',
    parkingAdvice:
      'Ample free parking is situated directly in Willerby Square beside Sainsbury’s Local, with easy turnaround and no pay-and-display meters.',
    busRoutes:
      'East Yorkshire Buses Routes X46, 121, and 154 provide frequent connections from Beverley Bus Station directly towards Willerby.',
  },
  {
    id: 'hull',
    name: 'Hull & West Hull',
    driveTime: '12–15 mins',
    busTime: '20 mins',
    routeSummary: 'Via Anlaby Road (A1105) or Spring Bank West onto Kingston Road into Willerby.',
    drivingDetails:
      'From central Hull or West Hull, head west along Spring Bank West / Kingston Road (A1105) straight into Willerby. Continue onto Main Street towards Willerby Square.',
    parkingAdvice:
      'Free unrestricted parking is readily available in the public square car park by Sainsbury’s Local or along adjacent residential bays without time limits.',
    busRoutes:
      'East Yorkshire Buses Routes 54, 56, and 154 run directly from Hull Paragon Interchange through West Hull to Willerby Square every 15–20 minutes.',
  },
  {
    id: 'hessle',
    name: 'Hessle & Swanland',
    driveTime: '8–10 mins',
    busTime: '18 mins',
    routeSummary: 'North via Boothferry Road (A1105) or Tranby Lane straight into Willerby.',
    drivingDetails:
      'From Hessle Square or Boothferry Road, head north along Beverley Road (B1232) or via Tranby Lane directly into Willerby village and Main Street.',
    parkingAdvice:
      'Park in the dedicated free bays in Willerby Square or along Main Street; easy, level 1-minute walk to the entrance.',
    busRoutes:
      'Local bus connections and quick taxi routes connect Hessle and Swanland directly in under 10 minutes.',
  },
  {
    id: 'brough',
    name: 'Brough & West Villages',
    driveTime: '12–15 mins',
    busTime: '25 mins',
    routeSummary: 'East via A63 / Welton / Riplingham Road onto the A164 into Willerby.',
    drivingDetails:
      'From Brough, North Ferriby, or Elloughton, take the A63 east to the North Ferriby / Swanland turn-off or join the A164 northbound directly into Willerby.',
    parkingAdvice:
      'Willerby Square offers generous free parking spaces with quick access from the A63 corridor without driving into congested city traffic.',
    busRoutes:
      'Regular bus routes from Brough Interchange and West Hull villages connect via Anlaby or direct connections.',
  },
];

export const LocationParkingModal: React.FC<LocationParkingModalProps> = ({
  isOpen,
  onClose,
  onNavigateToContact,
}) => {
  const [selectedTownId, setSelectedTownId] = useState<string>('cottingham');
  const [copiedPostcode, setCopiedPostcode] = useState(false);

  const selectedCommute =
    COMMUTE_OPTIONS.find((c) => c.id === selectedTownId) || COMMUTE_OPTIONS[0];

  const handleCopyPostcode = () => {
    navigator.clipboard.writeText('HU10 6EB');
    setCopiedPostcode(true);
    setTimeout(() => setCopiedPostcode(false), 2200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          id="location-parking-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/50 backdrop-blur-xs"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl bg-[#FAF9F5] rounded-3xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-200/80 px-5 sm:px-8 py-4 bg-white/70">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-stone-100 text-stone-800 border border-stone-200/60">
                  <MapPin className="w-4 h-4 text-stone-700" />
                </div>
                <div>
                  <h3 className="font-sans text-base sm:text-lg font-semibold text-[#18181B] tracking-tight">
                    The Willerby Practice • Location &amp; Parking
                  </h3>
                  <p className="text-xs text-stone-500 font-mono">
                    Willerby Square, East Yorkshire • Postcode: HU10 6EB
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full border border-stone-200/80 flex items-center justify-center text-stone-500 hover:text-[#18181B] hover:bg-[#F2EFE9] transition-colors focus:outline-none cursor-pointer"
                aria-label="Close location and parking guide"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-5 space-y-5 text-xs sm:text-[13px] text-stone-700 leading-relaxed custom-scrollbar select-text">
              
              {/* 3 Arrival & Reassurance Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. Free Parking */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-stone-200/80 space-y-1.5 shadow-2xs">
                  <div className="flex items-center gap-2 text-stone-900 font-semibold text-xs sm:text-[13px]">
                    <Car className="w-4 h-4 text-stone-700" />
                    <span>Free Parking</span>
                  </div>
                  <p className="text-[12px] text-stone-500 leading-relaxed">
                    Free parking available right in Willerby Square (next to Sainsbury’s) and unrestricted on-street bays. No meters or pay-and-display.
                  </p>
                </div>

                {/* 2. Quiet Setting */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-stone-200/80 space-y-1.5 shadow-2xs">
                  <div className="flex items-center gap-2 text-stone-900 font-semibold text-xs sm:text-[13px]">
                    <Building2 className="w-4 h-4 text-stone-700" />
                    <span>Quiet &amp; Discreet</span>
                  </div>
                  <p className="text-[12px] text-stone-500 leading-relaxed">
                    A private consulting room on the second floor. Peaceful, confidential, and without the noise of busy clinic reception areas.
                  </p>
                </div>

                {/* 3. Accessibility */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-stone-200/80 space-y-1.5 shadow-2xs">
                  <div className="flex items-center gap-2 text-stone-900 font-semibold text-xs sm:text-[13px]">
                    <Info className="w-4 h-4 text-stone-700" />
                    <span>Stairs Access</span>
                  </div>
                  <p className="text-[12px] text-stone-500 leading-relaxed">
                    Room is accessed via a flight of stairs (no lift). For clients with mobility considerations, secure online video therapy is fully available.
                  </p>
                </div>
              </div>

              {/* Interactive Local Commute Guide Section */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/80 space-y-4 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold uppercase tracking-[0.12em] text-[#18181B] flex items-center gap-2">
                      <Navigation className="w-3.5 h-3.5 text-stone-700" />
                      Local Commute &amp; Transport Guide
                    </h4>
                    <p className="text-[12px] text-stone-500 mt-0.5">
                      Select your starting area for specific driving, parking, and bus notes:
                    </p>
                  </div>

                  {/* Postcode Copy Pill */}
                  <button
                    onClick={handleCopyPostcode}
                    className="self-start sm:self-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200/80 text-[11px] font-mono text-stone-700 transition-colors cursor-pointer"
                    title="Copy practice postcode for your SatNav"
                  >
                    {copiedPostcode ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700 font-semibold">Postcode Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-stone-500" />
                        <span>SatNav: HU10 6EB</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Town Selector Tabs */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {COMMUTE_OPTIONS.map((town) => {
                    const isSelected = town.id === selectedTownId;
                    return (
                      <button
                        key={town.id}
                        onClick={() => setSelectedTownId(town.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#18181B] text-white shadow-xs'
                            : 'bg-stone-100/90 text-stone-600 hover:bg-stone-200/80 hover:text-stone-900'
                        }`}
                      >
                        <span>{town.name}</span>
                        <span
                          className={`text-[10px] font-mono ${
                            isSelected ? 'text-stone-300' : 'text-stone-400'
                          }`}
                        >
                          • {town.driveTime}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Town Details Card */}
                <div className="p-4 rounded-xl bg-stone-50/90 border border-stone-200/70 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-semibold text-stone-900 text-xs sm:text-sm">
                      Coming from {selectedCommute.name}
                    </span>
                    <div className="flex items-center gap-2 text-[11px] font-mono">
                      <span className="px-2 py-0.5 rounded-md bg-stone-200/80 text-stone-800">
                        🚗 {selectedCommute.driveTime} drive
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-stone-200/80 text-stone-800">
                        🚌 {selectedCommute.busTime} bus
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed font-normal">
                    {selectedCommute.routeSummary}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 border-t border-stone-200/60 text-[12px]">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 font-semibold text-stone-900">
                        <Car className="w-3.5 h-3.5 text-stone-700" />
                        <span>Driving &amp; Parking</span>
                      </div>
                      <p className="text-stone-600 leading-relaxed">
                        {selectedCommute.drivingDetails} {selectedCommute.parkingAdvice}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 font-semibold text-stone-900">
                        <Bus className="w-3.5 h-3.5 text-stone-700" />
                        <span>Public Bus Route</span>
                      </div>
                      <p className="text-stone-600 leading-relaxed">
                        {selectedCommute.busRoutes}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Online Therapy Note */}
              <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/60 flex items-start gap-3 text-xs text-amber-900">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Prefer not to travel?</strong> Secure, confidential video therapy via Google Meet is available UK-wide at the same £30 session fee, offering equal depth without the commute.
                </p>
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="border-t border-stone-200/80 px-5 sm:px-8 py-3.5 bg-white/70 flex flex-wrap items-center justify-between gap-3 text-xs">
              <a
                href="https://www.google.com/maps/place/Talk+With+Liam/@53.7570981,-0.451291,17z/data=!3m1!4b1!4m6!3m5!1s0x4878c1bd4df063e7:0x6dd2a9885229174d!8m2!3d53.7570982!4d-0.4464255!16s%2Fg%2F11z1zsmj7z?entry=ttu&g_ep=EgoyMDI2MDgxOS4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900 text-white hover:bg-black transition-colors font-medium shadow-2xs cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5 text-stone-300" />
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3 h-3 text-stone-400" />
              </a>

              <div className="flex items-center gap-3">
                {onNavigateToContact && (
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateToContact();
                    }}
                    className="font-medium text-stone-700 hover:text-stone-950 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Get in Touch</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="px-3.5 py-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-100 text-stone-700 transition-colors font-medium cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
