export const idlFactory = ({ IDL }) => {
  const GroupPeriod = IDL.Variant({
    'monthly' : IDL.Null,
    'weekly' : IDL.Null,
  });
  const GroupCrypto = IDL.Variant({ 'SOL' : IDL.Null, 'USDC' : IDL.Null });
  const Group = IDL.Record({
    'id' : IDL.Text,
    'memberPositions' : IDL.Vec(IDL.Int),
    'period' : GroupPeriod,
    'name' : IDL.Text,
    'crypto' : GroupCrypto,
    'memberPublicKeys' : IDL.Vec(IDL.Text),
    'amount' : IDL.Int,
  });
  return IDL.Service({
    'createGroup' : IDL.Func(
        [
          IDL.Text,
          IDL.Text,
          IDL.Vec(IDL.Int),
          GroupPeriod,
          IDL.Int,
          GroupCrypto,
        ],
        [IDL.Record({ 'success' : IDL.Bool })],
        [],
      ),
    'getGroup' : IDL.Func(
        [IDL.Text],
        [IDL.Record({ 'content' : IDL.Opt(Group), 'success' : IDL.Bool })],
        [],
      ),
    'joinGroup' : IDL.Func(
        [IDL.Text, IDL.Text],
        [IDL.Record({ 'success' : IDL.Bool })],
        [],
      ),
    'listAllGroups' : IDL.Func(
        [],
        [IDL.Record({ 'contents' : IDL.Vec(Group), 'success' : IDL.Bool })],
        [],
      ),
    'listGroups' : IDL.Func(
        [
          IDL.Opt(IDL.Text),
          IDL.Opt(GroupPeriod),
          IDL.Opt(IDL.Int),
          IDL.Opt(GroupCrypto),
        ],
        [IDL.Record({ 'contents' : IDL.Vec(Group), 'success' : IDL.Bool })],
        [],
      ),
    'say' : IDL.Func([IDL.Text], [IDL.Text], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
