import React, { useMemo } from 'react';

const range = (start, end) => {
  return Array.from({ length: end - start + 1 }, (_, idx) => idx + start);
};

const DOTS = '...';

const usePagination = ({
  totalCount,
  pageSize,
  siblingCount = 1,
  currentPage
}) => {
  const paginationRange = useMemo(() => {
    const totalPageCount = Math.ceil(totalCount / pageSize);
    const totalPageNumbers = siblingCount + 5;

    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPageCount);
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftRange = range(1, totalPageNumbers - 2);
      return [...leftRange, DOTS, totalPageCount];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightRange = range(totalPageCount - (totalPageNumbers - 2) + 1, totalPageCount);
      return [1, DOTS, ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [1, DOTS, ...middleRange, DOTS, totalPageCount];
    }
    
    // Default return value in case none of the conditions match
    return [];
  }, [totalCount, pageSize, siblingCount, currentPage]);

  return paginationRange;
};

const Pagination = ({
  onPageChange,
  totalCount,
  siblingCount = 1,
  currentPage,
  pageSize
}) => {
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize
  });

  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => onPageChange(currentPage + 1);
  const onPrevious = () => onPageChange(currentPage - 1);
  const lastPage = paginationRange[paginationRange.length - 1];

  return (
    <ul className="flex justify-center items-center">
      <li
        className={`cursor-pointer ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={onPrevious}
      >
        &lt;
      </li>
      {paginationRange.map((pageNumber, index) => (
        <li
          key={index}
          className={`cursor-pointer ml-2 px-1 ${pageNumber === currentPage ? 'text-blue-500' : ''}`}
          onClick={() => {  if (pageNumber !== DOTS) onPageChange(pageNumber) }}        >
          {pageNumber === DOTS ? '...' : pageNumber}
        </li>
      ))}
      <li
        className={`cursor-pointer ${currentPage === lastPage ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={onNext}
      >
        &gt;
      </li>
    </ul>
  );
};

export default Pagination;
