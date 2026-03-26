import { useEffect, useMemo } from 'react';
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { BusWithLocation } from '../../types';
import { getRouteByBusId } from '../../lib/chennaiRoutes';

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const busIcon = new L.Icon({
  iconUrl: '/bus-icon.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 34],
  popupAnchor: [0, -32],
});

const userIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

interface UserLocation {
  lat: number;
  lng: number;
}

interface MapComponentProps {
  buses: BusWithLocation[];
  userLocation?: UserLocation | null;
  showUserMarker?: boolean;
  heightClassName?: string;
}

const CHENNAI_CENTER: [number, number] = [13.0827, 80.2707];

function MapRecenter({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, map.getZoom(), { duration: 0.7 });
  }, [center, map]);

  return null;
}

export default function MapComponent({
  buses,
  userLocation = null,
  showUserMarker = true,
  heightClassName = 'h-[420px]',
}: MapComponentProps) {
  const center = useMemo<[number, number]>(() => {
    if (userLocation) {
      return [userLocation.lat, userLocation.lng];
    }
    const firstWithLocation = buses.find((bus) => bus.location);
    if (firstWithLocation?.location) {
      return [firstWithLocation.location.latitude, firstWithLocation.location.longitude];
    }
    return CHENNAI_CENTER;
  }, [buses, userLocation]);

  return (
    <div className={`overflow-hidden rounded-2xl border border-border bg-card shadow-card ${heightClassName}`}>
      <MapContainer center={center} zoom={12} className="h-full w-full" scrollWheelZoom>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {showUserMarker && userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {buses.map((bus) => {
          if (!bus.location) {
            return null;
          }

          return (
            <Marker
              key={bus.id}
              position={[bus.location.latitude, bus.location.longitude]}
              icon={busIcon}
            >
              <Popup>
                <div className="space-y-1 text-sm">
                  <p className="font-semibold">{bus.number}</p>
                  <p>{bus.routeName}</p>
                  <p>Speed: {Math.round(bus.location.speed)} km/h</p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {buses.map((bus) => {
          const route = bus.routePoints && bus.routePoints.length > 1 ? bus.routePoints : getRouteByBusId(bus.id);
          if (route.length < 2) {
            return null;
          }
          return <Polyline key={`route-${bus.id}`} positions={route} color="#0ea5e9" weight={3} opacity={0.65} />;
        })}

        <MapRecenter center={center} />
      </MapContainer>
    </div>
  );
}
