import { useEffect, useState } from 'react';
import './HeaderDetailPage.scss'
import { useHistory } from "react-router-dom";
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import { connect } from 'react-redux';
import { processLogout } from '../../../../../store/actions';

function HeaderDetailPage({ textDetail, isLoggedIn, processLogoutRedux }) {
    const [isShowText, setIsShowText] = useState(false);
    const history = useHistory();

    const handleBackHomePage = () => {
        history.push('/');
    }

    const handleLogout = () => {
        processLogoutRedux();
    }

    useEffect(() => {
        const handleScroll = function () {
            if (this.window.scrollY > 150) {
                setIsShowText(true);
            } else {
                setIsShowText(false);
            }
        }

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);

    }, []);

    return (
        <div className="header-detail-page-container">
            <div className='header-detail-page-content'>
                <div className='header-detail-back'>
                    <svg className='header-detail-back-icon' onClick={handleBackHomePage} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path d="M177.5 98c-8.8-3.8-19-2-26 4.6l-144 136C2.7 243.1 0 249.4 0 256s2.7 12.9 7.5 17.4l144 136c7 6.6 17.2 8.4 26 4.6s14.5-12.5 14.5-22l0-88 288 0c17.7 0 32-14.3 32-32l0-32c0-17.7-14.3-32-32-32l-288 0 0-88c0-9.6-5.7-18.2-14.5-22z" />
                    </svg>
                    {isShowText && <p className='header-detail-page-context' >{textDetail}</p>}
                </div>
                <div className='header-detail-nav-help'>
                    <Link to='/appointment' className='header-detail-appointment'>
                        <svg className='header-detail-appointment-icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M75 75L41 41C25.9 25.9 0 36.6 0 57.9V168c0 13.3 10.7 24 24 24H134.1c21.4 0 32.1-25.9 17-41l-30.8-30.8C155 85.5 203 64 256 64c106 0 192 86 192 192s-86 192-192 192c-40.8 0-78.6-12.7-109.7-34.4c-14.5-10.1-34.4-6.6-44.6 7.9s-6.6 34.4 7.9 44.6C151.2 495 201.7 512 256 512c141.4 0 256-114.6 256-256S397.4 0 256 0C185.3 0 121.3 28.7 75 75zm181 53c-13.3 0-24 10.7-24 24V256c0 6.4 2.5 12.5 7 17l72 72c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-65-65V152c0-13.3-10.7-24-24-24z" />
                        </svg>
                        <p className='header-detail-help-text'>Lịch hẹn</p>
                    </Link>
                    <Link to='/help' className='header-detail-help'>
                        <svg className='header-detail-help-icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                            <path d="M96 96c-17.7 0-32 14.3-32 32s-14.3 32-32 32s-32-14.3-32-32C0 75 43 32 96 32h97c70.1 0 127 56.9 127 127c0 52.4-32.2 99.4-81 118.4l-63 24.5 0 18.1c0 17.7-14.3 32-32 32s-32-14.3-32-32V301.9c0-26.4 16.2-50.1 40.8-59.6l63-24.5C240 208.3 256 185 256 159c0-34.8-28.2-63-63-63H96zm48 384c-22.1 0-40-17.9-40-40s17.9-40 40-40s40 17.9 40 40s-17.9 40-40 40z" />
                        </svg>
                        <p className='header-detail-help-text'>Hỗ trợ</p>
                    </Link>
                    {isLoggedIn ? (
                        <div className='header-detail-logout' onClick={handleLogout}>
                            <svg className='header-detail-logout-icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path d="M160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96C43 32 0 75 0 128V384c0 53 43 96 96 96h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h64zM504.5 273.4c4.8-4.5 7.5-10.8 7.5-17.4s-2.7-12.9-7.5-17.4l-144-136c-7-6.6-17.2-8.4-26-4.6s-14.5 12.5-14.5 22l0 88H192c-17.7 0-32 14.3-32 32l0 32c0 17.7 14.3 32 32 32H320l0 88c0 9.6 5.7 18.2 14.5 22s19 2.2 26-4.6l144-136z" />
                            </svg>
                            <p className='header-detail-help-text'>Đăng xuất</p>
                        </div>
                    ) : (
                        <>
                            <Link to='/login' className='header-detail-login'>
                                <svg className='header-detail-login-icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                    <path d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zM291.7 414.3c-28.2-6.8-49.7-25-56.1-48.6L224 288h64l-11.7 77.7c-6.4 23.6-27.9 41.8-56.1 48.6C107.1 442.8 0 350.2 0 240c0-110.3 89.7-200 200-200s200 89.7 200 200c0 110.2-107.1 202.8-108.3 174.3zM192 120c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24-10.7-24-24-24zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24-10.7-24-24-24z" />
                                </svg>
                                <p className='header-detail-help-text'>Đăng nhập</p>
                            </Link>
                            <Link to='/register' className='header-detail-register'>
                                <svg className='header-detail-register-icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                                    <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3zM488 224h-64v-64c0-13.3-10.7-24-24-24s-24 10.7-24 24v64h-64c-13.3 0-24 10.7-24 24s10.7 24 24 24h64v64c0 13.3 10.7 24 24 24s24-10.7 24-24v-64h64c13.3 0 24-10.7 24-24s-10.7-24-24-24z" />
                                </svg>
                                <p className='header-detail-help-text'>Đăng ký</p>
                            </Link>
                        </>
                    )}

                </div>
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogoutRedux: () => dispatch(processLogout())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderDetailPage);