import React, { useState, useEffect } from 'react';
import { Check, Truck, Calendar, AlertTriangle } from 'lucide-react';

const SkipSelection = () => {
  const [skips, setSkips] = useState([]);
  const [selectedSkip, setSelectedSkip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch skip data from API
    fetch('https://app.wewantwaste.co.uk/api/skips/by-location?postcode=NR32&area=Lowestoft')
      .then(res => res.json())
      .then(data => {
        // Transform the data based on actual API structure
        const transformedData = data.map(skip => {
          // Calculate total price including VAT
          const totalPrice = skip.price_before_vat * (1 + skip.vat / 100);
          
          // Determine dimensions and capacity based on size
          const getDimensions = (size) => {
            const dimensions = {
              4: '6ft x 4ft x 3ft',
              6: '10ft x 5ft x 3ft',
              8: '12ft x 6ft x 4ft',
              10: '12ft x 6ft x 5ft',
              12: '12ft x 6ft x 6ft',
              14: '14ft x 6ft x 6ft',
              16: '16ft x 6ft x 6ft',
              20: '20ft x 8ft x 6ft',
              40: '20ft x 8ft x 8ft'
            };
            return dimensions[size] || 'Contact for dimensions';
          };
          
          const getCapacity = (size) => {
            const capacities = {
              4: '40 bin bags',
              6: '60 bin bags',
              8: '80 bin bags',
              10: '100 bin bags',
              12: '120 bin bags',
              14: '140 bin bags',
              16: '160 bin bags',
              20: '200 bin bags',
              40: '440 bin bags'
            };
            return capacities[size] || `${size * 10} bin bags (approx)`;
          };
          
          const getBestFor = (size) => {
            if (size <= 4) return 'Small home projects';
            if (size <= 6) return 'Kitchen/bathroom renovations';
            if (size <= 8) return 'Home renovations';
            if (size <= 12) return 'Large renovations';
            if (size <= 16) return 'Construction projects';
            if (size <= 20) return 'Major construction';
            return 'Commercial projects';
          };
          
          return {
            id: skip.id,
            name: `${skip.size} Yard Skip`,
            size: skip.size,
            price: Math.round(totalPrice),
            hirePeriod: skip.hire_period_days,
            dimensions: getDimensions(skip.size),
            capacity: getCapacity(skip.size),
            bestFor: getBestFor(skip.size),
            roadRestrictions: !skip.allowed_on_road,
            allowsHeavyWaste: skip.allows_heavy_waste,
            forbidden: skip.forbidden
          };
        });
        
        // Filter out forbidden skips and sort by size
        const availableSkips = transformedData
          .filter(skip => !skip.forbidden)
          .sort((a, b) => a.size - b.size);
          
        setSkips(availableSkips);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching skips:', err);
        setLoading(false);
      });
  }, []);

  const handleSkipSelect = (skip) => {
    if (selectedSkip?.id === skip.id) {
      setSelectedSkip(null);
    } else {
      setSelectedSkip(skip);
    }
  };

  const getSkipColor = (size) => {
    const colors = {
      4: 'from-yellow-400 to-yellow-600',
      6: 'from-orange-400 to-orange-600',
      8: 'from-red-400 to-red-600',
      10: 'from-purple-400 to-purple-600',
      12: 'from-blue-400 to-blue-600',
      14: 'from-indigo-400 to-indigo-600',
      16: 'from-green-400 to-green-600',
      20: 'from-pink-400 to-pink-600',
      40: 'from-gray-600 to-gray-800'
    };
    return colors[size] || 'from-gray-400 to-gray-600';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Progress Bar */}
      <div className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between text-sm overflow-x-auto">
            <div className="flex items-center space-x-4 md:space-x-8">
              <div className="flex items-center space-x-2 text-green-400 whitespace-nowrap">
                <Check className="w-5 h-5" />
                <span className="hidden sm:inline">Postcode</span>
              </div>
              <div className="flex items-center space-x-2 text-green-400 whitespace-nowrap">
                <Check className="w-5 h-5" />
                <span className="hidden sm:inline">Waste Type</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-400 font-semibold whitespace-nowrap">
                <span className="w-5 h-5 rounded-full bg-blue-400 text-gray-900 flex items-center justify-center text-xs">3</span>
                <span>Select Skip</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400 whitespace-nowrap">
                <span className="w-5 h-5 rounded-full bg-gray-600 flex items-center justify-center text-xs">4</span>
                <span className="hidden sm:inline">Permit Check</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400 whitespace-nowrap">
                <span className="w-5 h-5 rounded-full bg-gray-600 flex items-center justify-center text-xs">5</span>
                <span className="hidden sm:inline">Choose Date</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400 whitespace-nowrap">
                <span className="w-5 h-5 rounded-full bg-gray-600 flex items-center justify-center text-xs">6</span>
                <span className="hidden sm:inline">Payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
            Choose Your Skip Size
          </h1>
          <p className="text-lg md:text-xl text-gray-300">Select the skip size that best suits your needs</p>
        </div>

        {/* Skip Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {skips.map((skip) => (
            <div
              key={skip.id}
              onClick={() => handleSkipSelect(skip)}
              className={`relative cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                selectedSkip?.id === skip.id ? 'ring-4 ring-blue-500 scale-105' : ''
              }`}
            >
              <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl">
                {/* Skip Image/Visual */}
                <div className={`h-48 bg-gradient-to-br ${getSkipColor(skip.size)} relative overflow-hidden`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Truck className="w-24 h-24 text-white/20" />
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 text-gray-900 px-3 py-1 rounded-full font-bold">
                    {skip.size} Yards
                  </div>
                  {skip.roadRestrictions && (
                    <div className="absolute bottom-4 left-4 bg-red-500/90 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Not Road Legal
                    </div>
                  )}
                </div>

                {/* Skip Details */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{skip.name}</h3>
                  <div className="flex items-center text-gray-400 mb-4">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{skip.hirePeriod} day hire period</span>
                  </div>
                  <div className="text-3xl font-bold text-blue-400 mb-4">
                    {formatPrice(skip.price)}
                  </div>
                  <div className="text-sm text-gray-400 space-y-1">
                    <p>• Dimensions: {skip.dimensions}</p>
                    <p>• Capacity: {skip.capacity}</p>
                    <p>• Best for: {skip.bestFor}</p>
                    {skip.allowsHeavyWaste ? (
                      <p className="text-green-400">• ✓ Allows heavy waste</p>
                    ) : (
                      <p className="text-red-400">• ✗ No heavy waste</p>
                    )}
                  </div>
                </div>

                {/* Selection Indicator */}
                {selectedSkip?.id === skip.id && (
                  <div className="absolute top-4 left-4 bg-blue-500 text-white p-2 rounded-full animate-pulse">
                    <Check className="w-6 h-6" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Fixed Bottom Bar */}
        {selectedSkip && (
          <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-t border-gray-700 transform transition-transform duration-300 z-50 animate-slide-up">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${getSkipColor(selectedSkip.size)} rounded-lg flex items-center justify-center`}>
                    <Truck className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">{selectedSkip.name}</h4>
                    <p className="text-gray-400">{selectedSkip.hirePeriod} day hire • {formatPrice(selectedSkip.price)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.history.back();
                    }}
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Continue with', selectedSkip);
                      // Add navigation logic here
                    }}
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
                  >
                    Continue →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Disclaimer */}
      <div className="max-w-7xl mx-auto px-4 py-8 text-center text-sm text-gray-500">
        <p>Imagery and information shown throughout this website may not reflect the exact shape or size specification, colours may vary, options and/or accessories may be featured at additional cost.</p>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SkipSelection;