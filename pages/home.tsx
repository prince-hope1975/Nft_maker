import { useEffect, useState } from "react";
import { ThirdwebSDK } from "@3rdweb/sdk";
import { useWeb3 } from "@3rdweb/hooks";
import { useEthers } from "@usedapp/core";
import axios  from "axios"
// import * as fs from "fs/promises"

import FormData  from "form-data"

import Head from "next/head";
const  Home =()=>{

  const [name, setName] = useState(null)
  const [key, setKey] = useState(null)

  const { connectWallet, address, error, provider } = useWeb3();
  console.log("👋 Address", address);

  const signer = provider ? provider.getSigner() : undefined;
  const pinFileToIPFS = (pinataApiKey, pinataSecretApiKey) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

    //we gather a local file for this example, but any valid readStream source will work here.
    let data = new FormData();
    data.append("file", fs.createReadStream("./pic.png"));

    //You'll need to make sure that the metadata is in the form of a JSON object that's been convered to a string
    //metadata is optional
    const metadata = JSON.stringify({
      name: name,
      keyvalues: {
        exampleKey: key,
      },
    });
    data.append("pinataMetadata", metadata);

    //pinataOptions are optional
    const pinataOptions = JSON.stringify({
      cidVersion: 0,
      customPinPolicy: {
        regions: [
          {
            id: "FRA1",
            desiredReplicationCount: 1,
          },
          {
            id: "NYC1",
            desiredReplicationCount: 2,
          },
        ],
      },
    });
    data.append("pinataOptions", pinataOptions);

    return axios
      .post(url, data, {
        maxBodyLength: "Infinity", //this is needed to prevent axios from erroring out with large files
        headers: {
          "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretApiKey,
        },
      })
      .then(function (response) {
        console.log("response", response)
        //handle response here
      })
      .catch(function (error) {
        //handle error here
      });
  };

  if (!address) {
    return (
      <div className="landing">
        Welcome!!!, Please mint an NFT 
        <button onClick={() => connectWallet("injected")} className="btn-hero">
          Connect Your Wallet
        </button>
      </div>
    );
  }

    return (
      <div>
        <Head>
          <title>Proposal</title>
          <meta
            name="description"
            content="This Page Contains a Proposal for Coin Voting Platform"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <form>
          <input type="text" onChange={(e) => setName(e.target.value)} />
          <input type="text" onChange={(e) => setKey(e.target.value)} />
        </form>

        <MintButton pinFileToIPFS={pinFileToIPFS} />
      </div>
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
    const nft = new ThirdwebSDK(library?.getSigner()).getNFTModule(
      "0x10a369CbBB59Fa4332F5D56059F7B30f45A9D10a"
    );

    // get all the NFTs including the owner from the nft collection.
    // Note: you can use async/await too!
    nft.getAllWithOwner().then((allNFTs) => setNFTs(allNFTs));
  }, [library]);

  // render the list of nfts
  return <>{nfts.map((nft) => <p>Token Id: {nft.id}</p>)}</>;
};

// A React component of mint button that makes a backend server request.
const MintButton = ({ pinFileToIPFS }) => {
  // get the connected wallet address from your installed web3 react library from step (2)
  const { account } = useEthers();

  const onMintHandler = async () => {
    const NftURL = await pinFileToIPFS(
      process.env.API_KEY,
      process.env.API_SECRET
    );
    // make a backend server api request to mint an NFT
    console.log(NftURL);
    // await fetch("/api/V1/mint", {

    //   method: "POST",
    //   headers: {
    //     "content-type": "application/json",
    //   },
    //   body: JSON.stringify({ account, NftURL  }),
    // });
  };

  // render the button to mint a sword NFT
  return <button onClick={onMintHandler}>Mint Sword NFT</button>;
};

//imports needed for this function

 ;
export default Home