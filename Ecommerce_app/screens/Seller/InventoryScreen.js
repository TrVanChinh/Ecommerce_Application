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
const InventoryScreen = () => {
  const { updateUser, user } = useUser();
  const [year, setYear] = useState(new Date().getFullYear());
  const yearArray = Array.from(
    { length: 10 },
    (_, i) => new Date().getFullYear() - i
  );
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [results, setResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState({ name: "" });
  const [isSelectYear, setIsSelectYear] = useState(false);
  const [totalStock, setTotalStock] = useState([]);
  const [total, setTotal] = useState([]);
  const [productStats, setProductStats] = useState([]);

  useEffect(() => {
    if (selectedProduct.name !== "") {
      results.forEach((item) => {
        if (item._id === selectedProduct._id) {
          setProductStats(item.result);
        }
      });
    }
  }, [selectedProduct]);

  useEffect(() => {
    console.log(productStats);
  }, [productStats]);

  useEffect(() => {
    // getInventoryByYear();
    getProductList();
  }, []);
  useEffect(() => {
    getInventoryByYear(year);
  }, [year]);

  const getInventoryByYear = async (inputYear) => {
    setLoading(true);
    const inventoryData = [];
    // Sử dụng Promise.all để chờ tất cả các yêu cầu lấy dữ liệu hoàn tất
    await Promise.all(
      products.map(async (item) => {
        try {
          const response = await axios.get(
            `${API_BASE_URL}/seller/inventoryStatsByMonth/${item._id}/${inputYear}`
          );
          const { data } = response;
          // Thêm tên sản phẩm và ID vào dữ liệu
          data.name = item.name;
          data._id = item._id;
          inventoryData.push(data);
        } catch (error) {
          console.log(error);
        }
      })
    );
    setResults(inventoryData);
    setLoading(false);
  };

  const get = async (inputYear) => {
    setYear(inputYear);
    const res = await axios.get(
      `${API_BASE_URL}/seller/inventoryStatsByMonth/663ec5cdeb33097412f88749/${inputYear}`
    );
    console.log(res.data.result);
  };

  const calculateTotalStock = (inputArray) => {
    const stockMap = new Map(); // Đối tượng Map để lưu trữ tổng stock của từng tháng

    // Lặp qua từng phần tử trong mảng
    inputArray.forEach((item) => {
      const { result } = item;

      // Lặp qua từng kết quả trong result của mỗi phần tử
      result.forEach((monthData) => {
        const { month, stock } = monthData;

        if (stock !== null) {
          // Thêm hoặc cập nhật tổng stock của từng tháng trong map
          stockMap.set(month, (stockMap.get(month) || 0) + stock);
        } else {
          // Nếu stock là null thì set giá trị stock của tháng đó bằng 0
          stockMap.set(month, 0);
        }
      });
    });

    // Tạo mảng mới chứa tổng stock của từng tháng
    const totalStockArray = Array.from(stockMap, ([month, stock]) => ({
      month,
      stock,
    }));

    // return totalStockArray;
    setTotalStock(totalStockArray);
  };

  const calculateTotal = (input) => {
    const output = [];

    // Lặp qua từng tháng
    for (let i = 1; i <= 12; i++) {
      let totalStock = 0;
      let totalImportInMonth = 0;
      let totalSoldInMonth = 0;

      // Lặp qua từng sản phẩm
      input.forEach((product) => {
        const monthData = product.result.find((item) => item.month === i);
        if (monthData) {
          totalStock += monthData.stock || 0;
          totalImportInMonth += monthData.totalImportInMonth || 0;
          totalSoldInMonth += monthData.totalSoldInMonth || 0;
        }
      });

      // Thêm dữ liệu vào mảng output
      output.push({
        month: i,
        stock: totalStock,
        totalImportInMonth: totalImportInMonth,
        totalSoldInMonth: totalSoldInMonth,
      });
    }

    setTotalStock(output);
  };

  useEffect(() => {
    console.log(totalStock);
  }, [totalStock]);

  useEffect(() => {
    if (products.length > 0) {
      getInventoryByYear(year);
    }
  }, [products]);

  useEffect(() => {
    if (results.length > 0) {
      if (selectedProduct.name === "") {
        calculateTotal(results);
      } else {
        results.forEach((item) => {
          if (item._id === selectedProduct._id) {
            setProductStats(item.result);
          }
        });
      }
      // console.log(results[0].result);
    }
  }, [results]);

  const getProductList = async () => {
    // Lấy user ID
    // setLoading(true);
    const listproducts = [];
    axios
      .get(`${API_BASE_URL}/seller/showShopProduct/${user._id}`)
      .then(function (response) {
        let data = response.data.data;
        data.forEach((item) => {
          listproducts.push({
            _id: item._id,
            name: item.name,
          });
        });
        setProducts(listproducts);
        // setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const toggleModal = (select) => {
    if (select === "year") {
      setModalVisible(!isModalVisible);
      setIsSelectYear(true);
    } else {
      setModalVisible(!isModalVisible);
      setIsSelectYear(false);
    }
  };
  const [isModalVisible, setModalVisible] = useState(false);
  const closeModal = () => {
    if (isModalVisible) {
      toggleModal();
    }
  };
  const renderItemByAllPrd = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.month}</Text>
      <Text style={styles.cell}>{item.totalImportInMonth}</Text>
      <Text style={styles.cell}>{item.totalSoldInMonth}</Text>
      <Text style={styles.cell}>{item.stock}</Text>
    </View>
  );
  const renderItemByProduct = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.month}</Text>
      <Text style={styles.cell}>{item.totalImportInMonth || 0}</Text>
      <Text style={styles.cell}>{item.totalSoldInMonth || 0}</Text>
      <Text style={styles.cell}>{item.stock || 0}</Text>
    </View>
  );
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={{ margin: 10 }}>Lựa chọn:</Text>
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
            toggleModal("product");
          }}
        >
          <Text style={{ textAlign: "center", margin: 10 }}>
            --{" "}
            {selectedProduct.name !== ""
              ? selectedProduct.name
              : "Xem tất cả hàng tồn kho"}{" "}
            --
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={{ margin: 10 }}>Năm</Text>
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
              <Ionicons name="close-circle" size={25} color="lightgray" />
            </TouchableOpacity>
            <Text
              style={{
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: 10,
              }}
            >
              {isSelectYear ? "Chọn năm" : "Chọn sản phẩm"}
            </Text>

            <ScrollView style={{ backgroundColor: "white" }}>
              {isSelectYear ? (
                yearArray.map((item, key) => (
                  <TouchableOpacity
                    key={key}
                    style={{
                      borderColor: year === item ? color.origin : "lightgray",
                      borderWidth: year === item ? 2 : 1,
                      marginVertical: 5,
                      paddingVertical: 5,
                      marginHorizontal: 50,
                    }}
                    onPress={() => {
                      setYear(item);
                      toggleModal();
                    }}
                  >
                    <Text style={{ color: "black", textAlign: "center" }}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <>
                  <TouchableOpacity
                    style={{
                      borderColor:
                        selectedProduct.name === ""
                          ? color.origin
                          : "lightgray",
                      borderWidth: selectedProduct.name === "" ? 2 : 1,
                      marginVertical: 5,
                      paddingVertical: 5,
                      marginHorizontal: 50,
                    }}
                    onPress={() => {
                      setSelectedProduct({ name: "" });
                      closeModal();
                    }}
                  >
                    <Text style={{ color: "black", textAlign: "center" }}>
                      Xem tất cả hàng tồn kho
                    </Text>
                  </TouchableOpacity>
                  {products.map((item, key) => (
                    <TouchableOpacity
                      key={key}
                      style={{
                        //if selectedProduct === item, set borderwidth = 2 and borderColor = black,else set borderwidth = 1 and borderColor = lightgray
                        borderColor:
                          selectedProduct._id === item._id
                            ? color.origin
                            : "lightgray",
                        borderWidth: selectedProduct._id === item._id ? 2 : 1,
                        marginVertical: 5,
                        paddingVertical: 5,
                        marginHorizontal: 50,
                      }}
                      onPress={() => {
                        setSelectedProduct(item);
                        closeModal();
                      }}
                    >
                      <Text style={{ color: "black", textAlign: "center" }}>
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {selectedProduct.name === "" ? (
        <View style={styles.containerTable}>
          <View style={styles.header}>
            <Text style={styles.headerCell}>Tháng</Text>
            <Text style={styles.headerCell}>Đã nhập</Text>
            <Text style={styles.headerCell}>Đã bán</Text>
            <Text style={styles.headerCell}>Tồn kho</Text>
          </View>
          <FlatList
            data={totalStock}
            renderItem={renderItemByAllPrd}
            keyExtractor={(item) => item.month.toString()}
          />
        </View>
      ) : (
        <View style={styles.containerTable}>
          <View style={styles.header}>
            <Text style={styles.headerCell}>Tháng</Text>
            <Text style={styles.headerCell}>Đã nhập</Text>
            <Text style={styles.headerCell}>Đã bán</Text>
            <Text style={styles.headerCell}>Tồn kho</Text>
          </View>
          <FlatList
            data={productStats}
            renderItem={renderItemByProduct}
            keyExtractor={(item) => item.month}
          />
        </View>
      )}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </View>
  );
};

export default InventoryScreen;

const styles = StyleSheet.create({
  containerTable: {
    margin: 10,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 5,
  },
  header: {
    // borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  headerCell: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 15,
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  cell: {
    flex: 1,
    textAlign: "center",
    borderWidth: 1,
    borderColor: "lightgray",
    paddingVertical: 5,
    backgroundColor: "white",
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
});

// {results.length > 0 ? (
//   <FlatList
//     data={results}
//     renderItem={({ item }) => (
//       <View>
//         <Text>{item.name}</Text>
//         {item.result.map((i,index) => (
//           <View key={index} >
//             <Text>{i.month}</Text>
//             <Text>{i.stock}</Text>
//           </View>
//         ))}
//       </View>
//     )}
//     keyExtractor={(item) => item._id}
//   />
// ) : (
//   <Text>No data</Text>
// )}
