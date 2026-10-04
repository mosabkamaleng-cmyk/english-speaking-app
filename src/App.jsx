import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, Square, Play, Pause, RefreshCw, Calendar, Volume2, 
  CheckCircle2, Sparkles, BookOpen, AlertCircle, ArrowRight 
} from 'lucide-react';

const TOPICS = [
  "Describe your morning routine and ideal weekend.",
  "Talk about a childhood memory that made you laugh.",
  "Explain your current job or field of study in simple terms.",
  "What is your favorite hobby and why do you enjoy it?",
  "Describe your hometown and what makes it special.",
  "Talk about a memorable food or dining experience.",
  "Describe a typical day in your life.",
  "Talk about a challenging situation you handled recently.",
  "Describe a movie or book that changed your perspective.",
  "Discuss a travel experience or a place you want to visit.",
  "What is a skill you would love to learn and why?",
  "Talk about a person who has inspired you in life.",
  "Describe your favorite season and how it makes you feel.",
  "Discuss how you manage your time and stay organized.",
  "Is social media doing more harm than good to society?",
  "What are the pros and cons of working remotely?",
  "How do you handle stress and tight deadlines?",
  "Should artificial intelligence be regulated strictly?",
  "What makes a good leader or role model?",
  "How can someone build healthy habits that last?",
  "Discuss the importance of learning a second language.",
  "Describe a business idea you would launch if budget wasn't an issue.",
  "If you could change one law in the world, what would it be?",
  "Summarize your progress over the last 3 weeks and future goals.",
  "What is the most valuable piece of advice you've received?",
  "How will technology change education in the next decade?",
  "Describe an achievement you are truly proud of.",
  "What does success mean to you personally?",
  "How do you plan to keep practicing English after this month?",
  "Deliver a final 3-minute speech reflecting on your 30-day journey."
];

