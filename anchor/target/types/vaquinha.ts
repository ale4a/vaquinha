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
          "isSigner": true
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
          "name": "recipientTokenAccount",
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
            "name": "currentIndexOfPlayer",
            "type": "u8"
          },
          {
            "name": "currentTurnPaidAmount",
            "type": "u64"
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
          "isSigner": true
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
          "name": "recipientTokenAccount",
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
            "name": "currentIndexOfPlayer",
            "type": "u8"
          },
          {
            "name": "currentTurnPaidAmount",
            "type": "u64"
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
    }
  ]
};
