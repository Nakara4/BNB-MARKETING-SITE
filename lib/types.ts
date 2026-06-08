import type { ObjectId } from "mongodb";

export type PropertyInput = {
  title: string;
  slug?: string;
  price: number;
  location: string;
  description: string;
  images: string[];
};

export type PropertyDocument = PropertyInput & {
  _id?: ObjectId;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Property = Omit<PropertyDocument, "_id" | "createdAt" | "updatedAt"> & {
  id: string;
  createdAt: string;
  updatedAt: string;
};
