"use client";

import { Box, Text } from "@chakra-ui/react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
  LayerGroup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";

// Fix for default marker icon in Next.js
const iconUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png";
const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png";
const shadowUrl = "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png";

const defaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

// Tile URLs
const DARK_TILE_URL = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const LIGHT_TILE_URL = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const DARK_ATTRIBUTION = '&copy; <a href="https://carto.com/attributions">CARTO</a>';
const LIGHT_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

// Component that swaps tile layer when colorMode changes
function DynamicTileLayer({ isDark }: { isDark: boolean }) {
  const map = useMap();
  const [tileLayer, setTileLayer] = useState<L.TileLayer | null>(null);

  useEffect(() => {
    // Remove old tile layer
    if (tileLayer) {
      map.removeLayer(tileLayer);
    }
    // Add new tile layer
    const url = isDark ? DARK_TILE_URL : LIGHT_TILE_URL;
    const attribution = isDark ? DARK_ATTRIBUTION : LIGHT_ATTRIBUTION;
    const newLayer = L.tileLayer(url, { attribution, maxZoom: 19 });
    newLayer.addTo(map);
    newLayer.bringToBack();
    setTileLayer(newLayer);

    return () => {
      map.removeLayer(newLayer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDark]);

  return null;
}

// Map Events Component
function MapEvents({
  onBoundsChange,
  onMapClick,
}: {
  onBoundsChange: (bounds: L.LatLngBounds) => void;
  onMapClick: (e: L.LeafletMouseEvent) => void;
}) {
  const map = useMapEvents({
    moveend: () => onBoundsChange(map.getBounds()),
    zoomend: () => onBoundsChange(map.getBounds()),
    click: (e) => onMapClick(e),
  });
  return null;
}

interface CityMapProps {
  places: any[];
  trafficData: any[];
  onBoundsChange: (bounds: L.LatLngBounds) => void;
  flyToPosition: [number, number] | null;
  showPlaces: boolean;
  showTraffic: boolean;
  onProbeUpdate?: (lat: number, lng: number) => void;
  selectedLocation?: { lat: number; lng: number; address: string } | null;
  isDark?: boolean; // NEW — passed from parent based on colorMode
}

export default function CityMap({
  places,
  trafficData,
  onBoundsChange,
  flyToPosition,
  showPlaces,
  showTraffic,
  onProbeUpdate,
  selectedLocation,
  isDark = true,
}: CityMapProps) {
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);

  useEffect(() => {
    if (mapInstance && flyToPosition) {
      mapInstance.flyTo(flyToPosition, 14, { duration: 2, easeLinearity: 0.25 });
      if (onProbeUpdate) onProbeUpdate(flyToPosition[0], flyToPosition[1]);
    }
  }, [flyToPosition, mapInstance]);

  const handleMapClick = (e: L.LeafletMouseEvent) => {
    if (onProbeUpdate) onProbeUpdate(e.latlng.lat, e.latlng.lng);
  };

  const popupBg = isDark ? "#111827" : "#ffffff";
  const popupTextColor = isDark ? "#d1d5db" : "#374151";
  const popupLabelColor = isDark ? "#f43f5e" : "#e11d48";

  return (
    <Box h="full" w="full" zIndex={0} bg={isDark ? "black" : "gray.100"}>
      <MapContainer
        center={[13.0827, 80.2707]}
        zoom={12}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", outline: "none" }}
        ref={setMapInstance}
        zoomControl={true}
      >
        <MapEvents onBoundsChange={onBoundsChange} onMapClick={handleMapClick} />

        {/* Dynamic tile layer that responds to theme */}
        <DynamicTileLayer isDark={isDark} />

        {/* Selected Location Marker (The Probe) */}
        {selectedLocation && (
          <Marker
            position={[selectedLocation.lat, selectedLocation.lng]}
            eventHandlers={{ add: (e) => e.target.openPopup() }}
          >
            <Popup>
              <div
                style={{
                  background: popupBg,
                  color: popupTextColor,
                  fontSize: "13px",
                  fontFamily: "sans-serif",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  minWidth: "180px",
                  lineHeight: "1.5",
                }}
              >
                <span
                  style={{
                    display: "block",
                    marginBottom: "4px",
                    color: popupLabelColor,
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    fontSize: "11px",
                  }}
                >
                  Selected Location
                </span>
                <span>{selectedLocation.address}</span>
              </div>
            </Popup>
          </Marker>
        )}

        <LayersControl position="topright">
          {showPlaces && (
            <LayersControl.Overlay checked name="Places">
              <LayerGroup>
                {places.map((place, idx) => (
                  <Marker
                    key={`place-${idx}`}
                    position={[
                      place.geometry.coordinates[1],
                      place.geometry.coordinates[0],
                    ]}
                  >
                    <Popup>
                      <div style={{ color: "#111827" }}>
                        <strong>{place.properties.name || "Unknown Place"}</strong>
                        <br />
                        Type: {place.properties.amenity || place.properties.leisure}
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </LayerGroup>
            </LayersControl.Overlay>
          )}
        </LayersControl>
      </MapContainer>
    </Box>
  );
}
