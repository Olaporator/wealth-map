// ─── Plaid Link Hook ──────────────────────────────────────────────────────
// Wraps react-plaid-link with our API client for the full connect flow
import { useState, useCallback } from 'react';
import { usePlaidLink as usePlaidLinkSDK } from 'react-plaid-link';
import { api } from './api';

export function usePlaidLink({ onSuccess: onSuccessCallback, products } = {}) {
  const [linkToken, setLinkToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Step 1: Get a link token from our backend
  const generateToken = useCallback(async () => {
    setLoading(true);
    setError(null);
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

  // Step 2: Handle successful Plaid Link completion
  const onSuccess = useCallback(async (public_token, metadata) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.exchangeToken(public_token, metadata);
      console.log('Account linked:', result);

      // Trigger initial transaction sync
      await api.syncTransactions();

      if (onSuccessCallback) {
        onSuccessCallback(result);
      }
    } catch (err) {
      setError(err.message);
      console.error('Failed to exchange token:', err);
    } finally {
      setLoading(false);
    }
  }, [onSuccessCallback]);

  const onExit = useCallback((err) => {
    if (err) {
      setError(err.error_message || 'Link exited with error');
      console.error('Plaid Link exit error:', err);
    }
  }, []);

  // The actual Plaid Link hook
  const { open, ready } = usePlaidLinkSDK({
    token: linkToken,
    onSuccess,
    onExit,
  });

  // Combined open function: generate token then open
  const openLink = useCallback(async () => {
    if (!linkToken) {
      const token = await generateToken();
      if (token) {
        // Small delay to let the SDK initialize with the new token
        setTimeout(() => open(), 100);
      }
    } else {
      open();
    }
  }, [linkToken, generateToken, open]);

  return {
    openLink,
    ready: ready && !!linkToken,
    loading,
    error,
    generateToken,
  };
}
