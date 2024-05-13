import React, { useState, useEffect } from "react";
import * as FileSystem from "expo-file-system";
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
import {
  Feather,
  SimpleLineIcons,
  Entypo,
  AntDesign,
  Ionicons,
  Octicons,
} from "@expo/vector-icons";
import color from "../../components/color";
import { API_BASE_URL } from "../../Localhost";
import axios from "axios";
import { useUser } from "../../UserContext";

const AddProductScreen = ({ navigation, route }) => {
  const [name, onchangeProductName] = useState("");
  const [descript, onchangeProductDes] = useState("");
  const [categories, setCategory] = useState([]);
  const { idSubcategory, nameSubcategory, idCategory } = route.params || {};
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [urlImage, setUrlImage] = useState([]);
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const [loaiHang, setLoaiHang] = useState("");
  const [soLuong, setSoLuong] = useState("");
  const [giaLoaiHang, setGiaLoaiHang] = useState("");
  const [loaiHangImg, setLoaiHangImg] = useState("");
  const [itemLoaiHang, setItemLoaiHang] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [totalQuantity, setTotalQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const { updateUser, user } = useUser();

  useEffect(() => {
    getCategorytList();
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

  // const uploadImage = async (images) => {
  //   try {
  //     // Đọc nội dung của tệp
  //     // const imageData = await FileSystem.readAsStringAsync(imageUri, {
  //     //   encoding: FileSystem.EncodingType.Base64,
  //     // });

  //     // // Tạo FormData chứa dữ liệu hình ảnh
  //     // const formData = new FormData();
  //     // formData.append('image', {
  //     //   uri: imageUri,
  //     //   type: 'image/jpeg',
  //     //   name: 'image.jpg',
  //     //   data: imageData,
  //     // });

  //     // // Gửi yêu cầu POST để tải lên hình ảnh
  //     // const response = await axios.post(`${API_BASE_URL}/upload/productImage`, formData, {
  //     //   headers: {
  //     //     'Content-Type': 'multipart/form-data',
  //     //   },
  //     // });

  //     // // Log kết quả và trả về URL của ảnh đã tải lên
  //     // console.log('Image uploaded successfully:', response.data.imageUrl);
  //     // return response.data.imageUrl;
  //   } catch (error) {
  //     // Xử lý lỗi nếu có
  //     console.error('Error uploading image:', error);
  //     throw error;
  //   }
  // };

  // //show id category id subcategory
  const showitems = () => {
    console.log("itemloaihang", itemLoaiHang);
  };

  const uploadImages = async (images) => {
    try {
      // Tạo FormData chứa tất cả các hình ảnh
      const formData = new FormData();
      for (let index = 0; index < images.length; index++) {
        const imageUri = images[index];
        const imageData = await FileSystem.readAsStringAsync(imageUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        formData.append(`images`, {
          uri: imageUri,
          type: "image/jpeg",
          name: `image_${index + 1}.jpg`,
          data: imageData,
        });
      }

      // Gửi yêu cầu POST để tải lên tất cả các hình ảnh
      const response = await axios.post(
        `${API_BASE_URL}/upload/productImage`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Log kết quả và trả về URL của tất cả các hình ảnh đã tải lên
      console.log("Images uploaded successfully:", response.data);
      return response.data;
    } catch (error) {
      // Xử lý lỗi nếu có
      console.error("Error uploading images:", error);
      throw error;
    }
  };

  const pickImages = async () => {
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

  const closeModal = () => {
    setLoaiHangImg("");
    setLoaiHang("");
    setSoLuong("");
    setGiaLoaiHang("");
    toggleModal();
  };

  // Add thông tin phân loại hàng vào mảng itemLoaiHang
  const pickLoaiHangImg = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      base64: true,
      quality: 1,
    });

    if (!result.canceled) {
      const newImages = result.assets.map((asset) => asset.uri);
      setLoaiHangImg(newImages[0]);
    }
  };
  useEffect(() => {
    // Log giá trị mới của loaiHangImg sau mỗi lần cập nhật
    console.log("loaiHangImg updated:", loaiHangImg);
  }, [loaiHangImg]);
  const addLoaiHang = () => {
    // Kiểm tra xem cả hai thẻ input đã được nhập chưa
    if (loaiHangImg !== "" && loaiHang && soLuong > 0 && giaLoaiHang > 0) {
      const newItem = {
        imageUrl: loaiHangImg,
        name: loaiHang,
        price: giaLoaiHang,
        quantity: soLuong,
      };
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
      console.log("itemLoaiHang", itemLoaiHang);
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

  const getMaxGiaLoaiHang = (array) => {
    if (array.length === 0) {
      return null;
    }
    return Math.max(...array.map((item) => parseFloat(item.price)));
  };

  // Hàm kiểm tra giá trị tối thiểu
  const getMinGiaLoaiHang = (array) => {
    if (array.length === 0) {
      return null;
    }
    return Math.min(...array.map((item) => parseFloat(item.price)));
  };

  const getTotalQty = (array) => {
    const totalQuantity = array.reduce((acc, item) => {
      return acc + parseInt(item.quantity, 10);
    }, 0);

    return totalQuantity;
  };

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
    console.log("item length", itemLoaiHang.length, "qty", totalQuantity);
  }, [itemLoaiHang, minPrice, maxPrice, totalQuantity]);

  const handleQuantityChange = (text) => {
    // Loại bỏ các ký tự không phải số
    const numericValue = text.replace(/[^0-9]/g, "");
    setQuantity(numericValue);
  };

  useEffect(() => {
    console.log("urlImage", urlImage);
  }, [urlImage]);

  // useEffect(() => {
  //   console.log("itemloaiHang", itemLoaiHang)
  // }, [itemLoaiHang])

  const saveProduct = async () => {
    try {
      setLoading(true);
      const urlImages = await uploadImages(images);
      const urlProduct = urlImages.imageUrls.map((url) => ({ url }));
      //upload urlImages in itemLoaiHang
      const uploadedImages = await uploadImages(
        itemLoaiHang.map((item) => item.imageUrl)
      );
      // Cập nhật mảng itemLoaiHang với các url ảnh đã upload
      const updatedItemLoaiHang = itemLoaiHang.map((item, index) => ({
        ...item,
        imageUrl: uploadedImages.imageUrls[index],
      }));
      const response = await axios.post(`${API_BASE_URL}/seller/addProduct`, {
        name: name,
        description: descript,
        idCategory: idCategory,
        idCategoryShop: idCategory,
        idSubCategory: idSubcategory,
        idShop: user._id,
        image: urlProduct,
        option: updatedItemLoaiHang,
      });
      console.log("response", response);
      if (response.status === 200) {
        setLoading(false);
        Alert.alert("Thông báo", "Thêm sản phẩm thành công", [
          {
            text: "OK",
            onPress: () => {
              //go back
              navigation.goBack();
            },
          },
        ]);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error saving product", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
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
          <TouchableOpacity onPress={handleDelete}>
            <Text style={{ color: "red" }}>Xóa ảnh</Text>
          </TouchableOpacity>
        </View>
        <View style={{ width: "90%", flexDirection: "row", flexWrap: "wrap" }}>
          <TouchableOpacity
            // style={{ backgroundColor: "white" }}
            onPress={pickImages}
          >
            <View
              style={{
                margin: 3,
                padding: 5,
                borderColor: "lightgray",
                backgroundColor: "white",
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
          </TouchableOpacity>
          {images.map((image, index) => (
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
                source={{ uri: image }}
                style={{
                  width: 200 / 3,
                  height: 200 / 3,
                }}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </View>
        <Text style={{ paddingVertical: 5 }}>Thêm tối đa 10 ảnh</Text>
      </View>

      {/* Tên sản phẩm */}
      <View style={styles.name_item}>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ marginLeft: 10, fontSize: 16 }}>Tên sản phẩm</Text>
          <Text style={{ color: "red" }}>*</Text>
        </View>
        <TextInput
          style={styles.input}
          onChangeText={onchangeProductName}
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
          onChangeText={onchangeProductDes}
          multiline
          placeholder="Nhập mô tả sản phẩm"
          value={descript}
        />
      </View>

      {/* Danh mục */}
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("SelectCategory", { categories: categories })
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
          <Text style={{ marginLeft: 10 }}> Danh mục</Text>
        </View>
        <View
          style={{
            alignItems: "flex-end",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={{ marginLeft: 10, fontWeight: "bold", fontSize: 18 }}>
            {" "}
            {nameSubcategory}
          </Text>
          <SimpleLineIcons
            marginLeft={15}
            name="arrow-right"
            size={10}
            color="#60698a"
          />
        </View>
      </TouchableOpacity>

      {/* Thuộc tính sản phẩm */}
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
                paddingVertical: 5,
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
                {/* {loaiHangImg.map((image, index) => ( */}
                <Image
                  // key={index}
                  style={{
                    width: 100,
                    height: 100,
                    alignSelf: "center",
                    marginVertical: 5,
                  }}
                  source={{ uri: loaiHangImg }}
                />
                {/* ))} */}
              </>
            )}
            <Text style={{ fontWeight: "bold", color: color.origin }}>
              Tên phân loại:
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
              value={soLuong}
              onChangeText={(text) => setSoLuong(text)}
            />
            <Text style={{ fontWeight: "bold", color: color.origin }}>
              Giá:
            </Text>
            <TextInput
              style={styles.input_phanloaihang}
              keyboardType="numeric"
              placeholder="Nhập giá"
              value={giaLoaiHang}
              onChangeText={(text) => setGiaLoaiHang(text)}
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
        style={{ backgroundColor: "white", marginBottom: 5, paddingBottom: 5 ,
        backgroundColor: "#f2f2f2",}}
      >
        <TouchableOpacity
          style={[
            styles.list_items,
            {
              marginVertical: 10,
              marginHorizontal: 20,
              borderWidth: 1,
              borderColor: "lightgray",
              // paddingRight: 20,
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
          onPress={toggleModal}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name="duplicate-outline"
              size={25}
              marginLeft={10}
              color={color.origin}
            />
            <Text style={{ marginLeft: 10, color: color.origin }}>
              Thêm phân loại hàng
            </Text>
          </View>
        </TouchableOpacity>
        
        {itemLoaiHang.map((item, index) => (
          <View
            key={index}
            style={
              {
                flexDirection: "row",
                marginVertical: 5,
                marginHorizontal: 5,
                padding: 10,
                backgroundColor: "white",
              }}
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
              <Text>Loại: {item.name}</Text>
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
      {/* Gia */}
      <View
        style={[
          styles.list_items,
          {
            alignItems: "center",
            backgroundColor: "white",
          },
        ]}
      >
        <View
          style={{
            alignItems: "flex-start",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Ionicons
            name="pricetag-outline"
            size={25}
            marginLeft={10}
            color="gray"
          />
          <Text style={{ marginLeft: 10 }}> Giá </Text>
        </View>
        {itemLoaiHang.length > 1 ? (
          <>
            <Text
              style={{ marginRight: 5, textAlign: "right" }}
            >{`${minPrice}đ-${maxPrice}đ`}</Text>
          </>
        ) : itemLoaiHang.length == 1 ? (
          <>
            <Text
              style={{ marginRight: 5, textAlign: "right" }}
            >{`${minPrice}đ`}</Text>
          </>
        ) : (
          <>
            <TextInput
              style={{ marginRight: 5, textAlign: "right" }}
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
              editable={false}
            />
          </>
        )}
      </View>
      {/* So luong kho */}
      <View
        style={[
          styles.list_items,
          {
            alignItems: "center",
            backgroundColor: "white",
          },
        ]}
      >
        <View
          style={{
            alignItems: "flex-start",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Octicons name="stack" size={25} marginLeft={10} color="gray" />
          <Text style={{ marginLeft: 10 }}> Tổng số lượng sản phẩm</Text>
        </View>
        {itemLoaiHang.length > 0 ? (
          <>
            <Text
              style={{ marginRight: 5, textAlign: "right" }}
            >{`${totalQuantity}`}</Text>
          </>
        ) : (
          <>
            <TextInput
              style={{ marginRight: 5, textAlign: "right" }}
              keyboardType="numeric"
              value={quantity}
              onChangeText={handleQuantityChange}
              editable={itemLoaiHang.length > 0 ? false : true}
            />
          </>
        )}
      </View>
      {/* Button Thêm */}
      <TouchableOpacity
        style={{ backgroundColor: color.origin, marginHorizontal: 90, paddingVertical:3, 
         }}
        // press upload image
        onPress={() => {
          // uploadImages(images).then((response) => {
          // setUrlImage(response);
          saveProduct();
          // });
        }}
      >
        <View
          style={{ alignItems: "center", justifyContent: "center", height: 35 }}
        >
          <Text style={{ color: "white",fontSize:16}}>Thêm vào cửa hàng</Text>
        </View>
      </TouchableOpacity>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </ScrollView>
  );
};

export default AddProductScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
    fontSize: 18,
    fontWeight: "bold",
  },
  input_phanloaihang: {
    marginVertical: 2,
    paddingVertical: 0,
    paddingHorizontal: 5,
    fontSize: 16,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
});
