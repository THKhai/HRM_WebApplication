import React, { useState,useContext } from 'react';
import '../styles/RequestPage.css';
import { Icon } from '@iconify/react';
import RequestDenialForm from './RequestDenialForm';
import { toast } from 'react-toastify';
import { RequestContext } from './EditContext';
import { useNavigate } from 'react-router-dom';

const QuanLy_RequestPage = (data) => {

    const tmpData = data.data.map(
        item => ({
            id: item.idYeuCau,
            name: item.nhanVien,
            dateSent: (item.ngayGui).split('T')[0],
            daysRequested: item.soNgayYeuCau,
            startDate: (item.ngayBD).split('T')[0],
            endDate: (item.ngayKT).split('T')[0],
            reason: item.lyDo,
            status: item.tinhTrang,
            requestType: item.loaiYeuCau
        })
    )
    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const date = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${date}`;
    };

    const { RequestData, fetchRequestData } = useContext(RequestContext);
    const [searchQuery, setSearchQuery] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [TypeRequest, setTypeRequest] = useState([]);
    const [startDateFilter, setStartDateFilter] = useState('2020-01-01');
    const [endDateFilter, setEndDateFilter] = useState(getCurrentDate());
    const [selectId, setSelectId] = useState([]);

    const navigate = useNavigate();

    const handleTypeChange = (e) => {
        const { value, checked } = e.target;
        setTypeRequest(prev =>
            checked ? [...prev, value] : prev.filter(loaiYeuCau => loaiYeuCau !== value)
        );
    };

    const handleDateChange = (e, type) => {
        if (type === 'start')
            setStartDateFilter(e.target.value);
        if (type === 'end')
            setEndDateFilter(e.target.value);
    };

    const filteredData = tmpData.filter(item => {
        const matchedName = searchQuery ? item.name.toString().includes(searchQuery) : true;
        const matchesId = searchQuery ? item.id.toString().includes(searchQuery)  : true;
        const matchesType = TypeRequest.length > 0 ? TypeRequest.includes(item.requestType) : true;
        const matchesStartDate = new Date(item.dateSent) >= new Date(startDateFilter);
        const endDate = new Date(endDateFilter);
        endDate.setHours(23, 59, 59, 999);
        const matchesEndDate = new Date(item.dateSent) <= endDate;
        return (matchedName || matchesId) && matchesType && matchesStartDate && matchesEndDate;
    });

    // Số lượng yêu cầu của mỗi trang
    const rowsPerPage = 10;

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const currentRows = filteredData.slice(startIndex, endIndex);
    const emptyRows = Array(rowsPerPage - currentRows.length).fill(null);

    const totalPages = Math.ceil(tmpData.length / rowsPerPage);

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
    const handleSearchId = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleRequestDenialClick = () => {
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
    };

    const handleApproveRequests = async () => {

        if (selectId.length === 0) {
            toast.warning("Vui lòng chọn ít nhất 1 yêu cầu");
            return;
        }
        const payload = {
            requestIds: selectId,
            tinhTrang: "approve",
            lyDoTuChoi:""
        };

        try {
            const response = await fetch('/api/QuanLy/approveRequest', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${localStorage.getItem("jwt")}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                toast.success("Duyệt yêu cầu thành công");
                setSelectId([]);
                fetchRequestData();
            }
            else if (response.status === 401) {
                localStorage.removeItem("jwt");
                setSelectId([]);
                navigate("/signuplogin");
            }
            else {
                const errorData = await response.json();
                console.log(errorData);
                toast.error(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Có lỗi xảy ra trong quá trình phê duyệt yêu cầu", error);
            toast.error("Có lỗi xảy ra trong quá trình phê duyệt yêu cầu");
        }
    };

    const handleCheckboxChange = (e, id) => {
        if (e.target.checked) {
            setSelectId((prev) => [...prev, id]);
        } else {
            setSelectId((prev) => prev.filter((requestId) => requestId !== id));
        }

    };
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            // Chọn tất cả các mục trong trang hiện tại
            const ids = currentRows.map((row) => row.id);
            setSelectId((prev) => [...new Set([...prev, ...ids])]);
        } else {
            // Bỏ chọn tất cả các mục trong trang hiện tại
            const ids = currentRows.map((row) => row.id);
            setSelectId((prev) => prev.filter((id) => !ids.includes(id)));
        }
    };

    const handleDownloadFilesByRequest = async (requestId) => {
        try {
            const response = await fetch(`/api/QuanLy/downloadFilesByRequest/${requestId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("jwt")}`,
                },
            });

            if (response.ok) {
                const blob = await response.blob();
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = `Request_${requestId}_Files.zip`;
                link.click();
            }
            else if (response.status === 404) {
                toast.warning(`Không có tập tin đính kèm cho yêu cầu ${requestId}`)
            }
            else if (response.status === 401) {
                localStorage.removeItem("jwt");
                navigate("/signuplogin");
            }
            else {
                const errorData = await response.json();
                console.log(errorData);
                toast.error(`Có lỗi xảy ra trong quá trình tải file`);
            }

        } catch (error) {
            console.error("Có lỗi xảy ra trong quá trình tải file:", error);
            toast.error(`Có lỗi xảy ra trong quá trình tải file`);

        }
    };

    return (
        <>
            <div className="request-page-container">
                <div className="request-header-search-container">
                    <div className="request-header">Danh sách yêu cầu cần phê duyệt</div>
                    <div className="request-search-filter">
                        <input type="text" name="request-search" placeholder="Tìm kiếm mã yêu cầu / người gửi" value={searchQuery} onChange={handleSearchId} />
                        <Icon icon="material-symbols:search" className="search-icon" />
                    </div>
                </div>
                <div className="request-page-table-filter-container">
                    <div className="request-page-filter-container">
                        <div className="request-date-filter">
                            <label>Ngày gửi</label>
                            <div className="request-date-input">
                                <input type="date" defaultValue="2020-01-01" min="2020-01-01" max={getCurrentDate()} onChange={(e) => handleDateChange(e, 'start')} />
                                <Icon icon="octicon:dash-16" className="request-page-dash-icon" />
                                <input type="date" defaultValue={getCurrentDate()} min="2020-01-01" max={getCurrentDate()} onChange={(e) => handleDateChange(e,'end')} />
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
                        <div className="create-request-button-container">
                            <div className="request-deny-button" onClick={handleRequestDenialClick} >
                                <Icon icon="healthicons-no" className="request-status-icon deny"  />
                                Không duyệt
                            </div>
                            <div className="request-approve-button" onClick={handleApproveRequests} >
                                <Icon icon="lets-icons:check-fill" className="request-status-icon approve" />
                                Duyệt
                            </div>
                        </div>
                    </div>
                    <div className="table-pagination-container">
                        <div className="table-container">
                            <table className="request-list">
                                <thead>
                                    <tr>
                                        <th><input
                                            type="checkbox"
                                            onChange={handleSelectAll}
                                            checked={currentRows.every((row) => selectId.includes(row.id)) && currentRows.length > 0}
                                        />
                                        </th>
                                        <th>Loại yêu cầu</th>
                                        <th>Mã yêu cầu</th>
                                        <th>Người gửi</th>
                                        <th>Ngày gửi</th>
                                        <th>Số ngày</th>
                                        <th>Từ ngày</th>
                                        <th>Đến ngày</th>
                                        <th style={{ textAlign: "center" }}>Lý do</th>
                                        <th style={{ textAlign: "center" }}>Đính kèm</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentRows.map((row, index) => (
                                        <tr key={index}>
                                            <td style={{ width: "20px" }}><input
                                                type="checkbox"
                                                onChange={(e) => handleCheckboxChange(e, row.id)}
                                                checked={selectId.includes(row.id)} />
                                            </td>
                                            <td>{row.requestType}</td>
                                            <td>{row.id}</td>
                                            <td>{row.name}</td>
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
                                            <td style={{ width: "70px", textAlign: "center" }}>
                                                <Icon icon="material-symbols:download-rounded" className="request-download-icon" onClick={() => handleDownloadFilesByRequest(row.id)} />
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
                                    <Icon icon="weui:arrow-filled" className="arrow-icon right" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                {showForm && <RequestDenialForm selectId={selectId} setSelectId={setSelectId} onClose={handleCloseForm}  />}
            </div>
        </>
    );
}

export default QuanLy_RequestPage;