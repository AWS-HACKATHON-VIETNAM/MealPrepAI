import { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Check, AlertCircle, Loader2, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { groceryService } from '../services/grocery.service';
import type { GroceryList, GroceryItem } from '../types/api.types';
import { Alert } from './ui/alert';

export function GroceryListScreen() {
  const [groceryLists, setGroceryLists] = useState<GroceryList[]>([]);
  const [activeListId, setActiveListId] = useState<number | null>(null);
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreatingList, setIsCreatingList] = useState(false);

  useEffect(() => {
    loadGroceryLists();
  }, []);

  useEffect(() => {
    if (activeListId) {
      loadGroceryItems(activeListId);
    }
  }, [activeListId]);

  const loadGroceryLists = async () => {
    try {
      setIsLoading(true);
      setError('');
      const lists = await groceryService.getGroceryLists();
      setGroceryLists(lists);
      if (lists.length > 0 && !activeListId) {
        setActiveListId(lists[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load grocery lists');
    } finally {
      setIsLoading(false);
    }
  };

  const loadGroceryItems = async (listId: number) => {
    try {
      const list = await groceryService.getGroceryList(listId);
      setItems(list.items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load grocery items');
    }
  };

  const handleCreateList = async () => {
    try {
      setIsCreatingList(true);
      setError('');
      const newList = await groceryService.createGroceryList(
        `Grocery List ${new Date().toLocaleDateString()}`
      );
      setGroceryLists([...groceryLists, newList]);
      setActiveListId(newList.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create grocery list');
    } finally {
      setIsCreatingList(false);
    }
  };

  const toggleItem = async (itemId: number) => {
    if (!activeListId) return;
    
    // Note: Backend doesn't have is_purchased field yet, so we'll just update locally for now
    setItems(items.map(i => 
      i.id === itemId ? { ...i, checked: !(i as any).checked } : i
    ));
  };

  const handleDeleteItem = async (itemId: number) => {
    if (!activeListId) return;

    try {
      await groceryService.deleteGroceryItem(itemId);
      setItems(items.filter(i => i.id !== itemId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item');
    }
  };

  const checkedCount = items.filter(item => (item as any).checked).length;

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading grocery lists...</p>
        </div>
      </div>
    );
  }

  if (groceryLists.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-6">
        <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-gray-900 mb-2">No Grocery Lists Yet</h3>
        <p className="text-gray-500 text-center mb-6">
          Create your first grocery list to start organizing your shopping
        </p>
        <Button
          onClick={handleCreateList}
          disabled={isCreatingList}
          className="bg-orange-500 hover:bg-orange-600"
        >
          {isCreatingList ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Plus className="w-4 h-4 mr-2" />
          )}
          Create Grocery List
        </Button>
      </div>
    );
  }

  const activeList = groceryLists.find(l => l.id === activeListId);

  return (
    <div className="h-full flex flex-col pt-12 pb-20 bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
            <ShoppingCart className="w-6 h-6 text-orange-500" />
          </div>
          <div className="flex-1">
            <h2 className="text-gray-900">{activeList?.name || 'Grocery List'}</h2>
            <p className="text-gray-500 text-sm">
              {checkedCount} of {items.length} items checked
            </p>
          </div>
          <Button
            onClick={handleCreateList}
            disabled={isCreatingList}
            size="sm"
            variant="outline"
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

      {/* Grocery List */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No items in this list yet</p>
            <p className="text-gray-400 text-sm mt-2">Add items from recipes or manually</p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map(item => (
              <div key={item.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <Checkbox
                  checked={(item as any).checked || false}
                  onCheckedChange={() => toggleItem(item.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <p className={`text-gray-800 ${(item as any).checked ? 'line-through text-gray-400' : ''}`}>
                    {item.ingredient}
                  </p>
                  <p className="text-gray-500 text-sm">{item.quantity}</p>
                </div>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="p-1 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
