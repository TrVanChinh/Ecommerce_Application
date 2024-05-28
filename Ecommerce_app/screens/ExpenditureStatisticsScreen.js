import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
} from "react-native";

import {
  AntDesign,
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
  Feather,
} from "@expo/vector-icons";
import color from "../components/color";
import Modal from "react-native-modals";
import { useUser } from "../UserContext";
import { API_BASE_URL } from "../Localhost";
import axios from "axios";
import OrdersItem from "./OrdersItem";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from "react-native-chart-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dropdown } from "react-native-element-dropdown";

const ExpenditureStatisticsScreen = ({ navigation }) => {
  const { height, width } = Dimensions.get("window");
  const [totalAmount, setTotalAmount] = useState(0);
  const [timeList, setTimeList] = useState([]);
  const [money, setMoney] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeline, setTimeline] = useState([]);
  const [valueTimeline, setValueTimeline] = useState(null);
  const [lableTimeline, setLableTimeline] = useState(null);
  const [order, setOrder] = useState([])
  const [quantityOrder, setQuantityOrder] = useState(0)
  const { user, updateCompletedOrder, completedOrder } = useUser();
  const idUser = user._id;
  useEffect(() => {
    getDataOrderCompleted(idUser);
    console.log(money);
  }, []);

  const getDataOrderCompleted = async (id) => {
    try {
      await axios
        .get(`${API_BASE_URL}/user/getOrderCompleted/${id}`)
        .then((response) => {
          if (response.data.status === "FAILED") {
            Alert.alert(response.data.message);
          } else {
            handleDataOrder(response)
          }
        })
        .catch((error) => {
          console.log(error);
          Alert.alert("Error", error.message);
        })
        .finally(() => {
          setLoading(false); // Đặt trạng thái loading thành false sau khi dữ liệu đã tải xong
        });
    } catch (error) {
      Alert.alert(error.message);
      setLoading(false);
    }
  };

  const handleDataOrder = (response) => {
    const orderTimeList = response.data.timeofOrder;
    //set data of dropdown
    const dataTimeline =  orderTimeList.map((date) => {
        const data = `${date.month.toString().padStart(2, "0")}/${date.year}`;
        return { value: data, label: data };
      })
    const defaultItem = { label: 'Tất cả', value: 'all' };
    setTimeline([defaultItem, ...dataTimeline]);

    const orderData = response.data.order;
    setDataForChart(orderData)
    setTotalAmount(response.data.totalAmount);
    updateCompletedOrder(orderData);
    setOrder(orderData);
  };

  const setDataForChart = (data) => {
    const newTimeList = ['0'];
    const newMoneyList = [0];
    let numberOfOrder = 0
    let totalMoney = 0;

    data.forEach((order) => {
      numberOfOrder += 1;
      totalMoney += order._doc.totalByShop;
      const datePattern = /^\d{2}\/\d{2}\/\d{4}$/;
      if (!datePattern.test(order._doc.createAt)) {
        order._doc.createAt = formatDate(order._doc.createAt);
      }
      const index = newTimeList.indexOf(order._doc.createAt);

      if (index !== -1) {
        // Nếu `createAt` đã tồn tại trong `newTimeList`, cộng thêm giá trị vào `newMoneyList`
        newMoneyList[index] += order._doc.totalByShop / 1000;
      } else {
        // Nếu `createAt` chưa tồn tại, thêm mới vào cả hai mảng
        newTimeList.push(order._doc.createAt);
        newMoneyList.push(order._doc.totalByShop / 1000);
      }
    });
    setQuantityOrder(numberOfOrder)
    setTotalAmount(totalMoney)
    setTimeList(newTimeList);
    setMoney(newMoneyList);
  }

  const sortByCreatedAt = (order) => {
    const sortbyCreateAtproduct = order.sort((a, b) => {
      const aTimestamp = new Date(a._doc.createAt).getTime();
      const bTimestamp = new Date(b._doc.createAt).getTime();
      // So sánh theo timestamp
      return aTimestamp - bTimestamp;
    });
    // In ra mảng đã sắp xếp
    return sortbyCreateAtproduct;
  };

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1; // Tháng tính từ 0-11, nên cần +1
    const year = date.getUTCFullYear();

    // Định dạng ngày tháng năm theo kiểu DD/MM/YYYY
    return `${day.toString().padStart(2, "0")}/${month
      .toString()
      .padStart(2, "0")}/${year}`;
  };

  const handleViewOrderDetails = (order) => {
    navigation.navigate("OrderDetail", { order });
  };

  function findByMonthYear(data, monthYear) {
      if (monthYear !="all") {
      const Newdata = data.filter((item) => {
        const createAt = item._doc.createAt;
        const [day, month, year] = createAt.split("/");
        const [searchMonth, searchYear] = monthYear.split("/");
        return month === searchMonth && year === searchYear;
      });
        setOrder(Newdata)
        setDataForChart(Newdata)
      } else {
        setOrder(data)
        setDataForChart(data)
      }
  }

  const formatDateWithoutYear = (dateStr) => {
    return dateStr.slice(0, 5);
  };

  const limit = 5;
  const displayedTimeList = timeList.slice(-limit).map(formatDateWithoutYear);
  const displayedMoney = money.slice(-limit);

  if (loading) {
    // Hiển thị màn hình chờ trong khi dữ liệu đang tải
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return (
    <View style={{ padding: 10 }}>
      <View style={{ flexDirection: "row", justifyContent:'space-between', alignItems:'center' }}>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={timeline}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Chọn tháng"
        searchPlaceholder="Search..."
        value={valueTimeline}
        onChange={(item) => {
          setValueTimeline(item.value);
          setLableTimeline(item.label);
          findByMonthYear(completedOrder, item.value);
        }}
      />
      <View style={styles.title}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Tổng số tiền:</Text>
        <Text style={{ fontSize: 18, color: "red" }}> {totalAmount} VNĐ</Text>
      </View>
      </View>
      
      

      {/* chart */}
      <View style={{ alignItems: "center" }}>
        <ScrollView horizontal>
          <LineChart
            data={{
              labels: displayedTimeList,
              datasets: [
                {
                  data: displayedMoney,
                },
              ],
            }}
            width={width * 0.95} // Đảm bảo chiều rộng phù hợp với số lượng nhãn hiển thị
            height={height * 0.35} //
            yAxisSuffix="k"
            yAxisInterval={1}
            chartConfig={{
              backgroundColor: "#e26a00",
              backgroundGradientFrom: "#2A54FF",
              backgroundGradientTo: "#BAF5FF",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "black",
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </ScrollView>
      </View>
      <View style={{ width: width, height: height * 0.5 }}>
        <View  style={{ flexDirection: 'row', padding:5 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            Danh sách đơn hàng:
          </Text>
          <Text style={{ fontSize: 18 }}>{quantityOrder} đơn</Text>
        </View>

        <FlatList
          keyExtractor={(item) => item._doc._id}
          data={order}
          renderItem={({ item }) => {
            return (
              <OrdersItem
                item={item}
                onPress={() => handleViewOrderDetails(item)}
              />
            );
          }}
        />
      </View>
    </View>
  );
};

export default ExpenditureStatisticsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    flexDirection: "row",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dropdown: {
    height: 40,
    width: "30%",
    backgroundColor: "white",
    borderBottomColor: "gray",
    borderBottomWidth: 0.5,
    paddingLeft: 10,
    paddingRight: 10,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 13,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 20,
    fontSize: 16,
  },
});
