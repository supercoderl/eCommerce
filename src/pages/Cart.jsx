import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import ApiService from "../services/apiService";
import { toast } from "react-toastify";
import Loader from "../components/Loader/Loader";
import { Form, Formik } from "formik";
import * as Yup from "yup";

const CartSchema = Yup.object().shape({
  fullname: Yup.string().required('Vui lòng nhập tên của bạn'),
  phone: Yup.string().max(11, "Vui lòng nhập đúng số điện thoại").required('Vui lòng nhập số điện thoại'),
  address: Yup.string().required("Vui lòng điền địa chỉ")
});

const Cart = ({ connection, getOrder }) => {
  const order = ApiService.getSession("order");

  const [loading, setLoading] = useState(true);
  const [orderItems, setOrderItems] = useState([]);
  // const user = JSON.parse(AuthService.getUser());

  const getCartItems = async () => {
    if (order) {
      await ApiService.get(`Order/get-order-item/${order?.orderID}`).then((res) => {
        const result = res.data;
        if (!result) return;
        else if (result.data) {
          setOrderItems(result.data);
        }
      }).catch((error) => console.log(error)).finally(() => setTimeout(() => setLoading(false), 300));
    }
  }

  const updateQuantity = async (orderItem, quantity) => {
    if (quantity <= 0) {
      quantity += 1;
      toast.warning("Bạn không thể giảm số lượng về 0.");
      return;
    }

    orderItem.quantity = quantity;

    await ApiService.put(`Order/update-order-item/${orderItem?.orderItemID}`, orderItem, null).then((res) => {
      const result = res.data;
      if (!result) return;
      else if (result.success) {
        getCartItems();
        getOrder();
      }
      else toast.error(result.message);
    }).catch((error) => console.log(error));
  }

  const deleteOrderItem = async (orderItem) => {
    await ApiService.delete(`Order/delete-order-item/${orderItem?.orderItemID}`).then((res) => {
      if (res.data.success) {
        // toast.success(res.data.message);
        getCartItems();
        getOrder();
      }
      else toast.error(res.data.message);
    }).catch((error) => console.log(error));
  }

  useEffect(() => {
    getCartItems();
  }, [order]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // if (loading) {
  //   return <Loader />
  // }

  return (
    <>
      <section className="cart-items">
        <Container>
          <Row className="justify-content-center">
            <Col md={8}>
              {orderItems.length === 0 && (
                <h1 className="no-items product">Không có sản phẩm nào trong giỏ hàng</h1>
              )}
              {orderItems.map((item) => {
                const productQty = item?.product.price * (item?.quantity || 0);
                return (
                  <div className="cart-list" key={item.orderItemID}>
                    <Row>
                      <Col className="image-holder" sm={4} md={3}>
                        <img src={item?.imgUrl || "https://t3.ftcdn.net/jpg/04/34/72/82/360_F_434728286_OWQQvAFoXZLdGHlObozsolNeuSxhpr84.jpg"} alt="" />
                      </Col>
                      <Col sm={8} md={9}>
                        <Row className="cart-content justify-content-center">
                          <Col xs={12} sm={9} className="cart-details">
                            <h3>{item?.product?.name || "N/A"}</h3>
                            <h4>
                              {ApiService.formatVND(item?.product?.price)} * {item?.quantity}
                              <span>{ApiService.formatVND(productQty)}</span>
                            </h4>
                          </Col>
                          <Col xs={12} sm={3} className="cartControl">
                            <button
                              className="incCart"
                              onClick={() => updateQuantity(item, item?.quantity + 1)}
                            >
                              <i className="fa-solid fa-plus"></i>
                            </button>
                            <button
                              className="desCart"
                              onClick={() => updateQuantity(item, item?.quantity - 1)}
                            >
                              <i className="fa-solid fa-minus"></i>
                            </button>
                          </Col>
                        </Row>
                      </Col>
                      <button
                        className="delete"
                        onClick={() => deleteOrderItem(item)}
                      >
                        <ion-icon name="close"></ion-icon>
                      </button>
                    </Row>
                  </div>
                );
              })}
            </Col>
            <Col md={4}>
              <div className="cart-total">
                <h2>Tổng tiền đơn hàng</h2>
                <div className=" d_flex">
                  <h4>Thành tiền :</h4>
                  <h3>{ApiService.formatVND(order?.totalAmount)}</h3>
                </div>
              </div>

              <div className="cart-information">
                <h2>Thông tin đặt hàng</h2>
                <Formik
                  initialValues={{
                    fullname: "",
                    phone: "",
                    address: ""
                  }}
                  validationSchema={CartSchema}
                  onSubmit={async (values) => {
                    if (!orderItems || orderItems.length <= 0) {
                      toast.error("Giỏ hàng trống, bạn không thể thực hiện thanh toán!");
                      return;
                    }

                    const body = {
                      orderID: order.orderID,
                      userID: order.userID,
                      orderDate: new Date(),
                      totalAmount: order.totalAmount,
                      productQuantity: order.productQuantity,
                      status: 1,
                      fullname: values.fullname,
                      phone: values.phone,
                      address: values.address
                    };
                    await ApiService.put(`Order/update-order/${order.orderID}`, body, { isCheckout: true }).then(async (response) => {
                      const result = response.data;
                      if (!result) return;
                      else if (result.success) {
                        await connection.invoke("SendNotify", `Bạn có đơn hàng mới! Mã đơn hàng ${result.data?.orderID}`, "order", result.data?.orderID);
                        window.location.href = "/order/succeed"
                      }
                      else toast.error(result.message);
                    }).catch((error) => window.location.href = "/order/failed");
                  }}
                >
                  {({ errors, touched, handleChange, values }) => (
                    <Form>
                      <p>
                        <label htmlFor="fullname" className="floatLabel">Họ và tên</label>
                        <input
                          id="fullname"
                          name="fullname"
                          type="text"
                          value={values.fullname}
                          onChange={handleChange}
                        />
                        {touched.fullname && errors.fullname && (
                          <span className="text-error">
                            {errors.fullname}
                          </span>
                        )}
                      </p>
                      <p>
                        <label htmlFor="phone" className="floatLabel">Số điện thoại</label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={values.phone}
                          onChange={handleChange}
                        />
                        {touched.phone && errors.phone && (
                          <span className="text-error">
                            {errors.phone}
                          </span>
                        )}
                      </p>
                      <p>
                        <label htmlFor="address" className="floatLabel">Địa chỉ</label>
                        <textarea
                          id="address"
                          name="address"
                          rows={4}
                          className="w-100"
                          value={values.address}
                          onChange={handleChange}
                        />
                        {touched.address && errors.address && (
                          <span className="text-error">
                            {errors.address}
                          </span>
                        )}
                      </p>
                      <p>
                        <button type="submit" id="submit">Tiến hành đặt hàng</button>
                      </p>
                    </Form>
                  )}
                </Formik>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Cart;
