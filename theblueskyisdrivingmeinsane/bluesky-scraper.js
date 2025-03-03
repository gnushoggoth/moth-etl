/**
 * Bluesky CCRU Data Scraper
 * 
 * This script provides a way to scrape and collect data from Bluesky social network,
 * specifically designed to focus on CCRU (Cybernetic Culture Research Unit) related content.
 * 
 * The script uses the Bluesky API (AT Protocol) to authenticate and fetch data.
 */

// Import required libraries (when using in Node.js environment)
// const { BskyAgent } = require('@atproto/api');

class BlueskyScraperCCRU {
  constructor() {
    this.agent = new BskyAgent({
      service: 'https://bsky.social',
    });
    this.isAuthenticated = false;
    this.collectedData = {
      posts: [],
      users: new Map(),
      hashtags: new Map(),
      mentions: new Map(),
    };
    this.ccruKeywords = [
      'ccru',
      'cybernetic culture research unit',
      'hyperstition',
      'accelerationism',
      'numogram',
      'digital hyperstition',
      'lemurian time war',
      'nick land',
      'sadie plant',
      'kodwo eshun',
    ];
  }

  /**
   * Authenticate with Bluesky using credentials
   * @param {string} identifier - Email or handle
   * @param {string} password - Account password
   * @returns {Promise<boolean>} - Authentication status
   */
  async authenticate(identifier, password) {
    try {
      await this.agent.login({
        identifier: identifier,
        password: password,
      });
      this.isAuthenticated = true;
      console.log('Successfully authenticated with Bluesky');
      return true;
    } catch (error) {
      console.error('Authentication failed:', error.message);
      return false;
    }
  }

  /**
   * Search for posts containing CCRU-related keywords
   * @param {string} query - Additional search query to combine with CCRU keywords
   * @param {number} limit - Maximum number of results to return
   * @returns {Promise<Array>} - Array of matching posts
   */
  async searchCCRUContent(query = '', limit = 50) {
    if (!this.isAuthenticated) {
      throw new Error('Authentication required before searching');
    }

    let allResults = [];
    
    // Search for each keyword
    for (const keyword of this.ccruKeywords) {
      const searchQuery = query ? `${keyword} ${query}` : keyword;
      
      try {
        const response = await this.agent.app.bsky.feed.searchPosts({
          q: searchQuery,
          limit: Math.min(limit, 100), // API usually limits to 100 per request
        });
        
        if (response.success && response.data.posts) {
          // Process and store the results
          const processedPosts = this.processPosts(response.data.posts);
          allResults = [...allResults, ...processedPosts];
          
          console.log(`Found ${processedPosts.length} posts for keyword "${keyword}"`);
        }
      } catch (error) {
        console.error(`Error searching for "${keyword}":`, error.message);
      }
      
      // Respect rate limits - pause between requests
      await this.delay(1000);
    }
    
    // Deduplicate posts by URI
    allResults = this.deduplicatePosts(allResults);
    
    // Update the collected data
    this.collectedData.posts = [...this.collectedData.posts, ...allResults];
    
    return allResults.slice(0, limit);
  }
  
