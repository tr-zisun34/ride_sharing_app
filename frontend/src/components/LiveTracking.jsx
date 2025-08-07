// import React, { useState, useEffect } from 'react'
// import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api'

// const containerStyle = {
//     width: '100%',
//     height: '100%',
// };

// const center = {
//     lat: -3.745,
//     lng: -38.523
// };

// const LiveTracking = () => {
//     const [ currentPosition, setCurrentPosition ] = useState(center);

//     useEffect(() => {
//         navigator.geolocation.getCurrentPosition((position) => {
//             const { latitude, longitude } = position.coords;
//             setCurrentPosition({
//                 lat: latitude,
//                 lng: longitude
//             });
//         });

//         const watchId = navigator.geolocation.watchPosition((position) => {
//             const { latitude, longitude } = position.coords;
//             setCurrentPosition({
//                 lat: latitude,
//                 lng: longitude
//             });
//         });

//         return () => navigator.geolocation.clearWatch(watchId);
//     }, []);

//     useEffect(() => {
//         const updatePosition = () => {
//             navigator.geolocation.getCurrentPosition((position) => {
//                 const { latitude, longitude } = position.coords;

//                 console.log('Position updated:', latitude, longitude);
//                 setCurrentPosition({
//                     lat: latitude,
//                     lng: longitude
//                 });
//             });
//         };

//         updatePosition(); // Initial position update

//         const intervalId = setInterval(updatePosition, 1000); // Update every 10 seconds

//     }, []);

//     return (
//         <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
//             <GoogleMap
//                 mapContainerStyle={containerStyle}
//                 center={currentPosition}
//                 zoom={15}
//             >
//                 <Marker position={currentPosition} />
//             </GoogleMap>
//         </LoadScript>
//     )
// }

// export default LiveTracking



import React, { useState, useEffect, useRef } from 'react';

const containerStyle = {
  width: '100%',
  height: '400px',
  border: '1px solid #ccc',
};

const LiveTracking = () => {
  const [currentPosition, setCurrentPosition] = useState({ lat: 0, lng: 0 });
  const canvasRef = useRef(null);

  useEffect(() => {
    // Get initial position
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setCurrentPosition({ lat: latitude, lng: longitude });
    });

    // Watch position updates
    const watchId = navigator.geolocation.watchPosition((position) => {
      const { latitude, longitude } = position.coords;
      setCurrentPosition({ lat: latitude, lng: longitude });
    });

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Simple canvas visualization
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw a simple background (e.g., a green field)
      ctx.fillStyle = 'lightgreen';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Map coordinates to canvas (simplified scaling)
      const canvasX = (currentPosition.lng + 180) * (canvas.width / 360);
      const canvasY = (90 - currentPosition.lat) * (canvas.height / 180);

      // Draw marker
      ctx.beginPath();
      ctx.arc(canvasX, canvasY, 10, 0, 2 * Math.PI);
      ctx.fillStyle = 'red';
      ctx.fill();
      ctx.strokeStyle = 'black';
      ctx.stroke();

      // Draw coordinates text
      ctx.fillStyle = 'black';
      ctx.font = '16px Arial';
      ctx.fillText(`Lat: ${currentPosition.lat.toFixed(4)}, Lng: ${currentPosition.lng.toFixed(4)}`, 10, 20);
    };

    draw();

    const intervalId = setInterval(draw, 1000); // Redraw every second
    return () => clearInterval(intervalId);
  }, [currentPosition]);

  return (
    <div style={containerStyle}>
      <canvas ref={canvasRef} width="800" height="400" />
    </div>
  );
};

export default LiveTracking;