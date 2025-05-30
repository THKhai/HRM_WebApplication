import React, { createContext, useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';

export const EditContext = createContext();

export const EditProvider = ({ children }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState({});

    return (
        <EditContext.Provider value={{ isEditing, setIsEditing, userData, setUserData }}>
            {children}
        </EditContext.Provider>
    );
};

export const RequestContext = createContext();

export const RequestProvider = ({ children }) => {
    const [RequestData, setRequestData] = useState(null);
    const navigate = useNavigate();

    const fetchRequestData = async () => {
        try {
            const response = await fetch("api/NhanVien/requestlist", {
                method: "GET",
                headers: {
                    "content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("jwt")}`
                }
            });
            if (response.status === 401) {
                localStorage.removeItem("jwt");
                navigate("/signuplogin");
            } else if (response.ok) {
                const data = await response.json();
                const processedData = data?.$values || [];
                setRequestData(processedData);
            } else {
                console.error(`Có lỗi xảy ra trong quá trình lấy dữ liệu yêu cầu: ${response.statusText}`);
                setRequestData(null);
            }
        }
        catch (error) {
            console.error("Có lỗi xảy ra trong quá trình lấy dữ liệu yêu cầu:", error);
            setRequestData(null);
        }
    };
    return (
        <RequestContext.Provider value={{ RequestData, fetchRequestData }}>
            {children}
        </RequestContext.Provider>
    );
};