  /**
   * Process posts to extract relevant information
   * @param {Array} posts - Raw posts from API
   * @returns {Array} - Processed posts with extracted metadata
   */
  processPosts(posts) {
    return posts.map(post => {
      // Extract basic post data
      const processedPost = {
        uri: post.uri,
        cid: post.cid,
        author: post.author.handle,
        text: post.record.text,
        createdAt: post.record.createdAt,
        likeCount: post.likeCount || 0,
        repostCount: post.repostCount || 0,
        replyCount: post.replyCount || 0,
        indexedAt: post.indexedAt,
        hashtags: [],
        mentions: [],
      };
      
      // Store user data
      if (!this.collectedData.users.has(post.author.did)) {
        this.collectedData.users.set(post.author.did, {
          did: post.author.did,
          handle: post.author.handle,
          displayName: post.author.displayName,
          avatar: post.author.avatar,
          postCount: 1,
        });
      } else {
        const userData = this.collectedData.users.get(post.author.did);
        userData.postCount++;
        this.collectedData.users.set(post.author.did, userData);
      }
      
      // Extract hashtags (simple regex extraction)
      const hashtagMatches = post.record.text.match(/#(\w+)/g) || [];
      processedPost.hashtags = hashtagMatches.map(tag => tag.substring(1));
      
      // Update hashtag counts
      processedPost.hashtags.forEach(tag => {
        if (!this.collectedData.hashtags.has(tag)) {
          this.collectedData.hashtags.set(tag, 1);
        } else {
          this.collectedData.hashtags.set(tag, this.collectedData.hashtags.get(tag) + 1);
        }
      });
      
      // Extract mentions if facets exist
      if (post.record.facets) {
        post.record.facets.forEach(facet => {
          facet.features.forEach(feature => {
            if (feature.$type === 'app.bsky.richtext.facet#mention') {
              processedPost.mentions.push(feature.did);
              
              // Update mention counts
              if (!this.collectedData.mentions.has(feature.did)) {
                this.collectedData.mentions.set(feature.did, 1);
              } else {
                this.collectedData.mentions.set(
                  feature.did, 
                  this.collectedData.mentions.get(feature.did) + 1
                );
              }
            }
          });
        });
      }
      
      return processedPost;
    });
  }
  
  /**
   * Remove duplicate posts based on URI
   * @param {Array} posts - Array of posts that may contain duplicates
   * @returns {Array} - Deduplicated posts
   */
  deduplicatePosts(posts) {
    const uniqueURIs = new Set();
    return posts.filter(post => {
      if (uniqueURIs.has(post.uri)) {
        return false;
      }
      uniqueURIs.add(post.uri);
      return true;
    });
  }
  
  /**
   * Get user profile and activity data
   * @param {string} handle - User handle to fetch
   * @returns {Promise<Object>} - User profile and activity data
   */
  async getUserProfile(handle) {
    if (!this.isAuthenticated) {
      throw new Error('Authentication required before fetching user data');
    }
    
    try {
      // Get user profile
      const profile = await this.agent.getProfile({ actor: handle });
      
      // Get user's recent posts
      const posts = await this.agent.getAuthorFeed({
        actor: handle,
        limit: 50,
      });
      
      // Process posts to extract CCRU-related content
      const ccruPosts = posts.data.feed
        .map(item => item.post)
        .filter(post => {
          const text = post.record.text.toLowerCase();
          return this.ccruKeywords.some(keyword => text.includes(keyword.toLowerCase()));
        });
      
      return {
        profile: profile.data,
        ccruPostCount: ccruPosts.length,
        ccruPosts: this.processPosts(ccruPosts),
      };
    } catch (error) {
      console.error(`Error fetching profile for "${handle}":`, error.message);
      return null;
    }
  }
  
  /**
   * Export collected data to JSON
   * @returns {Object} - JSON-serializable object with all collected data
   */
  exportData() {
    return {
      posts: this.collectedData.posts,
      users: Array.from(this.collectedData.users.values()),
      hashtags: Object.fromEntries(this.collectedData.hashtags),
      mentions: Object.fromEntries(this.collectedData.mentions),
      metadata: {
        totalPosts: this.collectedData.posts.length,
        totalUsers: this.collectedData.users.size,
        totalHashtags: this.collectedData.hashtags.size,
        totalMentions: this.collectedData.mentions.size,
        exportedAt: new Date().toISOString(),
        keywords: this.ccruKeywords,
      }
    };
  }
  
  /**
   * Generate a simple report of the collected data
   * @returns {string} - Text report summarizing the collected data
   */
  generateReport() {
    const data = this.exportData();
    
    // Sort hashtags by frequency
    const sortedHashtags = Object.entries(data.hashtags)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
    
    // Sort users by post count
    const sortedUsers = data.users
      .sort((a, b) => b.postCount - a.postCount)
      .slice(0, 10);
    
    let report = `
CCRU Bluesky Data Scraper Report
================================
Generated: ${data.metadata.exportedAt}

Summary:
- Total CCRU-related posts collected: ${data.metadata.totalPosts}
- Total unique users: ${data.metadata.totalUsers}
- Total hashtags: ${data.metadata.totalHashtags}
- Total mentions: ${data.metadata.totalMentions}

Top 10 Hashtags:
${sortedHashtags.map((h, i) => `${i+1}. #${h[0]}: ${h[1]} occurrences`).join('\n')}

Top 10 Active Users:
${sortedUsers.map((u, i) => `${i+1}. @${u.handle} (${u.displayName || 'No display name'}): ${u.postCount} posts`).join('\n')}

Search Keywords Used:
${this.ccruKeywords.map(k => `- ${k}`).join('\n')}
`;
    
    return report;
  }
  
  /**
   * Utility function to create delays between API calls
   * @param {number} ms - Time to delay in milliseconds
   * @returns {Promise<void>}
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Example usage:
/*
async function main() {
  const scraper = new BlueskyScraperCCRU();
  await scraper.authenticate('your-email@example.com', 'your-password');
  
  // Search for CCRU-related content
  const posts = await scraper.searchCCRUContent('', 100);
  console.log(`Collected ${posts.length} CCRU-related posts`);
  
  // Get information about a specific user
  const userData = await scraper.getUserProfile('land.bsky.social');
  console.log(`User has ${userData.ccruPostCount} CCRU-related posts`);
  
  // Export collected data to JSON
  const exportedData = scraper.exportData();
  console.log('Data exported:', Object.keys(exportedData));
  
  // Generate a report
  const report = scraper.generateReport();
  console.log(report);
}

main().catch(console.error);
*/

// For browser use, export the class
// export { BlueskyScraperCCRU };
