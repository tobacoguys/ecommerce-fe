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
    const [addingInCart, setAddingInCart] = useState(false);

    const getCartData = () => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user?.userId) {
            fetchDataFromApi(`/api/cart?userId=${user.userId}`).then((res) => {
                setCartData(res);
              });          
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
    
        if (token) {
          setIsLogin(true);
          const userData = JSON.parse(localStorage.getItem("user"));
          setUser(userData);
        } else {
          setIsLogin(false);
        }
      }, [isLogin]);

    const openProductDetailsModal = (id, status) => {
        fetchDataFromApi(`/api/product/${id}`).then((res) => {
            setProductData(res);
            setIsOpenProductModal(status);
        });
    }

    const getCountry = async (url) => {
        await axios.get(url).then((res) => {
          setCountryList(res.data.data);
        });
      };

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
          return;
        }
        setAlertBox({ open: false });
    };
      
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
      
    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        getCountry("https://countriesnow.space/api/v0.1/countries/");
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

    const addToCart = (data) => {
        if (isLogin) {
          setAddingInCart(true);
          postData(`/api/cart/add`, data).then((res) => {
            if (res.status !== false) {
              setAlertBox({
                open: true,
                error: false,
                msg: "Item is added in the cart",
              });
    
              setTimeout(() => {
                setAddingInCart(false);
              }, 1000);
    
              getCartData();
            } else {
              setAlertBox({
                open: true,
                error: true,
                msg: res.msg,
              });
              setAddingInCart(false);
            }
          });
        } else {
          setAlertBox({
            open: true,
            error: true,
            msg: "Please login first",
          });
        }
      };

    const values = {
        isLogin,
        setIsLogin,
        cartData,
        setCartData,
        isOpenProductModal,
        setIsOpenProductModal,
        categoryData,
        setCategoryData,
        productData,
        setProductData,
        countryList,
        setCountryList,
        addingInCart,
        setAddingInCart,
        addToCart,
        openProductDetailsModal,
        handleClose,
        alertBox,
        setAlertBox,
    }
    return (
        <MyContext.Provider value={ values }>
            {children}
        </MyContext.Provider>
    );
};

export default ThemeProvider;