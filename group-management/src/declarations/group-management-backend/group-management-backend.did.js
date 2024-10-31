export const idlFactory = ({ IDL }) => {
  const Group = IDL.Record({
    'id' : IDL.Text,
    'memberPositions' : IDL.Vec(IDL.Int),
    'name' : IDL.Text,
    'memberPublicKeys' : IDL.Vec(IDL.Text),
  });
  return IDL.Service({
    'createGroup' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Vec(IDL.Int)],
        [IDL.Record({ 'success' : IDL.Bool })],
        [],
      ),
    'joinGroup' : IDL.Func(
        [IDL.Text, IDL.Text],
        [IDL.Record({ 'success' : IDL.Bool })],
        [],
      ),
    'listGroups' : IDL.Func(
        [],
        [IDL.Record({ 'contents' : IDL.Vec(Group), 'success' : IDL.Bool })],
        [],
      ),
    'listMyGroups' : IDL.Func(
        [IDL.Text],
        [IDL.Record({ 'contents' : IDL.Vec(Group), 'success' : IDL.Bool })],
        [],
      ),
    'say' : IDL.Func([IDL.Text], [IDL.Text], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
