'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';

// Fix for default marker icons in production
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface SensorMapProps {
  isDrawing: boolean;
  onAreaCalculated: (area: number, shapes: any[]) => void;
  onClear: boolean;
}

export default function SensorMap({ isDrawing, onAreaCalculated, onClear }: SensorMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const drawnItemsRef = useRef<L.FeatureGroup | null>(null);
  const drawControlRef = useRef<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Initialize map centered on Cuiabá, Brazil
    if (!mapRef.current) {
      console.log('[v0] Initializing Leaflet map');
      
      const map = L.map('map').setView([-15.6014, -56.0979], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      mapRef.current = map;

      // Initialize FeatureGroup for drawn items
      const drawnItems = new L.FeatureGroup();
      map.addLayer(drawnItems);
      drawnItemsRef.current = drawnItems;

      // Initialize draw control
      const drawControl = new L.Control.Draw({
        edit: {
          featureGroup: drawnItems,
          edit: {},
          remove: {},
        },
        draw: {
          polygon: {
            allowIntersection: false,
            showArea: true,
          },
          polyline: false,
          rectangle: true,
          circle: false,
          marker: false,
          circlemarker: false,
        },
      } as any);

      drawControlRef.current = drawControl;

      // Event handler for created shapes
      map.on(L.Draw.Event.CREATED, (event: any) => {
        console.log('[v0] Shape created, calculating area');
        const layer = event.layer;
        drawnItems.addLayer(layer);
        calculateTotalArea();
      });

      // Event handler for edited shapes
      map.on(L.Draw.Event.EDITED, () => {
        console.log('[v0] Shapes edited, recalculating area');
        calculateTotalArea();
      });

      // Event handler for deleted shapes
      map.on(L.Draw.Event.DELETED, () => {
        console.log('[v0] Shapes deleted, recalculating area');
        calculateTotalArea();
      });
    }

    const calculateTotalArea = () => {
      if (!drawnItemsRef.current) return;

      let totalArea = 0;
      const shapes: any[] = [];

      drawnItemsRef.current.eachLayer((layer: any) => {
        if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
          const area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
          // Convert square meters to hectares
          totalArea += area / 10000;
          shapes.push(layer.toGeoJSON());
        }
      });

      onAreaCalculated(totalArea, shapes);
    };

    return () => {
      if (mapRef.current) {
        console.log('[v0] Cleaning up map instance');
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [mounted, onAreaCalculated]);

  // Handle drawing mode toggle
  useEffect(() => {
    if (!mapRef.current || !drawControlRef.current) return;

    if (isDrawing) {
      console.log('[v0] Enabling draw controls');
      mapRef.current.addControl(drawControlRef.current);
    } else {
      console.log('[v0] Disabling draw controls');
      mapRef.current.removeControl(drawControlRef.current);
    }
  }, [isDrawing]);

  // Handle clear
  useEffect(() => {
    if (onClear && drawnItemsRef.current) {
      console.log('[v0] Clearing all drawn shapes');
      drawnItemsRef.current.clearLayers();
      onAreaCalculated(0, []);
    }
  }, [onClear, onAreaCalculated]);

  if (!mounted) {
    return null;
  }

  return (
    <div id="map" className="w-full h-full" />
  );
}
