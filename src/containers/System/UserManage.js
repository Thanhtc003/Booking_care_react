import { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { getAllUsers, createNewUserService, EditUserService, deleteUser } from '../../services/userService'
import ModalUser from './ModalUser';
import ModalEditUser from './ModalEditUser';

function UserManage() {
    const [arrUsers, setArrUsers] = useState([]);
    const [showModal, setShowModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [dataUser, setDataUser] = useState({})

    useEffect(() => {
        fetchData()
    }, [])

    const toggleShowModal = () => {
        setShowModal(!showModal)
    }

    const toggleShowEditModal = () => {
        setShowEditModal(!showEditModal)
    }

    const fetchData = async () => {
        const response = await getAllUsers('ALL');
        setArrUsers(response.users)
    }

    const createNewUser = async (data) => {
        try {
            console.log('🔍 Creating user with data:', data);
            const response = await createNewUserService(data)
            console.log('📊 Create response:', response);
            
            if (response && response.errorCode === 0) {
                await fetchData()
                setShowModal(false)
                alert('Create successful!')
            } else {
                alert(response?.message || 'Create failed!')
            }
        } catch (error) {
            console.log('❌ Error creating user:', error);
            alert('Error creating user: ' + error.message)
        }
    }

    const handleClickEditBtn = (user) => {

        setShowEditModal(true)
        setDataUser(user)

    }

    const updateUser = async (data) => {
        try {
            console.log('🔍 Updating user with data:', data);
            const response = await EditUserService(data);
            console.log('📊 Update response:', response);
            
            if (response && response.errorCode === 0) {
                await fetchData()
                setShowEditModal(false)
                alert('Update successful!')
            } else {
                alert(response?.message || 'Update failed!')
            }
        } catch (error) {
            console.log('❌ Error updating user:', error);
            alert('Error updating user: ' + error.message)
        }
    }

    const handleDeleteBtn = async (userId) => {
        try {
            console.log('🔍 Deleting user with id:', userId);
            const response = await deleteUser(userId);
            console.log('📊 Delete response:', response);
            
            if (response && response.errorCode === 0) {
                await fetchData()
                alert('Delete successful!')
            } else {
                alert(response?.message || 'Delete failed!')
            }
        } catch (error) {
            console.log('❌ Error deleting user:', error);
            alert('Error deleting user: ' + error.message)
        }
    }

    return (

        <div className='users-container'>
            <h3 className="title-users text-center mt-3 title">Manage User</h3>
            <button type="button" className="btn btn-primary mx-3 px-3" onClick={toggleShowModal}>Create a new user</button>
            <ModalUser showModal={showModal} toggleShowModal={toggleShowModal} createNewUser={createNewUser} />
            {showEditModal && <ModalEditUser showModal={showEditModal} toggleShowModal={toggleShowEditModal} currentUser={dataUser} updateUser={updateUser} />}

            <table className="table table-hover mt-3 mx-3">
                <thead>
                    <tr>
                        <th scope="col">First Name</th>
                        <th scope="col">Last Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Address</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {arrUsers.map(user => (
                        <tr key={user.id}>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.email}</td>
                            <td>{user.address}</td>
                            <td>
                                <button type="button" className="btn btn-info px-2 mx-1" onClick={() => handleClickEditBtn(user)}>Edit</button>
                                <button type="button" className="btn btn-danger px-2 mx-1" onClick={() => handleDeleteBtn(user.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>

    );
}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
