#! /usr/bin/env node
import { intro, outro, spinner, cancel, text, note } from '@clack/prompts';
import color from 'picocolors';
import crypto from 'crypto';
import Cryptr from 'cryptr';
import fetch from 'node-fetch';

async function main() {
	console.log();

	intro(color.inverse(' pky '));


	/**
	 * Package name
	 */
	const packageName = await text({
		message: 'Package name',
		placeholder: '@organization/package',
	});

	if (!packageName) {
		cancel('A package name is needed');
		return process.exit(0);
	}

	const organization = packageName?.split('/')[0];


	/**
	 * Token
	 */
	const provider = 'github';

	const providerToken = await text({
		message: 'GitHub token',
		placeholder: 'ghp_*********',
	});

	if (!providerToken) {
		cancel('A token is needed');
		return process.exit(0);
	}

	// Verify token is correct
	let verifyData;
	try {
		const verifyRequest = await fetch(`https://npm.pkg.github.com/${packageName}`, {
			headers: { Authorization: providerToken },
		});
	
		verifyData = await verifyRequest.json();
		if (verifyData?.name !== packageName) throw new Error()
	} catch (e) {
		cancel('The provider token is not valid for the package');
		return process.exit(0);
	}


	/**
	 * Encryption
	 */
	// Generate random token
	const randomToken = 'pky_' + crypto.randomBytes(16).toString('hex');
	const randomTokenHashed = crypto.createHash('sha256').update(randomToken).digest('hex');

	// Use randomToken to encrypt providerToken
	const cryptr = new Cryptr(randomToken);
	const encryptedProviderToken = cryptr.encrypt(providerToken);


	/**
	 * Sync with API
	 */
	const s = spinner();
	s.start('Uploading encrypted token');

	await fetch('https://api.pky.suchlab.com/v1/packages', {
		method: 'post',
		body: {
			provider,
			packageName,
			randomTokenHashed,
			encryptedProviderToken
		},
	});

	s.stop('Encrypted token uploaded!');


	/**
	 * Outro
	*/
	outro('Your package is now available!');


	/**
	 * Usage
	 */
	console.log('This is your .npmrc configuration:');
	console.log();
	console.log(`${organization}:registry=https://npm.pky.suchlab.com`);
	console.log(`//npm.pky.suchlab.com/:_authToken=${randomToken}`);
	console.log();
	console.log();
}

main().catch(console.error);
