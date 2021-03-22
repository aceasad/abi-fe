import React from "react";
import { Card, Row, Col } from "antd";
import { useSelector } from "react-redux";
import "assets/sass/views/auth/login.scss";

const backgroundStyle = {
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover"
};

const AuthFormWrapper = ({ title, paragraph, children }) => {
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
                  {title && (
                    <div>
                      <h3>{title}</h3>
                    </div>
                  )}
                  {paragraph && (
                    <div>
                      <p className="mb-4">{paragraph}</p>
                    </div>
                  )}
                </div>

                <Row justify="center">
                  <Col xs={24}>{children}</Col>
                </Row>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AuthFormWrapper;
