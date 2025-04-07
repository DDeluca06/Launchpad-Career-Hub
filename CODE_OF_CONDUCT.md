# Code of Conduct for Pull Requests and Code Submissions

## Git Best Practices

### Branching Strategy
- Use feature branches for all new features and bug fixes
- Name branches with a prefix describing the type of work, followed by a brief description:
  - `feature/add-user-authentication`
  - `bugfix/fix-login-error`
  - `refactor/optimize-queries`

### Commit Guidelines
- Write clear, concise commit messages using present tense
- Structure commits as follows:
  ```
  <type>(<scope>): <subject>

  <body>

  <footer>
  ```
- Where:
  - `type`: feat, fix, docs, style, refactor, perf, test, chore
  - `scope`: optional area of the codebase affected
  - `subject`: brief description of the change
  - `body`: detailed explanation (optional)
  - `footer`: reference issues, breaking changes (optional)
- Keep commits atomic and focused on a single change
- Avoid mixing formatting changes with functional changes
- Aim for 50 characters or less in the subject line
- Wrap the body at 72 characters

### Examples of Good Commit Messages
```
feat(auth): implement JWT authentication

Add JWT-based authentication system with refresh tokens.
Includes middleware setup and token validation services.

Closes #123
```

```
fix(api): prevent race condition in user creation

Replace async calls with synchronous execution to ensure
proper state management during user creation.
```

## Pull Request Process

### Before Creating a PR
1. Ensure your code passes all CI checks locally:
   - `pnpm lint`
   - `pnpm type-check`
   - `pnpm build`
   - `pnpm test`

2. Rebase your branch on the latest main/development branch
3. Resolve any merge conflicts
4. Verify all tests pass on your updated branch

### PR Requirements
1. Create a descriptive title that summarizes the change
2. Fill out the PR template completely
3. Link relevant issues
4. Include screenshots or videos for UI changes
5. Tag appropriate reviewers
6. Ensure all CI checks pass

### PR Description Template
```
## Description
[Brief description of changes]

## Issue
Fixes #[issue-number]

## Type of change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## How Has This Been Tested?
[Describe testing approach]

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have added tests that prove my fix is effective or my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] I have updated the documentation accordingly
```

## Code Quality Requirements

### Linting and Formatting
- Run linting before creating a PR:
  ```
  pnpm lint
  ```
- Fix any linting issues:
  ```
  pnpm lint:fix
  ```
- For Next.js specific linting:
  ```
  pnpm next:lint
  ```

### TypeScript Type Checking
- Ensure all TypeScript code passes type checking:
  ```
  pnpm type-check
  ```
- Avoid using `any` type unless absolutely necessary
- Include proper JSDoc comments for functions and interfaces

### Build Verification
- Verify your changes build successfully:
  ```
  pnpm build
  ```
- Address any build warnings

## CI/CD Pipeline Requirements

All pull requests must pass the following CI checks before merging:

1. **Code Linting**: Ensures code follows project style guide
2. **Type Checking**: Verifies TypeScript types are valid
3. **Unit Tests**: All tests must pass
4. **Build Check**: Code must compile without errors
5. **Dependency Audit**: Security check for dependencies

## Merge Process

1. PR requires approval from at least one code owner
2. All CI checks must pass
3. No pending change requests
4. PR should be up to date with the target branch
5. Use "Squash and Merge" for feature branches to keep history clean
6. Use descriptive merge commit messages that summarize the feature or fix

## Working with pnpm

### Installation and Setup
- Install dependencies:
  ```
  pnpm install
  ```
- Add new dependencies:
  ```
  pnpm add <package-name>
  ```
- Add dev dependencies:
  ```
  pnpm add -D <package-name>
  ```

### Common Scripts
- Development server:
  ```
  pnpm dev
  ```
- Building for production:
  ```
  pnpm build
  ```
- Start production server:
  ```
  pnpm start
  ```

## Additional Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Angular Commit Message Guidelines](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#commit)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [pnpm Documentation](https://pnpm.io/motivation)