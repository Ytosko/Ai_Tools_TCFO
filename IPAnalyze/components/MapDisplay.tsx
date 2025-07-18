import React, { useEffect, useRef } from 'react';

// Leaflet is loaded from CDN in index.html, so we access it from the window object.
// @ts-ignore
const L = window.L;

interface MapDisplayProps {
  lat: number;
  lng: number;
  popupText: string;
}

const MapDisplay: React.FC<MapDisplayProps> = ({ lat, lng, popupText }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    // This effect runs when the component mounts.
    // The key prop in App.tsx ensures this component is re-created for new data,
    // which simplifies state management for the map instance.
    if (mapContainerRef.current && !mapInstanceRef.current) {
      // Initialize map
      const map = L.map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: 11,
        scrollWheelZoom: false,
      });
      mapInstanceRef.current = map;

      // Add tile layer - using a light theme to match the UI
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);

      // Add a custom marker
      const customIcon = L.divIcon({
          className: 'custom-pin',
          html: `<div style="background-color: #E67C15; width: 24px; height: 24px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid #374151; box-shadow: 0 0 10px rgba(0,0,0,0.2);"></div><div style="position: absolute; top: 11px; left: 11px; width: 2px; height: 2px; background: #374151; border-radius: 50%;"></div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 24],
          popupAnchor: [0, -24]
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
      marker.bindPopup(`<b>${popupText}</b>`).openPopup();
    }
    
    // Cleanup function to run when the component unmounts
    return () => {
        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
        }
    };
  // The dependency array is empty because the `key` prop handles re-renders.
  // We only want this effect to run once on mount.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-gray-200 rounded-lg shadow-md overflow-hidden h-full w-full">
        <div ref={mapContainerRef} className="w-full h-full" id="map"></div>
    </div>
  );
};

export default MapDisplay;