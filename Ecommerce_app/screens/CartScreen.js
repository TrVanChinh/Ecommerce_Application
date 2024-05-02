import { useSelector, useDispatch } from 'react-redux';
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { incrementQuantity, decrementQuantity } from '../redux/CartReducer';

const CartScreen = () => {
    const cartItems = useSelector((state) => state.cart.items); 
    const dispatch = useDispatch();

  return (
    <View>
      <Text>CartScreen</Text>
    </View>
  )
}

export default CartScreen

const styles = StyleSheet.create({})