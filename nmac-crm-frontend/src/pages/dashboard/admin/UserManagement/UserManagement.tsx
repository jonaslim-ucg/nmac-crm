/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo } from 'react';
import { Eye, FileEdit, Loader2, User, X } from 'lucide-react';
import { useNavigate} from 'react-router-dom';
import { useCreateUserMutation, useGetUserQuery } from '../../../../redux/services/dashboard/admin/adminUserApi';
import Spinner from '../../../../components/Spinner';
// import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import type { ApiUser } from '../../../../redux/services/dashboard/admin/types/adminUser.type';

type Role = 'AGENT' | 'MANAGER' | 'ADMIN';
type Status = 'active' | 'inactive';

interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    status: Status;
    patients: number | 'N/A';
    lastActive: string;
}


const RoleBadge: React.FC<{ role: Role }> = ({ role }) => {
    // const role = useAppSelector(state => state.auth.role);
    const isManager = role === 'MANAGER';
    const isAdmin = role === 'ADMIN';
    const bgColor = isManager ? 'bg-[#EEF2FF]' : isAdmin ? 'bg-[#F0FDF4]' : 'bg-[#E6F4EA]';
    const textColor = isManager ? 'text-[#5D5DF5]' : isAdmin ? 'text-[#166534]' : 'text-[#3D8C5A]';


    return (
        <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize select-none ${bgColor} ${textColor} whitespace-nowrap`}
            style={{
                borderRadius: '9999px',
                padding: '3px 12px',
                fontSize: '12px',
                fontWeight: 500
            }}
        >
            {role}
        </span>
    );
};

const StatusBadge: React.FC<{ status: Status }> = ({ status }) => {
    const isActive = status === 'active';
    const bgColor = isActive ? 'bg-[#E6F4EA]' : 'bg-[#FEE2E2]';
    const textColor = isActive ? 'text-[#3D8C5A]' : 'text-[#DC2626]';

    return (
        <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize select-none ${bgColor} ${textColor} whitespace-nowrap`}
            style={{
                borderRadius: '9999px',
                padding: '3px 12px',
                fontSize: '12px',
                fontWeight: 500
            }}
        >
            {status}
        </span>
    );
};

