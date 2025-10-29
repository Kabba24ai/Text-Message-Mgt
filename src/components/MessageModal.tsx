import { useState, useEffect } from 'react';
import { X, Plus, Save } from 'lucide-react';
import { TextMessage, supabase } from '../lib/supabase';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (message: Partial<TextMessage>) => void;
  message?: TextMessage | null;
  mode: 'create' | 'edit';
}

export function MessageModal({ isOpen, onClose, onSave, message, mode }: MessageModalProps) {
  const [formData, setFormData] = useState({
    context_category: '',
    content_name: '',
    content: '',
    message_type: 'broadcast' as 'broadcast' | 'funnel_content'
  });
  const [categories, setCategories] = useState<string[]>([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [creatingCategory, setCreatingCategory] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
    if (message && mode === 'edit') {
      setFormData({
        context_category: message.context_category,
        content_name: message.content_name,
        content: message.content,
        message_type: message.message_type
      });
    } else {
      setFormData({
        context_category: '',
        content_name: '',
        content: '',
        message_type: 'broadcast'
      });
    }
  }, [message, mode, isOpen]);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('name')
      .order('name');

    if (error) {
      console.error('Error fetching categories:', error);
    } else {
      setCategories(data?.map(c => c.name) || []);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      alert('Category name is required');
      return;
    }

    setCreatingCategory(true);
    const { error } = await supabase
      .from('categories')
      .insert([{
        name: newCategoryName.trim(),
        description: newCategoryDescription.trim() || null
      }]);

    if (error) {
      console.error('Error creating category:', error);
      alert('Failed to create category');
    } else {
      setFormData({ ...formData, context_category: newCategoryName.trim() });
      setNewCategoryName('');
      setNewCategoryDescription('');
      setShowCategoryModal(false);
      fetchCategories();
    }
    setCreatingCategory(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">
            {mode === 'create' ? 'Create New Message' : 'Edit Message'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Content Category
              </label>
              <button
                type="button"
                onClick={() => setShowCategoryModal(true)}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                <Plus className="w-4 h-4" />
                Category
              </button>
            </div>
            <select
              required
              value={formData.context_category}
              onChange={(e) => setFormData({ ...formData, context_category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content Name
            </label>
            <input
              type="text"
              required
              value={formData.content_name}
              onChange={(e) => setFormData({ ...formData, content_name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Welcome Message"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message Type
            </label>
            <select
              value={formData.message_type}
              onChange={(e) => setFormData({ ...formData, message_type: e.target.value as 'broadcast' | 'funnel_content' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="broadcast">Broadcast</option>
              <option value="funnel_content">Funnel Content</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Enter your message content here..."
            />
            <div className="mt-1 text-sm text-gray-500">
              {formData.content.length} characters
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {mode === 'create' ? 'Create Message' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Create New Category</h3>
              <button
                onClick={() => {
                  setShowCategoryModal(false);
                  setNewCategoryName('');
                  setNewCategoryDescription('');
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter category name"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  value={newCategoryDescription}
                  onChange={(e) => setNewCategoryDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter description"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleCreateCategory}
                  disabled={creatingCategory}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {creatingCategory ? 'Creating...' : 'Create'}
                </button>
                <button
                  onClick={() => {
                    setShowCategoryModal(false);
                    setNewCategoryName('');
                    setNewCategoryDescription('');
                  }}
                  className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
