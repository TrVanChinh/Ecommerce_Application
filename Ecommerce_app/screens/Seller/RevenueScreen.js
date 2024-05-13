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

const RevenueScreen = () => {
  const { updateUser, user } = useUser();
  // Lấy dữ liệu từ API
  const [data, setData] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const yearArray = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

  // Lấy danh sách 10 năm gần nhất
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const [isModalVisible, setModalVisible] = useState(false);
  const closeModal = () => {
    if (isModalVisible) {
      toggleModal();
    }
  };
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/seller/revenueByYear/${user._id}/${new Date().getFullYear()}`)
      .then(function (response) {
        setData(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);
  const getRevenueByYear = async (inputYear) => {
    setYear(inputYear);
    axios
      .get(`${API_BASE_URL}/seller/revenueByYear/${user._id}/${inputYear}`)
      .then(function (response) {
        setData(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
      closeModal();
  }

  const completeData = Array.from({ length: 12 }, (_, i) => {
    const monthData = data.find((item) => item.month === i + 1);
    return monthData ? monthData.totalRevenue : 0;
  });

  // Cấu hình biểu đồ
  const chartConfig = {
    backgroundColor: "#e26a00",
    backgroundGradientFrom: color.origin,
    backgroundGradientTo: color.origin,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 5,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#ffa726",
    },
  };

  return (
    <View style={{ flex: 1 }}>
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Text style={{ margin: 10 }}>Doanh thu cửa hàng năm</Text>
      <TouchableOpacity
        style={{
          paddingHorizontal: 5,
          backgroundColor: "white",

          margin: 5,
          alignItems: "center",
          borderColor: "gray",
          borderWidth: 1,
        }}
        onPress={() => {
          toggleModal();
        }}
      >
        <Text style={{ textAlign: "center", margin: 10 }}>
          -- {year} --
        </Text>
      </TouchableOpacity>
    </View>
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
            padding: 10,
            borderRadius: 10,
            width: "90%",
            height: "40%",  
          }}
        >
          {/* button đóng */}
          <TouchableOpacity
            style={{
              marginTop: -10,
              marginRight: -10,
              alignSelf: "flex-end",
            }}
            onPress={closeModal}
          >
            <Ionicons name="close-circle" size={25} color="lightgray" />
          </TouchableOpacity><Text
              style={{
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: 10,
              }}
            >
              Chọn năm
            </Text>

          <ScrollView style={{ backgroundColor: "white" }}>
            
            {yearArray.map((item, key) => (
              <TouchableOpacity
                key={key}
                style={{
                  borderColor: "lightgray",
                  borderWidth: 1,
                  marginVertical: 5,
                  paddingVertical: 5,
                  marginHorizontal: 50,
                }}
                onPress={() => {
                  getRevenueByYear(item);
                }}
              >
                <Text style={{ color: "black", textAlign: "center" }}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
      <LineChart
        data={{
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          datasets: [{ data: completeData }],
        }}
        width={400}
        height={250}
        // yAxisSuffix="VNĐ" // Đơn vị trục y
        chartConfig={chartConfig}
        bezier // Hiệu ứng mượt mà
        style={styles.chart}
      />
      <Text style={{ textAlign: "center", marginVertical: 10, fontSize:16, fontWeight:"bold",color:"red" }}>
        Tổng doanh thu năm {year}:{" "}
        {completeData.reduce((a, b) => a + b, 0).toLocaleString("vi-VN")} VNĐ
      </Text>

    </View>
  );
};

export default RevenueScreen;

const styles = StyleSheet.create({
  chart: {
    marginVertical: 10,
    // marginHorizontal: 10,
    // marginHorizontal:2,
    width: "100%",
  },
});
