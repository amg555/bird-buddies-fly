import { useState, useEffect, useRef } from 'react';

export const useImagePreloader = (imagePaths: string[]) => {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const imagesRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const loadingRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (imagePaths.length === 0) {
      console.log('No images to preload');
      setImagesLoaded(true);
      return;
    }

    console.log('Preloading images:', imagePaths);
    let loadedCount = 0;
    let errorCount = 0;
    const totalImages = imagePaths.length;

    imagePaths.forEach(path => {
      // Skip if already loaded or loading
      if (imagesRef.current.has(path) || loadingRef.current.has(path)) {
        loadedCount++;
        if (loadedCount + errorCount === totalImages) {
          setImagesLoaded(true);
        }
        return;
      }

      loadingRef.current.add(path);
      const img = new Image();
      
      // Add crossOrigin for better caching
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        console.log(`Image loaded successfully: ${path}`);
        loadedCount++;
        imagesRef.current.set(path, img);
        loadingRef.current.delete(path);
        
        if (loadedCount + errorCount === totalImages) {
          console.log(`All images processed. Loaded: ${loadedCount}, Errors: ${errorCount}`);
          setImagesLoaded(true);
        }
      };
      
      img.onerror = (e) => {
        console.error(`Failed to load image: ${path}`, e);
        errorCount++;
        loadingRef.current.delete(path);
        setLoadingError(`Failed to load: ${path}`);
        
        // Create a placeholder colored rectangle instead
        const canvas = document.createElement('canvas');
        canvas.width = 50;
        canvas.height = 50;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Create a colored square as placeholder
          const hash = path.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
          ctx.fillStyle = `hsl(${hash % 360}, 70%, 50%)`;
          ctx.fillRect(0, 0, 50, 50);
          ctx.fillStyle = 'white';
          ctx.font = 'bold 20px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const initial = path.split('/').pop()?.charAt(0).toUpperCase() || '?';
          ctx.fillText(initial, 25, 25);
        }
        
        const placeholderImg = new Image();
        placeholderImg.src = canvas.toDataURL();
        imagesRef.current.set(path, placeholderImg);
        
        if (loadedCount + errorCount === totalImages) {
          console.log(`All images processed. Loaded: ${loadedCount}, Errors: ${errorCount}`);
          setImagesLoaded(true);
        }
      };
      
      // Set the source to trigger loading
      img.src = path;
    });
  }, [imagePaths]);

  const getImage = (path: string): HTMLImageElement | null => {
    return imagesRef.current.get(path) || null;
  };

  // Preload all character images on app start
  const preloadAllCharacterImages = () => {
    const allCharacterPaths = [
      '/images/characters/aadi-sale.png',
      '/images/characters/basil.png',
      '/images/characters/dashamoolam.png',
      '/images/characters/davarayoli.png',
      '/images/characters/junglee-rummy.png',
      '/images/characters/lal.png',
      '/images/characters/Mukesh.png',
      '/images/characters/panuneer.png',
      '/images/characters/Pookkutti.png',
      '/images/characters/sura.png'
    ];

    allCharacterPaths.forEach(path => {
      if (!imagesRef.current.has(path) && !loadingRef.current.has(path)) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        loadingRef.current.add(path);
        
        img.onload = () => {
          imagesRef.current.set(path, img);
          loadingRef.current.delete(path);
        };
        
        img.onerror = () => {
          loadingRef.current.delete(path);
        };
        
        img.src = path;
      }
    });
  };

  // Preload all images on mount
  useEffect(() => {
    preloadAllCharacterImages();
  }, []);

  return { imagesLoaded, getImage, loadingError };
};