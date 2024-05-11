import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SimpleLineIcons, Ionicons } from "@expo/vector-icons";
import { API_BASE_URL } from "../../../Localhost";
import axios from "axios";

const CategoryScreen = ({ route, navigation }) => {
  const { categories: categories } = route.params;
  const [subcategories, setSubcategory] = useState([]);
  const { isUpdate: isUpdate } = route.params;

  useEffect(() => {
    // console.log(subcategories);

    if (subcategories.length > 0) {
      if (isUpdate) {
        navigation.navigate("SelectSubcategory", {
          subcategories: subcategories,
          isUpdate: true,
        });
      } else {
        // console.log(subcategories.idSubcate)
        navigation.navigate("SelectSubcategory", {
          subcategories: subcategories,
        });
      }
    }
  }, [subcategories, navigation]);

  const getSubcategory = (idCategory) => {
    axios.get(`${API_BASE_URL}/admin/Category/${idCategory}`)
    .then(function (response) {
      setSubcategory(response.data.data.subCategory.map((item) => ({idSubcate: item._id, nameSubcate : item.name, category: idCategory}))) ;
      navigation.navigate("SelectSubcategory", { subcategories: subcategories });
    })
    .catch(function (error) {
      console.log(error);
    });
  // console.log(idCategory)
  };

  return (
    <View>
      <FlatList
        data={categories}
        renderItem={({ item }) => (
          <TouchableOpacity
            // onPress={() => navigation.navigate("SelectSubcategory")
            onPress={() => getSubcategory(item.idCategory)}
            style={[styles.list_items, { marginVertical: 5 }]}
          >
            <View
              style={{
                alignItems: "flex-start",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={{ marginLeft: 10 }}> {item.nameCategory} </Text>
            </View>
            <View
              style={{
                alignItems: "flex-end",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <SimpleLineIcons
                marginLeft={15}
                name="arrow-right"
                size={10}
                color="#60698a"
              />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default CategoryScreen;

const styles = StyleSheet.create({
  list_items: {
    backgroundColor: "white",
    marginBottom: 5,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  imgCategory: {
    width: 70,
    height: 70,
  },
});
