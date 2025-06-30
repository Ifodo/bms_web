import React from 'react';

export default function CellsPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Battery Cells</h1>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* Add your battery cells content here */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-semibold">Cell Information</h2>
          <p className="text-gray-600">Coming soon...</p>
        </div>
      </div>
    </div>
  );
} 