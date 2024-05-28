import { StyleSheet, Text, View, Platform,} from "react-native";
import React from "react";
import { WebView } from 'react-native-webview'
const WebViewScreen = ({navigation,route}) => {
    const {result} = route.params;
    console.log('url', result.payUrl);

    const onNavigationStateChange = (navState) => {
        // Kiểm tra xem URL hiện tại có phải là redirectUrl hay không
        if (navState.url === "https://momo.vn/") {
            // Điều hướng đến màn hình khác ở đây, ví dụ:
            navigation.navigate("Main");
        }
    };
  return (
    <View style={{
        paddingTop: Platform.OS === "android" ? 20 : 0,
        flex: 1,
        backgroundColor: "white",
      }}>
      <WebView
        source={{ uri: result.payUrl }} 
        style={{ flex: 1 }}
        onNavigationStateChange={onNavigationStateChange}
      />
    </View>
  );
};

export default WebViewScreen;

const styles = StyleSheet.create({});
