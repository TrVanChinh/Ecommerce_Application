import React, { useEffect, useState, useCallback } from "react";
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
  FontAwesome6,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import axios from "axios";
import color from "../../components/color";
import { API_BASE_URL } from "../../Localhost";

const DeliverListScreen = ({ navigation, route }) => {
  const [deliverList, setDeliverList] = useState([]);
  const [name, setName] = useState("");
  const [updateName, setUpdateName] = useState("");
  const [updateDeliveryTime, setUpdateDeliveryTime] = useState("");
  const [updateDeliveryFee, setUpdateDeliveryFee] = useState("");
  const [deliveryId, setDeliverId] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [isAdd, setAdd] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const closeModal = () => {
    setUpdateName("");
    setUpdateDeliveryTime("");
    setUpdateDeliveryFee("");
    setAdd(false);
    toggleModal();
  };

  useEffect(() => {
    getDelivery();
  }, []);

  const getDelivery = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/shippingUnit`);
      setDeliverList(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  // let { deliveryTime, name, price } = req.body;
  const newDelivery = async () => {
    try {
      await axios.post(`${API_BASE_URL}/admin/addShippingUnit`, {
        deliveryTime: updateDeliveryTime,
        name: updateName,
        price: updateDeliveryFee,
      });
      Alert.alert("Thêm thành công");
      getDelivery();
      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteDelivery = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/admin/deleteShippingUnit/${id}`);
      Alert.alert("Xóa thành công");
        getDelivery();
    } catch (error) {
      console.log(error);
    }
  };
  // let { deliveryTime, name, price } = req.body;
  const updateDelivery = async () => {
    try {
      await axios.put(
        `${API_BASE_URL}/admin/updateShippingUnit/${deliveryId}`,
        {
          deliveryTime: updateDeliveryTime,
          name: updateName,
          price: updateDeliveryFee,
        }
      );
      Alert.alert("Cập nhật thành công");
      getDelivery();
      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  const renderItem = useCallback(
    ({ item }) => (
      <View
        style={[styles.list_items, { marginVertical: 5, marginHorizontal: 10 }]}
      >
        <View style={[styles.itemLeft, { flexDirection: "column" }]}>
          <Text style={[styles.itemText, { fontWeight: "bold", fontSize: 16 }]}>
            {" "}
            {item.name}{" "}
          </Text>
          <Text style={styles.itemText}>
            {" "}
            Thời gian vận chuyển: {item.deliveryTime} ngày
          </Text>
          <Text style={styles.itemText}> Phí vận chuyển: {item.price}đ</Text>
        </View>
        <View style={styles.itemRight}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              setUpdateName(item.name);
              setDeliverId(item._id);
              setUpdateDeliveryTime(item.deliveryTime);
              setUpdateDeliveryFee(item.price);
              toggleModal();
            }}
          >
            <MaterialIcons name="edit" size={25} color="#60698a" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              Alert.alert(
                "Xác nhận xóa",
                "Bạn có chắc muốn xóa?",
                [
                  { text: "Hủy", style: "cancel" },
                  { text: "Xóa", onPress: () => deleteDelivery(item._id) },
                ]
              );
            }}
          >
            <MaterialIcons name="remove-circle" size={25} color="#60698a" />
          </TouchableOpacity>
        </View>
      </View>
    ),
    []
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setAdd(true);
            toggleModal();
          }}
        >
          <Text style={styles.addButtonText}>Thêm đơn vị vận chuyển</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Ionicons name="close-circle" size={25} color="lightgray" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Đơn vị vận chuyển:</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Nhập tên đơn vị vận chuyển"
              value={updateName}
              onChangeText={(text) => setUpdateName(text)}
            />
            <Text style={styles.modalTitle}>Thời gian giao hàng:</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Nhập thời gian giao hàng"
              value={updateDeliveryTime.toString()}
              onChangeText={(text) => setUpdateDeliveryTime(text)}
            />
            <Text style={styles.modalTitle}>Phí giao hàng: </Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Nhập phí giao hàng"
              value={updateDeliveryFee.toString()}
              onChangeText={(text) => setUpdateDeliveryFee(text)}
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => {
                if (!updateName || !updateDeliveryTime || !updateDeliveryFee) {
                  Alert.alert("Thông báo", "Không được để trống");
                } else {
                  if (isAdd) {
                    newDelivery();
                  } else {
                    updateDelivery();
                  }
                }
              }}
            >
              <View style={styles.saveButtonContent}>
                <Text style={styles.saveButtonText}>Lưu</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <FlatList
        data={deliverList}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  input: {
    width: "75%",
    marginVertical: 30,
    marginLeft: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  addButton: {
    marginHorizontal: 10,
    flex: 1,
    backgroundColor: "red",
    marginVertical: 20,
  },
  addButtonText: {
    textAlign: "center",
    padding: 10,
    color: "white",
  },
  list_items: {
    backgroundColor: "white",
    marginBottom: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderWidth: 1,
    borderColor: "lightgray",
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "left",
  },
  itemText: {
    marginLeft: 2,
    textAlign: "left",
    fontSize: 16,
  },
  itemRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    backgroundColor: "#f0f0f0",
    padding: 5,
    marginRight: 5,
    borderColor: "#d1d1d1",
    borderWidth: 1,
    borderRadius: 50,
  },
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
  closeButton: {
    marginTop: -15,
    marginRight: -15,
    alignSelf: "flex-end",
  },
  modalTitle: {
    fontWeight: "bold",
    color: color.origin,
    fontSize: 16,
    textAlign: "center",
  },
  modalInput: {
    marginVertical: 12,
    paddingVertical: 0,
    padding: 15,
    height: 40,
    textAlign: "center",
    borderWidth: 1,
    borderColor: "lightgray",
  },
  saveButton: {
    backgroundColor: color.origin,
    marginHorizontal: 100,
    marginTop: 10,
  },
  saveButtonContent: {
    alignItems: "center",
    justifyContent: "center",
    height: 35,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default DeliverListScreen;