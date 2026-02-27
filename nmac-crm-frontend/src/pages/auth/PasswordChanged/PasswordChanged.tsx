import loginImg from '../../../assets/login-image.png';
import Footer from '../../../components/auth/Login/Footer';
import passwordImg from '../../../assets/password-image.png'
import { Link } from 'react-router-dom';
const PasswordChanged: React.FC = () => {

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 relative overflow-hidden">
            {/* 🔹 Background Image (Flipped) */}
            <div
                className="absolute inset-0 bg-cover bg-center scale-x-[-1]"
                style={{
                    backgroundImage: `url(${loginImg})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            ></div>

            {/* 🔹 Main Content */}
            <div className=" flex items-center justify-end relative z-10 py-12 md:py-20">
                <div className="w-full md:w-[50%] flex justify-end items-center">
                    <div className="w-full max-w-md">
                        <div className="bg-white rounded-tl-[40px] rounded-bl-[10px] shadow-2xl p-6 sm:p-8">
                            {/* Header */}
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-0.5">
                                    Northshore Medical
                                </h2>
                                <p className="text-sm text-gray-500">Agent Real & Care Center</p>
                            </div>


                            <div className='flex justify-center'>
                                <img src={passwordImg} alt="image" />
                            </div>

                            {/* Title */}
                            <div className="text-center mb-4">
                                <h1 className="text-3xl font-bold text-gray-900 mb-1 mt-5">Password changed </h1>
                            </div>
                            <p className="text-sm text-gray-500 text-center">Your password has been changed <br />
                                succesfully.</p>
                            {/* Form */}
                            <div className="mt-6 space-y-4">

                              <Link to='/'>
                                <button
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-1.5 rounded-3xl text-[14px] transition-all duration-200 shadow-lg shadow-blue-500/30 mt-5"
                                >
                                    Login
                                </button>
                              </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 🔹 Footer */}
            <Footer />
        </div>
    );
};

export default PasswordChanged;
