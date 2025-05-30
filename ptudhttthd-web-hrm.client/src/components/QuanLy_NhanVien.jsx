import Reaact, {useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/QuanLy_NhanVien.css';
import { Icon } from '@iconify/react';

const QuanLy_NhanVien = ({ id }) => {
    const [data, setData] = useState([]);

    const navigate = useNavigate();
    useEffect(() => {
        const fetchdata = async () => {
            try {

                const response = await fetch(`api/QuanLy/${id}/nhanviens`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("jwt")}`
                    },
                });
                if (response.status === 401) {
                    localStorage.removeItem("jwt");
                    navigate("/signuplogin");
                } else if (response.ok) {
                    const result = await response.json();
                    setData(result.$values);
                } else {
                    consele.error(`Error fetching data: ${response.statusText}`);
                }
            }
            catch (error) {
                console.error("Error fetching data:", error);
            }
        }
        fetchdata();
    }, [navigate]);

    const handlePageChange = (pageNumber) => {

    };
    return (
        <div className="Management-page-container">
            <div className="Managament-header">Danh sách nhân viên quản lý
                <div className = "Search-header">
                     <div className="Employee-search-filter">
                        <div className="Search-title">Tìm kiếm mã/tên nhân viên</div>
                        <div className="Search-bar">
                                <input type="text" className = "Search-content"placeholder="NV001"></input>
                                <Icon icon="material-symbols:search" className="Search-icon"></Icon>
                            </div>
                    </div>
                    <div className="Adjustment-container">
                        <div className="Delete-button">Xóa khỏi danh</div>
                        <div className = "Adding-list-button">Thêm vào danh sách</div>
                    </div>
                </div>
            </div>
            <div className = "table-pagination-container">
                <div className="Table-container">
                    <table className = "data-list">
                        <thead>
                            <tr>
                                <th><input className="Check-box" type="checkbox"></input></th>
                                <th>Mã nhân viên</th>
                                <th>Họ và tên</th>
                                <th style={{ textAlign: "center" }}>Thông tin cơ bản</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((NhanVien, index) => (
                                <tr key={index}>
                                    <td><input type="checkbox" /></td>
                                    <td>{NhanVien.nhanVienID}</td>
                                    <td>{NhanVien.tenNhanVien}</td>
                                    <td className="info-tooltip" title="Thông tin cơ bản"><Icon icon="material-symbols:info-outline" className="Info-icon" /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/*Pagination controls*/}
                <div className="pagination-controls">
                    <div className="selection-count">
                        Đã chọn {1} nhân viên
                    </div>
                    <div className="items-per-page">
                        <select>
                            <option value={5}>5</option>
                            <option value={6}>6</option>
                            <option value={7}>7</option>
                        </select>
                        dòng/trang
                    </div>
                    <div className="pagination-container">
                        <div className="pagination-buttons" onClick={() => handlePageChange(1)}>
                            <Icon icon="weui:arrow-filled" className = "arrow-icon left" />
                            Trang đầu
                        </div>
                        {Array.from({ length: 3  }, (_, i) => (
                            <div
                                className="pagination-buttons"
                                value = {i + 1}
                                onClick={() => handlePageChange(i + 1)}
                                style={{
                                    fontWeight: i + 1 === 1 ? "bold" : "normal",
                                    margin: "0 2px",
                                }}
                            >
                                {i + 1}
                            </div>
                        ))}
                        <div className="pagination-buttons"  onClick={() => handlePageChange(2)}>
                            <Icon icon="weui:arrow-filled" className="arrow-icon right" />
                            Trang cuối
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default QuanLy_NhanVien;