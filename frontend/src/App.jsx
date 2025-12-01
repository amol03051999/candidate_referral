import React from 'react';
import Dashboard from './components/Dashboard';
import ReferralForm from './components/ReferralForm';
import './index.css'; 

function App() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Candidate Referral System</h1>
        <div className="grid lg:grid-cols-2 gap-8">
          <ReferralForm />
          <Dashboard />
        </div>
      </div>
    </div>
  );
}
export default App;