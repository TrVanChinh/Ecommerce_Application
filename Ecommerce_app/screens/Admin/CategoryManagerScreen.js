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
import color from "../../components/color";
import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../Localhost";
import axios from "axios";

const CategoryManagerScreen = ({ navigation, route }) => {
  const [categories, setCategory] = useState([]);
  const [subcategories, setSubcategory] = useState([]);
  const [name, setName] = useState("");
  const [updateName, setUpdateName] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const closeModal = () => {
    setUpdateName("");
    toggleModal();
  };

  useEffect(() => {
    getCategory();
  }, []);
  const getCategory = () => {
    axios
      .get(`${API_BASE_URL}/admin/showCategory`)
      .then(function (response) {
        setCategory(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const newCategory = () => {
    axios
      .post(`${API_BASE_URL}/admin/newCategory`, {
        name: name,
      })
      .then(function (response) {
        console.log(response);
        Alert.alert("Thêm danh mục thành công");
        setName("");
        getCategory();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const deleteCategory = (id) => {
    axios
      .delete(`${API_BASE_URL}/admin/deleteCategory`, {
        data: {
          categoryId: id,
        },
      })
      .then(function (response) {
        console.log(response);
        Alert.alert("Xóa danh mục thành công");
        getCategory();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const updateCategory = () => {
    axios
      .put(`${API_BASE_URL}/admin/updateCategory`, {
        categoryId: categoryId,
        name: updateName,
      })
      .then(function (response) {
        console.log(response);
        Alert.alert("Cập nhật danh mục thành công");
        getCategory();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TextInput
          style={{
            width: "75%",
            marginVertical: 30,
            marginLeft: 10,
            paddingHorizontal: 10,
            backgroundColor: "#fff",
          }}
          placeholder="Nhập tên danh mục"
          onChangeText={(text) => setName(text)}
          value={name}
        />

        <TouchableOpacity
          style={{
            backgroundColor: "red",
            marginVertical: 30,
            marginRight: 10,
          }}
          onPress={() => {
            newCategory();
          }}
        >
          <Text style={{ padding: 10, color: "white" }}>Thêm</Text>
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
              style={{ fontWeight: "bold", color: color.origin, fontSize: 16, textAlign: "center"}}
            >
              Tên danh mục:
            </Text>
            <TextInput
              style={{
                marginVertical: 12,
                paddingVertical: 0,
                padding: 15,
                height: 40,
                textAlign: "center",
                borderWidth: 1,
                borderColor: 'lightgray',
              }}
              placeholder="Nhập loại hàng"
              value={updateName}
              onChangeText={(text) => setUpdateName(text)}
            />
            <TouchableOpacity
              style={{ backgroundColor: color.origin, marginHorizontal: 100 , marginTop:10}}
              onPress={() => {
                if (updateName === "") {
                  Alert.alert("Thông báo", "Tên danh mục không được để trống");
                }
                else {
                updateCategory();
                }
                closeModal();
              }
              }
            >
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  height: 35,
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>Lưu</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <FlatList
        data={categories}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("SubcategoryManager", {
                subcategories: item.subCategory,
                categoryId: item._id,
              })
              // console.log("id: ", item._id, "name: ", item.name)
            }
            // onPress={() => getSubcategory(item._id)}
            style={[
              styles.list_items,
              { marginVertical: 5, marginHorizontal: 10 },
            ]}
          >
            <View
              style={{
                alignItems: "flex-start",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={{ marginLeft: 2, fontSize: 16 }}> {item.name} </Text>
            </View>
            <View
              style={{
                alignItems: "flex-end",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: "#f0f0f0",
                  padding: 5,
                  marginRight: 5,
                  borderColor: "#d1d1d1",
                  borderWidth: 1,
                  borderRadius: 50,
                }}
                onPress={() => {
                  setUpdateName(item.name);
                  setCategoryId(item._id);
                  toggleModal();
                }}
              >
                <MaterialIcons name="edit" size={25} color="#60698a" />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: "#f0f0f0",
                  padding: 5,
                  marginRight: 5,
                  borderColor: "#d1d1d1",
                  borderWidth: 1,
                  borderRadius: 50,
                }}
                onPress={() => {
                  Alert.alert(
                    "Xác nhận xóa",
                    "Bạn có chắc muốn xóa danh mục này?",
                    [
                      {
                        text: "Hủy",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel",
                      },
                      { text: "Xóa", onPress: () => deleteCategory(item._id) },
                    ]
                  );
                }}
              >
                <MaterialIcons name="remove-circle" size={25} color="#60698a" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  list_items: {
    backgroundColor: "white",
    marginBottom: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderWidth: 1,
    borderColor: "lightgray",
  },
  imgCategory: {
    width: 70,
    height: 70,
  },
});
export default CategoryManagerScreen;
