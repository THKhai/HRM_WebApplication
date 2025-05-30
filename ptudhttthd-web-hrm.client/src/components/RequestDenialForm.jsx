import React, { useState,  useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RequestForm.css';
import { toast } from 'react-toastify';
import { RequestContext } from "./EditContext";

const RequestDenialForm = ({ selectId, setSelectId, onClose }) => {
    const { RequestData, fetchRequestData } = useContext(RequestContext);
    const [denialReason, setDenialReasion] = useState('')
    const navigate = useNavigate();

    const handleDenyRequests = async () => {

        if (selectId.length === 0) {
            toast.warning("Vui lòng chọn ít nhất 1 yêu cầu");
            return;
        }

        const payload = {
            requestIds: selectId,
            tinhTrang: "deny",
            lyDoTuChoi: denialReason
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
                toast.success("Từ chối yêu cầu thành công");
                setSelectId([]);
                onClose();
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
            console.error("Có lỗi xảy ra trong quá trình từ chối yêu cầu", error);
            toast.error("Có lỗi xảy ra trong quá trình từ chối yêu cầu");
        }
    };

    return (
        <div className="request-form-overlay">
            <div style={{ width: "500px", height: "350px" }} className="request-form-popup">
                <div className="request-form-header">Lý do không duyệt yêu cầu</div>
                <div style={{ height: "100%" }} className="request-form-input-container">
                    <textarea className="request-denial-reason-textarea" value={denialReason} onChange={(e) => setDenialReasion(e.target.value)}></textarea>
                </div>

                <div style={{justifyContent: "center"}} className="request-form-actions">
                    <div
                        className="request-form-btn-cancel"
                        onClick={onClose}
                    >
                        Hủy
                    </div>
                    <div
                        className="request-denial-form-btn-deny"
                        onClick={handleDenyRequests}
                    >
                        Không duyệt
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestDenialForm;