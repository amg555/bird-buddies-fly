import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, ArrowLeft } from 'lucide-react';

export default function LeaderboardPage() {
  useEffect(() => {
    document.title = 'Leaderboard - Kadayadi Bird High Scores';
  }, []);

  // Mock leaderboard data - replace with actual Firebase data
  const [leaderboard] = useState([
    { rank: 1, name: 'Polayadi Master', score: 9999, character: 'Sura' },
    { rank: 2, name: 'Bird Champion', score: 8500, character: 'Mohanlal' },
    { rank: 3, name: 'Flying Pro', score: 7200, character: 'Mukesh' },
    { rank: 4, name: 'Kadayadi King', score: 6800, character: 'Sura' },
    { rank: 5, name: 'Sky Warrior', score: 5500, character: 'Lal' },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 to-blue-600 p-4">
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 text-white bg-black/20 px-4 py-2 rounded-lg hover:bg-black/30 transition-colors mb-4"
      >
        <ArrowLeft size={20} />
        <span>Home</span>
      </Link>
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 text-white">
          <Trophy className="mx-auto mb-4" size={48} />
          <h1 className="text-5xl font-bold mb-2">Leaderboard</h1>
          <p className="text-xl">Top Kadayadi Bird Players</p>
        </div>
        
        <div className="bg-white/10 rounded-xl backdrop-blur-sm overflow-hidden">
          <table className="w-full text-white">
            <thead>
              <tr className="bg-white/10">
                <th className="p-4 text-left">Rank</th>
                <th className="p-4 text-left">Player</th>
                <th className="p-4 text-left">Character</th>
                <th className="p-4 text-right">Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((player) => (
                <tr key={player.rank} className="border-t border-white/10">
                  <td className="p-4">
                    {player.rank === 1 && '🥇'}
                    {player.rank === 2 && '🥈'}
                    {player.rank === 3 && '🥉'}
                    {player.rank > 3 && `#${player.rank}`}
                  </td>
                  <td className="p-4 font-semibold">{player.name}</td>
                  <td className="p-4">{player.character}</td>
                  <td className="p-4 text-right font-bold">{player.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="mt-8 text-center">
          <Link 
            to="/play" 
            className="inline-flex items-center gap-2 bg-yellow-500 text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors"
          >
            <Trophy size={20} />
            Play & Beat High Score
          </Link>
        </div>
      </div>
    </div>
  );
}