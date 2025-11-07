import { Formik, Field } from 'formik';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Row, Col, Form, Button, Modal } from 'antd';
import FormDatePicker from 'components/custom-components/Form/FormDatePicker';
import FormSelect from 'components/custom-components/Form/FormSelect';
import FormNumberField from 'components/custom-components/Form/FormNumberField';
import { useDispatch, useSelector } from 'react-redux';
import {
    searchPatients,
    resetPatientsAutocomplete,
} from 'redux/actions/Appointment';
import messages from './messages';
import calendarMessages from '../CalendarPage/messages';
import Loading from 'components/shared-components/Loading';
import FormAutocomplete from 'components/custom-components/Form/FormAutocomplete';
import { useDebounce } from 'utils/hooks';
import { makeSelectClinicPatients } from 'redux/selectors/Appointment';
import DirtyFieldWrapper from 'components/custom-components/Form/DirtyFieldWrapper';
import TimeslotTimePicker from 'components/custom-components/Form/TimeslotTimePicker';
import { Link } from 'react-router-dom';
import RowColumnField from 'components/custom-components/Form/RowColumnField';
import { PlusOutlined } from '@ant-design/icons';
import { PATIENT_PAGE } from 'views/app-views/PatientsPage';
import FormTextArea from 'components/custom-components/Form/FormTextArea';
import { getSafe } from 'utils/helpers';

