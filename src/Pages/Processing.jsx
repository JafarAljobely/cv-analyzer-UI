  import { useEffect, useState } from "react";
  import { useNavigate, useLocation } from "react-router-dom";
  import { motion } from "framer-motion";

  export default function Processing() {
    const navigate = useNavigate();
    const location = useLocation();

    // جلب الملف من صفحة الرفع
    const { file, career } = location.state || {};

    const [progress, setProgress] = useState(0);
    const [displayText, setDisplayText] = useState("");
    const [errorMessage, setErrorMessage] = useState("");    

    const messages = [
      " رفع الملف",
      " تحليل المحتوى",
      " استخراج المهارات",
      " مطابقة المسار المطلوب ",
      " توليد التوصيات"
    ];

    const safeInt = (value) => {
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? 0 : parsed;
    };

    // 1️⃣ تأثير كتابة الكلمات المتحركة
    useEffect(() => {
      let msgIndex = 0;
      let charIndex = 0;
      const typing = setInterval(() => {
        const msg = messages[msgIndex];
        if (!msg) { clearInterval(typing); return; }
        setDisplayText(msg.slice(0, charIndex));
        charIndex++;
        if (charIndex > msg.length) {
          charIndex = 0;
          msgIndex++;
          if (msgIndex >= messages.length) clearInterval(typing);
        }
      }, 50);
      return () => clearInterval(typing);
    }, []);

    // 2️⃣ إرسال الطلب للسيرفر وإدارة العداد اللانهائي المرن
    // 2️⃣ إرسال الطلب للسيرفر وإدارة العداد بالسرعة الموزونة تدريجياً
    useEffect(() => {
      let progressInterval;
      let currentProgress = 0;

      // دالة ديناميكية لتغيير سرعة العداد بناءً على النسبة الحالية
      const startDynamicInterval = (currentVal) => {
        clearInterval(progressInterval);

        // إذا وصلنا لـ 95% والباك إند لسه شغال، يثبت تماماً وينتظر
        if (currentVal >= 95) return;

        // تحديد وقت التأخير (كل ما زاد الرقم كل ما تباطأ العداد)
        let delay = 100; // سريع جداً في البداية (من 0 لـ 40)
        if (currentVal >= 40 && currentVal < 70) {
          delay = 200;   // سرعة متزنة (من 40 لـ 70)
        } else if (currentVal >= 70) {
          delay = 250;   // بطيء ومنتظم (من 70 لـ 95)
        }

        progressInterval = setInterval(() => {
          currentProgress += 1; // زيادة طبيعية ومريحة للعين (أرقام صحيحة دائماً)
          setProgress(currentProgress);
          
          // إعادة تشغيل الدالة لتطبيق السرعة الجديدة (التبطئة) بناءً على النسبة الجديدة
          if (currentProgress === 40 || currentProgress === 70 || currentProgress >= 95) {
            startDynamicInterval(currentProgress);
          }
        }, delay);
      };

      const runAnalysis = async () => {
        if (!file || !career) {
          navigate("/upload");
          return;
        }

        // إطلاق العداد الديناميكي
        startDynamicInterval(0);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("career_path", career);

        try {
          const response = await fetch("http://127.0.0.1:8000/analyze", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            throw new Error(errData.detail || `Server Error: ${response.status}`);
          }

          const data = await response.json();
          const targetPath = data.career_paths?.[0] || {};

          // 🔥 بناء نص تحليل أغنى: يوضح نتيجة المسار المختار، يقارنه بالمسار
          // الأفضل توافقاً (إن وُجد مسار آخر أفضل)، ويذكر عدد المهارات
          // الأساسية الناقصة كخطوة عملية تالية للمستخدم.
          const chosenTitle = targetPath.title || career;
          const topRecommendation = data.top_recommendation || chosenTitle;
          const matchScore = safeInt(targetPath.match_score) || 0;
          const requiredMissingCount = (targetPath.missing_skills || []).filter(
            (m) => (typeof m === "object" ? m.importance : null) === "required"
          ).length;

          const isChosenTheBest =
            chosenTitle.toLowerCase() === topRecommendation.toLowerCase();

          let feedbackText = "";
          if (isChosenTheBest) {
            feedbackText = `Great choice! Your CV matches ${chosenTitle} at ${matchScore}%, making it your strongest career path based on the skills you listed.`;
          } else {
            feedbackText = `Your CV matches ${chosenTitle} at ${matchScore}%. However, your skill set aligns even more closely with ${topRecommendation} — you may want to explore that path too.`;
          }

          if (requiredMissingCount > 0) {
            feedbackText += ` To strengthen your profile for ${chosenTitle}, focus on closing ${requiredMissingCount} core skill${requiredMissingCount > 1 ? "s" : ""} first.`;
          } else {
            feedbackText += ` You already cover all the core skills required for ${chosenTitle} — nice work!`;
          }

          // تنسيق البيانات بناءً على طلب ملف Dashboard.jsx
        const formattedResult = {
          career_paths: [{
            title: targetPath.title || career, 
            matched_skills: data.extracted_skills || [],
            // 🔥 تمرير missing_skills كاملة (بصيغة {skill, importance}) بدون تحويلها لنص
            // بسيط، لأن Dashboard.jsx يحتاج importance لفرز "مهمة" / "يفضل تعلمها"
            missing_skills: targetPath.missing_skills || []
          }],
          match: safeInt(targetPath.match_score) || 0,
          score: safeInt(targetPath.match_score) || 0,
          feedback: feedbackText,
          roadmap: targetPath.missing_skills?.map(item => `Master ${typeof item === 'object' ? item.skill : item} concepts`) || [],
          jobs: [
            { title: `${targetPath.title || career} Specialist`, company: "AI Recommended Role", match: safeInt(targetPath.match_score) || 0 }
          ],
          // 🔥 السطر الجديد: تمرير بيانات الـ ATS القادمة من الباك إند (data) إلى الداشبورد
          ats_analysis: data.ats_analysis
        };

        // الانتقال الطبيعي للداشبورد
        // الانتقال الطبيعي للداشبورد
        // الانتقال الطبيعي للداشبورد (تعديل آمن جداً)
        setTimeout(() => {
          navigate("/dashboard", { 
            state: { 
              result: formattedResult, 
              fileName: file.name,
              // أخذنا الاسم من النتيجة المجهزة بدلاً من المتغيرات القديمة
              careerTitle: formattedResult.career_paths[0]?.title || career || "Developer" 
            } 
          });
        }, 500);

        } catch (error) {
          clearInterval(progressInterval);
          console.error(error);
          setErrorMessage(error.message);
        }
      };

      runAnalysis();

      return () => clearInterval(progressInterval);
    }, [file, career, navigate]);

    // 🛡️ شاشة الأخطاء
    if (errorMessage) {
      return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
          <div className="bg-red-500/20 border border-red-500 p-6 rounded-xl text-center max-w-md">
            <h2 className="text-xl font-bold mb-4 text-red-400">❌ Analysis Failed</h2>
            <p className="text-gray-300 mb-6">{errorMessage}</p>
            <button onClick={() => navigate("/upload")} className="bg-blue-500 px-4 py-2 rounded">
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.4 }}
        className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col items-center justify-center text-white">
          
        <div className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>

        <h2 className="text-xl font-semibold mb-4 h-8">{displayText}</h2>

        {/* شريط التحميل */}
        <div className="w-80 bg-gray-700 h-3 rounded-full overflow-hidden mb-4">
          <div
            className="h-3 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-blue-400 font-mono font-medium text-lg animate-pulse">
         % يتم الان التحميل: {progress}
        </p>
      </motion.div>
    );
  }