export const brandNameOptions = [
  "RoomRentMaharashtra",
  "MahaRentHub",
  "RentMaha",
  "MaharashtraRooms",
  "MahaStay",
  "RentMitra"
] as const;

export const maharashtraDistricts = [
  "Ahmednagar",
  "Akola",
  "Amravati",
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
  "Yavatmal",
  "Aurangabad"
] as const;

export const featuredMaharashtraCities = [
  {
    city: "Mumbai",
    district: "Mumbai City",
    highlight: "Hostels, PGs, shared flats, studio rentals"
  },
  {
    city: "Pune",
    district: "Pune",
    highlight: "Students, IT rentals, co-living, 1 BHK and PG demand"
  },
  {
    city: "Nagpur",
    district: "Nagpur",
    highlight: "Rooms, boys and girls hostels, family flats"
  },
  {
    city: "Nashik",
    district: "Nashik",
    highlight: "Affordable rooms, hostels, flats, commercial rentals"
  },
  {
    city: "Thane",
    district: "Thane",
    highlight: "Urban apartments, PGs, offices, co-working spaces"
  },
  {
    city: "Navi Mumbai",
    district: "Thane",
    highlight: "Rental apartments, office units, student accommodation"
  },
  {
    city: "Aurangabad",
    district: "Aurangabad",
    highlight: "Hostels, PGs, student rentals, family homes"
  },
  {
    city: "Kolhapur",
    district: "Kolhapur",
    highlight: "Rooms, flats, hostels and mixed-use demand"
  },
  {
    city: "Solapur",
    district: "Solapur",
    highlight: "Budget rentals, family flats, room sharing"
  },
  {
    city: "Sangli",
    district: "Sangli",
    highlight: "Student rentals, hostels, small flats"
  },
  {
    city: "Satara",
    district: "Satara",
    highlight: "Town rentals, rooms, flats, hostel inventory"
  },
  {
    city: "Ahmednagar",
    district: "Ahmednagar",
    highlight: "Affordable rooms, PGs, shops and flats"
  }
] as const;

export const cityPages = featuredMaharashtraCities.map((item) => ({
  ...item,
  slug: item.city.toLowerCase().replace(/\s+/g, "-")
}));

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
