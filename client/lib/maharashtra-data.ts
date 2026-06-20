type CityOption = { name: string; slug: string; highlight: string };
type LocalityOption = {
  name: string;
  slug: string;
  city: string;
  citySlug: string;
  district: string;
  districtSlug: string;
  highlight: string;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const city = (name: string, highlight = "Rooms, PGs, flats and local rental demand"): CityOption => ({
  name,
  slug: slugify(name),
  highlight
});

const locality = (name: string, city: string, district: string, highlight: string): LocalityOption => ({
  name,
  slug: slugify(name),
  city,
  citySlug: slugify(city),
  district,
  districtSlug: slugify(district),
  highlight
});

export const maharashtraDistricts = [
  "Ahilyanagar",
  "Akola",
  "Amravati",
  "Chhatrapati Sambhajinagar",
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
  "Dharashiv",
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

export const majorCitiesByDistrict: Record<string, CityOption[]> = {
  Ahilyanagar: [
    city("Ahilyanagar", "Affordable rooms, PGs, shops and flats"),
    city("Ahmednagar", "Legacy city search alias for Ahilyanagar"),
    city("Akole"),
    city("Jamkhed"),
    city("Karjat"),
    city("Kopargaon"),
    city("Nevasa"),
    city("Parner"),
    city("Pathardi"),
    city("Rahata"),
    city("Rahuri"),
    city("Sangamner", "Student, family and working professional rentals"),
    city("Shevgaon"),
    city("Shrigonda"),
    city("Shrirampur", "Student rooms and family rentals")
  ],
  Akola: [
    city("Akola", "Budget rooms, hostels and compact flats"),
    city("Akot"),
    city("Balapur"),
    city("Barshitakli"),
    city("Murtizapur"),
    city("Patur"),
    city("Telhara")
  ],
  Amravati: [
    city("Amravati", "Hostels, shared rooms and family homes"),
    city("Achalpur", "Local rentals and working professional stays"),
    city("Anjangaon Surji"),
    city("Bhatkuli"),
    city("Chandur Bazar"),
    city("Chandur Railway"),
    city("Chikhaldara"),
    city("Daryapur"),
    city("Dhamangaon Railway"),
    city("Dharni"),
    city("Morshi"),
    city("Nandgaon Khandeshwar"),
    city("Tiosa"),
    city("Warud")
  ],
  "Chhatrapati Sambhajinagar": [
    city("Chhatrapati Sambhajinagar", "Hostels, PGs, student rentals and family homes"),
    city("Aurangabad", "Legacy city search alias for Chhatrapati Sambhajinagar"),
    city("Chhatrapati Sambhajinagar Cantonment"),
    city("Gangapur"),
    city("Kannad"),
    city("Khuldabad"),
    city("Paithan"),
    city("Phulambri"),
    city("Sillod"),
    city("Soegaon"),
    city("Vaijapur")
  ],
  Beed: [
    city("Beed", "Room rentals, small flats and family housing"),
    city("Ambejogai"),
    city("Ashti"),
    city("Dharur"),
    city("Georai"),
    city("Kaij"),
    city("Majalgaon"),
    city("Parli"),
    city("Patoda"),
    city("Shirur Kasar"),
    city("Wadwani")
  ],
  Bhandara: [
    city("Bhandara", "Affordable rooms and family rentals"),
    city("Lakhandur"),
    city("Lakhani"),
    city("Mohadi"),
    city("Pauni"),
    city("Sakoli"),
    city("Tumsar")
  ],
  Buldhana: [
    city("Buldhana", "Town rentals and compact apartments"),
    city("Chikhli"),
    city("Deulgaon Raja"),
    city("Jalgaon Jamod"),
    city("Khamgaon", "Commercial and family rental demand"),
    city("Lonar"),
    city("Malkapur", "Rooms and family flats for local demand"),
    city("Mehkar"),
    city("Motala"),
    city("Nandura"),
    city("Sangrampur"),
    city("Shegaon"),
    city("Sindkhed Raja")
  ],
  Chandrapur: [
    city("Chandrapur", "Working professional rooms and family homes"),
    city("Ballarpur", "Industrial workforce and town rentals"),
    city("Bhadravati"),
    city("Brahmapuri"),
    city("Chimur"),
    city("Gondpipri"),
    city("Jiwati"),
    city("Korpana"),
    city("Mul"),
    city("Nagbhid"),
    city("Pombhurna"),
    city("Rajura"),
    city("Saoli"),
    city("Sindewahi"),
    city("Warora")
  ],
  Dhule: [
    city("Dhule", "Budget rentals, hostels and family flats"),
    city("Sakri"),
    city("Shindkheda"),
    city("Shirpur", "Student-focused rooms and apartments")
  ],
  Gadchiroli: [
    city("Gadchiroli", "Town rentals and rooms for working tenants"),
    city("Aheri"),
    city("Armori"),
    city("Bhamragad"),
    city("Chamorshi"),
    city("Desaiganj"),
    city("Dhanora"),
    city("Etapalli"),
    city("Kurkheda"),
    city("Korchi"),
    city("Mulchera"),
    city("Sironcha")
  ],
  Gondia: [
    city("Gondia", "Rooms, family flats and local market rentals"),
    city("Amgaon"),
    city("Arjuni Morgaon"),
    city("Deori"),
    city("Goregaon"),
    city("Sadak Arjuni"),
    city("Salekasa"),
    city("Tirora")
  ],
  Hingoli: [
    city("Hingoli", "Local rentals, hostels and compact homes"),
    city("Aundha Nagnath"),
    city("Basmath"),
    city("Kalamnuri"),
    city("Sengaon")
  ],
  Jalgaon: [
    city("Jalgaon", "Student rooms, family flats and shop rentals"),
    city("Amalner"),
    city("Bhadgaon"),
    city("Bhusawal", "Railway workforce and family housing demand"),
    city("Bodwad"),
    city("Chalisgaon"),
    city("Chopda"),
    city("Dharangaon"),
    city("Erandol"),
    city("Jamner"),
    city("Muktainagar"),
    city("Pachora"),
    city("Parola"),
    city("Raver"),
    city("Yawal")
  ],
  Jalna: [
    city("Jalna", "Town rentals, rooms and family apartments"),
    city("Ambad"),
    city("Badnapur"),
    city("Bhokardan"),
    city("Ghansawangi"),
    city("Jafrabad"),
    city("Mantha"),
    city("Partur")
  ],
  Kolhapur: [
    city("Kolhapur", "Rooms, flats, hostels and mixed-use demand"),
    city("Ajra"),
    city("Bhudargad"),
    city("Chandgad"),
    city("Gadhinglaj"),
    city("Gaganbawada"),
    city("Hatkanangale"),
    city("Ichalkaranji", "Textile workforce and commercial rental demand"),
    city("Kagal"),
    city("Karvir"),
    city("Panhala"),
    city("Radhanagari"),
    city("Shahuwadi"),
    city("Shirol")
  ],
  Latur: [
    city("Latur", "Student rentals, PGs and family homes"),
    city("Ahmadpur"),
    city("Ausa"),
    city("Chakur"),
    city("Deoni"),
    city("Jalkot"),
    city("Nilanga"),
    city("Renapur"),
    city("Shirur Anantpal"),
    city("Udgir", "Town rooms and compact flats")
  ],
  "Mumbai City": [
    city("Mumbai", "Hostels, PGs, shared flats and studio rentals"),
    city("Colaba"),
    city("Fort"),
    city("Byculla"),
    city("Dadar"),
    city("Girgaon"),
    city("Marine Lines"),
    city("Mahalaxmi"),
    city("Parel"),
    city("Worli")
  ],
  "Mumbai Suburban": [
    city("Andheri", "Shared flats, rooms and studio rentals"),
    city("Bandra"),
    city("Borivali", "Family homes and local apartment rentals"),
    city("Chembur"),
    city("Ghatkopar"),
    city("Goregaon"),
    city("Jogeshwari"),
    city("Kandivali"),
    city("Kurla"),
    city("Malad"),
    city("Mulund"),
    city("Powai"),
    city("Santacruz"),
    city("Vile Parle")
  ],
  Nagpur: [
    city("Nagpur", "Rooms, hostels, PGs and family flats"),
    city("Bhiwapur"),
    city("Hingna"),
    city("Kalameshwar"),
    city("Kamptee"),
    city("Katol"),
    city("Kuhi"),
    city("Mauda"),
    city("Narkhed"),
    city("Parseoni"),
    city("Ramtek"),
    city("Savner"),
    city("Umred")
  ],
  Nanded: [
    city("Nanded", "Budget rooms, family apartments and hostels"),
    city("Ardhapur"),
    city("Bhokar"),
    city("Biloli"),
    city("Deglur"),
    city("Dharmabad"),
    city("Hadgaon"),
    city("Himayatnagar"),
    city("Kandhar"),
    city("Kinwat"),
    city("Loha"),
    city("Mahur"),
    city("Mudkhed"),
    city("Mukhed"),
    city("Naigaon"),
    city("Umri")
  ],
  Nandurbar: [
    city("Nandurbar", "Compact rentals and local housing"),
    city("Akkalkuwa"),
    city("Akrani"),
    city("Dhadgaon"),
    city("Navapur"),
    city("Shahada"),
    city("Taloda")
  ],
  Nashik: [
    city("Nashik", "Affordable rooms, hostels, flats and commercial rentals"),
    city("Baglan"),
    city("Chandwad"),
    city("Deola"),
    city("Dindori"),
    city("Igatpuri"),
    city("Kalwan"),
    city("Malegaon", "Town rentals and budget apartments"),
    city("Nandgaon"),
    city("Niphad"),
    city("Peth"),
    city("Sinnar"),
    city("Surgana"),
    city("Trimbakeshwar"),
    city("Yeola")
  ],
  Dharashiv: [
    city("Dharashiv", "Rooms, family homes and local market rentals"),
    city("Osmanabad", "Legacy city search alias for Dharashiv"),
    city("Bhum"),
    city("Kalamb"),
    city("Lohara"),
    city("Omerga"),
    city("Paranda"),
    city("Tuljapur"),
    city("Umarga"),
    city("Washi")
  ],
  Palghar: [
    city("Palghar", "Emerging housing demand and budget rentals"),
    city("Boisar"),
    city("Dahanu"),
    city("Jawhar"),
    city("Mokhada"),
    city("Talasari"),
    city("Vada"),
    city("Vasai", "Apartments, family homes and daily commute rentals"),
    city("Virar"),
    city("Vikramgad")
  ],
  Parbhani: [
    city("Parbhani", "Student rooms, hostels and compact apartments"),
    city("Gangakhed"),
    city("Jintur"),
    city("Manwath"),
    city("Palam"),
    city("Pathri"),
    city("Purna"),
    city("Sailu"),
    city("Sonpeth")
  ],
  Pune: [
    city("Pune", "Students, IT rentals, co-living, 1 BHK and PG demand"),
    city("Ambegaon"),
    city("Baramati", "Local rentals and growing apartment demand"),
    city("Bhor"),
    city("Daund"),
    city("Haveli"),
    city("Indapur"),
    city("Junnar"),
    city("Khed"),
    city("Lonavala"),
    city("Maval"),
    city("Mulshi"),
    city("Pimpri-Chinchwad", "Tech workforce rentals and family flats"),
    city("Purandar"),
    city("Shirur"),
    city("Velhe")
  ],
  Raigad: [
    city("Alibag", "Coastal homes and leisure stay demand"),
    city("Karjat"),
    city("Khalapur"),
    city("Mahad", "Industrial and town rental demand"),
    city("Mangaon"),
    city("Mhasala"),
    city("Murud"),
    city("Panvel", "Transit rentals, flats and working tenant housing"),
    city("Pen"),
    city("Poladpur"),
    city("Roha"),
    city("Shrivardhan"),
    city("Sudhagad Pali"),
    city("Tala"),
    city("Uran")
  ],
  Ratnagiri: [
    city("Ratnagiri", "Coastal rentals, rooms and family homes"),
    city("Chiplun", "Town apartments and local room rentals"),
    city("Dapoli"),
    city("Guhagar"),
    city("Khed"),
    city("Lanja"),
    city("Mandangad"),
    city("Rajapur"),
    city("Sangameshwar")
  ],
  Sangli: [
    city("Sangli", "Student rentals, hostels and small flats"),
    city("Atpadi"),
    city("Jat"),
    city("Kadegaon"),
    city("Kavathe Mahankal"),
    city("Khanapur"),
    city("Miraj", "Medical and education-driven room demand"),
    city("Palus"),
    city("Shirala"),
    city("Tasgaon"),
    city("Vita"),
    city("Walwa")
  ],
  Satara: [
    city("Satara", "Town rentals, rooms, flats and hostels"),
    city("Jaoli"),
    city("Karad", "Student housing and family apartments"),
    city("Khandala"),
    city("Khatav"),
    city("Koregaon"),
    city("Mahabaleshwar"),
    city("Man"),
    city("Patan"),
    city("Phaltan"),
    city("Wai")
  ],
  Sindhudurg: [
    city("Kankavli"),
    city("Devgad"),
    city("Dodamarg"),
    city("Kudal", "Town rentals and local family homes"),
    city("Malvan"),
    city("Sawantwadi", "Coastal rental demand and compact homes"),
    city("Vaibhavwadi"),
    city("Vengurla")
  ],
  Solapur: [
    city("Solapur", "Budget rentals, family flats and room sharing"),
    city("Akkalkot"),
    city("Barshi"),
    city("Karmala"),
    city("Madha"),
    city("Malshiras"),
    city("Mangalvedhe"),
    city("Mohol"),
    city("Pandharpur", "Pilgrim-town stays and local rentals"),
    city("Sangole"),
    city("South Solapur")
  ],
  Thane: [
    city("Thane", "Urban apartments, PGs, offices and co-working spaces"),
    city("Ambarnath"),
    city("Badlapur"),
    city("Bhiwandi"),
    city("Dombivli"),
    city("Kalyan", "Commuter apartments and affordable family homes"),
    city("Mira-Bhayandar"),
    city("Murbad"),
    city("Navi Mumbai", "Rental apartments, office units and student accommodation"),
    city("Shahapur"),
    city("Ulhasnagar")
  ],
  Wardha: [
    city("Wardha", "Student rooms, hostels and local rentals"),
    city("Arvi"),
    city("Ashti"),
    city("Deoli"),
    city("Hinganghat"),
    city("Karanja"),
    city("Samudrapur"),
    city("Seloo")
  ],
  Washim: [
    city("Washim", "Town rentals, family homes and budget rooms"),
    city("Karanja"),
    city("Malegaon"),
    city("Mangrulpir"),
    city("Manora"),
    city("Risod")
  ],
  Yavatmal: [
    city("Yavatmal", "Affordable rooms, flats and local rental demand"),
    city("Arni"),
    city("Babulgaon"),
    city("Darwha"),
    city("Digras"),
    city("Ghatanji"),
    city("Kalamb"),
    city("Kelapur"),
    city("Mahagaon"),
    city("Maregaon"),
    city("Ner"),
    city("Pusad"),
    city("Ralegaon"),
    city("Umarkhed"),
    city("Wani"),
    city("Zari Jamani")
  ]
};

export const featuredMaharashtraCities = [
  majorCitiesByDistrict["Mumbai City"][0],
  majorCitiesByDistrict.Pune[0],
  majorCitiesByDistrict.Nagpur[0],
  majorCitiesByDistrict.Nashik[0],
  majorCitiesByDistrict.Thane[0],
  majorCitiesByDistrict.Thane.find((item) => item.name === "Navi Mumbai") || majorCitiesByDistrict.Thane[1],
  majorCitiesByDistrict["Chhatrapati Sambhajinagar"][0],
  majorCitiesByDistrict.Kolhapur[0]
] as const;

export const cityPages = Object.entries(majorCitiesByDistrict).flatMap(([district, cities]) =>
  cities.map((item) => ({
    city: item.name,
    district,
    slug: item.slug,
    highlight: item.highlight
  }))
);

export const districtPages = maharashtraDistricts.map((district) => ({
  name: district,
  slug: slugify(district)
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

export const localityPages = [
  locality("Andheri West", "Mumbai", "Mumbai City", "Film studios, office districts and premium rental demand"),
  locality("Bandra West", "Mumbai", "Mumbai City", "High-intent rental demand for shared flats and studio homes"),
  locality("Powai", "Mumbai", "Mumbai City", "IT workforce housing, premium apartments and co-living"),
  locality("Thane West", "Thane", "Thane", "Commuter apartments, PGs and family rentals"),
  locality("Kalyan West", "Thane", "Thane", "Affordable apartments and transit-friendly homes"),
  locality("Nerul", "Navi Mumbai", "Thane", "Planned township rentals and student housing"),
  locality("Viman Nagar", "Pune", "Pune", "Student and IT rentals near airports and offices"),
  locality("Kothrud", "Pune", "Pune", "Family homes, shared rooms and education-driven demand"),
  locality("Wakad", "Pune", "Pune", "Fast-moving rental demand near the IT corridor"),
  locality("Hinjewadi", "Pune", "Pune", "IT park rentals, PGs and compact flats"),
  locality("Sitabuldi", "Nagpur", "Nagpur", "Central rental demand and commercial visibility"),
  locality("Dharampeth", "Nagpur", "Nagpur", "Upscale residential demand and office access"),
  locality("College Road", "Nashik", "Nashik", "Student housing, rooms and compact family flats"),
  locality("Indira Nagar", "Nashik", "Nashik", "Balanced rental demand across rooms and apartments"),
  locality("Shahupuri", "Kolhapur", "Kolhapur", "Local commerce, flats and premium rooms"),
  locality("Ichalkaranji", "Kolhapur", "Kolhapur", "Textile workforce housing and commercial demand"),
  locality("Chhatrapati Sambhajinagar West", "Chhatrapati Sambhajinagar", "Chhatrapati Sambhajinagar", "Student and working professional rentals"),
  locality("Aurangabad CIDCO", "Chhatrapati Sambhajinagar", "Chhatrapati Sambhajinagar", "Planned neighbourhood rentals and family flats")
] as const;
