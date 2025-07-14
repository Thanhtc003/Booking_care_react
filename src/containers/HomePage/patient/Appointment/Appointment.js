import React, { useState, useEffect } from 'react';
import FooterHome from '../../components/FooterHome';
import InfoContact from '../../components/Section/InfoContact';
import HeaderHome from '../../components/header/HeaderHome';
import { getPatientBookingHistory } from '../../../../services/patientService';
import './Appointment.scss';

function Appointment() {
    const [patientEmail, setPatientEmail] = useState('');
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searched, setSearched] = useState(false);

    const handleSearch = async () => {
        if (!patientEmail.trim()) {
            setError('Vui lòng nhập email để tra cứu');
            return;
        }

        setLoading(true);
        setError('');
        setSearched(true);

        try {
            const res = await getPatientBookingHistory(patientEmail);
            if (res && res.code === 0) {
                setBookings(res.data);
            } else if (res && res.code === -4) {
                setError('Không tìm thấy thông tin bệnh nhân với email này');
                setBookings([]);
            } else {
                setError('Có lỗi xảy ra khi tra cứu thông tin');
                setBookings([]);
            }
        } catch (error) {
            setError('Có lỗi xảy ra khi tra cứu thông tin');
            setBookings([]);
        } finally {
            setLoading(false);
        }
    };

    const getStatusText = (statusId) => {
        switch (statusId) {
            case 'S1': return 'Chờ xác nhận';
            case 'S2': return 'Đã xác nhận';
            case 'S3': return 'Đã hoàn thành';
            case 'S4': return 'Đã hủy';
            default: return 'Không xác định';
        }
    };

    const getStatusClass = (statusId) => {
        switch (statusId) {
            case 'S1': return 'status-pending';
            case 'S2': return 'status-confirmed';
            case 'S3': return 'status-completed';
            case 'S4': return 'status-cancelled';
            default: return 'status-unknown';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN');
    };

    return (
        <div className='appointment__wrapper'>
            <HeaderHome />
            
            <div className='appointment__content'>
                <h3 className='appointment__title'>Tra cứu lịch hẹn khám bệnh</h3>
                
                <div className='appointment__search'>
                    <div className='search__form'>
                        <input
                            type="email"
                            placeholder="Nhập email đã đăng ký khám bệnh"
                            value={patientEmail}
                            onChange={(e) => setPatientEmail(e.target.value)}
                            className='search__input'
                        />
                        <button 
                            onClick={handleSearch}
                            disabled={loading}
                            className='search__button'
                        >
                            {loading ? 'Đang tra cứu...' : 'Tra cứu'}
                        </button>
                    </div>
                    
                    {error && <p className='error__message'>{error}</p>}
                </div>

                {searched && !loading && (
                    <div className='appointment__results'>
                        {bookings.length > 0 ? (
                            <div className='booking__list'>
                                <h4>Lịch sử đặt khám của bạn:</h4>
                                
                                {/* Thông tin tổng quan patient */}
                                <div className='patient__overview'>
                                    <h5>Thông tin bệnh nhân:</h5>
                                    <div className='patient__info__grid'>
                                        <div className='info__item'>
                                            <span className='label'>Họ và tên:</span>
                                            <span className='value'>{bookings[0]?.patientInfo?.name}</span>
                                        </div>
                                        <div className='info__item'>
                                            <span className='label'>Giới tính:</span>
                                            <span className='value'>{bookings[0]?.patientInfo?.gender}</span>
                                        </div>
                                        <div className='info__item'>
                                            <span className='label'>Email:</span>
                                            <span className='value'>{bookings[0]?.patientInfo?.email}</span>
                                        </div>
                                        <div className='info__item'>
                                            <span className='label'>Số điện thoại:</span>
                                            <span className='value'>{bookings[0]?.patientInfo?.phoneNumber}</span>
                                        </div>
                                        <div className='info__item'>
                                            <span className='label'>Ngày sinh:</span>
                                            <span className='value'>{bookings[0]?.patientInfo?.dateOfBirth}</span>
                                        </div>
                                        <div className='info__item'>
                                            <span className='label'>Địa chỉ:</span>
                                            <span className='value'>{bookings[0]?.patientInfo?.address}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Danh sách booking */}
                                <div className='bookings__section'>
                                    <h5>Chi tiết các lần đặt khám:</h5>
                                    {bookings.map((booking, index) => (
                                        <div key={index} className='booking__item'>
                                            <div className='booking__header'>
                                                <div className='doctor__info'>
                                                    <img 
                                                        src={booking.User?.image || '/default-doctor.jpg'} 
                                                        alt="Doctor" 
                                                        className='doctor__image'
                                                    />
                                                    <div className='doctor__details'>
                                                        <h6>Bác sĩ: {booking.User?.lastName} {booking.User?.firstName}</h6>
                                                        <p>Ngày khám: {formatDate(booking.date)}</p>
                                                        <p>Giờ khám: {booking.timeTypeData?.valueVi}</p>
                                                        {booking.User?.phoneNumber && (
                                                            <p>Liên hệ BS: {booking.User.phoneNumber}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className={`booking__status ${getStatusClass(booking.statusId)}`}>
                                                    {getStatusText(booking.statusId)}
                                                </div>
                                            </div>
                                            
                                            <div className='booking__details'>
                                                <div className='details__grid'>
                                                    <div className='detail__section'>
                                                        <h6>Thông tin khám:</h6>
                                                        <p><strong>Lý do khám:</strong> {booking.reasonExamine}</p>
                                                        <p><strong>Đối tượng khám:</strong> {booking.objectExamine}</p>
                                                        <p><strong>Loại khám:</strong> {booking.priceDataBooking?.valueVi}</p>
                                                    </div>
                                                    
                                                    <div className='detail__section'>
                                                        <h6>Thông tin thanh toán:</h6>
                                                        <p><strong>Phương thức thanh toán:</strong> {booking.methodPaymentData?.valueVi}</p>
                                                        <p><strong>Mã booking:</strong> #{booking.id}</p>
                                                        <p><strong>Ngày đặt:</strong> {formatDateTime(booking.createdAt)}</p>
                                                    </div>
                                                </div>
                                                
                                                {booking.verifyToken && (
                                                    <div className='verification__info'>
                                                        <p><strong>Mã xác nhận:</strong> {booking.verifyToken}</p>
                                                        <small>Mã này được gửi qua email để xác nhận lịch hẹn</small>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p className='no__bookings'>Chưa có lịch hẹn nào được tìm thấy với email này.</p>
                        )}
                    </div>
                )}

                {!searched && (
                    <div className='appointment__info'>
                        <p className='appointment__schedule'>
                            Vui lòng nhập email đã đăng ký khám bệnh để tra cứu lịch sử đặt khám của bạn.
                        </p>
                    </div>
                )}
            </div>

            <InfoContact />
            <FooterHome />
        </div>
    )
}

export default Appointment;