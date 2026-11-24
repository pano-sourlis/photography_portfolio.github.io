// ============================================================
//  YOUR PHOTOS GO HERE
//  1. Put your image files in the "photos" folder.
//  2. Add one line per photo below, e.g.
//     { src: "photos/sunset.jpg", title: "Sunset at the pier", category: "Landscape" },
//  3. Delete the placeholder lines (the picsum.photos ones).
//  Categories become filter buttons automatically.
//  Add  featured: true  to a photo to put it in the opening slideshow.
// ============================================================

const SITE = {
  name: "Pano Sourlis",
  tagline: "Photography",
  // Short line shown under your name on the opening screen (delete it to hide)
  intro: "Student photographer with the goal to travel the world.",
  about:
    "I'm a University Student and novice photographer still learning. I am doing this as a hobby at the moment." +
    " These are some photos that I like that I have taken.",
  email: "sourlispanayiotis@gmail.com",
  instagram: "https://instagram.com/pano.sourlis",
};

// ============================================================
//  YOUR GEAR  (shown in the "Gear" section)
//  Add one line per item. "note" is optional.
//  type can be anything: Camera, Lens, Tripod, Filter, Bag...
// ============================================================
const GEAR = [
  { type: "Camera", name: "Sony a6400",                   note: "24MP APS-C mirrorless" },
  { type: "Lens",   name: "Sony E PZ 16–50mm f/3.5–5.6 OSS II", note: "Kit lens, my everyday zoom" },
];

const PHOTOS = [
  { src: "photos/japan-2026/narita_shrine.jpg",         title: "Narita Shrine",                     category: "Japan" },
  { src: "photos/japan-2026/narita_temple.jpg",         title: "Narita Temple",                     category: "Japan" },
  { src: "photos/japan-2026/kyoto_castle_flowers.jpg",  title: "Nijo Castle Flower Garden",         category: "Japan" },
  { src: "photos/japan-2026/inari_shrine_rain.jpg",     title: "Inari Shrine Backpacker",           category: "Japan" },
  { src: "photos/japan-2026/inari_shrine_gates.jpg",    title: "Gates",                             category: "Japan" },
  { src: "photos/japan-2026/inari_shrine_light.jpg",    title: "Ray of light on tori gate",         category: "Japan" },
  { src: "photos/japan-2026/inari_shrine_view.jpg",     title: "Kyoto, Japan",                      category: "Japan" },
  { src: "photos/japan-2026/dotonbori_river_1.jpg",     title: "Dotonbori River",                   category: "Japan" },
  { src: "photos/japan-2026/kyoto_street.jpg",          title: "Rainy day in Kyoto",                category: "Japan" },
  { src: "photos/japan-2026/osaka_castle_1.jpg",        title: "Osaka Castle 1",                    category: "Japan" },
  { src: "photos/japan-2026/osaka_castle_2.jpg",        title: "Osaka Castle 2",                    category: "Japan" },
  { src: "photos/japan-2026/persona_3_station.jpg",     title: "Dark Hour",                         category: "Japan" },
  { src: "photos/japan-2026/tokyo_skytree_river.jpg",   title: "Cool view by the river",            category: "Japan" },

  { src: "photos/camping-2026/bridge.jpg",              title: "Bridge in the forest",              category: "Camping" },
  { src: "photos/camping-2026/night_sky.jpg",           title: "Night Sky",                         category: "Camping" },
  { src: "photos/camping-2026/fur_squat.jpg",           title: "Gyatt",                             category: "Camping" },
  { src: "photos/camping-2026/rapids.jpg",              title: "Adventuring and found rapids",      category: "Camping" },
  { src: "photos/camping-2026/fur_rapids.jpg",          title: "The goat by rapids",                category: "Camping" },
  { src: "photos/camping-2026/fur.jpg",                 title: "The goat",                          category: "Camping" },
];
