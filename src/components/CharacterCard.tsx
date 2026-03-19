import React from 'react';
import { motion } from 'framer-motion';
import { Character } from '@/types';

interface CharacterCardProps {
  character: Character;
  onSelect: (character: Character) => void;
  index: number;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({ 
  character, 
  onSelect, 
  index 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="cursor-pointer"
      onClick={() => onSelect(character)}
    >
      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow">
        <div className="aspect-square mb-3 overflow-hidden rounded-lg bg-gradient-to-br from-blue-100 to-blue-200">
          <img
            src={character.imagePath}
            alt={character.name}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
        </div>
        <h3 className="font-bold text-gray-800 text-center">{character.name}</h3>
        {character.description && (
          <p className="text-sm text-gray-600 text-center mt-1">{character.description}</p>
        )}
      </div>
    </motion.div>
  );
};