import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Feather,
  SimpleLineIcons,
  Entypo,
  AntDesign,
  Ionicons,
  Octicons,
} from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { LineChart } from "react-native-chart-kit";
import color from "../../components/color";
import { API_BASE_URL } from "../../Localhost";
import axios from "axios";
import { useUser } from "../../UserContext";

const RevenueSellerScreen = () => {
  const [sellerList, setSellerList] = useState([]);

  const getSellerRevenue = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/showRevenueSellerByMonth/5/2024`);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  }
  
  useEffect(() => {
    getSellerRevenue();
  }, []);
  return (
    <View>
      <Text>RevenueSellerScreen</Text>
    </View>
  )
}

export default RevenueSellerScreen

const styles = StyleSheet.create({})