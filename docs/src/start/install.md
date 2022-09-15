# Installation

### 0) Prerequisites

- Ensure your system fulfills [the RedwoodJS prerequisites](https://redwoodjs.com/docs/quick-start).
- The [Stripe CLI](https://stripe.com/docs/stripe-cli)
- A Postgre database
  - If you plan to use [the provided `docker-compose.yml`](./docker-compose.yml) — ensure you have installed [Docker (Desktop)](https://www.docker.com/products/docker-desktop/)
  - See [the RedwoodJS documentation for a local Postgres setup](https://redwoodjs.com/docs/local-postgres-setup).

### 1) Copy the repository

You will need a copy of the Aether repository in order to start making modifications. The recommendation is to clone it to your local machine.

```bash
git clone https://github.com/LockTech/aether.git
```

### 2) Reset git history

Delete the `.git` directory, removing the Aether repository's history and reference.

```bash
rm -rf .git
```

Once deleted, you can initalize a new repository.

```bash
git init
```

### 3) Install dependencies

```bash
yarn install
```

### 4) Remove Aether's license

Aether is available under [the MIT license](https://github.com/LockTech/aether/blob/main/LICENSE) — you are under **zero** obligation to use the same license for your project, and are encouraged to delete Aether's before starting.

```bash
rm LICENSE
```
