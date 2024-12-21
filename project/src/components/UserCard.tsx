import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Plus, Check, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { connectionService } from '../services/connection';
import type { User } from '../types';

interface UserCardProps {
  user: User;
  onRequestSent?: (userId: number) => void;  // onRequestSent expects userId of type number
}

const UserCard = ({ user, onRequestSent }: UserCardProps) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  const handleConnect = async () => {
    if (user.connected || requestSent) return;

    setIsConnecting(true);
    try {
      const userId = Number(user.id);  // Ensure user.id is treated as a number
      if (isNaN(userId)) {
        throw new Error('Invalid user ID');
      }
      await connectionService.sendRequest(userId);  // Send connection request
      setRequestSent(true);
      toast.success(`Connection request sent to ${user.name}`);
      if (onRequestSent) onRequestSent(userId);
    } catch (error) {
      toast.error('Failed to send connection request');
    } finally {
      setIsConnecting(false);
    }
  };

  const getConnectionStatus = () => {
    if (user.connected) {
      return {
        text: 'Connected',
        icon: <Check className="w-4 h-4" />,
        className: 'bg-green-100 text-green-700'
      };
    }
    if (requestSent) {
      return {
        text: 'Request Sent',
        icon: <UserPlus className="w-4 h-4" />,
        className: 'bg-yellow-100 text-yellow-700'
      };
    }
    if (isConnecting) {
      return {
        text: 'Connecting...',
        icon: (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <UserPlus className="w-4 h-4" />
          </motion.div>
        ),
        className: 'bg-gray-100 text-gray-500'
      };
    }
    return {
      text: 'Connect',
      icon: <Plus className="w-4 h-4" />,
      className: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
    };
  };

  const status = getConnectionStatus();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <motion.img
              whileHover={{ scale: 1.1 }}
              src={user.avatar || '/default-avatar.png'}
              alt={user.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
              <p className="text-gray-600">{user.title}</p>
              <div className="flex items-center text-gray-500 text-sm mt-1">
                <MapPin className="w-4 h-4 mr-1" />
                {user.location|| 'Location not specified'}
              </div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleConnect}
            disabled={isConnecting || user.connected || requestSent}
            className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${status.className}`}
          >
            {status.icon}
            <span>{status.text}</span>
          </motion.button>
        </div>

        <div className="mt-4">
          <p className="text-gray-600 text-sm line-clamp-2">{user.bio || 'No bio available'}</p>
        </div>

        {user.skills && user.skills.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {user.skills.map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default UserCard;
