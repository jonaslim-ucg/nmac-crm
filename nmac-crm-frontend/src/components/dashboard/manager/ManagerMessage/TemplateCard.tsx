import React from 'react';
import { MessageSquare, Mail } from 'lucide-react';

interface TemplateCardProps {
    title: string;
    type: 'whatsapp' | 'email' | 'both' | string;
    content: string | string[];
    onUse?: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ title, type, content, onUse }) => {
    // Helper to format content as array of paragraphs
    const contentParagraphs = Array.isArray(content) ? content : [content];

    return (
        <div className="bg-gray-50 rounded-lg p-5">
            {/* Template Header */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-sm font-bold text-gray-900 mb-2">
                        {title}
                    </h2>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-gray-900 text-white capitalize">
                        {type === 'whatsapp' ? (
                            <>
                                <MessageSquare className="w-4 h-4" />
                                WhatsApp
                            </>
                        ) : type === 'email' ? (
                            <>
                                <Mail className="w-4 h-4" />
                                Email
                            </>
                        ) : (
                            <>
                                <MessageSquare className="w-4 h-4" />
                                {type}
                            </>
                        )}
                    </div>
                </div>
                <button
                    onClick={onUse}
                    className="px-3 py-2 text-md font-semibold text-gray-900 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
                >
                    Use Template
                </button>
            </div>

            {/* Template Content */}
            <div className="text-sm text-[#4A5565] space-y-2">
                {contentParagraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
            </div>
        </div>
    );
};

export default TemplateCard;
