import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, Lock, FileText, Mail, MapPin, ExternalLink } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div
          id="privacy-policy-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/50 backdrop-blur-xs"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl bg-[#FAF9F5] rounded-3xl border border-stone-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-stone-200/80 px-6 py-4.5 sm:px-8 bg-white/60">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-stone-100 text-stone-800 border border-stone-200/60">
                  <ShieldCheck className="w-4 h-4 text-stone-700" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-sans text-base sm:text-lg font-semibold text-[#18181B]">
                      Privacy &amp; Data Protection Policy
                    </h3>
                  </div>
                  <p className="text-xs text-stone-500">
                    UK GDPR, Data Protection Act 2018 &amp; UKCP Clinical Compliance
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full border border-stone-200/80 flex items-center justify-center text-stone-500 hover:text-[#18181B] hover:bg-[#F2EFE9] transition-colors focus:outline-none cursor-pointer"
                aria-label="Close privacy policy modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body - Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 space-y-6 text-xs sm:text-[13px] text-stone-700 leading-relaxed custom-scrollbar select-text">
              
              {/* Introduction & Data Controller */}
              <div className="p-4 rounded-2xl bg-white border border-stone-200/80 space-y-2 shadow-2xs">
                <div className="flex items-center gap-2 text-stone-900 font-semibold">
                  <FileText className="w-3.5 h-3.5 text-stone-600" />
                  <span>1. Data Controller &amp; Practice Information</span>
                </div>
                <p className="text-stone-600">
                  Talk With Liam is the independent private psychotherapy and counselling practice of <strong>Liam Doran</strong> (Trainee Psychotherapist, UKCP Student Member), based in <strong>Willerby, East Yorkshire</strong> and operating online UK-wide.
                </p>
                <p className="text-stone-600">
                  For the purposes of data protection legislation (UK GDPR and the Data Protection Act 2018), Liam Doran is the registered Data Controller responsible for handling your personal data safely and transparently.
                </p>
                <div className="pt-1 flex flex-wrap items-center gap-3 text-[11.5px] text-stone-500">
                  <a
                    href="mailto:talkwithliamtherapy@gmail.com"
                    className="flex items-center gap-1 hover:text-stone-900 transition-colors"
                  >
                    <Mail className="w-3 h-3" /> talkwithliamtherapy@gmail.com
                  </a>
                  <a
                    href="https://www.google.com/maps/place/Talk+With+Liam/@53.7570981,-0.451291,17z/data=!3m1!4b1!4m6!3m5!1s0x4878c1bd4df063e7:0x6dd2a9885229174d!8m2!3d53.7570982!4d-0.4464255!16s%2Fg%2F11z1zsmj7z?entry=ttu&g_ep=EgoyMDI2MDgxOS4wIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 hover:text-stone-900 transition-colors underline-offset-2 hover:underline"
                    title="Open Talk With Liam on Google Maps"
                  >
                    <MapPin className="w-3 h-3 text-stone-500" /> Willerby Square, Willerby, Hull
                  </a>
                </div>
              </div>

              {/* What Data We Collect */}
              <div className="space-y-2">
                <h4 className="font-semibold text-stone-900 text-xs sm:text-[13.5px]">
                  2. Personal Information Collected
                </h4>
                <p className="text-stone-600">
                  Depending on whether you make an inquiry or enter into therapy, the practice collects:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
                  <li>
                    <strong>Inquiry &amp; Contact Details:</strong> Name, email address, telephone number, and any introductory context you provide through the contact form or email.
                  </li>
                  <li>
                    <strong>Appointment &amp; Administrative Data:</strong> Consultation preferences (Face-to-Face in Willerby or Online Video), session dates, and attendance records.
                  </li>
                  <li>
                    <strong>Clinical &amp; Health Information:</strong> Brief, anonymized process notes from therapy sessions. These are coded and stored strictly separate from your identifying contact details.
                  </li>
                  <li>
                    <strong>Technical Data:</strong> Basic website interaction information. We do not use intrusive tracking cookies or sell your browsing data.
                  </li>
                </ul>
              </div>

              {/* Legal Basis for Processing */}
              <div className="space-y-2">
                <h4 className="font-semibold text-stone-900 text-xs sm:text-[13.5px]">
                  3. Lawful Basis for Processing
                </h4>
                <p className="text-stone-600">
                  Under UK data protection laws, processing personal and sensitive category health data is conducted under the following lawful bases:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
                  <li>
                    <strong>Contractual &amp; Pre-Contractual Steps (Article 6(1)(b)):</strong> To respond to your inquiry, schedule sessions, and deliver agreed psychotherapeutic services.
                  </li>
                  <li>
                    <strong>Provision of Health or Social Care (Article 9(2)(h)):</strong> For the confidential provision and professional management of therapy and psychological wellbeing.
                  </li>
                  <li>
                    <strong>Explicit Consent:</strong> Provided when submitting your inquiry or completing your initial therapeutic agreement.
                  </li>
                </ul>
              </div>

              {/* Confidentiality & Clinical Supervision */}
              <div className="space-y-2">
                <h4 className="font-semibold text-stone-900 text-xs sm:text-[13.5px]">
                  4. Confidentiality &amp; Ethical Boundaries
                </h4>
                <p className="text-stone-600">
                  Everything discussed in therapy is held in the strictest confidence. In line with the UKCP Ethical Principles and Code of Professional Conduct:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
                  <li>
                    <strong>Clinical Supervision:</strong> As part of professional practice, work is reviewed with a qualified UKCP/BACP clinical supervisor. Case discussions are strictly anonymized to ensure full client privacy.
                  </li>
                  <li>
                    <strong>Exceptions to Confidentiality:</strong> Information is only ever disclosed if there is a compelling ethical or legal duty to prevent severe imminent harm to you or another person, in child protection matters, or where required by law (e.g. terrorism, drug trafficking, or a formal court order). Where safe and feasible, any disclosure is discussed with you beforehand.
                  </li>
                </ul>
              </div>

              {/* Data Storage & Security */}
              <div className="space-y-2">
                <h4 className="font-semibold text-stone-900 text-xs sm:text-[13.5px]">
                  5. Security &amp; Data Retention
                </h4>
                <p className="text-stone-600">
                  All electronic records, email communications, and appointment data are stored on encrypted, password-protected systems with multi-factor authentication.
                </p>
                <p className="text-stone-600">
                  In compliance with UK professional indemnity insurance obligations and UKCP standards, clinical records are retained securely for a period of <strong>7 years</strong> following the conclusion of therapy, after which they are permanently and securely deleted.
                </p>
              </div>

              {/* Your Rights */}
              <div className="space-y-2">
                <h4 className="font-semibold text-stone-900 text-xs sm:text-[13.5px]">
                  6. Your Rights Under UK GDPR
                </h4>
                <p className="text-stone-600">
                  You have specific statutory rights regarding your personal information:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
                  <li><strong>Right of Access:</strong> You may request a copy of the personal information held about you (Subject Access Request).</li>
                  <li><strong>Right to Rectification:</strong> You may ask to correct inaccurate or incomplete details.</li>
                  <li><strong>Right to Erasure / Restriction:</strong> You may request the deletion or limitation of data, subject to legal and professional insurance retention mandates.</li>
                  <li><strong>Right to Complain:</strong> If you have concerns about how your data is handled, you have the right to lodge a complaint with the Information Commissioner&apos;s Office (ICO) at <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-stone-900 underline underline-offset-2">ico.org.uk</a>.</li>
                </ul>
              </div>

              {/* Contact for Privacy Questions */}
              <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-stone-200/90 space-y-2">
                <div className="flex items-center gap-2 text-stone-900 font-semibold">
                  <Lock className="w-3.5 h-3.5 text-stone-600" />
                  <span>7. Contact &amp; Questions</span>
                </div>
                <p className="text-stone-600">
                  If you have any questions regarding this Privacy Policy or wish to exercise any of your data rights, please contact:
                </p>
                <p className="font-medium text-stone-900">
                  Liam Doran — <a href="mailto:talkwithliamtherapy@gmail.com" className="underline hover:text-stone-700">talkwithliamtherapy@gmail.com</a>
                </p>
                <p className="text-[11px] text-stone-500 pt-1">
                  Last updated: August 2026 • Talk With Liam
                </p>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 sm:px-8 border-t border-stone-200/80 bg-white/60 flex items-center justify-between text-xs text-stone-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-stone-600" />
                <span>Strict Clinical Confidentiality</span>
              </span>
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-xl bg-[#18181B] text-white hover:bg-stone-800 transition-colors font-medium text-xs cursor-pointer shadow-2xs"
              >
                Close Policy
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
