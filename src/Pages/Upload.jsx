import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Upload() {
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [career, setCareer] = useState("");
  const [error, setError] = useState("");

  const handleFile = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword"
    ];

    if (!allowedTypes.includes(selected.type)) {
      setError("❌ Only PDF or DOCX files allowed");
      setFile(null);
      return;
    }

    setError("");
    setFile(selected);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const selected = e.dataTransfer.files[0];
    if (!selected) return;
    handleFile({ target: { files: [selected] } });
  };

  const handleSubmit = () => {
    if (!file) {
      setError("⚠️ Please upload a CV first");
      return;
    }
    if (!career) {
      setError("⚠️ Please select a career path");
      return;
    }

    setError("");
    // 🚀 التوجيه الصحيح: نقل المستخدم والبيانات لصفحة المعالجة
    navigate("/processing", { state: { file, career } });
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-xl bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 shadow-xl">
        <h1 className="text-2xl font-bold mb-6 text-center"> ارفع سيرتك الذاتية </h1>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="border-2 border-dashed border-gray-500 p-10 text-center rounded-xl cursor-pointer hover:border-blue-500 transition"
        >
          <input
            type="file"
            id="fileUpload" 
            accept=".pdf,.doc,.docx"
            onChange={handleFile}
            className="hidden"
          />
          <label htmlFor="fileUpload" className="cursor-pointer">
            <p className="text-gray-300"> اسحب الملف و ضعه هنا </p>
            <p className="text-sm text-gray-500 mt-2">(PDF, DOCX) او اضغط لاختيار ملف</p>
          </label>
          {file && <p className="mt-4 text-green-400">✔ {file.name}</p>}
        </div>

        <select
          id="careerSelect"
          value={career}
          onChange={(e) => setCareer(e.target.value)}
          className="mt-6 w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
        >
          <option value="" disabled hidden> اختر المسار المطلوب </option>
          
          <option value="frontend">Frontend Developer</option>
          <option value="backend">Backend Developer</option>
          <option value="fullstack">Full Stack Developer</option>
          <option value="network">Network Engineer</option>
          <option value="ai">AI Engineer</option>
        </select>

        {error && (
          <div className="mt-4 bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          className="mt-6 w-full bg-gradient-to-r from-blue-500 to-purple-500 py-3 rounded-lg font-semibold hover:scale-[1.03] transition"
        >
          ابدأ الان
        </button>
      </div>
    </div>
  );
}