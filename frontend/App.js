/**
 * StAuth10244: I Yunyu Yang, 000912334 certify that this material is my original work. No other person's work has been used without due acknowledgement. I have not made my work available to anyone else.
 */
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, ScrollView, Alert, Platform} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
const API_URL = 'http://localhost:3001/api';

export default function App() {
  const [collection, setCollection] = useState([]);
  const [itemId, setItemId] = useState('');
  const [form, setForm] = useState({ name: '', price: '', quantity: '', category: '' });
  const categories = [
    'Fruits',
    'Vegetables',
    'Meat',
    'Dairy',
    'Bakery',
    'Seafood',
    'Beverages',
    'Snacks',
  ];

  // Fetch data from the API using GET collection request
  async function getCollection() {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setCollection(data);  
    } catch (error) {
      console.error(error);
    }
  }

  async function getItem() {
    try {
      const response = await fetch(`${API_URL}/${Number(itemId)}`);
      const data = await response.json();

      if (data && data.id) {
        setCollection([data]);
      } else {
        Alert.alert('Error', 'Item not found.');
        setCollection([]);
      }
    
      setItemId(''); // Clear itemId after fetching

    } catch (error) {
      console.error(error);
    }
  }

  // Add a new item or update an existing one- use POST item and PUT item api
  async function submitForm() {
    const method = itemId ? 'PUT' : 'POST';
    const url = itemId ? `${API_URL}/${itemId}` : API_URL;
    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      console.log("Server Status:", data.status);
      await getCollection();
      clearForm();
    } catch (err) {
      console.error(err);
    }
  }

  // Pass the item to input fields for editing
  function editItem(item) {
    setForm({
      name: item.name || '',
      price: item.price?.toString() || '',
      quantity: item.quantity?.toString() || '',
      category: item.category || '',
    });
    setItemId(item.id);
  }

  // Delete an item from collection
  async function deleteItem (id) {
    try {
      const response = await fetch(`${API_URL}/${id}`, {method: 'DELETE'});
      const data = await response.json();
      console.log("Server Status:", data.status);
      if (data.status === 'ERROR') {
        Alert.alert('Error', 'Failed to delete item.');
        return;
      }
      // Show success message
      Alert.alert('Item deleted successfully');
      getCollection();
    } catch (err) {
      console.error(err);
    }
  }

  // Delete entire collection
  async function deleteCollection() {
    try {
      const response = await fetch(API_URL, { method: 'DELETE' });
      const data = await response.json();
      console.log("Server Status:", data.status);
      if (data.status === 'ERROR') {
        Alert.alert('Error', 'Failed to delete collection.');
        return;
      }
      // Show success message
      Alert.alert('Collection deleted successfully');
      getCollection();
    } catch (err) {
      console.error(err);
    }
  }
  // Confirm delete alert
  function deleteAlert() {
    if (Platform.OS === 'web') {
      const confirmDelete = window.confirm('Are you sure you want to delete entire table?');
      if (confirmDelete) {
        deleteCollection();
      }
    } else {
      Alert.alert(
        'Clear All',
        'Are you sure you want to delete entire table?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'OK', onPress: () => deleteCollection() },
        ],
        { cancelable: false }
      );
    }
  }
  // Clear form fields
  function clearForm() {
    setForm({ name: '', price: '', quantity: '', category: '' });
    setItemId('');
  }

  useEffect(() => {
    getCollection();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={[styles.tableColumn,styles.colSmall]}>{item.id}</Text>
      <Text style={[styles.tableColumn,styles.colMedium]}>{item.name}</Text>
      <Text style={[styles.tableColumn,styles.colSmall]}>{item.price}</Text>
      <Text style={[styles.tableColumn,styles.colSmall]}>{item.quantity}</Text>
      <Text style={[styles.tableColumn,styles.colMedium]}>{item.category}</Text>
      
      <View style={styles.actionCell}>
        <Button title="Edit" onPress={() => editItem(item)} />
        <Button title="Del" color="#a6a6a6" onPress={() => deleteItem(item.id)} />
      </View>
    </View>

  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Inventory Manager</Text>
      <View style={styles.itemsInRow}>
        <TextInput
          style={[styles.input, styles.halfWidth]}
          placeholder="Search by ID"
          placeholderTextColor="#a6a6a6"
          keyboardType="numeric"
          value={itemId}
          onChangeText={(text) => setItemId(text)}
        />
        <Button title="Get Item" onPress={getItem} />
        <Button title="View All" onPress={getCollection} />
      </View>
      <View style={styles.itemsInRow}>
        <TextInput
          style={[styles.input, styles.halfWidth]}
          placeholder="Name"
          placeholderTextColor="#a6a6a6"
          value={form.name}
          onChangeText={(text) => setForm({ ...form, name: text })}
        />
        <TextInput
          style={[styles.input, styles.halfWidth]}
          placeholder="Price"
          placeholderTextColor="#a6a6a6"
          value={form.price}
          keyboardType="numeric"
          onChangeText={(text) => setForm({ ...form, price: text })}
        />  
      </View>

      <View style={styles.itemsInRow}>
        <TextInput
          style={[styles.input, styles.halfWidth]}
          placeholder="Quantity"
          placeholderTextColor="#a6a6a6"
          value={form.quantity}
          keyboardType="numeric"
          onChangeText={(text) => setForm({ ...form, quantity: text })}
        />
        <Dropdown 
          style={[styles.input, styles.halfWidth]}
          placeholderStyle={styles.dropdownPlaceholder}
          selectedTextStyle={styles.dropdownSelectedText}
          placeholder="Select Category"
          data={categories.map((cat) => ({ label: cat, value: cat }))} 
          labelField="label" // Extract the label from the data item
          valueField="value" //Extract the primary key from the data item
          value={form.category} // default value
          onChange={(item) => { 
            setForm({ ...form, category: item.value });
          }}

          renderRightIcon={() => (
            <Text style={styles.icon}>▼</Text>
          )}
        >
        </Dropdown>    
      </View>

      <View style={styles.itemsInRow}>
        <Button title={itemId ? 'Update Item' : 'Add Item'} onPress={submitForm} />
        <Button title="Clear Form" onPress={clearForm} />
        <Button title="Clear Collection" color="#a6a6a6" onPress={deleteAlert} />
      </View>

      <View style={styles.tableHeader}>
        <Text style={[styles.tableColumn, styles.headerCell, styles.colSmall]}>ID</Text>
        <Text style={[styles.tableColumn, styles.headerCell, styles.colMedium]}>Name</Text>
        <Text style={[styles.tableColumn, styles.headerCell, styles.colSmall]}>Price</Text>
        <Text style={[styles.tableColumn, styles.headerCell, styles.colSmall]}>Qty</Text>
        <Text style={[styles.tableColumn, styles.headerCell, styles.colMedium]}>Category</Text>
        <Text style={[styles.tableColumn, styles.headerCell, styles.colMedium]}>Action</Text>
      </View>

      <FlatList
        data={collection}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        scrollEnabled={false}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
  },
  input: {
    flex: 1,
    height: 36,
    borderBottomWidth: 1,
    paddingHorizontal: 6,
  
  },
  halfWidth: {
    flex: 5, // 5 out of 10 (50%)
  },
  thirdWidth: {
    flex: 3,
  },
  lastThirdWidth: {
    flex: 4,
  },
  dropdownPlaceholder: {
    color: '#a6a6a6',
    fontSize: 14,
  },
  dropdownSelectedText: {
    color: '#000',
  },
  icon: {
    marginRight: 5,
    color: '#a6a6a6',
  },
  itemsInRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 10,
    alignItems: 'baseline',
  },

  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderColor: '#000',
    paddingBottom: 5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  tableColumn: {
    fontSize: 12,
    paddingHorizontal: 5,
    textAlign: 'center',
  },
  colSmall: {
    width: 40,
    textAlign: 'right',
  },
  colMedium: {
    width: 80,
    textAlign: 'left',
  },
  headerCell: {
    fontWeight: 'bold',
  },
  actionCell: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  
});
