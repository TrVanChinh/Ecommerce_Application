import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { AntDesign, Ionicons } from "@expo/vector-icons";

const SubcategoryScreen = ({ navigation, route }) => {
  const { subcategories: subcategories } = route.params;
  const {isUpdate:isUpdate} = route.params;
  return (
    <View>
      <FlatList
        data={subcategories}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={
              () => !isUpdate?
                navigation.navigate("AddProduct", {
                  idCategory:item.category,
                  idSubcategory: item.idSubcate,
                  nameSubcategory: item.nameSubcate,
                }):
                navigation.navigate("EditProduct", {
                  idCategory:item.category,
                  idSubcategory: item.idSubcate,
                  nameSubcategory: item.nameSubcate,
                })
              // selectSubcategory(item.idSubcate,item.nameSubcate)
            }
            style={[styles.list_items, { marginVertical: 5 }]}
          >
            <View
              style={{
                alignItems: "flex-start",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Ionicons name="list" size={25} marginLeft={10} color="gray" />
              <Text style={{ marginLeft: 10 }}> {item.nameSubcate} </Text>
            </View>
            <View
              style={{
                alignItems: "flex-end",
                flexDirection: "row",
                alignItems: "center",
                marginRight: 15,
              }}
            >
              <AntDesign
                marginLeft={25}
                name="plus"
                size={20}
                color="#60698a"
              />
            </View>
          </TouchableOpacity>
         )}
      />
    </View>
  );
};

export default SubcategoryScreen;

const styles = StyleSheet.create({
  list_items: {
    backgroundColor: "white",
    marginBottom: 5,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
