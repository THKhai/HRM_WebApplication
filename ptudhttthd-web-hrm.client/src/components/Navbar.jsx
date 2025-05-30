import React from "react";
import { Icon } from '@iconify/react';
import { useState, useEffect } from "react";
import "../styles/Navbar.css";

function Navbar({ data }) {
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

    if (!data) {
        return <div>Đang tải</div>;
    }

    return (
        <div className="navbar">
            <div className="navbar-icons">
                <span className="notification-icon">
                    <Icon icon="mdi:bell" className = "bell-icon"/>
                    <span className="notification-badge">1</span>
                </span>
            </div>
            <div className="user-info-nav">
                <div>
                    <span className="user-name">{data.tenNhanVien || ""}</span>
                    <br />
                    <span className="user-role">{role}</span>
                </div>
                <img src={data.linkHinh || "/user_avatar.png"} alt="User Avatar" className="avatar" />
            </div>
        </div>
    );
}

export default Navbar;