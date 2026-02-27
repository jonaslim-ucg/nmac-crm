import { UserRoundPlus } from 'lucide-react';
import React from 'react';

interface AgentCardProps {
    initials: string;
    name: string;
    calls: number;
    booked: number;
    rate: string;
    bgColor: string;
}

const AgentCard: React.FC<AgentCardProps> = ({ initials, name, calls, booked, rate, bgColor }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center min-w-[180px]">
            {/* Avatar */}
            <div
                className={`w-12 h-12 rounded-full ${bgColor} flex items-center justify-center mb-3`}
            >
                <span className="text-sm font-semibold text-gray-700">{initials}</span>
            </div>

            {/* Name */}
            <h3 className="text-md font-medium text-[#1E2939] mb-4 border-b border-gray-200">{name}</h3>

            {/* Stats */}
            <div className="w-full space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-[#6A7282]">Calls:</span>
                    <span className="text-sm font-medium text-[#364153]">{calls}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-[#6A7282]">Booked:</span>
                    <span className="text-sm font-medium text-[#008236]">{booked}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-[#6A7282]">Rate:</span>
                    <span className="text-sm font-semibold text-[#1447E6]">{rate}</span>
                </div>
            </div>
        </div>
    );
};

const SalesAgentCard: React.FC<{ agents: any[] }> = ({ agents }) => {
    const displayAgents = agents.map((agent: any) => {
        const getInitials = (name: string) => {
            return name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase();
        };

        return {
            initials: getInitials(agent.name),
            name: agent.name,
            calls: agent.total_calls,
            booked: agent.total_booked,
            rate: `${agent.conversion_rate_percent}%`,
            bgColor: 'bg-blue-100', // Default color, can be randomized if needed
        };
    });

    return (
        <div className="">
            <div className="w-full">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    {/* Left Section */}
                    <div className="flex items-center gap-3">
                        <UserRoundPlus className="w-5 h-5" />
                        <h1 className="text-lg font-semibold">Agent Performance Comparison</h1>
                    </div>

                    {/* Right Section */}
                    <div className="w-full sm:w-auto">
                        <select className="w-full bg-[#F3F3F5] p-2 pr-12 rounded-full text-sm sm:text-base">
                            <option value="">This Week</option>
                            <option value="">Today</option>
                            <option value="">This Month</option>
                            <option value="">This Quarter</option>
                        </select>
                    </div>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    {displayAgents.length > 0 ? (
                        displayAgents.map((agent, index) => (
                            <AgentCard
                                key={index}
                                initials={agent.initials}
                                name={agent.name}
                                calls={agent.calls}
                                booked={agent.booked}
                                rate={agent.rate}
                                bgColor={agent.bgColor}
                            />
                        ))
                    ) : (
                        <div className="col-span-full py-10 text-center text-gray-500">
                            No agent performance data available.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SalesAgentCard;