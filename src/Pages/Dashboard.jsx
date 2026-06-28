/* eslint-disable no-unused-vars */
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // ✅ التعديل: قراءة النتيجة واسم الملف معاً من الـ state
  const { result, fileName, careerTitle } = location.state || {};

  // حماية الصفحة
  useEffect(() => {
    if (!result) {
      navigate("/upload");
    }
  }, [result, navigate]);

  if (!result) return null;

  // 🔗 ربط البيانات الحقيقية
  const pathData = result.career_paths?.[0] || {};

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
  
  const skills = pathData.matched_skills || [];
  const missing = pathData.missing_skills || [];

  // 🔥 فرز المهارات الناقصة لمجموعتين بناءً على importance القادمة من الباك إند:
  // "required" = مهارة مهمة، غيرها = يفضل تعلمها
  const importantMissing = missing.filter((m) => m.importance === "required");
  const recommendedMissing = missing.filter((m) => m.importance !== "required");

  const finalMatch = result.match || 0;
  const finalScore = result.score || 0;
  const feedback = result.feedback || "CV Analysis completed successfully.";
  const roadmap = result.roadmap || ["Follow the structured path for better skills profile."];
  

  const courses = missing.map(skill => ({
    name: `${skill} Course`,
    link: `https://www.coursera.org/courses?query=${encodeURIComponent(skill)}`
  }));

  // 🔥 State الخاص بالعدادات
  const [score, setScore] = useState(0);
  const [match, setMatch] = useState(0);
  const [typed, setTyped] = useState("");
  const [activeJobTab, setActiveJobTab] = useState("all");

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-10">

      {/* 🌟 الشريط العلوي الجديد (Top Bar) 🌟 */}
      <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 bg-gray-800/50 p-4 rounded-xl mb-8 shadow-lg border border-gray-700">
        
        {/* قسم عرض اسم الملف (يسار) */}
        <div className="flex items-center gap-3 justify-center md:justify-start">
          <div className="bg-blue-500/20 p-2 rounded-lg border border-blue-500/50 text-2xl">
            📄
          </div>
          <div>
            <p className="text-lg text-gray-400">الملف الذي تم تحليله:</p>
            <p className="text-lg font-semibold text-blue-400" dir="ltr">
              {fileName || "سيرة_ذاتية_غير_معروفة.pdf"}
            </p>
          </div>
        </div>

        {/* المسار المختار (وسط الشريط بالكامل) */}
        <div className="flex items-center justify-center">
          {careerTitle && (
            <div className="flex items-center gap-3">
              {/* <div className="bg-purple-500/20 p-2 rounded-lg border border-purple-500/50 text-2xl">
                
              </div> */}
              <div>
                <p className="text-lg text-gray-400 text-center">المسار المختار:</p>
                <p className="text-lg font-semibold text-purple-400 text-center">
                  {careerTitle}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* زر العودة للرفع */}
        <div className="flex justify-center md:justify-end">
          <button 
            onClick={() => navigate("/upload")}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-6 py-2 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
          >
            <span>رفع ملف جديد</span>
            <span className="text-xl">📤</span>
          </button>
        </div>
      </div>

      {/* 🔥 النتيجة الإجمالية + AI Analysis Feedback (مدموجين بنفس البطاقة) */}
      <div className="bg-white/10 p-6 md:p-8 rounded-xl mb-10">
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 rounded-xl hover:scale-105 transition">
            <p> التقييم الاجمالي </p>
            <h2 className="text-3xl">{score}%</h2>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 rounded-xl hover:scale-105 transition">
            <p> المهارات المكتشفة </p>
            <h2 className="text-3xl">{skills.length}</h2>
          </div>

        </div>

        <div className="flex items-center gap-3 mb-4 pt-6 border-t border-white/10">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-lg shrink-0">
            🤖
          </div>
          <h2 className="font-bold text-lg text-white"> ملاحظات الذكاء الصناعي </h2>
        </div>

        <p className="text-gray-300 leading-relaxed">
          {typed}
          <span className="animate-pulse">|</span>
        </p>
      </div>

    {/* 🔥 تقرير توافق الـ ATS الفعلي 🔥 */}
      <div id="ats-report" className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-xl mb-10 shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="font-bold text-2xl text-white flex items-center gap-2">
              <span>⚙️</span> تقرير نظام تتبع التقديم للوظائف
            </h2>
            <p className="text-gray-400 text-l mt-1">تحليل دقيق لهيكلية السيرة الذاتية ومدى توافقها مع أنظمة التوظيف الآلي.</p>
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
                  <span className="text-red-500 mt-0.5">✖</span>
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
                  <span className="text-green-500 mt-0.5">✔</span>
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
      <div className="bg-white/10 p-6 rounded-xl mb-10">
        <h2 className="mb-6 font-bold"> خارطة التعلم العملي </h2>
        <div className="space-y-4">
          {roadmap.map((step, i) => (
            <div key={i} className="flex items-center gap-4 hover:translate-x-1 transition">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center font-bold">
                {i + 1}
              </div>
              <div className="bg-white/5 p-3 rounded-lg w-full">
                {step}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🔥 COURSES */}
      {missingSkills.length > 0 && (
        <div id="courses" className="bg-white/10 p-6 md:p-7 rounded-xl mb-10 shadow-lg border border-gray-700/50">
          <h2 className="mb-6 font-bold text-xl md:text-2xl text-blue-400 flex items-center gap-2">
            <span>📚</span> مسارات التعلم المقترحة
          </h2>
          
          <div className="flex flex-wrap justify-center gap-6">
            {/* 🔥 ترتيب المهارات المهمة أولاً، ثم المستحسنة */}
            {[...importantMissing, ...recommendedMissing].map((item, i) => (
              <div key={i} className="w-full md:w-[49%] lg:w-[32%] bg-gray-800 border border-gray-700 p-6 rounded-xl flex flex-col items-center gap-5 hover:border-blue-500/50 transition group shadow-md">
                <span className="font-bold text-lg md:text-xl text-gray-200 text-center">
                   <span className="text-blue-400">{item.skill}</span>  تعلم
                </span>
                
                <div className="flex w-full gap-3">
                  {/* زر Coursera */}
                  <a
                    href={`https://www.coursera.org/search?query=${encodeURIComponent(item.skill)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex justify-center items-center gap-2 bg-[#0056D2] hover:bg-[#0043A8] text-white py-2.5 rounded-lg text-sm md:text-base font-bold transition hover:scale-[1.03] shadow-sm"
                  >
                    Coursera
                  </a>

                  {/* زر YouTube */}
                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(item.skill + " full course")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex justify-center items-center gap-2 bg-[#FF0000] hover:bg-[#CC0000] text-white py-2.5 rounded-lg text-sm md:text-base font-bold transition hover:scale-[1.03] shadow-sm"
                  >
                    YouTube
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🔥 JOBS */}
      <div className="bg-white/10 p-6 rounded-xl mt-10 border border-gray-700/50 shadow-lg">
        <h2 className="mb-2 font-bold text-2xl text-blue-400"> فرص عمل حقيقية</h2>
        <p className="text-gray-400 mb-6 text-l">
          ابحث عن أحدث الشواغر المطابقة لمسارك كـ <span className="font-bold text-white px-2 py-1 bg-gray-800 rounded">{pathData.title || "Developer"}</span> في المنصات التالية:
        </p>

        <div className="flex flex-col md:flex-row gap-4">
          {/* زر LinkedIn */}
          <a
            href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(pathData.title || "Developer")}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex justify-center items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-500 p-6 rounded-xl hover:scale-105 transition"
          >
            <span className="text-l">البحث في LinkedIn</span>
            <span className="text-xl">💼</span>
          </a>

           {/* زر wellfound */}
          <a
            href={`https://weworkremotely.com/remote-jobs/search?term=${encodeURIComponent(pathData.title || "Developer")}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex justify-center items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-500 p-6 rounded-xl hover:scale-105 transition"
          >
            <span className="text-l">البحث في We Work Remotly</span>
          </a>

         {/* زر موقع فرصة */}
          <a
            href={`https://forsa.sy/jobs.html?Text=${encodeURIComponent(pathData.title || "Developer")}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex justify-center items-center gap-3 bg-gradient-to-r from-purple-500 to-blue-500 p-6 rounded-xl hover:scale-105 transition"
          >
            <span className="text-l">البحث في منصة فرصة</span>
            <span className="text-xl">🎯</span>
          </a>
        </div>
      </div>

    </div> // هذه هي إغلاقة الـ div الرئيسي للداشبورد
  );
}