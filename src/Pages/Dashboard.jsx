/* eslint-disable no-unused-vars */
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";




export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // ✅ التعديل: قراءة النتيجة واسم الملف ومستوى الخبرة معاً من الـ state
  const { result, fileName, careerTitle } = location.state || {};

  const experienceLevel = result?.experience_level || "junior";
  const isPathSuitable = result?.is_path_suitable ?? true;
  const aiPathFeedback = result?.ai_path_feedback || "";
  const aiAtsReport = result?.ats_analysis?.ai_ats_report || "";




  // 🔗 ربط البيانات الحقيقية (مع قيم افتراضية آمنة عشان نقدر نستدعي
  // كل الـ hooks تحت قبل أي early return، بدون ما نخالف Rules of Hooks)
  const pathData = result?.career_paths?.[0] || {};
  const skills = pathData.matched_skills || [];
  const missing = pathData.missing_skills || [];
  const finalMatch = result?.match || 0;
  const finalScore = result?.score || 0;
  const feedback = result?.feedback || "CV Analysis completed successfully.";

  // 🔥 State الخاص بالعدادات — لازم يكون قبل أي return عشان نلتزم بـ Rules of Hooks
  const [score, setScore] = useState(0);
  const [match, setMatch] = useState(0);
  const [typed, setTyped] = useState("");
  const [activeJobTab, setActiveJobTab] = useState("all");

  // حماية الصفحة
  useEffect(() => {
    if (!result) {
      navigate("/upload");
    }
  }, [result, navigate]);

  // 🔥 تحريك العدادات
  useEffect(() => {
    let s = 0, m = 0;
    const interval = setInterval(() => {
      if (s < finalScore) setScore(++s);
      if (m < finalMatch) setMatch(++m);
      if (s >= finalScore && m >= finalMatch) clearInterval(interval);
    }, 15);
    return () => clearInterval(interval);
  }, [finalScore, finalMatch]);

  // 🔥 تأثير الكتابة التلقائي
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      setTyped(feedback.slice(0, i));
      i++;
      if (i > feedback.length) clearInterval(t);
    }, 12);
    return () => clearInterval(t);
  }, [feedback]);

  // ⚠️ كل الـ hooks فوق هاد السطر — الـ early return لازم يكون بعدهن دائماً
  if (!result) return null;

  // 💡 بيانات تجريبية (Mock Data) لاختبار واجهة ATS حتى يتم ربطها بالبايثون
  const atsData = result.ats_analysis || {
    is_compliant: false,
    score: 65,
    issues: [
      "تم اكتشاف استخدام أعمدة (Columns) مما قد يعيق قراءة بعض أنظمة ATS.",
      "استخدام عناوين غير قياسية (مثل: 'My Journey' بدلاً من 'Experience').",
      "نقص في استخدام المصطلحات الدقيقة من الوصف الوظيفي."
    ],
    passed: [
      "خلو السيرة الذاتية من الجداول والصور المعقدة.",
      "تم استخدام خطوط قياسية (Standard Fonts) ومقروءة.",
      "تم تجنب الرسومات البيانية (Charts)."
    ]
  };

  const missingSkills = pathData.missing_skills || [];


  // 🔥 فرز المهارات الناقصة لمجموعتين بناءً على importance القادمة من الباك إند:
  // "required" = مهارة مهمة، غيرها = يفضل تعلمها
  const importantMissing = missing.filter((m) => m.importance === "required");
  const recommendedMissing = missing.filter((m) => m.importance !== "required");

  const roadmap = result.roadmap || ["Follow the structured path for better skills profile."];

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-10" >

      {/* 🌟 الشريط العلوي الجديد (Top Bar) 🌟 */}
      <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 bg-gray-800/50 p-8 rounded-xl mb-8 shadow-lg border border-gray-700">
        
        {/* قسم عرض اسم الملف (يسار) */}
        <div className="flex items-center gap-3 justify-center md:justify-start">
          <div className="bg-blue-500/20 p-2 rounded-lg border border-blue-500/50 text-2xl">
            📄
          </div>
          <div>
            <p className="text-xl text-gray-400">الملف الذي تم تحليله:</p>
            <div className="flex items-center gap-2">
              <p className="text-xl font-semibold text-blue-400" dir="ltr">
                {fileName || "سيرة_ذاتية_غير_معروفة.pdf"}
              </p>
            </div>
          </div>
        </div>

        {/* المسار المختار (وسط الشريط بالكامل) */}
        <div className="flex items-center justify-center">
          {careerTitle && (
            <div className="flex items-center gap-3">
              {/* <div className="bg-purple-500/20 p-2 rounded-lg border border-purple-500/50 text-2xl">
                
              </div> */}
              <div>
                <p className="text-xl text-gray-400 text-center">المسار المختار:</p>
                <p className="text-xl font-semibold text-purple-400 text-center">
                  {careerTitle}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* زر العودة للرفع */}
        <div className="flex justify-center md:justify-end gap-5">
          
          <button 
            onClick={() => navigate("/upload")}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-6 py-2 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
          >
            <span className="text-xl">رفع ملف جديد</span>
            <span className="text-2xl">📤</span>
          </button>

          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-5 py-2 rounded-lg font-medium transition-all"
          >
            <span className="text-xl">الرئيسية</span>
            <span className="text-2xl">🏠</span>
          </button>
        </div>
      </div>

      {/* 🔥 النتيجة الإجمالية + AI Analysis Feedback (مدموجين بنفس البطاقة) */}
      <div className="bg-white/10 p-6 md:p-8 rounded-xl mb-10">
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-6 rounded-xl hover:scale-105 transition">
            <p className="text-2xl"> التقييم الاجمالي </p>
            <h2 className="text-4xl">{score}%</h2>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 rounded-xl hover:scale-105 transition">
            <p className="text-2xl"> المهارات المكتشفة </p>
            <h2 className="text-4xl">{skills.length}</h2>
          </div>

        </div>
      </div>



      {/* ========================================================= */}
{/* 🧠 قسم تقييم واستشارة الذكاء الاصطناعي المستقل (AI Feedback) */}
{/* ========================================================= */}
<div className="mt-12 bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8 rounded-2xl border border-purple-500/20 shadow-2xl relative overflow-hidden text-right" dir="rtl">
  
  {/* تأثير متوهج خفيف بالخلفية متوافق مع تصميمك */}
  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 blur-3xl rounded-full"></div>

  <div className="flex items-center gap-4 mb-8">
    <div className="p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20">
      <span className="text-4xl">🤖</span>
    </div>
    <div>
      <h3 className="text-2xl font-bold text-white">التقييم الاستشاري الذكي (AI Feedback)</h3>
      <p className="text-gray-400 text-xl mt-1">توجيهات وملاحظات نموذج Gemini المخصصة لملفك المهني</p>
    </div>
  </div>

  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
    
    {/* صندوق 1: تقييم ملاءمة المسار والمستوى المهني */}
    <div className="lg:col-span-1 bg-black/40 p-6 rounded-xl border border-gray-700/50 flex flex-col justify-between gap-4">
      <div>
        <h4 className="text-gray-400 font-semibold mb-3 text-xl">ملاءمة مسار ({careerTitle}):</h4>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">{isPathSuitable ? '✅' : '⚠️'}</span>
          <span className={`text-lg font-bold ${isPathSuitable ? 'text-green-400' : 'text-orange-400'}`}>
            {isPathSuitable ? 'المسار مناسب لمهاراتك' : 'ينصح بمراجعة الخيارات'}
          </span>
        </div>
      </div>
      
      <div className="pt-4 border-t border-gray-800/60">
        <h4 className="text-gray-400 font-semibold mb-2 text-xl"> المستوى المهني المستنتج:</h4>
        <span className={`inline-block px-4 py-1.5 rounded-full text-l font-bold shadow-sm ${
          experienceLevel === 'senior' 
            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
        }`}>
          {experienceLevel === 'senior' ? 'خبير (Senior)' : 'مبتدئ / متوسط (Junior)'}
        </span>
      </div>
    </div>

    {/* صندوق 2: النصيحة المهنية التفصيلية وتوصية المسار من Gemini */}
    <div className="lg:col-span-2 bg-black/40 p-6 rounded-xl border border-gray-700/50">
      <h4 className="text-gray-400 font-semibold mb-3 text-2xl flex items-center gap-2">
        <span>💡</span> التوجيه المهني المخصص:
      </h4>
      <p className="text-gray-200 leading-relaxed text-justify whitespace-pre-line text-base text-xl">
        {aiPathFeedback || "جاري معالجة التوصيات المهنية..."}
      </p>
    </div>

  </div>

  {/* صندوق 3: نصائح تحسين الصياغة للهيكلية و ATS الذكي */}
  {aiAtsReport && (
    <div className="mt-6 bg-black/60 p-6 rounded-xl border border-purple-500/15 relative z-10">
      <h1 className="text-purple-400 font-bold mb-3 flex items-center gap-2 text-2xl">
        <span className="text-2xl">📝</span> إرشادات صياغة السيرة الذاتية لـ ATS (رأي الذكاء الاصطناعي):
      </h1>
      <div className="bg-gray-950/80 p-5 rounded-lg border border-gray-800">
        <p className="text-gray-300 leading-loose text-justify whitespace-pre-line text-xl">
          {aiAtsReport}
        </p>
      </div>
    </div>
  )}

</div>


    {/* 🔥 تقرير توافق الـ ATS الفعلي 🔥 */}
      <div id="ats-report" className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-xl mb-10 shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="font-bold text-2xl text-white flex items-center gap-2">
              <span>⚙️</span> تقرير نظام تتبع التقديم للوظائف
            </h2>
            <p className="text-gray-400 text-xl mt-1">تحليل دقيق لهيكلية السيرة الذاتية ومدى توافقها مع أنظمة التوظيف الآلي.</p>
          </div>
          
          {/* دائرة النسبة المئوية للـ ATS */}
          <div className={`px-5 py-2 rounded-xl border-2 text-lg font-bold flex items-center gap-2 shadow-sm ${
            atsData.is_compliant 
              ? "bg-green-500/10 text-green-400 border-green-500/50" 
              : "bg-orange-500/10 text-orange-400 border-orange-500/50"
          }`}>
            <span>Score:</span>
            <span className="text-2xl">{atsData.score}%</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ❌ الأخطاء التي يجب إصلاحها */}
          <div className="bg-red-500/5 p-6 rounded-xl border border-red-500/20 shadow-inner">
            <h3 className="text-red-400 font-bold mb-4 text-lg flex items-center gap-2">
              <span>⚠️</span> قضايا تحتاج إلى تعديل
            </h3>
            <ul className="space-y-3">
              {atsData.issues.map((issue, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-300 text-sm md:text-base leading-relaxed">
                  <span className="text-red-500 mt-0.5 text-2xl">✖</span>
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ✅ المعايير الناجحة */}
          <div className="bg-green-500/5 p-6 rounded-xl border border-green-500/20 shadow-inner">
            <h3 className="text-green-400 font-bold mb-4 text-lg flex items-center gap-2">
              <span>✅</span> معايير تم اجتيازها
            </h3>
            <ul className="space-y-3">
              {atsData.passed.map((pass, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-300 text-sm md:text-base leading-relaxed">
                  <span className="text-green-500 mt-0.5 text-2xl">✔</span>
                  <span>{pass}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>



      {/* 🔥 SKILL GAP */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        
        {/* قسم المهارات المطابقة */}
        <div className="bg-green-500/10 border border-green-500 p-6 rounded-xl flex flex-col">
          <h2 className="text-green-400 mb-6 font-bold text-lg">✔ المهارات المتوافقة </h2>
          {skills.length === 0 ? (
            <p className="text-gray-400 text-sm"> لا توجد مهارات متوافقة </p>
          ) : (
            /* 🔥 التعديل هنا: شبكة من عامودين للمهارات */
            <div className="grid grid-cols-2 gap-3">
              {skills.map((s, i) => (
                <div 
                  key={i} 
                  className="bg-green-500/20 p-3 rounded-lg hover:scale-105 transition font-medium flex items-center justify-center text-center border border-green-500/30"
                >
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* قسم المهارات الناقصة */}
        <div className="bg-red-500/10 border border-red-500 p-6 rounded-xl flex flex-col">
          <h2 className="text-red-400 mb-6 font-bold text-lg">✖ المهارات المطلوبة لهذا المسار </h2>
          {missing.length === 0 ? (
            <p className="text-green-400 text-sm">ممتاز! انت تمتلك جميع المهارات المطلوبة</p>
          ) : (
            <div className="flex-grow flex flex-col gap-6">
              {/* 🔴 مهارات مهمة (required) */}
              <div>
                <p className="text-red-300 text-xs font-bold mb-3 uppercase tracking-wide flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-400"></span>
                  مهمة
                </p>
                {importantMissing.length === 0 ? (
                  <p className="text-gray-400 text-sm">لا توجد مهارات أساسية ناقصة 🎉</p>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {importantMissing.map((m, i) => (
                      <div
                        key={i}
                        className="bg-red-500/20 p-3 rounded-lg hover:scale-105 transition font-medium flex items-center justify-center text-center border border-red-500/30"
                      >
                        {m.skill}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* خط فاصل بين القسمين */}
              <div className="border-t border-white/10"></div>

              {/* 🟡 مهارات يفضل تعلمها (nice_to_have) */}
              <div className="flex-grow">
                <p className="text-yellow-300 text-xs font-bold mb-3 uppercase tracking-wide flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                  يفضل تعلمها
                </p>
                {recommendedMissing.length === 0 ? (
                  <p className="text-gray-400 text-sm">لا توجد مهارات إضافية مقترحة حالياً.</p>
                ) : (
                  <div className="grid grid-cols-2 gap-3 content-start">
                    {recommendedMissing.map((m, i) => (
                      <div
                        key={i}
                        className="bg-yellow-500/10 p-3 rounded-lg hover:scale-105 transition font-medium flex items-center justify-center text-center border border-yellow-500/30 text-yellow-200"
                      >
                        {m.skill}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          {missing.length > 0 && (
            <button
              onClick={() => document.getElementById("courses").scrollIntoView({ behavior: "smooth" })}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-bold hover:scale-[1.02] transition shadow-md"
            >
              تعلم المهارات المطلوبة
            </button>
          )}
        </div>
      </div>

      {/* 🔥 ROADMAP */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-8 rounded-2xl mb-10" dir="rtl">
  <div className="flex items-center gap-4 mb-10">
    <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-lg shrink-0">
      🗺️
    </div>
    <h2 className="font-bold text-3xl text-blue-400">خارطة التعلم العملي</h2>
  </div>

  <div className="flex flex-col">
    {roadmap.map((step, i) => {
      const isLeft = i % 2 === 0;
      const isArrowLeft = !isLeft;
      const colors = [
        { bg: "from-blue-500 to-cyan-400", border: "border-blue-500/30", glow: "shadow-blue-500/20", hoverBorder: "hover:border-blue-500/60" },
        { bg: "from-purple-500 to-pink-400", border: "border-purple-500/30", glow: "shadow-purple-500/20", hoverBorder: "hover:border-purple-500/60" },
        { bg: "from-pink-500 to-orange-400", border: "border-pink-500/30", glow: "shadow-pink-500/20", hoverBorder: "hover:border-pink-500/60" },
      ];
      const color = colors[i % colors.length];
      const isLast = i === roadmap.length - 1;

      return (
        <div key={i}>
          {/* بطاقة الخطوة */}
          <div className={`flex ${isLeft ? "justify-start" : "justify-end"}`}>
            <div
              className={`w-full md:w-[60%] bg-white/5 backdrop-blur-md border ${color.border} ${color.hoverBorder} p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl ${color.glow} group`}
            >
              <div className="flex items-center gap-4 ${isLeft ? 'justify-end' : 'justify-start'}">
                <div
                  className={`w-10 h-10 shrink-0 rounded-full bg-gradient-to-br ${color.bg} flex items-center justify-center font-bold text-sm text-white group-hover:scale-110 transition-transform duration-300 shadow-md`}
                >
                  {i + 1}
                </div>
                <p className="text-gray-100 text-lg leading-relaxed text-right">{step}</p>
              </div>
            </div>
          </div>

          {/* السهم المنحني الواصل للخطوة التالية */}
          {!isLast && (
            <div
              className={`flex ${
                isLeft
                  ? "justify-start pr-[40%] md:pr-[33%]"
                  : "justify-end pl-[40%] md:pl-[33%]"
              } h-36 overflow-visible`}
            >
              <svg
                width="420"
                height="140"
                viewBox="0 0 180 140"
                className="overflow-visible"
              >
                {/* Main Path */}
                <motion.path
                  d={
                    isArrowLeft
                      ? "M20 5 C20 70,20 70,90 70 S160 70 160 135"
                      : "M160 5 C160 70,160 70,90 70 S20 70 20 135"
                  }
                  stroke="#ffffff"
                  strokeOpacity="0.15"
                  strokeWidth="2.5"
                  fill="none"
                  strokeDasharray="8 8"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 1.2,
                    ease: "easeInOut",
                  }}
                />

                {/* Moving Glow */}
                <motion.circle
                  r="5"
                  fill="#60A5FA"
                  filter="url(#glow)"
                >
                  <animateMotion
                    dur="3s"
                    repeatCount="indefinite"
                    path={
                      isArrowLeft
                        ? "M20 5 C20 70,20 70,90 70 S160 70 160 135"
                        : "M160 5 C160 70,160 70,90 70 S20 70 20 135"
                    }
                  />
                </motion.circle>

                {/* Arrow */}
                <motion.path
                  d={
                    isArrowLeft
                      ? "M152 124 L160 135 L168 124"
                      : "M12 124 L20 135 L28 124"
                  }
                  stroke="#ffffff"
                  strokeOpacity="0.3"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    delay: 1,
                  }}
                />

                {/* Glow Filter */}
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
              </svg>
            </div>
          )}
        </div>
      );
    })}
  </div>
</div>



        {/* 🔥 Courses section */}

     {missingSkills.length > 0 && (
  <div id="courses" className="mt-12" dir="rtl">
    <h2 className="mb-8 font-bold text-3xl text-blue-400 flex items-center gap-4">
      <span className="text-4xl drop-shadow-md">📚</span> مسارات التعلم المقترحة
    </h2>
    
    <div className="flex flex-wrap justify-center gap-8">
      {[...importantMissing, ...recommendedMissing].map((item, i) => {
        const isRequired = item.importance === "required"; 

        return (
          <div key={i} className="w-full sm:w-[calc(50%-16px)] lg:w-[calc(33.333%-22px)] bg-white/5 backdrop-blur-md border border-white/10 hover:border-blue-500/50 rounded-2xl p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-blue-500/20 group">
            
            <div className="flex justify-between items-start mb-6">
              <div className="bg-white/10 p-3.5 rounded-xl border border-white/5 text-blue-400 group-hover:bg-blue-500/20 group-hover:scale-110 transition-all duration-300">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <span className={`text-[20px] font-bold px-4 py-2 rounded-full border ${isRequired ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                {isRequired ? 'أساسي' : 'إضافي'}
              </span>
            </div>
            
            <div className="mb-8">
              <h3 className="font-bold text-2xl text-gray-100 mb-3">{item.skill}</h3>
              <p className="text-white/50 text-[20px] leading-relaxed">
                {isRequired ? 'مهارة حاسمة لتجاوز فلاتر الـ ATS.' : 'مهارة مميزة ترفع من قوة سيرتك الذاتية.'}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-auto">
              <a
                href={`https://www.coursera.org/search?query=${encodeURIComponent(item.skill)}`}
                target="_blank"
                rel="noreferrer"
                className="flex justify-center items-center bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 py-3.5 rounded-xl text-[19px] font-bold transition-all"
              >
                Coursera
              </a>
              
              <a
                href={`https://www.udemy.com/courses/search/?src=ukw&q=${encodeURIComponent(item.skill)}`}
                target="_blank"
                rel="noreferrer"
                className="flex justify-center items-center bg-purple-600/10 hover:bg-purple-600 text-purple-400 hover:text-white border border-purple-500/30 py-3.5 rounded-xl text-[19px] font-bold transition-all"
              >
                Udemy
              </a>

              <a
                href={`https://www.freecodecamp.org/news/search/?query=${encodeURIComponent(item.skill)}`}
                target="_blank"
                rel="noreferrer"
                className="flex justify-center items-center bg-[#0a0a23]/30 hover:bg-[#0a0a23] text-gray-300 hover:text-white border border-gray-500/30 hover:border-[#0a0a23] py-3.5 rounded-xl text-[19px] font-bold transition-all"
              >
                freeCodeCamp
              </a>

              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(item.skill + " full course")}`}
                target="_blank"
                rel="noreferrer"
                className="flex justify-center items-center bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 py-4 rounded-xl text-[16px] font-bold transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-red-500/20 group"
              >
                YouTube
              </a>
            </div>

          </div>
        );
      })}
    </div>
  </div>
)}





      
      {/* 🔥 JOBS */}
      <div className="bg-white/5 backdrop-blur-md p-8 rounded-2xl mt-12 border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)]" dir="rtl">
  <div className="flex items-center gap-4 mb-5">
    <div className="bg-white/10 p-3.5 rounded-xl border border-white/5 text-blue-400">
      <span className="text-3xl">💼</span>
    </div>
    <h2 className="font-bold text-3xl text-blue-400">فرص عمل حقيقية</h2>
  </div>

  <p className="text-white/60 mb-8 text-[22px] leading-relaxed">
    ابحث عن أحدث الشواغر المطابقة لمسارك كـ 
    <span className="inline-block font-bold text-blue-300 px-3 py-1.5 mx-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
      {pathData.title || "Developer"}
    </span>
    في المنصات التالية:
  </p>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
    {/* LinkedIn */}
    <a
      href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(pathData.title || "Developer")}`}
      target="_blank"
      rel="noreferrer"
      className="flex justify-center items-center gap-3 bg-[#0077b5]/10 hover:bg-[#0077b5] text-[#0077b5] hover:text-white border border-[#0077b5]/30 py-4 rounded-xl text-[16px] font-bold transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#0077b5]/20 group"
    >
      <span className="text-xl">LinkedIn</span>
      <svg className="w-8 h-8 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
    </a>

    {/* We Work Remotely */}
    <a
      href={`https://weworkremotely.com/remote-jobs/search?term=${encodeURIComponent(pathData.title || "Developer")}`}
      target="_blank"
      rel="noreferrer"
      className="flex justify-center items-center gap-3 bg-white hover:bg-black text-black hover:text-white border border-gray-300 py-4 rounded-xl text-[16px] font-bold transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group"
    >
      <span className="text-xl">We Work Remotely</span>
      <img src="/src/assets/wework.png" alt="" className="w-8 h-8 group-hover:scale-110 transition-transform" />
      {/* <span className="text-xl group-hover:scale-110 transition-transform">🌍</span> */}
    </a>

    {/* Forsa */}
    <a
      href={`https://forsa.sy/jobs.html?Text=${encodeURIComponent(pathData.title || "Developer")}`}
      target="_blank"
      rel="noreferrer"
      className="flex justify-center items-center gap-3 bg-purple-500/10 hover:bg-purple-600 text-purple-400 hover:text-white border border-purple-500/30 py-4 rounded-xl text-[16px] font-bold transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/20 group"
    >
      <span className="text-xl">منصة فرصة</span>
      <img src="/src/assets/forsa.png" alt="" className="w-8 h-8 group-hover:scale-110 transition-transform" />
      {/* <span className="text-xl group-hover:scale-110 transition-transform">🎯</span> */}
    </a>
  </div>
</div>

</div>)}