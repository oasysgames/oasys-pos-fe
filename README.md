This is frontend tool which can execute oasys-cli command(https://github.com/oasysgames/oasys-pos-cli).

# Setup
## Getting Started

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Create contract type
This project manages contract type by using [typechain](https://github.com/dethcrypto/TypeChain).
If you set new L1 contract abi.json at `src/contracts/abi.json`, you should execute the following command.
```bash
yarn typechain
```

# Directory structure(`/src`)
## `/components`
This directory has components which are used in pages.
This components are managed according to [Atomic Design](https://atomicdesign.bradfrost.com/chapter-2/).

- atoms
- molecules
- organisms
- templates

## `/consts`
This directory has constants which are used in this project.

## `/contracts`
This directory has contract abi.json.
This file is used for the following purpose.

- execute contract function
- use bytecode of contract

## `/features`
This directory has common function using this project.

And this directory has the following sub directory.

- `/oasysHub` has functions which are used for L1 contract.
- `/optimisms` has functions which are used for Optimisms(verse layer).
- `/smock` has functions which are used at `/optimisms`.

## `/hooks`
This directory has custom hooks which are used in this project.

## `/pages`
This directory has pages which are used in this project.

## `/types`
This directory has types which are used in this project.
