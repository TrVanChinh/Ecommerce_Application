import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useUser } from '../UserContext';

const HomeScreen = ({navigation}) => {
  const { user } = useUser();

  return (
    <View>
      <Text>HomeScreen</Text>
      <Pressable
        onPress={() => console.log("user:", user)}
      >
        <Text>Test</Text>
      </Pressable>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})