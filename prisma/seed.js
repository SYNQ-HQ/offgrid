const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding...');

  // Create Events
  const event1 = await prisma.event.create({
    data: {
      title: 'Off-Grid: Digital Detox',
      date: new Date('2026-06-15T00:00:00Z'),
      time: '8PM - 2AM',
      venue: 'The Silent Space',
      location: 'Berlin, DE',
      total_seats: 100,
      seats_taken: 45,
      cover_image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80',
      description: 'A night to disconnect and reconnect.',
      status: 'upcoming'
    },
  });

  // Create Merch
  await prisma.merch.create({
    data: {
      name: 'Off-Grid Hoodie',
      price: 55.00,
      description: 'Heavyweight cotton hoodie.',
      image_url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80',
      stock: 50,
      category: 'apparel'
    }
  });

  await prisma.merch.create({
    data: {
      name: 'Ceramic Mug',
      price: 25.00,
      description: 'Handcrafted ceramic mug.',
      image_url: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&q=80',
      stock: 100,
      category: 'drinkware'
    }
  });

  // Create Blog Posts
  await prisma.blogPost.create({
    data: {
      title: 'Why we need to disconnect',
      slug: 'why-we-need-to-disconnect',
      content: '# Why we need to disconnect\n\nIn a world of constant connection...', // Corrected: \n to 

      excerpt: 'Exploring the benefits of digital minimalism.',
      status: 'published',
      published_date: new Date()
    }
  });

  // Create Gallery Images
  const galleryImages = [
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80',
  ];

  for (let i = 0; i < galleryImages.length; i++) {
    await prisma.galleryImage.create({
      data: {
        url: galleryImages[i],
        order: i
      }
    });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
