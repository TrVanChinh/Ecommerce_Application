import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  Dimensions,
  Alert,
  SafeAreaView,
} from "react-native";
import React, {
  useEffect,
  useState,
  useLayoutEffect,
  useContext,
  useCallback,
} from "react";
import {
  Feather,
  AntDesign,
  Entypo,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useUser } from "../../UserContext";
import { API_BASE_URL } from "../../Localhost";
import axios from "axios";

const NewAddressScreen = ({navigation, route}) => {
  const { user } = useUser();
  const userId = user?._id
  const { lableProvinces, lableDistrict, lableWard } = route.params;
  const [name, setName] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [street, setStreet] = useState(null);
  const { height, width } = Dimensions.get("window");
  console.log(lableProvinces)
  console.log(lableDistrict)
  console.log(lableWard)

  const addToAddress = async (userId) => { 
    const AddressInfo = {
      userId: userId,
      name: name,
      street: street,
      Ward: lableWard,
      District: lableDistrict,
      city: lableProvinces,
      mobileNo: phoneNumber,
    }
    axios.post(`${API_BASE_URL}/user/newAddress`,AddressInfo).then((response) => {
      if (response.data.status === "FAILED") {
        alert(response.data.message); 
        console.log(response.data.message);
      } else {
        Alert.alert(
          '',
          `Thêm địa chỉ mới thành công.`,
          [
            { text: 'OK', onPress: () => navigation.navigate("Address") },
          ],
          { cancelable: false }
        );
      }
    })
    .catch((error) => {
      alert("error")
      console.log(error)
    })
  }

  // const handlePhChange = (text) => {
  //   // Loại bỏ các ký tự không phải số
  //   const numericValue = text.replace(/[^0-9]/g, "");
  //   setPhoneNumber(numericValue);
  // };



  return (
    <View>
      <Text style={{ padding:10, borderBottomWidth:0.5, borderColor: "#D0D0D0"}}>Liên hệ</Text>
      <TextInput
        onChangeText={(text) => {
          setName(text);
        }}
        style={{
          height: height / 12,
          borderBottomWidth:0.5,
          paddingStart:10,
          backgroundColor:'white',
          borderColor: "#D0D0D0"
        }}
        autoCorrect={false}
        placeholder="Họ và Tên"
      />

      <TextInput
        onChangeText={(text) => {
          setPhoneNumber(text);
        }}
        style={{
          height: height / 12,
          borderBottomWidth:0.5,
          paddingStart:10,
          backgroundColor:'white',
          borderColor: "#D0D0D0"
        }}
        autoCorrect={false}
        keyboardType = "numeric"
        placeholder="Số điện thoại"
      />
     
      <Text style={{ padding:10, borderBottomWidth:0.5, borderColor: "#D0D0D0"}}>Địa chỉ</Text>
      <Pressable
        style={{
            flexDirection:'row',
            justifyContent:'space-between',
            height: height / 12,
            borderBottomWidth:0.5,
            paddingStart:10,
            backgroundColor:'white',
            borderColor: "#D0D0D0",
            alignItems:'center'
        }}
        onPress={() => navigation.navigate('SetUpAddress')}
      >
        {lableProvinces ? (
          <Text>{lableProvinces}, {lableDistrict}, {lableWard}</Text>
        ) : (
          <Text>Tỉnh/Thành, Quân/Huyện, Phường/Xã</Text>
        )}
        <AntDesign name="right" size={20} color="#D0D0D0" />
      </Pressable>
      <TextInput
        onChangeText={(text) => {
          setStreet(text);
        }}
        style={{
          height: height / 12,
          borderBottomWidth:0.5,
          paddingStart:10,
          backgroundColor:'white',
          borderColor: "#D0D0D0"
        }}
        autoCorrect={false}
        placeholder="Tên đường, Tòa nhà, Số nhà."
      />
      <Pressable
        style={{
            height: height / 15,
            borderBottomWidth:0.5,
            paddingStart:10,
            backgroundColor: lableProvinces === null || lableDistrict === null || lableWard === null || phoneNumber === null || name === null || street === null ? "lightgray": "#f95122",
            borderColor: "#D0D0D0",
            alignItems:'center',
            justifyContent:'center'
        }}
        onPress={()=> {
          lableProvinces === null || lableDistrict === null || lableWard === null || phoneNumber === null || name === null || street === null ? alert("Điền đầy đủ thông tin")
          : addToAddress(userId)
        }}
      >
        <Text style={{ color: lableProvinces === null || lableDistrict === null || lableWard === null || phoneNumber === null || name === null || street === null ? "black": "white",}}>HOÀN THÀNH</Text>
        
      </Pressable>
    </View>
  );
};

export default NewAddressScreen;

const styles = StyleSheet.create({});
