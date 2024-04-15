import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import StackNavigation from './navigation/StackNavigation';
import LoginScreen from './screens/LoginScreen';
export default function App() {
  return (
    <>
      {/* <StackNavigation/>  */}
      <LoginScreen/>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
