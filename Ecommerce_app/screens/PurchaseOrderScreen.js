
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Pressable,
    TextInput,
    TouchableOpacity,
    Image,
    Dimensions,
    FlatList,
  } from "react-native";
  import { CheckBox, Icon } from "react-native-elements";
  import color from "../components/color";
  import React, {
    useEffect,
    useState,
    useLayoutEffect,
    useContext,
    useCallback,
  } from "react";
  import { useFocusEffect } from "@react-navigation/native";
  import { Feather, AntDesign } from "@expo/vector-icons";  
  import { useUser } from '../UserContext';
  import { API_BASE_URL } from "../Localhost";
  import axios from "axios";
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import OrdersItem from "./OrdersItem";

  const PurchaseOrderScreen = ({ navigation, route}) => {
    const { user } = useUser();
    const idUser = user._id;
    const { height, width } = Dimensions.get("window");
    const [menu, setMenu] = useState('Chờ xác nhận');
    const [order, setOrder] = useState([])
    const [ordered, setOrdered] = useState([])
    const [deliveringOrder, setDeliveringOrder ] = useState([])
    const [deliveredOrder, setDeliveredOrder ] = useState([])
    const [cancelOrder, setCancelOrder ] = useState([])
    const [completedOrder, setCompletedOrder ] = useState([])
    const [refresh, setRefresh] = useState(false);

    const handlePress = (menuValue) => {
        setMenu(menuValue);
    };

    // Lấy dữ liệu order
    const getOrderData = async (idUser) => {
      try {
        await axios.get(`${API_BASE_URL}/user/getOrder/${idUser}`).then((response) => {
            if (response.data.status === "FAILED") {
                alert(response.data.message); 
                console.log(response);
            } else {
              setOrdered(response.data.newOrdered);
              setDeliveringOrder(response.data.newDeliveringOrder);
              setDeliveredOrder(response.data.newDeliveredOrder);
              setCompletedOrder(response.data.newCompletedOrder);
              setCancelOrder(response.data.newCancelOrder);
            }
        })
        .catch((error) => {
            console.log(error)
            alert(response.data.message)
        })
      } catch (error) {
        console.log(error)
      }
    };
    
    const handleCancelOrder = async (orderId) => {
      try {
        const payload = { orderId: orderId };
        await axios.post(`${API_BASE_URL}/user/getOrder/cancelOrder`, payload).then((response) => {
            if (response.data.status === "FAILED") {
                alert(response.data.message); 
                console.log(response.data.message);
            } else {
              //update ordered by removing canceled orders
              setOrdered(prevOrdered => {
                const updatedOrdered = prevOrdered.filter(order => order._doc._id !== orderId);
                return updatedOrdered;
              });

              //Add canceled orders to cancelOrder
              setCancelOrder(prevCancelOrder => {
                const canceledOrder = ordered.find(order => order._doc._id === orderId);
                if (canceledOrder) {
                  canceledOrder._doc.status = "canceled";
                  return [...prevCancelOrder, canceledOrder];
                }
                return prevCancelOrder;
              });

              alert("Đã hủy đơn hàng thành công."); 
            }
        })
        .catch((error) => {
            console.log(error)
            alert("Lỗi ở đây:",error)
        })
      } catch (error) {
        console.log(error)
      }
    };

    const handleConfirmOrder = async (orderId) => {
      try {
        const payload = { orderId: orderId };
        await axios.post(`${API_BASE_URL}/user/getOrder/confirmOrder`, payload).then((response) => {
            if (response.data.status === "FAILED") {
                alert(response.data.message); 
                console.log(response.data.message);
            } else {
              //update ordered by removing canceled orders
              setOrdered(prevOrdered => {
                const updatedOrdered = prevOrdered.filter(order => order._doc._id !== orderId);
                return updatedOrdered;
              });

              //Add canceled orders to cancelOrder
              setCompletedOrder(prevCompletedOrder => {
                const completedOrder = ordered.find(order => order._doc._id === orderId);
                if (completedOrder) {
                  completedOrder._doc.status = "completed";
                  return [...prevCompletedOrder, completedOrder];
                }
                return prevCompletedOrder;
              });
              alert("Đã xác nhận hàng thành công."); 
              setRefresh(true);

            }
        })
        .catch((error) => {
            console.log(error)
            alert("Lỗi ở đây:",error)
        })
      } catch (error) {
        console.log(error)
      }
    };

    const handleViewOrderDetails = (order) => {
      navigation.navigate("OrderDetail", {order});
    }

    useEffect (() => {
      getOrderData(idUser)
      setRefresh(false);
    },[refresh, idUser]) 

    return (
      <View>
        <View
          style={{
            height: height * 0.06,
            width: width,
            flexDirection: "row",
          }}
        >
          <Pressable 
              style={{...styles.buttonArrange,
                  borderColor: menu === 'Chờ xác nhận' ? "#F1582C" : "white" 
          }}
            onPress={() => handlePress('Chờ xác nhận')}
          
          >
            <Text style={styles.text_order}>Chờ xác nhận</Text>
          </Pressable>
  
          <Pressable 
              style={{...styles.buttonArrange,
                  borderColor: menu === 'Vận chuyển' ?  "#F1582C" :"white"  
              }}
              onPress={() => handlePress('Vận chuyển')}
          >
            <Text style={styles.text_order}>Vận chuyển</Text>
          </Pressable>
          <Pressable 
              style={{...styles.buttonArrange,
                  borderColor: menu === 'Đã giao' ?  "#F1582C" :"white"  
              }}
              onPress={() => handlePress('Đã giao')}
          >
            <Text style={styles.text_order}>Đã giao</Text>
          </Pressable> 
          <Pressable 
              style={{...styles.buttonArrange,
                  borderColor: menu === 'Đã hoàn thành' ?  "#F1582C" :"white"  
              }}
              onPress={() => handlePress('Đã hoàn thành')}
          >
            <Text style={styles.text_order}>Đã hoàn thành</Text>
          </Pressable>
          <Pressable 
              style={{...styles.buttonArrange,
                  borderColor: menu === 'Đã hủy' ?  "#F1582C" :"white"  
              }}
              onPress={() => handlePress('Đã hủy')}
          >
            <Text style={styles.text_order}>Đã hủy</Text>
          </Pressable>
        </View>
        <ScrollView style={{height: height * 0.85}} > 
        {  menu === 'Chờ xác nhận' ? (
          <ScrollView>
          <View style={{ marginHorizontal: 10}}>
            {ordered ? (
                <>
                {ordered?.map((option, index) =>
                <View key={option._doc._id}
                  style = {{backgroundColor: "white",marginBottom:10}}
                >
                  <OrdersItem item={option} onPress={() => handleViewOrderDetails(option)}/>
                  <Pressable 
                    style={{alignSelf:"center", padding: 6, backgroundColor:'red', marginBottom:10 }}
                    onPress={()=> handleCancelOrder(option._doc._id)}
                  >
                    <Text style={{ color:'white'}}>Hủy đơn hàng</Text>
                  </Pressable>
                </View>
              )}
              </>
              ) : (
                <View>
                  <Text>Bạn chưa có đơn hàng nào</Text>
                </View>
              )} 
          </View>
          </ScrollView>
        ) : menu === 'Vận chuyển' ? (
          <View style={{ marginHorizontal: 10 }}>
            {deliveringOrder ? (
                <>
                {deliveringOrder ?.map((option, index) =>
                <View key={option._doc._id}>
                   <OrdersItem item={option} onPress={() => handleViewOrderDetails(option)}/>
                </View>
              )}
              </>
              ) : ( 
                <View>
                  <Text>Bạn chưa có đơn hàng đang giao</Text>
                </View>
              )} 
          </View>
        ) : menu === 'Đã giao' ? (
          <View style={{ marginHorizontal: 10 }}>
            {deliveredOrder ? (
                <>
                {deliveredOrder ?.map((option, index) =>
                   <View key={option._doc._id}
                   style = {{backgroundColor: "white",marginBottom:10}}
                 >
                   <OrdersItem item={option} onPress={() => handleViewOrderDetails(option)}/>
                   <Pressable 
                     style={{alignSelf:"center", padding: 6, backgroundColor:'red', marginBottom:10 }}
                     onPress={()=> handleConfirmOrder(option._doc._id)}
                   >
                     <Text style={{ color:'white'}}>Xác nhận đơn hàng</Text>
                   </Pressable>
                 </View>
              )}
              </>
              ) : (
                <View>
                  <Text>Bạn chưa có đơn hàng nào</Text>
                </View>
              )} 
          </View>
         ) : menu === 'Đã hoàn thành' ? (
          <View style={{ marginHorizontal: 10 }}>
            {completedOrder ? (
                <>
                {completedOrder ?.map((option, index) =>
                <Pressable key={option._doc._id}>
                    <OrdersItem item={option} onPress={() => handleViewOrderDetails(option)}/>
                </Pressable>
                  
              )}
              </>
              ) : ( 
                <View>
                  <Text>Bạn chưa có đơn hàng nào</Text>
                </View>
              )} 
          </View>
        ) : (
          <View style={{ marginHorizontal: 10 }}>
            {cancelOrder ? (
                <>
                {cancelOrder ?.map((option, index) =>
                   <View key={index}>
                   <OrdersItem item={option} onPress={() => handleViewOrderDetails(option)}/>
                 </View>
              )}
              </>
              ) : (
                <View>
                  <Text>Bạn chưa có đơn hàng nào</Text>
                </View>
              )} 
          </View>
        )}
        </ScrollView>
      </View>
    );
  };
  
  export default PurchaseOrderScreen;
  
  const styles = StyleSheet.create({
    buttonArrange: {
      flexDirection: "row",
      flex: 1,
      borderColor:'white',
      borderBottomWidth:2,
      alignItems: "center",
      justifyContent: "center",
      height: 40,
    },
    text_order : {
        fontSize:12,
        alignSelf:'center'
      },
  });
  