import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, X, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';

type Category = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export function CategoriesTab() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching categories:', error);
    } else {
      setCategories(data || []);
    }
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      alert('Category name is required');
      return;
    }

    const { error } = await supabase
      .from('categories')
      .insert([{
        name: formData.name.trim(),
        description: formData.description.trim() || null
      }]);

    if (error) {
      console.error('Error creating category:', error);
      alert('Failed to create category');
    } else {
      setFormData({ name: '', description: '' });
      setIsCreating(false);
      fetchCategories();
    }
  };

  const handleUpdate = async (id: string) => {
    if (!formData.name.trim()) {
      alert('Category name is required');
      return;
    }

    const { error } = await supabase
      .from('categories')
      .update({
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating category:', error);
      alert('Failed to update category');
    } else {
      setEditingId(null);
      setFormData({ name: '', description: '' });
      fetchCategories();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    } else {
      fetchCategories();
    }
  };

  const startEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData({ name: category.name, description: category.description || '' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormData({ name: '', description: '' });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Categories</h2>
          <p className="text-sm text-gray-600 mt-1">Manage message categories</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          New Category
        </button>
      </div>

      <div className="p-6">
        {isCreating && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border-2 border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Create New Category</h3>
              <button onClick={cancelEdit} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter category name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter description (optional)"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={cancelEdit}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {categories.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No categories found. Create your first category to get started.
            </div>
          ) : (
            categories.map((category) => (
              <div
                key={category.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                {editingId === category.id ? (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Edit Category</h3>
                      <button onClick={cancelEdit} className="text-gray-500 hover:text-gray-700">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <input
                          type="text"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={cancelEdit}
                          className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleUpdate(category.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Save className="w-4 h-4" />
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{category.name}</h3>
                      {category.description && (
                        <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(category)}
                        className="p-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
