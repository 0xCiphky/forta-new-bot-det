import { TestTransactionEvent } from "forta-agent-tools/lib/test";
import { createAddress } from "forta-agent-tools";
import { Finding, HandleTransaction, TransactionEvent } from "forta-agent";
import {
  FORTA_DEPLOYER_ADDRESS,
  CREATE_AGENT_FUNCTION,
  UPDATE_AGENT_FUNCTION,
  PROXY_CONTRACT_ADDRESS,
} from "./constants";
import { provideHandleTransaction } from "./agent";
import { CreateFinding } from "./findings";

const RAND_ADDR: string = createAddress("0xab01");

//Create mock arguments for testing
const createMockArgs = (
  agentId: number,
  owner: string,
  metaData: string,
  chainId: number[]
) => {
  return {
    agentId: agentId,
    owner: owner,
    metaData: metaData,
    chainId: chainId,
  };
};

const mockArguments = createMockArgs(1, createAddress("0x0"), "", [1, 2]);
const mockArguments2 = createMockArgs(2, createAddress("0x1"), "", [17]);
const mockArguments3 = createMockArgs(
  3,
  createAddress("0x2"),
  "",
  [100, 22, 33]
);

describe("New bot deployed agent", () => {
  let handleTransaction: HandleTransaction;

  beforeEach(() => {
    handleTransaction = provideHandleTransaction(
      FORTA_DEPLOYER_ADDRESS,
      CREATE_AGENT_FUNCTION,
      PROXY_CONTRACT_ADDRESS
    );
  });

  it("ignores empty transactions", async () => {
    const txEvent: TransactionEvent = new TestTransactionEvent();
    const findings: Finding[] = await handleTransaction(txEvent);
    expect(findings).toStrictEqual([]);
  });

  it("ignores transactions from the deployer address that don't create a new bot", async () => {
    const txEvent: TransactionEvent = new TestTransactionEvent()
      .setFrom(FORTA_DEPLOYER_ADDRESS)
      .setTo(PROXY_CONTRACT_ADDRESS)
      .addTraces({
        function: UPDATE_AGENT_FUNCTION,
        to: PROXY_CONTRACT_ADDRESS,
        from: FORTA_DEPLOYER_ADDRESS,
        arguments: [
          mockArguments.agentId,
          mockArguments.metaData,
          mockArguments.chainId,
        ],
      });
    const findings: Finding[] = await handleTransaction(txEvent);
    expect(findings).toStrictEqual([]);
  });

  it("ignores valid transactions (create bot) from a different address", async () => {
    const txEvent: TransactionEvent = new TestTransactionEvent()
      .setFrom(RAND_ADDR)
      .setTo(PROXY_CONTRACT_ADDRESS)
      .addTraces({
        function: CREATE_AGENT_FUNCTION,
        to: PROXY_CONTRACT_ADDRESS,
        arguments: [
          mockArguments.agentId,
          mockArguments.owner,
          mockArguments.metaData,
          mockArguments.chainId,
        ],
      });
    const findings: Finding[] = await handleTransaction(txEvent);
    expect(findings).toStrictEqual([]);
  });

  it("Creates a finding when a new bot is created on behalf of nethermind", async () => {
    const txEvent: TransactionEvent = new TestTransactionEvent()
      .setFrom(FORTA_DEPLOYER_ADDRESS)
      .setTo(PROXY_CONTRACT_ADDRESS)
      .addTraces({
        function: CREATE_AGENT_FUNCTION,
        to: PROXY_CONTRACT_ADDRESS,
        arguments: [
          mockArguments.agentId,
          mockArguments.owner,
          mockArguments.metaData,
          mockArguments.chainId,
        ],
      });

    const findings: Finding[] = await handleTransaction(txEvent);

    const mockFinding = [
      CreateFinding(
        mockArguments.agentId,
        mockArguments.metaData,
        mockArguments.chainId
      ),
    ];

    expect(findings).toStrictEqual(mockFinding);
  });

  it("Creates multiple findings when new bots are created on behalf of nethermind", async () => {
    const txEvent: TransactionEvent = new TestTransactionEvent()
      .setFrom(FORTA_DEPLOYER_ADDRESS)
      .setTo(PROXY_CONTRACT_ADDRESS)
      .addTraces({
        function: CREATE_AGENT_FUNCTION,
        to: PROXY_CONTRACT_ADDRESS,
        arguments: [
          mockArguments.agentId,
          mockArguments.owner,
          mockArguments.metaData,
          mockArguments.chainId,
        ],
      })
      .addTraces({
        function: CREATE_AGENT_FUNCTION,
        to: PROXY_CONTRACT_ADDRESS,
        arguments: [
          mockArguments2.agentId,
          mockArguments2.owner,
          mockArguments2.metaData,
          mockArguments2.chainId,
        ],
      })
      .addTraces({
        function: CREATE_AGENT_FUNCTION,
        to: PROXY_CONTRACT_ADDRESS,
        arguments: [
          mockArguments3.agentId,
          mockArguments3.owner,
          mockArguments3.metaData,
          mockArguments3.chainId,
        ],
      });

    const findings: Finding[] = await handleTransaction(txEvent);

    const mockFindings = [
      CreateFinding(
        mockArguments.agentId,
        mockArguments.metaData,
        mockArguments.chainId
      ),
      CreateFinding(
        mockArguments2.agentId,
        mockArguments2.metaData,
        mockArguments2.chainId
      ),
      CreateFinding(
        mockArguments3.agentId,
        mockArguments3.metaData,
        mockArguments3.chainId
      ),
    ];

    expect(findings).toStrictEqual(mockFindings);
  });
});
