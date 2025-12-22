#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Auto-Documentation Bot - Commit Parser
 *
 * Parses commit messages and extracts structured information for documentation.
 * Supports conventional commits format and custom documentation patterns.
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
  baseRef: process.env.BASE_REF || 'HEAD~1',
  headRef: process.env.HEAD_REF || 'HEAD',
  branchName: process.env.BRANCH_NAME || 'unknown',
  outputDir: '.github/generated-docs',
  logsDir: '.github/logs',
};

// Conventional commit types
const commitTypes = {
  feat: { label: '✨ Features', description: 'New features' },
  fix: { label: '🐛 Bug Fixes', description: 'Bug fixes' },
  docs: { label: '📚 Documentation', description: 'Documentation changes' },
  style: { label: '💄 Styles', description: 'Code style changes' },
  refactor: { label: '♻️ Refactoring', description: 'Code refactoring' },
  perf: { label: '⚡ Performance', description: 'Performance improvements' },
  test: { label: '✅ Tests', description: 'Test additions or changes' },
  build: { label: '🏗️ Build', description: 'Build system changes' },
  ci: { label: '👷 CI', description: 'CI/CD changes' },
  chore: { label: '🔧 Chores', description: 'Maintenance tasks' },
  revert: { label: '⏪ Reverts', description: 'Reverted changes' },
};

/**
 * Ensure required directories exist
 */
function ensureDirectories() {
  try {
    [config.outputDir, config.logsDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`✅ Created directory: ${dir}`);
      }
    });
  } catch (error) {
    console.error('❌ Failed to create directories:', error);
    logError('DIRECTORY_CREATION', error);
    throw error;
  }
}

/**
 * Log error to file
 */
function logError(type, error) {
  try {
    ensureDirectories();
    const timestamp = new Date().toISOString();
    const logFile = path.join(config.logsDir, 'errors.log');
    const logEntry = `[${timestamp}] ${type}: ${error.message}\n${error.stack}\n\n`;
    fs.appendFileSync(logFile, logEntry);
  } catch (e) {
    console.error('Failed to write error log:', e);
  }
}

/**
 * Parse a single commit message
 */
function parseCommit(commitLine) {
  try {
    const [hash, ...messageParts] = commitLine.split('|||');
    const message = messageParts.join('|||').trim();

    // Parse conventional commit format: type(scope): message
    const conventionalRegex = /^(\w+)(?:\(([^)]+)\))?: (.+)$/;
    const match = message.match(conventionalRegex);

    if (match) {
      const [, type, scope, subject] = match;
      return {
        hash: hash.trim(),
        type: type.toLowerCase(),
        scope: scope || null,
        subject: subject.trim(),
        message: message,
        typeInfo: commitTypes[type.toLowerCase()] || { label: '📝 Other', description: 'Other changes' },
      };
    }

    // Fallback for non-conventional commits
    return {
      hash: hash.trim(),
      type: 'other',
      scope: null,
      subject: message,
      message: message,
      typeInfo: { label: '📝 Other', description: 'Other changes' },
    };
  } catch (error) {
    console.error('❌ Failed to parse commit:', commitLine, error);
    logError('COMMIT_PARSE', error);
    return null;
  }
}

/**
 * Get commits between base and head refs
 */
function getCommits() {
  try {
    console.log(`📋 Fetching commits from ${config.baseRef} to ${config.headRef}...`);

    // Get commit list with hash and message
    const gitCommand = `git log ${config.baseRef}..${config.headRef} --pretty=format:"%h|||%s"`;
    const output = execSync(gitCommand, { encoding: 'utf-8' }).trim();

    if (!output) {
      console.log('ℹ️ No commits found in range');
      return [];
    }

    const commitLines = output.split('\n');
    const commits = commitLines
      .map(parseCommit)
      .filter(commit => commit !== null);

    console.log(`✅ Parsed ${commits.length} commits`);
    return commits;
  } catch (error) {
    if (error.message.includes('unknown revision')) {
      console.log('ℹ️ No previous commits to compare (new branch)');
      return [];
    }
    console.error('❌ Failed to get commits:', error);
    logError('GIT_LOG', error);
    throw error;
  }
}

/**
 * Get files changed in commits
 */
