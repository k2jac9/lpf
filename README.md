# LegalVerify - Blockchain-Verified Professional Reviews

A comprehensive platform for legal professionals to create verifiable reviews using Aptos and Stellar blockchain technology.

## Features

- **Blockchain Verification**: All reviews are cryptographically signed and stored on the blockchain
- **Multiple Wallet Support**: Supports Petra, Martian, Pontem, and Fewcha wallets for Aptos
- **Cross-Chain**: Works with both Aptos and Stellar networks
- **Professional Templates**: Specialized review templates for legal professionals
- **Immutable Records**: Once verified, reviews cannot be altered or deleted
- **Search & Filter**: Advanced search and filtering capabilities
- **Real-time Verification**: Instant verification of review authenticity

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A supported crypto wallet (Petra, Martian, Pontem, or Fewcha)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/legalverify.git
cd legalverify
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

### Demo Credentials

For the demo authentication:
- **Email**: jane.doe@legalfirm.com
- **Password**: password

## Environment Configuration

The application uses environment variables for configuration. Copy `.env.example` to `.env` and adjust the values:

```env
# Blockchain Configuration
VITE_APTOS_NODE_URL=https://fullnode.testnet.aptoslabs.com/v1
VITE_STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
VITE_REVIEW_REGISTRY_ADDRESS=0x1
VITE_DEFAULT_NETWORK=aptos
```

## Smart Contract Deployment

### Aptos Smart Contract

The project includes a Move smart contract (`src/contracts/ReviewRegistry.move`) that needs to be deployed to the Aptos blockchain.

1. Install the Aptos CLI:
```bash
curl -fsSL "https://aptos.dev/scripts/install_cli.py" | python3
```

2. Initialize your account:
```bash
aptos init
```

3. Fund your account (for testnet):
```bash
aptos account fund-with-faucet --account default
```

4. Deploy the contract:
```bash
aptos move publish --package-dir src/contracts/
```

5. Update the `VITE_REVIEW_REGISTRY_ADDRESS` in your `.env` file with the deployed contract address.

## Architecture

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Lucide React** for icons

### Blockchain Integration
- **Aptos TypeScript SDK** for Aptos blockchain interaction
- **Stellar SDK** for Stellar blockchain interaction
- **Wallet Adapters** for connecting to various wallets

### Key Components

1. **AuthContext**: Manages user authentication and session
2. **BlockchainContext**: Handles wallet connections and blockchain interactions
3. **ReviewContext**: Manages review creation, verification, and storage
4. **WalletConnectButton**: Universal wallet connection component

## Usage

### Creating a Review

1. Login to your account
2. Navigate to "Reviews" → "Create New Review"
3. Fill out the review form with:
   - Title and content
   - Category (Expert Testimony, Contract Review, etc.)
   - Jurisdiction and case information
   - Tags for searchability
4. Save as draft or submit for blockchain verification

### Verifying a Review

1. Go to the "Verification" page
2. Enter the transaction hash from a verified review
3. The system will query the blockchain and display verification status
4. View detailed transaction information including:
   - Transaction hash
   - Block height
   - Timestamp
   - Gas used

### Wallet Connection

1. Click "Connect Wallet" in the header
2. Choose your preferred wallet (Petra, Martian, Pontem, or Fewcha)
3. Approve the connection in your wallet
4. Switch between Aptos and Stellar networks as needed

## Development

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── layout/         # Layout components (Header, Footer, etc.)
│   ├── reviews/        # Review-specific components
│   ├── shared/         # Shared/common components
│   └── verification/   # Verification-related components
├── context/            # React contexts for state management
├── contracts/          # Smart contract source code
├── pages/              # Page components
├── types/              # TypeScript type definitions
└── App.tsx            # Main application component
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Testing Blockchain Functionality

The application includes fallback mechanisms for testing:

1. **Mock Transactions**: If the smart contract isn't deployed, the system will create mock transaction hashes
2. **Test Networks**: Uses testnet by default for safe testing
3. **Demo Data**: Includes sample reviews and user data for testing

## Troubleshooting

### Common Issues

1. **Wallet Connection Fails**
   - Ensure you have a supported wallet installed
   - Check that the wallet is unlocked
   - Try refreshing the page

2. **Transaction Fails**
   - Ensure you have sufficient funds for gas fees
   - Check that you're connected to the correct network
   - Verify the smart contract is deployed

3. **Environment Issues**
   - Check that all required environment variables are set
   - Ensure URLs are correct for your target network
   - Verify API endpoints are accessible

### Getting Help

- Check the browser console for detailed error messages
- Ensure your wallet is properly configured
- Verify network connectivity
- Check that environment variables are properly set

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Security

- Never commit private keys or sensitive information
- Use testnet for development and testing
- Review smart contract code before deployment
- Keep dependencies updated for security patches

## Support

For support, please open an issue on GitHub or contact the development team.