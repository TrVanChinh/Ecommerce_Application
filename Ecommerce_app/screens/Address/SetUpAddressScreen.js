import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  Dimensions,
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
import { Dropdown } from "react-native-element-dropdown"
import { useUser } from "../../UserContext";
import axios from "axios";

const SetUpAddressScreen = ({navigation}) => {
  const { user } = useUser();
  const { height, width } = Dimensions.get("window");

  const [valueProvinces, setValueProvinces] = useState(null);
  const [valueDistrict, setValueDistrict] = useState(null);
  const [valueWard, setValueWard] = useState(null);
  const [lableProvinces, setLableProvinces] = useState(null);
  const [lableDistrict, setLableDistrict] = useState(null);
  const [lableWard, setLableWard] = useState(null);
  const [provinces, setProvinces] = useState([]);
  const [district, setDistrict] = useState([]);
  const [ward, setWard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = "30dee1e2-a7c8-11ee-a59f-a260851ba65c";
   
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
          value: province.ProvinceID, //Chuyển đổi sang chuỗi nếu cần
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

  return (
    <View>
      <Text style={{ padding:10, fontSize:18, fontWeight:'bold',borderBottomWidth:0.5, borderColor: "#D0D0D0"}}>Tỉnh/Thành phố</Text>
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
        placeholder="..."
        searchPlaceholder="Search..."
        value={valueProvinces}
        onChange={item => {
          setValueProvinces(item.value);
          fetchDistricts(item.value)
          setLableProvinces(item.label)
        }}
      />
      <Text style={{ padding:10, fontSize:18 ,fontWeight:'bold',borderBottomWidth:0.5, borderColor: "#D0D0D0"}}>Quận/Huyện</Text>
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
        placeholder="..."
        searchPlaceholder="Search..."
        value={valueDistrict}
        onChange={item => {
          setValueDistrict(item.value);
          fetchWards(item.value)
          setLableDistrict(item.label)
        }}
      />
      <Text style={{ padding:10,fontSize:18,fontWeight:'bold', borderBottomWidth:0.5, borderColor: "#D0D0D0"}}>Phường/Xã</Text>
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
        placeholder="..."
        searchPlaceholder="Search..."
        value={valueWard}
        onChange={item => {
          setValueWard(item.value);
          setLableWard(item.label)
        }}
      />
      
      <Pressable
        style={{
            height: height / 15,
            borderBottomWidth:0.5,
            paddingStart:10,
            backgroundColor: lableProvinces === null || lableDistrict === null || lableWard === null ? "lightgray": "#f95122",
            borderColor: "#D0D0D0",
            alignItems:'center',
            justifyContent:'center'
        }}
        onPress={()=>{
          lableProvinces === null || lableDistrict === null || lableWard === null ? console.log("Chọn đủ thông tin địa chỉ") : navigation.navigate('NewAddress', {
            lableProvinces,
            lableDistrict,
            lableWard,
          });
        }}
      >
        <Text style={{ color: lableProvinces === null || lableDistrict === null || lableWard === null ? "black": "white",}}>HOÀN THÀNH</Text>
        
      </Pressable>
    </View>
  )
}

export default SetUpAddressScreen

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
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
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