import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Button,
  Image,
  View,
  TextInput,
  Text,
  Alert,
  ScrollView,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import color from "../../components/color";
import {
  Feather,
  SimpleLineIcons,
  Entypo,
  AntDesign,
  Ionicons,
  Octicons,
} from "@expo/vector-icons";
import { useUser } from "../../UserContext";
import { useIsFocused } from "@react-navigation/native";
import { API_BASE_URL } from "../../Localhost";
import axios from "axios";

const EditProductScreen = ({ navigation, route }) => {
  const { product: product } = route.params;
  const [name, setName] = useState("");
  const [descript, setProductDes] = useState("");
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [urlImage, setUrlImage] = useState([]);
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const { user } = useUser();
  const idUser = user?.user?.uid;
  const [categories, setCategory] = useState([]);
  const { idSubcategory, nameSubcategory, idCategory } = route.params || {};
  const [editNameSubcate, setEditNameSubcate] = useState("");
  const [editIDSubcate, setEditIDSubcate] = useState("");
  const [editIDCate, setEditIDCate] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const [loaiHang, setLoaiHang] = useState("");
  const [soLuong, setSoLuong] = useState("");
  const [giaLoaiHang, setGiaLoaiHang] = useState("");
  const [itemLoaiHang, setItemLoaiHang] = useState([]);

  useEffect(() => {
    getCategorytList();
    // getProduct();
    setItemLoaiHang(product.option);
    console.log("product", product.option);
  }, []);

  const getCategorytList = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/showCategory`);
      setCategory(
        response.data.data.map((item) => ({
          idCategory: item._id,
          nameCategory: item.name,
        }))
      );
    } catch (error) {
      console.error("Error fetching category list", error);
    }
  };

  const getNameSubcate = () => {
    axios
      .get(`${API_BASE_URL}/admin/Category/${product.idCategory}`)
      .then(function (response) {
        response.data.data.subCategory.forEach((item) => {
          if (item._id === product.idSubCategory) {
            setEditNameSubcate(item.name);
            // console.log(" item.name");
          }
        });
      })
      .catch(function (error) {
        console.log(error);
      });
    // console.log(idCategory)
  };
  //sub
  const areInputsFilled = (inputValues) => {
    for (const value of inputValues) {
      if (!value || value.trim() === "") {
        return false; // Nếu một trong các thẻ input chưa nhập, trả về false
      }
    }
    return true; // Nếu tất cả các thẻ input đã được nhập, trả về true
  };

  useEffect(() => {
    if (product) {
      setName(product.name);
      setProductDes(product.description);
    }
  }, [product]);

  useEffect(() => {
    setEditNameSubcate(nameSubcategory);
  }, [nameSubcategory]);

  useEffect(() => {}, [categories]);

  const isFocused = useIsFocused();
  useEffect(() => {
    setEditIDCate(idCategory);
    setEditIDSubcate(idSubcategory);
  }, [isFocused]);
  useEffect(() => {
    getNameSubcate();
  }, [editIDSubcate]);
  useEffect(() => {}, [editNameSubcate]);

  const updateProduct = async () => {
    const inputValues = [name, descript, editIDSubcate];
    if (areInputsFilled(inputValues)) {
      if (itemLoaiHang.length == 0 && !areInputsFilled([price, quantity])) {
        Alert.alert("Thông báo", "Nhập thiếu thông tin");
      } else {
        try {
          // setLoading(true);
          const productRef = doc(db, "product", idProduct);
          await updateDoc(productRef, {
            // name: name,
            // description: descript,
            idCategory: editIDCate,
            idSubCategory: editIDSubcate,
            // discount: "",
          });
          setLoading(false);
          Alert.alert("Thông báo", "Đã lưu", [
            {
              text: "OK",
              onPress: () => {
                navigation.navigate("ListProducts");
              },
            },
          ]);
        } catch (error) {
          console.log("loi khi update product", error);
        }
      }
    } else {
      Alert.alert("Cảnh báo", "Nhập thiếu thông tin sản phẩm");
    }
  };

  const updatedImagesProduct = async () => {
    images.forEach(async (image) => {
      if (checkImageExists(image) == true) {
        console.log("Image exists on Firebase.");
      } else {
        console.log("Image does not exist on Firebase.");
      }
    });
  };

  const pickImages1 = async () => {
    if (images.length < 10) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsMultipleSelection: true,
        aspect: [4, 3],
        base64: true,
        quality: 1,
      });

      if (!result.canceled) {
        const newImages = result.assets.map((asset) => asset.uri);
        const totalImages = [...images, ...newImages];

        if (totalImages.length > 10) {
          Alert.alert("Thông báo", "Chỉ được chọn tối đa 10 ảnh");
        } else {
          setImages(totalImages);
        }
      }
    } else {
      Alert.alert("Thông báo", "Đã đủ 10 ảnh");
    }
  };

  const addOption = async (prdID) => {
    try {
      itemLoaiHang.forEach(async (item) => {
        const loaiHangUrl = await uploadImage(item.loaiHangImg);
        loaiHangUrl.forEach(async (url) => {
          await addDoc(collection(db, "product", prdID, "option"), {
            name: item.loaiHang,
            price: item.giaLoaiHang,
            quantity: item.soLuong,
            image: url,
          });
        });
      });
      setItemLoaiHang([]);
    } catch (e) {
      console.log("Loi khi them phan loai hang", e);
    }
  };

  const handleImagePress = (index) => {
    // Khi người dùng nhấn vào ảnh, xóa ảnh khỏi danh sách đã chọn
    const isSelected = selectedImages.includes(index);
    const updatedSelectedImages = isSelected
      ? selectedImages.filter((selectedIndex) => selectedIndex !== index)
      : [...selectedImages, index];

    setSelectedImages(updatedSelectedImages);
  };

  const handleDelete = () => {
    // Xóa các ảnh đã chọn khỏi danh sách images
    const updatedImages = images.filter(
      (_, index) => !selectedImages.includes(index)
    );
    setImages(updatedImages);
    setSelectedImages([]);
  };

  // Add thông tin phân loại hàng vào mảng
  const [loaiHangImg, setLoaiHangImg] = useState("");

  const pickLoaiHangImg = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      base64: true,
      quality: 1,
    });

    if (!result.canceled) {
      const newImages = result.assets.map((asset) => asset.uri);
      setLoaiHangImg(newImages);
    }
  };
  useEffect(() => {
    // Log giá trị mới của loaiHangImg sau mỗi lần cập nhật
    // console.log("loaiHangImg updated:", loaiHangImg);
  }, [loaiHangImg]);
  const getMaxGiaLoaiHang = (array) => {
    if (array.length === 0) {
      return null;
    }
    return Math.max(...array.map((item) => parseFloat(item.giaLoaiHang)));
  };

  // Hàm kiểm tra giá trị tối thiểu
  const getMinGiaLoaiHang = (array) => {
    if (array.length === 0) {
      return null;
    }
    return Math.min(...array.map((item) => parseFloat(item.giaLoaiHang)));
  };

  const getTotalQty = (array) => {
    const totalQuantity = array.reduce((acc, item) => {
      return acc + parseInt(item.soLuong, 10);
    }, 0);

    return totalQuantity;
  };
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [totalQuantity, setTotalQuantity] = useState("");
  useEffect(() => {
    // Log giá trị mới của loaiHangImg sau mỗi lần cập nhật
    if (itemLoaiHang.length > 0) {
      if (itemLoaiHang.length < 2) {
        setMinPrice(getMinGiaLoaiHang(itemLoaiHang));
      } else {
        setMinPrice(getMinGiaLoaiHang(itemLoaiHang));
        setMaxPrice(getMaxGiaLoaiHang(itemLoaiHang));
      }
      setTotalQuantity(getTotalQty(itemLoaiHang));
    } else {
      setPrice("");
    }
    // console.log("item length", itemLoaiHang.length, "qty", totalQuantity);
  }, [itemLoaiHang, minPrice, maxPrice, totalQuantity]);
  const addLoaiHang = () => {
    // Kiểm tra xem cả hai thẻ input đã được nhập chưa
    if (loaiHangImg !== "" && loaiHang && soLuong > 0 && giaLoaiHang > 0) {
      const newItem = { loaiHangImg, loaiHang, soLuong, giaLoaiHang };

      if (editIndex !== null) {
        // Nếu đang chỉnh sửa, cập nhật item tại editIndex
        const updatedItems = [...itemLoaiHang];
        updatedItems[editIndex] = newItem;
        setItemLoaiHang(updatedItems);
        setEditIndex(null);
      } else {
        // Nếu không, thêm một item mới
        setItemLoaiHang([...itemLoaiHang, newItem]);
      }

      // Đặt giá trị TextInput về rỗng
      setLoaiHang("");
      setSoLuong("");
      setGiaLoaiHang("");
      setLoaiHangImg("");
      // Đóng cửa sổ pop-up
      toggleModal();
    } else {
      alert("Vui lòng nhập đầy đủ thông tin");
    }
  };

  const [editIndex, setEditIndex] = useState(null);
  const editLoaiHang = (index) => {
    const selectedItem = itemLoaiHang[index];
    setLoaiHangImg(selectedItem.imageUrl);
    setLoaiHang(selectedItem.name);
    setSoLuong(selectedItem.quantity);
    setGiaLoaiHang(selectedItem.price);
    setEditIndex(index);
    // Mở cửa sổ pop-up để chỉnh sửa giá trị
    toggleModal();
  };

  const deleteLoaiHang = (index) => {
    // Xóa item tại vị trí index
    setItemLoaiHang(itemLoaiHang.filter((item, i) => i !== index));
  };

  const handleQuantityChange = (text) => {
    // Loại bỏ các ký tự không phải số
    const numericValue = text.replace(/[^0-9]/g, "");
    if (numericValue <= 10000) {
      setQuantity(numericValue);
    } else {
      Alert.alert("Thông báo", "Số lượng sản phẩm không vượt quá 10.000");
    }
  };
  const closeModal = () => {
    setLoaiHangImg("");
    setLoaiHang("");
    setSoLuong("");
    setGiaLoaiHang("");
    toggleModal();
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      {/* hình ảnh */}
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <View
          style={[
            styles.name_item,
            {
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              paddingHorizontal: 20,
              paddingVertical: 10,
            },
          ]}
        >
          <Text style={{}}>Hình ảnh sản phẩm</Text>
          {/* <TouchableOpacity onPress={handleDelete}>
            <Text style={{ color: "red" }}>Xóa ảnh</Text>
          </TouchableOpacity> */}
        </View>
        <View style={{ width: "90%", flexDirection: "row", flexWrap: "wrap" }}>
          {product.image.map((image, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleImagePress(index)}
              style={{
                borderColor: selectedImages.includes(index)
                  ? "red"
                  : "lightgray",
                borderWidth: selectedImages.includes(index) ? 1 : 1,
                margin: 3,
                padding: 5,
              }}
            >
              <Image
                source={{ uri: image.url }}
                style={{
                  width: 200 / 3,
                  height: 200 / 3,
                }}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
          {/* <TouchableOpacity onPress={pickImages}>
            <View
              style={{
                margin: 3,
                padding: 5,
                borderColor: "black",
                borderWidth: 1,
                borderStyle: "dashed",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "red",
                  textAlign: "center",
                  textAlignVertical: "center",
                  width: 200 / 3,
                  height: 200 / 3,
                }}
              >
                +Thêm ảnh
              </Text>
            </View>
          </TouchableOpacity> */}
        </View>
        {/* <Text style={{ paddingVertical: 5 }}>Thêm tối đa 10 ảnh</Text> */}
      </View>
      {/* Tên sản phẩm */}
      <View style={styles.name_item}>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ marginLeft: 10, fontSize: 16 }}>Tên sản phẩm</Text>
          <Text style={{ color: "red" }}>*</Text>
        </View>
        <TextInput
          style={styles.input}
          onChangeText={setName}
          placeholder="Nhập tên sản phẩm"
          value={name}
        />
      </View>
      {/* Mô tả */}
      <View style={styles.name_item}>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ marginLeft: 10, fontSize: 16 }}>Mô tả</Text>
          <Text style={{ color: "red" }}>*</Text>
        </View>
        <TextInput
          style={[styles.input]}
          onChangeText={setProductDes}
          multiline
          placeholder="Nhập mô tả sản phẩm"
          value={descript}
        />
      </View>

      {/* Danh muc */}
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("SelectCategory", {
            categories: categories,
            isUpdate: true,
          })
        }
        style={[styles.list_items, { marginVertical: 5 }]}
      >
        <View
          style={{
            alignItems: "flex-start",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Ionicons name="list" size={25} marginLeft={10} color="gray" />
          <Text style={{ marginLeft: 10 }}> Ngành hàng </Text>
        </View>
        <View
          style={{
            alignItems: "flex-end",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={{ marginLeft: 10, fontWeight: "bold" }}>
            {" "}
            {editNameSubcate}
          </Text>
          {/* <SimpleLineIcons
            marginLeft={15}
            name="arrow-right"
            size={10}
            color="#60698a"
          /> */}
        </View>
      </TouchableOpacity>

      {/* Phân loại hàng */}
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
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: color.origin,
                alignSelf: "center",
                width: "30%",
              }}
              onPress={pickLoaiHangImg}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                  color: color.origin,
                }}
              >
                Chọn ảnh
              </Text>
            </TouchableOpacity>
            {loaiHangImg === "" ? (
              <></>
            ) : (
              <>
                <Image
                  style={{
                    width: 100,
                    height: 100,
                    alignSelf: "center",
                    marginVertical: 5,
                  }}
                  source={{ uri: loaiHangImg }}
                />
              </>
            )}
            <Text style={{ fontWeight: "bold", color: color.origin }}>
              Loại hàng:
            </Text>
            <TextInput
              style={styles.input_phanloaihang}
              placeholder="Nhập loại hàng"
              value={loaiHang}
              onChangeText={(text) => setLoaiHang(text)}
            />
            <Text style={{ fontWeight: "bold", color: color.origin }}>
              Số lượng:
            </Text>
            <TextInput
              style={styles.input_phanloaihang}
              keyboardType="numeric"
              placeholder="Nhập số lượng"
              value={soLuong.toString()}
              onChangeText={setSoLuong}
            />
            <Text style={{ fontWeight: "bold", color: color.origin }}>
              Giá:
            </Text>
            <TextInput
              style={styles.input_phanloaihang}
              keyboardType="numeric"
              placeholder="Nhập giá"
              value={giaLoaiHang.toString()}
              onChangeText={setGiaLoaiHang}
            />
            <TouchableOpacity
              style={{ backgroundColor: color.origin, marginHorizontal: 100 }}
              onPress={addLoaiHang}
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
      {/* <Button title="items" onPress={showitems} /> */}
      <View
        style={{ backgroundColor: "white", marginBottom: 5, paddingBottom: 5 }}
      >
        <View
          style={[
            styles.list_items,
            { marginBottom: 0, paddingRight: 20, alignItems: "center" },
          ]}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name="duplicate-outline"
              size={25}
              marginLeft={10}
              color="gray"
            />
            <Text style={{ marginLeft: 10 }}>Phân loại hàng</Text>
          </View>

          <TouchableOpacity
            style={{ alignContent: "flex-end" }}
            onPress={toggleModal}
          >
            <Ionicons
              style={{ alignSelf: "center" }}
              name="add-circle-outline"
              size={25}
              color={color.origin}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            height: 1,
            width: "90%",
            alignSelf: "center",
            backgroundColor: "lightgray",
          }}
        ></View>

        {itemLoaiHang.map((item, index) => (
          <View
            key={index}
            style={[
              styles.itemContainer,
              { flexDirection: "row", marginVertical: 5, marginHorizontal: 5 },
            ]}
          >
            {/* Cột bên trái */}
            {/* {item.imageUrl.map((image, index) => ( */}
            <Image
              key={index}
              source={{ uri: item.imageUrl }}
              style={{ height: 50, width: 50 }}
            />
            {/* ))} */}

            {/* Cột giữa */}
            <View
              style={{ flex: 1, paddingHorizontal: 10, alignSelf: "center" }}
            >
              <Text>Tên phân loại: {item.name}</Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text>Số lượng: {item.quantity}</Text>
                <Text style={{ alignSelf: "flex-end", color: "red" }}>
                  Giá: {item.price}đ
                </Text>
              </View>
            </View>

            {/* Cột bên phải */}
            <View
              style={{ alignSelf: "center", justifyContent: "space-between" }}
            >
              <TouchableOpacity
                onPress={() => editLoaiHang(index)}
                style={{ marginBottom: 5 }}
              >
                <Feather name="edit" size={20} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteLoaiHang(index)}>
                <Feather name="trash-2" size={20} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
      {/* Button Thêm */}
      {/* <TouchableOpacity
        style={{
          backgroundColor: color.origin,
          marginHorizontal: 100,
          marginBottom: 20,
        }}
        onPress={updateProduct}
      >
        <View
          style={{ alignItems: "center", justifyContent: "center", height: 35 }}
        >
          <Text style={{ color: "white" }}>Lưu thay đổi</Text>
        </View>
      </TouchableOpacity> */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </ScrollView>
  );
};

export default EditProductScreen;

const styles = StyleSheet.create({
  name_item: {
    marginVertical: 1,
    width: "100%",
    padding: 10,
    justifyContent: "space-between",
    backgroundColor: "white",
  },
  list_items: {
    backgroundColor: "white",
    marginBottom: 5,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  input: {
    marginLeft: 20,
    marginTop: 5,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  input_phanloaihang: {
    marginVertical: 2,
    paddingVertical: 0,
    paddingHorizontal: 5,
  },
});
