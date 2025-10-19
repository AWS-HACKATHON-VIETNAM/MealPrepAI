import { useState, useEffect } from 'react';
import { Package, Plus, Loader2, Trash2, Edit2, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { pantryService } from '../services/pantry.service';
import type { PantryItem } from '../types/api.types';
import { Alert } from './ui/alert';

export function PantryScreen() {
  const [items, setItems] = useState<PantryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Add Item Dialog
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemNotes, setNewItemNotes] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Edit Item Dialog
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editItemName, setEditItemName] = useState('');
  const [editItemNotes, setEditItemNotes] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadPantryItems();
  }, []);

  const loadPantryItems = async () => {
    try {
      setIsLoading(true);
      setError('');
      const pantryItems = await pantryService.getPantryItems();
      setItems(pantryItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load pantry items');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (!newItemName.trim()) return;

    try {
      setIsAdding(true);
      setError('');
      const newItem = await pantryService.addPantryItem({
        name: newItemName,
        notes: newItemNotes || undefined,
      });
      setItems([...items, newItem]);
      setNewItemName('');
      setNewItemNotes('');
      setShowAddDialog(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item');
    } finally {
      setIsAdding(false);
    }
  };

  const openEditDialog = (item: PantryItem) => {
    setEditingItemId(item.id);
    setEditItemName(item.name);
    setEditItemNotes(item.notes || '');
    setShowEditDialog(true);
  };

  const handleEditItem = async () => {
    if (!editingItemId || !editItemName.trim()) return;

    try {
      setIsEditing(true);
      setError('');
      const updatedItem = await pantryService.updatePantryItem(editingItemId, {
        name: editItemName,
        notes: editItemNotes || undefined,
      });
      setItems(items.map(i => i.id === editingItemId ? updatedItem : i));
      setShowEditDialog(false);
      setEditingItemId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update item');
    } finally {
      setIsEditing(false);
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this pantry item?');
    if (!confirmDelete) return;

    try {
      setError('');
      await pantryService.deletePantryItem(itemId);
      setItems(items.filter(i => i.id !== itemId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item');
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading pantry items...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="h-full flex flex-col pt-12 pb-20 bg-white">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <Package className="w-6 h-6 text-orange-500" />
            </div>
            <div className="flex-1">
              <h2 className="text-gray-900">My Pantry</h2>
              <p className="text-gray-500 text-sm">{items.length} items in stock</p>
            </div>
            <Button
              onClick={() => setShowAddDialog(true)}
              size="sm"
              className="bg-orange-500 hover:bg-orange-600"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {error && (
          <div className="px-6 py-4">
            <Alert variant="destructive">{error}</Alert>
          </div>
        )}

        {/* Pantry Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No items in your pantry yet</p>
              <p className="text-gray-400 text-sm mt-2">Add items to keep track of what you have</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map(item => (
                <div key={item.id} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-gray-900 font-medium">{item.name}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditDialog(item)}
                        className="text-gray-400 hover:text-orange-500"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {item.notes && (
                    <p className="text-gray-600 text-sm">{item.notes}</p>
                  )}
                  <p className="text-gray-400 text-xs mt-2">
                    Added {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Item Dialog */}
      {showAddDialog && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-2xl border-2 border-gray-300 w-[calc(100%-2rem)] max-w-md p-6 relative">
            <button
              onClick={() => setShowAddDialog(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold mb-4">Add Pantry Item</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Item Name</label>
                <Input
                  autoFocus
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="e.g., Olive Oil"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddItem();
                    }
                  }}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Notes (Optional)</label>
                <Textarea
                  value={newItemNotes}
                  onChange={(e) => setNewItemNotes(e.target.value)}
                  placeholder="e.g., Half bottle remaining"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowAddDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddItem}
                disabled={isAdding || !newItemName.trim()}
                className="bg-orange-500 hover:bg-orange-600"
              >
                {isAdding ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Add Item
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Item Dialog */}
      {showEditDialog && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-2xl border-2 border-gray-300 w-[calc(100%-2rem)] max-w-md p-6 relative">
            <button
              onClick={() => setShowEditDialog(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold mb-4">Edit Pantry Item</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Item Name</label>
                <Input
                  autoFocus
                  value={editItemName}
                  onChange={(e) => setEditItemName(e.target.value)}
                  placeholder="e.g., Olive Oil"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleEditItem();
                    }
                  }}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Notes (Optional)</label>
                <Textarea
                  value={editItemNotes}
                  onChange={(e) => setEditItemNotes(e.target.value)}
                  placeholder="e.g., Half bottle remaining"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowEditDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditItem}
                disabled={isEditing || !editItemName.trim()}
                className="bg-orange-500 hover:bg-orange-600"
              >
                {isEditing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
