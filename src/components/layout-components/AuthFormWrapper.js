import React from "react";
import { Card, Row, Col, Typography } from "antd";
import { useSelector } from "react-redux";
import { makeSelectCurrentTheme } from "redux/selectors/Theme";
import { THEME_LIGHT } from "constants/ThemeConstant";

const AuthFormWrapper = ({ title = false, paragraph = false, children }) => {
  const { Title, Text } = Typography;
  const theme = useSelector(makeSelectCurrentTheme());

  return (
    <div className="h-100">
      <div className="container d-flex flex-column justify-content-center h-100">
        <Row justify="center">
          <Col xs={24} sm={20} md={16} lg={12} xl={8}>
            <Card>
              <div className="m-4">
                <div className="text-center">
                  <div className="authentication">
                    <img
                      className="authentication-image"
                      src={`/img/${
                        theme === THEME_LIGHT ? "logo.png" : "logo-white.png"
                      }`}
                      alt="logo"
                    />
                  </div>
                  {title && (
                    <Title className="mb-5 mt-5" level={2} strong>
                      {title}
                    </Title>
                  )}
                </div>
                {paragraph && (
                  <div className="mb-5 text-center">
                    <Text type="secondary">{paragraph}</Text>
                  </div>
                )}
                <Row justify="center">
                  <Col span={24}>{children}</Col>
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
