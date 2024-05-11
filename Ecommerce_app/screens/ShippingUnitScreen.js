
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Pressable,
    TextInput,
    Image,
    Dimensions,
    FlatList,
  } from "react-native";
  import { CheckBox, Icon } from "react-native-elements";
  import color from "../components/color";
  import React, {
    useEffect,
    useState,
  } from "react";
  import { useUser } from "../UserContext";
  import { API_BASE_URL } from "../Localhost";
  import axios from "axios";
  import AsyncStorage from '@react-native-async-storage/async-storage';

const ShippingUnitScreen = ({navigation}) => {
  const { updateShippingUnit } = useUser()
    const { height, width } = Dimensions.get("window");
    const [ShippingUnit, setShippingUnit] = useState([])

    useEffect (() => {
        getShippingUnit()
    },[])

    const getShippingUnit = async () => {
        axios
        .get(`${API_BASE_URL}/shippingUnit`)
        .then((response) => {
            const shippingUnit = response.data.data.map((data) => {
                return { ...data, checked: false };
            })
            setShippingUnit(shippingUnit);
            console.log(shippingUnit)
        })
        .catch((error) => {
            console.log(error);
        });
    }

    const handleCheckboxChange = (ShippingUnit) => {
        setShippingUnit((prevData) => 
            prevData.map((item) =>
                item._id === ShippingUnit._id ? { ...item, checked: true  } : { ...item, checked: false } 
            )
        );
        updateShippingUnit(ShippingUnit)
        navigation.navigate('Order');
    };
  return (
    <>
      <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
      {ShippingUnit?.map((item, index) =>
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
          onPress={() => {
            handleCheckboxChange(item)
          }}
        >
          <CheckBox
            center
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            checked={item.checked}
            checkedColor="#f95122"
          />
          <View style={{ width:width*0.7}}>
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>
              {item.name} 
            </Text>
            <Text style={{ fontSize: 12, color: "#181818" }}>
              thời gian vận chuyển: {item.deliveryTime}
            </Text>
            <Text style={{ color: "#f95122" }}>Giá: {item.price}</Text>
          </View> 
        </Pressable>
      )}
      </ScrollView>
    </>
  )
}

export default ShippingUnitScreen

const styles = StyleSheet.create({})