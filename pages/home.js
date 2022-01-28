import { useEffect, useState } from "react";
import { ThirdwebSDK } from "@3rdweb/sdk";
import { useEthers } from "@usedapp/core";
import Head from "next/head"

export default function Home(){
    return (
      <>
        <Head>
          <title>Proposal</title>
          <meta
            name="description"
            content="This Page Contains a Proposal for Coin Voting Platform"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <RenderAllNFTComponent/>
        <MintButton/>
      </>
    );
}
// A React component to render all nfts from the nft collection.
const RenderAllNFTComponent = () => {
  // React state for a list of nfts in the nft collection
  const [nfts, setNFTs] = useState([]);

  // get the web3 library from your installed web3 react library from step (2)
  const { library } = useEthers();

  useEffect(() => {
    // initialize the SDK and get the NFT Collection module
    // get the contract address (0x...) from your dashboard!
    const nft = new ThirdwebSDK(library.getSigner()).getNFTModule(
      "0x10a369CbBB59Fa4332F5D56059F7B30f45A9D10a"
    );

    // get all the NFTs including the owner from the nft collection.
    // Note: you can use async/await too!
    nft.getAllWithOwner().then((allNFTs) => setNFTs(allNFTs));
  }, [library]);

  // render the list of nfts
  return nfts.map((nft) => <p>Token Id: {nft.id}</p>);
};

// A React component of mint button that makes a backend server request.
const MintButton = () => {
  // get the connected wallet address from your installed web3 react library from step (2)
  const { account } = useEthers();

  const onMintHandler = async () => {
    // make a backend server api request to mint an NFT
    await fetch("/api/mint_sword", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ account }),
    });
  };

  // render the button to mint a sword NFT
  return <button onClick={onMintHandler}>Mint Sword NFT</button>;
};
