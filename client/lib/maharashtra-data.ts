export const maharashtraDistricts = [
  "Ahmednagar",
  "Akola",
  "Amravati",
  "Aurangabad",
  "Beed",
  "Bhandara",
  "Buldhana",
  "Chandrapur",
  "Dhule",
  "Gadchiroli",
  "Gondia",
  "Hingoli",
  "Jalgaon",
  "Jalna",
  "Kolhapur",
  "Latur",
  "Mumbai City",
  "Mumbai Suburban",
  "Nagpur",
  "Nanded",
  "Nandurbar",
  "Nashik",
  "Osmanabad",
  "Palghar",
  "Parbhani",
  "Pune",
  "Raigad",
  "Ratnagiri",
  "Sangli",
  "Satara",
  "Sindhudurg",
  "Solapur",
  "Thane",
  "Wardha",
  "Washim",
  "Yavatmal"
] as const;

export const majorCitiesByDistrict: Record<string, Array<{ name: string; slug: string; highlight: string }>> = {
  Ahmednagar: [
    { name: "Ahmednagar", slug: "ahmednagar", highlight: "Affordable rooms, PGs, shops and flats" },
    { name: "Shrirampur", slug: "shrirampur", highlight: "Student rooms and family rentals" }
  ],
  Akola: [
    { name: "Akola", slug: "akola", highlight: "Budget rooms, hostels and compact flats" }
  ],
  Amravati: [
    { name: "Amravati", slug: "amravati", highlight: "Hostels, shared rooms and family homes" },
    { name: "Achalpur", slug: "achalpur", highlight: "Local rentals and working professional stays" }
  ],
  Aurangabad: [
    { name: "Aurangabad", slug: "aurangabad", highlight: "Hostels, PGs, student rentals, family homes" }
  ],
  Beed: [
    { name: "Beed", slug: "beed", highlight: "Room rentals, small flats and family housing" }
  ],
  Bhandara: [
    { name: "Bhandara", slug: "bhandara", highlight: "Affordable rooms and family rentals" }
  ],
  Buldhana: [
    { name: "Buldhana", slug: "buldhana", highlight: "Town rentals and compact apartments" },
    { name: "Malkapur", slug: "malkapur", highlight: "Rooms and family flats for local demand" }
  ],
  Chandrapur: [
    { name: "Chandrapur", slug: "chandrapur", highlight: "Working professional rooms and family homes" },
    { name: "Ballarpur", slug: "ballarpur", highlight: "Industrial workforce and town rentals" }
  ],
  Dhule: [
    { name: "Dhule", slug: "dhule", highlight: "Budget rentals, hostels and family flats" },
    { name: "Shirpur", slug: "shirpur", highlight: "Student-focused rooms and apartments" }
  ],
  Gadchiroli: [
    { name: "Gadchiroli", slug: "gadchiroli", highlight: "Town rentals and rooms for working tenants" }
  ],
  Gondia: [
    { name: "Gondia", slug: "gondia", highlight: "Rooms, family flats and local market rentals" }
  ],
  Hingoli: [
    { name: "Hingoli", slug: "hingoli", highlight: "Local rentals, hostels and compact homes" }
  ],
  Jalgaon: [
    { name: "Jalgaon", slug: "jalgaon", highlight: "Student rooms, family flats and shop rentals" },
    { name: "Bhusawal", slug: "bhusawal", highlight: "Railway workforce and family housing demand" }
  ],
  Jalna: [
    { name: "Jalna", slug: "jalna", highlight: "Town rentals, rooms and family apartments" }
  ],
  Kolhapur: [
    { name: "Kolhapur", slug: "kolhapur", highlight: "Rooms, flats, hostels and mixed-use demand" }
  ],
  Latur: [
    { name: "Latur", slug: "latur", highlight: "Student rentals, PGs and family homes" },
    { name: "Udgir", slug: "udgir", highlight: "Town rooms and compact flats" }
  ],
  "Mumbai City": [
    { name: "Mumbai", slug: "mumbai", highlight: "Hostels, PGs, shared flats and studio rentals" }
  ],
  "Mumbai Suburban": [
    { name: "Andheri", slug: "andheri", highlight: "Shared flats, rooms and studio rentals" },
    { name: "Borivali", slug: "borivali", highlight: "Family homes and local apartment rentals" }
  ],
  Nagpur: [
    { name: "Nagpur", slug: "nagpur", highlight: "Rooms, hostels, PGs and family flats" }
  ],
  Nanded: [
    { name: "Nanded", slug: "nanded", highlight: "Budget rooms, family apartments and hostels" }
  ],
  Nandurbar: [
    { name: "Nandurbar", slug: "nandurbar", highlight: "Compact rentals and local housing" }
  ],
  Nashik: [
    { name: "Nashik", slug: "nashik", highlight: "Affordable rooms, hostels, flats and commercial rentals" },
    { name: "Malegaon", slug: "malegaon", highlight: "Town rentals and budget apartments" }
  ],
  Osmanabad: [
    { name: "Osmanabad", slug: "osmanabad", highlight: "Rooms, family homes and local market rentals" }
  ],
  Palghar: [
    { name: "Palghar", slug: "palghar", highlight: "Emerging housing demand and budget rentals" },
    { name: "Vasai", slug: "vasai", highlight: "Apartments, family homes and daily commute rentals" }
  ],
  Parbhani: [
    { name: "Parbhani", slug: "parbhani", highlight: "Student rooms, hostels and compact apartments" }
  ],
  Pune: [
    { name: "Pune", slug: "pune", highlight: "Students, IT rentals, co-living, 1 BHK and PG demand" },
    { name: "Pimpri-Chinchwad", slug: "pimpri-chinchwad", highlight: "Tech workforce rentals and family flats" },
    { name: "Baramati", slug: "baramati", highlight: "Local rentals and growing apartment demand" }
  ],
  Raigad: [
    { name: "Panvel", slug: "panvel", highlight: "Transit rentals, flats and working tenant housing" },
    { name: "Alibag", slug: "alibag", highlight: "Coastal homes and leisure stay demand" }
  ],
  Ratnagiri: [
    { name: "Ratnagiri", slug: "ratnagiri", highlight: "Coastal rentals, rooms and family homes" },
    { name: "Chiplun", slug: "chiplun", highlight: "Town apartments and local room rentals" }
  ],
  Sangli: [
    { name: "Sangli", slug: "sangli", highlight: "Student rentals, hostels and small flats" },
    { name: "Miraj", slug: "miraj", highlight: "Medical and education-driven room demand" }
  ],
  Satara: [
    { name: "Satara", slug: "satara", highlight: "Town rentals, rooms, flats and hostels" },
    { name: "Karad", slug: "karad", highlight: "Student housing and family apartments" }
  ],
  Sindhudurg: [
    { name: "Kudal", slug: "kudal", highlight: "Town rentals and local family homes" },
    { name: "Sawantwadi", slug: "sawantwadi", highlight: "Coastal rental demand and compact homes" }
  ],
  Solapur: [
    { name: "Solapur", slug: "solapur", highlight: "Budget rentals, family flats and room sharing" },
    { name: "Pandharpur", slug: "pandharpur", highlight: "Pilgrim-town stays and local rentals" }
  ],
  Thane: [
    { name: "Thane", slug: "thane", highlight: "Urban apartments, PGs, offices and co-working spaces" },
    { name: "Navi Mumbai", slug: "navi-mumbai", highlight: "Rental apartments, office units and student accommodation" },
    { name: "Kalyan", slug: "kalyan", highlight: "Commuter apartments and affordable family homes" }
  ],
  Wardha: [
    { name: "Wardha", slug: "wardha", highlight: "Student rooms, hostels and local rentals" }
  ],
  Washim: [
    { name: "Washim", slug: "washim", highlight: "Town rentals, family homes and budget rooms" }
  ],
  Yavatmal: [
    { name: "Yavatmal", slug: "yavatmal", highlight: "Affordable rooms, flats and local rental demand" }
  ]
};

