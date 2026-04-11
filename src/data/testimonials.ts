import type { Testimonial } from "@/types";

// Reviews sourced from Google — link to the Google Maps listing to verify.
const GOOGLE_MAPS_URL = "https://share.google/4WgUx0VlOZucwBqwb";

export const testimonials: Testimonial[] = [
  {
    name: "Mina Lee",
    occasion: "Niseko, Hokkaido",
    quote:
      "On my wedding day Hitomi guided us every step of the process, with exceptional care and attention to detail. We came from Korea so we were worried about the language barrier but her English was so easy to understand and she was very kind — thnxxx Hitomi you are the best!!!",

    stars: 5,
    googleUrl: GOOGLE_MAPS_URL,
  },
  {
    name: "Emily T.",
    occasion: "Lake Toya, Sapporo",
    quote:
      "Thank you for your services — we got married in Sapporo, Lake Toya to be exact. On the day the services provided were exceptional and outstanding, and she was there the whole time re-touching me and helping with the dress. Thank you for your hard work xoxo.",

    stars: 5,
    googleUrl: GOOGLE_MAPS_URL,
  },
  {
    name: "Aisah M.",
    occasion: "Chapel venue, Hokkaido",
    quote:
      "From the trial session until the wedding day, Hitomi was a gem. She helped me feel confident throughout the whole process and her makeup skills were incredible — 5/5.",

    stars: 5,
    googleUrl: GOOGLE_MAPS_URL,
  },
];
