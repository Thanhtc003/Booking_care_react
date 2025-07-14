import { useEffect, useState } from 'react';
import './DoctorAppointment.scss';
import { confirmAppointment, getAppointmentsByDate } from '../../../services/doctorService';
import { dateFormat } from '../../../utils';
import { useSelector } from 'react-redux';

export default function DoctorAppointment() {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [appoints, setAppoints] = useState([]);
    const [hideState, setHideState] = useState(0);

    const user = useSelector(state => state.user.userInfo);

    useEffect(() => {
        let spread = date.split('-');
        const dateFormat = `${spread[0]}-${spread[1]}-${spread[2]}`
        const fetchListAppoint = async () => {
            const res = await getAppointmentsByDate(user?.id, dateFormat);
            if (res?.code === 0) {
                setAppoints(res.data)
            }
        }

        fetchListAppoint();
    }, [date, hideState]);

    const handleChangeDate = (e) => {
        setDate(e.target.value);
    }

    const handleClickConfirm = (bookingId) => {
        confirmAppointment({ doctorId: user.id, bookingId }).then().catch();
        setHideState(Math.random())
    }

    return (
        <div className="doctor__app__wrapper">
            <h4 className="doctor__app__title">Quản lý lịch hẹn khám bệnh</h4>
            
            <div className="date-selector">
                <div className='row'>
                    <div className='col-lg-6'>
                        <label htmlFor='date'>📅 Chọn ngày khám</label>
                        <input 
                            type='date' 
                            id='date' 
                            className='form-control' 
                            value={date} 
                            onChange={handleChangeDate} 
                        />
                    </div>
                </div>
            </div>

            <div className="appointments-container">
                {appoints.length > 0 ? (
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">⏰ Thời gian</th>
                                <th scope="col">👤 Họ và tên</th>
                                <th scope="col">🚻 Giới tính</th>
                                <th scope="col">📍 Địa chỉ</th>
                                <th scope="col">⚡ Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appoints?.map((appoint, idx) =>
                                <tr key={idx}>
                                    <th scope="row">{idx + 1}</th>
                                    <td>
                                        <span className="time-slot">
                                            {appoint.timeTypeData.valueVi}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="patient-name">
                                            {appoint.Patient.name}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`patient-gender ${appoint.Patient.genderDataPatient.valueVi === 'Nam' ? 'male' : 'female'}`}>
                                            {appoint.Patient.genderDataPatient.valueVi}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="patient-address" title={appoint.Patient.address}>
                                            {appoint.Patient.address}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            {appoint.statusId === 'S2'
                                                ? <button 
                                                    className='btn btn-success' 
                                                    onClick={() => handleClickConfirm(appoint.id)}
                                                >
                                                    ✅ Xác nhận
                                                </button>
                                                : <button 
                                                    className='btn btn-success' 
                                                    disabled
                                                >
                                                    ✅ Đã xác nhận
                                                </button>
                                            }
                                            <button className='btn btn-info'>
                                                📄 Gửi hóa đơn
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                ) : (
                    <div className="no-appointments">
                        Chưa có lịch hẹn nào vào ngày này.
                        <br />
                        <small>Vui lòng chọn ngày khác hoặc kiểm tra lại lịch làm việc.</small>
                    </div>
                )}
            </div>
        </div>
    )
}