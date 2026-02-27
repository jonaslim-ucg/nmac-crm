import React, { useState, useEffect, useRef } from 'react';
import { Search, User, Users, ChevronRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGetAllPatientQuery } from '../../redux/services/dashboard/admin/admin.patient';
import { useGetUserQuery } from '../../redux/services/dashboard/admin/adminUserApi';
import { useGetUserProfileQuery } from '../../redux/services/auth/auth.api';

interface SearchResult {
    id: string;
    name: string;
    type: 'patient' | 'agent' | 'manager';
    email?: string;
    image?: string;
}

const GlobalSearch: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const { data: userInfo } = useGetUserProfileQuery();
    const userRole = userInfo?.role;

    const { data: patientsData, isFetching: isPatientsLoading } = useGetAllPatientQuery({ limit: 50, offset: 0 }, { skip: !searchTerm });
    const { data: usersData, isFetching: isUsersLoading } = useGetUserQuery(undefined, { skip: !searchTerm || userRole === 'AGENT' });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getResults = (): SearchResult[] => {
        if (!searchTerm) return [];

        const results: SearchResult[] = [];
        const term = searchTerm.toLowerCase();

        // Patients
        if (patientsData?.results) {
            patientsData.results.forEach((p: any) => {
                if (p.name.toLowerCase().includes(term) || (p.email && p.email.toLowerCase().includes(term))) {
                    results.push({
                        id: p.id,
                        name: p.name,
                        type: 'patient',
                        email: p.email,
                    });
                }
            });
        }

        // Users (Agents/Managers) - Skip for Agents as they shouldn't see other users usually
        if (usersData?.results && userRole !== 'AGENT') {
            usersData.results.forEach((u: any) => {
                if (u.name.toLowerCase().includes(term) || (u.email && u.email.toLowerCase().includes(term))) {
                    results.push({
                        id: u.id,
                        name: u.name,
                        type: u.role.toLowerCase() as 'agent' | 'manager',
                        email: u.email,
                        image: u.photo
                    });
                }
            });
        }

        return results.slice(0, 10); // Limit results
    };

    const handleSelect = (result: SearchResult) => {
        setIsOpen(false);
        setSearchTerm('');

        if (result.type === 'patient') {
            const basePath = userRole === 'ADMIN' ? '/dashboard/admin/patient-management' :
                userRole === 'MANAGER' ? '/dashboard/manager/patients' :
                    '/dashboard/agent/patients';

            // Note: Admin doesn't seem to have a single patient view in routes, so we go to the management list
            // For Manager/Agent, we go to details
            if (userRole === 'ADMIN') {
                navigate(basePath);
            } else {
                navigate(`${basePath}/${result.id}`);
            }
        } else {
            // User navigation (Admin only usually)
            if (userRole === 'ADMIN') {
                navigate(`/dashboard/admin/user-management/user/${result.id}`);
            }
        }
    };

    const results = getResults();
    const isSearching = isPatientsLoading || isUsersLoading;

    return (
        <div className="relative" ref={searchRef}>
            <div className="flex items-center gap-2 text-gray-600">
                <Search className={`w-4 h-4 ${isOpen ? 'text-blue-500' : 'text-gray-400'}`} />
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    className="block text-sm font-normal outline-none bg-transparent placeholder-gray-400"
                />
                {isSearching && <Loader2 className="w-3 h-3 animate-spin text-blue-500" />}
            </div>

            {/* Dropdown */}
            {isOpen && searchTerm && (
                <div className="absolute top-full left-0 mt-4 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="max-h-[400px] overflow-y-auto">
                        <div className="p-2 border-b border-gray-50 flex justify-between items-center px-4">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Search Results</span>
                            <span className="text-[10px] text-gray-400">{results.length} found</span>
                        </div>

                        {results.length > 0 ? (
                            <div className="py-1">
                                {results.map((result) => (
                                    <button
                                        key={`${result.type}-${result.id}`}
                                        onClick={() => handleSelect(result)}
                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50/50 transition-colors text-left group"
                                    >
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${result.type === 'patient' ? 'bg-blue-100 text-blue-600' :
                                            result.type === 'agent' ? 'bg-purple-100 text-purple-600' :
                                                'bg-orange-100 text-orange-600'
                                            }`}>
                                            {result.image ? (
                                                <img src={result.image} alt="" className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                result.type === 'patient' ? <Users className="w-4 h-4" /> : <User className="w-4 h-4" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                                                    {result.name}
                                                </p>
                                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${result.type === 'patient' ? 'bg-blue-50 text-blue-700' :
                                                    result.type === 'agent' ? 'bg-purple-50 text-purple-700' :
                                                        'bg-orange-50 text-orange-700'
                                                    }`}>
                                                    {result.type}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 truncate">{result.email || 'No email provided'}</p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
                                    </button>
                                ))}
                            </div>
                        ) : !isSearching && (
                            <div className="p-8 text-center">
                                <Search className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                                <p className="text-sm font-medium text-gray-900">No results found</p>
                                <p className="text-xs text-gray-500 mt-1">Try a different name or email</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GlobalSearch;
