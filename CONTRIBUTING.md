# Contributing to GRAVITAS

Thank you for your interest in contributing to GRAVITAS! We welcome contributions from the community to help improve this crime intelligence platform.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/GRAVITAS.git
   cd GRAVITAS
   ```
3. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   - Copy `.env.example` to `.env.local`
   - Add your Supabase credentials

3. **Start development server**:
   ```bash
   npm run dev
   ```

## Code Style

- Use **ESLint** for linting: `npm run lint`
- Format code with **Prettier**: `npm run format`
- Follow Next.js best practices and conventions

## Commit Guidelines

- Use clear, descriptive commit messages
- Reference issues when applicable: `Fix #123`
- Use conventional commits format: `feat:`, `fix:`, `docs:`, `refactor:`

## Testing

Please ensure any changes are properly tested:
- Write unit tests for new features
- Test locally before submitting PR
- Update tests if modifying existing functionality

## Submitting a Pull Request

1. **Push your branch** to your fork
2. **Create a Pull Request** with a clear title and description
3. **Link related issues** using `Closes #issue_number`
4. **Request review** from maintainers
5. **Address feedback** and make requested changes

## Code of Conduct

Please be respectful and constructive in all interactions. We're building a tool to help law enforcement, so let's maintain professional standards.

## Questions?

Feel free to open an issue or start a discussion if you have questions about contributing.

Happy coding! 🚀
