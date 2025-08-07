// const captainModel = require('../models/captain.model');
// const areaCoordinates = require('./areaCoordinates.json');

// // Haversine formula to calculate distance between two points (in kilometers)
// const getDistance = (lat1, lon1, lat2, lon2) => {
//   const R = 6371; // Earth's radius in kilometers
//   const dLat = (lat2 - lat1) * Math.PI / 180;
//   const dLon = (lon2 - lon1) * Math.PI / 180;
//   const a = 
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
//     Math.sin(dLon / 2) * Math.sin(dLon / 2);
//   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   return R * c;
// };

// module.exports.getAddressCoordinate = async (address) => {
//   try {
//     const normalizedAddress = address.toLowerCase().trim();
    
//     // Search through all cities and areas
//     for (const city of areaCoordinates.cities) {
//       // Check if address matches city name
//       if (normalizedAddress.includes(city.name.toLowerCase())) {
//         // If specific area is mentioned, find it
//         for (const area of city.areas) {
//           if (normalizedAddress.includes(area.name.toLowerCase())) {
//             return {
//               ltd: area.lat,  // Changed to 'ltd' to match your controller expectations
//               lng: area.lng
//             };
//           }
//         }
//         // If no specific area found, return first area of the city
//         return {
//           ltd: city.areas[0].lat,  // Changed to 'ltd'
//           lng: city.areas[0].lng
//         };
//       }
      
//       // Check if address matches any area name directly
//       for (const area of city.areas) {
//         if (normalizedAddress.includes(area.name.toLowerCase())) {
//           return {
//             ltd: area.lat,  // Changed to 'ltd'
//             lng: area.lng
//           };
//         }
//       }
//     }
    
//     // If no match found, return default coordinates (Manhattan Upper East Side)
//     return {
//       ltd: 40.7736,  // Changed to 'ltd'
//       lng: -73.9566
//     };
    
//   } catch (error) {
//     console.error('Error getting coordinates:', error);
//     // Return default coordinates on error
//     return {
//       ltd: 40.7736,  // Changed to 'ltd'
//       lng: -73.9566
//     };
//   }
// };

// module.exports.getDistanceTime = async (origin, destination) => {
//   try {
//     if (!origin || !destination) {
//       throw new Error('Origin and destination are required');
//     }

//     // Get coordinates for origin and destination
//     const originCoords = await module.exports.getAddressCoordinate(origin);
//     const destCoords = await module.exports.getAddressCoordinate(destination);

//     // Calculate distance using Haversine formula
//     const distanceKm = getDistance(
//       originCoords.ltd, originCoords.lng,  // Changed from lat to ltd
//       destCoords.ltd, destCoords.lng       // Changed from lat to ltd
//     );

//     // Estimate time (assuming average speed of 40 km/h for urban travel)
//     const averageSpeedKmH = 40;
//     const durationHours = distanceKm / averageSpeedKmH;
//     const durationSeconds = durationHours * 3600;

//     return {
//       distance: { text: distanceKm.toFixed(2) + ' km', value: Math.round(distanceKm * 1000) },
//       duration: { text: Math.round(durationSeconds / 60) + ' mins', value: Math.round(durationSeconds) }
//     };
//   } catch (err) {
//     console.error(err);
//     throw err;
//   }
// };

// module.exports.getAutoCompleteSuggestions = async (input) => {
//   try {
//     if (!input) {
//       throw new Error('Query is required');
//     }

//     const inputLower = input.toLowerCase();
//     const suggestions = [];

//     // Search for matching areas and cities
//     for (const city of areaCoordinates.cities) {
//       if (city.name.toLowerCase().includes(inputLower)) {
//         suggestions.push(city.name);
//       }
//       for (const area of city.areas) {
//         if (area.name.toLowerCase().includes(inputLower)) {
//           suggestions.push(area.name);
//         }
//         // Also add full city, area format
//         if ((`${area.name}, ${city.name}`).toLowerCase().includes(inputLower)) {
//           suggestions.push(`${area.name}, ${city.name}`);
//         }
//       }
//     }

//     // Remove duplicates and limit to 5 suggestions
//     return [...new Set(suggestions)].slice(0, 5);
//   } catch (err) {
//     console.error(err);
//     throw err;
//   }
// };

// module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {
//   try {
//     // For testing without proper GeoJSON setup, find all active captains
//     const captains = await captainModel.find({
//       status: 'active'
//     });

//     // Filter captains within radius using simple distance calculation
//     const captainsInRadius = captains.filter(captain => {
//       if (!captain.location) return false;
      
//       let captainLat, captainLng;
      
//       // Handle different location formats
//       if (captain.location.coordinates) {
//         [captainLng, captainLat] = captain.location.coordinates;
//       } else if (captain.location.ltd && captain.location.lng) {
//         captainLat = captain.location.ltd;
//         captainLng = captain.location.lng;
//       } else {
//         return false;
//       }
      
