import { useEffect, useRef } from 'react';
import { getHereApiKey } from './utils/env';

type Marker = { lat: number; lng: number };

interface MapViewProps {
  markers: Marker[];
}


export const MapView: React.FC<MapViewProps> = ({ markers }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const platform = new H.service.Platform({
      apikey: getHereApiKey(),
    });

    const defaultLayers = platform.createDefaultLayers();
    const map = new H.Map(mapRef.current!, defaultLayers.vector.normal.map, {
      center: { lat: 52.5, lng: 13.4 },
      zoom: 5,
      pixelRatio: window.devicePixelRatio || 1,
    });

    new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
    H.ui.UI.createDefault(map, defaultLayers);

    markers.forEach(({ lat, lng }) => {
      const marker = new H.map.Marker({ lat, lng });
      map.addObject(marker);
    });

    return () => map.dispose();
  }, [markers]);

  return <div ref={mapRef} style={{ height: '500px', width: '100%' }} />;
};
