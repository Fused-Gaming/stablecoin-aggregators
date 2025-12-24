#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Auto-Documentation Bot - Documentation Generator
 *
 * Generates comprehensive documentation from parsed commit data.
 * Creates markdown summaries for PRs, issues, and project documentation.
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
  dataFile: '.github/generated-docs/commits-data.json',
  outputDir: '.github/generated-docs',
  logsDir: '.github/logs',
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
 * Load parsed commit data
 */
function loadCommitData() {
  try {
    console.log(`📂 Loading commit data from ${config.dataFile}...`);

    if (!fs.existsSync(config.dataFile)) {
      throw new Error(`Commit data file not found: ${config.dataFile}`);
    }

    const data = JSON.parse(fs.readFileSync(config.dataFile, 'utf-8'));
    console.log(`✅ Loaded data for ${data.commits.length} commits`);
    return data;
  } catch (error) {
    console.error('❌ Failed to load commit data:', error);
    logError('DATA_LOAD', error);
    throw error;
  }
}

/**
 * Generate markdown documentation
 */
function generateMarkdown(data) {
  try {
    console.log('📝 Generating markdown documentation...');

    let markdown = '';

    // Header
    markdown += `# 📋 Commit Documentation\n\n`;
    markdown += `**Branch:** \`${data.metadata.branch}\`  \n`;
    markdown += `**Generated:** ${new Date(data.metadata.timestamp).toLocaleString()}  \n`;
    markdown += `**Commits:** ${data.metadata.commitsCount}  \n\n`;

    markdown += `---\n\n`;

    // Statistics
    markdown += `## 📊 Statistics\n\n`;
    markdown += `| Metric | Value |\n`;
    markdown += `|--------|-------|\n`;
    markdown += `| Total Commits | ${data.commits.length} |\n`;
    markdown += `| Files Changed | ${data.stats.filesChanged} |\n`;
    markdown += `| Lines Added | +${data.stats.insertions} |\n`;
    markdown += `| Lines Removed | -${data.stats.deletions} |\n`;
    markdown += `| Net Change | ${data.stats.insertions - data.stats.deletions > 0 ? '+' : ''}${data.stats.insertions - data.stats.deletions} |\n`;
    markdown += `\n`;

    // Breaking Changes
    if (data.breakingChanges.length > 0) {
      markdown += `## ⚠️ Breaking Changes\n\n`;
      markdown += `> **Warning:** This update contains ${data.breakingChanges.length} breaking change(s)\n\n`;
      data.breakingChanges.forEach(commit => {
        markdown += `- **${commit.hash}** - ${commit.subject}\n`;
      });
      markdown += `\n`;
    }

    // Commits by Type
    markdown += `## 📝 Changes by Type\n\n`;

    const sortedTypes = Object.keys(data.grouped).sort((a, b) => {
      const order = ['feat', 'fix', 'docs', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'other'];
      return order.indexOf(a) - order.indexOf(b);
    });

    sortedTypes.forEach(type => {
      const group = data.grouped[type];
      markdown += `### ${group.typeInfo.label}\n\n`;
      markdown += `*${group.typeInfo.description}*\n\n`;

      group.commits.forEach(commit => {
        const scope = commit.scope ? `**${commit.scope}**: ` : '';
        markdown += `- ${scope}${commit.subject} ([${commit.hash}](../../commit/${commit.hash}))\n`;
      });

      markdown += `\n`;
    });

    // Files Changed
    markdown += `## 📁 Files Changed\n\n`;

    if (data.files.added.length > 0) {
      markdown += `### ✨ Added (${data.files.added.length})\n\n`;
      data.files.added.slice(0, 20).forEach(file => {
        markdown += `- \`${file}\`\n`;
      });
      if (data.files.added.length > 20) {
        markdown += `- *...and ${data.files.added.length - 20} more*\n`;
      }
      markdown += `\n`;
    }

    if (data.files.modified.length > 0) {
      markdown += `### ✏️ Modified (${data.files.modified.length})\n\n`;
      data.files.modified.slice(0, 20).forEach(file => {
        markdown += `- \`${file}\`\n`;
      });
      if (data.files.modified.length > 20) {
        markdown += `- *...and ${data.files.modified.length - 20} more*\n`;
      }
      markdown += `\n`;
    }

    if (data.files.deleted.length > 0) {
      markdown += `### 🗑️ Deleted (${data.files.deleted.length})\n\n`;
      data.files.deleted.slice(0, 20).forEach(file => {
        markdown += `- \`${file}\`\n`;
      });
      if (data.files.deleted.length > 20) {
        markdown += `- *...and ${data.files.deleted.length - 20} more*\n`;
      }
      markdown += `\n`;
    }

    // All Commits (chronological)
    markdown += `## 🕐 Commit History\n\n`;
    markdown += `<details>\n`;
    markdown += `<summary>View all ${data.commits.length} commits</summary>\n\n`;
    markdown += `| Hash | Type | Message |\n`;
    markdown += `|------|------|----------|\n`;
    data.commits.forEach(commit => {
      const type = commit.typeInfo.label.split(' ')[0];
      markdown += `| [\`${commit.hash}\`](../../commit/${commit.hash}) | ${type} | ${commit.subject} |\n`;
    });
    markdown += `\n</details>\n\n`;

    // Footer
    markdown += `---\n\n`;
    markdown += `*Generated by Auto-Documentation Bot 🤖*\n`;

    return markdown;
  } catch (error) {
    console.error('❌ Failed to generate markdown:', error);
    logError('MARKDOWN_GENERATION', error);
    throw error;
  }
}

