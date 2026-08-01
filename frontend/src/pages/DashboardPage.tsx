import React from 'react';
import { BarChart3 } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="page-container">
      <div className="max-w-3xl mx-auto">
        <div className="mb-xl text-center">
          <BarChart3 size={48} className="text-accent mx-auto mb-md" />
          <h1 className="title-lg mb-sm">Analytics Dashboard</h1>
          <p className="text-secondary text-lg">
            View real-time statistics and proof history for Scholarship verifications.
          </p>
        </div>
        <div className="card text-center text-secondary">
          Dashboard coming soon...
        </div>
      </div>
    </div>
  );
}
