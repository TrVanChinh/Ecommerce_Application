import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    SafeAreaView,
    FlatList,
    TouchableOpacity,
    Image,
    Dimensions,
    Pressable,
  } from "react-native";
  import React, { useState, useEffect, useLayoutEffect } from "react";
  import {
    AntDesign,
    MaterialCommunityIcons,
    MaterialIcons,
    Ionicons,
    Feather,
  } from "@expo/vector-icons";
  import slides from "../slide/slides";
  import {
    collection,
    doc,
    query,
    onSnapshot,
    getDoc,
    setDoc,
    getDocs,
    updateDoc,
    addDoc
  } from "firebase/firestore";
  import { db } from "../firebase";
  import { useRoute } from "@react-navigation/native";
  import { BottomModal, SlideAnimation, ModalContent } from "react-native-modals";
  import { useUser } from '../UserContext';
  
  const DetailScreen = ({ navigation ,route }) => {
    const { height, width } = Dimensions.get("window");
    const [selectIndex, setSelectIndex] = useState(0);
    const { product } = route.params;
    const [listImage, setListImage] = useState([]);
    const [shop, setShop] = useState([]);
    const [option,setOption] = useState([])
    const [idOption, setIdOption] = useState()
    const [quantity,setQuantity] = useState(1)
    const [modalVisible, setModalVisible] = useState(false);
    const [buyButtonClicked, setBuyButtonClicked] = useState(false);
    const productId = product.id;
    const ShopId = product.data.idShop;
    const { user } = useUser();
    console.log(product)
    // console.log("infoUser",user.user.uid)
    // useLayoutEffect(() => {
    //   const GetImage = onSnapshot(
    //     query(collection(doc(collection(db, "product"), productId), "image")),
    //     (snapshot) =>
    //       setListImage(
    //         snapshot.docs.map((doc) => ({
    //           id: doc.id,
    //           data: doc.data(),
    //         }))
    //       )
    //   );
    //   return () => {
    //     GetImage();
    //   };
    // }, [productId]);
  
    useEffect(() => {
      const GetImage = async () => {
        try {
          const imageQuery = query(
            collection(doc(collection(db, "product"), productId), "image")
          );
          const snapshot = await getDocs(imageQuery);
          const images = snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }));
          setListImage(images);
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu ảnh:", error);
        }
      };
  
      const GetOption = async () => {
        try {
          const optionQuery = query(
            collection(doc(collection(db, "product"), productId), "option")
          );
          const snapshot = await getDocs(optionQuery);
          const options = snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }));
          setOption(options);
          console.log(options)
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu ảnh:", error);
        }
      };
  
      const fetchShopData = async () => {
        try {
          const userDocRef = doc(db, "user", ShopId);
          const docSnapshot = await getDoc(userDocRef);
  
          if (docSnapshot.exists()) {
            const userData = { id: docSnapshot.id, data: docSnapshot.data() };
            setShop(userData);
          } else {
            console.log("Document không tồn tại cho ShopId:", ShopId);
          }
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu:", error);
        }
      };
   
      fetchShopData();
      GetImage();
      GetOption();
    }, [productId, ShopId]);
  
    const addToCart = async (userId, productId, optionProductId, quantity) => {
        try {
          // Kiểm tra xem người dùng đã có giỏ hàng chưa
          const userDocRef = doc(db, 'user', userId);
          const userDocSnapshot = await getDoc(userDocRef);
          if (userDocSnapshot.exists()) {
            // Nếu người dùng đã có giỏ hàng, thêm sản phẩm vào giỏ hàng
            const cartCollectionRef = collection(userDocRef, 'cart');
            const productDocRef = doc(cartCollectionRef, optionProductId);
  
            const productDocSnapshot = await getDoc(productDocRef);
            if (productDocSnapshot.exists()) {
              // Nếu sản phẩm đã tồn tại trong giỏ hàng, cập nhật số lượng
              await updateDoc(productDocRef, {
                quantity: productDocSnapshot.data().quantity + quantity,
              });
            } else {
              // Nếu sản phẩm chưa tồn tại trong giỏ hàng, thêm mới vào giỏ hàng
              await setDoc(productDocRef, {
                productId,
                optionProductId,
                quantity,
              });
            }
      
            console.log('Sản phẩm đã được thêm vào giỏ hàng thành công.');
          } else {
            console.log('Người dùng không tồn tại.');
          }
        } catch (error) {
          console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error);
      }
    };
  
    const handleShop = () => {
      navigation.navigate("Shop", {shop});
    };
  
    return (
      <>
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView style={{ flex: 1 }}>
            <View style={{ height: height / 2 }}>
              <FlatList
                pagingEnabled
                horizontal
                onScroll={(e) => {
                  setSelectIndex(
                    (e.nativeEvent.contentOffset.x / width).toFixed(0)
                  );
                }}
                data={listImage}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                  return (
                    <Image
                      style={{
                        width: width,
                        height: height / 2,
                      }}
                      // source={item.image}
                      source={{ uri: item.data.url }}
                    />
                  );
                }}
              />
              <View
                style={{
                  width: width,
                  height: 40,
                  position: "absolute",
                  bottom: 0,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {listImage.map((slide, index) => {
                  return (
                    <View
                    key={index}
                      style={{
                        backgroundColor:
                          selectIndex == index ? "#8e8e8e" : "#f2f2f2",
                        height: 5,
                        width: 30,
                      }}
                    ></View>
                  );
                })}
              </View>
            </View>
            <View
              style={{
                position: "absolute",
                flexDirection: "row",
                alignItems: "center",
                padding: 20,
              }}
            >
              <Ionicons
                name="chevron-back-circle"
                size={30}
                color="#858585"
                style={{}}
              />
              <View style={{ flex: 1 }} />
              <Ionicons name="cart" size={30} color="#858585" right={0} />
            </View>
            <View style={{ paddingBottom: 10, paddingLeft: 5 }}>
              <Text style={{ fontSize: 20 }}>{product.data.name}</Text>
              <Text style={{ color: "red", fontSize: 20 }}>
                {product.data.price}đ
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignContent: "center",
                paddingBottom: 10,
                paddingLeft: 5,
              }}
            >
              <View style={{ flex: 1, flexDirection: "row" }}>
                <Ionicons name="ios-star" size={24} color="yellow" />
                <Text>4.9</Text>
              </View>
              <Text style={{ flex: 1 }}>Đã bán 1.2k</Text>
              <View style={{ flex: 1, flexDirection: "row", paddingStart: 40 }}>
                <TouchableOpacity
                  style={{ alignItems: "center", paddingRight: 20 }}
                >
                  <AntDesign name="hearto" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={{ alignItems: "center" }}>
                  <AntDesign name="sharealt" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                paddingLeft: 5,
                height: height / 10,
                flexDirection: "row",
                alignItems: "center",
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderColor: "lightgray",
              }}
            >
              {/* <Image
                style={{ width: width / 5, height: height / 12 }}
                source={{
                  uri: shop.data.photo,
                }}
              /> 
              <Text style={{ fontWeight: "bold", paddingLeft:10 }}>{shop.data.name}</Text>
              <TouchableOpacity
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                  borderRadius: 5,
                  paddingStart: 10,
                  marginStart: 70,
                  borderWidth: 1,
                  borderColor: "#F1582C",
                }}
              >
                <Text style={{ color: "#F1582C", fontSize: 16 }}>Xem shop</Text>
              </TouchableOpacity> */}
              {shop.data ? (
                <>
                  <Image
                    style={{ width: width / 5, height: height / 12 }}
                    source={{
                      uri: shop.data.photo,
                    }}
                  />
                  <Text style={{ fontWeight: "bold", paddingLeft: 10 }}>
                    {shop.data.shopName}
                  </Text>
                  <TouchableOpacity
                    style={{
                      paddingVertical: 10,
                      paddingHorizontal: 15,
                      borderRadius: 5,
                      paddingStart: 10,
                      marginStart: 70,
                      borderWidth: 1,
                      borderColor: "#F1582C",
                    }}
                    onPress={() => handleShop()}
                  >
                    <Text style={{ color: "#F1582C", fontSize: 16 }}>
                      Xem shop
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <Text>Loading...</Text>
              )}
            </View>
            <View style={{ paddingTop: 10, paddingLeft: 5 }}>
              <Text style={{ fontWeight: "bold"}}>Mô tả sản phẩm:</Text>
              <Text style={{ padding: 10}}>{product.data.description}</Text>
            </View>
  
            {/* <View>
              <FlatList
                horizontal
                style={{ flex: 1 }}
                keyExtractor={(item) => item.id}
                data={firstFourImage}
                renderItem={({ item, index }) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        setSelectImage(index)
                      }}
                      style={{
                        width: width/4,
                        height: height/5,
                        borderWidth: 2,
                        borderColor:"#fff"
                      }}
                    >
                      <Image
                        style={{width:'100%', height:'100%'}}
                        source={item.image}
                      />
                    </TouchableOpacity>
                  );
                }}
              />
            </View> */}
          </ScrollView>
          <View
            style={{
              height: height / 12,
              backgroundColor: "red",
              flexDirection: "row",
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: "#12B3AF",
                alignItems: "center",
                justifyContent: "center",
                borderRightColor: "black",
              }}
            >
              <AntDesign name="message1" size={24} color="white" />
              <Text style={{ color: "white", fontSize: 10 }}>Chat ngay</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: "#0CD44C",
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => {
                setModalVisible(!modalVisible)
                setBuyButtonClicked(false)
              }}
            >
              <MaterialCommunityIcons name="cart-plus" size={24} color="white" />
              <Text style={{ color: "white", fontSize: 10 }}>
                Thêm vào giỏ hàng
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 2,
                backgroundColor: "red",
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => {
                setModalVisible(!modalVisible)
                setBuyButtonClicked(true)
              }}
            >
              <Text style={{ color: "white" }}>Mua sản phẩm</Text>
            </TouchableOpacity>
          </View>
  
        </SafeAreaView>
        <BottomModal
          onBackdropPress={() => setModalVisible(!modalVisible)}
          swipeDirection={["up", "down"]}
          swipeThreshold={200}
          modalAnimation={
            new SlideAnimation({
              slideFrom: "bottom",
            })
          }
          onHardwareBackPress={() => setModalVisible(!modalVisible)}
          visible={modalVisible}
          onTouchOutside={() => setModalVisible(!modalVisible)}
        >
          <ModalContent style={{ width: "100%", height: height/1.6, alignItems:'center' }}>
              <View style={{  justifyContent: 'space-between', width: '90%' }}>
              <Text>Lựa chọn:</Text>
                <FlatList
                  style={{height:height/2.4,}}
                  data={option}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <View style={{marginTop:10, backgroundColor: idOption === item.id ? "#f95122" : "white"}}>
                    <Pressable 
                      onPress={() => {
                        setIdOption(item.id);
                      }}
                      style={{flexDirection:'row', alignItems:'center', borderWidth: 0.5, borderColor: "#D8D8D8", padding:5,  }}>
                      <Image
                        style={{ width: 50, height: 50}}
                        source={{uri: item?.data.image}}
                      />
                      <Text style={{ fontSize: 14 , color: idOption === item.id ? "white" : "black"}}>{item.data.name}</Text>
                    </Pressable>
                    </View>
                  )}
                />
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10,}}>
                  <Text>Số lượng:      </Text>
                  {quantity > 1 ? (
                    <Pressable
                      onPress={() => setQuantity(quantity-1)}
                      style={{
                        backgroundColor: "#D8D8D8",
                        padding: 7,
                        borderTopLeftRadius: 6,
                        borderBottomLeftRadius: 6,
                      }}
                    >
                      <AntDesign name="minus" size={24} color="black" />
                    </Pressable>
                  ) : (
                    <Pressable
                      style={{
                        backgroundColor: "#6E7280",
                        padding: 7,
                        borderTopLeftRadius: 6,
                        borderBottomLeftRadius: 6,
                      }}
                    >
                      <AntDesign name="minus" size={24} color="black" />
                    </Pressable>
                  )}
  
                  <Pressable
                    style={{
                      backgroundColor: "white",
                      paddingHorizontal: 18,
                      paddingVertical: 6,
                    }}
                  >
                    <Text>{quantity}</Text>
                  </Pressable>
  
                  <Pressable
                    onPress={() => setQuantity(quantity+1)}
                    style={{
                      backgroundColor: "#D8D8D8",
                      padding: 7,
                      borderTopLeftRadius: 6,
                      borderBottomLeftRadius: 6,
                    }}
                  >
                    <Feather name="plus" size={24} color="black" />
                  </Pressable>
                </View>
                </View>  
                {buyButtonClicked ? (
                  <Pressable 
                  style={{
                    width:"100%",
                    height: 40,
                    alignItems:'center',
                    justifyContent:'center',
                    backgroundColor: idOption ? "red" : "gray",
                  }} 
                  // onPress={() => {
                  //   if (idOption) {
                  //     user !== null ? addToCart(user.user.uid, productId, idOption , quantity) : navigation.navigate('Login'), setModalVisible(!modalVisible);
                  //   }                
                  // }}
                >
                  <Text  style={{ color:"white"}}>Mua</Text>
                </Pressable>
                ): (
                  <Pressable 
                  style={{
                    width:"100%",
                    height: 40,
                    alignItems:'center',
                    justifyContent:'center',
                    backgroundColor: idOption ? "red" : "gray",
                  }} 
                  onPress={() => {
                    if (idOption) {
                      user !== null ? addToCart(user.user.uid, productId, idOption , quantity) : navigation.navigate('Login'), setModalVisible(!modalVisible);
                    }                
                  }}
                >
                  <Text  style={{ color:"white"}}>Thêm vào giỏ hàng</Text>
                </Pressable>
                )}
                
          </ModalContent>
        </BottomModal>
      </>
    );
  };
  
  export default DetailScreen;
  
  const styles = StyleSheet.create({});
  