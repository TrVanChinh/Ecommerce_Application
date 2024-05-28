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
import { Dropdown } from "react-native-element-dropdown"
import {
  AntDesign,
} from "@expo/vector-icons";
import { useUser } from "../../UserContext"
import { API_BASE_URL } from "../../Localhost";
import axios from "axios";

const UpdateAddressScreen = ({navigation, route}) => {
  const { user } = useUser();
  const userId = user._id
  const {address} = route.params
  const [name, setName] = useState(address.name);
  const [phoneNumber, setPhoneNumber] = useState(address.mobileNo);
  const [street, setStreet] = useState(address.street);
  const [provinces, setProvinces] = useState([]);
  const [district, setDistrict] = useState([]);
  const [ward, setWard] = useState([]);
  const [valueProvinces, setValueProvinces] = useState(null);
  const [valueDistrict, setValueDistrict] = useState(null);
  const [valueWard, setValueWard] = useState(null);
  const [lableProvinces, setLableProvinces] = useState(null);
  const [lableDistrict, setLableDistrict] = useState(null);
  const [lableWard, setLableWard] = useState(null);
  const [loading, setLoading] = useState(true);
  const { height, width } = Dimensions.get("window");

  const token = "30dee1e2-a7c8-11ee-a59f-a260851ba65c";
   console.log(address)

    const fetchProvinces = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://online-gateway.ghn.vn/shiip/public-api/master-data/province', {
          headers: {
            'Content-Type': 'application/json',
            'Token': `${token}`, 
          },
        });
        // Chuyển đổi dữ liệu từ API thành mảng có thuộc tính 'label' và 'value'
        const formattedProvinces = response.data.data.map(province => ({
          label: province.ProvinceName,
          value: province.ProvinceID, // Chuyển đổi sang chuỗi nếu cần
        }));
        setProvinces(formattedProvinces);
      } catch (error) {
        console.error(error);
      } finally { 
        setLoading(false);
      }
    };
  
    const fetchDistricts = async (provinceId) => {
      setLoading(true);
      try {
        const response = await axios.get(`https://online-gateway.ghn.vn/shiip/public-api/master-data/district?province_id=${provinceId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Token': `${token}`, 
          },
        });
        // Chuyển đổi dữ liệu từ API thành mảng có thuộc tính 'label' và 'value'
        const formattedDistrict = response.data.data.map(district => ({
          label: district.DistrictName,
          value: district.DistrictID, 
        }));
        setDistrict(formattedDistrict);
      } catch (error) {
        console.error(error);
      } finally { 
        setLoading(false);
      }
    };

    const fetchWards = async (districtId) => {
      setLoading(true);
      try {
        const response = await axios.get(`https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${districtId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Token': `${token}`, 
          },
        });
        // Chuyển đổi dữ liệu từ API thành mảng có thuộc tính 'label' và 'value'
        const formattedWard = response.data.data.map(district => ({
          label: district.WardName,
          value: district.WardCode, 
        }));
        setWard(formattedWard);
      } catch (error) {
        console.error(error);
      } finally { 
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchProvinces();
    }, []);

    const UpdateAddress = async () => {
      const AddressInfo = {
        userId: userId,
        addressId: address._id,
        name: name,
        street: street,
        Ward: lableWard,
        District: lableDistrict,
        city: lableProvinces,
        mobileNo: phoneNumber,
      }
      axios.put(`${API_BASE_URL}/user/updateAddress`,AddressInfo).then((response) => {
        if (response.data.status === "FAILED") {
          alert(response.data.message); 
          console.log(response.data.message);
        } else {
          Alert.alert(
            '',
            `Cập nhật địa chỉ mới thành công.`,
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
  return (
    <View>
      <Text style={{ padding:10, borderBottomWidth:0.5, borderColor: "#D0D0D0"}}>Liên hệ</Text>
      <TextInput
        value= {name}
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
        value= {phoneNumber}
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
        placeholder="Số điện thoại"
      />
     
      <Text style={{ padding:10, borderBottomWidth:0.5, borderColor: "#D0D0D0"}}>Địa chỉ</Text>
      {/* <Pressable
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
        onPress={() => navigation.navigate('ResetAddress', {address})}
      >
        {lableProvinces ? (
          <Text>{lableProvinces}, {lableDistrict}, {lableWard}</Text>
        ) : (
          <Text>{provinces}, {district}, {Ward}</Text>
        )}
        <AntDesign name="right" size={20} color="#D0D0D0" />
      </Pressable> */}
      <Text style={{ padding:10, fontSize:14, fontWeight:'bold',borderBottomWidth:0.5, borderColor: "#D0D0D0"}}>Tỉnh/Thành phố</Text>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={provinces}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Chọn"
        searchPlaceholder="Search..."
        value={valueProvinces}
        onChange={item => {
          setValueProvinces(item.value);
          fetchDistricts(item.value)
          setLableProvinces(item.label)
        }}
      />
      <Text style={{ padding:10, fontSize:14 ,fontWeight:'bold',borderBottomWidth:0.5, borderColor: "#D0D0D0"}}>Quận/Huyện</Text>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={district}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Chọn"
        searchPlaceholder="Search..."
        value={valueDistrict}
        onChange={item => {
          setValueDistrict(item.value);
          fetchWards(item.value)
          setLableDistrict(item.label)
        }}
      />
      <Text style={{ padding:10,fontSize:14,fontWeight:'bold', borderBottomWidth:0.5, borderColor: "#D0D0D0"}}>Phường/Xã</Text>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={ward}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Chọn"
        searchPlaceholder="Search..."
        value={valueWard}
        onChange={item => {
          setValueWard(item.value);
          setLableWard(item.label)
        }}
      />
      <TextInput
        value={street}
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
          if (lableProvinces === null || lableDistrict === null || lableWard === null || phoneNumber === null || name === null || street === null) {
            alert("Điền đầy đủ thông tin");
          } else {
            UpdateAddress();
          }
        }}
      >
        <Text style={{ color: lableProvinces === null || lableDistrict === null || lableWard === null || phoneNumber === null || name === null || street === null ? "black": "white",}}>HOÀN THÀNH</Text>
        
      </Pressable>
    </View>
  );
};

export default UpdateAddressScreen

const styles = StyleSheet.create({

  dropdown: {
    height: 50,
    backgroundColor:'white',
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
    paddingLeft:10,
    paddingRight:10,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 14,
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

