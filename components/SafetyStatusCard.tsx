
import React, { useState, useCallback } from 'react';
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
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(initialFamilyMembers);

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

  const getStatusIcon = (status: SafetyStatus) => {
    switch (status) {
      case SafetyStatus.Safe:
        return '✓';
      case SafetyStatus.Unconfirmed:
        return '?';
      case SafetyStatus.NeedsHelp:
        return '!';
      default:
        return '';
    }
  };

  const updateMemberStatus = useCallback((id: number, newStatus: SafetyStatus) => {
    setFamilyMembers(prev => 
      prev.map(member => 
        member.id === id ? { ...member, status: newStatus } : member
      )
    );
  }, []);

  const statusCounts = familyMembers.reduce((acc, member) => {
    acc[member.status] = (acc[member.status] || 0) + 1;
    return acc;
  }, {} as Record<SafetyStatus, number>);

  return (
    <Card title="家族の安否確認" icon={<UserGroupIcon />}>
      <div className="space-y-3">
        {/* 統計情報 */}
        <div className="grid grid-cols-3 gap-2 mb-3 p-2 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-xs text-gray-600">安全</div>
            <div className="text-lg font-bold text-green-700">{statusCounts[SafetyStatus.Safe] || 0}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-600">未確認</div>
            <div className="text-lg font-bold text-yellow-700">{statusCounts[SafetyStatus.Unconfirmed] || 0}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-600">要救助</div>
            <div className="text-lg font-bold text-red-700">{statusCounts[SafetyStatus.NeedsHelp] || 0}</div>
          </div>
        </div>

        {/* 家族メンバーリスト */}
        {familyMembers.map((member) => (
          <div 
            key={member.id} 
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-gray-700 font-medium">{member.name}</span>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 text-sm font-semibold rounded-full flex items-center ${getStatusClass(member.status)}`}>
                <span className="mr-1">{getStatusIcon(member.status)}</span>
                {member.status}
              </span>
              <select
                value={member.status}
                onChange={(e) => updateMemberStatus(member.id, e.target.value as SafetyStatus)}
                className="text-xs border border-gray-300 rounded p-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                aria-label={`${member.name}の状態を変更`}
              >
                <option value={SafetyStatus.Safe}>安全</option>
                <option value={SafetyStatus.Unconfirmed}>未確認</option>
                <option value={SafetyStatus.NeedsHelp}>要救助</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default SafetyStatusCard;
