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
  Ionicons,
  FontAwesome,
} from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { LineChart } from "react-native-chart-kit";
import color from "../../components/color";
import { API_BASE_URL } from "../../Localhost";
import axios from "axios";
import { useUser } from "../../UserContext";

const RevenueSellerScreen = () => {
  const [sellerList, setSellerList] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const yearArray = Array.from(
    { length: 10 },
    (_, i) => new Date().getFullYear() - i
  );
  const monthArray = Array.from({ length: 12 }, (_, i) => i + 1);
  const [revenue, setRevenue] = useState([]);

  const toggleModal = (select) => {
    if (select === "month") {
      setModalVisible(!isModalVisible);
      setIsSelectMonth(true);
    } else {
      setModalVisible(!isModalVisible);
      setIsSelectMonth(false);
    }
  };
  const [isModalVisible, setModalVisible] = useState(false);
  const [isSelectMonth, setIsSelectMonth] = useState(false);

  const closeModal = () => {
    if (isModalVisible) {
      toggleModal();
    }
  };

  useEffect(() => {
    getSellerRevenue();
  }, [month, year]);

  const getSellerRevenue = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/admin/showRevenueSellerByMonth/${month}/${year}`
      );
      setRevenue(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSellerRevenue();
  }, []);

  
  const formatPrice = (price) => {
    // Sử dụng Intl.NumberFormat để định dạng số thành chuỗi với dấu ngăn cách hàng nghìn
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Render một hàng của bảng
  const renderItem = ({ item, index }) => (
    <View style={styles.row}>
      <Text style={[styles.cell, { flex: 1 }]}>{index + 1}</Text>
      <Text style={[styles.cell, { flex: 4 }]}>{item.shopName}</Text>
      <Text style={[styles.cell, { flex: 2 }]}>{formatPrice(item.totalByShop)}</Text>
    </View>
  );
  const [sortBy, setSortBy] = useState(null); // null: không sắp xếp, 'asc': từ thấp đến cao, 'desc': từ cao xuống thấp

  const sortData = (key) => {
    const sortedData = [...revenue].sort((a, b) => {
      if (sortBy === "asc") {
        return a[key] - b[key];
      } else if (sortBy === "desc") {
        return b[key] - a[key];
      }
      return 0;
    });
    setRevenue(sortedData);
    setSortBy(sortBy === "asc" ? "desc" : "asc"); // Đảo chiều sắp xếp
  };
  return (
    <View>
      <Text style={{ margin: 10, fontSize: 15 }}>
        Danh sách cửa hàng và doanh thu theo tháng
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          alignSelf: "center",
        }}
      >
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
            // getRevenueByCustomer(month, year);
            toggleModal("month");
          }}
        >
          <Text style={{ textAlign: "center", margin: 10 }}>-- {month} --</Text>
        </TouchableOpacity>
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
            // getRevenueByCustomer(month, year);
            toggleModal("year");
          }}
        >
          <Text style={{ textAlign: "center", margin: 10 }}>-- {year} --</Text>
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
              <Ionicons name="close-circle" size={29} color="gray" />
            </TouchableOpacity>
            <Text
              style={{
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: 10,
                fontSize: 20,
              }}
            >
              Chọn {isSelectMonth ? "tháng" : "năm"}
            </Text>

            <ScrollView style={{ backgroundColor: "white" }}>
              {!isSelectMonth
                ? yearArray.map((item, key) => (
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
                        // getRevenueByYear(item);
                        setYear(item);
                        toggleModal();
                      }}
                    >
                      <Text style={{ color: "black", textAlign: "center" }}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))
                : monthArray.map((item, key) => (
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
                        // getRevenueByYear(item);
                        setMonth(item);
                        toggleModal();
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
      <View style={styles.header}>
        <Text style={[styles.headerText, { flex: 1 }]}>STT</Text>
        <Text style={[styles.headerText, { flex: 4 }]}>Cửa hàng</Text>
          <View
            style={[styles.headerText,{
              flex: 2,
              flexDirection: "row",
              alignItems: "center",
              padding: 5,
            }]}
          >
            <Text style={[styles.headerText, { flex: 7 }]}>Doanh thu</Text>
            <TouchableOpacity
              onPress={() => sortData("totalByShop")}
              style={{
                // backgroundColor: "white",
                flex: 2,
                alignItems: "center",
                borderWidth: 1,
                borderColor: "gray",
              }}
            >
              {sortBy === "asc" ? (
                <FontAwesome
                  name="sort-amount-desc"
                  size={16}
                  color="gray"
                  style={{ padding: 2 }}
                />
              ) : sortBy === "desc" ? (
                <FontAwesome
                  name="sort-amount-asc"
                  size={16}
                  color="gray"
                  style={{ padding: 2 }}
                />
              ) : (
                <FontAwesome
                  name="sort-amount-asc"
                  size={16}
                  color="lightgray"
                  style={{ padding: 2 }}
                />
              )}
            </TouchableOpacity>
          </View>
      </View>
      <FlatList
        data={revenue}
        renderItem={renderItem}
        // keyExtractor={item => item.userId.toString()}
      />
    </View>
  );
};

export default RevenueSellerScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    marginBottom: 10,
    marginTop: 20,
    alignItems: "center",
  },
  headerText: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 15,
  },
  row: {
    flexDirection: "row",
    marginBottom: 1,
  },
  cell: {
    flex: 1,
    textAlign: "center",
    borderWidth: 1,
    borderColor: "lightgray",
    paddingVertical: 5,
    backgroundColor: "white",
  },
});
