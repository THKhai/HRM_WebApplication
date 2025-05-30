import React, { useState, useEffect,useContext } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import BasicInfo from "./BasicInfo";
import PaymentInfo from "./PaymentInfo";
import CareerInfo from "./CareerInfo";
import Tabs from "./Tabs";
import UserInfoHeader from "./UserInfoHeader";
import RequestPage from "./RequestPage";
import QuanLy_RequestPage from "./QuanLy_RequestPage";
import { sidebarConfig } from "./sidebarConfig.js";
import { RequestContext } from "./EditContext";
import QuanLy_NhanVien from "./QuanLy_NhanVien";
function HomePage() {
    const [activeTab, setActiveTab] = useState(0);
    const [activeSidebarItem, setActiveSidebarItem] = useState("");
    const [userData, setUserData] = useState(null);
    const [shouldRefetch, setShouldRefetch] = useState(false);
    const { RequestData, fetchRequestData } = useContext(RequestContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/NhanVien/info", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("jwt")}`
                    }
                });

                if (response.status === 401) {
                    localStorage.removeItem("jwt");
                    navigate("/signuplogin");
                } else if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                    setActiveSidebarItem(sidebarConfig[data.vaiTro[0]]?.[0]?.name || "Thông tin cá nhân");
                } else {
                    console.error(`Error fetching data: ${response.statusText}`);
                    setUserData(null);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setUserData(null);
            }
        };

        fetchData();
    }, [navigate, shouldRefetch]); 

    useEffect(() => {
        fetchRequestData();
    }, []);

    const handleUserDataUpdate = (newData) => {
        setUserData(newData);
        setShouldRefetch(!shouldRefetch);
    };

    const renderContent = () => {
        if (!userData.vaiTro[0] || !sidebarConfig[userData.vaiTro[0]]) {
            <div>Role không tồn tại hoặc chưa thiết lập cấu hình cho sidebar</div>;
        }

        switch (activeSidebarItem) {
            case "Thông tin cá nhân":
                return (
                    <>
                        <UserInfoHeader data={userData} onUpdate={handleUserDataUpdate} />
                        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
                        <div className="tab-content">{renderTabContent()}</div>
                    </>
                );
            case "Yêu cầu": {
                if (userData.vaiTro[0] === "Thuong") {
                    return (
                        RequestData ? (
                            <RequestPage data={RequestData} />
                        ) : (
                            <div>Đang tải danh sách yêu cầu...</div>
                        )
                    );
                }
                else if (userData.vaiTro[0] === "QuanLy") {
                    return (
                        RequestData ? (
                            <QuanLy_RequestPage data={RequestData} />
                        ) : (
                            <div>Đang tải danh sách yêu cầu...</div>
                        )
                    );
                }
                else {
                    return (
                        <div>Role không hợp lệ</div>
                    );
                }
            };
            case "Danh sách nhân viên":
                return <QuanLy_NhanVien id={userData.nhanVienID} />
            case "Hoạt động":
                return <div>Tính năng còn đang phát triển</div>;
            case "Điểm thưởng":
                return <div>Tính năng còn đang phát triển</div>;
            default:
                return <div>Chọn một mục từ sidebar.</div>;
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 0:
                return <BasicInfo data={userData} />;
            case 1:
                return <PaymentInfo data={userData} />;
            case 2:
                return <CareerInfo data={userData} />;
            default:
                return null;
        }
    };

    if (!userData) {
        return <div>Đang tải...</div>;
    }

    return (
        <div className="app">
            <Sidebar role={userData.vaiTro[0]} setActiveItem={setActiveSidebarItem} />
            <div className="main-content">
                <Navbar data={userData} />
                <div className="app-container">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

export default HomePage;