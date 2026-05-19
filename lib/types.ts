export interface Bike {
  id: string;
  name: string;
  type: 'trekking' | 'cross';
  model: string;
  style: 'comfortable' | 'sporty';
  frame: 'male' | 'female';
  price: number;
  images: string[];
  url: string; // <-- EZT JAVÍTOTTAM productLink-ről url-re!
}

export interface FormData {
  style: 'comfortable' | 'sporty';
  frame: 'male' | 'female';
  city: string;
  email: string;
  maxPrice: number;
}

export interface SubmissionData extends FormData {
  selectedBike: Bike;
}
