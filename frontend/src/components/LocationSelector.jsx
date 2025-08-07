import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LocationSelector = ({ onLocationUpdate, currentLocation }) => {
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(currentLocation || '');
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/captains/locations`);
            setLocations(response.data.locations);
        } catch (error) {
            console.error('Error fetching locations:', error);
        }
    };

    const handleLocationUpdate = async () => {
        if (!selectedLocation) {
            alert('Please select a location');
            return;
        }

        setIsUpdating(true);
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/captains/update-location`,
                { address: selectedLocation },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            onLocationUpdate(response.data.captain);
            alert('Location updated successfully!');
        } catch (error) {
            console.error('Error updating location:', error);
            alert('Failed to update location');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3">Update Your Location</h3>
            
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Location
                </label>
                <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="">Choose a location...</option>
                    {locations.map((location, index) => (
                        <option key={index} value={location}>
                            {location}
                        </option>
                    ))}
                </select>
            </div>

            <button
                onClick={handleLocationUpdate}
                disabled={isUpdating || !selectedLocation}
                className={`w-full py-2 px-4 rounded-md font-medium ${
                    isUpdating || !selectedLocation
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
            >
                {isUpdating ? 'Updating...' : 'Update Location'}
            </button>

            {currentLocation && (
                <p className="mt-2 text-sm text-gray-600">
                    Current: {currentLocation}
                </p>
            )}
        </div>
    );
};

export default LocationSelector;