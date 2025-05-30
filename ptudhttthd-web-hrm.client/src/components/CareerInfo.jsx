import { useState, useEffect } from "react";

function CareerInfo({ data }) {
    const [selectedBangCap, setSelectedBangCap] = useState(null);
    const [selectedKinhNghiem, setSelectedKinhNghiem] = useState(null);

    useEffect(() => {
        if (data && data.dsBangCap && data.dsBangCap.$values.length > 0) {
            setSelectedBangCap(data.dsBangCap.$values[0]);
        }
        if (data && data.dsKinhNghiemLamViec && data.dsKinhNghiemLamViec.$values.length > 0) {
            setSelectedKinhNghiem(data.dsKinhNghiemLamViec.$values[0]);
        }
    }, [data]);

    const handleBangCapChange = (event) => {
        const value = event.target.value;
        const { maBang, tenBang } = JSON.parse(value);
        const bangCap = data.dsBangCap.$values.find(
            (bc) => bc.maBang === maBang && bc.tenBang === tenBang
        );
        if (bangCap) {
            setSelectedBangCap(bangCap);
        }
    };

    const handleKinhNghiemChange = (event) => {
        const id = parseInt(event.target.value);
        const kinhNghiem = data.dsKinhNghiemLamViec.$values.find((kn) => kn.id === id);
        if (kinhNghiem) {
            setSelectedKinhNghiem(kinhNghiem);
        }
    };

    if (!data) {
        return <div>Đang tải</div>;
    }

    return (
        <>
            <div className="user-info" id="user-info-edu">
                <div className="user-info-header">Học vấn</div>
                <div className="input-info singular-input-info">
                    <label>Bằng cấp</label>
                    <select
                        value={selectedBangCap ? JSON.stringify({ maBang: selectedBangCap.maBang, tenBang: selectedBangCap.tenBang }) : ""}
                        onChange={handleBangCapChange}
                    >
                        {data.dsBangCap.$values.map((bangCap, index) => (
                            <option
                                key={index}
                                value={JSON.stringify({ maBang: bangCap.maBang, tenBang: bangCap.tenBang })}
                            >
                                {bangCap.tenBang}
                            </option>
                        ))}
                    </select>
                </div>
                {selectedBangCap && (
                    <>
                        <div className="multi-input-info">
                            <div className="input-info">
                                <label>Mã bằng</label>
                                <input
                                    name="MaBang"
                                    type="text"
                                    value={selectedBangCap.maBang || ""}
                                    disabled
                                />
                            </div>
                            <div className="input-info">
                                <label>Ngày cấp</label>
                                <input
                                    name="NgayCap"
                                    type="date"
                                    value={
                                        selectedBangCap.ngayCap
                                            ? selectedBangCap.ngayCap.split("T")[0]
                                            : ""
                                    }
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="multi-input-info">
                            <div className="input-info">
                                <label>Đơn vị cấp</label>
                                <input
                                    name="DonViCap"
                                    type="text"
                                    value={selectedBangCap.donViCap || ""}
                                    disabled
                                />
                            </div>
                            <div className="input-info">
                                <label>SĐT đơn vị cấp</label>
                                <input
                                    name="SDTDonViCap"
                                    type="text"
                                    value={selectedBangCap.sdtDonViCap || ""}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="multi-input-info">
                            <div className="input-info">
                                <label>Học vị</label>
                                <input
                                    name="HocVi"
                                    type="text"
                                    value={selectedBangCap.hocVi || ""}
                                    disabled
                                />
                            </div>
                            <div className="input-info">
                                <label>GPA (/4)</label>
                                <input
                                    name="GPA"
                                    type="text"
                                    value={selectedBangCap.gpa || ""}
                                    disabled
                                />
                            </div>
                            <div className="input-info">
                                <label>ĐTB (/10)</label>
                                <input
                                    name="DTB"
                                    type="text"
                                    value={selectedBangCap.dtb || ""}
                                    disabled
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
            <div className="user-info">
                <div className="user-info-header">Kinh nghiệm làm việc</div>
                <div className="input-info singular-input-info">
                    <label>Vị trí</label>
                    <select
                        value={selectedKinhNghiem ? selectedKinhNghiem.id : ""}
                        onChange={handleKinhNghiemChange}
                    >
                        {data.dsKinhNghiemLamViec.$values.map((kinhNghiem, index) => (
                            <option key={index} value={kinhNghiem.id}>
                                {kinhNghiem.viTri}
                            </option>
                        ))}
                    </select>
                </div>
                {selectedKinhNghiem && (
                    <>
                        <div className="multi-input-info">
                            <div className="input-info">
                                <label>Thời gian làm việc</label>
                                <input
                                    name="ThoiGianLamViec"
                                    type="text"
                                    value={`${selectedKinhNghiem.thoiGianLamViec || ""} tháng`}
                                    disabled
                                />
                            </div>
                            <div className="input-info">
                                <label>Từ ngày</label>
                                <input
                                    name="NgayBatDau"
                                    type="date"
                                    value={
                                        selectedKinhNghiem.ngayBatDau
                                            ? selectedKinhNghiem.ngayBatDau.split("T")[0]
                                            : ""
                                    }
                                    disabled
                                />
                            </div>
                            <div className="input-info">
                                <label>Đến ngày</label>
                                <input
                                    name="NgayKetThuc"
                                    type="date"
                                    value={
                                        selectedKinhNghiem.ngayKetThuc
                                            ? selectedKinhNghiem.ngayKetThuc.split("T")[0]
                                            : ""
                                    }
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="input-info singular-input-info" id="textarea-input-info">
                            <label>Mô tả công việc</label>
                            <textarea name="MoTaCongViec" value={selectedKinhNghiem.moTaCongViec || ""} disabled>
                            </textarea>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default CareerInfo;