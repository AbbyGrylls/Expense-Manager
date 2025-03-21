import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import axios from '../api/axios.js'; 
import { useExpenseContext } from '../contexts/ExpenseContext';

export default function ExpensesList() {
    const { dispatch, expenses } = useExpenseContext();

    useEffect(() => {
        const getExpenses = async () => {
            try {
                const res = await axios.get('/expenses/');
                dispatch({ type: "SET_EXPENSES", payload: res.data });
            } catch (error) {
                console.error("Fetch error:", error);
            }
        };

        getExpenses();
    }, [dispatch]);

    const renderExpenseItem = ({ item }) => (
        <View key={item._id} style={styles.expenseItem}>
            <Text style={styles.text}>Amount: {String(item?.amount ?? 'N/A')}</Text>
            <Text style={styles.text}>Category: {String(item?.category ?? 'N/A')}</Text>
            <Text style={styles.text}>Date: {new Date(item?.date).toLocaleDateString() || 'N/A'}</Text>
            <Text style={styles.text}>Notes: {String(item?.notes ?? 'N/A')}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {expenses && expenses.length > 0 ? (
                <FlatList
                    data={expenses}
                    keyExtractor={(item) => item._id}
                    renderItem={renderExpenseItem}
                    contentContainerStyle={styles.listContainer}
                />
            ) : (
                <Text style={styles.loadingText}>No Expenses Found</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f9f9f9',
        width:350
    },
    listContainer: {
        paddingBottom: 20,
    },
    expenseItem: {
        backgroundColor: '#fff',
        padding: 12,
        marginBottom: 8,
        borderRadius: 8, 
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    text: {
        fontSize: 16,
        color: '#333',
    },
    loadingText: {
        fontSize: 18,
        color: '#aaa',
        textAlign: 'center',
        marginTop: 20,
    },
});
