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
  FontAwesome,
  Octicons,
} from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { LineChart } from "react-native-chart-kit";
import color from "../../components/color";
import { API_BASE_URL } from "../../Localhost";
import axios from "axios";
import { useUser } from "../../UserContext";
const CustomerScreen = () => {
  const { updateUser, user } = useUser();
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
    getRevenueByCustomer(month, year);
    sortData("totalRevenue");
  }, []);

  useEffect(() => {
    getRevenueByCustomer(month, year);
    sortData("totalRevenue");
  }, [month, year]);

  useEffect(() => {
    console.log(revenue);
  }, [revenue]);

  const getRevenueByCustomer = async (month, year) => {
    axios
      .get(
        `${API_BASE_URL}/seller/revenueByCustomer/${user._id}/${month}/${year}`
      )
      .then(function (response) {
        // setData(response.data.result);
        // console.log(response.data);
        setRevenue(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

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
  // Render một hàng của bảng
  const renderItem = ({ item, index }) => (
    <View style={styles.row}>
      <Text style={[styles.cell, { flex: 1 }]}>{index + 1}</Text>
      <Text style={[styles.cell, { flex: 4 }]}>{item.userName}</Text>
      <Text style={[styles.cell, { flex: 2 }]}>{item.totalRevenue}</Text>
    </View>
  );

  return (
    <View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={{ margin: 10, fontSize: 15 }}>
          Danh sách khách hàng tháng
        </Text>
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

      {revenue.length > 0 ? (
        <View style={styles.header}>
          <Text style={[styles.headerText, { flex: 1 }]}>STT</Text>
          <Text style={[styles.headerText, { flex: 4 }]}>Khách hàng</Text>
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
              onPress={() => sortData("totalRevenue")}
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
      ) : (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          {" "}
          Không có dữ liệu
        </Text>
      )}

      <FlatList
        data={revenue}
        renderItem={renderItem}
        // keyExtractor={item => item.userId.toString()}
      />
    </View>
  );
};

export default CustomerScreen;

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
