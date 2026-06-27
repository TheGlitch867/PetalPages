import { useAuth } from "../context/AuthContext";
import { PageBackground } from "../components/PageBackground/PageBackground";
import "./AccountPage.css";

function AccountPanel({ children }: { children: React.ReactNode }) {
  return (
    <PageBackground pageId="account" className="account-page">
      <div className="account account-page__panel">{children}</div>
    </PageBackground>
  );
}

export function AccountPage() {
  const { user, cloudConfigured, signOut } = useAuth();

  if (!cloudConfigured) {
    return (
      <AccountPanel>
        <h2 className="account__title">Cloud save</h2>
        <p className="account__text">
          Cloud sync is not configured yet. Add your Firebase credentials to a{" "}
          <code>.env</code> file (see <code>.env.example</code>).
        </p>
        <p className="account__text">
          Until then, your data is saved locally on this device only.
        </p>
      </AccountPanel>
    );
  }

  if (!user) {
    return (
      <AccountPanel>
        <h2 className="account__title">Account</h2>
        <p className="account__text">
          Use the <strong>Log in</strong> or <strong>Sign up</strong> buttons in
          the top bar to save your progress online.
        </p>
      </AccountPanel>
    );
  }

  return (
    <AccountPanel>
      <h2 className="account__title">Account</h2>
      <p className="account__signed-in">
        Signed in as <strong>{user.email}</strong>
      </p>
      <p className="account__text">
        Your mood and anxiety entries sync to the cloud automatically.
      </p>
      <button
        type="button"
        className="account__button account__button--secondary"
        onClick={() => signOut()}
      >
        Sign out
      </button>
    </AccountPanel>
  );
}
