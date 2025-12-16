// src/components/proj/login.jsx
import { useState } from 'react';
import { auth, db } from '../../firebase.js';
import { useNavigate } from 'react-router-dom';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import './login.css';
import '../../App.css';
import { doc, setDoc } from 'firebase/firestore';

const googleProvider = new GoogleAuthProvider();



// ADD THIS FUNCTION — CALL IT AFTER EVERY LOGIN
const saveUserToFirestore = async (user) => {
  if (!user) return;
  
  try {
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email.toLowerCase(),
      uid: user.uid,
      displayName: user.displayName || user.email.split('@')[0],
      photoURL: user.photoURL || null,
      lastSeen: new Date()
    }, { merge: true });
  } catch (err) {
    console.error("Failed to save user:", err);
  }
};


function LoginForm({ onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      await saveUserToFirestore(auth.currentUser); // Save user info
      navigate('/proj/chatroom'); // Redirect on success
    } catch (err) {
      console.log(err);
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      await saveUserToFirestore(auth.currentUser); // Save user info
      // Auto-redirects after success
      navigate('/proj/chatroom');
    } catch (err) {
      setError('Google login failed');
      setLoading(false);
    }
  };

  return (
    <div className="login-form">
      <form className="auth-form" onSubmit={handleEmailLogin}>
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        {error && <p className="error-text">{error}</p>}
        <button type="submit" className="auth-btn" disabled={loading}>
          {loading ? 'Logging in...' : 'Login with Email'}
        </button>
      </form>

      <div style={{ margin: '20px 0', textAlign: 'center' }}>
        <p style={{ color: '#888' }}>or</p>
      </div>

      {/* GOOGLE LOGIN BUTTON */}
      <button 
        onClick={handleGoogleLogin} 
        disabled={loading}
        className='google-button'
      >
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" width="20" />
        Continue with Google
      </button>

      <p className="toggle-text" style={{ marginTop: '20px' }}>
        Not registered? <span onClick={onSwitchToRegister} className="toggle-link">Create an account</span>
      </p>
    </div>
  );
}



function RegisterForm({ onSwitchToLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert('Account created! You can now log in.');
      onSwitchToLogin(); // Switch back to login
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered');
      } else if (err.code === 'auth/weak-password') {
        setError('Password is too weak');
      } else {
        setError('Failed to create account');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <input 
        type="email" 
        placeholder="Email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required 
      />
      <input 
        type="password" 
        placeholder="Password (6+ chars)" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required 
      />
      <input 
        type="password" 
        placeholder="Confirm Password" 
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required 
      />
      
      {error && <p className="error-text">{error}</p>}
      
      <button type="submit" className="auth-btn" disabled={loading}>
        {loading ? 'Creating...' : 'Register'}
      </button>

      <div style={{ margin: '20px 0', textAlign: 'center' }}>
        <p style={{ color: '#888' }}>or</p>
      </div>

      <button 
        onClick={() => signInWithPopup(auth, googleProvider)}
        className='google-button'
      >
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" width="20" />
        Sign up with Google
      </button>

      <p className="toggle-text">
        Already have an account?{' '}
        <span onClick={onSwitchToLogin} className="toggle-link">
          Login here
        </span>
      </p>
    </form>
  );
}


export default function AuthPage() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Chatroom Project</h1>
        <h2>{showLogin ? 'Welcome Back!' : 'Join Us Today'}</h2>

        <div className="form-wrapper">
          {showLogin ? (
            <LoginForm onSwitchToRegister={() => setShowLogin(false)} />
          ) : (
            <RegisterForm onSwitchToLogin={() => setShowLogin(true)} />
          )}
        </div>
      </div>
    </div>
  );
}