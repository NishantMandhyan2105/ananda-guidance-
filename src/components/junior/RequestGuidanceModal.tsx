import React, { useState } from 'react';
import { HelpCircle, Send, Sparkles } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Modal } from '../common/Modal';

interface RequestGuidanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentorId?: string;
  mentorName?: string;
}

export const RequestGuidanceModal: React.FC<RequestGuidanceModalProps> = ({
  isOpen,
  onClose,
  mentorId,
  mentorName
}) => {
  const { currentUser } = useAuth();
  const { addNotification, showToast } = useNotifications();

  const [topic, setTopic] = useState('Academics');
  const [message, setMessage] = useState('');
  const [preferredMode, setPreferredMode] = useState('in_person');

  const topicsList = [
    'Programming', 'DSA', 'Academics', 'Projects', 'AI', 
    'Web Development', 'Cybersecurity', 'Data', 'Hackathons', 
    'Communication', 'Clubs', 'Internships', 'Career Exploration', 'Other'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !mentorId) return;

    addNotification(
      `Guidance Request from ${currentUser?.name || 'Junior'}`,
      `Requested guidance on "${topic}": ${message}`,
      'info',
      mentorId
    );

    showToast('Guidance Request Sent', `Your senior mentor ${mentorName || ''} has been notified.`, 'success');
    onClose();
    setMessage('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request Guidance from Your Senior Mentor"
      subtitle={`Connecting with ${mentorName || 'your mentor'}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            What do you want guidance on?
          </label>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full p-2.5 text-xs rounded-xl border border-slate-200"
          >
            {topicsList.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Preferred Connect Mode
          </label>
          <select
            value={preferredMode}
            onChange={(e) => setPreferredMode(e.target.value)}
            className="w-full p-2.5 text-xs rounded-xl border border-slate-200"
          >
            <option value="in_person">In Person (Library / Department Lounge)</option>
            <option value="online">Quick 15-min Online Meet</option>
            <option value="phone">Quick Phone Call</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
            Your Question or Discussion Topic
          </label>
          <textarea
            required
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="e.g. Hi bhaiya/didi, I'm stuck on C loop dry running and had questions about the upcoming lab test..."
            className="w-full p-2.5 text-xs rounded-xl border border-slate-200"
          />
        </div>

        <div className="flex justify-end space-x-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-xs flex items-center space-x-1"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Request</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
