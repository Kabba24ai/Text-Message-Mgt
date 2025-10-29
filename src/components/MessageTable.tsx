import { Trash2, Edit, Copy, Send } from 'lucide-react';
import { TextMessage } from '../lib/supabase';

interface MessageTableProps {
  messages: TextMessage[];
  onSend: (id: string) => void;
  onEdit: (message: TextMessage) => void;
  onCopy: (message: TextMessage) => void;
  onDelete: (id: string) => void;
}

export function MessageTable({ messages, onSend, onEdit, onCopy, onDelete }: MessageTableProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'PENDING';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateContent = (content: string) => {
    if (content.length <= 120) return content;
    return content.substring(0, 120) + '...';
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Content Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Content Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Content
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sent Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {messages.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                No messages found
              </td>
            </tr>
          ) : (
            messages.map((message) => (
              <tr key={message.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {message.context_category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {message.content_name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {truncateContent(message.content)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(message.created_date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`${!message.sent_date ? 'text-amber-600 font-semibold' : 'text-gray-500'}`}>
                    {formatDate(message.sent_date)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onSend(message.id)}
                      className="inline-flex items-center justify-center p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      title="Send SMS"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(message)}
                      className="inline-flex items-center justify-center p-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onCopy(message)}
                      className="inline-flex items-center justify-center p-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                      title="Copy"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(message.id)}
                      className="inline-flex items-center justify-center p-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
