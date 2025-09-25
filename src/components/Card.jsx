import React from "react";

export default function Card({ brand, address, prices }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">{brand}</h2>
        <span className="text-sm text-gray-500">{address}</span>
      </div>
      <div className="flex flex-col gap-1">
        <p>Diesel: <span className="font-medium">{prices.diesel ?? "N/A"} €</span></p>
        <p>SP95: <span className="font-medium">{prices.sp95 ?? "N/A"} €</span></p>
        <p>SP98: <span className="font-medium">{prices.sp98 ?? "N/A"} €</span></p>
      </div>
    </div>
  );
}
