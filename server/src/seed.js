import 'dotenv/config';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import mongoose from 'mongoose';
import { connectDb } from './config/db.js';
import { Destination } from './models/Destination.js';
import { Hotel } from './models/Hotel.js';
import { Restaurant } from './models/Restaurant.js';
import { BlogPost } from './models/BlogPost.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, '..', 'data');

function loadJson(name) {
  const raw = readFileSync(join(dataDir, name), 'utf8');
  return JSON.parse(raw);
}

async function seed() {
  await connectDb();
  await Promise.all([
    Destination.deleteMany({}),
    Hotel.deleteMany({}),
    Restaurant.deleteMany({}),
    BlogPost.deleteMany({}),
  ]);

  const destinations = loadJson('destinations.json');
  const insertedDest = await Destination.insertMany(destinations);
  const slugToId = Object.fromEntries(insertedDest.map((d) => [d.slug, d._id]));

  const hotels = loadJson('hotels.json').map((h) => {
    const { destinationSlug, ...rest } = h;
    return { ...rest, destinationId: slugToId[destinationSlug] };
  });
  await Hotel.insertMany(hotels);

  const restaurants = loadJson('restaurants.json').map((r) => {
    const { destinationSlug, ...rest } = r;
    return { ...rest, destinationId: slugToId[destinationSlug] };
  });
  await Restaurant.insertMany(restaurants);

  const blog = loadJson('blog.json');
  await BlogPost.insertMany(blog);

  console.log(
    `Seeded ${insertedDest.length} destinations, ${hotels.length} hotels, ${restaurants.length} restaurants, ${blog.length} posts.`
  );
  await mongoose.disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
