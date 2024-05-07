import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useUser } from "../../UserContext";
import color from "../../components/color";

const ShopCategoryScreen = () => {
  const { user } = useUser();
  const idUser = user?.user?.uid;
  const [shopCategory, setShopCategory] = useState([]);
  const [name, setName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  useEffect(() => {
    getShopCategory();
  }, []);

  const getShopCategory = async () => {
    const querySnapshot = await getDocs(
      collection(db, "user", idUser, "categoryShop")
    );
    let temp = [];
    querySnapshot.forEach((doc) => {
      temp.push({ id: doc.id, ...doc.data() });
    });
    setShopCategory(temp);
  };

  const addCategory = async () => {
    if (name === "") {
      Alert.alert("Thông báo", "Chưa nhập tên danh mục");      
    }else{
    try {
      await addDoc(collection(db, "user", idUser, "categoryShop"), {
        name: name,
      });
      setName(""); // Reset input field after adding category
      getShopCategory(); // Refresh the category list
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
  };

  const updateCategory = async () => {
    if (!selectedCategoryId) {
      return; // No category selected to update
    }

    try {
      await updateDoc(
        doc(db, "user", idUser, "categoryShop", selectedCategoryId),
        {
          name: name,
        }
      );
      setName(""); // Reset input field after updating category
      setSelectedCategoryId(null); // Reset selected category
      getShopCategory(); // Refresh the category list
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      await deleteDoc(doc(db, "user", idUser, "categoryShop", categoryId));
      getShopCategory(); // Refresh the category list
    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  };

  const handleEditCategory = (categoryId, categoryName) => {
    setSelectedCategoryId(categoryId);
    setName(categoryName);
  };

  const confirmDeleteCategory = (categoryId) => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc chắn muốn xóa danh mục này?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        { text: "Xóa", onPress: () => deleteCategory(categoryId) },
      ],
      { cancelable: false }
    );
  };

  return (
    <ScrollView>
      <View style={{ backgroundColor: "white", margin: 10, padding: 5 }}>
        <TextInput
          placeholder="Nhập tên danh mục"
          value={name}
          onChangeText={setName}
        />
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        <TouchableOpacity
          onPress={selectedCategoryId ? updateCategory : addCategory}
          style={{
            backgroundColor: color.origin,
            alignSelf: "center",
            padding: 10,
          }}
        >
          <Text style={{ color: "white" }}>
            {selectedCategoryId ? "Cập nhật" : "Thêm danh mục"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setName("");
            setSelectedCategoryId(null);
          }}
          style={{
            backgroundColor: color.origin,
            alignSelf: "center",
            padding: 10,
          }}
        >
          <Text style={{ color: "white" }}>Hủy</Text>
        </TouchableOpacity>
      </View>
      <View style={{ margin: 10, backgroundColor: "white", padding: 10 }}>
        <Text style={{ fontWeight: "bold", textAlign: "center" }}>
          Danh sách danh mục
        </Text>
        {shopCategory.map((item, key) => (
          <View
            key={key}
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              borderTopColor: "lightgray",
              borderTopWidth: 1,
              marginVertical: 5,
              paddingVertical: 5,
            }}
          >
            <Text> {item.name}</Text>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                onPress={() => handleEditCategory(item.id, item.name)}
              >
                <Text style={{ marginRight: 10 }}>Sửa</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => confirmDeleteCategory(item.id)}>
                <Text style={{ color: "red" }}>Xóa</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default ShopCategoryScreen;

const styles = StyleSheet.create({});
