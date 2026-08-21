'use client';
import React from 'react';
import { SquareParking, ArrowUpDown, DoorOpen, Info, UtensilsCrossed, Lock, Banknote, Wifi, Fuel, Ticket, Dumbbell, PartyPopper, ReceiptText, ChefHat, UserRound, Package, Bike, MapPin, Eye, HardHat, Wrench, Check, Smartphone, Headphones, Laptop, Tablet } from 'lucide-react';

export const AMENITY_ICONS: Record<string, React.ReactNode> = {
  parking: <SquareParking size={16} />,
  elevator: <ArrowUpDown size={16} />,
  restroom: <DoorOpen size={16} />,
  info: <Info size={16} />,
  foodcourt: <UtensilsCrossed size={16} />,
  prayer: <Lock size={16} />,
  atm: <Banknote size={16} />,
  wifi: <Wifi size={16} />,
  fuel: <Fuel size={16} />,
  theater: <Ticket size={16} />,
  gym: <Dumbbell size={16} />,
  events: <PartyPopper size={16} />,
};

export const AMENITY_ICON_KEYS = Object.keys(AMENITY_ICONS);

export const STAGE_ICONS: Record<string, React.ReactNode> = {
  receipt: <ReceiptText size={13} />,
  chef: <ChefHat size={13} />,
  rider: <UserRound size={13} />,
  package: <Package size={13} />,
  scooter: <Bike size={13} />,
  mappin: <MapPin size={13} />,
  eye: <Eye size={13} />,
  technician: <HardHat size={13} />,
  wrench: <Wrench size={13} />,
  check: <Check size={13} />,
};

export const PRODUCT_ICONS: Record<string, React.ReactNode> = {
  smartphone: <Smartphone size={18} />,
  headphones: <Headphones size={18} />,
  laptop: <Laptop size={18} />,
  tablet: <Tablet size={18} />,
};
