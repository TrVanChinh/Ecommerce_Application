import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Image } from "react-native-elements";

const OrderItemScreen = ({ navigation, route }) => {
  const { idOrder: idOrder } = route.params;
  const [order, setOrder] = useState({});
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    setLoading(true);
    const [t1,t2] = await Promise.all([
      // getOrder(),
      // getOrderDetail(),
    ]);
    setLoading(false);
  };
  const getOrder = async () => {
    const docRef = doc(db, "order", idOrder);
    const docSnap = await getDoc(docRef);
    const orders = [];
    const buyer = await getBuyerInfo(docSnap.data().idUser);
    const address = await getAdress(
      docSnap.data().idUser,
      docSnap.data().idAddress
    );
    const shippingUnit = await getShippingUnit(docSnap.data().idShippingUnit);
    orders.push({
      id: docSnap.id,
      buyerName: buyer.name,
      atCreate: convertDate(docSnap.data().atCreate),
      image: buyer.photo,
      idUser: docSnap.data().idUser,      
      status: docSnap.data().status,
      totalByShop: formatPrice(docSnap.data().totalByShop),
      receiver: address.name,
      phoneNum: address.phoneNumber,
      shippingUnit: shippingUnit.name,
      shipCost: formatPrice(shippingUnit.price),
      deliveryTime: shippingUnit.deliveryTime,
      address:
        address.street +
        ", " +
        address.Ward +
        ", " +
        address.District +
        ", " +
        address.Provinces,
    });
    setOrder(orders[0]);
  };

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
  const getAdress = async (idBuyer, idAddress) => {
    const q = doc(db, "user", idBuyer, "address", idAddress);
    const addressDoc = await getDoc(q);
    return addressDoc.data();
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

  const getProductInfo = async (id) => {
    const docRef = doc(db, "product", id);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  };
  const getOptionProduct = async (idPrd, idOption) => {
    const docRef = doc(db, "product", idPrd, "option", idOption);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  };
  const getShippingUnit = async (id) => {
    const docRef = doc(db, "shippingUnit", id);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  };

  const getOrderDetail = async () => {
    const orderItems = await getDocs(
      collection(db, "order", idOrder, "option")
    );
    const items = [];
    for (const item of orderItems.docs) {
      const prdInfo = await getProductInfo(item.data().idProduct);
      const optionInfo = await getOptionProduct(
        item.data().idProduct,
        item.data().idOption
      );
      items.push({
        idProduct: item.data().idProduct,
        idOptionProduct: item.data().idOption,
        image: optionInfo.image,
        nameProduct: prdInfo.name,
        nameOptionPruct: optionInfo.name,
        price: item.data().price,
        quantity: item.data().quantity,
      });
    }
    setOrderItems(items);
  };

  const confirmOrder = async () => {
    setLoading(true);
    const docRef = doc(db, "order", idOrder);
    await updateDoc(docRef, {
      status: "đang vận chuyển",
    });
    setLoading(false);
    Alert.alert("Thông báo", "Đơn hàng đang được vận chuyển", [
      {
        text: "OK",
        onPress: () => {
          navigation.goBack();
        },
      },
    ]);
  };

  const updatePropuctQuantity = async (idProduct, idOption, quantity) => {
    //update quantity trong option
    const docRef = doc(db, "product", idProduct, "option", idOption);
    const docSnap = await getDoc(docRef);
    const quantityOption = docSnap.data().quantity;
    await updateDoc(docRef, {
      quantity: quantityOption - quantity,
    });
  };

  const deliveredOrder = async () => {
    setLoading(true);

    //update status
    const docRef = doc(db, "order", idOrder);
    await updateDoc(docRef, {
      status: "đã giao hàng",
    });

    //update sold
    const docRef2 = doc(db, "product", orderItems[0].idProduct);
    const docSnap2 = await getDoc(docRef2);
    const prdIf = docSnap2.data();
    let sold = 0;
    if (prdIf.sold !== undefined) {
      sold = prdIf.sold
    }
    for (const item of orderItems) {
      await updatePropuctQuantity(
        item.idProduct,
        item.idOptionProduct,
        item.quantity
      );
      sold += item.quantity;
    }
    
    await updateDoc(docRef2, {
      sold: sold,
    });
    setLoading(false);
    Alert.alert("Thông báo", "Đơn hàng đã giao", [
      {
        text: "OK",
        onPress: () => {
          navigation.goBack();
        },
      },
    ]);
  };

  const calculateTotal = () => {
    let total = 0;
    orderItems.forEach((item) => {
      total += item.price * item.quantity;
    });
    // return total;\
    return formatPrice(total);
  };

  const formatPrice = (price) => {
    // Sử dụng Intl.NumberFormat để định dạng số thành chuỗi với dấu ngăn cách hàng nghìn
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.listItem}>
        <Text style={styles.textTitle}>
          Trạng thái đơn hàng: {order.status}
        </Text>
        <Text style={styles.textItem}>Mã đơn hàng: {order.id}</Text>
        <Text style={styles.textItem}>Người đặt hàng: {order.buyerName}</Text>
        <Text style={styles.textItem}>Ngày đặt hàng: {order.atCreate}</Text>
      </View>
      <View style={styles.listItem}>
        <Text style={styles.textTitle}>Thông tin giao hàng</Text>
        <Text style={styles.textItem}>Người nhận hàng: {order.receiver}</Text>
        <Text style={styles.textItem}>Số điện thoại: {order.phoneNum}</Text>
        <Text style={styles.textItem}>Địa chỉ nhận hàng: {order.address}</Text>
      </View>
      <View style={styles.listItem}>
        <Text style={styles.textTitle}>Thông tin sản phẩm</Text>
        {orderItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.orderItems,
              { borderTopWidth: 1, borderColor: "lightgray" },
            ]}
          >
            <Image
              source={{ uri: item.image }}
              style={{ width: 50, height: 50 }}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.prdName}>{item.nameProduct}</Text>
              <Text style={styles.prdOption}>Loại: {item.nameOptionPruct}</Text>
              <Text style={styles.prdQty}>Số lượng: {item.quantity}</Text>
              <Text style={styles.prdPrice}>
                Giá: {formatPrice(item.price)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
        <Text
          style={[
            styles.prdPrice,
            { fontWeight: "bold", fontSize: 16, marginTop: 5 },
          ]}
        >
          Thành tiền: {calculateTotal()}
        </Text>
      </View>
      <View style={styles.listItem}>
        <Text style={styles.textTitle}>Thông tin vận chuyển {}</Text>
        <Text style={styles.textItem}>
          Đơn vị vận chuyển: {order.shippingUnit}
        </Text>
        <Text style={styles.textItem}>Phí vận chuyển: {order.shipCost}</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          position: "absolute",
          backgroundColor: "white",
          padding: 10,
          bottom: 0,
          justifyContent: "space-between",
          width: "100%",
          // alignSelf: "flex-end",
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
            alignSelf: "center",
            color: "red",
            fontSize: 20,
            flex: 2,
          }}
        >
          Tổng tiền: {order.totalByShop}
        </Text>
        {order.status !== "đã giao hàng" && (
          <TouchableOpacity
            style={{
              backgroundColor: "red",
              padding: 10,
              alignSelf: "flex-end",
              alignItems: "center",
              flex: 1,
            }}
            onPress={() =>
              order.status=== "đang chờ xử lý" ? confirmOrder() : deliveredOrder()
            }
          >
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              {order.status=== "đang chờ xử lý" ? "Xác nhận" : "Đã giao hàng"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </View>
  );
};

export default OrderItemScreen;

const styles = StyleSheet.create({
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  listItem: {
    backgroundColor: "white",
    padding: 10,
    marginVertical: 5,
  },
  textItem: {
    // fontWeight: "bold",
    marginLeft: 25,
  },
  textTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginVertical: 5,
    marginLeft: 10,
  },
  orderItems: {
    flexDirection: "row",
    // justifyContent: "space-between",
    alignItems: "center",
    // padding: 20,
    // marginVertical: 8,
    backgroundColor: "white",
  },
  prdName: {
    marginLeft: 10,
    fontWeight: "bold",
  },
  prdOption: {
    marginLeft: 10,
  },
  prdPrice: {
    // width: "20%",
    color: "red",
    alignSelf: "flex-end",
  },
  prdQty: {
    marginLeft: 10,
  },
});
