
import { Mess } from './types';

export const INITIAL_MESSES: Mess[] = [
  {
    id: '3',
    ownerId: 'owner3',
    name: "Teaholic - Tea Addicted Food Carnation",
    location: {
      address: "Pune",
      lat: 18.5204,
      lng: 73.8567
    },
    contact: "9922782809",
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=800",
    logoUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=800",
    menus: {
      breakfast: {
        price: 40,
        items: [
          { name: "चहा (Half/Full)", category: "other", price: 15 },
          { name: "बनमस्का (मालपाणी)", category: "other", price: 30 },
          { name: "बनमस्का + फुल चहा", category: "other", price: 40 },
          { name: "पोहे सांबर", category: "other", price: 25 },
          { name: "इडली सांबर प्लेट (2)", category: "other", price: 30 },
          { name: "उडीद वडा सांबर प्लेट (2)", category: "other", price: 35 },
          { name: "इडली वडा मिक्स", category: "other", price: 40 },
          { name: "प्लेन डोसा", category: "other", price: 30 },
          { name: "मसाला डोसा", category: "other", price: 40 },
          { name: "लोणी स्पंज डोसा", category: "other", price: 40 },
          { name: "उत्तपा कांदा / टोमॅटो", category: "other", price: 40 },
          { name: "आलू पराठा", category: "other", price: 50 },
          { name: "पनीर पराठा", category: "other", price: 60 }
        ]
      },
      lunch: {
        price: 90,
        items: [
          { name: "लंच थाळी (अनलिमिटेड)", category: "other", price: 90 },
          { name: "भाजी चपाती", category: "other", price: 70 }
        ]
      },
      dinner: {
        price: 90,
        items: [
          { name: "शेवभाजी", category: "bhaji" },
          { name: "सोयाबीन खिमा", category: "bhaji" },
          { name: "चपाती", category: "chapati" },
          { name: "जीरा राईस", category: "rice" },
          { name: "तडका दाल", category: "dal" },
          { name: "पनीर भुर्जी थाळी", category: "other", price: 110 },
          { name: "पनीर भुर्जी चपाती", category: "other", price: 80 },
          { name: "व्हेज पुलाव फुल", category: "rice", price: 75 },
          { name: "पनीर पुलाव", category: "rice", price: 85 },
          { name: "बटर दाल खिचडी", category: "dal", price: 80 },
          { name: "तडका दाल खिचडी", category: "dal", price: 85 }
        ]
      }
    },
    comments: [
      { id: 'c1', userName: "Student", text: "Best homely taste and hygienic food!", date: "2026-08-01" }
    ]
  },
  {
    id: '4',
    ownerId: 'owner4',
    name: "श्रीराम भोजनालय (Shreeram Bhojnalay)",
    location: {
      address: "Pune",
      lat: 18.5254,
      lng: 73.8500
    },
    contact: "9876543210",
    rating: 4.6,
    imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?q=80&w=800",
    logoUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800",
    menus: {
      breakfast: {
        price: 30,
        items: [
          { name: "Tea", category: "other" }
        ]
      },
      lunch: {
        price: 90,
        items: [
          { name: "पावभाजी (पाव / चपाती)", category: "bhaji" },
          { name: "मुगभाजी सुकी", category: "bhaji" },
          { name: "दाळ", category: "dal" },
          { name: "भात", category: "rice" },
          { name: "शेंगदाणा चटणी", category: "other" },
          { name: "राइसप्लेट", category: "other", price: 90 },
          { name: "मिनीप्लेट", category: "other", price: 80 },
          { name: "चपाती भाजी", category: "other", price: 70 },
          { name: "दाळ भात", category: "rice", price: 60 },
          { name: "चपाती पार्सल (1)", category: "chapati", price: 12 }
        ]
      },
      dinner: {
        price: 90,
        items: [
          { name: "शेवगा रस्सा भाजी", category: "bhaji" },
          { name: "बटाटा सुकी भाजी", category: "bhaji" },
          { name: "दाळ", category: "dal" },
          { name: "भात", category: "rice" },
          { name: "शेंगदाणा चटणी", category: "other" },
          { name: "राइसप्लेट", category: "other", price: 90 },
          { name: "मिनीप्लेट", category: "other", price: 80 },
          { name: "चपाती भाजी", category: "other", price: 70 },
          { name: "दाळ भात", category: "rice", price: 60 },
          { name: "चपाती पार्सल (1)", category: "chapati", price: 12 }
        ]
      }
    },
    comments: [
      { id: 'c2', userName: "Foodie", text: "Great taste, must try!", date: "2026-08-01" }
    ]
  },
  {
    id: '1',
    ownerId: 'owner1',
    name: "Annapurna Bhojnalaya",
    location: {
      address: "Near Central Mall, Downtown",
      lat: 18.5204,
      lng: 73.8567
    },
    contact: "9876543210",
    rating: 4.5,
    imageUrl: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?q=80&w=800",
    menus: {
      breakfast: {
        price: 40,
        items: [
          { name: "Poha", category: "other" },
          { name: "Upma", category: "other" },
          { name: "Tea", category: "other" }
        ]
      },
      lunch: {
        price: 80,
        items: [
          { name: "Paneer Masala", category: "bhaji" },
          { name: "Aloo Jeera", category: "bhaji" },
          { name: "Butter Chapati", category: "chapati" },
          { name: "Jeera Rice", category: "rice" },
          { name: "Dal Tadka", category: "dal" }
        ]
      },
      dinner: {
        price: 70,
        items: [
          { name: "Mix Veg", category: "bhaji" },
          { name: "Plain Chapati", category: "chapati" },
          { name: "Moong Dal", category: "dal" }
        ]
      }
    },
    comments: [
      { id: 'c1', userName: "Rahul S.", text: "Best quality bhaji in the area!", date: "2023-10-25" }
    ]
  },
  {
    id: '2',
    ownerId: 'owner2',
    name: "Tiffin Express",
    location: {
      address: "Railway Station Road, West Side",
      lat: 18.5304,
      lng: 73.8467
    },
    contact: "9123456789",
    rating: 4.2,
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800",
    menus: {
      breakfast: { price: 35, items: [{ name: "Misal Pav", category: "other" }] },
      lunch: { 
        price: 90, 
        items: [
          { name: "Baingan Bharta", category: "bhaji" },
          { name: "Bhakri", category: "chapati" }
        ] 
      },
      dinner: { 
        price: 85, 
        items: [
          { name: "Sev Bhaji", category: "bhaji" },
          { name: "Pithala", category: "bhaji" }
        ] 
      }
    },
    comments: []
  }
];
