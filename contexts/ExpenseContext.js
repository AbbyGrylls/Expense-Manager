import React, { createContext,useContext,useReducer } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const ExpenseContext = createContext();
export const expenseReducer= (state, action)=>{
    switch(action.type){
        case 'SET_EXPENSES':
            return{
                ...state,
                expenses:action.payload
            };
        case 'CREATE_EXPENSE':
            return{
                ...state,
                expenses:[action.payload,...state.expenses]
            };
    }
}
const ExpenseContextProvider =({children})=>{
    const [state,dispatch]=useReducer(expenseReducer,{expenses:[]})
    return(
        <ExpenseContext.Provider value ={{...state,dispatch}}>
            {children}
        </ExpenseContext.Provider>
    )
}
export const useExpenseContext = () => {
    const context = useContext(ExpenseContext);
    if (!context) {
        throw new Error('useExpenseContext must be used within an ExpenseContextProvider');
    }
    return context;
};
export default ExpenseContextProvider