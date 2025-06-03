import React, { useState } from 'react';
import { LogIn, X, User, Mail, Lock, UserCog, CheckCircle2, MessageSquare, Chrome, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AuthModalProps {
  onClose: () => void;
  onSignIn: (userType?: string, userId?: string) => void;
}

const ADMIN_CREDENTIALS = {
  id: 'ADMIN001',
  password: 'admin123'
};

const VASTRAKAR_TYPES = [
  'Maggam Work Specialist',
  'Stitch Master/Mistress',
  'Fashion Designer',
  'Tassel Worker',
  'Embroidery Worker',
  'Print Master'
];

const VASTRAKAR_CREDENTIALS = {
  'Maggam Work Specialist': { id: 'MGW001', password: 'maggam123' },
  'Stitch Master/Mistress': { id: 'STM001', password: 'stitch123' },
  'Fashion Designer': { id: 'FD001', password: 'fashion123' },
  'Tassel Worker': { id: 'TW001', password: 'tassel123' },
  'Embroidery Worker': { id: 'EW001', password: 'embroidery123' },
  'Print Master': { id: 'PM001', password: 'print123' }
};

export default function AuthModal({ onClose, onSignIn }: AuthModalProps) {
  const navigate = useNavigate();
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [userType, setUserType] = useState('customer');
  const [rememberMe, setRememberMe] = useState(false);

  //1
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showVastrakarPopup, setShowVastrakarPopup] = useState(false);
  const [selectedVastrakarType, setSelectedVastrakarType] = useState('');
  const [adminCredentials, setAdminCredentials] = useState({ id: '', password: '' });
  const [vastrakarCredentials, setVastrakarCredentials] = useState({ id: '', password: '' });
  const [credentialError, setCredentialError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isOtpLogin, setIsOtpLogin] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    otp: ''
  });

  //2
  const handleAdminLogin = () => {
    if (adminCredentials.id === ADMIN_CREDENTIALS.id && 
        adminCredentials.password === ADMIN_CREDENTIALS.password) {
      setShowSuccess(true);
      setTimeout(() => {
        onSignIn('admin', adminCredentials.id);
        navigate('/admin-dashboard');
        onClose();
      }, 1500);
    } else {
      setCredentialError('Invalid admin credentials');
    }
  };



  //3
  const handleVastrakarLogin = () => {
    const expectedCredentials = VASTRAKAR_CREDENTIALS[selectedVastrakarType as keyof typeof VASTRAKAR_CREDENTIALS];
    
    if (vastrakarCredentials.id === expectedCredentials.id && 
        vastrakarCredentials.password === expectedCredentials.password) {
      setShowSuccess(true);
      setTimeout(() => {
        onSignIn('vastrakar', vastrakarCredentials.id);
        navigate('/vastrakar-dashboard', { 
          state: { 
            vastrakarType: selectedVastrakarType,
            vastrakarId: vastrakarCredentials.id 
          }
        });
        onClose();
      }, 1500);
    } else {
      setCredentialError('Invalid credentials');
    }
  };


  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!isOtpLogin && !formData.password) {
      newErrors.password = 'Password is required';
    } else if (!isOtpLogin && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (isOtpLogin && otpSent && !formData.otp) {
      newErrors.otp = 'OTP is required';
    }

    if (!isLoginTab) {
      if (!formData.fullName) {
        newErrors.fullName = 'Full name is required';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setShowSuccess(true);
      
      setTimeout(() => {
        onSignIn();
        onClose();
      }, 1500);
    }
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors({ email: 'Please enter a valid email' });
      return;
    }
    setOtpSent(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  //EDIT5
  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md">
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
            <h2 className="text-2xl font-bold text-gray-900">
              {isLoginTab ? 'Sign In Successful!' : 'Account Created Successfully!'}
            </h2>
            <p className="text-gray-600">
              {isLoginTab ? 'Welcome back to StitchVastra' : 'Welcome to StitchVastra'}
            </p>
          </div>
        </div>
      </div>
    );
  }
    //6
  if (showAdminLogin) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Admin Login</h2>
            <button onClick={() => setShowAdminLogin(false)}>
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Admin ID</label>
              <input
                type="text"
                value={adminCredentials.id}
                onChange={(e) => {
                  setAdminCredentials(prev => ({ ...prev, id: e.target.value }));
                  setCredentialError('');
                }}
                placeholder="Enter admin ID"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={adminCredentials.password}
                onChange={(e) => {
                  setAdminCredentials(prev => ({ ...prev, password: e.target.value }));
                  setCredentialError('');
                }}
                placeholder="Enter password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {credentialError && (
              <p className="text-red-500 text-sm">{credentialError}</p>
            )}

            <button
              onClick={handleAdminLogin}
              className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              <LogIn className="h-5 w-5" />
              Login as Admin
            </button>
          </div>
        </div>
      </div>
    );
  }

  //7
  if (showVastrakarPopup) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Vastrakar Login</h2>
            <button onClick={() => setShowVastrakarPopup(false)}>
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <select
                value={selectedVastrakarType}
                onChange={(e) => {
                  setSelectedVastrakarType(e.target.value);
                  setCredentialError('');
                }}
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
              >
                <option value="">Select your specialization</option>
                {VASTRAKAR_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
            </div>

            {selectedVastrakarType && (
              <>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Vastrakar ID</label>
                  <input
                    type="text"
                    value={vastrakarCredentials.id}
                    onChange={(e) => {
                      setVastrakarCredentials(prev => ({ ...prev, id: e.target.value }));
                      setCredentialError('');
                    }}
                    placeholder="Enter your Vastrakar ID"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    value={vastrakarCredentials.password}
                    onChange={(e) => {
                      setVastrakarCredentials(prev => ({ ...prev, password: e.target.value }));
                      setCredentialError('');
                    }}
                    placeholder="Enter your password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                {credentialError && (
                  <p className="text-red-500 text-sm">{credentialError}</p>
                )}

                <button
                  onClick={handleVastrakarLogin}
                  className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                >
                  <LogIn className="h-5 w-5" />
                  Login as Vastrakar
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{isLoginTab ? 'Sign In' : 'Sign Up'}</h2>
          <button onClick={onClose}>
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={isOtpLogin && !otpSent ? handleSendOtp : handleSubmit} className="space-y-4">
          {!isLoginTab && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.fullName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {isLoginTab && isOtpLogin ? (
            otpSent ? (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleInputChange}
                    placeholder="Enter OTP sent to your email"
                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      errors.otp ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.otp && (
                  <p className="text-red-500 text-sm mt-1">{errors.otp}</p>
                )}
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="text-sm text-indigo-600 hover:text-indigo-700"
                >
                  Resend OTP
                </button>
              </div>
            ) : null
          ) : (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
          )}

          {!isLoginTab && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          )}

          {isLoginTab && (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="remember-me"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="text-sm text-gray-600">
                    Remember me
                  </label>
                </div>
                <a href="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-700">
                  Forgot password?
                </a>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">User Type</label>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="customer"
                      name="userType"
                      value="customer"
                      checked={userType === 'customer'}
                      onChange={(e) => setUserType(e.target.value)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <label htmlFor="customer" className="text-sm text-gray-600">
                      Customer
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="admin"
                      name="userType"
                      value="admin"
                      checked={userType === 'admin'}
                      onChange={(e) => {
                        setUserType(e.target.value);
                        if (e.target.value === 'admin') {
                          setShowAdminLogin(true);
                        }
                      }}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <label htmlFor="admin" className="text-sm text-gray-600 flex items-center gap-1">
                      <UserCog className="h-4 w-4" />
                      Admin
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="vastrakar"
                  name="userType"
                  value="vastrakar"
                  checked={userType === 'vastrakar'}
                  onChange={(e) => {
                    setUserType(e.target.value);
                    if (e.target.value === 'vastrakar') {
                      setShowVastrakarPopup(true);
                    }
                  }}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <label htmlFor="vastrakar" className="text-sm text-gray-600 flex items-center gap-1">
                  <UserCog className="h-4 w-4" />
                  Vastrakar
                </label>
              </div>
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            <LogIn className="h-5 w-5" />
            {isLoginTab 
              ? (isOtpLogin 
                  ? (otpSent ? 'Verify OTP' : 'Send OTP') 
                  : 'Sign In')
              : 'Sign Up'
            }
          </button>

          {isLoginTab && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="space-y-3">
              <button
                type="button"
                onClick={async () => {
                  try {
                    const user = await signInWithGoogle();
                    console.log("User signed in:", user);
                    onSignIn(); // Call the sign-in handler
                    onClose();  // Close the modal
                  } catch (error) {
                    console.error("Google sign-in failed", error);
                  }
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Chrome className="h-5 w-5 text-red-500" />
                Continue with Google
              </button>

                <button
                  type="button"
                  onClick={() => setIsOtpLogin(!isOtpLogin)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <MessageSquare className="h-5 w-5 text-indigo-500" />
                  {isOtpLogin ? 'Sign in with Password' : 'Sign in with OTP'}
                </button>
              </div>
            </>
          )}

          {isLoginTab ? (
            <p className="text-center text-gray-600 text-sm">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLoginTab(false);
                  setIsOtpLogin(false);
                }}
                className="text-indigo-600 hover:text-indigo-700"
              >
                Sign up
              </button>
            </p>
          ) : (
            <p className="text-center text-gray-600 text-sm">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsLoginTab(true)}
                className="text-indigo-600 hover:text-indigo-700"
              >
                Sign in
              </button>
            </p>
          )}

          <p className="text-center text-xs text-gray-500">
            By continuing, you agree to our{' '}
            <a href="/terms" className="text-indigo-600 hover:text-indigo-700">Terms of Service</a>
            {' '}and{' '}
            <a href="/privacy" className="text-indigo-600 hover:text-indigo-700">Privacy Policy</a>
          </p>
        </form>
      </div>
    </div>
  );
}