import React, { useState,useContext} from 'react';
import '../styles/RequestPage.css';
import { Icon } from '@iconify/react';
import RequestForm from './RequestForm';
import { RequestContext } from './EditContext';
function RequestPage({ data }) {

    const requestData = data.map(
        item => ({
            id: item.idYeuCau,
            dateSent: (item.ngayGui).split('T')[0],
            daysRequested: item.soNgayYeuCau,
            startDate: (item.ngayBD).split('T')[0],
            endDate: (item.ngayKT).split('T')[0],
            reason: item.lyDo,
            status: item.tinhTrang,
            requestType: item.loaiYeuCau,
            deniedReason: item.lyDoTuChoi,
        }) 
    );

    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const date = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${date}`;
    };

    // khai báo useState
    const [searchQuery, setSearchQuery] = useState('');
    const [FilterStatus, setFilterStatus] = useState([]);
    const [TypeRequest, setTypeRequest] = useState([]);
    const [startDateFilter, setStartDateFilter] = useState('2020-01-01');
    const [endDateFilter, setEndDateFilter] = useState(getCurrentDate());

    //filter theo mã id yêu cầu
    const filteredData = requestData.filter(item => {
        const matchesId = searchQuery ? item.id.toString().includes(searchQuery) : true;
        const matchesStatus = FilterStatus.length > 0 ? FilterStatus.includes(item.status) : true;
        const matchesType = TypeRequest.length > 0 ? TypeRequest.includes(item.requestType) : true;
        const matchesStartDate = new Date(item.dateSent) >= new Date(startDateFilter);
        const endDate = new Date(endDateFilter);
        endDate.setHours(23, 59, 59, 999);
        const matchesEndDate = new Date(item.dateSent) <= endDate;
        return matchesId && matchesStatus && matchesType && matchesStartDate && matchesEndDate;
    });

    const handleTypeChange = (e) => {
        const { value, checked } = e.target;
        setTypeRequest(prev =>
            checked ? [...prev, value] : prev.filter(loaiYeuCau => loaiYeuCau !== value)
        );
    };

    // filter theo loại trạng thái
    const handleStatusChange = (e) => {
        const { value, checked } = e.target;
        setFilterStatus(prev =>
            checked ? [...prev, value] : prev.filter(status => status !== value)
        );
    };

    // filter theo ngày bắt đầu và kết thúc
    const handleDateChange = (e, type) => {
        if (type === 'start')
            setStartDateFilter(e.target.value);
        if (type === 'end')
            setEndDateFilter(e.target.value);
    };

    // Trạng thái hiển thị form tạo yêu cầu
    const [showForm, setShowForm] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);

    // Số lượng yêu cầu của mỗi trang
    const rowsPerPage = 10;

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentRows = filteredData.slice(startIndex, endIndex);
    const emptyRows = Array(rowsPerPage - currentRows.length).fill(null);

    const totalPages = Math.ceil(requestData.length / rowsPerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const getVisiblePageNumbers = () => {
        const maxVisiblePages = 4;
        let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let end = start + maxVisiblePages - 1;

        if (end > totalPages) {
            end = totalPages;
            start = Math.max(1, end - maxVisiblePages + 1);
        }

        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };


    const handleCreateRequestClick = () => {
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
    };

    const handleSearchId = (e) => {
        setSearchQuery(e.target.value);
    };
 
    return (
        <>
            <div className="request-page-container">
                <div className="request-header-search-container">
                    <div className="request-header">Danh sách yêu cầu</div>
                    <div className="request-search-filter">
                        <input type="text" name="request-search" placeholder="Tìm kiếm mã yêu cầu" value={searchQuery} onChange={handleSearchId} />
                        <Icon icon="material-symbols:search" className="search-icon" />
                    </div>
                </div>
                <div className="request-page-table-filter-container">
                    <div className="request-page-filter-container">
                        <div className="request-date-filter">
                            <label>Ngày gửi</label>
                            <div className="request-date-input">
                                <input type="date" defaultValue="2020-01-01" min="2020-01-01" max={getCurrentDate()} onChange={(e) => handleDateChange(e,'start')} />
                                <Icon icon="octicon:dash-16" className="request-page-dash-icon" />
                                <input type="date" defaultValue={getCurrentDate()} min="2020-01-01" max={getCurrentDate()} onChange={(e) => handleDateChange(e,'end')} />
                            </div>
                        </div>
                        <div className="request-status-filter">
                            <label>Tình trạng</label>
                            <div className="request-status-input">
                                <input type="checkbox" value="pending" onClick={handleStatusChange} />
                                <label>Đang chờ duyệt</label>
                            </div>
                            <div className="request-status-input">
                                <input type="checkbox" value="approve" onClick={handleStatusChange} />
                                <label>Đã được duyệt</label>
                            </div>
                            <div className="request-status-input">
                                <input type="checkbox" value="deny" onClick={handleStatusChange} />
                                <label>Không được duyệt</label>
                            </div>
                        </div>
                        <div className="request-status-filter">
                            <label>Loại yêu cầu</label>
                            <div className="request-status-input">
                                <input type="checkbox" value="Nghỉ phép" onClick={handleTypeChange} />
                                <label>Nghỉ phép</label>
                            </div>
                            <div className="request-status-input">
                                <input type="checkbox" value="WFH" onClick={handleTypeChange} />
                                <label>WFH</label>
                            </div>
                            <div className="request-status-input">
                                <input type="checkbox" value="Check-in" onClick={handleTypeChange} />
                                <label>Check-in</label>
                            </div>
                            <div className="request-status-input">
                                <input type="checkbox" value="Check-out" onClick={handleTypeChange} />
                                <label>Check-out</label>
                            </div>
                            <div className="request-status-input">
                                <input type="checkbox" value="Cập nhật bảng chấm công" onClick={handleTypeChange} />
                                <label>Cập nhật bảng chấm công</label>
                            </div>
                            <div className="request-status-input">
                                <input type="checkbox" value="Khác" onClick={handleTypeChange} />
                                <label>Khác</label>
                            </div>
                        </div>
                        <hr className="request-status-filter-divider"/>
                        <div className="request-status-filter">
                            <label>Chú thích tình trạng</label>
                            <div className="request-status-input">
                                <Icon icon="lets-icons:check-fill" className="request-status-icon approve" style={{ fontSize: "30px" }} />
                                <label style={{ alignContent: "center" }}>Đã được duyệt</label>
                            </div>
                            <div className="request-status-input">
                                <Icon icon="icomoon-free:hour-glass" className="request-status-icon pending" style={{ fontSize: "30px" }} />
                                <label style={{ alignContent: "center" }}>Đang chờ duyệt</label>
                            </div>
                            <div className="request-status-input">
                                <Icon icon="healthicons-no" className="request-status-icon deny" style={{ fontSize: "30px" }} />
                                <label style={{alignContent: "center"}}>Không được duyệt</label>
                            </div>
                        </div>
                        <div className="create-request-button-container">
                            <div className="create-request-button" onClick={handleCreateRequestClick}>
                                <Icon icon="material-symbols:edit-square-outline" className="create-request-icon" />
                                Tạo yêu cầu
                            </div>
                        </div>
                    </div>
                    <div className="table-pagination-container">
                        <div className="table-container">
                            <table className="request-list">
                                <thead>
                                    <tr>
                                        <th>Mã yêu cầu</th>
                                        <th>Loại yêu cầu</th>
                                        <th>Ngày gửi</th>
                                        <th>Số ngày</th>
                                        <th>Từ ngày</th>
                                        <th>Đến ngày</th>
                                        <th style={{ textAlign: "center" }}>Lý do</th>
                                        <th style={{ textAlign: "center" }}>Tình trạng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentRows.map((row, index) => (
                                        <tr key={index}>
                                            <td>{row.id}</td>
                                            <td>{row.requestType}</td>
                                            <td>{row.dateSent}</td>
                                            <td>{row.daysRequested}</td>
                                            <td>{row.startDate}</td>
                                            <td>{row.endDate}</td>
                                            <td style={{ textAlign: "center", width: "70px" }}>
                                                <div className="request-tooltip">
                                                    <Icon icon="material-symbols:info-outline" className="request-info-icon" />
                                                    <span className="request-tooltip-text">{row.reason}</span>
                                                </div>
                                            </td>
                                            <td style={{ width: "70px", textAlign: "center"}}>
                                                {row.status === 'deny' &&
                                                    <div className="request-tooltip">
                                                        <Icon icon="healthicons-no" className="request-status-icon deny" />
                                                        <span className="request-tooltip-text">{row.deniedReason}</span>
                                                    </div>
                                                }
                                                {row.status === 'pending' && <Icon icon="icomoon-free:hour-glass" className="request-status-icon pending" />}
                                                {row.status === 'approve' && <Icon icon="lets-icons:check-fill" className="request-status-icon approve" />}
                                            </td>
                                        </tr>
                                    ))}
                                    {emptyRows.map((_, index) => (
                                        <tr key={`empty-${index}`} className="empty-row">
                                            <td colSpan="9"></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="request-pagination-container">
                            <div className="request-pagination">
                                <div className="pagination-button" onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
                                    <Icon icon="weui:arrow-filled" className="arrow-icon left" />
                                    Trang đầu
                                </div>
                                {getVisiblePageNumbers().map((pageNumber) => (
                                    <div
                                        key={pageNumber}
                                        className={currentPage === pageNumber ? `pagination-button active` : `pagination-button`}
                                        onClick={() => handlePageChange(pageNumber)}
                                    >
                                        {pageNumber}
                                    </div>
                                ))}
                                <div className="pagination-button" onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>
                                    Trang cuối
                                    <Icon icon="weui:arrow-filled" className="arrow-icon right"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                {showForm && <RequestForm onClose={handleCloseForm} />}
            </div>
        </>
    );
};

export default RequestPage;
