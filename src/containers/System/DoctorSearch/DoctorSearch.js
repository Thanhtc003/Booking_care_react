import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getPatientsByDoctor } from '../../../services/doctorService';
import './DoctorSearch.scss';

function DoctorSearch() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        status: 'all'
    });
    const [savedFilters, setSavedFilters] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        hasNextPage: false,
        hasPrevPage: false
    });

    const user = useSelector(state => state.user.userInfo);

    // Status options based on database
    const statuses = [
        { value: 'all', label: 'Tất cả trạng thái' },
        { value: 'S1', label: 'Chờ xác nhận' },
        { value: 'S2', label: 'Đã xác nhận' },
        { value: 'S3', label: 'Đã hoàn thành' },
        { value: 'S4', label: 'Đã hủy' }
    ];

    useEffect(() => {
        if (user && user.id) {
            performSearch();
        }
    }, [searchTerm, filters, pagination.currentPage]);

    const performSearch = async () => {
        if (!user || !user.id) {
            console.log('User not found');
            return;
        }

        setLoading(true);
        
        try {
            const response = await getPatientsByDoctor({
                doctorId: user.id,
                searchQuery: searchTerm,
                statusFilter: filters.status,
                limit: 10,
                offset: (pagination.currentPage - 1) * 10
            });

            if (response && response.code === 0) {
                setSearchResults(response.data.patients);
                setPagination({
                    currentPage: response.data.currentPage,
                    totalPages: response.data.totalPages,
                    totalCount: response.data.totalCount,
                    hasNextPage: response.data.hasNextPage,
                    hasPrevPage: response.data.hasPrevPage
                });
            } else {
                console.error('Error fetching patients:', response?.message);
                setSearchResults([]);
            }
        } catch (error) {
            console.error('Error fetching patients:', error);
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    const saveCurrentFilter = () => {
        const filterName = prompt('Nhập tên cho bộ lọc này:');
        if (filterName) {
            const newFilter = {
                id: Date.now(),
                name: filterName,
                filters: { ...filters },
                searchTerm
            };
            setSavedFilters(prev => [...prev, newFilter]);
        }
    };

    const loadSavedFilter = (savedFilter) => {
        setFilters(savedFilter.filters);
        setSearchTerm(savedFilter.searchTerm);
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    const deleteSavedFilter = (filterId) => {
        setSavedFilters(prev => prev.filter(filter => filter.id !== filterId));
    };

    const clearAllFilters = () => {
        setSearchTerm('');
        setFilters({
            status: 'all'
        });
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    const exportResults = () => {
        const csvContent = [
            ['Tên', 'Email', 'Số điện thoại', 'Giới tính', 'Ngày sinh', 'Địa chỉ', 'Trạng thái', 'Ngày đặt lịch', 'Giờ khám', 'Lý do khám'],
            ...searchResults.map(patient => [
                patient.patientName,
                patient.patientEmail,
                patient.patientPhone,
                patient.patientGender,
                patient.patientDob,
                patient.patientAddress,
                patient.bookingStatus,
                new Date(patient.bookingDate).toLocaleDateString('vi-VN'),
                patient.bookingTime,
                patient.bookingReason
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `danh_sach_benh_nhan_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const getStatusColor = (statusId) => {
        switch (statusId) {
            case 'S1': return '#ffc107';
            case 'S2': return '#28a745';
            case 'S3': return '#17a2b8';
            case 'S4': return '#dc3545';
            default: return '#6c757d';
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

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, currentPage: newPage }));
    };

    return (
        <div className="doctor-search">
            <div className="search-header">
                <h2 className="search-title">
                    <i className="fas fa-search"></i>
                    Tìm kiếm và quản lý bệnh nhân
                </h2>
                <p className="search-subtitle">
                    Tìm kiếm bệnh nhân theo nhiều tiêu chí khác nhau
                </p>
            </div>

            {/* Search Bar */}
            <div className="search-bar-container">
                <div className="search-input-group">
                    <i className="fas fa-search search-icon"></i>
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <button 
                        className="advanced-toggle"
                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    >
                        <i className={`fas fa-${showAdvancedFilters ? 'chevron-up' : 'chevron-down'}`}></i>
                        Bộ lọc nâng cao
                    </button>
                </div>
            </div>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
                <div className="advanced-filters">
                    <div className="filters-grid">
                        <div className="filter-group">
                            <label>Trạng thái</label>
                            <select 
                                value={filters.status} 
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                            >
                                {statuses.map(status => (
                                    <option key={status.value} value={status.value}>
                                        {status.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="filter-actions">
                        <button className="btn btn-primary" onClick={saveCurrentFilter}>
                            <i className="fas fa-save"></i>
                            Lưu bộ lọc
                        </button>
                        <button className="btn btn-secondary" onClick={clearAllFilters}>
                            <i className="fas fa-times"></i>
                            Xóa tất cả
                        </button>
                    </div>
                </div>
            )}

            {/* Saved Filters */}
            {savedFilters.length > 0 && (
                <div className="saved-filters">
                    <h4>Bộ lọc đã lưu:</h4>
                    <div className="saved-filters-list">
                        {savedFilters.map(filter => (
                            <div key={filter.id} className="saved-filter-item">
                                <span className="filter-name">{filter.name}</span>
                                <div className="filter-actions">
                                    <button 
                                        className="btn btn-sm btn-primary"
                                        onClick={() => loadSavedFilter(filter)}
                                    >
                                        <i className="fas fa-play"></i>
                                    </button>
                                    <button 
                                        className="btn btn-sm btn-danger"
                                        onClick={() => deleteSavedFilter(filter.id)}
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Search Results */}
            <div className="search-results">
                <div className="results-header">
                    <h3>Kết quả tìm kiếm ({pagination.totalCount})</h3>
                    {searchResults.length > 0 && (
                        <button className="btn btn-success" onClick={exportResults}>
                            <i className="fas fa-download"></i>
                            Xuất CSV
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="loading-results">
                        <div className="loading-spinner"></div>
                        <p>Đang tìm kiếm...</p>
                    </div>
                ) : searchResults.length > 0 ? (
                    <>
                        <div className="results-grid">
                            {searchResults.map(patient => (
                                <div key={patient.bookingId} className="patient-card">
                                    <div className="patient-header">
                                        <h4 className="patient-name">{patient.patientName}</h4>
                                        <span 
                                            className="status-badge"
                                            style={{ backgroundColor: getStatusColor(patient.bookingStatusId) }}
                                        >
                                            {getStatusText(patient.bookingStatusId)}
                                        </span>
                                    </div>
                                    
                                    <div className="patient-info">
                                        <div className="info-item">
                                            <i className="fas fa-envelope"></i>
                                            <span>{patient.patientEmail}</span>
                                        </div>
                                        <div className="info-item">
                                            <i className="fas fa-phone"></i>
                                            <span>{patient.patientPhone}</span>
                                        </div>
                                        <div className="info-item">
                                            <i className="fas fa-user"></i>
                                            <span>{patient.patientGender}</span>
                                        </div>
                                        <div className="info-item">
                                            <i className="fas fa-birthday-cake"></i>
                                            <span>{patient.patientDob}</span>
                                        </div>
                                        <div className="info-item">
                                            <i className="fas fa-map-marker-alt"></i>
                                            <span>{patient.patientAddress}</span>
                                        </div>
                                        <div className="info-item">
                                            <i className="fas fa-calendar"></i>
                                            <span>Ngày khám: {formatDate(patient.bookingDate)}</span>
                                        </div>
                                        <div className="info-item">
                                            <i className="fas fa-clock"></i>
                                            <span>Giờ khám: {patient.bookingTime}</span>
                                        </div>
                                        {patient.bookingReason && (
                                            <div className="info-item">
                                                <i className="fas fa-stethoscope"></i>
                                                <span>Lý do: {patient.bookingReason}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="patient-actions">
                                        <button className="btn btn-sm btn-primary">
                                            <i className="fas fa-eye"></i>
                                            Xem chi tiết
                                        </button>
                                        <button className="btn btn-sm btn-info">
                                            <i className="fas fa-calendar-plus"></i>
                                            Đặt lịch
                                        </button>
                                        <button className="btn btn-sm btn-warning">
                                            <i className="fas fa-edit"></i>
                                            Chỉnh sửa
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                            <div className="pagination">
                                <button 
                                    className="btn btn-sm btn-secondary"
                                    disabled={!pagination.hasPrevPage}
                                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                                >
                                    <i className="fas fa-chevron-left"></i>
                                    Trước
                                </button>
                                
                                <span className="page-info">
                                    Trang {pagination.currentPage} / {pagination.totalPages}
                                </span>
                                
                                <button 
                                    className="btn btn-sm btn-secondary"
                                    disabled={!pagination.hasNextPage}
                                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                                >
                                    Sau
                                    <i className="fas fa-chevron-right"></i>
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="no-results">
                        <i className="fas fa-search"></i>
                        <p>Không tìm thấy kết quả nào phù hợp</p>
                        <small>Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</small>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DoctorSearch; 