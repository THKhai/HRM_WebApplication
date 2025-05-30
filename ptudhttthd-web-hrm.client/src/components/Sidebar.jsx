import React, { useState } from "react";
import "../styles/Sidebar.css";
import { Icon } from '@iconify/react';
import { sidebarConfig } from "./sidebarConfig.js";

function Sidebar({ role, setActiveItem }) {

    const [activeItem, setActiveSidebarItem] = useState(sidebarConfig[role]?.[0]?.name || "");

    const menuItems = sidebarConfig[role] || [];

    const handleItemClick = (itemName) => {
        setActiveSidebarItem(itemName);
        setActiveItem(itemName);
    };

    const handleLogout = () => {
        localStorage.removeItem("jwt");
        window.location.href = "/signuplogin";
    }

    return (
        <div className="sidebar">
            <div className="sidebar-logo">
                <img src="/brand.png" alt="Logo" />
                <h3>Project HRM</h3>
            </div>
            <ul className="sidebar-menu">
                {menuItems.map((item) => (
                    <li
                        key={item.name}
                        className={activeItem === item.name ? "menu-item active" : "menu-item"}
                        onClick={() => handleItemClick(item.name)}
                    >
                        <Icon icon={item.icon} className="icon" />
                        {item.name}
                    </li>
                ))}
            </ul>
            <button type="button" className="logout-btn" onClick={handleLogout}>
                <Icon icon="mdi:logout" className="logout-icon" />
                Đăng xuất
            </button>
        </div>
    );
}

export default Sidebar;
