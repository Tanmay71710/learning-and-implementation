# Git Branch Strategy

This document outlines the git branch strategy for the multi-environment setup of the Script Execution Manager project.

## Branch Structure

The project uses a simplified GitFlow-inspired branch strategy with four main branches:

### Main Branches

1. **master** - Production branch
   - Corresponds to the production environment
   - Only production-ready code is merged here
   - Tags are created from this branch for releases
   - Protected branch requiring pull request reviews

2. **staging** - Staging branch
   - Corresponds to the staging environment
   - Pre-production testing happens here
   - Code is promoted from develop to staging after testing
   - Protected branch requiring pull request reviews

3. **pub/dev** - Public Development branch
   - Corresponds to the public development environment
   - Features that need external testing are merged here
   - Used for beta testing and customer demos
   - Protected branch requiring pull request reviews

4. **develop** - Development branch
   - Corresponds to the development environment
   - Main development branch for new features
   - All feature branches are merged into develop
   - Default branch for development work

### Supporting Branches

- **feature/*** - Feature branches
  - Created from develop branch
  - Named as `feature/description` or `feature/ticket-number-description`
  - Merged back into develop via pull request
  - Deleted after merge

- **bugfix/*** - Bug fix branches
  - Created from develop branch (or appropriate environment branch)
  - Named as `bugfix/description` or `bugfix/ticket-number-description`
  - Merged back to the branch of origin
  - Deleted after merge

- **hotfix/*** - Hotfix branches
  - Created from master branch for production emergencies
  - Named as `hotfix/description` or `hotfix/ticket-number-description`
  - Merged to master and then back to develop
  - Deleted after merge

## Branch to Environment Mapping

| Git Branch | Environment | Deployment Trigger | Purpose |
|------------|-------------|-------------------|---------|
| `master` | production | Push to master | Production deployments |
| `staging` | staging | Push to staging | Staging deployments |
| `pub/dev` | pub-dev | Push to pub/dev | Public development deployments |
| `develop` | dev | Push to develop | Development deployments |

## Workflow

### Feature Development Workflow

1. **Create feature branch**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **Make changes and commit**
   ```bash
   git add .
   git commit -m "Add your feature"
   ```

3. **Push and create pull request**
   ```bash
   git push -u origin feature/your-feature-name
   # Create PR to develop branch on GitHub
   ```

4. **Code review and testing**
   - Get PR approval from team members
   - Ensure CI/CD checks pass
   - Test in development environment

5. **Merge to develop**
   - Merge PR to develop branch
   - Delete feature branch

### Environment Promotion Workflow

1. **Development → Staging**
   ```bash
   # When feature is ready for staging
   git checkout staging
   git pull origin staging
   git merge develop
   git push origin staging
   # Create PR from develop to staging on GitHub
   ```

2. **Staging → Public Development**
   ```bash
   # When feature is ready for public testing
   git checkout pub/dev
   git pull origin pub/dev
   git merge staging
   git push origin pub/dev
   # Create PR from staging to pub/dev on GitHub
   ```

3. **Public Development/Staging → Production**
   ```bash
   # When feature is ready for production
   git checkout master
   git pull origin master
   git merge staging  # or pub/dev
   git push origin master
   # Create PR from staging/pub/dev to master on GitHub
   ```

### Hotfix Workflow

1. **Create hotfix branch from master**
   ```bash
   git checkout master
   git pull origin master
   git checkout -b hotfix/critical-fix
   ```

2. **Make emergency fix**
   ```bash
   # Make changes
   git add .
   git commit -m "Fix critical issue"
   ```

3. **Merge to master and deploy**
   ```bash
   git checkout master
   git merge hotfix/critical-fix
   git push origin master
   # This triggers production deployment
   ```

4. **Back-merge to develop**
   ```bash
   git checkout develop
   git merge hotfix/critical-fix
   git push origin develop
   ```

5. **Clean up**
   ```bash
   git branch -d hotfix/critical-fix
   git push origin --delete hotfix/critical-fix
   ```

## CI/CD Integration

The GitHub Actions workflow automatically deploys to environments based on branch:

- **Push to `develop`** → Deploys to dev environment
- **Push to `staging`** → Deploys to staging environment
- **Push to `pub/dev`** → Deploys to pub-dev environment
- **Push to `master`** → Deploys to production environment

### Manual Deployment

For manual deployment to specific environments:

1. Go to Actions tab in GitHub
2. Select "Build and Push Docker Image to Artifactory"
3. Click "Run workflow"
4. Select target environment (dev, staging, pub-dev, production)
5. Configure deployment options
6. Run workflow

## Branch Protection Rules

### Recommended Protection Settings

**master branch:**
- Require pull request reviews before merging
- Require approval from 1 reviewer
- Dismiss stale PR approvals when new commits are pushed
- Require status checks to pass before merging
- Require branches to be up to date before merging
- Do not allow bypassing the above settings

**staging branch:**
- Require pull request reviews before merging
- Require approval from 1 reviewer
- Require status checks to pass before merging
- Require branches to be up to date before merging

**pub/dev branch:**
- Require pull request reviews before merging
- Require approval from 1 reviewer
- Require status checks to pass before merging

**develop branch:**
- Optional: Require pull request reviews
- Recommended for team collaboration

## Release Management

### Version Tags

Create tags on the master branch for releases:

```bash
# Format: v1.0.0, v1.1.0, v2.0.0, etc.
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

### Release Process

1. Ensure all testing is complete in staging
2. Merge staging to master
3. Create version tag on master
4. Deploy to production (automatic or manual)
5. Create GitHub Release from the tag
6. Back-merge to develop if needed

## Best Practices

### Branch Naming

- Use descriptive names: `feature/user-authentication`, `bugfix/login-issue`
- Include ticket numbers if applicable: `feature/PROJ-123-add-api`
- Use lowercase with hyphens or slashes
- Keep names concise but descriptive

### Commit Messages

Follow conventional commit format:
```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
- `feat(auth): add OAuth2 authentication`
- `fix(api): resolve null pointer exception`
- `docs(readme): update installation instructions`

### Pull Request Guidelines

1. **Title**: Clear and descriptive
2. **Description**: Explain what and why
3. **Testing**: Describe testing performed
4. **Screenshots**: Add for UI changes
5. **Checklist**: 
   - Code follows style guidelines
   - Self-reviewed the code
   - Commented complex code
   - Updated documentation
   - No new warnings
   - Added tests
   - All tests pass

### Merge Guidelines

- **Squash merge** for feature branches
- **Merge commit** for environment promotions
- **Rebase** only for local cleanup
- Never force push to shared branches

## Troubleshooting

### Common Issues

**Branch out of sync:**
```bash
git fetch origin
git rebase origin/branch-name
```

**Merge conflicts:**
```bash
# Resolve conflicts manually
git add .
git commit
git push
```

**Wrong branch committed:**
```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1
# Or undo last commit (discard changes)
git reset --hard HEAD~1
```

**Accidental commit to wrong branch:**
```bash
# Create new branch from current state
git checkout -b correct-branch-name
# Reset original branch
git checkout wrong-branch
git reset --hard origin/wrong-branch
```

## Git Configuration

### Recommended Aliases

Add to your `.gitconfig`:
```bash
[alias]
    st = status
    co = checkout
    br = branch
    ci = commit
    unstage = reset HEAD --
    last = log -1 HEAD
    visual = log --graph --oneline --all --decorate
```

### Useful Commands

```bash
# See branch history
git log --graph --oneline --all

# Compare branches
git diff master..develop

# See files changed between branches
git diff --name-only master..develop

# Find which branch contains a commit
git branch --contains <commit-hash>

# Clean up merged branches
git branch --merged | grep -v "\*" | xargs git branch -d
```

## Integration with Tools

### ArgoCD Integration

Each environment has its own ArgoCD application configuration:
- `environments/dev/argocd-application.yaml` → Tracks develop branch
- `environments/staging/argocd-application.yaml` → Tracks staging branch
- `environments/pub-dev/argocd-application.yaml` → Tracks pub/dev branch
- `environments/production/argocd-application.yaml` → Tracks master branch

### GitHub Actions Integration

The CI/CD pipeline uses branch names to determine deployment targets automatically.

## Support

For questions about the git workflow:
- Refer to this documentation
- Contact the DevOps team
- Review GitHub repository settings
- Check pull request templates (if configured)

## References

- [GitFlow Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Multi-Environment Setup](MULTI_ENVIRONMENT_SETUP.md)