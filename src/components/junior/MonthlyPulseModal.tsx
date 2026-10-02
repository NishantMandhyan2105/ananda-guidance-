import React, { useState } from 'react';
import { MessageSquareText, Star, CheckCircle, Info } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../common/Modal';

interface MonthlyPulseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MonthlyPulseModal: React.FC<MonthlyPulseModalProps> = ({ isOpen, onClose }) => {
  const { submitMonthlyPulse, monthlyPulses } = useData();
  const { currentUser } = useAuth();

  const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

  // Check if student already submitted this month
  const alreadySubmitted = monthlyPulses.some(
    p => p.junior_id === currentUser?.id && p.month === currentMonth
  );

  // Form states
  const [interacted, setInteracted] = useState(true);
  const [usefulness, setUsefulness] = useState(5);
  const [goalClarity, setGoalClarity] = useState(5);
  const [actionCompleted, setActionCompleted] = useState(true);
  const [nextGuidanceRequest, setNextGuidanceRequest] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const res = submitMonthlyPulse({
      junior_id: currentUser.id,
      month: currentMonth,
      interaction_completed: interacted,
      usefulness_rating: usefulness,
      goal_clarity_rating: goalClarity,
      previous_action_completed: actionCompleted,
      next_guidance_request: nextGuidanceRequest
    });

    if (res.success) {
      onClose();
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Monthly Junior Pulse"
      subtitle={`5-Question Check-in for ${currentMonth}`}
      maxWidth="lg"
    >
      {alreadySubmitted ? (
        <div className="p-8 text-center space-y-3">
          <CheckCircle className="w-12 h-12 mx-auto text-emerald-500" />
          <h3 className="text-base font-bold text-slate-900">Monthly Pulse Already Submitted</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You have already recorded your feedback for {currentMonth}. Thank you for helping improve senior guidance for our campus!
          </p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
          >
            Close Window
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-200">
              {errorMessage}
            </div>
          )}

          {/* Question 1 */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            <label className="block text-xs font-bold text-slate-900 mb-2">
              Question 1: Did you interact with your senior this month?
            </label>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setInteracted(true)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                  interacted ? 'bg-teal-700 text-white border-teal-700 shadow-xs' : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                Yes, We Interacted
              </button>
              <button
                type="button"
                onClick={() => setInteracted(false)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                  !interacted ? 'bg-rose-600 text-white border-rose-600 shadow-xs' : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                No, Did Not Connect
              </button>
            </div>
          </div>

          {/* Question 2 */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            <label className="block text-xs font-bold text-slate-900 mb-2">
              Question 2: How useful was the guidance? (1 = Poor, 5 = Extremely Useful)
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setUsefulness(rating)}
                  className={`flex-1 py-2.5 rounded-xl border text-xs font-black flex flex-col items-center justify-center space-y-1 transition-all ${
                    usefulness === rating
                      ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Star className={`w-4 h-4 ${usefulness === rating ? 'fill-white' : 'text-slate-400'}`} />
                  <span>{rating}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Question 3 */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            <label className="block text-xs font-bold text-slate-900 mb-2">
              Question 3: Do you have greater clarity about your next step? (1 = None, 5 = Complete Clarity)
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setGoalClarity(rating)}
                  className={`flex-1 py-2.5 rounded-xl border text-xs font-black flex flex-col items-center justify-center space-y-1 transition-all ${
                    goalClarity === rating
                      ? 'bg-teal-700 text-white border-teal-700 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Star className={`w-4 h-4 ${goalClarity === rating ? 'fill-white' : 'text-slate-400'}`} />
                  <span>{rating}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Question 4 */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            <label className="block text-xs font-bold text-slate-900 mb-2">
              Question 4: Did you complete the action agreed in the previous meeting?
            </label>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setActionCompleted(true)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                  actionCompleted ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                Yes, Action Completed
              </button>
              <button
                type="button"
                onClick={() => setActionCompleted(false)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                  !actionCompleted ? 'bg-slate-600 text-white border-slate-600 shadow-xs' : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                Still Working On It
              </button>
            </div>
          </div>

          {/* Question 5 */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
            <label className="block text-xs font-bold text-slate-900 mb-2">
              Question 5: What guidance would you like in the next meeting?
            </label>
            <textarea
              required
              rows={3}
              value={nextGuidanceRequest}
              onChange={(e) => setNextGuidanceRequest(e.target.value)}
              placeholder="e.g. Need advice on preparing for lab viva and organizing mid-term study time..."
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white"
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
              className="px-5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-md shadow-teal-700/20"
            >
              Submit Monthly Pulse
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
