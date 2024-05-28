import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Image,
  FlatList,
  TextInput,
  Modal,
} from "react-native";
import {
  Feather,
  SimpleLineIcons,
  Entypo,
  AntDesign,
  Ionicons,
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import color from "../../components/color";
import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../Localhost";
import axios, { all } from "axios";

const SellerRegisterScreen = () => {
  const [allSellerRequestList, setAllSellerRequestList] = useState([]);
  const [detail, setDetail] = useState({});
  const [selectedId, setSelectedId] = useState(false);
  const [sellerByStatus, setSellerByStatus] = useState([]);

  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const statusArr = [
    { id: 0, status: "Tất cả" },
    { id: 1, status: "Chờ duyệt" },
    { id: 2, status: "Đã chấp nhận" },
    { id: 3, status: "Đã từ chối" },
  ];

  const getUserByStatus = (id) => {
    setSelectedId(id);
    if (id == 0) {
      getSellerRequest();
    } else if (id == 1) {
      let arr = allSellerRequestList.filter(
        (item) => item.sellerRequestStatus == "PENDING"
      );
      setSellerByStatus(arr);
    } else if (id == 2) {
      let arr = allSellerRequestList.filter(
        (item) => item.sellerRequestStatus == "SUCCESS"
      );
      setSellerByStatus(arr);
    } else if (id == 3) {
      let arr = allSellerRequestList.filter(
        (item) => item.sellerRequestStatus == "REJECTED"
      );
      setSellerByStatus(arr);
    }
  };

  const acceptRequest = () => {
    axios
      .post(`${API_BASE_URL}/admin/approveSaleRequest`, {
        userId: detail._id,
      })
      .then(function (response) {
        console.log(response.data);
        getSellerRequest();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const rejectRequest = () => {
    axios
      .post(`${API_BASE_URL}/admin/rejectSaleRequest`, {
        userId: detail._id,
      })
      .then(function (response) {
        console.log(response.data);
        getSellerRequest();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const closeModal = () => {
    setDetail({});
    toggleModal();
  };

  useEffect(() => {
    getSellerRequest();
  }, []);

  const getSellerRequest = () => {
    axios
      .get(`${API_BASE_URL}/admin/showAllSellerRequest`)
      .then(function (response) {
        setAllSellerRequestList(response.data.data);
        setSellerByStatus(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 10,
          backgroundColor: color.primary,
        }}
      >
        {statusArr.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => {
              getUserByStatus(item.id);
            }}
            style={{
              backgroundColor: selectedId == item.id ? "white" : color.primary,
              padding: 10,
              borderColor: selectedId == item.id ? color.origin : "gray",
              borderWidth: selectedId == item.id ? 1 : 0,
            }}
          >
            <Text
              style={{
                color: selectedId == item.id ? color.origin : "gray",
              }}
            >
              {item.status}
            </Text>
          </TouchableOpacity>
        ))}
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
              padding: 20,
              borderRadius: 10,
              width: 300,
            }}
          >
            <TouchableOpacity
              style={{
                marginTop: -15,
                marginRight: -15,
                alignSelf: "flex-end",
              }}
              onPress={closeModal}
            >
              <Ionicons name="close-circle" size={25} color="lightgray" />
            </TouchableOpacity>
            <Text
              style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}
            >
              Người đăng ký
            </Text>
            <Text style={{ textAlign: "center", fontSize: 16 }}>
              {detail.name}
            </Text>
            <Text style={styles.detailText}>Tên cửa hàng:</Text>
            <Text style={styles.dataTxt}>{detail.shopName}</Text>
            <Text style={styles.detailText}>Địa chỉ: </Text>
            <Text style={styles.dataTxt}>{detail.shopAddress}</Text>
            <Text style={styles.detailText}>Mô tả shop: </Text>
            <Text style={styles.dataTxt}>{detail.shopDescript}</Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginHorizontal: 20,
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 10,
                  borderColor: "#24990c",
                  borderWidth: 1,
                  borderRadius: 5,
                  width: 100,
                }}
                onPress={() => {
                  acceptRequest();
                  Alert.alert("Thông báo", "Đã chấp nhận yêu cầu");
                  closeModal();
                }}
              >
                <Text style={{ color: "#24990c", fontWeight: "bold" }}>
                  Chấp nhận
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 10,
                  borderColor: "#b80404",
                  borderRadius: 5,
                  borderWidth: 1,
                  width: 100,
                }}
                onPress={() => {
                  rejectRequest();
                  Alert.alert("Thông báo", "Đã từ chối yêu cầu");
                  closeModal();
                }}
              >
                <Text style={{ color: "#b80404", fontWeight: "bold" }}>
                  Từ chối
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <FlatList
        data={sellerByStatus}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              setDetail(item);
              toggleModal();
            }}
            style={[
              styles.list_items,
              { marginVertical: 5, marginHorizontal: 10 },
            ]}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View
                style={{
                  alignItems: "flex-start",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Image
                  source={{ uri: item.avatarUrl }}
                  style={{ width: 50, height: 50, borderRadius: 50 }}
                />
                <Text style={{ marginLeft: 10, fontSize: 16 }}>
                  {item.name}
                </Text>
              </View>
              <View
                style={{
                  alignItems: "flex-end",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 16, marginRight: 10 }}>
                  {item.sellerRequestStatus == "PENDING"
                    ? "Chờ duyệt"
                    : item.sellerRequestStatus == "SUCCESS"
                    ? "Đã chấp nhận"
                    : "Đã từ chối"}
                </Text>
                <FontAwesome
                  //   style={styles.iconButton}
                  name="angle-double-right"
                  size={25}
                  color="#60698a"
                />
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default SellerRegisterScreen;

const styles = StyleSheet.create({
  list_items: {
    backgroundColor: "white",
    marginBottom: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: "lightgray",
  },
  iconButton: {
    width: 40,
    height: 40,
    // justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 5,
    marginRight: 15,
    borderColor: "#d1d1d1",
    borderWidth: 1,
    borderRadius: 100,
  },
  detailText: {
    fontWeight: "bold",
    marginTop: 10,
    fontSize: 16,
    // textAlign: "center",
  },
  dataTxt: {
    fontSize: 16,
    // textAlign: "center",
  },
});
