import React, { useState } from "react";
import { Button, Form, Input, Radio } from "antd";
import { ErrorMessage, Formik } from "formik";
import { clinicSchema } from "utils/validations";
import { useDispatch } from "react-redux";
import messages from "./messages";

import { useIntl } from "react-intl";
import { updateClinic } from "redux/actions/Clinic";

const imageStyle = {
  display: "inline-block",
  width: "150px",
  height: "150px",
  backgroundColor: "lightgray",
  borderRadius: "30%",
  border: "10%",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center center",
  backgroundSize: "cover",
};

const inputStyle = {
  width: "60%",
  marginRight: "2%",
  marginBottom: "2%",
};
const inputStyleWorkOur = {
  width: "25%",
  marginRight: "2%",
  marginBottom: "2%",
};
const labelStyle = {
  float: "left",
  width: "150px",
  textAlign: "right",
  paddingRight: "10px",
};

const ClinicPage = () => {
  const dispatch = useDispatch();
  const [image, setImage] = useState(""); // za vizuelni prikaz slike
  const [visibilityOfParkinSizeField, setVisibility] = useState(false); // za prikaz dodatnog polja
  //za parking
  const { formatMessage } = useIntl();

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  return (
    <div className="container">
      <Formik
        initialValues={{
          photo: undefined,
          name: " ",
          phone_number: " ",
          address: " ",
          google_map_link: " ",
          parikng_availability: undefined,
          parking_size: undefined,
          start_of_work: undefined,
          end_of_work: undefined,
        }}
        validationSchema={clinicSchema}
        onSubmit={(values) => {
          alert(values);
          dispatch(updateClinic(values));
        }}
      >
        {({
          setFieldValue,
          dirty,
          isValid,
          values,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <Form layout="vertical" name="clinic-form" onSubmit={handleSubmit}>
            <div className="row" style={{ marginLeft: "40%" }}>
              <img style={imageStyle} alt="clinic" src={image}></img>
            </div>
            <Form.Item>
              <div className="row" style={{ marginLeft: "17%" }}>
                <Input
                  style={{ width: "20%" }}
                  autoFocus
                  accept="image/*"
                  name="photo"
                  type="file"
                  onChange={(event) => {
                    setFieldValue("photo", event.target.value);
                    onImageChange(event);
                  }}
                  onBlur={handleBlur}
                  value={values.photo}
                ></Input>
                <Button
                  autoFocus
                  name="remove"
                  onClick={() => {
                    setImage(undefined);
                    setFieldValue("photo", "");
                  }}
                >
                  Remove
                </Button>
              </div>
            </Form.Item>

            <Form.Item>
              <label style={labelStyle}>
                {formatMessage(messages.clinic_name)}
              </label>
              <Input
                style={inputStyle}
                autoFocus
                name="name"
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
              ></Input>
              <ErrorMessage name="name">
                {(msg) =>
                  formatMessage(msg, {
                    label: formatMessage(messages.error_input_label_name),
                  })
                }
              </ErrorMessage>
            </Form.Item>
            <Form.Item>
              <label style={labelStyle}>
                {formatMessage(messages.phone_number)}
              </label>
              <Input
                style={inputStyle}
                autoFocus
                name="phone_number"
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.phone_number}
              ></Input>
              <ErrorMessage name="phone_number">
                {(msg) =>
                  formatMessage(msg, {
                    label: formatMessage(
                      messages.error_input_label_phone_number
                    ),
                  })
                }
              </ErrorMessage>
            </Form.Item>
            <Form.Item>
              <label style={labelStyle}>
                {formatMessage(messages.address)}
              </label>
              <Input
                style={inputStyle}
                autoFocus
                name="address"
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.address}
              ></Input>
              <ErrorMessage name="address">
                {(msg) =>
                  formatMessage(msg, {
                    label: formatMessage(messages.error_input_label_address),
                  })
                }
              </ErrorMessage>
            </Form.Item>
            <Form.Item>
              <label style={labelStyle}>
                {formatMessage(messages.google_maps_link)}
              </label>
              <Input
                style={inputStyle}
                autoFocus
                name="google_map_link"
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.google_map_link}
              ></Input>
              <ErrorMessage name="google_map_link">
                {(msg) =>
                  formatMessage(msg, {
                    label: formatMessage(
                      messages.error_input_label_google_maps_link
                    ),
                    matches: formatMessage(
                      messages.error_input_label_google_maps_link
                    ),
                  })
                }
              </ErrorMessage>
            </Form.Item>
            <label style={labelStyle}>
              {formatMessage(messages.parking_availability)}
            </label>
            <Form.Item name="radio-group">
              <Radio.Group
                onChange={(event) => {
                  if (event.target.value === "PARKING_AVAILABLE") {
                    setVisibility(true);
                  } else {
                    setVisibility(false);
                  }
                  values.parikng_availability = event.target.value;
                }}
              >
                <Radio value="NO_PARKING">
                  {formatMessage(messages.parking_no)}
                </Radio>
                <Radio value="FREE">
                  {formatMessage(messages.parking_free)}
                </Radio>
                <Radio value="PARKING_AVAILABLE">
                  {formatMessage(messages.parking_available)}
                </Radio>
                {visibilityOfParkinSizeField ? (
                  <div style={{ marginLeft: "330px" }}>
                    <label style={labelStyle}>
                      {formatMessage(messages.parking_size)}
                    </label>
                    <Input
                      style={inputStyle}
                      autoFocus
                      name="parking_size"
                      type="number"
                      min={0}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.parking_size}
                    ></Input>
                  </div>
                ) : null}
              </Radio.Group>
            </Form.Item>
            <Form.Item>
              <label style={labelStyle}>
                {formatMessage(messages.working_hours)}
              </label>
              <div className="row">
                <Input
                  style={inputStyleWorkOur}
                  autoFocus
                  name="start_of_work"
                  type="time"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.start_of_work}
                ></Input>
                <Input
                  style={inputStyleWorkOur}
                  autoFocus
                  name="end_of_work"
                  type="time"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.end_of_work}
                ></Input>
              </div>
            </Form.Item>
            <Form.Item>
              <Button
                disabled={!dirty || !isValid}
                onClick={() => handleSubmit(values)}
                name="create"
                type="submit"
              >
                Create
              </Button>
            </Form.Item>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ClinicPage;
