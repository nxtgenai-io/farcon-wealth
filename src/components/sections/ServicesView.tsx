import React from 'react';
import { FARCON_SERVICES } from '@/content/services/servicesData';
import { RoutePath } from '@/types';
import { ArrowRight, CheckCircle2, HelpCircle, Shield, ArrowUpRight } from 'lucide-react';

interface ServicesViewProps {
  activeSlug?: string;
  navigate: (path: RoutePath) => void;
  onOpenConsultation: (serviceName?: string) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({
  activeSlug,
  navigate,
  onOpenConsultation,
}) => {
  // If a specific service slug is selected, show detail view
  if (activeSlug) {
    const service = FARCON_SERVICES.find((s) => s.slug === activeSlug) || FARCON_SERVICES[0];

    return (
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 py-12 lg:py-16 space-y-16">
        {/* Service Hero */}
        <div className="border-b border-slate-200 pb-10">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
            <button onClick={() => navigate('/services')} className="hover:text-slate-900">
              Services
            </button>
            <span>/</span>
            <span className="text-slate-900 font-medium">{service.title}</span>
          </div>

          <span className="text-xs font-semibold tracking-wider uppercase text-[#78A832]">
            Farcon Service Architecture
          </span>
          <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-poppins font-medium text-slate-900 tracking-tight">
            {service.title}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
            {service.tagline}
          </p>

          <p className="mt-4 text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
            {service.summary}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={() => onOpenConsultation(service.title)}
              className="px-6 py-3 text-xs font-semibold text-white bg-[#101A2C] hover:bg-[#15243B] rounded-md transition-colors shadow-xs"
            >
              Book a Free Consultation
            </button>
            <button
              onClick={() => navigate(`/calculators/${service.calculatorType}` as RoutePath)}
              className="px-5 py-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
            >
              Use {service.calculatorType.toUpperCase()} Calculator
            </button>
          </div>
        </div>

        {/* What it is & Who it is for */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#DCE4EE] shadow-xs">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-900 mb-4">
              What It Encompasses
            </h2>
            <ul className="space-y-3 text-xs text-slate-600">
              {service.whatItIs.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#78A832] shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#DCE4EE] shadow-xs">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-900 mb-4">
              Who It Is Designed For
            </h2>
            <ul className="space-y-3 text-xs text-slate-600">
              {service.whoItIsFor.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#315FCE] shrink-0 mt-1.5" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* How Farcon Approaches It: 4-Step Editorial Timeline */}
        <div>
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-semibold tracking-wider uppercase text-[#78A832]">
              Methodology
            </span>
            <h2 className="text-2xl font-poppins font-medium text-slate-900 mt-1">
              How Farcon Executes This Service
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              A structured roadmap from goal quantification to continuous review.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {service.howFarconApproaches.map((step) => (
              <div
                key={step.step}
                className="bg-white p-6 rounded-xl border border-[#DCE4EE] shadow-xs flex flex-col justify-between"
              >
                <div>
                  <span className="text-2xl font-bold font-mono text-[#78A832] block mb-3">
                    {step.step}
                  </span>
                  <h3 className="text-sm font-semibold text-slate-900 mb-2 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Service FAQs */}
        {service.faqs.length > 0 && (
          <div className="bg-slate-50 p-6 sm:p-8 rounded-xl border border-slate-200">
            <h3 className="text-base font-poppins font-medium text-slate-900 mb-4">
              Frequently Clarified Questions
            </h3>
            <div className="space-y-4">
              {service.faqs.map((faq, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg border border-slate-200/80">
                  <h4 className="text-xs font-semibold text-slate-900 mb-1">{faq.question}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA Block */}
        <div className="bg-[#F2F6FB] text-[#17243A] p-8 sm:p-10 rounded-2xl border border-[#DCE4EE] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div>
            <h3 className="text-xl font-poppins font-medium text-[#17243A]">
              Ready to Structure Your {service.title}?
            </h3>
            <p className="text-xs text-[#52647D] mt-1">
              Connect with an AMFI-registered advisor with zero sales push.
            </p>
          </div>
          <button
            onClick={() => onOpenConsultation(service.title)}
            className="px-6 py-3 text-xs font-semibold text-white bg-[#101A2C] hover:bg-[#15243B] rounded-md transition-colors shrink-0 shadow-xs"
          >
            Book Free Consultation
          </button>
        </div>
      </div>
    );
  }

  // Services Overview Grid
  return (
    <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-12 py-12 lg:py-16">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs font-semibold tracking-wider uppercase text-[#78A832]">
          Published Capabilities
        </span>
        <h1 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-poppins font-medium text-slate-900 tracking-tight">
          Goal-Based Mutual Fund Guidance
        </h1>
        <p className="mt-4 text-sm text-slate-600 leading-relaxed">
          Farcon Wealth is an AMFI-registered Mutual Fund Distributor (ARN: 229006). We focus strictly on transparent, long-term mutual fund architectures—with zero unnecessary products or hidden agendas.
        </p>
      </div>

      {/* Premium Editorial Service List (NO 2x3 card grid) */}
      <div className="border-t border-slate-200 divide-y divide-slate-200">
        {FARCON_SERVICES.map((service, idx) => (
          <div
            key={service.id}
            onClick={() => navigate(`/services/${service.slug}` as RoutePath)}
            className="py-8 sm:py-10 transition-all duration-300 cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50/80 px-4 sm:px-6 -mx-4 sm:-mx-6 rounded-2xl"
          >
            <div className="flex items-start sm:items-center gap-6 sm:gap-8 md:w-5/12">
              <span className="text-xl sm:text-2xl font-mono text-slate-400 group-hover:text-[#78A832] transition-colors">
                0{idx + 1}
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-poppins font-medium text-slate-900 group-hover:text-[#78A832] transition-colors leading-snug">
                  {service.title}
                </h2>
                <span className="text-xs text-slate-500 block mt-1">
                  {service.tagline}
                </span>
              </div>
            </div>

            <div className="md:w-5/12 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>{service.summary}</p>
            </div>

            <div className="md:w-2/12 flex items-center md:justify-end gap-3 text-xs font-semibold text-slate-900 group-hover:text-[#78A832] transition-colors">
              <span className="hidden sm:inline">Details</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
