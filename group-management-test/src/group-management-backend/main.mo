import Array "mo:base/Array";
import Option "mo:base/Option";

actor Echo {

  // Say the given phase.
  public query func say(phrase : Text) : async Text {
    return phrase;
  };

  public type GroupPeriod = {
    #monthly;
    #weekly;
  };

  public type GroupCrypto = {
    #USDC;
    #SOL;
  };

  public type Group = {
    id: Text;
    name: Text;
    memberPublicKeys: [Text];
    memberPositions: [Int];
    period: GroupPeriod;
    amount: Int;
    crypto: GroupCrypto;
  };

  stable var groups: [Group] = [];

  public func createGroup(id: Text, name: Text, memberPositions: [Int], period: GroupPeriod, amount: Int, crypto: GroupCrypto): async { success: Bool } {
    let newGroup: Group = {
      id = id;
      name = name;
      memberPublicKeys = [];
      memberPositions = memberPositions;
      period = period;
      amount = amount;
      crypto = crypto;
    };
    groups := Array.append(groups, [newGroup]);
    return { success = true };
  };

  public func joinGroup(id: Text, publicKey: Text): async { success: Bool } {

    var found = false;

    groups := Array.map<Group, Group>(groups, func (group) {
      if (group.id == id) {
        found := true;
        {
          id = group.id;
          name = group.name;
          memberPublicKeys = Array.append(group.memberPublicKeys, [publicKey]);
          memberPositions = group.memberPositions;
          period = group.period;
          amount = group.amount;
          crypto = group.crypto;
        };
      } else {
        group;
      }
    });

    if (found) {
      return { success = true };
    } else {
      return { success = false };
    };
  };

  public func listAllGroups(): async { success: Bool; contents: [Group] } {
    return { success = true; contents = groups };
  };

  public func listGroups(publicKey: ?Text, period: ?GroupPeriod, amount: ?Int, crypto: ?GroupCrypto): async { success: Bool; contents: [Group] } {
    return {
      success = true;
      contents = Array.filter<Group>(groups, func (group) {
        if (publicKey != null) {
          let isOk = Array.filter<Text>(group.memberPublicKeys, func (member) {
            Option.get(publicKey, "") == member
          }).size() > 0;
          if (isOk == false) {
            return false;
          };
        };
        if (period != null) {
          let isOk = Option.get(period, "") == group.period;
          if (isOk == false) {
            return false;
          }
        };
        if (amount != null) {
          let isOk = Option.get(amount, -1) == group.amount;
          if (isOk == false) {
            return false;
          }
        };
        if (crypto != null) {
          let isOk = Option.get(crypto, "") == group.crypto;
          if (isOk == false) {
            return false;
          }
        };
        return true;
     });
    }
  };

    public func getGroup(id: Text): async { success: Bool; content: ?Group } {
    return {
      success = true;
      content = Array.find<Group>(groups, func (group) {
        group.id == id
     });
    }
  };
};
