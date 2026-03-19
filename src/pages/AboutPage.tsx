import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Heart, Github, Mail } from 'lucide-react';

export default function AboutPage() {
  useEffect(() => {
    document.title = 'About - Kadayadi Bird Game';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-500 to-blue-600 p-4">
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 text-white bg-black/20 px-4 py-2 rounded-lg hover:bg-black/30 transition-colors mb-4"
      >
        <ArrowLeft size={20} />
        <span>Home</span>
      </Link>
      
      <div className="max-w-4xl mx-auto text-white">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4">About Kadayadi Bird</h1>
          <p className="text-xl">The Ultimate Malayalam Gaming Experience</p>
        </div>
        
        <div className="bg-white/10 rounded-xl p-8 backdrop-blur-sm mb-8">
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <p className="mb-4 text-lg">
            Kadayadi Bird is a tribute to Malayalam cinema and its legendary actors. 
            Inspired by the classic Flappy Bird game, we've created a unique gaming 
            experience that celebrates the iconic dialogues and characters from Malayalam movies.
          </p>
          
          <p className="mb-4 text-lg">
            Featuring Suresh Gopi's famous "Polayadi Mone" dialogue and characters from 
            beloved Malayalam films, Kadayadi Bird brings together gaming and cinema in 
            a fun, engaging way.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-2xl font-bold mb-4">Features</h3>
            <ul className="space-y-2">
              <li>✓ Multiple Malayalam movie characters</li>
              <li>✓ Authentic movie dialogues</li>
              <li>✓ Engaging gameplay</li>
              <li>✓ Leaderboard system</li>
              <li>✓ Mobile-friendly design</li>
            </ul>
          </div>
          
          <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-2xl font-bold mb-4">Characters</h3>
            <ul className="space-y-2">
              <li>• Sura (Suresh Gopi)</li>
              <li>• Mohanlal</li>
              <li>• Mukesh</li>
              <li>• Lal</li>
              <li>• And many more...</li>
            </ul>
          </div>
        </div>
        
        <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm text-center">
          <h3 className="text-2xl font-bold mb-4">Connect With Us</h3>
          <div className="flex justify-center gap-4">
            <a href="#" className="bg-white/20 p-3 rounded-lg hover:bg-white/30 transition-colors">
              <Mail size={24} />
            </a>
            <a href="#" className="bg-white/20 p-3 rounded-lg hover:bg-white/30 transition-colors">
              <Github size={24} />
            </a>
            <a href="#" className="bg-white/20 p-3 rounded-lg hover:bg-white/30 transition-colors">
              <Heart size={24} />
            </a>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-lg">
            Made with <Heart className="inline" size={20} /> for Malayalam Cinema Fans
          </p>
        </div>
      </div>
    </div>
  );
}