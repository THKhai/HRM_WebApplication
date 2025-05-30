import React, { useState, useRef, useEffect, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RequestForm.css';
import { Icon } from '@iconify/react';
import { toast } from 'react-toastify';
import { RequestContext } from './EditContext';

const RequestForm = ({ onClose }) => {
    const { RequestData, fetchRequestData } = useContext(RequestContext);
    const [requestType, setRequestType] = useState('1');
    const [daysRequested, setDaysRequested] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    // Xử lý files được tải lên
    const handleFileChange = (event) => {
        const newFiles = Array.from(event.target.files);
        const totalFiles = selectedFiles.length + newFiles.length;

        const maxFileSizeMB = 20;
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/zip', 'application/x-rar-compressed'];

        // Kiểm tra dung lượng và định dạng các files
        const invalidFiles = newFiles.filter(
            (file) => !allowedTypes.includes(file.type) || file.size / 1024 / 1024 > maxFileSizeMB
        );

        if (invalidFiles.length > 0) {
            const invalidFileNames = invalidFiles.map((file) => file.name).join(', ');
            toast.warning(
                `Các tập tin sau không hợp lệ (không đúng định dạng hoặc vượt quá ${maxFileSizeMB}MB): ${invalidFileNames}`
            );
            return;
        }

        if (totalFiles > 5) {
            toast.warning('Chỉ có thể tải lên tối đa 5 files');
            return;
        }

        setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
    };

    // Thêm tập tin đính kèm
    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    // Xóa các files đính kèm đã tải lên
    const handleDeleteChecked = () => {
        setSelectedFiles(selectedFiles.filter((_, index) => !document.getElementById(`file-${index}`).checked));
        selectedFiles.forEach((_, index) => {
            const checkbox = document.getElementById(`file-${index}`);
            if (checkbox.checked) {
                checkbox.checked = false;
            }
        });
    };

    // Tính tổng số ngày nghỉ dựa vào ngày BD và ngày KT
    useEffect(() => {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);

            if (start <= end) {
                const calculatedDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
                setDaysRequested(calculatedDays);
            } else {
                setDaysRequested(0);
            }
        }
    }, [startDate, endDate]);

    // Xử lý gửi yêu cầu
    const handleSubmit = async () => {
        // Kiểm tra thỏa ngày BD < ngày KT
        if (new Date(endDate) < new Date(startDate)) {
            toast.warning('Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu');
            return;
        }

        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('MaLoaiYC', requestType);
        formData.append('SoNgayYeuCau', daysRequested);
        formData.append('NgayBD', startDate);
        formData.append('NgayKT', endDate);
        formData.append('LyDo', reason);
        selectedFiles.forEach((file) => {
            formData.append(`Files`, file);
        });

        // Gửi data yêu cầu lên server
        try {
            const response = await fetch("api/NhanVien/request", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("jwt")}`
                },
                body: formData,
            });

            if (response.status === 401) {
                localStorage.removeItem("jwt");
                navigate("/signuplogin");
            }
            else if (response.ok) {
                toast.success('Yêu cầu đã được gửi thành công');
                fetchRequestData();
                onClose();
            } else {
                toast.error("Có lỗi xảy ra khi gửi yêu cầu");
            }
        } catch (error) {
            toast.error(error.message || 'Có lỗi xảy ra khi gửi yêu cầu');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="request-form-overlay">
            <div className="request-form-popup">
                <div className="request-form-header">Form gửi yêu cầu</div>
                <div className="request-form-multi-input-container">
                    <div className="request-form-input-container">
                        <label className="request-form-label">Loại yêu cầu</label>
                        <select className="request-form-select" value={requestType} onChange={(e) => setRequestType(e.target.value)}>
                            <option value="1">Nghỉ phép</option>
                            <option value="2">WFH</option>
                            <option value="3">Check-in</option>
                            <option value="4">Check-out</option>
                            <option value="5">Cập nhật bảng chấm công</option>
                            <option value="6">Khác</option>
                        </select>
                    </div>
                    <div className="request-form-input-container">
                        <label className="request-form-label">Số ngày yêu cầu</label>
                        <input
                            type="number"
                            className="request-form-input"
                            value={daysRequested}
                            disabled
                        />
                    </div>
                </div>

                <div className="request-form-multi-input-container">
                    <div className="request-form-input-container">
                        <label className="request-form-label">Từ ngày</label>
                        <input
                            type="date"
                            className="request-form-input"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            min="2020-01-01"
                        />
                    </div>

                    <div className="request-form-input-container">
                        <label className="request-form-label">Đến hết ngày</label>
                        <input
                            type="date"
                            className="request-form-input"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            min="2020-01-01"
                        />
                    </div>
                </div>

                <div className="request-form-multi-input-container" style={{ height: "100%" }}>
                    <div className="request-form-input-container">
                        <label className="request-form-label">Lý do yêu cầu</label>
                        <textarea
                            className="request-form-textarea"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                    </div>

                    <div className="request-form-input-container">
                        <div className="request-form-file-container">
                            <label className="request-form-label">Tập tin đính kèm</label>
                            <div className="request-form-upload-controls">
                                <div
                                    role="button"
                                    onClick={handleDeleteChecked}
                                    title="Xóa tập tin đã chọn"
                                >
                                    <Icon icon="material-symbols:delete" className="request-form-delete-button" />
                                </div>
                                <div
                                    role="button"
                                    onClick={handleUploadClick}
                                    title="Thêm tập tin"
                                >
                                    <Icon icon="mdi:file-document-add" className="request-form-upload-button" />
                                </div>
                            </div>
                        </div>
                        <input
                            type="file"
                            className="request-form-file-input"
                            multiple
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                            accept=".pdf,.png,.jpg,.jpeg,.zip,.rar"
                        />
                        <div className="request-form-file-list-container">
                            {selectedFiles.map((file, index) => (
                                <div key={index} className="request-form-file-item">
                                    <input
                                        type="checkbox"
                                        className="request-form-file-checkbox"
                                        id={`file-${index}`}
                                    />
                                    <label htmlFor={`file-${index}`} className="request-form-file-label">
                                        {file.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="request-form-actions">
                    <div
                        className="request-form-btn-cancel"
                        onClick={onClose}
                    >
                        Hủy
                    </div>
                    <div
                        className="request-form-btn-submit"
                        onClick={handleSubmit}
                    >
                        {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestForm;
