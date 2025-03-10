import React, { useState, useEffect } from 'react';

const WhiskeySplashPage = () => {
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleAgeVerification = () => {
    setIsAgeVerified(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="text-white text-2xl font-serif animate-pulse">Kitsune Spirit...</div>
      </div>
    );
  }

  if (!isAgeVerified) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white font-serif">
        <h1 className="text-3xl mb-8">Kitsune Whiskey</h1>
        <p className="mb-8">Please verify that you are of legal drinking age.</p>
        <button 
          onClick={handleAgeVerification}
          className="px-6 py-2 bg-red-800 text-white rounded hover:bg-red-700 transition-colors"
        >
          I am of legal drinking age
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-70"></div>
        <div className="z-10 text-center px-4">
          <h1 className="text-5xl font-serif mb-4">Kitsune Whiskey</h1>
          <p className="text-xl mb-8">Spirits of the Eastern Legends</p>
          <button className="px-6 py-3 bg-red-800 text-white rounded hover:bg-red-700 transition-colors mx-2">
            Shop Now
          </button>
          <button className="px-6 py-3 border border-white text-white rounded hover:bg-white hover:text-black transition-colors mx-2">
            Our Story
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="container mx-auto py-16 px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-3xl font-serif mb-4">Mythical Craftsmanship</h2>
            <p className="mb-4">
              Inspired by ancient Japanese folklore, our Kitsune Whiskey embodies the spirit of 
              transformation and mystique. Each bottle is a journey through time, blending traditional 
              distilling methods with innovative aging techniques.
            </p>
            <p>
              The distinctive character comes from our unique oak barrels, infused with cherry blossom 
              and aged in volcanic stone cellars. The result is a smooth, complex whiskey with notes of 
              caramel, cherry, and a subtle hint of smoke.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="w-64 h-96 bg-gray-900 rounded-lg shadow-lg flex items-center justify-center overflow-hidden">
              <div className="text-center p-4">
                <div className="text-red-600 text-2xl mb-2">Limited Edition</div>
                <div className="text-xl">Kitsune Reserve</div>
                <div className="mt-4 text-sm">43.5% ABV | 750ML</div>
                <div className="mt-6 text-lg">$89.99</div>
                <button className="mt-4 px-4 py-2 bg-red-800 text-white rounded hover:bg-red-700 transition-colors text-sm">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Cocktail */}
      <div className="bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif mb-8 text-center">Featured Cocktail</h2>
          <div className="flex flex-col md:flex-row items-center justify-center">
            <div className="md:w-1/3 text-center mb-8 md:mb-0">
              <h3 className="text-2xl mb-2">Tennessee Kitsune</h3>
              <div className="mb-4 text-red-400">Signature Serve</div>
              <ul className="text-gray-300 mb-4">
                <li>2 oz Kitsune Whiskey</li>
                <li>1 oz Yuzu juice</li>
                <li>0.5 oz Cherry blossom syrup</li>
                <li>Dash of plum bitters</li>
                <li>Garnish with cherry blossoms</li>
              </ul>
              <button className="px-4 py-2 border border-white text-white rounded hover:bg-white hover:text-black transition-colors">
                Full Recipe
              </button>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <div className="w-48 h-48 rounded-full bg-red-900 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-red-800 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="font-serif">Kitsune</div>
                    <div className="text-xs">COCKTAIL</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black py-8 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-serif mb-2">Kitsune Whiskey</h3>
              <p className="text-gray-400 text-sm">Spirits of the Eastern Legends</p>
            </div>
            <div className="mb-6 md:mb-0">
              <h4 className="text-lg mb-2">Connect</h4>
              <div className="flex space-x-4">
                <span className="text-gray-400 hover:text-white cursor-pointer">Instagram</span>
                <span className="text-gray-400 hover:text-white cursor-pointer">Twitter</span>
                <span className="text-gray-400 hover:text-white cursor-pointer">Facebook</span>
              </div>
            </div>
            <div>
              <h4 className="text-lg mb-2">Legal</h4>
              <div className="text-gray-400 text-sm">
                <p>© 2025 Kitsune Spirits Co.</p>
                <p>Please drink responsibly.</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WhiskeySplashPage;
