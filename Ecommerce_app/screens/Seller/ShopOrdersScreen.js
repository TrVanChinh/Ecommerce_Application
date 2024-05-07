import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
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

const ShopOrdersScreen = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState("tab1");
  const { user } = useUser();
  const idUser = user?.user?.uid;
  const db = getFirestore();
  const [loading, setLoading] = useState(false);

  const [confirmOrders, setConfirmOrders] = useState([]);
  const [shippingOrders, setShippingOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [cancelledOrders, setCancelledOrders] = useState([]);
  const isFocused = useIsFocused();

  // useEffect(() => {
  //   fetchData();
  // }, []);
  const fetchData = async () => {
    try {
      setLoading(true);
      const [confirmOrders, shippingOrders, completedOrders, cancelledOrders] = await Promise.all([
        getConfirmOrders(),
        getShippingOrders(),
        getCompletedOrders(),
        getCancelledOrders()
      ]);
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

  const getBuyerInfo = async (id) => {
    const q = doc(db, "user", id);
    const userDoc = await getDoc(q);
    const user = {
      id: userDoc.id,
      name: userDoc.data().name,
      photo: userDoc.data().photo,
    };
    return user;
  };

  const getConfirmOrders = async () => {
    // setSelectedTab("tab1");
    const q = query(
      collection(db, "order"),
      where("idShop", "==", idUser),
      where("status", "==", "đang chờ xử lý")
    );

    const querySnapshot = await getDocs(q);
    const orders = [];
    for (const doc of querySnapshot.docs) {
      const buyer = await getBuyerInfo(doc.data().idUser);
      const order = {
        id: doc.id,
        image: buyer.photo,
        address: doc.data().idAddress,
        buyerName: buyer.name,
        atCreate: convertDate(doc.data().atCreate),
        totalByShop: doc.data().totalByShop,
      };
      orders.push(order);
    }
    setConfirmOrders(orders);
  };
  const getShippingOrders = async () => {
    // setSelectedTab("tab2");
    const q = query(
      collection(db, "order"),
      where("idShop", "==", idUser),
      where("status", "==", "đang vận chuyển")
    );
    const querySnapshot = await getDocs(q);
    const orders = [];
    for (const doc of querySnapshot.docs) {
      const buyer = await getBuyerInfo(doc.data().idUser);
      const order = {
        id: doc.id,
        image: buyer.photo,
        address: doc.data().idAddress,
        buyerName: buyer.name,
        atCreate: convertDate(doc.data().atCreate),
        totalByShop: doc.data().totalByShop,
      };
      orders.push(order);
    }
    setShippingOrders(orders);
  };
  const getCompletedOrders = async () => {
    // setSelectedTab("tab3");
    const q = query(
      collection(db, "order"),
      where("idShop", "==", idUser),
      where("status", "==", "đã giao hàng")
    );
    const querySnapshot = await getDocs(q);
    const orders = [];
    for (const doc of querySnapshot.docs) {
      const buyer = await getBuyerInfo(doc.data().idUser);
      const order = {
        id: doc.id,
        image: buyer.photo,
        address: doc.data().idAddress,
        buyerName: buyer.name,
        atCreate: convertDate(doc.data().atCreate),
        totalByShop: doc.data().totalByShop,
      };
      orders.push(order);
    }
    setCompletedOrders(orders);
  };
  const getCancelledOrders = async () => {
    // setSelectedTab("tab4");
    const q = query(
      collection(db, "order"),
      where("idShop", "==", idUser),
      where("status", "==", "đã hủy")
    );
    const querySnapshot = await getDocs(q);
    const orders = [];
    for (const doc of querySnapshot.docs) {
      const buyer = await getBuyerInfo(doc.data().idUser);
      const order = {
        id: doc.id,
        image: buyer.photo,
        address: doc.data().idAddress,
        buyerName: buyer.name,
        atCreate: convertDate(doc.data().atCreate),
        totalByShop: doc.data().totalByShop,
      };
      orders.push(order);
    }
    setCancelledOrders(orders);
  };
  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ flex: 1, justifyContent: "flex-start" }}
      >
        <View style={styles.todo_list}>
          <TouchableOpacity
            style={[
              styles.todo_item,
              { borderColor: selectedTab === "tab1" ? "red" : "lightgray" },
            ]}
            onPress={() => setSelectedTab("tab1")}
          >
            <Text style={styles.numberTodoItem}>{confirmOrders.length}</Text>
            <Text style={styles.todoItemText}>Chờ xác nhận</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.todo_item,
              { borderColor: selectedTab === "tab2" ? "red" : "lightgray" },
            ]}
            onPress={() => setSelectedTab("tab2")}
          >
            <Text style={styles.numberTodoItem}>{shippingOrders.length}</Text>
            <Text style={styles.todoItemText}>Đang vận chuyển</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.todo_item,
              { borderColor: selectedTab === "tab3" ? "red" : "lightgray" },
            ]}
            onPress={() => setSelectedTab("tab3")}
          >
            <Text style={styles.numberTodoItem}>{completedOrders.length}</Text>
            <Text style={styles.todoItemText}>Đã xử lý</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.todo_item,
              { borderColor: selectedTab === "tab4" ? "red" : "lightgray" },
            ]}
            onPress={() => setSelectedTab("tab4")}
          >
            <Text style={styles.numberTodoItem}>{cancelledOrders.length}</Text>
            <Text style={styles.todoItemText}>Đã hủy</Text>
          </TouchableOpacity>
        </View>
        <View>
          {selectedTab === "tab1" ? (
            <View>
              {confirmOrders.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.listItem}
                  onPress={() =>
                    navigation.navigate("OrderItem", { idOrder: item.id })
                  }
                >
                  <Image
                    source={{ uri: item.image }}
                    style={styles.buyerImage}
                  />
                  <View style={styles.orderInfo}>
                    <Text style={styles.buyerName}>
                      Người mua: {item.buyerName}
                    </Text>
                    <Text style={styles.idOrder}>ID đơn hàng: {item.id}</Text>
                    <Text style={styles.atCreate}>
                      Ngày mua: {item.atCreate}
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
          {selectedTab === "tab2" ? (
            <View>
              {shippingOrders.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.listItem}
                  onPress={() =>
                    navigation.navigate("OrderItem", { idOrder: item.id })
                  }
                >
                  <Image
                    source={{ uri: item.image }}
                    style={styles.buyerImage}
                  />
                  <View style={styles.orderInfo}>
                    <Text style={styles.buyerName}>
                      Người mua: {item.buyerName}
                    </Text>
                    <Text style={styles.idOrder}>ID đơn hàng: {item.id}</Text>
                    <Text style={styles.atCreate}>
                      Ngày mua: {item.atCreate}
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
          {selectedTab === "tab3" ? (
            <View>
              {completedOrders.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.listItem}
                  onPress={() =>
                    navigation.navigate("OrderItem", { idOrder: item.id })
                  }
                >
                  <Image
                    source={{ uri: item.image }}
                    style={styles.buyerImage}
                  />
                  <View style={styles.orderInfo}>
                    <Text style={styles.buyerName}>
                      Người mua: {item.buyerName}
                    </Text>
                    <Text style={styles.idOrder}>ID đơn hàng: {item.id}</Text>
                    <Text style={styles.atCreate}>
                      Ngày mua: {item.atCreate}
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
          {selectedTab === "tab4" ? (
            <View>
              {cancelledOrders.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.listItem}
                  onPress={() =>
                    navigation.navigate("OrderItem", { idOrder: item.id })
                  }
                >
                  <Image
                    source={{ uri: item.image }}
                    style={styles.buyerImage}
                  />
                  <View style={styles.orderInfo}>
                    <Text style={styles.buyerName}>
                      Người mua: {item.buyerName}
                    </Text>
                    <Text style={styles.idOrder}>ID đơn hàng: {item.id}</Text>
                    <Text style={styles.atCreate}>
                      Ngày mua: {item.atCreate}
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
