import { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Check, AlertCircle, Loader2, Trash2, Edit2, X } from 'lucide-react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { groceryService } from '../services/grocery.service';
import type { GroceryList, GroceryItem } from '../types/api.types';
import { Alert } from './ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';

export function GroceryListScreen() {
  const [groceryLists, setGroceryLists] = useState<GroceryList[]>([]);
  const [activeListId, setActiveListId] = useState<number | null>(null);
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreatingList, setIsCreatingList] = useState(false);
  
  // Add Item Dialog
  const [showAddItemDialog, setShowAddItemDialog] = useState(false);
  const [newItemIngredient, setNewItemIngredient] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('');
  const [isAddingItem, setIsAddingItem] = useState(false);
  
  // Edit Item Dialog
  const [showEditItemDialog, setShowEditItemDialog] = useState(false);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editItemIngredient, setEditItemIngredient] = useState('');
  const [editItemQuantity, setEditItemQuantity] = useState('');
  const [isEditingItem, setIsEditingItem] = useState(false);
  
  // Edit List Name Dialog
  const [showEditListDialog, setShowEditListDialog] = useState(false);
  const [editListName, setEditListName] = useState('');
  const [isEditingList, setIsEditingList] = useState(false);

  useEffect(() => {
    console.log('showAddItemDialog changed to:', showAddItemDialog);
  }, [showAddItemDialog]);

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

  const handleAddItem = async () => {
    if (!activeListId || !newItemIngredient.trim() || !newItemQuantity.trim()) return;

    try {
      setIsAddingItem(true);
      setError('');
      const newItem = await groceryService.addGroceryItem({
        grocery_list: activeListId,
        ingredient: newItemIngredient,
        quantity: newItemQuantity,
      });
      setItems([...items, newItem]);
      setNewItemIngredient('');
      setNewItemQuantity('');
      setShowAddItemDialog(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item');
    } finally {
      setIsAddingItem(false);
    }
  };

  const handleEditListName = async () => {
    if (!activeListId || !editListName.trim()) return;

    try {
      setIsEditingList(true);
      setError('');
      const updatedList = await groceryService.updateGroceryList(activeListId, editListName);
      setGroceryLists(groceryLists.map(l => l.id === activeListId ? updatedList : l));
      setShowEditListDialog(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update list name');
    } finally {
      setIsEditingList(false);
    }
  };

  const handleDeleteList = async () => {
    if (!activeListId) return;

    const confirmDelete = window.confirm('Are you sure you want to delete this grocery list?');
    if (!confirmDelete) return;

    try {
      setError('');
      await groceryService.deleteGroceryList(activeListId);
      const updatedLists = groceryLists.filter(l => l.id !== activeListId);
      setGroceryLists(updatedLists);
      setActiveListId(updatedLists.length > 0 ? updatedLists[0].id : null);
      setItems([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete list');
    }
  };

  const openEditListDialog = () => {
    const activeList = groceryLists.find(l => l.id === activeListId);
    if (activeList) {
      setEditListName(activeList.name);
      setShowEditListDialog(true);
    }
  };

  const openEditItemDialog = async (itemId: number) => {
    try {
      setError('');
      const item = await groceryService.getGroceryItems(activeListId || undefined);
      const selectedItem = item.find(i => i.id === itemId);
      
      if (selectedItem) {
        setEditingItemId(itemId);
        setEditItemIngredient(selectedItem.ingredient);
        setEditItemQuantity(selectedItem.quantity);
        setShowEditItemDialog(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load item');
    }
  };

  const handleEditItem = async () => {
    if (!editingItemId || !editItemIngredient.trim() || !editItemQuantity.trim()) return;

    try {
      setIsEditingItem(true);
      setError('');
      const updatedItem = await groceryService.updateGroceryItem(editingItemId, {
        ingredient: editItemIngredient,
        quantity: editItemQuantity,
      });
      setItems(items.map(i => i.id === editingItemId ? updatedItem : i));
      setShowEditItemDialog(false);
      setEditingItemId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update item');
    } finally {
      setIsEditingItem(false);
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
    <>
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
            onClick={openEditListDialog}
            size="sm"
            variant="ghost"
            className="text-gray-500"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            onClick={handleDeleteList}
            size="sm"
            variant="ghost"
            className="text-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button
            onClick={handleCreateList}
            disabled={isCreatingList}
            size="sm"
            variant="outline"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* List Tabs */}
        {groceryLists.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {groceryLists.map(list => (
              <button
                key={list.id}
                onClick={() => setActiveListId(list.id)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                  list.id === activeListId
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {list.name}
              </button>
            ))}
          </div>
        )}
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
                  onClick={() => openEditItemDialog(item.id)}
                  className="p-1 text-gray-400 hover:text-blue-500"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
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

      {/* Add Item Button */}
      <div className="px-6 py-4 border-t border-gray-100">
        <Button
          onClick={() => {
            console.log('Add Item button clicked');
            setShowAddItemDialog(true);
          }}
          className="w-full bg-orange-500 hover:bg-orange-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>
    </div>

      {/* Add Item Dialog */}
      {showAddItemDialog && (
        <Dialog open={showAddItemDialog} onOpenChange={setShowAddItemDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Grocery Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Ingredient</label>
                <Input
                  autoFocus
                  value={newItemIngredient}
                  onChange={(e) => setNewItemIngredient(e.target.value)}
                  placeholder="e.g., Tomatoes"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddItem();
                    }
                  }}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Quantity</label>
                <Input
                  value={newItemQuantity}
                  onChange={(e) => setNewItemQuantity(e.target.value)}
                  placeholder="e.g., 2 lbs"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddItem();
                    }
                  }}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowAddItemDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddItem}
                disabled={isAddingItem || !newItemIngredient.trim() || !newItemQuantity.trim()}
                className="bg-orange-500 hover:bg-orange-600"
              >
                {isAddingItem ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Add Item
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit List Name Dialog */}
      {showEditListDialog && (
        <Dialog open={showEditListDialog} onOpenChange={setShowEditListDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit List Name</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input
                autoFocus
                value={editListName}
                onChange={(e) => setEditListName(e.target.value)}
                placeholder="List name"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleEditListName();
                  }
                }}
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowEditListDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditListName}
                disabled={isEditingList || !editListName.trim()}
                className="bg-orange-500 hover:bg-orange-600"
              >
                {isEditingList ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Item Dialog */}
      {showEditItemDialog && (
        <Dialog open={showEditItemDialog} onOpenChange={setShowEditItemDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Grocery Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Ingredient</label>
                <Input
                  autoFocus
                  value={editItemIngredient}
                  onChange={(e) => setEditItemIngredient(e.target.value)}
                  placeholder="e.g., Tomatoes"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleEditItem();
                    }
                  }}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Quantity</label>
                <Input
                  value={editItemQuantity}
                  onChange={(e) => setEditItemQuantity(e.target.value)}
                  placeholder="e.g., 2 lbs"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleEditItem();
                    }
                  }}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowEditItemDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditItem}
                disabled={isEditingItem || !editItemIngredient.trim() || !editItemQuantity.trim()}
                className="bg-orange-500 hover:bg-orange-600"
              >
                {isEditingItem ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
