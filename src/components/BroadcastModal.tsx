import { useState, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { supabase, TextMessage } from '../lib/supabase';

interface BroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BroadcastModal({ isOpen, onClose }: BroadcastModalProps) {
  const [broadcastMessages, setBroadcastMessages] = useState<TextMessage[]>([]);
  const [selectedMessageId, setSelectedMessageId] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchBroadcastMessages();
    }
  }, [isOpen]);

  const fetchBroadcastMessages = async () => {
    const { data, error } = await supabase
      .from('text_messages')
      .select('*')
      .eq('message_type', 'broadcast')
      .order('content_name');

    if (error) {
      console.error('Error fetching broadcast messages:', error);
    } else {
      setBroadcastMessages(data || []);
    }
  };

  const handleSend = async () => {
    if (!selectedMessageId) {
      alert('Please select a message to send');
      return;
    }

    setSending(true);
    const { error } = await supabase
      .from('text_messages')
      .update({ sent_date: new Date().toISOString() })
      .eq('id', selectedMessageId);

    if (error) {
      console.error('Error sending broadcast:', error);
      alert('Failed to send broadcast');
    } else {
      alert('Broadcast sent successfully!');
      setSelectedMessageId('');
      onClose();
    }
    setSending(false);
  };

  const selectedMessage = broadcastMessages.find(m => m.id === selectedMessageId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">Send New Broadcast</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Broadcast Message
            </label>
            <select
              value={selectedMessageId}
              onChange={(e) => setSelectedMessageId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose a message...</option>
              {broadcastMessages.map((message) => (
                <option key={message.id} value={message.id}>
                  {message.content_name} ({message.context_category})
                  {message.sent_date ? ' - Sent' : ' - Not Sent'}
                </option>
              ))}
            </select>
          </div>

          {selectedMessage && (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-gray-700 mb-1">Message Preview</h3>
                <div className="flex gap-4 text-sm text-gray-600">
                  <span>
                    <span className="font-medium">Category:</span> {selectedMessage.context_category}
                  </span>
                  <span>
                    <span className="font-medium">Name:</span> {selectedMessage.content_name}
                  </span>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded p-4">
                <p className="text-gray-800 whitespace-pre-wrap">{selectedMessage.content}</p>
              </div>
              <div className="mt-3 text-sm text-gray-500">
                {selectedMessage.content.length} characters
                {selectedMessage.sent_date && (
                  <span className="ml-4">
                    Last sent: {new Date(selectedMessage.sent_date).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSend}
              disabled={!selectedMessageId || sending}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
              {sending ? 'Sending...' : 'Send Broadcast'}
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
