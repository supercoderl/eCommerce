import { Button } from "react-bootstrap";
import "../assets/css/contact.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import AuthService from "../services/authService";
import ApiService from "../services/apiService";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner/Spinner";
import useWindowScrollToTop from "../hooks/useWindowScrollToTop";

const Contact = ({ connection }) => {
  const user = JSON.parse(AuthService.getUser());
  const [information, setInformation] = useState({
    fullname: user?.fullname || "",
    phone: user?.phone || "",
    email: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    setLoading(true);
    const body = {
      fullname: information.fullname || "",
      phone: information.phone,
      email: information.email || "",
      notes: information.notes || "",
      status: "new",
    };

    await ApiService.post("Contact/create-contact", body, null)
      .then(async (response) => {
        const result = response.data;
        if (!result) return;
        if (result.success && result.data) {
          toast.success(result.message);
          await connection.invoke(
            "SendNotify",
            `Bạn có tin nhắn mới từ ${result.data?.fullname}`,
            "contact",
            result.data?.contactID
          );
          setTimeout(() => {
            window.location.reload();
          }, 1200);
        } else toast.error(result.message);
      })
      .catch((error) => console.log(error))
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useWindowScrollToTop();

  return (
    <section id="feedback">
      <div class="feedback-modal">
        <h2>Đánh giá chúng tôi</h2>
        <p>
          Bạn có hài lòng với các dịch vụ và sản phẩm của chúng tôi không?
        </p>
        <div class="rating-options">
          <label for="Terrible" class="border">
            <input type="radio" id="Terrible" name="rating" value="Terrible" />
            <span class="emoji">
              <i class="fa-regular fa-face-sad-tear"></i>
            </span>
            <span>Rất tệ</span>
          </label>
          <label for="Bad" class="border">
            <input type="radio" id="Bad" name="rating" value="Bad" />
            <span class="emoji">
              <i class="fa-regular fa-face-frown"></i>
            </span>
            <span>Tệ</span>
          </label>
          <label for="Okay" class="border">
            <input type="radio" id="Okay" name="rating" value="Okay" />
            <span class="emoji">
              <i class="fa-regular fa-face-meh"></i>
            </span>
            <span>Tạm ổn</span>
          </label>
          <label for="Good" class="border">
            <input type="radio" id="Good" name="rating" value="Good" checked />
            <span class="emoji">
              <i class="fa-regular fa-face-smile"></i>
            </span>
            <span>Tốt</span>
          </label>
          <label for="Amazing" class="border">
            <input type="radio" id="Amazing" name="rating" value="Amazing" />
            <span class="emoji">
              <i class="fa-regular fa-face-laugh"></i>
            </span>
            <span>Tuyệt vời</span>
          </label>
        </div>

        <label for="feedback-reason">
          Có thể để lại lời nhắn dưới đây
        </label>
        <textarea id="feedback-reason"></textarea>

        <div class="options">
          <label class="checkbox">
            <input type="checkbox" id="contact-consent" checked />
            Nhận thông báo từ Ecommerce. &nbsp;
            <a href="#">Điều khoản</a>
          </label>
          <p id="contact-consent-error">
            Error: You must consent to be contacted.
          </p>

        </div>
        <p id="success-message">
          Thank you for your feedback! Your response has been submitted.
        </p>
        <div class="actions">
          <button id="submit">Gửi đi</button>
        </div>
      </div>
    </section>
  );
};

export default Contact;
