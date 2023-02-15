# pky
Fine-grained access to GitHub packages

## The problem
GitHub Packages is awesome. You can publish private packages for you or your team to use.

However, for downloading the private packages, if you want to generate a token for your `.npmrc` files, you need to create a GitHub personal access token (classic).

The access token needs to have the `read:packages` permission. This permission lets download **all private packages**, not just one. It is not package-scoped.

The new [Fine-grained personal access tokens](https://github.blog/2022-10-18-introducing-fine-grained-personal-access-tokens-for-github/) does not have permissions for specific packages.

Therefore, if you want to generate a token to download a specific package, the token you have will be able to download **all** the packages you have access too.

## The solution
`pky` is a CLI tool lets you create package specific tokens. It works as a proxy for the GitHub Packages npm registry.

You can also use a custom domain for the registry.

## Usage
You can use `npx` to use `pky`, or install the tool globally (not recommended).

```
npx pky@latest

// or

npm i -g pky@latest
pky
```

### Add a package to the registry
First execute the command:
```
npx pky@latest
```

You will be prompted for two inputs:

1. **Package name:** Add the scoped package name (e.g. `@org/package`)
2. **GitHub personal access token:** Add the token with the `read:packages` permission

After checking that the token can successfully access the package, a `pky` token will be generated for that specific package.

You will now be able to create a `.npmrc` file with the following configuration:
```
@org:registry=https://npm.pky.suchlab.com
//npm.pky.suchlab.com/:_authToken=pky_21f38e6ca610a12baa280fe93770b5e2
```

### Various packages
You can have multiple `pky` packages in a project. Since each token has only access to a package, you can add various tokens in the `.npmrc` configuration by separating with a comma (`,`) the tokens.

Like this:
```
@org:registry=https://npm.pky.suchlab.com
//npm.pky.suchlab.com/:_authToken=pky_21f38e6ca610a12baa280fe93770b5e2,pky_9fcfd816e934f6d4eda43cf2f7734b18
```

### Vanity domains
If you want your own vanity domain (e.g. `registry.example.com`), you can do so!

You will be able to have this:
```
@org:registry=https://registry.example.com
//registry.example.com/:_authToken=pky_21f38e6ca610a12baa280fe93770b5e2
```

Contact me if you want to have a custom domain (email in the `package.json` file).

### Revoking a token
You can safely revoke a token from GitHub. This will make your `pky` token associated with that GitHub token invalid.

## Security
We recommend having one GitHub personal access token with the `read:packages` permission for each package. That way you can disable a GitHub token and all the `pky` tokens generated with the GitHub token will become unusable.

### Encryption
These are the steps that happen to ensure we can never access your GitHub tokens:
1. A random `pky` token is created on your machine when registering a package
2. Your GitHub personal access token is encrypted in your machine with the `pky` token
3. The encrypted version of your personal GitHub token is uploaded and saved in our database
4. When requesting a package with a valid `pky` token, the `pky` token decrypts the GitHub token to be used in order to access the package

## Analytics
Although it is interesting, we haven't developed any form of tracking the number of downloads for packages.

We might offer analytics in the future, but we will ask beforehand in a prompt if you want to activate them.

## People
The original author of `pky` is [itaibo](https://github.com/itaibo)

You can contribute too!
