import json
from datetime import datetime
from typing import Dict, List, Optional
import re
from dataclasses import dataclass
from pathlib import Path
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class Message:
    """Represents a standardized message format"""
    content: str
    timestamp: datetime
    author: str
    channel: str
    attachments: List[str]
    
class DiscordParser:
    """Parser for transforming multiple Discord outputs into standardized format"""
    
    def __init__(self, output_format: str = "subscription"):
        """
        Initialize parser with desired output format
        
        Args:
            output_format: The desired output format (e.g. "subscription")
        """
        self.output_format = output_format
        self.standard_channels = {
            "general": "community",
            "random": "offtopic",
            "help": "support",
            "announcements": "updates"
        }
        
    def _standardize_timestamp(self, timestamp: str) -> datetime:
        """Convert various timestamp formats to standard datetime"""
        # Handle common Discord timestamp formats
        formats = [
            "%Y-%m-%d %H:%M:%S",
            "%Y-%m-%dT%H:%M:%S.%fZ",
            "%m/%d/%Y %H:%M:%S"
        ]
        
        for fmt in formats:
            try:
                return datetime.strptime(timestamp, fmt)
            except ValueError:
                continue
                
        logger.warning(f"Could not parse timestamp: {timestamp}")
        return datetime.now()
    
    def _standardize_channel(self, channel: str) -> str:
        """Convert channel names to standard format"""
        channel = channel.lower().strip()
        return self.standard_channels.get(channel, "community")
    
    def _clean_content(self, content: str) -> str:
        """Clean and standardize message content"""
        # Remove Discord-specific formatting
        content = re.sub(r'<[@#][!&]?\d+>', '', content)
        
        # Remove excessive whitespace
        content = ' '.join(content.split())
        
        # Remove common Discord bot commands
        content = re.sub(r'![a-zA-Z]+\s?', '', content)
        
        return content.strip()
    
    def parse_file(self, input_file: Path) -> List[Message]:
        """
        Parse a Discord export file into standardized messages
        
        Args:
            input_file: Path to input file
            
        Returns:
            List of standardized Message objects
        """
        messages = []
        
        try:
            with open(input_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                
            # Handle different Discord export formats
            if isinstance(data, list):
                raw_messages = data
            elif isinstance(data, dict):
                raw_messages = data.get('messages', [])
            else:
                logger.error(f"Unexpected data format in {input_file}")
                return messages
                
            for msg in raw_messages:
                try:
                    message = Message(
                        content=self._clean_content(msg['content']),
                        timestamp=self._standardize_timestamp(msg['timestamp']),
                        author=msg.get('author', {}).get('name', 'Anonymous'),
                        channel=self._standardize_channel(msg.get('channel_name', 'general')),
                        attachments=[a.get('url', '') for a in msg.get('attachments', [])]
                    )
                    messages.append(message)
                except KeyError as e:
                    logger.warning(f"Missing required field in message: {e}")
                    continue
                    
        except (json.JSONDecodeError, FileNotFoundError) as e:
            logger.error(f"Error processing file {input_file}: {e}")
            
        return messages
    
    def generate_subscription_format(self, messages: List[Message]) -> Dict:
        """Convert messages to subscription service format"""
        return {
            "platform": "Community Hub",
            "subscription_type": "premium",
            "messages": [
                {
                    "id": idx,
                    "content": msg.content,
                    "timestamp": msg.timestamp.isoformat(),
                    "channel": msg.channel,
                    "author": "CommunityBot",
                    "metadata": {
                        "original_author": msg.author,
                        "attachments": msg.attachments
                    }
                }
                for idx, msg in enumerate(messages)
            ]
        }

def process_discord_exports(input_dir: str, output_file: str):
    """
    Process multiple Discord exports into single subscription-style output
    
    Args:
        input_dir: Directory containing Discord export files
        output_file: Path to write combined output
    """
    parser = DiscordParser()
    all_messages = []
    
    # Process all json files in input directory
    input_path = Path(input_dir)
    for file in input_path.glob('*.json'):
        messages = parser.parse_file(file)
        all_messages.extend(messages)
    
    # Sort by timestamp
    all_messages.sort(key=lambda x: x.timestamp)
    
    # Convert to subscription format
    output_data = parser.generate_subscription_format(all_messages)
    
    # Write output
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2)
    
    logger.info(f"Processed {len(all_messages)} messages to {output_file}")

if __name__ == "__main__":
    # Example usage
    process_discord_exports(
        input_dir="./discord_exports",
        output_file="combined_community.json"
    )