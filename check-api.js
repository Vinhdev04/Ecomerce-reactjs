import axios from 'axios';

async function checkApi() {
  try {
    const response = await axios.get('http://localhost:3000/api/products?page=1&limit=1');
    console.log('Status:', response.status);
    console.log('Products:', JSON.stringify(response.data.products, null, 2));
    console.log('Total:', response.data.total);
  } catch (error) {
    console.error('API Error:', error.message);
  }
}

checkApi();
