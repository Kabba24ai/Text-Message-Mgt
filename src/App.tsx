import { useState, useEffect } from 'react';
import { MessageCircle, Plus, FolderOpen, Send, Search } from 'lucide-react';
import { supabase, TextMessage, EmailMessage } from './lib/supabase';
import { MessageTable } from './components/MessageTable';
import { MessageModal } from './components/MessageModal';
import { CategoriesTab } from './components/CategoriesTab';
import { BroadcastModal } from './components/BroadcastModal';

type FilterType = 'broadcast' | 'funnel_content' | 'email_broadcast' | 'email_funnel_content';
type TabType = 'messages' | 'categories';

function App() {
  const [messages, setMessages] = useState<TextMessage[]>([]);
  const [emailMessages, setEmailMessages] = useState<EmailMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<(TextMessage | EmailMessage)[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>('broadcast');
  const [activeTab, setActiveTab] = useState<TabType>('messages');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState<TextMessage | EmailMessage | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [loading, setLoading] = useState(true);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [contentNameSearch, setContentNameSearch] = useState<string>('');
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchMessages();
    fetchEmailMessages();
  }, []);

  useEffect(() => {
    filterAndSortMessages();
    updateAvailableCategories();
  }, [messages, emailMessages, activeFilter]);

  useEffect(() => {
    filterAndSortMessages();
  }, [categoryFilter, contentNameSearch]);

  const updateAvailableCategories = () => {
    const isEmail = activeFilter === 'email_broadcast' || activeFilter === 'email_funnel_content';
    const sourceMessages = isEmail ? emailMessages : messages;
    const filtered = sourceMessages.filter(msg => msg.message_type === activeFilter);
    const categories = [...new Set(filtered.map(msg => msg.context_category))].sort();
    setAvailableCategories(categories);
  };

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

  const fetchEmailMessages = async () => {
    const { data, error } = await supabase
      .from('email_messages')
      .select('*');

    if (error) {
      console.error('Error fetching email messages:', error);
    } else {
      setEmailMessages(data || []);
    }
  };

  const filterAndSortMessages = () => {
    const isEmail = activeFilter === 'email_broadcast' || activeFilter === 'email_funnel_content';
    const sourceMessages = isEmail ? emailMessages : messages;
    let filtered = sourceMessages.filter(msg => msg.message_type === activeFilter);

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(msg => msg.context_category === categoryFilter);
    }

    if (contentNameSearch.trim()) {
      const searchLower = contentNameSearch.toLowerCase().trim();
      filtered = filtered.filter(msg =>
        msg.content_name.toLowerCase().includes(searchLower)
      );
    }

    if (activeFilter === 'broadcast' || activeFilter === 'email_broadcast') {
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
    const isEmail = activeFilter === 'email_broadcast' || activeFilter === 'email_funnel_content';
    const tableName = isEmail ? 'email_messages' : 'text_messages';

    const { error } = await supabase
      .from(tableName)
      .update({ sent_date: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } else {
      if (isEmail) {
        fetchEmailMessages();
      } else {
        fetchMessages();
      }
      alert('Message sent successfully!');
    }
  };

  const handleEdit = (message: TextMessage | EmailMessage) => {
    setEditingMessage(message);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleCopy = async (message: TextMessage | EmailMessage) => {
    const isEmail = 'subject' in message;
    const tableName = isEmail ? 'email_messages' : 'text_messages';

    const newMessage: any = {
      context_category: message.context_category,
      content_name: `${message.content_name} (Copy)`,
      content: message.content,
      message_type: message.message_type
    };

    if (isEmail && 'subject' in message) {
      newMessage.subject = message.subject;
    }

    const { error } = await supabase
      .from(tableName)
      .insert([newMessage]);

    if (error) {
      console.error('Error copying message:', error);
      alert('Failed to copy message');
    } else {
      if (isEmail) {
        fetchEmailMessages();
      } else {
        fetchMessages();
      }
      alert('Message copied successfully!');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    const isEmail = activeFilter === 'email_broadcast' || activeFilter === 'email_funnel_content';
    const tableName = isEmail ? 'email_messages' : 'text_messages';

    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting message:', error);
      alert('Failed to delete message');
    } else {
      if (isEmail) {
        fetchEmailMessages();
      } else {
        fetchMessages();
      }
    }
  };

  const handleSaveMessage = async (messageData: Partial<TextMessage> | Partial<EmailMessage>) => {
    const isEmail = 'subject' in messageData || messageData.message_type === 'email_broadcast' || messageData.message_type === 'email_funnel_content';
    const tableName = isEmail ? 'email_messages' : 'text_messages';
    if (modalMode === 'edit' && editingMessage) {
      const { error } = await supabase
        .from(tableName)
        .update(messageData)
        .eq('id', editingMessage.id);

      if (error) {
        console.error('Error updating message:', error);
        alert('Failed to update message');
      } else {
        if (isEmail) {
          fetchEmailMessages();
        } else {
          fetchMessages();
        }
        setIsModalOpen(false);
        setEditingMessage(null);
      }
    } else {
      const { error } = await supabase
        .from(tableName)
        .insert([messageData]);

      if (error) {
        console.error('Error creating message:', error);
        alert('Failed to create message');
      } else {
        if (isEmail) {
          fetchEmailMessages();
        } else {
          fetchMessages();
        }
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
            <h1 className="text-3xl font-bold text-gray-900">Message Management</h1>
          </div>
          <p className="text-gray-600">Manage your SMS and email broadcast and funnel content messages</p>
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
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => {
                    setActiveFilter('broadcast');
                    setCategoryFilter('all');
                    setContentNameSearch('');
                  }}
                  className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                    activeFilter === 'broadcast'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  SMS Broadcast
                </button>
                <button
                  onClick={() => {
                    setActiveFilter('funnel_content');
                    setCategoryFilter('all');
                    setContentNameSearch('');
                  }}
                  className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                    activeFilter === 'funnel_content'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  SMS Funnel Content
                </button>
                <button
                  onClick={() => {
                    setActiveFilter('email_broadcast');
                    setCategoryFilter('all');
                    setContentNameSearch('');
                  }}
                  className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                    activeFilter === 'email_broadcast'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  Email Broadcast
                </button>
                <button
                  onClick={() => {
                    setActiveFilter('email_funnel_content');
                    setCategoryFilter('all');
                    setContentNameSearch('');
                  }}
                  className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                    activeFilter === 'email_funnel_content'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  Email Funnel Content
                </button>
              </div>

              <div className="flex gap-2 flex-wrap">
                {(activeFilter === 'broadcast' || activeFilter === 'funnel_content') && (
                  <button
                    onClick={() => setIsBroadcastModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
                  >
                    <Send className="w-5 h-5" />
                    Send New SMS Broadcast
                  </button>
                )}
                {(activeFilter === 'email_broadcast' || activeFilter === 'email_funnel_content') && (
                  <button
                    onClick={() => setIsBroadcastModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
                  >
                    <Send className="w-5 h-5" />
                    Send New Email Broadcast
                  </button>
                )}
                <button
                  onClick={handleCreateNew}
                  className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md"
                >
                  <Plus className="w-5 h-5" />
                  Create New Message
                </button>
              </div>
            </div>

            <div className="mb-6 bg-white rounded-lg shadow p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Category
                  </label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Categories</option>
                    {availableCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search by Content Name
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={contentNameSearch}
                      onChange={(e) => setContentNameSearch(e.target.value)}
                      placeholder="Search content name..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-3 text-sm text-gray-600">
              Showing {filteredMessages.length} message{filteredMessages.length !== 1 ? 's' : ''}
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
                messageType={activeFilter}
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
        messageChannel={activeFilter === 'email_broadcast' || activeFilter === 'email_funnel_content' ? 'email' : 'sms'}
      />

      <BroadcastModal
        isOpen={isBroadcastModalOpen}
        onClose={() => {
          setIsBroadcastModalOpen(false);
          fetchMessages();
          fetchEmailMessages();
        }}
        messageChannel={activeFilter === 'email_broadcast' || activeFilter === 'email_funnel_content' ? 'email' : 'sms'}
      />
    </div>
  );
}

export default App;
