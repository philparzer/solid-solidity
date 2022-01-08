async function main() {
    const [owner, somebodyElse] = await hre.ethers.getSigners();
    const keyboardsContractFactory = await hre.ethers.getContractFactory("Keyboards");
    const keyboardsContract = await keyboardsContractFactory.deploy();
    
    await keyboardsContract.deployed();
    console.log("\nContract deployed to:", keyboardsContract.address);

    const keyboardTxn = await keyboardsContract.create(0, true, "sepia")
    await keyboardTxn.wait();
    console.log("\nKeyboard created");

    const keyboardTx2 = await keyboardsContract.connect(somebodyElse).create(1, false, "grayscale");
    await keyboardTx2.wait();
    console.log("\n2nd Keyboard created");


    console.log("\nWe got the keyboards!", await keyboardsContract.getKeyboards());
  }
  
  // We recommend this pattern to be able to use async/await everywhere
  // and properly handle errors.
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });