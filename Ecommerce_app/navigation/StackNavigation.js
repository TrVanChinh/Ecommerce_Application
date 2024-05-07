import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {Entypo, AntDesign, Octicons , MaterialCommunityIcons, Ionicons, FontAwesome5  } from '@expo/vector-icons';
import color from "../components/color";


import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ProfileScreen from '../screens/ProfileScreen';
import NotificationScreen from '../screens/NotificationScreen';
import VerifyScreen from '../screens/VerifyScreen';
import EmailAuthenticationScreen from '../screens/ForgetPasswordScreen/EmailAuthenticationScreen';
import VerifyOTPofForgotPasswordScreen from '../screens/ForgetPasswordScreen/VerifyOTPofForgotPasswordScreen'
import SetupPasswordScreen from '../screens/ForgetPasswordScreen/SetupPasswordScreen';
import RegisterSellerScreen from '../screens/Seller/RegisterSellerScreen';
import AddProductScreen from '../screens/Seller/AddProductScreen';
import CategoryScreen from "../screens/Seller/Categories/CategoryScreen";
import SubcategoryScreen from "../screens/Seller/Categories/SubcategoryScreen";
import SearchScreen from '../screens/SearchScreen';
import DetailScreen from '../screens/DetailScreen';
import CartScreen from '../screens/CartScreen';
import OrderScreen from '../screens/OrderScreen';
import ShippingUnitScreen from '../screens/ShippingUnitScreen';

const StackNavigation = () => {
    const Stack = createNativeStackNavigator();
    const Tab = createBottomTabNavigator();

    function BottomTabs() {
        return (
          <Tab.Navigator>
            <Tab.Screen
              name="Home"
              component={HomeScreen}
              options={{
                tabBarLabel: "Home",
                tabBarLabelStyle: {
                  color: "#F1582C",
                },
                headerShown: false,
                tabBarIcon: ({ focused }) =>
                  focused ? (
                    <Entypo name="home" size={24} color="#F1582C" />
                  ) : (
                    <AntDesign name="home" size={24} color="black" />
                  ),
              }}
            />
            <Tab.Screen
              name="Notification"
              component={NotificationScreen}
              options={{
                tabBarLabel: "Thông báo",
                tabBarLabelStyle: {
                  color: "#F1582C",
                },
                headerShown: false,
                tabBarIcon: ({ focused }) =>
                  focused ? (
                    <>
                    <Ionicons
                      name="notifications-sharp"
                      size={24}
                      color="#F1582C"
                    />
                    <View
                    style={{
                      position: "absolute",
                      top: 1,
                      right: 10,
                      backgroundColor: color.origin,
                      borderRadius: 10,
                      borderColor: "white",
                      borderWidth: 1,
                      width: 30,
                      height: 20,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "white", fontSize: 12 }}>99+</Text>
                  </View>
                    </>
                  ) : (
                    <>
                    <Ionicons
                      name="notifications-outline"
                      size={24}
                      color="black"
                    />
                    <View
                    style={{
                      position: "absolute",
                      top: 1,
                      right: 10,
                      backgroundColor: color.origin,
                      borderRadius: 10,
                      borderColor: "white",
                      borderWidth: 1,
                      width: 30,
                      height: 20,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "white", fontSize: 12 }}>99+</Text>
                  </View>
                    </>
                    
                  ),
              }}
            />
            <Tab.Screen
              name="Profile"
              component={ProfileScreen}
              options={{
                tabBarLabel: "Tôi",
                tabBarLabelStyle: {
                  color: "#F1582C",
                },
                headerShown: false,
                tabBarIcon: ({ focused }) =>
                  focused ? (
                    <FontAwesome5 name="user-alt" size={24} color="#F1582C" />
                  ) : (
                    <FontAwesome5 name="user" size={24} color="black" />
                  ),
              }}
            />
          </Tab.Navigator>
        );
      }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={BottomTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Home" component={HomeScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Profile" component={ProfileScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Login" component={LoginScreen} options={{headerTitle: 'Đăng nhập'}}/>
        <Stack.Screen name="Verify" component={VerifyScreen} options={{headerTitle: 'Xác thực OTP'}}/>
        <Stack.Screen name="Register" component={RegisterScreen} options={{headerTitle: 'Đăng ký'}}/>
        <Stack.Screen name="Notification" component={NotificationScreen} options={{headerTitle: 'Thông báo'}}/>

        <Stack.Screen name="EmailAuthentication" component={EmailAuthenticationScreen} options={{headerTitle: 'Xác minh Email'}}/>
        <Stack.Screen name="VerifyOTPofForgotPassword" component={VerifyOTPofForgotPasswordScreen} options={{headerTitle: 'Xác thực OTP'}}/>
        <Stack.Screen name="SetupPassword" component={SetupPasswordScreen} options={{headerTitle: 'Thiết lập mật khẩu'}}/>
        <Stack.Screen name="RegisterSeller" component={RegisterSellerScreen} options={{headerTitle: 'Đăng ký bán hàng'}}/>
        <Stack.Screen name="AddProduct" component={AddProductScreen} options={{headerTitle: 'Thêm sản phẩm'}}/>
        <Stack.Screen name="SelectCategory" component={CategoryScreen} options={{
            headerTitle: "Chọn danh mục",
          }} 
        />
        <Stack.Screen name="SelectSubcategory" component={SubcategoryScreen}options={{
            headerTitle: "Chọn danh mục con",
          }} 
        />
         <Stack.Screen name="Search" component={SearchScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Detail" component={DetailScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Cart" component={CartScreen} options={{headerTitle: 'Giỏ hàng'}}/>
        <Stack.Screen name="Order" component={OrderScreen} options={{headerTitle: 'Đặt hàng'}}/>
        <Stack.Screen name="ShippingUnit" component={ShippingUnitScreen} options={{headerTitle: 'Đơn vị vận chuyển'}}/>

      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default StackNavigation

const styles = StyleSheet.create({})