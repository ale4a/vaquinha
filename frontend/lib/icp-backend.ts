import { Actor, HttpAgent } from '@dfinity/agent';
import type { _SERVICE as CanisterService } from './group-management-backend/service.did.d';
// import { idlFactory } from './group-management-backend/group-management-backend.did.js';
import { idlFactory } from './group-management-backend/service.did.js';

/* CANISTER_ID is replaced by webpack based on node environment
 * Note: canister environment variable will be standardized as
 * process.env.CANISTER_ID_<CANISTER_NAME_UPPERCASE>
 * beginning in dfx 0.15.0
 */
export const canisterId =
  process.env.NEXT_PUBLIC_CANISTER_ID_GROUP_MANAGEMENT_BACKEND!;

export const canisterHost =
  process.env.NEXT_PUBLIC_CANISTER_HOST_GROUP_MANAGEMENT_BACKEND!;

export const createActor = (canisterId: string, options = {}) => {
  // const agent = options.agent || new HttpAgent({ ...options.agentOptions });
  const agent = new HttpAgent({ host: canisterHost });

  // if (options.agent && options.agentOptions) {
  //   console.warn(
  //     "Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent."
  //   );
  // }

  // Fetch root key for certificate validation during development
  if (process.env.NEXT_PUBLIC_DFX_NETWORK !== 'ic') {
    agent.fetchRootKey().catch((err) => {
      console.warn(
        'Unable to fetch root key. Check to ensure that your local replica is running'
      );
      console.error(err);
    });
  }

  // Creates an actor with using the candid interface and the HttpAgent
  return Actor.createActor<CanisterService>(idlFactory, {
    agent,
    canisterId,
    // ...options.actorOptions,
  });
};

export const groupManagementBackend = createActor(canisterId);
