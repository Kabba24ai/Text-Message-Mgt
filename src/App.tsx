import { useState, useEffect } from 'react';
import { MessageCircle, Plus, FolderOpen, Send } from 'lucide-react';
import { supabase, TextMessage } from './lib/supabase';
import { MessageTable } from './components/MessageTable';
import { MessageModal } from './components/MessageModal';
import { CategoriesTab } from './components/CategoriesTab';
import { BroadcastModal } from './components/BroadcastModal';

type FilterType = 'broadcast' | 'funnel_content';
type TabType = 'messages' | 'categories';

function App() {
  const [messages, setMessages] = useState<TextMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<TextMessage[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>('broadcast');
  const [activeTab, setActiveTab] = useState<TabType>('messages');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState<TextMessage | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [loading, setLoading] = useState(true);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    filterAndSortMessages();
  }, [messages, activeFilter]);

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('text_messages')
      .select('*');

    if (error) {
      console.error('Error fetching messages:', error);
    } else {
      setMessages(data || []);
    }
    setLoading(false);
  };

  const filterAndSortMessages = () => {
    const filtered = messages.filter(msg => msg.message_type === activeFilter);

    if (activeFilter === 'broadcast') {
      const sorted = filtered.sort((a, b) => {
        if (!a.sent_date && !b.sent_date) return 0;
        if (!a.sent_date) return -1;
        if (!b.sent_date) return 1;
        return new Date(b.sent_date).getTime() - new Date(a.sent_date).getTime();
      });
      setFilteredMessages(sorted);
    } else {
      const sorted = filtered.sort((a, b) => {
        const categoryCompare = a.context_category.localeCompare(b.context_category);
        if (categoryCompare !== 0) return categoryCompare;
        return a.content_name.localeCompare(b.content_name);
      });
      setFilteredMessages(sorted);
    }
  };

  const handleSend = async (id: string) => {
    const { error } = await supabase
      .from('text_messages')
      .update({ sent_date: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } else {
      fetchMessages();
      alert('Message sent successfully!');
    }
  };

  const handleEdit = (message: TextMessage) => {
    setEditingMessage(message);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleCopy = async (message: TextMessage) => {
    const newMessage = {
      context_category: message.context_category,
      content_name: `${message.content_name} (Copy)`,
      content: message.content,
      message_type: message.message_type
    };

    const { error } = await supabase
      .from('text_messages')
      .insert([newMessage]);

    if (error) {
      console.error('Error copying message:', error);
      alert('Failed to copy message');
    } else {
      fetchMessages();
      alert('Message copied successfully!');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    const { error } = await supabase
      .from('text_messages')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message');
    } else {
      fetchMessages();
    }
  };

  const handleSaveMessage = async (messageData: Partial<TextMessage>) => {
    if (modalMode === 'edit' && editingMessage) {
      const { error } = await supabase
        .from('text_messages')
        .update(messageData)
        .eq('id', editingMessage.id);

      if (error) {
        console.error('Error updating message:', error);
        alert('Failed to update message');
      } else {
        fetchMessages();
        setIsModalOpen(false);
        setEditingMessage(null);
      }
    } else {
      const { error } = await supabase
        .from('text_messages')
        .insert([messageData]);

      if (error) {
        console.error('Error creating message:', error);
        alert('Failed to create message');
      } else {
        fetchMessages();
        setIsModalOpen(false);
      }
    }
  };

  const handleCreateNew = () => {
    setEditingMessage(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <MessageCircle className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Text Message Management</h1>
          </div>
          <p className="text-gray-600">Manage your broadcast and funnel content messages</p>
        </div>

        <div className="mb-6 flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-all border-b-2 ${
              activeTab === 'messages'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <MessageCircle className="w-5 h-5" />
            Messages
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-all border-b-2 ${
              activeTab === 'categories'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <FolderOpen className="w-5 h-5" />
            Categories
          </button>
        </div>

        {activeTab === 'messages' ? (
          <>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveFilter('broadcast')}
                  className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                    activeFilter === 'broadcast'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  Broadcast
                </button>
                <button
                  onClick={() => setActiveFilter('funnel_content')}
                  className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                    activeFilter === 'funnel_content'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  Funnel Content
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsBroadcastModalOpen(true)}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
                >
                  <Send className="w-5 h-5" />
                  Send New Broadcast
                </button>
                <button
                  onClick={handleCreateNew}
                  className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md"
                >
                  <Plus className="w-5 h-5" />
                  Create New Message
                </button>
              </div>
            </div>

            {loading ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">Loading messages...</p>
              </div>
            ) : (
              <MessageTable
                messages={filteredMessages}
                onSend={handleSend}
                onEdit={handleEdit}
                onCopy={handleCopy}
                onDelete={handleDelete}
              />
            )}
          </>
        ) : (
          <CategoriesTab />
        )}
      </div>

      <MessageModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingMessage(null);
        }}
        onSave={handleSaveMessage}
        message={editingMessage}
        mode={modalMode}
      />

      <BroadcastModal
        isOpen={isBroadcastModalOpen}
        onClose={() => {
          setIsBroadcastModalOpen(false);
          fetchMessages();
        }}
      />
    </div>
  );
}

export default App;
