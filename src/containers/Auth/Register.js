import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import './Register.scss';
import { registerPatient, registerDoctor } from '../../services/authService';
import { getAllCode } from '../../services/userService';
import { getAllSpecialties } from '../../services/specialty.service';

function Register(props) {
    const [userType, setUserType] = useState('patient');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        gender: '',
        address: '',
        dateOfBirth: '',
        // Doctor specific fields
        positionId: '',
        specialtyId: '',
        description: '',
        image: null
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [positions, setPositions] = useState([]);
    const [specialties, setSpecialties] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                // Load positions
                const positionsResult = await getAllCode('POSITION');
                if (positionsResult && positionsResult.errorCode === 0) {
                    setPositions(positionsResult.data);
                }
                
                // Load specialties
                const specialtiesResult = await getAllSpecialties();
                if (specialtiesResult && specialtiesResult.code === 0) {
                    setSpecialties(specialtiesResult.data);
                }
            } catch (error) {
                console.error('Error loading positions or specialties:', error);
            }
        };
        loadData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image' && files) {
            setFormData(prev => ({
                ...prev,
                [name]: files[0]
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleImageUpload = async (file) => {
        if (!file) return null;
        
        // Check file size (max 2MB)
        const maxSize = 2 * 1024 * 1024; // 2MB
        if (file.size > maxSize) {
            throw new Error('File ảnh quá lớn! Vui lòng chọn file nhỏ hơn 2MB.');
        }
        
        // Check file type
        if (!file.type.startsWith('image/')) {
            throw new Error('Vui lòng chọn file ảnh hợp lệ!');
        }
        
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64String = reader.result.split(',')[1];
                resolve(base64String);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const validateForm = () => {
        // Common validations
        if (!formData.email || !formData.password || !formData.confirmPassword) {
            setErrorMessage('Vui lòng điền đầy đủ thông tin bắt buộc!');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setErrorMessage('Mật khẩu xác nhận không khớp!');
            return false;
        }

        if (formData.password.length < 6) {
            setErrorMessage('Mật khẩu phải có ít nhất 6 ký tự!');
            return false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setErrorMessage('Email không hợp lệ!');
            return false;
        }

        // Patient specific validations
        if (userType === 'patient') {
            if (!formData.firstName || !formData.lastName || !formData.phoneNumber || !formData.gender || !formData.dateOfBirth) {
                setErrorMessage('Vui lòng điền đầy đủ thông tin bệnh nhân!');
                return false;
            }
        }

        // Doctor specific validations
        if (userType === 'doctor') {
            if (!formData.firstName || !formData.lastName || !formData.phoneNumber || !formData.gender) {
                setErrorMessage('Vui lòng điền đầy đủ thông tin cơ bản!');
                return false;
            }
            
            if (!formData.positionId) {
                setErrorMessage('Vui lòng chọn chức vụ!');
                return false;
            }
            
            if (!formData.specialtyId) {
                setErrorMessage('Vui lòng chọn chuyên khoa!');
                return false;
            }
            
            // Check image file size
            if (formData.image) {
                const maxSize = 2 * 1024 * 1024; // 2MB
                if (formData.image.size > maxSize) {
                    setErrorMessage('File ảnh quá lớn! Vui lòng chọn file nhỏ hơn 2MB.');
                    return false;
                }
            }
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        console.log('Form data:', formData);
        console.log('User type:', userType);

        if (!validateForm()) {
            console.log('Validation failed');
            return;
        }

        setIsLoading(true);

        try {
            let result;
            if (userType === 'patient') {
                const patientData = {
                    email: formData.email,
                    password: formData.password,
                    name: `${formData.firstName} ${formData.lastName}`,
                    gender: formData.gender,
                    phoneNumber: formData.phoneNumber,
                    dateOfBirth: formData.dateOfBirth,
                    address: formData.address
                };
                console.log('Sending patient data:', patientData);
                result = await registerPatient(patientData);
            } else {
                // Handle image upload for doctor
                let imageBase64 = null;
                if (formData.image) {
                    try {
                        imageBase64 = await handleImageUpload(formData.image);
                    } catch (error) {
                        console.error('Error processing image:', error);
                        setErrorMessage('Có lỗi khi xử lý ảnh!');
                        setIsLoading(false);
                        return;
                    }
                }

                const doctorData = {
                    email: formData.email,
                    password: formData.password,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    gender: formData.gender,
                    phoneNumber: formData.phoneNumber,
                    address: formData.address,
                    positionId: formData.positionId,
                    specialtyId: formData.specialtyId,
                    description: formData.description,
                    image: imageBase64
                };
                console.log('Sending doctor data:', doctorData);
                result = await registerDoctor(doctorData);
            }

            console.log('API response:', result);

            if (result && result.errorCode === 0) {
                setSuccessMessage(result.message);
                // Clear form
                setFormData({
                    email: '',
                    password: '',
                    confirmPassword: '',
                    firstName: '',
                    lastName: '',
                    phoneNumber: '',
                    gender: '',
                    address: '',
                    dateOfBirth: '',
                    positionId: '',
                    specialtyId: '',
                    description: '',
                    image: null
                });
                
                // Redirect to login after 2 seconds
                setTimeout(() => {
                    props.navigate('/login');
                }, 2000);
            } else {
                setErrorMessage(result.message || 'Có lỗi xảy ra khi đăng ký!');
            }
        } catch (error) {
            console.error('Registration error:', error);
            if (error.response) {
                console.error('Error response:', error.response.data);
                setErrorMessage(error.response.data.message || 'Có lỗi xảy ra khi đăng ký!');
            } else if (error.request) {
                console.error('Error request:', error.request);
                setErrorMessage('Không thể kết nối đến server!');
            } else {
                setErrorMessage('Có lỗi xảy ra khi đăng ký!');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='wrapper-register'>
            <div className='container-register'>
                <div className='row content-register'>
                    <h2 className='col-12 text-center fw-bold'>Đăng Ký Tài Khoản</h2>
                    
                    {/* User Type Selection */}
                    <div className='col-12 form-group mt-3'>
                        <label className='label-register'>Loại tài khoản</label>
                        <div className='user-type-selection'>
                            <label className={`user-type-option ${userType === 'patient' ? 'active' : ''}`}>
                                <input
                                    type='radio'
                                    name='userType'
                                    value='patient'
                                    checked={userType === 'patient'}
                                    onChange={(e) => setUserType(e.target.value)}
                                />
                                <span>Bệnh nhân</span>
                            </label>
                            <label className={`user-type-option ${userType === 'doctor' ? 'active' : ''}`}>
                                <input
                                    type='radio'
                                    name='userType'
                                    value='doctor'
                                    checked={userType === 'doctor'}
                                    onChange={(e) => setUserType(e.target.value)}
                                />
                                <span>Bác sĩ</span>
                            </label>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Common Fields */}
                        <div className='col-12 form-group mt-3'>
                            <label className='label-register'>Email *</label>
                            <input
                                type='email'
                                className='form-control'
                                placeholder='Nhập email của bạn'
                                name='email'
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className='col-12 form-group mt-3'>
                            <label className='label-register'>Mật khẩu *</label>
                            <input
                                type='password'
                                className='form-control'
                                placeholder='Nhập mật khẩu'
                                name='password'
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className='col-12 form-group mt-3'>
                            <label className='label-register'>Xác nhận mật khẩu *</label>
                            <input
                                type='password'
                                className='form-control'
                                placeholder='Nhập lại mật khẩu'
                                name='confirmPassword'
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className='row'>
                            <div className='col-md-6 form-group mt-3'>
                                <label className='label-register'>Họ *</label>
                                <input
                                    type='text'
                                    className='form-control'
                                    placeholder='Nhập họ'
                                    name='firstName'
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className='col-md-6 form-group mt-3'>
                                <label className='label-register'>Tên *</label>
                                <input
                                    type='text'
                                    className='form-control'
                                    placeholder='Nhập tên'
                                    name='lastName'
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className='row'>
                            <div className='col-md-6 form-group mt-3'>
                                <label className='label-register'>Số điện thoại *</label>
                                <input
                                    type='text'
                                    className='form-control'
                                    placeholder='Nhập số điện thoại'
                                    name='phoneNumber'
                                    value={formData.phoneNumber}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className='col-md-6 form-group mt-3'>
                                <label className='label-register'>Giới tính *</label>
                                <select
                                    className='form-control'
                                    name='gender'
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value=''>Chọn giới tính</option>
                                    <option value='M'>Nam</option>
                                    <option value='F'>Nữ</option>
                                    <option value='O'>Khác</option>
                                </select>
                            </div>
                        </div>

                        <div className='col-12 form-group mt-3'>
                            <label className='label-register'>Địa chỉ</label>
                            <input
                                type='text'
                                className='form-control'
                                placeholder='Nhập địa chỉ'
                                name='address'
                                value={formData.address}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Patient Specific Fields */}
                        {userType === 'patient' && (
                            <div className='col-12 form-group mt-3'>
                                <label className='label-register'>Ngày sinh *</label>
                                <input
                                    type='date'
                                    className='form-control'
                                    name='dateOfBirth'
                                    value={formData.dateOfBirth}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        )}

                        {/* Doctor Specific Fields */}
                        {userType === 'doctor' && (
                            <>
                                <div className='row'>
                                    <div className='col-md-6 form-group mt-3'>
                                        <label className='label-register'>Chức vụ *</label>
                                        <select
                                            className='form-control'
                                            name='positionId'
                                            value={formData.positionId}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value=''>Chọn chức vụ</option>
                                            {positions.map((position) => (
                                                <option key={position.keyMap} value={position.keyMap}>
                                                    {position.valueVi}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className='col-md-6 form-group mt-3'>
                                        <label className='label-register'>Chuyên khoa *</label>
                                        <select
                                            className='form-control'
                                            name='specialtyId'
                                            value={formData.specialtyId}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value=''>Chọn chuyên khoa</option>
                                            {specialties.map((specialty) => (
                                                <option key={specialty.id} value={specialty.id}>
                                                    {specialty.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className='col-12 form-group mt-3'>
                                    <label className='label-register'>Mô tả bản thân</label>
                                    <textarea
                                        className='form-control'
                                        rows='4'
                                        placeholder='Mô tả về kinh nghiệm và chuyên môn của bạn'
                                        name='description'
                                        value={formData.description}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className='col-12 form-group mt-3'>
                                    <label className='label-register'>Ảnh đại diện</label>
                                    <input
                                        type='file'
                                        className='form-control'
                                        name='image'
                                        accept='image/*'
                                        onChange={handleInputChange}
                                    />
                                    <small className='form-text text-muted'>
                                        Chỉ chấp nhận file ảnh, kích thước tối đa 2MB
                                    </small>
                                </div>
                            </>
                        )}

                        {/* Messages */}
                        {errorMessage && (
                            <div className='col-12' style={{ color: 'red', fontSize: 14, marginTop: 16 }}>
                                {errorMessage}
                            </div>
                        )}
                        {successMessage && (
                            <div className='col-12' style={{ color: 'green', fontSize: 14, marginTop: 16 }}>
                                {successMessage}
                            </div>
                        )}

                        <div className='col-12'>
                            <button 
                                className='btn-register' 
                                type='submit'
                                disabled={isLoading}
                            >
                                {isLoading ? 'Đang đăng ký...' : 'Đăng ký'}
                            </button>
                        </div>

                        <div className='col-12 register-login-link'>
                            <p>Đã có tài khoản? <a href='/login'>Đăng nhập ngay</a></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

const mapDispatchToProps = dispatch => {
    return {
        navigate: (path) => dispatch(push(path)),
    };
};

export default connect(null, mapDispatchToProps)(Register); 