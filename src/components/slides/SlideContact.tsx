import React, { useState } from 'react';
import { Send, CheckCircle2, ShieldCheck, MapPin, Mail, Copy, Check, Lock } from 'lucide-react';
import { PRACTICAL_DETAILS } from '../../data/content.ts';
import { ConsultationFormData } from '../../types.ts';

interface SlideContactProps {
  onCopyEmail: () => void;
  copied: boolean;
  onNavigate: (index: number) => void;
  onOpenPrivacy?: () => void;
  onOpenBooking?: () => void;
  onOpenLocation?: () => void;
}

export const SlideContact: React.FC<SlideContactProps> = ({
  onCopyEmail,
  copied,
  onOpenPrivacy,
  onOpenLocation,
}) => {
  const [formData, setFormData] = useState<ConsultationFormData>({
    name: '',
    email: '',
    phone: '',
    format: 'in-person',
    nextStep: 'free-consultation',
    message: '',
    mathAnswer: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const formatOptions = [
    { value: 'in-person', label: 'Face to Face (Willerby / Hull)' },
    { value: 'online', label: 'Online Video (UK-Wide)' },
    { value: 'undecided', label: 'Undecided / Flexible' },
  ];

  const nextStepOptions = [
    {
      value: 'free-consultation',
      label: 'Free Consultation',
      disabled: false,
    },
    {
      value: 'general-inquiry',
      label: 'General Practice Inquiry',
      disabled: false,
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim() || !formData.email.trim()) {
      setErrorMessage('Please provide your full name and email address.');
      return;
    }

    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }

    if (!formData.message.trim()) {
      setErrorMessage('Please provide a brief outline of what brings you to therapy at this stage.');
      return;
    }

    // Human verification check: 5 + 1 = 6
    const cleanedMath = (formData.mathAnswer || '').trim();
    if (cleanedMath !== '6' && cleanedMath.toLowerCase() !== 'six') {
      setErrorMessage('Please solve the verification sum (5 + 1 = 6) to confirm you are human.');
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedFormatLabel =
        formatOptions.find((f) => f.value === formData.format)?.label || formData.format;
      const selectedStepLabel =
        nextStepOptions.find((s) => s.value === formData.nextStep)?.label || formData.nextStep;

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        _replyto: formData.email.trim(),
        phone: formData.phone?.trim() || 'Not provided',
        formatPreference: selectedFormatLabel,
        inquiryPathway: selectedStepLabel,
        situationOutline: formData.message.trim(),
        _subject: `New Therapy Inquiry: ${formData.name.trim()} (${selectedStepLabel})`,
      };

      const response = await fetch('https://formspree.io/f/xzdnrbbb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        const data = await response.json().catch(() => ({}));
        const serverError =
          data?.errors?.map((err: { message: string }) => err.message).join(', ') ||
          'Unable to send message right now. You can email directly using the mail icon below.';
        setErrorMessage(serverError);
      }
    } catch {
      setErrorMessage(
        'A connection error occurred. Please try again or reach out directly using the mail icon below.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      format: 'in-person',
      nextStep: 'free-consultation',
      message: '',
      mathAnswer: '',
    });
  };

  return (
    <div
      id="slide-contact-content"
      className="h-full flex flex-col justify-between select-text overflow-y-auto custom-scrollbar pr-0.5 sm:pr-2 pb-2 sm:pb-4 space-y-5 sm:space-y-6"
    >
      {/* Top Slide Header (Hidden on mobile where card header displays [05 / 06] • GET IN TOUCH) */}
      <div className="hidden lg:block pt-0.5 border-b border-stone-200/80 pb-3 sm:pb-5 shrink-0">
        <div className="flex items-center space-x-2 mb-1.5 sm:mb-2">
          <span className="font-mono text-[9.5px] sm:text-[10px] md:text-[11px] tracking-widest text-[#71717A] font-semibold">
            [05 / 06]
          </span>
          <span className="w-1 h-1 rounded-full bg-stone-300"></span>
          <span className="text-[9.5px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.16em] font-semibold text-[#71717A]">
            GET IN TOUCH
          </span>
        </div>

        <h1 className="text-[20px] sm:text-[26px] md:text-[32px] lg:text-[36px] leading-[1.1] font-medium tracking-[0.03em] sm:tracking-[0.04em] text-[#18181B] uppercase">
          GET IN TOUCH
        </h1>
      </div>

      {/* Main Narrative - Equalized across height */}
      <div className="flex-1 flex flex-col justify-between space-y-5 sm:space-y-6 text-left">
        {/* Lede Title */}
        <h2 className="text-[14.5px] sm:text-[18px] md:text-[20px] leading-[1.35] font-normal tracking-tight text-[#18181B] uppercase">
          TAKE THE FIRST STEP TOWARDS{' '}
          <span className="editorial-mark text-[13.5px] sm:text-[17px] md:text-[19px] normal-case">
            feeling supported
          </span>.
        </h2>

        {/* Form Container */}
        {isSubmitted ? (
          <div className="p-6 sm:p-10 rounded-2xl sm:rounded-3xl bg-[#FAF9F5] border border-stone-200 text-center space-y-4 shadow-xs flex-1 flex flex-col justify-center items-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div className="space-y-2 max-w-md">
              <h3 className="text-lg sm:text-2xl font-semibold text-[#18181B] tracking-tight">
                Inquiry Safely Received
              </h3>
              <p className="text-xs sm:text-[14px] text-stone-600 leading-relaxed">
                Thank you, <strong className="text-[#18181B]">{formData.name}</strong>. Your note has been delivered. I will review your outline with care and reply personally to <span className="font-mono text-[#18181B] font-medium">{formData.email}</span> within 24–48 hours.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="text-xs sm:text-sm text-stone-600 hover:text-[#18181B] underline underline-offset-4 transition-colors cursor-pointer"
              >
                Send another inquiry
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between space-y-3.5 sm:space-y-4 pt-0.5">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50/90 text-red-800 text-xs border border-red-200 leading-relaxed">
                {errorMessage}
              </div>
            )}

            {/* Row 1: Name and Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1">
                <label className="block text-[11.5px] sm:text-xs font-semibold text-stone-800">
                  Your Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jane Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 sm:px-4 py-2.5 sm:py-2.8 rounded-xl border border-stone-200/90 bg-white text-xs sm:text-[13.5px] text-[#18181B] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400 transition-all shadow-2xs"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[11.5px] sm:text-xs font-semibold text-stone-800">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 sm:px-4 py-2.5 sm:py-2.8 rounded-xl border border-stone-200/90 bg-white text-xs sm:text-[13.5px] text-[#18181B] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400 transition-all shadow-2xs"
                />
              </div>
            </div>

            {/* Row 2: Format Preference & Next Step / Pathway (Equal 50/50 Symmetry) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1">
                <label className="block text-[11.5px] sm:text-xs font-semibold text-stone-800">
                  Format Preference <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.format}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      format: e.target.value as ConsultationFormData['format'],
                    })
                  }
                  className="w-full px-3.5 sm:px-4 py-2.5 sm:py-2.8 rounded-xl border border-stone-200/90 bg-white text-xs sm:text-[13.5px] text-[#18181B] focus:outline-none focus:ring-2 focus:ring-stone-400 transition-all shadow-2xs cursor-pointer"
                >
                  {formatOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[11.5px] sm:text-xs font-semibold text-stone-800">
                  Next Step / Pathway <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.nextStep}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nextStep: e.target.value as ConsultationFormData['nextStep'],
                    })
                  }
                  className="w-full px-3.5 sm:px-4 py-2.5 sm:py-2.8 rounded-xl border border-stone-200/90 bg-white text-xs sm:text-[13.5px] text-[#18181B] focus:outline-none focus:ring-2 focus:ring-stone-400 transition-all shadow-2xs cursor-pointer"
                >
                  {nextStepOptions.map((opt) => (
                    <option
                      key={opt.value}
                      value={opt.value}
                      disabled={opt.disabled}
                      className={opt.disabled ? 'text-stone-400 bg-stone-100/80 italic' : ''}
                    >
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 3: Optional Phone Number */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-[11.5px] sm:text-xs font-semibold text-stone-800">
                  Phone Number
                </label>
                <span className="text-[10.5px] sm:text-[11px] text-stone-600 font-normal">
                  Optional (for SMS / Call)
                </span>
              </div>
              <input
                type="tel"
                placeholder="e.g. 07700 900077"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 sm:px-4 py-2.5 sm:py-2.8 rounded-xl border border-stone-200/90 bg-white text-xs sm:text-[13.5px] text-[#18181B] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400 transition-all shadow-2xs"
              />
            </div>

            {/* Brief Situation Outline */}
            <div className="space-y-1 flex-1 flex flex-col">
              <label className="block text-[11.5px] sm:text-xs font-semibold text-stone-800">
                Brief Situation Outline <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                required
                placeholder="Briefly outline what brings you to seek therapy at this stage..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-stone-200/90 bg-white text-xs sm:text-[13.5px] text-[#18181B] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400 transition-all shadow-2xs resize-none leading-relaxed flex-1 min-h-[90px] sm:min-h-[105px]"
              />
            </div>

            {/* Human Verification Box (Security Check) */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-[#FAF9F5] border border-stone-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-stone-600 shrink-0" />
                <span className="text-[12px] sm:text-[13px] text-stone-700">
                  Verification:{' '}
                  <strong className="font-mono text-[#18181B] font-semibold">5 + 1 = ?</strong>
                </span>
              </div>
              <input
                type="text"
                required
                placeholder="Answer"
                value={formData.mathAnswer || ''}
                onChange={(e) => setFormData({ ...formData, mathAnswer: e.target.value })}
                className="w-full sm:w-32 px-3 py-1.5 rounded-lg border border-stone-300 bg-white text-xs font-mono font-medium text-[#18181B] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
            </div>

            {/* Submit Bar & Confidentiality Reassurance */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1.5 sm:pt-2.5">
              <span className="text-[11px] sm:text-[11.5px] text-[#71717A] flex items-center gap-1.5 flex-wrap">
                <ShieldCheck className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                <span>Strictly confidential under the UKCP Ethical Framework.</span>
                {onOpenPrivacy && (
                  <button
                    type="button"
                    onClick={onOpenPrivacy}
                    className="underline text-stone-700 hover:text-stone-950 transition-colors cursor-pointer"
                  >
                    Privacy Notice
                  </button>
                )}
              </span>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 px-6 py-2.8 rounded-full bg-[#18181B] hover:bg-stone-800 active:scale-[0.98] text-white text-xs sm:text-[13.5px] font-medium transition-all shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Sending Inquiry...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Inquiry</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Direct Email Action Bar with explicit professional recipient address */}
        <div className="pt-4 sm:pt-5 border-t border-stone-200/80 flex flex-wrap items-center justify-between gap-2.5 sm:gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={`mailto:${PRACTICAL_DETAILS.email}?subject=${encodeURIComponent('Therapy Inquiry — Talk with Liam')}`}
              title={`Email Liam directly at ${PRACTICAL_DETAILS.email}`}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#FAF9F5] hover:bg-[#F2EFE9] border border-stone-200/90 text-stone-800 hover:text-[#18181B] transition-colors cursor-pointer text-xs sm:text-[12.5px] font-medium"
              aria-label={`Send direct email to ${PRACTICAL_DETAILS.email}`}
            >
              <Mail className="w-3.5 h-3.5 text-stone-700 shrink-0" />
              <span>Direct Email</span>
            </a>

            <button
              type="button"
              onClick={onCopyEmail}
              title={`Copy ${PRACTICAL_DETAILS.email} to clipboard`}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#FAF9F5] hover:bg-[#F2EFE9] border border-stone-200/90 text-stone-600 hover:text-[#18181B] transition-colors cursor-pointer text-xs sm:text-[12.5px]"
              aria-label={`Copy email address ${PRACTICAL_DETAILS.email}`}
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-700" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-stone-500" />
              )}
              <span className="text-[11px] sm:text-xs">{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {onOpenLocation ? (
            <button
              type="button"
              onClick={onOpenLocation}
              className="text-[11px] sm:text-[12px] text-stone-600 hover:text-stone-900 flex items-center gap-1.5 transition-colors underline-offset-2 hover:underline cursor-pointer"
              title="View Willerby practice location and parking guide"
            >
              <MapPin className="w-3.5 h-3.5 text-stone-500" />
              <span>Willerby (Parking Guide) &amp; Online</span>
            </button>
          ) : (
            <a
              href="https://www.google.com/maps/place/Talk+With+Liam/@53.7570981,-0.451291,17z/data=!3m1!4b1!4m6!3m5!1s0x4878c1bd4df063e7:0x6dd2a9885229174d!8m2!3d53.7570982!4d-0.4464255!16s%2Fg%2F11z1zsmj7z?entry=ttu&g_ep=EgoyMDI2MDgxOS4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] sm:text-[12px] text-stone-600 hover:text-stone-900 flex items-center gap-1.5 transition-colors underline-offset-2 hover:underline cursor-pointer"
              title="Open Talk With Liam on Google Maps"
            >
              <MapPin className="w-3.5 h-3.5 text-stone-500" />
              <span>Willerby &amp; Online UK-Wide</span>
            </a>
          )}
        </div>
      </div>

      {/* Bottom Footer Note */}
      <div className="flex items-center justify-between pt-4 sm:pt-5 border-t border-stone-200/80 mt-auto text-xs shrink-0">
        <span className="text-[10px] sm:text-[11px] text-stone-500">
          Confidential &amp; Boundaried Psychotherapy
        </span>
        <span className="text-[10px] sm:text-[11px] text-[#71717A] font-mono">
          Talk With Liam • Willerby 2026
        </span>
      </div>
    </div>
  );
};
