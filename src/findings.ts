import { Finding, FindingSeverity, FindingType } from "forta-agent";

export const createFinding = (agentId: number, metadata: string, chainIds: number[]) => {
  return Finding.fromObject({
    name: "New forta bot created",
    description: "new forta bot deployed on behalf of nethermind",
    alertId: "NETH-1",
    severity: FindingSeverity.Info,
    type: FindingType.Info,
    protocol: "Polygon",
    metadata: {
      agentId: agentId.toString(),
      metaData: metadata,
      chainId: chainIds.toString(),
    },
  });
};
