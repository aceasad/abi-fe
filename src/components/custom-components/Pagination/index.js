import React from 'react';
import { Pagination } from 'antd';
import { DEFAULT_LIMIT } from 'services/StaffService';

function PaginationComponent({ count, handlePageChange, page }) {
  return (
    <div>
      {count > DEFAULT_LIMIT && (
        <Pagination current={page} total={count} onChange={handlePageChange} />
      )}
    </div>
  );
}

export default PaginationComponent;
