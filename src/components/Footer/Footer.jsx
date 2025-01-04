import React from "react"
import "./style.css"
import { Col, Container, Row } from "react-bootstrap"
import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer>
      <Container>
        <Row className="footer-row">
          <Col md={3} sm={5} className='box'>
            <a href="/" className="logo" style={{ textDecoration: 'none' }}>
              <img
                src="https://static.vecteezy.com/system/resources/thumbnails/025/309/271/small/3d-icon-desktop-product-display-e-commerce-png.png"
                alt=""
                width={40} height={40}
              />
              <h1>E-commerce</h1>
            </a>
            <p>E-commerce được viết tắt bởi cụm từ "Electronic Commerce" hay còn gọi là Thương mại điện tử là hình thức kinh doanh trực tuyến, trong đó việc truyền thông, mua bán, trao đổi, thanh toán hàng hóa / dịch vụ</p>
          </Col>
          <Col md={3} sm={5} className='box'>
            <div className="d-flex align-items-strength">
              <img src="https://cdn-icons-png.flaticon.com/128/6186/6186048.png" width={30} height={30} alt="" />
              <h2 className="ms-2">Về chúng tôi</h2>
            </div>

            <ul>
              <li><Link to="/">Nghề nghiệp</Link></li>
              <li><Link to="/shop">Sản phẩm</Link></li>
              <li><Link to="/">Điều khoản</Link></li>
              <li><Link to="https://inox-thanhnam-admin.vercel.app/admin/login" target="_blank">Đăng nhập admin</Link></li>
            </ul>
          </Col>
          <Col md={3} sm={5} className='box'>
            <div className="d-flex align-items-strength">
              <img src="https://cdn-icons-png.flaticon.com/128/3696/3696635.png" width={30} height={30} alt="" />
              <h2 className="ms-2">Khách hàng</h2>
            </div>
            <ul>
              <li><Link to="/login">Đăng nhập</Link></li>
              <li><Link to="/cart" >Theo dõi giỏ hàng</Link></li>
            </ul>
          </Col>
          <Col md={3} sm={5} className='box'>
            <div className="d-flex align-items-strength">
              <img src="https://cdn-icons-png.flaticon.com/128/10215/10215258.png" width={30} height={30} alt="" />
              <h2 className="ms-2">Đánh giá</h2>
            </div>
            <ul>
              <li>ABC, Huyện XYZ, Thành phố Hồ Chí Minh</li>
              <li>Email: gool@ecommerce.com</li>
              <li>Hotline: 11009999</li>
            </ul>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer
