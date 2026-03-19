# Character Sound Setup Guide

Each character in KADAYADI BIRD can have TWO custom sound files:

## Sound Files Required:

### 1. Scoring Sound (plays when passing pipes)
- **Location:** `/public/sounds/[character-name]-score.mp3`
- **Example:** `/public/sounds/actor1-score.mp3`
- **Duration:** Keep it short (0.5-1 second)
- **Purpose:** Celebration/success sound when scoring

### 2. Game Over Voice (plays when game ends)
- **Location:** `/public/sounds/[character-name].mp3`
- **Example:** `/public/sounds/actor1.mp3`
- **Duration:** Can be longer (1-3 seconds)
- **Purpose:** Character's unique voice/catchphrase on game over

## Default Sound Files:

If you don't provide character-specific sounds, the game will use:
- **Default scoring:** `/public/sounds/pass-through.mp3`
- **Default game over:** `/public/sounds/game-over.mp3`

## Adding New Characters:

1. **Prepare your sound files:**
   - One for scoring: `character-score.mp3`
   - One for game over: `character-gameover.mp3`

2. **Place files in public/sounds folder**

3. **Update characters.ts:**
```typescript
{
  id: 11,
  name: 'Your Character',
  imagePath: '/images/characters/your-character.png',
  soundFile: '/sounds/your-character-gameover.mp3', // Game over
  scoreSoundFile: '/sounds/your-character-score.mp3', // Scoring
  description: 'Character description!'
}