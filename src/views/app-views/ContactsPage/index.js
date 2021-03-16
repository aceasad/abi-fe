import React from "react";
import { Table, Tag } from "antd";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Email",
    dataIndex: "email",
  },
  {
    title: "Phone number",
    dataIndex: "phoneNumber",
  },
  {
    title: "Contact Owner",
    dataIndex: "contactOwner",
  },
  {
    title: "Tags",
    key: "tags",
    dataIndex: "tags",
    render: (tags) => (
      <span>
        {tags.map((tag) => {
          let color = tag.length > 5 ? "geekblue" : "green";
          if (tag === "loser") {
            color = "volcano";
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </span>
    ),
  },
];

const data = [
  {
    key: "1",
    name: "John Brown",
    email: "some@gmail.com",
    phoneNumber: "+381609809928",
    contactOwner: "Some Name",
    tags: ["nice", "developer"],
  },
  {
    key: "2",
    name: "Jim Green",
    email: "some@gmail.com",
    phoneNumber: "+381609809928",
    contactOwner: "Some Name",
    tags: ["loser"],
  },
  {
    key: "3",
    name: "Joe Black",
    email: "some@gmail.com",
    phoneNumber: "+381609809928",
    contactOwner: "Some Name",
    tags: ["cool", "teacher"],
  },
  {
    key: "4",
    name: "Jim Red",
    email: "some@gmail.com",
    phoneNumber: "+381609809928",
    contactOwner: "Some Name",
    tags: ["developer"],
  },
];

const ContactsPage = () => {
  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };
  return <Table columns={columns} dataSource={data} onChange={onChange} />;
};

export default ContactsPage;
