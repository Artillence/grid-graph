# Publishing Guide for dag-grid

## Pre-Publishing Checklist

- [x] README.md created with comprehensive documentation
- [x] LICENSE file added (MIT)
- [x] package.json updated with metadata (keywords, repository, homepage, etc.)
- [x] Build script tested and working
- [x] Types properly exported
- [x] Documentation site created and tested
- [x] GitHub Actions workflow configured for docs deployment

## Publishing to npm

### First Time Setup

1. Create an npm account at https://www.npmjs.com/signup if you don't have one
2. Login to npm from command line:
   ```bash
   npm login
   ```

### Publishing Steps

1. Ensure you're on the main branch with all changes merged:
   ```bash
   git checkout main
   git pull origin main
   ```

2. Update the version in package.json (follow semantic versioning):
   ```bash
   npm version patch  # For bug fixes (1.0.0 -> 1.0.1)
   npm version minor  # For new features (1.0.0 -> 1.1.0)
   npm version major  # For breaking changes (1.0.0 -> 2.0.0)
   ```

3. The build will run automatically due to `prepublishOnly` script, but you can verify:
   ```bash
   npm run build
   ```

4. Publish to npm:
   ```bash
   npm publish
   ```

5. Push the version tag to GitHub:
   ```bash
   git push --tags
   ```

## Deploying Documentation to GitHub Pages

The documentation is automatically deployed via GitHub Actions when changes are pushed to the main branch.

### Manual Deployment (if needed)

1. Go to repository Settings > Pages
2. Set Source to "GitHub Actions"
3. The workflow will run automatically on push to main

### Testing the Documentation Site Locally

```bash
cd examples/docs
npm install
npm run dev
```

Visit http://localhost:5173/dag-grid/

## Post-Publishing

After publishing:

1. Verify the package on npm: https://www.npmjs.com/package/dag-grid
2. Test installation in a new project:
   ```bash
   mkdir test-dag-grid
   cd test-dag-grid
   npm init -y
   npm install react react-dom dag-grid
   ```
3. Check that the documentation site is live: https://artillence.github.io/dag-grid

## Updating the Package

For future updates:

1. Make your changes
2. Update version: `npm version [patch|minor|major]`
3. Publish: `npm publish`
4. Push tags: `git push --tags`

## Version History

- 1.0.0 - Initial release with comprehensive documentation

## Notes

- The package uses Tailwind CSS 4.x as a dependency
- React 17+ and React DOM 17+ are peer dependencies
- TypeScript definitions are included
- CSS must be imported separately: `import 'dag-grid/styles.css'`
