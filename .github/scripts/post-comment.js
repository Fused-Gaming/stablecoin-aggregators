#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Auto-Documentation Bot - PR Comment Poster
 *
 * Posts generated documentation as a comment on pull requests.
 * Handles comment updates and error cases gracefully.
 */

// Error handling setup
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled rejection:', error);
  logError('UNHANDLED_REJECTION', error);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught exception:', error);
  logError('UNCAUGHT_EXCEPTION', error);
  process.exit(1);
});

// Configuration
const config = {
  token: process.env.GITHUB_TOKEN,
  prNumber: process.env.PR_NUMBER,
  repo: process.env.GITHUB_REPOSITORY || 'Fused-Gaming/stablecoin-aggregators',
  commentFile: '.github/generated-docs/pr-comment.md',
  logsDir: '.github/logs',
  botSignature: '<!-- auto-documentation-bot -->',
};

/**
 * Log error to file
 */
function logError(type, error) {
  try {
    const timestamp = new Date().toISOString();
    const logFile = path.join(config.logsDir, 'errors.log');
    const logEntry = `[${timestamp}] ${type}: ${error.message}\n${error.stack}\n\n`;
    fs.appendFileSync(logFile, logEntry);
  } catch (e) {
    console.error('Failed to write error log:', e);
  }
}

/**
 * Validate configuration
 */
function validateConfig() {
  const errors = [];

  if (!config.token) {
    errors.push('GITHUB_TOKEN environment variable is required');
  }

  if (!config.prNumber) {
    errors.push('PR_NUMBER environment variable is required');
  }

  if (!fs.existsSync(config.commentFile)) {
    errors.push(`Comment file not found: ${config.commentFile}`);
  }

  if (errors.length > 0) {
    throw new Error(`Configuration errors:\n- ${errors.join('\n- ')}`);
  }
}

/**
 * Make GitHub API request
 */
async function githubRequest(endpoint, options = {}) {
  try {
    const [owner, repo] = config.repo.split('/');
    const url = `https://api.github.com/repos/${owner}/${repo}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `token ${config.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'auto-documentation-bot',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`GitHub API error (${response.status}): ${errorBody}`);
    }

    return await response.json();
  } catch (error) {
    console.error('❌ GitHub API request failed:', error);
    logError('GITHUB_API', error);
    throw error;
  }
}

/**
 * Get existing bot comment on PR
 */
async function getExistingComment() {
  try {
    console.log(`🔍 Checking for existing bot comment on PR #${config.prNumber}...`);

    const comments = await githubRequest(`/issues/${config.prNumber}/comments`);

    const botComment = comments.find(comment =>
      comment.body.includes(config.botSignature)
    );

    if (botComment) {
      console.log(`✅ Found existing comment (ID: ${botComment.id})`);
      return botComment;
    }

    console.log('ℹ️ No existing bot comment found');
    return null;
  } catch (error) {
    console.error('❌ Failed to get existing comment:', error);
    logError('GET_COMMENT', error);
    // Don't throw - we can continue without finding existing comment
    return null;
  }
}

/**
 * Create new PR comment
 */
async function createComment(body) {
  try {
    console.log(`📝 Creating new comment on PR #${config.prNumber}...`);

    const comment = await githubRequest(`/issues/${config.prNumber}/comments`, {
      method: 'POST',
      body: JSON.stringify({ body }),
      headers: { 'Content-Type': 'application/json' },
    });

    console.log(`✅ Created comment (ID: ${comment.id})`);
    console.log(`   URL: ${comment.html_url}`);
    return comment;
  } catch (error) {
    console.error('❌ Failed to create comment:', error);
    logError('CREATE_COMMENT', error);
    throw error;
  }
}

/**
 * Update existing PR comment
 */
async function updateComment(commentId, body) {
  try {
    console.log(`✏️ Updating existing comment (ID: ${commentId})...`);

    const comment = await githubRequest(`/issues/comments/${commentId}`, {
      method: 'PATCH',
      body: JSON.stringify({ body }),
      headers: { 'Content-Type': 'application/json' },
    });

    console.log(`✅ Updated comment`);
    console.log(`   URL: ${comment.html_url}`);
    return comment;
  } catch (error) {
    console.error('❌ Failed to update comment:', error);
    logError('UPDATE_COMMENT', error);
    throw error;
  }
}

/**
 * Post or update comment
 */
async function postComment() {
  try {
    // Load comment content
    console.log(`📂 Loading comment from ${config.commentFile}...`);
    const commentContent = fs.readFileSync(config.commentFile, 'utf-8');

    // Add bot signature
    const commentBody = `${commentContent}\n\n${config.botSignature}`;

    // Check for existing comment
    const existingComment = await getExistingComment();

    if (existingComment) {
      // Update existing comment
      await updateComment(existingComment.id, commentBody);
    } else {
      // Create new comment
      await createComment(commentBody);
    }

    return true;
  } catch (error) {
    console.error('❌ Failed to post comment:', error);
    logError('POST_COMMENT', error);
    throw error;
  }
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log('🤖 Auto-Documentation Bot - PR Comment Poster');
    console.log('===============================================\n');

    // Validate configuration
    validateConfig();
    console.log('✅ Configuration validated\n');

    // Post comment
    await postComment();

    console.log('\n✅ Comment posted successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Fatal error in comment poster:', error);
    logError('MAIN_EXECUTION', error);
    process.exit(1);
  }
}

// Run
main();
