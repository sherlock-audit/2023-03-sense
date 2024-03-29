const { getDeployedAdapters } = require("../../hardhat.utils");
const { OZ_RELAYER } = require("../../hardhat.addresses");
const log = console.log;

module.exports = async function () {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const signer = await ethers.getSigner(deployer);
  const chainId = await getChainId();

  const divider = await ethers.getContract("Divider", signer);

  log("\n-------------------------------------------------------");
  log("\nDeploy the EmergencyStop");
  const { address: emergencyAddress } = await deploy("EmergencyStop", {
    from: deployer,
    args: [divider.address],
    log: true,
  });

  const emergency = await ethers.getContract("EmergencyStop", signer);
  log("Trust the emergency address on the divider");
  if (!(await divider.isTrusted(emergencyAddress))) {
    await (await divider.setIsTrusted(emergencyAddress, true)).wait();

    log("Can call stop");
    const adapters = await getDeployedAdapters();
    await emergency.callStatic.stop(Object.values(adapters));
  }

  log("Trust the OZ Defender Relay address on the emergency stop contract");
  if (!(await emergency.isTrusted(OZ_RELAYER.get(chainId)))) {
    await (await emergency.setIsTrusted(OZ_RELAYER.get(chainId), true)).wait();
  }
};

module.exports.tags = ["simulated:emergency-stop", "scenario:simulated"];
module.exports.dependencies = ["simulated:adapters"];
