module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // New feature
        'fix', // Bug fix
        'docs', // Documentation
        'style', // Formatting, missing semicolons, etc.
        'refactor', // Refactoring
        'test', // Adding tests
        'chore', // Maintenance tasks
        'perf', // Performance improvements
        'revert', // Revert changes
      ],
    ],
    'subject-case': [2, 'never', ['upper-case']],
    'type-case': [2, 'always', 'lower-case'],
  },
};
