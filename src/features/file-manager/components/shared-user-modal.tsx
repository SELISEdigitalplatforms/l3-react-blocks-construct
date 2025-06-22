/* eslint-disable @typescript-eslint/no-empty-function */

import React, { useState, useCallback } from 'react';
import { Search, X, ChevronDown, Trash2 } from 'lucide-react';
import { SharedUser } from '../utils/file-manager';

interface ShareWithMeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedUsers: SharedUser[], permissions: { [key: string]: string }) => void;
  file?: { name: string; id: string } | null;
  currentSharedUsers?: SharedUser[];
}

export const sharedUsers: SharedUser[] = [
  {
    id: '1',
    name: 'Luca Meier',
    email: 'luca.meier@gmail.com',
    role: 'Editor',
  },
  {
    id: '2',
    name: 'Aaron Green',
    email: 'aaron.green@gmail.com',
    role: 'Editor',
  },
  {
    id: '3',
    name: 'Sarah Pavan',
    email: 'sarah.pavan@gmail.com',
    role: 'Editor',
  },
  {
    id: '4',
    name: 'Adrian Müller',
    email: 'adrian.mueller@gmail.com',
    role: 'Editor',
  },
  {
    id: '5',
    name: 'Blocks Smith',
    email: 'demo.construct@studioblocks.com',
    role: 'Editor',
  },
];

const Avatar: React.FC<{ name: string; size?: 'sm' | 'md' }> = ({ name, size = 'md' }) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
  const sizeClasses = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm';

  return (
    <div
      className={`${sizeClasses} rounded-full bg-primary text-white flex items-center justify-center font-medium`}
    >
      {initials}
    </div>
  );
};

// Permission Dropdown
const PermissionDropdown: React.FC<{
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}> = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 min-w-[100px]"
      >
        {options.find((opt) => opt.value === value)?.label || 'Select'}
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 min-w-[120px]">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const ShareWithMeModal: React.FC<ShareWithMeModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  currentSharedUsers = [],
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<SharedUser[]>(currentSharedUsers);
  const [permissions, setPermissions] = useState<{ [key: string]: string }>(() => {
    const initialPermissions: { [key: string]: string } = {};
    currentSharedUsers.forEach((user) => {
      initialPermissions[user.id] = 'Editor';
    });
    return initialPermissions;
  });
  const [currentView, setCurrentView] = useState<'share' | 'manage'>('share');

  const permissionOptions = [
    { value: 'Editor', label: 'Editor' },
    { value: 'Viewer', label: 'Viewer' },
    { value: 'Admin', label: 'Admin' },
  ];

  const filteredUsers = sharedUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleUserToggle = useCallback((user: SharedUser) => {
    setSelectedUsers((prev) => {
      const isSelected = prev.some((u) => u.id === user.id);
      if (isSelected) {
        setPermissions((prevPermissions) => {
          const newPermissions = { ...prevPermissions };
          delete newPermissions[user.id];
          return newPermissions;
        });
        return prev.filter((u) => u.id !== user.id);
      } else {
        setPermissions((prevPermissions) => ({
          ...prevPermissions,
          [user.id]: 'Editor',
        }));
        return [...prev, user];
      }
    });
  }, []);

  const handlePermissionChange = useCallback((userId: string, permission: string) => {
    setPermissions((prev) => ({
      ...prev,
      [userId]: permission,
    }));
  }, []);

  const handleRemoveUser = useCallback((userId: string) => {
    setSelectedUsers((prev) => prev.filter((u) => u.id !== userId));
    setPermissions((prev) => {
      const newPermissions = { ...prev };
      delete newPermissions[userId];
      return newPermissions;
    });
  }, []);

  const handleConfirm = useCallback(() => {
    onConfirm(selectedUsers, permissions);
    onClose();
  }, [selectedUsers, permissions, onConfirm, onClose]);

  const handleCancel = useCallback(() => {
    setSelectedUsers(currentSharedUsers);
    setPermissions(() => {
      const initialPermissions: { [key: string]: string } = {};
      currentSharedUsers.forEach((user) => {
        initialPermissions[user.id] = 'Editor';
      });
      return initialPermissions;
    });
    setSearchQuery('');
    setCurrentView('share');
    onClose();
  }, [currentSharedUsers, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {currentView === 'share'
                ? 'Share'
                : selectedUsers.length > 0
                  ? 'Listed people'
                  : 'Share people'}
            </h2>
            <button onClick={handleCancel} className="p-1 hover:bg-gray-100 rounded-full">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Share View */}
        {currentView === 'share' && (
          <>
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Share with people</h3>

              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Add people"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <PermissionDropdown
                    value="Editor"
                    onChange={() => {}}
                    options={permissionOptions}
                  />
                </div>
              </div>
            </div>

            {/* User List */}
            <div className="flex-1 overflow-y-auto p-6">
              {searchQuery ? (
                <div className="space-y-3">
                  {filteredUsers.map((user) => {
                    const isSelected = selectedUsers.some((u) => u.id === user.id);
                    return (
                      <div
                        key={user.id}
                        onClick={() => handleUserToggle(user)}
                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-50 ${
                          isSelected ? 'bg-blue-50 ring-2 ring-blue-200' : ''
                        }`}
                      >
                        <Avatar name={user.name} />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {user.name}
                          </div>
                          <div className="text-xs text-gray-500 truncate">{user.email}</div>
                        </div>
                        {isSelected && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center text-gray-500 text-sm py-8">
                  The list is currently empty
                </div>
              )}
            </div>
          </>
        )}

        {/* Manage View */}
        {currentView === 'manage' && (
          <>
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-1">Share with people</h3>
              <div className="text-xs text-gray-500">{selectedUsers.length} added to the list</div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-3">
                {selectedUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-3 p-2">
                    <Avatar name={user.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">{user.name}</div>
                      <div className="text-xs text-gray-500 truncate">{user.email}</div>
                    </div>
                    <PermissionDropdown
                      value={permissions[user.id] || 'Editor'}
                      onChange={(value) => handlePermissionChange(user.id, value)}
                      options={permissionOptions}
                    />
                    <button
                      onClick={() => handleRemoveUser(user.id)}
                      className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            {currentView === 'share' && selectedUsers.length > 0 && (
              <button
                onClick={() => setCurrentView('manage')}
                className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
              >
                Manage ({selectedUsers.length})
              </button>
            )}
            {currentView === 'manage' && (
              <button
                onClick={() => setCurrentView('share')}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
              >
                Back
              </button>
            )}
            <button
              onClick={handleConfirm}
              className="px-4 py-2 text-sm bg-teal-600 text-white rounded-md hover:bg-teal-700"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
