---
name: "markdown-writer"
description: "Creates technical documentation in GitHub Flavored Markdown format. Invoke when user asks to write technical docs, API documentation, user manuals, developer guides, or needs help with Markdown formatting and structure."
---

# Markdown Technical Writer

This skill helps you create well-structured, professional technical documentation using GitHub Flavored Markdown (GFM). It provides templates, best practices, and formatting guidelines for various types of technical documents.

## When to Use This Skill

Use this skill when the user:
- Asks to write technical documentation
- Needs help with API documentation
- Wants to create user manuals or guides
- Requests developer documentation or tutorials
- Asks about Markdown formatting or structure
- Needs help organizing technical content
- Wants to create README files or project documentation

## Document Types Supported

### API Documentation
- Endpoint descriptions
- Request/response formats
- Authentication methods
- Error codes and handling
- Examples and usage patterns

### User Manuals
- Feature descriptions
- Installation guides
- Configuration instructions
- Troubleshooting sections
- FAQ sections

### Developer Guides
- Architecture overviews
- Setup instructions
- Code examples
- Best practices
- Integration guides

### README Files
- Project introduction
- Installation steps
- Usage examples
- Contributing guidelines
- License information

## GitHub Flavored Markdown (GFM) Essentials

### Headers
```markdown
# H1 - Main Title
## H2 - Section Title
### H3 - Subsection Title
#### H4 - Minor Section
```

### Text Formatting
```markdown
**Bold text** for emphasis
*Italic text* for subtle emphasis
~~Strikethrough~~ for deprecated content
`Inline code` for technical terms
```

### Links and Images
```markdown
[Link text](https://example.com)
[Link with title](https://example.com "Hover text")
![Alt text](image.png)
![Alt text](https://example.com/image.png)
```

### Code Blocks
```markdown
\`\`\`javascript
// Syntax highlighting for code
function example() {
  return "Hello";
}
\`\`\`

\`\`\`
// Code block without syntax highlighting
plain text
\`\`\`
```

### Lists
```markdown
- Unordered list item
- Another item
  - Nested item
  - Another nested item

1. Ordered list item
2. Another item
3. Nested item
   - Mixed nesting works
```

### Task Lists
```markdown
- [x] Completed task
- [ ] Incomplete task
- [ ] Another task
```

### Tables
```markdown
| Header 1 | Header 2 | Header 3 |
|-----------|-----------|-----------|
| Cell 1    | Cell 2    | Cell 3    |
| Cell 4    | Cell 5    | Cell 6    |
```

### Blockquotes
```markdown
> Regular blockquote
>
> > Nested blockquote
```

### Horizontal Rules
```markdown
---
***
___
```

## Technical Documentation Structure

### Standard Document Template
```markdown
# [Document Title]

## Overview
Brief description of what this document covers and who it's for.

## Prerequisites
- Requirement 1
- Requirement 2
- Software version X.Y.Z

## Installation/Setup
Step-by-step instructions with code examples.

## Usage
Detailed usage instructions with examples.

## Configuration
Configuration options and their descriptions.

## API Reference
Detailed API documentation if applicable.

## Troubleshooting
Common issues and solutions.

## FAQ
Frequently asked questions.

## References
Links to related documentation.
```

### API Documentation Template
```markdown
# [API Name] API Documentation

## Overview
Brief description of the API and its purpose.

## Authentication
### API Key
Description of how to obtain and use API keys.

### OAuth
OAuth flow description if applicable.

## Endpoints

### GET /api/resource
**Description**: What this endpoint does

**Request Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|-----------|-------------|
| id        | string| Yes       | Resource identifier |
| filter    | string| No        | Filter criteria |

**Response**:
\`\`\`json
{
  "id": "123",
  "name": "Example",
  "created_at": "2024-01-01T00:00:00Z"
}
\`\`\`

**Example**:
\`\`\`bash
curl -X GET "https://api.example.com/resource/123" \\
  -H "Authorization: Bearer YOUR_TOKEN"
\`\`\`

### POST /api/resource
**Description**: Create a new resource

**Request Body**:
\`\`\`json
{
  "name": "New Resource",
  "description": "Description here"
}
\`\`\`

**Response**: Returns the created resource with status 201

**Error Responses**:
| Status Code | Description |
|-------------|-------------|
| 400         | Invalid request |
| 401         | Unauthorized |
| 404         | Not found |
```

