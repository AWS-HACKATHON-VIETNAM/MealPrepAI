import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput as RNTextInput,
  FlatList,
} from 'react-native';
import { useApi } from '../../hooks/useApi';
import { groceryApi } from '../../api/groceryApi';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import IngredientItem from '../../components/feature/IngredientItem';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { COLORS, FONT_SIZES, SPACING } from '../../utils/constants';

const GroceryListScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [groceryList, setGroceryList] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  const { loading: searching, execute: searchItems } = useApi();
  const { loading: loadingList, execute: fetchGroceryList } = useApi();
  const { loading: adding, execute: addItem } = useApi();
  const { loading: removing, execute: removeItem } = useApi();

  useEffect(() => {
    loadGroceryList();
  }, []);

  const loadGroceryList = async () => {
    const result = await fetchGroceryList(() => groceryApi.getGroceryList());
    
    if (result.success) {
      setGroceryList(result.data);
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Please enter a search query');
      return;
    }

    const result = await searchItems(() => groceryApi.searchItems(searchQuery));
    
    if (result.success) {
      setSearchResults(result.data);
      setShowSearchResults(true);
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const handleAddItem = async (item) => {
    const itemData = {
      ingredient_name: item.name,
      quantity: item.unit || '1 piece',
      price: item.price,
      macros: item.macros,
    };

    const result = await addItem(() => groceryApi.addToGroceryList(itemData));
    
    if (result.success) {
      Alert.alert('Success', 'Item added to grocery list');
      loadGroceryList(); // Refresh the list
      setShowSearchResults(false);
      setSearchQuery('');
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const handleRemoveItem = async (item) => {
    Alert.alert(
      'Remove Item',
      `Are you sure you want to remove ${item.ingredient_name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            const result = await removeItem(() => 
              groceryApi.removeFromGroceryList(item.id)
            );
            
            if (result.success) {
              loadGroceryList(); // Refresh the list
            } else {
              Alert.alert('Error', result.error);
            }
          },
        },
      ]
    );
  };

  const renderGroceryItem = ({ item }) => (
    <IngredientItem
      ingredient={item}
      onRemove={handleRemoveItem}
      showPrice={true}
      showMacros={true}
    />
  );

  const renderSearchResult = ({ item }) => (
    <Card style={styles.searchResultCard}>
      <View style={styles.searchResultContent}>
        <View style={styles.searchResultInfo}>
          <Text style={styles.searchResultName}>{item.name}</Text>
          <Text style={styles.searchResultDetails}>
            {item.unit} • ${item.price?.toFixed(2) || 'N/A'}
          </Text>
          {item.brand && (
            <Text style={styles.searchResultBrand}>Brand: {item.brand}</Text>
          )}
        </View>
        <Button
          title="Add"
          size="small"
          onPress={() => handleAddItem(item)}
        />
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Grocery List</Text>
        <Text style={styles.subtitle}>Manage your ingredients and pantry</Text>
      </View>

      <Card style={styles.searchSection}>
        <Text style={styles.sectionTitle}>Search Items</Text>
        <View style={styles.searchContainer}>
          <RNTextInput
            style={styles.searchInput}
            placeholder="Search for ingredients..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Button
            title="Search"
            onPress={handleSearch}
            loading={searching}
            style={styles.searchButton}
          />
        </View>
      </Card>

      {loadingList && <LoadingSpinner text="Loading grocery list..." />}

      {showSearchResults && (
        <View style={styles.searchResultsSection}>
          <Text style={styles.sectionTitle}>Search Results</Text>
          <FlatList
            data={searchResults}
            renderItem={renderSearchResult}
            keyExtractor={(item, index) => index.toString()}
            style={styles.searchResultsList}
          />
        </View>
      )}

      <View style={styles.groceryListSection}>
        <Text style={styles.sectionTitle}>
          Your Grocery List ({groceryList.length} items)
        </Text>
        {groceryList.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              Your grocery list is empty. Search for ingredients to add them!
            </Text>
          </Card>
        ) : (
          <FlatList
            data={groceryList}
            renderItem={renderGroceryItem}
            keyExtractor={(item) => item.id.toString()}
            style={styles.groceryList}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.md,
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZES.xxlarge,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  searchSection: {
    margin: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.large,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: SPACING.sm,
    fontSize: FONT_SIZES.medium,
    color: COLORS.text,
    backgroundColor: COLORS.surface,
    marginRight: SPACING.sm,
  },
  searchButton: {
    minWidth: 80,
  },
  searchResultsSection: {
    margin: SPACING.md,
  },
  searchResultsList: {
    maxHeight: 300,
  },
  searchResultCard: {
    marginBottom: SPACING.sm,
  },
  searchResultContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchResultInfo: {
    flex: 1,
  },
  searchResultName: {
    fontSize: FONT_SIZES.medium,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  searchResultDetails: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  searchResultBrand: {
    fontSize: FONT_SIZES.small,
    color: COLORS.textSecondary,
  },
  groceryListSection: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  groceryList: {
    flex: 1,
  },
  emptyCard: {
    alignItems: 'center',
    padding: SPACING.lg,
  },
  emptyText: {
    fontSize: FONT_SIZES.medium,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default GroceryListScreen;
