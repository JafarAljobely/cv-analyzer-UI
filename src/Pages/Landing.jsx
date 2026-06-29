import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div dir="rtl" className="relative min-h-screen overflow-hidden bg-black text-white ">

      {/* Glow Background */}
      <div className="absolute w-[600px] h-[600px] bg-blue-600 rounded-full blur-[200px] opacity-30 top-[-100px] left-[-100px]" />
      <div className="absolute w-[600px] h-[600px] bg-purple-600 rounded-full blur-[200px] opacity-30 bottom-[-100px] right-[-100px]" />

      {/* Navbar */}
      <nav className="relative flex justify-between items-center p-6 z-10">
        <h1 className="text-xl font-bold">CV Analyzer</h1>

        <button
          onClick={() => navigate("/upload")}
          className="bg-white text-black px-5 py-2 rounded-xl hover:scale-105 transition"
        >
          جرب الان
        </button>
      </nav>

      {/* Hero */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center mt-32 px-6">

        <motion.h2 className="text-6xl font-extrabold mb-6 leading-tight"
        initial={{opacity:0,y:30}}
        animate={{opacity:1,y:0}}
        transition={{duration:0.6}}>
          تحليل السيرة الذاتية المدعوم بالذكاء الاصطناعي <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            مصمم لمستقبلك
          </span>
        </motion.h2>

        <p className="text-gray-300 mb-10 max-w-xl text-lg">
          قم بتحليل سيرتك الذاتية، واكتشف المسارات المهنية، وأطلق العنان لإمكانياتك الكاملة من خلال رؤى ذكية.
        </p>

        <button
          onClick={() => navigate("/upload")}
          className="bg-gradient-to-r from-blue-500 to-purple-500 px-10 py-4 rounded-2xl text-lg shadow-xl hover:scale-110 transition"
        >
          ارفع سيرتك الذاتية
        </button>

      </div>

      {/* Features */}
      <div className="relative z-10 grid grid-cols-3 gap-8 mt-32 px-10" >

        {[
          {
            title: "تحليل بالذكاء الاصطناعي",
            desc: "نفحص سيرتك الذاتية بدقة من ناحية البنية والصياغة، ونتأكد من توافقها مع أنظمة التوظيف الآلي (ATS) قبل أن تصل لأي مسؤول توظيف.",
          },
          {
            title: "اكتشاف المهارات",
            desc: "نستخرج كل المهارات التقنية المذكورة في سيرتك الذاتية تلقائياً، ونوضح لك أيها أساسي وأيها يفضل تطويره أكثر.",
          },
          {
            title: "مطابقة المهنة",
            desc: "نقارن مهاراتك بمتطلبات المسار الوظيفي الذي تختاره، ونعطيك نسبة توافق واضحة مع خارطة طريق عملية لتحسينها.",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border border-white/20 hover:scale-105 transition"
          >
            <h3 className="font-bold text-xl mb-2">{item.title}</h3>
            <p className="text-gray-300">
              {item.desc}
            </p>
          </div>
        ))}

      </div>

    </div>
  );
}