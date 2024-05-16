import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [product, setProduct] = useState(null)
  const [address, setAddress] = useState(null)
  const [shippingUnit, setShippingUnit] = useState(null)
  const [completedOrder, setCompletedOrder] = useState([]);

  const updateUser = (newUser) => { 
    setUser(newUser);
  };
  const updateProduct = (newProduct) => {
    setProduct(newProduct);
  };
  const updateAddress = (newAddress) => {
    setAddress(newAddress);
  };
  const updateShippingUnit = (newShippingUnit) => {
    setShippingUnit(newShippingUnit);
  };
  const updateCompletedOrder = (newOrderItemList) => {
    setCompletedOrder(newOrderItemList);
  };
  return (
    <UserContext.Provider value={{ user, updateUser, product ,updateProduct, address, updateAddress, shippingUnit, updateShippingUnit, completedOrder, updateCompletedOrder}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};