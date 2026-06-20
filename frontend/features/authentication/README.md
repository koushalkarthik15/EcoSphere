# Authentication Feature Module

This module manages client-side authentication, login interfaces, role management, and navigation routing guards.

## 📂 Folders

- **`components/`**: Google Identity login/logout buttons and authorization redirect screen overlays.
- **`hooks/`**: Custom hooks for validating login state, managing OAuth access tokens, and fetching user scope claims.
- **`services/`**: Next.js auth middleware wrappers and Google Identity token verification adapters.
- **`types/`**: Types defining Google user profiles, login scopes, authentication state, and token lifespans.
- **`utils/`**: Utilities for parsing JWT claims and securing client cookie/session storage.
