// Node.js Example for Using the Bluesky CCRU Scraper
const fs = require('fs');
const { BskyAgent } = require('@atproto/api');
const { BlueskyScraperCCRU } = require('./bluesky-scraper.js');

async function runCCRUScraper() {
  // Create a new scraper instance
  const scraper = new BlueskyScraperCCRU();
  
  // Authenticate with Bluesky
  // Replace with your actual credentials
  const authenticated = await scraper.authenticate('your-email@example.com', 'your-password');
  
  if (!authenticated) {
    console.error('Failed to authenticate. Please check your credentials.');
    return;
  }
  
  // Search for CCRU-related content with additional keywords
  console.log('Searching for CCRU-related content...');
  const posts = await scraper.searchCCRUContent('digital philosophy', 150);
  console.log(`Collected ${posts.length} CCRU-related posts`);
  
  // Get information about specific users of interest
  const users = ['landian.bsky.social', 'hyperstition.bsky.social', 'accelerate.bsky.social'];
  
  for (const user of users) {
    try {
      console.log(`Fetching data for user: ${user}`);
      const userData = await scraper.getUserProfile(user);
      
      if (userData) {
        console.log(`User ${user} has ${userData.ccruPostCount} CCRU-related posts`);
      } else {
        console.log(`Could not retrieve data for user ${user}`);
      }
      
      // Small delay to respect rate limits
      await scraper.delay(1000);
    } catch (error) {
      console.error(`Error processing user ${user}:`, error.message);
    }
  }
  
  // Export data to JSON file
  const exportedData = scraper.exportData();
  fs.writeFileSync('ccru_bluesky_data.json', JSON.stringify(exportedData, null, 2));
  console.log('Data exported to ccru_bluesky_data.json');
  
  // Generate and save a text report
  const report = scraper.generateReport();
  fs.writeFileSync('ccru_bluesky_report.txt', report);
  console.log('Report saved to ccru_bluesky_report.txt');
  
  // Print a section of the report to console
  console.log('\nReport Preview:');
  console.log(report.split('\n').slice(0, 15).join('\n'));
}

// Run the scraper
runCCRUScraper().catch(error => {
  console.error('Scraper failed with error:', error);
});

// To run this script:
// 1. Install the AT Protocol API: npm install @atproto/api
// 2. Save the BlueskyScraperCCRU class to bluesky-scraper.js
// 3. Save this script to run-scraper.js
// 4. Run with: node run-scraper.js
