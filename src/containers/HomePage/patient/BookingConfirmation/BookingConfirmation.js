import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import HeaderHome from '../../components/header/HeaderHome';
import FooterSecondary from '../../components/FooterSecondary/FooterSecondary';
import './BookingConfirmation.scss';

function BookingConfirmation() {
    const history = useHistory();
    const location = useLocation();
    const { doctorName, appointmentDate, appointmentTime, patientEmail } = location.state || {};

    const handleGoHome = () => {
        history.push('/');
    };

    return (
        <div className='booking-confirmation-container'>
            <HeaderHome />
            
            <div className='confirmation-content'>
                <div className='confirmation-card'>
                    <div className='success-icon'>
                        <i className="fas fa-check-circle"></i>
                    </div>
                    
                    <h1 className='confirmation-title'>Đặt lịch khám thành công!</h1>
                    
                    <div className='confirmation-details'>
                        {doctorName && (
                            <div className='detail-item'>
                                <span className='label'>Bác sĩ:</span>
                                <span className='value'>{doctorName}</span>
                            </div>
                        )}
                        
                        {appointmentDate && (
                            <div className='detail-item'>
                                <span className='label'>Ngày khám:</span>
                                <span className='value'>{appointmentDate}</span>
                            </div>
                        )}
                        
                        {appointmentTime && (
                            <div className='detail-item'>
                                <span className='label'>Giờ khám:</span>
                                <span className='value'>{appointmentTime}</span>
                            </div>
                        )}
                        
                        {patientEmail && (
                            <div className='detail-item'>
                                <span className='label'>Email:</span>
                                <span className='value'>{patientEmail}</span>
                            </div>
                        )}
                    </div>
                    
                    <div className='email-notice'>
                        <div className='email-icon'>
                            <i className="fas fa-envelope"></i>
                        </div>
                        <h3>Vui lòng kiểm tra email</h3>
                        <p>
                            Chúng tôi đã gửi email xác nhận đến địa chỉ email của bạn. 
                            Vui lòng kiểm tra hộp thư và nhấp vào liên kết xác nhận để hoàn tất việc đặt lịch khám.
                        </p>
                        <div className='email-tips'>
                            <h4>Lưu ý:</h4>
                            <ul>
                                <li>Email có thể mất vài phút để đến</li>
                                <li>Kiểm tra cả thư mục spam nếu không thấy email</li>
                                <li>Liên kết xác nhận có hiệu lực trong 24 giờ</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div className='action-buttons'>
                        <button 
                            className='home-button'
                            onClick={handleGoHome}
                        >
                            <i className="fas fa-home"></i>
                            Về trang chủ
                        </button>
                    </div>
                </div>
            </div>
            
            <FooterSecondary />
        </div>
    );
}

export default BookingConfirmation; 