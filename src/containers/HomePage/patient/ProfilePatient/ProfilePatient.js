import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import './ProfilePatient.scss';
import axios from '../../../../axios'; // hoặc 'axios';

function ProfilePatient() {
    const dispatch = useDispatch();
    const patient = useSelector(state => state.user.userInfo);
    const [isEdit, setIsEdit] = useState(false);
    const [form, setForm] = useState({
        name: patient?.name || '',
        gender: patient?.gender || '',
        phoneNumber: patient?.phoneNumber || '',
        dateOfBirth: patient?.dateOfBirth || '',
        address: patient?.address || ''
    });

    if (!patient) {
        return <div className="profile-patient-container"><div className="profile-patient-card">Bạn chưa đăng nhập.</div></div>;
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
    try {
        const res = await axios.put('/api/patient/profile', {
            ...form,
            email: patient.email
        });
        if (res.data && res.data.code === 0) {
            setForm({
                name: res.data.patient.name,
                gender: res.data.patient.gender,
                phoneNumber: res.data.patient.phoneNumber,
                dateOfBirth: res.data.patient.dateOfBirth,
                address: res.data.patient.address
            });
            setIsEdit(false);
            alert('Cập nhật thành công!');
        } else {
            alert(res.data.message || 'Cập nhật thất bại!');
        }
    } catch (err) {
        alert('Có lỗi xảy ra khi cập nhật!');
    }
};

    return (
        <div className="profile-patient-container">
            <div className="profile-patient-card">
                <h2>Thông tin tài khoản</h2>
                <div className="profile-patient-info">
                    <div className="profile-row">
                        <span className="profile-label">Họ tên:</span>
                        {isEdit ? (
                            <input
                                className="profile-input"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                            />
                        ) : (
                            <span className="profile-value">{patient.name}</span>
                        )}
                    </div>
                    <div className="profile-row">
                        <span className="profile-label">Email:</span>
                        <span className="profile-value">{patient.email}</span>
                    </div>
                    <div className="profile-row">
                        <span className="profile-label">Giới tính:</span>
                        {isEdit ? (
                            <select
                                className="profile-input"
                                name="gender"
                                value={form.gender}
                                onChange={handleChange}
                            >
                                <option value="">Chọn giới tính</option>
                                <option value="M">Nam</option>
                                <option value="F">Nữ</option>
                                <option value="O">Khác</option>
                            </select>
                        ) : (
                            <span className="profile-value">{patient.gender}</span>
                        )}
                    </div>
                    <div className="profile-row">
                        <span className="profile-label">Số điện thoại:</span>
                        {isEdit ? (
                            <input
                                className="profile-input"
                                name="phoneNumber"
                                value={form.phoneNumber}
                                onChange={handleChange}
                            />
                        ) : (
                            <span className="profile-value">{patient.phoneNumber}</span>
                        )}
                    </div>
                    <div className="profile-row">
                        <span className="profile-label">Ngày sinh:</span>
                        {isEdit ? (
                            <input
                                className="profile-input"
                                name="dateOfBirth"
                                type="date"
                                value={form.dateOfBirth}
                                onChange={handleChange}
                            />
                        ) : (
                            <span className="profile-value">{patient.dateOfBirth}</span>
                        )}
                    </div>
                    <div className="profile-row">
                        <span className="profile-label">Địa chỉ:</span>
                        {isEdit ? (
                            <input
                                className="profile-input"
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                            />
                        ) : (
                            <span className="profile-value">{patient.address}</span>
                        )}
                    </div>
                </div>
                <div style={{ textAlign: 'right', marginTop: 16 }}>
                    {isEdit ? (
                        <>
                            <button className="profile-btn" onClick={handleSave}>Lưu</button>
                            <button className="profile-btn" onClick={() => setIsEdit(false)} style={{ marginLeft: 8 }}>Hủy</button>
                        </>
                    ) : (
                        <button className="profile-btn" onClick={() => setIsEdit(true)}>Chỉnh sửa</button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProfilePatient;