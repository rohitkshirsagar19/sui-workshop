import React, { useState } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import {
  useSignAndExecuteTransaction,
  ConnectButton,
  useCurrentAccount
} from '@mysten/dapp-kit';
import { Package, Fingerprint, Image as ImageIcon, Loader2, Power } from 'lucide-react';

// Helper component for the status indicator
const StatusIndicator = () => (
  <div className="flex items-center gap-2">
    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
    <span className="text-xs text-green-400 tracking-wider">SYSTEM ONLINE</span>
  </div>
);

// Helper component for input fields with icons
const InputGroup = ({ icon: Icon, ...props }) => (
  <div className="relative">
    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
      <Icon className="w-4 h-4 text-neutral-500" />
    </div>
    <input
      {...props}
      className="w-full bg-neutral-800 border border-neutral-600 text-white placeholder-neutral-500 rounded-md h-10 pl-10 pr-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
    />
  </div>
);

const LoyaltyCardPage = () => {
  const currentAccount = useCurrentAccount();
  const [loading, setLoading] = useState(false);
  const [packageId, setPackageId] = useState('');
  const [mintForm, setMintForm] = useState({ customerId: '', imageUrl: '' });

  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const handleMintChange = (e) => {
    setMintForm({ ...mintForm, [e.target.name]: e.target.value });
  };

  const mintLoyalty = async () => {
    if (!currentAccount) {
      alert('Authentication required. Please connect your wallet.');
      return;
    }
    if (!packageId) {
      alert('Target Package ID is missing.');
      return;
    }
    try {
      setLoading(true);
      const tx = new Transaction();
      tx.moveCall({
        target: `${packageId}::loyalty_card::mint_loyalty`,
        arguments: [
          tx.pure.address(mintForm.customerId),
          tx.pure.string(mintForm.imageUrl)
        ]
      });
      
      await signAndExecute({ transaction: tx }, {
        onSuccess: () => {
          alert('Mission Successful: Asset minted to the SUI network.');
          setMintForm({ customerId: '', imageUrl: '' });
        },
        onError: (error) => {
          console.error('Minting operation failed:', error);
          alert(`Mission Failed: ${error.message}`);
        }
      });

    } catch (error) {
      console.error('Transaction construction failed:', error);
      alert(`Transaction Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-black text-white font-mono min-h-screen flex items-center justify-center p-4 bg-grid-pattern">
      <div className="w-full max-w-lg bg-neutral-900 border border-neutral-700 rounded-lg shadow-2xl shadow-orange-500/10 animate-fade-in relative overflow-hidden">
        {/* Decorative corner brackets */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-neutral-700"></div>
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-neutral-700"></div>
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-neutral-700"></div>
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-neutral-700"></div>

        <div className="p-8 space-y-8">
          <header className="flex justify-between items-center pb-4 border-b border-neutral-800">
            <h1 className="text-xl font-bold text-orange-500 tracking-wider uppercase">
               NFT Minter
            </h1>
            <StatusIndicator />
          </header>

          <section className="space-y-4">
            <h2 className="text-sm font-medium text-neutral-300 tracking-wider uppercase">1. AUTHENTICATION</h2>
            <p className="text-xs text-neutral-400">Secure your connection to the SUI network before proceeding.</p>
            <div className="flex justify-center">
              <ConnectButton />
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-medium text-neutral-300 tracking-wider uppercase">2. TARGET CONFIGURATION</h2>
            <div>
              <label htmlFor="packageId" className="block text-xs text-neutral-400 tracking-wider mb-2">Package ID</label>
              <InputGroup
                icon={Package}
                id="packageId"
                type="text"
                value={packageId}
                onChange={(e) => setPackageId(e.target.value)}
                placeholder="Enter Target Package ID"
              />
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-sm font-medium text-neutral-300 tracking-wider uppercase">3. ASSET DEPLOYMENT</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="customerId" className="block text-xs text-neutral-400 tracking-wider mb-2">Recipient Address</label>
                <InputGroup
                  icon={Fingerprint}
                  id="customerId"
                  type="text"
                  name="customerId"
                  value={mintForm.customerId}
                  onChange={handleMintChange}
                  placeholder="Enter Recipient SUI Address"
                />
              </div>
              <div>
                <label htmlFor="imageUrl" className="block text-xs text-neutral-400 tracking-wider mb-2">Asset Image URL</label>
                <InputGroup
                  icon={ImageIcon}
                  id="imageUrl"
                  type="text"
                  name="imageUrl"
                  value={mintForm.imageUrl}
                  onChange={handleMintChange}
                  placeholder="Enter Asset Image URL"
                />
              </div>
            </div>
            <button 
              onClick={mintLoyalty} 
              disabled={loading || !currentAccount || !packageId.trim() || !mintForm.customerId.trim() || !mintForm.imageUrl.trim()}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-4 rounded-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-orange-500 uppercase tracking-wider"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>EXECUTING...</span>
                </>
              ) : (
                <>
                  <Power className="w-4 h-4" />
                  <span>Initiate Mint</span>
                </>
              )}
            </button>
          </section>
        </div>
      </div>
    </main>
  );
};

export default LoyaltyCardPage;