import React, { useState } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import {
  useSignAndExecuteTransaction,
  ConnectButton,
  useCurrentAccount
} from '@mysten/dapp-kit';

const LoyaltyCardPage = () => {
  const currentAccount = useCurrentAccount();
  const [loading, setLoading] = useState(false);
  const [packageId, setPackageId] = useState('');

  // Form states
  const [mintForm, setMintForm] = useState({
    customerId: '',
    imageUrl: ''
  });

  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const handleMintChange = (e) => {
    setMintForm({ ...mintForm, [e.target.name]: e.target.value });
  };

  // Action: mint a new Loyalty card
  const mintLoyalty = async () => {
    if (!currentAccount) {
      alert('Please connect your wallet');
      return;
    }
    if (!packageId) {
      alert('Please provide a Package ID');
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
      
      // Using the new promise-based syntax for signAndExecute
      await signAndExecute({ transaction: tx }, {
        onSuccess: () => {
          alert('Mint successful!');
          setMintForm({ customerId: '', imageUrl: '' });
        },
        onError: (error) => {
          console.error('Error minting loyalty card:', error);
          alert(`Minting failed: ${error.message}`);
        }
      });

    } catch (error) {
      console.error('Error constructing transaction:', error);
      alert(`Transaction construction failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-black text-white font-mono min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-neutral-900 border border-neutral-700 rounded-lg p-6 space-y-8 shadow-lg">
        
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-orange-500 tracking-wider uppercase">
            Tactical NFT Minter
          </h1>
          <p className="text-sm text-neutral-400">Mint a classified Loyalty Card asset on the SUI Network.</p>
          <div className="flex justify-center pt-2">
            <ConnectButton />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="packageId" className="block text-xs text-neutral-400 tracking-wider mb-2 uppercase">Package ID</label>
            <input
              id="packageId"
              type="text"
              value={packageId}
              onChange={(e) => setPackageId(e.target.value)}
              placeholder="Enter Target Package ID"
              className="w-full bg-neutral-800 border border-neutral-600 text-white placeholder-neutral-500 rounded-md h-10 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
            />
          </div>
        </div>

        {/* Mint Loyalty Card */}
        <section className="space-y-6 border-t border-neutral-700 pt-6">
          <h2 className="text-sm font-medium text-neutral-300 tracking-wider text-center uppercase">Asset Creation Protocol</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="customerId" className="block text-xs text-neutral-400 tracking-wider mb-2 uppercase">Recipient Address</label>
              <input
                id="customerId"
                type="text"
                name="customerId"
                value={mintForm.customerId}
                onChange={handleMintChange}
                placeholder="Enter Customer SUI Address"
                className="w-full bg-neutral-800 border border-neutral-600 text-white placeholder-neutral-500 rounded-md h-10 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
              />
            </div>
            <div>
              <label htmlFor="imageUrl" className="block text-xs text-neutral-400 tracking-wider mb-2 uppercase">Asset Image URL</label>
              <input
                id="imageUrl"
                type="text"
                name="imageUrl"
                value={mintForm.imageUrl}
                onChange={handleMintChange}
                placeholder="Enter Asset Image URL"
                className="w-full bg-neutral-800 border border-neutral-600 text-white placeholder-neutral-500 rounded-md h-10 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
              />
            </div>
          </div>
          <button 
            onClick={mintLoyalty} 
            disabled={
              loading || 
              !mintForm.customerId.trim() || 
              !mintForm.imageUrl.trim() ||
              !packageId.trim()
            }
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-4 rounded-md transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-orange-500 uppercase tracking-wider"
          >
            {loading ? 'Executing...' : 'Mint Asset'}
          </button>
        </section>
      </div>
    </main>
  );
};

export default LoyaltyCardPage;