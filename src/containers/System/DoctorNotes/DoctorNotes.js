import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import './DoctorNotes.scss';

function DoctorNotes() {
    const [notes, setNotes] = useState([]);
    const [currentNote, setCurrentNote] = useState({
        id: null,
        title: '',
        content: '',
        patientId: '',
        patientName: '',
        category: 'general',
        tags: [],
        isImportant: false,
        date: new Date().toISOString().split('T')[0]
    });
    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showImportantOnly, setShowImportantOnly] = useState(false);
    const [loading, setLoading] = useState(false);

    const user = useSelector(state => state.user.userInfo);

    // Mock data for demonstration
    const mockNotes = [
        {
            id: 1,
            title: 'Ghi chú về bệnh nhân Nguyễn Văn A',
            content: 'Bệnh nhân có tiền sử huyết áp cao, cần theo dõi thường xuyên. Đã kê đơn thuốc hạ huyết áp và hẹn tái khám sau 2 tuần.',
            patientId: 'P001',
            patientName: 'Nguyễn Văn A',
            category: 'patient',
            tags: ['huyết áp', 'tim mạch', 'theo dõi'],
            isImportant: true,
            date: '2024-01-15',
            createdAt: '2024-01-15T10:30:00'
        },
        {
            id: 2,
            title: 'Nhật ký khám bệnh ngày 15/01',
            content: 'Hôm nay khám 8 bệnh nhân. Chủ yếu là các bệnh về đường hô hấp do thời tiết thay đổi. Cần chuẩn bị thêm thuốc cảm cúm.',
            patientId: '',
            patientName: '',
            category: 'diary',
            tags: ['nhật ký', 'hô hấp', 'thuốc'],
            isImportant: false,
            date: '2024-01-15',
            createdAt: '2024-01-15T18:00:00'
        },
        {
            id: 3,
            title: 'Template ghi chú bệnh tim mạch',
            content: 'Bệnh nhân có các triệu chứng: [triệu chứng]. Chẩn đoán: [chẩn đoán]. Điều trị: [phương pháp điều trị]. Theo dõi: [thời gian tái khám].',
            patientId: '',
            patientName: '',
            category: 'template',
            tags: ['template', 'tim mạch', 'chẩn đoán'],
            isImportant: true,
            date: '2024-01-10',
            createdAt: '2024-01-10T09:00:00'
        }
    ];

    useEffect(() => {
        // Simulate loading notes
        setLoading(true);
        setTimeout(() => {
            setNotes(mockNotes);
            setLoading(false);
        }, 1000);
    }, []);

    const categories = [
        { value: 'all', label: 'Tất cả' },
        { value: 'patient', label: 'Bệnh nhân' },
        { value: 'diary', label: 'Nhật ký' },
        { value: 'template', label: 'Template' },
        { value: 'general', label: 'Ghi chú chung' }
    ];

    const filteredNotes = notes.filter(note => {
        const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;
        const matchesImportant = !showImportantOnly || note.isImportant;
        
        return matchesSearch && matchesCategory && matchesImportant;
    });

    const handleSaveNote = () => {
        if (!currentNote.title.trim() || !currentNote.content.trim()) {
            alert('Vui lòng nhập tiêu đề và nội dung ghi chú');
            return;
        }

        if (isEditing) {
            // Update existing note
            setNotes(prev => prev.map(note => 
                note.id === currentNote.id ? { ...currentNote, updatedAt: new Date().toISOString() } : note
            ));
        } else {
            // Create new note
            const newNote = {
                ...currentNote,
                id: Date.now(),
                createdAt: new Date().toISOString()
            };
            setNotes(prev => [newNote, ...prev]);
        }

        // Reset form
        setCurrentNote({
            id: null,
            title: '',
            content: '',
            patientId: '',
            patientName: '',
            category: 'general',
            tags: [],
            isImportant: false,
            date: new Date().toISOString().split('T')[0]
        });
        setIsEditing(false);
    };

    const handleEditNote = (note) => {
        setCurrentNote(note);
        setIsEditing(true);
    };

    const handleDeleteNote = (noteId) => {
        if (window.confirm('Bạn có chắc muốn xóa ghi chú này?')) {
            setNotes(prev => prev.filter(note => note.id !== noteId));
        }
    };

    const handleAddTag = (tag) => {
        if (tag && !currentNote.tags.includes(tag)) {
            setCurrentNote(prev => ({
                ...prev,
                tags: [...prev.tags, tag]
            }));
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setCurrentNote(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case 'patient': return '#0071ba';
            case 'diary': return '#28a745';
            case 'template': return '#ffc107';
            case 'general': return '#6c757d';
            default: return '#6c757d';
        }
    };

    const getCategoryLabel = (category) => {
        const cat = categories.find(c => c.value === category);
        return cat ? cat.label : category;
    };

    if (loading) {
        return (
            <div className="doctor-notes">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Đang tải ghi chú...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="doctor-notes">
            <div className="notes-header">
                <h2 className="notes-title">
                    <i className="fas fa-sticky-note"></i>
                    Ghi chú và nhật ký
                </h2>
                <p className="notes-subtitle">
                    Quản lý ghi chú cá nhân và nhật ký khám bệnh
                </p>
            </div>

            <div className="notes-container">
                {/* Note Editor */}
                <div className="note-editor">
                    <h3 className="editor-title">
                        {isEditing ? 'Chỉnh sửa ghi chú' : 'Tạo ghi chú mới'}
                    </h3>
                    
                    <div className="editor-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Tiêu đề *</label>
                                <input
                                    type="text"
                                    value={currentNote.title}
                                    onChange={(e) => setCurrentNote(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="Nhập tiêu đề ghi chú..."
                                    className="form-input"
                                />
                            </div>
                            
                            <div className="form-group">
                                <label>Ngày</label>
                                <input
                                    type="date"
                                    value={currentNote.date}
                                    onChange={(e) => setCurrentNote(prev => ({ ...prev, date: e.target.value }))}
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Loại ghi chú</label>
                                <select
                                    value={currentNote.category}
                                    onChange={(e) => setCurrentNote(prev => ({ ...prev, category: e.target.value }))}
                                    className="form-input"
                                >
                                    {categories.slice(1).map(cat => (
                                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label>Bệnh nhân (nếu có)</label>
                                <input
                                    type="text"
                                    value={currentNote.patientName}
                                    onChange={(e) => setCurrentNote(prev => ({ ...prev, patientName: e.target.value }))}
                                    placeholder="Tên bệnh nhân..."
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Nội dung *</label>
                            <textarea
                                value={currentNote.content}
                                onChange={(e) => setCurrentNote(prev => ({ ...prev, content: e.target.value }))}
                                placeholder="Nhập nội dung ghi chú..."
                                className="form-textarea"
                                rows="6"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Tags</label>
                                <div className="tags-input">
                                    <input
                                        type="text"
                                        placeholder="Thêm tag..."
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAddTag(e.target.value.trim());
                                                e.target.value = '';
                                            }
                                        }}
                                        className="form-input"
                                    />
                                </div>
                                <div className="tags-list">
                                    {currentNote.tags.map(tag => (
                                        <span key={tag} className="tag">
                                            {tag}
                                            <button onClick={() => handleRemoveTag(tag)}>×</button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={currentNote.isImportant}
                                        onChange={(e) => setCurrentNote(prev => ({ ...prev, isImportant: e.target.checked }))}
                                    />
                                    <span className="checkmark"></span>
                                    Ghi chú quan trọng
                                </label>
                            </div>
                        </div>

                        <div className="editor-actions">
                            <button className="btn btn-primary" onClick={handleSaveNote}>
                                <i className="fas fa-save"></i>
                                {isEditing ? 'Cập nhật' : 'Lưu ghi chú'}
                            </button>
                            {isEditing && (
                                <button 
                                    className="btn btn-secondary" 
                                    onClick={() => {
                                        setIsEditing(false);
                                        setCurrentNote({
                                            id: null,
                                            title: '',
                                            content: '',
                                            patientId: '',
                                            patientName: '',
                                            category: 'general',
                                            tags: [],
                                            isImportant: false,
                                            date: new Date().toISOString().split('T')[0]
                                        });
                                    }}
                                >
                                    <i className="fas fa-times"></i>
                                    Hủy
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Notes List */}
                <div className="notes-list">
                    <div className="list-header">
                        <h3>Danh sách ghi chú ({filteredNotes.length})</h3>
                        
                        <div className="list-filters">
                            <div className="search-box">
                                <i className="fas fa-search"></i>
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm ghi chú..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="search-input"
                                />
                            </div>
                            
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="filter-select"
                            >
                                {categories.map(cat => (
                                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                                ))}
                            </select>
                            
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={showImportantOnly}
                                    onChange={(e) => setShowImportantOnly(e.target.checked)}
                                />
                                <span className="checkmark"></span>
                                Chỉ hiện quan trọng
                            </label>
                        </div>
                    </div>

                    <div className="notes-grid">
                        {filteredNotes.length > 0 ? (
                            filteredNotes.map(note => (
                                <div key={note.id} className={`note-card ${note.isImportant ? 'important' : ''}`}>
                                    <div className="note-header">
                                        <div className="note-meta">
                                            <span 
                                                className="category-badge"
                                                style={{ backgroundColor: getCategoryColor(note.category) }}
                                            >
                                                {getCategoryLabel(note.category)}
                                            </span>
                                            {note.isImportant && (
                                                <span className="important-badge">
                                                    <i className="fas fa-star"></i>
                                                </span>
                                            )}
                                        </div>
                                        <div className="note-actions">
                                            <button 
                                                className="btn btn-sm btn-primary"
                                                onClick={() => handleEditNote(note)}
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button 
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleDeleteNote(note.id)}
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <h4 className="note-title">{note.title}</h4>
                                    
                                    {note.patientName && (
                                        <p className="note-patient">
                                            <i className="fas fa-user"></i>
                                            {note.patientName}
                                        </p>
                                    )}
                                    
                                    <p className="note-content">
                                        {note.content.length > 150 
                                            ? `${note.content.substring(0, 150)}...` 
                                            : note.content
                                        }
                                    </p>
                                    
                                    <div className="note-tags">
                                        {note.tags.map(tag => (
                                            <span key={tag} className="tag">{tag}</span>
                                        ))}
                                    </div>
                                    
                                    <div className="note-footer">
                                        <span className="note-date">
                                            <i className="fas fa-calendar"></i>
                                            {formatDate(note.date)}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-notes">
                                <i className="fas fa-sticky-note"></i>
                                <p>Không tìm thấy ghi chú nào</p>
                                <small>Thử thay đổi bộ lọc hoặc tạo ghi chú mới</small>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DoctorNotes; 