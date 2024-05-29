import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Image,
  ActivityIndicator,
  FlatList,
  Modal,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import color from "../../components/color";
import { API_BASE_URL } from "../../Localhost";

const SellerRegisterScreen = () => {
  const [allSellerRequestList, setAllSellerRequestList] = useState([]);
  const [detail, setDetail] = useState({});
  const [selectedId, setSelectedId] = useState(0);
  const [sellerByStatus, setSellerByStatus] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getSellerRequest();
  }, []);

  const toggleModal = () => setModalVisible(!isModalVisible);

  const statusArr = [
    { id: 0, status: "Tất cả" },
    { id: 1, status: "Chờ duyệt" },
    { id: 2, status: "Đã chấp nhận" },
    { id: 3, status: "Đã từ chối" },
  ];

  const getUserByStatus = (id) => {
    setSelectedId(id);
    const statusMap = {
      0: allSellerRequestList,
      1: allSellerRequestList.filter(
        (item) => item.sellerRequestStatus === "PENDING"
      ),
      2: allSellerRequestList.filter(
        (item) => item.sellerRequestStatus === "SUCCESS"
      ),
      3: allSellerRequestList.filter(
        (item) => item.sellerRequestStatus === "REJECTED"
      ),
    };
    setSellerByStatus(statusMap[id]);
  };

  const handleRequest = async (url) => {
    setLoading(true);
    await axios
      .post(url, { userId: detail._id })
      .then(() => {
        getSellerRequest();
        setSelectedId(0);
      })
      .catch(console.log);
    setLoading(false);
    toggleModal();
  };

  const acceptRequest = () =>
    handleRequest(`${API_BASE_URL}/admin/approveSaleRequest`);
  const rejectRequest = () =>
    handleRequest(`${API_BASE_URL}/admin/rejectSaleRequest`);

  const getSellerRequest = () => {
    axios
      .get(`${API_BASE_URL}/admin/showAllSellerRequest`)
      .then((response) => {
        setAllSellerRequestList(response.data.data);
        setSellerByStatus(response.data.data);
      })
      .catch(console.log);
  };

  const renderStatusButton = (item) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => getUserByStatus(item.id)}
      style={[
        styles.statusButton,
        {
          backgroundColor: selectedId === item.id ? "white" : color.primary,
          borderColor: selectedId === item.id ? color.origin : "gray",
          borderWidth: selectedId === item.id ? 1 : 0,
        },
      ]}
    >
      <Text style={{ color: selectedId === item.id ? color.origin : "gray" }}>
        {item.status}
      </Text>
    </TouchableOpacity>
  );

  const renderSellerItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        setDetail(item);
        toggleModal();
      }}
      style={styles.listItem}
    >
      <View style={styles.itemContent}>
        <View style={styles.itemLeft}>
          <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
          <Text style={styles.itemName}>{item.name}</Text>
        </View>
        <View style={styles.itemRight}>
          <Text style={styles.itemStatus}>
            {item.sellerRequestStatus === "PENDING"
              ? "Chờ duyệt"
              : item.sellerRequestStatus === "SUCCESS"
              ? "Đã chấp nhận"
              : "Đã từ chối"}
          </Text>
          <FontAwesome name="angle-double-right" size={25} color="#60698a" />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        {statusArr.map(renderStatusButton)}
      </View>

      <Modal
        visible={isModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalClose} onPress={toggleModal}>
              <Ionicons name="close-circle" size={25} color="lightgray" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Người đăng ký</Text>
            <Text style={styles.modalName}>{detail.name}</Text>
            {["Tên cửa hàng", "Địa chỉ", "Mô tả shop"].map((field, index) => (
              <View key={index}>
                <Text style={styles.detailText}>{field}:</Text>
                <Text style={styles.dataText}>
                  {detail[["shopName", "shopAddress", "shopDescript"][index]]}
                </Text>
              </View>
            ))}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.acceptButton,
                  detail.sellerRequestStatus === "SUCCESS" &&
                    styles.disabledButton,
                ]}
                onPress={() => {
                  if (detail.sellerRequestStatus !== "SUCCESS") {
                    acceptRequest();
                    // toggleModal();
                  }
                }}
                disabled={detail.sellerRequestStatus === "SUCCESS"}
              >
                <Text
                  style={[
                    styles.acceptText,
                    detail.sellerRequestStatus === "SUCCESS" &&
                      styles.disabledText,
                  ]}
                >
                  Chấp nhận
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.rejectButton,
                  detail.sellerRequestStatus === "REJECTED" &&
                    styles.disabledButton,
                ]}
                onPress={() => {
                  if (detail.sellerRequestStatus !== "REJECTED") {
                    rejectRequest();
                    // toggleModal();
                  }
                }}
                disabled={detail.sellerRequestStatus === "REJECTED"}
              >
                <Text
                  style={[
                    styles.rejectText,
                    detail.sellerRequestStatus === "REJECTED" &&
                      styles.disabledText,
                  ]}
                >
                  Từ chối
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
      </Modal>

      <FlatList data={sellerByStatus} renderItem={renderSellerItem} />
    </View>
  );
};

export default SellerRegisterScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: color.primary,
  },
  statusButton: { padding: 10 },
  listItem: {
    backgroundColor: "white",
    marginVertical: 5,
    marginHorizontal: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "lightgray",
  },
  itemContent: { flexDirection: "row", justifyContent: "space-between" },
  itemLeft: { flexDirection: "row", alignItems: "center" },
  avatar: { width: 50, height: 50, borderRadius: 50 },
  itemName: { marginLeft: 10, fontSize: 16 },
  itemRight: { flexDirection: "row", alignItems: "center" },
  itemStatus: { fontSize: 16, marginRight: 10 },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: 300,
  },
  modalClose: { marginTop: -15, marginRight: -15, alignSelf: "flex-end" },
  modalTitle: { fontSize: 20, fontWeight: "bold", textAlign: "center" },
  modalName: { textAlign: "center", fontSize: 16 },
  detailText: { fontWeight: "bold", marginTop: 10, fontSize: 16 },
  dataText: { fontSize: 16 },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 10,
  },
  modalButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 5,
    width: 100,
  },
  acceptButton: { borderColor: "#24990c", borderWidth: 1 },
  rejectButton: { borderColor: "#b80404", borderWidth: 1 },
  acceptText: { color: "#24990c", fontWeight: "bold" },
  rejectText: { color: "#b80404", fontWeight: "bold" },
  disabledButton: { backgroundColor: "lightgray", borderColor: "darkgray" },
  disabledText: { color: "darkgray" },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
});