function getChangedFiles() {
  try {
    const gitCommand = `git diff --name-status ${config.baseRef}..${config.headRef}`;
    const output = execSync(gitCommand, { encoding: 'utf-8' }).trim();

    if (!output) {
      return { added: [], modified: [], deleted: [] };
    }

    const files = { added: [], modified: [], deleted: [] };
    output.split('\n').forEach(line => {
      const [status, ...fileParts] = line.split('\t');
      const file = fileParts.join('\t');

      if (status.startsWith('A')) files.added.push(file);
      else if (status.startsWith('M')) files.modified.push(file);
      else if (status.startsWith('D')) files.deleted.push(file);
    });

    console.log(`✅ Files changed: ${files.added.length} added, ${files.modified.length} modified, ${files.deleted.length} deleted`);
    return files;
  } catch (error) {
    console.error('❌ Failed to get changed files:', error);
    logError('GIT_DIFF', error);
    return { added: [], modified: [], deleted: [] };
  }
}

/**
 * Get detailed commit statistics
 */
function getCommitStats() {
  try {
    const gitCommand = `git diff --shortstat ${config.baseRef}..${config.headRef}`;
    const output = execSync(gitCommand, { encoding: 'utf-8' }).trim();

    if (!output) {
      return { filesChanged: 0, insertions: 0, deletions: 0 };
    }

    const filesMatch = output.match(/(\d+) files? changed/);
    const insertionsMatch = output.match(/(\d+) insertions?/);
    const deletionsMatch = output.match(/(\d+) deletions?/);

    return {
      filesChanged: filesMatch ? parseInt(filesMatch[1]) : 0,
      insertions: insertionsMatch ? parseInt(insertionsMatch[1]) : 0,
      deletions: deletionsMatch ? parseInt(deletionsMatch[1]) : 0,
    };
  } catch (error) {
    console.error('❌ Failed to get commit stats:', error);
    logError('GIT_STATS', error);
    return { filesChanged: 0, insertions: 0, deletions: 0 };
  }
}

/**
 * Group commits by type
 */
function groupCommitsByType(commits) {
  const grouped = {};

  commits.forEach(commit => {
    if (!grouped[commit.type]) {
      grouped[commit.type] = {
        commits: [],
        typeInfo: commit.typeInfo,
      };
    }
    grouped[commit.type].commits.push(commit);
  });

  return grouped;
}

/**
 * Extract breaking changes from commits
 */
function extractBreakingChanges(commits) {
  return commits.filter(commit => {
    return commit.message.includes('BREAKING CHANGE') ||
           commit.message.includes('!:') ||
           commit.subject.includes('BREAKING');
  });
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log('🤖 Auto-Documentation Bot - Commit Parser');
    console.log('==========================================\n');

    ensureDirectories();

    // Gather commit data
    const commits = getCommits();
    const files = getChangedFiles();
    const stats = getCommitStats();
    const grouped = groupCommitsByType(commits);
    const breakingChanges = extractBreakingChanges(commits);

    // Build data structure
    const data = {
      metadata: {
        branch: config.branchName,
        baseRef: config.baseRef,
        headRef: config.headRef,
        timestamp: new Date().toISOString(),
        commitsCount: commits.length,
      },
      commits,
      grouped,
      files,
      stats,
      breakingChanges,
    };

    // Save to file
    const outputFile = path.join(config.outputDir, 'commits-data.json');
    fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
    console.log(`✅ Saved commit data to ${outputFile}`);

    // Set GitHub Actions output
    if (process.env.GITHUB_OUTPUT) {
      fs.appendFileSync(
        process.env.GITHUB_OUTPUT,
        `commits_data=${JSON.stringify(data)}\n`
      );
    }

    // Summary
    console.log('\n📊 Summary:');
    console.log(`   Commits: ${commits.length}`);
    console.log(`   Files changed: ${stats.filesChanged}`);
    console.log(`   Insertions: +${stats.insertions}`);
    console.log(`   Deletions: -${stats.deletions}`);
    console.log(`   Breaking changes: ${breakingChanges.length}`);

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Fatal error in commit parser:', error);
    logError('MAIN_EXECUTION', error);
    process.exit(1);
  }
}

// Run
main();
