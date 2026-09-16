import React from 'react';
import { ShieldCheck, Truck, Zap, Sparkles, Award, Clock, ArrowRight } from 'lucide-react';

interface FleetSolutionsProps {
  onOpen3DStudio: () => void;
  onOpenQuote: () => void;
  lang: 'en' | 'ar';
}

export const FleetSolutions: React.FC<FleetSolutionsProps> = ({
  onOpen3DStudio,
  onOpenQuote,
  lang,
}) => {
  const pillars = [
    {
      icon: <Zap className="w-6 h-6 text-amber-400" />,
      title: 'Aerodynamic FRP Fiberglass',
      titleAr: 'فايبرجلاس ديناميكي فائق القوة',
      desc: 'Tested to survive +55°C Saudi summer heat and desert dust storms. Impact-proof composite that never warps or cracks.',
      descAr: 'مُصنّع خصيصاً لتحمل حرارة الصيف القاسية في السعودية ومقاومة الصدمات والغبار دون أي تشوه.',
      metric: '55°C+ Certified',
    },
    {
      icon: <Truck className="w-6 h-6 text-indigo-400" />,
      title: 'Universal Mounting Brackets',
      titleAr: 'قواعد تثبيت عالمية متوافقة',
      desc: 'Precision laser-cut heavy steel mounting brackets engineered for Honda CG125, Yamaha YBR, TVS HLX, and electric mopeds.',
      descAr: 'قواعد حديدية مقصوصة بالليزر لتناسب جميع دراجات التوصيل الشهيرة في المملكة بثبات كامل.',
      metric: '100% Fleet Fit',
    },
    {
      icon: <Sparkles className="w-6 h-6 text-emerald-400" />,
      title: 'Night LED Illuminated Billboard',
      titleAr: 'لوحات إعلانية مضيئة بتقنية LED',
      desc: 'Integrated rear light frames powered by bike battery, transforming each rider into a moving illuminated 24/7 billboard.',
      descAr: 'لوحات خلفية مضيئة عالية السطوع تحول كل سائق إلى لوحة إعلانية متنقلة على مدار 24 ساعة.',
      metric: '300m Visibility',
    },
    {
      icon: <Award className="w-6 h-6 text-rose-400" />,
      title: 'SASO & Traffic Directorate Safety',
      titleAr: 'معتمد من ساسو والمرور السعودي',
      desc: 'Approved dimensions, reflective 3M Scotchlite visibility borders, and certified DOT helmets for strict compliance.',
      descAr: 'مطابق لاشتراطات هيئة النقل والمرور والهيئة السعودية للمواصفات والمقاييس لضمان ترخيص الأسطول.',
      metric: '100% SASO Compliant',
    },
  ];

  return (
    <section id="fleet" className="py-20 sm:py-28 bg-slate-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-400">
            <ShieldCheck className="w-4 h-4" />
            <span>{lang === 'ar' ? 'معايير الأساطيل التجارية' : 'Fleet Engineering Standards'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            {lang === 'ar'
              ? 'لماذا تعتمد كبرى شركات التوصيل على Bag & Box؟'
              : 'Why Leading Saudi Delivery Fleets Choose Bag & Box'}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            {lang === 'ar'
              ? 'نحن ندرك متطلبات تشغيل الأساطيل اليومية في المملكة: الحفاظ على حرارة الطعام، سلامة السائق، والمتانة التي تقلل تكاليف الصيانة.'
              : 'From cloud kitchen chains to national on-demand delivery apps, our products withstand heavy 14-hour daily delivery shifts across Riyadh, Jeddah, and Eastern Province.'}
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {pillars.map((pillar, i) => (
            <div
              key={i}
              className="p-6 rounded-3xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all duration-300 flex flex-col justify-between space-y-4 hover:shadow-xl"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                  {pillar.icon}
                </div>
                <h3 className="text-base font-bold text-white">
                  {lang === 'ar' ? pillar.titleAr : pillar.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {lang === 'ar' ? pillar.descAr : pillar.desc}
                </p>
              </div>
              <div className="pt-3 border-t border-slate-800/80">
                <span className="text-[11px] font-extrabold text-amber-400 uppercase tracking-wider">
                  {pillar.metric}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Highlight Banner: 3D Studio & Factory Tour */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-amber-500/10 via-slate-800/80 to-slate-950 border border-amber-500/30 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center lg:text-left max-w-2xl">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              Digital 3D Prototyping
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              {lang === 'ar'
                ? 'شاهد تصميم أسطولك بأبعاد 3D واقعية قبل بدء الإنتاج'
                : 'Experience Real-Time 3D Prototyping Before Mass Production'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {lang === 'ar'
                ? 'استخدم استوديو التصميم ثلاثي الأبعاد لاختيار الألوان، إضافة لوجو علامتك التجارية، وفحص زوايا الصندوق وطبقات العزل الحراري.'
                : 'Upload your brand logos, choose custom fleet RAL colors, and inspect interior insulated compartments in full 360° interactive 3D.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <button
              onClick={onOpen3DStudio}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch 3D Configurator</span>
            </button>
            <button
              onClick={onOpenQuote}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 flex items-center justify-center gap-2 transition-colors"
            >
              <span>Schedule Fleet Consultation</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
