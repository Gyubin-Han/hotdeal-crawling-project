import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { fetchItems, fetchItemsByCategories } from '../api/Api';
import '../assets/List.css';
import HotDealItem from './HotDealItem';
import ReactPaginate from 'react-paginate';
import { useNavigate } from 'react-router-dom';

const categoryOptions = [
    { value: '먹거리', label: '먹거리' },
    { value: 'SW/게임', label: 'SW/게임' },
    { value: 'PC제품', label: 'PC제품' },
    { value: '가전제품', label: '가전제품' },
    { value: '생활용품', label: '생활용품' },
    { value: '의류', label: '의류' },
    { value: '세일정보', label: '세일정보' },
    { value: '화장품', label: '화장품' },
    { value: '모바일/상품권', label: '모바일/상품권' },
    { value: '패키지/이용권', label: '패키지/이용권' },
    { value: '기타', label: '기타' },
    { value: '해외핫딜', label: '해외핫딜' }
];

const orderOptions = [
    { value: 'desc', label: '최신순' },
    { value: 'asc', label: '오래된 순' }
];

const List = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [order, setOrder] = useState(orderOptions[0]); // 기본 정렬을 최신순으로 설정
    const itemsPerPage = 10;
    const navigate = useNavigate();

    useEffect(() => {
        const getItems = async () => {
            setLoading(true);
            try {
                const { items, total } = await fetchItemsByCategories(page, itemsPerPage, selectedCategories.map(c => c.value), order.value);
                console.log('서버에서 받아온 items', items);
                setItems(Array.isArray(items) ? items : []);
                setPageCount(Math.ceil(total / itemsPerPage));
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        getItems();
    }, [page, itemsPerPage, selectedCategories, order]);

    const handlePageClick = (event) => {
        const selectedPage = event.selected + 1;
        setPage(selectedPage);
    };

    const handleItemClick = (item) => {
        navigate(`/detail`, { state: { site: item.site, url: item.url } });
    };

    const handleCategoryChange = (selected) => {
        setSelectedCategories(selected);
        setPage(1); // 카테고리가 변경될 때 페이지를 1로 초기화
    };

    const handleOrderChange = (selected) => {
        setOrder(selected);
        setPage(1); // 정렬 방식이 변경될 때 페이지를 1로 초기화
    };

    return (
        <div className="List">
            <div className="search-container">
                <div className="dropdown-container">
                    <Select
                        isMulti
                        options={categoryOptions}
                        value={selectedCategories}
                        onChange={handleCategoryChange}
                        placeholder="카테고리를 선택하세요"
                        closeMenuOnSelect={false}
                    />
                    <Select
                        options={orderOptions}
                        value={order}
                        onChange={handleOrderChange}
                        placeholder="정렬 방식 선택"
                        closeMenuOnSelect={true}
                        className="order-dropdown" // 새로운 CSS 클래스를 추가합니다
                    />
                </div>

                <form className="d-flex">
                    <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                    <button className="btn btn-outline-success" type="submit">검색</button>
                </form>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div>Error: {error.message}</div>
            ) : (
                <div className="wrapper">
                    {items.map((item, index) => (
                        <HotDealItem key={index} item={item} onClick={() => handleItemClick(item)} />
                    ))}
                </div>
            )}

            <ReactPaginate
                previousLabel={'«'}
                nextLabel={'»'}
                breakLabel={'...'}
                breakClassName={'break-me'}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={'pagination'}
                subContainerClassName={'pages pagination'}  
                activeClassName={'active'}
                previousClassName={'page-item'}
                nextClassName={'page-item'}
                pageClassName={'page-item'}
                previousLinkClassName={'page-link'}
                nextLinkClassName={'page-link'}
                pageLinkClassName={'page-link'}
                breakLinkClassName={'page-link'}
                activeLinkClassName={'active'}
                disabledClassName={'disabled'}
                forcePage={page - 1} // 현재 페이지를 반영하기 위해 forcePage 사용
            />
        </div>
    );
};

export default List;
