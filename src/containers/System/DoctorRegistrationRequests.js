import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { getPendingDoctorRequests, approveDoctorRequest, rejectDoctorRequest } from '../../services/authService';
import './DoctorRegistrationRequests.scss';

function DoctorRegistrationRequests(props) {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [adminNote, setAdminNote] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(''); // 'approve' or 'reject'

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const response = await getPendingDoctorRequests();
            if (response && response.data) {
                setRequests(response.data);
            }
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = (request) => {
        setSelectedRequest(request);
        setModalType('approve');
        setShowModal(true);
    };

    const handleReject = (request) => {
        setSelectedRequest(request);
        setModalType('reject');
        setShowModal(true);
    };

    const handleConfirmAction = async () => {
        if (!selectedRequest) return;

        console.log('=== FRONTEND: START ACTION ===');
        console.log('Modal type:', modalType);
        console.log('Selected request:', selectedRequest);
        console.log('Admin note:', adminNote);

        try {
            console.log('Frontend: Starting action:', modalType, selectedRequest.id);
            
            let result;
            if (modalType === 'approve') {
                console.log('Frontend: Calling approveDoctorRequest...');
                // Add timeout to prevent hanging
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Request timeout')), 10000)
                );
                
                const approvePromise = approveDoctorRequest(selectedRequest.id, adminNote);
                console.log('Frontend: Approve promise created');
                result = await Promise.race([approvePromise, timeoutPromise]);
                console.log('Frontend: Approve promise resolved');
            } else {
                console.log('Frontend: Calling rejectDoctorRequest...');
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Request timeout')), 10000)
                );
                
                const rejectPromise = rejectDoctorRequest(selectedRequest.id, adminNote);
                console.log('Frontend: Reject promise created');
                result = await Promise.race([rejectPromise, timeoutPromise]);
                console.log('Frontend: Reject promise resolved');
            }

            console.log('Frontend: Action result:', result);

            if (result && result.errorCode === 0) {
                alert(result.message);
                setShowModal(false);
                setAdminNote('');
                fetchRequests(); // Refresh the list
            } else {
                alert(result.message || 'Có lỗi xảy ra!');
            }
        } catch (error) {
            console.error('Frontend: Error processing request:', error);
            if (error.message === 'Request timeout') {
                alert('Yêu cầu bị timeout! Vui lòng thử lại.');
            } else {
                alert('Có lỗi xảy ra khi xử lý yêu cầu!');
            }
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    if (loading) {
        return <div className="loading">Đang tải...</div>;
    }

    return (
        <div className="doctor-registration-requests">
            <div className="header">
                <h2>Quản Lý Yêu Cầu Đăng Ký Bác Sĩ</h2>
                <p>Tổng số yêu cầu đang chờ: {requests.length}</p>
            </div>

            {requests.length === 0 ? (
                <div className="no-requests">
                    <p>Không có yêu cầu đăng ký nào đang chờ xử lý.</p>
                </div>
            ) : (
                <div className="requests-list">
                    {requests.map((request) => (
                        <div key={request.id} className="request-card">
                            <div className="request-header">
                                <h3>{request.firstName} {request.lastName}</h3>
                                <span className="date">Ngày đăng ký: {formatDate(request.createdAt)}</span>
                            </div>
                            
                            <div className="request-info">
                                <div className="info-row">
                                    <span className="label">Email:</span>
                                    <span className="value">{request.email}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Số điện thoại:</span>
                                    <span className="value">{request.phoneNumber}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Địa chỉ:</span>
                                    <span className="value">{request.address}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Chức vụ:</span>
                                    <span className="value">{request.positionId}</span>
                                </div>
                                <div className="info-row">
                                    <span className="label">Chuyên khoa:</span>
                                    <span className="value">{request.specialtyId}</span>
                                </div>
                                {request.description && (
                                    <div className="info-row">
                                        <span className="label">Mô tả:</span>
                                        <span className="value">{request.description}</span>
                                    </div>
                                )}
                            </div>

                            <div className="request-actions">
                                <button 
                                    className="btn-approve"
                                    onClick={() => handleApprove(request)}
                                >
                                    Phê duyệt
                                </button>
                                <button 
                                    className="btn-reject"
                                    onClick={() => handleReject(request)}
                                >
                                    Từ chối
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>
                                {modalType === 'approve' ? 'Phê duyệt yêu cầu' : 'Từ chối yêu cầu'}
                            </h3>
                            <button 
                                className="close-btn"
                                onClick={() => setShowModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        
                        <div className="modal-body">
                            <p>
                                {modalType === 'approve' 
                                    ? `Bạn có chắc chắn muốn phê duyệt yêu cầu đăng ký của ${selectedRequest?.firstName} ${selectedRequest?.lastName}?`
                                    : `Bạn có chắc chắn muốn từ chối yêu cầu đăng ký của ${selectedRequest?.firstName} ${selectedRequest?.lastName}?`
                                }
                            </p>
                            
                            <div className="form-group">
                                <label>Ghi chú (tùy chọn):</label>
                                <textarea
                                    value={adminNote}
                                    onChange={(e) => setAdminNote(e.target.value)}
                                    placeholder="Nhập ghi chú nếu cần..."
                                    rows="3"
                                />
                            </div>
                        </div>
                        
                        <div className="modal-footer">
                            <button 
                                className="btn-cancel"
                                onClick={() => setShowModal(false)}
                            >
                                Hủy
                            </button>
                            <button 
                                className={`btn-confirm ${modalType === 'approve' ? 'btn-approve' : 'btn-reject'}`}
                                onClick={handleConfirmAction}
                            >
                                {modalType === 'approve' ? 'Phê duyệt' : 'Từ chối'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

export default connect(mapStateToProps)(DoctorRegistrationRequests); 