/**
 * Generate compact PR comment
 */
function generatePRComment(data) {
  try {
    console.log('💬 Generating PR comment...');

    let comment = '';

    // Header with emoji indicator
    const emoji = data.breakingChanges.length > 0 ? '⚠️' : '✅';
    comment += `## ${emoji} Auto-Generated Documentation\n\n`;

    // Quick stats
    comment += `**Summary:** ${data.commits.length} commit(s) | `;
    comment += `${data.stats.filesChanged} file(s) changed | `;
    comment += `+${data.stats.insertions}/-${data.stats.deletions} lines\n\n`;

    // Breaking changes alert
    if (data.breakingChanges.length > 0) {
      comment += `> ⚠️ **Warning:** This PR contains ${data.breakingChanges.length} breaking change(s)\n\n`;
    }

    // Changes by type (compact)
    comment += `### 📝 Changes\n\n`;

    const sortedTypes = Object.keys(data.grouped).sort();
    sortedTypes.forEach(type => {
      const group = data.grouped[type];
      if (group.commits.length === 0) return;

      const icon = group.typeInfo.label.split(' ')[0];
      comment += `<details>\n`;
      comment += `<summary>${icon} <strong>${group.typeInfo.description}</strong> (${group.commits.length})</summary>\n\n`;

      group.commits.forEach(commit => {
        const scope = commit.scope ? `**${commit.scope}**: ` : '';
        comment += `- ${scope}${commit.subject} (\`${commit.hash}\`)\n`;
      });

      comment += `\n</details>\n\n`;
    });

    // Top changed files
    if (data.stats.filesChanged > 0) {
      comment += `### 📁 Key Files\n\n`;
      const topFiles = [
        ...data.files.added.slice(0, 5).map(f => `✨ \`${f}\` (added)`),
        ...data.files.modified.slice(0, 5).map(f => `✏️ \`${f}\` (modified)`),
        ...data.files.deleted.slice(0, 3).map(f => `🗑️ \`${f}\` (deleted)`),
      ].slice(0, 10);

      topFiles.forEach(file => {
        comment += `- ${file}\n`;
      });

      if (data.stats.filesChanged > 10) {
        comment += `\n*...and ${data.stats.filesChanged - 10} more files*\n`;
      }
      comment += `\n`;
    }

    // Footer
    comment += `---\n`;
    comment += `<sub>🤖 Auto-generated by [commit documentation workflow](../../actions/workflows/auto-document.yml)</sub>\n`;

    return comment;
  } catch (error) {
    console.error('❌ Failed to generate PR comment:', error);
    logError('COMMENT_GENERATION', error);
    throw error;
  }
}

/**
 * Generate summary for GitHub Actions
 */
function generateActionsSummary(data) {
  try {
    let summary = '';

    summary += `## 📋 Commit Documentation Summary\n\n`;
    summary += `### Statistics\n\n`;
    summary += `- **Commits:** ${data.commits.length}\n`;
    summary += `- **Files Changed:** ${data.stats.filesChanged}\n`;
    summary += `- **Lines:** +${data.stats.insertions} / -${data.stats.deletions}\n`;

    if (data.breakingChanges.length > 0) {
      summary += `\n### ⚠️ Breaking Changes\n\n`;
      summary += `This update contains **${data.breakingChanges.length}** breaking change(s)\n`;
    }

    summary += `\n### Changes by Type\n\n`;
    Object.keys(data.grouped).forEach(type => {
      const group = data.grouped[type];
      summary += `- ${group.typeInfo.label}: ${group.commits.length}\n`;
    });

    return summary;
  } catch (error) {
    console.error('❌ Failed to generate actions summary:', error);
    logError('SUMMARY_GENERATION', error);
    throw error;
  }
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log('🤖 Auto-Documentation Bot - Documentation Generator');
    console.log('====================================================\n');

    // Load data
    const data = loadCommitData();

    // Generate documentation
    const fullDocs = generateMarkdown(data);
    const prComment = generatePRComment(data);
    const actionsSummary = generateActionsSummary(data);

    // Save outputs
    const fullDocsFile = path.join(config.outputDir, 'COMMIT_DOCS.md');
    const prCommentFile = path.join(config.outputDir, 'pr-comment.md');
    const summaryFile = path.join(config.outputDir, 'summary.md');

    fs.writeFileSync(fullDocsFile, fullDocs);
    fs.writeFileSync(prCommentFile, prComment);
    fs.writeFileSync(summaryFile, actionsSummary);

    console.log(`✅ Generated full documentation: ${fullDocsFile}`);
    console.log(`✅ Generated PR comment: ${prCommentFile}`);
    console.log(`✅ Generated summary: ${summaryFile}`);

    // Set GitHub Actions outputs
    if (process.env.GITHUB_OUTPUT) {
      // Escape for GitHub Actions output
      const escapedComment = prComment
        .replace(/%/g, '%25')
        .replace(/\n/g, '%0A')
        .replace(/\r/g, '%0D');

      fs.appendFileSync(
        process.env.GITHUB_OUTPUT,
        `documentation<<EOF\n${prComment}\nEOF\n`
      );
    }

    console.log('\n✅ Documentation generation complete!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Fatal error in documentation generator:', error);
    logError('MAIN_EXECUTION', error);
    process.exit(1);
  }
}

// Run
main();
