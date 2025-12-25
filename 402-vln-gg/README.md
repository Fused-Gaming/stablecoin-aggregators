# Admin Dashboard - vln.gg

**Secure admin dashboard for managing stablecoin aggregator smart contracts**

Part of the [Stablecoin Aggregators](https://github.com/Fused-Gaming/stablecoin-aggregators) project.

## Deployment

- **Production**: [https://admin.vln.gg](https://admin.vln.gg)
- **Staging**: [https://402-vln-gg.vercel.app](https://402-vln-gg.vercel.app)

## Features

- Multi-layered security architecture
- Multi-factor authentication (MFA)
- Multi-admin approval workflows
- Real-time contract monitoring
- Vercel Analytics integration
- Progressive Web App (PWA) support

## Documentation

- [Security Architecture](docs/ADMIN_SECURITY.md)
- [Vercel Deployment Guide](docs/VERCEL_DEPLOYMENT.md)
- [Main Project Documentation](../README.md)

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Stack

- **Framework**: Next.js 16.1.0 (App Router)
- **React**: 19.2.3
- **TypeScript**: 5.x
- **Styling**: Tailwind CSS 4.x
- **Web3**: wagmi 3.x + viem 2.x
- **Database**: Prisma 7.x (PostgreSQL)
- **Analytics**: Vercel Analytics

## Subdomain Architecture

This admin dashboard is part of a 4-subdomain ecosystem:

1. **admin.vln.gg** - Admin Dashboard (THIS APP)
2. **402.vln.gg** - x402 Payment Gateway (Planned M5-M7)
3. **manage.vln.gg** - Internal Management (Planned M3-M4)
4. **swap.vln.gg** - Stablecoin Swap UI (Planned M8-M9)

## Security

- Environment-based authentication
- IP whitelisting support
- Rate limiting
- TOTP-based MFA
- JWT token management
- Security headers (CSP, HSTS, X-Frame-Options)
- Bot protection (robots.txt)

## License

MIT - see [LICENSE](../LICENSE)

## Built by

[Fused-Gaming](https://github.com/Fused-Gaming) using [Claude Code](https://claude.com/claude-code)
