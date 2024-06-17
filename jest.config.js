module.exports = {
    testEnvironment: 'node',
    testMatch: ['/src/**/*.spec.js', '**/*.spec.ts'],
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    moduleFileExtensions: ['js', 'ts'],
};
