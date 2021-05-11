import {
  AutoComplete,
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Typography,
  Select,
  message,
  Modal,
} from 'antd';
import Flex from 'components/shared-components/Flex';
import React, { useState, useEffect, useRef } from 'react';
import { useIntl } from 'react-intl';
import messages from './messages';
import { DeleteFilled, CloseOutlined } from '@ant-design/icons';
import Scrollbars from 'react-custom-scrollbars';
import { useDebounce, useLazyLoad } from 'utils/hooks';
import { useSearchMedicalConditions } from 'queries/shared';
import { useDispatch, useSelector } from 'react-redux';
import {
  makeSelectCurrentUser,
  makeSelectIsOrganizationOwner,
} from 'redux/selectors/Auth';
import MiniLoader from 'components/shared-components/Loading/MiniLoader';
import { makeSelectExistingMedicalConditions } from 'redux/selectors/Anemnesis';
import {
  createMedicalCondition,
  deleteMedicalCondition,
  setPage,
} from 'redux/actions/Anamnesis';
import { EXISTING_CONDITIONS } from 'redux/reducers/Anemnesis';
import { APPEND } from 'redux/sagas/Anemnesis';

const { Title } = Typography;

const { Option } = Select;

const PatientFormExistingConditions = ({ setFieldValue, id }) => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();

  const { organization } = useSelector(makeSelectCurrentUser());
  const { items, page, next } = useSelector(
    makeSelectExistingMedicalConditions()
  );
  const nextRef = useRef();

  const isOrganizationOwner = useSelector(makeSelectIsOrganizationOwner());
  const [query, setQuery] = useState('');
  const [text, setText] = useState(query);
  const debouncedSearch = useDebounce(query, 500);
  const [conditions, setConditions] = useState(items);

  const { data, isFetching, isFetched } = useSearchMedicalConditions(
    organization,
    query,
    debouncedSearch === query && !!query
  );

  const findOptionByName = (name) =>
    data?.data?.results.find(
      (option) => option.name.toLowerCase() === name.toLowerCase()
    );

  const findOptionById = (id) => conditions.find((option) => option.id === id);

  const handleSearch = (value) => {
    setQuery(value);
    setText(value);
  };

  const handleSelect = (value) => {
    setText(findOptionByName(value)['name']);
    addCondition(value);
  };

  const afterCreate = (id) => {
    setConditions([{ id, name: text }, ...conditions]);
    message.success(formatMessage(messages.newConditionCreated));
  };

  const afterError = () => {
    message.error(formatMessage(messages.conditionAlreadyExists));
  };

  const removeCondition = (id) => {
    setConditions(conditions.filter((condition) => condition.id !== id));
  };

  const deleteCondition = (id) => {
    removeCondition(id);
    message.success(formatMessage(messages.medicalConditionDeleted));
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: formatMessage(messages.deleteMedicalCondition, {
        name: findOptionById(id)['name'],
      }),
      okText: formatMessage(messages.formConfirmationButton),
      okType: 'danger',
      cancelText: formatMessage(messages.cancel),
      onOk() {
        dispatch(
          deleteMedicalCondition({ data: id, afterDelete: deleteCondition })
        );
      },
    });
  };

  const addCondition = (value) => {
    const foundInAutocompleteList = findOptionByName(value);
    // if selected condition is from autocomplete list (exists on BE)
    if (foundInAutocompleteList) {
      // and if not already in the list of conditions, add condition
      if (!conditions.find((option) => option.name === value)) {
        setConditions([foundInAutocompleteList, ...conditions]);
      }
      // if selected condition is not in the autocomplete list (doesn't exist on BE),
      // create new condition and add it to the list of conditions
    } else {
      dispatch(
        createMedicalCondition({
          data: { name: value },
          afterCreate,
          afterError,
        })
      );
    }
  };

  const handleEnterPress = (e) => {
    if (e.key === 'Enter' && !isFetching && isFetched) {
      addCondition(e.target.value);
    }
  };

  useEffect(() => {
    setFieldValue(
      'medicalConditions',
      conditions.map((condition) => condition.id)
    );
    setText('');
    setQuery('');
  }, [conditions]);

  useEffect(() => {
    nextRef.current = { next, page };
  }, [next, page]);

  useEffect(() => {
    setConditions(items);
  }, [items]);

  useLazyLoad(
    '#existing-conditions-list div',
    () =>
      dispatch(
        setPage({
          page: nextRef.current.page + 1,
          id,
          field: EXISTING_CONDITIONS,
          type: APPEND,
        })
      ),
    [],
    () => nextRef.current.next
  );

  const conditionList = conditions.map((item) => (
    <Flex
      key={item.id}
      justifyContent="between"
      alignItems="center"
      className="list-with-delete-item list-with-delete-item-regular"
    >
      <Typography.Text>{item.name}</Typography.Text>
      <div>
        <CloseOutlined
          className="list-with-delete-icon cursor-pointer"
          onClick={() => removeCondition(item.id)}
          style={{ marginRight: '5px' }}
        />
        {isOrganizationOwner && (
          <DeleteFilled
            className="list-with-delete-icon cursor-pointer"
            onClick={() => handleDelete(item.id)}
          />
        )}
      </div>
    </Flex>
  ));

  return (
    <Card className="p-4">
      <Row gutter={16}>
        <Col span={6}>
          <Title type="secondary" level={2} className="mt-4">
            {formatMessage(messages.cardTitleExistingConditions)}
          </Title>
        </Col>
        <Col span={18}>
          <Form layout="vertical">
            <Form.Item label="Add existing medical conditions">
              <Input.Group compact className="d-flex">
                <Form.Item
                  name="existing_conditions"
                  style={{ width: '100%', position: 'relative' }}
                >
                  <AutoComplete
                    value={text}
                    style={{ width: '100%' }}
                    placeholder={formatMessage(messages.pressEnterToAdd)}
                    onSearch={handleSearch}
                    onSelect={handleSelect}
                    onKeyDown={handleEnterPress}
                    backfill
                  >
                    {data?.data?.results.map((item) => (
                      <Option
                        key={item.id}
                        value={item.name}
                        value={
                          item.name.toLowerCase() === query.toLowerCase()
                            ? query
                            : item.name
                        }
                      >
                        {item.name}
                      </Option>
                    ))}
                  </AutoComplete>
                  {isFetching && <MiniLoader />}
                </Form.Item>
                <Button
                  disabled={isFetching || !isFetched}
                  onClick={() => addCondition(text)}
                >
                  {formatMessage(messages.addNew)}
                </Button>
              </Input.Group>
            </Form.Item>
          </Form>
          <div>
            <div className="list-with-delete-header">
              <Typography.Text strong type="secondary">
                {formatMessage(messages.columnTitleCondition)}
              </Typography.Text>
            </div>
            <div className="list-with-delete-body">
              <Scrollbars id="existing-conditions-list">
                {conditionList}
              </Scrollbars>
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default PatientFormExistingConditions;
