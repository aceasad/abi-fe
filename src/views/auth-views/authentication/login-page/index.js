import React from "react";
import LoginForm from "../../components/LoginForm/LoginForm";
import { Card, Row, Col } from "antd";
import { useSelector } from "react-redux";
import "../../../../assets/sass/views/auth/login.scss";
import messages from "./messages";
import { useIntl } from "react-intl";

const backgroundStyle = {
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
};

const linkStyle = {
  color: "#5c5cd6",
  textDecoration: "underline",
  textDecorationColor: "#ccb3ff",
  cursor: "pointer",
};

const LoginPage = (props) => {
  const { formatMessage } = useIntl();
  const theme = useSelector((state) => state.theme.currentTheme);
  return (
    <div className="h-100" style={backgroundStyle}>
      <div className="container d-flex flex-column justify-content-center h-100">
        <Row justify="center">
          <Col xs={20} sm={20} md={20} lg={10}>
            <Card>
              <div className="my-4">
                <div className="text-center">
                  <div className="logo-container">
                    <img
                      className="img-fluid"
                      src={`/img/${
                        theme === "light" ? "logo.png" : "logo-white.png"
                      }`}
                      alt=""
                    />
                  </div>
                  <div className="login-text">
                    <h3>{formatMessage(messages.loginTitle)}</h3>
                  </div>
                </div>

                <Row justify="center">
                  <Col xs={24}>
                    <LoginForm {...props} />
                  </Col>
                </Row>
                <Row
                  className="login-footer"
                  style={{ marginTop: "4rem" }}
                  justify="center"
                >
                  <Col lg={10} xs={12}>
                    <span style={linkStyle}>
                      {formatMessage(messages.termsAndConditionsLink)}
                    </span>
                  </Col>
                  <Col lg={10} xs={12}>
                    <span style={{ float: "right", ...linkStyle }}>
                      {formatMessage(messages.privacyPolicyLink)}
                    </span>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default LoginPage;
