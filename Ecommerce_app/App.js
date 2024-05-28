//npm i react-native-vnpay-merchant
//delete all node_modules
//rd /s /q node_modules
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

import { ModalPortal } from "react-native-modals";

import StackNavigation from "./navigation/StackNavigation";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import VerifyScreen from "./screens/VerifyScreen";

import { UserProvider } from "./UserContext";
import store from "./store";
import { Provider } from "react-redux"
export default function App() {
  return (
    <>
      <Provider store={store}>
        <UserProvider>
          <StackNavigation />
          <ModalPortal />
          {/* <VerifyScreen/> */}
          {/* <RegisterScreen/> */} 
        </UserProvider>
      </Provider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
