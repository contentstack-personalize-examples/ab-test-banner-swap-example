# Contentstack Kickstart: Next.js SSR with Personalization

This Next.js SSR kickstart demonstrates a complete Contentstack implementation including:

- **Content Delivery**: SDK initialization and content fetching
- **Live Preview**: Real-time content editing and visual building
- **Personalization**: Dynamic content delivery with Contentstack Personalize
- **Launch Deployment**: Edge proxy support for Contentstack Launch hosting

> This example includes Contentstack Live Preview in SSR mode and full Personalize integration. Content updates trigger browser refreshes during live preview sessions, and personalized variants are delivered based on visitor attributes and experiences.

More details about this codebase can be found on the [Contentstack docs](https://www.contentstack.com/docs/developers).

[![Join us on Discord](https://img.shields.io/badge/Join%20Our%20Discord-7289da.svg?style=flat&logo=discord&logoColor=%23fff)](https://community.contentstack.com)

## How to get started

Before you can run this code, you'll need to import the included stack content into your Contentstack account.
This repository includes a complete stack export with content types, entries, and personalization configurations.

### Install the CLI

```bash
npm install -g @contentstack/cli
```

#### Using the CLI for the first time?

It might ask you to set your default region.
You can get all regions and their codes [here](https://www.contentstack.com/docs/developers/cli/configure-regions-in-the-cli) or run `csdx config:get:region`.

> Beware, Free Contentstack developer accounts are bound to the EU region. We still use the CDN the API is lightning fast.

Set your region like so:

```bash
csdx config:set:region EU
```

### Log in via the CLI

```bash
csdx auth:login
```

### Create a new stack

In your Contentstack dashboard:

1. Go to your Organization
2. Click **"Create Stack"**
3. Enter stack name: **"Kickstart Stack"** (or any name you prefer)
4. Choose your region
5. Click **"Create"**
6. Copy the **Stack API Key** (you'll need this for import)

### Import the stack content

This repository includes a complete stack export in the `/stack` directory. Import it using the [Contentstack CLI import command](https://www.contentstack.com/docs/developers/cli/import-content-using-the-cli):

```bash
csdx cm:stacks:import -k <YOUR_STACK_API_KEY> -d "./stack"
```

Replace `<YOUR_STACK_API_KEY>` with your actual Stack API Key.

> **What gets imported**: Content types, entries, assets, personalization configurations, environments, and all other stack modules needed for this example to work.

## Create a new delivery token.

Go to `Settings > Tokens` and create a delivery token. Select the `preview` scope and turn on `Create preview token`

## Configure environment variables

Create a `.env.local` file in your project root and add the following variables:

> You can find the API key, Delivery Token and Preview Token in Settings > Tokens > Your token.

```bash
# Contentstack Configuration
NEXT_PUBLIC_CONTENTSTACK_API_KEY=<YOUR_STACK_API_KEY>
NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN=<YOUR_DELIVERY_TOKEN>
NEXT_PUBLIC_CONTENTSTACK_PREVIEW_TOKEN=<YOUR_PREVIEW_TOKEN>
NEXT_PUBLIC_CONTENTSTACK_REGION=<YOUR_REGION>
NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT=preview
NEXT_PUBLIC_CONTENTSTACK_PREVIEW=true

# Personalization Configuration
NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_PROJECT_UID=<YOUR_PERSONALIZE_PROJECT_UID>
NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_EDGE_API_URL=https://personalize-edge.contentstack.com
```

### Finding your Personalize Project UID

1. Navigate to **Personalize** in your Contentstack dashboard
2. Select your project (created during import)
3. Click the **Settings** icon in the left navigation
4. In the **General** tab, copy the 24-character **Project UID**

## Turn on Live Preview

Go to Settings > Live Preview. Click enable and select the `Preview` environment in the drop down. Hit save.

## Install the dependencies

```bash
npm install
```

### Run your app

```bash
npm run dev
```

## Explore the features

### In the browser

Go to `http://localhost:3000` to see:

- **Home page**: Displays header, banner, and best sellers section
- **Dynamic pages**: Visit `/deals` to see the dynamic page system
- **Personalization**: Content variants delivered based on visitor behavior

### In the CMS

1. **Live Preview**: Go to Entries → Home Page → Live Preview icon in sidebar
2. **Visual Builder**: Edit content visually in real-time
3. **Personalization**: Navigate to Personalize to view experiences and variants
4. **Dynamic Content**: Check the "Deals" page entry to see modular block structure

## Deployment Options

### Vercel
- Uses `middleware.ts` for personalization
- Deploy with `vercel deploy`
- Set environment variables in Vercel dashboard

### Contentstack Launch
- Uses `/functions/[proxy].edge.js` for personalization
- Deploy through Contentstack Launch
- Configure environment variables in Launch project settings

## Learn More

- [PERSONALIZE_SETUP.md](./PERSONALIZE_SETUP.md) - Complete personalization implementation guide
- [Contentstack Personalize Documentation](https://www.contentstack.com/docs/personalize/)
- [Next.js Personalize Setup Guide](https://www.contentstack.com/docs/personalize/setup-nextjs-website-with-personalize-launch)
