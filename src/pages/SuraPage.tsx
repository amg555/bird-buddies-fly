import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, ArrowLeft } from 'lucide-react';

export default function SuraPage() {
  useEffect(() => {
    document.title = 'Sura Character - Suresh Gopi | Kadayadi Bird';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-500 to-red-600 p-4">
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 text-white bg-black/20 px-4 py-2 rounded-lg hover:bg-black/30 transition-colors mb-4"
      >
        <ArrowLeft size={20} />
        <span>Home</span>
      </Link>
      
      <div className="max-w-4xl mx-auto text-white">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4">Polayadi Sura</h1>
          <p className="text-xl">The Ultimate Suresh Gopi Experience</p>
        </div>
        
        <div className="bg-white/10 rounded-xl p-8 backdrop-blur-sm">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <img 
                src="/images/characters/sura.png" 
                alt="Sura - Suresh Gopi Character"
                className="w-full max-w-sm mx-auto rounded-lg shadow-2xl"
              />
            </div>
            
            <div>
              <h2 className="text-3xl font-bold mb-4">About Sura</h2>
              <p className="mb-4">
                Play as the iconic Sura character from Malayalam cinema, featuring the legendary 
                Suresh Gopi's most memorable dialogues including the famous "Polayadi Mone"!
              </p>
              
              <h3 className="text-xl font-semibold mb-2">Special Features:</h3>
              <ul className="list-disc list-inside mb-6 space-y-2">
                <li>Authentic Polayadi Mone dialogue on collision</li>
                <li>Special power-ups inspired by the movie</li>
                <li>Exclusive Sura-themed obstacles</li>
                <li>High score celebrations with iconic dialogues</li>
              </ul>
              
              <Link 
                to="/play" 
                className="inline-flex items-center gap-2 bg-yellow-500 text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors"
              >
                <Play size={24} />
                Play as Sura Now
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Famous Dialogues</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/10 p-4 rounded-lg">
              <p className="italic">"Polayadi Mone!"</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <p className="italic">"Kadayadi!"</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <p className="italic">"Game Over Da!"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}