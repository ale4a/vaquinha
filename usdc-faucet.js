const axios = require('axios');
require('dotenv').config();

async function requestFaucetDrips() {
  try {
    const response = await axios({
      method: 'post',
      url: 'https://api.circle.com/v1/faucet/drips',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CIRCLE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      data: {
        address: '8UY689Lzfgiu9DESB1wgzSFMyWnUtsfGrcEZtU3QZppu',
        blockchain: 'SOL-DEVNET',
        native: true,
        usdc: true,
        eurc: true
      }
    });

    console.log('Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
    throw error;
  }
}

// Execute the function
requestFaucetDrips();