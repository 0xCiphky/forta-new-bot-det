import { Finding, HandleTransaction, TransactionEvent } from "forta-agent";
import { createFinding } from "./findings";
import { FORTA_DEPLOYER_ADDRESS, CREATE_AGENT_FUNCTION, PROXY_CONTRACT_ADDRESS } from "./constants";

export function provideHandleTransaction(
  deployerAddress: string,
  createAgentFunction: string,
  proxyContractAddress: string
): HandleTransaction {
  return async (txEvent: TransactionEvent): Promise<Finding[]> => {
    const findings: Finding[] = [];

    // if the Transaction is not from Forta deployer address, return findings
    if (txEvent.from !== deployerAddress.toLowerCase()) {
      return findings;
    }
    // Filter the transaction for functions that match the create botfunction and that are sent to the proxy contract
    const newAgents = txEvent.filterFunction(createAgentFunction, proxyContractAddress);

    // Create a new finding for each valid transaction that meets the requirements
    newAgents.forEach((agent) => {
      const { agentId, metadata, chainIds } = agent.args;
      const finding = createFinding(agentId, metadata, chainIds);
      findings.push(finding);
    });

    return findings;
  };
}
export default {
  handleTransaction: provideHandleTransaction(FORTA_DEPLOYER_ADDRESS, CREATE_AGENT_FUNCTION, PROXY_CONTRACT_ADDRESS),
};
