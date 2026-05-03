# AuctionHouse

**[AuctionHouse](https://sp2resit.netlify.app/)** is a student-only online auction platform where registered users can list items for bidding, place bids using virtual credits, and manage their profiles. Every new user starts with 1000 credits to use for bidding, and can earn more by selling their own items. Visitors can browse and search listings freely, but placing bids and creating listings requires a registered `@stud.noroff.no` account.

## Features

- **Browse & Search:** Anyone can browse and search through active listings without an account.
- **Auction System:** Registered users can place bids on listings using virtual credits.
- **Listing Management:** Create, edit, and delete your own listings with images, descriptions, and deadlines.
- **Profile Management:** Update your avatar, banner, and bio. View your credits, your listings, and your bid history.
- **Credits Display:** Your current credit balance is visible in the navbar at all times when logged in.
- **Responsive Design:** Clean, modern UI that works across desktop and mobile devices.

## Built With

- **Vanilla JavaScript** — Core logic, API integration, and DOM manipulation.
- **Tailwind CSS v4** — Responsive and modern styling.
- **Noroff Auction API V2** — Back-end data handling and authentication.

## Getting Started

Follow these steps to set up and run the project locally:

1. Clone the repository:

```bash
git clone https://github.com/ziconstr/SP2Resit.git
```

2. Navigate into the project folder:

```bash
cd SP2Resit
```

3. Install dependencies:

```bash
npm install
```

4. Start Tailwind in watch mode:

```bash
npm run watch
```

5. Open `index.html` in your browser using a local server (e.g. Live Server in VS Code).

## Deployment

The project is deployed via Netlify with automatic deploys connected to the GitHub repository.

**Live site:** [https://sp2resit.netlify.app](https://sp2resit.netlify.app)

## API

This project uses the [Noroff Auction API V2](https://docs.noroff.dev/docs/v2/auction-house/listings). Authentication is handled via JWT tokens and an API key stored in request headers.
