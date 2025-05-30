import React from "react";
import "../styles/Tabs.css";

const Tabs = ({ activeTab, setActiveTab }) => {
    return (
        <div className="tabs">
            <div
                className={`tab-item ${activeTab === 0 ? "active" : ""}`}
                onClick={() => setActiveTab(0)}
            >
                Thông tin cơ bản
            </div>
            <div
                className={`tab-item ${activeTab === 1 ? "active" : ""}`}
                onClick={() => setActiveTab(1)}
            >
                Thông tin trả lương
            </div>
            <div
                className={`tab-item ${activeTab === 2 ? "active" : ""}`}
                onClick={() => setActiveTab(2)}
            >
                Thông tin học vấn, kinh nghiệm
            </div>
        </div>
    );
};

export default Tabs;
