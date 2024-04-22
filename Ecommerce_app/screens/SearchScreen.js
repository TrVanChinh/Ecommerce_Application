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
  Dimensions,
  ScrollView,
  StyleSheet,
  FlatList,
  Pressable,
} from "react-native";
import {
  collection,
  doc,
  query,
  onSnapshot,
  getDocs,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import {
  AntDesign,
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
  Feather,
} from "@expo/vector-icons";
import color from "../components/color";
import Modal from "react-native-modals";

const SearchScreen = ({ navigation, route }) => {
  //   const searchInfo = route.params;
  //   console.log(searchInfo.search);
  const { height, width } = Dimensions.get("window");
  const [searchText, setSearchText] = useState("");
  const [product, setProduct] = useState([]);
  const [arrange, setArrange] = useState(false);
  const [searchStatus, setSearchStatus] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [maximumPrice,setMaximumPrice] = useState()
  const [minimumPrice,setMinimumPrice] = useState()
  const [updateTrigger, setUpdateTrigger] = useState(false);
  const [year, setYear] = useState([])
  const [itemYear, setItemYear] = useState()

  // const fetchData = async () => {
  //   //sử dụng toán tử array-contains của Firestore
  //   const q = query(collection(db, "product"), where("name", ">=", searchText),where("name", "<=", searchText + '\uf8ff'))
  //   const querySnapshot = await getDocs(q);
  //   querySnapshot.forEach((doc) => {
  //     console.log( doc.data().name);
  //   });

  // }
  // Hàm chuyển đổi chuỗi thành chữ thường và loại bỏ dấu
  function normalizeString(str) {
    return str
      .toLowerCase()
      .normalize("NFD") // Chuẩn hóa dấu
      .replace(/[\u0300-\u036f]/g, ""); // Loại bỏ dấu
  }

  const fetchData = async () => {
    const normalizedSearchText = normalizeString(searchText);
    const q = query(collection(db, "product"));
    const querySnapshot = await getDocs(q);
    const productsData = [];
    const ProductDataSuggests = [];

    for (const doc of querySnapshot.docs) {
      const normalizedProductName = normalizeString(doc.data().name);

      if (normalizedProductName.includes(normalizedSearchText)) {
        const productId = doc.id;
        const productData = doc.data();

        const imageSnapshot = await getDocs(
          collection(db, "product", productId, "image")
        );

        if (imageSnapshot.docs.length > 0) {
          const imageUrl = imageSnapshot.docs[0].data().url;
          productsData.push({
            id: productId,
            data: { ...productData, imageUrl },
          });
        }
      } else {
        // kiểm tra normalizedSearchText có chứa dấu cách không
        const hasSpace = normalizedSearchText.includes(" ");
        if (hasSpace) {
          const searchParts = normalizedSearchText.split(" ");
          if (normalizedProductName.includes(searchParts[0])) {
            const productId = doc.id;
            const productData = doc.data();

            const imageSnapshot = await getDocs(
              collection(db, "product", productId, "image")
            );

            if (imageSnapshot.docs.length > 0) {
              const imageUrl = imageSnapshot.docs[0].data().url;
              ProductDataSuggests.push({
                id: productId,
                data: { ...productData, imageUrl },
              });
            }
          }
        } else {
          const firstLetter = normalizedSearchText[0];
          if (normalizedProductName.includes(firstLetter)) {
            const productId = doc.id;
            const productData = doc.data();

            const imageSnapshot = await getDocs(
              collection(db, "product", productId, "image")
            );

            if (imageSnapshot.docs.length > 0) {
              const imageUrl = imageSnapshot.docs[0].data().url;
              ProductDataSuggests.push({
                id: productId,
                data: { ...productData, imageUrl },
              });
            }
          }
        }
      }
    }
    // productsData.map(product => {
    //   console.log("sort:",product.data.atCreate)
    // })
    
    if (productsData.length !== 0) {
      setSearchStatus(true);
      setProduct(productsData);
      getUniqueYears(productsData)
      // console.log(productsData)
    } else {
      setSearchStatus(false);
      setProduct(ProductDataSuggests);
    }
  };

  // Sắp xếp sản phẩm từ thấp đến cao
  const sortProductsByLowToHigh = (products) => {
    setArrange(!arrange);
    return products.sort((a, b) => {
      const priceA = parseInt(a.data.price, 10);
      const priceB = parseInt(b.data.price, 10);
      return priceA - priceB;
    });
  };

  // Sắp xếp sản phẩm từ cao đến thấp
  const sortProductsByHighToLow = (products) => {
    setArrange(!arrange);
    return products.sort((a, b) => {
      const priceA = parseInt(a.data.price, 10);
      const priceB = parseInt(b.data.price, 10);
      return priceB - priceA;
    });
  };

    const sortProductsBySold = (products) => {
      const sortProductsBySold = products.sort((a, b) => {
        const soldA = parseInt(a.data.sold, 10);
        const soldB = parseInt(b.data.sold, 10);
        return soldB - soldA;
      });
      // In ra mảng đã sắp xếp
    setProduct(sortProductsBySold);
    setUpdateTrigger(prevState => !prevState);
    };

  // Sắp xếp sản phẩm bán chạy nhất
  // const sortProductsBySold = (products) => {
  //   return products.sort((a, b) => {
  //     const soldA = parseInt(a.data.slod, 10);
  //     const soldB = parseInt(b.data.slod, 10);
  
  //     // Sử dụng điều kiện kiểm tra để xử lý trường hợp 'sold' bằng 0 hoặc giá trị bằng nhau
  //     if (soldA === soldB) {
  //       // Nếu giá trị 'sold' bằng nhau, sử dụng thuộc tính 'name' để sắp xếp
  //       const nameA = a.data.name || '';
  //       const nameB = b.data.name || '';
  //       return nameA.localeCompare(nameB);
  //     } else {
  //       // Sắp xếp theo giá trị 'sold' giảm dần
  //       return soldB - soldA;
  //     }
  //   });
  // };

  // Sắp xếp mảng theo điều kiện atCreate từ mới nhất đến cũ nhất
  const sortByCreatedAt = (products) => {
    const sortbyCreateAtproduct=products.sort((a, b) => {
      const aTimestamp = a.data.atCreate.seconds * 1000 + a.data.atCreate.nanoseconds / 1e6;
      const bTimestamp = b.data.atCreate.seconds * 1000 + b.data.atCreate.nanoseconds / 1e6;
      // So sánh theo timestamp
      return bTimestamp - aTimestamp;
    });
    // In ra mảng đã sắp xếp
    setProduct(sortbyCreateAtproduct);
    setUpdateTrigger(prevState => !prevState);
    product.map(product => {
      console.log("ssss:",product.data.atCreate)
    })
    
  };

  const getYearFromAtCreate = (atCreate) => {
    const atCreateTimestamp = new Date(atCreate.seconds * 1000 + atCreate.nanoseconds / 1e6);
    return atCreateTimestamp.getFullYear();
  };

  const getUniqueYears = (product) => {
    const uniqueYears = [];
  
    product.forEach((product) => {
      const atCreate = product.data.atCreate;
      const year = getYearFromAtCreate(atCreate)
  
      // Kiểm tra xem năm đã tồn tại trong mảng chưa
      if (!uniqueYears.includes(year)) {
        uniqueYears.push(year);
      }
    });
    setYear(uniqueYears);
    setItemYear()
    console.log("nam",year)
  };
  

  const filterProduct = (products, minPrice, maxPrice) => {
    if(searchStatus === true) {
      const filteredProducts = products.filter(product => {
        const price = product.data.price;
        const atCreate = product.data.atCreate;
        const year = getYearFromAtCreate(atCreate)
        if(itemYear && maxPrice && minPrice) {
          return year === itemYear && price >= minPrice && price <= maxPrice;
        } else if (itemYear && maxPrice) {
          return year === itemYear && price <= maxPrice
        } else if (itemYear && minPrice) {
          return year === itemYear && price >= minPrice
        } else if (itemYear) {
          return year === itemYear
        } else if(maxPrice && minPrice) {
          return price >= minPrice && price <= maxPrice;
        } else if (maxPrice) {
          return price <= maxPrice
        } else if (minPrice) {
          return price >= minPrice
        } 
      });
      setProduct(filteredProducts);
      setModalVisible(!isModalVisible);

    }
  }

  // Điều hướng sang màn hình chi tiết và gửi ID của sản phẩm
  const handleItem = (product) => {
    navigation.navigate("Detail", { product });
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  return (
    <>
      <View style={{ flex: 1, paddingTop: 30 }}>
        <View
          style={{
            height: 60,
            marginHorizontal: 20,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              if (searchText == "") {
                alert("Xin mời bạn nhập sản phẩm");
              } else {
                fetchData();
              }
            }}
          >
            <Feather name="search" size={24} color="#857E7C" />
          </TouchableOpacity>
          <TextInput
            onChangeText={(text) => {
              setSearchText(text);
            }}
            style={{
              height: 35,
              flex: 1,
              marginHorizontal: 10,
              borderRadius: 5,
              opacity: 0.5,
              paddingStart: 30,
              borderWidth: 1,
            }}
            autoCorrect={false}
          />
          <Pressable onPress={toggleModal}>
            <Feather name="filter" size={24} color="#857E7C"/>
          </Pressable>
        </View>
        {/* <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          paddingHorizontal: 10,
        }}
      >
      </View> */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            paddingHorizontal: 10,
          }}
        >
          <Pressable style={styles.buttonArrange}
            onPress={() => sortByCreatedAt(product)}
          >
            <Text style={{ color: color.origin }}>Mới nhất</Text>
          </Pressable>
          <Pressable style={styles.buttonArrange}
            onPress={() => sortProductsBySold(product)}
          >
            <Text style={{ color: color.origin }}>Bán chạy</Text>
          </Pressable>
          {arrange ? (
            <Pressable
              style={styles.buttonArrange}
              onPress={() => sortProductsByLowToHigh(product)}
            >
              <Text style={{ color: color.origin, paddingRight: 2 }}>Giá</Text>
              <AntDesign name="caretdown" size={24} color={color.origin} />
            </Pressable>
          ) : (
            <Pressable
              style={styles.buttonArrange}
              onPress={() => sortProductsByHighToLow(product)}
            >
              <Text style={{ color: color.origin, paddingRight: 2 }}>Giá</Text>
              <AntDesign name="caretup" size={24} color={color.origin} />
            </Pressable>
          )}
        </View>
        {searchStatus ? (
          <View style={{ flex: 1 }}>
            <FlatList
              numColumns={2}
              data={product}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity
                    onPress={() => handleItem(item)}
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      paddingLeft: 5,
                    }}
                  >
                    <View
                      style={{
                        width: width / 2,
                      }}
                    >
                      <Image
                        style={{
                          width: width / 2.5,
                          height: height / 4,
                          resizeMode: "cover",
                          borderRadius: 25,
                          margin: 10,
                        }}
                        source={{
                          uri: item.data.imageUrl,
                        }}
                      />
                      <View
                        style={{
                          width: 50,
                          position: "absolute",
                          marginTop: 20,
                          alignItems: "flex-end",
                          backgroundColor: "red",
                        }}
                      >
                        <Text style={{ color: "yellow" }}>
                          {item.data.discount}%
                        </Text>
                      </View>
                    </View>
                    <View style={{ width: width / 2 }}>
                      <Text
                        numberOfLines={1}
                        style={{ fontSize: 15, color: "red" }}
                      >
                        {item.data.name}
                      </Text>
                    </View>
                    <View style={{  width: width / 2, paddingBottom: 10 }}>
                      <Text
                        style={{
                          textAlign: "center",
                          fontSize: 20,
                          color: "red",
                        }}
                      >
                        {item.data.price}đ
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
            ></FlatList>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <View
              style={{
                width: width,
                height: height / 7,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: color.origin }}>
                Không tìm thấy sản phẩm nào
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: 20,
              }}
            >
              <View
                style={{ flex: 1, height: 1, backgroundColor: "#D5DBCD" }}
              ></View>
              <Text style={{ color: color.origin }}>Có thể bạn cũng thích</Text>
              <View
                style={{ flex: 1, height: 1, backgroundColor: "#D5DBCD" }}
              ></View>
            </View>
            <FlatList
              numColumns={2}
              data={product}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity
                    onPress={() => handleItem(item)}
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      paddingLeft: 5,
                    }}
                  >
                    <View
                      style={{
                        width: width / 2,
                      }}
                    >
                      <Image
                        style={{
                          width: width / 2.5,
                          height: height / 4,
                          resizeMode: "cover",
                          borderRadius: 25,
                          margin: 10,
                        }}
                        source={{
                          uri: item.data.imageUrl,
                        }}
                      />
                      <View
                        style={{
                          width: 50,
                          position: "absolute",
                          marginTop: 20,
                          alignItems: "flex-end",
                          backgroundColor: "red",
                        }}
                      >
                        <Text style={{ color: "yellow" }}>
                          {item.data.discount}%
                        </Text>
                      </View>
                    </View>
                    <View style={{ width: width / 2 }}>
                      <Text
                        numberOfLines={1}
                        style={{ fontSize: 15, color: "red" }}
                      >
                        {item.data.name}
                      </Text>
                    </View>
                    <View style={{ width: 100, paddingBottom: 10 }}>
                      <Text
                        style={{
                          textAlign: "center",
                          fontSize: 20,
                          color: "red",
                        }}
                      >
                        {item.data.price}đ
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
            ></FlatList>
          </View>
        )}
      </View>
      <Modal
        visible={isModalVisible}
        animationDuration={600}
        swipeDirection="right"
        swipeThreshold={100}
        modalStyle={{
          width: width,
          height: height/2,
          backgroundColor: 'white',
          marginTop:30,
        }}
        onTouchOutside={toggleModal}
        onSwipeOut={toggleModal}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ marginTop:10, fontWeight: "bold", alignSelf: 'center'}}>Bộ lọc tìm kiếm</Text>
          <View style={{ height: "80%", padding:10}}>
            <View>
              <Text>Khoảng giá (đ)</Text>
              <View style={{ flexDirection: "row", paddingVertical:10 , alignItems:'center'}}>
              <TextInput
                onChangeText={(text) => {
                  setMinimumPrice(text);
                }}
                style={{
                  height: 35,
                  flex: 1,
                  marginHorizontal: 10,
                  borderRadius: 5,
                  paddingStart: 30,
                  borderWidth: 0.5,
                }}
                autoCorrect={false}
                value={minimumPrice}
                placeholder="TỐI THIỂU"
                keyboardType="numeric"
              />
              <Text>-</Text>
              <TextInput
                onChangeText={(text) => {
                  setMaximumPrice(text);
                }}
                style={{
                  height: 35,
                  flex: 1,
                  marginHorizontal: 10,
                  borderRadius: 5,
                  opacity: 0.5,
                  paddingStart: 30,
                  borderWidth: 1,
                }}
                autoCorrect={false}
                value={maximumPrice}
                placeholder="TỐI ĐA"
                keyboardType="numeric"
              />
              </View>
            </View>
            <View>
              <Text>Năm</Text>
              <FlatList
                style={{height:height*0.4, width:width*0.6, alignSelf:'center', }}
                data={year}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                    <Pressable 
                      onPress={() => {
                        setItemYear(item);
                      }}
                      style={{
                        flexDirection:'row', 
                        marginTop:10, 
                        width:"100%",
                        alignItems:'center', 
                        borderWidth: 0.5, 
                        borderColor: "#D8D8D8", 
                        padding:5, 
                        backgroundColor: itemYear === item? "#f95122" : "white", }}>
                      <Text style={{ fontSize: 18 , alignSelf:'center', color: itemYear === item ? "white" : "black"}}>{item}</Text>
                    </Pressable>
                )}
              />
            </View>
            <Text>Nội dung</Text>
          </View>
          <View style={{padding:5, flexDirection:'row', alignSelf: 'center' }}>
          <TouchableOpacity 
            style={{ width: 100, alignItems: 'center', borderWidth: 0.5, padding:10}}
            onPress={toggleModal}>
            <Text>Thiết lập lại</Text>
          </TouchableOpacity>
          <View style={{ width: 10}}></View>
          <TouchableOpacity 
            style={{ width: 100, alignItems: 'center', borderWidth: 0.5, padding:10}}
            onPress={() => filterProduct(product, minimumPrice,maximumPrice)}>
            <Text>Áp dụng</Text>
          </TouchableOpacity>
          </View>
          
        </View>
      </Modal>
      
    </>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  buttonArrange: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    borderWidth: 0.5,
    justifyContent: "center",
    height: 40,
  },
});