const UserManagement: React.FC = () => {
    // const [users, setUsers] = useState<User[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const [limit, setLimit] = useState(10); // Patients per page
    const [page, setPage] = useState(1); // Current page
    // const offset = (page - 1) * limit;
    const { data: usersData = [], isLoading } = useGetUserQuery();
    const [createUser, { isLoading: createUserLoading }] = useCreateUserMutation();
    // const [deleteUser] = useDeleteUserProfileMutation();
        const totalUsers = usersData?.count || 0;
    const totalPages = Math.ceil(totalUsers / limit);
    // console.log(usersData)

    const [newUser, setNewUser] = useState<{
        name: string;
        email: string;
        password: string;
        // phone?: string;
        role: Role;
        status: Status;
        // photo: File | null;
        }>({
        name: '',
        email: '',
        password: '',
        // phone: '',
        role: 'AGENT',
        status: 'active',
        // photo: null,
        });

   



    const handleAddUser = async () => {
  if (!newUser.email || !newUser.password) return;

  const formData = new FormData();
  formData.append('email', newUser.email);
  formData.append('password', newUser.password);
  formData.append('name', newUser.name);
  formData.append('role', newUser.role);


  try {
    await createUser(formData).unwrap();
    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: 'User created successfully',
      timer: 2000,
      showConfirmButton: false,
    });
    setIsModalOpen(false);
    setNewUser({
      name: '',
      email: '',
      password: '',
    //   phone: '',
      role: 'AGENT',
      status: 'active',
    //   photo: null,
    });

  } catch (error: any) {
    console.error('Create user failed', error);
    Swal.fire({
      icon: 'error',
      title: 'Failed',
      text: error?.message || 'User creation failed',
    });
  }
};


    const handleAction = (action: string, user: ApiUser) => {
        console.log(action, user);

        if (action === 'Edit') {
           navigate(`/dashboard/admin/user-management/edit/${user.id}`, { state: { user } })
        }

        if (action === 'View') {
            navigate(`/dashboard/admin/user-management/user/${user.id}`,{state: { user }});
        }
    };

    // const handleDelete = async (user: ApiUser) => {
    //     try {
    //         await deleteUser(user.id).unwrap();
    //          Swal.fire({
    //         title: 'Are you sure?',
    //         text: "You won't be able to revert this!",
    //         icon: 'warning',
    //         showCancelButton: true,
    //         confirmButtonColor: '#3085d6',
    //         cancelButtonColor: '#d33',
    //         confirmButtonText: 'Yes, delete it!',
    //     }).then((result) => {
    //         if (result.isConfirmed) {
    //             Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
    //         }
    //     });
    //     } catch (error: any) {
    //         console.error('Delete user failed', error);
    //          Swal.fire({
    //   icon: 'error',
    //   title: 'Failed',
    //   text: error?.message || 'User creation failed',
    // });
    //     }
    // };



    const users = usersData?.results as ApiUser[] || [];

    const tableRows = useMemo(() => {
        return users?.map((user) => (
            <div
                key={user.id}
                className={`grid grid-cols-12 items-center px-6 py-2 lg:py-3 text-sm font-medium border-b border-gray-100 last:border-b-0 transition-colors hover:bg-gray-50`}
                style={{
                    gridTemplateColumns: 'minmax(120px, 1.5fr) 2fr 1fr 1fr 1fr 1fr 1.5fr',
                    minHeight: '68px',
                }}
            >
                <div className="col-span-12 lg:col-span-1 font-normal text-gray-800 lg:text-base">
                    {user.name}
                </div>
                <div className="col-span-12 lg:col-span-1 text-black font-normal lg:text-sm pt-0.5 pb-2 lg:p-0 order-3 lg:order-0" style={{ fontSize: '15px' }}>
                    {user.email}
                </div>
                <div className="col-span-6 lg:col-span-1 py-1 lg:py-0 order-1 lg:order-0">
                    <RoleBadge role={user.role} />
                </div>
                <div className="col-span-6 lg:col-span-1 py-1 lg:py-0 order-2 lg:order-0">
                   <StatusBadge status={user.is_active ? 'active' : 'inactive'} />
                </div>
                <div className="col-span-6 lg:col-span-1 text-gray-700 font-normal py-1 lg:py-0 order-4 lg:order-0">
                    {/* {user.patients} */}
                </div>
                <div className="col-span-6 lg:col-span-1 text-gray-700 font-normal py-1 lg:py-0 order-5 lg:order-0">
                    {user.updated_at.split('T')[0]}
                </div>
                <div className="col-span-12 lg:col-span-1 flex items-center space-x-2.5 pt-2 lg:pt-0 order-6 lg:order-0">
                    
                        <button
                            onClick={() => handleAction('View', user)}
                            className="p-2 text-gray-500 hover:bg-gray-100 transition duration-150 border border-gray-200 rounded-2xl cursor-pointer"
                            title="View User"
                        >
                            <Eye className="w-5 h-5" style={{ strokeWidth: 1.5 }} />
                        </button>
                    
                    <button
                        onClick={() => handleAction('Edit', user)}
                        className="p-2 text-gray-500 hover:bg-gray-100 transition duration-150 border border-gray-200 rounded-2xl cursor-pointer"
                        title="Edit User"
                    >
                        <FileEdit className="w-5 h-5" style={{ strokeWidth: 1.5 }} />
                    </button>
                    {/* <Link to='/dashboard/admin/user-management/assign-agent'>
                        <button
                            onClick = {() => handleAction('Assign', user)}
                            className="p-2 text-gray-500 hover:bg-gray-100 transition duration-150 border border-gray-200 rounded-2xl cursor-pointer"
                            title="Assign Agent"
                        >
                            <User className="w-5 h-5" style={{ strokeWidth: 1.5 }} />
                        </button>
                    </Link>
                    <button
                        onClick={() => handleAction('Delete', user)}
                        className="p-2 text-red-500 hover:bg-red-50 transition duration-150 border border-gray-200 rounded-2xl cursor-pointer"
                        title="Delete User"
                    >
                        <Trash2
                         onClick={() => handleDelete(user)}
                         className="w-5 h-5" style={{ strokeWidth: 1.5 }} />
                    </button> */}
                </div>
            </div>
        ));
    }, [usersData]);

        if (isLoading) return <Spinner />;

    return (
        <div className="min-h-screen flex flex-col font-sans bg-gray-50 text-gray-900" style={{ backgroundColor: '#F9FAFB' }}>
            <div className="w-full grow">
                <div
                    className="bg-white rounded-3xl shadow-sm overflow-hidden p-4"
                    style={{
                        borderRadius: '24px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
                        border: '1px solid #F3F4F6'
                    }}
                >
                    <header className="mb-6 lg:mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        {/* Left Side Text */}
                        <div className="flex flex-col">
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900">
                                User Management
                            </h1>
                            <p className="text-sm sm:text-base text-gray-500 mt-1">
                                Create, edit, and manage user accounts for agents and managers
                            </p>
                        </div>

                        {/* Add User Button */}
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="
                                w-full sm:w-auto 
                                flex items-center justify-center
                                bg-[#5D5DF5] text-white 
                                py-2.5 px-5
                                rounded-full font-medium
                                text-sm sm:text-base
                                hover:bg-opacity-90 transition duration-200
                                shadow-[0_4px_6px_-1px_rgba(93,93,245,0.4),0_2px_4px_-2px_rgba(93,93,245,0.3)]
                                "
                        >
                            <User className="w-5 h-5 mr-2" />
                            Add User
                        </button>
                    </header>


                    <div
                        className="hidden lg:grid grid-cols-7 px-6 py-4 text-xs font-medium text-gray-500 uppercase border-b border-gray-100"
                        style={{
                            gridTemplateColumns: 'minmax(120px, 1.5fr) 2fr 1fr 1fr 1fr 1fr 1.5fr',
                            letterSpacing: '0.05em',
                            fontWeight: 600,
                            fontSize: '12px'
                        }}
                    >
                        <div className="p-0 font-bold text-black">Name</div>
                        <div className="p-0 font-bold text-black">Email</div>
                        <div className="p-0 font-bold text-black">Role</div>
                        <div className="p-0 font-bold text-black">Status</div>
                        <div className="p-0 font-bold text-black">Patients</div>
                        <div className="p-0 font-bold text-black">Last Active</div>
                        <div className="p-0 font-bold text-black">Actions</div>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {tableRows}
                    </div>
            {/* Pagination */}
                <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
                    {/* Rows per page */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Rows per page:</span>
                        <select
                        value={limit}
                        onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                        className="px-3 py-1 border border-gray-300 rounded-full text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                        {[5,10, 20, 50].map((l) => (
                            <option key={l} value={l}>{l}</option>
                        ))}
                        </select>
                    </div>

                    {/* {
                        loading &&
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Loading...</span>  
                        </div>
                    } */}

                    {/* Pagination buttons */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Previous */}
                        <button
                        onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                        className="px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-50 transition"
                        >
                        &lt;
                        </button>

                        {/* Page numbers */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .slice(Math.max(page - 3, 0), page + 2)
                        .map((p) => (
                            <button
                            key={p}
                            onClick={() => setPage(p)}
                            className={`px-4 py-1 rounded-full text-sm font-medium border transition
                                ${page === p 
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-600 shadow-md'
                                : 'bg-white border-gray-300 hover:bg-gray-100 text-gray-700'}`}
                            >
                            {p}
                            </button>
                        ))}

                        {/* Next */}
                        <button
                        onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={page === totalPages}
                        className="px-3 py-1 rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-50 transition"
                        >
                        &gt;
                        </button>
                    </div>
                </div>
                </div>
            </div>

            {/* Add User Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl w-full max-w-md">

                        {/* Header */}
                        <div className="flex justify-between items-center p-3 border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900">Create New User</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-1.5 hover:bg-gray-100 rounded-lg transition"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-4 space-y-3">
                            <p className="text-gray-600 text-md">
                                Add a new agent, manager, or admin to the system
                            </p>

                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter full name"
                                        value={newUser.name}
                                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                        className="w-full px-3 py-1.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#5D5DF5] bg-[#F3F3F5]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="Enter email address"
                                        value={newUser.email}
                                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                        className="w-full px-3 py-1.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#5D5DF5] bg-[#F3F3F5]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="Enter password"
                                        value={newUser.password}
                                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                        className="w-full px-3 py-1.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#5D5DF5] bg-[#F3F3F5]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Role
                                    </label>
                                    <select
                                        value={newUser.role}
                                        onChange={(e) =>
                                            setNewUser({ ...newUser, role: e.target.value as Role })
                                        }
                                        className="w-full px-3 py-1.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#5D5DF5] bg-[#F3F3F5]"
                                    >
                                        <option value="AGENT">Agent</option>
                                        <option value="MANAGER">Manager</option>
                                        <option value="ADMIN">Admin</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Status
                                    </label>
                                    <select
                                        value={newUser.status}
                                        onChange={(e) =>
                                            setNewUser({ ...newUser, status: e.target.value as Status })
                                        }
                                        className="w-full px-3 py-1.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#5D5DF5] bg-[#F3F3F5]"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end space-x-3 p-4 border-gray-200">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-3 py-1.5 text-gray-700 border border-gray-300 rounded-full hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddUser}
                                className="px-3 py-1.5 bg-black text-white rounded-full hover:bg-opacity-90 transition flex items-center gap-x-1"
                            >
                                <span><User className='w-4 h-4' /></span>
                                {createUserLoading ? 
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Creating...
                                    </span> 
                                    : 'Create User'}
                            </button>
                        </div>

                    </div>
                </div>

            )}
        </div>
    );
};

export default UserManagement;