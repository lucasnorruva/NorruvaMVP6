import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { DPP_TOKEN_ADDRESS } from '/workspace/digital-product-passport/src/config/contractAddresses'; // Use absolute path

// Replace with the actual contract ABI
const dppTokenAbi = []; 

const dppTokenAddress = DPP_TOKEN_ADDRESS; // Use the placeholder address for now

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      // This is a simplified example.
      // In a real implementation:
      // 1. Securely load the private key or use a more robust signing mechanism.
      // 2. Connect to a blockchain provider using an RPC URL (ideally from environment variables).
      // 3. Ensure proper error handling and transaction status tracking.

      const providerUrl = process.env.RPC_URL || 'http://127.0.0.1:8545'; // Use a default or env var
      const provider = new ethers.JsonRpcProvider(providerUrl);

      // WARNING: Storing private keys directly in environment variables is not recommended for production.
      // Consider using a key management system.
      const signer = new ethers.Wallet(process.env.PRIVATE_KEY || '', provider); // Load private key from env var

      const dppToken = new ethers.Contract(dppTokenAddress, dppTokenAbi, signer);

      const { recipient, metadataHash } = req.body;

      if (!recipient || !metadataHash) {
        return NextResponse.json({ error: 'Recipient and metadataHash are required' }, { status: 400 });
      }

      console.log(`Attempting to mint DPP for recipient: ${recipient} with metadataHash: ${metadataHash} using contract at ${dppTokenAddress}`);

      // Call the mint function on the contract
      const tx = await dppToken.mint(recipient, metadataHash);
      await tx.wait(); // Wait for the transaction to be mined

      return NextResponse.json({ message: 'DPP minted successfully', transactionHash: tx.hash }, { status: 200 });
    } catch (error) {
      console.error('Error minting DPP:', error);
      res.status(500).json({ error: 'Failed to initiate minting process' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}