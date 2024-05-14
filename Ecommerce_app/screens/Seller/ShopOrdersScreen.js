import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import color from "../../components/color";
import { useUser } from "../../UserContext";
import { Image } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_BASE_URL } from "../../Localhost";
import axios from "axios";

const ShopOrdersScreen = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState("Đã đặt");
  const [loading, setLoading] = useState(false);
  const { updateUser, user } = useUser();

  const [orderedOrders, setOrderedOrders] = useState([]);
  const [paidOrders, setPaidOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [cancelledOrders, setCancelledOrders] = useState([]);
  const isFocused = useIsFocused();
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const [isModalVisible, setModalVisible] = useState(false);
  const menu = [
    { id: 1, name: "Đã đặt" },
    { id: 2, name: "Đã thanh toán" },
    { id: 3, name: "Đã giao" },
    { id: 4, name: "Đã hoàn thành" },
    { id: 5, name: "Đã hủy" },
  ];

  const getOrderByShop = async () => {
    const shopId = user._id;
    try {
      let orderedOrder = [];
      let paidOrder = [];
      let deliveredOrder = [];
      let completedOrder = [];
      let cancelledOrder = [];
      const res = await axios.get(
        `${API_BASE_URL}/order/showOrdersByShop/${shopId}`
      );
      let orders = res.data.orders;
      orders.forEach(async (order) => {
        if (order.status === "processing") {
          orderedOrder.push(order);
        } else if (order.status === "paid") {
          paidOrder.push(order);
        } else if (order.status === "delivered") {
          deliveredOrder.push(order);
        } else if (order.status === "completed") {
          completedOrder.push(order);
        } else if (order.status === "canceled") {
          cancelledOrder.push(order);
        }
      });
      setOrderedOrders(orderedOrder);
      setPaidOrders(paidOrder);
      setDeliveredOrders(deliveredOrder);
      setCompletedOrders(completedOrder);
      setCancelledOrders(cancelledOrder);
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error; // Ném lại lỗi để xử lý ở phía gọi API
    }
  };
  useEffect(() => {
    console.log("orderedOrders", orderedOrders);
    console.log("paidOrders", paidOrders);
    console.log("deliveredOrders", deliveredOrders);
    console.log("completedOrders", completedOrders);
    console.log("cancelledOrders", cancelledOrders);
  }, [
    orderedOrders,
    paidOrders,
    deliveredOrders,
    completedOrders,
    cancelledOrders,
  ]);
  const fetchData = async () => {
    try {
      setLoading(true);
      const [confirmOrders, shippingOrders, completedOrders, cancelledOrders] =
        await Promise.all([getOrderByShop()]);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);
  const convertDate = (timestamp) => {
    const date = new Date(
      timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
    );
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return `${hours}:${minutes}:${seconds} ${day}/${month}/${year} `;
  };

  const closeModal = () => {
    if (isModalVisible) {
      toggleModal();
    }
  };
  const getOrderDetail = async (idOrder) => {
    try {
      const order = await axios.get(
        `${API_BASE_URL}/order/showOrderDetail/${idOrder}`
      );
      navigation.navigate("OrderItem", { order: order.data.orderDetail });
      // });
    } catch (error) {
      console.error("Get order detail error:", error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ flex: 1, justifyContent: "flex-start" }}
      >
        <View style={{ backgroundColor: "white" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ margin: 10 }}>Chọn đơn hàng</Text>
            <TouchableOpacity
              style={{
                paddingHorizontal: 5,
                backgroundColor: "white",
                width: 150,
                margin: 5,
                alignItems: "center",
                borderColor: color.origin,
                borderWidth: 1,
              }}
              onPress={() => {
                toggleModal();
              }}
            >
              <Text style={{ textAlign: "center", margin: 10 }}>
                -- {selectedTab} --
              </Text>
            </TouchableOpacity>
          </View>

          <Modal
            visible={isModalVisible}
            animationType="fade"
            transparent={true}
            onRequestClose={toggleModal}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              }}
            >
              <View
                style={{
                  backgroundColor: "white",
                  padding: 10,
                  borderRadius: 10,
                  width: "90%",
                }}
              >
                {/* button đóng */}
                <TouchableOpacity
                  style={{
                    marginTop: -10,
                    marginRight: -10,
                    alignSelf: "flex-end",
                  }}
                  onPress={closeModal}
                >
                  <Ionicons name="close-circle" size={25} color="lightgray" />
                </TouchableOpacity>

                <View style={{ backgroundColor: "white" }}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      textAlign: "center",
                      marginBottom: 10,
                    }}
                  >
                    Chọn loại đơn hàng
                  </Text>
                  {menu.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={{
                        borderColor: "lightgray",
                        borderWidth: 1,
                        marginVertical: 5,
                        paddingVertical: 5,
                        marginHorizontal: 50,
                      }}
                      onPress={() => {
                        setSelectedTab(item.name);
                        toggleModal();
                      }}
                    >
                      <Text style={{ color: "black", textAlign: "center" }}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </Modal>
        </View>
        <View>
          {selectedTab === "Đã đặt" ? (
            <View>
              {orderedOrders.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.listItem}
                  onPress={ () =>
                    getOrderDetail(item._id)
                  }
                >
                  {/* <Image
                  source={{ uri: item.image }}
                  style={styles.buyerImage}
                /> */}
                  <View style={styles.orderInfo}>
                    <Text style={styles.buyerName}>
                      Người mua: {item.address[0].name}
                    </Text>
                    <Text style={styles.idOrder}>ID đơn hàng: {item._id}</Text>
                    <Text style={styles.atCreate}>
                      Ngày mua: {item.createAt.substring(0, 10)}
                    </Text>
                    <Text style={styles.totalByShop}>
                      Tổng tiền: {item.totalByShop}đ
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View></View>
          )}
          {selectedTab === "Đã thanh toán" ? (
            <View>
              {paidOrders.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.listItem}
                  onPress={ () =>
                    getOrderDetail(item._id)
                  }
                >
                  {/* <Image
                source={{ uri: item.image }}
                style={styles.buyerImage}
              /> */}
                  <View style={styles.orderInfo}>
                    <Text style={styles.buyerName}>
                      Người mua: {item.address[0].name}
                    </Text>
                    <Text style={styles.idOrder}>ID đơn hàng: {item._id}</Text>
                    <Text style={styles.atCreate}>
                      Ngày mua: {item.createAt.substring(0, 10)}
                    </Text>
                    <Text style={styles.totalByShop}>
                      Tổng tiền: {item.totalByShop}đ
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View></View>
          )}
          {selectedTab === "Đã giao" ? (
            <View>
              {deliveredOrders.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.listItem}
                  onPress={ () =>
                    getOrderDetail(item._id)
                  }
                >
                  {/* <Image
                source={{ uri: item.image }}
                style={styles.buyerImage}
              /> */}
                  <View style={styles.orderInfo}>
                    <Text style={styles.buyerName}>
                      Người mua: {item.address[0].name}
                    </Text>
                    <Text style={styles.idOrder}>ID đơn hàng: {item._id}</Text>
                    <Text style={styles.atCreate}>
                      Ngày mua: {item.createAt.substring(0, 10)}
                    </Text>
                    <Text style={styles.totalByShop}>
                      Tổng tiền: {item.totalByShop}đ
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View></View>
          )}
          {selectedTab === "Đã hoàn thành" ? (
            <View>
              {completedOrders.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.listItem}
                  onPress={ () =>
                    getOrderDetail(item._id)
                  }
                >
                  {/* <Image
                source={{ uri: item.image }}
                style={styles.buyerImage}
              /> */}
                  <View style={styles.orderInfo}>
                    <Text style={styles.buyerName}>
                      Người mua: {item.address[0].name}
                    </Text>
                    <Text style={styles.idOrder}>ID đơn hàng: {item._id}</Text>
                    <Text style={styles.atCreate}>
                      Ngày mua: {item.createAt.substring(0, 10)}
                    </Text>
                    <Text style={styles.totalByShop}>
                      Tổng tiền: {item.totalByShop}đ
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View></View>
          )}
          {selectedTab === "Đã hủy" ? (
            <View>
              {cancelledOrders.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.listItem}
                  onPress={ () =>
                    getOrderDetail(item._id)
                  }
                >
                  {/* <Image
                source={{ uri: item.image }}
                style={styles.buyerImage}
              /> */}
                  <View style={styles.orderInfo}>
                    <Text style={styles.buyerName}>
                      Người mua: {item.address[0].name}
                    </Text>
                    <Text style={styles.idOrder}>ID đơn hàng: {item._id}</Text>
                    <Text style={styles.atCreate}>
                      Ngày mua: {item.createAt.substring(0, 10)}
                    </Text>
                    <Text style={styles.totalByShop}>
                      Tổng tiền: {item.totalByShop}đ
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View></View>
          )}
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default ShopOrdersScreen;

const styles = StyleSheet.create({
  todo_list: {
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "top",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  todo_item: {
    alignItems: "center",
    paddingHorizontal: 5,
    width: "20%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
  },
  todoItemText: {
    textAlign: "center",
  },
  numberTodoItem: {
    fontSize: 30,
    color: color.origin,
    fontWeight: "bold",
  },
  buyerImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    backgroundColor: "white",
    padding: 10,
  },
  orderInfo: {
    marginLeft: 10,
    flex: 1,
  },
  idOrder: {},
  buyerName: {
    fontWeight: "bold",
  },
  atCreate: {
    color: "gray",
  },
  totalByShop: {
    color: color.origin,
    fontWeight: "bold",
    alignSelf: "flex-end",
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
});
