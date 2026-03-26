import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function generateRoute(startLat, startLng, steps = 30) {
  const points = [];
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const lat = startLat + Math.sin(t * Math.PI) * 0.03;
    const lng = startLng + Math.cos(t * Math.PI * 0.6) * 0.03;
    points.push([lat, lng]);
  }
  return points;
}

async function main() {
  for (let i = 1; i <= 30; i += 1) {
    const busNumber = `BUS-${String(i).padStart(3, '0')}`;
    const routeName = `Chennai Route ${String(i).padStart(2, '0')}`;
    const startLat = 13.0827 + (Math.random() - 0.5) * 0.18;
    const startLng = 80.2707 + (Math.random() - 0.5) * 0.18;
    const route = generateRoute(startLat, startLng, 30);

    const bus = await prisma.bus.upsert({
      where: { number: busNumber },
      update: {
        routeName,
        capacity: 40 + (i % 8),
      },
      create: {
        number: busNumber,
        routeName,
        capacity: 40 + (i % 8),
        status: 'INACTIVE',
        currentOccupancy: 0,
      },
    });

    await prisma.routeStop.deleteMany({ where: { busId: bus.id } });

    await prisma.routeStop.createMany({
      data: route.map((point, index) => ({
        busId: bus.id,
        name: `${routeName} Stop ${index + 1}`,
        latitude: point[0],
        longitude: point[1],
        orderIndex: index,
      })),
    });

    await prisma.busLocation.create({
      data: {
        busId: bus.id,
        latitude: route[0][0],
        longitude: route[0][1],
        speed: 0,
        heading: 0,
      },
    });
  }

  console.log('Seeded 30 Chennai buses with route stops.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
