// ─── Plaid Link Hook ──────────────────────────────────────────────────────
// Wraps react-plaid-link with our API client for the full connect flow
// Supports both normal link and "update mode" for re-authenticating existing items
import { useState, useCallback, useEffect } from 'react';
import { usePlaidLink as usePlaidLinkSDK } from 'react-plaid-link';
import { api } from './api';

export function usePlaidLink({ onSuccess: onSuccessCallback, products } = {}) {
  const [linkToken, setLinkToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reauthItemId, setReauthItemId] = useState(null);

  // Step 1: Get a link token from our backend (normal mode)
  const generateToken = useCallback(async () => {
    setLoading(true);
    setError(null);
    setReauthItemId(null);
    try {
      const data = await api.createLinkToken(products);
      setLinkToken(data.link_token);
      return data.link_token;
    } catch (err) {
      setError(err.message);
      console.error('Failed to create link token:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [products]);

  // Step 1b: Get an update-mode link token for re-auth
  const generateReauthToken = useCallback(async (item_id) => {
    setLoading(true);
    setError(null);
    setReauthItemId(item_id);
    try {
      const data = await api.getReauthToken(item_id);
      setLinkToken(data.link_token);
      return data.link_token;
    } catch (err) {
      setError(err.message);
      console.error('Failed to create reauth token:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Step 2: Handle successful Plaid Link completion
  const onSuccess = useCallback(async (public_token, metadata) => {
    setLoading(true);
    setError(null);
    try {
      if (reauthItemId) {
        // Update mode — just mark the item as active again and sync
        await api.fixItem(reauthItemId);
        await api.syncTransactions();
      } else {
        // Normal mode — exchange token and sync
        const result = await api.exchangeToken(public_token, metadata);
        console.log('Account linked:', result);
        await api.syncTransactions();
      }

      if (onSuccessCallback) {
        onSuccessCallback();
      }
    } catch (err) {
      setError(err.message);
      console.error('Failed to complete Plaid Link:', err);
    } finally {
      setLoading(false);
      setReauthItemId(null);
      setLinkToken(null);
    }
  }, [onSuccessCallback, reauthItemId]);

  const onExit = useCallback((err) => {
    if (err) {
      setError(err.error_message || 'Link exited with error');
      console.error('Plaid Link exit error:', err);
    }
    setReauthItemId(null);
  }, []);

  // The actual Plaid Link hook
  const { open, ready } = usePlaidLinkSDK({
    token: linkToken,
    onSuccess,
    onExit,
  });

  // Auto-open when token is set (for both new link and reauth)
  const [pendingOpen, setPendingOpen] = useState(false);
  useEffect(() => {
    if (pendingOpen && ready && linkToken) {
      open();
      setPendingOpen(false);
    }
  }, [pendingOpen, ready, linkToken, open]);

  // Combined open function: generate token then open
  const openLink = useCallback(async () => {
    const token = await generateToken();
    if (token) {
      setPendingOpen(true);
    }
  }, [generateToken]);

  // Re-auth: generate update-mode token then open
  const openReauth = useCallback(async (item_id) => {
    const token = await generateReauthToken(item_id);
    if (token) {
      setPendingOpen(true);
    }
  }, [generateReauthToken]);

  return {
    openLink,
    openReauth,
    ready: ready && !!linkToken,
    loading,
    error,
    generateToken,
  };
}
