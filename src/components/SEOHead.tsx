// src/components/SEOHead.tsx
import React from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  character?: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'Kadayadi Bird - Polayadi Mone | Sura Bird | Malayalam Flappy Game',
  description = 'Play Kadayadi Bird (Polayadi Bird) - Flappy Sura game with Suresh Gopi characters!',
  image = 'https://kadayadibird.fun/og-image.jpg',
  url = 'https://kadayadibird.fun',
  character = ''
}) => {
  React.useEffect(() => {
    // Dynamic title based on character
    let dynamicTitle = title;
    let dynamicDescription = description;
    
    if (character) {
      const characterTitles: Record<string, string> = {
        'sura': 'Playing as Sura - Kadayadi Bird | Suresh Gopi Flappy Game',
        'dashamoolam': 'Playing Dashamoolam Character - Kadayadi Bird Game',
        'lal': 'Playing as Lal Character - Malayalam Flappy Bird',
        'basil': 'Playing as Basil - Kadayadi Bird Malayalam Game',
        'mukesh': 'Playing as Mukesh - Kadayadi Flappy Bird',
        'default': `Playing ${character} - Kadayadi Bird | Polayadi Game`
      };
      
      const characterDescriptions: Record<string, string> = {
        'sura': 'Now playing as Suresh Gopi\'s Sura with Polayadi Mone dialogues in Kadayadi Bird! Beat your high score in this Flappy Sura game!',
        'dashamoolam': 'Playing as Dashamoolam character in Kadayadi Bird - The ultimate Malayalam flappy bird game!',
        'lal': 'Playing as Lal in Kadayadi Bird - Malayalam movie characters flappy game!',
        'basil': 'Playing as Basil in Kadayadi Bird - Enjoy Malayalam dialogues while playing!',
        'mukesh': 'Playing as Mukesh in Kadayadi Bird - The funniest Malayalam flappy bird game!',
        'default': `Playing as ${character} in Kadayadi Bird (Polayadi Bird) - Malayalam flappy game!`
      };
      
      dynamicTitle = characterTitles[character.toLowerCase()] || characterTitles['default'];
      dynamicDescription = characterDescriptions[character.toLowerCase()] || characterDescriptions['default'];
    }
    
    // Update document title
    document.title = dynamicTitle;
    
    // Update meta tags
    const updateMetaTag = (property: string, content: string) => {
      let element = document.querySelector(`meta[property="${property}"]`) ||
                   document.querySelector(`meta[name="${property}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        if (property.startsWith('og:') || property.startsWith('twitter:')) {
          element.setAttribute('property', property);
        } else {
          element.setAttribute('name', property);
        }
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };
    
    updateMetaTag('description', dynamicDescription);
    updateMetaTag('og:title', dynamicTitle);
    updateMetaTag('og:description', dynamicDescription);
    updateMetaTag('og:image', image);
    updateMetaTag('og:url', url);
    updateMetaTag('twitter:title', dynamicTitle);
    updateMetaTag('twitter:description', dynamicDescription);
    updateMetaTag('twitter:image', image);
    
    // Update JSON-LD structured data dynamically
    const scriptId = 'dynamic-jsonld';
    let scriptElement = document.getElementById(scriptId) as HTMLScriptElement | null;
    
    if (!scriptElement) {
      scriptElement = document.createElement('script');
      scriptElement.id = scriptId;
      scriptElement.type = 'application/ld+json';
      document.head.appendChild(scriptElement);
    }
    
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "VideoGame",
      "name": dynamicTitle,
      "description": dynamicDescription,
      "url": url,
      "image": image
    };
    
    scriptElement.textContent = JSON.stringify(jsonLd);
    
  }, [title, description, image, url, character]);
  
  return null;
};