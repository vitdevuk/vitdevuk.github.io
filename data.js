/* Maison Noire placeholder catalogue. Text (descriptions, composition, reviews, type labels) lives in i18n.js
 * under p.<id>.desc / p.<id>.comp / p.<id>.review and type.<type>. Names and reviewer initials stay as written. */
window.MAISON = {
  jewelry: [
    { id: "j1", image: "https://images.pexels.com/photos/31087451/pexels-photo-31087451.jpeg?auto=compress&cs=tinysrgb&w=1600", type: "ring", name: "Eclipse Signet", price: 2800, featured: true },
    { id: "j2", image: "https://images.pexels.com/photos/14466162/pexels-photo-14466162.jpeg?auto=compress&cs=tinysrgb&w=1600", type: "ring", name: "Lune Band", price: 1640, featured: false },
    { id: "j3", image: "https://images.pexels.com/photos/35270159/pexels-photo-35270159.jpeg?auto=compress&cs=tinysrgb&w=1600", type: "earring", name: "Goutte", price: 2150, featured: true },
    { id: "j4", image: "https://images.pexels.com/photos/16055233/pexels-photo-16055233.jpeg?auto=compress&cs=tinysrgb&w=1600", type: "earring", name: "Arc Hoop", price: 1280, featured: false },
    { id: "j5", image: "https://images.pexels.com/photos/29193418/pexels-photo-29193418.jpeg?auto=compress&cs=tinysrgb&w=1600", type: "bracelet", name: "Cuff XII", price: 3400, featured: false },
    { id: "j6", image: "https://images.pexels.com/photos/32988537/pexels-photo-32988537.jpeg?auto=compress&cs=tinysrgb&w=1600", type: "bracelet", name: "Fil", price: 980, featured: false },
    { id: "j7", image: "https://images.pexels.com/photos/14999288/pexels-photo-14999288.jpeg?auto=compress&cs=tinysrgb&w=1600", type: "necklace", name: "Sautoir", price: 5600, featured: true },
    { id: "j8", image: "https://images.pexels.com/photos/4595723/pexels-photo-4595723.jpeg?auto=compress&cs=tinysrgb&w=1600", type: "necklace", name: "Collier Bas", price: 4200, featured: false },
    { id: "j9", image: "https://images.pexels.com/photos/37702966/pexels-photo-37702966.jpeg?auto=compress&cs=tinysrgb&w=1600", type: "stone", name: "Smoked Quartz", price: 760, featured: false },
    { id: "j10", image: "https://images.pexels.com/photos/13412779/pexels-photo-13412779.jpeg?auto=compress&cs=tinysrgb&w=1600", type: "stone", name: "Black Spinel", price: 540, featured: false }
  ],
  cosmetics: [
    { id: "c1", image: "https://images.pexels.com/photos/6963141/pexels-photo-6963141.jpeg?auto=compress&cs=tinysrgb&w=1600", type: "care", name: "Night Veil", reviews: [{ by: "A. Moreau" }], price: 86, featured: true },
    { id: "c2", image: "https://images.pexels.com/photos/29642374/pexels-photo-29642374.jpeg?auto=compress&cs=tinysrgb&w=1600", type: "care", name: "Hand Oil", reviews: [{ by: "L. Chen" }], price: 48, featured: false },
    { id: "c3", image: "https://images.pexels.com/photos/6800780/pexels-photo-6800780.jpeg?auto=compress&cs=tinysrgb&w=1600", type: "care", name: "Cold Air Balm", reviews: [{ by: "S. Adler" }], price: 42, featured: false },
    { id: "c4", image: "https://images.pexels.com/photos/4889710/pexels-photo-4889710.jpeg?auto=compress&cs=tinysrgb&w=1600", type: "makeup", name: "Velvet Pigment", reviews: [{ by: "A. Moreau" }], price: 62, featured: true },
    { id: "c5", image: "https://images.pexels.com/photos/4938505/pexels-photo-4938505.jpeg?auto=compress&cs=tinysrgb&w=1600", type: "makeup", name: "Brow Ink", reviews: [{ by: "L. Chen" }], price: 38, featured: false },
    { id: "c6", image: "https://images.pexels.com/photos/7810604/pexels-photo-7810604.jpeg?auto=compress&cs=tinysrgb&w=1600", type: "makeup", name: "Mouth Satin", reviews: [{ by: "S. Adler" }], price: 44, featured: false },
    { id: "c7", image: "https://images.pexels.com/photos/36389336/pexels-photo-36389336.jpeg?auto=compress&cs=tinysrgb&w=1600", type: "perfume", name: "Extrait Quatre", reviews: [{ by: "A. Moreau" }], price: 180, featured: true },
    { id: "c8", image: "https://images.pexels.com/photos/1666404/pexels-photo-1666404.jpeg?auto=compress&cs=tinysrgb&w=1600", type: "perfume", name: "Bois Ferme", reviews: [{ by: "L. Chen" }], price: 160, featured: false },
    { id: "c9", image: "https://images.pexels.com/photos/12402367/pexels-photo-12402367.jpeg?auto=compress&cs=tinysrgb&w=1600", type: "perfume", name: "Peau", reviews: [{ by: "S. Adler" }], price: 140, featured: false }
  ]
};
