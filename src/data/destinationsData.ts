import { Destination } from '../types';

export const DESTINATIONS_DATA: Destination[] = [
  {
    id: 'taj-mahal',
    name: 'Taj Mahal',
    tagline: 'The Epitome of Mughal Architecture & Eternal Love',
    city: 'Agra',
    state: 'Uttar Pradesh',
    category: 'heritage',
    rating: 4.9,
    reviewsCount: 14820,
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'An immense mausoleum of white marble, built in Agra between 1631 and 1648 by order of the Mughal emperor Shah Jahan in memory of his favourite wife Mumtaz Mahal. It is the jewel of Muslim art in India and one of the universally admired masterpieces of the world heritage.',
    history: 'Commissioned in 1631 by Mughal Emperor Shah Jahan to house the tomb of Mumtaz Mahal, over 20,000 artisans and craftsmen from Persia, Europe, and India worked for 22 years to complete the ivory-white marble complex on the south bank of the Yamuna river.',
    openingHours: 'Sunrise to Sunset (Closed on Fridays)',
    entryFee: {
      domestic: 50,
      international: 1100,
      camera: 25,
    },
    accessibility: {
      wheelchairAccessible: true,
      audioAssistance: true,
      brailleSignage: true,
      batteryCars: true,
      specialWashrooms: true,
    },
    safetyRating: 4.8,
    crowdStatus: 'moderate',
    crowdPercentage: 62,
    weather: {
      temp: 29,
      condition: 'Clear & Sunny',
      aqi: 94,
      aqiStatus: 'Satisfactory',
    },
    bestTimeToVisit: 'October to March (Sunrise viewing recommended)',
    facilities: [
      'Tourist Information Center',
      'Battery-operated Golf Carts from Gates',
      'Shoe Covers Provided',
      'Drinking Water RO Stations',
      'Cloakroom / Locker facility',
      'Govt-certified Audio Guides',
      'First Aid & Emergency Booth (Gate East/West)'
    ],
    audioGuides: [
      {
        id: 'taj-en-1',
        language: 'English',
        title: 'The Architectural Marvel of Taj Mahal',
        duration: '14:20',
        durationSeconds: 860,
        audioUrl: 'https://actions.google.com/sounds/v1/ambiences/outdoor_ambience.ogg',
        transcript: 'Welcome to the Taj Mahal. As you pass through the magnificent red sandstone Darwaza-i-Rauza (Main Gateway), you will witness the shimmering white marble dome aligning with the four minarets. Notice the calligraphy in Thuluth script which appears uniform in size from bottom to top due to deliberate optical correction by Master Amanat Khan...'
      },
      {
        id: 'taj-hi-1',
        language: 'हिन्दी (Hindi)',
        title: 'ताजमहल की वास्तुकला और अमर प्रेम गाथा',
        duration: '15:10',
        durationSeconds: 910,
        audioUrl: 'https://actions.google.com/sounds/v1/ambiences/outdoor_ambience.ogg',
        transcript: 'ताजमहल में आपका स्वागत है। मुख्य द्वार से प्रवेश करते ही यमुना नदी के तट पर संगमरमर का यह अद्भूत स्मारक आपके सामने प्रस्तुत होता है। 1631 ईस्वी में मुग़ल बादशाह शाहजहाँ ने अपनी बेगम मुमताज़ महल की याद में इसका निर्माण आरंभ कराया था...'
      }
    ],
    safetyGuidelines: [
      'Cigarettes, lighters, tripods, large bags, and food items are prohibited inside the monument premises.',
      'Always hire official UP Tourism & ASI badge-holding tourist guides (verify QR badge on SafarSetu).',
      'Use the designated battery golf carts between parking lots and entry gates to avoid unauthorized vendors.',
      'Emergency SOS booths with direct connection to Agra Tourist Police are stationed at both East and West gates.'
    ],
    dosAndDonts: {
      dos: [
        'Book online tickets through SafarSetu or ASI portal to skip 45-min queue',
        'Carry a valid photo identity proof along with digital tourist pass',
        'Wear comfortable slip-on footwear or use the provided shoe covers',
        'Stay on marked pedestrian pathways to protect heritage garden lawns'
      ],
      donts: [
        'Do not touch or lean on delicate Pietra Dura marble inlay work',
        'Do not carry drone cameras (Strict No-Fly Heritage Zone)',
        'Avoid unauthorized street sellers offering "VIP entry skips"',
        'No photography inside the main crypt / cenotaph chamber'
      ]
    },
    coordinates: [27.1751, 78.0421],
    qrCode: 'SAFARSETU-POI-AGR-001',
    panoramaUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1920&q=80',
    nearbyAttractions: [
      { name: 'Agra Fort', distance: '2.5 km', image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=400&q=80' },
      { name: 'Mehtab Bagh', distance: '1.2 km (River View)', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=400&q=80' },
      { name: 'Fatehpur Sikri', distance: '36 km', image: 'https://images.unsplash.com/photo-1598890777032-bde835ba27c2?auto=format&fit=crop&w=400&q=80' }
    ],
    reviews: [
      {
        id: 'rev-1',
        author: 'Elena Rostova',
        nationality: 'France',
        rating: 5,
        date: 'August 18, 2026',
        comment: 'The SafarSetu audio guide in English was phenomenal! Scanning the QR code at the East Gate let me start the tour seamlessly, and the crowd meter saved me 2 hours.',
        verifiedStay: true
      },
      {
        id: 'rev-2',
        author: 'Vikramaditya Rathore',
        nationality: 'India',
        rating: 5,
        date: 'August 14, 2026',
        comment: 'Great safety measures and battery-car connectivity for senior citizens. The live safety radar showed green zone and zero hassles.',
        verifiedStay: true
      }
    ]
  },
  {
    id: 'amber-fort',
    name: 'Amber Fort & Palace',
    tagline: 'Majestic Hilltop Rajput Fortress & Mirror Palace',
    city: 'Jaipur',
    state: 'Rajasthan',
    category: 'heritage',
    rating: 4.8,
    reviewsCount: 11200,
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1603228254119-e6aef2999238?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Perched high on a rugged hill overlooking Maota Lake, Amber Fort is known for its artistic Hindu style elements. With large ramparts and series of gates and cobbled paths, the palace overlooks Maota Lake, which is the main source of water for the Amer Palace.',
    history: 'Constructed by Raja Man Singh I in 1592, the fort is renowned for the Sheesh Mahal (Palace of Mirrors), Diwan-e-Aam, Sukh Niwas with natural water-cooled air channeling, and the underground tunnels connecting to Jaigarh Fort.',
    openingHours: '08:00 AM – 05:30 PM & Night Tourism: 06:30 PM – 09:15 PM',
    entryFee: {
      domestic: 100,
      international: 550,
      camera: 50,
    },
    accessibility: {
      wheelchairAccessible: true,
      audioAssistance: true,
      brailleSignage: false,
      batteryCars: true,
      specialWashrooms: true,
    },
    safetyRating: 4.7,
    crowdStatus: 'low',
    crowdPercentage: 38,
    weather: {
      temp: 32,
      condition: 'Partly Cloudy',
      aqi: 82,
      aqiStatus: 'Good',
    },
    bestTimeToVisit: 'October to March (Morning jeep ascent or Evening Sound & Light show)',
    facilities: [
      'Jeep Shuttle Service to Fort Crest',
      'Rajasthan Tourism RTDC Verified Cafeteria',
      'Locker & Cloakroom at Suraj Pol',
      'Emergency Health & First Aid Clinic',
      'Multilingual SafarSetu Audio Guide Hub'
    ],
    audioGuides: [
      {
        id: 'amber-en-1',
        language: 'English',
        title: 'Sheesh Mahal & The Rajput Royal Courts',
        duration: '18:40',
        durationSeconds: 1120,
        audioUrl: 'https://actions.google.com/sounds/v1/ambiences/outdoor_ambience.ogg',
        transcript: 'Welcome to Amber Fort. You are standing in the Jaleb Chowk, where victorious Rajput armies once paraded. Above you lies the Ganesh Pol with intricate fresco portraits. Look closely at the Sheesh Mahal, where convex Belgian glass mirrors can illuminate the entire pavilion with a single oil lamp flame...'
      }
    ],
    safetyGuidelines: [
      'Steep stone slopes can be slippery during monsoon; wear rubber-soled walking shoes.',
      'Use authorized Rajasthan Tourism 4x4 jeeps rather than negotiating with unauthorized operators.',
      'Emergency tourist helpdesk is located right inside Suraj Pol entrance.'
    ],
    dosAndDonts: {
      dos: [
        'Watch the Light & Sound Show at 07:30 PM (English) and 08:30 PM (Hindi)',
        'Check out the secret tunnel leading to Jaigarh Fort',
        'Stay hydrated and keep sun protection during mid-day'
      ],
      donts: [
        'Avoid climbing fort parapet outer walls for selfies (Strict warning zone)',
        'Do not litter in Maota Lake or around fort courtyard'
      ]
    },
    coordinates: [26.9855, 75.8513],
    qrCode: 'SAFARSETU-POI-JAI-001',
    panoramaUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1920&q=80',
    nearbyAttractions: [
      { name: 'Hawa Mahal', distance: '9 km', image: 'https://images.unsplash.com/photo-1603228254119-e6aef2999238?auto=format&fit=crop&w=400&q=80' },
      { name: 'City Palace Jaipur', distance: '10 km', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=400&q=80' },
      { name: 'Nahargarh Fort', distance: '6 km', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=400&q=80' }
    ],
    reviews: [
      {
        id: 'rev-3',
        author: 'Liam Davies',
        nationality: 'United Kingdom',
        rating: 5,
        date: 'August 21, 2026',
        comment: 'The Sheesh Mahal is breathless! The SafarSetu offline map guided us through the entire fortress and down to Jaigarh Fort without getting lost.',
        verifiedStay: true
      }
    ]
  },
  {
    id: 'varanasi-ghats',
    name: 'Dashashwamedh & Assi Ghats',
    tagline: 'The Spiritual Heart & Ancient Riverfront of Kashi',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    category: 'spiritual',
    rating: 4.9,
    reviewsCount: 18900,
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'The ancient riverfront of Varanasi encompasses 84 holy stone ghats along the sacred Ganges. Dashashwamedh Ghat is famous for the nightly Ganga Aarti, while Assi Ghat marks the confluence of the Asi River and Ganga, popular for morning Subah-e-Banaras concerts.',
    history: 'Continuously inhabited for over 3,000 years, Varanasi was praised by Mark Twain: "Benares is older than history, older than tradition, older even than legend, and looks twice as old as all of them put together."',
    openingHours: 'Open 24 Hours (Ganga Aarti: 06:45 PM daily)',
    entryFee: {
      domestic: 0,
      international: 0,
      camera: 0,
    },
    accessibility: {
      wheelchairAccessible: false,
      audioAssistance: true,
      brailleSignage: false,
      batteryCars: true,
      specialWashrooms: true,
    },
    safetyRating: 4.6,
    crowdStatus: 'high',
    crowdPercentage: 88,
    weather: {
      temp: 30,
      condition: 'Pleasant Breeze',
      aqi: 110,
      aqiStatus: 'Moderate',
    },
    bestTimeToVisit: 'October to March (05:30 AM for morning boat rides & 06:30 PM for Aarti)',
    facilities: [
      'River Police Patrol Boats & Lifeguard Stations',
      'Prepaid Boat Booking Hub (Govt Rates)',
      'Subah-e-Banaras Yoga & Cultural Pavilion',
      'Tourist Help Center at Godowlia Crossing',
      'Live CCTV & Geo-fenced Tourist Monitoring'
    ],
    audioGuides: [
      {
        id: 'varanasi-en-1',
        language: 'English',
        title: 'The Eternal Ghats & Sacred Ganga Aarti',
        duration: '22:15',
        durationSeconds: 1335,
        audioUrl: 'https://actions.google.com/sounds/v1/ambiences/outdoor_ambience.ogg',
        transcript: 'As twilight falls over the Ganges, Dashashwamedh Ghat transforms into a spectacle of sound, fire, and devotion. Seven young priests dressed in saffron dhotis perform the ritual with brass lamps weighing several kilograms...'
      }
    ],
    safetyGuidelines: [
      'Board only UP Tourism verified boats with standard orange life jackets (check SafarSetu verification QR on boat).',
      'High crowd density during Ganga Aarti (06:30 - 08:00 PM). Keep children close and use SafarSetu live tracker.',
      'Do not photograph cremations at Manikarnika or Harishchandra Ghats out of respect for grieving families.'
    ],
    dosAndDonts: {
      dos: [
        'Attend Subah-e-Banaras classical music recital at Assi Ghat at dawn',
        'Book official electric rickshaws for narrow lanes from Godowlia',
        'Drink only bottled or RO filtered water'
      ],
      donts: [
        'Do not swim in the deep current sections outside marked safe bathing zones',
        'Avoid unauthorized middlemen offering "special rooftop viewing charges"'
      ]
    },
    coordinates: [25.3076, 83.0107],
    qrCode: 'SAFARSETU-POI-VNS-001',
    panoramaUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1920&q=80',
    nearbyAttractions: [
      { name: 'Kashi Vishwanath Temple', distance: '400 m', image: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=400&q=80' },
      { name: 'Sarnath Buddhist Stupa', distance: '12 km', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=400&q=80' },
      { name: 'Ramnagar Fort', distance: '7 km', image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=400&q=80' }
    ],
    reviews: [
      {
        id: 'rev-4',
        author: 'Pooja Iyer',
        nationality: 'India',
        rating: 5,
        date: 'August 19, 2026',
        comment: 'The live safety alert notified us 20 minutes before the heavy evening rush at Dashashwamedh, and we took the alternate scenic path via Chet Singh Ghat!',
        verifiedStay: true
      }
    ]
  },
  {
    id: 'munnar-hills',
    name: 'Munnar & Tea Hills',
    tagline: 'Emerald Mist, High Ranges & Rare Nilgiri Tahr',
    city: 'Munnar',
    state: 'Kerala',
    category: 'nature',
    rating: 4.85,
    reviewsCount: 9650,
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Located at 1,600 metres in the Western Ghats, Munnar is known for endless expanses of tea plantations, pristine valleys, waterfalls, and the Eravikulam National Park, home to the endangered Nilgiri Tahr and the once-in-12-years blooming Neelakurinji flower.',
    history: 'Developed as a summer resort by British tea planters in the late 19th century, Munnar combines Scottish hill station charm with lush tropical flora and indigenous biodiversity.',
    openingHours: '07:30 AM – 05:00 PM (Tea Museum & National Park)',
    entryFee: {
      domestic: 200,
      international: 500,
      camera: 50,
    },
    accessibility: {
      wheelchairAccessible: true,
      audioAssistance: true,
      brailleSignage: false,
      batteryCars: true,
      specialWashrooms: true,
    },
    safetyRating: 4.9,
    crowdStatus: 'low',
    crowdPercentage: 25,
    weather: {
      temp: 19,
      condition: 'Misty & Refreshing',
      aqi: 22,
      aqiStatus: 'Pure Alpine',
    },
    bestTimeToVisit: 'September to May (Post-monsoon greenery & pleasant trekking)',
    facilities: [
      'Kerala Tourism Eco-Buses inside National Park',
      'Verified Mountain Trekking Guides with First Aid',
      'Tea Tasting & Processing Pavilion',
      'Emergency Hill Rescue Ambulance Network',
      'Offline Map & GPS Telemetry Safe Trails'
    ],
    audioGuides: [
      {
        id: 'munnar-en-1',
        language: 'English',
        title: 'Flora, Fauna & Tea Secrets of Western Ghats',
        duration: '16:30',
        durationSeconds: 990,
        audioUrl: 'https://actions.google.com/sounds/v1/ambiences/outdoor_ambience.ogg',
        transcript: 'Welcome to Munnar, the place of three rivers. As the morning mist lifts over the rolling green tea carpets, you are looking at one of the top biodiversity hotspots on Earth...'
      }
    ],
    safetyGuidelines: [
      'Drive carefully on winding hairpin curves; avoid night driving during dense fog conditions.',
      'Check in on SafarSetu before starting isolated forest nature walks.',
      'Do not feed wild animals or veer off marked national park trails.'
    ],
    dosAndDonts: {
      dos: [
        'Download the Munnar Offline Travel Pack on SafarSetu (cell service is patchy in valley spots)',
        'Sample fresh organic Cardamom & White Tea at certified plantations',
        'Carry a light rain jacket and warm fleece layer'
      ],
      donts: [
        'Do not pluck tea leaves without guide authorization',
        'Avoid single-use plastic bottles (Strict eco-sensitive zone)'
      ]
    },
    coordinates: [10.0889, 77.0595],
    qrCode: 'SAFARSETU-POI-KER-001',
    panoramaUrl: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1920&q=80',
    nearbyAttractions: [
      { name: 'Mattupetty Dam', distance: '13 km', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=400&q=80' },
      { name: 'Top Station', distance: '32 km', image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=400&q=80' },
      { name: 'Anamudi Peak', distance: '15 km', image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=400&q=80' }
    ],
    reviews: [
      {
        id: 'rev-5',
        author: 'Ananya Deshmukh',
        nationality: 'India',
        rating: 5,
        date: 'August 22, 2026',
        comment: 'The offline trail tracking was a lifesaver in Top Station where my network dropped! SafarSetu kept logging our journey and check-ins smoothly.',
        verifiedStay: true
      }
    ]
  },
  {
    id: 'hampi-ruins',
    name: 'Hampi Heritage Complex',
    tagline: 'The Boulder-Strewn Golden Capital of Vijayanagara',
    city: 'Hampi',
    state: 'Karnataka',
    category: 'heritage',
    rating: 4.88,
    reviewsCount: 8400,
    image: 'https://images.unsplash.com/photo-1600100397608-f010f443b749?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1600100397608-f010f443b749?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'A UNESCO World Heritage site in east-central Karnataka, Hampi was the capital of the 14th-century Vijayanagara Empire. Famous for the Virupaksha Temple, Stone Chariot at Vittala Temple with musical pillars, and dramatic boulder hills along the Tungabhadra River.',
    history: 'Founded in 1336 by brothers Harihara and Bukka, Hampi became the second-largest city in the medieval world after Beijing, trading rubies, diamonds, and silk in open street bazaars.',
    openingHours: '06:00 AM – 06:00 PM',
    entryFee: {
      domestic: 40,
      international: 600,
      camera: 25,
    },
    accessibility: {
      wheelchairAccessible: true,
      audioAssistance: true,
      brailleSignage: true,
      batteryCars: true,
      specialWashrooms: true,
    },
    safetyRating: 4.9,
    crowdStatus: 'low',
    crowdPercentage: 30,
    weather: {
      temp: 31,
      condition: 'Sunny & Clear',
      aqi: 45,
      aqiStatus: 'Good',
    },
    bestTimeToVisit: 'October to February (Cool breezes & bicycle tours)',
    facilities: [
      'ASI Electric Buggy Service between Vittala & Bazaar',
      'Bicycle Rental Hubs with GPS Safety Trackers',
      'Coracle Boat Verified Boarding Point (with Life Jackets)',
      'Emergency Solar-Powered SOS Call Boxes across complex'
    ],
    audioGuides: [
      {
        id: 'hampi-en-1',
        language: 'English',
        title: 'The Stone Chariot & Musical Pillars of Vittala',
        duration: '15:45',
        durationSeconds: 945,
        audioUrl: 'https://actions.google.com/sounds/v1/ambiences/outdoor_ambience.ogg',
        transcript: 'You are looking at the iconic Stone Chariot, a shrine dedicated to Garuda. Notice how the wheels were carved separately and could originally rotate on their stone axles...'
      }
    ],
    safetyGuidelines: [
      'Carry adequate water and sunhats; daytime temperatures on rocky terrain rise quickly.',
      'Use only verified coracle boat operators with green safety badges.',
      'Stay on marked walking trails when hiking Matanga Hill for sunrise.'
    ],
    dosAndDonts: {
      dos: [
        'Climb Matanga Hill for sunrise panoramic view of the ruins',
        'Rent an e-bicycle for exploring the 26 sq. km heritage zone',
        'Respect active worship protocols inside Virupaksha Temple'
      ],
      donts: [
        'Do not climb on ancient stone pillars or temple carvings',
        'Do not swim in the Tungabhadra River near rapid water check-dams'
      ]
    },
    coordinates: [15.3350, 76.4600],
    qrCode: 'SAFARSETU-POI-KAR-001',
    panoramaUrl: 'https://images.unsplash.com/photo-1600100397608-f010f443b749?auto=format&fit=crop&w=1920&q=80',
    nearbyAttractions: [
      { name: 'Lotus Mahal & Elephant Stables', distance: '3 km', image: 'https://images.unsplash.com/photo-1600100397608-f010f443b749?auto=format&fit=crop&w=400&q=80' },
      { name: 'Matanga Hill Sunrise Point', distance: '1.5 km', image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=400&q=80' },
      { name: 'Anegundi Village', distance: '5 km (Coracle Crossing)', image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=400&q=80' }
    ],
    reviews: [
      {
        id: 'rev-6',
        author: 'Karthik Ramanathan',
        nationality: 'India',
        rating: 5,
        date: 'August 10, 2026',
        comment: 'The audio guide explains every carving in depth. SafarSetu’s map also shows clean rest stops and shaded water stations along the trail.',
        verifiedStay: true
      }
    ]
  }
];
