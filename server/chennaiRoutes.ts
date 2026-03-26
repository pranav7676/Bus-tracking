export interface BusSeed {
  id: string;
  number: string;
  name: string;
  routeName: string;
  capacity: number;
  speed: number;
  route: [number, number][];
}

function densifyRoute(points: [number, number][], segmentsPerLeg = 8): [number, number][] {
  if (points.length < 2) {
    return points;
  }

  const dense: [number, number][] = [];
  for (let i = 0; i < points.length - 1; i += 1) {
    const [lat1, lng1] = points[i];
    const [lat2, lng2] = points[i + 1];
    for (let step = 0; step < segmentsPerLeg; step += 1) {
      const t = step / segmentsPerLeg;
      dense.push([lat1 + (lat2 - lat1) * t, lng1 + (lng2 - lng1) * t]);
    }
  }
  dense.push(points[points.length - 1]);
  return dense;
}

const routeNames = [
  'Downtown Express',
  'Airport Link',
  'Campus Shuttle',
  'Marina Connector',
  'T Nagar Rapid',
  'Adyar Orbit',
  'Mylapore Metro Link',
  'Guindy Connector',
  'Velachery Flyer',
  'Anna Salai Loop',
  'OMR Breeze',
  'ECR Seaside',
  'Porur Hub',
  'Tambaram Arc',
  'Poonamallee Route',
  'Kilpauk Circle',
  'Perungudi Lane',
  'Kodambakkam Link',
  'Nungambakkam Route',
  'Chromepet Shuttle',
];

function createBaseRoute(index: number): [number, number][] {
  const centerLat = 13.0827;
  const centerLng = 80.2707;
  const latOffset = ((index % 5) - 2) * 0.02;
  const lngOffset = (Math.floor(index / 5) - 2) * 0.02;

  return [
    [centerLat + latOffset, centerLng + lngOffset],
    [centerLat + latOffset + 0.012, centerLng + lngOffset + 0.01],
    [centerLat + latOffset + 0.02, centerLng + lngOffset + 0.018],
    [centerLat + latOffset + 0.013, centerLng + lngOffset + 0.03],
    [centerLat + latOffset + 0.004, centerLng + lngOffset + 0.022],
    [centerLat + latOffset - 0.004, centerLng + lngOffset + 0.012],
  ];
}

export const chennaiBusSeeds: BusSeed[] = Array.from({ length: 20 }, (_, i) => {
  const id = String(i + 1);
  const routeName = routeNames[i] || `Chennai Route ${i + 1}`;
  const speed = 26 + (i % 7) * 2;

  return {
    id,
    number: `BUS-${String(i + 1).padStart(3, '0')}`,
    name: routeName,
    routeName,
    capacity: 38 + (i % 10),
    speed,
    route: densifyRoute(createBaseRoute(i), 10),
  };
});
