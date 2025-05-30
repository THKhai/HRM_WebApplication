import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

function PaymentInfo({ data }) {
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [role, setRole] = useState("");

    useEffect(() => {
        if (data && data.vaiTro && data.vaiTro.length > 0) {
            if (data.vaiTro[0] === "Thuong") {
                setRole("Nhân viên thường");
            } else if (data.vaiTro[0] === "QuanLy") {
                setRole("Nhân viên quản lý");
            }
        }
    }, [data]);

    useEffect(() => {
        if (data && data.dsTaiKhoanNganHang && data.dsTaiKhoanNganHang.$values) {
            const activeAccount = data.dsTaiKhoanNganHang.$values.find(account => account.active);
            setSelectedAccount(activeAccount || null);
        }
    }, [data]);

    const handleAccountChange = (event) => {
        const value = event.target.value;
        const { stkNganHang, tenNganHang, chiNhanh } = JSON.parse(value);
        const account = data.dsTaiKhoanNganHang.$values.find(
            (acc) =>
                acc.stkNganHang === stkNganHang &&
                acc.tenNganHang === tenNganHang &&
                acc.chiNhanh === chiNhanh
        );
        if (account) {
            setSelectedAccount(account);
        }
    };

    if (!data) {
        return <div>Đang tải</div>;
    }

    return (
        <div className="user-info">
            <div className="user-info-header">
                Thông tin trả lương
            </div>
            <div className="multi-input-info">
                <div className="input-info">
                    <label>Mã CCCD</label>
                    <input name="CCCD" type="text" value={data.cccd || ""} disabled />
                </div>
                <div className="input-info">
                    <label>Ngày hết hạn</label>
                    <input
                        name="NgayHetHan"
                        type="date"
                        value={data.ngayHetHanCCCD ? data.ngayHetHanCCCD.split('T')[0] : ""}
                        disabled
                    />
                </div>
            </div>
            <div className="multi-input-info">
                <div className="input-info">
                    <label>
                        STK ngân hàng {selectedAccount && selectedAccount.active && (
                            <Icon
                                style={{ fontSize: '24', color: '#2196F3' }}
                                icon="lets-icons:check-fill"
                            />
                        )}
                    </label>
                    <select
                        value={
                            selectedAccount
                                ? JSON.stringify({
                                    stkNganHang: selectedAccount.stkNganHang,
                                    tenNganHang: selectedAccount.tenNganHang,
                                    chiNhanh: selectedAccount.chiNhanh,
                                })
                                : ""
                        }
                        onChange={handleAccountChange}
                    >
                        {data.dsTaiKhoanNganHang && data.dsTaiKhoanNganHang.$values
                            ? data.dsTaiKhoanNganHang.$values.map((account, index) => (
                                <option
                                    key={index}
                                    value={JSON.stringify({
                                        stkNganHang: account.stkNganHang,
                                        tenNganHang: account.tenNganHang,
                                        chiNhanh: account.chiNhanh,
                                    })}
                                >
                                    {account.stkNganHang}
                                </option>
                            ))
                            : null}
                    </select>
                </div>
                <div className="input-info">
                    <label>Mã số thuế</label>
                    <input name="MaSoThue" type="text" value={data.maSoThue || ""} disabled />
                </div>
            </div>
            <div className="multi-input-info">
                <div className="input-info">
                    <label>Tên ngân hàng</label>
                    <input
                        name="TenNganHang"
                        type="text"
                        value={selectedAccount ? selectedAccount.tenNganHang : ""}
                        disabled
                    />
                </div>
                <div className="input-info">
                    <label>Chi nhánh ngân hàng</label>
                    <input
                        name="ChiNhanh"
                        type="text"
                        value={selectedAccount ? selectedAccount.chiNhanh : ""}
                        disabled
                    />
                </div>
            </div>
            <div className="multi-input-info">
                <div className="input-info">
                    <label>Vai trò</label>
                    <input name="VaiTro" type="text" value={role} disabled />
                </div>
                <div className="input-info">
                    <label>Lương cơ bản</label>
                    <input
                        name="LuongCoBan"
                        type="text"
                        value={
                            data.luongCoBan ? `${data.luongCoBan.toLocaleString()} VNĐ` : ""
                        }
                        disabled
                    />
                </div>
                <div className="input-info">
                    <label>Điểm thưởng</label>
                    <input
                        name="DiemThuong"
                        type="text"
                        value={data.diemThuong || ""}
                        disabled
                    />
                </div>
                <div className="input-info">
                    <label>Phạt</label>
                    <input
                        name="Phat"
                        type="text"
                        value={
                            data.tienPhat ? `- ${data.tienPhat.toLocaleString()} VNĐ` : ""
                        }
                        disabled
                    />
                </div>
            </div>
            <div className="multi-input-info">
                <div className="input-info">
                    <label>Số ngày nghỉ có phép còn lại</label>
                    <input
                        name="SoNgayNghiCoPhepConLai"
                        type="text"
                        value={
                            data.soNgayNghiCoPhepConLai
                                ? `${data.soNgayNghiCoPhepConLai} Ngày`
                                : ""
                        }
                        disabled
                    />
                </div>
                <div className="input-info">
                    <label>Số ngày nghỉ không phép</label>
                    <input
                        name="SoNgayNghiKhongPhep"
                        type="text"
                        value={
                            data.soNgayNghiKhongPhep
                                ? `${data.soNgayNghiKhongPhep} Ngày`
                                : ""
                        }
                        disabled
                    />
                </div>
            </div>
        </div>
    );
}

export default PaymentInfo;