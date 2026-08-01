import { brands } from "@/data/brands";
import { departments } from "@/data/departments";

export const benefits = [
  {
    title: "One supplier for the whole shop",
    body: `${departments.length} departments from spices to frozen. No juggling five importers.`,
  },
  {
    title: "Manufacturer margins",
    body: `We manufacture all ${brands.length} house brands ourselves in Ahmedabad. No reseller markup in between.`,
  },
  {
    title: "Free Brisbane-metro delivery over $500",
    body: "QLD-wide freight quoted on request; warehouse pickup by arrangement.",
  },
  {
    title: "No minimum first order",
    body: "Try a few lines, see what moves, then scale up.",
  },
];

export const faqs = [
  {
    question: "How fast is approval?",
    answer: "One business day once we have your ABN and store details.",
  },
  {
    question: "Do you supply restaurants?",
    answer: "Yes. Bulk packs and catering sizes across most departments.",
  },
  {
    question: "Can we get private-label runs?",
    answer: "We manufacture in-house, so talk to us. Minimums apply.",
  },
];
