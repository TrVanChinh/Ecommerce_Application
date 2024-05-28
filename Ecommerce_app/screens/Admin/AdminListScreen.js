import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
  Button,
  Alert,
} from "react-native";
import { API_BASE_URL } from "../../Localhost";
import axios from "axios";

const AdminListScreen = () => {
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const getAdminList = async () => {
    try {
      await axios.get(`${API_BASE_URL}/admin/showAdmin`).then((response) => {
        console.log(response.data);
        setData(response.data.data);
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAdminList();
  }, []);

  const handleAddUser = async () => {
    if (name && email && password) {
      await axios
        .post(`${API_BASE_URL}/admin/addAdmin`, {
          name: name,
          email: email,
          password: password,
        })
        .then((response) => {
          console.log(response.data);
        });
      getAdminList();
      Alert.alert("Success", "Thêm admin thành công");
      setName("");
      setEmail("");
      setPassword("");
    } else {
      Alert.alert("Error", "Please fill out all fields");
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            color: "#f74600",
            marginVertical: 10,
            textAlign: "center",
          }}
        >
          Thêm tài khoản Admin
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Tên"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Button color={"#f74600"} title="Thêm" onPress={handleAddUser} />
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.email}>{item.email}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default AdminListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  itemContainer: {
    padding: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#f7f7f7",
    backgroundColor: "#ededed",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  email: {
    fontSize: 16,
    color: "gray",
  },
  inputContainer: {
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingHorizontal: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});