### User Manual Template
```markdown
# [Feature Name] User Guide

## Introduction
What this feature does and its benefits.

## Getting Started
Quick start guide for new users.

## Main Features
### Feature 1
Description and usage instructions.

### Feature 2
Description and usage instructions.

## Advanced Usage
Detailed instructions for power users.

## Troubleshooting
### Issue: Problem description
**Solution**: Step-by-step solution

### Issue: Another problem
**Solution**: Step-by-step solution

## FAQ
**Q: Common question?**
A: Detailed answer.
```

## Best Practices for Technical Documentation

### Clarity and Precision
- Use clear, concise language
- Avoid jargon when possible
- Define technical terms when first used
- Be consistent with terminology

### Structure and Organization
- Use logical heading hierarchy
- Group related information together
- Provide table of contents for long documents
- Use consistent formatting throughout

### Examples and Code
- Include working code examples
- Show expected output
- Provide context for examples
- Use syntax highlighting for code blocks

### Accessibility
- Use descriptive alt text for images
- Ensure sufficient color contrast
- Use clear, readable fonts
- Provide text alternatives for diagrams

### Maintenance
- Keep documentation up to date
- Document version changes
- Review and update regularly
- Remove outdated information

## Common Markdown Patterns

### Documenting Code
```markdown
## Code Example

Here's how to use the function:

\`\`\`javascript
const result = processData(data);
console.log(result);
\`\`\`

**Parameters**:
- `data` (object): The input data to process

**Returns**: Processed data object

**Example**:
\`\`\`javascript
const input = { name: "test", value: 42 };
const output = processData(input);
// Output: { name: "test", value: 42, processed: true }
\`\`\`
```

### Documenting Configuration
```markdown
## Configuration Options

| Option | Type | Default | Description |
|---------|------|----------|-------------|
| `port` | integer | 3000 | Server port |
| `host` | string | localhost | Server host |
| `debug` | boolean | false | Enable debug mode |

### Example Configuration

\`\`\`javascript
const config = {
  port: 8080,
  host: "0.0.0.0",
  debug: true
};
\`\`\`
```

### Documenting Errors
```markdown
## Error Handling

### Common Errors

| Error Code | Message | Cause | Solution |
|------------|----------|--------|----------|
| `E001` | Invalid input | Check input format |
| `E002` | Authentication failed | Verify credentials |
| `E003` | Rate limit exceeded | Wait and retry |

### Error Response Format

\`\`\`json
{
  "error": {
    "code": "E001",
    "message": "Invalid input format",
    "details": "Expected JSON object"
  }
}
\`\`\`
```

## Formatting Guidelines

### Code Examples
- Always use language-specific syntax highlighting
- Include comments explaining key parts
- Show both input and expected output
- Keep examples concise but complete

### Tables
- Use tables for structured data
- Include column headers
- Align content properly
- Use tables for parameters, options, configurations

### Links
- Use descriptive link text
- Include external references
- Cross-link related sections
- Verify all links work

### Images and Diagrams
- Use alt text for accessibility
- Keep images reasonably sized
- Use diagrams for complex concepts
- Provide text descriptions for diagrams

## Review Checklist

Before finalizing documentation, ensure:
- [ ] All headings follow proper hierarchy
- [ ] Code blocks have syntax highlighting
- [ ] Links are working and descriptive
- [ ] Tables are properly formatted
- [ ] Images have alt text
- [ ] Technical terms are defined
- [ ] Examples are tested and accurate
- [ ] Document is well-organized
- [ ] Spelling and grammar are correct
- [ ] Version information is included

## Output Format

Always produce GitHub Flavored Markdown that is:
- Compatible with GitHub, GitLab, and other platforms
- Properly formatted with consistent spacing
- Well-structured with clear headings
- Includes appropriate code blocks and syntax highlighting
- Contains working examples and accurate information

## Additional Resources

- [GitHub Flavored Markdown Spec](https://github.github.com/gfm/)
- [Markdown Guide](https://www.markdownguide.org/)
- [Technical Writing Best Practices](https://developers.google.com/tech-writing/one)