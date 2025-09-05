import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTranslations } from '../hooks/useTranslations';
import { PERSONAS } from '../constants';
import InputField from './InputField';

interface LoginPageProps {
    onNavigate: (page: string) => void;
}

const REMEMBER_ME_KEY = 'rememberedEmail';

const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
    const { login, persona } = useAuth();
    const { t } = useTranslations();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    useEffect(() => {
        const rememberedEmail = localStorage.getItem(REMEMBER_ME_KEY);
        if (rememberedEmail) {
            setEmail(rememberedEmail);
            setRememberMe(true);
        }
    }, []);

    const personaDetails = PERSONAS.find(p => p.id === persona);
    
    const validate = () => {
        let isValid = true;
        setEmailError('');
        setPasswordError('');

        // Basic email validation
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setEmailError(t('auth.invalidEmail'));
            isValid = false;
        }

        // Basic password validation
        if (!password || password.length < 8) {
            setPasswordError(t('auth.passwordTooShort'));
            isValid = false;
        }
        
        return isValid;
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            if (rememberMe) {
                localStorage.setItem(REMEMBER_ME_KEY, email);
            } else {
                localStorage.removeItem(REMEMBER_ME_KEY);
            }
            login({ email, password });
            setLoading(false);
        }, 1000);
    };

    const getLoginFieldProps = () => {
        switch (persona) {
            case 'auditor':
                return {
                    label: t('auth.emailOrAuditorIdLabel'),
                    placeholder: t('auth.emailOrAuditorIdPlaceholder'),
                    autoComplete: 'username'
                };
            case 'officer':
                 return {
                    label: t('auth.emailOrOfficerIdLabel'),
                    placeholder: t('auth.emailOrOfficerIdPlaceholder'),
                    autoComplete: 'username'
                };
            default:
                return {
                    label: t('auth.emailLabel'),
                    placeholder: t('auth.emailPlaceholder'),
                    autoComplete: 'email'
                };
        }
    }

    const loginFieldProps = getLoginFieldProps();

    return (
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl animate-fadein">
            <div className="text-center mb-8">
                {personaDetails && (
                    <div className="flex flex-col items-center mb-4 text-halal-green">
                        <div className="w-16 h-16">{personaDetails.icon}</div>
                        <h1 className="text-2xl font-bold text-gray-800 mt-2">
                            {t('auth.loginTitle')}{' '}
                            <span className="text-halal-green">{t(personaDetails.name)}</span>
                        </h1>
                    </div>
                )}
            </div>
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <InputField
                    id="email"
                    label={loginFieldProps.label}
                    name="email"
                    type="text"
                    autoComplete={loginFieldProps.autoComplete}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={loginFieldProps.placeholder}
                    error={emailError}
                />
                <InputField
                    id="password"
                    label={t('auth.passwordLabel')}
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('auth.passwordPlaceholder')}
                    error={passwordError}
                />
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="h-4 w-4 text-halal-green focus:ring-halal-green border-gray-300 rounded"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                            {t('auth.rememberMe')}
                        </label>
                    </div>

                    <div className="text-sm">
                        <button type="button" onClick={() => onNavigate('forgot-password')} className="font-medium text-halal-green hover:text-green-700">
                            {t('auth.forgotPassword')}
                        </button>
                    </div>
                </div>
                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-halal-green hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-halal-green disabled:opacity-50"
                    >
                         {loading && <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>}
                         {loading ? t('auth.loading') : t('auth.loginButton')}
                    </button>
                </div>
            </form>
            <p className="mt-8 text-center text-sm text-gray-600">
                {t('auth.noAccount')}{' '}
                <button onClick={() => onNavigate('register')} className="font-medium text-halal-green hover:text-green-700">
                    {t('auth.registerLink')}
                </button>
            </p>
        </div>
    );
};

export default LoginPage;