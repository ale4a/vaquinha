export type Vaquinha = {
  "version": "0.1.0",
  "name": "vaquinha",
  "instructions": [
    {
      "name": "initializeRound",
      "accounts": [
        {
          "name": "round",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "initializerTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "roundTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "roundId",
          "type": "string"
        },
        {
          "name": "paymentAmount",
          "type": "u64"
        },
        {
          "name": "numberOfPlayers",
          "type": "u8"
        },
        {
          "name": "frequencyOfTurns",
          "type": "i64"
        }
      ]
    },
    {
      "name": "addPlayer",
      "accounts": [
        {
          "name": "round",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "player",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "playerTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "roundTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "payTurn",
      "accounts": [
        {
          "name": "round",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "player",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "playerTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "roundTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "turn",
          "type": "u8"
        }
      ]
    },
    {
      "name": "withdrawTurn",
      "accounts": [
        {
          "name": "round",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "player",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "playerTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "roundTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "withdrawCollateral",
      "accounts": [
        {
          "name": "round",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "player",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "playerTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "roundTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "round",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "roundId",
            "type": "string"
          },
          {
            "name": "paymentAmount",
            "type": "u64"
          },
          {
            "name": "tokenMint",
            "type": "publicKey"
          },
          {
            "name": "numberOfPlayers",
            "type": "u8"
          },
          {
            "name": "players",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "totalAmountLocked",
            "type": "u64"
          },
          {
            "name": "availableSlots",
            "type": "u8"
          },
          {
            "name": "frequencyOfTurns",
            "type": "i64"
          },
          {
            "name": "status",
            "type": {
              "defined": "RoundStatus"
            }
          },
          {
            "name": "withdrawnCollateral",
            "type": {
              "vec": "bool"
            }
          },
          {
            "name": "turnAccumulations",
            "type": {
              "vec": "u64"
            }
          },
          {
            "name": "paidTurns",
            "type": {
              "vec": "u64"
            }
          },
          {
            "name": "withdrawnTurns",
            "type": "bytes"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "RoundStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Pending"
          },
          {
            "name": "Active"
          },
          {
            "name": "Completed"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "RoundNotPending",
      "msg": "The round is not in pending status"
    },
    {
      "code": 6001,
      "name": "RoundFull",
      "msg": "The round is full"
    },
    {
      "code": 6002,
      "name": "RoundNotActive",
      "msg": "The round is not active"
    },
    {
      "code": 6003,
      "name": "NotPlayersTurn",
      "msg": "It's not this player's turn to pay"
    },
    {
      "code": 6004,
      "name": "InsufficientFunds",
      "msg": "Insufficient funds for withdrawal"
    },
    {
      "code": 6005,
      "name": "TurnAlreadyPaid",
      "msg": "Turn already paid"
    },
    {
      "code": 6006,
      "name": "RoundNotCompleted",
      "msg": "The round is not completed"
    },
    {
      "code": 6007,
      "name": "PlayerNotInRound",
      "msg": "Player is not part of this round"
    },
    {
      "code": 6008,
      "name": "InvalidTurn",
      "msg": "Invalid turn"
    },
    {
      "code": 6009,
      "name": "TurnAlreadyWithdrawn",
      "msg": "Turn has already been withdrawn"
    },
    {
      "code": 6010,
      "name": "CollateralAlreadyWithdrawn",
      "msg": "Collateral has already been withdrawn"
    },
    {
      "code": 6011,
      "name": "CannotPayOwnTurn",
      "msg": "Players cannot pay for their own turn"
    }
  ]
};

export const IDL: Vaquinha = {
  "version": "0.1.0",
  "name": "vaquinha",
  "instructions": [
    {
      "name": "initializeRound",
      "accounts": [
        {
          "name": "round",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "initializerTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "roundTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "roundId",
          "type": "string"
        },
        {
          "name": "paymentAmount",
          "type": "u64"
        },
        {
          "name": "numberOfPlayers",
          "type": "u8"
        },
        {
          "name": "frequencyOfTurns",
          "type": "i64"
        }
      ]
    },
    {
      "name": "addPlayer",
      "accounts": [
        {
          "name": "round",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "player",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "playerTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "roundTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "payTurn",
      "accounts": [
        {
          "name": "round",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "player",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "playerTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "roundTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "turn",
          "type": "u8"
        }
      ]
    },
    {
      "name": "withdrawTurn",
      "accounts": [
        {
          "name": "round",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "player",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "playerTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "roundTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "withdrawCollateral",
      "accounts": [
        {
          "name": "round",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "player",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "playerTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "roundTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "round",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "roundId",
            "type": "string"
          },
          {
            "name": "paymentAmount",
            "type": "u64"
          },
          {
            "name": "tokenMint",
            "type": "publicKey"
          },
          {
            "name": "numberOfPlayers",
            "type": "u8"
          },
          {
            "name": "players",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "totalAmountLocked",
            "type": "u64"
          },
          {
            "name": "availableSlots",
            "type": "u8"
          },
          {
            "name": "frequencyOfTurns",
            "type": "i64"
          },
          {
            "name": "status",
            "type": {
              "defined": "RoundStatus"
            }
          },
          {
            "name": "withdrawnCollateral",
            "type": {
              "vec": "bool"
            }
          },
          {
            "name": "turnAccumulations",
            "type": {
              "vec": "u64"
            }
          },
          {
            "name": "paidTurns",
            "type": {
              "vec": "u64"
            }
          },
          {
            "name": "withdrawnTurns",
            "type": "bytes"
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "RoundStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Pending"
          },
          {
            "name": "Active"
          },
          {
            "name": "Completed"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "RoundNotPending",
      "msg": "The round is not in pending status"
    },
    {
      "code": 6001,
      "name": "RoundFull",
      "msg": "The round is full"
    },
    {
      "code": 6002,
      "name": "RoundNotActive",
      "msg": "The round is not active"
    },
    {
      "code": 6003,
      "name": "NotPlayersTurn",
      "msg": "It's not this player's turn to pay"
    },
    {
      "code": 6004,
      "name": "InsufficientFunds",
      "msg": "Insufficient funds for withdrawal"
    },
    {
      "code": 6005,
      "name": "TurnAlreadyPaid",
      "msg": "Turn already paid"
    },
    {
      "code": 6006,
      "name": "RoundNotCompleted",
      "msg": "The round is not completed"
    },
    {
      "code": 6007,
      "name": "PlayerNotInRound",
      "msg": "Player is not part of this round"
    },
    {
      "code": 6008,
      "name": "InvalidTurn",
      "msg": "Invalid turn"
    },
    {
      "code": 6009,
      "name": "TurnAlreadyWithdrawn",
      "msg": "Turn has already been withdrawn"
    },
    {
      "code": 6010,
      "name": "CollateralAlreadyWithdrawn",
      "msg": "Collateral has already been withdrawn"
    },
    {
      "code": 6011,
      "name": "CannotPayOwnTurn",
      "msg": "Players cannot pay for their own turn"
    }
  ]
};
