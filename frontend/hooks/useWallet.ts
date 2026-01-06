'use client';

import { useState, useEffect } from 'react';
import { getPublicFundingContract } from '@/lib/publicFundingContract';

export function useWallet() {
  const [account, setAccount] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthority, setIsAuthority] = useState(false);

  useEffect(() => {
    const connectWallet = async () => {
      // Wait for MetaMask to load
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            await checkRoles(accounts[0]);
          }
        } catch (err) {
          console.error("Error connecting to wallet:", err);
        }
      } else {
        console.log("MetaMask not detected");
      }
    };

    connectWallet();

    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          checkRoles(accounts[0]);
        } else {
          setAccount('');
          setIsAdmin(false);
          setIsAuthority(false);
        }
      });

      window.ethereum.on('chainChanged', () => {
        // Reload the page when chain changes
        window.location.reload();
      });
    }

    return () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        window.ethereum.removeAllListeners();
      }
    };
  }, []);

  const checkRoles = async (address: string) => {
    try {
      const contract = await getPublicFundingContract();
      const adminAddress = await contract.admin();
      const isAuth = await contract.authorities(address);

      setIsAdmin(adminAddress.toLowerCase() === address.toLowerCase());
      setIsAuthority(isAuth);
    } catch (err) {
      console.error("Error checking roles:", err);
    }
  };

  return { account, isAdmin, isAuthority };
}