const AppointmentPASFormModal = ({
    initialState,
    isEditForm,
    doctors,
    appointmentTypes,
    appointmentStatuses,
    appointmentCommunicationStatuses,
    appointmentMissingReasons,
    appointmentCancellationReasons,
    closeModal,
    title,
    validationSchema,
    handleSubmit,
    loadingData,
    loading,
    appointment,
    patientDefault = '',
}) => {
    const { formatMessage } = useIntl();

    const dispatch = useDispatch();

    //   const afterAppointmentTypeSelect = (setFieldValue, fieldName, value) => {
    //     setFieldValue(
    //       fieldName,
    //       appointmentTypes.find((type) => type.id === value)[fieldName]
    //     );
    //   };
    const [query, setQuery] = useState('');
    const debouncedSearch = useDebounce(query, 500);
    const { patients, patientsLoading } = useSelector(makeSelectClinicPatients());

    useEffect(() => {
        if (query) {
            dispatch(searchPatients({ query }));
        }
    }, [debouncedSearch, dispatch, query]);

    // TODO: leads to maximum calls depth issue, logic needs refinement
    // useEffect(() => {
    //   return () => dispatch(resetPatientsAutocomplete());
    // }, [dispatch]);

    const not_attended_status = getSafe(
        () => appointmentStatuses.find((elem) => elem.name === 'Not attended').id
    );

    const cancelled_status = getSafe(
        () => appointmentStatuses.find((elem) => elem.name === 'Cancelled').id
    );

    return (
        (<Formik
            initialValues={initialState}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
            validateOnMount
        >
            {({ values, handleSubmit, dirty, isValid, setFieldTouched, touched }) => (

                <Modal
                    title={title}
                    open
                    destroyOnHidden
                    closable={false}
                    footer={[
                        <Button
                            key="back"
                            onClick={closeModal}
                            onMouseDown={(event) => {
                                event.preventDefault();
                            }}
                        >
                            {formatMessage(messages.cancelButton)}
                        </Button>,
                        <Button
                            key="submit"
                            type="primary"
                            onClick={handleSubmit}
                            htmlType="submit"
                            disabled={!dirty || !isValid || loading}
                        >
                            {formatMessage(messages.saveButton)}
                        </Button>,
                    ]}
                >
                    {loadingData ? (
                        <Loading />
                    ) : (
                        <Form
                            layout="vertical"
                            name="appointment-form"
                            className="ml-3 mr-3"
                        >
                            <Row gutter={16} className="d-flex">
                                <Col xs={20}>
                                    <Field
                                        component={FormAutocomplete}
                                        label="Patient name"
                                        name="patient"
                                        required
                                        placeholder={formatMessage(messages.searchPlaceholder)}
                                        setQuery={setQuery}
                                        options={patients}
                                        optionField="full_name"
                                        query={query}
                                        defaultValue={
                                            isEditForm
                                                ? appointment.patient.full_name
                                                : patientDefault
                                        }
                                        disabled={patientDefault}
                                        loading={patientsLoading}
                                    />
                                </Col>
                                <Col xs={4}>
                                    <Button
                                        type="primary"
                                        style={{ marginTop: '1.8rem' }}
                                        disabled={patientDefault}
                                    >
                                        <Link
                                            to={{
                                                pathname: 'patients',
                                                search: `?layout=${PATIENT_PAGE.CREATE}`,
                                            }}
                                        >
                                            <PlusOutlined />
                                        </Link>
                                    </Button>
                                </Col>
                            </Row>
                            {/* <RowColumnField
                                span={24}
                                label={formatMessage(messages.doctorLabel)}
                                name="doctor"
                                component={FormSelect}
                                options={doctors}
                                optionField="full_name"
                                defaultOption={values.doctor}
                                required
                            />
                            <Row gutter={16}>
                                <Col xs={24} lg={12}>
                                    <Field
                                        label={formatMessage(messages.appointmentTypeLabel)}
                                        name="appointmentType"
                                        component={FormSelect}
                                        options={appointmentTypes}
                                        optionField="name"
                                        defaultOption={values.appointmentType}
                                        afterSelectChange={afterAppointmentTypeSelect}
                                        afterSelectChangeFieldName="price"
                                        required
                                    />
                                </Col>
                                <Col xs={24} lg={12}>
                                    <DirtyFieldWrapper
                                        setFieldDirty={setFieldTouched}
                                        name="price"
                                        dependencies={[touched.appointmentType]}
                                    >
                                        <Field
                                            component={FormNumberField}
                                            label={formatMessage(messages.priceLabel)}
                                            name="price"
                                            placeholder={formatMessage(messages.priceLabel)}
                                            required
                                            decimals={2}
                                        />
                                    </DirtyFieldWrapper>
                                </Col>
                            </Row> */}
                            <Row gutter={16}>
                                <Col xs={24} lg={12}>
                                    <Field
                                        component={FormDatePicker}
                                        label={formatMessage(messages.dateLabel)}
                                        name="date"
                                        showDefaultDate={isEditForm}
                                        required
                                    />
                                </Col>
                                {/* AFTER SELECTING DATE - AUTO UPDATE THE TIMES */}
                                <Col xs={24} lg={12}>
                                    <Field
                                        component={TimeslotTimePicker}
                                        label={formatMessage(messages.timeLabel)}
                                        name="time"
                                        required
                                        showDefaultTime={isEditForm}
                                    />
                                </Col>
                            </Row>
                            {isEditForm && (
                                <RowColumnField
                                    span={24}
                                    label={formatMessage(messages.appointmentStatus)}
                                    name="status"
                                    component={FormSelect}
                                    options={appointmentStatuses}
                                    optionField="name"
                                    defaultOption={values.status}
                                    required
                                />
                            )}
                            {isEditForm && (
                                <RowColumnField
                                    span={24}
                                    label={formatMessage(messages.appointmentCommunicationStatus)}
                                    name="communication_status"
                                    component={FormSelect}
                                    options={appointmentCommunicationStatuses}
                                    optionField="name"
                                    defaultOption={values.communication_status}
                                    required
                                />
                            )}
                            {isEditForm && (
                                <Field
                                    component={FormTextArea}
                                    name="communication_status_details"
                                    rows={2}
                                    label={formatMessage(
                                        messages.appointmentCommunicationStatusDetails
                                    )}
                                />
                            )}
                            {isEditForm && values.status === not_attended_status && (
                                <RowColumnField
                                    span={24}
                                    label={formatMessage(messages.appointmentMissingReason)}
                                    name="missing_reason"
                                    component={FormSelect}
                                    options={appointmentMissingReasons}
                                    optionField="name"
                                    defaultOption={values.missing_reason}
                                    required
                                />
                            )}
                            {isEditForm && values.status === not_attended_status && (
                                <Field
                                    component={FormTextArea}
                                    name="missing_reason_details"
                                    rows={2}
                                    label={formatMessage(calendarMessages.missingReasonDetails)}
                                />
                            )}
                            {isEditForm && values.status === cancelled_status && (
                                <RowColumnField
                                    span={24}
                                    label={formatMessage(messages.appointmentCancellationReason)}
                                    name="cancellation_reason"
                                    component={FormSelect}
                                    options={appointmentCancellationReasons}
                                    optionField="name"
                                    defaultOption={values.cancellation_reason}
                                    required
                                />
                            )}
                            {isEditForm && values.status === cancelled_status && (
                                <Field
                                    component={FormTextArea}
                                    name="cancellation_reason_details"
                                    rows={2}
                                    label={formatMessage(
                                        calendarMessages.cancellationReasonDetails
                                    )}
                                />
                            )}
                        </Form>
                    )}
                </Modal>
            )}
        </Formik>)
    );
};

AppointmentPASFormModal.defaultProps = {
    initialState: {
        patient: '',
        doctor: '',
        appointmentType: '',
        price: 0,
        date: '',
        time: '',
        status: '',
    },
    doctors: [],
    appointmentTypes: [],
    isEditForm: false,
    appointmentStatus: [],
    appointmentCommunicationStatus: [],
    loadingData: false,
};

export default AppointmentPASFormModal;
