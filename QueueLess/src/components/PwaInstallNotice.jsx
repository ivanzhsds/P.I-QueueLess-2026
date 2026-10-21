import { useEffect, useState } from 'react';

const DISMISSED_SESSION_KEY = 'cuida-pwa-install-dismissed';

let deferredInstallPrompt = null;
const installPromptSubscribers = new Set();

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    installPromptSubscribers.forEach((subscriber) => subscriber(event));
  });
}

function isPwaInstalled() {
  return window.matchMedia('(display-mode: standalone)').matches
    || window.navigator.standalone === true;
}

function wasDismissedThisSession() {
  try {
    return window.sessionStorage.getItem(DISMISSED_SESSION_KEY) === 'true';
  } catch {
    return false;
  }
}

function rememberDismissal() {
  try {
    window.sessionStorage.setItem(DISMISSED_SESSION_KEY, 'true');
  } catch {
    // The component state still prevents repeated prompts during this app session.
  }
}

export default function PwaInstallNotice() {
  const [installed, setInstalled] = useState(isPwaInstalled);
  const [dismissed, setDismissed] = useState(wasDismissedThisSession);
  const [installPrompt, setInstallPrompt] = useState(() => deferredInstallPrompt);
  const [installMessage, setInstallMessage] = useState('');

  useEffect(() => {
    function handleAppInstalled() {
      setInstalled(true);
      deferredInstallPrompt = null;
      setInstallPrompt(null);
      setInstallMessage('');
      setDismissed(false);
    }

    function handleInstallPrompt(event) {
      setInstallPrompt(event);
      setInstallMessage('');
    }

    installPromptSubscribers.add(handleInstallPrompt);
    if (deferredInstallPrompt) handleInstallPrompt(deferredInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      installPromptSubscribers.delete(handleInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  async function handleInstall() {
    if (installed) {
      setInstallMessage('O Cuida+ já está instalado neste dispositivo.');
      return;
    }

    if (!installPrompt) {
      setInstallMessage('A instalação não está disponível neste momento neste navegador.');
      return;
    }

    const promptEvent = installPrompt;
    deferredInstallPrompt = null;
    setInstallPrompt(null);
    setInstallMessage('');

    try {
      await promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      if (outcome === 'accepted') {
        setInstalled(true);
        setDismissed(true);
        rememberDismissal();
      } else {
        setInstallMessage('A instalação foi cancelada.');
      }
    } catch (error) {
      console.error('Não foi possível abrir o prompt de instalação do Cuida+.', error);
      setInstallMessage('A instalação não está disponível neste momento neste navegador.');
    }
  }

  function handleDismiss() {
    setDismissed(true);
    rememberDismissal();
  }

  if (dismissed && !installed) return null;

  return (
    <aside className="pwa-install-notice" aria-labelledby="pwa-install-title">
      <img className="pwa-install-icon" src="/cuida-logo.svg" alt="" />
      <div className="pwa-install-copy">
        <h2 id="pwa-install-title">Instale o Cuida+</h2>
        <p>Tenha seu aplicativo sempre à mão.</p>
        {(installed || installMessage) && (
          <p className="pwa-install-help" role="status">
            {installed ? 'O Cuida+ já está instalado neste dispositivo.' : installMessage}
          </p>
        )}
      </div>
      <div className="pwa-install-actions">
        {!installed && (
          <button className="pwa-install-button" type="button" onClick={handleInstall}>
            Instalar
          </button>
        )}
        <button
          className="pwa-dismiss-button"
          type="button"
          onClick={handleDismiss}
          aria-label="Fechar aviso de instalação"
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>
    </aside>
  );
}
