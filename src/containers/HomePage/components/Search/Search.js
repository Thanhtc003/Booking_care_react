import React, { useState, useEffect, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { fetchAllSpecialties } from '../../../../store/actions';
import { getAllDoctors } from '../../../../store/actions';
import { searchDoctors, searchSpecialties } from '../../../../services/searchService.js';
import './Search.scss';

function Search({ fetchAllSpecialtiesRedux, getAllDoctorsRedux, listSpecialty, listDoctors }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('doctor'); // doctor, specialty, clinic
    const [filteredResults, setFilteredResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const history = useHistory();
    const searchRef = useRef(null);

    useEffect(() => {
        setIsLoading(true);
        Promise.all([
            fetchAllSpecialtiesRedux(),
            getAllDoctorsRedux()
        ]).finally(() => {
            setIsLoading(false);
        });
    }, [fetchAllSpecialtiesRedux, getAllDoctorsRedux]);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredResults([]);
            setShowResults(false);
            return;
        }

        const performSearch = async () => {
            setIsLoading(true);
            try {
                let results = [];
                
                switch (searchType) {
                    case 'doctor':
                        const doctorResponse = await searchDoctors(searchTerm);
                        if (doctorResponse.data && doctorResponse.data.errorCode === 0) {
                            results = doctorResponse.data.data || [];
                        }
                        break;
                    case 'specialty':
                        const specialtyResponse = await searchSpecialties(searchTerm);
                        if (specialtyResponse.data && specialtyResponse.data.errorCode === 0) {
                            results = specialtyResponse.data.data || [];
                        }
                        break;
                    case 'clinic':
                        // Có thể thêm logic tìm kiếm phòng khám ở đây
                        break;
                    default:
                        break;
                }

                setFilteredResults(results);
                setShowResults(true);
            } catch (error) {
                console.error('Search error:', error);
                setFilteredResults([]);
                setShowResults(true);
            } finally {
                setIsLoading(false);
            }
        };

        // Debounce search to avoid too many API calls
        const timeoutId = setTimeout(performSearch, 300);
        return () => clearTimeout(timeoutId);
    }, [searchTerm, searchType]);

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

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchTypeChange = (type) => {
        setSearchType(type);
        setSearchTerm('');
        setShowResults(false);
    };

    const handleResultClick = (item) => {
        if (searchType === 'doctor') {
            history.push(`/doctor/detail-doctor/${item.id}`);
        } else if (searchType === 'specialty') {
            history.push(`/specialty/${item.id}`);
        }
        setShowResults(false);
        setSearchTerm('');
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim() && filteredResults.length > 0) {
            handleResultClick(filteredResults[0]);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setShowResults(false);
            setSearchTerm('');
        }
    };

    return (
        <div className="search-container">
            <div className="search-wrapper" ref={searchRef}>
                <div className="search-header">
                    <h2><FormattedMessage id="search.title" defaultMessage="Tìm kiếm" /></h2>
                    <p><FormattedMessage id="search.subtitle" defaultMessage="Tìm kiếm bác sĩ, chuyên khoa hoặc phòng khám" /></p>
                </div>
                
                <div className="search-type-selector">
                    <button 
                        className={`search-type-btn ${searchType === 'doctor' ? 'active' : ''}`}
                        onClick={() => handleSearchTypeChange('doctor')}
                    >
                        <FormattedMessage id="search.doctor" defaultMessage="Bác sĩ" />
                    </button>
                    <button 
                        className={`search-type-btn ${searchType === 'specialty' ? 'active' : ''}`}
                        onClick={() => handleSearchTypeChange('specialty')}
                    >
                        <FormattedMessage id="search.specialty" defaultMessage="Chuyên khoa" />
                    </button>
                    <button 
                        className={`search-type-btn ${searchType === 'clinic' ? 'active' : ''}`}
                        onClick={() => handleSearchTypeChange('clinic')}
                    >
                        <FormattedMessage id="search.clinic" defaultMessage="Phòng khám" />
                    </button>
                </div>

                <form className="search-form" onSubmit={handleSearchSubmit}>
                    <div className="search-input-wrapper">
                        <input
                            type="text"
                            className="search-input"
                            placeholder={
                                searchType === 'doctor' ? 'Tìm kiếm bác sĩ...' :
                                searchType === 'specialty' ? 'Tìm kiếm chuyên khoa...' :
                                'Tìm kiếm phòng khám...'
                            }
                            value={searchTerm}
                            onChange={handleSearchChange}
                            onFocus={() => setShowResults(true)}
                            onKeyDown={handleKeyDown}
                        />
                        <button type="submit" className="search-button">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20" height="20">
                                <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/>
                            </svg>
                        </button>
                    </div>

                    {showResults && (
                        <div className="search-results">
                            {isLoading ? (
                                <div className="search-loading">
                                    <div className="loading-spinner"></div>
                                    <p>Đang tìm kiếm...</p>
                                </div>
                            ) : filteredResults.length > 0 ? (
                                filteredResults.map((item, index) => (
                                    <div 
                                        key={index} 
                                        className="search-result-item"
                                        onClick={() => handleResultClick(item)}
                                    >
                                        {searchType === 'doctor' && (
                                            <>
                                                <div className="result-avatar">
                                                    <img 
                                                        src={item.image || 'https://via.placeholder.com/40x40'} 
                                                        alt="doctor" 
                                                        onError={(e) => {
                                                            e.target.src = 'https://via.placeholder.com/40x40';
                                                        }}
                                                    />
                                                </div>
                                                <div className="result-info">
                                                    <div className="result-name">
                                                        {item.firstName} {item.lastName}
                                                    </div>
                                                    <div className="result-detail">
                                                        {item.positionData?.valueVi} - {item.specialtyData?.valueVi}
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                        {searchType === 'specialty' && (
                                            <>
                                                <div className="result-avatar">
                                                    <img 
                                                        src={item.image || 'https://via.placeholder.com/40x40'} 
                                                        alt="specialty" 
                                                        onError={(e) => {
                                                            e.target.src = 'https://via.placeholder.com/40x40';
                                                        }}
                                                    />
                                                </div>
                                                <div className="result-info">
                                                    <div className="result-name">{item.name}</div>
                                                    <div className="result-detail">
                                                        {item.descriptionMarkdown ? 
                                                            item.descriptionMarkdown.substring(0, 100) + (item.descriptionMarkdown.length > 100 ? '...' : '') 
                                                            : 'Không có mô tả'
                                                        }
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))
                                        ) : searchTerm.trim() !== '' ? (
                <div className="search-no-results">
                    <p>Không tìm thấy kết quả cho "{searchTerm}"</p>
                    <small>Thử tìm kiếm với từ khóa khác hoặc chọn loại tìm kiếm khác</small>
                </div>
            ) : null}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    return {
        listSpecialty: state.specialty.allSpecialties,
        listDoctors: state.doctor.allDoctors,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllSpecialtiesRedux: () => dispatch(fetchAllSpecialties()),
        getAllDoctorsRedux: () => dispatch(getAllDoctors()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Search); 