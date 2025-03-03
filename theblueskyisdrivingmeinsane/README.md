# Bluesky CCRU Data Scraper

A specialized tool for collecting, analyzing, and visualizing CCRU (Cybernetic Culture Research Unit) related content from the Bluesky social network.

## Overview

This data scraper is designed to:

1. Authenticate with the Bluesky social network (via AT Protocol)
2. Search for posts related to CCRU using predefined keywords
3. Extract and analyze post content, hashtags, and user interactions
4. Generate reports and visualizations of CCRU-related discussions
5. Export data in various formats for further analysis

The tool operates within the constraints of Bluesky's API rate limits and provides both a Node.js implementation for automated data collection and a browser-based interface for interactive exploration.

## Features

- **Keyword-Based Collection**: Searches for posts containing CCRU-related terms like "hyperstition," "accelerationism," "numogram," etc.
- **User Analysis**: Identifies and analyzes active users discussing CCRU-related topics
- **Hashtag Tracking**: Monitors popular hashtags used in CCRU discourse
- **Mention Mapping**: Maps connections between users through mentions
- **Data Export**: Exports collected data in JSON, CSV, and text report formats
- **Interactive Visualization**: Browser-based interface for exploring collected data

## Prerequisites

### For Node.js Implementation
- Node.js (v14+)
- AT Protocol API library: `npm install @atproto/api`
- File system access for data export

### For Browser Implementation
- Modern web browser with JavaScript enabled
- Internet connection to access Bluesky API
- No additional libraries needed (all included via CDN)

## Usage

### Node.js Implementation

1. Install dependencies:
   ```bash
   npm install @atproto/api
   ```

2. Import the scraper:
   ```javascript
   const { BlueskyScraperCCRU } = require('./bluesky-scraper.js');
   ```

3. Run a basic data collection:
   ```javascript
   async function main() {
     const scraper = new BlueskyScraperCCRU();
     await scraper.authenticate('your-email@example.com', 'your-password');
     
     const posts = await scraper.searchCCRUContent('digital philosophy', 100);
     console.log(`Collected ${posts.length} CCRU-related posts`);
     
     const report = scraper.generateReport();
     console.log(report);
   }
   
   main().catch(console.error);
   ```

### Browser Implementation

1. Host the HTML file on a web server or open it locally
2. Enter your Bluesky authentication credentials (email/handle and password)
3. Configure search options (additional keywords, result limits)
4. Click "Start Data Collection" to begin gathering CCRU-related content
5. Navigate through tabs to explore collected data
6. Export data for further analysis

## Ethical Considerations

- This tool collects publicly available data from Bluesky but should be used responsibly
- Respect rate limits to avoid overloading Bluesky's servers
- Consider privacy implications when analyzing and sharing user data
- Use for research, educational, or archival purposes only

## Extending the Tool

The scraper can be extended in several ways:

- **Additional Keywords**: Customize the `ccruKeywords` array to include more relevant terms
- **Network Analysis**: Implement graph analysis of user connections and interactions
- **Temporal Analysis**: Add time-series analysis of CCRU discourse evolution
- **Content Analysis**: Incorporate natural language processing for deeper content analysis
- **Cross-Platform Integration**: Expand to collect data from other platforms discussing CCRU topics

## Example Use Cases

1. **Academic Research**: Track the spread and evolution of CCRU concepts in digital culture
2. **Digital Anthropology**: Study community formation around specific philosophical concepts
3. **Archival Projects**: Preserve discussions and creative outputs related to CCRU
4. **Media Analysis**: Examine how CCRU concepts influence contemporary digital discourse

## License

This tool is provided for educational and research purposes. Please use responsibly and in accordance with Bluesky's terms of service.

## Credits

Developed as an independent tool for research on digital philosophy and cybernetic culture communities.

---

**Note**: This tool is not affiliated with or endorsed by Bluesky or any former/current members of CCRU. It is designed as a specialized research instrument for studying digital discourse around specific philosophical concepts.
