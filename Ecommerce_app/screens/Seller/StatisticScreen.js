import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import {
  SimpleLineIcons,
  AntDesign,
  Entypo,
  Octicons,
  MaterialIcons,
  FontAwesome5,
  FontAwesome6,
} from "@expo/vector-icons";
import color from "../../components/color";

const StatisticScreen = ({ navigation }) => {
  return (
    <ScrollView>
      {/* Doanh thu */}
      <TouchableOpacity
        style={styles.list_items}
        onPress={() => navigation.navigate("Revenue")}
      >
        <View
          style={{
            alignItems: "flex-start",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <FontAwesome6
            name="sack-dollar"
            size={25}
            marginLeft={10}
            color={color.origin}
          />
          <Text style={styles.txtMenuTag}> Doanh thu</Text>
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
      {/* Tiền lời */}

      <TouchableOpacity
        style={styles.list_items}
        onPress={() => navigation.navigate("Profit")}
      >
        <View
          style={{
            alignItems: "flex-start",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <FontAwesome6
            name="money-bill-trend-up"
            size={25}
            marginLeft={10}
            color={color.origin}
          />
          <Text style={styles.txtMenuTag}> Lợi nhuận</Text>
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
      {/* Hàng tồn */}

      <TouchableOpacity
        style={styles.list_items}
        onPress={() => navigation.navigate("Inventory")}
      >
        <View
          style={{
            alignItems: "flex-start",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <MaterialIcons
            name="inventory-2"
            size={25}
            marginLeft={10}
            color={color.origin}
          />
          <Text style={styles.txtMenuTag}> Sản phẩm tồn kho</Text>
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
      {/* Khách hàng */}

      <TouchableOpacity
        style={styles.list_items}
        onPress={() => navigation.navigate("Customer")}
      >
        <View
          style={{
            alignItems: "flex-start",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <FontAwesome6
            name="people-group"
            size={20}
            marginLeft={8}
            color={color.origin}
          />
          <Text style={styles.txtMenuTag}> Khách hàng</Text>
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
    </ScrollView>
  );
};

export default StatisticScreen;

const styles = StyleSheet.create({
  list_items: {
    marginVertical: 1,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    padding: 10,
    justifyContent: "space-between",
    backgroundColor: "white",
  },

  txtMenuTag: {
    fontSize: 16,
    marginLeft: 10,
    color: color.text,
  },
});
