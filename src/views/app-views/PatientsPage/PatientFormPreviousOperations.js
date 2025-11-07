import {
  AutoComplete,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Row,
  Typography,
} from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import messages from './messages';
import { DeleteFilled, CloseOutlined } from '@ant-design/icons';
import Scrollbars from 'react-custom-scrollbars';
import dayjs from 'utils/dayjs';
import { useGetOperationTypes } from 'queries/shared';
import { useDispatch, useSelector } from 'react-redux';
import {
  makeSelectIsOrganizationOwner,
  makeSelectOrganization,
} from 'redux/selectors/Auth';
import { useDebounce, useLazyLoad } from 'utils/hooks';
import MiniLoader from 'components/shared-components/Loading/MiniLoader';
import { addNewOperationType, setPage } from 'redux/actions/Anamnesis';
import { makeSelectPreviousOperations } from 'redux/selectors/Anemnesis';
import { YEAR_FORMAT_YYYY } from 'constants/DateConstant';
import { PREVIOUS_OPERATIONS } from 'redux/reducers/Anemnesis';
import { APPEND } from 'redux/sagas/Anemnesis';
import { DEFAULT_SMALL_PAGINATION_LIMIT } from 'constants/ApiConstant';
import { appendOperation, filterOperation } from 'redux/actions/Anamnesis';
import { generateKey } from 'utils/helpers';

const { Option } = AutoComplete;
const { Title } = Typography;

