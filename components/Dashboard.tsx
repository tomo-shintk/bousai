
import React from 'react';
import SafetyStatusCard from './SafetyStatusCard';
import ChecklistCard from './ChecklistCard';
import EvacuationCard from './EvacuationCard';
import CommunityHelpCard from './CommunityHelpCard';
import GeminiAICard from './GeminiAICard';

const Dashboard: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-3">
        <GeminiAICard />
      </div>
      <SafetyStatusCard />
      <ChecklistCard />
      <EvacuationCard />
      <div className="md:col-span-2 lg:col-span-3">
        <CommunityHelpCard />
      </div>
    </div>
  );
};

export default Dashboard;
