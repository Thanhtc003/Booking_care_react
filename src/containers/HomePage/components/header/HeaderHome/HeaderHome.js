import './HeaderHome.scss'
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { LANGUAGES } from '../../../../../utils';
import { changeLanguagesApp, processLogout } from '../../../../../store/actions'
import Navigation from '../../Navigation/Navigation';
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

function HeaderHome({ language, changeLanguagesAppRedux, isShadow, isLoggedIn, userInfo, processLogoutRedux }) {

    const [isOpenNav, setIsOpenNav] = useState(false);
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
    const languageRef = useRef();

    const handleClickChangeLanguage = (language) => {
        changeLanguagesAppRedux(language)
        setShowLanguageDropdown(false);
    }

    const handleLogout = () => {
        processLogoutRedux();
    }

    // Đóng dropdown khi click ra ngoài
    useEffect(() => {
        function handleClickOutside(event) {
            if (languageRef.current && !languageRef.current.contains(event.target)) {
                setShowLanguageDropdown(false);
            }
        }
        if (showLanguageDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showLanguageDropdown]);

    return (
        <div className="header-homepage-container">
            <div className={isShadow ? "header-homepage-inner header__box__shadow" : "header-homepage-inner"}>
                <div className='header__navigation__logo' onClick={() => setIsOpenNav(true)}>
                    <svg className='header-bars-icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                        <path d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z" />
                    </svg>
                </div>
                <Navigation isOpenNav={isOpenNav} setIsOpenNav={setIsOpenNav} />
                <div className='wrapper-logo'>
                    <div className='header-logo'>
                        <Link to='/'>
                            <img src='https://bookingcare.vn/assets/icon/bookingcare-2020.svg' alt='booking-icon' />
                        </Link>
                    </div>
                </div>
                <div className='header-desc'>
                    <Link to='/specialty' className='header-desc-item'>
                        <h5><FormattedMessage id="header-home.specialty" /></h5>
                        <p><FormattedMessage id="header-home.search-doctor" /></p>
                    </Link>
                    <Link className='header-desc-item'>
                        <h5><FormattedMessage id="header-home.health-center" /></h5>
                        <p><FormattedMessage id="header-home.choose-room" /></p>
                    </Link>
                    <Link to='/doctor' className='header-desc-item'>
                        <h5><FormattedMessage id="header-home.doctor" /></h5>
                        <p><FormattedMessage id="header-home.choose-doctor" /></p>
                    </Link>
                    <Link className='header-desc-item'>
                        <h5><FormattedMessage id="header-home.checkup-package" /></h5>
                        <p><FormattedMessage id="header-home.general-health" /></p>
                    </Link>
                </div>
                <div className='header-help-language'>
                    <Link to='/help' className='header-help'>
                        <svg className='header-help-icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM169.8 165.3c7.9-22.3 29.1-37.3 52.8-37.3h58.3c34.9 0 63.1 28.3 63.1 63.1c0 22.6-12.1 43.5-31.7 54.8L280 264.4c-.2 13-10.9 23.6-24 23.6c-13.3 0-24-10.7-24-24V250.5c0-8.6 4.6-16.5 12.1-20.8l44.3-25.4c4.7-2.7 7.6-7.7 7.6-13.1c0-8.4-6.8-15.1-15.1-15.1H222.6c-3.4 0-6.4 2.1-7.5 5.3l-.4 1.2c-4.4 12.5-18.2 19-30.6 14.6s-19-18.2-14.6-30.6l.4-1.2zM288 352c0 17.7-14.3 32-32 32s-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32z" />
                        </svg>
                    </Link>
                    {isLoggedIn ? (
                        <div className='header-logout' onClick={handleLogout}>
                            <svg className='header-logout-icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path d="M160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96C43 32 0 75 0 128V384c0 53 43 96 96 96h64c17.7 0 32-14.3 32-32s-14.3-32-32-32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h64zM504.5 273.4c4.8-4.5 7.5-10.8 7.5-17.4s-2.7-12.9-7.5-17.4l-144-136c-7-6.6-17.2-8.4-26-4.6s-14.5 12.5-14.5 22l0 88H192c-17.7 0-32 14.3-32 32l0 32c0 17.7 14.3 32 32 32H320l0 88c0 9.6 5.7 18.2 14.5 22s19 2.2 26-4.6l144-136z" />
                            </svg>
                        </div>
                    ) : (
                        <>
                            <Link to='/login' className='header-login'>
                                <svg className='header-login-icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                    <path d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zM291.7 414.3c-28.2-6.8-49.7-25-56.1-48.6L224 288h64l-11.7 77.7c-6.4 23.6-27.9 41.8-56.1 48.6C107.1 442.8 0 350.2 0 240c0-110.3 89.7-200 200-200s200 89.7 200 200c0 110.2-107.1 202.8-108.3 174.3zM192 120c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24-10.7-24-24-24zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24 24-10.7 24-24-10.7-24-24-24z" />
                                </svg>
                            </Link>
                            <Link to='/register' className='header-register'>
                                <svg className='header-register-icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                                    <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3zM488 224h-64v-64c0-13.3-10.7-24-24-24s-24 10.7-24 24v64h-64c-13.3 0-24 10.7-24 24s10.7 24 24 24h64v64c0 13.3 10.7 24 24 24s24-10.7 24-24v-64h64c13.3 0 24-10.7 24-24s-10.7-24-24-24z" />
                                </svg>
                            </Link>
                        </>
                    )}
                    <div className='header-language' ref={languageRef} tabIndex={0} onClick={() => setShowLanguageDropdown(v => !v)}>
                        <svg className='header-language-icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
                            <path d="M0 128C0 92.7 28.7 64 64 64H256h48 16H576c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H320 304 256 64c-35.3 0-64-28.7-64-64V128zm320 0V384H576V128H320zM178.3 175.9c-3.2-7.2-10.4-11.9-18.3-11.9s-15.1 4.7-18.3 11.9l-64 144c-4.5 10.1 .1 21.9 10.2 26.4s21.9-.1 26.4-10.2l8.9-20.1h73.6l8.9 20.1c4.5 10.1 16.3 14.6 26.4 10.2s14.6-16.3 10.2-26.4l-64-144zM160 233.2L179 276H141l19-42.8zM448 164c11 0 20 9 20 20v4h44 16c11 0 20 9 20 20s-9 20-20 20h-2l-1.6 4.5c-8.9 24.4-22.4 46.6-39.6 65.4c.9 .6 1.8 1.1 2.7 1.6l18.9 11.3c9.5 5.7 12.5 18 6.9 27.4s-18 12.5-27.4 6.9l-18.9-11.3c-4.5-2.7-8.8-5.5-13.1-8.5c-10.6 7.5-21.9 14-34 19.4l-3.6 1.6c-10.1 4.5-21.9-.1-26.4-10.2s.1-21.9 10.2-26.4l3.6-1.6c6.4-2.9 12.6-6.1 18.5-9.8l-12.2-12.2c-7.8-7.8-7.8-20.5 0-28.3s20.5-7.8 28.3 0l14.6 14.6 .5 .5c12.4-13.1 22.5-28.3 29.8-45H448 376c-11 0-20-9-20-20s9-20 20-20h52v-4c0-11 9-20 20-20z" />
                        </svg>
                        {showLanguageDropdown && (
                            <div className='dropdown-language'>
                                <ul className='header-language-list'>
                                    <li className={language === LANGUAGES.VI ? 'header-language-item active' : 'header-language-item'} onClick={() => handleClickChangeLanguage(LANGUAGES.VI)}>Việt Nam</li>
                                    <li className={language === LANGUAGES.EN ? 'header-language-item active' : 'header-language-item'} onClick={() => handleClickChangeLanguage(LANGUAGES.EN)}>English</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        changeLanguagesAppRedux: (language) => dispatch(changeLanguagesApp(language)),
        processLogoutRedux: () => dispatch(processLogout())
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(HeaderHome);