const PatientFormPreviousOperationss = ({
  setOperations,
  id,
  deleteOperationType,
}) => {
  const { formatMessage } = useIntl();
  const nextRef = useRef();

  const organization = useSelector(makeSelectOrganization());

  const [search, setSearch] = useState('');
  const debounceSearch = useDebounce(search, 500);
  const dispatch = useDispatch();

  const { items } = useSelector(makeSelectPreviousOperations());
  const isOrganizationOwner = useSelector(makeSelectIsOrganizationOwner());

  const { page, next, count } = useSelector(makeSelectPreviousOperations());

  const addOperation = (payload) => {
    const data = {
      id: 0,
      operation_type_id: payload.id,
      operation_type: payload.name,
      year: new Date().getFullYear(),
      key: generateKey(),
    };
    setOperations((prev) => ({
      ...prev,
      addedOperations: [...prev.addedOperations, data],
    }));

    dispatch(appendOperation(data));
  };

  const changeOperation = (item) => {
    if (item.id === 0) {
      setOperations((prev) => ({
        ...prev,
        addedOperations: prev.addedOperations.map((operation) =>
          operation.key === item.key ? item : operation
        ),
      }));
    } else {
      setOperations((prev) => ({
        ...prev,
        changedOperations: prev.changedOperations.some(
          (operation) => operation.id === item.id
        )
          ? prev.changedOperations.map((operation) =>
            operation.id === item.id ? item : operation
          )
          : [...prev.changedOperations, item],
      }));
    }
  };

  const deleteOperation = (item) => {
    if (item.id === 0) {
      setOperations((prev) => ({
        ...prev,
        addedOperations: prev.addedOperations.filter(
          ({ key }) => item.key !== key
        ),
      }));
      dispatch(filterOperation({ key: item.key }));
    } else {
      setOperations((prev) => ({
        ...prev,
        deletedOperations: [...prev.deletedOperations, item.id],
        changedOperations: prev.changedOperations.filter(
          (operation) => operation.id !== item.id
        ),
      }));
      dispatch(filterOperation({ id: item.id }));
    }
  };

  const { data, isFetching, isFetched } = useGetOperationTypes(
    organization,
    debounceSearch,
    null,
    debounceSearch === search && !!search.length
  );

  const findOptionByName = (name) =>
    data.data.results.find((o) => o.name.toLowerCase() === name.toLowerCase());

  const handleSelect = (option) => {
    const selectedOption = findOptionByName(option);
    if (selectedOption) handleAddOperation(selectedOption);
    else handleSubmit();
  };

  const handleAddOperation = (operation) => {
    addOperation(operation);
    setSearch('');
  };

  const handleEnterPress = (e) => {
    if (e.key === 'Enter' && !isFetching && isFetched) {
      const selectedOption = findOptionByName(e.target.value);
      if (!selectedOption) handleSubmit();
    }
  };

  const afterAdd = () => {
    message.success(formatMessage(messages.operationTypeAdded));
    setSearch('');
  };

  const handleSubmit = () => {
    const selectedOption = findOptionByName(search);
    if (!selectedOption)
      dispatch(addNewOperationType({ name: search, addOperation, afterAdd }));
  };

  useEffect(() => {
    nextRef.current = { next, page };
  }, [next, page]);

  useLazyLoad(
    '#previous-list div',
    () =>
      dispatch(
        setPage({
          page: nextRef.current.page + 1,
          id,
          field: PREVIOUS_OPERATIONS,
          type: APPEND,
        })
      ),
    [],
    () => nextRef.current.next
  );

  const previousOperations = items.reduce(
    (acc, item) =>
      item.hidden
        ? acc
        : [
          ...acc,
          <div
            key={item.id === 0 ? item.key : item.id}
            className="list-with-delete-item list-with-delete-item-small"
          >
            <Row gutter={16}>
              <Col span={16} className="d-flex align-items-center">
                <Typography.Text>{item.operation_type}</Typography.Text>
              </Col>
              <Col span={6}>
                <DatePicker
                  size="small"
                  picker="year"
                  disabledDate={(current) => current.valueOf() > Date.now()}
                  allowClear={false}
                  defaultValue={dayjs(item.year, YEAR_FORMAT_YYYY)}
                  format={YEAR_FORMAT_YYYY}
                  onChange={(_, year) => changeOperation({ ...item, year })}
                />
              </Col>
              <Col
                span={2}
                className="d-flex align-items-center justify-content-end"
              >
                <CloseOutlined
                  onClick={() => deleteOperation(item)}
                  className="list-with-delete-icon cursor-pointer mr-2"
                />

                {isOrganizationOwner && (
                  <DeleteFilled
                    onClick={() =>
                      deleteOperationType({ item, action: deleteOperation })
                    }
                    className="list-with-delete-icon cursor-pointer"
                  />
                )}
              </Col>
            </Row>
          </div>,
        ],
    []
  );

  useEffect(() => {
    if (
      previousOperations.length &&
      previousOperations.length < DEFAULT_SMALL_PAGINATION_LIMIT &&
      !!next &&
      previousOperations.length <= count
    )
      dispatch(
        setPage({
          page: page + 1,
          id,
          field: PREVIOUS_OPERATIONS,
          type: APPEND,
        })
      );
  }, [previousOperations.length]);

  return (
    <Card className="p-4">
      <Row gutter={16}>
        <Col span={6}>
          <Title type="secondary" level={2} className="mt-4">
            {formatMessage(messages.cardTitlePreviousOperatins)}
          </Title>
        </Col>
        <Col span={18}>
          <Form layout="vertical">
            <Form.Item label="Add previous operation">
              <Input.Group compact className="d-flex">
                <Form.Item
                  name="previous_operations"
                  style={{ position: 'relative', width: '100%' }}
                >
                  <AutoComplete
                    value={search}
                    style={{
                      width: '100%',
                    }}
                    onSelect={handleSelect}
                    onSearch={setSearch}
                    placeholder={formatMessage(messages.pressEnterToAdd)}
                    onKeyDown={handleEnterPress}
                    backfill
                  >
                    {data?.data?.results.map((res) => (
                      <Option
                        key={res.id}
                        value={
                          res.name.toLowerCase() === search.toLowerCase()
                            ? search
                            : res.name
                        }
                      >
                        {res.name}
                      </Option>
                    ))}
                  </AutoComplete>
                  {isFetching && <MiniLoader />}
                </Form.Item>

                <Button
                  onClick={() => handleSelect(search)}
                  disabled={isFetching || !isFetched}
                >
                  {formatMessage(messages.addNew)}
                </Button>
              </Input.Group>
            </Form.Item>
          </Form>
          <div>
            <Row className="list-with-delete-header">
              <Col span={16}>
                <Typography.Text strong type="secondary">
                  {formatMessage(messages.columnTitleOperation)}
                </Typography.Text>
              </Col>
              <Col span={8}>
                <Typography.Text strong type="secondary">
                  {formatMessage(messages.columnTitleTimeOfSurgery)}
                </Typography.Text>
              </Col>
            </Row>
            <div className="list-with-delete-body-small">
              <Scrollbars id="previous-list">{previousOperations}</Scrollbars>
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default React.memo(PatientFormPreviousOperationss);
