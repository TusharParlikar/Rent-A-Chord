import Guitar from '../assets/guitar.png';
import Drum from '../assets/drum.png';
import Keyboard from '../assets/image.png';

const instruments = [
  {
    id: 1,
    name: "Acoustic Guitar",
    category: "Guitar",
    pricePerDay: 100,
    image: Guitar,
    description: "Great-sounding 6-string acoustic guitar. Ideal for beginners and pros.",
    availability: "in stock",
  },
  {
    id: 2,
    name: "Drum Set",
    category: "Drums",
    pricePerDay: 300,
    image: Drum,
    description: "Professional drum set with sticks and stool.",
    availability: "only for rent",
  },
  {
    id: 3,
    name: "Keyboard",
    category: "Piano",
    pricePerDay: 200,
    image: Keyboard,
    description: "61-key digital keyboard with speakers and stand.",
    availability: "out of stock",
  },
];

export default instruments;