export default function App() {
  const [currentDay, setCurrentDay] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [activeTab, setActiveTab] = useState('pronunciation');
  const [recordingHistory, setRecordingHistory] = useState({});

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('english_app_history');
    if (saved) {
      try { setRecordingHistory(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (isRecording) {
      timerIntervalRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev >= 180) {
            stopRecording();
            return 180;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      clearInterval(timerIntervalRef.current);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        const mockAnalysis = {
          pronunciation: [
            { word: "Routine", phonetic: "/ruːˈtiːn/", note: "النطق الصحيح يشدد على المقطع الثاني (teen)" },
            { word: "Ideal", phonetic: "/aɪˈdiːəl/", note: "احرص على إظهار صوت الـ (L) في النهاية بوضوح" }
          ],
          arabicToEnglish: [
            { arabic: "عفوية", english: "Spontaneous", usage: "I love making spontaneous trips." },
            { arabic: "انضباط", english: "Discipline", usage: "Maintaining a daily routine requires discipline." }
          ],
          grammar: [
            { original: "I am agree with this point.", corrected: "I agree with this point.", rule: "الفعل agree لا يحتاج معه إلى am" }
          ],
          score: 85,
          tip: "نبرة صوتك ممتازة وأسلوبك سلس. حاول التركيز على مخارج حروف الثاء والذال (TH) في المقاطع السريعة."
        };

        const updatedHistory = {
          ...recordingHistory,
          [currentDay]: { audioUrl: url, date: new Date().toLocaleDateString('ar-EG'), analysis: mockAnalysis }
        };
        setRecordingHistory(updatedHistory);
        localStorage.setItem('english_app_history', JSON.stringify(updatedHistory));
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setTimer(0);
    } catch (err) {
      alert("يرجى إعطاء صلاحية الوصول للميكروفون لبدء التسجيل.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentData = recordingHistory[currentDay];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center p-4 font-sans dir-rtl">
      <header className="w-full max-w-md flex justify-between items-center mb-6 pt-2">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-600 rounded-xl shadow-lg">
            <Mic className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">مُدرّب النطق الإنجليزي</h1>
            <p className="text-xs text-indigo-400">تحدي الـ 30 يوماً للتحدث العفوي</p>
          </div>
        </div>
        <div className="bg-slate-800 px-3 py-1.5 rounded-full text-xs font-semibold text-indigo-300 border border-slate-700">
          اليوم {currentDay} من 30
        </div>
      </header>

      <main className="w-full max-w-md space-y-4 pb-20">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => (
            <button
              key={d}
              onClick={() => setCurrentDay(d)}
              className={`flex-shrink-0 w-12 h-12 rounded-xl flex flex-col items-center justify-center font-bold text-xs transition-all ${
                currentDay === d 
                  ? 'bg-indigo-600 text-white shadow-lg scale-105' 
                  : recordingHistory[d]
                  ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                  : 'bg-slate-800 text-slate-400 border border-slate-700/50'
              }`}
            >
              <span>{d}</span>
              {recordingHistory[d] && <CheckCircle2 className="w-3 h-3 mt-0.5" />}
            </button>
          ))}
        </div>

        <div className="bg-slate-800/90 border border-slate-700/70 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-medium mb-1">
            <BookOpen className="w-4 h-4" />
            <span>موضوع ارتجال اليوم (3 دقائق)</span>
          </div>
          <p className="text-slate-200 font-medium text-base leading-snug dir-ltr text-left">
            "{TOPICS[currentDay - 1]}"
          </p>
        </div>

        <div className="bg-gradient-to-b from-slate-800 to-slate-850 border border-slate-700 rounded-2xl p-6 text-center space-y-4 shadow-md">
          <div className="text-4xl font-extrabold tracking-wider font-mono text-indigo-400">
            {formatTime(timer)} / 03:00
          </div>

          <div className="flex justify-center items-center gap-4">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="bg-indigo-600 hover:bg-indigo-500 text-white p-5 rounded-full shadow-lg shadow-indigo-600/30 transition-transform active:scale-95"
              >
                <Mic className="w-8 h-8" />
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="bg-red-600 hover:bg-red-500 text-white p-5 rounded-full shadow-lg shadow-red-600/30 animate-pulse"
              >
                <Square className="w-8 h-8" />
              </button>
            )}
          </div>
          <p className="text-xs text-slate-400">
            {isRecording ? "جاري التسجيل... تحدث بحرية دون توقف" : "اضغط الميكروفون وابدأ التحدث بالإنجليزية"}
          </p>
        </div>

        {currentData ? (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Sparkles className="w-5 h-5" />
                <span>تحليل الذكاء الاصطناعي</span>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 bg-emerald-950 text-emerald-300 rounded-full border border-emerald-800">
                النتيجة: {currentData.analysis.score}/100
              </span>
            </div>

            <div className="flex bg-slate-900/60 p-1 rounded-xl gap-1 text-xs font-medium">
              {[
                { id: 'pronunciation', label: 'النطق' },
                { id: 'vocab', label: 'الكلمات' },
                { id: 'grammar', label: 'القواعد' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-2 rounded-lg text-center transition ${
                    activeTab === tab.id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="text-sm space-y-3 pt-1">
              {activeTab === 'pronunciation' && (
                <div className="space-y-2">
                  {currentData.analysis.pronunciation.map((item, idx) => (
                    <div key={idx} className="bg-slate-900/40 p-3 rounded-xl border border-slate-700/50">
                      <div className="flex justify-between font-bold text-indigo-300 dir-ltr">
                        <span>{item.word}</span>
                        <span className="text-slate-400 font-normal">{item.phonetic}</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">{item.note}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'vocab' && (
                <div className="space-y-2">
                  {currentData.analysis.arabicToEnglish.map((item, idx) => (
                    <div key={idx} className="bg-slate-900/40 p-3 rounded-xl border border-slate-700/50 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-amber-400">الكلمة بالعربية: {item.arabic}</span>
                        <span className="text-emerald-400 font-bold dir-ltr">{item.english}</span>
                      </div>
                      <p className="text-xs text-slate-400 dir-ltr text-left">Ex: {item.usage}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'grammar' && (
                <div className="space-y-2">
                  {currentData.analysis.grammar.map((item, idx) => (
                    <div key={idx} className="bg-slate-900/40 p-3 rounded-xl border border-slate-700/50 space-y-1 dir-ltr text-left">
                      <div className="text-xs text-red-400 line-through">{item.original}</div>
                      <div className="text-xs text-emerald-400 font-bold">{item.corrected}</div>
                      <div className="text-xs text-slate-400 dir-rtl text-right mt-1">{item.rule}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-indigo-950/40 border border-indigo-800/60 p-3 rounded-xl text-xs text-indigo-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
              <span>{currentData.analysis.tip}</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-slate-500 text-xs">
            قم بإنهاء التسجيل لرؤية التقييم والتصحيح الخاص باليوم.
          </div>
        )}
      </main>
    </div>
  );
}
