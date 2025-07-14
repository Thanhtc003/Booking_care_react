import './Banner.scss'
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useState, useEffect, useRef } from 'react';
import { searchDoctors } from '../../../../../services/searchService';
import { getAllDoctors } from '../../../../../store/actions';

function Banner({ getAllDoctorsRedux, allDoctors }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const searchRef = useRef(null);
    const history = useHistory();

    // Load all doctors on component mount
    useEffect(() => {
        getAllDoctorsRedux();
    }, [getAllDoctorsRedux]);

    // Debug: Log doctors data
    useEffect(() => {
        console.log('All doctors loaded:', allDoctors);
        console.log('Number of doctors:', allDoctors.length);
        if (allDoctors.length > 0) {
            console.log('Sample doctor:', allDoctors[0]);
        }
    }, [allDoctors]);

    // Sample doctor data for testing if no real data
    const sampleDoctors = [
        {
            id: 1,
            firstName: 'Nguyễn',
            lastName: 'Văn A',
            image: 'https://via.placeholder.com/150x150',
            positionData: { valueVi: 'Bác sĩ chuyên khoa' },
            Markdown: { Specialty: { name: 'Tim mạch' } }
        },
        {
            id: 2,
            firstName: 'Trần',
            lastName: 'Thị B',
            image: 'https://via.placeholder.com/150x150',
            positionData: { valueVi: 'Bác sĩ chuyên khoa' },
            Markdown: { Specialty: { name: 'Da liễu' } }
        },
        {
            id: 3,
            firstName: 'Lê',
            lastName: 'Văn C',
            image: 'https://via.placeholder.com/150x150',
            positionData: { valueVi: 'Bác sĩ chuyên khoa' },
            Markdown: { Specialty: { name: 'Nội khoa' } }
        },
        {
            id: 4,
            firstName: 'Phạm',
            lastName: 'Thị D',
            image: 'https://via.placeholder.com/150x150',
            positionData: { valueVi: 'Bác sĩ chuyên khoa' },
            Markdown: { Specialty: { name: 'Nhi khoa' } }
        }
    ];

    // Use sample data if no real data available
    const doctorsToSearch = allDoctors.length > 0 ? allDoctors : sampleDoctors;

    // Handle click outside to close search results
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Search doctors when search term changes
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setSearchResults([]);
            setShowResults(false);
            return;
        }

        const performSearch = async () => {
            setIsLoading(true);
            try {
                // Try API search first
                const response = await searchDoctors(searchTerm);
                if (response.data && response.data.errorCode === 0 && response.data.data.length > 0) {
                    setSearchResults(response.data.data || []);
                    setShowResults(true);
                } else {
                    // Fallback to local search using Redux data
                    const localResults = doctorsToSearch.filter(doctor => {
                        const fullName = `${doctor.firstName} ${doctor.lastName}`.toLowerCase();
                        const position = doctor.positionData?.valueVi?.toLowerCase() || '';
                        const specialty = doctor.Markdown?.Specialty?.name?.toLowerCase() || '';
                        const searchLower = searchTerm.toLowerCase();
                        
                        return fullName.includes(searchLower) || 
                               position.includes(searchLower) || 
                               specialty.includes(searchLower);
                    });
                    
                    setSearchResults(localResults.slice(0, 10)); // Limit to 10 results
                    setShowResults(true);
                }
            } catch (error) {
                console.error('Search error:', error);
                // Fallback to local search when API fails
                const localResults = doctorsToSearch.filter(doctor => {
                    const fullName = `${doctor.firstName} ${doctor.lastName}`.toLowerCase();
                    const position = doctor.positionData?.valueVi?.toLowerCase() || '';
                    const specialty = doctor.Markdown?.Specialty?.name?.toLowerCase() || '';
                    const searchLower = searchTerm.toLowerCase();
                    
                    return fullName.includes(searchLower) || 
                           position.includes(searchLower) || 
                           specialty.includes(searchLower);
                });
                
                setSearchResults(localResults.slice(0, 10));
                setShowResults(true);
            } finally {
                setIsLoading(false);
            }
        };

        // Debounce search to avoid too many API calls
        const timeoutId = setTimeout(performSearch, 300);
        return () => clearTimeout(timeoutId);
    }, [searchTerm, doctorsToSearch]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleDoctorClick = (doctor) => {
        history.push(`/doctor/detail-doctor/${doctor.id}`);
        setShowResults(false);
        setSearchTerm('');
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim() && searchResults.length > 0) {
            handleDoctorClick(searchResults[0]);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setShowResults(false);
            setSearchTerm('');
        }
    };

    return (
        <div className='banner-container'>
            <div className='banner-home'>
                <div className='banner-home-title'>
                    <h1 className='title-base'><FormattedMessage id="banner.title-base" /></h1>
                    <h1 className='title-care'><FormattedMessage id="banner.title-care" /></h1>
                </div>
                <div className='banner-home-search' ref={searchRef}>
                    <svg className='banner-search-icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352c79.5 0 144-64.5 144-144s-64.5-144-144-144S64 128.5 64 208s64.5 144 144 144z" />
                    </svg>
                    <form onSubmit={handleSearchSubmit}>
                        <input 
                            type='text' 
                            className='banner-search-input' 
                            placeholder='Tìm kiếm bác sĩ...'
                            value={searchTerm}
                            onChange={handleSearchChange}
                            onFocus={() => setShowResults(true)}
                            onKeyDown={handleKeyDown}
                        />
                    </form>
                    
                    {/* Search Results Dropdown */}
                    {showResults && (
                        <div className='banner-search-results'>
                            {isLoading ? (
                                <div className='search-loading'>
                                    <div className='loading-spinner'></div>
                                    <p>Đang tìm kiếm...</p>
                                </div>
                            ) : searchResults.length > 0 ? (
                                <div className='search-results-list'>
                                    {allDoctors.length === 0 && (
                                        <div className='sample-data-notice'>
                                            <small>💡 Đang sử dụng dữ liệu mẫu để demo</small>
                                        </div>
                                    )}
                                    {searchResults.map((doctor, index) => (
                                        <div 
                                            key={index} 
                                            className='search-result-item'
                                            onClick={() => handleDoctorClick(doctor)}
                                        >
                                            <div className='result-avatar'>
                                                <img 
                                                    src={doctor.image || 'https://via.placeholder.com/40x40'} 
                                                    alt="doctor" 
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/40x40';
                                                    }}
                                                />
                                            </div>
                                            <div className='result-info'>
                                                <div className='result-name'>
                                                    {doctor.firstName} {doctor.lastName}
                                                </div>
                                                <div className='result-detail'>
                                                    {doctor.positionData?.valueVi} - {doctor.Markdown?.Specialty?.name || 'Chuyên khoa'}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : searchTerm.trim() !== '' ? (
                                <div className='no-results'>
                                    <p>Không tìm thấy bác sĩ nào</p>
                                    <small>Thử tìm kiếm với từ khóa khác</small>
                                </div>
                            ) : null}
                        </div>
                    )}
                </div>
                <div className='banner-contact-download'>
                    <img className='google-play-download-image' src='https://bookingcare.vn/assets/icon/google-play-badge.svg' alt='Google Play Download' />
                    <img className='app-store-download-image' src='https://bookingcare.vn/assets/icon/app-store-badge-black.svg' alt='Google Play Download' />
                </div>
            </div>
            <div className='banner-choosing-examination'>
                <ul className='choosing-examination-list'>

                    <li className='choosing-examination-item'>
                        <Link to='/specialty' className='choosing-examination-item-link'>
                            <div className='examination-image-specialty'></div>
                            <span className='examination-item-title'><FormattedMessage id="banner.specialist-examination" /></span>
                        </Link>
                    </li>
                    <li className='choosing-examination-item'>
                        <Link to='/specialty' className='choosing-examination-item-link'>
                            <div className='examination-image-remote'></div>
                            <span className='examination-item-title'><FormattedMessage id="banner.remote-examination" /></span>
                        </Link>
                    </li>
                    <li className='choosing-examination-item'>
                        <Link to='/specialty' className='choosing-examination-item-link'>
                            <div className='examination-image-overview'></div>
                            <span className='examination-item-title'><FormattedMessage id="banner.examination-overview" /></span>
                        </Link>
                    </li>
                    <li className='choosing-examination-item'>
                        <Link to='/specialty' className='choosing-examination-item-link'>
                            <div className='examination-image-test'></div>
                            <span className='examination-item-title'><FormattedMessage id="banner.medical-test" /></span>
                        </Link>
                    </li>
                    <li className='choosing-examination-item'>
                        <Link to='/specialty' className='choosing-examination-item-link'>
                            <div className='examination-image-morale'></div>
                            <span className='examination-item-title'><FormattedMessage id="banner.mental-health" /></span>
                        </Link>
                    </li>
                    <li className='choosing-examination-item'>
                        <Link to='/specialty' className='choosing-examination-item-link'>
                            <div className='examination-image-dentistry'></div>
                            <span className='examination-item-title'><FormattedMessage id="banner.dental-examination" /></span>
                        </Link>
                    </li>
                    <li className='choosing-examination-item'>
                        <Link to='/specialty' className='choosing-examination-item-link'>
                            <div className='examination-image-anatomy'></div>
                            <span className='examination-item-title'><FormattedMessage id="banner.surgery-package" /></span>
                        </Link>
                    </li>
                    <li className='choosing-examination-item'>
                        <Link to='/specialty' className='choosing-examination-item-link'>
                            <div className='examination-image-medical'></div>
                            <span className='examination-item-title'><FormattedMessage id="banner.medical-products" /></span>
                        </Link>
                    </li>
                    <li className='choosing-examination-item'>
                        <Link to='/health-enterprise' className='choosing-examination-item-link'>
                            <div className='examination-image-enterprise'></div>
                            <span className='examination-item-title'><FormattedMessage id="banner.enterprise-health" /></span>
                        </Link>
                    </li>


                </ul>
            </div>
        </div>
    );
}


const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        allDoctors: state.doctor.allDoctors || [],
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getAllDoctorsRedux: () => dispatch(getAllDoctors()),
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(Banner);