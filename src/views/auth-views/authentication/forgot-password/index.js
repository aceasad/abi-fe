import React from "react";
import { Card, Row, Col, Typography } from "antd";
import { useSelector } from "react-redux";
import "../../../../assets/sass/views/auth/login.scss";
import messages from "./messages";
import { useIntl } from "react-intl";
import ForgotPasswordForm from "views/auth-views/components/ForgotPasswordForm/ForgotPasswordForm";

const { Title, Text } = Typography;

const ForgotPassword = () => {
  const { formatMessage } = useIntl();
  const theme = useSelector((state) => state.theme.currentTheme);

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
                        theme === "light" ? "logo.png" : "logo-white.png"
                      }`}
                      alt="logo"
                    />
                  </div>
                  <Title className="mb-5 mt-5" level={2} strong>
                    {formatMessage(messages.forgottenPasswordTitle)}
                  </Title>
                </div>
                <div className="mb-5 text-center">
                  <Text type="secondary">
                    {formatMessage(messages.forgotPasswordParagraph)}
                  </Text>
                </div>
                <Row justify="center">
                  <Col span={24}>
                    <ForgotPasswordForm />
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

export default ForgotPassword;
