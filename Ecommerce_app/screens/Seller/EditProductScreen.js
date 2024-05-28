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
import { useIsFocused } from "@react-navigation/native";
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
import { API_BASE_URL } from "../../Localhost";
import axios from "axios";

const EditProductScreen = ({ navigation, route }) => {
  const { product: productData } = route.params;
  const [product, setProduct] = useState(productData);
  const [name, setName] = useState("");
  const [descript, setProductDes] = useState("");
  const [images, setImages] = useState([]);
  const [selectedImagesDB, setSelectedImagesDB] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const { updateUser, user } = useUser();
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [categories, setCategory] = useState([]);
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const [loaiHang, setLoaiHang] = useState("");
  const [soLuong, setSoLuong] = useState("");
  const [giaLoaiHang, setGiaLoaiHang] = useState("");
  const [itemLoaiHang, setItemLoaiHang] = useState([]);
  const [imagesDB, setImagesDB] = useState([]);

  const { idSubcategory, nameSubcategory, idCategory } = route.params || {};
  const [editNameSubcate, setEditNameSubcate] = useState("");
  const [editIDSubcate, setEditIDSubcate] = useState("");
  const [editIDCate, setEditIDCate] = useState("");

  useEffect(() => {
    getCategorytList();
    // getProduct();
    setItemLoaiHang(product.option);
    console.log("productOption", product.option);
  }, []);

  useEffect(() => {
    console.log(nameSubcategory);
  }, [nameSubcategory]);
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
      setImagesDB(product.image);
    }
  }, [product]);

  useEffect(() => {}, [categories]);

  useEffect(() => {
    if (nameSubcategory) {
      setEditIDCate(idCategory);
      setEditIDSubcate(idSubcategory);
      setEditNameSubcate(nameSubcategory);
    } else {
      setEditIDCate(product.idCategory);
      setEditIDSubcate(product.idSubCategory);
    }
  }, [isFocused]);

  useEffect(() => {
    if (!nameSubcategory) {
      getNameSubcate();
    }
  }, [editIDSubcate]);

  useEffect(() => {
    console.log("editNameCate", editNameSubcate);
  }, [editNameSubcate]);

  const showItems = () => {
    // console.log("idproduct", product._id);
    // console.log("name", name);
    // console.log("descript", descript);
    console.log("--------------------");
    // console.log("product", product);
    // console.log("editIDCate", editIDCate);
    // console.log("editIDSubcate", editIDSubcate);
    console.log("itemLoaiHang", itemLoaiHang); // mảng phân loại hàng
    // console.log("nameSubcategory", nameSubcategory);
    // console.log("userId", user._id);
    // console.log("images", imagesDB);
    console.log("--------------------");
  };

  const updateProduct = async () => {
    const inputValues = [name, descript, editIDSubcate];
    if (areInputsFilled(inputValues)) {
      if (itemLoaiHang.length == 0 && !areInputsFilled([price, quantity])) {
        Alert.alert("Thông báo", "Nhập thiếu thông tin");
      } else {
        try {
          setLoading(true);
          // console.log("itemLoaiHang", itemLoaiHang);
          for (let index = 0; index < itemLoaiHang.length; index++) {
            if (itemLoaiHang[index].imageUrl.includes("file:///")) {
              try {
                const formData = new FormData();
                const imageUri = itemLoaiHang[index].imageUrl;
                const imageData = await FileSystem.readAsStringAsync(imageUri, {
                  encoding: FileSystem.EncodingType.Base64,
                });
                formData.append(`images`, {
                  uri: imageUri,
                  type: "image/jpeg",
                  name: `image.jpg`,
                  data: imageData,
                });

                // Gửi yêu cầu POST để tải lên tất cả các hình ảnh
                const itemUploadRes = await axios.post(
                  `${API_BASE_URL}/upload/productImage`,
                  formData,
                  {
                    headers: {
                      "Content-Type": "multipart/form-data",
                    },
                  }
                );
                itemLoaiHang[index].imageUrl = itemUploadRes.data.imageUrls[0];
                
              } catch (error) {
                console.error("Error uploading image:", error);
                // Xử lý lỗi nếu có
              }
            }
          }
          let uploadComplete = true; // Khởi tạo biến cờ
          if (images.length > 0) {
            const formData = new FormData();
            uploadComplete = false; // Nếu có hình ảnh, đặt cờ thành false
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

              // Kiểm tra xem có phải là hình ảnh cuối cùng không
              if (index === images.length - 1) {
                uploadComplete = true;
              }
            }

            // Gửi yêu cầu POST để tải lên tất cả các hình ảnh
            const uploadRes = await axios.post(
              `${API_BASE_URL}/upload/productImage`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );

            // Log kết quả và trả về URL của tất cả các hình ảnh đã tải lên
            // console.log("Images uploaded successfully:", uploadRes.data.imageUrls);
            const imgUrls = uploadRes.data.imageUrls;
            let newImages = imagesDB;
            imgUrls.forEach((url) => {
              newImages.push({ url });
            });
            setImagesDB(newImages);
            // console.log("imagesDB", imagesDB);
            setImages([]);
          }

          if (uploadComplete) {
            // Kiểm tra xem đã upload hoàn tất chưa
            const response = await axios.put(
              `${API_BASE_URL}/seller/updateProduct`,
              {
                productId: product._id,
                name: name,
                description: descript,
                idCategory: editIDCate,
                idSubCategory: editIDSubcate,
                idShop: user._id,
                image: imagesDB,
                option: itemLoaiHang,
              }
            );
            console.log("response", response.data.message);
            setLoading(false);
            Alert.alert("Thông báo", "Đã cập nhật"); //, [
            //   {
            //     text: "OK",
            //     onPress: () => {
            //       navigation.goBack();
            //     },
            //   },
            // ]);
          }
        } catch (error) {
          console.log("loi khi update product", error);
        }
      }
    } else {
      Alert.alert("Cảnh báo", "Nhập thiếu thông tin sản phẩm");
    }
  };
  useEffect(() => {
    console.log("imagesDB", imagesDB);
  }, [imagesDB]);

  useEffect(() => {
    console.log("images", images);
  }, [images]);

  const updatedImagesProduct = async () => {
    images.forEach(async (image) => {
      if (checkImageExists(image) == true) {
        console.log("Image exists on Firebase.");
      } else {
        console.log("Image does not exist on Firebase.");
      }
    });
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

  const handleImageDBPress = (index) => {
    // Khi người dùng nhấn vào ảnh, xóa ảnh khỏi danh sách đã chọn
    const isSelected = selectedImagesDB.includes(index);
    const updatedSelectedImages = isSelected
      ? selectedImagesDB.filter((selectedIndex) => selectedIndex !== index)
      : [...selectedImagesDB, index];

    setSelectedImagesDB(updatedSelectedImages);
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
    if (selectedImagesDB.length > 0) {
      const updatedImagesDB = imagesDB.filter(
        (_, index) => !selectedImagesDB.includes(index)
      );
      setImagesDB(updatedImagesDB);
      setSelectedImagesDB([]);
    }
    if (selectedImages.length > 0) {
      const updatedImages = images.filter(
        (_, index) => !selectedImages.includes(index)
      );
      setImages(updatedImages);
      setSelectedImages([]);
    }
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
      setLoaiHangImg(newImages[0]);
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
      const newItem = {
        imageUrl: loaiHangImg,
        name: loaiHang,
        price: giaLoaiHang,
        quantity: soLuong,
      };

      if (editIndex !== null) {
        // Nếu đang chỉnh sửa, cập nhật item tại editIndex
        const updatedItems = [...itemLoaiHang];
        newItem._id = updatedItems[editIndex]._id;
        updatedItems[editIndex] = newItem;
        if (soLuong < 0) {
          Alert.alert("Thông báo", "Số lượng sản phẩm phải lớn hơn 0");
        }
        if (soLuong >= itemLoaiHang[editIndex].quantity) {
          setItemLoaiHang(updatedItems);
          setEditIndex(null);
        } else {
          Alert.alert(
            "Thông báo",
            "Số lượng mặt hàng phải lớn hơn hoặc bằng số lượng hiện có"
          );
        }
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
          <TouchableOpacity onPress={handleDelete}>
            <Text style={{ color: "red" }}>Xóa ảnh</Text>
          </TouchableOpacity>
        </View>
        <View style={{ width: "90%", flexDirection: "row", flexWrap: "wrap" }}>
          {imagesDB.map((image, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleImageDBPress(index)}
              style={{
                borderColor: selectedImagesDB.includes(index)
                  ? "red"
                  : "lightgray",
                borderWidth: selectedImagesDB.includes(index) ? 1 : 1,
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
          <TouchableOpacity onPress={pickImages}>
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
          </TouchableOpacity>
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
          <Text style={{ marginLeft: 10 }}> Danh mục </Text>
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
      <View
        style={{
          backgroundColor: "white",
          marginBottom: 5,
          paddingBottom: 5,
          backgroundColor: "#f2f2f2",
        }}
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
              Thêm phân loại mặt hàng
            </Text>
          </View>
        </TouchableOpacity>

        {itemLoaiHang.map((item, index) => (
          <View
            key={index}
            style={[
              styles.itemContainer,
              {
                flexDirection: "row",
                marginVertical: 5,
                marginHorizontal: 5,
                padding: 10,
                backgroundColor: "white",
              },
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
              {/* <TouchableOpacity onPress={() => deleteLoaiHang(index)}>
                <Feather name="trash-2" size={20} />
              </TouchableOpacity> */}
            </View>
          </View>
        ))}
      </View>
      {/* Button Thêm */}
      <TouchableOpacity
        style={{
          backgroundColor: color.origin,
          marginHorizontal: 100,
          marginBottom: 20,
          marginTop: 10,
        }}
        onPress={() => {
          updateProduct();
          // showItems()
        }}
      >
        <View
          style={{ alignItems: "center", justifyContent: "center", height: 35 }}
        >
          <Text style={{ color: "white" }}>Lưu thay đổi</Text>
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