//       const distance = getDistance(ltd, lng, captainLat, captainLng);
//       return distance <= radius;
//     });

//     return captainsInRadius;
//   } catch (err) {
//     console.error('Error finding captains:', err);
//     return [];
//   }
// };

// // Helper function to get all available locations (useful for testing)
// module.exports.getAvailableLocations = () => {
//   const locations = [];
  
//   areaCoordinates.cities.forEach(city => {
//     locations.push(city.name);
//     city.areas.forEach(area => {
//       locations.push(area.name);
//       locations.push(`${area.name}, ${city.name}`);
//     });
//   });
  
//   return locations;
// };

const captainModel = require('../models/captain.model');

// Hardcoded area coordinates
const areaCoordinates = {
  cities: [
    {
      name: "Manhattan",
      areas: [
        { name: "Upper East Side", lat: 40.7736, lng: -73.9566 },
        { name: "Harlem", lat: 40.8116, lng: -73.9465 }
      ]
    },
    {
      name: "Brooklyn",
      areas: [
        { name: "Williamsburg", lat: 40.7081, lng: -73.9571 },
        { name: "Bushwick", lat: 40.6958, lng: -73.9171 }
      ]
    }
  ]
};

// Haversine formula to calculate distance between two points (in kilometers)
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

module.exports.getAddressCoordinate = async (address) => {
  try {
    if (!address) {
      throw new Error('Address is required');
    }

    const normalizedAddress = address.toLowerCase().trim();

    // Search through all cities and areas
    for (const city of areaCoordinates.cities) {
      if (normalizedAddress.includes(city.name.toLowerCase())) {
        for (const area of city.areas) {
          if (normalizedAddress.includes(area.name.toLowerCase())) {
            return {
              ltd: area.lat,
              lng: area.lng
            };
          }
        }
        return {
          ltd: city.areas[0].lat,
          lng: city.areas[0].lng
        };
      }

      for (const area of city.areas) {
        if (normalizedAddress.includes(area.name.toLowerCase())) {
          return {
            ltd: area.lat,
            lng: area.lng
          };
        }
      }
    }

    throw new Error('No matching coordinates found for the provided address');
  } catch (error) {
    console.error('Error getting coordinates:', error.message);
    throw new Error('Failed to fetch coordinates for address');
  }
};

module.exports.getDistanceTime = async (origin, destination) => {
  try {
    if (!origin || !destination) {
      throw new Error('Origin and destination are required');
    }

    const originCoords = await module.exports.getAddressCoordinate(origin);
    const destCoords = await module.exports.getAddressCoordinate(destination);

    const distanceKm = getDistance(
      originCoords.ltd,
      originCoords.lng,
      destCoords.ltd,
      destCoords.lng
    );

    const averageSpeedKmH = 40;
    const durationHours = distanceKm / averageSpeedKmH;
    const durationSeconds = durationHours * 3600;

    return {
      distance: { text: distanceKm.toFixed(2) + ' km', value: Math.round(distanceKm * 1000) },
      duration: { text: Math.round(durationSeconds / 60) + ' mins', value: Math.round(durationSeconds) }
    };
  } catch (err) {
    console.error('Error calculating distance/time:', err.message);
    throw err;
  }
};

module.exports.getAutoCompleteSuggestions = async (input) => {
  try {
    if (!input) {
      throw new Error('Query is required');
    }

    const inputLower = input.toLowerCase();
    const suggestions = [];

    for (const city of areaCoordinates.cities) {
      if (city.name.toLowerCase().includes(inputLower)) {
        suggestions.push(city.name);
      }
      for (const area of city.areas) {
        if (area.name.toLowerCase().includes(inputLower)) {
          suggestions.push(area.name);
        }
        if ((`${area.name}, ${city.name}`).toLowerCase().includes(inputLower)) {
          suggestions.push(`${area.name}, ${city.name}`);
        }
      }
    }

    return [...new Set(suggestions)].slice(0, 5);
  } catch (err) {
    console.error('Error getting autocomplete suggestions:', err.message);
    throw err;
  }
};

module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {
  try {
    const captains = await captainModel.find({
      status: 'active'
    });

    const captainsInRadius = captains.filter(captain => {
      if (!captain.location || !captain.location.ltd || !captain.location.lng) {
        return false;
      }

      const distance = getDistance(ltd, lng, captain.location.ltd, captain.location.lng);
      return distance <= radius;
    });

    return captainsInRadius;
  } catch (err) {
    console.error('Error finding captains:', err.message);
    return [];
  }
};

module.exports.getAvailableLocations = async () => {
  try {
    const locations = [];

    areaCoordinates.cities.forEach(city => {
      city.areas.forEach(area => {
        locations.push(area.name);
      });
    });

    return [...new Set(locations)];
  } catch (error) {
    console.error('Error fetching available locations:', error.message);
    throw new Error('Failed to fetch available locations');
  }
};