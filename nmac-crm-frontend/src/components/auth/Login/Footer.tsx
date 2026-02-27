const Footer = () => {
    return (
        <footer className="relative z-10 bg-white py-6 mt-auto shadow-inner">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 px-4 sm:px-6 md:px-8">
                <div className="text-gray-500 text-xs sm:text-sm order-2 sm:order-1">
                    © 2025 Northshore Medical & Aesthetic Center. All rights reserved.
                </div>
                <div className="flex items-center gap-6 sm:gap-8 order-1 sm:order-2">
                    <a href="#contact" className="text-gray-500 text-xs sm:text-sm hover:text-gray-700 transition-colors">
                        Contact Us
                    </a>
                    <a href="#privacy" className="text-gray-500 text-xs sm:text-sm hover:text-gray-700 transition-colors">
                        Privacy Policy
                    </a>
                    <a href="#terms" className="text-gray-500 text-xs sm:text-sm hover:text-gray-700 transition-colors">
                        Terms of Service
                    </a>
                </div>
            </div>
        </footer>
    )
}

export default Footer