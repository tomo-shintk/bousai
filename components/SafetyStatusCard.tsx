
import React, { useState } from 'react';
import Card from './Card';
import { UserGroupIcon } from './icons/UserGroupIcon';
import { FamilyMember, SafetyStatus } from '../types';

const initialFamilyMembers: FamilyMember[] = [
  { id: 1, name: 'お父さん', status: SafetyStatus.Safe },
  { id: 2, name: 'お母さん', status: SafetyStatus.Safe },
  { id: 3, name: 'おばあちゃん', status: SafetyStatus.Unconfirmed },
  { id: 4, name: '太郎', status: SafetyStatus.NeedsHelp },
];

const SafetyStatusCard: React.FC = () => {
  const [familyMembers] = useState<FamilyMember[]>(initialFamilyMembers);

  const getStatusClass = (status: SafetyStatus) => {
    switch (status) {
      case SafetyStatus.Safe:
        return 'bg-green-100 text-green-800';
      case SafetyStatus.Unconfirmed:
        return 'bg-yellow-100 text-yellow-800';
      case SafetyStatus.NeedsHelp:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card title="家族の安否確認" icon={<UserGroupIcon />}>
      <div className="space-y-2 sm:space-y-3">
        {familyMembers.map((member) => (
          <div key={member.id} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
            <span className="text-sm sm:text-base text-gray-700 font-medium">{member.name}</span>
            <span className={`px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold rounded-full ${getStatusClass(member.status)}`}>
              {member.status}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default SafetyStatusCard;
