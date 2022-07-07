# Marketplace

## About the project
- Developed an Ethereum DApp with frontend made using the Next.js framework, Tailwind CSS for styling and
smart contracts written using Solidity programming language.
- This dApp helps users to securely buy online courses which they can view only after admin activates their courses.
Only admin can activate, deactivate and verify the owner of a course.
- Users can interact with the blockchain using MetaMask wallet and the dapp is deployed on Ropsten Test Network
- To run it locally change the network to Ganache.

### Home Page
  <img src="/styles/images/im2.png" height="400" title="Home Page">    

### Marketplace
#### It allows to purchase courses only when a user is there and is connected to the right network. A walletbar to display the current price of ETH which gets updated every 10 seconds.
<img src="/styles/images/im3.png" height="400" title="Buy">
 <img src="/styles/images/im6.png" height="400" title="Buy">
  
#### Order Page to display all the purchased courses with their current status.
<img src="/styles/images/im10.png" height="500" title="Order Page">

#### Manage Page - of which only admin has the access. It is used to activate/deactivate any course and also to verify the owner. In case of deactivating any course, the amount after deducting the gas fee is returned to the owner of the course.
<img src="/styles/images/im5.png"  height="400" title="Manage Page">
<img src="/styles/images/im4.png" height="400" title="Manage Page">
 
####Order Modal to purchase the course and MetaMask for transactions.

  <img src="/styles/images/im7.png" height="400" title="Order Modal">

  <img src="/styles/images/im8.png"  height="400" title="MetaMask">


This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


