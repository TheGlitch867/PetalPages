import { useEffect, useState } from "react";
import { GoogleSignInButton } from "../GoogleSignInButton/GoogleSignInButton";
import { useAuth } from "../../context/AuthContext";
import "./AuthDialog.css";

export type AuthMode = "signin" | "signup";

interface AuthDialogProps {
  isOpen: boolean;
  mode: AuthMode;
  onModeChange: (mode: AuthMode) => void;
  onClose: () => void;
}

function EmailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="m4 8 8 5 8-5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="5"
        y="11"
        width="14"
        height="10"
        rx="2"
        fill="currentColor"
        opacity="0.25"
      />
      <path
        d="M8 11V8a4 4 0 1 1 8 0v3"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <rect
        x="5"
        y="11"
        width="14"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
          stroke="currentColor"
          strokeWidth="1.8"
        />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 3l18 18M10.58 10.58A3 3 0 0 0 12 15a3 3 0 0 0 2.42-4.42M9.9 5.1A10.7 10.7 0 0 1 12 5c6.5 0 10 7 10 7a18.2 18.2 0 0 1-4.07 5.12M6.12 6.12A18.2 18.2 0 0 0 2 12s3.5 7 10 7a10.7 10.7 0 0 0 2.1-.21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function AuthDialog({
  isOpen,
  mode,
  onModeChange,
  onClose,
}: AuthDialogProps) {
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    setMessage(null);
  }, [isOpen, mode]);

  if (!isOpen) return null;

  const isSignIn = mode === "signin";
  const busy = submitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setSubmitting(true);

    if (isSignIn) {
      const result = await signIn(email.trim(), password);
      if (result.error) setError(result.error);
      else onClose();
    } else {
      const result = await signUp(email.trim(), password);
      if (result.error) setError(result.error);
      else {
        setMessage("Account created!");
        setTimeout(onClose, 1000);
      }
    }

    setSubmitting(false);
  };

  return (
    <div className="auth-dialog-backdrop" onClick={onClose}>
      <div
        className="auth-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-dialog-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="auth-dialog__close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        <h2 id="auth-dialog-title" className="auth-dialog__title">
          {isSignIn ? "Log In" : "Sign Up"}
        </h2>

        <div className="auth-dialog__stack">
          <GoogleSignInButton
            label={isSignIn ? "Sign in with Google" : "Sign up with Google"}
            disabled={busy}
            onSuccess={onClose}
            onError={setError}
          />

          <div className="auth-dialog__divider">
            <span>or</span>
          </div>

          <form className="auth-dialog__form" onSubmit={handleSubmit}>
            <label className="auth-dialog__field">
              <span className="auth-dialog__field-icon">
                <EmailIcon />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="Enter email"
              />
            </label>

            <label className="auth-dialog__field auth-dialog__field--password">
              <span className="auth-dialog__field-icon">
                <LockIcon />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete={isSignIn ? "current-password" : "new-password"}
                placeholder={isSignIn ? "Enter password" : "Create a password"}
              />
              <button
                type="button"
                className="auth-dialog__eye"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <EyeIcon open={showPassword} />
              </button>
            </label>

            {error && <p className="auth-dialog__error">{error}</p>}
            {message && <p className="auth-dialog__message">{message}</p>}

            <button
              type="submit"
              className="auth-dialog__submit"
              disabled={busy}
            >
              {busy ? "Please wait…" : isSignIn ? "Log In" : "Sign Up"}
            </button>
          </form>
        </div>

        <p className="auth-dialog__footer">
          {isSignIn ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            className="auth-dialog__footer-link"
            onClick={() => {
              onModeChange(isSignIn ? "signup" : "signin");
              setError(null);
              setMessage(null);
            }}
          >
            {isSignIn ? "Sign Up" : "Log In"}
          </button>
        </p>
      </div>
    </div>
  );
}
