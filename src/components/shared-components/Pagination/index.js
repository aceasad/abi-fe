import React from 'react';
import { Pagination } from 'antd';

function PaginationComponent({ count, handlePageChange, page }) {
  return (
    <div>
      <Pagination current={page} total={count} onChange={handlePageChange} />
    </div>
  );
}

export default PaginationComponent;
