/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/vaquinha.json`.
 */
export type Vaquinha = {
  "address": "qjRm9YEVnGNoY2vCn4LsroiYixVnkn4Fwrta2qgxa1f",
  "metadata": {
    "name": "vaquinha",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "addPlayer",
      "discriminator": [
        254,
        109,
        36,
        5,
        85,
        174,
        122,
        93
      ],
      "accounts": [
        {
          "name": "round",
          "writable": true
        },
        {
          "name": "player",
          "signer": true
        },
        {
          "name": "playerTokenAccount",
          "writable": true
        },
        {
          "name": "roundTokenAccount",
          "writable": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": []
    },
    {
      "name": "initializeRound",
      "discriminator": [
        43,
        135,
        19,
        93,
        14,
        225,
        131,
        188
      ],
      "accounts": [
        {
          "name": "round",
          "writable": true,
          "signer": true
        },
        {
          "name": "initializer",
          "writable": true,
          "signer": true
        },
        {
          "name": "tokenMint"
        },
        {
          "name": "initializerTokenAccount",
          "writable": true
        },
        {
          "name": "roundTokenAccount",
          "writable": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
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
      "name": "payTurn",
      "discriminator": [
        22,
        144,
        153,
        31,
        248,
        112,
        93,
        14
      ],
      "accounts": [
        {
          "name": "round",
          "writable": true
        },
        {
          "name": "player",
          "signer": true
        },
        {
          "name": "roundTokenAccount",
          "writable": true
        },
        {
          "name": "recipientTokenAccount",
          "writable": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "round",
      "discriminator": [
        87,
        127,
        165,
        51,
        73,
        78,
        116,
        174
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "roundNotPending",
      "msg": "The round is not in pending status"
    },
    {
      "code": 6001,
      "name": "roundFull",
      "msg": "The round is full"
    },
    {
      "code": 6002,
      "name": "roundNotActive",
      "msg": "The round is not active"
    },
    {
      "code": 6003,
      "name": "notPlayersTurn",
      "msg": "It's not this player's turn to pay"
    }
  ],
  "types": [
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
            "type": "pubkey"
          },
          {
            "name": "numberOfPlayers",
            "type": "u8"
          },
          {
            "name": "players",
            "type": {
              "vec": "pubkey"
            }
          },
          {
            "name": "currentIndexOfPlayer",
            "type": "u8"
          },
          {
            "name": "orderOfTurns",
            "type": {
              "vec": "pubkey"
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
              "defined": {
                "name": "roundStatus"
              }
            }
          }
        ]
      }
    },
    {
      "name": "roundStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "pending"
          },
          {
            "name": "active"
          },
          {
            "name": "completed"
          }
        ]
      }
    }
  ]
};
