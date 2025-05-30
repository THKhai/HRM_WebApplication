import { Icon } from "@iconify/react";
import React, { useContext, useState, useEffect, useRef } from "react";
import "../styles/UserInfoHeader.css";
import { EditContext } from "./EditContext";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const EditButton = ({ onUpdate }) => {
    const { isEditing, setIsEditing, userData, setUserData } = useContext(EditContext);
    const navigate = useNavigate();

    const handleSave = async () => {
        try {
            const response = await fetch('/api/NhanVien/edit', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("jwt")}`
                },
                body: JSON.stringify(userData)
            });

            if (response.status === 401) {
                localStorage.removeItem("jwt");
                navigate("/signuplogin");
            } else if (response.ok) {
                toast.success("Thông tin đã được cập nhật.");
                onUpdate(userData);
            } else {
                const errorDetail = await response.json();
                toast.error(errorDetail.message || "Lỗi cập nhật thông tin nhân viên");
            }
        } catch (error) {
            toast.error(error.message || "Lỗi cập nhật thông tin nhân viên");
        }
    };

    return (
        <div onClick={() => {
            if (isEditing) {
                handleSave();
            }
            setIsEditing(!isEditing);
        }} className="edit-button">
            <Icon icon="ic:baseline-edit" className="edit-icon" />
            {isEditing ? "Lưu" : "Chỉnh sửa"}
        </div>
    );
};

function UserInfoHeader({ data, onUpdate }) {
    const [role, setRole] = useState("");
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (data && data.vaiTro && data.vaiTro.length > 0) {
            if (data.vaiTro[0] === "Thuong") {
                setRole("Nhân viên thường");
            } else if (data.vaiTro[0] === "QuanLy") {
                setRole("Nhân viên quản lý");
            }
        }
    }, [data]);

    // Tải ảnh đại diện
    const handleProfileClick = () => {
        fileInputRef.current.click();
    };

    // Xử lý tải ảnh đại diện
    const handleFileChange = async (event) => {
        const myfile = event.target.files[0];
        const maxFileSizeMB = 20;
        const allowedTypes = ['image/jpeg', 'image/png'];

        // Kiểm tra dung lượng và định dạng file
        if (!allowedTypes.includes(myfile.type) || myfile.size / 1024 / 1024 > maxFileSizeMB) {
            toast.warning(
                `File ảnh không hợp lệ (không đúng định dạng hoặc vượt quá ${maxFileSizeMB}MB): ${myfile.name}`
            );
            return;
        }

        const formData = new FormData();
        formData.append('pfpfile', myfile);

        // Gửi file ảnh lên server
        try {
            const response = await fetch('/api/NhanVien/uploadAvatar', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("jwt")}`
                },
                body: formData
            });

            if (response.status === 401) {
                localStorage.removeItem("jwt");
                navigate("/signuplogin");
            } else if (response.ok) {
                console.log("trong OK");
                const result = await response.json();
                toast.success("Tải ảnh lên thành công");
                onUpdate({ ...data, linkHinh: result.ImageUrl });
            } else {
                toast.error("Tải ảnh lên thất bại");
            }
        } catch (error) {
            console.log("Bắt được error", error.message);
            toast.error(error.message || "Lỗi tải ảnh lên");
        }
    };

    if (!data) {
        return <div>Đang tải</div>;
    }

    return (
        <div className="userinfo-header">
            <div className="header-info1">
                <div className="header-avatar-container">
                    <img className="header-avatar" src={data.linkHinh || "/user_avatar.png"} alt="Avatar" onClick={handleProfileClick} />
                    <div className="header-avatar-overlay" onClick={handleProfileClick}>
                        <div className="overlay-text">Tải ảnh lên</div>
                    </div>
                    <input
                        type="file"
                        className="request-form-file-input"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        accept=".png,.jpeg,.jpg"
                    />
                </div>
                <div className="header-info2">
                    <div className="userinfo-header-name">{data.tenNhanVien || ""}</div>
                    <div> {role} </div>
                    <div className="icon-text">
                        <Icon icon="material-symbols:mail" className="icon" />
                        {data.email}
                    </div>
                    <div className="icon-text">
                        <Icon icon="mdi:phone" className="icon" />
                        {data.sdt || ""}
                    </div>
                </div>
            </div>
            <EditButton onUpdate={onUpdate} />
        </div>
    );
}

export default UserInfoHeader;
