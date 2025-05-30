import React, { useContext, useEffect} from "react";
import "../styles/UserInfo.css";
import { EditContext } from "./EditContext";
function BasicInfo({ data }) {
    if (!data) {
        return <div>Đang tải</div>;
    }
    const { isEditing, setIsEditing, userData, setUserData } = useContext(EditContext);

    useEffect(() => {
        if (data) {
            setUserData({
                ...data,
                GioiTinh: data.gioiTinh || "",
                NgaySinh: data?.ngaySinh ? data.ngaySinh.split('T')[0] : "",
                SDT: data.sdt || "",
                SDTNguoiThan: data.sdtNguoiThan || "",
                NoiOHienTai: data.noiOHienTai || "",
                diaChiThuongTru: data.diaChiThuongTru || ""
            });
        }
    }, [data, setUserData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    return (
        <div className="user-info">
            <div className="user-info-header">
                Thông tin cơ bản
            </div>
            <div className="multi-input-info">
                <div className="input-info">
                    <label>Mã nhân viên</label>
                    <input name="NhanVienID" type="text" value={data.nhanVienID || ""} disabled />
                </div>
                <div className="input-info">
                    <label>Tên đăng nhập</label>
                    <input name="TenDangNhap" type="text" value={data.tenDangNhap || ""} disabled />
                </div>
            </div>
            <div className="multi-input-info">
                <div className="input-info">
                    <label>Họ tên</label>
                    <input name="tenNhanVien" type="text" value={data.tenNhanVien || ""}  disabled />
                </div>
                <div className="input-info">
                    <label>Email</label>
                    <input name="Email" type="text" value={data.email || ""}  disabled />
                </div>
            </div>
            <div className="multi-input-info">
                <div className="input-info">
                    <label>Giới tính</label>
                    <input name="GioiTinh" type="text" value={userData.GioiTinh || ""} onChange={handleChange} disabled={!isEditing} />
                </div>
                <div className="input-info">
                    <label>Ngày sinh</label>
                    <input name="NgaySinh" type="date" value={userData.NgaySinh || ""} onChange={handleChange} disabled={!isEditing} />
                </div>
            </div>
            <div className="multi-input-info">
                <div className="input-info">
                    <label>SĐT liên lạc</label>
                    <input name="SDT" type="text" value={userData.SDT || ""} onChange={handleChange} disabled={!isEditing} />
                </div>
                <div className="input-info">
                    <label>SĐT người thân</label>
                    <input name="SDTNguoiThan" type="text" value={userData.SDTNguoiThan || ""} onChange={handleChange} disabled={!isEditing} />
                </div>
            </div>
            <div className="multi-input-info">
                <div className="input-info">
                    <label>Mã người quản lý</label>
                    <input name="VaiTro" type="text" value={data.quanLyID || ""} disabled />
                </div>
                <div className="input-info">
                    <label>Ngày bắt đầu làm việc</label>
                    <input name="NgayBatDauLamViec" type="date" value={data.ngayBatDauLamViec ? data.ngayBatDauLamViec.split('T')[0] : ""} disabled />
                </div>
            </div>
            <div className="input-info singular-input-info">
                <label>Nơi ở hiện tại</label>
                <input
                    name="NoiOHienTai"
                    type="text"
                    value={userData.NoiOHienTai || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                />
            </div>
            <div className="input-info singular-input-info">
                <label>Địa chỉ thường trú</label>
                <input
                    type="text"
                    value={userData.diaChiThuongTru || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                />
            </div>
        </div>
    );
}

export default BasicInfo;