export const featuredMaharashtraCities = [
  majorCitiesByDistrict["Mumbai City"][0],
  majorCitiesByDistrict.Pune[0],
  majorCitiesByDistrict.Nagpur[0],
  majorCitiesByDistrict.Nashik[0],
  majorCitiesByDistrict.Thane[0],
  majorCitiesByDistrict.Thane[1],
  majorCitiesByDistrict.Aurangabad[0],
  majorCitiesByDistrict.Kolhapur[0]
] as const;

export const cityPages = Object.entries(majorCitiesByDistrict).flatMap(([district, cities]) =>
  cities.map((city) => ({
    city: city.name,
    district,
    slug: city.slug,
    highlight: city.highlight
  }))
);

export const districtPages = maharashtraDistricts.map((district) => ({
  name: district,
  slug: district.toLowerCase().replace(/\s+/g, "-")
}));

export const categoryBlueprint = [
  {
    label: "Hostels",
    items: ["Boys Hostel", "Girls Hostel"]
  },
  {
    label: "PG Accommodation",
    items: ["Boys PG", "Girls PG"]
  },
  {
    label: "Rooms",
    items: ["1 Sharing", "2 Sharing", "3 Sharing", "4 Sharing", "Single Room"]
  },
  {
    label: "Flats / Apartments",
    items: ["1 RK", "1 BHK", "2 BHK", "3 BHK", "4 BHK+", "Studio Apartment"]
  },
  {
    label: "Commercial",
    items: ["Shops", "Offices", "Co-working Spaces"]
  }
] as const;
