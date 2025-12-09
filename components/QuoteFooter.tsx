import React, { useEffect, useState } from 'react';
import { generateDailyQuote } from '../services/geminiService';
import { Sparkles } from 'lucide-react';

const QuoteFooter: React.FC = () => {
  const [quote, setQuote] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchQuote = async () => {
        try {
            const q = await generateDailyQuote();
            if (mounted) setQuote(q);
        } catch (e) {
            if (mounted) setQuote("To infinity and beyond.");
        } finally {
            if (mounted) setLoading(false);
        }
    };
    fetchQuote();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl text-center px-4">
       <div className={`transition-opacity duration-1000 ${loading ? 'opacity-0' : 'opacity-100'}`}>
         <p className="text-white/60 text-sm font-light tracking-wide drop-shadow-md flex items-center justify-center gap-2">
            <Sparkles size={12} className="text-yellow-300 opacity-70" />
            {quote}
         </p>
       </div>
    </div>
  );
};

export default QuoteFooter;