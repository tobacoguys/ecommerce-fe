import { MyContext } from "./ThemeContext";
import { useEffect, useState } from "react";
import axios from "axios";

const ThemeProvider = ({ children }) => {
    const [isLogin, setIsLogin] = useState(false);
    const [user, setUser] = useState({ name: "", email: "", userId: "" });
    const [isOpenProductModal, setIsOpenProductModal] = useState(false);
    const [ cartData, setCartData ] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [productData, setProductData] = useState([]);
    const [countryList, setCountryList] = useState([]);
    const [alertBox, setAlertBox] = useState({
        msg: "",
        error: false,
        open: false,
    });

    const getCartData = () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user?.userId) {
            fetchDataFromApi(`/api/cart?userId=${user.userId}`).then((res) => {
                setCartData(res);
              });          
        }
    };

    const openProductDetailsModal = (id, status) => {
        fetchDataFromApi(`/api/product/${id}`).then((res) => {
            setProductData(res);
            setIsOpenProductModal(status);
        });
    }

    const getCountry = async (url) => {
        const responsive = await axios.get(url).then((res) => {
          setCountryList(res.data.data)
        })
      }

    useEffect(() => {
        getCountry("https://countriesnow.space/api/v0.1/countries/");
    }, []);

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