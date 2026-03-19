import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, ArrowLeft, Volume2 } from 'lucide-react';

export default function PolayadiPage() {
  useEffect(() => {
    document.title = 'Polayadi Mode - Kadayadi Bird | Suresh Gopi Dialogues';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-500 to-orange-600 p-4">
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 text-white bg-black/20 px-4 py-2 rounded-lg hover:bg-black/30 transition-colors mb-4"
      >
        <ArrowLeft size={20} />
        <span>Home</span>
      </Link>
      
      <div className="max-w-4xl mx-auto text-white">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4">Polayadi Mode</h1>
          <p className="text-xl">Experience the Full Power of Polayadi Mone!</p>
        </div>
        
        <div className="bg-white/10 rounded-xl p-8 backdrop-blur-sm mb-8">
          <h2 className="text-3xl font-bold mb-6 text-center">Game Mode Features</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/10 p-6 rounded-lg">
              <Volume2 className="mb-4" size={32} />
              <h3 className="text-xl font-semibold mb-2">Epic Dialogues</h3>
              <p>Every action triggers iconic Suresh Gopi dialogues from the movie</p>
            </div>
            
            <div className="bg-white/10 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Difficulty Levels</h3>
              <ul className="space-y-2">
                <li>• Easy: Polayadi Trainee</li>
                <li>• Medium: Polayadi Pro</li>
                <li>• Hard: Ultimate Polayadi Master</li>
              </ul>
            </div>
            
            <div className="bg-white/10 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Special Powers</h3>
              <p>Unlock special Sura powers to blast through obstacles</p>
            </div>
            
            <div className="bg-white/10 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Leaderboard</h3>
              <p>Compete for the title of Ultimate Polayadi Champion</p>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <Link 
            to="/play" 
            className="inline-flex items-center gap-2 bg-yellow-500 text-black px-8 py-4 rounded-lg font-bold text-xl hover:bg-yellow-400 transition-colors"
          >
            <Play size={28} />
            Start Polayadi Mode
          </Link>
        </div>
      </div>
    </div>
  );
}