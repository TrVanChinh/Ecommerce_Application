import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Pressable,
    TextInput,
    Image,
    Alert,
    Dimensions,
    SafeAreaView,
  } from "react-native";
  import { CheckBox, Icon } from 'react-native-elements';
  import React, {
    useEffect,
    useState,
    useLayoutEffect,
    useContext,
    useCallback,
  } from "react";
  import { useFocusEffect } from '@react-navigation/native';
  import { Feather, AntDesign, Entypo ,MaterialCommunityIcons} from "@expo/vector-icons";
  import { useUser } from "../../UserContext"
  import { API_BASE_URL } from "../../Localhost";
  import axios from "axios";

  const AddressScreen = ({navigation}) => {
    const { user, updateAddress } = useUser();
    const idUser = user._id
    const[address,setAddress] = useState([])
    const { height, width } = Dimensions.get("window");

    useEffect(() => {
      getAddress(idUser);
      console.log(idUser)
    }, []);
  
    const getAddress = async (id) => { 
      axios.get(`${API_BASE_URL}/user/${id}/getAddress`).then((response) => {
        if (response.data.status === "FAILED") {
          alert(response.data.message); 
          console.log(response.data.message);
        } else {
          setAddress(response.data.data);
        }
      })
      .catch((error) => {
        alert("error")
        console.log(error)
      })
    }
    
    useFocusEffect(
      React.useCallback(() => {
        getAddress(idUser);
        console.log('Trang Address đã được tập trung');
      }, [])
    );
  
    const handleItemAddress = (address) => {
      updateAddress(address);
      navigation.navigate('Order');
    };

    const deleteAddress = (idAddress) => { 
      const addressInfo = {
        userId: idUser,
        addressId: idAddress,
      }
      axios.post(`${API_BASE_URL}/user/deleteAddress`,addressInfo).then((response) => {
        if (response.data.status === "FAILED") {
          alert(response.data.message); 
          console.log(response.data.message);
        } else {
          getAddress(idUser)
          Alert.alert(
            '',
            `Xóa địa chỉ thành công.`,
            [
              { text: 'OK'},
            ],
            { cancelable: false }
          )
        }
      })
      .catch((error) => {
        alert("error")
        console.log(error)
      })
    }
    return (
      <>
        <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
        {address?.map((item, index) =>
          <Pressable
            key={item._id}
            style={{
              borderWidth: 1,
              borderColor: "#D0D0D0",
              padding: 10,
              gap: 5,
              marginVertical: 5,
              flexDirection: "row",
              justifyContent:'space-between'
            }}
            onPress={() => handleItemAddress(item)}
          >
            <CheckBox
              center
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              checked={true}
              checkedColor="#f95122"
            />
            <View style={{ width:width*0.7}}>
              <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                {item.name} | {item.mobileNo}
              </Text>
              <Text style={{ fontSize: 12, color: "#181818" }}>
                {item.street}
              </Text>
  
              <Text style={{ fontSize: 12, color: "#181818" }}>
                {item.Ward}, {item.District}, {item.city}
              </Text>
            </View>

            <View style= {styles.buttonhandlesAddress}>
              <Pressable
                style={{padding:5}}
                onPress={()=> navigation.navigate("UpdateAddress", { address: item })}
              >
                <Text style={{ color: "#f95122" }}>Sửa</Text>
              </Pressable>

              <Pressable
                style={{padding:5}}
                onPress={()=> 
                  Alert.alert(
                    '',
                    `Bạn muốn xóa địa chỉ này?`,
                    [
                      { text: 'OK', onPress: () => deleteAddress(item._id) },
                    ],
                    { cancelable: false }
                  )
                }
              >
                <Text style={{ color: "red" }}>Xóa</Text>
              </Pressable>
            </View>
            
          </Pressable>
        )}
          <Pressable
            style={{
              borderWidth: 1,
              borderColor: "#D0D0D0",
              padding: 10,
              flexDirection: "column",
              gap: 5,
              flexDirection: "row",
              justifyContent:'center'
            }}
            onPress={() => navigation.navigate("NewAddress", 'address')}
          >
            <MaterialCommunityIcons name="plus-circle-outline" size={24} color="#f95122" />
            <Text style={{ color: "#f95122" }}>Thêm địa chỉ mới</Text>
          </Pressable>
        </ScrollView>
      </>
    )
  }
  
  export default AddressScreen
  
  const styles = StyleSheet.create({

    buttonhandlesAddress: {
      flexDirection: 'column',
      paddingRight:35,
    }
  })