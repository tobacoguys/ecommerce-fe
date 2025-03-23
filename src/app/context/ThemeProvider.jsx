import { MyContext } from "./ThemeContext";
import { useEffect, useState } from "react";

const ThemeProvider = ({ children }) => {
    const [isLogin, setIsLogin] = useState(false);
    const [user, setUser] = useState({ name: "", email: "", userId: "" });
    const [isOpenProductModal, setIsOpenProductModal] = useState(false);
    const [ cartData, setCartData ] = useState([]);
    const [categoryData, setCategoryData] = useState([]);

    const getCartData = () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user?.userId) {
            fetchDataFromApi(`/api/cart?userId=${user.userId}`).then((res) => {
                setCartData(res);
              });          
        }
    };

    useEffect(() => {
        getCartData();
    }, []);

    useEffect(() => {
        fetchDataFromApi("/api/category").then((res) => {
            setCategoryData(res.categoryList);
        });
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            setIsLogin(true);
            const user = JSON.parse(localStorage.getItem("user"));
            setUser(user);
        } else {
            setIsLogin(false);
        }
    }, [isLogin]);

    const values = {
        isLogin,
        setIsLogin,
        cartData,
        setCartData,
        isOpenProductModal,
        setIsOpenProductModal,
        categoryData,
        setCategoryData,
    }
    return (
        <MyContext.Provider value={ values }>
            {children}
        </MyContext.Provider>
    );
};

export default ThemeProvider;