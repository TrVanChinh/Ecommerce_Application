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
import MyShopScreen from '../screens/Seller/MyShopScreen';
import ListProductsScreen from '../screens/Seller/ListProducts';
import EditProductScreen from '../screens/Seller/EditProductScreen';
import ShopInfoScreen from '../screens/Seller/ShopInfoScreen';
import ShopOrdersScreen from '../screens/Seller/ShopOrdersScreen';
import OrderItemScreen from '../screens/Seller/OrderItemScreen';
import StatisticScreen from '../screens/Seller/StatisticScreen';
import RevenueScreen from '../screens/Seller/RevenueScreen';
import ProfitScreen from '../screens/Seller/ProfitScreen';
import CustomerScreen from '../screens/Seller/CustomerScreen';
import InventoryScreen from '../screens/Seller/InventoryScreen';

import SearchScreen from '../screens/SearchScreen';
import DetailScreen from '../screens/DetailScreen';
import CartScreen from '../screens/CartScreen';
import OrderScreen from '../screens/OrderScreen';
import ShippingUnitScreen from '../screens/ShippingUnitScreen';

import AddressScreen from "../screens/Address/AddressScreen";
import NewAddressScreen from "../screens/Address/NewAddressScreen";
import SetUpAddressScreen from "../screens/Address/SetUpAddressScreen";
import UpdateAddressScreen from "../screens/Address/UpdateAddressScreen";
import ResetAddressScreen from "../screens/Address/ResetAddressScreen";
import ShopScreen from "../screens/ShopScreen";
import PurchaseOrderScreen from '../screens/PurchaseOrderScreen';
import OrderDetailScreen from '../screens/OrderDetailScreen';

import AdminHomeScreen from '../screens/Admin/AdminHomeScreen';
import AdminListScreen from '../screens/Admin/AdminListScreen';
import CategoryManagerScreen from '../screens/Admin/CategoryManagerScreen';
import SubcategoryManagerScreen from '../screens/Admin/SubcategoryManagerScreen';
import SellerRegisterScreen from '../screens/Admin/SellerRegisterScreen';
import RevenueSellerScreen from '../screens/Admin/RevenueSellerScreen';
import DeliverListScreen from '../screens/Admin/DeliverListScreen';

import WebViewScreen from '../screens/WebViewScreen';
import UserInfoScreen from '../screens/UserInfoScreen';
import UpdatePasswordScreen from '../screens/UpdatePasswordScreen';
import ExpenditureStatisticsScreen from '../screens/ExpenditureStatisticsScreen';
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
         <Stack.Screen name="MyShop" component={MyShopScreen} options={{headerTitle: 'Quản lý cửa hàng'}}/>
        <Stack.Screen name="ListProducts" component={ListProductsScreen} options={{headerTitle: 'Danh sách sản phẩm'}}/>
        <Stack.Screen name="EditProduct" component={EditProductScreen} options={{headerTitle: 'Chỉnh sửa sản phẩm'}}/>
        <Stack.Screen name="ShopInfo" component={ShopInfoScreen} options={{headerTitle: 'Thông tin cửa hàng'}}/>
        <Stack.Screen name="ShopOrders" component={ShopOrdersScreen} options={{headerTitle: 'Quản lý đơn hàng'}}/>
        <Stack.Screen name="OrderItem" component={OrderItemScreen} options={{headerTitle: 'Chi tiết đơn hàng'}}/>
        <Stack.Screen name="Statistic" component={StatisticScreen} options={{headerTitle: 'Thống kê'}}/>
        <Stack.Screen name="Revenue" component={RevenueScreen} options={{headerTitle: 'Doanh thu'}}/>
        <Stack.Screen name="Profit" component={ProfitScreen} options={{headerTitle: 'Lợi nhuận'}}/>
        <Stack.Screen name="Customer" component={CustomerScreen} options={{headerTitle: 'Khách hàng'}}/>
        <Stack.Screen name="Inventory" component={InventoryScreen} options={{headerTitle: 'Hàng tồn kho'}}/>
        <Stack.Screen name="Search" component={SearchScreen} options={{headerShown:false}}/>
        
        <Stack.Screen name="Detail" component={DetailScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Cart" component={CartScreen} options={{headerTitle: 'Giỏ hàng'}}/>
        <Stack.Screen name="Order" component={OrderScreen} options={{headerTitle: 'Đặt hàng'}}/>
        <Stack.Screen name="ShippingUnit" component={ShippingUnitScreen} options={{headerTitle: 'Đơn vị vận chuyển'}}/>

        <Stack.Screen name="Address" component={AddressScreen} options={{headerTitle: 'Chọn địa chỉ giao hàng'}}/>
        <Stack.Screen name="NewAddress" component={NewAddressScreen} options={{headerTitle: 'Địa chỉ mới'}}/>
        <Stack.Screen name="SetUpAddress" component={SetUpAddressScreen} options={{headerTitle: 'Thiết lập địa chỉ'}}/>
        <Stack.Screen name="UpdateAddress" component={UpdateAddressScreen} options={{headerTitle: 'Cập nhật địa chỉ'}}/>
        <Stack.Screen name="ResetAddress" component={ResetAddressScreen} options={{headerTitle: 'Đặt lại địa chỉ'}}/>
        <Stack.Screen name="Shop" component={ShopScreen} options={{headerTitle: 'Xem Shop'}}/>
        <Stack.Screen name="PurchaseOrder" component={PurchaseOrderScreen} options={{headerTitle: 'Đơn mua'}}/>
        <Stack.Screen name="OrderDetail" component={OrderDetailScreen} options={{headerTitle: 'Chi tiết đơn hàng'}}/>
        <Stack.Screen name="WebViewScreen" component={WebViewScreen} options={{headerShown:false}}/>
        <Stack.Screen name="UserInfo" component={UserInfoScreen} options={{headerTitle: 'Thông tin tài khoản'}}/>
        <Stack.Screen name="UpdatePassword" component={UpdatePasswordScreen} options={{headerTitle: 'Cập nhật mật khẩu'}}/>
        <Stack.Screen name="ExpenditureStatistics" component={ExpenditureStatisticsScreen} options={{headerTitle: 'Thống kê chi tiêu'}}/>

        <Stack.Screen name="AdminHome" component={AdminHomeScreen} options={{headerShown:false}}/>
        <Stack.Screen name="AdminList" component={AdminListScreen} options={{headerTitle: 'Danh sách Admin'}}/>
        <Stack.Screen name="CategoryManager" component={CategoryManagerScreen} options={{headerTitle: 'Quản lý danh mục'}}/>
        <Stack.Screen name="SubcategoryManager" component={SubcategoryManagerScreen} options={{headerTitle: 'Quản lý danh mục con'}}/>
        <Stack.Screen name="SellerRegister" component={SellerRegisterScreen} options={{headerTitle: 'Duyệt yêu cầu bán hàng'}}/>
        <Stack.Screen name="RevenueSeller" component={RevenueSellerScreen} options={{headerTitle: 'Doanh thu của người bán'}}/>
        <Stack.Screen name="DeliverList" component={DeliverListScreen} options={{headerTitle: 'Danh sách đơn vị vận chuyển'}}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default StackNavigation

const styles = StyleSheet.create({})