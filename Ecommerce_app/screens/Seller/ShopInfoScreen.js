import {
    StyleSheet,
    Text,
    TextInput,
    View,
    Image,
    Alert,
    TouchableOpacity,
    ActivityIndicator,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import { Button } from "react-native-elements";
  import { FontAwesome5 } from "@expo/vector-icons";
  import * as ImagePicker from "expo-image-picker";
import color from "../../components/color";
import { useUser } from "../../UserContext";

const ShopInfoScreen = ({navigation, route}) => {
    const { user } = useUser();
    const idUser = user?.user?.uid;
    const [avatar, setAvatar] = useState("");
    const [seller, setSeller] = useState(null);
    const [shopName, setShopName] = useState("");
    const [address, setAddress] = useState("");
    const [shopDescript, setShopDescript] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [loading, setLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false)
  
    const db = getFirestore(app);
  
    useEffect(() => {
      console.log("iduser", idUser)
      getShopInfo();
    }, []);
  
  useEffect(() => {
    if (seller) {
      setShopName(seller.shopName);
      setAddress(seller.address);
      setShopDescript(seller.shopDescript);
      setPhoneNumber(seller.phone);
      setAvatar(seller.photo);
      //avatar gg = https://lh3.googleusercontent.com/a/ACg8ocJqThobPEndy9LkFEa0Dafe3pgnkZlr41UjDT3bKIUb_oU=s96-c
    }
  }, [seller]);
    // Update state inside the useEffect when data is fetched

  
    useEffect(() => {
      // Log giá trị mới của loaiHangImg sau mỗi lần cập nhật
      console.log(avatar);
    }, [avatar]);
  
    const getShopInfo = async () => {
      try {
        const docRef = doc(db, "user", idUser);
        const docSnap = await getDoc(docRef);
  
        // Set state only when data is available
        setSeller(docSnap.data());
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    const updateShopInfo = async () => {
      try {
        if (shopName === "" || address === "" || shopDescript==="") {
          Alert.alert("Thông báo", "Không được để trống");
        } else {
          setIsUpdating(true)
          const docRef = doc(db, "user", idUser);
          await updateDoc(docRef, {
            shopName: shopName,
            address: address,
            shopDescript: shopDescript
          });
          setIsUpdating(false)
          //   const updatedDocSnap = await getDoc(docRef);
          Alert.alert("Thông báo", "Cập nhật thành công");
        }
      } catch (e) {
        console.log(e);
      }
    };
  
    const changeAvatar = async () => {
      if (loading===false){
      // Chọn hình ảnh
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3],
        base64: true,
        quality: 1,
      });
  
      if (!result.canceled) {
        
        setLoading(true);
        //Tách path ảnh từ firestorage link
        const urlAvatarFirebase = extractFileName(avatar);
        console.log(urlAvatarFirebase);
        //Xóa ảnh cũ khỏi firebase
        const storage = getStorage();
  
        const desertRef = ref(storage, "userImg/" + urlAvatarFirebase);
        // Delete the file
        deleteObject(desertRef)
          .then(() => {
            console.log("File deleted successfully");          
          })
          .catch((error) => {
            console.log("Xoa anh firebase loi", error);
          });
  
        // Lấy URI của hình ảnh đã chọn trong máy
        const newAvatarUri = result.assets[0].uri;
  
        //Upload ảnh mới lên firebase và return url ảnh
        const urlAvatar = await uploadImage(newAvatarUri)
        //Cập nhật url ảnh vào colection users
        const docRef = doc(db, "user", idUser);
          await updateDoc(docRef, {
            photo:urlAvatar,
          });
        // Lưu URI vào trạng thái
        setAvatar(urlAvatar);
        
        setLoading(false);
      }
      }
    };
    const uploadImage = async (avatarImage) => {
      const storage = getStorage();
      const storageRef = ref(storage, "userImg");
    
      const getCurrentTimestamp = () => {
        const date = new Date();
        return `${date.getFullYear()}${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}_${date
          .getHours()
          .toString()
          .padStart(2, "0")}${date
          .getMinutes()
          .toString()
          .padStart(2, "0")}${date.getSeconds().toString().padStart(2, "0")}`;
      };
    
      try {
        // Fetch the image
        const response = await fetch(avatarImage);
        const blob = await response.blob();
    
        // Create a filename
        const filename = idUser + `_${getCurrentTimestamp()}.jpg`;
    
        // Reference to the storage location
        const imageRef = ref(storageRef, filename);
    
        // Upload the image
        const snapshot = await uploadBytesResumable(imageRef, blob);
    
        // Get the download URL of the uploaded image
        const downloadURL = await getDownloadURL(snapshot.ref);
    
        console.log("Image has been uploaded.");
        return downloadURL;
      } catch (error) {
        console.error("Error uploading image:", error.message);
        return null;
      }
    };
    
  
    const extractFileName = (url) => {
      const parts = url.split("%2F");
      const fileNameWithQuery = parts[parts.length - 1];
      const fileNameParts = fileNameWithQuery.split("?");
      const fileName = fileNameParts[0];
      return fileName;
    };
  
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 8 }}>
          {avatar === "" ? (
            <></>
          ) : (
            <>
              <View
    style={{
      marginVertical: 10,
      alignSelf: "center",
    }}
  >
    {/* Image Container */}
    <View style={styles.imageContainer}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={color.origin}/> 
        </View>
      )}
      <Image
        source={{ uri: avatar }}
        style={{
          width: 100,
          height: 100, 
          borderWidth: 5,
          borderColor: "white",
          borderRadius: 100,
        }}
      />
    </View>
  
    {/* Button */}
    <TouchableOpacity
      style={{
        backgroundColor: color.origin,
        padding: 5,
        alignSelf: "center",
        marginTop: -24,
        marginLeft: 60,
        borderRadius: 100,
      }}
      onPress={changeAvatar}
    >
      <FontAwesome5 name="exchange-alt" size={12} color="white" />
    </TouchableOpacity>
  </View>
  
            </>
          )}
          <View style={styles.list_items}>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ marginLeft: 10, fontSize: 16 }}>Tên cửa hàng</Text>
              <Text style={{ color: "red" }}>*</Text>
            </View>
            <TextInput style={styles.input} onChangeText={setShopName} value={shopName} />
          </View>
  
          <View style={styles.list_items}>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ marginLeft: 10, fontSize: 16 }}>Mô tả cửa hàng</Text>
              <Text style={{ color: "red" }}>*</Text>
            </View>
            <TextInput
              style={styles.input}
              onChangeText={setShopDescript}
              value={shopDescript}
            />
          </View>
          <View style={styles.list_items}>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ marginLeft: 10, fontSize: 16 }}>Địa chỉ</Text>
              <Text style={{ color: "red" }}>*</Text>
            </View>
            <TextInput
              style={styles.input}
              onChangeText={setAddress}
              value={address}
            />
          </View>
  
          {/* <View style={styles.list_items}>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ marginLeft: 10, fontSize: 16 }}>Số điện thoại</Text>
              <Text style={{ color: "red" }}>*</Text>
            </View>
            <Text style={styles.input}>{phoneNumber}</Text>
          </View> */}
        </View>
  
        <View style={{}}>
          <Button title="Lưu" color={color.origin} onPress={updateShopInfo} />
        </View>
        {isUpdating && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={color.origin}/> 
        </View>
      )}
      </View>
    );
  };

export default ShopInfoScreen

const styles = StyleSheet.create({
    list_items: {
      marginVertical: 1,
      width: "100%",
      padding: 10,
      justifyContent: "space-between",
      backgroundColor: "white",
    },
    input: {
      marginLeft: 12,
    },
    
    loadingContainer: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1, // Ensure the loading indicator is above the image
    },
    imageContainer: {
      position: 'relative',
    },
  });
  